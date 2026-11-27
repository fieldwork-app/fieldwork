/** A RULESET AS JSON, READ AND CHECKED AS IT IS TYPED (the practitioner, 2026-11-21: *"we can also enable editing and
 *  uploading of ruleset files in JSON"*, then *"So we can make the rule editor a specialized JSON editor. Editor also
 *  validates in real time."*). The JSON is what a step stores, so this reads it back: a parser that says where JSON
 *  breaks, by line and column, in words (a browser's own message names no line in Safari), and the checks a ruleset
 *  must pass before it runs, each placed on the line it is about. */
import {escapeHtml} from './html-escape.js';
import {authoredUnitProblems,otherwiseProblems,computesValues,evaluatedDirectly,compileAuthoredRuleset,isWordComparator,
  containedWords,bandRules,targetRules,type Comparator} from './authored-rules.js';

export const RULESET_SCHEMA='fieldwork/authored-ruleset/1';
/** WHERE AN EDITOR FINDS THE SCHEMA: VS Code reads a file's "$schema" and offers names, kinds and comparisons as it is typed. */
export const RULESET_SCHEMA_URL='https://raw.githubusercontent.com/fieldwork-app/fieldwork/main/schemas/authored-ruleset.schema.json';
export interface JsonProblem {line:number;column?:number;says:string;path?:string}
/** Where each value starts, by its path: `rules.0.any.0.all.1.field`. */
export type Positions=Map<string,{line:number;column:number}>;

/** JSON.parse's grammar, with every value's line and column kept, and an error said in words where the text breaks. */
export function parseJson(text:string):{value?:unknown;positions:Positions;error?:JsonProblem}{
  let i=0,line=1,col=1;const positions:Positions=new Map();
  const at=()=>({line,column:col});
  const fail=(says:string,where=at()):never=>{throw Object.assign(new Error(says),{where});};
  // WHERE A VALUE ENDED: a missing comma belongs at the end of the value before it, not where the next one starts.
  let ended={line:1,column:1};
  const next=()=>{const c=text[i++]!;if(c==='\n'){line++;col=1;}else col++;return c;};
  const space=()=>{while(i<text.length&&/\s/.test(text[i]!))next();};
  const shown=(c:string|undefined)=>c===undefined?'the end of the text':c==='\n'?'a line break':`"${c}"`;
  const string=():string=>{next();let out='';
    for(;;){if(i>=text.length)fail('A string is not closed: a " is missing.');
      if(text[i]==='\n')fail('A string runs on to the next line: a " is missing at the end of it.');
      const c=next();
      if(c==='"')return out;
      if(c==='\\'){const e=next();const map:Record<string,string>={'"':'"','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'};
        if(e==='u'){const hex=text.slice(i,i+4);if(!/^[0-9a-fA-F]{4}$/.test(hex))fail('\\u is followed by four hexadecimal digits.');
          out+=String.fromCharCode(parseInt(hex,16));for(let k=0;k<4;k++)next();}
        else if(map[e]!==undefined)out+=map[e];else fail(`"\\${e}" is not an escape JSON knows.`);}
      else out+=c;}};
  const value=(path:string):unknown=>{
    space();positions.set(path,at());const c=text[i];
    if(c==='{'){next();const o:Record<string,unknown>={};space();
      if(text[i]==='}'){next();return o;}
      for(;;){space();if(text[i]==="'")fail('JSON writes names and strings in double quotes ", not single quotes.');
        if(text[i]!=='"')fail(text[i]==='}'?'A comma is left before "}".':`A name in quotes is expected here, not ${shown(text[i])}.`);
        const key=string();space();if(text[i]!==':')fail(`A ":" is missing after "${key}".`);next();
        o[key]=value(path?`${path}.${key}`:key);ended=at();space();
        if(text[i]===','){next();continue;}if(text[i]==='}'){next();return o;}
        if(text[i]==='"')fail(`A comma is missing after the value of "${key}".`,ended);
        fail(`A "," or "}" is expected after the value of "${key}", not ${shown(text[i])}.`);}}
    if(c==='['){next();const a:unknown[]=[];space();
      if(text[i]===']'){next();return a;}
      for(;;){a.push(value(path?`${path}.${a.length}`:String(a.length)));ended=at();space();
        if(text[i]==='{'||text[i]==='['||text[i]==='"')fail(`A comma is missing after item ${a.length}.`,ended);
        if(text[i]===','){next();space();if(text[i]===']')fail('A comma is left before "]".');continue;}
        if(text[i]===']'){next();return a;}
        fail(`A "," or "]" is expected after item ${a.length}, not ${shown(text[i])}.`);}}
    if(c==='"')return string();
    const m=/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if(m&&m[0]!=='-'){for(let k=0;k<m[0].length;k++)next();return Number(m[0]);}
    for(const [word,v] of [['true',true],['false',false],['null',null]] as const)
      if(text.startsWith(word,i)){for(let k=0;k<word.length;k++)next();return v;}
    if(c==="'")fail('JSON writes names and strings in double quotes ", not single quotes.');
    return fail(`A value is expected here, not ${shown(c)}.`);
  };
  try{const v=value('');space();if(i<text.length)fail(`Nothing may follow the ruleset, but ${shown(text[i])} does.`);return {value:v,positions};}
  catch(error){const where=(error as {where?:{line:number;column:number}}).where??{line,column:col};
    return {positions,error:{line:where.line,column:where.column,says:(error as Error).message}};}
}

