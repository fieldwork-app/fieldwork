import {escapeHtml} from './html-escape.js';
import {fillWords,figureWords} from './figure-words.js';
import {lineLayersOf} from './map-lines.js';
import {rampFor} from './raster-image.js';
import type {Output,Receipt} from './results.js';
import {generationColours,bandColour,bandTimes,BAND_OPACITY,CARRIED_POINT_COLOUR} from './presentation.js';
import type {WorkflowNode,Workflow} from './types.js';
import {basemapAvailable,basemapOf,keyedProvider} from './basemaps.js';
import {attributionsFor,provenanceOf} from './input-provenance.js';
import type {LayerShape} from './presentation.js';
import {groupedKey,polygonShading,shadedValues,classRanges,markPath,resolveLayerSymbol,SPATIAL_RELATION_FILL,FIGURE_PALETTE_NAME,FIGURE_PALETTE_AUTHORITY,MARK_VOCABULARY,FIGURE_ROLE,FIGURE_TYPE,FIGURE_PALETTE,scaleBarSvg,northArrowSvg,classifyValues,categoricalSteps} from './presentation.js';
import {applyDesignRules,figureDesign,designRuleFacts,designRuleDeclarations,designChoiceFacts} from './map-conformance.js';

export interface MapPresentation {title:string; subtitle:string; sourceNote:string; legend:boolean; items:{label:string;color:string;shape?:LayerShape;hollow?:boolean;line?:boolean;opacity?:number}[]; presentation:'plot'|'interactive'; basemap:import('./types.js').BasemapChoice;
  /** Licence and attribution for the data shown. Separate from the source note because a note is
   *  editorial and this is an obligation: an OSM-derived layer must say ODbL and credit
   *  contributors wherever the figure ends up, and a figure that travels without it is not
   *  publishable however complete it otherwise looks. */
  attribution:string;
  /** The part of `attribution` that credits the basemap, so a figure drawn without its ground can leave it out. */
  basemapCredit?:string}

/** A map specification describes presentation; it never changes source geometries or decisions. */

/** The key a value-classed polygon layer deserves: one entry per class, labelled by the values
 *  that bound it, drawn from the same classification the figure colours with. Null when nothing
 *  carries a value, which is every catchment figure. */
function classedItems(polygons:{valueName?:string;features:{value?:number;category?:string;frames?:Record<string,number|null>;ring?:boolean|'secondary'}[]}):{label:string;color:string;hollow?:boolean}[]|null{
  // A CATEGORY OUTRANKS A VALUE, as it does in the figure. A joined layer that a ruleset then
  // classified carries both, and until 2026-11-02 this keyed Nigeria's priority map by zero-dose
  // ranges over polygons shaded by rule class.
  const {grouped,classed}=polygonShading(polygons.features);
  // A CLASS DRAWN ONLY AS RINGS is keyed as a ring, and a ring among filled ones beside them: the rule both maps share.
  if(grouped)return groupedKey(polygons.features);
  if(!classed)return null;
  const ranges=classRanges(shadedValues(polygons.features),classed.breaks);
  // WHAT THE NUMBERS ARE, on the first class, where the layer says (2026-11-13: Botswana's districts read "31005 to 61001").
  const named=polygons.valueName?.trim();
  return classed.colours.map((color,i)=>({label:`${i===0&&named?`${named}: `:''}${ranges[i]}`,color}));
}

/** One entry per named region, in the hues the renderers draw them in.
 *
 *  Null where the features are a SEQUENCE rather than a set of names -- travel-time bands carry
 *  `minutes` and are keyed by the band, not one entry each -- and null where there are more
 *  regions than there are distinct hues. 33 sub-districts is a layer, not a legend; the entry
 *  then says what the layer is and how many parts it has, which is the honest answer and the one
 *  the layer control already gives.
 *
 *  Every region is still drawn either way: what changes is whether hue carries the naming. */
function categoricalKey(polygons:{layerName?:string;featuresNamed?:boolean;features:{id:string;name:string;value?:number;minutes?:number}[]}):
  {label:string;color:string}[]|null{
  const name=polygons.layerName?.trim();
  // A HUE PER FEATURE ONLY WHERE THE FEATURES ARE NAMED THINGS. Five water polygons read with no
  // naming property were drawn in five colours and keyed "Feature 2, Feature 5, Feature 33" on
  // 2026-10-29: five categories asserted over one layer of five parts. A read numbers what it
  // could not name, so the name alone cannot tell them apart -- the layer says which it is.
  if(polygons.featuresNamed===false)
    return [{label:`${name||'Polygons'} \u00b7 ${polygons.features.length.toLocaleString()} features`,
      color:FIGURE_ROLE.primary}];
  const features=polygons.features;
  if(!features.length||features.some(f=>f.minutes!==undefined))return null;
  if(features.some(f=>typeof f.value==='number'))return null;
  const hues=categoricalSteps(features.length);
  // Past the palette there are no distinct hues to key, so the entry says what the layer is and
  // how many parts it has -- which is what the layer control and the popups already answer.
  // A PUBLISHED FIGURE CANNOT SEND ITS READER TO A CONTROL. This said "see the layer list",
  // which is a panel in the application and nothing at all on paper -- reported 2026-10-29 off a
  // figure of 279 Thames water areas. The key says what the layer is and how many parts it has,
  // which is everything the figure itself can support.
  if(!hues)return [{label:`${name||'Polygons'} \u00b7 ${features.length.toLocaleString()} features`,
    color:FIGURE_ROLE.primary}];
  return features.map((f,i)=>({label:f.name||f.id,color:hues[i]}));
}

