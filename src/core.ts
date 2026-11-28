import {validatePresentation} from './table-presentation.js';
import {readPinPhotos} from './pin-photos.js';
import {staticMapFrame} from './static-map.js';
import {lineLayersOf} from './map-lines.js';
import {setFigureWords,figureWordsOf} from './figure-words.js';
﻿import {validateSampleNode} from './sample-raster.js';
import {validateScanParams} from './space-time-scan.js';
import {validateBufferPointNode} from './buffer-point.js';
import {migrateHealthsitesNodes,validateFindHealthFacilitiesNode} from './health-facilities.js';
import {validateHullNode} from './convex-hull.js';
import {validateCombinedAreaNode} from './combined-area.js';
import {validateSnapNode} from './network-snap.js';
import {validateReachNode} from './reachable-nodes.js';
import {validateCorridorNode} from './reachable-corridor.js';
import {validateBandNode} from './travel-time-band.js';
import {collectPolygonLayers,isPolygonPort,polygonPort,MAX_POLYGON_LAYERS} from './polygon-layers.js';
import {lengthKm as lineLengthKm} from './line-layer.js';
import {validEdits} from './cell-edits.js';
import {isRasterPort,rasterPort,validRasterShading,MAX_RASTER_LAYERS} from './raster-panels.js';
import {validateFillNode} from './fill-interior-gaps.js';
import {validatePrivacyNode} from './geoprivacy.js';
import {validatePointComparisonNode} from './point-comparison.js';
import type {PointComparison} from './point-comparison.js';
import {validateMeanCenterNode} from './mean-center.js';
import type {MeanCenter} from './mean-center.js';
import {detectSettings} from './aberration.js';
/** Study areas a Polygon layer of their parts takes: the cap Map keeps on polygon layers. */
export const MAX_AREA_INPUTS=6;
import {CATCHMENT_TYPES,validateCatchmentNode,unconnectedSites,offNetworkSites} from './catchments.js';
import type {Polygons,Network} from './catchments.js';
import {polygonFrame} from './catchment-output.js';
import {validateRasterAsset} from './raster-workflow.js';
import {validateClipOptions} from './raster.js';
import {projectFiles} from './project-files.js';
import type {RasterGrid} from './raster.js';
import type {ChartSummary} from './results.js';
import {chartRenderer} from './chart-vega.js';
import {mapSpecificationFacts} from './map-communication.js';
import {assertProjectManifest,syncProjectManifest} from './project-manifest.js';
import {migrateOutputNodes} from './output-contract.js';
import {referencedPDFs,evidenceProvenance} from './evidence.js';
import type {Exclusion,Workflow,WorkflowNode,NodeDefinition,NodeType,PortType,PointFeature,PointCollection,Position,ParamsByType,PointInput,Scalar,DistanceUnit,RetiredNodeType,RenamedNodeType,CandidateCondition} from './types.js';
import {RENAMED_NODE_TYPES,isProjectedReference,BASEMAP_CHOICES} from './types.js';
import type {DeduplicateResult} from './deduplicate-points.js';
import {workflowMetricCRS} from './metric-crs.js';
// Re-exported so the registry validator can cross-check a declared rename against the one the
// application actually performs, from the same bundle it already reads TYPES out of.
export {RENAMED_NODE_TYPES};
import type {Reasoner} from './worker-types.js';
import type {AreaValue,CoverageValue,DisplayValue,WorkflowRun,Output,Receipt,NearestRow,StepSummary} from './results.js';
import {declarationGaps,dataIssuesOf} from './results.js';
import {isRecord,required} from './guards.js';
export interface ExecutionInputs {samples:PointCollection&{sourceNodeId?:string;sourceKind?:string};area:import('./results.js').AreaValue;area2:AreaValue;polygons:Polygons;subjects:PointCollection;network:Network;sites:PointCollection;reached:PointCollection;points:PointCollection&{spatialReference?:import('./types.js').AnySpatialReference};original:PointCollection;moved:PointCollection;pumps:PointCollection;originalCenter:MeanCenter;movedCenter:MeanCenter;comparison:PointComparison;raster:RasterGrid;friction:RasterGrid;origins:PointCollection;places:PointCollection;table:import('./data-table.js').DataTable;projections:import('./sea-level.js').ProjectionTable;series:import('./case-series.js').SeriesTable;records:PointCollection;cases:import('./data-table.js').DataTable;related:import('./data-table.js').DataTable;list:import('./data-table.js').DataTable;rates:import('./data-table.js').DataTable&{rate?:import('./rate.js').RateResult};assignments:import('./sea-level.js').AssignmentTable;coverage?:CoverageValue;candidates:PointCollection;distances:{rows:NearestRow[];centers:PointFeature[];method:string};alert:ParamsByType['alert'];decisions:DisplayValue;design:import('./study-design.js').DeclaredDesign}
/** WHAT A STEP IS GIVEN TO RUN (code review, 2026-11-25): its node, the values on its inputs, and the run's shared
 *  records. Each step type's function in a run-*.ts module takes this rather than closing over the executor, so what a
 *  step can reach is written down. `markDrawn` tells the executor a step has just let the page draw. */
export interface StepContext<T extends NodeType=NodeType>{
  node:WorkflowNode<T>; inputs:ExecutionInputs; workflow:Workflow; runId:string; receipts:Receipt[]; reasoner:Reasoner;
  values:Map<string,unknown>; machined:Record<string,MachinedNote[]>;
  withNote:(into:Receipt[],run:string,nodeId:string,notes:MachinedNote[])=>void;
  pointInputs:()=>{layers:import('./types.js').PointLayer[]};
  joins:Record<string,import('./area-join.js').AreaJoinResult>; relateShifts:Record<string,ShiftColumn[]>;
  relations:Record<string,RelateOutcome>; linkages:Record<string,DeduplicateResult>;
  markDrawn:()=>void;
}
export type StepRunner<T extends NodeType=NodeType>=(ctx:StepContext<T>)=>Promise<unknown>;
import classification from '../widgets/classification.json' with {type:'json'};
import {resolveRuleset,RETIRED_RULESETS,WRITTEN_IN_WORKFLOW} from './rulesets.js';
import {appendPort,appendTableCount} from './append-rows.js';
import {runDetail} from './run-progress.js';
import {metadataFindings} from './column-metadata.js';
import widgetRegistry from '../widgets/registry.json';
import {type RelateOutcome,type ShiftColumn} from './relate-table.js';
import {figureSection,figureSectionDeclared,inWriteUp} from './notes.js';
import {machinedNoteFacts}
  from './equations.js';
// WHAT AN ARTIFACT DECLARES ABOUT ITSELF. A table, a map and a chart are what a Results
// section is mostly made of, and until now not one of them put a word into the write-up. NOT a
// caption: that is the author's, and 141 records why.
import {tableDescriptionNote,mapDescriptionNote,chartDescriptionNote,publishedArtifactFacts,
  type PublishedArtifact} from './artifact-notes.js';
import {derivedNotes} from './notes-derived.js';
import type {MachinedNote} from './notes.js';
import {STEP_RUNNERS} from './step-runners.js';
import {migrateGroupTableNulls} from './group-table.js';
import {basemapLimitation,DEFAULT_BASEMAP} from './basemaps.js';
import {migrateSurveillanceDesign} from './study-design.js';
import {pinnedRuleset} from './rule-application.js';
import {geometryBounds,validateDrawnGeometry,validateAreaParams} from './study-area.js';
import {validateAreaUnit} from './area-measurement.js';
import {MAX_POINT_LAYERS,MAX_POINT_RECORDS,pointPort,isPointPort,layerOrigins} from './point-layers.js';
import {validateAttributeSchema} from './attribute-schema.js';
import {defaultSpatialReference,validateSpatialReference} from './spatial-reference.js';
import {utmDefinition,projectFromCRS84} from './reproject.js';
import {findingsSummary,MAX_TABLE_ROWS} from './data-table.js';
import type {DataTable} from './data-table.js';
import {validateRateNode} from './rate.js';
import {validateCaseSeriesNode} from './case-series.js';
import {validateSeaLevelNode} from './sea-level.js';
import {distanceKm,nearestOf,satisfies} from './nearest-neighbour.js';
export const NS = 'urn:fieldwork:';
/** A MAP'S GROUND PORTS: `ground`, then `ground_2` to `ground_4`, as its raster ports are numbered. */
export const MAX_GROUND_LAYERS=4;
export const groundPort=(index:number)=>index===0?'ground':`ground_${index+1}`;
export const isGroundPort=(port:string)=>port==='ground'||/^ground_[2-4]$/.test(port);
export const TYPES:Record<NodeType,NodeDefinition> = {
  mean_center:{title:'Mean center',group:'Spatial operations',icon:'⊙',color:'teal',description:'Compute the center of point locations in a metric CRS, optionally weighted by a record attribute',inputs:[['points','points']],output:'mean-center'},
  compare_point_sets:{title:'Compare point sets',group:'Spatial operations',icon:'⊕',color:'teal',description:'Compare two mean centers and locate them against reference pumps, as a table of distances',inputs:[['original','points'],['moved','points'],['pumps','points']],output:'table'},
  // RETIRED 2026-11-20 into Map, which takes the original and moved points, their mean centres and the pumps as point
  // layers, and a Table output of Compare point sets' distances (docs/audits/comparison-map-retired.md). Kept so a saved
  // workflow naming it is migrated.
  comparison_map:{title:'Comparison map',group:'Outputs',icon:'◈',color:'green',description:'Retired — connect the points to a Map, and Compare point sets to a Table',inputs:[['comparison','point-comparison']],output:null},
  donut_geomask:{title:'Move points in a donut',group:'Spatial operations',icon:'◎',color:'teal',description:'Shift points within a configured distance band; educational preview, not a privacy guarantee',inputs:[['points','points']],output:'points'},
  aggregate_points_to_h3_cell:{title:'Aggregate points to H3 cells',group:'Spatial operations',icon:'⬡',color:'teal',description:'Count points in hexagonal cells and omit sparse cells. Hexbinning, onto the fixed H3 index',inputs:[['points','points']],output:'polygons'},
  // RETIRED 2026-11-06 (0.37.0); its code removed 2026-11-21 (0.158.0). Kept so a saved workflow holding one is refused by name.
  buffer_area:{title:'Buffer study area',group:'Spatial operations',icon:'◎',color:'teal',description:'Expand an acquisition boundary without changing the reporting area',inputs:[['area','area']],output:'area'},
  ...CATCHMENT_TYPES,
  map_image_input:{title:'Georeferenced map image',group:'Sources',icon:'\u25a6',color:'blue',
    description:'A scanned or published map, drawn under the workflow as ground; context, not data',
    inputs:[],output:'ground'},
  table_input:{title:'Tabular data',group:'Sources',icon:'▤',color:'blue',description:'Import a long-format table keyed by declared columns; no geometry',inputs:[],output:'table'},
  join_table_to_area:{title:'Join a table to the study area',group:'Summaries',icon:'⋈',color:'teal',
    description:'Put a value from each row onto the part of the boundary it names',
    inputs:[['records','table'],['area','area'],['polygons','polygons']],output:'polygons'},
  // RETIRED 2026-11-05 into the Two-by-two's rate layout, which reads the table a Rate step read. Kept so a workflow
  // naming it can say what it was. Experiment 161, step 6.
  rate_ratio:{title:'Rate ratio with an interval',group:'Epidemiology',icon:'⚖',color:'teal',
    description:'Retired — use Two-by-two table, reading events and units at risk',
    inputs:[['rates','table'],['design','design']],output:'table'},
  // RETIRED 2026-11-08 into Apply ruleset, whose rules compute a value for every record (experiment 188). Kept so a
  // saved workflow naming it is migrated, and says so.
  // RETIRED 2026-11-11 into Sample a raster, whose other source is satellite files (experiment 205). Kept so a saved
  // workflow naming it is migrated, and says so.
  sample_satellite_files_at_points:{title:'Sample satellite files at points or over areas',group:'Spatial operations',icon:'◴',color:'teal',
    description:'Retired — use Sample a raster at points or over areas, reading satellite files',
    inputs:[['points','points'],['areas','polygons'],['area','area'],['files','satellite-files']],output:'table'},
  derive_value:{title:'Derive a value',group:'Summaries',icon:'∓',color:'teal',
    description:'Retired — use Apply ruleset, with a value computed for every record',
    inputs:[['records','table']],output:'table'},
  // Experiment 167. `design` is optional, as on the two-by-two; a declared case-control design allows odds ratios only.
  regression:{title:'Regression',group:'Epidemiology',icon:'∿',color:'teal',
    description:'Logistic or Poisson regression of an outcome on an exposure, adjusted for other columns, from a table',
    inputs:[['records','table'],['design','design']],output:'table'},
  append_rows:{title:'Append rows',group:'Summaries',icon:'⊕',color:'teal',
    description:'Stack the rows of a second table under the first, lining columns up by name',
    inputs:[['records','table'],['records_2','table']],output:'table'},
  select_rows:{title:'Select rows by value',group:'Summaries',icon:'⊂',color:'teal',
    description:'Keep only the rows whose key column holds one of the values you name, in that order',
    inputs:[['records','table']],output:'table'},
  // The area port is OPTIONAL and scopes acquisition: connected, it supplies the bounding box
  // and the country an extract is read for, which is what `network_input` already does with
  // the same port. Absent, the widget still reads a file, which is why `required` stays empty
  // in the contract and this stays an input-stage widget.
  line_input:{title:'Line layer',group:'Sources',icon:'〰',color:'blue',description:'Read routes, tracks or roads from a GPX, KML or GeoJSON file, or take the border two study areas share',inputs:[['area','area'],['area_2','area']],output:'lines'},
  polygon_input:{title:'Polygon layer',group:'Sources',icon:'⬟',color:'blue',description:'Read a polygon layer from a GeoJSON file as published, or from a published OSM extract within the study area',inputs:[['area','area']],output:'polygons'},
  relate_table:{title:'Relate a column from another table',group:'Summaries',icon:'⋈',color:'teal',
    description:'Bring a category from a second table onto these rows, matched on a column both carry',
    inputs:[['records','table'],['related','table']],output:'table'},
  space_time_scan:{title:'Space-time scan',group:'Epidemiology',icon:'◎',color:'amber',
    description:'Look for places where cases came closer together in time than the rest of the line list would lead one to expect',
    inputs:[['points','points']],output:'polygons'},
  // EACH CASE ITS CHAIN (experiment 216), handed on as columns, so a curve, a map or a table can use it.
  transmission_chains:{title:'Transmission chains',group:'Summaries',icon:'⤳',color:'teal',
    description:'Follow each case’s recorded source back to the case its chain starts with: each row gains its chain, generation, offspring and chain size',
    inputs:[['records','table']],output:'table'},
  group_table:{title:'Total within groups',group:'Summaries',icon:'Σ',color:'teal',
    description:'Add up the values of the rows that agree on the key columns you keep',
    inputs:[['records','table']],output:'table'},
  // A DECLARATION THAT OPENS A WORKFLOW, as `study_area` does for WHERE. It consumes nothing:
  // a design is something a practitioner knows about their study, not something derived from
  // data, and giving it an input would invite the inference this refuses. Experiment 154.
  // WHICH SATELLITES AND PRODUCTS MEASURE A VARIABLE, adapted from JLT's EO Satellite Guide. Takes nothing and fetches
  // nothing: it chooses where data will come from. Experiment 179.
  find_satellite_products:{title:'Find satellite products',group:'Sources',icon:'◎',color:'blue',
    description:'Choose the satellite product that measures a variable, seeing what it measures, its licence and whether it needs sign-in',
    inputs:[],output:'satellite-product'},
  // WHERE THE FILES ARE, for the chosen product over the study area and dates, adapted from JLT's STAC Browser. Reads
  // catalog records only. Experiment 179.
  search_satellite_catalog:{title:'Search a satellite catalog',group:'Sources',icon:'⌕',color:'blue',
    description:'Find the files of the chosen satellite product over an area and dates, each with its licence, sign-in and attribution',
    inputs:[['product','satellite-product'],['area','area']],output:'satellite-files'},
  // THE VALUE AT EACH POINT, PER OVERPASS, from the files a search found: read by range in a worker, with the quality
  // rule and the kind of gap where there is no usable value. Experiment 179.
  study_design:{title:'Study design',group:'Epidemiology',icon:'◇',color:'teal',
    description:'Declare the study design and its period, so the computations downstream are the ones the design can estimate',
    inputs:[],output:'design'},
  two_by_two:{title:'Two-by-two table',group:'Epidemiology',icon:'⊞',color:'teal',
    description:'Risk in each group, the risk ratio, the odds ratio and the risk difference, each naming its method',
    // `design` IS OPTIONAL AND THE OPTIONALITY IS THE POINT. A two-by-two with no declared design
    // computes exactly as it did before -- 147's doubt, that a practitioner may not know which
    // design they have and an application demanding the answer before computing anything would be
    // worse than one that stays quiet. Connected, it is what step 3 will gate on; today it makes
    // the result SAY which design and which unit of analysis, which is what the study-design audit
    // predicted a declaration would buy. Experiment 154.
    inputs:[['records','table'],['design','design']],output:'table'},
  rate:{title:'Rate with a denominator',group:'Epidemiology',icon:'÷',color:'teal',description:'Divide counts by a declared population at risk, stating what the denominator counts',inputs:[['records','points']],output:'table'},
  detect_unusual_counts:{title:'Detect unusual counts',group:'Epidemiology',icon:'⚑',color:'teal',description:'Flag the periods whose count passes a threshold set from the series\' own past: EARS C1, C2 or C3, CUSUM or EWMA',inputs:[['records','table']],output:'table'},
  case_series:{title:'Cases by period',group:'Epidemiology',icon:'▦',color:'teal',description:'Count cases by day, week, month, day of the week or month of the year, by a declared kind of date',inputs:[['points','points']],output:'table'},
  slr_extract_import:{title:'Sea-level projection extract',group:'Sources',icon:'≈',color:'blue',description:'Declare an imported long-format table as a bounded extract of published AR6 projections',inputs:[['projections','table']],output:'table'},
  slr_site_assignment:{title:'Assign projection site',group:'Spatial operations',icon:'⊕',color:'teal',description:'Assign each point its nearest published projection site and record the distance',inputs:[['points','points'],['sites','points'],['projections','table']],output:'table'},
  slr_threshold_comparison:{title:'Compare level to elevation',group:'Comparisons and checks',icon:'⋚',color:'purple',description:'Compare one projected change against a supplied elevation on a stated datum',inputs:[['assignments','table']],output:'decisions'},
  reproject:{title:'Reproject points',group:'Spatial operations',icon:'⇄',color:'blue',description:'Retired: connect the points to a Table and choose coordinates in metres',inputs:[['points','points']],output:'points'},
  deduplicate_points:{title:'Deduplicate records',group:'Comparisons and checks',icon:'⧉',color:'purple',
    description:'Find records that are the same, in two point sources or within one table, and merge the ones that agree',
    inputs:[['points','points'],['points_2','points'],['records','table']],output:'points'},
  // THE MASK IS A STUDY AREA OR A POLYGON LAYER (2026-11-24). Both ports are always offered, so connecting one is
  // how the mask is chosen -- the reasoning chart_output and sample_raster already use: no type appears in two
  // modes, so asking before the shape arrives is a question with no content.
  clip_points_to_area:{title:'Keep points inside the area',group:'Spatial operations',icon:'⊂',color:'teal',description:'Keep the points that fall inside a study area or a polygon layer, and count what fell outside',inputs:[['area','area'],['polygons','polygons'],['points','points']],output:'points'},
  raster_input:{title:'Raster input',group:'Sources',icon:'▦',color:'blue',description:'Import a window from a local GeoTIFF around the study area',inputs:[['area','area']],output:'raster'},
  // Extracted from `access`, which derived proxy minutes inside a nearest-neighbour search. A
  // widget and not a knob: a minutes column changes every row for every consumer of `distances`,
  // so the contract moves, which is what the knob test refuses. And not a third value of the unit
  // knob either -- minutes is a model, not a unit.
  // RETIRED with Old Naledi, 2026-11-11: kept so a saved workflow holding one is refused by name.
  travel_time:{title:'Travel time from distance',group:'Spatial operations',icon:'◷',color:'teal',
    description:'Retired — use Apply ruleset, with a value computed for every record',
    inputs:[['distances','distances']],output:'distances'},
  // One entry for every declared ruleset, replacing policy, access_policy and xpert, which
  // differed only in which rules they ran. Ports are the ruleset's and are pinned per node, so
  // inputs is empty and output is null here.
  apply_ruleset:{title:'Apply ruleset',group:'Semantic reasoning',icon:'⋈',color:'purple',
    description:'Apply declared rules to each record, to classify it or compute a value',
    inputs:[],output:null},
  // RETIRED 2026-11-07: kept so a saved workflow holding one is refused by name. Its members' functions stay, as
  // the widgets they always were.
  micro_workflow:{title:'Micro-workflow',group:'Micro-workflows',icon:'⧈',color:'indigo',
    description:'Retired — build the steps it held from the palette',
    inputs:[],output:null},
  fill_interior_gaps:{title:'Fill interior gaps',group:'Spatial operations',icon:'◍',color:'teal',description:'Make each polygon solid by dropping its interior gaps, which enlarges it',inputs:[['polygons','polygons']],output:'polygons'},
  // RETIRED 2026-11-13 into Map, which takes several polygon layers itself (docs/audits/collect-polygon-layers-retired.md).
  // Kept so a saved workflow naming it is migrated.
  stack_polygons:{title:'Collect polygon layers',group:'Spatial operations',icon:'▤',color:'teal',description:'Retired — connect each polygon layer to the Map',inputs:[['polygons','polygons'],['polygons_2','polygons'],['polygons_3','polygons'],['polygons_4','polygons'],['polygons_5','polygons'],['polygons_6','polygons']],output:'polygons'},
  travel_time_band:{title:'Travel time band',group:'Spatial operations',icon:'◔',color:'teal',description:'Narrow reachable junctions to a shorter time, recomputing the budget left at each',inputs:[['reached','points']],output:'points'},
  reachable_corridor:{title:'Reachable corridor',group:'Spatial operations',icon:'▦',color:'teal',description:'The strip of ground along the streets a traveller can get down within the budget',inputs:[['reached','points'],['network','network']],output:'polygons'},
  reachable_nodes:{title:'Reachable junctions',group:'Spatial operations',icon:'◴',color:'teal',description:'Street junctions within a travel time, each carrying the budget left on arrival',inputs:[['sites','points'],['network','network']],output:'points'},
  snap_to_network:{title:'Snap to street network',group:'Spatial operations',icon:'⇥',color:'teal',description:'Attach each site to its nearest network node, carrying how far it moved',inputs:[['sites','points'],['network','network']],output:'points'},
  summarize_combined_area:{title:'Combined area',group:'Summaries',icon:'∪',color:'teal',description:'Areas become one area; overlapping and touching polygons become one polygon',inputs:[['polygons','polygons'],['area','area'],['area2','area']],output:'polygons'},
  summarize_hull:{title:'Convex hull',group:'Summaries',icon:'⬟',color:'teal',description:'The smallest convex outline containing a set of points, computed in metres',inputs:[['points','points']],output:'polygons'},
  find_health_facilities:{title:'Find health facilities',group:'Sources',icon:'⌖',color:'blue',description:'Find the health facilities inside a study area, or the facilities a list names, in national registers and OpenStreetMap',inputs:[['area','area']],output:'points'},
  buffer_point:{title:'Geometry buffer',group:'Spatial operations',icon:'◍',color:'teal',description:'Everything within a stated distance of the points, lines or polygons connected, as one area or as a layer of separate buffers',inputs:[['points','points'],['lines','lines'],['polygons','polygons']],output:'area'},
  sample_raster:{title:'Sample a raster at points or over areas',group:'Spatial operations',icon:'◴',color:'teal',
    description:'Read a raster, or satellite files, at each point or over each area: the cell\'s value at a point, the total of the cells in an area, and say where there is no value and why',
    inputs:[['points','points'],['areas','polygons'],['area','area'],['raster','raster'],['files','satellite-files']],output:'points'},
  clip_raster:{title:'Clip raster',group:'Spatial operations',icon:'✂',color:'teal',description:'Mask raster cells with a clipping boundary',inputs:[['area','area'],['raster','raster']],output:'raster'},
  // TRAVEL TIME OVER GROUND (experiment 231), for where the streets are not the way people move: a friction surface
  // states what crossing a metre of each cell costs, and the walk accumulates that cost cell to cell.
  // A COLUMN'S TERMS LINKED TO WIKIDATA (experiment 232). Semantic reasoning, beside Apply ruleset: attaching an
  // identity from an outside authority is a semantic act, not a summary.
  map_terms_to_vocabulary:{title:'Map a column\u2019s terms to a vocabulary',group:'Semantic reasoning',icon:'\u2387',color:'purple',
    description:'Give each term in a column the entity a person judged it to name in a published vocabulary, so the rows carry an identifier that means something outside this workflow',
    inputs:[['records','table']],output:'table'},
  travel_over_ground:{title:'Travel time over ground',group:'Spatial operations',icon:'◵',color:'teal',
    description:'Minutes to the nearest starting point across a friction surface, written onto each place, for where the walk is not along mapped streets',
    inputs:[['friction','raster'],['origins','points'],['places','points']],output:'points'},
  places: {title:'Neighborhoods', group:'Sources', icon:'▦', color:'blue', description:'Local neighborhood locations', inputs:[], output:'points'},
  centers: {title:'Cooling centers', group:'Sources', icon:'⌂', color:'blue', description:'Local facility locations', inputs:[], output:'points'},
  alert: {title:'Heat alert', group:'Sources', icon:'☀', color:'amber', description:'Assessment context', inputs:[], output:'alert'},
  // Ports renamed 2026-10-12. They were `places` and `centers`, which is the heat demo's
  // vocabulary on a general operation: given a point and a set of points, report the distance to
  // the nearest member of the set. D7 names this failure -- a port name that encodes a use rather
  // than what the port carries -- and it is why this widget read as example-specific while its
  // computation never was. The unit knob landed earlier the same day.
  measure_distance: {title:'Measure distance', group:'Spatial operations', icon:'⌁', color:'teal', description:'For each point, the straight-line distance to the nearest of a set of candidate points', inputs:[['points','points'],['candidates','points']], output:'distances'},
  policy: {title:'Outreach criteria', group:'Semantic reasoning', icon:'⋈', color:'purple', description:'Apply N3 rules with EYE-JS', inputs:[['distances','distances'],['alert','alert']], output:'decisions'},
  // Study area's definition lived in Old Naledi's module until 2026-11-11 (docs/audits/old-naledi-audit.md).
  study_area:{title:'Study area',group:'Sources',icon:'⬡',color:'blue',description:'Define the geographic extent used by your workflow',inputs:[],output:'area'},
  // RETIRED with Old Naledi, 2026-11-11: kept so a saved workflow holding one is refused by name.
  facilities:{title:'Select nearby facilities',group:'Spatial operations',icon:'⌂',color:'blue',description:'Retired — use Keep points inside the area',inputs:[['area','area'],['points','points']],output:'facilities'},
  facility_audit:{title:'Evidence register',group:'Summaries',icon:'☷',color:'green',description:'Retired — use Table, and Apply ruleset for a classification',inputs:[['points','points']],output:'decisions'},
  xpert:{title:'Diagnostic evidence',group:'Semantic reasoning',icon:'⋈',color:'purple',description:'Retired — use Apply ruleset',inputs:[['facilities','facilities']],output:'gradedFacilities'},
  access:{title:'Facility access',group:'Spatial operations',icon:'⌁',color:'teal',description:'Retired — use Measure distance',inputs:[['samples','points'],['facilities','gradedFacilities']],output:'access'},
  access_policy:{title:'Access review',group:'Semantic reasoning',icon:'⋈',color:'purple',description:'Retired — use Apply ruleset',inputs:[['access','access']],output:'decisions'},
  // Generalised in place on 2026-10-12, out of OLD_TYPES and into the shared palette. The grid
  // was always a general operation; its title said "Sample locations", its description promised
  // "demonstration points", and it lived in one example's module. src/point-grid.ts holds it now.
  point_grid:{title:'Point grid',group:'Spatial operations',icon:'▦',color:'teal',description:'Generate a regular grid of points inside a boundary at a stated spacing',inputs:[['area','area']],output:'points'},
  measure_area:{title:'Calculate area',group:'Spatial operations',icon:'▱',color:'teal',description:'Attach an area measurement to the study area',inputs:[['area','area']],output:'area'},
  // The `records` table is OPTIONAL, as Polygon layer's area is: unconnected, this is the source it always was;
  // connected, the points are read from the table's x (longitude) and y (latitude) columns. Experiment 178.
  point_input:{title:'Point data',group:'Sources',icon:'▦',color:'blue',description:'Import point observations or generate synthetic records, or read them from a table\'s longitude and latitude columns',inputs:[['records','table'],['area','area']],output:'points'},
  // Retired 2026-10-21 and archived here, not deleted: a registry entry must resolve to a
  // definition, and a saved workflow that still names this type is migrated to
  // `clip_points_to_area` on open. It is in the retired list, so the palette never offers it.
  coverage_check:{title:'Check spatial coverage',group:'Comparisons and checks',icon:'◎',color:'purple',description:'Retired — use Keep points inside the area',inputs:[['area','area'],['points','points']],output:'coverage-check'},
  map_output:{title:'Map',group:'Outputs',icon:'◈',color:'green',description:'Display the study polygon and points, including outside records',inputs:[['area','area'],['points','points'],['polygons','polygons'],['context','points'],['raster','raster'],['ground','ground'],['network','network'],['lines','lines']],output:null},
  table_output:{title:'Table',group:'Outputs',icon:'☷',color:'green',description:'Show what is connected as a table',inputs:[['points','points'],['table','table'],['polygons','polygons']],output:null},
  chart_output:{title:'Chart',group:'Outputs',icon:'▥',color:'green',description:'Draw a table or a case series as bars or a curve, or who infected whom as a tree',inputs:[['records','table'],['polygons','polygons']],output:null},
  output: {title:'Visual output', group:'Outputs', icon:'◈', color:'green', description:'Display results as a map, table, or bar chart', inputs:[['decisions','decisions']], output:null}
};
const point = (id:string,name:string,coordinates:Position|null|undefined):PointFeature => ({type:'Feature',id,properties:{name},geometry: coordinates ? {type:'Point',coordinates} : null});
/** The port type a node emits.
 *
 *  For a widget this is decided by its type, and this function is that lookup. It exists as
 *  a function because a micro-workflow node's output is decided by the composition it
 *  carries rather than by its node type, and edge validation has to ask the node.
 *
 *  The counterpart of `nodeInputs`, which has been node-dependent since `map_output` gained
 *  input modes. Inside a composition the static lookup is still correct: members are
 *  registry widgets, never compositions, so nothing nests. */
