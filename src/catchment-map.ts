import {escapeHtml} from './html-escape.js';
import {LINE_COLOURS,arrowIconSvg,endBearing,marksDirection} from './map-lines.js';
import {proportionalRadius,layerRanks,colouredClasses,MERGED_MARKS_FROM,recordAttributesHtml,observationRadius} from './point-layers.js';
import {RASTER_POINT_COLOURS} from './raster-panels.js';
import {GlMarks,type GlMark} from './gl-marks.js';
/** THE STACK IS PANES, NOT ARITHMETIC (2026-11-23). Leaflet stacks markers within a pane by latitude -- each marker's
 *  own z comes from its projected y in pixels -- so ordering layers by `zIndexOffset` meant reserving a band wider than
 *  any layer's pixel spread: a stride of 10,000, and 100,000,000 to put the sites over all of it. The practitioner,
 *  reading those numbers: *"Why do we have 10,000 layers when the points really are a layer group?"* They are a group,
 *  and the groups were already built -- for switching on and off. A Leaflet FeatureGroup reserves no z of its own, so
 *  order stayed arithmetic while visibility was structural, and the two knew nothing about each other. That is how a
 *  layer the list could not name took the 1000 fallback, x 10,000, and sat above everything: one mine pin under 1,171
 *  bat records that no reordering could lift.
 *
 *  A pane per layer makes the order structural. A layer with no position cannot outrank everything, because it has to
 *  be IN a pane to be drawn, and the pane IS its position. Leaflet's own latitude ordering then does what it is for,
 *  within one layer, which is what the stride was reserving room for. The static figure and the GPU renderer were
 *  already structural -- both sort and draw in order -- so this was the one place a number stood in for a position.
 *
 *  Panes sit between Leaflet's `markerPane` (600) and `tooltipPane` (650), which leaves room for MAX_MANAGED_LAYERS
 *  and keeps every tooltip and popup over every mark. The note at the sites below records a 2026-10-21 attempt that
 *  broke the vector basemap's attribution; what broke it was a pane the basemap bridge drew into, not panes as such --
 *  `gl-marks.ts` and `study-area-map.ts` have shipped their own since. Checked here against the attribution. */
const MARKS_PANE_BASE=601;
const SITES_PANE='fw-sites';
/** Above every point layer, below the tooltips: a pump covered by a death mark could not be clicked (gate 134,
 *  2026-11-12), and that was the first thing the arithmetic was holding up. */
const SITES_PANE_Z=640;
import {MAX_MANAGED_LAYERS} from './map-layer-list.js';
import L from 'leaflet';
import {TurnedImage} from './turned-image.js';
/** HOW MANY STREET SEGMENTS AN INTERACTIVE MAP DRAWS. See the sampling below for the measurement
 *  this comes from: past about a quarter of a million, every pan and zoom reprojects them all. */
import {generationColours} from './presentation.js';
import {TILE_CREDIT,tilesOnDevice,unpackTile,type TileExtractSpec} from './tile-extract.js';
export const INTERACTIVE_SEGMENT_LIMIT=200_000;
import type {Polygons} from './catchments.js';
import type {PointCollection,Escape,Position} from './types.js';

import {basemapOptions,BASEMAP_LABELS,basemapKey,keyedProvider,PROVIDER_NAMES,type BasemapChoice} from './basemaps.js';
import {groupedKey,RING_RED,RING_BLUE,bandColour,BAND_OPACITY,layerSymbol,markPath,markRadius,polygonShading,shadedValues,classRanges,categoricalSteps,FIGURE_ROLE,CARRIED_POINT_COLOUR} from './presentation.js';
import type {LayerShape,FillClass,FillEncoding} from './presentation.js';
import {fillClass,SPATIAL_RELATION_FILL,MARK_HALO} from './presentation.js';
import {rasterImage} from './raster-image.js';
export type {BasemapChoice};

/** OpenFreeMap serves VECTOR tiles, not raster, so these cannot be an `L.tileLayer` URL.
 *
 *  The practitioner asked for them on 2026-10-17: *"OpenFreeMap has more to offer down the road
 *  in terms of communication stage."* That is the right reason to want them — Positron, Liberty
 *  and Bright are cartographic DESIGNS, not just another tile server, and choosing one is the
 *  kind of judgment [118](../docs/experiments/118-cartographic-judgment-as-rules.md) records as
 *  `selected` rather than inferred.
 *
 *  Vector styles need MapLibre GL. The renderer is not swapped: `@maplibre/maplibre-gl-leaflet`
 *  puts a MapLibre canvas underneath the existing Leaflet layers, so everything this application
 *  draws — the polygons, the 188 markers, the layer control — is untouched and only layer 0
 *  changes.
 *
 *  **Attribution comes from the source and is not added here.** The TileJSON at
 *  `tiles.openfreemap.org/planet` carries its own `attribution` -- OpenFreeMap, OpenMapTiles and
 *  OpenStreetMap, linked -- which MapLibre surfaces through the bridge into Leaflet's control.
 *  Adding it by hand produced a near-duplicate credit that outlived the layer, because Leaflet
 *  refcounts attributions and the source's copy is removed with the layer while a hand-added one
 *  is not. Caught in WebKit on 2026-10-17. The obligation was already being met.
 *
 *  Data is OpenStreetMap; the project is MIT; there is no key and no stated request limit.
 *  Offline bulk download is capped at 3,000 tiles or 50 MB by their terms, which this
 *  application never approaches because it fetches only what is viewed. */
const VECTOR_BASEMAPS={
  'ofm-liberty':{label:'OpenFreeMap Liberty',style:'https://tiles.openfreemap.org/styles/liberty'},
  'ofm-positron':{label:'OpenFreeMap Positron (muted)',style:'https://tiles.openfreemap.org/styles/positron'},
  'ofm-bright':{label:'OpenFreeMap Bright',style:'https://tiles.openfreemap.org/styles/bright'},
} as const;
let workerReady=false,extractProtocol=false;
export const isVectorBasemap=(choice:BasemapChoice):choice is keyof typeof VECTOR_BASEMAPS=>
  Object.hasOwn(VECTOR_BASEMAPS,choice);
const BASEMAPS={
  osm:{label:'OpenStreetMap streets',url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19},
  topo:{label:'OpenTopoMap terrain',url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC BY-SA)',maxZoom:17}
} as const;

/** BASEMAPS ON THE PERSON'S OWN KEY (experiment 222): CARTO's raster styles and Esri's static basemap tiles and imagery.
 *  The key travels in every tile address, as both providers require; the credentials manual says so, and says to lock the
 *  key to Fieldwork's address. Esri's credit is the service's own copyright text after "Powered by Esri", read once a style
 *  is drawn. Undefined where the choice needs no key. */
const ESRI_STATIC='https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1';
const ESRI_IMAGERY='https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const CARTO_ATTRIBUTION='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';
const ESRI_POWERED='Powered by <a href="https://www.esri.com">Esri</a>';
interface KeyedSource {label:string;url:string;attribution:string;maxZoom:number;tileSize?:number;zoomOffset?:number;detectRetina?:boolean;credit?:string}
function keyedSource(choice:BasemapChoice,key:string):KeyedSource|undefined{
  const k=encodeURIComponent(key),label=BASEMAP_LABELS[choice].split(' \u00b7 ')[0]!;
  const carto={'carto-positron':'light_all','carto-voyager':'voyager','carto-dark-matter':'dark_all'}[choice as string];
  if(carto)return {label,url:`https://basemaps.cartocdn.com/rastertiles/${carto}/{z}/{x}/{y}{r}.png?key=${k}`,attribution:CARTO_ATTRIBUTION,maxZoom:20};
  if(choice==='esri-imagery')return {label,url:`${ESRI_IMAGERY}/tile/{z}/{y}/{x}?token=${k}`,attribution:ESRI_POWERED,maxZoom:19,
    credit:`${ESRI_IMAGERY}?f=json&token=${k}`};
  const style={'esri-streets':'arcgis/streets','esri-outdoor':'arcgis/outdoor'}[choice as string];
  if(style)return {label,url:`${ESRI_STATIC}/${style}/static/tile/{z}/{y}/{x}?token=${k}`,attribution:ESRI_POWERED,maxZoom:19,
    tileSize:512,zoomOffset:-1,credit:`${ESRI_STATIC}/${style}/static?f=json&token=${k}`};
  return undefined;
}
/** WHY A TILE ON A KEY FAILED, asked once of the provider for the same address (2026-11-22: CARTO "did not answer for this
 *  key" for the practitioner; CARTO had answered 403, the key being locked to Fieldwork's published address). The HTTP
 *  status and the provider's own words, or that the browser could not reach it; never the key. */
