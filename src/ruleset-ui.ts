/** APPLY RULESET, ITS INSPECTOR AND ITS DIALOGS (moved out of app.ts on 2026-11-26, when the step was touched for NSSP's
 *  syndrome definitions: the practitioner's rule that a widget touched leaves app.ts in the same pass).
 *
 *  The standard Inspector (experiments 186 and 192): name, inputs, one sentence of what the step applies, Configure…, the
 *  rules shown as blocks, and what the last run did. Rules written on the step open in the rule editor; a published
 *  ruleset is chosen in a dialog of its own. Nothing here changed in what it does: the text is as it stood in app.ts,
 *  reading the application through the kit. */
import {escapeHtml as esc} from './html-escape.js';
import type {OwnInspector,StepKit} from './inspector-kit.js';
import type {Workflow,WorkflowNode,NodeType} from './types.js';
import {resolveRuleset,bundledRulesets,supersession,publishedRuleset,WRITTEN_IN_WORKFLOW} from './rulesets.js';
import type {Ruleset} from './rulesets.js';
import {pinnedRuleset} from './rule-application.js';
import {settingNamed,isWordComparator} from './authored-rules.js';
import {orderSentence} from './rule-evaluation.js';
import {openRuleEditor,beforeAndAfter,computedColumnsOf} from './rule-editor.js';
import {publishedAsAuthored} from './run-ruleset.js';
import {evaluateAuthored} from './rule-evaluation.js';
import {authoredUnitProblems} from './authored-rules.js';
import {openConfigDialog} from './config-dialog.js';
import {authoredSubjects} from './authored-application.js';

/** RULESET'S KIT: the step kit, with the columns the records arriving carry, as candidate bindings. */
export interface RulesetKit extends StepKit {
  candidateFields:(nodeId:string)=>{attribute:string;predicate:string;kind:'number'|'boolean'|'term';label?:string}[];
}

function getNode<K extends NodeType>(w:Workflow,id:string,type:K):WorkflowNode<K>{
  const node=w.nodes.find(n=>n.id===id);
  if(!node||node.type!==type)throw new Error(`Expected a ${type} step called ${id}.`);
  return node as WorkflowNode<K>;
}

/** The CURRENT version of each ruleset identity, not every bundled one. Older versions are
 *  carried so a saved workflow that pinned one still replays -- a rule change changes results,
 *  which is why the pin exists -- and offering them would let a practitioner start new work on a
 *  superseded rule. Seven bundled documents, four identities, four choices. */
/** Choosing a ruleset on the node: pin it, take its declared defaults, and name the step after
 *  what it does unless the practitioner has already named it themselves. The ports change with
 *  the ruleset, so whatever was wired to this node is disconnected -- the same bargain the output
 *  widgets make when their input mode changes, and Undo restores it. */
/** The rules of a step, drawn as rules rather than described in prose.
 *
 *  Written for a step carrying authored rules and reachable only from one, which meant the
 *  published ruleset a worked example applies could not be SEEN -- the Inspector gave its title,
 *  version, description, settings and obligations, and never what it actually decides. The
 *  practitioner, 2026-10-26: "how do we demonstrate the use of a ruleset widget when we cannot
 *  even provide the view of how it's used? Defeats the purpose of a worked example."
 *
 *  Every bundled ruleset already carries its rules in this shape -- the `authored` form they were
 *  built from, which is what makes them reproducible by hand -- so showing them needs no new data,
 *  only this renderer reached from both branches. */
/** A COMPARATOR'S FAMILY, keyed by colour and edge (experiment 192): a comparison of numbers, an equality, or whether a
 *  value was recorded. */
export const comparatorFamily=(c:string):'compare'|'equal'|'presence'=>
  c==='equals'||c==='notEquals'?'equal':c==='__recorded'||c==='__notRecorded'?'presence':'compare';
export type ShownRule={any:{all:{field:string;comparator:string;
  value:import('./authored-rules.js').AuthoredValue}[]}[];
  then:import('./authored-rules.js').AuthoredConclusion[]};
