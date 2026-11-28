import test from 'node:test';
import assert from 'node:assert/strict';
import {presentValue,validatePresentation,headingMarks,noteNumbers,tableNotesHtml,pairedColumns,pairedValue,suppressedMark} from '../build/table-presentation.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

/** A TABLE PRESENTED TO A STANDARD (Table 0.15.0, 2026-11-27): one precision a column, thousands separators never on a
 *  year, an absent value a dash unless the table says otherwise, numbers marked to be right-aligned. */
test('values are written to the presentation',()=>{
  assert.deepEqual(presentValue(1234.5,'cases',{decimals:1},esc),{html:'1,234.5',number:true,absent:false});
  // PR 10's review: "As recorded" keeps the value. Text is shown as written; a number keeps its precision.
  assert.equal(presentValue('1234','cases',{},esc).html,'1234','text is shown as written');
  assert.equal(presentValue('00123','code',{},esc).html,'00123');
  assert.equal(presentValue('12345678901234567890','id',{},esc).html,'12345678901234567890');
  assert.equal(presentValue(7e-8,'rate',{},esc).html,'7e-8');
  assert.equal(presentValue(0.123456789,'rate',{},esc).html,'0.123456789');
  assert.equal(presentValue(1234567.891,'cases',{},esc).html,'1,234,567.891');
  assert.equal(presentValue(2026,'year',{},esc).html,'2026','a year has no separator');
  assert.equal(presentValue(1234,'cases',{separators:false},esc).html,'1234');
  assert.equal(presentValue(3,'cases',{decimals:2},esc).html,'3.00');
  assert.equal(presentValue('A12','id',{},esc).number,false);
  assert.equal(presentValue('42','id',{},esc).number,true,'text reading as a number is aligned as one');
  assert.equal(presentValue(1234,'id',{},esc,{measure:false}).html,'1234','an identifier keeps its digits');
});
test('an absent value is a dash read as "no value" unless the table says otherwise',()=>{
  assert.match(presentValue(null,'x',undefined,esc).html,/aria-label="no value">—/);
  assert.equal(presentValue(null,'x',{absent:'unknown'},esc).html,'unknown');
  assert.equal(presentValue('','x',{absent:'blank'},esc).html,'');
});
test('a saved presentation with an unknown or out-of-range setting is refused',()=>{
  assert.throws(()=>validatePresentation({colour:'red'}),/no setting "colour"/);
  assert.throws(()=>validatePresentation({decimals:9}),/0 to 6/);
  assert.throws(()=>validatePresentation({absent:'NA'}),/unknown, a dash, or blank/);
  validatePresentation({caption:'Deaths by house',decimals:1,separators:false,absent:'unknown',shade:true});
});

/** THE STANDARD'S OPEN ITEMS (2026-11-28): decimal places per column, footnote markers, a small-cell threshold, units in
 *  headings, and a count with its percentage. */
test('a column\'s decimal places win over the table\'s',()=>{
  const p={decimals:1,columns:{rate:{decimals:3}}};
  assert.equal(presentValue(2.5,'rate',p,esc).html,'2.500');
  assert.equal(presentValue(2.5,'cases',p,esc).html,'2.5');
});
test('small counts are hidden in the columns named, zero is shown, and the mark says why',()=>{
  const p={suppress:{below:10,columns:['cases'],reason:'reliability'}};
  assert.equal(suppressedMark(9,'cases',p),'[u]');
  assert.equal(suppressedMark(0,'cases',p),undefined,'zero is shown');
  assert.equal(suppressedMark(10,'cases',p),undefined);
  assert.equal(suppressedMark(3,'deaths',p),undefined,'only the columns named');
  assert.match(presentValue(3,'cases',p,esc).html,/\[u\]/);
  assert.match(tableNotesHtml(p,['cases'],esc),/\[u\] In cases, a count from 1 to 9 is not shown: too few to be reliable\./);
});
test('a heading carries its unit once and its note\'s number; notes are numbered in the table\'s order',()=>{
  const p={columns:{b:{note:'Second.'},a:{note:'First.',unit:'km'}}};
  const numbers=noteNumbers(p,['a','b']);
  assert.equal(headingMarks('a',p,esc,numbers),' (km) <span class="table-note-mark">[note 1]</span>');
  assert.equal(headingMarks('b',p,esc,numbers,'people'),' (people) <span class="table-note-mark">[note 2]</span>','the declared unit where none is set');
  assert.match(tableNotesHtml(p,['a','b'],esc),/\[note 1\] First\.<\/p><p class="table-notes">\[note 2\] Second\./);
});
test('a count and its percentage share a cell only where both columns are shown',()=>{
  const p={pairs:[{count:'n',percent:'pct'}],columns:{pct:{decimals:1}}};
  assert.deepEqual(pairedColumns(['n','pct','x'],p).shown,['n','x']);
  assert.deepEqual(pairedColumns(['n','x'],p).shown,['n','x'],'no percentage column, nothing folded');
  assert.equal(pairedValue(120,34.48,'n','pct',p,esc).html,'120 (34.5)');
  assert.equal(pairedValue(120,null,'n','pct',p,esc).html,'120');
});
test('the new settings are checked as a workflow opens',()=>{
  assert.doesNotThrow(()=>validatePresentation({columns:{rate:{decimals:2,unit:'per 1,000',note:'x'}},suppress:{below:10,columns:['n'],reason:'confidentiality'},pairs:[{count:'n',percent:'p'}]}));
  assert.throws(()=>validatePresentation({columns:{rate:{colour:'red'}}}),/no setting "colour"/);
  assert.throws(()=>validatePresentation({suppress:{below:1,columns:[],reason:'confidentiality'}}),/2 to 1,000/);
  assert.throws(()=>validatePresentation({suppress:{below:10,columns:[],reason:'privacy'}}),/confidentiality or reliability/);
  assert.throws(()=>validatePresentation({pairs:[{count:'n'}]}),/naming both/);
});

