import test from 'node:test';
import assert from 'node:assert/strict';
import {shownRows,dataTableMarkup} from '../build/data-table-ui.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const table=(keys,rows,extra={})=>({kind:'data-table',keys,valueField:'cases',rows:rows.map(([k,v])=>({key:k,value:v})),rowCount:rows.length,missingValueCount:0,...extra});
const bodyRows=html=>((html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1]??'').match(/<tr/g)??[]).length;

/** THE PREVIEW'S ROW COUNT IS THE RENDERER'S (PR 10's review): a district-by-year table kept wide one row per year was
 *  offered "All 2" in Configure, and showed two of twelve districts, where Results drew a cross-tab of twelve. */
test('shownRows counts what dataTableMarkup draws, whichever shape it chooses',()=>{
  const districts=Array.from({length:12},(_,i)=>`D${i+1}`);
  const byYear=table(['district','year'],districts.flatMap((d,i)=>[[{district:d,year:'2024'},i],[{district:d,year:'2025'},i+1]]),
    {wide:{measureKey:'district',subjectKeys:['year']}});
  const threeKeys=table(['country','district','year'],[[{country:'A',district:'x',year:'2024'},1],[{country:'A',district:'y',year:'2024'},2],
    [{country:'B',district:'z',year:'2025'},3]]);
  const oneKey=table(['district'],districts.map((d,i)=>[{district:d},i]));
  for(const [name,t] of [['district by year, kept wide by year',byYear],['three keys',threeKeys],['one key',oneKey]])
    for(const totals of [false,true])
      assert.equal(shownRows(t,totals),bodyRows(dataTableMarkup(t,esc,{assertTotals:totals,limit:10_000})),`${name}, totals ${totals}`);
  // THE READING DECIDES WHICH KEY GOES ACROSS (review of #8): district is declared the measure, so the cross-tab puts the
  // twelve districts across and draws the two years as rows, as the wide frame and Configure do.
  assert.equal(shownRows(byYear),2,'the two years, with the twelve districts across');
});
