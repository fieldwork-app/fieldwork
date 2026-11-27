/** FOUR AREA STEPS SHOWN ON MADE-UP SHAPES (2026-11-20). The practitioner, moving Geometry buffer, Buffer study area,
 *  Calculate area and Clip polygons to the standard: *"we can also opportunistically include the show me how animation during the
 *  standardization."* The table walkthroughs' player (table-walkthrough.ts) draws each step; here the shapes are fixed in
 *  the code, near the equator so a degree is close to a degree each way, and never read from a port. Each walkthrough's
 *  last step is the result the step's own function makes from these shapes, so it cannot show what the step does not do. */
import {escapeHtml} from './html-escape.js';
import type {Boundary,Position,WorkflowNode,PointCollection} from './types.js';
import {costsWithin} from './reachable-nodes.js';
import type {Walkthrough,WalkStep} from './table-walkthrough.js';
import {bufferPoint,BUFFER_POINT_STEPS} from './buffer-point.js';
import {calculateArea,formatArea,AREA_METHOD,AREA_UNITS} from './area-computation.js';
import {clipPolygons,summarizePolygons,type Polygons} from './catchments.js';
import {clipPointsToArea} from './clip-points.js';
import {sampleRaster,cellAt} from './sample-raster.js';
import {totalOver} from './raster-areas.js';
import {pointRelation} from './spatial-predicates.js';
import type {RasterGrid} from './raster.js';
import {polygonShading,shadedValues,classRanges} from './presentation.js';
import type {AreaUnit} from './types.js';
import {joinTableToAreas} from './area-join.js';
import {convexHull} from './convex-hull.js';
import {voronoi,isochrone,type Network} from './catchments.js';
import {computeMeanCenter} from './mean-center.js';
import {moveDonut,aggregateHex} from './geoprivacy.js';
import {latLngToCell,cellToLatLng,cellToBoundary,gridDisk,getHexagonEdgeLengthAvg,UNITS as H3_UNITS} from 'h3-js';

type Kind='input'|'area'|'look'|'result'|'gone';
interface Shape {kind:Kind;rings?:Position[][][];point?:Position;label?:string;at?:Position;
  /** A made shape's colour on the scale `classedScale` gives, as Map would shade it. */
  fill?:string}
/** THE SCALE A RESULT IS SHADED ON (the practitioner, 2026-11-26, on Summarize's last step: "shouldn't the goal be in
 *  summarization to render a shading corresponding to the resulting scale?"). Read off the step's own output by the
 *  functions Map shades and keys a polygon layer with (`polygonShading`, `classRanges` over `shadedValues`), so the
 *  walkthrough ends on the picture Map draws of the same polygons: the same value, classes, colours and ranges. */
export function classedScale(features:Polygons['features']):{fill:(f:Polygons['features'][number])=>string;scale:{label:string;color:string}[]}|null{
  const {classed}=polygonShading(features);
  if(!classed)return null;
  const ranges=classRanges(shadedValues(features),classed.breaks);
  return {fill:f=>classed.colours[classed.classOf(f.value)??0]!,scale:ranges.map((label,i)=>({label,color:classed.colours[i]!}))};
}
type Scale={title:string;entries:{label:string;color:string}[]};
const KEY_SCALED='Filled: what the step makes, coloured by the scale below, as Map shades it';
const KEY:Record<Kind,string>={input:'Grey outline: what the step is given',area:'Dashed outline: the area it works within',
  look:'Thick outline: what this step looks at',result:'Filled: what the step makes',gone:'Faint: left out'};