export function mapPresentation(node:WorkflowNode<'map_output'>,output:Output,workflow:Workflow):MapPresentation{
  const upstream=workflow.edges.filter(e=>e.to===node.id).map(e=>workflow.nodes.find(n=>n.id===e.from)?.params.label||e.from);
  const sourceNote=fillWords(node.params.mapSourceNote?.trim(),figureWords())||`Sources: ${upstream.join(', ')||'connected workflow inputs'} · CRS84. ${output.polygons?.method||output.method||''}`.trim();
  // Colours come from FIGURE_ROLE, so the same meaning carries the same hue here, in the plot and
  // in a chart placed beside it. They were eight unrelated hex literals until 2026-10-13.
  const R=FIGURE_ROLE;
  let items:MapPresentation['items']=[];
  if(output.polygons){
    items=output.polygons.kind==='hexbin'&&!polygonShading(output.polygons.features).classed?[{label:'Released H3 cell',color:R.primary},{label:'Sparse cells omitted',color:R.background}]:output.polygons.features.some(f=>f.minutes!==undefined)?[
      // ONE ENTRY PER TRAVEL TIME, in the band's own see-through colour, and the carried points in their layer's symbol
      // (2026-11-27): the key named one "travel-time region" in a hue no band was drawn in once the bands took tab10.
      ...bandTimes(output.polygons.features).map(t=>({label:`Within ${t} min`,color:bandColour(t,bandTimes(output.polygons!.features)),opacity:BAND_OPACITY})),
      {label:output.polygons.observationsFrom?.label??'Observations',color:output.polygons.observationSymbol?.colour??CARRIED_POINT_COLOUR},
      {label:'Sites / context',color:R.site,shape:'square'}
    ]:classedItems(output.polygons)
      // THE KEY AND THE PLOT HAVE TO AGREE. A choropleth landed in this default and was given a
      // legend about modelled catchments, observations and sites -- none of which it draws --
      // while its own figure carried the class breaks. The practitioner met it as "the legend is
      // stale", 2026-10-26, which is the SECOND time this defect has been reported on a
      // different surface: the figure's own key said the same thing until 2026-10-25. Classed
      // polygons are read from the same `classifyValues` the renderer colours with, so the two
      // cannot drift again.
      // A NAMED LAYER IS ITS OWN KEY. The fallback below named a modelled catchment, some
      // observations and some sites over a figure drawing two reaches of a river and none of
      // those three things, which is the THIRD report of a stale key on this widget: the figure's
      // own key on 2026-10-25, this one on a choropleth on 2026-10-26, and this one again on a
      // polygon layer on 2026-10-28 -- *"Map also still shows stale legends (modeled catchment,
      // observations, sites)"*. Twice it was fixed for the case in front of it and the fallback
      // was left to catch the next case wrongly. A layer whose features are named needs no
      // fallback: it has the names, and now the hues that go with them.
      ??categoricalKey(output.polygons)
      ??[{label:'Modeled catchment',color:R.primary},{label:'Observations',color:R.secondary},{label:'Sites',color:R.site,shape:'square'}];
  }else if((output as {rasterPanels?:unknown[]}).rasterPanels?.length){
    // GRID CELLS IN PANELS (Map's manual, History: panels): the classes and their edges are the figure's own key, drawn once with it.
    items=[];
  }else if(output.raster){
    // The raster's own two entries, and then the layers drawn ON it. This read `else if` and
    // stopped there, so a map carrying a raster and seventeen facilities published a key that
    // named the cells and neither the facilities nor their mark -- the same "winning mode throws
    // the others away" the renderer and the value builder both had. A mark on a map with no entry
    // in its key is exactly what MapMarkContrast cannot save a reader from.
    // THE CELLS' OWN CLASSES (2026-11-17): each colour with its range and unit, where "Relative cell value" said neither.
    const scale=(output as {rasterScale?:import('./raster-panels.js').PanelScale}).rasterScale;
    if(scale){const colours=rampFor(scale.breaks,scale.ramp),b=scale.breaks,round=(v:number|undefined)=>v===undefined?'':Number(Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?v.toFixed(1):v.toFixed(2)).toLocaleString('en');
      items=colours.map((color,i)=>({label:`${scale.label}: ${i===0?`up to ${round(b[0])}`:i===colours.length-1?`over ${round(b[i-1])}`:`${round(b[i-1])} to ${round(b[i])}`}`,color}));
      items.push({label:scale.mode==='density'?'Clear: none counted, NoData or outside the mask':'Clear: no value, NoData or outside the mask',color:R.unknown});}
    else items=[{label:'Relative cell value (see scale)',color:R.primary},{label:'NoData / outside mask',color:R.unknown}];
    for(const [index,layer] of (output.pointLayers||[]).entries()){
      const symbol=resolveLayerSymbol(index,node.params.layerSymbols?.[layer.sourceNodeId]);
      items.push({label:`${layer.label} (${layer.count})`,color:symbol.colour,shape:symbol.shape});
    }
  }
  else if(output.kind==='spatial-map'){
    // The legend has to say what the map now does. Hue stopped meaning the spatial relation when
    // one overlay per source arrived, and this list went on naming three relations in three hues
    // -- a legend for an encoding the renderer no longer used. One entry per LAYER in that layer's
    // hue and mark, then the relations in the fill channel, where they live.
    // A CLASSED LAYER IS KEYED BY ITS CLASSES, not by itself. A layer drawn in two hues and keyed
    // in one is a legend that disagrees with its plot, which is worse than no legend because the
    // reader trusts it. Where a layer has no classes it keeps its single entry.
    const pinClasses=(output as {pinClasses?:Record<string,{value:string;colour:string;shape?:LayerShape}[]>}).pinClasses;
    items=(output.pointLayers||[]).flatMap((layer,index)=>{
      const symbol=resolveLayerSymbol(index,node.params.layerSymbols?.[layer.sourceNodeId]);
      const classes=pinClasses?.[layer.sourceNodeId];
      if(classes?.length){
        const counted=(value:string)=>(output.rows||[])
          .filter(row=>(row as {sourceNodeId?:string}).sourceNodeId===layer.sourceNodeId
            &&(row as {pinClass?:string}).pinClass===value).length;
        return classes.map(entry=>({label:`${entry.value} (${counted(entry.value)})`,
          color:entry.colour,shape:entry.shape||symbol.shape}));
      }
      // A SIZED LAYER SAYS WHAT ITS SIZE SHOWS, and over what range, so a large mark is read as a large value of a named
      // thing and not as a nearer or more important place (experiment 210).
      // COLOUR BY CLASS (2026-11-13): one row per class, its range and how many marks are in it, an empty one included.
      if(symbol.colourBy){
        const values=(output.rows||[]).filter(row=>(row as {sourceNodeId?:string}).sourceNodeId===layer.sourceNodeId)
          .map(row=>{const v=(row as {attributes?:Record<string,unknown>}).attributes?.[symbol.colourBy!];return v===''||v===null||v===undefined?null:Number(v);});
        const ramp=classifyValues(values);
        if(ramp){
          const n=(v:number)=>v.toLocaleString('en',{maximumFractionDigits:2});
          const lowest=Math.min(...values.filter((v):v is number=>typeof v==='number'&&Number.isFinite(v)));
          // The layer is named once, on the first class; a class whose range is one value says the value.
          const range=(i:number)=>{const low=i===0?lowest:ramp.breaks[i-1]!,top=ramp.breaks[i]!;
            return i===0?(low===top?n(top):`${n(low)} to ${n(top)}`):`over ${n(low)} to ${n(top)}`;};
          return ramp.breaks.map((_,i)=>({label:`${i===0?`${layer.label} (${layer.count}), coloured by ${symbol.colourBy}: `:`${symbol.colourBy} `}${range(i)} (${ramp.counts[i]})`,
            color:ramp.colours[i]!,shape:symbol.shape}));
        }
      }
      if(symbol.sizeBy){
        const values=(output.rows||[]).filter(row=>(row as {sourceNodeId?:string}).sourceNodeId===layer.sourceNodeId)
          .map(row=>Number((row as {attributes?:Record<string,unknown>}).attributes?.[symbol.sizeBy!])).filter(v=>Number.isFinite(v));
        const range=values.length?`, ${Math.min(...values).toLocaleString('en')} to ${Math.max(...values).toLocaleString('en')}`:'';
        return [{label:`${layer.label} (${layer.count}) · the area of each mark shows ${symbol.sizeBy}${range}`,color:symbol.colour,shape:symbol.shape}];
      }
      return [{label:`${layer.label} (${layer.count})`,color:symbol.colour,shape:symbol.shape}];
    });
    // The fill entries are the map's own encoding, printed. They used to be three literals here
    // and three more decisions in the renderer, which is two places to change a meaning and one
    // of them silent.
    const encoding=(output as {fillEncoding?:typeof SPATIAL_RELATION_FILL}).fillEncoding||SPATIAL_RELATION_FILL;
    // Only the values this map actually drew. A legend that lists every value the vocabulary
    // allows tells the reader a clip set points aside on a map where nothing was clipped.
    const present=new Set((output.rows||[]).map(row=>{
      const r=row as {relation?:string;status?:string;excluded?:boolean};
      return r.excluded?'Excluded':r.relation??r.status??'';
    }));
    for(const category of encoding.categories.filter(c=>present.has(c.value)))
      items.push({label:category.label,color:category.fill==='absent'?R.unknown:R.ink,hollow:category.fill==='hollow'});
  }
  else items=[{label:'Review',color:R.attention},{label:'No flag',color:R.agreement},{label:'Unknown',color:R.unknown},{label:'Facility',color:R.site,shape:'square'}];
  // THE LINES ARE KEYED like any mark: what they join and how many were drawn (experiment 200, step 4).
  // AND COLOURED BY GENERATION (2026-11-10), from the ramp Chart's tree uses: one entry per generation a line runs into.
  const drawnLinks=(output as {links?:import('./map-links.js').MapLink[]}).links||[];
  for(const c of Object.values((output as {linkCounts?:Record<string,import('./map-links.js').LinkCounts>}).linkCounts||{})){
    const deepest=Math.max(1,...drawnLinks.map(l=>l.generation??1)),hues=generationColours(deepest);
    const present=[...new Set(drawnLinks.map(l=>l.generation).filter((g):g is number=>!!g))].sort((a,b)=>a-b);
    if(!present.length){items.push({label:`Line: from the record named in ${c.column} (${c.drawn})`,color:'#3d4a45',line:true});continue;}
    for(const g of present)items.push({label:`Line into generation ${g} (${drawnLinks.filter(l=>l.generation===g).length})`,color:hues[g-1]!,line:true});
  }
  const interactive=node.params.presentation==='interactive'&&!!output.polygons;
  // THE BASEMAP A STATIC FIGURE ACTUALLY BAKES, which this reported as `none` until 2026-10-27.
  //
  // `drawStaticBasemap` fetches OpenStreetMap or OpenTopoMap tiles once and inlines them, so the
  // figure carries its ground. The spec said otherwise, and three things downstream believed it:
  // the N3 asserted no fw:BasemapLayer, the exported figure omitted `basemap` and therefore its
  // credit, and `BasemapIsCredited` reported `inapplicable` with the words "This figure drew no
  // basemap, so no tile provider has to be credited" -- over a figure visibly full of OSM tiles.
  //
  // That is an attribution gap and not a cosmetic one. The comment below has always said a
  // basemap carries an obligation the practitioner cannot opt out of by leaving a field blank;
  // the coercion above was opting out on their behalf.
  //
  // A vector style stays `none` for a static figure, because that one genuinely is not drawn --
  // the figure has no renderer for it, `drawStaticBasemap` says so in the note, and the
  // Inspector no longer offers it there.
  const chosen=basemapOf(node.params.basemap);
  // A keyed style is credited where it is drawn, on the interactive map; a figure draws OpenStreetMap in its place.
  const basemap=interactive?chosen:keyedProvider(chosen)?'osm':(basemapAvailable(chosen,'plot')?chosen:'none');
  // Derived, not authored: a basemap carries an obligation the practitioner cannot opt out of by
  // leaving a field blank, and a street network reached this figure through an ODbL download.
  const credits=[
    // Public domain, so no licence COMPELS this line. It is here because a reader of a figure is
    // entitled to know which ground it was drawn on and how generalised it is, which is a
    // different obligation from the ODbL one and is not discharged by the absence of a licence.
    basemap==='natural-earth-110m'
      ?'Ground: Natural Earth 1:110m, public domain · context only, generalised to kilometres':'',
    // THE COPYRIGHT ADDRESS PRINTED (2026-11-21): OpenStreetMap's attribution guidelines ask for openstreetmap.org/copyright
    // to be printed where a figure cannot carry a link, and a figure travels as print.
    basemap==='osm'?'Basemap © OpenStreetMap contributors, ODbL (openstreetmap.org/copyright)':'',
    // OpenTopoMap is a style over OSM data under a different licence, so crediting it as
    // OpenStreetMap alone -- which this did until 2026-10-14 -- under-credits the style.
    basemap==='topo'?'Basemap style © OpenTopoMap, CC-BY-SA; data © OpenStreetMap contributors, ODbL (openstreetmap.org/copyright)':'',
    keyedProvider(basemap)==='carto'?'Basemap © CARTO (carto.com/attribution); data © OpenStreetMap contributors, ODbL (openstreetmap.org/copyright)':'',
    keyedProvider(basemap)==='esri'?'Basemap powered by Esri; imagery and data as credited on the map':'',
  ].filter(Boolean);
  // EVERY INPUT'S OWN OBLIGATION, read from the node that incurs it.
  //
  // This line used to be here instead:
  //
  //     output.polygons?.method?.includes('Dijkstra') ? 'Street network © OpenStreetMap...' : ''
  //
  // An ODbL attribution discharged by substring-matching a sentence written for a human to read.
  // Rewording that method description to "shortest path" would have taken the credit off a figure
  // that went on redistributing OSM-derived geometry -- a licence breach by copy-edit. The
  // practitioner's rule of 2026-10-27, "all inputs should carry their provenance and license data
  // with them", is what replaces it: the obligation travels with the data, and a figure reads it
  // rather than guessing at it.
  //
  // Every node upstream of this map, not only the ones whose ports this mode happened to draw:
  // a licence obligation is incurred by USING data, and a map that drew a layer owes its terms
  // whether or not the mode kept that layer in the value.
  // EVERY ANCESTOR, not every neighbour. A licence obligation is incurred by USING data, and a
  // street network reaches a map through snap, reachable junctions and a corridor -- none of
  // which declares a licence, because none of them is the source. Reading only the map's direct
  // inputs would credit nobody for a figure drawn entirely from OSM geometry, which is the
  // failure the Dijkstra test was papering over.
  const ancestors=new Map<string,typeof workflow.nodes[number]>();
  const walk=(id:string,seen=new Set<string>()):void=>{
    if(seen.has(id))return;
    seen.add(id);
    for(const edge of workflow.edges.filter(e=>e.to===id)){
      const from=workflow.nodes.find(n=>n.id===edge.from);
      if(from&&!ancestors.has(from.id))ancestors.set(from.id,from);
      walk(edge.from,seen);
    }
  };
  walk(node.id);
  const upstreamNodes=[...ancestors.values()];
  for(const text of attributionsFor(upstreamNodes.map(n=>
    provenanceOf(n!.params as unknown as Record<string,unknown>))))
    if(!credits.includes(text))credits.push(text);
  const words=figureWords();
  return {title:fillWords(node.params.mapTitle?.trim(),words)||node.params.label,subtitle:fillWords(node.params.mapSubtitle?.trim(),words)||'',sourceNote,legend:node.params.showLegend!==false,items,presentation:interactive?'interactive':'plot',basemap,
    attribution:credits.join(' · '),...(credits[0]&&basemap!=='none'&&!/^Ground: Natural Earth/.test(credits[0])?{basemapCredit:credits[0]}:{})};
}

