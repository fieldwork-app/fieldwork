import {test,expect} from './fixtures.mjs';
import {configureNetwork} from './network-config.mjs';
import {configureStep} from './configure-step.mjs';
import {inMapSettings} from './map-settings.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {collectPageErrors} from './page-errors.mjs';
import {payload} from './payload-store.mjs';
import {openWorkflow} from './open-workflow.mjs';
const saved=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('fieldwork-workflow-v1')));

test('Map presentation travels with interactive view, SVG and N3 evidence',async({page})=>{
  await page.goto('/?example=snow-isochrone');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="interactive"]').click();
  await inMapSettings(page,async d=>{
    await d.locator('#map-title').fill('Cholera travel-time coverage');await d.locator('#map-title').blur();
    await d.locator('#map-subtitle').fill('Illustrative walking network');await d.locator('#map-subtitle').blur();
    await d.locator('#map-source-note').fill('John Snow teaching data; modeled modern OSM streets');await d.locator('#map-source-note').blur();
    // OpenStreetMap unless chosen otherwise (2026-11-10).
    await expect(d.locator('#map-basemap')).toHaveValue('osm');
  });
  await page.locator('#run-button').click();await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="results"]').click();
  await page.locator('#result-tab-interactive').click();await expect(page.locator('#map-communication-title')).toHaveText('Cholera travel-time coverage');
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map-communication-subtitle')).toHaveText('Illustrative walking network');await expect(page.locator('#map-communication-header-key')).toContainText('Within 15 min');
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map-communication-header-source')).toContainText('modern OSM streets');
  await page.screenshot({path:'test-results/standalone-interactive-map.png'});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map-communication-title')).toBeVisible();await page.setViewportSize({width:1280,height:800});
  const pending=page.waitForEvent('download');await page.locator('#map-download-svg').click();const file=await pending,svg=await readFile(await file.path(),'utf8');
  assert.match(svg,/<title>Cholera travel-time coverage<\/title>/);assert.match(svg,/Within 1 min/);assert.match(svg,/Within 15 min/);assert.match(svg,/modern OSM streets/);assert.doesNotMatch(svg,/tile\.openstreetmap\.org|tile\.opentopomap\.org/);
  await page.locator('[data-view="rules"]').click();await expect(page.locator('#n3-preview')).toContainText('fw:MapSpecification');await expect(page.locator('#n3-preview')).toContainText('fw:mapBasemap "osm"');
});