/** The shapes drawn in a 360 by 240 box, longitude across and latitude up, at the scale of the widest shape. */
function draw(shapes:Shape[],label:string,shading?:Scale):{svg:string;key:string[];scale?:Scale}{
  const all=shapes.flatMap(s=>[...(s.rings??[]).flat(2),...(s.point?[s.point]:[])]);
  const xs=all.map(p=>p[0]),ys=all.map(p=>p[1]);
  const w=Math.min(...xs),e=Math.max(...xs),south=Math.min(...ys),n=Math.max(...ys);
  // ROOM FOR A LABEL on the right and above: a label is drawn up and to the right of its shape, and one on the widest
  // shape's edge was cut off (Summarize's "H6", 2026-11-22). The shapes take 260 by 180 of the 360 by 240 box.
  const scale=Math.min(260/((e-w)||1e-3),180/((n-south)||1e-3));
  const x=(lon:number)=>20+(lon-w)*scale+(260-(e-w)*scale)/2,y=(lat:number)=>40+(n-lat)*scale+(180-(n-south)*scale)/2;
  const path=(rings:Position[][][])=>rings.map(poly=>poly.map(r=>'M'+r.map(p=>`${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join('L')+'Z').join(' ')).join(' ');
  const body=shapes.map(s=>s.rings
    ?`<path class="walk-shape walk-shape-${s.kind}" d="${path(s.rings)}" fill-rule="evenodd"${s.fill?` style="fill:${s.fill};fill-opacity:.78"`:''}/>`
    :s.point?`<circle class="walk-shape walk-shape-${s.kind} walk-point" cx="${x(s.point[0]).toFixed(1)}" cy="${y(s.point[1]).toFixed(1)}" r="5"/>`:'').join('')
    +shapes.filter(s=>s.label).map(s=>{const at=s.at??s.point??s.rings![0]![0]![0]!;
      // A LABEL STAYS IN THE DRAWING (2026-11-26): drawn to the right of its point, and kept inside by the player, which
      // measures it once drawn (fitLabels in table-walkthrough.ts). An estimate of its width flipped labels that fit.
      const lx=x(at[0]);
      return `<text class="walk-shape-label" data-at="${lx.toFixed(1)}" x="${(lx+8).toFixed(1)}" y="${(y(at[1])-8).toFixed(1)}">${escapeHtml(s.label!)}</text>`;}).join('');
  const kinds=[...new Set(shapes.map(s=>s.kind))];
  return {svg:`<svg class="walk-drawing" viewBox="0 0 360 240" role="img" aria-label="${label}">${body}</svg>`,
    key:kinds.map(k=>k==='result'&&shading?KEY_SCALED:KEY[k]),...(shading?{scale:shading}:{})};
}
/** A DIALOG'S PREVIEW, DRAWN AS SHOW ME HOW DRAWS (2026-11-27): the practitioner, of Clip polygons' Preview, which gave
 *  counts and no shapes: *"the preview does not show the resulting Voronoi polygons, clipped by the study area."* The
 *  same drawing and key as the walkthroughs, so a preview and a walkthrough read alike. */
export type PreviewShape=Shape;
export function previewDrawing(shapes:PreviewShape[],label:string):string{
  const {svg,key}=draw(shapes,escapeHtml(label));
  return `<figure class="walk-figure preview-drawing">${svg}<figcaption><ul class="walk-key">${key.map(k=>`<li>${escapeHtml(k)}</li>`).join('')}</ul></figcaption></figure>`;
}
const ring=(points:Position[]):Position[][][]=>[[[...points,points[0]!]]];
const partsOf=(g:Boundary):Position[][][]=>g.type==='MultiPolygon'?g.coordinates as Position[][][]:[g.coordinates as Position[][]];
const step=(text:string,shapes:Shape[],final=false,marks:WalkStep['marks']=[],scale?:Scale):WalkStep=>({text,marks,figure:draw(shapes,text,scale),...(final?{final:true}:{})});
const metres=(m:number)=>`${m.toLocaleString('en')} m`;
/** The dialog's distance, or 500 m where it is not one a step accepts, said in the walkthrough. */
const usable=(m:number,max:number)=>Number.isFinite(m)&&m>0&&m<=max?m:500;

const WELL:Position=[30,-1];
export function bufferPointWalkthrough(distanceM:number):Walkthrough{
  const d=usable(distanceM,5000);
  const points:PointCollection={type:'FeatureCollection',features:[{type:'Feature',id:'Well A',properties:{name:'Well A'},geometry:{type:'Point',coordinates:WELL}}]};
  const node={id:'walk',type:'buffer_point',x:0,y:0,params:{label:'Walk',pointId:'Well A',distanceM:d}} as WorkflowNode<'buffer_point'>;
  const made=bufferPoint(points,node,'walkthrough').value.boundary;
  const edge:Position=[WELL[0]+d/111320,WELL[1]];
  return {title:'Geometry buffer, step by step',tables:[],resultColumns:[],steps:[
    step('The point the area is drawn around: Well A, chosen by its name. Given several, each is drawn around the same way.',[{kind:'look',point:WELL,label:'Well A'}]),
    step(`Everything within ${metres(d)} of it, in every direction${d!==distanceM?' (shown with 500 m, because the distance set is not one the step accepts)':''}.`,
      [{kind:'input',point:WELL,label:'Well A'},{kind:'look',rings:[[[WELL,edge,WELL]]],label:metres(d),at:[(WELL[0]+edge[0])/2,WELL[1]]}]),
    step(`The step draws that as a polygon of ${4*BUFFER_POINT_STEPS} sides, ${BUFFER_POINT_STEPS} to each quarter, and it becomes the study area: `
      +`${formatArea(calculateArea(made,'km2'))}.`,[{kind:'result',rings:partsOf(made)},{kind:'input',point:WELL,label:'Well A'}],true)]};
}

const DISTRICT:Position[]=[[30,-1],[30.02,-0.995],[30.03,-1.01],[30.015,-1.025],[29.998,-1.018]];
export function measureAreaWalkthrough(unit:AreaUnit):Walkthrough{
  const district:Boundary={type:'Polygon',coordinates:ring(DISTRICT)[0]!};
  const measured=calculateArea(district,unit);
  return {title:'Calculate area, step by step',tables:[],resultColumns:[],steps:[
    step('The study area it is given: one made-up district.',[{kind:'look',rings:partsOf(district),label:'District'}]),
    step(`Its area is measured on the curved Earth, not on the flat map: ${AREA_METHOD}.`,[{kind:'look',rings:partsOf(district),label:'District'}]),
    step(`The step passes the same area on, with its size attached, in ${AREA_UNITS[unit].label}: ${formatArea(measured)}.`,
      [{kind:'result',rings:partsOf(district),label:formatArea(measured)}],true)]};
}

const AREA:Position[]=[[30,-1],[30.04,-1],[30.04,-1.03],[30,-1.03]];
const UNITS:{name:string;ring:Position[]}[]=[
  {name:'Inside',ring:[[30.005,-1.005],[30.015,-1.005],[30.015,-1.015],[30.005,-1.015]]},
  {name:'Across',ring:[[30.03,-1.015],[30.05,-1.015],[30.05,-1.027],[30.03,-1.027]]},
  {name:'Outside',ring:[[30.05,-0.997],[30.06,-0.997],[30.06,-1.007],[30.05,-1.007]]}];
export function clipPolygonsWalkthrough():Walkthrough{
  const area:Boundary={type:'Polygon',coordinates:ring(AREA)[0]!};
  const input={features:UNITS.map(u=>({type:'Feature',properties:{name:u.name},geometry:{type:'Polygon',coordinates:ring(u.ring)[0]!}})),
    sites:[],method:'',crs:'CRS84',notes:[]} as unknown as Polygons;
  const clipped=clipPolygons(input,area);
  const kept=(name:string)=>clipped.features.find(f=>(f.properties as {name?:string}).name===name)?.geometry as Boundary|undefined;
  const shape=(name:string)=>ring(UNITS.find(u=>u.name===name)!.ring);
  const across=kept('Across');
  return {title:'Clip polygons, step by step',tables:[],resultColumns:[],steps:[
    step('Three made-up units and the study area they are clipped to.',[{kind:'area',rings:ring(AREA)},...UNITS.map(u=>({kind:'input' as const,rings:ring(u.ring),label:u.name}))]),
    step(`"Inside" lies wholly within the area: it is kept as it is.`,[{kind:'area',rings:ring(AREA)},{kind:'look',rings:shape('Inside'),label:'Inside'},{kind:'input',rings:shape('Across'),label:'Across'},{kind:'input',rings:shape('Outside'),label:'Outside'}]),
    step(`"Across" crosses the area's edge: it is cut along the edge, and only the part inside is kept.`,[{kind:'area',rings:ring(AREA)},{kind:'look',rings:shape('Across'),label:'Across'},...(across?[{kind:'result' as const,rings:partsOf(across)}]:[])]),
    step(`"Outside" does not meet the area: nothing of it is inside, so it is left out.`,[{kind:'area',rings:ring(AREA)},{kind:'gone',rings:shape('Outside'),label:'Outside'}]),
    step(`What the step passes on: ${clipped.features.length} of 3 units, each cut to the area.`,
      [{kind:'area',rings:ring(AREA)},...clipped.features.map(f=>({kind:'result' as const,rings:partsOf(f.geometry as Boundary),label:(f.properties as {name?:string}).name??''}))],true)]};
}

/** JOIN A TABLE TO THE STUDY AREA, on three made-up parts and a table of three rows (2026-11-20). One row matches as it is,
 *  one only once punctuation is set aside, one names no part, and one part has no row; the last step is what the join
 *  itself makes of them, under the matching chosen in the dialog. */
// THE PARTS DRAWN AS ADMINISTRATIVE UNITS (2026-11-21, the practitioner: "Can we make the study area in an example look
// like an admin boundary?"): three districts sharing uneven borders, a river between the two above and Riverside below.
const V:Record<string,Position>={A:[30,-1.002],B:[30.008,-0.999],C:[30.017,-1.001],D:[30.026,-0.998],E:[30.035,-1.003],
  F:[30.041,-1.007],F2:[30.043,-1.011],G:[30.04,-1.014],L:[29.998,-1.007],W:[30.001,-1.012],R1:[30.006,-1.014],R2:[30.011,-1.011],
  M1:[30.019,-1.006],M2:[30.016,-1.01],J:[30.02,-1.013],R3:[30.027,-1.015],R4:[30.033,-1.012],
  S1:[30.042,-1.02],S2:[30.034,-1.026],S3:[30.022,-1.024],S4:[30.012,-1.027],S5:[30.003,-1.023],S6:[29.999,-1.017]};
const at=(...k:string[])=>k.map(x=>V[x]!);
const PARTS:{id:string;name:string;ring:Position[];at:Position}[]=[
  {id:'p1',name:'North',ring:at('A','B','C','M1','M2','J','R2','R1','W','L'),at:[30.002,-1.0085]},
  {id:'p2',name:'St. Mary',ring:at('C','D','E','F','F2','G','R4','R3','J','M2','M1'),at:[30.022,-1.0085]},
  {id:'p3',name:'Riverside',ring:at('W','R1','R2','J','R3','R4','G','S1','S2','S3','S4','S5','S6'),at:[30.006,-1.02]}];
const ROWS:{name:string;cases:number}[]=[{name:'north',cases:12},{name:'St Mary',cases:30},{name:'Lakeside',cases:5}];
export function joinTableWalkthrough(normalisation:'exact'|'fuzzy'):Walkthrough{
  const table={kind:'data-table',keys:['name'],valueField:'cases',rows:ROWS.map(r=>({key:{name:r.name},value:r.cases})),
    rowCount:ROWS.length,missingValueCount:0} as unknown as import('./data-table.js').DataTable;
  const joined=joinTableToAreas(PARTS.map(({id,name})=>({id,name})),table,{keyField:'name',normalisation});
  const part=(name:string)=>joined.parts.find(p=>p.name===name)!;
  const shape=(name:string)=>ring(PARTS.find(p=>p.name===name)!.ring);
  // A part already joined stays drawn as joined, so the join is seen building up step by step (the practitioner,
  // 2026-11-21: "once a row and feature get joined, the shading should remain").
  const filled=(name:string,value:number):Shape=>({kind:'result',rings:shape(name),label:`${name} · ${value}`,at:PARTS.find(p=>p.name===name)!.at});
  const all=(look?:string,kind:Kind='look',done:Shape[]=[]):Shape[]=>[...PARTS.filter(p=>!done.some(d=>d.label?.startsWith(p.name+' ·'))).map(p=>
    ({kind:p.name===look?kind:'input' as Kind,rings:ring(p.ring),label:p.name,at:p.at})),...done];
  const mary=part('St. Mary').matched;
  // THE TWO TABLES JOINED (2026-11-21): the study area's own table of parts, and the table brought to it, each step
  // marking its rows in words. The practitioner: "The study area geometry also has a table which is what is being joined".
  const gets=(row:number,value:number)=>({table:0,row,state:'matched' as const,word:`gets ${value}`});
  const empty=(row:number)=>({table:0,row,state:'unmatched' as const,word:'no row names it'});
  const onto=(row:number,name:string)=>({table:1,row,state:'matched' as const,word:`onto ${name}`});
  const none=(row:number)=>({table:1,row,state:'unmatched' as const,word:'names no part'});
  const maryMarks=mary?[gets(1,30),onto(1,'St. Mary')]:[empty(1),none(1)],northMarks=[gets(0,12),onto(0,'North')];
  const north=[filled('North',12)],both=[...north,...(mary?[filled('St. Mary',30)]:[])];
  return {title:'Join a table to the study area, step by step',
    tables:[{label:"The study area's parts",columns:['id','name'],rows:PARTS.map(p=>[p.id,p.name])},
      {label:'The table',columns:['name','cases'],rows:ROWS.map(r=>[r.name,String(r.cases)])}],resultColumns:[],steps:[
    step('Two tables: the study area\'s three parts, each with its id and name, and a table of three rows: north 12, St Mary 30, Lakeside 5. The join matches the table\'s "name" to each part\'s name.',all()),
    step('"north" names North: the names are compared with capitals set aside, so the row’s 12 goes onto North.',all(undefined,'look',north),false,northMarks),
    step(mary?'"St Mary" names St. Mary once the full stop is set aside, as the matching chosen does: its 30 goes onto St. Mary.'
      :'"St Mary" is not "St. Mary" written exactly, as the matching chosen requires: the row names no part, and St. Mary stays empty.',
      all('St. Mary',mary?'look':'gone',both),false,[...northMarks,...maryMarks]),
    step('"Lakeside" names no part of this area: the row is left out, and listed as naming no part.',all(undefined,'look',both),false,[...northMarks,...maryMarks,none(2)]),
    step('No row names Riverside: it is drawn, and left empty, rather than left out of the map.',all('Riverside','gone',both),false,[...northMarks,...maryMarks,none(2),empty(2)]),
    step(`What the step passes on: ${joined.counts.matchedParts} of 3 parts with a value, ${joined.counts.unmatchedRows} row naming no part.`,
      joined.parts.map(p=>({kind:p.matched?'result' as const:'gone' as const,rings:shape(p.name),label:p.matched?`${p.name} · ${p.value}`:`${p.name} · empty`,at:PARTS.find(x=>x.name===p.name)!.at})),
      true,[...northMarks,...maryMarks,none(2),empty(2)])]};
}

/** SAMPLE A RASTER, on a made-up grid of 4 by 3 cells (2026-11-22, TODO 6's first batch). At points: each takes the value
 *  of the cell it falls in, or of the four nearest cell centres where bilinear is chosen; a cell with no data and a point
 *  off the grid give no value, each counted apart. Over areas: the cells whose centre is inside are added, each whole. The
 *  last step is what `sampleRaster` or `totalOver` makes of these cells. */
const GRID={origin:[30,-1] as [number,number],resolution:[0.01,-0.01] as [number,number],width:4,height:3,
  values:[12,40,7,0, 25,90,33,5, NaN,18,60,2]};
function walkGrid(){
  const metadata={width:GRID.width,height:GRID.height,origin:GRID.origin,resolution:GRID.resolution,crs:'EPSG:4326',noData:null,
    bands:1,rasterType:'PixelIsArea'} as unknown as RasterGrid['metadata'];
  return {metadata,values:Float64Array.from(GRID.values),asset:{} as RasterGrid['asset']} as unknown as RasterGrid;
}
const cellRing=(c:number,r:number):Position[]=>{const [ox,oy]=GRID.origin,[rx,ry]=GRID.resolution;
  return [[ox+c*rx,oy+r*ry],[ox+(c+1)*rx,oy+r*ry],[ox+(c+1)*rx,oy+(r+1)*ry],[ox+c*rx,oy+(r+1)*ry]];};
const cellCentre=(c:number,r:number):Position=>[GRID.origin[0]+(c+0.5)*GRID.resolution[0],GRID.origin[1]+(r+0.5)*GRID.resolution[1]];
const cellValue=(c:number,r:number)=>{const v=GRID.values[r*GRID.width+c]!;return Number.isFinite(v)?String(v):'no data';};
const gridShapes=(kind:Kind='input',only?:(c:number,r:number)=>boolean):Shape[]=>{const out:Shape[]=[];
  for(let r=0;r<GRID.height;r++)for(let c=0;c<GRID.width;c++)if(!only||only(c,r))
    out.push({kind,rings:ring(cellRing(c,r)),label:cellValue(c,r),at:[cellCentre(c,r)[0]-0.004,cellCentre(c,r)[1]+0.001]});
  return out;};
export function sampleRasterWalkthrough(over:'points'|'areas',method:'cell'|'bilinear'='cell'):Walkthrough{
  const grid=walkGrid();
  if(over==='areas'){
    const AREA2:Position[]=[[30.006,-1.004],[30.027,-1.002],[30.031,-1.024],[30.002,-1.029]];
    const area:Boundary={type:'Polygon',coordinates:ring(AREA2)[0]!};
    const sums=totalOver(area,grid);
    const centreIn=(c:number,r:number)=>pointRelation(cellCentre(c,r),area)!=='Outside';
    const counted=(c:number,r:number)=>centreIn(c,r)&&Number.isFinite(GRID.values[r*GRID.width+c]!);
    const centres=():Shape[]=>{const out:Shape[]=[];for(let r=0;r<GRID.height;r++)for(let c=0;c<GRID.width;c++)
      out.push({kind:centreIn(c,r)?'result':'gone',point:cellCentre(c,r)});return out;};
    return {title:'Sample a raster over areas, step by step',tables:[],resultColumns:[],steps:[
      step('A made-up raster of 12 cells, each holding a count (people, say), and one area. One cell has no data.',[...gridShapes(),{kind:'area',rings:ring(AREA2),label:'Area'}]),
      step('Each cell is tested by its centre: is the centre inside the area, or on its edge? Filled dots are inside.',[...gridShapes(),{kind:'area',rings:ring(AREA2)},...centres()]),
      step('A cell whose centre is inside is counted whole, even where part of it lies outside; a cell whose centre is outside adds nothing, even where part of it lies inside. Nothing is split.',
        [...gridShapes('gone',(c,r)=>!centreIn(c,r)),...gridShapes('look',(c,r)=>centreIn(c,r)),{kind:'area',rings:ring(AREA2)}]),
      step(`What the step passes on: the area, carrying its total, ${sums.total.toLocaleString('en')}, from ${sums.cells} cells; `
        +`${sums.noData?`the ${sums.noData===1?'cell':`${sums.noData} cells`} with no data inside it ${sums.noData===1?'adds':'add'} nothing and ${sums.noData===1?'is':'are'} counted apart, never as 0.`:'every cell inside had a value.'}`,
        [...gridShapes('result',counted),...gridShapes('gone',(c,r)=>!counted(c,r)),{kind:'area',rings:ring(AREA2),label:`Total ${sums.total.toLocaleString('en')}`}],true)]};
  }
  const P:{name:string;at:Position}[]=[{name:'Clinic A',at:[30.013,-1.006]},{name:'Clinic B',at:[30.004,-1.024]},{name:'Clinic C',at:[30.047,-1.012]}];
  const points:PointCollection={type:'FeatureCollection',features:P.map(p=>({type:'Feature',id:p.name,properties:{name:p.name},geometry:{type:'Point',coordinates:p.at}}))};
  const made=sampleRaster(points,grid,{label:'Walk',attribute:'people',...(method==='bilinear'?{method:'bilinear'}:{})} as never);
  const got=(name:string)=>(made.value.features.find(f=>f.properties?.name===name)?.properties as Record<string,unknown>|undefined)?.people;
  const shown=(v:unknown)=>typeof v==='number'?(Number.isInteger(v)?String(v):v.toFixed(1)):'no value';
  const a=P[0]!.at,cA=cellAt(grid.metadata,a as [number,number])!;
  const near=(c:number,r:number)=>{const fx=(a[0]-GRID.origin[0])/GRID.resolution[0]-0.5,fy=(a[1]-GRID.origin[1])/GRID.resolution[1]-0.5;
    const c0=Math.floor(fx),r0=Math.floor(fy);return (c===c0||c===c0+1)&&(r===r0||r===r0+1);};
  const pts=(kind:Kind,names?:string[]):Shape[]=>P.filter(p=>!names||names.includes(p.name)).map(p=>({kind,point:p.at,label:p.name}));
  return {title:'Sample a raster at points, step by step',tables:[],resultColumns:[],steps:[
    step('A made-up raster of 12 cells, each holding a count, and three clinics. One cell has no data; Clinic C lies off the raster.',[...gridShapes(),...pts('input')]),
    method==='bilinear'
      ?step(`Clinic A takes a value between the four nearest cell centres, each weighted by how close it is: ${shown(got('Clinic A'))}.`,
        [...gridShapes('look',near),...gridShapes('gone',(c,r)=>!near(c,r)),...pts('result',['Clinic A'])])
      :step(`Clinic A takes the value of the cell it falls in: ${cellValue(cA[0],cA[1])}. The value is the cell's, not a measurement at the point.`,
        [...gridShapes('look',(c,r)=>c===cA[0]&&r===cA[1]),...gridShapes('gone',(c,r)=>!(c===cA[0]&&r===cA[1])),...pts('result',['Clinic A'])]),
    step(method==='bilinear'?'Clinic B has a cell with no data among its four nearest: it gets no value, never a guess, and is counted apart.'
      :'Clinic B falls in the cell with no data: it gets no value, never 0, and is counted apart.',[...gridShapes(),...pts('look',['Clinic B'])]),
    step('Clinic C is off the raster: it gets no value, and is counted as outside, a question about coverage, not about the data.',[...gridShapes(),...pts('gone',['Clinic C'])]),
    step(`What the step passes on: the three clinics, each with "people" where it has a value: A ${shown(got('Clinic A'))}, B ${shown(got('Clinic B'))}, C ${shown(got('Clinic C'))}. `
      +`${made.counts.sampled} read, ${made.counts.noData} with no data, ${made.counts.outside} outside.`,[...gridShapes(),...pts('result',['Clinic A']),...pts('gone',['Clinic B','Clinic C'])],true)]};
}

/** KEEP POINTS INSIDE THE AREA, on four made-up points (2026-11-22): one inside, one on the outline, one outside, and one
 *  with no location. The last step is what `clipPointsToArea` makes of them, with the outline rule chosen. */
export function clipPointsWalkthrough(keepBoundary:boolean):Walkthrough{
  const area:Boundary={type:'Polygon',coordinates:ring(AREA)[0]!};
  const P:{name:string;at:Position|null}[]=[{name:'Inside',at:[30.012,-1.012]},{name:'On the outline',at:[30.04,-1.02]},
    {name:'Outside',at:[30.052,-1.006]},{name:'No location',at:null}];
  const points:PointCollection={type:'FeatureCollection',features:P.map(p=>({type:'Feature',id:p.name,properties:{name:p.name},
    geometry:p.at?{type:'Point',coordinates:p.at}:null})) as PointCollection['features']};
  const made=clipPointsToArea(points,area,keepBoundary);
  const pt=(kind:Kind,name:string):Shape=>({kind,point:P.find(p=>p.name===name)!.at!,label:name});
  return {title:'Keep points inside the area, step by step',tables:[],resultColumns:[],steps:[
    step('A study area and four made-up points. The fourth, "No location", has no coordinates, so it cannot be drawn.',[{kind:'area',rings:ring(AREA)},pt('input','Inside'),pt('input','On the outline'),pt('input','Outside')]),
    step('"Inside" lies within the area: it is kept.',[{kind:'area',rings:ring(AREA)},pt('result','Inside'),pt('input','On the outline'),pt('input','Outside')]),
    step(`"On the outline" sits exactly on the area's edge: ${keepBoundary?'kept, as set':'set aside, as set'}. A facility on a boundary is in that area's edge, so keeping it is the default; the other choice is a strict "within".`,
      [{kind:'area',rings:ring(AREA)},pt(keepBoundary?'result':'gone','On the outline'),pt('input','Inside'),pt('input','Outside')]),
    step('"Outside" does not fall in the area: set aside. It can still be drawn on a connected map, faint, so you can judge whether losing it was right.',
      [{kind:'area',rings:ring(AREA)},pt('gone','Outside'),pt('input','Inside'),pt('input','On the outline')]),
    step(`"No location" cannot be placed: it is not outside, it is a record nobody could place, and it is counted on its own. `
      +`What the step passes on: ${made.collection.features.length} of 4 points. Inside ${made.inside}, on the outline ${made.boundary}, outside ${made.outside}, no location ${made.missing}.`,
      [{kind:'area',rings:ring(AREA)},...made.collection.features.map(f=>pt('result',String(f.properties?.name)))],true)]};
}

/** SUMMARIZE POINTS TO POLYGONS, on two made-up units sharing an edge and five points with deaths (2026-11-22): each unit
 *  counts the points in it and adds their deaths; a point on the shared edge, one outside and one with no value show what
 *  is counted where. The last step is what `summarizePolygons` makes of them, with the edge rule chosen. */
export function summarizePointsWalkthrough(boundary:'include'|'exclude',valueField:string):Walkthrough{
  const NORTH:Position[]=[[30,-1],[30.04,-1],[30.04,-1.015],[30,-1.015]],SOUTH:Position[]=[[30,-1.015],[30.04,-1.015],[30.04,-1.03],[30,-1.03]];
  const field=valueField.trim()||'deaths';
  const P:{name:string;house:string;at:Position;v:number|null}[]=[{name:'H1',house:'House 1',at:[30.01,-1.006],v:3},{name:'H2',house:'House 2',at:[30.028,-1.009],v:1},
    {name:'H3',house:'House 3',at:[30.015,-1.023],v:2},{name:'H4',house:'House 4',at:[30.025,-1.015],v:4},{name:'H5',house:'House 5',at:[30.032,-1.024],v:null},
    {name:'H6',house:'House 6',at:[30.03,-0.996],v:5}];
  const input={features:[{type:'Feature',properties:{name:'North'},geometry:{type:'Polygon',coordinates:ring(NORTH)[0]!}},
    {type:'Feature',properties:{name:'South'},geometry:{type:'Polygon',coordinates:ring(SOUTH)[0]!}}],sites:[],method:'',crs:'CRS84',notes:[]} as unknown as Polygons;
  const points:PointCollection={type:'FeatureCollection',features:P.map(p=>({type:'Feature',id:p.name,
    properties:{name:p.name,...(p.v===null?{}:{[field]:p.v})},geometry:{type:'Point',coordinates:p.at}}))};
  const made=summarizePolygons(input,points,{label:'Walk',boundary,valueField:field});
  const unit=(name:string)=>made.features.find(f=>(f.properties as {name?:string}).name===name) as unknown as {count:number;total:number;missingValues:number};
  const n=unit('North'),s=unit('South'),scaled=classedScale(made.features)!;
  const shade=(name:string)=>scaled.fill(made.features.find(f=>(f.properties as {name?:string}).name===name)!);
  const houses=(k:number)=>`${k} house${k===1?'':'s'}`;
  // THE UNITS, named; at the end each with what it carries, coloured by its total on Map's scale (the practitioner,
  // 2026-11-22: "two rectangles not having any difference at the end"; 2026-11-26: the shading should follow the scale).
  const units=(kind:Kind,end=false):Shape[]=>[
    {kind,rings:ring(NORTH),label:end?`North: ${houses(n.count)}, ${field} ${n.total}`:'North',at:[30.001,-1.001],...(end?{fill:shade('North')}:{})},
    {kind,rings:ring(SOUTH),label:end?`South: ${houses(s.count)}, ${field} ${s.total}`:'South',at:[30.001,-1.0293],...(end?{fill:shade('South')}:{})}];
  const pt=(kind:Kind,name:string,said?:string):Shape=>{const p=P.find(x=>x.name===name)!;
    return {kind,point:p.at,label:said??`${p.house}: ${p.v===null?'no value':p.v}`};};
  // A HOUSE SET ASIDE IS DRAWN WITHOUT ITS LABEL (2026-11-26): six labels on every step crowded the one the step is
  // about, and the table beside the drawing names every house.
  const quiet=(name:string):Shape=>({...pt('gone',name),label:undefined});
  const onEdge=boundary==='include';
  // THE HOUSES AS A TABLE beside the drawing, each marked as the step counts it.
  const where=(name:string)=>name==='H4'?(onEdge?'North and South':'neither'):name==='H6'?'neither':['H1','H2'].includes(name)?'North':'South';
  const table={label:'The houses, one row each',columns:['House',field,'Inside'],rows:P.map(p=>[p.house,p.v===null?'':String(p.v),where(p.name)])};
  const row=(name:string)=>P.findIndex(p=>p.name===name);
  const mark=(name:string,state:'matched'|'unmatched'|'several',word:string)=>({table:0,row:row(name),state,word});
  return {title:'Summarize points to polygons, step by step',made,tables:[table],resultColumns:[],steps:[
    step(`Two made-up units, North and South, sharing an edge, and six houses, each with its ${field}. House 5 has none recorded.`,
      [...units('input'),...P.map(p=>pt('input',p.name))]),
    step(`North counts the houses inside it, 1 and 2, and adds their ${field}: 3 + 1.`,
      [...units('input'),pt('look','H1'),pt('look','H2'),...['H3','H4','H5','H6'].map(x=>quiet(x))],false,
      [mark('H1','matched','in North'),mark('H2','matched','in North')]),
    step(`South counts houses 3 and 5. House 5 has no ${field}: it is counted as a house, and its missing value is counted apart, never as 0.`,
      [...units('input'),pt('look','H3'),pt('look','H5'),...['H1','H2','H4','H6'].map(x=>quiet(x))],false,
      [mark('H3','matched','in South'),mark('H5','matched',`in South, no ${field}`)]),
    step(onEdge?`House 4 sits on the edge both units share. As set, a house on an edge is counted in every unit it touches: in North and in South. So it is counted twice, and the step says so.`
      :`House 4 sits on the edge both units share. As set, a house on an edge is counted in neither.`,
      [...units('input'),pt(onEdge?'look':'gone','H4',onEdge?'House 4: 4, in both':'House 4: 4, in neither'),...['H1','H2','H3','H5','H6'].map(x=>quiet(x))],false,
      [mark('H4',onEdge?'several':'unmatched',onEdge?'in both':'in neither')]),
    step('House 6 lies in neither unit: it is counted as outside every unit, and adds to neither.',
      [...units('input'),pt('gone','H6','House 6: outside'),...['H1','H2','H3','H4','H5'].map(x=>quiet(x))],false,
      [mark('H6','unmatched','outside')]),
    step(`What the step passes on: the two units, each carrying its count of houses and its total ${field}. North: ${houses(n.count)}, ${field} ${n.total}; `
      +`South: ${houses(s.count)}, ${field} ${s.total}${s.missingValues?`, with ${s.missingValues} house whose ${field} is not recorded`:''}.`
      +(onEdge?' House 4 is in both, so the two counts add up to one more than the houses inside.':''),
      [...units('result',true),...P.map(p=>quiet(p.name))],true,[],{title:`Total ${field}`,entries:scaled.scale})]};
}

/** THE SIX STEPS PUT ON THE STANDARD IN 0.169.0 (2026-11-23): Convex hull, Voronoi catchments, Network isochrone, Mean
 *  center, Move points in a donut and Aggregate points to H3 cells. The metric four measure in UTM zone 36S, where these
 *  made-up shapes lie, and say so; each last step is what the step's own function makes of them. */
const ZONE36S={zone:36,hemisphere:'south' as const};
const M_PER_DEGREE=111320;
const pointsOf=(list:readonly {name:string;at:Position;props?:Record<string,unknown>}[]):PointCollection=>({type:'FeatureCollection',
  features:list.map(p=>({type:'Feature',id:p.name,properties:{name:p.name,...p.props},geometry:{type:'Point',coordinates:p.at}}))});
const km2=(m2:number)=>m2>=1e5?`${(m2/1e6).toLocaleString('en',{maximumFractionDigits:2})} km²`:`${Math.round(m2).toLocaleString('en')} m²`;
const apart=(a:Position,b:Position)=>Math.hypot((a[0]-b[0])*Math.cos(a[1]*Math.PI/180),a[1]-b[1])*M_PER_DEGREE;
const lineTo=(a:Position,b:Position):Position[][][]=>[[[a,b,a]]];

const CASES:{name:string;at:Position}[]=[{name:'Case 1',at:[30.004,-1.006]},{name:'Case 2',at:[30.03,-1.002]},{name:'Case 3',at:[30.038,-1.02]},
  {name:'Case 4',at:[30.02,-1.03]},{name:'Case 5',at:[30.002,-1.022]},{name:'Case 6',at:[30.02,-1.015]}];
export function hullWalkthrough():Walkthrough{
  const node={id:'walk',type:'summarize_hull',x:0,y:0,params:{label:'Walk',...ZONE36S}} as WorkflowNode<'summarize_hull'>;
  const made=convexHull(pointsOf(CASES),node,'walkthrough','walk').value.features[0]!;
  const pt=(kind:Kind,name:string):Shape=>({kind,point:CASES.find(c=>c.name===name)!.at,label:name});
  const outer=CASES.filter(c=>c.name!=='Case 6').map(c=>c.name);
  return {title:'Convex hull, step by step',tables:[],resultColumns:[],steps:[
    step('Six made-up cases, each where it was found.',CASES.map(c=>pt('input',c.name))),
    step('Picture a band stretched around all of them and let go: it catches on the outermost cases, 1 to 5.',
      [...outer.map(n=>pt('look',n)),pt('input','Case 6')]),
    step('Case 6 lies inside the band. It is in the outline, but does not shape it.',[...outer.map(n=>pt('input',n)),pt('look','Case 6')]),
    step(`What the step passes on: the outline, ${km2(made.areaSquareMetres!)} and ${metres(Math.round(made.spanMetres!))} at its widest, measured in UTM zone 36S, where these made-up cases lie. `
      +'It fills the ground between the cases whether anyone was there or not.',[{kind:'result',rings:partsOf(made.geometry)},...CASES.map(c=>pt('input',c.name))],true)]};
}

const PUMPS:{name:string;at:Position}[]=[{name:'Pump A',at:[30.008,-1.008]},{name:'Pump B',at:[30.031,-1.01]},{name:'Pump C',at:[30.018,-1.024]}];
export function voronoiWalkthrough():Walkthrough{
  const area:Boundary={type:'Polygon',coordinates:ring(AREA)[0]!};
  const made=voronoi(pointsOf(PUMPS),area,ZONE36S.zone,ZONE36S.hemisphere);
  const pumps=(kind:Kind):Shape[]=>PUMPS.map(p=>({kind,point:p.at,label:p.name}));
  return {title:'Voronoi catchments, step by step',tables:[],resultColumns:[],steps:[
    step('A study area and three made-up pumps.',[{kind:'area',rings:ring(AREA)},...pumps('input')]),
    // NO HOUSE (2026-11-27). The practitioner: *"it shows 'A house', but the house has got nothing to do with setting up
    // the catchment areas (they are what fall into catchment areas)."* The step takes the pumps and the area; houses are
    // put into the cells by Summarize points to polygons. The house step was said removed on 2026-11-25 (manual,
    // History, 0.5.0) and was not.
    //
    // TWO PUMPS BEFORE THREE (2026-11-25). The practitioner: *"the show me how it works does not really make sense
    // from a step by step perspective."* It did not: step 2 followed ONE house to its nearest pump, and step 3 then
    // showed every dividing line and every finished cell at once. The construction -- which is the thing being
    // taught -- happened between two steps and was described in a sentence rather than drawn.
    //
    // So the division is built up: two pumps and the one line between them, then the third pump and where the lines
    // meet. Both are drawn by `voronoi` itself, on two of the pumps and then on three, so the walkthrough still
    // cannot show something the step would not do.
    step(`Take two of them. Everywhere on one side of a line is nearer ${PUMPS[0]!.name}; everywhere on the other side is nearer ${PUMPS[1]!.name}. `
      +'The line is where they are equally near.',
      [{kind:'area',rings:ring(AREA)},
        ...voronoi(pointsOf(PUMPS.slice(0,2)),area,ZONE36S.zone,ZONE36S.hemisphere).features
          .map(f=>({kind:'look' as const,rings:partsOf(f.geometry)})),
        ...PUMPS.slice(0,2).map(p=>({kind:'input' as const,point:p.at,label:p.name}))]),
    step(`Add the third. Each pair has its own line, and the lines meet where all three are equally near: that is the corner `
      +'where three catchments touch.',
      [{kind:'area',rings:ring(AREA)},...made.features.map(f=>({kind:'look' as const,rings:partsOf(f.geometry)})),...pumps('input')]),
    step(`What the step passes on: ${made.features.length} cells, each the ground nearer its pump than any other, measured in UTM zone 36S. `
      +'They fill the box around the area; Clip polygons cuts them to its outline. Nearest in a straight line is not the way anyone walks.',
      [...made.features.map(f=>({kind:'result' as const,rings:partsOf(f.geometry)})),{kind:'area',rings:ring(AREA)},...pumps('input')],true)]};
}

/** A made-up street grid, seven junctions each way, every street both ways, the spacing a round number of metres. */
function walkStreets(spacingM:number):Network{
  const step=spacingM/M_PER_DEGREE,n=7,nodes:Network['nodes']=[],edges:Network['edges']=[];
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)nodes.push({id:`j${r}${c}`,coordinates:[30+c*step,-1-r*step]});
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)for(const [dr,dc] of [[0,1],[1,0]] as const){
    if(r+dr>=n||c+dc>=n)continue;const a=`j${r}${c}`,b=`j${r+dr}${c+dc}`;
    edges.push({from:a,to:b,lengthM:spacingM},{from:b,to:a,lengthM:spacingM});}
  return {nodes,edges,source:'Made-up streets for the walkthrough'};
}
/** THE STREETS SCALED TO THE TIME SET, so the walk ends inside them: the budget is about two and a half blocks. */
export function isochroneWalkthrough(minutes:number,speedMPerMin:number,bufferM:number):Walkthrough{
  const fits=Number.isFinite(minutes)&&Number.isFinite(speedMPerMin)&&minutes>=0.1&&minutes<=60&&speedMPerMin>=1&&speedMPerMin<=200;
  const t=fits?minutes:5,v=fits?speedMPerMin:80,b=Number.isFinite(bufferM)&&bufferM>=1&&bufferM<=100?bufferM:25;
  const spacing=Math.max(10,Math.round(t*v/2.5/10)*10),network=walkStreets(spacing),at=new Map(network.nodes.map(x=>[x.id,x.coordinates]));
  const centre=3*spacing/M_PER_DEGREE,clinic:Position=[30+centre+spacing*0.2/M_PER_DEGREE,-1-centre-spacing*0.1/M_PER_DEGREE];
  const made=isochrone(pointsOf([{name:'Clinic',at:clinic}]),network,{label:'Walk',...ZONE36S,minutes:t,speedMPerMin:v,bufferM:b,maxSnapM:Math.max(150,spacing),direction:'outbound'});
  const snap=made.snaps?.[0],junction=snap?at.get(snap.nodeId)!:clinic;
  const streets=(kind:Kind):Shape[]=>network.edges.filter((_,i)=>i%2===0).map(e=>({kind,rings:lineTo(at.get(e.from)!,at.get(e.to)!)}));
  const region=made.features[0];
  return {title:'Network isochrone, step by step',tables:[],resultColumns:[],steps:[
    step(`Made-up streets, ${metres(spacing)} between junctions, and a clinic beside them.`,[...streets('input'),{kind:'look',point:clinic,label:'Clinic'}]),
    step(`${t} minutes at ${v} metres a minute is ${metres(Math.round(t*v))} of walking${fits?'':' (shown with 5 minutes at 80 metres a minute, as the time or speed set is not one the step accepts)'}. `
      +`The walk to the nearest junction comes first: ${metres(Math.round(snap?.distanceM??0))}.`,
      [...streets('input'),{kind:'input',point:clinic,label:'Clinic'},{kind:'look',rings:lineTo(clinic,junction)},{kind:'look',point:junction}]),
    // THE STREETS ACTUALLY WALKED, DRAWN (2026-11-25). The practitioner: *"The show me how it works is incomplete as
    // use of a street network is usually point to point."* This step said "along the streets in every direction"
    // and drew only the finished region, so the one thing that makes a network isochrone different from a circle --
    // that every metre is counted along a street, from the origin to somewhere -- was asserted and never shown.
    //
    // `costsWithin` is the step's own reachability, the same function the isochrone runs. A street is drawn as
    // walked where BOTH its junctions were reached within the budget, which is what it means for the walk to have
    // covered it. The region stays beside them, so a reader sees the corridor as what the walked streets grew into.
    step(`From that junction, along the streets in every direction until the ${metres(Math.round(t*v))} are spent, a street left part-way where the time runs out. `
      +`Every metre is counted along a street, never across the ground: the dark streets are the ones the walk covers. `
      +`The ground ${b} m either side of each of them is in reach too.`,
      [...streets('input'),
        ...(():Shape[]=>{
          const adjacency=new Map<string,{to:string;lengthM:number}[]>();
          for(const e of network.edges){const list=adjacency.get(e.from)||[];list.push({to:e.to,lengthM:e.lengthM});adjacency.set(e.from,list);}
          const reached=snap?costsWithin(adjacency,snap.nodeId,t*v,snap.distanceM??0):new Map<string,number>();
          return network.edges.filter((_,i)=>i%2===0)
            .filter(e=>reached.has(e.from)&&reached.has(e.to))
            .map(e=>({kind:'look' as const,rings:lineTo(at.get(e.from)!,at.get(e.to)!)}));
        })(),
        ...(region?[{kind:'look' as const,rings:partsOf(region.geometry)}]:[]),{kind:'input',point:clinic,label:'Clinic'}]),
    step(region?`What the step passes on: where the clinic can reach in ${t} minutes, ${km2(calculateArea(region.geometry,'m2').squareMetres)}, measured in UTM zone 36S. `
      +'Ground between streets is in it only near a street: a field nobody can cross stays out.'
      :'What the step passes on: nothing. The walk to the streets spends the whole time.',
      [...(region?[{kind:'result' as const,rings:partsOf(region.geometry)}]:[]),...streets('input'),{kind:'input',point:clinic,label:'Clinic'}],true)]};
}