export function rulesList(rules:ShownRule[],
  fields:{attribute?:string;predicate:string}[],
  readable:(value:import('./authored-rules.js').AuthoredValue)=>string,
  esc:(text:string)=>string,
  otherwise:import('./authored-rules.js').AuthoredOtherwise[]=[]):string{
  const comparator=(c:string)=>({equals:'is',notEquals:'is not',greaterThan:'is more than',notGreaterThan:'is at most',
    lessThan:'is less than',notLessThan:'is at least',contains:'contains any of',notContains:'contains none of',
    startsWith:'has an item starting with any of',notStartsWith:'has no item starting with any of'}[c]??c);
  // The column, as the file spells it. Not a label somebody wrote over it: a reader checking
  // this rule against their data is looking for the column, and a rule that names something
  // the file does not contain makes them translate. 2026-10-16.
  const named=(predicate:string)=>{
    const field=fields.find(f=>f.predicate===predicate||`${f.predicate}Known`===predicate);
    return field?.attribute??predicate.slice(predicate.indexOf(':')+1);
  };
  const presenceOf=(predicate:string)=>fields.some(f=>`${f.predicate}Known`===predicate);
  return ''
    +`<div class="authored-rules">`
    +rules.map((rule,index)=>`<div class="authored-rule">`
      +`<span class="rule-number">${index+1}</span>`
      +rule.any.map((group,g)=>`<div class="rule-when rule-block ${g&&group.all.length?'rule-block-or':'rule-block-if'}">`
        +`<span class="rule-keyword">${group.all.length?(g?'OR':'IF'):'FOR EVERY RECORD'}</span><div class="rule-conditions">`
        +group.all.map((condition,c)=>`<div class="rule-row">`
          +(c?`<span class="rule-and">and</span>`:`<span class="rule-and"></span>`)
          +`<span class="rule-field">${esc(named(condition.field))}</span>`
          // A condition about whether a value was there reads as one phrase, with nothing
          // to compare against: "DEATHS is not recorded", not "whether DEATHS is recorded
          // is false", which is a double negative wrapped around a question.
          +(presenceOf(condition.field)
      ?`<span class="rule-op rule-op-presence">${condition.value===true?'is recorded':'is not recorded'}</span><span class="rule-value"></span>`
      :`<span class="rule-op rule-op-${comparatorFamily(condition.comparator)}">${esc(comparator(condition.comparator))}</span>`
       +`<span class="rule-value">${esc(readable(condition.value))}</span>`)
          +`</div>`).join('')
        +`</div></div>`).join('')
      +`<div class="rule-then rule-block rule-block-then"><span class="rule-keyword">THEN</span><div class="rule-conditions">`
      +rule.then.map((conclusion,t)=>`<div class="rule-row">`
        +(t?`<span class="rule-and">and</span>`:`<span class="rule-and"></span>`)
        // A DATE AND TIME reads as its parts (2026-11-15): "onset_at is Date of onset, month/day, 1940, at Time of onset, 12-hour".
        +(conclusion.datetime
          ?`<span class="rule-field">${esc(conclusion.column?.trim()||conclusion.predicate.slice(conclusion.predicate.indexOf(':')+1))}</span>`
            +`<span class="rule-op">is</span>`
            +`<span class="rule-value">${esc((conclusion.datetime.on!==undefined?conclusion.datetime.on
              :`${named(conclusion.datetime.date)}, ${conclusion.datetime.form}`+(conclusion.datetime.year!==undefined
                ?`, ${typeof conclusion.datetime.year==='number'?conclusion.datetime.year:conclusion.datetime.year.setting}`:''))
              +(conclusion.datetime.time?` at ${named(conclusion.datetime.time)}, ${conclusion.datetime.clock??''}`:''))}</span>`
        // A COMPUTED VALUE reads as its sum (experiment 188): "change 2005 to 2024 is dtp1_2024 minus dtp1_2005".
        :conclusion.compute
          ?`<span class="rule-field">${esc(conclusion.column?.trim()||conclusion.predicate.slice(conclusion.predicate.indexOf(':')+1))}</span>`
            +`<span class="rule-op">is</span>`
            +`<span class="rule-value">${esc([conclusion.compute.left,conclusion.compute.right].map(o=>typeof o==='object'&&'field' in o
              ?(rules.flatMap(r=>r.then).find(t=>t.predicate===o.field)?.column?.trim()||named(o.field))+((o as {previous?:true}).previous?' in the previous row':''):readable(o as never))
              .join(` ${({minus:'minus',plus:'plus',times:'times',dividedBy:'divided by'} as Record<string,string>)[conclusion.compute.operator]} `)
              +(conclusion.compute.per?`, in ${conclusion.compute.per}`:''))}</span>`
          :`<span class="rule-field">${esc(conclusion.predicate.slice(conclusion.predicate.indexOf(':')+1))}</span>`
            +`<span class="rule-op">is</span>`
            +`<span class="rule-value">${esc(readable(conclusion.value??''))}</span>`)
        +`</div>`).join('')
      +`</div></div></div>`).join('')
    // OTHERWISE (experiment 192): a column's default, its own block after the rules.
    +otherwise.map(o=>`<div class="authored-rule"><span class="rule-number"></span><div class="rule-then rule-block rule-block-otherwise">`
      +`<span class="rule-keyword">OTHERWISE</span><div class="rule-conditions"><div class="rule-row"><span class="rule-and"></span>`
      +`<span class="rule-field">${esc(o.predicate.slice(o.predicate.indexOf(':')+1))}</span><span class="rule-op">is</span>`
      +`<span class="rule-value">${esc(readable(o.value))}</span></div></div></div></div>`).join('')
    +`</div>`;
}

/** THE RECORDS A RULES STEP READS, for the dialog's live preview (experiment 188): the table on its input, from the
 *  input step or the last run, as the rules will read it, and the columns in the order a reader meets them. */
function rulePreview(kit:RulesetKit,nodeId:string):{records:import('./authored-application.js').SubjectRecord[];columns:string[]}|undefined{
  const edge=kit.workflow().edges.find(e=>e.to===nodeId);
  const table=edge?kit.tableOn(nodeId,edge.port)??null:null;
  if(!table?.rows.length)return undefined;
  const records=authoredSubjects(table);
  const columns=[...new Set(records.flatMap(r=>Object.keys(r.properties)))];
  return {records,columns};
}

