/** WHAT EACH STEP COMPUTES: the spatial steps: centres, geomasks, buffers, clips, distances, areas, grids, networks
 *  and catchments. Moved out of `executeWorkflow` on 2026-11-25 (code review), one function per step type, each given
 *  the run's context rather than reaching into the executor. The text of each step is as it stood in the switch; a
 *  step that ended there now returns its value. */
import facilityRegisters from '../widgets/facility-registers.json' with {type:'json'};
import {areaJoinReceipt,joinedPolygons,joinTableToAreas,keyColumnForRun} from './area-join.js';
import {measureArea} from './area-measurement.js';
import {bufferFeatures} from './buffer-point.js';
import {computeIsochrone} from './catchment-executor.js';
import {catchmentReceipt,clipPolygons,type Network,type Polygons,summarizePolygons,validateNetwork,voronoi} from './catchments.js';
import {clipPointsReceipt,clipPointsToArea,clipPointsToPolygons} from './clip-points.js';
import {combineAreas,combinedArea} from './combined-area.js';
import {convexHull} from './convex-hull.js';
import {listFacilitiesValue,type RegisterEntry} from './facility-matching.js';
import {fillInteriorGaps} from './fill-interior-gaps.js';
import {aggregateHex,moveDonut,privacyReceipt} from './geoprivacy.js';
import {facilitiesValue} from './health-facilities.js';
import {computeMeanCenter,type MeanCenter,meanCenterReceipt} from './mean-center.js';
import {snapToNetwork} from './network-snap.js';
import {comparePointSets,comparisonReceipt,comparisonTable} from './point-comparison.js';
import {GRID_METHOD,gridPoints} from './point-grid.js';
import {reachableCorridor} from './reachable-corridor.js';
import {reachableNodes} from './reachable-nodes.js';
import type {DisplayValue,Receipt} from './results.js';
import {travelTimeBand} from './travel-time-band.js';
import type {PointCollection,PointFeature,Scalar} from './types.js';
import type {StepContext} from './core.js';
import {TYPES,nearestPlaces} from './core.js';

export async function runMeanCenter(ctx:StepContext<'mean_center'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  value=computeMeanCenter(inputs.points,node.params);receipts.push(meanCenterReceipt(node,value as MeanCenter,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='points')!.from));return value;
}

export async function runComparePointSets(ctx:StepContext<'compare_point_sets'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const compared=comparePointSets(inputs.original,inputs.moved,inputs.pumps,node.params,node.params.centers?inputs.originalCenter:undefined,node.params.centers?inputs.movedCenter:undefined);const sources=Object.fromEntries(workflow.edges.filter(e=>e.to===node.id).map(e=>[e.port,e.from])) as {original:string;moved:string;pumps:string;originalCenter?:string;movedCenter?:string};value=comparisonTable(compared);receipts.push(comparisonReceipt(node,compared,runId,sources));return value;
}

export async function runGeomask(ctx:StepContext<'donut_geomask'|'aggregate_points_to_h3_cell'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  value=node.type==='donut_geomask'?moveDonut(inputs.points,node.params):aggregateHex(inputs.points,node.params);
  receipts.push(privacyReceipt(node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='points')!.from,inputs.points.features.length,value as PointCollection|Polygons));return value;
}