/** WHETHER A PORT TAKES A RESULT. The same type, or a distances result on a table port (experiment 197): one row per point,
 *  its nearest candidate and the distance, which is a table, and which Relate and Select rows can then read. */
export function portAccepts(wanted:PortType|undefined,given:PortType|null):boolean{
  return !!wanted&&!!given&&(wanted===given||(wanted==='table'&&(given==='distances'||given==='points'||given==='polygons'))||(wanted==='points'&&given==='mean-center'));
}

/** A POINT LAYER AS A TABLE (experiment 200): one row per point, its id and its attributes as columns, and no geometry,
 *  since a table has none (48). No value column: a point has no one number that is the record's. Hagelloch's cases
 *  are a point layer, and relating them to themselves on `infector` needs them as a table. A column whose values are
 *  all numbers is declared numeric, as a distances table's are. */
export function pointsAsTable(value:{features?:{id?:unknown;properties?:Record<string,unknown>|null}[]}|undefined):DataTable{
  const features=value?.features??[];
  const own:string[]=[];
  for(const f of features)for(const k of Object.keys(f.properties??{}))if(!own.includes(k)&&k!=='id')own.push(k);
  const said=(v:unknown)=>v===null||v===undefined?'':typeof v==='object'?JSON.stringify(v):String(v);
  const rows=features.map((f,i)=>({key:{id:said(f.id??i+1),...Object.fromEntries(own.map(k=>[k,said(f.properties?.[k])]))} as Record<string,string>,value:null}));
  const numeric=own.filter(k=>features.some(f=>typeof f.properties?.[k]==='number')
    &&features.every(f=>{const v=f.properties?.[k];return v===undefined||v===null||typeof v==='number';}));
  return {kind:'data-table',keys:['id',...own],valueField:'',rows:rows as DataTable['rows'],rowCount:rows.length,missingValueCount:0,
    ...(numeric.length?{numericKeys:Object.fromEntries(numeric.map(n=>[n,'']))}:{})};
}
/** A STUDY AREA'S NAMED UNITS, ONE AREA EACH, with all of its parts (2026-11-13). The units list one entry per part, so
 *  Rwanda's Ngoma, a district and a 1 m\u00b2 sliver beside it, was totalled as two areas, the sliver with no cell and no
 *  total, and every share of the country became unknown. A unit's parts are one area, totalled together. */
export function studyUnitAreas(study:{units:{id:string;name:string}[];boundary:import('./types.js').Boundary}):{id:string;name:string;geometry:import('./types.js').Boundary}[]{
  const parts=study.boundary.type==='MultiPolygon'?study.boundary.coordinates:[study.boundary.coordinates];
  const byId=new Map<string,{id:string;name:string;polygons:Position[][][]}>();
  study.units.forEach((unit,index)=>{const part=parts[index];if(!part)return;
    const held=byId.get(unit.id)??{id:unit.id,name:unit.name,polygons:[]};held.polygons.push(part as Position[][]);byId.set(unit.id,held);});
  return [...byId.values()].map(u=>({id:u.id,name:u.name,geometry:u.polygons.length===1?{type:'Polygon',coordinates:u.polygons[0]!}:{type:'MultiPolygon',coordinates:u.polygons}}));
}
/** A POLYGON LAYER AS A TABLE (experiment 209): one row per part, its id, its name and its attributes as columns, no
 *  geometry. Its number, where the layer names the column that holds it (Sample a raster's total, such as population), is
 *  the table's value, so Total within groups adds it and gives each part's share; otherwise the parts' `value` is, under
 *  "value", or there is none. Botswana's 28 districts' totals from three rasters set beside the census needed it. */
export function polygonsAsTable(value:{valueColumn?:string;valueUnit?:string;kind?:string;summary?:{valueField?:string};
  features?:{id?:unknown;name?:string;value?:number;properties?:Record<string,unknown>|null;minutes?:number;status?:string;explanation?:string|null;
    areaSquareMetres?:number;count?:number;total?:number;missingValues?:number}[]}|undefined):DataTable{
  const features=value?.features??[],column=value?.valueColumn?.trim();
  const valued=features.some(f=>typeof f.value==='number');
  // WHAT THE STEP THAT MADE THE LAYER SAYS OF EACH POLYGON, beside its own attributes, as Table output's polygon view showed
  // them: a band's minutes, a rule's conclusion, an area, the locations a catchment holds (2026-11-15, read one way).
  const summary=value?.summary;
  const said=(f:typeof features[number])=>({...(f.minutes!==undefined?{minutes:f.minutes}:{}),
    ...(f.status!==undefined?{status:f.status,explanation:f.explanation??null}:{}),
    ...(f.areaSquareMetres!==undefined?{areaSquareMetres:f.areaSquareMetres}:{}),
    ...(value?.kind==='hexbin'?{count:f.count??0}:summary?{locations:f.count??null,...(summary.valueField?{numericTotal:f.total??null}:{}),missingValues:f.missingValues??null}:{})});
  const table=pointsAsTable({features:features.map(f=>{const props={...(f.properties??{})};if(column)delete props[column];
    return {id:f.id,properties:{name:f.name??String(f.id??''),...props,...said(f)}};})});
  if(!valued)return table;
  const field=column||'value';
  // THE UNIT THE STEP DECLARED (2026-11-20): it was dropped here, so Sample a raster's "people" reached Append rows as no
  // unit, and DR Congo's census, which states "people", was refused beside it.
  const unit=value?.valueUnit?.trim();
  return {...table,valueField:field,...(unit?{unit}:{}),rows:table.rows.map((row,i)=>({...row,value:typeof features[i]!.value==='number'?features[i]!.value!:null})),
    missingValueCount:features.filter(f=>typeof f.value!=='number').length};
}
/** What a table port reads from a step: its table, its distances as a table, or its points or polygons as a table. */
export function asTableInput(from:WorkflowNode|undefined,value:unknown):unknown{
  const out=from?outputOf(from):null;
  return out==='distances'?distancesAsTable(value as never):out==='points'?pointsAsTable(value as never):out==='polygons'?polygonsAsTable(value as never):value;
}

/** A DISTANCES RESULT AS A TABLE: keyed by `point_id`, the point's own attributes as `point_<attribute>`, `nearest_id`
 *  and the nearest candidate's own attributes as `nearest_<attribute>`, the distance as the value in its stated unit. A
 *  point with no candidate keeps its row, with the nearest columns empty and no value, so it is counted rather than
 *  lost. A column whose values are all numbers is declared numeric, so a rule reads it as one (experiment 198). */
export function distancesAsTable(value:{rows?:NearestRow[]}|undefined):DataTable{
  const rows=value?.rows??[];
  const own:string[]=[],theirs:string[]=[];
  for(const row of rows){
    for(const k of Object.keys(row.attributes??{}))if(!own.includes(k))own.push(k);
    for(const k of Object.keys(row.center?.attributes??{}))if(!theirs.includes(k))theirs.push(k);
  }
  const said=(v:unknown)=>v===null||v===undefined?'':String(v);
  const columns:[string,(row:NearestRow)=>unknown][]=[['point_id',r=>r.id],
    ...own.map(k=>[`point_${k}`,(r:NearestRow)=>(r.attributes as Record<string,unknown>|undefined)?.[k]] as [string,(row:NearestRow)=>unknown]),
    ['nearest_id',r=>r.center?.id],
    ...theirs.map(k=>[`nearest_${k}`,(r:NearestRow)=>(r.center?.attributes as Record<string,unknown>|undefined)?.[k]] as [string,(row:NearestRow)=>unknown])];
  const out=rows.map(row=>({key:Object.fromEntries(columns.map(([name,read])=>[name,said(read(row))])) as Record<string,string>,
    value:typeof row.distance==='number'&&Number.isFinite(row.distance)?row.distance:null}));
  // NUMERIC WHERE THE ATTRIBUTE WAS A NUMBER on every row that has it: a sampled height, a population. Not guessed from text.
  const numeric=columns.filter(([name,read])=>name!=='point_id'&&name!=='nearest_id'&&rows.some(r=>typeof read(r)==='number')
    &&rows.every(r=>{const v=read(r);return v===undefined||v===null||typeof v==='number';})).map(([name])=>name);
  const unit=rows[0]?.unit;
  return {kind:'data-table',keys:columns.map(([name])=>name),valueField:'distance',...(unit?{unit}:{}),rows:out as DataTable['rows'],
    rowCount:out.length,missingValueCount:out.filter(r=>r.value===null).length,
    ...(numeric.length?{numericKeys:Object.fromEntries(numeric.map(n=>[n,'']))}:{})};
}

