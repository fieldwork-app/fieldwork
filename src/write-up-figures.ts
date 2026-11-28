/** THE ARTIFACT ITSELF, IN THE WRITE-UP.
 *
 *  The practitioner, 2026-10-30, after three rounds of being told this was built: *"We are still
 *  far from making progress - charts, maps and tables are not there."*
 *
 *  **AND THEY WERE NOT.** `artifact-notes.ts` machines a sentence ABOUT each artifact -- 32 rows
 *  keyed by group, 4 layers bottom to top, 32 bars one per group -- and that sentence is what
 *  landed in Results. Measured in the running application on 2026-10-30, the Notes view held 70
 *  typeset equations, 0 tables, 0 charts and 0 maps. The equations had appeared because for an
 *  equation the description IS the artifact; for a table it is not, and nothing had noticed.
 *
 *  The instruction that produced the wrong thing was *"add the tables next, then maps, then
 *  charts as machined notes"*, read as "prose a widget machines" when it meant the artifact lands
 *  in the write-up. The description is not withdrawn -- it is the material a caption is written
 *  from, which is what 141 settled it was for -- but it is no longer the whole of what Results
 *  carries.
 *
 *  RENDERED FROM THE RUN, NOT STORED. The practitioner chose a live render over a figure captured
 *  at run time, and the write-up store deliberately keeps notes and never run outputs: six
 *  workflows of geometry and rasters would put megabytes in `localStorage` to show a paragraph.
 *  So a figure is drawn from the run held in memory, and a workflow that has not run this session
 *  shows its description and no figure -- which is what the Run control on the Notes tab is for.
 *  The cost is stated rather than hidden: a reloaded write-up has its words and not its figures
 *  until the workflows are run, the same bargain `runAt` already declares for the words.
 *
 *  THE SAME RENDERERS THE APPLICATION ALREADY USES, deliberately. A table goes through
 *  `tableViewOf`, which is what Quick Look renders, and a chart through `chartMarkup`, which is
 *  what the bars tab renders. A second renderer here would be a second thing to keep in step, and
 *  a figure in the write-up that disagreed with the figure on the screen is the one failure this
 *  module cannot be allowed to have.
 *
 *  A MAP IS A STATIC FIGURE, on the practitioner's reasoning of 2026-10-30: *"Because it's for a
 *  publication, we should render the static map."* Which settles a question this module first got
 *  wrong by looking at the wrong code. The map DOWNLOAD is built from `svg.innerHTML`, so it
 *  looked as though a map could only be had by rendering one; but what fills that element is
 *  `oldMap`, a pure function of the output, and `mapPresentation` is a pure function of the node
 *  and the run. So the figure is composed from the run exactly as the tables and charts are,
 *  through the same `standaloneMapSvg` the Download map (SVG) button calls.
 *
 *  AND IT IS NOT YET THE WHOLE FIGURE, which this comment claimed for an hour on 2026-10-30 and
 *  which was wrong. The live map is `oldMap` AND an asynchronous pass that fetches basemap tiles
 *  or a georeferenced plate, inserts them above the background rect, and then withdraws the fill
 *  from polygons that encode nothing so the ground shows through. The download copies
 *  `svg.innerHTML` after all of that; this composed only the vector plot. On South London's
 *  layered maps the two therefore differed -- the write-up's figure had the extent and the marks
 *  and not Snow's plate underneath -- which was visible the moment the figure and the screen were
 *  put side by side, and was not visible in any assertion.
 *
 *  THE PLATE IS IN THE FIGURE NOW, and the tiles are still out. That was one gap in this comment
 *  and is two: a tile has to be fetched, so composing one here would make a figure that renders
 *  and then changes under a reader, while a plate is a data URI the node already holds and
 *  `mapImageMarkup` places it by its corners -- a pure function of the node and the frame. The
 *  caller composes it through `withGroundUnder` before this module is reached, so what arrives
 *  at `mapFigure` carries its ground. What remains open is the basemap, and what would close it
 *  is unchanged: compose it when the run is remembered, not when the note is drawn.
 *
 *  The markup is passed in rather than composed here, because resolving a node and a workflow
 *  belongs to the application that holds them. This module decides WHETHER a map is drawn and
 *  what stands where one cannot be.
 */
