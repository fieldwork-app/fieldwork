import {test,expect} from './fixtures.mjs';
import {readFileSync} from 'node:fs';

// The practitioner, 2026-11-27, in the John Snow Voronoi example after the 0.204.5 re-audit: *"Voronoi still with no
// preview"*, then *"Summarize points to polygon for Voronoi catchment still with no preview"*. Both Previews counted
// what the step would make and drew none of it. Checked on the example itself, where the practitioner met them.
const open=async(page,id,dialog,example='snow-voronoi')=>{
  await page.goto(`/?example=${example}`);
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator(`.react-flow__node[data-id="${id}"]`).click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator(dialog);
  await expect(d).toBeVisible();
  return d;
};

test('Voronoi catchments draws its eight catchments, the study area and the pumps',async({page})=>{
  const d=await open(page,'catchments','#voronoi-dialog');
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-shape-result')).toHaveCount(8);
  await expect(drawing.locator('.walk-shape-area')).toHaveCount(1);
  await expect(drawing.locator('.walk-shape-input.walk-point')).toHaveCount(8);
  // ONE FILL: catchments carry no value (0.6.0), so no shade may suggest one is more than another.
  await expect(drawing.locator('.walk-shape-result[style]')).toHaveCount(0);
  await expect(d).toContainText('8 catchments');
});

test('Summarize points to polygons shades each catchment by its deaths, on Map\'s scale',async({page})=>{
  const d=await open(page,'summary','#summarize-points-dialog');
  const drawing=d.locator('.preview-drawing');
  await expect(d).toContainText('250 of 250 points fall in a polygon');
  const shapes=drawing.locator('.walk-shape-result');
  expect(await shapes.count()).toBeGreaterThan(1);
  await expect(drawing.locator('.walk-scale-title')).toHaveText('Total DEATHS');
  // THE VALUES REACH THE PREVIEW (2026-11-27). It read the picker's trimmed points, which carry no DEATHS, so every
  // total was nothing and every catchment would be shaded alike. Snow's catchments differ widely in deaths.
  const fills=new Set(await shapes.evaluateAll(els=>els.map(e=>e.getAttribute('style'))));
  expect(fills.size).toBeGreaterThan(1);
  // Every location falls in a catchment, so none is drawn as left out.
  await expect(drawing.locator('.walk-shape-gone')).toHaveCount(0);
});

// *"This one is isochrone, still no preview. We are supposed to have addressed this gap already and it remains a gap
// even after supposed repair."* Its Preview was minutes x speed. Snow's network is held in the workflow, so the
// isochrone can be drawn from it; the audit's reason, a network kept outside the page, holds only for a download.
test('Network isochrone draws what the Broadwick Street pump reaches in 1, 5, 10 and 15 minutes',async({page})=>{
  const d=await open(page,'catchments','#isochrone-dialog','snow-isochrone');
  // OFF THE PAGE'S THREAD: the dialog says it is drawing, then the run's worker answers. Run in place it held the page
  // for 3.4 s on opening and on every change (measured 2026-11-27).
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-shape-result')).toHaveCount(4,{timeout:30000});
  await expect(drawing.locator('.walk-shape-input.walk-point')).toHaveCount(1);
  await expect(drawing.locator('.walk-scale li')).toHaveText(['within 1 min','within 5 min','within 10 min','within 15 min']);
  await expect(d).toContainText('The 15-minute region covers');
  // THE SETTINGS MOVE IT, without holding the page while they do.
  const before=await drawing.locator('.walk-shape-result').first().getAttribute('d');
  const blocked=await page.evaluate(()=>{const t=performance.now();const el=document.querySelector('#isochrone-times');
    el.value='1, 5';el.dispatchEvent(new Event('change'));return performance.now()-t;});
  expect(blocked).toBeLessThan(500);
  await expect(d.locator('.preview-drawing .walk-shape-result')).toHaveCount(2,{timeout:30000});
  expect(await d.locator('.preview-drawing .walk-shape-result').first().getAttribute('d')).not.toBe(before);
});

// A NETWORK EDITED TO THE SAME COUNTS IS A DIFFERENT NETWORK (review of #6, 2026-11-27): the Preview kept its answers by
// the number of junctions and edges, so the same 738 and 1,619 with every edge four times as long drew the old bands.
test('Network isochrone redraws when its network changes and the counts do not',async({page})=>{
  const d=await open(page,'catchments','#isochrone-dialog','snow-isochrone');
  const first=d.locator('.preview-drawing .walk-shape-result').first();
  await expect(d.locator('.preview-drawing .walk-shape-result')).toHaveCount(4,{timeout:30000});
  const before=await first.getAttribute('d');
  await page.keyboard.press('Escape');
  await expect(d).toBeHidden();
  const graph=JSON.parse(readFileSync(new URL('../examples/john-snow/network.json',import.meta.url),'utf8'));
  for(const edge of graph.edges)edge.lengthM*=4;
  await page.locator('.react-flow__node[data-id="network"]').click();
  await page.locator('#network-upload').setInputFiles({name:'soho-x4.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(graph))});
  await expect(page.locator('#inspector-content')).toContainText('738');
  await page.locator('.react-flow__node[data-id="catchments"]').click();
  await page.locator('#inspector-content #configure-step').click();
  await expect(d).toBeVisible();
  await expect(d.locator('.preview-drawing .walk-shape-result')).toHaveCount(4,{timeout:30000});
  await expect.poll(async()=>await d.locator('.preview-drawing .walk-shape-result').first().getAttribute('d'),{timeout:30000}).not.toBe(before);
});

/** NESTED BANDS TOLD APART (2026-11-27). The practitioner, of Clip polygons on Snow's isochrone: *"the isochrone bands
 *  are supposed to show 1, 5, 10, 15 but the layers are almost indistinguishable"*; of Summarize there: the longest band
 *  "covers the other smaller isochrone band polygons". The cut keeps each band's minutes; each is shaded on Map's ramp,
 *  keyed, and the smallest drawn last. */
test('Clip polygons and Summarize show Snow\'s four walking-time bands apart, the shortest on top',async({page})=>{
  test.setTimeout(120000);
  await page.goto('/?example=snow-isochrone');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:90000});
  await page.locator('[data-view="workflow"]').click();
  const preview=async id=>{await page.locator(`.react-flow__node[data-id="${id}"]`).click();
    await page.locator('#inspector-content #configure-step').click();
    const d=page.locator('dialog[open]');await expect(d.locator('.preview-drawing .walk-shape-result').first()).toBeAttached();return d;};
  const clip=await preview('clip');
  const fills=await clip.locator('.preview-drawing .walk-shape-result').evaluateAll(ps=>ps.map(p=>p.style.fill));
  expect(new Set(fills).size).toBe(4);
  await expect(clip.locator('.walk-scale li')).toHaveText(['1 min','5 min','10 min','15 min']);
  await clip.locator('button',{hasText:'Cancel'}).click();
  const summary=await preview('summary');
  const sizes=await summary.locator('.preview-drawing .walk-shape-result').evaluateAll(ps=>ps.map(p=>{const b=p.getBBox();return b.width*b.height;}));
  expect(sizes).toEqual([...sizes].sort((a,b)=>b-a));
});
