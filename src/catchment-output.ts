import {RING_RED,RING_BLUE,bandColour,MATPLOTLIB_TAB10,BAND_OPACITY,orderedSteps,categoricalSteps,polygonShading,shadedValues,classRanges,type classifyValues,type classifyCategories,FIGURE_ROLE,markPath,CARRIED_POINT_COLOUR} from './presentation.js';
import type {Polygons} from './catchments.js';
import type {DisplayValue,Receipt} from './results.js';
import {lineLayersSvg,lineVerticesOf,type LineLayerOnMap} from './map-lines.js';
import type {Boundary,Escape,Position,PointCollection,WorkflowNode} from './types.js';
import {observationRadius} from './point-layers.js';
/** POLYGONS ARE DATA, OR THEY ARE THE GROUND A POINT STANDS ON (the practitioner, 2026-11-23: *"polygons can be data
 *  bearing but the polygon can be just context for the points. If there are no points then we must be using the polygon
 *  data if there are any, particularly if we merge a table and a polygon (study area)."*). A hue per feature says "these
 *  are four different things", which a reader needs where the polygons are the subject and does not where they are
 *  context: four provinces under one mine pin were read as four categories.
 *
 *  ONLY A LAYER BUILT FROM THE STUDY AREAS, and only where points are drawn over it (*"Only for polygons derived from
 *  study areas"*, the same day). A layer read from a file is the subject whatever else the map carries: two named
 *  reaches of the Thames under an intake are two things a reader wants told apart, and the first form of this rule
 *  took their colours away. Only the hue-per-feature identity shading is ever suppressed; a layer carrying a value
 *  keeps its classes, so a table joined to the study area is drawn as the data it is.
 *
 *  LINES ARE SUBJECTS TOO (the practitioner, 2026-11-24: *"the polygon shading -- should follow same rule as
 *  points, that when lines are present, no polygon shading as default"*). A route drawn across two study areas is
 *  what the map is about; the areas it crosses are the ground it crosses. Drawn with a hue per area they assert two
 *  categories against a reading the line already gives, and the border between South Sudan and DR Congo was read
 *  that way. The qualifier is unchanged: only a layer built FROM the study areas, and only the hue-per-feature
 *  identity shading, so a layer read from a file and a layer carrying a value are untouched.
 *
 *  `subjectDrawn` rather than `pointsDrawn`, because it is now two kinds of subject and the name was about to lie. */
