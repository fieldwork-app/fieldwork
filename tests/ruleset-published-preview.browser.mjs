import {test,expect} from './fixtures.mjs';
import {collectPageErrors} from './page-errors.mjs';

/** A PUBLISHED RULESET'S PREVIEW SHOWS WHAT IT CONCLUDES OVER THESE RECORDS (2026-11-28). The preview audit found Apply
 *  ruleset's published dialog the last transform that neither drew nor showed rows, with no reason recorded: it listed
 *  the rules and not what they decide. 7-1-7 is evaluated directly, so its dialog can run it as the run does, with the
 *  columns chosen for each date. Case A: onset 11 May, diagnosis 20 May, so 9 days to detect. */
function workflow(){
  const rows=[['A','2015-05-11','2015-05-20','2015-05-19'],['B','2015-05-18','2015-05-20','2015-05-20']];
  const data={kind:'data-table',keys:['id','dt_onset','dt_diag','dt_report'],valueField:'n',
    rows:rows.map(([id,dt_onset,dt_diag,dt_report])=>({key:{id,dt_onset,dt_diag,dt_report},value:1})),rowCount:rows.length,missingValueCount:0};
  return {schema:'fieldwork/workflow/1',name:'7-1-7 on two cases',nodes:[
    {id:'cases',type:'table_input',x:20,y:20,params:{label:'Cases',keys:data.keys,valueField:'n',data}},
    {id:'timely',type:'apply_ruleset',x:320,y:20,params:{label:'7-1-7 timeliness',parameters:{detectionTarget:7,notificationTarget:1,responseTarget:7},
      ruleset:{id:'urn:fieldwork:ruleset:seven-one-seven',version:'1.0.0',title:'7-1-7 timeliness',inputs:[['records','table']],output:'table'}}}],
    edges:[{id:'e1',from:'cases',to:'timely',port:'records'}]};
}

test('Apply ruleset, published: the Preview shows the rows with what the ruleset concludes, read from the columns chosen',async({page})=>{
  const errors=collectPageErrors(page);
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.locator('#workflow-file').setInputFiles({name:'seven.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(workflow()))});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="timely"]').click();
  await page.locator('#configure-step').click();
  const dialog=page.locator('#ruleset-config');
  const after=dialog.locator('[data-config-section="preview"] .rule-live-table').last();
  // Before any column is chosen the dates are read from the ruleset's own names, which these records do not carry.
  await expect(after.locator('th',{hasText:'days_to_detect'})).toBeVisible();
  await dialog.locator('[data-ruleset-binding="fw:emergenceDate"]').selectOption('dt_onset');
  await dialog.locator('[data-ruleset-binding="fw:detectionDate"]').selectOption('dt_diag');
  const header=await after.locator('th').allTextContents();
  const row=after.locator('tr',{has:page.locator('td',{hasText:/^A$/})});
  const cells=await row.locator('td').allTextContents();
  expect(cells[header.indexOf('days_to_detect')]).toBe('9');
  // A RULESET THAT GOES TO THE REASONER is not run in the dialog: the Preview says where its conclusions are.
  await dialog.locator('#ruleset-choice').selectOption('urn:fieldwork:ruleset:extract-contract@1.0.0');
  await expect(dialog.locator('[data-config-section="preview"]')).toContainText('What these rules conclude over the records is in the Result after a run.');
  await expect(dialog.locator('[data-config-section="preview"] .rule-live-table')).toHaveCount(0);
  await dialog.locator('#config-cancel').click();
  const discard=page.locator('dialog[open] button',{hasText:/Discard|Leave/});
  if(await discard.count())await discard.first().click();
  expect(errors).toEqual([]);
});
