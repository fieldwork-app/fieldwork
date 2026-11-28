import {test,expect} from './fixtures.mjs';
import {existsSync,readFileSync} from 'node:fs';
import {collectPageErrors} from './page-errors.mjs';

/** SNOW'S MAP 2, PLACED BY HAND (2026-11-13). The practitioner, of the South London example's plate: *"I think we can
 *  follow the Hagelloch example and allow the user to georeference it by hand as part of the worked example."* The plate
 *  is offered from the example repository by its pinned digest; four features recorded when it was first placed
 *  (geo/map2-georeference.json) are the cues; the points typed are those records, scaled to this 1,002-pixel plate.
 *  The network is stubbed with the repository beside this one, so the bytes are the ones the catalog pins. */
test.use({serviceWorkers:'block'});
const REPO=new URL('../../example-1855-cholera-south-london/',import.meta.url).pathname;
const skip=existsSync(REPO)?false:'example-1855-cholera-south-london is not checked out beside this repository.';

test('Snow’s Map 2: the plate offered from its repository, placed north-up by four recorded features',async({page})=>{test.skip(!!skip,skip);
  test.setTimeout(180_000);
  const errors=collectPageErrors(page);
  let plateFetched=0;
  await page.route(/raw\.githubusercontent\.com/,route=>{const path=new URL(route.request().url()).pathname.split('/').slice(4).join('/');
    if(path==='geo/map2.jpg')plateFetched++;
    route.fulfill({status:200,body:readFileSync(REPO+path)});});
  await page.route(/tile\.openstreetmap\.org/,route=>route.abort('failed'));
  await page.goto('/');await page.evaluate(()=>localStorage.clear());
  await page.goto('/?example=blank');
  await page.locator('[data-view="project"]').click();
  await page.locator('[data-open-example="urn:fieldwork:example:south-london-1854"]').click();
  await expect(page.locator('[data-example-status="urn:fieldwork:example:south-london-1854"]')).toContainText('digest matched',{timeout:20000});
  await page.locator('#workflow-select').selectOption({label:'Where does Snow’s Map 2 fall on today’s map?'});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="plate"]').click();
  await expect(page.locator('#inspector-content')).toContainText('A worked example names 4 features to find');
  // NOT FETCHED UNTIL ASKED: the plate stays in the repository until the learner chooses it.
  expect(plateFetched).toBe(0);
  await page.locator('#configure-step').click();
  const dialog=page.locator('#map-image-config');
  await expect(dialog).toContainText('Project Gutenberg ebook 72894');
  await dialog.locator('#map-image-offered').click();
  await expect(dialog).toContainText('map2.jpg: 1,002 × 788 pixels',{timeout:30_000});
  expect(plateFetched).toBe(1);
  const g=JSON.parse(readFileSync(REPO+'geo/map2-georeference.json','utf8'));
  for(const [index,c] of g.controlPoints.entries()){
    if(index>0)await dialog.locator('#geo-add-point').click();
    const row=dialog.locator(`tr[data-geo-row="${index}"]`);
    await expect(row.locator('[data-geo-field="id"]')).toHaveValue(c.feature.split(' (')[0]);
    for(const [field,value] of [['x',c.pixel.x*1002/5000],['y',c.pixel.y*788/3934],['lon',c.wgs84.lon],['lat',c.wgs84.lat]]){
      await row.locator(`[data-geo-field="${field}"]`).fill(String(Math.round(value*1e5)/1e5));
      await row.locator(`[data-geo-field="${field}"]`).dispatchEvent('change');
      await page.evaluate(()=>new Promise(r=>setTimeout(r,0)));
    }
    await expect(dialog.locator('#geo-found')).toContainText('On the image: on the feature. On today\'s map: on the feature.');
  }
  // The recorded fit's errors, as geo/map2-georeference.json gives them: about 90 m, the largest at the Oval.
  await expect(dialog.locator('#geo-fit')).toContainText(/Placed from 4 points: errors \d+ m root mean square, largest \d+ m at Kennington Oval\./);
  await dialog.locator('#config-apply').click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#inspector-content')).toContainText('placed by 4 matched points');
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:90_000});
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map image[data-map-image]')).toHaveCount(1,{timeout:20_000});
  await expect(page.locator('#example-note')).not.toContainText('Built on');
  await page.screenshot({path:'test-results/snow-map2-by-hand.png'});
  expect(errors).toEqual([]);
});

/** RUN BEFORE THE PLATE IS PLACED IS NOT A FAILED RUN (the practitioner, 2026-11-28: "The run failed in the workflow because
 *  I have not loaded the map2 cached map"). It says the workflow is not ready, names the step, and offers to show it. */
test('Snow’s Map 2 run before its plate is placed: not ready, not failed',async({page})=>{test.skip(!!skip,skip);
  const errors=collectPageErrors(page);
  await page.route(/raw\.githubusercontent\.com/,route=>{const path=new URL(route.request().url()).pathname.split('/').slice(4).join('/');
    route.fulfill({status:200,body:readFileSync(REPO+path)});});
  await page.route(/tile\.openstreetmap\.org/,route=>route.abort('failed'));
  await page.goto('/');await page.evaluate(()=>localStorage.clear());
  await page.goto('/?example=blank');
  await page.locator('[data-view="project"]').click();
  await page.locator('[data-open-example="urn:fieldwork:example:south-london-1854"]').click();
  await expect(page.locator('[data-example-status="urn:fieldwork:example:south-london-1854"]')).toContainText('digest matched',{timeout:20000});
  await page.locator('#workflow-select').selectOption({label:'Where does Snow’s Map 2 fall on today’s map?'});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toHaveText('Not ready to run');
  await expect(page.locator('#toast')).toContainText('is not placed yet. Choose the image and place it in Configure…, then run.');
  await expect(page.locator('#toast')).not.toHaveClass(/failure/);
  await page.locator('#toast button',{hasText:'Show the step'}).click();
  await expect(page.locator('.react-flow__node[data-id="plate"]')).toHaveClass(/selected/);
  expect(errors).toEqual([]);
});