export function shadeFeaturesOf<T extends {featuresNamed?:boolean}>(
  layer:T,subjectDrawn:boolean,choice?:'each'|'plain'):T{
  if(choice==='each')return layer;
  return choice==='plain'||subjectDrawn?{...layer,featuresNamed:false}:layer;
}
export function polygonDisplay(p:Polygons,view:'map'|'table'|'chart'):DisplayValue{
  if(p.kind==='hexbin'){
    if(view==='chart')throw new Error('H3 cell charts are not configured in this example.');
    return {kind:'point-table',polygons:p,pointTable:true,centers:[],rows:p.features.map(f=>({id:f.id,recordId:f.id,name:f.name,coordinates:p.sites.find(s=>s.id===f.id)?.geometry?.coordinates||null,sourceNodeId:'aggregate_points_to_h3_cell',layerLabel:'H3 aggregate cells (centroids)',attributeTypes:{count:'integer'},attributes:{count:f.count??0}}))};
  }
  if(view==='chart'&&!p.summary)throw new Error('Connect Summarize points in polygons before a catchment chart.');
  if(view==='chart'&&p.summary?.valueField&&p.features.some(f=>f.total!<0))throw new Error('This chart supports nonnegative totals; use Table for signed summaries.');
  return {kind:'point-table',polygons:p,pointTable:true,centers:[],boundary:p.boundary,
    // A LABEL CANNOT BE PINNED TO ONE STUDY. The practitioner, 2026-10-28: *"Labels have to be
    // generic and applicable to similar artifacts in other studies. If we need to identify
    // polygons, we can use polygon_id."*
    //
    // This table said `siteId` for every polygon layer and called them all "Catchments". Neither
    // was true of what it was showing. South London's choropleth shades 32 ADMINISTRATIVE
    // SUB-DISTRICTS, which are not catchments of anything and have no sites -- `area-join.ts:141`
    // sets `siteId:part.id`, making each sub-district its own site to satisfy a required field,
    // and casts the result past the compiler with `as unknown as`. So a practitioner opening that
    // table met a column called `siteId` holding a sub-district's name, under a heading saying the
    // coordinates locate source sites when there are none.
    //
    // `polygon_id` identifies the polygon, which every producer has. `site_id` is emitted only
    // where the layer actually carries that site, which is what the field always meant.
    rows:p.features.map(f=>({id:f.id,recordId:f.id,name:f.name,coordinates:p.sites.find(s=>s.id===f.siteId)?.geometry?.coordinates||null,sourceNodeId:'catchments',layerLabel:p.sites.length?'Polygons (coordinates locate the site each was derived from)':'Polygons',attributeTypes:{},attributes:{polygon_id:f.id,...(p.sites.some(s=>s.id===f.siteId)?{site_id:f.siteId}:{}),
      // WHAT THE POLYGON CARRIES, as it carries it (2026-11-10): a space-time scan's clusters hold their days, counts and
      // p-value as properties, and the table showed none of them. Every polygon layer's own properties now show in Table;
      // a map's rows are unchanged.
      ...(view==='table'?f.properties??{}:{}),...(f.minutes!==undefined?{minutes:f.minutes}:{}),
      // A rule's conclusion about this polygon, and what it enclosed, shown where the polygon is
      // shown. Added 2026-10-14 with the port change that made a ruleset hand back the shapes it
      // judged: a judgement that travels with the record has to be visible on the record, or the
      // table a practitioner reads is poorer than the one the old decisions port gave them.
      // Experiment 113.
      ...(f.status!==undefined?{status:f.status,explanation:f.explanation??null}:{}),
      ...(f.areaSquareMetres!==undefined?{areaSquareMetres:f.areaSquareMetres}:{}),
      ...(p.summary?{locations:f.count!,numericTotal:p.summary.valueField?f.total!:null,missingValues:f.missingValues!}:{})}})),
    ...(view==='chart'?{chart:{field:p.summary!.valueField?'total' as const:'count' as const,caption:(p.features.some(f=>f.minutes!==undefined)?'Cumulative thresholds (not time bands). ':'')+(p.summary!.valueField?`Sum ${p.summary!.valueField} by polygon; missing values reported in Table`:'Location memberships by polygon; overlaps can count more than once'),total:p.summary!.records,bins:p.features.map(f=>({key:f.id,label:f.name,count:p.summary!.valueField?f.total!:f.count!,...(f.minutes===undefined?{}:{order:f.minutes})}))}}:{})};
}
export function polygonPresentationReceipt(node:WorkflowNode,source:string,runId:string,contextSource?:string):Receipt{
  const entity=`urn:fieldwork:run:${runId}:output:${node.id}`,activity=`${entity}:view`,kind=node.type==='map_output'?'MapView':node.type==='table_output'?'TableView':'ChartView';
  const facts=`@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n<${activity}> a fw:${kind}, prov:Activity; prov:used <urn:fieldwork:run:${runId}:output:${source}>.\n<${entity}> a prov:Entity; prov:wasGeneratedBy <${activity}>.\n`;
  const context=node.type==='map_output'&&node.params.contextPoints;
  const presentation=node.type==='map_output'?node.params.presentation||'plot':kind;
  const extra=(contextSource?`<${activity}> prov:used <urn:fieldwork:run:${runId}:output:${contextSource}>.\n`:'')+`<${activity}> fw:parameters ${JSON.stringify(JSON.stringify({presentation,contextPoints:!!context}))}.\n`;
  return {nodeId:node.id,kind:'presentation',facts:facts+extra,input:facts+extra,rules:'',conclusions:[],method:'Display an existing polygon dataset and attributes without changing its geometry, membership or aggregation.'};
}
/** The frame `polygonSvg` draws in, so ground can be placed in it.
 *
 *  Same reason as `mapFrame` and `rasterFrame`: a caller that recomputes this arithmetic gets a
 *  slightly different answer, and a basemap a few pixels out is worse than none. Returns null
 *  where there is nothing to frame, which is the hexbin case with no cells. */
/** A STATIC PLOT'S FRAME, FROM ITS AREA'S SHAPE (2026-11-12, the practitioner: "Ok" to a frame that follows the area). 850
 *  wide always; as tall as the area needs at the plot's width, from 295, every frame's height until then, to 650, the
 *  walking-time plot's. A wide area keeps 295 and draws exactly as before; a tall one, such as Soho's deaths or Hagelloch,
 *  is no longer drawn small in a short strip. */
export function plotFrame(bounds:[number,number,number,number],usable:{width:number;margin:number}){
  const [west,south,east,north]=bounds,cos=Math.cos((south+north)/2*Math.PI/180);
  const w=Math.max((east-west)*cos,.00001),h=Math.max(north-south,.00001);
  const height=Math.max(295,Math.min(650,Math.round(usable.width*h/w+usable.margin)));
  const scale=Math.min(usable.width/w,(height-usable.margin)/h),middle=height/2-2.5;
  return {height,scale,cos,project:(c:Position):[number,number]=>[425+(c[0]-(east+west)/2)*cos*scale,middle-(c[1]-(north+south)/2)*scale]};
}
/** A STUDY AREA WIRED BESIDE THE POLYGONS (2026-11-15): Sierra Leone's scan drew its circles on a blank ground, the
 *  country connected and named in the Sources line but on no figure. Its rings, for the frame and the drawing. */
const contextRings=(area?:Boundary|null):Position[][]=>!area?[]:area.type==='Polygon'?area.coordinates:area.coordinates.flat();
/** `box`: draw over this extent instead of the layers' own, for an inset's enlarged view (2026-11-23). The same
 *  parameter `staticMapFrame` has taken since the inset was built; a map carrying polygons is drawn here instead,
 *  which is why its inset was composed for every other kind of map and not this one. */
/** `lines`: the map's line layers, which are IN THE FRAME exactly as they are in `staticMapFrame` (2026-11-24). A
 *  route drawn across a border lies partly outside the polygons' own extent, and a frame that spans only the
 *  polygons clips it away. */
