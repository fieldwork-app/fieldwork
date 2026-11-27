import test from 'node:test';
import assert from 'node:assert/strict';
import {parseJson,checkRulesetJson,rulesetText,autoBracket} from '../build/ruleset-json.js';

/** THE RULE EDITOR AS A JSON EDITOR (2026-11-21): errors placed on their line and said in words, the checks a run makes,
 *  and brackets that close themselves. */
const GOOD={title:'Syndromes',mustNotBeReadAs:'a diagnosis',
  fields:[{attribute:'chief_complaint',predicate:'fwa:chief_complaint',kind:'term'}],
  rules:[{any:[{all:[{field:'fwa:chief_complaint',comparator:'contains',value:'vomit, diarrh'}]}],then:[{predicate:'fwa:syndrome',value:'gastrointestinal'}]}]};
test('JSON that breaks is said where and how, in words',()=>{
  const cases=[['{\n  "title": "x"\n  "fields": []\n}',2,/comma is missing after the value of "title"/],
    ['{\n  "a": [1, 2,]\n}',2,/comma is left before "\]"/],
    ["{\n  'title': 1\n}",2,/double quotes/],
    ['{\n  "title": "open\n}',2,/runs on to the next line/],
    ['{"a": 1} x',1,/Nothing may follow/]];
  for(const [text,line,says] of cases){const {error}=parseJson(text);assert.equal(error.line,line,text);assert.match(error.says,says);}
});
test('every value is placed by its path, and a valid ruleset passes the checks a run makes',()=>{
  const text=rulesetText(GOOD),{positions}=parseJson(text);
  assert.equal(positions.get('rules.0.any.0.all.0.comparator').line,text.split('\n').findIndex(l=>l.includes('"comparator"'))+1);
  const {ruleset,problems}=checkRulesetJson(text);
  assert.deepEqual(problems,[]);assert.equal(ruleset.title,'Syndromes');
  assert.match(text,/^\{\n  "\$schema": "https:\/\/raw.githubusercontent.com\/fieldwork-app\/fieldwork\/main\/schemas\/authored-ruleset.schema.json",\n  "schema": "fieldwork\/authored-ruleset\/1",/);
});
test('what a ruleset means is checked and placed: an undeclared field, an unknown comparator, no words',()=>{
  const bad=structuredClone(GOOD);
  bad.rules[0].any[0].all.push({field:'fwa:age',comparator:'equals',value:5},{field:'fwa:chief_complaint',comparator:'resembles',value:'x'},
    {field:'fwa:chief_complaint',comparator:'contains',value:' , '});
  const text=JSON.stringify(bad,null,2),{problems}=checkRulesetJson(text),lines=text.split('\n');
  const said=problems.map(p=>p.says).join(' | ');
  assert.match(said,/fwa:age is not a declared field/);
  assert.match(said,/"comparator" is one of equals/);
  assert.match(said,/write the words to look for/);
  assert.ok(lines[problems.find(p=>/fwa:age/.test(p.says)).line-1].includes('fwa:age'));
});
test('brackets close themselves, are typed over, are removed in pairs, and open a line between them',()=>{
  assert.deepEqual(autoBracket('',0,0,'{'),{text:'{}',caret:1});
  assert.deepEqual(autoBracket('{}',1,1,'}'),{text:'{}',caret:2});
  assert.deepEqual(autoBracket('[]',1,1,'Backspace'),{text:'',caret:0});
  assert.deepEqual(autoBracket('  {}',3,3,'Enter'),{text:'  {\n    \n  }',caret:8});
  assert.deepEqual(autoBracket('a vomit b',2,7,'"'),{text:'a "vomit" b',caret:3,caretEnd:8});
  assert.deepEqual(autoBracket('"a"',2,2,'"'),{text:'"a"',caret:3});
  assert.equal(autoBracket('ab',2,2,'x'),undefined);
});

/** STARTING POINTS (2026-11-21): each template passes the checks and runs as loaded, on the step's own columns and on its
 *  stand-ins, and a value for every record (a group with no condition) is not refused. */
import {rulesetTemplate,RULESET_TEMPLATES} from '../build/ruleset-json.js';
import {evaluateAuthored} from '../build/rule-evaluation.js';
test('every template passes the checks and runs, on stand-in columns and on the step\'s own',()=>{
  const own=[{attribute:'cc',predicate:'fwa:cc',kind:'term'},{attribute:'age',predicate:'fwa:age',kind:'number',unit:'http://qudt.org/vocab/unit/YR',unitLabel:'years'},
    {attribute:'pop',predicate:'fwa:pop',kind:'number',unit:'http://qudt.org/vocab/unit/YR',unitLabel:'years'},
    {attribute:'onset',predicate:'fwa:onset',kind:'date'},{attribute:'notified',predicate:'fwa:notified',kind:'date'}];
  for(const {id} of RULESET_TEMPLATES)for(const fields of [[],own]){
    const r=rulesetTemplate(id,fields),{problems}=checkRulesetJson(rulesetText(r));
    assert.deepEqual(problems,[],`${id} on ${fields.length?'own':'stand-in'} columns`);
    const record={id:'x',label:'x',properties:Object.fromEntries(r.fields.map(f=>[f.attribute,f.kind==='term'?'Vomiting':f.kind==='date'?'2026-01-0'+(f.attribute.includes('notif')||f.attribute==='notified'?'9':'1'):40]))};
    const e=evaluateAuthored([record],r.fields,r.rules,Object.fromEntries((r.parameters??[]).map(p=>[p.name,7])),undefined,r.otherwise??[]);
    assert.ok(Object.keys(e.records[0].values).length>0,`${id} gave the record a value`);
  }
  assert.equal(rulesetTemplate('words',own).fields[0].attribute,'cc');
});

/** THE GUIDE'S EXAMPLES RUN (2026-11-21): every JSON example in "Writing rules as JSON" passes the editor's checks and gives
 *  a record a value, so the manual cannot show a ruleset that does not work. */
import {readFileSync as readManual} from 'node:fs';
test('every example in the guide passes the checks and runs',()=>{
  const manual=readManual(new URL('../docs/widgets/apply_ruleset.md',import.meta.url),'utf8');
  const guide=manual.slice(manual.indexOf('## Writing rules as JSON'));
  const examples=[...guide.matchAll(/```json\n([\s\S]*?)```/g)].map(m=>m[1]);
  assert.equal(examples.length,6);  // six from 2026-11-26: codes in a list, with startsWith and a quoted word
  for(const text of examples){
    const {ruleset,problems}=checkRulesetJson(text);
    assert.deepEqual(problems,[],text.slice(0,60));
    const props=Object.fromEntries(ruleset.fields.map(f=>[f.attribute,f.kind==='number'?12:'fever and cough, influenza, vomit']));
    const e=evaluateAuthored([{id:'r',label:'r',properties:props}],ruleset.fields,ruleset.rules,Object.fromEntries((ruleset.parameters??[]).map(p=>[p.name,10])),undefined,ruleset.otherwise??[]);
    assert.ok(Object.keys(e.records[0].values).length>0,`${ruleset.title} gave the record a value`);
  }
});

/** WHAT ARRIVES (2026-11-21): a declared column the input does not carry is said on its line, with the nearest name; a
 *  number declared on a column that arrives as text is said too; nothing is said while nothing is connected. */
import {arrivingProblems,closestColumn} from '../build/ruleset-json.js';
test('a declared column that does not arrive, or arrives as text, is said on its line, with the nearest name',()=>{
  assert.equal(closestColumn('chief_complain',['visit_id','chief_complaint','date']),'chief_complaint');
  assert.equal(closestColumn('Date',['visit_id','date']),'date');
  assert.equal(closestColumn('temperature',['visit_id','date']),undefined);
  const arriving={source:'Visits',columns:[{attribute:'chief_complaint',kind:'term'},{attribute:'age_group',kind:'term',samples:['18-44','65+']}]};
  const bad=structuredClone(GOOD);bad.fields=[{attribute:'chief_complain',predicate:'fwa:chief_complaint',kind:'term'},{attribute:'age_group',predicate:'fwa:age',kind:'number'}];
  const text=JSON.stringify(bad,null,2),{problems}=checkRulesetJson(text,arriving),lines=text.split('\n');
  assert.match(problems[0].says,/"chief_complain" is not a column of Visits. Did you mean "chief_complaint"\? Its columns are chief_complaint, age_group\./);
  assert.ok(lines[problems[0].line-1].includes('"chief_complain"'));
  assert.match(problems[1].says,/"age_group" arrives as text, not a number \("18-44", "65\+"\)/);
  assert.deepEqual(checkRulesetJson(rulesetText(GOOD),arriving).problems,[]);
  assert.deepEqual(arrivingProblems(bad.fields,{source:'x',columns:[]}),[]);
  // A count kept as text of numerals ("12", as Point data keeps it) is a number to the run, so nothing is said.
  assert.deepEqual(arrivingProblems([{attribute:'cases',kind:'number'}],{source:'Clinics',columns:[{attribute:'cases',kind:'term',samples:['12','30','7']}]}),[]);
});
