/** COMPARE POINT SETS ON THE STANDARD (experiment 186; 2026-11-20, when Comparison map retired into Map). Its name, its
 *  inputs, one sentence of what it compares, the UTM zone in Configure…, and what the last run found. The points go to a
 *  Map and the distances it hands on to a Table. Its Preview draws the two centres (2026-11-28). */
import type {WorkflowNode} from './types.js';
import type {OwnInspector,StepKit} from './inspector-kit.js';
import type {DataTable} from './data-table.js';
import {openConfigDialog} from './config-dialog.js';
import type {PointCollection,Position} from './types.js';
import {comparePointSets} from './point-comparison.js';
import {computeMeanCenter,type MeanCenter} from './mean-center.js';
import {previewDrawing} from './spatial-walkthroughs.js';

type CompareParams=WorkflowNode<'compare_point_sets'>['params'];
export interface CompareKit extends StepKit {
  /** The table of distances the last run made. */
  made:(nodeId:string)=>DataTable|undefined;
  /** The points on one of the step's ports: a layer a step holds, or one a step upstream computed in a run that still
   *  matches the workflow. */
  pointsOn:(nodeId:string,port:string)=>PointCollection|undefined;
}

/** WHAT THE COMPARISON WOULD FIND, DRAWN (2026-11-28). The preview audit's re-review of 2026-11-27 found this dialog with
 *  no Preview at all, and no reason recorded. Everything it compares is reachable while the dialog draws: the original
 *  points and the pumps are held on their steps, and the moved points are what the donut computed in the last run. So
 *  this runs `comparePointSets`, the run's own function. Where two Mean center steps are connected, each centre is
 *  computed as that step computes it, from its own input and its own settings, so a weighted centre is not previewed
 *  as an unweighted one.
 *
 *  Drawn: the pumps as references, the two centres, and the line between them, which is the distance the step's first
 *  row reports. The 250 points themselves are left out of the drawing: drawn, they bury the two centres it is about. */
function comparePreview(kit:CompareKit,n:WorkflowNode<'compare_point_sets'>,params:CompareParams):string{
  const esc=kit.esc;
  const original=kit.pointsOn(n.id,'original'),moved=kit.pointsOn(n.id,'moved'),pumps=kit.pointsOn(n.id,'pumps');
  const missing=[!original&&'the original points',!moved&&'the moved points',!pumps&&'the pumps'].filter(Boolean) as string[];
  if(missing.length)return `<p class="muted">${esc(`${missing.join(', ').replace(/, ([^,]*)$/,' and $1')} ${missing.length===1?'arrives':'arrive'} when the workflow runs, and what this step finds is drawn here then.`).replace(/^./,c=>c.toUpperCase())}</p>`;
  const centreFrom=(port:string):MeanCenter|undefined=>{
    const w=kit.workflow(),e=w.edges.find(x=>x.to===n.id&&x.port===port),up=e&&w.nodes.find(x=>x.id===e.from);
    if(up?.type!=='mean_center')return undefined;
    const input=kit.pointsOn(up.id,'points');
    return input?computeMeanCenter(input,up.params):undefined;
  };
  try{
    const found=comparePointSets(original!,moved!,pumps!,params,
      params.centers?centreFrom('originalCenter'):undefined,params.centers?centreFrom('movedCenter'):undefined);
    const m=(v:number)=>`${v.toLocaleString('en',{maximumFractionDigits:1})} m`;
    const drawing=previewDrawing([
      {kind:'result',rings:[[[found.originalMean,found.movedMean,found.originalMean]]]},
      ...found.pumps.features.filter(f=>f.geometry).map(f=>({kind:'input' as const,point:f.geometry!.coordinates as Position})),
      {kind:'look',point:found.originalMean,label:'Original centre'},
      {kind:'result',point:found.movedMean,label:'Moved centre'}],
      'The two mean centres, the line between them, and the pumps',undefined,
      {input:'Open circle: a pump',look:'Strong: the original mean centre',result:'Filled: the moved mean centre, and the line it moved along'});
    return drawing+`<p class="standard-result">The mean centre would move <strong>${esc(m(found.centerShiftM))}</strong>. `
      +`Nearest pump to the original centre: ${esc(found.originalNearestPump.name)}, ${esc(m(found.originalNearestPump.distanceM))}; `
      +`to the moved centre: ${esc(found.movedNearestPump.name)}, ${esc(m(found.movedNearestPump.distanceM))}. `
      +`Each point moved between ${esc(m(found.displacementBandM.minimum))} and ${esc(m(found.displacementBandM.maximum))}.</p>`;
  }catch(error){return `<p class="muted">This cannot be previewed yet: ${esc(error instanceof Error?error.message:String(error))}</p>`;}
}