export function polygonFrame(p:Polygons,area?:Boundary|null,box?:readonly [number,number,number,number],
  lines?:readonly LineLayerOnMap[]):{project:(c:Position)=>[number,number];bounds:[number,number,number,number];height:number;scale:number}|null{
  const coords=p.kind==='hexbin'
    ?[...p.features.flatMap(f=>f.geometry.type==='Polygon'?f.geometry.coordinates.flat():f.geometry.coordinates.flat(2)),
      ...lineVerticesOf(lines??[])]
    :[...p.features.flatMap(f=>(f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat())).flat(),
      ...p.sites.flatMap(f=>f.geometry?[f.geometry.coordinates]:[]),...(p.kind==='hexbin'?[]:contextRings(area).flat()),
      ...lineVerticesOf(lines??[])];
  if(!coords.length)return null;
  let west=Infinity,east=-Infinity,south=Infinity,north=-Infinity;
  for(const c of coords as Position[]){
    if(c[0]<west)west=c[0];if(c[0]>east)east=c[0];
    if(c[1]<south)south=c[1];if(c[1]>north)north=c[1];
  }
  const over:[number,number,number,number]=box?[box[0],box[1],box[2],box[3]]:[west,south,east,north];
  const frame=plotFrame(over,{width:790,margin:60});
  return {bounds:[west,south,east,north],scale:frame.scale,
    height:frame.height+keyBand(p.features),project:frame.project};
}
/** THE KEY'S OWN BAND, under the map rather than over it (2026-11-15): drawn in the frame's last 45 px, Salmonella's
 *  ramp and its labels lay on Switzerland's tiles and place names and could not be read. The figure is this much
 *  taller; the map keeps its place and scale; the band is plain ground, so no tile runs under the key. */
export const KEY_BAND=56;
/** THE CLASS RANGES, LAID OUT SO NONE TOUCHES (the practitioner, 2026-11-21, on Nigeria's LGAs in five quantiles: "The
 *  numbers are overlapping"). Each range was given 90 px, and "31,641 to 111,254" is half as wide again. A class is
 *  as wide as its longest range; where five or more such ranges do not fit across, each is said on two lines, "31,641" over
 *  "to 111,254", and the band is one line taller. At 14 px a digit or comma is taken as 8 px. */
const KEY_LINE=16,RAMP_SPAN=790;
export function rampLayout(features:Polygons['features']):{width:number;lines:string[][]}|null{
  const {classed}=polygonShading(features);
  if(!classed)return null;
  const values=shadedValues(features);
  if(!values.length||!values.every(v=>Number.isInteger(v)))return null;
  const ranges=classRanges(values,classed.breaks),fit=(texts:string[])=>Math.max(90,Math.ceil(Math.max(...texts.map(t=>t.length))*8+16));
  const one=fit(ranges);
  if(one*ranges.length<=RAMP_SPAN)return {width:one,lines:ranges.map(r=>[r])};
  const two=ranges.map(r=>{const at=r.indexOf(' to ');return at<0?[r]:[r.slice(0,at),r.slice(at+1)];});
  return {width:Math.min(fit(two.flat()),Math.floor(RAMP_SPAN/ranges.length)),lines:two};
}
/** The key's band for these features: one line taller where the ranges are said on two. */
export function keyBand(features:Polygons['features']):number{
  return KEY_BAND+(rampLayout(features)?.lines.some(l=>l.length>1)?KEY_LINE:0);
}
/** `over`: the extent to draw across, for an inset's enlarged view; `markScale`, because a drawing shown smaller
 *  keeps its marks the size they are on the page; `withKey: false` for the enlarged part, because a key belongs to
 *  the whole map and two of them invite reading them as different scales. */
/** `over.lines`: the map's line layers, drawn over the areas and under the points, as `staticBoundaryMap` draws
 *  them. Absent until 2026-11-24, which is why a map carrying both polygons and hand-drawn lines drew the lines on
 *  the interactive preview and on no static figure. */
