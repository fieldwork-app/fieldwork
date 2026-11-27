import test from 'node:test';
import assert from 'node:assert/strict';
import {previewDrawing} from '../build/spatial-walkthroughs.js';

/** THE SMALLEST FILLED SHAPE IS DRAWN LAST (2026-11-27). The practitioner, of Summarize's Preview on Snow's isochrone:
 *  *"The larger polygon (longer travel) should not be at the top surface, it covers the other smaller isochrone band
 *  polygons."* Nested bands arrive shortest first; drawn in that order, the longest hid the rest. */
const square=(r,fill)=>({kind:'result',rings:[[[[-r,-r],[r,-r],[r,r],[-r,r],[-r,-r]]]],fill});
test('filled shapes are drawn largest first, whatever order they arrive in',()=>{
  const svg=previewDrawing([square(1,'#a'),square(5,'#b'),square(10,'#c'),square(15,'#d'),{kind:'area',rings:[[[[-20,-20],[20,-20],[20,20],[-20,20],[-20,-20]]]]}],'bands');
  const fills=[...svg.matchAll(/walk-shape-result[^>]*fill:(#[a-d])/g)].map(m=>m[1]);
  assert.deepEqual(fills,['#d','#c','#b','#a']);
  assert.ok(svg.indexOf('walk-shape-area')>svg.lastIndexOf('walk-shape-result'),'the area outline keeps its place, after the fills');
});