export function outputOf(node:WorkflowNode):PortType|null{
  // A STUDY AREA AND A STUDY AREA ARE A STUDY AREA. The practitioner, 2026-10-22: "But a study
  // area is a polygon", and "two study area polygons combined should still be a study area". The
  // union always returned a `polygons`, which nothing that wants an area will take -- so the
  // widget that does exactly what was asked could not be used for it. Given areas it yields an
  // area, which the street network, the facilities and the clip all accept.
  if(node.type==='summarize_combined_area')return node.params.yields==='area'?'area':'polygons';
  // THE UNION OFFER IS THE OUTPUT TYPE. Dissolved, the buffers are one scope, which is the only form the clip, the
  // street network and the facility search will take; kept apart, they are a layer you can see the overlaps in.
  if(node.type==='buffer_point')return node.params.yields==='polygons'?'polygons':'area';
  if(node.type==='apply_ruleset')return node.params.ruleset?.output??null;
  if(node.type==='deduplicate_points'&&node.params.format==='table')return 'table';
  // THE OUTPUT FOLLOWS THE INPUT (experiment 205): satellite files give a table of places by period; a raster over areas
  // gives the areas, each with its total; a raster at points, the points with their values.
  if(node.type==='sample_raster')return node.params.source==='satellite-files'?'table':node.params.over==='areas'?'polygons':'points';
  return TYPES[node.type].output;
}

/** The ports a node must have connected before it will run, as distinct from the ports it MAY
 *  take, which is what `nodeInputs` returns.
 *
 *  Extracted from `executionPlan` on 2026-10-14. It had been a ternary inside the traversal, and
 *  scripts/port-contracts.mjs had to restate it to publish the same answer -- one contract written
 *  twice, in two files, with nothing holding the copies together. Now the generator imports this,
 *  so the published declaration cannot disagree with the behaviour it describes. Experiment 112. */
export function requiredInputs(node:WorkflowNode):[string,PortType][]{
  const all=nodeInputs(node);
  // A country can name the scope instead, so the area is optional rather than absent.
  // `polygon_input` joins it for the same reason and one more: it may simply READ a published
  // GeoJSON file, where there is no scope to name. The area scopes ACQUISITION from an extract,
  // so insisting on it would make the widget's original job impossible and -- because
  // `INPUT_STAGE` is derived from what a widget requires -- would also drop it off a blank
  // canvas, which is where a source widget has to be.
  // A LAYER MADE OF THE AREAS' PARTS needs one area at least; the others are added as wanted.
  if(node.type==='polygon_input'&&node.params.inputMethod==='areas')return all.filter(([port])=>port==='area');
  // A LINE LAYER READ FROM A FILE needs nothing connected; a border needs both areas (experiment 229).
  if(node.type==='line_input')return node.params.inputMethod==='border'?all:[];
  if(node.type==='network_input'||node.type==='polygon_input')
    return all.filter(([port])=>port!=='area');
  // THE AREA TO GENERATE IN, optional too (2026-11-21): connected, it is the one Configure… generates in.
  if(node.type==='point_input')return all.filter(([port])=>port!=='records'&&port!=='area');
  // A SEARCH'S AREA MAY BE TYPED IN ITS DIALOG, as in JLT's STAC Browser, so a Study area fills it but is not required.
  // Requiring it left Search grey with no way forward inside the dialog (the practitioner, 2026-11-05).
  if(node.type==='search_satellite_catalog')return all.filter(([port])=>port!=='area');
  // A STUDY AREA OR A POLYGON LAYER, never both and never neither (2026-11-24). The same shape as the sampler
  // below: neither mask is required ON ITS OWN, because requiring both would refuse every workflow and requiring
  // the area would refuse the layer. The run says which is missing, and refuses two masks, where a point inside
  // one and outside the other would otherwise have no single answer.
  if(node.type==='clip_points_to_area')return all.filter(([port])=>port!=='area'&&port!=='polygons');
  // POINTS OR AREAS: the sampler reads at one or the other, so neither is required on its own; the run says which is
  // missing when neither is connected (experiment 180).
  if(node.type==='sample_raster')return all.filter(([port])=>port===(node.params.source==='satellite-files'?'files':'raster'));
  // POINTS, LINES OR POLYGONS: the step buffers whichever is connected, so none is required on its own and the run
  // says so when nothing is. The same shape as the sampler above.
  if(node.type==='buffer_point')return [];
  // A DESIGN IS DECLARED OR IT IS ABSENT, and absent must keep working. Requiring it would make
  // every existing workflow with a two-by-two refuse to run until somebody answered a question
  // they may not be able to answer -- and would drop the widget's own contract into one that
  // cannot be satisfied from a blank canvas. Experiment 154.
  if(node.type==='two_by_two'||node.type==='regression')
    return all.filter(([port])=>port!=='design');
  // THE PARTS MAY BE A STUDY AREA OR A POLYGON LAYER, so neither is required of itself and the run
  // says so if both are missing. Nigeria's 774 LGAs are 218,000 vertices, which a study area, one
  // extent of about 26,000, cannot hold and a polygon layer exists for.
  if(node.type==='join_table_to_area')return all.filter(([port])=>port==='records');
  // `chart_output` joins them on 2026-10-28, the day it stopped choosing its ports by a mode.
  // A chart insists on nothing for the same reason a map and a table do not: it draws what it is
  // given, and declaring three ports while requiring them all turned one unconnected node into
  // "Chart needs its records input connected" on every workflow that charts a decision.
  if(!['map_output','table_output','chart_output'].includes(node.type))return all;
  // NEITHER A MAP NOR A TABLE INSISTS ON ANYTHING: each shows what it is given, and which ports
  // those are is the practitioner's business. The map stopped insisting on an area and a points
  // layer on 2026-10-14 -- that insistence is why a map of a raster had to be told it was a
  // raster map before it would accept one. The table went on insisting until 2026-10-27, when
  // declaring all of its ports turned "Table needs its points input connected" into a demand for
  // four unrelated inputs at once. A view with nothing wired is unfinished, not failed, and
  // `incomplete-workflow` already says so.
  return [];
}
import {mapLayerList,validateLayerSettings,assertSomethingToDraw,membersOfPolygons,classesOfPoints,type MapLayer}
  from './map-layer-list.js';

export function drawnMode(node:WorkflowNode<'map_output'>,edges:{to:string;port:string}[]):
  'network'|'raster'|'polygons'|'spatial'{
  const wired=new Set(edges.filter(e=>e.to===node.id).map(e=>e.port));
  if(wired.has('network'))return 'network';
  if([...wired].some(isRasterPort))return 'raster';
  if([...wired].some(isPolygonPort))return 'polygons';
  if(wired.size)return 'spatial';
  // 'decisions' is still read from a saved file and shown as spatial: nothing produces decisions since 2026-11-11.
  const stored=node.params.inputMode;
  return stored==='network'||stored==='raster'||stored==='polygons'?stored:'spatial';
}

/** Which renderer a TABLE uses, read from what is wired. The same direction, one widget over.
 *
 *  `a-map-has-layers-not-modes`, 2026-10-14: *"There is no such thing as mode, only layers"*,
 *  repeated on 2026-10-15 after the selector was still there. It was built for `map_output` and
 *  left on `table_output`, which went on deciding its ports from `inputMode` for twelve days.
 *
 *  The practitioner met it on 2026-10-27 the same way as the first time -- in the running app,
 *  trying to connect Relate a column to a table view and being refused. A freshly added node
 *  defaults to points, so the `table` port the connection needed did not exist on the node. That
 *  is the blocker `output-mode-set-before-the-shape-arrives`, unchanged.
 *
 *  Precedence is specificity: a keyed table, polygons and decisions each have their own renderer,
 *  and the point/coverage path is the general one. The stored `inputMode` is read LAST, so a
 *  workflow saved before this opens and shows what it showed. Nothing writes it any more. */
/** WHICH TABLE IS ON THIS PORT, by the name a reader of this canvas would use.
 *
 *  The node's label, except where it is still the palette's default and a tabular input has a
 *  filename. `table_input` has no label control of its own, so two imported tables are both
 *  "Tabular data" until a project file renames them -- and a relate panel reading "from Tabular
 *  data, brought from Tabular data" names neither. The filename is then the only name the
 *  practitioner has actually given them.
 */
export function portSourceName(w:Workflow,nodeId:string,port:string,fallback:string):string{
  const edge=w.edges.find(e=>e.to===nodeId&&e.port===port);
  const from=edge&&w.nodes.find(x=>x.id===edge.from);
  if(!from)return fallback;
  const label=from.params.label?.trim();
  if(from.type==='table_input'){
    const file=from.params.source?.filename?.trim();
    if(file&&(!label||label===TYPES.table_input.title))return file;
  }
  return label||TYPES[from.type].title;
}

export function shownMode(node:WorkflowNode<'table_output'>,edges:{to:string;port:string}[]):
  'table'|'polygons'|'spatial'{
  const wired=new Set(edges.filter(e=>e.to===node.id).map(e=>e.port));
  if(wired.has('table'))return 'table';
  if(wired.has('polygons'))return 'polygons';
  if(wired.size)return 'spatial';
  const stored=node.params.inputMode;
  return stored==='table'||stored==='polygons'?stored:'spatial';
}

export function nodeInputs(node:WorkflowNode):[string,PortType][]{
  // A ruleset's ports are pinned in the node rather than looked up: a saved workflow validates without the file
  // present. An unconfigured one has no ports, which is the honest answer for a step whose ruleset is not chosen.
  if(node.type==='apply_ruleset')return structuredClone(node.params.ruleset?.inputs??[]);
  // FROM A LIST, the list is the input and there is no area (experiment 190).
  if(node.type==='find_health_facilities'&&node.params.mode==='list')return [['list','table']];
  if(node.type==='compare_point_sets'&&node.params.centers)return [...TYPES.compare_point_sets.inputs,['originalCenter','mean-center'],['movedCenter','mean-center']];
  // EVERY PORT A CHART CAN DRAW, ALWAYS -- the change `map_output` and `table_output` already
  // took, and the one the blocker `output-mode-set-before-the-shape-arrives` prescribes for this
  // widget by name: *"On table_output and chart_output the mode is fully determined by the
  // connected port type -- no type appears in two modes -- so the question is redundant."* It
  // was the one output left choosing its ports by a mode, so a practitioner holding a table of
  // rates found a node with a single "Reasoning result" port and nothing to aim at.
  //
  // `series` stays only where a saved workflow already uses it. A Cases by period table
  // connected to `records` draws its curve just the same: the shape decides, not the port.
  if(node.type==='chart_output')return [...TYPES.chart_output.inputs];
  // AS MANY TABLES AS THE PRACTITIONER ADDS, one port each, in order (experiment 181). Two is the floor and the
  // ports of a workflow saved before keep their names.
  if(node.type==='append_rows')return Array.from({length:appendTableCount(node.params)},
    (_,i)=>[appendPort(i),'table'] as [string,PortType]);
  if(node.type==='case_series')return node.params.source==='table'?[['cases','table']]:[['points','points']];
  // ONE SAMPLER, two sources (experiment 205): every port, always, as Chart's are; what is connected sets the source and
  // whether it reads at points or over areas, so nothing has to be chosen before the shape arrives.
  if(node.type==='sample_raster')return [...TYPES.sample_raster.inputs];
  // The same shape, for the same reason: a rate's denominator usually arrives as a table.
  // The port keeps its name either way, because what it carries is the records to divide.
  if(node.type==='rate')return node.params.source==='table'?[['records','table']]:[['records','points']];
  // A map takes every layer it can draw, always. Its ports used to change with its mode, so the
  // port a connection needed might not exist on the node -- the blocker
  // `output-mode-set-before-the-shape-arrives`, and the reason a practitioner had to answer a
  // question about shape before having the shape.
  // SEVERAL STUDY AREAS, each its own input, where the layer is made of their parts (2026-11-21).
  // THE TWO AREAS A BORDER IS TAKEN FROM, offered only where the layer is a border (experiment 229).
  if(node.type==='line_input')return node.params.inputMethod==='border'?[['area','area'],['area_2','area']]:[];
  if(node.type==='polygon_input')return [['area','area'],
    ...Array.from({length:node.params.inputMethod==='areas'?Math.max(0,Math.min(MAX_AREA_INPUTS,node.params.areaInputCount??1)-1):0},
      (_,i)=>[`area_${i+2}`,'area'] as [string,PortType])];
  if(node.type==='map_output')return [['area','area'],
    ...Array.from({length:node.params.pointInputCount??1},(_,i)=>[pointPort(i),'points'] as [string,PortType]),
    // SEVERAL POLYGON LAYERS, each its own port, as point layers are (2026-11-13): the practitioner, of Collect polygon
    // layers, "we can connect polygon layers directly to the Map output".
    ...Array.from({length:Math.max(1,Math.min(MAX_POLYGON_LAYERS,node.params.polygonInputCount??1))},(_,i)=>[polygonPort(i),'polygons'] as [string,PortType]),
    ['context','points'],
    // THE DYNAMIC LIST IS THE ONE THAT BINDS. `TYPES.map_output.inputs` declares the ports and
    // this function is what a connection is actually checked against, so a port added to the
    // declaration alone is a port nothing may connect to -- which is how `ground` arrived
    // refusing its own widget with "Incompatible node connection" on 2026-10-27.
    // UP TO FOUR RASTERS, each its own input (Map's manual, History: panels: grid cells in panels side by side).
    ...Array.from({length:Math.max(1,Math.min(MAX_RASTER_LAYERS,node.params.rasterInputCount??1))},(_,i)=>[rasterPort(i),'raster'] as [string,PortType]),
    // SEVERAL SHEETS AS GROUND (TODO 35, 2026-11-15): Lycoming lies across two 1943 sheets, each placed and cut on its own.
    ...Array.from({length:Math.max(1,Math.min(MAX_GROUND_LAYERS,node.params.groundInputCount??1))},(_,i)=>[groundPort(i),'ground'] as [string,PortType]),
    ['network','network'],
    // LINES, drawn over whatever else the map draws (experiment 229).
    ['lines','lines']];

  // A street network is a thing to look at, not only a thing to route over. Four widgets consume a
  // `network` and none of them was an output, so a downloaded network could not be seen.
  // Deduplication compares ACROSS sources, so two layers is its floor rather than its shape: a
  // practitioner with OSM, Overture and HDX over one area has three.
  if(node.type==='deduplicate_points'&&node.params.format==='table')return [['records','table']];
  if(node.type==='deduplicate_points')
    return Array.from({length:Math.max(2,Math.min(MAX_POINT_LAYERS,node.params.pointInputCount??2))},
      (_,i)=>[pointPort(i),'points']) as [string,PortType][];
  // EVERY PORT A TABLE CAN SHOW, ALWAYS -- the same change `map_output` took above, and for the
  // same reason: a port that exists only in one mode is a port a connection cannot be made to
  // until the practitioner has answered a question about the shape before having the shape.
  if(node.type==='table_output')return [
    ...Array.from({length:node.params.pointInputCount??1},(_,i)=>[pointPort(i),'points'] as [string,PortType]),
    ['table','table'],['polygons','polygons']];
  return TYPES[node.type].inputs;
}
/** STEPS WHOSE NEXT RUN READS EVERY SATELLITE FILE AGAIN, asked for in Sample satellite's dialog. Once: the run that
 *  reads them takes the request, and what it reads is saved as usual. */
