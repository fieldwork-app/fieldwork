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

/** THE WHOLE NEW WIDGET IN VIEW (review of #8, 2026-11-28): a Study area panned near the right edge, then Calculate area
 *  added beside it, began inside the view and ran 300 px out of it, and the canvas did not move. */
test('a widget placed beside its source near the edge is scrolled wholly into view',async({page})=>{
  await page.goto('/?example=blank');
  await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('#node-library [data-add="study_area"]').click();
  const pane=page.locator('.react-flow__pane');
  const area=page.locator('.react-flow__node').first();
  await expect(area).toBeVisible();
  // Pan so the new widget, placed 310 canvas units right of the study area, will begin 28 px inside the right edge: the
  // review's case, a corner in view and the rest out of it.
  const canvas=await page.locator('.react-flow').boundingBox(),at=await area.boundingBox();
  const zoom=at.width/await area.evaluate(e=>e.offsetWidth);
  const dx=(canvas.x+canvas.width-28)-(at.x+310*zoom);
  await page.mouse.move(canvas.x+canvas.width/2,canvas.y+canvas.height-30);await page.mouse.down();
  await page.mouse.move(canvas.x+canvas.width/2+dx,canvas.y+canvas.height-30,{steps:8});await page.mouse.up();
  void pane;
  await page.locator('#node-library [data-add="measure_area"]').click();
  await expect(page.locator('.react-flow__node')).toHaveCount(2);
  const added=page.locator('.react-flow__node').nth(1);
  await expect.poll(async()=>{const b=await added.boundingBox(),c=await page.locator('.react-flow').boundingBox();
    return b.x>=c.x-1&&b.y>=c.y-1&&b.x+b.width<=c.x+c.width+1&&b.y+b.height<=c.y+c.height+1;},{timeout:5000}).toBe(true);
});