/** Turn a step into one whose rules are written here.
 *
 *  The practitioner, 2026-10-15: *"Why can't I just get a ruleset editor?"* They could not,
 *  from example 09 or from any step holding a published ruleset, because this conversion was an
 *  option inside a dropdown labelled Ruleset -- and it threw away every edge on the node on the
 *  way, so the step then had nothing to read and no columns to offer.
 *
 *  It keeps the PORT SHAPE of whatever was pinned, when something was. That is what lets the
 *  wiring survive: the step still takes what it took and gives back what it gave, and only the
 *  rules inside it change. A step with nothing pinned starts from points, which is the shape
 *  most records arrive in.
 *
 *  What it does NOT do is edit the published ruleset. That one is pinned, versioned and carries
 *  a basis; a step that writes its own rules has forked away from it, and the Inspector says so
 *  rather than letting a practitioner believe they changed something published. */
/** Units a practitioner can type, and the IRI the unit check compares.
 *
 *  A word this does not recognise gets the label and no IRI -- so the check then refuses the
 *  rules for want of a unit, which is the honest outcome rather than a guess at what they meant.
 *  Millimetres were added 2026-10-26 when a seeded binding declared `mm` and nothing could
 *  resolve it. */
const UNIT_IRIS:Record<string,string>={
  // Counts, by what they count (2026-11-08, for the rules worked example): each is a number of something.
  houses:'NUM',deaths:'NUM',visits:'NUM',records:'NUM',doses:'NUM',
  years:'YR',year:'YR',kilograms:'KiloGM',kilogram:'KiloGM',kg:'KiloGM',milligrams:'MilliGM',milligram:'MilliGM',mg:'MilliGM',
  'degrees celsius':'DEG_C','°c':'DEG_C','degrees fahrenheit':'DEG_F','°f':'DEG_F',
  proportion:'FRAC',fraction:'FRAC',count:'NUM',children:'NUM',people:'NUM',cases:'NUM',minutes:'MIN',minute:'MIN',min:'MIN',hours:'HR',hour:'HR',hr:'HR',seconds:'SEC',second:'SEC',days:'DAY',day:'DAY',metres:'M',meters:'M',m:'M',kilometres:'KiloM',kilometers:'KiloM',km:'KiloM',millimetres:'MilliM',millimeters:'MilliM',millimetre:'MilliM',millimeter:'MilliM',mm:'MilliM',percent:'PERCENT','%':'PERCENT'};
const unitIriFor=(label?:string)=>{
  const code=UNIT_IRIS[(label??'').trim().toLowerCase()];
  return code?`http://qudt.org/vocab/unit/${code}`:undefined;
};

function authorRulesOn(kit:RulesetKit,nodeId:string,label:string){
  // The columns arriving, read before the change: inside it the workflow is the draft being edited.
  const candidateAtStart=kit.candidateFields(nodeId);
  kit.change(w=>{
    const target=getNode(w,nodeId,'apply_ruleset');
    const held=target.params.ruleset;
    target.params.ruleset={id:WRITTEN_IN_WORKFLOW,version:'1.0.0',title:'Rules written in this workflow',
      inputs:held?.inputs??[['subjects','points']],output:held?.output??'points'};
    target.params.parameters={};
    // A RULESET THAT READS COLUMNS CARRIES OVER; one that works its facts out for itself does
    // not. The refusal to copy was right for the four bespoke fact generators -- the rules would
    // read the same and be fed something different -- but `extract-contract` declares
    // `fieldFrom` and names `authoredFacts` as its generator, which is the very function rules
    // written here go through. Fed by the same function from the same bindings, a copy is fed
    // identically, so the objection does not reach it.
    //
    // The practitioner, 2026-10-26: "how do we demonstrate the use of a ruleset widget when we
    // cannot even provide the view of how it's used? Defeats the purpose of a worked example."
    // A worked example is a teaching artifact and a regression fixture at once, and a step whose
    // rules open blank teaches nothing about the step. Resetting the example puts it back.
    const source=publishedRuleset(held);
    const bindings=source?.inputContract.fieldFrom;
    const seeded=bindings?.length?source:undefined;
    target.params.authored={title:label||'Rules for this step',
      mustNotBeReadAs:seeded?.mustNotBeReadAs??'',
      // The columns the connected records carry, declared for them. Nothing is guessed from a
      // name -- the kinds come from the values -- and an empty list is the honest result when
      // nothing is connected yet, which the Inspector already says plainly. A seeded fork
      // declares the bindings the ruleset declared, resolving each stated unit to the IRI the
      // unit check compares; a label nothing recognises stays a label and the run says so.
      fields:(seeded&&bindings
        ?bindings.map(b=>({...b,unit:unitIriFor(b.unitLabel)}))
        :candidateAtStart) as never,
      parameters:(seeded?.parameters??[]).map(parameter=>({name:parameter.name,
        meaning:parameter.meaning,min:parameter.min,max:parameter.max,
        unitLabel:parameter.unitLabel})) as never,
      rules:(seeded?.authored?structuredClone(seeded.authored.rules):[]) as never};
  });
}

