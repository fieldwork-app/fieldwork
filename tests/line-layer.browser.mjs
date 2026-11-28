import {test,expect} from './fixtures.mjs';
import {collectPageErrors} from './page-errors.mjs';

/** LINES (experiment 229; the practitioner, 2026-11-22: "Let's start the line layer"). A team's route read as a line,
 *  and the border two study areas share, drawn on Map. */
test.use({serviceWorkers:'block'});
const square=(x,y,s=1)=>[[[x,y],[x+s,y],[x+s,y+s],[x,y+s],[x,y]]];
const area=(id,label,x,y)=>({id,type:'study_area',x:20,y:y*100,params:{label,source:'drawn',selectionMode:'polygon',geometry:{type:'MultiPolygon',coordinates:[square(x,y)]}}});
const route={kind:'lines',source:'GeoJSON',features:[{type:'Feature',id:'team-1',properties:{name:'Team 1, day 1'},
  geometry:{type:'LineString',coordinates:[[30.1,1.1],[30.5,1.4],[30.9,1.2]]}}]};
// APPLY, and where a run is in flight, wait for the dialog to apply once it is done (tests/config-apply-during-run.browser.mjs).
const apply=async(page,dialog)=>{await dialog.locator('#config-apply').click();
  // DURING A RUN, APPLY WAITS AND THEN APPLIES ITSELF (0.204.7): clicking it again after the run found the dialog closed.
  await expect(dialog).toBeHidden({timeout:30000});
  await expect(dialog).toHaveCount(0);};
const seed=async(page,flow)=>{
  await page.route(/tile\.openstreetmap\.org|basemaps|tiles/,route=>route.abort('failed'));
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.evaluate(f=>{localStorage.clear();localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(f));},flow);
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:30000});
  await page.locator('[data-view="results"]').click();
};

test('a route read as a line is drawn over the study area, under the points',async({page})=>{
  const errors=collectPageErrors(page);
  await seed(page,{schema:'fieldwork/workflow/1',exampleId:'blank',name:'A team route',nodes:[area('ward','Ward',30,1),
    {id:'route',type:'line_input',x:300,y:100,params:{label:'Team routes',inputMethod:'file',data:route}},
    {id:'map',type:'map_output',x:600,y:100,params:{label:'Map',basemap:'none'}}],
    edges:[{id:'e1',from:'ward',to:'map',port:'area'},{id:'e2',from:'route',to:'map',port:'lines'}]});
  await expect(page.locator('#map [data-line-layer="route"]')).toHaveCount(1);
  // Read from a file, so it is drawn with no arrowhead: the order of positions in a published track is an
  // artefact of how the file was written, not a direction anybody chose.
  await expect(page.locator('#map [data-line-arrow]')).toHaveCount(0);
  await page.locator('#map').screenshot({path:'test-results/line-layer-1.png'});
  expect(errors).toEqual([]);
});

test('the border two study areas share is a line, drawn on a map of lines alone',async({page})=>{
  const errors=collectPageErrors(page);
  await seed(page,{schema:'fieldwork/workflow/1',exampleId:'blank',name:'A border',nodes:[area('a','West',29,1),area('b','East',30,1),
    {id:'border',type:'line_input',x:300,y:100,params:{label:'Border',inputMethod:'border'}},
    {id:'map',type:'map_output',x:600,y:100,params:{label:'Map',basemap:'none'}}],
    edges:[{id:'e1',from:'a',to:'border',port:'area'},{id:'e2',from:'b',to:'border',port:'area_2'},{id:'e3',from:'border',to:'map',port:'lines'}]});
  await expect(page.locator('#map [data-line-layer="border"]')).toHaveCount(1);
  // A computed border runs no particular way either.
  await expect(page.locator('#map [data-line-arrow]')).toHaveCount(0);
  await page.locator('#map').screenshot({path:'test-results/line-layer-2.png'});
  expect(errors).toEqual([]);
});

