/** WHAT EACH STEP COMPUTES: the output steps: chart, map and table. Moved out of
 *  `executeWorkflow` on 2026-11-25 (code review), one function per step type, each given the run's context rather
 *  than reaching into the executor. The text of each step is as it stood in the switch; a step that ended there now
 *  returns its value. */
import {areasBehindPolygons} from './areas-behind.js';
import {seriesChart} from './case-series.js';
import {polygonDisplay,polygonPresentationReceipt,shadeFeaturesOf} from './catchment-output.js';
import {tableChart} from './chart-output.js';
import {chartSpecificationFacts} from './chart-vega.js';
import {declaredUpstream,inDeclaredOrder,scalesOf} from './column-metadata.js';
import {mapOutput} from './map-output.js';
import {decisionPresentation} from './output-contract.js';
import {isPolygonPort} from './polygon-layers.js';
import {drawnDensity,isRasterPort,MAX_DRAWN_SIDE,type PanelScale,pooledBreaks,RAMPS,rasterMeasure,singleRasterScale,thinnedOutline} from './raster-panels.js';
import {rasterUnitsOf} from './raster-units.js';
import type {RasterGrid} from './raster.js';
import type {AreaValue,ChartSummary,DisplayValue} from './results.js';
import {tableOutput} from './table-output.js';
import type {PointCollection} from './types.js';
import type {StepContext} from './core.js';
import {drawnMode,inMetres,polygonsAsTable,shownMode} from './core.js';
import {resolveLayerSymbol,CARRIED_POINT_COLOUR} from './presentation.js';
import {layerSummary} from './point-layers.js';

