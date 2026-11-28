/** A TABLE PRESENTED TO A STANDARD (Table 0.15.0, 2026-11-27). The practitioner: *"Since table outputs are render facing,
 *  we should be able to style them according to established table presentation standards"*, and *"We want tables to
 *  really look pretty but also vision impaired friendly."* The rules the standards agree on are applied by every Table
 *  (docs/research/table-presentation-standards-2026-11-27.md): a caption above, header cells, numbers right-aligned in
 *  equal-width digits with one precision a column and thousands separators, few rules and none vertical, notes and
 *  the source below. What the standards leave to the author is set here, in Configure…'s Presentation section. */
import type {Escape} from './types.js';

export interface TablePresentation {
  /** The table's title: what, where and when. The Table's name when unset. */
  caption?:string;
  /** Definitions, exclusions and anything a reader needs, below the table. */
  notes?:string;
  /** Where the numbers come from, below the notes. */
  source?:string;
  /** Decimal places for the values, the same in every row; as recorded when unset. */
  decimals?:number;
  /** Thousands separators from four digits (1,234). On unless turned off; never on a year. */
  separators?:boolean;
  /** How an absent value is written. */
  absent?:'unknown'|'dash'|'blank';
  /** A light shade on every other row, to follow a row across a wide table. */
  shade?:boolean;
  /** WHAT IS SET FOR ONE COLUMN (2026-11-28, the table standard's open items): its decimal places, over the table's; its
   *  unit or denominator, written once in its heading; and a note on it, marked "[note 1]" in the heading and written
   *  below, the Analysis Function's way, because a screen reader passes over a superscript letter or a dagger. */
  columns?:Record<string,ColumnPresentation>;
  /** SMALL CELLS NOT SHOWN: in the columns named, a count from 1 to `below` − 1 is written [c], for confidentiality, or
   *  [u], too few to be reliable, and a note below says which and where. Zero is shown. The data are not changed; a
   *  draft's attached CSV is written the same way, so what is hidden on the page is not handed on beside it. */
  suppress?:{below:number;columns:string[];reason:'confidentiality'|'reliability'};
  /** A COUNT AND ITS PERCENTAGE IN ONE CELL, "120 (34.5)", as MMWR sets them, for the pairs named; two cells otherwise,
   *  as the data hold them. A CSV always keeps them apart, one value a cell. */
  pairs?:{count:string;percent:string}[];
}
export interface ColumnPresentation {
  /** Decimal places for this column, 0 to 6; the table's when unset. */
  decimals?:number;
  /** Its unit or denominator, once in the heading: "per 100,000", "km", "%". The column's declared unit when unset. */
  unit?:string;
  /** A note on this column, numbered in the heading and written below the table. */
  note?:string;
}
export const SUPPRESSION_REASONS={confidentiality:{mark:'[c]',said:'not shown, for confidentiality'},
  reliability:{mark:'[u]',said:'not shown: too few to be reliable'}} as const;

/** A DASH UNLESS TOLD OTHERWISE: an absent value is not written as words a reader could take for data (the practitioner,
 *  2026-10-21, on "Not supplied": *"was the data missing or field empty value and we supplied that value as a
 *  replacement?"*). The dash is read aloud as "no value" and drawn apart from the data. */
export const ABSENT_CHOICES:Record<NonNullable<TablePresentation['absent']>,string>={
  dash:'A dash (—), read aloud as "no value"',unknown:'The word "unknown"',blank:'Left blank'};

