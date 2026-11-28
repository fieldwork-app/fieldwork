import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {executeWorkflow} from '../build/core.js';
import {johnSnowExample} from '../build/john-snow.js';
import {polygonSvg} from '../build/catchment-output.js';
import {observationRadius} from '../build/point-layers.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const ready=async()=>[{subject:'urn:fieldwork:area:study',predicate:'urn:fieldwork:readyForSpatialAnalysis',object:'true'}];
const mapOf=async w=>(await executeWorkflow(w,ready)).outputs.find(o=>o.nodeId==='map');
const radii=svg=>[...svg.matchAll(/<circle[^>]*\br="([\d.]+)"/g)].map(m=>Number(m[1]));

/** ONE RULE FOR THE POINTS A POLYGON LAYER CARRIES (2026-11-27). The practitioner, on Snow's Voronoi map: the preview
 *  drew the deaths sized and over the catchments, the result drew them small and lost under them -- *"These
 *  inconsistencies make the worked example not credible."* The interactive map sized them by a column it named itself,
 *  DEATHS; the plot drew them at one small size. Now they are a layer of the map, drawn with the symbol set for it. */
test('Snow\'s Voronoi map declares the deaths a layer, sized by the column its own map chose',async()=>{
  const map=await mapOf(johnSnowExample('snow-voronoi'));
  assert.ok(map.pointLayers.some(l=>l.sourceNodeId==='locations'&&l.label==='250 death locations (489 deaths)'));
  assert.equal(map.polygons.observationSymbol.sizeBy,'DEATHS');
  const svg=polygonSvg(map.polygons,esc,null);
  const r=radii(svg).filter((_,i,all)=>all.length>0);
  assert.ok(new Set(r.map(x=>x.toFixed(2))).size>1,'sized, not one size');
  // OVER THE POLYGONS: no catchment is drawn after the first point.
  assert.ok(svg.lastIndexOf('data-catchment=')<svg.indexOf('<circle'),'every polygon before every point');
  // The plot and the interactive map read one radius: the largest count takes three times the layer's size.
  const top=Math.max(...map.polygons.observations.features.map(f=>f.properties.DEATHS));
  const largest=map.polygons.observations.features.find(f=>f.properties.DEATHS===top);
  assert.equal(observationRadius(map.polygons,largest.properties),map.polygons.observationSymbol.size*3);
});

test('with no size chosen, every carried point is drawn at its layer\'s one size',async()=>{
  const w=johnSnowExample('snow-voronoi');delete w.nodes.find(n=>n.id==='map').params.layerSymbols;
  const map=await mapOf(w);
  assert.equal(map.polygons.observationSymbol.sizeBy,undefined);
  assert.equal(new Set(radii(polygonSvg(map.polygons,esc,null))).size,1);
});

test('no renderer names a column of an example\'s data',()=>{
  for(const file of ['src/catchment-map.ts','src/catchment-output.ts','src/point-layers.ts'])
    assert.doesNotMatch(readFileSync(new URL(`../${file}`,import.meta.url),'utf8').replace(/\/\/.*|\/\*[\s\S]*?\*\//g,''),/\bDEATHS\b/,file);
});