export const rereadOnce=new Set<string>();
export function validateGeoJSON(data:unknown,{attributes=false}={}):PointCollection {
  if (!isRecord(data) || data.type !== 'FeatureCollection' || !Array.isArray(data.features) || data.features.length > MAX_POINT_RECORDS) throw new Error(`Use a GeoJSON FeatureCollection with at most ${MAX_POINT_RECORDS.toLocaleString('en')} point features.`);
  const ids = new Set();
  return {type:'FeatureCollection',features:data.features.map((feature,i)=>{
    if (!isRecord(feature)||feature.type !== 'Feature') throw new Error(`Record ${i+1} is not a Feature.`);
    const id = String(feature.id ?? `point-${i+1}`);
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || ids.has(id)) throw new Error('Feature IDs must be unique letters, numbers, hyphens, or underscores (max 80).');
    ids.add(id);
    const g = feature.geometry;
    if(feature.properties!==undefined&&feature.properties!==null&&!isRecord(feature.properties))throw new Error('Invalid point properties.');
    if (g !== null && (!isRecord(g) || g.type !== 'Point' || !Array.isArray(g.coordinates) || g.coordinates.length < 2 || !g.coordinates.slice(0,2).every(Number.isFinite) || Math.abs(g.coordinates[0]) > 180 || Math.abs(g.coordinates[1]) > 90)) throw new Error(`Invalid point coordinates for ${id}. Use longitude, latitude in CRS84, or null for a missing location.`);
    const normalized=point(id,String(feature.properties?.name ?? id).slice(0,100),g===null?null:(g as {coordinates:number[]}).coordinates.slice(0,2));
    if(attributes){const entries=Object.entries(feature.properties||{});if(entries.length>50||entries.some(([key,value])=>!key||key.length>100||['__proto__','constructor','prototype'].includes(key)||!(value===null||typeof value==='boolean'||typeof value==='string'&&value.length<=1000||typeof value==='number'&&Number.isFinite(value))))throw new Error('Use at most 50 scalar attributes per record, with text up to 1,000 characters.');normalized.properties={...Object.fromEntries(entries) as Record<string,Scalar>,name:normalized.properties.name};}
    return normalized;
  })};
}
export function validateWorkflow(raw:unknown):Workflow {
  if (!isRecord(raw) || raw.schema !== 'fieldwork/workflow/1' || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges) || raw.nodes.length > 50 || raw.edges.length > 100) throw new Error('Invalid Fieldwork workflow. Maximum 50 nodes and 100 connections.');
  // Individual node/edge fields are checked below before this value leaves the boundary.
  const w = structuredClone(raw) as unknown as Workflow, ids = new Set<string>();
  referencedPDFs(w);
  assertProjectManifest(w);
  // Normalize historical heat sources before validation to preserve scalar attributes.
  w.nodes=w.nodes.map(n=>n && (n.type==='places'||n.type==='centers')
    ? {...n,type:'point_input',sourceMigration:{fromType:n.type,version:'1'}} : n);
  // `reproject` was a Source that imported a UTM file and stored the CONVERTED CRS84 points
  // (experiment 111). From 2026-10-13 it is a transform that takes points and returns points, so a
  // node saved under the old contract carries data no transform should own. The stored points are
  // already CRS84 -- the conversion ran at import -- so the node becomes the input it effectively
  // was, and its records, label and connections are kept. The discriminator is `params.data`,
  // which the new contract never writes.
  w.nodes=w.nodes.map(n=>n && n.type==='reproject' && isRecord(n.params) && isRecord((n.params as Record<string,unknown>).data)
    ? {...n,type:'point_input' as const,
       params:{label:(n.params as {label?:string}).label||'Reprojected points',
         data:(n.params as {data:PointCollection}).data,
         sourceInfo:{format:'reprojected-points',...(n.params as {source?:object}).source,...(n.params as {provenance?:object}).provenance}} as ParamsByType['point_input'],
       sourceMigration:{fromType:'reproject' as const,version:'1' as const}} : n);
  // `coverage_check` asked where points stood in relation to the study area and passed every one
  // of them on, labelled. `clip_points_to_area` asks the same question and acts on the answer, and
  // a map draws inside and outside without being asked, so the check was answering a question two
  // other widgets had started answering for it. Retired 2026-10-21 on the practitioner's decision.
  //
  // The spatial half migrates exactly. What does NOT migrate is the review: a coverage check let
  // someone exclude a record by JUDGEMENT, with a written reason pinned to a content signature.
  // Those are findings, not geometry, and the clip has nowhere to put them -- so they travel in
  // the migration stamp and the Inspector says they are inert. Dropping them here would be the
  // silent rewrite that retirement exists to prevent.
  // A check could hold up to eight point layers; a clip holds one. Where it held more, the
  // rewrite would have to invent nodes, so it refuses and names the node instead -- which is the
  // other thing the retirement contract allows, and better than opening a workflow that quietly
  // lost layers.
  for(const n of w.nodes){
    if(!n||(n.type as string)!=='coverage_check')continue;
    const fed=w.edges.filter(e=>e&&e.to===n.id&&isPointPort(e.port));
    if(fed.length>1)throw new Error(`"${(n.params as {label?:string}).label||'Check spatial coverage'}" is a retired `
      +`Check spatial coverage widget holding ${fed.length} point layers. It is replaced by `
      +`"Keep points inside the area", which takes one layer, so this one cannot be rewritten `
      +`automatically. Add one Keep points inside the area per layer, connect each to the study `
      +`area, and send them to the map's point inputs.`);
  }
  w.nodes=w.nodes.map(n=>{
    if(!n||(n.type as string)!=='coverage_check')return n;
    const params=(n as {params?:unknown}).params as {label?:string;exclusions?:Exclusion[]}|undefined||{};
    const carried=Array.isArray(params.exclusions)?params.exclusions:[];
    return {...(n as object),type:'clip_points_to_area' as const,
      params:{label:params.label||'Keep points inside the area',keepBoundary:true,showExcluded:true},
      sourceMigration:{fromType:'coverage_check' as const,version:'1' as const,
        ...(carried.length?{carriedExclusions:structuredClone(carried)}:{})}};
  }) as typeof w.nodes;
  // A coverage check fed its own result to a map through the `coverage` port, which a clip does
  // not have: its points go out the way every other point source's do.
  //
  // AND THE MAP NEEDS ITS AREA. A coverage value carried the study area with it, so a map fed only
  // by a check had no `area` edge of its own; rewriting the port alone left it with points and no
  // boundary, and the run stopped on "Cannot read properties of undefined". The area comes from
  // the same place the clip gets it, which is the only answer that cannot be wrong.
  for(const edge of w.edges){
    if(!edge||edge.port!=='coverage')continue;
    const clip=w.nodes.find(n=>n&&n.id===edge.from&&(n.type as string)==='clip_points_to_area');
    if(!clip)continue;
    edge.port='points';
    const target=w.nodes.find(n=>n&&n.id===edge.to);
    if(target?.type!=='map_output'||w.edges.some(e=>e&&e.to===target.id&&e.port==='area'))continue;
    const area=w.edges.find(e=>e&&e.to===clip.id&&e.port==='area');
    if(area)w.edges.push({id:`${edge.id}-area`,from:area.from,to:target.id,port:'area'});
  }

  // `coverage_check` asked where points stood in relation to the study area and passed every one
  // of them on, labelled. `clip_points_to_area` asks the same question and acts on the answer, and
  // a map draws inside and outside without being asked, so the check was answering a question two
  // other widgets had started answering for it. Retired 2026-10-21 on the practitioner's decision.
  //
  // The spatial half migrates exactly. What does NOT migrate is the review: a coverage check let
  // someone exclude a record by JUDGEMENT, with a written reason pinned to a content signature.
  // Those are findings, not geometry, and the clip has nowhere to put them -- so they travel in
  // the migration stamp and the Inspector says they are inert. Dropping them here would be the
  // silent rewrite that retirement exists to prevent.
  // A check could hold up to eight point layers; a clip holds one. Where it held more, the
  // rewrite would have to invent nodes, so it refuses and names the node instead -- which is the
  // other thing the retirement contract allows, and better than opening a workflow that quietly
  // lost layers.
  for(const n of w.nodes){
    if(!n||(n.type as string)!=='coverage_check')continue;
    const fed=w.edges.filter(e=>e&&e.to===n.id&&isPointPort(e.port));
    if(fed.length>1)throw new Error(`"${(n.params as {label?:string}).label||'Check spatial coverage'}" is a retired `
      +`Check spatial coverage widget holding ${fed.length} point layers. It is replaced by `
      +`"Keep points inside the area", which takes one layer, so this one cannot be rewritten `
      +`automatically. Add one Keep points inside the area per layer, connect each to the study `
      +`area, and send them to the map's point inputs.`);
  }
  w.nodes=w.nodes.map(n=>{
    if(!n||(n.type as string)!=='coverage_check')return n;
    const params=(n as {params?:unknown}).params as {label?:string;exclusions?:Exclusion[]}|undefined||{};
    const carried=Array.isArray(params.exclusions)?params.exclusions:[];
    return {...(n as object),type:'clip_points_to_area' as const,
      params:{label:params.label||'Keep points inside the area',keepBoundary:true,showExcluded:true},
      sourceMigration:{fromType:'coverage_check' as const,version:'1' as const,
        ...(carried.length?{carriedExclusions:structuredClone(carried)}:{})}};
  }) as typeof w.nodes;
  // A coverage check fed its own result to a map through the `coverage` port, which a clip does
  // not have: its points go out the way every other point source's do.
  //
  // AND THE MAP NEEDS ITS AREA. A coverage value carried the study area with it, so a map fed only
  // by a check had no `area` edge of its own; rewriting the port alone left it with points and no
  // boundary, and the run stopped on "Cannot read properties of undefined". The area comes from
  // the same place the clip gets it, which is the only answer that cannot be wrong.
  for(const edge of w.edges){
    if(!edge||edge.port!=='coverage')continue;
    const clip=w.nodes.find(n=>n&&n.id===edge.from&&(n.type as string)==='clip_points_to_area');
    if(!clip)continue;
    edge.port='points';
    const target=w.nodes.find(n=>n&&n.id===edge.to);
    if(target?.type!=='map_output'||w.edges.some(e=>e&&e.to===target.id&&e.port==='area'))continue;
    const area=w.edges.find(e=>e&&e.to===clip.id&&e.port==='area');
    if(area)w.edges.push({id:`${edge.id}-area`,from:area.from,to:target.id,port:'area'});
  }


  // `nearest`'s input ports were renamed from the heat demo's `places`/`centers` to the general
  // `points`/`candidates`. A saved workflow still names the old ones, and an edge whose port no
  // longer exists is refused, so it is rewritten here rather than failing to open.
  const nearestNodes=new Set(w.nodes.filter(n=>n&&n.type==='measure_distance').map(n=>n.id));
  for(const edge of w.edges)
    if(edge&&nearestNodes.has(edge.to)&&(edge.port==='places'||edge.port==='centers'))
      edge.port=edge.port==='places'?'points':'candidates';
  // policy, access_policy and xpert migrated to Apply ruleset with their ruleset pinned until 2026-11-11, when those
  // rulesets retired (docs/audits/old-naledi-audit.md); a saved one is now refused by name, below. Rules written in a
  // workflow that borrowed a retired ruleset's identity as their pin are given their own: the rules are unchanged.
  for(const n of w.nodes){
    const pin=n?.type==='apply_ruleset'?(n.params as {ruleset?:{id:string;version:string}}).ruleset:undefined;
    if(pin&&(n.params as {authored?:unknown}).authored&&RETIRED_RULESETS[pin.id]){pin.id=WRITTEN_IN_WORKFLOW;pin.version='1.0.0';}
  }
  // A rename is not a retirement: the operation is unchanged, so the old identifier keeps
  // resolving and a saved workflow opens and runs rather than being refused. Stamped like every
  // other migration, so a practitioner can see that the file was rewritten on open.
  w.nodes=w.nodes.map(n=>{
    const renamed=n&&RENAMED_NODE_TYPES[n.type as RenamedNodeType];
    return renamed?{...n,type:renamed,sourceMigration:{fromType:n.type as RenamedNodeType,version:'1' as const}}:n;
  }) as typeof w.nodes;
  migrateDeriveValue(w);
  migrateSatelliteSampler(w);
  migrateCollectedPolygons(w);
  migrateComparisonMap(w);
  migrateReproject(w);
  migrateChartSeriesPort(w);
  migrateHealthsitesNodes(w);
  migrateOutputNodes(w);
  migrateGroupTableNulls(w);
  migrateSurveillanceDesign(w);
  // Every migration above has run, so a node still naming a retired widget is one that cannot be
  // migrated — and the practitioner's rule is that such a workflow ceases to work, naming the
  // widget. It used to fail further down as "Incompatible node connection", which told a reader
  // nothing about why a file that opened last week does not open today.
  for(const node of w.nodes){
    const retired=(classification.widgets as {nodeType:string; retired?:boolean}[])
      .find(entry=>entry.nodeType===node?.type&&entry.retired);
    if(retired)throw new Error(`This workflow uses ${TYPES[node.type]?.title||node.type}, which was retired `
      +`and cannot be replaced automatically. Rebuild that step and save the workflow again; `
      +`docs/usage.md lists what replaced each retired widget.`);
  }
  for (const n of w.nodes) {
    // STUDY AREA'S OWN CHECK, which ran through Old Naledi's module until it retired (2026-11-11) and was lost with it:
    // a saved area is drawn or acquired, with a valid shape, or the workflow is refused when it opens.
    if(n.type==='study_area'){
      if((n.params as {source?:string}).source!=='drawn')throw new Error('This study area names a dataset rather than drawing or acquiring its outline. That form retired with Old Naledi on 2026-11-11; draw the area, or pick administrative units.');
      validateAreaParams(n.params);
    }
    validatePrivacyNode(n);
    validatePointComparisonNode(n);
    validateMeanCenterNode(n);
    validateCatchmentNode(n);
    if (!Object.hasOwn(TYPES,n.type) || !/^[a-zA-Z0-9_-]{1,80}$/.test(n.id) || ids.has(n.id)) throw new Error('Invalid or duplicate node.');
    ids.add(n.id);
    if (![n.x,n.y].every(Number.isFinite) || Math.abs(n.x)>10000 || Math.abs(n.y)>10000 || !n.params) throw new Error('Invalid node position or parameters.');
    if((n.type==='study_area'||n.type==='point_input'||n.type==='places'||n.type==='centers')){n.params.spatialReference??=defaultSpatialReference();validateSpatialReference(n.params.spatialReference);}
    // OPENSTREETMAP UNLESS SOMEBODY CHOSE OTHERWISE (the practitioner, 2026-11-10: "The default should be OSM"). Stated on
    // the step, so every reader of it agrees; "none", chosen, is kept. Where tiles cannot be fetched the figure says so.
    if(n.type==='map_output'&&(n.params as {basemap?:string}).basemap===undefined)(n.params as {basemap?:string}).basemap=DEFAULT_BASEMAP;
    if(n.type==='study_area'){const listed=(n.params as {countries?:unknown}).countries;
      if(listed!==undefined&&(!Array.isArray(listed)||listed.length>30||listed.some(c=>typeof c!=='string'||!/^[A-Z]{3}$/.test(c))))
        throw new Error('A study area\'s countries are ISO 3166 three-letter codes, up to 30.');
      const named=(n.params as {unitName?:unknown}).unitName;
      if(named!==undefined&&(typeof named!=='string'||named.length>60))throw new Error('What a study area\'s units are called is a word or two, up to 60 characters.');}
    if ((n.type==='places'||n.type==='centers'||n.type==='point_input')) n.params.data=validateGeoJSON(n.params.data,{attributes:n.type==='point_input'});
    if(n.type==='summarize_hull')validateHullNode(n);
    if(n.type==='summarize_combined_area')validateCombinedAreaNode(n);
    if(n.type==='snap_to_network')validateSnapNode(n);
    if(n.type==='reachable_nodes')validateReachNode(n);
    if(n.type==='reachable_corridor')validateCorridorNode(n);
    if(n.type==='travel_time_band')validateBandNode(n);
    if(n.type==='fill_interior_gaps')validateFillNode(n);
    if(n.type==='apply_ruleset'){
      const r=n.params.ruleset;
      // An UNCHOSEN ruleset is allowed to exist and refused at run time, which is how a drawn
      // study area with no boundary already behaves. The practitioner adds one widget and says
      // what it should do; offering a palette entry per ruleset instead made the palette grow
      // with every ruleset AND every version of one, since old versions stay bundled so saved
      // pins resolve -- four rulesets were showing as seven entries. Their decision, 2026-10-14.
      if(r===undefined)continue;
      if(!r||!/^urn:fieldwork:ruleset:[a-z0-9-]+$/.test(r.id||'')||!/^\d+\.\d+\.\d+$/.test(r.version||''))
        throw new Error('A rule application names a ruleset by id and version. A rule change changes results, so the version is pinned.');
      if(!Array.isArray(r.inputs)||!r.inputs.length||!r.output)
        throw new Error(`${r.title||r.id} pins no ports, so nothing could connect to it.`);
      // Resolving it here is what makes a workflow naming a ruleset this build does not carry
      // refuse to open, by name, rather than failing somewhere inside the executor.
      // Rules written in the workflow are not a published ruleset, so there is nothing to resolve (2026-11-11).
      const ruleset=n.params.authored&&r.id===WRITTEN_IN_WORKFLOW?{parameters:[],title:''} as unknown as ReturnType<typeof resolveRuleset>:resolveRuleset(r.id,r.version);
      // A node carrying authored rules is held to ITS OWN declaration. The pin gives such a node
      // its ports and says nothing about rules the practitioner wrote, so checking their values
      // against the pinned artefact's parameters refused a step whose rules use none.
      const declared=n.params.authored
        ?(n.params.authored.parameters??[]).map(p=>({name:p.name,meaning:p.meaning,min:p.min,max:p.max}))
        :ruleset.parameters;
      const title=n.params.authored?n.params.authored.title:ruleset.title;
      for(const parameter of declared){
        const value=n.params.parameters?.[parameter.name];
        if(!Number.isFinite(value))throw new Error(`${title} needs a value for ${parameter.name}: ${parameter.meaning}`);
        if((parameter.min!==undefined&&value<parameter.min)||(parameter.max!==undefined&&value>parameter.max))
          throw new Error(`${parameter.name} must be between ${parameter.min} and ${parameter.max}.`);
      }
    }
    if(n.type==='find_health_facilities')validateFindHealthFacilitiesNode(n);
    if(n.type==='buffer_point')validateBufferPointNode(n);
    if(n.type==='sample_raster')validateSampleNode(n);
    validateSeaLevelNode(n);
    validateCaseSeriesNode(n);
    validateRateNode(n);
    if(n.type==='map_image_input'){
      const p=n.params;
      if(p.data!==undefined&&typeof p.data!=='string')throw new Error('A map image is carried as a data URI.');
      // HOW IT WAS PLACED (experiment 201): a world file of six finite numbers, and the matched points behind it.
      if(p.placement!==undefined&&p.placement!=='world-file'&&p.placement!=='points')throw new Error('Invalid map image placement.');
      if(p.world!==undefined&&!(['xScale','ySkew','xSkew','yScale','xOrigin','yOrigin'] as const).every(k=>Number.isFinite(p.world![k])))
        throw new Error('A map image\'s placement is six numbers.');
      if(p.placementModel!==undefined&&p.placementModel!=='north-up'&&p.placementModel!=='affine'&&p.placementModel!=='shift')throw new Error('Invalid placement model.');
      // WHERE THE FILE'S OWN TAGS PUT IT (TODO 35), kept beside the placement it was moved to.
      if(p.tagsWorld!==undefined&&!(['xScale','ySkew','xSkew','yScale','xOrigin','yOrigin'] as const).every(k=>Number.isFinite(p.tagsWorld![k])))
        throw new Error('The file\'s own placement is six numbers.');
      if(p.tagsSaid!==undefined&&(typeof p.tagsSaid!=='string'||p.tagsSaid.length>300))throw new Error('What the file says of its placement is a short sentence.');
      if((p.tagsGeographic!==undefined&&(typeof p.tagsGeographic!=='string'||!/^\+proj=longlat [ -~]{0,200}$/.test(p.tagsGeographic)))
        ||(p.tagsDatum!==undefined&&(typeof p.tagsDatum!=='string'||p.tagsDatum.length>120)))throw new Error('The file\'s datum is a short definition.');
      if(p.controlPoints!==undefined&&(!Array.isArray(p.controlPoints)||p.controlPoints.length>100||p.controlPoints.some(c=>
        typeof c?.id!=='string'||c.id.length>120||!Array.isArray(c.pixel)||!Array.isArray(c.lonlat)
        ||![...c.pixel,...c.lonlat].every(Number.isFinite)||Math.abs(c.lonlat[0])>180||Math.abs(c.lonlat[1])>90)))
        throw new Error('A matched point is a name, a pixel position and a longitude and latitude.');
      if(p.guide!==undefined&&(!Array.isArray(p.guide)||p.guide.length>20||p.guide.some(g=>
        typeof g?.id!=='string'||g.id.length>120||typeof g.why!=='string'||g.why.length>600
        ||!Array.isArray(g.pixel)||!Array.isArray(g.lonlat)||![...g.pixel,...g.lonlat,g.radiusPx,g.radiusM].every(Number.isFinite)
        ||!(g.radiusPx>0)||!(g.radiusM>0)||Math.abs(g.lonlat[0])>180||Math.abs(g.lonlat[1])>90)))
        throw new Error('A guide point is a feature, why it was chosen, and where it is on the image and the map, each with a radius.');
      // Served beside the application, never fetched from elsewhere: a worked example's file, not a link.
      // Or a file a curated example repository pins, fetched by its digest (2026-11-13). One of the two, never both.
      const builtIn=typeof p.offered?.url==='string'&&/^\.\/examples\/[a-z0-9-]+\/[a-z0-9._-]+\.(jpg|png)$/.test(p.offered.url);
      const pinned=typeof p.offered?.from?.example==='string'&&/^urn:fieldwork:example:[a-z0-9-]+$/.test(p.offered.from.example)
        &&typeof p.offered.from.path==='string'&&/^[a-z0-9][a-z0-9/._-]*\.(jpg|png)$/.test(p.offered.from.path)&&!p.offered.from.path.includes('..');
      if(p.offered!==undefined&&(builtIn===pinned
        ||typeof p.offered.filename!=='string'||p.offered.filename.length>200||typeof p.offered.credit!=='string'||p.offered.credit.length>600
        ||(p.offered.width!==undefined&&!(Number.isInteger(p.offered.width)&&p.offered.width>0))||(p.offered.height!==undefined&&!(Number.isInteger(p.offered.height)&&p.offered.height>0))))
        throw new Error('An offered image is a file served with this application under examples/, or one a curated example pins, with its credit.');
      // AN UNCONFIGURED PLATE IS A DRAFT, NOT A BAD ONE. A node added from the palette carries
      // `[0,0,0,0]` because nobody has chosen an image yet, and until 2026-10-27 that tripped the
      // crossed-corners check: the widget could be offered and could not be added, which is what
      // `palette-add` reported as "could not be added as a draft". A study area with no boundary
      // has always been allowed to sit on a canvas unconfigured, and this is the same state.
      // The corners are checked once there is an image to place, and `mapImage` refuses at run
      // time regardless, so nothing reaches a figure unchecked.
      const placed=typeof p.data==='string'&&p.data.startsWith('data:');
      const unset=Array.isArray(p.bounds)&&p.bounds.every(v=>v===0);
      if(p.bounds!==undefined&&!(unset&&!placed)){
        if(!Array.isArray(p.bounds)||p.bounds.length!==4||!p.bounds.every(v=>typeof v==='number'&&Number.isFinite(v)))
          throw new Error('A map image needs four finite corners: west, south, east, north.');
        const [west,south,east,north]=p.bounds;
        if(!(east>west)||!(north>south))
          throw new Error('A map image\'s extent runs west to east and south to north. These corners cross.');
      }
      if(p.opacity!==undefined&&(typeof p.opacity!=='number'||p.opacity<0||p.opacity>1))
        throw new Error('A map image\'s opacity is between 0 and 1.');
    }
    if(n.type==='table_input'){
      const t=n.params.data;
      if(!t||t.kind!=='data-table'||!Array.isArray(t.rows))throw new Error('Tabular input holds no table. Import a CSV.');
      // CONVERTING ON RUN NEEDS SOMETHING TO CONVERT, and a declaration of how. The stored table
      // may then be empty -- it is recomputed on every run -- so this is checked here rather than
      // inside the `t.rows.length` branch below, which a converting node legitimately skips.
      if(n.params.convertOnRun){
        const source=n.params.sourceTable;
        if(!source||!Array.isArray(source.headers)||!source.headers.length
          ||!Array.isArray(source.rows)||!source.rows.length)
          throw new Error('This tabular input is set to convert its source on each run and carries no source table.');
        if(!n.params.wide)
          throw new Error('This tabular input is set to convert its source on each run and does not say which columns to take.');
        for(const name of [...n.params.wide.keys,...n.params.wide.valueFields])
          if(!source.headers.map(h=>h.trim()).includes(name))
            throw new Error(`The source table has no column named ${JSON.stringify(name)}, which the conversion asks for.`);
      }
      // An unconfigured node is a valid draft, as a Reproject node without a file is; the
      // contract is checked once a table exists, and execution refuses to run without one.
      if(t.rows.length){
        if(!Array.isArray(n.params.keys)||!n.params.keys.length)throw new Error('Tabular input needs at least one key column.');
        if(typeof n.params.valueField!=='string'||!n.params.valueField)throw new Error('Tabular input needs a value column.');
        if(t.keys.join('\u0000')!==n.params.keys.join('\u0000')||t.valueField!==n.params.valueField)throw new Error('The saved table does not match its declared key and value columns.');
        // THE WIDE SELECTION, checked against the table it claims to have produced. A wide file
        // melts to keys = [...subject keys, measureKey], so the two descriptions are redundant
        // and therefore checkable: a `wide` block that disagrees with `keys` is a receipt that
        // would cite columns this table was not built from.
        const wide=n.params.wide;
        if(wide!==undefined){
          if(!Array.isArray(wide.keys)||!wide.keys.length||!wide.keys.every(k=>typeof k==='string'&&k))
            throw new Error('A wide table input needs the subject key columns it was read with.');
          if(!Array.isArray(wide.valueFields)||!wide.valueFields.length||!wide.valueFields.every(k=>typeof k==='string'&&k))
            throw new Error('A wide table input needs the value columns it was read with.');
          if(typeof wide.measureKey!=='string'||!wide.measureKey)
            throw new Error('A wide table input needs the name of the column holding the variable names.');
          if([...wide.keys,wide.measureKey].join('\u0000')!==n.params.keys.join('\u0000'))
            throw new Error('The wide selection does not describe this table: its subject keys and '
              +'measure column must together be the table\'s key columns.');
          if(new Set(wide.valueFields).size!==wide.valueFields.length)
            throw new Error('The value columns a wide table was read with must be distinct.');
          // The same refusals the melt makes, made here too, so a saved workflow carrying a bad
          // rename is refused when it opens rather than when somebody runs it.
          if(wide.measureNames!==undefined){
            if(typeof wide.measureNames!=='object'||wide.measureNames===null||Array.isArray(wide.measureNames))
              throw new Error('Measure names are given per column, as a column-to-name mapping.');
            for(const [column,measure] of Object.entries(wide.measureNames)){
              if(typeof measure!=='string'||!measure.trim())
                throw new Error(`${JSON.stringify(column)} is given an empty measure name.`);
              if(!wide.valueFields.includes(column))
                throw new Error(`${JSON.stringify(column)} is named as a measure but is not one of `
                  +'the value columns being melted.');
            }
            const named=wide.valueFields.map(c=>wide.measureNames?.[c]?.trim()||c);
            if(new Set(named).size!==named.length)
              throw new Error('Two value columns would share a measure name. Each measure names '
                +'one variable.');
          }
        }
      }
      if(t.rows.length>MAX_TABLE_ROWS)throw new Error(`Tabular input supports at most ${MAX_TABLE_ROWS.toLocaleString()} rows.`);
    }
    // Reproject stores the already-converted CRS84 collection, so it is validated as geographic here.
    if(n.type==='point_input'&&n.params.fromTable!==undefined){const m=n.params.fromTable as unknown as Record<string,unknown>;if(!m||typeof m.x!=='string'||typeof m.y!=='string'||['id','name'].some(k=>m[k]!==undefined&&typeof m[k]!=='string'))throw new Error('A table mapping names its x (longitude) and y (latitude) columns as text.');}
    if(n.type==='point_input'){validateAttributeSchema(n.params.data,n.params.fields,n.params.attributeRules);if(n.params.pinIdStrategy!==undefined&&!['sequential','uuid'].includes(n.params.pinIdStrategy))throw new Error('Choose sequential or UUID identifiers for new pins.');
      // A PIN'S PHOTOS are read back as what they can be, and nothing else (experiment 09, 2026-11-22).
      if(n.params.pinPhotos!==undefined){const photos=readPinPhotos(n.params.pinPhotos);if(photos)n.params.pinPhotos=photos;else delete n.params.pinPhotos;}}
    if((n.type==='map_output'||n.type==='table_output')&&n.params.inputMode!==undefined&&!(n.type==='map_output'?['spatial','decisions','raster','polygons','network']:['spatial','decisions','polygons','table']).includes(n.params.inputMode))throw new Error('Choose spatial inputs or reasoning results.');
    if(n.type==='map_output'&&((n.params.presentation!==undefined&&!['plot','interactive'].includes(n.params.presentation))||(n.params.contextPoints!==undefined&&typeof n.params.contextPoints!=='boolean')))throw new Error('Invalid polygon map presentation.');
    // The subtitle and source-note limits were raised on 2026-10-13, measured against the first
    // figures configured for an outside reader: the Snow subtitles need 176 and 200 characters to
    // say what the figure shows AND what it does not claim, and a full citation with its licence
    // runs to 253. The title stays at 120, because something longer than that is not a title.
    if(n.type==='map_output'&&((n.params.showLegend!==undefined&&typeof n.params.showLegend!=='boolean')||(n.params.basemap!==undefined&&!(BASEMAP_CHOICES as readonly string[]).includes(n.params.basemap))||(['mapTitle','mapSubtitle','mapSourceNote'] as const).some(key=>n.params[key]!==undefined&&(typeof n.params[key]!=='string'||n.params[key]!.length>({mapTitle:120,mapSubtitle:280,mapSourceNote:500}[key])))))throw new Error('Invalid map presentation settings.');
    if(n.type==='chart_output'&&n.params.inputMode!==undefined&&!['decisions','polygons'].includes(n.params.inputMode))throw new Error('Invalid chart input mode.');
    if(n.type==='chart_output'&&n.params.bandMeasure!==undefined&&!['cumulative','difference'].includes(n.params.bandMeasure))throw new Error('Choose cumulative band counts or the difference between neighbouring bands.');
    // A difference is computed by the Vega-Lite specification, so it needs that renderer.
    if(n.type==='chart_output'&&n.params.bandMeasure==='difference'&&chartRenderer(n.params)!=='vega-lite')throw new Error('Band differences are computed in the Vega-Lite specification, so select the Vega-Lite renderer.');
    if(n.type==='chart_output'&&((n.params.renderer!==undefined&&!['html','vega-lite'].includes(n.params.renderer))||(n.params.mark!==undefined&&!['bar','point','line'].includes(n.params.mark))||(n.params.orientation!==undefined&&!['horizontal','vertical'].includes(n.params.orientation))))throw new Error('Choose a supported chart renderer, mark and orientation.');
    // Vertical is no longer gated on the renderer. The classic bars have always had a column branch
    // and the series default has always reached it, so refusing a practitioner who states the same
    // value explicitly was incoherent -- and from 2026-10-13 vertical is the default for every bar
    // chart, which would have made the default unstatable. The point mark stays gated: the HTML
    // renderer draws bars and has nothing to draw a dot with.
    if(n.type==='chart_output'&&n.params.markedDates!==undefined&&(!Array.isArray(n.params.markedDates)||n.params.markedDates.length>10
      ||n.params.markedDates.some(m=>typeof m?.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(m.date)||typeof m.label!=='string'||m.label.length>80)))
      throw new Error('A marked date is a day, YYYY-MM-DD, with a label of at most 80 characters; at most ten to a chart.');
    if(n.type==='chart_output'&&chartRenderer(n.params)!=='vega-lite'&&(n.params.mark==='point'||n.params.mark==='line'))throw new Error('Dots and a line need the enhanced renderer; the classic bars draw bars.');
    if(n.type==='chart_output'){
      // Raised to match the map's on 2026-10-13, and for the same reason: a chart subtitle does the
      // same job as a map's -- state what the figure shows and what it does not claim -- and the
      // epidemic curve needs 187 characters to say that date of death is not date of onset. The
      // axis titles stay at 80, which is already generous for an axis.
      for(const [key,limit] of Object.entries({chartTitle:120,subtitle:280,xAxisTitle:80,yAxisTitle:80,sourceNote:500})){const value=n.params[key as keyof typeof n.params];if(value!==undefined&&(typeof value!=='string'||value.length>limit))throw new Error(`Chart ${key} must be text of at most ${limit} characters.`);}
      if(n.params.colorByCategory!==undefined&&typeof n.params.colorByCategory!=='boolean')throw new Error('Chart legend setting must be true or false.');
    }
    if(n.type==='clip_raster'&&n.params.cutline!==undefined){if(!n.params.cutline||!['bbox','polygon'].includes(n.params.cutline.selectionMode))throw new Error('Invalid clip boundary settings.');validateDrawnGeometry(n.params.cutline.geometry);}
    if(n.type==='raster_input'||n.type==='clip_raster'){if(typeof n.params.label!=='string'||!n.params.label.trim()||n.params.label.length>60)throw new Error('Raster node names require 1-60 characters.');if(n.type==='raster_input'&&n.params.asset)validateRasterAsset(n.params.asset);if(n.type==='clip_raster'){if(!n.params.method)throw new Error('Choose a raster mask method.');validateClipOptions(n.params);}}
    if(n.type==='map_terms_to_vocabulary'){
      if(typeof n.params.column!=='string')throw new Error('Choose the column whose terms are linked.');
      if(n.params.linkColumn!==undefined&&(typeof n.params.linkColumn!=='string'||n.params.linkColumn.length>60))
        throw new Error('The column the links go into needs a name of at most 60 characters.');
      if(n.params.decisions!==undefined&&(typeof n.params.decisions!=='object'||n.params.decisions===null))
        throw new Error('The Wikidata choices are kept as a set of terms and what each one names.');
      for(const [term,d] of Object.entries(n.params.decisions??{})){
        if(d===null)continue;
        if(typeof d!=='object'||!/^Q\d+$/.test(String((d as {qid?:string}).qid)))
          throw new Error(`The Wikidata choice for "${term}" is not an entity identifier.`);
      }
    }
    // TRAVEL TIME OVER GROUND (experiment 231): the attribute name and the ceiling, checked here rather than inside
    // the walk, so a draft is refused before a surface is read.
    if(n.type==='travel_over_ground'){
      if(typeof n.params.attribute!=='string'||!n.params.attribute.trim()||n.params.attribute.length>60)
        throw new Error('Name the column the travel time is written into, in 1 to 60 characters.');
      if(n.params.maxMinutes!==undefined&&(typeof n.params.maxMinutes!=='number'||!Number.isFinite(n.params.maxMinutes)||n.params.maxMinutes<=0))
        throw new Error('A travel time ceiling must be a number of minutes greater than zero, or left unset for no ceiling.');
    }
    if (n.type==='output') {
      n.params.view ??= 'map';
      if (!['map','table','bars'].includes(n.params.view)) throw new Error('Visual outputs must use a map, table, or bar chart.');
      if (n.params.label !== undefined && (typeof n.params.label!=='string' || n.params.label.length>60)) throw new Error('Output names must be text of at most 60 characters.');
    }
    if (n.type==='point_grid' && (!Number.isFinite(n.params.spacingM) || n.params.spacingM<150 || n.params.spacingM>1000)) throw new Error('spacingM must be between 150 and 1000.');
    if (n.type==='policy' && (!Number.isFinite(n.params.thresholdKm) || n.params.thresholdKm<0 || n.params.thresholdKm>1000)) throw new Error('Distance threshold must be between 0 and 1,000 km.');
    if (n.type==='alert' && (![true,false,null].includes(n.params.active) || !/^\d{4}-\d{2}-\d{2}$/.test(n.params.date) || !Number.isFinite(Date.parse(n.params.date)) || new Date(n.params.date).toISOString().slice(0,10)!==n.params.date)) throw new Error('Invalid heat alert or assessment date.');
    if(n.type==='measure_area')validateAreaUnit(n.params.unit);
    if(n.type==='line_input'){if(typeof n.params.label!=='string'||!n.params.label.trim()||n.params.label.length>100)throw new Error('Name the line layer using 1–100 characters.');
      if(!['file','border','drawn'].includes(n.params.inputMethod))throw new Error('A line layer is read from a file, taken from two study areas\' border, or drawn on a map.');
      if(n.params.toleranceM!==undefined&&!(n.params.toleranceM>0&&n.params.toleranceM<=10_000))throw new Error('The distance within which two outlines count as one border is more than 0 m and at most 10 km.');}
    if(n.type==='detect_unusual_counts'){if(typeof n.params.label!=='string'||!n.params.label.trim()||n.params.label.length>100)throw new Error('Name the detection using 1–100 characters.');detectSettings(n.params);}
    if(n.type==='append_rows'&&n.params.tableCount!==undefined&&(!Number.isInteger(n.params.tableCount)||n.params.tableCount<2))throw new Error('Append rows stacks two tables or more.');
    if((n.type==='map_output'||n.type==='table_output'||n.type==='deduplicate_points')&&n.params.pointInputCount!==undefined&&(!Number.isInteger(n.params.pointInputCount)||n.params.pointInputCount<1||n.params.pointInputCount>MAX_POINT_LAYERS))throw new Error(`Use 1–${MAX_POINT_LAYERS} point input ports.`);
    if(n.type==='space_time_scan')validateScanParams(n.params as never);
    // THE ARRANGEMENT AND THE POLYGON INPUTS, checked as they arrive (Map's manual, History: panels; Collect polygon layers retired).
    if((n.type==='point_input'||n.type==='table_input')&&(n.params as {edits?:unknown}).edits!==undefined&&!validEdits((n.params as {edits?:unknown}).edits))
      throw new Error('Edits made in Data quality are a record, a column, the value read and the value written; at most 2,000 to a step.');
    if(n.type==='map_output'&&n.params.groundInputCount!==undefined&&!(Number.isInteger(n.params.groundInputCount)&&n.params.groundInputCount>=1&&n.params.groundInputCount<=MAX_GROUND_LAYERS))
      throw new Error(`A map draws between 1 and ${MAX_GROUND_LAYERS} map images as ground.`);
    if(n.type==='map_output'&&n.params.rasterInputCount!==undefined&&!(Number.isInteger(n.params.rasterInputCount)&&n.params.rasterInputCount>=1&&n.params.rasterInputCount<=MAX_RASTER_LAYERS))
      throw new Error(`A map takes 1 to ${MAX_RASTER_LAYERS} rasters.`);
    if(n.type==='map_output'&&n.params.leftOutAreas!==undefined&&!(Array.isArray(n.params.leftOutAreas)&&n.params.leftOutAreas.length<=50&&n.params.leftOutAreas.every(a=>typeof a==='string'&&a.length<=120)))throw new Error('Name the study areas left out of the map as a list.');
    if(n.type==='map_output'&&n.params.polygonInputCount!==undefined&&!(Number.isInteger(n.params.polygonInputCount)&&n.params.polygonInputCount>=1&&n.params.polygonInputCount<=MAX_POLYGON_LAYERS))
      throw new Error(`A map takes 1 to ${MAX_POLYGON_LAYERS} polygon layers.`);
    if(n.type==='map_output'&&n.params.rasterShading!==undefined&&!validRasterShading(n.params.rasterShading))
      throw new Error('A map\u2019s raster panels show a count per km² or the cell value, in YlOrRd or viridis, in quantile classes or equal steps.');
    if(n.type==='map_output'&&n.params.arrangement!==undefined){const a=n.params.arrangement;
      if(!['row','grid','column'].includes(a?.grid)||!Array.isArray(a.panels)||a.panels.length<1||a.panels.length>MAX_POLYGON_LAYERS
        ||a.panels.some(p=>typeof p?.layer!=='string'||!p.layer.trim()||p.layer.length>120||(p.title!==undefined&&(typeof p.title!=='string'||p.title.length>120))))
        throw new Error('A map\u2019s panels are 1 to 6 layers by name, each with an optional title, in a row, two by two or a column.');}
    if(n.type==='map_output'&&n.params.linkField!==undefined){
      if(typeof n.params.linkField!=='object'||n.params.linkField===null)throw new Error('Invalid map line settings.');
      for(const [source,l] of Object.entries(n.params.linkField)){
        // "Found by" may be blank while it is being chosen: Run says what is missing, so the choice is never lost.
        if(!source||typeof l?.column!=='string'||!l.column.trim()||l.column.length>200||typeof l.matches!=='string'||l.matches.length>200)
          throw new Error('Invalid map line settings.');
      }
    }
    if(n.type==='table_output'&&n.params.presentation!==undefined)validatePresentation(n.params.presentation);
    if((n.type==='map_output'||n.type==='table_output'||n.type==='chart_output')&&(typeof n.params.label!=='string'||!n.params.label.trim()||n.params.label.length>60))throw new Error(`${TYPES[n.type].title} names must be text of 1–60 characters.`);
  }
  const edgeIds=new Set(), ports=new Set();
  for (const e of w.edges) {
    if (typeof e.id!=='string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(e.id) || edgeIds.has(e.id)) throw new Error('Invalid or duplicate connector ID.');
    edgeIds.add(e.id);
    const a=w.nodes.find(n=>n.id===e.from),b=w.nodes.find(n=>n.id===e.to);
    if (!a || !b || a.id===b.id || !outputOf(a) || !portAccepts(nodeInputs(b).find(([p])=>p===e.port)?.[1],outputOf(a))) throw new Error('Incompatible node connection.');
    const key=`${e.to}:${e.port}`;
    if (ports.has(key)) throw new Error('Each input port accepts one connection.');
    ports.add(key);
  }
  for(const n of w.nodes.filter(n=>n.type==='compare_point_sets')){const sources=w.edges.filter(e=>e.to===n.id).map(e=>e.from);if(new Set(sources).size!==sources.length)throw new Error('Compare point sets needs distinct original, moved, and pump sources.');}
  for(const n of w.nodes.filter(n=>n.type==='compare_point_sets'&&n.params.centers))for(const [pointPort,centerPort] of [['original','originalCenter'],['moved','movedCenter']]){
    const point=w.edges.find(e=>e.to===n.id&&e.port===pointPort)?.from,center=w.edges.find(e=>e.to===n.id&&e.port===centerPort)?.from;
    if(!point||!center)continue;
    if(w.nodes.find(x=>x.id===center)?.type!=='mean_center'||!w.edges.some(e=>e.to===center&&e.port==='points'&&e.from===point))throw new Error('Each Mean center must use the same point source as its comparison branch.');
  }
  const visited=new Set(), stack=new Set();
  for(const n of w.nodes.filter(n=>(n.type==='map_output'||n.type==='table_output'||n.type==='deduplicate_points'))){const sources=w.edges.filter(e=>e.to===n.id&&isPointPort(e.port)).map(e=>e.from);if(new Set(sources).size!==sources.length)throw new Error('Connect each point source once per operation.');}
  function visit(id:string) {if(stack.has(id)) throw new Error('Workflow cycles are not supported. Keep inference inside the rule node.');if(visited.has(id))return;stack.add(id);w.edges.filter(e=>e.to===id).forEach(e=>visit(e.from));stack.delete(id);visited.add(id);}
  w.nodes.forEach(n=>visit(n.id));
  if(w.outputId && !w.nodes.some(n=>n.id===w.outputId && ['output','map_output','table_output','chart_output','comparison_map'].includes(n.type))) throw new Error('Selected output does not exist.');
  projectFiles(w);
  if(w.manifest)syncProjectManifest(w);
  return w;
}
/** Nodes the plan is built backwards from. A node with no output that nothing consumes is
 *  invisible to the walk, so a terminal node must be named here or it never runs. */