/** A saved presentation, checked as it opens: an unknown setting refuses the workflow rather than vanishing from it. */
export function validatePresentation(value:unknown):asserts value is TablePresentation{
  if(typeof value!=='object'||value===null||Array.isArray(value))throw new Error('A table\'s presentation is a set of named settings.');
  const p=value as Record<string,unknown>;
  for(const key of Object.keys(p))
    if(!['caption','notes','source','decimals','separators','absent','shade','columns','suppress','pairs'].includes(key))throw new Error(`A table's presentation has no setting "${key}".`);
  for(const [key,max] of [['caption',200],['notes',2000],['source',500]] as const)
    if(p[key]!==undefined&&(typeof p[key]!=='string'||(p[key] as string).length>max))throw new Error(`A table's ${key} is text of at most ${max} characters.`);
  if(p.decimals!==undefined&&(!Number.isInteger(p.decimals)||(p.decimals as number)<0||(p.decimals as number)>6))
    throw new Error('Decimal places run from 0 to 6.');
  for(const key of ['separators','shade'] as const)if(p[key]!==undefined&&typeof p[key]!=='boolean')throw new Error(`A table's ${key} setting is on or off.`);
  if(p.absent!==undefined&&!Object.keys(ABSENT_CHOICES).includes(p.absent as string))throw new Error('Choose how an absent value is written: unknown, a dash, or blank.');
  if(p.columns!==undefined){
    if(typeof p.columns!=='object'||p.columns===null||Array.isArray(p.columns))throw new Error('A table\'s column settings are named by column.');
    for(const [column,c] of Object.entries(p.columns as Record<string,unknown>)){
      if(typeof c!=='object'||c===null||Array.isArray(c))throw new Error(`The settings for column "${column}" are a set of named settings.`);
      const set=c as Record<string,unknown>;
      for(const key of Object.keys(set))if(!['decimals','unit','note'].includes(key))throw new Error(`A column's presentation has no setting "${key}".`);
      if(set.decimals!==undefined&&(!Number.isInteger(set.decimals)||(set.decimals as number)<0||(set.decimals as number)>6))
        throw new Error(`Decimal places for "${column}" run from 0 to 6.`);
      for(const [key,max] of [['unit',60],['note',500]] as const)
        if(set[key]!==undefined&&(typeof set[key]!=='string'||(set[key] as string).length>max))throw new Error(`The ${key} for "${column}" is text of at most ${max} characters.`);
    }
  }
  if(p.suppress!==undefined){
    const q=p.suppress as Record<string,unknown>;
    if(typeof q!=='object'||q===null||!Number.isInteger(q.below)||(q.below as number)<2||(q.below as number)>1000)
      throw new Error('Small cells are hidden below a whole number from 2 to 1,000.');
    if(!Array.isArray(q.columns)||!q.columns.every(c=>typeof c==='string'))throw new Error('Name the columns whose small cells are hidden.');
    if(!Object.keys(SUPPRESSION_REASONS).includes(q.reason as string))throw new Error('Say why small cells are hidden: confidentiality or reliability.');
  }
  if(p.pairs!==undefined&&(!Array.isArray(p.pairs)||!p.pairs.every(x=>typeof x==='object'&&x!==null&&typeof (x as {count?:unknown}).count==='string'&&typeof (x as {percent?:unknown}).percent==='string')))
    throw new Error('A count and its percentage are paired by naming both columns.');
}

/** A COUNT HIDDEN AS SMALL, or undefined: in a suppressed column, a number from 1 up to the threshold. */
export function suppressedMark(value:unknown,column:string,p:TablePresentation|undefined):string|undefined{
  const q=p?.suppress;
  if(!q||typeof value!=='number'||!q.columns.includes(column))return undefined;
  return value>0&&value<q.below?SUPPRESSION_REASONS[q.reason].mark:undefined;
}

/** A column read as years is never given a separator: 2,026 is not a year. */
const YEARS=/(^|[^a-z])(year|yr|yyyy)([^a-z]|$)/i;
const NUMBER=/^-?(\d+\.?\d*|\.\d+)$/;

/** One value, written to the table's presentation: its text, and whether it is a number (right-aligned) or absent.
 *  `measure` is false for identifiers and coordinates, which keep their own digits but still align as numbers. */