export async function runChartOutput(ctx:StepContext<'chart_output'>):Promise<unknown>{
  const {inputs,node,receipts,runId,workflow}=ctx;
  let value:unknown;
  // WHICH EDGE IS CONNECTED DECIDES, and the stored mode is read only after that, so a
    // workflow saved under the old modes keeps drawing what it drew. A table arriving on
    // `records` is charted by its own declared shape: `keys` names the category column and
    // `valueField` the number, so nothing is asked for and nothing is guessed.
    const wired=(port:string)=>workflow.edges.find(e=>e.to===node.id&&e.port===port);
    const recordsEdge=wired('records');
    if(recordsEdge){
      const arrived=inputs.records as unknown as (DisplayValue&{series?:unknown;
        kind?:string;keys?:string[];valueField?:string;chart?:ChartSummary})|undefined;
      if(!arrived)throw new Error('Connect a table to this Chart.');
      // WHO INFECTED WHOM, as chains over time (experiment 200, step 5): drawn from the table's own rows.
      if(node.params.figure==='tree'){
        const t=node.params.tree;
        if(!t?.id||!t.parent||!t.date)throw new Error('Name the case id, infected-by and date columns in this Chart\u2019s Configure\u2026');
        const {transmissionTree,treeSentence}=await import('./transmission-tree.js');
        const tree=transmissionTree(arrived as unknown as import('./data-table.js').DataTable,t);
        const sentence=treeSentence(tree);
        const q=(v:string)=>JSON.stringify(v),n=(v:number)=>`"${v}"^^xsd:integer`;
        const facts=`@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n`
          +`<urn:fieldwork:run:${runId}:view:${node.id}> a fw:TransmissionTree, prov:Activity; `
          +`prov:used <urn:fieldwork:run:${runId}:output:${recordsEdge.from}>;\n`
          +`  fw:caseIdColumn ${q(t.id)}; fw:infectorColumn ${q(t.parent)}; fw:caseDateColumn ${q(t.date)};\n`
          +`  fw:casesDrawn ${n(tree.counts.cases)}; fw:chainsDrawn ${n(tree.counts.chains)}; fw:linksDrawn ${n(tree.counts.links)};\n`
          +`  fw:casesNoInfector ${n(tree.counts.noInfector)}; fw:casesInfectorNotFound ${n(tree.counts.unknownInfector)};\n`
          +`  fw:casesUndated ${n(tree.counts.undated)}; fw:casesInLoop ${n(tree.counts.inLoop)}.\n`;
        value={kind:'transmission-tree',tree,sentence,rows:[],centers:[]} as unknown as DisplayValue;
        receipts.push({nodeId:node.id,kind:'presentation',facts,rules:'',input:facts,conclusions:[],method:sentence});
        return value;
      }
      // A CASE SERIES IS STILL A TABLE, and it carries its periods with it: the curve is
      // drawn from the shape that arrived rather than from a mode somebody selected. Its receipt states the period and the
      // kind of date, as the retired `series` port's did (2026-11-12, Chart's ports standardized: Table and Polygon summaries).
      // WHAT THE SOURCES DECLARED, followed to this chart by column name (experiment 211).
      const said=scalesOf(declaredUpstream(workflow.nodes,workflow.edges,node.id));
      if(arrived.series){const series=arrived.series as Parameters<typeof seriesChart>[0];const drawn=seriesChart(series);const source=recordsEdge.from;
        // A series split by an ordinal column is drawn in its declared order, panel by panel and in the stack.
        const by=drawn.groupedBy?said[drawn.groupedBy]:undefined;
        const chart=by&&drawn.panels?{...drawn,panels:inDeclaredOrder(drawn.panels,p=>p,by)}:drawn;
        const facts=`@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n<urn:fieldwork:run:${runId}:view:${node.id}> a fw:ChartView, prov:Activity; prov:used <urn:fieldwork:run:${runId}:output:${source}>; fw:groupingField "period"; fw:eventDateKind ${JSON.stringify(series.dateKind)}.\n`+chartSpecificationFacts(node,runId,source,chart,series.weightField?'numeric-total':'record-count');
        value={...structuredClone(arrived) as unknown as DisplayValue,chart,rows:[],centers:[]};receipts.push({nodeId:node.id,kind:'presentation',facts,rules:'',input:facts,conclusions:[],method:chart.caption});return value;}
      const chart=arrived.series
        ?seriesChart(arrived.series as Parameters<typeof seriesChart>[0])
        // A table that already carries its own chart keeps it. A rate's chart states the
        // vintage disagreement and the groups it could not report, which a chart derived
        // from the rows alone cannot know.
        :arrived.chart??tableChart(arrived as unknown as import('./data-table.js').DataTable,
          node.params.keyColumn,node.params.panelsBy,said,node.params.panelColumns);
      // THE ORDER THE PRACTITIONER CHOSE, attached where the node's parameters are known so
      // every renderer downstream reads it off the summary rather than being told separately.
      // `orderBins` ignores it where the categories are a sequence, so an epidemic curve
      // stays in its days whatever is stored here. Experiment 156's first assertion.
      const ordered=node.params.barOrder&&node.params.barOrder!=='category'
        ?{...chart,barOrder:node.params.barOrder}:chart;
      const measure=chart.measure??'record-count';
      const facts=`@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n`
        +`<urn:fieldwork:run:${runId}:view:${node.id}> a fw:ChartView, prov:Activity; `
        +`prov:used <urn:fieldwork:run:${runId}:output:${recordsEdge.from}>; `
        +`fw:groupingField ${JSON.stringify(chart.categoryTitle??chart.field)}`
        +`${chart.unit?`; fw:chartValueUnit ${JSON.stringify(chart.unit)}`:''}.\n`
        +chartSpecificationFacts(node,runId,recordsEdge.from,chart,measure);
      value={...structuredClone(arrived) as unknown as DisplayValue,chart:ordered,
        rows:[],centers:[]};
      receipts.push({nodeId:node.id,kind:'presentation',facts,rules:'',input:facts,
        conclusions:[],method:chart.caption});
      return value;
    }
  if(node.params.inputMode==='polygons'){const shown=polygonDisplay(inputs.polygons,'chart');value=shown;const sourceId=workflow.edges.find(e=>e.to===node.id&&e.port==='polygons')!.from;const receipt=polygonPresentationReceipt(node,sourceId,runId);receipt.facts+=chartSpecificationFacts(node,runId,sourceId,shown.chart!,shown.chart!.field==='total'?'numeric-total':'location-membership-count');receipt.input=receipt.facts;receipts.push(receipt);return value;}
    // NOTHING CONNECTED IS A SENTENCE, not a crash. A chart insists on no particular port
    // now, so the last branch could be reached with no edge at all and took `.from` off
    // undefined. The map says this in its own words and this says it in the chart's.
    throw new Error(`Connect something to "${node.params.label||node.id}". `
      +'A Chart draws bars from what it is given \u2014 a table of categories and numbers, or a '
      +'summarised polygon layer \u2014 and nothing is connected to it.');
}