export async function tileFailure(src:string,provider:string):Promise<string>{
  try{const r=await fetch(src,{referrerPolicy:'origin',cache:'no-store'});
    if(r.ok)return `${provider} answered, but the browser did not draw the picture`;
    let said='';try{said=(await r.text()).replace(/\s+/g,' ').replace(/[A-Za-z0-9_\-]{24,}/g,'…').slice(0,160).trim();}catch{/* no body */}
    return `${provider} answered ${r.status}${said?`, “${said}”`:''}${r.status===403?`. A key locked to Fieldwork's published address is refused on any other, such as ${location.origin}`:''}`;}
  catch{return `the browser could not reach ${provider}: offline, or blocked by a browser extension or the network`;}
}
/** The provider's own words for whose imagery and data these are, after "Powered by Esri". */
async function esriCredit(url:string):Promise<string|null>{
  try{const r=await fetch(url,{referrerPolicy:'origin'});if(!r.ok)return null;const j=await r.json() as {copyrightText?:unknown};
    const text=typeof j.copyrightText==='string'?j.copyrightText.trim():'';
    return text?`${ESRI_POWERED} | ${escapeHtml(text)}`:null;}
  catch{return null;}
}

/** THE basemap list, for every control that offers one.
 *
 *  The practitioner, 2026-10-20: *"I also still do not see why we do not yet have OpenFreeMap as
 *  a Basemap option in the Map widget."* It was there -- three styles, drawing since 2026-10-17 --
 *  in the map's own toolbar, and not in the widget's Inspector, which carried its own hand-written
 *  list of three options written before the vector styles existed. The project's recurring defect,
 *  again: a derivation replaced by a copy somebody has to remember to update.
 *
 *  One source now, used by both selects. What still needs a human is the `BasemapChoice` union in
 *  types.ts, which cannot import this module because the workers build types.ts without Leaflet. */

/** THE BASEMAP VOCABULARY, which lives in `basemaps.ts` and is re-exported here so the callers
 *  that already import this module do not all have to change.
 *
 *  Why it moved, 2026-10-27: the format question -- can a static figure bake this? -- has to be
 *  answerable where Leaflet is not, because `map-communication.ts` decides what a figure credits
 *  and the workers build compiles without Leaflet. It also has to be TESTABLE, and neither this
 *  module nor `types.ts` is a build entry point, so a rule about what the interface may offer had
 *  no output a unit test could import. This module keeps what needs Leaflet: the tile URLs, the
 *  style URLs and the rendering. */
export {basemapsFor,basemapAvailable,BASEMAP_OPTIONS,BASEMAP_LABELS,basemapOptions} from './basemaps.js';

/** What an interactive map can draw. Every field optional, because a map draws the layers it is
 *  given: the practitioner's model of 2026-10-14, reaching the renderer on 2026-10-15.
 *
 *  Until then this function required `Polygons`, so the interactive presentation existed only for
 *  catchment maps -- and since a basemap can only be drawn by the interactive presentation, nine
 *  of the ten maps in the worked examples could not have one. The practitioner reported the
 *  missing basemap three times before the cause turned out to be here rather than in the control. */
export interface MapLayers {
  polygons?:Polygons;
  /** A study area, drawn as the ground the rest sits on. */
  boundary?:{type:string;coordinates:unknown};
  /** The country outline the study area carries, for context: a line under everything, never measured against. */
  contextOutline?:{type:string;coordinates:unknown};
  /** A raster, drawn UNDER the study area: it is the most ground-like thing a map carries.
   *  Arrives as a layer rather than as a mode, so a map showing streets and facilities can
   *  show the population they are to be read against. */
  raster?:import('./raster.js').RasterGrid;
  /** How that raster is shaded and keyed, by its unit (2026-11-17); absent on an older result. */
  rasterScale?:import('./raster-panels.js').PanelScale;
  /** Points carried on a value rather than arriving at a port of their own. */
  rows?:{id:string;name:string;coordinates?:Position|null;status?:string;relation?:string;excluded?:boolean;sourceNodeId?:string;fill?:FillClass;pinClass?:string}[];
  /** What the fill channel stands for. The renderer prints the words and draws the classes; it
   *  does not know which variable produced them. */
  fillEncoding?:FillEncoding;
  markHalo?:boolean;
  /** What each source is called, so a layer control names the widget rather than its node id. */
  layerNames?:Record<string,string>;
  /** The symbol each source is drawn with, resolved from the practitioner's choice where they
   *  made one and from the layer's position where they did not. */
  layerSymbols?:Record<string,{colour:string;shape:LayerShape;size?:number}>;
  centers?:{id?:string;name?:string;geometry?:{coordinates:Position}|null}[];
  /** A georeferenced image drawn beneath everything, and toggled like any other layer.
   *
   *  The practitioner, 2026-10-27: *"I meant for the water supply map to be a layer, so checkbox
   *  can show and hide it."* That is the point of it for a learner -- flipping 1855 on and off
   *  under a modern result is the comparison, and a backdrop nobody can remove is a picture
   *  rather than evidence. */
  plate?:{data:string; bounds:[number,number,number,number]; opacity:number; label:string;
    /** A turned plate's corners and pixel size (experiment 201): drawn by `TurnedImage`, not an upright overlay. */
    corners?:[number,number][]; width?:number; height?:number};
  /** SEVERAL SHEETS, in the order they are drawn, where a map has more than one (TODO 35); `plate` is the first. */
  plates?:NonNullable<MapLayers['plate']>[];
  /** A street graph, drawn as itself. Added 2026-10-20: a Map showing a network could not be made
   *  interactive and could carry no basemap, because the static branch returned before the
   *  interactive one was reached. */
  network?:{nodes:{id:string;coordinates:Position}[];edges:{from:string;to:string;geometry?:Position[]}[]};
  /** LINES: routes, tracks and borders, a layer each (experiment 229). */
  lines?:(import('./types.js').LineLayer&{sourceNodeId:string;label:string})[];
  /** Whether lines show which way they run (2026-11-24), as the Map's Configure dialog sets. The interactive map and
   *  the static figure read the one setting, so the preview is the figure. See `marksDirection`. */
  lineArrows?:import('./map-lines.js').ArrowChoice;
  /** THE LAYERS, as the practitioner ordered, named and grouped them. Where this is absent the
   *  map draws exactly what it drew before: the names below are the defaults, not a fallback
   *  that loses anything. */
  mapLayers?:import('./map-layer-list.js').MapLayer[];
  /** A SYMBOL PER PIN CLASS, per source, resolved by the map so every renderer reads one answer.
   *  Absent where a layer is not classed, which is the ordinary case. */
  pinClasses?:Record<string,{value:string;colour:string;shape?:LayerShape}[]>;
  /** Lines from a record to the record it names, by row id (experiment 200, step 4). */
  links?:import('./map-links.js').MapLink[];
}

/** Presentation only: never changes polygons, memberships, or source points. */
/** Where the practitioner last left this map, so a remount does not throw it away.
 *
 *  Module level because the map itself does not survive: a presentation change -- mark radius,
 *  basemap, a legend toggle -- calls `renderResults`, which disposes this map, removes its host
 *  and mounts a new one. The new map fitted all layers on arrival, so every nudge of the Mark
 *  radius slider zoomed back out to the whole extent, discarding the view the practitioner had
 *  panned to in order to judge the mark size. Reported 2026-10-26.
 *
 *  KEYED ON THE LAYER BOUNDS AS WELL AS THE NODE, which is what keeps this from becoming the
 *  opposite bug. A remount with the same data restores the view; a remount after a run that
 *  moved or changed the layers has a different key, falls through to `fit`, and still shows the
 *  practitioner their new result rather than stranding them over the old extent. */
let rememberedView:{key:string;lat:number;lng:number;zoom:number}|undefined;

export function mountCatchmentMap(host:HTMLElement,source:Polygons|MapLayers,context:PointCollection|undefined,esc:Escape,basemap:BasemapChoice='none',onBasemapChange?:(choice:BasemapChoice)=>void,viewKey?:string,tileExtract?:TileExtractSpec,partLabel?:string,frameCaption?:string,
  /** SVG ONLY, for Configure…'s preview (2026-11-10): a canvas renderer created and removed within milliseconds, as the
   *  preview is on every change, can redraw on a canvas already gone ("reading 'clearRect'"). The Results map keeps
   *  the canvas, which a boundary of tens of thousands of vertices needs. */
  options:{svgOnly?:boolean;
    /** A PANEL OF SEVERAL (Map's manual, History: panels): the features its classes are taken over, every panel's together, so a shade is
     *  the same number in each; and the Leaflet map handed back, so panels can move together. */
    classifyOver?:Polygons['features'];onMap?:(map:L.Map)=>void;
    /** THE TABLE UNDER THE MAP (2026-11-14): a place chosen on the map is reported by its id, and the table is handed a
     *  way to mark a place on the map, so either can find the other. */
    onPart?:(id:string)=>void;partChooser?:(choose:(id:string|null)=>void)=>void}={}){
  const canvasRenderer=()=>options.svgOnly?undefined:L.canvas();
  // A Polygons value passed directly is the old call, kept working: it is one layer set with no
  // boundary and no rows.
  const layers:MapLayers=(source as Polygons)?.features!==undefined&&!(source as MapLayers).polygons
    ?{polygons:source as Polygons}:source as MapLayers;
  const p:Polygons=layers.polygons??{features:[],sites:[],observations:undefined} as unknown as Polygons;
  const toolbar=document.createElement('div');toolbar.className='catchment-map-toolbar';
  // IN CONFIGURE'S PREVIEW THE BASEMAP IS THE SETTING'S, not a second choice beside it (the practitioner, 2026-11-10, who
  // picked PMTiles here for a static plot): the preview's own picker offered what the map type cannot draw.
  toolbar.innerHTML='<button class="button small" data-fit>Fit all layers</button><button class="button small" data-fullscreen>Full screen</button>'
    +(options.svgOnly
      ?`<span data-basemap-said>Basemap: ${BASEMAP_LABELS[basemap]??basemap}, as set under Basemap</span><select data-basemap hidden aria-hidden="true">${basemapOptions(basemap,'interactive')}</select>`
      :'<label>Basemap <select data-basemap aria-label="Interactive map basemap">'+basemapOptions(basemap,'interactive')+'</select></label>')
    +'<span data-tile-status role="status">Local layers work offline</span><span data-marks-status role="status"></span>';
  const canvas=document.createElement('div');canvas.className='catchment-leaflet';canvas.setAttribute('aria-label','Interactive catchment map');
  host.append(toolbar,canvas);
  // Views can disappear immediately on tab/workspace changes. Avoid delayed zoom
  // transition callbacks that outlive Leaflet's removed panes.
  const map=L.map(canvas,{scrollWheelZoom:false,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false}),all=L.featureGroup(),overlays:Record<string,L.Layer>=Object.create(null);
  /** ONE PANE PER LAYER, at its place in the stack. Clamped to the layers a key can tell apart, so a rank nobody set
   *  cannot climb over the sites or under the basemap; within the pane Leaflet orders by latitude, as it should. */
  const marksPane=(rank:number):string=>{
    const at=Math.max(0,Math.min(MAX_MANAGED_LAYERS-1,rank));
    const name=`fw-marks-${at}`;
    if(!map.getPane(name))map.createPane(name).style.zIndex=String(MARKS_PANE_BASE+at);
    return name;
  };
  const sitesPane=():string=>{
    if(!map.getPane(SITES_PANE))map.createPane(SITES_PANE).style.zIndex=String(SITES_PANE_Z);
    return SITES_PANE;
  };
  options.onMap?.(map);
  // EVERY OVERLAY'S NAME AND POSITION COMES FROM THE LAYER LIST, not from the line that happens
  // to construct it. Each of these used to invent its own string where it was built -- "Study
  // area", "Population raster", "Observations (red circles)", "Sites / context (blue squares)" --
  // so a control listing a practitioner's own node labels also offered them two entries named
  // after the colour of a mark, and nothing could be renamed, reordered or grouped. The
  // practitioner, 2026-10-29: *"Map output should have a dialog modal for layer management
  // (ordering, labeling, grouping)."*
  const byId=new Map((layers.mapLayers||[]).map(l=>[l.id,l]));
  const placed:{order:number;key:string;layer:L.Layer}[]=[];
  const hiddenPort=(id:string)=>byId.get(id)?.drawn===false;
  /** The name a reader sees. A group prefixes its members, which is the most a Leaflet layer
   *  control can show without a plugin: the grouping is the practitioner's reading of the map,
   *  so it is carried into the key rather than kept in the dialog. */
  const place=(port:string,fallback:string,layer:L.Layer)=>{
    const found=byId.get(port);
    const key=(found?.group?`${found.group.label} \u00b7 `:'')+(found?.label||fallback);
    placed.push({order:found?.index??100+placed.length,key,layer});
  };
  // POINT MARKS GET THEIR OWN PANE, under the markers. They used to be circleMarkers, which
  // Leaflet draws in the overlay pane -- below every marker. Drawing each mark as an icon so it
  // could carry a halo put them in the MARKER pane instead, where a dense facility layer covered
  // the pump and site markers and swallowed their clicks. One pane, one z-index below markers,
  // restores the stacking the circleMarkers had.
  // Ground first, under everything the workflow produced -- and a raster is under THAT. The
  // practitioner, 2026-10-23, looking at a map carrying a study area, a street network, 17
  // facilities and a clipped WorldPop window, of which the raster alone did not appear: *"There
  // is still no raster on the map"*. It did not appear because a map drew one mode and the
  // network outranked the raster. The same defect took the study area on 2026-10-20 and the
  // facilities on 2026-10-22, each patched one layer at a time; this is the third.
  // THE PLATE FIRST, so every other layer draws over it, and `bringToBack` for the case where a
  // later layer is added to the map before this one has painted.
  // EACH SHEET in order; the first sent to the back first, so a later sheet lies over an earlier one.
  const sheets=layers.plates??(layers.plate?[layers.plate]:[]);
  [...sheets].reverse().forEach((sheet,back)=>{const i=sheets.length-1-back,key=i===0?'plate':`plate_${i+1}`;
    const [west,south,east,north]=sheet.bounds;
    const turned=sheet.corners&&sheet.width&&sheet.height;
    const plate:L.Layer=turned
      ?new TurnedImage(sheet.data,sheet.corners!,sheet.width!,sheet.height!,sheet.opacity)
      :L.imageOverlay(sheet.data,[[south,west],[north,east]],
        {opacity:sheet.opacity,interactive:false,className:'map-plate-image'});
    if(!hiddenPort(key)){plate.addTo(map);(plate as L.ImageOverlay).bringToBack?.();all.addLayer(plate);}
    place(key,sheet.label,plate);});
  if(layers.raster?.metadata){
    const [west,south,east,north]=layers.raster.metadata.bounds;
    const overlay=L.imageOverlay(rasterImage(layers.raster,undefined,layers.rasterScale),[[south,west],[north,east]],
      {opacity:.75,interactive:false,className:'raster-result-image'});
    if(!hiddenPort('raster')){overlay.addTo(map);all.addLayer(overlay);}
    // Named for its source and what it shows, not "Population raster" whatever it holds (2026-11-17).
    place('raster',layers.rasterScale?`${layers.rasterScale.layers[0]} \u00b7 ${layers.rasterScale.label}`:'Raster',overlay);
  }
  // THE COUNTRY OUTLINE FIRST, so nothing it crosses is hidden by it (2026-11-23): a dashed line and no fill, offered
  // in the layer list like anything else a reader may want out of the way.
  if(layers.contextOutline){
    const country=L.geoJSON(layers.contextOutline as never,{renderer:canvasRenderer(),interactive:false,
      style:{color:'#8a9a8f',weight:1.2,dashArray:'6 4',fill:false}} as L.GeoJSONOptions);
    if(!hiddenPort('country-outline')){country.addTo(map);all.addLayer(country);}
    place('country-outline','Country outline',country);
  }
  if(layers.boundary){
    // Canvas for the same reason the streets use it: a published boundary can be tens of
    // thousands of vertices, and an SVG path that long is seconds of paint on every redraw.
    const area=L.geoJSON(layers.boundary as never,{renderer:canvasRenderer(),interactive:false,style:{color:'#176b59',weight:2,fillColor:'#dbe8d6',fillOpacity:.25}} as L.GeoJSONOptions);
    if(!hiddenPort('area')){area.addTo(map);all.addLayer(area);}
    place('area','Study area',area);
  }
  const members=new Map<string,L.FeatureGroup>();
  const sorted=[...p.features].sort((a,b)=>(b.minutes||0)-(a.minutes||0));
  // COLOURED BY VALUE WHERE THERE IS ONE, as the static plot already is. Every feature took one
  // hard-coded blue, so a choropleth switched to this presentation lost its classes entirely --
  // the practitioner, 2026-10-26: "when I shift to Interactive, the choropleth loses its shades."
  // Both renderers now read the same `classifyValues`, because a figure whose meaning depends on
  // which renderer drew it is two different figures.
  const shading=polygonShading(options.classifyOver??p.features);
  const {grouped}=shading;
  // FRAMES SHARE ONE KEY. Classes come from every value in every frame, so a part darker in one frame
  // than another really is higher; classes recomputed per frame would hide the trend. Experiment 168.
  const frameNames=!grouped&&p.frames?.length?p.frames:[];
  const classed=shading.classed;
  let stopFrames=()=>{};
  const framedParts:{f:typeof p.features[number];layer:L.GeoJSON;title:string}[]=[];
  // THE TIMELINE'S PARTS: each day's polygons, and every point with its date (the replay, 2026-11-10).
  const timeline=p.timeline?.days.length?p.timeline:undefined;
  const dayParts:{day:string;layer:L.GeoJSON;group:L.FeatureGroup|L.Map}[]=[];
  const datedMarks:{date:string;marker:L.Marker;group:L.FeatureGroup}[]=[];
  let gpu:GlMarks|undefined;
  // A NAMED LAYER IS CATEGORICAL. Every feature without a value took one hard-coded `#1f77b4`,
  // so a layer of two named reaches drew as one shape. Bands with `minutes` are a sequence and
  // keep their own treatment below; anything else is told apart by hue.
  const banded=p.features.some(f=>f.minutes!==undefined);
  // A HUE PER FEATURE ONLY WHERE THE FEATURES ARE NAMED THINGS. Numbered parts of one layer are
  // not categories; the layer carries which it is, because a read numbers what it could not name
  // and the name alone cannot tell them apart.
  const categorical=!classed&&!grouped&&!banded&&p.featuresNamed!==false
    ?categoricalSteps(p.features.length):null;
  const hueOf=new Map<string,string>(categorical?p.features.map((f,i)=>[f.id,categorical[i]]):[]);
  // One group for every part a value-classed layer draws, so the control lists the LAYER.
  const themed=L.featureGroup();
  const partLayers=new Map<string,L.GeoJSON[]>();
  const round=(v:number)=>{const a=Math.abs(v);return a>=100?v.toFixed(0):a>=10?v.toFixed(1):v.toFixed(2);};
  for(const f of sorted){
    const shaded=classed??grouped;
    const at=grouped?grouped.classOf(f.category):classed?classed.classOf(f.value):null;
    // A part with no value is neutral, never the lowest class: pale-for-absent reads as a
    // finding of low incidence, which is the opposite of what it means.
    const hue=hueOf.get(f.id);
    const band=!shaded&&!hue&&f.minutes!==undefined?bandColour(f.minutes,p.features.map(x=>x.minutes??0)):undefined;
    const fillColor=shaded?(at===null?FIGURE_ROLE.unknown:shaded.colours[at]):hue??band??'#1f77b4';
    // A categorical fill is readable at the strength a value-bearing one is: the identity wash
    // was tuned for nested catchments drawn over each other, and two named regions are not that.
    const fillOpacity=shaded?(at===null?.18:.78):hue?.55:band?BAND_OPACITY:.2;
    // A RING, outline only, where the polygon stands for one place: a cluster at one house (2026-11-15).
    const layer=L.geoJSON(f.geometry,{style:f.ring?{color:f.ring==='secondary'?RING_BLUE:RING_RED,weight:3.5,fillColor,fillOpacity:0}
      :{color:shaded?FIGURE_ROLE.quietInk:hue??'#39779e',weight:1,fillColor,fillOpacity}});
    // THE VALUE THE SHADE ENCODES, in the popup. A choropleth whose popup names only the polygon
    // leaves a reader with a colour and no number, and reading a value off a five-class ramp is
    // exactly what a legend cannot do. The practitioner, 2026-10-26.
    const shade=f.value===undefined||!classed?''
      :`<br>${round(f.value)}${at===null?'':` · class ${at+1} of ${classed.classes}`}`;
    // THE PART BY ITS NAME, AND ITS KEY BENEATH. Nigeria's LGAs are keyed by ID because 769 names cover
    // 774 places, and the popup showed only "483". The practitioner, 2026-11-02.
    const said=partLabel?(f as {properties?:Record<string,unknown>}).properties?.[partLabel]:undefined;
    const title=said!==undefined&&said!==null&&String(said).trim()
      ?`<b>${esc(String(said))}</b> <span class="muted">${esc(f.name)}</span>`:`<b>${esc(f.name)}</b>`;
    if(frameNames.length)framedParts.push({f,layer,title});
    const partDay=timeline?String((f as {properties?:Record<string,unknown>}).properties?.analysis_day??''):'';
    layer.bindPopup(`${title}${shade}${f.minutes===undefined?'':`<br>Within ${f.minutes} minutes (cumulative)`}${f.count===undefined?'':`<br>${f.count} locations${p.summary?.valueField?`<br>${esc(p.summary.valueField)}: ${f.total}`:''}`}`);
    // NOT ADDED TO THE MAP HERE. A feature that belongs to a group is drawn BY that group, and
    // adding it individually as well is what made the control lie: the checkbox reflects the
    // group, which was never on the map, while the features were -- so "Polygon layer" sat
    // unchecked over a river that was plainly drawn, reported 2026-10-29. Whatever ends up
    // standing alone is added below.
    if(partDay)(layer as unknown as {_timelineId?:string})._timelineId=f.id;
    if(options.onPart){const id=String(f.id);(partLayers.get(id)??partLayers.set(id,[]).get(id)!).push(layer);
      layer.on('click',()=>options.onPart!(id));}
    all.addLayer(layer);
    // A CHOROPLETH'S PARTS ARE ONE LAYER, NOT THIRTY-THREE. A catchment or an isochrone band is
    // a distinct thing worth toggling; a sub-district shaded by a rate is one of many parts of a
    // single thematic layer, and listing each gave south London 33 checkboxes that ran off the
    // bottom of the map. The practitioner, 2026-10-26, naming the shape this should have had:
    // "we can have the map configure what appears as layers -- in this case, study area,
    // mortality per sub-district, provider by sub-district." Making the list scroll treated the
    // symptom; this is the granularity.
    if(classed)themed.addLayer(layer);
    // THE SAME GRANULARITY QUESTION, ON THE OTHER BRANCH. The classed path learned on 2026-10-26
    // that a choropleth's parts are one layer and not thirty-three; this one was left listing a
    // checkbox per feature, so 32 unshaded sub-districts collected beside a river still ran off
    // the bottom of the map. Where the features remember which layer they came from they are
    // grouped back into it; a catchment or a time band, which carries no layer name and IS a
    // distinct thing worth toggling, keeps its own entry as before.
    // A READ LAYER'S FEATURES ARE ONE LAYER TOO. 140 water areas read from one file gave a
    // reader 140 checkboxes on 2026-10-29, which is the granularity the classed branch learned
    // about on 2026-10-26 and the collected branch on 2026-10-28, arriving a third time by the
    // one route still open: features that carry no layer name of their own, in a layer that has
    // one. A catchment or a time band is a distinct thing worth toggling and keeps its entry;
    // everything else belongs to the layer it was read as.
    else if(f.layerName||(p.layerName&&f.minutes===undefined&&!f.siteId)){
      const name=f.layerName||p.layerName!;
      let group=members.get(name);
      if(!group){group=L.featureGroup();members.set(name,group);}
      group.addLayer(layer);
    }
    else{
      // A distinct thing worth toggling, on its own. It IS the layer the control lists, so it is
      // the thing added to the map.
      const label=esc(f.name);
      if(!hiddenPort('polygons'))layer.addTo(map);
      overlays[Object.hasOwn(overlays,label)?`${label} (${esc(f.id)})`:label]=layer;
    }
  }
  if(timeline)for(const f of sorted){
    const day=String((f as {properties?:Record<string,unknown>}).properties?.analysis_day??'');
    all.eachLayer(l=>{const g=l as L.GeoJSON&{feature?:unknown};if((g as unknown as {_timelineId?:string})._timelineId===f.id)dayParts.push({day,layer:g,group:map});});
  }
  // EACH GROUP IS DRAWN BY BEING ADDED, so the box the control draws and the shapes on the map
  // are the same fact rather than two.
  for(const [name,group] of members){
    const id=`polygons/${name}`;
    if(!hiddenPort(id))group.addTo(map);
    place(id,esc(name),group);
  }
  if(classed&&themed.getLayers().length){
    if(!hiddenPort('polygons'))themed.addTo(map);
    place('polygons',esc(p.layerName||'Shaded by value'),themed);
  }
  // The streets, as ONE multi-polyline on a canvas renderer rather than a layer per segment.
  // A town-sized graph is tens of thousands of segments -- Bunia is an estimated 94,000 directed
  // ones -- and a Leaflet layer each would not draw. Each undirected segment arrives twice, once
  // per direction, so only one of the pair is drawn.
  if(layers.network?.nodes?.length){
    const at=new Map(layers.network.nodes.map(n=>[n.id,n.coordinates]));
    const lines:[number,number][][]=[];
    // AN EVEN SAMPLE PAST THE LIMIT, as the Inspector preview has always done. A province
    // arrived on 2026-10-22 -- 984,906 junctions and 2,022,803 directed segments for Ituri --
    // and the interactive map tried to draw every one of them. Measured that day in a Chromium
    // tab with straight two-point segments: 100,000 add in 76 ms and zoom in 29 ms, 250,000 zoom
    // in 185 ms, a million zoom in 824 ms, and a real edge carries geometry which multiplies
    // that on every pan. This is a limit on a DRAWING: the graph is untouched and every
    // junction is still routed over, measured and exported.
    const drawable=layers.network.edges.filter(edge=>edge.from<=edge.to).length;
    const step=Math.max(1,Math.ceil(drawable/INTERACTIVE_SEGMENT_LIMIT));
    let seen=0;
    for(const edge of layers.network.edges){
      if(edge.from>edge.to)continue;
      if(seen++%step)continue;
      const a=at.get(edge.from),b=at.get(edge.to);
      if(!a||!b)continue;
      lines.push(edge.geometry?.length
        ?edge.geometry.map(([lon,lat])=>[lat,lon] as [number,number])
        :[[a[1],a[0]],[b[1],b[0]]]);
    }
    if(lines.length){
      const streets=L.polyline(lines,{color:'#55706a',weight:1,opacity:.9,interactive:false,renderer:canvasRenderer()});
      streets.addTo(map);all.addLayer(streets);
      // Named for what it is, so a sampled picture is never read as the whole network.
      overlays[step>1
        ?`Street network (${lines.length.toLocaleString('en')} of ${drawable.toLocaleString('en')} segments)`
        :'Street network']=streets;
    }
  }
  // THE LINES, one layer each, over the area and under the points; each line named on hover (experiment 229).
  (layers.lines??[]).forEach((layer,i)=>{
    const group=L.featureGroup(),colour=LINE_COLOURS[i%LINE_COLOURS.length];
    for(const f of layer.features){
      const parts=(f.geometry.type==='LineString'?[f.geometry.coordinates]:f.geometry.coordinates).map(part=>part.map(([lon,lat])=>[lat,lon] as [number,number]));
      L.polyline(parts,{color:colour,weight:3,opacity:.95}).bindTooltip(esc(f.properties.name)).addTo(group);
      // AN ARROWHEAD WHERE DIRECTION IS MARKED, in screen pixels, so it is the size a reader sees at every zoom
      // rather than growing with the map. The bearing is taken in layer points, which is where the line is actually
      // drawn: taking it from latitude and longitude would lean the head away from its own line the further the map
      // is from the equator. Web Mercator is conformal, so the angle holds as the map is zoomed.
      if(marksDirection(layer,layers.lineArrows))for(const part of parts){
        // `parts` holds [lat, lon] for Leaflet; `endBearing` wants [lon, lat], as every geometry here does.
        const angle=endBearing(part.map(([lat,lon])=>[lon,lat] as [number,number]),v=>map.latLngToLayerPoint(L.latLng([v[1],v[0]])));
        if(angle===null)continue;
        L.marker(L.latLng(part[part.length-1]!),{interactive:false,keyboard:false,
          icon:L.divIcon({className:'line-arrow',iconSize:[20,20],iconAnchor:[10,10],html:arrowIconSvg(angle,colour)})}).addTo(group);
      }}
    group.addTo(map);all.addLayer(group);overlays[esc(layer.label)]=group;});
  const observations=L.featureGroup();
  // NO COLUMN OF ITS OWN (2026-11-27): these were sized by DEATHS, a column of one example's data named in the map's
  // code. With a study area wired they are a point layer of the map, sized as Configure… says; without one they are
  // drawn at one size, as the static figure draws them.
  for(const f of p.observations?.features||[]){if(!f.geometry)continue;const [lon,lat]=f.geometry.coordinates;
    if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
    const said=Object.entries(f.properties??{}).filter(([k])=>k!=='name').map(([k,v])=>`<br>${esc(k)}: ${esc(String(v))}`).join('');
    L.circleMarker([lat,lon],{radius:p.observationSymbol?observationRadius(p,f.properties):4,color:'#222',weight:1,fillColor:p.observationSymbol?.colour??CARRIED_POINT_COLOUR,fillOpacity:.85}).bindPopup(`<b>${esc(String(f.properties?.name??''))}</b><br>Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}${said}`).addTo(observations);
  }
  // ONLY IF THERE IS SOMETHING IN IT. The practitioner, 2026-10-20, on a map of a border study
  // area and its streets: *"Stale UI artifacts --- Observations (red circles) and Sites (blue
  // squares)."* Both were listed, both were empty, and a layer control that offers a layer which
  // cannot appear is a claim that the workflow has data it does not have -- on a map whose whole
  // job is to say what is there. The two below already guard this way; these two did not.
  // A LAYER IS NAMED FOR WHAT IT IS, not for the colour it is drawn in. "Observations (red
  // circles)" told a reader the mark and not the meaning, and said it in a control that already
  // draws the mark beside the name.
  if(observations.getLayers().length){if(!hiddenPort('observations')){observations.addTo(map);all.addLayer(observations);}
    place('observations',esc(p.observationsFrom?.label??'Observations'),observations);}
  const pumps=L.featureGroup(),points=context?.features||p.sites;
  for(const f of points){if(!f.geometry)continue;const [lon,lat]=f.geometry.coordinates;
    if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
    const marker=L.marker([lat,lon],{pane:sitesPane(),icon:L.divIcon({className:'catchment-site-marker',iconSize:[12,12],iconAnchor:[6,6]}),title:f.properties.name}).bindPopup(`<b>${esc(f.properties.name)}</b><br>Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}${p.sites.some(s=>s.id===f.id)?'<br>Travel-time origin':''}`).addTo(pumps);
    marker.on('add',()=>{const icon=marker.getElement();if(icon){L.DomEvent.disableClickPropagation(icon);icon.addEventListener('mousedown',event=>event.preventDefault());icon.addEventListener('click',event=>{event.stopPropagation();marker.openPopup();});}});
  }
  if(pumps.getLayers().length){if(!hiddenPort('sites')){pumps.addTo(map);all.addLayer(pumps);}
    place('sites','Sites',pumps);}
  // Points a value carried rather than a port delivered -- a spatial map's rows, and the centers
  // it measured against. Drawn with the status each row was given, because that is what the map
  // is about.
  // ONE OVERLAY PER SOURCE, and hue says which source it is.
  //
  // The practitioner, 2026-10-20, with an OpenStreetMap search and an Overture search on one map:
  // *"they are both rendered same color when inside the polygon and there is no layer to check or
  // uncheck to assess which points come from which source."* Hue had been spent on the spatial
  // relation, so provenance had no channel and the layer control had nothing to list.
  //
  // Hue now carries the LAYER, fill carries the RELATION -- solid inside, hollow outside, grey
  // where there is no usable location -- and the mark repeats the layer, because colour alone is
  // not an encoding everybody can read. The marks are named as OGC Symbology Encoding names them,
  // and a practitioner can choose one per layer on the Map widget.
  if(layers.rows?.length){
    const bySource=new Map<string,typeof layers.rows>();
    for(const row of layers.rows){
      const key=String((row as {sourceNodeId?:string}).sourceNodeId||'records');
      const held=bySource.get(key)||[];held.push(row);bySource.set(key,held);
    }
    const named=layers.layerNames||{};
    let index=0;
    // LARGE LAYERS ON THE GRAPHICS CARD (gl-marks.ts): one renderer for the whole map, started once every layer is in it.
    gpu=new GlMarks(map,{halo:layers.markHalo!==false,pane:'fieldworkMarks',say:text=>{toolbar.querySelector('[data-marks-status]')!.textContent=text;}});
    for(const [source,rows] of bySource){
      // Spread into one shape so the fallback does not narrow `size` away: `layerSymbol`
      // derives a colour and a mark from the layer's position and has no opinion on radius.
      const symbol:{colour:string;shape:LayerShape;size?:number;sizeBy?:string;colourBy?:string}=
        layers.layerSymbols?.[source]??{...layerSymbol(index)};
      // COLOUR BY CLASS, as the static figure draws it (2026-11-13): one size, the class's step, the highest drawn last.
      const ramp=symbol.colourBy?colouredClasses(rows as never,{[source]:symbol}).get(source):undefined;
      const valueOf=(row:unknown)=>{const v=(row as {attributes?:Record<string,unknown>}).attributes?.[symbol.colourBy!];return v===''||v===null||v===undefined?null:Number(v);};
      if(ramp)rows.sort((a,b)=>(valueOf(a)??-Infinity)-(valueOf(b)??-Infinity));
      // THE LAYER'S PLACE IN THE STACK set in Manage layers (2026-11-12): Leaflet stacks markers by latitude unless told,
      // so each layer's marks are lifted by its position, and a layer moved up is drawn over the others.
      const pane=marksPane(layerRanks(layers.mapLayers)(source));
      // PROPORTIONAL SYMBOLS, as the static figure draws them (experiment 210): largest first, so none hides another.
      const largest=symbol.sizeBy&&!ramp?Math.max(0,...rows.map(row=>Number((row as {attributes?:Record<string,unknown>}).attributes?.[symbol.sizeBy!])).filter(Number.isFinite)):0;
      if(largest>0)rows.sort((a,b)=>(Number((b as {attributes?:Record<string,unknown>}).attributes?.[symbol.sizeBy!])||0)-(Number((a as {attributes?:Record<string,unknown>}).attributes?.[symbol.sizeBy!])||0));
      // ONE GROUP PER PIN CLASS, where the layer has them. A class is what a record IS, so it
      // gets its own mark and its own row in the layer list -- not a nested checkbox under the
      // layer, and not a group, which is a bundle the practitioner declares.
      const classes=layers.pinClasses?.[source]??[];
      const classColour=new Map(classes.map(entry=>[entry.value,entry.colour]));
      const groups=new Map<string,L.FeatureGroup>();
      const groupFor=(row:{pinClass?:string}):L.FeatureGroup=>{
        const key=classes.length&&row.pinClass?row.pinClass:'';
        let found=groups.get(key);
        if(!found){found=L.featureGroup();groups.set(key,found);}
        return found;
      };
      const port=layers.mapLayers?.find(entry=>entry.sourceNodeId===source)?.port;
      if(rows.filter(row=>row.coordinates).length>MERGED_MARKS_FROM){
        const byClass=new Map<string,GlMark[]>();
        for(const row of rows){
          if(!row.coordinates)continue;
          const [lon,lat]=row.coordinates;
          if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
          const encoding=layers.fillEncoding||SPATIAL_RELATION_FILL;
          const state=row.excluded?'Excluded':row.relation??row.status??'';
          const paint=row.fill??fillClass(encoding,state);
          const step=ramp?ramp.classOf(valueOf(row)):null;
          const ink=paint==='absent'?'#8C8C8C':ramp?(step===null?'#a89b87':ramp.colours[step]!):(row.pinClass&&classColour.get(row.pinClass))||symbol.colour;
          const r=largest>0?proportionalRadius((row as {attributes?:Record<string,unknown>}).attributes?.[symbol.sizeBy!],largest,markRadius(symbol.size))
            :ramp?Math.max(7,markRadius(symbol.size)):markRadius(symbol.size);
          const key=classes.length&&row.pinClass?row.pinClass:'';
          const held=byClass.get(key)??byClass.set(key,[]).get(key)!;
          held.push({lon,lat,shape:symbol.shape,radius:Math.round(r*2)/2,fill:paint==='solid'?ink:null,fillOpacity:largest>0?0.55:1,
            stroke:ramp?'#1d2f3a':ink,group:'',
            date:timeline?String((row as {attributes?:Record<string,unknown>}).attributes?.[timeline.dateField]??'').slice(0,10):'',
            popup:`<b>${esc(row.name)}</b>${state?`<br>${esc(state)}`:''}<br>${esc(named[source]||source)}<br>Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}`
              +recordAttributesHtml((row as {attributes?:Record<string,unknown>}).attributes,esc)});
        }
        for(const [className,marks] of byClass){
          if(!marks.length)continue;
          const id=className&&port?`${port}/${className}`:port;
          const group=gpu.group(`${source}\u0000${className}`,marks);
          if(id)place(id,className||named[source]||source,group);
          else{const key=named[source]||source;overlays[Object.hasOwn(overlays,key)?`${key} \u00b7 ${esc(source)}`:key]=group;}
          if(!hiddenPort(id||'')){group.addTo(map);all.addLayer(group);}
        }
        index++;continue;
      }
      for(const row of rows){
        if(!row.coordinates)continue;
        const [lon,lat]=row.coordinates;
        // Belt and braces for a row from a run saved before the relation was fixed: Leaflet
        // throws on a non-finite pair, and a stored result must not be able to stop a render.
        if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
        // The class the map resolved, not a variable this renderer knows. A row from an older
        // value carries none, so the encoding is applied here instead -- which is the same table,
        // read in the same place, rather than a second opinion hard-coded in the drawing code.
        const encoding=layers.fillEncoding||SPATIAL_RELATION_FILL;
        const state=row.excluded?'Excluded':row.relation??row.status??'';
        const paint=row.fill??fillClass(encoding,state);
        const step=ramp?ramp.classOf(valueOf(row)):null;
        const ink=paint==='absent'?'#8C8C8C'
          :ramp?(step===null?'#a89b87':ramp.colours[step]!)
          :(row.pinClass&&classColour.get(row.pinClass))||symbol.colour;
        const inside=paint==='solid';
        // The mark is DRAWN, not just named. The layer control said "(square)" while every point
        // on the map was a circleMarker, so the mark channel existed in the label and the receipt
        // and nowhere a reader could see it.
        //
        // EVERY mark carries a dark halo, drawn first and wider, so the symbol reads on any
        // ground. The practitioner, 2026-10-21, over OpenTopoMap: *"we can add a dark border to
        // the symbols so they are easier to see on any basemap."* A terrain basemap runs through
        // the same values as the palette, and a hollow mark over it was nearly invisible. The halo
        // is a neutral, not a seventh hue: it separates the symbol from the ground without
        // competing with the layer colours. A circle no longer takes the cheaper circleMarker
        // path, because one stroke cannot be both the halo and the hue.
        // MARK RADIUS, WHICH THIS DREW AT A CONSTANT 5 UNTIL 2026-10-27. The Inspector's slider
        // stores a size, `resolveLayerSymbol` resolves it, and the static figure has honoured it
        // all along -- `app.ts` passes the resolved symbols straight onto the result. This
        // renderer took the shape and the colour off that symbol and hard-coded the radius, so
        // the control worked on the plot and did nothing on the map.
        //
        // It read as "the slider does nothing" only after the view fix landed the day before:
        // moving the slider used to remount the map and refit the bounds, so the picture visibly
        // jumped and the jump looked like the mark changing. Keeping the view removed the
        // side effect that had been standing in for the effect. Reported as exactly that:
        // *"the mark radius does not reset the canvas zoom anymore but it does not change the
        // radius."* One bug hid the other, and fixing the first is what exposed it.
        //
        // THE ICON BOX IS DERIVED, because a 16x16 box clips anything past radius 5: the halo is
        // stroked at 3.4 and the symbol at 1.5, so the drawn extent is the radius plus about 2.5.
        // A fixed box would have silently capped the slider at a third of its range.
        const r=largest>0?proportionalRadius((row as {attributes?:Record<string,unknown>}).attributes?.[symbol.sizeBy!],largest,markRadius(symbol.size))
          :ramp?Math.max(7,markRadius(symbol.size)):markRadius(symbol.size);
        const box=Math.ceil(2*(r+2.5)),centre=box/2;
        const marker=L.marker([lat,lon],{title:row.name,pane,icon:L.divIcon({className:'catchment-point-mark',
          iconSize:[box,box],iconAnchor:[centre,centre],
          html:`<svg width="${box}" height="${box}" viewBox="0 0 ${box} ${box}" aria-hidden="true">`
            +(layers.markHalo===false?'':`<path d="${markPath(symbol.shape,centre,centre,r)}" fill="none" `
              +`stroke="${MARK_HALO}" stroke-width="3.4" stroke-linejoin="round"/>`)
            +`<path d="${markPath(symbol.shape,centre,centre,r)}" fill="${inside?ink:'none'}"${largest>0?' fill-opacity="0.55"':''} `
            +`stroke="${ramp?'#1d2f3a':ink}" stroke-width="1.5" stroke-linejoin="round"/></svg>`})})
          .bindPopup(`<b>${esc(row.name)}</b>${state?`<br>${esc(state)}`:''}`
            +`<br>${esc(named[source]||source)}<br>Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}`
            +recordAttributesHtml((row as {attributes?:Record<string,unknown>}).attributes,esc))
          ;
        groupFor(row).addLayer(marker);
        if(timeline){
          const date=String((row as {attributes?:Record<string,unknown>}).attributes?.[timeline.dateField]??'').slice(0,10);
          if(date)datedMarks.push({date,marker,group:groupFor(row)});}
      }
      // NAMED THROUGH THE LAYER LIST, so Manage layers governs these the way it governs the
      // rest. The port is the layer's id; a class is that port plus its own name, which is the
      // id `mapLayerList` builds for a layer that arrived inside a value.
      for(const [className,group] of groups){
        if(!group.getLayers().length)continue;
        const id=className&&port?`${port}/${className}`:port;
        const fallback=className||named[source]||source;
        if(id)place(id,fallback,group);
        else{
          const key=named[source]||source;
          overlays[Object.hasOwn(overlays,key)?`${key} \u00b7 ${esc(source)}`:key]=group;
        }
        if(!hiddenPort(id||'')){group.addTo(map);all.addLayer(group);}
      }
      index++;
    }
    // THE LINES, one layer per point layer that has them, under the marks: Leaflet draws a polyline in the overlay
    // pane, below the marker pane the marks are in. An arrowhead three quarters along says which way each runs.
    const at=new Map((layers.rows||[]).map(r=>[r.id,r.coordinates])),nameOf=new Map((layers.rows||[]).map(r=>[r.id,r.name]));
    const bySourceLinks=new Map<string,import('./map-links.js').MapLink[]>();
    for(const link of layers.links||[])(bySourceLinks.get(link.sourceNodeId)??bySourceLinks.set(link.sourceNodeId,[]).get(link.sourceNodeId)!).push(link);
    const deepest=Math.max(1,...(layers.links||[]).map(l=>l.generation??1));
    const generationHue=generationColours(deepest);
    for(const [source,links] of bySourceLinks){
      const group=L.featureGroup();
      for(const link of links){
        const a=at.get(link.from),b=at.get(link.to);
        if(!a||!b)continue;
        const from=named[source]||source;
        const hue=link.generation?generationHue[link.generation-1]!:'#3d4a45';
        L.polyline([[a[1],a[0]],[b[1],b[0]]],{color:hue,weight:2.5,opacity:0.9,interactive:true})
          .bindTooltip(`${esc(nameOf.get(link.from)||'')} to ${esc(nameOf.get(link.to)||'')}${link.generation?`, generation ${link.generation}`:''} \u00b7 ${esc(from)}`).addTo(group);
        const lat=a[1]+(b[1]-a[1])*0.75,lon=a[0]+(b[0]-a[0])*0.75;
        const angle=Math.atan2(-(b[1]-a[1]),(b[0]-a[0])*Math.cos(lat*Math.PI/180))*180/Math.PI;
        L.marker([lat,lon],{interactive:false,keyboard:false,icon:L.divIcon({className:'map-link-arrow',iconSize:[12,12],iconAnchor:[6,6],
          html:`<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="transform:rotate(${angle.toFixed(1)}deg)"><path d="M1 1L11 6L1 11z" fill="${hue}"/></svg>`})}).addTo(group);
      }
      if(!group.getLayers().length)continue;
      const port=layers.mapLayers?.find(entry=>entry.sourceNodeId===source)?.port;
      const label=`Lines \u00b7 ${named[source]||source}`;
      if(port)place(`${port}/links`,label,group);
      else overlays[label]=group;
      if(!hiddenPort(port?`${port}/links`:'')){group.addTo(map);all.addLayer(group);}
    }
  }
  gpu?.start();
  if(layers.centers?.length){
    const group=L.featureGroup();
    for(const center of layers.centers){
      if(!center.geometry)continue;
      const [lon,lat]=center.geometry.coordinates;
      if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
      // ABOVE the point marks. Facility marks became icons on 2026-10-21 so they could carry a
      // halo, which moved them from the overlay pane into the marker pane -- where a dense layer
      // covered the site markers and swallowed their clicks. A pane fixed the stacking then and
      // broke the vector basemap's attribution, so it was reverted to `zIndexOffset`; the pane it
      // broke was one the basemap bridge drew into. Its own pane, which nothing else draws into,
      // is checked against the attribution by tests/catchments.browser.mjs.
      L.marker([lat,lon],{pane:sitesPane(),icon:L.divIcon({className:'catchment-site-marker',iconSize:[12,12],iconAnchor:[6,6]}),title:center.name})
        .bindPopup(`<b>${esc(center.name??'Center')}</b><br>Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}`).addTo(group);
    }
    if(group.getLayers().length){if(!hiddenPort('centers')){group.addTo(map);all.addLayer(group);}
      place('centers','Centers',group);}
  }
  // BOTTOM TO TOP, as the list says. Insertion order decided this until now, which meant the
  // order the constructing lines happen to run in -- defensible for the drawing, meaningless for
  // the reader, and impossible for a practitioner to change.
  for(const {key,layer} of placed.sort((a,b)=>a.order-b.order))
    overlays[Object.hasOwn(overlays,key)?`${key} (2)`:key]=layer;
  L.control.layers({},overlays,{collapsed:false}).addTo(map);L.control.scale({imperial:false}).addTo(map);
  // THE SAME LEGEND THE STATIC FIGURE CARRIES. A choropleth here had its classes and no key to
  // read them by: a reader could see five shades and had no way to turn one into a number, which
  // is the one thing a ramp cannot be read for. The practitioner, 2026-10-26: "the interactive
  // map should also show the value classes, as in the static map." Built from the same
  // `classifyValues`, so the two renderers cannot state different breaks for one figure.
  if(classed){
    const values=shadedValues(p.features);
    const edges=[Math.min(...values),...classed.breaks];
    const legend=new L.Control({position:'bottomleft'});
    legend.onAdd=()=>{
      const box=L.DomUtil.create('div',values.every(v=>Number.isInteger(v))?'map-class-legend ranges':'map-class-legend');
      // THE STATIC FIGURE'S KEY, the ramp with its edges (2026-11-13: the practitioner reads that one, and this one's six-digit
      // edges ran together under 30-pixel classes). Each class is now as wide as an edge's number needs; the shade is named.
      const said=(v:number)=>Number(round(v)).toLocaleString('en');
      box.innerHTML=(p.valueName?.trim()?`<p class="map-class-name">${esc(p.valueName.trim())}</p>`:'')
        +`<div class="map-class-ramp">`+classed.colours.map(c=>`<i style="background:${c}"></i>`).join('')
        +(values.every(v=>Number.isInteger(v))
          ?`</div><div class="map-class-edges ranges">`+classRanges(values,classed.breaks).map(r=>`<span>${esc(r)}</span>`).join('')
          :`</div><div class="map-class-edges">`+edges.map(v=>`<span>${said(v)}</span>`).join(''))
        +`</div><p>${classed.classes} ${classed.method==='quantile'
          ?'quantile classes · the shade shows rank'
          :'equal-interval classes · the shade shows magnitude'}</p>`;
      L.DomEvent.disableClickPropagation(box);
      return box;
    };
    legend.addTo(map);
  }
  // THE DAY-BY-DAY PLAYBACK (the space-time scan's replay; the practitioner, 2026-11-10: "Where do I see the day by day
  // play"). Each day: that day's circle, the cases with a date up to that day, and what the scan said, in words.
  if(timeline){
    const days=timeline.days;let at=days.length-1,timer:number|undefined;
    const control=new L.Control({position:'topleft'});
    const box=L.DomUtil.create('div','map-frame-control');
    const show=(layer:L.Layer,on:boolean)=>{const holder=(dayParts.find(x=>x.layer===layer)?.group)??map;
      if(on&&!map.hasLayer(layer))(holder as L.Map).addLayer(layer);if(!on&&map.hasLayer(layer))map.removeLayer(layer);};
    const draw=(index:number)=>{
      at=index;const day=days[at]!;
      for(const part of dayParts)show(part.layer,part.day===day);
      gpu?.setDay(day);
      for(const mark of datedMarks){const on=mark.date<=day;if(on&&!mark.group.hasLayer(mark.marker))mark.group.addLayer(mark.marker);
        if(!on&&mark.group.hasLayer(mark.marker))mark.group.removeLayer(mark.marker);}
      (box.querySelector('[data-frame-slider]') as HTMLInputElement).value=String(at);
      box.querySelector('[data-frame-label]')!.textContent=day;
      box.querySelector('[data-frame-caption]')!.textContent=timeline.captions[day]??'';
    };
    const stop=()=>{if(timer!==undefined){clearInterval(timer);timer=undefined;}box.querySelector('[data-frame-play]')!.textContent='Play';};
    box.innerHTML=`<p class="map-frame-label" data-frame-label aria-live="polite"></p><p class="map-frame-caption" data-frame-caption></p>`
      +`<input type="range" min="0" max="${days.length-1}" step="1" data-frame-slider aria-label="Day">`
      +`<div class="map-frame-buttons"><button type="button" data-frame-step="-1" aria-label="Previous day">\u25c0</button>`
      +`<button type="button" data-frame-play>Play</button>`
      +`<button type="button" data-frame-step="1" aria-label="Next day">\u25b6</button>`
      +`<select data-frame-pace aria-label="Pace"><option value="1500">Slow</option><option value="700" selected>Normal</option><option value="300">Fast</option></select></div>`;
    (box.querySelector('[data-frame-slider]') as HTMLInputElement).oninput=e=>{stop();draw(Number((e.target as HTMLInputElement).value));};
    box.querySelectorAll<HTMLButtonElement>('[data-frame-step]').forEach(b=>b.onclick=()=>{stop();draw(Math.min(days.length-1,Math.max(0,at+Number(b.dataset.frameStep))));});
    box.querySelector<HTMLButtonElement>('[data-frame-play]')!.onclick=()=>{
      if(timer!==undefined){stop();return;}
      if(at===days.length-1)draw(0);
      box.querySelector('[data-frame-play]')!.textContent='Pause';
      timer=window.setInterval(()=>{draw(at+1);if(at>=days.length-1)stop();},Number((box.querySelector('[data-frame-pace]') as HTMLSelectElement).value));
    };
    stopFrames=stop;
    L.DomEvent.disableClickPropagation(box);
    control.onAdd=()=>box;control.addTo(map);
    draw(at);
  }
  // THE FRAME CONTROL. A slider, Play, Pause and a step each way; the caption is the practitioner's and
  // the frame label is the data's. It plays only while every part is in view, the practitioner's rule
  // for any map that plays: "We only need the playback for maps where the zoom level has all the data."
  if(frameNames.length&&classed){
    let at=frameNames.length-1,timer:number|undefined;
    const control=new L.Control({position:'topleft'});
    const box=L.DomUtil.create('div','map-frame-control');
    const draw=(index:number)=>{
      at=index;const name=frameNames[at]!;
      for(const {f,layer,title} of framedParts){
        const value=f.frames?.[name]??null;
        const cls=value===null?null:classed.classOf(value);
        layer.setStyle({fillColor:cls===null?FIGURE_ROLE.unknown:classed.colours[cls],fillOpacity:cls===null?.18:.78});
        layer.setPopupContent(`${title}<br>${esc(name)}: ${value===null?'no value':`${round(value)}${cls===null?'':` · class ${cls+1} of ${classed.classes}`}`}`);
      }
      (box.querySelector('[data-frame-slider]') as HTMLInputElement).value=String(at);
      box.querySelector('[data-frame-label]')!.textContent=`${frameCaption?`${frameCaption} · `:''}${name}`;
    };
    const stop=()=>{if(timer!==undefined){clearInterval(timer);timer=undefined;}
      box.querySelector('[data-frame-play]')!.textContent='Play';};
    stopFrames=stop;
    const inView=()=>!all.getBounds().isValid()||map.getBounds().contains(all.getBounds());
    box.innerHTML=`<p class="map-frame-label" data-frame-label aria-live="polite"></p>`
      +`<input type="range" min="0" max="${frameNames.length-1}" step="1" data-frame-slider aria-label="Frame">`
      +`<div class="map-frame-buttons"><button type="button" data-frame-step="-1" aria-label="Previous frame">◀</button>`
      +`<button type="button" data-frame-play>Play</button>`
      +`<button type="button" data-frame-step="1" aria-label="Next frame">▶</button>`
      +`<select data-frame-pace aria-label="Pace"><option value="2000">Slow</option><option value="1000" selected>Normal</option><option value="500">Fast</option></select></div>`
      +`<p class="muted" data-frame-says></p>`;
    const says=box.querySelector('[data-frame-says]')!;
    (box.querySelector('[data-frame-slider]') as HTMLInputElement).oninput=e=>{stop();draw(Number((e.target as HTMLInputElement).value));};
    box.querySelectorAll<HTMLButtonElement>('[data-frame-step]').forEach(b=>b.onclick=()=>{
      stop();draw(Math.min(frameNames.length-1,Math.max(0,at+Number(b.dataset.frameStep))));});
    box.querySelector<HTMLButtonElement>('[data-frame-play]')!.onclick=()=>{
      if(timer!==undefined){stop();return;}
      if(!inView()){says.textContent='Some parts are outside the view. Fit all layers to play.';return;}
      says.textContent='';
      if(at===frameNames.length-1)draw(0);
      box.querySelector('[data-frame-play]')!.textContent='Pause';
      timer=window.setInterval(()=>{
        if(!inView()){stop();says.textContent='Paused: some parts moved out of view.';return;}
        draw(at+1);
        if(at>=frameNames.length-1)stop();
      },Number((box.querySelector('[data-frame-pace]') as HTMLSelectElement).value));
    };
    L.DomEvent.disableClickPropagation(box);
    control.onAdd=()=>box;control.addTo(map);
    draw(at);
  }
  // THE CLASSES, NAMED, for the same reason the static figure names them: a hue with no label says
  // nothing, and `polygonShading` is what makes this agree with the fills above.
  if(grouped){
    // Bottom right where a playback panel holds the left: on a short map the two met, and the key was hidden (2026-11-10).
    const legend=new L.Control({position:timeline||(frameNames.length&&classed)?'bottomright':'bottomleft'});
    legend.onAdd=()=>{
      const box=L.DomUtil.create('div','map-class-legend');
      // THE FIGURE'S KEY, entry for entry: a ring keyed as a ring, never a filled square over an outline (2026-11-19).
      box.innerHTML=(groupedKey(p.features)??[]).map(item=>`<p><i data-key-hollow="${item.hollow?'true':'false'}" style="display:inline-block;width:12px;height:12px;box-sizing:border-box;`
        +(item.hollow?`border:3px solid ${item.color};border-radius:50%;background:transparent`:`background:${item.color}`)+`"></i> ${esc(item.label)}</p>`).join('');
      L.DomEvent.disableClickPropagation(box);
      return box;
    };
    legend.addTo(map);
  }
  const fit=()=>{if(all.getBounds().isValid())map.fitBounds(all.getBounds(),{padding:[20,20]});else map.setView([0,0],2);};
  // The identity of what is being looked at: this node, showing these bounds. `fit` is the
  // right arrival for a map nobody has moved yet and the wrong one for a remount caused by a
  // presentation change, and the key is what tells the two apart.
  const settled=all.getBounds();
  const viewIdentity=viewKey&&settled.isValid()?`${viewKey}|${settled.toBBoxString()}`:undefined;
  if(viewIdentity&&rememberedView?.key===viewIdentity)
    map.setView([rememberedView.lat,rememberedView.lng],rememberedView.zoom,{animate:false});
  else fit();
  // WHERE THE MAP IS LOOKING, on the element. Written whether or not a view is being remembered,
  // because it is the state a reader of the DOM -- a test, a screenshot comparison, somebody
  // debugging a remount -- otherwise has no way to see: Leaflet keeps it on an instance this
  // module does not publish, and the alternative was a global existing only for tests.
  const publish=()=>{const centre=map.getCenter();
    canvas.dataset.viewZoom=String(map.getZoom());
    canvas.dataset.viewLat=centre.lat.toFixed(6);
    canvas.dataset.viewLng=centre.lng.toFixed(6);};
  if(viewIdentity){
    // Recorded after `fit` too, so 'Fit all layers' is itself a view worth returning to and the
    // next remount does not undo it.
    const remember=()=>{const centre=map.getCenter();
      rememberedView={key:viewIdentity,lat:centre.lat,lng:centre.lng,zoom:map.getZoom()};
      publish();};
    map.on('moveend',remember);map.on('zoomend',remember);remember();
  }else{
    map.on('moveend',publish);map.on('zoomend',publish);publish();
  }
  toolbar.querySelector<HTMLButtonElement>('[data-fit]')!.onclick=fit;
  // Full screen, on the element the CSS is written for. Safari before 16.4 has only the webkit
  // names, and an iPhone has neither on a div, so the button says so rather than appearing to work.
  // The button carries its own state: it used to keep saying "Full screen" while full screen was on.
  const fullscreenButton=toolbar.querySelector<HTMLButtonElement>('[data-fullscreen]')!;
  type WebkitElement=HTMLElement&{webkitRequestFullscreen?:()=>Promise<void>|void};
  type WebkitDocument=Document&{webkitFullscreenElement?:Element|null;webkitExitFullscreen?:()=>Promise<void>|void};
  const panel=()=>host.closest<HTMLElement>('#map-panel')||host;
  const fullscreenNow=()=>document.fullscreenElement||(document as WebkitDocument).webkitFullscreenElement||null;
  const markFullscreen=()=>{const on=fullscreenNow()===panel();
    fullscreenButton.textContent=on?'Exit full screen':'Full screen';
    fullscreenButton.setAttribute('aria-pressed',String(on));
    // Not on a map already removed: Configure…'s preview can be mounted and released within one frame (2026-11-10).
    requestAnimationFrame(()=>{if(!disposed)map.invalidateSize();});};
  markFullscreen();
  for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,markFullscreen);
  fullscreenButton.onclick=async()=>{
    const target=panel() as WebkitElement;
    try{
      if(fullscreenNow()===target)await (document.exitFullscreen?.()??(document as WebkitDocument).webkitExitFullscreen?.());
      else if(target.requestFullscreen)await target.requestFullscreen();
      else if(target.webkitRequestFullscreen)await target.webkitRequestFullscreen();
      else throw new Error('unsupported');
    }catch{status.textContent='Full screen unavailable in this browser; use Full screen on the results panel.';}
    markFullscreen();
  };
  const status=toolbar.querySelector<HTMLElement>('[data-tile-status]')!,select=toolbar.querySelector<HTMLSelectElement>('[data-basemap]')!;
  let tiles:L.TileLayer|undefined,pending=0;
  const setBasemap=(choice:BasemapChoice)=>{
    const generation=++pending;
    if(tiles){
      // The vector bridge's getAttribution() reads the LIVE GL map's style sources, so Leaflet
      // gets null when the layer is added (the style has not loaded yet), the credit is added
      // later, and on removal the map is already gone -- Leaflet asks again, gets null, and
      // removes nothing. The source's credit then outlives the basemap it credits. Read it while
      // the layer is still alive, then remove it by hand.
      const credit=(tiles as unknown as {getAttribution?:()=>string|null}).getAttribution?.();
      tiles.remove();tiles=undefined;
      if(credit)map.attributionControl.removeAttribution(credit);
    }
    if(choice==='none'){status.textContent='Local layers work offline';return;}
    if(choice==='tile-extract'){
      // NOTHING HELD IS A STATE, NOT A FAILURE: a workflow from another device carries the spec only.
      status.textContent='Reading the imported tiles\u2026';
      Promise.all([tilesOnDevice(tileExtract?.digest),import('maplibre-gl'),import('@maplibre/maplibre-gl-leaflet'),
        import('@protomaps/basemaps')]).then(([packed,maplibre,,protomaps])=>{
        if(generation!==pending)return;
        if(!packed||!tileExtract?.digest){
          status.textContent='No tiles on this device. Import them in Configure…, under Basemap, while connected.';return;}
        // AGAINST THE PAGE, as every other worker is, not against this module: bundled into a shared chunk (2026-11-22,
        // when the pin editor began to draw basemaps) `import.meta.url` named build/chunks/, where the worker is not.
        if(!workerReady){maplibre.setWorkerUrl(new URL('./build/maplibre-gl-worker.mjs',document.baseURI).href);workerReady=true;}
        if(!extractProtocol){extractProtocol=true;maplibre.addProtocol('fieldwork-tiles',async params=>{
          const [digest,...tile]=params.url.replace('fieldwork-tiles://','').split('/');
          const held=await tilesOnDevice(digest);
          return {data:(held&&unpackTile(held,tile.join('/')))?.buffer??new ArrayBuffer(0)};});}
        // No labels, because labels need glyphs from a server and this map is meant to work offline.
        const style={version:8,sources:{protomaps:{type:'vector',attribution:TILE_CREDIT,maxzoom:tileExtract.maxZoom,
          tiles:[`fieldwork-tiles://${tileExtract.digest}/{z}/{x}/{y}`]}},
          layers:protomaps.layers('protomaps',protomaps.namedFlavor('light'))};
        const layer=(L as unknown as {maplibreGL:(o:unknown)=>L.Layer}).maplibreGL({style});
        tiles=layer as L.TileLayer;layer.addTo(map);
        (layer as unknown as {bringToBack?:()=>void}).bringToBack?.();
        status.textContent=`OpenStreetMap extract \u00b7 ${tileExtract.tiles??0} tiles held on this device`;
      }).catch(()=>{status.textContent='The imported tiles could not be drawn; local layers remain visible.';});
      return;
    }
    if(isVectorBasemap(choice)){
      const design=VECTOR_BASEMAPS[choice];
      // Loaded on demand. maplibre-gl is the largest dependency this application would carry, and
      // a practitioner who never chooses a vector basemap must not pay for it: the import is
      // dynamic so it is a separate chunk, fetched when a style is first selected and never on
      // the offline path.
      status.textContent=`${design.label} loading\u2026`;
      // MAPLIBRE'S STYLESHEET IS NOT OPTIONAL. Without it the canvas container has no
      // positioning and no size, so the layer mounts, the style loads, the tiles are fetched and
      // NOTHING IS DRAWN -- the status line says "online" over a blank map. Leaflet's own CSS is
      // imported in study-area-map.ts; this one was simply never added. Imported here with the
      // renderer so the two always arrive together.
      // The renderer loads on demand; its STYLESHEET is linked eagerly from study-area-map.ts,
      // for the reason recorded there.
      Promise.all([import('maplibre-gl'),import('@maplibre/maplibre-gl-leaflet')]).then(([maplibre])=>{
        // Told where its worker is, once, before any map exists. Without this MapLibre resolves
        // the URL against its own bundle and fails under the chunk layout -- see build.mjs.
        if(!workerReady){maplibre.setWorkerUrl(new URL('./build/maplibre-gl-worker.mjs',document.baseURI).href);workerReady=true;}
        // The practitioner may have changed basemap while this was loading. A style that
        // arrives late must not draw itself over the one they chose instead, nor credit itself.
        if(generation!==pending)return;
        const layer=(L as unknown as {maplibreGL:(o:unknown)=>L.Layer}).maplibreGL({style:design.style});
        tiles=layer as L.TileLayer;layer.addTo(map);
        (layer as unknown as {bringToBack?:()=>void}).bringToBack?.();
        // ATTRIBUTION IS A LICENCE TERM AND THE BRIDGE DOES NOT CARRY IT. MapLibre adds its own
        // when it IS the map; through maplibre-gl-leaflet it is a Leaflet layer, and passing
        // `attribution` to the layer options did nothing -- the control showed "Leaflet" alone,
        // which is the map rendering somebody else's data with no credit. Added to the control
        // directly, and removed when the basemap changes so a style that is no longer drawn is
        // no longer credited.
        status.textContent=`${design.label} online \u00b7 viewed area sent to provider`;
      }).catch(()=>{status.textContent='Vector basemap unavailable; local layers remain visible.';});
      return;
    }
    // A STYLE ON THE PERSON'S OWN KEY: drawn while the key is unlocked; otherwise OpenStreetMap, and the reason said.
    const provider=keyedProvider(choice);
    if(provider){
      const key=basemapKey(provider),source=key?keyedSource(choice,key):undefined;
      if(!source){
        tiles=L.tileLayer(BASEMAPS.osm.url,{maxZoom:BASEMAPS.osm.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:BASEMAPS.osm.attribution});
        tiles.addTo(map);tiles.bringToBack();
        status.textContent=`${BASEMAP_LABELS[choice].split(' \u00b7 ')[0]} needs your ${PROVIDER_NAMES[provider]} key: unlock your credentials, `
          +'then choose it again. OpenStreetMap is shown meanwhile.';
        return;
      }
      const layer=L.tileLayer(source.url,{maxZoom:source.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:source.attribution,
        ...(source.tileSize?{tileSize:source.tileSize,zoomOffset:source.zoomOffset??0}:{}),detectRetina:false});
      tiles=layer;
      let loaded=0,failed=0,why='';
      const say=()=>{status.textContent=!failed?`${source.label} online \u00b7 viewed area sent to ${PROVIDER_NAMES[provider]}`
        :!loaded?`${source.label} unavailable: ${why||`${PROVIDER_NAMES[provider]} did not answer for this key`}. Local layers remain visible.`
        :`${source.label} online \u00b7 ${failed} of ${loaded+failed} tiles in view could not be fetched${why?` (${why})`:''}; local layers remain visible.`;};
      layer.on('tileload',()=>{loaded++;if(failed)say();});
      layer.on('tileerror',event=>{failed++;say();
        if(failed===1){const src=(event as unknown as {tile?:HTMLImageElement}).tile?.src;if(src)void tileFailure(src,PROVIDER_NAMES[provider]).then(text=>{why=text;if(tiles===layer)say();});}});
      layer.on('loading',()=>{loaded=0;failed=0;});
      layer.addTo(map);layer.bringToBack();say();
      if(source.credit)void esriCredit(source.credit).then(credit=>{
        if(!credit||generation!==pending||tiles!==layer)return;
        map.attributionControl.removeAttribution(source.attribution);layer.options.attribution=credit;map.attributionControl.addAttribution(credit);});
      return;
    }
    // A choice this map has no tile source for draws nothing and says so, rather than throwing.
    // `natural-earth-110m` is the case: it is a bundled outline for a STATIC figure, offered only
    // there, and a saved workflow could still carry it here -- a stored value outliving the list
    // that offered it is how an Inspector and a toolbar disagree.
    if(!Object.hasOwn(BASEMAPS,choice)){
      status.textContent=`${BASEMAP_LABELS[choice]} is drawn into a static figure, not onto an `
        +'interactive map. Choose a tile basemap here, or the static presentation for that one.';
      return;
    }
    const source=BASEMAPS[choice as keyof typeof BASEMAPS];tiles=L.tileLayer(source.url,{maxZoom:source.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:source.attribution});
    // COUNTED, NOT FLIPPED BY ONE (2026-11-13): a single tile the provider did not answer set "Basemap unavailable" for good,
    // over a map whose streets were plainly drawn (Botswana, a whole country in view). Said as unavailable only when no tile
    // came; otherwise how many of the tiles in view could not be fetched.
    let loaded=0,failed=0;
    const say=()=>{status.textContent=!failed?`${source.label} online · viewed area sent to provider`
      :!loaded?'Basemap unavailable; local layers remain visible.'
      :`${source.label} online · ${failed} of ${loaded+failed} tiles in view could not be fetched; local layers remain visible.`;};
    tiles.on('tileload',()=>{loaded++;if(failed)say();});
    tiles.on('tileerror',()=>{failed++;say();});
    tiles.on('loading',()=>{loaded=0;failed=0;});
    tiles.addTo(map);tiles.bringToBack();say();
  };
  select.value=basemap;setBasemap(basemap);
  select.onchange=()=>{const choice=select.value as BasemapChoice;setBasemap(choice);onBasemapChange?.(choice);};
  // WHAT IS DRAWN, not what a travel-time figure draws. This was a fixed sentence about nested
  // travel-time regions and capped death radii, printed under every interactive map including a
  // choropleth carrying none of those marks -- the THIRD surface on which this same defect has
  // been reported: the static figure's key on 2026-10-25, the results-panel key and this one on
  // 2026-10-26.
  const note=document.createElement('p');note.className='muted';
  // A FOURTH TIME, 2026-11-10, under the space-time replay: the fallback still described travel times to every map that
  // was not shaded. The travel-time sentence is now said only where the features carry minutes.
  note.textContent=(timeline
    ?'Each day shows that day\u2019s most likely cluster and the cases with a date up to that day. Use the slider or Play. '
    :polygonShading(options.classifyOver??p.features).classed
    ?`Polygon shade: ${p.valueName?.trim()||'the joined value'}, in classes shown in the key. Click a part for its number. `
    :p.features.some(f=>f.minutes!==undefined)
    ?'Nested regions, one colour per travel time, each holding the shorter ones. Red circles: observations; blue squares: sites/context. '
    :'')
    +'Use layer controls and click features for details.';
  host.append(note);
  let disposed=false;const observer=new ResizeObserver(()=>{if(!disposed)map.invalidateSize();});observer.observe(canvas);observer.observe(panel());
  // A PLACE CHOSEN IN THE TABLE is outlined on the map, brought into view if it is out of it, and its popup opened; the
  // place chosen before goes back to how it was drawn.
  if(options.partChooser){
    let marked:{layers:L.GeoJSON[];styles:L.PathOptions[]}|undefined;
    options.partChooser(id=>{
      marked?.layers.forEach((l,i)=>l.setStyle(marked!.styles[i]!));marked=undefined;
      const found=id===null?undefined:partLayers.get(id);if(!found?.length)return;
      marked={layers:found,styles:found.map(l=>{const o=(l.getLayers()[0] as L.Path|undefined)?.options;return {color:o?.color,weight:o?.weight};})};
      found.forEach(l=>{l.setStyle({color:'#c0392b',weight:3});l.bringToFront();});
      const bounds=L.featureGroup(found).getBounds();
      if(bounds.isValid()&&!map.getBounds().contains(bounds))map.fitBounds(bounds,{maxZoom:Math.max(map.getZoom(),6)});
      found[0]!.openPopup(bounds.isValid()?bounds.getCenter():undefined);
    });
  }
  return ()=>{disposed=true;stopFrames();observer.disconnect();gpu?.dispose();
    for(const event of ['fullscreenchange','webkitfullscreenchange'])document.removeEventListener(event,markFullscreen);
    // SHAPES FIRST, RENDERERS LAST (2026-11-10, CI WebKit: "undefined is not an object (evaluating 'this._ctx.save')").
    // map.remove() takes layers in no set order; a canvas renderer removed before its shapes is asked by each later one to
    // redraw, and draws on a canvas already gone. Removed after them, its own teardown cancels the redraw they asked for.
    map.stop();
    map.eachLayer(layer=>{if(!(layer instanceof L.Renderer))map.removeLayer(layer);});
    map.remove();host.replaceChildren();};
}