test('canvas selection reveals and highlights its library primitive without adding a node',async({page})=>{
  await page.goto('/?example=snow-voronoi');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  const before=await saved(page);await page.locator('#node-search').fill('raster');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="catchments"]').click();
  await page.locator('[data-view="workflow"]').click();
  await expect(page.locator('#node-search')).toHaveValue('');await expect(page.locator('[data-add="voronoi"]')).toHaveAttribute('aria-current','true');
  await expect(page.locator('.primitive-selected')).toHaveCount(1);
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="pumps"]').click();await expect(page.locator('[data-add="point_input"]')).toHaveClass(/primitive-selected/);await expect(page.locator('[data-add="voronoi"]')).toHaveAttribute('aria-current','false');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="locations"]').click();await expect(page.locator('[data-add="point_input"]')).toHaveClass(/primitive-selected/);
  assert.equal((await saved(page)).nodes.length,before.nodes.length);
  await page.locator('.react-flow__pane').click({position:{x:10,y:10}});await expect(page.locator('.primitive-selected')).toHaveCount(0);
});
test('John Snow examples use shared primitives, persist parameters and replay offline',async({page,context,browserName})=>{
  const errors=collectPageErrors(page);
  await page.goto('/?example=snow-voronoi');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map [data-catchment]')).toHaveCount(8);await expect(page.locator('#result-metrics')).toContainText('250 matched');
  await page.locator('[data-view="results"]').click();
  await page.locator('#result-tab-table').click();await expect(page.locator('#data-table-view')).toContainText('340');await expect(page.locator('#data-table-view thead')).toContainText('locations');await expect(page.locator('#data-table-view thead')).not.toContainText('Longitude');await page.locator('#result-tab-chart').click();await expect(page.locator('#bars-panel')).toContainText('Sum DEATHS');
  await page.locator('[data-view="workflow"]').click();
  await page.locator('[data-view="results"]').click();
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="summary"]').click();
  // ON THE STANDARD (0.163.0): the number to add up is chosen in Configure…, from the arriving points' numeric columns.
  await page.locator('#configure-step').click();{const v=page.locator('#summarize-points-dialog #summarize-value');
    if(await v.evaluate(el=>el.tagName==='SELECT'))await v.selectOption('');else await v.fill('');await v.dispatchEvent('change');}
  await page.locator('#summarize-points-dialog #config-apply').click();await page.locator('#run-button').click();await expect(page.locator('#workflow-state')).toContainText('Run complete');await expect(page.locator('#bars-panel')).toContainText('Location memberships');
  const before=await saved(page);await openWorkflow(page,'snow-isochrone');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  // Opening another workflow leaves the view where it was, and the map is drawn when its tab is.
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#map [data-catchment]')).toHaveCount(4);await expect(page.locator('#result-metrics')).toContainText('250 matched');await expect(page.locator('#map [data-plot-site]')).toHaveCount(8);await expect(page.locator('#map [data-plot-observation]')).toHaveCount(250);
  const downloadPromise=page.waitForEvent('download');await page.locator('#map-download-svg').click();assert.equal((await downloadPromise).suggestedFilename(),'map-map.svg');await page.screenshot({path:'test-results/nb04-fieldwork-plot.png'});
  // Which provider URL a request went to can only be observed where route interception sees it.
  // Measured 2026-10-09: in WebKit a page controlled by a service worker has its image loads
  // routed through the worker thread, which Playwright cannot intercept, so these counters read 0
  // no matter what the map does and asserting on them would pass vacuously. The app's behaviour —
  // reporting an unavailable basemap, keeping local layers — is asserted in every engine, using
  // setOffline, which does reach tile loads in both. See docs/experiments/70-webkit-parity.md.
  // AND THE OFFLINE STATUS, from 2026-11-11: with OpenStreetMap drawn from the start, WebKit serves its tiles from its own
  // cache after going offline, so no tile fails and the status reads "online" (0.88.1 CI). Asserted in Chromium.
  const counted=browserName==='chromium';
  let tiles=0,topo=0;await page.route('https://tile.openstreetmap.org/**',async route=>{tiles++;await route.abort();});await page.route('https://*.tile.opentopomap.org/**',async route=>{topo++;await route.abort();});await page.locator('#result-tab-interactive').click();await expect(page.locator('.catchment-leaflet')).toBeVisible();await expect(page.locator('.catchment-site-marker')).toHaveCount(8);if(counted){assert.ok(tiles>0,'OpenStreetMap from the start, the default from 2026-11-10');assert.equal(topo,0);}await page.locator('.catchment-site-marker').first().click();await expect(page.locator('.leaflet-popup-content')).toContainText('Location');await page.locator('.leaflet-popup-close-button').click();await context.setOffline(true);await page.locator('select[data-basemap]').selectOption('osm');if(counted)await expect(page.locator('[data-tile-status]')).toContainText('unavailable');if(counted)assert.ok(tiles>0);await page.locator('select[data-basemap]').selectOption('topo');if(counted)await expect.poll(()=>topo).toBeGreaterThan(0);await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenTopoMap');await context.setOffline(false);await page.locator('select[data-basemap]').selectOption('none');await page.locator('select[data-basemap]').press('Tab');await expect(page.locator('[data-tile-status]')).toContainText('offline');await page.locator('[data-fullscreen]').click();await expect.poll(()=>page.evaluate(()=>document.fullscreenElement?.id)).toBe('map-panel');await page.evaluate(()=>document.exitFullscreen());await page.locator('.catchment-site-marker').first().click();await expect(page.locator('.leaflet-popup-content')).toContainText('Location');await page.locator('.leaflet-popup-close-button').click();await page.locator('.leaflet-control-layers-selector').first().uncheck();await page.locator('[data-fit]').click();await page.screenshot({path:'test-results/nb04-fieldwork-interactive.png'});await page.locator('#result-tab-map').click();await expect(page.locator('.catchment-leaflet')).toHaveCount(0);
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="catchments"]').click();await configureStep(page,{'isochrone-times':'1'});await page.locator('#run-button').click();await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});await expect(page.locator('#map-note')).toContainText('1 min');
  await page.screenshot({path:'test-results/john-snow-isochrone.png'});
  await page.locator('[data-view="results"]').click();
  await expect(page.locator('#offline-status')).toHaveAttribute('data-state','ready',{timeout:30000});await page.context().setOffline(true);await page.reload();await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});await page.locator('[data-view="results"]').click();await expect(page.locator('#map-note')).toContainText('1 min');await page.locator('#result-tab-interactive').click();await expect(page.locator('.catchment-leaflet')).toBeVisible();await expect(page.locator('.catchment-site-marker')).toHaveCount(8);await page.locator('.leaflet-control-zoom-in').click();
  await openWorkflow(page,'snow-voronoi');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});assert.deepEqual((await saved(page)).nodes,before.nodes);await page.screenshot({path:'test-results/john-snow-voronoi.png'});assert.deepEqual(errors,[]);
});
test('Street network imports GraphML and rejects invalid uploads without replacing saved data',async({page})=>{
  await page.goto('/?example=blank');await page.locator('[data-add="network_input"]').click();
  const xml='<graphml><key id="crs" attr.name="crs"/><key id="x" attr.name="x"/><key id="y" attr.name="y"/><key id="l" attr.name="length"/><graph edgedefault="directed"><data key="crs">EPSG:4326</data><node id="a"><data key="x">-.136</data><data key="y">51.513</data></node><node id="b"><data key="x">-.135</data><data key="y">51.513</data></node><edge source="a" target="b"><data key="l">70</data></edge></graph></graphml>';
  await page.locator('#network-upload').setInputFiles({name:'tiny.graphml',mimeType:'application/xml',buffer:Buffer.from(xml)});await expect(page.locator('#inspector-content')).toContainText('2 junctions');const w=await saved(page),node=w.nodes.find(n=>n.type==='network_input');
  // An uploaded graph is kept in the large store like a downloaded one, so the saved workflow
  // holds its digest and not its edges.
  assert.equal(node.params.data,undefined);const graph=await payload(page,node.params.dataRef);assert.equal(graph.edges.length,1);assert.equal(graph.provenance.sha256.length,64);
  await page.locator('#network-upload').setInputFiles({name:'invalid.graphml',mimeType:'application/xml',buffer:Buffer.from(xml.replace('EPSG:4326','EPSG:3857'))});await expect(page.locator('#toast')).toContainText('WGS84');assert.deepEqual((await saved(page)).nodes,w.nodes);
});
// This test replaces the Overpass response with a fixture, so it needs request interception.
// Measured 2026-10-09: in WebKit a page controlled by a service worker has its fetches routed
// through the worker thread, where Playwright cannot see them — the route is never hit and the
// real Overpass is reached instead. Blocking the service worker restores interception in both
// engines. Nothing here exercises offline behaviour, so there is nothing to lose by opting out,
// and the alternative was skipping the test in WebKit and claiming coverage that did not exist.
// See docs/experiments/70-webkit-parity.md.
test.describe('bounded network download',()=>{
  test.use({serviceWorkers:'block'});
test('Street network downloads bounded OSM data explicitly, preserves failed downloads and acquisition provenance',async({page})=>{
  await page.clock.install();
  await page.goto('/?example=snow-isochrone');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  // Each instance's /api/status is read before any download, and WAITED for: it carries the pause
  // the service asks for, and a client that will not wait for the answer is not following it. The
  // mock answers it so the test is not measuring the real service's latency; it is not shortened
  // in the application to suit the test.
  let statuses=0;
  for(const host of ['overpass-api.de','overpass.kumi.systems','overpass.private.coffee'])
    await page.route(`https://${host}/api/status`,async route=>{
      statuses++;await route.fulfill({body:'Rate limit: 2\n2 slots available now.\n',contentType:'text/plain'});});
  // Counted separately from downloads: this test asserts how many DOWNLOADS happen, which is the
  // thing that costs anybody anything.
  let requests=0,probes=0,counts=0;await page.route('https://overpass-api.de/api/interpreter',async route=>{
    const sent=route.request().postData()||'';
    if(sent.includes('node%281%29')){probes++;await route.fulfill({json:{version:0.6,elements:[]}});return;}
    // The COUNT, asked before the download since 2026-10-20: one cheap request that asks the
    // service how much is there, so an area it cannot answer for is refused before six attempts
    // are spent finding out. It is not a download and is not counted as one.
    if(sent.includes('out+count')||sent.includes('out%20count')){counts++;
      await route.fulfill({json:{version:0.6,elements:[{type:'count',id:0,tags:{ways:'3',total:'3'}}]}});return;}
    requests++;assert.match(sent,/data=/);await route.fulfill({json:{elements:[{type:'node',id:1,lon:-.136668,lat:51.513341},{type:'node',id:2,lon:-.135,lat:51.513341},{type:'way',id:3,nodes:[1,2],tags:{highway:'footway'}}]}});});
  await page.locator('[data-view="workflow"]').click();
  await page.locator('.react-flow__node[data-id="network"]').click();await configureNetwork(page,{method:'osm'});assert.equal(requests,0);await page.locator('#download-network').click();await expect(page.locator('#inspector-content')).toContainText('2 junctions');assert.equal(requests,1);assert.equal(counts,1,'the count is asked once, before the download');const w=await saved(page),node=w.nodes.find(n=>n.type==='network_input');
  // The saved workflow holds a REFERENCE; the graph itself is in the large store. A street network
  // in localStorage is what stopped Bunia being kept at all on 2026-10-20.
  assert.equal(node.params.data,undefined);assert.match(node.params.dataRef,/^[0-9a-f]{16,}$/);
  const data=await payload(page,node.params.dataRef);assert.equal(data.provenance.provider,'OpenStreetMap');assert.ok(data.provenance.bounds[0]<-.142);assert.ok(data.provenance.boundary.coordinates.length);
  await expect(page.locator('#download-network')).toBeDisabled();await expect(page.locator('#network-download-status')).toContainText('seconds');await page.clock.fastForward(61000);await expect(page.locator('#download-network')).toBeEnabled();
  await page.unroute('https://overpass-api.de/api/interpreter');await page.route('https://overpass-api.de/api/interpreter',route=>
    (route.request().postData()||'').includes('node%281%29')
      ?route.fulfill({json:{version:0.6,elements:[]}})
      :route.fulfill({status:429,body:'Rate limited'}));await page.locator('#download-network').click();await expect(page.locator('#toast')).toContainText('HTTP 429');assert.deepEqual((await saved(page)).nodes,w.nodes);
});
});
test('sized study boundaries preserve reporting geometry',async({page})=>{
  await page.goto('/?example=snow-voronoi');await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});await page.locator('.react-flow__node[data-id="study"]').click();await page.locator('#edit-study-area').click();await page.locator('#area-online').uncheck();await page.locator('#area-sized-box summary').click();await page.locator('#area-box-shape').selectOption('square');await page.locator('#area-box-width').fill('1000');await page.locator('#area-box-create').click();await page.locator('#area-apply').click();
  let w=await saved(page),area=w.nodes.find(n=>n.id==='study');assert.equal(area.params.selectionMode,'bbox');const original=area.params.geometry;
  await page.locator('[data-view="workflow"]').click();
  // Buffer study area was retired on 2026-11-06: a source's own margin fetches beyond an area. The study area's own
  // geometry is what this test holds, and it is unchanged by anything downstream.
  await page.locator('.react-flow__node[data-id="study"]').click();await page.locator('#edit-study-area').click();await page.locator('#area-sized-box summary').click();await page.locator('#area-box-shape').selectOption('rectangle');await page.locator('#area-box-width').fill('2000');await page.locator('#area-box-height').fill('1000');await page.locator('#area-box-create').click();await page.locator('#area-apply').click();w=await saved(page);const ring=w.nodes.find(n=>n.id==='study').params.geometry.coordinates[0];assert.ok(ring[1][0]-ring[0][0]>original.coordinates[0][1][0]-original.coordinates[0][0][0]);
});