export async function runMapOutput(ctx:StepContext<'map_output'>):Promise<unknown>{
  const {inputs,node,pointInputs,receipts,runId,values,workflow}=ctx;
  let value:unknown;
  const mode=drawnMode(node,workflow.edges);
    // A map insists on no particular port and still insists on something: it draws what it is
    // given, so given nothing it has nothing to draw. The refusal used to name the port the
    // mode had chosen -- "needs its network input connected" -- which told a practitioner
    // about a setting rather than about their canvas.
    if(!workflow.edges.some(e=>e.to===node.id))
      throw new Error(`Connect a layer to "${node.params.label||node.id}". A Map draws the layers it is given — an area, points, polygons, a raster or a street network — and nothing is connected to it.`);
    if(mode==='network'){
    const network=inputs.network as import('./catchments.js').Network;
    if(!network?.nodes?.length)throw new Error('Connect a Street network: this Map is set to show a network and none is connected.');
    const source=workflow.edges.find(e=>e.to===node.id&&e.port==='network')!.from;
    // The study area is drawn WITH the streets when both are connected. The practitioner,
    // 2026-10-20: *"When I add both the study area and street network to the Map, the study
    // area polygon does not show up."* It did not, because this value carried the network
    // alone: a map is single-MODE, and the mode that wins drops every other layer from the
    // value before any renderer sees it. The Inspector's own network preview has drawn the
    // area behind the streets since it existed, which is what made the omission visible.
    const drawnArea=inputs.area as {boundary?:unknown;bounds?:unknown}|undefined;

    // AND THE POINTS ARE DRAWN WITH THEM. The practitioner, 2026-10-22: *"The map output does
    // not show health facilities layer despite the widget being connected to map input. Only
    // the street network layer shows up on the map."* This is the same defect as the study
    // area's, reported 2026-10-20 and fixed by adding `boundary` to the object below and
    // nothing else: `rows:[]` went on throwing away every point layer before a renderer saw
    // one, so the Leaflet layer control offered two layers for three wired ports and the
    // review counts above the map all read zero.
    //
    // The note at `drawnMode` excuses a lost layer on the grounds that no renderer draws
    // both. That is true of polygons and a raster. It is NOT true here: mountCatchmentMap
    // draws the street network and the point layers into one map, and has since it existed.
    // So when points are wired the map is built as the spatial map it is, and the network
    // joins it as a layer rather than replacing it.
    const wiredLayers=pointInputs().layers;
    if(wiredLayers.length&&inputs.area){
      const mapped=mapOutput(node,{area:inputs.area,points:pointInputs()},runId);
      value={...mapped.value,network:structuredClone(network),
        // AND THE RASTER IS DRAWN WITH THEM. Third instance of one defect: the study area was
        // dropped here on 2026-10-20, the facilities on 2026-10-22, and the raster until
        // 2026-10-23, each because the winning mode threw away every other wired layer.
        ...(inputs.raster?{raster:inputs.raster}:{})} as unknown as DisplayValue;
      if(mapped.receipt){
        // One receipt for one node: the network's own counts are asserted onto the map view
        // the points receipt already describes, rather than a second receipt the reader of
        // `receipts.find(nodeId)` would never reach.
        mapped.receipt.facts+=`<urn:fieldwork:run:${runId}:map:${node.id}> `
          +`prov:used <urn:fieldwork:run:${runId}:output:${source}>; `
          +`fw:networkJunctionCount ${network.nodes.length}; `
          +`fw:networkSegmentCount ${network.edges.length}.\n`;
        mapped.receipt.input=mapped.receipt.facts;
        mapped.receipt.method=`${mapped.receipt.method} The street network is drawn as itself; `
          +'no routing, no simplification and no new inference.';
        receipts.push(mapped.receipt);
      }
      return value;
    }
    value={kind:'network-map',network:structuredClone(network),
      ...(drawnArea?.boundary?{boundary:structuredClone(drawnArea.boundary),bounds:drawnArea.bounds}:{}),
      // The raster is ground, and ground survives whichever mode won. Patching only the
      // branch above left this one still dropping it, which is the same mistake in miniature:
      // a layer is carried where somebody remembered to carry it.
      ...(inputs.raster?{raster:inputs.raster}:{}),
      rows:[],centers:[]} as unknown as DisplayValue;
    const activity=`<urn:fieldwork:run:${runId}:map:${node.id}>`;
    const facts='@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n'
      +`${activity} a fw:MapView, prov:Activity; prov:used <urn:fieldwork:run:${runId}:output:${source}>; `
      +(workflow.edges.find(e=>e.to===node.id&&e.port==='area')
        ?`prov:used <urn:fieldwork:run:${runId}:output:${workflow.edges.find(e=>e.to===node.id&&e.port==='area')!.from}>; `:'')
      +`fw:networkJunctionCount ${network.nodes.length}; fw:networkSegmentCount ${network.edges.length}.\n`
      +`<urn:fieldwork:run:${runId}:output:${node.id}> a prov:Entity; prov:wasGeneratedBy ${activity}.\n`;
    receipts.push({nodeId:node.id,kind:'presentation',facts,input:facts,rules:'',conclusions:[],
      method:'Draw the downloaded street graph as itself; no routing, no simplification and no new inference.'});
    return value;}
  if(mode==='polygons'){
    const shown=polygonDisplay(inputs.polygons,'map') as DisplayValue;
    const polygonSource=workflow.edges.find(e=>e.to===node.id&&isPolygonPort(e.port))!.from;
    const contextSource=workflow.edges.find(e=>e.to===node.id&&e.port==='context')?.from;
    const receipt=polygonPresentationReceipt(node,polygonSource,runId,contextSource);
    // EVERY POLYGON LAYER IT DREW, used: one per input since Collect polygon layers retired.
    for(const e of workflow.edges.filter(e=>e.to===node.id&&isPolygonPort(e.port)&&e.from!==polygonSource)){
      const used=`<urn:fieldwork:run:${runId}:output:${node.id}:view> prov:used <urn:fieldwork:run:${runId}:output:${e.from}>.\n`;
      receipt.facts+=used;receipt.input=(receipt.input??'')+used;}
    // THE FOURTH TIME A WINNING MODE THREW THE OTHER LAYERS AWAY. The study area went on
    // 2026-10-20, the facilities on 2026-10-22, the raster on 2026-10-23 -- each patched one
    // layer at a time -- and on 2026-10-28 a practitioner wired a study area, four points and
    // a polygon layer to one map and got the polygons alone: *"workflow shows much more
    // connected but did not show up as layers."* The Sources line named all three, because it
    // is built from the EDGES, while the value was built from the winner.
    //
    // `drawnMode` still picks which renderer leads, and it is no longer what decides which
    // layers survive. This branch composes the same way the raster branch learned to on
    // 2026-10-23: where an area is wired, the spatial map is built from it and from every
    // point layer beside it, and the polygons join it as a layer rather than replacing it.
    const beside=pointInputs().layers;
    // THE POINTS THE POLYGONS CARRY ARE A LAYER OF THE MAP (2026-11-27). The practitioner, on Snow's Voronoi map: the
    // preview sized the deaths and drew them over the catchments, and the result drew them small and lost under them --
    // *"These inconsistencies make the worked example not credible."* Two renderers drew these points their own way,
    // one by a column it named itself. As a point layer they are drawn as every point layer is, everywhere, with the
    // symbol set for that layer in Configure…; the polygons stop carrying them to be drawn a second way.
    const shownPolygons=shown.polygons as (NonNullable<DisplayValue['polygons']>&{observations?:PointCollection;observationsFrom?:{id:string;label:string}})|undefined;
    const carried=shownPolygons?.observations?.features?.length&&shownPolygons.observationsFrom&&!beside.some(l=>l.sourceNodeId===shownPolygons.observationsFrom!.id)
      ?{...structuredClone(shownPolygons.observations),sourceNodeId:shownPolygons.observationsFrom.id,label:shownPolygons.observationsFrom.label,port:'carried'} as import('./types.js').PointLayer:undefined;
    // POINTS WIRED AND NO AREA IS A REFUSAL, NOT A QUIET LOSS. Reported 2026-10-29: a map
    // carrying a polygon layer and a point layer drew the polygons and nothing else, because
    // the composition below is gated on an area and this branch simply fell past it. That is
    // the fifth time this widget has dropped a connected layer without saying so -- the study
    // area on 2026-10-20, the facilities on 2026-10-22, the raster on 2026-10-23, the
    // polygons on 2026-10-28 -- and the fourth of those was fixed by composing WHERE AN AREA
    // EXISTS, which left this case exactly as it was.
    //
    // A map places its points by their relation to an area, and there is no vocabulary here
    // for "no area was connected": `SpatialRelation` is Inside, Boundary, Outside or
    // MissingLocation. So the honest answer is the one the spatial branch already gives, in
    // the same words, rather than inventing a fifth relation or drawing points that claim a
    // relation to nothing.
    // THE STUDY AREAS A POLYGON LAYER WAS READ FROM ARE AREAS (the practitioner, 2026-11-22: "The study area is a
    // requirement for the map unless it can query upstream that in fact two areas are connected"). South Sudan and
    // DR Congo through Polygon layer into Map, with pins: the points are placed against the areas together.
    const upstream=inputs.area?undefined:areasBehindPolygons(workflow,node.id,values);
    if(upstream)(inputs as unknown as {area:AreaValue}).area=upstream;
    if(beside.length&&!inputs.area)
      throw new Error(`Connect a study area to "${node.params.label||node.id}". A Map places `
        +`its points by their relation to an area \u2014 inside it, on its boundary, or `
        +`outside \u2014 so the ${beside.length} point layer`
        +`${beside.length===1?'':'s'} connected here have nothing to be placed against. The `
        +`same Study area the rest of this workflow uses will do.`);
    if(inputs.area){
      const wired=pointInputs();
      const mapped=mapOutput(node,{area:inputs.area,points:carried?{...wired,layers:[...wired.layers,carried]}:wired},runId);
      // CONTEXT, WHERE POINTS ARE DRAWN OVER THEM (2026-11-23): the polygons keep their names and their popups and
      // lose the hue per feature, which says "different things" about ground a point is placed on.
      value={...mapped.value,
        // A COPY WITHOUT THE CARRIED POINTS: the run's polygons may feed other outputs, which keep theirs.
        polygons:shadeFeaturesOf((carried?{...shown.polygons,observations:undefined}:shown.polygons) as NonNullable<DisplayValue['polygons']>,
          // A LINE LAYER COUNTS AS A SUBJECT, as points do (the practitioner, 2026-11-24).
          (beside.length>0||!!node.params.contextPoints
            ||!!(inputs as unknown as {lines?:unknown}).lines)&&shown.polygons?.fromStudyAreas===true,
          node.params.shadeFeatures),
        polygonPresentation:node.params.presentation||'plot'} as unknown as DisplayValue;
      if(node.params.contextPoints)
        (value as DisplayValue).contextPoints=(inputs as unknown as {context:PointCollection}).context;
      // ONE RECEIPT, so what the polygon presentation already states is untouched and the
      // map's own facts about the area and the points it drew are added to it.
      if(mapped.receipt){
        receipt.facts+=mapped.receipt.facts;
        receipt.input=receipt.facts;
        receipt.method=`${receipt.method} Drawn over the connected study area`
          +`${beside.length?` with ${beside.length} point layer${beside.length===1?'':'s'} `
            +'wired beside it':''}; no clipping and no new inference.`;
      }
      receipts.push(receipt);
      return value;
    }
    value=shown;
    // WITH NO AREA, THE SAME RULE (2026-11-27): the carried points are not placed against an area, so they stay with the
    // polygons, but they are declared a layer of the map, so Configure… offers their symbol, and the symbol set there is
    // what both renderers draw them with.
    if(shownPolygons?.observations?.features?.length&&shownPolygons.observationsFrom){
      const from=shownPolygons.observationsFrom;
      const chosen=node.params.layerSymbols?.[from.id];
      // THE PALETTE'S OBSERVATION COLOUR UNLESS CHOSEN: the hue the figure's key names for observations, which stands off a
      // shaded fill. Red was tried and broke the key's agreement and the colour-blind-safe palette (2026-11-27).
      value={...shown,polygons:{...shownPolygons,observationSymbol:{...resolveLayerSymbol(0,chosen),colour:chosen?.colour||CARRIED_POINT_COLOUR}},
        pointLayers:layerSummary([{...shownPolygons.observations,sourceNodeId:from.id,label:from.label,port:'carried'}])} as unknown as DisplayValue;}
    (value as DisplayValue).polygonPresentation=node.params.presentation||'plot';
    if(node.params.contextPoints)(value as DisplayValue).contextPoints=(inputs as unknown as {context:PointCollection}).context;
    receipts.push(receipt);
    return value;}if(mode==='raster'){
    // GRID CELLS IN PANELS, ONE SCALE (Map's manual, History: panels): several rasters, or an arrangement, draw each raster's people per
    // km² in a panel of its own, every panel classed together.
    const rasterFed=workflow.edges.filter(e=>e.to===node.id&&isRasterPort(e.port)).sort((a,b)=>a.port.localeCompare(b.port,'en',{numeric:true}));
    if(rasterFed.length>1||node.params.arrangement){
      // WHAT EACH PANEL SHOWS, from its raster's stated unit unless Configure… says (2026-11-17): a count per km², or
      // the cell's value. Counts share one scale; values share one per unit. One scale, one key.
      const shading=node.params.rasterShading??{};
      const scales:PanelScale[]=[],layerOf=(id:string)=>workflow.nodes.find(n=>n.id===id)?.params.label||id;
      const unstated:string[]=[];
      const panels=rasterFed.map(e=>{const grid=values.get(e.from) as RasterGrid,layer=layerOf(e.from);
        const measure=rasterMeasure(grid.asset?rasterUnitsOf(grid.asset)?.units:undefined);
        const mode=shading.show==='cell-value'?'value':shading.show==='per-km2'?'density':measure.kind==='count'?'density':'value';
        if(!measure.stated)unstated.push(layer);
        const key=mode==='density'?'density':`value:${measure.unit}`;
        let at=scales.findIndex(x=>(x.mode==='density'?'density':`value:${x.label}`)===key);
        if(at<0){at=scales.length;scales.push({mode,label:mode==='density'?'':measure.unit||'value, unit not stated',
          ramp:shading.ramp??(mode==='density'?'YlOrRd':'viridis'),classes:shading.classes??'quantile',breaks:[],layers:[],noun:''});}
        const scale=scales[at]!;scale.layers.push(layer);
        if(mode==='density'&&measure.stated&&!scale.noun)scale.noun=measure.noun;
        return drawnDensity(grid,layer,MAX_DRAWN_SIDE,mode,at);});
      for(const [k,scale] of scales.entries()){
        if(scale.mode==='density')scale.label=`${scale.noun||'count'} per km²${unstated.length?` (unit not stated for ${unstated.join(', ')}; read as a count per cell)`:''}`;
        scale.breaks=pooledBreaks(panels.filter(p=>p.scale===k),RAMPS[scale.ramp].length,scale.classes,scale.mode);}
      const breaks=scales[0]!.breaks;
      const first=values.get(rasterFed[0]!.from) as RasterGrid;
      const shown=decisionPresentation(node,{kind:'raster-map',raster:{...first,values:new Float32Array(0)},boundary:first.boundary,rows:[],centers:[]},rasterFed[0]!.from,runId);
      // THE POINTS OVER THE CELLS (2026-11-22, the practitioner: "I also have one push pin and it does not show up on the
      // map"): every point layer wired to the Map, by its step's name, drawn over every raster.
      const rasterPoints=pointInputs().layers.map(layer=>({layer:layer.label||layer.sourceNodeId,
        points:layer.features.filter(f=>f.geometry).map(f=>({lon:f.geometry!.coordinates[0]!,lat:f.geometry!.coordinates[1]!,name:String(f.properties?.name??f.id??'')}))}))
        .filter(l=>l.points.length);
      // THE MAP'S OWN STUDY AREA, its outline a layer of its own (2026-11-22: Manage layers could not show, hide or group it).
      const areaBoundary=(inputs as unknown as {area?:{boundary?:import('./types.js').Boundary}}).area?.boundary;
      value={...shown.value,rasterPanels:panels,densityBreaks:breaks,panelScales:scales,...(rasterPoints.length?{rasterPoints}:{}),
        ...(areaBoundary?{rasterArea:thinnedOutline(areaBoundary)}:{})} as unknown as DisplayValue;
      const used=rasterFed.slice(1).map(e=>`<urn:fieldwork:run:${runId}:map:${node.id}> prov:used <urn:fieldwork:run:${runId}:output:${e.from}>.\n`).join('');
      const said=scales.map(x=>`${x.layers.join(', ')}: ${x.mode==='density'?`${x.label} of each cell's area on the sphere`:`${x.label}, the mean of the cells under each drawn cell`}, in ${x.breaks.length+1} ${x.classes==='equal'?'equal steps':'quantile classes'}`).join('; ');
      shown.receipt.facts+=used+`<urn:fieldwork:run:${runId}:map:${node.id}> fw:drawnAs ${JSON.stringify(`${said}; at most ${MAX_DRAWN_SIDE} drawn cells a side`)}^^<http://www.w3.org/2001/XMLSchema#string>.\n`;
      shown.receipt.input=shown.receipt.facts;receipts.push(shown.receipt);return value;
    }
    const source=workflow.edges.find(e=>e.to===node.id&&e.port==='raster')!.from;
    // THE SAME FIX THE NETWORK BRANCH ABOVE ALREADY HAS. `rows:[]` threw away every point
    // layer wired beside the raster before a renderer could see one, so the map drew cells
    // alone and the layer list under it had nothing to list. The network branch learned this
    // on 2026-10-22 and this one was left; a layer is carried where somebody remembered to
    // carry it. When points are wired the map is built as the spatial map it is, and the
    // raster joins it as ground.
    const rasterLayers=pointInputs().layers;
    // ONE RASTER, SHADED BY THE PANELS' RULE (2026-11-17): its unit decides a count per km² or its value.
    const rasterScale=singleRasterScale(inputs.raster,workflow.nodes.find(n=>n.id===source)?.params.label||source,
      inputs.raster.asset?rasterUnitsOf(inputs.raster.asset)?.units:undefined,node.params.rasterShading);
    if(rasterLayers.length&&inputs.area){
      const mapped=mapOutput(node,{area:inputs.area,points:pointInputs()},runId);
      value={...mapped.value,raster:inputs.raster,rasterScale} as unknown as DisplayValue;
      if(mapped.receipt){
        mapped.receipt.facts+=`<urn:fieldwork:run:${runId}:map:${node.id}> `
          +`prov:used <urn:fieldwork:run:${runId}:output:${source}>.\n`;
        mapped.receipt.input=mapped.receipt.facts;
        mapped.receipt.method=`${mapped.receipt.method} The raster is drawn as ground beneath `
          +'the layers wired beside it; no resampling and no new inference.';
        receipts.push(mapped.receipt);
      }
      return value;
    }
    const shown=decisionPresentation(node,{kind:'raster-map',raster:inputs.raster,boundary:inputs.raster.boundary,rows:[],centers:[]},source,runId);
    value={...shown.value,rasterScale} as unknown as DisplayValue;
    shown.receipt.facts+=`<urn:fieldwork:run:${runId}:map:${node.id}> fw:drawnAs ${JSON.stringify(`${rasterScale.mode==='density'?`${rasterScale.label} of each cell's area on the sphere`:`${rasterScale.label}, as each cell holds it`}, in ${rasterScale.breaks.length+1} ${rasterScale.classes==='equal'?'equal steps':'quantile classes'}`)}^^<http://www.w3.org/2001/XMLSchema#string>.\n`;
    shown.receipt.input=shown.receipt.facts;receipts.push(shown.receipt);return value;}// A MAP OF POINTS NEEDS SOMETHING TO PUT THEM ON. The relation every row carries -- inside,
    // on the boundary, outside -- is a relation TO the study area, so without one there is no
    // map to draw and `mapOutput` read `boundary` off nothing: "Cannot read properties of
    // undefined (reading 'boundary')", reported 2026-10-21 on a Map wired to a deduplication
    // and nothing else. A refusal that names the node and the port is the least this owes.
    // A MAP OF LINES ALONE draws them in their own frame (experiment 229): there are no points to place against an area.
    if(!inputs.area&&!pointInputs().layers.length&&(inputs as unknown as {lines?:unknown}).lines){
      value={kind:'spatial-map',rows:[],centers:[],label:node.params.label||'Map'} as unknown as DisplayValue;return value;}
    if(!inputs.area)throw new Error(`Connect a study area to "${node.params.label||node.id}". `
      +`A Map places its points by their relation to an area -- inside it, on its boundary, or `
      +`outside -- so points alone have nothing to be placed against. The same Study area the `
      +`rest of this workflow uses will do.`);
    const mapped=mapOutput(node,{area:inputs.area,points:pointInputs()},runId);value=mapped.value;if(mapped.receipt)receipts.push(mapped.receipt);return value;
}

// The renderer follows the connections, not a stored mode: shownMode.
export async function runTableOutput(ctx:StepContext<'table_output'>):Promise<unknown>{
  const {inputs,node,pointInputs,receipts,runId,workflow}=ctx;
  let value:unknown;
  const shown=shownMode(node,workflow.edges);if(shown==='table'){value={...structuredClone(inputs.table),centers:[],pointTable:true} as unknown as DisplayValue;const viewFacts=`@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n<urn:fieldwork:run:${runId}:view:${node.id}> a fw:TableView, prov:Activity; prov:used <urn:fieldwork:run:${runId}:table:${workflow.edges.find(e=>e.to===node.id&&e.port==='table')!.from}>.\n`;receipts.push({nodeId:node.id,kind:'presentation',facts:viewFacts,rules:'',input:viewFacts,conclusions:[]});return value;}if(shown==='polygons'){value={...polygonsAsTable(inputs.polygons as never),centers:[],pointTable:true} as unknown as DisplayValue;receipts.push(polygonPresentationReceipt(node,workflow.edges.find(e=>e.to===node.id&&e.port==='polygons')!.from,runId,workflow.edges.find(e=>e.to===node.id&&e.port==='context')?.from));return value;}const table=tableOutput(node,{points:inMetres(node,pointInputs())},runId);value=table.value;receipts.push(table.receipt);return value;
}