export function presentValue(value:unknown,column:string,p:TablePresentation|undefined,esc:Escape,{measure=true}={}):{html:string;number:boolean;absent:boolean}{
  if(value===null||value===undefined||value==='')
    return {absent:true,number:false,html:(p?.absent??'dash')==='blank'?'':(p?.absent??'dash')==='dash'?'<span aria-label="no value">—</span>':'unknown'};
  // TEXT IS SHOWN AS WRITTEN (PR 10's review): "00123" is an identifier, not 123, and a long code loses digits through
  // Number. A text that reads as a number is only aligned as one.
  if(typeof value!=='number'){const text=String(value);return {html:esc(text),number:NUMBER.test(text.trim()),absent:false};}
  const hidden=suppressedMark(value,column,p);
  if(hidden)return {html:`<span aria-label="${p!.suppress!.reason==='confidentiality'?'not shown, a small count':'not shown, too few to be reliable'}">${hidden}</span>`,number:true,absent:false};
  // ONE COLUMN'S DECIMAL PLACES OVER THE TABLE'S.
  const decimals=p?.columns?.[column]?.decimals??p?.decimals;
  if(decimals!==p?.decimals)p={...p,decimals};
  if(!Number.isFinite(value))return {html:esc(String(value)),number:false,absent:false};
  if(!measure)return {html:esc(String(value)),number:true,absent:false};
  // A NUMBER KEEPS ITS PRECISION unless decimal places are chosen: 7e-8 is not 0. Separators go into the whole part only.
  if(p?.decimals===undefined){
    const said=String(value);
    if(/e/i.test(said)||p?.separators===false||YEARS.test(column)||Math.abs(value)<1000)return {html:esc(said),number:true,absent:false};
    const [whole,fraction]=said.split('.');
    return {html:esc(whole!.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(fraction!==undefined?`.${fraction}`:'')),number:true,absent:false};
  }
  const grouped=p.separators!==false&&!YEARS.test(column)&&Math.abs(value)>=1000;
  return {html:esc(value.toLocaleString('en',{minimumFractionDigits:p.decimals,maximumFractionDigits:p.decimals,useGrouping:grouped})),number:true,absent:false};
}
/** One cell, as a <td>. */
export function presentCell(value:unknown,column:string,p:TablePresentation|undefined,esc:Escape,options:{measure?:boolean}={}):string{
  const v=presentValue(value,column,p,esc,options);
  return `<td${v.absent?' class="absent-cell"':v.number?' class="number"':''}${v.absent&&!v.html?' aria-label="no value"':''}>${v.html}</td>`;
}

/** A COLUMN'S UNIT, once, in its heading: what Presentation sets for it, else what its declaration says. */
export const columnUnit=(column:string,p:TablePresentation|undefined,declared?:string):string|undefined=>
  p?.columns?.[column]?.unit?.trim()||declared?.trim()||undefined;
/** The columns carrying a note, numbered in the order the table shows them. */
export function noteNumbers(p:TablePresentation|undefined,columns:readonly string[]):Map<string,number>{
  const numbers=new Map<string,number>();
  for(const c of columns)if(p?.columns?.[c]?.note?.trim()&&!numbers.has(c))numbers.set(c,numbers.size+1);
  return numbers;
}
/** WHAT FOLLOWS A COLUMN'S NAME IN ITS HEADING: its unit in brackets and its note's number, "Rate (per 100,000) [note 1]".
 *  The name is never replaced. */
export function headingMarks(column:string,p:TablePresentation|undefined,esc:Escape,numbers:Map<string,number>,declaredUnit?:string):string{
  const unit=columnUnit(column,p,declaredUnit),n=numbers.get(column);
  return (unit?` (${esc(unit)})`:'')+(n?` <span class="table-note-mark">[note ${n}]</span>`:'');
}
/** WHAT IS WRITTEN BELOW A TABLE, in the standards' order: the column notes by number, what the small-cell marks mean,
 *  the table's notes, then the source. */
export function tableNotesHtml(p:TablePresentation|undefined,columns:readonly string[],esc:Escape):string{
  const numbers=noteNumbers(p,columns);
  const lines=[...numbers].map(([c,n])=>`[note ${n}] ${esc(p!.columns![c]!.note!.trim())}`);
  const q=p?.suppress,hidden=q?q.columns.filter(c=>columns.includes(c)):[];
  if(q&&hidden.length)lines.push(`${SUPPRESSION_REASONS[q.reason].mark} In ${hidden.map(esc).join(', ')}, a count from 1 to ${q.below-1} is ${SUPPRESSION_REASONS[q.reason].said}.`);
  return lines.map(line=>`<p class="table-notes">${line}</p>`).join('')
    +(p?.notes?`<p class="table-notes">${esc(p.notes)}</p>`:'')
    +(p?.source?`<p class="table-notes">Source: ${esc(p.source)}</p>`:'');
}

