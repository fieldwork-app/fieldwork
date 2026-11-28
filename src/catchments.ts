import {CRS84_IRI,crsIRIFromName} from './metric-crs.js';
import {capFacts,networkCaps} from './caps.js';
import {catchmentSemantics} from './catchment-semantics.js';
import {buffer as turfBuffer} from '@turf/buffer';
import proj4 from 'proj4';
import * as polygonClipping from 'polyclip-ts';
type ClipPolygon=[number,number][][];
type ClipMultiPolygon=ClipPolygon[];
import type {Boundary,PointCollection,PointFeature,Position,WorkflowNode,NodeDefinition} from './types.js';
import type {Receipt} from './results.js';
import {geometryBounds} from './study-area.js';
import {pointRelation} from './spatial-predicates.js';
import {prepareEdges} from './network-edges.js';

/** `limits` records the graph ceiling this network was accepted under, so a practitioner who
 *  raised the knob is not refused later by a step that re-validates against the default. The
 *  limit travels on the value for the same reason the distance unit travels on `nearest`'s
 *  output: a graph of 4,000 junctions is not interpretable without knowing it was allowed. */
/** The travel modes a street network can be DOWNLOADED for. Not the four `reachable_nodes`
 *  offers: cycling needs its own highway list and its own restriction tags, and `other` names no
 *  filter at all, so offering either on the download would be a label over an unchanged graph.
 *  The filters themselves live in street-network.ts; the vocabulary lives here because this
 *  module is the one a worker can see. */
export const NETWORK_TRAVEL_MODES=['walking','driving'] as const;
export type NetworkTravelMode=typeof NETWORK_TRAVEL_MODES[number];
/** The mode a study area of this LEVEL should default to.
 *
 *  The practitioner, 2026-10-21, on a province that would not download: *"At the province level we
 *  are not even looking at walking mode. It will be driving mode."* Then: *"Change the default to
 *  driving at ADM1 level."* A walking network keeps footways, paths and steps, which is most of
 *  what it holds, and nobody walks across a province: at ADM1 and coarser the walking graph is
 *  both the wrong question and the one that will not fit.
 *
 *  The level is read from the acquired boundary's own identifier -- `COD-ADM1-63176286` -- so this
 *  applies only where a published unit was acquired and says which level it is. A drawn box has no
 *  level and keeps walking, because a box can be any size and its extent is not evidence of intent.
 *  An explicit choice always wins: this resolves what an UNSET parameter means, and setting the
 *  control writes a value that is never overridden. */
export const defaultTravelMode=(boundaryID?:string):NetworkTravelMode=>{
  const level=/-(ADM[0-9])-/i.exec(boundaryID??'')?.[1]?.toUpperCase();
  return level==='ADM0'||level==='ADM1'?'driving':'walking';
};
export interface Network {nodes:{id:string;coordinates:Position}[];edges:{from:string;to:string;lengthM:number;geometry?:Position[]}[];source:string;provenance?:Record<string,unknown>;limits?:{maxNodes:number;maxEdges:number}}

/** The default graph ceiling, and the only value measured. Raising it is a knob rather than a
 *  widget by the test experiment 107 derived -- the contract does not move with it: ports, output
 *  port types and behaviour are unchanged and only what is admitted changes, which is what a
 *  threshold does. It is a knob rather than a fixed cap because the failure it guards is now
 *  contained: isochrone runs in a Worker with a 45-second timeout, so exceeding it fails one step
 *  rather than the tab.
 *
 *  Measured 2026-10-13: 2,000 junctions is the tested ceiling, and a 1 km square of central London
 *  normalizes to 5,249 junctions, which exhausted a 4 GB heap during isochrone construction. So
 *  anything above about 3,000 is untested ground and the interface says so rather than pretending
 *  the range is uniform. */
/** Where ISOCHRONE construction was measured to strain memory. Kept at the measured number and
 *  used for the warning the isochrone raises when a run does not return, because that is the only
 *  thing it was ever a measurement of. */
export const ISOCHRONE_MEASURED_NODES=2000;
/** What a network node is allowed to hold, by default.
 *
 *  2,000 until 2026-10-20, which refused every real street network to protect a step that already
 *  protects itself: the isochrone runs in a worker with a boot check and a timeout that names
 *  memory, so too large a graph fails THAT step rather than the tab. Meanwhile Buvuma Island
 *  normalizes to 11,359 network nodes and Bunia to 42,796, so the default refused both -- and the
 *  practitioner's purpose is the opposite: *"we are here to develop a framework that tests the
 *  limits of the browser -- how are we going to make progress if we don't reach the limits?"*
 *
 *  So the data limit is the ceiling a practitioner could already raise it to by hand, and the
 *  measured isochrone threshold keeps its own name above. A graph that is drawn, snapped to or
 *  routed over now works at the size the area really is; one that is then sent to an isochrone is
 *  warned where the measurement says to warn. */
export const NETWORK_NODE_LIMIT=50000;
/** Directed segments per junction, from the shipped 2,000/5,000 pair. Measured on real street
 *  data the ratio is 2.19 (11,497 segments over 5,249 junctions), so 2.5 leaves headroom and one
 *  knob governs both rather than asking a practitioner to calibrate two numbers that move
 *  together. */
export const SEGMENTS_PER_NODE=2.5;
/** THE CEILING A PRACTITIONER MAY RAISE IT TO, which until 2026-10-21 was the default itself.
 *
 *  So the knob could be lowered and never raised, and the byte cap derived from it -- 50,000 x 600
 *  = 30.0 MB -- was a hard limit on every download, from a number that was modelled rather than
 *  met. The practitioner's Ituri Province download stopped at exactly that: *"The street network
 *  download for Ituri province capped at 30MB and stopped."* And then the argument, which is the
 *  same one that raised the default from 2,000 on 2026-10-20 and was not carried to the ceiling:
 *  *"if we can't download street networks for provinces we will never know how far this
 *  application can go because of an imagined cap."*
 *
 *  Nothing here was measured past the isochrone extent at 7.39 MB and 27,181 junctions. A cap that
 *  stops the measurement is not a safety property; it is the reason the limit stays imagined. So
 *  the ceiling is one million junctions -- about 600 MB at the padded rate, which the large store
 *  holds and the service is unlikely to serve in one request anyway -- and what is NOT known above
 *  the measured range is said on the widget instead of being enforced by a number nobody derived.
 *  The DEFAULT is unchanged at 50,000, so a practitioner who never touches the knob sees exactly
 *  the previous behaviour. */
export const NETWORK_NODE_LIMIT_MAX=1_000_000;
/** The largest graph this repository has actually DOWNLOADED, parsed and drawn. Above it the
 *  download warns rather than refuses: the failure is then a measurement.
 *
 *  A different number from the largest it has BUILT. The street engine read 122,061 junctions for
 *  a province out of a published extract on 2026-10-22 (experiment 129), and that path transfers
 *  nothing, so it has no byte budget to warn about and this figure does not apply to it. */
export const NETWORK_MEASURED_NODES=27_181;
/** WHEN THE JSON EDITOR IS OFFERED, counted in nodes plus directed edges.
 *
 *  The Inspector carried a textarea holding `JSON.stringify(network,null,2)` for every network,
 *  built on every render and inside a COLLAPSED `<details>`, so the cost bought nothing on screen.
 *  Measured 2026-10-22 at the province the practitioner was looking at when Chrome killed the tab
 *  -- 113,485 nodes and 289,080 directed edges: 41.8 MB built, 59.7 MB again after escaping, about
 *  203 MB of UTF-16 held, per render, and the Inspector re-renders on every selection and every
 *  parameter change. Their report: *"Chrome has become unstable ... viewing the street network
 *  widget with drc.osm.pbf loaded"*, and *"if I change workflows no crash"* -- which is the tell:
 *  the cost is paid only while that node's Inspector is on screen.
 *
 *  20,000 elements is about 1.9 MB of pretty-printed JSON, which is the 2 MB this same control
 *  already states as its upload limit. Above it the textarea is not offered and the panel says
 *  why; the file input beside it stays, so a large graph can still be replaced by a small one.
 *  A limit on a text box, not on a network: the graph is held, drawn, run and exported whatever
 *  its size. */