export const COMPARATORS:Comparator[]=['equals','notEquals','greaterThan','notGreaterThan','lessThan','notLessThan','contains','notContains','startsWith','notStartsWith'];
export const KINDS=['number','boolean','term','date','datetime'];
/** The parts every ruleset has; the rest are optional. */
export const REQUIRED_PARTS=['title','mustNotBeReadAs','fields','rules'] as const;
const CURIE=/^[a-zA-Z][a-zA-Z0-9_-]*:[a-zA-Z][a-zA-Z0-9_]*$/;
const isObj=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);

/** The authored ruleset a step stores, as a file: its title, what it must not be read as, the columns it reads with
 *  their kinds and units, its settings, its rules, the order it reads records in and each column's default. */
export interface RulesetFile {schema?:string;title:string;mustNotBeReadAs:string;fields:unknown[];parameters?:unknown[];
  rules:unknown[];order?:unknown;otherwise?:unknown[]}

/** Every problem with a ruleset as JSON, placed on its line: the text first, then its shape, then what it means. */
/** THE COLUMNS ARRIVING ON THE STEP'S INPUT (the practitioner, 2026-11-21: "Can the editor detect input variables coming in
 *  from the port?"): each with the kind its values read as, a few of them, and the step they come from. */
export interface ArrivingColumns {source:string;columns:{attribute:string;kind:string;samples?:string[]}[]}

/** The nearest column name, by edits, for a name that does not arrive: "chief_complain" is "chief_complaint". */
export function closestColumn(name:string,columns:readonly string[]):string|undefined{
  const dist=(a:string,b:string)=>{const d=Array.from({length:a.length+1},(_,i)=>[i,...Array(b.length).fill(0)]);
    for(let j=1;j<=b.length;j++)d[0]![j]=j;
    for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)
      d[i]![j]=Math.min(d[i-1]![j]+1,d[i]![j-1]+1,d[i-1]![j-1]+(a[i-1]===b[j-1]?0:1));
    return d[a.length]![b.length]!;};
  const low=name.toLowerCase();let best:{c:string;d:number}|undefined;
  for(const c of columns){const d=c.toLowerCase()===low?0:dist(low,c.toLowerCase());if(!best||d<best.d)best={c,d};}
  return best&&best.d<=Math.max(2,Math.floor(name.length/4))?best.c:undefined;
}

/** Declared fields against what arrives: a column that does not arrive, or a number that arrives as text. Each problem
 *  names the field's index, so the editor places it on its line and the run says it in its refusal. */
export function arrivingProblems(fields:readonly {attribute?:unknown;kind?:unknown}[],arriving:ArrivingColumns):{index:number;says:string}[]{
  if(!arriving.columns.length)return [];
  const names=arriving.columns.map(c=>c.attribute),out:{index:number;says:string}[]=[];
  const listed=names.length>8?`${names.slice(0,8).join(', ')} and ${names.length-8} more`:names.join(', ');
  fields.forEach((f,index)=>{const attribute=String(f.attribute??'');if(!attribute)return;
    const column=arriving.columns.find(c=>c.attribute===attribute);
    if(!column){const near=closestColumn(attribute,names);
      out.push({index,says:`"${attribute}" is not a column of ${arriving.source}.${near?` Did you mean "${near}"?`:''} Its columns are ${listed}.`});return;}
    // TEXT OF NUMERALS IS A NUMBER to the run (Point data keeps a count as "12"): only values that are not numbers say so.
    const words=(column.samples??[]).filter(v=>!Number.isFinite(Number(String(v).trim()))||String(v).trim()==='');
    if(f.kind==='number'&&column.kind==='term'&&words.length)
      out.push({index,says:`"${attribute}" arrives as text, not a number (${words.slice(0,2).map(v=>`"${v}"`).join(', ')}), so a rule comparing it with a number finds nothing. Declare it a term, or change the column.`});
  });
  return out;
}