export function polygonSvg(p:Polygons,esc:Escape,area?:Boundary|null,
  over?:{box?:readonly [number,number,number,number];markScale?:number;withKey?:boolean;lines?:readonly LineLayerOnMap[];lineArrows?:import('./map-lines.js').ArrowChoice}):string{
  if(p.kind==='hexbin'){
    const coords=p.features.flatMap(f=>f.geometry.type==='Polygon'?f.geometry.coordinates.flat():f.geometry.coordinates.flat(2));
    if(!coords.length)return '<text x="30" y="40">No cells meet the minimum occupancy</text>';
    // Folded: spreading a province's worth of coordinates into Math.min overflows the call stack.
    let west=Infinity,east=-Infinity,south=Infinity,north=-Infinity;
    for(const c of coords){
      if(c[0]<west)west=c[0];if(c[0]>east)east=c[0];
      if(c[1]<south)south=c[1];if(c[1]>north)north=c[1];
    }
    for(const c of lineVerticesOf(over?.lines??[])){
      if(c[0]<west)west=c[0];if(c[0]>east)east=c[0];
      if(c[1]<south)south=c[1];if(c[1]>north)north=c[1];
    }
    const framed=plotFrame(over?.box?[...over.box] as [number,number,number,number]:[west,south,east,north],{width:790,margin:60});
    const project=framed.project,height=framed.height+(over?.withKey===false?0:keyBand(p.features));
    // SHADED BY COUNT (2026-11-26, PR 6's review): one blue for every cell said only that a cell was released. A cell
    // carries its count as its value, classed as every classed layer is; a layer saved before then keeps the one blue.
    const {classed}=polygonShading(p.features);
    const fill=(f:Polygons['features'][number])=>classed&&typeof f.value==='number'?classed.colours[classed.classOf(f.value)??0]!:'#3686a8';
    return `<rect width="850" height="${height}" fill="#f7faf8"/>`+lineLayersSvg(over?.lines??[],project,over?.markScale??1,over?.lineArrows)+p.features.map(f=>`<path data-hex-cell="${esc(f.id)}" d="M${(f.geometry.type==='Polygon'?f.geometry.coordinates[0]:f.geometry.coordinates[0][0]).map(c=>project(c).join(',')).join('L')}Z" fill="${fill(f)}" fill-opacity="${classed?'.78':'.25'}" stroke="#19617c" stroke-width="1"><title>${esc(f.id)} · ${f.count} locations</title></path>`).join('')
      +(over?.withKey===false?'':classed?plotKey({...p,sites:[],layerName:'H3 cells, sparse cells omitted'},classed,esc,null,height)
        :'<text x="20" y="282" font-size="14">H3 aggregate cells · sparse cells omitted</text>');
  }
  const rings=p.features.flatMap(f=>f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat()),coords=[...rings.flat(),...contextRings(area).flat(),...p.sites.flatMap(f=>f.geometry?[f.geometry.coordinates]:[]),...(p.observations?.features||[]).flatMap(f=>f.geometry?[f.geometry.coordinates]:[]),...lineVerticesOf(over?.lines??[])];if(!coords.length)return '<text x="30" y="40">No intersecting polygons or located points</text>';
  const [west,south,east,north]=coords.reduce(([w,s,e,n],c)=>[Math.min(w,c[0]),Math.min(s,c[1]),Math.max(e,c[0]),Math.max(n,c[1])],[Infinity,Infinity,-Infinity,-Infinity]);
  const framed=plotFrame(over?.box?[...over.box] as [number,number,number,number]:[west,south,east,north],{width:790,margin:60});
  const project=framed.project,height=framed.height+(over?.withKey===false?0:keyBand(p.features));
  // COLOURED BY VALUE WHERE THERE IS ONE, by position where there is not. A catchment's colour
  // says which catchment; a choropleth's colour says how much, and reading the second as the
  // first is the misreading this whole figure exists to avoid. `classifyValues` returns null
  // when nothing carries a value, which is every figure this renderer drew before today.
  // CLASSES THAT CANNOT BE RANKED, and they take precedence because ASKING FOR THEM IS A
  // DECISION SOMEBODY MADE.
  //
  // A feature carries a category only where the join was told to carry one, and telling it to is
  // the practitioner declaring that this figure is about the class. The first version of this
  // let a numeric value win, reasoning that a choropleth must never silently become a map of
  // water companies -- but the table behind Snow's exposure map carries deaths per sub-district
  // AS WELL as the supplying company, so that rule drew the wrong figure for the one case the
  // feature was built for. The protection is real and belongs upstream: a category exists only
  // when it was asked for, so nothing can become categorical by accident.
  const {grouped,classed}=polygonShading(p.features);
  // ORDERED WHERE THERE IS AN ORDER. Bands carry `minutes` and rank; named regions do not, and
  // YlGnBu's whole design is a lightness ramp a reader is meant to rank. Tidal and non-tidal
  // drawn in two steps of it assert a sequence the categories do not have.
  const banded=p.features.some(f=>f.minutes!==undefined);
  // Null past the palette's length: more regions than hues is a neutral wash, not a repeat.
  // A HUE PER FEATURE ONLY WHERE THE FEATURES ARE NAMED THINGS, for the reason `categoricalKey`
  // gives: numbered parts of one layer are not categories, and colouring them as though they
  // were asserts a grouping nobody made.
  const categorical=classed||grouped||banded||p.featuresNamed===false?null
    :categoricalSteps(p.features.length);
  // THE WASH THE PALETTE PROMISES. `categoricalSteps` returns null past its length and says in
  // its own comment that "the caller keeps its neutral fill"; this caller fell through to
  // `orderedSteps`, which is YlGnBu -- a SEQUENTIAL ramp. So 34 named regions with no value and
  // no rank were drawn in a lightness sequence a reader is meant to rank, which is the precise
  // misreading the categorical work of 2026-10-28 was done to prevent. Written into the comment
  // that day and not into the line beneath it; reported 2026-10-29 off a published figure.
  //
  // Bands keep the ramp, because minutes DO have an order. Everything else past the palette is
  // one neutral: no hue competing, and the naming left to the labels and the key.
  const wash=!classed&&!grouped&&!banded&&!categorical;
  const colors=classed?classed.colours
    :grouped?grouped.colours
    :categorical??(wash?[FIGURE_ROLE.unknown]:orderedSteps(p.features.length));
  const context=contextRings(area);
  return `<rect width="850" height="${height}" fill="#f7faf8"/>`
    +(context.length?`<path data-fill-role="context" data-study-area d="${context.map(ring=>'M'+ring.map(c=>project(c as Position).join(',')).join('L')+'Z').join(' ')}" fill="#dbe8d6" stroke="#668870" stroke-width="1.5"/>`:'')
    +p.features.map((f,i)=>{const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;const at=classed?classed.classOf(f.value):grouped?grouped.classOf(f.category):null;
    // A part with no value is drawn in a neutral, never in the lowest class: an unmatched
    // boundary would otherwise read as a finding of low incidence rather than as no data.
    // A part with no class is drawn in the neutral for the same reason a part with no value is:
    // a sub-district nobody has assigned a company to must not read as belonging to the first.
    const fill=classed||grouped?(at===null?FIGURE_ROLE.unknown:colors[at]):colors[i%colors.length];
    // Value-bearing fills are readable at full strength; a catchment's identity wash is not
    // the same thing and keeps the lighter tint it has always had.
    // A RING, outline only, where the polygon stands for one place (a cluster at one house): what is under it shows.
    const opacity=f.ring?'0':classed||grouped?(at===null?'.18':'.78'):categorical?'.55':wash?'.16':'.22';
    return `<path data-catchment="${esc(f.id)}"${f.ring?' data-ring=""':''}${classed&&f.value!==undefined?` data-value="${f.value}"`:''}${grouped&&f.category?` data-category="${esc(f.category)}"`:''} d="${polys.flat().map(r=>'M'+r.map(c=>project(c).join(',')).join('L')+'Z').join('')}" fill="${fill}" fill-opacity="${opacity}" fill-rule="evenodd" stroke="${f.ring?(f.ring==='secondary'?RING_BLUE:RING_RED):classed?FIGURE_ROLE.quietInk:fill}" stroke-width="${f.ring?'3.5':classed?'.6':'1'}"><title>${esc(f.name)}${f.category?` · ${esc(f.category)}`:''}${f.value===undefined?'':` · ${f.value}`}${f.count===undefined?'':` · ${f.count} locations`}</title></path>`;}).join('')
    // OVER THE AREAS AND UNDER THE POINTS, which is where `staticBoundaryMap` draws them: a route is read against
    // the ground it crosses, and a mark it passes through must stay visible.
    +lineLayersSvg(over?.lines??[],project,over?.markScale??1,over?.lineArrows)+(p.observations?.features||[]).filter(f=>f.geometry).map(f=>{const [x,y]=project(f.geometry!.coordinates);return `<circle cx="${x}" cy="${y}" r="${(observationRadius(p,f.properties)*(over?.markScale??1)).toFixed(2)}" fill="${p.observationSymbol?.colour??CARRIED_POINT_COLOUR}" fill-opacity=".85" stroke="#222" stroke-width=".6"><title>${esc(f.properties.name)}</title></circle>`;}).join('')+p.sites.filter(f=>f.geometry).map(f=>{const [x,y]=project(f.geometry!.coordinates);return `<rect x="${x-4*(over?.markScale??1)}" y="${y-4*(over?.markScale??1)}" width="${8*(over?.markScale??1)}" height="${8*(over?.markScale??1)}" fill="#174d47"><title>${esc(f.properties.name)}</title></rect>`;}).join('')
    // THE KEY BELONGS TO THE WHOLE MAP. The enlarged part of an inset draws none: two keys on one figure invite a
    // reader to take them as two scales, and the classes are the same either way because both drawings are made
    // from the same features -- only the extent differs.
    +(over?.withKey===false?''
      :`<rect data-plot-key-band x="0" y="${height-keyBand(p.features)}" width="850" height="${keyBand(p.features)}" fill="#f7faf8"/>`+plotKey(p,classed,esc,grouped,height,over?.lines));
}

