import {MAX_GROUND_LAYERS,groundPort,isGroundPort} from './core.js';
import {escapeHtml as esc} from './html-escape.js';
import {noteImageDigest,noteImageFigure,noteImageKey,readNoteImagePayload,type NoteImage} from './note-image.js';
import {openChangelog} from './changelog-ui.js';
import {GHS_CITATION,GHS_EPOCHS,GHS_LICENCE,GHS_NOTE,GHS_PROJECTED,ghsUrl,ghsRecordFor} from './ghs-pop.js';
import {grid3RasterFor,grid3RecordFor,GRID3_CITATION,GRID3_COUNTRIES,GRID3_LICENCE,GRID3_NOTE,GRID3_PRODUCT,GRID3_TAKEN} from './grid3-catalogue.js';
import {countriesOfArea} from './area-countries.js';
import {studyAreaInspector,geometryVertices,type StudyAreaKit} from './study-area-inspector.js';
import {mapImageStep,type MapImageKit} from './map-image-ui.js';
import {catalogLinks,builtInLinks,exampleLinksBlock,exampleSlug,type ExampleLinks} from './example-links.js';
import {SCAN_DEFAULTS,newScanSeed} from './space-time-scan.js';
import {linkLinesSvg} from './map-links.js';
import {diveDeeperPanel,learnBlock,ZONE_PAGE} from './dive-deeper.js';
import {buildOrder,revealedTypes,revealReason} from './reveal-playback.js';
import {openManual,hasManual,renderManualPage} from './manual.js';
import {projectWidgets,projectWidgetsMarkup} from './project-widgets.js';
import {appendInspector} from './append-ui.js';
import {detectInspector} from './detect-ui.js';
import {lineInspector,type LineKit} from './line-input-ui.js';
import {chartInspector,type ChartKit} from './chart-ui.js';
import {distanceInspector,type DistanceKit} from './distance-ui.js';
import {pointInspector,type PointKit} from './point-data-ui.js';
﻿import widgetRegistry from '../widgets/registry.json';
import {setupLabEvaluation} from './lab-evaluation-ui.js';
import {canvasN3} from './canvas-semantics.js';
import appPackage from '../package.json';
import {johnSnowExample} from './john-snow.js';
import {compareInspector,type CompareKit} from './point-comparison-ui.js';
import {CATCHMENT_TYPES} from './catchments.js';
import {networkInspector,networkDownloadTick,type NetworkKit} from './network-input-ui.js';
import {mountCatchmentMap,mountDensityPanel,mountDensityLayers,BASEMAP_OPTIONS,placeOnMap} from './catchment-map.js';
import {catchmentPlot,polygonSvg,polygonPanelsSvg,panelColumns,catchmentFrame,polygonFrame} from './catchment-output.js';
import {rasterMapPlan} from './raster-map-plan.js';
import {rasterPanelsSvg,rasterOneMapSvg,overlapWords,densityImage,rampFor,scaleWords,drawnWords} from './raster-image.js';
import {mapPresentation,standaloneMapSvg} from './map-communication.js';
import {metresPerPixel} from './presentation.js';
import {RATE_TABLE_KEYS} from './rate.js';
import {SERIES_TABLE_KEYS} from './case-series.js';
import {installCredentials} from './credentials-ui.js';
import {saveToRepository} from './repository-save.js';
import {PROJECT_ROLES,PROJECT_ROLE_LABEL,REPOSITORY_ROLES,proposedProjectRole,roleShortfall,readMembers,memberStatement,type ProjectRole,type RepositoryRole} from './project-roles.js';
import {readProjectAt,projectDocumentFromFiles,fileDigests,changedPaths,headCommit,recentDiscussions,listCollaborators,discussionTargets,tokenRepositories,namedRepository,mergeLatest,type Merge} from './shared-project.js';
import {checkRepository,postDiscussion,repositoryName,GITHUB_API,type RepositoryCheck} from './repository-check.js';
import type {CredentialAccess} from './credentials-ui.js';
import {addableTypes,PALETTE_GROUPS,ADDABLE_VIA_RULESET,INPUT_STAGE} from './palette.js';
import {tidyLayout,alreadyTidy,freeSpot} from './layout.js';
import {openStepViewer,openTableViewer,shapeChange,stepLabels,tableViewOf,type TableView} from './table-viewer.js';
import {relateInspector,type RelateKit} from './relate-ui.js';
import {joinInspector,type JoinKit} from './area-join-ui.js';
import {openConfigDialog,setRunInFlight,runSettled} from './config-dialog.js';
import {ISSUE_LABEL,unreadHeadline} from './data-issues.js';
import {facilitiesInspector,type FacilitiesKit} from './facilities-ui.js';
import type {RegisterEntry} from './facility-matching.js';
import facilityRegistersJson from '../widgets/facility-registers.json';
const FACILITY_REGISTERS=facilityRegistersJson.registers as RegisterEntry[];
import {shiftColumnName} from './relate-table.js';
import {wideDataTable,declaredWide,recordsSaid} from './data-table.js';
import {columnFor} from './input-data.js';
import {authoredSubjects} from './authored-application.js';
import {searchCatalogInspector} from './satellite-catalog-ui.js';
import {mapInspector,type MapKit} from './map-ui.js';
import {SAMPLE_KEYS,days as sampleDays} from './satellite-sample.js';
import {productFor} from './satellite-products.js';
import {onRunDetail} from './run-progress.js';
import {appendLabel,appendPort,appendTableCount} from './append-rows.js';
import {GRID_KEYS,gridReaderFor} from './satellite-grid-sample.js';
import {treeSvg} from './transmission-tree.js';
import {findProductsInspector} from './satellite-products-ui.js';
import {fetchRemoteTable,useDeviceCopies,archiveOnDevice,progressText} from './remote-table.js';
import {describableColumns,fileRows,isDescribed,metadataFindings,entriesFrom,dictionaryKeyOf,scalesOf,type TableDictionary} from './column-metadata.js';
import {openColumnsDialog} from './columns-dialog.js';
import {castColumn,applyRepairs} from './column-profile.js';
import {openDataQuality} from './data-quality-ui.js';

import {evidenceInspector,openEvidenceEditor} from './evidence-ui.js';
import {workflowDocument,importWorkflowDocument,exportEvidenceFiles,keepBytes,readPDF,storePDFs} from './evidence-storage.js';
import {curatedExamples,exampleById,verifiedFile,type CatalogExample} from './example-catalog.js';
import {validateManual,renderManual,firstUndone,stepSentence,placedByStep,handleTypes,type WorkedExampleManual} from './worked-example-manual.js';
import {saveRefusalMessage} from './save-refusal.js';
import {MAX_BUNDLE_BYTES} from './evidence.js';
import type {Workflow,WorkflowNode,NodeType,Boundary,Position,SpatialRelation,ColumnRepair} from './types.js';
import type {WorkflowRun,Receipt,Output,MapRow,PointRow,CoverageValue,TableValue} from './results.js';
import type {CanvasAPI,NodeDescription} from './canvas.js';
import type {Connection,Edge} from '@xyflow/react';
import type {ReasonerQuad,ReasoningRequest,ReasoningResponse} from './worker-types.js';
import {element as $,optionalElement,control} from './dom.js';
import {errorMessage,isRecord,required} from './guards.js';
import {supersession} from './rulesets.js';
import {orderOf,inRange} from './select-rows.js';
function getNode<K extends NodeType>(w:Workflow,id:string,type:K):WorkflowNode<K>{const node=required(w.nodes.find(n=>n.id===id));if(node.type!==type)throw new Error('Node type changed while editing');return node as WorkflowNode<K>;}
function updateParam(w:Workflow,id:string,key:string,value:unknown){Object.assign(required(w.nodes.find(n=>n.id===id)).params,{[key]:value});}
function replaceWorkflow(w:Workflow,next:Workflow){for(const key of Object.keys(w))Reflect.deleteProperty(w,key);Object.assign(w,next);}
import {PORT_NAMES,PORT_GROUPS,PORT_ROLES,groupFor,shownPort,portBase} from './port-names.js';
import {symbolOf,SYMBOL_WORDS,iconMarkup} from './port-symbols.js';
import {TYPES,validateWorkflow,validateGeoJSON,executionPlan,executeWorkflow,nodeInputs,outputOf,portAccepts,pointsAsTable,portSourceName,nearestPlaces,IncompleteWorkflow,MAX_AREA_INPUTS} from './core.js';
import {suggestUTM,utmScaleFactor,workflowPositions} from './utm.js';
import {mountCanvas} from './canvas.js';
import {staticBoundaryMap,staticMapFrame} from './static-map.js';
import {lineLayersOf} from './map-lines.js';
import {mapLayerList,membersOfPolygons,LAYER_LABEL_LIMIT,type MapLayer} from './map-layer-list.js';
import {applyFeatureEdits,applyTableEdits,editsAt,type CellEdit,type EditEntry} from './cell-edits.js';
import {MAX_POLYGON_LAYERS,polygonPort} from './polygon-layers.js';
import {MAX_RASTER_LAYERS,rasterPort} from './raster-panels.js';
import {partsTable,partsTableMarkup} from './map-parts-table.js';
import {TARGETS,projectOutline,outlineMarkup,slotsForNote} from './outline.js';
import {planView,planMarkup,openPlanDialog,withPart,markedComplete,unmarked,type Plan} from './plan.js';
import {auditTarget,openAuditDialog} from './notes-audit.js';
import {publicationParts,promptFor,PRODUCT_KINDS,isProductKind,layoutKey,type ProductKind,type PublicationInput,type AttachableTable} from './publication.js';
import {CHAIN_COLUMNS} from './transmission-chains.js';
import {boxInside,composeInset,insetWidth,focusDiameter} from './map-inset.js';
import {notesPanel,openNoteDialog,noteKey} from './notes-ui.js';
// THE WRITE-UP IS THE PROJECT'S. A run contributes its notes to a store the Notes tab reads
// across every workflow of the project, rather than the tab reading the open run alone.
import {figureFor,describedNode,tableCsv,tableRowCount} from './write-up-figures.js';
import type {InspectorKit,OwnInspector,StepKit} from './inspector-kit.js';
import {setFigureWords,figureWordsOf,fillWords,figureWords} from './figure-words.js';
import {tableInspector,type TableKit} from './data-table-ui.js';
import {sampleInspector,type SampleKit} from './sample-raster-ui.js';
import {travelInspector} from './travel-ground-ui.js';
import {vocabularyInspector,type VocabularyKit} from './vocabulary-map-ui.js';
import {caseSeriesInspector,rateInspector,type SeriesRateKit} from './series-rate-ui.js';
import {TABLE_STEP_INSPECTORS,type TableStepKit} from './table-steps-ui.js';
import {rulesetInspector,type RulesetKit} from './ruleset-ui.js';
import {OUTBREAK_STEP_INSPECTORS,type OutbreakKit} from './outbreak-steps-ui.js';
import {dedupInspector,type DedupKit} from './deduplicate-step-ui.js';
import {tableOutputInspector,dataTableColumns,type TableOutputKit} from './table-output-ui.js';
import {tableNotesHtml} from './table-presentation.js';
import {AREA_STEP_INSPECTORS,type AreaStepKit} from './area-steps-ui.js';
import {zipSync,strToU8} from 'fflate';
import {referenceList} from './references.js';
import {WRITE_UP_STORE,readWriteUp,entryForRun,recordEntry,writeUpOf,sourceOfNote,
  type WriteUp,type WriteUpEntry} from './write-up.js';
import {typeset} from './prose.js';
import {readNotes,WRITE_UP_PARTS,type Note,type WriteUpPart,moveNote,forkMachinedNote,
  UNWRITTEN,objectivesOf,type MachinedNote,FIGURE_SECTIONS,DEFAULT_FIGURE_SECTIONS,figureSection,type FigureSection,LEFT_OUT,inWriteUp} from './notes.js';
import {readAuthors,currentIdentity,attestIdentity,setCurrentIdentity,authorLabel,DEVICE_REPOSITORY_FIELDS,readRepository} from './identity.js';
import {installIdentity,openIdentity,identityUntilLock,signingIdentity,identityKeepOpen} from './identity-ui.js';
import {openSealDialog,openSealedFile,type SealMember} from './seal-ui.js';
import {isSealed,readKeyText} from './sealed-file.js';
import {openRepositoryFiles,sealRepositoryFiles,recipientsDigest,holdsSealed,sealable,SEALED_SUFFIX} from './repository-seal.js';
import {signStatement,verifyStatement} from './identity-file.js';
import {affiliationLabel} from './affiliations-ui.js';
import {noteVersion} from './identity-file.js';

/** A polygon layer's chosen file, waiting for Apply. Keyed by node, outside the DOM, because the
 *  Inspector re-renders on every setting change. */
import {resolveLayerSymbol,markPath,FIGURE_ROLE} from './presentation.js';
import {EXAMPLE_TEMPLATES,hasExampleTemplate,EXAMPLE_KEYS,WORKED_EXAMPLE_KEYS} from './example-templates.js';
import {templateFrom} from './workflow-template.js';
import {blankWorkflow,newStudyArea,studyAreaN3,quadToN3,areaSvg,validateDrawnGeometry,storageRefusal,STORAGE_QUOTA_BYTES} from './study-area.js';
import {loadPayloads,putPayload,dropPayload,cachedPayload,cachedPayloads,payloadStoreKind,payloadBytes,onStoreDegraded} from './payload-store.js';
import {openStudyAreaEditor} from './study-area-map.js';
import {newAreaMeasurement,formatArea,AREA_UNITS} from './area-measurement.js';
import {newObservations,relationLabel} from './spatial-coverage.js';
import {openInputDataEditor} from './input-data-ui.js';
import {chartMarkup} from './chart-output.js';
import {chartOrientation,chartRenderer} from './chart-vega.js';
import {standaloneChartSvg} from './chart-figure.js';
import {networkPreviewSvg,networkCoverage,networkPreviewCaption} from './network-preview.js';
import {chartVegaSpec,renderVegaChart,renderVegaTree,disposeVegaChart} from './chart-vega.js';
import {openRasterEditor,rasterSvg,rasterFrame,downloadRaster,rasterInspector,type RasterKit} from './raster-ui.js';
import {TILE_PROVIDERS,basemapImages,fetchTileAsDataURI,useTileStore} from './basemap-tiles.js';
import {rasteriseFigure,FIGURE_PIXEL_SCALE} from './figure-export.js';
import {COUNTRIES,countryName,iso3Of,countryOfArea} from './boundary-source.js';
import {worldPopRastersForCountry,worldPopRecordFor,GLOBAL2,WORLDPOP_LICENCE,WORLDPOP_TAKEN,WORLDPOP_BYTES_PER_SECOND,downloadWait} from './worldpop-catalogue.js';
import type {AreaParams} from './types.js';
import {containsPoint} from './point-grid.js';
import {basemapOf,extentSpanKm,useBasemapKeys,KEY_ORIGINS,staticGround} from './basemaps.js';
import {naturalEarthMarkup,NATURAL_EARTH_CREDIT} from './natural-earth.js';
import {mapImage,mapImageMarkup,mapImageCredit,type MapImage} from './map-image.js';

import {dataTableMarkup,tableFromFetched,wideFrame} from './data-table-ui.js';
import {openCatalogDialog,identityMarkup,widgetIdentity} from './catalog-ui.js';
import {initTheme,applyTheme,saveThemePreference,isThemePreference} from './theme.js';
import {previewArea,prepareRasterPreview,rasterOfNode} from './raster-preview.js';
import {polygonInspector,type PolygonKit} from './polygon-input-ui.js';
import {contentHash} from './project-files.js';
import {projectDocument,readProjectDocument,unbundledReferences,PROJECT_DOCUMENT_SCHEMA} from './project-document.js';
import {openPackageDialog} from './package-ui.js';
import {syncProjectManifest} from './project-manifest.js';
import {withDictionary,BUILT_IN_PROJECTS,WORKFLOW_LABELS,projectOfWorkflow,projectById,siblingAreas,newProject,validateProject,siblingInputs,payloadDigest,tableDataKey,dataPayloadKey,INLINE_DATA_LIMIT,areaPayloadKey,searchPayloadKey,payloadsOf,heldPayloadsOf,reconcilePayloadRefs,dehydrateWorkflow,hydrateWorkflow,projectSafety,unexportedWork,exportPredatesWork,type Project,type ProjectWork} from './project.js';
import {mountPanelLayout} from './panel-layout.js';
import {newMapOutput,mapEvidence,withoutLeftOutAreas} from './map-output.js';
import {newTableOutput,pointTableMarkup,pointTableEvidence,pointTableColumns} from './table-output.js';
import {pointPort,markedPoints,layerOrigins} from './point-layers.js';
import {twoByTwoMarkup} from './two-by-two-view.js';
import {exposureColumnsOffered} from './two-by-two-mapping.js';
import {repositoryFiles} from './project-repository.js';
import {ZipWriter,BlobWriter,TextReader} from '@zip.js/zip.js';
import {designChecklist} from './study-design-checklist.js';
import type {TwoByTwoResult} from './two-by-two.js';

const KEY='fieldwork-workflow-v1';
$('#app-version').textContent=`v${appPackage.version}`;
$('#app-version').addEventListener('click',()=>void openChangelog(appPackage.version,esc));

/** `?reset-cache=1` — throw away every cached copy of this application and reload.
 *
 *  A service worker that has cached a build serves it until something replaces it, and the
 *  remedies for that are all developer tools: a hard reload, unregistering the worker, clearing
 *  site data. A practitioner reading this page in an embedded browser -- VS Code's Simple
 *  Browser, a preview pane, a kiosk -- has none of those, and no way to tell that what they are
 *  looking at is a build from last week. The practitioner, 2026-10-15, on exactly that: "This is
 *  the in-VSCode Browser viewing local static page and still shows 0.7.0", with the files on disk
 *  at 0.8.1.
 *
 *  So the escape hatch is a URL. It unregisters every worker for this origin, deletes every cache
 *  it owns, and reloads with a one-time cache-busting parameter so the HTTP cache cannot answer
 *  either. The saved workspaces are in localStorage and are deliberately untouched: this clears
 *  the APPLICATION, not the practitioner's work.
 *
 *  One exception, added 2026-10-19: the OSM response cache (`fieldwork-osm-v1`) is a cache and
 *  goes with the rest. Losing it costs a request, not a result -- the saved graph lives in the
 *  workflow, not here -- so it is re-fetchable by definition. Named because it is the one thing
 *  cleared here that a practitioner paid a public service for.
 */
/** A WAY BACK IN WHEN WHAT IS STORED IS WHAT BREAKS IT.
 *
 *  The practitioner, 2026-10-22, after downloading a province: *"I need to clean up Chrome
 *  because it won't allow me to load FW. Is there a way to load it with a cleanup URL?"* There
 *  was not. `reset-cache` unregisters the service worker and clears the HTTP caches, which is a
 *  different problem: the graph that will not load is in IndexedDB, and clearing it meant going
 *  to Chrome's own settings and deleting everything this application had ever saved.
 *
 *  Both run before anything is restored, so a workflow too large to open cannot stop the thing
 *  that would let go of it.
 *
 *  `?forget-datasets` drops the payload store -- the networks and rasters -- and keeps the
 *  projects and workflows, which then read "0 nodes" and can be downloaded again. That is almost
 *  always the one wanted: the workflow is the work, and the graph can be fetched twice.
 *
 *  `?forget-everything` clears this application's localStorage as well, which is every project,
 *  workflow and setting on this device. It says so and asks first, because nothing here is
 *  recoverable and an export is the only copy. */
const forgetting=new URLSearchParams(location.search);
if(forgetting.has('forget-datasets')||forgetting.has('forget-everything')){
  const everything=forgetting.has('forget-everything');
  (async()=>{
    if(everything&&!confirm('Delete every project, workflow and setting saved on this device? '
      +'This cannot be undone, and an exported file is the only copy. '
      +'To keep your workflows and drop only the downloaded data, use ?forget-datasets instead.')){
      location.replace(location.pathname);return;
    }
    try{
      await new Promise(resolve=>{
        const request=indexedDB.deleteDatabase('fieldwork');
        request.onsuccess=request.onerror=request.onblocked=()=>resolve(null);
      });
      localStorage.removeItem('fieldwork-datasets-v1');
      if(everything)for(const key of Object.keys(localStorage))
        if(key.startsWith('fieldwork'))localStorage.removeItem(key);
    }catch{/* a store that refuses to be opened cannot hold the reload below */}
    location.replace(location.pathname);
  })();
}else if(new URLSearchParams(location.search).has('reset-cache')){
  (async()=>{
    try{
      const registrations=await navigator.serviceWorker?.getRegistrations?.()??[];
      await Promise.all(registrations.map(registration=>registration.unregister()));
      const keys=await caches?.keys?.()??[];
      await Promise.all(keys.map(key=>caches.delete(key)));
    }catch{/* a browser that refuses either one still gets the reload below */}
    const url=new URL(location.href);
    url.searchParams.delete('reset-cache');
    url.searchParams.set('cache-bust',String(Date.now()));
    location.replace(url.toString());
  })();
}
// Keep keyboard and scroll-to-element navigation clear of the floating controls.
new ResizeObserver(([entry])=>document.documentElement.style.setProperty('--project-bar-height',`${entry.target.getBoundingClientRect().height+12}px`)).observe($('.project-bar'));
const WORKSPACES='fieldwork-examples-v1';
/** Projects a practitioner created, beside the seven built in. Stored separately from the
 *  workflows themselves: a project names an investigation and lists the workflows in it, and a
 *  workflow is bytes. Losing the list should not lose the work, so they fail independently. */
const PROJECTS='fieldwork-projects-v1';
/** Payloads a project's workflows share, held once and addressed by digest.
 *
 *  Content-addressed storage, project-scoped VISIBILITY. Identical bytes are stored once wherever
 *  they came from -- that is just what a digest does -- but a workflow is only ever OFFERED the
 *  inputs of its own project's other workflows. Sharing storage is a byte fact; sharing visibility
 *  is a claim about which investigation data belongs to, and only the second is scoped. */
const readDatasets=():Record<string,unknown>=>cachedPayloads();
/** Keep a payload where it will fit, and report whether it is kept rather than assuming it.
 *
 *  Both callers are already async -- a download and an import both await something -- so this
 *  awaits the durable write BEFORE the workflow records a reference to it. The alternative, a
 *  reference written now and a payload written later, is a workflow that reloads into a refusal. */
async function keepDataset(digest:string,payload:unknown):Promise<boolean>{
  const where=await putPayload(digest,payload);
  forgetSavedWorkflows();
  if(!where)$('#save-status').textContent='Storage unavailable — export to keep';
  return where!==null;
}
/** Every saved workflow, with shared payloads put back.
 *
 *  One reader for the three callers that need saved workflows -- loading one, listing them in the
 *  picker, and offering a sibling's inputs -- so hydration cannot be remembered in two of them and
 *  forgotten in the third. Payloads are shared BY REFERENCE here, which is safe because these
 *  copies are read and never edited; the workflow being edited is cloned, below. */
/** Cached, because `renderLibrary` runs on every keystroke in the node search and this parses the
 *  whole workspace map. Every write to that map goes through `save()` or `assignCurrentWorkflow`,
 *  so the cache is cleared there and nowhere else needs to know it exists. */
let savedWorkflowCache:Record<string,unknown>|null=null;
const forgetSavedWorkflows=()=>{savedWorkflowCache=null;};
function readSavedWorkflows():Record<string,unknown>{
  if(savedWorkflowCache)return savedWorkflowCache;
  let saved:Record<string,unknown>={};
  try{const raw=JSON.parse(localStorage.getItem(WORKSPACES)||'{}');if(isRecord(raw))saved=raw;}catch{return {};}
  const datasets=readDatasets();
  const hydrated:Record<string,unknown>={};
  for(const [key,value] of Object.entries(saved)){
    try{hydrated[key]=hydrateWorkflow(value,datasets);}
    catch{/* a workflow whose shared data is gone is left as stored; opening it reports why */}
  }
  savedWorkflowCache=hydrated;
  return hydrated;
}
function readProjects():Project[]{
  try{const raw=JSON.parse(localStorage.getItem(PROJECTS)||'[]');return Array.isArray(raw)?raw.flatMap(entry=>{try{return [validateProject(entry)];}catch{return [];}}):[];}
  catch{return [];}
}
const allProjects=():Project[]=>[...BUILT_IN_PROJECTS,...readProjects()];
function writeProjects(projects:Project[]):boolean{
  try{localStorage.setItem(PROJECTS,JSON.stringify(projects));return true;}
  catch{$('#save-status').textContent='Storage unavailable — export to keep';return false;}
}
// Named workspaces first, then the fallback. The fallback treats any workflow holding a study
// area as Old Naledi, which is why a new example must be listed here: the Manila sea-level
// example has an area node and was silently labelled, described and noted as Old Naledi until
// it was added. This is the "examples are the default world" problem in TODO.md, in the one
// place it is least visible.
const NAMED_WORKSPACES=['blank','hagelloch','hagelloch-chains','hagelloch-cluster','hagelloch-sheet','hagelloch-people'];
// A workflow a practitioner created is NOT an example, and the study-area fallback below would
// label it Old Naledi -- the "examples are the default world" problem, reached at last by a real
// workflow rather than by a new example. `projectId` is the discriminator: it is set only on a
// workflow that belongs to a practitioner's project, and never on a worked example.
const exampleKey=(w:Workflow):string=>w.projectId?'blank':w.exampleId?.startsWith('snow-')?w.exampleId:NAMED_WORKSPACES.includes(w.exampleId as string)?w.exampleId as string:'hagelloch';
/** Where a workflow is SAVED, as against which worked example's chrome it shows. They are the
 *  same string for all twelve examples and differ for everything a practitioner makes, whose key
 *  is minted per workflow because the example vocabulary is closed and compiled in. */
const storageKey=(w:Workflow):string=>w.workflowKey||exampleKey(w);
const template=(key:string)=>(EXAMPLE_TEMPLATES[key]||EXAMPLE_TEMPLATES.hagelloch)();
/** WHAT A WORKFLOW WAITS FOR before it can run, in words, or null when nothing. A worked example's offered image waits for
 *  the learner to choose it (Snow's Map 2 placed by hand, 2026-11-13: "Run workflows" had counted it as never run). */
const waitsFor=(w:Workflow):string|null=>{
  for(const n of w.nodes){
    if(n.type==='raster_input'&&!n.params.asset)return 'its raster is read first';
    if(n.type==='network_input'&&!n.params.data.nodes.length)return 'its street network is downloaded first';
    if(n.type==='table_input'&&!n.params.data.rows.length)return 'its table is fetched first (select the table and choose Fetch the table)';
    if(n.type==='map_image_input'&&n.params.offered&&!n.params.image?.width)return 'its map image is chosen and placed in Configure\u2026';
  }
  return null;
};
const canAutoRun=(w:Workflow)=>w.nodes.length>0&&!waitsFor(w);
let credentials:CredentialAccess|null=null;
/** The shared project's section: when GitHub was last read for it, and what it was last drawn for. */
let remoteChecked:{project:string;at:number}|null=null;
let sharedSignature='';
/** A backup about to be imported into a shared repository, set by its button and taken by the import. */
let pendingShare:{repository:NonNullable<Project['repository']>;at:number}|null=null;
let incompleteShown=false;
let workflow=EXAMPLE_TEMPLATES.hagelloch(),selected:string|null|undefined='cases',result:WorkflowRun|null=null,runWorkflow:Workflow|null=null,busy=false,dirty=true,runFailed=false,runIncomplete=false,statuses:Record<string,string>={},history:Workflow[]=[],future:Workflow[]=[],flow:CanvasAPI|null=null,worker:Worker|null=null,seq=0,importNode:string|null=null;
let toastTimer:ReturnType<typeof setTimeout>|undefined,activeOutputId:string|null=null,tablePage=0,tableAttributePage=0;
let tableSort:import('./table-output.js').TableSort|undefined;
let lastRunMs:number|null=null;
/** Nodes that finished within the last moment, so the canvas can show it happening.
 *  A run is otherwise silent until it ends, and on a slow step there is nothing to say
 *  which widget is waiting on which. Held outside `statuses` because finishing is an
 *  event and `done` is a state: the glow is cleared on a timer, the status is not. */
const justFinished=new Set<string>();
/** Progressive reveal, played back over the example already on the canvas.
 *
 *  Null when off, otherwise how many widgets of the build order have been placed. It is a VIEW:
 *  the workflow is not edited, nothing is saved, and leaving restores the canvas as it was. The
 *  palette dims what the rule would not yet offer rather than hiding it, because a hidden widget
 *  can make a practitioner conclude the application cannot do something it can -- the asymmetry
 *  experiment 112 recorded before any of this was built. */
let playbackStep:number|null=null;
/** A MANUAL PLAYED BACK, one step at a time (experiment 173's dialog; 214's exercise): the nodes placed once each step
 *  is done. Exclusive with the build playback above. */
let manualPlayback:{steps:import('./worked-example-manual.js').ManualStep[];types:Record<string,string>;placed:string[][];index:number;name:string}|null=null;
const playbackOrder=()=>buildOrder(workflow).order;
const playbackPlaced=()=>manualPlayback?workflow.nodes.filter(n=>manualPlayback!.placed[manualPlayback!.index]!.includes(n.id))
  :playbackStep===null?workflow.nodes:playbackOrder().slice(0,playbackStep);
/** The canvas as the playback wants it: the nodes placed so far and the edges between them.
 *
 *  Every path that draws the canvas has to go through this, not only `render`. A run's status
 *  callback used to call `flow.update(workflow, ...)` with the whole workflow on every node it
 *  finished, so a worked example that auto-runs redrew all nine nodes underneath a playback
 *  showing one. Locally the run finished before anyone clicked; in CI it did not, and the
 *  playback test failed there and nowhere else. */
const playbackView=():Workflow=>{
  if(playbackStep===null&&!manualPlayback)return workflow;
  const placed=new Set(playbackPlaced().map(n=>n.id));
  return {...workflow,nodes:workflow.nodes.filter(n=>placed.has(n.id)),
    edges:workflow.edges.filter(e=>placed.has(e.from)&&placed.has(e.to))};
};
function renderPlayback(){
  $('#playback-bar').hidden=playbackStep===null;
  document.body.classList.toggle('playing-back',playbackStep!==null);
  if(playbackStep===null)return;
  const order=playbackOrder(),placed=order.slice(0,playbackStep);
  const {type,unlocked}=revealReason(placed);
  $('#playback-step').textContent=`Step ${playbackStep} of ${order.length}`;
  $('#playback-reason').textContent=!placed.length
    ?'An empty canvas offers only the widgets that need no input.'
    :unlocked.length
      ?`${placed.at(-1)!.params.label||placed.at(-1)!.type} emits ${type}, which reveals ${unlocked.length}: ${unlocked.slice(0,4).join(', ')}${unlocked.length>4?'…':''}`
      :`${placed.at(-1)!.params.label||placed.at(-1)!.type} emits ${type||'nothing'}, which reveals nothing new.`;
  ($('#playback-back') as HTMLButtonElement).disabled=playbackStep===0;
  ($('#playback-next') as HTMLButtonElement).disabled=playbackStep>=order.length;
}
function setPlayback(step:number|null){
  playbackStep=step;
  renderPlayback();renderLibrary($('#node-search').value);render();
}
const FINISH_GLOW_MS=900;
/** Durations as a practitioner reads them, not as a profiler does. */
const elapsedText=(ms:number)=>ms<1000?`${Math.round(ms)} ms`:`${(ms/1000).toFixed(ms<10000?1:0)} s`;

const activeOutput=()=>result?.outputs.find(o=>o.nodeId===activeOutputId)||result?.outputs[0];
/** The result tabs a node produced. Coverage checks make two, suffixed -table and -map, so a node
 *  can own more than one tab. */
const outputsOf=(nodeId:string|null|undefined)=>nodeId
  ?(result?.outputs??[]).filter(o=>o.nodeId===nodeId||o.nodeId.startsWith(nodeId+'-')):[];
/** Selecting an output node shows its result, so the canvas and the Results panel agree about what
 *  is being looked at. A node owning the tab already open keeps that tab rather than jumping. */
/** Marks the tabs the selected node produced. Separate from rendering the results, because
 *  selecting a node that produced none must still clear the previous marks. */
function markLinkedTabs(){
  const owned=new Set(outputsOf(selected).map(o=>o.nodeId));
  $('#result-tabs').querySelectorAll<HTMLButtonElement>('[data-output]').forEach(tab=>{
    const linked=owned.has(required(tab.dataset.output));
    tab.classList.toggle('linked-to-selection',linked);
    if(linked){tab.dataset.linked='true';tab.title='This result comes from the selected node';}
    else{delete tab.dataset.linked;tab.removeAttribute('title');}
  });
}
function revealResultFor(nodeId:string|null|undefined){
  const owned=outputsOf(nodeId);
  if(!owned.length)return false;
  if(!owned.some(o=>o.nodeId===activeOutputId))activeOutputId=owned[0].nodeId;
  return true;
}
const hiddenMapLayers=new Map<string,Set<string>>();
/** The one-line message at the foot of the screen.
 *
 *  Until 2026-10-15 every one of these looked the same. "Complete in 2.1s" and "Workflow
 *  stopped: … cannot run" arrived in the identical success green, and both faded after five
 *  seconds whether or not anybody had finished reading. The practitioner, looking at a stopped
 *  run: *"I cannot make sense of the green error dialog."* Of course not -- it was telling them
 *  the colour of a success and the words of a failure.
 *
 *  A failure is red, and it STAYS until it is closed. A message you are given five seconds to
 *  read is a message somebody decided you did not need. */
/** What is still missing before a run, with the step it is about, kept up to date as the person connects things. */
function showIncomplete(e:IncompleteWorkflow):void{
  const at=e.nodeId;
  toast(errorMessage(e),{tone:'notice',...(at&&workflow.nodes.some(n=>n.id===at)?{action:{label:'Show the step',run:()=>{switchView('workflow');selected=at;render();}}}:{})});
  incompleteShown=true;
}
function toast(message:string,options?:{action?:{label:string;run:()=>void};tone?:'failure'|'warning'|'notice'}){incompleteShown=false;
  const element=$('#toast');element.textContent=message;element.classList.add('visible');clearTimeout(toastTimer);
  element.classList.toggle('failure',options?.tone==='failure');
  element.classList.toggle('warning',options?.tone==='warning');
  // A third tone: nothing failed and nothing needs attention, but something CHANGED and the
  // message says what and how to undo it. Reporting a change to 63 records and taking the
  // message away after five seconds is the same mistake as the green failure dialog, in the
  // other direction. 2026-10-16, experiment 117.
  element.classList.toggle('notice',options?.tone==='notice');
  if(options?.tone){
    // An action BESIDE the close, not instead of it. The first version returned here, so a
    // toned message could not offer anything to do about itself -- and the messages most worth
    // acting on are exactly the ones that are not plain successes. 2026-10-16.
    if(options.action){
      const act=document.createElement('button');
      act.className='button small';act.textContent=options.action.label;
      act.style.marginLeft='12px';act.onclick=options.action.run;
      element.append(act);
    }
    const close=document.createElement('button');
    close.className='button small';close.textContent='×';
    close.setAttribute('aria-label','Close this message');
    close.style.marginLeft=options.action?'6px':'12px';
    close.onclick=()=>element.classList.remove('visible');
    element.append(close);
    return;
  }
  if(options?.action){
    const button=document.createElement('button');button.className='button small';button.textContent=options.action.label;
    button.style.marginLeft='10px';button.onclick=options.action.run;element.append(button);
    const dismiss=document.createElement('button');dismiss.className='button small';dismiss.textContent='Later';
    dismiss.style.marginLeft='6px';dismiss.onclick=()=>element.classList.remove('visible');element.append(dismiss);
    return;
  }
  toastTimer=setTimeout(()=>element.classList.remove('visible'),5000);
}
// Before anything is hydrated: a reference whose payload is missing is a refusal, so the payloads
// have to be read out of IndexedDB first. Top-level await, in an ES module bundle that already
// uses it, rather than a render that shows a workflow with its inputs missing.
//
// The handler is registered FIRST so that a store which degrades during the load -- the migration
// is the first thing that writes -- is reported rather than discovered later. One toast, failure
// tone, because a silent fallback is the hazard: it turns a 10 GB ceiling back into a 5 MB one
// while the application goes on saying "Saved on this device".
onStoreDegraded((_kind,why)=>toast(`${why} Large street networks will be refused until it is. Export anything you need to keep.`,{tone:'failure'}));
await loadPayloads();
// WORKFLOWS SAVED BEFORE 0.88.1 CARRY THEIR LARGE DATA INLINE, a worked example's points and networks among them. Moved
// once into the payload store, keyed by content as a save now keys them, and stripped only where the store confirms it
// holds the copy: a payload that could not be moved stays where it was (2026-11-10).
await (async()=>{
  try{
    const compact=async(w:{nodes?:{type?:string;params?:Record<string,unknown>}[]}):Promise<boolean>=>{
      let changed=false;
      for(const node of w.nodes??[]){
        const params=node.params;
        if(!params||node.type==='table_input'||typeof params.data!=='object'||params.data===null)continue;
        if(typeof params.dataRef==='string'&&!params.dataRef.startsWith('data-'))continue;
        if(JSON.stringify(params.data).length<INLINE_DATA_LIMIT)continue;
        const key=dataPayloadKey(params.data);
        if(await putPayload(key,params.data)!=='indexeddb')continue;
        params.dataRef=key;delete params.data;changed=true;
      }
      return changed;
    };
    const store=JSON.parse(localStorage.getItem(WORKSPACES)||'{}') as Record<string,{nodes?:{type?:string;params?:Record<string,unknown>}[]}>;
    let any=false;
    for(const saved of Object.values(store))if(saved&&await compact(saved))any=true;
    if(any)localStorage.setItem(WORKSPACES,JSON.stringify(store));
    const current=JSON.parse(localStorage.getItem(KEY)||'null') as {nodes?:{type?:string;params?:Record<string,unknown>}[]}|null;
    if(current&&await compact(current))localStorage.setItem(KEY,JSON.stringify(current));
  }catch{/* a store that cannot be compacted is left exactly as it was */}
})();
// Basemap tiles are downloaded assets like any other, so they go to the store that survives a
// reload and is counted in the storage figures. The practitioner, 2026-10-25, on what the offline
// promise means: *"It's a flow from online to offline. Online download the assets, offline use
// the cached assets."* A session-only cache gave the opposite -- ground on the first visit and
// none on the one that mattered.
useTileStore({read:key=>cachedPayload(key),write:(key,value)=>putPayload(key,value)});
// A FETCHED TABLE'S FILE, kept by digest so a second workflow on the same file reads it from the device.
useDeviceCopies({read:readPDF,keep:(digest,bytes)=>keepBytes(new Map([[digest,bytes]]))});
try{const saved=localStorage.getItem(KEY);if(saved)workflow=validateWorkflow(hydrateWorkflow(JSON.parse(saved),readDatasets(),true));}catch(error){toast(errorMessage(error).startsWith('Shared input data is missing')?errorMessage(error):'Saved workflow could not be loaded. The example is ready.');}
if(!workflow.nodes.some(n=>n.id===selected))selected=workflow.nodes[0]?.id;
/** What the last refused save knew, so a caller can say something a practitioner can act on. */
let lastSaveFailure:{name:string;bytes:number}|null=null;
/** The refusal in words, decided in `save-refusal.ts` so it can be tested without racing a
 *  browser against its own auto-run. This passes the three facts and formats nothing itself. */
function saveFailureMessage(fallback:string):string{
  return saveRefusalMessage(fallback,busy,lastSaveFailure,storageRefusal);
}
/** The moment a project's work last changed, and the moment a copy of it last left this device.
 *
 *  Neither was recorded until 2026-10-23, which is why "backed up" could not be said of anything.
 *  Written where the thing actually happens -- a save, and an export that COMPLETED -- so the
 *  state is a fact about what was done rather than about what was attempted. */
function touchProject(id:string|undefined,field:'changedAt'|'exportedAt'):void{
  if(!id)return;
  const stored=readProjects();
  const project=stored.find(p=>p.id===id);
  if(!project)return;   // a worked example is not stored, and has nothing to back up
  project[field]=new Date().toISOString();
  writeProjects(stored);
}

function save(){
  // TABLES ARE KEPT IN THE DATASET STORE, by content, like every other input's data: inline, a wide file of 92 columns
  // already failed to save, and no larger table could (experiment 175). A table with no rows here -- one fetched and
  // not yet read on this device -- has nothing to keep.
  for(const node of workflow.nodes){
    if(node.type!=='table_input')continue;
    const params=node.params as {data?:{rows?:unknown[]};dataRef?:string};
    if(params.data?.rows?.length){const key=tableDataKey(params.data as {rows:unknown[]});if(params.dataRef!==key)params.dataRef=key;}
    else delete params.dataRef;
  }
  // AN ACQUIRED STUDY AREA'S OUTLINE goes the same way, keyed by its content on every save: a published jurisdiction is
  // what runs large (Uganda at ADM0, 1.4 MB), as an acquired polygon layer is. A shape drawn by hand stays inline, where
  // it is small and is read as it sits.
  for(const node of workflow.nodes){
    if(node.type!=='study_area')continue;
    const params=node.params as {source?:string;geometry?:unknown;revisions?:unknown;areaRef?:string;boundary?:unknown};
    if(params.source==='drawn'&&params.geometry&&params.boundary){const key=areaPayloadKey(params as {geometry:unknown});if(params.areaRef!==key)params.areaRef=key;}
    else delete params.areaRef;
  }
  // EVERY OTHER STEP'S LARGE DATA goes the same way, whatever brought it: a worked example's points or street network as
  // much as a download (2026-11-10, a practitioner's store at 4.5 MB of 5.2 MB). A reference a download gave is kept; a
  // key made here is remade when the data changes.
  for(const node of workflow.nodes){
    if(node.type==='table_input')continue;
    const params=node.params as {data?:unknown;dataRef?:string};
    if(params.data===undefined||params.data===null||typeof params.data!=='object')continue;
    if(params.dataRef&&!params.dataRef.startsWith('data-'))continue;
    if(JSON.stringify(params.data).length<INLINE_DATA_LIMIT){if(params.dataRef?.startsWith('data-'))delete params.dataRef;continue;}
    const key=dataPayloadKey(params.data);if(params.dataRef!==key)params.dataRef=key;
  }
  // A CATALOG SEARCH'S ITEMS go the same way (experiment 182): sixteen years of MODIS is 5.9 MB, more than local
  // storage holds, and a node that could not be saved was added on screen and lost.
  for(const node of workflow.nodes){
    if(node.type!=='search_satellite_catalog')continue;
    const params=node.params as {search?:{items?:unknown[]};searchRef?:string};
    if(params.search){const key=searchPayloadKey(params.search);if(params.searchRef!==key)params.searchRef=key;}
    else delete params.searchRef;
  }
  syncProjectManifest(workflow);
  const previous=new Map<string,string|null>();
  try{for(const key of [KEY,WORKSPACES])previous.set(key,localStorage.getItem(key));const workspaces=JSON.parse(previous.get(WORKSPACES)||'{}');// A payload that arrived with an imported workflow is written to the store on the way past, so
    // the reference it carries resolves on the next load rather than refusing.
    //
    // The snapshot of what the store holds is taken AFTER this loop, not before. Taken before, a
    // payload written here was not yet in it, so the workflow was dehydrated as though the
    // reference were unbacked -- which keeps the data INLINE and sends an eight-megabyte workflow
    // into a five-megabyte store. The save then failed and an imported project could not be kept
    // at all. Found 2026-10-20 by the large-project round trip, in the fix for the round trip.
    for(const node of workflow.nodes)
      for(const [ref,payload] of payloadsOf(node.params as unknown as Record<string,unknown>))
        if(!Object.hasOwn(cachedPayloads(),ref))void putPayload(ref,payload);
    const kept=cachedPayloads();
    const stored=dehydrateWorkflow(workflow,digest=>Object.hasOwn(kept,digest));workspaces[storageKey(workflow)]=stored;localStorage.setItem(KEY,JSON.stringify(stored));localStorage.setItem(WORKSPACES,JSON.stringify(workspaces));forgetSavedWorkflows();
    // WHICH store, when it is not the large one. A practitioner whose payloads are back under the
    // 5 MB cap needs to know before a download, not after it is refused.
    lastSaveFailure=null;
    // The project's work changed, which is what makes it unbacked until an export completes.
    touchProject(workflow.projectId??projectOfWorkflow(storageKey(workflow),allProjects())?.id,'changedAt');
    renderProjectSafety();return true;}
  catch(error){
    // WHY IT FAILED, KEPT. This caught and rolled back and returned false, and every caller could
    // then say only "could not be saved. Retry Apply." -- which is useless advice when the cause
    // is a full store, because retrying fails identically. Reported 2026-10-21 on an Ituri study
    // area of 7,759 vertices, applied into a device already holding North Kivu's 16,547.
    lastSaveFailure={name:(error as Error)?.name||'Error',
      bytes:(()=>{try{return JSON.stringify(dehydrateWorkflow(workflow,()=>true)).length;}catch{return 0;}})()};
    forgetSavedWorkflows();for(const [key,value] of previous){try{if(localStorage.getItem(key)!==value){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}}catch{/* Storage may be unavailable even for rollback. Keep the editor draft open. */}}$('#save-status').textContent='Storage unavailable — export to keep';return false;}
}
/** Which published version of a worked example a saved workspace came from.
 *
 *  A saved workspace WINS over the template -- it must, or a practitioner's edits would vanish
 *  on every visit. The cost is that republishing a worked example reaches nobody who has already
 *  opened it: the rulesets example was rebuilt on John Snow's data on 2026-10-16 and the
 *  practitioner, looking at the canvas, said *"I don't see the John Snow data sets"*. Their
 *  browser was holding the version from before, exactly as designed, and nothing in the
 *  application mentioned that a newer one existed. They found it by reloading the example, which
 *  is the one thing a reader has no reason to try.
 *
 *  So the version a workspace came from is recorded beside it, and a mismatch is SAID. Nothing
 *  is replaced: the edits stay until the practitioner asks for the published version, because
 *  discarding somebody's work to deliver news is not an improvement on withholding the news. */
const REVISIONS='fieldwork-example-revisions-v1';

/** THE WRITE-UP STORE: what each workflow's last run contributed, by workflow key.
 *
 *  Notes only, never a run's outputs -- see `src/write-up.ts` for why. Read tolerantly and
 *  written best-effort: a write-up is a convenience over runs that can be repeated, so a full
 *  store costs a re-run rather than the practitioner's work, and it must never fail a run. */
/** THE BUILD THIS PAGE IS RUNNING, for stamping the write-up and for telling a stale one apart.
 *
 *  Read from `build/asset-manifest.json`, which `build.mjs` writes with the same content hash the
 *  service worker names its cache after, and which is deliberately NOT in the precache list -- so
 *  this fetch reports the build ON DISK rather than the one the worker is serving. Undefined
 *  until it resolves, and undefined for ever if it cannot be read, in which case nothing is
 *  stamped and nothing is dropped: a write-up that cannot be checked is kept rather than thrown
 *  away. */
let runningBuild:string|undefined;
/** Declared as a function so it may be called before `currentView` is initialised; it reads it
 *  only when the manifest resolves, which is after this module has finished evaluating. */
function refreshNotesIfOpen(){if(currentView==='notes')renderNotesView();}
/** Charts drawn for the notes, by run and step: the SVG, a line while it is drawn, or empty where it could not be. */
const notesChartSvg=new Map<string,string>();
/** The write-up's maps, drawn off the page by the Results tab's renderer, by run and node. */
const notesMapSvg=new Map<string,string>();
void fetch('./build/asset-manifest.json',{cache:'no-store'})
  .then(r=>r.ok?r.json():null)
  .then(m=>{const id=m&&typeof m.cache==='string'?m.cache:undefined;
    if(id&&id!==runningBuild){runningBuild=id;refreshNotesIfOpen();}})
  .catch(()=>{/* Offline, or the manifest is absent. The write-up is kept unstamped. */});

function readWriteUpStore():WriteUp{
  try{return readWriteUp(localStorage.getItem(WRITE_UP_STORE),runningBuild);}catch{return {};}
}
/** THE RUNS THIS SESSION HAS MADE, by workflow, so a figure can be drawn from one.
 *
 *  IN MEMORY AND NEVER STORED, which is the same line `write-up.ts` draws for the same reason: a
 *  run holds geometry, rasters and street graphs, and six workflows of them would not fit in
 *  `localStorage` and would not belong there if they did. The words of a write-up are kept; the
 *  figures are redrawn from runs, and a workflow that has not run this session says so and offers
 *  the button rather than showing a stale picture.
 *
 *  Pruned to the project's own workflows on every run, so a project left open all afternoon holds
 *  that project's runs and not every run the session has ever made. */
const runsByWorkflow=new Map<string,{run:WorkflowRun; workflow:Workflow}>();

function rememberRunNotes(ran:Workflow,run:WorkflowRun):void{
  const key=storageKey(ran);
  if(!key)return;
  // THE WORKFLOW IS KEPT WITH THE RUN, because a map figure needs the `map_output` node's own
  // presentation -- its title, key and source note -- and those live on the node rather than in
  // the run. Reading them off the OPEN canvas would title another workflow's map with whatever
  // shares its node id here, which is the trap `labelOf` already exists for.
  runsByWorkflow.set(key,{run,workflow:ran});
  const entry=entryForRun(key,ran.name||key,run,
    id=>ran.nodes.find(node=>node.id===id)?.params.label,new Date().toISOString(),runningBuild);
  if(!entry)return;
  // A WORKFLOW THE PROJECT NO LONGER LISTS STOPS CONTRIBUTING. Nothing else would remove it, and
  // a deleted workflow going on writing into a publication is the kind of thing nobody notices
  // until a reader asks what a paragraph is doing there.
  const project=projectOfWorkflow(key,allProjects())
    ??(ran.projectId?projectById(ran.projectId,allProjects()):undefined);
  if(project?.workflows?.length){
    const keep=new Set(project.workflows);
    for(const held of [...runsByWorkflow.keys()])if(!keep.has(held))runsByWorkflow.delete(held);
  }
  try{
    localStorage.setItem(WRITE_UP_STORE,
      JSON.stringify(recordEntry(readWriteUpStore(),entry,project?.workflows)));
  }catch{/* Storage may be full. The run stands; the write-up shows this workflow from memory. */}
}
/** Stable over a template's shape: the nodes it has and how they are wired. A label or a
 *  coordinate changing is not worth interrupting anybody for; a workflow gaining two halves is. */
/** WHAT AN EXAMPLE IS, to compare a saved copy with the example as it ships: every step's settings and every connection,
 *  not only which steps there are (2026-11-13: an FETP demo met Hagelloch without its day-by-day replay and John Snow's
 *  geomasking without its donuts, from copies saved earlier on that computer; their steps and wiring were the example's,
 *  so nothing said they were behind). Positions are left out, and the data a step holds, which is kept apart by digest. */
const PAYLOAD_PARAMS=new Set(['data','dataRef','sourceTable','sourceRef','geometry','areaRef','revisions','search','searchRef','dictionary','dictionaryRef']);
function exampleRevision(w:Workflow){
  const settings=(params:unknown)=>JSON.stringify(Object.fromEntries(Object.entries((params??{}) as Record<string,unknown>)
    .filter(([k])=>!PAYLOAD_PARAMS.has(k)).sort(([a],[b])=>a.localeCompare(b))));
  const shape=w.nodes.map(n=>`${n.id}:${n.type}:${settings(n.params)}`).sort().join(',')
    +'|'+w.edges.map(e=>`${e.from}>${e.to}:${e.port}`).sort().join(',');
  let hash=5381;
  for(let i=0;i<shape.length;i++)hash=((hash*33)^shape.charCodeAt(i))>>>0;
  return hash.toString(36);
}
function readRevisions():Record<string,string>{
  try{return JSON.parse(localStorage.getItem(REVISIONS)||'{}');}catch{return {};}
}
/** HAS THIS CANVAS STOPPED BEING THE EXAMPLE IT STARTED AS?
 *
 *  The practitioner, 2026-10-23, twice, looking at a canvas holding a study area, a WorldPop
 *  raster, a clipped raster, a street network, health facilities and a map, under a caption
 *  telling them to draw and run a rule: *"The text 'Experiment 01 · draw → inspect facts → run the
 *  rule' before the Reset Layout button seems to be stale content."* ... *"And I am still seeing
 *  this text."*
 *
 *  It was. Four captions -- the example note, the canvas eyebrow, the project description and the
 *  footer context -- were set from the example KEY and never from the content, and `exampleKey`
 *  returns `blank` for any workflow carrying a projectId, so building anything at all left the
 *  instructions for Experiment 01 sitting over it. The one workspace designed to be built in was
 *  the one that went on describing itself as a scripted exercise.
 *
 *  `exampleRevision` already hashes the node and edge shape, for the republished-example notice,
 *  so the comparison is a hash against a hash. The template is built once per key and kept,
 *  because `render` runs often and some of these carry data. */
const publishedShape=new Map<string,number|string>();
function divergedFromExample(key:string):boolean{
  if(!workflow.nodes.length)return false;
  if(!publishedShape.has(key)){
    try{publishedShape.set(key,publishedRevision(key));}
    catch{return false;}   // no template to compare against, so nothing is claimed
  }
  return publishedShape.get(key)!==exampleRevision(workflow);
}
/** The example as it ships, as a saved copy holds it: through the same reading a saved copy goes through. */
const publishedRevision=(key:string)=>exampleRevision(validateWorkflow(structuredClone(template(key))));
function recordRevision(key:string){
  try{const now=publishedRevision(key);
    localStorage.setItem(REVISIONS,JSON.stringify({...readRevisions(),[key]:now}));
    // AND THAT THIS COPY IS THE EXAMPLE UNCHANGED, so it can follow the example when the example moves on.
    localStorage.setItem(PRISTINE,JSON.stringify({...readPristine(),[key]:now}));}
  catch{/* storage refused; the notice simply reappears next time, which is harmless */}
}
const PRISTINE='fieldwork-example-pristine-v1';
function readPristine():Record<string,string>{try{return JSON.parse(localStorage.getItem(PRISTINE)||'{}');}catch{return {};}}
/** A COPY NOBODY CHANGED FOLLOWS ITS EXAMPLE (2026-11-13): opened, a saved copy that is still the example as it was loaded
 *  is replaced by the example as it ships now, and says so. A copy somebody changed is kept, and the bar says the example
 *  has moved on. True when it replaced the copy. */
function followIfUntouched(key:string):boolean{
  if(!isExampleKey(key)||key==='blank')return false;
  const loaded=readPristine()[key];
  let now:string;try{now=publishedRevision(key);}catch{return false;}
  if(!loaded||loaded===now||exampleRevision(workflow)!==loaded)return false;
  // NOT DURING A RUN: an example starts running as it opens, and a workflow is not replaced under a run.
  const replace=()=>{if(busy){setTimeout(replace,500);return;}if(exampleKey(workflow)===key)loadPublished(key);};
  replace();
  toast('This example has been updated since it was last opened here, and nothing in it had been changed: it now opens as it ships.',{tone:'notice'});
  return true;
}
/** LOAD THE EXAMPLE AS IT SHIPS NOW, replacing this copy: from the note under the toolbar, and from the notice. */
function loadPublished(key:string){
  const replaced=change(w=>{replaceWorkflow(w,template(key));selected=null;});
  if(replaced===false)return;
  recordRevision(key);
  result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};
  renderResults();renderLibrary($('#node-search').value);render();
  setTimeout(()=>flow?.fit(),80);
  $('#toast').classList.remove('visible');
  if(canAutoRun(workflow))run();
}
/** WHICH IS TRUE OF A SAVED COPY (the practitioner, 2026-11-12: Hagelloch's cluster workflow lacked the day-by-day
 *  replay, added to the example after the copy was saved, and the bar said only "changed since"): the example moved on,
 *  the copy was edited, or, for a copy saved before revisions were kept, only that it differs from the example now. */
function exampleStanding(key:string):'same'|'updated'|'edited'|'differs'{
  if(!isExampleKey(key)||key==='blank'||!divergedFromExample(key))return 'same';
  const held=readRevisions()[key];
  let now:string;try{now=publishedRevision(key);}catch{return 'same';}
  if(held===undefined)return 'differs';
  return held!==now?'updated':'edited';
}
/** Says so when the published example has moved on, and offers to load it. */
function noticeIfRepublished(key:string){
  if(key==='blank')return;
  if(followIfUntouched(key))return;
  // A copy that IS the example as it ships is recorded as such and says nothing, whatever an older record held.
  if(!divergedFromExample(key)){recordRevision(key);return;}
  const held=readRevisions()[key];
  if(held===publishedRevision(key))return;
  toast('This worked example has been updated since this copy was made. Loading the updated example replaces this copy.',
    {tone:'warning',action:{label:'Load the updated example',run:()=>loadPublished(key)}});
}

/** A key that no worked example owns. `template()` falls through to the heat example for an
 *  unknown key and `exampleRevision` would then compare a practitioner's workflow against heat's
 *  shape and announce that their example had been republished. Neither is a hazard a worked
 *  example could reach -- the twelve keys are compiled in -- and both arrive the moment a
 *  practitioner's project mints a key of its own. */
const isExampleKey=(key:string):boolean=>!key.includes('/');
/** Opens a workflow, and hands back the run it starts so a caller can wait for it.
 *
 *  It already started one; it simply never returned it, so nothing could sequence several. Added
 *  2026-10-30 for *Run the rest*, which assembles a project's write-up by running the workflows
 *  that have not contributed. Every existing caller ignores the promise and behaves as before. */
function loadExample(key:string):Promise<void>{if(busy)return Promise.resolve();
  // A KEY WITH NOTHING UNDER IT is not a workflow, and this used to leave the canvas exactly where
  // it was and say nothing -- the row looked selectable and did nothing. Reported 2026-10-21:
  // *"test-project/w*, and *-template workflows I find in the list do not load at all on canvas"*.
  if(!isExampleKey(key)&&!Object.hasOwn(readSavedWorkflows(),key)){
    const removed=pruneGhostWorkflows();
    renderProjectOptions();render();
    toast(removed?'That row was a workflow registered in this project and never saved, so there is nothing to open. It has been removed from the list.'
      :'There is nothing saved under that workflow, so there is nothing to open.',{tone:'warning'});
    return Promise.resolve();
  }
  // A SAVED WORKFLOW THE APPLICATION REFUSES TO OPEN is a row that did nothing when chosen, which
  // is how one became unreachable AND undeletable. It now says what is wrong with it and offers
  // the one action left.
  if(!isExampleKey(key)){
    try{validateWorkflow(structuredClone(readSavedWorkflows()[key]));}
    catch(error){
      const why=errorMessage(error);
      renderProjectOptions();render();
      toast(why.startsWith('Shared input data is missing')?why:`That workflow could not be opened: ${why}`,
        {tone:'failure',action:{label:'Delete it',run:()=>deleteWorkflow(key)}});
      return Promise.resolve();
    }
  }
  save();let fromTemplate=true;try{const saved=readSavedWorkflows()[key];fromTemplate=!saved;workflow=saved?validateWorkflow(structuredClone(saved)):isExampleKey(key)?template(key):workflow;}catch(error){if(errorMessage(error).startsWith('Shared input data is missing')){toast(errorMessage(error),{tone:'failure'});return Promise.resolve();}if(isExampleKey(key))workflow=template(key);}if(!isExampleKey(key)){/* nothing published to compare against */}else if(fromTemplate)recordRevision(key);else setTimeout(()=>noticeIfRepublished(key),400);selected=key==='snow-geoprivacy'?'move':key.startsWith('snow-')?'catchments':key==='raster'?'raster-input':key==='old-naledi'?'access':'criteria';result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};dirty=true;save();renderLibrary();renderResults();render();switchView('workflow');setTimeout(()=>flow?.fit(),80);return fillFetchedTables().then(()=>canAutoRun(workflow)&&key!=='blank'?run():undefined);}
/** Drop focus before the panel holding the focused control is rewritten.
 *
 *  Removing a focused input fires blur, and the blur handler re-renders underneath the removal
 *  in progress; Chromium refuses the innerHTML assignment with "the node to be removed is no
 *  longer a child of this node". Fixed in the ROLLBACK path on 2026-10-17 and found the same day,
 *  hours later, on the path where the edit SUCCEEDS -- by a test that types a UTM zone into the
 *  reachability step. A fix applied to one of two paths through the same hazard is the shape this
 *  repository keeps rediscovering; both are covered now.
 *
 *  Safe to call from inside an `onchange`: the element has already fired its change, so blurring
 *  it cannot fire another one. */
const dropFocus=()=>{(document.activeElement as HTMLElement|null)?.blur();};
// THE COLUMNS ON A TABLE DO NOT ALL COME FROM A TABLE INPUT. A rate or a case series emits a
// table of its own, and its key columns are declared by the widget that emits it rather than by
// anything in the workflow -- a run would show them, but a practitioner picks the column BEFORE
// the run. Offering only a table_input's keys is what left the area join's column control saying
// "Connect a table first" with a table plainly connected (South London choropleth, 2026-10-25).
/** The value field of the table a node reads, through the steps that pass a table on unchanged in shape. */
/** THE PORT A STEP READS ITS TABLE ON: `records`, except Apply ruleset, whose ports are its ruleset's. */
const tablePortOf=(node:WorkflowNode)=>node.type==='apply_ruleset'
  ?workflow.edges.find(e=>e.to===node.id)?.port??'records':'records';
/** WHAT RULES ADD TO A TABLE, knowable without a run (experiment 188): each computed column's name, and each
 *  category's column. On a wide table a computed value is one more value of its measure column; on a long one, a column. */
function rulesAdd(node:WorkflowNode):{computed:string[]; categories:string[]; wideMeasure?:string}{
  if(node.type!=='apply_ruleset'||!node.params.authored)return {computed:[],categories:[]};
  const then=node.params.authored.rules.flatMap(r=>r.then);
  const computed=[...new Set(then.filter(c=>c.compute).map(c=>c.column?.trim()||c.predicate.slice(c.predicate.indexOf(':')+1)))];
  const categories=[...new Set(then.filter(c=>!c.compute).map(c=>c.predicate.slice(c.predicate.indexOf(':')+1)))];
  const input=tableOnPort(workflow,node.id,tablePortOf(node));
  return {computed,categories,...(input?.wide?{wideMeasure:input.wide.measureKey}:{})};
}
function upstreamValueField(node:WorkflowNode,seen=new Set<string>()):string|undefined{
  const edge=workflow.edges.find(e=>e.to===node.id&&e.port===tablePortOf(node));
  return valueFieldOf(edge?workflow.nodes.find(m=>m.id===edge.from):undefined,seen);
}
/** The value column a step's own output carries, as far as its settings say, before any run. */
function valueFieldOf(up:WorkflowNode|undefined,seen=new Set<string>()):string|undefined{
  if(!up||seen.has(up.id))return undefined;
  seen.add(up.id);
  if(up.type==='table_input')return up.params.data.valueField||up.params.valueField||undefined;
  if(up.type==='measure_distance')return 'distance';
  if(up.type==='detect_unusual_counts')return 'value';
  if(['select_rows','relate_table','append_rows','apply_ruleset','transmission_chains'].includes(up.type))return upstreamValueField(up,seen);
  // A COUNT IS NAMED "rows"; a sum, a mean or an extremum keeps the name of what it summarised (group-table.ts). Found
  // 2026-11-09: a Rate after Relate after a count was offered every column but the count.
  if(up.type==='group_table')return up.params.aggregate==='count'?'rows':up.params.total||upstreamValueField(up,seen);
  return undefined;
}
function tableKeyColumns(node:WorkflowNode|undefined,seen=new Set<string>()):readonly string[]{
  if(!node||seen.has(node.id))return [];
  seen.add(node.id);
  switch(node.type){
    case 'table_input':return node.params.data.keys;
    case 'rate':return RATE_TABLE_KEYS;
    case 'case_series':return SERIES_TABLE_KEYS;
    case 'measure_distance':return Object.keys(distancesColumns(node));
    // PASS-THROUGHS, which keep the columns of the table they read. Found 2026-11-02 joining Nigeria's
    // change in coverage: the same "Connect a table first", past a select, over a connected table.
    case 'select_rows':{
      const up=workflow.edges.find(e=>e.to===node.id&&e.port==='records');
      return tableKeyColumns(up?workflow.nodes.find(m=>m.id===up.from):undefined,seen);}
    // RULES ADD COLUMNS: each category, and on a long table each computed value (experiment 188).
    case 'apply_ruleset':{
      const up=workflow.edges.find(e=>e.to===node.id);
      const below=tableKeyColumns(up?workflow.nodes.find(m=>m.id===up.from):undefined,seen);
      if(!below.length)return below;
      const added=rulesAdd(node);
      return [...new Set([...below,...added.categories,...(added.wideMeasure?[]:added.computed)])];}
    // APPENDING KEEPS EVERY COLUMN EITHER TABLE HAS, and the source column if one is named.
    case 'append_rows':{
      const of=(port:string)=>{const up=workflow.edges.find(e=>e.to===node.id&&e.port===port);
        return tableKeyColumns(up?workflow.nodes.find(m=>m.id===up.from):undefined,new Set(seen));};
      const source=node.params.nameSource?node.params.sourceColumn?.trim():undefined,key=node.params.newKey?.trim();
      return [...new Set([...(key?[key]:[]),...Array.from({length:appendTableCount(node.params)},(_,i)=>of(appendPort(i))).flat(),...(source?[source]:[])])];}
    // THE PERIODS, THE SERIES AND THE MEASURE (2026-11-21): what Detect unusual counts hands on.
    case 'detect_unusual_counts':return [node.params.timeField,...(node.params.groupField?[node.params.groupField]:[]),'measure'].filter(Boolean);
    // EACH CASE'S CHAIN, added to every column it had (experiment 216).
    case 'transmission_chains':{const up=workflow.edges.find(e=>e.to===node.id&&e.port==='records');
      return [...tableKeyColumns(up?workflow.nodes.find(m=>m.id===up.from):undefined,new Set(seen)),...CHAIN_COLUMNS];}
    case 'group_table':return node.params.by;
    // A REGRESSION'S TABLE is always its terms by its statistics (experiment 181).
    // With several exposure columns (experiment 185), one table of every model: the keys `regressionsTable` writes.
    case 'regression':return severalModelKeys(node.params)??['term','statistic'];
    // A LAYER ON A TABLE PORT is its attributes, known from the last run (2026-11-15).
    default:return outputOf(node)==='polygons'||outputOf(node)==='points'?result?.tables?.[node.id]?.keys??[]:[];
  }
}

/** THE SHIFT IN A COLUMN'S NAME, as Relate's `shiftColumnName` writes it: `LST_Day_1km_+3d` is 3. Read off the name
 *  because an Inspector has no run to read `columnShifts` from. */
const columnShiftOf=(column:string)=>column.match(/_([+-]?\d+)d$/)?.[1]?.replace(/^\+/,'');
/** The key columns of a Regression fitting one model per column, or null when it fits one model. */
function severalModelKeys(p:{exposureColumns?:string[]}):string[]|null{
  if((p.exposureColumns?.length??0)<2)return null;
  return ['exposure',...(p.exposureColumns!.some(c=>columnShiftOf(c)!==undefined)?['shift_days']:[]),'role','term','statistic'];
}

/** The distinct values of each key column of the table reaching this node, where they are
 *  knowable without a run.
 *
 *  Same honesty as `rateGroupsFor`: a widget DECLARES its key columns, so those can always be
 *  named, but the VALUES in a column are whatever the file holds. They can be offered when the
 *  chain ends in an imported table this canvas carries, and the chain is walked rather than
 *  stopped at the first step, because deriving a value and then keeping rows is the ordinary
 *  pair -- the step that keeps rows needs to offer the value the step before it derived, and
 *  that value exists nowhere but on that step's own parameters until a run happens.
 */
/** The unit of the table reaching an output, where it can be known without a run.
 *
 *  A table that states one is already saying its values count the same thing, so asserting it
 *  again at the output would be a second control for a claim the table has already made.
 *  Deriving a value and selecting rows both pass the unit through unchanged, so the walk goes
 *  up the chain to whatever imported the table. */
function tableUnitFor(output:WorkflowNode):string|undefined{
  const walk=(node:WorkflowNode|undefined,port:string,seen:Set<string>):string|undefined=>{
    const edge=workflow.edges.find(e=>e.to===node?.id&&e.port===port);
    const up=edge?workflow.nodes.find(m=>m.id===edge.from):undefined;
    if(!up||seen.has(up.id))return undefined;
    seen.add(up.id);
    if(up.type==='table_input')return up.params.data.unit?.trim()||undefined;
    // relate_table and group_table pass the unit through too: relating adds a key column and
    // totalling adds up values already in the unit, so neither changes what the numbers count.
    // A total of a key column carries no unit: the unit declared is the value column's.
    if(up.type==='group_table'&&up.params.total)return undefined;
    if(up.type==='select_rows'||up.type==='relate_table'||up.type==='append_rows'
      ||up.type==='group_table'||up.type==='two_by_two'||up.type==='transmission_chains')return walk(up,'records',seen);
    if(up.type==='apply_ruleset')return walk(up,tablePortOf(up),seen);
    return undefined;
  };
  return walk(output,'table',new Set());
}

/** `port` so a widget with TWO table inputs can ask about either one: `relate_table` needs the
 *  columns of the table being read from as well as the table being added to, and they are
 *  different questions with different answers. */
/** A column someone declared a key is not an exposure, whatever it holds. Experiment 164. */
function withoutDeclaredKeys(node:WorkflowNode,values:Record<string,string[]>):Record<string,string[]>{
  const edge=workflow.edges.find(e=>e.to===node.id&&e.port==='records');
  const up=edge?workflow.nodes.find(m=>m.id===edge.from):undefined;
  if(up?.type!=='table_input')return values;
  const declared=new Set([...(up.params.data.primaryKey??[]),...(up.params.data.secondaryKeys??[])]);
  return Object.fromEntries(Object.entries(values).filter(([name])=>!declared.has(name)));
}
/** How many rows reach this node, where the table is connected directly. */
function upstreamRows(node:WorkflowNode):number|undefined{
  const edge=workflow.edges.find(e=>e.to===node.id&&e.port==='records');
  const up=edge?workflow.nodes.find(m=>m.id===edge.from):undefined;
  return up?.type==='table_input'?up.params.data.rows.length:undefined;
}
/** The product a sampler's files are of: its search's, which is its Find satellite products' choice. */
/** THE STEP IN PROGRESS: a panel with the step, the count and a bar, for files read (2026-11-06), models fitted and a run's steps (2026-11-12). */
let runProgress:import('./run-progress.js').RunDetail|null=null;
let runStartedAt=0;
/** THE FRAME A STATIC PLOT WAS DRAWN IN, read from its own background (2026-11-12): 850 wide, as tall as its area needs. */
const frameBoxOf=(content:string):string=>`0 0 850 ${/<rect width="850" height="(\d+)"/.exec(content)?.[1]??'295'}`;
/** AND ON SCREEN AT ITS OWN PROPORTIONS: a frame taller than the strip is drawn the full width of the panel and as tall as its
 *  shape, the panel scrolling if need be, rather than shrunk into the strip's height, which drew a tall area smaller than
 *  before. A frame of the strip's height keeps the panel's own sizing. */
function applyFrame(svg:SVGSVGElement,content:string):void{
  const box=frameBoxOf(content),height=Number(box.split(' ')[3]);
  svg.setAttribute('viewBox',box);
  if(height>295){svg.style.aspectRatio=`850 / ${height}`;svg.style.height='auto';svg.style.width='100%';svg.style.flex='0 0 auto';svg.style.maxHeight='none';}
  else for(const key of ['aspectRatio','height','width','flex','maxHeight'] as const)svg.style[key]='';
}
function drawRunProgress(){
  let panel=document.getElementById('run-progress');
  if(!busy||!runProgress){panel?.remove();return;}
  // A RUN'S OWN STEP COUNT waits a second, so a quick run does not flash a panel; a step's own progress shows at once.
  const waited=performance.now()-runStartedAt;
  if(runProgress.what==='steps'&&waited<1000){panel?.remove();setTimeout(drawRunProgress,1000-waited);return;}
  if(!panel){panel=document.createElement('div');panel.id='run-progress';panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');document.body.append(panel);}
  const {label,done,of,what,verb='Reading'}=runProgress,share=of?done/of:0;
  panel.innerHTML=`<span class="run-progress-spinner" aria-hidden="true"></span><div><strong>${esc(label)}</strong>`
    +`<span>${esc(verb)} ${esc(what)}: ${done.toLocaleString('en-US')} of ${of.toLocaleString('en-US')}</span>`
    +`<div class="run-progress-bar"><div style="width:${(share*100).toFixed(1)}%"></div></div></div>`;
  const state=document.getElementById('workflow-state');
  if(state)state.textContent=`Running · ${done} of ${of} ${what}`;
}
/** THE WIDGETS WHOSE INSPECTOR FOLLOWS THE STANDARD (experiment 186): Name, Inputs, Settings, Result, the links,
 *  Actions, in that order and nothing else, with every setting in the widget's configuration dialog. One at a time,
 *  Relate first; the set grows as each widget is moved, and a check holds them to it. */
export const STANDARD_INSPECTOR=new Set<NodeType>(['line_input','search_satellite_catalog','find_satellite_products','transmission_chains','detect_unusual_counts','case_series','regression','point_input','chart_output','raster_input','sample_raster','measure_distance','table_output','relate_table','select_rows','table_input','find_health_facilities','group_table','apply_ruleset','map_output','deduplicate_points','rate','study_area','space_time_scan','map_image_input','two_by_two','append_rows','clip_raster','buffer_point','measure_area','clip_polygons','join_table_to_area','compare_point_sets','clip_points_to_area','summarize_points_to_polygon','summarize_hull','voronoi','isochrone','mean_center','donut_geomask','aggregate_points_to_h3_cell','reachable_nodes','network_input','travel_over_ground','map_terms_to_vocabulary']);
function samplerProduct(node:WorkflowNode){
  const up=(id:string,port:string)=>{const e=workflow.edges.find(x=>x.to===id&&x.port===port);return e?workflow.nodes.find(m=>m.id===e.from):undefined;};
  const search=up(node.id,'files'),find=search?up(search.id,'product'):undefined;
  return find?.type==='find_satellite_products'&&find.params.topic&&find.params.route?productFor(find.params.topic,find.params.route):null;
}
/** A DISTANCES RESULT READ AS A TABLE (experiment 197): its columns, known before a run from the candidates the search
 *  chooses among, so Relate can match `nearest_site_id` to a projection's `site_id` straight away. */
function distancesColumns(up:WorkflowNode):Record<string,string[]>{
  const layer=(port:string)=>{const e=workflow.edges.find(x=>x.to===up.id&&x.port===port);return e&&workflow.nodes.find(m=>m.id===e.from);};
  const held:Record<string,string[]>={point_id:[]};
  for(const [k,values] of Object.entries(pointLayerColumns(layer('points'))))held[`point_${k}`]=values;
  held.nearest_id=pointLayerIds(layer('candidates'));
  for(const [k,values] of Object.entries(pointLayerColumns(layer('candidates'))))held[`nearest_${k}`]=values;
  return held;
}
/** THE ATTRIBUTES A POINT LAYER CARRIES, known before a run: a point layer's own, a retrieval's, and each attribute a
 *  Sample raster after them writes, followed back through the chain. Values where the layer holds them. */
function pointLayerColumns(node:WorkflowNode|undefined,seen=new Set<string>()):Record<string,string[]>{
  if(!node||seen.has(node.id))return {};
  seen.add(node.id);
  const of=(features:readonly {properties?:Record<string,unknown>|null}[])=>{const out:Record<string,string[]>={};
    for(const f of features)for(const [k,v] of Object.entries(f.properties??{}))out[k]=[...new Set([...(out[k]??[]),String(v??'')])].slice(0,200);
    return out;};
  if(node.type==='point_input')return of(node.params.data.features);
  if(node.type==='find_health_facilities')return of(node.params.data?.features??[]);
  if(node.type==='sample_raster'){
    const e=workflow.edges.find(x=>x.to===node.id&&x.port==='points');
    const below=pointLayerColumns(e&&workflow.nodes.find(m=>m.id===e.from),seen);
    const name=node.params.attribute?.trim();
    return name?{...below,[name]:[]}:below;
  }
  return {};
}
function pointLayerIds(node:WorkflowNode|undefined,seen=new Set<string>()):string[]{
  if(!node||seen.has(node.id))return [];
  seen.add(node.id);
  if(node.type==='point_input')return node.params.data.features.map(f=>String(f.id??''));
  if(node.type==='find_health_facilities')return (node.params.data?.features??[]).map(f=>String(f.id??''));
  if(node.type==='sample_raster'){const e=workflow.edges.find(x=>x.to===node.id&&x.port==='points');return pointLayerIds(e&&workflow.nodes.find(m=>m.id===e.from),seen);}
  return [];
}
function upstreamKeyValues(node:WorkflowNode,seen=new Set<string>(),
  port='records'):Record<string,string[]>|undefined{
  const edge=workflow.edges.find(e=>e.to===node.id&&e.port===port);
  const up=edge?workflow.nodes.find(m=>m.id===edge.from):undefined;
  if(!up||seen.has(up.id))return undefined;
  seen.add(up.id);
  // A POINT LAYER ON A TABLE PORT is its attributes as columns, with its ids (experiment 200): known before a run for a
  // layer that holds its points, from the last run for one that computes them.
  if(outputOf(up)==='points'){
    const columns=pointLayerColumns(up);
    if(Object.keys(columns).length)return {id:pointLayerIds(up),...columns};
    const ran=result?.tables?.[up.id];
    return ran?Object.fromEntries(ran.keys.map(key=>[key,[...new Set(ran.rows.map(row=>String(row.key[key]??'')))].slice(0,200)])):undefined;
  }
  // A POLYGON LAYER ON A TABLE PORT is its attributes, from the last run (2026-11-15).
  if(outputOf(up)==='polygons'){const ran=result?.tables?.[up.id];
    return ran?Object.fromEntries(ran.keys.map(key=>[key,[...new Set(ran.rows.map(row=>String(row.key[key]??'')))].slice(0,200)])):undefined;}
  if(up.type==='table_input'){
    const table=up.params.data;
    return Object.fromEntries(table.keys.map(key=>
      [key,[...new Set(table.rows.map(row=>String(row.key[key])))]]));
  }
  // EACH CASE'S CHAIN (experiment 216): the columns it was given, and four more whose values the last run knows.
  if(up.type==='transmission_chains'){
    const below=upstreamKeyValues(up,seen)??{};
    const ran=result?.tables?.[up.id];
    return {...below,...Object.fromEntries(CHAIN_COLUMNS.map(c=>[c,ran?[...new Set(ran.rows.map(r=>String(r.key[c]??'')))].slice(0,200):[]]))};
  }
  if(up.type==='select_rows'){
    const below=upstreamKeyValues(up,seen);
    if(!below)return undefined;
    const range=up.params.range,held=below[up.params.keyColumn];
    if(range&&held){
      const order=orderOf(held);
      return order?{...below,[up.params.keyColumn]:held.filter(value=>inRange(value,order,range.from.trim(),range.to.trim()))}:below;
    }
    const kept=up.params.values.filter(value=>value.trim());
    if(up.params.leaveOut){const out=new Set(kept),held=below[up.params.keyColumn];
      return held?{...below,[up.params.keyColumn]:held.filter(value=>!out.has(value))}:below;}
    return kept.length?{...below,[up.params.keyColumn]:kept}:below;
  }
  // A COMPUTED VALUE ON A WIDE TABLE is one more value of its measure column, which the step after it can choose, as
  // Derive a value's was (experiment 188). On a long table it is a column, whose values only a run knows.
  if(up.type==='apply_ruleset'){
    const below=upstreamKeyValues(up,seen,tablePortOf(up));
    if(!below)return undefined;
    const added=rulesAdd(up);
    const measure=added.wideMeasure;
    return {...below,...(measure?{[measure]:[...new Set([...(below[measure]??[]),...added.computed])]}
      :Object.fromEntries(added.computed.map(c=>[c,[]]))),
      ...Object.fromEntries(added.categories.map(c=>[c,[]]))};
  }
  if(up.type==='append_rows'){
    const count=appendTableCount(up.params);
    const each=Array.from({length:count},(_,i)=>upstreamKeyValues(up,new Set(seen),appendPort(i))??{});
    const merged:Record<string,string[]>={};
    for(const [name,values] of each.flatMap(held=>Object.entries(held)))
      merged[name]=[...new Set([...(merged[name]??[]),...values])];
    const source=up.params.nameSource?up.params.sourceColumn?.trim():undefined;
    if(source)merged[source]=Array.from({length:count},(_,i)=>appendLabel(up.params,i));
    return Object.keys(merged).length?merged:undefined;
  }
  // A REGRESSION'S COLUMNS ARE KNOWN BEFORE IT RUNS: its terms by its statistics. A numeric variable's term is its
  // column; a categorical one's levels are known only from the data, so they are not offered here (experiment 181).
  if(up.type==='regression'){
    const p=up.params,level=p.level??95;
    const several=(p.exposureColumns?.length??0)>1?p.exposureColumns!:null;
    const terms=[...(several??[p.exposure.column]).map(column=>({...p.exposure,column})),...p.adjust]
      .filter(v=>v.column&&v.as==='numeric').map(v=>v.column);
    const statistic=[p.family==='logistic'?'odds ratio':'rate ratio',`lower ${level}%`,`upper ${level}%`,'p'];
    if(!several)return {term:terms,statistic};
    // ONE MODEL PER COLUMN (experiment 185): the exposure is a key, and the shift where Relate named one.
    const shifted=severalModelKeys(p)!.includes('shift_days');
    return {exposure:several,...(shifted?{shift_days:several.map(c=>columnShiftOf(c)??'')}:{}),
      role:['exposure','adjusted for'],term:terms,statistic};
  }
  // RELATING ADDS A COLUMN, and the values it will hold are the ones the second table holds --
  // read from THAT table rather than guessed, which is the same discipline as reading the
  // operands of a derived value off the column they come from.
  if(up.type==='relate_table'){
    const below=upstreamKeyValues(up,seen);
    if(!below)return undefined;
    const brought=up.params.bring.trim();
    const other=upstreamKeyValues(up,new Set(seen),'related');
    // SEVERAL SHIFTS (experiment 185) bring one column per shift and none of a single shift's helper columns, as
    // `relateAtShifts` does. Found 2026-11-07 by the Regression beside it: these were read as the single-shift columns.
    if(brought&&(up.params.shifts?.length??0)>1)
      return {...below,...Object.fromEntries(up.params.shifts!.map(d=>[shiftColumnName(brought,d),other?.[brought]??[]]))};
    // A DATE MATCHED WITHIN A PERIOD adds the shifted date and the period's start to every row (experiment 180).
    const w=up.params.within;
    const shiftedAs=(()=>{if(!w)return '';let name=`${w.date}_shifted`,k=1;while(name in below)name=`${w.date}_shifted_${++k}`;return name;})();
    const period=w?{...(up.params.shiftDays?{[shiftedAs]:[]}:{}),[w.start in below?`${w.start}_matched`:w.start]:other?.[w.start]??[]}:{};
    if(!brought)return {...below,...period};
    // UNDER THE NAME IT IS WRITTEN AS, and with the label unmatched rows carry (2026-11-14: a column brought as
    // "secondary_cases" was offered downstream, before a run, as "rows").
    const as=up.params.bringAs?.trim()||brought,label=up.params.unmatched?.decision==='keep'?up.params.unmatched.label?.trim():'';
    const values=[...(other?.[brought]??[])];if(label&&!values.includes(label))values.push(label);
    return {...below,...period,[as]:values};
  }
  // A SATELLITE SAMPLE'S COLUMNS ARE KNOWN BEFORE IT RUNS: its fixed ones, with the id column named as the points'
  // source table names it, the ids read from that table and the days from the search. So a join downstream can be set
  // up before the files are read, which takes minutes (2026-11-05, experiment 179).
  if(up.type==='sample_raster'&&up.params.source==='satellite-files'){
    // A GRIDDED PRODUCT, or areas: the area table's fixed columns, with the place column as named (experiment 180).
    const grid=samplerProduct(up);
    const overAreas=workflow.edges.some(e=>e.to===up.id&&(e.port==='areas'||e.port==='area'));
    if(overAreas||(grid&&gridReaderFor(grid))){
      const column=(up.params as {placeColumn?:string}).placeColumn?.trim()||(overAreas?'area':'point_id');
      return Object.fromEntries(GRID_KEYS.map(k=>[k==='area'?column:k,[]]));
    }
    const pointEdge=workflow.edges.find(e=>e.to===up.id&&e.port==='points');
    const points=pointEdge?workflow.nodes.find(m=>m.id===pointEdge.from):undefined;
    const fromTable=points?.type==='point_input'?points.params.fromTable:undefined;
    const idColumn=fromTable?.id&&!(SAMPLE_KEYS as readonly string[]).includes(fromTable.id)?fromTable.id:'point_id';
    const ids=points&&fromTable?.id?upstreamKeyValues(points,new Set(seen))?.[fromTable.id]??[]:[];
    const fileEdge=workflow.edges.find(e=>e.to===up.id&&e.port==='files');
    const search=fileEdge?workflow.nodes.find(m=>m.id===fileEdge.from):undefined;
    const span=search?.type==='search_satellite_catalog'&&search.params.from?sampleDays(search.params.from,search.params.until||search.params.from):[];
    return Object.fromEntries(SAMPLE_KEYS.map(k=>k==='point_id'?[idColumn,ids]:[k,k==='date'?span:[]]));
  }
  if(up.type==='measure_distance')return distancesColumns(up);
  // Totalling DROPS the columns not kept, so offering them downstream would offer a column that
  // is no longer there.
  if(up.type==='group_table'){
    const below=upstreamKeyValues(up,seen);
    if(!below)return undefined;
    const kept=up.params.by.filter(name=>name.trim());
    return kept.length?Object.fromEntries(kept.filter(name=>name in below)
      .map(name=>[name,below[name]])):below;
  }
  // ANY OTHER STEP THAT MADE A TABLE, from the last run (2026-11-21): Detect unusual counts' measures, Cases by period's
  // periods, read as the run left them, so Select rows after them is offered their columns and values.
  const ran=result?.tables?.[up.id];
  if(ran)return Object.fromEntries(ran.keys.map(key=>[key,[...new Set(ran.rows.map(row=>String(row.key[key]??'')))].slice(0,200)]));
  return undefined;
}

/** WHEN NO RUN IS GOING. An edit is refused during a run, so a dialog that saves after a person pressed Save waits for
 *  the run instead of failing: Hagelloch runs itself on open, and Describe columns saved while it ran said "The
 *  descriptions could not be saved" (gate 146, 2026-11-13). */
const runFinished=():Promise<void>=>new Promise(resolve=>{const wait=()=>busy?setTimeout(wait,200):resolve();wait();});
function change(fn:(w:Workflow)=>void,{spatial=true,requirePersistence=false}={}){if(busy)return false;const previous=structuredClone(workflow);const heldPayloads=heldPayloadsOf(workflow);try{fn(workflow);reconcilePayloadRefs(heldPayloads,workflow);syncProjectManifest(workflow,true);workflow=validateWorkflow(workflow);const persisted=save();if(requirePersistence&&!persisted){const bytes=JSON.stringify(workflow).length;workflow=previous;dropFocus();render();toast(storageRefusal(bytes),{tone:'failure'});return false;}history.push(previous);if(history.length>40)history.shift();future=[];if(spatial){dirty=true;runFailed=false;statuses={};}
  // A WORKFLOW NOT READY TO RUN IS CHECKED AGAIN ON EACH CHANGE (2026-11-20): the message saying what was missing stayed
  // on screen after the practitioner had connected it. Now it goes, and "Not ready to run" with it, once nothing is missing.
  if(runIncomplete){try{executionPlan(workflow);runIncomplete=false;if(incompleteShown){$('#toast').classList.remove('visible');incompleteShown=false;}}
    catch(e){if(incompleteShown&&e instanceof IncompleteWorkflow)showIncomplete(e);}}
  dropFocus();render();return persisted;}catch(e){
  // The edit is rolled back and the panel is rewritten -- WHILE the control that made the edit
  // still holds focus. Chromium throws "The node to be removed is no longer a child of this
  // node. Perhaps it was moved in a 'blur' event handler?" from the innerHTML assignment,
  // because removing the focused input fires blur, and the blur handler re-renders underneath
  // the removal in progress. Found on 2026-10-17 by a test that clears a setting the workflow
  // requires: any refused edit typed into a field could raise it. Dropping focus first makes
  // the blur run to completion before anything is replaced.
  // IN THE FAILURE TONE, because this is always a failure. A refused edit announced itself in the
  // same green as "saved on this device": the practitioner read *"I got a GREEN toast that says
  // Invalid or oversized network or provenance"*, 2026-10-21, and green is what the application
  // says when something worked.
  workflow=previous;dropFocus();toast(errorMessage(e),{tone:'failure'});render();return false;}}
/** Which declared port a layer dropped on a map's "add a layer" port should bind to.
 *
 *  The map's one configurable port is type-free: the practitioner drops a result on it and this
 *  reads what that result EMITS to choose the port. Point layers take the first free slot, so a
 *  second point source lands on points_2 rather than replacing the first -- which is what
 *  pointInputCount has always created and what nothing let a practitioner reach by dragging. */
function layerPortFor(w:Workflow,source:WorkflowNode,target:WorkflowNode<'map_output'|'table_output'>):string|undefined{
  const type=outputOf(source);
  if(!type)return undefined;
  const taken=(port:string)=>w.edges.some(e=>e.to===target.id&&e.port===port);
  // `context` is points-typed and is not a point layer: it means "points drawn beside polygons".
  // Binding a second point source there because it happened to be free would quietly give the
  // layer a role the practitioner did not choose, and the role is what the renderer takes its
  // emphasis from. It stays available in its own picker and out of automatic binding.
  const declared=nodeInputs(target).filter(([port,portType])=>portType===type&&port!=='context').map(([port])=>port);
  const free=declared.find(port=>!taken(port));
  if(free)return free;
  // A table shows anything a table port reads (distances, a point layer's attributes) through that port.
  if(!declared.length&&target.type==='table_output'&&portAccepts('table',type))return 'table';
  // Every slot of that type is in use. Point layers can grow: pointInputCount creates them.
  if(type==='points'){
    const next=(target.params.pointInputCount??1)+1;
    if(next<=8){target.params.pointInputCount=next;return pointPort(next-1);}
  }
  // And a map's polygon layers, since Collect polygon layers retired (2026-11-13).
  if(type==='raster'&&target.type==='map_output'){
    const next=(target.params.rasterInputCount??1)+1;
    if(next<=MAX_RASTER_LAYERS){target.params.rasterInputCount=next;return rasterPort(next-1);}
  }
  // And its ground: two sheets of one place, each placed and cut on its own (TODO 35).
  if(type==='ground'&&target.type==='map_output'){
    const next=(target.params.groundInputCount??1)+1;
    if(next<=MAX_GROUND_LAYERS){target.params.groundInputCount=next;return groundPort(next-1);}
  }
  if(type==='polygons'&&target.type==='map_output'){
    const next=(target.params.polygonInputCount??1)+1;
    if(next<=MAX_POLYGON_LAYERS){target.params.polygonInputCount=next;return polygonPort(next-1);}
  }
  return declared[0];
}

/** WHICH INPUT A DROP ON THE BLANK PORT GOES TO, for every widget but Map and Table (whose `layerPortFor` grows their
 *  layers). Experiment 116's rule, 2026-10-15: bind when one input fits what arrives, ask when more than one does. Inputs
 *  of one kind with one job (points and points_2, area and area2) are one choice, filled in order. */
function inputFor(w:Workflow,source:WorkflowNode,target:WorkflowNode):{port?:string;choices?:string[]}{
  const kind=outputOf(source);
  const fits=[...new Set(nodeInputs(target).filter(([,type])=>portAccepts(type,kind)).map(([port])=>shownPort(target.type,port)))];
  if(!fits.length)return {};
  const taken=new Set(w.edges.filter(e=>e.to===target.id).map(e=>shownPort(target.type,e.port)));
  const free=fits.filter(port=>!taken.has(port));
  // EVERY INPUT THAT FITS IS TAKEN: the blank port refuses rather than replacing one (PR 10's review: a second point layer
  // dropped on Sample a raster's blank port replaced the first, though it said "Add an input: Raster"). Replacing is
  // done on the connected row itself. A polygon layer of study areas grows another input instead, as it always has.
  if(!free.length)return kind==='area'&&target.type==='polygon_input'&&polygonLayerGrows(target)?{port:fits[0]}:{};
  const oneEach=free.filter((port,i)=>free.findIndex(other=>portBase(other)===portBase(port))===i);
  return oneEach.length>1?{choices:oneEach}:{port:free[0]};
}
/** ASKED, WHEN THE KIND ALONE CANNOT SAY: Cases dropped on Measure distance is the From or the To. */
function chooseInput(source:WorkflowNode,target:WorkflowNode,choices:string[],chosen:(port:string)=>void){
  const dialog=document.createElement('dialog');dialog.className='choose-input';dialog.setAttribute('aria-labelledby','choose-input-title');
  const name=(node:WorkflowNode)=>node.params.label||TYPES[node.type].title;
  const said=(port:string)=>PORT_ROLES[target.type]?.[port]??PORT_NAMES[target.type]?.[port]??portLabel(port);
  dialog.innerHTML=`<h2 id="choose-input-title">${esc(name(source))} goes into ${esc(name(target))} as:</h2>`
    +`<div class="inspector-actions">${choices.map(port=>`<button type="button" class="button" data-port="${esc(port)}">${esc(said(port))}</button>`).join('')}`
    +`<button type="button" class="button" data-port="">Cancel</button></div>`;
  document.body.append(dialog);
  const close=()=>{dialog.close();dialog.remove();};
  dialog.addEventListener('cancel',close);
  for(const button of dialog.querySelectorAll<HTMLButtonElement>('button'))button.onclick=()=>{close();if(button.dataset.port)chosen(button.dataset.port);};
  dialog.showModal();
}
/** A CONNECTION MADE ON THE CANVAS: a drop on a blank port is bound, or asked about, before it is made. */
function connectOnCanvas(c:Connection){
  const source=workflow.nodes.find(n=>n.id===c.source),target=workflow.nodes.find(n=>n.id===c.target);
  if(!source||!target)return;
  const port=required(c.targetHandle);
  if(port!=='layer'||target.type==='map_output'||target.type==='table_output'){change(w=>setConnection(w,c.source,c.target,port));return;}
  const bound=inputFor(workflow,source,target);
  if(bound.choices)chooseInput(source,target,bound.choices,chosen=>change(w=>setConnection(w,c.source,c.target,chosen)));
  else if(bound.port){const chosen=bound.port;change(w=>setConnection(w,c.source,c.target,chosen));}
}
function setConnection(w:Workflow,from:string|null,to:string,port:string){
  const target=w.nodes.find(n=>n.id===to),map=['map_output','table_output'].includes(target?.type||'');
  // A GROUPED PORT (PORT_GROUPS) binds to the one of its ports the source fits, and replaces whatever else in the group was
  // connected: one raster or set of files, at one kind of place.
  if(target&&from&&PORT_GROUPS[target.type]){const source=w.nodes.find(n=>n.id===from);
    const chosen=source&&groupFor(target.type,port,p=>portAccepts(nodeInputs(target).find(([q])=>q===p)?.[1],outputOf(source)));
    if(chosen)port=chosen;}
  const group=target?PORT_GROUPS[target.type]?.[port]:undefined;
  if(group){
    w.edges=w.edges.filter(e=>!(e.to===to&&group.includes(e.port)));
    const source=from?w.nodes.find(n=>n.id===from):undefined;
    const bound=source?nodeInputs(target!).find(([p,type])=>group.includes(p)&&portAccepts(type,outputOf(source)))?.[0]:undefined;
    if(!bound)return;
    port=bound;
  }
  // ANOTHER STUDY AREA DROPPED ON A POLYGON LAYER takes the next area input (2026-11-22; the practitioner: "The polygon input
  // port also does not automatically take in more than one study area, but it does from the configuration dialog, which
  // adds friction"). Where the layer is made of study areas' parts, or reads nothing yet, a study area dropped on an input
  // another one holds goes to the next free one, a new one added when all are held, as a Map's layers do. A layer read
  // from a file or an extract keeps its one area: there the area is where to read, and a second would replace it.
  if(from&&target?.type==='polygon_input'&&/^area(_\d+)?$/.test(port)){
    const node=target as WorkflowNode<'polygon_input'>,source=w.nodes.find(n=>n.id===from);
    const holder=(p:string)=>w.edges.find(e=>e.to===to&&e.port===p);
    const reads=node.params.inputMethod==='extract'||(node.params.inputMethod!=='areas'&&!!node.params.data?.features?.length);
    const held=holder(port);
    if(source&&outputOf(source)==='area'&&held&&held.from!==from&&!reads){
      if(w.edges.some(e=>e.to===to&&e.from===from&&/^area(_\d+)?$/.test(e.port)))return;
      node.params.inputMethod='areas';
      const count=Math.max(1,node.params.areaInputCount??1);
      const free=Array.from({length:count},(_,i)=>i?`area_${i+1}`:'area').find(p=>!holder(p));
      if(free)port=free;
      else if(count<MAX_AREA_INPUTS){node.params.areaInputCount=count+1;port=`area_${count+1}`;}
      else{toast(`A polygon layer takes up to ${MAX_AREA_INPUTS} study areas.`,{tone:'warning'});return;}
    }
  }
  // The map's and the table's single "add" port binds to a declared one by what the source emits (Table, 2026-11-09).
  if(from&&port==='layer'&&(target?.type==='map_output'||target?.type==='table_output')){
    const source=w.nodes.find(n=>n.id===from);
    const bound=source&&layerPortFor(w,source,target as WorkflowNode<'map_output'|'table_output'>);
    if(!bound)return;
    port=bound;
  }
  // Connecting a raster used to set the map's mode AND drop every other connection, because a
  // raster map could show nothing else. A raster is a layer: it arrives and the others stay. The
  // renderer still draws one picture at a time -- see drawnMode -- so a raster wins the drawing
  // while the other layers remain wired and recorded. That limit is the drawing code's, and it is
  // no longer paid for by silently discarding a practitioner's connections.
  w.edges=w.edges.filter(e=>e.to!==to||e.port!==port);
  // WHAT THE UNION YIELDS follows what it is given, and the node records it so every reader of a
  // port type -- the connection offers, the canvas, the layer binding -- agrees without consulting
  // the edges. Set when an area is wired in, cleared when the last one goes.
  if(target?.type==='summarize_combined_area'){
    const areas=w.edges.some(e=>e.to===to&&(e.port==='area'||e.port==='area2'))
      ||(!!from&&(port==='area'||port==='area2'));
    const node=target as WorkflowNode<'summarize_combined_area'>;
    if(areas)node.params.yields='area';else delete node.params.yields;
  }
  // THE SAMPLER'S SOURCE AND PLACES follow what is connected (experiment 205): satellite files or a raster; points or
  // areas. Recorded on the node, so its output -- points, areas or a table -- is known before it runs.
  if(target?.type==='sample_raster'){
    const node=target as WorkflowNode<'sample_raster'>;
    const has=(p:string)=>w.edges.some(e=>e.to===to&&e.port===p)||(!!from&&port===p);
    if(has('files'))node.params.source='satellite-files';else if(has('raster'))node.params.source='raster';
    if(has('areas')||has('area'))node.params.over='areas';else if(has('points'))node.params.over='points';
  }
  if(from)w.edges.push({id:`e-${Date.now()}`,from,to,port});
  if(from&&port==='area'&&target?.type==='clip_raster'&&!target.params.cutline){
    try{const {boundary,node}=previewArea(w,to),geometry=boundary.type==='MultiPolygon'&&boundary.coordinates.length===1?{type:'Polygon' as const,coordinates:boundary.coordinates[0]}:boundary;target.params.cutline={geometry:structuredClone(validateDrawnGeometry(geometry)),selectionMode:node.params.source==='drawn'?node.params.selectionMode:'polygon'};}catch{/* An unfinished or complex boundary remains linked until a supported cutline is applied. */}
  }
}
/** Sites a widget could not connect, from the last completed run.
 *
 *  Read here rather than pushed at run time so the alert survives re-renders and stays attached to
 *  the widget that found it. A run that found nothing clears it, because `result` is replaced. */
function nodeAlert(id:string){return result?.alerts?.find(a=>a.nodeId===id);}
/** Canvas badges the practitioner has closed, keyed by the run that raised them.
 *
 *  A badge that cannot be dismissed covers the node it is about, and once it has been read it is
 *  in the way. Keyed by runId so the NEXT run raises it again: a finding that stays dismissed
 *  across runs would make the canvas quieter and less true, and the thing it is about may well
 *  have changed. The Inspector keeps the full alert either way, so closing the badge loses
 *  nothing -- which is what makes it safe to allow. */
const dismissedAlerts=new Set<string>();
const alertKey=(id:string)=>`${result?.runId??'none'}:${id}`;
const badgeFor=(id:string)=>dismissedAlerts.has(alertKey(id))?undefined:nodeAlert(id);
/** The two findings read differently, so they are said separately: one is an omission from the
 *  counts, the other an assumption inside them. Both are acted on the same way -- by looking at
 *  where the streets stop -- which is why they share one alert. */
/** One line naming every step whose records it could not read, or nothing when all was read.
 *
 *  Names the STEPS, because the practitioner's next action is to open one. The detail lives in
 *  the Inspector, where there is room for it and where the records themselves are a click away. */
function dataIssueNotice(run:WorkflowRun){
  const found=run.alerts.filter(a=>a.dataIssues?.length);
  if(!found.length)return '';
  // TWO DIFFERENT FINDINGS, counted apart (2026-11-08): a value the column could not be read as, and a cell that is
  // empty. "Could not be read" said of an empty cell overstated it: the three genuine gaps left after a repair were
  // still reported as unreadable.
  const count=(why:'missing'|'unreadable')=>found.reduce((n,a)=>n+(a.dataIssues??[]).filter(i=>i.why===why).reduce((m,i)=>m+i.count,0),0);
  const unreadable=count('unreadable'),missing=count('missing');
  const records=(n:number)=>`${n} record${n===1?'':'s'}`;
  const named=found.map(a=>{
    const node=run.outputs.find(o=>o.nodeId===a.nodeId);
    return node?.label||workflow.nodes.find(n=>n.id===a.nodeId)?.params.label||a.nodeId;
  });
  const said=[unreadable?`${records(unreadable)} could not be read as declared`:'',
    missing?`${records(missing)} ${missing===1?'has':'have'} no value`:''].filter(Boolean).join(', and ');
  return `${said.charAt(0).toUpperCase()+said.slice(1)}, in a column the rules read: ${named.join(', ')}. `
    +`The rules treated each as not recorded. Open the step to see which column, and how many.`;
}

function alertText(alert:NonNullable<ReturnType<typeof nodeAlert>>){
  const said=[];
  // Said first, because it changes how every number below it should be read: these records were
  // classified on the basis that a value was not there.
  if(alert.dataIssues?.length)said.push(
    `This step applied its rules to records whose values it could not read, and told the rules `
    +`they were not recorded. The result is complete and the conclusions for those records are `
    +`conclusions about an absence, which is not the same as a conclusion about a number.`);
  // Declaration gaps read differently from the catchment findings: nothing is wrong with the
  // numbers, and what is missing is what a reader would need to trust them. Said first and
  // separately, and never as a reason the result is unusable -- the practitioner's decision of
  // 2026-10-15 was that provenance is an alert and not a blocker.
  if(alert.gaps?.length)said.push(
    `${alert.gaps.length} thing${alert.gaps.length===1?' this step has'
      :'s this step has'} not declared. Every number here is computed and usable; what is missing is `
    +`what a reader would need in order to check where it came from. Fill the fields below, or `
    +`publish as it is and say that the source is undeclared.`);
  if(alert.unconnected.length)said.push(
    `${alert.unconnected.length} site${alert.unconnected.length===1?'':'s'} got no result at all: the leg to the nearest street alone spends the whole travel budget. Every count and area from this widget is over the sites that reached something.`);
  if(alert.offNetwork.length)said.push(
    `${alert.offNetwork.length} site${alert.offNetwork.length===1?'':'s'} started further from the network than the snap limit allows, and ${alert.offNetwork.length===1?'its route was':'their routes were'} charged a straight line to reach it. A straight line assumes ground that can be crossed at the declared speed, so ${alert.offNetwork.length===1?'that result reaches':'those results reach'} further here than on the ground.`);
  // Catchment advice, for catchment findings. It was pushed onto EVERY alert, so a step whose
  // only finding was an undeclared field was told to extend the street network -- and from
  // 2026-10-16 so was a step that could not read a column. Advice that does not fit what was
  // found teaches a reader to stop reading the advice.
  if(alert.unconnected.length||alert.offNetwork.length)
    said.push('Raise the snap limit or the travel time on this widget, extend the street network where it stops short, or accept what is listed and say so in what you publish.');
  if(alert.dataIssues?.length)
    said.push('Correct the column at its source, bind it to a kind the values actually are, or accept the count below and say in what you publish how many records it covers.');
  return said.join(' ');
}
/** Site, what happened to it, and the distance that decided it. One table, because a practitioner
 *  reading it is asking the same question of every row: where does the road data stop? */
function alertRows(alert:NonNullable<ReturnType<typeof nodeAlert>>){
  return [
    // WHAT HAPPENED, IN THE ONTOLOGY'S WORDS (experiment 207): the label each kind of data issue carries in the receipt.
    ...(alert.dataIssues??[]).map(issue=>({name:issue.field,
      outcome:ISSUE_LABEL[issue.why==='absent'?'FieldMissing':issue.why==='missing'?'ValueAbsent':'ValueUnreadable'],detail:issue.says})),
    ...(alert.gaps??[]).map(gap=>({name:gap.field,outcome:ISSUE_LABEL.DeclarationAbsent,detail:gap.says})),
    ...alert.unconnected.map(u=>({name:u.name,outcome:ISSUE_LABEL.SiteUnreachable,
      detail:`${Math.round(u.distanceM)} m to the nearest street, from a ${Math.round(u.budgetM)} m budget`})),
    ...alert.offNetwork.map(u=>({name:u.name,outcome:ISSUE_LABEL.RoutedOffNetwork,
      detail:`${Math.round(u.distanceM)} m charged as a straight line, past a ${u.limitM} m limit`})),
  ];
}
/** WHAT A RUN FOUND ON A STEP, IN FULL: the advice and every row, in the standard frame with one Close, wide enough that no
 *  column is cut off. Headed by what the rows are: columns the rules read, fields not declared, or sites. */
function openAlertDialog(n:WorkflowNode,alert:NonNullable<ReturnType<typeof nodeAlert>>,issuesOnly:boolean,gapsOnly:boolean){
  const sitesOnly=!alert.dataIssues?.length&&!alert.gaps?.length;
  const [first,third]=issuesOnly?['Column','What it means']:gapsOnly?['Field','What is missing']:sitesOnly?['Site','Distance']:['Column, field or site','Detail'];
  const heading=issuesOnly?'Read as not recorded':gapsOnly?'Not declared':'Out of bounds';
  openConfigDialog<Record<string,never>>({id:'alert-dialog',widget:heading,step:n.params.label||TYPES[n.type].title,draft:{},readOnly:true,wide:true,report:true,
    sections:()=>({settings:`<p><strong>${esc(alertHeadline(alert))}</strong></p><p>${esc(alertText(alert))}</p>`
      +`<table class="alert-table"><thead><tr><th>${first}</th><th>What happened</th><th>${third}</th></tr></thead><tbody>`
      +alertRows(alert).map(r=>`<tr><td>${esc(r.name)}</td><td>${esc(r.outcome)}</td><td>${esc(r.detail)}</td></tr>`).join('')+`</tbody></table>`}),
    wire:()=>{},apply:()=>{}},esc);
}
function alertHeadline(alert:NonNullable<ReturnType<typeof nodeAlert>>){
  const parts=[];
  // ONE COLUMN IN RECORDS, SEVERAL IN COLUMNS. Summing records across columns counted a record once per column it
  // lacked: MERS's 162 cases were "189 records the rules could not read" (2026-11-12).
  const unread=unreadHeadline(alert.dataIssues??[]);
  if(unread)parts.push(unread);
  if(alert.gaps?.length)parts.push(`${alert.gaps.length} undeclared`);
  if(alert.unconnected.length)parts.push(`${alert.unconnected.length} with no result`);
  if(alert.offNetwork.length)parts.push(`${alert.offNetwork.length} routed off-network`);
  return parts.join(' · ');
}
/** HOW MANY VERTICES A BOUNDARY HOLDS, for either geometry it may be.
 *
 *  This read `coordinates[0].length-1`, which counts a Polygon's outer ring and, on a
 *  MultiPolygon, counts the RINGS of its first part. South London's study area is 33 parts and
 *  2,182 vertices, and its node card read "Polygon \u00b7 0 vertices" -- one ring, minus the
 *  closing point. A count that is wrong by three orders of magnitude on the project's own worked
 *  example is worse than no count, because a practitioner reads it as a study area that failed
 *  to load.
 */
/** A POLYGON LAYER MADE OF STUDY AREAS TAKES ANOTHER, up to its limit, as `setConnection` grows it: so it keeps a blank
 *  port while it can. One read from a file or an extract keeps its one area, where the area says where to read. */
function polygonLayerGrows(n:WorkflowNode):boolean{
  if(n.type!=='polygon_input')return false;
  const node=n as WorkflowNode<'polygon_input'>;
  const reads=node.params.inputMethod==='extract'||(node.params.inputMethod!=='areas'&&!!node.params.data?.features?.length);
  return !reads&&Math.max(1,node.params.areaInputCount??1)<MAX_AREA_INPUTS;
}
/** WHAT A NODE'S PORTS SHOW (0.204.0): what arrived at each connected input, and whether one blank port is drawn for
 *  another. Map and Table draw it while something on the canvas could add a layer; every other widget while a declared
 *  input is free, so a step that needs two inputs shows its second once the first is connected. */
function portsDrawn(n:WorkflowNode):Pick<NodeDescription,'inputsIn'|'canAdd'|'takes'>{
  const incoming=workflow.edges.filter(e=>e.to===n.id),inputs=nodeInputs(n);
  const inputsIn=incoming.map(e=>{const source=workflow.nodes.find(x=>x.id===e.from);
    return {port:e.port,kind:source?outputOf(source)??'':'',from:source?(source.params.label||TYPES[source.type].title):e.from};});
  const taken=new Set(incoming.map(e=>shownPort(n.type,e.port)));
  const free=inputs.filter(([port])=>!taken.has(shownPort(n.type,port)));
  const layerNode=n.type==='map_output'||n.type==='table_output';
  const canAdd=layerNode
    ?free.some(([,type])=>workflow.nodes.some(x=>x.id!==n.id&&portAccepts(type,outputOf(x))))
    :free.length>0||polygonLayerGrows(n);
  const takes=[...new Set(free.map(([,type])=>SYMBOL_WORDS[symbolOf(type)]))].join(', ');
  return {inputsIn,canAdd,takes};
}
function describe(n:WorkflowNode,status?:string):NodeDescription{let subtitle=TYPES[n.type].description,detail='Ready';if(n.type==='raster_input'){detail=n.params.asset?`${n.params.asset.metadata.width} x ${n.params.asset.metadata.height} retained cells`:'Prepare a local GeoTIFF';}if(n.type==='clip_raster'){subtitle='Raster + polygon -> masked raster';detail=n.params.method+' / margin '+(n.params.marginPixels||0)+' px';}if(n.type==='measure_distance'){detail='Kilometers · straight-line';}if(n.type==='output'){subtitle={table:'Table with supporting evidence',bars:'Grouped result counts',map:'Map of results and locations'}[n.params.view];detail='Creates a Results tab';}if(n.type==='study_area'){const p=n.params;subtitle=p.geometry?`Drawn ${p.selectionMode==='bbox'?'box':'polygon'}`:'No boundary selected yet';detail=!p.geometry?'Select it on the map':'CRS84';}if(n.type==='point_grid'){subtitle=`Regular grid · ${n.params.spacingM} m`;detail='Demonstration points';}if(n.type==='facilities'){subtitle=`Search within ${n.params.radiusKm} km`;detail='Historical registry · 214 points';}if(n.type==='xpert'){subtitle='Named evidence → facility type';detail='NB06 hierarchy · N3';}if(n.type==='access'){subtitle=`${n.params.minimumEvidence} evidence · ${n.params.service==='onsite'?'onsite':'incl. referral'}`;detail=`Straight-line proxy · ${n.params.speedMPerMin} m/min`;}if(n.type==='access_policy'){subtitle=`Review proxy time > ${n.params.thresholdMin} min`;detail='N3 · missing stays unknown';}if(n.type==='facility_audit'){subtitle='Service, evidence, and references';detail='All candidate facilities';}const alert=badgeFor(n.id);return {flagged:!!nodeAlert(n.id),definition:{...TYPES[n.type],inputs:nodeInputs(n),output:outputOf(n)},
    ...portsDrawn(n),
    type:n.type,label:n.params.label||TYPES[n.type].title,subtitle,detail,status,glow:justFinished.has(n.id),alert:alert?alertHeadline(alert):undefined};}
function render(){
  setFigureWords(figureWordsOf(workflow));
  // ONLY WHEN IT CHANGES. This runs on every edit, and Safari refuses a hundred calls in ten seconds
  // by throwing, which stopped the edit that triggered it. Found 2026-11-02 building Oswego.
  const url=new URL(location.href);
  if(url.searchParams.get('example')!==exampleKey(workflow)){
    url.searchParams.set('example',exampleKey(workflow));window.history.replaceState(null,'',url);}
  renderLibrary($('#node-search').value);
  renderProjectOptions();renderProjectDetails();renderStorageStatus();renderProjectSafety();
  // THE TAB REDRAWS WITH EVERYTHING ELSE. Three bugs today were the same bug: a derived fact
  // was written and the surface showing it was not told -- the header after an export, the
  // Project view after an export, the view again after a project was renamed. Scattering a
  // call at each site is how the fourth one happens, so it renders where every other surface
  // renders and the individual calls are no longer load-bearing.
  // AND THE NOTES, WHICH A RUN CHANGES. Derived and machined notes come from the run, so the
  // tab a practitioner is already looking at has to be rebuilt when one finishes: `switchView`
  // returns early for the view you are on, so clicking the tab again does nothing. Found by a
  // test that ran the workflow with Notes open and saw none of what the run had produced.
  if(currentView==='notes')renderNotesView();
  // NO CAPTION BORROWED FROM ANOTHER EXAMPLE: the heat example's were every workflow's fallback until 2026-11-11, and
  // the heat and Old Naledi examples have retired (docs/audits/old-naledi-audit.md). A workflow says only its own name.
  if(currentView==='project')renderProjectView();$('#project-title').textContent=workflow.name||'Untitled workflow';$('#project-description').textContent='';$('#example-note').textContent='';$('#canvas-example').textContent=(workflow.name||'This workflow').toUpperCase();$('#footer-context').textContent='';
  // Captions per example were removed on 2026-11-11 (the practitioner: commentary about design belongs in design
  // documents, not the UI). A workflow changed from its example still says so, below: that is status.
  // The practitioner met this twice before it was fixed, which is why it is withdrawn here rather
  // than corrected in eight branches: one place that can be read, instead of a rule repeated.
  // The open copy's fingerprint, as the comparison with its example reads it: on the bar, for a test to read.
  {const key=exampleKey(workflow);const note=optionalElement('#example-note');
    if(note){if(isExampleKey(key)&&key!=='blank'&&workflow.nodes.length)note.dataset.revision=exampleRevision(workflow);else delete note.dataset.revision;}}
  // A WORKFLOW FROM AN EXAMPLE REPOSITORY is compared with its pin below, not with a built-in: an untouched South London
  // workflow said "Built on Blank canvas and changed since" (the practitioner's screenshots, 2026-11-13).
  if(!originOf(storageKey(workflow))&&divergedFromExample(exampleKey(workflow))){
    // SAID IN THE BAR, where it stays, and for every workflow opened, not only the first: which of the three it is.
    const key=exampleKey(workflow),standing=exampleStanding(key);
    const note=$('#example-note');
    note.textContent=standing==='updated'?'The example has been updated since this copy was made. '
      :standing==='differs'?`Differs from ${workflowTitle(key)} as it is now. `
      :`Built on ${workflowTitle(key)} and changed since.`;
    if(standing==='updated'||standing==='differs'){
      const load=document.createElement('button');load.type='button';load.className='button small';load.id='load-published';
      load.textContent=standing==='updated'?'Load the updated example':'Load the example as it is now';
      // NOT DURING A RUN: an edit made while one runs is refused, and this click did nothing and said nothing. The copy runs
      // itself on opening, so the button was there to press while it could not work (WebKit on CI, 2026-11-16 and -17).
      load.disabled=busy;load.title=busy?'Wait for the run to finish':'Replaces this copy with the example as it ships now';
      load.onclick=()=>loadPublished(key);note.append(load);
    }
    $('#canvas-example').textContent=(workflow.name||'This workflow').toUpperCase();
    // AND THE LINE UNDER THE TITLE, which described the example it started from: a dengue workflow built on a blank
    // canvas said "Define a study area and inspect its semantic representation" (the practitioner's screenshot,
    // 2026-11-09). A workflow has no description of its own, so the line says nothing rather than something untrue.
    $('#project-description').textContent='';
  }
  // A WORKFLOW OPENED FROM AN EXAMPLE REPOSITORY whose pinned version has moved on (the practitioner, 2026-11-13, opening
  // repository examples "from project list"): the digest it was read from is not the one the catalog pins now. Fetching
  // again opens the newer version beside this copy; nothing of this copy is replaced.
  {const origin=originOf(storageKey(workflow)),example=origin&&exampleById(origin.exampleId);
    const pinned=example?.files.find(f=>f.path===origin!.path);
    if(origin&&example&&pinned&&pinned.sha256!==origin.sha256){
      const note=$('#example-note');
      note.append(`A newer version of ${example.title} is pinned. `);
      const fetchAgain=document.createElement('button');fetchAgain.type='button';fetchAgain.className='button small';fetchAgain.id='fetch-pinned';
      fetchAgain.textContent='Fetch again';fetchAgain.title='Opens the version pinned now as a project of its own; this copy stays';
      fetchAgain.onclick=()=>void openCuratedExample(example.id,fetchAgain);note.append(fetchAgain);
    }}
  $('#blank-canvas').hidden=workflow.nodes.length!==0||exampleKey(workflow)!=='blank';
  // IN A PROJECT OF ONE'S OWN, STEP 2 (2026-11-17). Just after Create project the empty canvas offered Create a project
  // again, step 1 of 2, with a line about the 1854 outbreak (the practitioner's screenshot, Edge on Windows).
  {const project=workflow.projectId?allProjects().find(p=>p.id===workflow.projectId):projectOfWorkflow(storageKey(workflow),allProjects());
    const own=!!project&&!BUILT_IN_PROJECTS.some(p=>p.id===project.id);
    $('#blank-step').textContent=own?'STEP 2 OF 2':'STEP 1 OF 2';
    $('#blank-heading').textContent=own?'Where does the work take place?':'What are you investigating?';
    $('#blank-what').textContent=own?`${project!.name} is open. A workflow begins with its study area.`
      :'A project is one investigation: one subject, and a workflow for each question you ask about it.';
    $('#blank-project').hidden=own;$('#blank-area').hidden=!own;$('#blank-step-two').hidden=own;}
  // The bar is refreshed here rather than only when a control is used, because the workflow can
  // change underneath it -- loading an example being the case that caught this: the playback had
  // been set up against the default canvas and went on reporting its length.
  renderPlayback();
  // During a playback the canvas shows the nodes placed so far, and the edges between them.
  const shown=playbackView();
  flow?.update(shown,selected,statuses);$('#node-count').textContent=String(shown.nodes.length);$('#undo-button').disabled=!history.length||busy;$('#redo-button').disabled=!future.length||busy;
  // A failed run outranks "Changed · rerun to update". Both of the places that set 'Run failed'
  // were immediately overwritten from `dirty` by the render in the run's own finally block, so
  // the canvas invited the practitioner to press the button that had just refused and the only
  // trace of the refusal was in the console. The flag clears when the next run starts, or when
  // they change something -- at which point rerunning IS the next thing to do.
  $('#workflow-state').textContent=busy?(runProgress?`Running · ${runProgress.done} of ${runProgress.of} ${runProgress.what}`:'Running locally…'):runFailed?'Run failed'
    :runIncomplete?'Not ready to run'
    :dirty?(result?'Changed · rerun to update':'Ready to run'):'✓ Run complete';
  $('#run-button').disabled=busy;$('#run-button').innerHTML=busy?'<span class="run-spin" aria-hidden="true">◌</span> Running…':'<span>▶</span> Run workflow';
  if(!busy)runProgress=null;
  drawRunProgress();
  $('#run-summary').textContent=result?(dirty?'Previous run · settings have changed':`${result.outputs.length} outputs · ${lastRunMs===null?'':`ran in ${elapsedText(lastRunMs)} · `}${Math.round(result.trace.reduce((a,t)=>a+t.milliseconds,0))} ms computing`):'Run the workflow to see results';
  if(exampleKey(workflow)==='snow-geoprivacy')$('#run-summary').textContent=result?'Private project and run evidence contain original coordinates. Derived tabs are educational; review before sharing.':'Private source coordinates are included in this workflow.';
  ($('#project-select') as HTMLSelectElement).disabled=busy;($('#workflow-select') as HTMLSelectElement).disabled=busy;
  // THE WIDGETS TAB'S WORKFLOW BUTTONS TOO, as the selector: a workflow cannot be opened while one runs, and a button
  // that does nothing when pressed said nothing (CI, 2026-11-14).
  document.querySelectorAll<HTMLButtonElement>('[data-open-workflow]').forEach(b=>{b.disabled=busy;b.title=busy?'Wait for the run to finish':'';});
  // THE LIBRARY DISABLED, NOT ONLY FADED, while a run is in flight: a faded button still took Enter, and a control that
  // is inactive has to say so to be exempt from contrast (WCAG 1.4.3; the Section 508 audit, 2026-11-16).
  document.querySelectorAll<HTMLButtonElement>('.palette-node').forEach(b=>{b.disabled=busy;});
  document.body.classList.toggle('busy',busy);flow?.setBusy(busy);renderInspector();
  $('#run-button').disabled=busy||!workflow.nodes.length;$('#new-workflow').disabled=busy;($('#add-workflow') as HTMLButtonElement).disabled=busy;$('#reset-example').disabled=busy||!workflow.nodes.length;$('#tidy-button').disabled=busy||workflow.nodes.length<2;
  // EVERY CONTROL WHOSE HANDLER OPENS WITH `if(busy)return` BELONGS ON THIS LINE, and the three
  // that open the project dialog did not. A guard that returns silently is invisible: the click
  // lands, nothing happens, no message appears, and the run that swallowed it is in a different
  // part of the screen from the button that stopped working. Found 2026-10-24 in a Linux WebKit
  // container, where a heavy example is still running when the practitioner reaches New project;
  // on a faster machine the run finishes first and the control looks fine. The defect is older
  // than the test that caught it -- experiment 135.
  //
  // Disabled rather than queued, at the practitioner's decision: a control that greys out says the
  // application is busy, where one that remembers a click acts on an intention formed before the
  // run finished.
  for(const id of ['#new-project','#project-new','#blank-project','#backup-button'])
    ($(id) as HTMLButtonElement).disabled=busy;
  if(!workflow.nodes.length)$('#workflow-state').textContent='Add Study area to begin';
  renderN3();
}
function describeNode(n:WorkflowNode,status?:string):NodeDescription{const d=describe(n,status);if(n.type==='isochrone'){d.subtitle=(n.params.thresholds?.length?n.params.thresholds.join(', '):n.params.minutes)+' min / '+n.params.speedMPerMin+' m per min';d.detail=n.params.direction+' / '+n.params.bufferM+' m corridor';}if(n.type==='mean_center'){d.subtitle='Unweighted center of point locations';d.detail='UTM zone '+n.params.zone+(n.params.hemisphere==='north'?'N':'S')+' → CRS84';}if(n.type==='compare_point_sets'){d.subtitle='Original + moved + two centers + pumps';d.detail=`UTM zone ${n.params.zone}${n.params.hemisphere==='north'?'N':'S'} · metres`;}if(n.type==='comparison_map'){d.subtitle='Side-by-side maps · shared extent';d.detail='Private evaluation view';}if(['map_output','table_output','chart_output'].includes(n.type)&&'inputMode' in n.params&&n.params.inputMode==='polygons'){d.subtitle='Display polygon geometry and existing summaries';d.detail='Creates a Results tab';}if(n.type==='map_output'&&n.params.inputMode==='raster'){d.subtitle='Native raster cells and clipping boundary';d.detail='GeoTIFF download';}if(n.type==='table_input'){d.subtitle=n.params.keys.length?`${n.params.keys.length} key columns -> ${n.params.valueField}`:'Choose key and value columns';d.detail=n.params.data.rows.length?`${n.params.data.rowCount} rows`:'Import a long-format CSV';}if(n.type==='raster_input')d.detail=n.params.asset?`${n.params.asset.metadata.width} x ${n.params.asset.metadata.height} retained cells`:'Choose a GeoTIFF in Configure\u2026';if(n.type==='study_area'&&n.params.source==='drawn'){d.subtitle=n.params.geometry?`${n.params.selectionMode==='bbox'?'Bounding box':'Polygon'} · ${geometryVertices(n.params.geometry)} vertices`:'Choose a boundary on the map';d.detail=n.params.geometry?'CRS84':'Not configured';}if(n.type==='measure_area'){d.subtitle='Study area → study area + area';d.detail=`${AREA_UNITS[n.params.unit].symbol} · spherical calculation`;}return d;}
function runEvidenceText(){return result?result.receipts.map(receiptText).join('\n\n')+(result.provenanceN3?'\n\n# WORKFLOW, WIDGET AND REFERENCE PROVENANCE (recorded metadata, not rule premises)\n'+result.provenanceN3:''):'';}
// A DECLARATION NODE STATES FACTS AND INFERS NOTHING, which is a third kind and not a rule with
// an empty conclusion list. Added 2026-10-31 with `study_design`: without it a declaration fell
// through to the rule branch and the run died on `conclusions.map`. Experiment 154.
function receiptText(r:Receipt){return r.kind==='declaration'
  ?`# DECLARATION NODE: ${r.nodeId}\n# WHAT THE PRACTITIONER DECLARED (no computation, no inference)\n${r.input}`
  :r.kind==='presentation'?`# PRESENTATION NODE: ${r.nodeId}\n# SOURCE FACTS AND VIEW PROVENANCE (no new inference)\n${r.input}`:r.kind==='computation'?`# COMPUTATION NODE: ${r.nodeId}\n# COMPUTED FACTS (not inferred)\n${r.input}`:`# RULE NODE: ${r.nodeId}\n${r.input}\n# DERIVED CONCLUSIONS\n${r.conclusions.map(quadToN3).join('\n')}`;}
function renderN3(){
  const drawn=workflow.nodes.filter((n):n is WorkflowNode<'study_area'> & {params:Extract<import('./types.js').AreaParams,{source:'drawn'}>}=>n.type==='study_area'&&n.params.source==='drawn');
  const area=drawn.find(n=>n.params.geometry);$('#area-semantic-graph').hidden=!area;
  const evaluated=area&&!dirty&&result?.receipts.some(r=>r.nodeId===area.id&&r.conclusions.some(q=>q.predicate==='urn:fieldwork:readyForSpatialAnalysis'&&q.object==='true'));
  if(area)$('#area-semantic-graph').innerHTML=`<div>${esc(area.params.label)}<small>Study area · ${esc(area.id)}</small></div><span>geo:hasGeometry →</span><div>${area.params.selectionMode==='bbox'?'Bounding box polygon':'Polygon'}<small>geo:asWKT · CRS84</small></div><span>validated geometry → rule</span><div>${evaluated?'Ready for spatial analysis':'Not evaluated'}<small>${evaluated?'EYE conclusion from widget checks':'Draft facts'}</small></div>`;
  if(dirty||!result){$('#n3-preview').textContent='# CURRENT CANVAS PLANS — not executed evidence\n\n'+canvasN3(workflow)+'\n'+drawn.map(n=>{try{return studyAreaN3(n).input;}catch{return '# Select a valid study area before running.';}}).join('\n\n');}
  else if(result)$('#n3-preview').textContent=runEvidenceText();
  else $('#n3-preview').textContent='Add a Study area and draw a boundary to generate facts, or run a worked example.';
}
/** The columns a connected layer actually has, as candidate field bindings.
 *
 *  Read from the records themselves rather than guessed from a name: the kind comes from the
 *  values, and a numeric column gets no unit, because this cannot know one and a number without
 *  a unit is not a measurement. The practitioner states it before the rules will run. */

/** THE COLUMNS A JOINED POLYGON CARRIES, walked up the chain, since a run has not happened yet. */
function recordColumns(node:WorkflowNode|undefined,seen=new Set<string>()):string[]|null{
  if(node?.type!=='join_table_to_area'||seen.has(node.id))return null;
  seen.add(node.id);
  const from=(port:string)=>{
    const edge=workflow.edges.find(e=>e.to===node.id&&e.port===port);
    return edge?workflow.nodes.find(m=>m.id===edge.from):undefined;};
  const table=from('records');
  const value=table?.type==='table_input'?table.params.valueField:'';
  return [...new Set([...(recordColumns(from('polygons'),seen)??[]),...(value?[value]:[])])];
}

/** The columns a connected layer actually has, as candidate field bindings.
 *
 *  Read from the records themselves rather than guessed from a name: the kind comes from the
 *  values, and a numeric column gets no unit, because this cannot know one and a number without
 *  a unit is not a measurement. The practitioner states it before the rules will run. */
function candidateFields(workflow:Workflow,nodeId:string){
  // Any incoming edge, not only one on a port called `subjects`. A step converted from a
  // declared ruleset keeps that ruleset's port names -- `polygons` for extent-review -- and
  // looking only for `subjects` found nothing, so the editor opened with no columns to read.
  const edge=workflow.edges.find(e=>e.to===nodeId&&e.port==='subjects')
    ??workflow.edges.find(e=>e.to===nodeId);
  const source=edge&&workflow.nodes.find(n=>n.id===edge.from);
  const data=(source?.params as {data?:{kind?:string; features?:{properties?:Record<string,unknown>}[];
    keys?:string[]; valueField?:string; rows?:{key:Record<string,unknown>; value:unknown}[]}}|undefined)?.data;
  // A TABLE IS RECORDS TOO. The run has said so since 2026-10-16 -- "points or a table, the rules
  // do not know the difference" -- but this offered columns only from a point layer's properties,
  // so a step fed by a table was told to connect the records it already had and no rule could be
  // written on it at all. The attributes of a row are its key columns plus the declared value
  // field, which is `authoredSubjects` read the same way round. Found 2026-10-26 on the Manila
  // extract step.
  // A WIDE TABLE's columns are its subjects' (experiment 188): the subject columns and one number per measure, read
  // from the records the rules will read, so the long shape inside never reaches the list.
  const table=edge?tableOnPort(workflow,nodeId,edge.port):null;
  if(table?.wide){
    const subjects=authoredSubjects(table).slice(0,200);
    const kinds=new Map<string,Set<string>>();
    for(const s of subjects)for(const [k,v] of Object.entries(s.properties))
      if(v!==null&&v!==undefined&&v!=='')(kinds.get(k)??kinds.set(k,new Set()).get(k)!).add(typeof v);
    return [...kinds].map(([attribute,types])=>({attribute,label:attribute,
      predicate:`fwa:${attribute.replace(/[^A-Za-z0-9]+(.)/g,(_,c:string)=>c.toUpperCase()).replace(/[^A-Za-z0-9]/g,'')}`,
      kind:types.has('number')&&types.size===1?'number' as const:'term' as const}));
  }
  // WHAT THE STEP GAVE OUT AT THE LAST RUN, where it computes its points (experiment 192): Find health facilities from
  // a list keeps a register in its params, not the facilities it matched, so its params are not its output.
  const ran=source&&result?.pointColumns?.[source.id];
  if(ran&&source.type!=='point_input')return ran.map(({attribute,kind})=>({attribute,kind,label:attribute,
    predicate:`fwa:${attribute.replace(/[^A-Za-z0-9]+(.)/g,(_,c:string)=>c.toUpperCase()).replace(/[^A-Za-z0-9]/g,'')}`}));
  const carried=recordColumns(source);
  if(carried)return carried.map(attribute=>({attribute,kind:'number' as const,label:attribute,
    predicate:`fwa:${attribute.replace(/[^A-Za-z0-9]+(.)/g,(_,c:string)=>c.toUpperCase()).replace(/[^A-Za-z0-9]/g,'')}`}));
  // A TABLE A STEP COMPUTED, such as Total within groups' counts, is read from the last run, as its preview is.
  const rowsFrom=data?.kind==='data-table'?data:table??undefined;
  // READ AS THE RULES WILL READ THEM: a column the table declares numeric is a number, so it is offered with its unit
  // (experiment 198). Read from the keys as text, a sampled height was offered as a category.
  const records=rowsFrom
    ?authoredSubjects({...rowsFrom,rows:(rowsFrom.rows??[]).slice(0,200)} as never).map(s=>s.properties)
    :(data?.features??[]).slice(0,200).map(feature=>feature.properties??{});
  const seen=new Map<string,Set<string>>();
  for(const properties of records)
    for(const [key,value] of Object.entries(properties)){
      if(key==='name'||value===null||value===undefined||value==='')continue;
      (seen.get(key)??seen.set(key,new Set()).get(key)!).add(typeof value);
    }
  return [...seen].map(([attribute,types])=>({attribute,
    predicate:`fwa:${attribute.replace(/[^A-Za-z0-9]+(.)/g,(_,c:string)=>c.toUpperCase()).replace(/[^A-Za-z0-9]/g,'')}`,
    kind:types.has('number')&&types.size===1?'number' as const
      :types.has('boolean')&&types.size===1?'boolean' as const:'term' as const,
    label:attribute}));
}

/** What every ruleset downstream of this input has declared its columns to be.
 *
 *  Read from the bindings rather than from the data, because a declaration is the only thing
 *  that makes a value WRONG: `"3"` in a column nobody typed is a string, and in a column
 *  declared numeric it is a problem. Experiment 117.
 *
 *  Several steps may bind the same column. They agree in every workflow this project ships, and
 *  if they ever disagreed the first declaration wins here -- the profile is a reading aid, and
 *  the run is what adjudicates. */
function declaredKinds(workflow:Workflow,inputId:string):Record<string,'number'|'boolean'|'term'>{
  const kinds:Record<string,'number'|'boolean'|'term'>={};
  const reachable=new Set([inputId]);
  // Follow the edges forward: a ruleset two steps away still reads these columns.
  let grew=true;
  while(grew){
    grew=false;
    for(const edge of workflow.edges)
      if(reachable.has(edge.from)&&!reachable.has(edge.to)){reachable.add(edge.to);grew=true;}
  }
  for(const node of workflow.nodes){
    if(node.type!=='apply_ruleset'||!reachable.has(node.id))continue;
    for(const field of node.params.authored?.fields??[])
      // A date is a category to the column profile, which has no date kind of its own.
      if(!(field.attribute in kinds))kinds[field.attribute]=field.kind==='date'||field.kind==='datetime'?'term':field.kind;
  }
  return kinds;
}

/** Read a column's values as the kind a ruleset declared, once a practitioner has asked.
 *
 *  Never automatic, and never a write to the file: an ordinary change to the workflow, which
 *  Undo reverses and the saved workflow carries. It reports both sides -- what it cast and what
 *  it could not read -- because a repair that only mentions its successes is how 2 of 63 records
 *  quietly stay broken. Experiment 117. */
function repairColumn(nodeId:string,column:string,to:'number'|'boolean'|'term'){
  const node=workflow.nodes.find(x=>x.id===nodeId);
  const params=node?.params as {data?:{features?:{properties?:Record<string,unknown>}[]};repairs?:ColumnRepair[]}|undefined;
  if(!params?.data?.features?.length)return;
  // Measured against the records as they will be READ -- repairs already declared included --
  // so asking twice for the same column does nothing rather than reporting it twice.
  const seen=applyRepairs(params.data.features,params.repairs??[]);
  const {outcome}=castColumn(seen.map(f=>f.properties?.[column]),to);
  if(!outcome.cast&&!outcome.unreadable.length)return;
  // DECLARED, not applied to what the node holds. The records this node imported stay byte for
  // byte what the file contained; the repair is applied to a copy on the way out, so removing
  // the declaration brings the original back without an Undo and without a re-import.
  change(w=>{
    const target=w.nodes.find(x=>x.id===nodeId);
    const params=target?.params as {repairs?:ColumnRepair[]}|undefined;
    if(params)params.repairs=[...(params.repairs??[]),
      {column,to,cast:outcome.cast,unreadable:outcome.unreadable,at:new Date().toISOString()}];
  });
  toast(`${column}: ${outcome.cast} value${outcome.cast===1?'':'s'} now read as ${to}s.`
    +(outcome.unreadable.length
      ?` ${outcome.unreadable.length} could not be read and ${outcome.unreadable.length===1?'was':'were'} left as ${outcome.unreadable.map(v=>`"${v}"`).slice(0,3).join(', ')}. Those records stay unrecorded.`
      :' Nothing was left unreadable.')
    +' Undo reverses this; the file itself is untouched.',
    {tone:outcome.unreadable.length?'warning':'notice'});
}

/** Take a declared repair back. The originals were never overwritten, so removing the
 *  declaration is the whole of it -- no re-import, no Undo, nothing to reconstruct. */
function removeRepair(nodeId:string,index:number){
  const node=workflow.nodes.find(x=>x.id===nodeId);
  const repair=(node?.params as {repairs?:ColumnRepair[]}|undefined)?.repairs?.[index];
  if(!repair)return;
  change(w=>{
    const params=w.nodes.find(x=>x.id===nodeId)?.params as {repairs?:ColumnRepair[]}|undefined;
    if(params?.repairs)params.repairs=params.repairs.filter((_,i)=>i!==index);
  });
  toast(`${repair.column} is read as the file holds it again. `
    +`The ${repair.cast} value${repair.cast===1?'':'s'} that ${repair.cast===1?'was':'were'} cast `
    +`${repair.cast===1?'is':'are'} back as ${repair.cast===1?'it':'they'} ${repair.cast===1?'was':'were'} imported.`,
    {tone:'notice'});
}

/** Everything the quality dialog needs about one input, in the shape it reads. */
function qualityViewFor(n:WorkflowNode):import('./data-quality-ui.js').QualityView{
  const held=n.params as {data?:{features?:{id?:string|number;properties?:Record<string,unknown>}[]};repairs?:ColumnRepair[];edits?:EditEntry[]};
  const repairs=held.repairs??[],edits=held.edits??[];
  // WHAT IS HANDED ON: repairs, then the values edited by hand (experiment 214).
  const edited=applyFeatureEdits(applyRepairs(held.data?.features??[],repairs),editsAt(edits)),features=edited.features;
  const columns=[...new Set(features.flatMap(f=>Object.keys(f.properties??{})))];
  return {title:`${n.params.label||TYPES[n.type].title} · data quality`,columns,
    rows:features.map(f=>({...f.properties})),
    declared:declaredKinds(workflow,n.id),scales:scalesOf((n.params as {columns?:import('./column-metadata.js').ColumnDeclarations}).columns),repairs,
    onRepair:(column:string,to:'number'|'boolean'|'term')=>repairColumn(n.id,column,to),
    onRemoveRepair:(index:number)=>removeRepair(n.id,index),
    ...(n.type==='point_input'?{recordIds:features.map(f=>String(f.id)),edits,staleEdits:edited.stale.length,
      onEdit:(edit:CellEdit)=>editCell(n.id,edit),onRemoveEdit:(version:number)=>removeEdit(n.id,version),
      onRestore:(version:number)=>restoreEdits(n.id,version)}:{})};
}
/** AN EDIT MADE IN DATA QUALITY, added to the step's log as its next version (experiment 214); nothing is deleted. */
const appendEdit=(nodeId:string,entry:(v:number)=>EditEntry)=>change(w=>{const p=w.nodes.find(x=>x.id===nodeId)!.params as {edits?:EditEntry[]};
  const log=p.edits??[];p.edits=[...log,entry(log.length+1)];});
/** SEVERAL ENTRIES, ONE CHANGE (2026-11-24). Correcting a subject's name in the wide view corrects every melted row
 *  that subject has, and those must land together: appended one at a time they would be several undo steps for one
 *  correction, and a run between them would read a table half renamed. */
const appendEdits=(nodeId:string,entries:(first:number)=>EditEntry[])=>change(w=>{const p=w.nodes.find(x=>x.id===nodeId)!.params as {edits?:EditEntry[]};
  const log=p.edits??[];p.edits=[...log,...entries(log.length+1)];});
function editCell(nodeId:string,edit:CellEdit):import('./data-quality-ui.js').QualityView|undefined{
  if(!appendEdit(nodeId,version=>({...edit,version})))return undefined;
  toast(`${edit.column} of ${edit.record} edited by hand. Rerun to use it.`);
  return qualityViewOf(nodeId);
}
/** TAKEN BACK, as a new version that revokes the one that made it. */
function removeEdit(nodeId:string,made:number):import('./data-quality-ui.js').QualityView|undefined{
  if(!appendEdit(nodeId,version=>({version,revokes:made,at:new Date().toISOString()})))return undefined;
  return qualityViewOf(nodeId);
}
/** RESTORED, as a new version whose values are those of an earlier one; 0 is the records as imported. */
function restoreEdits(nodeId:string,to:number):import('./data-quality-ui.js').QualityView|undefined{
  if(!appendEdit(nodeId,version=>({version,restore:to,at:new Date().toISOString()})))return undefined;
  toast(to?`Version ${to} restored, as a new version. Rerun to use it.`:'The records as imported restored, as a new version. Rerun to use it.');
  return qualityViewOf(nodeId);
}
const qualityViewOf=(nodeId:string)=>{const n=workflow.nodes.find(x=>x.id===nodeId)!;return n.type==='table_input'?tableQualityView(n as WorkflowNode<'table_input'>):qualityViewFor(n);};
function tableQualityView(n:WorkflowNode<'table_input'>):import('./data-quality-ui.js').QualityView{
  const table=n.params,edits=table.edits??[];
  const edited=applyTableEdits(table.data,editsAt(edits)),data=edited.table;
  // WIDE, BECAUSE EVERY USER-FACING TABLE IS (the practitioner, 2026-11-24, on finding this dialog showing a wide
  // table melted: *"We should decrease the friction for the user, which means consistency in user-facing views of
  // the tables. We can be efficient using long formats but will result in cognitive dissonance in the user."*).
  //
  // The melting is Fieldwork's, for the steps downstream; `species`, `measure` and `value` are names it gave the
  // table and not columns anyone read off a file. This dialog was showing those, while the table view and Describe
  // columns beside it showed the file's own -- the same table in two shapes, a click apart.
  // ONLY WHERE FIELDWORK DID THE MELTING (2026-11-25). `wideFrame` widens ANY table whose keys will carry an axis,
  // not only one that arrived wide -- which is right for the table VIEW, where widening a long table is a reading
  // aid, and wrong here.
  //
  // This dialog's Columns tab is where a column is checked against what a dictionary says it means, so it must list
  // the columns the FILE has. Widening a table that was long in the file turns one of its real columns into
  // headings and the column disappears from the tab: `data-dictionary.browser.mjs` caught exactly that, losing
  // `class`, a column somebody wrote and described. The gate found it; the wide-format audit had warned that
  // `wideFrame` widens more than it is asked to, and I applied it here anyway.
  //
  // `DataTable.wide` is written by the melt itself (`data-table.ts`), so it is present exactly when the shape a
  // reader expects is the wide one and absent when the file really is long.
  const frame=data.wide||data.shownWide?wideFrame(data):null;
  const columns=frame?[frame.subject,...frame.attributes,...frame.columns]:[...data.keys,data.valueField];
  const rows=frame
    ?frame.rows.map(r=>({[frame.subject]:r.label,
      ...Object.fromEntries(frame.attributes.map((name,i)=>[name,r.attributes[i]])),
      ...Object.fromEntries(frame.columns.map((name,i)=>[name,r.cells[i]??null]))}))
    :data.rows.map(row=>({...row.key,[data.valueField]:row.value}));
  return {title:`${n.params.label||'Tabular data'} · data quality`,
    findings:[...(table.data.findings??[]),...metadataFindings(table.data,table.columns,table.dictionaryCheck,table.wide)],
    columns,
    rows,
    declared:declaredKinds(workflow,n.id),scales:scalesOf(table.columns),repairs:[],
    // A tabular import casts its value column at import, and a cell it cannot read is a finding
    // kept as unknown. No repair is offered here yet. 117, 164.
    onRepair:()=>{},onRemoveRepair:()=>{},
    recordIds:rows.map((_,i)=>`row ${i+1}`),edits,staleEdits:edited.stale.length,
    onEdit:(edit:CellEdit)=>editWideCell(n.id,edit,frame,data.valueField),
    onRemoveEdit:(version:number)=>removeEdit(n.id,version),
    onRestore:(version:number)=>restoreEdits(n.id,version)};
}

/** AN EDIT MADE ON THE FILE'S SHAPE, RECORDED AGAINST THE ROWS THE STEP HOLDS (2026-11-24).
 *
 *  The dialog shows the file's columns; `applyTableEdits` applies edits to the stored rows, keyed by `row N` in
 *  stored order and by the stored column. Showing one shape and recording against the other without translating
 *  would write edits that could never match a row -- the dialog would look right and editing would quietly stop
 *  working, which is worse than the inconsistency it set out to fix.
 *
 *  A VALUE CELL IS ONE STORED ROW; A SUBJECT OR ATTRIBUTE CELL IS ALL OF THEM. Correcting a species name in the
 *  wide view corrects every stored row of that species, together. Correcting it in the melted view, one row at a
 *  time, silently split the subject in two -- so this is not only a translation, it closes that. */
function editWideCell(nodeId:string,edit:CellEdit,frame:ReturnType<typeof wideFrame>,
  valueField:string):import('./data-quality-ui.js').QualityView|undefined{
  if(!frame)return editCell(nodeId,edit);
  const at=frame.rows.findIndex((_,i)=>`row ${i+1}`===edit.record);
  if(at<0)return undefined;
  const row=frame.rows[at]!,column=frame.columns.indexOf(edit.column);
  // A value column edits the one stored row behind that cell, on the value column it was melted into.
  const made:CellEdit[]=column>=0
    ?(row.from.cells[column]===undefined?[]
      :[{record:`row ${row.from.cells[column]!+1}`,column:valueField,from:edit.from,to:edit.to,at:edit.at}])
    // The subject, or one of the columns describing it, is the same on every stored row of the subject.
    :row.from.rows.map(r=>({record:`row ${r+1}`,column:edit.column,from:edit.from,to:edit.to,at:edit.at}));
  if(!made.length)return undefined;
  if(!appendEdits(nodeId,first=>made.map((m,i)=>({...m,version:first+i}))))return undefined;
  toast(`${edit.column} of ${edit.record} edited by hand${made.length>1?`, on ${made.length} records`:''}. Rerun to use it.`);
  return qualityViewOf(nodeId);
}




/** THE POLYGON LAYER, CONFIGURED (experiment 186, 2026-11-11). Where the features come from, the study area to read
 *  inside, what to read, the file, and how to name them -- a draft until Apply, and Apply is the read. The file is held
 *  here, outside the controls, because a redraw would empty a file input; a read that fails leaves the dialog open
 *  with the reason, and nothing on the step changed. */
/** THE AREAS POINT DATA CAN GENERATE IN, the connected one first (2026-11-21): a Study area's own shape, or an area a step
 *  made in the last run, such as a Combined area across a border; then every other Study area, as before. */
function generationAreas(nodeId:string):{id:string;label:string;geometry:Boundary}[]{
  const own=workflow.nodes.filter((x):x is WorkflowNode<'study_area'>=>x.type==='study_area'&&!!x.params.geometry)
    .map(x=>({id:x.id,label:x.params.label||'Study area',geometry:x.params.geometry as Boundary}));
  const connected=workflow.edges.find(e=>e.to===nodeId&&e.port==='area')?.from;
  if(!connected)return own;
  const made=result?.areas?.[connected];
  const first=own.find(a=>a.id===connected)??(made?{id:connected,label:made.label,geometry:made.boundary}:undefined);
  return first?[first,...own.filter(a=>a.id!==connected)]:own;
}
/** WHAT CLIP RASTER KEEPS, in one sentence. */

/** WHAT SAMPLE RASTER WRITES, in one sentence. */




/** WHERE AN OUTPUT'S FIGURE GOES IN THE WRITE-UP, or that it is left out, one control for all three output widgets. */
function writeUpSelect(n:WorkflowNode<'map_output'|'table_output'|'chart_output'>):string{
  const at=inWriteUp(n.params)?figureSection(n.params,n.type):LEFT_OUT,fallback=DEFAULT_FIGURE_SECTIONS[n.type];
  return `<div class="field"><label class="field-label" for="output-section">In the write-up, under</label>`
    +`<select id="output-section">${FIGURE_SECTIONS.map(s=>`<option value="${s}" ${s===at?'selected':''}>${s}${s===fallback?' (default)':''}</option>`).join('')}`
    +`<option value="${LEFT_OUT}" ${at===LEFT_OUT?'selected':''}>Not in the write-up</option></select></div>`;
}


function renderLibrary(search=''){
  const allowed=addableTypes({workflowTypes:workflow.nodes.map(n=>n.type)});
  // THE REST OF THE PALETTE IS ON ITS WAY (found 2026-10-26, Claude Design's canvas finding 2026-11-26): an empty canvas
  // offers only the sources, and read as a palette that failed to load.
  const help=optionalElement('.library-help');
  if(help)help.textContent=workflow.nodes.some(n=>INPUT_STAGE.has(n.type))?'Click to add. Connect matching ports.'
    :'Click to add. Start with a source: the other widgets appear once one is on the canvas.';
  // What progressive reveal would offer at this step. Dimmed rather than removed: a hidden
  // widget can make a practitioner conclude the application cannot do something it can.
  const revealed=playbackStep===null?null:revealedTypes(playbackPlaced());
  let group='';const entries=Object.entries(TYPES).filter(([k,t])=>allowed.has(k)&&!ADDABLE_VIA_RULESET.includes(k as typeof ADDABLE_VIA_RULESET[number])&&(t.title+' '+t.description).toLowerCase().includes(search.toLowerCase())).sort((a,b)=>PALETTE_GROUPS.indexOf(a[1].group as typeof PALETTE_GROUPS[number])-PALETTE_GROUPS.indexOf(b[1].group as typeof PALETTE_GROUPS[number]));$('#library-count').textContent=revealed?`${entries.filter(([k])=>revealed.has(k as NodeType)).length} of ${allowed.size}`:String(allowed.size);$('#node-library').innerHTML=entries.map(([k,t])=>{const heading=t.group!==group?`<div class="library-group">${t.group}</div>`:'';group=t.group;return `${heading}<button class="palette-node ${t.color} ${workflow.nodes.find(n=>n.id===selected)?.type===k?'primitive-selected':''} ${revealed&&!revealed.has(k as NodeType)?'unrevealed':''}" ${revealed&&!revealed.has(k as NodeType)?'title="Nothing on the canvas emits what this takes, at this step"':''} aria-current="${workflow.nodes.find(n=>n.id===selected)?.type===k?'true':'false'}" data-add="${k}"${busy?' disabled':''}><span class="palette-icon">${iconMarkup(k,t.icon)}</span><strong>${t.title}</strong>${revealed&&!revealed.has(k as NodeType)?'<span class="sr-only">, nothing on the canvas feeds it yet</span>':''}<span>+</span></button>`;}).join('');
  // One entry per bundled ruleset, each adding a node with that ruleset already pinned. The
  // generic "Apply ruleset" entry that stood here until 2026-10-14 added a node with no ruleset,
  // which has no ports and cannot run -- exactly what src/palette.ts said must not happen, while
  // the palette did it. Four rulesets were bundled and none could be chosen: the widget rule
  // "a widget nobody can add is invisible", one layer down.
  //
  // The basis status is shown where a practitioner decides, not buried in the Inspector. An
  // illustrative ruleset is offered and says so, because a rule that stops one being tried stops the learning it was written to protect.
  // Input widgets already in the OTHER workflows of this project. The practitioner, 2026-10-19:
  // *"I create a second workflow and I should then be able to see input widget from other
  // workflows IN the same project."* And, sharpening it: *"if there are no other workflows there
  // will be nothing on that list."*
  //
  // So the group is ABSENT rather than empty. It has nothing to show for a workflow in no project,
  // for the first workflow of a new project, or for a project whose other workflows hold no
  // acquired input -- all three ordinary states -- and a control that is empty until a second
  // workflow exists would advertise sharing before there is anything to share.
  const siblings=siblingInputs(storageKey(workflow),allProjects(),readSavedWorkflows())
    .filter(input=>(input.label+' '+input.workflowName).toLowerCase().includes(search.toLowerCase()));
  if(siblings.length){
    $('#node-library').insertAdjacentHTML('beforeend',`<div class="library-group">From this project</div>`
      +siblings.map((input,index)=>`<button class="palette-node" data-sibling="${index}" `
        +`title="${esc(`From "${input.workflowName}". One copy of the data is kept for the project; this node gets its own label and position.`)}">`
        +`<span class="palette-icon">⇥</span><span class="palette-label">${esc(input.label)}</span>`
        +`<span class="palette-note">${esc(input.workflowName+(input.records===null?'':` · ${input.records} records`))}</span></button>`).join(''));
  }
  $('#node-library').querySelectorAll<HTMLButtonElement>('[data-sibling]').forEach(b=>b.onclick=async()=>{
    const input=siblings[Number(b.dataset.sibling)];
    if(!input||busy)return;
    const source=readSavedWorkflows()[input.workflowKey];
    const node=isRecord(source)&&Array.isArray(source.nodes)
      ? source.nodes.find(n=>isRecord(n)&&String(n.id)===input.nodeId) : undefined;
    if(!isRecord(node)||!isRecord(node.params)||node.params.data===undefined){
      toast('That input could not be read from the other workflow.',{tone:'failure'});return;}
    const payload=node.params.data;
    // WHETHER THE SOURCE CAN SHARE, OR ONLY BE COPIED FROM. A node that already carries a digest
    // is dehydrated in its own workflow, so the project ends up holding ONE copy. A node that
    // does not is inline where it sits and stays there -- nothing backfills a digest, and
    // reaching into a workflow that is not being edited is the one thing this handler refuses to
    // do -- so the project holds two, one of them deduplicated.
    //
    // Measured 2026-10-31 on South London's sub-district layer, whose bundle authored it inline:
    // the new node dehydrated behind `790740810996` and the source stayed at 107,962 bytes. The
    // toast said "The project holds one copy of its data" over that, which is the application
    // asserting a saving it did not make. `point_input` and `table_input` have no digesting path
    // at all, so for those it is never true on a first share.
    const held=typeof node.params.dataRef==='string'?node.params.dataRef:null;
    const digest=held??await payloadDigest(payload);
    if(!await keepDataset(digest,payload))return;
    const id=`${input.type}-${Date.now()}`;
    const copied=structuredClone(node) as Record<string,unknown>;
    const didAdd=change(w=>{w.nodes.push({...copied,id,
      x:180+(w.nodes.length%4)*80,y:90+(w.nodes.length%3)*80,
      params:{...(copied.params as Record<string,unknown>),dataRef:digest}} as unknown as WorkflowNode);selected=id;});
    if(didAdd===false)return;
    flow?.fit();
    toast(`"${input.label}" added from "${input.workflowName}". `
      +(held
        ?'The project holds one copy of its data; rename this node freely.'
        :`This node holds a reference to the data and "${input.workflowName}" still holds its own `
          +'copy, so the project holds two until that one is read in again. Rename this node freely.'));
  });
  // EACH NODE'S BOX AS THE CANVAS DREW IT, in canvas units, so a new one is placed clear of it (2026-11-28).
  const drawnSizes=()=>new Map(workflow.nodes.map(n=>{const el=document.querySelector<HTMLElement>(`.react-flow__node[data-id="${CSS.escape(n.id)}"]`);
    return [n.id,{width:el?.offsetWidth||0,height:el?.offsetHeight||0}] as const;}).filter(([,s])=>s.width>0&&s.height>0));
  $('#node-library').querySelectorAll<HTMLButtonElement>('[data-add]').forEach(b=>b.onclick=()=>{
    // Four widgets reached the palette on 2026-10-19 when `addableTypes` stopped consulting a
    // curated list, and none of them had a draft: the fallback at the end of this chain reads the
    // OPEN example's template, so a widget absent from it could not be constructed. They were
    // addable only where a template already contained one, which is why nobody had noticed --
    // the same shape as the defect that hid them from the palette in the first place.
    const type=b.dataset.add as NodeType,sample=structuredClone(type==='measure_distance'?{type:'measure_distance' as const,params:{unit:'kilometres' as const}}
      :type==='facility_audit'?{type:'facility_audit' as const,params:{} as Record<string,never>}
      :type==='apply_ruleset'?{type:'apply_ruleset' as const,params:{label:'Apply ruleset',parameters:{}}}
      :type==='point_grid'?{type:'point_grid' as const,params:{spacingM:250}}:type==='mean_center'?{type:'mean_center' as const,params:{label:'Mean center',zone:30,hemisphere:'north' as const}}:type==='compare_point_sets'?{type:'compare_point_sets' as const,params:{label:'Compare point sets',zone:30,hemisphere:'north' as const}}:type==='comparison_map'?{type:'comparison_map' as const,params:{label:'Point comparison map'}}:type==='donut_geomask'?{type:'donut_geomask' as const,params:{label:'Donut geomasking',innerM:50,outerM:125,seed:42}}:type==='aggregate_points_to_h3_cell'?{type:'aggregate_points_to_h3_cell' as const,params:{label:'H3 cell aggregation',resolution:9,minOccupancy:2}}:type==='network_input'?{type:'network_input' as const,params:{label:'Street network',data:{nodes:[],edges:[],source:'Not prepared'},inputMethod:'file' as const,marginM:250}}:Object.hasOwn(CATCHMENT_TYPES,type)?[...johnSnowExample('snow-voronoi').nodes,...johnSnowExample('snow-isochrone').nodes].find(n=>n.type===type):type==='join_table_to_area'?{type:'join_table_to_area' as const,params:{label:'Values on the study area',keyField:'',normalisation:'fuzzy' as const}}:type==='regression'?{type:'regression' as const,params:{label:'Regression',family:'logistic' as const,outcome:'',exposure:{column:'',as:'categorical' as const},adjust:[],errors:'profile' as const}}:type==='append_rows'?{type:'append_rows' as const,params:{label:'Append rows'}}:type==='select_rows'?{type:'select_rows' as const,params:{label:'Select rows by value',keyColumn:'measure',values:[]}}:type==='relate_table'?{type:'relate_table' as const,params:{label:'Relate a column from another table',on:'',bring:''}}:type==='transmission_chains'?{type:'transmission_chains' as const,params:{label:'Transmission chains'}}:type==='detect_unusual_counts'?{type:'detect_unusual_counts' as const,params:{label:'Detect unusual counts',timeField:'',method:'ears-c1' as const}}
      :type==='line_input'?{type:'line_input' as const,params:{label:'Line layer',inputMethod:'file' as const}}:type==='group_table'?{type:'group_table' as const,params:{label:'Total within groups',by:[]}}:type==='space_time_scan'?{type:'space_time_scan' as const,params:{label:'Space-time scan',dateField:'',...SCAN_DEFAULTS,seed:newScanSeed()}}:type==='find_satellite_products'?{type:'find_satellite_products' as const,params:{label:'Find satellite products'}}:type==='search_satellite_catalog'?{type:'search_satellite_catalog' as const,params:{label:'Search a satellite catalog',from:'',until:''}}:type==='study_design'?{type:'study_design' as const,params:{label:'Study design',design:'cohort' as const,period:'',unitOfAnalysis:'',note:''}}:type==='two_by_two'?{type:'two_by_two' as const,params:{label:'Two-by-two table',exposureColumn:'',exposed:'',unexposed:'',outcomeColumn:'',caseValue:'',nonCaseValue:'',level:95 as const}}:type==='rate'?{type:'rate' as const,params:{label:'Rate with a denominator',numeratorField:'',denominatorField:'',denominatorUnit:'people' as const,rateKind:'proportion' as const,multiplier:100,minimumDenominator:20,numeratorPeriod:'',denominatorVintage:''}}:type==='case_series'?{type:'case_series' as const,params:{label:'Cases by period',dateField:'',dateKind:'onset' as const,period:'week' as const}}:type==='polygon_input'?{type:'polygon_input' as const,params:{label:'Polygon layer',data:{features:[]}}}:type==='map_image_input'?{type:'map_image_input' as const,params:{label:'Georeferenced map image',image:{width:0,height:0,bytes:0,sha256:''},bounds:[0,0,0,0] as [number,number,number,number],opacity:0.85}}:type==='table_input'?{type:'table_input' as const,params:{label:'Tabular data',keys:[],valueField:'',data:{kind:'data-table' as const,keys:[],valueField:'',rows:[],rowCount:0,missingValueCount:0}}}:type==='deduplicate_points'?{type:'deduplicate_points' as const,params:{label:'Deduplicated records',pointInputCount:2,nameField:'name',nameMatch:'fuzzy' as const,fuzzyThreshold:0.88,blockDistanceM:500,nearDistanceM:50,matchThreshold:2,reviewThreshold:1,decisions:[]}}:type==='clip_points_to_area'?{type:'clip_points_to_area' as const,params:{label:'Points inside the area',keepBoundary:true,showExcluded:true}}:type==='raster_input'?{type:'raster_input' as const,params:{label:'Raster input'}}:type==='fill_interior_gaps'?{type:'fill_interior_gaps' as const,params:{label:'Filled gaps'}}:type==='stack_polygons'?{type:'stack_polygons' as const,params:{label:'Collected polygon layers'}}:type==='travel_time_band'?{type:'travel_time_band' as const,params:{label:'Travel time band',minutes:5}}:type==='reachable_corridor'?{type:'reachable_corridor' as const,params:{label:'Reachable corridor',bufferM:25,zone:30,hemisphere:'north' as const}}:type==='reachable_nodes'?{type:'reachable_nodes' as const,params:{label:'Reachable junctions',minutes:10,speedMPerMin:80,direction:'outbound' as const,travelMode:'walking' as const}}:type==='snap_to_network'?{type:'snap_to_network' as const,params:{label:'Snap sites to the network',zone:30,hemisphere:'north' as const,maxSnapM:150}}:type==='summarize_combined_area'?{type:'summarize_combined_area' as const,params:{label:'Combined area',zone:30,hemisphere:'north' as const}}:type==='summarize_hull'?{type:'summarize_hull' as const,params:{label:'Convex hull',zone:30,hemisphere:'north' as const}}:type==='find_health_facilities'?{type:'find_health_facilities' as const,params:{label:'Find health facilities',source:'openstreetmap-live' as const,kinds:['hospital','clinic'],requireName:true,country:'',minConfidence:0.7,data:null,retrieved:null}}:type==='buffer_point'?{type:'buffer_point' as const,params:{label:'Geometry buffer',pointId:'',distanceM:5000}}:type==='sample_raster'?{type:'sample_raster' as const,params:{label:'Sample a raster',attribute:'',valueUnit:''}}:type==='travel_over_ground'?{type:'travel_over_ground' as const,params:{label:'Travel time over ground',attribute:'minutes'}}:type==='map_terms_to_vocabulary'?{type:'map_terms_to_vocabulary' as const,params:{label:'Map to a vocabulary',column:'',decisions:{}}}:type==='clip_raster'?{type:'clip_raster' as const,params:{label:'Clipped raster',method:'all-touched' as const,marginPixels:0}}:type==='chart_output'?{type:'chart_output' as const,params:{label:'Chart'}}:type==='table_output'?newTableOutput():type==='map_output'?newMapOutput():type==='point_input'?newObservations():type==='measure_area'?newAreaMeasurement():['blank','coverage'].includes(exampleKey(workflow))&&type==='study_area'?newStudyArea():template(exampleKey(workflow)).nodes.find(n=>n.type===type));
    // Every zone-taking widget was defaulted to Soho's 30/north in the branches above, which is
    // wrong anywhere else and said nothing about it. Suggest the zone the workflow's own data is
    // in, from the mean longitude of every coordinate already configured. The parameter stays: a
    // study area straddling a boundary has no single right answer, and the Inspector says so
    // when it happens. Experiment 100.
    if(sample&&'params' in sample){
      const configured=sample.params as Record<string,unknown>;
      if(typeof configured.zone==='number'&&typeof configured.hemisphere==='string'){
        const suggested=suggestUTM(workflow);
        if(suggested){configured.zone=suggested.choice.zone;configured.hemisphere=suggested.choice.hemisphere;}
      }
    }
    const id=`${type}-${Date.now()}`;
    const didAdd=change(w=>{const source=['measure_area','raster_input'].includes(type)?w.nodes.find(n=>n.type==='study_area'):type==='clip_raster'?w.nodes.find(n=>n.type==='raster_input'):null;const sizes=drawnSizes(),largest=[...sizes.values()].reduce((m,v)=>({width:Math.max(m.width,v.width),height:Math.max(m.height,v.height)}),{width:0,height:0});
      // The new node is not drawn yet: it is given the room of the largest drawn one, or the default.
      // Beside its source where it has one; otherwise in the part of the canvas on screen.
      const at=freeSpot(w.nodes,source?{x:source.x+310,y:source.y}:{x:180,y:90},sizes,largest.width?largest:undefined,source?null:flow?.visibleArea());const added={...required(sample),id,x:at.x,y:at.y};if(added.type==='output')added.params={view:'bars',label:`Bar chart ${w.nodes.filter(n=>n.type==='output').length+1}`};w.nodes.push(added);if(added.type==='raster_input'||added.type==='clip_raster'){const area=w.nodes.find(n=>n.type==='study_area');if(area)setConnection(w,area.id,id,'area');}selected=id;});if(didAdd===false)return;
    // SEEN WHERE IT LANDS (2026-11-28): a node placed in view leaves the practitioner's zoom alone; one that had to go
    // outside it is scrolled to. Fitting the whole canvas on every add zoomed a large workflow out until the new node was
    // too small to read.
    {const view=flow?.visibleArea(),n=workflow.nodes.find(x=>x.id===id);
      if(n&&view&&!(n.x>=view.x&&n.y>=view.y&&n.x<=view.x+view.width&&n.y<=view.y+view.height))flow?.reveal(id);
      else if(!view)flow?.fit();}
    toast(type==='study_area'?'Study area added. Select its boundary in the Inspector.':`${TYPES[type].title} added. Connect its ports to the workflow.`);
  });
}
function title(n:WorkflowNode){const t=TYPES[n.type];return `<div class="inspector-title ${t.color}"><span class="node-icon">${iconMarkup(n.type,t.icon,22)}</span><div><h2>${esc(n.params.label||t.title)}</h2><p>${esc(t.group)}</p></div></div>`;}
/** How a practitioner is looking at one input's records, per node and per session.
 *
 *  Deliberately NOT part of the workflow. Which view somebody prefers and how many rows they
 *  want in front of them is about reading, not about what the workflow computes, so it does not
 *  travel in the file and does not make the workflow dirty. */
const dataViews=new Map<string,{mode:'table'|'json';rows:number}>();
const ROW_CHOICES=[10,25,50,200];

/** The records themselves, as columns and rows or as the JSON they really are.
 *
 *  The practitioner, 2026-10-15, on a step whose rules would not compile: *"I cannot make sense
 *  of the green error dialog because I cannot see the columns against which rules are made."*
 *  This panel used to list twelve record NAMES and nothing else -- not a column, not a value --
 *  while the Inspector next door asked which column meant which field and the rule editor asked
 *  what to compare. Every one of those questions is about the columns, and the columns were the
 *  one thing never shown.
 *
 *  As a table because that is the shape the questions are in: a row is a record, a column is a
 *  field a rule can read, and the two line up with the bindings underneath. As JSON because a
 *  rule reads what is actually there -- a null, a number written as text, a key nobody expected
 *  -- and a table quietly tidies all three away. */
function recordsPanel(nodeId:string,data:{features:{id?:string|number;properties?:Record<string,unknown>;geometry?:unknown}[]}){
  const view=dataViews.get(nodeId)??{mode:'table' as const,rows:10};
  const features=data.features??[];
  const shown=features.slice(0,view.rows);
  const columns=[...new Set(shown.flatMap(f=>Object.keys(f.properties??{})))];
  const cell=(value:unknown)=>value===null||value===undefined||value===''
    // A missing value is shown AS missing rather than as an empty cell, because "no waiting time
    // recorded" is a case the rules have to handle and an empty cell reads like a tidy zero.
    ?`<em class="record-missing">not recorded</em>`:esc(String(value));
  const body=view.mode==='json'
    ?`<pre class="record-json" tabindex="0" role="region" aria-label="Records as JSON">${esc(JSON.stringify(shown,null,2))}</pre>`
    :columns.length
      ?`<div class="record-table" tabindex="0" role="region" aria-label="Records"><table><thead><tr><th>#</th>`
        +columns.map(c=>`<th>${esc(c)}</th>`).join('')+`</tr></thead><tbody>`
        +shown.map((f,i)=>`<tr><td>${i+1}</td>`
          +columns.map(c=>`<td>${cell(f.properties?.[c])}</td>`).join('')+`</tr>`).join('')
        +`</tbody></table></div>`
      :`<div class="notice">These records carry no columns beyond their location, so a rule reading a column has nothing to read.</div>`;
  return `<span class="inspector-section">The records</span>`
    +`<div class="record-controls">`
    +`<div class="result-switch" role="group" aria-label="How to view the records">`
    +(['table','json'] as const).map(mode=>`<button data-records-view="${mode}" class="${mode===view.mode?'active':''}">`
      +`${mode==='table'?'Table':'JSON'}</button>`).join('')
    +`</div>`
    +`<button class="button small" data-records-quicklook>⤢ Quick look</button>`
    +`<button class="button small" data-records-quality>◳ Data quality</button>`
    +`<label class="records-rows">Showing <select data-records-rows>`
    // Every choice up to and including the first one that covers the whole set, so a set of 13
    // offers 10 and 25 rather than only 10 -- "show me all of them" has to be reachable.
    +ROW_CHOICES.filter((n,i)=>n<features.length||i===0||ROW_CHOICES[i-1]<features.length)
      .map(n=>`<option value="${n}" ${n===view.rows?'selected':''}>${n}</option>`).join('')
    +`</select> of ${features.length}</label></div>`
    +body;
}

/** The node label, as a form with an Apply button.
 *
 *  The practitioner, 2026-10-20: *"The Find Health Facilities widget label cannot be changed like
 *  Study Area, Street Network and Map. Let's move to standardize the labeling with 'Apply Label'
 *  button."* Three different controls existed -- a study-area form, the catchment inspector's
 *  shared field, and a plain `source-label` input on the input widgets -- and a fourth widget had
 *  none at all. One shape now, so a practitioner learns the gesture once. */
/** THE TABLE ON A PORT, resolved without a successful run where that is possible.
 *
 *  The join dialog has to draw the thing being decided, and from 0.3.0 the run REFUSES while the
 *  decision is unmade -- so there is no run result to read, which is exactly when the practitioner
 *  needs the dialog. A `table_input` carries its table in its own params, melting its source file
 *  the way the run would so the dialog sees what the run will see. Anything further upstream needs
 *  a run that got that far, and null says so rather than drawing an empty frame.
 */
/** THE RECORDS ON A PORT, PROPERTIES AND ALL (2026-11-25). `pointChoices` trims every feature to a name and a
 *  geometry, which is what a picker needs and less than a step reads: Cases by period counts by a date in the
 *  properties, Measure distance decides eligibility by the candidates' own attributes, and Reachable junctions reads
 *  `networkNodeId`. A preview built on the trimmed features would describe a different run, and say so in numbers.
 *
 *  Undefined where the records exist only as a step's output: `result.computed` trims by design, so a dialog below
 *  such a step is told it is waiting rather than shown something else. */
function layerOnPort(nodeId:string,port:string):import('./types.js').PointCollection|undefined{
  const e=workflow.edges.find(x=>x.to===nodeId&&x.port===port);
  const from=e&&workflow.nodes.find(n=>n.id===e.from);
  if(!from)return undefined;
  const held=(from.params as {data?:import('./types.js').PointCollection}).data;
  if(held?.features?.length)return held;
  // AN OUTPUT NODE'S FEATURES, while the run that made them still matches the workflow.
  const ran=!dirty?result?.outputs.find(o=>o.nodeId===from.id) as
    {features?:import('./types.js').PointFeature[]}|undefined:undefined;
  return ran?.features?.length?{type:'FeatureCollection',features:ran.features}:undefined;
}
function tableOnPort(w:Workflow,nodeId:string,port:string):import('./data-table.js').DataTable|null{
  const edge=w.edges.find(e=>e.to===nodeId&&e.port===port);
  const from=edge&&w.nodes.find(x=>x.id===edge.from);
  if(!from)return null;
  if(from.type==='table_input'){
    const p=from.params;
    if(p.convertOnRun&&p.sourceTable&&p.wide)
      return declaredWide(wideDataTable(p.sourceTable,
        {...p.wide,valueField:p.valueField,...(p.unit?{unit:p.unit}:{})}),p.wide);
    return p.data.rows.length?declaredWide(p.data,p.wide):null;
  }
  // A point layer that holds its points is a table already, before a run (experiment 200).
  if(from.type==='point_input')return pointsAsTable(from.params.data);
  return result?.tables?.[from.id]??(stoppedTables?.key===storageKey(w)?stoppedTables.tables[from.id]:undefined)??null;
}
function labelForm(id:string,caption:string,value:string,maxLength=60):string{
  return `<form class="field" data-label-form="${id}"><label class="field-label" for="${id}">${caption}</label>`
    +`<input id="${id}" maxlength="${maxLength}" value="${esc(value)}">`
    +`<button type="submit" class="button small">Apply label</button></form>`;
}
/** HOW BROAD THIS WORKFLOW'S STUDY AREA IS, in kilometres, or undefined when nothing says.
 *
 *  Decides which basemaps are worth offering: the practitioner's rule of 2026-10-27, *"the
 *  breadth of the study area should dictate the type of basemap used"*. Measured from the
 *  coordinates the workflow actually carries -- `workflowPositions` is the same derivation the
 *  UTM advice uses, so the two cannot disagree about where the work is.
 *
 *  Undefined rather than zero when there are no coordinates yet: a canvas being built has no
 *  breadth, and withholding a choice because nothing has been measured is guessing in the other
 *  direction. */
function workflowSpanKm():number|undefined{
  const positions=workflowPositions(workflow);
  if(!positions.length)return undefined;
  let west=Infinity,south=Infinity,east=-Infinity,north=-Infinity;
  for(const [lon,lat] of positions){
    if(!Number.isFinite(lon)||!Number.isFinite(lat))continue;
    west=Math.min(west,lon);east=Math.max(east,lon);
    south=Math.min(south,lat);north=Math.max(north,lat);
  }
  if(!Number.isFinite(west)||!Number.isFinite(south))return undefined;
  return extentSpanKm([west,south,east,north]);
}

/** A CONNECTION, SELECTED (2026-11-20): what it joins, in the steps' own names and the receiving port's words, and the
 *  one way to remove it from here. A click on a connection selected it into nothing before; it removed it. */
function renderConnection(id:string):void{
  const edge=workflow.edges.find(e=>e.id===id);
  if(!edge){selected=null;render();return;}
  const from=workflow.nodes.find(n=>n.id===edge.from),to=workflow.nodes.find(n=>n.id===edge.to);
  const name=(n:WorkflowNode|undefined)=>n?(n.params.label||TYPES[n.type].title):'a step no longer here';
  const ordinal=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
  const nth=edge.port==='records'?1:Number(/^records_(\d+)$/.exec(edge.port)?.[1]??0);
  const port=to?.type==='append_rows'&&nth?`${ordinal[nth-1]??`table ${nth}`} table`:portLabel(edge.port).toLowerCase();
  $('#inspector-content').innerHTML=`<div class="inspector-body"><div class="inspector-title"><div><h2>A connection</h2></div></div>`
    +standardSection('Connection',`<p class="standard-sentence">From <strong>${esc(name(from))}</strong> to <strong>${esc(name(to))}</strong>, `
      +`as its ${esc(port)}.</p>`
      +`<div class="inspector-actions"><button type="button" id="remove-connection" class="button danger"${busy?' disabled':''}>Remove connection</button></div>`
      +'<p class="muted">Delete or Backspace removes it too. Undo brings it back.</p>')+'</div>';
  optionalElement('#remove-connection')?.addEventListener('click',()=>{change(w=>{w.edges=w.edges.filter(e=>e.id!==id);});selected=null;render();});
}
function renderInspector(){
  if(selected?.startsWith('result:')){renderEvidence(selected.slice(7));return;}
  if(selected?.startsWith('edge:')){renderConnection(selected.slice(5));return;}
  if(exampleKey(workflow)==='blank'&&!workflow.nodes.some(n=>n.id===selected)){$('#inspector-content').innerHTML='<div class="inspector-body"><p class="description">Add a Study area, then select it to draw the area on the map.</p></div';return;}
  const n=workflow.nodes.find(n=>n.id===selected);if(!n){$('#inspector-content').innerHTML=`<div class="inspector-body"><p class="description">Choose a node to inspect its settings, or select a result to inspect its evidence.</p></div>`;return;}
  // ONE SHAPE FOR EVERY PANEL: title, one line of what it does, the way in for a learner, then the
  // controls. The two links used to sit after whatever alerts a run had raised, so their position
  // moved with the state of the workflow and their size said they were an afterthought.
  const standard=STANDARD_INSPECTOR.has(n.type);
  let content=title(n)+(standard?'':`<p class="description">${esc(n.type==='map_output'&&n.params.inputMode==='raster'?'Display native raster cells and the clipping boundary':TYPES[n.type].description)}. </p>`
    +learnBlock(n.type,esc,hasManual(n.type)?n.type:''));
  const alert=nodeAlert(n.id);
  // The heading names what was found. It read "Out of bounds" for every alert, which is right for
  // a site the streets could not reach and wrong for a field nobody filled in: a declaration gap
  // is not a geometry problem and the columns are not distances. 2026-10-15.
  const gapsOnly=!!alert&&!!alert.gaps?.length&&!alert.unconnected.length&&!alert.offNetwork.length;
  // A third heading, because a value the rules could not read is neither a geometry problem nor
  // something nobody declared: the data is there and this step could not use it.
  const issuesOnly=!!alert&&!!alert.dataIssues?.length&&!alert.gaps?.length
    &&!alert.unconnected.length&&!alert.offNetwork.length;
  // THE WARNING IS READ WHOLE, in a dialog (the practitioner, 2026-11-12: its rightmost columns fell off the Inspector).
  // The Inspector keeps what was found and the way in.
  if(alert)content+=`<div class="inspector-alert" role="alert"><strong>${issuesOnly?'Read as not recorded':gapsOnly?'Not declared':'Out of bounds'} · ${esc(alertHeadline(alert))}</strong>`
    +`<p><button type="button" class="button" id="alert-details">See what was found</button></p>${dirty?'<p class="muted">From the previous run — rerun after changes.</p>':''}</div>`;
  if(!standard)content+=diveDeeperPanel(n.type,esc);
  if(Object.hasOwn(AREA_STEP_INSPECTORS,n.type)){
    // THE FOUR AREA STEPS ON THE STANDARD (area-steps-ui.ts, 2026-11-20).
    content+=(AREA_STEP_INSPECTORS[n.type as keyof typeof AREA_STEP_INSPECTORS] as OwnInspector<NodeType>).markup(n as never,areaStepKit());
  }else if(n.type==='compare_point_sets'){
    content+=compareInspector.markup(n,compareKit());
  }else if(n.type==='network_input'){
    content+=networkInspector.markup(n,networkKit());
  }else if(n.type==='map_output'){
    content+=mapInspector.markup(n,mapKit());
  }else if(n.type==='chart_output'){
    content+=chartInspector.markup(n,chartKit());
  }else if(n.type==='table_output'){
    content+=tableOutputInspector.markup(n,tableOutputKit());
  }else if(n.type==='polygon_input'){
    content+=polygonInspector.markup(n,polygonKit());
  }else if(n.type==='map_image_input'){
    content+=mapImageStep.markup(n,mapImageKit());
  }else if(n.type==='table_input'){
    content+=tableInspector.markup(n,tableKit());
  }else if(n.type==='join_table_to_area'){
    content+=joinInspector.markup(n,joinKit());
  }else if(n.type==='append_rows'){
    content+=appendInspector.markup(n,stepKit());
  }else if(n.type==='detect_unusual_counts'){
    content+=detectInspector.markup(n,stepKit());
  }else if(n.type==='line_input'){
    content+=lineInspector.markup(n,lineKit());
  }else if(n.type==='regression'||n.type==='select_rows'||n.type==='group_table'||n.type==='two_by_two'){
    // MOVED OUT OF APP.TS (table-steps-ui.ts, 2026-11-22).
    content+=(TABLE_STEP_INSPECTORS[n.type as keyof typeof TABLE_STEP_INSPECTORS] as OwnInspector<NodeType>).markup(n as never,tableStepKit());
  }else if(n.type==='relate_table'){
    content+=relateInspector.markup(n,relateKit());
  }else if(n.type==='transmission_chains'||n.type==='space_time_scan'||n.type==='study_design'){
    // MOVED OUT OF APP.TS (outbreak-steps-ui.ts, 2026-11-22).
    content+=(OUTBREAK_STEP_INSPECTORS[n.type] as OwnInspector<NodeType>).markup(n as never,outbreakKit());
  }else if(n.type==='rate'||n.type==='case_series'){
    // MOVED OUT OF APP.TS (series-rate-ui.ts, 2026-11-22).
    content+=(n.type==='rate'?rateInspector.markup(n,seriesRateKit()):caseSeriesInspector.markup(n as WorkflowNode<'case_series'>,seriesRateKit()));
  }else if(n.type==='deduplicate_points'){
    content+=dedupInspector.markup(n,dedupKit());
  }else if(n.type==='find_health_facilities'){
    content+=facilitiesInspector.markup(n,facilitiesKit());
  }else if(n.type==='sample_raster'){
    content+=sampleInspector.markup(n,sampleKit());
  }else if(n.type==='travel_over_ground'){
    content+=travelInspector.markup(n,stepKit());
  }else if(n.type==='map_terms_to_vocabulary'){
    content+=vocabularyInspector.markup(n,vocabularyKit());
  }else if(n.type==='raster_input'||n.type==='clip_raster'){
    content+=rasterInspector.markup(n as never,rasterKit());
  }else if(n.type==='study_area'){
    content+=studyAreaInspector.markup(n,studyAreaKit());
  }else if(n.type==='search_satellite_catalog'){
    // ITS OWN MODULE'S INSPECTOR (2026-11-19): the first widget moved out of app.ts when touched.
    content+=searchCatalogInspector.markup(n,inspectorKit());
  }else if(n.type==='find_satellite_products'){
    content+=findProductsInspector.markup(n,inspectorKit());
  }else if(n.type==='point_input'){
    content+=pointInspector.markup(n,pointKit());
  }else if(n.type==='apply_ruleset'){
    content+=rulesetInspector.markup(n,rulesetKit());
  }else if(n.type==='measure_distance'){
    content+=distanceInspector.markup(n,distanceKit());
  }
  if(['study_area','point_input','measure_area','map_output','table_output'].includes(n.type))content+='<div class="source-card" data-spatial-reference><span class="inspector-section">Coordinate reference system</span><h3>WGS84 · EPSG:4326</h3><p>Stored coordinates: longitude, latitude in degrees (OGC:CRS84). A source reads degrees or a UTM zone and converts on import; Table output can show points in metres, in a UTM zone.</p></div>';
  // A map can always take another point layer: there is no mode in which it cannot draw points.
  if(standard){
    // MANUAL · EVIDENCE · VERSION, the same three on every standard step, then the actions.
    const identity=widgetIdentity(n.type);
    content+=standardSection('Learn and record',`<div class="standard-links">${learnBlock(n.type,esc,hasManual(n.type)?n.type:'')}`
      +`<button id="manage-references" class="button learn-link">Evidence (${(n.references||[]).length})</button></div>`
      +(identity?`<details class="standard-version"><summary>Version ${esc(identity.version)}</summary>${identityMarkup(n.type,esc)}</details>`:'')
      // DIVE DEEPER, kept on the standard (2026-11-20): a step moved to the standard Inspector had lost the link to its
      // validation notebook, Clip polygons' among them.
      +diveDeeperPanel(n.type,esc));
  }else{
  content+=evidenceInspector(n);
  content+=identityMarkup(n.type,esc);
  }
  // INPUTS: ONE WORDING AND ONE BEHAVIOUR FOR EVERY STEP THAT TAKES THEM. The practitioner, 2026-11-07: *"We need to have
  // consistent language and behavior for Inspector based port actions."* Each input is a list named in plain words:
  // "Not connected" first, which disconnects, then every step that can feed it -- the test the canvas applies to a drop
  // -- and choosing one connects it. Also how a person who cannot hit an 11px port connects at all. A source step has
  // no inputs and shows no section. The Map's layer manager keeps its own lists, which also order and name layers.
  const incoming=workflow.edges.filter(e=>e.to===n.id);
  const nameOf=(id:string)=>{const x=workflow.nodes.find(y=>y.id===id);return x?(x.params.label||TYPES[x.type].title):id;};
  // A port shown under its group's choice (PORT_GROUPS) is shown already.
  const shownInGroup=new Set(Object.entries(PORT_GROUPS[n.type]??{}).filter(([group])=>content.includes(`data-connect-port="${group}"`)).flatMap(([,members])=>members));
  const ports=nodeInputs(n).filter(([port])=>!shownInGroup.has(port)&&!content.includes(`data-map-port="${port}"`)&&!content.includes(`data-connect-port="${port}"`));
  if(ports.length)content+=`<div class="inspector-divider"></div><span class="inspector-section">Inputs</span>`
    +ports.map(([port])=>{
      const now=incoming.find(e=>e.port===port)?.from||'';
      const offers=workflow.nodes.filter(x=>x.id===now||validConnection({source:x.id,target:n.id,sourceHandle:'out',targetHandle:port} as Connection));
      return `<label class="field-label" for="connect-${esc(port)}">${esc(portLabel(port))}</label>`
        +`<select id="connect-${esc(port)}" class="connect-port" data-connect-port="${esc(port)}"><option value="">${offers.length?'Not connected':'Nothing in this workflow can feed this yet'}</option>`
        +offers.map(x=>`<option value="${esc(x.id)}"${x.id===now?' selected':''}>${esc(nameOf(x.id))}</option>`).join('')+`</select>`;
    }).join('');
  content+=``+`<div class="inspector-actions"><button id="duplicate-node" class="button small">Duplicate</button><button id="delete-node" class="button small danger">Remove node</button></div>`;
  // One note for all nine zone-taking widgets, appended here rather than written into each of
  // the five places a zone field is rendered. It reports; it does not refuse. `metric()` already
  // refuses a coordinate more than 6 degrees from the central meridian -- which is a zone too
  // wide, so an off-by-one zone passes and costs +0.17% at London's latitude, +0.47% at 15N.
  // A study area has no zone of its own and is where the zone is DECIDED: everything measured
  // afterwards inherits whatever the first measuring widget was given. The practitioner,
  // 2026-10-15: "selecting the study area should automatically suggest the UTM zone and the pros
  // and cons for selecting a particular one if there is more than one possible choice."
  //
  // So the advice appears here too, before any measuring widget exists to carry it, and when the
  // area spans more than one zone it names each candidate with what that choice costs rather
  // than only saying that no answer is right.
  if(n.type==='study_area'&&(n.params as {geometry?:unknown}).geometry){
    const advice=suggestUTM(workflow);
    if(advice){
      const positions=workflowPositions(workflow);
      const name=(c:{zone:number;hemisphere:string})=>`${c.zone}${c.hemisphere==='north'?'N':'S'}`;
      const costOf=(zone:number)=>{
        const choice={zone,hemisphere:advice.choice.hemisphere};
        const worst=positions.reduce((most,position)=>Math.max(most,utmScaleFactor(position,choice)),0);
        return (worst-1)*100;
      };
      const candidates=(advice.straddles.length?advice.straddles:[advice.choice.zone])
        .map(zone=>({zone,cost:costOf(zone)})).sort((a,b)=>a.cost-b.cost);
      content+=`<div class="${advice.straddles.length?'notice':'rule-preview'}" data-zone-advice>`
        +`<strong>Measuring in metres will use UTM zone ${esc(name(advice.choice))}.</strong> `
        +`Suggested from ${advice.positions} coordinate${advice.positions===1?'':'s'} already on this canvas. `
        +`Nothing is set here — the first widget that measures carries the zone, and this is what it will be offered.`
        +(advice.straddles.length
          ?`<p>This area spans ${advice.straddles.length} zones, so <strong>no single zone is right</strong> `
            +`and the choice is which side to keep whole. What each costs, as the most any coordinate `
            +`here would be stretched:</p><table class="inspector-table"><thead><tr><th>Zone</th>`
            +`<th>Worst stretch</th><th></th></tr></thead><tbody>`
            +candidates.map(c=>`<tr><td>${esc(name({zone:c.zone,hemisphere:advice.choice.hemisphere}))}</td>`
              +`<td>${c.cost.toFixed(3)}%</td><td>${c.zone===advice.choice.zone?'holds most of the area':''}</td></tr>`).join('')
            +`</tbody></table>`
            +``
          :` Measured over this area, it stretches ground distance by at most <strong>${candidates[0].cost.toFixed(3)}%</strong>.`)
        +`</div>`;
    }
  }
  const zoned=n.params as Record<string,unknown>;
  if(!standard&&typeof zoned.zone==='number'&&typeof zoned.hemisphere==='string'){
    const advice=suggestUTM(workflow);
    if(advice){
      const chosen={zone:zoned.zone as number,hemisphere:zoned.hemisphere as 'north'|'south'};
      const matches=advice.choice.zone===chosen.zone&&advice.choice.hemisphere===chosen.hemisphere;
      const worst=workflowPositions(workflow).reduce((most,position)=>Math.max(most,utmScaleFactor(position,chosen)),0);
      const name=(c:{zone:number;hemisphere:string})=>`${c.zone}${c.hemisphere==='north'?'N':'S'}`;
      content+=`<div class="${matches?'rule-preview':'notice'}" data-utm-advice>`
        +(matches?`UTM zone ${name(chosen)} matches this workflow's data.`
          :`<strong>This workflow's data is in UTM zone ${name(advice.choice)}</strong>, not ${name(chosen)}.`)
        +` Measured over ${advice.positions} configured coordinate${advice.positions===1?'':'s'}, this zone stretches ground distance by up to <strong>${((worst-1)*100).toFixed(3)}%</strong>.`
        +(advice.straddles.length?` The data spans zones ${advice.straddles.join(' and ')}, so no single zone is right and this is a choice about which side to keep whole.`:'')
        +(matches?'':` <button class="button small" data-use-suggested-zone="${advice.choice.zone}:${advice.choice.hemisphere}">Use zone ${name(advice.choice)}</button>`)
        +`</div>`;
    }
  }
  // WHERE THIS FIGURE GOES IN THE WRITE-UP, for every output widget: Results unless chosen otherwise. The practitioner,
  // 2026-11-05: "all output widgets may have default IMRAD sections but it should be flexible."
  $('#inspector-content').innerHTML=`<div class="inspector-body">${content}</div>`;
  optionalElement('#alert-details')?.addEventListener('click',()=>{const found=nodeAlert(n.id);if(found)openAlertDialog(n,found,issuesOnly,gapsOnly);});
  // QUICK LOOK AT WHAT THIS STEP PRODUCED, for every widget that emits a table.
  //
  // The practitioner, 2026-10-27: *"Any widget that works on a table and outputs a table should
  // enable Quick Look at the output table."* There were two Quick Looks and neither was this
  // one: `table_input` offered a look at the table it IMPORTED, and the records panel offered
  // one for point records. A step in the middle of a chain -- relate, group, derive, select rows,
  // two-by-two -- produced a table a practitioner could only read by switching to the Results
  // tab and finding the right one among several.
  //
  // DERIVED FROM THE PORT CONTRACT rather than listed per widget: `TYPES[type].output==='table'`
  // is the same declaration the canvas uses to decide what may connect to what. A table-emitting
  // widget added later gets this without anybody remembering, which is the failure this file has
  // recorded twice already -- the Inspector's hand-written basemap list, and the catalogue's
  // hand-written group list that left a widget out entirely.
  //
  // The INSPECTED node's own output, not the active result tab: the practitioner is looking at
  // this step, and the panel on the right is showing whichever tab was last chosen.
  if(TYPES[n.type].output==='table'&&n.type!=='table_input'){
    const produced=result?.tables?.[n.id];
    const anchor=$('#inspector-content').querySelector('.inspector-body');
    if(anchor){
      const block=document.createElement('div');
      if(produced){
        block.innerHTML='<div class="inspector-actions">'
          +'<button id="output-quick-look" class="button">\u2922 View this table</button></div>';
      }else{
        // Said rather than hidden. A missing button reads as "this widget cannot do that"; the
        // truth is that there is nothing to look at yet, which is a different thing and is
        // fixed by pressing Run.
        // A BUTTON, NOT A SENTENCE: after a reload the earlier run's tables are gone, and the grey line that stood here
        // read as "this widget has no table view". The practitioner, 2026-11-06, of Select rows by value and Total
        // within groups: *"does not have a before and after table view in the inspector"*. It runs, then opens it.
        // A STEP UNDER CONSTRUCTION the last run tried and could not compute says why (experiment 182).
        const why=result?.unfinished?.find(u=>u.nodeId===n.id)?.message;
        block.innerHTML='<div class="inspector-actions">'
          +'<button id="output-run-look" class="button">\u2922 Run and view this table</button></div>'
          +(why?`<p class="notice notice-warning">The last run could not compute this step: ${esc(why)} It leads to no output yet, so the run went on without it.</p>`
            :'<p class="description">This step emits a table, made when the workflow runs.</p>');
      }
      // AT THE TOP, under what the widget does. Appended, it sat below "Remove node", 1,500 pixels
      // down a long panel, and a practitioner reported on 2026-11-01 that these widgets had no way
      // to view their table. They had; nobody could find it. Measured on South London's workflow.
      const slot=anchor.querySelector('[data-standard-result]');
      const first=anchor.querySelector(':scope > .description');
      if(slot)slot.append(block);else if(first)first.after(block);else anchor.prepend(block);
    }
  }
  if(n.type==='deduplicate_points')dedupInspector.wire(n,dedupKit(),document);
  if(Object.hasOwn(OUTBREAK_STEP_INSPECTORS,n.type))(OUTBREAK_STEP_INSPECTORS[n.type as keyof typeof OUTBREAK_STEP_INSPECTORS] as OwnInspector<NodeType>).wire(n as never,outbreakKit(),document);
  if(n.type==='search_satellite_catalog')searchCatalogInspector.wire(n,inspectorKit(),document);
  if(Object.hasOwn(AREA_STEP_INSPECTORS,n.type))(AREA_STEP_INSPECTORS[n.type as keyof typeof AREA_STEP_INSPECTORS] as OwnInspector<NodeType>).wire(n as never,areaStepKit(),document);
  if(n.type==='find_satellite_products')findProductsInspector.wire(n,inspectorKit(),document);
  optionalElement('#output-section')?.addEventListener('change',event=>{
    const chosen=(event.target as HTMLSelectElement).value as FigureSection|'none';
    change(w=>{const node=required(w.nodes.find(x=>x.id===n.id));
      const params=node.params as {section?:FigureSection|'none'};
      if(chosen===DEFAULT_FIGURE_SECTIONS[node.type as keyof typeof DEFAULT_FIGURE_SECTIONS])delete params.section;
      else params.section=chosen;});
  });
  if(Object.hasOwn(TABLE_STEP_INSPECTORS,n.type))(TABLE_STEP_INSPECTORS[n.type as keyof typeof TABLE_STEP_INSPECTORS] as OwnInspector<NodeType>).wire(n as never,tableStepKit(),document);
  optionalElement('#output-run-look')?.addEventListener('click',async()=>{
    await run();
    // The Inspector is redrawn by the run; its button is the one to press now, if the step produced a table.
    optionalElement('#output-quick-look')?.click();
  });
  optionalElement('#output-quick-look')?.addEventListener('click',()=>{
    const produced=result?.tables?.[n.id];
    if(!produced)return;
    const view=tableViewOf(produced,`${n.params.label||TYPES[n.type].title} \u00b7 output`);
    // WHICH HALF OF THE ROW CAME FROM WHICH TABLE, for a related table only.
    //
    // The practitioner, 2026-10-27: *"pandas also gives you the original keys so you know which
    // half of the row came from which table."* Here exactly one column crosses over, so the
    // annotation is a sentence rather than an `_x`/`_y` suffix -- and a note above the column
    // beats a suffix in the name, because a renamed column is a different column to everything
    // downstream and a note is not.
    const relation=result?.relations?.[n.id];
    if(relation){
      const left=portSourceName(workflow,n.id,'records','the first table');
      const right=portSourceName(workflow,n.id,'related','the second table');
      // Over the columns the VIEW shows, not the stored keys. Quick Look draws a frame, so the
      // left table's `measure` column is gone and its values are the headings -- and those
      // headings are the numbers a reader is here to check. Naming only the stored keys would
      // have left every number column unattributed, which is the half of the row the question
      // was about.
      view.origins=Object.fromEntries(view.columns.map(column=>
        [column,column===relation.bring?`brought from ${right}, matched on ${relation.on}`
          :`from ${left}`]));
      view.note=`${view.note??''} ${relation.related.toLocaleString()} of `
        +`${relation.offered.toLocaleString()} offered rows related`
        +(relation.dropped?`; ${relation.dropped.toLocaleString()} dropped for `
          +`${relation.on} ${relation.gaps.map(g=>g.key).join(', ')}, which are not shown here `
          +`because they are not in this table`:' and none dropped')+'.';
    }
    // THE TABLES THAT CAME IN, so a chain can be read one change at a time. A port with nothing
    // on it is left out rather than shown empty.
    const inputs=(TYPES[n.type].inputs as readonly (readonly [string,string])[])
      .filter(([,type])=>type==='table').flatMap(([port])=>{
        const table=tableOnPort(workflow,n.id,port);
        return table?[{port,table}]:[];
      });
    const stale=dirty?'Settings have changed since this ran, so this is the last run. ':'';
    const befores=inputs.map(({port,table})=>{
      const name=portSourceName(workflow,n.id,port,port);
      const before=tableViewOf(table,`${n.params.label||TYPES[n.type].title} \u00b7 before: ${name}`);
      return {...before,note:`${stale}${before.note??''}`};
    });
    if(befores.length===1)view.note=`${view.note??''} ${shapeChange(befores[0]!)}`;
    view.note=`${stale}${view.note??''}`;
    // THE JOIN'S COLUMNS, MARKED: the key columns in every Before and in After, and the column brought across in After.
    // THE ROWS A SELECTION DROPPED, greyed in its Before by the step's own rule on each row's key value: in the list, or
    // between the two ends, both ends kept. Where the key column is not a column of the view (a wide frame that spread
    // it into columns), nothing is marked rather than guessed (2026-11-06).
    if(n.type==='select_rows'&&befores.length===1){
      const p=n.params,before=befores[0]!,column=p.keyColumn;
      if(before.columns.includes(column)){
        const text=(v:unknown)=>v==null?'':String(v);
        const numeric=p.range&&[p.range.from,p.range.to].every(x=>x===''||Number.isFinite(Number(x)));
        const kept=(v:unknown)=>{
          if(!p.range)return p.leaveOut?!p.values.includes(text(v)):p.values.includes(text(v));
          const x=text(v),{from,to}=p.range;
          if(numeric){const n=Number(x);return Number.isFinite(n)&&(from===''||n>=Number(from))&&(to===''||n<=Number(to));}
          return (from===''||x>=from)&&(to===''||x<=to);
        };
        const dropped=new Set(before.rows.filter(row=>!kept(row[column])));
        before.excluded={rows:dropped,why:p.range
          ?`${column} outside ${p.range.from||'the start'} to ${p.range.to||'the end'}`
          :p.leaveOut?`${column} one of the values left out`:`${column} not one of the values ticked`};
      }
    }
    if(n.type==='relate_table'){
      const p=n.params,keys=[p.on,...(p.alsoOn??[])].filter(Boolean);
      const mark=(v:TableView,extra?:string)=>{v.roles=Object.fromEntries([...keys.map(k=>[k,'key'] as const),
        ...(extra?[[extra,'brought'] as const]:[])].filter(([c])=>v.columns.includes(c)));};
      for(const before of befores)mark(before);
      mark(view,p.bring);
    }
    // KEPT AGAINST THE STEP THAT MAKES THE TABLE (2026-11-25). A computed table has no stored value to carry the
    // reading, so the decision is kept on the step and the run writes it onto what that step produces. Offered on
    // the step's OWN output only: the Before views belong to the steps above, and a decision about one of those is
    // theirs to keep.
    openStepViewer([...befores,{...view,
      onDeclareWide:(reading:import('./types.js').WideReading)=>{
        change(w=>{w.readWide={...w.readWide,[n.id]:reading};});
        toast('Kept. This table is shown wide wherever it is read, from the next run.');
        renderInspector();
      }}],
      stepLabels(inputs.map(({port})=>portSourceName(workflow,n.id,port,port))),esc);
  });
  if(n.type==='find_health_facilities')facilitiesInspector.wire(n,facilitiesKit(),document);
  // SELECT ROWS' CONFIGURATION DIALOG (experiment 186): given each key column's values, and the table where it resolves
  // without a run, so the preview is the rows this draft keeps. Only Apply writes.
  // TOTAL WITHIN GROUPS' CONFIGURATION DIALOG (experiments 186 and 191): given the columns coming in and, where it
  // resolves without a run, the table, so the preview is the table the draft would make. Only Apply writes.
  if(n.type==='table_output')tableOutputInspector.wire(n,tableOutputKit(),document);
  if(n.type==='sample_raster')sampleInspector.wire(n,sampleKit(),document);
  if(n.type==='travel_over_ground')travelInspector.wire(n,stepKit(),document);
  if(n.type==='map_terms_to_vocabulary')vocabularyInspector.wire(n,vocabularyKit(),document);
  if(n.type==='chart_output')chartInspector.wire(n,chartKit(),document);
  if(n.type==='polygon_input')polygonInspector.wire(n,polygonKit(),document);
  if(n.type==='map_image_input')mapImageStep.wire(n,mapImageKit(),document);
  // RELATE'S CONFIGURATION DIALOG (experiment 186). Given the columns each table declares and, where they resolve, the
  // tables themselves, so the preview is the join this draft would make. Only Apply writes.
  if(n.type==='relate_table')relateInspector.wire(n,relateKit(),document);
  optionalElement('#manage-references')?.addEventListener('click',()=>{let baseline=JSON.stringify(n.references||[]);openEvidenceEditor(n,refs=>{const current=workflow.nodes.find(x=>x.id===n.id);if(!current||JSON.stringify(current.references||[])!==baseline)throw new Error('The node changed while editing. Close and reopen its references.');const saved=change(w=>{required(w.nodes.find(x=>x.id===n.id)).references=structuredClone(refs);},{requirePersistence:true});if(saved)baseline=JSON.stringify(refs);return saved;});});
  optionalElement('#add-point-input')?.addEventListener('click',()=>change(w=>{const node=required(w.nodes.find(x=>x.id===n.id)) as WorkflowNode<'map_output'|'table_output'>;node.params.pointInputCount=(node.params.pointInputCount??1)+1;}));
  optionalElement('#remove-point-input')?.addEventListener('click',()=>change(w=>{const node=required(w.nodes.find(x=>x.id===n.id)) as WorkflowNode<'map_output'|'table_output'>,count=node.params.pointInputCount??1;if(count>1){w.edges=w.edges.filter(e=>!(e.to===n.id&&e.port===pointPort(count-1)));node.params.pointInputCount=count-1;}}));
  document.querySelectorAll<HTMLInputElement>('#map-label,#table-label').forEach(el=>el.addEventListener('change',e=>change(w=>required(w.nodes.find(x=>x.id===n.id)).params.label=control(e).value.trim()||TYPES[n.type].title)));
  if(n.type==='compare_point_sets')compareInspector.wire(n,compareKit(),document);
  optionalElement('#polygon-label')?.addEventListener('change',event=>change(w=>{
    getNode(w,n.id,'polygon_input').params.label=(event.target as HTMLInputElement).value;}));
  // WHICH PROPERTY NAMES A LAYER'S MARKS. Stored per source node, beside the pin class.
  document.querySelectorAll<HTMLSelectElement>('[data-mark-label]').forEach(select=>{
    select.onchange=()=>change(w=>{
      const target=getNode(w,n.id,'map_output');
      const held={...(target.params.labelField||{})};
      if(select.value)held[select.dataset.markLabel!]=select.value;
      else delete held[select.dataset.markLabel!];
      if(Object.keys(held).length)target.params.labelField=held;
      else delete target.params.labelField;
    });
  });
  // WHICH ATTRIBUTE HOLDS A LAYER'S PIN CLASS. Stored per source node, the way the symbols are.
  document.querySelectorAll<HTMLSelectElement>('[data-pin-class]').forEach(select=>{
    select.onchange=()=>change(w=>{
      const target=getNode(w,n.id,'map_output');
      const held={...(target.params.pinClassField||{})};
      if(select.value)held[select.dataset.pinClass!]=select.value;
      else delete held[select.dataset.pinClass!];
      if(Object.keys(held).length)target.params.pinClassField=held;
      else delete target.params.pinClassField;
    });
  });
  document.querySelectorAll<HTMLSelectElement>('[data-map-port]').forEach(el=>el.onchange=()=>change(w=>setConnection(w,el.value,n.id,el.dataset.mapPort!)));
  // Applying the suggested zone, so the advice is actionable rather than only stated. It sets
  // both the zone and the hemisphere together: a zone number without its hemisphere is half an
  // answer, and the two defaults were wrong together.
  document.querySelectorAll<HTMLButtonElement>('[data-use-suggested-zone]').forEach(el=>el.onclick=()=>{
    const [zone,hemisphere]=required(el.dataset.useSuggestedZone).split(':');
    change(w=>{const node=required(w.nodes.find(x=>x.id===n.id)).params as Record<string,unknown>;
      node.zone=Number(zone);node.hemisphere=hemisphere;});
  });
  // Switching the kind of input changes what the records port accepts, so anything wired into it
  // is disconnected rather than left in place carrying the wrong shape.
  // Points and a table are not the same shape, so changing which one disconnects what was wired, as Rate does.
  if(n.type==='case_series')caseSeriesInspector.wire(n,seriesRateKit(),document);
  if(n.type==='rate')rateInspector.wire(n,seriesRateKit(),document);
  document.querySelectorAll<HTMLInputElement>('[data-sample]').forEach(el=>el.addEventListener('change',()=>change(w=>{
    const node=required(w.nodes.find(x=>x.id===n.id));(node.params as unknown as Record<string,string>)[required(el.dataset.sample)]=el.value.trim();})));
  // The kept values are a LIST and their ORDER is the order a figure reads in, so a checkbox
  // appends rather than rebuilding the list from the DOM: unticking and re-ticking a value moves
  // it to the end, which is how a practitioner reorders without a second control.
  document.querySelectorAll<HTMLInputElement>('#output-totals').forEach(el=>
    el.addEventListener('change',()=>change(w=>{
      getNode(w,n.id,'table_output').params.totalsAsserted=el.checked||undefined;})));
  document.querySelectorAll<HTMLInputElement>('#chart-label').forEach(el=>el.addEventListener('change',()=>change(w=>{required(w.nodes.find(x=>x.id===n.id)).params.label=el.value.trim()||'Chart';})));
  // Reading, not editing: it opens a dialog and touches nothing that is saved.
  optionalElement('#table-convert-on-run')?.addEventListener('change',e=>{
    const on=(e.currentTarget as HTMLInputElement).checked;
    change(w=>{getNode(w,n.id,'table_input').params.convertOnRun=on;});
    renderInspector();
  });
  optionalElement('#quick-look')?.addEventListener('click',()=>{
    const table=getNode(workflow,n.id,'table_input').params;
    // AS HANDED ON, edits applied and marked (experiment 214).
    openTableViewer({...tableViewOf(applyTableEdits(table.data,editsAt(table.edits??[])).table,n.params.label||'Tabular data'),
      scales:scalesOf(table.columns),
      // KEPT ON THE TABLE, NOT ON THE VIEW (2026-11-25). The practitioner: *"Let's always give the user the option
      // to view them wide and this user decision should cascade downstream for user facing views of that table."*
      // It rides the value as `shownWide`, so the views below inherit the reading rather than each guessing at one.
      onDeclareWide:reading=>{
        // WRITTEN AS A DISPLAY CHOICE, never as the file's own shape: `wide` is provenance that Apply ruleset
        // computes from, and writing a preference there changed what was evaluated (review of 0.196.0).
        change(w=>{const t=w.nodes.find(x=>x.id===n.id);
          if(t?.type==='table_input')t.params.data={...t.params.data,shownWide:reading};});
        toast('Kept. This table is shown wide wherever it is read.');
        renderInspector();
      }},esc);
  });
  // A table's columns are its keys plus its one value field, which is the contract the widget
  // already declares. A ruleset reads them by those names, so the profile speaks of them too.
  optionalElement('#table-fetch-remote')?.addEventListener('click',async e=>{
    const button=e.currentTarget as HTMLButtonElement,say=$('#table-fetch-status');
    const params=getNode(workflow,n.id,'table_input').params;
    if(!params.remote)return;
    // PROGRESS AND A STOP, not a time limit: a slow source is still a working one (2026-11-05, Zenodo at 5 KB/s).
    const host=new URL(params.remote.url).hostname,stop=new AbortController();
    button.disabled=true;say.innerHTML=` <span data-fetch-progress>Fetching from ${esc(host)}…</span> `
      +'<button type="button" class="button small" data-fetch-stop>Stop</button>';
    say.querySelector<HTMLButtonElement>('[data-fetch-stop]')!.onclick=()=>stop.abort();
    const progress=say.querySelector('[data-fetch-progress]')!;
    try{
      const file=await fetchRemoteTable(params.remote,{signal:stop.signal,
        onProgress:(read,total)=>{progress.textContent=`Fetching from ${host}: ${progressText(read,total)}`;}});
      await readFetchedInto(n.id,file);
    }catch(error){button.disabled=false;say.textContent=` ${error instanceof Error?error.message:'The table could not be fetched.'}`;}
  });
  optionalElement('#table-quality')?.addEventListener('click',()=>{
    openDataQuality(tableQualityView(getNode(workflow,n.id,'table_input')),esc);
  });
  // DESCRIBE COLUMNS, from the Inspector at any time; a fetched zip offers its own files as the dictionary, and a
  // dictionary made here for the same source before is offered too.
  // POINT DATA'S COLUMNS, described the same way (experiment 211): the records' attributes, as they are held.
  if(n.type==='point_input')optionalElement('#describe-columns')?.addEventListener('click',()=>{
    const points=getNode(workflow,n.id,'point_input').params;
    const features=points.data.features??[];
    const columns=[...new Set(features.flatMap(f=>Object.keys(f.properties??{})))];
    openColumnsDialog({title:n.params.label||'Point data',columns,held:points.columns??{},
      rows:features.map(f=>columns.map(c=>{const v=f.properties?.[c];return v===null||v===undefined?'':String(v);})),
      ...(points.dictionary?{imported:{name:points.dictionary.name,sheets:points.dictionary.sheets}}:{}),
      onSave:async(declared,check,loaded)=>{
        const dictionary:TableDictionary|undefined=loaded?{name:loaded.name,sha256:await contentHash(loaded.bytes as Uint8Array<ArrayBuffer>),
          sheets:loaded.sheets.map(s=>({name:s.name,headers:s.headers,rows:s.rows})),readAt:new Date().toISOString()}:undefined;
        if(dictionary&&!await keepDataset(dictionaryKeyOf(dictionary.sha256),dictionary))return false;
        await runFinished();
        const saved=change(w=>{const node=getNode(w,n.id,'point_input');
          if(Object.keys(declared).length)node.params.columns=declared;else delete node.params.columns;
          if(dictionary){node.params.dictionary=dictionary;node.params.dictionaryRef=dictionaryKeyOf(dictionary.sha256);}
          if(check)node.params.dictionaryCheck=check;})!==false;
        if(saved&&dictionary)listDictionary(n.id,dictionary,points.sourceInfo?.format??n.params.label??'Point data');
        return saved;}},esc);
  });
  else optionalElement('#describe-columns')?.addEventListener('click',async()=>{
    const table=getNode(workflow,n.id,'table_input').params;
    const columns=describableColumns(table.data,table.wide);
    const archive=table.remote?await archiveOnDevice(table.remote):undefined;
    const key=dictionaryKey(table),own=key?ownDictionaries()[key]:undefined;
    openColumnsDialog({title:n.params.label||'Tabular data',columns,held:table.columns??{},
      rows:fileRows(table.data,table.wide),
      ...(archive?{archive:{entries:archive.entries,read:async entry=>archive.read(entry)}}:{}),
      ...(own?{own:{name:own.name,entries:new Map(Object.entries(own.entries)),savedAt:own.savedAt}}:{}),
      ...(table.dictionary?{imported:{name:table.dictionary.name,sheets:table.dictionary.sheets}}:{}),
      onSave:async(declared,check,loaded)=>{
        // A DICTIONARY READ IN THIS DIALOG becomes the table's own, kept and listed as one imported with it is.
        const dictionary:TableDictionary|undefined=loaded?{name:loaded.name,sha256:await contentHash(loaded.bytes as Uint8Array<ArrayBuffer>),
          sheets:loaded.sheets.map(s=>({name:s.name,headers:s.headers,rows:s.rows})),readAt:new Date().toISOString()}:undefined;
        if(dictionary&&!await keepDataset(dictionaryKeyOf(dictionary.sha256),dictionary))return false;
        await runFinished();
        const saved=change(w=>{const node=getNode(w,n.id,'table_input');
          if(Object.keys(declared).length)node.params.columns=declared;else delete node.params.columns;
          if(dictionary){node.params.dictionary=dictionary;node.params.dictionaryRef=dictionaryKeyOf(dictionary.sha256);}
          if(check)node.params.dictionaryCheck=check;})!==false;
        if(saved&&dictionary)listDictionary(n.id,dictionary,table.source?.filename??table.data.source?.filename??'');
        // THE PRACTITIONER'S DICTIONARY FOR THIS SOURCE, kept on this device so the next table reading the same file
        // is offered it. Accepted descriptions only.
        const entries=entriesFrom(declared);
        if(saved&&key&&entries.size)keepOwnDictionary(key,{name:n.params.label||'Tabular data',
          entries:Object.fromEntries(entries),savedAt:new Date().toISOString()});
        return saved;}},esc);
  });
  // THE DICTIONARY AS IT WAS PUBLISHED, every sheet, read-only (experiment 211).
  optionalElement('#view-dictionary')?.addEventListener('click',()=>{
    const dictionary=(n.type==='point_input'?getNode(workflow,n.id,'point_input'):getNode(workflow,n.id,'table_input')).params.dictionary;if(!dictionary)return;
    const view=(at:number):void=>{const sheet=dictionary.sheets[at]!;
      openTableViewer({title:`${dictionary.name}${dictionary.sheets.length>1?` \u00b7 ${sheet.name}`:''}`,columns:sheet.headers,
        rows:sheet.rows.map(r=>Object.fromEntries(sheet.headers.map((h,i)=>[h,r[i]??'']))),
        note:`The data dictionary imported with ${n.params.label||'this table'}, as published: ${sheet.rows.length} rows. Read ${new Date(dictionary.readAt).toLocaleDateString()}.`,
        ...(dictionary.sheets.length>1?{steps:{labels:dictionary.sheets.map(s=>s.name),at,go:view}}:{})},esc);};
    view(0);
  });
  optionalElement('#add-table-view')?.addEventListener('click',()=>change(w=>{const id=`table-view-${Date.now()}`;w.nodes.push({id,type:'table_output',x:n.x+270,y:n.y,params:{label:'Imported table'}});w.edges.push({id:`e-${Date.now()}`,from:n.id,to:id,port:'table'});selected=id;}));
  if(n.type==='table_input')tableInspector.wire(n,tableKit(),document);
  optionalElement('#open-manual')?.addEventListener('click',()=>openManual(n.type,TYPES[n.type].title,esc));
  optionalElement('#open-zone-manual')?.addEventListener('click',()=>openManual(ZONE_PAGE,'The UTM zone',esc));
  if(n.type==='join_table_to_area')joinInspector.wire(n,joinKit(),document);
  // Clip raster's own download, of the masked grid; Raster input's is in its dialog (186, 2026-11-17).
  // A WINDOW THAT TRAVELLED WITHOUT ITS BYTES (experiment 209): said on the Result line; read again in Configure… (186).
  if(n.type==='raster_input'||n.type==='clip_raster')rasterInspector.wire(n as never,rasterKit(),document);
  if(n.type==='study_area')studyAreaInspector.wire(n,studyAreaKit(),document);
  if(n.type==='network_input')networkInspector.wire(n,networkKit(),document);
  if(n.type==='point_input')pointInspector.wire(n,pointKit(),document);
  document.querySelectorAll<HTMLSelectElement>('[data-connect-port]').forEach(el=>el.onchange=()=>{const port=el.dataset.connectPort!;change(w=>setConnection(w,el.value||null,n.id,port));});
  // Reading, not editing: these redraw the Inspector and touch nothing that is saved, so they
  // go through renderInspector rather than change().
  $('#inspector-content').querySelectorAll<HTMLButtonElement>('[data-records-view]').forEach(el=>
    el.addEventListener('click',()=>{
      const held=dataViews.get(n.id)??{mode:'table' as const,rows:10};
      dataViews.set(n.id,{...held,mode:el.dataset.recordsView as 'table'|'json'});
      renderInspector();
    }));
  // The same table, at a width it can be read at. The panel's own view is a glance; this is the
  // look. Point records get it for the same reason tabular ones do -- the Inspector is 292px.
  $('#inspector-content').querySelectorAll<HTMLButtonElement>('[data-records-quicklook]').forEach(el=>
    el.addEventListener('click',()=>{
      const held=(n.params as {data?:{features?:{properties?:Record<string,unknown>}[]};repairs?:ColumnRepair[]});
      const repairs=held.repairs??[];
      const features=applyRepairs(held.data?.features??[],repairs);
      const columns=[...new Set(features.flatMap(f=>Object.keys(f.properties??{})))];
      openTableViewer({title:n.params.label||TYPES[n.type].title,columns,
        rows:features.map(f=>({...f.properties})),
        // What any ruleset downstream has declared these columns to be. A column is not wrong
        // for being untyped -- it is undeclared -- so this says nothing where nothing was said.
        declared:declaredKinds(workflow,n.id),scales:scalesOf((n.params as {columns?:import('./column-metadata.js').ColumnDeclarations}).columns),
        onRepair:(column,to)=>repairColumn(n.id,column,to),
        note:`${features.length} records, ${columns.length} column${columns.length===1?'':'s'}. `
          +`These are the columns a rule can read; nothing is guessed from a name.`
          +(repairs.length?` ${repairs.length} declared repair${repairs.length===1?'':'s'} `
            +`(${repairs.map(r=>`${r.column} as ${r.to}s`).join(', ')}) are applied to what you see here. `
            +`The records this step holds are unchanged — removing the declaration restores them.`:'')},esc);
    }));
  $('#inspector-content').querySelectorAll<HTMLButtonElement>('[data-records-quality]').forEach(el=>
    el.addEventListener('click',()=>openDataQuality(qualityViewFor(n),esc)));
  $('#inspector-content').querySelectorAll<HTMLSelectElement>('[data-records-rows]').forEach(el=>
    el.addEventListener('change',()=>{
      const held=dataViews.get(n.id)??{mode:'table' as const,rows:10};
      dataViews.set(n.id,{...held,rows:Number(el.value)});
      renderInspector();
    }));
  if(n.type==='apply_ruleset')rulesetInspector.wire(n,rulesetKit(),document);
  if(n.type==='measure_distance')distanceInspector.wire(n,distanceKit(),document);
  optionalElement('#source-label')?.addEventListener('change',e=>change(w=>required(w.nodes.find(x=>x.id===n.id)).params.label=control(e).value.trim()||TYPES[n.type].title));
  optionalElement('#replace-data')?.addEventListener('click',()=>{importNode=n.id;$('#geojson-file').click();});
  // Every label form, one handler. Saving on change stays -- nothing typed is lost by not
  // pressing the button -- and an empty label is refused rather than written onto the canvas.
  document.querySelectorAll<HTMLFormElement>('[data-label-form]').forEach(form=>{
    const input=form.querySelector('input')!;
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const label=input.value.trim();
      if(!label){input.setCustomValidity('Enter a label for this widget.');input.reportValidity();return;}
      input.setCustomValidity('');
      change(w=>{(required(w.nodes.find(x=>x.id===n.id)).params as unknown as Record<string,unknown>).label=label;});
    });
    input.addEventListener('input',()=>input.setCustomValidity(''));
    input.addEventListener('change',()=>{
      const label=input.value.trim();
      if(label)change(w=>{(required(w.nodes.find(x=>x.id===n.id)).params as unknown as Record<string,unknown>).label=label;});
    });
  });
  for(const [selector,key] of [['#map-title','mapTitle'],['#map-subtitle','mapSubtitle'],['#map-source-note','mapSourceNote']] as const)
    document.querySelector<HTMLInputElement|HTMLTextAreaElement>(selector)?.addEventListener('change',e=>change(w=>{getNode(w,n.id,'map_output').params[key]=control(e).value.trim();}));
  document.querySelector<HTMLInputElement>('#map-legend-toggle')?.addEventListener('change',e=>change(w=>getNode(w,n.id,'map_output').params.showLegend=(e.currentTarget as HTMLInputElement).checked));
  document.querySelector<HTMLInputElement>('#map-halo-toggle')?.addEventListener('change',e=>change(w=>getNode(w,n.id,'map_output').params.markHalo=(e.currentTarget as HTMLInputElement).checked));
  // Picking a basemap switches the presentation when it has to. The control used to appear only
  // AFTER the practitioner had found the Presentation selector and set it to interactive, so a
  // basemap was two steps behind a combination nothing announced -- and the practitioner reported,
  // 2026-10-15, looking at a shipped map and finding no basemap at all. Five of the ten maps in
  // the worked examples were two clicks away; the clicks were the defect.
  optionalElement('#table-add-input')?.addEventListener('change',e=>{
    const chosen=control(e).value;
    if(chosen)change(w=>setConnection(w,chosen,n.id,'layer'));
  });
  if(n.type==='map_output')mapInspector.wire(n,mapKit(),document);
  if(n.type==='append_rows')appendInspector.wire(n,stepKit(),document);
  if(n.type==='detect_unusual_counts')detectInspector.wire(n,stepKit(),document);
  if(n.type==='line_input')lineInspector.wire(n,lineKit(),document);
  $('#delete-node').onclick=()=>removeNodes([n.id]);
  $('#duplicate-node').onclick=()=>change(w=>{const copy=structuredClone(n);copy.id=`${n.type}-${Date.now()}`;copy.x+=40;copy.y+=90;w.nodes.push(copy);selected=copy.id;});
  if(busy)$('#inspector-content').querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|HTMLButtonElement>('input,select,textarea,button').forEach(el=>el.disabled=true);
}
function removeNodes(ids:string[]){
  change(w=>{w.nodes=w.nodes.filter(n=>!ids.includes(n.id));w.edges=w.edges.filter(e=>!ids.includes(e.from)&&!ids.includes(e.to));if(ids.includes(w.outputId||''))w.outputId=w.nodes.find(n=>n.type==='output')?.id;if(ids.includes(selected||''))selected=null;});
  // A RESULT OUTLIVES THE NODE THAT MADE IT, and it should not. The practitioner, 2026-10-20:
  // *"when I deleted the Map, Street Network and Study Area, Result Map was still there."* It
  // was: the canvas read "Workflow 0" and the Results panel went on drawing a map of a study
  // area that no longer existed anywhere.
  //
  // This is NOT the same as keeping results while a parameter changes, which is deliberate --
  // "Previous run · settings have changed" lets a practitioner compare before and after. There
  // the node is still there to rerun. Here the thing that produced the result is gone, so the
  // result is an orphan, and an orphan on screen is a claim about a workflow that cannot be
  // rerun to check it.
  if(!result)return;
  const live=new Set(workflow.nodes.map(node=>node.id));
  // AN OUTPUT IS KEYED BY THE NODE THAT PRODUCED IT, so that is what is checked. This stripped a
  // trailing `-map` or `-table` from the id first, and nothing in the application produces an id
  // that needs it: every output sets `nodeId:node.id`. What it did instead was silently orphan
  // any node whose AUTHORED id happens to end that way. `geoprivacy-example` has seven of them --
  // before-map, before-table, after-move-map, after-move-table, comparison-map, after-group-map,
  // after-group-table -- and not one of the stems it strips to exists as a node, so deleting any
  // node in that workspace would have dropped every one of those outputs, and the line below
  // would then have discarded the whole run for having nothing left.
  //
  // Found 2026-10-25 by adding a node called `spot-map` to the John Snow example: deleting the
  // map output took Snow's own map with it, and only because of how it had been named.
  const outputs=result.outputs.filter(output=>live.has(output.nodeId));
  if(!outputs.length){result=null;runWorkflow=null;activeOutputId=null;}
  else if(outputs.length!==result.outputs.length){
    result={...result,outputs};
    if(activeOutputId&&!outputs.some(output=>output.nodeId===activeOutputId))activeOutputId=outputs[0].nodeId;
  }
  renderResults();render();
}
function renderEvidence(id:string){
  const result=activeOutput(),row=result?.rows.find(r=>r.id===id);if(!result||!row){selected=null;renderInspector();return;}
  if(result.kind==='point-table'){$('#inspector-content').innerHTML=pointTableEvidence(row as PointRow,dirty,esc);return;}
  if(result.kind==='spatial-map'){$('#inspector-content').innerHTML=mapEvidence(row as MapRow,dirty,esc);return;}
  renderInspector();
}
function statusLabel(status:string|undefined){return ({Review:'Review',NoFlag:'No flag',Unknown:'Insufficient data'} as Record<string,string>)[status||'Unknown'];}
function renderResults(){
  // RESULTS BELONG TO THE WORKFLOW THAT PRODUCED THEM.
  //
  // The practitioner, 2026-10-24, having fetched South London from the catalog: *"Loaded South
  // London successfully, but it not clear the results panel. The Geoprivacy results are still
  // there."* And then the rule, which is better than the fix that prompted it: *"Default should
  // be result panel should bear outputs of current workflow not another's."*
  //
  // Clearing at each transition is how this keeps coming back. Opening a new empty canvas
  // cleared; loading an example cleared; the two import paths did not, and `importProjectDocument`
  // still did not after both were fixed -- a third door found only by looking. `runWorkflow` is
  // the snapshot that produced `result`, so the question has an answer here and does not depend
  // on anyone remembering: results from another workflow are not this workflow's results, and are
  // discarded rather than shown under its name.
  if(result&&runWorkflow&&storageKey(runWorkflow)!==storageKey(workflow)){
    result=null;runWorkflow=null;activeOutputId=null;
  }
  disposeVegaChart();
  const output=activeOutput();$('.results-panel').classList.toggle('catchment-results',!!output?.polygons);activeOutputId=output?.nodeId||null;
  // A comparison used to take over the lower half of the split for one run. A tab needs no such
  // exception: the whole panel is the result when the practitioner asks for it, and nothing else
  // is competing for the height.
  // What the Results tab says it holds, derived rather than announced.
  const outputs=result?.outputs.length||0;
  $('#result-count').textContent=outputs?String(outputs):'';
  $('#release-download').hidden=!(exampleKey(workflow)==='snow-geoprivacy'&&!!output&&output.nodeId.startsWith('after-'));
  $('.results-panel').classList.toggle('spatial-results',['spatial-map','spatial-coverage'].includes(output?.kind||''));
  const ownedTabs=new Set(outputsOf(selected).map(o=>o.nodeId));
  $('#result-tabs').innerHTML=(result?.outputs||[]).map(o=>`<button id="result-tab-${esc(o.nodeId)}" role="tab" aria-selected="${o.nodeId===activeOutputId}" tabindex="${o.nodeId===activeOutputId?0:-1}" aria-controls="${o.view}-panel" class="${o.nodeId===activeOutputId?'active':''}${ownedTabs.has(o.nodeId)?' linked-to-selection':''}" ${ownedTabs.has(o.nodeId)?'data-linked="true" title="This result comes from the selected node"':''} data-output="${esc(o.nodeId)}">${o.view==='table'?'☷':o.view==='bars'?'▥':'◈'} ${esc(o.label)}</button>`).join('');
  const tabs=[...$('#result-tabs').querySelectorAll<HTMLButtonElement>('[data-output]')];
  tabs.forEach((b,i)=>{b.onclick=()=>{activeOutputId=b.dataset.output!;if(selected?.startsWith('result:'))selected=null;renderResults();render();$(`#result-tab-${activeOutputId}`).focus();};b.onkeydown=e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].click();}};});
  $('#map-panel').hidden=!output||output.view!=='map';$('#table-panel').hidden=!output||output.view!=='table';$('#bars-panel').hidden=!output||output.view!=='bars';
  if(output)$(`#${output.view}-panel`).setAttribute('aria-labelledby',`result-tab-${output.nodeId}`);
  $('#results-empty').hidden=!!output;
  const rows=output?.rows||[];$('#result-metrics').innerHTML=output?`<span class="metric review"><b>${rows.filter(r=>r.status==='Review').length}</b> flagged for review</span><span class="metric"><b>${rows.filter(r=>r.status==='NoFlag').length}</b> no flag</span><span class="metric unknown"><b>${rows.filter(r=>r.status==='Unknown').length}</b> insufficient data</span>`:'';
  if(output?.kind==='access')$('#result-metrics').innerHTML+=`<span class="metric">${output.eligibleCount} eligible facilities · ${rows.length} ${output.locationSource?.kind==='input-points'?'input locations':'grid samples'}</span>`;
  if(output?.kind==='study-area')$('#result-metrics').innerHTML=`<span class="metric"><b>1</b> stored geometry</span><span class="metric">CRS84 · longitude, latitude</span><span class="metric">${output.ready?'N3: ready for spatial analysis':'Source preview'}</span>`;
  if(output?.kind==='study-area'&&output.measurement)$('#result-metrics').innerHTML=`<span class="metric"><b>${esc(formatArea(output.measurement))}</b> enclosed area</span><span class="metric">Approximate · spherical calculation</span>`;
  if(output?.kind==='spatial-coverage')$('#result-metrics').innerHTML=`<span class="metric"><b>${rows.filter(r=>r.decision==='Accept').length}</b> included</span><span class="metric review"><b>${output.reviewCount}</b> need review</span><span class="metric"><b>${output.excludedCount}</b> explicitly excluded</span>`;
  // THE SUMMARY A TABLE WAS COMPUTED FOR, beside the table. A rate ratio emits the four counts
  // it divided, which is what a reader checks -- and the ratio itself then had nowhere to appear,
  // so the headline number vanished from the screen entirely. The practitioner, 2026-10-26: "I do
  // not see rate ratio". A result that carries a stated finding says it here; one that does not
  // is unaffected.
  const stated=(output as unknown as {sentence?:string})?.sentence;
  // AND THE INSTRUMENT ITSELF, WHERE THE RESULT IS ONE. A two-by-two is not a table in the data
  // sense -- it is the epidemiological instrument, with its cells in the letters the equations
  // are written in, its four margins, its total and its estimates with their intervals. Drawn
  // through the same function the write-up's figure calls, so the screen and the publication
  // cannot disagree about what the instrument says. Experiment 153.
  const carried=output as unknown as {twoByTwo?:TwoByTwoResult;unit?:string;
    design?:{design:string;unitOfAnalysis:string;sentence:string}};
  const instrument=carried?.twoByTwo;
  $('#result-statement').innerHTML=(stated?`<p class="result-statement">${esc(stated)}</p>`:'')
    +(instrument?.kind==='two-by-two'?twoByTwoMarkup(instrument,esc,carried.design,carried.unit):'');
  $('#result-statement').hidden=!stated&&!instrument;
  if(output?.kind==='data-table'){const t=output as unknown as import('./data-table.js').DataTable;$('#result-metrics').innerHTML=`<span class="metric">${esc(recordsSaid(t))}</span><span class="metric unknown"><b>${t.missingValueCount}</b> values absent</span><span class="metric">${t.keys.length} key columns · value in ${esc(t.unit||'an unstated unit')}</span>`;}
  if(output?.kind==='point-table')$('#result-metrics').innerHTML=`<span class="metric"><b>${rows.length}</b> records</span><span class="metric"><b>${rows.filter(r=>!r.coordinates).length}</b> missing coordinates</span><span class="metric">CRS84 · longitude, latitude</span>`;
  const table=output?.pointTable?{head:'',body:''}:output?.kind==='spatial-map'?{head:'<th>Record</th><th>Spatial relation</th>',body:rows.map(r=>`<tr data-place="${esc(r.id)}"><td>${esc(r.name)}</td><td>${esc(relationLabel(r.relation!))}</td></tr>`).join('')}:{head:'',body:''};$('#result-head').innerHTML=table.head;$('#result-rows').innerHTML=table.body;
  $('#result-search').value='';tablePage=0;tableAttributePage=0;tableSort=undefined;
  $('#result-search').placeholder=output?.pointTable?'Search all records and attributes…':'Search the rows…';
  $('#point-table-controls').hidden=!output?.pointTable;
  $('#table-panel').classList.toggle('point-table',!!output?.pointTable);
  if(output?.pointTable)renderPointTable();
  const chartNode=runWorkflow?.nodes.find(n=>n.id===output?.nodeId&&n.type==='chart_output') as WorkflowNode<'chart_output'>|undefined;
  if(output?.chart&&chartNode&&chartRenderer(chartNode.params)==='vega-lite'){
    const chartSourceId=runWorkflow?.edges.find(e=>e.to===output.nodeId)?.from;
    // The upstream node's own label, so the figure names the thing a reader recognises rather
    // than the identifier the canvas uses for it.
    const chartContext={sourceId:chartSourceId,runId:result?.runId,
      sourceLabel:runWorkflow?.nodes.find(n=>n.id===chartSourceId)?.params.label};
    const spec=chartVegaSpec(output.chart,chartNode.params,chartContext);
    $('#bars-panel').innerHTML=`<p class="muted">${esc(output.chart.caption)} · ${output.chart.records!==undefined?`${output.chart.total.toLocaleString('en')} cases from ${output.chart.records.toLocaleString('en')} records`:`${output.chart.total.toLocaleString('en')} records`} · grouping: ${esc(output.chart.field)}</p>${output.chart.field==='total'?'<p class="notice">The chart source does not declare a physical unit for this numeric total. Check the source and method before interpreting it.</p>':''}<div id="vega-chart" role="figure" aria-label="${esc(output.chart.caption)}"></div><details><summary>Underlying chart values</summary><table><thead><tr><th>Category</th><th>Value</th></tr></thead><tbody>${output.chart.bins.map(b=>`<tr><td>${esc(b.label)}</td><td>${b.count}</td></tr>`).join('')}</tbody></table></details><details><summary>Vega-Lite specification</summary><pre>${esc(JSON.stringify(spec,null,2))}</pre></details>`;
    const host=$('#vega-chart');void renderVegaChart(host,output.chart,chartNode.params,chartContext).catch(e=>{if(host.isConnected)host.textContent=`Chart could not render: ${errorMessage(e)}. Underlying values remain available below.`;});
  }else if((output as {tree?:unknown}|undefined)?.tree){
    // WHO INFECTED WHOM (experiment 200): the tree, its sentence above it.
    const carried=output as unknown as {tree:import('./transmission-tree.js').TransmissionTree;sentence:string};
    // The sentence is already above, in the result statement; the metrics say what the tree holds.
    const c=carried.tree.counts;
    $('#result-metrics').innerHTML=`<span class="metric"><b>${c.cases}</b> cases</span><span class="metric"><b>${c.chains}</b> chains</span>`
      +`<span class="metric"><b>${c.links}</b> links</span><span class="metric unknown"><b>${c.noInfector}</b> no infector recorded</span>`;
    // VEGA-LITE, as every other chart (the practitioner, 2026-11-09: "Vega lite for tree chart"); the classic renderer
    // keeps the plain SVG.
    if(chartNode&&chartRenderer(chartNode.params)==='vega-lite'){
      const sourceId=runWorkflow?.edges.find(e=>e.to===output!.nodeId)?.from;
      $('#bars-panel').innerHTML='<div id="vega-chart" class="vega-chart"></div>';
      const host=$('#vega-chart');void renderVegaTree(host,carried.tree,chartNode.params,{sourceId,runId:result?.runId,
        sourceLabel:runWorkflow?.nodes.find(n=>n.id===sourceId)?.params.label}).catch(e=>{if(host.isConnected)host.textContent=`Chart could not render: ${errorMessage(e)}.`;});
    }else $('#bars-panel').innerHTML=treeSvg(carried.tree,esc,fillWords(chartNode?.params.chartTitle,figureWords())||'');
  }else $('#bars-panel').innerHTML=output?.chart?chartMarkup(output.chart,esc,chartOrientation(chartNode?.params??{})):'';
  // The figure is drawn from the bins, not scraped from the panel, so it is the same file whichever
  // renderer is on screen -- and it exists at all for the classic bars, which are divs and have no
  // SVG to take.
  const exportable=!!output?.chart&&!!chartNode;
  $('#chart-communication').hidden=!exportable;
  // Rendering the stored specification is asynchronous, because the renderer is loaded on demand:
  // an export is rare and the compiler should not sit in the first paint.
  if(exportable)$('#chart-download-svg').onclick=async()=>{
    const button=$('#chart-download-svg');
    button.disabled=true;
    try{
      const svg=await standaloneChartSvg(output!.chart!,chartNode!.params,
        (()=>{const from=runWorkflow?.edges.find(e=>e.to===output!.nodeId)?.from;
          return {sourceId:from,runId:result?.runId,sourceLabel:runWorkflow?.nodes.find(n=>n.id===from)?.params.label};})());
      download(`${output!.nodeId}-chart.svg`,svg,'image/svg+xml');
    }catch(error){toast(errorMessage(error),{tone:'failure'});}
    finally{button.disabled=false;}
  };
  $('#facility-legend').textContent=output?.kind?'Qualifying facility':'Location';$('#map-note').textContent=output?.kind==='facility-evidence'?'Historical facilities · evidence tiers':output?.kind==='access'?`${output.locationSource?.kind==='input-points'?'Input locations':'Generated samples'} \u00b7 source boundary`:'Local locations · no external map tiles';
  $('#review-legend').textContent=output?.kind==='facility-evidence'?'Contextual / inferential':'Review';$('#clear-legend').textContent=output?.kind==='facility-evidence'?'Direct':'No flag';$('#unknown-legend').textContent=output?.kind==='facility-evidence'?'No evidence':'Unknown';$('#facility-legend').parentElement!.hidden=output?.kind==='facility-evidence';
  $('.map-legend').hidden=output?.kind==='study-area';
  if(output?.kind==='spatial-coverage'){$('#review-legend').textContent='Needs review';$('#clear-legend').textContent='Inside / boundary';$('#unknown-legend').textContent='Excluded';$('#facility-legend').parentElement!.hidden=true;$('#map-note').textContent='Missing coordinates appear in the review table';}
  if(output?.kind==='spatial-map'){
    $('#result-metrics').innerHTML=['Inside','Boundary','Outside','MissingLocation'].map(relation=>`<span class="metric"><b>${rows.filter(r=>r.relation===relation).length}</b> ${esc(relationLabel(relation as SpatialRelation))}</span>`).join('');
    $('#review-legend').textContent='Outside boundary';$('#clear-legend').textContent='Inside / on boundary';$('#unknown-legend').textContent='Missing coordinates (not plotted)';$('#facility-legend').parentElement!.hidden=true;$('#map-note').textContent='Local map · all located points remain visible';
    // WHAT THE LINES SHOW AND WHAT THEY LEAVE OUT, where the figure is read, not only in the receipt.
    const linkCounts=(output as {linkCounts?:Record<string,import('./map-links.js').LinkCounts>}).linkCounts||{};
    // As counts beside the relations', each with its words; the full sentence is in the receipt and the Inspector.
    for(const c of Object.values(linkCounts))
      $('#result-metrics').insertAdjacentHTML('beforeend',[[c.drawn,'lines drawn'],[c.sameLocation,'links at one place, not drawn'],
        [c.noValue,`name nothing in ${c.column}`],[c.notFound+c.self+c.ambiguous+c.unlocated,'links that could not be drawn']]
        .filter(([v],i)=>i<2||Number(v)>0).map(([v,words])=>`<span class="metric"><b>${Number(v).toLocaleString('en-US')}</b> ${esc(String(words))}</span>`).join(''));
  }
  const spatial=['spatial-map','spatial-coverage'].includes(output?.kind||''),missing=spatial?rows.filter(r=>!r.coordinates):[];
  // The amber sentence went on 2026-10-21. It named a colour the map stopped using when hue was
  // given to the source layer, and it repeated counts that now sit above the map in
  // `#result-metrics` -- *"both probably stale ... and also above the map ... and incorrect (there
  // are no amber points)"*. What is left is the part the counts do not carry: a record with no
  // coordinates is not on the map at all, so the reader is told where it went instead.
  $('#map-spatial-notice').hidden=output?.view!=='map'||!missing.length;
  $('#map-spatial-notice').textContent=missing.length
    ?`${missing.length} ${missing.length===1?'record has':'records have'} no usable location and ${missing.length===1?'is':'are'} listed below rather than plotted.`
    :'';
  $('#map-missing-records').innerHTML=missing.map(r=>`<button class="button small" data-map-record="${esc(r.id)}">${esc(r.name)} · missing coordinates</button>`).join('');
  $('#map-missing-records').hidden=output?.view!=='map';
  $('#map-missing-records').querySelectorAll<HTMLButtonElement>('[data-map-record]').forEach(el=>el.onclick=()=>selectResult(el.dataset.mapRecord!));
  // ONLY WHERE IT WORKS. These checkboxes hide layers by setting `display:none` on the SVG plot's
  // marks, which an interactive map does not have -- it has Leaflet's own layer control, in the
  // corner of the map. Shown on an interactive map they were three checkboxes that did nothing.
  // Reported 2026-10-21: *"those three checkboxes at the bottom of the map about the facilities
  // do not seem to perform any role."*
  // Hidden by default and turned on by `renderMap`, which is the only place that knows which
  // renderer drew: reading the DOM here asked before the map was built.
  $('#map-layer-list').hidden=true;
  // THE PLATE IS A LAYER HERE TOO, with the same checkbox the point layers get.
  //
  // The practitioner, 2026-10-27: *"I meant for the water supply map to be a layer, so checkbox
  // can show and hide it."* On the interactive map Leaflet's own control does it; a static figure
  // has this list instead, and the plate belongs in it for the same reason -- flipping 1855 on
  // and off under a modern result IS the comparison, and a backdrop nobody can remove is a
  // picture rather than evidence.
  //
  // It is listed FIRST because it is drawn first, so the list reads in the order the figure
  // stacks. Keyed by the plate node's own id, which is what `hiddenMapLayers` already stores.
  const plateEntry=output?groundImagesFor(output.nodeId).map(listedPlate=>
    `<label><input type="checkbox" data-map-layer="${esc(listedPlate.sourceNodeId)}" `
      +`${hiddenMapLayers.get(output.nodeId)?.has(listedPlate.sourceNodeId)?'':'checked'}> `
      +`${esc(mapImageCredit(listedPlate))} (backdrop)</label>`).join(''):'';
  $('#map-layer-list').innerHTML=plateEntry+(output?.pointLayers||[]).map(layer=>`<label><input type="checkbox" data-map-layer="${esc(layer.sourceNodeId)}" ${hiddenMapLayers.get(output!.nodeId)?.has(layer.sourceNodeId)?'':'checked'}> ${esc(layer.label)} (${layer.count})</label>`).join('');
  $('#map-layer-list').querySelectorAll<HTMLInputElement>('[data-map-layer]').forEach(el=>el.onchange=()=>{const hidden=hiddenMapLayers.get(output!.nodeId)||new Set();if(el.checked)hidden.delete(el.dataset.mapLayer!);else hidden.add(el.dataset.mapLayer!);hiddenMapLayers.set(output!.nodeId,hidden);renderMap();});
  // THE SAME CHECK AN INPUT GETS, over the table a practitioner actually reads. An output table
  // is the last point before a figure or a count leaves this application, and OSM is known for
  // fields that are mostly absent -- the practitioner, 2026-10-21, asking for the input tables'
  // data-quality check here too. As a REPORT: you repair an input, not a result, so the dialog
  // opens with the profiles, the missingness and the shapes, and nothing to press.
  const quality=$('#result-quality');
  const shown=activeOutput() as (import('./results.js').Output&{pointTable?:boolean;rows?:{attributes?:Record<string,unknown>}[];sourceNodeId?:string|null})|undefined;
  const tabular=!!shown?.pointTable&&(shown.rows?.length||0)>0;
  quality.hidden=!tabular;
  quality.onclick=()=>{
    const rows=(shown?.rows||[]).map(row=>({...row.attributes}));
    const columns=[...new Set(rows.flatMap(row=>Object.keys(row)))];
    if(!columns.length){toast('This table has no attributes to profile.');return;}
    openDataQuality({title:`${shown?.label||'Results'} · data quality`,columns,rows,
      declared:runWorkflow&&shown?declaredKinds(runWorkflow,shown.sourceNodeId||shown.nodeId):{}},esc);
  };
  $('#result-rows').querySelectorAll<HTMLElement & SVGElement>('[data-place]').forEach(el=>{el.onclick=()=>selectResult(el.dataset.place!);el.onkeydown=e=>{if(e.key==='Enter')selectResult(el.dataset.place!);};});
  const raster=output?.raster;$('#raster-download').hidden=!raster;$('#raster-download').onclick=()=>{if(raster)try{downloadRaster(raster);}catch(e){toast(errorMessage(e),{tone:'failure'});}};const panelsOf=(output as {rasterPanels?:import('./raster-panels.js').DrawnDensity[]}|undefined)?.rasterPanels;if(panelsOf?.length){const scalesNow=panelScalesOf(output,panelsOf);$('#result-metrics').textContent=`${panelsOf.length} rasters ${output&&(workflow.nodes.find(x=>x.id===output.nodeId) as WorkflowNode<'map_output'>|undefined)?.params.arrangement?'side by side':'on one map'} · ${scalesNow.length===1?`${scalesNow[0]!.label} in each cell, one scale`:scalesNow.map(x=>`${x.label} for ${x.layers.join(', ')}`).join('; ')} · drawn cells about ${Math.round(Math.max(...panelsOf.map(p=>p.drawnCellM))).toLocaleString('en')} m across`;$('.map-legend').hidden=true;}else if(raster){$('#result-metrics').textContent=`${raster.metadata.width} x ${raster.metadata.height} cells | ${validCells(raster.values).toLocaleString('en')} valid | ${raster.mask?(raster.mask.method==='all-touched'?'All-touched polygon mask':'Cell-center polygon mask')+' / margin '+(raster.mask.marginPixels||0)+' px':'Unmasked input window'} | Source-reported units: ${raster.asset.provenance?.units||'Not supplied'}`;$('.map-legend').hidden=true;}else $('.map-legend').hidden=false;
  if(output?.polygons){const p=output.polygons;$('.map-legend').hidden=true;$('#map-note').textContent=p.method;$('#result-metrics').textContent=p.kind==='hexbin'?`${p.features.length} released H3 cells / ${p.summary?.matched} locations represented / ${p.summary?.unmatched} locations in omitted sparse cells`:p.summary?`${p.summary.records} locations / ${p.summary.matched} matched / ${p.summary.unmatched} outside / ${p.summary.missingLocation} missing location / ${p.summary.multiple} multiple memberships`:p.features.length+' polygon'+(p.features.length===1?'':'s');$('#map-note').textContent=p.method+' / '+p.notes.join(' ');}
  if(exampleKey(workflow)==='snow-geoprivacy'&&output)$('#map-note').textContent=(output.nodeId.startsWith('before-')?'PRIVATE SOURCE · original coordinates. ':'DERIVED DISPLAY · educational transformation; no anonymity guarantee. ')+$('#map-note').textContent;
  renderMap();
  if(result){$('#n3-preview').textContent=result.receipts.map(receiptText).join('\n\n');}
}
/** CELLS WITH A VALUE, COUNTED, NOT COPIED (2026-11-17). `values.filter(...)` on Botswana's WorldPop window, 123,199,344
 *  cells, gathered every kept value one by one before building the result, past what one tab may hold: the tab died
 *  just after the run, in Chrome on Windows and on the Mac. It also counted every cell, since no data is NaN, not null. */
function validCells(values:ArrayLike<number|null>):number{let n=0;for(let i=0;i<values.length;i++){const v=values[i];if(typeof v==='number'&&Number.isFinite(v))n++;}return n;}
function renderPointTable(){
  const active=required(activeOutput()) as {kind?:string};
  const dataView=$('#data-table-view');
  // THE TABLE AS ITS PRESENTATION SAYS (Table 0.15.0): a title above where it says more than the tab's name, its notes and
  // source below, every other row shaded where asked.
  const presenter=workflow.nodes.find(n=>n.id===activeOutputId);
  const present=presenter?.type==='table_output'?presenter.params.presentation:undefined;
  const caption=$('#table-caption'),notes=$('#table-notes');
  caption.textContent=present?.caption??'';caption.hidden=!present?.caption;
  // THE NOTES BELOW IN THE STANDARD'S ORDER (2026-11-28): column notes by number, the small-cell marks, notes, source.
  const shownColumns=(()=>{const a=activeOutput() as {kind?:string}|undefined;
    if(a?.kind==='data-table')return dataTableColumns(a as unknown as import('./data-table.js').DataTable).map(c=>c.name);
    return pointTableColumns(a as unknown as TableValue,{attributePage:tableAttributePage}).columns.map(c=>c.label);})();
  notes.innerHTML=tableNotesHtml(present,shownColumns,esc);
  notes.hidden=!notes.innerHTML;
  $('#table-panel').classList.toggle('table-shaded',!!present?.shade);
  if(active.kind==='data-table'){
    // Rendered in its own container: the point-table grid and its controls stay in the DOM,
    // because a later point-table tab reads #result-head and #result-rows directly.
    dataView.hidden=false;$('#point-table-grid').hidden=true;$('#point-table-controls').hidden=true;
    // The assertion belongs to the OUTPUT NODE, not to the table: it is a claim about a figure
    // somebody is composing, and the same table may be totalled in one figure and not another.
    const owner=workflow.nodes.find(n=>n.id===activeOutputId);
    const asserted=owner?.type==='table_output'&&owner.params.totalsAsserted===true;
    dataView.innerHTML=dataTableMarkup(active as unknown as import('./data-table.js').DataTable,esc,{query:$('#result-search').value,page:tablePage,assertTotals:asserted,present});
    dataView.querySelectorAll<HTMLButtonElement>('[data-table-page]').forEach(b=>b.onclick=()=>{tablePage=Number(b.dataset.tablePage);renderPointTable();});
    return;
  }
  dataView.hidden=true;dataView.innerHTML='';$('#point-table-grid').hidden=false;
  const table=pointTableMarkup(required(activeOutput()) as unknown as TableValue|CoverageValue,esc,{query:$('#result-search').value,page:tablePage,attributePage:tableAttributePage,sort:tableSort,present});
  $('#result-head').innerHTML=table.head;$('#result-rows').innerHTML=table.body;$('#point-table-controls').innerHTML=table.controls;
  $('#point-table-controls').querySelectorAll<HTMLButtonElement>('[data-table-page]').forEach(b=>b.onclick=()=>{tablePage=Number(b.dataset.tablePage);renderPointTable();});
  $('#point-table-controls').querySelectorAll<HTMLButtonElement>('[data-table-fields]').forEach(b=>b.onclick=()=>{tableAttributePage=Number(b.dataset.tableFields);renderPointTable();});
  // Re-ordering returns to the first page: the point of ranking is to see the extreme, and
  // keeping the offset would sort the table and then show the middle of it.
  $('#result-head').querySelectorAll<HTMLButtonElement>('[data-table-sort]').forEach(b=>b.onclick=()=>{
    tableSort={column:b.dataset.tableSort!,direction:b.dataset.tableDirection as import('./table-output.js').SortDirection};
    tablePage=0;renderPointTable();
  });
  // THE SAME CHECK AN INPUT GETS, over the table a practitioner actually reads. An output table
  // is the last point before a figure or a count leaves this application, and OSM is known for
  // fields that are mostly absent -- the practitioner, 2026-10-21, asking for the input tables'
  // data-quality check here too. As a REPORT: you repair an input, not a result, so the dialog
  // opens with the profiles, the missingness and the shapes, and nothing to press.
  const quality=$('#result-quality');
  const shown=activeOutput() as (import('./results.js').Output&{pointTable?:boolean;rows?:{attributes?:Record<string,unknown>}[];sourceNodeId?:string|null})|undefined;
  const tabular=!!shown?.pointTable&&(shown.rows?.length||0)>0;
  quality.hidden=!tabular;
  quality.onclick=()=>{
    const rows=(shown?.rows||[]).map(row=>({...row.attributes}));
    const columns=[...new Set(rows.flatMap(row=>Object.keys(row)))];
    if(!columns.length){toast('This table has no attributes to profile.');return;}
    openDataQuality({title:`${shown?.label||'Results'} · data quality`,columns,rows,
      declared:runWorkflow&&shown?declaredKinds(runWorkflow,shown.sourceNodeId||shown.nodeId):{}},esc);
  };
  $('#result-rows').querySelectorAll<HTMLElement & SVGElement>('[data-place]').forEach(row=>{row.onclick=()=>selectResult(row.dataset.place!);row.onkeydown=e=>{if(e.key==='Enter')selectResult(row.dataset.place!);};});
}
function selectResult(id:string){selected=`result:${id}`;renderLibrary($('#node-search').value);flow?.update(playbackView(),null,statuses);renderInspector();renderMap();}
let disposeCatchmentMap:(()=>void)|undefined;
/** A MAP IS NOT BUILT INTO A HIDDEN PANEL. With the results as a tab, rendering while the canvas
 *  is on screen mounts Leaflet into a container of zero size, and its scale control computes
 *  `containerPointToLatLng` on that -- "Invalid LatLng object: (NaN, NaN)", which the run's catch
 *  reported as the WORKFLOW stopping. Reported 2026-10-21 on a map of three facility sources, and
 *  reproduced on the measles example the same day. The map is drawn when its tab is the one being
 *  shown, and `switchView` renders on arrival. */
function resultsOnScreen(){return $('.work-area').classList.contains('showing-results');}
/** Fetch and place a raster basemap under a static figure, if this map asked for one.
 *
 *  Refuses the vector providers by name. OpenFreeMap serves vector tiles rendered by MapLibre,
 *  and baking those needs a GL canvas rasterised first; saying so is better than drawing nothing
 *  and letting a practitioner conclude the control is broken. */
/** THE PLATE CONNECTED TO THIS MAP, read at render time rather than carried through the run.
 *
 *  Ground is layer 0 and is not a MODE. `map_output` is single-mode -- the mode that wins drops
 *  every other layer from the value before a renderer sees it -- and that has produced the same
 *  defect three times in this file, reported on 2026-10-20 and twice after. A basemap avoids it
 *  by being read from the node at render time instead of travelling in the value, and a plate is
 *  the same kind of thing. So it is read the same way.
 *
 *  Undefined where nothing is connected, where the connected node has no image yet, or where its
 *  georeference does not survive `mapImage` -- a figure without ground rather than a broken one. */
/** EVERY SHEET UNDER A MAP, in the order of its ground ports, so a later sheet draws over an earlier one (TODO 35). */
function groundImagesFor(mapNodeId:string|undefined,source:Workflow=workflow):(MapImage&{sourceNodeId:string})[]{
  if(!mapNodeId)return [];
  return source.edges.filter(e=>e.to===mapNodeId&&isGroundPort(e.port))
    .sort((a,b)=>a.port.localeCompare(b.port,'en',{numeric:true}))
    .flatMap(edge=>{const node=source.nodes.find((n):n is WorkflowNode<'map_image_input'>=>n.id===edge.from&&n.type==='map_image_input');
      if(!node)return [];try{return [{...mapImage(node),sourceNodeId:node.id}];}catch{return [];}});
}
function groundImageFor(mapNodeId:string|undefined,
  /** WHICH CANVAS TO READ IT OFF, because the write-up draws figures for workflows that are not
   *  the open one. The default is the open canvas, which is what the live map wants: a plate is
   *  presentation and must appear the moment it is wired, not at the next run. The write-up
   *  passes the workflow its run came from, so a figure in one project's write-up cannot pick up
   *  the plate of whatever canvas happens to be open. */
  source:Workflow=workflow):(MapImage&{sourceNodeId:string})|undefined{
  if(!mapNodeId)return undefined;
  // The node id travels with it: the layer list keys a checkbox by the SOURCE node, the way it
  // does for every point layer, so hiding one plate does not hide another.
  return groundImagesFor(mapNodeId,source)[0];
}

async function drawStaticBasemap(result:Output,svg:SVGSVGElement,
  frame:{bounds:[number,number,number,number];project:(c:Position)=>[number,number]},
  /** OFF THE PAGE, for the write-up (2026-11-14): the figure is drawn into an element that is never shown, so its tiles
   *  are kept when they arrive, the page's map note is left alone, and the workflow is the one the run came from. */
  offPage?:{workflow:Workflow;hidden?:Set<string>}):Promise<boolean>{
  // READ FROM THE LIVE WORKFLOW, not from the snapshot as run. A basemap is presentation: it
  // changes nothing the run computed, so it must appear the moment it is chosen. Reading
  // `runWorkflow` here meant choosing one did nothing at all until the workflow was run again,
  // which is the second way this control could look broken on the same day.
  const node=offPage?offPage.workflow.nodes.find((n):n is WorkflowNode<'map_output'>=>n.id===result.nodeId&&n.type==='map_output')
    :(workflow.nodes.find((n):n is WorkflowNode<'map_output'>=>n.id===result.nodeId&&n.type==='map_output')
    ??runWorkflow?.nodes.find((n):n is WorkflowNode<'map_output'>=>n.id===result.nodeId&&n.type==='map_output'));
  // THE PLATE FIRST, and ABOVE the guard below: a figure may carry a historical plate and no
  // basemap at all, and that guard returns early for `none`. It is the more specific ground --
  // a basemap says where this is and a plate says what was there -- so it sits over the tiles
  // and under everything the workflow produced.
  // EVERY SHEET, in port order, each over the one before (TODO 35); unchecked in the layer list means not drawn.
  const drawnPlates=groundImagesFor(node?.id,offPage?.workflow??workflow).filter(plate=>!(result.nodeId
    &&(offPage?offPage.hidden:hiddenMapLayers.get(result.nodeId))?.has(plate.sourceNodeId)));
  let after:Element|undefined=[...svg.children].find(child=>child.tagName.toLowerCase()==='rect');
  for(const plate of drawnPlates){
    const markup=mapImageMarkup(plate,frame.project as (c:[number,number])=>[number,number]);
    if(!markup)continue;
    const holder=document.createElementNS('http://www.w3.org/2000/svg','g');holder.setAttribute('data-plate',plate.sourceNodeId);holder.innerHTML=markup;
    if(after)after.after(holder);else svg.prepend(holder);after=holder;
    for(const shape of svg.querySelectorAll('[data-fill-role="context"]'))shape.setAttribute('fill','none');
  }
  if(drawnPlates.length){
    const plateNote=offPage?null:$('#map-panel').querySelector('#map-note');
    if(plateNote)plateNote.textContent=drawnPlates.map(plate=>`${mapImageCredit(plate)} \u00b7 drawn as ground at about `
      +`${plate.groundResolutionM.toFixed(0)} m per pixel`).join('; ')+'. Context: a plate is ink, not measurement.';
  }
  // A STYLE ON THE PERSON'S OWN KEY is not drawn into a figure (experiment 222): its ground here is OpenStreetMap's.
  const choice=node?staticGround(basemapOf(node.params.basemap)):undefined;
  if(!node||!choice||choice==='none')return drawnPlates.length>0;
  const note=offPage?null:$('#map-panel').querySelector('#map-note');
  // THE GROUND'S CREDIT FOLLOWS THE MAP'S OWN NOTE, never replaces it: once OpenStreetMap became the default (2026-11-10)
  // every map lost its caption to "9 of 9 tiles ..." this way. Only what this added before is taken back out.
  const say=(text:string)=>{if(!note)return;const el=note as HTMLElement,prev=el.dataset.ground||'';
    let own=el.textContent||'';if(prev&&own.endsWith(prev))own=own.slice(0,own.length-prev.length).replace(/ \u00b7 $/,'');
    el.dataset.ground=text;el.textContent=own?`${own} \u00b7 ${text}`:text;};
  // THE BUNDLED OUTLINE, which needs no network and no provider. Drawn in the figure's own
  // projection: a coastline is lon/lat points and goes through `project` like every other layer,
  // which is why it sidesteps the Mercator mismatch a raster tile forces.
  if(choice==='natural-earth-110m'){
    const {markup,drawn}=naturalEarthMarkup(frame.bounds,frame.project);
    const background=[...svg.children].find(child=>child.tagName.toLowerCase()==='rect');
    if(markup){
      if(background)background.insertAdjacentHTML('afterend',markup);
      else svg.insertAdjacentHTML('afterbegin',markup);
      for(const shape of svg.querySelectorAll('[data-fill-role="context"]'))shape.setAttribute('fill','none');
    }
    say(drawn
      ?`${NATURAL_EARTH_CREDIT} \u00b7 ${drawn} shapes drawn into this figure. Context only: these `
        +'lines are generalised to kilometres and are not a frame to measure or report by.'
      :`${NATURAL_EARTH_CREDIT} covers no land inside this extent, so this figure has no ground `
        +'under it.');
    return drawnPlates.length>0||!!drawn;
  }
  const provider=choice==='osm'||choice==='topo'?TILE_PROVIDERS[choice]:undefined;
  if(!provider){
    say(`${BASEMAP_OPTIONS.find(o=>o.value===choice)?.label||choice} is drawn from vector tiles, which this `
      +'static plot cannot bake in. Choose OpenStreetMap or OpenTopoMap here, or the interactive presentation for that style.');
    return drawnPlates.length>0;
  }
  const stamp=svg.dataset.renderStamp=String(Date.now());
  // GROUND THAT CANNOT BE FETCHED IS A FIGURE WITHOUT GROUND, not a broken application. Both
  // call sites float this promise, so a rejecting tile request reached the page as an unhandled
  // error -- WebKit reports it as a bare "Load failed", which says nothing about tiles and
  // appears on a figure that otherwise drew correctly. Offline is the ordinary case for this
  // application, and the one it is built for.
  let images;
  try{images=await basemapImages(frame.bounds,frame.project,provider,fetchTileAsDataURI);}
  catch{
    if(svg.dataset.renderStamp!==stamp||(!offPage&&!svg.isConnected))return true;
    const name=BASEMAP_OPTIONS.find(o=>o.value===choice)?.label||choice;
    say(`${name} tiles could not be fetched, so this figure is drawn `
      +'without its ground. The plot above is unaffected: a basemap is layer 0 and carries none of '
      +'what the workflow computed.');
    return drawnPlates.length>0;
  }
  const {markup,drawn,requested,zoom}=images;
  // The figure may have been replaced while the tiles were in flight; off the page, it is the write-up's and kept.
  if(svg.dataset.renderStamp!==stamp||(!offPage&&!svg.isConnected))return true;
  // AFTER THE BACKGROUND, NOT BEFORE IT. `oldMap` opens by painting an opaque rect across the
  // whole frame, so inserting the tiles at `afterbegin` drew the ground and then covered it --
  // the practitioner saw a sliver of basemap above the plot and nothing within it: *"look at the
  // top of that map, I think the basemap is hidden in the back"*. Ground belongs above the blank
  // background and below everything the workflow produced, which is what layer 0 means.
  if(markup){
    // AFTER THE BACKGROUND RECT, found by what it is rather than where it sits. Every static
    // renderer opens by painting an opaque rect across its frame, but not all of them open WITH
    // it: the walking-time plot emits a `<desc>` first, so "after the first child" put the ground
    // back underneath the paint it was meant to sit on. Ground belongs above the blank background
    // and below everything the workflow produced, which is what layer 0 means.
    const background=[...svg.children].find(child=>child.tagName.toLowerCase()==='rect');
    if(background)background.insertAdjacentHTML('afterend',markup);
    else svg.insertAdjacentHTML('afterbegin',markup);
    // A FILL THAT ENCODES NOTHING MUST NOT HIDE WHAT IS UNDER IT. The practitioner, 2026-10-25:
    // *"If the shade carries value, then make the shade translucent but discernible. If not, e.g.,
    // just a boundary, it should be transparent, only the border shows."*
    //
    // Withdrawn here rather than never drawn, because the two cases are genuinely different: on a
    // blank page a pale wash separates figure from ground and earns its place, and over a basemap
    // the ground is already there and the wash only covers it. The polygons that DO carry a value
    // -- catchments, travel-time bands, hex counts -- are already translucent at about a fifth
    // and are left alone, which is the other half of the same rule.
    for(const shape of svg.querySelectorAll('[data-fill-role="context"]'))shape.setAttribute('fill','none');
  }
  say(drawn
    ?`${provider.attribution} · ${drawn} of ${requested} tiles at zoom ${zoom}, drawn into this figure.`
    :`No basemap tiles could be fetched, so this figure has no ground under it. ${provider.attribution}`);
  return drawnPlates.length>0||!!drawn;
}
/** MAPS SIDE BY SIDE, INTERACTIVE (Map's manual, History: panels): one small map per panel, in the grid chosen, each classed over every
 *  panel's values so a shade is one number everywhere, and moving one moves the others unless that is turned off. JLT's
 *  population comparison viewer (jltobias/JupyterLite-Population-Data-Comparison) has the same: four panels and
 *  "Synchronize map navigation". */
let panelsMoveTogether=true;
function mountMapPanels(host:HTMLElement,shown:NonNullable<ReturnType<typeof activeOutput>>,mapNode:WorkflowNode<'map_output'>,
    arranged:NonNullable<WorkflowNode<'map_output'>['params']['arrangement']>):()=>void{
  const all=shown.polygons!.features,panels=arranged.panels.filter(panel=>all.some(f=>f.layerName===panel.layer));
  const drawn=all.filter(f=>panels.some(panel=>panel.layer===f.layerName));
  const columns=panelColumns(arranged.grid,panels.length);
  host.classList.add('map-panels-host');
  host.innerHTML=`<label class="map-panels-sync"><input type="checkbox" id="map-panels-sync" ${panelsMoveTogether?'checked':''}> Move the panels together</label>`
    +`<div class="map-panels-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr))">`
    +panels.map((panel,i)=>`<section class="map-panel" data-map-panel="${esc(panel.layer)}"><h4>${esc(panel.title?.trim()||panel.layer)}</h4><div data-map-panel-host="${i}"></div></section>`).join('')+`</div>`;
  host.querySelector<HTMLInputElement>('#map-panels-sync')!.onchange=e=>{panelsMoveTogether=(e.target as HTMLInputElement).checked;};
  // FOLLOWING STARTS ONCE EVERY PANEL IS LAID OUT: a map moved while another is still mounting has no position yet
  // ("reading '_leaflet_pos'", which emptied the first panel of the population example, 2026-11-13).
  const maps:import('leaflet').Map[]=[];let moving=false,ready=false;
  const follow=(from:import('leaflet').Map)=>{
    if(moving||!ready||!panelsMoveTogether)return;moving=true;
    try{for(const other of maps)if(other!==from&&other.getContainer().isConnected)other.setView(from.getCenter(),from.getZoom(),{animate:false});}
    finally{moving=false;}};
  // A PANEL THAT CANNOT BE DRAWN SAYS WHY, in its place, and the others are still drawn.
  const disposers=panels.map((panel,i)=>{const at=host.querySelector<HTMLElement>(`[data-map-panel-host="${i}"]`)!;
    try{return mountCatchmentMap(at,
      {...shown,polygons:{...shown.polygons!,features:all.filter(f=>f.layerName===panel.layer)}} as never,
      undefined,esc,basemapOf(mapNode.params.basemap),undefined,`${mapNode.id}-panel-${i}`,undefined,mapNode.params.partLabel,undefined,
      {classifyOver:drawn,onMap:map=>{maps.push(map);
        // LINKED AS IT MOVES, not when it stops (the practitioner, 2026-11-13: "if you zoom on one and move left to right or up
        // and down all the maps move the same").
        map.on('move zoom',()=>follow(map));}});}
    catch(error){at.innerHTML=`<p class="notice" data-panel-error>This panel could not be drawn: ${esc(errorMessage(error))}</p>`;return ()=>{};}});
  // One view for all of them, the first panel's, once they are drawn.
  const settle=requestAnimationFrame(()=>requestAnimationFrame(()=>{ready=true;if(maps[0])follow(maps[0]);}));
  return ()=>{cancelAnimationFrame(settle);ready=false;for(const dispose of disposers)dispose();host.classList.remove('map-panels-host');};
}
/** GRID CELLS IN PANELS, INTERACTIVE (Map's manual, History: panels): one small map per raster, each its cells in the shared classes,
 *  linked as they move. The key is drawn once, above. */
/** THE SCALES A RESULT'S PANELS ARE DRAWN ON; a result from before scales were recorded (2026-11-17) had one, people per km². */
function panelScalesOf(result:unknown,panels:readonly import('./raster-panels.js').DrawnDensity[]):import('./raster-panels.js').PanelScale[]{
  const held=(result as {panelScales?:import('./raster-panels.js').PanelScale[]}).panelScales;
  if(held?.length)return held;
  return [{mode:'density',label:'people per km²',ramp:'YlOrRd',classes:'quantile',noun:'people',
    breaks:(result as {densityBreaks?:number[]}).densityBreaks??[],layers:panels.map(p=>p.layer)}];
}
/** RASTERS ON ONE MAP, INTERACTIVE (Map's manual, History: rasters on one map): the keys above, one map, what overlaps said below. */
function mountRasterOneMap(host:HTMLElement,panels:import('./raster-panels.js').DrawnDensity[],scales:import('./raster-panels.js').PanelScale[],
    mapNode:WorkflowNode<'map_output'>,plan:import('./raster-panels.js').RasterMapLayer[]):()=>void{
  host.classList.add('map-panels-host');
  const overlap=overlapWords(plan.flatMap(l=>l.kind==='raster'&&l.drawn?[l.panel]:[]));
  host.innerHTML=scales.map((scale,j)=>{const colours=rampFor(scale.breaks,scale.ramp),breaks=scale.breaks,words=scaleWords(scale,'together');
    return `<div class="map-panels-key" data-density-key data-scale-key="${j}">${colours.map((c,i)=>`<span><i style="background:${c}"></i>${
      i===0?`up to ${roundTo(breaks[0])}`:i===colours.length-1?`over ${roundTo(breaks[i-1])}`:`${roundTo(breaks[i-1])} to ${roundTo(breaks[i])}`}</span>`).join('')}`
    +` <span class="muted">${esc(words.shade.replace(/^Cell shade: /,''))}</span></div>`;}).join('')
    +`<div class="raster-one-map" data-raster-one-map></div>`
    +`<p class="muted">${esc(drawnWords(scales,Math.max(...panels.map(p=>p.drawnCellM))))}.${overlap?' '+esc(overlap):''}</p>`;
  const dispose=mountDensityLayers(host.querySelector<HTMLElement>('[data-raster-one-map]')!,
    plan.map(l=>l.kind==='raster'?{...l,image:densityImage(l.panel,scales[l.panel.scale]??scales[0]!)}:l),basemapOf(mapNode.params.basemap));
  return ()=>{dispose();host.classList.remove('map-panels-host');host.replaceChildren();};
}
function mountRasterPanels(host:HTMLElement,panels:import('./raster-panels.js').DrawnDensity[],scales:import('./raster-panels.js').PanelScale[],
    mapNode:WorkflowNode<'map_output'>,points:import('./raster-panels.js').RasterPoints[]=[]):()=>void{
  const arranged=mapNode.params.arrangement;
  const order=arranged?arranged.panels.map(p=>p.layer):panels.map(p=>p.layer);
  const shown=order.map(name=>panels.find(p=>p.layer===name)).filter((p):p is NonNullable<typeof p>=>!!p);
  const title=(layer:string)=>arranged?.panels.find(p=>p.layer===layer)?.title?.trim()||layer;
  const columns=panelColumns(arranged?.grid??'grid',shown.length);
  host.classList.add('map-panels-host');
  // ONE KEY PER SCALE: counts share one, each unit of value its own (2026-11-17).
  host.innerHTML=scales.map((scale,j)=>{const colours=rampFor(scale.breaks,scale.ramp),breaks=scale.breaks,words=scaleWords(scale,scales.length===1);
    return `<div class="map-panels-key" data-density-key data-scale-key="${j}">${colours.map((c,i)=>`<span><i style="background:${c}"></i>${
      i===0?`up to ${roundTo(breaks[0])}`:i===colours.length-1?`over ${roundTo(breaks[i-1])}`:`${roundTo(breaks[i-1])} to ${roundTo(breaks[i])}`}</span>`).join('')}`
    +` <span class="muted">${esc(words.shade.replace(/^Cell shade: /,''))}</span></div>`;}).join('')
    +`<label class="map-panels-sync"><input type="checkbox" id="map-panels-sync" ${panelsMoveTogether?'checked':''}> Move the panels together</label>`
    +`<div class="map-panels-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr))">`
    +shown.map((p,i)=>`<section class="map-panel" data-map-panel="${esc(p.layer)}"><h4>${esc(title(p.layer))}</h4><div data-map-panel-host="${i}" class="raster-panel-map"></div></section>`).join('')+`</div>`
    +`<p class="muted">${esc(drawnWords(scales,Math.max(...shown.map(p=>p.drawnCellM))))}.</p>`;
  host.querySelector<HTMLInputElement>('#map-panels-sync')!.onchange=e=>{panelsMoveTogether=(e.target as HTMLInputElement).checked;};
  const maps:import('leaflet').Map[]=[];let moving=false,ready=false;
  const follow=(from:import('leaflet').Map)=>{
    if(moving||!ready||!panelsMoveTogether)return;moving=true;
    try{for(const other of maps)if(other!==from&&other.getContainer().isConnected)other.setView(from.getCenter(),from.getZoom(),{animate:false});}
    finally{moving=false;}};
  const basemap=basemapOf(mapNode.params.basemap);
  const disposers=shown.map((p,i)=>mountDensityPanel(host.querySelector<HTMLElement>(`[data-map-panel-host="${i}"]`)!,densityImage(p,scales[p.scale]??scales[0]!),p.bounds,basemap,
    map=>{maps.push(map);map.on('move zoom',()=>follow(map));},p.outline,points));
  // FITTED ONCE THE PANELS HAVE A SIZE: fitted before, they opened zoomed into the middle (Rwanda, 2026-11-13).
  const all=[Math.min(...shown.map(p=>p.bounds[0])),Math.min(...shown.map(p=>p.bounds[1])),Math.max(...shown.map(p=>p.bounds[2])),Math.max(...shown.map(p=>p.bounds[3]))];
  let removed=false;
  const settle=requestAnimationFrame(()=>requestAnimationFrame(()=>{if(removed)return;for(const m of maps)m.invalidateSize();
    maps[0]?.fitBounds([[all[1]!,all[0]!],[all[3]!,all[2]!]],{padding:[8,8],animate:false});ready=true;if(maps[0])follow(maps[0]);}));
  return ()=>{removed=true;cancelAnimationFrame(settle);ready=false;for(const d of disposers)d();host.classList.remove('map-panels-host');host.replaceChildren();};
}
const roundTo=(v:number|undefined)=>v===undefined?'':Number(Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?v.toFixed(1):v.toFixed(2)).toLocaleString('en');
/** THE STATIC FIGURE OF A MAP, drawn into `svg`: one renderer for the Results tab and the write-up (2026-11-14; the
 *  practitioner: "maps in Notes still don't look like complete polished maps"). The write-up had kept a copy of an older
 *  version of this drawing, without panels, raster cells, link lines or ground, and fell further behind with each figure
 *  the Results tab gained. Returns once the ground is drawn, or false where there is no static figure to draw. */
async function drawStaticFigure(svg:SVGSVGElement,result:Output,mapNode:WorkflowNode<'map_output'>|undefined,
  o:{selected?:string|null;hidden?:Set<string>;offPage?:{workflow:Workflow}}={}):Promise<boolean>{
  result=withoutLeftOutAreas(result,mapNode?.params.leftOutAreas);
  const rows=result.rows||[],arranged=mapNode?.params.arrangement;
  // THE MAP'S OWN WORKFLOW: in Notes a figure may come from a workflow other than the one open (2026-11-18: MERS's
  // inset unnamed while another workflow was open).
  const own=o.offPage?.workflow??workflow;
  const rasterPanels=(result as {rasterPanels?:import('./raster-panels.js').DrawnDensity[]}).rasterPanels;
  const hidden=o.hidden??new Set<string>();
  // WITHOUT GROUND, CUES (the practitioner, 2026-11-18: "With no basemap the dot in the middle of light green emptiness
  // is hard to interpret"): where no basemap or plate is drawn, a scale bar gives the emptiness a size, and the figure
  // says the basemap is not shown. A FEW MARKS ARE NAMED EITHER WAY (the practitioner, the same day, of Oswego over its
  // basemap: "Why doesn't the point have a label - church where supper was held?"): the tiles show the village, not which
  // building is the church.
  const ground=async(frame:{bounds:[number,number,number,number];project:(c:Position)=>[number,number]})=>{
    const grounded=await drawStaticBasemap(result,svg,frame,o.offPage?{workflow:o.offPage.workflow,hidden}:undefined);
    const project=frame.project as (c:[number,number])=>[number,number];
    svg.insertAdjacentHTML('beforeend',markNames(result,project)+(grounded?'':bareMapCues(project,frame.bounds)));
  };
  // GRID CELLS IN PANELS (Map's manual, History: panels): the static figure, every panel on one scale. FIRST, because the panels carry
  // the areas they are drawn within as polygons too, and the polygon branch drew those alone: Botswana's districts and
  // no cells in Notes (2026-11-14).
  if(rasterPanels?.length){
    const scales=panelScalesOf(result,rasterPanels);
    const order=arranged?arranged.panels.map(p=>p.layer):rasterPanels.map(p=>p.layer);
    const shownPanels=order.map(name=>rasterPanels.find(p=>p.layer===name)).filter((p):p is NonNullable<typeof p>=>!!p);
    // ONE MAP UNLESS PANELS ARE CHOSEN (Map's manual, History: rasters on one map, 2026-11-22): what Arrange's "One map" always said.
    const plan=mapNode?rasterMapPlan(result,mapNode,own.edges,id=>own.nodes.find(n=>n.id===id)?.params.label):[];
    // THE POINTS MANAGE LAYERS SHOWS, over every panel.
    const points=plan.flatMap(l=>l.kind==='points'&&l.drawn?[{...l.points,layer:l.label}]:[]);
    if(!arranged&&shownPanels.length>1&&plan.length)svg.innerHTML=rasterOneMapSvg(plan,scales,esc);
    else svg.innerHTML=rasterPanelsSvg(shownPanels,scales,arranged?.grid??'grid',Object.fromEntries((arranged?.panels??[]).map(p=>[p.layer,p.title])),esc,points);
    // No background to read the height from: the cells' mask leaves the outside clear. Framed by what is drawn.
    applyFrame(svg,(result as {rasterScale?:unknown}).rasterScale?'<rect width="850" height="375"/>':'');
    return true;
  }
  if(result.network&&!result.pointLayers?.length){
    svg.setAttribute('viewBox','0 0 252 168');
    svg.innerHTML=networkPreviewSvg(result.network,result.boundary as never).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
    return true;
  }
  if(result.polygons){
    const banded=result.polygons.features.some(f=>f.minutes!==undefined);
    // LINES JOIN A POLYGON MAP TOO (2026-11-24). Reported as *"Map output does not show hand drawn lines"*, with the
    // interactive preview showing them: this renderer is chosen whenever polygons are present and returns before the
    // lines branch below it ever runs, so the `lines` port was drawn on every other kind of map and not this one.
    // The fifth time a renderer picked from the wired ports dropped a layer; `map-layer-list.ts` names the other four.
    const drawnLines=lineLayersOf(result),lineArrows=mapNode?.params.lineArrows;
    // The study area drawn under the polygons only where one is wired to this Map, so it is the area, not the polygons' own.
    const wiredArea=own.edges.some(e=>e.to===mapNode?.id&&e.port==='area')?result.boundary:undefined;
    // THE FRAME THE MAIN PLOT WAS DRAWN IN, where an inset was composed. A locator's main plot is the PART, not the
    // whole, and the marks, the link lines and the ground all have to be placed in that same frame or they describe
    // a different map from the one drawn. Set by the composition below and read where those three are drawn.
    let composedMain:ReturnType<typeof polygonFrame>|null=null;
    if(banded){svg.setAttribute('viewBox','0 0 850 650');svg.innerHTML=catchmentPlot(result.polygons,esc,result.contextPoints);}
    // PANELS SIDE BY SIDE, on one scale (Map's manual, History: panels): each panel its own frame, so no single basemap or point overlay
    // projects onto the figure; those are drawn on one map only.
    else if(arranged){svg.innerHTML=polygonPanelsSvg(result.polygons,arranged.panels,arranged.grid,esc);applyFrame(svg,svg.innerHTML);}
    else{
      // AN INSET ON A MAP THAT CARRIES POLYGONS (2026-11-23). It was composed for every other kind of map and not
      // this one: a polygon figure is drawn here and returned before the composition further down ever runs, so an
      // inset picked on such a map was kept, offered in Configure... and silently never drawn. Reported as "the
      // inset never appeared", and measured: 85 paths with an inset on a plain map against 43 with a polygon layer.
      //
      // The box is tested against THIS renderer's frame, not `staticMapFrame`'s. The two disagree exactly when
      // polygons are present -- staticMapFrame spans the boundary, the lines, the rows and the centres and ignores
      // polygon layers -- which is the same trap the too-small-layer note fell into earlier the same day.
      const insetOn=mapNode?.params.inset;
      const whole=polygonFrame(result.polygons,wiredArea,undefined,drawnLines);
      if(insetOn&&whole&&boxInside(insetOn.box,whole.bounds)){
        const part=polygonFrame(result.polygons,wiredArea,insetOn.box,drawnLines)!;
        const locator=insetOn.arrange==='locator';
        const shrink=850/(locator?insetWidth(insetOn):focusDiameter(insetOn,whole.height).diameter);
        const drawing=(content:string,f:{height:number;scale:number;project:(c:Position)=>[number,number]})=>
          ({content,height:f.height,project:f.project as (c:[number,number])=>[number,number],scale:f.scale});
        const composed=composeInset(
          drawing(polygonSvg(result.polygons,esc,wiredArea,{markScale:locator?shrink:1,withKey:!locator,lines:drawnLines,lineArrows}),whole),
          drawing(polygonSvg(result.polygons,esc,wiredArea,{box:insetOn.box,markScale:locator?1:shrink,withKey:locator,lines:drawnLines,lineArrows}),part),
          insetOn,
          rows.filter(r=>r.coordinates).map(r=>r.coordinates as [number,number]),{},
          insetFeatures(result.boundary as Boundary|undefined,rows,(locator?part:whole).project as (c:[number,number])=>[number,number]));
        svg.innerHTML=composed.content;
        composedMain=locator?part:whole;
      }
      else svg.innerHTML=polygonSvg(result.polygons,esc,wiredArea,{lines:drawnLines,lineArrows});
      applyFrame(svg,svg.innerHTML);
    }
    // A LOCATOR'S MARKS AND GROUND BELONG TO THE PART, NOT THE WHOLE (2026-11-24). This read the whole frame
    // whatever had been composed, so on a polygon map with a locator inset the areas were drawn zoomed to the box
    // while the marks and the basemap stayed at the full extent: the pin sat on the ground it belongs to and the
    // area around it was drawn about six times too wide and off to one side. Reported from the Kibali mine's 50 km
    // buffer, seen by two readers. The boundary renderer had always chosen the frame this way (`ground(locator ?
    // partFrame : wholeFrame)`); this one never did.
    const polygonGround=arranged&&!banded?null:banded?catchmentFrame(result.polygons,result.contextPoints)
      :composedMain??polygonFrame(result.polygons,wiredArea,undefined,drawnLines);
    const drawnLinks=(result as {links?:import('./map-links.js').MapLink[]}).links;
    if(polygonGround&&drawnLinks?.length)
      svg.insertAdjacentHTML('beforeend',linkLinesSvg(drawnLinks,rows,c=>polygonGround.project(c) as [number,number],hidden));
    if(polygonGround&&rows.length)
      svg.insertAdjacentHTML('beforeend',markedPoints(rows,
        c=>polygonGround.project(c) as [number,number],
        {esc,markPath,
         symbols:(result as {layerSymbols?:Record<string,import('./point-layers.js').MarkStyle>}).layerSymbols||{},
         classes:(result as {pinClasses?:Record<string,{value:string;colour:string}[]>}).pinClasses||{},
         hidden,
         mapLayers:(result as {mapLayers?:MapLayer[]}).mapLayers,
         labelField:mapNode?.params.labelField||{},
         ...(o.selected?{focusId:rows.find(r=>`result:${r.id}`===o.selected)?.id}:{}),
         label:row=>[row.excluded?'Excluded':row.relation,row.layerLabel].filter(Boolean).join(' \u00b7 ')}));
    svg.querySelectorAll<SVGElement>('[data-line-layer]').forEach(el=>{el.style.display=hidden.has(el.dataset.lineLayer!)?'none':'';});
    if(polygonGround)await ground({bounds:polygonGround.bounds,project:c=>polygonGround.project(c) as [number,number]});
    return true;
  }
  if(result.raster){
    const frame=rasterFrame(result.raster);
    const symbols=(result as {layerSymbols?:Record<string,{colour:string;shape:Parameters<typeof markPath>[0];size?:number}>}).layerSymbols||{};
    const focus=o.selected?rows.find(r=>`result:${r.id}`===o.selected):undefined;
    const marks=rows.filter(r=>r.coordinates).map(r=>{
      const [x,y]=frame.project(r.coordinates!);
      const symbol=symbols[r.sourceNodeId||'']||{colour:'#699178',shape:'circle' as const};
      const label=r.excluded?'Excluded':r.relation||statusLabel(r.status);
      const radius=(symbol.size??4)+(focus?.id===r.id?2:0);
      return `<g class="location" role="button" tabindex="0" data-place="${esc(r.id)}"`
        +` data-layer="${esc(r.sourceNodeId||'')}"`
        +` style="display:${hidden.has(r.sourceNodeId||'')?'none':''}"`
        +` aria-label="${esc(r.name)}, ${esc(label)}${r.layerLabel?', '+esc(r.layerLabel):''}">`
        +`<title>${esc(r.name)} \u00b7 ${esc(label)}${r.layerLabel?' \u00b7 '+esc(r.layerLabel):''}</title>`
        +`<path d="${markPath(symbol.shape||'circle',x,y,radius)}" fill="${symbol.colour}" stroke="white" stroke-width="1.2"/></g>`;
    }).join('');
    const rasterLinks=(result as {links?:import('./map-links.js').MapLink[]}).links;
    svg.innerHTML=rasterSvg(result.raster,(rasterLinks?.length?linkLinesSvg(rasterLinks,rows,c=>frame.project(c) as [number,number],hidden):'')+marks,
      (result as {rasterScale?:import('./raster-panels.js').PanelScale}).rasterScale);
    applyFrame(svg,svg.innerHTML);
    return true;
  }
  if(result.pointTable){svg.innerHTML='';return false;}
  if(result.kind==='study-area'){svg.innerHTML=areaSvg(required(result.boundary),result.label);return true;}
  // A MAP OF LINES ALONE has no area, and is drawn in its lines' frame (experiment 229).
  if(result.boundary||lineLayersOf(result).length){
    const inset=mapNode?.params.inset,labels=mapNode?.params.labelField||{};
    const wholeFrame=staticMapFrame(result);
    // AN INSET OR A LOCATOR (Map's manual, History: the inset), where its box lies inside the map: the same layers drawn twice, composed.
    if(inset&&boxInside(inset.box,wholeFrame.bounds)){
      const partFrame=staticMapFrame(result,inset.box);
      const drawing=(content:string,f:typeof wholeFrame)=>({content,height:f.height,project:f.project as (c:[number,number])=>[number,number],scale:f.scale});
      // THE SMALL FRAME'S MARKS KEEP THEIR SIZE ON THE PAGE: drawn larger by as much as the frame is shrunk.
      const locator=inset.arrange==='locator';
      // As wide as it is drawn: a focus circle may be held under the width chosen by the limit.
      const shrink=850/(locator?insetWidth(inset):focusDiameter(inset,wholeFrame.height).diameter);
      const composed=composeInset(drawing(staticBoundaryMap(result,o.selected??null,esc,statusLabel,labels,undefined,locator?shrink:1,mapNode?.params.lineArrows),wholeFrame),
        drawing(staticBoundaryMap(result,o.selected??null,esc,statusLabel,labels,inset.box,locator?1:shrink,mapNode?.params.lineArrows),partFrame),inset,
        result.rows.filter(r=>r.coordinates).map(r=>r.coordinates as [number,number]),
        insetNames(own.nodes.find(x=>x.id===own.edges.find(e=>e.to===mapNode?.id&&e.port==='area')?.from)?.params as AreaParams|undefined,inset.box,
          result.boundary as Boundary|undefined),
        // WHAT THE MAP REPRESENTS, as the large frame draws it: the inset is placed clear of it (2026-11-18).
        insetFeatures(result.boundary as Boundary|undefined,result.rows,(locator?partFrame:wholeFrame).project as (c:[number,number])=>[number,number]));
      svg.innerHTML=composed.content;
      applyFrame(svg,svg.innerHTML);
      svg.querySelectorAll<SVGElement>('[data-place]').forEach(el=>{el.style.display=hidden.has(el.dataset.layer!)?'none':'';});
      await ground(inset.arrange==='locator'?partFrame:wholeFrame);
      return true;
    }
    svg.innerHTML=staticBoundaryMap(result,o.selected??null,esc,statusLabel,labels,undefined,1,mapNode?.params.lineArrows);
    applyFrame(svg,svg.innerHTML);
    svg.querySelectorAll<SVGElement>('[data-layer-link]').forEach(el=>{el.style.display=hidden.has(el.dataset.layerLink!)?'none':'';});
    // SWITCHED OFF IN MANAGE LAYERS MEANS NOT DRAWN, for a line layer as for a point layer (2026-11-24): `lines` was
    // absent from `KIND_BY_PORT`, so the dialog never listed one and nothing here ever had to honour the switch.
    svg.querySelectorAll<SVGElement>('[data-line-layer]').forEach(el=>{el.style.display=hidden.has(el.dataset.lineLayer!)?'none':'';});
    svg.querySelectorAll<SVGElement>('[data-place]').forEach(el=>{el.style.display=hidden.has(el.dataset.layer!)?'none':'';});
    await ground(staticMapFrame(result));
    return true;
  }
  svg.innerHTML='';
  return false;
}
/** THE INSET IS PICKED HERE (Map's manual, History: the inset; the practitioner, 2026-11-13: "inset picker on the interactive map"): zoom
 *  to the part and use the view on screen as the inset's box, kept in longitude and latitude. Offered where the static
 *  figure can draw one, a map over its study area. */
/** The view on a Leaflet map as an inset's box: clipped to the whole map's extent, or a sentence saying why not. */
function insetBoxFrom(map:import('leaflet').Map,shown:Output):[number,number,number,number]|string{
  const b=map.getBounds(),whole=staticMapFrame(shown).bounds;
  const clipped:[number,number,number,number]=[Math.max(b.getWest(),whole[0]),Math.max(b.getSouth(),whole[1]),Math.min(b.getEast(),whole[2]),Math.min(b.getNorth(),whole[3])];
  if(!boxInside(clipped,whole))return 'This view is outside the map. Zoom to a part of it.';
  if((clipped[2]-clipped[0])>=(whole[2]-whole[0])*0.9&&(clipped[3]-clipped[1])>=(whole[3]-whole[1])*0.9)
    return 'This view shows nearly the whole map. Zoom in to the part to enlarge.';
  return clipped;
}
function insetPicker(mapNode:WorkflowNode<'map_output'>|undefined,shown:Output,map:import('leaflet').Map){
  // WHERE THE STATIC FIGURE CAN DRAW ONE. Polygons left this list on 2026-11-23: the polygon renderer composes an
  // inset now, and excluding them here is what kept the bar off the practitioner's map while Configure... went on
  // offering the controls. A raster, a street network and panels still cannot, so they stay.
  if(!mapNode||!shown.boundary||mapNode.params.arrangement||shown.raster||shown.network)return;
  const bar=document.createElement('div');bar.className='map-inset-bar leaflet-bar';
  // DRAWN FROM THE NODE AS IT IS NOW, and again after each choice: the map is kept, not remounted, so the bar redraws.
  const fill=()=>{
    const held=workflow.nodes.find((n):n is WorkflowNode<'map_output'>=>n.id===mapNode.id&&n.type==='map_output')?.params.inset;
    bar.innerHTML=`<button class="button small" type="button" data-inset-use>Use this view as the inset</button>`
      +(held?`<button class="button small" type="button" data-inset-clear>Clear the inset</button>`:'');
    bar.querySelector('[data-inset-use]')!.addEventListener('click',()=>{
      // Clipped to the map's own extent, then refused if nothing of it is left: an inset shows a part of the map.
      const clipped=insetBoxFrom(map,shown);
      if(typeof clipped==='string'){toast(clipped,{tone:'warning'});return;}
      change(w=>{const p=getNode(w,mapNode.id,'map_output').params;p.inset={...(p.inset??{}),box:clipped};},{spatial:false});
      toast('Kept as the inset. The static figure, in Notes and in the downloads, now shows it.');fill();
    });
    bar.querySelector('[data-inset-clear]')?.addEventListener('click',()=>{
      change(w=>{delete getNode(w,mapNode.id,'map_output').params.inset;},{spatial:false});fill();});
  };
  fill();
  // ON THE MAP, as a control: a bar under it took 40 px from the map at full screen.
  placeOnMap(map,bar,'topleft');
}
/** A map's output as it is to be drawn: without the study areas its Map leaves out (2026-11-22). */
function leftOutApplied<T extends Output|undefined>(out:T):T{
  if(!out)return out;
  const node=workflow.nodes.find(n=>n.id===out.nodeId&&n.type==='map_output') as WorkflowNode<'map_output'>|undefined;
  return withoutLeftOutAreas(out,node?.params.leftOutAreas) as T;
}
function renderMap(){
  if(!resultsOnScreen())return;
  disposeCatchmentMap?.();disposeCatchmentMap=undefined;document.querySelector('#catchment-map-host')?.remove();document.querySelector('#polygon-method')?.remove();document.querySelector('#map-parts')?.remove();
  const result=leftOutApplied(activeOutput()),svg=$('#map');
  // PRESENTATION IS LIVE, NOT BAKED INTO THE RUN. The node is read from the current workflow and
  // not from the snapshot as run, because a title, a key, a basemap and a mark's size change
  // nothing the run computed -- so they must show the moment they are chosen, and demanding a
  // rerun for them would be asking a practitioner to recompute a figure to resize a dot.
  const mapNode=workflow.nodes.find((n):n is WorkflowNode<'map_output'>=>n.id===result?.nodeId&&n.type==='map_output')
    ??runWorkflow?.nodes.find((n):n is WorkflowNode<'map_output'>=>n.id===result?.nodeId&&n.type==='map_output');
  const arranged=mapNode?.params.arrangement;
  const rasterPanels=(result as {rasterPanels?:import('./raster-panels.js').DrawnDensity[]}|undefined)?.rasterPanels;
  const polygonFigure=(p:import('./catchments.js').Polygons)=>arranged?polygonPanelsSvg(p,arranged.panels,arranged.grid,esc):polygonSvg(p,esc,workflow.edges.some(e=>e.to===mapNode?.id&&e.port==='area')?result?.boundary:undefined,{lines:result?lineLayersOf(result):[],lineArrows:mapNode?.params.lineArrows});
  // The symbols the run resolved are the run's, so they carry the sizes that were current then.
  // Re-resolved here against the live node, in the layer order the run recorded, so the marks and
  // the key cannot disagree about what a layer looks like.
  if(result?.pointLayers?.length&&mapNode){
    const live=Object.fromEntries(result.pointLayers.map((layer,index)=>
      [layer.sourceNodeId,resolveLayerSymbol(index,mapNode.params.layerSymbols?.[layer.sourceNodeId])]));
    (result as {layerSymbols?:unknown}).layerSymbols=live;
  }
  // AND THE LAYERS IN THE ORDER SET NOW (2026-11-12, the practitioner: the pumps would not come to the top). Moving a layer
  // in Manage layers is presentation too, so it is drawn from the live node, not from the order the last run recorded.
  if(result&&mapNode&&(result as {mapLayers?:unknown}).mapLayers){
    (result as {mapLayers?:import('./map-layer-list.js').MapLayer[]}).mapLayers=mapLayerList(mapNode,workflow.edges,
      id=>workflow.nodes.find(n=>n.id===id)?.params.label,
      ((result as {mapLayers?:import('./map-layer-list.js').MapLayer[]}).mapLayers||[]).filter(l=>l.origin==='within')
        .reduce((within,l)=>{const at=within.find(w=>w.port===l.port);const member={name:l.id.slice(l.port.length+1),parts:l.parts??0};
          if(at)at.members.push(member);else within.push({port:l.port,members:[member]});return within;},[] as {port:string;members:{name:string;parts:number}[]}[]),
      layerOrigins(result.pointLayers));
  }
  const spec=result&&mapNode&&runWorkflow?mapPresentation(mapNode,result,runWorkflow):undefined;
  $('#map-panel').classList.toggle('has-communication',!!spec);
  $('#map-communication').hidden=!spec;$('#map-communication-key').hidden=!spec?.legend;$('#map-communication-source').hidden=!spec;
  if(spec){
    $('#map-communication-title').textContent=spec.title;$('#map-communication-subtitle').textContent=spec.subtitle;
    $('#map-communication-source').textContent=spec.sourceNote;$('#map-communication-header-source').textContent=spec.sourceNote;
    // The key draws the same mark the map draws. A coloured <i> could only ever be a circle or a
    // square, so a triangle or a star on the map had no legend entry that matched it.
    const key=spec.legend?spec.items.map(item=>`<span><svg class="map-key-mark" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">`
      +(item.line?`<path d="M1 7H9" stroke="${item.color}" stroke-width="1.6"/><path d="M8 3L14 7L8 11z" fill="${item.color}"/>`
        :`<path d="${markPath(item.shape||'circle',7,7,5)}" fill="${item.hollow?'none':item.color}"${item.opacity===undefined?'':` fill-opacity="${item.opacity}"`} stroke="${item.hollow?item.color:FIGURE_ROLE.quietInk}" stroke-width="1.5"/>`)+`</svg>${esc(item.label)}</span>`).join(''):'';
    $('#map-communication-key').innerHTML=key;$('#map-communication-header-key').innerHTML=key;
    $('#map-download-svg').onclick=()=>{const content=result?.polygons&&result.polygonPresentation==='interactive'?(result.polygons.features.some(f=>f.minutes!==undefined)?catchmentPlot(result.polygons,esc,result.contextPoints):polygonFigure(result.polygons)):svg.innerHTML;
      const viewBox=result?.polygons&&result.polygons.features.some(f=>f.minutes!==undefined)?'0 0 850 650':frameBoxOf(content);
      // The scale bar is derived from the plot's own frame, and only for the catchment plot, whose
      // vertical axis is latitude. A decision table or a basemap-backed view has no single ground
      // scale, so none is offered rather than guessed.
      const plotted=result?.polygons&&result.polygons.features.some(f=>f.minutes!==undefined)
        ?catchmentFrame(result.polygons,result.contextPoints):null;
      const frame=plotted?{metresPerPixel:metresPerPixel(plotted.pixelsPerDegreeLatitude)}:undefined;
      download(`${result!.nodeId}-map.svg`,standaloneMapSvg(content,viewBox,spec,frame),'image/svg+xml');};
    // THE SAME FIGURE, FOR THE PLACES THAT WILL NOT TAKE AN SVG. The practitioner, 2026-10-25,
    // on putting one into a slide: *"Why not export as PNG?"* Built from the identical markup, so
    // the two files cannot say different things -- a PNG assembled separately would be a second
    // figure that happened to look like the first.
    $('#map-download-png').onclick=async()=>{
      const button=$('#map-download-png');
      const label=button.textContent||'Download map (PNG)';
      button.disabled=true;button.textContent='Rendering\u2026';
      try{
        const content=result?.polygons&&result.polygonPresentation==='interactive'
          ?(result.polygons.features.some(f=>f.minutes!==undefined)?catchmentPlot(result.polygons,esc,result.contextPoints):polygonFigure(result.polygons))
          :svg.innerHTML;
        const viewBox=result?.polygons&&result.polygons.features.some(f=>f.minutes!==undefined)?'0 0 850 650':frameBoxOf(content);
        const plotted=result?.polygons&&result.polygons.features.some(f=>f.minutes!==undefined)
          ?catchmentFrame(result.polygons,result.contextPoints):null;
        const frame=plotted?{metresPerPixel:metresPerPixel(plotted.pixelsPerDegreeLatitude)}:undefined;
        const raster=await rasteriseFigure(standaloneMapSvg(content,viewBox,spec,frame));
        if(!raster){toast('This figure could not be drawn as a PNG. The SVG download carries the same figure.',{tone:'failure'});return;}
        const url=URL.createObjectURL(raster.blob);
        const link=document.createElement('a');link.href=url;link.download=`${result!.nodeId}-map.png`;link.click();
        setTimeout(()=>URL.revokeObjectURL(url),2000);
        // The size is stated rather than left to be discovered at a printer.
        toast(`${raster.width} \u00d7 ${raster.height} px, ${FIGURE_PIXEL_SCALE}\u00d7 the figure \u2014 300 dpi at 8.5 inches.`);
      }catch(error){toast(errorMessage(error),{tone:'failure'});}
      finally{button.disabled=false;button.textContent=label;}
    };
  }
  // A network is drawn as itself: the streets, at the size of the panel, with nothing inferred.
  //
  // UNLESS the map was set to be interactive, in which case this `return` is what stopped it. The
  // practitioner, 2026-10-20: *"Map widget settings (e.g., interactive and basemap) not being
  // implemented ... That looks like a regression."* It is the FIFTH time this exact shape has been
  // found in this function -- see the note below, where a fix was written and then fenced off by a
  // guard above it. Here the guard is an early return: interactive maps were made to work on "any
  // map" on 2026-10-17, below a branch added on 2026-10-13 that returns first. The behaviour never
  // regressed; the CLAIM did, which is worse, because it is the claim a practitioner acts on.
  // ... and only where the streets are the whole of what was wired. With point layers on it too,
  // this early return drew the streets and dropped the points, which is the defect it was asked
  // to fix wearing the other hat. The static plot draws the points; the streets are a frame of a
  // different size, so the note says where they are rather than letting them go missing quietly.
  if(result?.network&&!result.pointLayers?.length&&mapNode?.params.presentation!=='interactive'){
    const coverage=networkCoverage(result.network);
    $('#map-panel').querySelector('#map-note')!.textContent=networkPreviewCaption(coverage);
    svg.style.display='';svg.setAttribute('viewBox','0 0 252 168');
    // The area goes in the same frame as the streets, as the Inspector's preview has always done.
    svg.innerHTML=networkPreviewSvg(result.network,result.boundary as never).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
    return;
  }
  svg.style.display='';applyFrame(svg,'');
  if(result?.network&&result.pointLayers?.length)
    $('#map-panel').querySelector('#map-note')!.textContent=
      `${networkPreviewCaption(networkCoverage(result.network))} The streets are drawn with the `
      +`points on this map's interactive presentation; this plot shows the points.`;
  // The static plot is what those checkboxes act on: they set display:none on its marks.
  $('#map-layer-list').hidden=!activeOutput()?.pointLayers?.length
    &&!groundImageFor(activeOutput()?.nodeId);
  // INTERACTIVE IS FOR ANY MAP, and until 2026-10-17 it was unreachable without polygons.
  //
  // The inner condition was widened on 2026-10-15 with a comment saying so -- "a study area with
  // points on it is a map like any other ... Reported three times before the cause turned out to
  // be here" -- and the ENCLOSING `if(result?.polygons)` was left in place, so the branch stayed
  // unreachable for a points-only result. The fix was written and then fenced off by the guard
  // above it. Reported a fourth time, on worked example 11, which is points and a study area and
  // no polygons at all.
  //
  // Hoisted out, because only the interactive presentation can draw tiles: leaving it inside the
  // polygon branch means a basemap is reachable only on a catchment.
  // THE TABLE UNDER THE MAP, one row per place with every attribute it carries, linked to the map both ways (2026-11-14).
  const parts=result?.polygons&&!arranged&&!rasterPanels?.length?partsTableUnderMap(result.polygons):undefined;
  if(mapNode?.params.presentation==='interactive'&&result?.view==='map'){
    if(result.network)$('#map-panel').querySelector('#map-note')!.textContent=networkPreviewCaption(networkCoverage(result.network));
    const host=document.createElement('div');host.id='catchment-map-host';
    $('#map-panel').insertBefore(host,$('#map-communication-key'));
    svg.style.display='none';$('#map-layer-list').hidden=true;
    // THE PLATE TRAVELS WITH THE LAYERS, so the map can give it a checkbox. Read from the node
    // like the basemap is, because `map_output` is single-mode and the mode that wins drops
    // every other layer from the value before a renderer sees it -- the defect that took the
    // study area on 2026-10-20, the facilities on 2026-10-22 and the raster on 2026-10-23.
    // EVERY SHEET, each its own layer in the control (TODO 35).
    const plates=groundImagesFor(mapNode?.id).map(livePlate=>({data:livePlate.data,bounds:livePlate.bounds,opacity:livePlate.opacity,
      label:mapImageCredit(livePlate),...(livePlate.corners?{corners:livePlate.corners,width:livePlate.width,height:livePlate.height}:{})}));
    // THE DIRECTION SETTING TRAVELS WITH THE LAYERS, for the reason the plate does: the Map's Configure dialog
    // holds it, and the interactive map must read the same answer as the static figure or the preview is not the
    // figure (the practitioner, 2026-11-24).
    const withPlate={...result,...(plates.length?{plate:plates[0]!,...(plates.length>1?{plates}:{})}:{}),
      ...(mapNode?.params.lineArrows?{lineArrows:mapNode.params.lineArrows}:{})};
    if(rasterPanels&&rasterPanels.length>1&&mapNode&&!arranged)disposeCatchmentMap=mountRasterOneMap(host,rasterPanels,panelScalesOf(result,rasterPanels),mapNode,rasterMapPlan(result,mapNode,workflow.edges,id=>workflow.nodes.find(n=>n.id===id)?.params.label));
    else if(rasterPanels?.length&&mapNode)disposeCatchmentMap=mountRasterPanels(host,rasterPanels,
      panelScalesOf(result,rasterPanels),mapNode,rasterMapPlan(result,mapNode,workflow.edges,id=>workflow.nodes.find(n=>n.id===id)?.params.label)
        .flatMap(l=>l.kind==='points'&&l.drawn?[{...l.points,layer:l.label}]:[]));
    else if(arranged&&result.polygons&&mapNode)disposeCatchmentMap=mountMapPanels(host,withPlate,mapNode,arranged);
    else disposeCatchmentMap=mountCatchmentMap(host,withPlate.polygons?{...withPlate,polygons:withPlate.polygons}:withPlate,
      result.contextPoints,esc,mapNode?basemapOf(mapNode.params.basemap):'none',
      choice=>{if(mapNode)change(w=>getNode(w,mapNode.id,'map_output').params.basemap=choice);},
      // The node is the view's identity. Without it every presentation change -- and Mark radius
      // is one -- remounted the map and refitted it, throwing away the pan and zoom the
      // practitioner had chosen in order to judge the change they were making.
      mapNode?.id,mapNode?.params.tileExtract,mapNode?.params.partLabel,mapNode?.params.frameCaption,
      {onMap:m=>{insetPicker(mapNode,result,m);},
        ...(parts?{onPart:(id:string)=>parts.choose(id,'map'),partChooser:(mark:(id:string|null)=>void)=>{parts.mark=mark;}}:{})});
    if(result.polygons){
      // ONE OF THESE, NOT ONE PER RENDER. This was inserted into the panel on every render and
      // nothing removed the last, so a map rendered three times carried the same paragraph three
      // times, reported 2026-10-29.
      //
      // And the method sentence is not repeated here: the Sources line above the figure already
      // carries it, which is where a reader of a published figure looks. What is left is what
      // the notes add -- how many features, how they were named, and that clipping is a separate
      // step. The full method and its provenance are in the receipt, which is the record.
      document.querySelector('#polygon-method')?.remove();
      const method=document.createElement('p');
      method.id='polygon-method';method.className='muted';
      method.textContent=result.polygons.notes.join(' ');
      $('#map-panel').insertBefore(method,$('#map-communication-key'));
    }
    return;
  }
  // THE STATIC FIGURE, from the one renderer the write-up uses too (2026-11-14). What stays here is what only the page
  // has: the method note under the map, the layer checkboxes' state, and choosing a mark to inspect it.
  if(!result){svg.innerHTML='';return;}
  if(result.polygons){
    const note=document.createElement('div');note.id='catchment-map-host';$('#map-panel').insertBefore(note,$('#map-communication-key'));
    const method=document.createElement('p');method.className='muted';
    method.id='polygon-method';method.textContent=result.polygons.notes.join(' ');
    note.append(method);
  }
  void drawStaticFigure(svg,result,mapNode,{selected,hidden:hiddenMapLayers.get(result.nodeId)??new Set<string>()}).then(()=>{
    if(!parts)return;
    parts.mark=id=>svg.querySelectorAll<SVGElement>('[data-catchment]').forEach(el=>el.classList.toggle('part-chosen',el.dataset.catchment===id));
    svg.querySelectorAll<SVGElement>('[data-catchment]').forEach(el=>{el.onclick=()=>parts.choose(el.dataset.catchment!,'map');});
  }).catch(error=>{
    // A MAP THAT CANNOT BE DRAWN SAYS SO WHERE IT WOULD BE (2026-11-19): DR Congo's 26 provinces threw while the frame was
    // measured, and the map stayed blank with nothing said.
    console.error(error);
    const said=document.createElement('p');said.className='notice notice-warning';said.setAttribute('role','alert');
    said.textContent=`The map could not be drawn: ${errorMessage(error)} The run's results are unaffected; the table and downloads still hold them.`;
    svg.replaceWith(said);
  });
  svg.querySelectorAll<HTMLElement & SVGElement>('[data-place]').forEach(el=>{
    el.onclick=()=>selectResult(el.dataset.place!);
    el.onkeydown=e=>{if(e.key==='Enter')selectResult(el.dataset.place!);};
  });
}
/** The table under a map of polygons, placed under the figure, and the two-way link: a row chosen marks its place on
 *  the map; a place chosen on the map marks and scrolls to its row. `mark` is set by whichever renderer drew the map. */
function partsTableUnderMap(polygons:NonNullable<Output['polygons']>):{choose:(id:string,from:'map'|'table')=>void;mark?:(id:string|null)=>void}|undefined{
  const table=partsTable(polygons.features as never);if(!table)return undefined;
  const host=document.createElement('section');host.id='map-parts';host.className='map-parts';
  host.setAttribute('aria-label','Attributes of the places on the map');
  $('#map-panel').insertBefore(host,$('#map-communication-source').nextSibling);
  let sort:{column:string;direction:'ascending'|'descending'}|undefined,chosen:string|null=null;
  const link:{choose:(id:string,from:'map'|'table')=>void;mark?:(id:string|null)=>void}={choose:()=>{}};
  const draw=()=>{host.innerHTML=partsTableMarkup(table,esc,{sort,chosen});};
  link.choose=(id,from)=>{chosen=chosen===id&&from==='table'?null:id;draw();
    link.mark?.(chosen);
    if(from==='map')host.querySelector<HTMLElement>(`tr[data-map-part="${CSS.escape(id)}"]`)?.scrollIntoView({block:'nearest'});};
  host.addEventListener('click',e=>{const t=e.target as HTMLElement;
    const button=t.closest<HTMLElement>('[data-parts-sort]');
    if(button){sort={column:button.dataset.partsSort!,direction:button.dataset.partsDirection as 'ascending'|'descending'};draw();return;}
    const row=t.closest<HTMLElement>('tr[data-map-part]');if(row)link.choose(row.dataset.mapPart!,'table');});
  host.addEventListener('keydown',e=>{const row=(e.target as HTMLElement).closest<HTMLElement>('tr[data-map-part]');
    if(row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();link.choose(row.dataset.mapPart!,'table');}});
  draw();
  return link;
}
/** A WORKED EXAMPLE'S PLACED IMAGE, filled in from its own file (2026-11-15): Hagelloch's 1824 sheet ships placed under
 *  the cluster map with the image's digest and not its bytes, so the bytes are fetched from beside the application,
 *  checked against that digest, and kept on the device. A sheet the learner places is not touched: it has no image yet. */
async function fillPlacedImages():Promise<void>{
  for(const n of workflow.nodes){
    if(n.type!=='map_image_input')continue;
    const p=(n as WorkflowNode<'map_image_input'>).params;
    if(!p.offered?.url||!p.image?.width||!p.world||(typeof p.data==='string'&&p.data.startsWith('data:')))continue;
    const response=await fetch(p.offered.url);
    if(!response.ok)throw new Error(`${p.offered.filename} could not be fetched from beside the application (${response.status}).`);
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(p.image.sha256&&await contentHash(bytes)!==p.image.sha256)
      throw new Error(`${p.offered.filename} is not the file this example placed: its digest differs. Reload the application.`);
    const data=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));
      r.onerror=()=>reject(new Error(`${p.offered!.filename} could not be read.`));
      r.readAsDataURL(new Blob([bytes],{type:p.offered!.url!.endsWith('.png')?'image/png':'image/jpeg'}));});
    const digest=await payloadDigest(data);
    if(!await keepDataset(digest,data))throw new Error(`${p.offered.filename} could not be kept on this device.`);
    p.data=data;p.dataRef=digest;
  }
}
function reason(input:string):Promise<ReasonerQuad[]>{return new Promise<ReasonerQuad[]>((resolve,reject)=>{
  if(!worker)worker=new Worker('./build/reasoning-worker.js');const id=++seq;
  const timeout=setTimeout(()=>{worker?.terminate();worker=null;reject(new Error('Reasoning exceeded 45 seconds. Reduce the dataset and try again.'));},45000);
  worker.onmessage=({data}:MessageEvent<ReasoningResponse>)=>{if(data.id!==id)return;clearTimeout(timeout);if('error' in data)reject(new Error(data.error));else resolve(data.quads);};
  worker.onerror=e=>{clearTimeout(timeout);worker?.terminate();worker=null;reject(new Error(`Reasoning worker failed: ${errorMessage(e)}`));};worker.postMessage({id,input} satisfies ReasoningRequest);
});}
/** Named after a run: every ruleset this workflow pinned that a newer version supersedes.
 *
 *  The practitioner's instruction of 2026-10-14: "when new versions appear, and a workflow is run
 *  that requires an old version, we have to alert the user that there is a newer version." Said
 *  at the run because that is the moment a result is produced by rules the practitioner may not
 *  know are superseded; what CHANGED is in the Inspector, where there is room for it, and in the
 *  widget manual. An incompatible supersession is named as such here, because it decides whether
 *  the practitioner is looking at a convenience or at a rewiring job.
 *
 *  Reads the run's own snapshot, not the live workflow, so it describes the run that just
 *  finished rather than an edit made since. */
function supersessionNotice(ran:Workflow):string{
  const hosts=ran.nodes.filter((n):n is WorkflowNode<'apply_ruleset'>=>n.type==='apply_ruleset');
  const stale=hosts.flatMap(node=>{
    const pinned=node.params.ruleset;if(!pinned)return [];
    // A NODE CARRYING ITS OWN RULES IS NOT SUPERSEDED BY THE ARTEFACT IT BORROWED PORTS FROM.
    // `authoredPin` pins a ruleset purely for its port shape and titles the pin "Rules written in
    // this workflow"; what such a node computes is the practitioner's authored rules, so a newer
    // version of the pinned artefact changes nothing about it. Publishing outreach-criteria 1.1.0
    // on 2026-10-26 told four authored nodes their ruleset was superseded and not a drop-in,
    // which was false of every one of them. `core.ts` already states the principle where it binds
    // parameters: "the pin gives this node its ports; it does not describe rules the practitioner
    // wrote."
    if(node.params.authored)return [];
    const found=supersession(pinned.id,pinned.version);
    return found?[{node,pinned,found}]:[];
  });
  if(!stale.length)return '';
  const named=stale.map(({node,pinned,found})=>`${node.params.label||node.id} is pinned to `
    +`${pinned.version}, and ${found.version} is available`
    +`${found.incompatible?' and is not a drop-in':''}`);
  return ` Note: ${named.join('; ')}. The run used the pinned version${stale.length===1?'':'s'}, `
    +`which is what reproduces these results; the Inspector says what changed.`;
}
/** A SOURCE'S IDENTITY for the dictionaries a practitioner makes: the file inside a fetched archive, or a file read
 *  from disk, by digest. Undefined for a table that names no source. */
function dictionaryKey(table:WorkflowNode<'table_input'>['params']):string|undefined{
  if(table.remote)return `remote:${table.remote.archiveSha256??''}:${table.remote.entry??''}:${table.remote.sha256}`;
  const digest=table.data.source?.sha256||table.source?.sha256;
  return digest?`file:${digest}`:undefined;
}
interface OwnDictionary {name:string; entries:Record<string,import('./column-metadata.js').DictionaryEntry>; savedAt:string}
const OWN_DICTIONARIES='fieldwork-dictionaries-v1';
const ownDictionaries=():Record<string,OwnDictionary>=>{
  try{return JSON.parse(localStorage.getItem(OWN_DICTIONARIES)||'{}') as Record<string,OwnDictionary>;}catch{return {};}
};
/** THE PROJECT LISTS THE DICTIONARY (experiment 211): which Table input imported it, with which table. A canvas in no
 *  project, or a shipped example's, keeps it on the node alone, and it is listed when the workflow is filed. */
function listDictionary(nodeId:string,dictionary:TableDictionary,table:string):void{
  const project=projectNow(),key=storageKey(workflow);
  if(!project||!readProjects().some(p=>p.id===project.id))return;
  writeProjects(readProjects().map(p=>p.id===project.id?withDictionary(p,{sha256:dictionary.sha256,name:dictionary.name,
    workflow:key,node:nodeId,table,importedAt:dictionary.readAt}):p));
}
const keepOwnDictionary=(key:string,dictionary:OwnDictionary)=>{
  try{localStorage.setItem(OWN_DICTIONARIES,JSON.stringify({...ownDictionaries(),[key]:dictionary}));}catch{/* kept in the project either way */}
};
/** Where each fetched table's rows came from in this session, for the Inspector to say. */
const rowsReadFrom=new Map<string,'device'|'source'>();
/** A fetched file read into its table node, with the settings the table was first read with. */
async function readFetchedInto(id:string,file:File&{from?:'device'|'source'}):Promise<void>{
  if(file.from)rowsReadFrom.set(id,file.from);
  const params=getNode(workflow,id,'table_input').params;
  const read=await tableFromFetched(file,{keys:params.keys,valueField:params.valueField,unit:params.unit,
    ...((params.source?.sheet??params.data.source?.sheet)?{sheet:params.source?.sheet??params.data.source?.sheet}:{}),
    ...(params.wide?{wide:params.wide}:{}),primaryKey:params.data.primaryKey,secondaryKeys:params.data.secondaryKeys});
  change(w=>{const node=getNode(w,id,'table_input');node.params.data={...read.data,...(node.params.data.source?{source:node.params.data.source}:{})};
    // KEPT BY THE FILE'S DIGEST, so every workflow on the same file shares one copy and none overflows the save.
    if(read.sourceTable){node.params.sourceTable=read.sourceTable;node.params.sourceRef=`source:${params.remote!.sha256}`;}});
}
/** BEFORE A RUN, a fetched table with no rows here reads the copy this device keeps, by digest, with no network. The
 *  practitioner, 2026-11-04: *"For NYC when I run workflows from notes it only runs 2 and there are 4 workflows"* --
 *  the other two tables had not been fetched in their own workflows, though the file was on the device. A table whose
 *  file is not on this device still needs Fetch the table, and the run says so. */
async function fillFetchedTables():Promise<void>{
  for(const node of workflow.nodes){
    if(node.type!=='table_input'||!node.params.remote||node.params.data.rows.length)continue;
    try{const file=await fetchRemoteTable(node.params.remote,{deviceOnly:true});if(file)await readFetchedInto(node.id,file);}
    catch{/* the run reports the empty table in its own words */}
  }
}
/** THE TABLES A STOPPED RUN'S FINISHED STEPS MADE, for this workflow only, until the next run (2026-11-20): Append rows'
 *  dialog shows its columns from them when the run stopped at Append rows. */
// var, not let: the Inspector can draw during startup, before this line has run.
// eslint-disable-next-line no-var
var stoppedTables:{key:string;tables:Record<string,import('./data-table.js').DataTable>}|undefined;
async function run(){if(busy)return;
  stoppedTables=undefined;
  await fillFetchedTables();
  // A refusal BEFORE the run starts is still a refused run, and the canvas has to say so. It
  // returned early here without touching the state, so the workflow went on reading "Changed ·
  // rerun to update" -- an invitation to press the button that had just refused -- while the
  // only sign of what happened was a line in the browser console. Caught by its own test,
  // 2026-10-15, after the practitioner could not make sense of the message that did appear.
  runFailed=false;runIncomplete=false;
  // An unfinished workflow is told apart from a broken one. A canvas with no output yet is the
  // ordinary middle of building something, so it gets the plain notice tone, no console trace and
  // a state line that says what is true -- not "Run failed", which claims something went wrong.
  try{executionPlan(workflow);}catch(e){
    if(e instanceof IncompleteWorkflow){runIncomplete=true;showIncomplete(e);render();return;}
    toast(errorMessage(e),{tone:'failure'});runFailed=true;render();console.error(e);return;}busy=true;runStartedAt=performance.now();statuses={};justFinished.clear();lastRunMs=null;/* THE LAST RUN'S RASTER IS LET GO AS THIS ONE STARTS (2026-11-17): held while the next run loaded its own, two windows were in memory at once, measured on Nigeria at 100 m. */if(result?.outputs.some(o=>o.raster)){result=null;renderResults();}{const key=storageKey(workflow);if(key&&runsByWorkflow.get(key)?.run.outputs.some(o=>o.raster))runsByWorkflow.delete(key);}render();try{await fillPlacedImages();}catch(e){busy=false;queueMicrotask(runSettled);toast(errorMessage(e),{tone:'failure'});runFailed=true;render();return;}const snapshot=structuredClone(workflow);const started=performance.now();try{const next=await executeWorkflow(snapshot,reason,(id,state)=>{statuses[id]=state;if(state==='done'){justFinished.add(id);setTimeout(()=>{justFinished.delete(id);if(!busy||statuses[id]==='done')flow?.update(playbackView(),selected,statuses);},FINISH_GLOW_MS);}flow?.update(playbackView(),selected,statuses);});lastRunMs=performance.now()-started;
    // THE CANVAS CAN MOVE WHILE A RUN IS IN FLIGHT, and this run is then nobody's results.
    //
    // `renderResults` discards a result whose workflow is no longer the open one -- the rule
    // above it, *"results belong to the workflow that produced them"*. Nothing stopped the
    // workflow changing during the await: `loadExample` is behind `busy`, but the import paths
    // are not, and a catalog fetch resolves on its own schedule. So the run below finished, had
    // its result correctly discarded, and then read it anyway.
    //
    // Found 2026-10-27 on the DEPLOYED instance, which is the only place it had ever been done
    // in that order: fetching South London from the catalog while the first example's run was
    // still going threw `Cannot read properties of null (reading 'outputs')`, and the run
    // reported nothing at all. Every local test either waits for the run or imports from a file
    // input, which lands between runs rather than inside one.
    const stillOurs=storageKey(snapshot)===storageKey(workflow);
    // `dirty` says the open canvas has changes this run has not covered. For a canvas this run
    // never touched that is true, and clearing it here marked a freshly adopted workflow as
    // already run.
    result=next;runWorkflow=snapshot;if(stillOurs)dirty=false;
    // WHAT THIS RUN CONTRIBUTES TO THE WRITE-UP, kept so the Notes tab can show every workflow of
    // the project rather than whichever one is open. Written for the workflow that RAN, which is
    // `snapshot` and not necessarily the one now open -- the same distinction `stillOurs` makes
    // just above, for the same reason.
    rememberRunNotes(snapshot,next);
    renderResults();const issues=dataIssueNotice(next);
  // "we must surface the issue on the widget as a toast message that I can then read and close"
  // -- the practitioner, 2026-10-16. A run that quietly bands a third of its records Unrecorded
  // has answered the question and hidden the thing worth knowing.
  //
  // ADDED to what a successful run already says, not substituted for it. The first version
  // replaced the line, so a run with a data issue no longer reported that it had finished or
  // how long it took -- taking something away from the practitioner in the act of telling them
  // something. The run succeeded; it is amber rather than red for that reason, and it stays
  // until it is closed.
  //
  // READ FROM `next`, NOT FROM `result`. `next` is this run; `result` is whatever the application
  // is holding by the time this line runs, which after a mid-run canvas change is null. And when
  // the result was discarded, do not announce tabs that are not there: say what happened, in the
  // plain notice tone, because nothing went wrong -- the practitioner moved on, and the work they
  // moved to is untouched.
  toast(stillOurs
    ?`Complete in ${elapsedText(lastRunMs)}: ${next.outputs.length} output tabs updated.`
      +supersessionNotice(snapshot)+(issues?` ${issues}`:'')
    :`A run of ${snapshot.name||'another workflow'} finished in ${elapsedText(lastRunMs)}, after this `
      +`canvas had already moved on. Its results belong to that workflow, so they were not kept. `
      +`Open it again and run it to see them.`,
    stillOurs?(issues?{tone:'warning'}:undefined):{tone:'notice'});}catch(e){
    // A STREAMED RASTER'S FILE, chosen from the message itself (2026-11-20): the file is checked, then the run starts again.
    const needed=e as {name?:string;asset?:import('./raster.js').RasterAsset;remembered?:boolean};
    const asset=needed?.name==='StreamedFileNeeded'?needed.asset:undefined;
    const sofar=(e as {tablesSoFar?:Record<string,import('./data-table.js').DataTable>}|null)?.tablesSoFar;
    if(sofar)stoppedTables={key:storageKey(workflow),tables:sofar};
    // THE STEP NAMED (the table stress tests, 2026-11-22): the canvas marked it, and the words did not say which.
    const stoppedAt=Object.entries(statuses).find(([,state])=>state==='failed')?.[0];
    const stoppedNode=stoppedAt?workflow.nodes.find(n=>n.id===stoppedAt):undefined;
    const stoppedName=stoppedNode?((stoppedNode.params as {label?:string}).label||TYPES[stoppedNode.type].title):'';
    toast(`${stoppedName?`“${stoppedName}” stopped the workflow`:'Workflow stopped'}: ${errorMessage(e)}`,{tone:'failure',...(asset?{action:{
      label:needed.remembered?`Allow reading ${asset.source.filename}`:`Choose ${asset.source.filename}\u2026`,
      run:()=>{void (async()=>{
        try{const {fileAgainByClick}=await import('./raster-workflow.js');
          await fileAgainByClick(asset,text=>toast(text,{tone:'notice'}));
          toast(`${asset.source.filename} is read again; running the workflow.`,{tone:'notice'});void run();}
        catch(error){toast(errorMessage(error),{tone:'failure'});}})();}}}:{})});
    runFailed=true;console.error(e);}
  finally{
    busy=false;queueMicrotask(runSettled);
    // A FINISHED RUN DOES NOT MOVE THE PRACTITIONER. The first version of the tab switched to
    // Results when a run completed, on the reasoning that the split had always shown them. It
    // reads differently in use: someone adding a node, running, and adjusting it is thrown off
    // the canvas every time, and being moved is the opposite of choosing which view you are in.
    // The run summary and the count on the Results tab say that there is something to look at.
    render();
  }}
/** A PROJECT GOES OUT COMPRESSED, AND COMES BACK EITHER WAY.
 *
 *  The practitioner, after a 20 MB import limit refused the backup they had just taken to rescue
 *  their work: *"Why don't we zip it as an export and unzip it upon import?"* A project document
 *  is JSON holding a street graph -- millions of repeated OSM ids and coordinate strings -- which
 *  is about as compressible as text gets. The browser does this itself: CompressionStream has
 *  been in every engine this application supports since 2023, and the street engine already
 *  leans on its DecompressionStream counterpart to read a .osm.pbf.
 *
 *  Gzip rather than zip: one stream in, one stream out, no archive format to describe, and the
 *  file is readable by anything. The encrypted ZIP stays what it is -- a different artefact, for
 *  sharing a bundle under a passphrase rather than for moving one's own work between browsers.
 *
 *  What this does NOT fix is the ceiling underneath: the text still becomes one JavaScript string
 *  to be parsed, and V8 refuses past about 512 MB with "Invalid string length". Compression moves
 *  what a practitioner can CARRY, not what a tab can hold. */
export async function gzipText(text:string):Promise<Blob>{
  const stream=new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).blob();
}
/** Gzip announces itself: 1f 8b. A file that does not is read as the plain JSON it used to be,
 *  so every export ever taken still imports. */
export async function readMaybeGzipped(file:Blob):Promise<string>{
  const head=new Uint8Array(await file.slice(0,2).arrayBuffer());
  if(head[0]!==0x1f||head[1]!==0x8b)return file.text();
  const stream=file.stream().pipeThrough(new DecompressionStream('gzip'));
  const text=await new Response(stream).text();
  // BOUNDED ON WHAT IT BECAME, not on what arrived. The file-size check upstream sees the
  // COMPRESSED bytes, and a street graph gzips about 25 to 1 -- so a file inside the limit can
  // expand far past it, which is the oldest trick an archive plays. The encrypted package has
  // bounded its expansion since it learned to compress; this path had not.
  if(text.length>MAX_BUNDLE_BYTES)
    throw new Error(`This file expands to ${(text.length/1e6).toFixed(1)} MB, more than the `
      +`${MAX_BUNDLE_BYTES/1e6} MB that may be read back in.`);
  return text;
}
function downloadBlob(name:string,blob:Blob){
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=name;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),10_000);
}
function download(name:string,text:string,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
$('#release-download').onclick=()=>{const output=activeOutput();if(!output||exampleKey(workflow)!=='snow-geoprivacy'||!output.nodeId.startsWith('after-'))return;
  const features=output.polygons?.kind==='hexbin'?output.polygons.features.map(f=>({type:'Feature',id:f.id,properties:{count:f.count},geometry:f.geometry})):output.rows.map(r=>({type:'Feature',id:r.id,properties:{name:r.name},geometry:r.coordinates?{type:'Point',coordinates:r.coordinates}:null}));
  download(`${output.nodeId}-derived.geojson`,JSON.stringify({type:'FeatureCollection',features},null,2),'application/geo+json');
};
function wireThemeControl(){
  const select=document.querySelector<HTMLSelectElement>('#theme-select');
  const preference=initTheme();
  if(!select)return;
  select.value=preference;
  select.addEventListener('change',()=>{
    const chosen=select.value;
    if(!isThemePreference(chosen))return;
    applyTheme(chosen);
    if(!saveThemePreference(chosen))toast('This device would not store the theme; it applies until reload.');
  });
}
/** RESULTS IS A TAB, not the lower half of a split. The practitioner, 2026-10-21: *"can we make
 *  the Results Panel a tab alongside Workflow ... It would be easier to see the whole workflow or
 *  the whole Result panel than to see half of each."* The split had a divider, a remembered
 *  height and an Expand button that toggled which half won; all three existed to manage a
 *  compromise that a tab removes. The order is the order of the work: build it, read it, then
 *  inspect how it was derived. */
let currentView='workflow';
function switchView(view:string){
  // SELECTING THE TAB YOU ARE ON CHANGES NOTHING. Rebuilding the results on every click threw
  // away the map and everything it held -- the vector basemap just chosen, and the pan and zoom
  // the practitioner had set. Found 2026-10-21 when a redundant click erased a MapLibre canvas.
  if(view===currentView)return;
  currentView=view;
  const work=$('.work-area');
  work.classList.toggle('showing-results',view==='results');
  $('#workflow-view').hidden=view!=='workflow';
  $('#rules-view').hidden=view!=='rules';
  $('#project-view').hidden=view!=='project';
  // AS THE PROJECT IS NOW: objectives written in Notes since the last render are offered to this workflow (Stage B).
  queueMicrotask(placeManualFloat);
  if(view==='project'){sharedSignature='';renderProjectDetails();if(!document.querySelector('#project-tab-new:not([hidden])'))showProjectTab(rememberedProjectTab(),false);}
  $('#notes-view').hidden=view!=='notes';
  $('#manual-view').hidden=view!=='manual';
  $('#widgets-view').hidden=view!=='widgets';
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>{
    const active=b.dataset.view===view;
    b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));
  });
  if(fullScreen)setFullScreen(true);
  // Built on arrival, because it could not be built while the panel was hidden. SYNCHRONOUSLY:
  // the class above has already made the panel visible, and Leaflet reads clientWidth, which
  // forces the layout it needs. Deferred to a frame, anything that looked at the map in the
  // same turn as the tab click found no map -- a race in the application, not only in a test.
  if(view==='project')renderProjectView();
  // THE WRITE-UP IS A STAGE OF THE WORK, not a corner of the project record. The practitioner,
  // 2026-10-29: *"It should be a tab."* Read in order, which means not below the project's own
  // controls: a reader of a write-up should not scroll past backup buttons to reach the
  // Introduction.
  if(view==='notes')renderNotesView();
  if(view==='manual')renderManualView();
  if(view==='widgets')renderWidgetsView();
  if(view==='results')renderMap();
  if(view==='workflow')requestAnimationFrame(()=>flow?.fit());
}
/** An input's name in plain words, for the Inspector: never an internal id like `polygons_2` or `originalCenter`. */
const PORT_LABELS:Record<string,string>={area:'Study area',points:'Points',polygons:'Areas',records:'Records',table:'Table',
  raster:'Raster',network:'Street network',decisions:'Decisions',design:'Study design',cases:'Cases',series:'Series',
  original:'Original points',moved:'Moved points',pumps:'Reference points',originalCenter:'Original mean center',
  movedCenter:'Moved mean center',comparison:'Comparison',ground:'Ground',context:'Context points',centers:'Centers',
  catalog:'Catalog search',product:'Satellite product',files:'Satellite files'};
/** ONE SECTION OF A STANDARD INSPECTOR, headed the same way in every widget (experiment 186). */
/** WHAT A WIDGET'S OWN INSPECTOR IS GIVEN (inspector-kit.ts): the standard sections, read access to the workflow, and
 *  `change`, the one way to edit it. */
/** THE AREA STEPS' KIT (area-steps-ui.ts): the standard one, with what the last run made and whether it is current. */
/** THE ZONE THE WORKFLOW'S COORDINATES SUGGEST, against one chosen, for any step that measures or shows metres. */
const zoneAdvice:AreaStepKit['zoneAdvice']=(zone,hemisphere)=>{const advice=suggestUTM(workflow);if(!advice)return undefined;
      const chosen={zone,hemisphere},valid=Number.isInteger(zone)&&zone>=1&&zone<=60;
      const worst=valid?workflowPositions(workflow).reduce((most,position)=>Math.max(most,utmScaleFactor(position,chosen)),0):NaN;
      return {...advice.choice,matches:advice.choice.zone===zone&&advice.choice.hemisphere===hemisphere,positions:advice.positions,
        straddles:advice.straddles,stretch:(worst-1)*100};};
function areaStepKit():AreaStepKit{
  return {...inspectorKit(),output:id=>result?.outputs.find(o=>o.nodeId===id) as ReturnType<AreaStepKit['output']>,current:()=>!dirty,
    recordsOn:layerOnPort,
    networkOn:(id,port='network')=>{
      const e=workflow.edges.find(x=>x.to===id&&x.port===port);
      const from=e&&workflow.nodes.find(n=>n.id===e.from);
      const held=(from?.params as {data?:import('./catchments.js').Network}|undefined)?.data;
      return held?.nodes?.length?held:undefined;},
    method:id=>result?.receipts.find(r=>r.nodeId===id)?.method,
    // THE NUMBERS ARRIVING, read from the source's own records where it holds them (Point data, a pinned layer).
    numericFields:(id,port)=>{const e=workflow.edges.find(x=>x.to===id&&x.port===port),source=e&&workflow.nodes.find(n=>n.id===e.from);
      const features=(source?.params as {data?:{features?:{properties?:Record<string,unknown>}[]}}|undefined)?.data?.features??[];
      const keys=new Set<string>();for(const f of features.slice(0,500))for(const [k,v] of Object.entries(f.properties??{}))
        if(typeof v==='number'&&Number.isFinite(v)||typeof v==='string'&&v.trim()!==''&&Number.isFinite(Number(v)))keys.add(k);
      return [...keys];},
    summary:id=>dirty?undefined:result?.stepSummaries?.[id],
    // THE POINTS ARRIVING, named: the source's own records where it holds them, the last run's where it does not.
    // THE NAMED LAYER A STEP COMPUTED (2026-11-25), for the dialogs downstream of one. `result.computed` is keyed
    // by every step that made a small enough named layer, which is where a Voronoi's catchments live between runs.
    computedLayer:(id:string)=>result?.computed?.[id],
    pointChoices:(id,port)=>{
      // THE PORTS THIS STEP SHOWS AS ONE, and only those. Geometry buffer buffers points, lines or a polygon
      // layer through a single group, so a feature from any of them can be the one named. Expanding that to every
      // step counted Summarize points to polygons' OWN polygon layer as points -- 5 where 3 were connected
      // (2026-11-23). The group a port belongs to is the right answer; a port in no group stands alone.
      const type=workflow.nodes.find(x=>x.id===id)?.type;
      const group=type?Object.values(PORT_GROUPS[type]??{}).find(ports=>ports.includes(port)):undefined;
      const ports=group?[...group]:[port];
      const features:{name:string;geometry:{type:string;coordinates:unknown}}[]=[];
      for(const wanted of ports){
        const e=workflow.edges.find(x=>x.to===id&&x.port===wanted);
        if(!e)continue;
        const source=workflow.nodes.find(n=>n.id===e.from);
        const held=(source?.params as {data?:{features?:{id?:unknown;name?:unknown;properties?:{name?:unknown};geometry?:{type:string;coordinates:unknown}}[]}}|undefined)?.data?.features;
        // WHAT THE STEP COMPUTED, where it computed one (2026-11-24). `outputs` holds the workflow's OUTPUT nodes
        // only, so looking a source up in it never matched an intermediate step: a border, a buffer or a clip had
        // its features nowhere a dialog could reach, and the picker stayed on its placeholder however often the
        // workflow was run. `result.computed` is keyed by every step that made a small enough named layer.
        const ran=result?.outputs.find(o=>o.nodeId===e.from) as
          {rows?:{name?:unknown;recordId?:unknown;coordinates?:[number,number]}[];features?:{name?:unknown;id?:unknown;geometry?:{type:string;coordinates:unknown}}[]}|undefined;
        const made=result?.computed?.[e.from];
        const from=held?.length?held:(made?.features??ran?.features??[]);
        for(const f of from)if(f.geometry)
          features.push({name:String((f as {properties?:{name?:unknown}}).properties?.name
            ??(f as {name?:unknown}).name??(f as {id?:unknown}).id??'').trim(),
            geometry:f.geometry});
        if(!from.length)for(const row of ran?.rows??[])if(row.coordinates)
          features.push({name:String(row.name??row.recordId??'').trim(),
            geometry:{type:'Point',coordinates:row.coordinates}});
      }
      const seen=new Set<string>();
      for(const f of features)if(f.name)seen.add(f.name);
      // CAPPED, because a layer may carry a quarter of a million records and a list that long is not a choice.
      const names=[...seen].slice(0,POINT_CHOICE_LIMIT);
      return {names,total:seen.size,features:features.slice(0,POINT_CHOICE_LIMIT)};},
    zoneAdvice};
}
/** How many point names one step will list. Above it the list is cut and the dialog says by how much. */
const POINT_CHOICE_LIMIT=500;
/** THE KIT OF A STEP MOVED OUT OF APP.TS WITH ITS LAST RUN (inspector-kit.ts). */
/** CHART'S KIT (chart-ui.ts): the step kit, with the last run, the columns read up the workflow, and the controls the
 *  application draws for every output. */
function chartKit():ChartKit{
  return {...stepKit(),result:()=>result??undefined,tableKeyColumns:node=>[...tableKeyColumns(node)],
    upstreamKeyValues:(node,seen,port)=>upstreamKeyValues(node,seen??new Set(),port),writeUpSelect:n=>writeUpSelect(n as never),
    labelForm:(id,label,value)=>labelForm(id,label,value),standardInputs:(n,labels)=>standardInputs(n,labels)};
}
/** MEASURE DISTANCE'S KIT (distance-ui.ts): the step kit, with the points on its ports and the table its last run made. */
function distanceKit():DistanceKit{
  return {...stepKit(),layerOn:(id,port)=>layerOnPort(id,port),made:id=>result?.tables?.[id]};
}
/** POINT DATA'S KIT (point-data-ui.ts): the step kit, with the columns of the table it reads, the records panel, and the
 *  Input data editor for points held on the step. */
function pointKit():PointKit{
  return {...stepKit(),
    tableColumns:id=>{const node=getNode(workflow,id,'point_input'),edge=workflow.edges.find(e=>e.to===id&&e.port==='records');
      const ran=edge?result?.tables?.[edge.from] as import('./data-table.js').DataTable|undefined:undefined;
      const declared=Object.keys(upstreamKeyValues(node)??{});
      return [...new Set([...(ran?.keys??[]),...(ran?.valueField?[ran.valueField]:[]),...declared])];},
    records:(id,data)=>recordsPanel(id,data),
    openEditor:id=>openInputDataEditor(getNode(workflow,id,'point_input'),generationAreas(id),data=>validateGeoJSON(data,{attributes:true}),params=>{const persisted=change(w=>getNode(w,id,'point_input').params=params,{requirePersistence:true});if(persisted)toast('Input edits saved on this device. Rerun the workflow to update results.');return persisted;},
      {read:sha=>readNoteImagePayload(cachedPayload(noteImageKey(sha))),keep:(sha,payload)=>keepDataset(noteImageKey(sha),payload)})};
}
/** THE OUTBREAK STEPS' KIT (outbreak-steps-ui.ts): the step kit, with the columns of the cases arriving, the values a
 *  table's keys hold, and the study design's checklist of what the workflow has declared. */
/** GEOREFERENCED MAP IMAGE'S KIT (map-image-ui.ts): the step kit, with keeping, saving and saying. */
function mapImageKit():MapImageKit{
  return {...stepKit(),keepDataset:(digest,payload)=>keepDataset(digest,payload),persist:edit=>{change(edit,{requirePersistence:true});},
    toast:(text,tone)=>toast(text,tone?{tone}:undefined)};
}
/** POLYGON LAYER'S KIT (polygon-input-ui.ts): the step kit, with connecting, keeping and saying. */
function polygonKit():PolygonKit{
  return {...stepKit(),connect:(w,from,to,port)=>setConnection(w,from,to,port),persist:edit=>!!change(edit,{requirePersistence:true}),
    keepDataset:(digest,payload)=>keepDataset(digest,payload),toast:text=>toast(text),ran:id=>!!result?.outputs.some(o=>o.nodeId===id)};
}
/** TABLE OUTPUT'S KIT (table-output-ui.ts): the step kit, with what a table shows and where its figure goes. */
function tableOutputKit():TableOutputKit{
  return {...stepKit(),unitFor:n=>tableUnitFor(n),writeUpSelect:n=>writeUpSelect(n),
    presentation:edit=>{change(edit,{spatial:false});},renderResults:()=>renderResults(),
    shown:id=>!!result?.outputs.some(o=>o.nodeId===id),zoneAdvice,layerOn:(id,port)=>layerOnPort(id,port),
    ranOutput:id=>result?.outputs.find(o=>o.nodeId===id) as {kind?:string}|undefined};
}
/** DEDUPLICATE RECORDS' KIT (deduplicate-step-ui.ts): the step kit, with what its last run found and the keys arriving. */
function dedupKit():DedupKit{
  return {...stepKit(),linkage:id=>result?.linkages?.[id],
    upstreamKeys:id=>{const node=workflow.nodes.find(x=>x.id===id);return node?Object.keys(upstreamKeyValues(node)??{}):[];}};
}
function outbreakKit():OutbreakKit{
  const nodeOf=(id:string)=>workflow.nodes.find(x=>x.id===id)!;
  return {...stepKit(),receipt:id=>result?.receipts.find(r=>r.nodeId===id),
    caseRecords:id=>layerOnPort(id,'points'),
    caseColumns:id=>{const source=workflow.nodes.find(x=>x.id===workflow.edges.find(e=>e.to===id&&e.port==='points')?.from);
      const records=(source?.params as {data?:{features?:{properties?:Record<string,unknown>}[]}}|undefined)?.data?.features??[];
      const ran=source?result?.pointColumns?.[source.id]?.map(c=>c.attribute)??[]:[];
      return [...new Set([...records.flatMap(f=>Object.keys(f.properties??{})),...ran])].sort();},
    shape:id=>upstreamKeyValues(nodeOf(id))??{},checklist:(id,draft)=>designChecklist(draft?{...workflow,nodes:workflow.nodes.map(n=>n.id===id&&n.type==='study_design'?{...n,params:draft}:n)}:workflow,id)};
}
/** THE TABLE STEPS' KIT (table-steps-ui.ts): the step kit, with the last receipt, the step the records come from, the
 *  columns and values arriving, and the exposure columns a two-by-two could compare. */
function tableStepKit():TableStepKit{
  const nodeOf=(id:string)=>workflow.nodes.find(x=>x.id===id)!;
  return {...stepKit(),receipt:id=>result?.receipts.find(r=>r.nodeId===id),
    sourceName:(id,port,fallback)=>portSourceName(workflow,id,port,fallback),
    shape:id=>upstreamKeyValues(nodeOf(id))??{},valueField:id=>upstreamValueField(nodeOf(id)),
    exposuresOffered:(id,shape,d)=>exposureColumnsOffered(withoutDeclaredKeys(nodeOf(id),shape),d,upstreamRows(nodeOf(id))),
    recordsTable:id=>tableOnPort(workflow,id,'records')??undefined};
}
/** CASES BY PERIOD'S AND RATE'S KIT (series-rate-ui.ts): the step kit, with the columns arriving, the table on the records
 *  port, and the one thing the Inspector adds to the canvas, an epidemic curve. */
function seriesRateKit():SeriesRateKit{
  return {...stepKit(),columns:id=>[...new Set(candidateFields(workflow,id).map(f=>(f as {attribute:string}).attribute))],
    rateColumns:id=>{const node=getNode(workflow,id,'rate'),table=node.params.source==='table'?tableOnPort(workflow,id,'records'):null;
      const up=workflow.nodes.find(m=>m.id===workflow.edges.find(e=>e.to===id&&e.port==='records')?.from);
      return {table:table??undefined,columns:table?[...table.keys,table.valueField]
        :node.params.source==='table'&&up?[...Object.keys(upstreamKeyValues(node)??{}),...(upstreamValueField(up)?[upstreamValueField(up)!]:[])]:[]};},
    feedsAnything:id=>workflow.edges.some(e=>e.from===id),
    // THE RECORDS CASES BY PERIOD WOULD COUNT (2026-11-25), so its Preview can run the step's own function instead of
    // restating the settings. A table comes through `tableOnPort`, which already reads a stored table, a point layer
    // as a table, and the last run's. Points are taken from the layer that holds them, because `pointChoices` keeps
    // only a name and a geometry -- and the date this step counts by is in the properties it drops.
    // THE DRAFT'S INPUT TYPE DECIDES, not the saved node's (review of 0.198.0). Switching Cases by period from
    // points to a table left the Preview counting the points still connected -- "2 cases in 2 days" of a reading
    // that Apply would then discard along with the connection. The draft is what the reader is looking at.
    casesOn:(id,source)=>{
      const asked=source??getNode(workflow,id,'case_series').params.source;
      if(asked==='table')return {table:tableOnPort(workflow,id,'cases')??undefined};
      return {points:layerOnPort(id,'points')};},
    addCurve:n=>change(w=>{const id=`curve-${Date.now()}`;w.nodes.push({id,type:'chart_output',x:n.x+270,y:n.y,params:{label:'Epidemic curve'}});
      w.edges.push({id:`e-${Date.now()}`,from:n.id,to:id,port:'records'});selected=id;})};
}
/** LINE LAYER'S KIT (line-input-ui.ts): the step kit, with the study areas on its two inputs and what its last run made. */
function lineKit():LineKit{
  const areaOf=(id:string,port:string)=>{const e=workflow.edges.find(x=>x.to===id&&x.port===port),from=e&&workflow.nodes.find(x=>x.id===e.from);
    const p=from?.type==='study_area'?(from.params as {label?:string;geometry?:Boundary}):undefined;
    return p?.geometry?{label:p.label||'Study area',boundary:p.geometry}:undefined;};
  return {...stepKit(),summary:id=>dirty?undefined:result?.stepSummaries?.[id],
    areasOn:id=>{const area=areaOf(id,'area'),area_2=areaOf(id,'area_2');return {...(area?{area}:{}),...(area_2?{area_2}:{})};}};
}
/** FIND HEALTH FACILITIES' KIT (facilities-ui.ts): the registers, the country the study area states, the list coming in. */
function facilitiesKit():FacilitiesKit{
  return {...stepKit(),catalogue:FACILITY_REGISTERS,countries:COUNTRIES,stated:id=>upstreamCountry(workflow,id),
    listOn:id=>{const table=tableOnPort(workflow,id,'list');
      if(!table){const up=workflow.nodes.find(x=>x.id===workflow.edges.find(e=>e.to===id&&e.port==='list')?.from);return {columns:[...tableKeyColumns(up)]};}
      return {columns:[...table.keys,...(table.valueField&&!table.keys.includes(table.valueField)?[table.valueField]:[])],
        rows:table.rows.map(r=>({key:{...Object.fromEntries(Object.entries(r.key).map(([k,v])=>[k,String(v??'')])),
          ...(table.valueField?{[table.valueField]:String(r.value??'')}:{})}}))};},
    boundary:id=>previewArea(workflow,id).boundary,
    keepLayer:async layer=>{const digest=await payloadDigest(layer);
      if(!await keepDataset(digest,layer))throw new Error('The registers could not be kept on this device, so they were not saved.');return digest;},
    saved:edit=>change(edit,{requirePersistence:true})!==false,
    say:(message,failure)=>toast(message,failure?{tone:'failure'}:undefined)};
}
/** STREET NETWORK'S KIT (network-input-ui.ts): the study area and its published level, and the payload store. */
function networkKit():NetworkKit{
  return {...stepKit(),
    area:id=>{try{const {boundary,node}=previewArea(workflow,id);
      return {boundary,...(node.params.source==='drawn'&&node.params.boundary?.boundaryID?{boundaryID:node.params.boundary.boundaryID}:{})};}catch{return undefined;}},
    keepNetwork:async network=>{const digest=await payloadDigest(network);return await keepDataset(digest,network)?digest:null;},
    saved:edit=>change(edit,{requirePersistence:true})!==false,
    say:(message,failure)=>toast(message,failure?{tone:'failure'}:undefined)};
}
function stepKit():StepKit{
  return {...inspectorKit(),method:id=>result?.receipts.find(r=>r.nodeId===id)?.method,
    unfinished:id=>result?.unfinished?.find(u=>u.nodeId===id)?.message,
    tableOn:(id,port)=>tableOnPort(workflow,id,port)??undefined,title:type=>TYPES[type].title,
    keep:edit=>{change(edit,{requirePersistence:true});}};
}
/** RULESET'S KIT (ruleset-ui.ts): the step kit, with the columns the records arriving carry. */
function rulesetKit():RulesetKit{
  return {...stepKit(),candidateFields:id=>candidateFields(workflow,id) as ReturnType<RulesetKit['candidateFields']>};
}
/** RELATE'S KIT (relate-ui.ts): the step kit, with what the tables on its ports are called and hold, and what its last
 *  run related. */
function relateKit():RelateKit{
  return {...stepKit(),sourceName:(id,port,fallback)=>portSourceName(workflow,id,port,fallback),
    relation:id=>result?.relations?.[id],shifted:id=>result?.relateShifts?.[id],
    keyColumns:(id,port)=>{const node=workflow.nodes.find(x=>x.id===id);return node?Object.keys(upstreamKeyValues(node,new Set(),port)??{}):[];},
    valueOn:(id,port)=>{const e=workflow.edges.find(x=>x.to===id&&x.port===port);return valueFieldOf(e&&workflow.nodes.find(m=>m.id===e.from));}};
}
/** COMPARE POINT SETS' KIT (point-comparison-ui.ts): the step kit, with the table of distances its last run made. */
function compareKit():CompareKit{
  return {...stepKit(),made:id=>result?.tables?.[id]};
}
/** JOIN'S KIT (area-join-ui.ts): the step kit, with what feeds each port, the table's columns, the parts joined to, and
 *  what the last run joined. */
function joinKit():JoinKit{
  return {...stepKit(),sourceName:(id,port,fallback)=>portSourceName(workflow,id,port,fallback),
    keyColumns:id=>{const e=workflow.edges.find(x=>x.to===id&&x.port==='records');return [...tableKeyColumns(e&&workflow.nodes.find(m=>m.id===e.from))];},
    parts:id=>{const e=workflow.edges.find(x=>x.to===id&&(x.port==='area'||x.port==='polygons'));const from=e&&workflow.nodes.find(m=>m.id===e.from);
      if(from?.type==='study_area')return from.params.boundary?.units?.length?from.params.boundary.units.map(u=>({id:u.id,name:u.name})):undefined;
      const last=result?.joins?.[id];return last?last.parts.map(p=>({id:p.id,name:p.name})):undefined;},
    joined:id=>result?.joins?.[id]};
}
/** SAMPLE A RASTER'S KIT (sample-raster-ui.ts): the step kit, with the receipt's facts, what the satellite reading said,
 *  a connection made from its dialog, and the satellite files' own sentence and dialog, which stay here with their readers. */
function sampleKit():SampleKit{
  return {...stepKit(),facts:id=>result?.receipts?.find(r=>r.nodeId===id)?.facts,ran:()=>!!result,
    said:id=>(result?.tables?.[id] as {sentence?:string}|undefined)?.sentence,
    connect:(w,from,to,port)=>setConnection(w,from,to,port),
    product:id=>{const n=workflow.nodes.find(x=>x.id===id);return n?samplerProduct(n):null;},toast:text=>toast(text,{tone:'notice'})};
}
/** WIKIDATA'S KIT (vocabulary-map-ui.ts): the step kit, with a clock and a reader for the one place that reaches a
 *  network. A run uses neither; only the dialog does, which is what keeps a run reproducible. */
function vocabularyKit():VocabularyKit{
  return {...stepKit(),now:()=>new Date().toISOString(),
    fetchJson:async url=>{
      const response=await fetch(url,{headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(`Wikidata answered ${response.status}.`);
      return response.json();
    }};
}
/** TABULAR DATA'S KIT (data-table-ui.ts): the step kit, with where the rows came from this time, whether anything
 *  reads the table, this device's store for Configure… to keep the rows and dictionary in, and DHIS2's tokens. */
function tableKit():TableKit{
  return {...stepKit(),readFrom:id=>rowsReadFrom.get(id),feeds:id=>workflow.edges.some(e=>e.from===id),
    keepRows:data=>keepDataset(tableDataKey(data),data),keepDictionary:dictionary=>keepDataset(dictionaryKeyOf(dictionary.sha256),dictionary),
    keepSaved:edit=>change(edit,{requirePersistence:true})!==false,
    listDictionary:(id,dictionary,filename)=>listDictionary(id,dictionary,filename),
    dhis2:{tokens:()=>credentials?.unlocked?credentials.references().filter(r=>r.provider==='dhis2').map(r=>({ref:r.ref,label:r.label,origin:r.origin})):[],
      resolve:(ref,origin)=>{if(!credentials?.unlocked)throw new Error('Unlock Credentials first.');return credentials.resolve(ref,'dhis2',origin);}}};
}
function prepareRasterStep(n:WorkflowNode<'raster_input'>){
    let source=workflow.nodes.find(x=>x.id===workflow.edges.find(e=>e.to===n.id&&e.port==='area')?.from);const visited=new Set<string>();
    while(source?.type==='measure_area'&&!visited.has(source.id)){visited.add(source.id);source=workflow.nodes.find(x=>x.id===workflow.edges.find(e=>e.to===source!.id&&e.port==='area')?.from);}
    let boundary:Boundary;try{boundary=previewArea(workflow,n.id).boundary;}catch(e){toast(errorMessage(e),{tone:'failure'});return;}
    // WORLDPOP FOR THE STUDY AREA'S COUNTRY, in Configure… (the practitioner, 2026-11-10: the country was asked for again
    // in the Inspector, after the study area). The study area states the country, once; this reads it.
    const node=getNode(workflow,n.id,'raster_input');
    const upstream=upstreamCountries(workflow,n.id),stated=upstream.length===1?upstream[0]!:null;
    // WHERE THE AREA STATES NO COUNTRY, IT IS ASKED HERE, and kept on the study area (the practitioner, 2026-11-10: "This
    // raster dialog still has Worldpop only with nowhere to actually access Worldpop"). Still said once, in the area; the
    // dialog no longer sends the person away to say it.
    let country=stated||node.params.populationCountry||'';
    // WHICH SOURCE (TODO 24, 2026-11-11): WorldPop for every country, GRID3's 2025 estimates for sub-Saharan Africa. A choice
    // of which file to download, not a setting the step keeps: the raster read records the file it was given.
    let ghsEpoch='2020';
    let popSource:'worldpop'|'worldpop1'|'grid3'|'ghs'=grid3RasterFor(country||null)&&!worldPopRastersForCountry(country||null,'global2').length?'grid3':'worldpop';
    const release=()=>popSource==='worldpop1'?'global1' as const:'global2' as const;
    const rastersNow=()=>worldPopRastersForCountry(country||null,release());
    const thisYear=String(new Date().getFullYear());
    let popYear=node.params.populationYear;
    // WHAT THE STEP ALREADY HOLDS, where it holds a window: the picker starts at that source and year, not at WorldPop's
    // newest, which titled a GRID3 2025 step "Population (WorldPop)" and offered 2026 (the population example, 2026-11-23).
    const held=node.params.asset?.provenance,heldURL=held?.downloadURL??'';
    if(/GRID3_SSA/i.test(heldURL))popSource='grid3';
    else if(/\/Global_2015_2030\//.test(heldURL)){popSource='worldpop';popYear??=/\/(\d{4})\/[A-Z]{3}\//.exec(heldURL)?.[1];}
    else if(/\/Global_2000_2020\//.test(heldURL)){popSource='worldpop1';popYear??=/\/(\d{4})\/[A-Z]{3}\//.exec(heldURL)?.[1];}
    else if(/^GHS-POP/.test(held?.title??'')){popSource='ghs';const epoch=held?.temporalCoverage??/(?:^|,\s*)(\d{4})(?:,|$)/.exec(held?.title??'')?.[1];
      if(epoch&&GHS_EPOCHS.includes(epoch as never))ghsEpoch=epoch;}
    const yearNow=()=>{const r=rastersNow();return r.find(x=>x.year===popYear)?.year??r.find(x=>x.year===thisYear)?.year??r[0]?.year??'';};
    const grid3Link=()=>{const r=grid3RasterFor(country||null);
      if(!r)return `<p class="muted">GRID3 publishes no estimate for ${esc(countryName(country))}: its ${GRID3_COUNTRIES} countries are in sub-Saharan Africa.</p>`;
      return `<a class="button" id="population-download" href="${esc(r.url)}" download target="_blank" rel="noopener noreferrer">`
        +`↓ ${esc(r.iso3)} · 2025${r.bytes?` · ${(r.bytes/1e6).toFixed(1)} MB`:''}</a>`
        +`<p class="muted">${r.bytes?`About ${esc(downloadWait(r.bytes))} at the one speed measured here, ${(WORLDPOP_BYTES_PER_SECOND/1e3).toFixed(0)} kB/s. `:''}`
        +`Your browser downloads it from data.worldpop.org, which sends no CORS header. Then choose the downloaded file below. `
        +`${esc(GRID3_PRODUCT)}. ${esc(GRID3_NOTE)} ${esc(GRID3_LICENCE)} Cite: ${esc(GRID3_CITATION)}. Catalogue of ${esc(GRID3_TAKEN)}.</p>`;};
    const linkFor=(year:string)=>{const rasters=rastersNow(),r=rasters.find(x=>x.year===year)??rasters[0]!,g2=release()==='global2';
      return `<a class="button" id="population-download" href="${esc(r.url)}" download target="_blank" rel="noopener noreferrer">`
        +`↓ ${esc(r.iso3)} · ${esc(r.year)}${r.bytes?` · ${(r.bytes/1e6).toFixed(0)} MB`:''}</a>`
        +`<p class="muted">${r.bytes?`About ${esc(downloadWait(r.bytes))} at the one speed measured here, ${(WORLDPOP_BYTES_PER_SECOND/1e3).toFixed(0)} kB/s. `:''}`
        +`Keep the laptop awake: the host ignores resume requests, so an interrupted download starts again from zero. Your browser `
        +`downloads it from data.worldpop.org, which sends no CORS header. Then choose the downloaded file below. `
        +(g2?`Global2 ${esc(GLOBAL2.release)}. ${esc(GLOBAL2.note)} ${esc(GLOBAL2.licence)} Cite: ${esc(GLOBAL2.citation)}. <a href="${esc(GLOBAL2.listing)}" target="_blank" rel="noopener noreferrer">WorldPop’s listing</a>, as read on ${esc(GLOBAL2.takenAt)}.</p>`
          :`Global1, unconstrained population, 100 m. ${esc(WORLDPOP_LICENCE)} Catalogue of ${esc(WORLDPOP_TAKEN)}.</p>`);};
    const populationHtml=()=>{
      const rasters=rastersNow();
      // ACROSS A BORDER (experiment 204): the area's countries are the choice, and the limit is said. One file is read.
      const several=upstream.length>1;
      const ask=stated?'':(several?`<p class="muted">The study area lies in ${upstream.map(c=>esc(countryName(c))).join(' and ')}. Each source `
          +`publishes one file per country, and this step reads one: the part of the area in the other ${upstream.length>2?'countries':'country'} `
          +`will have no population from it.</p>`:'')
        +`<label class="field-label" for="population-country">${several?'Whose file to download':'The study area’s country'}</label>`
        +`<select id="population-country"><option value="" ${country?'':'selected'}>Choose a country…</option>`
        +(several?COUNTRIES.filter(c=>upstream.includes(c.iso)):COUNTRIES).map(c=>`<option value="${c.iso}" ${c.iso===country?'selected':''}>${esc(c.name)} (${c.iso})</option>`).join('')
        +`</select>`+(several?'':`<p class="muted">Kept on the study area, which states it once for every step that needs it.</p>`);
      const sourcePick=`<label class="field-label" for="population-source">Population source</label><select id="population-source">`
        +`<option value="worldpop" ${popSource==='worldpop'?'selected':''}>WorldPop Global2 ${esc(GLOBAL2.release)} · every country, ${GLOBAL2.first}–${GLOBAL2.last}</option>`
        +`<option value="worldpop1" ${popSource==='worldpop1'?'selected':''}>WorldPop Global1 · every country, 2000–2020</option>`
        +`<option value="grid3" ${popSource==='grid3'?'selected':''}>GRID3 · sub-Saharan Africa, 2025</option>`
        +`<option value="ghs" ${popSource==='ghs'?'selected':''}>GHS-POP (JRC) · every country, 1975–2030, read for the area only</option></select>`;
      // GHS-POP NEEDS NO COUNTRY: one grid of the world, read for the study area's window by HTTP range.
      if(popSource==='ghs')return `<h3>Population (GHS-POP)</h3>`+sourcePick
        +`<label class="field-label" for="ghs-epoch">Year</label><select id="ghs-epoch">`
        +GHS_EPOCHS.map(e=>`<option value="${e}" ${e===ghsEpoch?'selected':''}>${e}${GHS_PROJECTED.has(e)?' (projected)':''}</option>`).join('')+`</select>`
        +`<p><button type="button" class="button" id="ghs-read">Read the ${ghsEpoch} window from JRC's copy</button></p>`
        +`<p class="muted">Reads only the part of the 12 GB global grid that covers the study area, from JRC's copy on Amazon Web Services; `
        +`nothing is downloaded first. The area read is sent to that server. ${esc(GHS_NOTE)} ${esc(GHS_LICENCE)} Cite: ${esc(GHS_CITATION)}.</p>`;
      return `<h3>Population (${popSource==='grid3'?'GRID3':'WorldPop'})${country?` for ${esc(countryName(country))}`:''}</h3>`
        +(stated?`<p class="muted">The country is the study area’s.</p>`:ask)+sourcePick
        +(!country?'':popSource==='grid3'?`<div class="extract-links" id="population-link">${grid3Link()}</div>`:rasters.length
          ?`<label class="field-label" for="population-year">Year</label><select id="population-year">`
            +rasters.map(r=>`<option value="${r.year}" ${r.year===yearNow()?'selected':''}>${r.year}</option>`).join('')
            +`</select><div class="extract-links" id="population-link">${linkFor(yearNow())}</div>`
          :`<p class="muted">No WorldPop raster is listed for ${esc(countryName(country))}.</p>`);
    };
    const wirePopulation=(block:HTMLElement)=>{
      const chosen=block.querySelector<HTMLSelectElement>('#population-source');
      if(chosen)chosen.onchange=()=>{popSource=chosen.value==='grid3'?'grid3':chosen.value==='ghs'?'ghs':chosen.value==='worldpop1'?'worldpop1':'worldpop';block.innerHTML=populationHtml();wirePopulation(block);};
      const epoch=block.querySelector<HTMLSelectElement>('#ghs-epoch');
      if(epoch)epoch.onchange=()=>{ghsEpoch=epoch.value;block.innerHTML=populationHtml();wirePopulation(block);};
      // The URL path does the read: the address put where a person would type it, and read as they would.
      block.querySelector<HTMLButtonElement>('#ghs-read')?.addEventListener('click',()=>{const dialog=block.closest('dialog');
        const field=dialog?.querySelector<HTMLInputElement>('#raster-url'),read=dialog?.querySelector<HTMLButtonElement>('#raster-url-read');
        if(!field||!read)return;field.value=ghsUrl(ghsEpoch);field.closest('details')?.setAttribute('open','');read.click();});
      const year=block.querySelector<HTMLSelectElement>('#population-year');
      if(year)year.onchange=()=>{popYear=year.value;block.querySelector('#population-link')!.innerHTML=linkFor(year.value);};
      const pick=block.querySelector<HTMLSelectElement>('#population-country');
      if(pick)pick.onchange=()=>{
        country=pick.value;
        const origin=(()=>{const seen=new Set<string>(),queue=[n.id];while(queue.length){const id=queue.shift()!;if(seen.has(id))continue;seen.add(id);
          const node=workflow.nodes.find(x=>x.id===id);if(node?.type==='study_area')return node;for(const e of workflow.edges)if(e.to===id)queue.push(e.from);}return undefined;})();
        // Kept on the area only where it stated none: an area across a border already states its countries.
        if(country&&origin&&!upstream.length){
          change(w=>{const t=getNode(w,origin.id,'study_area').params as {countries?:string[];country?:string};delete t.country;t.countries=[country];});
          // The area changed on purpose; a raster saved after it is still this dialog's to save.
          baseline=JSON.stringify(workflow);
        }
        block.innerHTML=populationHtml();wirePopulation(block);
      };
    };
    let baseline=JSON.stringify(workflow);
    const keptAsset=getNode(workflow,n.id,'raster_input').params.asset;
    const open=(kept?:Parameters<typeof openRasterEditor>[6])=>openRasterEditor(boundary,asset=>{if(JSON.stringify(workflow)!==baseline)throw new Error('The workflow changed. Open Configure\u2026 again.');return change(w=>{getNode(w,n.id,'raster_input').params.asset=asset;},{requirePersistence:true});},keptAsset,
      {html:populationHtml,wire:wirePopulation},node.params.label,name=>worldPopRecordFor(name)??grid3RecordFor(name,countryName)??ghsRecordFor(name),kept);
    if(!keptAsset){open();return;}
    void (async()=>{
      const {rereadable,rereadWindow,chooseStreamedFile}=await import('./raster-workflow.js');
      // CONFIGURE… ALWAYS OPENS (2026-11-20): a kept window that cannot be read back -- DR Congo's WorldPop, kept whole at
      // 2.1 GB -- failed this read, and the error went nowhere: no dialog, no message. Now the dialog opens and says it.
      let onDevice=false;
      try{onDevice=!!await readPDF(keptAsset.sha256);}
      catch(error){toast(`The window kept for ${keptAsset.source.filename} could not be read back on this device (${errorMessage(error)}). `
        +'Choose the file again in this dialog.',{tone:'warning'});}
      open({onDevice,rereadable:rereadable(keptAsset),
        reread:async(file,say)=>{
          // A STREAMED RASTER'S COPY ON THIS DEVICE: only its source file is wanted, checked and held for this session.
          if(keptAsset.streamed&&onDevice&&file){await chooseStreamedFile(keptAsset,file,say);renderInspector();return;}
          const bytes=await rereadWindow(keptAsset,file,say);
          await storePDFs(new Map([[keptAsset.sha256,bytes]]),new Map([[keptAsset.sha256,{...keptAsset,asset:keptAsset}]]));renderInspector();},
        download:async()=>{downloadRaster(await rasterOfNode(workflow,n.id));}});
    })().catch(error=>toast(`Raster input could not open: ${errorMessage(error)}`,{tone:'failure'}));}
async function downloadClipped(n:WorkflowNode<'clip_raster'>,e:Event){
    const button=e.currentTarget as HTMLButtonElement,label=button.textContent||'Download GeoTIFF';
    button.disabled=true;button.textContent='Preparing\u2026';
    try{downloadRaster(await rasterOfNode(workflow,n.id));}
    catch(error){toast(errorMessage(error),{tone:'failure'});}
    finally{button.disabled=false;button.textContent=label;}}
async function previewClipStep(n:WorkflowNode<'clip_raster'>,e:Event){
    const button=e.currentTarget as HTMLButtonElement,label=button.textContent||'',baseline=JSON.stringify(workflow);button.disabled=true;button.textContent='Loading raster preview…';
    try{
      const clip=getNode(workflow,n.id,'clip_raster'),{boundary:studyBoundary}=previewArea(workflow,n.id),boundary=clip.params.cutline?.geometry||studyBoundary;
      const polygon=boundary.type==='MultiPolygon'&&boundary.coordinates.length===1?{type:'Polygon' as const,coordinates:boundary.coordinates[0]}:boundary;
      if(polygon.type!=='Polygon'||polygon.coordinates.length!==1)throw new Error('Preview adjustment currently supports a simple polygon. Holes and multiple polygons are retained but cannot be edited here.');
      const raster=await prepareRasterPreview(workflow,n.id);
      if(JSON.stringify(workflow)!==baseline)throw new Error('The workflow changed. Reopen the preview.');
      const draft:WorkflowNode<'study_area'>={id:clip.id,type:'study_area',x:clip.x,y:clip.y,params:{source:'drawn',label:clip.params.label,geometry:structuredClone(polygon),selectionMode:clip.params.cutline?.selectionMode||'polygon'}};
      openStudyAreaEditor(draft,(params,options={})=>{
        if(JSON.stringify(workflow)!==baseline)throw new Error('The workflow changed. Reopen the preview.');
        if(clip.params.cutline&&options.method===clip.params.method&&(options.marginPixels||0)===(clip.params.marginPixels||0)&&params.label===draft.params.label&&params.selectionMode===draft.params.selectionMode&&JSON.stringify(params.geometry)===JSON.stringify(draft.params.geometry))return true;
        if(!params.geometry)throw new Error('Define a clipping boundary.');
        return change(w=>{const target=getNode(w,n.id,'clip_raster');target.params.cutline={geometry:params.geometry!,selectionMode:params.selectionMode};target.params.label=params.label;target.params.method=options.method||clip.params.method;target.params.marginPixels=options.marginPixels||0;},{requirePersistence:true});
      },{raster,clip:true,clipOptions:clip.params,refusal:saveFailureMessage});
    }catch(error){toast(errorMessage(error),{tone:'failure'});}finally{button.disabled=false;button.textContent=label;}}
function addRasterMap(n:WorkflowNode){change(w=>{const id=`map-${Date.now()}`;w.nodes.push({id,type:'map_output',x:n.x+270,y:n.y,params:{label:'Clipped raster',inputMode:'raster',pointInputCount:1}});w.edges.push({id:`e-${Date.now()}`,from:n.id,to:id,port:'raster'});selected=id;});}
function rasterPresence(n:WorkflowNode<'raster_input'>,host:HTMLElement){const asset=n.params.asset;if(!asset)return;
    const notHere=(why:string)=>{if(host.isConnected)host.innerHTML=`<p class="standard-result standard-result-warning" data-raster-not-here>${esc(why)}</p>`;};
    void readPDF(asset.sha256).then(held=>{if(!held)notHere('Not on this device yet: read it again in Configure\u2026');},
      error=>notHere(`Kept, but not readable on this device (${errorMessage(error)}): choose the file again in Configure\u2026`));}
/** RASTER INPUT'S AND CLIP RASTER'S KIT (raster-ui.ts): the step kit, with what the last run did, and the actions that
 *  read files, previews and the study area, which stay here with what they read. */
function rasterKit():RasterKit{
  return {...stepKit(),facts:id=>result?.receipts?.find(r=>r.nodeId===id)?.facts,ran:()=>!!result,
    keepChange:edit=>change(edit,{requirePersistence:true}),
    prepare:n=>prepareRasterStep(n),previewClip:(n,e)=>previewClipStep(n,e),downloadClipped:(n,e)=>downloadClipped(n,e),
    addMap:n=>addRasterMap(n),presence:(n,host)=>rasterPresence(n,host)};
}
/** STUDY AREA'S MAP, kept here: it reads the project's other study areas from storage and says what landed. */
function editStudyArea(nodeId:string):void{
  const n=getNode(workflow,nodeId,'study_area');
  openStudyAreaEditor(n,params=>change(w=>{
    const target=getNode(w,n.id,'study_area'),before=target.params;
    const shape=(x:{source?:string;geometry?:unknown})=>x.source==='drawn'&&x.geometry?JSON.stringify(x.geometry):'';
    const changed=shape(params)!==shape(before);
    const kept=before.source==='drawn'?before.revisions??[]:[];
    // WHAT THE AREA STATES OUTSIDE ITS SHAPE stays when the shape is edited (2026-11-20): the map returns its shape and
    // name only, so the countries it lies in, and what its units are called, were dropped by every edit.
    const stated=before as {countries?:string[];country?:string;unitName?:string};
    target.params={...params,...(stated.countries?.length?{countries:stated.countries}:{}),...(stated.country?{country:stated.country}:{}),
      ...(stated.unitName?{unitName:stated.unitName}:{})} as typeof params;
    if(params.source==='drawn'&&params.geometry)
      target.params.revisions=changed||!kept.length
        ?[...kept,{at:new Date().toISOString(),geometry:structuredClone(params.geometry),selectionMode:params.selectionMode}]
        :kept;
    // SAY IT LANDED. The practitioner, 2026-10-20, after acquiring North Kivu: *"What's missing
    // is the feedback that the download completed."* The dialog had one -- "Applied in 0.7 s" --
    // written into a panel that closes in the same breath, so nobody ever read it. Confirmation
    // belongs where the practitioner is afterwards, which is the canvas, and it names what landed
    // rather than saying "done": the unit, its size, and that it is the published outline.
    const area=params.source==='drawn'?params:undefined;
    const ring=area?.geometry?.type==='Polygon'
      ?(area.geometry.coordinates as number[][][])[0]?.length??0
      :(area?.geometry?.coordinates as number[][][][]|undefined)?.reduce((n,part)=>n+(part[0]?.length??0),0)??0;
    if(area?.boundary)
      toast(`${area.boundary.unitName||'Boundary'} applied as published \u00b7 ${ring.toLocaleString()} vertices \u00b7 `
        +`${area.boundary.licence||'see the evidence panel for terms'}`);
    else if(ring)toast(`Study area applied \u00b7 ${ring.toLocaleString()} vertices.`);
  },{requirePersistence:true}),
    // THE PROJECT'S OTHER STUDY AREAS, read here because this is where the open project and the
    // saved workflows are known. `study-area-map.ts` draws a map and holds no import from
    // storage; it is handed the offers and renders them, or renders nothing when there are none.
    // Read at CLICK rather than at render, so a workflow saved in another tab since this
    // inspector was drawn is still offered.
    {refusal:saveFailureMessage,
      areas:siblingAreas(storageKey(workflow),allProjects(),readSavedWorkflows())});
}
/** STUDY AREA'S KIT (study-area-inspector.ts): the step kit, with its map and its N3. */
function studyAreaKit():StudyAreaKit{
  return {...stepKit(),edit:id=>editStudyArea(id),viewN3:()=>{renderN3();switchView('rules');}};
}
function inspectorKit():InspectorKit{
  return {esc,section:standardSection,name:(id,value)=>labelForm(id,'Name',value),inputs:standardInputs,
    workflow:()=>workflow,change:edit=>change(edit)};
}
/** MAP'S KIT (map-ui.ts): the standard one, with the last run and what its figure and dialog need of the application. */
function mapKit():MapKit{
  return {...inspectorKit(),result:()=>result,change:(edit,options)=>change(edit,options),renderResults,connect:setConnection,
    ruleCategories:node=>rulesAdd(node).categories,insetBoxFrom,spanKm:workflowSpanKm,writeUpSelect};
}
function standardSection(name:string,body:string):string{
  return `<section class="standard-section" data-standard-section="${esc(name.toLowerCase())}">`
    +`<h3 class="inspector-section">${esc(name)}</h3>${body}</section>`;
}
/** THE INPUT LISTS, as every step shows them: one per input, "Not connected" first, then every step that can feed it.
 *  `labels` names a port in the widget's own words where the generic name would not say which table is which. */
function standardInputs(n:WorkflowNode,labels:Record<string,string>={}):string{
  const incoming=workflow.edges.filter(e=>e.to===n.id);
  // GROUPED PORTS, one choice each, as on the canvas (PORT_GROUPS).
  const groups=PORT_GROUPS[n.type];
  if(groups){
    const nameOf=(id:string)=>{const x=workflow.nodes.find(y=>y.id===id);return x?(x.params.label||TYPES[x.type].title):id;};
    return Object.entries(groups).map(([group,ports])=>{
      const on=incoming.find(e=>ports.includes(e.port)),now=on?.from||'';
      const offers=workflow.nodes.filter(x=>x.id===now||validConnection({source:x.id,target:n.id,sourceHandle:'out',targetHandle:group} as Connection));
      const label=on?(PORT_NAMES[n.type]?.[on.port]??portLabel(on.port)):(PORT_NAMES[n.type]?.[group]??portLabel(group));
      return `<label class="field-label" for="connect-${esc(group)}">${esc(label)}</label>`
        +`<select id="connect-${esc(group)}" class="connect-port" data-connect-port="${esc(group)}"><option value="">${offers.length?'Not connected':'Nothing in this workflow can feed this yet'}</option>`
        +offers.map(x=>`<option value="${esc(x.id)}"${x.id===now?' selected':''}>${esc(nameOf(x.id))}</option>`).join('')+`</select>`;
    }).join('');
  }
  const nameOf=(id:string)=>{const x=workflow.nodes.find(y=>y.id===id);return x?(x.params.label||TYPES[x.type].title):id;};
  return nodeInputs(n).map(([port])=>{
    const now=incoming.find(e=>e.port===port)?.from||'';
    const offers=workflow.nodes.filter(x=>x.id===now||validConnection({source:x.id,target:n.id,sourceHandle:'out',targetHandle:port} as Connection));
    return `<label class="field-label" for="connect-${esc(port)}">${esc(labels[port]??PORT_NAMES[n.type]?.[port]??portLabel(port))}</label>`
      +`<select id="connect-${esc(port)}" class="connect-port" data-connect-port="${esc(port)}"><option value="">${offers.length?'Not connected':'Nothing in this workflow can feed this yet'}</option>`
      +offers.map(x=>`<option value="${esc(x.id)}"${x.id===now?' selected':''}>${esc(nameOf(x.id))}</option>`).join('')+`</select>`;
  }).join('');
}
function portLabel(port:string):string{
  const [base,n]=port.split(/_(\d+)$/);
  const name=PORT_LABELS[base!]||base!.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ').replace(/^./,c=>c.toUpperCase());
  return n?`${name} ${n}`:name;
}
function validConnection(c:Connection|Edge){const a=workflow.nodes.find(n=>n.id===c.source),b=workflow.nodes.find(n=>n.id===c.target);if(!a||!b||a.id===b.id||!outputOf(a))return false;
  // The map's one configurable port accepts anything the map can draw; which declared port it
  // becomes is decided on connection, by what the source emits. Without this the drop is refused
  // before setConnection ever sees it, because `layer` is not a declared port.
  if(PORT_GROUPS[b.type]?.[c.targetHandle??''])
    return !!groupFor(b.type,c.targetHandle??'',p=>portAccepts(nodeInputs(b).find(([q])=>q===p)?.[1],outputOf(a)));
  if(c.targetHandle==='layer'&&(b.type==='map_output'||b.type==='table_output'))
    return nodeInputs(b).some(([,type])=>type===outputOf(a))||(b.type==='table_output'&&portAccepts('table',outputOf(a)));
  // EVERY OTHER WIDGET'S BLANK PORT takes whatever one of its inputs takes (0.204.0).
  if(c.targetHandle==='layer'){const bound=inputFor(workflow,a,b);return !!bound.port||!!bound.choices;}
  return portAccepts(nodeInputs(b).find(([p])=>p===c.targetHandle)?.[1],outputOf(a));}
// DELETE REMOVES THE SELECTED CONNECTION, by the application (0.155.0 CI, Chromium; one run in five by hand at four
// workers): the connection was selected and said so in the Inspector, and the canvas library, whose own selection did not
// always agree, removed nothing. Once the library has had the key, a connection still selected is removed, once.
document.addEventListener('keydown',e=>{
  if(busy||(e.key!=='Delete'&&e.key!=='Backspace')||typeof selected!=='string'||!selected.startsWith('edge:'))return;
  if((e.target as HTMLElement|null)?.closest('input,textarea,select,[contenteditable="true"],dialog'))return;
  const id=selected.slice(5);
  setTimeout(()=>{if(!workflow.edges.some(x=>x.id===id))return;change(w=>{w.edges=w.edges.filter(x=>x.id!==id);});selected=null;render();},0);
});
mountCanvas($('#canvas'),{describe:describeNode,ready(api){flow=api;render();setTimeout(()=>flow!.fit(),80);},selectEdge(id){selected=`edge:${id}`;render();},select(id){selected=id;$('#node-search').value='';if(revealResultFor(id))renderResults();markLinkedTabs();render();$('#node-library [aria-current="true"]')?.scrollIntoView({block:'nearest',behavior:'smooth'});},clear(){selected=null;markLinkedTabs();render();},move(id,p){change(w=>Object.assign(required(w.nodes.find(n=>n.id===id)),{x:p.x,y:p.y}),{spatial:false});},connect:connectOnCanvas,valid:validConnection,remove:removeNodes,removeEdges(ids){change(w=>w.edges=w.edges.filter(e=>!ids.includes(e.id)));},zoom(z){$('#zoom-value').textContent=`${Math.round(z*100)}%`;}});
// Delegated, because the canvas redraws its nodes whenever anything changes and a listener bound
// to a button would go with them.
$('#canvas').addEventListener('click',event=>{
  const button=(event.target as HTMLElement).closest<HTMLElement>('[data-dismiss-alert]');
  if(!button)return;
  event.stopPropagation();
  dismissedAlerts.add(alertKey(button.dataset.dismissAlert!));
  render();
});
$('#run-button').onclick=run;onRunDetail(detail=>{runProgress=detail;drawRunProgress();});$('#node-search').oninput=e=>renderLibrary(control(e).value);$('#zoom-in').onclick=()=>flow?.zoomIn();$('#zoom-out').onclick=()=>flow?.zoomOut();$('#fit-button').onclick=()=>flow?.fit();
// Columns in the order the work happens. Offered rather than applied: a canvas somebody has
// arranged is theirs, and a canvas grown step by step is the moment it stops being readable.
$('#tidy-button').onclick=()=>{
  if(busy)return;
  // Heights in canvas units: an element's own layout height, which the canvas zoom does not change.
  const heights=new Map(workflow.nodes.map(n=>[n.id,
    document.querySelector<HTMLElement>(`.react-flow__node[data-id="${CSS.escape(n.id)}"]`)?.offsetHeight||0] as const)
    .filter(([,h])=>h>0));
  if(alreadyTidy(workflow,heights)){toast('Already laid out in order.');return;}
  const moved=change(w=>{const at=tidyLayout(w,heights);for(const node of w.nodes){
    const position=at.get(node.id);if(position){node.x=position.x;node.y=position.y;}}},{spatial:false});
  if(moved===false)return;
  flow?.fit();
  toast('Laid out in columns, left to right in the order the work happens. Undo to put it back.');
};
// A worked example is published work, and editing it should not mean losing it. The saved
/** Reload ONE imported workflow from the document it was read from, IN PLACE.
 *
 *  Asked which it should be, the practitioner, 2026-10-24: *"Yes reset the currently open
 *  workflow"* -- not the project. So the project membership and the minted key survive, because
 *  they are what make the workflow theirs; only the content is the publisher's again. A second
 *  import would have left them with two copies and renamed neither.
 *
 *  THE CACHE IS CHECKED BEFORE THE NETWORK, and the cache is keyed by the digest the catalog
 *  pins, so a hit is the same bytes that were verified at import rather than a second fetch
 *  trusted because the first one worked. An offline device resets; a device whose cache has been
 *  cleared re-fetches and verifies again.
 *
 *  Nothing is replaced until the published workflow has been read and validated: a refusal leaves
 *  the edited workflow exactly as it was and says why. */
async function resetFromOrigin(origin:ExampleOrigin):Promise<void>{
  const example=exampleById(origin.exampleId);
  if(!example){
    toast('This example is no longer in the catalog, so there is nothing to reload it from.',{tone:'failure'});
    return;
  }
  try{
    let payload=cachedPayload(origin.sha256);
    if(payload===undefined){
      toast('Fetching the published document again\u2026');
      const bytes=await verifiedFile(example,origin.path);
      payload=JSON.parse(await readMaybeGzipped(new Blob([bytes as BlobPart]))) as unknown;
      await putPayload(origin.sha256,payload);
    }
    const entry=readProjectDocument(payload).workflows[origin.index];
    if(!entry)throw new Error('The published document no longer carries this workflow, so there is nothing to reload.');
    const published=await importWorkflowDocument(entry.document,validateWorkflow);
    const identity={projectId:workflow.projectId,workflowKey:workflow.workflowKey,exampleId:undefined};
    const replaced=change(w=>{replaceWorkflow(w,{...published,...identity});selected=null;});
    if(replaced===false)return;
    result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};
    renderResults();renderLibrary($('#node-search').value);render();
    setTimeout(()=>flow?.fit(),80);
    toast('Reloaded as published.');
  }catch(error){
    toast(errorMessage(error),{tone:'failure'});
  }
}
// workspace is kept when the dropdown is used, so this is the way back to the published one.
$('#reset-example').onclick=async()=>{
  if(busy)return;
  const origin=originOf(storageKey(workflow));
  if(!confirm('Discard your edits to this workspace and reload it as published? This cannot be undone.'))return;
  if(origin){await resetFromOrigin(origin);return;}
  const key=exampleKey(workflow);
  // Not loadExample: that saves the workspace you are leaving before loading, which would
  // write the edited version straight back over the one being discarded. Replacing in place
  // lets the ordinary save put the published template where the edit was.
  const replaced=change(w=>{replaceWorkflow(w,template(key));selected=null;});
  if(replaced===false)return;
  result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};
  renderResults();renderLibrary($('#node-search').value);render();
  setTimeout(()=>flow?.fit(),80);
  recordRevision(key);
  toast('Reloaded as published.');
};
$('#undo-button').onclick=()=>{if(busy||!history.length)return;future.push(structuredClone(workflow));workflow=history.pop()!;dirty=true;statuses={};save();render();};
$('#redo-button').onclick=()=>{if(busy||!future.length)return;history.push(structuredClone(workflow));workflow=future.pop()!;dirty=true;statuses={};save();render();};
// THE LIBRARY'S OWN "Restore example" AND ITS SLOGAN ARE GONE (the practitioner, 2026-11-18: "What's the use of this 'Your
// data stays here' and the text below, looks stale"): the slogan was commentary and no longer true of basemaps, shared
// projects or remote files, and the button restored without asking. Reset example, in the bar, asks first.
/** "OPENING …" WHILE A LARGE PROJECT LOADS (2026-11-20). The practitioner: *"when loading a big one like the population
 *  rasters there is a noticeable lag. Perhaps we can alert the user that a project is loading, with an animated loading
 *  icon."* Opening a workflow is synchronous until its tables are restored, so the notice is painted first, two frames
 *  ahead of the work, and taken down when the canvas is drawn and its tables restored, or when a run starts, which says
 *  its own state. */
const opening=(()=>{
  const el=document.createElement('div');el.id='opening-notice';el.className='opening-notice';el.setAttribute('role','status');el.hidden=true;
  el.innerHTML='<span class="opening-ring" aria-hidden="true"></span><span id="opening-text"></span>';
  document.body.append(el);return el;
})();
const painted=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
// OPENED IN ORDER, THE LAST ONE CHOSEN WINS (2026-11-20): the notice's wait for a paint let two quick choices finish
// out of order, leaving the first on the canvas. Each open waits for the one before, and one already overtaken by a
// later choice opens nothing.
let openQueue:Promise<void>=Promise.resolve(),openSerial=0;
function openWithNotice(key:string|(()=>string|undefined),name:string):Promise<void>{
  const mine=++openSerial;
  const run=openQueue.then(()=>mine===openSerial?openNow(key,name):undefined);
  openQueue=run.catch(()=>undefined);
  return run;
}
async function openNow(key:string|(()=>string|undefined),name:string):Promise<void>{
  ($('#opening-text') as HTMLElement).textContent=`Opening ${name}\u2026`;opening.hidden=false;
  await painted();
  try{
    // WHICH WORKFLOW, decided after the notice is on screen: reading every saved workflow to choose was itself 1.9 s.
    const chosen=typeof key==='function'?key():key;if(!chosen)return;
    const loaded=loadExample(chosen);
    await Promise.race([loaded,new Promise<void>(resolve=>{const check=setInterval(()=>{if(busy){clearInterval(check);resolve();}},100);void loaded.finally(()=>clearInterval(check));})]);
  }finally{opening.hidden=true;}
}
$('#workflow-select').onchange=e=>{const select=control(e) as HTMLSelectElement,key=select.value;
  void openWithNotice(key,select.selectedOptions[0]?.textContent?.trim()||key);};
/** Switching project opens one of its workflows, because a project is not a thing you can look at
 *  on the canvas -- the canvas holds a question, and a project holds the questions. The first one
 *  that exists is opened; a project whose workflows have all been deleted opens an empty canvas
 *  belonging to it rather than refusing. */
$('#project-select').onchange=e=>{
  const id=control(e).value,project=allProjects().find(p=>p.id===id);
  if(!project){loadExample('blank');return;}
  if(!project.workflows.length){addWorkflowToProject(project.id);return;}
  void openWithNotice(()=>{const saved=readSavedWorkflows();return project.workflows.find(key=>saved[key])||project.workflows[0];},project.name);
};
$('#blank-add').onclick=()=>$('#node-library [data-add="study_area"]')?.click();
$('#blank-area').onclick=()=>$('#node-library [data-add="study_area"]')?.click();
$('#blank-examples').onclick=()=>{switchView('project');showProjectTab('examples');};
/** The eyebrow above the workflow's name: the investigation it belongs to, and how many
 *  workflows that investigation holds. Said rather than implied, because the whole finding behind
 *  experiment 122 is that four workflows about one outbreak looked like four unrelated workspaces. */
/** WHERE YOU ARE, AND THE WAY BACK UP. Experiment 131 asked for a breadcrumb --
 *  `Facilities and Networks > Health Facilities Ituri` -- as the shift between the two places the
 *  practitioner works, and noted it would be the first thing in the application to say that a
 *  workflow is INSIDE a project.
 *
 *  This read `PROJECT NAME / 1 workflow` until 2026-10-23. Two things were wrong with it. A count
 *  is not a crumb: it told you how many workflows the project held and never which one you had
 *  open, so the second half of the trail was missing. And neither half went anywhere, which is
 *  the discoverability problem this experiment is about -- the project level was reachable only
 *  by recognising a storage readout as a button.
 *
 *  The count now lives where it is useful, in the Project view and in the project's own details,
 *  rather than in the one line that should answer "where am I". */

/** Create a project, then give it its first workflow.
 *
 *  The practitioner, 2026-10-19: *"the first step is not even study area - it's create a project."*
 *  So this runs BEFORE any geography: it names the investigation, then opens one empty canvas
 *  belonging to it. The study area is step two, inside that workflow, where it always was. */
/** WHAT A PROJECT IS WRITING TOWARDS (experiment 202, Stage A): one box per target, none required. */
function targetsChoices(name:string,chosen:readonly string[],legend:boolean,disabled=false):string{
  return (legend?'<legend class="field-label">Writing towards</legend>':'')
    +'<p class="muted">What this project will become: one or more, or none yet. Notes shows the outline of each.</p>'
    +TARGETS.map(t=>`<label class="targets-choice"><input type="checkbox" name="${name}" value="${esc(t.id)}"${chosen.includes(t.id)?' checked':''}${disabled?' disabled':''}> ${esc(t.label)}</label>`).join('');
}
const chosenTargets=(name:string)=>[...document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)].map(i=>i.value);
/** THE PROJECT TAB'S THREE PARTS (the practitioner, 2026-11-16: *"I think we can separate the example projects, new
 *  project, and loaded project into three tabs so it's cleaner."*): the project open now, a new one, the worked
 *  examples. Which was last shown is remembered on this device, as a convenience. */
type ProjectTab='this'|'new'|'examples';
const PROJECT_TAB_KEY='fieldwork-project-tab-v1';
function showProjectTab(which:ProjectTab,chosen=true){
  for(const tab of document.querySelectorAll<HTMLButtonElement>('[data-project-tab]')){
    const on=tab.dataset.projectTab===which;
    tab.classList.toggle('active',on);tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;
    const panel=document.getElementById(tab.getAttribute('aria-controls')||'');if(panel)panel.hidden=!on;
  }
  if(chosen)try{localStorage.setItem(PROJECT_TAB_KEY,which);}catch{/* a convenience only */}
  // After the module has finished starting: the manual's placement reads state declared further down.
  queueMicrotask(placeManualFloat);
}
/** The tab last chosen; before any is chosen, the open project, or the worked examples when no project is open, since
 *  This project then has nothing of a project to show. */
function rememberedProjectTab():ProjectTab{
  try{const v=localStorage.getItem(PROJECT_TAB_KEY);if(v==='this'||v==='new'||v==='examples')return v;}catch{/* none */}
  const key=storageKey(workflow);
  return workflow.projectId||projectOfWorkflow(key,allProjects())?'this':'examples';
}
for(const tab of document.querySelectorAll<HTMLButtonElement>('[data-project-tab]')){
  tab.addEventListener('click',()=>{const which=tab.dataset.projectTab as ProjectTab;
    if(which==='new')openProjectDialog();else showProjectTab(which);});
  // ARROW KEYS MOVE BETWEEN TABS, as a tab list does.
  tab.addEventListener('keydown',event=>{
    const all=[...document.querySelectorAll<HTMLButtonElement>('[data-project-tab]')],at=all.indexOf(tab);
    const next=event.key==='ArrowRight'?all[(at+1)%all.length]:event.key==='ArrowLeft'?all[(at+all.length-1)%all.length]:undefined;
    if(next){event.preventDefault();next.focus();next.click();}});
}
/** NEW PROJECT, a tab of the Project view since 2026-11-16 (it was a dialog). What is typed there stays while the
 *  person looks at the other tabs, and is cleared once the project is made. */
function openProjectDialog(){
  if(busy)return;
  if(currentView!=='project')switchView('project');
  const targets=$('#project-targets-new') as HTMLElement;
  if(!targets.innerHTML)targets.innerHTML=targetsChoices('project-target-new',[],true);
  // WHAT HAPPENS TO THE CANVAS YOU HAVE OPEN, said before it happens. This created the project and
  // then replaced the canvas with an empty workflow named "<project> · first question", which is
  // right when starting an investigation from nothing -- the practitioner's own 2026-10-19 request,
  // *"the first step is not even study area - it's create a project"* -- and wrong when the reason
  // for making the project is the work already on screen. One control served the first intent and
  // silently did the second thing.
  const key=storageKey(workflow);
  const filed=allProjects().some(p=>p.workflows.includes(key));
  const adopt=$('#project-adopt-current');
  const name=workflow.name||WORKFLOW_LABELS[key]||key;
  adopt.checked=!filed&&workflow.nodes.length>0;
  adopt.disabled=filed;
  // ONLY WHERE IT IS A CHOICE (the practitioner, 2026-11-16: *"I clicked new project so I expect an empty workflow"*): a
  // workflow already in a project cannot be moved by this, so the box and its explanation are not shown.
  (adopt.closest('label') as HTMLElement).hidden=filed;
  $('#project-adopt-label').textContent=filed
    ?`"${name}" is already filed under a project, so a new one starts with an empty workflow.`
    :`Put "${name}" in it, instead of starting with an empty workflow.`;
  showProjectTab('new',false);$('#project-name-input').focus();
}
function createProjectFromDialog(){
  const made=createProject({name:$('#project-name-input').value.trim(),subject:$('#project-subject-input').value,
    targets:chosenTargets('project-target-new'),adopt:$('#project-adopt-current').checked&&!$('#project-adopt-current').disabled,
    nameField:$('#project-name-input')});
  if(made){$('#project-name-input').value='';$('#project-subject-input').value='';($('#project-targets-new') as HTMLElement).innerHTML='';}
  return made;
}
/** A NEW PROJECT, from either path of New project: on this device, or started in a shared repository (2026-11-16). */
function createProject(o:{name:string;subject:string;targets?:string[];adopt?:boolean;nameField?:HTMLElement;repository?:NonNullable<Project['repository']>}):Project|null{
  const name=o.name.trim();
  if(!name){o.nameField?.focus();toast('A project needs a name: what are you investigating?');return null;}
  // The person making it is its first author. Absent when this device records nobody, and then
  // the project simply has none -- an unattributed project is honest, a guessed author is not.
  const stored=readProjects(),project=newProject(name,o.subject,
    allProjects(),currentIdentity(localStorage));
  if(o.targets?.length)project.targets=o.targets;
  if(o.repository)project.repository=o.repository;
  const key=`${project.id}/w1`;
  project.workflows=[key];
  if(!writeProjects([...stored,project]))return null;
  // MADE: the tab returns to the project now open.
  showProjectTab('this',false);
  save();
  // ADOPTING THE OPEN CANVAS takes the path that already files a workflow, rather than a second
  // implementation of the same act: the project is written with no workflows and
  // `assignCurrentWorkflow` gives this one its key and puts it in.
  if(o.adopt){
    project.workflows=[];
    if(!writeProjects([...stored,project])){return null;}
    assignCurrentWorkflow(project.id);
    renderProjectOptions();render();
    toast(`"${workflow.name||'This workflow'}" is now in "${project.name}". `
      +'Add a workflow for each further question you want to ask about it.');
    return project;
  }
  workflow={...blankWorkflow(),name:`${project.name} · first question`,projectId:project.id,workflowKey:key,exampleId:undefined};
  selected=null;result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};dirty=true;
  save();renderProjectOptions();renderLibrary();renderResults();render();switchView('workflow');
  toast(`Project "${project.name}" created with one empty workflow. Add a workflow for each question you want to ask about it.`);
  return project;
}
/** Stored projects in the picker, grouped exactly as the built-in seven are in index.html.
 *  Without this a created project persists and becomes unreachable, which is worse than refusing
 *  to create one. Rebuilt wholesale rather than patched: there are at most a few dozen. */
function renderProjectOptions(){
  // TWO selects, because they are two questions. The practitioner, 2026-10-20: *"I can only view
  // the workflows through the worked example dropdown which seems to be the wrong place to locate
  // projects."* It was: one control listed every shipped example and every created project's
  // workflows together, so a project existed only as an optgroup label and could not be chosen,
  // renamed or looked at. Now the first select chooses the investigation and the second chooses
  // the question, and the worked examples appear as what they already are -- seven built-in
  // projects holding eleven workflows, listed beside yours and marked.
  const projects=$('#project-select') as HTMLSelectElement,workflows=$('#workflow-select') as HTMLSelectElement;
  const saved=readSavedWorkflows(),stored=readProjects();
  const key=storageKey(workflow);
  const current=workflow.projectId?allProjects().find(p=>p.id===workflow.projectId):projectOfWorkflow(key,allProjects());
  const unfiled=Object.keys(saved).filter(k=>!allProjects().some(p=>p.workflows.includes(k)));

  const optionFor=(value:string,label:string,workflowKeys?:readonly string[])=>
    `<option value="${esc(value)}"${workflowKeys?` data-workflows="${esc(workflowKeys.join(' '))}"`:''}>${esc(label)}</option>`;
  const group=(label:string,body:string)=>body?`<optgroup label="${esc(label)}">${body}</optgroup>`:'';
  const count=(project:Project)=>project.workflows.length===1?'1 workflow':`${project.workflows.length} workflows`;
  // "No project" is ALWAYS offered, not only while the open canvas is in none. Without it a
  // workflow belonging to no investigation -- the blank canvas among them -- became unreachable
  // the moment a project was selected, which is a navigation trap rather than a tidy list.
  projects.innerHTML=
    // SHARED ONES IN A GROUP OF THEIR OWN, with the repository (the practitioner, 2026-11-16, asking why a worked example
    // shows here and a collaborative project did not seem to: it did, unmarked, among the rest).
    // The repository is not repeated in the entry (the practitioner, 2026-11-16: "That is a very long drop down item"):
    // the group says where, and This project names the repository.
    group('Shared through GitHub',stored.filter(p=>p.repository).map(p=>optionFor(p.id,`${p.name} · ${count(p)}`,p.workflows)).join(''))
    +group('Your projects',stored.filter(p=>!p.repository).map(p=>optionFor(p.id,`${p.name} · ${count(p)}`,p.workflows)).join(''))
    +group('Built in',BUILT_IN_PROJECTS.map(p=>optionFor(p.id,`${p.name} · ${count(p)}`,p.workflows)).join(''))
    +optionFor('','— No project —',['blank',...unfiled]);
  projects.value=current?current.id:'';

  // The workflows of the chosen project, plus -- only when the open canvas belongs to none --
  // the unfiled ones, so a workflow can never become unreachable by having no project.
  const keys=current?current.workflows:[...new Set(['blank',...unfiled])];
  workflows.innerHTML=keys.map(k=>optionFor(k,(saved[k] as {name?:string}|undefined)?.name||workflowTitle(k))).join('')
    +(keys.includes(key)?'':optionFor(key,workflow.name||'This canvas'));

  // THE TEMPLATE PICKER lists every workflow on this device that has something to copy, because a
  // method is worth reusing across projects as well as inside one -- the next province is a new
  // question, and sometimes a new investigation. A workflow with no widgets is not offered: there
  // would be nothing to fill.
  // GROUPED BY PROJECT, THIS ONE FIRST (the practitioner, 2026-11-18, of MERS's picker listing Soho and Hagelloch: "This
  // list should only use workflows from the current project", then "Or there has to be way to know which project a workflow
  // belongs to because that list is overwhelming", and chose the grouping). A workflow in no project is under its own heading.
  const template=$('#workflow-template');
  const copyable=Object.entries(saved)
    .filter(([k,w])=>k!==key&&((w as {nodes?:unknown[]}).nodes?.length||0)>0)
    .map(([k,w])=>[k,(w as {name?:string}).name||workflowTitle(k)] as const);
  const owners=[...(current?[current]:[]),...allProjects().filter(p=>p.id!==current?.id)];
  const placed=new Set<string>();
  const groups=owners.map(p=>{const inIt=copyable.filter(([k])=>p.workflows.includes(k)&&!placed.has(k));inIt.forEach(([k])=>placed.add(k));
    return group(p.id===current?.id?`This project: ${p.name}`:p.name,inIt.map(([k,label])=>optionFor(k,label)).join(''));});
  const loose=copyable.filter(([k])=>!placed.has(k));
  const candidates=copyable;
  template.innerHTML=`<option value="">＋ From a template…</option>`+groups.join('')
    +group('No project',loose.map(([k,label])=>optionFor(k,label)).join(''));
  template.hidden=!candidates.length;
  template.disabled=busy;

  // DELETE is offered for a workflow a practitioner made and refused for a worked example, which
  // ships with the application: the control says which, rather than being absent and leaving the
  // question of where workflows go to be asked again.
  const remove=$('#delete-workflow') as HTMLButtonElement;
  // SHIPPING WITH THE APPLICATION IS A FACT ABOUT THE LIST, NOT ABOUT THE KEY'S SHAPE.
  //
  // This was `isExampleKey(key)` -- `!key.includes('/')` -- so ANY workflow whose key had no
  // slash was refused deletion as a worked example, including one imported from a repository.
  // The practitioner, 2026-10-24, on the South London example fetched from the catalog: *"Any
  // imported project we should be able to delete, including repo-based projects like South
  // London."*
  //
  // The line below already knew better: Reset example reads the compiled-in list and correctly
  // hid itself for an imported workflow. So the refusal told the practitioner to use a control
  // that the next statement had removed from the bar -- it refused the action they wanted and
  // recommended one that was not there.
  //
  // THE TWO CONTROLS ASK DIFFERENT QUESTIONS, which is how the first fix for this broke the blank
  // canvas. Delete asks "does this ship with the application", and the blank canvas does, so it is
  // EXAMPLE_KEYS. Reset example asks "is there published work to reload", and a blank canvas has
  // none, so it is WORKED_EXAMPLE_KEYS -- the same list with `blank` removed. Sharing one
  // predicate is what made `isExampleKey` look right: wrong for an imported workflow and right by
  // accident for the blank one. `workflow-housekeeping` caught the replacement in both engines.
  const published=EXAMPLE_KEYS.includes(key);
  // RESET EXAMPLE is about published work, so it is in the bar only while published work is open.
  // On everything else it was a control for a thing that does not exist -- there is nothing to
  // reload a practitioner's own workflow to -- taking a slot beside the controls that do apply.
  // The blank canvas is not a worked example either: "New empty canvas" is its gesture.
  // An imported example has no template, but it has an origin, and that is published work too.
  $('#reset-example').hidden=!WORKED_EXAMPLE_KEYS.includes(key)&&!originOf(key);
  const manualTab=$('[data-view="manual"]');manualTab.hidden=!exampleManual();
  if(manualTab.hidden&&currentView==='manual')switchView('workflow');
  else if(currentView==='manual')renderManualView();
  remove.disabled=busy||published;
  remove.title=published
    ?'A worked example ships with the application and stays. "Reset example" discards your edits to it.'
    :`Remove "${workflow.name||workflowTitle(key)}" from this device. This cannot be undone.`;

  workflows.value=key;
}
/** What a workflow is called before it has been opened and saved under its own name. Built-in
 *  workflows carry the example's own title; a created one carries whatever it was named. */
function workflowTitle(key:string):string{
  const labels=WORKFLOW_LABELS as Record<string,string|undefined>;
  return labels[key]||key;
}
/** The investigation this workflow is in, and the way to change it.
 *
 *  The practitioner, 2026-10-19: *"users can create workflows and can import them into projects.
 *  Maybe make that optional?"* So it is optional in both directions -- a workflow may belong to no
 *  project, and one that does can be moved out again. The seven built-in projects are the worked
 *  examples and are compiled in, so they are shown but cannot be edited: adding your workflow to
 *  "John Snow, Soho, 1854" would change a published example, and that is the one case where a
 *  practitioner's work and the project's own records would disagree about what an example is. */
/** Click the name, type the name. The practitioner chose "edit in place" and then reported, on
 *  what I built: *"There is still no way to edit project (e.g., title) or workflow (e.g., title)
 *  metadata."* It was there -- behind a collapsed disclosure at the bottom of the bar, which is
 *  somewhere to PUT a control rather than somewhere a practitioner looks. A title you can click
 *  is the gesture the choice implied, and the disclosure keeps the things that are not a title:
 *  the subject, the workflow list, the id, and the two destructive actions.
 *
 *  Escape abandons, Enter and blur apply. An empty name is abandoned rather than written, because
 *  a project called "" is unfindable in the very selector this was built for. */
function editInPlace(element:HTMLElement,current:string,apply:(value:string)=>void,refuse?:string){
  if(refuse){toast(refuse,{tone:'warning'});return;}
  if(busy||element.querySelector('input'))return;
  const input=document.createElement('input');
  input.className='inline-rename';input.value=current;input.maxLength=80;
  input.setAttribute('aria-label',element.dataset.renameLabel||'Rename');
  const previous=element.textContent||'';
  element.textContent='';element.append(input);input.focus();input.select();
  let done=false;
  const finish=(write:boolean)=>{
    if(done)return;done=true;
    const value=input.value.trim();
    element.textContent=previous;
    if(write&&value&&value!==current)apply(value);else render();
  };
  input.addEventListener('keydown',event=>{
    if(event.key==='Enter'){event.preventDefault();finish(true);}
    if(event.key==='Escape'){event.preventDefault();finish(false);}
  });
  input.addEventListener('blur',()=>finish(true));
}
/** Rename the question this canvas answers, from the heading that states it. */
function renameWorkflowInPlace(){
  editInPlace($('#project-title'),workflow.name||'',value=>{
    change(w=>{w.name=value;},{spatial:false});toast(`Workflow renamed to "${value}".`);
  });
}
/** The project's own fields, and the one place they can be changed.
 *
 *  Until 2026-10-20 a project could be created and never edited: no rename, no subject change, no
 *  deletion, and the subject was visible only as a tooltip on the eyebrow. The practitioner:
 *  *"Right now I have no way of editing Project Title nor viewing Project metadata."* */
function renderProjectDetails(){
  const key=storageKey(workflow);
  const project=workflow.projectId?allProjects().find(p=>p.id===workflow.projectId):projectOfWorkflow(key,allProjects());
  const builtIn=!!project&&BUILT_IN_PROJECTS.some(p=>p.id===project.id);
  const saved=readSavedWorkflows();
  ($('#project-name-edit') as HTMLInputElement).value=project?project.name:'';
  ($('#project-subject-edit') as HTMLInputElement).value=project?project.subject:'';
  ($('#project-targets-edit') as HTMLElement).innerHTML=targetsChoices('project-target-edit',project?.targets??[],false,!project||builtIn);
  ($('#workflow-name-edit') as HTMLInputElement).value=workflow.name||'';
  // THE OBJECTIVE THIS WORKFLOW ANSWERS (Stage B): offered once the project has objectives, which a project begun from
  // its objectives has before it has any workflow. Kept on the objective, as the workflow it is answered by.
  {const objectives=objectivesOf((project?.notes||[]) as Note[]),pick=$('#workflow-objective-edit') as HTMLSelectElement;
   $('#workflow-objective-field').hidden=!objectives.length;pick.disabled=!project||builtIn;
   pick.innerHTML=`<option value="">None of them</option>`+objectives.map(o=>
     `<option value="${esc(o.id)}"${o.question===key?' selected':''}>Objective ${o.n}: ${esc(o.text)}</option>`).join('');}
  for(const id of ['#project-name-edit','#project-subject-edit'])
    ($(id) as HTMLInputElement).disabled=!project||builtIn;
  ($('#project-delete') as HTMLButtonElement).disabled=!project||builtIn;
  $('#project-readonly').hidden=!builtIn;
  const held=project?project.workflows:[];
  const named=held.map(k=>(saved[k] as {name?:string}|undefined)?.name||workflowTitle(k));
  $('#project-stats').textContent=project
    ?`${held.length===1?'1 workflow':`${held.length} workflows`}: ${named.join(' · ')}. Project id ${project.id}.`
    :'This canvas belongs to no investigation. Choose one below, or create a project to group the questions you are asking.';
  renderSharedProject(project,builtIn);
}
/** THE NOTES VIEW. A spike: `notes.ts` has existed since 2026-10-28 and nothing imported it, so
 *  notes were produced, stored, grouped and counted where no practitioner could see one.
 *
 *  Read from the project and from the last run together, because a write-up does not care which
 *  of the two wrote a sentence and a reader checking one does -- so the label carries that and
 *  the grouping does not. */
/** The notes on screen, so a click can find the one it names. Rebuilt with the view. */
let shownNotes:Note[]=[];
/** THE TABLES, CHARTS AND MAPS THE NOTES BOARD SHOWS, by note key, named for a person choosing one (Stage B). */
let shownComponents:{key:string;label:string}[]=[];
/** A table, chart or map: a step's description of what it published, or a picture somebody put in their note. */
const isComponent=(note:Note)=>(note.kind==='authored'&&!!note.image)
  ||(note.kind==='machined'&&!!note.nodeId&&!!describedNode(note.id));
/** THE PROJECT THE OPEN WORKFLOW BELONGS TO, read for DISPLAY and so read from all of them.
 *
 *  This asked `readProjects()` until 2026-10-31, which is localStorage only -- so the seven
 *  BUILT_IN_PROJECTS were invisible to it and every shipped example reported itself as belonging
 *  to no project. `renderProjectDetails` does the same lookup one line differently
 *  (`allProjects()`), so the Project tab and the Notes tab contradicted each other on the same
 *  open canvas: "Heat outreach screening" against "This workflow is not in a project". Found
 *  while answering the practitioner's question about project-less workflows, on the `heat`
 *  example -- which is the first-visit default, so it was the first thing a new practitioner saw.
 *
 *  THE SPLIT IS DISPLAY AGAINST MUTATION, and it is the rule the rest of this file already
 *  follows: every call that is about to rename, delete or add reads `readProjects()`, because a
 *  built-in is not in storage and cannot be written to; every call that is about to show
 *  something reads `allProjects()`. `projectNow` served both doors through the mutating lookup.
 *  `writeNotes` below keeps the mutation side honest on its own -- it looks the project up in
 *  storage and refuses when it is not there -- so this reads for display and the writes still
 *  refuse where there is nothing to write to. What a built-in's read-only write-up must not do is
 *  OFFER to take a note, which is what `keptHere` is for. */
/** THE PROJECT'S WIDGETS TAB: each widget its workflows use, and as which steps. A canvas in no project shows its own. */
function renderWidgetsView():void{
  const project=projectNow(),here=storageKey(workflow),saved=readSavedWorkflows();
  const docOf=(key:string):Workflow|undefined=>{
    if(key===here)return workflow;
    const stored=saved[key] as Workflow|undefined;
    if(stored?.nodes)return stored;
    try{return EXAMPLE_TEMPLATES[key]?.();}catch{return undefined;}
  };
  const keys=project?.workflows?.length?[...project.workflows]:[here];
  const docs=keys.map(key=>({key,doc:docOf(key)})).filter((x):x is {key:string;doc:Workflow}=>!!x.doc)
    .map(({key,doc})=>({key,name:doc.name?.trim()||WORKFLOW_LABELS[key]||key,nodes:doc.nodes}));
  const order=PALETTE_GROUPS.flatMap(g=>(Object.keys(TYPES) as NodeType[]).filter(t=>TYPES[t].group===g));
  const rows=projectWidgets(docs,order);
  const view=$('#widgets-view');
  view.innerHTML=projectWidgetsMarkup(project?.name??workflow.name??'this workflow',rows,docs.length,
    type=>({title:TYPES[type as NodeType]?.title??type,icon:iconMarkup(type,TYPES[type as NodeType]?.icon??''),manual:hasManual(type)}),esc);
  view.querySelectorAll<HTMLButtonElement>('[data-open-workflow]').forEach(b=>{b.disabled=busy;if(busy)b.title='Wait for the run to finish';});
  view.querySelectorAll<HTMLButtonElement>('[data-open-workflow]').forEach(b=>b.addEventListener('click',async()=>{
    const key=b.dataset.openWorkflow!;
    if(key!==storageKey(workflow))await openWithNotice(key,b.closest('[data-workflow-row]')?.querySelector('strong')?.textContent?.trim()||b.textContent?.replace(/^Open\s*/,'').trim()||'the workflow');
    switchView('workflow');}));
  view.querySelectorAll<HTMLButtonElement>('[data-widget-manual]').forEach(b=>b.addEventListener('click',()=>{
    const type=b.dataset.widgetManual as NodeType;openManual(type,TYPES[type]?.title??type,esc);}));
}
const projectNow=()=>{
  const key=storageKey(workflow);
  return workflow.projectId?allProjects().find(p=>p.id===workflow.projectId)
    :projectOfWorkflow(key,allProjects());
};
/** WHY A NOTE CANNOT BE KEPT HERE, or null where one can.
 *
 *  The practitioner, 2026-10-31: *"we can gray out the + notes to make it clear notes cannot be
 *  added without a project."* Two different states need that, and they need different sentences:
 *  an unfiled canvas has nowhere to keep a note, and a shipped example has a project that is not
 *  on this device to be written to. Both end at `writeNotes` returning false; only one of them is
 *  about a missing project, so one message for both would be wrong half the time. */
const keptHere=(project:Project|undefined):string|null=>{
  if(!project)return 'This workflow is not in a project, so there is nowhere to keep a note. '
    +'File it under a project on the Project tab, and its notes become that investigation\u2019s.';
  if(readProjects().some(p=>p.id===project.id))return null;
  return `${project.name} is a worked example that ships with Fieldwork, so its write-up is `
    +`read-only. Its notes, tables, charts and maps are below; to write your own, `
    +`make a project of your own on the Project tab.`;
};
/** The open project's plan as stored now, and writing it back: kept with the project, as its notes are. */
/** The audit the Notes board last drew, so a draft can open it for its own kind. */
let lastAudit:{targets:{id:string;label:string}[];of:(target:string)=>import('./notes-audit.js').Audit}|null=null;
function planOfProject():Plan|undefined{const project=projectNow();
  return project?(readProjects().find(p=>p.id===project.id)?.plan??project.plan):undefined;}
function writePlan(plan:Plan):boolean{
  const project=projectNow();if(!project)return false;
  const stored=readProjects();const at=stored.findIndex(p=>p.id===project.id);if(at<0)return false;
  const {plan:_was,...rest}=stored[at]!;void _was;
  stored[at]=plan.parts.length||plan.complete?{...rest,plan}:rest;
  return writeProjects(stored);
}
/** CUES FOR A MAP WITH NO GROUND: up to five marks named from their records, a scale bar, and a line saying the basemap
 *  is not shown. Drawn on the page's scale, 14 units and up. */
/** Up to five marks named beside themselves, from their records' names, outlined so they read over a basemap. */
function markNames(result:Output,project:(c:[number,number])=>[number,number]):string{
  const marks=(result.rows??[]).filter(r=>Array.isArray(r.coordinates));
  return marks.length<=5?marks.map(r=>{const [x,y]=project(r.coordinates as [number,number]);
    const name=String((r as {name?:unknown}).name??'').trim();
    if(!name||x<0||x>850)return '';
    const anchor=x>640?'end':'start',dx=x>640?-10:10;
    return `<text data-mark-name="" x="${x+dx}" y="${y+5}" text-anchor="${anchor}" font-size="14" font-weight="600" fill="#1f2a24" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" paint-order="stroke">${esc(name)}</text>`;}).join(''):'';
}
function bareMapCues(project:(c:[number,number])=>[number,number],bounds:[number,number,number,number]):string{
  const lat=(bounds[1]+bounds[3])/2,lon=(bounds[0]+bounds[2])/2;
  // At the foot of the map as drawn, which is not always 295 tall.
  const foot=Math.round(Math.max(project([lon,bounds[1]])[1],project([lon,bounds[3]])[1]));
  const [x0]=project([lon,lat]),[x1]=project([lon+1000/(111_320*Math.cos(lat*Math.PI/180)),lat]);
  const perKm=Math.abs(x1-x0);let bar='';
  if(perKm>0&&Number.isFinite(perKm)){
    const target=170/perKm,km=[0.1,0.2,0.5,1,2,5,10,20,50,100,200,500,1000].filter(v=>v<=target).pop()??0.1,len=km*perKm;
    bar=`<g data-bare-scale=""><path d="M20,${foot-23}V${foot-19}H${20+len}V${foot-23}" fill="none" stroke="#1f2a24" stroke-width="1.5"/>`
      +`<text x="20" y="${foot-29}" font-size="14" fill="#1f2a24">${km<1?`${km*1000} m`:`${km} km`}</text></g>`;
  }
  return bar+`<text data-bare-note="" x="830" y="${foot-10}" text-anchor="end" font-size="14" fill="#3d3d3d">Basemap not shown</text>`;
}
/** A map's features for placing an inset: the boundary's rings and the marks, projected as the large frame draws them. */
function insetFeatures(boundary:Boundary|undefined,rows:readonly {coordinates?:unknown}[],project:(c:[number,number])=>[number,number]):import('./map-inset.js').Features{
  const polys=!boundary?[]:boundary.type==='Polygon'?[boundary.coordinates]:boundary.coordinates;
  return {rings:polys.flatMap(p=>p.map(ring=>ring.map(c=>project(c as [number,number])))),
    points:rows.filter(r=>Array.isArray(r.coordinates)).map(r=>project(r.coordinates as [number,number]))};
}
/** THE INSETS' NAMES, FROM THE BOUNDARY'S OWN RECORD (the practitioner, 2026-11-18: "make sure we have them labeled
 *  properly using existing metadata"). The overview names the whole: the unit, where there is one; the country, where the
 *  boundary joins several units (MERS's seventeen provinces are not a name); the study area's label, where no boundary
 *  was acquired. The focus names the unit its centre falls in, where the units are named; otherwise nothing is invented. */
function insetNames(area:AreaParams|undefined,box:[number,number,number,number],drawn?:Boundary):{whole?:string;focus?:string}{
  if(!area)return {};
  const b=area.boundary,units=b?.units??[],country=iso3Of(b);
  const whole=!b?area.label:units.length>1?(country?countryName(country):area.label):b.unitName||area.label;
  const centre:[number,number]=[(box[0]+box[2])/2,(box[1]+box[3])/2];
  let focus:string|undefined;
  // The outline as kept on the node, or as the map drew it: a stored workflow keeps the outline in the payload store.
  const g=area.geometry??drawn;
  if(g&&units.length>1&&g.type==='MultiPolygon'){
    const at=g.coordinates.findIndex(part=>containsPoint(centre,{type:'Polygon',coordinates:part}));
    focus=at>=0?units[at]?.name:undefined;
  }else if(g&&b?.unitName&&containsPoint(centre,g))focus=b.unitName;
  return {...(whole?{whole}:{}),...(focus?{focus}:{})};
}
/** Write notes back to the project they belong to. A note is about the investigation, so it does
 *  not travel on the workflow -- which also means `change()` is the wrong door for it. */
function writeNotes(notes:Note[]):boolean{
  const project=projectNow();
  if(!project)return false;
  const stored=readProjects();
  const at=stored.findIndex(p=>p.id===project.id);
  if(at<0)return false;
  stored[at]={...stored[at],notes};
  return writeProjects(stored);
}
/** THE WRITE-UP OF THE OPEN PROJECT: every workflow of it that has run.
 *
 *  The practitioner, 2026-10-30: *"It's supposed to hold notes from all workflows in that
 *  project."* The open workflow's live result takes precedence over its own stored entry, so a
 *  run just finished is read from memory rather than from what was written a moment ago. */
function writeUpNow():WriteUpEntry[]{
  const project=projectNow();
  const keys=project?.workflows?.length?project.workflows:[storageKey(workflow)];
  const stored=writeUpOf(readWriteUpStore(),keys);
  const open=storageKey(workflow);
  const live=result?entryForRun(open,workflow.name||open,result,
    id=>workflow.nodes.find(node=>node.id===id)?.params.label,new Date().toISOString(),
    runningBuild):null;
  const entries=live?[...stored.filter(e=>e.workflowKey!==open),live]:stored;
  // IN THE PROJECT'S OWN WORKFLOW ORDER, which `writeUpOf` already applies to the stored ones;
  // the live entry has to be put back in its place rather than appended, or a re-run would move
  // its workflow to the end of the write-up.
  return keys.flatMap(key=>entries.filter(e=>e.workflowKey===key));
}
function renderNotesView(){
  const project=projectNow();
  const entries=writeUpNow();
  const of=new Map<string,WriteUpEntry>();
  const machined:MachinedNote[]=[],derived:Note[]=[];
  for(const entry of entries){
    for(const note of entry.machined){
      const tagged={...note,workflowKey:entry.workflowKey};
      machined.push(tagged);of.set(noteKey(tagged),entry);
    }
    for(const note of entry.derived){
      const tagged={...note,workflowKey:entry.workflowKey};
      derived.push(tagged as Note);of.set(noteKey(tagged as Note),entry);
    }
  }
  // A NODE LABEL IS RESOLVED IN THE WORKFLOW THAT PRODUCED THE NOTE, not in the open one. A node
  // id repeats across a project -- South London has `table-viii` in three workflows -- so reading
  // the open canvas would have labelled another workflow's step with whatever shares its id here.
  const labelOf=(note:Note)=>{
    const id='nodeId' in note?note.nodeId:undefined;
    if(!id)return undefined;
    const entry=of.get(noteKey(note));
    if(entry&&entry.workflowKey!==storageKey(workflow))return entry.labels[id];
    return workflow.nodes.find(node=>node.id===id)?.params.label??entry?.labels[id];
  };
  const sourceOf=(note:Note)=>{
    const entry=of.get(noteKey(note));
    return entry?sourceOfNote(entry,storageKey(workflow)):undefined;
  };
  // WHICH WORKFLOWS CANNOT BE DRAWN, by name. Asked of MEMORY rather than of the store, which is
  // the correction of 2026-10-30: the words are kept and the figures are not, so a write-up
  // reopened tomorrow has every note, no figure, and -- under the old question -- nothing
  // pending and no way to fix it. A workflow that has never run is still not a defect and still
  // not a gap in the write-up; it is a step that has not been computed, and this is the one
  // surface where a practitioner would otherwise mistake the two.
  const heldFor=(key:string|undefined)=>{
    if(!key)return undefined;
    if(key===storageKey(workflow)&&result)return {run:result,workflow:runWorkflow||workflow};
    return runsByWorkflow.get(key);
  };
  const runOf=(key:string|undefined):WorkflowRun|undefined=>heldFor(key)?.run;
  // A WORKFLOW THAT WAITS FOR THE PRACTITIONER is said apart, with what it waits for: it has not failed to run.
  // Only what loading cannot supply: a fetched table is filled from this device when its workflow loads (gate 148, NYC's
  // four tables read as waiting), so here it is a learner's choice, an offered map image nobody has chosen.
  const waitingFor=(key:string):string|null=>{
    const saved=readSavedWorkflows()[key];
    try{const w=saved?validateWorkflow(structuredClone(saved)):null;
      return w&&w.nodes.some(n=>n.type==='map_image_input'&&n.params.offered&&!n.params.image?.width)?waitsFor(w):null;}catch{return null;}
  };
  const nameOfKey=(key:string)=>{const saved=readSavedWorkflows()[key] as {name?:unknown}|undefined;
    return typeof saved?.name==='string'&&saved.name.trim()?saved.name.trim():WORKFLOW_LABELS[key]??key;};
  const waitingKeys=(project?.workflows||[]).filter(key=>!runOf(key)&&waitingFor(key));
  const waiting=waitingKeys.map(key=>({name:nameOfKey(key),why:waitingFor(key)!}));
  const pendingKeys=(project?.workflows||[]).filter(key=>!runOf(key)&&!waitingKeys.includes(key));
  const pending=pendingKeys
    .map(key=>{
      const saved=readSavedWorkflows()[key] as {name?:unknown}|undefined;
      return typeof saved?.name==='string'&&saved.name.trim()
        ?saved.name.trim():WORKFLOW_LABELS[key]??key;
    });
  shownNotes=[...(project?.notes||[]),...derived,...machined] as Note[];
  shownComponents=shownNotes.filter(isComponent).map(note=>{
    const words=(note.kind==='authored'&&note.image?.caption)||(note.kind==='quoted'?note.quote:note.text);
    const plain=words.replace(/[*_`$]/g,'').replace(/\s+/g,' ').trim();
    const from=sourceOf(note);
    return {key:noteKey(note),label:`${plain.length>80?plain.slice(0,79)+'…':plain}${from?` (${from})`:''}`};});
  // THE ARTIFACT A DESCRIPTION NOTE SPEAKS FOR, drawn from the run that produced it. The note
  // carries its workflow, so a table from another workflow is drawn from THAT workflow's run
  // rather than from whatever shares its node id on the open canvas -- the same trap `labelOf`
  // exists for, one level further in.
  // THE MAP A STEP PUBLISHED, composed from the run and its workflow with the same two pure
  // functions the live map uses -- `oldMap` for the drawing, `mapPresentation` for the title, key
  // and source note -- rather than a second map drawn here.
  //
  // WITH ITS PLATE AND WITHOUT ITS TILES, which is one gap closed and one left open rather than
  // the single gap this comment claimed. `renderMap` composites ground into the live SVG
  // asynchronously and the SVG download copies the element after that, so a figure composed here
  // carried the extent and the marks and not Snow's plate underneath -- visible the moment the
  // figure and the screen were put side by side on 2026-10-30, and asserted nowhere.
  //
  // But the two kinds of ground are asynchronous for different reasons, and only one of them is.
  // A basemap tile has to be fetched, and a figure that renders and then changes under a reader
  // is worse in a write-up than one that renders once. A plate is a data URI the node already
  // holds and `mapImageMarkup` places it by its corners, so it composes here synchronously, in
  // the same frame the content was drawn in. See `withGroundUnder` and 143.
  // THE CHART AS ON SCREEN (2026-11-12): drawn once per run and step, by the same function as its SVG download, and the
  // notes drawn again when it is ready. Classic bars stay the HTML bars, which is what the screen shows for them.
  const chartSvgOf=(held:{run:WorkflowRun; workflow:Workflow})=>(nodeId:string):string|null=>{
    const output=held.run.outputs?.find(o=>o.nodeId===nodeId);
    const node=held.workflow.nodes.find((n):n is WorkflowNode<'chart_output'>=>n.id===nodeId&&n.type==='chart_output');
    // WHO INFECTED WHOM, as Results draws it (2026-11-15: MERS's tree reached Notes as its sentence and no figure).
    const tree=(output as {kind?:string;tree?:import('./transmission-tree.js').TransmissionTree}|undefined);
    if(tree?.kind==='transmission-tree'&&tree.tree&&node)return treeSvg(tree.tree,esc,fillWords(node.params.chartTitle,figureWords())||'');
    if(!output?.chart?.bins?.length||!node)return null;
    if(chartRenderer(node.params)!=='vega-lite'&&!output.chart.interval&&!output.chart.panels?.length)return null;
    const key=`${held.run.runId}:${nodeId}`,drawn=notesChartSvg.get(key);
    if(drawn!==undefined)return drawn||null;
    notesChartSvg.set(key,'<p class="muted">Drawing the chart\u2026</p>');
    standaloneChartSvg(output.chart,node.params,(()=>{
      // THE STEP'S NAME, not its id, as the Results tab says it (2026-11-14: the write-up read "Source: group_table-17946…").
      const from=held.workflow.edges.find(e=>e.to===nodeId)?.from;
      return {sourceId:from,runId:held.run.runId,sourceLabel:held.workflow.nodes.find(n=>n.id===from)?.params.label};})())
      .then(svg=>{notesChartSvg.set(key,svg);refreshNotesIfOpen();},
        error=>{notesChartSvg.set(key,'');console.error(error);refreshNotesIfOpen();});
    return notesChartSvg.get(key)!;
  };
  const mapSvgOf=(held:{run:WorkflowRun; workflow:Workflow}|undefined)=>(nodeId:string)=>{
    if(!held)return null;
    const output=held.run.outputs?.find(o=>o.nodeId===nodeId);
    const node=held.workflow.nodes.find(
      (n):n is WorkflowNode<'map_output'>=>n.id===nodeId&&n.type==='map_output');
    if(!output||!node)return null;
    // THE FIGURE THE RESULTS TAB DRAWS (2026-11-14): drawn by the same renderer into an element off the page, its ground
    // fetched, then kept, as a chart's is; the write-up shows "Drawing the map" until then and redraws when it is ready.
    // Its layers as the workflow keeps them, never as the page's checkboxes happen to be.
    const key=`${held.run.runId}:${nodeId}`,drawn=notesMapSvg.get(key);
    if(drawn!==undefined)return drawn||null;
    notesMapSvg.set(key,'<p class="muted">Drawing the map\u2026</p>');
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg') as SVGSVGElement;
    svg.setAttribute('viewBox','0 0 850 295');
    const kept=new Set<string>(mapLayerList(node,held.workflow.edges,id=>held.workflow.nodes.find(n=>n.id===id)?.params.label,
      [],layerOrigins(output.pointLayers))
      .filter(l=>!l.drawn).map(l=>l.sourceNodeId??l.id));
    drawStaticFigure(svg,output,node,{hidden:kept,offPage:{workflow:held.workflow}}).then(ok=>{
      if(!ok){notesMapSvg.set(key,'');refreshNotesIfOpen();return;}
      const banded=!!output.polygons?.features.some(f=>f.minutes!==undefined);
      const plotted=banded?catchmentFrame(output.polygons!,output.contextPoints):null;
      notesMapSvg.set(key,standaloneMapSvg(svg.innerHTML,svg.getAttribute('viewBox')||frameBoxOf(svg.innerHTML),
        mapPresentation(node,output,held.workflow),
        plotted?{metresPerPixel:metresPerPixel(plotted.pixelsPerDegreeLatitude)}:undefined));
      refreshNotesIfOpen();
    },error=>{notesMapSvg.set(key,'');console.error(error);refreshNotesIfOpen();});
    return notesMapSvg.get(key)!;
  };
  // WHICH NOTES CARRY A FIGURE, and the two kinds carry one for different reasons.
  //
  // A MACHINED DESCRIPTION speaks for an artifact a step PUBLISHED -- a table, a chart, a map --
  // and the figure is that artifact. A machined equation is excluded: its artifact is already in
  // its own text as typeset mathematics, and `describedNode` is what tells the two apart.
  //
  // A DERIVED SOURCE NOTE names the data an input brought in, and the practitioner, 2026-10-30,
  // looking at three of them in Methods: *"The tables here should also be reproduced."* Which is
  // the same argument one level upstream -- a note reading "Snow 1855, Table IX -- houses and
  // cholera deaths by water company" states what the table is and shows none of it, and a reader
  // checking a published analysis against its source needs the source. `run.tables` already holds
  // every table a run passed between steps, inputs included, so the table is there to draw.
  // A TABLE'S PRESENTATION, from the Table step that shows it (2026-11-28): the node itself where it is a Table, or the
  // Table its output feeds, so a table described by its producer prints as the Table that presents it.
  const presentationIn=(w:Workflow)=>(nodeId:string)=>{
    const own=w.nodes.find(n=>n.id===nodeId);
    if(own?.type==='table_output')return (own as WorkflowNode<'table_output'>).params.presentation;
    const shown=w.edges.filter(e=>e.from===nodeId).map(e=>w.nodes.find(n=>n.id===e.to)).find(n=>n?.type==='table_output');
    return (shown as WorkflowNode<'table_output'>|undefined)?.params.presentation;};
  const figureOf=(note:Note)=>{
    // A PICTURE SOMEBODY PUT IN THEIR NOTE (experiment 196), shown from the bytes kept by its digest.
    if(note.kind==='authored'&&note.image)
      return noteImageFigure(note.image,readNoteImagePayload(cachedPayload(noteImageKey(note.image.sha256))),esc);
    const id='nodeId' in note&&note.nodeId?note.nodeId:undefined;
    if(!id)return undefined;
    if(note.kind==='machined'&&!describedNode(note.id))return undefined;
    if(note.kind!=='machined'&&note.kind!=='derived')return undefined;
    const key='workflowKey' in note&&note.workflowKey?note.workflowKey:storageKey(workflow);
    const held=heldFor(key);
    return figureFor(id,held?{...held.run,mapSvg:mapSvgOf(held),chartSvg:chartSvgOf(held),presentationOf:presentationIn(held.workflow)}:undefined,esc)||undefined;
  };
  // THE ROWS BEHIND A TABLE'S NOTE, for a draft that attaches what it cannot print (experiment 202, 2026-11-19). A workflow
  // whose table was fetched from elsewhere names where, and its rows are never handed on: the project does not carry them.
  const tableOf=(note:Note):AttachableTable|undefined=>{
    const id='nodeId' in note&&note.nodeId?note.nodeId:undefined;
    if(!id||note.kind!=='machined'||!describedNode(note.id))return undefined;
    const held=heldFor('workflowKey' in note&&note.workflowKey?note.workflowKey:storageKey(workflow));
    const table=held?.run.tables?.[id];
    if(table?.kind!=='data-table'||(table as {twoByTwo?:unknown}).twoByTwo)return undefined;
    const remote=held!.workflow.nodes.map(n=>n.type==='table_input'?(n as WorkflowNode<'table_input'>).params.remote?.url:undefined).find(Boolean);
    let host:string|undefined;try{host=remote?new URL(remote).hostname:undefined;}catch{host=remote;}
    return {rows:tableRowCount(table),source:held!.workflow.nodes.find(n=>n.id===id)?.type==='table_input',
      csv:()=>tableCsv(table,presentationIn(held!.workflow)(id)),...host?{fetchedFrom:host}:{}};
  };
  // THE WORKS THIS PROJECT CITES, assembled from the entries rather than stored beside them.
  const references=referenceList(entries.map(e=>
    ({workflowName:e.workflowName,machined:e.machined,derived:e.derived})),(project?.notes||[]) as Note[]);
  $('#notes-view').innerHTML=notesPanel(project?.notes||[],machined,
    labelOf,esc,derived,sourceOf,
    // AND HOW MANY THERE ARE AT ALL, so the control can tell a project whose workflows have all
    // run from a workflow that is in no project. 0 is the second of those, not the first.
    {pending,waiting,total:(project?.workflows||[]).length,readOnly:keptHere(project)},
    figureOf,references,exampleLinksBlock(onlineLinks(project),esc),
    // THE DRAFTS OFFERED ARE THE TARGETS CHOSEN, as stored now.
    ((project&&readProjects().find(p=>p.id===project.id)?.targets)??project?.targets??[])
      .map(id=>({kind:id,label:TARGETS.find(t=>t.id===id)?.label??id})));
  // THE OUTLINE OF WHAT THE PROJECT IS WRITING TOWARDS (experiment 202, Stage A), above the notes it is filled from.
  {const stored=project&&readProjects().find(p=>p.id===project.id);
   const targets=stored?.targets??project?.targets??[];
   if(targets.length)$('#notes-view').insertAdjacentHTML('afterbegin',outlineMarkup(projectOutline(targets,
     [...(project?.notes||[]),...derived,...machined],stored?.publication??project?.publication??{},
     references.filter(r=>!r.uncited).length,{isComponent,workflowName:nameOfKey}),esc,!keptHere(project)));
   // THE NOTES AUDIT, ON REQUEST AND PER TARGET (the practitioner, 2026-11-18).
   const auditOf=(target:string)=>auditTarget(target,[...(project?.notes||[]),...derived,...machined],
     stored?.publication??project?.publication??{},stored?.plan??project?.plan,
     {works:references.filter(r=>!r.uncited).length,uncited:references.filter(r=>r.uncited).length},{isComponent,workflowName:nameOfKey});
   const auditTargets=targets.map(id=>({id,label:TARGETS.find(t=>t.id===id)?.label??id}));
   const auditButton=document.querySelector<HTMLButtonElement>('#notes-view [data-notes-audit]');
   if(auditButton)auditButton.onclick=()=>openAuditDialog(auditTargets,targets[0]!,auditOf,esc);
   lastAudit={targets:auditTargets,of:auditOf};
   // THE PLAN, above the outline (experiment 202, 2026-11-18): never in a product, so drawn here and nowhere else.
   if(targets.length){
     const view=planView(targets,stored?.plan??project?.plan,[...(project?.notes||[]),...derived,...machined],
       stored?.publication??project?.publication??{},references.filter(r=>!r.uncited).length,{isComponent,workflowName:nameOfKey,
         // A COMPONENT'S KIND, by the widget that published it; a picture in a note is none of the three.
         componentKind:note=>{const type=note.kind==='machined'?note.widget?.type??workflow.nodes.find(n=>n.id===note.nodeId)?.type:undefined;
           return type==='map_output'?'map':type==='chart_output'?'chart':type==='table_output'?'table':undefined;}});
     const label=(id:string)=>TARGETS.find(t=>t.id===id)?.label??id;
     $('#notes-view').insertAdjacentHTML('afterbegin',planMarkup(view,esc,!keptHere(project),label));
     for(const b of document.querySelectorAll<HTMLButtonElement>('#notes-view [data-plan-role]'))b.onclick=()=>{
       const role=b.dataset.planRole!,part=view.parts.find(p=>p.role===role),kept=view.unplaced.find(p=>p.role===role);
       const wants=part?Object.entries(part.byTarget).map(([t,w])=>`${esc(label(t))}: <em>${esc(w.heading)}</em>, ${esc(w.length)}`).join('; ')
         :'Planned for a target no longer chosen.';
       openPlanDialog({role,label:part?.label??role,wants,text:part?.text??kept?.text??'',
         shells:planOfProject()?.parts.find(p=>p.role===role)?.shells??[]},esc,
         (text,shells)=>{const ok=writePlan(withPart(planOfProject(),role,text,shells));if(ok)renderNotesView();return ok;});};
     // START A NOTE FROM A PART: its words copied into a new note of the part's section and function, the link kept.
     for(const b of document.querySelectorAll<HTMLButtonElement>('#notes-view [data-plan-note]'))b.onclick=()=>{
       const part=view.parts.find(p=>p.role===b.dataset.planNote);const held=[...(projectNow()?.notes||[])] as Note[];
       if(!part?.part||!part.text.trim())return;
       const made:Note={kind:'authored',id:crypto.randomUUID(),section:part.part,text:part.text.trim(),
         ...(part.fn?{fn:part.fn}:{}),fromPlan:part.role};
       if(!writeNotes([...held,made])){toast('That note could not be kept on this device.',{tone:'failure'});return;}
       renderNotesView();writeInNoteDialog(made);};
     const mark=document.querySelector<HTMLButtonElement>('#notes-view [data-plan-mark]');
     if(mark)mark.onclick=async()=>{const plan=planOfProject();if(!plan?.parts.length)return;
       const marked=await markedComplete(plan,new Date().toISOString(),
         (part,at)=>noteVersion({kind:'authored',id:`plan:${part.role}`,section:'Introduction',text:part.text},at,signingIdentity()));
       if(!writePlan(marked)){toast('The plan could not be kept on this device.',{tone:'failure'});return;}
       renderNotesView();};
     const unmark=document.querySelector<HTMLButtonElement>('#notes-view [data-plan-unmark]');
     if(unmark)unmark.onclick=()=>{const plan=planOfProject();if(plan&&writePlan(unmarked(plan)))renderNotesView();};
   }}
  // EVERY "Write" that opens the draft, the outline's among them.
  for(const opener of document.querySelectorAll<HTMLElement>('#notes-view [data-publication]'))opener.addEventListener('click',()=>openPublication({
    // A TARGET'S DRAFT OPENS AS THAT TARGET; a plain Draft as the kind last chosen.
    ...(isProductKind(opener.dataset.publicationOpen)?{kind:opener.dataset.publicationOpen as ProductKind}:{}),
    targets:(project&&readProjects().find(p=>p.id===project.id)?.targets)??project?.targets??[],
    title:project?.name||workflow.name,
    authors:(project?.authors||[]).map(a=>a.name||a.login),
    date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),
    notes:[...(project?.notes||[]),...derived,...machined],sourceOf,figureOf,references,tableOf,
    // READ AS STORED NOW, not as when Notes was drawn: a kind or a layout set since then is kept, and must be what opens.
    written:(project&&readProjects().find(p=>p.id===project.id)?.publication)||project?.publication,writable:!!project&&!keptHere(project)},
    // KEPT WITH THE PROJECT, as its notes are; a shipped example has nowhere to keep it, and is offered no Write.
    (key,text)=>{if(!project)return null;const stored=readProjects(),at=stored.findIndex(p=>p.id===project.id);
      if(at<0)return null;const publication={...(stored[at]!.publication||{})};
      if(text.trim())publication[key]=text;else delete publication[key];
      stored[at]={...stored[at]!,publication};return writeProjects(stored)?publication:null;}));
  // THE FORMULAE, ONCE THE PANEL IS IN THE DOCUMENT. `notesPanel` returns the LaTeX on the
  // element that will hold it, so a note reads correctly before the converter has loaded and on
  // any machine where it never does. See `src/prose.ts`.
  void typeset($('#notes-view'));
  // RUN THE REST, AND COME BACK. Each run needs its workflow open, so the canvas moves once per
  // workflow and is returned to where the practitioner left it. `loadExample` hands back the run
  // it starts, so these are sequential rather than six runs racing each other -- which is the
  // shape experiment 142's defect took when a run outlived the canvas that started it.
  optionalElement('[data-run-pending]')?.addEventListener('click',async()=>{
    // WITH NOTHING PENDING THE BUTTON RE-RUNS THE PROJECT, which is what "Run them again" says
    // it does. The control is on the tab whether or not the application has something to suggest.
    const was=storageKey(workflow);
    const todo=pendingKeys.length?[...pendingKeys]:(project?.workflows||[]).filter(key=>!waitingKeys.includes(key));
    if(!todo.length)return;
    const button=optionalElement('[data-run-pending]') as HTMLButtonElement|null;
    if(button){button.disabled=true;button.textContent='Running\u2026';}
    let ran=0,failed=0;const stillWaiting:string[]=[],unfinished:string[]=[];
    for(const key of todo){
      try{
        await loadExample(key);
        // LOADED IS NOT RAN. A workflow whose fetched table is not on this device loads and does not run; counting it
        // as run told the practitioner the write-up held the whole project when it held half (2026-11-04).
        const why=waitsFor(workflow);
        // AND RAN IS NOT FINISHED (2026-11-18): a step that could not read its data leaves its part of the write-up
        // empty, and "the whole project" was said all the same, found with NYC's satellite files refused.
        const stuck=result?.unfinished?.[0];
        if(why)stillWaiting.push(`${workflow.name}: ${why}`);
        else if(stuck)unfinished.push(`${workflow.name}: ${stuck.message}`);
        else ran++;
      }
      catch{failed++;/* The one that failed says so on its own canvas; the rest still run. */}
    }
    // Back to the workflow they were reading, and back to the write-up.
    if(was&&was!==storageKey(workflow))await loadExample(was);
    switchView('notes');renderNotesView();
    toast(stillWaiting.length||unfinished.length
      ?`${ran} of ${todo.length} ran in full.`
        +(unfinished.length?` A step could not finish in ${unfinished.join('; ')}.`:'')
        +(stillWaiting.length?` Waiting for you: ${stillWaiting.join('; ')}.`:'')
      :failed
      ?`${ran} of ${todo.length} ran; ${failed} could not. The write-up holds what ran.`
      :`${ran} workflow${ran===1?'':'s'} ran. The write-up now holds the whole project.`,
      {tone:failed||stillWaiting.length||unfinished.length?'warning':'notice'});
  });
  const total=(project?.notes||[]).length+derived.length+machined.length;
  $('#notes-view-count').textContent=total?String(total):'';
}
/** THE PUBLICATION, over the page, to read and to print (experiment 202). Back returns to Notes as it was; printing
 *  prints the publication alone, which the browser saves as PDF. Its maps and charts are the Notes tab's own. */
function openPublication(input:PublicationInput,keep:(key:string,text:string)=>Record<string,string>|null){
  let view=optionalElement('#publication-view');
  if(!view){view=document.createElement('div');view.id='publication-view';view.setAttribute('role','dialog');
    view.setAttribute('aria-modal','true');view.setAttribute('aria-label','Publication');document.body.append(view);}
  // DRAFT AS (experiment 202, 2026-11-15): which kind of document the record is laid out as, kept with the project where
  // it can be, so a shipped example opens as the kind it was made to show.
  let kind:ProductKind=input.kind??(isProductKind(input.written?.kind)?input.written!.kind as ProductKind
    :isProductKind(input.targets?.[0])?input.targets![0] as ProductKind:'publication');
  // DRAFT AS: the project's targets first, then the other formats, kept apart.
  const chosen=PRODUCT_KINDS.filter(k=>input.targets?.includes(k.kind)),others=PRODUCT_KINDS.filter(k=>!input.targets?.includes(k.kind));
  const option=(k:typeof PRODUCT_KINDS[number])=>`<option value="${k.kind}"${k.kind===kind?' selected':''}>${esc(k.label)}</option>`;
  const draw=()=>{const top=view!.scrollTop;parts=publicationParts({...input,kind},esc);
    view!.innerHTML=`<div class="publication-bar"><button class="button" data-publication-back>Back to Notes</button>`
      +`<label class="pub-kind">Draft as <select data-publication-kind>`
        +(chosen.length?`<optgroup label="Writing towards">${chosen.map(option).join('')}</optgroup><optgroup label="Other formats">${others.map(option).join('')}</optgroup>`
          :PRODUCT_KINDS.map(option).join(''))+`</select></label>`
      +(lastAudit?`<button class="button" data-publication-audit>Notes audit</button>`:'')
      +(parts.attachments.length||parts.annex?`<button class="button" data-publication-files>Download the attached files</button>`:'')
      +`<button class="button primary" data-publication-print>Print or save as PDF</button></div>`
      +parts.html;
    view!.scrollTop=top;void typeset(view!);};
  let parts=publicationParts({...input,kind},esc);
  // A FIGURE'S WIDTH AND PLACE, and the kind, set where they are shown.
  view.onchange=event=>{
    const target=event.target as HTMLElement;
    if(target.matches('[data-publication-kind]')){
      kind=(target as HTMLSelectElement).value as ProductKind;
      if(input.writable){const kept=keep('kind',kind);if(kept)input={...input,written:kept};}
      draw();return;
    }
    const tools=target.closest<HTMLElement>('[data-pub-layout]');
    if(tools){
      const width=tools.querySelector<HTMLSelectElement>('[data-pub-width]')!.value,place=tools.querySelector<HTMLSelectElement>('[data-pub-place]')!.value;
      const kept=keep(layoutKey(kind,tools.dataset.pubLayout!),width==='full'&&place==='line'?'':`${width}|${place}`);
      if(!kept){toast('That could not be kept on this device.',{tone:'failure'});return;}
      input={...input,written:kept};draw();
    }
  };
  draw();
  view.hidden=false;document.body.classList.add('showing-publication');
  // WRITING A PART IN PLACE: what it is for and its length above the box, the words counted as they are typed.
  view.onclick=event=>{
    const target=event.target as HTMLElement;
    const key=target.closest<HTMLElement>('[data-pub-write]')?.dataset.pubWrite;
    if(key){
      const part=view!.querySelector<HTMLElement>(`[data-pub-part="${key}"]`);if(!part)return;
      const [label,length,ask]=promptFor(key,kind)??[key,'',''];
      const current=input.written?.[key]??'';
      const editor=document.createElement('div');editor.className='pub-editor';
      editor.innerHTML=`<label class="pub-prompt-label" for="pub-text">${esc(label)} <span>\u00b7 ${esc(length)}</span></label>`
        +`<p>${esc(ask)}</p><textarea spellcheck="true" id="pub-text" rows="${key.endsWith('title')?2:6}">${esc(key.endsWith('title')&&!current?input.title:current)}</textarea>`
        +`<p class="pub-count" aria-live="polite"></p><div class="pub-editor-actions">`
        +`<button class="button primary" data-pub-save>Save</button><button class="button" data-pub-cancel>Cancel</button></div>`;
      part.replaceWith(editor);view!.querySelector(`[data-pub-write="${key}"]`)?.remove();
      const box=editor.querySelector('textarea')!,count=editor.querySelector<HTMLElement>('.pub-count')!;
      const counted=()=>{const n=box.value.split(/\s+/).filter(Boolean).length;count.textContent=`${n} word${n===1?'':'s'}`;};
      box.addEventListener('input',counted);counted();box.focus();
      editor.querySelector('[data-pub-cancel]')!.addEventListener('click',draw);
      editor.querySelector('[data-pub-save]')!.addEventListener('click',()=>{
        const kept=keep(key,box.value);
        if(!kept){toast('That could not be kept on this device. Your words are still in the box.',{tone:'failure'});return;}
        input={...input,written:kept};draw();
        view!.querySelector<HTMLElement>(`[data-pub-write="${key}"]`)?.focus();});
      return;
    }
    if(target.closest('[data-publication-back]'))close();
    else if(target.closest('[data-publication-print]'))window.print();
    else if(target.closest('[data-publication-files]'))void downloadAttached(parts,input.title,kind);
    else if(target.closest('[data-publication-audit]')&&lastAudit)
      openAuditDialog(lastAudit.targets.some(t=>t.id===kind)?lastAudit.targets:[...lastAudit.targets,{id:kind,label:PRODUCT_KINDS.find(k=>k.kind===kind)?.label??kind}],kind,lastAudit.of,esc);
  };
  // BACK TO NOTES REDRAWS THEM: the outline counts what the draft holds, and a title or abstract written there was
  // still "empty" in it until something else redrew Notes (the practitioner, 2026-11-16).
  const close=()=>{view!.hidden=true;document.body.classList.remove('showing-publication');
    renderNotesView();
    (optionalElement('[data-publication]') as HTMLButtonElement|null)?.focus();};
  view.onkeydown=event=>{if(event.key!=='Escape')return;if((event.target as HTMLElement).closest('.pub-editor'))draw();else close();};
  view.querySelector<HTMLButtonElement>('[data-publication-back]')!.focus();
  void typeset(view);
}
/** THE DRAFT'S ATTACHED FILES IN ONE ZIP (experiment 202, 2026-11-19): the annex, its equations typeset as the draft shows
 *  them, and each attached table as CSV. A table whose rows were fetched from elsewhere is named in the annex and not
 *  written. The printed PDF is the print dialog's and cannot be put in here. */
async function downloadAttached(parts:import('./publication.js').PublicationParts,title:string,kind:ProductKind){
  const files:Record<string,Uint8Array>={};
  const listed=parts.attachments.map((a,at)=>`<li><strong>Table S${at+1}.</strong> ${esc(a.label)}, ${a.rows.toLocaleString('en-US')} rows: `
    +(a.fetchedFrom?`not attached; fetched from ${esc(a.fetchedFrom)}`:esc(a.file))+`.</li>`).join('');
  let body=parts.annex;
  if(!body)body=`<article class="publication-page pub-annex" lang="en"><p class="pub-kicker">Attached files</p><h1>${esc(title)}</h1>`
    +`<ul class="pub-sources">${listed}</ul></article>`;
  const holder=document.createElement('div');holder.hidden=true;holder.innerHTML=body;document.body.append(holder);
  try{await typeset(holder);}catch{/* the TeX stays as written */}
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    +`<title>${esc(title)}: annex</title><style>body{font:16px/1.5 Georgia,serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#1a1a1a;background:#fff}`
    +`.pub-kicker{text-transform:uppercase;letter-spacing:.06em;font:600 14px system-ui,sans-serif}.pub-equation{margin:1rem 0}`
    +`.prose-display{overflow-x:auto}</style></head><body>${holder.innerHTML}</body></html>`;
  holder.remove();
  files['annex.html']=strToU8(html);
  for(const a of parts.attachments)if(a.csv&&!a.fetchedFrom)files[a.file]=strToU8(a.csv());
  const zip=zipSync(files,{level:6});
  const url=URL.createObjectURL(new Blob([zip as BlobPart],{type:'application/zip'}));
  const link=document.createElement('a');link.href=url;
  link.download=`${title.replace(/[^\w.-]+/g,'-').replace(/^-|-$/g,'')||'draft'}-${kind}-attached.zip`;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  const written=Object.keys(files).length-1;
  toast(`Attached files downloaded: the annex${written?` and ${written} table${written===1?'':'s'} as CSV`:''}.`);
}
/** OPEN A NOTE, AND LET THE TWO EDITABLE KINDS BE WRITTEN.
 *
 *  Keeping an edit means two different things, and the difference is the whole of the
 *  practitioner's rule of 2026-10-29. An authored note is rewritten where it sits. A machined
 *  note is NOT: the widget goes on machining its own account every run, so the edit becomes a
 *  separate authored note carrying both warrants, and nothing is overwritten or silently claimed.
 *
 *  `notes-ui` says which of the two is about to happen before the button is pressed; this does
 *  it. The split lives here because only this module knows where a project's notes are kept. */
/** A VERSION OF A NOTE OF YOUR OWN, ON EVERY SAVE THAT CHANGED IT (experiment 218, the spike): what it says, when, and,
 *  where an identity is open, who, signed. Kept on the note, so it travels with the project. */
async function versionNote(id:string){
  const find=()=>{const notes=[...(projectNow()?.notes||[])] as Note[];
    return {notes,at:notes.findIndex(n=>n.kind==='authored'&&n.id===id)};};
  const before=find();if(before.at<0)return;
  const version=await noteVersion(before.notes[before.at]!,new Date().toISOString(),signingIdentity());
  // READ AGAIN AFTER THE WAIT: another save may have landed while the signature was made.
  const {notes,at}=find();if(at<0)return;
  const note=notes[at] as Note&{versions?:import('./identity-file.js').NoteVersion[]};
  const last=note.versions?.at(-1);
  if(last&&last.digest===version.digest&&(last.signature||!version.signature))return;
  notes[at]={...note,versions:[...(note.versions||[]),version]} as Note;
  if(writeNotes(notes))refreshNotesIfOpen();
}
function writeInNoteDialog(note:Note){
  // AND THE DIALOG IS READ-ONLY WHERE A NOTE CANNOT BE KEPT. `openNoteDialog` decides whether to
  // offer writing by whether it was handed a `write`, so withholding it is how the dialog is told
  // -- rather than opening a textarea, a formatting toolbar and a Save over a callback that will
  // refuse. Until 2026-10-31 a machined note on an unfiled canvas opened fully writable (machined
  // is an editable kind, because an edit forks it into an authored note) and the refusal came
  // back as "That note could not be kept on this device", which blames the device for a missing
  // project. Found by the survey of 2026-10-31; it is the same false affordance as the "+ note"
  // buttons, one dialog further in.
  const keeps=!keptHere(projectNow());
  openNoteDialog(note,{
    imageOf:sha=>readNoteImagePayload(cachedPayload(noteImageKey(sha))),
    keepImage:(sha,payload)=>keepDataset(noteImageKey(sha),payload),
    targetsFor:(section,fn)=>{const p=projectNow();const t=(p&&readProjects().find(x=>x.id===p.id)?.targets)??p?.targets??[];
      return slotsForNote(t,section,fn);},
    objectives:()=>objectivesOf((projectNow()?.notes||[]) as Note[]),
    components:()=>shownComponents,
    labelOf:id=>workflow.nodes.find(n=>n.id===id)?.params.label,
    machined:Object.values(result?.machined||{}).flat(),
    write:keeps?(which,draft)=>{
      const project=projectNow();
      if(!project)return false;
      const held=[...(project.notes||[])] as Note[];
      const {text,section,fn}=draft;
      if(which.kind==='authored'){
        const at=held.findIndex(n=>n.kind==='authored'&&n.id===which.id);
        if(at<0)return false;
        // THE FUNCTION IS DROPPED WHEN IT IS CLEARED, not stored empty: `readNotes` keeps `fn`
        // only when it has a value, so an empty string here would be written and then read back
        // as absent -- two states that look the same and are not.
        const {fn:_was,works:_cited,form:_form,words:_words,argument:_argument,image:pictured,items:listed,answers:answered,components:resting,...rest}=held[at] as Note&{fn?:string;works?:unknown;form?:string;words?:string;argument?:string;image?:NoteImage;items?:import('./notes.js').NoteItem[];answers?:string;components?:string[]};
        // WHAT IT ANSWERS AND RESTS ON (Stage B): as drafted, or as they were where the draft does not say.
        const answers=draft.answers??answered??'',components=draft.components??resting??[];
        // ITEMS ONLY ON AN OBJECTIVES NOTE: kept as drafted, or as they were where the draft does not say.
        const items=fn==='objective'?(draft.items??listed??[]):[];
        // THE PICTURE: unchanged where the draft does not mention it, removed where it says null.
        const image=draft.image===undefined?pictured:draft.image??undefined;
        held[at]={...rest,text,section,...(fn?{fn}:{}),...(draft.works?.length?{works:draft.works}:{}),
          ...(draft.words?{words:draft.words}:{}),...(draft.argument?{argument:draft.argument}:{}),
          ...(image?{image}:{}),...(items.length?{items}:{}),...(answers?{answers}:{}),
          ...(components.length?{components}:{})} as Note;
        if(!writeNotes(held))return false;
        renderNotesView();
        void versionNote(which.id);
        toast('Your note was kept.');
        return true;
      }
      if(which.kind==='machined'){
        const fork=forkMachinedNote(which,crypto.randomUUID(),text,new Date().toISOString());
        // WHO CHANGED THE WORDS, when there is a GitHub login to say so. Absent means
        // unattributed and stays absent: see `src/identity.ts`. The computation's warrant is
        // already in `forkedFrom`, so the two are recorded separately rather than merged.
        const who=currentIdentity(localStorage);
        if(who)fork.author=who.login;
        if(!writeNotes([...held,fork]))return false;
        renderNotesView();
        void versionNote(fork.id);
        toast('Forked into a note of your own. The machined note is unchanged, and the next run '
          +'will rewrite it.');
        return true;
      }
      return false;
    }:undefined},esc);
}
/** THE OBJECTIVES WITH THIS WORKFLOW ANSWERING ONE OF THEM, or none: a workflow answers one objective at most. */
function answeredBy(notes:Note[],key:string,objective:string):Note[]{
  const holder=objectivesOf(notes).length?notes.find(n=>n.kind==='authored'&&n.fn==='objective'&&n.items?.length):undefined;
  return notes.map(n=>n!==holder||n.kind!=='authored'?n:{...n,items:n.items!.map(({question,...item})=>
    item.id===objective?{...item,question:key}:question&&question!==key?{...item,question}:item)});
}
function applyProjectDetails(){
  const key=storageKey(workflow);
  const project=workflow.projectId?readProjects().find(p=>p.id===workflow.projectId):projectOfWorkflow(key,readProjects());
  const name=($('#project-name-edit') as HTMLInputElement).value.trim();
  const subject=($('#project-subject-edit') as HTMLInputElement).value.trim();
  const workflowName=($('#workflow-name-edit') as HTMLInputElement).value.trim();
  if(workflowName&&workflowName!==workflow.name)change(w=>{w.name=workflowName;},{spatial:false});
  if(project){
    if(!name){toast('A project needs a name: what are you investigating?',{tone:'warning'});return;}
    const targets=chosenTargets('project-target-edit');
    const answers=($('#workflow-objective-field') as HTMLElement).hidden?undefined:($('#workflow-objective-edit') as HTMLSelectElement).value;
    const next=readProjects().map(p=>{if(p.id!==project.id)return p;const {targets:_was,...rest}=p;void _was;
      return {...rest,name,subject,...(targets.length?{targets}:{}),
        ...(answers===undefined?{}:{notes:answeredBy((p.notes||[]) as Note[],key,answers)})};});
    if(!writeProjects(next))return;
  }
  forgetSavedWorkflows();render();renderResults();
  toast(project?`Project "${name}" updated.`:'Workflow renamed.');
}
/** Deleting a project does NOT delete its workflows. They become unfiled and stay openable, which
 *  is the conservative reading of "delete": a practitioner removing a grouping has not asked to
 *  lose the work inside it. */
function deleteCurrentProject(){
  const key=storageKey(workflow);
  const open=workflow.projectId?readProjects().find(p=>p.id===workflow.projectId):projectOfWorkflow(key,readProjects());
  if(open)deleteProject(open.id);
}
/** DELETING A PROJECT DELETES WHAT IS IN IT.
 *
 *  The practitioner, 2026-10-23: *"I deleted a project but it's workflow did not get deleted. I
 *  expect to have all workflows under that project deleted as well."*
 *
 *  It did not, deliberately, and said so twice -- the confirmation promised the workflows would
 *  stay and the toast said where they were. The reasoning was that a project is a grouping and
 *  deleting a grouping should not destroy what somebody made. The practitioner's expectation is
 *  the other reading, and it is theirs to settle: a project is the investigation, its workflows
 *  are the questions asked inside it, and deleting the investigation without its questions leaves
 *  a practitioner tidying twice and finding the second half in a list called "In no project".
 *
 *  So it now deletes them, and the confirmation says exactly what will go: how many workflows,
 *  what they weigh, and -- because this application can finally answer it -- whether a copy exists
 *  anywhere else. Deleting an unbacked-up project is destroying the only copy, and that sentence
 *  belongs in front of the decision rather than in a toast after it.
 *
 *  A worked example's workflow is never destroyed: it ships with the application, and Reset
 *  example is how its edits are discarded. */
function deleteProject(id:string){
  const project=readProjects().find(p=>p.id===id);
  if(!project)return;
  const raw=(()=>{try{return JSON.parse(localStorage.getItem(WORKSPACES)||'{}') as Record<string,unknown>;}
    catch{return {} as Record<string,unknown>;}})();
  const keys=project.workflows.filter(k=>!isExampleKey(k));
  const kept=project.workflows.filter(isExampleKey);
  const bytes=keys.reduce((n,k)=>{try{return n+JSON.stringify(raw[k]??'').length;}catch{return n;}},0);
  const held=keys.length;
  const safe=projectSafety(project)==='backed up'&&!exportPredatesWork(project);
  const sizeText=bytes>=1e6?`${(bytes/1e6).toFixed(1)} MB`
    :`${Math.max(1,Math.round(bytes/1024)).toLocaleString('en')} KB`;
  if(!confirm(`Delete the project "${project.name}" and `
    +`${held===1?'its 1 workflow':`all ${held} of its workflows`}?\n\n`
    +(held?`Their widgets, settings and anything saved with them -- ${sizeText} -- are removed from `
      +'this device, and this cannot be undone.':'It holds no workflows of its own.')
    +(kept.length?`\n\n${kept.length===1?'1 worked example stays':`${kept.length} worked examples stay`}`
      +': they ship with the application.':'')
    +(held&&!safe?'\n\nThis project is NOT BACKED UP, so this is the only copy. "Back up" writes one '
      +'first.':'')))return;
  for(const key of keys){
    try{delete raw[key];}catch{/* already gone */}
  }
  try{localStorage.setItem(WORKSPACES,JSON.stringify(raw));forgetSavedWorkflows();}
  catch{/* the project record is removed below either way, so nothing is left half-deleted */}
  forgetOrigins(keys);
  if(!writeProjects(readProjects().filter(p=>p.id!==project.id)))return;
  const openWasInIt=project.workflows.includes(storageKey(workflow));
  if(openWasInIt){
    workflow=blankWorkflow();
    selected=null;result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};
    dirty=true;save();renderLibrary();renderResults();
  }else if(workflow.projectId===project.id)change(w=>{delete w.projectId;},{spatial:false});
  renderProjectOptions();render();
  toast(`Project "${project.name}" deleted`
    +(held?` with ${held===1?'its workflow':`all ${held} workflows`}.`:'.')
    +(kept.length?' Its worked examples stay.':''));
}
/** A key no project holds and nothing is saved under.
 *
 *  It was `workflows.length + 1`, which mints a key the project ALREADY HOLDS as soon as one
 *  workflow has been removed -- w1, w2, w3 with w2 gone mints w3 again, and the new canvas
 *  overwrites the old one on its first save. */
function mintWorkflowKey(projectId:string,projects:readonly Project[]):string{
  const taken=new Set<string>([...projects.flatMap(p=>p.workflows),...Object.keys(readSavedWorkflows())]);
  for(let n=1;;n++){const key=`${projectId}/w${n}`;if(!taken.has(key))return key;}
}
/** A project key with no workflow saved under it.
 *
 *  Registering the key and saving the workflow are two writes, and the second one can be refused
 *  -- by a full store, which is exactly the device that reported this. The switcher then shows a
 *  row for a workflow that does not exist, labelled with the raw key because there is no name to
 *  read, and selecting it does nothing: `loadExample` finds nothing saved, the key is not an
 *  example, so the canvas stays where it was. Reported 2026-10-21: *"I also see some
 *  test-project/w* workflows in the list."* */
function ghostWorkflowKeys(projects:readonly Project[]=readProjects()):string[]{
  const saved=readSavedWorkflows(),open=storageKey(workflow);
  return [...new Set(projects.flatMap(p=>p.workflows))].filter(key=>key!==open&&!Object.hasOwn(saved,key));
}
/** Drop those rows, loudly. Nothing is lost: a key with nothing saved under it holds no work, and
 *  leaving it makes a project claim more workflows than it has. */
function pruneGhostWorkflows():number{
  const projects=readProjects(),ghosts=new Set(ghostWorkflowKeys(projects));
  if(!ghosts.size)return 0;
  if(!writeProjects(projects.map(p=>({...p,workflows:p.workflows.filter(k=>!ghosts.has(k))}))))return 0;
  return ghosts.size;
}
/** Open a newly minted workflow, and keep the project's registration only if the save is kept.
 *
 *  The registration used to stand whatever the save did, which is how a key with no workflow
 *  under it gets into a project in the first place. */
function adoptNewWorkflow(next:Workflow,key:string,projectId:string,refusal:string):boolean{
  const previous={workflow,selected,result,runWorkflow,activeOutputId,history,future,statuses};
  workflow=next;selected=null;result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};dirty=true;
  if(save()){renderProjectOptions();renderLibrary();renderResults();render();switchView('workflow');return true;}
  ({workflow,selected,result,runWorkflow,activeOutputId,history,future,statuses}=previous);
  writeProjects(readProjects().map(p=>p.id===projectId?{...p,workflows:p.workflows.filter(k=>k!==key)}:p));
  renderProjectOptions();render();
  toast(saveFailureMessage(refusal),{tone:'failure'});
  return false;
}
/** A new canvas inside this investigation, which is the gesture the model implies and the one
 *  nothing offered: adding a second question meant creating an unrelated canvas and then
 *  assigning it. */
function addWorkflowToProject(projectId?:string){
  if(busy)return;
  const id=projectId??(workflow.projectId||projectOfWorkflow(storageKey(workflow),readProjects())?.id);
  const project=id?readProjects().find(p=>p.id===id):undefined;
  if(!project){
    toast(BUILT_IN_PROJECTS.some(p=>p.id===id)
      ?'Built-in projects ship with the application. Create a project of your own to add workflows to it.'
      :'This canvas belongs to no project yet. Create one, or choose one under Project details.',{tone:'warning'});
    return;
  }
  save();
  const key=mintWorkflowKey(project.id,readProjects());
  const index=project.workflows.length+1;
  if(!writeProjects(readProjects().map(p=>p.id===project.id?{...p,workflows:[...p.workflows,key]}:p)))return;
  if(!adoptNewWorkflow({...blankWorkflow(),name:`${project.name} · question ${index}`,projectId:project.id,workflowKey:key,exampleId:undefined},
    key,project.id,'The new workflow could not be saved, so it was not created.'))return;
  toast(`A new workflow in "${project.name}". Name it for the question it answers.`);
}

/** THE METHOD, WITHOUT THE MATERIAL. The practitioner, 2026-10-21, with North Kivu built and Ituri
 *  to build: *"can the workflow be imported as a template to be filled up?"* Not exported and
 *  re-imported, which carries the records, the geometry, the decisions and the storage key of the
 *  workflow it came from -- the shape of the investigation, ready to be filled with another
 *  place's data. */
function addWorkflowFromTemplate(sourceKey:string){
  if(busy)return;
  const projects=readProjects();
  const id=workflow.projectId||projectOfWorkflow(storageKey(workflow),projects)?.id;
  const project=id?projects.find(p=>p.id===id):undefined;
  if(!project){toast('A template becomes a workflow in a project. Create one first.',{tone:'warning'});return;}
  const saved=readSavedWorkflows()[sourceKey];
  if(!saved){toast('That workflow could not be read from this device.',{tone:'failure'});return;}
  const sourceName=(saved as {name?:string}).name||'that workflow';
  save();
  // INTO THIS ONE, when this one is empty. The ask was *"can I import the North Kivu workflow
  // into this blank one?"* -- said while sitting on a blank canvas named for the next province.
  // Always minting a workflow answered a question nobody asked: it left that canvas untouched and
  // empty beside a third workflow carrying the source's name, which is how a project ends up
  // holding rows its owner did not want and cannot remove. Reported 2026-10-21.
  const fillOpen=!workflow.nodes.length&&!!storageKey(workflow)&&!isExampleKey(storageKey(workflow));
  const key=fillOpen?storageKey(workflow):mintWorkflowKey(project.id,readProjects());
  const name=fillOpen?workflow.name||sourceName:`${sourceName} · template`;
  if(!fillOpen&&!writeProjects(readProjects().map(p=>p.id===project.id?{...p,workflows:[...p.workflows,key]}:p)))return;
  let report;
  // The RESULT is validated, not only the source. It was the source alone, so a template whose
  // clearing left a workflow the application refuses to open was saved all the same, and the row
  // it created could not be loaded -- or, because deleting needed loading, removed.
  try{
    report=templateFrom(validateWorkflow(structuredClone(saved)),{name,projectId:project.id,workflowKey:key});
    report={...report,workflow:validateWorkflow(report.workflow)};
  }
  catch(error){toast(`A template of "${sourceName}" could not be made: ${errorMessage(error)}`,{tone:'failure'});return;}
  if(fillOpen){
    const previous=structuredClone(workflow);
    workflow=report.workflow;
    selected=null;result=null;runWorkflow=null;activeOutputId=null;history=[previous];future=[];statuses={};dirty=true;
    if(!save()){workflow=previous;history=[];render();toast(saveFailureMessage('The template could not be saved, so this canvas is unchanged.'),{tone:'failure'});return;}
    renderProjectOptions();renderLibrary();renderResults();render();switchView('workflow');
  }
  else if(!adoptNewWorkflow(report.workflow,key,project.id,'The template could not be saved, so no workflow was created.'))return;
  const figureKeys=new Set(['subtitle','mapSubtitle']);
  const subtitles=report.cleared.reduce((n,c)=>n+c.keys.filter(k=>figureKeys.has(k)).length,0);
  const material=report.cleared.map(c=>({...c,keys:c.keys.filter(k=>!figureKeys.has(k))})).filter(c=>c.keys.length);
  const cleared=material.reduce((n,c)=>n+c.keys.length,0);
  // What it cleared, counted, because a template that silently emptied something is worse than
  // one that says so: the practitioner is about to fill exactly these.
  toast(`${fillOpen?`This canvas now holds the method of "${sourceName}"`:`A template of "${sourceName}"`}: the widgets and their `
    +`settings, with ${cleared} acquired ${cleared===1?'input':'inputs'} cleared across `
    +`${material.length} ${material.length===1?'widget':'widgets'}. `
    +(subtitles?`${subtitles} figure ${subtitles===1?'subtitle was':'subtitles were'} the original's findings and ${subtitles===1?'is':'are'} left for you to write. `:'')
    +`The study area is chosen again; the sources are already set.`,{tone:'notice'});
}
/** Remove this workflow from this device.
 *
 *  Reported 2026-10-21: *"Now I have a bunch of workflows I do not need. We do not have a way to
 *  delete workflows."* A project could be deleted and a workflow could not, so the only way to
 *  lose one was to delete the investigation around it -- which keeps every workflow and removes
 *  only the grouping, the opposite of what was wanted.
 *
 *  A worked example is not deletable: it ships with the application and Reset example is the
 *  control for it. Everything else goes with its saved entry and its project registration, and
 *  the next workflow of the same project is opened, or an empty canvas when there is none. */
function deleteCurrentWorkflow(){deleteWorkflow(storageKey(workflow));}
/** Deleting takes a KEY, not the open canvas, because the workflow most worth deleting is the one
 *  that will not open: *"The Health Facilities North Kivu · template workflow won't load so can't
 *  be deleted"*, 2026-10-21. A delete that works only on what is loaded cannot reach it. */
function deleteWorkflow(key:string){
  if(busy)return;
  // A SHAPE TEST STANDING IN FOR A MEMBERSHIP TEST, which is the third time this pair of controls
  // has disagreed about what "example" means. `isExampleKey` asks whether a key has no slash --
  // true of EVERY unfiled workflow -- where the question is whether this is one of the examples
  // that ship. `renderProjectOptions` already decides the row's button with EXAMPLE_KEYS.includes(key),
  // so the two disagreed: the Delete button rendered live and this refused the click.
  //
  // The practitioner, 2026-10-25, on an unfiled "Snow · South London, deaths per 1,000 people"
  // carrying three widgets: *"I still could not delete the South London example"*. Its key is
  // `snow-south-london-1854`, from a bundle published before that exampleId was removed, and
  // `exampleKey` passes through anything beginning `snow-`. Slash-less, so the shape test called
  // it shipped; absent from EXAMPLE_KEYS, so it never was.
  if(EXAMPLE_KEYS.includes(key)){
    toast('A worked example ships with the application and stays. Use "Reset example" to discard your edits to it.',{tone:'warning'});
    return;
  }
  const open=key===storageKey(workflow);
  const name=(open?workflow.name:(readSavedWorkflows()[key] as {name?:string}|undefined)?.name)||workflowTitle(key);
  if(!confirm(`Delete the workflow "${name}"? Its widgets, settings and anything saved with it are removed from this device, and this cannot be undone. Export it first if you want to keep it.`))return;
  const projects=readProjects(),owner=projects.find(p=>p.workflows.includes(key));
  if(owner&&!writeProjects(projects.map(p=>p.id===owner.id?{...p,workflows:p.workflows.filter(k=>k!==key)}:p)))return;
  try{
    const store=JSON.parse(localStorage.getItem(WORKSPACES)||'{}');
    delete store[key];
    localStorage.setItem(WORKSPACES,JSON.stringify(store));
    forgetSavedWorkflows();
  }catch{/* the registration is already gone, so the row is gone; a stale entry is unreachable */}
  // The key is minted per device and never reissued, so an origin left behind would refer to a
  // workflow that cannot come back.
  forgetOrigins([key]);
  // Deleting a row that is not the open canvas leaves the canvas alone: the practitioner is
  // tidying a list, not navigating.
  if(!open){renderProjectOptions();render();toast(`Workflow "${name}" deleted.`);return;}
  // Not loadExample for the fallback: that saves the canvas it is leaving, which would write this
  // workflow straight back under the key just deleted.
  const saved=readSavedWorkflows();
  const next=owner?.workflows.find(k=>k!==key&&Object.hasOwn(saved,k));
  if(next){workflow=blankWorkflow();loadExample(next);}
  else{
    workflow={...blankWorkflow(),...(owner?{name:`${owner.name} · first question`,projectId:owner.id,workflowKey:mintWorkflowKey(owner.id,readProjects())}:{})};
    if(owner)writeProjects(readProjects().map(p=>p.id===owner.id?{...p,workflows:[...p.workflows,storageKey(workflow)]}:p));
    selected=null;result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};dirty=true;
    save();renderProjectOptions();renderLibrary();renderResults();render();switchView('workflow');
  }
  toast(`Workflow "${name}" deleted.`);
}
/** HOW FULL THE STORE IS, before a save is refused rather than after.
 *
 *  The practitioner, 2026-10-21, having just been refused a study area: *"I think we need a storage
 *  status indicator to also tell us to off load projects from the browser (export) if needed."*
 *  Everything a workflow holds sits in `localStorage`, which this device accepts 5.2 MB of, and
 *  nothing said how much was left -- so the first news of the ceiling was work that would not
 *  save. See experiment 121 for why the ceiling is this one and what would move it. */
function storageUsedBytes():number{
  let total=0;
  try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key===null)continue;total+=key.length+(localStorage.getItem(key)?.length??0);}}
  catch{return 0;}
  return total;
}
const STORAGE_TIGHT=0.75,STORAGE_FULL=0.9;
/** THE OTHER STORE. The workspace store is the one that refuses a save, and it is not where the
 *  bytes are: a node's `data` is kept by digest in IndexedDB, which this device offers by the
 *  gigabyte, so a figure covering only `localStorage` can read "1.2 of 5.2 MB" beside 400 MB of
 *  street networks. Asked by the practitioner on 2026-10-21 -- *"That's for local storage, what
 *  about IndexedDB?"* -- of an indicator that had just been built measuring one store.
 *
 *  Two different quantities, reported as two:
 *  - what the PAYLOADS this session holds come to, which is this application's own data;
 *  - what the BROWSER says this site occupies and may occupy, from `navigator.storage.estimate()`.
 *    That figure is the whole origin -- IndexedDB, the Cache Storage holding the offline
 *    application, and `localStorage` -- so it is labelled as the site's total and never as the
 *    payload store alone. The estimate is also just that: browsers pad and round it. */
const payloadStoreBytes=():number=>{
  let total=0;
  for(const payload of Object.values(cachedPayloads()))total+=payloadBytes(payload);
  return total;
};
const payloadCount=():number=>Object.keys(cachedPayloads()).length;
/** FILING A WORKFLOW IS AN ACT, NOT A SIDE EFFECT OF A DROPDOWN.
 *
 *  The practitioner, 2026-10-23, having tried it: *"if I select the project-less workflow and
 *  select the project from the project drop down, it does nothing, only loads an empty workflow.
 *  That assign workflow to a project should be explicit."* And then: *"That assign to project
 *  inside the project dropdown is as good as it does not exist as it's not easily located."*
 *
 *  Both are right, and the second is the diagnosis. There were two selects that looked alike and
 *  did opposite things: the visible **Project** dropdown NAVIGATES -- it loads that project's
 *  first workflow and replaces the canvas -- and `#assign-project`, labelled "Belongs to" inside
 *  a collapsed `Project details` disclosure, is the one that files. A practitioner who wants to
 *  file their work presses the visible one and is moved off it. That is worse than a capability
 *  with no door, which is what the backup was this morning: it is two doors side by side where
 *  the visible one discards what you were doing.
 *
 *  So the act is named, and it is where 131 put creation and deletion -- the Project view -- with
 *  the workflow's name in it, so there is no doubt about what is being filed. `#assign-project`
 *  stays where it is: it still works, and removing a control a practitioner may have learned is a
 *  separate decision from adding the one they looked for. */
function renderUnfiled():void{
  const panel=$('#project-unfiled');
  const key=storageKey(workflow);
  const stored=readProjects();
  const filed=stored.some(p=>p.workflows.includes(key))
    ||BUILT_IN_PROJECTS.some(p=>p.workflows.includes(key));
  // A worked example is already filed under the project it ships in, so it is not offered. An
  // empty canvas still is: this tab is where filing lives, and a practitioner who opens it with
  // nothing selected needs the way forward, not a blank panel. The first version also hid it
  // when there were no projects AND no widgets, which is every fresh canvas -- the one case where
  // somebody is most likely to be looking for how to start.
  panel.hidden=filed;
  if(panel.hidden)return;
  $('#project-unfiled-name').textContent=workflow.name||WORKFLOW_LABELS[key]||key;
  const select=$('#project-file-under');
  select.innerHTML=stored.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
  select.disabled=!stored.length;
  $('#project-file').disabled=!stored.length;
  if(!stored.length)select.innerHTML='<option value="">No projects yet</option>';
}
// IMPORT LANDS HERE, because the Project tab is where a project is managed and importing one is
// the other half of exporting it. It reuses the same file control the header's Import uses: a
// project document and a workflow document arrive through one input, so a practitioner handed a
// file does not have to know which of two buttons made it.
$('#project-import').onclick=()=>{pendingShare=null;$('#workflow-file').click();};
$('#project-file').onclick=()=>{
  const id=$('#project-file-under').value;
  if(!id)return;
  assignCurrentWorkflow(id);
  renderProjectView();
};
$('#project-file-new').onclick=()=>{
  // The same dialog, arriving with the question already answered: this workflow is what the
  // project is being made for.
  openProjectDialog();
  $('#project-adopt-current').checked=true;
};

/** THE PROJECT VIEW: one project and the workflows filed under it.
 *
 *  Experiment 131, after a day the practitioner spent unable to find their own backup: *"Our UI
 *  has become confusing to navigate... how should the UI represent project and workflow
 *  lifecycles."* Asked what they work in, the answer was both, at different times -- setting up
 *  and reviewing is project work, analysis is workflow work -- so there are two places and this
 *  is the first one.
 *
 *  A ROUTE, NOT A DIALOG, which the experiment made a precondition: the project level lived
 *  behind a storage readout that had to be recognised as a button, and that is why the backup
 *  could not be found. A dialog here would inherit the problem it exists to end.
 *
 *  NO PROGRESS COLUMN. Draft, Run and Stale are known for the workflow that is OPEN and for no
 *  other: a saved document carries its name, nodes, edges and manifest, and nothing records that
 *  it ran. The practitioner, asked to choose: *"Project does not ship with a project column, only
 *  workflow and widget count."* So this counts what is there and claims nothing about what was
 *  done to it -- the same refusal as the timestamps that reordered this plan, where a column
 *  would have been a label over facts the application does not keep.
 */
/** WHAT THIS DEVICE IS HOLDING, in the tab that asks what a project holds.
 *
 *  Recovered on 2026-10-23 from inside `renderProjectsList`, which was deleted with the dialog it
 *  rendered. Deleting the door deleted the room: the meter kept its element and lost the code that
 *  filled it, and the tab showed an empty section rather than an error. Found by a test asserting
 *  it was visible, which an empty div is not.
 *
 *  TWO STORES, TWO LINES. The workspace store is small and fills with workflows; the large store
 *  is where a download's records are kept by digest, and the two are not interchangeable. */
function renderProjectStorage():void{
  const used=storageUsedBytes(),share=used/STORAGE_QUOTA_BYTES;
  const tone=share>=STORAGE_FULL?'full':share>=STORAGE_TIGHT?'tight':'';
  const mb=(value:number)=>(value/1e6).toFixed(1);
  const size=(value:number)=>value<1e6?`${Math.max(1,Math.round(value/1024)).toLocaleString('en')} KB`:`${mb(value)} MB`;
  const held=payloadStoreBytes(),payloads=payloadCount();
  const large=payloadStoreKind()==='indexeddb';
  $('#storage-meter').innerHTML=
    `<h3>Workspace store · workflows and their settings</h3>`
    +`<div class="storage-bar ${tone}"><i style="width:${Math.round(share*100)}%"></i></div>`
    +`<p class="muted">${size(used)} of ${mb(STORAGE_QUOTA_BYTES)} MB used, each workflow written twice per save.${
      share>=STORAGE_TIGHT?' <strong>Export what you want to keep and delete the rest.</strong>':''}</p>`
    +`<h3>Data store · what a download brought back</h3>`
    +`<p class="muted">${payloads?`${payloads.toLocaleString('en')} ${payloads===1?'payload':'payloads'}, ${size(held)}`:'Nothing held'}, `
    +`in ${large?'IndexedDB':'the small store — a download will be refused'}.</p>`
    +(()=>{const loose=unreferencedPayloads();
      return loose.digests.length
        ?`<p class="notice">${loose.digests.length.toLocaleString('en')}, ${size(loose.bytes)}, referred to by no workflow. `
          +`<button class="button small danger" id="drop-unreferenced">Remove ${size(loose.bytes)}</button></p>`
        :'';})()
    +(siteEstimate
      ?`<p class="muted">The browser reports this site using ${size(siteEstimate.usage)} of about `
        +`${(siteEstimate.quota/1e9).toFixed(1)} GB it may use — its own rounded accounting, which need `
        +`not agree with the figures above.</p>`
      :`<p class="muted">This browser does not report a storage estimate, so how much room remains for the data store is unknown here.</p>`)
    +`<p class="muted">${esc(persistenceNote())}</p>`;
}

/** WORKFLOWS THAT BELONG TO NO INVESTIGATION, which is where a deleted project leaves its own.
 *
 *  The practitioner, 2026-10-23: *"I deleted Raster Project but the workflow persisted."* It did,
 *  by design and announced twice -- the confirmation says the workflows stay and can still be
 *  opened, and the toast says they are here, in no project. Keeping work that somebody made is
 *  the right default; a project is a grouping, not a container whose deletion destroys its
 *  contents.
 *
 *  What was wrong is that the consolidation an hour earlier deleted the only place they were
 *  visible. The projects dialog had an "In no project" block; removing the dialog removed it, so
 *  a workflow survived its project into an interface with nowhere to show it. The announcement
 *  was true and unverifiable, which is worse than either.
 */
function renderUnfiledList(saved:Record<string,unknown>,current:string):void{
  const section=$('#project-unfiled-list');
  const filed=new Set(allProjects().flatMap(p=>p.workflows));
  const unfiled=Object.keys(saved).filter(k=>!filed.has(k));
  section.hidden=!unfiled.length;
  if(section.hidden)return;
  const rows=$('#project-unfiled-rows');
  rows.innerHTML='';
  for(const key of unfiled){
    const row=document.createElement('div');row.className='project-view-row';
    const name=document.createElement('span');
    name.textContent=((saved[key] as {name?:string})?.name||workflowTitle(key))
      +(key===current?' \u00b7 open':'');
    const count=document.createElement('span');count.className='muted';
    const nodes=((saved[key] as {nodes?:unknown[]})?.nodes??[]).length;
    count.textContent=nodes===1?'1 widget':`${nodes} widgets`;
    const open=document.createElement('button');
    open.className='button small';open.dataset.openWorkflow=key;open.textContent='Open';
    open.disabled=key===current;
    const remove=document.createElement('button');
    remove.className='button small danger';remove.dataset.deleteWorkflow=key;remove.textContent='Delete';
    row.append(name,count,open,remove);rows.append(row);
  }
}

/** THE CATALOG OF WORKED EXAMPLES, which `widgets/examples.json` has described since 2026-10-23
 *  with nothing reading it. The practitioner, 2026-10-24, asked how to load South London and
 *  whether it was in a manifest: it was pinned -- commit, per-file digests, licence -- and
 *  `src/example-catalog.ts` was imported by nothing, so it was not built and its three tests
 *  skipped saying exactly that. A trust root with nothing standing on it.
 *
 *  It lives in the PROJECT TAB because opening a worked example is importing a project, and this
 *  tab is where the practitioner consolidated projects: *"I need one location to select
 *  projects... view project info, manage a project and its workflows, and to import projects,
 *  export projects, this is the Projects tab."* The header's Catalog button is the WIDGET
 *  catalog; putting examples there would overload one word across two different things.
 *
 *  FETCHABLE IS NOT AVAILABLE, and the governance in the catalog requires the interface to say
 *  which: an example not yet fetched is a repository on somebody else's server, and one fetched
 *  is a workflow on this device that opens offline. */
const FETCHED_EXAMPLES='fieldwork-fetched-examples-v1';
const fetchedExamples=():string[]=>{
  try{const raw=localStorage.getItem(FETCHED_EXAMPLES);return raw?JSON.parse(raw) as string[]:[];}
  catch{return [];}
};
const rememberFetched=(id:string)=>{
  try{const all=new Set(fetchedExamples());all.add(id);
    localStorage.setItem(FETCHED_EXAMPLES,JSON.stringify([...all]));}catch{/* a refusal here costs the badge, not the example */}
};
/** WHERE AN IMPORTED WORKFLOW CAME FROM, so that RESET EXAMPLE means something for it.
 *
 *  The practitioner, 2026-10-24: *"Imported examples should also be resettable."* They were not.
 *  Reset reloaded `template(key)` -- a workflow compiled into the application -- and an imported
 *  example has no template, so the control hid itself and an edit had no way back.
 *
 *  The import MINTS A FRESH KEY, and that is the whole difficulty: minting is what makes the
 *  workflow the practitioner's own and deletable, and it is also what severs it from the document
 *  it was read from. So record the severed end. The digest is the catalog's pinned one, which is
 *  also the payload-store key the verified bytes are kept under, so a reset reads the same bytes
 *  that were verified at import and goes back to the network only if the cache has lost them. */
/** `manual` is the digest of the example's manual.json, when it publishes one (experiment 173). */
interface ExampleOrigin {exampleId:string; path:string; sha256:string; index:number; manual?:string}
const EXAMPLE_ORIGINS='fieldwork-example-origins-v1';
const exampleOrigins=():Record<string,ExampleOrigin>=>{
  try{const raw=localStorage.getItem(EXAMPLE_ORIGINS);return raw?JSON.parse(raw) as Record<string,ExampleOrigin>:{};}
  catch{return {};}
};
const originOf=(key:string):ExampleOrigin|undefined=>exampleOrigins()[key];
const rememberOrigins=(added:Record<string,ExampleOrigin>):void=>{
  try{localStorage.setItem(EXAMPLE_ORIGINS,JSON.stringify({...exampleOrigins(),...added}));}
  catch{/* a refusal here costs the reset, not the import */}
};
/** Forget the keys a delete has removed, so the map does not grow for the life of the device. */
const forgetOrigins=(keys:string[]):void=>{
  const all=exampleOrigins();
  const kept=Object.fromEntries(Object.entries(all).filter(([key])=>!keys.includes(key)));
  if(Object.keys(kept).length===Object.keys(all).length)return;
  try{localStorage.setItem(EXAMPLE_ORIGINS,JSON.stringify(kept));}catch{/* as above */}
};
/** What the example carries, in the practitioner's terms rather than the schema's. */
const carriedBy=(e:CatalogExample):string=>{
  const has=[e.carries.workflow&&'a workflow',e.carries.data&&'data',e.carries.geography&&'geography']
    .filter(Boolean) as string[];
  return has.length?has.join(', '):'nothing yet';
};
function renderExampleCatalog():void{
  const host=optionalElement('#project-examples-list');
  if(!host)return;
  const fetched=new Set(fetchedExamples());
  const examples=curatedExamples();
  host.innerHTML=examples.map(e=>{
    const bytes=e.files.reduce((n,f)=>n+f.bytes,0);
    const state=fetched.has(e.id)
      ?'<span class="pill">Fetched on this device</span>'
      :'<span class="pill muted">Not fetched yet</span>';
    return `<article class="project-row"><h4>${esc(e.title)} ${state}</h4>`
      +`<p class="muted">${esc(e.description)}</p>`
      +`<p class="muted">Carries ${esc(carriedBy(e))} \u00b7 ${e.files.length} files, `
      +`${(bytes/1024).toFixed(0)} KB \u00b7 ${esc(e.licence.data)}</p>`
      +(e.notYet?`<p class="muted">Not yet: ${esc(e.notYet)}</p>`:'')
      +`<p class="muted">${esc(e.repository)} at ${esc(e.commit.slice(0,10))}</p>`
      +`<div class="inspector-actions">`
      +(e.carries.workflow
        ?`<button class="button small" data-open-example="${esc(e.id)}">${fetched.has(e.id)?'Fetch again and open':'Fetch and open'}</button>`
        :`<span class="muted">No workflow to open yet.</span>`)
      +`</div><p class="muted" data-example-status="${esc(e.id)}"></p></article>`;
  }).join('')||'<p class="muted">No worked examples are curated yet.</p>';
  host.querySelectorAll<HTMLButtonElement>('[data-open-example]').forEach(button=>{
    button.onclick=()=>void openCuratedExample(required(button.dataset.openExample),button);
  });
}
/** Fetched only on this click, verified before it is used, and refused rather than half-loaded.
 *
 *  `verifiedFile` does the refusing: a path the catalog does not pin is never requested, a size
 *  that disagrees is refused before hashing, and a digest mismatch discards the bytes. Nothing
 *  here softens any of that into a warning. */
async function openCuratedExample(id:string,button:HTMLButtonElement=document.createElement('button')):Promise<void>{
  const example=curatedExamples().find(e=>e.id===id);
  if(!example)return;
  // RE-QUERIED EVERY TIME, never held. Importing a workflow re-renders the project view, which
  // replaces this paragraph -- a reference captured before the import is writing to a node that
  // is no longer on the page, so the message the practitioner most needs (the digest matched, or
  // did not) is the one that silently goes nowhere.
  const say=(message:string)=>{
    const at=optionalElement(`[data-example-status="${CSS.escape(id)}"]`);
    if(at)at.textContent=message;
  };
  const label=button.textContent||'Fetch and open';
  button.disabled=true;button.textContent='Fetching\u2026';
  try{
    // A PROJECT FIRST, A LONE WORKFLOW ONLY IF THERE IS NO PROJECT.
    //
    // The practitioner, 2026-10-24: *"when we import South London, we import a project and its
    // workflows. Right now it just one workflow."* It was, and it landed under "-- No project --"
    // because that is what the file said it was. An investigation is a project, its questions are
    // its workflows, and the import control already knew how to read one.
    const projectFile=example.files.find(f=>/fieldwork-project.*\.json(\.gz)?$/.test(f.path));
    const workflowFile=projectFile
      ??example.files.find(f=>/fieldwork-workflow.*\.json(\.gz)?$/.test(f.path));
    if(!workflowFile)throw new Error('This example pins no project or workflow document, so there is nothing to open.');
    say(`Fetching ${workflowFile.path} from ${example.repository}\u2026`);
    const bytes=await verifiedFile(example,workflowFile.path);
    say('Verified against the pinned digest \u00b7 reading\u2026');
    const text=await readMaybeGzipped(new Blob([bytes as BlobPart]));
    const parsed=JSON.parse(text) as {schema?:string};
    let opened:string;
    if(parsed?.schema===PROJECT_DOCUMENT_SCHEMA){
      const keys=await importProjectDocument(parsed);
      // Written AFTER the import, because an import that refuses leaves nothing to reset to.
      await putPayload(workflowFile.sha256,parsed);
      // THE MANUAL, when the example publishes one: verified like the project, kept by digest, and shown in the
      // Manual tab of every workflow this import opened. A manual that fails verification is not shown; the
      // project still opens, because the steps are a guide to the work and not part of it.
      let manual:string|undefined;
      const manualFile=example.files.find(f=>f.path==='manual.json');
      if(manualFile){
        try{
          const parsed=validateManual(JSON.parse(new TextDecoder().decode(await verifiedFile(example,manualFile.path))));
          await putPayload(manualFile.sha256,parsed);manual=manualFile.sha256;
        }catch(error){toast(`The manual was not opened: ${errorMessage(error)}`,{tone:'failure'});}
      }
      rememberOrigins(Object.fromEntries(keys.map((key,index)=>
        [key,{exampleId:example.id,path:workflowFile.path,sha256:workflowFile.sha256,index,manual}])));
      // The import opens the workflow and draws the bar BEFORE the origin exists, so the bar was
      // drawn for a workflow with no way back and RESET EXAMPLE stayed hidden until something
      // else happened to redraw it. Draw it again now that the origin is recorded.
      renderProjectOptions();
      opened=example.title;
    }
    else {const next=validateWorkflow(parsed);applyImportedWorkflow(next);opened=next.name;}
    rememberFetched(example.id);
    toast(`${example.title} opened. It is on this device now and opens offline.`);
    // The badge first, then the message, because re-rendering replaces the paragraph.
    renderExampleCatalog();
    say(`Opened ${opened} \u00b7 ${workflowFile.bytes.toLocaleString()} bytes, digest matched`);
  }catch(error){
    // The example stays unfetched rather than partly loaded, and the reason is the one the
    // verification gave -- a digest mismatch says so, rather than becoming "could not load".
    say(errorMessage(error));
    toast(errorMessage(error),{tone:'failure'});
  }finally{button.disabled=false;button.textContent=label;}
}
/** WHERE THIS PROJECT'S WORKED EXAMPLE LIVES ONLINE (experiment 203): a catalog example its workflows were opened from,
 *  or a built-in example's own project. None for a project of the practitioner's own. */
function onlineLinks(project:Project|undefined):ExampleLinks[]{
  if(!project)return [];
  const ids=[...new Set(project.workflows.map(key=>originOf(key)?.exampleId).filter((id):id is string=>!!id))];
  const fromCatalog=ids.map(id=>curatedExamples().find(e=>e.id===id)).filter((e):e is NonNullable<typeof e>=>!!e).map(catalogLinks);
  if(fromCatalog.length)return fromCatalog;
  const builtIn=BUILT_IN_PROJECTS.find(p=>p.id===project.id);
  const links=builtIn?builtInLinks(builtIn,storageKey(workflow)):null;
  return links?[links]:[];
}
/** THE COUNTRY UPSTREAM OF A STEP (the practitioner, 2026-11-10: "The raster input should be able to query upstream for
 *  the country"). Every step the area passes through on its way here is walked back to the study areas that started it --
 *  through a buffer, a combined area, a clip or a measurement -- and their countries collected: one is the answer, two
 *  is a choice for the person, none is a question. A study area's own statement is the only source; nothing is inferred
 *  from coordinates. */
function upstreamCountries(source:Workflow,nodeId:string):string[]{
  const found=new Set<string>(),seen=new Set<string>(),queue=[nodeId];
  while(queue.length){
    const id=queue.shift()!;
    if(seen.has(id))continue;seen.add(id);
    const node=source.nodes.find(x=>x.id===id);
    if(node&&node.id!==nodeId){
      const stated=countryOfArea(node.params as {country?:string;boundary?:{boundaryID?:string;provenance?:{boundaryID?:string}}});
      // A study area across a border states several (experiment 204): all of them.
      if(node.type==='study_area'){for(const c of countriesOfArea(node.params as {countries?:string[];country?:string}))found.add(c);continue;}
      if(stated)found.add(stated);
    }
    for(const e of source.edges)if(e.to===id)queue.push(e.from);
  }
  return [...found].sort();
}
const upstreamCountry=(source:Workflow,nodeId:string):string|null=>{const all=upstreamCountries(source,nodeId);return all.length===1?all[0]!:null;};

/** The manual of the worked example this workflow was opened from, if it published one. */
const exampleManualDigest=():string|undefined=>originOf(storageKey(workflow))?.manual;
const manualByDigest=(digest:string|undefined):WorkedExampleManual|undefined=>{
  const held=digest?cachedPayload(digest):undefined;
  try{return held?validateManual(held):undefined;}catch{return undefined;}
};
function exampleManual():WorkedExampleManual|undefined{return manualByDigest(exampleManualDigest());}

/** WHAT THE PRACTITIONER HAS DONE, per manual, on this device. Keyed by the manual's digest, so a changed manual starts
 *  over rather than ticking steps that moved. */
const MANUAL_PROGRESS='fieldwork-manual-progress-v1';
const manualProgress=(digest:string):Set<string>=>{
  try{return new Set((JSON.parse(localStorage.getItem(MANUAL_PROGRESS)||'{}') as Record<string,string[]>)[digest]??[]);}
  catch{return new Set();}
};
const saveManualProgress=(digest:string,done:Set<string>)=>{
  try{const all=JSON.parse(localStorage.getItem(MANUAL_PROGRESS)||'{}') as Record<string,string[]>;
    all[digest]=[...done];localStorage.setItem(MANUAL_PROGRESS,JSON.stringify(all));}catch{/* progress is a convenience */}
};
const manualTitle=(type:string)=>TYPES[type as NodeType]?.title??type;
/** A step clicked, or pressed with Enter or Space, is done; again, it is not. */
function wireManualSteps(host:HTMLElement,digest:string){
  // COPY puts the exact value on the clipboard. It is a control inside a step, so it does not mark the step done.
  host.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button=>{
    button.onclick=async e=>{
      e.stopPropagation();
      const value=required(button.dataset.copy);
      try{await navigator.clipboard.writeText(value);}
      catch{
        // Without clipboard permission, select the text so the person can copy it themselves.
        const code=button.previousElementSibling;
        if(code){const range=document.createRange();range.selectNodeContents(code);
          const selection=getSelection();selection?.removeAllRanges();selection?.addRange(range);}
        button.textContent='Selected';setTimeout(()=>{button.textContent='Copy';},1500);return;
      }
      button.textContent='Copied';setTimeout(()=>{button.textContent='Copy';},1500);
    };
    button.onkeydown=e=>e.stopPropagation();
  });
  host.querySelectorAll<HTMLElement>('[data-step]').forEach(step=>{
    const toggle=()=>{const done=manualProgress(digest),key=required(step.dataset.step);
      if(done.has(key))done.delete(key);else done.add(key);saveManualProgress(digest,done);
      renderManualFloat();if(currentView==='manual')renderManualView();};
    step.onclick=toggle;
    step.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};
  });
}
/** THE MANUAL TAB: how to build each of this example's workflows by hand, the open one first. Experiment 173. */
/** THE MANUAL'S STEPS FOR THE OPEN WORKFLOW, PLAYED BACK: a panel that is not modal, the step in the manual's words, and
 *  the canvas holding what is placed by then. Changes nothing: the workflow is not edited, and Close restores it. */
function openManualPlayback(steps:import('./worked-example-manual.js').ManualStep[],name:string):void{
  playbackStep=null;renderPlayback();
  manualPlayback={steps,types:handleTypes(steps),placed:placedByStep(steps,workflow.nodes),index:0,name};
  renderManualPlayback();render();
}
function renderManualPlayback():void{
  document.getElementById('manual-playback')?.remove();
  if(!manualPlayback)return;
  const {steps,types,index,name}=manualPlayback,step=steps[index]!;
  const panel=document.createElement('section');panel.id='manual-playback';panel.className='manual-playback';
  panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','manual-playback-title');
  const counted=steps.filter(x=>!('note' in x)).length,at=steps.slice(0,index+1).filter(x=>!('note' in x)).length;
  panel.innerHTML=`<div class="manual-head"><h2 id="manual-playback-title">${esc(name)}</h2>`
    +`<button class="button" id="manual-playback-close">Close</button></div>`
    +`<p class="muted" data-playback-at>${'note' in step?'A note':`Step ${at} of ${counted}`}</p>`
    +`<p class="manual-playback-step" data-playback-step>${stepSentence(step,types,t=>TYPES[t as NodeType]?.title??t,esc)}</p>`
    +`<div class="inspector-actions"><button class="button" id="manual-playback-back" ${index?'':'disabled'}>Previous</button>`
    +`<button class="button" id="manual-playback-next" ${index<steps.length-1?'':'disabled'}>Next</button></div>`
    +`<p class="muted">The canvas holds what is placed by this step. Nothing is changed; Close puts it back.</p>`;
  document.body.append(panel);
  const go=(to:number)=>{if(!manualPlayback)return;manualPlayback.index=Math.max(0,Math.min(steps.length-1,to));renderManualPlayback();render();};
  panel.querySelector<HTMLButtonElement>('#manual-playback-back')!.onclick=()=>go(index-1);
  panel.querySelector<HTMLButtonElement>('#manual-playback-next')!.onclick=()=>go(index+1);
  panel.querySelector<HTMLButtonElement>('#manual-playback-close')!.onclick=()=>{manualPlayback=null;renderManualPlayback();render();};
}
function renderManualView():void{
  const digest=exampleManualDigest(),manual=manualByDigest(digest),host=$('#manual-view');
  host.innerHTML=manual&&digest
    ?'<div class="manual-intro"><strong>Build it by hand</strong><span>Each workflow from an empty canvas, step by step. '
      +'Click a step when it is done. Detach the manual to keep it beside you in a project of your own.</span>'
      +`<div class="inspector-actions"><button class="button small" id="manual-detach">${detachedManual()?.digest===digest?'Detached':'Detach'}</button>`
      +(manual?.workflows.some(w=>w.name===workflow.name)?`<button class="button small" id="manual-playback-start">Play back these steps</button>`:'')+`</div></div>`
      +renderManual(manual,workflow.name,manualTitle,esc,manualProgress(digest))
    :'<p class="muted">This workflow has no manual.</p>';
  if(manual&&digest){
    wireManualSteps(host,digest);
    optionalElement('#manual-playback-start')?.addEventListener('click',()=>{
      const steps=manual.workflows.find(w=>w.name===workflow.name)?.steps;if(steps)openManualPlayback(steps,workflow.name);});
    optionalElement('#manual-detach')?.addEventListener('click',()=>{
      const origin=originOf(storageKey(workflow));
      detachManual({digest,title:exampleById(origin?.exampleId??'')?.title??'Worked example'});
    });
  }
}

/** THE MANUAL, DETACHED: a panel that stays while the practitioner builds in a project of their own. The practitioner,
 *  2026-11-04: *"Can the manual be detached, become a surface dialog so the user can create a new project? When the
 *  user decides to finish the activity he or she can close the dialog. If user wants to resume user can go back to the
 *  manual tab and detach it again to resume."* Not modal, so every control stays in reach; held on this device, so a
 *  reload or a change of project keeps it; closed only by Close. Experiment 173. */
const MANUAL_DETACHED='fieldwork-manual-detached-v1';
interface DetachedManual {digest:string; title:string; left?:number; top?:number}
const detachedManual=():DetachedManual|undefined=>{
  try{const raw=localStorage.getItem(MANUAL_DETACHED);return raw?JSON.parse(raw) as DetachedManual:undefined;}catch{return undefined;}
};
const keepDetached=(state:DetachedManual|undefined)=>{
  try{if(state)localStorage.setItem(MANUAL_DETACHED,JSON.stringify(state));else localStorage.removeItem(MANUAL_DETACHED);}
  catch{/* the panel still opens; it is not remembered */}
};
function detachManual(state:DetachedManual):void{
  keepDetached({...detachedManual(),...state});renderManualFloat(true);
  if(currentView==='manual')renderManualView();
}
/** ABOVE A MODAL, NOT BEHIND IT. The practitioner, 2026-11-04: *"when the table input modal is visible the manual
 *  becomes blurred so picking the right file from the long list of files in the zip becomes difficult"*. A modal
 *  dialog blurs and blocks everything outside itself, so while one is open the panel is moved inside it: fixed in
 *  place, it does not move on screen, and it can be read, scrolled and copied from. It goes back when the modal
 *  closes. */
// THE ORDER MODALS OPENED IN, because the top one is the last opened and neither the page order nor the browser says
// which that is: a dialog over a dialog (the column list over Import tabular data) must hold the panel.
const openedModals:HTMLDialogElement[]=[];
function placeManualFloat():void{
  for(const d of [...openedModals])if(!d.isConnected||!d.open)openedModals.splice(openedModals.indexOf(d),1);
  for(const d of document.querySelectorAll<HTMLDialogElement>('dialog[open]'))
    if(d.matches(':modal')&&!openedModals.includes(d))openedModals.push(d);
  // A worked example's manual and a widget's page, each moved above the top modal and back.
  // BESIDE THE NEW PROJECT FORM, not over it (2026-11-16, when New project became a tab): docked in its column, so a
  // learner following the manual can read it and still reach Create project.
  const beside=document.querySelector<HTMLElement>('#project-view:not([hidden]) #project-tab-new:not([hidden]) #project-new-manual');
  const home=openedModals.at(-1)??(beside&&document.getElementById('manual-float')?beside:document.body);
  for(const id of ['manual-float','widget-manual-float']){
    const panel=document.getElementById(id);
    const to=id==='manual-float'?home:openedModals.at(-1)??document.body;
    if(panel&&panel.parentElement!==to)to.append(panel);
  }
}
new MutationObserver(placeManualFloat).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
function renderManualFloat(resume=false):void{
  const state=detachedManual(),manual=manualByDigest(state?.digest);
  let panel=document.getElementById('manual-float');
  if(!state||!manual){panel?.remove();return;}
  if(!panel){
    panel=document.createElement('aside');panel.id='manual-float';panel.className='manual-float';
    panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Manual');
    document.body.append(panel);placeManualFloat();
  }
  const done=manualProgress(state.digest);
  const steps=manual.workflows.reduce((n,w)=>n+w.steps.filter(s=>!('note' in s)).length,0);
  const scroll=panel.querySelector('.manual-float-body')?.scrollTop??0;
  panel.innerHTML=`<header class="manual-float-head"><strong>Manual \u00b7 ${esc(state.title)}</strong>`
    +`<span class="muted">${done.size} of ${steps} done</span>`
    +`<button class="button small" id="manual-float-close">Close</button></header>`
    +`<div class="manual-float-body">${renderManual(manual,undefined,manualTitle,esc,done)}</div>`;
  if(state.left!==undefined&&state.top!==undefined){
    panel.style.left=`${Math.max(0,Math.min(state.left,innerWidth-120))}px`;
    panel.style.top=`${Math.max(0,Math.min(state.top,innerHeight-60))}px`;
    panel.style.right='auto';panel.style.bottom='auto';
  }
  const body=panel.querySelector<HTMLElement>('.manual-float-body')!;
  // RESUMING opens where the practitioner left off; a tick keeps the scroll where it was.
  if(resume){const next=firstUndone(manual,done);
    body.querySelector<HTMLElement>(`[data-step="${next}"]`)?.scrollIntoView({block:'center'});}
  else body.scrollTop=scroll;
  wireManualSteps(body,state.digest);
  panel.querySelector<HTMLButtonElement>('#manual-float-close')!.onclick=()=>{
    keepDetached(undefined);renderManualFloat();if(currentView==='manual')renderManualView();};
  // Dragged by its header, and remembered where it was put.
  const head=panel.querySelector<HTMLElement>('.manual-float-head')!;
  head.onpointerdown=e=>{
    if((e.target as HTMLElement).closest('button'))return;
    const box=panel!.getBoundingClientRect(),dx=e.clientX-box.left,dy=e.clientY-box.top;
    head.setPointerCapture(e.pointerId);
    head.onpointermove=m=>{panel!.style.left=`${m.clientX-dx}px`;panel!.style.top=`${m.clientY-dy}px`;
      panel!.style.right='auto';panel!.style.bottom='auto';};
    head.onpointerup=()=>{head.onpointermove=null;head.onpointerup=null;
      const placed=panel!.getBoundingClientRect();const now=detachedManual();
      if(now)keepDetached({...now,left:Math.round(placed.left),top:Math.round(placed.top)});};
  };
}
function renderProjectView():void{
  renderUnfiled();
  renderExampleCatalog();
  // The storage figures moved here from the dialog behind the pill: this is where a practitioner
  // asks what a project holds, so it is where the answer belongs.
  renderProjectStorage();
  void refreshSiteEstimate().then(()=>{if(currentView==='project')renderProjectStorage();});
  void requestPersistence().then(()=>{if(currentView==='project')renderProjectStorage();});
  renderUnfiledList(readSavedWorkflows(),storageKey(workflow));
  const list=$('#project-view-list');
  // EVERY PROJECT, NOT ONLY THE STORED ONES. The first version listed `readProjects()`, which is
  // the stored ones, because the header's safety state is said only for those -- a built-in has no
  // stored record, so `exportedAt` can never be written for it. That reasoning is right about the
  // STATE and was wrong about the VIEW. The practitioner, on the Project tab of a canvas whose
  // own breadcrumb read "1854 Cholera Outbreak in London" and whose selector read "4 workflows":
  // *"This is the Projects tab, really nothing to see."* It said "No projects yet" over a project
  // the rest of the interface was naming, which is worse than empty.
  //
  // So the view answers "what do I have", for which a worked example counts, and claims a backup
  // state only where there is one to claim. Two different questions, and only the second is about
  // storage.
  // THE PROJECT THAT IS SELECTED, not every project on the device. The practitioner, 2026-10-23:
  // *"In the project tab, I should only see the workflows for project that's selected from top
  // left drop down for projects."* The first version listed all eight, which is the projects
  // DIALOG rendered in a tab -- the same contents in a new place, which is how twelve surfaces
  // happened. One dropdown selects, this tab shows what was selected.
  const stored=readProjects();
  const storedIds=new Set(stored.map(p=>p.id));
  const key=storageKey(workflow);
  const selectedProject=allProjects().find(p=>p.id===(workflow.projectId
    ??projectOfWorkflow(key,allProjects())?.id));
  const projects=selectedProject?[selectedProject]:[];
  const saved=readSavedWorkflows();
  const current=storageKey(workflow);
  // ZERO IS NOT THE SAME AS NOT YET OPENED. This counted `saved[key]`, which is what is stored on
  // this device, so every worked example nobody has opened read "0 widgets" -- "4 workflows · 0
  // widgets" against the John Snow project, whose four workflows are full of them. The count was
  // true about storage and false about the project, which is the worse kind of true.
  //
  // Counting the published template instead would be accurate and would build up to a dozen
  // example workflows on a tab switch, some of them data-bearing, so the honest cheap answer is
  // to say which question is being answered rather than to answer the wrong one with a number.
  // WHAT EACH WORKFLOW COSTS, which is the other half of what the practitioner asked this tab to
  // answer: *"This could be also where I view assets in storage per workflow in that project."*
  // Recovered from the dialog, where it was the only place a per-workflow size was ever shown.
  const raw=(()=>{try{return JSON.parse(localStorage.getItem(WORKSPACES)||'{}') as Record<string,unknown>;}
    catch{return {} as Record<string,unknown>;}})();
  const storedBytes=(k:string)=>{try{return JSON.stringify(raw[k]??'').length;}catch{return 0;}};
  const kb=(value:number)=>value>=1e6?`${(value/1e6).toFixed(1)} MB`
    :`${Math.max(1,Math.round(value/1024)).toLocaleString('en')} KB`;
  const held=(key:string):number|null=>key===current?workflow.nodes.length
    :key in saved?((saved[key] as {nodes?:unknown[]})?.nodes??[]).length:null;
  const widgetText=(count:number|null):string=>count===null?'not opened on this device'
    :count===1?'1 widget':`${count} widgets`;
  $('#project-view-title').textContent=selectedProject?selectedProject.name:'No project selected';
  $('#project-view-subtitle').textContent=selectedProject
    ?'What this project holds, and whether a copy of it exists anywhere else.'
    :'Choose one from the Project list at the top left, or file the workflow you have open under a new one.';
  $('#project-view-count').textContent=selectedProject
    ?String(selectedProject.workflows.length):'';
  if(!projects.length){list.innerHTML='';return;}
  list.innerHTML='';
  for(const project of projects){
    const tracked=storedIds.has(project.id);
    const safe=projectSafety(project)==='backed up'&&!exportPredatesWork(project);
    const section=document.createElement('section');
    section.className='project-view-block';
    section.dataset.project=project.id;
    const heading=document.createElement('h3');heading.textContent=project.name;
    const state=document.createElement('span');
    state.className='project-view-state';
    // A worked example ships with the application and is restored by Reset example, so "Not backed
    // up" would be a warning no action could clear -- the same trap the header fell into first.
    state.dataset.safety=!tracked?'built-in':safe?'backed-up':'at-risk';
    state.textContent=!tracked?'Ships with the application'
      :safe?'Backed up':exportPredatesWork(project)?'Backed up \u00b7 changed since':'Not backed up';
    heading.append(' ',state);
    const counts=document.createElement('p');counts.className='muted';
    const counted=project.workflows.map(held).filter((n):n is number=>n!==null);
    const nodes=counted.reduce((n,x)=>n+x,0);
    const unopened=project.workflows.length-counted.length;
    counts.textContent=`${esc(project.subject||'No subject.')} \u00b7 `
      +`${project.workflows.length===1?'1 workflow':`${project.workflows.length} workflows`} \u00b7 `
      +(counted.length?`${nodes===1?'1 widget':`${nodes} widgets`}`:'none opened on this device')
      +(counted.length&&unopened?` \u00b7 ${unopened} not opened yet`:'');
    section.append(heading,counts);
    const actions=document.createElement('p');actions.className='project-view-actions';
    if(tracked){
      const backup=document.createElement('button');
      // Same class: exportProject opens with the same guard, and this button is rebuilt by
      // render() on every state change, so it carries the state rather than being set once.
      backup.className='button small';backup.dataset.exportProject=project.id;backup.disabled=busy;
      // ENCRYPTED FIRST (the export encryption audit): the default, with its own button; the plain copy beside it, named as one.
      const sealed=document.createElement('button');
      sealed.className='button small primary';sealed.dataset.sealProject=project.id;sealed.disabled=busy;
      sealed.textContent='\u2193 Back up, encrypted';
      // THE SECOND EXPORT, beside the first rather than instead of it. One file backs a project
      // up; a repository lets several authors own one. Experiment 150.
      const repository=document.createElement('button');
      repository.className='button small';
      repository.dataset.exportRepository=project.id;repository.disabled=busy;
      repository.textContent='Export as repository';
      backup.textContent='\u2193 Plain copy';backup.title='Readable by anyone who has the file: for a worked example to publish.';
      const remove=document.createElement('button');
      remove.className='button small danger';remove.dataset.deleteProject=project.id;
      remove.textContent='Delete project';
      actions.append(sealed,backup,repository,remove);
    }else{
      // Its workflows can still be backed up one at a time; the PROJECT cannot, because the
      // dialog's project export renders only for a project that can be deleted.
      const note=document.createElement('span');note.className='muted';
      note.textContent='A worked example. Back up any of its workflows from Back up, or file your '
        +'own copies under a new project.';
      actions.append(note);
    }
    section.append(actions);
    for(const key of project.workflows){
      const row=document.createElement('div');row.className='project-view-row';
      const name=document.createElement('span');
      // THE WORKFLOW'S NAME, not its storage key. These rows read "kivu/w1" until 2026-10-23: the
      // dialog they replaced took the name off the saved document and fell back to a title, and
      // the replacement used the key as its fallback for a project workflow, which has no entry
      // in WORKFLOW_LABELS -- so every workflow a practitioner made was listed by an identifier
      // they never chose.
      name.textContent=((saved[key] as {name?:string}|undefined)?.name
        ||(key===current?workflow.name:'')||workflowTitle(key))
        +(key===current?' \u00b7 open':'');
      const count=document.createElement('span');count.className='muted';
      // THE PRACTITIONER'S OWN QUESTION, 2026-10-23: *"And I want to know if the data are stored
      // with the project."* `exportProject` already knew -- it says so in a toast after the file
      // is written, which is the moment it is least useful -- and `unbundledReferences` is the
      // measure it uses: a node holding a `dataRef` and no inline `data` is a download kept on
      // this device by reference, so whoever opens the export downloads it again.
      const document_=key===current?workflow:saved[key] as Workflow|undefined;
      const byReference=document_?unbundledReferences([document_]):0;
      const inStore=key in raw;
      count.textContent=widgetText(held(key))
        +(inStore?` \u00b7 ${kb(storedBytes(key))}`:'')
        +(byReference?` \u00b7 ${byReference} ${byReference===1?'dataset':'datasets'} by reference, not in an export`:'');
      const open=document.createElement('button');
      open.className='button small';open.dataset.openWorkflow=key;open.textContent='Open';
      open.disabled=key===current;
      const remove=document.createElement('button');
      remove.className='button small danger';remove.dataset.deleteWorkflow=key;
      remove.textContent='Delete';
      remove.disabled=!(key in raw);   // nothing saved under it, so there is nothing to delete
      row.append(name,count,open,remove);section.append(row);
    }
    list.append(section);
  }
}

/** WHAT THIS PROJECT HOLDS RIGHT NOW, so `unexportedWork` can say what a lost browser would cost.
 *
 *  Counted from the saved workflows the project lists plus the open canvas, which may not be
 *  saved yet and is the work most likely to be lost. Bytes are the payloads those workflows
 *  refer to -- the street networks and raster windows -- which is where the weight of a project
 *  actually is: a canvas of forty widgets is kilobytes beside one downloaded province. */
function projectWork(project:Project):ProjectWork{
  const saved=readSavedWorkflows();
  const current=storageKey(workflow);
  const referenced=new Set<string>();
  let nodes=0;
  const walk=(w:unknown)=>{
    for(const node of ((w as {nodes?:unknown[]})?.nodes??[])){
      nodes++;
      const ref=(node as {params?:{dataRef?:unknown}})?.params?.dataRef;
      if(typeof ref==='string')referenced.add(ref);
    }
  };
  for(const key of project.workflows){
    // The OPEN canvas rather than its saved copy, where they are the same workflow: unsaved work
    // is the work most likely to be lost, so counting the stored version would understate it.
    if(key===current){walk(workflow);continue;}
    const document=saved[key];
    if(document)walk(document);
  }
  const held=cachedPayloads();
  let bytes=0;
  for(const digest of referenced)if(held[digest])bytes+=payloadBytes(held[digest]);
  return {workflows:project.workflows.length,nodes,bytes};
}

/** THE STATE THE PRACTITIONER COULD NOT FIND, said where they already look.
 *
 *  `#save-status` has said "Saved on this device" on every successful save since this application
 *  had one. It is true and it answers the wrong question: it is about this browser, and the
 *  practitioner who could not find their backup was asking whether a copy existed anywhere else.
 *  The same string is the one this file already warns about elsewhere -- a degraded store "turns
 *  a 10 GB ceiling back into a 5 MB one while the application goes on saying Saved on this
 *  device".
 *
 *  So it now says both: where the work is, and whether a copy of it exists. And it is a control
 *  rather than a label, because experiment 131's test is not whether the state can be displayed
 *  but whether the backup can be REACHED from a cold start without being told where it is.
 *  A capability behind a door nobody can see is the failure this whole experiment is about. */
function renderProjectSafety():void{
  const element=$('#save-status');
  const store=payloadStoreKind()==='indexeddb'?'Saved on this device':'Saved on this device \u2014 small store only';
  // STORED PROJECTS ONLY, and the reason is that the state must be satisfiable. A built-in
  // worked example has no stored record, so `touchProject` returns early and `exportedAt` can
  // never be written for it; the dialog has no project export for it either, because that
  // control renders only for a project that can be deleted. Saying "Not backed up" there would
  // be a warning no action could clear -- the door opening onto a room without the capability,
  // which is the same failure as the capability without a door that this experiment began with.
  // Found by writing the test: the status rendered on the Old Naledi example and its own route
  // offered workflow exports only, none of which marks a project as backed up.
  const stored=readProjects();
  const project=stored.find(p=>p.id===(workflow.projectId
    ??projectOfWorkflow(storageKey(workflow),stored)?.id));
  if(!project||!project.workflows.length){element.textContent=store;return;}
  const risk=unexportedWork(project,projectWork(project));
  const safety=projectSafety(project)==='backed up'&&!exportPredatesWork(project)
    ?'Backed up'
    :risk?.kind==='never'?'Not backed up'
    :risk?'Backed up \u00b7 changed since':'Backed up';
  element.innerHTML='';
  element.append(store+' \u00b7 ');
  const control=document.createElement('button');
  control.type='button';
  control.id='project-safety';
  control.className='link-button';
  // ENCRYPTED OR PLAIN, said beside it (the export encryption audit): a plain copy in a downloads folder is readable by anyone.
  control.textContent=safety==='Not backed up'?safety:`${safety}${project.exportedSealed?', encrypted':', not encrypted'}`;
  control.title=safety==='Backed up'
    ?'A copy of this project exists outside this browser. Open the Workspace to make another.'
    :'No copy of this project exists outside this browser. Open the Workspace to make one.';
  control.dataset.safety=safety==='Backed up'?'backed-up':'at-risk';
  control.onclick=()=>switchView('project');
  element.append(control);
}

/** Payloads no workflow on this device refers to.
 *
 *  They are made by any refusal that happens after the payload is written: the fix above stops the
 *  download path making more, and does nothing about the ones already there. A practitioner whose
 *  store reads 416.2 MB against a widget holding nothing needs to be able to get those bytes
 *  back. A reference is a `dataRef` on any node of any saved workflow, plus the open canvas, which
 *  may not be saved yet. */
function unreferencedPayloads():{digests:string[];bytes:number}{
  const referenced=new Set<string>();
  const collect=(w:unknown)=>{
    for(const node of ((w as {nodes?:unknown[]})?.nodes??[])){
      const ref=(node as {params?:{dataRef?:unknown}})?.params?.dataRef;
      if(typeof ref==='string')referenced.add(ref);
    }
  };
  for(const saved of Object.values(readSavedWorkflows()))collect(saved);
  collect(workflow);
  const held=cachedPayloads();
  const digests=Object.keys(held).filter(digest=>!referenced.has(digest));
  return {digests,bytes:digests.reduce((sum,digest)=>sum+payloadBytes(held[digest]),0)};
}
/** BEST-EFFORT STORAGE IS EVICTABLE, AND THIS APPLICATION'S DATA IS NOT CHEAP TO REPLACE.
 *
 *  Without a granted persistence request, everything this site keeps -- IndexedDB payloads, the
 *  Cache Storage holding the offline application, localStorage -- is "best-effort" and the browser
 *  may evict it under storage pressure. That is survivable for a cached stylesheet and not for a
 *  WorldPop raster: the national extracts measured on 2026-10-24 are 293 MB and 1.18 GB, and at
 *  the 80 kB/s that download sustained, the larger one is about four hours. Losing it to eviction
 *  in the field is a worse failure than any slow save.
 *
 *  The request is asked once, on load, and the ANSWER IS RECORDED RATHER THAN ASSUMED. Browsers
 *  decide it differently -- some grant it silently to an installed application, some to a site
 *  with engagement, some refuse -- so this never reports data as safe. It reports what the browser
 *  said. A refusal is not an error and is not surfaced as one: the application works either way,
 *  and the practitioner is told which they have when they ask about storage. */
let persistence:'persisted'|'best-effort'|'unsupported'|'unknown'='unknown';
async function requestPersistence():Promise<void>{
  try{
    if(!navigator.storage?.persist){persistence='unsupported';return;}
    persistence=await navigator.storage.persisted?.()||await navigator.storage.persist()
      ?'persisted':'best-effort';
  }catch{persistence='unknown';}
}
const persistenceNote=():string=>({
  persisted:'The browser has granted persistent storage, so this site\u2019s data is not evicted to reclaim space.',
  'best-effort':'Storage here is best-effort: the browser may evict this site\u2019s data under storage pressure. Downloads that took hours are not guaranteed to survive. Installing the application, or using it more, usually earns persistence.',
  unsupported:'This browser does not offer persistent storage, so its data may be evicted under storage pressure.',
  unknown:'Whether this browser will keep this site\u2019s data under storage pressure is not known.',
}[persistence]);
let siteEstimate:{usage:number;quota:number}|null=null;
async function refreshSiteEstimate():Promise<void>{
  try{
    const estimate=await navigator.storage?.estimate?.();
    if(estimate&&typeof estimate.usage==='number'&&typeof estimate.quota==='number')
      siteEstimate={usage:estimate.usage,quota:estimate.quota};
  }catch{/* a browser that will not estimate is reported as not estimating */}
}
function renderStorageStatus(){
  const used=storageUsedBytes(),share=used/STORAGE_QUOTA_BYTES;
  const pill=$('#storage-status');
  const mb=(value:number)=>(value/1e6).toFixed(1);
  // KILOBYTES UNDER A MEGABYTE: "Storage 0.0 / 5.2 MB" reads as nothing stored at all, and the
  // store is never empty.
  //
  // TWO LABELS, because the header has no room to spare: the full figure, and a percentage for a
  // phone. Added as one element with two spans on 2026-10-21 after the long label pushed the
  // header 13 px past a 390 px viewport and twelve tests that check the page does not scroll
  // sideways caught it.
  const full=used<1e6?`Storage ${Math.max(1,Math.round(used/1024)).toLocaleString('en')} KB / ${mb(STORAGE_QUOTA_BYTES)} MB`
    :`Storage ${mb(used)} / ${mb(STORAGE_QUOTA_BYTES)} MB`;
  pill.innerHTML=`<span class="storage-long"></span><span class="storage-short"></span>`;
  pill.querySelector<HTMLElement>('.storage-long')!.textContent=full;
  pill.querySelector<HTMLElement>('.storage-short')!.textContent=`${Math.min(999,Math.round(share*100))}%`;
  pill.classList.toggle('tight',share>=STORAGE_TIGHT&&share<STORAGE_FULL);
  pill.classList.toggle('full',share>=STORAGE_FULL);
  const bytes=payloadStoreBytes();
  // The large store is shown beside the workspace one rather than folded into it: they fill for
  // different reasons and only one of them refuses a save.
  if(bytes)pill.querySelector<HTMLElement>('.storage-long')!.textContent
    =`${full} · data ${bytes<1e6?`${Math.round(bytes/1024).toLocaleString('en')} KB`:`${mb(bytes)} MB`}`;
  pill.title=share>=STORAGE_FULL
    ?'This browser\'s workspace store is nearly full. Export what you want to keep and delete what you do not: the next save may be refused.'
    :share>=STORAGE_TIGHT
      ?'This browser\'s workspace store is filling up. Export what you want to keep, and delete workflows you have finished with.'
      :'How much of this browser\'s workspace store is in use. Everything is held on this device; export to keep it anywhere else.';
  if(payloadStoreKind()!=='indexeddb')pill.title+=' Downloaded data is in the small store on this device, not the large one.';
  else if(bytes)pill.title+=` Downloaded data (${payloadCount()} ${payloadCount()===1?'payload':'payloads'}) is kept separately in the large store, which is not what refuses a save.`;
}
/** Every project and workflow on this device, with what each costs and what can be done with it.
 *
 *  *"I am not sure we have a clear FW projects button"* -- there was a picker and a details
 *  disclosure, and no one place that answers "what is on this device, how big is it, and how do I
 *  get it off". */


/** THE REPOSITORY'S FILES FOR ONE PROJECT: what Export as repository zips and Save to the repository commits. */
/** WHO IS ON THIS DEVICE, for the shared project: the identity file's login if one is open, else the login GitHub
 *  confirmed for the unlocked token. Null when neither is known. */
function deviceLogin():string|null{return openIdentity()?.profile.login||currentIdentity(localStorage)?.login||null;}
/** SAID AFTER A SAVE, never a refusal (2026-11-19): the commit already carries the GitHub login; this asks the person to
 *  say who they are in the project, which their name, ORCID iD and signature need. */
function unsaidNotice(project:Project):string{
  const login=deviceLogin();
  const said=login&&(project.members??[]).some(m=>m.login.toLowerCase()===login.toLowerCase()&&m.signature);
  if(said)return '';
  return `<br>${login?`Saved as ${esc(login)}. `:''}This project does not yet say who you are. `
    +`<button type="button" class="text-button" data-goto-people>Under People</button>, choose your project role and press This is me, then save again.`;
}
function wireSharedManual(box:HTMLElement){
  box.querySelector<HTMLButtonElement>('[data-shared-manual]')?.addEventListener('click',()=>openManual('surface:shared-projects','Shared through GitHub',esc));
}
async function projectRepositoryFileMap(project:Project):Promise<Map<string,string>>{
    const saved=readSavedWorkflows();
    const held=project.workflows.filter(key=>Object.hasOwn(saved,key));
    if(!held.length)throw new Error('That project has no saved workflow to save.');
    const workflows:{key:string;document:unknown}[]=[];
    for(const key of held){
      // The OPEN canvas as it stands, the same rule `exportProject` keeps: a practitioner looking
      // at their work would not expect an older copy in the file.
      const source=key===storageKey(workflow)?workflow:validateWorkflow(structuredClone(saved[key]));
      workflows.push({key,document:await workflowDocument(source)});
    }
    // THE AUTHORED NOTES, AND DELIBERATELY NOT THE MACHINED ONES.
    //
    // A quoted or authored note is somebody's writing: it is the project's, it survives a run,
    // and losing it would lose work nobody can regenerate. A machined note is prose this
    // application wrote from a run, stamped with the build that wrote it and dropped on read
    // when the build moves on — committing it would put derived output in a repository and
    // guarantee a conflict on every re-run, for text a clone reproduces by pressing Run.
    //
    // The same rule the layout already applies to payloads: an acquired one is not committed,
    // the declaration that reproduces it is. Found by exporting and counting -- the first
    // version read `entry.notes` off the write-up store, which has no such field, and wrote
    // eleven files where the published conversion has twenty-four.
    const notes:Record<string,unknown>={};
    for(const note of readNotes((project as {notes?:unknown}).notes).notes)
      if(note.id)notes[note.id]=note;
  return repositoryFiles({project:{...project,workflows:held},workflows,notes});
}

/** A PROJECT AS A GIT REPOSITORY, zipped, ready to be committed.
 *
 *  The practitioner, 2026-10-31, on why this is not a side quest: *"it is a selling point of FW,
 *  to decrease friction everywhere in the epidemiologist's workflow, from designing an
 *  investigation, implementing its workflows and managing evidence generation, and
 *  publication."*
 *
 *  The sibling of `exportProject` and deliberately NOT a replacement for it. One file is for
 *  backing a project up and moving it; this is for co-owning one — one workflow per file,
 *  pretty-printed so a diff reads, named for the workflow so a pull request can be reviewed.
 *  Experiment 150 designed and published the layout; until now nothing in the application wrote
 *  it, and the published template had to say so in its own format declaration.
 *
 *  A ZIP RATHER THAN A DIRECTORY, because a browser cannot write one. The practitioner unzips it
 *  into a clone of the template, or into an empty directory and `git init`. Stated in the toast
 *  rather than left to be worked out.
 *
 *  ONE-WAY, AND IT SAYS SO. Reading a repository back is unbuilt, and the format declaration this
 *  writes carries that rather than implying a round trip. */
async function projectRepositoryZip(project:Project):Promise<{blob:Blob;name:string;files:number}>{
    save();
    const files=await projectRepositoryFileMap(project);
    const zip=new ZipWriter(new BlobWriter('application/zip'));
    for(const [path,text] of files)await zip.add(path,new TextReader(text));
    return {blob:await zip.close(),name:`${project.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-repository.zip`,files:files.size};
}
/** EXPORT AS REPOSITORY, ENCRYPTED BY DEFAULT (the export encryption audit); the plain ZIP is the dialog's other button. */
async function sealRepository(id:string){
  if(busy)return;
  const project=readProjects().find(p=>p.id===id);
  if(!project)return;
  const {members,without}=await sealMembers(project);
  openSealDialog({what:`the project ${project.name} as a repository`,identity:openIdentity(),members,membersWithoutKey:without,
    openIdentity:()=>$('#identity-button').click(),
    make:async()=>{const z=await projectRepositoryZip(project);return {bytes:new Uint8Array(await z.blob.arrayBuffer()),name:z.name,mediaType:'application/zip'};},
    plain:()=>exportProjectRepository(id),
    done:name=>toast(`${name}: the repository, encrypted. Whoever opens it gets the ZIP to unzip into a clone of fieldwork-project-template.`)},esc);
}
async function exportProjectRepository(id:string){
  if(busy)return;
  const project=readProjects().find(p=>p.id===id);
  if(!project)return;
  try{
    const {blob,name,files:count}=await projectRepositoryZip(project);
    downloadBlob(name,blob);
    toast(`${count} files. Unzip into a clone of fieldwork-project-template, or into an `
      +`empty directory and \`git init\`. Fieldwork cannot open one back yet.`,{tone:'notice'});
  }catch(error){toast(errorMessage(error),{tone:'failure'});}
}

/** A PROJECT AS ONE FILE. *"Where is the export project button?"* -- 2026-10-21. There was none:
 *  Export and Encrypted ZIP are both workflow-scoped, so four workflows about one province moved
 *  as four unrelated files with nothing recording that they belonged together. */
/** THE PROJECT'S BACKUP FILE, made and not written: the plain backup writes it, and the encrypted one seals it first
 *  (the export encryption audit). */
async function projectBackupFile(project:Project,options:{photos?:boolean}={}):Promise<{blob:Blob;name:string;text:string;held:string[];loose:number}>{
    save();
    const saved=readSavedWorkflows();
    const held=project.workflows.filter(key=>Object.hasOwn(saved,key));
    if(!held.length)throw new Error('That project has no saved workflow to export.');
    const workflows:{key:string;document:unknown}[]=[];
    const validated:Workflow[]=[];
    for(const key of held){
      // The OPEN canvas is exported as it stands, not as it was last written: the practitioner
      // sees it in front of them and would not expect an older copy in the file.
      const source=key===storageKey(workflow)?workflow:validateWorkflow(structuredClone(saved[key]));
      validated.push(source);
      workflows.push({key,document:await workflowDocument(source)});
    }
    // THE PICTURES IN ITS NOTES go in the file with it, by digest; one this device does not hold is left out and said.
    const pictured=readNotes((project as {notes?:unknown}).notes).notes.flatMap(n=>n.kind==='authored'&&n.image?[n.image.sha256]:[]);
    // PINS' PHOTOS go only in an encrypted backup (experiment 09, 2026-11-22): a plain copy names each by digest and caption.
    if(options.photos)for(const w of validated)for(const n of w.nodes)if(n.type==='point_input')
      for(const list of Object.values(n.params.pinPhotos??{}))for(const p of list)pictured.push(p.sha256);
    const images=Object.fromEntries(pictured.flatMap(sha=>{const p=readNoteImagePayload(cachedPayload(noteImageKey(sha)));return p?[[sha,p]]:[];}));
    // A BACKUP CARRIES WHERE THE PROJECT IS SHARED, NOT THIS DEVICE'S HOLD ON IT: the credential, the commit and the
    // digests describe this laptop, and on another one they would point at nothing.
    const shared=project.repository?{repository:Object.fromEntries(Object.entries(project.repository)
      .filter(([k])=>!(DEVICE_REPOSITORY_FIELDS as readonly string[]).includes(k))) as Project['repository']}:{};
    const document=projectDocument({...project,...shared,workflows:held},workflows,images);
    const loose=unbundledReferences(validated);
    // WRITTEN COMPACT, because indentation is paid in the one resource that binds. Measured
    // 2026-10-23 on a million-junction document: 194 MB compact, 517 MB at indent 2 -- 2.66
    // times, and within four per cent of the 536,870,888 characters V8 will hold. The
    // practitioner's own workflow is 472 MB of JSON, which indented would not serialise at all,
    // so the file they most need to back up would be the one they could not write.
    //
    // Gzip removes whitespace from the FILE either way; it cannot remove it from the string that
    // has to exist first. `gunzip | jq .` gives the readability back on demand.
    const text=JSON.stringify(document);
    const name=`${project.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-project.json.gz`;
    return {blob:await gzipText(text),name,text,held,loose};
}
/** Said once a backup is written, plain or encrypted: how many workflows, and any dataset left out by reference. */
function backupWritten(project:Project,held:number,loose:number,sealed?:{name:string;recipients:number}){
    touchProject(project.id,'exportedAt');
    writeProjects(readProjects().map(p=>p.id!==project.id?p:{...p,exportedSealed:!!sealed}));
    // AND SAID, which is a separate act from recording it. Found by the test: the state was written correctly and the
    // header went on reading "Not backed up" until the next save or render. Both surfaces: the Project view repeated the
    // header's mistake once. Every place that states a derived fact has to be told when the fact changes.
    renderProjectSafety();
    if(currentView==='project')renderProjectView();
    toast(`"${project.name}" ${sealed?`backed up encrypted, as ${sealed.name}, for ${sealed.recipients===1?'one key':`${sealed.recipients} keys`}`:'exported'}: ${held} ${held===1?'workflow':'workflows'}.`
      +(loose?` ${loose} downloaded ${loose===1?'dataset is':'datasets are'} kept on this device by reference and `
        +`${loose===1?'is':'are'} not in the file; whoever opens it downloads ${loose===1?'it':'them'} again.`:''),
      {tone:loose?'warning':undefined});
}
/** THE PROJECT'S MEMBERS WHO GAVE A KEY, each checked against their own signature: a key nobody signed is not offered. */
async function sealMembers(project:Project):Promise<{members:SealMember[];without:string[]}>{
  const me=openIdentity()?.sealing?.publicKey;
  const members:SealMember[]=[],without:string[]=[];
  for(const m of project.members??[]){
    if(!m.sealKey){without.push(m.name??m.login);continue;}
    if(m.sealKey===me)continue;
    const verified=!!(m.signature&&m.publicKey&&m.algorithm)&&await verifyStatement(m.algorithm!,m.publicKey!,memberStatement(m),m.signature!);
    members.push({name:m.name??m.login,login:m.login,sealKey:m.sealKey,verified});
  }
  return {members,without};
}
/** WHO A SHARED PROJECT IS SEALED FOR ON GITHUB: the person saving, each member's own signed key, and a key another
 *  member gave for someone who could not yet open the project. Those with neither are named, so the save says who
 *  cannot read it yet. */
async function repositoryRecipients(project:Project,mine:string):Promise<{keys:string[];without:string[]}>{
  const keys=[mine],without:string[]=[];
  for(const m of project.members??[]){
    const signed=m.sealKey&&m.signature&&m.publicKey&&m.algorithm
      &&await verifyStatement(m.algorithm,m.publicKey,memberStatement(m),m.signature)?m.sealKey:undefined;
    const key=signed??m.givenKey;
    if(key)keys.push(key);else without.push(m.name??m.login);
  }
  return {keys:[...new Set(keys)],without};
}
/** A PROJECT BACKED UP ENCRYPTED, the default (the export encryption audit): who can open it, then the sealed file. */
async function sealProject(id:string){
  if(busy)return;
  const project=readProjects().find(p=>p.id===id);
  if(!project)return;
  const {members,without}=await sealMembers(project);
  let made:{held:string[];loose:number}|null=null;
  openSealDialog({what:`the project ${project.name}`,identity:openIdentity(),members,membersWithoutKey:without,
    openIdentity:()=>$('#identity-button').click(),
    make:async()=>{const file=await projectBackupFile(project,{photos:true});made=file;
      return {bytes:new Uint8Array(await file.blob.arrayBuffer()),name:file.name,mediaType:'application/gzip'};},
    plain:()=>exportProject(id),
    done:(name,recipients)=>{if(made)backupWritten(project,made.held.length,made.loose,{name,recipients});}},esc);
}
async function exportProject(id:string){
  if(busy)return;
  const project=readProjects().find(p=>p.id===id);
  if(!project)return;
  try{
    const {blob,name,text,held,loose}=await projectBackupFile(project);
    downloadBlob(name,blob);
    // Recorded here, where the file has been written -- not where the export was asked for.
    toast(`${name} — ${(text.length/1e6).toFixed(1)} MB of project, ${(blob.size/1e6).toFixed(1)} MB written.`);
    backupWritten(project,held.length,loose);
  }catch(error){toast(errorMessage(error),{tone:'failure'});}
}
/** Open one. The project is recreated with a key of its own for every workflow, so importing a
 *  project twice makes two projects rather than overwriting the first. */
async function importProjectDocument(raw:unknown):Promise<string[]>{
  const document=readProjectDocument(raw);
  const existing=readProjects();
  const project=newProject(document.project.name,document.project.subject,allProjects());
  // THE NOTES COME WITH IT. A new project was minted from the name and the subject and nothing
  // else, so an imported investigation arrived without a word of the author it is about: South
  // London ships nine of Snow's own sentences and a reader who opened the example got none of
  // them. Found by the notes spike on 2026-10-29, which is what a spike is for.
  //
  // Read tolerantly on the way in, like every other note: one that cannot be read is dropped
  // rather than coerced under a heading its author did not choose.
  const carried=readNotes((document.project as {notes?:unknown}).notes).notes;
  if(carried.length)project.notes=carried;
  // THEIR PICTURES, kept before the notes that point at them, and only where the bytes are the digest they claim.
  for(const [sha,raw] of Object.entries(document.images??{})){
    const payload=readNoteImagePayload(raw);
    if(payload&&await noteImageDigest(payload)===sha)await keepDataset(noteImageKey(sha),payload);
  }
  // AND THE AUTHORS COME WITH IT, for the same reason and by the same omission. `newProject` mints
  // from the name and the subject, so a downloaded investigation arrived crediting nobody -- and a
  // project whose notes name an author it does not list is a publication with an unlisted author.
  //
  // Found 2026-10-29 while planning the collaborative pilot, whose first step the practitioner
  // named as "tracking identity in downloaded projects": this is what that step found. Read
  // tolerantly, so an identity that cannot be read is dropped rather than half carried.
  //
  // What is deliberately NOT done here: the person importing is not added. Opening somebody's
  // project does not make you an author of it, and an application that quietly appended the
  // importer would manufacture authorship on a publication.
  const authors=readAuthors((document.project as {authors?:unknown}).authors);
  if(authors.length)project.authors=authors;
  // WHERE IT IS SHARED COMES WITH IT, and nothing of the device that backed it up: the token is chosen again here.
  const shared=readRepository((document.project as {repository?:unknown}).repository);
  if(shared)project.repository={owner:shared.owner,repo:shared.repo,attachedAt:shared.attachedAt,...(shared.sealed?{sealed:true}:{})};
  // IMPORTED INTO A SHARED REPOSITORY (2026-11-16): Open shared GitHub project, Import project from backup. Taken once,
  // and only within two minutes of the press, so a picker closed without a file does not share a later import.
  if(pendingShare&&Date.now()-pendingShare.at<120_000)project.repository=pendingShare.repository;
  pendingShare=null;
  const members=readMembers((document.project as {members?:unknown}).members);
  if(members.length)project.members=members;
  const keys:string[]=[];
  const workflows:Workflow[]=[];
  for(const entry of document.workflows){
    const next=await importWorkflowDocument(entry.document,validateWorkflow);
    const key=mintWorkflowKey(project.id,[...existing,{...project,workflows:keys}]);
    keys.push(key);
    workflows.push({...next,projectId:project.id,workflowKey:key,exampleId:undefined});
  }
  project.workflows=keys;
  if(!writeProjects([...existing,project]))throw new Error('The project could not be recorded on this device.');
  // Every workflow is written before any is opened, so a refusal half way through does not leave a
  // project claiming workflows that were never saved.
  // THE DATA GOES WHERE DATA GOES, which is not the workspace store. This dehydrated against
  // `()=>false` -- "no digest is held" -- so nothing was stripped and every downloaded network and
  // raster window was written inline into localStorage, whose ceiling is about 5 MB. A project
  // carrying any real data therefore could not be imported at all, however empty the store was:
  // the practitioner's refusal read "the workspace store is full" over a store holding 419 KB of
  // 5.2 MB, because the write that failed was oversized rather than the room being short.
  //
  // `save()` has always done this correctly -- payloads to the payload store by digest, references
  // in the workspace store -- and the import simply never did. Keeping them first also means a
  // reload rehydrates them, which is the defect the encrypted-project round trip found when an
  // imported project's reference pointed at nothing.
  const kept=new Set<string>();
  for(const next of workflows)
    for(const node of next.nodes){
      for(const [ref,payload] of payloadsOf(node.params as unknown as Record<string,unknown>))
        if(await keepDataset(ref,payload))kept.add(ref);
    }
  try{
    const store=JSON.parse(localStorage.getItem(WORKSPACES)||'{}');
    for(const next of workflows)store[storageKey(next)]=dehydrateWorkflow(next,digest=>kept.has(digest));
    localStorage.setItem(WORKSPACES,JSON.stringify(store));
    forgetSavedWorkflows();
  }catch(error){
    writeProjects(readProjects().filter(p=>p.id!==project.id));
    // WHY, FROM THE ERROR IN HAND. This read `saveFailureMessage(...)`, which reports the last
    // refusal recorded by `save()` -- and this write does not go through `save()`, so there was
    // never one to report and the sentence arrived bare. The practitioner, 2026-10-23, importing
    // a project: the toast said it could not be saved and nothing about what stopped it.
    // SAY THE NUMBERS. "The workspace store is full" was said over a store holding 419 KB of
    // 5.2 MB: the room was not short, the write was too big. A refusal that names a cause it has
    // not measured is the fault this project already fixed once, in a storage handler that
    // asserted a full disk and discarded the error it had.
    const name=error instanceof Error?error.name:String(error);
    const quota=/quota|exceed|full/i.test(name);
    const mb=(value:number)=>value<1e6?`${Math.max(1,Math.round(value/1024)).toLocaleString('en')} KB`
      :`${(value/1e6).toFixed(1)} MB`;
    const needed=workflows.reduce((n,w)=>{
      try{return n+JSON.stringify(dehydrateWorkflow(w,digest=>kept.has(digest))).length;}catch{return n;}},0);
    const free=Math.max(0,STORAGE_QUOTA_BYTES-storageUsedBytes());
    throw new Error(`"${project.name}" could not be saved on this device, so it was not imported. `
      +(quota?`It needs about ${mb(needed)} in the workspace store and ${mb(free)} is free of `
        +`${mb(STORAGE_QUOTA_BYTES)}. Back up and delete a workflow or a project you no longer need, `
        +'then import again -- the file is unchanged.'
        :`The device reported ${name}.`));
  }
  workflow=workflows[0];
  selected=null;result=null;runWorkflow=null;activeOutputId=null;history=[];future=[];statuses={};dirty=true;
  save();renderProjectOptions();renderLibrary();renderResults();render();switchView('workflow');
  toast(`"${project.name}" imported with ${keys.length} ${keys.length===1?'workflow':'workflows'}.`);
  return keys;
}

/** Move the current workflow into a project, or out of every project.
 *
 *  Minting a key is what makes membership possible at all: the workspace map was keyed by a closed
 *  vocabulary of example ids, so a workflow saved under `blank` would be overwritten by the next
 *  blank canvas. On joining a project it gets a key of its own, and keeps it on leaving -- the old
 *  `blank` entry is cleared so the two do not both claim to be this workflow. */
function assignCurrentWorkflow(projectId:string){
  if(busy)return;
  const stored=readProjects(),previousKey=storageKey(workflow);
  if(projectId&&!stored.some(p=>p.id===projectId))return;
  for(const project of stored)project.workflows=project.workflows.filter(k=>k!==previousKey);
  let key=workflow.workflowKey;
  if(projectId&&!key){
    const taken=new Set([...stored.flatMap(p=>p.workflows)]);
    for(let n=1;!key||taken.has(key);n++)key=`${projectId}/w${n}`;
  }
  const target=stored.find(p=>p.id===projectId);
  if(target&&key)target.workflows=[...target.workflows,key];
  if(!writeProjects(stored))return;
  if(key&&key!==previousKey&&isExampleKey(previousKey))
    try{const saved=JSON.parse(localStorage.getItem(WORKSPACES)||'{}');delete saved[previousKey];localStorage.setItem(WORKSPACES,JSON.stringify(saved));forgetSavedWorkflows();}
    catch{/* the stale entry is harmless; the minted key is what this workflow is saved under now */}
  workflow.projectId=projectId||undefined;
  workflow.workflowKey=key;
  if(projectId)workflow.exampleId=undefined;
  dirty=true;save();renderProjectOptions();render();
  toast(target?`This workflow is now in "${target.name}".`:'This workflow is in no project.');
}
$('#new-project').onclick=openProjectDialog;
$('#add-workflow').onclick=()=>addWorkflowToProject();
$('#delete-workflow').onclick=deleteCurrentWorkflow;
// TWO WAYS IN, AND ONE OF THEM LOOKS LIKE A BUTTON. The practitioner went looking for the
// project export with Chrome refusing to load the application and their workflows unbacked up,
// and found it behind the storage readout in the header: *"That is where I least expect it."*
// It was the only way in. A readout reads as a status, not as the door to everything saved on
// this device, and the one time it matters most is the time nobody is hunting for it.
// THE PILL IS A READOUT, NOT A DOOR. It opened the projects dialog, which is how the project
// level came to be reachable only by recognising a storage figure as a button -- the fault
// experiment 131 exists to end. What it was a door to is the Project tab, which has its own.
$('#storage-status').onclick=()=>{switchView('project');showProjectTab('this',false);$('#project-storage').scrollIntoView({block:'nearest'});};
$('#storage-meter').addEventListener('click',async event=>{
  if((event.target as HTMLElement).id!=='drop-unreferenced')return;
  const loose=unreferencedPayloads();
  if(!loose.digests.length)return;
  if(!confirm(`Remove ${loose.digests.length} payload${loose.digests.length===1?'':'s'} that no workflow refers to, freeing about ${(loose.bytes/1e6).toFixed(1)} MB? This cannot be undone.`))return;
  for(const digest of loose.digests)await dropPayload(digest);
  renderStorageStatus();if(currentView==='project')renderProjectView();
  toast(`${loose.digests.length} unreferenced payload${loose.digests.length===1?'':'s'} removed.`);
});
// One listener on the list, because its rows are rebuilt on every change inside the dialog.
// ONE HANDLER, TWO LISTS. These actions were delegated on the dialog's list alone, so the same
// buttons rendered in the Project view did nothing at all -- found by the test that pressed Back
// up there and waited for a download that never came. A view that offers a control which is not
// wired is worse than one that offers none: it reads as capability.
const projectListAction=async(event:Event)=>{
  const button=(event.target as HTMLElement).closest('button');
  if(!button)return;
  const {openWorkflow,exportWorkflow,deleteWorkflow:removeKey,deleteProject:removeProject}=button.dataset;
  if(openWorkflow){loadExample(openWorkflow);return;}
  if(removeProject){deleteProject(removeProject);return;}
  if(button.dataset.sealProject){await sealProject(button.dataset.sealProject);return;}
  if(button.dataset.exportProject){await exportProject(button.dataset.exportProject);return;}
  if(button.dataset.exportRepository){
    await sealRepository(button.dataset.exportRepository);return;}
  if(removeKey){deleteWorkflow(removeKey);renderStorageStatus();
    if(currentView==='project')renderProjectView();return;}
  if(exportWorkflow){
    try{
      const saved=readSavedWorkflows()[exportWorkflow];
      if(!saved)throw new Error('There is nothing saved under that workflow.');
      const exported=await workflowDocument(validateWorkflow(structuredClone(saved)));
      const name=((saved as {name?:string}).name||exportWorkflow).replace(/[^a-z0-9]+/gi,'-').toLowerCase();
      download(`${name}.json`,JSON.stringify(exported,null,2));
      toast(`"${(saved as {name?:string}).name||exportWorkflow}" exported to a file. A workflow in a file is not at risk from a full store.`);
    }catch(error){toast(errorMessage(error),{tone:'failure'});}
  }
};
$('#project-view-list').addEventListener('click',projectListAction);
// The unfiled rows carry the same data attributes, so they are served by the same handler --
// one act, one implementation, whichever list it was pressed in.
$('#project-unfiled-rows').addEventListener('click',projectListAction);
$('#workflow-template').onchange=e=>{
  const select=control(e) as HTMLSelectElement,source=select.value;
  select.value='';
  if(source)addWorkflowFromTemplate(source);
};
// The two titles are controls, and say so: a pointer, a tooltip, and a keyboard route in.
// The project's name is edited in the Project tab now, so the only in-place rename left is the
// workflow's own title.
for(const [id,label,run] of [['#project-title','Rename this workflow',renameWorkflowInPlace]] as const){
  const element=$(id);
  element.dataset.renameLabel=label;element.title=label+' \u2014 click to edit';
  element.tabIndex=0;element.setAttribute('role','button');
  // Events from the input this opens BUBBLE back to the title. Without this guard, Enter inside
  // the editor reopened the editor: the first Enter applied the name, the render redrew the
  // heading, and the same keystroke arriving here replaced it with a fresh input -- so the title
  // looked empty and the rename appeared not to have happened, although it had been saved.
  const fromEditor=(event:Event)=>(event.target as HTMLElement|null)?.classList.contains('inline-rename');
  element.addEventListener('click',event=>{if(!fromEditor(event))run();});
  element.addEventListener('keydown',event=>{
    if(fromEditor(event))return;
    const key=(event as KeyboardEvent).key;
    if(key==='Enter'||key===' '){event.preventDefault();run();}
  });
}
$('#project-apply').onclick=applyProjectDetails;
$('#project-delete').onclick=deleteCurrentProject;
// Enter in any of the detail fields applies them, which is what Enter means in a form.
for(const id of ['#project-name-edit','#project-subject-edit','#workflow-name-edit'])
  $(id).addEventListener('keydown',event=>{if((event as KeyboardEvent).key==='Enter'){event.preventDefault();applyProjectDetails();}});
$('#blank-project').onclick=openProjectDialog;
$('#project-create').onclick=()=>void createProjectFromDialog();
$('#new-workflow').onclick=()=>{if(busy)return;loadExample('blank');change(w=>{replaceWorkflow(w,blankWorkflow());selected=null;});result=null;runWorkflow=null;activeOutputId=null;renderResults();render();switchView('workflow');};
$('#result-search').oninput=e=>{if(activeOutput()?.pointTable){tablePage=0;renderPointTable();return;}$('#result-rows').querySelectorAll('tr').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(control(e).value.toLowerCase()));};
const libraryToggle=$('#toggle-library'),library=$('.library');
library.id='layout-library';
libraryToggle.onclick=()=>{const collapsed=$('.studio').classList.toggle('library-collapsed');libraryToggle.textContent=collapsed?'Show widget library':'Hide widget library';libraryToggle.setAttribute('aria-expanded',String(!collapsed));};
/** ONE FULL-SCREEN CONTROL, because there is one view on screen. There were two -- fill the
 *  screen with the workbench, fill it with the results -- which made sense while both were on
 *  screen at once and the question was which half won. With the tab, the second was a button
 *  beside another button with the same word on it: *"the second screenshot has 2 full screen
 *  buttons but only one is useful"*, 2026-10-21. This one puts whatever the tab is showing into
 *  the screen, and Escape takes it back. */
let fullScreen=false;
function setFullScreen(on:boolean){
  fullScreen=on;
  const showingResults=$('.work-area').classList.contains('showing-results');
  document.body.classList.toggle('focus-workbench',on&&!showingResults);
  document.body.classList.toggle('focus-results',on&&showingResults);
  const button=$('#fullscreen-workbench');
  button.setAttribute('aria-pressed',String(on));
  button.textContent=on?'Exit full screen':'Full screen';
  if(on&&!showingResults)requestAnimationFrame(()=>flow?.fit());
}
$('#fullscreen-workbench').onclick=()=>setFullScreen(!fullScreen);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&fullScreen){setFullScreen(false);event.preventDefault();}});
installIdentity(document.querySelector<HTMLButtonElement>('#identity-button')!,esc);
credentials=installCredentials(document.querySelector<HTMLButtonElement>('#credentials-button')!,
  // The token is handed over, used once and not kept here. What is kept is the NAME it resolved
  // to, which is not a secret -- so it survives a reload, where the credential deliberately does
  // not. See `attestIdentity` for why this costs no additional grant on the token.
  async token=>{
    const who=await attestIdentity(token);
    if(!setCurrentIdentity(who,localStorage))
      throw new Error(`GitHub confirmed ${authorLabel(who)}, but this device could not store it, `
        +'so projects you create will not carry the name.');
    return authorLabel(who);
  });
// BASEMAP KEYS (experiment 222): a CARTO or Esri key is read from the unlocked credentials when a map draws its style,
// by provider and the origin the manual gives; nothing is kept here, and a locked file answers nothing.
useBasemapKeys(provider=>{
  if(!credentials?.unlocked)return null;
  const ref=credentials.references().find(r=>r.provider===provider);
  return ref?credentials.resolve(ref.ref,provider,KEY_ORIGINS[provider]):null;
});

// A PROJECT SHARED THROUGH ITS REPOSITORY (experiment 150, 2026-11-16). The project here is a working copy and the
// repository is the record: saving here stays automatic, saving there is a press, one commit, never forced. What this
// device holds about the repository (which credential, the commit last read or saved, each file's digest then, when
// Discussions were last looked at) stays on this device; a backup carries only the repository's name.
/** REPOSITORIES USED HERE (2026-11-16), so a name is not retyped: the practitioner, "Should FW keep a record of past
 *  entries so I do not have to retype the GitHub project?" Remembered once a check of it succeeds, with the credential's
 *  reference and never the token; five at most, the latest first; on this device only. */
const RECENT_REPOSITORIES='fieldwork-recent-repositories-v1';
function recentRepositories():{repository:string;credential?:string}[]{
  try{const raw=JSON.parse(localStorage.getItem(RECENT_REPOSITORIES)||'[]');
    return Array.isArray(raw)?raw.filter((r):r is {repository:string;credential?:string}=>!!r&&typeof r.repository==='string'&&!!repositoryName(r.repository)).slice(0,5):[];}
  catch{return [];}}
function rememberRepository(repository:string,credential?:string){
  try{localStorage.setItem(RECENT_REPOSITORIES,JSON.stringify([{repository,...(credential?{credential}:{})},
    ...recentRepositories().filter(r=>r.repository.toLowerCase()!==repository.toLowerCase())].slice(0,5)));}catch{/* kept for this visit only */}}
function forgetRepository(repository:string){
  try{localStorage.setItem(RECENT_REPOSITORIES,JSON.stringify(recentRepositories().filter(r=>r.repository!==repository)));}catch{/* nothing kept */}}
/** The remembered repositories as a list beside the field: choosing one fills `input` and the token it was used with. A
 *  list rather than buttons (the practitioner, 2026-11-16), like the token list beneath it, and one line however many. */
function drawRecentRepositories(box:HTMLElement,input:HTMLInputElement,pick:HTMLSelectElement){
  const recent=recentRepositories();
  if(!recent.length){box.innerHTML='';return;}
  const id=`${input.id}-recent`;
  box.innerHTML=`<label class="field-label" for="${id}">Used here before</label><div class="lookup-row recent-repositories">`
    +`<select id="${id}"><option value="">Choose one, or type a new one below</option>${recent.map((r,i)=>`<option value="${i}">${esc(r.repository)}</option>`).join('')}</select>`
    +`<button type="button" class="button small" data-forget>Forget it</button></div>`;
  const list=box.querySelector('select')!;
  list.onchange=()=>{const r=recent[Number(list.value)];if(!r)return;
    input.value=r.repository;if(r.credential&&[...pick.options].some(o=>o.value===r.credential))pick.value=r.credential;};
  box.querySelector<HTMLButtonElement>('[data-forget]')!.onclick=()=>{const r=recent[Number(list.value)];if(!r)return;
    forgetRepository(r.repository);if(input.value===r.repository)input.value='';drawRecentRepositories(box,input,pick);};
}
function githubRefs(){return (credentials?.unlocked?credentials.references():[]).filter(r=>r.provider==='github');}
function credentialOptions(chosen?:string){const refs=githubRefs();
  return refs.length?refs.map(r=>`<option value="${esc(r.ref)}"${r.ref===chosen?' selected':''}>${esc(r.label)}</option>`).join('')
    :'<option value="">None unlocked: open Credentials</option>';}
function tokenFor(ref:string|undefined){if(!ref)throw new Error('Unlock your credentials first, with a GitHub token for this repository.');
  try{return credentials!.resolve(ref,'github',GITHUB_API);}
  catch{throw new Error('Unlock your credentials first, with a GitHub token for this repository whose Allowed HTTPS origin is https://api.github.com.');}}
function repositoryOf(project:Project){return project.repository?`${project.repository.owner}/${project.repository.repo}`:'';}
function updateRepository(id:string,patch:Partial<NonNullable<Project['repository']>>|null){
  writeProjects(readProjects().map(p=>p.id!==id?p:patch===null?(({repository:_r,...rest})=>rest)(p) as Project
    :{...p,repository:{...p.repository!,...patch}}));}
/** What this device would save now, against what it last read or saved. */
async function localChanges(project:Project):Promise<{files:Map<string,string>;changed:string[]}>{
  const files=await projectRepositoryFileMap(project);
  return {files,changed:changedPaths(project.repository?.files??{},await fileDigests(files))};}
function describeChanges(changed:string[]){
  const workflows=changed.filter(p=>p.startsWith('workflows/')).length,notes=changed.filter(p=>p.startsWith('notes/')).length;
  const parts=[workflows&&`${workflows} workflow${workflows===1?'':'s'}`,notes&&`${notes} note${notes===1?'':'s'}`,
    changed.includes('project.json')&&'the project\'s details'].filter(Boolean);
  return parts.length?parts.join(', '):'nothing';}
/** Opened, or got again: the repository's project made into a project here, by the importer a backup uses. */
async function openSharedProject(repository:string,credential:string,replacing?:Project):Promise<void>{
  const token=tokenFor(credential);
  const {commit,files:held}=await readProjectAt(repository,token);
  // SEALED FILES OPENED WITH THIS PERSON'S IDENTITY; everything after works on the plain text.
  const sealed=holdsSealed(held.keys()),files=await openRepositoryFiles(held,openIdentity()?.sealing);
  const keys=await importProjectDocument(projectDocumentFromFiles(files));
  const made=readProjects().find(p=>p.workflows.includes(keys[0]));
  if(!made)throw new Error('The project was read and could not be recorded on this device.');
  if(replacing)removeProjectQuietly(replacing.id);
  const [owner,repo]=repository.split('/');
  const now=new Date().toISOString();
  writeProjects(readProjects().map(p=>p.id!==made.id?p:{...p,repository:{owner,repo,attachedAt:replacing?.repository?.attachedAt??now,
    credential,commit,syncedAt:now,...(replacing?.repository?.seenAt?{seenAt:replacing.repository.seenAt}:{}),
    ...(sealed?{sealed:true}:{}),form:sealed?'sealed':'plain'}}));
  const fresh=readProjects().find(p=>p.id===made.id)!;
  updateRepository(made.id,{files:await fileDigests(await projectRepositoryFileMap(fresh)),remote:await fileDigests(files)});
  renderProjectOptions();renderProjectDetails();
}
/** The repository's latest, merged with this device's project (`mergeLatest`), made into the project here. */
async function getLatest(current:Project,credential:string):Promise<Merge>{
  const token=tokenFor(credential),repository=repositoryOf(current);
  const {commit,files:held}=await readProjectAt(repository,token);
  const form=holdsSealed(held.keys())?'sealed' as const:'plain' as const,github=await openRepositoryFiles(held,openIdentity()?.sealing);
  const here=await projectRepositoryFileMap(current);
  const merge=await mergeLatest(current.repository?.files??{},current.repository?.remote??{},here,github,async path=>{
    const what=path.replace(/^workflows\/|^notes\/|\.json$/g,'');
    return confirm(`"${what}" was changed here and on GitHub since you last got the latest.\n\n`
      +'OK keeps the version here (save it afterwards). Cancel takes the version on GitHub.')?'here':'github';});
  const keys=await importProjectDocument(projectDocumentFromFiles(merge.files));
  const made=readProjects().find(p=>p.workflows.includes(keys[0]));
  if(!made)throw new Error('The project was read and could not be recorded on this device.');
  removeProjectQuietly(current.id);
  const now=new Date().toISOString();
  writeProjects(readProjects().map(p=>p.id!==made.id?p:{...p,repository:{owner:current.repository!.owner,repo:current.repository!.repo,
    attachedAt:current.repository!.attachedAt,credential,commit,syncedAt:now,...(current.repository?.seenAt?{seenAt:current.repository.seenAt}:{}),
    ...(current.repository?.sealed?{sealed:true}:{}),form,...(current.repository?.sealedFor?{sealedFor:current.repository.sealedFor}:{})}}));
  // WHAT WAS KEPT FROM HERE STAYS "CHANGED HERE": its baseline is GitHub's version, or none, so the next save sends it.
  const fresh=readProjects().find(p=>p.id===made.id)!;
  const baseline=await fileDigests(await projectRepositoryFileMap(fresh)),theirs=await fileDigests(github);
  for(const path of merge.keptHere){if(theirs[path])baseline[path]=theirs[path];else delete baseline[path];}
  updateRepository(made.id,{files:baseline,remote:theirs});
  renderProjectOptions();renderProjectDetails();
  return merge;
}
/** A project and its workflows removed without asking: used only where the same project has just been read again. */
function removeProjectQuietly(id:string){
  const project=readProjects().find(p=>p.id===id);if(!project)return;
  const keys=project.workflows.filter(k=>!isExampleKey(k));
  try{const raw=JSON.parse(localStorage.getItem(WORKSPACES)||'{}') as Record<string,unknown>;
    for(const key of keys)delete raw[key];localStorage.setItem(WORKSPACES,JSON.stringify(raw));forgetSavedWorkflows();}catch{/* the record goes either way */}
  forgetOrigins(keys);writeProjects(readProjects().filter(p=>p.id!==id));
}
function renderSharedProject(project:Project|undefined,builtIn:boolean){
  const box=$('#project-shared');
  if(!project||builtIn){box.hidden=true;sharedSignature='';return;}
  box.hidden=false;
  // NOT ON EVERY EDIT: `render` calls this at each keystroke, and rebuilding would wipe what is being typed and
  // re-read every workflow. Rebuilt when the Project view opens, or when the share itself changes.
  const signature=`${project.id}|${JSON.stringify(project.repository??null)}|${credentials?.unlocked?1:0}`;
  if($('#project-view').hidden||signature===sharedSignature)return;
  sharedSignature=signature;
  const repository=repositoryOf(project);
  if(!repository){
    box.innerHTML=`<h3 id="project-shared-title">Shared through GitHub</h3>`+`<p><button type="button" class="text-button manual-button" data-shared-manual><span aria-hidden="true">\u25a4</span> Read the manual for Shared through GitHub</button></p>`
      +`<p class="muted">Not shared. To share it, make a repository from the project template, and a token for it in Credentials.</p>`
      +`<div id="share-recent"></div><label class="field-label" for="share-name">Repository</label><input id="share-name" maxlength="200" autocomplete="off" spellcheck="false">`
      +`<label class="field-label" for="share-credential">GitHub token</label><select id="share-credential">${credentialOptions()}</select>`
      +`<button id="share-send" class="button" type="button">Share through this repository</button><p id="share-result" class="repo-check-result" aria-live="polite"></p>`;
    wireSharedManual(box);
    const pick=$('#share-credential') as HTMLSelectElement;pick.addEventListener('focus',()=>{pick.innerHTML=credentialOptions(pick.value);});
    drawRecentRepositories($('#share-recent'),$('#share-name') as HTMLInputElement,pick);
    ($('#share-send') as HTMLButtonElement).onclick=async()=>{
      const out=$('#share-result'),name=repositoryName(($('#share-name') as HTMLInputElement).value);
      if(!name){out.textContent='Enter the repository as owner/name.';return;}
      try{const token=tokenFor(pick.value);out.textContent=`Reading ${name}…`;
        const check=await checkRepository(name,token);const line=(key:string)=>check.lines.find(l=>l.key===key);
        const refusal=line('token')?.state==='no'?line('token')!.text:line('found')?.state!=='yes'?line('found')?.text
          :line('layout')?.state!=='yes'?line('layout')?.text:/^Your role here is (Read|Triage)/.test(line('role')?.text??'')?line('role')!.text
          :/no name yet/.test(line('project')?.text??'')?null:`It already holds a project (${line('project')?.text??''}). Open it from New project instead, so neither is lost.`;
        if(refusal){out.innerHTML=`<strong>No.</strong> ${esc(refusal)}`;return;}
        const [owner,repo]=name.split('/');
        rememberRepository(name,pick.value);
        // ENCRYPTED ON GITHUB BY DEFAULT (the export encryption audit, 2026-11-21); open is the panel's switch.
        writeProjects(readProjects().map(p=>p.id!==project.id?p:{...p,repository:{owner,repo,attachedAt:new Date().toISOString(),credential:pick.value,sealed:true}}));
        renderProjectOptions();renderProjectDetails();}
      catch(e){out.innerHTML=`<strong>No.</strong> ${esc(errorMessage(e))}`;}};
    return;
  }
  const r=project.repository!;
  box.innerHTML=`<h3 id="project-shared-title">Shared through GitHub</h3>`+`<p><button type="button" class="text-button manual-button" data-shared-manual><span aria-hidden="true">\u25a4</span> Read the manual for Shared through GitHub</button></p>`
    +`<p>Shared with <a href="https://github.com/${esc(repository)}" target="_blank" rel="noopener">${esc(repository)}</a>.`
    +` ${r.syncedAt?`Last read or saved here ${esc(new Date(r.syncedAt).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'}))}.`:'Not yet saved to it.'}</p>`
    +`<ul id="shared-state" class="repo-check-result" aria-live="polite"></ul>`
    +`<label class="field-label" for="shared-credential">GitHub token</label><select id="shared-credential">${credentialOptions(r.credential)}</select>`
    +`<p class="shared-sealed"><label><input type="checkbox" id="shared-sealed"${r.sealed?' checked':''}> <strong>Encrypted on GitHub</strong>: only members with a key can read the project's files; GitHub's pages cannot show them.</label>`
    +` <span class="muted" id="shared-sealed-said">${r.sealed?'':'Open: anyone who can see the repository can read its files, as a worked example should be.'}</span></p>`
    +`<label class="field-label" for="shared-message">What this save is</label><input id="shared-message" maxlength="200">`
    +`<div class="project-detail-actions"><button id="shared-save" class="button" type="button">Save to the repository</button>`
    +`<button id="shared-latest" class="button" type="button">Get the latest</button>`
    +`<button id="shared-check" class="button" type="button">Check GitHub</button></div>`
    +`<p id="shared-result" class="repo-check-result" aria-live="polite"></p>`
    +`<h4>People</h4><div id="shared-people"></div>`
    +`<h4>Discussions</h4><div id="shared-discussions" class="shared-discussions"><p class="muted">Press Check GitHub to see them.</p></div>`
    +`<form id="shared-post" class="repo-post" hidden><h4>Start a discussion</h4>`
    +`<label class="field-label" for="shared-post-category">Category</label><select id="shared-post-category"></select>`
    +`<label class="field-label" for="shared-post-title">Title</label><input id="shared-post-title" maxlength="200">`
    +`<label class="field-label" for="shared-post-body">Message</label><textarea id="shared-post-body" rows="4" spellcheck="true"></textarea>`
    +`<button id="shared-post-send" class="button" type="submit">Post to Discussions</button><p id="shared-post-result" class="repo-check-result" aria-live="polite"></p></form>`
    +`<p><button id="shared-stop" class="button small" type="button">Stop sharing on this device</button></p>`;
  wireSharedManual(box);
  const pick=$('#shared-credential') as HTMLSelectElement,out=$('#shared-result'),state=$('#shared-state');
  pick.addEventListener('focus',()=>{pick.innerHTML=credentialOptions(pick.value||r.credential);});
  pick.onchange=()=>{if(pick.value)updateRepository(project.id,{credential:pick.value});};
  const line=(kind:string,text:string)=>`<li class="is-${kind}"><strong>${kind==='yes'?'Yes':kind==='no'?'No':'Not checked'}.</strong> ${esc(text)}</li>`;
  const refresh=async(remote:boolean)=>{
    const current=readProjects().find(p=>p.id===project.id);if(!current?.repository)return;
    const lines:string[]=[];
    try{const {changed}=await localChanges(current);
      lines.push(changed.length?line('no',`Changed here since last read or saved: ${describeChanges(changed)}.`):line('yes','Nothing changed here since last read or saved.'));}
    catch(e){lines.push(line('no',errorMessage(e)));}
    // ENCRYPTED OR OPEN ON GITHUB, as last saved here (the export encryption audit).
    const r=current.repository;
    if(r.form)lines.push(r.form==='sealed'?line('yes','Encrypted on GitHub: only members with a key can read the project\'s files.')
      :line(r.sealed?'no':'unknown',r.sealed?'Open on GitHub until the next save, which encrypts it.':'Open on GitHub: anyone who can see the repository can read the project\'s files.'));
    if(remote){
      try{const token=tokenFor(pick.value||current.repository.credential);
        const head=await headCommit(repository,token);
        lines.push(head.sha===current.repository.commit?line('yes','GitHub has nothing newer.')
          :current.repository.commit?line('no','Someone saved to GitHub since. Get the latest before saving.')
          :line('unknown','This project has not been saved to the repository yet.'));
        const talk=await recentDiscussions(repository,token,current.repository.seenAt);
        $('#shared-discussions').innerHTML=`<p>${talk.total} discussion${talk.total===1?'':'s'}`
          +`${current.repository.seenAt?`, ${talk.fresh} changed since you last looked`:''}. `
          +`<a id="shared-discussions-open" href="https://github.com/${esc(repository)}/discussions" target="_blank" rel="noopener">Open on GitHub</a></p>`
          +(talk.items.length?`<ul class="shared-discussion-list">${talk.items.slice(0,5).map(d=>`<li${d.isNew?' class="is-new"':''}>`
            +`<span class="category">${esc(d.category)}</span> <a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.title)}</a>`
            +` <span class="muted">${esc(d.author)}, ${esc(new Date(d.updatedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'}))}`
            +`, ${d.replies} repl${d.replies===1?'y':'ies'}${d.isNew?', new':''}</span></li>`).join('')}</ul>`:'');
        const seen=()=>updateRepository(project.id,{seenAt:new Date().toISOString()});
        $('#shared-discussions').querySelectorAll('a').forEach(a=>a.addEventListener('click',seen));
        try{const targets=await discussionTargets(repository,token);postTarget=targets.repositoryId;
          // The category chosen is kept when the list is drawn again: a refresh reset it, and a post went to the wrong one.
          const categoryList=$('#shared-post-category') as HTMLSelectElement,chosen=categoryList.value;
          categoryList.innerHTML=targets.categories.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
          if(targets.categories.some(c=>c.id===chosen))categoryList.value=chosen;
          $('#shared-post').hidden=!targets.categories.length;}
        catch{$('#shared-post').hidden=true;}
        try{collaborators=await listCollaborators(repository,token);peopleNote='';}
        catch(e){collaborators=null;peopleNote=errorMessage(e);}
        remoteChecked={project:project.id,at:Date.now()};}
      catch(e){lines.push(line('unknown',`GitHub not read: ${errorMessage(e)}`));}
    }
    state.innerHTML=lines.join('');
    void renderPeople();};
  // PEOPLE (fw:ProjectMembership): everyone GitHub lists and everyone the project names, each with their repository role
  // and project role. The project role is given here and saved with the project; who a member is, they give themselves.
  let collaborators:{login:string;role:string}[]|null=null,peopleNote='Press Check GitHub to see who has access.';
  const renderPeople=async()=>{
    const current=readProjects().find(p=>p.id===project.id);if(!current)return;
    const members=current.members??[];const myLogin=deviceLogin();
    const logins=[...new Set([...(collaborators??[]).map(c=>c.login),...members.map(m=>m.login)])];
    const rows:string[]=[];
    for(const login of logins){
      const member=members.find(m=>m.login.toLowerCase()===login.toLowerCase());
      const repo=collaborators?.find(c=>c.login.toLowerCase()===login.toLowerCase())?.role as RepositoryRole|undefined;
      const known=repo&&(REPOSITORY_ROLES as readonly string[]).includes(repo)?repo:undefined;
      const verified=member?.signature&&member.publicKey&&member.algorithm
        ?await verifyStatement(member.algorithm,member.publicKey,memberStatement(member),member.signature):false;
      const who=member?.name?`${esc(member.name)}${member.orcid?` · ORCID <a href="https://orcid.org/${esc(member.orcid)}" target="_blank" rel="noopener">${esc(member.orcid)}</a>`:''}`
        +(member.affiliations??[]).map(a=>` · ${affiliationLabel(a,esc)}`).join('')+`${verified?' · signed by them':' · not signed'}`
        :'<span class="muted">Has not said who they are yet.</span>';
      const shortfall=member&&collaborators?roleShortfall(member.role,known):null;
      // THEIR KEY FOR AN ENCRYPTED PROJECT: their own, signed; or one another member pasted for them, said as such.
      const keyLine=!current.repository?.sealed||!member?'':member.sealKey?' · <span class="is-yes">can read it encrypted</span>'
        :member.givenKey?` · <span class="muted">can read it encrypted, with a key given by ${esc(member.givenBy??'another member')}</span>`
        :`<br><span class="muted">Cannot read the encrypted project yet. Paste their key (they find it under Identity → Your key for encrypted files):</span>`
          +` <input class="member-key" data-member-key="${esc(login)}" placeholder="fwkey1:…" spellcheck="false" aria-label="Key for ${esc(login)}"> <button type="button" class="button small" data-member-key-add="${esc(login)}">Add</button>`;
      const options=`<option value="">Not in the project</option>`+PROJECT_ROLES.map(r=>`<option value="${r}"${member?.role===r?' selected':''}>${PROJECT_ROLE_LABEL[r]}</option>`).join('');
      const proposal=!member&&known?` <span class="muted">(${PROJECT_ROLE_LABEL[proposedProjectRole(known)]} would fit)</span>`:'';
      const mine=myLogin&&myLogin.toLowerCase()===login.toLowerCase();
      rows.push(`<li><strong>${esc(login)}</strong> <span class="muted">on GitHub: ${esc(repo??'no access listed')}</span><br>${who}`
        +`<br><label class="field-label" for="member-${esc(login)}">Project role</label><select id="member-${esc(login)}" data-member="${esc(login)}">${options}</select>${proposal}`
        +(mine?` <button class="button small" type="button" data-member-me="${esc(login)}">This is me</button><span class="field-check" data-member-me-says="${esc(login)}" aria-live="polite"></span>`:'')
        +keyLine+(shortfall?`<br><span class="is-no"><strong>No.</strong> ${esc(shortfall)}</span>`:'')+'</li>');
    }
    $('#shared-people').innerHTML=(peopleNote?`<p class="muted">${esc(peopleNote)}</p>`:'')
      +(rows.length?`<ul class="shared-people-list">${rows.join('')}</ul>`:'')
      +`<p class="muted">A project role is saved with the project. Inviting someone, and their access, stay on GitHub.</p>`;
    $('#shared-people').querySelectorAll<HTMLSelectElement>('[data-member]').forEach(select=>select.onchange=()=>{
      const login=select.dataset.member!,role=select.value as ProjectRole|'';
      writeProjects(readProjects().map(p=>{if(p.id!==project.id)return p;
        const rest=(p.members??[]).filter(m=>m.login.toLowerCase()!==login.toLowerCase());
        const was=(p.members??[]).find(m=>m.login.toLowerCase()===login.toLowerCase());
        const members=role?[...rest,{...(was??{login,since:new Date().toISOString()}),role}]:rest;
        const {members:_m,...without}=p;return members.length?{...without,members}:without as Project;}));
      void refresh(false);});
    $('#shared-people').querySelectorAll<HTMLButtonElement>('[data-member-key-add]').forEach(button=>button.onclick=async()=>{
      const login=button.dataset.memberKeyAdd!;
      const input=$('#shared-people').querySelector<HTMLInputElement>(`[data-member-key="${CSS.escape(login)}"]`)!;
      const key=await readKeyText(input.value);
      if(!key){input.setCustomValidity('Not a key: a key starts fwkey1:');input.reportValidity();return;}
      const by=openIdentity()?.profile.name??deviceLogin()??'another member';
      writeProjects(readProjects().map(p=>p.id!==project.id?p:{...p,members:(p.members??[]).map(m=>
        m.login.toLowerCase()!==login.toLowerCase()?m:{...m,givenKey:key,givenBy:by})}));
      void refresh(false);});
    $('#shared-people').querySelectorAll<HTMLButtonElement>('[data-member-me]').forEach(button=>button.onclick=async()=>{
      const login=button.dataset.memberMe!;
      const says=$('#shared-people').querySelector<HTMLElement>(`[data-member-me-says="${CSS.escape(login)}"]`)!;
      const current=readProjects().find(p=>p.id===project.id);
      if(!current?.members?.some(m=>m.login.toLowerCase()===login.toLowerCase())){
        says.textContent=' Choose your project role first.';$('#shared-people').querySelector<HTMLSelectElement>(`[data-member="${CSS.escape(login)}"]`)?.focus();return;}
      const identity=signingIdentity();
      if(!identity){says.textContent=' Open your identity file, then press This is me again.';$('#identity-button').click();return;}
      const statement={login,name:identity.profile.name,...(identity.profile.orcid?{orcid:identity.profile.orcid}:{}),
        ...(identity.profile.affiliations?.length?{affiliations:identity.profile.affiliations}:{}),
        ...(identity.sealing?{sealKey:identity.sealing.publicKey}:{})};
      const signed=await signStatement(identity,memberStatement(statement));
      writeProjects(readProjects().map(p=>p.id!==project.id?p:{...p,members:(p.members??[]).map(m=>
        m.login.toLowerCase()!==login.toLowerCase()?m:{...(({sealKey:_was,...rest})=>(void _was,rest))(m),...statement,...signed})}));
      void refresh(false);});
  };
  // A DISCUSSION STARTED FROM THE PROJECT, in the words the person types (the first write of 2026-11-16, moved here from
  // New project). Sent through the API, it carries no category form: GitHub applies those only on its own page.
  let postTarget='';
  ($('#shared-post') as HTMLFormElement).onsubmit=async event=>{event.preventDefault();
    const result=$('#shared-post-result');
    const title=($('#shared-post-title') as HTMLInputElement).value.trim(),body=($('#shared-post-body') as HTMLTextAreaElement).value.trim();
    if(!title||!body){result.textContent='Write a title and a message first.';return;}
    const send=$('#shared-post-send') as HTMLButtonElement;
    try{const token=tokenFor(pick.value||project.repository?.credential);send.disabled=true;result.textContent='Posting…';
      const made=await postDiscussion(postTarget,($('#shared-post-category') as HTMLSelectElement).value,title,body,token);
      if(made.ok){result.innerHTML=`<strong>Posted.</strong> Discussion #${made.number}: <a href="${esc(made.url)}" target="_blank" rel="noopener">open it on GitHub</a>.`;
        ($('#shared-post-title') as HTMLInputElement).value='';($('#shared-post-body') as HTMLTextAreaElement).value='';}
      else result.innerHTML=`<strong>No.</strong> ${esc(made.text)}`;}
    catch(e){result.innerHTML=`<strong>No.</strong> ${esc(errorMessage(e))}`;}
    finally{send.disabled=false;}};
  ($('#shared-check') as HTMLButtonElement).onclick=()=>void refresh(true);
  // ENCRYPTED OR OPEN, the project's choice; it takes effect at the next save, which writes every file in the new form
  // and removes the old one in the same commit.
  ($('#shared-sealed') as HTMLInputElement).onchange=()=>{const on=($('#shared-sealed') as HTMLInputElement).checked;
    updateRepository(project.id,{sealed:on});
    $('#shared-sealed-said').textContent=on?'The next save writes every file encrypted, and removes the plain ones.'
      :'Open: the next save writes every file plain, readable by anyone who can see the repository, and removes the encrypted ones.';};
  ($('#shared-save') as HTMLButtonElement).onclick=async()=>{
    const message=($('#shared-message') as HTMLInputElement).value.trim();
    if(!message){out.textContent='Say what this save is first.';return;}
    const current=readProjects().find(p=>p.id===project.id)!;
    try{const token=tokenFor(pick.value||current.repository?.credential);
      const {files,changed}=await localChanges(current);
      // ENCRYPTED ON GITHUB (the export encryption audit): sealed for the members with a key. Recipients changed, or the
      // files were plain before: every file sealed again. Otherwise only what changed, so a commit shows what changed.
      const repo=current.repository!,sealing=repo.sealed;
      let send=files,remove:string[]=[],sealedFor:string|undefined,unread:string[]=[];
      if(sealing){
        const me=openIdentity()?.sealing;
        if(!me){out.innerHTML='<strong>No.</strong> This project is encrypted on GitHub. Open your identity to save it.';$('#identity-button').click();return;}
        const {keys,without}=await repositoryRecipients(current,me.publicKey);
        unread=without;sealedFor=await recipientsDigest(keys);
        const everything=repo.form!=='sealed'||repo.sealedFor!==sealedFor;
        if(repo.commit&&!changed.length&&!everything){out.textContent='Nothing changed here since last read or saved, so there is nothing to save.';return;}
        const picked=new Map([...files].filter(([path])=>everything||changed.includes(path)));
        send=new Map([...await sealRepositoryFiles(new Map([...picked].filter(([p])=>sealable(p))),keys),...[...picked].filter(([p])=>!sealable(p))]);
        // THE PLAIN FORM REMOVED in the same commit, whatever this device last saw: what is not there is not asked for.
        remove=[...new Set([...files.keys(),...Object.keys(repo.remote??{})])].filter(sealable);
      }else{
        if(repo.commit&&!changed.length&&repo.form!=='sealed'){out.textContent='Nothing changed here since last read or saved, so there is nothing to save.';return;}
        remove=[...new Set([...files.keys(),...Object.keys(repo.remote??{})])].filter(sealable).map(p=>`${p}${SEALED_SUFFIX}`);
      }
      out.textContent='Saving…';
      const done=await saveToRepository(repository,send,message,token,fetch,repo.commit,remove);
      if(!done.ok){out.innerHTML=`<strong>No.</strong> ${esc(done.text)}`;return;}
      const sent=await fileDigests(files);
      updateRepository(project.id,{commit:done.sha,files:sent,remote:sent,syncedAt:new Date().toISOString(),credential:pick.value||current.repository?.credential,
        form:sealing?'sealed':'plain',...(sealedFor?{sealedFor}:{})});
      if(unread.length)toast(`Saved encrypted. Not yet able to read it: ${unread.join(', ')}. A member gives their key with This is me, or another member adds it under People.`,{tone:'warning'});
      ($('#shared-message') as HTMLInputElement).value='';
      renderProjectDetails();
      $('#shared-result').innerHTML=`<strong>Saved.</strong> ${esc(describeChanges(changed))} in one commit: <a href="${esc(done.url)}" target="_blank" rel="noopener">open it on GitHub</a>.`
        +unsaidNotice(readProjects().find(p=>p.id===project.id)??current);
      $('#shared-result').querySelector<HTMLButtonElement>('[data-goto-people]')?.addEventListener('click',()=>{
        const people=$('#shared-people');people.scrollIntoView({block:'start'});people.querySelector<HTMLElement>('select,button')?.focus();});}
    catch(e){out.innerHTML=`<strong>No.</strong> ${esc(errorMessage(e))}`;}};
  // GET THE LATEST MERGES (2026-11-16): what is only here is kept, what changed on GitHub comes in, and a workflow
  // changed on both is the person's choice (`mergeLatest`). Before, it replaced everything here after one confirm.
  ($('#shared-latest') as HTMLButtonElement).onclick=async()=>{
    const current=readProjects().find(p=>p.id===project.id)!;
    try{out.textContent='Reading the repository…';
      const merge=await getLatest(current,pick.value||current.repository!.credential!);
      const name=(p:string)=>p==='project.json'?'the project\'s details':p.replace(/^workflows\/|^notes\/|\.json$/g,'');
      const kept=merge.keptHere;
      toast(`Got the latest. `+[
        merge.fromGitHub.length&&`From GitHub: ${merge.fromGitHub.map(name).join(', ')}.`,
        kept.length&&`Kept from here, to save: ${kept.map(name).join(', ')}.`,
        merge.removed.length&&`Removed on GitHub, so removed here: ${merge.removed.map(name).join(', ')}.`,
        !merge.fromGitHub.length&&!kept.length&&!merge.removed.length&&'Nothing had changed.'].filter(Boolean).join(' '),{tone:'notice'});}
    catch(e){out.innerHTML=`<strong>No.</strong> ${esc(errorMessage(e))}`;}};
  ($('#shared-stop') as HTMLButtonElement).onclick=()=>{
    if(!confirm(`Stop sharing "${project.name}" with ${repository} on this device?\n\nThe project stays here and the repository is untouched.`))return;
    updateRepository(project.id,null);renderProjectOptions();renderProjectDetails();};
  const recent=remoteChecked?.project===project.id&&Date.now()-remoteChecked.at<60_000;
  void refresh(!!credentials?.unlocked&&!recent&&!!(pick.value||r.credential));
}
// TWO PATHS IN NEW PROJECT (2026-11-16). The practitioner: "The UI taxonomy should be New Local Project or Open Shared
// GitHub Project. Now under each Import project from backup should also work." A local project as before. A shared
// one: the repository checked, then the project it holds opened, or, where it holds the empty template and the person
// may write to it, a project started in it, new or from a backup. Replaced a "Where it is kept" choice made earlier the
// same day, after "There is only 1 Create Project button and it's above the Shared through GitHub".
{const path=()=>document.querySelector<HTMLInputElement>('input[name="project-path"]:checked')?.value??'local';
 const nameInput=$('#repo-check-name') as HTMLInputElement,pick=$('#repo-check-credential') as HTMLSelectElement;
 const result=$('#repo-check-result'),openResult=$('#repo-open-result');
 const fill=()=>{pick.innerHTML=credentialOptions(pick.value||undefined);drawRecentRepositories($('#repo-check-recent'),nameInput,pick);};
 pick.addEventListener('focus',()=>{pick.innerHTML=credentialOptions(pick.value||undefined);});
 document.querySelector('#project-new')?.addEventListener('click',fill);fill();
 const showPath=()=>{$('#path-local').hidden=path()!=='local';$('#path-github').hidden=path()!=='github';if(path()==='github')fill();};
 // THE TOKENS ARE THE LIST (2026-11-16): one row for each GitHub token in Credentials, with the repository it reaches.
 // A repository a project here is already shared with says so; any other is checked by pressing its button, which runs
 // the same check as a typed one.
 const tokenRows=async()=>{
   const list=$('#token-projects'),refs=githubRefs();
   if(!refs.length){list.innerHTML='<li class="muted">No GitHub token in your Credentials. Add one for the repository, in Credentials.</li>';return;}
   list.innerHTML=refs.map((r,i)=>`<li data-token-row="${i}"><strong>${esc(r.label)}</strong> <span class="muted">Asking GitHub which repository it reaches…</span></li>`).join('');
   const repoRow=(name:string,ref:string)=>{const here=readProjects().find(p=>repositoryOf(p).toLowerCase()===name.toLowerCase());
     return `<span class="repo-name">${esc(name)}</span> `+(here
       ?`<span class="muted">On this device as "${esc(here.name)}".</span> <button type="button" class="button small" data-open-here="${esc(here.id)}">Go to it</button>`
       :`<button type="button" class="button small" data-check-repo="${esc(name)}" data-check-ref="${esc(ref)}">Check it</button>`);};
   for(const [i,r] of refs.entries()){
     const row=list.querySelector<HTMLElement>(`[data-token-row="${i}"]`)!;
     // THE CREDENTIAL NAMES ITS REPOSITORY: that one, and only that one.
     if(r.repository){row.innerHTML=`<strong>${esc(r.label)}</strong><ul class="token-repositories"><li>${repoRow(r.repository,r.ref)}</li></ul>`;continue;}
     // IT DOES NOT YET: asked once, from what the token reaches, private first; the answer is kept in the credential.
     try{const repos=await tokenRepositories(tokenFor(r.ref));
       if(!repos.length){row.innerHTML=`<strong>${esc(r.label)}</strong> <span class="muted">reaches no repository.</span>`;continue;}
       const id=`token-repo-${i}`,named=namedRepository(repos,r.label,r.ref);
       const options=(all:boolean)=>`<option value="">Which repository is it for?</option>`
         +repos.filter(x=>all||x.private).map(x=>`<option>${esc(x.name)}</option>`).join('');
       const privates=repos.filter(x=>x.private).length;
       // THE NAME MATCH FIRST (2026-11-16, of a list of 86): a repository named as the credential is labelled is offered
       // alone; the list, private repositories only unless asked, stays behind Choose another.
       row.innerHTML=`<strong>${esc(r.label)}</strong> <span class="muted">does not say which repository it is for.</span>`
         +(named?`<div class="token-guess">For <span class="repo-name">${esc(named)}</span>? `
           +`<button type="button" class="button small" data-set-repo="${esc(r.ref)}" data-value="${esc(named)}">Yes, this one</button></div>`:'')
         +`<details class="token-choose"${named?'':' open'}><summary>${named?'Choose another':'Choose the repository'}</summary>`
         +`<div class="lookup-row"><label class="visually-hidden" for="${id}">Repository this token is for</label><select id="${id}">${options(!privates)}</select>`
         +`<button type="button" class="button small" data-set-repo="${esc(r.ref)}" data-from="${id}">This one</button></div>`
         +(privates&&privates<repos.length?`<label class="token-public"><input type="checkbox" data-public="${id}"> Show public ones too (${repos.length-privates})</label>`:'')
         +`</details>`;
       row.querySelector<HTMLInputElement>(`[data-public="${id}"]`)?.addEventListener('change',e=>{
         (document.getElementById(id) as HTMLSelectElement).innerHTML=options((e.target as HTMLInputElement).checked);});}
     catch(e){row.innerHTML=`<strong>${esc(r.label)}</strong> <span class="is-no"><strong>No.</strong> ${esc(errorMessage(e))}</span>`;}
   }
   list.querySelectorAll<HTMLButtonElement>('[data-set-repo]').forEach(b=>b.onclick=()=>{
     const chosen=b.dataset.value??(document.getElementById(b.dataset.from!) as HTMLSelectElement).value;if(!chosen)return;
     credentials!.setRepository(b.dataset.setRepo!,chosen);rowsFor='';void tokenRows().then(()=>{
       list.insertAdjacentHTML('beforeend','<li class="muted">Kept for this visit. To keep it, open Credentials and download your credentials file again.</li>');});});
   list.querySelectorAll<HTMLButtonElement>('[data-check-repo]').forEach(b=>b.onclick=()=>{
     nameInput.value=b.dataset.checkRepo!;pick.innerHTML=credentialOptions(b.dataset.checkRef);pick.value=b.dataset.checkRef!;
     ($('#repo-check') as HTMLButtonElement).click();});
   list.querySelectorAll<HTMLButtonElement>('[data-open-here]').forEach(b=>b.onclick=()=>{
     const project=readProjects().find(p=>p.id===b.dataset.openHere);const key=project?.workflows[0];
     if(!project||!key)return;
     ($('#project-select') as HTMLSelectElement).value=project.id;$('#project-select').dispatchEvent(new Event('change'));});
 };
 let rowsFor='';
 const showTokens=()=>{if(path()!=='github')return;const sig=githubRefs().map(r=>`${r.ref}:${r.repository??''}`).join(',')+'|'+readProjects().map(p=>repositoryOf(p)).join(',');
   if(sig!==rowsFor){rowsFor=sig;void tokenRows();}};
 document.querySelectorAll<HTMLInputElement>('input[name="project-path"]').forEach(r=>r.onchange=()=>{showPath();showTokens();});
 document.querySelector('#project-new')?.addEventListener('click',()=>{rowsFor='';showTokens();});
 // NOT OFFERED WHILE CREDENTIALS ARE LOCKED (the practitioner, 2026-11-16: "if Credential is locked, there should be no
 // Open Shared GitHub Project"): without a token nothing on that path can work. Watched through the Credentials
 // button, whose class says whether they are unlocked.
 const offerShared=()=>{const unlocked=!!credentials?.unlocked;
   const choice=document.querySelector<HTMLInputElement>('input[name="project-path"][value="github"]')!;
   choice.closest('label')!.hidden=!unlocked;
   if(!unlocked&&choice.checked){document.querySelector<HTMLInputElement>('input[name="project-path"][value="local"]')!.checked=true;}
   showPath();rowsFor='';showTokens();};
 new MutationObserver(offerShared).observe($('#credentials-button'),{attributes:true,attributeFilter:['class']});
 document.querySelector('#project-new')?.addEventListener('click',offerShared);offerShared();
 const say=(lines:{state:string;text:string}[])=>{result.innerHTML=lines.map(l=>
   `<li class="is-${l.state}"><strong>${l.state==='yes'?'Yes':l.state==='no'?'No':'Not checked'}.</strong> ${esc(l.text)}</li>`).join('');};
 let checked:RepositoryCheck|null=null;
 const next=(c:RepositoryCheck|null)=>{
   const line=(key:string)=>c?.lines.find(l=>l.key===key);
   const usable=!!c&&line('found')?.state==='yes'&&line('layout')?.state==='yes';
   const empty=usable&&/no name yet/.test(line('project')?.text??'');
   const reader=/^Your role here is (Read|Triage)/.test(line('role')?.text??'');
   $('#github-holds').hidden=!(usable&&!empty);
   $('#github-empty').hidden=!(empty&&!reader);
   // A NEW SHARED PROJECT IS OPENED, NOT CREATED (the practitioner, 2026-11-16: "we just opened a GitHub project why
   // create a project in it?"). Its name starts as the repository's, for the person to change.
   if(empty&&!reader&&c&&!($('#github-name') as HTMLInputElement).value)($('#github-name') as HTMLInputElement).value=c.repository.split('/')[1]!;
   if(empty&&reader)openResult.innerHTML='<strong>No.</strong> It holds no project yet, and your role there only lets you read: the lead author starts it.';
   else openResult.textContent='';};
 ($('#repo-check') as HTMLButtonElement).onclick=async()=>{
   checked=null;next(null);
   const name=repositoryName(nameInput.value);
   if(!name){say([{state:'no',text:'Enter the repository as owner/name, for example digital-twin-ph/project-test-collaboration.'}]);nameInput.focus();return;}
   let token:string;
   try{token=tokenFor(pick.value);}catch(e){say([{state:'no',text:errorMessage(e)}]);return;}
   const button=$('#repo-check') as HTMLButtonElement;button.disabled=true;say([{state:'unknown',text:`Reading ${name}…`}]);
   try{checked=await checkRepository(name,token);say(checked.lines);
     if(checked.lines.some(l=>l.key==='found'&&l.state==='yes')){rememberRepository(name,pick.value);drawRecentRepositories($('#repo-check-recent'),nameInput,pick);}
     next(checked);}
   catch(e){say([{state:'no',text:`GitHub could not be reached: ${errorMessage(e)}`}]);}
   finally{button.disabled=false;}};
 nameInput.addEventListener('input',()=>{checked=null;next(null);});
 const sharing=():NonNullable<Project['repository']>|null=>{if(!checked)return null;const [owner,repo]=checked.repository.split('/');
   // ENCRYPTED ON GITHUB BY DEFAULT (the export encryption audit, 2026-11-21).
   return {owner:owner!,repo:repo!,attachedAt:new Date().toISOString(),...(pick.value?{credential:pick.value}:{}),sealed:true};};
 ($('#github-create') as HTMLButtonElement).onclick=()=>{
   const repository=sharing();if(!repository)return;
   const made=createProject({name:($('#github-name') as HTMLInputElement).value,subject:($('#github-subject') as HTMLTextAreaElement).value,
     nameField:$('#github-name'),repository});
   if(!made)return;
   ($('#github-name') as HTMLInputElement).value='';($('#github-subject') as HTMLTextAreaElement).value='';result.innerHTML='';checked=null;next(null);
   renderProjectOptions();renderProjectDetails();rowsFor='';
   toast(`"${made.name}" is shared with ${repository.owner}/${repository.repo}. Save it to the repository from Project, This project, when there is something to share.`);};
 ($('#github-import') as HTMLButtonElement).onclick=()=>{
   const repository=sharing();if(!repository)return;
   pendingShare={repository,at:Date.now()};$('#workflow-file').click();};
 ($('#repo-open-send') as HTMLButtonElement).onclick=async()=>{
   const send=$('#repo-open-send') as HTMLButtonElement;
   if(!checked)return;const name=checked.repository;
   const already=readProjects().find(p=>repositoryOf(p)===name);
   if(already){openResult.innerHTML=`<strong>No.</strong> "${esc(already.name)}" on this device is already shared with ${esc(name)}. Open it, and press Get the latest.`;return;}
   send.disabled=true;openResult.textContent='Reading the repository…';
   try{await openSharedProject(name,pick.value);openResult.textContent='';rowsFor='';}
   catch(e){openResult.innerHTML=`<strong>No.</strong> ${esc(errorMessage(e))}`;}
   finally{send.disabled=false;}};}

// A MINUTE'S WARNING BEFORE THE LOCK (Section 508, WCAG 2.2.1 Timing adjustable; 2026-11-16, with the lock at ten
// minutes): said in words, with a button that keeps them open. Only their own use counts (2026-11-18), so the
// button keeps them open itself. Nothing is lost when they
// lock; opening the files again is the cost.
{const warning=document.createElement('div');warning.id='lock-warning';warning.className='lock-warning';warning.setAttribute('role','alert');warning.hidden=true;
 document.body.append(warning);let shown='';
 const tick=()=>{
   const left=[['Your credentials',credentials?.untilLock??null],['Your identity',identityUntilLock()]] as [string,number|null][];
   const soon=left.filter(([,ms])=>ms!==null&&ms<=60_000);
   const text=soon.length?`${soon.map(([who])=>who).join(' and ')} will lock in under a minute without use.`:'';
   if(text===shown)return;shown=text;
   warning.hidden=!text;
   if(text){warning.innerHTML=`<span>${esc(text)}</span><button type="button" class="button" id="lock-keep">Keep them open</button>`;
     ($('#lock-keep') as HTMLButtonElement).onclick=()=>{credentials?.keepOpen();identityKeepOpen();warning.hidden=true;shown='';};}};
 setInterval(tick,5_000);}

const showCatalog=()=>{try{openCatalogDialog(esc);}catch(error){toast(errorMessage(error),{tone:'failure'});}};
$('#open-catalog').onclick=showCatalog;
// Deep link, so the catalog can be pointed at rather than described: ?catalog=1 or #catalog.
if(new URLSearchParams(location.search).get('catalog')==='1'||location.hash==='#catalog')showCatalog();
/** ONE BACK UP, with the scope chosen inside it. Experiment 131's last control row: the header
 *  carried `Export`, `Encrypted ZIP` and, in a dialog elsewhere, `Export project` -- three
 *  controls for one act, named for their FORMAT rather than for what a practitioner is trying to
 *  do, which is to not lose their work.
 *
 *  It also makes a gap visible that three separate buttons hid. The practitioner, 2026-10-22,
 *  having looked for it: *"Where is the export to zip for projects?"* and *"So encrypted zip
 *  description is misleading."* There are three combinations, not four: a project cannot be
 *  backed up encrypted, because the encrypted package takes one workflow. That is said in the
 *  dialog rather than left as an option a practitioner hunts for and does not find.
 *
 *  CLOSED 2026-11-21 (the export encryption audit): a project is backed up encrypted, as a sealed file, and encrypted comes first in
 *  the dialog; the plain copies follow, named as readable by anyone with the file. */
function openBackupDialog(){
  if(busy)return;
  const project=readProjects().find(p=>p.id===(workflow.projectId
    ??projectOfWorkflow(storageKey(workflow),readProjects())?.id));
  const scoped=$('#backup-project');
  scoped.disabled=!project;
  $('#backup-project-note').textContent=project
    ?`Compressed JSON of all ${project.workflows.length===1?'1 workflow':`${project.workflows.length} workflows`} filed under "${project.name}".`
    :'This workflow is filed under no project, so there is no project to back up. "New project" files it under one.';
  ($('#backup-project-sealed') as HTMLButtonElement).hidden=!project;
  $('#backup-dialog').showModal();
}
$('#backup-button').onclick=openBackupDialog;
$('#backup-dialog-close').onclick=()=>$('#backup-dialog').close();
$('#backup-project').onclick=async()=>{
  const project=readProjects().find(p=>p.id===(workflow.projectId
    ??projectOfWorkflow(storageKey(workflow),readProjects())?.id));
  if(!project)return;
  $('#backup-dialog').close();
  await exportProject(project.id);
};
$('#encrypted-export').onclick=()=>{try{if($('#backup-dialog').open)$('#backup-dialog').close();
  openPackageDialog(workflow,validateWorkflow,applyImportedWorkflow);}catch(error){toast(errorMessage(error),{tone:'failure'});}};
/** THE PREVIOUS RUN BELONGED TO THE PREVIOUS WORKFLOW.
 *
 *  The practitioner, 2026-10-24, having fetched South London from the catalog: *"Loaded South
 *  London successfully, but it not clear the results panel. The Geoprivacy results are still
 *  there."* They were -- 250 death locations and a private-source map, tabbed under a workflow
 *  about water companies, with the Results tab counting seven of them. A toast saying "Run it to
 *  update results" is not the same as not showing somebody else's answer in the meantime, and the
 *  panel does not say which workflow a result came from because until now it could only have
 *  come from this one.
 *
 *  Opening a new empty canvas already did this. Importing did not, on either path, so a file and
 *  a catalog fetch both inherited it. Cleared here so both do the same thing. */
function discardPreviousRun():void{
  result=null;runWorkflow=null;activeOutputId=null;statuses={};
  runFailed=false;runIncomplete=false;dirty=true;
  renderResults();
}
function applyImportedWorkflow(next:Workflow){const persisted=change(w=>{replaceWorkflow(w,next);selected=next.nodes[0]?.id;},{requirePersistence:true});if(!persisted)throw new Error('Workflow could not be saved. The previous workflow is unchanged.');discardPreviousRun();renderLibrary();flow?.fit();toast('Workflow imported. Run it to update results.');}
/** THIS WORKFLOW, ENCRYPTED (the export encryption audit): sealed for the open identity and anyone added. */
async function workflowBackupFile():Promise<{bytes:Uint8Array;name:string;mediaType:string}>{
  const exported=await workflowDocument(workflow);
  const name=exported.schema==='fieldwork/bundle/1'?'fieldwork-workflow-bundle.json.gz':'fieldwork-workflow.json.gz';
  return {bytes:new Uint8Array(await (await gzipText(JSON.stringify(exported))).arrayBuffer()),name,mediaType:'application/gzip'};
}
$('#backup-workflow-sealed').onclick=()=>{if($('#backup-dialog').open)$('#backup-dialog').close();
  openSealDialog({what:'this workflow',identity:openIdentity(),openIdentity:()=>$('#identity-button').click(),
    make:workflowBackupFile,plain:async()=>{$('#export-button').click();},
    done:(name,n)=>toast(`${name}: this workflow, encrypted for ${n===1?'one key':`${n} keys`}.`)},esc);};
$('#backup-project-sealed').onclick=async()=>{
  const project=readProjects().find(p=>p.id===(workflow.projectId??projectOfWorkflow(storageKey(workflow),readProjects())?.id));
  if(!project)return;
  $('#backup-dialog').close();
  await sealProject(project.id);
};
$('#export-button').onclick=async()=>{try{if($('#backup-dialog').open)$('#backup-dialog').close();
  const exported=await workflowDocument(workflow);const text=JSON.stringify(exported);
  const name=exported.schema==='fieldwork/bundle/1'?'fieldwork-workflow-bundle.json.gz':'fieldwork-workflow.json.gz';
  downloadBlob(name,await gzipText(text));}catch(error){toast(errorMessage(error),{tone:'failure'});}};$('#import-button').onclick=()=>$('#workflow-file').click();
$('#workflow-file').onchange=async e=>{let file=(control(e) as HTMLInputElement).files?.[0];if(!file)return;try{
  // A SEALED BACKUP (the export encryption audit) is opened first, with the open identity or a passphrase, and then goes the way a
  // plain file does. Known by its first bytes, not its name.
  if(isSealed(new Uint8Array(await file.slice(0,16).arrayBuffer()))){
    const opened=await openSealedFile(new Uint8Array(await file.arrayBuffer()),openIdentity(),()=>$('#identity-button').click(),esc);
    if(!opened){control(e).value='';return;}
    file=opened;}if(file.size>MAX_BUNDLE_BYTES)throw new Error(`Workflow or bundle exceeds the ${(MAX_BUNDLE_BYTES/1e6).toFixed(0)} MB import limit.`);if(file.name.toLowerCase().endsWith('.zip')){openPackageDialog(workflow,validateWorkflow,applyImportedWorkflow,file);control(e).value='';return;}
  // Gzipped or not, by what the first two bytes say rather than by the name on the file.
  const parsed=JSON.parse(await readMaybeGzipped(file));
  // A PROJECT DOCUMENT comes in through the same control: a practitioner handed a file should not
  // have to know which of two buttons made it.
  if((parsed as {schema?:string})?.schema===PROJECT_DOCUMENT_SCHEMA){await importProjectDocument(parsed);control(e).value='';return;}
  const next=await importWorkflowDocument(parsed,validateWorkflow);const persisted=change(w=>{replaceWorkflow(w,next);selected=next.nodes.find(n=>n.type==='output')?.id;},{requirePersistence:true});if(!persisted)throw new Error('Workflow could not be saved. The previous workflow is unchanged.');discardPreviousRun();renderLibrary();flow?.fit();toast('Workflow imported. Run it to update results.');}catch(err){toast(errorMessage(err),{tone:'failure'});}control(e).value='';};
$('#geojson-file').onchange=async e=>{const file=(control(e) as HTMLInputElement).files?.[0];if(!file)return;try{if(file.size>5e6)throw new Error('GeoJSON file is too large (5 MB maximum).');const data=validateGeoJSON(JSON.parse(await file.text()));change(w=>{const n=w.nodes.find(n=>n.id===importNode);if(!n)throw new Error('Source node no longer exists.');updateParam(w,n.id,'data',data);});toast('Local geographic data loaded. Run to update results.');}catch(err){toast(errorMessage(err),{tone:'failure'});}control(e).value='';};
/** A RASTER'S CELLS, WRITTEN AS A LIST, no data as null, as a receipt always wrote them: a typed array (2026-11-13) would
 *  otherwise be written as an object keyed "0", "1", ... */
const cellsAsList=(_key:string,value:unknown)=>value instanceof Float32Array||value instanceof Float64Array?Array.from(value,v=>Number.isNaN(v)?null:v):value;
$('#download-evidence').onclick=async()=>{if(!result||!runWorkflow){toast('Run the workflow first.');return;}const {tables:_held,...reported}=result;
  // The run's retained tables are a reading convenience for the open session, not evidence: the
  // receipt already carries the facts each step asserted, and copying every intermediate table
  // into it would grow an export by the size of the data it describes.
  const snapshot=structuredClone({schema:'fieldwork/run/1',workflow:runWorkflow,...reported});try{const attachments=await exportEvidenceFiles(snapshot.workflow);download('fieldwork-run-receipt.json',JSON.stringify({...snapshot,...(attachments.length?{attachments}:{})},cellsAsList,2));}catch(error){toast(errorMessage(error),{tone:'failure'});}};
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>switchView(b.dataset.view!));
/** MANAGE LAYERS. The practitioner, 2026-10-29: *"Map output should have a dialog modal for
 *  layer management (ordering, labeling, grouping). It should honor all the mappable inputs,
 *  refusing only when there are rule violations."*
 *
 *  The list is recomputed from the workflow on every edit rather than held in the dialog, so
 *  what it shows is what the map draws -- including a layer wired while it is open, and the
 *  members inside a collected value, which come from the last run's polygons.
 *
 *  What this does NOT yet replace: `#map-layer-list`, the per-point-layer checkboxes under the
 *  static map, whose state lives in `hiddenMapLayers` -- a Map in memory, lost on reload and
 *  absent from the saved workflow. Two visibility controls for one map is one too many, and the
 *  one that persists should win; that is the next step and is recorded rather than half-done. */
let layerDialogNode:string|null=null;
const layersFor=(node:WorkflowNode<'map_output'>):MapLayer[]=>{
  const out=result?.outputs.find(o=>o.nodeId===node.id);
  return mapLayerList(node,workflow.edges,
    id=>workflow.nodes.find(n=>n.id===id)?.params.label,
    out?.polygons?[{port:'polygons',members:membersOfPolygons(out.polygons)}]:[],
    layerOrigins(out?.pointLayers));
};
const KIND_WORD:Record<string,string>={AreaLayer:'study area',PointsLayer:'points',
  PolygonsLayer:'polygons',RasterLayer:'raster',NetworkLayer:'street network',LinesLayer:'lines',BasemapLayer:'basemap'};
function renderLayerDialog(){
  if(!layerDialogNode)return;
  const node=getNode(workflow,layerDialogNode,'map_output'),list=layersFor(node);
  $('#layer-dialog-rows').innerHTML=list.length?list.map((layer,index)=>
    `<div class="layer-row" role="listitem" data-layer-row="${esc(layer.id)}">`
    +`<span class="layer-row-move">`
    +`<button class="icon-button" data-layer-move="${esc(layer.id)}" data-direction="up" aria-label="Draw ${esc(layer.label)} lower" ${index===0?'disabled':''}>↑</button>`
    +`<button class="icon-button" data-layer-move="${esc(layer.id)}" data-direction="down" aria-label="Draw ${esc(layer.label)} higher" ${index===list.length-1?'disabled':''}>↓</button>`
    +`</span>`
    +`<label class="layer-row-visible"><input type="checkbox" data-layer-visible="${esc(layer.id)}" ${layer.drawn?'checked':''}><span class="visually-hidden">Draw ${esc(layer.label)}</span></label>`
    // A LAYER'S NAME IS NOT EDITED HERE. The practitioner, 2026-10-29: *"this form allow me to
    // edit the inherited label of the polygon layer. It should not be editable."* It inherits
    // from the thing that owns it -- the widget's own label, a collected layer's name, a pin
    // class's value -- and a second place to type it is a second name for one thing, free to
    // disagree with the first. Shown, with where it came from, and changed at the source.
    +`<span class="layer-row-label" data-layer-label="${esc(layer.id)}">${esc(layer.label)}</span>`
    +`<select class="layer-row-group" data-layer-group="${esc(layer.id)}" aria-label="Group for ${esc(layer.label)}">`
      +`<option value="">No group</option>`
      +(node.params.layerGroups||[]).map(group=>
        `<option value="${esc(group.id)}" ${layer.group?.id===group.id?'selected':''}>${esc(group.label)}</option>`).join('')
      +`</select>`
    +`<span class="muted layer-row-kind">${esc(KIND_WORD[layer.kind]||layer.kind)}${layer.parts?` · ${layer.parts.toLocaleString('en-US')}${layer.origin==='within'?' parts':''}`:''}<br><span class="layer-row-origin">${layer.origin==='within'?'named by the data':'named by the widget'}</span></span>`
    +`</div>`).join('')
    :'<p class="muted">Nothing is connected to this map yet, so it has no layers to manage.</p>';
  // WHAT IS REFUSED IS SAID HERE, and it is never a combination of kinds. A kind decides how a
  // layer is drawn, not whether it may be there.
  const drawn=list.filter(l=>l.drawn);
  $('#layer-dialog-note').textContent=!list.length
    ?'Connect a study area, points, polygons, lines, a raster or a street network.'
    :!drawn.length?'Every layer is switched off, so this map has nothing to draw. Switch one back on.'
    :`Drawn bottom to top: ${drawn.map(l=>l.label).join(' → ')}.`
      +(drawn.length<list.length?` ${list.length-drawn.length} switched off, still connected.`:'');
}
function editLayer(id:string,patch:{label?:string;group?:string;drawn?:boolean}){
  if(!layerDialogNode)return;
  change(w=>{
    const node=getNode(w,layerDialogNode!,'map_output');
    const held={...(node.params.layers||{})},next:Record<string,unknown>={...held[id],...patch};
    // A setting that says nothing is removed rather than stored empty, so a layer the
    // practitioner cleared behaves exactly like one they never touched -- including taking a new
    // default when the node it comes from is renamed.
    for(const key of ['label','group'])if(typeof next[key]==='string'&&!(next[key] as string).trim())delete next[key];
    if(next.drawn===true)delete next.drawn;
    if(Object.keys(next).length)held[id]=next as typeof held[string];else delete held[id];
    node.params.layers=held;
  });
  renderLayerDialog();
}
$('#layer-dialog-rows').addEventListener('change',event=>{
  const target=event.target as HTMLInputElement,id=target.getAttribute('data-layer-visible');
  if(id){editLayer(id,{drawn:target.checked});return;}
  const grouped=target.getAttribute('data-layer-group');
  if(grouped)editLayer(grouped,{group:target.value});
});
$('#layer-dialog-rows').addEventListener('click',event=>{
  const button=(event.target as HTMLElement).closest('[data-layer-move]') as HTMLElement|null;
  if(!button||!layerDialogNode)return;
  const id=button.getAttribute('data-layer-move')!,up=button.getAttribute('data-direction')==='up';
  const list=layersFor(getNode(workflow,layerDialogNode,'map_output'));
  const at=list.findIndex(l=>l.id===id),swap=up?at-1:at+1;
  if(at<0||swap<0||swap>=list.length)return;
  // THE WHOLE STACK IS WRITTEN, not the two that moved. A position is relative, so recording
  // only the pair would leave the rest at defaults that no longer sit either side of them.
  const next=[...list];[next[at],next[swap]]=[next[swap],next[at]];
  change(w=>{
    const node=getNode(w,layerDialogNode!,'map_output'),held={...(node.params.layers||{})};
    next.forEach((layer,index)=>{held[layer.id]={...held[layer.id],index};});
    node.params.layers=held;
  });
  renderLayerDialog();
  ($('#layer-dialog-rows').querySelector(`[data-layer-row="${CSS.escape(id)}"] [data-direction="${up?'up':'down'}"]`) as HTMLElement|null)?.focus();
});
$('#layer-dialog-declare').onclick=()=>{
  if(!layerDialogNode)return;
  // DECLARED FIRST, JOINED AFTER. The group exists with a name and a position before any layer is
  // in it, which is what makes it one thing to rename and one block to move.
  const node=getNode(workflow,layerDialogNode,'map_output');
  const held=node.params.layerGroups||[];
  const field=$('#layer-group-name') as HTMLInputElement;
  const label=field.value.trim();
  if(!label){$('#layer-dialog-note').textContent='A group needs a name before layers can be added to it.';field.focus();return;}
  change(w=>{
    const target=getNode(w,layerDialogNode!,'map_output');
    target.params.layerGroups=[...held,
      {id:`group-${Date.now().toString(36)}-${held.length}`,label:label.slice(0,LAYER_LABEL_LIMIT),index:held.length}];
  });
  field.value='';
  renderLayerDialog();
};
$('#layer-dialog-reset').onclick=()=>{
  if(!layerDialogNode)return;
  change(w=>{const node=getNode(w,layerDialogNode!,'map_output');
    delete node.params.layers;delete node.params.layerGroups;});
  renderLayerDialog();
};
for(const id of ['#layer-dialog-close','#layer-dialog-done'] as const)
  $(id).onclick=()=>{($('#layer-dialog') as HTMLDialogElement).close();layerDialogNode=null;};
document.addEventListener('click',event=>{
  const open=(event.target as HTMLElement).closest('[data-manage-layers]') as HTMLElement|null;
  if(!open)return;
  layerDialogNode=open.getAttribute('data-manage-layers');renderLayerDialog();
  ($('#layer-dialog') as HTMLDialogElement).showModal();
});
// THE NOTES TAB'S OWN CONTROLS: open one, add one, move one.
document.addEventListener('click',event=>{
  const target=event.target as HTMLElement;
  const opened=target.closest('[data-note-open]')?.getAttribute('data-note-open');
  if(opened){
    const note=shownNotes.find(n=>noteKey(n)===opened);
    if(note)writeInNoteDialog(note);
    return;
  }
  // THE NODE THAT PRODUCED IT, which the prototype links and the practitioner asked of it:
  // "if produced by a workflow it should link to the workflow".
  const node=target.closest('[data-open-node]')?.getAttribute('data-open-node');
  if(node){switchView('workflow');selected=node;render();return;}
  const section=target.closest('[data-add-note]')?.getAttribute('data-add-note');
  if(!section)return;
  // ADDED AS AUTHORED, because that is the only kind a person writes here. It carries a marker
  // rather than prose: a note with placeholder sentences in it is a note somebody has to notice
  // and delete, and `readNotes` drops one carrying nothing at all.
  // THE SAME SENTENCE THE DISABLED BUTTON CARRIES. The button is disabled where this refuses, so
  // this is now the keyboard and the stale-render door rather than the ordinary one -- and a
  // second wording for the same refusal is how two surfaces come to disagree about one fact.
  const project=projectNow();
  const why=keptHere(project);
  if(why||!project){toast(why||'',{tone:'failure'});return;}
  const held=[...(project.notes||[])] as Note[];
  // A UUID, because a note somebody writes has no natural key and the whole point of the id is
  // that another note can point at it. `Date.now()` collides within a millisecond, which is never
  // by hand and certain under a loop.
  // FROM AN OUTLINE SLOT, the note arrives with the function the slot wants (experiment 202, Stage A).
  const fn=target.closest('[data-add-note]')?.getAttribute('data-add-fn')||'';
  // FROM AN OBJECTIVE'S ROW (Stage B), it arrives answering that objective.
  const answers=target.closest('[data-add-note]')?.getAttribute('data-add-answers')||'';
  const made:Note={kind:'authored',id:crypto.randomUUID(),
    section:section as WriteUpPart,text:UNWRITTEN,...(fn?{fn}:{}),...(answers?{answers}:{})};
  if(!writeNotes([...held,made])){
    toast('That note could not be kept on this device.',{tone:'failure'});return;}
  renderNotesView();
  // AND IT OPENS FOR WRITING, which is the point of adding one. Before writing existed this
  // toasted and stopped, leaving a card nobody could do anything with.
  writeInNoteDialog(made);
});
// MOVING A NOTE BETWEEN SECTIONS, which the prototype does by dragging. A note's section is where
// it belongs in the write-up, and that is the practitioner's judgement -- but only for a note
// they own. A derived or machined note's section follows what produced it, and a quotation's
// follows what it establishes, so those are refused with the reason rather than silently snapped
// back.
document.addEventListener('dragstart',event=>{
  const card=(event.target as HTMLElement).closest?.('[data-note]') as HTMLElement|null;
  if(!card)return;
  event.dataTransfer?.setData('text/plain',card.getAttribute('data-note')||'');
  card.classList.add('dragging');
});
document.addEventListener('dragend',event=>{
  (event.target as HTMLElement).closest?.('[data-note]')?.classList.remove('dragging');
});
document.addEventListener('dragover',event=>{
  const drop=(event.target as HTMLElement).closest?.('[data-drop]');
  if(drop)event.preventDefault();
});
document.addEventListener('drop',event=>{
  const drop=(event.target as HTMLElement).closest?.('[data-drop]') as HTMLElement|null;
  if(!drop)return;
  event.preventDefault();
  const key=event.dataTransfer?.getData('text/plain');
  const into=drop.getAttribute('data-drop') as WriteUpPart;
  if(!key||!WRITE_UP_PARTS.includes(into))return;
  if(into==='References'){
    toast('References is assembled from what is cited. Cite a work from the note that relies on it.',{tone:'failure'});
    return;
  }
  const project=projectNow();
  const held=[...(project?.notes||[])] as Note[];
  const at=held.findIndex(n=>noteKey(n)===key);
  if(at<0){
    toast('Only a note you wrote can be moved. A derived or machined note sits where the step '
      +'that produced it put it, and a quotation where its claim belongs.',{tone:'failure'});
    return;
  }
  // WHERE IN THE SECTION, not only which section. A drop onto a card puts the note before it; a
  // drop into the empty space below the last card puts it at the end of that part. Reordering
  // within a part is the practitioner's request of 2026-10-29 -- "we should be able to move around
  // notes within IMRaD sections" -- and it is the same gesture as moving between them, so it is the
  // same handler rather than a second one with its own rules.
  const onto=(event.target as HTMLElement).closest?.('[data-note]') as HTMLElement|null;
  // DROPPED ON ITSELF IS NOT A MOVE, and it has to be checked before the position is read rather
  // than inferred from the result. Found 2026-10-30 by dragging in the running application: a
  // card dropped on its own body took the same `before=null` path as a drop into the empty space
  // below the last card, so a note nudged a few pixels and let go was sent to the end of its
  // section. The two gestures mean opposite things and only the DOM can tell them apart -- once
  // the position is null the handler no longer knows which one it was.
  if(onto&&onto.getAttribute('data-note')===key)return;
  const before=onto?onto.getAttribute('data-note'):null;
  const moved=held[at].section===into?held:held.map((n,i)=>i===at?{...n,section:into}:n);
  const next=moveNote(moved,key,before,noteKey);
  // Nothing changed: dropped back where it already was. Silence is right -- a toast saying a note
  // moved when it did not is the interface reporting work it did not do.
  if(next.every((n,i)=>n===held[i])&&held[at].section===into)return;
  if(writeNotes(next))renderNotesView();
});
$('#help-button').onclick=()=>$('#help-dialog').showModal();$('#close-help').onclick=()=>$('#help-dialog').close();
/** LAB EVALUATION (experiment 184): the screen being evaluated is the open tab, and the selected step's widget where
 *  the Workflow tab is open, at the version this build carries. */
setupLabEvaluation(()=>{
  const tab=document.querySelector<HTMLElement>(`.tabs [data-view="${currentView}"]`);
  const screen=(tab?.firstChild?.textContent||currentView).trim()+' tab';
  const node=currentView==='workflow'&&selected?workflow.nodes.find(n=>n.id===selected):undefined;
  const entry=node?(widgetRegistry as {widgets:{nodeType:string;currentVersion:string}[]}).widgets.find(w=>w.nodeType===node.type):undefined;
  return {screen:node?`${screen} › ${node.params?.label||node.type}`:screen,
    ...(entry?{widget:{type:entry.nodeType,version:entry.currentVersion}}:{})};
});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!['INPUT','TEXTAREA','SELECT'].includes((e.target as Element).tagName)){e.preventDefault();$(e.shiftKey?'#redo-button':'#undo-button').click();}});
const requestedExample=new URLSearchParams(location.search).get('example');
// A CATALOG EXAMPLE FROM A LINK (experiment 203): `?example=<slug>` opens a repository example the way its button does,
// downloaded and checked against its pinned digests, so a QR code in a write-up can open it.
const requestedCatalog=requestedExample&&!hasExampleTemplate(requestedExample)
  ?curatedExamples().find(e=>exampleSlug(e.id)===requestedExample):undefined;
if(requestedCatalog)setTimeout(()=>void openCuratedExample(requestedCatalog.id),0);
if(requestedExample&&hasExampleTemplate(requestedExample)&&requestedExample!==exampleKey(workflow)){save();let openedSaved=false;try{const saved=JSON.parse(localStorage.getItem(WORKSPACES)||'{}')[requestedExample];openedSaved=!!saved;workflow=saved?validateWorkflow(saved):template(requestedExample);}catch{workflow=template(requestedExample);}
  // ?example= is how a worked example is usually reached -- from a link, from the manual -- so
  // the notice has to live here as well as on the picker, or the practitioner who follows a
  // link to a republished example still sees the version they already had.
  if(openedSaved)setTimeout(()=>noticeIfRepublished(requestedExample),900);else recordRevision(requestedExample);selected=requestedExample==='snow-geoprivacy'?'move':requestedExample.startsWith('snow-')?'catchments':workflow.nodes[0]?.id;}
// AND THE EXAMPLE THE PAGE OPENS ON (2026-11-13): reopening the application lands on the last workflow, so a saved copy of
// an example opened this way was never compared with the example as it ships, which is how an FETP demo met Hagelloch
// without its replay.
else{const key=exampleKey(workflow);if(isExampleKey(key)&&key!=='blank'&&Object.hasOwn(readSavedWorkflows(),key))setTimeout(()=>noticeIfRepublished(key),900);}
wireThemeControl();renderLibrary();renderResults();save();render();mountPanelLayout();
// Progressive reveal, played back. Behind ?playback=1 because the rule is not adopted: nothing
// about the normal palette changes, and the control does not appear unless it is asked for.
//
// Started here, after the requested example has been loaded, rather than beside the other
// controls. Starting it earlier rendered the canvas once, which syncs ?example= to the workspace
// being shown -- so the playback overwrote the example it was asked to play. Experiment 112.
$('#playback-next').onclick=()=>setPlayback(Math.min(playbackOrder().length,(playbackStep??0)+1));
$('#playback-back').onclick=()=>setPlayback(Math.max(0,(playbackStep??0)-1));
$('#playback-exit').onclick=()=>setPlayback(null);
// Reachable from the workspace bar, not only by typing ?playback=1. The playback IS the
// refinement instrument for the reveal rule -- it is what produced the three readings and the
// per-step measurements in 112 -- and an instrument nobody can find does not refine anything.
// The practitioner, 2026-10-15, twice: "I still do not see progressive reveal", then "I thought
// we implemented progressive reveal in worked examples."
//
// It still changes nothing about the ordinary palette, because the rule is not adopted. Playing
// it back is a thing you ASK for, and leaving it restores the canvas.
$('#playback-start').onclick=()=>setPlayback(playbackStep===null?0:null);
if(new URLSearchParams(location.search).get('playback')==='1')setPlayback(0);
export let servingBuild='unknown';
if('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('message',event=>{
    const data=event.data as {type?:string;build?:string;version?:string}|null;
    if(data?.type==='fieldwork-build'&&data.build){
      servingBuild=data.build;
      // Which VERSION is actually serving this page, in the header, beside the number the page
      // believes it is. The two disagree exactly when a cached build is being served, which is
      // the thing a practitioner cannot otherwise see: reported twice, three days apart, while
      // the repository was a release and a half ahead of the browser.
      const serving=data.version;
      $('#offline-status').title=`Served by build ${data.build}${serving?` (v${serving})`:''}`;
      if(serving&&serving!==appPackage.version){
        $('#app-version').textContent=`v${serving} · cached`;
        $('#app-version').title=`This page is being served from a cached build of v${serving}. `
          +`The files on disk are v${appPackage.version}. Reload to update.`;
        toast(`You are looking at a cached v${serving}; v${appPackage.version} is installed.`,
          {action:{label:'Update now',run:()=>navigator.serviceWorker.getRegistration()
            .then(r=>r?.update()).then(()=>location.reload())}});
      }
    }
  });
  const askBuild=()=>navigator.serviceWorker.controller?.postMessage({type:'fieldwork-build'});
  navigator.serviceWorker.register('./sw.js').then(async registration=>{
    await navigator.serviceWorker.ready;
    // Check for a newer worker on every start where one is ALREADY in control. The browser's own
    // check is periodic, so a worker installed days ago could go on serving its cache
    // indefinitely, which is what happened. Skipped on a first registration: the worker is
    // installing anyway, and asking it to update mid-install makes it precache everything twice
    // -- which showed up as the browser suite taking 8.9 minutes instead of 3.8.
    if(navigator.serviceWorker.controller)registration.update().catch(()=>{});
    askBuild();
    // A page already running old code keeps running it until it is reloaded, and with
    // content-hashed chunks it can ask for files the new cache no longer holds. So an update is
    // announced rather than left to be discovered.
    registration.addEventListener('updatefound',()=>{
      const installing=registration.installing;
      installing?.addEventListener('statechange',()=>{
        if(installing.state==='installed'&&navigator.serviceWorker.controller)
          toast('A newer version of Fieldwork is ready. Reload to use it.',{action:{label:'Reload',run:()=>location.reload()}});
      });
    });
    const ok=!!(await caches.match('./vendor/eye-21.1.24.js'));
    // Not shown (the practitioner, 2026-11-11: the label "Available offline" was misleading); kept as a state the tests wait on.
    $('#offline-status').dataset.state=ok?'ready':'incomplete';
  }).catch(()=>{$('#offline-status').dataset.state='unavailable';});
  navigator.serviceWorker.addEventListener('controllerchange',askBuild);
}else{$('#offline-status').dataset.state='unsupported';}
// A row for a workflow that was never saved is cleared on arrival, once, and said out loud.
{
  const ghosts=pruneGhostWorkflows();
  if(ghosts){
    renderProjectOptions();render();
    setTimeout(()=>toast(`${ghosts} workflow ${ghosts===1?'row was':'rows were'} listed in a project with nothing saved under `
      +`${ghosts===1?'it':'them'} — a workflow registered and then refused by a full store. `
      +`${ghosts===1?'It has':'They have'} been removed; no work was in ${ghosts===1?'it':'them'}.`,{tone:'notice'}),600);
  }
}
setRunInFlight(()=>busy);
if(canAutoRun(workflow))setTimeout(run,350);
// A manual left detached stays detached across a reload, until Close: a worked example's, and a widget's page.
renderManualFloat(true);
renderManualPage();

setInterval(()=>networkDownloadTick(busy),1000);


/** STARTUP IS OVER: every top-level handler above is bound, the stored payloads among the awaits before them. A file
 *  given to #workflow-file before this is dropped without a word, because nothing is listening yet; WebKit on CI hit
 *  that window in three runs of 2026-11-15. Tests wait for this mark before importing. */
// A FILE GIVEN BEFORE THE HANDLER WAS BOUND IS STILL ON THE INPUT: imported now, rather than dropped. Nothing between the
// binding and here awaits, so a file present now can only have arrived before it. WebKit on CI hit that window in four
// more tests on 2026-11-15, each importing a workflow the moment the page opened.
if(($('#workflow-file') as HTMLInputElement).files?.length)$('#workflow-file').dispatchEvent(new Event('change'));
document.documentElement.dataset.ready='true';