/** THE CONTROL AND THE MAP ARE ONE FACT, NOT TWO.
 *
 *  The practitioner, 2026-10-29, over a drawn river: *"look at the Polygon layer checkbox, it's
 *  unchecked but the waterway polygon layer is showing."*
 *
 *  It was. Every feature was added to the map individually AND collected into a group, and the
 *  group was what the control listed. Leaflet draws a checkbox from whether the listed layer is
 *  on the map, so the box reported the group -- never added -- while the features it contained
 *  were plainly drawn. A group is now drawn BY being added, so the box and the shapes are the
 *  same fact.
 *
 *  Asserted on every overlay rather than on one, because the defect was structural: anything
 *  registered in the control and drawn by another route reads as off while showing. */
test('every layer the control lists is one the map actually holds',async({page})=>{
  await page.goto('/?example=snow-isochrone');
  await expect(page.locator('#workflow-state')).toContainText('Run complete',{timeout:45000});
  await page.locator('[data-view="results"]').click();
  // The interactive presentation is the one with a layer control; this example ships both.
  await page.locator('#result-tab-interactive').click();
  const boxes=page.locator('.leaflet-control-layers-overlays input[type="checkbox"]');
  await expect(boxes.first()).toBeVisible({timeout:20000});
  const count=await boxes.count();
  for(let i=0;i<count;i++)
    await expect(boxes.nth(i),`overlay ${i} is listed but not on the map`).toBeChecked();
});
