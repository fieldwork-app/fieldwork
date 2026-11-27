import type {PointInput,PointLayer} from './types.js';
import type {LayerShape,ValueClasses} from './presentation.js';
import {classifyValues} from './presentation.js';
export const MAX_POINT_LAYERS=8;
/** HOW MANY POINT RECORDS A STEP TAKES, on import and on a map: measured, not chosen (widgets/caps.json, point-records). */
export const MAX_POINT_RECORDS=250_000;
export const pointPort=(index:number)=>index===0?'points':`points_${index+1}`;
/** A point port: `points`, then `points_2` up to the last MAX_POINT_LAYERS allows, the one number that says how many. */
export const isPointPort=(port:string)=>{if(port==='points')return true;
  const n=/^points_(\d+)$/.exec(port);return !!n&&Number(n[1])>=2&&Number(n[1])<=MAX_POINT_LAYERS;};
export function pointLayers(points:PointInput){
  const layers='layers' in points?points.layers:[points];
  if(layers.length>MAX_POINT_LAYERS)throw new Error(`Use at most ${MAX_POINT_LAYERS} point layers per operation.`);
  if(new Set(layers.map(l=>l.sourceNodeId)).size!==layers.length)throw new Error('Connect each point source once per operation.');
  return layers;
}
export const recordKey=(source:string,id:string,multiple:boolean)=>multiple?`${source.length}_${source}_${id}`:id;
export const layerSummary=(layers:PointLayer[])=>layers.map(l=>({sourceNodeId:l.sourceNodeId,label:l.label||l.sourceNodeId,count:l.features.length,...(l.port?{port:l.port}:{})}));
/** WHICH STEP EACH PORT'S LAYER REALLY CAME FROM, read off the layers the run composed rather than off the edges.
 *  Empty for a map drawn before the port travelled, where the edge's `from` remains the only answer there is. */
export const layerOrigins=(summaries:readonly {sourceNodeId:string;port?:string;count?:number}[]|undefined)
  :(port:string)=>{sourceNodeId:string;count?:number}|undefined=>{
  const by=new Map((summaries??[]).flatMap(l=>l.port?[[l.port,{sourceNodeId:l.sourceNodeId,count:l.count}] as const]:[]));
  return port=>by.get(port);
};
export function layerRecords(layers:PointLayer[]){return layers.flatMap(layer=>layer.features.map(feature=>({feature,id:recordKey(layer.sourceNodeId,feature.id,layers.length>1),recordId:feature.id,sourceNodeId:layer.sourceNodeId,layerLabel:layer.label||layer.sourceNodeId,attributeTypes:Object.fromEntries((layer.attributeDefinitions||[]).map(d=>[d.key,d.type]))})));}

/** THE POINTS A MAP COMPOSED, DRAWN OVER WHATEVER RENDERER LED.
 *
 *  Found on 2026-10-31 by building South London's eighth workflow BY HAND from the palette, which
 *  is what that exercise is for: a study area, a cleaned river, 32 sub-districts and four points
 *  wired to one Map drew the polygons and no marks. The layer control listed the point layer with
 *  a checkbox beside it and the Sources line named it, so every surface said the points were
 *  there except the figure.
 *
 *  THE VALUE WAS NEVER THE PROBLEM. `core.ts` has composed this correctly since 2026-10-29 --
 *  where an area is wired, the polygons branch builds the spatial map from the area and every
 *  point layer and joins the polygons to it as a layer -- so the rows were on the value and
 *  `polygonSvg` simply does not read them. It draws `observations` and `sites` carried INSIDE a
 *  polygons value, which is a different thing from the point layers wired to the map.
 *
 *  That makes this the SIXTH instance of one defect, and `core.ts` names the first five: the
 *  study area on 2026-10-20, the facilities on 2026-10-22, the raster on 2026-10-23, the polygons
 *  on 2026-10-28, points-with-no-area on 2026-10-29. Each of those was a layer dropped between
 *  the value and the picture; the previous five were fixed in the composition and this one is in
 *  the drawing, which is why composing correctly did not catch it.
 *
 *  ONE FUNCTION, TWO CALLERS, deliberately: the live map and the write-up's figure both draw
 *  through this, so a published figure cannot disagree with the screen about which marks exist.
 *  The projection is passed in because each renderer frames its own extent. */
