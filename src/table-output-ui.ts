/** TABLE OUTPUT, OUT OF APP.TS (2026-11-22, the Inspector move's batch D): its standard Inspector -- the Results tab's name and
 *  where its figure goes in the write-up, what is connected and one picker to connect more, one sentence and Configure…,
 *  and what the last run showed -- its sentence and its dialog. Moved as they were; the controls it shares with Map (the
 *  name, the write-up section, the port pickers) are still wired where Map's are. Its older "Input mode" branch, from
 *  before what is wired decided the mode, is retired: the standard Inspector shows a polygon table as it shows any. */
import type {WorkflowNode,Workflow} from './types.js';
import type {OwnInspector,StepKit} from './inspector-kit.js';
import {openConfigDialog} from './config-dialog.js';
import {nodeInputs,portAccepts,outputOf,shownMode} from './core.js';
import {MAX_POINT_LAYERS} from './point-layers.js';
import {zoneFields,wireZone,type ZoneAdvice} from './metric-steps-ui.js';
import {projectFromCRS84} from './reproject.js';
import {shownRows,dataTableMarkup,wideFrame} from './data-table-ui.js';
import type {DataTable} from './data-table.js';
import {isProjectedReference,type PointCollection,type AnySpatialReference} from './types.js';
import {presentCell,presentedTable,presentationFields,headingMarks,noteNumbers,type TablePresentation,type PresentableColumn,type ColumnPresentation} from './table-presentation.js';

export interface TableOutputKit extends StepKit {
  /** The unit the table's rows state, where they state one, so the totals claim is not offered over it. */
  unitFor:(n:WorkflowNode)=>string|undefined;
  /** The control saying where the figure goes in the write-up, shared by Map, Table and Chart. */
  writeUpSelect:(n:WorkflowNode<'table_output'>)=>string;
  /** A change of presentation only: the run stays current. */
  presentation:(edit:(w:Workflow)=>void)=>void;
  /** Redraw the figures in Results. */
  renderResults:()=>void;
  /** Whether the last run showed this table. */
  shown:(nodeId:string)=>boolean;
  /** The UTM zone the workflow's coordinates suggest, for coordinates shown in metres. */
  zoneAdvice:ZoneAdvice;
  /** The point records on one of the table's ports: held by Point data, or made by a run that still matches. */
  layerOn:(nodeId:string,port:string)=>PointCollection|undefined;
  /** What this table's last run showed, where it ran. */
  ranOutput:(nodeId:string)=>{kind?:string}|undefined;
}

/** Connects the Presentation section's controls to the draft. */
function wirePresentation(root:ParentNode,p:TablePresentation,redraw:()=>void):void{
  const text=(id:string,key:'caption'|'notes'|'source')=>root.querySelector<HTMLInputElement|HTMLTextAreaElement>(`#${id}`)
    ?.addEventListener('change',e=>{const v=(e.target as HTMLInputElement).value.trim();if(v)p[key]=v;else delete p[key];redraw();});
  text('present-caption','caption');text('present-notes','notes');text('present-source','source');
  root.querySelector<HTMLSelectElement>('#present-decimals')?.addEventListener('change',e=>{const v=(e.target as HTMLSelectElement).value;
    if(v==='')delete p.decimals;else p.decimals=Number(v);redraw();});
  root.querySelector<HTMLInputElement>('#present-separators')?.addEventListener('change',e=>{
    if((e.target as HTMLInputElement).checked)delete p.separators;else p.separators=false;redraw();});
  root.querySelector<HTMLSelectElement>('#present-absent')?.addEventListener('change',e=>{const v=(e.target as HTMLSelectElement).value as NonNullable<TablePresentation['absent']>;
    if(v==='dash')delete p.absent;else p.absent=v;redraw();});
  root.querySelector<HTMLInputElement>('#present-shade')?.addEventListener('change',e=>{
    if((e.target as HTMLInputElement).checked)p.shade=true;else delete p.shade;redraw();});
}

/** Connects the column and small-count controls to the draft. Each setting cleared is removed, so an unset table saves
 *  nothing. */