export async function runFillInteriorGaps(ctx:StepContext<'fill_interior_gaps'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const made=fillInteriorGaps(inputs.polygons,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='polygons')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runTravelTimeBand(ctx:StepContext<'travel_time_band'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const made=travelTimeBand(inputs.reached,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='reached')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runReachableCorridor(ctx:StepContext<'reachable_corridor'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const made=reachableCorridor(inputs.reached,inputs.network,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='reached')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runReachableNodes(ctx:StepContext<'reachable_nodes'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const made=reachableNodes(inputs.sites,inputs.network,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='sites')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runSnapToNetwork(ctx:StepContext<'snap_to_network'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const made=snapToNetwork(inputs.sites,inputs.network,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='sites')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runTravelOverGround(ctx:StepContext<'travel_over_ground'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  // THE PLACES ARE THE SOURCE the receipt cites: the answer is written onto them, and the friction surface and
  // the origins are named in the facts rather than claimed as what this layer derives from.
  const {travelValue}=await import('./friction-travel.js');
  const edge=workflow.edges.find(e=>e.to===node.id&&e.port==='places');
  if(!edge)throw new Error('Connect the places to answer for to this step’s Places port.');
  const made=travelValue(inputs.friction as never,inputs.origins as never,inputs.places as never,node,runId,edge.from);
  value=made.value as unknown as DisplayValue;receipts.push(made.receipt);return value;
}

export async function runSummarizeCombinedArea(ctx:StepContext<'summarize_combined_area'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  // Given areas it combines areas; given polygons it combines polygons. Same widget, same
  // sentence -- "overlapping and touching areas become one" -- and the output is whatever
  // kind went in, so a merged study area can be given to everything a study area feeds.
  if(node.params.yields==='area'){
    const merged=combineAreas(node,[inputs.area,inputs.area2],runId);
    value=merged.value;receipts.push(merged.receipt);return value;
  }
  const made=combinedArea(inputs.polygons,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='polygons')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runSummarizeHull(ctx:StepContext<'summarize_hull'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  const made=convexHull(inputs.points,node,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='points')!.from);
  value=made.value;receipts.push(made.receipt);return value;
}

export async function runFindHealthFacilities(ctx:StepContext<'find_health_facilities'>):Promise<unknown>{
  const {inputs,node,receipts,runId}=ctx;
  let value:unknown;
  // FROM A LIST (experiment 190): the table's names matched to registers; otherwise the facilities inside the area.
  if(node.params.mode==='list'){const got=listFacilitiesValue(node,inputs.list,
    facilityRegisters.registers as RegisterEntry[],runId);value=got.value as unknown as DisplayValue;receipts.push(got.receipt as unknown as Receipt);return value;}
  const got=facilitiesValue(node,runId);value=got.value;receipts.push(got.receipt);return value;
}

export async function runBufferPoint(ctx:StepContext<'buffer_point'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  // WHICH STEPS WOULD WINDOW A GRID THROUGH THIS SCOPE. The one-degree limit exists for them and for nothing
  // else, so a workflow with no raster in it is not held to it.
  const rasterSteps=workflow.nodes.filter(n=>n.type==='raster_input'||n.type==='clip_raster'||n.type==='sample_raster')
    .map(n=>n.params.label||TYPES[n.type].title);
  const made=bufferFeatures(
  {points:inputs.points,lines:(inputs as unknown as {lines?:import('./types.js').LineLayer}).lines,
    polygons:inputs.polygons},node,runId,{rasterSteps});
  value=made.value as unknown as DisplayValue;receipts.push(made.receipt);return value;
}

export async function runCatchmentSteps(ctx:StepContext<'network_input'|'voronoi'|'isochrone'|'clip_polygons'|'summarize_points_to_polygon'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  if(node.type==='network_input'){
    // An EMPTY network is almost always one that has not been downloaded, and acquiring it
    // is a separate, explicit action -- a button in the Inspector, not part of Run. Saying
    // only what the value lacks sent the practitioner round three times on 2026-10-19,
    // redownloading an area the span cap had refused and reading "needs at least one
    // junction" each time. The refusal now names the action.
    const network=node.params.data;
    if(!network?.nodes?.length&&!network?.edges?.length)
      throw new Error(node.params.inputMethod==='file'
        ?`"${node.params.label}" has no street network yet. Select it and upload a GraphML or JSON file; running does not import one.`
        :node.params.inputMethod==='extract'
        ?`"${node.params.label}" has no street network yet. Select it and choose a published .osm.pbf extract; running the workflow does not read one.`
        :`"${node.params.label}" has no street network yet. Select it and press "Download and save OSM network" \u2014 running the workflow does not start the download.`);
    validateNetwork(network);
  }
  value=node.type==='network_input'?structuredClone(node.params.data):node.type==='voronoi'?voronoi(inputs.sites,inputs.area.boundary,node.params.zone,node.params.hemisphere):node.type==='isochrone'?await computeIsochrone(inputs.sites,inputs.network,node.params):node.type==='clip_polygons'?clipPolygons(inputs.polygons,inputs.area.boundary):summarizePolygons(inputs.polygons,inputs.points,node.params);
  if(node.type==='voronoi'||node.type==='isochrone')(value as Polygons).siteSourceNodeId=workflow.edges.find(e=>e.to===node.id&&e.port==='sites')!.from;
  // THE POINTS SUMMARIZED, NAMED BY THEIR LAYER (2026-11-27), so a Map draws them as that layer: its size, colour and
  // shape as set in Map's Configure…, the same in the preview and the result.
  if(node.type==='summarize_points_to_polygon'){const from=workflow.edges.find(e=>e.to===node.id&&e.port==='points')?.from,source=workflow.nodes.find(n=>n.id===from);
    if(from)(value as Polygons).observationsFrom={id:from,label:(source?.params as {label?:string}|undefined)?.label||from};}
  receipts.push(catchmentReceipt(node,value as Polygons|Network,runId,workflow.edges.filter(e=>e.to===node.id).map(e=>e.from)));return value;
}

export async function runJoinTableToArea(ctx:StepContext<'join_table_to_area'>):Promise<unknown>{
  const {inputs,joins,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  // THE NAMES HAVE TO BE THERE. An area drawn by hand has no named parts, so there is
  // nothing to key on and saying so is better than matching nothing and drawing an empty
  // choropleth that looks like a finding.
  const layer=inputs.polygons as unknown as import('./catchments.js').Polygons|undefined;
  if(layer&&inputs.area)throw new Error('Connect a study area or a polygon layer to join to, not both.');
  if(!layer&&!inputs.area)throw new Error('Connect a study area or a polygon layer to join to.');
  const units=layer?layer.features.map(f=>({id:String(f.id),name:String(f.name)}))
    :(inputs.area as {units?:{id:string;name:string}[]}).units;
  if(!units?.length)throw new Error('This study area has no named parts to join to. Acquire a boundary whose features carry names, or import one from a file and choose the name column.');
  // `records`, not `table`: `inputs` is keyed by PORT name, and the port is called records
  // to match every other widget that takes rows. Reading `inputs.table` here cost a run
  // that failed with "Cannot read properties of undefined" and named neither port.
  const table=inputs.records as unknown as import('./data-table.js').DataTable;
  const keyField=node.params.keyField||keyColumnForRun(table,units,node.params.normalisation??'fuzzy');
  const joined=joinTableToAreas(units,table,
    {keyField,normalisation:node.params.normalisation,
      categoryField:node.params.categoryField,frameField:node.params.frameField});
  joins[node.id]=joined;
  value=layer?joinedPolygons(undefined,joined,node.params.label,
    layer.features.map(f=>f.geometry as import('./types.js').Boundary),
    layer.features.map(f=>(f as unknown as {properties?:Record<string,Scalar>}).properties??{}))
    :joinedPolygons(inputs.area.boundary,joined,node.params.label);
  receipts.push(areaJoinReceipt(node,joined,runId,
    workflow.edges.find(e=>e.to===node.id&&e.port==='records')!.from,
    workflow.edges.find(e=>e.to===node.id&&(e.port==='area'||e.port==='polygons'))!.from));
  return value;
}

export async function runClipPointsToArea(ctx:StepContext<'clip_points_to_area'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  // ONE MASK, NOT TWO. Both connected is ambiguous -- a point inside the area and outside every polygon has
  // two answers -- so it is refused rather than resolved by a rule nobody chose.
  const layer=(inputs as unknown as {polygons?:{features?:{id?:unknown;name?:unknown;geometry:never}[]}}).polygons;
  if(layer&&inputs.area)throw new Error('Connect a study area or a polygon layer to keep points inside, not both: '
    +'with two masks a point inside one and outside the other has no single answer. Disconnect one of them.');
  if(!layer&&!inputs.area)throw new Error('Connect the study area, or the polygon layer, the points are kept inside.');
  const clipped=layer
    ?clipPointsToPolygons(inputs.points,layer as never,node.params.keepBoundary!==false,
      node.params.insideAttribute?.trim()||'inside_polygon')
    :clipPointsToArea(inputs.points,inputs.area.boundary,node.params.keepBoundary!==false);
  if(!clipped.collection.features.length)throw new Error(
    `No points fall inside "${inputs.area.label||'the study area'}". `
    +`${clipped.outside} of ${clipped.inside+clipped.boundary+clipped.outside+clipped.missing} are outside it`
    +(clipped.missing?` and ${clipped.missing} carry no usable location`:'')+`. `
    +`Check that the area is the one you meant.`);
  const areaEdge=workflow.edges.find(e=>e.to===node.id&&e.port==='area');
  const pointsEdge=workflow.edges.find(e=>e.to===node.id&&e.port==='points');
  receipts.push(clipPointsReceipt(node,clipped,runId,areaEdge?.from??node.id,pointsEdge?.from??node.id,inputs.area.areaFacts));
  const from=inputs.points as unknown as {sourceNodeId?:string;sourceKind?:string};
  value={...clipped.collection,sourceNodeId:from.sourceNodeId??node.id,
    sourceKind:from.sourceKind??'input-points',
    // SHOWN, NOT PASSED ON. The excluded points ride on the value so a map can draw them in
    // the Outside colour it already has, while every widget downstream receives only the
    // features that are in the area. A count says how many were lost; the points say
    // whether losing them was right, and a cluster over one border reads differently from
    // a scatter in all directions.
    ...(node.params.showExcluded!==false&&clipped.excluded.length?{excludedPoints:clipped.excluded}:{}),
  } as unknown as DisplayValue;
  return value;
}

export async function runMeasureDistance(ctx:StepContext<'measure_distance'>):Promise<unknown>{
  const {inputs,node}=ctx;
  let value:unknown;
  const searched=nearestPlaces(inputs.points,inputs.candidates,node.params.unit,node.params.candidateFilter);
  const narrowed=node.params.candidateFilter?.length
    ? ` Candidates narrowed by ${node.params.candidateFilter.map(c=>`${c.field} ${c.comparator==='in'?'in':'not in'} {${c.values.join(', ')}}`).join('; ')}: ${searched.eligibleCount} of ${searched.candidateCount} eligible.`
    : '';
  // `locationSource` says where the subjects came from, which `access` carried and a general
  // search should too: a reader of a distance wants to know what was measured, not only from
  // what. Carried here so the value stays thin -- it is the points input's own provenance.
  const from=inputs.points as unknown as {sourceNodeId?:string; sourceKind?:string};
  value={rows:searched.rows,centers:inputs.candidates.features,
    method:`Haversine; sphere radius 6371.0088 km; CRS84 longitude/latitude; distances in ${node.params.unit}.${narrowed}`,
    candidateCount:searched.candidateCount,eligibleCount:searched.eligibleCount,
    locationSource:{nodeId:from.sourceNodeId,kind:from.sourceKind==='generated-grid'?'generated-grid':'input-points'}} as unknown as DisplayValue;
  return value;
}

export async function runMeasureArea(ctx:StepContext<'measure_area'>):Promise<unknown>{
  const {inputs,node,receipts,runId}=ctx;
  let value:unknown;
  const computed=measureArea(node,inputs.area,runId);value=computed.value;receipts.push(computed.receipt);return value;
}

export async function runPointGrid(ctx:StepContext<'point_grid'>):Promise<unknown>{
  const {inputs,node,receipts,runId}=ctx;
  let value:unknown;
  const rows=gridPoints(inputs.area.boundary,node.params.spacingM);
  const features:PointFeature[]=rows.map(p=>({type:'Feature',id:p.id,properties:{name:p.name,samplingBasis:'regular-grid'},geometry:{type:'Point',coordinates:[...p.coordinates]}}));
  const step='<urn:fieldwork:run:'+runId+':grid:'+node.id+'>',dataset='<urn:fieldwork:run:'+runId+':output:'+node.id+'>';
  let facts='@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n@prefix geo: <http://www.opengis.net/ont/geosparql#>.\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n'+step+' a fw:GridSampleGeneration; prov:used <'+inputs.area.areaId+'>; fw:spacingMetres '+node.params.spacingM+'; fw:generatedRecordCount '+rows.length+'.\n'+dataset+' a geo:FeatureCollection, prov:Entity; prov:wasGeneratedBy '+step+'.\n';
  for(const point of rows){const feature='<urn:fieldwork:run:'+runId+':grid:'+node.id+':'+point.id+'>';facts+=dataset+' rdfs:member '+feature+'.\n'+feature+' a geo:Feature; geo:hasGeometry [ a geo:Geometry; geo:asWKT '+JSON.stringify('<http://www.opengis.net/def/crs/OGC/1.3/CRS84> POINT ('+point.coordinates.join(' ')+')')+'^^geo:wktLiteral ].\n';}
  receipts.push({nodeId:node.id,kind:'computation',facts,rules:'',input:facts,conclusions:[],method:GRID_METHOD});
  value={...inputs.area,type:'FeatureCollection' as const,features,rows,sourceNodeId:node.id,sourceKind:'generated-grid',spacingM:node.params.spacingM} as unknown as DisplayValue;
  return value;
}