const HOMES:{name:string;at:Position;v:number}[]=[{name:'House 1',at:[30.005,-1.005],v:1},{name:'House 2',at:[30.035,-1.006],v:1},
  {name:'House 3',at:[30.012,-1.026],v:1},{name:'House 4',at:[30.032,-1.022],v:6}];
export function meanCenterWalkthrough(weightField:string):Walkthrough{
  const field=weightField.trim(),shown=field||'deaths';
  const points=pointsOf(HOMES.map(h=>({name:h.name,at:h.at,props:{[shown]:h.v}})));
  const once=computeMeanCenter(points,{label:'Walk',...ZONE36S});
  const weighted=computeMeanCenter(points,{label:'Walk',...ZONE36S,weightField:shown});
  const made=field?weighted:once;
  const homes=(kind:Kind):Shape[]=>HOMES.map(h=>({kind,point:h.at,label:`${h.name}: ${h.v}`}));
  const table={label:'The houses, one row each',columns:['House',shown],rows:HOMES.map(h=>[h.name,String(h.v)])};
  const total=HOMES.reduce((t,h)=>t+h.v,0);
  return {title:'Mean center, step by step',tables:[table],resultColumns:[],steps:[
    step(`Four made-up houses, each with its ${shown}.`,homes('input')),
    step('Each counted once, the centre is the average of where they are: the middle of the four.',[...homes('input'),{kind:'look',point:once.coordinates,label:'Each once'}]),
    step(`Counted by ${shown}, House 4 carries ${HOMES[3]!.v} of the ${total}, so it pulls the centre toward it.`,
      [...homes('input'),{kind:'gone',point:once.coordinates,label:'Each once'},{kind:'look',point:weighted.coordinates,label:`By ${shown}`}],false,
      [{table:0,row:3,state:'matched',word:`${HOMES[3]!.v} of ${total}`}]),
    step(`What the step passes on, as set: one point, ${field?`each house counted by its ${field}`:'each house counted once'}, measured in UTM zone 36S. `
      +'Nobody need live there: a centre can fall between houses.',[...homes('input'),{kind:'result',point:made.coordinates,label:'Centre'}],true)]};
}

