import {test,expect} from './fixtures.mjs';
import {inTableSettings} from './map-settings.mjs';
import {seedWorkflow} from './seed-workflow.mjs';
import {collectPageErrors} from './page-errors.mjs';

/** TABLE ON THE STANDARD INSPECTOR (experiment 186, 2026-11-09). Touched for the sea-level example, when a number stopped
 *  becoming its headings: its name and write-up section, its inputs, one sentence and Configure…, and what the last run
 *  showed. The totals claim moved into Configure…, and is applied there. */
test('Table is on the standard Inspector, and its totals claim is set in Configure…',async({page})=>{
  const errors=collectPageErrors(page);
  const rows=[['water','Southwark',286],['water','Lambeth',14]].map(([measure,company,value])=>({key:{measure,company},value}));
  const data={kind:'data-table',keys:['measure','company'],valueField:'deaths',rows,rowCount:2,missingValueCount:0};
  await seedWorkflow(page,{nodes:[{id:'deaths',type:'table_input',x:20,y:40,params:{label:'Deaths by company',keys:data.keys,valueField:'deaths',data}},
    {id:'table',type:'table_output',x:400,y:40,params:{label:'Deaths',inputMode:'table'}}],
    edges:[{id:'e-table',from:'deaths',to:'table',port:'table'}]});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="table"]').click();
  const inspector=page.locator('#inspector-content');
  expect(await inspector.locator('[data-standard-section]').evaluateAll(els=>els.map(e=>e.dataset.standardSection)))
    .toEqual(['name','inputs','settings','result','learn and record']);
  await expect(inspector.locator('#table-table')).toHaveValue('deaths');
  await expect(inspector.locator('.standard-sentence')).toContainText('Shows the rows of Deaths by company as they stand');
  await expect(inspector.locator('#output-totals')).toHaveCount(0);
  await inTableSettings(page,d=>d.locator('#output-totals').check());
  await expect(inspector.locator('.standard-sentence')).toContainText('with totals you asserted');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')).nodes.find(n=>n.id==='table').params.totalsAsserted)).toBe(true);
  expect(errors).toEqual([]);
});

/** ITS PORTS, LIKE MAP'S (2026-11-09, the practitioner: "streamline its input ports like map output"). The node draws
 *  what is connected and one port to connect more; the Inspector lists what is connected and one picker. A point layer
 *  chosen there is bound to the point port by what it emits. */
test('Table draws what is connected and one port to add another, on the canvas and in the Inspector',async({page})=>{
  const errors=collectPageErrors(page);
  const rows=[['water','Southwark',286]].map(([measure,company,value])=>({key:{measure,company},value}));
  const data={kind:'data-table',keys:['measure','company'],valueField:'deaths',rows,rowCount:1,missingValueCount:0};
  const pump={type:'Feature',id:'broad',properties:{name:'Broad Street'},geometry:{type:'Point',coordinates:[-0.1367,51.5133]}};
  await seedWorkflow(page,{nodes:[{id:'deaths',type:'table_input',x:20,y:40,params:{label:'Deaths by company',keys:data.keys,valueField:'deaths',data}},
    {id:'pumps',type:'point_input',x:20,y:260,params:{label:'Pumps',data:{type:'FeatureCollection',features:[pump]}}},
    {id:'table',type:'table_output',x:400,y:40,params:{label:'Deaths',inputMode:'table'}}],
    edges:[{id:'e-table',from:'deaths',to:'table',port:'table'}]});
  await page.locator('[data-view="workflow"]').click();
  const node=page.locator('.react-flow__node[data-id="table"]');
  await expect(node.locator('.node-port-row')).toHaveText(['Deaths by company','+ Add an input']);
  await node.click();
  const inspector=page.locator('#inspector-content');
  await expect(inspector.locator('select[data-map-port]')).toHaveCount(1);
  await inspector.locator('#table-add-input').selectOption('pumps');
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')).edges
    .filter(e=>e.to==='table').map(e=>`${e.from}:${e.port}`).sort())).toEqual(['deaths:table','pumps:points']);
  // Both results on this canvas are connected, so there is nothing left to add, and the add port goes, as Map's does.
  await expect(node.locator('.node-port-row')).toHaveText(['Deaths by company','Pumps']);
  await expect(inspector.locator('#table-add-input')).toHaveCount(0);
  expect(errors).toEqual([]);
});