export function checkRulesetJson(text:string,arriving?:ArrivingColumns):{ruleset?:RulesetFile;problems:JsonProblem[]}{
  const parsed=parseJson(text);
  if(parsed.error)return {problems:[parsed.error]};
  const pos=parsed.positions,lineOf=(path:string)=>{let p=path;while(p&&!pos.has(p))p=p.replace(/\.?[^.]*$/,'');return pos.get(p)?.line??1;};
  const problems:JsonProblem[]=[],say=(path:string,says:string)=>problems.push({line:lineOf(path),path,says});
  const v=parsed.value;
  if(!isObj(v))return {problems:[{line:1,says:'A ruleset is an object, { … }, with a title, fields and rules.'}]};
  if(v.schema!==undefined&&v.schema!==RULESET_SCHEMA)say('schema',`"schema" is ${RULESET_SCHEMA}, or left out.`);
  if(v.$schema!==undefined&&typeof v.$schema!=='string')say('$schema','"$schema" is the address of the schema an editor checks against.');
  if(typeof v.title!=='string'||!v.title.trim())say('title','"title" names the ruleset, in words.');
  if(typeof v.mustNotBeReadAs!=='string'||!v.mustNotBeReadAs.trim())say('mustNotBeReadAs','"mustNotBeReadAs" says what the rules must not be taken to mean.');
  const fields=Array.isArray(v.fields)?v.fields:[];
  if(!Array.isArray(v.fields))say('fields','"fields" is a list of the columns the rules read.');
  const predicates=new Set<string>();
  fields.forEach((f,k)=>{const p=`fields.${k}`;
    if(!isObj(f)){say(p,`Field ${k+1} is an object: { "attribute", "predicate", "kind" }.`);return;}
    if(typeof f.attribute!=='string'||!f.attribute)say(`${p}.attribute`,`Field ${k+1}: "attribute" is the column's name as the file spells it.`);
    if(typeof f.predicate!=='string'||!CURIE.test(f.predicate))say(`${p}.predicate`,`Field ${k+1}: "predicate" is a name such as fwa:chief_complaint.`);
    else predicates.add(f.predicate);
    if(!KINDS.includes(String(f.kind)))say(`${p}.kind`,`Field ${k+1}: "kind" is one of ${KINDS.join(', ')}.`);
  });
  const rules=Array.isArray(v.rules)?v.rules:[];
  if(!Array.isArray(v.rules))say('rules','"rules" is a list of rules.');
  const concluded=new Set(rules.flatMap(r=>isObj(r)&&Array.isArray(r.then)?r.then.filter(isObj).map(c=>String(c.predicate)):[]));
  rules.forEach((rule,r)=>{const p=`rules.${r}`;
    if(!isObj(rule)){say(p,`Rule ${r+1} is an object: { "any": [ … ], "then": [ … ] }.`);return;}
    if(!Array.isArray(rule.any)||!rule.any.length)say(`${p}.any`,`Rule ${r+1}: "any" lists one group of conditions or more.`);
    (Array.isArray(rule.any)?rule.any:[]).forEach((group,g)=>{const q=`${p}.any.${g}`;
      // A VALUE FOR EVERY RECORD is a rule whose one group has no condition: it computes, and holds for each record.
      const computes=Array.isArray(rule.then)&&rule.then.some(t=>isObj(t)&&(isObj(t.compute)||isObj(t.datetime)));
      if(!isObj(group)||!Array.isArray(group.all)||(!group.all.length&&!computes)){say(q,`Rule ${r+1}, group ${g+1}: "all" lists one condition or more.`);return;}
      group.all.forEach((c,k)=>{const s=`${q}.all.${k}`;
        if(!isObj(c)){say(s,`Rule ${r+1}, condition ${k+1} is an object: { "field", "comparator", "value" }.`);return;}
        const field=String(c.field??''),base=field.replace(/Known$/,'');
        if(!predicates.has(field)&&!predicates.has(base)&&!concluded.has(field))
          say(`${s}.field`,`Rule ${r+1}, condition ${k+1}: ${field||'"field"'} is not a declared field, nor a column a rule concludes.`);
        if(!COMPARATORS.includes(c.comparator as Comparator))say(`${s}.comparator`,`Rule ${r+1}, condition ${k+1}: "comparator" is one of ${COMPARATORS.join(', ')}.`);
        else if(isWordComparator(String(c.comparator))&&!containedWords(c.value).length)
          say(`${s}.value`,`Rule ${r+1}, condition ${k+1}: write the words to look for, separated by commas.`);
        if(!('value' in c))say(s,`Rule ${r+1}, condition ${k+1}: "value" is missing.`);
      });});
    if(!Array.isArray(rule.then)||!rule.then.length)say(`${p}.then`,`Rule ${r+1}: "then" lists what the rule concludes.`);
    else rule.then.forEach((t,k)=>{if(!isObj(t)||typeof t.predicate!=='string'||!CURIE.test(t.predicate))
      say(`${p}.then.${k}.predicate`,`Rule ${r+1}, conclusion ${k+1}: "predicate" names the column it gives a value, such as fwa:syndrome.`);});
  });
  // WHAT ARRIVES: each declared column against the step's input, where the input is known.
  if(arriving)for(const p of arrivingProblems(fields as never,arriving))say(`fields.${p.index}.attribute`,p.says);
  if(problems.length)return {problems};
  // WHAT IT MEANS: the checks the editor and the run make, each placed on the first line naming what it is about.
  const ruleset={...v} as unknown as RulesetFile;
  const firstLine=(predicate:string)=>{const k=text.indexOf(`"${predicate}"`);return k<0?1:text.slice(0,k).split('\n').length;};
  const authored={title:ruleset.title,mustNotBeReadAs:ruleset.mustNotBeReadAs,fields:ruleset.fields,parameters:ruleset.parameters??[],
    rules:ruleset.rules,...(ruleset.order?{order:ruleset.order}:{}),otherwise:ruleset.otherwise??[]} as never;
  for(const p of authoredUnitProblems(authored))problems.push({line:firstLine(p.field),says:p.says});
  for(const says of otherwiseProblems({rules:ruleset.rules,otherwise:ruleset.otherwise??[]} as never,(x:string)=>x.replace(/^[^:]*:/,'')))
    problems.push({line:1,says});
  if(!problems.length&&!evaluatedDirectly(authored)&&!computesValues(authored)){
    try{compileAuthoredRuleset({subject:'?s',rules:ruleset.rules} as never);}catch(error){problems.push({line:1,says:(error as Error).message});}
  }
  return problems.length?{problems}:{ruleset,problems};
}