export const JSON_EDITOR_ELEMENT_LIMIT=20_000;
/** Whether a graph is small enough for that text box. Counted, never serialised: asking the
 *  question must not cost what the answer avoids. */
export const offersJsonEditor=(network:{nodes:unknown[];edges:unknown[]}):boolean=>
  network.nodes.length+network.edges.length<=JSON_EDITOR_ELEMENT_LIMIT;
/** What a response costs per junction it finally yields, measured 2026-10-13 on two real extents
 *  with the tightened query:
 *
 *  | Snow rectangle   | 1.42 MB | 9,458 features  | 5,249 junctions  | 270 B, 1.80 features each |
 *  | Isochrone extent | 7.39 MB | 50,791 features | 27,181 junctions | 272 B, 1.87 features each |
 *
 *  Close enough on two very different areas to derive the download caps from the graph knob rather
 *  than leave three independent numbers that were never measured against each other -- which is how
 *  a 6 km envelope came to sit beside a 2,000-junction cap that no dense urban kilometre could meet.
 *  The multipliers carry roughly double the measured cost as headroom, because a sparse area yields
 *  fewer junctions per byte and must not be refused for it. */
export const BYTES_PER_NODE=600;
/** What one returned ELEMENT costs, from the same two measurements: 1.42 MB over 9,458 features is
 *  150 B, and 7.39 MB over 50,791 is 145 B. Unlike the per-junction figure this one is not padded,
 *  because it is used to PREDICT a response rather than to bound one: a prediction with headroom
 *  in it refuses areas that would have fitted. Added 2026-10-21, when a practitioner raised the
 *  graph limit from 50,000 to 100,000, downloaded 60 MB of a public service's work and had it
 *  discarded at the cap for the second time: *"Doubling to 100000 did not help."* The service can
 *  say how many elements are there for the price of one cheap request, and 150 B turns that into
 *  megabytes, which turns the guess into a number. */
export const BYTES_PER_FEATURE=150;
/** How long ONE segment may be, as a unit check rather than a judgement about roads.
 *
 *  It was 100,000 m, and on 2026-10-22 a province's driving network built from a published extract
 *  was refused by it: 2 of 314,955 segments were over, the longest 100,723 m. Collapsing the chain
 *  of road between two junctions is what simplification does, and in rural Ituri a chain is
 *  genuinely a hundred kilometres. The cap was never derived from anything; it read as a statement
 *  about how long a road can be, which is not this function's business.
 *
 *  1,000 km is kept because the check still has a job: a length given in degrees, or in kilometres
 *  read as metres, lands orders of magnitude away from the truth and should be caught before it
 *  becomes a travel time. */
export const MAX_EDGE_METRES=1_000_000;
export const FEATURES_PER_NODE=4;
/** Never tighter than the limits that shipped, so raising the knob can only widen what is accepted
 *  and a practitioner who never touches it sees exactly the previous behaviour. */
/** The floor a download is allowed, whatever the graph limit says.
 *
 *  It was 2,000,000 bytes, and on 2026-10-20 a practitioner's download arrived at 2,014,475 and was
 *  discarded for being 0.7% over -- a request made in full to a free public service and then thrown
 *  away, which is the least courteous outcome available.
 *
 *  Two limits had been tied together that answer different questions. `maxNodes` exists because
 *  ISOCHRONE construction exhausted a 4 GB heap at 5,249 nodes; a network that is drawn on a map,
 *  snapped to, or routed over with Dijkstra never meets that, and the isochrone step carries its
 *  own worker and boot guard regardless. So the download floor is set from what a download costs,
 *  and the graph knob still raises it above this for anyone who needs more.
 *
 *  16 MB because the largest extent this repository has measured is its own isochrone extent at
 *  7.39 MB and 50,791 features (the table above), and a floor below that refuses an example the
 *  project ships. Twice that leaves room for a denser one without being a number nobody can
 *  justify. It bounds the tab, which is what a byte cap is for. */
export const DOWNLOAD_FLOOR_BYTES=16_000_000;
export const DOWNLOAD_FLOOR_FEATURES=120_000;
export const downloadLimits=(maxNodes=NETWORK_NODE_LIMIT)=>({
  maxBytes:Math.max(DOWNLOAD_FLOOR_BYTES,maxNodes*BYTES_PER_NODE),
  maxFeatures:Math.max(DOWNLOAD_FLOOR_FEATURES,maxNodes*FEATURES_PER_NODE),
});
export const graphLimits=(maxNodes=NETWORK_NODE_LIMIT)=>
  ({maxNodes,maxEdges:Math.round(maxNodes*SEGMENTS_PER_NODE)});
/** `areaSquareMetres` and `spanMetres` are DERIVED quantities, attached to the record rather than
 *  left in the receipt. Until 2026-10-14 a hull computed its area, wrote it to `fw:hullAreaSquareMetres`
 *  and to a note, and dropped it: the feature carried id, name, siteId and geometry. Nothing
 *  downstream could use it, because a port carries a value and not a receipt, and reaching through
 *  to a receipt is how a thin port type becomes a thick one. A rule that asks "is this catchment
 *  larger than 2 km2?" has nothing to bind to until the quantity is a field. Experiment 113.
 *
 *  Metres, always, and only written by a widget that projected to get them -- an area computed in
 *  degrees is not an area. A widget that works in CRS84 leaves these absent, which is the honest
 *  answer rather than a number in the wrong unit. */
/** `offNetworkMetres` is the straight-line leg charged to reach the network, present only when it
 *  exceeded the snap limit. Its presence marks a catchment that rests on an assumed walkable line;
 *  its absence means the whole route was on mapped streets. See `OffNetworkSite`. */
/** `status` and `explanation` are a RULE's conclusion about this polygon, attached to the polygon
 *  rather than returned beside it.
 *
 *  Added 2026-10-14, after the practitioner asked how decisions can be an output. A ruleset over
 *  points returned its subject whole with a status added; a ruleset over polygons returned the
 *  judgement and dropped the geometry, so a decision about a shape could be listed and never
 *  drawn. Carrying it here means a map can colour by it, a clip or a summary afterwards keeps it,
 *  and nothing has to reach back to a receipt to find out what was decided. Experiment 113. */
/** `properties` is the OPEN BAG this type never had, and its absence is why a table could not
 *  colour the boundaries it was keyed on. Every other field here is a named slot owned by one
 *  operation -- `count` and `total` by the point summary, `minutes` by the isochrone -- so a
 *  value from anywhere else had nowhere to go. Adding a bag is additive: the ten slots stay, and
 *  whether they should fold into it is a separate question with 41 call sites behind it.
 *
 *  `value` repeats whichever property a figure is drawn by, in a fixed place, so a renderer can
 *  colour by it without being told which column to read. */
/** `siteId` is OPTIONAL from 2026-10-28. It names the site a polygon was derived from, and
 *  seven producers had one because every one of them derived polygons from sites. A polygon read
 *  from a published file is derived from nothing, so it has no site -- and `area-join.ts` was
 *  already fabricating one, setting `siteId:part.id` so each of South London's 32 administrative
 *  sub-districts was its own site, then casting past the compiler with `as unknown as`. A field
 *  that has to be invented to be satisfied is a field that should not be required.
 *
 *  The type's NAME is a separate and larger problem, recorded in the direction
 *  `a-label-cannot-be-pinned-to-one-study`: a Voronoi cell models proximity rather than service
 *  delivery, so `Catchment` overclaims even for the producer it was named after, and it now also
 *  carries H3 cells, a hull, a union and administrative units. */