/** STEPS UNDER CONSTRUCTION, computed when their inputs are complete (experiment 182). A run computed only the steps an
 *  output needs, so a join chained after another join could not be set up: its preview needs the first join's table,
 *  and nothing displayed that table yet. These are the steps that lead to no output and have every required input
 *  connected, with whatever above them the run does not already make, in an order that computes inputs first. They
 *  are optional: one that fails is marked failed and named, and the run goes on, since nothing displayed depends on it. */
export function openEnds(w:Workflow,planned:readonly WorkflowNode[]):WorkflowNode[]{
  const have=new Set(planned.map(n=>n.id)),outputs=new Set(resultNodes(w).map(n=>n.id));
  const feeds=new Set(w.edges.map(e=>e.from));
  const order:WorkflowNode[]=[];
  for(const end of w.nodes){
    if(have.has(end.id)||feeds.has(end.id)||outputs.has(end.id))continue;
    const closure:WorkflowNode[]=[],seen=new Set<string>();let complete=true;
    const visit=(node:WorkflowNode)=>{
      if(seen.has(node.id)||have.has(node.id)||!complete)return;seen.add(node.id);
      for(const [port] of requiredInputs(node)){
        if(node.type==='network_input'&&port==='area')continue;
        if(!w.edges.some(e=>e.to===node.id&&e.port===port)){complete=false;return;}
      }
      for(const e of w.edges.filter(e=>e.to===node.id)){const up=w.nodes.find(n=>n.id===e.from);if(up)visit(up);}
      closure.push(node);
    };
    visit(end);
    if(complete)for(const node of closure)if(!have.has(node.id)){have.add(node.id);order.push(node);}
  }
  return order;
}
function resultNodes(w:Pick<Workflow,'nodes'>){return w.nodes.filter(n=>['output','measure_area','coverage_check','map_output','table_output','chart_output','comparison_map'].includes(n.type));}
/** A workflow that is NOT FINISHED, which is not a workflow that went wrong.
 *
 *  The practitioner, 2026-10-20, on a red failure toast over a canvas holding a study area and a
 *  street network: *"There is an error toast which does not seem to be an error. The lack of an
 *  output is not an error, it's an incomplete workflow."* Right, and the difference is not
 *  cosmetic: a failure says something broke and invites a bug report, while an unfinished workflow
 *  is the ordinary state of a canvas halfway through being built. The refusals that mean "add the
 *  next thing" carry this type, and the interface reads it rather than inferring tone from the
 *  fact that something was thrown. */