/** RESULTS' OWN TABLE PAIRS AND NUMBERS ITS HEADINGS TOO (2026-11-28): a table of districts by measure is a cross-tab,
 *  and the pairing first reached only the wide layout and the write-up. */
test('Results\' cross-tab shows a count and its percentage in one cell, and the note\'s number in the heading',async()=>{
  const {dataTableMarkup}=await import('../build/data-table-ui.js');
  const T={kind:'data-table',keys:['district','measure'],valueField:'value',rowCount:8,missingValueCount:0,
    rows:['North','South','East','West'].flatMap((d,i)=>[{key:{district:d,measure:'cases'},value:[120,4,500,376][i]},{key:{district:d,measure:'percent'},value:[34.48,1.2,20.8,15.7][i]}])};
  const html=dataTableMarkup(T,esc,{present:{pairs:[{count:'cases',percent:'percent'}],columns:{percent:{decimals:1},cases:{note:'All ages.'}}}});
  assert.match(html,/<th scope="col">cases \(percent\) <span class="table-note-mark">\[note 1\]<\/span><\/th>/);
  assert.doesNotMatch(html,/<th scope="col">percent/);
  assert.match(html,/120 \(34\.5\)/);
});

/** THE REVIEW OF #8, 2026-11-28: three ways a hidden count, or a note, came out wrong. */
const DISTRICTS={kind:'data-table',keys:['district','measure'],valueField:'value',rowCount:12,missingValueCount:0,
  rows:['North','South','East','West'].flatMap((d,i)=>[{key:{district:d,measure:'Cases'},value:[4,13,20,9][i]},
    {key:{district:d,measure:'Percent'},value:[8.7,28.3,43.5,19.6][i]},{key:{district:d,measure:'Rate'},value:[1.2,3.4,5.6,7.8][i]}])};
test('a count hidden in the table stays hidden when Results is searched',async()=>{
  const {dataTableMarkup}=await import('../build/data-table-ui.js');
  const present={suppress:{below:5,columns:['Cases'],reason:'confidentiality'}};
  assert.match(dataTableMarkup(DISTRICTS,esc,{present}),/\[c\]/);
  const searched=dataTableMarkup(DISTRICTS,esc,{present,query:'North'});
  assert.match(searched,/\[c\]/,'the searched North row hides its 4');
  assert.doesNotMatch(searched,/>4</);
});
/** THE SAME MEASURE WHICHEVER WAY THE KEYS ARE ORDERED (review of #8): keyed Measure, District with a reading of District
 *  by Measure, Configure offered Cases while Results drew the districts across, and North's 4 was shown under a rule for
 *  Cases. Configure's columns, the drawn table and a search now agree. */
