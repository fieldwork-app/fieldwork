import {test,expect} from './fixtures.mjs';
import {collectPageErrors} from './page-errors.mjs';

/** WHAT MEASURE DISTANCE WOULD MEASURE, over the points and candidates connected (2026-11-25).
 *
 *  Its Preview restated the settings: it NAMED the conditions being edited and never said what they kept, so the
 *  one number a condition exists to change -- how many candidates survive it -- was available only by running the
 *  workflow and reading the receipt. The practitioner met this class of dialog one after another and then named it:
 *  "Practically all widgets used in Snow built in have similar problems" (docs/audits/preview-audit.md).
 *
 *  Three households and four facilities, two of them clinics, so a condition on `kind` has something to narrow. */
const point=(id,name,x,y,extra={})=>({type:'Feature',id,properties:{name,...extra},
  geometry:{type:'Point',coordinates:[x,y]}});
const flow={schema:'fieldwork/workflow/1',exampleId:'blank',name:'Distances',nodes:[
  {id:'households',type:'point_input',x:20,y:20,params:{label:'Households',data:{type:'FeatureCollection',features:[
    point('h1','Household 1',0,0),point('h2','Household 2',0.1,0),point('h3','Household 3',0.2,0)]}}},
  {id:'facilities',type:'point_input',x:20,y:200,params:{label:'Facilities',data:{type:'FeatureCollection',features:[
    point('f1','Clinic A',0.05,0,{kind:'clinic'}),point('f2','Clinic B',0.3,0,{kind:'clinic'}),
    point('f3','Pharmacy',0.01,0,{kind:'pharmacy'}),point('f4','Warehouse',0.02,0,{kind:'warehouse'})]}}},
  {id:'near',type:'measure_distance',x:360,y:100,params:{label:'Distance to the nearest facility',unit:'kilometres'}}],
  edges:[{id:'e0',from:'households',to:'near',port:'points'},{id:'e1',from:'facilities',to:'near',port:'candidates'}]};

test('Measure distance previews the candidates a condition keeps, and the distances they give',async({page})=>{
  const errors=collectPageErrors(page);
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.evaluate(f=>{localStorage.clear();localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(f));},flow);
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="near"]').click();
  await page.locator('#configure-step').click();
  const preview=page.locator('#distance-config [data-config-section="preview"]');
  await expect(preview).toBeVisible();

  // BEFORE ANY RUN, and before any condition: every candidate is eligible, and it says so rather than staying quiet,
  // so adding the first condition changes a number already in view instead of making one appear.
  await expect(preview).toContainText('4 of 4 candidates eligible (no condition narrows them)');
  // The nearest facility to a household here is the pharmacy at 0.01 degrees; the three distances are small and
  // different, so a median between the other two is a real statement about these points.
  await expect(preview).toContainText('Nearest');
  await expect(preview).toContainText('over 3 points');
  // DRAWN (2026-11-28): each household joined to the candidate it is measured to, every candidate eligible.
  const drawing=preview.locator('.preview-drawing');
  await expect(drawing.locator('path.walk-shape-result')).toHaveCount(3);
  await expect(drawing.locator('.walk-point.walk-shape-look')).toHaveCount(4);
  await expect(drawing.locator('.walk-point.walk-shape-input')).toHaveCount(3);

  // NARROWED, AND THE NUMBER MOVES AS IT IS TYPED. Two of the four are clinics.
  await page.locator('#distance-config #filter-add').click();
  // ONE FIELD AT A TIME, each settled before the next: every change redraws the dialog, so typing into the second
  // box while the first is still committing replaces the box under the keystrokes.
  await page.locator('#distance-config [data-filter-field="0"]').fill('kind');
  await page.locator('#distance-config [data-filter-field="0"]').blur();
  await expect(page.locator('#distance-config [data-filter-field="0"]')).toHaveValue('kind');
  await page.locator('#distance-config [data-filter-values="0"]').fill('clinic');
  await page.locator('#distance-config [data-filter-values="0"]').blur();
  await expect(page.locator('#distance-config [data-filter-values="0"]')).toHaveValue('clinic');
  await expect(preview).toContainText('2 of 4 candidates eligible');
  await expect(preview).not.toContainText('no condition narrows them');
  // The two clinics drawn strong, the pharmacy and the warehouse faint, and the lines go to the clinics.
  await expect(drawing.locator('.walk-point.walk-shape-look')).toHaveCount(2);
  await expect(drawing.locator('.walk-point.walk-shape-gone')).toHaveCount(2);
  await expect(drawing.locator('path.walk-shape-result')).toHaveCount(3);

  // A CONDITION THAT KEEPS NOTHING LEAVES EVERY POINT WITHOUT A DISTANCE, which is the finding: a table of
  // distances shows it only as a column of gaps.
  await page.locator('#distance-config [data-filter-values="0"]').fill('mobile-team');
  await page.locator('#distance-config [data-filter-values="0"]').blur();
  await expect(page.locator('#distance-config [data-filter-values="0"]')).toHaveValue('mobile-team');
  await expect(preview).toContainText('0 of 4 candidates eligible');
  await expect(preview).toContainText('3 of 3 points get no distance: no candidate is eligible');
  await expect(drawing.locator('path.walk-shape-result')).toHaveCount(0);

  await page.locator('#distance-config #config-cancel').click();
  expect(errors).toEqual([]);
});