export interface MarkRow {
  id:string; name?:string; coordinates?:[number,number]|number[]|null;
  sourceNodeId?:string|null; layerLabel?:string; relation?:string; status?:string;
  excluded?:boolean; pinClass?:string;
  /** The record's own properties, for the one a practitioner nominated as its label. */
  attributes?:Record<string,unknown>;
}

/** HOW MANY MARKS A FIGURE CAN NAME BEFORE NAMING THEM HELPS NOBODY.
 *
 *  Four intakes on the Thames want their names printed; 250 death locations do not, and a figure
 *  that printed them would be a black rectangle. The ceiling is on the DRAWN layer rather than on
 *  the data, so a layer the practitioner narrowed can be named even though its source was large.
 *
 *  This is a limit on legibility, not a limit on the data, so a layer over it is left unnamed and
 *  the Inspector says why rather than the figure failing. */
export const LABEL_CEILING=24;

/** HOW MANY MARKS A LAYER HAS BEFORE IT IS DRAWN AS ONE SHAPE PER STYLE (2026-11-19). Below it, each mark is its own
 *  element, which a reader can focus, hover for its name and pick in the records table. Above it, a figure's marks of one
 *  colour and fill are one path: 50,000 separate elements took 74 s to draw, and no reader picks one of 50,000. The
 *  figure looks the same; only the marks' individual names are given up. widgets/caps.json, merged-marks. */
export const MERGED_MARKS_FROM=2_000;

/** HOW MANY MARKS OF A SHAPE OTHER THAN A CIRCLE THE INTERACTIVE MAP DRAWS AS SHAPES, measured 2026-11-19
 *  (widgets/caps.json, interactive-marks): 100,000 drew in 11 s; at 150,000 MapLibre's layout of the icons never finished.
 *  Circles are drawn another way, to the record limit. Past this, every mark is drawn as a circle, and the map says so. */
export const INTERACTIVE_MARKS_LIMIT=100_000;

/** One layer's marks, collected by style and written as one path each, in the order each style first appeared. */
export class MarkBatch {
  private styles=new Map<string,string[]>();
  add(style:string,d:string){const held=this.styles.get(style);if(held)held.push(d);else this.styles.set(style,[d]);}
  get size(){return this.styles.size;}
  /** The layer's marks as SVG, labelled for a screen reader with how many there are; empty if none were added. */
  svg(layer:string,count:number,name:string,esc:(v:unknown)=>string):string{
    if(!this.styles.size)return '';
    const out=`<g class="location-layer" data-layer="${esc(layer)}" role="img" aria-label="${esc(name)}: ${count.toLocaleString('en')} marks">`
      +[...this.styles].map(([style,ds])=>`<path ${style} d="${ds.join('')}"/>`).join('')+'</g>';
    this.styles.clear();return out;
  }
}

/** A MARK'S NAME, FROM THE PROPERTY SOMEBODY NOMINATED.
 *
 *  Never guessed from a property called `name`: the same rule the records table and the pin class
 *  already keep. A practitioner says which attribute names a mark, and a layer nobody nominated
 *  one for is drawn unnamed — which is a figure with marks in a key, not a defect.
 *
 *  OVERLAP IS NOT SOLVED, and that is why the ceiling above is low. Two intakes 300 m apart on a
 *  850-pixel figure produce two labels that touch, and nothing here moves them. Stated rather
 *  than discovered: this names a handful of marks on a publication figure, and it is not a
 *  label-placement engine. */
