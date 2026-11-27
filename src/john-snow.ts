import data from '../examples/john-snow/points.json';
import dates from '../examples/john-snow/dates.json';
import graph from '../examples/john-snow/network.json';
import type {Workflow,WorkflowNode,PointFeature} from './types.js';
import type {EvidenceReference} from './evidence.js';
const voronoiSource='https://github.com/PHI-Case-Studies/1854-Cholera-Outbreak-London-Advanced-2/blob/d1b56c135b0fab2f470b837a51e6777dfc20b286/';
const isoSource='https://github.com/PHI-Case-Studies/Jupyterlite-1854-Cholera-Outbreak-London-Advanced-1/blob/8bde848d13d71602b2b32c62e5d4b4957e4a45a1/content/';
function reference(id:string,title:string,url:string,role:EvidenceReference['role'],notes:string):EvidenceReference{return {id,kind:'url',title,url,role,authors:'PHI Case Studies; source attribution in repository',published:'',locator:'Pinned source revision',notes,addedAt:'2026-10-07T00:00:00.000Z',modifiedAt:'2026-10-07T00:00:00.000Z'};}
export function johnSnowExample(kind:'snow-voronoi'|'snow-isochrone'):Workflow{
  const iso=kind==='snow-isochrone',pumps=structuredClone(data.pumps) as PointFeature[],deaths=structuredClone(data.deaths) as PointFeature[];
  const nodes:WorkflowNode[]=[
    {id:'study',type:'study_area',x:20,y:20,params:{source:'drawn',label:'Soho reporting rectangle (illustrative)',selectionMode:'bbox',geometry:{type:'Polygon',coordinates:[[[-.142,51.509],[-.128,51.509],[-.128,51.517],[-.142,51.517],[-.142,51.509]]]}}},
    {id:'pumps',type:'point_input',x:20,y:225,params:{label:iso?'Broadwick Street pump':'Eight pump locations',data:{type:'FeatureCollection',features:iso?pumps.filter(p=>p.id==='pump-250'):pumps},sourceInfo:{format:'CSV',url:voronoiSource+'data/pumps.csv',description:'Original FID retained in attributes; stable IDs prefixed pump-'}},references:[reference('pumps-source','Pump CSV',voronoiSource+'data/pumps.csv','data','Historical case-study point table; not a facility attendance record.')]},
    {id:'locations',type:'point_input',x:610,y:300,params:{label:'250 death locations (489 deaths)',data:{type:'FeatureCollection',features:deaths},sourceInfo:{format:'CSV',url:voronoiSource+'data/cholera_deaths.csv',description:'This source subset has 250 locations; DEATHS totals 489.'}},references:[reference('deaths-source','Death location CSV',voronoiSource+'data/cholera_deaths.csv','data','Count locations and sum DEATHS separately. This is not the whole outbreak population or a mortality denominator.')]},
    iso?{id:'catchments',type:'isochrone',x:320,y:200,params:{label:'Walking-time catchment',zone:30,hemisphere:'north',minutes:5,thresholds:[1,5,10,15],fillHoles:true,speedMPerMin:75,bufferM:25,maxSnapM:100,direction:'outbound'},references:[reference('iso-method','John Snow isochrone notebook',isoSource+'NB03-Cholera-Case-Study-Isochrone-Map.ipynb','method','Conceptual adaptation; Fieldwork interpolates partial edges, preserves curved geometry and holes, and does not reproduce notebook infill. See local method review.')]}
      :{id:'catchments',type:'voronoi',x:320,y:200,params:{label:'Nearest pump catchments',zone:30,hemisphere:'north'},references:[reference('voronoi-method','John Snow Voronoi notebook',voronoiSource+'NB03-Constructing-Voronoi-Polygons.ipynb','method','Independent half-plane implementation in WGS84 UTM zone 30N. Original notebook uses angular coordinates; results need not match.')]},
    {id:'clip',type:'clip_polygons',x:620,y:30,params:{label:'Clip to reporting area'}},
    {id:'summary',type:'summarize_points_to_polygon',x:910,y:100,params:{label:'Locations and deaths by catchment',boundary:'include',valueField:'DEATHS'}},
    // Configured for a reader who was not in the room. Everything a figure needs to stand alone is
    // stated here rather than left to fall back on the node's label and a list of upstream node
    // names: a title that says what is shown and where, a subtitle that says what the reader is
    // looking at and what it does not claim, and a source note that credits the data and names the
    // method. The scale bar, north arrow and ODbL credit are derived.
    {id:'map',type:'map_output',x:1210,y:0,params:{label:iso?'Isochrone plot':'Voronoi catchment map',inputMode:'polygons',presentation:'plot',contextPoints:iso,
      // THE DEATHS SIZED BY THEIR COUNT, chosen here, on the example's map, and not in the map's code (2026-11-27).
      layerSymbols:{locations:{sizeBy:'DEATHS'}},
      mapTitle:iso
        ?'Five-minute walk from the Broad Street pump, Soho, London, 1854'
        :'Nearest-pump catchments and cholera deaths, Soho, London, 1854',
      mapSubtitle:iso
        ?'Streets reachable on foot within 1, 5, 10 and 15 minutes at 75 m/min, drawn as a 25 m corridor. Walking time along the street network, not straight-line distance; it models reach, not who drank where.'
        :'Each cell is the ground closer to its own pump than to any other, by straight-line distance. A catchment is a statement about geometry, not about which pump anybody drank from.',
      mapSourceNote:'Deaths and pump locations: John Snow, On the Mode of Communication of Cholera, 2nd ed., 1855, as digitised by Robin Wilson (blog.rtwilson.com/john-snows-cholera-data-in-more-formats). Recomputed in Fieldwork; see the run receipt for method and versions.',
      showLegend:true}},
    // SPACED BY HEIGHT (2026-11-09): at 170 apart, Table, 317 px tall with its six inputs, lay under Chart, and a click on
    // Table's middle selected Chart (WebKit on Linux, every main run since 0.70). Each output now starts below the last.
    {id:'table',type:'table_output',x:1210,y:250,params:{label:'Catchment counts and deaths',inputMode:'polygons'}},
    {id:'chart',type:'chart_output',x:1210,y:590,params:{label:'Deaths by catchment',inputMode:'polygons',
      chartTitle:iso?'Deaths within each walking-time band':'Deaths in each nearest-pump catchment',
      subtitle:iso
        ?'Counted once per band, cumulatively: a death one minute from the pump is inside all four.'
        :'A death is counted in the catchment its address falls in. Counts are of recorded deaths, not of people who used that pump.',
      xAxisTitle:'Recorded deaths',
      yAxisTitle:iso?'Walking time from the pump':'Nearest pump',
      sourceNote:'Source: Snow 1855 death register, digitised by Robin Wilson; catchments recomputed in Fieldwork.'}},
  ];
  // ONE QUESTION EACH (experiment 210, the practitioner, 2026-11-12): the epidemic curve, the pump coordinates and Snow's
  // own map of the deaths moved to workflows of their own, `snow-curve` and `snow-deaths`.
  if(iso)nodes.push({id:'network',type:'network_input',x:20,y:415,params:{label:'Soho OSM network snapshot',
      // THE OBLIGATION TRAVELS WITH THE DATA, from 2026-10-27. `data.source` has said
      // "OpenStreetMap contributors" in prose since this example was written, and a figure used
      // to decide whether to credit them by testing its own method description for the word
      // "Dijkstra". The licence is declared here instead, so the credit follows the data rather
      // than a sentence somebody might reword.
      provenance:{licence:'ODbL-1.0',source:'OpenStreetMap contributors',
        what:'Soho street graph, GraphML snapshot from the PHI case study',
        licenceSource:'https://www.openstreetmap.org/copyright',
        note:'Date of OSM extraction unknown; this is a present-day graph and not an 1854 street reconstruction.'},inputMethod:'file',marginM:iso?750:250,data:structuredClone(graph)},references:[reference('network-source','Soho saved GraphML',isoSource+'outputs/soho.graphml','data','OpenStreetMap contributors, ODbL. Extraction date unknown. 738 nodes / 1619 directed edges; not a reconstructed 1854 network.')]});
  if(iso){
    const study=nodes.find(n=>n.id==='study')!;if(study.type==='study_area')study.params={source:'drawn',label:'Soho isochrone reporting extent (illustrative)',selectionMode:'bbox',geometry:{type:'Polygon',coordinates:[[[-.155,51.502],[-.119,51.502],[-.119,51.525],[-.155,51.525],[-.155,51.502]]]}};
    nodes.push({id:'context-pumps',type:'point_input',x:910,y:450,params:{label:'All eight pumps (map context)',data:{type:'FeatureCollection',features:pumps}},references:structuredClone(nodes.find(n=>n.id==='pumps')!.references)});
    nodes.push({id:'interactive',type:'map_output',x:1210,y:870,params:{label:'Interactive isochrone map',inputMode:'polygons',presentation:'interactive',contextPoints:true,layerSymbols:{locations:{sizeBy:'DEATHS'}}}});
    nodes.find(n=>n.id==='catchments')!.references!.push(reference('nb04-visual','NB04 Cell 15 plot and Folium map','https://github.com/PHI-Case-Studies/1854-Cholera-Outbreak-London-Advanced-1/blob/97a1d13dfb23032387ed23804e3d6f4dbc99aec7/NB04-Cholera-Case-Study-Isochrone-Map.ipynb','method','Visual target: executed Cell 15 and Cell 18. Fieldwork retains its independent computational method; cumulative counts are not notebook band counts.'));
  }
  const edges=[{id:'sites-catchments',from:'pumps',to:'catchments',port:'sites'},{id:'area-clip',from:'study',to:'clip',port:'area'},{id:'catchments-clip',from:'catchments',to:'clip',port:'polygons'},{id:'clip-summary',from:'clip',to:'summary',port:'polygons'},{id:'points-summary',from:'locations',to:'summary',port:'points'},...['map','table','chart'].map(id=>({id:'summary-'+id,from:'summary',to:id,port:'polygons'})),iso?{id:'network-catchments',from:'network',to:'catchments',port:'network'}:{id:'area-catchments',from:'study',to:'catchments',port:'area'}];
  if(iso){edges.push({id:'summary-interactive',from:'summary',to:'interactive',port:'polygons'},...['map','interactive'].map(to=>({id:'context-'+to,from:'context-pumps',to,port:'context'})));edges.push({id:'area-network',from:'study',to:'network',port:'area'});/* The network's own margin, 750 m, where a Buffer study area of 500 m stood until its retirement on 2026-11-06: the 500 plus the margin's 250, the same extent. The network is read from its file, so neither changes a result. */}

  return {schema:'fieldwork/workflow/1',exampleId:kind,name:iso?'Who lived within a walk of the Broad Street pump? Soho, 1854':'Which pump was nearest each death? Soho, London, 1854',nodes,edges};
}