/** `metresPerPixel` comes from the plot's own frame (`catchmentFrame`), so the scale bar is drawn
 *  from the number the geometry was drawn with. Omitted for a view with no single ground scale --
 *  a decision table, a basemap-backed interactive view -- and then no bar is drawn, because a
 *  figure missing a scale bar is incomplete while a figure with a wrong one is misleading. */
export function standaloneMapSvg(content:string,viewBox:string,spec:MapPresentation,frame?:{metresPerPixel?:number}):string{
  // A FIGURE, NOT A MAP TO OPERATE: the live map's keyboard stops and links are taken out, so the picture is one image
  // to assistive technology and nothing inside it takes focus (WCAG 4.1.2; the Section 508 audit, 2026-11-16).
  content=content.replace(/\s(tabindex|role|aria-[a-z]+)="[^"]*"/g,'').replace(/<a\b[^>]*>|<\/a>/g,'');
  // ONE KEY, NOT TWO (2026-11-14): a categorical plot draws its classes and a key line at the foot of its own frame, over
  // the map, for the page; a figure that draws its own key says the same thing below the map, so the plot's is left out.
  // BUT A SHADED MAP'S LINE STAYS (2026-11-15): under a ramp it says what the shade is and how it was classed ("5 quantile
  // classes, about equal counts, so the shade shows rank"), which no entry below says. Results shows it; Notes and the
  // SVG download dropped it, and kept the ramp, so they showed the classes twice and their meaning nowhere.
  const ramped=content.includes('data-plot-key-band')&&!content.includes('data-plot-key="class"');
  if(spec?.legend)content=content.replace(ramped?/<(rect|text) data-plot-key="class"[^>]*?(\/>|>[^<]*<\/(rect|text)>)/g
    :/<(rect|text) data-plot-key="(class|line)"[^>]*?(\/>|>[^<]*<\/(rect|text)>)/g,'');
  const escape=escapeHtml;
  const lines=(value:string,max:number)=>value.match(new RegExp(`.{1,${max}}(?:\\s|$)|.{1,${max}}`,'g'))?.map(line=>line.trim())||[];
  const t=FIGURE_TYPE;
  const titleLines=lines(spec.title,60),subtitleLines=lines(spec.subtitle,90);
  // THE ENTRIES FLOW ALONG A LINE, as Results sets them, each as wide as its label, rather than in two fixed columns that
  // left a short label half a figure from its neighbour (2026-11-15).
  const placed:{x:number;row:number}[]=[];
  {let x=28,row=0;for(const item of spec.legend?spec.items:[]){const w=17+Math.ceil(item.label.length*7.4)+22;
    if(x>28&&x+w>850-20){x=28;row++;}placed.push({x,row});x+=w;}}
  const width=850,height=Number(viewBox.trim().split(/\s+/)[3])||295,base=40+titleLines.length*24+subtitleLines.length*19,legendRows=spec.legend&&placed.length?placed[placed.length-1]!.row+1:0,noteLines=lines(spec.sourceNote,94);
  // THE BASEMAP'S CREDIT ON ITS OWN LINES, marked, so a figure whose tiles did not arrive can take it out (2026-11-18).
  const others=spec.basemapCredit?spec.attribution.slice(spec.basemapCredit.length).replace(/^ · /,''):spec.attribution;
  // NO GROUND, NO CREDIT FOR IT (2026-11-18): a drawing that says its basemap is not shown does not credit the provider.
  const grounded=!content.includes('data-bare-note');
  const creditLines=[...(spec.basemapCredit&&grounded?lines(spec.basemapCredit,94).map(text=>({text,basemap:true})):[]),
    ...(others?lines(others,94).map(text=>({text,basemap:false})):[])];
  const footer=38+legendRows*22+(noteLines.length+creditLines.length)*19,total=base+height+footer;
  const legend=spec.legend?spec.items.map((item,i)=>{const x=placed[i]!.x,y=base+height+24+placed[i]!.row*22;
    return (item.line?`<path d="M${x-2} ${y-4}H${x+8}" stroke="${item.color}" stroke-width="1.6"/><path d="M${x+7} ${y-8}L${x+13} ${y-4}L${x+7} ${y}z" fill="${item.color}"/>`
      :`<path d="${markPath(item.shape||'circle',x+5,y-4,5)}" fill="${item.hollow?'none':item.color}"${item.opacity===undefined?'':` fill-opacity="${item.opacity}"`} stroke="${item.hollow?item.color:FIGURE_ROLE.quietInk}" stroke-width="1.4"/>`)
      +`<text x="${x+17}" y="${y}" font-size="${t.legend}" fill="${FIGURE_ROLE.ink}">${escape(item.label)}</text>`;}).join(''):'';
  const noteY=base+height+30+legendRows*22;
  // Placed over the plot's lower-left, inside the mapped frame rather than in the footer, which is
  // where a reader looks for them and where they stay if the figure is cropped to the map.
  const furniture=(frame?.metresPerPixel?scaleBarSvg({x:110,y:base+height-26,metresPerPixel:frame.metresPerPixel}):'')
    +(frame?.metresPerPixel?northArrowSvg({x:width-52,y:base+28}):'');
  // THE HEADING'S HEIGHT, so a publication, whose caption carries the title, can drop it (experiment 202, finding 3).
  return `<svg data-heading="${Math.max(0,base-14)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${total}" width="${width}" height="${total}" role="img" aria-label="${escape(spec.title)}"><title>${escape(spec.title)}</title><desc>${escape(spec.subtitle+' '+spec.sourceNote)}</desc><style>text{font-family:${t.family}}.gridline{stroke:#CDD8C5;stroke-width:.5;stroke-dasharray:2 6}.location-label{font-size:${t.tick}px;fill:${FIGURE_ROLE.quietInk}}</style><rect width="${width}" height="${total}" fill="${FIGURE_ROLE.background}"/>${titleLines.map((line,i)=>`<text data-figure-heading="" x="28" y="${31+i*24}" font-size="${t.title}" font-weight="${t.titleWeight}" fill="${FIGURE_ROLE.ink}">${escape(line)}</text>`).join('')}${subtitleLines.map((line,i)=>`<text data-figure-heading="" x="28" y="${35+titleLines.length*24+i*19}" font-size="${t.subtitle}" fill="${FIGURE_ROLE.quietInk}">${escape(line)}</text>`).join('')}<svg x="0" y="${base}" width="850" height="${height}" viewBox="${escape(viewBox)}">${content}</svg>${furniture}${legend}${[...noteLines,...creditLines.map(c=>c.text)].map((line,i)=>`<text x="28" y="${noteY+i*19}" font-size="${t.note}" fill="${FIGURE_ROLE.quietInk}"${i>=noteLines.length&&creditLines[i-noteLines.length]!.basemap?' data-basemap-credit=""':''}>${escape(line)}</text>`).join('')}</svg>`;
}

