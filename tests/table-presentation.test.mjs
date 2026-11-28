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
