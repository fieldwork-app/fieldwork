import test from 'node:test';
import assert from 'node:assert/strict';
import {voronoiWalkthrough} from '../build/spatial-walkthroughs.js';

/** VORONOI CATCHMENTS TEACHES ITS OWN STEP (2026-11-27). The practitioner: *"it shows 'A house', but the house has got
 *  nothing to do with setting up the catchment areas (they are what fall into catchment areas)."* Said removed on
 *  2026-11-25 and not removed; held here so it cannot come back unnoticed. The step is given pumps and an area. */
test('the Voronoi walkthrough builds the cells from the pumps alone, and follows no house',()=>{
  const {steps}=voronoiWalkthrough();
  assert.equal(steps.length,4);
  for(const s of steps){
    assert.doesNotMatch(s.text,/\bhouses?\b/i,s.text);
    assert.doesNotMatch(s.figure.svg,/>\s*A house\s*</);
  }
  assert.match(steps[1].text,/^Take two of them/);
  assert.match(steps.at(-1).text,/^What the step passes on: 3 cells/);
});
