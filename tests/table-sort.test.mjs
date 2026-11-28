import test from 'node:test';
import assert from 'node:assert/strict';
import {sortRows,isNumericColumn,pointTableMarkup,pointTableColumns} from '../build/table-output.js';

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const row=(id,name,attributes)=>({id,recordId:id,sourceNodeId:'src',layerLabel:'Sites',
  attributeTypes:{},name,attributes,coordinates:[0,0]});
const table=rows=>({kind:'point-table',rows,pointLayers:[],spatialReference:{},centers:[],pointTable:true});

test('a numeric column is ordered by magnitude, not by text', () => {
  const rows=[row('a','A',{metres:9}),row('b','B',{metres:10}),row('c','C',{metres:100})];
  const {sorted}=sortRows(rows,r=>r.attributes.metres,'ascending');
  assert.deepEqual(sorted.map(r=>r.attributes.metres),[9,10,100]);
});

test('descending answers "which is farthest"', () => {
  const rows=[row('a','A',{metres:9}),row('b','B',{metres:100}),row('c','C',{metres:10})];
  assert.equal(sortRows(rows,r=>r.attributes.metres,'descending').sorted[0].name,'B');
});

test('records with no value are held at the end in BOTH directions', () => {
  const rows=[row('a','A',{metres:9}),row('b','B',{metres:null}),row('c','C',{metres:100})];
  for(const direction of ['ascending','descending']){
    const {sorted,unknownCount}=sortRows(rows,r=>r.attributes.metres,direction);
    assert.equal(unknownCount,1,direction);
    assert.equal(sorted.at(-1).name,'B',`a record never measured must not answer "${direction}"`);
  }
});

test('a column with a text value in it is NOT treated as numeric', () => {
  // 117's mixed-type case. Coercing '3' to 3 here would rank it correctly and hide the defect
  // at the moment the practitioner is looking at the column.
  assert.equal(isNumericColumn([3,'3',10]),false);
  assert.equal(isNumericColumn([3,null,10]),true);
  assert.equal(isNumericColumn([null,null]),false,'no values present is not a numeric column');
});

test('text is compared numerically-aware, so "3" precedes "10"', () => {
  const rows=[row('a','A',{v:'10'}),row('b','B',{v:'3'}),row('c','C',{v:'x'})];
  assert.deepEqual(sortRows(rows,r=>r.attributes.v,'ascending').sorted.map(r=>r.attributes.v),['3','10','x']);
});

test('booleans order false before true', () => {
  const rows=[row('a','A',{v:true}),row('b','B',{v:false})];
  assert.deepEqual(sortRows(rows,r=>r.attributes.v,'ascending').sorted.map(r=>r.attributes.v),[false,true]);
});

test('sorting is stated in the controls, with the count held back', () => {
  const t=table([row('a','A',{metres:9}),row('b','B',{metres:null}),row('c','C',{metres:100})]);
  const out=pointTableMarkup(t,esc,{sort:{column:'attribute:metres',direction:'descending'}});
  assert.match(out.controls,/Ordered by metres, highest first/);
  assert.match(out.controls,/1 record with no value for this column held at the end/);
  assert.match(out.body.split('</tr>')[0],/>C</,'the highest value is the first row shown');
});

test('every column is sortable and the active one declares aria-sort', () => {
  const t=table([row('a','A',{metres:9})]);
  const {columns}=pointTableColumns(t);
  const out=pointTableMarkup(t,esc,{sort:{column:'name',direction:'ascending'}});
  for(const c of columns)
    assert.ok(out.head.includes(`data-table-sort="${c.key}"`),`${c.label} offers no sort`);
  assert.match(out.head,/aria-sort="ascending"[^>]*><button[^>]*data-table-sort="name"/);
  assert.equal((out.head.match(/aria-sort="none"/g)||[]).length,columns.length-1);
  assert.match(out.head,/data-table-sort="name" data-table-direction="descending"/,'clicking again reverses');
});

test('an unsorted table says nothing about order, and ranks nothing', () => {
  const t=table([row('b','B',{metres:100}),row('a','A',{metres:9})]);
  const out=pointTableMarkup(t,esc,{});
  assert.doesNotMatch(out.controls,/Ordered by/);
  assert.match(out.body.split('</tr>')[0],/>B</,'input order is preserved');
});

test('sorting applies to the filtered set, and resets to its own first page', () => {
  const rows=[row('a','Clinic A',{metres:5}),row('b','Depot',{metres:999}),row('c','Clinic C',{metres:50})];
  const out=pointTableMarkup(table(rows),esc,{query:'Clinic',sort:{column:'attribute:metres',direction:'descending'}});
  assert.match(out.controls,/of 2 records/);
  assert.match(out.body.split('</tr>')[0],/Clinic C/,'the farthest of what is shown, not of what is hidden');
});

/** A COUNT AND ITS PERCENTAGE IN ONE CELL in a table of points or polygon summaries (2026-11-28): Table 0.16.0 paired them
 *  only in a table of rows. */
test('a paired count and percentage share a cell in the point table, the percentage not shown on its own', () => {
  const t=table([row('a','North',{cases:120,share:34.5}),row('b','South',{cases:4,share:1.2})]);
  const out=pointTableMarkup(t,esc,{present:{pairs:[{count:'cases',percent:'share'}],columns:{share:{decimals:1}}}});
  assert.match(out.head,/>cases \(share\)/,'the heading names both');
  assert.doesNotMatch(out.head,/>share</,'no column of its own');
  assert.match(out.body,/<td data-number>120 \(34\.5\)<\/td>/);
  const hidden=pointTableMarkup(t,esc,{present:{pairs:[{count:'cases',percent:'share'}],suppress:{below:5,columns:['cases'],reason:'confidentiality'}}});
  assert.match(hidden.body,/\[c\]/,'a hidden count is hidden with its percentage');
  assert.doesNotMatch(hidden.body,/1\.2/,'and its percentage does not give it away');
});
