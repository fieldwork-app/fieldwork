/** WHAT EACH STEP COMPUTES: Apply ruleset. Moved out of `executeWorkflow` on 2026-11-25 (code review), one function
 *  per step type, each given the run's context rather than reaching into the executor. The text of each step is as it
 *  stood in the switch; a step that ended there now returns its value. */
import {authoredConclusions,authoredDataIssues,authoredFacts,authoredProjection,authoredReceipt,authoredSubjects,evaluatedRecordFacts} from './authored-application.js';
import {authoredUnitProblems,compileAuthoredRuleset,evaluatedDirectly,fieldsRead} from './authored-rules.js';
import {issueFacts} from './data-issues.js';
import type {DisplayValue,Receipt} from './results.js';
import {evaluateAuthored,evaluatedTable,evaluationSentence} from './rule-evaluation.js';
import {bindParameters,publishedRuleset,resolveRuleset,rulesetCitation,tableContractFailures,type Ruleset} from './rulesets.js';
import type {PointCollection} from './types.js';
import type {StepContext} from './core.js';
import {dataOrigin} from './core.js';

/** A PUBLISHED RULESET THAT IS EVALUATED DIRECTLY, as the rules written on a step are (experiment 197): its fields are
 *  its declared bindings, each read from the column `bindings` chooses, or its own name, with the unit its contract
 *  expects. Undefined for one that goes to the reasoner. One function for the run and for the dialog's Preview
 *  (2026-11-28), so the Preview cannot bind a column the run would not. */
export function publishedAsAuthored(published:Ruleset,bindings:Record<string,string>|undefined){
  if(!(published.authored&&published.inputContract.fieldFrom?.length&&evaluatedDirectly(published.authored as never)))return undefined;
  return {title:published.title,mustNotBeReadAs:published.mustNotBeReadAs,
    fields:published.inputContract.fieldFrom.map(b=>({...b,attribute:bindings?.[b.predicate]||b.attribute,
      unit:(published.inputContract.expects as {predicate:string;unit?:string}[]|undefined)?.find(e=>e.predicate===b.predicate)?.unit})),
    parameters:[],rules:published.authored.rules,
    ...((published.authored as {otherwise?:unknown}).otherwise?{otherwise:(published.authored as {otherwise?:unknown}).otherwise}:{})};
}