/** A ruleset as the file a person downloads: two spaces, the schema first. */
export const rulesetText=(r:RulesetFile)=>{const {schema:_,$schema:__,...rest}=r as RulesetFile&{$schema?:string};void _;void __;
  return JSON.stringify({$schema:RULESET_SCHEMA_URL,schema:RULESET_SCHEMA,...rest},null,2)+'\n';};

/** AUTO-CLOSING BRACKETS (the practitioner, 2026-11-21: "Auto bracket."): a key typed into the JSON view, and what the
 *  text becomes. Undefined where the browser's own handling is right. Pure, so it is tested without a page. */
export function autoBracket(text:string,start:number,end:number,key:string):{text:string;caret:number;caretEnd?:number}|undefined{
  const pairs:Record<string,string>={'{':'}','[':']','"':'"'},before=text.slice(0,start),after=text.slice(end),selected=text.slice(start,end);
  if(pairs[key]){
    if(key==='"'&&start===end&&after[0]==='"')return {text,caret:start+1};
    if(selected)return {text:before+key+selected+pairs[key]+after,caret:start+1,caretEnd:end+1};
    if(key==='"'&&/[\w\\]$/.test(before))return undefined;
    return {text:before+key+pairs[key]+after,caret:start+1};
  }
  if((key==='}'||key===']')&&start===end&&after[0]===key)return {text,caret:start+1};
  if(key==='Backspace'&&start===end&&start>0){const open=text[start-1]!;
    if(pairs[open]&&after[0]===pairs[open])return {text:text.slice(0,start-1)+after.slice(1),caret:start-1};return undefined;}
  if(key==='Enter'&&start===end){
    const indent=/[^\n]*$/.exec(before)![0].match(/^\s*/)![0],open=before.slice(-1),close=after[0];
    if((open==='{'&&close==='}')||(open==='['&&close===']'))
      return {text:`${before}\n${indent}  \n${indent}${after}`,caret:start+indent.length+3};
    return {text:`${before}\n${indent}${/[{[]$/.test(before)?'  ':''}${after}`,caret:start+1+indent.length+(/[{[]$/.test(before)?2:0)};
  }
  if(key==='Tab'&&start===end)return {text:`${before}  ${after}`,caret:start+2};
  return undefined;
}

/** COLOUR-KEYED JSON (the practitioner, 2026-11-21: "color keyed JSON possible?"): the text as lines of marked tokens, drawn
 *  behind the transparent text being typed. Names bold as well as coloured, so the structure does not rest on colour; a
 *  line with a problem tinted, besides its sign in the margin. Pure, so it is tested without a page. */
export function highlightJson(text:string,badLines:ReadonlySet<number>=new Set()):string{
  const token=/("(?:\\.|[^"\\\n])*"?)(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;
  return text.split('\n').map((line,k)=>{
    let out='',last=0;
    for(const m of line.matchAll(token)){
      out+=escapeHtml(line.slice(last,m.index));
      const [whole,str,colon,num,lit,punct]=m;
      out+=str!==undefined
        ?(colon!==undefined?`<span class="json-key">${escapeHtml(str)}</span><span class="json-punct">${escapeHtml(colon)}</span>`:`<span class="json-string">${escapeHtml(str)}</span>`)
        :num!==undefined?`<span class="json-number">${num}</span>`
        :lit!==undefined?`<span class="json-literal">${lit}</span>`
        :`<span class="json-punct">${escapeHtml(punct!)}</span>`;
      last=m.index!+whole.length;
    }
    out+=escapeHtml(line.slice(last));
    return `<div class="json-line${badLines.has(k+1)?' json-line-bad':''}">${out||'​'}</div>`;
  }).join('');
}

/** STARTING POINTS (the practitioner, 2026-11-21: "for anyone coming up with new ruleset we have a template JSON?"):
 *  small rulesets that run as they are loaded, on the step's own columns where it has the kind each needs, and on named
 *  stand-ins where it has not, to be renamed to the columns the records carry. */
export interface TemplateField {attribute:string;predicate:string;kind:string;unit?:string;unitLabel?:string}
export const RULESET_TEMPLATES=[
  {id:'words',label:'Categories from words in text (a syndrome from a complaint)'},
  {id:'bands',label:'Bands from a number (age groups)'},
  {id:'target',label:'Days between two dates, against a target (7-1-7)'},
  {id:'every',label:'A value computed for every record (one column divided by another)'},
] as const;
export type TemplateId=typeof RULESET_TEMPLATES[number]['id'];
export function rulesetTemplate(id:TemplateId,fields:readonly TemplateField[]):RulesetFile{
  const of=(kind:string,n=0,attribute='',unit?:string):TemplateField=>fields.filter(f=>f.kind===kind)[n]
    ??{attribute,predicate:`fwa:${attribute}`,kind,...(unit?{unit:`http://qudt.org/vocab/unit/${unit}`,unitLabel:unit.toLowerCase()}:{})};
  const name=(f:TemplateField)=>f.attribute||f.predicate.replace(/^[^:]*:/,'');
  if(id==='words'){const text=of('term',0,'complaint');
    return {title:'Categories from words',mustNotBeReadAs:'a diagnosis: a category is what the words say',fields:[text],parameters:[],
      rules:[{any:[{all:[{field:text.predicate,comparator:'contains',value:'vomit, diarrh, n/v'}]}],then:[{predicate:'fwa:category',value:'gastrointestinal'}]},
        {any:[{all:[{field:text.predicate,comparator:'contains',value:'fever, flu'},{field:text.predicate,comparator:'notContains',value:'vomit, diarrh'}]}],
          then:[{predicate:'fwa:category',value:'influenza-like'}]}],
      otherwise:[{predicate:'fwa:category',value:'other'}]};}
  if(id==='bands'){const n=of('number',0,'age','YR');const {rules}=bandRules(n.predicate,0,[5,15,45,65],'band');
    return {title:`Bands of ${name(n)}`,mustNotBeReadAs:'a finding: the cut points are a choice',fields:[n],parameters:[],rules};}
  if(id==='target'){const earlier=of('date',0,'date_onset'),later=of('date',1,'date_notified');
    const t=targetRules({later:later.predicate,earlier:earlier.predicate,days:'days',target:7,setting:'target_days',verdict:'within_target'});
    return {title:`Days from ${name(earlier)} to ${name(later)}, against a target`,mustNotBeReadAs:'a judgement of anyone\'s work: a target met or not, as recorded',
      fields:[earlier,later],parameters:[t.setting],rules:t.rules,otherwise:t.otherwise};}
  const a=of('number',0,'cases','NUM'),b=of('number',1,'population','NUM');
  return {title:`${name(a)} divided by ${name(b)}`,mustNotBeReadAs:'a risk: the counts are as recorded',fields:[a,b],parameters:[],
    rules:[{any:[{all:[]}],then:[{predicate:'fwa:ratio',column:'ratio',meaning:`${name(a)} divided by ${name(b)}`,
      compute:{left:{field:a.predicate},operator:'dividedBy',right:{field:b.predicate}}}]}]};
}
