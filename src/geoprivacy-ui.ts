/** THE TWO GEOPRIVACY STEPS ON THE STANDARD (experiment 186), 2026-11-22: Move points in a donut and Aggregate points to H3
 *  cells, moved out of app.ts by the rule for any widget touched. Name, Inputs, Settings in one sentence with Configure…,
 *  Result. Both are teaching transformations: each sentence says it is no anonymity guarantee. */
import type {WorkflowNode} from './types.js';
import type {InspectorKit,OwnInspector} from './inspector-kit.js';
import type {AreaStepKit} from './area-steps-ui.js';
import {openConfigDialog} from './config-dialog.js';
import {validatePrivacyNode,moveDonut,aggregateHex} from './geoprivacy.js';
import {errorMessage} from './guards.js';
import {SHOW_ME,showMeIn} from './table-walkthrough.js';
import {donutWalkthrough,h3Walkthrough,previewDrawing,classedScale} from './spatial-walkthroughs.js';
import {latLngToCell} from 'h3-js';

const sentence=(kit:InspectorKit,text:string)=>`<p class="standard-sentence">${kit.esc(text)}</p>`;
const configure='<div class="inspector-actions"><button id="configure-step" class="button primary">Configure…</button></div>';

/** WHAT THE STEP WOULD MAKE OF THE POINTS IT HAS, computed with the step's OWN functions (2026-11-24).
 *
 *  Five Configure dialogs offered "Show me how it works" and nothing else under Preview, so the section was a
 *  heading and a button. The practitioner met four of them in turn -- Voronoi catchments, Convex hull, Move points
 *  in a donut, Aggregate points to H3 cells -- each time: *"This one also has no Preview."*
 *
 *  A made-up example explains the method; it says nothing about THIS workflow's points. These run `moveDonut` and
 *  `aggregateHex` on the points actually connected, so the Preview cannot show something the step would not do --
 *  the rule `relate-walkthrough.ts` already states for its last step.
 *
 *  SAID WHERE THERE IS NOTHING TO COMPUTE, rather than left blank: an empty Preview reads as a broken dialog, which
 *  is the objection `area-steps-ui.ts` records under "SAID, NOT SWALLOWED". */
const waitingForPoints='<p class="muted">Connect the points, and what this step would make of them is counted here.</p>';
/** The points arriving on a port, as a collection the step's own functions take. `pointChoices` is the one reader of
 *  a port that sees a layer an upstream step COMPUTED as well as one stored on a node. */
const pointsOn=(kit:InspectorKit,nodeId:string):import('./types.js').PointCollection|null=>{
  // THE WHOLE LAYER where the source holds it (2026-11-28): the picker's features stop at 500, so a larger layer was
  // counted, and would have been drawn, from its first 500 points. The picker remains the way to a computed layer.
  const records=(kit as AreaStepKit).recordsOn(nodeId,'points');
  const own=records?.features.filter(f=>f.geometry&&Array.isArray(f.geometry.coordinates));
  if(own?.length)return {type:'FeatureCollection',features:own};
  const {features}=(kit as AreaStepKit).pointChoices(nodeId,'points');
  const placed=features.filter(f=>f.geometry&&Array.isArray(f.geometry.coordinates));
  if(!placed.length)return null;
  return {type:'FeatureCollection',features:placed.map((f,i)=>({type:'Feature',id:`p${i+1}`,
    properties:{name:f.name},geometry:f.geometry}))} as unknown as import('./types.js').PointCollection;
};
const where=(f:{geometry?:unknown})=>(f.geometry as {coordinates:import('./types.js').Position}).coordinates;
const previewFailed=(kit:InspectorKit,error:unknown)=>
  `<p class="muted">This cannot be previewed yet: ${kit.esc(error instanceof Error?error.message:String(error))}</p>`;

function donutPreview(kit:InspectorKit,n:WorkflowNode,params:WorkflowNode<'donut_geomask'>['params']):string{
  const input=pointsOn(kit,n.id);
  if(!input)return waitingForPoints+SHOW_ME;
  try{
    const before=input.features;
    const moved=moveDonut(input,params);
    // MEASURED, NOT PROMISED: the ring is what the settings ask for, and this is how far the points actually went.
    const metres=moved.features.map((f,i)=>{
      const a=before[i]?.geometry?.coordinates as [number,number]|undefined,b=f.geometry?.coordinates as [number,number]|undefined;
      if(!a||!b)return 0;
      const lat=(a[1]+b[1])/2*Math.PI/180;
      return Math.hypot((b[0]-a[0])*111320*Math.cos(lat),(b[1]-a[1])*110540);
    }).filter(d=>d>0).sort((x,y)=>x-y);
    if(!metres.length)return waitingForPoints+SHOW_ME;
    const at=(q:number)=>metres[Math.min(metres.length-1,Math.floor(q*metres.length))]!;
    const m=(v:number)=>`${Math.round(v).toLocaleString('en')} m`;
    // DRAWN (2026-11-28), as Show me how ends: where each point was, faint, and where this seed moves it. Listed by the
    // preview audit's re-review of 2026-11-27 as numbers with no reason recorded for not drawing.
    const drawing=previewDrawing([
      ...before.map(f=>({kind:'gone' as const,point:where(f)})),
      ...moved.features.filter(f=>f.geometry).map(f=>({kind:'result' as const,point:where(f)}))],
      'Where the points were, and where this step would move them',undefined,
      {gone:'Faint: where each point was',result:'Filled: where this seed moves it'});
    return drawing+`<p class="standard-result"><strong>${moved.features.length.toLocaleString('en')} points would move.</strong> `
      +`Nearest ${kit.esc(m(at(0)))}, middle ${kit.esc(m(at(0.5)))}, furthest ${kit.esc(m(metres[metres.length-1]!))}, `
      +`with this seed. Each keeps a new name and id, and nothing else of the record.</p>`+SHOW_ME;
  }catch(error){return previewFailed(kit,error)+SHOW_ME;}
}

