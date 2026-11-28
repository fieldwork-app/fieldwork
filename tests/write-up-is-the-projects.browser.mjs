import {test,expect} from './fixtures.mjs';
import {readFileSync,existsSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';

/** THE WRITE-UP IS THE PROJECT'S, NOT THE OPEN WORKFLOW'S.
 *
 *  The practitioner, 2026-10-30, after the Notes tab was found holding one workflow's artifacts:
 *  *"This is not the model we are building. It's supposed to hold notes from all workflows in
 *  that project."*
 *
 *  THE DEFECT THIS HOLDS OUT. `result` in `app.ts` is one variable holding the open workflow's
 *  last run, nulled on every workflow switch. The Notes tab read it directly, so a six-workflow
 *  investigation showed one workflow's notes at a time and a freshly opened project showed none.
 *  Every test written for the machined notes ran ONE workflow and then looked, so none of them
 *  could see it -- which is why this drives the real sequence a practitioner does instead.
 *
 *  Nothing here injects state through `localStorage`: the write-up is built by running workflows
 *  in the interface, because the two silent setup traps recorded in
 *  `tests/version-supersession.browser.mjs` are exactly how a test like this comes to assert
 *  against the published template. */
test.use({serviceWorkers:'block'});

const BUNDLE=new URL('../../example-1855-cholera-south-london/fieldwork-project.json.gz',import.meta.url);
const skip=existsSync(BUNDLE)?false
  :'example-1855-cholera-south-london is not checked out beside this repository.';
const bundle=skip?Buffer.alloc(0):readFileSync(BUNDLE);

/** THE COUNT AND THE NAMES COME FROM THE BUNDLE, NEVER FROM A LITERAL.
 *
 *  This file asserted "6 of this project's 6 workflows" and ran five workflows by name. On
 *  2026-10-31 the example grew an eighth and 38 assertions failed across seven test files at
 *  once, almost none of them about a count -- the others were waiting on an import toast and
 *  pinned the number that happened to be in it.
 *
 *  The example is pinned by digest and RE-PINNED as it grows, three times in one day, so a
 *  literal here is a second place the number lives and the two drift silently until a gate runs.
 *  These tests already read the bundle to serve it, so the project can be asked instead. What is
 *  asserted is the RELATION the control reports -- all pending before anything runs, one fewer
 *  after one runs, all run at the end -- which is what the control is for and is true at any
 *  size. */
const documents=skip?[]:JSON.parse(gunzipSync(bundle)).workflows.map(w=>w.document);
const TOTAL=documents.length;
// THE ONES THAT WAIT FOR THE LEARNER, also from the bundle: a map image the example offers and nobody has chosen yet
// (Snow's Map 2 placed by hand, 2026-11-13). Said apart, as waiting; never counted as run, and never as failing to.
const waits=d=>d.nodes.some(n=>n.type==='map_image_input'&&n.params.offered&&!n.params.image?.width);
const workflows=documents.filter(d=>!waits(d)).map(d=>d.name),WAITING=documents.filter(waits).map(d=>d.name);
const RUNNABLE=workflows.length;

const open=async page=>{
  // The bundle only. Snow's Map 2 is fetched from the checkout when its workflows run (fixtures.mjs).
  await page.route(/raw\.githubusercontent\.com\/.*\/fieldwork-project\.json\.gz$/,r=>r.fulfill({status:200,body:bundle}));
  await page.goto('/');await page.evaluate(()=>localStorage.clear());
  await page.goto('/?example=blank');
  await page.locator('[data-view="project"]').click();
  await page.locator('[data-open-example="urn:fieldwork:example:south-london-1854"]').click();
  await expect(page.locator('[data-example-status="urn:fieldwork:example:south-london-1854"]')).toContainText('digest matched',{timeout:30000});
};
const run=async (page,named)=>{
  await page.locator('[data-view="workflow"]').click();
  const option=page.locator('#workflow-select option',{hasText:named});
  await page.locator('#workflow-select').selectOption(await option.getAttribute('value'));
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
};
const notes=async page=>{
  // After a reload the tab is clicked only once startup is over: a click before its handler is bound is lost (WebKit on
  // CI, 0.128.0).
  await expect(page.locator('html[data-ready="true"]')).toHaveCount(1,{timeout:30000});
  await page.locator('[data-view="notes"]').click();
  await page.locator('.notes-part').first().waitFor();
};
const machined=page=>page.locator('.notes-note.k-machined');

test('a second workflow adds to the write-up instead of replacing it',async({page})=>{test.skip(!!skip,skip);
  await open(page);
  await run(page,'How many died per 1,000 people in each sub-district?');
  await notes(page);
  const first=await machined(page).count();
  expect(first).toBeGreaterThan(0);
  // THE ASSERTION THE OLD BEHAVIOUR FAILS. Running a second workflow replaced the first's notes,
  // so this count used to go DOWN -- the ground contributes one note where mortality contributes
  // three.
  await run(page,'Where are the sub-districts and the river?');
  await notes(page);
  expect(await machined(page).count()).toBeGreaterThan(first);
  // And the first workflow's own notes are still there by name, not merely the count.
  await expect(machined(page).filter({hasText:'Mortality by sub-district'})).toHaveCount(1);
  await expect(machined(page).filter({hasText:'bottom to top'})).toHaveCount(1);
});

test('a note from another workflow says which workflow it came from',async({page})=>{test.skip(!!skip,skip);
  await open(page);
  await run(page,'How many died per 1,000 people in each sub-district?');
  await run(page,'Where are the sub-districts and the river?');
  await notes(page);
  // The open workflow's own notes carry no source line -- the step chip already says it, and
  // repeating the workflow name on every card would be noise.
  const here=machined(page).filter({hasText:'bottom to top'});
  await expect(here.locator('.notes-source')).toHaveCount(0);
  // A note from elsewhere says where it came from and when that run happened.
  const elsewhere=machined(page).filter({hasText:'Mortality by sub-district'});
  await expect(elsewhere.locator('.notes-source')).toContainText('How many died per 1,000 people');
  await expect(elsewhere.locator('.notes-source')).toContainText('ran 20');
});

test('the write-up survives a reload, because a publication is not a run',async({page})=>{test.skip(!!skip,skip);
  await open(page);
  await run(page,'How many died per 1,000 people in each sub-district?');
  await run(page,'Were deaths more common with one water supply than the other?');
  await notes(page);
  const before=await machined(page).count();
  expect(before).toBeGreaterThan(4);
  await page.reload();
  await notes(page);
  // RE-RUNNING SIX WORKFLOWS TO READ A WRITE-UP would make opening a project expensive and make
  // the write-up depend on a reasoner. A practitioner organising a publication is reading.
  expect(await machined(page).count()).toBeGreaterThanOrEqual(before);
  await expect(machined(page).filter({hasText:'Mortality by sub-district'})).toHaveCount(1);
});

test('notes from several workflows do not collide on a node id they share',
  async({page})=>{test.skip(!!skip,skip);
    await open(page);
    // `table-viii` is a node in three of South London's six workflows, so a write-up keyed by
    // node id silently dropped two of every three notes, and two cards sharing a `data-note`
    // attribute made opening one act on the other.
    await run(page,'How many died per 1,000 people in each sub-district?');
    await run(page,'How did cholera in 1854 compare with 1849?');
    await run(page,'Were deaths more common with one water supply than the other?');
    await notes(page);
    const keys=await machined(page).evaluateAll(ns=>ns.map(n=>n.getAttribute('data-note')));
    expect(keys.length).toBeGreaterThan(5);
    expect(new Set(keys).size).toBe(keys.length);
    // And each card's step chip names a step of the workflow that produced it, not whatever
    // shares that id on the open canvas.
    await expect(machined(page).filter({hasText:'1849 and 1854 by sub-district'}))
      .toHaveCount(1);
  });

test('a freshly opened project says why its write-up has no figures yet',async({page})=>{test.skip(!!skip,skip);
  // THE CASE THREE ROUNDS OF TESTING MISSED. Every test ran a workflow and then looked, so none
  // of them ever saw what a practitioner meets first: thirteen quoted and authored notes, no
  // tables, no maps, no charts, and no account of why. The notes are correct -- nothing has run
  // -- and the silence is the defect.
  await open(page);
  await notes(page);
  await expect(machined(page)).toHaveCount(0);
  const bar=page.locator('.notes-run');
  await expect(bar).toContainText(`${RUNNABLE} of this project's ${TOTAL} workflows`);
  for(const name of WAITING)await expect(bar.locator('[data-notes-waiting]')).toContainText(name);
  await expect(bar).toContainText('have not run');
  await expect(bar).toContainText('not in this write-up yet');
  // NAMED AND CAPPED, which is `relate_table`'s rule for its gap keys: a count tells nobody what
  // to do, and six long workflow names is a paragraph nobody reads.
  await expect(bar).toContainText('How many died per 1,000 people in each sub-district?');
  await expect(bar).toContainText(/and \d+ more/);
  // AND IT IS THE FIRST THING IN THE TAB, which is the second report of 2026-10-31: the markup
  // was there and the control was not, because it rendered as a sentence under the counts and
  // the description. A button filed below two paragraphs of prose is a button nobody finds.
  const button=bar.locator('[data-run-pending]');
  await expect(button).toHaveText('Run workflows');
  await expect(button).toHaveClass(/\bprimary\b/);
  expect(await page.locator('#notes-view').evaluate(v=>
    v.firstElementChild.className)).toContain('notes-run');
});

test('the control reports what has run, and stays once everything has',async({page})=>{test.skip(!!skip,skip);
  await open(page);
  await run(page,'How many died per 1,000 people in each sub-district?');
  await notes(page);
  await expect(page.locator('.notes-run')).toContainText(`${RUNNABLE-1} of this project`);
  // It reports and does not grade: no score, no completeness bar, no warning tone. A
  // practitioner who has run one of eight is not doing anything wrong.
  await expect(page.locator('.notes-run')).not.toContainText(/incomplete|missing|warning/i);
  // EVERY REMAINING WORKFLOW, from the bundle rather than from a list written out here. The list
  // named five and the project grew an eighth, so "all of them have run" was asserted over a
  // state where two never had.
  for(const name of workflows.slice(1))await run(page,name);
  await notes(page);
  // THE CONTROL DOES NOT GO WHEN THE WORK IS DONE. It used to, and a practitioner whose six
  // workflows had all run correctly was shown nothing -- with no way to tell a tab that had
  // decided against a button from a tab that never had one. Reported 2026-10-30.
  await expect(page.locator('.notes-run')).toContainText(`All ${RUNNABLE} of this project's workflows`);
  for(const name of WAITING)await expect(page.locator('.notes-run [data-notes-waiting]')).toContainText(name);
  await expect(page.locator('.notes-run [data-run-pending]')).toHaveText('Run workflows again');
  // And the whole investigation is now in one write-up.
  expect(await machined(page).count()).toBeGreaterThan(8);
});

test('one button runs the rest and assembles the whole write-up',async({page})=>{test.skip(!!skip,skip);
  // The practitioner's choice of 2026-10-30, against running them on open: South London's six
  // run in 1.9 seconds, but a project with an isochrone or a raster download does not, and each
  // run switches the open canvas -- the run-in-flight hazard experiment 142 spent a day finding.
  await open(page);
  await notes(page);
  await expect(machined(page)).toHaveCount(0);
  await page.locator('[data-run-pending]').click();
  await expect(page.locator('.notes-run')).toContainText(`All ${RUNNABLE}`,{timeout:120000});
  // Every artifact kind is now in one write-up, from six different workflows.
  expect(await machined(page).count()).toBeGreaterThan(8);
  await expect(machined(page).filter({hasText:'bottom to top'}).first()).toBeVisible();
  // MATCHED ON THE SENTENCE THE NOTE MACHINED, not on any text in the tab. This read
  // `hasText:'Mortality by sub-district'` until 2026-10-31, when it began finding two notes: the
  // table's description, and the choropleth note whose MAP now draws that name as its title. A
  // figure printing a layer's name is not a second note about it, and the assertion is that the
  // artifact is described once across six workflows rather than once per workflow.
  await expect(machined(page).filter({has:page.locator('strong',
    {hasText:'Mortality by sub-district.'})})).toHaveCount(1);
  await expect(machined(page).filter({hasText:'The four cells'})).toHaveCount(1);
  // AND THE FIGURES ARE DRAWN, which is what the practitioner reported missing four times on
  // 2026-10-30: tables, charts and maps in the write-up rather than prose about them.
  const view=page.locator('#notes-view');
  expect(await view.locator('.notes-figure table').count()).toBeGreaterThan(6);
  expect(await view.locator('.notes-figure svg').count()).toBeGreaterThan(1);
});

test('running the rest returns the practitioner to the workflow they were reading',
  async({page})=>{test.skip(!!skip,skip);
    await open(page);
    await run(page,'Were deaths more common with one water supply than the other?');
    const before=await page.locator('#workflow-select').inputValue();
    await notes(page);
    await page.locator('[data-run-pending]').click();
    await expect(page.locator('.notes-run')).toContainText(`All ${RUNNABLE}`,{timeout:120000});
    // The canvas moves once per workflow and is put back. Leaving a practitioner on whichever
    // workflow happened to be last would be the surface rearranging their work to do its own.
    await page.locator('[data-view="workflow"]').click();
    expect(await page.locator('#workflow-select').inputValue()).toBe(before);
  });