/** A WORKFLOW THAT CANNOT RUN YET, said with the step it is about (2026-11-20), so the message can offer to show it. */
export class IncompleteWorkflow extends Error {constructor(message:string,readonly nodeId?:string){super(message);}}
/** A port in words: Append rows' tables by their order, as its dialog names them; any other by its name. */
function portWords(node:WorkflowNode,port:string):string{
  const nth=port==='records'?1:Number(/^records_(\d+)$/.exec(port)?.[1]??0);
  if(node.type==='append_rows'&&nth)return `${['first','second','third','fourth','fifth','sixth','seventh','eighth'][nth-1]??`table ${nth}`} table`;
  return `${port.replace(/_/g,' ')} input`;
}

export function executionPlan(workflow:Workflow) {
  const w=validateWorkflow(workflow), outputs=resultNodes(w);
  if(!outputs.length){
    // Two different situations shared one sentence, so the one that fires most said the wrong
    // thing. A canvas holding a Study area and a Street network was told to "start with a Study
    // area node" -- advice it had already taken. The practitioner, 2026-10-19: *"note error
    // message, there is already a study area."* The study-area clause describes an EXEMPTION, not
    // a step: a canvas of nothing but study areas runs without an output so its N3 can be read.
    if(!w.nodes.length)
      throw new IncompleteWorkflow('This canvas is empty. Add an input to start \u2014 a Study area, Point data, '
        +'Tabular data or a Street network.');
    if(!w.nodes.every(n=>n.type==='study_area'))
      throw new IncompleteWorkflow(`Nothing here displays a result, so there is nothing for a run to produce. `
        +`This workflow holds ${[...new Set(w.nodes.map(n=>TYPES[n.type]?.title??n.type))].join(', ')}. `
        +`Add a Map, Table or Chart output and connect it to the step whose result you want to see. `
        +`(A canvas holding only Study area nodes is the exception: it runs without an output, so its `
        +`N3 facts can be inspected.)`);
    outputs.push(...w.nodes);
  }
  // THE AREA NAMED (2026-11-22): with four study areas on the canvas, "Select a study area" did not say which one was empty.
  {const empty=w.nodes.filter(n=>n.type==='study_area'&&n.params.source==='drawn'&&!n.params.geometry).map(n=>`"${n.params.label||'Study area'}"`);
   if(empty.length)throw new IncompleteWorkflow(`${empty.join(', ')} ${empty.length===1?'has':'have'} no area yet. Select ${empty.length===1?'it':'each'} on the map before running.`);}
  // Same shape as the line above: a node may be on the canvas before it has been told what to do,
  // and the refusal names the node rather than the type, because a workflow can hold several.
  for(const n of w.nodes)if(n.type==='apply_ruleset'&&!n.params.ruleset)
    throw new IncompleteWorkflow(`Choose a ruleset for "${n.params.label||n.id}" before running. It decides what the step classifies and which inputs it takes.`);
  const result:WorkflowNode[]=[], done=new Set<string>();
  function visit(node:WorkflowNode) {if(done.has(node.id))return;const inputs=requiredInputs(node);for(const [port] of inputs){if(node.type==='network_input'&&port==='area'&&!w.edges.some(e=>e.to===node.id&&e.port==='area'))continue;
      // The area is optional here: a country names the scope instead. Required only when the
      // practitioner has asked for the study area to bound the request.
      const e=w.edges.find(e=>e.to===node.id && e.port===port);if(!e)throw new IncompleteWorkflow(`${node.params.label&&node.params.label!==TYPES[node.type].title?`"${node.params.label}" (${TYPES[node.type].title})`:TYPES[node.type].title} needs its ${portWords(node,port)} connected.`,node.id);visit(required(w.nodes.find(n=>n.id===e.from)));}
      // Everything else actually wired, so the plan follows the EDGES and not only the ports a
      // node insists on. A map insists on nothing from 2026-10-15 -- it draws the layers it is
      // given -- and ordering by required ports alone put it in the plan BEFORE its own sources,
      // so it read an undefined value and failed on a shape it had not been handed yet. Required
      // ports still decide what is REFUSED; they were never the right thing to order by.
      for(const e of w.edges.filter(e=>e.to===node.id))visit(required(w.nodes.find(n=>n.id===e.from)));
      done.add(node.id);result.push(node);}
  outputs.forEach(visit);
  // One RUN, one projection. Nine widgets project to metres and each carries its own zone, with
  // nothing requiring them to agree -- and two plausible zones differ by 0.58% on the same points.
  //
  // This belongs here and not in validateWorkflow, which runs on every edit. Put there on
  // 2026-10-13 it made all eight metric widgets unaddable: unconfigured drafts carry whatever
  // default zone their branch supplies, so the second one added to a canvas disagreed with the
  // first, validation threw, change() rolled the workflow back and the canvas appeared to ignore
  // the click. That is the failure experiment 48 recorded and tests/palette-add.browser.mjs
  // exists to catch; it caught it. Measured against the nodes in the PLAN rather than the whole
  // workflow, because a draft sitting unconnected on the canvas is not part of this run and has
  // no business refusing it.
  workflowMetricCRS({...w,nodes:result});
  return result;
}
// Moved to src/nearest-neighbour.ts, beside the search that uses it, and re-exported so every
// existing caller is unaffected. See that file for what a sphere costs against an ellipsoid.
export {distanceKm};
/** The distance from each point to the nearest of a set of candidates, in the stated unit.
 *
 *  Given a point and a set of points, the distance to the nearest candidate: that is the whole
 *  operation, and the unit is a parameter because baking one in is how three widgets came to
 *  implement it separately. A point with no coordinates, or an empty candidate set, returns a
 *  null distance **and a reason** -- which is what lets `policy` answer Unknown rather than
 *  defaulting, so it is part of the contract and not an error path. */
export function nearestPlaces(places:PointCollection,centers:PointCollection,unit:DistanceUnit='kilometres',
  candidateFilter?:CandidateCondition[]):{rows:NearestRow[];candidateCount:number;eligibleCount:number} {
  // The filter runs before the search, on the candidates' own attributes. Its two counts are the
  // filter's provenance and belong in this receipt, where the exclusion and the search cannot
  // disagree about what was considered -- which is what holding it as a knob buys over a
  // separate node.
  const located=centers.features.filter(f=>f.geometry);
  const valid=located.filter(f=>satisfies(f.properties,candidateFilter));
  const inUnit=(kilometres:number)=>unit==='metres'?kilometres*1000:kilometres;
  const rows=places.features.map(place=>{
    if (!place.geometry || !valid.length) return {id:place.id,name:place.properties.name,attributes:{...place.properties},coordinates:place.geometry?.coordinates ?? null,distance:null,unit,center:null,reason:!place.geometry?'This point has no coordinates.':'No candidate point with valid coordinates is available.'};
    // One shared search, three callers: see src/nearest-neighbour.ts.
    const match=nearestOf(place.geometry.coordinates,valid,center=>center.geometry?.coordinates);
    const best=match!.candidate,distance=match!.kilometres;
    return {id:place.id,name:place.properties.name,coordinates:place.geometry.coordinates,attributes:{...place.properties},distance:inUnit(distance),unit,center:{id:best!.id,name:best!.properties.name,coordinates:best!.geometry!.coordinates,attributes:{...best!.properties}}};
  });
  return {rows,candidateCount:located.length,eligibleCount:valid.length};
}
/** Every machined note says which widget wrote it, stamped here so no producer can forget. */
function signedByWidget(machined:Record<string,MachinedNote[]>,workflow:Workflow){
  return Object.fromEntries(Object.entries(machined).map(([id,notes])=>{
    const type=workflow.nodes.find(n=>n.id===id)?.type;
    const version=widgetRegistry.widgets.find(w=>w.nodeType===type)?.currentVersion;
    return [id,type&&version
      ?notes.map(note=>({...note,widget:{type,title:TYPES[type].title,version}})):notes];
  }));
}

/** WHERE THE DATA A STEP READ CAME IN (experiment 207): back along its one input through each step that has one input,
 *  to the step that brought the data in. A step with two inputs stops the walk, since which one a column came from is
 *  not known here; that step's output is then what the issue is about. */
export function dataOrigin(workflow:Workflow,nodeId:string,runId:string):string{
  let at=workflow.edges.filter(e=>e.to===nodeId);
  let id=at.length===1?at[0]!.from:nodeId;const seen=new Set([nodeId]);
  while(!seen.has(id)){seen.add(id);at=workflow.edges.filter(e=>e.to===id);if(at.length!==1)break;id=at[0]!.from;}
  return `<urn:fieldwork:run:${runId}:output:${id}>`;
}
/** THE TABLES A RUN'S STEPS MADE, from its values: kept on a finished run, and on a stopped one (2026-11-20), so a step's
 *  dialog can show the tables reaching it although the run stopped there -- Append rows' columns, after it refused to
 *  stack a table holding its names under another column. */
/** The few numbers a process step's Result shows, by type; undefined for a step that keeps nothing here. */
export function summarizeStep(node:WorkflowNode,value:unknown):StepSummary|undefined{
  const v=value as {features?:{areaSquareMetres?:number;spanMetres?:number}[];unconnected?:unknown[];offNetwork?:unknown[]}|undefined;
  switch(node.type){
    case 'summarize_hull':{const f=v?.features?.[0];return f?{areaSquareMetres:f.areaSquareMetres,spanMetres:f.spanMetres}:undefined;}
    case 'voronoi':case 'donut_geomask':case 'aggregate_points_to_h3_cell':return {features:v?.features?.length??0};
    case 'line_input':{const l=value as import('./types.js').LineLayer|undefined;if(!l?.features)return undefined;
      const km=l.features.reduce((t,f)=>t+lineLengthKm(f),0);return {lines:l.features.length,km:km<10?km.toFixed(2):Math.round(km).toLocaleString('en')};}
    case 'isochrone':case 'reachable_nodes':return {features:v?.features?.length??0,unconnected:v?.unconnected?.length??0,offNetwork:v?.offNetwork?.length??0};
    // The unreached places are half of what a microplan reads, so the run's summary counts them beside the answered.
    case 'travel_over_ground':{const attribute=(node.params as {attribute?:string}).attribute?.trim()||'minutes';
      const answered=((value as {features?:{properties?:Record<string,unknown>}[]}|undefined)?.features??[])
        .filter(f=>typeof f.properties?.[attribute]==='number').length;
      return {places:v?.features?.length??0,answered,unreached:(v?.features?.length??0)-answered};}
    case 'mean_center':{const c=value as MeanCenter;return {longitude:c.coordinates[0],latitude:c.coordinates[1],count:c.count,
      ...(c.weight?{weightField:c.weight.field,weightTotal:c.weight.total}:{})};}
    default:return undefined;
  }
}
/** A TABLE'S POINTS IN METRES where it asks for them (its `coordinates`): each layer still in longitude and latitude is
 *  projected into the zone, as Reproject points did until it retired into this (0.169.0). A layer already in metres, read
 *  from a UTM file, is shown as it is. */