function hexPreview(kit:InspectorKit,n:WorkflowNode,params:WorkflowNode<'aggregate_points_to_h3_cell'>['params']):string{
  const input=pointsOn(kit,n.id);
  if(!input)return waitingForPoints+SHOW_ME;
  try{
    const features=input.features;
    const cells=aggregateHex(input,params);
    const kept=cells.features.length;
    const held=cells.features.reduce((t,f)=>t+(f.count??0),0);
    const left=features.length-held;
    // DRAWN (2026-11-28), as Show me how ends: the cells kept, shaded by their count on Map's scale, and the points in
    // the cells left out, faint. Listed by the re-review of 2026-11-27 as numbers with no reason for not drawing.
    const keptCells=new Set(cells.features.map(f=>String(f.id)));
    const out=features.filter(f=>{const [lon,lat]=where(f);return !keptCells.has(latLngToCell(lat,lon,params.resolution));});
    const scaled=classedScale(cells.features);
    const drawing=cells.features.length||out.length?previewDrawing([
      ...cells.features.map(f=>({kind:'result' as const,rings:[(f.geometry as {coordinates:import('./types.js').Position[][]}).coordinates],...(scaled?{fill:scaled.fill(f)}:{})})),
      ...out.map(f=>({kind:'gone' as const,point:where(f)}))],
      'The cells this step would keep, shaded by their count, and the points left out',
      scaled?{title:cells.valueName??'Points in the cell',entries:scaled.scale}:undefined,
      {gone:'Faint: a point in a cell left out'}):'';
    // THE POINTS LEFT OUT ARE THE FINDING. A minimum occupancy is a disclosure control, and how much it withholds is
    // the thing to judge before applying it -- not after a run.
    return drawing+`<p class="standard-result"><strong>${kept.toLocaleString('en')} cells would be shown</strong>, `
      +`holding ${held.toLocaleString('en')} of ${features.length.toLocaleString('en')} points. `
      +(left>0?`${left.toLocaleString('en')} ${left===1?'point falls':'points fall'} in cells with fewer than `
        +`${params.minOccupancy.toLocaleString('en')}, and ${left===1?'is':'are'} left out.`
        :'Every point is in a cell that meets the minimum.')+'</p>'+SHOW_ME;
  }catch(error){return previewFailed(kit,error)+SHOW_ME;}
}
const notRun='<p class="notice">Not run yet, or changed since the last run.</p>';
const row=(kit:InspectorKit,label:string,value:string)=>`<div class="detail-row"><span>${kit.esc(label)}</span><strong>${kit.esc(value)}</strong></div>`;
const nodeIn=<T extends WorkflowNode['type']>(kit:InspectorKit,n:WorkflowNode<T>)=>kit.workflow().nodes.find(x=>x.id===n.id) as WorkflowNode<T>|undefined;
const kept=(kit:InspectorKit,n:WorkflowNode)=>(kit as AreaStepKit).summary(n.id)?.features;
const NOTEBOOKS='<p class="muted">Calibrating a mask to a stated risk is not done here. The <a href="https://git.cdc.gov/jupyterlite/2026-Map-Encryption-Library" target="_blank" rel="noopener noreferrer">geoprivacy notebooks</a> go further.</p>';
function refusal(check:()=>void):{blocked?:boolean;message?:{tone:'refusal';text:string}}{
  try{check();return {};}catch(error){return {blocked:true,message:{tone:'refusal',text:errorMessage(error)}};}
}
const field=(kit:InspectorKit,id:string,label:string,value:string,min:number,max:number,hint='')=>
  `<div class="field"><label class="field-label" for="${id}">${label}</label><input id="${id}" type="number" min="${min}" max="${max}" step="1" value="${kit.esc(value)}">${hint?`<small>${hint}</small>`:''}</div>`;

