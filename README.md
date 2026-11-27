# Fieldwork

_Created 2026-10-05 · Updated 2026-11-27_

A browser prototype for semantic visual GIS workflows in public health. Build a
workflow from typed widgets, compute spatial facts locally, and evaluate
Notation3 rules with EYE-JS in WebAssembly. Nothing is sent to a server.

This is exploratory software, not a validated public health policy, risk model
or privacy control.

## Published

| Site | What it is |
| --- | --- |
| [Fieldwork](https://fieldwork-app.github.io/fieldwork/) | The application. Also on [GitLab Pages](https://fieldwork-47c2e8.gitpages.cdc.gov/), which may require a sign-in |
| [Validation Lab](https://digital-twin-ph.github.io/validation-lab/) | JupyterLite notebooks that independently recompute Fieldwork's spatial results in Python and report agreement with a stated tolerance |
| [Ontology viewer](https://digital-twin-ph.github.io/fieldwork-ontology/) | A reading view of this project's vocabulary, its shapes and its competency questions, with the schema-level questions as a build gate |

Worked examples: [blank canvas](https://fieldwork-app.github.io/fieldwork/?example=blank),
[Measles in Hagelloch, 1861](https://fieldwork-app.github.io/fieldwork/?example=hagelloch). Worked examples kept in
their own repositories, such as [rules on synthetic data](https://github.com/digital-twin-ph/example-workflows-rulesets),
open from the Catalog.
The version beside the header mark is the released application version; see the
[release notes](CHANGELOG.md).

## Current capabilities

| Component | What you can do now |
| --- | --- |
| Workflow canvas | Connect typed ports, edit nodes, undo/redo, save separate examples and import/export workflows. |
| Widget catalog | **▤ Catalog** in the header, or **Widget catalog ›** beside the widget library, lists every definition in this build with its version, release digest, declared ports and whether an external implementation has independently recomputed it. `?catalog=1` opens it directly. The selected node shows the same identity in its inspector. |
| Colour theme | Choose light, dark, or follow the device from the header. The choice is saved on this device; exported SVG and GeoTIFF artifacts stay light whichever theme is shown. |
| Panel layout | Drag the library/inspector dividers and Workflow/N3–Results split on desktop. Sizes stay on this device. Keyboard arrows resize; Reset layout restores defaults. |
| Study area | Draw and label a bounding box or simple polygon; inspect its GeoSPARQL representation. |
| Calculate area | Enrich the study area with a spherical area measurement; choose metric or imperial units. |
| Input data | Generate synthetic points, import CSV/GeoPackage/GeoJSON, or place map pins with typed attributes, value sets and optional UUIDs. |
| Rate with a denominator | Divide counts by a declared population at risk, grouped by an attribute or by bands of a numeric one. What the denominator counts, whether it is a proportion or a ratio, the multiplier, the smallest reportable denominator and both vintages are stated, not implied. Small groups report their counts and no rate. |
| Cases by period | Count cases per day, week or month from a declared date attribute and a declared kind of date — onset, report, death or specimen collection — optionally weighted where one row stands for several cases. Connect a Chart to draw an epidemic curve. Empty periods are kept; records without an ISO 8601 date are excluded and counted. |
| Sea-level projections | Declare an imported long-format AR6 extract with its dataset, version, baseline and three obligatory citations; assign each point its nearest published projection site with the distance kept; compare one fully keyed projected change against an elevation you supply on a datum you state. A comparison of two numbers, never an inundation model. |
| Tabular data | Import a long-format CSV keyed by the columns you declare, with one value column and a unit you state. No geometry is claimed; connect a Table output to display it. |
| Reproject input | Import a local CSV or GeoJSON in WGS84 UTM metres and convert it to CRS84 longitude/latitude for the other widgets. WGS84 zones only; no datum shift and no raster warping. |
| Raster input and Clip raster | Acquire a bounded WGS84 GeoTIFF window, then crop and mask it with a study polygon. Preserve native values and metadata; display and download the result. |
| Spatial coverage | Check multiple point layers against one boundary; review outside/missing locations and record exclusions without deleting source records. |
| Geoprivacy experiment | Move points with a configurable, seeded donut displacement or aggregate them into H3 cells with sparse-cell omission. Compare private before and derived after maps/tables. These methods do not establish anonymity. |
| Visual outputs | Connect maps and point tables; worked examples also provide decision maps, tables and bar charts in Results tabs. |
| N3 and evidence | Run EYE-JS locally, inspect facts and assertions, and download run receipts. |
| Supporting references | Attach PDFs or URLs to nodes, describe supporting passages, and preserve citations and file identity with run provenance. |

Built-in worked examples cover measles in Hagelloch, 1861, and John Snow's Voronoi and network catchments, outbreak extent
and geoprivacy transformations. The heat and Old Naledi examples retired on 2026-11-11
([audit](docs/audits/old-naledi-audit.md)).

Step-by-step instructions are in [the usage guide](docs/usage.md); the worked
examples have their own guides, such as [John Snow](docs/examples/john-snow.md).

John Snow's own daily table of attacks and deaths (1855, Table 1) is bundled at
`examples/john-snow/snow_dates.csv` with its provenance. It gives the time axis
the map cannot: attacks peak on 1 September 1854 and deaths on 2 September, which
is why a series must state which kind of date it counts. The two Snow files
cannot be joined case by case — one has places without dates, the other dates
without places.

## Run locally

Node.js 22 or newer — `package.json` declares `engines: node >=22`, CI pins 22, and
`.nvmrc` records it so `nvm use` needs no argument:

    nvm use                 # or: nvm install 22
    npm ci
    npm run build
    npm start

**On Node 20 the build fails before reaching any project code**, with
`ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension "" for node_modules/typescript/bin/tsc`.
TypeScript 7 is ESM-only and its `bin/tsc` is extensionless, which Node 20 refuses to load
in a `"type":"module"` context. The message names typescript and looks like a dependency
problem; it is a Node version problem. If `nvm use` is unavailable, invoke Node 22 directly,
for example `export PATH="$HOME/.nvm/versions/node/v22.<patch>/bin:$PATH"` after
`ls ~/.nvm/versions/node` to find the installed patch version.

Open http://127.0.0.1:4173. The server listens on this machine only. Source is
TypeScript under `src/`; rebuild after changing source or styles.

## Validation

There are seven kinds of check here and each establishes something different;
[kinds of validation](docs/audits/validation.md) says what each one does and does not
establish, and how much of the widget set it covers. This section is how to run them.

Run the full gate before accepting a functional change:

    npm ci
    npx playwright install chromium
    npm run check

That type-checks application, worker and compile-only sources, rebuilds, runs
every `tests/*.test.mjs` unit test and every `tests/*.browser.mjs` scenario on
its own server. It also verifies that every documentation file carries a
date stamp under its heading; `npm run stamp:docs` refreshes those from git
history, which is where the dates come from rather than from anyone typing
them. There are no retries, and a focused `.only` fails the gate. Use
`npm run validate:ontology` and `npm run validate:widgets` for the RDF and
registry checks, which include the shape of recorded parity evidence.
`npm run validate:parity` verifies that evidence against a Validation Lab
checkout and lists the widgets with none; it needs that repository, so it is not
part of the gate. Set `FIELDWORK_BROWSERS` to a comma-separated list to exercise
other browsers; the default gate is Chromium only, and a result is claimed only
for the browsers actually run.

Version 0.4.0 passed 101 unit tests, ontology and widget validation and a
Chromium version check. Work since then is unreleased and recorded as in
development in the [release notes](CHANGELOG.md). The
[regression baseline](docs/experiments/07-functional-regression.md) maps
behaviour to tests. These checks establish structure and deterministic
behaviour, not scientific validity, privacy effectiveness or practitioner
effectiveness.

Independent recomputation lives in the Validation Lab rather than here. It has
confirmed reprojection against `pyproj` and cell-centre raster clipping against
`rasterio`, and found that all-touched clipping is **more inclusive than GDAL's**
at pixel-aligned cutlines — see
[experiment 29](docs/experiments/29-raster-edge-inclusion.md).

## Limits

Not implemented: NetCDF acquisition or any sea-level model (projections are imported, never produced), general reprojection beyond the UTM import path, a
GEOS-WASM geoprocessing executor, Logical English comparison, agent-based
simulation, learning and scoring, publication products, GADM download widgets, a
STAC browser or acquisition adapter, runtime widget-version pinning, widget
packs, and a live SHACL report in the browser.

Input data accepts up to 2,000 rows and 5 MB files; Tabular data up to 250,000
rows and 40 MB files, limits measured rather than chosen
([experiment 175](docs/experiments/175-how-large-a-table.md)). A
tabular value must be a number or empty; a non-numeric value is refused rather
than coerced, and no unit is inferred. GeoPackage import supports
2D POINT layers in EPSG:4326; CSV needs longitude and latitude in degrees. The
study-area editor draws bounding boxes and simple polygons of 3–200 vertices,
excluding holes, antimeridian crossings and polar areas. Browser storage is
unencrypted, and clearing it removes local workflows, attachments and offline
assets, so export anything worth keeping.

This is **not an offline application**. It is an application that **can work offline
under conditions you have to arrange**, and the conditions are getting narrower as it
grows, not wider.

What works offline: the application itself, the bundled EYE engine and the example
data, once cached by a connected visit. Workflows built only from those parts run,
save and reopen with no network.

What does not, and cannot: anything from another origin at the moment it is
needed. The study-area editor draws on a blank map, because it asks a tile
server for the view you are panning to and there is no asking it offline.

A figure's basemap is a different case, and the difference is the one that
matters offline: a raster basemap is fetched once while connected and **baked
into the figure**, so the exported SVG carries its own ground and a later visit
redraws it from the payload store with no network. That is the flow this
application is built around — download the assets while you can, use the cached
assets when you cannot. What it does not give you is a basemap you have never
fetched, at an extent you have never visited.

But a widget that reaches a remote service is not the same as a workflow that
cannot run offline, and the distinction is the whole design. **Retrieval and
execution are separate.** Find health facilities and Street network download
fetch their data when you press their button, while there is a network, and store
it in the workflow. Running the workflow afterwards reads what was stored and
makes no request at all, so an offline run produces the same result as an online
one. This is enforced structurally rather than by good intentions: the executor
does not import the download functions, and two checks hold it there — a unit
test that runs a workflow with `fetch` replaced by a thrower, and a browser test
that goes offline and asserts no request reaches any data source.

What that leaves genuinely outside: data prepared outside the application
altogether, as the sea-level extract is, and any retrieval you have not performed
yet. A widget with nothing stored cannot invent it offline, and it says so rather
than failing obscurely.

So **prepare online, then work offline** remains the usable summary, with the caveat
that "prepare" now includes acquiring any remote data your workflow needs, not only
loading the application. The header no longer says "Available offline" (removed 2026-11-11 as
misleading): it was inferred from a single cached asset and was not a readiness check; see
[experiment 49](docs/experiments/49-catalog-in-the-interface.md).

## Design records

Every decision is recorded in [docs/experiments/](docs/experiments/), separating
proposed capabilities from implemented behaviour. Start with:

| Record | Subject |
| --- | --- |
| [Semantic audit procedure](docs/audits/ontology-audit.md) | Admission review and worked-example checkpoints across three dimensions — structure, semantics and relevance — opening with a glossary so the work can be reviewed without a background in description logic |
| [44 · Competency questions](docs/experiments/44-ontology-competency-questions.md) | The questions the ontology exists to answer, each with its status, and five it must refuse |
| [47 · Sea-level pack](docs/experiments/47-sea-level-pack.md) | The first widget pack use case, over the IPCC AR6 projections: what a browser can honestly consume, and the inundation claim it must refuse |
| [46 · Colour theme](docs/experiments/46-colour-theme.md) | Light, dark and device, and why the released light theme is pixel-identical |
| [45 · Ontology viewer](docs/experiments/45-ontology-viewer.md) | Why the reading view replaced the graph editor, and what a green build does and does not establish |
| [John Snow data sets](docs/research/john-snow-data-sets.md) | What the surviving 1854 data can and cannot support: the denominator that exists, the 578-point trap, and why case-level space-time is not available |
| [Prior art](docs/research/prior-art.md) | openEO, QGIS, Geo Engine and APE: what to adapt, what to evaluate, and the limits of each comparison |
| [Widget registry](widgets/README.md) | All 34 node identities with independent versions, port contracts and ontology mappings |
| [39 · STAC discovery](docs/experiments/39-stac-discovery-and-remote-acquisition.md) | Measured catalog behaviour and a proposed acquisition adapter |
| [40 · Reprojection](docs/experiments/40-reprojection-primitives.md) | The implemented UTM import path, and raster warping as specified but unbuilt |
| [41 · Validation Lab](docs/experiments/41-validation-lab.md) | Independent recomputation in Python, its boundary rules and results |
| [42 · Ontology structure and meaning](docs/experiments/42-ontology-structure-and-meaning.md) | An OWL 2 DL reasoner over the vocabulary: what it establishes, and why its consistency is currently unfalsifiable |
| [43 · Widget packs](docs/experiments/43-widget-packs.md) | Curated, governed packs carrying vocabulary, shapes, rules and worked examples |
| [48 · Tabular data](docs/experiments/48-tabular-input.md) | Long-format import, why a wide table is refused rather than reshaped, and what a table is forbidden to imply |
| [49 · Catalog and field readiness](docs/experiments/49-catalog-in-the-interface.md) | Preparing online then working offline: what the interface fails to say about readiness, and where the pack catalog belongs |
| [50 · Preparation checklist](docs/experiments/50-preparation-checklist.md) | An open developmental-evaluation item: why each checklist format encodes a different theory of failure, and what a cheap comparison would settle |
| [51 · Dataset profiles](docs/experiments/51-dataset-profiles.md) | What the problem type predicts about the data needed, the vintages that must agree, and why sources may be named only with their licence |
| [52 · Cacheable basemaps](docs/experiments/52-cacheable-basemaps.md) | Measured: a planet of vector tiles as one 138.7 GB file, Natural Earth context from 215 kB, and why a basemap is never an analytical frame |
| [53 · Reproducible maps](docs/experiments/53-reproducible-maps.md) | What a figure records and what it omits, why a live tile basemap cannot be reproduced at all, and an executable round-trip gate |
| [54 · Degrees of reproducibility](docs/experiments/54-degrees-of-reproducibility.md) | A ladder of input classes, why a figure inherits its weakest one, and what a report, publication or presentation each require |
| [55 · Embedded provenance](docs/experiments/55-embedded-provenance.md) | Visible stamps, RDF in SVG and signed manifests compared; why steganography is refused, and the disclosure trap in embedding receipts |
| [56 · The basis behind an identity](docs/experiments/56-basis-behind-identity.md) | A digest says which code ran, not what the method rests on: method provenance for widgets, and validation evidence a curator can cite |
| [57 · Parity evidence](docs/experiments/57-parity-evidence.md) | Independent recomputation as the evidence this project can actually produce: two widgets measured, 32 named as unchecked |
| [58 · Sea-level widgets](docs/experiments/58-sea-level-widgets.md) | Implementing a declaration-only pack in the host: why a pack that cannot ship code is a specification, and the three contract deviations |
| [59 · Pattern for engineered knowledge](docs/experiments/59-pattern-for-engineered-knowledge.md) | What the sea-level exercise taught: the knowledge is the durable artifact, the code is cheap, and governance built ahead of its operation created the problem |
| [60 · Person, place and time](docs/experiments/60-from-gis-studio-to-public-health-studio.md) | Measured: place is built out across 31 widgets and 12 port types, while person and time have no port type at all |
| [61 · Input dimensions](docs/experiments/61-input-dimensions.md) | The John Snow file carries 489 deaths in 250 rows: person and time belong to the input as declarations, and no new port type is needed |

## Repository contents

| Path | Contents |
| --- | --- |
| `src/` | TypeScript application: canvas, core execution, widgets, reasoning worker, service worker |
| `ontology/` | Vocabulary, SHACL shapes, N3 rules and synthetic examples |
| `widgets/` | Registry and per-widget release files with digests, and `packs.json`, the curated pack catalog |
| `tests/` | Unit tests and Chromium scenarios |
| `scripts/` | Validation, staging, source extraction and fixture export |
| `docs/` | Usage guide, worked examples, design experiments and research notes |
| `examples/old-naledi/` | Selected source data with provenance |
| `examples/john-snow/` | Pump and death locations, Snow's 1855 daily table, and the street graph, with provenance |
| `examples/snow-gboh/` | 1,852 houses with deaths and non-deaths, redistributed verbatim under its own licence; see its NOTICE |

## Publication and license

[Apache License 2.0](LICENSE). Third-party libraries and source datasets keep
their own licenses and attribution; bundled notices and provenance records are preserved.

A push to GitHub `main` runs `.github/workflows/pages.yml`: locked install,
type-check, build, unit and Chromium suites, then deploy to Pages only on
success. The staging script copies an explicit asset manifest and license files;
repository configuration, tests, source documents and secrets are excluded.
GitLab `main` runs the regression and security stages before publishing the same
assets. No access token is stored in either workflow.

## Keeping this README current

Update this file in the same change that adds or changes a widget, an accepted
input format, a workflow connection, storage or export behaviour, a deployment
step, or a prototype limit. Keep it short: step-by-step material belongs in
[the usage guide](docs/usage.md), and rationale belongs in the relevant
[design experiment](docs/experiments/), which should also carry a practitioner
exercise. Describe proposed capabilities separately from implemented behaviour,
date validation claims, and name the browsers actually exercised. Keep local
access tokens under `.secrets/`, which Git ignores and the static server blocks;
credentials are not needed to run the application.