test('on the interactive map a line layer is a layer of its own, each line named',async({page})=>{
  const errors=collectPageErrors(page);
  await seed(page,{schema:'fieldwork/workflow/1',exampleId:'blank',name:'A team route',nodes:[area('ward','Ward',30,1),
    {id:'route',type:'line_input',x:300,y:100,params:{label:'Team routes',inputMethod:'file',data:route}},
    {id:'map',type:'map_output',x:600,y:100,params:{label:'Map',basemap:'none',presentation:'interactive'}}],
    edges:[{id:'e1',from:'ward',to:'map',port:'area'},{id:'e2',from:'route',to:'map',port:'lines'}]});
  const line=page.locator('.catchment-leaflet .leaflet-overlay-pane path[stroke="#7a3e9d"]');
  await expect(line).toHaveCount(1);
  await expect(page.locator('.leaflet-control-layers')).toContainText('Team routes');
  await line.dispatchEvent('mouseover');
  await expect(page.locator('.leaflet-tooltip')).toContainText('Team 1, day 1');
  expect(errors).toEqual([]);
});

// IN CONFIGURE…: a GPX file's tracks and routes read as lines, its waypoints counted and left out; then the border of two
// study areas, its distance stated, drawn After.
test('Configure… reads a GPX file\'s tracks and routes, and takes the border of two study areas',async({page})=>{
  const errors=collectPageErrors(page);
  await page.route(/tile\.openstreetmap\.org|basemaps|tiles/,route=>route.abort('failed'));
  const flow={schema:'fieldwork/workflow/1',exampleId:'blank',name:'Lines',nodes:[area('a','West',29,1),area('b','East',30,1),
    {id:'lines',type:'line_input',x:300,y:100,params:{label:'Team routes',inputMethod:'file'}},
    {id:'map',type:'map_output',x:600,y:100,params:{label:'Map',basemap:'none'}}],edges:[{id:'e0',from:'lines',to:'map',port:'lines'}]};
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.evaluate(f=>{localStorage.clear();localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(f));},flow);
  await page.goto('/');await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="lines"]').click();
  await expect(page.locator('#inspector-content .standard-sentence')).toContainText('once one is chosen in Configure');
  await page.locator('#configure-step').click();
  const dialog=page.locator('#line-config');
  const gpx='<?xml version="1.0"?><gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">'
    +'<wpt lat="1.1" lon="30.1"><name>Start</name></wpt>'
    +'<trk><name>Team 1, day 1</name><trkseg><trkpt lat="1.1" lon="30.1"/><trkpt lat="1.2" lon="30.2"/></trkseg><trkseg><trkpt lat="1.3" lon="30.3"/><trkpt lat="1.4" lon="30.4"/></trkseg></trk>'
    +'<rte><name>Planned</name><rtept lat="1.1" lon="30.1"/><rtept lat="1.4" lon="30.4"/></rte></gpx>';
  await dialog.locator('#line-file').setInputFiles({name:'teams.gpx',mimeType:'application/gpx+xml',buffer:Buffer.from(gpx)});
  await expect(dialog.locator('[data-line-sentence]')).toContainText('teams.gpx: 2 lines,');
  await expect(dialog.locator('[data-line-sentence]')).toContainText('from GPX. 1 point is not lines and was not imported.');
  await expect(dialog.locator('.line-after tbody tr')).toHaveCount(2);
  await expect(dialog.locator('.line-after tbody tr').first()).toContainText('Team 1, day 1');
  await apply(page,dialog);
  await expect(page.locator('#inspector-content .standard-sentence')).toContainText('teams.gpx: 2 lines');
  // THE BORDER: chosen in the dialog, the two areas connected on the canvas, drawn After.
  await page.locator('#configure-step').click();
  await dialog.locator('#line-method').selectOption('border');
  await expect(dialog).toContainText('Connect two study areas to this step on the canvas');
  await apply(page,dialog);
  // Connected from the Inspector's inputs, as a practitioner may.
  await page.locator('#connect-area').selectOption('a');
  await page.locator('#connect-area_2').selectOption('b');
  await expect(page.locator('#inspector-content .standard-sentence')).toContainText('The border of West and East: where their outlines lie within 500 m');
  await page.locator('#configure-step').click();
  await expect(dialog.locator('[data-line-sentence]')).toContainText('1 stretch of border, 111 km in all.');
  await dialog.locator('#line-tolerance').fill('2000');await dialog.locator('#line-tolerance').press('Tab');
  await apply(page,dialog);
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:30000});
  await page.locator('.react-flow__node[data-id="lines"]').click();
  await expect(page.locator('#inspector-content .standard-result')).toContainText('1 line, 111 km in all.');
  await page.screenshot({path:'test-results/line-layer-3.png'});
  expect(errors).toEqual([]);
});