/** The smallest John Snow workspace, over the three datasets the outbreak left behind.
 *
 *  None of them can be joined to another, and each is unjoinable for its own reason:
 *
 *  - **250 death locations** carry a place and **no date**.
 *  - **Snow's Table 1** carries dates and **no place**.
 *  - **Eight pump locations** carry a place and are **not cases at all** -- infrastructure, not
 *    people, so even sharing a coordinate system joins them to nothing.
 *
 *  The workspace shows all three and connects none of them to each other. The pumps appear on the
 *  map as context beside the hull, which is what Snow's own map did and is as far as the data
 *  licenses anyone to go: proximity is not transmission. `tests/epidemic-curve.browser.mjs` holds
 *  the same distinction for the other Snow examples by checking that no edge links the chains.
 *
 *  How far the outbreak reached: the 250 locations enclose **0.139 km2, 498 m at their widest**, and that tightness is
 *  Snow's finding: the deaths clustered within a short walk of one pump. A rule over the hull's area against a 0.25 km2
 *  threshold no source states ran here from experiment 113 until 2026-11-11, testing whether a rule can read a
 *  quantity derived from geometry; it retired with its ruleset (docs/audits/old-naledi-audit.md). The hull answers
 *  the question by itself. */
export function snowExtentExample():Workflow{
  const deaths=structuredClone(data.deaths) as PointFeature[],pumps=structuredClone(data.pumps) as PointFeature[];
  return {schema:'fieldwork/workflow/1',name:'How far did the outbreak spread? Soho, London, 1854',exampleId:'snow-extent',nodes:[
    {id:'deaths',type:'point_input',x:20,y:20,params:{label:'250 death locations (489 deaths)',
      data:{type:'FeatureCollection',features:deaths},
      sourceInfo:{format:'CSV',url:voronoiSource+'data/cholera_deaths.csv',description:'Cholera deaths, Soho 1854, digitised by Robin Wilson from Snow\u2019s map. These records carry a place and no date.'}},
      references:[reference('snow-deaths','Snow 1855, death locations','https://geodacenter.github.io/data-and-lab//snow/','data',
        'Death locations digitised from Snow\u2019s map. A location carries no date, so this dataset cannot be joined to Table 1.')]},
    {id:'extent',type:'summarize_hull',x:330,y:20,params:{label:'Observed extent of the outbreak',zone:30,hemisphere:'north'}},
    {id:'pumps',type:'point_input',x:330,y:230,params:{label:'Eight pump locations',
      data:{type:'FeatureCollection',features:pumps},
      sourceInfo:{format:'CSV',url:voronoiSource+'data/pumps.csv',description:'Pump locations, Soho 1854, digitised by Robin Wilson from Snow\u2019s map. Infrastructure, not cases.'}}},
    {id:'map',type:'map_output',x:640,y:230,params:{label:'Observed extent',inputMode:'polygons',presentation:'plot',contextPoints:true,
      mapTitle:'How far the 1854 Soho outbreak reached',
      mapSubtitle:'Convex hull of 250 death locations, measured in EPSG:32630, with the eight pumps for context',
      mapSourceNote:'John Snow, On the Mode of Communication of Cholera, 2nd ed., 1855, digitised by Robin Wilson. A hull is an outline of what was observed, not a boundary anyone agreed to, and it asserts area where nothing was seen.'}},
  ],edges:[
    {id:'deaths-extent',from:'deaths',to:'extent',port:'points'},
    {id:'extent-map',from:'extent',to:'map',port:'polygons'},
    {id:'pumps-map',from:'pumps',to:'map',port:'context'},
  ]};
}