/** A circle of a radius in metres, in 48 steps, near enough round at the equator. */
const circle=(c:Position,r:number):Position[]=>Array.from({length:48},(_,i)=>{const a=2*Math.PI*i/48;
  return [c[0]+r*Math.cos(a)/(M_PER_DEGREE*Math.cos(c[1]*Math.PI/180)),c[1]+r*Math.sin(a)/M_PER_DEGREE] as Position;});
export function donutWalkthrough(innerM:number,outerM:number,seed:number):Walkthrough{
  const ok=Number.isFinite(innerM)&&Number.isFinite(outerM)&&innerM>=0&&outerM>innerM&&outerM<=5000&&Number.isSafeInteger(seed)&&seed>=0&&seed<=4294967295;
  const inner=ok?innerM:50,outer=ok?outerM:125,s=ok?seed:42;
  const home:Position=[30.02,-1.015];
  const moved=moveDonut(pointsOf([{name:'Home',at:home}]),{label:'Walk',innerM:inner,outerM:outer,seed:s}).features[0]!;
  const to=moved.geometry!.coordinates as Position;
  const close=ring(circle(home,inner)),donut:Position[][][]=[[[...circle(home,outer),circle(home,outer)[0]!],[...circle(home,inner),circle(home,inner)[0]!]]];
  return {title:'Move points in a donut, step by step',tables:[],resultColumns:[],steps:[
    step(`A made-up home where a case lives${ok?'':' (shown with 50 to 125 m and seed 42, as the settings are not ones the step accepts)'}.`,[{kind:'look',point:home,label:'Home'},{kind:'area',rings:ring(circle(home,outer))}]),
    step(`It will not stay within ${metres(inner)} of where it was: so close would give the home away.`,[{kind:'gone',rings:close},{kind:'input',point:home,label:'Home'}]),
    step(`Nor go beyond ${metres(outer)}: so far would put it where it says nothing about the case.`,[{kind:'look',rings:donut},{kind:'input',point:home,label:'Home'}]),
    step(`What the step passes on: the point moved ${metres(Math.round(apart(home,to)))}, in the direction and by the distance seed ${s} picks inside the ring, `
      +`named "${String(moved.properties.name)}"; nothing else of the record is carried. The same seed moves it the same way again, so this teaches the method and protects nobody.`,
      [{kind:'gone',rings:donut},{kind:'gone',point:home},{kind:'result',point:to,label:String(moved.properties.name)}],true)]};
}