export function compareSentence(p:CompareParams):string{
  return `Finds how far the mean centre moved between the original and moved points, and each centre's nearest pump, `
    +`measured in metres in WGS84 / UTM zone ${p.zone}${p.hemisphere==='north'?'N':'S'}`
    +(p.centers?', from the two Mean center steps connected':'')+'. The original locations stay private: keep them out of anything shared.';
}

export const compareInspector:OwnInspector<'compare_point_sets'>={
  markup:(n,kit)=>{const k=kit as CompareKit,p=n.params,esc=kit.esc;
    const made=k.made(n.id),why=k.unfinished(n.id);
    const moved=made?.rows.find(r=>r.key.measure==='mean centre moved')?.value;
    const line=made&&typeof moved==='number'?`The mean centre moved ${moved.toLocaleString('en')} m. ${made.rows.length} distances, for a Table output.`
      :why?`The last run could not compute this step: ${why}`:'Not run yet.';
    return kit.section('Name',kit.name('compare-label',p.label||'Compare point sets'))
      +kit.section('Inputs',kit.inputs(n,{original:'Original points',moved:'Moved points',pumps:'Pumps, for reference',
        originalCenter:'Original mean centre',movedCenter:'Moved mean centre'}))
      +kit.section('Settings',`<p class="standard-sentence">${esc(compareSentence(p))}</p>`
        +'<div class="inspector-actions"><button id="configure-step" class="button primary">Configure…</button></div>')
      +kit.section('Result',`<p class="standard-result${why?' standard-result-warning':''}">${esc(line)}</p>`);},
  wire:(n,kit,root)=>{
    root.querySelector('#configure-step')?.addEventListener('click',()=>{
      const node=kit.workflow().nodes.find(x=>x.id===n.id);if(node?.type!=='compare_point_sets')return;
      const esc=kit.esc;
      openConfigDialog<{zone:string;hemisphere:'north'|'south'}>({id:'compare-config',widget:'Compare point sets',step:node.params.label||'Compare point sets',
        draft:{zone:String(node.params.zone),hemisphere:node.params.hemisphere},
        sections:d=>{const zone=Number(d.zone),ok=Number.isInteger(zone)&&zone>=1&&zone<=60;
          return {settings:'<p class="description">Distances are measured in metres, in the UTM zone the points lie in. '
            +'Each Mean center step connected must use the same zone.</p>'
            +`<div class="field"><label class="field-label" for="comparison-zone">WGS84 UTM zone</label><input id="comparison-zone" type="number" min="1" max="60" value="${esc(d.zone)}"></div>`
            +`<div class="field"><label class="field-label" for="comparison-hemisphere">Hemisphere</label><select id="comparison-hemisphere">`
            +`<option value="north"${d.hemisphere==='north'?' selected':''}>North</option><option value="south"${d.hemisphere==='south'?' selected':''}>South</option></select></div>`,
            preview:ok?comparePreview(kit as CompareKit,node,{...node.params,zone,hemisphere:d.hemisphere}):'',
            ...(ok?{}:{message:{tone:'refusal' as const,text:'Choose a UTM zone from 1 to 60.'},blocked:true})};},
        wire:(root2,d,redraw)=>{
          root2.querySelector<HTMLInputElement>('#comparison-zone')?.addEventListener('change',e=>{d.zone=(e.target as HTMLInputElement).value;redraw();});
          root2.querySelector<HTMLSelectElement>('#comparison-hemisphere')?.addEventListener('change',e=>{d.hemisphere=(e.target as HTMLSelectElement).value==='south'?'south':'north';redraw();});},
        apply:d=>kit.change(w=>{const t=w.nodes.find(x=>x.id===n.id);if(t?.type==='compare_point_sets'){t.params.zone=Number(d.zone);t.params.hemisphere=d.hemisphere;}}),
      },esc);
    });
  },
};
