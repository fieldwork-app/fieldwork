import {test,expect} from './fixtures.mjs';

/** WIDGETS ADDED FROM THE LIBRARY LAND CLEAR OF ONE ANOTHER (2026-11-28). Found 2026-11-27, writing the blank-port test:
 *  three added in a row overlapped, each 80 px from the last while a node is about 260 px wide. Read from the canvas
 *  itself: each node's drawn box, in screen pixels, against every other's. */
test('three widgets added in a row are drawn without covering one another',async({page})=>{
  await page.goto('/?example=blank');
  await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  for(const type of ['point_input','point_input','measure_distance']){
    await page.locator(`#node-library [data-add="${type}"]`).click();
    await expect(page.locator('.react-flow__node')).not.toHaveCount(0);
  }
  await expect(page.locator('.react-flow__node')).toHaveCount(3);
  const boxes=await page.locator('.react-flow__node').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const a=boxes[i],b=boxes[j];
    const overlaps=a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
    expect(overlaps,`node ${i} and node ${j} overlap: ${JSON.stringify([a,b])}`).toBe(false);
  }
});