// THE KEY NAMES WHAT IS DRAWN, and nothing else. This line was a fixed string -- "Squares:
// sites · dots: observations · polygons: modeled catchments" -- printed under every figure this
// renderer produced, including a choropleth of sub-district mortality that has no sites, no
// observations and no modeled catchment anywhere on it. A key that describes marks the figure
// does not carry is worse than no key: it is the one part of a figure a reader trusts without
// checking. `EveryMarkIsInTheKey` in map-conformance asks the converse of the same question.
function plotKey(p:Polygons,classed:ReturnType<typeof classifyValues>,esc:Escape,
  grouped:ReturnType<typeof classifyCategories>=null,height=295,lines?:readonly LineLayerOnMap[]):string{
  // AT THE FOOT OF THE FRAME, whatever its height (2026-11-13): placed for 295, the ramp sat across the middle of Botswana's
  // districts in a 650 frame. A 295 frame draws it where it always was.
  const foot=height-295;
  const marks:string[]=[];
  if(p.sites.some(f=>f.geometry))marks.push('squares: sites');
  if((p.observations?.features||[]).some(f=>f.geometry))marks.push('dots: observations');
  // What the polygons ARE differs with what they carry. A catchment is modeled; a boundary
  // shaded by a joined value is measured, and calling it modeled would misreport its standing.
  // WHAT THE POLYGONS ARE, in the layer's own name where it has one. "Polygons: modeled
  // catchments" was printed under a figure of the Thames on 2026-10-29: these were read from a
  // published extract and modelled by nobody. A catchment is modelled; a read water body is not,
  // and the key is the one part of a figure a reader trusts without checking.
  // WHAT THE SHADE IS, by the layer's own name for it where it gives one: "population, people per pixel", not "the joined
  // value", which a raster's totals are not.
  marks.push(classed?`polygon shade: ${p.valueName?.trim()||'the joined value'}`
    :p.layerName?.trim()?`polygons: ${p.layerName.trim()}`
    :p.features.some(f=>f.minutes!==undefined)?'polygons: modeled catchments'
    :'polygons: the layer drawn');
  // THE LINES, NAMED BY THEIR OWN STEP (2026-11-24). `EveryMarkIsInTheKey` asks exactly this of a figure, and a
  // route drawn in purple over four provinces has no other place a reader can learn what it is. After the polygons,
  // because the first entry is the one the sentence capitalises and the subject belongs there.
  for(const layer of lines??[])if(layer.features.length)marks.push(`lines: ${layer.label}`);
  // The method belongs on the key line, not beside the ramp: set beside it, the sentence ran
  // across the polygons it was explaining.
  const method=classed?` · ${classed.classes} ${classed.method==='quantile'
    ?`quantile classes, ${classed.merged?'tied values kept in one class':'about equal counts'}, so the shade shows rank`
    :'equal-interval classes, equal value spans, so the shade shows magnitude'}`
    // SAID, so a reader is not left to infer from the absence of breaks that there is an order.
    :grouped?` · polygon shade: the class each part belongs to, which has no order`:'';
  const key=`<text data-plot-key="line" x="20" y="${foot+(classed||grouped?290:282)}" font-size="14">`
    +esc(marks.join(' · ').replace(/^./,c=>c.toUpperCase())+method)+'</text>';
  // THE CLASSES, NAMED. A categorical figure's key is the only place a reader learns what a hue
  // MEANS -- there is no ramp to read and no breaks to interpolate -- so a swatch without its
  // label is a colour with no referent. `EveryMarkIsInTheKey` asks the converse of this.
  //
  // Laid out in rows of two rather than a strip, because a class label is a phrase ("Southwark
  // and Vauxhall Company only") and not a number, and a strip of 56-pixel swatches has nowhere
  // to put one.
  if(grouped){
    const perRow=2,swatch=11;
    return grouped.labels.map((label,i)=>{
      const x=22+(i%perRow)*402,y=foot+250+Math.floor(i/perRow)*18;
      return `<rect data-plot-key="class" x="${x}" y="${y}" width="${swatch}" height="${swatch}" `
        +`fill="${grouped.colours[i]}" fill-opacity=".78" `
        +`stroke="${FIGURE_ROLE.quietInk}" stroke-width=".4"/>`
        +`<text data-plot-key="class" x="${x+swatch+6}" y="${y+swatch-1}" font-size="14" `
        +`fill="${FIGURE_ROLE.quietInk}">${esc(label)}</text>`;
    }).join('')+key;
  }
  if(!classed)return key;

  // A SHADE WITHOUT ITS BREAKS SAYS ONLY "MORE" AND "LESS". The classes are quantiles taken from
  // the data, so every break printed here is a value that occurs in it and a reader can find the
  // sub-district that sits on one. Experiment 137.
  const values=shadedValues(p.features);
  const lowest=Math.min(...values);
  // THE RAMP WITH ITS EDGES, as the practitioner reads it (2026-11-13: "The legend is readable"), each class 90 pixels wide
  // so seven-figure edges with their separators stand apart: at 56, Botswana's 143454 and 217031 touched.
  const layout=rampLayout(p.features),extra=layout?.lines.some(l=>l.length>1)?KEY_LINE:0;
  const width=layout?.width??90,left=40,top=foot+250-extra;
  const round=(v:number)=>{const a=Math.abs(v);return Number(a>=100?v.toFixed(0):a>=10?v.toFixed(1):v.toFixed(2)).toLocaleString('en');};
  const swatches=classed.colours.map((colour,i)=>
    `<rect x="${left+i*width}" y="${top}" width="${width}" height="10" fill="${colour}" `
    +`fill-opacity=".78" stroke="${FIGURE_ROLE.quietInk}" stroke-width=".4"/>`).join('');
  // WHOLE NUMBERS ARE LABELLED BY CLASS, under each shade: a count's class above 1 and up to 5 holds 2 to 5, and an
  // edge "1" between two shades said neither (Salmonella's Länder, 2026-11-15).
  const edges=values.every(v=>Number.isInteger(v))
    ?(layout?.lines??classRanges(values,classed.breaks).map(r=>[r])).map((said,i)=>said.map((line,j)=>
      `<text data-plot-key="range" x="${left+i*width+width/2}" y="${top+23+j*KEY_LINE}" font-size="14" text-anchor="middle" `
      +`fill="${FIGURE_ROLE.quietInk}">${esc(line)}</text>`).join('')).join('')
    :[lowest,...classed.breaks].map((v,i)=>
    `<text x="${left+i*width}" y="${top+23}" font-size="14" text-anchor="middle" `
    +`fill="${FIGURE_ROLE.quietInk}">${round(v)}</text>`).join('');
  return swatches+edges+key;
}

