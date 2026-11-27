import {test,expect} from './fixtures.mjs';
import {inChartSettings} from './map-settings.mjs';
import {collectPageErrors} from './page-errors.mjs';

// WAS THERE A CLUSTER IN HAGELLOCH? (experiment 200, Detect): the third workflow, as shipped. The scan runs in a worker
// with a progress panel (the practitioner, 2026-11-10: "That may need a progress bar"), and its clusters are drawn over
// the village and listed.
test('Hagelloch: the space-time scan runs with a progress bar, and its clusters are mapped and listed',async({page})=>{
  // The example runs itself on open: the scan and the 87-day replay. WebKit on CI is slower than that by minutes.
  test.setTimeout(420_000);
  const errors=collectPageErrors(page);
  await page.goto('/?example=hagelloch-cluster');
  await expect(page.locator('#project-select option:checked')).toHaveText('Measles in Hagelloch, 1861 · 5 workflows');
  await page.locator('[data-view="workflow"]').click();
  // WAIT FOR THE OPENING RUN TO FINISH, not only for Run to be enabled: on CI the button was enabled for a moment before
  // that run started and took it for minutes, so the click below timed out (three main runs, both engines, 0.81.2 to
  // 0.82.0). The map-links test met the same race at 0.79.0.
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:300_000});
  await expect(page.locator('#run-button')).toBeEnabled({timeout:60_000});
  // Recorded as it happens, so the check cannot race the panel it checks.
  await page.evaluate(()=>{
    const seen=window.__progressSeen=[];
    new MutationObserver(()=>{const panel=document.getElementById('run-progress');if(panel)seen.push(panel.textContent);})
      .observe(document.body,{subtree:true,childList:true,characterData:true});
  });
  await page.locator('#run-button').click();
  // The state still reads complete from the opening run, so wait for THIS run's last phase before reading it.
  await expect.poll(()=>page.evaluate(()=>window.__progressSeen.some(t=>t.includes('Scanning the days:'))),{timeout:240_000}).toBe(true);
  await expect(page.locator('#workflow-state')).toHaveText('✓ Run complete',{timeout:240_000});
  const seen=await page.evaluate(()=>window.__progressSeen);
  expect(seen.some(t=>t.includes('Shuffling the dates:')&&t.includes('of 999'))).toBe(true);
  expect(seen.some(t=>t.includes('Scanning the days:')&&t.includes('of 87'))).toBe(true);
  await expect(page.locator('#run-progress')).toHaveCount(0);

  // The Inspector says what was found, with the seed.
  await page.locator('.react-flow__node[data-id="scan"]').click();
  await expect(page.locator('#inspector-content')).toContainText('The most likely cluster: 8 cases where 0.55 were expected');
  await expect(page.locator('#inspector-content')).toContainText('seed 20261110');

  await page.locator('[data-view="results"]').click();
  await page.getByRole('tab',{name:'Every cluster reported'}).click();
  await expect(page.locator('main').first()).toContainText('observed_over_expected');
  await page.getByRole('tab',{name:'Clusters over the village'}).click();
  // THE 1824 SHEET UNDER THE CLUSTERS (2026-11-15): placed already, its image filled from the example's own file.
  await expect(page.locator('#map image').first()).toBeVisible({timeout:30000});
  await page.locator('#map').screenshot({path:test.info().outputPath('cluster-sheet.png')});
  await expect(page.locator('#map')).toBeVisible();
  // The replay PLAYS on the map (the practitioner, 2026-11-10: "Where do I see the day by day play"): each day its
  // circle, the cases known by then, and what the scan said.
  await page.getByRole('tab',{name:'The outbreak, day by day'}).click();
  const slider=page.locator('#catchment-map-host [data-frame-slider]');
  await expect(slider).toBeVisible({timeout:30_000});
  await slider.fill('22');await slider.dispatchEvent('input');
  await expect(page.locator('#catchment-map-host [data-frame-label]')).toHaveText('1861-11-21');
  await expect(page.locator('#catchment-map-host [data-frame-caption]')).toContainText('32 cases known; most likely cluster 6 cases where 2.63 were expected, p = 0.039');
  await expect(page.locator('#catchment-map-host .catchment-point-mark')).toHaveCount(32);
  // The circle's colour says whether that day's p was at or under 0.05, and the legend names both (2026-11-10).
  await expect(page.locator('#catchment-map-host .map-class-legend')).toContainText('p at or under 0.05, that day alone');
  await expect(page.locator('#catchment-map-host .map-class-legend')).toContainText('p above 0.05, that day alone');
  await expect(page.locator('#catchment-map-host')).not.toContainText('cumulative travel times');
  // The replay: one row per day with a cluster, and the Inspector names the first day flagged.
  await page.getByRole('tab',{name:'Each day’s most likely cluster'}).click();
  await expect(page.locator('main').first()).toContainText('analysis_day');
  // WHEN, ON A TIME AXIS (2026-11-15): each evening's p-value with 0.05 marked, over the cases known, a chart in Notes.
  await page.getByRole('tab',{name:'Each evening\u2019s scan'}).click();
  await expect(page.locator('main').first()).toContainText('p = 0.05');
  // Its settings in Configure: the columns as panels, the p-value's line at 0.05 with its label.
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="replay-chart"]').click();
  await expect(page.locator('#inspector-content')).toContainText('one panel each for p_value and cases_known, a dashed line at 0.05 on p_value');
  await inChartSettings(page,async d=>{
    await expect(d.locator('[data-panel-column="p_value"]')).toBeChecked();
    await expect(d.locator('[data-panel-line-value="p_value"]')).toHaveValue('0.05');
    await expect(d.locator('[data-panel-line-label="p_value"]')).toHaveValue('p = 0.05');
  },{apply:false});
  await page.locator('[data-view="results"]').click();
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="replay"]').click();
  await expect(page.locator('#inspector-content')).toContainText('The first day the most likely cluster had p at or under 0.05 was 1861-11-21');
  // Both write a Methods note, and the method's reference reaches References.
  await page.locator('[data-view="notes"]').click();
  await expect(page.locator('.notes-part[data-section="Methods"]')).toContainText('space-time permutation scan statistic');
  await expect(page.locator('.notes-part[data-section="References"]')).toContainText('Kulldorff M, Heffernan R, Hartman J');
  // Where this worked example lives online: two QR codes and their addresses (experiment 203).
  await expect(page.locator('.notes-part[data-section="References"] .example-links svg.qr-code')).toHaveCount(2);
  await expect(page.locator('.notes-part[data-section="References"] .example-links')).toContainText('https://fieldwork-app.github.io/fieldwork/?example=hagelloch-cluster');
  await page.screenshot({path:'test-results/hagelloch-cluster-example.png',fullPage:true});
  expect(errors).toEqual([]);
});
