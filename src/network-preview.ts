import type {Network} from './catchments.js';
import type {Boundary,Position} from './types.js';
import {geometryBounds} from './study-area.js';
import {FIGURE_ROLE} from './presentation.js';

/** A picture of a downloaded street network, for the Inspector.
 *
 *  Added 2026-10-13, on the practitioner's suggestion, after they could not tell whether a download
 *  had worked. Four widgets consume a `network` and none of them is an output, so a street network
 *  had no way to be looked at: the only feedback was "N nodes · M directed edges" and a source
 *  string, and the only real check was to run an isochrone over it and see whether the answer looked
 *  sane. That is a slow way to find out that a download missed half the study area.
 *
 *  Drawn here rather than by giving the Map a `network` port, which would be a contract change --
 *  a new port on a widget whose ports are pinned in its release -- for a picture whose job is to
 *  answer a question at the moment of downloading, where the practitioner already is.
 *
 *  The question it answers is not "are there streets" but **"do the streets cover the area I
 *  asked about"**, so the study-area boundary is drawn over them whenever one is connected. */

export const PREVIEW_WIDTH=252;
export const PREVIEW_HEIGHT=168;

/** Metres between two CRS84 positions, by the same haversine the rest of the project uses. */
function metres(a:Position,b:Position):number{
  const r=Math.PI/180,dLat=(b[1]-a[1])*r,dLon=(b[0]-a[0])*r;
  const h=Math.sin(dLat/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(dLon/2)**2;
  return 12742017.6*Math.asin(Math.sqrt(Math.min(1,h)));
}

export interface NetworkCoverage {
  junctions:number; segments:number; totalMetres:number;
  /** How much of the study area's bounding box the network's own extent covers, 0 to 1. `null`
   *  when no boundary is connected, which is not the same as full coverage. */
  boundaryCovered:number|null;
}

export function networkCoverage(network:Network,boundary?:Boundary):NetworkCoverage{
  const positions=new Map(network.nodes.map(n=>[n.id,n.coordinates]));
  let totalMetres=0;
  for(const edge of network.edges){
    const from=positions.get(edge.from),to=positions.get(edge.to);
    // Each undirected street is present twice for walking, so halve the sum rather than report
    // twice the walkable length.
    if(from&&to)totalMetres+=metres(from,to)/2;
  }
  let boundaryCovered:number|null=null;
  if(boundary&&network.nodes.length){
    const [w,s,e,n]=geometryBounds(boundary);
    // FOLDED, NOT SPREAD. `Math.min(...lons)` passes every junction as an ARGUMENT: at 1,837,939
    // of them the call stack overflows before any coverage is computed, and the practitioner sees
    // "Maximum call stack size exceeded" at the end of a 300 MB download. 2026-10-22. The same
    // mistake was fixed in the picture below the day before and this one was missed, because the
    // picture is what was being looked at.
    let west=Infinity,east=-Infinity,south=Infinity,north=-Infinity;
    for(const node of network.nodes){
      const [lon,lat]=node.coordinates;
      if(lon<west)west=lon;if(lon>east)east=lon;
      if(lat<south)south=lat;if(lat>north)north=lat;
    }
    const overlap=(lowA:number,highA:number,lowB:number,highB:number)=>
      Math.max(0,Math.min(highA,highB)-Math.max(lowA,lowB));
    const area=Math.max(1e-12,(e-w)*(n-s));
    boundaryCovered=Math.min(1,(overlap(w,e,west,east)*overlap(s,n,south,north))/area);
  }
  return {junctions:network.nodes.length,segments:network.edges.length,totalMetres,boundaryCovered};
}

/** How many segments the picture draws. Not a limit on the network: a limit on a 292-pixel panel,
 *  where a province's 3,755,832 segments would be a path string of tens of megabytes and several
 *  thousand strokes per pixel. Beyond this the picture is drawn from an even sample and the
 *  caption says so, which is the difference between a bounded drawing and a bounded dataset. */
export const PREVIEW_SEGMENT_LIMIT=20000;
export function networkPreviewSvg(network:Network,boundary?:Boundary):string{
  if(!network?.nodes?.length)return '';
  const ring=boundary?(boundary.type==='Polygon'?boundary.coordinates:boundary.coordinates.flat()).flat():[];
  // The frame holds both, so a network that misses the area shows as a gap rather than as a
  // picture of streets that happens to be somewhere else.
  //
  // Folded rather than spread: `Math.min(...array)` passes every element as an ARGUMENT, and a
  // province's 1.8 million junctions overflow the call stack before any picture is attempted.
  let west=Infinity,east=-Infinity,south=Infinity,north=-Infinity;
  const extend=(c:Position)=>{
    if(c[0]<west)west=c[0];if(c[0]>east)east=c[0];
    if(c[1]<south)south=c[1];if(c[1]>north)north=c[1];};
  for(const node of network.nodes)extend(node.coordinates);
  for(const c of ring as Position[])extend(c);
  const cos=Math.cos(((south+north)/2)*Math.PI/180);
  const pad=10,usableW=PREVIEW_WIDTH-pad*2,usableH=PREVIEW_HEIGHT-pad*2;
  const scale=Math.min(usableW/Math.max((east-west)*cos,1e-9),usableH/Math.max(north-south,1e-9));
  const project=(c:Position):[number,number]=>[
    PREVIEW_WIDTH/2+(c[0]-(east+west)/2)*cos*scale,
    PREVIEW_HEIGHT/2-(c[1]-(south+north)/2)*scale];

  const positions=new Map(network.nodes.map(n=>[n.id,n.coordinates]));
  // One path for every segment rather than one element each: a 1 km square of central London is
  // 11,497 segments, and 11,497 DOM nodes in an Inspector panel is not a preview.
  const seen=new Set<string>();
  let d='';
  const step=Math.max(1,Math.ceil(network.edges.length/PREVIEW_SEGMENT_LIMIT));
  for(let index=0;index<network.edges.length;index+=step){
    const edge=network.edges[index];
    const key=edge.from<edge.to?`${edge.from}|${edge.to}`:`${edge.to}|${edge.from}`;
    if(seen.has(key))continue;
    seen.add(key);
    const from=positions.get(edge.from),to=positions.get(edge.to);
    if(!from||!to)continue;
    const [x1,y1]=project(from),[x2,y2]=project(to);
    d+=`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  const outline=boundary
    ?(boundary.type==='Polygon'?[boundary.coordinates]:boundary.coordinates)
      .map(poly=>'M'+poly[0].map(c=>project(c as Position).map(v=>v.toFixed(1)).join(' ')).join('L')+'Z').join('')
    :'';
  return `<svg class="network-preview" viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" `
    +`width="100%" role="img" aria-label="Downloaded street network${boundary?' and the study area':''}">`
    +`<rect width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" fill="${FIGURE_ROLE.background}"/>`
    +`<path d="${d}" fill="none" stroke="${FIGURE_ROLE.quietInk}" stroke-width="0.6" stroke-linecap="round"/>`
    +(outline?`<path d="${outline}" fill="none" stroke="${FIGURE_ROLE.attention}" stroke-width="1.4" stroke-dasharray="4 3"/>`:'')
    +`</svg>`;
}

/** The sentence under the picture. States the measurement, and says plainly when the download does
 *  not reach the area it was asked for -- which is the failure a practitioner is looking for. */
export function networkPreviewCaption(coverage:NetworkCoverage):string{
  const km=(coverage.totalMetres/1000);
  const length=km>=1?`${km.toFixed(km>=10?0:1)} km`:`${Math.round(coverage.totalMetres)} m`;
  const parts=[`${coverage.junctions.toLocaleString('en')} junctions`,
    `${coverage.segments.toLocaleString('en')} directed segments`,
    `${length} of street`];
  // A SAMPLED PICTURE SAYS SO. The numbers above are the whole network; the drawing above them
  // may not be, and a reader comparing the two deserves to know which.
  if(coverage.segments>PREVIEW_SEGMENT_LIMIT)
    parts.push(`drawn from about ${PREVIEW_SEGMENT_LIMIT.toLocaleString('en')} of them`);
  if(coverage.boundaryCovered===null)
    parts.push('no study area connected, so coverage is unknown');
  else if(coverage.boundaryCovered>=0.999)parts.push('covering the study area');
  else parts.push(`covering about ${Math.round(coverage.boundaryCovered*100)}% of the study area`);
  return parts.join(' · ');
}

export const PREVIEW_SCALE_NOTE=(coverage:NetworkCoverage):string=>
  coverage.boundaryCovered!==null&&coverage.boundaryCovered<0.999
    ? 'The dashed outline is the study area. Where it runs outside the streets, the download did not reach that ground.'
    : 'The dashed outline is the study area.';

/** WHAT A NETWORK IS, AS A SHORT STRING, for keeping a Preview's answer (review of #6, 2026-11-27). The isochrone Preview
 *  kept its answers by the network's counts alone, so a network with the same 738 junctions and 1,619 edges but four
 *  times the lengths was shown the old bands. This reads every junction's place and every edge's ends and length, in one
 *  pass (FNV-1a), and is kept per network object, so a dialog's redraws do not read it again. */
const identities=new WeakMap<Network,string>();
export function networkIdentity(network:Network):string{
  const known=identities.get(network);if(known)return known;
  let h=0x811c9dc5;
  const mix=(text:string)=>{for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,0x01000193);}h^=0x1f;h=Math.imul(h,0x01000193);};
  for(const node of network.nodes)mix(`${node.id}|${node.coordinates[0]}|${node.coordinates[1]}`);
  for(const edge of network.edges)mix(`${edge.from}|${edge.to}|${edge.lengthM}`);
  const identity=`${network.nodes.length}:${network.edges.length}:${(h>>>0).toString(36)}`;
  identities.set(network,identity);
  return identity;
}