export function inMetres(node:WorkflowNode<'table_output'>,points:{layers:import("./types.js").PointLayer[]}):{layers:import("./types.js").PointLayer[]}{
  const c=node.params.coordinates;if(!c)return points;
  if(!Number.isInteger(c.zone)||c.zone<1||c.zone>60||!['north','south'].includes(c.hemisphere))
    throw new Error('Choose a UTM zone from 1 to 60 and a hemisphere for the coordinates in metres.');
  const {crs}=utmDefinition(c.zone,c.hemisphere);
  return {layers:points.layers.map(layer=>isProjectedReference(layer.spatialReference)?layer:{...layer,
    ...projectFromCRS84(layer,c.zone,c.hemisphere).collection,
    spatialReference:{datum:'WGS84',geodeticCRS:'EPSG:4326',geometryCRS:crs,axisOrder:'easting-northing',units:'metre'}})};
}
export function tablesOfRun(workflow:Workflow,values:Map<string,unknown>):Record<string,DataTable>{
  const tables:Record<string,DataTable>={};
  for(const [nodeId,value] of values)
    if((value as {kind?:string})?.kind==='data-table')tables[nodeId]=value as DataTable;
    // A distances result is a table too, so a step reading it can preview it (experiment 197).
    else{const n=workflow.nodes.find(x=>x.id===nodeId);if(n&&outputOf(n)==='distances')tables[nodeId]=distancesAsTable(value as never);
      // A POINT LAYER WIRED TO A TABLE PORT is a table too (experiment 200): only where it is wired so, since every
      // point layer as a table would hold a second copy of each.
      else if(n&&(outputOf(n)==='points'||outputOf(n)==='polygons')&&workflow.edges.some(e=>{if(e.from!==n.id)return false;const to=workflow.nodes.find(x=>x.id===e.to);
        return !!to&&nodeInputs(to).find(([p])=>p===e.port)?.[1]==='table';}))
        // A POLYGON LAYER TOO (2026-11-15): a chart of a replay's p-values is offered its columns from the last run.
        tables[nodeId]=outputOf(n)==='points'?pointsAsTable(value as never):polygonsAsTable(value as never);}
  return tables;
}
export async function executeWorkflow(workflow:Workflow,reasoner:Reasoner,onProgress:(id:string,status:'running'|'done'|'failed')=>void=()=>{}):Promise<WorkflowRun> {
  workflow=validateWorkflow(workflow);
  const runId=crypto.randomUUID(), receipts:Receipt[]=[];
  // What each deduplication found, so the node can show the band it is waiting on.
  const linkages:Record<string,DeduplicateResult>={};
  // What each relate did, for the same reason: the rows it dropped are not in the table it
  // produced, so a step that silently halved a stratification looks exactly like one that did
  // not. See `relateOutcome` in src/relate-table.ts.
  const relations:Record<string,RelateOutcome>={};
  // WHAT A PROCESS STEP MADE, in a few numbers, for its Inspector's Result: only output steps keep their values after a
  // run, and a step's Result must not say "not run" of a step that ran (2026-11-22).
  const stepSummaries:Record<string,StepSummary>={};
  /** WHAT EACH STEP COMPUTED, named, for the dialogs downstream (2026-11-24). See `computed` in results.ts for why.
   *  Only layers of named geometry, and only while they are small enough to be worth naming one by one. */
  const computed:Record<string,{features:{name:string;geometry:{type:string;coordinates:unknown}}[];total:number}>={};
  const NAMEABLE=500;
  const remember=(node:WorkflowNode,value:unknown):void=>{
    const layer=value as {features?:({id?:unknown;name?:unknown;properties?:{name?:unknown};geometry?:{type:string;coordinates:unknown}|null}&Record<string,unknown>)[]}|undefined;
    const all=layer?.features;
    if(!Array.isArray(all)||!all.length||all.length>NAMEABLE)return;
    // AND WHAT EACH CARRIES THAT A PREVIEW SHADES BY (2026-11-27): an isochrone band's minutes, a summary's value,
    // total, count, category. Kept as names and shapes alone, Clip polygons' Preview drew Snow's 1-, 5-, 10- and
    // 15-minute bands as one blob, with nothing to tell them apart.
    const MEASURES=['minutes','value','total','count','category'] as const;
    const features=all.filter(f=>f&&f.geometry).map(f=>({
      name:String(f.properties?.name??f.name??f.id??'').trim(),
      geometry:f.geometry as {type:string;coordinates:unknown},
      ...Object.fromEntries(MEASURES.filter(k=>typeof f[k]==='number'||typeof f[k]==='string').map(k=>[k,f[k]]))}));
    if(features.length)computed[node.id]={features,total:all.length};
  };
  const joins:Record<string,import('./area-join.js').AreaJoinResult>={};
  const relateShifts:Record<string,ShiftColumn[]>={};
  // NOTES THE WIDGETS MACHINED, for the write-up rather than for a panel. Four producers:
  // `relate_table` reports what the join did, and `rate`, `rate_ratio` and `two_by_two` state
  // the equation they computed with this run's numbers substituted into it.
  const machined:Record<string,MachinedNote[]>={};
  // A NOTE GOES IN THE RECEIPT OF THE STEP THAT MACHINED IT, which is where `relate_table` has
  // put its own since 0.3.0. Appended to the receipt just pushed rather than threaded through
  // three receipt builders, because the note is assembled from the result those builders already
  // have and passing it in would mean changing all three signatures to carry it back out again.
  const withNote=(into:Receipt[],run:string,nodeId:string,notes:MachinedNote[])=>{
    const receipt=into[into.length-1];
    if(receipt?.nodeId!==nodeId)return;
    const facts=machinedNoteFacts(`<urn:fieldwork:run:${run}:output:${nodeId}>`,notes);
    receipt.facts+=facts;
    if(receipt.input)receipt.input+=facts;
  };
  // WHAT THE STEP PUBLISHED, beside the note about it. Both land on the same output entity, so
  // `fw:PublishedArtifactIsDescribedShape` can hold one against the other on a real receipt.
  const withArtifact=(into:Receipt[],run:string,nodeId:string,artifact:PublishedArtifact)=>{
    const receipt=into[into.length-1];
    if(receipt?.nodeId!==nodeId)return;
    const facts=publishedArtifactFacts(`<urn:fieldwork:run:${run}:output:${nodeId}>`,artifact);
    receipt.facts+=facts;
    if(receipt.input)receipt.input+=facts;
  };
  // THE WORKFLOW'S OWN WORDS for its figures' text, {country} and the rest (figure-words.ts), before anything is written.
  setFigureWords(figureWordsOf(workflow));
  const sources=derivedNotes(workflow.nodes,workflow.workflowKey);
  const planned=executionPlan(workflow), values=new Map<string,unknown>(), trace:WorkflowRun['trace']=[];
  const optional=new Set(openEnds(workflow,planned).map(n=>n.id));
  const plan=[...planned,...workflow.nodes.filter(n=>optional.has(n.id))];
  const unfinished:{nodeId:string;message:string}[]=[],failedOptional=new Set<string>();
  let drawn=performance.now();
  const breathe=async()=>{if(performance.now()-drawn<50)return;await new Promise(resolve=>setTimeout(resolve,0));drawn=performance.now();};
  try{
  for(const node of [...plan]){
    // A STEP UNDER CONSTRUCTION that fails, or stands on one that did, is named and set aside; the run goes on.
    if(optional.has(node.id)){
      const above=workflow.edges.find(e=>e.to===node.id&&failedOptional.has(e.from));
      if(above){failedOptional.add(node.id);plan.splice(plan.indexOf(node),1);continue;}
      try{await runNode(node);}
      catch(error){onProgress(node.id,'failed');failedOptional.add(node.id);plan.splice(plan.indexOf(node),1);
        unfinished.push({nodeId:node.id,message:error instanceof Error?error.message:String(error)});}
      continue;
    }
    // Which node failed, reported before the error leaves this function.
    //
    // A refused step used to stay 'running' for ever: `onProgress(node.id,'done')` is the last
    // line of the loop body and a throw skips it, so nothing ever retracted the running state.
    // The canvas then showed the one widget that had stopped as the one still working, which is
    // the exact opposite of what happened. Found 2026-10-16 by measuring the classes on a
    // failing node: `node purple selected running`.
    try{
      await runNode(node);
    }catch(error){
      onProgress(node.id,'failed');
      if(error&&typeof error==='object')(error as {tablesSoFar?:Record<string,DataTable>}).tablesSoFar=tablesOfRun(workflow,values);
      throw error;
    }
  }
  }finally{runDetail(null);}
  async function runNode(node:typeof plan[number]){
    onProgress(node.id,'running');
    // THE RUN'S OWN PROGRESS (the practitioner, 2026-11-12, of Brazil's 36-second run: "that workflow needs a progress
    // bar"): which step, and how many of how many are done. A step that reports its own progress replaces it while it
    // runs. The page is let draw only after 50 ms of computing, so a quick run is not slowed by it.
    runDetail({nodeId:node.id,label:(node.params as {label?:string}).label||TYPES[node.type].title,done:plan.indexOf(node),of:plan.length,what:'steps',verb:'Computing'});
    await breathe();
    const begin=performance.now();const beganAt=new Date().toISOString();
    // A DISTANCES RESULT OR A POINT LAYER ON A TABLE PORT IS READ AS ITS TABLE (experiments 197, 200), here, where every
    // step's inputs are read.
    const inputs=Object.fromEntries(workflow.edges.filter(e=>e.to===node.id).map(e=>{
      const from=workflow.nodes.find(n=>n.id===e.from),value=values.get(e.from);
      const wanted=nodeInputs(node).find(([p])=>p===e.port)?.[1];
      // A MEAN CENTRE ON A POINT INPUT is one point, named by its step (2026-11-20: Comparison map retired into Map, which
      // shows the original and moved centres as point layers).
      if(wanted==='points'&&from?.type==='mean_center'){const c=value as import('./mean-center.js').MeanCenter;
        return [e.port,{type:'FeatureCollection',features:[{type:'Feature',id:`${from.id}-centre`,
          properties:{name:from.params.label||'Mean center',count:c.count},geometry:{type:'Point',coordinates:c.coordinates}}]}];}
      return [e.port,wanted==='table'?asTableInput(from,value):value];
    })) as unknown as ExecutionInputs;
    // A MAP'S POLYGON LAYERS, collected as one value the way Collect polygon layers did: each feature keeps its layer's
    // name, so the layer list shows each layer; nothing is merged; larger ones draw first.
    if(node.type==='map_output'){
      const fed=workflow.edges.filter(e=>e.to===node.id&&isPolygonPort(e.port)).sort((a,b)=>a.port.localeCompare(b.port,'en',{numeric:true}));
      if(fed.length>1||fed.length===1&&fed[0]!.port!=='polygons')(inputs as unknown as {polygons:Polygons}).polygons=collectPolygonLayers(fed.map(e=>values.get(e.from) as Polygons),
        fed.map(e=>{const from=workflow.nodes.find(n=>n.id===e.from);return (from?.params as {layerName?:string;label?:string}|undefined)?.layerName||from?.params.label||e.from;}));
    }
    // A DECLARED PORT IS NOT A CONNECTED ONE. map_output declares `points` and `context` beside
    // `area`, so a study area shown on its own -- the whole of experiment 01, and every area a
    // practitioner inspects before adding data -- has point ports with no edge behind them. This
    // asserted one anyway and threw "undefined is not an object (evaluating 'c.from')" at the
    // practitioner, naming a minified variable in a workflow that was perfectly valid.
    //
    // Unconnected ports are skipped rather than defaulted: a layer standing for an input nobody
    // supplied would be worse than its absence.
    // WHOSE points these are, read from the data rather than from the wire. A layer used to be
    // named after the node PLUGGED INTO the map, so a `clip_points_to_area` in between made two
    // searches of two different registries both announce themselves as "Points inside the area" --
    // the clip's own label -- and the receipt attributed every record to the clip. Reported
    // 2026-10-20: *"Map still does not distinguish the two facility sources as layers."*
    //
    // The identity was already travelling correctly and was being ignored: a facility search
    // stamps its collection with its own `sourceNodeId`, and the clip carries it forward. Two
    // notions of identity existed -- the edge's `from` and the one the data holds -- and they
    // disagree exactly when a widget sits in between. The data's wins; `from` is the fallback for
    // a collection that carries none.
    const layerIdentity=(w:Workflow,from:string,collection:PointCollection,connected:WorkflowNode):{sourceNodeId:string;label:string}=>{
      const carried=(collection as unknown as {sourceNodeId?:string}).sourceNodeId;
      const origin=typeof carried==='string'?w.nodes.find(n=>n.id===carried):undefined;
      return origin
        ?{sourceNodeId:origin.id,label:origin.params.label||TYPES[origin.type].title}
        :{sourceNodeId:from,label:connected.params.label||TYPES[connected.type].title};
    };
    const pointInputs=():{layers:import('./types.js').PointLayer[]}=>({layers:nodeInputs(node).filter(([port])=>isPointPort(port)).flatMap(([port])=>{const edge=workflow.edges.find(e=>e.to===node.id&&e.port===port);if(!edge)return [];const source=workflow.nodes.find(n=>n.id===edge.from);if(!source)return [];return [{...(inputs[port as keyof ExecutionInputs] as unknown as PointCollection),
      ...layerIdentity(workflow,edge.from,inputs[port as keyof ExecutionInputs] as unknown as PointCollection,source),port,attributeDefinitions:[...('fields' in source.params?source.params.fields||[]:[]),...('attributeRules' in source.params?source.params.attributeRules||[]:[])]}];})});
    let value:unknown;
    // THE LAYERS THIS NODE DRAWS, settled once and read by everything downstream. Built before
    // the renderer is chosen, because which renderer leads and which layers survive are two
    // different questions -- and answering them with one variable is what lost a layer five
    // times running. `drawnMode` still answers the first; this answers the second.
    // VALIDATED BEFORE THE RUN, because a setting that cannot be honoured should refuse before
    // anything is computed. The LIST itself is built after, where the value exists: a classed pin
    // layer's classes are read off the rows the map actually produced.
    if(node.type==='map_output')validateLayerSettings(node);
    const runner=STEP_RUNNERS[node.type] as StepRunner|undefined;
    if(!runner)throw new Error(`This build carries no step of type ${node.type}.`);
    value=await runner({inputs,node,receipts,runId,workflow,machined,withNote,joins,relateShifts,relations,linkages,pointInputs,reasoner,values,markDrawn:()=>{drawn=performance.now();}});
    if(node.type==='study_area'&&isRecord(value))value.spatialReference=structuredClone(node.params.spatialReference);
    // The list travels on the value, so the interactive map, the static figure and the key all
    // draw the same layers in the same order under the same names -- rather than each inventing
    // its own labels at the point of drawing, which is how the layer control came to offer
    // "Observations (red circles)" beside a practitioner's own node label.
    // THE DESCRIPTIONS, after the switch because a map's layer list is assembled here and because
    // all three read the value the node just produced rather than anything only the case knows.
    // Gated on the node TYPE and not on what the value carries: a `rate` emits a chart on its own
    // table, and captioning that would caption a computation as though it were a figure.
    if(node.type==='table_output'&&(value as {kind?:string})?.kind==='data-table'){
      const described=tableDescriptionNote(value as unknown as import('./data-table.js').DataTable,
        node.params.label,node.id,portSourceName(workflow,node.id,
          workflow.edges.some(e=>e.to===node.id&&e.port==='polygons')?'polygons':'table',''));
      // FILED WHERE THE PRACTITIONER PUT IT, Results unless they chose otherwise.
      const note=described&&{...described,section:figureSection(node.params,node.type)};
      const table=value as unknown as import('./data-table.js').DataTable;
      if(!inWriteUp(node.params))withArtifact(receipts,runId,node.id,{kind:'table',rowCount:table.rowCount,
        missingValueCount:table.missingValueCount,leftOut:true});
      else if(note){machined[node.id]=[note];withNote(receipts,runId,node.id,[note]);
        withArtifact(receipts,runId,node.id,{kind:'table',rowCount:table.rowCount,
          missingValueCount:table.missingValueCount,section:figureSection(node.params,node.type),
          sectionDeclared:figureSectionDeclared(node.params)});}
    }
    if(node.type==='chart_output'&&isRecord(value)&&(value as {chart?:ChartSummary}).chart){
      const chart=(value as {chart:ChartSummary}).chart;
      const described=chartDescriptionNote(chart,node.params.label,node.id,node.params.figure==='pyramid'||node.params.figure==='stacked'?node.params.figure:chartRenderer(node.params)==='vega-lite'?node.params.mark??'bar':'bar');
      const note=described&&{...described,section:figureSection(node.params,node.type)};
      if(!inWriteUp(node.params))withArtifact(receipts,runId,node.id,{kind:'chart',barCount:chart.bins.length,leftOut:true});
      else if(note){machined[node.id]=[note];withNote(receipts,runId,node.id,[note]);
        withArtifact(receipts,runId,node.id,{kind:'chart',barCount:chart.bins.length,
          section:figureSection(node.params,node.type),sectionDeclared:figureSectionDeclared(node.params)});}
    }
    // A TRANSMISSION TREE SAYS WHAT IT DREW, in Results, as a bar chart does (2026-11-14: MERS's tree wrote no note).
    if(node.type==='chart_output'&&isRecord(value)&&(value as {kind?:string}).kind==='transmission-tree'){
      const sentence=String((value as {sentence?:unknown}).sentence??'').trim();
      if(sentence&&inWriteUp(node.params)){const note:MachinedNote={kind:'machined',id:`${node.id}:description`,section:figureSection(node.params,node.type),
        nodeId:node.id,text:`**${node.params.label||'Who infected whom'}.** ${sentence}`};
        machined[node.id]=[note];withNote(receipts,runId,node.id,[note]);}
    }
    // LINES JOIN EVERY MAP, whichever renderer leads: a map's layers are not a mode (experiment 229).
    //
    // ATTACHED BEFORE THE LAYER LIST IS BUILT, not after (2026-11-24). It ran below the block that follows, so
    // `mapLayerList` could not see a line layer and `drawnExtents` measured in a frame that did not span one --
    // which is exactly the wrong-frame trap that block's own comment warns of.
    if(node.type==='map_output'&&value&&(inputs as unknown as {lines?:import('./types.js').LineLayer}).lines){
      const edge=workflow.edges.find(e=>e.to===node.id&&e.port==='lines')!,from=workflow.nodes.find(n=>n.id===edge.from);
      (value as unknown as {lines:unknown}).lines=[{...structuredClone((inputs as unknown as {lines:import('./types.js').LineLayer}).lines),
        sourceNodeId:edge.from,label:(from?.params as {label?:string})?.label||edge.from}];}
    if(node.type==='map_output'&&isRecord(value)){
      const originOf=layerOrigins((value as {pointLayers?:{sourceNodeId:string;port?:string}[]}).pointLayers);
      const plan=mapLayerList(node,workflow.edges,
        id=>workflow.nodes.find(n=>n.id===id)?.params.label,
        [...(inputs.polygons?[{port:'polygons',members:membersOfPolygons(inputs.polygons)}]:[]),
          // A classed pin layer's classes are layers inside its port, the same shape as a
          // collected polygon's members. Read from the rows the map just built, so the list and
          // the picture are one answer rather than two.
          ...workflow.edges.filter(e=>e.to===node.id&&isPointPort(e.port)).flatMap(edge=>{
            const classes=classesOfPoints((value as {rows?:unknown}).rows,originOf(edge.port)?.sourceNodeId??edge.from);
            return classes.length?[{port:edge.port,members:classes}]:[];
          })],originOf);
      assertSomethingToDraw(plan,node.params.label||node.id);
      (value as unknown as {mapLayers?:MapLayer[]}).mapLayers=plan;
      // HOW WIDE EACH LAYER IS DRAWN, in the figure's own units. `staticMapFrame` is deterministic from the value,
      // so the scale the figure will use is known here, before anything is drawn: a layer's own bounds times that
      // scale is the width a reader will see. Only the layers whose ground has an extent -- the study area and the
      // polygon layers -- because a point layer's marks are a fixed size and are never the ones that vanish.
      const drawnExtents=(():{id:string;units:number}[]=>{
        try{
          // THE FRAME THE FIGURE WILL USE, which is not one function. A map carrying polygons is drawn by
          // `polygonSvg` in `polygonFrame`, which spans the polygons; `staticMapFrame` spans the boundary, the
          // lines, the rows and the centres and ignores polygon layers entirely. Measuring with the wrong one said
          // a 10 km buffer filled the figure when the drawn figure gave it 2.6 of 850 units (2026-11-23).
          const polygons=(value as {polygons?:import('./catchments.js').Polygons}).polygons;
          const frame=polygons?.features?.length
            ?polygonFrame(polygons,(value as {boundary?:import('./types.js').Boundary}).boundary??null,undefined,
              lineLayersOf(value as never))
            :staticMapFrame(value as never);
          if(!frame)return [];
          const widthOf=(g:import('./types.js').Boundary|undefined):number|undefined=>{
            if(!g)return undefined;
            const [x0,y0,x1,y1]=geometryBounds(g);
            const [ax,ay]=frame.project([x0,y0] as [number,number]),[bx,by]=frame.project([x1,y1] as [number,number]);
            return Math.max(Math.abs(bx-ax),Math.abs(by-ay));
          };
          const out:{id:string;units:number}[]=[];
          for(const layer of plan){
            const width=layer.kind==='AreaLayer'?widthOf((value as {boundary?:import('./types.js').Boundary}).boundary)
              :layer.kind==='PolygonsLayer'?widthOf({type:'MultiPolygon',
                coordinates:((value as {polygons?:{features?:{geometry:import('./types.js').Boundary}[]}}).polygons?.features??[])
                  .flatMap(f=>f.geometry.type==='MultiPolygon'
                    ?f.geometry.coordinates as Position[][][]:[f.geometry.coordinates as Position[][]])} as import('./types.js').Boundary)
              :undefined;
            if(width!==undefined&&Number.isFinite(width))out.push({id:layer.id,units:width});
          }
          return out;
        }catch{return [];}
      })();
      const described=mapDescriptionNote(plan,node.params.label,node.id,drawnExtents);
      const note=described&&{...described,section:figureSection(node.params,node.type)};
      if(!inWriteUp(node.params))withArtifact(receipts,runId,node.id,
        {kind:'map',layerCount:plan.filter(l=>l.drawn).length,leftOut:true});
      else if(note){machined[node.id]=[note];withNote(receipts,runId,node.id,[note]);
        // DRAWN, not connected: the distinction `fw:layerDrawn` exists for.
        withArtifact(receipts,runId,node.id,
          {kind:'map',layerCount:plan.filter(l=>l.drawn).length,
            section:figureSection(node.params,node.type),sectionDeclared:figureSectionDeclared(node.params)});}
    }
    // COLUMNS NOBODY HAS DESCRIBED, said in the write-up as their own limitation and not as a fault in the rows.
    if(node.type==='table_input'){
      const unstated=metadataFindings(node.params.data,node.params.columns,node.params.dictionaryCheck,node.params.wide);
      if(unstated.length){
        const note:MachinedNote={kind:'machined',id:`${node.id}:meaning`,section:'Methods',fn:'limitation',nodeId:node.id,
          text:`${node.params.label||'This table'}: ${unstated.map(f=>f.text.replace(/\.$/,'')).join('; ')}.`};
        machined[node.id]=[...(machined[node.id]??[]),note];
        withNote(receipts,runId,node.id,[note]);
      }
    }
    if(node.type==='table_input'&&node.params.data.findings?.length){
      // STATED ONCE AT THE TABLE, so an unresolved problem cannot leave the data quality dialog
      // behind and reach a figure unsaid. Experiment 164.
      const note:MachinedNote={kind:'machined',id:`${node.id}:quality`,section:'Methods',fn:'limitation',
        nodeId:node.id,text:`${node.params.label||'This table'} has unresolved data quality findings: `
          +`${findingsSummary(node.params.data)}. Its rows were used as they stand.`};
      machined[node.id]=[...(machined[node.id]??[]),note];
      withNote(receipts,runId,node.id,[note]);
    }
    if(node.type==='map_output'&&inWriteUp(node.params)){
      const says=basemapLimitation(node.params.basemap);
      if(says){
        // BESIDE any note the map already wrote, which this must not replace, and IN THE FIGURE'S OWN SECTION: a figure's
        // notes go where the figure goes (fw:FigureFiledWhereDeclaredShape). Filed under Methods it failed that shape on
        // every map with a basemap, found 2026-11-10 when OpenStreetMap became the default and every map had one.
        const note:MachinedNote={kind:'machined',id:`${node.id}:basemap`,section:figureSection(node.params,node.type),fn:'limitation',
          nodeId:node.id,text:says};
        machined[node.id]=[...(machined[node.id]??[]),note];
        withNote(receipts,runId,node.id,[note]);
      }
    }
    // A WIDE READING THE PRACTITIONER KEPT FOR THIS STEP (2026-11-25), applied to what it just made. The table is
    // the step's own product and has nowhere else to carry the decision. Written as `shownWide`, the DISPLAY
    // reading: `wide` is the file's own shape, which Apply ruleset computes from, and a preference written there
    // changed what was evaluated (review of 0.196.0).
    {const reading=workflow.readWide?.[node.id],made=value as {kind?:string;keys?:string[]}|undefined;
      if(reading&&made?.kind==='data-table'&&made.keys?.includes(reading.measureKey))
        value={...made,shownWide:{measureKey:reading.measureKey,subjectKeys:reading.subjectKeys}} as typeof value;}
    values.set(node.id,value);{remember(node,value);const summary=summarizeStep(node,value);if(summary)stepSummaries[node.id]=summary;}trace.push({nodeId:node.id,type:node.type,milliseconds:performance.now()-begin});
    // A RASTER IS LET GO once every step that reads it has run (2026-11-13): three national windows at 100 m held to the
    // end of Botswana's run stalled the tab, and nothing after the steps reading a raster reads it again. A step showing it,
    // a map, holds its own reference.
    for(const edge of workflow.edges.filter(e=>e.to===node.id)){
      const above=workflow.nodes.find(n=>n.id===edge.from);
      if(!above||(above.type!=='raster_input'&&above.type!=='clip_raster')||!values.has(above.id))continue;
      if(workflow.edges.filter(e=>e.from===above.id).every(e=>values.has(e.to)))values.delete(above.id);
    }
    // WHEN THIS STEP RAN, in the receipt, in PROV's own terms.
    //
    // The practitioner, 2026-10-23, on measuring the work a project holds: *"compute time in the
    // measure queryable from receipts"*, and then *"perhaps timestamp is better?"* It is. A
    // duration is a number a reader has to trust; two timestamps let the question be asked --
    // what ran since my last export, and how long did it take -- and the duration is still there
    // by subtraction. prov:startedAtTime and prov:endedAtTime are the terms PROV already has, so
    // nothing new is coined for a thing the standard names.
    //
    // Until now the cost of a run lived only in `trace`, in memory, and was lost on reload.
    const timed=receipts.find(r=>r.nodeId===node.id);
    // Onto facts that may be empty, and in full IRIs: a receipt that declared no prefix began "undefined" and could not
    // be parsed (found 2026-11-12, on 7-1-7's).
    if(timed)timed.facts=(timed.facts??'')+`<urn:fieldwork:run:${runId}:step:${node.id}> `
      +`<http://www.w3.org/ns/prov#startedAtTime> "${beganAt}"^^<http://www.w3.org/2001/XMLSchema#dateTime>; `
      +`<http://www.w3.org/ns/prov#endedAtTime> "${new Date().toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>.\n`;
    onProgress(node.id,'done');
  }
  const outputNodes=resultNodes({nodes:plan});
  const display=(id:string)=>required(values.get(id)) as DisplayValue;
  const outputs:Output[]=outputNodes.length?outputNodes.flatMap((n):Output[]=>{
    const view=n.type==='output'?n.params.view:n.type==='table_output'?'table':n.type==='chart_output'?'bars':'map';
    return [{...display(n.id),nodeId:n.id,label:n.params.label||(n.type==='measure_area'?'Area · '+display(n.id).label:(view==='table'?'Table':'Map')+' · '+n.id),view}];
  }):plan.filter(n=>n.type==='study_area').map(n=>({...display(n.id),kind:'study-area',rows:[],centers:[],nodeId:n.id,label:n.params.label||'Study area preview',view:'map'}));
  for(const node of plan.filter((n):n is WorkflowNode<'map_output'>=>n.type==='map_output')){
    const output=outputs.find(o=>o.nodeId===node.id),receipt=receipts.find(r=>r.nodeId===node.id);
    if(output&&receipt)mapSpecificationFacts(node,output,workflow,runId,receipt);
  }
  // Each node's declared output port type, so the provenance says what every value travelled as.
  const portTypes=Object.fromEntries(plan.map(node=>[node.id,outputOf(node)]));
  const provenance=evidenceProvenance(plan,workflow.edges,runId,receipts,portTypes);
  for(const receipt of receipts){const cited=provenance.evidence.find(e=>e.nodeId===receipt.nodeId);if(cited)receipt.references=structuredClone(cited.references);}
  // Findings the run made that no output tab states, carried per node. `unconnectedSites` reads
  // any value, so this does not need to know which widgets report omissions.
  const alerts:WorkflowRun['alerts']=plan.flatMap(node=>{
    const value=values.get(node.id),unconnected=unconnectedSites(value),offNetwork=offNetworkSites(value);
    const gaps=declarationGaps(value),dataIssues=dataIssuesOf(value,node.id);
    return unconnected.length||offNetwork.length||gaps.length||dataIssues.length
      ?[{nodeId:node.id,unconnected,offNetwork,...(gaps.length?{gaps}:{}),
         ...(dataIssues.length?{dataIssues}:{})}]:[];
  });
  // THE TABLES THE RUN PASSED BETWEEN STEPS, kept so a practitioner can look at one.
  //
  // The practitioner, 2026-10-27: *"Any widget that works on a table and outputs a table should
  // enable Quick Look at the output table."* The obstacle was not the button. Only an OUTPUT
  // widget produces a result tab, so a relate, a group, a derived value or a selection in the
  // middle of a chain had no surface at all: its table existed for the length of this function
  // and was then dropped. On Snow's contingency workflow that is four of the nine steps, and the
  // practitioner could see the first table and the last and nothing in between.
  //
  // TABLES ONLY, deliberately. Every intermediate value passes through `values` -- geometry,
  // rasters, street graphs -- and keeping all of them would put a copy of every layer on the run
  // object. A table is already bounded at MAX_TABLE_ROWS, so this is a known cost; the rest is
  // not, and a figure for "how much memory does a run hold" that depends on the workflow is not
  // one anybody can act on.
  const tables=tablesOfRun(workflow,values);
  // A POINT LAYER'S COLUMNS, not the layer (experiment 192): a rules step after a computed one, such as Find health
  // facilities from a list, is offered the columns that step gave out. Bounded: names and kinds from 200 points.
  const pointColumns:Record<string,{attribute:string;kind:'number'|'term'}[]>={};
  for(const [nodeId,value] of values){
    const features=(value as {type?:string;features?:{properties?:Record<string,unknown>|null}[]})?.type==='FeatureCollection'
      ?(value as {features:{properties?:Record<string,unknown>|null}[]}).features:null;
    if(!features?.length)continue;
    const kinds=new Map<string,Set<string>>();
    for(const f of features.slice(0,200))for(const [k,v] of Object.entries(f.properties??{}))
      if(v!==null&&v!==undefined&&v!=='')(kinds.get(k)??kinds.set(k,new Set()).get(k)!).add(typeof v);
    if(kinds.size)pointColumns[nodeId]=[...kinds].map(([attribute,t])=>({attribute,kind:t.size===1&&t.has('number')?'number' as const:'term' as const}));
  }
  // EVERY STEP SAYS WHAT IT DID, IN METHODS (2026-11-14; the practitioner: "The Notes is where a user may want to see
  // all the results, and right now it's where the biggest gap is"). MERS's eight workflows put 1 Methods note in for 13
  // Total within groups steps and none for its rules: the run record held each step's sentence and nothing carried it
  // to the write-up. A step that machined no Methods note of its own gets one, from that sentence, as written. Outputs
  // are left out, as they write Results; sources too, as they write a source note from what they declare.
  const RESULT_STEPS=new Set(['table_output','chart_output','map_output','comparison_map']);
  const SOURCE_STEPS=new Set(['table_input','point_input','polygon_input','raster_input','study_area','network_input','map_image_input']);
  for(const node of workflow.nodes){
    if(RESULT_STEPS.has(node.type)||SOURCE_STEPS.has(node.type))continue;
    if((machined[node.id]??[]).some(note=>note.section==='Methods'))continue;
    const said=receipts.find(r=>r.nodeId===node.id&&typeof (r as {method?:unknown}).method==='string'&&(r as {method:string}).method.trim())as {method:string}|undefined;
    if(!said)continue;
    (machined[node.id]??=[]).push({kind:'machined',id:`${node.id}:method`,section:'Methods',fn:'method',nodeId:node.id,text:said.method.trim()});
  }
  return {...provenance,alerts,outputs,trace,receipts,runId,engine:'EYE-JS 21.1.24 (WASM)',runAt:new Date().toISOString(),
    ...(Object.keys(tables).length?{tables}:{}),
    ...(Object.keys(pointColumns).length?{pointColumns}:{}),
    ...(()=>{const areas:Record<string,{label:string;boundary:import('./types.js').Boundary}>={};
      for(const [nodeId,value] of values){const n=workflow.nodes.find(x=>x.id===nodeId),v=value as AreaValue|undefined;
        if(n&&n.type!=='study_area'&&outputOf(n)==='area'&&v?.boundary)areas[nodeId]={label:v.label,boundary:v.boundary};}
      return Object.keys(areas).length?{areas}:{};})(),
    ...(unfinished.length?{unfinished}:{}),
    ...(Object.keys(linkages).length?{linkages}:{}),
    ...(Object.keys(relations).length?{relations}:{}),
    ...(Object.keys(stepSummaries).length?{stepSummaries}:{}),
    ...(Object.keys(computed).length?{computed}:{}),
    ...(Object.keys(joins).length?{joins}:{}),
    ...(Object.keys(relateShifts).length?{relateShifts}:{}),
    ...(Object.keys(machined).length?{machined:signedByWidget(machined,workflow)}:{}),
    // THE SOURCES THIS WORKFLOW CITES, read back from what its inputs declare rather than asked
    // for again. Experiment 141, trying the design on a real write-up: "References are the one
    // section a workflow can write by itself."
    ...(sources.length?{derived:sources}:{})};
}