/** ONE PANEL OF GRID CELLS (Map's manual, History: panels): a small map, its tile basemap where one is chosen, the panel's cells as one
 *  image, and the Leaflet map handed back so the panels can be linked. No toolbar and no key: the figure says those once. */
export function mountDensityPanel(host:HTMLElement,image:string,bounds:readonly [number,number,number,number],basemap:BasemapChoice,
    onMap:(map:L.Map)=>void,outline?:number[][][],points:readonly import('./raster-panels.js').RasterPoints[]=[]):()=>void{
  const map=L.map(host,{scrollWheelZoom:true,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false,zoomSnap:0.25});
  if(Object.hasOwn(BASEMAPS,basemap)){const source=BASEMAPS[basemap as keyof typeof BASEMAPS];
    L.tileLayer(source.url,{maxZoom:source.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:source.attribution}).addTo(map);}
  const [w,s,e,n]=bounds;
  L.imageOverlay(image,[[s,w],[n,e]],{opacity:.85,interactive:false,className:'raster-panel-image'}).addTo(map);
  // The study area's outline, over the cells.
  if(outline?.length)L.polygon(outline.map(ring=>ring.map(([lon,lat])=>[lat!,lon!] as [number,number])),
    {color:'#1f2a24',weight:1,opacity:.8,fill:false,interactive:false,className:'raster-panel-outline'}).addTo(map);
  for(const [k,layer] of points.entries())for(const p of layer.points){
    const mark=L.circleMarker([p.lat,p.lon],{radius:6,color:'#ffffff',weight:1.5,fillColor:RASTER_POINT_COLOURS[k%RASTER_POINT_COLOURS.length]!,fillOpacity:1,className:'raster-point'});
    if(p.name)mark.bindTooltip(p.name,{direction:'right',permanent:layer.points.length<=12,className:'raster-point-label'});mark.addTo(map);}
  map.fitBounds([[s,w],[n,e]],{padding:[8,8]});
  onMap(map);
  return ()=>{map.remove();};
}

