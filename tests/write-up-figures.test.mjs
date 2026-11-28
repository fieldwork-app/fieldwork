import test from 'node:test';
import assert from 'node:assert/strict';
import {figureFor,tableFigure,chartFigure,describedNode,mapFigure,mapFigurePlaceholder,
  FIGURE_ROW_CEILING} from '../build/write-up-figures.js';

/** THE ARTIFACT ITSELF, IN THE WRITE-UP.
 *
 *  The practitioner, 2026-10-30, for the fourth time: *"We are still far from making progress -
 *  charts, maps and tables are not there."* Measured in the running application that afternoon,
 *  the Notes view held 70 typeset equations, 0 tables, 0 charts and 0 maps -- because what had
 *  been built was a SENTENCE about each artifact rather than the artifact. Experiment 141. */

const esc=value=>String(value).replace(/[&<>"]/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const TABLE={kind:'data-table',keys:['water_supply'],valueField:'people',unit:'people',
  rowCount:3,missingValueCount:1,rows:[
    {key:{water_supply:'Southwark & Vauxhall only'},value:844},
    {key:{water_supply:'Lambeth only'},value:18},
    {key:{water_supply:'Both companies'},value:null},
  ]};
const CHART={field:'value',measure:'value',caption:'deaths per 1,000 people',
  categoryTitle:'group',unit:'per 1,000 people',total:1514,
  bins:[{key:'a',label:'St Saviour',count:5.1},{key:'b',label:'Lambeth',count:0}]};

test('a description note names the node its figure is drawn from',()=>{
  assert.equal(describedNode('table-viii:description'),'table-viii');
  // The equation notes share the convention and must NOT be mistaken for a figure: an equation
  // is already in the note's own text as typeset mathematics.
  assert.equal(describedNode('estimates:equation'),null);
  assert.equal(describedNode(undefined),null);
  assert.equal(describedNode(':description'),null);
});

test('A TABLE IS DRAWN AS A TABLE, which is the whole of what was missing',()=>{
  const html=tableFigure(TABLE,'Died or survived',esc);
  assert.match(html,/<figure class="notes-figure" data-figure="table">/);
  assert.match(html,/<th scope="col">water_supply<\/th>/);
  // A column of numbers is headed over its numbers (2026-11-19).
  assert.match(html,/<th scope="col" class="figure-number">people<\/th>/);
  assert.match(html,/<td>Southwark &amp; Vauxhall only<\/td>/);
  assert.match(html,/<td class="figure-number">844<\/td>/);
});
test('a table as CSV keeps its columns as spelled, quotes what needs it, and leaves an unknown cell empty',async()=>{
  const {tableCsv,tableRowCount}=await import('../build/write-up-figures.js');
  const csv=tableCsv(TABLE);
  assert.equal(csv.split('\r\n')[0],'water_supply,people');
  assert.ok(csv.endsWith('\r\n'));
  assert.equal(csv.trim().split('\r\n').length,tableRowCount(TABLE)+1);
  assert.match(csv,/\n[^,\r\n]+,\r\n/,'an unknown value is an empty field');
});

test('an empty cell is drawn as unknown and not as zero',()=>{
  // The refusal this application already makes for a two-by-two, carried into the figure. A
  // blank cell reads as a measured nothing, which is the one reading the data does not support.
  const html=tableFigure(TABLE,'T',esc);
  assert.match(html,/<td class="figure-empty" title="unknown, not zero"><span aria-label="no value">—<\/span><\/td>/);
  assert.doesNotMatch(html,/<td class="figure-number">0<\/td>/);
});

test('a long table says how much of itself it is showing',()=>{
  const many={...TABLE,rowCount:120,missingValueCount:0,
    rows:Array.from({length:120},(_,i)=>({key:{water_supply:`row ${i}`},value:i}))};
  const html=tableFigure(many,'T',esc);
  const body=html.slice(html.indexOf('<tbody>'),html.indexOf('</tbody>'));
  const drawn=[...body.matchAll(/<tr>/g)].length;
  assert.equal(drawn,FIGURE_ROW_CEILING);
  // REPORTED WHERE IT BITES. A figure quietly showing 50 of 120 rows is a figure that lies, and
  // the number a reader would quote has to come from the caption rather than from counting.
  assert.match(html,new RegExp(`Showing ${FIGURE_ROW_CEILING} of 120 rows`));
  assert.doesNotMatch(tableFigure(TABLE,'T',esc),/Showing/);
});

test('a chart is drawn as the bars the application already draws',()=>{
  const html=chartFigure(CHART,esc);
  assert.match(html,/data-figure="chart"/);
  assert.match(html,/St Saviour/);
  // Through `chartMarkup`, so the write-up's chart cannot disagree with the bars tab's.
  assert.match(html,/deaths per 1,000 people/);
});

test('nothing is drawn where there is nothing to draw',()=>{
  assert.equal(tableFigure({kind:'point-table',rows:[]},'T',esc),null);
  assert.equal(tableFigure(undefined,'T',esc),null);
  assert.equal(chartFigure(undefined,esc),null);
  assert.equal(chartFigure({...CHART,bins:[]},esc),null);
  assert.equal(figureFor('n1',undefined,esc),null);
  assert.equal(figureFor('n1',{tables:{},outputs:[]},esc),null);
});

test('THE PRODUCER DECIDES WHICH ARTIFACT IS DRAWN, not a rule here',()=>{
  // A bars output keeps its source table in `run.tables` under the same node id, so a rule of
  // "a table if there is one" drew the table behind every chart. Measured in the application on
  // 2026-10-30: 7 tables, 2 maps, 0 charts, with every chart node rendering as its own table.
  const bars={tables:{ranked:TABLE},
    outputs:[{nodeId:'ranked',label:'Ranked',view:'bars',chart:CHART}]};
  assert.match(figureFor('ranked',bars,esc),/data-figure="chart"/);
  const asTable={tables:{mortality:TABLE},
    outputs:[{nodeId:'mortality',label:'Mortality',view:'table',chart:CHART}]};
  assert.match(figureFor('mortality',asTable,esc),/data-figure="table"/);
  // A map wins over the table it was built from, for the same reason.
  const map={tables:{where:TABLE},outputs:[{nodeId:'where',label:'Ground',view:'map'}],
    mapSvg:()=>'<svg/>'};
  assert.match(figureFor('where',map,esc),/data-figure="map"/);
  // An intermediate step publishes no view and still reaches a reader through its table.
  assert.match(figureFor('mid',{tables:{mid:TABLE},outputs:[]},esc),/data-figure="table"/);
});

test('A MAP IS DRAWN AS THE STATIC FIGURE A PUBLICATION CARRIES',()=>{
  // The practitioner, 2026-10-30: *"Because it's for a publication, we should render the static
  // map."* The caller composes it with `standaloneMapSvg` -- the same function behind Download
  // map (SVG) -- so the figure in the write-up is the figure that would be exported.
  const run={tables:{},outputs:[{nodeId:'where',label:'The ground',view:'map'}],
    mapSvg:id=>id==='where'?'<svg class="map-figure"><title>Sub-districts</title></svg>':null};
  const html=figureFor('where',run,esc);
  assert.match(html,/data-figure="map"/);
  assert.match(html,/<svg class="map-figure">/);
  // NOT ESCAPED, because it is this application's own markup rather than anything a reader typed.
  // Escaping it would print the source of the figure where the figure should be.
  assert.doesNotMatch(html,/&lt;svg/);
});

test('a map that cannot be drawn says so and does not fall back to a table',()=>{
  // A map step whose boundary has not arrived is an ordinary state of a workflow, not a failure,
  // and the table behind the map is not the artifact the step published.
  const run={tables:{where:TABLE},
    outputs:[{nodeId:'where',label:'The ground',view:'map'}],mapSvg:()=>null};
  const html=figureFor('where',run,esc);
  assert.match(html,/is-absent/);
  assert.doesNotMatch(html,/<table/);
  // A reader who meets nothing cannot tell a missing map from a map that was never coming.
  assert.match(html,/data-open-node="where"/);
  assert.equal(mapFigurePlaceholder('n<1>',esc).includes('n&lt;1&gt;'),true);
  assert.match(mapFigure('<svg/>'),/data-figure="map"><svg\/><\/figure>/);
});

test('nothing a figure draws can become markup',()=>{
  const nasty={...TABLE,keys:['<script>'],valueField:'"x"',
    rows:[{key:{'<script>':'<img onerror=1>'},value:1}]};
  const html=tableFigure(nasty,'<b>t</b>',esc);
  assert.doesNotMatch(html,/<script|<img/);
  assert.match(html,/&lt;script&gt;/);
});

/** THE WRITE-UP'S TABLE TO THE TABLE STANDARD (2026-11-28): the Table's Presentation, read where it published the table,
 *  sets the write-up's and the draft's table as it sets Results'. Each of these failed against the old figure, which drew
 *  its own cells and read no presentation. */
const COUNTS={kind:'data-table',keys:['district','measure'],valueField:'value',rowCount:12,missingValueCount:0,rows:[
  {key:{district:'North',measure:'cases'},value:1520},{key:{district:'North',measure:'percent'},value:63.333},{key:{district:'North',measure:'rate'},value:41.27},
  {key:{district:'South',measure:'cases'},value:4},{key:{district:'South',measure:'percent'},value:1.667},{key:{district:'South',measure:'rate'},value:2.5},
  {key:{district:'East',measure:'cases'},value:500},{key:{district:'East',measure:'percent'},value:20.833},{key:{district:'East',measure:'rate'},value:12.5},
  {key:{district:'West',measure:'cases'},value:376},{key:{district:'West',measure:'percent'},value:15.667},{key:{district:'West',measure:'rate'},value:9.4}]};
test('the write-up\'s table takes the Table\'s title, decimals per column, units, notes, small cells, pairs and source',()=>{
  const present={caption:'Cases by district, 2026',decimals:1,source:'District registers',
    columns:{rate:{decimals:2,unit:'per 100,000',note:'Mid-year population.'}},
    suppress:{below:5,columns:['cases'],reason:'confidentiality'},pairs:[{count:'cases',percent:'percent'}]};
  const html=tableFigure(COUNTS,'T',esc,present);
  assert.match(html,/<p class="table-caption">Cases by district, 2026<\/p>/);
  assert.match(html,/>rate \(per 100,000\) <span class="table-note-mark">\[note 1\]<\/span>/,'unit and note number in the heading');
  assert.match(html,/>cases \(percent\)</,'the paired heading');
  assert.doesNotMatch(html,/<th scope="col"[^>]*>percent/,'the percentage is not shown on its own');
  assert.match(html,/1,520\.0 \(63\.3\)/,'a count and its percentage in one cell, each to its own precision');
  assert.match(html,/41\.27/,'the column\'s two places over the table\'s one');
  assert.match(html,/\[c\]/,'a count of 4 below 5 is not shown');
  assert.doesNotMatch(html,/>4\.0 /);
  assert.match(html,/\[note 1\] Mid-year population\./);
  assert.match(html,/\[c\] In cases, a count from 1 to 4 is not shown, for confidentiality\./);
  assert.match(html,/Source: District registers/);
});
test('a draft\'s attached CSV hides what the table hides, and keeps one value a cell',async()=>{
  const {tableCsv}=await import('../build/write-up-figures.js');
  const csv=tableCsv(COUNTS,{suppress:{below:5,columns:['cases'],reason:'confidentiality'},pairs:[{count:'cases',percent:'percent'}],decimals:0});
  assert.match(csv,/\[c\]/);
  assert.doesNotMatch(csv,/(^|,)4(,|\r)/m,'the small count is not handed on');
  assert.match(csv,/1520/,'full precision, no separators');
  assert.match(csv.split('\r\n')[0],/percent/,'the percentage stays a column of its own');
});