export interface Catchment {id:string;name:string;
  /** DRAWN AS A RING, outline only, where the polygon stands for one place and its size is not an area: a space-time
   *  cluster at one house (2026-11-15, the practitioner: "Yes ring around the house"). */
  ring?:boolean|'secondary';
  /** One value per frame, where the layer carries frames. Experiment 168. */
  frames?:Record<string,number|null>;
  /** WHICH LAYER THIS POLYGON CAME FROM, where it came from one that was collected.
   *
   *  `stack_polygons` concatenated several layers into one feature list and kept no record of
   *  which was which, so two water layers wired to one map could not be told apart on
   *  2026-10-28: by the time the map saw them they were not two layers, and the legend had to be
   *  rebuilt by guessing from feature names. Carried per feature rather than per collection
   *  because a collection is exactly the case where one name for the whole will not do. */
  layerName?:string;siteId?:string;geometry:Boundary;properties?:Record<string,import('./types.js').Scalar>;value?:number;
  /** THE CLASS THIS POLYGON BELONGS TO, where something classified it.
   *
   *  Separate from `value` because the two are different kinds of quantity and a renderer must
   *  not confuse them: a value is ranked along a lightness ramp, a category is not ranked at
   *  all. Keeping them apart is what makes it impossible to draw water companies as though one
   *  were more than another. */
  category?:string;status?:'Review'|'NoFlag'|'Unknown';explanation?:string;offNetworkMetres?:number;minutes?:number;count?:number;total?:number;missingValues?:number;areaSquareMetres?:number;spanMetres?:number}
/** `unconnected` lists the sites that got no catchment, and `offNetwork` the sites that got one
 *  across a leg no street covers.
 *
 *  A site further than the snap limit used to end the run: a throw inside the per-site
 *  loop, so ONE distant site took every other site's catchment with it. It is now routed anyway,
 *  with the crow-flies walk charged against the budget, and listed in `offNetwork` so the answer
 *  says which legs it assumed. `unconnected` is what is left when even that is impossible: the
 *  walk alone spends the budget. The practitioner's instruction of 2026-10-14 --
 *  "the route widget should alert the user that there are sites that did not connect, a feedback
 *  loop that can be acted on" -- is what this carries. A site nobody can route to is a finding
 *  about access, and a finding is reported, not raised.
 *
 *  An unconnected site is absent from `features` because `Catchment.geometry` is a real polygon
 *  and there is no honest one to draw. So the absence is stated here instead, where a consumer can
 *  say "7 of 9 sites" rather than quietly summarising 7 and calling it all of them. An off-network
 *  site IS in `features`, carrying `offNetworkMetres`, because it has a real answer -- one that
 *  rests on an assumption the ordinary catchments do not make. Experiment 114. */
/** A site whose route begins with a leg no street covers: it is further from the network than the
 *  snap limit allows, and the walk onto the network is charged as a straight line anyway.
 *
 *  `distanceM` is D1 as the crow flies, which is a LOWER BOUND on the walk, not a measurement of
 *  it: it assumes the line is walkable, and where D1 is large -- a home set back from any mapped
 *  road -- the walked path is routinely longer. It is also charged at the network speed, which is
 *  a second optimistic assumption. The result for this site is therefore too generous in a stated
 *  direction, which is what distinguishes it from the result for a site on the network. */
export interface OffNetworkSite {siteId:string;name:string;distanceM:number;limitM:number}
/** A site that got no result at all: the walk onto the network alone costs the whole budget, so
 *  nothing is reachable within the stated time.
 *
 *  That is a finding, not a failure -- "this site reaches nothing in five minutes" is the answer --
 *  but it cannot be drawn. No polygon is emitted, because the only shape available is a `bufferM`
 *  disc around the junction, which is neither where the site is nor anywhere it can reach. */
export interface UnconnectedSite {siteId:string;name:string;distanceM:number;budgetM:number}
/** Reads the omissions off ANY node value, since several widgets now report them and the caller
 *  (the executor) holds values it cannot narrow. Absent, empty and "not that kind of value" all
 *  read as no omissions, which is the right answer for a widget that has none. */
export function unconnectedSites(value:unknown):UnconnectedSite[]{
  const list=(value as {unconnected?:unknown})?.unconnected;
  return Array.isArray(list)?list as UnconnectedSite[]:[];
}
export function offNetworkSites(value:unknown):OffNetworkSite[]{
  const list=(value as {offNetwork?:unknown})?.offNetwork;
  return Array.isArray(list)?list as OffNetworkSite[]:[];
}
export interface Polygons {kind?:'hexbin';siteSourceNodeId?:string;
  /** What to call this layer where a reader toggles it. A value-classed layer's parts are
   *  ONE layer -- 33 sub-districts shaded by a rate are not 33 things to switch on and off
   *  -- so the control needs a name for the whole rather than one per part. */
  layerName?:string;
  /** What a classed layer's shade is, in words, such as "population, people per pixel": the key says it. */
  valueName?:string;
  /** The attribute that holds each part's `value`, such as "population": the column a table of these parts totals. */
  valueColumn?:string;
  /** THE UNIT OF THAT VALUE, as the step that made it declares it (2026-11-20): a table of these parts carries it. */
  valueUnit?:string;
  /** THE FRAMES each part carries a value for, in order, where a join was given a frame column. */
  frames?:string[];
  /** Whether the features are NAMED THINGS or numbered parts of one layer. A read numbers what
   *  it could not name, so a renderer cannot tell by looking, and the difference decides whether
   *  a hue per feature says anything at all. */
  featuresNamed?:boolean;
  /** BUILT FROM THE STUDY AREAS CONNECTED TO IT, not read from a file (2026-11-23): the parts of the areas a workflow
   *  already works within. Such a layer is the ground the rest of the map stands on, which is what decides whether a
   *  hue per feature says anything where points are drawn over it. A layer read from a file is not this, however its
   *  features are named: the Thames' tidal and non-tidal reaches are two things a reader wants told apart. */
  fromStudyAreas?:boolean;
  /** A TIMELINE OF DAYS, where each feature belongs to one (the space-time scan's replay, 2026-11-10): the interactive
   *  map plays through them, drawing each day's features and the points with a date in `dateField` up to that day.
   *  `captions` says, per day, what the frame shows. */
  timeline?:{days:string[];dateField:string;captions:Record<string,string>};
  features:Catchment[];sites:PointFeature[];method:string;crs:string;boundary?:Boundary;notes:string[];observations?:PointCollection;
  /** THE LAYER THE OBSERVATIONS CAME FROM, so a map draws them as that layer, with its symbol (2026-11-27). */
  observationsFrom?:{id:string;label:string};
  /** How a map with no area draws them: their layer's symbol, resolved from Map's settings. */
  observationSymbol?:{colour:string;size:number;sizeBy?:string};summary?:{records:number;matched:number;unmatched:number;missingLocation:number;multiple:number;valueField:string};snaps?:{siteId:string;nodeId:string;distanceM:number}[];unconnected?:UnconnectedSite[];offNetwork?:OffNetworkSite[]}
