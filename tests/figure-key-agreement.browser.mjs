import {test,expect} from './fixtures.mjs';
import {FIGURE_ROLE,FIGURE_PALETTE} from '../build/presentation.js';

/** A KEY THAT DISAGREES WITH ITS PLOT IS WORSE THAN NO KEY, because the reader trusts it.
 *
 *  Found twice on 2026-10-25, in two different renderers, by rendering the figures and looking:
 *
 *  - the static point map drew every mark as a circle coloured by STATUS while its key named one
 *    hue and mark per source layer, so Snow's eight pumps were indistinguishable from 250 deaths;
 *  - the isochrone plot drew `gray` observations and `red` sites while its key named Okabe-Ito's
 *    #CC79A7 and #E69F00 and drew the sites as squares.
 *
 *  The second is the worse of the two. `red` on `gray` is the pair that fails first under the
 *  commonest colour vision deficiencies, and neither colour is in the declared palette -- which
 *  is exactly what `CategoricalPaletteIsColourBlindSafe` exists to prevent, on a figure it was
 *  not being applied to. A rule that holds only where somebody remembered to apply it is a rule
 *  about remembering.
 *
 *  This asserts the agreement itself rather than the colours, so a palette change moves both
 *  sides together and the test keeps meaning the same thing. */
test('the isochrone plot draws the colours and shapes its key names',async({page})=>{
  await page.goto('/?example=snow-isochrone');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
  await page.locator('[data-view="results"]').click();
  await page.locator('[data-output="map"]').click();

  const observation=page.locator('#map [data-plot-observation]').first();
  const site=page.locator('#map [data-plot-site]').first();
  await expect(observation).toBeAttached({timeout:20000});
  await expect(site).toBeAttached();

  // The marks carry the roles the key draws, rather than two colours chosen at the renderer.
  expect(await observation.getAttribute('fill')).toBe(FIGURE_ROLE.secondary);
  expect(await site.getAttribute('fill')).toBe(FIGURE_ROLE.site);
  // Both from the declared palette, which `gray` and `red` were not.
  for(const mark of [observation,site])
    expect(FIGURE_PALETTE).toContain(await mark.getAttribute('fill'));

  // Shape distinguishes them too, so the figure survives being read without colour at all.
  const observationPath=await observation.getAttribute('d');
  const sitePath=await site.getAttribute('d');
  expect(observationPath).toBeTruthy();
  expect(sitePath).not.toBe(observationPath);

  // And the key names both, in those same hues.
  const key=page.locator('#map-communication-key');
  // The carried points by their layer's own name, not a generic "Observations" (2026-11-27).
  await expect(key).toContainText('death locations');
  await expect(key).toContainText('Sites');
  const keyFills=await key.locator('path').evaluateAll(els=>els.map(e=>e.getAttribute('fill')));
  expect(keyFills).toContain(FIGURE_ROLE.secondary);
  expect(keyFills).toContain(FIGURE_ROLE.site);
  // Every band the plot draws has its entry, in that band's colour and see-through as drawn (2026-11-27): the key named one
  // "travel-time region" in a hue no band was drawn in once the bands took one colour per time.
  const bandFills=[...new Set(await page.locator('#map [data-catchment]').evaluateAll(els=>els.map(e=>e.getAttribute('fill'))))];
  expect(bandFills.length).toBeGreaterThan(1);
  for(const fill of bandFills)expect(keyFills).toContain(fill);
  const keyOpacities=await key.locator('path').evaluateAll(els=>els.map(e=>[e.getAttribute('fill'),e.getAttribute('fill-opacity')]));
  const plotOpacity=await page.locator('#map [data-catchment]').first().getAttribute('fill-opacity');
  for(const fill of bandFills)expect(keyOpacities.find(([f])=>f===fill)?.[1]).toBe(plotOpacity);

  // The caption under the plot described the old colours in words. It now describes the shapes,
  // which a reader who cannot see the hues can still use.
  await expect(page.locator('#map')).toContainText('Dots: observations');
  await expect(page.locator('#map')).not.toContainText('red: sites');
});
