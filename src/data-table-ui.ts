import {editedTitle,type EditedCells} from './cell-edits.js';
import type {Escape,Workflow,WorkflowNode} from './types.js';
import {PREVIEW_ROWS,scrollLongTables} from './long-tables.js';
import {escapeHtml} from './html-escape.js';
import {presentValue,pairedValue,pairedColumns,headingMarks,noteNumbers,anySuppressed,type TablePresentation} from './table-presentation.js';
import {type OwnInspector,type StepKit} from './inspector-kit.js';
import {describableColumns,isDescribed,dictionaryKeyOf} from './column-metadata.js';
import type {DataTable,DataTableSource,TableSelection} from './data-table.js';
import {dataTable,wideDataTable,keyDomains,findingsSummary,recordsSaid,declaredWide,MAX_TABLE_ROWS,MAX_TABLE_FILE_BYTES,type TableRows} from './data-table.js';
import {parseCSV,readTextFile,isCoordinateColumn} from './input-data.js';
import {readStata,type StataTable} from './stata.js';
import {readXlsx,type Sheet} from './xlsx.js';
import {fetchOrDeviceCopy,tablesInArchive,archiveEntry,asFile,type RemoteTableSource,progressText} from './remote-table.js';
import {contentHash} from './project-files.js';
import {dictionarySheets} from './columns-dialog.js';
import censusCatalogue from '../examples/census-tables/catalogue.json';
import {GAUGES,GAUGES_RAW,gaugeChoices,wireGauges} from './tide-gauges-ui.js';
import {dhis2Markup,wireDhis2} from './dhis2-tab.js';
import {guessMapping,readDictionary,proposeFrom,checkDictionary,sameNames,fileRows,type TableDictionary,type DictionaryCheck,type ColumnDeclarations} from './column-metadata.js';

const FILE_BYTES=MAX_TABLE_FILE_BYTES;
export interface WideChoice {keys:string[]; valueFields:string[]; measureKey:string}
export interface TableImport {data:DataTable; source:DataTableSource; keys:string[]; valueField:string;
  /** The text a short table was typed from, kept so reopening shows it rather than an empty box. */
  typedText?:string;
  /** Where a table read from a service came from, as the step keeps it: DHIS2's server, request and time. */
  provenance?:import('./input-provenance.js').InputProvenance;
  /** In a long read whose value is named otherwise, the file's column it is read from. */
  valueColumn?:string;
  /** Present when the file was fetched from a URL: the spec the project keeps in place of the rows. */
  remote?:RemoteTableSource;
  unit?:string; wide?:WideChoice;
  /** What the file itself says its columns mean (Stata's variable labels), as unconfirmed proposals. */
  proposed?:import('./column-metadata.js').ColumnDeclarations;
  /** THE DATA DICTIONARY IMPORTED WITH IT (experiment 211), and its check against the table. */
  dictionary?:TableDictionary; dictionaryCheck?:DictionaryCheck;
  /** The parsed file, carried only for a wide read, so the node can melt it again on each run. */
  source_table?:{headers:string[];rows:string[][]};
  /** Melt the source table on each run, rather than use the table stored at import. */
  convertOnRun?:boolean;
  /** Key columns whose distinct values the table lists, for a step that needs them as a list. */
  distinctValuesFor?:string[]}
/** THE STANDARD FRAME (experiment 186): the step's name in the heading, and the one setting that lives on the node rather
 *  than in the file -- whether the source is converted on each run -- which can be applied without reading a file again. */
export interface TableFrame {step?:string; convertOnRun?:boolean; hasSource?:boolean; onConvertOnRun?:(on:boolean)=>boolean;
  /** The DHIS2 tokens in Credentials, by name, and one resolved for a server, for the DHIS2 tab. */
  dhis2?:{tokens:()=>{ref:string;label:string;origin:string}[];resolve:(ref:string,origin:string)=>string}}
/** What the editor reopens with. `wide` present means the file was read as wide. */
export interface TableReopen extends TableSelection {wide?:WideChoice; distinctValuesFor?:string[]; valueColumn?:string;
  /** What was typed in the Type or paste tab, where the table was made there. */
  typedText?:string;
  /** Where the table is published, shown in the URL box and the box opened, so a reopened step says where it reads from. */
  remote?:RemoteTableSource}

/** Reads a CSV in either shape, and ASSUMES WIDE on a fresh import.
 *
 *  The practitioner, 2026-10-26: *"We have to assume wide in as default, that's the epidemiology
 *  mindset."* One row per subject and a column per variable is what a case line list, a
 *  surveillance export and a published table all look like. `wideDataTable` was written that day
 *  and wired to nothing -- it had a full test file and no call site in the application, so the
 *  default was a decision recorded in code that no practitioner could reach. Reported on
 *  2026-10-27 as a question: *"I also thought we automatically convert tables to wide format?"*
 *
 *  Both readers stay, because they give OPPOSITE diagnoses of the same file. A repeated key tuple
 *  is the long shape to one and a duplicate subject record to the other, and a flag over one
 *  reader would have to pick a side. So the shape is chosen and the choice is recorded.
 *
 *  AN EXISTING TABLE REOPENS IN THE SHAPE IT WAS READ WITH, never in the new default: a saved
 *  workflow whose table came in long predates this control, and re-reading it as wide would
 *  change the table under a workflow built on it.
 *
 *  Either way the stored table is LONG. Nothing downstream learns a second shape; this is a door,
 *  not a second representation. */
/** The same escape `app.ts` passes into `dataTableMarkup`, kept here so the dialog can render its
 *  own panes without the caller having to hand one in. */
const esc:Escape=escapeHtml;

/** More columns than this and a column list gets tools to find, clear and paste, and a long read starts unticked. */
export const MANY_COLUMNS=12;
/** THE VALUE COLUMN, GUESSED ONLY WHERE THE FILE AGREES (2026-11-20): a column named like a value -- value, amount,
 *  measure, level -- and holding numbers in the rows read. DR Congo's census has "level" (pays, region, ville), which the
 *  name alone took as its value, so Append rows later refused a census beside three population tables. Then the last
 *  column, where it holds numbers; otherwise nothing is guessed, and the dialog asks for the column. */
export function guessValueColumn(headers:readonly string[],rows:readonly (readonly string[])[]):number{
  const numeric=(i:number)=>{let seen=0;
    for(const row of rows){const cell=(row[i]??'').trim();if(cell==='')continue;if(!Number.isFinite(Number(cell.replace(/,/g,''))))return false;if(++seen>=50)break;}
    return seen>0;};
  const named=headers.findIndex((h,i)=>/^(value|value_m|amount|measure|level)$/i.test(h.trim())&&numeric(i));
  if(named>=0)return named;
  // The last column, the long file's usual place for its value, where it holds numbers.
  return headers.length&&numeric(headers.length-1)?headers.length-1:-1;
}
/** How each column list refreshes its summary when it is ticked in code -- a change of shape -- rather than by a person. */
const refreshers=new WeakMap<Element,()=>void>();
/** A LONG COLUMN LIST IS CHOSEN IN A DIALOG OF ITS OWN. The practitioner, 2026-11-04, on NYC's 92 key column checkboxes:
 *  *"This is choice overload"*, and *"I think the table column filtering should be another dialog."* The import dialog
 *  keeps a one-line summary and a button; the list, with find, clear and paste, opens over it. Each action ticks or
 *  unticks in one go and rebuilds once: unticking 87 columns one by one rebuilt a 3,653-row preview 87 times. Pasting
 *  names is what a manual's Copy feeds, and a name the file does not have is said rather than ignored. A short list
 *  stays where it was, inline. */
function columnTools(box:HTMLFieldSetElement,prefix:string,title:string,changed:()=>void):void{
  // HOME FIRST: a file read before may have left the list in its dialog, and this file may be a short one.
  const placeholder=document.getElementById(`${prefix}-summary-row`);
  if(placeholder){placeholder.before(box);placeholder.remove();}
  refreshers.delete(box);
  const boxes=()=>[...box.querySelectorAll<HTMLInputElement>('label > input[type=checkbox]')];
  if(boxes().length<=MANY_COLUMNS)return;
  const ticked=()=>boxes().filter(b=>b.checked).map(b=>b.value.trim());
  const row=document.createElement('div');row.id=`${prefix}-summary-row`;row.className='column-summary';
  box.before(row);
  // Closing the import dialog takes the column dialog with it, so no stale list keeps the same ids in the page.
  row.closest('dialog')?.addEventListener('close',()=>{document.getElementById(`${prefix}-dialog`)?.remove();},{once:true});
  // The summary stands in for the list, so it is hidden whenever the list is: value columns belong to a wide read only.
  const summarise=()=>{const chosen=ticked();row.hidden=box.hidden;
    row.innerHTML=`<span class="field-label">${title}</span><p id="${prefix}-summary">${chosen.length} of ${boxes().length}`
      +(chosen.length?`: ${chosen.map(escapeHtml).join(', ')}`:' ticked')+`</p>`
      +`<button type="button" class="button small" id="${prefix}-choose">Choose ${title.toLowerCase()}…</button>`;
    row.querySelector<HTMLButtonElement>(`#${prefix}-choose`)!.onclick=()=>{dialog!.showModal();};};
  let dialog=document.getElementById(`${prefix}-dialog`) as HTMLDialogElement|null;
  if(!dialog){
    dialog=document.createElement('dialog');dialog.id=`${prefix}-dialog`;dialog.className='column-dialog';
    document.body.append(dialog);
  }
  dialog.innerHTML=`<h2>${title}</h2>`
    +`<label class="field-label" for="${prefix}-paste">Columns to keep, pasted or typed</label>`
    +`<div class="column-tools-row"><input id="${prefix}-paste" placeholder="for example date, o3, pm25">`
    +`<button type="button" class="button small" id="${prefix}-keep">Keep these</button></div>`
    +`<div class="column-tools-row"><input id="${prefix}-find" type="search" placeholder="Find a column…" aria-label="Find a column">`
    +`<button type="button" class="button small" id="${prefix}-none">Untick all</button>`
    +`<label class="check"><input type="checkbox" id="${prefix}-ticked"> Ticked only</label></div>`
    +`<p class="muted" id="${prefix}-count" role="status"></p><div class="column-dialog-list"></div>`
    +`<div class="package-actions"><button type="button" class="button" id="${prefix}-done">Done</button></div>`;
  dialog.querySelector('.column-dialog-list')!.append(box);
  const tools=dialog,say=tools.querySelector<HTMLElement>(`#${prefix}-count`)!;
  const count=()=>{say.textContent=`${ticked().length} of ${boxes().length} ticked.`;summarise();};
  const narrow=()=>{
    const wanted=tools.querySelector<HTMLInputElement>(`#${prefix}-find`)!.value.trim().toLowerCase();
    const tickedOnly=tools.querySelector<HTMLInputElement>(`#${prefix}-ticked`)!.checked;
    for(const b of boxes())(b.parentElement as HTMLElement).hidden=
      (!!wanted&&!b.value.toLowerCase().includes(wanted))||(tickedOnly&&!b.checked);
  };
  tools.querySelector<HTMLInputElement>(`#${prefix}-find`)!.oninput=narrow;
  tools.querySelector<HTMLInputElement>(`#${prefix}-ticked`)!.onchange=narrow;
  tools.querySelector<HTMLButtonElement>(`#${prefix}-none`)!.onclick=()=>{
    for(const b of boxes())if(!b.disabled)b.checked=false;changed();count();narrow();};
  const keep=()=>{
    const names=tools.querySelector<HTMLInputElement>(`#${prefix}-paste`)!.value.split(/[,;\t\n]+/).map(n=>n.trim()).filter(Boolean);
    if(!names.length){say.textContent='Name at least one column.';return;}
    const have=new Set(boxes().map(b=>b.value.trim()));
    for(const b of boxes())if(!b.disabled)b.checked=names.includes(b.value.trim());
    changed();count();narrow();
    const missing=names.filter(n=>!have.has(n));
    if(missing.length)say.textContent+=` Not in this file: ${missing.join(', ')}.`;
  };
  tools.querySelector<HTMLButtonElement>(`#${prefix}-keep`)!.onclick=keep;
  tools.querySelector<HTMLInputElement>(`#${prefix}-paste`)!.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();keep();}};
  tools.querySelector<HTMLButtonElement>(`#${prefix}-done`)!.onclick=()=>dialog!.close();
  for(const b of boxes())b.addEventListener('change',count);
  refreshers.set(box,count);
  // The box's own legend repeats the dialog's heading, so it is hidden while the list is in here.
  const legend=box.querySelector('legend');if(legend)legend.hidden=true;
  count();
}

interface CensusFile {path:string;bytes:number;sha256:string}
interface CensusCountry {iso3:string;country:string;census:string;referenceDate:string;publisher:string;licence:string;rows:number;
  reviewed:{last:string;nextDue:string};counts:CensusFile;columns?:CensusFile;
  /** Where the printed units are not today's, the table offered is summed from them: what it is, and the printed file. */
  derived?:{label:string;printed:string};
  /** The country's other tables offered, one per level, each derived as `derived` says (Nigeria's states, then its LGAs). */
  more?:CensusTable[]}
type CensusTable=Pick<CensusCountry,'rows'|'counts'|'columns'|'derived'>;
const CENSUS=censusCatalogue as {repository:string;commit:string;raw:string;countries:CensusCountry[]};
const CENSUS_RAW='https://raw.githubusercontent.com/digital-twin-ph/census-tables/';
/** HOW MANY ROWS A TYPED TABLE HOLDS. A textarea is for a species list or a lookup, not a census: the practitioner,
 *  2026-11-23, *"The free text CSV is for creating short tables anyway so it need not be complicated."* Said in the
 *  label rather than discovered by pasting something long. */
export const TYPED_ROWS=500;
const TAB_KEY='fieldwork:table-source-tab';
/** DHIS2 ANALYTICS' COLUMNS, as the DHIS2 tab writes them (dhis2-source.ts). */
const DHIS2_DICTIONARY=['variable,label,unit,description',
  'data,Data,,"The data element or indicator, as the server names it"','data_id,Data ID,,"Its ID on the server"',
  'period,Period,,"The period, as the server names it"','period_id,Period ID,,"The period in DHIS2\'s own notation: 2024, 202403, 2024W12"',
  'org_unit,Organisation unit,,"The organisation unit, as the server names it"','org_unit_id,Organisation unit ID,,"Its ID on the server"',
  'value,Value,,"The aggregate value DHIS2\'s analytics give for that data, period and unit"'].join('\n')+'\n';
const AFTER_ROWS=PREVIEW_ROWS;
/** One line per country: what census, how many rows, whose, under what terms, and when it is next reviewed. A table past
 *  its review date is still offered, and says so: an old count stays a count. */
