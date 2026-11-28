/** MEASURE DISTANCE, ON THE STANDARD (experiment 186), out of app.ts (2026-11-26): its sentence, its Inspector, and
 *  Configure… with the unit and the conditions a candidate must meet. What it reads of the application comes through
 *  DistanceKit. */
import type {PointCollection,Workflow,WorkflowNode} from './types.js';
import {escapeHtml as esc} from './html-escape.js';
import type {OwnInspector,StepKit} from './inspector-kit.js';
import type {DataTable} from './data-table.js';
import {openConfigDialog} from './config-dialog.js';
import {TYPES,nearestPlaces} from './core.js';
import {satisfies} from './nearest-neighbour.js';
import {previewDrawing} from './spatial-walkthroughs.js';
import type {Position} from './types.js';

export interface DistanceKit extends StepKit {
  /** The points on one of the step's input ports, where they resolve. */ layerOn:(nodeId:string,port:string)=>PointCollection|undefined;
  /** The table of distances the last run made. */ made:(nodeId:string)=>DataTable|undefined;
}

function getNode(w:Workflow,id:string):WorkflowNode<'measure_distance'>{
  const node=w.nodes.find(n=>n.id===id);
  if(!node||node.type!=='measure_distance')throw new Error(`Expected a measure_distance step called ${id}.`);
  return node as WorkflowNode<'measure_distance'>;
}

/** WHAT MEASURE DISTANCE MEASURES, in one sentence. */
export function distanceSentence(w:Workflow,n:WorkflowNode<'measure_distance'>):string{
  const from=(port:string)=>{const e=w.edges.find(x=>x.to===n.id&&x.port===port);const up=e&&w.nodes.find(m=>m.id===e.from);
    return up?(up.params.label||TYPES[up.type].title):'';};
  const narrowed=(n.params.candidateFilter??[]).filter(c=>c.field.trim())
    .map(c=>`whose ${c.field} is ${c.comparator==='in'?'':'not '}one of ${c.values.join(', ')||'nothing yet'}`).join(' and ');
  return `For each point of ${from('points')||'the points connected'}, the straight-line distance to the nearest of `
    +`${from('candidates')||'the candidates connected'}${narrowed?`, among those ${narrowed}`:''}, in ${n.params.unit}.`;
}

/** WHAT MEASURE DISTANCE WOULD MEASURE, over the points and candidates connected (2026-11-25).
 *
 *  Its Preview restated `distanceSentence(draft)`, which is built from the node's params: it named the conditions
 *  being edited and never said what they kept. The whole point of a condition is how many candidates survive it, and
 *  that number was available only by running the workflow and reading the receipt.
 *
 *  This runs `nearestPlaces`, the function the run calls, so the eligible count moves as a condition is typed. The
 *  sentence stays above it, because it says what the step is FOR, which a column of numbers does not. */
