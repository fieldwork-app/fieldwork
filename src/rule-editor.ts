/** Writing rules, in a dialog with room to write them in.
 *
 *  The practitioner, 2026-10-15: *"I see the ruleset widget but it's not editable"*, and then
 *  *"Perhaps the rule editor should be a modal dialog so there is enough space."* Both right. The
 *  Inspector could show the rules a node carries and change their numbers; it could not add a
 *  condition, and a panel that narrow could not have held one legibly if it tried.
 *
 *  What this edits is [experiment 106](../docs/experiments/106-rule-builder-ui.md)'s authored
 *  form: conditions, grouped by AND, alternatives by OR, each rule concluding a list. The form is
 *  disjunctive normal form by construction, so every arrangement this dialog can produce has an
 *  N3 image -- the editor cannot build something the compiler must refuse for being inexpressible.
 *  What it CAN build is something refused for being too large, and the ceiling is checked on every
 *  edit rather than at the end.
 *
 *  Nothing is guessed. A field is chosen from the bindings the step declares, a comparator from
 *  what that field's kind supports, and a value is typed. The vocabulary a practitioner coins
 *  lives in `urn:fieldwork:authored:` and never in the application's own namespace.
 */
import type {ParamsByType} from './types.js';
import type {Escape} from './types.js';
import {compileAuthoredRuleset,compiledRuleCount,RULE_CEILING,authoredUnitProblems,settingNamed,isComputed,isWrittenDateTime,DIFFERENCE_UNITS,computesValues,
  COMPUTE_OPERATORS,readsPrevious,readsPreviousRows,evaluatedDirectly,otherwiseProblems,type Operand,type AuthoredOrder,
  type AuthoredOtherwise,bandRules,targetRules,isWordComparator} from './authored-rules.js';
import {checkRulesetJson,rulesetText,autoBracket,highlightJson,rulesetTemplate,RULESET_TEMPLATES,arrivingProblems,parseJson,type JsonProblem,type RulesetFile,type TemplateId,type ArrivingColumns} from './ruleset-json.js';
import {evaluateAuthored,OPERATOR_WORDS,localName,undescribedSentence,type Evaluation,type NoPrevious} from './rule-evaluation.js';
import {openConfigDialog,type ConfigSections} from './config-dialog.js';
import {DATE_FORMS,CLOCKS,type SubjectRecord} from './authored-application.js';

type Authored=NonNullable<ParamsByType['apply_ruleset']['authored']>;
type Field=Authored['fields'][number];

/** Which comparators a field of each kind can be asked for.
 *
 *  A term is matched or it is not; a number can be compared. Offering `is more than` for a
 *  category would compile to a math builtin that silently matches nothing, which is the failure
 *  the compiler refuses and this list prevents a practitioner from reaching. */
const COMPARATORS:Record<Field['kind'],{value:string;label:string}[]>={
  // WITH THEIR SYMBOLS (the practitioner, 2026-11-13: "Do we have less than or equal to and greater than or equal to?"
  // They were there, as "is at most" and "is at least", and could not be found by the sign a practitioner looks for).
  number:[{value:'equals',label:'is (=)'},{value:'notEquals',label:'is not (≠)'},{value:'greaterThan',label:'is more than (>)'},
    {value:'notLessThan',label:'is at least (≥)'},{value:'lessThan',label:'is less than (<)'},
    {value:'notGreaterThan',label:'is at most (≤)'}],
  term:[{value:'equals',label:'is (=)'},{value:'notEquals',label:'is not (≠)'},{value:'contains',label:'contains any of'},{value:'notContains',label:'contains none of'},{value:'startsWith',label:'has an item starting with any of'},{value:'notStartsWith',label:'has no item starting with any of'}],
  boolean:[{value:'equals',label:'is'}],
  // A DATE is a day, matched or not; it is compared through the days between two dates (experiment 200).
  date:[{value:'equals',label:'is'},{value:'notEquals',label:'is not'}],
  // A DATE AND TIME likewise: compared through the hours between two of them (2026-11-15).
  datetime:[{value:'equals',label:'is'},{value:'notEquals',label:'is not'}],
};

/** Whether a value was there to read is a COMPARATOR, not a field of its own.
 *
 *  Every bound field has a `…Known` companion: a generated fact saying whether this record had a
 *  readable value. It is what lets a rule conclude Unrecorded instead of concluding nothing, so
 *  it has to be reachable. It used to be reachable as a second entry in the field list, labelled
 *  `whether Deaths at this building is recorded` -- and a rule then read
 *
 *      IF  whether Deaths at this building is recorded  is  false
 *
 *  which is a double negative wrapped around a question. The practitioner, 2026-10-16: *"what
 *  does it mean when we say IF 'whether Deaths at this address is recorded'? That seems to be a
 *  hand curated condition."* It is not hand-curated -- it is generated for every field -- but it
 *  read as though somebody had written it, because a sentence had been composed around their
 *  label.
 *
 *  Then: *"That is context sensitive labeling. Not generic. If we had a different CSV how would
 *  this look?"* Worse. A fresh import labels a field with its raw column name, so the same row
 *  read `IF whether n_deaths is recorded is false` -- a column name inside an English sentence
 *  that does not parse. The composition was the defect, not the wording of this example.
 *
 *  So no sentence is composed. The field is the practitioner's field, whatever it is called, and
 *  `is recorded` / `is not recorded` sit in the comparator list beside `is more than`:
 *
 *      Deaths at this building  │ is not recorded
 *      n_deaths                 │ is not recorded
 *
 *  Both read. The stored condition is unchanged -- it is still `{field:'…Known', comparator:
 *  'equals', value:false}` -- so every compiled rule, every receipt and every saved workflow is
 *  exactly as it was. This is the surface only. */
const RECORDED='__recorded', NOT_RECORDED='__notRecorded';
const RECORDED_COMPARATORS=[{value:RECORDED,label:'is recorded'},{value:NOT_RECORDED,label:'is not recorded'}];

/** A field is named by its COLUMN, as the file spells it.
 *
 *  The practitioner, 2026-10-16: *"We have to present the data esp columns as is. It becomes
 *  confusing when we introduce our 'polish' to the facts on the ground."*
 *
 *  This used to prefer `label`, a human-readable name a binding may carry. In the ruleset worked
 *  example those labels were written by hand -- `DEATHS` was shown as "Deaths at this building"
 *  -- so a rule named a thing the file does not contain, and a practitioner checking the rule
 *  against their CSV had to hold a translation in their head. Worse, the polish is only ever
 *  available where somebody wrote it: a column binding made from an imported file labels itself
 *  with its own column name, so the example read better than the application it demonstrates.
 *
 *  The column is what the file has and what the practitioner will look for. A label, where one
 *  exists, belongs beside the binding in the Inspector -- as a gloss on the column -- and not in
 *  place of it in a rule. */
function readable(fields:Field[]):{predicate:string;label:string;kind:Field['kind']}[]{
  return fields.map(field=>({predicate:field.predicate,label:field.attribute,kind:field.kind}));
}

/** The declared field a condition is about, whether it reads the value or its presence. */
const baseFieldOf=(predicate:string,fields:Field[])=>
  fields.some(f=>`${f.predicate}Known`===predicate)?predicate.slice(0,-'Known'.length):predicate;
/** Whether this condition asks about presence rather than about the value. */
const asksPresence=(predicate:string,fields:Field[])=>
  fields.some(f=>`${f.predicate}Known`===predicate);

/** A TERM AS WORDS (the practitioner, 2026-11-12, of 7-1-7's rules showing fw:detectionWithinTarget and fw:Met: "I don't
 *  think it efficient to make users understand the underlying ontology just to enable them to make rules"). The prefix
 *  goes, whichever vocabulary it names, and an underscore reads as the space it stands for; what is stored is unchanged
 *  until it is edited. */
export const shownName=(term:string):string=>term.replace(/^[A-Za-z][\w-]*:/,'');
/** A category as the results table shows it: its underscores read as spaces. A column's name keeps its spelling. */
export const shownTerm=(term:string):string=>shownName(term).replace(/_/g,' ');

const blankCondition=(fields:Field[]):Authored['rules'][number]['any'][number]['all'][number]=>
  ({field:readable(fields)[0]?.predicate??'fwa:field',comparator:'equals',value:''});

export interface RuleEditorResult {rules:Authored['rules']; order?:AuthoredOrder;
  /** The settings declared, and what each is set to on this step. */
  parameters:NonNullable<Authored['parameters']>; values:Record<string,number>;
  /** Each column's default where no rule gave it one (experiment 192). */
  otherwise:AuthoredOtherwise[];
  /** The columns the rules read, with each one's kind and unit, and how the records arrive (experiment 186). */
  fields:Field[]; recordsKind?:'points'|'table'|'polygons'}
const PREVIOUS_WORDS:Record<AuthoredOrder['previous'],string>={row:'the row recorded before',day:'the day before',
  week:'the week before',month:'the month before'};
const NO_PREVIOUS_WORDS:Record<NoPrevious,string>={'first':'first of its group','period-missing':'no row for the period before',
  'repeated':'recorded twice','after-repeated':'after a value recorded twice','unordered':'nothing to sort it by'};

/** Opening a PUBLISHED ruleset, to read rather than to change.
 *
 *  The practitioner, 2026-10-15: *"The pinned rules should be editable so it's reviewable in the
 *  editor."* Reviewable is the word that settles it. A pinned ruleset is versioned and carries a
 *  basis, and a reader of a workflow has to be able to tell which rules ran, so it is not edited
 *  in place -- but it was not READABLE either: the Inspector showed its title, its description
 *  and its basis, and never the rules. Now the same editor opens it, laid out exactly as an
 *  authored rule is laid out, with every control disabled. It reads; it does not write. */
export interface ReviewOptions {note:string}

/** What the dialog is given beyond the rules themselves.
 *
 *  `settingValues` is what each declared setting is SET TO on this step, and it is here because
 *  of what the practitioner saw in the editor on 2026-10-17: a condition reading *"DEATHS is at
 *  most the cluster setting"*, and the observation that this is **fixed on context**. It is. The
 *  name `cluster` is declared and real, but `the … setting` is a sentence composed around it,
 *  and the sentence carries no more than the name does. A reader checking this rule against
 *  their data wants the number -- is the band 4 deaths or 40? -- and the number was two panels
 *  away, in the Inspector, while the rule that depends on it was on screen.
 *
 *  This is the third time the same shape has come back. `{{threshold}}` was the stored form
 *  reaching the surface; *"Deaths at this address"* was a label written over a column; *"the
 *  cluster setting"* is a phrase written over a value. Each time the fix is the same one: show
 *  what is there. */