export const CATCHMENT_TYPES:Record<'voronoi'|'network_input'|'isochrone'|'clip_polygons'|'summarize_points_to_polygon',NodeDefinition>={
  voronoi:{title:'Voronoi catchments',group:'Spatial operations',icon:'◇',color:'teal',description:'Allocate an extent to the nearest site in a metric CRS',inputs:[['area','area'],['sites','points']],output:'polygons'},
  network_input:{title:'Street network',group:'Sources',icon:'⌁',color:'blue',description:'Download OSM by study area or upload a directed graph',inputs:[['area','area']],output:'network'},
  isochrone:{title:'Network isochrone',group:'Spatial operations',icon:'◷',color:'teal',description:'Buffer reachable network segments for a time budget',inputs:[['sites','points'],['network','network']],output:'polygons'},
  clip_polygons:{title:'Clip polygons',group:'Spatial operations',icon:'✂',color:'teal',description:'Intersect each polygon with the study area',inputs:[['area','area'],['polygons','polygons']],output:'polygons'},
  summarize_points_to_polygon:{title:'Summarize points to polygons',group:'Summaries',icon:'∑',color:'teal',description:'Count locations and optionally sum a numeric attribute',inputs:[['polygons','polygons'],['points','points']],output:'polygons'}
};
const validId=(s:unknown)=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(s);
const coordinate=(p:unknown):p is Position=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=80;
export function validateNetwork(n:Network,maxNodes?:number){
  // Precedence: an explicit argument, then the ceiling the network itself was accepted under, then
  // the default. The middle term is what stops a step downstream of a raised knob from refusing a
  // graph the practitioner deliberately allowed.
  void graphLimits;void maxNodes;
  if(!n||!Array.isArray(n.nodes)||!Array.isArray(n.edges)||!n.nodes.length||typeof n.source!=='string'||!n.source.trim()||n.source.length>2000)
    throw new Error('A street network needs at least one junction, an array of segments and a source description.');
  // NO SIZE REFUSAL HERE. There was one, derived from the graph knob, and it refused a street
  // network for a reason that belongs to a different step: the number it cited was measured on
  // ISOCHRONE construction in central London, 2026-10-13, where 5,249 junctions exhausted a 4 GB
  // heap. The practitioner, 2026-10-21, having finally got a province to download and watched it
  // discarded at 1,837,939 junctions:
  //
  //   *"Still did not work, and I don't think the isochrone exercise in London should dictate a
  //   cap. That is a totally unrelated problem to this one, and an isochrone activity is not even
  //   assumed at this point."*
  //
  // Right on both counts, and the file said so already: the comment above NETWORK_NODE_LIMIT
  // records that a network which is drawn, snapped to or routed over never meets that cost, and
  // that the isochrone carries its own worker, boot check and timeout. It then enforced the
  // isochrone's number on everything anyway.
  //
  // Worse, it enforced it HERE -- after the response was downloaded, streamed, parsed and
  // normalized. A refusal at this point protects nothing: every byte and every allocation has
  // already been paid for. What bounds a download is the byte cap, which the practitioner sets
  // and which did its job; what bounds an isochrone is the isochrone; what bounds a saved graph is
  // the store, which reports its own refusal. A graph is now allowed to be the size the area is.
  const ids=new Set<string>();for(const p of n.nodes){if(!p||!validId(p.id)||ids.has(p.id)||!coordinate(p.coordinates))throw new Error('Network node IDs and CRS84 coordinates must be valid and unique.');ids.add(p.id);}
  let vertices=0;for(const e of n.edges){
    // WHICH edge and WHICH condition, because "network edges need known endpoints and positive
    // metre lengths" sent a practitioner looking at 314,955 of them on 2026-10-22, when two were
    // over a cap.
    if(!e||!ids.has(e.from)||!ids.has(e.to))
      throw new Error(`A street segment runs between junctions this network does not contain `
        +`(${e?`${e.from} to ${e.to}`:'a missing segment'}), so it was not accepted.`);
    if(!Number.isFinite(e.lengthM)||e.lengthM<=0)
      throw new Error(`A street segment from ${e.from} to ${e.to} has a length of ${e.lengthM}, `
        +`which is not a positive number of metres.`);
    if(e.lengthM>MAX_EDGE_METRES)
      throw new Error(`A street segment from ${e.from} to ${e.to} is `
        +`${Math.round(e.lengthM/1000).toLocaleString()} km long, past the `
        +`${(MAX_EDGE_METRES/1000).toLocaleString()} km a single segment may be. That limit is a `
        +`unit check, not a geography one: a length in degrees or kilometres read as metres lands `
        +`far outside it.`);if(e.geometry){vertices+=e.geometry.length;if(!Array.isArray(e.geometry)||e.geometry.length<2||!e.geometry.every(coordinate))throw new Error('Invalid edge geometry.');}}
  // The 30,000-vertex cap on edge geometry went with it, for the same reason and in the same
  // place: a province's ways carry millions of bends, and counting them after they are in memory
  // is not a guard. `vertices` is still summed, because the loop above validates each one.
  void vertices;
  // STRUCTURE, NOT SIZE -- the last of this family. The 100,000-character cap on provenance was
  // reached on 2026-10-21 by the province download that had just survived every other one: the
  // record carries the study area's own outline, and 7,759 vertices do not fit in it. Serializing
  // the record to measure it, after the response is downloaded and parsed, in order to refuse it,
  // is the same mistake in the same place as the junction cap above.
  if(n.provenance!==undefined&&(!n.provenance||typeof n.provenance!=='object'||Array.isArray(n.provenance)))
    throw new Error('Network provenance must be a record of what was requested and from where.');
}
export function validateCatchmentNode(n:WorkflowNode){
  if(Object.hasOwn(CATCHMENT_TYPES,n.type)&&(typeof n.params.label!=='string'||!n.params.label.trim()||n.params.label.length>100))throw new Error('Name the operation using 1–100 characters.');
  if(n.type==='network_input'){
    if(!n.params.data||!Array.isArray(n.params.data.nodes)||!Array.isArray(n.params.data.edges))throw new Error('Invalid network input.');
    if(n.params.maxNodes!==undefined&&(!Number.isInteger(n.params.maxNodes)||n.params.maxNodes<500||n.params.maxNodes>NETWORK_NODE_LIMIT_MAX))throw new Error(`Use a graph limit between 500 and ${NETWORK_NODE_LIMIT_MAX.toLocaleString('en')} junctions.`);
    if(n.params.pauseSeconds!==undefined&&(!Number.isFinite(n.params.pauseSeconds)||n.params.pauseSeconds<60||n.params.pauseSeconds>900))throw new Error('Use a 60–900 second pause between OSM requests. 60 is the minimum; it can only be raised.');
    if(n.params.data.nodes.length||n.params.data.edges.length)validateNetwork(n.params.data,n.params.maxNodes);
    if(n.params.marginM!==undefined&&(!Number.isFinite(n.params.marginM)||n.params.marginM<0||n.params.marginM>2000))throw new Error('Use a 0–2,000 metre download margin.');
    if(n.params.inputMethod!==undefined&&!['osm','file','extract'].includes(n.params.inputMethod))throw new Error('Choose an OSM download, a network file, or an extract on this device.');
  }
  if(n.type==='voronoi'||n.type==='isochrone'){if(!Number.isInteger(n.params.zone)||n.params.zone<1||n.params.zone>60||!['north','south'].includes(n.params.hemisphere))throw new Error('Choose a UTM zone 1–60 and hemisphere.');}
  if(n.type==='isochrone'){const p=n.params;if(![p.minutes,p.speedMPerMin,p.bufferM,p.maxSnapM].every(Number.isFinite)||p.minutes<.1||p.minutes>60||p.speedMPerMin<1||p.speedMPerMin>200||p.bufferM<1||p.bufferM>100||p.maxSnapM<0||p.maxSnapM>1000||!['outbound','inbound'].includes(p.direction))throw new Error('Use 0.1–60 minutes, 1–200 m/min, 1–100 m buffer and 0–1,000 m snap limit.');}
  if(n.type==='isochrone'){const p=n.params;if(p.thresholds!==undefined&&(!Array.isArray(p.thresholds)||p.thresholds.length>6||p.thresholds.some((t,i,a)=>!Number.isFinite(t)||t<.1||t>60||(i>0&&t<=a[i-1]))))throw new Error('Use up to six increasing, unique time thresholds between 0.1 and 60 minutes.');if(p.fillHoles!==undefined&&typeof p.fillHoles!=='boolean')throw new Error('Invalid infill option.');}
  if(n.type==='summarize_points_to_polygon'&&(!['include','exclude'].includes(n.params.boundary)||typeof n.params.valueField!=='string'||n.params.valueField.length>100))throw new Error('Choose boundary inclusion and a numeric field name (or leave empty).');
}
export function metric(zone:number,hemisphere:string){
  const definition=`+proj=utm +zone=${zone} ${hemisphere==='south'?'+south ':''}+datum=WGS84 +units=m +no_defs`,p=proj4('EPSG:4326',definition),central=zone*6-183;
  return {crs:`EPSG:${hemisphere==='south'?32700+zone:32600+zone}`,forward:(c:Position):Position=>{if(!coordinate(c)||Math.abs(c[0]-central)>6||(hemisphere==='north'?c[1]<0:c[1]>0))throw new Error('Coordinates fall outside this prototype’s UTM zone/hemisphere guard. Choose the appropriate metric CRS.');return p.forward(c);},inverse:(c:Position):Position=>p.inverse(c)};
}
const dist=(a:Position,b:Position)=>Math.hypot(a[0]-b[0],a[1]-b[1]);

