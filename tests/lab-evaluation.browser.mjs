import {test,expect} from './fixtures.mjs';
import {REPOSITORY_URL} from './site.mjs';

/** LAB EVALUATION, IN THE APP (experiment 184): hidden until switched on in the footer, beside Ontology and Validation
 *  Lab (2026-11-15; it was in Help); opened from there or a note being written; saved to the laptop as Markdown and JSON,
 *  and each finding opened as a GitHub issue in the repository's form. */
test.use({serviceWorkers:'block'});

test('switched on in the footer, it evaluates the open screen, saves two files and opens a finding as an issue',async({page})=>{
  await page.goto('/');await page.evaluate(()=>localStorage.clear());
  await page.goto('/?example=blank');
  await expect(page.locator('#lab-evaluate')).toBeHidden();
  await page.locator('.app-footer #lab-evaluation-switch').check();
  await expect(page.locator('#lab-evaluate')).toBeVisible();
  await page.locator('#lab-evaluate').click();
  const d=page.locator('#lab-evaluation-dialog');
  await expect(d).toBeVisible();
  await expect(d.locator('#lab-screen')).toHaveValue(/Workflow tab/);
  await expect(d.locator('.lab-heuristic')).toHaveCount(10);
  await d.locator('[data-h="H8"] summary').click();
  await d.locator('[data-add="H8"]').click();
  await d.locator('[data-h="H8"] [data-f="happens"]').fill('The subtitle explains the method.');
  await d.locator('[data-h="H8"] [data-f="costs"]').fill('A trainee reads past the task.');
  await d.locator('[data-h="H8"] [data-f="textKind"]').selectOption('design explanation');
  // A NAME FIRST: a pass nobody can attribute cannot be merged.
  await d.locator('#lab-save').click();
  await expect(d.locator('#lab-status')).toContainText('Add your name');
  await d.locator('#lab-evaluator').fill('Lab tester');
  const downloads=[];
  page.on('download',dl=>downloads.push(dl));
  await d.locator('#lab-save').click();
  await expect(d.locator('#lab-status')).toContainText('Saved 1 finding');
  await expect.poll(()=>downloads.length).toBe(2);
  const names=downloads.map(dl=>dl.suggestedFilename()).sort();
  expect(names[0]).toMatch(/^fieldwork-evaluation-workflow-tab.*-lab-tester-.*\.json$/);
  expect(names[1]).toMatch(/\.md$/);
  const md=await (await import('node:fs/promises')).readFile(await downloads.find(dl=>dl.suggestedFilename().endsWith('.md')).path(),'utf8');
  expect(md).toContain('| 1 | H8 Aesthetic and minimalist design | The subtitle explains the method. | A trainee reads past the task. | design explanation |');
  // AS A GITHUB ISSUE, in the repository's form, its fields filled from the finding.
  const issue=d.locator('[data-h="H8"] [data-issue]');
  await issue.click({modifiers:[]}).catch(()=>{});
  const href=new URL(await issue.getAttribute('href'));
  expect(href.origin+href.pathname).toBe(`${REPOSITORY_URL}/issues/new`);
  expect(href.searchParams.get('template')).toBe('lab-evaluation.yml');
  expect(href.searchParams.get('heuristic')).toBe('H8 Aesthetic and minimalist design');
  expect(href.searchParams.get('happens')).toBe('The subtitle explains the method.');
  expect(href.searchParams.get('text-kind')).toBe('design explanation');
  expect(href.searchParams.get('evaluator')).toBe('Lab tester');
  // KEPT AS A DRAFT on this device: closed and reopened, the finding is still there.
  await d.locator('#lab-evaluation-close').click();
  await page.locator('#lab-evaluate').click();
  await expect(page.locator('#lab-evaluation-dialog [data-h="H8"] [data-f="happens"]')).toHaveValue('The subtitle explains the method.');
});