function distancePreview(kit:DistanceKit,node:WorkflowNode<'measure_distance'>,draft:WorkflowNode<'measure_distance'>['params']):string{
  const said=`<p class="muted">${esc(distanceSentence(kit.workflow(),{...node,params:draft}))}</p>`;
  const points=kit.layerOn(node.id,'points'),candidates=kit.layerOn(node.id,'candidates');
  if(!points||!candidates)return said+`<p class="muted">Connect `
    +`${!points&&!candidates?'the points and the candidates':!points?'the points':'the candidates'}`
    +', and what this step would measure is counted here.</p>';
  const {rows,candidateCount,eligibleCount}=nearestPlaces(points,candidates,draft.unit,draft.candidateFilter);
  const measured=(rows as {distance:number|null}[]).filter(r=>typeof r.distance==='number')
    .map(r=>r.distance as number).sort((a:number,b:number)=>a-b);
  const n=(v:number)=>v.toLocaleString('en-US');
  const d=(v:number)=>`${v.toLocaleString('en-US',{maximumFractionDigits:v<10?2:0})} ${draft.unit==='metres'?'m':'km'}`;
  // DRAWN (2026-11-28): each point joined to the candidate it would be measured to, the candidates a condition keeps
  // drawn strong and the ones it leaves out faint, so narrowing is seen moving the lines. Listed by the preview audit's
  // re-review of 2026-11-27 as numbers with no reason recorded for not drawing.
  const kept=new Set(candidates.features.filter(f=>f.geometry&&satisfies(f.properties,draft.candidateFilter)));
  const lines=(rows as {coordinates:Position|null;center:{coordinates:Position}|null}[])
    .filter(r=>r.coordinates&&r.center).map(r=>({kind:'result' as const,rings:[[[r.coordinates!,r.center!.coordinates,r.coordinates!]]]}));
  const drawing=previewDrawing([
    ...lines,
    ...candidates.features.filter(f=>f.geometry).map(f=>({kind:kept.has(f)?'look' as const:'gone' as const,point:f.geometry!.coordinates as Position})),
    ...points.features.filter(f=>f.geometry).map(f=>({kind:'input' as const,point:f.geometry!.coordinates as Position}))],
    'Each point joined to the nearest candidate it would be measured to',undefined,
    {result:'Line: from a point to its nearest eligible candidate',look:'Strong: an eligible candidate',
      gone:'Faint: a candidate the conditions leave out',input:'Open circle: a point measured from'});
  // THE CONDITIONS' OWN NUMBER FIRST, because it is the setting on the screen. Stated even where nothing is
  // narrowed, so adding the first condition changes a number already in view rather than making one appear.
  return drawing+said
    +`<p class="standard-result"><strong>${n(eligibleCount)}</strong> of ${n(candidateCount)} `
    +`candidate${candidateCount===1?'':'s'} eligible`
    +(eligibleCount===candidateCount?' (no condition narrows them)':'')+'.</p>'
    +(measured.length
      ?`<p class="standard-result">Nearest <strong>${esc(d(measured[0]!))}</strong>, `
        +`median ${esc(d(measured[Math.floor(measured.length/2)]!))}, `
        +`furthest ${esc(d(measured[measured.length-1]!))}, over ${n(measured.length)} point`
        +`${measured.length===1?'':'s'}.</p>`
      :'')
    // A POINT WITH NO DISTANCE IS THE FINDING: no coordinates of its own, or no eligible candidate left to measure
    // to -- which a condition can cause, and which a table of distances shows only as a gap.
    +(rows.length>measured.length
      ?`<p class="profile-flag">${n(rows.length-measured.length)} of ${n(rows.length)} points get no distance: `
        +`${esc(eligibleCount?'no coordinates of their own':'no candidate is eligible')}.</p>`
      :'');
}

/** MEASURE DISTANCE'S CONFIGURATION DIALOG (experiment 186): the unit, and the conditions a candidate must meet, on a
 *  draft written by Apply. A condition names the candidate's own attribute and the values to match. */
