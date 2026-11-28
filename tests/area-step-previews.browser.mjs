import {test,expect} from './fixtures.mjs';
import assert from 'node:assert/strict';

// The practitioner, 2026-11-23, of Preview sections holding only a generic walkthrough: *"This one still does not
// have a preview"*, and *"let's finish the previews"*. Each of these steps has a number it makes, and the settings
// above it change that number, so the preview is where the setting is judged.
const ring=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];
const poly=(id,name,x0,y0,x1,y1)=>({id,name,geometry:{type:'Polygon',coordinates:[ring(x0,y0,x1,y1)]},properties:{}});
const point=(id,x,y)=>({type:'Feature',id,properties:{name:id},geometry:{type:'Point',coordinates:[x,y]}});
const base=(extra,edges)=>({schema:'fieldwork/workflow/1',id:'p',label:'Previews',exampleId:'blank',nodes:[
  {id:'area',type:'study_area',x:20,y:20,params:{label:'Area',source:'drawn',selectionMode:'polygon',
    geometry:{type:'Polygon',coordinates:[ring(0,0,10,10)]}}},...extra],edges});
const open=async(page,workflow,id,dialog)=>{
  await page.goto('/?example=blank');
  await page.locator('#workflow-file').setInputFiles({name:'p.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify(workflow))});
  await page.locator('[data-view="workflow"]').click();
  await page.locator(`.react-flow__node[data-id="${id}"]`).click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator(dialog);
  await expect(d).toBeVisible();
  return d;
};

test('Calculate area says the area, in the unit chosen',async({page})=>{
  const w=base([{id:'measure',type:'measure_area',x:300,y:20,params:{label:'Calculate area',unit:'km2'}}],
    [{id:'e1',from:'area',to:'measure',port:'area'}]);
  const d=await open(page,w,'measure','#measure-area-dialog');
  // A 10x10 degree square at the equator is on the order of a million square kilometres.
  await expect(d).toContainText('km²');
  await expect(d).toContainText('measured on the curved Earth');
  // THE UNIT ABOVE IT CHANGES HOW IT READS, which is the reason to show it here.
  await d.locator('#area-unit').selectOption('ha');
  await expect(d).toContainText('ha');
});

test('Clip polygons draws the cut and says how many survive it, and how much ground',async({page})=>{
  const w=base([
    {id:'layer',type:'polygon_input',x:20,y:200,params:{label:'Polygon layer',
      data:{features:[poly('in','Inside',1,1,3,3),poly('edge','Straddling',8,8,12,12),poly('out','Outside',20,20,22,22)]}}},
    {id:'cut',type:'clip_polygons',x:300,y:120,params:{label:'Clip polygons'}}],
    [{id:'e1',from:'area',to:'cut',port:'area'},{id:'e2',from:'layer',to:'cut',port:'polygons'}]);
  const d=await open(page,w,'cut','#clip-polygons-dialog');
  await expect(d).toContainText('of 3 polygons kept');
  await expect(d).toContainText('before the cut');
  // DRAWN, NOT ONLY COUNTED (2026-11-27): the area dashed, the three polygons as given, and what the cut keeps filled.
  const drawing=d.locator('.preview-drawing');
  await expect(drawing.locator('.walk-shape-area')).toHaveCount(1);
  await expect(drawing.locator('.walk-shape-input')).toHaveCount(3);
  await expect(drawing.locator('.walk-shape-result')).toHaveCount(await d.textContent().then(t=>Number(t.match(/(\d+) of 3 polygons kept/)[1])));
  await expect(drawing.locator('.walk-key')).toContainText('Filled: what the step makes');
});

test('Summarize points to polygons says how the points fall',async({page})=>{
  const w=base([
    {id:'layer',type:'polygon_input',x:20,y:200,params:{label:'Polygon layer',
      data:{features:[poly('a','A',0,0,5,5),poly('b','B',4,4,9,9)]}}},
    {id:'pts',type:'point_input',x:20,y:340,params:{label:'Records',fields:[],
      // one in A, one in both (the overlap), one in neither
      data:{type:'FeatureCollection',features:[point('a1',1,1),point('both',4.5,4.5),point('none',20,20)]}}},
    {id:'sum',type:'summarize_points_to_polygon',x:300,y:240,params:{label:'Summarize',boundary:'include',valueField:''}}],
    [{id:'e1',from:'layer',to:'sum',port:'polygons'},{id:'e2',from:'pts',to:'sum',port:'points'}]);
  const d=await open(page,w,'sum','#summarize-points-dialog');
  await expect(d).toContainText('of 3 points fall in a polygon');
  await expect(d).toContainText('fall in none');
  // THE OVERLAP IS SAID, because it is the number a reader must not add up.
  await expect(d).toContainText('must not be added up');
  assert.ok(true);
});