/** DERIVE A VALUE, RETIRED INTO APPLY RULESET (experiment 188, 2026-11-08). One rule for every record: the same two
 *  values, operation and new name, read from a wide table's subjects, which is the table Derive a value read. Every
 *  published use gave identical rows both ways (tests/rules-replace-derive.test.mjs). The step did not state the units
 *  of what it combined, so the migrated rule states none, and does not run until they are described: stating a unit is
 *  the practitioner's step, not a guess made on opening a file. Stamped, as every migration is. */
function migrateDeriveValue(w:Workflow):void{
  const slug=(s:string)=>s.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'')||'value';
  const derived=new Set<string>();
  w.nodes=w.nodes.map(n=>{
    if(n?.type!=='derive_value')return n;
    derived.add(n.id);
    const {label,left,operator,right,name}=n.params as ParamsByType['derive_value'];
    const pin=pinnedRuleset('urn:fieldwork:ruleset:extract-contract','1.0.0');
    return {...n,type:'apply_ruleset',sourceMigration:{fromType:'derive_value',version:'1'},
      params:{label:label||'Apply ruleset',ruleset:pin,parameters:{},
        authored:{title:label||'Computed for every record',mustNotBeReadAs:'',parameters:[],
          fields:[...new Set([left,right])].filter(Boolean).map(m=>({attribute:m,predicate:`fwa:${slug(m)}`,kind:'number' as const,label:m})),
          rules:[{any:[{all:[]}],then:[{predicate:`fwa:c_${slug(name)}`,column:name,
            compute:{left:{field:`fwa:${slug(left)}`},operator,right:{field:`fwa:${slug(right)}`}}}]}]}}};
  }) as typeof w.nodes;
  for(const edge of w.edges)if(edge&&derived.has(edge.to)&&edge.port==='records')edge.port='projections';
}

/** CHART'S `series` PORT, RETIRED INTO ITS TABLE PORT (2026-11-12, the practitioner: "Chart ports need to be standardized").
 *  A case series arriving on Table was already drawn as a curve; the edge moves and the mode goes. */
function migrateChartSeriesPort(w:Workflow):void{
  const charts=new Set(w.nodes.filter(n=>n?.type==='chart_output').map(n=>n.id));
  for(const n of w.nodes)if(n&&charts.has(n.id)&&(n.params as {inputMode?:string}).inputMode==='series')delete (n.params as {inputMode?:string}).inputMode;
  for(const edge of w.edges)if(edge&&charts.has(edge.to)&&edge.port==='series')edge.port='records';
}

/** THE SATELLITE SAMPLER, RETIRED INTO SAMPLE A RASTER (experiment 205, 2026-11-11). The same reading, from the same
 *  ports, with its settings kept and its source said. Stamped, as every migration is. */
/** COLLECT POLYGON LAYERS, RETIRED 2026-11-13 into Map's own polygon inputs. A collector that feeds only maps is
 *  rewritten exactly: each layer it collected goes to the map's next polygon input, in its order, and the map collects them
 *  as the widget did. One that feeds anything else is refused, named: a single polygon input cannot hold several layers,
 *  and the rewrite would have to invent steps. */
function migrateCollectedPolygons(w:Workflow):void{
  for(const stack of w.nodes.filter(n=>n&&(n.type as string)==='stack_polygons')){
    const label=(stack.params as {label?:string}).label||'Collect polygon layers';
    const out=w.edges.filter(e=>e&&e.from===stack.id);
    const other=out.find(e=>w.nodes.find(n=>n.id===e.to)?.type!=='map_output');
    if(other)throw new Error(`"${label}" is a retired Collect polygon layers step feeding "${(w.nodes.find(n=>n.id===other.to)?.params as {label?:string}|undefined)?.label||other.to}". `
      +'Collecting now happens in the Map, which takes each polygon layer on its own input, so this one cannot be rewritten automatically. '
      +'Connect each polygon layer to a Map, or to the step that needs it one at a time.');
    const collected=w.edges.filter(e=>e&&e.to===stack.id&&isPolygonPort(e.port)).sort((a,b)=>a.port.localeCompare(b.port,'en',{numeric:true}));
    for(const edge of out){
      const map=w.nodes.find(n=>n.id===edge.to) as WorkflowNode<'map_output'>;
      const held=w.edges.filter(e=>e.to===map.id&&isPolygonPort(e.port)&&e.from!==stack.id).map(e=>e.from);
      const layers=[...held,...collected.map(e=>e.from)].filter((id,i,a)=>a.indexOf(id)===i);
      if(layers.length>MAX_POLYGON_LAYERS)throw new Error(`"${label}" would give "${map.params.label||map.id}" ${layers.length} polygon layers; a Map takes ${MAX_POLYGON_LAYERS}.`);
      w.edges=w.edges.filter(e=>!(e.to===map.id&&isPolygonPort(e.port)));
      layers.forEach((from,i)=>w.edges.push({id:`${map.id}-${polygonPort(i)}-${from}`,from,to:map.id,port:polygonPort(i)}));
      if(layers.length>1)map.params.polygonInputCount=layers.length;else delete map.params.polygonInputCount;
      map.sourceMigration={fromType:'stack_polygons',version:'1'};
    }
    w.edges=w.edges.filter(e=>e.from!==stack.id&&e.to!==stack.id);
    w.nodes=w.nodes.filter(n=>n.id!==stack.id);
  }
}
/** COMPARISON MAP, RETIRED INTO MAP (2026-11-20; docs/audits/comparison-map-retired.md). A saved one fed by Compare point
 *  sets opens rewritten: a Map in its place, with what the comparison compared as its point layers (the original and
 *  moved points, their mean centres where connected, the pumps), and a Table of the comparison's distances beside it. */
function migrateComparisonMap(w:Workflow):void{
  for(const shown of w.nodes.filter(n=>n&&(n.type as string)==='comparison_map')){
    const label=(shown.params as {label?:string}).label||'Comparison map';
    const fed=w.edges.find(e=>e&&e.to===shown.id);
    const compare=fed&&w.nodes.find(n=>n.id===fed.from&&n.type==='compare_point_sets');
    w.edges=w.edges.filter(e=>e.to!==shown.id&&e.from!==shown.id);
    if(!compare){w.nodes=w.nodes.filter(n=>n.id!==shown.id);continue;}
    const from=(port:string)=>w.edges.find(e=>e.to===compare.id&&e.port===port)?.from;
    const layers=['original','moved','originalCenter','movedCenter','pumps'].map(from).filter((id):id is string=>!!id);
    const map={id:shown.id,type:'map_output' as const,x:shown.x,y:shown.y,params:{label,...(layers.length>1?{pointInputCount:layers.length}:{})},
      sourceMigration:{fromType:'comparison_map' as RetiredNodeType,version:'1' as const}};
    const table={id:`${shown.id}-distances`,type:'table_output' as const,x:shown.x,y:shown.y+180,params:{label:`${compare.params.label||'Compare point sets'}: distances`}};
    w.nodes=w.nodes.map(n=>n.id===shown.id?map as unknown as WorkflowNode:n);
    if(!w.nodes.some(n=>n.id===table.id))w.nodes.push(table as unknown as WorkflowNode);
    // A Map places points against an area: the one the workflow's other maps use, or its study area.
    const area=w.edges.find(e=>e.port==='area'&&w.nodes.find(n=>n.id===e.to)?.type==='map_output')?.from??w.nodes.find(n=>n.type==='study_area')?.id;
    if(area)w.edges.push({id:`${map.id}-area-${area}`,from:area,to:map.id,port:'area'});
    layers.forEach((id,i)=>w.edges.push({id:`${map.id}-${pointPort(i)}-${id}`,from:id,to:map.id,port:pointPort(i)}));
    w.edges.push({id:`${table.id}-table-${compare.id}`,from:compare.id,to:table.id,port:'table'});
  }
}
/** REPROJECT POINTS, RETIRED INTO TABLE OUTPUT (0.169.0; docs/audits/reproject-retired.md). Only a Table could take its
 *  points, so each Table it fed reads Reproject's source directly, with Reproject's zone as its coordinates. */
function migrateReproject(w:Workflow):void{
  for(const step of w.nodes.filter(n=>n&&(n.type as string)==='reproject')){
    const p=step.params as {zone?:number;hemisphere?:'north'|'south'};
    const source=w.edges.find(e=>e&&e.to===step.id)?.from;
    for(const out of w.edges.filter(e=>e&&e.from===step.id)){
      const table=w.nodes.find(n=>n.id===out.to);
      if(table?.type!=='table_output'||!source)continue;
      if(Number.isInteger(p.zone)&&(p.hemisphere==='north'||p.hemisphere==='south'))table.params.coordinates={zone:p.zone!,hemisphere:p.hemisphere};
      table.sourceMigration={fromType:'reproject',version:'1'};
      w.edges.push({...out,id:`${out.id}-from-${source}`,from:source});
    }
    w.edges=w.edges.filter(e=>e.from!==step.id&&e.to!==step.id);
    w.nodes=w.nodes.filter(n=>n.id!==step.id);
  }
}
function migrateSatelliteSampler(w:Workflow):void{
  w.nodes=w.nodes.map(n=>{
    if(!n||(n.type as string)!=='sample_satellite_files_at_points')return n;
    return {...n,type:'sample_raster',params:{attribute:'value',valueUnit:'',...(n.params as object),source:'satellite-files'},
      sourceMigration:{fromType:'sample_satellite_files_at_points',version:'1'}} as WorkflowNode;
  }) as typeof w.nodes;
}

/** A STREAMED RASTER READ AT POINTS (2026-11-19): only the cells under the points are read from the source, and Sample a
 *  raster is given the full window with those cells in it. */
export async function streamedAtPoints(points:PointInput|import("./types.js").PointCollection,grid:import('./raster.js').RasterGrid):Promise<import('./raster.js').RasterGrid>{
  const asset=grid.asset!,m=asset.source.metadata,[x0,y0,x1,y1]=asset.window,width=x1-x0,height=y1-y0;
  const {streamedSource}=await import('./raster-workflow.js'),{openStripReader,rasterValues}=await import('./raster.js');
  const features='layers' in points?points.layers.flatMap(l=>l.features):points.features;
  const origin:[number,number]=[m.origin[0]+x0*m.resolution[0],m.origin[1]+y0*m.resolution[1]];
  const metadata={...m,width,height,origin,bounds:[origin[0],origin[1]+height*m.resolution[1],origin[0]+width*m.resolution[0],origin[1]] as [number,number,number,number]};
  // THE CELL AS SAMPLE A RASTER FINDS IT, from the window's own origin, so a point on a cell's edge falls the same way.
  const {cellAt}=await import('./sample-raster.js');
  const wanted=new Set<number>();
  for(const f of features){const c=f.geometry?.coordinates as [number,number]|undefined;if(!c)continue;
    const cell=cellAt(metadata,c);if(cell)wanted.add(cell[1]*width+cell[0]);}
  const cells=new Map<number,number>(),reader=await openStripReader(await streamedSource(asset));
  try{for(const at of wanted){const col=at%width,row=Math.floor(at/width);
    const raw=await reader.read([x0+col,y0+row,x0+col+1,y0+row+1]);cells.set(at,rasterValues(raw,m)[0]!);}}
  finally{reader.free();}
  const values=new Proxy({length:width*height} as unknown as import('./raster.js').RasterValues,{get:(target,key)=>
    typeof key==='string'&&/^\d+$/.test(key)?cells.get(Number(key))??NaN:(target as unknown as Record<string|symbol,unknown>)[key]});
  return {...grid,metadata,values};
}