function censusChoices():string{
  const today=new Date().toISOString().slice(0,10);
  return '<p class="muted">From <a href="'+esc(CENSUS.repository)+'" target="_blank" rel="noopener">census-tables</a>, at commit '
    +esc(CENSUS.commit.slice(0,7))+'. Each comes with its data dictionary.</p><ul class="census-choices">'
    +CENSUS.countries.map(c=>'<li>'+(c.more
        // ONE BUTTON PER TABLE where a country offers several: the country's name, then what each holds.
        ?'<p class="census-country">'+esc(c.country)+'</p><p class="census-tables">'+[c,...c.more].map((t,i)=>'<button type="button" class="button" data-census="'
          +esc(c.iso3)+'" data-census-table="'+i+'">'+esc(t.derived?.label??`As printed, ${t.rows.toLocaleString('en')} rows`)+'</button>').join(' ')+'</p>'
          +'<p>'+esc(c.census)+' \u00b7 '+esc(c.publisher)+'</p>'
        :'<button type="button" class="button" data-census="'+esc(c.iso3)+'">'+esc(c.country)+'</button>'
          +'<p>'+esc(c.census)+' \u00b7 '+c.rows.toLocaleString('en')+' rows \u00b7 '+esc(c.publisher)+'</p>')
      +'<p class="muted">Terms: '+esc(c.licence)+'</p>'
      +(c.more?'<p>Each from <a href="'+esc(`${CENSUS.repository}/blob/${CENSUS.commit}/${c.derived!.printed}`)+'" target="_blank" rel="noopener">the counts as printed</a></p>'
      :c.derived?'<p>'+esc(c.derived.label)+', from <a href="'+esc(`${CENSUS.repository}/blob/${CENSUS.commit}/${c.derived.printed}`)
        +'" target="_blank" rel="noopener">the counts as printed</a></p>':'')
      +'<p class="muted">'+(c.reviewed.nextDue&&c.reviewed.nextDue<today?'Review overdue since '+esc(c.reviewed.nextDue):'Next review '+esc(c.reviewed.nextDue))+'</p></li>').join('')
    +'</ul>';
}
export function openTableEditor(onSave:(result:TableImport)=>boolean|Promise<boolean>,existing?:TableReopen,frame:TableFrame={}):void{
  const dialog=document.createElement('dialog');dialog.id='table-dialog';dialog.className='config-dialog';dialog.setAttribute('aria-labelledby','table-title');
  const named=escapeHtml;
  dialog.innerHTML='<header class="config-head"><h2 id="table-title">Tabular data'
    // The step's own name after the widget's, unless it is still the widget's name, as the standard dialog does.
    +(frame.step?.trim()&&frame.step.trim().toLowerCase()!=='tabular data'?`<span class="config-step"> \u00b7 ${named(frame.step)}</span>`:'')+'</h2>'
    +'<button class="config-close" id="table-close" aria-label="Close">\u00d7</button></header><div class="config-body">'
    +'<p>A <strong>wide</strong> CSV is assumed: one row per subject and a column per variable, which is what a line list, a surveillance export and a published table look like. Name the columns that identify the subject and the columns holding values; the rest of the application reads one long table, and this converts. A table has no geometry; latitude and longitude columns, if present, are ordinary columns.</p>'
    // WHERE THE TABLE COMES FROM, as tabs (2026-11-20). The practitioner: "Perhaps in the tabular input config dialog we can add
    // tabs, with one for census tables". Everything below the tabs is the same whichever one the table came through.
    +'<div class="result-switch table-source-tabs" role="tablist" aria-label="Where the table comes from">'
    +'<button type="button" role="tab" id="table-tab-file" data-table-tab="file" aria-controls="table-file-part">Your file</button>'
    +'<button type="button" role="tab" id="table-tab-remote" data-table-tab="remote" aria-controls="table-remote">From an address</button>'
    +'<button type="button" role="tab" id="table-tab-census" data-table-tab="census" aria-controls="table-census-part">Census tables</button>'
    +'<button type="button" role="tab" id="table-tab-gauges" data-table-tab="gauges" aria-controls="table-gauges-part">Tide gauges</button>'
    +'<button type="button" role="tab" id="table-tab-dhis2" data-table-tab="dhis2" aria-controls="table-dhis2-part">DHIS2</button>'
    // A SHORT TABLE NOBODY PUBLISHED (2026-11-23). The practitioner, composing a species list to join against a larger
    // table: *"What if we make the CSV editor a free text so I can type columns and rows?"* and *"The free text CSV is
    // for creating short tables anyway so it need not be complicated."* Every other tab fetches from somewhere, so a
    // list you compose yourself had to be made outside Fieldwork and imported -- the one step of such a workflow that
    // leaves the browser. Free text, because what you type IS the format: nothing is hidden behind a widget, and a
    // paste from a spreadsheet works the same way as typing.
    +'<button type="button" role="tab" id="table-tab-typed" data-table-tab="typed" aria-controls="table-typed-part">Type or paste</button></div>'
    +'<section id="table-file-part" role="tabpanel" aria-labelledby="table-tab-file">'
    +'<label class="field-label" for="table-file">CSV, Excel or Stata file (up to '+FILE_BYTES/1e6+' MB, '+MAX_TABLE_ROWS.toLocaleString()+' rows)</label><input id="table-file" type="file" accept=".csv,text/csv,.xlsx,.dta">'
    // ONLY FOR A FILE OF YOUR OWN (2026-11-20): a census table brings its dictionary, and a table from an address can be
    // given one in Describe columns. The practitioner: "we do not need the file picker section" there.
    // ITS DATA DICTIONARY, imported with it (the practitioner, 2026-11-13: "importable and viewable with the table input
    // that first imports the two"). Kept by the project; what it says each column means is proposed, not applied.
    +'<label class="field-label" for="table-dictionary-file">Its data dictionary, if it has one: CSV, Excel or Stata, one row per variable</label>'
    +'<input id="table-dictionary-file" type="file" accept=".csv,text/csv,.xlsx,.dta"><p id="table-dictionary-says" class="muted" role="status"></p>'
    // AN EXCEL WORKBOOK'S SHEET (the practitioner, 2026-11-08: "Yes add Excel"). Shown only for a workbook of several.
    +'<div id="table-sheet-row" hidden><label class="field-label" for="table-sheet">Sheet</label><select id="table-sheet"></select></div>'
    +'<p id="table-workbook" class="muted" hidden></p></section>'
    +'<section id="table-typed-part" role="tabpanel" aria-labelledby="table-tab-typed" hidden>'
    +`<label class="field-label" for="table-typed">Columns and rows: a header row first, then one row per record (at most ${TYPED_ROWS.toLocaleString('en')})</label>`
    +'<textarea id="table-typed" rows="9" spellcheck="false" placeholder="species,family,note\nEidolon helvum,Pteropodidae,\nMops condylurus,Molossidae,"></textarea>'
    +'<p id="table-typed-says" class="muted" role="status"></p>'
    +'<p><button type="button" id="table-typed-save" class="button small" disabled>Save as CSV</button>'
    +' <span class="muted">Saves the table as Fieldwork read it, so the file reads back the same way.</span></p>'
    // WHAT IS STILL THE PRACTITIONER'S TO SAY. A table typed here has no file and no authority behind it but the
    // person who wrote it, and the licence of their own rows is not something this step can assume. It says so
    // rather than filling a source in on their behalf.
    +'<p class="description">A table typed here has no source of its own. Say where the values came from, and under '
    +'what licence, in <strong>Describe columns</strong>: the receipt records that these rows were entered by hand, '
    +'and nothing else about them is claimed.</p>'
    +'<div id="table-typed-preview"></div></section>'
    // OR FROM WHERE IT IS PUBLISHED. The project then keeps the URL and the file's digest, and an export carries no
    // rows: another device fetches the same file when it opens. Experiment 170.
    +'<section id="table-remote" role="tabpanel" aria-labelledby="table-tab-remote" hidden>'
    +'<label class="field-label" for="table-url">URL of a CSV, Stata file or zip</label><input id="table-url" type="url" placeholder="https://">'
    +'<button type="button" id="table-fetch" class="button">Fetch</button>'
    +'<label class="field-label" for="table-entry" hidden>File inside the archive</label><select id="table-entry" hidden></select>'
    +'<p class="muted">The project keeps where it came from, not the rows, so a shared project does not republish it.</p></section>'
    // THE CENSUS TABLES, pinned at a commit of digital-twin-ph/census-tables: each country's counts and its data dictionary.
    +'<section id="table-census-part" role="tabpanel" aria-labelledby="table-tab-census" hidden>'+censusChoices()+'<p id="table-census-says" class="muted" role="status"></p></section>'
    // THE TIDE GAUGES, pinned at a commit of digital-twin-ph/coastal-sea-level: each country's index of its gauges.
    +'<section id="table-gauges-part" role="tabpanel" aria-labelledby="table-tab-gauges" hidden>'+gaugeChoices(esc)+'<p id="table-gauges-says" class="muted" role="status"></p></section>'
    // A DHIS2 SERVER'S ANALYTICS, with a token from Credentials.
    +'<section id="table-dhis2-part" role="tabpanel" aria-labelledby="table-tab-dhis2" hidden>'+dhis2Markup(esc)+'</section>'
    +'<label class="field-label" for="table-shape">Shape of the file</label><select id="table-shape">'
    +'<option value="wide">Wide \u00b7 one row per subject, a column per variable</option>'
    +'<option value="long">Long \u00b7 one row per observation, one value column</option></select>'
    // THE ALERT, not a silent switch. The practitioner, 2026-10-27: "Table input should alert the
    // user if table is in long format and confirm to convert." Detected rather than guessed, and
    // acted on only by the button: reading a file in the other shape changes what every
    // downstream step sees, and this application does not make that choice for anybody.
    +'<div id="table-shape-alert" class="notice" hidden role="alert"><p id="table-shape-says"></p>'
    +'<button id="table-shape-accept" class="button" type="button"></button></div>'
    +'<fieldset id="table-keys" hidden><legend>Key columns</legend><p class="muted" id="table-keys-says"></p></fieldset>'
    +'<fieldset id="table-key-roles" hidden></fieldset>'
    // A COLUMN'S VALUES AS A LIST, asked for where the file enters (experiment 115, P3). Assign projection site reads its
    // sites from here, and until 2026-11-09 only code could ask: a workflow built in the application refused to run.
    +'<fieldset id="table-distinct" hidden><legend>List the distinct values of</legend><p class="muted">For a step that '
    +'needs a column\u2019s values as a list, such as the sites Assign projection site assigns against.</p>'
    +'<div id="table-distinct-boxes"></div></fieldset>'
    +'<fieldset id="table-values" hidden><legend>Value columns</legend><p class="muted">The variables to take. Named rather than inferred, so a column the file gains later is absent from this analysis by decision rather than by accident.</p></fieldset>'
    +'<div id="table-long-value"><label class="field-label" for="table-value">Value column</label><select id="table-value" disabled></select>'
    +'<label class="field-label" for="table-long-value-name">Name for the value column</label><input id="table-long-value-name" maxlength="40" placeholder="its column\u2019s own name"></div>'
    +'<div id="table-wide-names" hidden><label class="field-label" for="table-measure-key">Name for the column holding the variable names</label><input id="table-measure-key" maxlength="40" value="measure">'
    +'<label class="field-label" for="table-value-name">Name for the column holding variable values</label><input id="table-value-name" maxlength="40" value="value">'
    +'<p class="muted">Both are your words, because every downstream step names them: a Rate takes its measure key, and a derived value names two of its values.</p></div>'
    +'<label class="field-label" for="table-unit">Unit of the value</label><input id="table-unit" maxlength="40" placeholder="for example metre; leave empty if unstated">'
    +'<p id="table-unit-from" class="muted" hidden></p>'
    +'<p class="muted">A unit is recorded as you state it and is never inferred from the file. An empty value cell is kept as unknown and counted, never read as zero.</p>'
    // CONVERT ON RUN, a setting of the step: a melt done once here leaves nothing behind, a melt done by the run is a
    // step with a receipt naming every column taken (the practitioner, 2026-10-27).
    +`<label class="check" id="table-convert-row"${frame.hasSource?'':' hidden'}><input id="table-convert-on-run" type="checkbox"${frame.convertOnRun?' checked':''}> `
    +'Convert the source table on each run</label>'
    +'<p class="muted" id="table-convert-says"'+(frame.hasSource?'':' hidden')+'>The file is kept as published and melted when the workflow runs, so the run\u2019s receipt names the columns it took. Unchecked, the table stored at import is used.</p>'
    +'<p id="table-status" role="status"></p>'
    // SHOWN, NOT FOLDED AWAY, AND NOT A SERIALISATION. This was a collapsed <details> holding
    // `JSON.stringify({sourceFile, readAs, subjectKeys, ...})`. The practitioner, 2026-10-27:
    // *"Epidemiologists will not open a JSON blob, that's friction for them."* At the moment a
    // file enters -- which the same conversation names as the most consequential point there is,
    // *"data quality is the most consequential upstream lever"* -- the application was showing a
    // description of its own reading instead of the practitioner's rows.
    +'<div id="table-check" hidden>'
    +'<h3 class="field-label">Before \u00b7 the file as published</h3>'
    +'<div id="table-before"></div>'
    +'<h3 class="field-label">After \u00b7 the table this will import</h3>'
    +'<div id="table-after"></div>'
    +'<ul id="table-reconcile" class="muted"></ul>'
    +'</div>'
    +'</div><div class="config-message-slot"><p id="table-error" class="config-message config-message-refusal" role="alert" hidden></p></div>'
    +'<footer class="config-foot"><button id="table-cancel" class="button">Cancel</button><button id="table-save" class="button primary" disabled>Apply</button></footer>';
  document.body.append(dialog);
  const q=<T extends HTMLElement>(id:string)=>dialog.querySelector<T>(id)!;
  const fileInput=q<HTMLInputElement>('#table-file'),keysBox=q<HTMLFieldSetElement>('#table-keys'),valueSelect=q<HTMLSelectElement>('#table-value');
  const shapeSelect=q<HTMLSelectElement>('#table-shape'),valuesBox=q<HTMLFieldSetElement>('#table-values');
  const longValue=q<HTMLElement>('#table-long-value'),wideNames=q<HTMLElement>('#table-wide-names');
  const measureKeyInput=q<HTMLInputElement>('#table-measure-key'),valueNameInput=q<HTMLInputElement>('#table-value-name');
  const keysSays=q<HTMLElement>('#table-keys-says');
  const shapeAlert=q<HTMLElement>('#table-shape-alert'),shapeSays=q<HTMLElement>('#table-shape-says');
  const shapeAccept=q<HTMLButtonElement>('#table-shape-accept');
  const unitInput=q<HTMLInputElement>('#table-unit'),status=q<HTMLElement>('#table-status'),unitFrom=q<HTMLElement>('#table-unit-from');
  // THE UNIT FROM THE DATA DICTIONARY (2026-11-20), where the person has not given one: DR Congo's census unit was typed
  // by hand, or left out, though its dictionary states it. Filled while the person has not typed one, and said.
  let unitTyped=!!existing?.unit;
  const dictionaryUnit=(columns:readonly string[]):string|undefined=>{
    const sheet=dictionaryFile?.sheets[0];if(!sheet||!columns.length)return undefined;
    const entries=readDictionary(sheet.headers,sheet.rows,guessMapping(sheet.headers));
    const units=new Set(columns.map(c=>entries.get(c.trim())?.unit?.trim()??''));
    const [only]=[...units];return units.size===1&&only?only:undefined;
  };
  const sheetRow=q<HTMLElement>('#table-sheet-row'),sheetSelect=q<HTMLSelectElement>('#table-sheet'),workbookSays=q<HTMLElement>('#table-workbook');
  const check=q<HTMLElement>('#table-check'),beforePane=q<HTMLElement>('#table-before');
  const afterPane=q<HTMLElement>('#table-after'),reconcile=q<HTMLElement>('#table-reconcile');
  // AFTER: THE ROWS AS STORED, then the same table as a crosstab, labelled (2026-11-20). The crosstab alone showed a long
  // table as a grid it is not, so what the step holds, one row per key and value, was never seen before Apply.
  const showAfter=(table:DataTable)=>{
    const shown=table.rows.slice(0,AFTER_ROWS),cols=[...table.keys,table.valueField];
    afterPane.innerHTML=`<p class="table-meta"><strong>As stored:</strong> ${table.rowCount.toLocaleString('en')} rows, one per `
      +`${table.keys.map(k=>esc(k)).join(' and ')}, each with its ${esc(table.valueField)}.</p>`
      +'<div class="table-scroll"><table class="after-long"><thead><tr>'+cols.map(c=>`<th scope="col">${esc(c)}</th>`).join('')+'</tr></thead><tbody>'
      +shown.map(r=>'<tr>'+table.keys.map(k=>`<td>${esc(r.key[k]??'')}</td>`).join('')
        +`<td>${r.value===null?'<span class="muted">unknown</span>':esc(String(r.value))}</td></tr>`).join('')+'</tbody></table></div>'
      +(table.rowCount>shown.length?`<p class="muted">${shown.length} of ${table.rowCount.toLocaleString('en')} rows shown.</p>`:'')
      +'<details class="after-crosstab"><summary>The same table as a crosstab</summary><div data-after-crosstab></div></details>';
    // THE CROSSTAB IS DRAWN WHEN OPENED (2026-11-21): a page of up to 1,000 rows, drawn on every redraw while closed,
    // held WebKit for seconds on the Salmonella study's 82 columns, and a test's choice never landed.
    const host=afterPane.querySelector<HTMLElement>('[data-after-crosstab]')!,section=afterPane.querySelector<HTMLDetailsElement>('.after-crosstab')!;
    const draw=()=>{if(host.childElementCount)return;host.innerHTML=dataTableMarkup(table,esc,{pageSize:PREVIEW_ROWS});
      wireTablePages(host,table,esc,{pageSize:PREVIEW_ROWS});scrollLongTables(host);};
    section.addEventListener('toggle',()=>{if(section.open)draw();});
    scrollLongTables(afterPane);
  };
  const error=q<HTMLElement>('#table-error'),save=q<HTMLButtonElement>('#table-save'),cancel=q<HTMLButtonElement>('#table-cancel');
  if(existing?.unit)unitInput.value=existing.unit;
  const distinctBox=q<HTMLFieldSetElement>('#table-distinct'),distinctBoxes=q<HTMLElement>('#table-distinct-boxes');
  let distinctChosen=new Set(existing?.distinctValuesFor??[]);
  const renderDistinct=(keys:string[])=>{
    distinctBox.hidden=!keys.length;
    // THE COLUMN A WIDE READ MAKES, SAID AS SUCH (2026-11-20): "measure" stood among the file's columns as if it were one.
    const made=shape()==='wide'?(measureKeyInput.value.trim()||'measure'):undefined;
    distinctBoxes.innerHTML=keys.map(k=>`<label class="check"><input type="checkbox" value="${esc(k)}"${distinctChosen.has(k)?' checked':''}> ${esc(k)}`
      +(k===made?' <span class="muted">(made by this read: the names of the value columns taken)</span>':'')+'</label>').join('');
  };
  distinctBoxes.onchange=()=>{
    distinctChosen=new Set([...distinctBoxes.querySelectorAll<HTMLInputElement>('input:checked')].map(b=>b.value));
    if(result){const keys=result.keys.filter(k=>distinctChosen.has(k));
      if(keys.length)result.distinctValuesFor=keys;else delete result.distinctValuesFor;}
  };
  // AN EXISTING TABLE REOPENS IN ITS OWN SHAPE. A workflow saved before this control came in has
  // no `wide` block and was read long; re-reading it as wide would change the table under
  // whatever was built on it.
  shapeSelect.value=existing?(existing.wide?'wide':'long'):'wide';
  if(existing?.wide){measureKeyInput.value=existing.wide.measureKey;valueNameInput.value=existing.valueField;}
  let stata:StataTable|undefined;
  let dictionaryFile:{name:string;bytes:Uint8Array;sheets:Sheet[]}|undefined;
  const dictionaryInput=q<HTMLInputElement>('#table-dictionary-file'),dictionarySays=q<HTMLElement>('#table-dictionary-says');
  let dictionaryFromCensus=false;
  /** THE PERIOD A CHOSEN CENSUS REFERS TO (experiment 230), carried onto the table so the steps after it can compare
   *  years with something the statistics office published rather than with a label somebody typed. Held beside
   *  `dictionaryFromCensus` because it is census state and is dropped wherever that is: a file chosen afterwards is
   *  not the census, and must not inherit its date. */
  let censusPeriod:import('./reference-period.js').ReferencePeriod|undefined;
  dictionaryInput.onchange=async()=>{
    const chosen=dictionaryInput.files?.[0];dictionaryFile=undefined;dictionaryFromCensus=false;dictionarySays.textContent='';
    if(!chosen)return;
    try{
      const bytes=new Uint8Array(await chosen.arrayBuffer()),sheets=dictionarySheets(chosen.name,bytes);
      const first=sheets[0];
      if(!first?.headers.length)throw new Error(`${chosen.name} holds no table to read.`);
      dictionaryFile={name:chosen.name,bytes,sheets};
      dictionarySays.textContent=`${first.rows.length} variables in ${chosen.name}${sheets.length>1?`, the first of ${sheets.length} sheets`:''}. Kept with the table; what it says is proposed for you to accept.`;
      // A DICTIONARY CHOSEN AFTER ITS TABLE proposes the values again (2026-11-21): the columns it gives a unit.
      if(parsed&&shape()==='wide'&&!own?.wide){preselect();syncValueBoxes();refreshers.get(keysBox)?.();refreshers.get(valuesBox)?.();build();}
    }catch(e){dictionarySays.textContent=e instanceof Error?e.message:String(e);}
  };
  let sheets:Sheet[]|undefined,sheet:Sheet|undefined;
  let file:File|undefined,text='',parsed:ReturnType<typeof parseCSV>|undefined,result:TableImport|undefined,busy=false,serial=0;
  const shape=()=>shapeSelect.value==='wide'?'wide':'long';
  const fail=(e:unknown)=>{error.textContent=e instanceof Error?e.message:String(e);error.hidden=false;save.disabled=true;result=undefined;error.scrollIntoView({block:'nearest'});};
  const chosenKeys=()=>[...keysBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked')].map(box=>box.value);
  const chosenValues=()=>[...valuesBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked')].map(box=>box.value);

  /** WHETHER THE FILE IS ACTUALLY LONG, decided from the file and the chosen subject keys rather
   *  than from a failed read.
   *
   *  A wide file has one row per subject, so the subject keys identify a row. A long file repeats
   *  them -- one row per subject per measure -- and that repetition is the whole signature. Asked
   *  here instead of catching `wideDataTable`'s refusal, because matching an error's prose is a
   *  test of the wording and this is a test of the data.
   *
   *  Reported rather than acted on: the button converts, and only the button. */
  const longSignature=(keys:string[]):{repeats:number;example:string}|undefined=>{
    if(!parsed||!keys.length)return undefined;
    const index=(name:string)=>parsed!.headers.map(h=>h.trim()).indexOf(name);
    const at=keys.map(index);
    if(at.some(i=>i<0))return undefined;
    const seen=new Map<string,number>();
    let repeats=0,example='';
    parsed.rows.forEach((row,position)=>{
      const signature=at.map(i=>(row[i]??'').trim()).join('\u0000');
      const earlier=seen.get(signature);
      if(earlier===undefined){seen.set(signature,position);return;}
      repeats++;
      if(!example)example=keys.map((name,i)=>`${name}=${(row[at[i]]??'').trim()}`).join(', ');
    });
    return repeats?{repeats,example}:undefined;
  };

  /** THE FILE AS PUBLISHED: its own headers, its own cells, nothing coerced.
   *
   *  Deliberately NOT rendered like the After pane. The two panes are a comparison, and a
   *  comparison between two identical renderings hides the thing it exists to show -- a measure
   *  that came out under the wrong name, a variable that was merged with another, a column that
   *  was never taken. So this is the file as a reader of the file would see it, and the other is
   *  the table as an epidemiologist reads a table.
   *
   *  Every column carries its ROLE, because the one failure nobody notices is a column quietly
   *  left behind: value columns are named rather than inferred, so a column the file has and the
   *  selection does not is dropped by decision and said so here. */
  const SHOWN_ROWS=PREVIEW_ROWS;
  function renderBefore(keys:string[],valueFields:string[]):string[]{
    if(!parsed||!file)return [];
    const headers=parsed.headers.map(h=>h.trim());
    const role=(name:string)=>keys.includes(name)?'key':valueFields.includes(name)?'value':'untaken';
    const label={key:'subject',value:'variable',untaken:'not taken'} as const;
    const shown=parsed.rows.slice(0,SHOWN_ROWS);
    beforePane.innerHTML=
      `<div class="table-meta muted">${esc(file.name)} \u00b7 ${parsed.rows.length.toLocaleString()} `
      +`row${parsed.rows.length===1?'':'s'} \u00b7 ${headers.length} columns</div>`
      +'<div class="table-scroll"><table><thead><tr>'
      +headers.map(h=>`<th scope="col" class="role-${role(h)}">${esc(h)}`
        +`<span class="muted role-note">${label[role(h)]}</span></th>`).join('')
      +'</tr></thead><tbody>'
      +shown.map(row=>'<tr>'+headers.map((h,i)=>
        `<td class="role-${role(h)}">${esc((row[i]??'').trim())}</td>`).join('')+'</tr>').join('')
      +'</tbody></table></div>'
      +(parsed.rows.length>shown.length
        ?`<p class="muted">${shown.length} of ${parsed.rows.length.toLocaleString()} rows shown.</p>`
        :'');
    scrollLongTables(beforePane);
    return headers.filter(h=>role(h)==='untaken');
  }

  /** WHICH KEY COLUMNS IDENTIFY A ROW, the practitioner's judgement. Experiment 164. */
  const rolesBox=q<HTMLElement>('#table-key-roles');
  const roleOf=(name:string)=>rolesBox.querySelector<HTMLSelectElement>(`select[data-key-role="${CSS.escape(name)}"]`)?.value??'';
  function renderRoles(keys:string[]){
    const held=Object.fromEntries(keys.map(name=>[name,roleOf(name)||(existing?.primaryKey?.includes(name)?'primary'
      :existing?.secondaryKeys?.includes(name)?'secondary':'')]));
    rolesBox.hidden=!keys.length;
    rolesBox.innerHTML='<legend>What identifies a row?</legend>'
      +'<p class="muted">A primary key is unique. A secondary key groups or links rows and may repeat. Leave a column as neither if it is a value such as an answer.</p>'
      +keys.map(name=>`<label class="field">${esc(name)} <select data-key-role="${esc(name)}">`
        +[['','Neither'],['primary','Primary key'],['secondary','Secondary key']].map(([value,label])=>
          `<option value="${value}"${held[name]===value?' selected':''}>${label}</option>`).join('')
        +'</select></label>').join('');
  }
  const declaredRoles=(keys:string[])=>({primaryKey:keys.filter(k=>roleOf(k)==='primary'),
    secondaryKeys:keys.filter(k=>roleOf(k)==='secondary')});

  /** What the reading claims, as arithmetic a reader can check against the two panes rather than
   *  as a sentence they have to trust. */
  function renderReconcile(lines:string[]){
    reconcile.innerHTML=lines.map(line=>`<li>${line}</li>`).join('');
    check.hidden=false;
  }

  function build(){
    error.hidden=true;result=undefined;save.disabled=true;shapeAlert.hidden=true;
    if(!file||!parsed)return;
    const wide=shape()==='wide';
    if(!unitTyped){
      const stated=parsed?dictionaryUnit(shape()==='wide'?chosenValues():[valueSelect.value].filter(Boolean)):undefined;
      unitInput.value=stated??'';
      unitFrom.hidden=!stated;unitFrom.textContent=stated?`From the data dictionary, ${dictionaryFile!.name}. Change it if it says otherwise.`:'';
    }
    const unit=unitInput.value.trim();
    try{
      const keys=chosenKeys();
      renderRoles(keys);
      const roles=declaredRoles(keys);
      let table:DataTable,imported:TableImport;
      if(wide){
        const valueFields=chosenValues();
        const measureKey=measureKeyInput.value.trim()||'measure';
        const valueField=valueNameInput.value.trim()||'value';
        // THE ALERT. Raised before the read, so the practitioner meets the diagnosis rather than
        // `wideDataTable`'s refusal, and with the one action that resolves it.
        // TWO SIGNATURES OF A LONG FILE, and the second was missing until a browser test caught
        // it on the sea-level extract.
        //
        // The first is a repeated subject: a wide file has one row per subject, a long one
        // repeats it. The second is subtler and commoner -- A WIDE TABLE HAS A COLUMN PER
        // VARIABLE, so taking exactly ONE value column is not reading it as wide at all. It
        // produces the same rows the long reader would, plus a measure column holding one
        // distinct value, which is a key that carries no information.
        //
        // The sea-level extract is exactly that shape: psgc_code, scenario, year and quantile
        // are unique TOGETHER, so no subject repeats and the first signature stays silent, while
        // `value_m` is the only column left. Read as wide it imports with a fifth key column
        // nobody asked for. Found 2026-10-27 by `data-table.browser.mjs`, which had encoded the
        // old reading and failed on the new one -- the test was right and the detection was thin.
        const repeated=longSignature(keys);
        const oneValue=valueFields.length===1&&!repeated;
        if(repeated||oneValue){
          if(oneValue&&!repeated){
            // ONE VALUE COLUMN IS ADVICE TOO, NOT A REFUSAL (2026-11-20), as repeats became on 2026-11-06. DR Congo's census
            // read wide with "total" alone, its value named "population" to stack beside three population tables, was
            // refused here with nothing said in the step, and only "value" over three columns could be applied.
            shapeSays.textContent=`This file looks like it is already in LONG format. A wide table `
              +`has a column per variable, and only one column here is left to be a value `
              +`(${valueFields[0]}), so reading it as wide adds a "${measureKey}" column `
              +`holding one value. Read it as long, or keep it wide to name the value yourself.`;
            shapeAccept.textContent='Read it as long instead';
            shapeAlert.hidden=false;
          }
        }
        // REPEATS ARE ADVICE, NOT A REFUSAL. Repeated subjects usually mean the file is long, and the button says so.
        // But a wide file can repeat a subject because the source has a fault: DATASET_MULTIMODAL_V8 has one week twice
        // for every Rio de Janeiro municipality, 92 of 4,876 rows, and refusing the wide read refused the file
        // (2026-11-06). The wide reader keeps each repeat and reports it in Data quality as a duplicate record.
        if(repeated){
          shapeSays.textContent=`This file may already be in LONG format. `
            +`${repeated.repeats.toLocaleString()} row${repeated.repeats===1?'':'s'} repeat a subject that `
            +`${keys.length===1?'the key column':'the key columns'} should identify once -- for example `
            +`${repeated.example}. If the file is long, read it as long. Read as wide, every row is kept and `
            +`each repeat is reported in Data quality as a duplicate record.`;
          shapeAccept.textContent='Read it as long instead';
          shapeAlert.hidden=false;
        }
        table=wideDataTable(parsed,{keys,valueFields,measureKey,valueField,...roles,...(unit?{unit}:{})});
        imported={data:table,...(file.name==='typed.csv'?{typedText:typed.value}:{}),
          source:{filename:file.name,bytes:file.size,sha256:'',rows:table.rowCount,
            ...(file.name==='typed.csv'?{typed:true as const}:{})},
          keys:table.keys,valueField,...(unit?{unit}:{}),wide:{keys,valueFields,measureKey},
          source_table:{headers:parsed.headers.map(h=>h.trim()),rows:parsed.rows}};
        const untaken=renderBefore(keys,valueFields);
        showAfter(table);
        renderReconcile([
          `<strong>${parsed.rows.length.toLocaleString()} subjects \u00d7 ${valueFields.length} `
            +`variable${valueFields.length===1?'':'s'} = `
            +`${table.rowCount.toLocaleString()} cells</strong>, which is what the table above holds.`,
          table.missingValueCount
            ?`${table.missingValueCount.toLocaleString()} cells are empty in the file and are kept `
              +'as unknown. They are never read as zero.'
            :'No cell is empty.',
          untaken.length
            ?`<strong>Not taken:</strong> ${untaken.map(h=>esc(h)).join(', ')}. `
              +'These columns stay in the file and are absent from the analysis.'
            :'Every column in the file is taken as a subject or a variable.',
          `The variables are named <strong>${esc(measureKey)}</strong> and their values `
            +`<strong>${esc(valueField)}</strong>. Every later step uses those words.`,
          unit?`The value is in ${esc(unit)}, as you stated it.`
            :'<strong>No unit stated.</strong> It is recorded as unstated, never guessed.']);
        status.textContent=`${parsed.rows.length} subjects \u00d7 ${valueFields.length} value `
          +`column${valueFields.length===1?'':'s'} = ${table.rowCount} rows, `
          +`${table.missingValueCount} values absent.`;
      }else{
        const valueField=valueSelect.value;
        if(!valueField){status.textContent='Choose the value column: the one holding the numbers.';save.disabled=true;return;}
        const valueAs=q<HTMLInputElement>('#table-long-value-name').value.trim();
        table=dataTable(parsed,{keys,valueField,...(valueAs&&valueAs!==valueField?{valueAs}:{}),...roles,...(unit?{unit}:{})});
        imported={data:table,...(file.name==='typed.csv'?{typedText:typed.value}:{}),
          source:{filename:file.name,bytes:file.size,sha256:'',rows:table.rowCount,
            ...(file.name==='typed.csv'?{typed:true as const}:{})},
          keys,valueField:table.valueField,...(table.valueField!==valueField?{valueColumn:valueField}:{}),...(unit?{unit}:{})};
        const untaken=renderBefore(keys,[valueField]);
        showAfter(table);
        const domains=keyDomains(table);
        renderReconcile([
          `<strong>${table.rowCount.toLocaleString()} rows</strong> read as they stand: this file `
            +'is already long, so nothing was melted.',
          Object.entries(domains).map(([k,v])=>`${esc(k)}: ${v.length.toLocaleString()} distinct`)
            .join(' \u00b7 ')||'No key columns.',
          table.missingValueCount
            ?`${table.missingValueCount.toLocaleString()} values are absent and kept as unknown.`
            :'No value is absent.',
          untaken.length
            ?`<strong>Not taken:</strong> ${untaken.map(h=>esc(h)).join(', ')}.`
            :'Every column in the file is taken.',
          unit?`The value is in ${esc(unit)}, as you stated it.`
            :'<strong>No unit stated.</strong> It is recorded as unstated, never guessed.']);
        status.textContent=`${table.rowCount} rows, ${Object.keys(table.rows[0]?.key??{}).length} key columns, ${table.missingValueCount} values absent.`;
      }
      result=imported;
      if(serviceProvenance)result.provenance=serviceProvenance;
      renderDistinct(imported.keys);
      {const keys=imported.keys.filter(k=>distinctChosen.has(k));if(keys.length)result.distinctValuesFor=keys;}
      save.disabled=false;
      // A wide read keeps the file as published, so it can be converted on each run.
      const melts=!!imported.source_table;
      q<HTMLElement>('#table-convert-row').hidden=!melts&&!frame.hasSource;
      q<HTMLElement>('#table-convert-says').hidden=!melts&&!frame.hasSource;
    }catch(e){
      // A REFUSED READ SHOWS NO TABLE (2026-11-20): the last read's "After" stayed beside the refusal, so a table appeared
      // importable that was not. "Before" shows the choices as they now stand.
      afterPane.innerHTML='<p class="notice">Nothing to import while the message below stands.</p>';reconcile.innerHTML='';
      try{renderBefore(chosenKeys(),wide?chosenValues():[valueSelect.value].filter(Boolean));}catch{beforePane.innerHTML='';}
      status.textContent='This table has not been imported.';fail(e);}
  }

  /** A column cannot be both the subject and a variable of it. Enforced in `wideDataTable` as a
   *  refusal; reflected here so the refusal is rarely met. */
  function syncValueBoxes(){
    const keys=new Set(chosenKeys());
    for(const box of valuesBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]')){
      const clash=keys.has(box.value);
      box.disabled=clash;if(clash)box.checked=false;
      box.parentElement?.classList.toggle('muted',clash);
    }
  }

  /** WHAT TO PRESELECT, which differs between the two shapes and used to be chosen once.
   *
   *  The long reader's default -- every column but the guessed value one is a key -- is right for
   *  a long file and wrong for a wide one, where it leaves exactly one column to be a value and
   *  so describes the long shape again. On `psgc_code,y2050,y2100` it preselected psgc_code and
   *  y2050 as keys, and the import then reported the file as long. Found 2026-10-27 by the
   *  browser test that covers that exact CSV.
   *
   *  For a WIDE file the subject is what is not a measurement: columns whose first row does not
   *  parse as a number. That reads Snow's four tables correctly -- `supplier`, `sub_district`,
   *  and `water_supply` and `supply_partly_computed` as further keys rather than as variables
   *  nobody can average. Where every column is numeric, as in a file keyed by a numeric code,
   *  the first column is the subject and the rest are variables.
   *
   *  A PRESELECTION AND NOT A RULE. The practitioner changes it, and the readers refuse what
   *  cannot work either way. Re-applied when the shape changes, because the shape is the whole
   *  question and a default carried over from the other answer is not a default. */
  function preselect(){
    if(!parsed)return;
    const headers=parsed.headers.map(h=>h.trim());
    const numeric=headers.map((_,i)=>{
      const cell=(parsed!.rows[0]?.[i]??'').trim();
      return cell!==''&&Number.isFinite(Number(cell));
    });
    const wide=shape()==='wide';
    let keyNames:string[];
    if(wide){
      // AN IDENTIFIER IS A SUBJECT, NOT A VARIABLE, though it is written in digits (2026-11-20): PSMSL's station IDs read
      // as a measurement to average. A column named id, or ending in _id, _code or _no, is a key by its name.
      const identifier=(h:string)=>/(^|_)(id|code|no)$/i.test(h);
      // A COORDINATE IS WHERE THE SUBJECT IS, NOT SOMETHING MEASURED ABOUT IT (2026-11-23). Proposed as a value, latitude
      // and longitude were melted into measure and value, so the long table carried no coordinates and Point data had
      // none to read. Repeating across rows does not make them a poor key: repetition is checked on the whole
      // combination of key columns, so carrying them makes each row's signature more distinct, not less -- on the
      // African Bat Database's 18,409 records it took the repeated-key findings from 207 to 69.
      keyNames=headers.filter((h,i)=>!numeric[i]||identifier(h)||isCoordinateColumn(h));
      // THE DICTIONARY SAYS WHICH ARE COUNTS (2026-11-21): where it gives some numeric columns a unit, those are the
      // values and the rest are keys. Nigeria's census has `printed_page` and `s_no` in digits, read as measures beside
      // men, women and total; its dictionary gives a unit, persons, to those three only.
      const sheet=dictionaryFile?.sheets[0];
      if(sheet){const entries=readDictionary(sheet.headers,sheet.rows,guessMapping(sheet.headers));
        const counted=headers.filter((h,i)=>numeric[i]&&!keyNames.includes(h)&&entries.get(h)?.unit?.trim());
        if(counted.length)keyNames=headers.filter(h=>!counted.includes(h));}
      if(!keyNames.length)keyNames=headers.slice(0,1);
    }else{
      const valueAt=guessValueColumn(headers,parsed.rows);
      // A WIDE FILE READ LONG STARTS WITH NOTHING TICKED. Every column but the value was ticked, which for NYC's 92 was
      // 87 to untick to keep 5. The practitioner, 2026-11-04: *"This is choice overload"*. A small file keeps the
      // old default, where it is usually right.
      // Nothing guessed, nothing ticked: the keys follow from the value column the person chooses.
      keyNames=headers.length>MANY_COLUMNS||valueAt<0?[]:headers.filter((_,i)=>i!==valueAt);
      valueSelect.value=valueAt<0?'':headers[valueAt]!;
      // A STEP'S OWN LONG READ, REOPENED, keeps its value column and keys (2026-11-20): the guess above replaced them, so a
      // census read long reopened with no value chosen.
      if(own&&!own.wide){const column=own.valueColumn??own.valueField;
        if(headers.includes(column)){valueSelect.value=column;keyNames=own.keys.filter(k=>headers.includes(k));}}
    }
    const held=own?.wide;
    for(const box of keysBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]'))
      box.checked=held&&wide?held.keys.includes(box.value.trim()):keyNames.includes(box.value.trim());
    for(const box of valuesBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]')){
      const name=box.value.trim();
      box.checked=held?held.valueFields.includes(name):!keyNames.includes(name);
    }
  }

  /** Which controls belong to the chosen shape, and what the key columns are called in it. */
  function applyShape(){
    const wide=shape()==='wide';
    valuesBox.hidden=!wide;wideNames.hidden=!wide;longValue.hidden=wide;
    const many=(parsed?.headers.length??0)>MANY_COLUMNS;
    keysSays.textContent=wide
      ?'The columns that identify the subject of a row. A wide file has one row per subject, so together these must be unique.'
      :'Together these identify a row. Every key tuple must be unique.'
        +(many?` This file has ${parsed!.headers.length} columns: tick the ones you need, or paste their names below.`:'');
    preselect();
    syncValueBoxes();
    refreshers.get(keysBox)?.();refreshers.get(valuesBox)?.();
    build();
  }
  shapeSelect.onchange=applyShape;
  shapeAccept.onclick=()=>{shapeSelect.value='long';applyShape();};
  /** The saved step's choices, while the table read is the one it was saved with; otherwise undefined. */
  let own:TableReopen|undefined;
  /** Where a table read from a service came from (DHIS2), until another source is read. */
  let serviceProvenance:import('./input-provenance.js').InputProvenance|undefined;
  let remote:RemoteTableSource|undefined,archive:Uint8Array<ArrayBuffer>|undefined,archiveSha256:string|undefined;
  const urlInput=q<HTMLInputElement>('#table-url'),entrySelect=q<HTMLSelectElement>('#table-entry');
  // THE ADDRESS IT IS PUBLISHED AT, shown when the step is reopened (2026-11-14: NYC's Zenodo table read as if it had none).
  if(existing?.remote?.url)urlInput.value=existing.remote.url;
  const readFetched=async(bytes:Uint8Array<ArrayBuffer>,path:string)=>{
    serviceProvenance=undefined;
    remote={url:urlInput.value.trim(),...(archive?{entry:path,archiveSha256}:{}),
      sha256:await contentHash(bytes),bytes:bytes.length};
    await load(asFile(bytes,path),true);
  };
  // THE DEVICE'S COPY FIRST, for a URL fetched before: the same file, checked by digest, without downloading it again.
  // Fetch again from the source is one click, for a file that may have changed where it is published.
  const fetchURL=async(fresh:boolean)=>{
    const url=urlInput.value.trim();
    if(!/^https:\/\//.test(url)){fail(new Error('Give an https address.'));return;}
    // PROGRESS AND A STOP, not a time limit: a slow source is still a working one (2026-11-05, Zenodo at 5 KB/s).
    const stop=new AbortController();
    status.innerHTML=`<span data-fetch-progress>Fetching ${esc(url)}…</span> <button type="button" class="button small" data-fetch-stop>Stop</button>`;
    error.hidden=true;
    status.querySelector<HTMLButtonElement>('[data-fetch-stop]')!.onclick=()=>stop.abort();
    const progress=status.querySelector('[data-fetch-progress]')!;
    try{
      const got=await fetchOrDeviceCopy(url,{fresh,signal:stop.signal,
        onProgress:(read,total)=>{progress.textContent=`Fetching ${url}: ${progressText(read,total)}`;}});
      const bytes=got.bytes;
      const said=got.from==='device'
        ?`Read from the copy on this device, fetched ${new Date(got.fetchedAt??'').toLocaleString()} and checked by digest. `
        :'';
      const again=got.from==='device'?' <button type="button" id="table-refetch" class="text-button">Fetch again from the source</button>':'';
      const inside=tablesInArchive(bytes);
      if(inside.length){
        archive=bytes;archiveSha256=got.digest;
        entrySelect.innerHTML='<option value="">Choose a file…</option>'+inside.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');
        entrySelect.hidden=false;(entrySelect.previousElementSibling as HTMLElement).hidden=false;
        status.innerHTML=`${esc(said)}The archive holds ${inside.length} table${inside.length===1?'':'s'}. Choose one.${again}`;
        q<HTMLElement>('#table-refetch')?.addEventListener?.('click',()=>void fetchURL(true));
        return;
      }
      archive=undefined;archiveSha256=undefined;
      await readFetched(bytes,url);
    }catch(e){status.textContent='Nothing was fetched.';fail(e);}
  };
  const censusSays=q<HTMLElement>('#table-census-says');
  const dropCensusDictionary=()=>{censusPeriod=undefined;if(dictionaryFromCensus){dictionaryFile=undefined;dictionaryFromCensus=false;censusSays.textContent='';}};
  // A TABLE FROM AN ADDRESS CARRIES NO DICTIONARY FROM ANOTHER TAB: one chosen under Your file is for that file.
  q<HTMLButtonElement>('#table-fetch').onclick=()=>{dropCensusDictionary();dictionaryFile=undefined;dictionaryInput.value='';dictionarySays.textContent='';void fetchURL(false);};
  // A PINNED TABLE, from Census tables or Tide gauges: the table by address, and its data dictionary beside it, each checked
  // against the digest pinned with it.
  const gaugesSays=q<HTMLElement>('#table-gauges-says');
  const readPinned=async(raw:string,table:{path:string;sha256:string},columns:{path:string;sha256:string}|undefined,name:string,says:HTMLElement)=>{
    error.hidden=true;dropCensusDictionary();gaugesSays.textContent='';
    if(columns){
      try{
        const got=await fetchOrDeviceCopy(raw+columns.path,{fresh:false});
        if(got.digest!==columns.sha256)throw new Error(`${columns.path} is not the file Fieldwork pinned: its digest differs.`);
        const sheets=dictionarySheets('columns.csv',got.bytes);
        dictionaryFile={name:columns.path,bytes:got.bytes,sheets};dictionaryFromCensus=true;
        says.textContent=`${name}: its data dictionary, ${columns.path}, has ${sheets[0]?.rows.length??0} variables. Kept with the table; what it says is proposed for you to accept.`;
      }catch(e){fail(e);return;}
    }
    urlInput.value=raw+table.path;
    await fetchURL(false);
    if(remote&&remote.sha256!==table.sha256){remote=undefined;result=undefined;save.disabled=true;
      fail(new Error(`${table.path} is not the file Fieldwork pinned: its digest differs.`));}
  };
  for(const button of dialog.querySelectorAll<HTMLButtonElement>('[data-census]'))button.onclick=async()=>{
    const c=CENSUS.countries.find(x=>x.iso3===button.dataset.census);if(!c)return;
    const t:CensusTable=[c,...(c.more??[])][Number(button.dataset.censusTable??0)]??c;
    await readPinned(CENSUS.raw,t.counts,t.columns,c.country,censusSays);
    // THE CENSUS DATE, AS THE CATALOGUE STATES IT (experiment 230). Set after `readPinned`, which drops census state
    // at its start. A census is ENUMERATED: people were counted, not modelled, which is what makes it a denominator
    // worth having and what tells it apart from a projection of the same year.
    if(c.referenceDate?.trim())censusPeriod={stated:c.referenceDate.trim(),kind:'enumerated'};
  };
  // A COUNTRY'S TIDE GAUGES: its stations table, and the dictionary every country's shares.
  wireGauges(dialog,esc,c=>{void readPinned(GAUGES.raw,c.table,GAUGES.columns,`${c.country}'s tide gauges`,gaugesSays);});
  // WHICH TAB: the one the table came through when a step is reopened, otherwise the one last used on this device.
  const tabs=[...dialog.querySelectorAll<HTMLButtonElement>('[data-table-tab]')];
  const showTab=(name:string,remember=true)=>{
    for(const t of tabs){const on=t.dataset.tableTab===name;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;
      q<HTMLElement>(`#${t.getAttribute('aria-controls')}`).hidden=!on;}
    if(remember)try{localStorage.setItem(TAB_KEY,name);}catch{/* a per-device convenience only */}
  };
  for(const t of tabs){t.onclick=()=>showTab(t.dataset.tableTab!);
    t.onkeydown=event=>{const at=tabs.indexOf(t),next=event.key==='ArrowRight'?tabs[(at+1)%tabs.length]:event.key==='ArrowLeft'?tabs[(at+tabs.length-1)%tabs.length]:undefined;
      if(next){event.preventDefault();showTab(next.dataset.tableTab!);next.focus();}};}
  const remembered=(()=>{try{return localStorage.getItem(TAB_KEY);}catch{return null;}})();
  showTab(existing?.remote?.url?(existing.remote.url.startsWith(CENSUS_RAW)?'census':existing.remote.url.startsWith(GAUGES_RAW)?'gauges':'remote'):existing?'file'
    :tabs.some(t=>t.dataset.tableTab===remembered)?remembered!:'file',false);
  // WHAT IS TYPED, READ THE WAY A FILE IS. The text is handed to the same `load` a chosen file goes through, so the
  // header naming, the key and value columns, the shape and the preview below are one path, not two that can drift.
  // Validation is `parseCSV`'s own: it refuses a ragged row, a malformed quote and a missing header already, and a
  // second rule here would be a second answer to the same question.
  const typed=q<HTMLTextAreaElement>('#table-typed'),typedSays=q<HTMLElement>('#table-typed-says');
  if(existing?.typedText)typed.value=existing.typedText;
  const typedSave=q<HTMLButtonElement>('#table-typed-save'),typedPreview=q<HTMLElement>('#table-typed-preview');
  let typedTimer=0,typedRead:{headers:string[];rows:string[][]}|undefined;
  // A PASTE FROM A SPREADSHEET IS TABS. Copying six rows out of Excel or Sheets puts TSV on the clipboard, and a
  // comma-only reader would make that one column per line. The header line decides, and the status line says which.
  const delimiterOf=(text:string):','|'\t'|';'=>{
    const first=text.split(/\r?\n/,1)[0]??'';
    const count=(d:string)=>first.split(d).length-1;
    return count('\t')>count(',')?'\t':count(';')>count(',')?';':',';
  };
  const asCsv=(text:string,delimiter:string):string=>delimiter===','?text
    :text.split(/\r?\n/).map(line=>line.split(delimiter)
      .map(cell=>/[",\n]/.test(cell)?`"${cell.replace(/"/g,'""')}"`:cell).join(',')).join('\n');
  /** The line a ragged row is on, which `parseCSV` knows but does not say. Worth the scan: on a short table the
   *  line number is the whole of the remedy. */
  const raggedLine=(csv:string):number|undefined=>{
    const lines=csv.split(/\r?\n/).filter(l=>l.trim());
    const fields=(line:string)=>{let n=1,quoted=false;
      for(let i=0;i<line.length;i++){const c=line[i];
        if(quoted){if(c==='"'){if(line[i+1]==='"')i++;else quoted=false;}}
        else if(c==='"')quoted=true;else if(c===',')n++;}
      return n;};
    const want=fields(lines[0]??'');
    for(let i=1;i<lines.length;i++)if(fields(lines[i]!)!==want)return i+1;
    return undefined;
  };
  const readTyped=()=>{
    const text=typed.value;
    typedPreview.innerHTML='';typedSave.disabled=true;typedRead=undefined;
    if(!text.trim()){typedSays.textContent='';return;}
    const delimiter=delimiterOf(text),csv=asCsv(text,delimiter);
    const named=delimiter==='\t'?'tab separated':delimiter===';'?'semicolon separated':'comma separated';
    try{
      const parsed=parseCSV(csv,TYPED_ROWS,FILE_BYTES);
      typedRead=parsed;
      typedSave.disabled=false;
      typedSays.textContent=`${named}: ${parsed.headers.length} column${parsed.headers.length===1?'':'s'}, `
        +`${parsed.rows.length.toLocaleString('en')} row${parsed.rows.length===1?'':'s'}.`
        +(parsed.named?.length?` ${parsed.named.map(n=>`Column ${n.column} had no usable name and is read as ${n.as}.`).join(' ')}`:'');
      // THE TABLE AS TYPED, WIDE: one row per record, the columns in the order they were written. Drawn directly
      // rather than through `dataTableMarkup`, because that renderer wants the key and value columns chosen, and
      // those are decided below the tabs after the text is read -- the preview is for seeing what you just typed.
      typedPreview.innerHTML=`<table class="typed-preview"><thead><tr>`
        +parsed.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')+'</tr></thead><tbody>'
        +parsed.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')
        +'</tbody></table>';
    }catch(error){
      const line=/same number of fields/.test(String((error as Error).message))?raggedLine(csv):undefined;
      typedSays.textContent=`${named}. ${(error as Error).message}`
        +(line?` Line ${line} does not match the header.`:'');
    }
  };
  typed.oninput=()=>{readTyped();
    // The workflow's own copy is built from the same text, a moment after typing stops.
    clearTimeout(typedTimer);
    typedTimer=window.setTimeout(()=>{if(!typedRead)return;
      const delimiter=delimiterOf(typed.value);
      void load(new File([asCsv(typed.value,delimiter)],'typed.csv',{type:'text/csv'}),false);},350);};
  typedSave.onclick=()=>{
    if(!typedRead)return;
    // SAVED AS FIELDWORK READ IT, so the file reads back the same way: the header names it settled on, and one
    // quoting rule rather than whatever the typing happened to use.
    const cell=(v:string)=>/[",\n]/.test(v)?`"${v.replace(/"/g,'""')}"`:v;
    const csv=[typedRead.headers.map(cell).join(','),...typedRead.rows.map(row=>row.map(cell).join(','))].join('\n')+'\n';
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    const a=document.createElement('a');a.href=url;
    a.download='table.csv';
    a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};

  // A TABLE FROM AN ADDRESS REOPENS READ (2026-11-20): it opened empty until fetched again, so its columns, value name and
  // keys could not be changed, and what showed was stale. Its copy on this device is read, checked by digest, and the
  // settings it was saved with are put back.
  if(existing?.remote?.url&&!existing.remote.entry)void fetchURL(false);
  entrySelect.onchange=async()=>{
    if(!archive||!entrySelect.value)return;
    try{await readFetched(archiveEntry(archive,entrySelect.value),entrySelect.value);}
    catch(e){fail(e);}
  };
  fileInput.onchange=()=>{remote=undefined;sheet=undefined;serviceProvenance=undefined;dropCensusDictionary();void load(fileInput.files?.[0],false);};
  // THE DHIS2 TAB: its table goes through this dialog's own reading, as a file does, with where it came from kept.
  wireDhis2(dialog,{esc,tokens:()=>frame.dhis2?.tokens()??[],
    resolve:(ref,origin)=>{if(!frame.dhis2)throw new Error('Credentials are not available here.');return frame.dhis2.resolve(ref,origin);},
    read:async(csv,filename,provenance)=>{remote=undefined;sheet=undefined;dropCensusDictionary();serviceProvenance=provenance;
      // WHAT DHIS2'S COLUMNS MEAN, proposed as a census table's dictionary is, for the person to accept.
      const bytes=new TextEncoder().encode(DHIS2_DICTIONARY);
      dictionaryFile={name:'DHIS2 analytics columns',bytes,sheets:dictionarySheets('columns.csv',bytes)};dictionaryFromCensus=true;
      await load(new File([csv],filename,{type:'text/csv'}),false);
      // LONG, AS DHIS2 GIVES IT: one row per data, period and unit, its value in "value". A year read as a period is not a
      // variable, which the wide default would have made it.
      shapeSelect.value='long';applyShape();}},fail);
  // ANOTHER SHEET of the same workbook is read as a fresh file would be, keys and all.
  sheetSelect.onchange=()=>{sheet=sheets?.find(s=>s.name===sheetSelect.value);if(file)void load(file,!!remote);};
  const load=async(chosen:File|undefined,fetched:boolean)=>{
    if(!fetched)remote=undefined;
    const request=++serial;file=chosen;parsed=undefined;keysBox.hidden=true;valueSelect.disabled=true;
    // THE STEP'S OWN CHOICES APPLY TO ITS OWN TABLE ONLY (2026-11-20). DR Congo's census step, reopened and given the
    // provinces table, ticked "total" as a key because the printed table's step had, so it could not be a value. A
    // step reading from an address keeps its choices for that address; a step reading a file, for the file chosen again.
    own=existing&&(existing.remote?.url?fetched&&remote?.url===existing.remote.url&&remote?.entry===existing.remote.entry:!fetched)?existing:undefined;
    keysBox.innerHTML='<legend>Key columns</legend><p class="muted" id="table-keys-says"></p>';
    valuesBox.innerHTML='<legend>Value columns</legend><p class="muted">The variables to take. Named rather than inferred, so a column the file gains later is absent from this analysis by decision rather than by accident.</p>';
    valuesBox.hidden=true;shapeAlert.hidden=true;
    valueSelect.innerHTML='';result=undefined;save.disabled=true;error.hidden=true;
    check.hidden=true;beforePane.innerHTML='';afterPane.innerHTML='';reconcile.innerHTML='';
    if(!file){status.textContent='';return;}
    if(file.size>FILE_BYTES){status.textContent='';fail(new Error(`Select a file of at most ${FILE_BYTES/1e6} MB.`));return;}
    status.textContent='Reading the file…';
    try{
      // A STATA FILE IS READ AS STATA WROTE IT, then meets the same dialog a CSV does. Experiment 169.
      stata=/\.dta$/i.test(file.name)?readStata(new Uint8Array(await file.arrayBuffer())):undefined;
      // AN EXCEL WORKBOOK is read as its cells are written, one sheet at a time, then meets the same dialog a CSV does.
      const workbook=/\.xlsx$/i.test(file.name);
      if(workbook){
        const read=readXlsx(new Uint8Array(await file.arrayBuffer())).filter(s=>s.headers.length);
        if(!read.length)throw new Error('This workbook has no sheet with a header row.');
        // A sheet already chosen is kept when the same workbook is read again; otherwise the first.
        const wanted=sheet?.name;
        sheets=read;sheet=read.find(s=>s.name===wanted)??read[0]!;
        sheetSelect.innerHTML=read.map(s=>`<option value="${named(s.name)}"${s===sheet?' selected':''}>${named(s.name)} \u00b7 ${s.rows.length.toLocaleString()} rows</option>`).join('');
        sheetRow.hidden=read.length<2;
        if(sheet.rows.length>MAX_TABLE_ROWS)throw new Error(`Sheet "${sheet.name}" has ${sheet.rows.length.toLocaleString()} rows; at most ${MAX_TABLE_ROWS.toLocaleString()} can be imported.`);
        // SAID WHERE IT STAYS, not in the status line the table's own count replaces.
        workbookSays.textContent=`Excel workbook, sheet "${sheet.name}": ${sheet.rows.length.toLocaleString()} rows of ${sheet.headers.length} columns. `
          +'Cells are read as written; a formula gives its saved result; a date Excel stores as a number stays that number.';
        workbookSays.hidden=false;
      }else{sheets=undefined;sheet=undefined;sheetRow.hidden=true;workbookSays.hidden=true;}
      if(request!==serial)return;
      const read=stata||workbook?undefined:await readTextFile(file);text=read?.text??'';if(request!==serial)return;
      parsed=stata??(sheet?{headers:sheet.headers,rows:sheet.rows}:undefined)??{...parseCSV(text,MAX_TABLE_ROWS,FILE_BYTES),...(read?.encoding?{encoding:read.encoding}:{})};
      status.textContent=stata?`Stata format ${stata.format}: ${stata.rows.length.toLocaleString()} rows of ${stata.headers.length} variables.`
        +(stata.notes.length?` ${stata.notes.join(' ')}`:''):'';
      const guessValue=guessValueColumn(parsed.headers,parsed.rows);
      keysBox.innerHTML+=parsed.headers.map((header,i)=>{
        const escaped=escapeHtml(header);
        const preselect=own?own.keys.includes(header.trim()):guessValue>=0&&i!==guessValue;
        return `<label><input type="checkbox" value="${escaped}" ${preselect?'checked':''}> ${escaped}</label>`;}).join('');
      keysBox.hidden=false;
      valueSelect.innerHTML='<option value="">Choose the value column</option>'+parsed.headers.map((header,i)=>{
        const escaped=escapeHtml(header);
        const chosen=own?header.trim()===(own.valueColumn??own.valueField):i===guessValue;
        return `<option value="${escaped}" ${chosen?'selected':''}>${escaped}</option>`;}).join('');
      valueSelect.disabled=false;
      // THE VALUE COLUMNS, for the wide reader. Preselected as everything that is not a chosen
      // subject key, because that is the common case and the practitioner can take fewer -- but
      // named in the markup either way, so the selection is a decision and not a leftover.
      valuesBox.innerHTML+=parsed.headers.map(header=>{
        const escaped=escapeHtml(header);
        const held=own?.wide?.valueFields;
        const preselect=held?held.includes(header.trim()):!keysBox.querySelector<HTMLInputElement>(`input[value="${CSS.escape(header)}"]`)?.checked;
        return `<label><input type="checkbox" value="${escaped}" ${preselect?'checked':''}> ${escaped}</label>`;}).join('');
      // A column cannot be both the subject and a variable of it, so taking one as a key drops it
      // from the values offered -- and the other way round. Enforced in `wideDataTable` as a
      // refusal; reflected here so the refusal is rarely met.
      for(const box of keysBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]'))
        box.onchange=()=>{syncValueBoxes();build();};
      for(const box of valuesBox.querySelectorAll<HTMLInputElement>('input[type=checkbox]'))box.onchange=build;
      columnTools(keysBox,'table-keys','Key columns',()=>{syncValueBoxes();build();});
      columnTools(valuesBox,'table-values','Value columns',build);
      applyShape();
    }catch(e){if(request===serial){status.textContent='The file could not be read.';fail(e);}}
  };
  rolesBox.onchange=build;
  q<HTMLInputElement>('#table-long-value-name').onchange=build;
  // A long read's value named otherwise is named so again when the step reopens.
  if(existing&&!existing.wide&&existing.valueColumn)q<HTMLInputElement>('#table-long-value-name').value=existing.valueField;
  valueSelect.onchange=build;unitInput.onchange=()=>{unitTyped=!!unitInput.value.trim();unitFrom.hidden=true;build();};
  measureKeyInput.onchange=build;valueNameInput.onchange=build;
  cancel.onclick=()=>dialog.close();dialog.oncancel=e=>{if(busy)e.preventDefault();};
  q<HTMLButtonElement>('#table-close').onclick=()=>{if(!busy)dialog.close();};
  // THE SETTING ALONE can be applied without reading the file again.
  const convert=q<HTMLInputElement>('#table-convert-on-run');
  convert.onchange=()=>{if(!result)save.disabled=convert.checked===!!frame.convertOnRun;};
  dialog.onclose=()=>{serial++;file=undefined;result=undefined;dialog.remove();};
  save.onclick=async()=>{
    if(!result&&frame.onConvertOnRun&&convert.checked!==!!frame.convertOnRun){
      if(frame.onConvertOnRun(convert.checked))dialog.close();return;}
    if(!result||!file||busy)return;busy=true;save.disabled=true;cancel.disabled=true;fileInput.disabled=true;error.hidden=true;
    try{
      const sha256=await contentHash(stata||sheet?new Uint8Array(await file!.arrayBuffer()) as Uint8Array<ArrayBuffer>:new TextEncoder().encode(text) as Uint8Array<ArrayBuffer>);
      // A STATA FILE'S OWN VARIABLE LABELS, proposed for what its kept columns mean and not yet accepted
      // (experiment 172). A label the file does not have is no proposal.
      const kept=result.wide?[...result.wide.keys,...result.wide.valueFields]:[...result.keys,result.valueField];
      const proposed=stata?Object.fromEntries(kept.map(c=>[c,stata!.labels[stata!.headers.indexOf(c)]?.trim()??''])
        .filter(([,label])=>label).map(([c,label])=>[c,{label,origin:'file' as const,confirmed:false,from:result!.source.filename}])):{};
      const source={...result.source,sha256,...(sheet?{sheet:sheet.name}:{})};
      // THE DICTIONARY, kept as read and checked against the kept columns. Its descriptions are proposals, over the
      // file's own labels: a dictionary is the fuller account of the two.
      let dictionary:TableDictionary|undefined,dictionaryCheck:DictionaryCheck|undefined,described:ColumnDeclarations=proposed;
      if(dictionaryFile){
        const sheets=dictionaryFile.sheets.map(s=>({name:s.name,headers:s.headers,rows:s.rows}));
        dictionary={name:dictionaryFile.name,sha256:await contentHash(dictionaryFile.bytes as Uint8Array<ArrayBuffer>),sheets,readAt:new Date().toISOString()};
        const first=sheets[0]!,entries=readDictionary(first.headers,first.rows,guessMapping(first.headers));
        described={...proposed,...proposeFrom(entries,dictionaryFile.name,kept,{},sameNames(kept,entries))};
        dictionaryCheck=checkDictionary(dictionaryFile.name,entries,{headers:kept,rows:fileRows(result.data,result.wide)});
      }
      const saved:TableImport={...result,data:{...result.data,source,...(censusPeriod?{period:censusPeriod}:{})},source,
        ...(remote?{remote}:{}),...(Object.keys(described).length?{proposed:described}:{}),
        ...(dictionary?{dictionary}:{}),...(dictionaryCheck?{dictionaryCheck}:{}),
        ...(result.source_table&&convert.checked?{convertOnRun:true}:{})};
      // AWAITED: the rows are kept on this device before the dialog says they are (found 2026-11-08, a reload right after
      // Save could find the workflow pointing at rows not yet written).
      if(!await onSave(saved))throw new Error('The table could not be saved. Your previous project is unchanged; retry Save.');
      dialog.close();
    }catch(e){fail(e);status.textContent='This table has not been added to the project.';}
    finally{busy=false;save.disabled=!result;cancel.disabled=false;fileInput.disabled=false;}
  };
  dialog.showModal();
}

/** Results view: key columns, then the value, with the unit stated or marked unstated. */
/** TWO KEY COLUMNS ARE A MATRIX, and a long list of them is the same data saying less.
 *
 *  A table keyed by (group, measure) printed as six rows is a list; printed as a grid it is the
 *  2x2 a reader came for, and the comparison they are making runs along a row instead of down a
 *  column three rows apart. The practitioner, 2026-10-26, on the rate ratio's output: it did not yet look like the
 *  categorical output a reader expects, which cross-tabulates exposure against outcome rather than listing cells.
 *
 *  Generic rather than epidemiological: ANY table with exactly two key columns pivots this way,
 *  including Snow's Table VIII at sub-district by measure. Declined when the second key has many
 *  values, because a grid wider than a screen is worse than the list it replaced.
 *
 *  TOTALS WHERE THE CELLS ARE COMMENSURABLE, and only there. The epidemiologist's 2x2 is
 *  predictable -- four cells A, B, C, D with categories across the top and down the left, and
 *  totals as a fourth column and a fourth row -- and a reader expects to find N in the corner.
 *  But a measure-keyed table has cells that cannot be added: 1,263 deaths plus 40,046 houses is
 *  not a quantity, and a Total column would invite exactly that reading.
 *
 *  The declaration already distinguishes them. A table that states its `unit` is saying every
 *  value counts the same thing, so totals are meaningful; a table with none is not, and gets no
 *  totals rather than a guess. */
export const CROSSTAB_MAX_COLUMNS=12;
/** How full the grid must be before it is drawn as one. Half is a judgement, not a measurement:
 *  Manila's assignment sits at 0.125 and a 2x2 missing a cell at 0.75, and anything between
 *  those is a table nobody has shown us yet. */
export const CROSSTAB_MIN_DENSITY=0.5;

/** A FLAT WIDE VIEW of any table: the frame, not a tabulation.
 *
 *  The practitioner, 2026-10-27, on what an epidemiologist meets everywhere else: *"If I have a
 *  widget that links two wide tables, I want to see a wider table with rows correctly linked on
 *  the linking key. It's easier for epidemiologists to view the relate table result that way, not
 *  in JSON."* And on the shape itself: *"pandas does not show you a long table."*
 *
 *  `crossTab` stays and is the better view where it applies -- *"2x2 tables is OK, epidemiologists
 *  feel at home with that"* -- but it is a TABULATION of exactly two keys with margins. A table
 *  with any other number of keys fell through to a paged list of key-value pairs, which is the
 *  internal long shape shown to somebody who never asked for it. `relate_table` returns
 *  `[...left.keys, bring]`, so the one table a practitioner opens to check a join worked was the
 *  one they could not read it in.
 *
 *  WHICH KEYS ARE AXES, decided by COMPLETENESS. Every subject carries every measure by
 *  construction and exactly one of each attribute: Snow's 32 sub-districts each have all seven of
 *  Table VIII's variables, and each has one water supplier. So a key whose values repeat in full
 *  for every subject is an axis, and one that does not describes the subject and rides alongside
 *  it as a column.
 *
 *  Two simpler rules were tried against the real tables and both failed:
 *
 *    POSITION. The melt puts the measure key last and `relateTable` appends the brought column
 *    after it, so "the last key" is the measure in one table and an attribute in the next.
 *    CARDINALITY. A melt of a single value column gives a measure key with ONE value, which looks
 *    exactly like an attribute -- South London's contingency Table XII is that table -- until you
 *    ask whether every subject has it.
 *
 *  Returns null rather than guessing where the keys do not resolve to one axis. A caller then
 *  shows the rows, which is honest about a table nobody can pivot. */
export interface WideFrame {
  subject:string; attributes:string[]; columns:string[];
  /** THE KEY WHOSE VALUES BECAME THE COLUMNS, and the keys that identify a row (2026-11-25). The frame could always
   *  widen a table; it could not say HOW, so nothing could record the reading as a declaration. A practitioner who
   *  asks to keep a long table wide is declaring exactly this pair. */
  measureKey:string; subjectKeys:string[];
  rows:{label:string; attributes:string[]; cells:(number|null|undefined)[];
    /** WHICH STORED ROWS EACH DISPLAYED ROW CAME FROM (2026-11-24), so a surface can show the file's shape and still
     *  record an edit against the rows the step holds. `cells[i]` is the stored row behind the value in column `i`,
     *  absent where that subject has no value there; `rows` is every stored row of the subject, which is what a
     *  correction to its name or to one of its attributes has to reach.
     *
     *  Carried here rather than recomputed beside it, because a second regrouping could disagree with this one about
     *  which rows belong to which subject, and then an edit would land on the wrong record. */
    from:{cells:(number|undefined)[]; rows:number[]}}[];
}
/** A TABLE AS A SURFACE MUST SHOW IT: the file's shape where one can be reconstructed, the stored columns where it
 *  cannot (2026-11-24).
 *
 *  The practitioner, after finding the data quality dialog showing a wide table melted: *"We should decrease the
 *  friction for the user, which means consistency in user-facing views of the tables. We can be efficient using long
 *  formats but will result in cognitive dissonance in the user."* The melting is Fieldwork's, for the steps
 *  downstream; a column called `value` is a name it gave the table, not one anybody read off a file.
 *
 *  Here rather than at each surface, because three dialogs widening a table three ways would be the same dissonance
 *  one level down. Returns text, so a caller keeps its own markup -- the alignment grid in Append rows, the scroller
 *  in Join, the plain table in Detect -- and only the shape is shared. */
// WIDENS ONLY WHAT THE TABLE SAYS IS WIDE. `wideFrame` will read any long table as wide, by guessing which key
// holds the measures; that guess belongs in Quick Look, where the reader sees a hint and can settle it, and the
// settled reading then rides on `table.wide` to here. Where nothing is declared this lists the stored rows, which
// is the same rule the data quality dialog follows (2026-11-25) -- a natively long file keeps its own columns, and
// a column of class names is not pivoted into headings.
export function wideCells(table:DataTable):{columns:string[];rows:string[][]}{
  const text=(v:unknown)=>v===null||v===undefined?'':String(v);
  const frame=table.wide||table.shownWide?wideFrame(table):null;
  if(!frame)return {columns:[...table.keys,table.valueField].filter(Boolean),
    rows:table.rows.map(r=>[...table.keys.map(k=>text(r.key[k])),text(r.value)])};
  return {columns:[frame.subject,...frame.attributes,...frame.columns],
    rows:frame.rows.map(r=>[r.label,...r.attributes,...r.cells.map(text)])};
}

export function wideFrame(table:DataTable):WideFrame|null{
  const keys=table.keys;
  if(keys.length<2)return null;
  // NO VALUE COLUMN, NOTHING TO SPREAD: a layer of polygons or points as a table is its attributes, one row each, and
  // pivoting on its names drew John Snow's eight pumps as eight columns of "unknown" (2026-11-15).
  if(!table.valueField)return null;
  // A DECLARED READING ORDER decides (experiment 191): totals and their shares by two columns have two keys that vary
  // within a subject, and the person who kept them put them in order.
  // THE MELT ALREADY SAID WHICH KEY IS THE MEASURE, so nothing below has to guess (2026-11-25).
  //
  // This asked for `asDeclared` as well, and `declaredWide` -- the melt itself -- does not set it. So every table
  // Fieldwork melted fell through to the heuristic below, which takes the key with the MOST DISTINCT VALUES as the
  // subject. Two districts by eligible, vaccinated and missed has three measures against two districts, so the
  // measures won and the table came back transposed: the districts became columns and a correction to a district's
  // name reached one of its three counts instead of all three.
  //
  // Reported against 0.195.0 by a reviewer outside this project, in those words -- "Data quality shows six rows
  // instead of two" -- and reproduced here before it was touched. `asDeclared` carries a stronger claim about the
  // ORDER of several keys (experiment 191); which key holds the measure is recorded whenever a table was melted,
  // and it is the better answer either way.
  // THE FILE'S OWN SHAPE FIRST, THEN THE READER'S. `wide` is what the melt recorded; `shownWide` is what a reader
  // asked for in Quick Look. Both are readings; only the first is also relied on by computation, which is why they
  // are separate fields (see `shownWide` in data-table.ts).
  const reading=table.wide??table.shownWide;
  if(reading&&keys.includes(reading.measureKey))return declaredFrame(table,reading.measureKey,reading.subjectKeys);
  const distinct=(k:string)=>new Set(table.rows.map(r=>String(r.key[k]))).size;
  // The subject identifies a row most finely.
  const subject=[...keys].sort((a,b)=>distinct(b)-distinct(a))[0];
  /** A key DESCRIBES the subject where every subject has exactly one of its values.
   *
   *  ONE PER SUBJECT, rather than "every subject has them all". Requiring the full set made a
   *  single missing cell disqualify the measure axis, so any ragged table -- Dulwich's empty 1854
   *  cell is one -- fell back to the list this view exists to replace. */
  const describesSubject=(k:string)=>{
    const perSubject=new Map<string,Set<string>>();
    for(const r of table.rows){
      const s=String(r.key[subject]);
      if(!perSubject.has(s))perSubject.set(s,new Set());
      perSubject.get(s)!.add(String(r.key[k]));
    }
    return [...perSubject.values()].every(set=>set.size===1);
  };
  const others=keys.filter(k=>k!==subject);
  // A NUMBER IS A VALUE, NEVER AN AXIS. A projection Relate brought beside each facility is one number for all 194, and
  // promoted to the axis it headed the distances "1124" (found 2026-11-09, the sea-level example's second workflow).
  const numeric=(k:string)=>Object.hasOwn(table.numericKeys??{},k);
  let axes=others.filter(k=>!numeric(k)&&!describesSubject(k));
  let attributes=others.filter(k=>numeric(k)||describesSubject(k));
  // A MELT OF ONE COLUMN leaves a measure key carrying a single name, which is one per subject
  // like any description. The melt puts that key last, so where nothing else can be the axis the
  // last key is promoted back to it.
  // Never a column the rules concluded: a verdict that is the same on every row is still a verdict.
  const meltable=(k:string)=>!numeric(k)&&!(table.concluded??[]).includes(k);
  if(!axes.length&&attributes.some(meltable)){
    const last=attributes.filter(meltable).at(-1)!;
    axes=[last];attributes=attributes.filter(k=>k!==last);
  }
  if(axes.length!==1)return null;
  const columnAxis=axes[0];
  const columns=[...new Set(table.rows.map(r=>String(r.key[columnAxis])))];
  if(!columns.length||columns.length>CROSSTAB_MAX_COLUMNS)return null;
  /* ONE COLUMN AND NOTHING DESCRIBING THE SUBJECT IS A LIST, drawn with extra lines. It says
   * nothing a list does not and it costs the value field its heading -- which is the defect
   * `crossTab` records above and which this view reintroduced on 2026-10-27: Manila's facilities
   * all take gauge 145, so the assignment pivoted to a single column headed "145" and lost
   * `distance_m`, the column a reader came for. The browser test for the sea-level example caught
   * it before it shipped.
   *
   * With something describing the subject it is a table rather than a list: South London's
   * contingency Table XII melts one column and reads sub-district, water supply, deaths 1854. */
  if(columns.length<2&&!attributes.some(k=>!numeric(k)))return null;
  // A FILLED CELL IS ANOTHER RECORD, the same rule `declaredFrame` follows below and for the same reason: grouping
  // on the subject alone overwrote one record's value with another's and said nothing. The subject is the finest key
  // here, so this is rarer than it is there -- but `attributes` admits NUMERIC keys without asking whether they
  // describe the subject, and a numeric key that varies within one is exactly how two records arrive under one
  // heading. Found while fixing the declared path (2026-11-25); nothing is overwritten now, and a duplicate shows
  // as the two rows it is.
  const order:WideFrame['rows'][number][]=[],byRow=new Map<string,WideFrame['rows'][number][]>();
  table.rows.forEach((r,i)=>{
    const id=String(r.key[subject]),at=columns.indexOf(String(r.key[columnAxis]));
    const groups=byRow.get(id)??(byRow.set(id,[]),byRow.get(id)!);
    let held=groups.find(g=>g.from.cells[at]===undefined);
    if(!held){held={label:id,attributes:attributes.map(k=>String(r.key[k])),
      cells:columns.map(()=>undefined),from:{cells:columns.map(()=>undefined),rows:[]}};groups.push(held);order.push(held);}
    held.cells[at]=r.value;held.from.cells[at]=i;held.from.rows.push(i);
  });
  return {subject,attributes,columns,measureKey:columnAxis,subjectKeys:[subject,...attributes],rows:order};
}

/** One row per subject, its keys all shown, one column per value of the declared measure key. */
function declaredFrame(table:DataTable,measureKey:string,subjectKeys:string[]):WideFrame|null{
  const columns=[...new Set(table.rows.map(r=>String(r.key[measureKey])))];
  if(!columns.length||columns.length>CROSSTAB_MAX_COLUMNS)return null;
  // A KEY THE RECORD DOES NOT NAME IS STILL A COLUMN OF THE TABLE (gate, 2026-11-25). The melt records which key
  // holds the measure and which keys name the record; a table can acquire more after it. Relate brings
  // `water_supply` onto Snow's South London table, which arrives keyed by sub_district and measure, so the joined
  // table has a key the melt never heard of -- and this dropped it, leaving the preview without the one variable a
  // reader checks before grouping by it. The same drop would have cost the dengue Before view its date column.
  //
  // So each leftover key is placed, never dropped: one with A SINGLE VALUE PER SUBJECT describes the subject and
  // becomes an attribute column, which is what the heuristic below does with it; one that VARIES WITHIN a subject
  // is part of what identifies a record, and joins the identity -- grouping without it would quietly overwrite one
  // record's cells with another's.
  const extra=table.keys.filter(k=>k!==measureKey&&!subjectKeys.includes(k));
  const subjectOf=(r:DataTable['rows'][number])=>subjectKeys.map(k=>String(r.key[k])).join('\u0000');
  const describesSubject=(k:string)=>{
    const seen=new Map<string,string>();
    return table.rows.every(r=>{const id=subjectOf(r),v=String(r.key[k]);
      if(!seen.has(id)){seen.set(id,v);return true;}
      return seen.get(id)===v;});
  };
  const attributeKeys=extra.filter(describesSubject);
  const identity=[...subjectKeys,...extra.filter(k=>!attributeKeys.includes(k))];
  // EVERY KEY IS SHOWN, including the ones that only identify the record. Grouping by a key without displaying it
  // draws two rows that are different and look identical: two years of counts for one district appeared as two rows,
  // neither saying its year (review of 0.197.0). A key that varies within a subject holds one value per displayed
  // row by construction, so there is always something to show.
  const attributes=[...subjectKeys.slice(1),...extra];
  // TWO ROWS WITH THE SAME KEYS ARE TWO RECORDS, and a wide view that merges them hides a duplicate. Rio de
  // Janeiro's 2024 dengue file repeats the week of 2024-12-29 for all 92 municipalities, byte for byte -- the
  // doubled week the worked example exists to show. Grouping on the keys alone drew 4,784 rows where the file has
  // 4,876, and the duplication, which is the finding, disappeared into the pivot (gate, 2026-11-25).
  //
  // So a row whose measure cell is ALREADY FILLED for its identity opens a new record rather than overwriting the
  // one before it. Nothing is counted twice and nothing is lost: the reader sees both rows, side by side, which is
  // how a duplicate is spotted at all.
  const order:WideFrame['rows'][number][]=[],byRow=new Map<string,WideFrame['rows'][number][]>();
  table.rows.forEach((r,i)=>{
    const id=identity.map(k=>String(r.key[k])).join('\u0000'),at=columns.indexOf(String(r.key[measureKey]));
    const groups=byRow.get(id)??(byRow.set(id,[]),byRow.get(id)!);
    // THE PROVENANCE DECIDES, not the value: a stored row whose value is empty still fills its cell, and testing
    // the value would read it as room for the next record.
    let held=groups.find(g=>g.from.cells[at]===undefined);
    if(!held){held={label:String(r.key[subjectKeys[0]!]),attributes:attributes.map(k=>String(r.key[k])),
      cells:columns.map(()=>undefined),from:{cells:columns.map(()=>undefined),rows:[]}};groups.push(held);order.push(held);}
    held.cells[at]=r.value;held.from.cells[at]=i;held.from.rows.push(i);
  });
  return {subject:subjectKeys[0]!,attributes,columns,measureKey,subjectKeys:identity,rows:order};
}

export function crossTab(table:DataTable,{assertCommensurable=false}={}):{rowKey:string;colKey:string;columns:string[];
  rows:{label:string;cells:(number|null|undefined)[];total:number|null}[];
  columnTotals:(number|null)[];grandTotal:number|null}|null{
  if(table.keys.length!==2)return null;
  // THE MEASURES ARE THE COLUMNS where the table says which key holds them (review of #8): a table keyed Measure, District
  // with a reading of District by Measure was drawn with the districts across, so Configure offered Cases, Results had no
  // Cases column, and a count hidden under Cases was shown.
  const reading=table.wide??table.shownWide;
  const [rowKey,colKey]=reading&&table.keys.includes(reading.measureKey)
    ?[table.keys.find(k=>k!==reading.measureKey)!,reading.measureKey]:table.keys as [string,string];
  const columns=[...new Set(table.rows.map(r=>String(r.key[colKey])))];
  if(!columns.length||columns.length>CROSSTAB_MAX_COLUMNS)return null;
  const labels=[...new Set(table.rows.map(r=>String(r.key[rowKey])))];
  // BOTH AXES MUST BE CATEGORIES. One column is a list drawn with extra lines: it says nothing
  // a list does not, and it costs the value field its heading -- Manila's 194 facilities all
  // take gauge 145, so the assignment is 194 rows against one column, perfectly dense, and
  // pivoting it hid `distance_m`, which was the column a reader came for. Density alone could
  // not tell that from a tabulation; the shape can. Found by the sea-level example, 2026-10-26.
  if(columns.length<2||labels.length<2)return null;
  // A MATRIX IS FOR A TABULATION, not for any pair of keys. Manila's assignment table is keyed
  // by point and by the site each point was assigned -- 60 points against 8 sites, one cell
  // filled per row -- and pivoting it drew a 480-cell grid holding 60 numbers. Every row of a
  // contingency table exists for every column by construction; an assignment's rows do not.
  //
  // Density tells them apart and needs no declaration. Not completeness: a 2x2 missing one cell
  // is still the table a reader wants, with a gap where nothing was said, and demanding a full
  // grid would send it back to being a list.
  if(table.rows.length<labels.length*columns.length*CROSSTAB_MIN_DENSITY)return null;
  const at=new Map(table.rows.map(r=>[`${r.key[rowKey]}\u0000${r.key[colKey]}`,r.value]));
  // TOTALS NEED A CLAIM THAT THE CELLS COUNT THE SAME THING, and a stated unit is a weak proxy
  // for one: `addable` was any non-empty string, and South London's mortality table states
  // "people or deaths, as the measure says" -- prose DENYING commensurability, read as granting
  // it. The other half of the same hole is a table that has the property and cannot say so:
  // Snow's Table IX states no unit, correctly, because as imported it holds houses beside
  // deaths; selecting `deaths` and `houses without a death` leaves two measures that both count
  // houses, and nothing records that.
  //
  // So the claim is made where a person composes a figure and takes responsibility for it,
  // rather than inferred from a free-text field. Found 2026-10-26; the per-measure unit this
  // really wants is recorded in TODO.md and reaches every consumer of `valueField`.
  const addable=assertCommensurable||Boolean(table.unit?.trim());
  const sum=(values:(number|null|undefined)[]):number|null=>{
    if(!addable)return null;
    const numbers=values.filter((v):v is number=>typeof v==='number'&&Number.isFinite(v));
    return numbers.length===values.length?numbers.reduce((a,b)=>a+b,0):null;
  };
  const rows=labels.map(label=>{
    const cells=columns.map(c=>at.get(`${label}\u0000${c}`));
    return {label,cells,total:sum(cells)};
  });
  return {rowKey,colKey,columns,rows,
    columnTotals:columns.map((_,i)=>sum(rows.map(r=>r.cells[i]))),
    grandTotal:sum(rows.flatMap(r=>r.cells))};
}

/** A COLUMN'S PART IN A JOIN, marked where the column is drawn: the key a relate matched on, or the column it brought
 *  across. The same marks as View this table's (`column-role-*`), so the Relate dialog's preview reads like its
 *  Before and After (2026-11-05). */
export type ColumnRoles=Readonly<Record<string,'key'|'brought'>>;
const roleOf=(roles:ColumnRoles|undefined,column:string)=>roles&&Object.hasOwn(roles,column)?roles[column]:undefined;
const roleAttr=(roles:ColumnRoles|undefined,column:string,also='')=>{const r=roleOf(roles,column);
  const classes=[also,r?`column-role-${r}`:''].filter(Boolean).join(' ');
  return (classes?` class="${classes}"`:'')+(r?` data-column-role="${r}"`:'');};
/** A HEADING IS THE COLUMN'S OWN NAME, with its confirmed label beneath (2026-11-14: "Let's make sure we use data
 *  dictionary labels in English"), never in its place: a reader checking the file finds the column it names. */
let headingLabels:DataTable['columns']|undefined;
/** THE PRESENTATION THE HEADINGS ARE WRITTEN TO (2026-11-28): a column's unit once, and its note's number. */
let headingPresent:{p?:TablePresentation;numbers:Map<string,number>}={numbers:new Map()};
const roleHead=(roles:ColumnRoles|undefined,column:string,esc:Escape,also='',means?:string,pairWith?:string)=>{const r=roleOf(roles,column);
  const meta=headingLabels?.[column],label=meta?.confirmed?meta.label?.trim():'';
  // The declared unit only where no meaning is written beside the name: a meaning already ends in its unit.
  const declared=!means&&!label&&meta?.confirmed?meta.unit:undefined;
  return `<th scope="col"${roleAttr(roles,column,also)}>${esc(column)}${pairWith?` (${esc(pairWith)})`:''}${headingMarks(column,headingPresent.p,esc,headingPresent.numbers,declared,pairWith)}${means?`<span class="meaning">: ${esc(means)}</span>`:''}`
    +(label&&label!==column?`<span class="column-label">${esc(label)}</span>`:'')
    +(r?`<span class="column-role">${r==='key'?'matched on':'brought across'}</span>`:'')+'</th>';};

/** PAGES THAT TURN. `dataTableMarkup` writes Previous rows and Next rows, and until 2026-11-08 only the Results view
 *  listened for them: in the import dialog's After table, Relate's preview and Select rows' preview they did nothing
 *  (the practitioner, importing South London's table). One listener on the container, so it survives the redraw it
 *  makes, and draws the table again at the page asked for. */
export function wireTablePages(container:HTMLElement|null|undefined,table:DataTable,esc:Escape,
    options:Omit<Parameters<typeof dataTableMarkup>[2]&object,'page'>={}):void{
  if(!container)return;
  container.onclick=event=>{
    const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-table-page]');
    if(!button||button.disabled||!container.contains(button))return;
    event.preventDefault();
    container.innerHTML=dataTableMarkup(table,esc,{...options,page:Number(button.dataset.tablePage)});
    scrollLongTables(container);
  };
}

/** PREVIOUS AND NEXT, under any view of a table longer than a page. */
const pager=(page:number,pages:number)=>pages>1?`<div class="table-page-group"><button class="button small" data-table-page="${page-1}" ${page===0?'disabled':''}>Previous rows</button><span role="status">Page ${page+1} of ${pages}</span><button class="button small" data-table-page="${page+1}" ${page+1>=pages?'disabled':''}>Next rows</button></div>`:'';
/** HOW MANY ROWS THE FRAME AND THE CROSS-TAB SHOW AT ONCE (2026-11-19). They drew every row: 25,000 rows were 325,971
 *  elements on the page, and ticking a key column in the Tabular data dialog took 8 s at 150,000 rows and over half an
 *  hour at 250,000, almost all of it the browser walking them. A table of up to this many rows looks as it did. */
export const FRAME_PAGE_ROWS=200;
/** HOW MANY ROWS `dataTableMarkup` DRAWS for a table, by the same choice it makes: a cross-tab where the shape allows,
 *  else the wide frame, else the rows as stored (PR 10's review: a preview counted from the frame offered "All 2" over a
 *  cross-tab of 12). */
/** THE COLUMNS `dataTableMarkup` DRAWS, unsearched, by the same choice: the cross-tab's row key and its columns, else the
 *  wide frame's subject, attributes and measures, else the keys and the value. Configure offers these, and the notes and
 *  the small-count rule are read against them, so a rule is set on a column a reader sees. `measureKey` is the key whose
 *  values head the measure columns, which a searched row is presented by. */
export function drawnColumns(table:DataTable):{columns:{name:string;number:boolean}[];measureKey?:string}{
  const grid=crossTab(table);
  if(grid)return {columns:[{name:grid.rowKey,number:false},...grid.columns.map(name=>({name,number:true}))],measureKey:grid.colKey};
  const frame=wideFrame(table);
  if(frame)return {columns:[{name:frame.subject,number:false},...frame.attributes.map(name=>({name,number:false})),
    ...frame.columns.map(name=>({name,number:true}))],measureKey:frame.measureKey};
  return {columns:[...table.keys.map(name=>({name,number:false})),...table.valueField?[{name:table.valueField,number:true}]:[]]};
}
export function shownRows(table:DataTable,assertTotals=false):number{
  const grid=crossTab(table,{assertCommensurable:assertTotals});
  if(grid)return grid.rows.length;
  return wideFrame(table)?.rows.length??table.rows.length;
}
export function dataTableMarkup(table:DataTable,esc:Escape,{query='',page=0,pageSize=40,assertTotals=false,roles,present,limit}:
  {query?:string;page?:number;pageSize?:number;assertTotals?:boolean;roles?:ColumnRoles;present?:TablePresentation;
   /** A preview's rows: the first this many, with no pager (Table's Configure…, PR 10's review). */ limit?:number}={}){
  // A VALUE AS THE TABLE'S PRESENTATION WRITES IT (Table 0.15.0): its precision and separators, an absent one in the
  // table's words, a number right-aligned. A cell the shape does not have at all keeps its dash.
  const value=(v:string|number|null,column:string,attributes:string)=>{const shown=presentValue(v,column,present,esc);
    return `<td${attributes}${shown.number?' data-number':''}${shown.absent?' data-absent':''}>${shown.html}</td>`;};
  headingLabels=table.columns;headingPresent={p:present,numbers:noteNumbers(present,[...table.keys,table.valueField])};
  const matching=query?table.rows.filter(row=>Object.values(row.key).some(v=>String(v).toLowerCase().includes(query.toLowerCase()))):table.rows;
  const pages=Math.max(1,Math.ceil(matching.length/pageSize)),shown=limit!==undefined?matching.slice(0,limit):matching.slice(page*pageSize,page*pageSize+pageSize);
  const unit=table.unit?esc(table.unit):'<span class="muted">unit unstated</span>';
  // The grid, where the shape allows one and nothing is being searched -- a filter is about
  // finding a row, and a matrix has no rows to page through in the same sense.
  const grid=query?null:crossTab(table,{assertCommensurable:assertTotals});
  // THE FRAME, where a tabulation is not available and nothing is being searched. Before this a
  // table with any number of keys but two fell through to the paged list of key-value pairs
  // below -- the internal long shape, shown to a reader who never asked for it. A relate result
  // has three keys, so the table a practitioner opens to check a join was the one they could
  // least read it in.
  const frame=grid||query?null:wideFrame(table);
  const framePages=(n:number)=>Math.max(1,Math.ceil(n/FRAME_PAGE_ROWS)),framePage=(n:number)=>Math.min(page,framePages(n)-1);
  const onPage=<T,>(rows:readonly T[])=>{if(limit!==undefined)return rows.slice(0,limit);const at=framePage(rows.length);return rows.slice(at*FRAME_PAGE_ROWS,(at+1)*FRAME_PAGE_ROWS);};
  const pages_=(at:number,n:number)=>limit!==undefined?'':pager(at,n);
  if(frame){
    // A COUNT AND ITS PERCENTAGE IN ONE CELL, where Presentation pairs them: the percentage column is folded into its count's.
    const {shown:measures,percentOf}=pairedColumns(frame.columns,present);
    const at=(c:string)=>frame.columns.indexOf(c);
    headingPresent={p:present,numbers:noteNumbers(present,[frame.subject,...frame.attributes,...frame.columns])};
    const cellOf=(r:WideFrame['rows'][number],c:string)=>{const v=r.cells[at(c)],pc=percentOf.get(c);
      if(v===undefined)return `<td${roleAttr(roles,c)}><span class="muted">\u2014</span></td>`;
      if(pc===undefined)return value(v,c,roleAttr(roles,c));
      const shown=pairedValue(v,r.cells[at(pc)]??null,c,pc,present,esc);
      return `<td${roleAttr(roles,c)}${shown.number?' data-number':''}${shown.absent?' data-absent':''}>${shown.html}</td>`;};
    return `<div class="table-meta muted">${frame.rows.length} rows \u00b7 `
      +`${esc(frame.subject)}${frame.attributes.length?' with '+frame.attributes.map(esc).join(', '):''}`
      +` \u00b7 ${frame.columns.length} variable${frame.columns.length===1?'':'s'} \u00b7 value in ${unit}</div>`
      +'<div class="table-scroll"><table class="wide-frame"><thead><tr>'
      +roleHead(roles,frame.subject,esc)
      // An attribute is marked, because it describes the subject rather than measuring it and a
      // reader totalling a column needs to know which columns are numbers.
      +frame.attributes.map(a=>roleHead(roles,a,esc,'frame-attribute')).join('')
      +measures.map(c=>roleHead(roles,c,esc,'',table.headings?.[c],percentOf.get(c))).join('')
      +'</tr></thead><tbody>'
      +onPage(frame.rows).map(r=>`<tr><th scope="row"${roleAttr(roles,frame.subject)}>${esc(r.label)}</th>`
        +r.attributes.map((a,i)=>`<td${roleAttr(roles,frame.attributes[i]!,'frame-attribute')}>${esc(a)}</td>`).join('')
        +measures.map(c=>cellOf(r,c)).join('')
        +'</tr>').join('')
      +'</tbody></table></div>'+pages_(framePage(frame.rows.length),framePages(frame.rows.length));}
  if(grid){
    // A COUNT AND ITS PERCENTAGE IN ONE CELL here too, where the measures are the columns (2026-11-28).
    const {shown:gridColumns,percentOf:gridPercent}=pairedColumns(grid.columns,present);
    const gi=(c:string)=>grid.columns.indexOf(c);
    const gridNotes=noteNumbers(present,grid.columns);
    // NO MARGIN THAT GIVES A HIDDEN COUNT AWAY (review of #8): a row of "[c] | 13 | 17" with its total beside it lets the
    // hidden count be worked out, and so do a column's total and the grand total. Until complementary suppression is
    // built, a table hiding any count shows no totals, and says why.
    const withheld=grid.grandTotal!==null&&anySuppressed(grid.rows.flatMap(r=>grid.columns.map((c,i)=>({column:c,value:r.cells[i]}))),present);
    const showTotals=grid.grandTotal!==null&&!withheld;
    const gridCell=(cells:readonly (number|null|undefined)[],c:string)=>{const v=cells[gi(c)],pc=gridPercent.get(c);
      if(v===undefined)return '<td><span class="muted">—</span></td>';
      if(pc===undefined)return value(v,c,'');
      const both=pairedValue(v,cells[gi(pc)]??null,c,pc,present,esc);
      return `<td${both.number?' data-number':''}${both.absent?' data-absent':''}>${both.html}</td>`;};
    return `<div class="table-meta muted">${table.rowCount} cells · ${esc(grid.rowKey)} by ${esc(grid.colKey)}`
      +` · value in ${unit}</div>`
      +`<table class="crosstab"><thead><tr>${roleHead(roles,grid.rowKey,esc)}`
      +gridColumns.map(c=>`<th scope="col">${esc(c)}${gridPercent.get(c)?` (${esc(gridPercent.get(c)!)})`:''}${headingMarks(c,present,esc,gridNotes,undefined,gridPercent.get(c))}${table.headings?.[c]?`<span class="meaning">: ${esc(table.headings[c]!)}</span>`:''}</th>`).join('')
      +(showTotals?'<th scope="col">Total</th>':'')
      +`</tr></thead><tbody>`
      // A ROW'S MEANING BESIDE ITS NAME, where the table carries one (a regression's terms, experiment 172).
      +onPage(grid.rows).map(r=>`<tr><th scope="row">${esc(r.label)}${table.meanings?.[r.label]?`<span class="meaning"> · ${esc(table.meanings[r.label]!)}</span>`:''}</th>`
        +gridColumns.map(c=>gridCell(r.cells,c)).join('')
        +(!showTotals||r.total===null?'':value(r.total,'Total',' class="crosstab-total"'))
        +'</tr>').join('')
      +`</tbody>`
      // The fourth row, where a reader looks for N.
      +(!showTotals?'':`<tfoot><tr><th scope="row">Total</th>`
        +gridColumns.map(c=>grid.columnTotals[gi(c)]??null).map(v=>v===null?'<td class="crosstab-total"><span class="muted">—</span></td>':value(v,'Total',' class="crosstab-total"')).join('')
        +value(grid.grandTotal,'Total',' class="crosstab-total"')+'</tr></tfoot>')
      +`</table>`+pages_(framePage(grid.rows.length),framePages(grid.rows.length))
      // WHO SAID THESE COULD BE ADDED. A reader checking a margin is entitled to know whether
      // the table claimed its values count the same thing or a person did, because the two carry
      // different weight -- and because the person can be wrong in a way the file cannot.
      +(withheld?`<p class="table-meta muted">Totals are not shown: with them, a count hidden as small could be worked out.</p>`:'')
      +(showTotals&&assertTotals&&!table.unit?.trim()
        ?`<p class="table-meta muted">Totals are shown because this step was told these values `
          +`count the same thing. The table states no unit, so nothing here checks that.</p>`:'');}
  // A TABLE WITH NO VALUE COLUMN, a layer's attributes, shows none: an empty "unknown" on every row said nothing.
  const valued=!!table.valueField;
  // A SEARCHED ROW IS PRESENTED BY ITS MEASURE (review of #8): searching shows the long rows, where the value's column is
  // the table's value field; a count hidden in the wide table under its measure's name was shown raw once searched.
  const measureKey=drawnColumns(table).measureKey;
  const columnOf=(row:{key:Record<string,unknown>})=>measureKey&&row.key[measureKey]!==undefined?String(row.key[measureKey]):table.valueField;
  return `<div class="table-meta muted">${matching.length} of ${recordsSaid(table)}${valued&&table.missingValueCount?` · ${table.missingValueCount} values absent and kept as unknown`:''}${valued?` · value in ${unit}`:''}</div>`
    +`<table><thead><tr>${table.keys.map(k=>roleHead(roles,k,esc)).join('')}${valued?roleHead(roles,table.valueField,esc):''}</tr></thead><tbody>`
    // A CELL EDITED BY HAND IS MARKED, with what it was on hover (experiment 214).
    +shown.map(row=>{const edited=(row as {edited?:EditedCells}).edited;
      const cell=(c:string)=>roleAttr(roles,c,edited?.[c]?'cell-edited':'')+(edited?.[c]?` data-cell-edited title="${esc(editedTitle(edited[c]!))}"`:'');
      return `<tr>${table.keys.map(k=>`<td${cell(k)}>${esc(row.key[k])}</td>`).join('')}${valued?value(row.value,columnOf(row),cell(table.valueField)):''}</tr>`;}).join('')
    +`</tbody></table>`+(limit!==undefined?'':pager(page,pages));
}

/** THE TABLE A REMOTE SPEC DESCRIBES, re-read from its fetched file with the settings it was first read with: the
 *  same shape, keys, value column and key roles, so a second device gets the same table. Experiment 170. */
export async function tableFromFetched(file:File,settings:{keys:string[];valueField:string;unit?:string;sheet?:string;
  wide?:WideChoice;primaryKey?:string[];secondaryKeys?:string[]}):Promise<{data:DataTable;sourceTable?:TableRows}>{
  // The same sheet of a workbook as was first read, or the first that has a header row.
  const workbook=/\.xlsx$/i.test(file.name)?readXlsx(new Uint8Array(await file.arrayBuffer())).filter(s=>s.headers.length):undefined;
  const sheet=workbook?(workbook.find(s=>s.name===settings.sheet)??workbook[0]):undefined;
  if(workbook&&!sheet)throw new Error('This workbook has no sheet with a header row.');
  if(workbook&&settings.sheet&&sheet!.name!==settings.sheet)throw new Error(`This workbook has no sheet "${settings.sheet}".`);
  const parsed:TableRows=/\.dta$/i.test(file.name)?readStata(new Uint8Array(await file.arrayBuffer()))
    :sheet?{headers:sheet.headers,rows:sheet.rows}:await readTextFile(file).then(r=>({...parseCSV(r.text,MAX_TABLE_ROWS,FILE_BYTES),...(r.encoding?{encoding:r.encoding}:{})}));
  const roles={...(settings.primaryKey?.length?{primaryKey:settings.primaryKey}:{}),...(settings.secondaryKeys?.length?{secondaryKeys:settings.secondaryKeys}:{})};
  if(settings.wide){
    const data=wideDataTable(parsed,{keys:settings.wide.keys,valueFields:settings.wide.valueFields,measureKey:settings.wide.measureKey,
      valueField:settings.valueField,...roles,...(settings.unit?{unit:settings.unit}:{})});
    return {data,sourceTable:{headers:parsed.headers.map(h=>h.trim()),rows:parsed.rows}};
  }
  return {data:dataTable(parsed,{keys:settings.keys,valueField:settings.valueField,...roles,...(settings.unit?{unit:settings.unit}:{})})};
}

/** TABLE INPUT'S ONE SENTENCE: what it reads, in what shape, and in what unit (experiment 186). */
export function tableSentence(p:WorkflowNode<'table_input'>['params']):string{
  const from=p.remote?new URL(p.remote.url).hostname:'';
  const file=p.remote?.entry?.split('/').at(-1)||p.source?.filename||(p.remote?p.remote.url.split('/').at(-1):'');
  if(!p.keys.length&&!p.remote)return 'No table yet: import one in Configure\u2026';
  const what=`Reads ${file||'a table'}${(p.source?.sheet??p.data.source?.sheet)?`, sheet ${p.source?.sheet??p.data.source?.sheet}`:''}${from?` from ${from}`:''}`;
  const shape=p.wide
    ?`wide: one row per ${p.wide.keys.join(' and ')}, ${p.wide.valueFields.length} variable${p.wide.valueFields.length===1?'':'s'}`
    :`long: one row per ${p.keys.join(', ')}, values in ${p.valueField}`;
  const unit=p.unit?.trim()?`, in ${p.unit.trim()}`:', unit unstated';
  return `${what}, ${shape}${unit}${p.convertOnRun&&p.sourceTable?', converted on each run':''}.`;
}

/** WHAT TABULAR DATA'S INSPECTOR IS GIVEN (2026-11-20, moved out of app.ts with the census tables and the choices that
 *  belong to a step's own table). Configure… stays in app.ts, because it writes the rows to this device's store before
 *  the step points at them. */
export interface TableKit extends StepKit {
  /** Where the rows shown came from this time: this device's copy, or the source. */
  readFrom:(nodeId:string)=>'device'|'source'|undefined;
  /** Whether any step reads the table. */
  feeds:(nodeId:string)=>boolean;
  /** This device's store: the rows, then the dictionary, kept before the step points at them. */
  keepRows:(data:DataTable)=>Promise<boolean>;
  keepDictionary:(dictionary:TableDictionary)=>Promise<boolean>;
  /** A change that must reach storage: false where it could not be kept. */
  keepSaved:(edit:(w:Workflow)=>void)=>boolean;
  /** The project lists a dictionary read with a table. */
  listDictionary:(nodeId:string,dictionary:TableDictionary,filename:string)=>void;
  dhis2:NonNullable<TableFrame['dhis2']>;
}
/** THE STANDARD INSPECTOR (experiment 186): what the step is called, one sentence of what it reads, Configure… for the
 *  import, and what it holds. A source step has no inputs. Fetch the table is a button of its own, not a word in a
 *  notice: inline in the orange text, the practitioner could not see it as a button (2026-11-08). The buttons under
 *  Result are wired by the application, as they are for Point data. */
export const tableInspector:OwnInspector<'table_input'>={
  markup:(n,kit)=>{const k=kit as TableKit,p=n.params,esc=kit.esc;
    const host=p.remote?new URL(p.remote.url).hostname:'';
    const waiting=!!p.remote&&!p.data.rows.length,read=k.readFrom(n.id);
    // SETTINGS AS EVERY STANDARD WIDGET'S (2026-11-12, the practitioner: "The Table input inspector configure button is not
    // standardized"): the sentence, where the table comes from, and Configure… last, primary. Fetching the rows is about
    // what the step holds, so Fetch the table is under Result, beside "Not fetched yet."
    let html=kit.section('Name',kit.name('table-label',p.label||'Tabular data'))
      +kit.section('Settings',`<p class="standard-sentence">${esc(tableSentence(p))}</p>`
      +(p.remote?`<p class="description" data-table-remote>From <a href="${esc(p.remote.url)}" rel="noopener" target="_blank">${esc(host)}</a>`
        +`${p.remote.entry?`, ${esc(p.remote.entry.split('/').at(-1)??'')}`:''}. The project keeps where it came from, not the rows.`
        // WHERE THESE ROWS CAME FROM THIS TIME, said where it stays: a line written beside the button was erased by the
        // redraw that showed the rows, so a read from the device looked like another download (2026-11-04).
        +(read==='device'?' These rows were read from the copy on this device, checked by its digest: nothing was downloaded.'
          :read==='source'?` These rows were downloaded from ${esc(host)}, and the file is now kept on this device.`:'')
        +'</p>':'')
      +'<div class="inspector-actions"><button id="configure-step" class="button primary">Configure…</button></div>');
    // RESULT: what the step holds, counted, and where to look closer.
    if(p.data.rows.length){
      const columns=describableColumns(p.data,p.wide),described=columns.filter(c=>isDescribed(p.columns?.[c])).length;
      const proposed=columns.filter(c=>p.columns?.[c]&&!p.columns[c]!.confirmed).length;
      const findings=p.data.findings?.filter(f=>f.kind!=='undescribed-column'&&f.kind!=='unconfirmed-description')??[];
      html+=kit.section('Result',`<p class="standard-result${findings.length?' standard-result-warning':''}">`
        +`${esc(`${recordsSaid(declaredWide(p.data,p.wide))}, ${p.data.missingValueCount.toLocaleString('en-US')} values absent and kept as unknown.`)}</p>`
        +(findings.length?`<p class="standard-state" data-table-findings>Data quality: ${esc(findingsSummary(p.data))}. The rows are kept as they stand.</p>`:'')
        +`<p class="standard-state" data-table-meaning>What the columns mean: ${described} of ${columns.length} described`
          +(proposed?`, ${proposed} proposed and not yet accepted`:'')+'.'
          +(described<columns.length?' A column nobody has described is a data quality finding.':'')+'</p>'
        +(p.dictionary?`<p class="standard-state" data-table-dictionary>Data dictionary: ${esc(p.dictionary.name)}, ${p.dictionary.sheets[0]?.rows.length??0} variables.</p>`:'')
        +'<div class="inspector-actions"><button id="quick-look" class="button">Quick look at the table</button>'
        +'<button id="table-quality" class="button">Data quality</button>'
        +'<button id="describe-columns" class="button">Describe columns…</button>'
        +(p.dictionary?'<button id="view-dictionary" class="button">View the data dictionary</button>':'')+'</div>'
        +(!k.feeds(n.id)?'<div class="inspector-actions"><button id="add-table-view" class="button small">＋ Display as table</button></div>':'')
        +'<div data-standard-result></div>');
    }else html+=kit.section('Result',`<p class="standard-result">${waiting?'Not fetched yet.':'No table imported yet. This step cannot run until a table is imported.'}</p>`
      // THE ONE THING TO DO NEXT, so it looks like it (2026-11-14: "the Fetch the table is there, just not conspicuous").
      +(waiting?'<div class="inspector-actions"><button id="table-fetch-remote" class="button primary">Fetch the table</button></div>'
        +'<p class="description">A file already on this device is read from there, without downloading it.</p>':'')
      +'<p id="table-fetch-status" class="description" role="status"></p>');
    return html;},
  wire:(n,kit,root)=>{root.querySelector('#configure-step')?.addEventListener('click',()=>openTableStep(n.id,kit as TableKit));},
};
/** TABULAR DATA'S CONFIGURE… (moved from app.ts 2026-11-20): it writes the rows and the dictionary to this device's
 *  store, through the kit, before the step points at them. */
export function openTableStep(nodeId:string,kit:TableKit):void{
  const node=(w:Workflow)=>{const x=w.nodes.find(m=>m.id===nodeId);if(x?.type!=='table_input')throw new Error('This step is no longer in the workflow.');return x as WorkflowNode<'table_input'>;};
  const n=node(kit.workflow());
  {
    const baseline=JSON.stringify(kit.workflow()),current=n.params;
    openTableEditor(async result=>{
      if(JSON.stringify(kit.workflow())!==baseline)throw new Error('The workflow changed. Close this and choose Configure\u2026 again.');
      // THE ROWS ARE KEPT FIRST, as every other input keeps its data before the step points at it. The save then stores a
      // reference to rows already written: found 2026-11-08, when a reload straight after Save found a reference to rows
      // whose write had not committed, and the table was gone (CI, two runs of three).
      if(result.data.rows.length&&!await kit.keepRows(result.data))
        throw new Error('This table could not be kept on this device, so it was not added. Export the project to keep it.');
      // ITS DATA DICTIONARY, kept the same way and listed by the project (experiment 211).
      if(result.dictionary&&!await kit.keepDictionary(result.dictionary))
        throw new Error('The data dictionary could not be kept on this device, so the table was not added.');
      const kept=kit.keepSaved(w=>{const params=node(w).params;
        params.data=result.data;params.keys=result.keys;params.valueField=result.valueField;if(result.valueColumn)params.valueColumn=result.valueColumn;else delete params.valueColumn;if(result.provenance)params.provenance=result.provenance;params.unit=result.unit;params.source=result.source;
        // The shape the FILE was in, so the editor reopens in it and the receipt can cite the
        // columns taken. Deleted rather than set undefined when a table is re-read as long: a
        // stored `wide` block that no longer describes the table is a claim, and core.ts refuses
        // one that disagrees with the keys.
        if(result.wide)params.wide=result.wide;else delete params.wide;
        if(result.remote)params.remote=result.remote;else delete params.remote;
        // WHAT WAS TYPED, kept beside the rows: reopening a short table should show it, not an empty box.
        if(result.typedText)params.typedText=result.typedText;else delete params.typedText;
        if(result.distinctValuesFor?.length)params.distinctValuesFor=result.distinctValuesFor;else delete params.distinctValuesFor;
        // The file's own labels as proposals; what the practitioner has accepted is never replaced by them.
        if(result.proposed){const held=params.columns??{};
          params.columns={...result.proposed,...Object.fromEntries(Object.entries(held).filter(([,m])=>m.confirmed))};}
        // The file as published, kept whenever it was read as wide, so `convertOnRun` has
        // something to convert and the node can say what it was made from either way.
        if(result.source_table){params.sourceTable=result.source_table;
          if(result.source?.sha256)params.sourceRef=`source:${result.source.sha256}`;else delete params.sourceRef;}
        else{delete params.sourceTable;delete params.sourceRef;delete params.convertOnRun;}
        if(result.source_table){if(result.convertOnRun)params.convertOnRun=true;else delete params.convertOnRun;}
        if(result.dictionary){params.dictionary=result.dictionary;params.dictionaryRef=dictionaryKeyOf(result.dictionary.sha256);}
        if(result.dictionaryCheck)params.dictionaryCheck=result.dictionaryCheck;});
      if(kept&&result.dictionary)kit.listDictionary(n.id,result.dictionary,result.source.filename);
      return kept;
    },current.keys.length?{keys:current.keys,valueField:current.valueField,...(current.valueColumn?{valueColumn:current.valueColumn}:{}),unit:current.unit,primaryKey:current.data.primaryKey,secondaryKeys:current.data.secondaryKeys,
      ...(current.wide?{wide:current.wide}:{}),...(current.distinctValuesFor?.length?{distinctValuesFor:current.distinctValuesFor}:{}),
        ...(current.remote?{remote:current.remote}:{}),
        ...(current.typedText?{typedText:current.typedText}:{})}:undefined,
    // THE STANDARD FRAME: the step's own name, and the one setting that can be applied without reading the file again.
    {dhis2:kit.dhis2,
      step:current.label||'Tabular data',convertOnRun:!!current.convertOnRun,hasSource:!!current.sourceTable,
      onConvertOnRun:on=>{kit.change(w=>{const p=node(w).params;if(on)p.convertOnRun=true;else delete p.convertOnRun;});return true;}});
  }
}
