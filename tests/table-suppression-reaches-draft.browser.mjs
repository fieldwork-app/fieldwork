import {test,expect} from './fixtures.mjs';
import {readFileSync} from 'node:fs';
import {unzipSync,strFromU8} from 'fflate';
import {seedWorkflow} from './seed-workflow.mjs';
import {collectPageErrors} from './page-errors.mjs';

/** SMALL COUNTS HIDDEN AFTER A RUN STAY HIDDEN IN THE DRAFT (review of #8, 2026-11-28). Table's Apply changes how a table
 *  is shown without running it again, and the write-up read the presentation from the run's own copy of the workflow:
 *  Results showed [c], the Notes figure the raw count, and the draft's attached CSV "District 1,4". Sixty rows, so the
 *  draft attaches the table rather than printing it. */
test.use({serviceWorkers:'block'});
const rows=Array.from({length:60},(_,i)=>({key:{district:`District ${i+1}`},value:i===0?4:20+i}));
const data={kind:'data-table',keys:['district'],valueField:'cases',rows,rowCount:60,missingValueCount:0};

test('counts hidden after a run are hidden in Notes and in the draft\'s attached CSV, without running again',async({page})=>{
  test.setTimeout(120000);
  const errors=collectPageErrors(page);
  await seedWorkflow(page,{nodes:[{id:'cases',type:'table_input',x:20,y:40,params:{label:'Cases by district',keys:['district'],valueField:'cases',data}},
    {id:'table',type:'table_output',x:400,y:40,params:{label:'Cases',inputMode:'table'}}],
    edges:[{id:'e-table',from:'cases',to:'table',port:'table'}]});
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
  // Hidden after the run, by Apply alone.
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="table"]').click();
  await page.locator('#configure-step').click();
  const d=page.locator('#table-config');
  await d.locator('.present-suppress summary').click();
  await d.locator('#present-suppress-below').fill('5');await d.locator('#present-suppress-below').press('Tab');
  await d.locator('[data-suppress-column="cases"]').check();
  await d.locator('#config-apply').click();
  await expect(d).toBeHidden();
  await expect(page.locator('#workflow-state')).toContainText('Run complete');
  // Notes draws it as Results does.
  await page.locator('[data-view="notes"]').click();
  const figure=page.locator('.notes-figure[data-figure="table"]').first();
  await expect(figure).toContainText('[c]');
  await expect(figure.locator('td',{hasText:/^4$/})).toHaveCount(0);
  // And the draft's attached CSV does not hand it on.
  await page.locator('[data-publication]').click();
  await page.locator('#publication-view [data-publication-kind]').selectOption('sitrep-who');
  const [file]=await Promise.all([page.waitForEvent('download'),page.locator('[data-publication-files]').click()]);
  const entries=unzipSync(readFileSync(await file.path()));
  const csv=Object.keys(entries).filter(f=>f.endsWith('.csv')).map(f=>strFromU8(entries[f])).join('\n');
  expect(csv).toContain('District 1,[c]');
  expect(csv).not.toContain('District 1,4');
  expect(errors).toEqual([]);
});