export const markLabel=(row:MarkRow,field:string|undefined,x:number,y:number,radius:number,
  esc:(v:unknown)=>string):string=>{
  if(!field)return '';
  // THE NOMINATED PROPERTY WINS, whatever it is called. `name` fell through to the row's own
  // `name` here, which agrees for a map row and disagrees for anything that carries attributes
  // of its own -- a special case that made the function mean two things. The row's name is the
  // fallback only where there are no attributes to read.
  const held=row.attributes&&field in row.attributes?row.attributes[field]
    :row.attributes?undefined:field==='name'?row.name:undefined;
  const text=held===undefined||held===null?'':String(held).trim();
  if(!text)return '';
  // Drawn twice: a pale stroke under the ink, so a name over a dark polygon or a plate stays
  // readable without a box that would hide what it sits on. The same reasoning as `markHalo`.
  const at=`x="${(x+radius+3).toFixed(1)}" y="${(y+3.5).toFixed(1)}"`;
  return `<text ${at} class="mark-label" font-size="14" stroke="#ffffff" stroke-width="3" `
    +`stroke-linejoin="round" paint-order="stroke" fill="#2b2b2b">${esc(text)}</text>`;
};
export interface MarkStyle {colour:string; shape:LayerShape; size?:number; sizeBy?:string; colourBy?:string}
/** COLOUR BY CLASS (2026-11-13). The practitioner, of MERS's hospitals sized by their cases: *"Note some hospitals under
 *  the big circle Samsung Medical Center. This is probably not the best way to display this map. Maybe color keyed to
 *  expose all the point locations."* Each coloured layer's values in quantile classes on the ordered ramp, as a
 *  choropleth's are, so every mark is one size and the key states the breaks. A mark with no value is drawn neutral:
 *  absent is not a class. */
export function colouredClasses(rows:readonly MarkRow[],symbols:Record<string,MarkStyle>):Map<string,ValueClasses>{
  const out=new Map<string,ValueClasses>();
  for(const [layer,symbol] of Object.entries(symbols)){
    if(!symbol.colourBy)continue;
    const values=rows.filter(r=>(r.sourceNodeId||'')===layer).map(r=>{const v=r.attributes?.[symbol.colourBy!];return v===''||v===null||v===undefined?null:Number(v);});
    const classes=classifyValues(values);if(classes)out.set(layer,classes);
  }
  return out;
}
const valueOf=(row:MarkRow,by:string)=>{const v=row.attributes?.[by];return v===''||v===null||v===undefined?null:Number(v);};
/** A MARK'S AREA IN PROPORTION TO ITS VALUE (experiment 210): the largest value takes three times the layer's radius, and
 *  every other mark the radius whose area is its share of that, so a house with four deaths covers four times the
 *  ground of one with one. A value that is not a positive number takes the smallest mark. */
export const proportionalRadius=(value:unknown,largest:number,radius:number):number=>{
  const v=Number(value),top=radius*3;
  return Number.isFinite(v)&&v>0&&largest>0?Math.max(1.5,top*Math.sqrt(v/largest)):1.5;
};
/** WHERE EACH POINT LAYER SITS IN THE STACK the practitioner set in Manage layers, bottom first, by the step it comes from;
 *  a layer the list does not name sits on top, in the order it arrived (2026-11-12). */