/** The network node nearest a projected point, and how far that is in metres.
 *
 *  **One implementation.** This search existed twice, character for character, in `isochrone`
 *  and in `snap_to_network` -- the latter carrying the comment *"Same nearest-node search
 *  isochrone performs, kept identical so the two agree"*, which is a duplication admitting
 *  itself and relying on care to stay true.
 *
 *  [D2](../docs/audits/widget_audit.md) records nearest-neighbour-with-distance as the operation
 *  this project implements more than once, and
 *  [103](../docs/experiments/103-duplicates-should-merge.md) requires a found duplicate to be
 *  dispositioned rather than noted. Factoring the code is not the whole disposition -- that is a
 *  widget question, recorded in [82](../docs/experiments/82-snap-to-network.md) -- but two copies
 *  of a search that must agree are one copy too many whatever the widgets do.
 *
 *  Both callers pass coordinates already projected into a metric CRS, because nearest-in-degrees
 *  picks the wrong node away from the equator. */
export function nearestNetworkNode<T extends {id:string}>(
  nodes:readonly T[],projected:ReadonlyMap<string,Position>,origin:Position,
):{node:T;distanceM:number}{
  const node=nodes.reduce((a,b)=>
    dist(projected.get(a.id)!,origin)<=dist(projected.get(b.id)!,origin)?a:b);
  return {node,distanceM:dist(projected.get(node.id)!,origin)};
}
function sites(input:PointCollection,max=100){if(!input?.features.length||input.features.length>max||input.features.some(f=>!f.geometry))throw new Error(`Use 1–${max} sites with known locations.`);return input.features;}
function halfPlane(ring:Position[],a:Position,b:Position){
  const normal=[b[0]-a[0],b[1]-a[1]],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],signed=(p:Position)=>(p[0]-mid[0])*normal[0]+(p[1]-mid[1])*normal[1];
  const out:Position[]=[];for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],dp=signed(p),dq=signed(q);if(dp<=0)out.push(p);if((dp<0&&dq>0)||(dp>0&&dq<0)){const t=dp/(dp-dq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;
}
export function voronoi(input:PointCollection,area:Boundary,zone:number,hemisphere:string):Polygons{
  const fs=sites(input),m=metric(zone,hemisphere),xy=fs.map(f=>m.forward(f.geometry!.coordinates));
  for(let i=0;i<xy.length;i++)for(let j=0;j<i;j++)if(dist(xy[i],xy[j])<.001)throw new Error('Coincident sites need an explicit merge or tie policy before Voronoi.');
  const bounds=geometryBounds(area),corners=[[bounds[0],bounds[1]],[bounds[2],bounds[1]],[bounds[2],bounds[3]],[bounds[0],bounds[3]]].map(m.forward);
  if(dist(corners[0],corners[2])>50000)throw new Error('Voronoi prototype reporting extent must be under 50 km across.');
  const xs=corners.map(c=>c[0]),ys=corners.map(c=>c[1]),left=Math.min(...xs)-100,right=Math.max(...xs)+100,bottom=Math.min(...ys)-100,top=Math.max(...ys)+100;
  const features:Catchment[]=fs.flatMap((f,i)=>{let ring:Position[]=[[left,bottom],[right,bottom],[right,top],[left,top]];for(let j=0;j<xy.length&&ring.length;j++)if(i!==j)ring=halfPlane(ring,xy[i],xy[j]);return ring.length<3?[]:[{id:f.id,siteId:f.id,name:f.properties.name,geometry:{type:'Polygon' as const,coordinates:[[...ring,ring[0]].map(m.inverse)]}}];});
  return {features,sites:structuredClone(fs),crs:m.crs,method:'Euclidean half-plane Voronoi in WGS84 UTM; finite reporting envelope',notes:['Finite envelope only; connect Clip polygons for the exact study boundary. Cells model proximity, not actual pump use.']};
}
const multi=(b:Boundary)=>b.type==='Polygon'?[b.coordinates]:b.coordinates;
export function clipPolygons(input:Polygons,boundary:Boundary):Polygons{
  return {...structuredClone(input),boundary:structuredClone(boundary),features:input.features.flatMap(f=>{const coordinates=polygonClipping.intersection(multi(f.geometry) as ClipMultiPolygon,multi(boundary) as ClipMultiPolygon);return coordinates.length?[{...f,geometry:{type:'MultiPolygon' as const,coordinates}}]:[];}),notes:[...input.notes,'Clipped in CRS84 coordinate space; empty intersections omitted.']};
}
/** `onProgress` is called once per site, before that site's search. It exists so a worker can
 *  prove it is still alive: the work is synchronous, so a timer inside the worker cannot fire
 *  during it and only a call from within the computation can. It cannot prove liveness within a
 *  single site, which is the case that exhausts memory -- that needs the search broken into steps,
 *  recorded as the blocker `isochrone-does-not-scale`. */
/** Lines buffered in small batches and unioned in a balanced tree, rather than handed to the
 *  buffer engine all at once.
 *
 *  A buffer distributes over a union, so the strip around a set of streets is the union of the
 *  strips around each -- which means the batch size is free to choose and the answer does not
 *  change with it. Measured 2026-10-13 on a real 10-minute walk over central London (3,925
 *  streets):
 *
 *  | all at once (shipped) | 17,175 ms | +4,599 MB |
 *  | batches of 400        |  3,083 ms |   +195 MB |
 *  | batches of 100        |  2,635 ms |    +82 MB |
 *  | **batches of 25**     |  **2,532 ms** | **+21 MB** |
 *  | batches of 1          |  6,416 ms |    +36 MB |
 *
 *  So 25 is the floor on both axes: below it the per-call overhead of the buffer engine dominates,
 *  above it the engine's own cost grows faster than the saving. The resulting area differs from the
 *  shipped geometry by 0.000006% -- 1 m² in 987,859 -- which is union ordering in floating point.
 *
 *  This is what made a 1 km square of central London exhaust a 4 GB heap: not the search, which
 *  takes 82 ms, but one buffer call over every reached street at once.
 *
 *  The union is a balanced pairwise reduction, not a left fold: folding re-walks the whole
 *  accumulated polygon on every step, which is the same quadratic shape in a different place. */
export const BUFFER_BATCH=25;
/** D3 -- the walk off the last junction to a door -- modelled rather than drawn.
 *
 *  Until 2026-10-14 the corridor was a constant `bufferM` strip around every reached street,
 *  including the streets at the very edge of the budget. Someone standing there has nothing left
 *  to walk, so the catchment claimed 25 m of ground beyond the time it was drawn for, all the way
 *  round its own boundary. The strip was described in the widget's note as a cartographic halo
 *  standing in for D3, which is a way of saying the third segment was not modelled at all.
 *
 *  It is now a LEG WITH A BUDGET. At any point on the route the walk off the network is
 *  `min(bufferM, what is left)`, so the corridor is full width while there is time to spare and
 *  tapers to nothing where the time runs out. `bufferM` stops being a drawing width and becomes
 *  the furthest anyone is assumed to walk off a street at the end of the route -- a cap, because
 *  without one the model lets you leave the network at the origin and walk the whole budget in a
 *  straight line, which is the crow-flies proxy the network routing exists to avoid.
 *
 *  The route is buffered whole: D1 (the straight walk onto the network), D2 (the streets) and D3
 *  (this). The practitioner's instruction of 2026-10-14 -- "connect D1, D2 and D3 and that's what
 *  you buffer". Experiment 114.
 *
 *  Chunking, and what it costs: a chunk takes the budget left at the END it is furthest along,
 *  so the near end of a chunk is buffered by less than it has earned, and the radius is rounded
 *  down into buckets as well. Both remove ground. Against that, each chunk is buffered on its
 *  own, so its far end gets a round cap at the chunk's radius where the rule gives a smaller one,
 *  which adds a little back. They do not cancel exactly: the Validation Lab's check 08 rebuilds
 *  the rule independently at 1 m steps and measures this corridor 0.16% LARGER than the rule
 *  (161,044 m² against 160,785 m², symmetric difference 0.16%, 2026-10-14). So the approximation
 *  is not purely conservative, and that is stated rather than assumed.
 */
export const D3_BUCKETS=6;
export interface ReachChunk {line:Position[];remainingM:number}
/** Split a reached stretch of street into chunks, each carrying the budget left where it ends.
 *  `line` is in projected metres; walking stops when the budget does.
 *
 *  Only the frontier is subdivided. While more than `taperFromM` is left the leg is the full
 *  allowance everywhere, so that stretch is ONE chunk however long it runs; within the last
 *  `taperFromM` metres the radius is falling and the line is cut every `chunkM`. The corridor is
 *  then a handful of buffer calls rather than one per 12 metres of street: measured on the shipped
 *  Snow isochrone, 15.0 s subdividing everything against 2.3 s subdividing the frontier, for the
 *  same polygons. Experiment 114. */
export function reachChunks(line:Position[],startRemainingM:number,taperFromM:number,chunkM:number):ReachChunk[]{
  const out:ReachChunk[]=[];
  let remaining=startRemainingM,current:Position[]=[line[0]],run=0;
  for(let i=1;i<line.length&&remaining>1e-9;i++){
    let [ax,ay]=line[i-1];const [bx,by]=line[i];
    let left=Math.hypot(bx-ax,by-ay);
    while(left>1e-9&&remaining>1e-9){
      // Walk to whichever comes first: the end of this segment, the end of the chunk, the point
      // where the taper begins, or the end of the budget.
      const toTaper=remaining>taperFromM?remaining-taperFromM:Infinity;
      const step=Math.min(left,remaining>taperFromM?toTaper:chunkM-run,remaining);
      const t=step/left,nx=ax+(bx-ax)*t,ny=ay+(by-ay)*t;
      current.push([nx,ny]);
      run+=step;remaining-=step;left-=step;ax=nx;ay=ny;
      if(remaining<=taperFromM+1e-9&&(run>=chunkM-1e-9||remaining<=1e-9||step===toTaper)){
        if(current.length>1)out.push({line:current,remainingM:Math.max(0,remaining)});
        current=[[ax,ay]];run=0;
      }
    }
  }
  if(current.length>1)out.push({line:current,remainingM:Math.max(0,remaining)});
  return out;
}
/** Buffer each chunk by the leg its own budget allows, and union the result.
 *
 *  Radii are quantised DOWN into `D3_BUCKETS` steps so the whole corridor costs a handful of
 *  buffer calls rather than one per chunk, and so that quantising can only make it smaller.
 *  `inverse` returns each chunk to CRS84, where the buffer is measured in metres. */
export function taperedCorridor(chunks:ReachChunk[],maxRadiusM:number,
  inverse:(p:Position)=>Position,fallback:{point:Position;radiusM:number}):Boundary{
  // One street reached from both ends arrives twice, and a street buffered twice costs twice and
  // unions to the same polygon. Pooling by the line itself, keeping whichever reach had more
  // budget left, is what `reachedStreets` did before the taper replaced it -- the same idea,
  // carrying the budget it needs now.
  //
  // What the taper costs, measured on the shipped Snow isochrone (four bands, 2026-10-14):
  //
  // | subdivide every chunk, unpooled             | 15.0 s |
  // | subdivide the frontier only, unpooled       |  6.1 s |
  // | **subdivide the frontier only, pooled**     |  **4.7 s** |
  // | the same streets at a constant radius -- the shape before the taper | 4.1 s |
  //
  // So the modelled D3 costs about 15% over the halo it replaced, and the two optimisations
  // together are the difference between that and three times the work. All four produce the
  // same polygons to within union ordering.
  const pooled=new Map<string,ReachChunk>();
  for(const chunk of chunks){
    const a=chunk.line[0],b=chunk.line.at(-1)!;
    const forward=a[0]>b[0]||(a[0]===b[0]&&a[1]>b[1])?chunk.line.toReversed():chunk.line;
    const key=forward.map(p=>`${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ');
    const seen=pooled.get(key);
    if(!seen||chunk.remainingM>seen.remainingM)pooled.set(key,{line:forward,remainingM:chunk.remainingM});
  }
  const step=maxRadiusM/D3_BUCKETS,buckets=new Map<number,Position[][]>();
  for(const chunk of pooled.values()){
    const radius=Math.floor(Math.min(maxRadiusM,chunk.remainingM)/step)*step;
    if(radius<=0)continue;
    const list=buckets.get(radius)||[];list.push(chunk.line.map(inverse));buckets.set(radius,list);
  }
  const parts:ClipPolygon[]=[];
  for(const [radius,lines] of buckets)
    for(let i=0;i<lines.length;i+=BUFFER_BATCH){
      const batch=turfBuffer({type:'MultiLineString',coordinates:lines.slice(i,i+BUFFER_BATCH)},
        radius,{units:'meters',steps:8});
      if(!batch||batch.type!=='Feature')throw new Error('Network buffer did not produce a polygon.');
      parts.push(...(multi(batch.geometry) as ClipPolygon[]));
    }
  if(!parts.length){
    // Nothing had any budget left to step off a street with. The site itself is what is reached,
    // and the leg it can still walk from its own door is what is drawn.
    const point=turfBuffer({type:'Point',coordinates:fallback.point},Math.max(fallback.radiusM,1),
      {units:'meters',steps:8});
    if(!point||point.type!=='Feature')throw new Error('Network buffer did not produce a polygon.');
    return point.geometry as Boundary;
  }
  let level:ClipMultiPolygon[]=parts.map(p=>[p]);
  while(level.length>1){
    const next:ClipMultiPolygon[]=[];
    for(let i=0;i<level.length;i+=2)
      next.push(i+1<level.length?polygonClipping.union(level[i],level[i+1]):level[i]);
    level=next;
  }
  const polygons=level[0];
  return polygons.length===1
    ?{type:'Polygon',coordinates:polygons[0] as Position[][]}
    :{type:'MultiPolygon',coordinates:polygons as Position[][][]};
}
export function isochrone(input:PointCollection,network:Network,params:WorkflowNode<'isochrone'>['params'],onProgress?:(done:number,total:number)=>void):Polygons{
  if(params.thresholds?.length){validateCatchmentNode({id:'check',type:'isochrone',params,x:0,y:0});const results=params.thresholds.map((minutes,i)=>{onProgress?.(i,params.thresholds!.length);return isochrone(input,network,{...params,minutes,thresholds:undefined},onProgress);});// The omissions come from the LARGEST band, not the first. A site that reaches nothing in one
    // minute but something in fifteen is not a site with no result; it is a site whose smallest
    // band is empty, which is what bands are for. The largest budget is the only one that can say
    // "nothing at all", and because the budget only grows, its list is the intersection of them.
    const widest=results[results.length-1];
    return {...results[0],features:results.flatMap(p=>p.features.map(f=>({...f,id:f.siteId+'-t'+f.minutes}))),method:'Cumulative network isochrones: '+params.thresholds.join(', ')+' minutes; '+params.speedMPerMin+' m/min; '+params.bufferM+' m corridor; '+params.direction,notes:[...widest.notes,'Nested thresholds are cumulative, not disjoint time bands.'],unconnected:widest.unconnected,offNetwork:widest.offNetwork};}
  validateNetwork(network);validateCatchmentNode({id:'check',type:'isochrone',params,x:0,y:0});const fs=sites(input,10),m=metric(params.zone,params.hemisphere),coords=new Map(network.nodes.map(n=>[n.id,m.forward(n.coordinates)]));
  const edges=prepareEdges(network,params.direction,m.forward);
  const adjacency=new Map<string,typeof edges>();for(const e of edges){const list=adjacency.get(e.from)||[];list.push(e);adjacency.set(e.from,list);}
  const snaps:NonNullable<Polygons['snaps']>=[],unconnected:NonNullable<Polygons['unconnected']>=[],offNetwork:NonNullable<Polygons['offNetwork']>=[],notes=['Turf/JSTS corridor buffer in a local azimuthal equidistant projection, 8 quadrant segments. Approximate corridor polygons, not exact travel-time surfaces. Edge time uses supplied length / constant speed. All three segments of the journey are charged: the straight line onto the network (D1), the streets (D2), and the leg off the street at the end (D3), which is the leg the budget still allows up to the stated limit. The region is the whole route buffered, so it narrows to nothing where the time runs out. Both straight legs assume ground that can be crossed, at street speed. Graph extent can truncate reachability. OSM snapshot is not an 1854 street reconstruction.'];
  const features=fs.map((f,index)=>{onProgress?.(index,fs.length);const origin=m.forward(f.geometry!.coordinates),{node:snap,distanceM:snapDistance}=nearestNetworkNode(network.nodes,coords,origin);
    /* ASSUMPTION, DEGRADING: a site further from the network than `maxSnapM` is NOT excluded. The
       crow-flies walk onto the network is charged anyway and the site is recorded in `offNetwork`,
       so a place with no mapped street nearby gets an answer that says what it assumed rather than
       no answer at all. Until 2026-10-14 it threw and ended the run; between then and now it was
       reported and dropped. Both put the places with the sparsest road data -- which OSM
       under-maps in a known direction -- outside the analysis that exists to make them visible.
       The straight line is a LOWER BOUND on that walk, charged at the network speed, so the
       degraded answer is optimistic in a stated direction. `maxSnapM` no longer decides whether
       the site is answered; it decides whether the answer is marked. Experiment 114. */
    const budget=params.minutes*params.speedMPerMin;
    if(snapDistance>=budget){
      /* ASSUMPTION, EXCLUDING: the walk onto the network alone spends the whole budget, so nothing
         is reachable and there is no polygon to draw. Emitting one would mean a `bufferM` disc
         around the JUNCTION -- not where the site is, and not anywhere it can reach -- which is
         what this widget drew before 2026-10-14 whenever `maxSnapM` was set wider than the budget.
         The site is reported instead. "Reaches nothing in five minutes" is the finding. */
      unconnected.push({siteId:String(f.id),name:String(f.properties.name),
        distanceM:Number(snapDistance.toFixed(2)),budgetM:Number(budget.toFixed(2))});
      return null;
    }
    const offNetworkMetres=snapDistance>params.maxSnapM?Number(snapDistance.toFixed(2)):undefined;
    if(offNetworkMetres!==undefined)offNetwork.push({siteId:String(f.id),name:String(f.properties.name),
      distanceM:offNetworkMetres,limitM:params.maxSnapM});
    snaps.push({siteId:f.id,nodeId:snap.id,distanceM:snapDistance});
    // D1 IS CHARGED. The walk from the site onto the network comes out of the budget.
    //
    // A route has three segments -- D1 site to nearest node, D2 network distance, D3 last node to
    // destination. D is DISTANCE, and the framing is the practitioner's, from the Cholera
    // Advanced 1 notebooks that produced the street network this project ships; it is NOT the
    // primitive design audit's D1-D10, which are checks. See docs/glossary.md. `snapDistance` above IS D1, and from 2026-10-14 the snap node starts at that
    // cost rather than at zero, so the stated minutes pay for the walk onto the network.
    //
    // Until then it was measured, published as fw:networkSnaps, and not charged, so every
    // isochrone reached further than its time allowed -- by 10.9 m of a 375 m budget on this
    // example, 2.9%. That figure was never the point. D1 is largest where a home sits back from
    // any mapped road, which is where an access analysis is used to argue for investment, so
    // ignoring it flattered the places worst served.
    //
    // A straight line to the nearest junction is still a LOWER BOUND on that first walk: it
    // assumes you can cross whatever lies between, and where D1 is large the walked path is
    // routinely longer. Charging it makes the isochrone smaller and still optimistic.
    //
    // D3 remains unmodelled; `bufferM` below is a cartographic halo standing in for it.
    // Experiment 114.
    const distances=new Map<string,number>([[snap.id,snapDistance]]),settled=new Set<string>();
    for(;;){let current:string|undefined,best=Infinity;for(const [id,d] of distances)if(!settled.has(id)&&d<best){current=id;best=d;}if(!current||best>budget)break;settled.add(current);for(const e of adjacency.get(current)||[]){const cost=best+e.lengthM;if(cost<(distances.get(e.to)??Infinity))distances.set(e.to,cost);}}
    // The whole route, chunked with the budget left at every point along it: the straight walk
    // onto the network, then every street reached. D3 is then the leg each chunk can still
    // afford. See `taperedCorridor`.
    const chunkM=Math.max(5,params.bufferM/2);
    const chunks:ReachChunk[]=reachChunks([origin,coords.get(snap.id)!],budget,params.bufferM,chunkM);
    for(const e of edges){const d=distances.get(e.from)??Infinity;if(d<budget)chunks.push(...reachChunks(e.line,budget-d,params.bufferM,chunkM));}
    const corridor=taperedCorridor(chunks,params.bufferM,m.inverse,{point:f.geometry!.coordinates,radiusM:params.bufferM});
    // Infill keeps each polygon's outer ring and drops its holes. The union was a spread of every
    // ring into one call, which on a large corridor passes thousands of arguments; a balanced
    // reduction does the same work without that.
    let geometry:Boundary=corridor;
    if(params.fillHoles){
      let level:ClipMultiPolygon[]=(multi(corridor) as ClipPolygon[]).map(p=>[[p[0]]] as unknown as ClipMultiPolygon);
      while(level.length>1){
        const next:ClipMultiPolygon[]=[];
        for(let i=0;i<level.length;i+=2)
          next.push(i+1<level.length?polygonClipping.union(level[i],level[i+1]):level[i]);
        level=next;
      }
      geometry={type:'MultiPolygon',coordinates:level[0] as Position[][][]};
    }
    return {id:f.id,siteId:f.id,minutes:params.minutes,name:`${f.properties.name} - ${params.minutes} min`,geometry,...(offNetworkMetres!==undefined?{offNetworkMetres}:{})};
  }).filter(c=>c!==null);notes.push(params.fillHoles?'Infill enabled: interior holes are filled for illustrative regions; this can include unreachable off-network locations.':'Infill disabled: corridor holes are retained.');  if(offNetwork.length)notes.unshift(
    `${offNetwork.length} of ${fs.length} site${fs.length===1?'':'s'} started further than the ${params.maxSnapM} m snap limit from any street, and ${offNetwork.length===1?'its route was':'their routes were'} charged a straight line to reach one: `
    +offNetwork.map(u=>`${u.name} (${Math.round(u.distanceM)} m off-network)`).join(', ')
    +'. A straight line assumes the ground can be crossed at the declared speed, so those catchments are a lower bound on the journey and reach too far rather than too little.');
  if(unconnected.length)notes.unshift(
    `${unconnected.length} of ${fs.length} site${fs.length===1?'':'s'} ${unconnected.length===1?'has':'have'} no catchment: the leg to the nearest street alone spends the whole ${Math.round(params.minutes*params.speedMPerMin)} m budget. `
    +unconnected.map(u=>`${u.name} (${Math.round(u.distanceM)} m)`).join(', ')
    +'. Any count over these catchments is over the sites that reached something, not over all of them.');
  return {features,sites:structuredClone(fs),crs:m.crs,method:`Dijkstra ${params.direction}; ${params.minutes} min; ${params.speedMPerMin} m/min; partial edges; D1+D2+D3 buffered, final leg up to ${params.bufferM} m`,notes,snaps,unconnected,offNetwork};
}
export function summarizePolygons(input:Polygons,points:PointCollection,params:WorkflowNode<'summarize_points_to_polygon'>['params']):Polygons{
  const features=input.features.map(f=>({...structuredClone(f),count:0,total:0,missingValues:0}));let matched=0,unmatched=0,missingLocation=0,multiple=0;
  for(const p of points.features){if(!p.geometry){missingLocation++;continue;}const hits=features.filter(f=>{const r=pointRelation(p.geometry!.coordinates,f.geometry);return r==='Inside'||params.boundary==='include'&&r==='Boundary';});if(!hits.length){unmatched++;continue;}matched++;if(hits.length>1)multiple++;for(const f of hits){f.count++;if(params.valueField){const value=p.properties[params.valueField];if(typeof value==='number'&&Number.isFinite(value))f.total+=value;else f.missingValues++;}}}
  if(features.some(f=>!Number.isFinite(f.total)))throw new Error('Numeric total overflow; review the input values.');
  // THE VALUE MAP SHADES (2026-11-26, PR 6's review): the total of the field where one is chosen, else the count. Map
  // shades a polygon by `value` alone, so a summary that carried only count and total was drawn one hue per unit, keyed
  // by name, and Show me how's scale was a claim about a figure Map never drew.
  for(const f of features)(f as {value?:number}).value=params.valueField?f.total:f.count;
  return {...structuredClone(input),features,valueName:params.valueField?`Total ${params.valueField}`:'Points inside',observations:structuredClone(points),summary:{records:points.features.length,matched,unmatched,missingLocation,multiple,valueField:params.valueField},notes:[...input.notes,`Boundary: ${params.boundary}. All memberships retained; ${multiple} locations have multiple memberships. Do not add overlapping catchment counts as a unique total.`]};
}
export function catchmentReceipt(node:WorkflowNode,value:Polygons|Network,runId:string,sources:string[]):Receipt{
  // `fw:metricCRS` means a PROJECTED CRS a computation used; clip and summarize project nothing,
  // so claiming it for them would have said they worked in metres when they work in degrees.
  // Both state the CRS they computed in with the OGC identifier instead, and the absence of
  // fw:metricCRS is itself the fact: nothing was projected. Found 2026-10-13 by querying the
  // receipts for the run's projection and getting "OGC:CRS84" back as a metric answer.
  const geographic=node.type==='clip_polygons'||node.type==='summarize_points_to_polygon';
  const operationCRS=geographic?'':'features' in value?value.crs:'';
  const conformsTo=geographic?CRS84_IRI:crsIRIFromName(operationCRS);
  const operationMethod=node.type==='clip_polygons'?'Polygon intersection in CRS84; empty intersections omitted':node.type==='summarize_points_to_polygon'?'Point membership in CRS84 with explicit boundary policy; all memberships retained':'features' in value?value.method:'Validated directed network input; supplied metre lengths';
  const entity=`urn:fieldwork:run:${runId}:output:${node.id}`,activity=`${entity}:activity`,classes:Record<string,string>={voronoi:'VoronoiComputation',isochrone:'NetworkIsochrone',clip_polygons:'PolygonClipping',summarize_points_to_polygon:'PolygonPointSummary',network_input:'NetworkInput'};
  let facts='@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n@prefix geo: <http://www.opengis.net/ont/geosparql#>.\n@prefix dcterms: <http://purl.org/dc/terms/>.\n'+`<${activity}> a prov:Activity, fw:${classes[node.type]}; fw:parameters ${JSON.stringify(JSON.stringify(node.type==='network_input'?{source:(value as Network).source,inputMethod:node.params.inputMethod,marginM:node.params.marginM}:node.params))}.\n<${entity}> a prov:Entity; prov:wasGeneratedBy <${activity}>.\n`;
  for(const source of sources)facts+=`<${activity}> prov:used <urn:fieldwork:run:${runId}:output:${source}>.\n`;
  if('nodes' in value)facts+=`<${entity}> fw:sourceDescription ${JSON.stringify(value.source)}; fw:networkMetadata ${JSON.stringify(JSON.stringify(value.provenance||{}))}; fw:networkNodeCount ${value.nodes.length}; fw:networkEdgeCount ${value.edges.length}.\n`;
  // The mode the graph was FILTERED for, as a term rather than a string inside the metadata blob,
  // because a reader asking "was this a driving network" is asking the receipt a question and
  // should not have to parse JSON to answer it. `fw:travelMode` is the term reachability already
  // asserts for the mode it was told to assume; this is the mode the graph can actually carry.
  if('nodes' in value&&typeof (value.provenance as Record<string,unknown>|undefined)?.travelMode==='string')
    facts+=`<${entity}> fw:travelMode ${JSON.stringify(String((value.provenance as Record<string,unknown>).travelMode))}.\n`;
  if('features' in value){facts+=`<${activity}> ${operationCRS?`fw:metricCRS ${JSON.stringify(operationCRS)}; `:''}${conformsTo?`dcterms:conformsTo <${conformsTo}>; `:''}fw:method ${JSON.stringify(operationMethod)}; fw:caveats ${JSON.stringify(value.notes.join(' '))}.\n`;for(const f of value.features){const id=`${entity}:cell:${encodeURIComponent(f.id)}`,wkt='MULTIPOLYGON ('+multi(f.geometry).map(p=>'('+p.map(r=>'('+r.map(c=>c.join(' ')).join(', ')+')').join(', ')+')').join(', ')+')';facts+=`<${entity}> fw:member <${id}>.\n<${id}> a geo:Feature; fw:siteId ${JSON.stringify(f.siteId)}; geo:hasGeometry [ a geo:Geometry; geo:asWKT ${JSON.stringify('<http://www.opengis.net/def/crs/OGC/1.3/CRS84> '+wkt)}^^geo:wktLiteral ].\n`;if(f.minutes!==undefined)facts+=`<${id}> fw:travelTimeMinutes ${f.minutes}.\n`;if(f.count!==undefined)facts+=`<${id}> fw:recordCount ${f.count}; fw:missingValueCount ${f.missingValues}.\n`;}if(value.summary?.valueField)for(const f of value.features)facts+=`<${entity}:cell:${encodeURIComponent(f.id)}> fw:numericTotal ${f.total}.\n`;if(value.summary)facts+=`<${entity}> fw:summary ${JSON.stringify(JSON.stringify(value.summary))}.\n`;if(value.snaps)facts+=`<${activity}> fw:networkSnaps ${JSON.stringify(JSON.stringify(value.snaps))}.\n`;if(value.unconnected?.length)facts+=`<${activity}> fw:unconnectedSiteCount ${value.unconnected.length}; fw:unconnectedSites ${JSON.stringify(JSON.stringify(value.unconnected))}.\n`;if(value.offNetwork?.length)facts+=`<${activity}> fw:offNetworkSiteCount ${value.offNetwork.length}; fw:offNetworkSites ${JSON.stringify(JSON.stringify(value.offNetwork))}.\n`;for(const f of value.features)if(f.offNetworkMetres!==undefined)facts+=`<${entity}:cell:${encodeURIComponent(f.id)}> fw:offNetworkMetres ${f.offNetworkMetres}.\n`;}
  // WHICH CAPS BOUND THIS RUN, and at what value. A knob's declared number is its default, and
  // the run was governed by whatever it was set to.
  if('nodes' in value)
    facts+=capFacts(activity,networkCaps({maxNodes:(node.params as {maxNodes?:number}).maxNodes}));
  facts+=catchmentSemantics(node,value,entity,activity,runId);
  return {nodeId:node.id,kind:'computation',facts,input:facts,rules:'',conclusions:[],method:operationMethod};
}