/** ROUTES AND FLOWS DRAWN ON A MAP (2026-11-24). The practitioner: *"we should add a feature like pushpins to
 *  point data. Users should be able to draw flows and routes on a map as they observe events on the ground"*, and
 *  *"Pushpins are points, Routes and flows are lines."* The symmetry is the specification; direction is the one
 *  thing a hand-drawn line carries that a derived one gets for nothing. */
test('a route is drawn on the map, named, reversed, and runs',async({page})=>{
  const errors=collectPageErrors(page);
  await page.route(/tile\.openstreetmap\.org|basemaps|tiles/,r=>r.abort('failed'));
  // SEEDED WITHOUT RUNNING: a drawn layer with nothing drawn rightly refuses, and the refusal is checked below.
  await page.goto('/');
  await page.evaluate(()=>localStorage.clear());
  await page.evaluate(w=>localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(w)),
    {schema:'fieldwork/workflow/1',id:'dr',exampleId:'blank',label:'Drawn routes',nodes:[
      {id:'line',type:'line_input',x:40,y:40,params:{label:'Team routes',inputMethod:'drawn'}},
      {id:'map',type:'map_output',x:400,y:40,params:{label:'Map',basemap:'none'}}],
      edges:[{id:'e1',from:'line',to:'map',port:'lines'}]});
  await page.goto('/');
  await page.waitForSelector('html[data-ready]');
  // NOTHING DRAWN YET: the refusal names the method it is set to, and does not send the reader after a file.
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run failed',{timeout:45000});
  const said=(await page.locator('#toast').textContent().catch(()=>''))||'';
  expect(said).toContain('Draw at least one route');
  expect(said).not.toContain('GPX');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="line"]').click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator('#line-config');
  await expect(d.locator('#line-map')).toBeVisible();
  const box=await d.locator('#line-map').boundingBox();
  const click=async(dx,dy)=>{await page.mouse.click(box.x+dx,box.y+dy);await page.waitForTimeout(120);};

  // THE MAP PANS UNTIL A LINE IS STARTED (the practitioner, 2026-11-24: "If I try to pan with my mouse, it draws a
  // point instead of panning"). A click before Start a line lays down nothing, and the status says what the mouse
  // will do rather than leaving the reader to find out by leaving a position behind.
  await expect(d.locator('#line-draw-status')).toContainText('Dragging pans the map');
  await expect(d.locator('#line-start')).toHaveAttribute('aria-pressed','false');
  await click(120,120);
  await expect(d.locator('#line-draw-status')).toContainText('Dragging pans the map');
  await expect(d.locator('[data-line-rows] tr')).toHaveCount(0);
  // Finishing a line nobody started says so, instead of reporting a line of no positions.
  await d.locator('#line-finish').click();
  await expect(d.locator('#line-draw-status')).toContainText('Press Start a line first');

  await d.locator('#line-start').click();
  await expect(d.locator('#line-start')).toHaveAttribute('aria-pressed','true');
  await expect(d.locator('#line-map')).toHaveClass(/map-drawing/);

  // ONE CLICK IS A PLACE, NOT A ROUTE: the step says how many positions it has and how many it needs.
  await click(120,120);
  await expect(d.locator('#line-draw-status')).toContainText('1 position');
  await d.locator('#line-finish').click();
  await expect(d.locator('#line-draw-status')).toContainText('needs 2 positions');

  await click(200,160); await click(260,220);
  await d.locator('#line-finish').click();
  // FINISHED MEANS FINISHED: the map is back to panning, so the next click starts nothing.
  await expect(d.locator('#line-start')).toHaveAttribute('aria-pressed','false');
  await expect(d.locator('#line-map')).not.toHaveClass(/map-drawing/);
  await expect(d.locator('[data-line-rows] tr')).toHaveCount(1);
  await expect(d.locator('[data-line-sentence]')).toContainText('drawn here');
  // Not "from drawn": a drawn layer has no source to name, it IS the observation.
  await expect(d.locator('[data-line-sentence]')).not.toContainText('from drawn');

  await d.locator('#line-name').fill('Team 1, day 1');
  await d.locator('#line-name').dispatchEvent('change');
  await expect(d.locator('[data-line-rows] tr').first()).toContainText('Team 1, day 1');

  // DIRECTION: reversing swaps the ends, and the line itself is otherwise the same.
  const ends=()=>d.locator('svg path, .leaflet-interactive').count();
  const before=await ends();
  await d.locator('#line-reverse').click();
  await page.waitForTimeout(150);
  expect(await ends()).toBe(before);
  await expect(d.locator('[data-line-rows] tr')).toHaveCount(1);

  await d.locator('#config-apply').click();
  await expect(d).toHaveCount(0);
  await page.locator('#run-button').click();
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  // And the drawn line reaches the map it is wired to, AS TWO PATHS: the line, and the arrowheads that show which
  // way it runs. They carry the same `data-line-layer` on purpose, so a layer switched off in Manage layers takes
  // its arrowheads with it.
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map [data-line-layer="line"]:not([data-line-arrow])')).toHaveCount(1);
  // A LINE DRAWN BY HAND IS MARKED WITH NO SETTING TOUCHED (the practitioner, 2026-11-24: "The arrow head does not
  // show up in the map output. But it shows up on line layer preview."). The order its positions were clicked in is
  // a decision somebody made, so the figure shows it. The two tests above draw a layer read from a file and a
  // layer taken as a shared border, and neither is marked: there the order of positions is the file's doing.
  await expect(page.locator('#map [data-line-layer="line"][data-line-arrow]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

/** REOPENED ON THE LINES, NOT ON THE WHOLE WORLD (reported 2026-11-24: a layer of six drawn lines, reopened, showed
 *  the map zoomed out to the world). `fitBounds` ran synchronously at mount, when the dialog's panel still had no
 *  size, so it fitted the lines into a viewport of 0 x 0 and chose a zoom for that; `invalidateSize` corrected the
 *  size afterwards and nothing re-fitted.
 *
 *  ASSERTED BY MEASURING WHAT IS DRAWN, because Leaflet puts neither zoom nor centre in the DOM. At the world zoom
 *  six lines a few hundred kilometres long are a smudge of a handful of pixels; fitted, they span most of the panel. */
test('a drawn layer reopens fitted to its lines, not zoomed out to the world',async({page})=>{
  const errors=collectPageErrors(page);
  await page.route(/tile\.openstreetmap\.org|basemaps|tiles/,r=>r.abort('failed'));
  const line=(id,from,to)=>({type:'Feature',id,properties:{name:id},
    geometry:{type:'LineString',coordinates:[from,to]}});
  await page.goto('/');
  await page.evaluate(()=>localStorage.clear());
  await page.evaluate(w=>localStorage.setItem('fieldwork-workflow-v1',JSON.stringify(w)),
    {schema:'fieldwork/workflow/1',id:'dr',exampleId:'blank',label:'Drawn routes',nodes:[
      {id:'line',type:'line_input',x:40,y:40,params:{label:'Team routes',inputMethod:'drawn',
        data:{kind:'lines',source:'drawn',features:[
          line('Route 1',[29.6,4.2],[30.1,4.6]),
          line('Route 2',[29.9,4.0],[30.4,4.4]),
          line('Route 3',[30.2,4.3],[30.7,4.7])]}}}],
      edges:[]});
  await page.goto('/');
  await page.waitForSelector('html[data-ready]');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="line"]').click();
  await page.locator('#inspector-content #configure-step').click();
  const d=page.locator('#line-config');
  await expect(d.locator('#line-map')).toBeVisible();
  await expect(d.locator('#line-draw-status')).toContainText('3 lines drawn');

  // THE LINES AS DRAWN, measured against the panel they are drawn in.
  const spread=await d.locator('#line-map').evaluate(host=>{
    const paths=[...host.querySelectorAll('path')].filter(p=>p.getTotalLength&&p.getTotalLength()>0);
    if(!paths.length)return null;
    const boxes=paths.map(p=>p.getBoundingClientRect());
    const left=Math.min(...boxes.map(b=>b.left)),right=Math.max(...boxes.map(b=>b.right));
    return {drawn:right-left,panel:host.getBoundingClientRect().width};
  });
  expect(spread,'the drawn lines should be on the page at all').not.toBeNull();
  // Fitted with a 20% pad, three lines spanning about a degree fill well over a third of the panel. At the world
  // zoom the same three measured 2 px of an 1100 px panel.
  expect(spread.drawn).toBeGreaterThan(spread.panel*0.3);
  expect(errors).toEqual([]);
});