export function layerRanks(mapLayers:readonly {sourceNodeId?:string;kind?:string}[]|undefined):(source:string|null|undefined)=>number{
  const ranks=new Map<string,number>();
  (mapLayers??[]).forEach((layer,index)=>{if(layer.sourceNodeId&&!ranks.has(layer.sourceNodeId))ranks.set(layer.sourceNodeId,index);});
  return source=>ranks.get(source??'')??1000;
}
/** The largest value of each sized layer, over the rows that carry it. */
export function sizedLargest(rows:readonly MarkRow[],symbols:Record<string,MarkStyle>):Map<string,number>{
  const out=new Map<string,number>();
  for(const row of rows){const key=row.sourceNodeId||'',by=symbols[key]?.sizeBy;if(!by)continue;
    const v=Number(row.attributes?.[by]);if(Number.isFinite(v)&&v>(out.get(key)??0))out.set(key,v);}
  return out;
}
export function markedPoints(rows:readonly MarkRow[],
  project:(c:[number,number])=>[number,number],
  options:{
    esc:(v:unknown)=>string;
    markPath:(shape:LayerShape,x:number,y:number,r:number)=>string;
    symbols?:Record<string,MarkStyle>;
    classes?:Record<string,{value:string;colour:string}[]>;
    /** Source node ids the practitioner switched off. A hidden layer is not drawn and is still
     *  described, which is the distinction `fw:layerDrawn` exists to make. */
    hidden?:ReadonlySet<string>;
    focusId?:string|null;
    label?:(row:MarkRow)=>string;
    /** Which property names each layer's marks, keyed by source node the way `symbols` is. */
    labelField?:Record<string,string>;
    /** The layers in the order set in Manage layers, bottom first. */
    mapLayers?:readonly {sourceNodeId?:string;kind?:string}[];
  }):string{
  const {esc,markPath,symbols={},classes={},hidden,focusId,label,labelField={},mapLayers}=options;
  // Counted per layer over what will actually be DRAWN, so a hidden layer does not spend the
  // ceiling and a layer under it is named even where another is over.
  const drawnPerLayer=new Map<string,number>();
  for(const row of rows){
    if(!row.coordinates||hidden?.has(row.sourceNodeId||''))continue;
    const key=row.sourceNodeId||'';
    drawnPerLayer.set(key,(drawnPerLayer.get(key)||0)+1);
  }
  let svg='';
  // Sized marks are drawn largest first, so a small one is never hidden under a large one.
  const largest=sizedLargest(rows,symbols);
  const sizeOf=(row:MarkRow)=>{const s=symbols[row.sourceNodeId||''];return s?.sizeBy?Number(row.attributes?.[s.sizeBy])||0:0;};
  // Layer by layer in the order set, the lowest first; within a sized layer, the largest marks first.
  const rank=layerRanks(mapLayers);
  // A coloured layer draws its highest values last, so where two marks touch the one with more is on top.
  const coloured=colouredClasses(rows,symbols);
  const colourOrder=(row:MarkRow)=>{const by=symbols[row.sourceNodeId||'']?.colourBy;return by?Number(valueOf(row,by))||0:0;};
  const ordered=[...rows].map((row,at)=>({row,at})).sort((a,b)=>rank(a.row.sourceNodeId)-rank(b.row.sourceNodeId)||sizeOf(b.row)-sizeOf(a.row)||colourOrder(a.row)-colourOrder(b.row)||a.at-b.at).map(x=>x.row);
  const batch=new MarkBatch();let batched='',batchedCount=0,batchedName='';
  const flush=()=>{if(batch.size)svg+=batch.svg(batched,batchedCount,batchedName,esc);batchedCount=0;};
  for(const row of ordered){
    if(!row.coordinates)continue;
    if(hidden?.has(row.sourceNodeId||''))continue;
    if((row.sourceNodeId||'')!==batched){flush();batched=row.sourceNodeId||'';}
    const [x,y]=project(row.coordinates as [number,number]);
    if(!Number.isFinite(x)||!Number.isFinite(y))continue;
    const symbol=symbols[row.sourceNodeId||''];
    const classed=row.pinClass
      ?classes[row.sourceNodeId||'']?.find(entry=>entry.value===row.pinClass)?.colour:undefined;
    const ramp=coloured.get(row.sourceNodeId||'');
    const step=ramp&&symbol?.colourBy?ramp.classOf(valueOf(row,symbol.colourBy)):null;
    const ink=ramp?(step===null?'#a89b87':ramp.colours[step]!):classed||symbol?.colour||'#699178';
    const sized=!ramp&&!!symbol?.sizeBy&&largest.has(row.sourceNodeId||'');
    const radius=(sized?proportionalRadius(row.attributes?.[symbol!.sizeBy!],largest.get(row.sourceNodeId||'')!,symbol?.size??4)
      // A colour must be big enough to read: a coloured mark is never under 7 px across the radius.
      :ramp?Math.max(7,symbol?.size??4):(symbol?.size??4))+(focusId===row.id?2:0);
    // Outside the area is drawn hollow and a record a clip set aside is drawn neutral: the same
    // two declarations `oldMap` makes, so one map does not say Outside in two ways.
    const hollow=row.relation==='Outside';
    const aside=row.excluded||row.relation==='MissingLocation';
    if((drawnPerLayer.get(row.sourceNodeId||'')||0)>MERGED_MARKS_FROM&&focusId!==row.id){
      batch.add(`fill="${hollow?'none':aside?'#a89b87':ink}"${sized?' fill-opacity="0.55"':''} stroke="${aside?'#a89b87':ramp?'#1d2f3a':ink}" stroke-width="1.6"`,
        markPath(symbol?.shape||'circle',x,y,radius));
      batchedCount++;batchedName=row.layerLabel||row.sourceNodeId||'';continue;}
    const said=label?label(row):[row.relation,row.layerLabel].filter(Boolean).join(' · ');
    svg+=`<g class="location" role="button" tabindex="0" data-place="${esc(row.id)}" `
      +`data-layer="${esc(row.sourceNodeId||'')}" `
      +`aria-label="${esc(row.name||row.id)}${said?', '+esc(said):''}">`
      +`<title>${esc(row.name||row.id)}${said?' · '+esc(said):''}</title>`
      +`<path d="${markPath(symbol?.shape||'circle',x,y,radius)}" `
      // A class's pale step needs a dark edge to be seen on a basemap.
      +`fill="${hollow?'none':aside?'#a89b87':ink}"${sized?' fill-opacity="0.55"':''} stroke="${aside?'#a89b87':ramp?'#1d2f3a':ink}" `
      +`stroke-width="1.6"/>`
      +((drawnPerLayer.get(row.sourceNodeId||'')||0)<=LABEL_CEILING
        ?markLabel(row,labelField[row.sourceNodeId||''],x,y,radius,esc):'')
      +`</g>`;
  }
  flush();
  return svg;
}