export interface EditorOptions extends Partial<ReviewOptions> {
  settingValues?:Record<string,number|string|null|undefined>;
  /** THE RECORDS THE STEP READS, for the live preview (experiment 188): Before, as they arrive, and After, as these
   *  rules would leave them. Absent when nothing is connected or nothing has run. */
  preview?:{records:SubjectRecord[]; columns:string[]};
  /** A unit as typed, such as "degrees Celsius", to its QUDT IRI; undefined where the word is not known. */
  unitIri?:(label:string)=>string|undefined;
  /** THE STEP'S OWN SETTINGS, moved here from the Inspector (experiment 186): how the records arrive, and the columns
   *  the connected records carry, offered where none is declared yet. */
  recordsKind?:'points'|'table'|'polygons';
  candidates?:Field[];
  /** THE COLUMNS ARRIVING ON THE INPUT, with samples, and the step they come from (2026-11-21): checked against the fields. */
  arriving?:ArrivingColumns;
  /** The step's name, for the dialog's heading. */
  step?:string;
}

/** Rows a preview draws. The counts are of every record; this is how many are drawn, a display choice, not a cap on
 *  the data. Not measured: the number of rows a person can read in a dialog, or draw on every keystroke, is open. */
export const PREVIEW_ROWS=50;

/** THE COLUMNS RULES WRITE BY COMPUTING, named as After heads them. */
export const computedColumnsOf=(rules:Authored['rules'])=>rules.flatMap(rule=>rule.then.filter(c=>isComputed(c)||isWrittenDateTime(c))
  .map(c=>({predicate:c.predicate,label:c.column?.trim()||localName(c.predicate)})));
/** BEFORE, SORTED AND AFTER (experiment 188): the records as they arrive and as the rules leave them, with the columns
 *  they conclude. Shared since 2026-11-28 by the rule editor and the published ruleset's dialog, so both show what a
 *  ruleset concludes the same way. `computed` names the columns the rules write, shown even where no record has one. */
export function beforeAndAfter(p:{records:SubjectRecord[];columns:string[]}|undefined,evaluation:Evaluation|null,
    computed:string[],esc:Escape):string{
  const cell=(v:unknown)=>v===null||v===undefined?'':typeof v==='number'?String(v):String(v);
  if(!p?.records.length)return `<section class="rule-live"><h3>Before and after</h3>`
    +`<p class="description">Connect the records this step reads, or run the workflow once, to see what these rules do to them.</p></section>`;
  const shown=p.records.slice(0,PREVIEW_ROWS);
  const head=(cols:string[])=>`<tr>${cols.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr>`;
  const before=`<table class="rule-live-table"><thead>${head(p.columns)}</thead><tbody>`
    +shown.map(r=>`<tr>${p.columns.map(c=>`<td>${esc(cell(r.properties[c]))}</td>`).join('')}</tr>`).join('')+`</tbody></table>`;
  if(!evaluation)return `<section class="rule-live"><h3>Before</h3>${before}</section>`;
  // SORTED, where the step sorts: the same rows in the order the rules read them, and After in that order too.
  const sortedOrder=evaluation.order?evaluation.sequence.slice(0,PREVIEW_ROWS):null;
  const sortedTable=sortedOrder?`<table class="rule-live-table"><thead>${head(p.columns)}</thead><tbody>`
    +sortedOrder.map(i=>`<tr>${p.columns.map(c=>`<td>${esc(cell(p.records[i]!.properties[c]))}</td>`).join('')}</tr>`).join('')+`</tbody></table>`:'';
  const afterRows=sortedOrder??shown.map((_,i)=>i);
  const added=[...new Set([...computed,...evaluation.records.flatMap(r=>Object.keys(r.values))])];
  const after=`<table class="rule-live-table"><thead>${head([...p.columns,...added,'Rule'])}</thead><tbody>`
    +afterRows.map(i=>{const r=p.records[i]!,o=evaluation!.records[i]!;
      const marks=[...o.divisionsByZero.map(c=>`${c}: divided by zero`),...o.missing.map(m=>`${m.column}: no ${m.operands.join(' or ')}`),
    ...o.conflicts.map(c=>`${c.column}: rules ${c.rules.join(' and ')} disagree`),
    ...o.noPrevious.map(x=>`${x.column}: no previous row, ${NO_PREVIOUS_WORDS[x.why]}`),
    ...o.fell.map(c=>`${c}: fell below the previous row`)];
      return `<tr${o.rules.length?'':' data-unmatched'}>${p.columns.map(c=>`<td>${esc(cell(r.properties[c]))}</td>`).join('')}`
    +added.map(c=>`<td class="rule-new">${esc(cell(o.values[c]))}</td>`).join('')
    +`<td>${o.rules.length?esc(o.rules.map(n=>`Rule ${n}`).join(', ')):'No rule'}${marks.length?`<br><strong>${esc(marks.join('; '))}</strong>`:''}</td></tr>`;}).join('')
    +`</tbody></table>`;
  const n=p.records.length;
  const count=(test:(o:Evaluation['records'][number])=>boolean)=>evaluation!.records.filter(test).length;
  const records=(k:number)=>`${k.toLocaleString('en')} record${k===1?'':'s'}`,has=(k:number)=>k===1?'has':'have';
  const none=count(o=>!o.rules.length),zero=count(o=>o.divisionsByZero.length>0),
    lacking=count(o=>o.missing.length>0),split=count(o=>o.conflicts.length>0),
    orphan=count(o=>o.noPrevious.length>0),fell=count(o=>o.fell.length>0);
  const words=[none?`${records(none)} matched no rule.`:'Every record matched a rule.',
    zero?`${records(zero)} ${has(zero)} an empty value, from a division by zero.`:'',
    lacking?`${records(lacking)} ${has(lacking)} no value, because a value to compute from is missing.`:'',
    split?`${records(split)} ${has(split)} no value, because two rules gave different values.`:'',
    orphan?`${records(orphan)} ${has(orphan)} no value, because there is no single previous row.`:'',
    fell?`${records(fell)} fell below the previous row, kept as computed.`:'',
    // A DEFAULT IS SAID AS ONE (experiment 192), beside the records no rule matched.
    ...Object.entries(evaluation.defaultedByColumn??{}).map(([c,k])=>`${records(k)} took ${c}'s otherwise.`),
    undescribedSentence(evaluation)].filter(Boolean);
  return `<section class="rule-live" aria-live="polite"><h3>${sortedOrder?'Before, sorted and after':'Before and after'}</h3>`
    +`<p class="rule-live-summary">${esc(`${n.toLocaleString('en')} record${n===1?'':'s'}. `+words.join(' '))}</p>`
    +(n>shown.length?`<p class="description">Showing the first ${shown.length} of ${n.toLocaleString('en')}. The counts are of all of them.</p>`:'')
    +`<h4>Before</h4><div class="rule-live-scroll">${before}</div>`
    +(sortedOrder?`<h4>Sorted</h4><p class="description">${esc(`By ${evaluation.order!.by}${evaluation.order!.within.length?`, within each ${evaluation.order!.within.join(' and ')}`:''}. The previous row is ${PREVIOUS_WORDS[evaluation.order!.previous]}.`)}</p><div class="rule-live-scroll">${sortedTable}</div>`:'')
    +`<h4>After</h4><div class="rule-live-scroll">${after}</div></section>`;
    }


/** Opens the dialog. Resolves with the edited rules, or with nothing if the practitioner closes
 *  it without keeping them -- the node is not touched until they do. */