function wireColumnPresentation(root:ParentNode,p:TablePresentation,redraw:()=>void,
  /** A threshold typed that cannot be used, or undefined: kept apart from Off, so Apply can refuse it. */
  typed:(raw:string|undefined)=>void=()=>{}):void{
  const set=(column:string,key:keyof ColumnPresentation,value:string|number|undefined)=>{
    const columns={...(p.columns??{})},one={...(columns[column]??{})};
    if(value===undefined||value==='')delete one[key];else (one as Record<string,unknown>)[key]=value;
    if(Object.keys(one).length)columns[column]=one;else delete columns[column];
    if(Object.keys(columns).length)p.columns=columns;else delete p.columns;};
  root.querySelectorAll<HTMLTableRowElement>('.present-columns tr[data-column]').forEach(row=>{
    const column=row.dataset.column!;
    row.querySelector<HTMLSelectElement>('[data-col-decimals]')?.addEventListener('change',e=>{const v=(e.target as HTMLSelectElement).value;set(column,'decimals',v===''?undefined:Number(v));redraw();});
    row.querySelector<HTMLInputElement>('[data-col-unit]')?.addEventListener('change',e=>{set(column,'unit',(e.target as HTMLInputElement).value.trim());redraw();});
    row.querySelector<HTMLInputElement>('[data-col-note]')?.addEventListener('change',e=>{set(column,'note',(e.target as HTMLInputElement).value.trim());redraw();});
    row.querySelector<HTMLSelectElement>('[data-col-pair]')?.addEventListener('change',e=>{const v=(e.target as HTMLSelectElement).value;
      const pairs=(p.pairs??[]).filter(x=>x.count!==column&&x.percent!==column&&(!v||(x.count!==v&&x.percent!==v)));
      if(v)pairs.push({count:column,percent:v});
      if(pairs.length)p.pairs=pairs;else delete p.pairs;redraw();});
  });
  const below=root.querySelector<HTMLInputElement>('#present-suppress-below');
  const reason=root.querySelector<HTMLSelectElement>('#present-suppress-reason');
  const columnsChecked=()=>[...root.querySelectorAll<HTMLInputElement>('[data-suppress-column]')].filter(x=>x.checked).map(x=>x.dataset.suppressColumn!);
  // AN UNUSABLE NUMBER IS NOT OFF (review of #8): 1, typed over a saved 5, had turned hiding off and shown the counts it
  // hid. Only an empty box turns it off; anything else that is not a whole number from 2 to 1,000 keeps the rule as it was
  // and is held, as typed, for Apply to refuse.
  const update=()=>{const raw=below?.value.trim()??'',n=Number(raw);
    if(!raw){delete p.suppress;typed(undefined);}
    else if(Number.isInteger(n)&&n>=2&&n<=1000){p.suppress={below:n,columns:columnsChecked(),reason:(reason?.value??'confidentiality') as 'confidentiality'|'reliability'};typed(undefined);}
    else typed(raw);
    redraw();};
  below?.addEventListener('change',update);reason?.addEventListener('change',update);
  root.querySelectorAll<HTMLInputElement>('[data-suppress-column]').forEach(x=>x.addEventListener('change',update));
}


/** THE TABLE ITSELF, IN THE DIALOG (the practitioner, 2026-11-27: "Table output config dialog should have a preview of the
 *  table", and: "preview should be limited to 10-20 rows (option to display, for review purpose)"): the rows Results will
 *  show, as the Presentation section and the coordinates now set them, before Apply. Ten rows, or twenty, or all of
 *  them to review. */