/** RASTERS ON ONE MAP, INTERACTIVE (Map's manual, History: rasters on one map, 2026-11-22): each raster's cells and its study
 *  area's outline one layer, in the order given, the later over the earlier; each can be switched off. */
export function mountDensityLayers(host:HTMLElement,plan:readonly (import('./raster-panels.js').RasterMapLayer&{image?:string})[],basemap:BasemapChoice):()=>void{
  const map=L.map(host,{scrollWheelZoom:true,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false,zoomSnap:0.25});
  if(Object.hasOwn(BASEMAPS,basemap)){const source=BASEMAPS[basemap as keyof typeof BASEMAPS];
    L.tileLayer(source.url,{maxZoom:source.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:source.attribution}).addTo(map);}
  const rings=(outline:number[][][])=>outline.map(ring=>ring.map(([lon,lat])=>[lat!,lon!] as [number,number]));
  // BOTTOM TO TOP, as Manage layers lists them. A GROUP IS ONE ENTRY in the layer control, switching every member together.
  const overlays:Record<string,L.LayerGroup>={};
  for(const layer of plan){if(!layer.drawn)continue;
    const key=layer.group??layer.label,group=overlays[key]??=L.layerGroup().addTo(map);
    if(layer.kind==='raster'&&layer.image){const [w,s,e,n]=layer.panel.bounds;
      L.imageOverlay(layer.image,[[s,w],[n,e]],{opacity:.85,interactive:false,className:'raster-panel-image'}).addTo(group);
      if(layer.panel.outline?.length)L.polygon(rings(layer.panel.outline),{color:'#1f2a24',weight:1,opacity:.8,fill:false,interactive:false,className:'raster-panel-outline'}).addTo(group);}
    else if(layer.kind==='area')L.polygon(rings(layer.outline),{color:'#1f2a24',weight:2,opacity:.9,fill:false,interactive:false,className:'raster-map-area'}).addTo(group);
    else if(layer.kind==='points')for(const p of layer.points.points){
      const mark=L.circleMarker([p.lat,p.lon],{radius:6,color:'#ffffff',weight:1.5,fillColor:layer.colour,fillOpacity:1,className:'raster-point'});
      if(p.name)mark.bindTooltip(p.name,{direction:'right',permanent:layer.points.points.length<=12,className:'raster-point-label'});mark.addTo(group);}}
  L.control.layers(undefined,overlays,{collapsed:false}).addTo(map);L.control.scale({imperial:false}).addTo(map);
  const boxes=plan.filter(l=>l.drawn&&l.kind==='raster').map(l=>(l as {panel:{bounds:readonly number[]}}).panel.bounds);
  const all=boxes.length?[Math.min(...boxes.map(b=>b[0]!)),Math.min(...boxes.map(b=>b[1]!)),Math.max(...boxes.map(b=>b[2]!)),Math.max(...boxes.map(b=>b[3]!))]:undefined;
  // FITTED TWO FRAMES ON, once the map has a size; a map removed in between is left alone (2026-11-22: cancelling the first frame
  // did not stop the second, and a redraw then fitted a map that was gone).
  let removed=false;
  const settle=requestAnimationFrame(()=>requestAnimationFrame(()=>{if(removed)return;map.invalidateSize();
    if(all)map.fitBounds([[all[1]!,all[0]!],[all[3]!,all[2]!]],{padding:[8,8],animate:false});else map.setView([0,0],2);}));
  return ()=>{removed=true;cancelAnimationFrame(settle);map.remove();};
}

