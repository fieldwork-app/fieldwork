import test from 'node:test';
import assert from 'node:assert/strict';
import {observationRadius} from '../build/point-layers.js';

/** THE LARGEST VALUE ONCE PER LAYER, IN ONE PASS (review of #6, 2026-11-27). Each mark's radius scanned the whole carried
 *  layer, spread into Math.max: quadratic over the marks, and RangeError at the 250,000-record input limit. */
const layer=n=>({observationSymbol:{size:6,sizeBy:'DEATHS'},observations:{type:'FeatureCollection',
  features:Array.from({length:n},(_,i)=>({type:'Feature',properties:{DEATHS:i%50},geometry:{type:'Point',coordinates:[0,0]}}))}});

test('a mark in a 250,000-point carried layer gets a radius',()=>{
  const p=layer(250000);
  const r=observationRadius(p,{DEATHS:49});
  assert.ok(Number.isFinite(r)&&r>0);
});

test('every mark of a 6,000-point layer, sized, in well under a second',()=>{
  const p=layer(6000);
  const t=performance.now();
  for(const f of p.observations.features)observationRadius(p,f.properties);
  assert.ok(performance.now()-t<200,`${(performance.now()-t).toFixed(0)} ms`);
});

test('the largest value still sets the scale: the largest mark is three times the layer\'s size, as on every point layer',()=>{
  const p=layer(100);
  assert.ok(Math.abs(observationRadius(p,{DEATHS:49})-18)<1e-9);
  assert.ok(Math.abs(observationRadius(p,{DEATHS:49/4})-9)<1e-9);
});