interface DonutDraft {innerM:string;outerM:string;seed:string}
export const donutInspector:OwnInspector<'donut_geomask'>={
  markup:(n,kit)=>{const p=n.params,out=kept(kit,n);
    return kit.section('Name',kit.name('donut-label',p.label||'Move points in a donut'))
      +kit.section('Inputs',kit.inputs(n,{points:'The points to move'}))
      +kit.section('Settings',sentence(kit,`Moves each point in a random direction, between ${p.innerM.toLocaleString('en')} and ${p.outerM.toLocaleString('en')} m from where it was, `
        +'and gives it a new name and id; nothing else of the record is carried. A teaching transformation, not a privacy guarantee.')+configure)
      +kit.section('Result',out!==undefined?row(kit,'Points moved',Number(out).toLocaleString('en')):notRun);},
  wire:(n,kit,root)=>{
    root.querySelector('#configure-step')?.addEventListener('click',()=>{
      const node=nodeIn(kit,n);if(!node)return;const p=node.params;
      const params=(d:DonutDraft)=>({...p,innerM:Number(d.innerM),outerM:Number(d.outerM),seed:Number(d.seed)});
      openConfigDialog<DonutDraft>({id:'donut-dialog',widget:'Move points in a donut',step:p.label||'',
        draft:{innerM:String(p.innerM),outerM:String(p.outerM),seed:String(p.seed)},
        sections:d=>({settings:field(kit,'donut-inner','Least distance moved (metres)',d.innerM,0,5000)
          +field(kit,'donut-outer','Most distance moved (metres)',d.outerM,1,5000)
          +field(kit,'donut-seed','Seed',d.seed,0,4294967295,'The same seed moves the same points the same way, so a run can be repeated. Predictable, so not for real protection.')
          +NOTEBOOKS,preview:donutPreview(kit,n,params(d)),
          ...refusal(()=>validatePrivacyNode({...node,params:params(d)}))}),
        wire:(r,d,redraw)=>{
          for(const [id,key] of [['donut-inner','innerM'],['donut-outer','outerM'],['donut-seed','seed']] as const)
            r.querySelector<HTMLInputElement>(`#${id}`)!.onchange=e=>{d[key]=(e.target as HTMLInputElement).value;redraw();};
          showMeIn(r,kit.esc,()=>donutWalkthrough(Number(d.innerM),Number(d.outerM),Number(d.seed)));},
        apply:d=>kit.change(w=>{const t=w.nodes.find(x=>x.id===n.id);if(t?.type==='donut_geomask')Object.assign(t.params,params(d));}),
      },kit.esc);
    });
  },
};

interface HexDraft {resolution:string;minOccupancy:string}
export const h3Inspector:OwnInspector<'aggregate_points_to_h3_cell'>={
  markup:(n,kit)=>{const p=n.params,out=kept(kit,n);
    return kit.section('Name',kit.name('h3-label',p.label||'Aggregate points to H3 cells'))
      +kit.section('Inputs',kit.inputs(n,{points:'The points to count'}))
      +kit.section('Settings',sentence(kit,`Counts the points in each H3 cell at resolution ${p.resolution}, and leaves out any cell holding fewer than ${p.minOccupancy}. `
        +'It counts locations, not what they carry. A teaching transformation, not a privacy guarantee.')+configure)
      +kit.section('Result',out!==undefined?row(kit,'Cells kept',Number(out).toLocaleString('en')):notRun);},
  wire:(n,kit,root)=>{
    root.querySelector('#configure-step')?.addEventListener('click',()=>{
      const node=nodeIn(kit,n);if(!node)return;const p=node.params;
      const params=(d:HexDraft)=>({...p,resolution:Number(d.resolution),minOccupancy:Number(d.minOccupancy)});
      openConfigDialog<HexDraft>({id:'h3-dialog',widget:'Aggregate points to H3 cells',step:p.label||'',
        draft:{resolution:String(p.resolution),minOccupancy:String(p.minOccupancy)},
        sections:d=>({settings:field(kit,'h3-resolution','H3 resolution (0 coarsest, 15 finest)',d.resolution,0,15,'Resolution 9 cells are about 0.1 km², resolution 7 about 5 km².')
          +field(kit,'h3-min','Fewest points a cell must hold to be shown',d.minOccupancy,2,100,'A cell with fewer is left out. Holding many points does not by itself make a cell safe to share.')
          +NOTEBOOKS,preview:hexPreview(kit,n,params(d)),
          ...refusal(()=>validatePrivacyNode({...node,params:params(d)}))}),
        wire:(r,d,redraw)=>{
          for(const [id,key] of [['h3-resolution','resolution'],['h3-min','minOccupancy']] as const)
            r.querySelector<HTMLInputElement>(`#${id}`)!.onchange=e=>{d[key]=(e.target as HTMLInputElement).value;redraw();};
          showMeIn(r,kit.esc,()=>h3Walkthrough(Number(d.resolution),Number(d.minOccupancy)));},
        apply:d=>kit.change(w=>{const t=w.nodes.find(x=>x.id===n.id);if(t?.type==='aggregate_points_to_h3_cell')Object.assign(t.params,params(d));}),
      },kit.esc);
    });
  },
};

export const GEOPRIVACY_INSPECTORS={donut_geomask:donutInspector,aggregate_points_to_h3_cell:h3Inspector} as const;