test('a count hidden under its measure stays hidden when the table\'s keys are the other way round',async()=>{
  const {dataTableMarkup,drawnColumns}=await import('../build/data-table-ui.js');
  const T={...DISTRICTS,keys:['measure','district'],shownWide:{measureKey:'measure',subjectKeys:['district']}};
  const present={suppress:{below:5,columns:['Cases'],reason:'confidentiality'}};
  assert.deepEqual(drawnColumns(T).columns.map(c=>c.name),['district','Cases','Percent','Rate'],'the measures are the columns offered');
  const drawn=dataTableMarkup(T,esc,{present});
  assert.match(drawn,/<th scope="col">Cases/,'Results draws the measures across too');
  assert.match(drawn,/\[c\]/);
  assert.doesNotMatch(drawn,/>4</,'North\'s 4 is hidden unsearched');
  assert.doesNotMatch(dataTableMarkup(T,esc,{present,query:'North'}),/>4</,'and searched');
});
test('a table hiding a count shows no totals, which would give it away, and says why',async()=>{
  const {dataTableMarkup}=await import('../build/data-table-ui.js');
  const T={kind:'data-table',keys:['district','sex'],valueField:'cases',rowCount:8,missingValueCount:0,unit:'cases',
    rows:['North','South','East','West'].flatMap((d,i)=>[{key:{district:d,sex:'F'},value:[4,13,20,9][i]},{key:{district:d,sex:'M'},value:[13,6,8,11][i]}])};
  const shown=dataTableMarkup(T,esc,{assertTotals:true,present:{}});
  assert.match(shown,/Total/,'totals as before where nothing is hidden');
  const hidden=dataTableMarkup(T,esc,{assertTotals:true,present:{suppress:{below:5,columns:['F'],reason:'confidentiality'}}});
  assert.match(hidden,/\[c\]/);
  assert.doesNotMatch(hidden,/<th scope="col">Total<\/th>|crosstab-total/,'no row, column or grand total');
  assert.match(hidden,/Totals are not shown: with them, a count hidden as small could be worked out\./);
});
test('a heading\'s note number and the note below it are the same note, a folded percentage\'s included',async()=>{
  const {dataTableMarkup}=await import('../build/data-table-ui.js');
  const present={pairs:[{count:'Cases',percent:'Percent'}],columns:{Percent:{note:'Of all cases.'},Rate:{note:'Per 1,000.'}}};
  const html=dataTableMarkup(DISTRICTS,esc,{present});
  const notes=tableNotesHtml(present,['district','Cases','Percent','Rate'],esc);
  const markOf=name=>new RegExp(`>${name}[^<]*(?:<span class="table-note-mark">\\[note (\\d)\\]</span>)`).exec(html)?.[1];
  const percentNote=/\[note (\d)\] Of all cases\./.exec(notes)?.[1],rateNote=/\[note (\d)\] Per 1,000\./.exec(notes)?.[1];
  assert.equal(markOf('Rate'),rateNote,'Rate\'s heading names Rate\'s note');
  assert.match(html,new RegExp(`Cases \\(Percent\\) <span class="table-note-mark">\\[note ${percentNote}\\]</span>`),'the folded Percent note is on the paired heading');
});
test('a hidden count hides its percentage too, wherever a pair is drawn',async()=>{
  const {dataTableMarkup}=await import('../build/data-table-ui.js');
  const present={pairs:[{count:'Cases',percent:'Percent'}],suppress:{below:5,columns:['Cases'],reason:'confidentiality'}};
  assert.equal(pairedValue(4,8.7,'Cases','Percent',present,esc).html.includes('8.7'),false);
  assert.doesNotMatch(dataTableMarkup(DISTRICTS,esc,{present}),/8\.7/,'North\'s 8.7% would give its 4 away');
});
/** ROUNDED PARTS AND THEIR TOTAL (2026-11-28): shares rounded on their own can add to 99.9 or 100.1; the table says so. */
test('rounded parts that do not add to the total shown are said so, and only then',async()=>{
  const {dataTableMarkup}=await import('../build/data-table-ui.js');
  const T={kind:'data-table',keys:['district','sex'],valueField:'share',rowCount:6,missingValueCount:0,unit:'percent',
    rows:['North','South','East'].flatMap((d,i)=>[{key:{district:d,sex:'F'},value:[33.33,40.04,20.06][i]},{key:{district:d,sex:'M'},value:[33.33,6.64,0.02][i]}])};
  const rounded=dataTableMarkup(T,esc,{assertTotals:true,present:{decimals:1}});
  assert.match(rounded,/Figures may not add up to the totals shown, because each is rounded on its own\./);
  assert.doesNotMatch(dataTableMarkup(T,esc,{assertTotals:true,present:{}}),/may not add up/,'unrounded, nothing to say');
  assert.doesNotMatch(dataTableMarkup(T,esc,{assertTotals:true,present:{decimals:2}}),/may not add up/,'to two places they add exactly');
});