export function h3Walkthrough(resolution:number,minOccupancy:number):Walkthrough{
  const r=Number.isInteger(resolution)&&resolution>=0&&resolution<=15?resolution:9;
  const least=Number.isInteger(minOccupancy)&&minOccupancy>=2&&minOccupancy<=100?minOccupancy:2;
  const middle=latLngToCell(-1.015,30.02,r),[side,other]=gridDisk(middle,1).filter(c=>c!==middle).sort();
  const edge=getHexagonEdgeLengthAvg(r,H3_UNITS.m)/M_PER_DEGREE*0.25;
  const near=(cell:string,dx:number,dy:number):Position=>{const [lat,lon]=cellToLatLng(cell);return [lon+dx*edge,lat+dy*edge];};
  const H:{name:string;at:Position;cell:string}[]=[
    {name:'Home 1',at:near(middle,-1,0.5),cell:middle},{name:'Home 2',at:near(middle,1,0.4),cell:middle},{name:'Home 3',at:near(middle,0,-1),cell:middle},
    {name:'Home 4',at:near(side!,0,0),cell:side!},{name:'Home 5',at:near(other!,-0.6,0.3),cell:other!},{name:'Home 6',at:near(other!,0.6,-0.3),cell:other!}];
  const made=aggregateHex(pointsOf(H),{label:'Walk',resolution:r,minOccupancy:least});
  const cellRing=(c:string):Position[][][]=>[[cellToBoundary(c,true) as Position[]]];
  const homes=(kind:Kind):Shape[]=>H.map(h=>({kind,point:h.at}));
  const counts=[middle,side!,other!].map(c=>({cell:c,count:H.filter(h=>h.cell===c).length}));
  const dropped=counts.filter(c=>c.count<least);
  const scaled=classedScale(made.features);
  return {title:'Aggregate points to H3 cells, step by step',made,tables:[],resultColumns:[],steps:[
    step('Six made-up homes.',homes('input')),
    step(`Each falls in one H3 cell at resolution ${r}${r===resolution?'':' (shown at 9, as the resolution set is not one the step accepts)'}: three in one cell, one in the cell beside it, two in another.`,
      [...counts.map(c=>({kind:'look' as const,rings:cellRing(c.cell),label:String(c.count),at:cellToBoundary(c.cell,true)[0] as Position})),...homes('input')]),
    step(dropped.length?`A cell holding fewer than ${least} homes is left out: ${dropped.map(c=>`the one with ${c.count}`).join(' and ')}. A count that small could point to a household.`
      :`Every cell holds at least ${least} homes, so none is left out.`,
      [...counts.map(c=>({kind:(c.count<least?'gone':'look') as Kind,rings:cellRing(c.cell)})),...homes('input')]),
    step(`What the step passes on: ${!made.features.length?`no cell, as each holds fewer than ${least} homes`:made.features.length===1?'1 cell, with its count of homes':`${made.features.length} cells, each with its count of homes`}; the homes themselves are not passed on. `
      +'It counts locations, not what they carry, and it protects nobody on its own.',
      [...made.features.map(f=>({kind:'result' as const,rings:partsOf(f.geometry),label:String((f as {count?:number}).count),
        at:(f.geometry.coordinates as Position[][])[0]![0]!,...(scaled?{fill:scaled.fill(f)}:{})})),...homes('gone')],true,[],
      scaled?{title:made.valueName??'Points in the cell',entries:scaled.scale}:undefined)]};
}
