import {test,expect} from './fixtures.mjs';
import {configureStep} from './configure-step.mjs';
import {collectPageErrors} from './page-errors.mjs';

// Stage two of experiment 122's weighted mean centre: until this control existed, `weightField`
// could only arrive in an imported workflow, so no practitioner could reach it.
test('a mean centre can be weighted by a record attribute, and the receipt says which',async({page})=>{
  const errors=collectPageErrors(page);
  await page.goto('/?example=snow-geoprivacy');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});

  // The original branch carries Snow's DEATHS attribute: 250 addresses holding 489 deaths.
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="original-center"]').click();
  const settings=page.locator('#inspector-content .standard-sentence');
  await expect(settings).toContainText('each counted once');
  // The arriving points' numeric columns are offered; DEATHS among them.
  const dialog=await configureStep(page,{},{apply:false});
  await expect(dialog).toContainText('Each point counts as many times as its value in that column.');
  await expect(dialog.locator('#mean-center-weight option[value="DEATHS"]')).toHaveCount(1);
  await dialog.locator('#mean-center-weight').selectOption('DEATHS');
  await dialog.locator('#config-apply').click();await expect(dialog).toHaveCount(0);
  await expect(settings).toContainText('in proportion to its DEATHS');

  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});

  // The receipt asserts the field and the weight total BESIDE the point count, never instead of it.
  await page.locator('[data-view="rules"]').click();
  await expect(page.locator('#n3-preview')).toContainText('fw:weightField "DEATHS"');
  await expect(page.locator('#n3-preview')).toContainText('fw:weightTotal 489');
  await expect(page.locator('#n3-preview')).toContainText('fw:inputCount 250');

  // It survives a reload, because it is a saved parameter and not a session choice.
  await page.reload();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="original-center"]').click();
  await expect(settings).toContainText('in proportion to its DEATHS');

  // Choosing none returns an unweighted run rather than leaving a stale weight behind.
  await configureStep(page,{'mean-center-weight':''});
  await expect(settings).toContainText('each counted once');
  expect(errors).toEqual([]);
});

// The geomask rebuilds every feature with only a name, so the masked layer cannot be weighted at
// all. That is defensible for a privacy method and it is not obvious, so it is asserted here:
// the refusal names how many records lack the attribute rather than silently reading them as zero.
test('weighting the masked branch is refused with a count, because geomasking drops attributes',async({page})=>{
  collectPageErrors(page);
  await page.goto('/?example=snow-geoprivacy');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="moved-center"]').click();
  // The masked points carry no DEATHS, so it is not offered; a column typed by hand is still taken.
  await page.evaluate(()=>{const w=JSON.parse(localStorage.getItem('fieldwork-workflow-v1'));
    w.nodes.find(n=>n.id==='moved-center').params.weightField='DEATHS';localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(w));});
  await page.reload();await expect(page.locator('#node-library')).toBeVisible({timeout:45000});
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('failed',{timeout:45000});
  await expect(page.locator('body')).toContainText('250 of 250 records hold no usable number');
});