export async function runApplyRuleset(ctx:StepContext<'apply_ruleset'>):Promise<unknown>{
  const {inputs,node,reasoner,receipts,runId,workflow}=ctx;
  let value:unknown;
  // The merge: three widgets differed only in which rules they ran. The projection is the
  // ruleset's own declaration, and each still assembles a different value for whatever
  // consumes it -- so this collapses the palette and the contract, not the three projections.
  const pinned=node.params.ruleset,bound=node.params.parameters;
  // executionPlan refuses an unconfigured node before anything runs, so reaching here
  // without a pin would be a defect in the plan rather than in the workflow.
  if(!pinned)throw new Error(`${node.params.label||node.id} has no ruleset to apply.`);
  // Rules the practitioner wrote. One generic path -- facts from the declared field
  // bindings, the authored form compiled to N3, conclusions carried back onto the records
  // that were judged -- where a bundled ruleset has a generator and a projection written
  // for the shape it expects. Experiment 106.
  // A PUBLISHED RULESET THAT COMPUTES VALUES (experiment 197) runs the way rules written on a step do: its fields
  // are its declared bindings, each with the unit its contract expects. The reasoner cannot compute a value, so
  // a published ruleset that does could otherwise conclude nothing.
  const published=node.params.authored?undefined:resolveRuleset(pinned.id,pinned.version);
  const directly=published?publishedAsAuthored(published,node.params.bindings):undefined;
  const authored=node.params.authored??directly as typeof node.params.authored;
  if(authored){
    // Points or a table. The rules do not know the difference: a rule reads a predicate,
    // and a predicate is bound to an attribute of a record. 2026-10-16.
    //
    // READ THE PORT THE NODE DECLARES, not a port named here. Writing rules on a step keeps
    // the ports of whatever pin the node was holding (`app.ts`, `held?.inputs`), so a node
    // that came from the extract contract carries `projections` and never had a `subjects`
    // port at all. This line named one, got undefined, and reported "Connect records to
    // classify" about an input that was connected -- found 2026-10-26 by writing rules on
    // the Manila extract step. `subjects` remains the fallback: it is the port the authored
    // default declares for a node that was holding no pin.
    const port=node.params.ruleset?.inputs[0]?.[0]??'subjects';
    const subjects=(inputs as unknown as Record<string,unknown>)[port] as PointCollection;
    // A COLUMN CHOSEN FOR A RULESET'S INPUT MUST BE ONE THE RECORDS CARRY: refused, naming the columns there are,
    // rather than read as a column of empty values and reported as unknown on every row (experiment 200).
    if(directly&&node.params.bindings){
      const table=subjects as unknown as import('./data-table.js').DataTable;
      const columns=table?.kind==='data-table'?[...table.keys,table.valueField]
        :[...new Set(((subjects?.features??[]) as {properties?:Record<string,unknown>}[]).flatMap(f=>Object.keys(f.properties??{})))];
      for(const [predicate,column] of Object.entries(node.params.bindings))
        if(column&&!columns.includes(column))
          throw new Error(`${node.params.label||node.id}: ${published?.inputContract.fieldFrom?.find(b=>b.predicate===predicate)?.label??predicate} `
            +`is read from "${column}", which these records do not carry. Their columns: ${columns.join(', ')}.`);
    }
    // Units first. A rule comparing minutes to hours is wrong by a factor of sixty and
    // every other check in this application passes it: the parameter is in range, the
    // rules compile, the run succeeds. Refused rather than converted, which is the
    // precedent makeN3 set for distances -- reinterpreting a practitioner's number
    // silently would change what they decided.
    const unitProblems=authoredUnitProblems(authored);
    if(unitProblems.length)
      throw new Error(`${node.params.label||node.id} cannot run: ${unitProblems[0].says}`
        +(unitProblems.length>1?` (${unitProblems.length-1} more like it.)`:''));
    // A RULE THAT COMPUTES A VALUE (experiment 188) is evaluated directly, over the same records the reasoner
    // would read: the authored tree is what runs, and N3 is the back end only where every rule fits it.
    if(evaluatedDirectly(authored as never)){
      const records=authoredSubjects(subjects);
      if(!records.length)throw new Error('Connect records to apply rules to. There is nothing to apply them to.');
      const evaluation=evaluateAuthored(records,authored.fields,authored.rules as never,bound,authored.order,authored.otherwise??[]);
      const dataIssues=authoredDataIssues(subjects,authored.fields.filter(f=>fieldsRead(authored.rules as never).has(f.predicate)));
      const method=evaluationSentence(evaluation,records.map(r=>r.label));
      const table=(subjects as unknown as import('./data-table.js').DataTable).kind==='data-table'
        ?evaluatedTable(subjects as unknown as import('./data-table.js').DataTable,evaluation):null;
      value=(table??{...subjects,features:(subjects as PointCollection).features.map((f,i)=>
        ({...f,properties:{...f.properties,...evaluation.records[i]!.values}}))}) as unknown as DisplayValue;
      if(dataIssues.length)value={...(value as object),dataIssues,issuedBy:node.id} as unknown as DisplayValue;
      // WHAT IT READ, COMPUTED AND FOUND, in the receipt (experiment 207): the bindings and reading problems as the
      // reasoner path states them, each record's values, and a division by zero or a disagreement as a data issue.
      const stated=authoredReceipt(node,authored,
        evaluatedRecordFacts(records,authored.fields,evaluation.records,authored.rules as never,authored.otherwise??[]),
        '',[],Array.from({length:evaluation.unmatched},()=>''),runId,workflow.edges,dataIssues,dataOrigin(workflow,node.id,runId));
      const zero=evaluation.records.flatMap(r=>r.divisionsByZero),clash=evaluation.records.flatMap(r=>r.conflicts.map(c=>c.column));
      const tally=(columns:string[])=>[...columns.reduce((m,c)=>m.set(c,(m.get(c)??0)+1),new Map<string,number>())];
      const found=issueFacts(`<urn:fieldwork:run:${runId}:ruleset:${node.id}>`,dataOrigin(workflow,node.id,runId),`urn:fieldwork:run:${runId}:ruleset:${node.id}`,[
        ...tally(zero).map(([column,count])=>({kind:'DivisionByZero' as const,column,count,of:records.length})),
        ...tally(clash).map(([column,count])=>({kind:'ConclusionsConflict' as const,column,count,of:records.length}))]);
      receipts.push({nodeId:node.id,kind:'computation',method,facts:stated.facts+found,input:stated.input+found,
        matchedByRule:evaluation.matchedByRule,unmatched:evaluation.unmatched,
        divisionsByZero:evaluation.records.flatMap((r,i)=>r.divisionsByZero.length?[records[i]!.label]:[]),
        conflicts:evaluation.records.flatMap((r,i)=>r.conflicts.map(c=>({record:records[i]!.label,...c}))),
        ...(evaluation.defaultedByColumn?{defaultedByColumn:evaluation.defaultedByColumn}:{}),
        // A PUBLISHED RULESET IS CITED wherever it runs. Evaluated directly, it wrote no citation until 2026-11-11,
        // so its basis and DOIs never reached provenance; the heat example's path carried one and hid the gap.
        ...(published?{ruleset:rulesetCitation(published)}:{})} as unknown as Receipt);
      return value;
    }
    const facts=authoredFacts(subjects,authored.fields);
    const compiled=compileAuthoredRuleset({subject:'?s',comment:authored.title,
      rules:authored.rules as never});
    // The authored ruleset's OWN parameters, not the pinned artefact's. The pin gives this
    // node its ports; it does not describe rules the practitioner wrote, and binding
    // against its declaration refused a step whose rules simply use no parameter.
    const declared=(authored.parameters??[]).map(p=>({name:p.name,role:'authored',type:'number',
      min:p.min,max:p.max,default:undefined,decimals:p.decimals??9,
      placeholder:`{{${p.name}}}`,meaning:p.meaning,unitLabel:p.unitLabel}));
    // Rules written in the workflow have no published ruleset to build on; the pin's own identity serves.
    const rules=bindParameters({...(publishedRuleset(pinned)??{id:pinned.id,version:pinned.version} as unknown as ReturnType<typeof resolveRuleset>),
      title:authored.title,parameters:declared as never,rules:compiled},bound);
    const conclusions=await reasoner(facts+'\n'+rules);
    // What the records could not say, counted before anything is concluded from them.
    const dataIssues=authoredDataIssues(subjects,authored.fields.filter(f=>fieldsRead(authored.rules as never).has(f.predicate)));
    const judged=authoredProjection(subjects,authored.fields,conclusions);
    // POLYGONS IN, POLYGONS OUT, each a row with a geometry: the conclusion is a property of
    // the record and its class on the map. A part no rule reached has no class, and is drawn
    // in the neutral. The practitioner, 2026-11-02: "apply_ruleset should apply to polygon
    // records as well like geopandas."
    if(node.params.ruleset?.output==='polygons'){
      const reached=authoredConclusions(conclusions);
      const layer=subjects as unknown as import('./catchments.js').Polygons;
      value=({...layer,method:authored.title,layerName:node.params.label||authored.title,
        features:layer.features.map((feature,index)=>{
          const concluded=reached.get(encodeURIComponent(String(feature.id)))??{};
          const category=Object.values(concluded)[0];
          return {...feature,...judged.features[index],geometry:feature.geometry,
            ...(category?{category}:{})};}),
        ...(dataIssues.length?{dataIssues,issuedBy:node.id}:{})}) as unknown as DisplayValue;
      receipts.push(authoredReceipt(node,authored,facts,rules,conclusions,judged.unmatched,runId,workflow.edges,dataIssues,dataOrigin(workflow,node.id,runId)));
      return value;
    }
    // A table in, a table out -- carrying what the rules concluded as further key columns,
    // so a Table output renders the judgement beside the number it was made about. A point
    // layer in, the records back whole, as extent-review 1.1.0 returns its polygons.
    value=({...(judged.table??{type:'FeatureCollection',features:judged.features,rows:judged.rows,
      kind:'authored-ruleset',centers:[],method:authored.title}),
      ...(dataIssues.length?{dataIssues,issuedBy:node.id}:{})}) as unknown as DisplayValue;
    receipts.push(authoredReceipt(node,authored,facts,rules,conclusions,judged.unmatched,runId,workflow.edges,dataIssues,dataOrigin(workflow,node.id,runId)));
    return value;
  }
  // A RULESET DECLARES ITS COLUMNS. The widget is an interpreter and the ruleset is the program (experiment 65):
  // conclusions become key columns on a table or properties on a point layer, by `authoredProjection`, the path
  // rules written in a workflow have always taken.
  const bindings=resolveRuleset(pinned.id,pinned.version).inputContract.fieldFrom;
  if(bindings?.length){
    const port=node.params.ruleset?.inputs[0]?.[0];
    const subjects=port?(inputs as unknown as Record<string,unknown>)[port]:undefined;
    if(!subjects)throw new Error(`${pinned.title} reads its facts from the `
      +`"${port??'first'}" input, and nothing is connected to it.`);
    const typed=subjects as PointCollection|import('./data-table.js').DataTable;
    // THE CONTRACT IS CHECKED BEFORE THE RULES SEE ANYTHING. Every failure at once, and
    // fatal: these say how to read the numbers, so a run that proceeded without them would
    // compute something nobody could interpret. Provenance is the other kind and is a gap.
    const failures=tableContractFailures(
      resolveRuleset(pinned.id,pinned.version).inputContract.tableContract,
      typed as {keys?:string[];unit?:string;rows?:{key:Record<string,unknown>}[]});
    if(failures.length)
      throw new Error(`${pinned.title} cannot read this table.\n\n`+failures.join('\n\n'));
    const facts=authoredFacts(typed,bindings);
    const rules=bindParameters(resolveRuleset(pinned.id,pinned.version),bound);
    const conclusions=await reasoner(facts+'\n'+rules);
    const dataIssues=authoredDataIssues(typed,bindings);
    const judged=authoredProjection(typed,bindings,conclusions);
    value=({...(judged.table??{type:'FeatureCollection',features:judged.features,
      rows:judged.rows,kind:'ruleset-applied',centers:[],method:pinned.title}),
      ...(dataIssues.length?{dataIssues,issuedBy:node.id}:{})}) as unknown as DisplayValue;
    receipts.push({nodeId:node.id,kind:'computation',facts,rules,input:facts+'\n'+rules,
      conclusions,ruleset:rulesetCitation(resolveRuleset(pinned.id,pinned.version))});
    return value;
  }
  // NO BESPOKE RULESET CODE (the practitioner, 2026-11-11: "There should be no bespoke ruleset widgets"). Six
  // projections, each written for one ruleset, were here; their rulesets retired with Old Naledi, the heat example
  // and Snow's extent rule (docs/audits/old-naledi-audit.md). A published ruleset declares the columns it reads.
  throw new Error(`${pinned.title} declares no columns to read its facts from, so this build cannot apply it.`);
  return value;
}