/** THE TABLE ITSELF IN ITS DIALOG (the practitioner, 2026-11-27: "Table output config dialog should have a preview of the
 *  table"; then "limited to 10-20 rows (option to display, for review purpose)"): ten rows unless more are asked for,
 *  the coordinates as the dialog sets them, and the Presentation section's title and notes, before Apply. */
test('Configure… previews ten rows, more on request, as the coordinates and the presentation set them',async({page})=>{
  const errors=collectPageErrors(page);
  await page.goto('/?example=snow-geoprivacy');
  // AFTER THE EXAMPLE'S OWN RUN: an edit applied while a run is in progress is dropped (TODO, found here 2026-11-27).
  await expect(page.locator('#workflow-state')).toHaveText('✓ Run complete',{timeout:60000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="before-table"]').click();
  await page.locator('#configure-step').click();
  const dialog=page.locator('#table-config');
  await expect(dialog.locator('[data-config-section="preview"] thead th')).toHaveText(['Record','Longitude (°)','Latitude (°)','DEATHS','FID']);
  await expect(dialog).toContainText('250 rows, the first 10 shown.');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr')).toHaveCount(10);
  await dialog.locator('#preview-rows').selectOption('all');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr')).toHaveCount(250);
  await dialog.locator('#preview-rows').selectOption('20');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr')).toHaveCount(20);
  await expect(dialog.locator('[data-config-section="preview"] tbody tr').first().locator('td').nth(1)).toHaveText('-0.137930');
  // Numbers right-aligned under right-aligned headings.
  await expect(dialog.locator('[data-config-section="preview"] thead th').nth(3)).toHaveCSS('text-align','right');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr').first().locator('td').nth(3)).toHaveCSS('text-align','right');
  await dialog.locator('#output-coordinates').selectOption('metres');
  await expect(dialog.locator('[data-config-section="preview"] thead th')).toHaveText(['Record','Easting (m)','Northing (m)','DEATHS','FID']);
  await expect(dialog.locator('[data-config-section="preview"] tbody tr').first().locator('td').nth(1)).toHaveText('698587.2');
  await dialog.locator('#output-coordinates').selectOption('degrees');
  // THE PRESENTATION, shown in the preview and kept by Apply: a title above, notes below.
  await dialog.locator('#present-caption').fill('Deaths by house, Soho, 1854');await dialog.locator('#present-caption').press('Tab');
  await dialog.locator('#present-notes').fill('One row per house.');await dialog.locator('#present-notes').press('Tab');
  await dialog.locator('#present-decimals').selectOption('1');
  await expect(dialog.locator('.table-caption')).toHaveText('Deaths by house, Soho, 1854');
  await expect(dialog.locator('.table-notes')).toHaveText('One row per house.');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr').first().locator('td').nth(3)).toHaveText('3.0');
  await dialog.locator('#config-apply').click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')).nodes
    .find(n=>n.id==='before-table').params.presentation)).toEqual({caption:'Deaths by house, Soho, 1854',notes:'One row per house.',decimals:1});
  expect(errors).toEqual([]);
});

/** A POLYGON TABLE PREVIEWS ITS AREAS (the practitioner, 2026-11-27, on Snow's Catchment counts and deaths: "Table output
 *  still has no preview"): the rows the last run showed, read wide as Results reads them. */