/** THE COLUMNS AS SHOWN, a paired percentage folded into its count's cell. Only a pair whose two columns are both in the
 *  table is folded; the percentage is then not shown on its own. */
export function pairedColumns(columns:readonly string[],p:TablePresentation|undefined):{shown:string[];percentOf:Map<string,string>}{
  const percentOf=new Map<string,string>();
  for(const pair of p?.pairs??[])if(columns.includes(pair.count)&&columns.includes(pair.percent)&&pair.count!==pair.percent)percentOf.set(pair.count,pair.percent);
  const folded=new Set(percentOf.values());
  return {shown:columns.filter(c=>!folded.has(c)),percentOf};
}
/** A count and its percentage in one cell: "120 (34.5)", each written as its own column would write it. */
export function pairedValue(count:unknown,percent:unknown,countColumn:string,percentColumn:string,p:TablePresentation|undefined,esc:Escape):{html:string;number:boolean;absent:boolean}{
  const c=presentValue(count,countColumn,p,esc),pc=presentValue(percent,percentColumn,p,esc);
  if(c.absent)return c;
  return {html:pc.absent?c.html:`${c.html} (${pc.html})`,number:true,absent:false};
}

/** The caption above and the notes and source below, around a table's markup. `columns` are the table's, in order, for
 *  the column notes and the small-cell note. */
export function presentedTable(p:TablePresentation|undefined,fallbackCaption:string,table:string,esc:Escape,columns:readonly string[]=[]):string{
  const caption=(p?.caption||fallbackCaption).trim();
  return `<div class="table-presented${p?.shade?' table-shaded':''}">`
    +(caption?`<p class="table-caption">${esc(caption)}</p>`:'')
    +table
    +tableNotesHtml(p,columns,esc)
    +'</div>';
}

/** A column as Configure… offers it: its name, and whether it holds numbers. */
export interface PresentableColumn {name:string; number:boolean; declaredUnit?:string}

/** EACH COLUMN, AND THE SMALL COUNTS: decimal places, unit and a note per column; a percentage shown in its count's cell;
 *  and the threshold below which a count is not shown. In a disclosure, so a table of thirty columns does not push the
 *  rest of the dialog away. */