/** The plot's frame: the extent it fits, the pixels it gives a degree of latitude, and the
 *  projection itself.
 *
 *  Exported so a scale bar is drawn from the same number the geometry was drawn with. Computing it
 *  twice is the defect this repository keeps finding -- two lists that must agree will not -- and a
 *  scale bar that disagrees with its own map is worse than none, because a reader measures off it.
 *  Returns null when there is nothing located to plot. */
export function catchmentFrame(p:Polygons,context?:PointCollection):{project:(c:Position)=>number[];pixelsPerDegreeLatitude:number;bounds:[number,number,number,number]}|null{
  const sites=context?.features||p.sites,observations=p.observations?.features||[];
  const coords=[...p.features.flatMap(f=>(f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat()).flat()),...sites.flatMap(f=>f.geometry?[f.geometry.coordinates]:[]),...observations.flatMap(f=>f.geometry?[f.geometry.coordinates]:[])];
  if(!coords.length)return null;
  const [west,south,east,north]=coords.reduce(([w,s,e,n],c)=>[Math.min(w,c[0]),Math.min(s,c[1]),Math.max(e,c[0]),Math.max(n,c[1])],[Infinity,Infinity,-Infinity,-Infinity]);
  const cos=Math.cos((south+north)/2*Math.PI/180),scale=Math.min(680/Math.max((east-west)*cos,.00001),490/Math.max(north-south,.00001));
  return {project:(c:Position)=>[460+(c[0]-(east+west)/2)*cos*scale,310-(c[1]-(north+south)/2)*scale],
    pixelsPerDegreeLatitude:scale,bounds:[west,south,east,north]};
}