import type {DataTable} from './data-table.js';
import type {ChartSummary} from './results.js';
import type {Escape} from './types.js';
import {tableViewOf} from './table-viewer.js';
import {presentValue,pairedValue,pairedColumns,headingMarks,noteNumbers,tableNotesHtml,suppressedMark,type TablePresentation} from './table-presentation.js';
import {chartMarkup} from './chart-output.js';
import {twoByTwoMarkup} from './two-by-two-view.js';
import type {TwoByTwoResult} from './two-by-two.js';

/** Beyond this many rows, a figure in a write-up stops being a figure. The count always tells the
 *  truth about how many there are, and the caption says when fewer are drawn -- the rule
 *  `table-viewer.ts` already applies at its own, larger ceiling, tightened here because a write-up
 *  is read in a column rather than in a modal. */
export const FIGURE_ROW_CEILING=50;

/** What a run leaves behind that a figure can be drawn from. Narrower than `WorkflowRun` on
 *  purpose: this module reads two fields, and taking the whole type would let it grow to read
 *  anything a run carries. */
export interface RunArtifacts {
  tables?:Record<string,DataTable>;
  /** THE TABLE'S PRESENTATION, as the Table step that published it sets it (2026-11-28), so the write-up and the draft
   *  print the table Results shows: its title, decimal places, units, notes, small cells and source. */
  presentationOf?:(nodeId:string)=>TablePresentation|undefined;
  outputs?:readonly {nodeId:string; label?:string; view?:string; chart?:ChartSummary}[];
  /** The standalone SVG for a map node, composed by the caller from this run. Returns null where
   *  the output carries nothing a map can be drawn from -- a map step that ran before its
   *  boundary arrived, which is an ordinary state and not a failure. */
  mapSvg?:(nodeId:string)=>string|null;
  /** THE CHART AS THE STEP DRAWS IT ON SCREEN, composed by the caller from this run: the SVG its download gives, or a
   *  line saying it is still being drawn. Null where the step draws classic bars, which `chartFigure` draws here too.
   *  The practitioner, 2026-11-12: Brazil's chart of estimates with their intervals did not show in the notes, which
   *  drew classic bars and those decline an interval. */
  chartSvg?:(nodeId:string)=>string|null;
}


/** The node a description note speaks for, or null where the note is not a description.
 *
 *  Read off the id rather than off `fn`, because these notes deliberately set no function: the
 *  seven in `KNOWN_NOTE_FUNCTIONS` were reconciled by the practitioner personally and none of
 *  them describes what an artifact's self-description does. The id is this module's own
 *  convention with `artifact-notes.ts` and is asserted in both test files. */
export const describedNode=(noteId:string|undefined):string|null=>{
  const id=(noteId||'').trim();
  const cut=id.lastIndexOf(':description');
  return cut>0&&cut===id.length-':description'.length?id.slice(0,cut):null;
};

/** A cell as the table's presentation writes it. AN EMPTY CELL IS A DASH THAT SAYS SO on hover, because this application
 *  refuses to compute a two-by-two over a missing value and a figure that printed nothing there would hand a reader a gap
 *  that looks like a measured zero. */
const cell=(shown:{html:string;number:boolean;absent:boolean}):string=>
  shown.absent?`<td class="figure-empty" title="unknown, not zero">${shown.html||'—'}</td>`
  :shown.number?`<td class="figure-number">${shown.html}</td>`:`<td>${shown.html}</td>`;

/** A table as a reader of the write-up meets it, TO THE TABLE STANDARD (2026-11-28): the same rules Results applies, read
 *  from the Presentation of the Table step that published it. Its title above, real header cells with each column's
 *  unit and note number, its numbers right-aligned to one precision a column, small counts hidden, a count and its
 *  percentage in one cell where paired, then the notes and the source. It had drawn its own cells, numbers as the
 *  locale wrote them and every setting of the Table's Presentation unread. */
