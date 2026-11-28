import {test,expect} from './fixtures.mjs';
import {collectPageErrors} from './page-errors.mjs';

// THE PREVIEWS THAT COUNTED AND DID NOT DRAW (2026-11-28). The preview audit's re-review of 2026-11-27
// (docs/audits/preview-audit.md) listed Convex hull, Mean center, Move points in a donut, Aggregate points to H3 cells,
// Compare point sets and Cases by period as steps that change data or shapes, whose Preview neither drew nor showed
// rows, with no reason recorded. Each is opened here on the worked example that holds it, and its drawing checked.
const open=async(page,example,id,dialog)=>{
  await page.goto(`/?example=${example}`);
  await page.waitForSelector('html[data-ready]');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator(`.react-flow__node[data-id="${id}"]`).click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator(dialog);
  await expect(d).toBeVisible();
  return d;
};

test('Convex hull draws the outline around Snow\'s 250 death locations',async({page})=>{
  const errors=collectPageErrors(page);
  const d=await open(page,'snow-extent','extent','#hull-dialog');
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-shape-result')).toHaveCount(1);
  await expect(drawing.locator('.walk-shape-input.walk-point')).toHaveCount(250);
  await expect(d).toContainText('of the 250 points');
  expect(errors).toEqual([]);
});

test('Mean center draws its centre over the points, and is weighted by DEATHS as the run weights it',async({page})=>{
  const d=await open(page,'snow-geoprivacy','original-center','#mean-center-dialog');
  // THE RECORDS' OWN VALUES (2026-11-28): the Preview read the picker's points, which carry a name and a place only,
  // so a weight was "absent" on every point and the Preview refused what the run does.
  await d.locator('#mean-center-weight').selectOption('DEATHS');
  await expect(d).toContainText('weighted by DEATHS totalling 489');
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-point.walk-shape-result')).toHaveCount(1);
  await expect(drawing.locator('.walk-shape-input.walk-point')).toHaveCount(250);
  await expect(drawing.locator('.walk-shape-label')).toHaveText('Centre');
});

test('Mean center of the moved points draws from what the donut computed',async({page})=>{
  const d=await open(page,'snow-geoprivacy','moved-center','#mean-center-dialog');
  await expect(d.locator('.preview-drawing .walk-point.walk-shape-result')).toHaveCount(1);
  await expect(d.locator('.preview-drawing .walk-shape-input.walk-point')).toHaveCount(250);
});

test('Move points in a donut draws where each point was and where the seed moves it',async({page})=>{
  const d=await open(page,'snow-geoprivacy','move','#donut-dialog');
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-point.walk-shape-gone')).toHaveCount(250);
  await expect(drawing.locator('.walk-point.walk-shape-result')).toHaveCount(250);
  await expect(drawing.locator('.walk-key li')).toHaveText(['Faint: where each point was','Filled: where this seed moves it']);
  // THE SEED MOVES THEM: another seed, other places.
  const before=await drawing.locator('.walk-point.walk-shape-result').first().getAttribute('cx');
  await d.locator('#donut-seed').fill('7');
  await d.locator('#donut-seed').dispatchEvent('change');
  await expect.poll(()=>d.locator('.preview-drawing .walk-point.walk-shape-result').first().getAttribute('cx')).not.toBe(before);
});

test('Aggregate points to H3 cells draws the cells it keeps, shaded by count, and the points it leaves out',async({page})=>{
  const d=await open(page,'snow-geoprivacy','group','#h3-dialog');
  const drawing=d.locator('.preview-drawing');
  const cells=await drawing.locator('.walk-shape-result').count();
  expect(cells).toBeGreaterThan(1);
  await expect(drawing.locator('.walk-scale-title')).toHaveText('Points in the cell');
  // A HIGHER MINIMUM LEAVES MORE OUT, drawn faint.
  await d.locator('#h3-min').fill('10');
  await d.locator('#h3-min').dispatchEvent('change');
  await expect.poll(()=>d.locator('.preview-drawing .walk-shape-result').count()).toBeLessThan(cells);
  expect(await d.locator('.preview-drawing .walk-point.walk-shape-gone').count()).toBeGreaterThan(0);
});

test('Compare point sets draws the two mean centres, the line between them and the pumps',async({page})=>{
  const d=await open(page,'snow-geoprivacy','compare','#compare-config');
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-shape-label')).toHaveText(['Original centre','Moved centre']);
  await expect(drawing.locator('.walk-shape-input.walk-point')).toHaveCount(8);
  await expect(d).toContainText('The mean centre would move');
  await expect(d).toContainText('Each point moved between');
});

test('Cases by period draws the curve it would make, one bar a day of the week',async({page})=>{
  const d=await open(page,'hagelloch','weekday','#series-config');
  const curve=d.locator('.series-curve');
  await expect(curve.locator('rect.detect-bar')).toHaveCount(7);
  await expect(curve.locator('.walk-key li')).toHaveText('Bars: the cases in each day of the week.');
  // THE PERIOD MOVES IT: by day, one bar per day from the first prodrome to the last, empty days kept.
  await d.locator('#series-period').selectOption('day');
  await expect.poll(()=>d.locator('.series-curve rect.detect-bar').count()).toBeGreaterThan(7);
});