const DATES_TABLE=()=>({id:'dates',type:'table_input' as const,x:20,y:20,params:{label:'Snow 1855 Table 1 · deaths by date',
  keys:['date'],valueField:'deaths',data:{kind:'data-table' as const,keys:['date'],valueField:'deaths',
    rows:dates.rows.map(row=>({key:{date:row.date},value:row.deaths})),
    rowCount:dates.rows.length,missingValueCount:0},
  source:{filename:'snow_dates.csv',bytes:828,sha256:'',rows:dates.rows.length}},
  references:[reference('snow-dates','Snow 1855, Table 1','https://geodacenter.github.io/data-and-lab//snow/','data',
    `Daily attacks and deaths for the Broad Street outbreak. ${dates.excludedUndated.attacks} attacks of unknown date are excluded, because a keyed table cannot hold an empty key. These records carry a date and no place.`)]});

/** WHERE WERE THE DEATHS? (experiment 210, 2026-11-12): Snow's own map, the deaths where they fell and the pumps among
 *  them, with nothing inferred; and where the pumps were measured, in the UTM frame every catchment of this project is
 *  computed in. Both were parts of the Voronoi workflow until it was split, one question per workflow. */
export function snowDeathsExample():Workflow{
  const pumps=structuredClone(data.pumps) as PointFeature[],deaths=structuredClone(data.deaths) as PointFeature[];
  const nodes:WorkflowNode[]=[
    // FITTED TO WHAT IS DRAWN (2026-11-12): the deaths and the pumps with a margin of about 60 m, so the figure is the
    // street, not the borough; the catchments keep their wider reporting rectangle.
    {id:'study',type:'study_area',x:20,y:20,params:{source:'drawn',label:'Around the deaths and the pumps (illustrative)',selectionMode:'bbox',
      geometry:{type:'Polygon',coordinates:[[[-.1407,51.5094],[-.131,51.5094],[-.131,51.5164],[-.1407,51.5164],[-.1407,51.5094]]]}}},
    {id:'locations',type:'point_input',x:20,y:225,params:{label:'250 death locations (489 deaths)',data:{type:'FeatureCollection',features:deaths},sourceInfo:{format:'CSV',url:voronoiSource+'data/cholera_deaths.csv',description:'This source subset has 250 locations; DEATHS totals 489.'}},references:[reference('deaths-source','Death location CSV',voronoiSource+'data/cholera_deaths.csv','data','Count locations and sum DEATHS separately. This is not the whole outbreak population or a mortality denominator.')]},
    {id:'pumps',type:'point_input',x:20,y:425,params:{label:'Eight pump locations',data:{type:'FeatureCollection',features:pumps},sourceInfo:{format:'CSV',url:voronoiSource+'data/pumps.csv',description:'Original FID retained in attributes; stable IDs prefixed pump-'}},references:[reference('pumps-source','Pump CSV',voronoiSource+'data/pumps.csv','data','Historical case-study point table; not a facility attendance record.')]},
    // ONE MARK PER ADDRESS, ITS AREA THE DEATHS THERE (experiment 210, 2026-11-12): 250 addresses carry 489 deaths, 1 to 15
    // each, which Snow drew as a stack of bars at each house. Proportional symbols say it in one mark per address.
    {id:'spot-map',type:'map_output',x:400,y:20,params:{
      label:'Deaths and pumps, as Snow drew them',inputMode:'spatial',presentation:'plot',pointInputCount:2,
      layerSymbols:{locations:{sizeBy:'DEATHS',size:3}},
      mapTitle:'Cholera deaths and public pumps, Soho, London, 1854',
      mapSubtitle:'One mark per address, its area in proportion to the deaths there (1 to 15; 489 at 250 addresses), with the '
        +'eight public pumps. Snow drew these counts as bars at each house. Nothing is inferred: no catchment, and no claim '
        +'about which pump anyone drank from.',
      mapSourceNote:'Deaths and pump locations: John Snow, On the Mode of Communication of Cholera, '
        +'2nd ed., 1855, as digitised by Robin Wilson (blog.rtwilson.com/john-snows-cholera-data-in-more-formats). '
        +'Drawn in CRS84; see the run receipt for method and versions.',
      showLegend:true}},
    // WHERE THE PUMPS WERE MEASURED: the frame, EPSG:32630, in which every catchment, area and distance of this project
    // is computed, shown as the coordinates themselves (kept here at the practitioner's choice, 2026-11-12).
    {id:'projected-table',type:'table_output',x:400,y:400,params:{label:'Pump coordinates in metres',inputMode:'spatial',coordinates:{zone:30,hemisphere:'north'}}},
  ];
  return {schema:'fieldwork/workflow/1',exampleId:'snow-deaths',name:'Where were the deaths? Soho, London, 1854',nodes,edges:[
    {id:'spot-area',from:'study',to:'spot-map',port:'area'},
    {id:'spot-points',from:'locations',to:'spot-map',port:'points'},
    {id:'spot-pumps',from:'pumps',to:'spot-map',port:'points_2'},
    {id:'pumps-projected-table',from:'pumps',to:'projected-table',port:'points'},
  ]};
}