export function tableFigure(table:DataTable|undefined,label:string|undefined,
  esc:Escape,present?:TablePresentation):string|null{
  if(table?.kind!=='data-table')return null;
  const view=tableViewOf(table,label||'');
  if(!view.columns.length)return null;
  const drawn=view.rows.slice(0,FIGURE_ROW_CEILING);
  const over=view.rows.length-drawn.length;
  const {shown:columns,percentOf}=pairedColumns(view.columns,present);
  const numbers=noteNumbers(present,view.columns);
  const declared=(name:string)=>view.headings?.[name]?undefined:table.columns?.[name]?.confirmed?table.columns[name]!.unit:undefined;
  const isNumber=(name:string)=>drawn.length>0&&drawn.every(row=>typeof row[name]==='number'||row[name]===null||row[name]===undefined)
    &&drawn.some(row=>typeof row[name]==='number');
  const valueOf=(row:Record<string,unknown>,name:string)=>{const pc=percentOf.get(name);
    return pc?pairedValue(row[name],row[pc],name,pc,present,esc):presentValue(row[name],name,present,esc);};
  return `<figure class="notes-figure" data-figure="table">`
    +(present?.caption?`<p class="table-caption">${esc(present.caption)}</p>`:'')
    +`<table><thead><tr>`
    // A NUMBER'S HEADING STANDS OVER IT (2026-11-19: "85" sat under "Dead" in MERS's table, headings left and numbers right).
    +columns.map(name=>`<th scope="col"${isNumber(name)?' class="figure-number"':''}>${esc(name)}${percentOf.get(name)?` (${esc(percentOf.get(name)!)})`:''}`
      +headingMarks(name,present,esc,numbers,declared(name),percentOf.get(name))
      +`${view.headings?.[name]?`<span class="meaning">: ${esc(view.headings[name]!)}</span>`:''}</th>`).join('')
    +`</tr></thead><tbody>`
    +drawn.map(row=>`<tr>`+columns.map(name=>cell(valueOf(row as Record<string,unknown>,name))).join('')+`</tr>`).join('')
    +`</tbody></table>`
    +tableNotesHtml(present,view.columns,esc)
    // THE CEILING IS REPORTED WHERE IT BITES. A figure silently showing 50 of 320 rows is a
    // figure that lies about the data, and the number a reader would quote comes from the
    // caption rather than from counting what is drawn.
    +(over>0?`<figcaption class="muted">Showing ${drawn.length.toLocaleString()} of `
      +`${view.rows.length.toLocaleString()} rows. The step shows all of them.</figcaption>`:'')
    +`</figure>`;
}

/** A chart as a reader of the write-up meets it: the bars the application already draws, from the
 *  same `ChartSummary` the step rendered. Horizontal, because a write-up column is narrow and
 *  these are categories rather than a series. */
export function chartFigure(chart:ChartSummary|undefined,esc:Escape):string|null{
  if(!chart?.bins?.length)return null;
  return `<figure class="notes-figure" data-figure="chart">`
    +chartMarkup(chart,esc,'horizontal')+`</figure>`;
}

/** THE MAP AS A PUBLICATION WOULD CARRY IT: title, subtitle, key, scale and source note, which
 *  `standaloneMapSvg` draws around the map because a figure leaves the application and has to
 *  stand on its own. Not sanitised and not re-escaped: it is this application's own markup, built
 *  by the same function the SVG download calls, and escaping it would print the source. */
export const mapFigure=(svg:string):string=>
  `<figure class="notes-figure" data-figure="map">${svg}</figure>`;

/** WHERE A MAP WOULD GO AND CANNOT.
 *
 *  Said rather than left blank, which is 149's rule about an empty section and the same rule the
 *  pending line follows: a reader who meets nothing cannot tell a map that is missing from a map
 *  this write-up was never going to carry. */
export const mapFigurePlaceholder=(nodeId:string,esc:Escape):string=>
  `<figure class="notes-figure is-absent" data-figure="map">`
  +`<p class="muted">This step published a map, and nothing in its last run could be drawn as `
  +`one.</p>`
  +`<button class="text-button flowlink" data-open-node="${esc(nodeId)}">Open the map</button>`
  +`</figure>`;

/** The figure for the artifact a description note speaks for, or null where there is none to
 *  draw. Null is an ordinary answer: the workflow has not run this session, or the node produced
 *  something that is not a published artifact. */
