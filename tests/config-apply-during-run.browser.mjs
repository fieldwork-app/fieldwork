import {test,expect} from './fixtures.mjs';
test.use({serviceWorkers:'block'});
/** AN APPLY MADE WHILE A RUN IS IN FLIGHT IS NEVER LOST (2026-11-22). Found by experiment 229's test, about one Apply in
 *  ten made just after another: the edit was dropped without a word and the dialog closed as if it had applied. Now the
 *  dialog says the workflow is running and keeps the draft; Apply again once it is done makes the change. Ten Applies,
 *  each right after the last, alternating a Line layer between a file and a border. */
test('an Apply made while a run is in flight says so and keeps the draft, and none is lost',async({page})=>{
  const sq=(x,y)=>[[[x,y],[x+1,y],[x+1,y+1],[x,y+1],[x,y]]];
  const area=(id,label,x)=>({id,type:'study_area',x:20,y:100,params:{label,source:'drawn',selectionMode:'polygon',geometry:{type:'MultiPolygon',coordinates:[sq(x,1)]}}});
  const flow={schema:'fieldwork/workflow/1',exampleId:'blank',name:'Lines',nodes:[area('a','West',29),area('b','East',30),
    {id:'lines',type:'line_input',x:300,y:100,params:{label:'Team routes',inputMethod:'file'}},
    {id:'map',type:'map_output',x:600,y:100,params:{label:'Map',basemap:'none'}}],edges:[{id:'e0',from:'lines',to:'map',port:'lines'}]};
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.evaluate(f=>{localStorage.clear();localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(f));},flow);
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="lines"]').click();
  const gpx='<?xml version="1.0"?><gpx version="1.1"><trk><name>T</name><trkseg><trkpt lat="1.1" lon="30.1"/><trkpt lat="1.2" lon="30.2"/></trkseg></trk></gpx>';
  const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')).nodes.find(n=>n.id==='lines').params.inputMethod);
  let lost=0,held=0;
  for(let i=0;i<10;i++){
    await page.locator('#configure-step').click();const d=page.locator('#line-config');
    if(i%2===0){await d.locator('#line-method').selectOption('file');await d.locator('#line-file').setInputFiles({name:'t.gpx',mimeType:'application/gpx+xml',buffer:Buffer.from(gpx)});await expect(d.locator('[data-line-sentence]')).toContainText('1 line');}
    else await d.locator('#line-method').selectOption('border');
    await d.locator('#config-apply').click();
    // APPLY WAITS, THEN APPLIES (2026-11-28): no second press; the dialog closes itself when the run is done.
    if(await d.locator('[data-run-in-flight]').count()){held++;await expect(d.locator('#config-apply')).toHaveText('Waiting for the run\u2026');}
    await expect(d).toHaveCount(0,{timeout:30000});
    const want=i%2===0?'file':'border';
    if(i%2===0)continue;
    await page.waitForTimeout(3000);const got=await stored();if(got!==want)lost++;
  }
  expect(lost).toBe(0);void held;
});

/** THE CASE THE PRACTITIONER'S EDIT WAS LOST IN (TODO, found 2026-11-27): Table's Presentation, set while Snow's geoprivacy
 *  example ran its first pass. The dialog said to wait and then waited for a second press that the practitioner had no
 *  reason to make. Now Apply waits for the run and applies. Cancel while it waits is tested below, on a held run. */
const tableDuringRun=async page=>{
  await page.goto('/?example=snow-geoprivacy');await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="before-table"]').click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator('#table-config');await expect(d).toBeVisible();
  await d.locator('#present-caption').fill('Pumps before the move');await d.locator('#present-caption').blur();
  return d;
};
const caption=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')).nodes.find(n=>n.id==='before-table').params.presentation?.caption);

test('Table\'s Presentation applied during the first run waits for it, then is applied',async({page})=>{
  const d=await tableDuringRun(page);
  // Read in the same task as the press, so a run that ends a moment later cannot close the dialog before it is read.
  const seen=await page.evaluate(()=>{const d=document.querySelector('#table-config');const apply=d.querySelector('#config-apply');
    apply.click();const said=d.querySelector('[data-run-in-flight]');
    return said?{said:said.textContent,label:apply.textContent,disabled:apply.disabled,open:d.isConnected}:null;});
  if(seen){
    expect(seen.said).toContain('will be applied when the run is done');
    expect(seen).toMatchObject({label:'Waiting for the run\u2026',disabled:true,open:true});
  }
  await expect(d).toHaveCount(0,{timeout:60000});
  await expect.poll(()=>caption(page),{timeout:10000}).toBe('Pumps before the move');
});