export function mapSpecificationFacts(node:WorkflowNode<'map_output'>,output:Output,workflow:Workflow,runId:string,receipt:Receipt):string{
  const spec=mapPresentation(node,output,workflow),activity=node.params.inputMode==='polygons'?`urn:fieldwork:run:${runId}:output:${node.id}:view`:node.params.inputMode==='raster'||node.params.inputMode==='decisions'?`urn:fieldwork:run:${runId}:view:${node.id}`:`urn:fieldwork:run:${runId}:map:${node.id}`;
  const iri=`urn:fieldwork:run:${runId}:map-specification:${node.id}`;
  const sources=workflow.edges.filter(e=>e.to===node.id).map(e=>`<urn:fieldwork:run:${runId}:output:${e.from}>`);
  // The layers this map DRAWS, which is not the same as the ports it has.
  //
  // Asserted as ports first, on 2026-10-14, and corrected the same day: "layer count should be
  // about layers not ports." The isochrone map has two ports and draws four things -- a boundary,
  // four time bands, 250 death locations and eight pumps -- because `summarize_points_to_polygon` keeps
  // the points it counted on the value it returns, so they reach the map without being wired.
  // Counting ports reported 2 for a picture a reader sees four layers in.
  //
  // So this reads the same value the renderer draws from, in the order it draws: ground first,
  // then fills, then marks. A layer that arrived inside another layer's value says so with
  // fw:layerWithin rather than claiming a port it does not have. See docs/widget-specs/map_output.md.
  const ground=`urn:fieldwork:run:${runId}:map-specification:${node.id}`;void ground;
  const portOf=(type:string)=>workflow.edges.find(e=>e.to===node.id&&e.port===type);
  const drawn:{kind:string;features?:number;port?:string;within?:string;role?:string;provider?:string}[]=[];
  // Ground first. A basemap is displayed, so it is a layer -- asserted only as fw:mapBasemap
  // until 2026-10-14, which made the one knob that puts a whole layer under the data read as a
  // property of the specification. The same defect as mode: a layer recorded as a setting.
  // It arrives through neither a port nor another layer's value, so it names its provider.
  if(spec.basemap!=='none')drawn.push({kind:'BasemapLayer',provider:spec.basemap});
  if(output.boundary)drawn.push({kind:'AreaLayer',port:portOf('area')?.port});
  if(output.raster)drawn.push({kind:'RasterLayer',port:portOf('raster')?.port});
  if(output.network)drawn.push({kind:'NetworkLayer',port:portOf('network')?.port});
  if(output.polygons?.features?.length)
    drawn.push({kind:'PolygonsLayer',features:output.polygons.features.length,port:portOf('polygons')?.port});
  if(output.polygons?.observations?.features?.length)
    drawn.push({kind:'PointsLayer',features:output.polygons.observations.features.length,
      within:portOf('polygons')?.port,role:'observations'});
  // THE LINES ARE A LAYER IN THE RECEIPT TOO (2026-11-24). Drawn over the areas and under the points, which is
  // where both renderers put them, so that is where they are enumerated.
  for(const layer of lineLayersOf(output))
    if(layer.features.length)
      drawn.push({kind:'LinesLayer',features:layer.features.length,port:portOf('lines')?.port});
  if(output.contextPoints?.features?.length)
    drawn.push({kind:'PointsLayer',features:output.contextPoints.features.length,port:portOf('context')?.port,role:'context'});
  else if(output.polygons?.sites?.length)
    drawn.push({kind:'PointsLayer',features:output.polygons.sites.length,within:portOf('polygons')?.port,role:'sites'});
  if(!output.polygons&&!output.raster&&output.rows?.length)
    drawn.push({kind:'PointsLayer',features:output.rows.filter(r=>r.coordinates).length,port:portOf('points')?.port});
  const facts=`@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n@prefix dcterms: <http://purl.org/dc/terms/>.\n<${iri}> a fw:MapSpecification, prov:Plan; dcterms:title ${JSON.stringify(spec.title)}; dcterms:description ${JSON.stringify(spec.subtitle)}; fw:mapLegend ${spec.legend}; fw:mapPresentation ${JSON.stringify(spec.presentation)}; fw:mapBasemap ${JSON.stringify(spec.basemap)}; fw:mapSourceNote ${JSON.stringify(spec.sourceNote)}; prov:wasDerivedFrom ${sources.join(', ')}.\n<${activity}> fw:mapSpecification <${iri}>; prov:used <${iri}>.\n`;
  // THE PRACTITIONER'S DECISIONS, FOLDED INTO WHAT IS ACTUALLY DRAWN -- not instead of it.
  //
  // This was replaced on 2026-10-29 with the layer LIST, so that the receipt would state the same
  // thing the renderer and the Manage layers dialog read. The list is built from the wired
  // drawable ports, and that reverted a correction this file had already made on 2026-10-14:
  // *"layer count should be about layers not ports."* The isochrone map went back to reporting
  // `fw:layerCount 2` for a picture a reader sees four layers in, because the 250 death locations
  // arrive inside the polygons value and reach no port at all. `tests/map-output.browser.mjs`
  // caught it; the glossary's Layer row is built on the same example.
  //
  // So the enumeration below stays the base -- it is the one that finds a layer which arrived
  // inside another layer's value -- and the list contributes what only a practitioner can say:
  // what a layer is called, whether it was drawn, and which group it was put in. Matched by port,
  // and a drawn layer the list does not know about keeps its facts and gains none.
  const stated=output.mapLayers?.length?output.mapLayers:null;
  const groupIri=(id:string)=>`${iri}:group:${id}`;
  const decided=(port?:string)=>{
    const found=port?stated?.find(layer=>layer.port===port&&layer.origin==='port'):undefined;
    if(!found)return '';
    return `fw:layerLabel ${JSON.stringify(found.label)}; fw:layerDrawn ${found.drawn}; `
      +(found.group?`fw:layerGroup <${groupIri(found.group.id)}>; `:'');
  };
  const groupFacts=[...new Map((stated||[]).filter(l=>l.group)
    .map(l=>[l.group!.id,l.group!])).values()]
    .map(group=>`<${groupIri(group.id)}> a fw:LayerGroup; `
      +`fw:groupLabel ${JSON.stringify(group.label)}; fw:groupIndex ${group.index}.\n`).join('');
  const layerFacts=groupFacts
    +`<${iri}> fw:layerCount ${drawn.length}.\n`
    +drawn.map((layer,index)=>`<${iri}> fw:layer [ fw:layerIndex ${index}; fw:layerKind <urn:fieldwork:${layer.kind}>; `
      +`${layer.features!==undefined?`fw:layerFeatureCount ${layer.features}; `:''}`
      +`${layer.role?`fw:layerRole ${JSON.stringify(layer.role)}; `:''}`
      +decided(layer.port)
      +`${layer.provider?`fw:layerTileProvider ${JSON.stringify(layer.provider)}`
        :layer.port?`fw:layerPort ${JSON.stringify(layer.port)}`
        :`fw:layerWithin ${JSON.stringify(layer.within||'the value')}`} ].\n`).join('');
  // The design rules this map was held to, applied here — while it is being assembled, which is
  // the practitioner's decision of 2026-10-17: "We can embed the map or visualization design
  // rules in widgets and apply them during visualization assembly", and "Then the N3 receipts
  // can include which rules were applied."
  //
  // The categories a map actually drew are the palette entries its layers used. A map drawing
  // nothing categorical reports the category rules as inapplicable rather than omitting them.
  const categories=drawn.some(l=>l.kind==='PolygonsLayer'||l.kind==='PointsLayer')
    ?[...FIGURE_PALETTE].slice(0,Math.max(1,drawn.filter(l=>l.kind==='PointsLayer'||l.kind==='PolygonsLayer').length))
    :[];
  // The figure's parts, read from the specification the map was assembled from rather than
  // restated, so a rule cannot pass against something the figure does not actually carry.
  //
  // `northIsUp` is true because every figure this project draws is CRS84, whose meridians are
  // parallel: north is up everywhere on it. It is stated rather than assumed so that the rule
  // becomes applicable by itself the day a projected map is drawn, instead of silently
  // continuing to report inapplicable.
  //
  // No scale is claimed. A bar on unprojected coordinates would be true at one latitude only,
  // which is why the rule asks what a claim holds for rather than asking for a bar.
  const applied=applyDesignRules(figureDesign(categories,spec.legend&&categories.length>0,{
    title:spec.title,
    key:{drawn:spec.legend,entries:spec.items.length},
    marksDrawn:categories.length,
    sourceNote:spec.sourceNote,
    northIsUp:true,
    scale:{claimed:false},
    ...(spec.basemap&&spec.basemap!=='none'
      ?{basemap:{provider:spec.basemap,credit:spec.attribution}}:{})}));
  // WHAT EACH CHANNEL CARRIES, as facts rather than as pixels.
  //
  // The practitioner, 2026-10-20: *"in the ontology do we have UI representations of
  // differences?"* and then *"make sure there are N3 receipts for them"*. A map asserts what it
  // drew; until now it did not assert HOW it distinguished one thing from another, so a reader
  // could see that two sources were different colours and could not check what the colours were
  // claiming. Three bindings, each naming its vocabulary and its authority:
  //
  //   hue   -> which source layer    Okabe-Ito, colour-universal by design
  //   mark  -> which source layer    OGC Symbology Encoding WellKnownName, the standard's own term
  //   fill  -> whatever the map's own fillEncoding says, read from the value rather than assumed
  //
  // The mark and hue say the same thing on purpose: colour alone is not an encoding everybody can
  // read, and WCAG 1.4.1 is the rule this answers rather than a preference.
  const symbols=(output as {layerSymbols?:Record<string,{colour:string;shape:string;sizeBy?:string;colourBy?:string;chosen:{colour:boolean;shape:boolean}}>;layerNames?:Record<string,string>}).layerSymbols;
  const names=(output as {layerNames?:Record<string,string>}).layerNames||{};
  const fill=(output as {fillEncoding?:typeof SPATIAL_RELATION_FILL}).fillEncoding||SPATIAL_RELATION_FILL;
  const encodingFacts=symbols?`<${iri}> fw:encoding [ fw:visualChannel "hue"; fw:encodesVariable "source layer"; `
      +`fw:palette ${JSON.stringify(FIGURE_PALETTE_NAME)}; fw:paletteAuthority <${FIGURE_PALETTE_AUTHORITY}>; fw:colourVisionSafe true ], `
      +`[ fw:visualChannel "graphic mark"; fw:encodesVariable "source layer"; fw:markVocabulary <${MARK_VOCABULARY}> ], `
      +`[ fw:visualChannel "fill"; fw:encodesVariable ${JSON.stringify(fill.variable)}`
      +(fill.vocabulary?`; fw:markVocabulary <${fill.vocabulary}>`:'')
      +fill.categories.map(c=>`; fw:fillMeaning ${JSON.stringify(`${c.fill} is ${c.value}`)}`).join('')+` ]`
      // PROPORTIONAL SYMBOLS: the area channel, and the attribute each sized layer encodes in it (experiment 210).
      +Object.entries(symbols).filter(([,s])=>s.colourBy).map(([source,s])=>`, [ fw:visualChannel "lightness"; fw:encodesVariable ${JSON.stringify(`${s.colourBy} of ${names[source]||source}, in quantile classes`)} ]`).join('')
      +Object.entries(symbols).filter(([,s])=>s.sizeBy&&!s.colourBy).map(([source,s])=>`, [ fw:visualChannel "area"; fw:encodesVariable ${JSON.stringify(`${s.sizeBy} of ${names[source]||source}`)} ]`).join('')
      +`.\n`
    +Object.entries(symbols).map(([source,symbol])=>
      `<${iri}> fw:layerSymbol [ fw:layerSource ${JSON.stringify(source)}; fw:layerLabel ${JSON.stringify(names[source]||source)}; `
      +`fw:mark ${JSON.stringify(symbol.shape)}; fw:markVocabulary <${MARK_VOCABULARY}>; fw:symbolColour ${JSON.stringify(symbol.colour)}; `
      // CHOSEN or DERIVED, kept apart. "A triangle because somebody chose a triangle" and "a
      // triangle because it was the second layer" are different claims about the same picture.
      +`fw:markChosen ${symbol.chosen.shape}; fw:colourChosen ${symbol.chosen.colour} ].\n`).join('')
    :'';
  // The practitioner's own choices, recorded as CHOICES rather than as settings.
  //
  // "It's a user preference, and the audit is in the N3 receipts ... The user can audit that
  // decision him/herself" -- 2026-10-17. This application is N of 1: one browser, one workspace,
  // no accounts. A preference here is not a population estimate, it is a person's recorded
  // judgement about their own work, and the only reason to separate it from a rule is so a
  // reader can tell "sequential because the variable is ordered" from "sequential because I
  // prefer it". Both are legitimate; one is a claim about the data.
  const choices=[
    {setting:'presentation',chosen:spec.presentation,alternatives:['plot','interactive']},
    {setting:'basemap',chosen:spec.basemap,
     // Every basemap actually offered. A DesignChoice records what was SELECTED beside what
     // else was available, so a stale list understates the choice space the practitioner had.
     alternatives:['none','osm','topo','ofm-liberty','ofm-positron','ofm-bright']},
  ];
  const conformance=`${designRuleDeclarations()}\n${designRuleFacts(iri,applied)}\n`
    +`${designChoiceFacts(iri,choices)}\n`;
  const prefixes=`@prefix earl: <http://www.w3.org/ns/earl#>.\n@prefix dcterms: <http://purl.org/dc/terms/>.\n`
    +`@prefix dqv: <http://www.w3.org/ns/dqv#>.\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n`;
  const all=prefixes+facts+layerFacts+encodingFacts+conformance;
  receipt.facts+=all;receipt.input=receipt.facts;return all;
}