export function figureFor(nodeId:string,run:RunArtifacts|undefined,esc:Escape):string|null{
  if(!run)return null;
  const table=run.tables?.[nodeId];
  const output=run.outputs?.find(o=>o.nodeId===nodeId);
  // A TWO-BY-TWO IS DRAWN AS ONE, BEFORE ANY OF THE TABLE PATHS BELOW.
  //
  // The practitioner, 2026-10-31: *"a 2x2 table is not a table in the data sense, but a table to
  // represent an epidemiology tool complete with its standard formatting that epidemiologists
  // understand."* It reached this module as an ordinary `data-table` of four rows, so the figure
  // printed four bare counts -- no letters, no margins, and none of the three estimates -- while
  // the Methods note beside it wrote every formula in $a$, $b$, $c$ and $d$. Experiment 153.
  //
  // Read off the VALUE rather than off the node type, which is 153's Option A: the result rides
  // on the table `two_by_two` emits, so anything carrying one draws as one and the port stays as
  // it was. The output's own `view` is not consulted because the author of a `table_output` node
  // did not choose to publish a generic table -- they connected a two-by-two to it.
  const carried=table as unknown as {twoByTwo?:TwoByTwoResult;unit?:string;
    design?:{design:string;unitOfAnalysis:string;sentence:string}};
  const instrument=carried?.twoByTwo;
  if(instrument?.kind==='two-by-two')
    return `<figure class="notes-figure" data-figure="two-by-two">`
      +twoByTwoMarkup(instrument,esc,carried.design,carried.unit)+`</figure>`;
  // THE PRODUCER SAYS WHICH ARTIFACT IT IS, and this asks rather than guesses.
  //
  // The first version preferred a table wherever one existed, reasoning that `rate` emits a chart
  // over its own table. Measured in the application on 2026-10-30 that drew 7 tables, 2 maps and
  // ZERO charts: a bars output keeps its source table in `run.tables` under the same node id, so
  // every chart in South London rendered as the table behind it. `Output.view` is the widget's
  // own declaration of what it published -- the same field the result tab switches on -- so the
  // figure in the write-up and the figure on the screen are now the same artifact by
  // construction rather than by a rule here that has to keep up.
  if(output?.view==='bars'){
    const drawn=run.chartSvg?.(nodeId);
    if(drawn)return `<figure class="notes-figure" data-figure="chart">${drawn}</figure>`;
    const asChart=chartFigure(output.chart,esc);
    if(asChart)return asChart;
  }
  if(output?.view==='map'){
    const svg=run.mapSvg?.(nodeId);
    return svg?mapFigure(svg):mapFigurePlaceholder(nodeId,esc);
  }
  const asTable=tableFigure(table,output?.label,esc,run.presentationOf?.(nodeId));
  if(asTable)return asTable;
  // A node with no published view still gets its table, which is how an intermediate step -- a
  // relate, a group, a selection -- reaches a reader at all. `run.tables` holds those.
  return chartFigure(output?.chart,esc);
}

/** A TABLE AS CSV, its columns spelled as the table holds them and an unknown cell left empty, never written as zero.
 *  For the files attached to a draft (experiment 202, 2026-11-19), where a table too long to print goes. */
export function tableCsv(table:DataTable,present?:TablePresentation):string{
  const view=tableViewOf(table,'');
  // A SMALL COUNT HIDDEN ON THE PAGE IS HIDDEN HERE TOO (2026-11-28): otherwise the file beside the draft hands on what the
  // table withheld. Its mark is written instead, and nothing else of the presentation: a CSV keeps one value a cell.
  const field=(value:unknown,name='')=>{
    const hidden=suppressedMark(value,name,present);if(hidden)return hidden;
    if(value===null||value===undefined)return '';
    const text=String(value);
    return /[",\r\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;};
  return [view.columns.map(c=>field(c)).join(','),...view.rows.map(row=>view.columns.map(name=>field(row[name],name)).join(','))].join('\r\n')+'\r\n';
}
/** How many rows a table holds, as its view counts them. */
export const tableRowCount=(table:DataTable):number=>tableViewOf(table,'').rows.length;