/** NB04-style geographic plot. SVG retains vector geometry for export. */
export function catchmentPlot(p:Polygons,esc:Escape,context?:PointCollection):string{
  const sites=context?.features||p.sites,observations=p.observations?.features||[];
  const frame=catchmentFrame(p,context);
  if(!frame)return '<text x="40" y="50">No located geometry to plot</text>';
  const {project,bounds:[west,south,east,north]}=frame;
  let svg=`<desc>${esc(p.method+' / '+p.notes.join(' '))}</desc>`+// The frame around the plot was 740x530 of ink carrying nothing, and the heading duplicated the
  // title the standalone figure already puts above it. Both removed 2026-10-13, after Tufte: what is
  // left on the page is the geometry, its axis labels, and the furniture a reader measures with.
  '<rect width="850" height="650" fill="white"/>';
  for(let i=0;i<=4;i++){const lon=west+(east-west)*i/4,lat=south+(north-south)*i/4,x=project([lon,south])[0],y=project([west,lat])[1];svg+=`<text x="${x}" y="595" text-anchor="middle" font-size="14">${lon.toFixed(4)}</text><text x="78" y="${y+4}" text-anchor="end" font-size="14">${lat.toFixed(4)}</text>`;}
  svg+='<text x="455" y="617" text-anchor="middle" font-size="14">Longitude</text><text transform="translate(20,310) rotate(-90)" text-anchor="middle" font-size="14">Latitude</text>';
  for(const f of [...p.features].sort((a,b)=>(b.minutes||0)-(a.minutes||0))){const rings=f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat();svg+=`<path data-catchment="${esc(f.id)}" d="${rings.map(r=>'M'+r.map(c=>project(c).join(',')).join('L')+'Z').join('')}" fill="${f.minutes!==undefined?bandColour(f.minutes,p.features.map(x=>x.minutes??0)):MATPLOTLIB_TAB10[0]}" fill-opacity="${BAND_OPACITY}" fill-rule="evenodd"><title>${esc(f.name)}</title></path>`;}
  // THE COLOURS THE KEY NAMES, and the shapes it draws. This plot used `gray` and `red` while the
  // legend beside it named Okabe-Ito's #CC79A7 and #E69F00 and drew the sites as squares, so a
  // reader matching marks to the key matched nothing. Worse than a mismatch: `red` on `gray` is
  // the pair that fails first under the commonest colour vision deficiencies, and neither colour
  // is in the declared palette -- which is what CategoricalPaletteIsColourBlindSafe exists to
  // prevent, on a figure it was not checking. Found 2026-10-25 by rendering it to look at it.
  //
  // Shape carries the distinction as well as hue, so the two are told apart without colour.
  for(const [fs,color,r,shape,kind] of [
    [observations,FIGURE_ROLE.secondary,2.7,'circle','observation'],
    [sites,FIGURE_ROLE.site,4,'square','site']] as const)
    for(const f of fs){if(!f.geometry)continue;const [x,y]=project(f.geometry.coordinates);
      // THE CARRIED POINTS BY THEIR LAYER'S SYMBOL, as on every other map of them (2026-11-27): sized and coloured as Map's
      // Configure sets the layer, so the isochrone plot agrees with its interactive map and its Preview.
      const own=kind==='observation'&&p.observationSymbol;
      svg+=`<path data-plot-${kind}="${esc(f.id)}" d="${markPath(shape,x,y,own?observationRadius(p,f.properties):r)}" fill="${own?p.observationSymbol!.colour:color}" stroke="white" stroke-width=".8"><title>${esc(f.properties.name)}</title></path>`;}
  const times=[...new Set(p.features.flatMap(f=>f.minutes===undefined?[]:[f.minutes]))].sort((a,b)=>a-b);
  return svg+`<text x="425" y="640" text-anchor="middle" font-size="14">${times.length?'Cumulative regions: '+times.join(', ')+' min · ':''}Dots: observations · squares: sites · CRS84</text>`;
}