/** WHEN DID PEOPLE DIE? (experiment 210, 2026-11-12): Snow's Table 1 as an epidemic curve, drawn once; it was drawn in
 *  three workflows before they were split. These records carry a date and no place, so nothing here joins them to the
 *  map: a location has no date and a dated count has no place. */
export function snowCurveExample():Workflow{
  return {schema:'fieldwork/workflow/1',exampleId:'snow-curve',name:'When did people die? Soho, London, 1854',nodes:[
    DATES_TABLE(),
    {id:'curve',type:'case_series',x:330,y:20,params:{label:'Deaths by day',source:'table',dateField:'date',dateKind:'death',period:'day'}},
    {id:'epidemic',type:'chart_output',x:640,y:20,params:{label:'Epidemic curve · by date of death',
      chartTitle:'Cholera deaths by date of death, Soho, London, 1854',
      subtitle:'Date of death, not date of onset or of report. The outbreak is conventionally dated from 31 August; the pump handle was removed on 8 September, by which time the curve had already turned.',
      xAxisTitle:'Date of death, 1854',
      yAxisTitle:'Recorded deaths',
      // THE DAY THE HANDLE CAME OFF, marked on the curve it is remembered against (experiment 210): from Snow's own account.
      markedDates:[{date:'1854-09-08',label:'Pump handle removed'}],
      sourceNote:'Source: John Snow, On the Mode of Communication of Cholera, 2nd ed., 1855, as digitised by Robin Wilson. 489 deaths at 250 distinct addresses.'}},
  ],edges:[
    {id:'dates-curve',from:'dates',to:'curve',port:'cases'},
    {id:'curve-epidemic',from:'curve',to:'epidemic',port:'records'},
  ]};
}