export function openRuleEditor(authored:Authored,esc:Escape,options?:EditorOptions):Promise<RuleEditorResult|undefined>{
  return new Promise(resolve=>{
    const review=options?.note===undefined?undefined:{note:options.note};
    // Edited on a copy. A practitioner who closes without keeping leaves the step as it was, and
    // one who keeps gets a single change that Undo reverses in one step.
    let rules:Authored['rules']=JSON.parse(JSON.stringify(authored.rules));
    // THE SORT, inside the step that needs it (experiment 188, stage 4): no Sort step on the canvas.
    let order:AuthoredOrder|undefined=authored.order?structuredClone(authored.order):undefined;
    // THE COLUMNS, THEIR KINDS AND UNITS, AND HOW THE RECORDS ARRIVE, edited here with the rules (experiment 186).
    let fields:Field[]=structuredClone(authored.fields),choices=readable(fields);
    const bands={open:false,field:'',start:'0',cuts:'',column:'band'};
    const target={open:false,earlier:'',later:'',days:'days',target:'7',setting:'target_days',verdict:'within_target'};
    const targetMarkup=()=>{
      const columns=choices.filter(c=>c.kind==='date'||c.kind==='number');
      if(review||columns.length<2)return '';
      if(!columns.some(c=>c.predicate===target.earlier))target.earlier=columns[0]!.predicate;
      if(!columns.some(c=>c.predicate===target.later))target.later=columns[1]!.predicate;
      const pick=(id:string,key:'earlier'|'later',label:string)=>`<div class="field"><label class="field-label" for="${id}">${label}</label><select id="${id}">`
        +columns.map(c=>`<option value="${esc(c.predicate)}" ${c.predicate===target[key]?'selected':''}>${esc(c.label)}</option>`).join('')+`</select></div>`;
      const text=(id:string,key:'days'|'target'|'setting'|'verdict',label:string)=>`<div class="field"><label class="field-label" for="${id}">${label}</label>`
        +`<input id="${id}" value="${esc(target[key])}"${key==='target'?' inputmode="decimal"':''}></div>`;
      return `<details id="rule-editor-target" class="config-group"${target.open?' open':''}><summary>Compare with a target…</summary>`
        +pick('target-earlier','earlier','From')+pick('target-later','later','To')
        +text('target-days','days','New column for the days')
        +text('target-value','target','Target, in days')+text('target-setting','setting','Name of the target setting')
        +text('target-verdict','verdict','New column for the verdict')
        +`<p id="target-preview" class="description" aria-live="polite"></p>`
        +`<button type="button" class="button" id="target-add">Add these rules</button></details>`;
    };
    const bandsMarkup=()=>{
      const numbers=choices.filter(c=>c.kind==='number');
      if(review||!numbers.length)return '';
      if(!numbers.some(c=>c.predicate===bands.field))bands.field=numbers[0]!.predicate;
      return `<details id="rule-editor-bands" class="config-group"${bands.open?' open':''}><summary>Make bands…</summary>`
        +`<div class="field"><label class="field-label" for="bands-field">Number column</label><select id="bands-field">`
        +numbers.map(c=>`<option value="${esc(c.predicate)}" ${c.predicate===bands.field?'selected':''}>${esc(c.label)}</option>`).join('')+`</select></div>`
        +`<div class="field"><label class="field-label" for="bands-start">The first band starts at</label><input id="bands-start" type="number" value="${esc(bands.start)}"></div>`
        +`<div class="field"><label class="field-label" for="bands-cuts">Cut points, rising</label><input id="bands-cuts" value="${esc(bands.cuts)}" placeholder="1, 5, 10, 15">`
        +`<small>Each cut point starts a new band. The last band is open above.</small></div>`
        +`<div class="field"><label class="field-label" for="bands-column">New column</label><input id="bands-column" value="${esc(bands.column)}"></div>`
        +`<p id="bands-preview" class="description" aria-live="polite"></p>`
        +`<button type="button" class="button" id="bands-add">Add these rules</button></details>`;
    };
    // A CATEGORY ANOTHER RULE CONCLUDED is a column a condition can read (experiment 192): rules in stages, a laboratory
    // result first, then the class read from it. Offered after the records' own columns, by the name the rule gave it.
    const concludedChoices=()=>{const own=new Set(fields.map(f=>f.predicate));
      return [...new Set(rules.flatMap(r=>r.then.filter(c=>!isComputed(c)).map(c=>c.predicate)))].filter(p=>!own.has(p))
        .map(p=>({predicate:p,label:localName(p),kind:'term' as Field['kind']}));};
    const isConcluded=(predicate:string)=>!fields.some(f=>f.predicate===predicate);
    const withConcluded=()=>[...readable(fields),...concludedChoices()];
    let recordsKind=options?.recordsKind;
    // THE JSON VIEW (2026-11-21): the same ruleset as text, checked as it is typed. `jsonText` is the text being edited,
    // kept while it is invalid; undefined, the view writes it afresh from the rules.
    let view:'rules'|'json'='rules',jsonText:string|undefined,jsonProblems:JsonProblem[]=[],jsonScroll=0;
    // COLOURS IN THE JSON VIEW, on unless a person turned them off on this device (a convenience, kept where it can be).
    let colour=true;try{colour=localStorage.getItem('fieldwork-json-colour')!=='off';}catch{/* storage unavailable: colours on */}
    // EACH COLUMN'S DEFAULT, where no rule gave it a value (experiment 192).
    let otherwise:AuthoredOtherwise[]=structuredClone(authored.otherwise??[]);
    const kindOf=(predicate:string)=>choices.find(c=>c.predicate===predicate)?.kind??'term';
    // SETTINGS, declared here (experiment 188): a number the rules compare against, with its unit, set on this step.
    let settings:NonNullable<Authored['parameters']>=structuredClone(authored.parameters??[]);
    const values:Record<string,number>=Object.fromEntries(Object.entries(options?.settingValues??{})
      .filter(([,v])=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))).map(([k,v])=>[k,Number(v)]));
    const unitOf=(predicate:string)=>{
      const field=fields.find(f=>f.predicate===predicate);
      return field?.unitLabel||field?.unit?.split('/').pop();
    };

    /** What a condition is compared against: a number typed here, or one of the step's settings.
     *
     *  A setting used to be TYPED, as `{{threshold}}`, because that is how the compiled rules
     *  carry it -- a published ruleset's rules are text and `bindParameters` fills the
     *  placeholders. The practitioner, 2026-10-15: *"Why are we using template syntax that not
     *  anyone would write?"* Nobody would. It was the stored form reaching the surface, the same
     *  mistake as printing `fwa:` at them, and the fix is the same: the condition refers to the
     *  setting by name, and the compiler writes the placeholder at the edge where rules become
     *  text. The syntax is now something only the reasoner ever sees. */
    const valueControl=(kind:Field['kind'],where:string,
      condition:Authored['rules'][number]['any'][number]['all'][number])=>{
      if(kind==='boolean')
        return `<select ${where} data-part="value" aria-label="Value">`
          +`<option value="true" ${condition.value===true?'selected':''}>true</option>`
          +`<option value="false" ${condition.value===false?'selected':''}>false</option></select>`;
      // The unit the field is measured in, beside the box the number is typed into. A bare
      // literal takes the field's unit and nothing can check it, so showing it is the only
      // defence there is: the practitioner typing 10 can see whether 10 means minutes.
      const unit=kind==='number'&&unitOf(condition.field)
        ?`<span class="rule-unit">${esc(unitOf(condition.field)!)}</span>`:'';
      // A term is shown as it was typed, without the namespace the rules write it in.
      const words=isWordComparator(condition.comparator);
      const shown=words?String(condition.value??''):kind==='term'&&typeof condition.value==='string'?condition.value.replace(/^fwa:/,'').replace(/_/g,' '):String(condition.value??'');
      if(kind!=='number'||!settings.length)
        return `<input ${where} data-part="value" aria-label="${words?'Words, separated by commas':'Value'}" value="${esc(shown)}" `
          +`placeholder="${kind==='number'?'a number':words?'words, separated by commas: vomit, diarrh, n/v':'a value, such as clinic'}"${words?' class="rule-words"':''}>`+unit;
      const setting=settingNamed(condition.value);
      return `<select ${where} data-part="value-source" aria-label="Compared against">`
        +`<option value="" ${setting?'':'selected'}>a number</option>`
        +settings.map(s=>{
          // The setting's name and what it is set to. Not "the cluster setting": that phrase is
          // the name with English around it, and a rule is unreadable until the figure it turns
          // on is on the same line as the condition. "not set" is a fallback rather than a state
          // the practitioner can reach -- `validateWorkflow` refuses a step whose declared
          // setting has no finite value, so an edit that empties one is rolled back before it is
          // stored. It is written out rather than left blank so that a step reaching the dialog
          // without its values says so instead of showing a name that reads like a figure.
          const held=values[s.name];
          const shown=held===undefined
            ?'not set'
            :`${held}${s.unitLabel?' '+s.unitLabel:''}`;
          // NAMED BY WHAT IT MEANS where its name is a key (7-1-7's detectionTarget: "Days from emergence to detection");
          // a name a person gave in words, such as "busy", stays theirs.
          const keyLike=/[a-z][A-Z]|_/.test(s.name);
          const said=keyLike&&(s as {meaning?:string}).meaning?.split('.')[0]?.trim()||s.name;
          return `<option value="${esc(s.name)}" ${s.name===setting?'selected':''}>${esc(said)} · ${esc(shown)}</option>`;
        }).join('')
        +`</select>`
        +(setting
          // The setting's own unit, not the field's: they must agree, and authoredUnitProblems
          // refuses the run when they do not. Showing both is what makes that refusal legible.
          ?`<span class="rule-unit">${esc(settings.find(s=>s.name===setting)?.unitLabel||'')}</span>`
          :`<input ${where} data-part="value" aria-label="Value" value="${esc(String(condition.value??''))}" placeholder="a number">`+unit);
    };


    const conditionRow=(rule:number,group:number,index:number,
      condition:Authored['rules'][number]['any'][number]['all'][number])=>{
      const presence=asksPresence(condition.field,fields);
      const base=baseFieldOf(condition.field,fields);
      const kind=kindOf(base);
      const where=`data-rule="${rule}" data-group="${group}" data-condition="${index}"`;
      return `<div class="rule-condition">`
        // The connective, in the margin, as the read-only view shows it. Two conditions stacked
        // with nothing between them read as two separate facts rather than as one rule that
        // needs both.
        +`<span class="rule-and">${index?'and':''}</span>`
        +`<select ${where} data-part="field" aria-label="Field">`
        +choices.map(choice=>`<option value="${esc(choice.predicate)}" ${choice.predicate===base?'selected':''}>${esc(choice.label)}</option>`).join('')
        +`</select>`
        +`<select ${where} data-part="comparator" aria-label="Comparator" class="rule-op rule-op-${presence?'presence'
          :condition.comparator==='equals'||condition.comparator==='notEquals'?'equal':'compare'}">`
        // A concluded column has no "is recorded" fact to ask about: a rule gave it a value or it has none.
        +[...COMPARATORS[kind],...(isConcluded(base)?[]:RECORDED_COMPARATORS)].map(c=>{
          const chosen=presence?(condition.value===true?RECORDED:NOT_RECORDED):condition.comparator;
          return `<option value="${c.value}" ${c.value===chosen?'selected':''}>${esc(c.label)}</option>`;
        }).join('')
        +`</select>`
        // Nothing to compare against when the question is whether there was anything to compare.
        +(presence?'':valueControl(kind,where,condition))
        +`<button class="button small danger" ${where} data-part="drop-condition" aria-label="Remove this condition">Remove</button>`
        +`</div>`;
    };

    // THE LIVE PREVIEW, evaluated on every edit, so a rule is seen doing what it does while it is written.
    let evaluation:Evaluation|null=null;
    const numericSettings=values;
    const evaluate=():Evaluation|null=>{
      if(!options?.preview?.records.length)return null;
      try{return evaluateAuthored(options.preview.records,fields as never,rules as never,numericSettings,order,otherwise);}catch{return null;}
    };
    const computedColumns=()=>computedColumnsOf(rules as never);
    // A DATE-LIKE OPERAND (2026-11-15): a date or date-time column, or a date and time a rule writes.
    const writtenDates=()=>new Set(rules.flatMap(rule=>rule.then.filter(isWrittenDateTime).map(c=>c.predicate)));
    const dateLike=(o:Operand)=>typeof o==='object'&&'field' in o&&(writtenDates().has(o.field)||['date','datetime'].includes(kindOf(o.field)));
    const operandControl=(r:number,t:number,side:'left'|'right',operand:Operand)=>{
      // A DATE is offered too: one date minus another gives days (experiment 200); anything else with one is refused.
      const numbers=choices.filter(c=>c.kind==='number'||c.kind==='date'||c.kind==='datetime');
      const own=rules[r]!.then[t]!.predicate;
      const others=computedColumns().filter(c=>c.predicate!==own);
      const chosen=typeof operand==='object'&&'field' in operand?(readsPrevious(operand)?`previous:${operand.field}`:operand.field):'';
      return `<select data-rule="${r}" data-then="${t}" data-part="${side}-source" aria-label="${side==='left'?'First':'Second'} value">`
        +`<option value="" ${chosen?'':'selected'}>a number</option>`
        +numbers.map(c=>`<option value="${esc(c.predicate)}" ${c.predicate===chosen?'selected':''}>${esc(c.label)}</option>`).join('')
        +others.map(c=>`<option value="${esc(c.predicate)}" ${c.predicate===chosen?'selected':''}>${esc(c.label)}</option>`).join('')
        // A COLUMN IN THE PREVIOUS ROW, for a value between rows: new cases from a cumulative count.
        +numbers.map(c=>`<option value="previous:${esc(c.predicate)}" ${`previous:${c.predicate}`===chosen?'selected':''}>${esc(c.label)} in the previous row</option>`).join('')
        +`</select>`
        +(chosen?'':`<input data-rule="${r}" data-then="${t}" data-part="${side}-number" aria-label="${side==='left'?'First':'Second'} number" value="${esc(typeof operand==='number'?String(operand):'')}" placeholder="a number">`);
    };
    const settingProblem=():string=>{
      const names=new Set<string>();
      for(const s of settings){
        if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(s.name))return `A setting's name is one word of letters, digits or _, starting with a letter: "${s.name}" is not.`;
        if(names.has(s.name))return `Two settings are named "${s.name}".`;
        names.add(s.name);
        if(values[s.name]===undefined)return `Set ${s.name} to a number.`;
      }
      return '';
    };
    const computedProblem=():string=>{
      if(readsPreviousRows({rules:rules as never})&&!order?.by)
        return 'A rule reads the previous row, so the records need an order: choose the column to sort them by, above the rules.';
      const attributes=new Set(fields.map(f=>f.attribute));
      const names=new Set<string>();
      for(const [r,rule] of rules.entries())for(const c of rule.then){
        if(!isComputed(c))continue;
        const name=c.column?.trim()||'';
        if(!name)return `Rule ${r+1}: name the new column.`;
        if(attributes.has(name))return `Rule ${r+1}: "${name}" is already a column of these records. A new column needs a name of its own.`;
        if(names.has(name)&&!rules.some((other,o)=>o!==r&&other.then.some(x=>x.predicate===c.predicate)))
          return `Rule ${r+1}: "${name}" is already the name of another new column.`;
        names.add(name);
        for(const side of [c.compute.left,c.compute.right])
          if(typeof side==='number'&&!Number.isFinite(side))return `Rule ${r+1}: type a number, or choose a column.`;
      }
      return '';
    };
    const cell=(v:unknown)=>v===null||v===undefined?'':typeof v==='number'?String(v):String(v);
    // THE COLUMNS THAT CAN ORDER THE RECORDS, dates first, because a cumulative count accumulates over time.
    const sortColumns=()=>{
      const columns=options?.preview?.columns??fields.map(f=>f.attribute);
      const records=options?.preview?.records??[];
      const dated=(c:string)=>records.length>0&&records.every(r=>{const v=r.properties[c];return v===null||v===''||/^\d{4}-\d{2}-\d{2}$/.test(String(v));});
      return [...columns.filter(dated),...columns.filter(c=>!dated(c))].map(c=>({column:c,date:dated(c)}));
    };
    const settingsMarkup=()=>`<section class="rule-order"><h3>Settings</h3>`
      +`<p class="description">A number the rules compare against. State its unit: the unit of what it is compared with.</p>`
      +settings.map((setting,i)=>`<div class="rule-condition">`
        +`<input data-setting="${i}" data-setting-part="name" aria-label="Setting name" value="${esc(setting.name)}" placeholder="fever">`
        +`<span class="rule-is">is</span>`
        +`<input data-setting="${i}" data-setting-part="value" aria-label="Setting value" inputmode="decimal" value="${esc(values[setting.name]===undefined?'':String(values[setting.name]))}" placeholder="38">`
        +`<input data-setting="${i}" data-setting-part="unit" aria-label="Setting unit" value="${esc(setting.unitLabel??'')}" placeholder="degrees Celsius">`
        +`<button class="button small danger" data-setting="${i}" data-setting-part="drop" aria-label="Remove setting ${esc(setting.name)}">Remove</button></div>`).join('')
      +`<button class="button small" id="rule-editor-add-setting">+ Add a setting</button></section>`;
    const orderMarkup=()=>{
      const columns=sortColumns();
      return `<section class="rule-order"><h3>Before the rules: sort the records</h3>`
        +`<p class="description">Needed by a rule that reads the previous row.</p>`
        +`<div class="rule-condition"><label class="field-label" for="rule-order-by">Sort by</label>`
        +`<select id="rule-order-by" data-order="by"><option value="" ${order?.by?'':'selected'}>Not sorted</option>`
        +columns.map(c=>`<option value="${esc(c.column)}" ${order?.by===c.column?'selected':''}>${esc(c.column)}${c.date?' (dates)':''}</option>`).join('')
        +`</select></div>`
        +(order?.by
          ?`<fieldset class="rule-order-within"><legend class="field-label">Within each</legend>`
            +columns.filter(c=>c.column!==order!.by).map(c=>`<label class="check"><input type="checkbox" data-order-within="${esc(c.column)}" ${order!.within.includes(c.column)?'checked':''}> ${esc(c.column)}</label>`).join('')
            +`</fieldset>`
            +`<div class="rule-condition"><label class="field-label" for="rule-order-previous">The previous row is</label>`
            +`<select id="rule-order-previous" data-order="previous">`
            +(Object.keys(PREVIOUS_WORDS) as AuthoredOrder['previous'][]).map(k=>`<option value="${k}" ${order!.previous===k?'selected':''}>${esc(PREVIOUS_WORDS[k])}</option>`).join('')
            +`</select></div>`
            +(order.previous!=='row'?`<p class="description">Where that ${order.previous} has no row, the value is empty, and counted.</p>`:'')
          :'')
        +`</section>`;
    };
    const previewMarkup=()=>beforeAndAfter(options?.preview,evaluation,computedColumns().map(c=>c.label),esc);

    // THE COLUMNS THE RULES READ, their kind and unit, as the Inspector listed them before (experiment 186).
    const fieldsMarkup=()=>`<section class="rule-order"><h3>Records and columns</h3>`
      +`<div class="rule-condition"><label class="field-label" for="ruleset-records">Records arrive as</label>`
      +`<select id="ruleset-records">`+([['points','Points'],['table','A table'],['polygons','Polygons']] as const)
        .map(([v,w])=>`<option value="${v}" ${recordsKind===v?'selected':''}>${w}</option>`).join('')+`</select></div>`
      +(fields.length
        ?`<table class="inspector-table"><thead><tr><th>Column</th><th>Kind</th><th>Unit</th></tr></thead><tbody>`
          +fields.map((f,i)=>`<tr><td>${esc(f.attribute)}</td><td><select data-field-kind="${i}" aria-label="Kind of ${esc(f.attribute)}">`
            +([['number','number'],['date','date, year-month-day'],['datetime','date and time, year-month-dayThh:mm'],['term','category'],['boolean','true or false']] as const)
              .map(([k,w])=>`<option value="${k}"${f.kind===k?' selected':''}>${w}</option>`).join('')+`</select></td>`
            +`<td>${f.kind==='number'?`<input data-field-unit="${i}" value="${esc(f.unitLabel??'')}" placeholder="minutes" aria-label="Unit for ${esc(f.attribute)}">`:'—'}</td></tr>`).join('')
          +`</tbody></table><p class="description">A numeric column the rules read needs its unit.</p>`
        :options?.candidates?.length
          ?`<p class="description">The connected records carry ${options.candidates.length} column${options.candidates.length===1?'':'s'}: ${esc(options.candidates.map(c=>c.attribute).join(', '))}.</p>`
            +`<button class="button" id="use-columns" data-editor-add>Use these ${options.candidates.length} column${options.candidates.length===1?'':'s'}</button>`
          :`<div class="notice">Connect the records these rules read, and their columns are offered here.</div>`)
      +`</section>`;

    // A RULE AS BLOCKS (experiment 192): each part its own kind of block, with its word, so the structure reads at a glance
    // and in greyscale. The word is the cue; the colour and the edge repeat it.
    // A DATE AND TIME FROM ITS PARTS (2026-11-15): the date column and how it writes dates, the year where it has none,
    // and the time column with its clock. Every form is declared; a value that does not fit is counted, never guessed.
    const dateTimeRow=(r:number,t:number,conclusion:Authored['rules'][number]['then'][number]&{datetime:NonNullable<Authored['rules'][number]['then'][number]['datetime']>})=>{
      const d=conclusion.datetime,where=`data-rule="${r}" data-then="${t}"`;
      const columns=(chosen:string|undefined,part:string,label:string,none?:string)=>`<select ${where} data-part="${part}" aria-label="${label}">`
        +(none!==undefined?`<option value="" ${chosen?'':'selected'}>${none}</option>`:'')
        +fields.map(f=>`<option value="${esc(f.predicate)}" ${f.predicate===chosen?'selected':''}>${esc(f.attribute)}</option>`).join('')+`</select>`;
      const yearSetting=d.year!==undefined&&typeof d.year==='object'?d.year.setting:'';
      const needsYear=!d.form.endsWith('year')&&d.form!=='year-month-day';
      return `<input ${where} data-part="column" aria-label="New column" value="${esc(conclusion.column??localName(conclusion.predicate))}" placeholder="new column">`
        +`<span class="rule-is">is the date in</span><select ${where} data-part="dt-date" aria-label="Date column">`
        +`<option value="" ${d.on!==undefined?'selected':''}>one date for every record</option>`
        +fields.map(f=>`<option value="${esc(f.predicate)}" ${d.on===undefined&&f.predicate===d.date?'selected':''}>${esc(f.attribute)}</option>`).join('')+`</select>`
        +(d.on!==undefined?`<input ${where} data-part="dt-on" aria-label="The date every record shares" value="${esc(d.on)}" placeholder="1940-04-18">`
          :`<span class="rule-is">written</span><select ${where} data-part="dt-form" aria-label="How the dates are written">`
          +DATE_FORMS.map(f=>`<option value="${f}" ${f===d.form?'selected':''}>${f}</option>`).join('')+`</select>`)
        +(needsYear&&d.on===undefined?`<span class="rule-is">in the year</span><select ${where} data-part="dt-year-source" aria-label="Where the year comes from">`
          +`<option value="" ${yearSetting?'':'selected'}>typed here</option>`
          +settings.map(x=>`<option value="${esc(x.name)}" ${x.name===yearSetting?'selected':''}>${esc(x.name)}</option>`).join('')+`</select>`
          +(yearSetting?'':`<input ${where} data-part="dt-year" aria-label="Year" inputmode="numeric" value="${esc(typeof d.year==='number'?String(d.year):'')}" placeholder="1940">`):'')
        +`<span class="rule-is">at the time in</span>`+columns(d.time,'dt-time','Time column','no time')
        +(d.time?`<select ${where} data-part="dt-clock" aria-label="Clock">`
          +CLOCKS.map(c=>`<option value="${c}" ${c===d.clock?'selected':''}>${c==='12-hour'?'12-hour, as 8:00 PM':'24-hour, as 20:00'}</option>`).join('')+`</select>`:'');
    };
    const conclusionRow=(r:number,t:number,conclusion:Authored['rules'][number]['then'][number],rule:Authored['rules'][number])=>
      `<div class="rule-condition">`
      +`<select data-rule="${r}" data-then="${t}" data-part="then-kind" aria-label="Kind of conclusion">`
        +`<option value="category" ${isComputed(conclusion)||isWrittenDateTime(conclusion)?'':'selected'}>a category</option>`
        +`<option value="computed" ${isComputed(conclusion)?'selected':''}>a computed value</option>`
        +`<option value="datetime" ${isWrittenDateTime(conclusion)?'selected':''}>a date and time</option></select>`
      +(isWrittenDateTime(conclusion)?dateTimeRow(r,t,conclusion)
      :isComputed(conclusion)
        ?`<input data-rule="${r}" data-then="${t}" data-part="column" aria-label="New column" value="${esc(conclusion.column??localName(conclusion.predicate))}" placeholder="new column">`
          +`<span class="rule-is">is</span>`
          +operandControl(r,t,'left',conclusion.compute.left)
          +`<select data-rule="${r}" data-then="${t}" data-part="operator" aria-label="Operation">`
          +COMPUTE_OPERATORS.map(o=>`<option value="${o}" ${o===conclusion.compute.operator?'selected':''}>${OPERATOR_WORDS[o]}</option>`).join('')+`</select>`
          +operandControl(r,t,'right',conclusion.compute.right)
          // A DIFFERENCE OF DATES OR DATES AND TIMES, IN A UNIT IT NAMES (2026-11-15).
          +(dateLike(conclusion.compute.left)&&dateLike(conclusion.compute.right)
            ?`<span class="rule-is">in</span><select data-rule="${r}" data-then="${t}" data-part="per" aria-label="Unit of the difference">`
              +`<option value="" ${conclusion.compute.per?'':'selected'}>days, between dates</option>`
              +DIFFERENCE_UNITS.map(u=>`<option value="${u}" ${conclusion.compute.per===u?'selected':''}>${u}</option>`).join('')+`</select>`:'')
          +`<span class="rule-is">measured in</span>`
          +`<input data-rule="${r}" data-then="${t}" data-part="unit" aria-label="Unit of the new column" value="${esc(conclusion.unit??'')}" placeholder="unit, such as days">`
          +`<input data-rule="${r}" data-then="${t}" data-part="meaning" aria-label="What the new column measures" value="${esc(conclusion.meaning??'')}" placeholder="what it measures">`
        :`<input data-rule="${r}" data-then="${t}" data-part="predicate" aria-label="Conclusion name" value="${esc(shownName(conclusion.predicate))}" placeholder="band">`
          +`<span class="rule-is">is</span>`
          +`<input data-rule="${r}" data-then="${t}" data-part="conclusion" aria-label="Conclusion value" value="${esc(shownTerm(conclusion.value??''))}" placeholder="Short">`)
      +(rule.then.length>1?`<button class="button small danger" data-rule="${r}" data-then="${t}" data-part="drop-then">Remove</button>`:'')
      +`</div>`;
    const ruleCard=(rule:Authored['rules'][number],r:number)=>`<section class="rule-card"><header><h3>Rule ${r+1}`
      +`${evaluation?` · ${evaluation.matchedByRule[r]!.toLocaleString('en')} record${evaluation.matchedByRule[r]===1?'':'s'}`:''}</h3>`
      +`<button class="button small" data-rule="${r}" data-part="drop-rule">Remove rule</button></header>`
      +rule.any.map((group,g)=>(g?`<div class="rule-block rule-block-or"><span class="rule-word rule-word-or">or</span></div>`:'')
        +`<div class="rule-block rule-block-if">`
        +`<span class="rule-word rule-word-if">${group.all.length?'if':'for every record'}</span>`
        +group.all.map((condition,c)=>conditionRow(r,g,c,condition)).join('')
        +`<button class="button small" data-rule="${r}" data-group="${g}" data-part="add-condition">+ and</button>`
        +(rule.any.length>1?`<button class="button small" data-rule="${r}" data-group="${g}" data-part="drop-group">Remove alternative</button>`:'')
        +`</div>`).join('')
      +`<button class="button small" data-rule="${r}" data-part="add-group">+ or</button>`
      +`<div class="rule-block rule-block-then"><span class="rule-word rule-word-then">then</span>`
      +rule.then.map((conclusion,t)=>conclusionRow(r,t,conclusion,rule)).join('')
      +`<button class="button small" data-rule="${r}" data-part="add-then">+ and conclude</button></div>`
      +`</section>`;

    // OTHERWISE, one per column (experiment 192): the value a record takes where no rule gave the column one.
    const concludedColumns=()=>[...new Set(rules.flatMap(r=>r.then.filter(c=>!isComputed(c)).map(c=>c.predicate)))];
    const otherwiseMarkup=()=>`<section class="rule-otherwise-list">`
      +otherwise.map((o,i)=>`<div class="rule-block rule-block-otherwise" data-otherwise-block="${i}">`
        +`<span class="rule-word rule-word-otherwise">otherwise</span>`
        +`<div class="rule-condition"><select data-otherwise="${i}" data-otherwise-part="column" aria-label="Column the otherwise gives a value to">`
        +[...new Set([...concludedColumns(),o.predicate].filter(Boolean))].map(c=>`<option value="${esc(c)}" ${c===o.predicate?'selected':''}>${esc(localName(c))}</option>`).join('')
        +`</select><span class="rule-is">is</span>`
        +`<input data-otherwise="${i}" data-otherwise-part="value" aria-label="Value where no rule gave one" value="${esc(localName(o.value).replace(/_/g,' '))}" placeholder="Cannot be classified">`
        +`<button class="button small danger" data-otherwise="${i}" data-part="drop-otherwise" aria-label="Remove this otherwise">Remove</button>`
        +(evaluation?.defaultedByColumn?.[localName(o.predicate)]!==undefined
          ?`<span class="rule-block-count">${evaluation.defaultedByColumn[localName(o.predicate)]!.toLocaleString('en')} record${evaluation.defaultedByColumn[localName(o.predicate)]===1?'':'s'}</span>`:'')
        +`</div></div>`).join('')
      +(review?'':`<button class="button" id="rule-editor-add-otherwise" data-editor-add ${concludedColumns().length>otherwise.length?'':'disabled'}>+ Add an otherwise</button>`)
      +`</section>`;

    const sectionsOf=():ConfigSections=>{
      choices=withConcluded();
      const count=compiledRuleCount({subject:'?s',rules:rules as never});
      let problem='';
      // RULES EVALUATED DIRECTLY, because a value is computed or a column has an otherwise (experiments 188 and 192), are
      // checked for what direct evaluation needs; the rest are compiled, as the reasoner reads them.
      const defaults=otherwiseProblems({rules:rules as never,otherwise},localName);
      problem=settingProblem();
      if(problem){/* said first: a rule cannot be checked against a setting with no value */}
      else if(defaults.length)problem=defaults[0]!;
      else if(computesValues({rules:rules as never}))problem=computedProblem();
      else if(!otherwise.length){
        try{compileAuthoredRuleset({subject:'?s',rules:rules as never});}
        catch(error){problem=error instanceof Error?error.message:String(error);}
      }
      evaluation=evaluate();
      if(!problem&&options?.preview?.records.length&&!evaluation&&evaluatedDirectly({rules:rules as never,otherwise})){
        try{evaluateAuthored(options.preview.records,fields as never,rules as never,numericSettings,order,otherwise);}
        catch(error){problem=error instanceof Error?error.message:String(error);}
      }
      if(!problem){
        // Not while reviewing a published ruleset: its rules passed the build's own check before they shipped.
        const units=review?[]:authoredUnitProblems({...authored,fields,parameters:settings,rules:rules as never});
        if(units.length)problem=units[0].says;
        // WHAT ARRIVES, the same check the JSON view and the run make: a declared column the input does not carry.
        else if(!review&&options?.arriving){const a=arrivingProblems(fields,options.arriving);if(a.length)problem=a[0]!.says;}
      }
      const switcher=`<div class="rule-view-switch" role="group" aria-label="How the rules are shown">`
        +(['rules','json'] as const).map(v=>`<button type="button" class="button${view===v?' primary':''}" data-rule-view="${v}" aria-pressed="${view===v}">${v==='rules'?'Rules':'JSON'}</button>`).join('')
        +`<button type="button" class="button" id="rule-json-download">Download (JSON)</button>`
        +(review?'':`<label class="button" for="rule-json-upload">Upload (JSON)</label><input type="file" id="rule-json-upload" accept=".json,application/json" hidden>`)
        // STARTING POINTS: a small ruleset that runs as loaded, on this step's columns where it has the kind each needs.
        +(review?'':`<select id="rule-json-template" aria-label="Start from a template"><option value="">Start from a template…</option>`
          +RULESET_TEMPLATES.map(t=>`<option value="${t.id}">${esc(t.label)}</option>`).join('')+'</select>')+'</div>';
      if(view==='json'){
        const text=jsonText??rulesetText(currentFile()),lines=text.split('\n'),bad=new Set(jsonProblems.map(p=>p.line));
        const gutter=lines.map((_,k)=>bad.has(k+1)?`<span class="json-bad">⚠ ${k+1}</span>`:String(k+1)).join('\n');
        const said=jsonProblems.length
          ?`<p><strong>${jsonProblems.length} problem${jsonProblems.length===1?'':'s'}.</strong> The rules stay as they were last valid until ${jsonProblems.length===1?'it is':'they are'} fixed.</p><ul class="json-problems">`
            +jsonProblems.map(p=>`<li><button type="button" class="text-button" data-json-line="${p.line}">⚠ Line ${p.line}${p.column?`, column ${p.column}`:''}:</button> ${esc(p.says)}</li>`).join('')+'</ul>'
          :'<p class="json-ok">✓ Valid: these are the rules the Rules view shows.</p>';
        return {settings:`<p class="rule-title"><strong>${esc(authored.title)}</strong></p>${switcher}`
          +`<label class="json-colour-toggle"><input type="checkbox" id="rule-json-colour" data-keep-enabled${colour?' checked':''}> Colours</label>`
          +`<div class="json-editor${colour?' json-coloured':''}"><pre class="json-gutter" aria-hidden="true">${gutter}</pre><div class="json-stack">`
          +(colour?`<div class="json-colour" aria-hidden="true">${highlightJson(text,bad)}</div>`:'')
          +`<textarea id="rule-json" spellcheck="false" autocomplete="off" wrap="off" aria-label="The ruleset as JSON" aria-describedby="rule-json-problems"${review?' readonly data-keep-enabled':''}>${esc(text)}</textarea></div></div>`
          +`<div id="rule-json-problems" aria-live="polite">${said}</div>`+arrivingPanel(),
          preview:previewMarkup(),...(jsonProblems.length?{message:{tone:'refusal' as const,text:`Line ${jsonProblems[0]!.line}: ${jsonProblems[0]!.says}`},blocked:true}:{})};
      }
      const settingsHtml=`<p class="rule-title"><strong>${esc(authored.title)}</strong></p>`+switcher
        +(jsonProblems.length?`<div class="notice notice-warning">The JSON has ${jsonProblems.length} problem${jsonProblems.length===1?'':'s'}: these are the rules as they were last valid.</div>`:'')
        +(review?`<div class="notice">${esc(review.note)}</div>`:'')
        +(review?'':fieldsMarkup())
        +(review&&!settings.length?'':settingsMarkup())
        +(review&&!order?'':orderMarkup())
        +`<p class="description">Rules that disagree must not both match a record.</p>`
        +rules.map((rule,r)=>ruleCard(rule,r)).join('')
        +(review?'':`<div class="rule-editor-adds"><button class="button" id="rule-editor-add" data-editor-add>+ Add a rule</button>`
          +`<button class="button" id="rule-editor-add-every" data-editor-add>+ Add a value computed for every record</button></div>`
          +bandsMarkup()+targetMarkup())
        +otherwiseMarkup()
        +(evaluatedDirectly({rules:rules as never,otherwise})
          ?`<p class="muted">${rules.length} rule${rules.length===1?'':'s'}.</p>`
          :`<p class="muted">${count} of ${RULE_CEILING} rules once compiled.</p>`);
      // DECISIONS: what the rules left for the person, named, not settled by the order of the rules.
      const conflicts=evaluation?evaluation.records.flatMap((o,i)=>o.conflicts.length?[i]:[]):[];
      const labelOf=(i:number)=>options?.preview?.records[i]?.label??`Record ${i+1}`;
      const decisions=conflicts.length
        ?`<p>${conflicts.length.toLocaleString('en')} record${conflicts.length===1?' has':'s have'} no value where two rules disagree: `
          +conflicts.slice(0,8).map(i=>`<strong>${esc(labelOf(i))}</strong>`).join(', ')+(conflicts.length>8?` and ${conflicts.length-8} more`:'')
          +'. Change a rule so only one matches them.</p>':undefined;
      return {settings:settingsHtml,preview:previewMarkup(),...(decisions?{decisions}:{}),
        ...(problem?{message:{tone:'refusal' as const,text:problem},blocked:true}:{})};
    };

    /** ARRIVING COLUMNS beside the JSON: each with its kind and a few values, marked ✓ where the ruleset declares it; the
     *  declared ones that do not arrive marked ⚠. Add to fields puts in an entry spelled as the column is. */
    function arrivingPanel():string{
      const a=options?.arriving;
      if(!a)return '<p class="muted json-arriving">Nothing is connected yet: connect the records to see their columns here.</p>';
      const declared=new Set(fields.map(f=>f.attribute));
      const kindWord=(k:string)=>k==='number'?'number':k==='term'?'text':k;
      const missing=fields.filter(f=>!a.columns.some(c=>c.attribute===f.attribute));
      return `<details class="json-arriving" open><summary>Arriving columns · ${a.columns.length} from ${esc(a.source)}</summary><ul>`
        +a.columns.map(c=>`<li><code>${esc(c.attribute)}</code> <span class="muted">${kindWord(c.kind)}${c.samples?.length?`: ${c.samples.map(v=>`“${esc(v)}”`).join(', ')}`:''}</span> `
          +(declared.has(c.attribute)?'<span class="json-declared">✓ declared</span>'
            :review?'':`<button type="button" class="button small" data-json-add="${esc(c.attribute)}">Add to fields</button>`)+'</li>').join('')
        +'</ul>'+(missing.length?`<p class="json-missing">⚠ Declared but not arriving: ${missing.map(f=>`<code>${esc(f.attribute)}</code>`).join(', ')}</p>`:'')+'</details>';
    }
    const number=(el:HTMLElement,name:string)=>Number(el.dataset[name]);
    function currentFile():RulesetFile{return {title:authored.title,mustNotBeReadAs:authored.mustNotBeReadAs,fields,parameters:settings,
      rules:rules as unknown[],...(order?{order}:{}),otherwise};}
    // Redraws the frame from the state above; set once the frame is open.
    let render=()=>{};
    const wire=(root:HTMLElement)=>{
      root.querySelectorAll<HTMLButtonElement>('[data-rule-view]').forEach(b=>b.onclick=()=>{
        view=b.dataset.ruleView==='json'?'json':'rules';if(view==='json'&&!jsonProblems.length)jsonText=undefined;render();});
      root.querySelector<HTMLButtonElement>('#rule-json-download')?.addEventListener('click',()=>{
        const text=view==='json'&&jsonText!==undefined?jsonText:rulesetText(currentFile());
        const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');
        a.href=url;a.download=`${(authored.title||'ruleset').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'ruleset'}.ruleset.json`;
        a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
      // CHECKED AS TYPED: a pause, then the whole text read and checked; valid, it is the rules.
      const takeJson=(text:string)=>{jsonText=text;const {ruleset,problems}=checkRulesetJson(text,options?.arriving);jsonProblems=problems;
        if(ruleset&&!review){rules=ruleset.rules as never;fields=ruleset.fields as Field[];choices=readable(fields);
          settings=(ruleset.parameters??[]) as never;order=ruleset.order as never;otherwise=(ruleset.otherwise??[]) as never;}
        render();};
      root.querySelector<HTMLSelectElement>('#rule-json-template')?.addEventListener('change',e=>{
        const id=(e.target as HTMLSelectElement).value as TemplateId;if(!id)return;
        // The columns this ruleset declares first, then the connected records' others, each kind as declared.
        const known=[...fields,...(options?.candidates??[]).filter(c=>!fields.some(f=>f.predicate===c.predicate))];
        view='json';takeJson(rulesetText(rulesetTemplate(id,known as never)));});
      root.querySelectorAll<HTMLButtonElement>('[data-json-add]').forEach(b=>b.onclick=()=>{
        const c=options?.arriving?.columns.find(x=>x.attribute===b.dataset.jsonAdd);if(!c)return;
        const entry={attribute:c.attribute,predicate:`fwa:${c.attribute.replace(/[^A-Za-z0-9_]+/g,'_')}`,kind:c.kind==='number'?'number':'term'};
        const area=root.querySelector<HTMLTextAreaElement>('#rule-json'),text=area?.value??jsonText??rulesetText(currentFile());
        const parsed=parseJson(text);
        // VALID: the entry goes into fields and the text is written afresh; NOT YET: it is put in at the cursor, as typed.
        if(!parsed.error&&parsed.value&&typeof parsed.value==='object'&&Array.isArray((parsed.value as {fields?:unknown}).fields)){
          const v=parsed.value as RulesetFile;v.fields=[...v.fields,entry];takeJson(rulesetText(v));return;}
        if(area){const at=area.selectionStart,piece=`${JSON.stringify(entry)},`;
          area.setRangeText(piece,at,area.selectionEnd,'end');takeJson(area.value);}
      });
      root.querySelector<HTMLInputElement>('#rule-json-upload')?.addEventListener('change',async e=>{
        const file=(e.target as HTMLInputElement).files?.[0];if(!file)return;view='json';takeJson(await file.text());});
      const area=root.querySelector<HTMLTextAreaElement>('#rule-json'),gutter=root.querySelector<HTMLElement>('.json-gutter');
      if(area){
        const layer=root.querySelector<HTMLElement>('.json-colour');
        const follow=()=>{if(gutter)gutter.scrollTop=area.scrollTop;if(layer){layer.scrollTop=area.scrollTop;layer.scrollLeft=area.scrollLeft;}};
        area.scrollTop=jsonScroll;follow();
        area.addEventListener('scroll',()=>{jsonScroll=area.scrollTop;follow();});
        // RECOLOURED ON EVERY KEY, checked after a pause: the colours follow the typing, the problems the text.
        const recolour=()=>{if(layer){layer.innerHTML=highlightJson(area.value,new Set(jsonProblems.map(p=>p.line)));follow();}};
        area.addEventListener('input',recolour);
        root.querySelector<HTMLInputElement>('#rule-json-colour')?.addEventListener('change',e=>{
          colour=(e.target as HTMLInputElement).checked;try{localStorage.setItem('fieldwork-json-colour',colour?'on':'off');}catch{/* kept for this dialog only */}
          jsonText=area.value;render();});
        let pause:ReturnType<typeof setTimeout>|undefined;
        const typed=()=>{clearTimeout(pause);pause=setTimeout(()=>takeJson(area.value),400);};
        area.addEventListener('input',typed);
        area.addEventListener('keydown',e=>{
          if(review||e.metaKey||e.ctrlKey||e.altKey)return;
          const done=autoBracket(area.value,area.selectionStart,area.selectionEnd,e.key);
          if(!done)return;e.preventDefault();
          area.value=done.text;area.setSelectionRange(done.caret,done.caretEnd??done.caret);recolour();typed();});
        root.querySelectorAll<HTMLButtonElement>('[data-json-line]').forEach(b=>b.onclick=()=>{
          const line=Number(b.dataset.jsonLine),at=area.value.split('\n').slice(0,line-1).reduce((n,l)=>n+l.length+1,0);
          area.focus();area.setSelectionRange(at,at);
          area.scrollTop=Math.max(0,(line-3)*parseFloat(getComputedStyle(area).lineHeight||'24'));});
      }
      // THE JSON VIEW draws none of the Rules view's controls, so none is wired.
      if(view==='json')return;
      // A PUBLISHED RULESET is read, not written: the frame disables every control (readOnly).
      if(review)return;
      root.querySelector<HTMLSelectElement>('#ruleset-records')?.addEventListener('change',e=>{
        recordsKind=(e.target as HTMLSelectElement).value as typeof recordsKind;render();});
      root.querySelector<HTMLButtonElement>('#use-columns')?.addEventListener('click',()=>{
        fields=structuredClone(options?.candidates??[]);render();});
      root.querySelectorAll<HTMLSelectElement>('[data-field-kind]').forEach(el=>el.addEventListener('change',()=>{
        const field=fields[Number(el.dataset.fieldKind)]!;field.kind=el.value as Field['kind'];
        if(field.kind!=='number'){delete field.unit;delete field.unitLabel;}render();}));
      root.querySelectorAll<HTMLInputElement>('[data-field-unit]').forEach(el=>el.addEventListener('change',()=>{
        const field=fields[Number(el.dataset.fieldUnit)]!,typed=el.value.trim();
        if(typed)field.unitLabel=typed;else delete field.unitLabel;
        const iri=typed?options?.unitIri?.(typed):undefined;if(iri)field.unit=iri;else delete field.unit;render();}));
      // OTHERWISE (experiment 192): a column and its default; the first column no otherwise covers is offered.
      root.querySelector<HTMLButtonElement>('#rule-editor-add-otherwise')?.addEventListener('click',()=>{
        const free=concludedColumns().find(c=>!otherwise.some(o=>o.predicate===c));
        if(free){otherwise=[...otherwise,{predicate:free,value:'fwa:None'}];render();}});
      root.querySelectorAll<HTMLElement>('[data-otherwise]').forEach(el=>{
        const i=Number(el.dataset.otherwise),o=otherwise[i]!;
        if(el.dataset.part==='drop-otherwise'){(el as HTMLButtonElement).onclick=()=>{otherwise=otherwise.filter((_,j)=>j!==i);render();};return;}
        el.addEventListener('change',()=>{const value=(el as HTMLInputElement).value;
          if(el.dataset.otherwisePart==='column')o.predicate=value;
          if(el.dataset.otherwisePart==='value')o.value=`fwa:${value.trim().replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'None'}`;
          render();});
      });
      root.querySelector<HTMLButtonElement>('#rule-editor-add-setting')!.onclick=()=>{
        let k=settings.length+1;while(settings.some(s=>s.name===`setting${k}`))k++;
        settings=[...settings,{name:`setting${k}`,meaning:''}];render();};
      root.querySelectorAll<HTMLInputElement|HTMLButtonElement>('[data-setting]').forEach(el=>{
        const i=Number(el.dataset.setting),part=el.dataset.settingPart,setting=settings[i]!;
        if(part==='drop'){(el as HTMLButtonElement).onclick=()=>{settings=settings.filter((_,j)=>j!==i);delete values[setting.name];render();};return;}
        el.addEventListener('change',()=>{
          const typed=(el as HTMLInputElement).value.trim();
          if(part==='name'&&typed!==setting.name){
            // Every rule comparing against the old name compares against the new one.
            const was=setting.name;
            for(const rule of rules)for(const g of rule.any)for(const c of g.all)
              if(typeof c.value==='object'&&c.value&&'setting' in c.value&&c.value.setting===was)c.value={setting:typed};
            if(was in values){values[typed]=values[was]!;delete values[was];}
            setting.name=typed;
          }
          if(part==='value'){if(typed===''||!Number.isFinite(Number(typed)))delete values[setting.name];else values[setting.name]=Number(typed);}
          if(part==='unit'){setting.unitLabel=typed||undefined;const iri=typed?options?.unitIri?.(typed):undefined;
            if(iri)setting.unit=iri;else delete setting.unit;}
          render();});
      });
      root.querySelectorAll<HTMLSelectElement>('[data-order]').forEach(el=>el.addEventListener('change',()=>{
        if(el.dataset.order==='by'){
          if(!el.value)order=undefined;
          else{
            // A DATE COLUMN, sorted within the columns that say whose rows these are: every other term column, offered
            // ticked, so a long table by place and week sorts by week within place. Each can be unticked.
            const terms=fields.filter(f=>f.kind==='term').map(f=>f.attribute);
            order={by:el.value,within:order?.within.filter(c=>c!==el.value)
              ??sortColumns().map(c=>c.column).filter(c=>c!==el.value&&(terms.includes(c)||!fields.some(f=>f.attribute===c))&&!sortColumns().find(x=>x.column===c)?.date),
              previous:order?.previous??'row'};
          }
        }else if(order)order.previous=el.value as AuthoredOrder['previous'];
        render();}));
      root.querySelectorAll<HTMLInputElement>('[data-order-within]').forEach(el=>el.addEventListener('change',()=>{
        if(!order)return;const column=el.dataset.orderWithin!;
        order.within=el.checked?[...order.within.filter(c=>c!==column),column]:order.within.filter(c=>c!==column);render();}));
      root.querySelector<HTMLButtonElement>('#rule-editor-add-every')!.onclick=()=>{
        const first=choices.find(c=>c.kind==='number')?.predicate;
        rules=[...rules,{any:[{all:[]}],then:[{predicate:`fwa:computed_${rules.length+1}`,column:'',
          compute:{left:first?{field:first}:0,operator:'minus',right:first?{field:first}:0}}]} as never];
        render();
      };
      // MAKE BANDS: the rules written from a start and cut points, added to the rules already here.
      const bandsBox=root.querySelector<HTMLDetailsElement>('#rule-editor-bands');
      bandsBox?.addEventListener('toggle',()=>{bands.open=bandsBox.open;});
      const bandsField=root.querySelector<HTMLSelectElement>('#bands-field'),bandsStart=root.querySelector<HTMLInputElement>('#bands-start');
      const bandsCuts=root.querySelector<HTMLInputElement>('#bands-cuts'),bandsColumn=root.querySelector<HTMLInputElement>('#bands-column');
      const bandsSaid=root.querySelector<HTMLElement>('#bands-preview');
      const readBands=()=>{bands.field=bandsField?.value??bands.field;bands.start=bandsStart?.value??bands.start;
        bands.cuts=bandsCuts?.value??bands.cuts;bands.column=bandsColumn?.value??bands.column;
        const cuts=bands.cuts.split(/[,;\s]+/).filter(Boolean).map(Number);
        return bandRules(bands.field,Number(bands.start),cuts,bands.column);};
      const sayBands=()=>{if(!bandsSaid)return;try{bandsSaid.textContent=`${readBands().labels.join(' · ')}`;bandsSaid.classList.remove('rule-editor-bands-wrong');}
        catch(e){bandsSaid.textContent=e instanceof Error?e.message:String(e);bandsSaid.classList.add('rule-editor-bands-wrong');}};
      [bandsField,bandsStart,bandsCuts,bandsColumn].forEach(el=>el?.addEventListener('input',sayBands));
      if(bandsCuts?.value)sayBands();
      root.querySelector<HTMLButtonElement>('#bands-add')?.addEventListener('click',()=>{
        let made;try{made=readBands();}catch{sayBands();return;}
        rules=[...rules,...made.rules];bands.open=false;bands.cuts='';render();});
      // COMPARE WITH A TARGET: the days, the target as a setting, Met and Not met, and No verdict where a value is missing.
      const targetBox=root.querySelector<HTMLDetailsElement>('#rule-editor-target');
      targetBox?.addEventListener('toggle',()=>{target.open=targetBox.open;});
      const targetIds:[string,keyof typeof target][]=[['target-earlier','earlier'],['target-later','later'],['target-days','days'],
        ['target-value','target'],['target-setting','setting'],['target-verdict','verdict']];
      const readTarget=()=>{for(const [id,key] of targetIds){const el=root.querySelector<HTMLInputElement>(`#${id}`);if(el)(target as Record<string,unknown>)[key]=el.value;}
        return targetRules({later:target.later,earlier:target.earlier,days:target.days,target:Number(target.target),setting:target.setting,verdict:target.verdict});};
      const targetSaid=root.querySelector<HTMLElement>('#target-preview');
      const sayTarget=()=>{if(!targetSaid)return;try{const m=readTarget();
          const labelOf=(p:string)=>choices.find(c=>c.predicate===p)?.label??shownName(p);
          targetSaid.textContent=`${target.days} is ${labelOf(target.later)} minus ${labelOf(target.earlier)}; ${target.verdict} is Met at ${m.value} ${m.setting.unitLabel} or fewer, Not met above, No verdict where either is missing.`;
          targetSaid.classList.remove('rule-editor-bands-wrong');}
        catch(e){targetSaid.textContent=e instanceof Error?e.message:String(e);targetSaid.classList.add('rule-editor-bands-wrong');}};
      targetIds.forEach(([id])=>root.querySelector(`#${id}`)?.addEventListener('input',sayTarget));
      targetIds.forEach(([id])=>root.querySelector(`#${id}`)?.addEventListener('change',sayTarget));
      if(target.open)sayTarget();
      root.querySelector<HTMLButtonElement>('#target-add')?.addEventListener('click',()=>{
        let made;try{made=readTarget();}catch{sayTarget();return;}
        rules=[...rules,...made.rules];
        otherwise=[...otherwise.filter(x=>x.predicate!==made.otherwise[0]!.predicate),...made.otherwise];
        settings=[...settings.filter(x=>x.name!==made.setting.name),made.setting as never];values[made.setting.name]=made.value;
        target.open=false;render();});
      root.querySelector<HTMLButtonElement>('#rule-editor-add')!.onclick=()=>{
        rules=[...rules,{any:[{all:[blankCondition(fields)]}],then:[{predicate:'fwa:decision',value:'fwa:Review'}]}];
        render();
      };
      root.querySelectorAll<HTMLElement>('[data-part]:not([data-otherwise])').forEach(el=>{
        const part=el.dataset.part!,r=number(el,'rule');
        if(el instanceof HTMLButtonElement){
          el.onclick=()=>{
            const g=number(el,'group'),c=number(el,'condition'),t=number(el,'then');
            if(part==='drop-rule')rules=rules.filter((_,i)=>i!==r);
            if(part==='add-group')rules[r].any=[...rules[r].any,{all:[blankCondition(fields)]}];
            if(part==='drop-group')rules[r].any=rules[r].any.filter((_,i)=>i!==g);
            if(part==='add-condition')rules[r].any[g].all=[...rules[r].any[g].all,blankCondition(fields)];
            if(part==='drop-condition'){
              rules[r].any[g].all=rules[r].any[g].all.filter((_,i)=>i!==c);
              // A group with no conditions would match everything, which is never what the person
              // deleting the last one meant. The alternative goes with it.
              // A rule that computes a value can apply to every record, so its last condition leaves it doing that.
              if(!rules[r].any[g].all.length&&!rules[r].then.some(isComputed))rules[r].any=rules[r].any.filter((_,i)=>i!==g);
              if(!rules[r].any.length)rules=rules.filter((_,i)=>i!==r);
            }
            if(part==='add-then')rules[r].then=[...rules[r].then,{predicate:'fwa:reason',value:'fwa:Stated'}];
            if(part==='drop-then')rules[r].then=rules[r].then.filter((_,i)=>i!==t);
            render();
          };
          return;
        }
        el.addEventListener('change',()=>{
          const value=(el as HTMLInputElement|HTMLSelectElement).value;
          const g=number(el,'group'),c=number(el,'condition'),t=number(el,'then');
          const condition=rules[r]?.any?.[g]?.all?.[c];
          if(part==='field'&&condition){
            // A condition about presence stays about presence when the field changes: the
            // practitioner picked a different column, not a different question.
            condition.field=asksPresence(condition.field,fields)?`${value}Known`:value;
            if(asksPresence(condition.field,fields))return render();
            // The comparators that fit the new field. A term that kept `is more than` would
            // compile to a builtin matching nothing, so the choice is corrected rather than
            // carried over.
            const allowed=COMPARATORS[kindOf(value)].map(x=>x.value);
            if(!allowed.includes(condition.comparator))condition.comparator=allowed[0];
            if(kindOf(value)==='boolean'&&typeof condition.value!=='boolean')condition.value=true;
          }
          if(part==='comparator'&&condition){
            const base=baseFieldOf(condition.field,fields);
            if(value===RECORDED||value===NOT_RECORDED){
              // Stored exactly as it always was, so nothing downstream can tell the difference.
              condition.field=`${base}Known`;
              condition.comparator='equals';
              condition.value=value===RECORDED;
            }else{
              const wasPresence=asksPresence(condition.field,fields);
              condition.field=base;
              const fromWords=isWordComparator(condition.comparator);
              condition.comparator=value;
              if(wasPresence)condition.value=kindOf(base)==='boolean'?true:kindOf(base)==='number'?0:'';
              // A TERM BECOMES WORDS and words a term, as the condition changes between them: fwa:N_V is "n v".
              else if(isWordComparator(value)&&!fromWords&&typeof condition.value==='string')
                condition.value=condition.value.replace(/^fwa:/,'').replace(/_/g,' ');
              else if(!isWordComparator(value)&&fromWords&&kindOf(base)==='term'&&typeof condition.value==='string')
                condition.value=condition.value.trim()?`fwa:${condition.value.split(',')[0]!.trim().replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'None'}`:'';
            }
          }
          // A CATEGORY IS A TERM, as the record's value becomes one (`termFor`): "Hillside" is fwa:Hillside. Stored as
          // typed, it was a quoted string no record's term could equal, so a condition on a category never held, for the
          // reasoner or for direct evaluation. Found 2026-11-08, building the rules worked example.
          if(part==='value'&&condition)
            condition.value=kindOf(condition.field)==='boolean'?value==='true'
              :kindOf(condition.field)==='number'&&value.trim()&&!value.includes('{{')?Number(value)
              // WORDS STAY AS TYPED (2026-11-21): "n/v, vomit" is looked for in the text, not made a term.
              :isWordComparator(condition.comparator)?value
              :kindOf(condition.field)==='term'&&value.trim()&&!value.includes('{{')
                ?`fwa:${value.trim().replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'None'}`
              :value;
          // Switching between a typed number and a setting. Leaving a setting leaves a number
          // behind rather than an empty box, so the rule the dialog holds stays one the compiler
          // accepts at every keystroke -- the ceiling and the unit check run on every edit.
          if(part==='value-source'&&condition)condition.value=value?{setting:value}:0;
          // A practitioner writes `band`, not `fwa:band`: the namespace is the application's
          // business and is added here rather than asked for.
          const prefixed=(raw:string)=>raw.trim().startsWith('fwa:')?raw.trim():`fwa:${raw.trim().replace(/[^A-Za-z0-9_]+/g,'_')}`;
          const conclusion=rules[r]?.then?.[t];
          if(part==='then-kind'&&conclusion){
            if(value==='computed'){
              const first=choices.find(c=>c.kind==='number')?.predicate;
              rules[r].then[t]={predicate:conclusion.predicate,column:localName(conclusion.predicate),
                compute:{left:first?{field:first}:0,operator:'minus',right:first?{field:first}:0}} as never;
            }else if(value==='datetime'){
              const first=fields[0]?.predicate??'';
              rules[r].then[t]={predicate:conclusion.predicate.startsWith('fwa:c_')?conclusion.predicate:`fwa:c_${localName(conclusion.predicate)}`,
                column:localName(conclusion.predicate),datetime:{date:first,form:'month/day'}} as never;
            }else rules[r].then[t]={predicate:conclusion.predicate,value:'fwa:Stated'};
          }
          if(conclusion&&isWrittenDateTime(conclusion)){
            const d=conclusion.datetime;
            if(part==='column'){const was=conclusion.predicate,now=`fwa:c_${value.trim().replace(/[^A-Za-z0-9]+/g,'_')||'value'}`;
              conclusion.column=value.trim();conclusion.predicate=now;
              for(const rule of rules)for(const c of rule.then)if(isComputed(c))for(const side of ['left','right'] as const){
                const o=c.compute[side];if(typeof o==='object'&&'field' in o&&o.field===was)c.compute[side]={field:now};}}
            if(part==='dt-date'){if(value){d.date=value;delete d.on;}else d.on=d.on??'';}
            if(part==='dt-on')d.on=value.trim();
            if(part==='dt-form'){d.form=value as import('./authored-application.js').DateForm;if(d.form.endsWith('year')||d.form==='year-month-day')delete d.year;}
            if(part==='dt-year-source')d.year=value?{setting:value}:undefined;
            if(part==='dt-year'){const y=Number(value);if(value.trim()&&Number.isInteger(y))d.year=y;else delete d.year;}
            if(part==='dt-time'){if(value){d.time=value;d.clock??='12-hour';}else{delete d.time;delete d.clock;}}
            if(part==='dt-clock')d.clock=value as never;
          }
          if(conclusion&&isComputed(conclusion)){
            if(part==='column'){
              // The predicate follows the name, and every rule reading the old one reads the new.
              const was=conclusion.predicate,now=`fwa:c_${value.trim().replace(/[^A-Za-z0-9]+/g,'_')||'value'}`;
              conclusion.column=value.trim();conclusion.predicate=now;
              for(const rule of rules)for(const c of rule.then)if(isComputed(c))for(const side of ['left','right'] as const){
                const o=c.compute[side];if(typeof o==='object'&&'field' in o&&o.field===was)c.compute[side]=readsPrevious(o)?{field:now,previous:true}:{field:now};}
            }
            if(part==='operator')conclusion.compute.operator=value as never;
            if(part==='per'){if(value)conclusion.compute.per=value as never;else delete conclusion.compute.per;}
            if(part==='unit'){if(value.trim())conclusion.unit=value.trim();else delete conclusion.unit;}
            if(part==='meaning'){if(value.trim())conclusion.meaning=value.trim();else delete conclusion.meaning;}
            for(const side of ['left','right'] as const){
              if(part===`${side}-source`)conclusion.compute[side]=!value?0
                :value.startsWith('previous:')?{field:value.slice('previous:'.length),previous:true}:{field:value};
              if(part===`${side}-number`)conclusion.compute[side]=value.trim()===''?0:Number(value);
            }
          }
          if(part==='predicate'&&rules[r]?.then?.[t])rules[r].then[t].predicate=prefixed(value);
          if(part==='conclusion'&&rules[r]?.then?.[t])rules[r].then[t].value=prefixed(value);
          render();
        });
      });
    };

    // THE STANDARD FRAME (experiment 186): heading, ×, the message slot, Cancel and Apply. The state above is the draft,
    // so Cancel leaves the step as it was and asks first when anything changed.
    let redrawFrame=()=>{};
    const state=()=>({rules,order,settings,values,otherwise,fields,recordsKind});
    let draftRef:ReturnType<typeof state>|undefined;
    render=()=>{if(draftRef)Object.assign(draftRef,structuredClone(state()));redrawFrame();};
    openConfigDialog({
      id:'rule-editor',widget:'Apply ruleset',step:options?.step??authored.title,draft:state(),readOnly:!!review,wide:true,
      sections:draft=>{draftRef=draft;return sectionsOf();},
      wire:(root,draft,redraw)=>{draftRef=draft;redrawFrame=redraw;wire(root);},
      apply:()=>resolve({rules,...(order?.by?{order}:{}),parameters:settings,values,otherwise,fields,
        ...(recordsKind?{recordsKind}:{})}),
      onClose:()=>resolve(undefined),
    },esc);
  });
}