/** The button that gets you an editor, from any ruleset step, in one press.
 *
 *  Converting and then opening is one gesture rather than two: a practitioner who asked to write
 *  rules wants to be writing them, not looking at an empty section that says they may. */

/** A published ruleset's source, shaped for the editor to display.
 *
 *  The editor reads `fields` to name a predicate and to decide which comparators fit it. A
 *  published ruleset declares its vocabulary as N3 rather than as field bindings, so the fields
 *  are reconstructed from the rules themselves: every predicate a condition reads, its kind from
 *  how it is compared, and its unit from the parameter it is compared against when there is one.
 *
 *  A `…Known` predicate is the editor's own companion to a field, so it is folded back into the
 *  field it belongs to rather than listed as one of its own. */
export function reviewAuthored(ruleset:Ruleset):NonNullable<import('./types.js').ParamsByType['apply_ruleset']['authored']>{
  const kinds=new Map<string,'number'|'boolean'|'term'>();
  // The unit IRI as well as its label. The label is what a reader sees; the IRI is what the unit
  // check compares, and a field carrying only a label is refused for stating no unit -- which is
  // exactly what a fork of extent-review did, naming a defect that was in this reconstruction
  // rather than in the published ruleset.
  const units=new Map<string,{unit?:string;unitLabel?:string}>();
  const parameters=new Map(ruleset.parameters.map(p=>[p.name,p]));
  for(const rule of ruleset.authored?.rules??[])
    for(const group of rule.any)
      for(const condition of group.all){
        const base=condition.field.replace(/Known$/,'');
        const isKnown=base!==condition.field;
        // A WORD COMPARATOR reads text (2026-11-26): contains and starts-with look for words, so the field is a term;
        // until then anything but equals was taken for a number, and a published ruleset of words showed its text
        // column as a number when read in the rule editor.
        const kind=isKnown?undefined
          :isWordComparator(condition.comparator)?'term' as const
          :condition.comparator!=='equals'?'number' as const
          :typeof condition.value==='boolean'?'boolean' as const:'term' as const;
        if(kind&&kinds.get(base)!=='number')kinds.set(base,kind);
        else if(!kinds.has(base))kinds.set(base,'term');
        const setting=typeof condition.value==='object'&&condition.value
          ?parameters.get((condition.value as {setting:string}).setting):undefined;
        if(setting?.unit)units.set(base,{unit:setting.unit,unitLabel:setting.unitLabel});
      }
  return {title:`${ruleset.title} ${ruleset.version}`,mustNotBeReadAs:ruleset.mustNotBeReadAs,
    fields:[...kinds].map(([predicate,kind])=>({attribute:predicate.slice(predicate.indexOf(':')+1),
      predicate,kind,label:predicate.slice(predicate.indexOf(':')+1),...units.get(predicate)})),
    parameters:ruleset.parameters.map(p=>({name:p.name,meaning:p.meaning,unit:p.unit,
      unitLabel:p.unitLabel,min:p.min,max:p.max})),
    rules:(ruleset.authored?.rules??[]) as never} as never;
}

/** WHAT A PUBLISHED RULESET ASKS OF THE PERSON, met in the Inspector and not only behind Configure (experiment 186):
 *  a newer version, which may not be a drop-in, and what applying it obliges them to do (experiment 140). A notice is
 *  where a reader meets a consequence; a dialog is where they change something. */
export function pinnedNotices(ruleset:Ruleset,pinnedVersion:string):string{
  let html='';
  const newer=supersession(ruleset.id,pinnedVersion);
  if(newer){
    const said=newer.changes.map(c=>`<p>${esc(c.description)}</p>`
      +(c.incompatibility?`<p><strong>Incompatible:</strong> ${esc(c.incompatibility)}</p>`:'')
      +(c.deprecates?`<p><strong>No longer supported:</strong> ${esc(c.deprecates)}</p>`:'')).join('');
    html+=newer.incompatible
      ?`<div class="inspector-alert" role="alert"><strong>Pinned to ${esc(pinnedVersion)} · ${esc(newer.version)} is available and is not a drop-in</strong>`
        +`${said}<p>This step keeps running on ${esc(pinnedVersion)}, which is what reproduces the results it was built on. Choose the newer version in Configure only when you are ready to re-wire; Undo restores what this disconnects.</p></div>`
      :`<div class="notice"><strong>${esc(newer.version)} is available.</strong> This step is pinned to ${esc(pinnedVersion)} and keeps running on it.${said}</div>`;
  }
  const obligation=(ruleset as unknown as {obligation?:{summary:string;whatYouTakeOn:string;howToAcknowledge:string;ifYouDoNot:string}}).obligation;
  if(obligation)html+=`<div class="inspector-alert" role="note"><strong>What this obliges you to: ${esc(obligation.summary)}</strong>`
    +`<p>${esc(obligation.whatYouTakeOn)}</p><p><strong>How to acknowledge it.</strong> ${esc(obligation.howToAcknowledge)}</p>`
    +`<p><strong>If you do not.</strong> ${esc(obligation.ifYouDoNot)}</p></div>`;
  return html;
}