/** WHAT A RECORD SAYS, in its popup. The practitioner, 2026-11-23, having joined a species list onto 55,227 bat
 *  records and drawn the result: *"Without the species in the tool tip I have no way of directly verifying whether
 *  the relate two tables worked."* The popup named the record, its relation to the area, its layer and its position
 *  -- everything about where it is and nothing about what it is -- so a join could change every row and the map
 *  would look identical.
 *
 *  Columns in the order the source holds them, which for a table-derived layer is the file's own order; a value that
 *  is empty, or the "NA" a file writes for missing, is left out rather than shown as a fact. Capped, because a wide
 *  line list would otherwise fill the screen, and the count says what was left. */
const POPUP_ATTRIBUTES=14;
export function recordAttributesHtml(attributes:Record<string,unknown>|undefined,esc:(v:string)=>string):string{
  if(!attributes)return '';
  const said=Object.entries(attributes).filter(([key,value])=>{
    if(key==='name')return false;
    const text=String(value??'').trim();
    return text!==''&&text.toUpperCase()!=='NA';
  });
  if(!said.length)return '';
  const shown=said.slice(0,POPUP_ATTRIBUTES);
  return shown.map(([key,value])=>`<br>${esc(key)}: ${esc(String(value))}`).join('')
    +(said.length>shown.length?`<br><span class="muted">and ${said.length-shown.length} more column${said.length-shown.length===1?'':'s'}</span>`:'');
}


/** A CARRIED POINT'S RADIUS, one rule for the plot and the interactive map (2026-11-27): its layer's size, or, sized by a
 *  column, the area of each mark in proportion, as every point layer is drawn. */
export function observationRadius(p:import('./catchments.js').Polygons,properties:Record<string,unknown>|null|undefined):number{
  const symbol=p.observationSymbol;if(!symbol)return 3;
  if(!symbol.sizeBy)return symbol.size;
  const largest=Math.max(0,...(p.observations?.features??[]).map(f=>Number(f.properties?.[symbol.sizeBy!])).filter(Number.isFinite));
  return largest>0?proportionalRadius(properties?.[symbol.sizeBy],largest,symbol.size):symbol.size;
}