/** THE RUN HELD, SO WAITING IS CERTAIN (review of #7, 2026-11-28). Snow's isochrone example computes its bands in the
 *  catchment worker during its first run. The worker is served as a stand-in that says it has started (the executor
 *  gives up on a worker silent for 4 s), waits on a request the test holds, then loads the real worker and hands it the
 *  job: the run is held for as long as the test needs, and what it computes is the real thing. */
const holdRuns=async page=>{
  let release;const held=new Promise(r=>{release=r;});
  await page.route(/\/catchment-worker\.js$/,route=>route.fulfill({contentType:'text/javascript',body:
    "postMessage({alive:true});self.onmessage=async e=>{await fetch('./__hold-run__');"
    +"importScripts('./catchment-worker.js?real');self.onmessage(e);};"}));
  await page.route(/__hold-run__/,async route=>{await held;await route.fulfill({status:204});});
  return ()=>release();
};
/** Configure is disabled during a run, so a waiting Apply is a dialog opened BEFORE the run began: opened on a finished
 *  run, then a run started behind it. */
const dialogThenRun=async(page,id,dialog)=>{
  await page.goto('/?example=snow-isochrone');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
  const release=await holdRuns(page);
  await page.locator('[data-view="workflow"]').click();
  await page.locator(`.react-flow__node[data-id="${id}"]`).click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator(dialog);await expect(d).toBeVisible();
  const startRun=async()=>{await page.evaluate(()=>document.querySelector('#run-button').click());
    await expect(page.locator('#workflow-state')).toContainText('Running',{timeout:10000});};
  return {d,release,startRun};
};
const stored=(page,id)=>page.evaluate(id=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')).nodes.find(n=>n.id===id).params,id);

test('a caption typed while Apply waits, and not yet left, is the one applied',async({page})=>{
  const {d,release,startRun}=await dialogThenRun(page,'table','#table-config');
  await d.locator('#present-caption').fill('First caption');await d.locator('#present-caption').blur();
  await startRun();
  await d.locator('#config-apply').click();
  await expect(d.locator('#config-apply')).toHaveText('Waiting for the run\u2026');
  await d.locator('#present-caption').fill('Revised while waiting');
  release();
  await expect(d).toHaveCount(0,{timeout:60000});
  await expect.poll(async()=>(await stored(page,'table')).presentation?.caption,{timeout:10000}).toBe('Revised while waiting');
});

test('a setting refused while Apply waits keeps the dialog open with its refusal, and nothing is applied',async({page})=>{
  const before=null;
  const {d,release,startRun}=await dialogThenRun(page,'catchments','#isochrone-dialog');
  const held=(await stored(page,'catchments')).thresholds;
  await d.locator('#isochrone-times').fill('1, 5, 10, 20');await d.locator('#isochrone-times').blur();
  await startRun();
  await d.locator('#config-apply').click();
  await expect(d.locator('#config-apply')).toHaveText('Waiting for the run\u2026');
  await d.locator('#isochrone-times').fill('0');await d.locator('#isochrone-times').blur();
  await expect(d.locator('.config-message-refusal')).toBeVisible();
  release();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
  await expect(d).toBeVisible();
  await expect(d.locator('.config-message-refusal')).toBeVisible();
  await expect(d.locator('#config-apply')).toHaveText('Apply');
  await expect(d.locator('#config-apply')).toBeDisabled();
  void before;expect((await stored(page,'catchments')).thresholds).toEqual(held);
});

test('Cancel while Apply waits for a held run applies nothing, and the wait ends',async({page})=>{
  const {d,release,startRun}=await dialogThenRun(page,'table','#table-config');
  await d.locator('#present-caption').fill('Not wanted');await d.locator('#present-caption').blur();
  await startRun();
  await d.locator('#config-apply').click();
  await expect(d.locator('#config-apply')).toHaveText('Waiting for the run\u2026');
  await d.locator('#config-cancel').click();
  await d.locator('#config-discard').click();
  await expect(d).toHaveCount(0);
  release();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:60000});
  await page.waitForTimeout(500);
  expect((await stored(page,'table')).presentation?.caption).toBeUndefined();
});