/** THE INSPECTOR'S ONE SENTENCE for Apply ruleset (experiment 186). */
export function rulesetSentence(p:import('./types.js').ParamsByType['apply_ruleset'],pinned?:Ruleset):string{
  const authored=p.authored;
  if(authored){
    const n=authored.rules.length,o=authored.otherwise?.length??0;
    const columns=[...new Set(authored.rules.flatMap(r=>r.then.map(c=>c.column?.trim()||c.predicate.slice(c.predicate.indexOf(':')+1))))];
    if(!n)return 'Rules written on this step: none yet. Write them in Configure…';
    return `${authored.title}: ${n} rule${n===1?'':'s'} written on this step${o?`, with ${o} otherwise`:''}, giving ${columns.join(', ')}, `
      +`from ${authored.fields.length} column${authored.fields.length===1?'':'s'} of the records.`;
  }
  if(pinned){
    const newer=supersession(pinned.id,pinned.version);
    const basis={published:'published',"practitioner-agreed":'agreed with the practitioner',illustrative:'illustrative, no source',
      proxy:'a proxy, no source'}[pinned.basis.status]??pinned.basis.status;
    return `Applies ${pinned.title} ${pinned.version}, published and pinned${newer?`; ${newer.version} is available`:''}. Basis: ${basis}.`;
  }
  return 'Nothing to apply yet: choose a published ruleset, or write rules for this step, in Configure…';
}

/** RULES WRITTEN ON THIS STEP, in the rule editor (experiment 192). What it returns replaces the step's rules, columns,
 *  settings and defaults; a change in how the records arrive changes the ports, and disconnects what was wired. */
async function openAuthoredRules(kit:RulesetKit,nodeId:string){
  const node=getNode(kit.workflow(),nodeId,'apply_ruleset');
  const authored=node.params.authored;
  if(!authored)return;
  const was=node.params.ruleset?.output;
  // THE COLUMNS OF WHAT IS CONNECTED NOW, where the rules declare none: rules started before the records were wired had
  // no column to choose. Rules that have columns keep exactly those: an added number with no unit would stop them.
  const candidates=kit.candidateFields(nodeId),preview=rulePreview(kit,nodeId);
  // THE COLUMNS ARRIVING, with three of each one's values, and the step they come from (2026-11-21).
  const from=kit.workflow().nodes.find(n=>n.id===kit.workflow().edges.find(e=>e.to===nodeId)?.from);
  const arriving=from&&candidates.length?{source:String(from.params.label||kit.title(from.type)),
    columns:candidates.map(c=>({attribute:c.attribute,kind:c.kind,
      samples:[...new Set((preview?.records??[]).map(r=>r.properties[c.attribute]).filter(v=>v!==null&&v!==undefined&&v!=='').map(String))].slice(0,3)}))}:undefined;
  const edited=await openRuleEditor(authored.fields.length?authored:{...authored,fields:candidates as never},esc,{settingValues:node.params.parameters,preview,
    unitIri:unitIriFor,candidates:candidates as never,...(arriving?{arriving}:{}),step:node.params.label||kit.title('apply_ruleset'),
    ...(was==='points'||was==='table'||was==='polygons'?{recordsKind:was}:{})});
  if(!edited)return;
  kit.change(w=>{
    const step=getNode(w,nodeId,'apply_ruleset'),held=step.params.authored!;
    held.rules=edited.rules as never;held.fields=edited.fields as never;
    if(edited.order)held.order=edited.order;else delete held.order;
    if(edited.otherwise.length)held.otherwise=edited.otherwise;else delete held.otherwise;
    held.parameters=edited.parameters as never;step.params.parameters=edited.values;
    // HOW THE RECORDS ARRIVE decides the ports, so a change disconnects what was wired to the old ones; Undo restores it.
    if(edited.recordsKind&&step.params.ruleset&&edited.recordsKind!==was){
      step.params.ruleset={...step.params.ruleset,inputs:[['subjects',edited.recordsKind]],output:edited.recordsKind};
      w.edges=w.edges.filter(e=>e.to!==nodeId&&e.from!==nodeId);
    }
  });
}

/** A PUBLISHED RULESET, chosen in the standard dialog (experiments 186 and 192): the choice and its settings, and as the
 *  preview, what the chosen ruleset decides, its basis and what it obliges. A newer version is a decision. */
