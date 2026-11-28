import test from 'node:test';
import assert from 'node:assert/strict';
import {previewDrawing} from '../build/spatial-walkthroughs.js';

/** A DETAILED POLYGON IS DRAWN, NOT A STACK OVERFLOW (review of #5, 2026-11-27). The drawing spread every coordinate
 *  into Math.min and Math.max, and an 80,000-vertex ring kept whole by Clip polygons threw RangeError, well inside the
 *  1,000,000-vertex input budget. The bounds are now taken in one pass. */
const ring=n=>{const r=[];for(let i=0;i<n;i++){const a=2*Math.PI*i/n;r.push([-0.136+0.01*Math.cos(a),51.513+0.01*Math.sin(a)]);}r.push(r[0]);return r;};

test('an 80,000-vertex ring, given and kept, draws',()=>{
  const big=[[ring(80000)]];
  const svg=previewDrawing([{kind:'input',rings:big},{kind:'result',rings:big}],'detailed');
  assert.match(svg,/<path class="walk-shape walk-shape-result"/);
});