/** MAPS SIDE BY SIDE, ONE SCALE (Map's manual, History: panels). Each panel draws the features of one polygon layer; the classes are
 *  taken over every panel's values together, so a shade is the same number in every panel; the panels share one frame,
 *  so a district sits in the same place in each; and the figure has one key. The practitioner, 2026-11-13: "Static it
 *  would be a 2x2 map panel." */
export type PanelGrid='row'|'grid'|'column';
export interface MapPanel {layer:string; title?:string}
export function panelColumns(grid:PanelGrid,count:number):number{
  return grid==='column'?1:grid==='row'?Math.max(1,count):Math.min(2,Math.max(1,count));
}
export function polygonPanelsSvg(p:Polygons,panels:readonly MapPanel[],grid:PanelGrid,esc:Escape):string{
  const shown=panels.filter(panel=>p.features.some(f=>f.layerName===panel.layer));
  if(!shown.length)return '<text x="30" y="40">No polygon layer to put in a panel</text>';
  const drawn=p.features.filter(f=>shown.some(panel=>panel.layer===f.layerName));
  let west=Infinity,east=-Infinity,south=Infinity,north=-Infinity;
  for(const f of drawn)for(const ring of f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat())
    for(const c of ring){if(c[0]<west)west=c[0];if(c[0]>east)east=c[0];if(c[1]<south)south=c[1];if(c[1]>north)north=c[1];}
  // ONE CLASSIFICATION OVER EVERY PANEL'S VALUES: the hard stop of the panels' design.
  const {grouped,classed}=polygonShading(drawn);
  const columns=panelColumns(grid,shown.length),rows=Math.ceil(shown.length/columns);
  const gap=16,left=20,cellWidth=(850-2*left-gap*(columns-1))/columns,title=22;
  const cos=Math.cos((south+north)/2*Math.PI/180),w=Math.max((east-west)*cos,1e-5),h=Math.max(north-south,1e-5);
  const cellHeight=Math.round(Math.min(cellWidth*h/w,rows===1?520:300))+title;
  const scale=Math.min(cellWidth/w,(cellHeight-title)/h);
  const keyRoom=classed||grouped?70:40,height=Math.max(295,rows*cellHeight+(rows-1)*gap+keyRoom+10);
  const cells=shown.map((panel,i)=>{
    const x0=left+(i%columns)*(cellWidth+gap),y0=10+Math.floor(i/columns)*(cellHeight+gap);
    const cx=x0+cellWidth/2,cy=y0+title+(cellHeight-title)/2;
    const project=(c:Position)=>[cx+(c[0]-(east+west)/2)*cos*scale,cy-(c[1]-(north+south)/2)*scale];
    const paths=p.features.filter(f=>f.layerName===panel.layer).map(f=>{
      const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
      const at=classed?classed.classOf(f.value):grouped?grouped.classOf(f.category):null;
      const fill=classed||grouped?(at===null?FIGURE_ROLE.unknown:(classed??grouped)!.colours[at]):FIGURE_ROLE.unknown;
      return `<path data-catchment="${esc(f.id)}"${f.value!==undefined?` data-value="${f.value}"`:''} d="${polys.flat().map(r=>'M'+r.map(c=>project(c).join(',')).join('L')+'Z').join('')}" `
        +`fill="${fill}" fill-opacity="${at===null&&(classed||grouped)?'.18':'.78'}" fill-rule="evenodd" stroke="${FIGURE_ROLE.quietInk}" stroke-width=".6">`
        +`<title>${esc(f.name)}${f.value===undefined?'':` · ${f.value}`}</title></path>`;}).join('');
    return `<g data-map-panel="${esc(panel.layer)}"><rect x="${x0}" y="${y0+title}" width="${cellWidth}" height="${cellHeight-title}" fill="#f7faf8" stroke="${FIGURE_ROLE.quietInk}" stroke-width=".4"/>`
      +`<text x="${x0}" y="${y0+15}" font-size="14" font-weight="600">${esc(panel.title?.trim()||panel.layer)}</text>${paths}</g>`;
  }).join('');
  // ONE KEY FOR THE FIGURE, and the limitation said in it: side by side is not a difference, and no panel is right.
  const key=plotKey({...p,features:drawn},classed,esc,grouped,height-10)
    .replace(/(polygon shade: [^<·]*?)(\s*·|<)/i,'$1, one scale for every panel; side by side, not a difference$2');
  return `<rect width="850" height="${height}" fill="#ffffff"/>${cells}${key}`;
}