function openRulesetConfig(kit:RulesetKit,nodeId:string){
  const node=getNode(kit.workflow(),nodeId,'apply_ruleset');
  const held=node.params.ruleset;
  type Draft={choice:string; parameters:Record<string,number>; bindings:Record<string,string>};
  const heldRuleset=publishedRuleset(held);
  // THE CONNECTED RECORDS' COLUMNS, for choosing which holds each of the ruleset's inputs (experiment 200).
  const columns=[...new Set(kit.candidateFields(nodeId).map(f=>(f as {attribute:string}).attribute))];
  openConfigDialog<Draft>({
    id:'ruleset-config',widget:'Apply ruleset',step:node.params.label||kit.title('apply_ruleset'),
    draft:{choice:held?`${held.id}@${held.version}`:'',parameters:{...(node.params.parameters as Record<string,number>)},bindings:{...(node.params.bindings??{})}},
    sections:draft=>{
      const [id,version]=draft.choice.split('@');
      const chosen=id&&version?bundledRulesets().find((r:Ruleset)=>r.id===id&&r.version===version) as Ruleset|undefined:undefined;
      const copyable=!!heldRuleset?.authored&&!!heldRuleset.inputContract.fieldFrom?.length;
      let settings=`<div class="field"><label class="field-label" for="ruleset-choice">Ruleset</label><select id="ruleset-choice">`
        +`<option value="" ${draft.choice?'':'selected'}>Choose a ruleset…</option>`
        +`<option value="authored" ${draft.choice==='authored'?'selected':''}>${copyable?'Edit a copy of these rules on this step':'Write rules for this step'}</option>`
        +[...new Map([...currentRulesets(),...(heldRuleset?[heldRuleset]:[])].map(r=>[`${r.id}@${r.version}`,r])).values()]
          .map(r=>`<option value="${esc(r.id+'@'+r.version)}" ${draft.choice===`${r.id}@${r.version}`?'selected':''}>`
          +`${esc(r.title)} ${esc(r.version)} · ${esc(r.inputContract.ports.inputs.map(([,t])=>t).join(', '))} → ${esc(r.inputContract.ports.output)}</option>`).join('')
        +'</select><p class="muted">Changing the ruleset disconnects what is wired here; Undo restores it.</p></div>';
      if(chosen?.parameters.length)settings+=chosen.parameters.map(q=>`<div class="field"><label class="field-label" for="ruleset-${esc(q.name)}">${esc(q.meaning.split('.')[0])}</label>`
        +`<div class="input-unit"><input id="ruleset-${esc(q.name)}" data-ruleset-parameter="${esc(q.name)}" type="number" min="${q.min}" max="${q.max}" step="0.5" value="${draft.parameters[q.name]??q.default??''}">`
        +`<span>${esc(q.unitLabel||'')}</span></div><p class="muted">${esc(q.meaning)}</p></div>`).join('');
      // WHICH COLUMN HOLDS EACH INPUT: the ruleset's own name unless another column is chosen.
      const inputs=chosen?.authored&&draft.choice!=='authored'?chosen.inputContract.fieldFrom??[]:[];
      if(inputs.length)settings+=`<section class="config-group" id="ruleset-bindings"><h3 class="config-group-title">Which column holds each</h3>`
        +inputs.map(b=>{const at=draft.bindings[b.predicate]??'';
          return `<div class="field"><label class="field-label" for="ruleset-binding-${esc(b.predicate.replace(/\W/g,'-'))}">${esc(b.label??b.predicate)}</label>`
          +`<select id="ruleset-binding-${esc(b.predicate.replace(/\W/g,'-'))}" data-ruleset-binding="${esc(b.predicate)}">`
          +`<option value="" ${at?'':'selected'}>${esc(b.attribute)}${columns.includes(b.attribute)?'':' · not in these records'}</option>`
          +columns.filter(c=>c!==b.attribute).map(c=>`<option value="${esc(c)}" ${c===at?'selected':''}>${esc(c)}</option>`).join('')
          +`</select></div>`;}).join('')+`</section>`;
      if(draft.choice==='authored')return {settings,preview:`<p class="muted">${copyable?'Apply copies these rules onto this step, where they can be edited, and opens them.'
        :'Apply starts rules of your own on this step, and opens them.'}</p>`};
      if(!chosen)return {settings,preview:'<p class="muted">Choose a ruleset to see what it decides.</p>'};
      const basis={published:'Published basis','practitioner-agreed':'Practitioner-agreed basis',illustrative:'Illustrative, no source',proxy:'Proxy, no source'}[chosen.basis.status]||chosen.basis.status;
      const obligation=(chosen as unknown as {obligation?:{summary:string;whatYouTakeOn:string;howToAcknowledge:string;ifYouDoNot:string}}).obligation;
      // WHAT THE CHOSEN RULESET CONCLUDES OVER THESE RECORDS (2026-11-28). The preview audit found this the last transform
      // whose Preview showed neither a drawing nor rows, with no reason recorded: it showed the rules and not what they
      // decide. A published ruleset that is evaluated directly runs as `runApplyRuleset` runs it, through
      // `publishedAsAuthored` with the draft's bindings and `evaluateAuthored`, synchronously over the records `rulePreview`
      // reads; shown as the rule editor's After shows it. One that goes to the reasoner is NOT run here: the reasoner is an
      // asynchronous engine the run starts (run-ruleset.ts, `reasoner`), and a dialog builds its Preview synchronously,
      // so what it concludes is in the Result after a run.
      const direct=publishedAsAuthored(chosen,draft.bindings);
      const records=direct?rulePreview(kit,nodeId):undefined;
      let concluded='';
      if(direct&&records){
        const units=authoredUnitProblems(direct as never);
        try{concluded=units.length?`<p class="profile-flag">${esc(units[0]!.says)}</p>`
          :beforeAndAfter(records,evaluateAuthored(records.records,direct.fields as never,direct.rules as never,draft.parameters,undefined,
            (direct as {otherwise?:never}).otherwise??[]),computedColumnsOf(direct.rules as never).map(c=>c.label),esc);}
        catch(error){concluded=`<p class="muted">${esc(`These rules cannot be applied to these records yet: ${error instanceof Error?error.message:String(error)}`)}</p>`;}
      }else if(direct)concluded='<p class="muted">Connect the records, and what these rules conclude over them is shown here.</p>';
      else concluded='<p class="muted">What these rules conclude over the records is in the Result after a run.</p>';
      const preview=concluded+`<p class="description">${esc(chosen.description)}</p>`
        +(chosen.authored?`<div class="inspector-actions"><button class="button" id="review-rules">Read them in the rule editor</button></div>`
          +rulesList(chosen.authored.rules as ShownRule[],chosen.inputContract.fieldFrom??[],
          v=>{const s=settingNamed(v);return s?`${s} · ${draft.parameters[s]??'not set'}`:typeof v==='string'&&v.includes(':')?v.slice(v.indexOf(':')+1):String(v);},esc)
          :'<p class="muted">This build carries no structured form of these rules.</p>')
        +`<div class="notice">${esc(chosen.mustNotBeReadAs)}</div>`
        +`<p class="description"><strong>${esc(basis)}</strong>, ${chosen.basis.evidence.length} reference${chosen.basis.evidence.length===1?'':'s'}.</p>`
        +(obligation?`<div class="inspector-alert" role="note"><strong>${esc(obligation.summary)}</strong><p>${esc(obligation.whatYouTakeOn)}</p>`
          +`<p><strong>How to acknowledge it.</strong> ${esc(obligation.howToAcknowledge)}</p><p><strong>If you do not.</strong> ${esc(obligation.ifYouDoNot)}</p></div>`:'');
      const newer=supersession(chosen.id,chosen.version);
      const decisions=newer?`<p><strong>${esc(newer.version)} is available.</strong> This step stays on ${esc(chosen.version)}, because a rule change changes results. `
        +`${newer.incompatible?'It is not a drop-in: choosing it means re-wiring. ':''}Choose it above when ready.</p>`
        +newer.changes.map(c=>`<p>${esc(c.description)}</p>`+(c.incompatibility?`<p><strong>Incompatible:</strong> ${esc(c.incompatibility)}</p>`:'')
          +(c.deprecates?`<p><strong>No longer supported:</strong> ${esc(c.deprecates)}</p>`:'')).join(''):undefined;
      const unset=chosen.parameters.filter(q=>!Number.isFinite(draft.parameters[q.name]));
      return {settings,preview,...(decisions?{decisions}:{}),
        ...(unset.length?{message:{tone:'refusal' as const,text:`Set ${unset.map(q=>q.name).join(' and ')} to a number.`},blocked:true}:{})};
    },
    wire:(root,draft,redraw)=>{
      root.querySelector<HTMLSelectElement>('#ruleset-choice')?.addEventListener('change',e=>{
        draft.choice=(e.target as HTMLSelectElement).value;
        const [id,version]=draft.choice.split('@');
        const chosen=id&&version?bundledRulesets().find((r:Ruleset)=>r.id===id&&r.version===version) as Ruleset|undefined:undefined;
        if(chosen&&!(held&&`${held.id}@${held.version}`===draft.choice)){draft.parameters=Object.fromEntries(chosen.parameters
          .filter(q=>q.default!==undefined).map(q=>[q.name,q.default as number]));draft.bindings={};}
        redraw();});
      // READ IN THE RULE EDITOR, every control disabled (the practitioner, 2026-10-15: "reviewable in the editor").
      root.querySelector<HTMLButtonElement>('#review-rules')?.addEventListener('click',()=>{
        const [id,version]=draft.choice.split('@');
        const chosen=id&&version?bundledRulesets().find((r:Ruleset)=>r.id===id&&r.version===version) as Ruleset|undefined:undefined;
        if(chosen)void openRuleEditor(reviewAuthored(chosen),esc,{settingValues:draft.parameters,step:chosen.title,
          note:`These are the rules ${chosen.title} ${chosen.version} applies, laid out the way rules you write are laid out. `
            +'Nothing here can be changed: this ruleset is published and pinned, and the run evidence names it by version.'});});
      root.querySelectorAll<HTMLSelectElement>('[data-ruleset-binding]').forEach(el=>el.addEventListener('change',()=>{
        const predicate=el.dataset.rulesetBinding!;if(el.value)draft.bindings[predicate]=el.value;else delete draft.bindings[predicate];redraw();}));
      root.querySelectorAll<HTMLInputElement>('[data-ruleset-parameter]').forEach(el=>el.addEventListener('change',()=>{
        const name=el.dataset.rulesetParameter!;
        // AN EMPTY BOX IS AN UNSET SETTING, not zero: Number('') is 0, and a band against zero nobody typed is no setting.
        if(el.value.trim()==='')delete draft.parameters[name];else draft.parameters[name]=Number(el.value);redraw();}));
    },
    apply:draft=>{
      if(draft.choice==='authored'){authorRulesOn(kit,nodeId,node.params.label??'');void openAuthoredRules(kit,nodeId);return;}
      const [id,version]=draft.choice.split('@');
      const chosen=id&&version?bundledRulesets().find((r:Ruleset)=>r.id===id&&r.version===version):undefined;
      kit.change(w=>{
        const target=getNode(w,nodeId,'apply_ruleset');
        const same=held&&`${held.id}@${held.version}`===draft.choice;
        if(!chosen){delete (target.params as {ruleset?:unknown}).ruleset;target.params.parameters={};delete target.params.bindings;}
        else{
          const generic=!target.params.label||target.params.label===kit.title('apply_ruleset')||currentRulesets().some(r=>r.title===target.params.label);
          if(!same){target.params.ruleset=pinnedRuleset(chosen.id,chosen.version);if(generic)target.params.label=chosen.title;}
          target.params.parameters={...draft.parameters};
          if(Object.keys(draft.bindings).length)target.params.bindings={...draft.bindings};else delete target.params.bindings;
        }
        if(!same)w.edges=w.edges.filter(edge=>edge.to!==nodeId&&edge.from!==nodeId);
      });
    },
  },esc);
}
export function currentRulesets():Ruleset[]{
  const current=new Map<string,Ruleset>();
  for(const r of bundledRulesets() as Ruleset[]){
    const held=current.get(r.id);
    if(!held||held.version.localeCompare(r.version,undefined,{numeric:true})<0)current.set(r.id,r);
  }
  return [...current.values()];
}