function openDistanceConfig(kit:DistanceKit,nodeId:string){
  const node=getNode(kit.workflow(),nodeId);
  type Draft=WorkflowNode<'measure_distance'>['params'];
  openConfigDialog<Draft>({
    id:'distance-config',widget:'Measure distance',step:node.params.label||TYPES.measure_distance.title,draft:structuredClone(node.params),
    sections:draft=>{
      const conditions=draft.candidateFilter??[];
      const settings=`<div class="field"><label class="field-label" for="distance-unit">Distances in</label><select id="distance-unit">`
        +(['kilometres','metres'] as const).map(u=>`<option value="${u}"${draft.unit===u?' selected':''}>${u}</option>`).join('')+'</select></div>'
        +'<h4 class="field-label">Eligible candidates</h4>'
        +(conditions.length?'<p class="description">An attribute of the candidates, then the values to match, separated by commas. A candidate without that attribute does not match.</p>'
          :'<p class="description">Every candidate is eligible. Add a condition to narrow the search by the candidates’ own attributes.</p>')
        +conditions.map((c,i)=>`<div class="field"><label class="field-label" for="filter-field-${i}">Condition ${i+1}: attribute</label>`
          +`<input id="filter-field-${i}" data-filter-field="${i}" value="${esc(c.field)}">`
          +`<label class="field-label" for="filter-comparator-${i}">Keep candidates whose value</label><select id="filter-comparator-${i}" data-filter-comparator="${i}">`
          +`<option value="in"${c.comparator==='in'?' selected':''}>is one of</option><option value="notIn"${c.comparator==='notIn'?' selected':''}>is not one of</option></select>`
          +`<label class="field-label" for="filter-values-${i}">Values, separated by commas</label><input id="filter-values-${i}" data-filter-values="${i}" value="${esc(c.values.map(String).join(', '))}">`
          +`<button type="button" class="button small" data-filter-remove="${i}">Remove condition</button></div>`).join('')
        +'<button type="button" id="filter-add" class="button small">Add a condition</button>';
      return {settings,preview:distancePreview(kit,node,draft)};
    },
    wire:(root,draft,redraw)=>{
      const list=()=>draft.candidateFilter??(draft.candidateFilter=[]);
      root.querySelector<HTMLSelectElement>('#distance-unit')?.addEventListener('change',e=>{draft.unit=(e.target as HTMLSelectElement).value as Draft['unit'];redraw();});
      root.querySelector('#filter-add')?.addEventListener('click',()=>{list().push({field:'',comparator:'in',values:[]});redraw();});
      root.querySelectorAll<HTMLButtonElement>('[data-filter-remove]').forEach(b=>b.addEventListener('click',()=>{
        list().splice(Number(b.dataset.filterRemove),1);if(!list().length)delete draft.candidateFilter;redraw();}));
      root.querySelectorAll<HTMLInputElement>('[data-filter-field]').forEach(el=>el.addEventListener('change',()=>{list()[Number(el.dataset.filterField)]!.field=el.value.trim();redraw();}));
      root.querySelectorAll<HTMLSelectElement>('[data-filter-comparator]').forEach(el=>el.addEventListener('change',()=>{list()[Number(el.dataset.filterComparator)]!.comparator=el.value as 'in'|'notIn';redraw();}));
      root.querySelectorAll<HTMLInputElement>('[data-filter-values]').forEach(el=>el.addEventListener('change',()=>{
        list()[Number(el.dataset.filterValues)]!.values=el.value.split(',').map(v=>v.trim()).filter(Boolean);redraw();}));
    },
    apply:draft=>{kit.change(w=>{getNode(w,nodeId).params=draft;});},
  },esc);
}

/** MEASURE DISTANCE'S INSPECTOR (experiment 186). Its result is read as a table by Relate, Select rows and Table. */
export const distanceInspector:OwnInspector<'measure_distance'>={
  markup:(n,kitIn)=>{
    const kit=kitIn as DistanceKit,measured=kit.made(n.id),why=kit.unfinished(n.id);
    return kit.section('Name',`<div class="field"><label class="field-label" for="distance-label">Name</label><input id="distance-label" maxlength="60" value="${esc(n.params.label||TYPES.measure_distance.title)}"></div>`)
      +kit.section('Inputs',kit.inputs(n,{points:'Points to measure from',candidates:'Candidates, the nearest of which is found'}))
      +kit.section('Settings',`<p class="standard-sentence">${esc(distanceSentence(kit.workflow(),n))}</p>`
        +'<div class="inspector-actions"><button id="configure-step" class="button primary">Configure…</button></div>')
      +kit.section('Result',`<p class="standard-result${why?' standard-result-warning':''}">${esc(why?`The last run could not compute this step: ${why}`
        :measured?`${measured.rowCount.toLocaleString()} point${measured.rowCount===1?'':'s'} measured; ${measured.missingValueCount.toLocaleString()} with no nearest candidate. A table step after it reads point_id, nearest_id and each candidate's attributes as nearest_<attribute>.`:'Not run yet.')}</p>`);
  },
  wire:(n,kitIn,root)=>{
    const kit=kitIn as DistanceKit;
    root.querySelector('#configure-step')?.addEventListener('click',()=>openDistanceConfig(kit,n.id));
    root.querySelector<HTMLInputElement>('#distance-label')?.addEventListener('change',e=>kit.change(w=>{const v=(e.target as HTMLInputElement).value.trim();
      const p=getNode(w,n.id).params;if(v&&v!==TYPES.measure_distance.title)p.label=v;else delete p.label;}));
  },
};