test('a polygon table previews its areas, wide, as Results shows them',async({page})=>{
  const errors=collectPageErrors(page);
  await page.goto('/?example=snow-voronoi');
  await expect(page.locator('#workflow-state')).toHaveText('✓ Run complete',{timeout:60000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="table"]').click();
  await page.locator('#inspector-content button',{hasText:'Configure'}).click();
  const dialog=page.locator('#table-config');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr')).toHaveCount(8);
  await expect(dialog.locator('[data-config-section="preview"] thead th').first()).toHaveText('id');
  await expect(dialog.locator('[data-config-section="preview"] thead th').nth(1)).toHaveText('locations');
  await expect(dialog.locator('[data-config-section="preview"] thead')).toContainText('Broadwick Street');
  // Each area named in a row header, as Results names it; its locations the first value.
  await expect(dialog.locator('[data-config-section="preview"] tbody tr').first().locator('th')).toHaveText('pump-250');
  await expect(dialog.locator('[data-config-section="preview"] tbody tr').first().locator('td').first()).toHaveText('171');
  expect(errors).toEqual([]);
});

/** THE PREVIEW SHOWS THE DRAFT'S TOTALS (PR 10's review): a 2x2 holding 1, 2, 3 and 4, and "Show totals" ticked, previews
 *  the row and column totals and the grand total of 10 before Apply, drawn by Results' own renderer. */
test('ticking Show totals adds the totals to the preview before Apply',async({page})=>{
  const errors=collectPageErrors(page);
  const rows=[['exposed','ill',1],['exposed','well',2],['unexposed','ill',3],['unexposed','well',4]]
    .map(([exposure,outcome,value])=>({key:{exposure,outcome},value}));
  const data={kind:'data-table',keys:['exposure','outcome'],valueField:'count',rows,rowCount:4,missingValueCount:0};
  await seedWorkflow(page,{nodes:[{id:'cells',type:'table_input',x:20,y:40,params:{label:'Four cells',keys:data.keys,valueField:'count',data}},
    {id:'table',type:'table_output',x:400,y:40,params:{label:'The 2x2'}}],
    edges:[{id:'e-table',from:'cells',to:'table',port:'table'}]});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="table"]').click();
  await page.locator('#configure-step').click();
  const dialog=page.locator('#table-config');
  await expect(dialog.locator('[data-config-section="preview"] table')).not.toContainText('Total');
  await dialog.locator('#output-totals').check();
  await expect(dialog.locator('[data-config-section="preview"] table')).toContainText('Total');
  await expect(dialog.locator('table tfoot')).toContainText('10');
  expect(errors).toEqual([]);
});

/** EACH COLUMN, AND THE SMALL COUNTS (2026-11-28, the table standard's open items): a column's decimal places, unit and
 *  note, and counts below a threshold hidden, set in Configure… and drawn alike in its preview and in Results. */
test('a column\'s unit, note and decimal places, and its small counts hidden, read alike in the preview and in Results',async({page})=>{
  const errors=collectPageErrors(page);
  await page.goto('/?example=snow-geoprivacy');
  await expect(page.locator('#workflow-state')).toHaveText('✓ Run complete',{timeout:60000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="before-table"]').click();
  await page.locator('#configure-step').click();
  const dialog=page.locator('#table-config');
  await dialog.locator('#present-decimals').selectOption('1');
  await dialog.locator('.present-columns summary').click();
  const deaths=dialog.locator('.present-columns tr[data-column="DEATHS"]');
  await deaths.locator('[data-col-decimals]').selectOption('0');
  await deaths.locator('[data-col-unit]').fill('deaths');await deaths.locator('[data-col-unit]').press('Tab');
  await deaths.locator('[data-col-note]').fill('Counted by Snow.');await deaths.locator('[data-col-note]').press('Tab');
  await dialog.locator('.present-suppress summary').click();
  await dialog.locator('#present-suppress-below').fill('3');await dialog.locator('#present-suppress-below').press('Tab');
  await dialog.locator('[data-suppress-column="DEATHS"]').check();
  const heading=dialog.locator('.table-presented thead th').nth(3);
  await expect(heading).toHaveText('DEATHS (deaths) [note 1]');
  await expect(dialog.locator('.table-presented .table-notes')).toHaveText(['[note 1] Counted by Snow.','[c] In DEATHS, a count from 1 to 2 is not shown, for confidentiality.']);
  const cells=await dialog.locator('.table-presented tbody tr td:nth-child(4)').allTextContents();
  expect(cells.every(c=>c==='[c]'||/^\d+$/.test(c)),`DEATHS to no places or hidden: ${cells.slice(0,5)}`).toBe(true);
  expect(cells).toContain('[c]');
  expect(cells.some(c=>c==='1'||c==='2')).toBe(false);
  await dialog.locator('#config-apply').click();
  await expect(dialog).toBeHidden();
  await page.locator('[data-view="results"]').click();
  await page.locator('#result-tabs [data-output="before-table"]').click();
  await expect(page.locator('#result-head')).toContainText('DEATHS (deaths) [note 1]');
  await expect(page.locator('#table-notes')).toContainText('[note 1] Counted by Snow.');
  await expect(page.locator('#table-notes')).toContainText('[c] In DEATHS, a count from 1 to 2 is not shown');
  await expect(page.locator('#result-rows')).toContainText('[c]');
  expect(errors).toEqual([]);
});