/** THE RULES' ACCOUNT IN THE INSPECTOR: the first three sentences, and every sentence saying what could not be given a
 *  value, which the first three can leave out (2026-11-15: Oswego's two unreadable onset times were the fifth sentence). */
export function rulesResultLine(method:string):string{
  const sentences=method.split('. ').map(x=>x.trim()).filter(Boolean);
  const kept=sentences.filter((x,i)=>i<3||/no value|no date and time|an empty value|otherwise/.test(x));
  return kept.join('. ').replace(/\.?$/,'.');
}

/** THE INSPECTOR (experiments 186 and 192). */
export const rulesetInspector:OwnInspector<'apply_ruleset'>={
  markup:(n,kitIn)=>{
    const kit=kitIn as RulesetKit;
    let html='';
    // THE STANDARD INSPECTOR (experiments 186 and 192): name, inputs, one sentence of what the step applies, Configure…,
    // and what the last run did. The rules, their columns and settings are in the dialog; here they are shown as blocks,
    // folded, because a worked example teaches the step it is built around (2026-10-26).
    const p=n.params,authored=p.authored;
    html+=kit.section('Name',kit.name('ruleset-label',p.label||'Apply ruleset'));
    html+=kit.section('Inputs',kit.inputs(n));
    const pinned=!authored&&p.ruleset?resolveRuleset(p.ruleset.id,p.ruleset.version):undefined;
    const shown=authored?{rules:authored.rules as ShownRule[],fields:authored.fields as {attribute?:string;predicate:string}[],otherwise:authored.otherwise??[]}
      :pinned?.authored?{rules:pinned.authored.rules as ShownRule[],fields:pinned.inputContract.fieldFrom??[],otherwise:[]}:undefined;
    const readableValue=(value:import('./authored-rules.js').AuthoredValue)=>{
      const setting=settingNamed(value);
      if(!setting)return typeof value==='string'&&value.includes(':')?value.slice(value.indexOf(':')+1).replace(/_/g,' '):String(value);
      const held=p.parameters?.[setting];
      const declared=authored?(authored.parameters??[]).find(q=>q.name===setting):pinned?.parameters.find(q=>q.name===setting);
      return held===undefined||held===null?`${setting} · not set`:`${setting} · ${held}${declared?.unitLabel?' '+declared.unitLabel:''}`;
    };
    html+=kit.section('Settings',`<p class="standard-sentence">${esc(rulesetSentence(p,pinned))}</p>`
      +'<div class="inspector-actions"><button id="configure-step" class="button primary">Configure…</button></div>'
      +(pinned?pinnedNotices(pinned,p.ruleset!.version):'')
      +(shown&&shown.rules.length?`<details class="standard-rules"><summary>The rules (${shown.rules.length}${shown.otherwise.length?`, ${shown.otherwise.length} otherwise`:''})</summary>`
        +(authored?.order?`<p class="description" data-rule-order>${esc(orderSentence(authored.order))}</p>`:'')
        +rulesList(shown.rules,shown.fields,readableValue,esc,shown.otherwise)+'</details>':''));
    const receipt={method:kit.method(n.id)};
    const why=kit.unfinished(n.id);
    html+=kit.section('Result',`<p class="standard-result${why?' standard-result-warning':''}">`
      +`${esc(why?`The last run could not compute this step: ${why}`:receipt?.method?rulesResultLine(receipt.method):'Not run yet.')}</p>`
      +'<div data-standard-result></div>');
    return html;
  },
  // APPLY RULESET'S CONFIGURATION (experiments 186 and 192). Rules written on this step open in the rule editor, in the
  // standard frame, with the records, their columns and the settings; a published ruleset is chosen in a dialog of its
  // own, whose preview is its rules, basis and obligations. Only Apply writes.
  wire:(n,kitIn,root)=>{
    const kit=kitIn as RulesetKit;
    root.querySelector<HTMLButtonElement>('#configure-step')?.addEventListener('click',()=>{
      const node=getNode(kit.workflow(),n.id,'apply_ruleset');
      if(node.params.authored)void openAuthoredRules(kit,n.id);else openRulesetConfig(kit,n.id);
    });
  },
};