/** AN ELEMENT AS A CONTROL ON THE MAP, taking no room from it (the inset picker, Map's manual, History: the inset: a bar under the map
 *  took 40 px from it at full screen). Clicks inside it do not reach the map. Returns a remover. */
export function placeOnMap(map:L.Map,element:HTMLElement,position:L.ControlPosition='topleft'):()=>void{
  const control=new L.Control({position});
  control.onAdd=()=>{L.DomEvent.disableClickPropagation(element);L.DomEvent.disableScrollPropagation(element);return element;};
  control.addTo(map);
  return ()=>control.remove();
}

/** A RASTER BASEMAP for a map other than this one (the pin editor's, experiment 09, 2026-11-22): OpenStreetMap,
 *  OpenTopoMap, or a style on the person's own CARTO or Esri key, Esri's satellite imagery among them. `null` with the
 *  reason where the choice draws nothing here: none chosen, a key not unlocked, or a vector or static-only style. */
export const PIN_BASEMAPS:readonly BasemapChoice[]=['none','osm','topo','esri-imagery','carto-voyager','carto-positron'];
export function rasterBasemap(choice:BasemapChoice):{layer:L.TileLayer|null;said:string;provider?:string}{
  if(choice==='none')return {layer:null,said:'Basemap off · pins stay on this device'};
  const provider=keyedProvider(choice);
  if(provider){
    const key=basemapKey(provider),source=key?keyedSource(choice,key):undefined;
    if(!source)return {layer:null,said:`${BASEMAP_LABELS[choice].split(' · ')[0]} needs your ${PROVIDER_NAMES[provider]} key: unlock your credentials, then choose it again.`};
    const layer=L.tileLayer(source.url,{maxZoom:source.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:source.attribution,
      ...(source.tileSize?{tileSize:source.tileSize,zoomOffset:source.zoomOffset??0}:{}),detectRetina:false});
    return {layer,said:`${source.label} online · viewed area sent to ${PROVIDER_NAMES[provider]}`,provider:PROVIDER_NAMES[provider]};
  }
  if(!Object.hasOwn(BASEMAPS,choice))return {layer:null,said:`${BASEMAP_LABELS[choice]} cannot be drawn here.`};
  const source=BASEMAPS[choice as keyof typeof BASEMAPS];
  return {layer:L.tileLayer(source.url,{maxZoom:source.maxZoom,referrerPolicy:'origin',updateWhenIdle:true,keepBuffer:0,attribution:source.attribution}),
    said:`${source.label} online`};
}