function columnFields(p:TablePresentation,columns:readonly PresentableColumn[],esc:Escape,canPair:boolean):string{
  if(!columns.length)return '';
  const numbers=columns.filter(c=>c.number);
  const pairOf=(c:string)=>p.pairs?.find(x=>x.count===c)?.percent??'';
  const rows=columns.map((c,i)=>{const set=p.columns?.[c.name]??{};
    return `<tr data-column="${esc(c.name)}"><th scope="row">${esc(c.name)}</th>`
      +`<td>${c.number?`<label class="visually-hidden" for="present-col-${i}-decimals">Decimal places for ${esc(c.name)}</label>`
        +`<select id="present-col-${i}-decimals" data-col-decimals><option value=""${set.decimals===undefined?' selected':''}>As the table</option>`
        +[0,1,2,3].map(n=>`<option value="${n}"${set.decimals===n?' selected':''}>${n}</option>`).join('')+'</select>':''}</td>`
      +`<td><label class="visually-hidden" for="present-col-${i}-unit">Unit for ${esc(c.name)}</label>`
        +`<input id="present-col-${i}-unit" data-col-unit maxlength="60" placeholder="${esc(c.declaredUnit??'')}" value="${esc(set.unit??'')}"></td>`
      +`<td><label class="visually-hidden" for="present-col-${i}-note">Note on ${esc(c.name)}</label>`
        +`<input id="present-col-${i}-note" data-col-note maxlength="500" value="${esc(set.note??'')}"></td>`
      +(canPair?`<td>${c.number&&numbers.length>1?`<label class="visually-hidden" for="present-col-${i}-pair">Percentage shown with ${esc(c.name)}</label>`
        +`<select id="present-col-${i}-pair" data-col-pair><option value="">None</option>`
        +numbers.filter(o=>o.name!==c.name).map(o=>`<option value="${esc(o.name)}"${pairOf(c.name)===o.name?' selected':''}>${esc(o.name)}</option>`).join('')+'</select>':''}</td>`:'')+'</tr>';}).join('');
  const q=p.suppress;
  return `<details class="present-columns"${p.columns||p.pairs?' open':''}><summary>Each column: decimal places, unit, note</summary>`
    +`<div class="table-scroll" tabindex="0" role="region" aria-label="Settings for each column"><table class="table-standard"><thead><tr>`
    +'<th scope="col">Column</th><th scope="col">Decimal places</th><th scope="col">Unit or denominator</th><th scope="col">Note</th>'+(canPair?'<th scope="col">Its percentage, in the same cell</th>':'')
    +`</tr></thead><tbody>${rows}</tbody></table></div></details>`
    +(numbers.length?`<details class="present-suppress"${q?' open':''}><summary>Small counts not shown</summary>`
      +`<div class="field"><label class="field-label" for="present-suppress-below">Hide a count from 1 up to, but not including</label>`
      +`<input id="present-suppress-below" type="number" min="2" max="1000" step="1" value="${q?.below??''}" placeholder="Off"></div>`
      +`<div class="field"><label class="field-label" for="present-suppress-reason">Why</label><select id="present-suppress-reason">`
      +Object.entries(SUPPRESSION_REASONS).map(([k,r])=>`<option value="${k}"${(q?.reason??'confidentiality')===k?' selected':''}>${r.mark} ${esc(r.said.replace(/^not shown(, |: )/,''))}</option>`).join('')+'</select></div>'
      +`<fieldset class="field"><legend class="field-label">In these columns</legend>`
      +numbers.map((c,i)=>`<label class="check"><input type="checkbox" data-suppress-column="${esc(c.name)}" id="present-suppress-${i}"${q?.columns.includes(c.name)?' checked':''}> ${esc(c.name)}</label>`).join('')
      +'</fieldset><p class="description">Zero is still shown. The table\'s values are not changed; a note below the table says which counts are hidden and why.</p></details>':'');
}

/** The Presentation section of Configure…, on a draft. */
export function presentationFields(p:TablePresentation,fallbackCaption:string,esc:Escape,columns:readonly PresentableColumn[]=[],
  /** Whether this table can show a count and its percentage in one cell: a table of rows does; points and areas do not. */
  canPair=false):string{
  return `<div class="field"><label class="field-label" for="present-caption">Title: what, where and when</label>`
    +`<input id="present-caption" maxlength="200" placeholder="${esc(fallbackCaption)}" value="${esc(p.caption??'')}"></div>`
    +`<div class="field"><label class="field-label" for="present-decimals">Decimal places for the values</label>`
    +`<select id="present-decimals"><option value=""${p.decimals===undefined?' selected':''}>As recorded</option>`
    +[0,1,2,3].map(n=>`<option value="${n}"${p.decimals===n?' selected':''}>${n}</option>`).join('')+`</select></div>`
    +`<label class="check"><input type="checkbox" id="present-separators"${p.separators!==false?' checked':''}> Thousands separators (1,234), never on a year</label>`
    +`<div class="field"><label class="field-label" for="present-absent">An absent value is written</label>`
    +`<select id="present-absent">${Object.entries(ABSENT_CHOICES).map(([k,said])=>`<option value="${k}"${(p.absent??'dash')===k?' selected':''}>${esc(said)}</option>`).join('')}</select></div>`
    +`<label class="check"><input type="checkbox" id="present-shade"${p.shade?' checked':''}> Shade every other row</label>`
    +`<div class="field"><label class="field-label" for="present-notes">Notes below the table</label>`
    +`<textarea id="present-notes" rows="3" maxlength="2000">${esc(p.notes??'')}</textarea></div>`
    +`<div class="field"><label class="field-label" for="present-source">Source</label>`
    +`<input id="present-source" maxlength="500" value="${esc(p.source??'')}"></div>`
    +columnFields(p,columns,esc,canPair);
}