export const PREVIEW_CHOICES=[10,20] as const;
function tablePreview(kit:TableOutputKit,node:WorkflowNode<'table_output'>,mode:ReturnType<typeof shownMode>,
  coord:{metres:boolean;zone:string;hemisphere:'north'|'south'},present:TablePresentation,rowsShown:number|'all',totals:boolean):string{
  const esc=kit.esc;
  const choose=(total:number)=>`<div class="field preview-rows"><label class="field-label" for="preview-rows">Rows in the preview</label>`
    +`<select id="preview-rows">${PREVIEW_CHOICES.map(n=>`<option value="${n}"${rowsShown===n?' selected':''}>${n}</option>`).join('')}`
    +`<option value="all"${rowsShown==='all'?' selected':''}>All ${total.toLocaleString('en')}, to review</option></select></div>`;
  const table=(head:{label:string;number:boolean}[],rows:string[],total:number)=>{
    const names=head.map(h=>h.label),numbers=noteNumbers(present,names);
    return choose(total)+`<p class="muted">${total.toLocaleString('en')} ${total===1?'row':'rows'}${total>rows.length?`, the first ${rows.length.toLocaleString('en')} shown`:''}.</p>`
    +presentedTable(present,node.params.label||kit.title('table_output'),
      `<div class="table-scroll" tabindex="0" role="region" aria-label="Preview of the table"><table class="table-standard"><thead><tr>`
      +head.map(h=>`<th scope="col"${h.number?' class="number"':''}>${esc(h.label)}${headingMarks(h.label,present,esc,numbers)}</th>`).join('')+`</tr></thead><tbody>`
      +rows.join('')+'</tbody></table></div>',esc,names);};
  const limit=(n:number)=>rowsShown==='all'?n:Math.min(n,rowsShown);
  // A DATA TABLE DRAWN BY RESULTS' OWN RENDERER (PR 10's review: "Show totals" changed Results and not the preview), with
  // the draft's totals, the presentation and the rows asked for, and no pager.
  const dataTablePreview=(t:DataTable)=>{
    const total=shownRows(t,totals);
    const shown=dataTableMarkup(t,esc,{assertTotals:totals,present,limit:limit(total)})
      .replace(/<table class="/g,'<table class="table-standard ').replace(/<table>/g,'<table class="table-standard">')
      .replace(/<div class="table-scroll/g,'<div tabindex="0" role="region" aria-label="Preview of the table" class="table-scroll');
    return choose(total)+presentedTable(present,node.params.label||kit.title('table_output'),
      shown.includes('table-scroll')?shown:`<div class="table-scroll" tabindex="0" role="region" aria-label="Preview of the table">${shown}</div>`,esc,
      dataTableColumns(t).map(c=>c.name));
  };
  if(mode==='table'){
    const t=kit.tableOn(node.id,'table');
    if(!t?.rows.length)return '<p class="muted">Nothing to show yet: the table connected has no rows. Run the workflow if a step makes it.</p>';
    return dataTablePreview(t);
  }
  // A POLYGON TABLE'S ROWS ARE THE RUN'S: each area with what was summarized over it, as the last run left them.
  if(mode==='polygons'){
    const ran=kit.ranOutput(node.id);
    if(ran?.kind==='data-table')return dataTablePreview(ran as unknown as DataTable);
    const rows=(ran as {rows?:{name:string;attributes?:Record<string,unknown>}[]}|undefined)?.rows;
    if(!rows?.length)return '<p class="muted">Each polygon layer connected, one row per area, with its summaries. Run the workflow to see them here.</p>';
    const attributes=[...new Set(rows.flatMap(r=>Object.keys(r.attributes??{})))].filter(k=>k!=='name');
    const head=[{label:'Area',number:false},...attributes.map(k=>({label:k,number:rows.some(r=>typeof r.attributes?.[k]==='number')}))];
    return table(head,rows.slice(0,limit(rows.length)).map(r=>`<tr>${presentCell(r.name,'Area',present,esc,{measure:false})}`
      +attributes.map(k=>presentCell(r.attributes?.[k],k,present,esc)).join('')+'</tr>'),rows.length);
  }
  const layers=nodeInputs(node).filter(([,type])=>type==='points').map(([port])=>kit.layerOn(node.id,port)).filter((c):c is PointCollection=>!!c);
  if(!layers.length)return '<p class="muted">Nothing to show yet: connect point records, or run the workflow if a step makes them.</p>';
  const zone=Number(coord.zone);
  if(coord.metres&&(!Number.isInteger(zone)||zone<1||zone>60))return '<p class="muted">Choose a UTM zone from 1 to 60 to see the coordinates in metres.</p>';
  // A run's layer can arrive already in metres, read from a UTM file; a saved one is always longitude and latitude.
  const projected=(c:PointCollection)=>isProjectedReference((c as {spatialReference?:AnySpatialReference}).spatialReference);
  let shown:PointCollection[];
  try{shown=layers.map(c=>coord.metres&&!projected(c)&&c.features.length?projectFromCRS84(c,zone,coord.hemisphere).collection:c);}
  catch(e){return `<p class="muted">${esc(e instanceof Error?e.message:'These records cannot be shown in metres.')}</p>`;}
  const inMetres=(c:PointCollection)=>coord.metres||projected(c);
  const features=shown.flatMap(c=>c.features.map(f=>({f,metres:inMetres(c)})));
  const attributes=[...new Set(features.flatMap(({f})=>Object.keys(f.properties??{})))].filter(k=>k!=='name');
  const anyMetres=features.some(x=>x.metres);
  const numericAttribute=(k:string)=>features.some(({f})=>typeof f.properties?.[k]==='number');
  const head=[{label:'Record',number:false},{label:anyMetres?'Easting (m)':'Longitude (°)',number:true},{label:anyMetres?'Northing (m)':'Latitude (°)',number:true},
    ...attributes.map(k=>({label:k,number:numericAttribute(k)}))];
  const rows=features.slice(0,limit(features.length)).map(({f,metres})=>{const at=f.geometry?.coordinates as [number,number]|undefined;
    const coordinate=(v:number|undefined)=>v===undefined?presentCell(null,'',present,esc):`<td class="number">${(metres?v.toFixed(1):v.toFixed(6))}</td>`;
    return `<tr>${presentCell((f.properties as {name?:unknown}|null)?.name??f.id??'','Record',present,esc,{measure:false})}`
      +coordinate(at?.[0])+coordinate(at?.[1])+attributes.map(k=>presentCell(f.properties?.[k],k,present,esc)).join('')+'</tr>';});
  return table(head,rows,features.length);
}

/** A DATA TABLE'S COLUMNS AS RESULTS SHOWS THEM: the wide frame's subject, attributes and measures where it widens, else
 *  its keys and value; each with its declared unit, where its meaning is not already written beside it. */
export function dataTableColumns(t:DataTable):PresentableColumn[]{
  const unitOf=(c:string)=>t.headings?.[c]?undefined:t.columns?.[c]?.confirmed?t.columns[c]!.unit:undefined;
  const frame=wideFrame(t);
  const named=(name:string,number:boolean)=>({name,number,...unitOf(name)?{declaredUnit:unitOf(name)!}:{}});
  if(frame)return [named(frame.subject,false),...frame.attributes.map(a=>named(a,false)),...frame.columns.map(c=>named(c,true))];
  return [...t.keys.map(k=>named(k,false)),named(t.valueField,true)];
}
/** THE COLUMNS CONFIGURE… OFFERS, as the preview draws them. */
function columnsShown(kit:TableOutputKit,node:WorkflowNode<'table_output'>,mode:ReturnType<typeof shownMode>):PresentableColumn[]{
  if(mode==='table'){const t=kit.tableOn(node.id,'table');return t?.rows.length?dataTableColumns(t):[];}
  if(mode==='polygons'){
    const ran=kit.ranOutput(node.id);
    if(ran?.kind==='data-table')return dataTableColumns(ran as unknown as DataTable);
    const rows=(ran as {rows?:{attributes?:Record<string,unknown>}[]}|undefined)?.rows??[];
    return [...new Set(rows.flatMap(r=>Object.keys(r.attributes??{})))].filter(k=>k!=='name')
      .map(k=>({name:k,number:rows.some(r=>typeof r.attributes?.[k]==='number')}));
  }
  const features=nodeInputs(node).filter(([,type])=>type==='points').map(([port])=>kit.layerOn(node.id,port)).flatMap(c=>c?.features??[]);
  return [...new Set(features.flatMap(f=>Object.keys(f.properties??{})))].filter(k=>k!=='name')
    .map(k=>({name:k,number:features.some(f=>typeof f.properties?.[k]==='number')}));
}

/** WHAT A TABLE OUTPUT SHOWS, in one sentence, from what is wired. */
export function tableOutputSentence(kit:TableOutputKit,n:WorkflowNode<'table_output'>,mode:ReturnType<typeof shownMode>):string{
  const workflow=kit.workflow();const from=(port:string)=>{const e=workflow.edges.find(x=>x.to===n.id&&x.port===port);const up=e&&workflow.nodes.find(m=>m.id===e.from);
    return up?(up.params.label||kit.title(up.type)):'';};
  if(mode==='table')return `Shows the rows of ${from('table')||'the table connected'} as they stand${n.params.totalsAsserted?', with totals you asserted':''}.`;
  if(mode==='polygons')return 'Shows the polygon layers connected and their summaries.';
  const c=n.params.coordinates;
  return workflow.edges.some(e=>e.to===n.id)?`Shows the point records connected, with ${c?`their coordinates in metres, as easting and northing in UTM zone ${c.zone}${c.hemisphere==='north'?'N':'S'},`:'their longitude and latitude'} and every attribute.`
    :'Nothing is connected yet, so this table has nothing to show.';
}

/** TABLE'S CONFIGURATION DIALOG (experiment 186): how a reasoning result is shown, and the totals claim. Both on a draft,
 *  written by Apply. Turning a reasoning table into a map or a chart changes the step itself. */
function openTableConfig(kit:TableOutputKit,nodeId:string){
  const esc=kit.esc,workflow=kit.workflow(),node=workflow.nodes.find(x=>x.id===nodeId) as WorkflowNode<'table_output'>|undefined;if(!node)return;
  type Draft=WorkflowNode<'table_output'>['params']&{view?:'map'|'table'|'bars';coord:{metres:boolean;zone:string;hemisphere:'north'|'south'};present:TablePresentation;rowsShown:number|'all';typedThreshold?:string};
  const mode=shownMode(node,workflow.edges);
  const points=mode!=='table'&&mode!=='polygons';
  const held=node.params.coordinates,suggested=kit.zoneAdvice(30,'north');
  openConfigDialog<Draft>({
    id:'table-config',widget:'Table',step:node.params.label||kit.title('table_output'),draft:{...structuredClone(node.params),present:structuredClone(node.params.presentation??{}),rowsShown:10,coord:{metres:!!held,zone:String(held?.zone??suggested?.zone??30),hemisphere:held?.hemisphere??suggested?.hemisphere??'north'}},
    sections:draft=>{
      let settings='';
      // THE MARGINS AN EPIDEMIOLOGIST READS FIRST, and the claim that earns them (2026-10-26). Offered only for a table,
      // and only where the table does not already state its unit.
      if(mode==='table'&&!kit.unitFor(node))settings+=`<label class="check"><input type="checkbox" id="output-totals" ${draft.totalsAsserted?'checked':''}> Show totals: these values count the same thing</label>`
        +'<p class="description">Tick it only where every cell counts the same thing.</p>';
      // COORDINATES IN METRES, where a partner or a lesson wants easting and northing: what Reproject points did as a step
      // until it retired into this choice (0.169.0).
      if(points)settings+=`<div class="field"><label class="field-label" for="output-coordinates">Coordinates</label>`
        +`<select id="output-coordinates"><option value="degrees"${draft.coord.metres?'':' selected'}>Longitude and latitude, as recorded</option>`
        +`<option value="metres"${draft.coord.metres?' selected':''}>In metres: easting and northing in a UTM zone</option></select></div>`
        +(draft.coord.metres?zoneFields(kit,draft.coord,'output'):'');
      if(!settings)settings='<p class="muted">Nothing to set: what you connect decides how it is shown.</p>';
      return {settings,presentation:presentationFields(draft.present,node.params.label||kit.title('table_output'),esc,columnsShown(kit,node,mode),
        mode==='table'||(mode==='polygons'&&kit.ranOutput(node.id)?.kind==='data-table'),draft.typedThreshold),
        ...(draft.typedThreshold!==undefined?{blocked:true,message:{tone:'refusal' as const,
          text:`Small counts: "${draft.typedThreshold}" cannot be used. Hide a count below a whole number from 2 to 1,000, or empty the box to show every count.`}}:{}),
        preview:tablePreview(kit,node,mode,draft.coord,draft.present,draft.rowsShown,draft.totalsAsserted===true)};
    },
    wire:(root,draft,redraw)=>{
      wirePresentation(root,draft.present,redraw);wireColumnPresentation(root,draft.present,redraw,raw=>{if(raw===undefined)delete draft.typedThreshold;else draft.typedThreshold=raw;});
      root.querySelector<HTMLSelectElement>('#preview-rows')?.addEventListener('change',e=>{const v=(e.target as HTMLSelectElement).value;
        draft.rowsShown=v==='all'?'all':Number(v);redraw();});
      root.querySelector<HTMLSelectElement>('#output-coordinates')?.addEventListener('change',e=>{draft.coord.metres=(e.target as HTMLSelectElement).value==='metres';redraw();});
      if(draft.coord.metres)wireZone(root,draft.coord,redraw,'output');
      root.querySelector<HTMLInputElement>('#output-totals')?.addEventListener('change',e=>{
        if((e.target as HTMLInputElement).checked)draft.totalsAsserted=true;else delete draft.totalsAsserted;redraw();});
    },
    apply:draft=>{
      const {view,coord,present,rowsShown:_shown,typedThreshold:_typed,...params}=draft;
      if(Object.keys(present).length)params.presentation=present;else delete params.presentation;
      if(coord.metres)params.coordinates={zone:Number(coord.zone),hemisphere:coord.hemisphere};else delete params.coordinates;
      if(view&&view!=='table'){kit.change(w=>{const index=w.nodes.findIndex(x=>x.id===nodeId);
        w.nodes[index]={...w.nodes[index]!,type:'output',params:{label:params.label,view}} as never;});return;}
      // Coordinates in metres are computed, so a change to them asks for a run; the rest is presentation.
      const edit=(w:Workflow)=>{const t=w.nodes.find(x=>x.id===nodeId) as WorkflowNode<'table_output'>|undefined;if(t)t.params=params;};
      if(JSON.stringify(params.coordinates)!==JSON.stringify(node.params.coordinates))kit.change(edit);else kit.presentation(edit);
      kit.renderResults();
    },
  },esc);
}

export const tableOutputInspector:OwnInspector<'table_output'>={
  markup:(n,k)=>{const kit=k as TableOutputKit;
    const esc=kit.esc,workflow=kit.workflow();let content='';
    const mode=shownMode(n,workflow.edges);
    content+=kit.section('Name',`<div class="field"><label class="field-label" for="table-label">Results tab name</label><input id="table-label" maxlength="60" value="${esc(n.params.label)}"></div>`
      +kit.writeUpSelect(n));
    const portName=(port:string)=>({area:'Study area',decisions:'Reasoning result',table:'Tabular data',raster:'Or: Raster',network:'Street network',polygons:'Polygons'} as Record<string,string>)[port]
      ||'Point data '+(port==='points'?1:port.split('_')[1]);
    // WHAT IS CONNECTED, and one picker to connect more (2026-11-09, the practitioner: *"streamline its input ports like
    // map output"*). A select for each of five ports, most never used, was the Inspector's half of the clutter.
    let inputs=`<p class="description">What you connect decides how it is shown.</p>`
      +nodeInputs(n).map(([port,type])=>{const edge=workflow.edges.find(e=>e.to===n.id&&e.port===port);
        if(!edge)return '';
        return `<div class="field"><label class="field-label" for="table-${port}">${esc(portName(port))}</label><select id="table-${port}" data-map-port="${port}"><option value="">Not connected</option>`
          +workflow.nodes.filter(x=>x.id!==n.id&&portAccepts(type,outputOf(x))).map(x=>`<option value="${esc(x.id)}" ${edge?.from===x.id?'selected':''}>${esc(x.params.label||kit.title(x.type))}</option>`).join('')+'</select></div>';}).join('');
    {
      const showable=new Set(nodeInputs(n).map(([,type])=>type));
      const candidates=workflow.nodes.filter(x=>x.id!==n.id&&(showable.has(outputOf(x) as never)||portAccepts('table',outputOf(x)))
        &&!workflow.edges.some(e=>e.to===n.id&&e.from===x.id));
      if(candidates.length)inputs+=`<div class="field"><label class="field-label" for="table-add-input">Add an input</label>`
        +`<select id="table-add-input"><option value="">Choose a result to show…</option>`
        +candidates.map(x=>`<option value="${esc(x.id)}">${esc(x.params.label||kit.title(x.type))}</option>`).join('')
        +`</select></div>`;
    }
    if(!n.params.inputMode||n.params.inputMode==='spatial')
      inputs+=`<div class="inspector-actions"><button id="add-point-input" class="button small" ${(n.params.pointInputCount??1)>=MAX_POINT_LAYERS?'disabled':''}>＋ Add point input</button><button id="remove-point-input" class="button small" ${(n.params.pointInputCount??1)<=1?'disabled':''}>Remove last input</button></div>`;
    content+=kit.section('Inputs',inputs);
    content+=kit.section('Settings',`<p class="standard-sentence">${esc(tableOutputSentence(kit,n,mode))}</p>`
      +'<div class="inspector-actions"><button id="configure-step" class="button primary">Configure\u2026</button></div>');
    const shown=kit.shown(n.id);
    const why=kit.unfinished(n.id);
    content+=kit.section('Result',`<p class="standard-result${why?' standard-result-warning':''}">${esc(why?`The last run could not compute this step: ${why}`
      :shown?`Shown in Results, under "${n.params.label||'Table'}".`:'Not run yet.')}</p>`);
    return content;
  },
  wire:(n,k,root)=>{const kit=k as TableOutputKit;
    root.querySelector('#configure-step')?.addEventListener('click',()=>openTableConfig(kit,n.id));
  },
};
