# TODO

_Created 2026-10-10 · Updated 2026-11-27_

The project's one list of open work. **Merged 2026-10-26 from two**: a root `TODO.md` of
deferred work created 2026-10-10 and a `docs/todo.md` of committed work created 2026-10-11, one
day apart, with the same subject and no declared split outside their own preambles. The
distinction they drew was real — committed to, against decided-to-do-later — and no name carried
it, so an item could only be routed by reading both files first. The practitioner, closing it:
*"I cannot say add TODO to TODO."*

It had already cost what duplication costs. One entry here records a capability sitting in one
file as "not built" while the other said "now done", so the project held a claim and its
refutation at the same time. The distinction survives below as sections, where a heading carries
it and a filename does not have to.

Items leave this list by being done or by being recorded as decided against, not by being
forgotten. Anything abandoned is struck with a reason rather than deleted, so the record of what
was declined survives. Dated, so that an item sitting here for weeks is visible as a choice.

## The goal this list is answerable to

To empower public health practitioners in the practical use of GIS in field
workflows — where it matters, and where resources and connectivity may be
scarce. Not to get everything working perfectly.

Read against that, the items below do not all serve the same people, and two
tensions are worth seeing before choosing what to do next.

**Reaches a practitioner in the field, offline.** Fieldwork itself precaches and
reports *Available offline*. A user manual shipped with it would too. Widget
correctness reaches them indirectly and certainly: they rely on the widget being
right and will never run the notebook that checks it.

**Written for people with connectivity, and that is correct.** The Validation
Lab is for Fieldwork developers and contributors, who work where there is a
network. Its need for connectivity on first use is a property of its audience,
not a defect — the earlier version of this section treated it as a failure
against the goal, which was wrong. What it does need is to **say so**: a
practitioner who wants to review a check offline has to learn the prerequisite
before they are in the field, not after.

**The Dive Deeper material is a different audience and a different problem.**
Learners are not contributors, and the material is the explanation surface
[94](experiments/94-where-explanation-belongs.md) assigned to the lab. They
reach the page while online — that is unavoidable, it is how they get it — so
the answer is to use that moment: **run every notebook once while connected**,
which both caches what the kernel needs and surfaces any failure while there is
still a network to fix it with. Offline availability becomes a setup step a
learner performs deliberately rather than a property they discover they lack.

**Serves us, not them.** The experiment-document standard, done 2026-10-11, was
an internal instrument, and [96](experiments/96-the-experiment-document.md) says
so in its own closing section: its beneficiaries are us and future contributors,
not a practitioner in the field.

Finished and declined items are in [docs/todo-history.md](docs/todo-history.md).

## Next, in order (2026-11-20; each item's status checked against the releases 2026-11-26)

1. **Done in 0.153.0 to 0.155.0.** Tabular data's sources as tabs: Your file, From an address, Census tables, Tide gauges with its map of every gauge, and DHIS2; the census and tide-gauge manual sections; the study area picker reading the boundaries repository.
1a. **Done in 0.167.0 and 0.168.0** (`tests/table-stress.test.mjs`, 13 tests): six made-up tables, each around one trap, through every step that takes a table, and the steps that read one through other ports (Cases by period, Rate, Space-time scan through Point data, Deduplicate records), a wide read, and 250,000 rows through Select, Total and Relate (each under 2 s in Node). Fixed: a refused run names its step; Total within groups says blank keys and near-identical names; Relate counts an empty cell; Cases by period refuses a blank count and counts what it leaves out; Rate gives no rate on a zero denominator; Deduplicate records does not merge two blanks. **Not stressed here:** Apply ruleset (its rules have their own tests, `rule-evaluation` and the rulesets example) and the three sea-level steps, whose tables have a fixed contract.
1b. Experiment [226](docs/experiments/226-table-operations-as-challenges.md), table operations as challenges: `example-table-operations`, one challenge per workflow, Walk me through or Solve it, scored at each run.
2. **Done in 0.154.0.** Raster streaming for GHS-POP over DR Congo: [GHS-POP over DR Congo is refused](#ghs-pop-over-dr-congo-is-refused-8-byte-cells-found-2026-11-19-streaming-decided-the-same-day).
3. **Spike run 2026-11-22** ([225](docs/experiments/225-webgpu-as-an-accelerator.md), tried): WebGPU on every browser tried, the gate's Chromium by one flag (a software adapter); a kernel density surface on the Mac's GPU about 40 times faster than the Rust kernel at 1,000,000 points, agreeing to 3 in a million at 100,000 and missing the 1 × 10⁻⁵ line by 1.5% at 1,000,000 (Metal reorders the compensated sum away). **Next, when a widget needs it:** summation the compiler cannot reorder, or the line decided; a receipt that says which path ran; Windows and a field laptop.
4. **Compared 2026-11-21:** the agent-based model beside Hagelloch's recorded curve (experiment 199, option 4): size and the bulk's timing agree; the recorded peak is twice as sharp (68 rashes on 5 to 7 December 1861). **Periods read from the record 2026-11-21** (`measles-hagelloch-from-the-record`: latent 6 to 11 days, prodrome 2 to 6): the timing agrees, half by day 30 against 29, the record inside the band on 72 of 83 days; the peak is still half the record's (13 against 26). **Fitted 2026-11-21** (`measles-hagelloch-fitted`, `scripts/abm-hagelloch-fit.mjs`): deviance 203 to 154, the record inside the band on 76 of 83 days, the peak 17 against 26; no setting of the three makes it, with these periods or narrower. The peak is class 1's burst (25 of 30 in four days). **A probability for each class tried 2026-11-21** (`measles-prodrome-rash-household-classes-village`, `--by-class`): no better (deviance 152, peak 16), and even class 1 at 0.6 a day leaves the peak at 14 to 17. **Infectiousness across the illness tried 2026-11-21** (kernel weights per state; `measles-hagelloch-fitted-split`): the best fit yet (deviance 143), the early prodrome 0.15 of its last days and the rash 0, as Pfeilsticker says the prodrome transmits; the peak still 16. **The record's dates checked 2026-11-21:** no weekday heaping, but the rashes are far more bunched than independent prodrome lengths allow (68 in three days; never above 58 in 10,000 shuffles): later prodromes are shorter. Either the dates were made so, or the rule of 1863 (infection to rash a constant 14 days) holds. **Both tried 2026-11-21:** the time to the rash fixed (12 to 13 days) makes the sharpest peak yet (three days' 95th 58 against 68) but fits worse (157); one gathering explains nothing (152). **The two joined 2026-11-22** (`measles-hagelloch-fitted-rash-fixed-split`, `--join`): deviance 126, the best yet; the peak day 23 (17 to 30) against 26 and the busiest three days' 95th 77 against 68, the record inside both for the first time. **Left:** the tail (the runs end by day 42, the record on 82); which reading of the dates holds ([item 29](#29-an-agent-based-model-in-the-browser-checked-against-starsim)).
5. **In place by 0.170.1** (the conditional-gating replay below says so; verification nightly on WebKit since 0.192.0). The gate: recorded copies of live services, from-scratch tests on several workers, and a live-service check on GitHub ([gating audit](docs/audits/gating-audit.md), Decided 2026-11-19).
6. **Done in 0.163.0:** Sample a raster, Keep points inside the area and Summarize points to polygons have theirs, and a test steps through all seven. ~~Show-me-how walkthroughs for spatial steps~~ (0.154.0 gave Area around a point, Buffer study area, Calculate area and Clip polygons theirs): batch 1, Join a table to the study area and Sample a raster; then batch 2, Keep points inside the area and Summarize points to polygons ([Comprehensibility](#comprehensibility-five-known-problems-actionable-now-2026-11-07)).
7. Census tables, experiment 224: 8 of 15 countries in by 0.155.0 (Brazil, Botswana, DR Congo, Kenya, Malawi, Nigeria, Rwanda, Sierra Leone). **Left:** the USA (an API key, or a file from www2.census.gov, the practitioner's decision); Zambia, Tanzania, Ghana; then the Philippines, Korea, Uganda; the five new countries paired with geoBoundaries' names; the licences of Brazil (none found), Malawi and Kenya (HDX's label against the office's "All Rights Reserved") ([224](docs/experiments/224-census-counts-as-a-table-source.md)).
8. **Done in 0.155.0:** DHIS2 as a fifth tab of Tabular data, a token from Credentials, tried against the Docker server (DHIS2 2.41.11, Sierra Leone's demonstration database). **Left:** synthetic vaccine-preventable-disease data on the test server ([DHIS2 as a table source](#dhis2-as-a-table-source-with-a-test-server-in-docker-asked-2026-11-19-widened-2026-11-20)).


### Threads from 2026-11-25 and 2026-11-26

- **WebKit's offline reload: answered in 0.204.0.** The reasoning worker loads from the offline cache in WebKit: the run
  after the offline reload completed in 5 of 5 local runs. What failed `tests/outputs.browser.mjs` (2 of 5) was
  WebKit reporting OpenStreetMap tiles cut off by the offline reload as page errors. The test now sets aside only
  cross-origin tile requests made while it holds the browser offline: 5 of 5 in WebKit, locally. Earlier local failures
  named `build/reasoning-worker.js`; that did not recur in five runs, and the service worker's refusal of it in other
  WebKit tests (below) is still open.
- **Table presented to a standard** (the practitioner, 2026-11-27: *"Since table outputs are render facing, we should be
  able to style them according to established table presentation standards"*; *"really look pretty but also vision
  impaired friendly"*. A widget enhancement; [the research](docs/research/table-presentation-standards-2026-11-27.md)).
  **Built in Table 0.15.0:** the agreed rules on every table in Results and in Configure…'s preview, and a Presentation
  section (title, decimal places, separators, absent values, shaded rows, notes, source). **Built in Table 0.16.0
  (0.205.0):** decimal places, unit and a numbered note per column; small counts hidden by a declared threshold; a
  count and its percentage in one cell for a table of rows; the write-up's and the draft's tables to the same rules.
  **Left:** a count and its percentage in one cell for tables of points and of polygon summaries; whether rounded
  parts that do not add to their total are said so. Measure: tables with a title, columns of numbers not
  right-aligned, columns mixing decimal places.
- **Worked examples as teaching material** ([audit](docs/audits/worked-example-standards-audit.md); the practitioner,
  2026-11-27: *"develop worked example standards or enhance what we have developed already to optimize the
  pedagogical value of worked examples"*). Today 5 of 12 catalogue examples have a manual walkthrough and its playback,
  none of the 11 built-in ones; the READMEs share no outline; no example says what a learner can do after it. To
  settle with the practitioner: what every example carries and in what order a learner meets it (the question and
  what it teaches, a manual for each workflow, a README to one outline, the widgets it teaches, where its numbers are
  checked, what to try next), and whether built-in examples get manuals. Measure: examples with each surface.
- **Previews that change something and show only words** ([audit](docs/audits/preview-audit.md), re-review
  2026-11-27; the practitioner: *"re-review / audit all the previews that are supposed to both render and not render
  previews and recorded reason for not rendering"*). **2026-11-28:** Convex hull, Mean center, Move points in a donut,
  Aggregate points to H3 cells, Measure distance and Compare point sets draw with `previewDrawing`; Cases by period draws
  its curve. Space-time scan's reason was in the code (the shuffles belong in the run); Sample a raster's satellite files
  are read in the run; five of the six display steps have a reason recorded. **Left:** 10 transforms neither draw nor
  show rows, one with no reason: **Apply ruleset (published)**, whose rows are reachable (`rulePreview`) and not shown.
  **Raster input** shows numbers with no reason. Measure: transforms that neither render nor say why.
- **Next batch, agreed 2026-11-27, in order:** (1) ~~an edit applied during a run~~, done in 0.204.7: Apply waits for the
  run and then applies; (2) ~~the write-up's and the export's tables to the table standard~~, done in 0.205.0; (3) the
  cooperative game's data model drafted in [233](docs/experiments/233-a-cooperative-turn-based-training-mission.md) as a
  second spike: schema, each role's read rules as testable checks, the turn-ending function, every move timestamped
  and attributed, provenance; nothing created in Supabase until the practitioner agrees it; (4)
  `find_literature_for_terms` from [232](docs/experiments/232-terms-looked-up-and-appraised.md)'s design, its two
  syntaxes read against their current documentation first.
- **A cooperative, turn-based training mission** ([233](docs/experiments/233-a-cooperative-turn-based-training-mission.md)):
  a research proposal written in a ChatGPT session, given 2026-11-26 to be written up and reviewed later. Nothing
  built. It is one more kind of teaching material, loosely coupled to Dive Deeper. For review: it would add
  Supabase as an outside service.
- **The code review** ([audit](docs/audits/code-review-2026-11-23.md)): acted on in 0.200.0, and the four live widgets
  it found drawn inline in `app.ts` moved out since (Apply ruleset in 0.201.0, the other three in 0.202.0). **Left:** the
  nightly WebKit run's time limit (the run of 2026-11-25 was cancelled at 1 h 15 min, [CI audit](docs/audits/ci-verification-audit.md)); widget release records still list `src/core.ts` where the
  step now lives in a `run-*.ts` module.
- **The Validation Lab** ([audit](docs/audits/validation-lab-audit.md)): items 1 to 5 acted on in 0.200.0, the lab's
  CI green again on 2026-11-26. **Left:**
  - item 6: every notebook in plain language, drafted and merged (validation-lab PR 1, 2026-11-26);
  - item 7: 12 widgets owe a check (Keep points inside the area, Compare point sets, Move points in a donut, Network isochrone, Measure
    distance, Point grid, Polygon layer, Rate with a denominator, Tabular data, Transmission chains, Line layer, Travel time over ground),
    and Find health facilities is blocked on a frozen response;
  - the ruleset extract-contract has no check; checks 23 and 25 record rulesets that are retired; check 50 needs its
    rasters laid out as the exporter expects.
- **0.202.0, from the practitioner's UI order of 2026-11-26** (high-contrast theme first): the theme, and Show me how
  ending on Map's scale for Summarize points to polygons and Aggregate points to H3 cells, with labels kept inside the
  drawing and Voronoi's catchments in one fill; and the last three inline Inspectors (Chart, Point data, Measure
  distance) out of `app.ts`; and the commentary sweep's first pass (below, Comprehensibility 1). **0.203.0:** the sweep's
  second pass, measured. **0.204.0:** buttons by role, ports by
  one blank port with kinds as symbols, WebKit's offline reload, and experiment 233's first spike (Supabase).

### Threads from 2026-11-22

- **Done, except Hagelloch's peak (4)** (checked 2026-11-26: batch D 0.169.0; travel time to care in the kernel 0.170.0 and as a widget 0.187.0; the gating replay 2026-11-22; Find health facilities on the standard Inspector 0.172.0). **Order set by the practitioner, 2026-11-22, later the same day:** the Inspector move's batch D (done in 0.169.0), then
  WebGPU (travel time to care, measured in the kernel first), then the conditional-gating replay; Hagelloch's peak (4)
  and Find health facilities after. Done before it: pins (09 closed), 1a (the table stress tests), 3 (the WebGPU spike).
- **Pins, experiment 09: closed 2026-11-22** (0.166.0 and 0.167.0; field order built, groups judged not needed). **Left,
  for the field:** a real phone, a real GPS fix, a real phone photo (HEIC) and a real handheld's GPX.
- **Built in 0.171.0 to 0.194.0** (Line layer 0.1.0 to 0.5.0: read from GPX, KML, KMZ or GeoJSON, or the border two study areas share, and drawn by hand with its direction; Area around a point took lines and areas in 0.178.0 and became Geometry buffer in 0.182.0). **Worked case resolved 2026-11-26:** the practitioner built it in a project of their own (the South Sudan and DR Congo border to a one-sided buffer to Find health facilities). **Left:** experiment 229, which still says the buffer is not built. **A line layer** (the practitioner, 2026-11-22: *"That's an important gap no line layer"*, *"Line layer can be
  transportation routes"*, *"Perhaps we can also use line layers in microplanning? Team routes?"*). Fieldwork holds
  points, areas, rasters and street networks, and no lines of their own: a GPS export's tracks are counted and left out
  of Point data. Uses named: transportation routes; vaccination teams' routes in microplanning, which ties it to the
  Nigeria immunization case study (teams' GPS tracks checked against the settlements they were to reach). Before any new
  widget, the closest existing one examined: **Street network** already reads OpenStreetMap ways as a graph and Map
  draws it, so a line layer may begin as Street network reading a GPX track or a KML line. Not yet designed.
  **What the evidence supports (read 2026-11-22):** no study isolates route planning; GPS tracking of teams against their
  assigned settlements consistently finds settlements never reached (Touray et al. 2016, northern Nigeria; Gali et al.
  2016, Kano; Atagbaza et al. 2021, Chad; all open, none controlled, all bundled with new maps and settlement lists).
  The WHO-UNICEF Geo-enabled Microplanning Handbook (2023) lists route optimisation and travel-time models among its
  four applications and GNSS tracking beside them, with case claims only; WHO AFRO's RED guide (2008) asks for roads
  and rivers on the map, no routes. So the case study's line layer is **planned against actual**: a team's track over
  its settlements, the unreached ones found; optimised routes are a planning convenience, not a coverage claim.
  GPEI's *Best practices in microplanning for polio eradication* (2018) makes a route per team per day standard: maps
  show where each team starts and finishes and the route from house to house, which vaccination follows. Gavi's
  evidence briefs (2023): of 24 microplanning studies, six measured effect, and they compare enhancements (GIS, GPS
  phones, community engagement) rather than microplanning against none; all eight GIS-mapping effectiveness studies were
  positive and none had a comparison group, so GIS mapping is rated "promising". A planned route beside each team's
  actual track is the case study's layer.
  **Designed 2026-11-22, with a buffer** (the practitioner: *"if I wanted to establish a mile buffer on the border line
  that becomes a buffer polygon and I can find health facilities just inside that buffer"*; then *"that widget can be
  useful for many things - transportation routes (lines), microplanning routes (lines), border (lines), border buffer
  (polygon)"*; then *"we can extend that widget - buffer around a point, line, polygon"*). Two parts, each with one
  output type:
  1. **Line layer**, a source whose output is always lines: a GPX track or KML/GeoJSON line (team routes), roads from
     OpenStreetMap (transportation routes), or two study areas' shared border.
  2. **Area around a point extended to lines and areas** (`buffer_point`): points, lines or areas in, always an area
     out; miles or km; an optional area to keep one side, as a border band kept to one country. Takes the use of the
     retired Buffer study area.
  First worked case: South Sudan and DR Congo → Line layer (shared border) → Area around… (1 mile, South Sudan's side)
  → Find health facilities. **To measure first:** buffering long lines and outlines of 163,000 vertices in the browser;
  which registers Find health facilities can query for South Sudan and DR Congo. **To decide in the design:** how the
  step says which side it kept; Map drawing lines; whether Keep points inside the area takes lines.
- **Built in 0.170.0 to 0.187.0:** the least time over a friction surface in the Rust kernel, checked against the Malaria Atlas Project's method on Kano to 0.022% (0.170.0); Kano at 30 m against 90 m on GRID3's walking surface (0.172.0); the widget **Travel time over ground** (0.187.0). **Left:** a WebGPU path, only where the kernel proves too slow; and its use in the Nigeria microplanning case study. **Travel time to care for Nigeria microplanning, the first use of WebGPU** (the practitioner, 2026-11-22: yes). For
  every 100 m cell of a state, the time to the nearest health facility over roads, paths and terrain: the accessibility
  modelling of the WHO-UNICEF geo-enabled microplanning handbook, beside the line layer above. **Measure first:** the
  same computation in the Rust kernel for one Nigerian state, timed; a WebGPU path only where the kernel is too slow,
  held to the kernel as experiment 225's spike was. **Needs:** a friction surface, the Malaria Atlas Project's (CC BY),
  its Nigeria coverage and licence read on its pages; no download without the practitioner's yes. **Also named, not
  ordered:** Brazil dengue's space-time scan at scale, the agent-based model over a health zone, density surfaces of
  many points.
- **Small multimodal models in the browser: deferred** (the practitioner, 2026-11-22: *"Let's defer small models work
  for later"*; no Chinese models for now). Researched that day from public pages only: Gemma 4 E2B (Apache 2.0, about
  3.2 GB for transformers.js with WebGPU) the one open, multilingual, document-reading candidate; LFM2.5-VL 1.6B (custom
  licence, unread) and SmolVLM 500M (English only) behind it. Nothing published on their speed in a browser, on maps at
  that size, or in Hausa or Swahili. Any use must build trainees' reasoning, never do it for them. Next, when taken up:
  time Gemma 4 E2B on Fieldwork's own charts and maps on an 8 GB laptop, with the practitioner's yes to a 3.2 GB download.
- **Study design's dialog** on the standard draft-until-Apply dialog: done in 0.167.0 (Study design 0.8.0).
- **Conditional gating, replayed again after the Inspector move: done 2026-11-22** (docs/audits/gating-audit.md,
  "Replayed 2026-11-22"). Over 24 releases a rule by changed file saves about 25 s of a 14-minute gate and would have
  missed nothing; not worth adopting. Item 5 is in place. **Open:** two workers in CI's verify, which would need an edit
  to `pages.yml` (asked); Brazil's from-scratch test, 8.8 minutes, the gate's floor.
- **Still open, worked around** (checked 2026-11-26): more test files block the service worker (0.199.0), and verification runs nightly on WebKit alone (0.192.0); why it refuses a same-origin script is still not known. **WebKit's service worker refuses the reasoning worker** ("due to access control checks"): blocked per test in three
  tests so far; at two workers in CI it failed 9 of 17 WebKit tests (0.170.1, 2026-11-23). Not yet known whether Safari
  users meet it outside tests, nor why the service worker refuses a same-origin script. Until understood, WebKit's verify
  runs one file at a time (docs/audits/gating-audit.md).
- **Columns whose values match** (the practitioner, 2026-11-22: "Can FW detect compatible keys between tables?", then
  "show the user on the UI which columns from different tables have potential matches", "Is it the same with append
  tables?"). Done in 0.167.0: Relate a column proposes the pair linking most and lists every pair sharing values;
  Append rows lists each table's columns matching the first's under another name, Stack under. Join a table to the
  study area already proposed its column. **Not done:** codes against names is only said, not bridged; "01" against
  "1" and a year against a date are not folded.
- **206 closed into 228** (2026-11-22): its five questions and the syndromic methods not yet offered are 228's open items.

### Threads from 0.154.0 and 0.155.0 (2026-11-20), not yet ordered

- **Detect unusual counts:** checked in the lab in Python (check 53, 0.162.0). Owed: the name review of "Detect unusual
  counts". Proposed 2026-11-21, not yet decided: Farrington flexible (Noufaily 2013) as a method, the seasonal baseline
  check 53 showed missing, then an ESSENCE-style regression on day of week; each checked against R's `surveillance`.
- **Done 2026-11-26** (Fieldwork 0.201.0, the example at 3e99e67, lab check 54; [228](docs/experiments/228-detect-unusual-counts.md)): the four definitions transcribed from NSSP's published queries, with ICD-10, ICD-11 (Fieldwork's translation, checked against WHO's 2026-01 release) and SNOMED CT (the GPS), the visits given discharge diagnoses, Apply ruleset's "has an item starting with" and quoted words, and a lab check agreeing visit for visit. ~~**The syndromic example on NSSP's definitions** (the practitioner, 2026-11-21: re-scoped to NSSP's, *"Both ICD-10,
  ICD-11, with free text"*, and SNOMED CT from the Global Patient Set). Syndromes ILI (ILI CCDD v1), broad acute
  respiratory (CDC Broad Acute Respiratory DD v1), norovirus (Norovirus v1, the seeded outbreak) and measles (CDC Measles
  CCDD v1); injury dropped, since NSSP has no general one. Each visit gains a discharge diagnosis in ICD-10, ICD-11 and
  SNOMED CT (GPS, CC BY-ND 4.0: terms quoted unaltered, exact codes only, SNOMED's attribution and the release in
  provenance); some missing or late. Apply ruleset gains *starts with*. Credited to CDC/NSSP with CDC's non-endorsement
  disclaimer. Before building: each NSSP query transcribed from its page, and every ICD-11 code checked in the current
  release.~~
- **206** closed into 228 on 2026-11-22; its questions are 228's open items.

- **Sentinel-2 from ESA's Zarr stores, for a worked example** ([227](docs/experiments/227-a-zarr-reader-for-sentinel.md);
  the practitioner, 2026-11-21). The spike reads a point by two byte ranges, checked against Planetary Computer at five
  places; no worked example lies in what the stores hold (Europe, from September 2021). Two threads: (1) watch the
  stores' coverage over Africa and our examples' places (Nigeria, Sierra Leone, Malawi, Kenya, Rio), and say when it
  arrives; (2) look for a European example, late 2021 onwards, that a 10 m vegetation or water layer would serve. Then
  the reader in a browser, an area rather than points, and Sentinel-1.
- **Private worked examples.** A worked example held in a private repository, listed only when the person's identity
  and a credential naming that repository (fine-grained, Contents: read) are both unlocked; read at its pinned commit
  with that credential, checked by digest, never offered for sharing or publishing. Nothing in this repository names
  any such example. Open: where such repositories live, and who creates them.
- **A synthetic worked example of venue covariates.** Venues generated from a stated model with known effects and
  deliberately uneven "mapping", so a learner can check what a count model with a population offset recovers and how
  mapping effort and population density mislead; only area totals shown, with a minimum count. Open: real boundaries
  with made-up venues, or a made-up geography. Needs a spatial count model and residual cluster tests in a tab.
- **Done in 0.155.0.** Table leftovers from the DR Congo workflow: After shows the rows as stored, then the crosstab; a long read names its value; the `measure` column a wide read makes is said as made by the read wherever it is offered.
- **Done in 0.172.0. The rest of the Inspector move** (the practitioner, 2026-11-22: *"rest of the Inspector move for app.ts"*), in five
  batches, one release each. **A, done in 0.164.0:** Cases by period, Rate, Select rows, Total within groups, Two-by-two,
  Regression. **B, done in 0.165.0:** Transmission chains, Space-time scan, Study design (now on the standard Inspector;
  its dialog the standard one since 0.167.0). **D done in 0.169.0** (Table output, Polygon layer, Georeferenced map image, Find satellite products, satellite files). **Done in 0.169.0 too:** Mean center, Donut and H3 geomasking, with Convex hull, Voronoi catchments and Network isochrone. **Done in 0.172.0:** from C, Find health facilities (Deduplicate records done
  in 0.168.0); Street network and Reachable junctions off the old catchment panel, which is gone; Show me how for the
  six steps of 0.169.0. Project to UTM retired into Table output in 0.169.0; E dropped, its three sea-level steps being retired.
- **Coastal sea-level:** the PSMSL archive reader; the framework's ontology terms, waiting on the practitioner's choice
  of the CF standard name for relative sea level.
- **Done in 0.155.0.** Boundary levels as published: Check this level says the level's own name where geoBoundaries
  states one (not "Unknown"), and its units beside each level of the country's census in Census tables, saying where
  no level, or two together, has as many.
- **The gate's gap:** the population example's run end to end needs the raster downloads, so the gate checks it opens
  from its pin, with its census and words, and no more. **It cost something, 2026-11-23:** neither workflow had run past Append rows since
  2026-11-20 (a census label the example's Select rows did not ask for; Botswana's names lost under two columns), and
  nothing saw it for three days. Fixed in 0.172.2 (experiment 209). Open: a check that runs the chain on small windows
  carried in the example, so the gate exercises it without the downloads.
- **Done in 0.173.0. GHS-POP read again from a local copy** (Raster input 0.15.0), measured on both countries'
  windows; experiment 209 records it.
- **First step done in 0.193.0 and 0.194.0:** the three questions answered 2026-11-24; Rate compares a numerator's period with a denominator's vintage on the year and says the gap (`fw:vintageGapYears`); Append rows says the years it stacks; `src/reference-period.ts` holds the period apart from any widget. **Left:** the steps after those two that experiment 230 names. ~~**Years carried and compared:** experiment 230, written 2026-11-23 and proposed, nothing built. Each source's year is
  recorded but only Rate compares two, as exact text. Three questions wait on the practitioner: year or month; whether a
  boundary's year counts beside the data's; and whether Append rows and Rate come first or every step at once.~~
- **Largely done in 0.195.0 to 0.199.0** ([wide-format audit](docs/audits/wide-format-audit.md), 2026-11-25: *"all user-facing tables should be presented wide"*): Data quality, Join a table to the study area and Detect unusual counts show the file's shape, a melted table is read back on its recorded key, and Append rows is left melted, deliberately. **Left:** the open list below, read against that audit, item by item; whether a reading should survive Append rows. **The long table on the surface** (docs/audits/melted-counts-audit.md, 2026-11-23). Two findings from the
  practitioner: a melted row count reported where a record count is read — 92,045 for 18,409 bat records, reaching the
  write-up's prose and the receipt's `fw:artifactRowCount` — and the shift of perspective every table dialog forces,
  *"high frequency confusion"*, because eight dialogs offer the long table's columns where the practitioner chose in
  the file's own shape. **Partly closed in 0.174.0:** a count says what it counts, on the Inspector, the metrics, the
  write-up's prose and the receipt, and a coordinate column reaches the steps after the import. **Open:** the table
  meta and rows-shown lines, the viewer's fallback note, Relate's two previews, `fw:artifactRowCount`, the eight
  dialogs that offer the long table's columns, and whether a line list should melt at all.
- **Done in 0.175.0.** Polygons from study areas drawn as context where points are over them, with the choice in
  Configure…; a study area's country outline for context; Point data reads Excel.
- **Done as a worked example**, `example-2026-drc-ebola` ("Ebola in DR Congo: mining sites and fruit bats"): the African Bat Database's occurrence records and the mining sites, the Kibali mine hand-pinned because the database does not hold it. **The bat roosts and the Kibali mine** (the practitioner, 2026-11-23): a small table of species joined to the African
  Bat Database through Relate, inner join, to filter it. After the population rasters. The database is CC BY 4.0,
  18,409 records of 312 species; its `Roost` column is "Yes" on 90 records, so it says where bats were recorded, not
  where they roost.

## Urgent

**Three assertions outlived what they asserted, in two days, and the fast gate cannot see any of
them.** Found 2026-10-30, by starting a gate rather than by any check run while the changes were
made. `notes-spike.browser.mjs` claimed the South London example holds **9 notes** — it has held
**13** since 2026-10-29, when the lessons of experiment 141 were exercised on it. `layer-marks`
asserted the Leaflet layer control says `(circle)` and `(star)` — it has named the layer the
practitioner owns since `879d56c`, also 2026-10-29, which was a deliberate change and left the
label composed from the shape behind. All three were fixed on 2026-10-30, and all three are the
same shape: **a deliberate change moved the thing, and an assertion elsewhere went on describing
where it used to be.**

The residual is the method. `npm run check:fast` does not run browser tests, so the loop that is
cheap enough to run constantly is blind to exactly the assertions that go stale this way — and the
two files affected were ones nobody was editing at the time, because the example and the layer
control are shared by ten suites. `c73002f` recorded the same failure mode on 2026-10-29 in its
own commit message (*"The fast gate does not run browser tests and I reran only the suites I had
touched"*), so this is the second recording and not a new finding.

What would close it is not more discipline. It is either a cheap way to run the suites that touch
a shared fixture when that fixture changes, or a count that is read rather than written — the
notes assertions now name the breakdown as well as the total, which makes the next drift legible
but does not prevent it.

**Verify a deploy by reaching it the way a reader does, not only by rerunning the suite there.**
Done 2026-10-27 and recorded because the finding was free: the first open of the published South
London example threw `Cannot read properties of null (reading 'outputs')`, and the practitioner's
view of it was *"Workflow stopped"* on a run that had completed. Fixed in `src/app.ts` and covered
by `tests/run-outlives-its-canvas.browser.mjs`.

The residual is the method, not the line. The gate had 576 browser checks on that commit across
both engines and could not have caught it, because the defect needs an **ordering** no test
performs: every import in the suite goes through the file input between runs, while the catalog's
fetch is the only import that lands inside one. So a post-deploy pass is worth keeping as its own
step, and what it should do is the sequence a reader does — arrive, fetch from the catalog, switch
workflow, run — rather than the assertions the suite already makes. Written up in
[142](experiments/142-an-epi-kernel-exercised.md).

**N3 evidence is unreadable, and colour is the smaller half of it.** Asked by the
practitioner on 2026-10-25: *"looking at N3 evidence, is there a way to make the N3
readable, like add color coding?"* Measured the same day before answering: a receipt for
two records already carries a **452-character line** — one subject with a dozen predicates
separated by `;`, which soft-wraps in `<pre id="n3-preview">` into a paragraph with no
structure. A real workflow is worse. So pretty-printing at the `;`, with predicates
indented under their subject, is the larger gain and turns that line into about twelve
readable ones. Collapsing the identical `@prefix` header into a `<details>` and grouping
triples by subject are cheap alongside it.

Syntax colour is then worth adding and needs no dependency: N3 has few token classes, so a
tokenizer is about forty lines. Three constraints decide how it is built. The panel is set
with `textContent` today and therefore cannot inject; highlighting means `innerHTML`, and
this N3 carries user data — node labels, filenames, IRIs out of imported files — so
escaping has to happen per token while tokenizing, never on the assembled string.
`tests/contrast.browser.mjs` already asserts WCAG AA for every rendered text element in
dark and holds light to its baseline, so the colours are enforced in both themes without
new machinery. And the displayed N3 must not become different N3: the receipt download and
the bytes the reasoner saw stay exactly as generated, so formatting is a display transform
and that boundary belongs in the code rather than in a comment.

**An interactive map should be able to reveal points in time order.** Proposed by the
practitioner on 2026-10-25: *"The data set for Hagelloch has time column and on the
interactive map we can actually have a progressive point reveal using the time column to
dictate display sequence using a 'play' button."* The data supports it — each Hagelloch
case carries `date_of_prodrome`, and `case_series` already declares which kind of date a
series was built from — and Snow's Soho deaths carry dates too, so one control would serve
both worked examples.

**Scoped by the practitioner the same day:** *"We only need the playback for maps where the
zoom level has all the data."* That is a refusal rule rather than a convenience. An
animation run over a viewport that excludes some cases shows a partial outbreak while
looking complete, and the reader has no way to see what was left out — the figure would be
wrong in the one direction a spot map is read for. So the control is offered only at a view
that contains every record being animated, with a fit-to-all-cases gesture to reach it
(`#fit-button` is the established one), and it says what is outside the view rather than
playing on. Settled by the practitioner the same day, on what the
condition means for a case-cluster layer: **all data points visible**. So it is not enough
that the records are present — each case must be drawn as itself. A clustered map does not
qualify while its cases are merged into aggregates, because a cluster of twelve animates as
one mark and the reader counts one. Two conditions together, then: every record drawn
individually, and every one of them inside the view. Where no zoom satisfies both — dense
data that only separates by zooming past the extent — playback is not offered at all, which
is the honest answer rather than animating something the reader will miscount.

**The naming is settled, and the two are told apart by what they replay.** The practitioner,
2026-10-25: *"the other playback is workflow build. This one is point and time column
related."* So `src/reveal-playback.ts` keeps "Play back the build" — it replays how the
*workflow* was assembled, widget by widget — and this one is named for the points and the
date column it reads. Neither may be called "playback" unqualified in the interface or in
the glossary, because the word alone no longer identifies either.

**And it must say which date it is animating.** `case_series` already carries a declared
date kind — onset, report, death, specimen collection — precisely so that a chart cannot
quietly relabel the series it was built from, and check 22 states that limit in as many
words. A time-ordered map is the same claim in another form: cases appearing by date of
death tell a different story from the same cases appearing by date of onset, and a reader
watching an animation has even less opportunity to check than a reader of an axis. The
declared kind travels with the control and is stated on the figure.

**Where the control lives, settled the same day.** *"the date column should be selectable
on the map Inspector panel"*, and *"play back options should only be visible when
interactive map is selected."* Both follow from the rule above rather than sitting beside
it: a static plot cannot animate, so offering the control there would be offering something
that cannot run, and the presentation select is already what decides between a static plot
and an interactive map.

Choosing the column on the map has a consequence worth taking with it. `case_series` picks a
date column AND declares its kind, and the pair is what stops a figure relabelling the
series it was built from. A column chosen on the map with no kind beside it loses exactly
that, so the Inspector asks for both — or inherits them from an upstream `case_series`
where one is wired, which is the better answer when it is available because then the curve
and the map cannot disagree about which date they are showing.

A new capability, so it wants an experiment record before the diff.

**A catalog entry should name the workflow it opens as.** The Worked examples section reports
FETCHABLE or AVAILABLE from a list of ids fetched on this device, because it cannot derive it: the
catalog id is `urn:fieldwork:example:south-london-1854` and the workflow carries
`exampleId: snow-south-london-1854`, which do not match. A record of what was fetched is honest
but it is not the same question as "is this example's workflow open here", and the two will
disagree the moment a practitioner deletes the workflow. An `opensAs` field naming the workflow id
would let the state be read from what is actually on the device.

**A WebKit service-worker error failed one gate, once.** `ruleset-example.browser.mjs` failed in
the 2026-10-24 gate on a page error reading `/127.0.0.1:4174/sw.js due to access control checks.`
-- not on its own assertions, which all passed -- and then passed 5 of 5 in isolation. The
signature matches the two messages already in `BROWSER_OWN`: suite pressure, not a defect.

**It is deliberately not filtered yet.** `tests/page-errors.mjs` filters by exact message and
documents the evidence for each, and one sighting is not evidence. Filtering this one is also
riskier than the other two: a service worker that fails to register means offline support is
silently gone, which is the application's central promise, and the string carries the test port so
an exact match would be brittle across `FIELDWORK_TEST_PORT`. Watch for a second sighting before
deciding; if it recurs, the question is whether registration is actually failing under load or
whether WebKit reports a cancelled fetch this way.

**Still open from that family:** `input-data-ui` says "Edits could not be saved on this device" on
its own, without going through `saveFailureMessage`, so the same misdirection is available there.
It was not touched because it was not what was reported, and a fix applied to a fraction of the
places that need it is how the swallowed-click problem kept being rediscovered.

**Measure OPFS against IndexedDB for large rasters, before changing anything.** A raster asset
currently goes through `storePDFs` into `evidence-storage.ts` as a single IndexedDB value. That is
fine for the 5.3 MB Snow plate and is the wrong shape for WorldPop: the national extracts measured
on 2026-10-24 are 293 MB and 1.18 GB, and an IndexedDB `put` of that size has to hold the whole
buffer in memory, while reading a window of the GeoTIFF has to pull it back out whole. OPFS would
allow a streamed write and a ranged read through `createSyncAccessHandle().read(buf, {at})`, which
is what geotiff.js wants.

That is an argument, not a measurement, and it is not a reason to rebuild storage yet. What would
settle it: write one 293 MB file both ways in both engines, and record whether the write succeeds
at all, the wall time, whether a ranged read works without materialising the file, and peak memory
where the engine reports it. Chromium offers `measureUserAgentSpecificMemory`; WebKit does not, so
that column will be partial and should say so. The Linux WebKit container
([experiment 135](experiments/135-linux-webkit-in-a-container.md)) is the instrument for half of
it. Run it at several sizes rather than one, because the useful result is where IndexedDB starts
to fail rather than how fast it is when it does not.

Constraints that apply whatever the measurement says: `createSyncAccessHandle` is worker-only,
which is no obstacle since three dedicated workers already exist, but raster IO would have to move
into one. Engine parity cannot be assumed -- handle locking, `flush()`, `getSize()` and error names
are reported to differ between Firefox and Safari -- and Safari still lacks `createWritable`, so
sync access handles rather than writable streams. Fieldwork gates on WebKit because of Tauri, so
this is tested rather than read off a support table.

**Should deleting a project be refused while a workflow is running?** `deleteProject` carries no
busy guard, unlike every neighbouring handler. Found 2026-10-24 while surveying the controls that
silently swallow a click during a run ([experiment
135](experiments/135-linux-webkit-in-a-container.md)), and deliberately left alone: the others were
a control saying nothing when it had a guard, and this is the opposite question — whether it should
have one. Deleting the project whose workflow is mid-run is a different risk from opening a dialog.

**One chromium failure is still unexplained.** `large-network-storage.browser.mjs:25` spent 4.4
minutes against a 240-second budget on a runner, 2026-10-20. It was not reproduced in the Linux
container and is not covered by either finding in experiment 135: the resource reading was
retracted for the two WebKit tests, not for this one.

**Storage is capped by the smallest store the browser offers, and nothing chose it.**
_Acted on 2026-10-20 for payloads: street networks now live in IndexedDB and the workflow keeps a
digest. What remains is below — the study-area budgets are still sized against `localStorage`,
nothing is ever deleted from the payload store, and the write has not been timed._
The study-area budgets in decision A03 — 1 MiB per extent, 1.5 MiB across revisions — are sized
against `localStorage`, measured at 5,226,496 bytes in both engines. The same probe measured
IndexedDB, Cache and OPFS at **10.7 GB in Chromium and 1.0 GB in WebKit**: 200x to 2,000x more.
The practitioner, 2026-10-19: *"Just curious can be we storage that can store bigger sizes of
artifacts?"* Recorded as [121](experiments/121-storage-beyond-local-storage.md).

The blocking unknown is not capacity but persistence: nothing has measured what
`navigator.storage.persist()` grants in either engine, and a study area that is silently evicted
would be worse than one refused up front. That probe is what 121 names as its closing condition,
and it also decides where a PMTiles extract should live.

**A mechanism for "below": nothing compares a release's claims to its code.**
The practitioner's method is to look back, forward, sideways, above and below
([105](experiments/105-five-directions.md)). Back and forward were mechanised on 2026-10-12;
sideways is half-mechanised; above cannot be and should not be. **Below has nothing**, and it is
where today's substantive findings came from: `implementationStatus: 'retired'` is a declared
state no file in `src/` reads; eight sites convert metres through a constant that no release
mentions; four port names encode a use and port names are not in the release files at all. Each
was found by hand. The narrowest useful start is a check that a declared `implementationStatus`
has an effect — which Phase 2 of the shrink needs anyway.

**1 · Sweep the four criteria that have never reached the existing set.**
`npm run validate:admission` reports 8 of 12 criteria swept since they last changed and 3 across
the whole set of 51. Outstanding: **D3 and D4 sampled at 6 of 39 rather than applied** — the
audit's own "separate task", named in October and never scheduled — **D4a partial** with the
custom-stud port types enumerated and undispositioned, and **D5, D8, D8a, D6 never swept**. D5
and D8 are recorded as contestable: whether a qualifier sits on the input, and whether a test
exercises a distinction, are both readable off built code, so calling them design-time only was
quicker than true. Record: [104](experiments/104-admission-is-not-permanent.md).

This comes before the merges because it may change what merges. D1, D2 and D7 were swept on
2026-10-12 and each sweep found something: two kinds not four, a merge D2 had recorded without
deciding, and four port names encoding a use. Four unswept criteria across 51 widgets is the
larger remaining unknown.

**2 · Shrink the widget set. The plan exists and was never executed.**
Confirmed as the direction by the practitioner on 2026-10-12: *"as the framework emerges we
should respect the outcome of the emergence direction. Right now we have too many widgets that
should be retired because they are duplicates or composites."*

[64](experiments/64-widget-streamlining.md) is that refactor, sequenced by risk to saved work
and written on 2026-10-09 against 39 widgets. **Phase 1 is done** — `raster_input`'s
description was corrected and the release records it. **Phases 2 to 6 are not**, and the set
has since grown to **51**, which is the thing 64 warned about in its own opening: every finding
"gets more expensive as the set grows", and three of them "are already being copied by each new
widget that follows the existing pattern". Twelve widgets were added without going through D1
in the audit's table.

The retirement mechanism is already designed, in Phase 2, and is the reason this is safe: a
retired node type **stays executable**, so every saved workflow and every frozen fixture still
runs; and its release file **records the retirement and what replaces it** rather than being
deleted.

**A retired widget never runs**, which is the practitioner's rule of 2026-10-12: a saved
workflow holding one should cease to work unless the widget can be replaced by an existing one.
Replaceable means the adapter rewrites the node *and says so*; not replaceable means the
workflow refuses to open, naming the widget. Half of this already works —
`healthsites_discovery`, `output`, `places` and `centers` all migrate today, and an unknown type
is already refused — but the migrations are **silent** and the refusal says only "Invalid or
duplicate node". Those two are the work. It also answers *"by whom?"*: there are no external
owners, only the seven shipped examples and the frozen fixtures this project owns, so the
"risk to saved work" that sequenced [64](experiments/64-widget-streamlining.md) was weighted for
owners who do not exist.

**Retired means archived, not merely unaddable** — the practitioner's correction of 2026-10-12:
a widget absent from the add-palette but still in the catalogue, the counts and search is still
occupying attention. It must be absent from the palette, from node search, from the catalogue
list and its count, from `classification.json`'s counts and from `check-coverage.json` — so a
retired widget stops owing a lab check — and absent from the Inspector too, since a retired widget never
runs. `docs/usage.md` keeps it in a retired section so an old workflow can still be looked up.

**~~And Phase 2's first task is not retiring anything.~~ DONE, and this line was still being
read as a reason not to start.** It said `implementationStatus: 'retired'` was a valid value no
release used and **no file in `src/` read**, so the state was declarable and inert and honouring
it came first. That was true when written. It is false now: `src/palette.ts` derives
`RETIRED_FROM_PALETTE` from the declared status, its own comment records that this is what makes
a retirement take effect *"everywhere at once — palette, node search, the catalogue and its
counts"*, and **eight widgets are retired through it today**.

So the prerequisite is met and the only thing between this plan and a smaller palette is the
decision to remove. Corrected 2026-10-25, on the practitioner's: *"we keep on relitigating what
we have solved already by putting up blockers for why we cannot remove them. I think it's about
time we remove with impunity."* This paragraph is the instance they are describing. The
remaining caution in this section was weighted for external owners that [64](experiments/64-widget-streamlining.md)
itself later found do not exist — *"there are no external owners, only the seven shipped examples
and the frozen fixtures this project owns"* — so the adapters protect work this project can fix
in the same commit.

What is retirable without contradicting D1:

| | |
| --- | --- |
| **Duplicates** | `nearest`, `access`, `slr_site_assignment` are three implementations of nearest-neighbour-with-distance. **2026-11-09: `slr_site_assignment` retired into Measure distance (`nearest`) and Relate, after a table port learned to read a distances result ([197](experiments/197-the-sea-level-widgets-retire.md)).** **`nearest` is the general one and the other two merge into it** ([103](experiments/103-duplicates-should-merge.md)), but it must be made general first — its ports are named `places` and `centers` after the heat demo, and the three emit three different port types, so this is port work ([66](experiments/66-ports-as-schema-binding.md)) and not a rename. `output` is a generic display against three typed ones. `summarize_points_to_polygon`, `aggregate_points_to_h3_cell`, `case_series` are one group-and-aggregate over three keys, but each is asked for by name, so that is code factoring and not a palette retirement |
| **Example-bound** | `places`, `centers`, `alert`, `facilities`, `samples`, `xpert`, `policy`, `access_policy`, `comparison_map`. `places` and `centers` already migrate into `observations`, so seven remain |

Roughly ten palette retirements, taking 51 to about 41, plus code-level factoring that changes
no palette entry.

**Utilisation is runs, not appearances. BUILT 2026-10-26; what remains is below.** The
practitioner, defining the term: *"use is defined as widget connected to another and run in a
workflow, that's a use instance, regardless of whether it's in a worked example, a user developed
one or an imported one."*

That is a different measure from the one this project has. `npm run usage:widgets` counts **node
types appearing in example templates** — an appearance in something shipped — and AGENTS.md names
it as the instrument for D10. Under the definition above it answers a narrower question, and the
two should not be confused: a widget can appear in five examples nobody runs, or be run daily in
workflows nobody shipped.

**The data already exists and is discarded.** `WorkflowRun.trace` is
`{nodeId, type, milliseconds}[]`, produced by every run, so each execution already records which
widget types ran, connected, in a real workflow. `src/app.ts` reads it for a one-line summary and
drops it. The smallest honest implementation is to accumulate it: a local tally of type → count
and last-run date, written where the app already writes, surfaced in the widget catalogue beside
each entry.

**What was built**, the same day: `src/widget-usage.ts` accumulates a tally from every run's
`trace`, `src/app.ts` records it when a run completes, and the widget catalogue carries a **Runs
here** column with the limit stated beside it. A run counts once per widget TYPE, not once per
node — a workflow with three map outputs is one use of `map_output`, because counting nodes would
make a habit of duplicating a step look like evidence of its worth. A node placed and abandoned
never counts: the tally is written from what executed.

**What remains:**

- **Nothing reads the tally but a human.** It informs no ratchet. The obvious use is the
  retirement argument — a widget at zero runs is a candidate — but a count from one browser is
  thin evidence for a decision affecting everyone, so what it may be used FOR needs deciding
  before it is wired to anything.
- **Two measures now have similar names.** `usage:widgets` counts appearances in shipped
  examples and AGENTS.md names it as the D10 instrument; this counts runs here. They should be
  named apart before somebody cites the wrong one.
- **No way to clear it on request.** `forgetRuns()` exists and nothing calls it, so a
  practitioner who wants the count gone must clear all site data and lose their workflows with it.
- **Untested in the browser.** No test asserts that running a workflow increments the column.

**The limit, in the practitioner's own words**, 2026-10-26: *"since the app is browser based and
does not include what other browsers do, the use stats is only good for that one specific browser
for that one specific user."* Not that person's use — a second browser keeps its own tally — and
certainly not the field's.

**Strictly local, and that is not a limitation to apologise for.** This application sends nothing
and is built to run offline; a utilisation count that phoned home would contradict the premise
([the directions register](directions.json)'s `fieldwork-bounds-what-it-controls`). What it buys
is still real: a practitioner can see which widgets they actually use, and this project can see
which of the 47 earn their place on the evidence of runs rather than on the evidence of being
mentioned in a template. That is the measure
`streamlining-measures-confusion-and-duplication` says does not exist, arriving from the one
direction that needs no new instrumentation at all.

**A third category, and the one that changes the count: a declaration wearing a node type.**
Added 2026-10-25, when the practitioner looked at the palette and asked *"why do we still have
the heat alert as a widget under inputs?"*, then *"that looks to me like a ruleset widget
function"*, then *"so that sea-level projection extract sounds about the same"*. All three are
the same observation, and the table above splits them across two rows that hide it.

A declaration is not an operation. `alert` declares `{active, date}`, takes no input, emits a
bespoke port type consumed by exactly one widget, and contributes two facts — `fw:alertKnown`
and `fw:heatAlert` — asserted inside the rule application's own fact generator. The *other*
declared value that same ruleset needs, the distance threshold, is already a parameter on
`policy` carried by `bindParameters`. So the mechanism exists and is in use, and `alert` is the
one declared value that was given a node type instead of a knob.

`slr_extract_import` is the same shape: it computes nothing, hands its input table back with a
provenance bag attached — `projectionTable` is `{...extract.table, projection:{…}}` — and every
knob is a declaration. It is the harder case, because its domain content is in TypeScript rather
than in data: `PROJECTION_KEYS`, `BASIS_KINDS` (`workflow` / `confidence-pbox`), `VALUE_UNITS`
(metre / millimetre) and the vertical-land-motion family pair. The generic operation underneath
is domain-agnostic and worth having — *declare an imported table as an extract of a published
dataset, with its citations, baseline, units and key columns, and refuse to proceed until that
is stated* — and it would serve WorldPop, a census or a ministry's facility register equally.
Those four constants are what make it sea-level-specific, and they are data. The precedent for
moving exactly this kind of thing out of code is `rulesets/outreach-criteria/1.0.0.json`, which
is what the `ruleset-as-declared-data` blocker was lifted for.

**And the pack is gone, which removes the place a domain widget could live.** The practitioner,
same day: *"widgets are supposed to be domain agnostic"* and *"we abandoned the pack idea (e.g.,
sea-level rise)"*. This file says in two places that pack work is **postponed**, citing
[67](experiments/67-sample-raster-at-points.md), and the coverage analysis leans on it — *"its
weakness is owned — all pack work is deliberately postponed and the record says so."* Postponed
is now the wrong word. Those sentences are left standing with their dates; this is the
correction. Recorded as `domain-belongs-in-data-not-in-widgets` in
[directions.json](directions.json).

What that exposes is not three awkward widgets but a check nobody was making. `classifyWidgets`
derives standard-vs-domain from the **pack namespace alone**. Measured 2026-10-25: 3 of 49 live
widgets are classified `domain` and all three are the sea-level pack, and nothing verifies that a
widget classified `standard` is actually domain-agnostic — which is how `alert` passes as
standard while its own release says `example-specific`, its title is "Heat alert" and it asserts
`fw:heatAlert`. That check is mechanisable, which AGENTS.md says to prefer over a rule people
must remember.

The three sea-level widgets have three different dispositions and must not be swept together:
`slr_site_assignment` is already in the Duplicates row as a one-off of
nearest-neighbour-with-distance; `slr_extract_import` is a declaration, as above;
`slr_threshold_comparison` this file has judged *"genuinely domain-bound"*, which under the new
direction is a question rather than a settled exemption.

**The sea-level knowledge is kept, and it already has a home.** The practitioner, asked whether
retiring the pack meant losing it: *"we already address that in the Manila example."* It does —
`src/sea-level-example.ts` is Manila coastal exposure, shipped as worked example 08, carrying 60
OpenStreetMap health facilities in a Manila box, the eight published AR6 tide gauges for the
Philippines and the 288-value projection extract, with both licences travelling with it. So this
is a refactor and not a deletion.

It also settles why the pack was never needed. A worked example is defined in the
[glossary](glossary.md) as a teaching artifact and a regression fixture at once, carrying a
workflow, bundled data with provenance and digests, and its own limits — and it is the **only**
artifact that demonstrates composition rather than declaring it. That is already the sanctioned
place for domain knowledge, and it is data. The pack was a second mechanism for the same job,
aimed at external owners [64](experiments/64-widget-streamlining.md) later found do not exist:
*"there are no external owners, only the seven shipped examples and the frozen fixtures this
project owns."* Manila was carrying the domain the whole time while the pack carried the
governance for carrying it.

**The order is not retirement-first**, which is where this started and was wrong. Checked
2026-10-12: no affected workflow is completely replaceable, because "replaceable" means a current
widget declares a `migrationFrom` adapter and only four types in the registry have one. The
cheapest real move is making `nearest` general, after which two widgets have something to merge
into; and four of the candidates — `alert`, `policy`, `access_policy`, `xpert` — need a general
rule-application widget to merge into, which would be one widget in for four out.
*(Reworded 2026-10-19 off the withdrawn term; the claim that it does not exist predates
`apply_ruleset` and is worth re-checking.)*

**One fork needs deciding before the work starts.** 64 states flatly that **no composite leaves
the palette**, and D1 agrees: a composite asked for by name stays, because factoring it on the
canvas makes a practitioner wire three nodes to ask one question. That is also what
[94](experiments/94-where-explanation-belongs.md) concluded about cognitive load and what
[93](experiments/93-gamification-spike.md) recorded as the practitioner's own measure — fewest
widgets to reach an output. So "retire composites" has two readings: the narrow one above
(duplicates, and composites nobody asks for by name), or retiring all 19 composites, which
would shrink the palette and grow every workflow. The narrow reading is the one the record
supports; the wide one is a reversal and would need saying so explicitly.

**3 · The 13 computing widgets still with no lab check.**
32 widgets owe an independent check and 19 have one, counted by
`validate:check-coverage` and visible in every run.
[widgets/check-coverage.json](../widgets/check-coverage.json) declares what each of the 51
owes, with a reason for every exemption; the awaiting count can only fall.
Record: [98](experiments/98-the-coverage-ratchet.md), which groups the remaining 13 by the
external implementation that would check them, because the cost is the reference and the
fixture rather than the widget. Seven of the thirteen done came from the shapely group and
shared two fixture helpers, so they were cheaper than the rest. The two buffer widgets, checked
against theory because nothing equivalent exists to compare them with, and the two that left
the group entirely — `21-hex` against h3-py, `22-case-series` against pandas — cost more per
check and found more.

Each notebook has two parts, not one ([94](experiments/94-where-explanation-belongs.md)).
**Parity** recomputes independently for a reviewer. **Dive deeper** varies the assumption the
widget inherits and shows what it does to the answer. `10-hull` through `22-case-series` are the worked
instances. Two reported a consequence that argued against the warning the section was
written to make, and one found that its own fixture does not contain the hard case at all —
no location on a polygon edge — so the notebook constructs it. Expect that to recur.

Two constraints on the grouping, both learned rather than designed:
`sample_raster` needs its own notebook, because requesting `rasterio` beside `pyproj` kills
the kernel ([97](experiments/97-the-browser-kernel-gate.md)); and `buffer_area` and
`buffer_point` will not agree exactly with shapely, so their criterion must state an area
tolerance with the quadrant count declared rather than claim an agreement that is not there.

**4 · There is no user manual.**
[docs/usage.md](usage.md) is a reference for what the application does, written
when the practitioner detail moved out of the README. It is not a manual that
teaches a method, and two things have now been found to need one:

- **Composing micro-workflows as problem decomposition.** The skill is in
  building one, not reading one ([94](experiments/94-where-explanation-belongs.md)),
  so it needs instruction and an exercise rather than a feature description. The
  exercise should start away from the canvas: understanding the problem is where
  the time pays, and a manual that opens by placing nodes teaches the opposite
  ([93](experiments/93-gamification-spike.md)).
- **What a widget actually does**, at the level a practitioner needs before
  choosing it. The Dive Deeper notebooks carry the depth; a manual has to carry
  the route to them.

Not urgent against the items above, and recorded now because it has been
implied twice in two days and never written down.

**A classic analysis package command set is a coverage checklist for the palette.** _Raised 2026-10-26: the practitioner observed that a results panel reads like the outputs of commands that each have an input and an output, and that the commands carry parameters (Fieldwork's knobs) that modify the outputs._ That is a structural correspondence, not an analogy: **a command is a widget** —
input, output, and parameters that are our knobs — and a results panel is the stream of their
outputs.

**What that command set IS**, stated 2026-10-26: *"codified knowledge for field epidemiology
practice. That is what they teach to FETP trainees in more than 80 countries. And to Epidemic
Intelligence Services Officers at CDC."* So it is the discipline's operation set rather than one
tool's API — which is why it can serve as a coverage checklist without further warrant, and
why an absence in the table below is a gap against what practitioners were TRAINED to do rather
than against a competitor's feature list.

It also adjusts D1. This project exposes a primitive when a workflow needs it, not in advance;
for an operation in the taught curriculum the need is established by the discipline, so MERGE,
RELATE and MATCH are not speculative additions waiting for a local example to justify them.

What it buys is a palette gap analysis grounded in a mature tool instead of invented. The 48
modules in its programming modules split into `classic-*`, the original command set
ported, and `epi-ai-*`, the browser-era additions (GIS, record linkage, space-time clustering,
data quality). Read against this palette, FROM FILENAMES ONLY and therefore a list to verify
rather than a finding:

| Command | Here |
| --- | --- |
| `SELECT` | `select_rows`, built 2026-10-26 |
| `IF`/`THEN` | `apply_ruleset` authored rules |
| `SORT` | inside `apply_ruleset`, for a rule reading the previous row (188) |
| `DEFINE`/`ASSIGN` | `apply_ruleset` computed values, since 2026-11-08 (188); `derive_value` retired into it |
| `GRAPH` | `chart_output` |
| `RELATE` | `relate_table`, built 2026-10-26 — a CATEGORY across a shared key |
| **`MERGE`, `MATCH`** | **nothing**. Named in `src/relate-table.ts` so neither is reached by widening it: `MERGE` brings measures across and adds ROWS, `MATCH` is approximate linkage |
| `GROUP` | `group_table`, built 2026-10-26 — sum only, because summing a rate has no referent |
| `TABLES` | `two_by_two`, built 2026-10-26 — risk, risk ratio, odds ratio, risk difference. **Not** the tests |
| `FREQ`, `MEANS`, `SORT`, `RECODE`, `LOGISTIC` | nothing |

**The join was the headline, and splitting it into three was the point.** What this project
recorded as a single missing capability since 0.12.0 — nothing joins two tables on a shared column —
is THREE commands in a classic analysis package, and only the narrowest of them was needed: a long table's value
column holds only numbers, so a category brought across can only be a key column and the row count
does not change. That is `RELATE`, built 2026-10-26. Reading the command set as three operations
rather than one is what kept `relate_table` from being a general join nobody had specified. It
blocks the Manila example from reporting a projection, blocks the people-denominated 2x2 from
being built here, and is the reason both are prepared outside. It is a standard operation, not a
local wish.

**The deprecations are NOT a list of unnecessary operations, and this file said they were.**
Corrected 2026-10-26 by the practitioner: that the deprecations were mostly about a browser application against a desktop one, and that some commands carried security risks
Checked in an earlier engine's compatibility registry, whose browser policy is
a three-way vocabulary — `candidate`, reproducible through typed browser operations;
`adapt-required`, where legacy behaviour depends on files, databases, printers, destructive state
or UI effects; and `blocked`, where *"ambient desktop authority is not reproduced"* and legacy
`EXECUTE` *"cannot launch arbitrary processes, scripts, DLLs, or shell commands"* — under the
invariant that *"adaptation never grants a command direct DOM, network, credential, filesystem,
database, or process authority."*

So that axis is platform and security, not epidemiological necessity, and it says nothing about a
palette at 49 against a target of 41. What it IS directly relevant to is that this application is
also browser-based, offline-first, and holds credentials, imported files and local storage —
so a sibling project's reasoning about what a browser may be trusted with is reusable here, where
its reasoning about which analyses matter was never the point.

**Three things from that register worth taking, recorded so they are not lost:**

- **A disposition vocabulary.** `preserve, adapt, defer, extend, retire`, with a lifecycle that
  separates `deprecated` — *"still visible and supported during a documented transition"* —
  from `retired` — *"removed only after explicit review, replacement documentation, and release
  communication."* This project has a boolean `retired` in `classification.json` and conflates
  the two, which is exactly the distinction its own policy drew on 2026-10-26 when it said
  removal is licensed now and a notice will be owed once there are users.
- **The reference adaptation pattern**, which they name on `WRITE`: request a capability only
  through a user gesture, validate and preview before a mutation, audit the result, offer a
  portable fallback. That is a checklist this application could hold its own file, credential and
  export paths to.
- **"Unsupported source remains visible and portable."** A program using an unsupported command
  still opens and can be read. This project chose the opposite on 2026-10-26 — a workflow
  holding a retired widget REFUSES TO OPEN — on the reasoning that a retired widget never runs.
  Both are defensible; the alternative was never considered, and "opens but will not run" keeps a
  practitioner's work inspectable where refusing to open does not. Worth revisiting before the
  next retirement, not after.

Read the register before the next retirement.

Do not treat the table above as scope. Several of those commands are large (`LOGISTIC` is
regression), and the checklist's value is knowing what is absent, not committing to fill it.

**A 2x2 invites a reading Fieldwork cannot yet support.** _Raised 2026-10-26: trained readers will look for the two-by-two layout they were taught._ Checked against
an earlier engine's `Table2x2Result` contract, which returns **totals** (exposed, unexposed, cases,
non-cases, overall), **estimates** (risk in exposed and unexposed, risk ratio with a Katz-log
interval, odds ratio with Wald-log, risk difference with Wald-unpooled, conditional odds ratio),
**tests** (Pearson, Mantel-Haenszel, Yates, Fisher exact, mid-P) and **diagnostics** (expected
cell counts and warnings). Fieldwork shows the counts and the margins: the totals line, and
nothing else.

**The estimand is the sharp part, not the feature count.** `rate_ratio` computes a RATE ratio --
events per unit, log-normal interval -- and the derived 2x2 is RISK-shaped: cases against
non-cases. A reader trained on a classic analysis package's layout will expect a risk ratio and an odds ratio, and
may take the 8.40 already on the canvas for one of them. It is neither. That is a misreading the
application currently invites by drawing the table and offering the wrong measure beside it.

Smallest honest step, if this is taken: risk in each group, the risk ratio and the odds ratio,
each with the interval method NAMED as a classic analysis package names its own, and each with a lab check against
an independent implementation before it is claimed. Lab check 27 is the precedent and the
warning: it found `rate_ratio` using a rounded 1.9600 for the normal quantile. Chi-square, Fisher
and mid-P are a larger piece and should not be started to meet a date.

**Which source is authoritative for what**, established by the practitioner 2026-10-26: an earlier engine's **epi kernel was synthesized from the original package's codebase**, which is public on
GitHub; the rest of that project — its GIS kernel, adaptive learning kernel, evidence generation
kernel, and its new and deprecated programming commands — are improvements and adaptations for a
browser environment. So:

| For | Go to |
| --- | --- |
| statistical behaviour: formulas, interval methods, the Fisher ordering and its `1.000001` tolerance, chi-square variants, warning thresholds | **the original package's source**, as the thing being matched |
| contract shape, result vocabulary, how a browser expresses it, and what was held to what tolerance | **an earlier engine of the practitioner's own** |
| what an FETP-trained reader expects to see | the original's output layout and labels |

A name in an earlier engine's contract is a faithful description of the original's behaviour, not an
independent choice, so it can be read as a pointer INTO the original rather than as a
specification to implement against.

**Two things to check before copying anything.** The licence: the package is generally public domain, but this project records a licence IRI, a digest and a retrieval date
for every source it carries, and source code deserves that at least as much as a CSV.
Reimplementing a documented method from reading it is not the same act as lifting an
implementation, and which one was done belongs in the experiment.

**And a second thing worth reading for its own sake.** an earlier engine of the practitioner's own made DEPRECATION decisions
about the original's programming commands. A sibling project deciding which of a mature command
set to drop, and why, is directly relevant to this project's own widget retirement work — where
the budget stands at 49 against a target of 41 and the plan has been written for weeks. That is
not a 2x2 question and should not be bundled into one.

**The approach is settled and the register has it.** Not parity — an epi kernel of our own,
with the LAYOUT patterned after a classic analysis package so a reader needs no translation. See
[directions.json](directions.json), `recognisable-not-identical-an-epi-kernel-of-our-own`. The
cost of the alternative is concrete: `legacyBreslowDayOddsRatio` directly ports a Woolf weighted
log-odds dispersion that the legacy output LABELS "Breslow-Day", so bit-for-bit parity imports a
statistic named as something it is not.

**BUILT 2026-10-26**, in the narrow form and not in full. See
[142](docs/experiments/142-an-epi-kernel-exercised.md). `relate_table`, `group_table` and
`two_by_two` ship; the South London contingency table is now DERIVED from the two CSVs the example
already shipped, rather than inlined with an empty digest; risk, the risk ratio, the odds ratio and
the risk difference each name their interval method and are checked against statsmodels to 1e-9 in
lab check 30. The tests are not built and should not be started to meet a date.

**AND THE PARAGRAPH ABOVE WAS WRONG ABOUT WHY.** It said the estimand was the sharp part: a RATE
ratio of 8.40 beside a RISK-shaped 2x2. Check 30's fixture refuted that before the widget shipped.
A risk ratio over the same houses is `8.401853429780243` — the rate ratio's value **bit for bit**,
because deaths per house IS a risk when a house holds at most one death, so the two are the same
division; only the intervals differ, and only in the second decimal. The sharp part is the
**denominator**, a house against a person, and the hazard is worse than this file claimed: a reader
who takes 8.40 for the risk ratio beside the houses table is RIGHT, and is thereby taught that the
substitution is safe. It is safe only while the outcome is rare, and the layout shows the
statistics rather than the subject being counted.

**The recognisability half landed the same day.** _The practitioner: the labels can be deduced from a results panel, the closest available source._ Read from the classic TABLES estimate table in `a results panel's source` and carried
on the estimates: `Risk Ratio (RR)`, `Odds Ratio (cross product)`, `Risk Difference (RD%)`.

A sibling project's rendering of a classic analysis package is a deduction and not a reading, so each label carries
`conventionalLabelSource`, the receipt writes a status of `deduced`, and **check 30 fails if a label
ever claims `original-program` as its source**. The criterion inverted rather than relaxed: from "the
label must be null" to "the label must name where it came from".

Two details worth keeping. `Odds Ratio (cross product)` keeps its qualifier, because that panel
prints a conditional-MLE odds ratio beside it which is a different estimator and is not computed
here. And the panel prints the risk difference as a PERCENTAGE — 0.4093% where this carries
0.004093 — a scale difference stated on the estimate rather than reconciled away.

**Still open:** reading the labels off a classic analysis package itself, which would upgrade the source to
`original-program` and either confirm the words or change them. Either outcome is information. Until then
the 2x2 is not presented as a classic analysis package 2x2 — it is presented as Fieldwork's own, labelled so a
trained reader can find their row.

**The input-stage palette looks like a palette that failed to load.** _Found 2026-10-26, by the
practitioner misreading it twice in ten minutes on the live build — first as missing widgets,
then as "the Pages palette is truncated to only around 6 widgets"._ An empty canvas offers four
widgets: `network_input`, `table_input`, `study_area`, `point_input`, plus any saved
micro-workflows. That is the input-stage gate and it is right — *"there is no sensible process
step before there is something to process"* — but **nothing on the screen says more will
appear**. The panel reads "Click to add. Connect matching ports." and then shows four things,
which is indistinguishable from a broken load, and worst on a fresh tab where a reader has no
prior to compare against.

The person who wrote the rule misread the screen twice, which is the strongest available
evidence that a practitioner will. The fix is a sentence, not a redesign: say that the rest of
the palette appears once something is on the canvas. Costs one line in `renderLibrary` and a
build; the demo on 2026-10-30 is the deadline that makes it worth doing before the larger items
above.

**A table figure cannot carry its own source, where a map can.** Recorded as a 0.12.0
validation limit and raised again 2026-10-26 by the margins review: a map output states a title,
a subtitle and a source note; `table_output` states a label and nothing else, so a table that
leaves the application carries no provenance at all. The three fields exist on `map_output`
already (`mapTitle`, `mapSubtitle`, `mapSourceNote`), so this is symmetry rather than design.

It is the nearer half of the notes problem above: the 1851-against-1854 vintage mismatch belongs
on the figure that shows it, where it travels with the figure, while the narrative around the
investigation waits for notes to be built. Small, and it would put a source line under the 2x2
before the demo.

**A stated unit is read as permission to add, and prose cannot be checked.**
_Found 2026-10-26, read-only, while asking why the derived 2x2 shows no margins._ `crossTab`
decides whether a grid may carry totals with `addable=Boolean(table.unit?.trim())`: **any**
non-empty string permits addition. The rule it means to enforce is "a table that states its unit
is saying its values count the same thing", and a free-text field cannot carry that claim.

South London contains the counterexample already. The mortality table's unit is
`"people or deaths, as the measure says"` — prose that explicitly DENIES commensurability — and
its seven measures are `population` beside six death counts. Connected to a table output it
would draw a 32x7 grid whose totals add population to deaths. It does not manifest today only
because that table feeds the rate node instead, which is one connection away in a worked example.

This is the same hole as the missing-margins item below,
seen from the other side: one table claims commensurability it does not have, the other has it
and cannot say so. Both come of making a free-text unit carry a yes/no claim. Candidates: a
separate declared flag the practitioner sets and the receipt records; a unit per measure rather
than per table, which is what is actually true of a long table; or totals asserted at the output,
where a person composes a figure and takes responsibility for it.

Do not fix by pattern-matching the prose.

**PARTLY DONE 2026-10-26 — a 2x2 that became commensurable shows no margins.**
_Found 2026-10-26, building South London's contingency table in the application._ Totals are
drawn only where a table states a unit — "a table that states its unit is saying its values count
the same thing; one that does not gets no totals rather than a wrong one". Snow's Table IX states
none, correctly: as imported it holds houses beside deaths, and a total across those is
meaningless.

But `select_rows` leaves `deaths` beside `houses without a death`, and those **both count houses**.
The table is now commensurable and nothing in it records that, so the figure an epidemiologist
reads loses exactly the margins they read first. The rule is right in general and wrong here.

**Settled for the figure, not for the model.** A tabular output can now assert that its cells
count the same thing, and the grid draws its margins; the figure says underneath that somebody
asserted it, because nothing checks it. South London's derived 2x2 reads 40,046 and 26,107, the
published house counts. A separate "state a unit" widget was rejected: it would take the budget
from 49 to 50 and add a palette entry, which is the cost this project keeps paying.

**What is still open is the model.** A unit belongs to a table and each measure of a long table
may count something different, so the right answer remains a unit per measure — which reaches
every consumer of `valueField` and is not a four-day change. Until then a reader of a totalled
grid is trusting a person, which the figure at least says out loud.

Three candidate answers, one taken: a step that states a unit on a table it passes through;
a unit per measure rather than per table, which is a change to `DataTable` and reaches every
consumer; or letting the output state its own margins where a reader has asserted the cells are
commensurable. The first is smallest and the second is the one that is actually true of long
tables, where each measure may count something different.

### A Polygon layer from an OpenStreetMap extract is read whole (found 2026-11-13)

**Found 2026-11-13, not yet done:** a Polygon layer read from an OpenStreetMap extract reads the whole file into memory, as Raster input's digest did before it was read in slices; a country's extract of several gigabytes would fail the same way.

### Two-by-two, Total within groups and the Länder table (found 2026-11-15)

**Found 2026-11-15, not yet done:** (1) Two-by-two words a column that is empty in every row as `"1" has nobody in it,
so it has no risk`, which names a risk in a case-control study and does not say the column is empty: Salmonella's
`andobst2`, `obstsalat2`, `tkobst2`, `trockenobst2`. (2) Total within groups lists groups in the order they first appear,
so Salmonella's age groups read 18-35, 60-79, 36-59, 1-4; nothing orders them by age. (3) The Länder table needs a
numeric value column it does not use, so `data/laender.csv`'s `name` is its value and is lost at the relate (*a line
list must name a numeric value column it does not use*, below).

### Onboarding training materials for an Advanced FETP graduate (2026-11-15)

**A major item, this week (the practitioner, 2026-11-15): onboarding training materials for an Advanced FETP graduate
from Sierra Leone**, who is to support Fieldwork's development: *"I am supposed to train an Advanced FETP graduate from
Sierra Leone how to support the development of FieldWork. At some point, this week I need to develop onboarding
training materials. This important step could help with FW field testing."* Settled the same day: the graduate's
role is **field testing, worked examples, review and validation, code contributions and localisation**; the materials
are **guided modules** (each a goal, a hands-on exercise in Fieldwork and a check); they live in **a new repository**,
which the practitioner creates (repository creation is a human action). **Staged, slides first, starting the week
of 2026-11-16** (the practitioner, the same day: *"The onboarding materials can be staged. Slides first, and we can start
it next week. For now I am more interested in finishing up render as it's very consequential for uptake."*); the render
work (202, Stages A to E) comes first. **Then identity, then collaborative projects** (the practitioner, the same day: *"Once we finish render,
we can start identity, then collaborative project."*). The Sierra Leone measles example, made from that
country's FETP line list, is the natural first exercise; its rules hold throughout (the original FETP file in no
repository; no free text from it printed).

### Collaborative projects (2026-11-15)

**And with it, collaborative projects (the practitioner, the same day):** *"This also means we have to start working on
collaborative projects, because this is how future worked examples are going to be developed."* Experiment
[150](docs/experiments/150-can-several-authors-collaborate-in-a-project-repository.md) built the export (a project as
a repository, one file per workflow, one note per object, authors by GitHub login) and decided conflicts are made rare
and legible, not merged; **reading a repository back into Fieldwork is unbuilt**, which is what blocks a second author.
Identity first (the practitioner: *"we have to strengthen the concept of identity within FW, perhaps using Open Science as
a platform (e.g., identities - ORCID, GitHub, etc.)"* and *"We have to develop an encrypted identity file which user loads
when identity requiring activities are active"*, *"Identity only"*): experiment
[218](docs/experiments/218-an-identity-you-carry.md), an encrypted identity file carrying the profile (name, GitHub,
ORCID, ROR affiliation, CRediT roles), its attestations and a signing key, loaded only for identity-requiring work.
Needed, in order: (0) the identity file of 218; (1) read a project repository back; (2) show a conflict legibly, per file, two versions side by side
for a person to choose; (3) a contribution path (branch or fork, work in Fieldwork, export, pull request, review),
which onboarding modules 4 and 6 teach; (4) 150's second-author pilot, with the graduate as the second author.

### Zonal statistics in the population workflows (2026-11-14)

**2026-11-14, the practitioner: "For population rasters, did we finish the zonal statistics? And can we add them to the
workflows?"** Built (Sample a raster's cell statistics, experiment 209) but switched on in neither population workflow,
and lab check 50 recomputes only the totals. With the comparison: turn them on in all six sample steps, show them per
district and source, and extend check 50 to the mean, median, standard deviation, cells populated and density.

### A future case study: road traffic injuries on a street network (2026-11-14)

**A future case study, 2026-11-14: road traffic injuries on a street network.** The practitioner passed on notes from
another assistant; **nothing in them is verified yet**, neither the datasets, their licences, nor what they hold. Leads
to check at their sources: Barcelona's open traffic-accident data (points with time, vehicles and severity); a
Medellín traffic incidents and fatalities dataset, 2008–2025, said to be published with a data descriptor; NHTSA's
Pedestrian Crash Data Study on data.gov. Methods named: crashes snapped to the street network, kernel density along
the network rather than on the plane, and network measures such as betweenness as covariates in a Poisson or negative
binomial regression. What exists here: Street network, Snap sites to the network, Regression (Poisson). What does
not: kernel density along a network, and betweenness. No order set; a design and admission review first, as for any
new widget.

### A future case study: genomic epidemiology (2026-11-14)

**A future case study, 2026-11-14: genomic epidemiology, to be explored.** Notes from another assistant, passed on by
the practitioner; **nothing in them is verified yet**, neither the repositories, their licences, nor their contents.
Leads to check at their sources: Nextstrain's `ncov-tutorial` repository (said to hold about 200 SARS-CoV-2 sequences
with `metadata.tsv`, strain, collection date and place, and a built tree, `auspice/default-build.json`); Nextclade's
example datasets (`github.com/nextstrain/nextclade`; reference sequences, `genome_annotation.gff3`, small
`sequences.fasta`, for SARS-CoV-2, influenza and RSV, made for tools that run in the browser); and a CERI/KRISP webinar,
*Genomics surveillance in Africa: import/export analysis of viral lineages* (YouTube). What exists here: Tabular data
reads a TSV's metadata; Cases by period gives sequences by collection week; Map places them by country or state; Chart
draws a tree from a table of who came from whom. What does not: reading FASTA or a Nextstrain tree, a distance matrix
between sequences, and lineage import and export between places. No order set; a design and admission review first.
   More notes the same day, also unverified, give the distinctions a design would have to state and enforce: a line
   list is one row per case and says when and where; sequences (FASTA, FASTQ, VCF, alignments) say how alike two
   pathogens are, and reach analysis as pairwise distances or clusters; **genetic closeness is not transmission**, it
   can suggest links contact tracing missed and tell an import from local spread, but does not show who infected whom;
   and **sequences arrive days to weeks after the case** (collection, extraction, sequencing, assembly), so a sequence
   date is not an onset date and a recent week holds fewer sequences than cases. A further lead: a video, *Precision
   pathogen tracking: the power of genomic epidemiology* (YouTube, Computational Genome Biology).

### Found 2026-11-14, from the practitioner's questions

**Found 2026-11-14, from the practitioner's questions:** (1) Append rows was changed without moving to the standard
Inspector and dialog: do it, with Join a table to the study area next when it is touched. (2) Map shows a polygon's
name, key and shaded value, never its other attributes, so zonal statistics are not on the map: a table under the map
linked to it, or every attribute in the popup, to be chosen. **Chosen 2026-11-14: the table under the map, linked**
(a district's row highlights when the district is chosen, and the reverse); for 0.115.0. **Built 2026-11-15** (0.122.0, Map 0.32.0), in Results under both
the static figure and the interactive map; not in Notes or the write-up, and not under maps side by side. (3) A polygon layer reaches Table output two ways: into
its polygons input as a points-style table with empty Longitude and Latitude and attributes 12 to a page, or into its
table input as a plain table; make the first read as the second. The practitioner, 2026-11-14: *"As table output the
geometry attributes could be reprojected as X, Y."* Then, the same day: *"Or we can exclude because the purpose of a
table output is to use for other purposes and non-geometry computation purpose may not be appropriate."* **Decided: a
polygon layer reaches a table with no coordinate columns**, only its own attributes, whichever input it arrives at;
its shape stays on the map (a table has no geometry). A point keeps its longitude and latitude, which are its recorded
location, not a stand-in. Coordinates for a polygon, where wanted, come from a step that says what it computed. For
0.115.0. **Built 2026-11-15** (0.123.0, Table output 0.12.0), with what the step that made a layer says of each
polygon kept as columns. (4) A lead, unread: an article on a Vercel UI SDK for
agent interfaces (marktechpost.com, 2026-11-13); against the rule of no AI in Fieldwork unless compelling, but its
interface patterns may be worth a look. A second, the same day, also unread: an article on UI libraries for work with
Claude Code (geeky-gadgets.com). Both to be read together when interface work is next planned; anything adopted is a
dependency, so licence, size and offline use are checked first, as for any library here.

### For the next batch (the practitioner, 2026-11-14)

**From the practitioner, 2026-11-14, for the next batch:** (1) Hagelloch's *What a daily scan would have said* map is hard
to read in Notes: leave it out of the write-up (**done 0.117.0**: "Not in the write-up" on Map, Table and Chart), and later six
representative days as static maps side by side (Map's panels). (2) Formulas in Notes as footnotes or in an Appendix:
proposed, an Appendix, each Methods note keeping its sentence and pointing to its numbered formula with this run's
numbers. (3) Other examples for a space-time scan: Sierra Leone's measles line list (Hagelloch's shape, next in the
order); MERS by hospital (12 places, coarse); Brazil's dengue by municipality and week, which needs the scan to read
counts per area as cases at the area's centre. Snow's deaths, Salmonella and NYC have no per-case date and place.

### Notes as the place every result is, and the publication's open items (2026-11-14)

**The order from here, as the practitioner set it on 2026-11-14:** *"Yes but after that let's work on our TODO."* First
Notes as the place every result is (a Methods note from every step's own record; a source note with its provenance and
its citation into References, or a limitation where none is described; provenance filled for MERS and the population
sources), and MERS's epidemic curve coloured by transmission chain and its offspring distribution; then the TODO.
**Then, the same day:** the publication render of Notes ([202](docs/experiments/202-one-record-several-products.md),
reordered: publication first; formulas in an Appendix; a print layout saved as PDF first, Word later). The offspring
distribution is built (0.116.0); the curve by chain needs a step that hands on each case's chain, designed first.
**The publication's first step is built (0.117.0)**, and its open items (0.118.0): Hagelloch's source cited, the
written parts kept, a map's title in its caption only. Still open for it: figures cited by number in the text, a
thesis citation type, Word; the basemap under the cluster map is the practitioner's to check.

### 3. Sierra Leone

3. **Sierra Leone** (below; [189](docs/experiments/189-a-measles-line-list-made-safe-to-teach-with.md)): reviewed,
   de-identified and made semi-synthetic 2026-11-08; Find health facilities from a list built (0.60.0, GRID3) and
   OpenStreetMap added as a register (0.61.0, measured: one hospital more, nothing wrong). Shares in Total within groups
   (0.62.0, [191](docs/experiments/191-shares-within-groups.md)); *is not* and *otherwise* in Apply ruleset, which the
   WHO classification needs ([192](docs/experiments/192-is-not-and-otherwise.md)). **Next:** the example's workflows and
   manual: epidemic curve and cases by facility **built (0.65.0)**; cases by district next.
   **A space-time scan, built and removed 2026-11-15:** a fifth workflow at the facilities with ten cases or more (the
   practitioner's rule), 25 km circles. Every one of ten clusters reached p = 0.001 (the most likely, 198 cases against
   53.9 expected near Freetown, October 2021 to April 2022, is the 2021-22 wave reaching Western Area); over five years
   the scan's null fails for mundane reasons, waves and reporting changes, and visits were moved up to a week when the
   file was made. Asked *"Is it really worth doing scan for SL?"*, then *"Remove scan for SL"*. Hagelloch remains the
   scan's example. Kept from it: seven type-differs names decided on the facility map.
   **Map on the standard, 0.66.0.** **Cases by district next**, as rates per 100,000 over WorldPop's 2021 district
   sums on OCHA COD-AB's 16 districts (data/district-population.csv and data/districts-cod-ab.geojson, uncommitted in
   the example until the workflow is built; WorldPop is 5.8% above the 2021 census). Names differ ("Bo District",
   "Bo"; COD-AB spells Falaba "Fabala"): **Deduplicate records gains a mode linking two tables** (experiment 193, the
   practitioner: *"extend the deduplication widget to also do matching of columns between two tables"*), and moves
   to the standard in the same pass.
   **Found 2026-11-09:** the pre-push fast gate validates the pinned examples against the sibling WORKING copies, so an
   uncommitted edit in an example repository blocks a Fieldwork push whose pins are right. Commit or set aside first.
   **Boundaries that change: GeoPrism Registry, after 18** (the practitioner, 2026-11-11: *"For SL example we can take a
   look at https://github.com/terraframe/geoprism-registry-documentation/blob/main/version/v2.0.0/introduction.md for
   detecting changes in admin boundaries and perhaps as a source of admin boundaries as well. After history rewrite."*).
   Not yet read. Two questions: whether it records a unit's boundary over time, so a district split or renamed between
   the line list's years and the boundary file's can be detected rather than met as an unmatched name (Falaba is the
   case at hand); and whether a registry instance publishes Sierra Leone's units openly, with a licence, as a source
   beside OCHA COD-AB and geoBoundaries. Its licence and the data's checked before anything is used.
   **Case classification postponed** (the practitioner, 2026-11-08: *"Let's postpone the case definition work"*). Decided
   so far: WHO 2018's classification; *Runny nose* counts as coryza; the clinician's *meets the definition* stands in
   where symptoms were not recorded, shown in an analysis table. **Open:** whether *Contact with confirmed measles
   (7-18d) or rubella (12-23d) case* is a measles link. It decides 21 of 2,606 rows, 19 of which stay clinically
   compatible without it. Needs the FETP's data dictionary (the columns read as DHIS2 tracker fields), which would also
   say which test the laboratory result records.
   **Done 2026-11-08 (0.64.0): a case definition in the rulesets worked example** (the practitioner: *"Let's also add a
   case definition example in the rules set worked example"*), its seventh workflow, on sixteen made-up cases in four
   stages, every class reached. No conflict is reached, because staged rules cannot give one case two classes.

### 4. Table output on the standard

4. **Table output on the standard** (186).

### 7. 188 validated

7. **188 validated** (the practitioner, 2026-11-08: *"Let's validate 188 after #5"*, Old Naledi then numbered 5): South
   London's workflows built from an empty canvas through the rules dialog, so its rebuilt Apply ruleset steps play back
   as Nigeria's do.

### 8. Operational epidemiology's first slice: a 7-1-7 review on MERS-CoV, South Korea, 2015

8. **Operational epidemiology's first slice: a 7-1-7 review on MERS-CoV, South Korea, 2015**
   ([200](docs/experiments/200-operational-epidemiology.md); the practitioner, 2026-11-09: *"Yes"*, then *"But add that
   to TODO"*). Onset to report and onset to diagnosis per case, counted against the targets; a contacts table for
   contact tracing. **Days between two dates** in Apply ruleset's computed columns, the one extension it needed, is built
   (Hagelloch's serial interval uses it). **Status, corrected 2026-11-11:** what is left is the data's terms, which the
   practitioner is checking at the package's pages, and converting `mers_korea_2015.RData` to CSV in the example
   repository.
   **Built 2026-11-12** ([200](docs/experiments/200-operational-epidemiology.md)): the 7-1-7 ruleset, the column choice in Apply ruleset, and the
   first workflow in example-2015-mers-korea (94 of 135 detected within 7 days, 161 of 162 reported within 1).
   The 98 contacts as a second workflow the same day (cases per source, setting of exposure). Next: a lab recomputation;
   the transmission tree, once the practitioner says how to show the two cases with more than one recorded source.
   **2026-11-12:** the hospitals placed (example 9e8432c); the data's documentation and the other open sources researched,
   [docs/research/mers-korea-2015-sources-2026-11-12.md](docs/research/mers-korea-2015-sources-2026-11-12.md). Next: a
   workflow placing the cases by hospital; then, from that note, the KDCA 185-case file, an outbreak-level 7-1-7 review
   from the response dates, and the README's corrections. **In progress** (the practitioner: *"We just begun"*).
   **2026-11-14:** three more workflows (example ddf30f6): deaths by age class and sex in a two-by-two, days from
   exposure to onset and onset to death with the median, secondary cases per source and the serial interval by setting;
   lab check 51 agrees. Total within groups gained Mean, Median and Column to total for them.
   **Decided 2026-11-11 by the practitioner:** *"Our use case for these worked examples is for teaching so that fits MERS
   Korea purpose"*: the dataset is described as compiled "for teaching", and so are these examples. Used on that basis in
   an example repository, attributed to ECDC's Epidemic Intelligence and the outbreaks package, never in the
   application; no licence for the data itself is stated anywhere, and that stays said. **Converted 2026-11-11** with R
   (`~/Downloads/mers-korea-2015/`, `.RData` sha256 2a08976a…): a line list of **162 cases** by 15 columns (onset missing
   for 27, exposure dates for 5) and **98 contact links** by 4 columns. Dates are per case, so it teaches case-level
   timeliness (onset to report, onset to diagnosis, 135 cases computable) and who infected whom; a full 7-1-7 review of
   the outbreak as one event would need the early response action dates, which it does not hold. **Repository created
   2026-11-11** at the practitioner's request, public: digital-twin-ph/example-2015-mers-korea, holding the two CSVs,
   the conversion script, NOTICE.txt and provenance.json (424ee33). Next there: the workflows, after the 7-1-7 ruleset.
   **And a 7-1-7 timeliness ruleset** (the practitioner, 2026-11-11: *"And we can build the ruleset extension as well"*):
   a bundled ruleset for Apply ruleset reading four date columns (emergence, detection, notification, early response
   complete), computing the three intervals in days, and marking each met or not against its target, 7, 1 and 7 days,
   as step settings in days. A row missing a date gets no verdict for that interval, not a guessed one. Its basis cites
   Bochner et al. 2023 and `ontology/response-timeliness.ttl`. The machinery exists: date fields, days by minus, and
   rules that read a computed value; the open question is binding date columns to a bundled ruleset's input roles.
   **Found 2026-11-09, before building:** `mers_korea_2015` in the R package `outbreaks` (reconverse/outbreaks): a line
   list of 15 columns (onset, report, diagnosis, exposure start and end, death) and a contacts table (from, to,
   exposure). Compiled by ECDC's Epidemic Intelligence from public information in the outbreak's first weeks; "for
   teaching", and not the final investigation or a complete chain. **Terms unresolved**: no licence for the data is
   stated; the package code is MIT on GitHub (GPL ≥ 2 on CRAN 1.9.0). **No CSV**: only `data/mers_korea_2015.RData`, so
   a script in the example repository would convert it, and the row count is not yet known. Ask ECDC or the package
   authors about the data's terms before shipping it.
   **The 7-1-7 categories are ours to carry**: Fieldwork's own ontology, `ontology/response-timeliness.ttl`, built on
   2026-11-09 from Bochner et al. 2023 (CC BY 4.0), holds the milestones, targets, early response actions and the
   study's bottleneck and enabler categories, attributed (experiment 200). The practitioner, 2026-11-11: the categories
   *"are also widely used in many public documents based alone on 717 published literature"*. The Alliance's own
   BY-NC-SA list is not needed. **Alongside, still open:** the
   appendix of the 41-event Lancet Global Health paper (`mmc1.pdf`, 229.5 KB, PMC), not yet read; the Sierra Leone
   Ebola 2014 line list's own terms (Fang et al. 2016).

### 10. Open data and studies for each 7-1-7 bottleneck theme

10. **Open data and studies for each 7-1-7 bottleneck theme** ([200](docs/experiments/200-operational-epidemiology.md);
   the practitioner, 2026-11-09: *"If we can find open data sets and studies for the bottleneck themes, those will be
   very helpful for demonstrating 717 support"*). One worked example per theme where open data allow: reporting
   completeness, laboratory turnaround, care-seeking delay, travel time to care, cross-sector linkage, and supplies,
   logistics and staffing (in reach, corrected by the practitioner the same day). Open evidence only; licences as stated.

### 11. Cluster detection under Detect

11. **Cluster detection under Detect** ([200](docs/experiments/200-operational-epidemiology.md); the practitioner,
   2026-11-09). In order, after the Hagelloch transmission tree: the **space-time permutation scan** (built 2026-11-10
   as Space-time scan 0.1.0; owes a lab check, SaTScan on its benchmark and the day-by-day replay); the **Poisson spatial scan**, on the same machinery; then **Describe where points are dense**
   (HDBSCAN, kernel density, and kernel density as a ratio of two layers), labelled exploratory, never under Detect.
   Each on the standard Inspector, with a lab check, and SaTScan run by hand on its benchmark sets.

### 12. Edit a table's values inline, in the data quality check

12. **Built 2026-11-13 ([214](docs/experiments/214-editing-a-table-inline.md))**: values edited in Data quality's Records tab, kept as edits on the step with the value replaced, applied to a copy, stated in the run, removable; an empty cell filled like any edit (the practitioner's choice); and the playback dialog of 173. **Left:** a worked example's manual with an edit exercise, first in Sierra Leone. ~~**Edit a table's values inline, in the data quality check**~~ (the practitioner, 2026-11-10: *"One thing I have been
   meaning to add to data quality checks is the ability to edit tables inline. Can be added as a widget playback
   exercise."*). To shape: per [117](docs/experiments/117-data-quality.md), a change to an input is a declared repair
   on the node, never a write to the file, and every repair can be taken back. So an edited cell would be one more
   repair: the record, the column, the value read, the value written, who and when, listed as an edit log and each
   removable. Open: whether typing a value into an empty cell is allowed, since 117 holds that filling a missing value
   is imputation, not a clerical fix; and what "widget playback exercise" means here, the manual playback dialog of
   [173](docs/experiments/173-a-manual-for-each-worked-example.md) (designed, not built) or an exercise in a worked
   example's manual.

### 14. Hagelloch's study area: the administrative area, not a box

14. **Hagelloch's study area: the administrative area, not a box** (the practitioner, 2026-11-10: *"We should change
   the study area for Hagelloch from box to administrative area"*). Today it is a box drawn round the anchored houses.
   To settle: which boundary (Hagelloch is a district of Tübingen; its OSM or official boundary, and its licence), that
   it is the present-day boundary and not 1861's, and whether any case falls outside it, which the map would then
   show. Asks before downloading. With 13, the colour key. **Found 2026-11-10:** geoBoundaries' levels for Germany
   (2021, Federal Agency for Cartography and Geodesy, Data licence Germany – Attribution 2.0) are ADM1 Länder (16),
   ADM2 government districts (38), ADM3 independent cities and districts (428), and no ADM4; Hagelloch's finest is
   ADM3 Landkreis Tübingen, about 520 km². A boundary of Hagelloch itself needs another source.

### 15. Georeference an 1861 map of Hagelloch in the widget itself

15. **Georeference an 1861 map of Hagelloch in the widget itself** ([201](docs/experiments/201-georeferencing-by-matching-points.md): pairs of
   points matched between the scan and a map of the place, South London first) (the practitioner, 2026-11-10: *"If we can get hold
   of an old map of Hagelloch in 1861 we can also exercise georeferencing in the georeferenced image input widget. You
   did it before for South London so I think it could be done this time in the widget itself."*). South London's plate
   was placed outside the app, from four control points (`map2-georeference.json`) written into a world file; the
   widget reads a north-up world file and refuses a rotated one ([143](docs/experiments/143-a-georeferenced-plate-as-ground.md)).
   New: choose control points on the image and on the map, fit the transform, report each point's residual. Then the
   houses: today one anchor places them right to the village, not to the building; a georeferenced plan would place
   x_loc, y_loc properly. To find, open evidence only and asking before any download: whether Pfeilsticker's 1863
   scan on archive.org carries the village plan (Google scans often leave out fold-outs); the Württemberg cadastral
   maps of the 1820s to 1840s (Landesarchiv Baden-Württemberg), and their licence. With 14: the boundary is today's,
   the plan 1861's.

### 16. A sketch pad in Notes

16. **A sketch pad in Notes** (the practitioner, 2026-11-10: *"Can we add a sketch pad in notes? This is for quickly
   sketching hand drawing maps and diagrams"*). Notes already hold images (`note-image.ts`), so a sketch can be saved as
   one, kept with its strokes so it can be edited again, and placed in the write-up like any figure. To settle: pen,
   eraser and a few colours at sizes the practitioner can see; drawing over a map as a backdrop, or blank; a sketch map
   is not a georeferenced one and says so.

### 17. Faster space-time scans

17. **Steps 1 and 2 done 2026-11-14 (Space-time scan 0.5.0, Fieldwork 0.115.0):** shuffles stop once 50 score as
   high (Besag and Clifford 1991), and the replay's days run across the device's cores; Hagelloch's replay 44 s to 18.5 s
   in Node from the stopping alone, and the example's browser test 1.5 min to 18 s (idle machine against a loaded gate,
   so less than that ratio). Lab check 46 re-run: agrees. **Step 3 done the same day (Space-time scan 0.6.0):** the
   test in the Rust kernel, identical to the script shuffle for shuffle (unit test); the scan 5.4 s to 3.4 s and the
   replay 18.5 s to 8.3 s in Node. A speed-optimised build doubled the kernel (40 to 79 KB) for 3.4 to 2.9 s and was not
   kept. **Left:** what remains is the method (1,305 circles by 87 days, about 3.7 million windows a shuffle for
   Hagelloch), and lab check 46's own speed. Originally: **Faster space-time scans** (the practitioner, 2026-11-10: *"How can we speed up the browser"*, then *"Let's add all
   3 to TODO"*). In Fieldwork's replay, in order: stop shuffling once the answer is clear, after 50 shuffles score
   higher (Besag and Clifford 1991), and say when it stopped; run the days in parallel across the device's cores; move
   the scan's inner loop to the Rust kernel compiled to WebAssembly. In lab check 46: score every run length at once
   rather than one at a time, and, if still slow, fewer shuffles with the tolerance widened to match.

### 18. The history rewrite: what is left

18. **Done 2026-11-11: the Claude co-author line removed from the workspace's history, with the practitioner.** Every
   repository rewritten (messages only; files identical) and force-pushed at the practitioner's yes; Fieldwork re-pinned,
   old ids mapped in docs/history-rewrite-2026-11-11.tsv; verified with no line on any branch on GitHub or locally.
   **Left, the practitioner's call:** Fieldwork pull request #1's twelve commits stay under GitHub's read-only
   refs/pull/1/head, which only GitHub Support can remove (its description's line was removed). Originally:
   **Remove the Claude co-author line from the workspace's history, with the practitioner. NEXT, before anything else**
   (the practitioner, 2026-11-11: *"Let's move up 18 before anything else after this last task is done"*: after 0.94.0
   and 0.95.0 are published, ahead of the census comparison and MERS; it was set for the weekend of 2026-11-14/15)
   (2026-11-10: *"For repositories related to CDC work we cannot have agents as coauthors"*). Every repo
   in the digitaltwin-ph workspace: fieldwork, validation-lab, the ten example repos, widget-pack-sea-level-rise and
   fieldwork-ontology, about 1,190 commits. Mirror backups first; the lab and the siblings before Fieldwork, with a map
   of old to new commit ids applied to Fieldwork's pins and messages; every branch force-pushed. Nothing under
   digitaltwin-aas. New commits already carry no such line.

### 19. A Manual for Hagelloch

19. **A Manual for Hagelloch** (the practitioner, 2026-11-10: *"Can we add a Manual to Hagelloch?"*), built in: a
   `manual.json` beside its data, the files a reader downloads served from Fieldwork's own site, the Manual tab shown
   for its three workflows, and a from-scratch browser test that performs every step. **The alternative, not chosen
   for now** (*"Let's add alternative to TODO"*): Hagelloch in its own example repository, like the other worked
   examples, so every manual and its data are published and pinned one way; against it, Hagelloch would leave the
   built-ins that work offline from the first open.

### 20. One record, several products: the Notes tab

20. **One record, several products: the Notes tab** ([202](docs/experiments/202-one-record-several-products.md)): the
   paper, a field report, a story map, a poster and a dashboard configured from one record of notes and views; notes
   included or excluded per product, with versions flagged when their original changes; evidence before the story.
   First: the story map on Hagelloch's six scenes.

### 21. Collaboration through GitHub

21. **Collaboration through GitHub** ([150](docs/experiments/150-can-several-authors-collaborate-in-a-project-repository.md);
   the practitioner, 2026-11-10: *"We have not worked on the collaborative project yet which intends to use GitHub as
   the shared space for collaboration."*). Written half exists (a project exports as a repository). In order: read a
   repository back into a project; a second author on a real project; push from Fieldwork with the scoped token;
   Discussions ([155](docs/experiments/155-discussions-as-the-governance-surface.md)); products on the repository's
   Pages. Trust without a catalog: a commit pin, who and what before opening, data never instructions, a label.
   **Progress 2026-11-16:** a repository read back into a project (Load the project), Save to the repository as one
   commit, Get the latest, project roles and People, Discussions listed and posted from the project; tried against the
   practitioner's repository up to loading, not yet a save or a second author.
   **Next, to try:** mentioning a person in a discussion post, as `@login`, so GitHub notifies them (the
   practitioner, 2026-11-16: *"try @user to direct discussion post to certain GitHub users"*). First observed from
   GitHub's side: JLT posts to the practitioner with their login mentioned, on 2026-11-17, and we see whether the
   notification arrives. Then from Fieldwork: whether a post sent through the API notifies the person mentioned the
   same way, and whether **Start a discussion** should offer the project's members to mention.
   **Next, to try:** a shared project saved with test workflows by different authors (the practitioner, 2026-11-16:
   *"save a collab project with test workflows by different users"*). The practitioner and JLT each load
   `project-test-collaboration`, each add a test workflow of their own, and each save to the repository. What it should
   show: both workflows in `project.json` and under `workflows/`, each commit under its author's login; the second save
   refused until its author gets the latest, then accepted; both authors' **This is me** entries in **People**. What it
   may show instead, and is worth recording either way: a save that overwrites the other's `project.json` entry, since
   the project file is shared and the workflow files are not (experiment 150, "the two files that do not divide").

### 23. "Made with Fieldwork" on everything exported

23. **"Made with Fieldwork <version>" on everything exported** (the practitioner, 2026-11-10: *"can we add small
   watermarks for FieldWork outputs, I think it's time to toot our horn"*; *"Yes agree with branding settings"*): small,
   with the logo, in the footer beside the source note and never over the data; at least 14 px and AA contrast; on by
   default and removable per export, the choice recorded; Fieldwork's own name only.

### 24. More population rasters beside WorldPop: GRID3 and the Global Human Settlement Layer

24. **More population rasters beside WorldPop: GRID3 and the Global Human Settlement Layer** (the practitioner, 2026-11-10:
   *"We can also add GRID3 and GLobal Health Settlements layer where we can get population rasters?"*; GHSL read as the
   JRC's Global Human Settlement Layer, to be confirmed). In Raster input's Configure…, where WorldPop now is. First, read
   only: each source's licence as stated, its countries and years, its files and sizes, and whether a browser can fetch
   it or must download it, as WorldPop must. GHS-POP is global and tiled; GRID3 is per country, mostly sub-Saharan
   Africa. **Moved up 2026-11-10**, ahead of 19, by the practitioner on seeing only WorldPop in
   Configure… (*"For raster input I thought we included GRID3, GHSL, etc. for population rasters"*). Read-only research
   started the same day.
   **GRID3 built 2026-11-11 (0.90.0)**: its sub-Saharan Africa set, 2025, 52 countries, one file each (CC BY 4.0), as a
   *Population source* beside WorldPop. **Left:** GRID3's country-specific estimates (Nigeria v3.0, the DRC's v4.4 by
   province with lower and upper bounds, Zambia, Mozambique and others; three are CC BY-SA); and GHS-POP, confirmed as
   the JRC's Global Human Settlement Layer: JRC's AWS copy sends CORS and allows ranges, so a study area's window might be
   read without a download, which one partial read of the file's header (about 16 KB) would settle. **Done 2026-11-11 with
   the practitioner's yes**: a cloud-optimized GeoTIFF (512 x 512 tiles, deflate, five overviews), and **GHS-POP is built
   (0.93.0)** as a population source read for the study area's window. **Left:** GRID3's country-specific estimates;
   a live read of a real window, which only the tests' stand-in has done.
   **Next: totals within areas, so the three models can be compared** (the practitioner, 2026-11-11: *"how do we compare
   populations expressed by their models"*, then *"before we add let's survey for potential duplication"*). Surveyed by
   input and output: **Sample satellite files at points or over areas** already sums a grid within each area, by the
   cell rule Clip raster uses and lab check 02 holds against rasterio, but reads only catalog files; **Sample raster at
   points** reads a raster at points only; **Clip raster** masks one area and gives a raster; **Summarize points to
   polygon** totals points, not cells; **Rate with a denominator** takes a stated population. So no new widget.
   **And not two that sample a grid** (the practitioner, 2026-11-11: *"sample satellite files does not explicitly say it
   takes rasters that might be a problem"*): the two samplers are **merged into one, "Sample a raster at points or over
   areas"** (the practitioner's choice of name, 2026-11-11), taking a Raster input or satellite files, as Cases by period
   takes points or a table. Shared: the area sums (`src/satellite-areas.ts`), the cell rule, the point reading; offered
   only for satellite files: the layer and the quality rule. The other node type is retired outright, there being no
   outside users, and saved workflows move to the merged one; its manual page, lab checks and name review follow.
   **Built 2026-11-11 in 0.94.0** (experiment 205): Sample a raster 0.3.0; Sample satellite files 1.0.0, retired; Brazil
   dengue and New York ozone re-pinned. **Still owed:** the lab check against an external zonal sum. A comparison is then composed from what exists: three Raster
   inputs, three area samples over the same polygons, Relate on the polygon, and Apply ruleset for the differences.
   Compare per area at a common year, never cell by cell at 100 m, never pooled; say each model's population (all
   land, settled cells, residential) beside its number. The same step gives Rate with a denominator a population per
   area.
   **Then a worked example of the comparison** (the practitioner, 2026-11-11: *"Once we add that capability let's create
   a worked example for it"*): one place in GRID3's coverage, so all three models apply, its administrative units as the
   areas, one common year. **A country with a census** (the practitioner, 2026-11-11: *"Let's use a country with a
   census"*): the census count per unit is the independent reference that says which model fits, not only how far they
   disagree. To choose by: counts published per unit, openly licensed, on boundaries that match the units, and a census
   year near a year the models offer. Candidates in GRID3's coverage, none checked yet: Botswana 2022, Kenya 2019, Malawi
   2018, Ghana 2021, Rwanda 2022, Zambia 2022, Uganda 2024. The windows read for its units
   are kept in an example repository under each source's licence (all three CC BY 4.0), with their citations.

### 25. A study area across a border

25. **Built in 0.85.0 ([204](docs/experiments/204-a-study-area-across-a-border.md)), and a Polygon layer of several study
   areas' parts, each with its country and level, in 0.159.0.** ~~**A study area across a border**~~ (the practitioner, 2026-11-10: *"We discussed the cross border study area. In this
   case we need to be able to either (1) detect the countries based on geometry overlaps or (2) named explicitly"*).
   **Built 2026-11-10 (0.85.0), [204](docs/experiments/204-a-study-area-across-a-border.md)**: a list of countries,
   named or found with shares and confirmed; the walk upstream; Raster input offering the area's countries with its
   one-file limit said. **Built 2026-11-21 (0.159.0):** a Polygon layer of
   several study areas' parts, each with its country and level, one layer across a border. **Left:** Find health facilities querying each country's register; Raster input reading a window across two files.

### 26. A repository of worked examples for georeferencing sheet maps

26. **A repository of worked examples for georeferencing sheet maps** (the practitioner, 2026-11-11: *"We should have a
   repo of worked examples for georeferencing different kinds of sheet maps"*). An `example-*` repository, one example
   per kind of sheet: a cadastral sheet with a printed frame (Hagelloch's 1824 Flurkarte, placed by its corners and by
   hand), a topographic sheet with a printed grid, a town plan with no grid (South London's Snow map), a railway or
   small-scale map with a graticule (the 1861 Bahnkarte), and a sketch or hand-drawn map, each with its features to find,
   their reasons, and the result against a reference. Each sheet's licence checked before it ships; experiment 201's cue,
   live check and preview are the tools.

### 27. Open Science components in Fieldwork

27. **Open Science components in Fieldwork, with the collaborative project design layered to support their principles**
   (the practitioner, 2026-11-11: *"Also after MERS let's build the Open Science components or FW and layer the
   collaborative project design to support it's principles."*). **After MERS** (item 8). Builds on 21 (collaboration through
   GitHub, [150](docs/experiments/150-can-several-authors-collaborate-in-a-project-repository.md),
   [155](docs/experiments/155-discussions-as-the-governance-surface.md)) rather than beside it: the project design is the
   layer, the open science principles what it is answerable to. What already exists to inventory first: a project
   exported as a repository; provenance receipts in N3; licences, citations and pinned commits on every worked example;
   the Validation Lab's independent checks; open evidence only. **Open, for the practitioner:** which statement of the
   principles (for example UNESCO's 2021 Recommendation on Open Science, FAIR), and which components that means here.
   An experiment record first, with the survey of what exists, before any widget. **Begun 2026-11-16:** ORCID iDs and
   ROR IDs in the identity file and the project's membership; the running inventory is
   [docs/audits/open-science-inventory.md](docs/audits/open-science-inventory.md).

### 28. The 1854 map under the John Snow example

28. **The 1854 map under the John Snow example** (the practitioner, 2026-11-11: *"For John Snow built in example can we
   look for an 1854 map of Soho district?"*). After the items already ordered (the stale-text sweep, the census
   comparison, MERS). Found by search, none opened yet and every licence to confirm on its page:
   **Snow's own map** (December 1854, printed 1855; Wikimedia Commons, Snow-cholera-map-1.jpg, public domain), the
   first choice: Robin Wilson's digitised deaths and pumps were taken from it, so the points should fall on their own
   houses, the check Hagelloch's 1824 sheet passed; **Edmund Cooper's map** for the Metropolitan Commission of Sewers
   (September 1854, the base Snow drew on, with house numbers and sewers), no open scan found yet, to look for in the
   Snow Online Companion (MSU) and the Wellcome Collection; **Stanford's Library Map of London** (1862; David Rumsey's
   georeferenced sheets are the 1877 edition), licence unclear and probably not open. The Ordnance Survey's 1848-50
   large-scale London plans would be the surveyed ideal; no open scan found (NLS georeferences only 1893-96). Placed by
   hand with the georeferencing widget (201), as Hagelloch's sheet was; one of 26's kinds of sheet, a town plan with
   no grid. Asks before downloading, with the size. Where it lives follows item 7: the built-in Snow example earns a
   repository or retires.

### 29. An agent-based model in the browser, checked against Starsim

29. **An agent-based model in the browser, checked against Starsim: the spike for 199, after MERS**
   ([199](docs/experiments/199-an-agent-based-model-in-the-browser.md); the practitioner, 2026-11-10: *"For 199 if we
   do a spike for ABM what would that be?"*, then 2026-11-11: *"Let's do it after MERS"*). TB natural history only, at
   the Gaborone model's rates, on Old Naledi's homes; weekly counts from a recorded seed, held against Starsim by
   run-to-run spread; the browser's limit measured; about a day. Proposed 2026-11-10 and left unrecorded for a day,
   found when the practitioner asked when the spike was.
   **2026-11-17: moved ahead of MERS by the practitioner and run on Hagelloch's measles instead (*"Measles, Hagelloch
   188"*): yes.** Same tables natively and in WebAssembly; agreement with Starsim 3.7.4 within run-to-run spread over
   500 runs each; 188 children 1 ms a run, 940,000 3.3 s. Next, the practitioner's to choose: periods from an open
   source, the Starsim script into the Validation Lab, a widget to run it, or a comparison with the recorded curve.

### 30. A heat stress worked example on real data

30. **A heat stress worked example on real data, replacing the heat example** (the practitioner, 2026-11-11: *"We will
   replace heat stress with a worked example, with real data so this needs a TODO so we can do the research."*). The
   synthetic heat example retires in the Old Naledi pass (docs/audits/old-naledi-audit.md). Research first, open
   evidence only: a heat event with published health outcomes (deaths, emergency visits or calls) by place and day,
   openly licensed; temperature or heat index for the same places and days; the population at risk; and any
   published cooling-centre or outreach locations. Then a worked example in its own repository, its rules written
   as declared rules in Apply ruleset, with no bespoke ruleset code.

### 31. Syndromic surveillance: an aberration in a count over time

31. **Built: Detect unusual counts (0.159.0, [228](docs/experiments/228-detect-unusual-counts.md), lab check 53 in
   0.162.0) and the syndromic worked example (0.160.0, charted in 0.162.0).** Left: 206's open questions (below, the
   threads), and the NSSP re-scope. ~~**Syndromic surveillance: an aberration in a count over time**~~ ([206](docs/experiments/206-syndromic-surveillance-aberration-detection.md);
   the practitioner, 2026-11-11: *"We can add 206 to our TODO list."*). Not placed in the order yet. First, the check
   that may need nothing built: whether Apply ruleset's previous-row value can read a value computed in the same step,
   which would let EWMA and CUSUM be written as rules (option E). **Then, preferred (the practitioner: *"Can we modify
   ruleset to read previous rows?"*): option F**, Apply ruleset reading a window of earlier periods (mean, sd, sum, min,
   max over the last *k*, after a guard band), so EARS C1–C3 are rules too. Otherwise, closest step first: baseline columns on Cases
   by period for window methods (A), expected counts from Regression for Farrington-style models (C), a new step only if
   neither carries it (B), an aberration view in Chart (D). Open for the practitioner: which methods first; the New
   York daily emergency-visit series as the first test bed; whether reading a syndromic feed as published is in scope.

### The high-contrast theme in the order

The high-contrast theme comes after Sierra Leone, as set on 2026-11-07; where it falls among 4 to 6 is not set.

### 32. Geoprivacy as worked examples of its own

32. **Geoprivacy as worked examples of its own, with map encryption ported to Fieldwork** (the practitioner, 2026-11-12:
   *"We may have to spin off the geoprivacy workflows on their own as geoprivacy worked examples which would include map
   encryption which we haven't ported yet to FW."*). Out of the John Snow project: moving points (donut geomasking, and how
   far the centre shifts) and counting by H3 cell, one question each, then map encryption from the geoprivacy notebooks
   (git.cdc.gov/jupyterlite/2026-Map-Encryption-Library), which needs an experiment record and its admission review
   before any widget. Until then `snow-geoprivacy` stays in the John Snow project, last ([210](docs/experiments/210-proposing-a-chart-or-a-map-from-the-data.md)).

### 33. Each worked example retold in Python notebooks

33. **Each worked example retold in Python notebooks, for validation and pedagogy: after the items above**
   ([217](docs/experiments/217-worked-examples-as-python-notebooks.md); the practitioner, 2026-11-15: *"This is not a
   generator problem but a set of notebooks we sculpt down to prose. It boils down to two things. Validation and
   pedagogy."*, then *"this is a TODO item. After the others. And an experiment too."*). Hand-written per example, in
   a `notebooks/` folder in the example's own repo, shaped on the PHI-Case-Studies John Snow series; the prose drafted
   as Markdown for the practitioner to edit; each closes by setting its numbers beside Fieldwork's, and the lab lists
   that check. Oswego first, then Salmonella.

### 34. What a two-by-two says of itself

34. **What a two-by-two says of itself: its arithmetic readings as facts, interpretation left to authored notes**
   (the practitioner, 2026-11-15, on Salmonella's melon
   table: *"unless the ontology can help structure the interpretation"*, then *"Yes"* to both). The step states what
   follows from its cells (interval above, below or across 1; a zero cell, no ratio; a cell of 1 or 2, unstable), never
   which exposure is the vehicle. Salmonella's interpretation goes in as authored notes now. A widget improvement, not an
   experiment (the practitioner, 2026-11-15: *"218 should also not be an experiment it's widget improvement"*); the plan:
   - **The step states:** the interval wholly above 1, wholly below it, or across it; a cell of 0, so no ratio (today the
     cell says "unknown" and nothing says why); a cell of 1 or 2, unstable; several exposures with no correction for the
     number of comparisons, and odds ratios only for the declared design (both said today). **The practitioner states,
     as authored notes:** which exposure is the likely vehicle, exposures that go together, what confirmed the vehicle
     beyond the table, crude here and adjusted elsewhere. No exposure is named, ranked or highlighted, as experiment 161
     decided for the table itself.
   - **To decide:** whether "unstable" at 1 or 2 is stated, or the smallest cell given and the reader left to judge;
     where a reading appears (a column per row, a line in the Notes table note, or both); reading classes in `fw:` so a
     SHACL shape can check that no ratio is reported over a zero cell, reusing STATO or OBCS terms where one means the same.
   - **Checked on:** Salmonella's matched panel table (Galia wholly above 1, 4.02 to 60.6; the other melons b = 0, no
     ratio; cantaloupe b = 1, unstable); Oswego's menu (vanilla ice cream wholly above 1).
   - **To watch with a trainee:** whether, with the readings beside the table, they still reason to the vehicle
     themselves or read the readings as the answer. Not established by any reading: that an exposure caused illness, or
     that the readings are complete.

### 35. Lycoming's 1943 sheets under Oswego's map

35. **Lycoming's 1943 sheets under Oswego's map, through Fieldwork's own widgets: next, ahead of NYC, Sierra Leone and
   the ABM spike** (the practitioner, 2026-11-15: *"Do we have a 1940 map of Lycoming?"*, *"Yes download"*, *"I want
   this process to use as much of the built in infrastructure FW has already with some enhancements"*, and *"Yes,
   next"*). USGS 1:31,680 *Oswego East, NY, 1943* and *West of Texas, NY, 1943*, public domain, polyconic on NAD27.
   Found on the way: **Oswego East's GeoTIFF tags place it 652 m east-west off its printed corners** (244 pixels at
   both the north-east and south-west corners, under 2 vertically); West of Texas is exact; at the seam the road through
   Lycoming steps 40 to 50 m. Known gaps in existing widgets, closed in this order, no new widget:
   (1) **Georeferenced map image reads a GeoTIFF**: a picture told from a values raster by its tags (colour bands,
   8-bit), its projection read with proj4 (polyconic, transverse Mercator and the like), redrawn north-up over the study
   area only; (2) **it opens on the file's own placement, its printed corners marked**, so a misplacement shows on sight
   in the existing preview over today's map; (3) **a shift-only fit** among the placement models, for tags that are
   only offset, both placements kept in the record; (4) **Map takes several ground inputs**, as it takes several point
   layers. With them, Raster input names a picture and points to Georeferenced map image. Then Lycoming ships in the
   Oswego repository with both sheets and junction guides, as Hagelloch's 1824 sheet does, each sheet matched to
   today's junctions so the seam is settled by evidence. Still a separate question: (b) a step that finds a historical
   map for the study area from an open catalogue, which would need an experiment record first. **Enhancements (1) to (4) built 2026-11-15** (0.125.0; experiment 201, dated section); Lycoming's sheets in the
   Oswego repository next.

### GHS-POP over DR Congo is refused: 8-byte cells (found 2026-11-19; streaming decided the same day)

**Built 2026-11-19:** Raster input 0.13.0 keeps a reduced copy past the limit; Sample a raster 0.8.0 reads the full
window in strips (kernel/src/zonal.rs), equal to the in-memory totals on a small raster. On DR Congo in Node.js: the copy
6.3 s, 240 districts with exact medians 20.7 s, 1.2 GB at most, 109.1 million people. Left: the same in a browser tab
through the dialog (the practitioner's run of the example), and by range from the JRC.

The population rasters example over DR Congo: GHS-POP's window is about 519 million cells of 8 bytes, 4.2 GB, past
the 2.1 GB a tab decodes (`raster-decode-bytes`). WorldPop's, 4 bytes a cell, fits. Options put to the practitioner:
hold GHS-POP's cells as 4-byte numbers, stated (7 significant figures a cell; totals still summed in 8 bytes);
split the window into pieces (no value changed, but every raster step assumes one array, and about 4 GB a tab); or
GHS-POP over a province in the example. Then asked whether rasters could be processed in Rust, the practitioner
chose **streaming** (*"Start streaming"*): zonal sums and sampling read the raster block by block in the Rust kernel
and never hold the whole window, so no value is narrowed. The 4-byte option is not pursued. Cost to settle in the
design: a streamed raster is read again from its source at each run, where today the clipped window is kept.

### WebGPU as an accelerator, never a requirement ([225](docs/experiments/225-webgpu-as-an-accelerator.md), asked 2026-11-19)

The practitioner: *"I think we should push WebGPU so when the need arrives, which is foreseeable, we are prepared."*
Placed after raster streaming (the practitioner: *"Agree with WebGPU order"*), which will show whether summing a
raster's cells is bound by arithmetic or by reading. The spike: where WebGPU is offered (the gate's headless Chromium
included), a density surface in the Rust kernel and in WGSL compared cell by cell, and the fallback.

### DHIS2 as a table source, with a test server in Docker (asked 2026-11-19, widened 2026-11-20)

The practitioner: *"Can we also test connection with the public test DHIS2 instance, add as a TODO item."* DHIS2 runs
public demonstration servers (play.dhis2.org) with published demonstration accounts. To find out, before anything is
built:

- **Whether a browser page on another origin can call its Web API at all.** DHIS2 answers another origin only where
  the server lists it (CORS); a demonstration server may not list Fieldwork's. If not, the question is a proxy, which
  this project avoids, or a file exported from DHIS2.
- **What a signed-in read returns**: organisation units with their geometry (a polygon layer), and data values or
  analytics by unit and period (a table), at the size a district needs.
- **How a person signs in**: a personal access token held in Credentials, as GitHub's is, not a password.

Signing in to the demonstration server is the practitioner's step: its address is not a development or test host by
the rules this assistant follows, so the assistant does not type its demonstration password. Nothing downloaded without
asking.

**Measured 2026-11-20, headers only, no sign-in.** `play.dhis2.org` now redirects to `im.dhis2.org/public/instances`, a
JavaScript list of instances; `play.im.dhis2.org/dev` answers. Asked from `https://digital-twin-ph.github.io` and from
`http://localhost:4199`, its `/api/system/info` sent **no `Access-Control-Allow-Origin`**, on a GET and on the
preflight a browser sends before an `Authorization` header. So a Fieldwork page cannot read it: the demonstration
servers do not list Fieldwork's address. DHIS2 lists allowed addresses in its CORS whitelist (System Settings, Access),
which a server's administrator sets. A country's own server would have to add Fieldwork's address; on a demonstration
server that is an administrator's change, and it would not survive the server's reset. Not established: whether a
signed-in request differs (it should not, since the browser stops at the preflight), and which stable instances exist.
Raised with the practitioner the same day, for a DHIS2 tab in Tabular data beside Census tables.

**Widened 2026-11-20.** The practitioner: *"I asked about the public DHIS 2 instance as well because it is a source of
tabular data where countries have DHIS2 based surveillance"*, then *"Add DHIS2 to TODO including a docker test
server"*. In order:

1. **DHIS2's own export, through Your file.** DHIS2's Data Visualizer and pivot tables download CSV, which Tabular data
   already reads. Proposed for the Tabular data batch: a DHIS2 tab that says how to export, recognises the export's
   columns (data element, period, organisation unit) and proposes their descriptions, as the census tab does with its
   data dictionary. Works for any country, whitelisted or not.
2. **A DHIS2 test server in Docker, on this Mac.** DHIS2's official image (`dhis2/core`) with PostgreSQL and PostGIS,
   loaded with DHIS2's Sierra Leone demonstration database. On `localhost` its CORS whitelist can list Fieldwork's
   local address, so the connection can be built and tried against a real DHIS2 that resets only when we reset it,
   without asking anyone. Docker 28.3.2 is installed. Before anything is pulled: the image tags, the database dump's
   source and size, and the memory DHIS2 asks for, each stated and asked, since the image and the dump are downloads.
   DHIS2 is not Fieldwork's own application, so setting its administrator password, adding the whitelist entry and
   making a personal access token are the practitioner's steps, written out for them; the assistant does not type
   that password. The gate never depends on Docker: it answers from recorded copies of the server's replies, as for
   geoBoundaries.
3. **A connection to a DHIS2 server**, its own release: a personal access token held in Credentials, as GitHub's is;
   data sets, data elements, organisation units and periods listed; analytics read as a table and organisation units'
   geometry as a polygon layer. Tried against the Docker server first, then against a country's server whose
   administrator whitelists Fieldwork's address.

Not established: whether DHIS2's analytics API returns a district's data at a size a browser handles, which DHIS2
versions the countries in the worked examples run, and who could whitelist Fieldwork on a country's server.

**The Docker server, running 2026-11-20** (the practitioner: *"Yes to DHIS2 download"*; *"It's local ephemeral DHIS2 so you
can set credentials"*). In `digitaltwin-ph/dhis2-test/`, beside the repositories and in none of them: `compose.yml`
(DHIS2 `dhis2/core:2.41.11.0` and `ghcr.io/baosystems/postgis:16-3.5`, arm64; DHIS2 on `127.0.0.1:8080` only, the
database not exposed), `db/dhis2-db-sierra-leone.sql.gz` (83,750,076 bytes, sha256 `1dc1a75e…cb61110`, from
databases.dhis2.org/sierra-leone/2.41.11), and `setup.sh`, which replaces the demo's published admin password with a
generated one, lists `http://localhost:4199`, `http://127.0.0.1:4199` and `http://localhost:4195` in the CORS
allowlist (`/api/configuration/corsAllowlist`, answered 204), and makes a personal access token; passwords and token
are in `dhis2-test/.secrets/`, never printed. **Measured:** the preflight from `http://localhost:4199` with an
`Authorization` header is allowed, and a read with the token returns version 2.41.11 with
`Access-Control-Allow-Origin: http://localhost:4199`. So a Fieldwork page can call this DHIS2.

What the Sierra Leone database holds for vaccine-preventable diseases, counted in it: IDSR Weekly (plague, malaria,
cholera, measles, yellow fever; 12,803 weekly values each for measles and yellow fever, December 2024 to December 2026,
368 organisation units), monthly Morbidity new cases (measles 4,322 values, yellow fever 246, neonatal tetanus 146, AFP
64; 2025 to 2026), and measles doses given (48,213 values, 2016 to September 2026). Its dates run to the end of 2026, so
DHIS2 regenerates the demonstration data; it is not a country's reporting. **No case-based VPD program, and nothing for
diphtheria or pertussis**: those would be generated here and marked synthetic, if wanted. Two traps recorded in
`setup.sh`: Postgres answers a socket health check while it is still restoring the dump, so the check is over TCP; and
DHIS2 answers 202 to a password change, so the new password is saved before it is set.

### From Nigeria, 2026-11-02 ([162](docs/experiments/162-polygons-are-records.md))

- **Declare `MAX_TABLE_ROWS` and `MAX_LAYER_VERTICES` in `widgets/caps.json`**, with measured evidence.
- **Boundary selection has no "select all", and hangs without refusing past one extent's budget.** It also
  said 773 units when 774 were selected.
- **Uncertainty does not reach a map or a rule.** A table holds one value per row.
- **The priority map shows a value key beside the class key.** A change map wants a diverging scale at zero.
- **A rule's layer note still reads "Values on the study area".**

### PMTiles on the map ([163](docs/experiments/163-tiles-from-a-saved-spec.md))

Next: fetch from Source Cooperative in a real browser, and measure a Nigeria extract. Then the import on
`map_output`, exercised by Nigeria. The note in "where PMTiles is the other offline-capable candidate"
that MapLibre would be a new dependency is out of date.

### Nigeria: 20 years and campaigns

The example covers 2005 to 2024. A year slider on the interactive map is designed and not built: classes must
be fixed across all years, or a frame hides the trend. WHO's measles-rubella campaign records are at
`xmart-api-public.who.int/WIISE/V_SIA_MAIN_MR`, 24 for Nigeria, national with free-text areas. WHO's data
terms allow public-health reuse with attribution but not alteration, and no text names this API. Campaigns
are not model inputs, and values are by birth cohort, so a campaign must not be read as a step in its year.
No open LGA source was found; NBS PMCCS 2018 and IPCCS 2024 give state coverage.

### Nowhere to record a hypothesis as a hypothesis

Found 2026-11-02, reading the Nigeria specification. A note can hold the words, but nothing separates
"this generated a question" from "this found something", and a machined sentence can read as a finding.
Machined notes already carry a role (`fn:'limitation'`), so this may be a role and not a structure; the
notes code is not read yet. Possibly an evidence kernel matter. Let Oswego and Nigeria show what it needs.

### Found building Oswego, 2026-11-02 ([160](docs/experiments/160-a-line-list-reaches-a-two-by-two.md))

- **Design *Attack rates by exposure* against Oswego and Stegen together**, decided 2026-11-02, so it
  is not fitted to one example. Stegen 1998: 291 people, 103 cases, 14 exposures, `0`/`1` with both
  `NA` and `9` for missing, portions eaten, and tiramisu at 18.31 with several desserts above 2, so
  overlap between exposures is visible. In `reconhub/learn`. First check its licence, MIT on the
  repository and CC-BY 4.0 on the page, and the original outbreak report.
- **The Thai sports-day outbreak, 1990, as a later example.** `Outbreak` in `epiDisplay`: 1,094
  people, four exposures, eclair pieces as dose, `9`, `80` and `90` as missing or uncertain codes.
  GPL (>= 2), and the catalog notes GPL data can be held and not transformed, so settle the terms
  first or work from the 1995 paper it cites.
- **Built 2026-11-03** as `example-2021-salmonella-germany`, three workflows. Relate as a merge (suffixes, indicator) is designed in experiment 166 and not built.
- **An open case-control line list: Luczynska et al., Germany 2021**, because attack rates cannot be
  read from a case-control study. Zenodo 10.5281/zenodo.7333295, CC-BY 4.0: 32 cases and two control
  groups, 298 rows and 82 columns, German variable names, codebook in xlsx. Codebook and paper not
  read yet. Three groups in one file is a test in itself.
- **The two-by-two mapping dialog is disabled before a run and does not say why**, when a step sits
  upstream. Directly on a table it works. The Inspector's fields use `upstreamKeyValues`; the dialog
  uses `tableOnPort`.
- **Tidy overlaps unconnected nodes**, covering a port so a drag misses.
- **`table_output` labels a port "Point data undefined".**
- **Y and N read badly in the sentence:** "Y against N: 79.630% Y against 14.286%". The values are
  the file's, so any fix must not relabel them silently.
- **A line list must name a numeric value column it does not use.** Oswego uses `Age`.
- **`group_table`'s palette line and title still say it adds up**, now that it can count.

### Brazil: temperature and vegetation on a map (asked 2026-11-06)

The practitioner, 2026-11-06: *"And can we view the temperature and vegetation profiles on a map?"* After the lag
workflow (experiment 180):

- **Temperature, with what exists:** the sampler's table, Terra daytime, into Join a table to the study area on
  `municipio`, with `period_start` as the frames, and a map that steps through the 8-day periods. A workflow in the
  example, played back live.
- **Vegetation has a reader** (0.149.0, 2026-11-18): MODIS NDVI and EVI from `modis-13Q1-061`, 250 m, 16-day. Default
  rule: pixel reliability 0 or 1, from the file's own legend; kept by the practitioner, 2026-11-19 (*"Current for NDVI"*). Not yet in the Brazil
  example's workflows.

### Comprehensibility: five known problems, actionable now (2026-11-07)

**The umbrella.** The practitioner: *"Overall FW is not minimalist. It has a very complex interface that can be
streamlined to reduce the interface friction."* The items below are its parts. Its measure is the audit's count of
visible controls and words per screen, which should fall as each item lands. Item 0 raised every word to a readable
size on 2026-11-07, and that made the crowding plain: tabs and header wrap, and the note dialog's writing box falls
below the fold. And the aim, in the practitioner's words: *"A pleasing interface is enticing to use."*

The practitioner's overall sense of the interface, recorded in
[184](docs/experiments/184-heuristic-evaluation-in-the-lab.md) as its lenses, then: *"The above are already known and
actionable."* So these are work, not candidates waiting on the rating. Each closes on a measurement taken before and
after, in the browser, so a cut is seen rather than claimed.

0. **Done in 0.45.0** (every word 14 px or more, AA contrast; figures in 0.20.1 of Chart and 0.27.2 of Map). **Text too small and too faint to read — first, because it is every word.** The practitioner: *"much of the text
   especially those that look like fine print I hardly read because I have poor eyesight … too verbose and unreadable,
   often in technical prose not plain language."* Then: *"no need to wait for evaluation for things that are staring at
   us in the face."* Measured 2026-11-07 with `tests/text-audit.browser.mjs` (`TEXT_AUDIT=1`, Chromium): words below
   14 px were 311 of 323 on the Workflow tab, 1,623 of 1,639 on the Notes tab, 1,132 of 1,148 with the note dialog
   open, down to 8 px; words under WCAG's 4.5:1 contrast were 215, 505 and 427. Floor 14 px, body 16 px, WCAG AA
   contrast, no meaning carried only in small grey text, sizes that follow the browser's zoom. Measure: the same audit,
   after.
0a. **Done in 0.202.0** (2026-11-26): High contrast in the theme menu, and Match device takes it on a light device
   asking for more contrast. Measured with the text audit: words under 7:1 on the Workflow tab, the Notes tab and the
   note dialog, 138, 412 and 342 in Light, none in High contrast; axe's 7:1 rule passes on every view, the main
   dialogs, and the Snow isochrone example's Inspectors and their dialogs. **A high-contrast theme.** The practitioner, 2026-11-07: *"We should also have a high contrast theme - add this
   to TODO. I actually switch themes depending on the job to be done."* A third choice beside Light and Dark in the
   theme menu, kept per device like the others: near-black on white (or the reverse), no tinted surfaces behind text,
   borders and focus rings strong enough to find every control, and colour never the only signal. Aim at WCAG AAA
   contrast (7:1) for text. Respect the operating system's increased-contrast setting (`prefers-contrast: more`) when
   the theme is Match device. Measure: the text audit in each theme, with AAA as the bar for this one.
   **Ordered after the Sierra Leone review**, 2026-11-07: *"High contrast after Sierra Leone"*.
7. **Fewer worked examples, each high quality and downloadable.** The practitioner: *"We can also declutter our worked
   examples. Better to have fewer high quality ones and make all of them downloadable."* Counted 2026-11-07: 13
   projects, 42 workflows — 7 built into the application (Heat outreach, Old Naledi, Spatial coverage, 1854 Cholera in
   London, Manila coastal, Rulesets, Hagelloch 1861; 12 workflows), none downloadable; and 6 in the catalog, each its
   own repository pinned by digest (30 workflows). Two separate Snow projects. **The bar an example keeps its place by**:
   real, openly licensed data stated in its provenance; a manual that plays back from an empty canvas; its numbers
   checked in the Validation Lab; a written-up Notes tab; downloadable as its own repository. Each built-in example
   earns a repository or retires — outright, under the rule that no outside user depends on it yet — at the
   practitioner's decision, listed against the bar. Measure: examples meeting every part of the bar, of all shown.
1. **Design explanation on screen.** Sort each surface's visible text into instruction, status and design explanation;
   move the third to the manual or the record. Start with the header subtitle, the Notes tab heading, the Inspector's
   step cards, and labels that are this project's terms (*machined*, *derived*, *authored*, *N3 & evidence*).
   Measure: words of design explanation per surface, before and after, extending `validate-inspector-prose`.
   **Moved up, after 18** (the practitioner, 2026-11-11, on the heat example's caption showing in Hagelloch: *"There's
   probably a lot of stale text lying around and I still see a lot of unnecessary commentary in the FW UI"*). Stale
   text is a second class beside design explanation: words true of another example or an earlier version. The heat
   captions were the fallback for every workflow with none of its own (fixed 0.95.0,
   tests/no-borrowed-captions.browser.mjs). The sweep: every string the interface shows, inventoried by surface, each
   marked instruction, status, design explanation or stale; the stale removed, the explanation moved to the manual.
   The built-in example captions in `src/app.ts` (blank, raster, Snow, Old Naledi, heat) are the next to read: the
   built-ins are themselves under item 7's bar.
   **And opportunistically, always** (the practitioner, 2026-11-11: *"The UI should be intuitive enough that it does not
   need commentary text. Commentary text about design belongs in design documents not the UI. Let's be opportunistic
   with taking them out like when we standardize widgets when we touch them."*): any surface touched loses its design
   commentary and stale text in the same pass, as a widget touched moves to 186's standard.
   **First pass, 0.202.0 (2026-11-26):** the header-to-Notes surfaces read. Removed as design explanation: the project
   bar's tagline, the N3 & evidence tab's "facts → rules → inference" line, the Notes tab's paragraph on note kinds,
   "GeoJSON → N3" on Study area's card; rewritten as stale: the empty Results panel (retired visual output nodes) and
   Play back the build's tooltip (the reveal rule); the Inspector's subtitle lost the internal id; and "Research
   workspace" left the header, on the practitioner's word (the name and the PROTOTYPE tag stay). **Left, for the
   practitioner:** the glossary's own words on screen (*machined*, *derived*, *authored* in the Notes counts and
   cards; the *N3 & evidence* tab), which the naming review holds; and the built-in example captions, already gone (removed
   2026-11-11, `src/app.ts`), so nothing was left to read there. **Second pass, 0.203.0 (2026-11-27):** the empty
   canvas says the other widgets appear once a source is on it; the table filter, the map legend's default, the
   new-project notice and the Ontology link's tooltip rewritten. **Measured** by `npm run measure:prose`, a report, not a
   gate: design-vocabulary strings 3 (42 words) at 0.201.0, 2 (21) at 0.202.0, 1 (10) now, the Ontology link's name.
   A source scan of index.html, the Notes tab and app.ts, code fragments set aside (so the Notes tab's assembled note
   kinds go uncounted); the Inspector stays with `validate-inspector-prose`. Measuring rendered text, per state, in a
   browser is the stronger form, not built.
2. **Controls without a pattern.** Inventory every button on each surface: label, style, position. One style per role
   (primary action, secondary, link-like, label), one place for a step's primary action. The note card's "open" chip is
   the first instance. Measure: buttons whose style does not match their role.
   **Done in 0.204.0** ([audit](docs/audits/buttons-and-ports-audit.md)): four roles applied; `npm run measure:buttons`
   and a unit test hold labels in more than one role, and Primary buttons that do not commit, at zero.
3. **One standard Inspector; what a widget does goes in its configuration dialog.** The practitioner, 2026-11-07:
   *"The more predictable Inspector looks and behaves the less cognitive overload and dissonance we have."* And:
   *"There are Inspector configuration items that should simply be standard and the function specific ones go in the
   modal dialog."* With: *"We need to have consistent language and behavior for Inspector based port actions."* So
   every Inspector shows the same sections, in the same order, worded the same — name, **Inputs** (one list per input:
   "Not connected", then every step that can feed it), the manual, evidence, version, actions — and nothing else; each
   widget's own settings move into its configuration dialog. Started 2026-11-07 (0.45.0): the shared Inputs section, on
   every step without its own list, and Mean center, Point comparison, Privacy and Catchments moved onto it. **Nine
   widgets still carry their own port lists** (Polygon layer, Table, Relate, Rate, Chart ×2, Reproject, Raster, the
   reasoning chart) with four different wordings; moving them one by one broke ten tests on 2026-11-07 because several
   do more than connect, so they move with the dialog work, designed as one piece in an experiment. Also remove stale
   controls: for each control, does changing it change the step's settings or result? Measure: Inspectors that match
   the standard, of 70; controls that change nothing.

4. **Input ports.** Four port models today (fixed list, inferred from the wiring, switched by a setting, counted); the
   Map's eight always-drawn ports are the clutter case. Choose one model, or two with a stated rule, and draw only the
   ports a step can use. Measure: ports drawn and ports connected, per widget, in the worked examples.
   **Settled 2026-10-15** (Map's one configurable port; [116](docs/experiments/116-model-builder-sideways.md): bind
   when one port fits, ask when more than one does, extend to every widget), restated 2026-11-27; left to build is in
   the [audit](docs/audits/buttons-and-ports-audit.md). **Built in 0.204.0:** one blank port on every
   widget, kinds as symbols, and the canvas asks when more than one input fits.
5. **Spatial steps as black boxes.** A spatial operation shows what it changed, before and after, as table steps do:
   inputs, the operation's outline, what was kept or cut, animated where it helps. Start with Clip polygons. Measure:
   widgets that show what they changed, of those that change something.
6. **What to do next, from the ontology.** The practitioner: *"We have play back build which is useful for replaying
   workflows but none exists for widget use. Like what's the first thing to do."* Then: *"I think the steps is where
   the widget ontology will help because it can constrain what's next."* Measured 2026-11-07: each widget's release
   file declares its ports (inputs, which are optional, the output), but `ontology/widgets.ttl` carries only label,
   manual and figure section, and **all 70 current releases leave `shaclShapes` empty**: no widget's required settings
   are declared anywhere but in code. So: (a) generate each widget's ports into `widgets.ttl` from its release; (b)
   write a SHACL shape per widget for its required settings, into the slot the release already has; (c) N3 rules over a
   workflow's facts and those declarations name the one next step and why (connect an X here, and what produces X;
   choose this setting; run; what accepts this output), shown in the Inspector and feeding the palette. A per-widget
   "Show me" replays that widget's steps from a worked example; today the example manuals exercise 16 of 70 widgets.
   Measure: widgets whose next step can be named from declarations alone, of 70. A widget that cannot be declared
   cleanly is a port or Inspector problem (items 3 and 4).

### From Claude Design, 2026-11-26: the palette, the Inspector, the canvas and the outputs

The four sections below were written on 2026-11-26 in a Claude Design session, on the branch
`equations-and-the-projects-write-up`, which is based on 0.168.0 and was never merged. They are copied here as written,
on the practitioner's word the same day: *"Yes do that instead of merge"*; the audit they point to is copied to
[docs/audits/outputs-on-screen-audit.md](docs/audits/outputs-on-screen-audit.md). They belong with
[Comprehensibility](#comprehensibility-five-known-problems-actionable-now-2026-11-07) and are ordered with it.

**Checked against 0.202.0 the same day, from the code:** still so: the Inspector's subtitle prints `n.id`, Study
design is not in `STANDARD_INSPECTOR`, the canvas stops at 510 px tall, every table's filter reads "Name, evidence, or
service…", the map legend's defaults include "Cooling center", the palette hides search below 530 px, and the empty
canvas still reads only "Click to add. Connect matching ports." Changed since: `STANDARD_INSPECTOR` now holds 45
widgets, not 33, so the Inspector's finding 2 counts are out of date.


#### The palette, read from the code (2026-11-26), not yet ordered

Eight findings, from drawing the Node library on a Design canvas at its real width and order. **Read from the code,
not observed:** whether any of them gets in a practitioner's way is not known. Belongs under
[Comprehensibility](#comprehensibility-five-known-problems-actionable-now-2026-11-07).

1. **Long names wrap.** The column is 205 px, 175 px below 1,150 px of window, 155 px below 850 px (`styles.css`,
   `.studio`). "Sample a raster at points or over areas" and "Relate a column from another table" take two or three
   lines.
2. **Order within a group is the order the code was written in.** `renderLibrary` sorts by group only, so `TYPES`'
   order decides the rest. Study area is 9th of 10 in Sources and Point data last; Spatial operations opens with Mean
   center and Compare point sets; Epidemiology opens with Regression and ends with Cases by period.
3. **Uneven groups.** Spatial operations holds 20 of 51; Comparisons and checks and Semantic reasoning one each;
   Micro-workflows none, so it never shows. The planned retirements (51 to about 41, under [Urgent](#urgent)) change
   these counts.
4. **Shared icons.** 51 widgets use 33 icons, and 30 share theirs with at least one other. ▦ is Point data, Raster
   input, Georeferenced map image, Point grid, Reachable corridor and Cases by period; ⋈ is Apply ruleset and both table
   joins.
5. **Colour carries little.** 34 of 51 are teal. Blue marks sources and also Reproject points, in Spatial operations.
   Deduplicate records and Apply ruleset share purple across two groups. Amber is only Space-time scan.
6. **Three words for one item.** "Node library" and "Find a node…" (`index.html`), "Selected primitive"
   (`study-area.css`), "Widget catalog". AGENTS.md: a widget is the contract, a node one instance of it; the palette
   lists widgets. A naming finding, so it waits on the naming review ([rule audit](docs/audits/rule-audit.md): nine
   findings, no renames, on purpose).
7. **No search and no groups at phone width.** Below 530 px the search box and group headings are hidden and all 51
   entries sit in one sideways-scrolling row.
8. **Search matches text that is not shown.** The filter reads title and description; only the title is displayed, so
   a match on the description lists a widget with no visible reason.

Still open from 2026-10-26, and drawn on the same canvas: the empty canvas says nothing about more widgets appearing
once an input is placed (under [Urgent](#urgent), *"The input-stage palette looks like a palette that failed to
load"*). `index.html` still reads only "Click to add. Connect matching ports."

#### The Inspector, read from the code (2026-11-26), not yet ordered

Six findings, from drawing Rate with a denominator's Inspector on the same Design canvas at its real width. **Read from
the code, not checked in the running app or with a practitioner.**

1. **The subtitle shows an internal id.** `title()` prints the group and `n.id`, and a node added from the palette is
   given `` `${type}-${Date.now()}` ``, so the panel reads "Epidemiology / rate-1764150000000".
2. **Two panel shapes.** 33 of 51 live widgets are in `STANDARD_INSPECTOR` (Name, Inputs, Settings, Result, Learn and
   record); 18 draw their own, among them Mean center, Reproject points, Street network, Polygon layer, Voronoi
   catchments and Point grid. The [Inspector move](#urgent)'s batches C to E reduce the 18.
3. **Standard panels leave out the line saying what the step does.** `renderInspector`'s comment says every panel opens
   with the title, one line on what the step does, then the way in for a learner; for a standard step the description
   and learn block are skipped there, and the Manual link moves to Learn and record at the bottom.
4. **Study design is not in `STANDARD_INSPECTOR`.** The Inspector move (under [Urgent](#urgent)) says it moved to the
   standard Inspector in 0.165.0. Read from the code, it therefore also gets the older description and learning links
   at the top and the older evidence and version blocks at the bottom. Not seen in the app; check there first.
5. **One field, three names.** Section "Name", field "Name", button "Apply label" (`labelForm`); on Chart, Map and Table
   the same field is "Results tab name".
6. **Narrow, and below 850 px it leaves the canvas.** 292 px, 253 px below 1,150 px of window, 320 px above 1,600 px
   (`styles.css`, `.studio`); below 850 px it moves under the canvas at full width, away from the node being edited.

Missed when this section was written, found drawing the canvas: Duplicate and Remove node sit at the foot of every
Inspector, below Learn and record (`#duplicate-node`, `#delete-node`). See the next section's finding 6.

#### The workflow canvas and its menus, read from the code (2026-11-26), not yet ordered

Six findings, from drawing the workbench at 1,440 px on the same Design canvas. The canvas has no right-click menu and
no menu on a node; its menus are the four bars above it and the zoom controls on it. **Read from the code, not checked
in the running app or with a practitioner.** Findings 1 and 2 belong with
[Comprehensibility](#comprehensibility-five-known-problems-actionable-now-2026-11-07), which already records that the
tabs and header wrap.

1. **28 controls above the canvas.** 5 in the header, 4 in the project bar, 9 in the project and workflow bar
   (`.example-bar`), 10 in the canvas toolbar. Estimated from the CSS, not measured: the canvas starts about 270 px
   down the window.
2. **One bar switches, creates and deletes.** `.example-bar` holds both selects, Reset example, New project, Add
   workflow, Delete workflow, From a template…, New empty canvas and Play back the build; Delete workflow sits between
   two create buttons. A project can also be started from the Project tab (`#project-new`) and the blank canvas
   (`#blank-project`).
3. **Run is far from what it runs.** `#run-button` is in the project bar beside Import, Credentials and Back up; the
   canvas's state, "Ready to run" (`#workflow-state`), is in the canvas toolbar.
4. **The canvas does not grow with the window.** `.canvas-view` has `max-height: 510px` (650 px above 1,600 px); at
   1,440 px wide that is 943 × 510 px.
5. **On 44 of 51 widgets the ports are unnamed until hovered.** Only the seven in `spatialPorts` (`src/canvas.tsx`:
   Map, Table, Chart, Raster input, Clip raster, Sample a raster, Join a table to the study area) draw a named row per
   input. On the rest a port is a dot whose `.handle-name` is at opacity 0 until hover (`build/canvas.css`), and shows
   the raw id, such as "records".
6. **A node's actions are not on the node.** Duplicate and Remove node are at the foot of the Inspector. On the canvas
   a selected node is removed by Backspace or Delete (`deleteKeyCode`), and nothing on screen says so.

#### Maps, charts and tables on screen (2026-11-26), not yet ordered

Eleven findings (O1 to O11) and a proposed figure frame shared by all three, in the
[outputs on screen audit](docs/audits/outputs-on-screen-audit.md), which also audits the proposal against itself.
Read from the code, not run or shown to a practitioner. **First to try, if any:** *What was counted* beside each
figure, the one new part. The audit writes three practitioner observations before the result. O5, O6 and O11

### Plain checks on a note, before any model (agreed 2026-11-07)

Asked whether a small language model could improve notes, the answer was: as a reader that asks questions at most,
never as a writer, and most of what it would catch needs no model. The practitioner: *"Agree with skills aspect and
reliability and hallucination re LLM use."* So no model now. The checks, each a finding on the note (flagged, never
refused), deterministic and offline:

- a note citing works with *whose words* unanswered;
- causal wording (*caused*, *proves*, *effect of*) in a note answering *what I make of them*, where overclaiming happens;
- a note answering *what the works say* that cites no work;
- *my words: one passage* citing more than one work.

A small model stays an idea: worth an experiment only if a question it asks leads a trainee to fix something these
checks miss, measured. Experiment 182 records how this arose, [183](docs/experiments/183-forms-of-a-note.md) the
five-form design these checks belong to; the manual page is `docs/surfaces/notes.md`.

### Next after Brazil: `example-2019-sierra-leone-measles` (asked 2026-11-06)

The practitioner, 2026-11-06: *"After Brazil I'd like you to take a look at a new example repo
example-2019-sierra-leone-measles. It has a barebones README and a CSV data file that I have not reviewed yet."*

Not opened yet. **Ordered after 188** by the practitioner, 2026-11-07, answering where it falls: *"after 188"*. So
it comes after Relate's standard dialog, 185, 187 and 188, and the high-contrast theme comes after it: *"High
contrast after Sierra Leone"*. The first pass is a review, not a build:

- Read the README and the CSV as data: columns as the file spells them, row count, keys, time and place coverage,
  missing values, anything the file says about itself.
- Find where the data came from and under what terms, before anything is committed beside it or redistributed: the
  NYC counts could not be, the Salmonella and Brazil data could.
- Examine the widgets against what the data asks for, before proposing any (*examine widgets before proposing*).
- **Can the facility names be geocoded?** The practitioner, the same day: *"It has an organizational unit column which
  are facility names and I am wondering if those could be geocoded."* Look first at matching the names against
  published facility lists rather than a geocoding service: Find health facilities already fetches named facility
  points (OpenStreetMap, healthsites), and Deduplicate records already matches names allowing for spelling. Questions
  for the review: what the names look like (a type prefix such as CHC or MCHP, a chiefdom or district beside them);
  whether an open, citable Sierra Leone facility list exists with coordinates; how many names match, how many are
  ambiguous, how many have none, each reported rather than guessed; and whether a facility point is even needed, or
  the analysis is by chiefdom or district.
- **The design to evaluate first: Find health facilities takes a list and geocodes it.** The practitioner, the same
  day: *"What if Find health facilities is a list and the widget can geocode?"* A table input with the facility name
  column (and a district or chiefdom column where there is one); the widget fetches the country's facilities as it
  does now and matches each row's name to one, handing on one point per row. To settle in the admission review:
  reuse Deduplicate records' name matching (Jaro-Winkler with a review band, lab check 26) rather than a second
  matcher; every row marked matched exactly, matched allowing for spelling, ambiguous (candidates listed for the
  practitioner to choose) or not found, with the counts on the result, and no row dropped or silently guessed; and
  each point carrying its source and how it was matched, since OpenStreetMap and healthsites positions are
  volunteered.
- **Measured 2026-11-08** ([190](docs/experiments/190-find-health-facilities-from-a-list.md)): GRID3 places 247 of
  333 names exactly; OpenStreetMap after it adds one. healthsites not measured.
- **Test GeoNames as a source too.** The practitioner, the same day: *"We can also test if we can find the
  facilities in geonames.org"*. To check, not assumed: whether the Sierra Leone country file can be fetched without
  an account and from a browser (its search service needs a username), its terms as stated at source, and which of
  its feature codes are health facilities. Then how many of the file's names each source finds (GeoNames,
  OpenStreetMap, healthsites), alone and together, and where two sources place one facility far apart.
- Report findings to the practitioner, with what is not established, before building workflows.

### 36. A Validation Lab check for every widget that computes

36. **The eleven widgets that owe the Validation Lab an independent check** (the practitioner, 2026-11-25: *"Lets
   make sure all analytical widgets get a validation lab notebook"*). The ledger already exists and is hand
   written, not derived: `widgets/check-coverage.json` sorts all 53 live widgets into **parity** (computes a value
   an independent implementation could recompute, so it owes a check), **none** (an input, a presentation, or a
   rule node whose conclusions are the reasoner's) and **blocked**. As of 2026-11-25: **31 covered, 11 awaiting, 10
   owe nothing, 1 blocked** (Find health facilities — it computes, but its input is a live external source that
   cannot be pinned to a fixture). `validate:check-coverage` already holds the line: every widget appears exactly
   once, a claimed check must exist in `parity.json`, and the awaiting count may only fall.

   The eleven, each with the implementation it would be read against: **Measure distance** (pyproj geodesic),
   **Rate with a denominator** (statsmodels, the same estimator Fieldwork declares), **Clip points to area**
   (shapely, boundary cases), **Network isochrone** and **Transmission chains** (networkx), **Point grid** (shapely
   and numpy), **Move points in a donut** (pyproj, displacement inside the annulus), **Point comparison**
   (geopandas), **Polygon layer** and **Line layer** (geopandas reading the same file — *read as published* is a
   checkable claim, which is why these owe a check although they compute no value), and **Travel time over ground**
   (`skimage.graph.MCP_Geometric`).

   **Not a file in a folder.** A check runs under `nbclient`, records a measured result with its sha256, names the
   external library *and* its version, and states a criterion it either meets or does not — `parity.json` keeps
   outcomes in the form *"maximum separation 6.70e-5 m over 9 points"*. Each is hand sculpted, as the worked-example
   notebooks are, and some will disagree with their reference, which is itself the finding.

   **Two things to settle before the last one.** Travel time over ground needs a new pin: scikit-image is not in
   `requirements-checks.txt`, and that widget's own reason names `MCP_Geometric` as the established reference, so
   adding it is the practitioner's call. And **seven of the eleven carry no reason** — only Clip points to area,
   Polygon layer, Line layer and Travel time over ground record what their check would establish. The file says
   that judgement "is the part a person has to make and defend in the reason", so it is written as each is taken,
   not left blank.

   Suggested order: Measure distance and Rate first — both have unambiguous references, and a rate ratio recomputed
   with the wrong estimator would agree about nothing.

## Deferred — decided to do later, which is not a decision to do it

_Carried over whole from the root `TODO.md` of 2026-10-10 in the merge above, headings
demoted one level and nothing else changed. An item here is a decision to do it later._

### Conflict events as a layer or a country repository (asked 2026-11-19, shelved the same day)

Raised beside the tide-gauge research ([docs/research/tide-gauges-2026-11-19.md](docs/research/tide-gauges-2026-11-19.md)):
insecurity decides which settlements a vaccination team reaches (Nigeria's northeast) and interrupted the Ebola response
(North Kivu, Ituri). Settled before it was shelved, by the practitioner: **ACLED is a non-starter because of its terms**;
organized armed conflict probably tends to be more disruptive, which points at UCDP; GDELT reaches lower-level
insecurity but **denoising is the problem**, and a language model for it was judged too involved (*"Too involved. We
can shelve GDELT and conflict for now."*). Research was stopped before it reported: nothing on terms, browser reach
or coverage was established. Picking it up starts with UCDP's terms and the attacks-on-health-care sources.

### Immunization microplanning, planned in Fieldwork and simulated (asked 2026-11-18)

**Its own worked example (the practitioner, 2026-11-22: "Separate")**, not part of the Nigeria immunization example: a
repository of its own (`example-2026-nigeria-microplanning`, name to confirm), linked both ways. The Nigeria example's
fourth workflow picks the LGA; this one starts there. Kept apart because GRID3's friction, wards, settlements and roads
are CC BY-SA, so what is built from them is too, and because it is village-level (30–100 m) in one state, where the
Nigeria example is LGA-level across the country. Travel time to care is its first piece: the kernel agrees with MAP's
method on Kano (experiment 225); GRID3's 30 m friction (CC BY-SA 4.0) and Health Facilities v4.0 (CC BY 4.0) are
downloaded, outside any repository.

The practitioner, 2026-11-18, after a CDC GIS Day talk on polio microplanning: *"It seems we can also use ABM for
immunization micro planning"*; then *"There's two things to consider: 1-the planning itself can be conducted within FW.
2-the plan can be simulated"*; *"The population to be vaccinated do not move, they are allocated to houses in the
district"*; and *"We can do this with Nigeria example?"* — yes: one of the LGAs the Nigeria example's fourth workflow
marks.

- **The plan, as widgets:** facilities chosen; a **travel-cost surface** from roads, water, slope and land cover (new);
  **catchments over that surface**, each cell to the site it reaches soonest (extends catchments); under-5 children per
  area by Sample a raster; teams per area by a declared ruleset; team areas by the same allocation.
- **The simulation, experiment 220's way:** children allocated to houses from building footprints; teams move house to
  house over the cost surface at a declared pace and daily capacity; a child is missed when no team reaches the house;
  coverage by day, cell by cell, set against the plan; missed houses feed a declared disease model.
- **Design reference:** the WHO-UNICEF COVAX GIS Working Group's *Geo-enabled Microplanning Handbook* (GRID3, 2023),
  shared by the practitioner: its four applications (master lists, population, accessibility and route models,
  thematic maps) and its Nigeria polio case. No licence found in it: cited, never copied; its public link still to find.
- **Data, from the research of 2026-11-18** (`reports/Open immunization case study data.md`, outside the repository):
  GRID3 health facilities and WorldPop under-5 are CC BY 4.0; GRID3 wards, settlements, roads and friction are CC BY-SA,
  so what is built from them is too; Microsoft or Google building footprints, not GRID3's Ecopia/Maxar ones; the
  tracking method of Touray et al. (2016, open). No vaccinator tracks or settlement-visit records are open anywhere, so
  tracks would be simulated and said to be.

### A road traffic injury worked example (asked 2026-11-18, not urgent)

The practitioner, 2026-11-18: *"Road traffic safety not urgent so we can to a later TODO."* A research pass the same
day is kept outside the repository (`reports/Road traffic injury worked example.md`); move it into `docs/research/`
when this starts. What it found:

- **Settings:** Bogotá for the data (crash points and road-user tables since 2015; the 2020 base CC BY-SA 4.0, each file's
  licence still to read); Nairobi for the story (Kenya FELTP's hospital surveillance pilot beside Ma3Route's
  crowd-sourced points, licence not named); Great Britain's STATS19 as the clean-licence check (Open Government Licence).
- **TAP, suggested by another AI tool as "Ren et al., 2023":** the authors are Huang, Hooi and Shu (ACM SIGSPATIAL 2023);
  its crashes are traffic-feed incidents from Kaggle's US-Accidents, its severity is delay, not injury, and its data has
  no licence. Not usable.
- **The teaching gap:** no FETP investigation found maps crashes or looks for clusters; police records miss most
  injuries, pedestrians and motorcyclists most of all.
- **First step:** read three licence pages (Bogotá's files, the World Bank's Ma3Route terms, Mexico City's portal).

**Several focus insets on one map** (the practitioner, 2026-11-18, showing a published crash map with four): a circle
around each cluster on the map, each enlarged in its own circle placed where it covers least, one line from each small
circle to its large one. The single circular focus inset of 0.144.0 is its first case; this makes the inset a list.

### Open immunization data fetched on first use: VCQI's coverage survey (asked 2026-11-18)

The practitioner, after the immunization data research: *"Add to TODO"*, for an example that fetches its data on first
use as NYC's does. The WHO VCQI test dataset (a coverage survey's records) is the candidate: fetched from its published
repository pinned to a commit, checked by digest, never redistributed. First step: read its licence and where each file
lives; ask before downloading.

### Elevation in the sea level rise example (asked 2026-11-18: "All three")

1. **The DEM shown** under the Philippines example's map.
2. **Hillshade and slope** computed with terrio's `dem` (experiment 221 checked slope on a known plane).
3. **Ground below the 2100 projection**, as cells of the DEM against the projected level.

### The target outputs, after their audit (2026-11-19)

The [target outputs audit](docs/audits/target-outputs-audit.md) printed South London as a publication, MERS as a sit rep
and NYC as the full report. **Done in 0.150.0:** attached tables and the annex file, MMWR's name out of the formats,
the shared print defects. **Next pass:** a chart's two titles; captions the steps write (row counts before a pivot,
"keyed by", wrong chart descriptions); map keys listing what is not drawn; fine print inside figures; the data notes'
length in a sit rep. **With experiment 202's design:** Methods stated once per analysis (gap 4), citations and
cross-references in the text (gap 10), a table of the source's printed values beside the run's (gap 13).

### An infographic output, after publication, sit rep and surveillance summary (asked 2026-11-18)

The practitioner: *"Infographic will be for later. Let's refine publication, sit rep and surveillance summary first."*
From Kenya's sitrep infographic (structure only, never its design): key-figure tiles, and one map of several events.

### Keyed basemaps in figures (found 2026-11-18, experiment 222)

CARTO and Esri basemaps draw on the interactive map only; a figure draws OpenStreetMap in their place. Esri's terms
were read on 2026-11-18 and leave figures unresolved: output only within the application, never redistributed
(experiment 222). Esri stays interactive unless Esri confirms in writing (decided 2026-11-19), and the Credentials
manual says an Esri key is used under the person's own agreement with Esri. CARTO's terms are still to read.

### Fieldwork in other languages: localisation, not a model (asked 2026-11-15)

The practitioner, on translation for Africa: *"The interface is more deterministic in terms of translation, and so
are manuals and training materials."* Three parts, all fixed text, translated once, reviewed by a speaker and kept as
files, with no model at run time (a translation tool may help draft at authoring time, never ship unreviewed):
(1) **interface labels**, today written inline in English throughout `src/`, every page `lang="en"`, so a large
retrofit into per-language string files; (2) **manual pages and training materials**, per-language Markdown beside the
English, compiled as now; (3) **the steps' machine notes**, which widgets compose from templates and so can be given
templates per language. The person's own writing stays in their language; a draft's language follows the project.
**Order:** French and Portuguese (the WHO Africa region's working languages with English), then Arabic (which needs
right-to-left layout) and Swahili (an African Union working language). Speaker numbers and what WHO's Africa region and
Africa CDC publish in are from general knowledge and to be checked at source before this is scheduled. Related: 202,
*Help with the writing* (a model set aside; translation of a sit rep named as what could reopen it).
### Search a satellite catalog: keep the full files, so they are not downloaded again (asked 2026-11-05)

The practitioner, 2026-11-05: *"For STAC widget can we have the option to download the full files? Not urgent but
would be useful for the future to avoid redownloads."* Today nothing is kept: Sample satellite files at points reads
only the chunks it needs, by range, and a reload reads them again.

What is known that shapes it:

- **Size.** An offline Sentinel-5P NO₂ orbit file is about 600 MB (606,642,278 bytes for 7 June 2023); 1 to 14 June
  is roughly 8.5 GB. A near-real-time granule is about 60 MB. The option has to state the size before anything starts.
- **Speed.** From the machine this was built on, a browser fetched that storage at 35–55 s per MB and curl at 1–4 s
  per MB (experiment 179). A full file through the browser is hours, so the choice and the progress both matter.
- **Where it goes.** Two places, and they answer different needs: a file on disk the practitioner chooses (JLT's STAC
  Browser does this: *Save original to file*, streamed where the browser can, a bounded download otherwise), or the
  payload store (IndexedDB), where the sampler could then read it without the network. Only the second avoids a
  re-download inside Fieldwork; the first serves Python and QGIS.
- **What it must not do.** Start without saying the size, or fall back silently to a whole-file read where a range
  read was asked for.

**Chosen 2026-11-05: a file on disk that Fieldwork can read again.** Asked *"File on disk with the ability to read it
again is that doable?"*, then *"Add to TODO"*. The shape agreed:

| | Chromium (Chrome, Edge) | Safari, Firefox |
| --- | --- | --- |
| Saving | the practitioner chooses a folder once (File System Access API); files are written there, and the folder's handle is kept in IndexedDB | an ordinary download, since neither lets a page write to a chosen folder |
| Reading again | one permission prompt per session for the kept folder, then no download | the practitioner picks the file, one click per file |

- **Read in parts, not whole.** h5wasm reads a file on disk the way it reads a remote one (Emscripten's WORKERFS over
  the `File`), so a 600 MB file is never loaded into memory at once. **Not yet tried: the first thing to prove.**
- **The right file, or the network.** A saved file is matched to its catalog item by name and exact size; a mismatch
  is said, and that item is read from the network instead.
- **Per file, stated.** A saved copy where there is one, the network where there is not, and the receipt names which
  for each file.
- **The desktop app** (Tauri) could read and write directly without prompts; later.

Open: whether a local read is fast enough in each browser (to be measured); whether name and size suffice or a checksum
is needed, which costs time on 600 MB and which the catalog may not publish.

Not started. Belongs to Search a satellite catalog's Inspect column, beside each file's access facts, and to Sample
satellite files at points, which reads the saved copy.

### In progress

- **Act on [the widget design audit](docs/audits/widget_audit.md)**, run 2026-10-09 against
  all 39 widgets. Complete on D1, D2, D7 and D10; sampled on D3, where the first sample
  found an unenforced distinction, so the exhaustive D3 pass is the next step. Its six
  ordered actions are the near-term work.

### Snow's denominator: wire up `snow-gboh`, then South London

**Raised in priority 2026-10-23 at the practitioner's direction**, on the day they met the same
lesson in their own work: a WorldPop raster is a denominator for health zones in Ituri, and a
case count without one is the Soho map again. This is that lesson on data where the answer is
known.

Two steps, deliberately in this order. Both came out of the practitioner asking, 2026-10-19,
*"what other epidemiological computations are possible with Cholera Outbreak data aside from
epidemic curve?"*

### 1. Wire up the data already in the repository

`examples/snow-gboh/` has been present since 2026-10-09, with a `provenance.json` that records the
source digest, the four limits and the licence reasoning — and **no file in `src/` references it.**
It holds `deaths_nd_by_house.csv`: 1,852 houses from the 1855 General Board of Health map,
**including the 1,483 where nobody died**, 706 deaths (661 residents, 45 non-residents), and
precomputed distances to the Broad Street pump, the former pest field and the nearest sewer grate.

Those zero-death houses are a denominator, which is what the 250 mapped death locations do not
have. The difference it makes, measured 2026-10-19:

| band from the pump | houses | deaths | deaths/house | % houses affected |
|---|---|---|---|---|
| 0–50 m | 45 | 84 | **1.867** | 55.6% |
| 50–100 m | 140 | 186 | 1.329 | 59.3% |
| 100–150 m | 283 | 204 | 0.721 | 41.3% |
| 150–200 m | 429 | 150 | 0.350 | 20.3% |
| 200–300 m | 724 | 78 | 0.108 | 7.5% |
| 300 m+ | 231 | 4 | 0.017 | 1.3% |

Monotone across a 110-fold range. The same gradient computed from the 250 mapped points — which
condition on a house having had a death — runs 3.33 down to 1.00 and is barely a gradient at all.
**Same outbreak, same pump, and the selection decides the finding.** That contrast is a better
teaching artifact than either table, and it is this project's "a number needs a denominator" lesson
in its own data.

Three things this makes possible that no workflow does today:

- A rate with a real denominator. `validate:evidence` reports `rate` as one of four widgets at the
  **weakest evidence rung**, and this is the example where `minimumDenominator` and `rateKind` do
  actual work.
- The competing 1854 hypotheses tested against each other. `dis_pestf` and `dis_sewers` are the
  miasma explanation's own candidate exposures, sitting in the same file as `dis_bspump`.
- Resident against non-resident deaths. 661 and 45, and the file's own limits note warns that
  `deaths` "mixes a numerator that includes visitors with a denominator of dwellings".

**Two constraints, both already recorded in that `provenance.json` and neither to be worked
around.** The coordinates are OSGB 1936 / Airy 1830 and this application deliberately performs no
datum shift, so the analysis is tabular and uses the distance columns — there is no map. And the
licence is *"GPL, version not stated by the publisher"*: redistribution verbatim is aggregation and
does not affect this repository's Apache-2.0 licence, but **"a reprojected, filtered or otherwise
modified copy would be a modified work and would have to carry the GPL and be marked as
modified"**. So a workflow reads these columns; it does not ship a transformed copy of them.

### 2. South London, as its own repository, imported as a bundle

Snow's other 1854 investigation — Southwark & Vauxhall against Lambeth, two companies whose mains
ran down the same streets, one drawing from the sewage-laden tidal Thames and one from Thames
Ditton after the Metropolis Water Act of 1852. Roughly 315 deaths per 10,000 houses against 37, a
risk ratio near 8.5, with exposure assigned by a chloride test because residents often did not know
their supplier. It is the study with the denominator, and the ancestor of the cohort design.

It is **not** in this repository, and adding it as a worked example is the expensive route: example
data is imported at build time, and a new `exampleId` touches the closed union in `types.ts`, the
`template()` dispatch, `NAMED_WORKSPACES` twice, the static picker options in `index.html`, the
deep-link allowlist and `loadExample`'s per-example selection — the *"examples are the default
world"* problem in the one place it is least visible.

So: a separate repository, imported as a `fieldwork/bundle/1` workflow into the **1854 Cholera
Outbreak in London** project ([122](docs/experiments/122-a-project-holds-many-workflows.md)). A
project holding imported workflows is the practitioner's own request from the same day — *"create
project, import workflows into project"* — and a South London table is kilobytes against a 500 MB
bundle ceiling (20 MB when this was written; raised 2026-10-22 and again 2026-10-23). The separate repository earns its keep on licensing rather than architecture: it
isolates third-party data and lets a derived copy carry the source's own licence without touching
Fieldwork's.

**Settled 2026-10-23: it does.** `geodacenter.github.io` answers `access-control-allow-origin: *`
for HTML and for a `.zip` asset, `pages.github.com` the same, and `raw.githubusercontent.com` the
same on GET. So runtime loading from another repository does not hit the DHIS2 and geoBoundaries
wall and vendoring is not forced. One trap recorded with it: **HEAD on `raw.githubusercontent.com`
returns no such header and GET does**, so a HEAD-only probe would have sent this the other way.

**A caution worth keeping in view.** The South London study's power is not spatial — it is a 2x2
contrast of two intermingled populations. A worked example in a semantic GIS studio whose central
computation is a table with no map is defensible, and it is a departure. Mapping it needs 1850s
sub-district boundaries, which is the hard acquisition; the table is the easy part.

**Neither started.** Step 1 needs no acquisition, no new repository and no licence manoeuvre — only
a workflow — which is why it comes first.

### A workflow keeps being called the example it started as

The practitioner, 2026-10-23, looking at a canvas holding a study area, a WorldPop raster, a
clipped raster, a street network, health facilities and a map, under a caption instructing them to
draw and run a rule:

> *"The text 'Experiment 01 · draw → inspect facts → run the rule' before the Reset Layout button
> seems to be stale content."*

It is, and not in one place. `exampleKey` resolves to `blank` and the `blank` branch of `render`
sets **four** captions unconditionally: `#example-note` ("Experiment 01 · draw → inspect facts →
run the rule"), `#canvas-example` ("STUDY AREA · EXPERIMENT 01"), `#project-description` and
`#footer-context`. All four are pinned to the example IDENTITY and none to the content.

**There is no divergence check anywhere.** The application knows a worked example ships and stays,
and offers Reset example to discard edits to it, and nothing compares a canvas to the template it
came from. So the one workspace designed to be built in is the one that goes on describing itself
as a scripted exercise.

It compounds through the project level: `exampleKey` returns `blank` for ANY workflow carrying a
`projectId`, so a workflow inherits Experiment 01's captions the moment it joins a project --
which is the thing [131](docs/experiments/131-project-and-workflow-lifecycles.md) is encouraging.

**What it would take.** `template(key)` already exists and is what Reset example restores, so
divergence is computable by comparing the canvas against it. When they differ the note stops
asserting a recipe and the eyebrow stops claiming EXPERIMENT 01. The test is a canvas built on the
blank workspace that is no longer called Experiment 01.

**Where it belongs.** With 131 rather than beside it. "No longer the example it started as" is a
lifecycle fact about a workflow, and Draft, Run, Stale and Refused have no word for it. Whether it
needs one, or whether the captions should simply fall silent, is the design question -- and by the
rule this project already has, the word goes in the glossary before it goes in a panel.

### Parity is keyed to a version, so a cosmetic release invalidates real evidence

Found 2026-10-23 by the gate, not by reading. `clip_raster` was bumped 1.0.0 -> 1.1.0 for a node
label field, and the widget catalog immediately began reading **`partial · earlier release`**: its
parity entry carries `coversRelease: 1.0.0`, and `src/catalog-ui.ts` marks any entry whose covered
release is not the current one.

The ledger is right and the cost is real. **The bump could not have changed the clipping the
parity run measured** -- a label field is not a raster mask -- and the evidence was still
invalidated, because parity is pinned to a version string rather than to what the release changed.
`validate:widgets` now lists clip_raster beside `access_policy` and `xpert`, which are stale for
the same reason, and parity is recorded for 23 of 55 widgets, so the pool this erodes is already
small.

**What it would take.** Either parity entries say which release range they still cover, or a
release declares whether it touched the computation parity measured -- `changes[].kind` already
distinguishes `fix` from `changed`, so the information is half there. Re-establishing parity needs
a run in the validation lab and cannot be edited into the ledger, which is the right constraint
and also why the stale list only grows.

**Not a reason to stop bumping.** The alternative is a release note that does not exist for a
control a practitioner can see, which is the fault paid off earlier the same day.

**And the same drift has now reached the LESSONS, which have no ledger to catch it.** Measured
2026-10-31: `validate:widgets` lists twelve widgets whose parity covers an older release than the
one that ships -- reproject, clip_raster, mean_center, reachable_nodes, summarize_combined_area,
stack_polygons, snap_to_network, policy, access_policy, xpert, rate_ratio, two_by_two. One of them
is `mean_center`, and `mean-center.ipynb` is one of the **two** lessons in `dive-deeper`. The
notebook names no widget version at all, so WHICH release it was written against cannot be read
from it, and whether its content has drifted has not been checked. That is the finding: a parity
entry degrades visibly to `partial · earlier release`, while a notebook just reads as current.

That is the control-that-cannot-act rule applied to prose rather than to a button. The coverage
gap itself is NOT the defect and is correctly sequenced -- the practitioner, 2026-10-31: *"There
are still gaps on the dive deeper side, but that's easy to close when the widgets stabilize"*, and
lessons are cheap to write and expensive to keep true, so they follow stabilisation. What does not
wait is the NOTICE. A lesson should state the widget release it was written against, and something
should report when that release is no longer current, so a reader learns a method from a notebook
that admits its age. Whether that check belongs in `dive-deeper` or in this repository's validator
is open; the validator already holds the version it would compare against.

### The planning stage: where a note about the world goes

Raised 2026-10-24, reading Snow's chloride measurements: *"The tide part is interesting because
Cholera vibrio survives inside copepods."* ... *"we do not have a dive deeper class for historical
notes. Perhaps we can now incorporate it in the planning part of the workflow (that's pre-workflow
and undeveloped) as we have planned earlier? That way we can capture Snow's narratives, and with
the historical notes we can then create our story map."*

There are three places a sentence can go today and none of them fits. `provenance.json` is for
claims about the DATASET; Dive Deeper notebooks are keyed to a `nodeType` and are about a widget's
method; Inspector prose is scored per explanation against a 240-character limit and is where a
control is explained. A note about the world the data came from has no home.

[Experiment 27](docs/experiments/27-workflow-learning-and-gamification.md) already proposed one --
a side notepad to plan, prototype and reflect, with dated iteration notes and a stated boundary
against source citations -- and it has never been built.

**The task is not the filing.** Sharpened the same day: *"The elegant part comes in if we include
story map structure as the frame for both the historical notes and the workflow. How to combine
them is a genuine DE question."* So
[133](docs/experiments/133-the-planning-stage-and-historical-notes.md) asks whether a story map's
structure can be the frame a workflow is PLANNED in rather than a presentation applied to one
afterwards -- sections written first, each binding a claim, the context that motivates it, and
the outputs that evidence it. That binding is what would make assurance expressible: a reader
asking "was this made under conditions I would accept?" asks it of a claim, and this application
has no object that is a claim.

**And the danger is the question.** Writing the story first is how evidence gets fitted to a
narrative. The discipline that makes it honest is 27's own prompt -- *What do I predict?* -- and
the test is whether a section contradicted by its run survives and says so.

**Why it is more than tidiness.** [119](docs/experiments/119-can-this-tell-a-story.md) found the
three measurable conditions for a good story already present and *scattered*, with assurance
missing; [17](docs/experiments/17-workflow-publication-products.md) wants a story map as an end
product. A story map needs the sentences between the layers, and there is nowhere to write one
that belongs to the investigation rather than to a widget, a dataset or a control.

**First subject if built**: the copepod note on the South London example, which must read as
modern knowledge about the world Snow worked in and not as something his 1855 text claims.

_All of this now lives in [141](experiments/141-organising-snows-notes.md), which synthesizes
experiments 17, 119 and 133 and supersedes them — one record to act on rather than four
documents and seven hundred lines. Read it first. The consolidation paid for itself immediately:
133 had already recorded the playback-as-spine finding on 2026-10-24, and it was rediscovered on
2026-10-26 by someone who had been working on this project all day._

### Why notes, stated by the practitioner 2026-10-26

*"Notes are user documentation that provides the contextual scaffolding for the workflows. Like
in a Jupyter Notebook, the computations are not as useful by themselves. Only when they are woven
together by narrative will they begin to make sense and become a story."*

This is the premise the three levels below answer to, and it is not a request for metadata. A
notebook's markdown cells are not annotations ON the code; they are the medium the code is read
IN, and removing them leaves something that runs and does not mean anything. The claim is that a
workflow is in the same position: a canvas of correct computations that no reader can assemble
into a finding.

**It corrects an objection made the same day.** This file argued that a note widget "is not an
operation" -- it takes no ports and computes nothing -- and costed it against the widget budget
at 49 against a target of 41. A markdown cell is not an operation either, and no notebook treats
that as a defect. The budget exists to stop DUPLICATE AND CONFUSING COMPUTATION; narrative is
not competing in that space, so the widget count is the wrong instrument for it. If a note is
refused, it must be refused for a reason that applies to notes.

**What a notebook has for free and a canvas does not: reading order.** A notebook's narrative
order IS its execution order, so weaving needs no extra machinery. A workflow is a graph with no
single order, and that is the real obstacle to "woven together" here -- not the writing.

Except this project already computes an order. `src/reveal-playback.ts` plays a worked example
back **one widget at a time**, and says the order "is computed here and nowhere else" so the
measurement and the interface cannot disagree. That is the spine a story needs, built for a
different purpose (experiment 112). A story, on this reading, is the playback sequence with the
narrative attached to its steps -- which would also give [17](docs/experiments/17-workflow-publication-products.md)'s
story map its sentences between the layers, and answers [119](docs/experiments/119-can-this-tell-a-story.md)
in the affirmative with a mechanism rather than a hope.

Not a decision. It is the connection worth testing first, because it costs a view over existing
data rather than a new object in the model.

### The shape notes should take, specified by the practitioner 2026-10-26

Three levels, all **markdown so they can be formatted**, each answering a different question.

| Level | Role, in the practitioner's words | What it extends |
| --- | --- | --- |
| **Widget** | notes on a widget "so their outputs can carry the notes" | `map_output` already carries `mapTitle`, `mapSubtitle`, `mapSourceNote`; no other output carries anything |
| **Workflow** | "its own widget ... its role is to provide context for the workflow. If it's a workflow for a methods section of a publication, it describes the method in detail, and its limitations" | nothing. `Workflow` has `name` and no prose field |
| **Project** | "describes how the workflows are sequenced and stitched and rationale for selection and sequencing, also synthesized project findings" | `Project.subject`, which is one line |

The three are not one feature repeated at three scales. A widget note is **about a result** and
travels with it; a workflow note is **a methods section**, which is a claim about how something
was done and what it cannot show; a project note is **synthesis**, which is the only one that
can say what the whole investigation found. Only the second is proposed as a widget.

**Each note is mapped to a purpose.** The practitioner, 2026-10-26, completing the shape. A note
is not free prose with a location; it carries a declared purpose, which is what lets anything
check it. The candidates the project's own gaps name — not a settled vocabulary:

| Purpose | What it answers | Already wanted by |
| --- | --- | --- |
| **source** | where these numbers came from, and of what vintage | the 1851 census against 1854 deaths, which has nowhere to sit on the 2x2 |
| **method** | how this was done | a workflow standing in for a methods section |
| **limitation** | what this cannot show | *"describes the method in detail, and its limitations"* |
| **rationale** | why this step, and why here | project-level *"rationale for selection and sequencing"* |
| **context** | what a reader needs that the data does not say | the copepod note in [133](133-the-planning-stage-and-historical-notes.md) |
| **finding** | what it means | project-level *"synthesized project findings"* |

**A narrative purpose, which is a second axis.** The practitioner, 2026-10-26: *"notes can be
used to provide the meat for research publications so organized around Title, Abstract,
Introduction, etc. In fact epidemiologists have a structure for it."* Named the same day:
**IMRaD**, and *"it's in the FETP training materials"* — the Field Epidemiology Training
Programme, which is where the practitioners this application is for learn to write up an
investigation. That is the frame, not a journal reporting checklist: STROBE and its RECORD
extension exist and are a different instrument, aimed at manuscripts rather than at teaching the
structure of a report.

Choosing the one the audience was trained in matters more than choosing the stricter one. An
epidemiologist meeting a Methods heading in this application should meet the heading they were
taught, in the order they were taught it.

So a note has two coordinates, and they answer different questions:

| Axis | The question | Example |
| --- | --- | --- |
| **Functional** | what this note does for a reader of the workflow | `source`, `limitation`, `rationale` |
| **Narrative** | where it belongs in the write-up | Introduction, Methods, Results, Discussion |

A `limitation` note belongs in Discussion; a `source` note belongs in Methods under data
sources. The same note carries both and neither determines the other, which is the argument for
two fields rather than one merged vocabulary.

**What this makes possible, and the line not to cross.** With a narrative purpose a project can
report which parts of the structure carry a note and which do not — a completeness view, which
is a real practice. It must never report that a write-up IS an IMRaD report, or that it meets any
checklist. Whether a section is adequately written is a judgement by a person; this application
can see only that text exists under a heading. Claiming the former from the latter is the
overclaim this project names as D7, and it would be the worst instance of it yet, because a
reader would take it as a credential. Say "Discussion carries no note", never "report complete".

The headings must be taken from the FETP materials rather than recalled here.

**Why this is the load-bearing part.** A purpose makes a note CHECKABLE, and that is the
difference between documentation and scaffolding. A figure leaving the application with no
`source` note can be named; a workflow offered as a methods section with no `limitation` note is
incomplete in a way a gate can see; a `source` note is the one that must travel with an output.
None of that is possible over undifferentiated text. It is the same discipline the rest of this
project already uses — declared data over prose — and the unit field is the standing
counterexample of what happens without it.

**The risk, from the practitioner's own rule.** A closed vocabulary too narrow forces a writer to
file a note under a purpose it does not have, and *"if you design the text as non-editable, that
destroys the flexibility of the widget."* Whether the list is closed, closed-with-an-other, or
open and merely suggested is undecided, and the honest default is to watch which purposes get
used before fixing the set.

**What is NOT settled, and should not be inferred from the above.**

- **A note widget is not an operation.** Every other palette entry takes ports and computes
  something; this one would take nothing and compute nothing. It costs a palette entry and takes
  the budget from 49 to 50, against a target of 41 — which is the cost this project keeps
  paying and has twice refused to pay for lesser reasons. Whether context belongs on the canvas
  or in the Workflow tab beside the name is the first question, not a detail.
- **How far a widget note travels.** "So their outputs can carry the notes" settles that it
  reaches the figure. Whether it reaches a DOWNSTREAM widget is the provenance-as-output-port
  question raised on 2026-10-26, and the answer there was that a ruleset requiring provenance
  transmits it and the receiving widget must display it. A note is weaker than an obligation and
  should probably not inherit that machinery.
- **Markdown needs a runtime renderer, and there is none.** `scripts/widget-manual.mjs` converts
  markdown at BUILD time with a hand-rolled escape-then-regex pass and no dependency. A note is
  typed by a person, saved in a workflow, and **shared** — so it renders in someone else's
  browser from text this project did not write. Escape-first is the right order and already the
  precedent; one converter with two callers beats a second implementation.
- **What a note does to a run.** Receipts record acts rather than performing them, so editing a
  note is an act and not a recomputation. Whether a run records the note it was current with, and
  whether changing one marks results stale, is undecided — and getting it wrong makes a figure
  carry a methods section that was written after the method changed.

**Second subject, found 2026-10-26 reviewing the contingency margins with the practitioner:**
*"These are the details that need to get into the workflow notes — 3 years apart."* The
people-denominated 2x2 divides **1854 deaths by an 1851 census population**. South London was
growing fast, so the denominators are understated and every rate correspondingly overstated;
it biases all three supply groups the same way, which is why the ratio survives it better than
any single rate does. A reader cannot see this anywhere on the figure. `survived` is the same
kind of claim one layer further out — a residual, population minus cholera deaths, counting
everyone who did not die of cholera in seven weeks including those who died of something else.

Both belong to the investigation rather than to a widget, which is exactly the gap above. Note
what already exists and does not reach this figure: `rate` carries `numeratorPeriod` and
`denominatorVintage` as declared fields and **compares them** — South London's rate nodes
already say "the seven weeks ending 26 August 1854" against "the census of 1851" — but the
contingency workflow is `table_input → table_output` with no rate in it, so nothing carries the
mismatch. A note is the general answer; see also the nearer one below.

### What is actually blocked

Everything else in this file is waiting on one of these, or is a defect that nothing is waiting on.

**Both of the two blockers recorded here were wrong when re-derived on 2026-10-12**, which is
why they now live in `widgets/blockers.json` with a liftTest and a revisit clock rather than in
prose. The practitioner's rule: even blockers are not permanent, and each should be revisited in
DE mode.

1. ~~**No widget can put a raster value onto a point.**~~ **Lifted.** `sample_raster` 0.1.0 is
   registered, implemented and executable — points + raster → points — and has been since
   2026-10-12. This entry still read "Designed in
   [67](docs/experiments/67-sample-raster-at-points.md); not built" while `docs/todo.md` had
   already noted "now done" in the middle of a paragraph about something else, so the project
   held the stale claim and its refutation at the same time.
2. **There is no typed field schema beyond point attributes.** True, and **narrowed**: it was
   recorded as blocking the ruleset widget outright and it blocks only the *general* form of it,
   where any field of any input binds to a declared role. It does not block the merge that
   reduces the widget count, because the three fact generators take typed carriers rather than
   attribute tables — `makeN3(NearestRow[])`, `accessN3(AccessRow[])`, `facilityN3(Facility[])`.
   A blocker stated one size too large had been stopping work it did not block.
   `src/attribute-schema.ts` still covers `PointCollection` only; table, raster and network have
   nothing, and that is what remains true.

### Discussions as the governance surface, and two chart items the demo needs

Raised 2026-10-31. The first is recorded in
[155](experiments/155-discussions-as-the-governance-surface.md); the other two came from reading
the running application and are not yet experiments.

- **Discussions for a project — experiment 155.** The companion to 150: one made a clash legible
  and cannot make one rare. A fine-grained token with Discussions: Read and write now exists,
  held outside the repository. What has to be found out first is in 155: whether the WRITE path is
  GraphQL only, whether `api.github.com`'s GraphQL endpoint answers CORS the way the Contents API
  did, and whether a decision can be exported back into the repository — because a repository
  clones and a discussion does not. The open design question is whether Fieldwork should post at
  all, or only read and export.

- **A bar chart should be able to order its bars.** Largest to smallest, smallest to largest, or
  by category name, which is what it does today. **The node in South London is labelled "Deaths
  per 1,000 people, ranked" and the bars are alphabetical** — Battersea, Borough Road, Brixton,
  Camberwell — so the label already claims the capability that does not exist, which is the
  sharpest argument for adding it.

  ~~Noticed in the same figure: the printed values do not look proportional to the bars.~~
  **CHECKED 2026-10-31 AND THERE IS NO DEFECT.** Measured in the running application over all 32
  rows: Battersea prints 5.114 at 77.33% of the track, Brixton 0.616 at 9.32%, and every row
  agrees with its bar to the precision the number is printed at. Dulwich prints 0 at width 0%
  because Dulwich recorded no deaths, which is the documented behaviour — a row with no value is
  kept and drawn zero-length rather than dropped.
  **The screenshot was cropped mid-number**: "5.114" lost its decimals at the right edge and read
  as "5". Recorded rather than deleted, because a suspicion raised off a screenshot and then
  measured is worth more than one quietly withdrawn — and because the measuring took ten minutes
  against the hours a redesign of `barNumber` would have cost.

- **Snow's natural experiment is loaded and not shown.** The practitioner: *"how did John Snow
  demonstrate change in mortality from the Lambeth Company moving their water intake beyond the
  tidal limit. How are we visually demonstrating the difference?"* **We are not.** The workflow
  `Cholera in 1849 compared with 1854` is two nodes — a `table_input` of Table XII and a
  `table_output` — so the data carrying his strongest argument is loaded and printed as a grid.

  Lambeth moved its intake to Thames Ditton, above the tidal limit, in **1852**, between the two
  epidemics. So 1849 is before and 1854 is after, the sub-districts Lambeth supplied should fall
  while Southwark and Vauxhall's should not, and the company that did not move is the control. A
  before-and-after with a comparison group, in data this repository already holds.

  **The two chart items are one piece of work.** The figure that demonstrates it is a paired
  comparison per sub-district — two bars or a slope — coloured by supplying company and **ordered
  by the change, largest fall first**. The chart widget today draws one value per category in the
  order the keys arrive, so it can express neither half.

- **`group_table`'s missing-value note never reaches its receipt.** Found 2026-11-01 building 159:
  `withNote` attaches to the last receipt, and `group_table` calls it BEFORE pushing its own, so the
  guard returns and the note's facts are dropped. The note itself still shows. Another dropped layer.

- **After South London, try `study_design` on Hagelloch.** Raised 2026-11-01. The file holds cases
  only, so it reaches `case-series`, or within-case comparisons, and no attack rate. A cohort of the
  village's children needs a denominator the file does not carry. The source thesis was not read.

- **Stage 2 notes:** see [159](docs/experiments/159-the-study-design-is-the-workflows-checklist.md).
  Option sentences
  carry no links to their evidence: the sources are named in plain text. New nodes still default to
  cohort.

- **Offer cohort and case series together for one followed group.** Settled 2026-11-01, decision 1
  of [the review](docs/research/study-design-decision-tree-2026-11-01.md): cohort first, definition
  recorded. It waits for the guided questions, since no shipped surface asks D5. Decision 5 shipped
  in `two_by_two` 0.5.0, without its "asked, not settled" state, which also needs the questions.
  Worked examples with no design wired now show neutral names: wire one where the design is known.

- **The study design deserves a dialog, and the practitioner picks the computations.** Raised
  2026-10-31: *"for study design widget — a modal dialog should allow the user to select the study
  design and to unselect or select which computations to include downstream."* The same reasoning
  that gave the 2×2 its mapping dialog: a declaration that decides what every computation
  downstream may report is not a field in a column of fields.

  **It changes what step 3 of the sequence is.** Gating was recorded as the design deciding which
  measures a `two_by_two` may report. This makes the design PROPOSE and the practitioner DISPOSE:
  the dialog lists what the declared design licenses — for a cohort, risk ratio, odds ratio and
  risk difference; for case-control, the odds ratio alone — and the practitioner ticks what the
  write-up should carry. That is the difference between an application that refuses a measure and
  one that tells a practitioner which measures their design supports and lets them choose, which
  is 149's "report rather than grade" applied to the one place it would have been easiest to
  grade.

  It also answers the doubt experiment 147 recorded and [154](experiments/154-a-workflow-declares-how-as-well-as-where.md)
  carried forward — that a practitioner may not be sure which design they have. A dialog that
  shows the consequence of each design as it is selected lets somebody decide by reading what it
  would license, rather than by committing first and discovering later.

  **BUILT 2026-11-01**, with step 3: see [154](docs/experiments/154-a-workflow-declares-how-as-well-as-where.md).
  An unticked measure is a declaration and reaches the receipt as `fw:withheldEstimate`. Still
  open: ~~`rate_ratio` is not governed by the design~~ (retired 2026-11-05 into the two-by-two, whose rate layout
  is), `designFor`'s walk is not called by the run, and
  [a decision tree for choosing the design](docs/research/study-design-decision-tree-2026-11-01.md)
  is proposed and unbuilt.

- **Facets, and open literature to study them in — [158](docs/experiments/158-a-study-design-is-a-set-of-facets-and-the-literature-shows-it.md).**
  Raised 2026-11-01: *"The best thing we can do next for study design widget to be really useful is to a faceted search of literature (open access)."*
  Browser access to five open indexes is measured and works. The checked collection comes first, because an index
  holds a label and not a design, and the audits judged 34–97% of self-labelled case-control papers not to be.

- **MERGE: two tables that share a key cannot be brought into one.** Found 2026-10-31 by re-running
  the by-hand test that [157](experiments/157-summarize-is-the-command-group-table-is-part-of.md)
  was opened for. SUMMARIZE closed the gap it was built for and the chain now breaks one step
  earlier.

  `relate_table` brings a column of the right table's KEYS across — a category — and Table VIII's
  population is a VALUE. Checked in the running application: with Table VIII as the related table
  the Inspector's "bring" list is **empty**, because `sub_district` is the join key and `measure`
  already exists on the left. So Snow's deaths and his populations cannot meet in one table, and
  the rate a sensitivity bound is read from cannot be computed on the canvas at all.

  The obvious substitute is wrong and the reason is recorded in 157: Table VIII can produce a rate
  from its own deaths, but those cover seven weeks to 26 August against Table XII's 21 October,
  and using them understates the worst case threefold. **A rate must come from the same table as
  the count it is applied to.**

  an earlier engine of the practitioner's own has the operation: `COMMAND_SET.md` lists `RELATE` and `MERGE` as separate Data
  commands, MERGE as a "reviewed current-project upsert". What Fieldwork needs is narrower than a
  general upsert — two long tables with the same key columns, appended, so their measures sit in
  one `measure` column — and that narrowness should be designed deliberately rather than inherited.

- **THREE TABLE OPERATIONS ARE CLASSIC ANALYSIS COMMANDS WEARING DIFFERENT NAMES.** Found across one day:
  `derive_value` is DEFINE and ASSIGN, `group_table` is SUMMARIZE restricted to SUM, and
  `relate_table` is RELATE — which that file already knew, since its first line says so. At three
  this stops being a coincidence.

  The finding is not that the names are wrong. It is that this application arrived independently
  at a classic analysis package's Data and Statistics command set and named it **inconsistently**: one widget
  carries the command name in its documentation, one had the wrong command in its documentation
  until it was checked, and one has no mention of it anywhere. A practitioner who knows a classic analysis package
  has to rediscover each one.

  **Measured in [the classic analysis commands audit](audits/epidemiology-commands-and-our-widgets.md),
  2026-10-31**, which also corrects what this entry first claimed a rename would cost:
  `RENAMED_NODE_TYPES` already maps six old node types to new ones, and `validate:widgets` refuses
  a registry declaring a rename the application does not perform — so a saved workflow migrates
  on open. Six of the table widgets are South-London-only and could be renamed in one pass;
  `case_series` and `table_input` could not, being used by other examples. The cheap half remains
  the manual and the Inspector saying which command a widget is, which costs nothing and is most
  of the value.

  **And it predicts where the gaps are**, which is the useful part: MERGE was found by needing it,
  but the command set names the rest. Worth a deliberate pass against `COMMAND_SET.md` rather than
  discovering them one failed workflow at a time.

- **STATCALC is organised by study design, and it reaches a phase Fieldwork does not have.**
  Raised 2026-10-31: that a STATCALC command could be useful for study design
  Read from its README rather than from memory, the discipline SUMMARIZE established
  the same day. Four slices exist there:

  | slice | what it takes and gives |
  | --- | --- |
  | Population Survey | five inputs, a seven-level cluster/total sample table |
  | **Cohort or Cross-Sectional** | linked effect measures, Kelsey/Fleiss sample-size output |
  | **Unmatched Case-Control** | linked exposure measures, cases/controls sample-size output |
  | Chi Square for Trend | editable exposure-score/case/control table, row odds ratios, Extended Mantel-Haenszel |

  **THREE OF THE FOUR ARE NAMED BY STUDY DESIGN**, in the same vocabulary
  [154](experiments/154-a-workflow-declares-how-as-well-as-where.md) made declarable. That is the
  connection: a workflow that has declared itself a cohort does not need to be asked again which
  calculator applies — the declaration selects it. Nothing else in this application has had a use
  for the design beyond gating what a two-by-two may report.

  **AND IT IS THE PHASE THIS APPLICATION DOES NOT REACH.** Every widget here consumes data that
  exists. A sample-size calculation happens BEFORE there is any, which is the "designing an
  investigation" end of the arc the practitioner described — *"from designing an investigation,
  implementing its workflows and managing evidence generation, and publication"* — and the only
  end Fieldwork has nothing for. A calculator takes typed inputs and no port, which is the shape
  `study_design` already is: a declaration node rather than an operation.

  Three things to settle before any of it is built.

  **The 2×2 overlap is a D2 question, not a detail.** an earlier engine of the practitioner's own also has a StatCalc 2×2, and
  this application has `two_by_two`. They differ in where the numbers come from — typed counts
  against a table that arrived on a port — and that difference is either a second widget or a
  second input mode on the first. Getting it wrong is how a registry ends up with three
  implementations of one operation, which is what experiment 64 is for.

  **A sample size is an assumption, not a measurement.** Kelsey and Fleiss need an expected
  exposure prevalence, a detectable effect, a power and a confidence level, and every one is
  something somebody chose. Whatever is built has to carry those choices into the receipt and the
  write-up the way the design declaration already does, or it will print an authoritative-looking
  number whose inputs nobody can see.

  **No parity is claimed by sharing a name.** `conventionalLabelSource` already separates what a rendering prints from what the original program prints, and neither has been checked here.

  Unverified: only the README's descriptions were read, not the implementations. Which formulas
  the Kelsey/Fleiss slice actually uses, and what the Chi Square for Trend slice computes, are
  open.

- **A chart or a map that lies is not a failing test — experiment 156, after the two items
  above.** Raised 2026-10-31: *"I think we need some form of automated chart and map
  validation."* The evidence is the day it was raised. Every defect in the chart thread was found
  by LOOKING — a node labelled "ranked" over alphabetical bars, printed values that do not look
  proportional to the bar lengths, a category with neither a bar nor a number — and the suite saw
  none of them, through 1,272 unit tests and 740 browser tests. What is testable today is THAT a
  chart rendered, not that it says what it claims.

  The same shape as the dropped-layer family this codebase keeps meeting: `fw:layerDrawn` exists
  because composing correctly and drawing correctly are different claims, and the seventh instance
  of that family landed the same day.

  What a check could assert without becoming a screenshot differ, all readable off the SVG the
  application already produces: a bar's length is proportional to the value printed beside it; a
  stated order matches the drawn order; every category with a value has a bar and every bar has a
  value; a map's drawn layers are the layers it composed; a legend entry exists for every class
  drawn and no others.

  **Deliberately sequenced after the ordering option and the 1849/1854 figure**, because those two
  produce the first figures worth validating — a paired comparison ordered by change is exactly
  the case where a silent mis-ordering would be invisible and consequential. Writing the validator
  first would mean writing it against figures that do not exist yet.

  **BUILT FOR CHARTS 2026-10-31, and the sequencing paid off immediately: the 1849/1854 figure
  produced the defect before the validator was written.** That figure asked for `smallest` and
  drew largest-first, because `orderBins` was called in `chartMarkup` and the Vega renderer --
  the one behind the Results tab and the exported SVG -- never called it. Published in that
  state, with nothing red. `src/figure-check.ts` now checks coverage, order and bar length off
  the drawn figure, and `a-drawn-figure-matches-its-claim.browser.mjs` runs it on the real
  renderer in all three orders. Shown to work by reverting the fix and watching it fail by name
  -- and ONLY ONE of the three orders failed, because `largest` matched the arrival order by
  luck and `category` matched Vega's own alphabetical default. A single-order check would have
  passed and seen nothing. Written up as [156](docs/experiments/156-does-the-picture-say-what-the-figure-claims.md).

  **MAPS ARE NOT BUILT and are the harder half.** A bar has one length; a choropleth has a class,
  a colour, a boundary, a projection and a legend, and "the drawn layers are the layers it
  composed" wants `fw:layerDrawn` read back rather than measured off an SVG. Also unbuilt: any
  figure that is not a vertical bar chart, and running the check over the worked examples rather
  than over fixtures, so that a figure which is PUBLISHED is a figure that was read.

### Known defects, not blocking

Recorded because they are real, ordered by nothing in particular. Each says what it waits on.
A defect is not a blocker unless something is waiting on it — filing them as "correctness,
highest first" overstated every one of them, and led to patching two things that need
rebuilding (lesson 13 in [62](docs/experiments/62-workflow-traversal.md)).

**Regression reports a separated term as an ordinary odds ratio.** Found by validation lab check 33, 2026-11-05: in
Salmonella against the panel controls, the 80+ age group has no finite estimate (standard errors 29,232 in Fieldwork and
1,596,022 in statsmodels, each stopping somewhere along the same ridge), and the result table shows an odds ratio of
1.27e8 (0.016 to 2.8e10) with nothing to say why. It should say the term is separated, which category has no cases or
no controls, and report no number for it. Waits on nothing; the exposure's estimate is unaffected.

~~**Rate ratio belongs in the Two-by-two widget, not a widget of its own.**~~ **DONE 2026-11-05, in 0.25.0.** The
practitioner: *"It should be in the Epi kernel 2x2 widget I think that's what we decided"*. Two-by-two 0.7.0 reads
events and units at risk; `rate_ratio` is retired; South London's 8.40 is unchanged to the bit and lab check 27 agrees
from the new path. Left open: no rate difference, and the study design dialog's tick list does not offer the rate
ratio ([161](docs/experiments/161-the-epi-kernel-one-table-many-exposures.md), step 6).

- ~~**A caught fetch still raises a page error offline, and nothing explains how.**~~ **FIXED
  2026-10-31, and the explanation was in the service worker rather than the page.** A rejected
  promise handed to `FetchEvent.respondWith` is an error the WORKER raises, and WebKit surfaces it
  on the controlled page -- so the page's own `.catch()` was never going to help, because the page
  was not the thing erroring. Offline, anything not precached missed the cache and `sw.ts:41`
  passed `fetch`'s rejection straight to `respondWith`.

  `build/asset-manifest.json` found it only because it is deliberately NOT precached -- it reports
  the build on disk rather than the one the worker serves -- so it was the request guaranteed to
  miss. The defect was never about that file: **every uncached request offline raised this**, and
  the twelve failing tests were simply the twelve that go offline.

  Two wrong fixes on the way, both recorded in `src/sw.ts`: making the page's fetch lazy would have
  hidden it without explaining it, and `Response.error()` traded two page errors for one, because
  WebKit raises on a network-error response from a worker just as it does on a rejection. The
  answer is a 504 -- offline with nothing cached IS a gateway failure, and it says so in the one
  vocabulary every caller already branches on.

  **The sibling branch of the same handler already knew.** Its comment records the same symptom,
  "three 'Load failed' page errors in CI WebKit", and the repair went to one of the two branches
  that needed it.
- **`slr_threshold_comparison` compares a projected change to an elevation on an unchecked
  datum.** Valid only when the elevation is referenced to the projection's baseline sea
  surface; the field is free text checked for non-emptiness, and the unit fixtures satisfy
  the condition implicitly so the suite cannot see a mismatch.
  [62](docs/experiments/62-workflow-traversal.md) ·
  [58](docs/experiments/58-sea-level-widgets.md)
- **Postponed, deliberately: all sea-level pack work.** The exercise's major gap is that no
  widget can put a raster value onto a point, so the worked example cannot be completed with
  real facility elevations however good the extraction script is. The script's *interface* is
  also wrong, not only its internals — it is shaped around the 38 GB sample store rather than
  the summary files, and takes one `--site` where it should resolve a site set from a study area
  against the Philippine index the pack already ships
  ([62](docs/experiments/62-workflow-traversal.md)). Patching it in place would cost a pack
  version bump and a catalog re-pin to ship a patched version of something due for rebuild, which
  is lesson 13. **Build the sampling primitive first** — now done.

  **Measured from the real data, 2026-10-09.** The first AR6 file this project has ever read:
  `total_ssp245_medium_confidence_values.nc`, pulled from the Zenodo archive by range request
  without downloading the 9.24 GB zip.

  | Fact | Value |
  | --- | --- |
  | `sea_level_change` units | **`mm`** — so `value_m`, the provenance's `unit: metre` and the host's throw-unless-metre are wrong by 1000× |
  | Dimensions | `(quantiles: 107, years: 14, locations: 66190)`; years 2020–2150 by decade; the 66,190 locations match what 47 records |
  | Quantiles 0.17 / 0.5 / 0.83 | Present as **exact** float64 matches, so selecting on them directly is sound |
  | Manila, location 145 | Present at 14.58 N, 120.97 E, matching the bundled site index |
  | Manila ssp245 2100 | 963 / **1124** / 1366 mm at q0.17 / q0.5 / q0.83 — a median change of 1.124 m |
  | Baseline period | **No global attribute carries it.** The script's warn-and-refuse-to-assume fallback is correct and is vindicated |
  | `source` attribute | `pboxes/pb_1f/ssp245/total-workflow.nc` and `pb_1e` — the medium-confidence file is a **p-box across workflows 1e and 1f**, not a single-workflow output |

  **A real extract now exists.** `validation-lab/content/results/ar6-philippines-gauges-extract.csv`
  — 288 rows, 0 missing, keyed `site_id, scenario, confidence, family, year, quantile, value_mm`
  over the 8 published Philippine tide gauges, three scenarios, 2050 and 2100, the median and the
  likely range, both dataset families. Produced by `validation-lab/scripts/extract_ar6_philippines.py`
  from 447 MB of archive members fetched by HTTP range rather than 18 GB of zips.

  **The two dataset families differ by up to 87%, and in both directions.** ssp245, 2100, median,
  in millimetres:

  | Gauge | with VLM | without | difference | ratio |
  | --- | --- | --- | --- | --- |
  | **MANILA** | **1124** | **602** | **+522** | **1.87** |
  | SAN_JOSE | 857 | 604 | +253 | 1.42 |
  | LEGASPI | 778 | 612 | +166 | 1.27 |
  | DAVAO | 605 | 598 | +7 | 1.01 |
  | TACLOBAN | 603 | 614 | −11 | 0.98 |
  | CEBU | 578 | 608 | −30 | 0.95 |
  | SURIGAO | 586 | 614 | −28 | 0.95 |
  | JOLO | 542 | 600 | −58 | 0.90 |

  Without vertical land motion every gauge clusters at 598–614 mm, because the ocean and ice
  contribution is near-uniform across the archipelago: **all of the spatial variation is land
  motion.** Manila is subsiding hard enough to double its projection, while Jolo's land is rising
  enough to reduce it. A practitioner who did not know which family they held would be wrong by
  half a metre in Manila and wrong in the *opposite direction* in Jolo.

  **The land-motion term is linear in time, measured from the data.** The ratio of the
  with-minus-without difference at 2100 to the same at 2050 is 2.10–2.11 at every gauge carrying
  a meaningful signal, against 2.11 for a term strictly linear from the baseline midpoint of
  2005; the implied rate is constant to two decimals (Manila 5.51 mm/yr at 2050, 5.49 at 2100).
  Gauges whose difference is only 4–11 mm scatter, which is integer-millimetre rounding at that
  magnitude.

  That matters for how the example must describe the number. A linear term **extrapolates an
  observed trend** and represents no future change in groundwater policy, so it can show neither
  a crackdown on extraction nor an acceleration. And Manila's implied 5.5 mm/yr is roughly
  **half** the ≈10.1 mm/yr subsidence measured at the Port of Manila from tide-gauge and
  satellite records, with Bulacan extraction hotspots reaching 109–124 mm/yr. The with-VLM
  figure is therefore likely to **understate** Manila's subsidence rather than overstate it —
  the opposite of what a reader might assume about the "higher" family.

  [Experiment 47](docs/experiments/47-sea-level-pack.md) predicted exactly this — "where land is
  subsiding appreciably, the two answers can differ enough that a reader who did not know which
  they were looking at would reach a different conclusion" — before anyone had opened a file. It
  is now measured.

  The known defects, now including one only the real data could reveal:

  - **The `workflow` label is wrong for these files.** The script defaults `--workflow wf_1e`
    and records it as the workflow. The medium-confidence file is a p-box combining `pb_1e` and
    `pb_1f`, so labelling it `wf_1e` asserts a single workflow the data is not — and the pack's
    own vocabulary says *a quantile is not a p-box bound*. The extract must carry the p-box
    identity, not a workflow id, or carry a workflow id only for files that have one.
  - **The unit must be read, not assumed.** `units: 'mm'` is in the file. Read it, and either
    convert explicitly with the conversion recorded in provenance, or refuse when it is not the
    expected unit. Do not keep a column named `value_m` fed by millimetres. `scripts/extract-projection.py` in the
  pack repository loops over scenarios but never selects on scenario, so one file yields
  identical values under three scenario labels; `workflow` and `family` are likewise
  unverified CLI labels; the output column is `value_m` and the provenance asserts
  `unit: metre` while AR6 publishes millimetres and nothing reads the file's `units`
  attribute; and the input is hashed with a whole-file read despite the stated 38 GB
  source sizes.
- **`check-pack.py` fails before any check runs.** Retiring `contents.widgets` to
  `retiredWidgets` left the validator reading a key that no longer exists, so pack CI is
  red. The validator is part of the contract.
- The three sea-level widget release files still say `implementationStatus: blocked` /
  `proposed`, `definition: "not implemented"` and "No implementation exists", with no
  retirement marker pointing at the host widgets that now implement them.

### Primitives and ports

- **A street network from a CSV edge list** (raised 2026-10-14, not an experiment yet —
  investigate first). `network_input` takes OSM or a GeoJSON-shaped file today. A network is
  also, commonly, two CSV columns: `node1` and `node2` (or `connects_to_node`), one row per
  edge. That is how a network arrives from a field survey, a spreadsheet of paths between
  settlements, or any system that never held geometry. Questions to settle before designing it:
  where do node *coordinates* come from (a second CSV of node id, lon, lat? a join to a point
  layer already in the workflow?); where does `lengthM` come from when the CSV carries no
  geometry — computed straight-line between node coordinates, which makes every edge a lower
  bound, or taken from a column the surveyor measured; and whether an undirected edge list
  means one row or two, since `prepareEdges` works on directed edges. Reuses the CSV import
  this project already has. It would let a network be *authored*, not only downloaded, which
  matters where OSM is thin — the same places experiment 114's off-network leg is about.

- **Settle [66](docs/experiments/66-ports-as-schema-binding.md) before any port work.** A
  connection is a schema binding: eight of fifteen port types are private wires between two
  named widgets, tracing the Old Naledi and heat pipelines, and `mean-center` has no consumer
  at all. Fifteen types resolve into roughly four carrier kinds plus declared contracts. This
  supersedes the port advice in [62](docs/experiments/62-workflow-traversal.md) and Phase 4 of
  [64](docs/experiments/64-widget-streamlining.md), and shares one mechanism with
  [61](docs/experiments/61-input-dimensions.md) and
  [65](docs/experiments/65-ruleset-as-data.md).

- **A ruleset widget, with the ruleset as declared data.** Designed in
  [65](docs/experiments/65-ruleset-as-data.md): replaces `policy`, `xpert` and
  `access_policy`, puts the configuration knobs on the ruleset rather than the widget so
  each declares its own parameters with units, and retires `gradedFacilities` — one of the
  six producer-named port types — onto the general `decisions` stud.

- **A primitive that samples a raster at a point.** Nothing in the application can put a
  raster value onto a point, so the elevation attribute `slr_threshold_comparison` requires
  cannot be produced here at all. Generic: serves population density, rainfall, temperature
  at a location. [62](docs/experiments/62-workflow-traversal.md)
- **Move the vertical reference from the comparison node to the input.** The enforcement is
  done — `slr_threshold_comparison` now refuses an undeclared or non-baseline reference instead
  of silently comparing incommensurable numbers, with three tests — but the declaration sits on
  the comparison node as a parameter, and this item and
  [62](docs/experiments/62-workflow-traversal.md) both say it belongs **on the input**, so the
  elevation-bearing layer declares its reference once and every consumer reads it. The
  behaviour is durable; the location is interim and moves with the typed field schema.
- **A vertical reference as an enumerated declaration on the input**, following
  [61](docs/experiments/61-input-dimensions.md)'s pattern, with the comparison refusing when
  the elevation's reference and the projection's baseline cannot be related.
- **Narrow the port types for the four wrong-producer run-time checks** — `assignments`,
  `series`, `projection-extract` — so a plain table cannot be connected where a specific
  producer is required. Makes those checks unreachable. The other eight `Connect …` checks
  are presence, arity or graph-shape conditions and belong in `validateWorkflow`, not in
  port types. [62](docs/experiments/62-workflow-traversal.md)
- **A keyed join as an internal primitive**, replacing three separate implementations of
  nearest-neighbour-with-distance and underpinning the six composites that currently carry
  their own copy. Internal only: not a palette entry.
  [60](docs/experiments/60-from-gis-studio-to-public-health-studio.md)
- Move the example-specific nodes off the palette into templates. Reduces what a
  practitioner must scan and stops `xpert`, `facilities` and `alert` reading as general
  tools.

### Primitives derived bottom-up from NB06 / Old Naledi

Traced from the actual 12-node workflow on 2026-10-09, asking of each node what the general
operation inside it is. The workflow uses three primitives that exist — point import, study
area, the three outputs — and four example-welded nodes that contain **six general operations
between them**. That is the thick-domain-layer test from
[59](docs/experiments/59-pattern-for-engineered-knowledge.md) with a number attached.

| Needed by the workflow | Currently welded inside | Exists? |
| --- | --- | --- |
| **Select features by spatial relation to a polygon**, returning a filtered layer | `facilities` | **No.** `coverage_check` does point-in-polygon but returns a check, not a layer |
| **Representative point of an area** (a geometric centroid) | `facilities` | **No.** `mean_center` is the statistical mean centre of a point set, with its own refusal — a different operation |
| **Buffer a point by a radius** to form a selection region | `facilities` | Partly: `buffer_area` is area → area only |
| **Filter records by an attribute predicate** | `access` ("meeting your evidence criteria") | **No** |
| **Nearest join with distance** | `access`, and separately `nearest` and `slr_site_assignment` | **No** — already identified in [60](docs/experiments/60-from-gis-studio-to-public-health-studio.md) |
| **Rule application with a declared ruleset** | `xpert`, `access_policy`, `policy` | **No** — designed in [65](docs/experiments/65-ruleset-as-data.md) |

Two observations worth keeping. This workflow touches no table, raster or network — it is pure
vector — so every gap it reveals is **basic vector GIS**: select by location, select by
attribute, centroid, buffer, nearest. That is the core of any GIS toolbox, and it is absent
because each example that needed it received a welded widget instead. And `samples` is framed
as generating "demonstration points", which undersells it: sampling locations within a boundary
is a general operation and should be named and documented as one.

Four of the six are new findings from this derivation; the join and the ruleset were already
known. Doing the derivation on a second example — the heat workflow, or John Snow — would show
whether the same four recur, which is the test of whether they are general or particular to
this one.

### The study area is Botswana-shaped

Found 2026-10-09 by adding the healthsites node to a blank canvas and trying to scope it to the
Philippines. The node correctly demanded a study area; supplying one was the problem.

- **Fixed.** Every Study area node described itself as "Old Naledi · Gaborone" regardless of its
  parameters, because `describe()` hardcoded that string for the type. A newly added node is
  `source:'drawn'` with no geometry, so the label was simply untrue. It now reports what the node
  holds: a drawn box or polygon, the dataset name, or "No boundary selected yet".
- **No point-and-radius option.** `AreaParams` admits a drawn bbox or polygon, or a named dataset
  — nothing else. `buffer_point` exists but takes a `points` input, so on a blank canvas a scope
  around a place needs a point layer imported first, which is a lot of work for "five kilometres
  around here". Either the Study area node gains a point-and-radius mode, or `buffer_point` gains
  a way to name a coordinate without a layer. The second keeps one scope-making operation; the
  first puts it where a practitioner looks.
- **No way to get to a place.** The map is interactive but has no search or navigation, so
  drawing a study area in Manila means panning from Gaborone. A geocoder is a remote service and
  [39](docs/experiments/39-stac-discovery-and-remote-acquisition.md) measured what that costs in a
  browser; the cheap alternatives are typed coordinates, a bounded gazetteer of the places the
  worked examples use, or accepting a bounding box as text.
- **The examples are the default world.** The blank canvas starts empty but every affordance
  around it assumes Gaborone. This is the same finding as the widget audit's example nodes, in the
  map rather than the palette: one demonstration's content presenting itself as the general case.

### Three widgets built 2026-10-09, none in a worked example

`npm run usage:widgets` after adding the Manila example:

```
never instantiated by any example (7):
  buffer_point, centers, find_health_facilities, places, rate, reproject, sample_raster
```

The first, third and seventh were built that day. D1 passed for each — experiments
67 and 68 argued the admission before the code, as the rule requires. D10 fails
for all three.

**D10 does not measure whether a widget was necessary, and it was read as if it
did.** The audit says what it measures: a widget no example instantiates "has
never been *shown composing* with the rest". It is a question about demonstration
to a newcomer. The practitioner used `buffer_point` and
`find_health_facilities` from a blank canvas on the day they were built — real
use, invisible to a check that only reads the shipped examples and frozen
fixtures. Reporting "zero instantiated" as "were they necessary" was an
over-claim from a tool that answers a narrower question.

The reasons the three are absent from examples still differ, and are worth
keeping.

- **`sample_raster`** has no consumer anywhere. It was called "real blocker #1"
  for reading elevation at facilities, and elevation is increment 2 of the
  sea-level example, which is not built. It should be demonstrated there or not
  kept.
- **`buffer_point`** derives a study area from a named point in a layer. The
  study-area editor gained a hand-drawn circle tool the same day. The two are not
  duplicates — one is derived from data and reproducible, the other is drawn, and
  the project already distinguishes drawn from derived areas — but the derived
  one has never been used, so the distinction is asserted rather than shown.
  Increment 2 would use it: a study area from the Manila gauge rather than a
  hand-drawn box.
- **`find_health_facilities`** was listed here too, with the claim that a
  retrieval widget *cannot* be demonstrated by a bundled example because such an
  example must run offline. **That was wrong and is fixed.** A bundled example can
  hold a network-dependent widget carrying what it retrieved, which is exactly the
  state a workflow is in after one online retrieval. What it cannot do is reach
  the network when it runs. The Manila example now holds the widget with 194
  facilities and its own retrieval record, fetched through the widget's retrieval
  path so the provenance is real, and `npm run usage:widgets` no longer lists it.

  The mistake was reaching for an absolute instead of looking at the online-to-
  offline model already implemented and already covered by a passing test named
  "a stored retrieval replays with the network off, and asks no source for
  anything".

Also fixed: `scripts/widget-coverage.mjs` did not know about the Manila example,
so D10's mechanised check was under-reporting. A check that silently misses an
example is worse than no check for the widgets inside it.

### Reprojection goes one way only, because a layer cannot say where it is

Raised 2026-10-10 from the Inspector: reprojection is useful in more than one
direction and to more than one projection. The widget does WGS84 UTM to CRS84, at
import, and nothing else.

The obstacle is the carrier. `SpatialReference` is a type whose every field is a
fixed literal — datum `WGS84`, geometry CRS `OGC:CRS84`, units `degree` — so a
layer cannot state that it is in anything else. Reprojection can only happen on
the way in, or temporarily inside a widget.

The cost is countable: **five widgets each ask the practitioner for a UTM zone**
(`mean_center`, `compare_point_sets`, `reproject`, `voronoi`, `isochrone`), and
`catchments.ts` carries its own `metric()` helper. The same question is asked
five times because the data cannot answer it. That is D5 firing for the first
time — a qualifier living in every consumer instead of on the input.

Three steps, in order, and the first is a carrier change:

1. A spatial reference that can describe a projected CRS. Belongs with the port
   work in [66](docs/experiments/66-ports-as-schema-binding.md).
2. Reprojection as a Compute widget: a layer in, a layer out, a stated target.
   The present node sits in Sources because it reads a file, conflating input
   with process.
3. Metric widgets reading the CRS of the layer they are given, and refusing one
   in degrees rather than assuming a zone.

Two limits stay whatever is built. A datum shift needs a grid this prototype does
not carry, and a clean conversion does not confirm the declared zone was right —
both already stated in the widget and worth keeping stated.

Full reasoning in [40](docs/experiments/40-reprojection-primitives.md).

### "Junction" counts every point in the graph, not every intersection

`networkFromOSM` adds both endpoints of every consecutive pair in every accepted way, so a network
node is each VERTEX a street is drawn with. The application calls these junctions throughout.

Measured 2026-10-19 on Buvuma Island, Lake Victoria: **11,359 network nodes against 661 places
where two streets actually meet — seventeen to one.** The practitioner met it as a download
refused by a "Graph limit (junctions)" of 2,000, believing that allowed a 2,000-junction network;
on that terrain it allows about 116 intersections. The 2,000 default was measured on Soho, where a
dense grid makes the two counts nearly equal, which is why nobody noticed and why the word is most
misleading exactly where the default binds.

**Not renamed, deliberately.** A first attempt changed the eleven places that COUNT network nodes
and left the term everywhere else, which gave one quantity two nouns. The word is load-bearing in
more than prose:

- **Ontology predicates** — `fw:junctionsInBand`, `fw:junctionsOffered`, asserted in receipts
  and checked by `validate:ontology-coupling`.
- **A widget title** — `reachable_nodes` is "Reachable junctions", so a rename needs a name
  review entry and a release, and its refusals quote it ("Add a Reachable junctions step").
- **A results field** — `coverage.junctions`, which the map caption and its tests read.
- Roughly sixty test assertions.

**Defining it is not available.** The practitioner, 2026-10-19: *"junction versus intersection,
that's a large discrepancy for two terms that mean nearly the same."* That is the whole problem.
`carrier` was an INVENTED term with no standard behind it, so withdrawing it was clean — nobody
had a prior meaning to unlearn. "Junction" is an ordinary English word for where roads meet, used
here to mean something seventeen times larger. A reader has no way to notice the redefinition,
because the ordinary meaning reasserts itself every time. A glossary entry would be read once and
overridden by the language thereafter.

So the resolution is to align the prose to the identifiers rather than the reverse, and the code
has already chosen: `Network.nodes`, `NETWORK_NODE_LIMIT`, and the node type `reachable_nodes`.
Only the human-facing text says junction. **That is this morning's `summarize_polygons` problem
inverted** — there the title was right and the identifier wrong; here the identifiers are right
and the titles wrong.

So this is a vocabulary decision of the same kind as `carrier`, not a find-and-replace: withdraw
the term with a ledger entry and a ceiling. What shipped on 2026-10-19 is
the Inspector saying what the number counts, with the Buvuma measurement, so the limit can be set
knowingly in the meantime.

**Also unmeasured:** whether 2,000 is the right default. It was measured against vertices; nobody
has asked what it should be as a limit on the thing that exhausted a 4 GB heap.

### Demonstrate Fieldwork importing from DHIS2

Requested by the practitioner, 2026-10-19: *"Spin up a DHIS2 instance with data and demonstrate
FW connecting to DHIS2 and importing data into a workflow."*

Three pieces, and the order matters because the second is the one that can fail on grounds nothing
in this repository controls:

1. **An instance with data.** DHIS2 publishes a demo database and a containerised stack, so this is
   a setup task rather than a research one. It has to hold organisation units with coordinates and
   at least one aggregate or event dataset, or there is nothing a spatial workflow can do with it.
2. **Reaching it from a browser.** Fieldwork runs entirely in the page and acquires over `fetch`,
   so a DHIS2 import depends on that instance sending CORS headers and on an authentication method
   a browser can use without storing a password in a workflow — the Web API supports personal
   access tokens, which is the shape that fits how credentials are already handled here. This is
   the same wall the geoBoundaries acquisition hit, and the resolution there was to rewrite the URL
   rather than proxy, **because a proxy would put this project between a practitioner and their
   source.** A DHIS2 server holding real programme data makes that principle sharper, not softer.
3. **An import that records where it came from.** `## Input — getting the data` in the glossary is
   explicit that **an import is not an acquisition**: an acquisition replays from its request, an
   import can only be trusted if it records where it came from. So a DHIS2 import needs the server,
   the API version, the org-unit level, the dataset and period, and the time of retrieval — not
   just the rows.

**What it would establish, and what it would not.** It would establish that Fieldwork can take
data from the system most national health programmes actually keep theirs in, which is a claim
about reach that no worked example currently supports: every example ships its data in the repository.
It would not establish anything about *analysis* — the widgets downstream are unchanged — and a demo
instance is not evidence that a ministry's production instance will permit a browser to read it,
which is the question that decides whether this is useful or a demonstration. Worth recording as a
separate field question when it gets that far.

**Not started.** No experiment record yet; this is the note that precedes one.

**Asked again 2026-11-15** (*"Since we have Docker on this machine can we demonstrate FW connecting to DHIS2 and
retrieving surveillance data from it?"*); the downloads were offered and the practitioner chose *"Not now"*. What was
found, by metadata only: Docker 28.3.2 runs here; `dhis2/core:2.43.2` is about 468 MB compressed (Docker Hub, updated
2026-10-28), `postgis/postgis:16-3.4-alpine` about 162 MB, and DHIS2's Sierra Leone demo database for 2.43,
`databases.dhis2.org/sierra-leone/2.43/dhis2-db-sierra-leone.sql.gz`, 90,059,621 bytes. The demo database is Sierra
Leone's, fictional, the same country as the measles example, so its organisation units could sit beside GRID3's. DHIS2
needs 2 to 4 GB of memory while running: stop it during gates. Still to establish first: CORS and a personal access
token from a browser.

### Stress-test the remaining caps, and find the examples that do it

[125](docs/experiments/125-caps-below-the-limit-we-are-testing.md) separated the caps that are
measurements from the caps that are guesses. Two of the guesses were corrected on 2026-10-20 — the
street-network graph limit, which measured isochrone memory and was applied to downloads, and the
download byte floor, which refused an extent this project ships. The rest are listed here with what
would actually stress them, because the practitioner's reason for wanting them loosened is the
project's reason for existing: *"we are here to develop a framework that tests the limits of the
browser — how are we going to make progress if we don't reach the limits?"*

A cap raised without a measurement trades a clean refusal for a hung tab, which is the one failure
worse than a refusal. So each of these wants a real artifact that reaches it, not a bigger number.

| cap | now | what would reach it |
|---|---|---|
| `MAX_TABLE_ROWS` | 2,000 | A real surveillance line list. Hagelloch is 188 rows; a national weekly series or a Project Tycho extract is tens of thousands. The table view, the data-quality profile and `case_series` all walk it. |
| `MAX_RASTER_CELLS` | 262,144 (512×512) | A WorldPop 100 m population raster for a district. The Old Naledi raster example already carries one; a province-sized window is the stress. |
| `GEOMETRY_BYTE_BUDGET` / `AREA_BYTE_BUDGET` | 1 MiB / 1.5 MiB | **Philippines ADM2.** An archipelago is the worst case for vertex count, it is this project's own domain, and DRC ADM2 at 6,386,010 bytes already shows a single level can exceed the whole store. Measured against `localStorage` when IndexedDB reports 200–2,000× more ([121](docs/experiments/121-storage-beyond-localstorage.md)). |
| workflow size | 50 nodes, 100 edges | An inline literal in `validateWorkflow` with no constant and no comment. A bundled composition explodes into its members, so exploding two or three in one canvas reaches it; the rulesets example is already four workflows on one canvas. |
| `MAX_POINT_LAYERS` / `MAX_POLYGON_LAYERS` | 8 / 6 | A map carrying every layer a cholera workflow produces — deaths, pumps, catchments, hull, network, reachable nodes, corridor. |
| `MAX_FACILITY_RECORDS` | 20,000 | Measured on Metro Manila. A country-level `find_health_facilities` query is the stress, and is also the courtesy question: whether this application should ever ask for one. |
| `OSM_PAUSE_MS` | 60,000 | Superseded rather than stressed: `/api/status` now reports the pause the service wants, so the fixed floor should become the fallback for when that read fails, which is what OSMnx uses it for. |

**What closing this looks like.** For each row, an artifact in `examples/` or a recorded acquisition,
the measurement of where the browser actually fails, and then a number — or a declaration in the
code that the number is a guess, which is honest and revisitable where an unexplained constant is
neither.

**Not started.** The two corrected on 2026-10-20 are the pattern: both turned out to be a downstream
widget's constraint applied upstream, which is worth checking for in each of these before assuming
the number itself is the problem.

### Version drift is not hypothetical. It already happens, silently

Not designed for. Forced instead, and measured, on 2026-10-10 —
`tests/composition-drift.test.mjs` with a fixture holding a widget removed the day
before.

**Fieldwork already floats.** A saved workflow names widget *types*, never
versions: every node is `id, params, type, x, y`, and all 76 release files declare
`versionPersistence: "not-yet-persisted"`. There is no field in which a version
could be recorded, so nothing can be compared and nothing can go stale. A workflow
opened after a widget changes gets the new widget, whatever it now does.

What a workflow saved on 2026-10-08 does today, when the widget it used was
removed on the 9th:

| | |
| --- | --- |
| Does it open? | Yes |
| Is the node rewritten? | Yes, to `find_health_facilities` |
| Is the practitioner told? | **No.** No warning, no note on the node, nothing in a receipt |
| Does any trace of the old type survive? | No |
| Its stored facilities? | Dropped, correctly — their provenance could not be carried — and **silently** |
| `country: "Philippines"` | Became `"PHL"`, a value nobody typed |

The dropping is right: that data's provenance was a hand-back of a file this
application never saw, and relabelling it would be a false record. The finding is
not the drop. It is that **everything above happens with no notification at all**,
and a practitioner reopening the workflow would see a configured node, a changed
country and no facilities, with nothing to explain any of it.

So the question for compositions is not how to prevent drift. It is what a
practitioner should be told when it happens, which can now be argued from a case
rather than from a hypothetical. The tests record today's behaviour; if loud
failure is introduced, they fail, and the change becomes visible.

### Label the worked examples with their public health scenario

Smallest step toward [79](docs/experiments/79-emergent-palette-slicing.md), and
the only one needed before the rest can be computed rather than argued.

Worked examples are named for their case — "heat outreach", "old naledi access",
"snow voronoi" — not for the kind of work they are. Adding one field, the public
health scenario, makes widget-to-scenario a computation over data that already
exists, the same way `usage:widgets` computes widget-to-example.

The structure is already visible without it. Measured across seven examples:
`observations`, `map_output`, `table_output` and `area` appear in six or seven;
`clip_polygons` and `summarize_polygons` appear together in the two catchment
cases and nowhere else. Nobody declared those four core. They emerged.

Two cautions, both recorded in 79. "Appears once" conflates scenario-specific
with newly added — `voronoi` and `find_health_facilities` are both at one, for
opposite reasons. And a filter that hides rarely used widgets is a quiet deletion:
the least used may carry the hardest-won distinction.

### GIS workflows 101: is there a teaching tier in the palette?

Raised 2026-10-10. Voronoi and isochrone hide their steps deliberately, because
composing them from parts asks a non-GIS public health professional to make too
many leaps at once. Taking a workflow apart is also how skill advances. Both are
true, so this is a question to observe rather than settle by argument.

The audit cannot express it. Both widgets are classified **Primitive** on D1's
axes — residual knowledge, asked for by name — and D1 has no axis for whether a
learner should see inside. `classification.json` has two values, `standard` and
`domain`, and no notion of a tier; the primitive-versus-composite judgement sits
in an audit the application never shows anyone.

Suggestive: **the three gaps the cholera notebooks exposed are all steps those
notebooks teach and the palette collapses** — weighted mean centre, convex hull,
routing. That is what you would expect if the palette were optimised for reaching
an answer rather than for learning how it is made.

Two things would settle it, and both are observations rather than designs:

- Does a learner who only used composites later compose something new?
  [27](docs/experiments/27-workflow-learning-and-gamification.md) already has the
  progression vocabulary and an exercise sequence; that is where to look.
- Does showing a composite's steps, without requiring anyone to wire them, reduce
  the leaps or add to them? The obvious risk is a palette that looks harder.

Not started, and deliberately not turned into a tier scheme. Reasoning in
[74](docs/experiments/74-notebook-first-worked-examples.md).

### Three primitives the cholera notebooks ask for

Derived 2026-10-10 by reading eleven notebooks across the Basic, Advanced-1 and
Advanced-2 case studies and mapping each operation to the palette. Full table in
[cholera-notebooks-to-primitives.md](docs/research/cholera-notebooks-to-primitives.md),
method in [74](docs/experiments/74-notebook-first-worked-examples.md).

These are wanted because an analysis performs them, not because they seemed like
good ideas.

- **Weighted mean centre.** `mean_center` records its method as "Unweighted
  arithmetic". Snow's data is 250 locations carrying 489 deaths; the centre of
  the locations is not the centre of the deaths, and one of this project's own
  practitioner questions is whether a reader can tell those apart. `case_series`
  already takes a weight field, so the concept exists and this widget lacks it.
  Smallest of the three, and it sharpens a distinction already being taught.
- **Convex hull.** Both Advanced studies derive a boundary from the data rather
  than drawing one. Already recorded in `docs/research/john-snow-voronoi.md` —
  hull and buffer "should not be hidden inside Voronoi" — and still hidden.
- **Routing between two points.** Advanced-1 NB02 computes a shortest path.
  `isochrone` answers what is reachable within a time, which is a different
  question from how to get from here to there and how far it is.

Before building any of them, write the notebook in the lab. That is the point of
the method: the notebook is the evidence the primitive is needed, and three
widgets were built this week without one.

### A WASM geometry kernel, instead of the JavaScript one

Raised 2026-10-14, **not urgent** and not an experiment yet. The question was which
widgets could use a Rust/WASM GIS kernel — `geo`, `geos-wasm` or similar.

The split is between the widgets that *compute geometry* and the widgets that do graph
or table work. Only the first group would gain anything.

| Would use it | Would not |
| --- | --- |
| `isochrone`, `reachable_corridor` — buffering and unioning the route; this is where the time goes | `reachable_nodes`, `snap_to_network` — Dijkstra and a nearest-point search over arrays |
| `clip_polygons`, `fill_interior_gaps`, `summarize_combined_area`, `buffer_area`, `buffer_point` — polygon clipping | `travel_time_band`, `rate`, `case_series`, `table_input` — table work |
| `voronoi`, `summarize_hull`, `hex_aggregate`, `summarize_polygons` — half-plane intersection, hulls, point-in-polygon | the ruleset and reasoning widgets — already WASM, through EYE-JS |
| `clip_raster`, `sample_raster` — masks and sampling | the import, output and presentation widgets |

**Why it might be worth it.** The measured cost of a catchment is almost entirely
`polygon-clipping` and `turf`'s buffer: 4.1 s of the 4.7 s a four-band Snow isochrone
takes, and the 4 GB heap exhaustion recorded at London scale was a single buffer call
([experiment 114](docs/experiments/114-the-three-segments-of-a-walk.md), the blocker
`isochrone-does-not-scale`). Those calls are already behind a handful of functions —
`taperedCorridor`, `clipPolygons`, the area helpers — so the surface to swap is small.

**What would have to be settled first.**

- **Offline.** The studio precaches and reports *Available offline*. A kernel is another
  WASM payload beside EYE-JS, and the service worker has to carry it.
- **Every pinned number moves.** A different engine gives different vertices, so every
  pinned area, gap count and death count in the suite shifts, exactly as today's work
  shifted them. That is measure-and-repin, not a regression, but it has to be planned as
  one exercise rather than discovered.
- **Which engine, and whether it is the same one the Validation Lab checks against.**
  The lab uses Shapely/GEOS. A GEOS-based WASM kernel would make the two agree by
  construction, which is either reassuring or circular depending on what the check is for.
  That question belongs in the experiment, not in the swap.
- **Is it a kernel or a widget?** Nothing here needs a new palette entry; this is an
  implementation swap underneath existing widgets, so it is not a primitive admission.

### A mark's size should be able to carry a count, and a map should be able to carry time

Raised 2026-10-31 by the practitioner, on the label ceiling: *"The 24 marks cap might not be
realistic for a public health map because outbreaks can easily go into hundreds of marks, the
point being to visualize point density."* And, on why South London has none: *"We did not
visualize point density for South London because we did not have individual records but if we
did that's one of the maps we would first draw."* **Individual records** meaning person
records — *"person, place and time"* — which is to say a line list.

The ceiling itself was not the obstacle. `LABEL_CEILING` bounds how many marks a figure
**names**, not how many it draws, and a layer over it is drawn unlabelled with the Inspector
saying so. The cap that does bind a spot map is `pointLayers`: **2,000 records combined** across
at most 8 layers, a hard stop that `map_output` and `table_output` both pass through.

**This repository holds exactly one line list, and it is not South London.**
`examples/hagelloch-1861/cases.json` is 188 measles cases, one row per child, qualifying on all
three: person (age, sex, family, and the infector), place (household coordinates), time (dates of
prodrome, rash and death). It is already wired as the `hagelloch` template. South London cannot
exercise any of this and is not the example to reach for — its unit is the sub-district.

#### 1. The number of marks is never the number of cases

It misses in a different direction in every dataset here. Measured 2026-10-31:

| dataset | rows | a row is | marks drawn | cases |
|---|---|---|---|---|
| South London | 32 | a sub-district | 32 polygons | aggregate only |
| `examples/john-snow/cholera_deaths.csv` | 250 | an address, with a count | 250 | **489** deaths |
| `examples/snow-gboh/deaths_nd_by_house.csv` | 1,852 | a house, 1,483 with no deaths | 1,852 | **706** deaths |
| `examples/hagelloch-1861/cases.json` | 188 | **a person** | **56** | 188 cases |

250 marks understate 489 deaths by half. 1,852 marks overstate 706 deaths by 2.6×, because four
houses in five had none. And Hagelloch is the case that matters most, because it is the line list:
188 person records collapse onto **56 household locations**, 3.4 cases per mark. Person-level
records, household-level places. **Having person records does not get a map out of this** — the
map is only ever as fine as the place column, and a line list's place is usually a dwelling, a
village or a ward rather than a person.

So: **mark radius from a nominated count field, as a declared per-layer choice**, beside colour,
shape and size in `resolveLayerSymbol`. Nominated and never inferred, the rule `labelField` and
`pinClassField` already keep. Three things make it cheap rather than new:

- **It has been built once already.** [33](docs/experiments/33-isochrone-plot-and-interactive-map.md)
  scales a death marker by DEATHS with a 2–20 pixel cap. It was never made a setting, so no
  practitioner can reach it.
- **The place to put it exists.** `MARK_RADIUS_DEFAULT/MIN/MAX` is a per-layer setting from the
  practitioner's 2026-10-25 observation that 250 addresses *"merge like a blob"*. A count field
  is the same control taking its value from the data instead of a slider.
- **`case_series` already takes a `weightField`** — so a weighted count exists in the time
  dimension and not in the spatial one. The same asymmetry the *weighted mean centre* item above
  records for `mean_center`. Three widgets now want the same missing idea.

#### 2. The curve and the map are the same children, and nothing joins them

Found 2026-10-31 by reading `src/hagelloch-example.ts`. The example branches the one `cases` node
two ways — `cases → curve → chart_output` for when, `cases → map_output` for where — and its own
comment states the intent: *"the curve above and the map below are the same children, which is
what this example exists to demonstrate."* They are, and **the two branches never rejoin**. The
curve knows the dates. The map draws all 188 at once.

For a line list that is the bigger gap, because person-place-time is one observation and FW
currently renders two projections of it side by side. A static density map of a whole outbreak
shows concentration; a map in time slices shows **spread**, which is the question an outbreak
investigation is actually asking, and Hagelloch has the infector column to check an answer
against. Not specified here: whether that is a parameter on `map_output` (draw the records in a
period), a filter widget upstream of it, or a small-multiple output. It is a design question and
belongs in an experiment record before any of it is built.

#### What this does not establish

A graduated mark is not a density estimate and not a rate. It shows where the counts are large,
which is also where the people are — the denominator problem is the *Snow's denominator* item
above, and `snow-gboh` is the only data here that carries one. Kernel density and hot-spot
detection stay under *Gap: spatial statistics* below; this is the renderer, not the statistic.
Binned density is a third thing and is closer than it looks: `src/geoprivacy.ts` already counts
points per H3 cell and shades none of it, because it was built to report disclosure rather than
concentration. And a map in time is not an epidemic curve: the curve has a denominator of days
and the map does not.

**Not urgent**, at the practitioner's direction 2026-10-31. One thing to weigh before building
the graduated mark: the aggregation FW already has may be the better map for Soho.
`summarize_points_to_polygon` with `valueField: 'DEATHS'` puts deaths into nearest-pump
catchments, and there the polygon is the hypothesis. A graduated mark asks a reader to compare
circles; a catchment asks the question Snow was asking.

### Gap: spatial statistics

Named 2026-10-10 while decomposing the process stages. The studio computes the
mean centre of a point layer and compares two of them. That is the whole of its
spatial statistics.

Absent: clustering, spatial autocorrelation, kernel density, hot-spot detection,
nearest-neighbour index. For a GIS studio serving public health, hot spots are
the obvious one — "where is this concentrated, and more than chance would
explain" is a question practitioners ask constantly and this cannot answer.

Worth settling before building any of it:

- **What question each answers, in a practitioner's words.** `mean_center` passed
  that test; a Moran's I widget that reports a coefficient and a p-value may not.
- **What the result must not be read as.** A hot spot is not an outbreak, and a
  cluster of reports is not a cluster of cases — reporting effort varies by
  place. This is the same shape as the sea-level limitation, and a statistic that
  arrives without it will be over-read faster than a map is.
- **Whether it needs a new carrier.** A global statistic over a layer is a value
  with a significance, not a point layer, and nothing today carries that. A local
  statistic gives every feature its own score and fits the existing points
  carrier, so the two are not one piece of work.
- **The zone problem.** Any cell- or area-based statistic changes with the
  zoning. The glossary now warns about this for summaries; a statistic makes it
  sharper, because the number looks more authoritative.

Not started.

### Closed: health facilities come from sources a browser can read

**Resolved 2026-10-09.** This section previously argued about whether to split healthsites
discovery from acquisition, then recorded the decision to combine them. Both arguments are moot:
`healthsites_discovery` is gone. Kept as a short note because the sequence is instructive.

The widget was built against healthsites.io, which needs an API key and — measured in
[69](docs/experiments/69-healthsites-acquisition.md) — sends no cross-origin header, so the
application could not read its response at all. Acquisition therefore required the practitioner to
download a file themselves and hand it back. Two alternatives were then measured and both answer
with `access-control-allow-origin: *`, with no account: Overpass, and the Humanitarian
OpenStreetMap Team country export on HDX. Both are OpenStreetMap-derived, as healthsites.io itself
is, and both are ODbL. `find_health_facilities` 0.1.0 uses them, always requires a study area, and
is recorded in [71](docs/experiments/71-health-facility-sources.md).

The uncomfortable part is worth keeping: **the project had been downloading from Overpass since
the street-network widget**, with pacing, provenance and a licence record already in place. A
credentialed source was reached for before the open one already wired into the application was
checked. The general lesson is to measure what the application can actually reach before designing
around a source, not after.

What survived: the licence treatment, which was the good part. ODbL is share-alike, so the licence
travels in the ontology as a resolvable IRI attached to the data rather than only to the request,
the attribution travels with it, and the links are shown before anything is downloaded.

Done 2026-10-10: **Overture Maps Places** is the third source, at `find_health_facilities` 0.2.0.
Independent of OpenStreetMap, CDLA Permissive 2.0 rather than share-alike, and it states a
confidence per place. A Manila study area reads 55,649 of 81,455,423 rows — 3 row groups of 1 of 16
parts — in about 1.5 s. The important finding is that it **counts differently**: 1,120 health
places unfiltered against 47 from OpenStreetMap, because it catalogues commercial places including
individual practitioners and wellness businesses. Hence a 0.70 confidence default and a
deliberately conservative category mapping that leaves the generic buckets unmapped. Numbers in
[71](docs/experiments/71-health-facility-sources.md).

Still open and unblocked: a **general licence gate**, since those terms, links and the acceptance
step are not source-specific and any licensed source needs the same. It is a refactor of one
dialog, not a port change.

### A licence declaration on imported data

Prompted by the proposal for a healthsites.io input widget. Three measurements shape it.

**A person can download it in a browser; the application cannot fetch it.** Two different
things, measured 2026-10-09 and worth keeping apart.

- `/api/v3/shapefile/Philippines` with a key returns **200, `application/zip`, 52.5 MB,
  `content-disposition: attachment`** — so pasting that URL into a browser downloads the file.
  Without a key it is 403. CORS does not apply to a user-initiated download, because no script
  reads the response.
- The same API returns **no `access-control-allow-origin` header**, so the Fieldwork page cannot
  `fetch()` it and read the result. That is the WorldPop finding of
  [39](docs/experiments/39-stac-discovery-and-remote-acquisition.md) again, and a proxy is out by
  precedent: [32](docs/experiments/32-john-snow-primitives.md) records that "no proxy or browser
  security bypass was introduced".

So the practitioner path is the one the project already uses everywhere: **download outside,
import bounded, record provenance.** What is built is an import of a prepared extract, not an
acquisition, and must not be named as one ([47](docs/experiments/47-sea-level-pack.md)'s naming
rule). The API key is a credential and belongs to
[experiment 30](docs/experiments/30-local-credential-files.md)'s subject, not inside a widget.

**The licence obligation is general, not healthsites-specific.** An imported layer needs to carry
its source, licence, attribution and share-alike status whatever the source is: ODbL for
healthsites, CC BY 4.0 for geoBoundaries and the AR6 extract, open for OCHA COD-AB, and
redistribution-prohibited for GADM, which is why the pack excludes it. So the capability belongs
on `observations` as a **declaration from an enumerated set of licences**, each carrying its
obligations — not as free text, which would let someone type "open" and lose a share-alike
requirement, and not as a source-specific widget, which would need rebuilding per source.

**The filters are a missing general primitive.** Selecting records by an attribute predicate —
`healthcare in (hospital, clinic)`, `completeness >= n` — is one of the six primitives the
bottom-up NB06 derivation named. Baking a healthcare-kind filter into a healthsites widget would
be a thick domain layer over a primitive that does not exist, which is
[59](docs/experiments/59-pattern-for-engineered-knowledge.md)'s engine firing for the fourth time
this session. Filtering should be visible and adjustable in the workflow rather than fixed in a
script or a source-specific node.

So: an enumerated licence declaration on imported data, plus select-by-attribute, rather than a
healthsites widget. What is genuinely source-specific — the osm_type/osm_id identity and the
recorded selection — travels as provenance in the extract, which
`validation-lab/scripts/fetch_healthsites.py` already writes.

### Worked examples

- **A service-coverage rate example.** `rate` and `reproject` are in the registry and in no
  worked example (`npm run usage:widgets`). The rate example is also the second-domain test
  that [59](docs/experiments/59-pattern-for-engineered-knowledge.md) and
  [60](docs/experiments/60-from-gis-studio-to-public-health-studio.md) both propose, and it
  forces the vintage-bearing denominator [51](docs/experiments/51-dataset-profiles.md)
  identified as the most common serious error.
- **Runbooks: a guided tour of a worked example from the `?` button.** Designed in
  [63](docs/experiments/63-worked-example-runbooks.md); deferred. Two decisions must be
  settled in that record before code: how a step names its node, and what a tour does on a
  modified workflow.
- Complete the sea-level worked example with a real extract. Needs the AR6 summary files,
  not the 38 GB sample store, and site-id resolution from the Philippine site index the pack
  already ships.

### Registry format

- **Per-port evidence in widget metadata**, per
  [66](docs/experiments/66-ports-as-schema-binding.md): each port records its carrier, roles,
  fitness conditions, how each is enforced and which test covers it. `validate:widgets` must
  resolve every named test and fail on a missing one, or the field becomes a place to make
  claims. The widget-level `validationStatus` then becomes **derived** from the weakest level
  across its ports, like `classification.json`, which also raises the ceiling that currently
  forces all 39 releases to declare `application-only`.
- **A generated connection matrix.** 1,700 candidate producer-to-input pairs, 200 allowed,
  1,500 refused, and one unit test asserting a refusal. The matrix is a pure function of the
  declarations, so it can be computed and frozen as a fixture where a contract change shows up
  as a diff.

### Records and vocabulary

- Add the ten sea-level competency questions to
  [44](docs/experiments/44-ontology-competency-questions.md), including the four the design
  refuses to answer. [47](docs/experiments/47-sea-level-pack.md) committed to this.
- Correct the stale navigation in [47](docs/experiments/47-sea-level-pack.md): its header
  still says the host lacks the tabular port, and it claims eight pinned file digests where
  the catalog pins five.
- **Done 2026-10-10**, and the answer was not the one this item expected. The pack manifest's
  two `excluded` stages were to be split into a decision and a capability limit. Measuring the
  capability limit showed there wasn't one: Zenodo sends `access-control-allow-origin: *`,
  honours Range, and one AR6 summary file is 71.7 MB inside the 9.24 GB archive. Both stages are
  decisions, and acquisition is now recorded as `out-of-scope` with the measurement attached.
  The general lesson is cheap and was skipped: this item asked for a *category* to be applied to
  a claim nobody had tested. Measure first, then classify.
- The same conflation sat in the glossary, where "we cannot read 38 GB of data in a browser" was
  the worked example of a capability limit. A store's size is not the bytes a reader transfers.
  Corrected in place rather than deleted, because a rule that failed on its own illustration is
  worth keeping visible.
- **Decision:** rename `parity` to `concordance`. In public health, parity is the number of
  births a woman has had. Touches [57](docs/experiments/57-parity-evidence.md) and
  `validate-widgets.mjs` output.
- **Decision:** whether the design audit should be ten checks or fewer. A ten-check gate
  with its own vocabulary is a real barrier to contribution, but it is what caught the
  defects above.
- Rename the node types that the [naming convention](docs/audits/ontology-audit.md) would not
  choose, each riding with the work that touches that widget rather than as a renaming pass:
  `xpert` (names a diagnostic product; the operation classifies facility evidence), `policy`,
  `access_policy`, `access`, `nearest`, and `output`. Renaming is a migration and uses the
  experiment 18 adapter. Listed in
  [the widget audit](docs/audits/widget_audit.md).
- Drop "internal primitive" as a term — it is a sentence pretending to be a term.
- Link [the glossary](docs/glossary.md) from the README.
- Add a term rule to AGENTS.md: a new term must be explainable in one plain sentence with
  an example, or it is not ready to be named.

### Browser coverage

**Resolved 2026-10-09: WebKit is at 84 passed, 0 failed, 1 skipped — the same as Chromium.**
Full account in [70](docs/experiments/70-webkit-parity.md). The position had been unchanged
since the 0.5.x CHANGELOG, at 42 passed and 37 failed, with the failures untriaged.

Three causes, in the order they were found:

- **Playwright 1.63.0 could not navigate while offline in WebKit.** 23 of the 37 failures were
  this one message. Four workarounds were measured and all four failed before the dependency
  itself was suspected; upgrading to 1.64.0 fixed it and recovered 24 tests. The dependency
  should have been the first suspect, not the last.
- **WebKit cannot store a Blob or a File in IndexedDB.** `storePDFs` wrapped every value in a
  Blob, so in Safari no attached PDF and no retained raster window could be stored at all —
  a shipped feature that did not work, found only because a second engine ran. Fixed by storing
  bytes. It was hidden for as long as it was because the abort handler asserted a full disk and
  discarded `tx.error`.
- **A controlling service worker hides requests from Playwright in WebKit.** The last two
  failures were tests whose simulated network conditions silently did not apply, so the app was
  correct and the tests were wrong. Behavioural claims now use `setOffline`, which works in both
  engines; the one test that substitutes a fixture uses `serviceWorkers: 'block'`.

Remaining here:

- **Decide whether WebKit joins the gate.** The stated condition — "add WebKit once the reload
  fault is resolved, so a red run means the application rather than the harness" — is now met,
  and the engine has already paid for itself once. Against it: the run costs about four minutes
  and `FIELDWORK_BROWSERS` already makes it one command. The honest argument for adding it is
  that Chromium-only was green throughout the entire period in which Safari could not store a
  single PDF.
- **Firefox has never been run.** `playwright.config.mjs` supports it and nothing is claimed
  for it.
- `tx.error` was not the only place a failure path asserts a cause it has not observed. Worth
  a sweep: an error message that guesses is believed.

### Toolchain

- Four of 39 widgets have parity evidence recorded; `clip_raster` is partial, where
  all-touched with a one-pixel margin differs from the reference on 61 cells because the
  reference models the margin as a 3×3 dilation.

### Dashboards

- **chartgpu.io** — practitioner's note, 2026-10-23: worth looking at when dashboards come up.
  Nothing has been read or measured yet, so nothing is claimed for it. The question to put to it
  when we get there is whether a GPU chart renderer answers the volume problem the 1,011,401
  polylines already demonstrated for Leaflet (769 ms to add, 824 ms to zoom), or only moves it.

### Deduplicate, after the main problems are finished (practitioner, 2026-11-02)

- Polygons: same-place by overlap. Test on building footprints from two open sources.
- Point and polygon: the same facility as a point in one dataset and a polygon in another. Point inside, or within a set distance of the edge. Settle what shape a merged record has.

### Citation builder for References (practitioner, 2026-11-02, after deduplicate)

- Built 2026-11-02, experiment 165. Still open: an author-year style choice, and looking a work up by DOI.
- Every item in References cites something. An authored note in References is written with a citation builder, reusing `Citation` and `renderCitation` from `input-provenance.ts`, with gaps shown before saving. Nigeria's seven references then move to structured citations.

### Next worked example: NYC child asthma and ozone (practitioner, 2026-11-03)

- **Data:** Lian et al., Zenodo [10.5281/zenodo.22757330](https://zenodo.org/records/22757330), CC BY 4.0 for the authors' own materials. `Data/Core/Derived/analysis_master_raw_rebuild.csv`: 3,653 daily rows, 2016–2025, citywide asthma-syndrome ED `count` for ages 5–17, with `o3`, `pm25`, `no2`, `tmean`, lags, `stratum`, `holiday`, `total_ed`.
- **Check against:** the authors' archived Table 2, RR 1.061 (1.035–1.088) per 10 ppb ozone, time-stratified multipollutant Poisson on 3,643 days and 123,265 visits. No published or preprint paper, so "checkable" means against the archived outputs; the app computes crude comparisons only.
- **A by-hand question:** the June 2023 Canadian smoke days, 49 visits on 2023-06-07 at PM2.5 190 µg/m³ against a June 1–5 mean of 25.
- **Before shipping the data:** read NYC DOHMH EpiQuery's terms for the daily counts (the package says to check DOHMH, EPA and NOAA terms); run the package's own R code to confirm the archived numbers.
- Research notes and ranking: `reports/Climate asthma worked examples.md` in the workspace root.
- **Decided 2026-11-03:** NYC.gov reserves all rights to the counts, so they are fetched from the authors' Zenodo record at open, never republished (experiment 170). Repository `example-2025-nyc-ozone`, documents only.
- **Later (practitioner, 2026-11-03):** augment with real downloads from remote sensing providers beside the monitors the authors used, such as satellite-derived PM2.5 or ozone, aerosol optical depth, or NOAA HMS smoke for June 2023, fetched at open by the same mechanism.
- **Remote sensing: the plan (practitioner, 2026-11-04).** [EO discovery and tabular integration for the NYC asthma example](docs/research/eo-stac-nyc-architecture-and-plan-2026-11-04.md), a research note generated with ChatGPT and committed by the practitioner: an EO Satellite Viewer and a STAC Browser as widgets, a STAC branch that creates a daily measurement table, and a merge with the Zenodo table by date. Proposed, nothing established. Its phases:
  - **0 · contracts first**, as a numbered experiment with an admission review: the original variable and lag definitions (now in the authors' dictionary, readable through experiment 172), one NYC boundary, the time basis, a short NO₂ pilot interval, and the table representation. The note flags two limits this application has: `DataTable` carries one value per row, so several numeric measures need an adapter or a contract change; and tables are capped at 20,000 rows (7 measures × 3,653 days is 25,571).
  - **1 · access, all three tracks**: a source matrix for NO₂, PM2.5 and ozone with real bytes decoded in a browser, not metadata alone (experiment 91 is where STAC access was first examined).
  - **2 · table preparation and a numeric merge**: a left join from the Zenodo table that never multiplies the counts, with duplicate keys, missing dates and name collisions shown before committing. Relate and Append are not to be widened into it silently; this is the "Relate as a merge" item with a concrete case.
  - **3 · NO₂ end to end**, then **4 · PM2.5** (AOD kept as AOD; a surface estimate only from a product that makes one) and **5 · ozone** (total column, partial column and surface kept apart; an 8-hour maximum needs the within-day sampling to support it), each with its own exit evidence.
  - **6 · full period and new models**, and **7 · practitioner evaluation**.
  - The measurement dictionary it asks for (variable, unit, spatial and temporal statistic, coverage, product and lineage) is experiment 172's column descriptions extended, not a separate mechanism.

### After NYC: London ozone and deaths, 2002–2006 (Bhaskaran et al. 2013)

- **Why:** the open paper publishes three rate ratios per 10 µg/m³ ozone, a ready check that shows confounding step by step: 0.991 (0.987–0.994) crude, 1.007 (1.003–1.010) adjusted for season and trend, 1.003 (0.999–1.006) also adjusted for temperature. Int J Epidemiol 2013;42(4):1187, doi:10.1093/ije/dyt092, CC BY-NC 3.0.
- **Data:** `londondataset2002_2006.dta` (34,540 bytes) in `gasparrini/2013_bhaskaran_IJE_codedata`, also the journal's supplement. Stata format, so it needs converting to CSV, and the conversion recorded.
- **Terms, our reading:** the paper names no data source and states no data terms. It says the code is published "to reproduce our analyses, along with the dataset itself". The practitioner, 2026-11-03: *"this means to me they are fine with reproducing the results."* Ship it non-commercially with citation, quoting that sentence in NOTICE as the basis, and say it is our reading, not a stated licence. The GitHub repo carries no licence.
- The app cannot fit the adjusted models yet; show crude comparisons beside the published ratios, as Salmonella does.

### Next: what the columns mean (practitioner, 2026-11-03)

Design and first measurement in [experiment 172](docs/experiments/172-what-the-columns-mean.md). Describing columns is the practitioner's step.

- A Columns step in Table input: label, unit, description per kept column, as a CSVW table schema with QUDT units.
- Pre-fill from Stata variable labels (the reader skips them today) and from an imported dictionary (CSVW, Frictionless, or a CSV dictionary mapped by the practitioner); unconfirmed until accepted.
- **Match a codebook mechanically** against its tables (names, declared codes against values, missing counts) and test it on the three examples that ship metadata: NYC (all 92 agree), London (labels in the file), Salmonella (68 of 82 columns unmatched by name, `sex` as text, `schule`/`ausbildung`/`biolm` values outside the declared coding). The Salmonella codebook is xlsx, which Fieldwork does not read.
- An undescribed kept column is a finding; declarations travel on the table, reach receipts and figures, make a run stale when edited, and export as a sidecar.
- Write the Salmonella findings into that example's README data notes when the match is built, so the authored notes can cite them.

### Worked example manuals (practitioner, 2026-11-04)

Experiment 173. The Manual tab is built and NYC has a manual.

- **Play back the build from the manual**: each step in a dialog with Previous, Next and Close, the canvas holding the nodes added so far.
- Manuals for South London, Oswego, Nigeria and Salmonella, each performed by its from-scratch test.
- The library heading reads "Node library" and its search "Find a node…"; by the glossary, what it lists are widgets. Not renamed yet.

### Regression (practitioner, 2026-11-04)

Built (experiment 167): NYC's 1.061 and Salmonella's 96 and 18 reproduced on the authors' data.

- **Laboratory check**: refit the NYC and Salmonella models independently (statsmodels or R) for parity.
- **London** (Bhaskaran et al. 2013): its seasonal and temperature terms, then the published 0.991, 1.007 and 1.003.
- Later, as the design said: conditional logistic regression for individually matched studies, interactions.

## Known and recorded, not yet scheduled

- **Routes and flows drawn on a map, as pushpins are placed** (2026-11-24). The practitioner: *"we should add a
  feature like pushpins to point data. Users should be able to draw flows and routes on a map as they observe events
  on the ground"*, and, settling the shape of it: *"Pushpins are points, Routes and flows are lines."* A third
  `inputMethod` on **Line layer** — file, border, **drawn** — not a new widget and not an experiment: widget
  evolution, so the dated record belongs in the widget's History.

  **The symmetry is the specification.** Everything the pushpin editor already does is reused rather than rebuilt:
  the Leaflet map, the basemap choice, Find a place, a pin at my location, full screen, the magnifier, undo, delete,
  the id strategy, and the per-feature form fields and attribute rules. What is new is the drawing — click to add a
  vertex, finish a line, move or insert one — and nothing else needs inventing:

  - **Direction comes free.** A LineString is an ordered sequence, so the order of clicking IS the direction. A flow
    drawn A→B must not be indistinguishable from B→A, so the editor shows the direction and offers to reverse it.
    This is the one thing `map-links.ts` gets for nothing — infector to case is implied by the data — and a
    hand-drawn line has no data to imply it.
  - **A magnitude is a form field**, as household size is on a pin. Nothing special is added for "how many moved
    along this".

  **Not the same as the links a map already draws.** `map-links.ts` runs a line from each record to the record it
  names, derived from two columns of an existing point layer. Here the geometry IS the observation and there is no
  table behind it. That is the gap.

- **Checks 26 and 40 cannot run in the lab's browser kernel**: neither rapidfuzz nor jellyfish is in Pyodide v314.0.6.
  Both pass in CPython only. Check 41 passed in the browser kernel on 2026-11-09. A Jaro-Winkler written in the lab
  would run there, but would not be by other authors.

**A computations audit: does the code state the equation the source paper states?** Named by the
practitioner on 2026-10-30, while refusing an argument made in
[151](docs/experiments/151-typesetting-an-equation-a-practitioner-wrote.md): *"How can a formula be
rendered wrongly in a publication if that formula actually comes from the widget that did the
computation? The provenance trail there is direct, all the way to the authors who originated the
equations. We just need to validate that what came from the source papers is what got translated
into code, that's a computations audit."*

The distinction it draws is one this project had not been making. A renderer can only be faithful
to the LaTeX it is handed, and a unit test can only be faithful to the arithmetic somebody wrote
down in it. **Neither checks the step before both**: that `rate`, `rate_ratio`, `epi_estimate`,
`two_by_two`, the geoprivacy displacement and the travel-time model compute what the papers they
came from say they compute. Every one of those already carries a citation in its widget record, so
the audit has a list to work from and a defined finish: for each computation, the source, the
equation as that source states it, the implementation, and whether they agree.

It is worth more than it looks, because it is what secures a number in a publication. Rendering an
equation, which was built on 2026-10-30, does nothing for it either way.

**Raised the same day, by the thing that does not close it.**
[151](docs/experiments/151-typesetting-an-equation-a-practitioner-wrote.md)'s amendment of 2026-10-30 made `rate`, `rate_ratio` and
`two_by_two` machine their equations into a Methods note, typeset, with a citation where a source
has been read. Every formula in those notes was read off the implementation, so a reader now meets
a typeset equation attributed to Katz or to Woolf whose agreement with Katz or Woolf nothing has
checked. The gap did not widen; what changed is that it is now in front of a reader rather than in
a source file, and a formula set in mathematics is read as more checked than a number, not less.

**The worked-example audit, 2026-10-29, and what the practitioner took from it.** Generated by
`scripts/audit-worked-examples.mjs` into
[docs/audits/worked-example-audit.md](audits/worked-example-audit.md), wired as
`validate:example-audit` so the document cannot drift from the code. The practitioner's reading
of it, the same day:

> My takeaway from the audit is to develop more robust worked examples like the John Snow ones.

**That reframes the list below.** Four of the seven recommendations are answered by building
examples rather than by changing the palette — R1, R4, R5 and R7 — and a fifth, R2, may dissolve
once an example poses the problem those widgets solve. The audit measures a shortage of worked
examples at least as much as a surplus of widgets, and the five Snow-related examples already
reach 32 of 54 widgets, which is the evidence for the direction: an example that poses a real
problem exercises a great deal of the palette at once.

The numbers, as measured on 2026-10-29:

- **R1 · 11 nodes carry data and declare no source**, across `heat` (2), `coverage` (1),
  `snow-voronoi` (1), `snow-isochrone` (2), `sea-level` (2), `snow-extent` (1), `rulesets` (2).
  Each needs a `sourceInfo`/`provenance` block or a published file beside the example, the way
  `geo/water-intakes.geojson` was written that day. Until then it is a payload a rebuild must
  copy rather than fetch.
- **R2 · 7 widgets no workflow reaches**: `buffer_point`, `deduplicate_points`,
  `fill_interior_gaps`, `measure_area`, `sample_raster`, `slr_threshold_comparison`,
  `summarize_combined_area`. Not a retirement list; D11 is the question and this audit does not
  answer it.
- **R3 · What a monolith and its decomposition owe each other in evidence.** Use propagates from
  a composition to its members and not from an equivalent monolith, so four widgets read as
  unreached while a workflow performs their work. An admission-criteria question, left uncounted
  until it is settled.
- **R4 · `south-london-1854` is the sole evidence for 11 widgets.** Restructuring it could take
  that evidence with it and nothing would report the loss.
- **R5 · One workflow of six has a from-scratch rebuild.**
  `tests/recreate-from-scratch.browser.mjs` proves `south-london/ground` can be built from an
  empty canvas and published files; the other five and all 11 shipped examples are unproven. It
  is the only test that can show a parameter is reachable from its own panel.
- **R6 · A declared source is read as present, never as reachable.** `validate:examples` verifies
  the pinned bundle's digests; nothing verifies a shipped example's declared source, so a dead
  URL reads as declared.
- **R7 · 4 widgets are attached to one example**: `facilities` and `facility_audit`
  (`old-naledi`), `comparison_map` (`snow-geoprivacy`), `slr_site_assignment` (`sea-level`).
  Each is already in `widgets/standardization.json` with the record that would remove it.

And then, on the same reading:

> Many examples are half baked.

Measured, so it is a number rather than an impression. Four conditions, none of them invented for
the purpose: every data-carrying node names its source, no widget is attached to the example by
name, the inputs are published as files a reader can download, and a rebuild from an empty canvas
exists as a test.

**No shipped example meets more than two of the four.** `hagelloch` and `raster` meet two,
`sea-level` meets none, and the pinned `south-london-1854` meets three. Node count does not
predict it: `snow-isochrone` is the largest example at 18 nodes and meets one.

**The cause is one decision, not eleven oversights.** Every shipped example fails the published-
inputs condition for the same structural reason — a shipped example's data lives in this
repository's source, not as files a reader fetches. That is also what makes a from-scratch rebuild
impossible for all eleven and possible for the pinned one. So "more robust worked examples" has a
precondition: an example's inputs have to be publishable, which the pinned-repository shape
already solves and the shipped shape does not.

**The practitioner's disposition for the shipped examples, 2026-10-29:**

> Old Naledi, sea level rise (incomplete), heat, raster (need to be folded in more robust ones),
> coverage (need to be folded in to others).

Five of the eleven, and the audit's own numbers agree with the reading: `sea-level` meets none of
the four conditions, `heat` and `coverage` one each, `raster` two of four on a four-node canvas,
and `old-naledi` carries two of the four widgets attached to a single example (`facilities`,
`facility_audit`). Folding in is not deletion — each poses a question some widget answers, and the
widgets they are the sole evidence for would lose it if the example simply went away. What each
fold has to preserve is recorded against the widget, not the example:

- `old-naledi` is the sole evidence for 4 widgets, `sea-level` for 2, `heat` for none it does not
  share with `old-naledi`, `raster` for 2, `coverage` for 1.
- `facilities`, `facility_audit` and `slr_site_assignment` are already in
  `widgets/standardization.json` with the record that would remove them, so a fold is the occasion
  to act on that rather than a separate decision.

**And track what crosses examples.** The practitioner, the same day: *"We should also track which
widgets are used across examples, those are genuinely emerging as useful widgets."* The audit now
names them rather than only counting them — 12 of 54, led by `map_output` (12 examples),
`point_input` (11), `study_area` (10), `table_output` (10), then `chart_output` and `table_input`
(6), `apply_ruleset` (5) and `case_series` (4). With one caution the table states: `clip_polygons`,
`reproject` and `summarize_points_to_polygon` each reach exactly two examples and both are Soho
Snow examples, so they have crossed an example boundary without crossing a problem.

What a robust example looks like, read off the one that passes: every input a published file with
provenance and a digest, no widget attached to it by name, a from-scratch rebuild as a test, and
a question worth asking rather than a tour of the palette. South London meets the first three as
of 2026-10-29 and is the only example that does.

**`case_series` has taken a table since 2026-10-16 and has never offered a control for it.** Its
`source` param switches the `cases` port between points and a table, and nothing in the Inspector
sets it, so table mode is reachable only by opening an example workflow that already has it — the
Soho curve. `rate` gained the same param on 2026-10-24 and got the control at the same time
([experiment 134](experiments/134-a-rate-from-a-table.md)), which is what made the older gap
visible. Two widgets with the same shape should not differ on whether the practitioner can reach
half of it.

Its release is stale for the same reason: `widgets/releases/case_series/0.1.0.json` declares the
points port only, and the table variant arrived without a release. That is not a registry
violation — the port check compares the release against the static `TYPES` declaration, not against
`nodeInputs`, so a per-param variant is invisible to it and lives in the release note instead. Both
`rate` 0.2.0 and `case_series` state the variant in prose. Whether a port whose type depends on a
param should be expressible in the release schema rather than described in a note is the open
question, and it governs every widget that does this.

**A record can no longer be excluded by judgement, and nothing replaces that.** `coverage_check`
was retired on 2026-10-21 at the practitioner's decision, as redundant with `clip_points_to_area`
and the map — which it was, for the SPATIAL question. It also did something no widget now does:

- A reviewer could exclude one record with a **written reason**, and the reason travelled into the
  N3 as `fw:exclusionReason`.
- The exclusion was pinned to a **signature of the record's whole content**, so editing the record
  lapsed the exclusion instead of letting a stale judgement ride on changed data.
- The decision came from an **N3 rule the reasoner evaluated** — `{ ?r fw:excluded true. } => { ?r
  fw:coverageDecision fw:Excluded. }` — rather than from code, which is one of the few places this
  application reasoned rather than computed.

A clip answers "is this point in the area". It cannot answer "this record is wrong, and here is
why", and the two are different questions. Saved workflows that held exclusions carry them in the
migration stamp, inert, so nothing was lost from a file — but there is no way to make a new one.

What would settle it: whether the capability belongs to a widget of its own (a record review that
takes any point layer and emits decisions with reasons), to the existing `apply_ruleset`, or
nowhere because a judgement about a record belongs in the source data. That is a question for the
practitioner, and it is recorded here rather than assumed.

**Built 2026-10-21: `deduplicate_points`.** The practitioner asked for it on 2026-10-20 — *"health
facilities can be deduplicated by name and point location. By name can be algorithmic match or
exact match, but we can study the OSM and Overture Places data sets before we decide what would
work"* — and this entry said the rule was the unknown and should be measured first.

What changed is where the rule came from. On 2026-10-21 the practitioner pointed at a record-linkage
command in an earlier repository of their own, where the contracts were already settled:
blocking before comparison, binary contributions rather than a blended score, three classes rather
than merge-or-not, missing never agreeing with missing, and an authority boundary that classifies
without deciding. The widget takes those and adds the spatial comparison.

So the rule is not guessed — but **the thresholds still are**, and the release says so: they are
proposals, not measurements. What this entry asked for is still owed, and is now cheaper to get
because the widget reports it: run it over North Kivu's OSM, Overture and HDX layers with a
generous blocking distance, and read off how many pairs match exactly by name, how many only after
normalisation, and the distance distribution of the candidates. That is the evidence the defaults
should be set from.

**The street network has no travel mode, and a travel time has no bound.** The download applies
one walking filter, while `reachable_nodes` already offers walking, cycling, driving or other with
per-mode speed bands — the mode is declared where it cannot be honoured and absent where it would
be. On the Soho walk graph this repository ships, 56.7% of edges and 48.1% of edge length are
types a driving filter excludes, and 28.1% carry a vehicle one-way restriction the parser ignores.
The practitioner, 2026-10-20: *"For current day investigations, these speed limits matter as a
ceiling (best case travel time). Worst case travel time can be researched."* So a time computed
from a posted limit is a bound, and the bound points the wrong way for an access claim: it can
rule a site out of a catchment and cannot rule one in. `maxspeed` is read nowhere today, is free
text where it exists, and covers 66.9% of drive-usable edges in central London. Recorded as
[126](experiments/126-travel-time-as-a-bound.md), with the two directions
`street-network-declares-a-travel-mode` and `travel-time-from-a-posted-limit-is-a-best-case`.

**A narrative framing stage, before the first widget.** The practitioner, 2026-10-17: *"There
must be something in the beginning that helps the user design the frames of the story … And this
step precedes the use of the study area widget."* Recorded as a **framework incompleteness**
rather than a caveat in [119](experiments/119-can-this-tell-a-story.md), because under
developmental evaluation finding the framework incomplete is a result. Today the first question
this application asks is spatial; nothing asks what the work is for. Frames are **not** the
medium — *"could be a scientific publication or a poster or an infographic but nevertheless needs
the rigor required to achieve the narrative goal"* — so the structure and the form are separate
choices. Candidates: person/place/time (native, already this project's vocabulary), STROBE (22
items, and notably silent on figures and maps), Segel and Heer's genres (form, not frame). The
smallest useful step is one declared frame that a run reports against, **including when the run
does not support it**.

Refined the same day, and this is what makes the idea safe. **A frame states a question, not a
conclusion** — *where did the outbreak reach*, not *it clustered around one pump*. **Or, for a
scientific publication, it declares the result as a null hypothesis**, which is the falsifiable
form the field already has: STROBE's item 3 asks for specific objectives *"including any
prespecified hypotheses"*, so a frames stage would be producing what the reporting standard
already requires. Prespecification is also the recognised guard against **HARKing** —
hypothesising after results are known — which is the formal name for the hazard of fitting data
to a frame.

**And the arc must be revisable, with the revision recorded.** Mintzberg's deliberate, emergent
and realized strategy applied to an account: what was intended before the data was seen, what
contact with it forced, and what the published thing actually argues. All three are provenance,
which this project already knows how to carry. The difference between the first and the third is
the number nothing records today — and it is also the evidence that a prespecified hypothesis was
not quietly rewritten after the fact.

**Revisit the Gaborone ABM notebooks for smaller worked examples.** (Old Naledi retired 2026-11-11; the notebooks remain
the source for a later Gaborone example, and for experiment 199.) Worked example 02 Old
Naledi was derived from them, and the practitioner, 2026-10-17: *"That's a complex set of
notebooks and has a lot of potential smaller examples."* 02 currently carries two pinned
rulesets and a whole diagnostic-access chain in one canvas; the notebooks behind it are a
source of narrower exercises that would each demonstrate one thing. Map them the way
[`cholera-notebooks-to-primitives.md`](research/cholera-notebooks-to-primitives.md) maps the
cholera studies — operation by operation, against the palette — before deciding which become
examples.

**Correct the geoBoundaries licence claim, in two places.** Experiment 47's table records
geoBoundaries as *"CC BY 4.0 … attribution obligation only"*, and the glossary's **Out of
scope** entry says *"geoBoundaries is used instead"*. Testing the service
([probe](research/geoboundaries-probe-2026-10-17.md)) found **six distinct licences across
eleven country-levels**, including **ODbL, which is share-alike** — and the three ODbL levels
are the DRC and Uganda ones. The glossary sentence also reads as a capability: nothing in
`src/` references geoBoundaries, and there is no polygon ingestion path for it to use. Both
statements are mine to flag and the practitioner's to correct.

**The two buffers, and what the edge decides.** `buffer_point` imports `validateBuffer`
from `area-buffer.ts`, so the distance knob and its 0–50,000 m range are already one thing.
What differs is the Turf step count — 8 against 32 — justified in `buffer-point.ts` by
*"8 … is ample when expanding an existing boundary; here the edge decides membership, so
the finer setting is used"*. **The cross-border case breaks that premise.** Expanding a
district to catch Ebola cases that crossed from the DRC into Uganda is an expansion whose
edge decides membership: whether a case falls inside it decides whether it is counted. So
8 steps is justified by an assumption that use violates, and `fw:AreaBuffer` records no
equivalent of `fw:circleAreaFraction`, so the under-coverage is not even a number. Fix the
approximation reporting before deciding whether the two widgets merge — a merge that
carried the wrong step count into the cross-border case would be worse than two widgets.

**Multi-member study areas.** The widget stays — `fw:studyArea` is
`rdfs:subPropertyOf prov:used` with `rdfs:range fw:StudyArea`, so a parameter could not
satisfy the declared range and the receipt would weaken. But `fw:StudyArea`'s own comment
already proposes membership: *"multiple named, disconnected features without requiring a
dissolved aggregate geometry"*. That turns the three-cities comparison from three nodes
into one area with three members — the clutter the practitioner described, removed without
touching twelve port contracts or any receipt.
[120](experiments/120-the-study-area-as-a-declared-resource.md).

**The study area as a declared resource, not an edge.** Twelve active widgets take an
`area` port and only three are ingest, so a picker inside ingest widgets removes a quarter
of the wiring. [120](experiments/120-the-study-area-as-a-declared-resource.md) measures it,
records the practitioner's lean — *"there's pros and cons to doing this but I am for
decreasing unnecessary friction"* — and names the three things a change must not lose: the
deliberate difference between an acquisition bound and an analytical extent, pinning and
drift on a reused area, and the `prov:used` assertion the edge currently provides for free.

**Measurement scale on a field binding.** A binding declares `kind: number | boolean | term`,
and `term` covers both *clinic / pharmacy / health post* (unordered) and *NoDeaths / Few / Many*
(ordered). The ruleset worked example produces the second kind and nothing records the order, so
a map drawing those bands cannot know a sequential ramp is right and a qualitative palette is
wrong. Found 2026-10-17 while assessing cartographic design research
([research/cartographic-ontologies.md](research/cartographic-ontologies.md)); it blocks any
honest design advice, and the place to declare it is the authored rule form, where the bands are
written and the practitioner already knows the answer. Nominal, ordinal, interval, ratio — a
second fact, orthogonal to `kind`.

**2026-11-13:** declared on the column instead, where its meaning is: [211](experiments/211-the-measurement-scale-of-a-column.md)
built the scale and codes on Tabular data, with its data dictionary as a project asset. The binding's `kind` is
unchanged; Chart, the map's colour scheme and Point data do not read the scale yet.

**Cluster detection.** Named by the practitioner on 2026-10-17 as a future widget, with a source
of example data attached: *"When we get into cluster detection (a future widget) SatScan.org has
example data sets as well."* Surveyed in
[research/data-sources.md](research/data-sources.md#satscan--for-a-cluster-detection-widget-that-does-not-exist-yet)
— nine sets, including two **benchmarks** whose right answer is known, which is what a new
detector needs before it is pointed at anything real. It would be the first widget here to need
cases, denominators and places at once; the three port types exist, and `rate` already insists a
denominator declare what it counts. Terms are "educational as well as research purposes", which
is enough to use and not enough to ship.

**Hypothesis, the practitioner's, 2026-10-12: a decision class is its own widget.**
Not scheduled, and recorded so it is not re-derived. The claim: *"the policy widget after all may
be just a ruleset based widget that emits a decision class which can be defined externally within
a decision class widget."*

What makes it worth an experiment rather than a note is that today's work points the same way
without having set out to. With its ruleset extracted, `policy`'s only residual is an explanation
sentence, and that sentence restates the ruleset's conditions in prose — so the widget is already
close to "a ruleset-based widget and nothing else". The part the hypothesis adds is where the
**output vocabulary** lives. Today each ruleset declares its own: `fw:decision` over
Review/NoFlag/Unknown, `fw:zone` over five values, `fw:evidenceLevel` and `fw:service` over four
each. Under the hypothesis those are not ruleset-internal — they are a declared artefact of their
own that a ruleset *targets*, and that a practitioner can define.

Three things that would decide it, none of them done:

- **Do two rulesets ever target the same class?** `outreach-criteria` and `access-review` both
  conclude `fw:decision` over the same three values, which is evidence for the hypothesis: one
  class, two rulesets. `nb06-evidence` concludes two predicates nothing else uses, which is
  evidence against, or evidence that a class can be private to one ruleset.
- **Would it collapse widgets or add one?** A decision-class widget is a new palette entry, so it
  must retire more than it adds or it is the failure this project spent 2026-10-12 undoing.
  Against: the four rule widgets are already collapsing to one.
- **Where does the unknown value belong?** Every vocabulary must include one
  ([65](experiments/65-ruleset-as-data.md)), and if the class is external then the class owns that
  rule rather than each ruleset repeating it.

Related: the explanation gap named in [65](experiments/65-ruleset-as-data.md) may belong to the
decision class too — a class that owns its values is the natural owner of how each value reads.

**Audit the worked examples for their exact derivation and source.** The practitioner's
request, 2026-10-12. Not scheduled. What is already known, measured the same day, is enough to say
the audit will find something:

Nine example variants ship. **Four** carry a `provenance.json`, and the four use **four different
schemas** — no shared key beyond `files`:

| Example data | Declares |
| --- | --- |
| `john-snow` | `retrieved`, `pointsRevision`, `networkRevision`, `files`, `transforms`, `notice` |
| `snow-gboh` | `retrieved`, `source`, `sourceDigest`, `publisher`, `documentation`, `originalSource`, `licence`, `files` |
| `manila-sea-level` | `builtAt`, `builtBy`, `environment`, `projections`, `sites`, `facilities` |
| `old-naledi` | `repository`, `commit`, `files`, `notes` |

So only one of the four declares a **licence** and a **publisher**, and only one declares an
`originalSource` distinct from where the file was fetched from. Nothing validates any of this,
because there is no shape to validate against — which is the same failure the widget releases had
before `validate:widgets`, one level out.

And the heat demo, the geoprivacy example and the raster example have **no data directory at all**:
they are synthetic, built in code. That is legitimate and it is not declared anywhere a reader or a
script can see. "Synthetic, authored for this demonstration" is a provenance claim, and an absent
file is not that claim — it is indistinguishable from an omission.

What the audit should answer per example, which is the shape the four files between them already
half-declare: what the original source is, who published it, under what licence, what was retrieved
and when, what digest it had, what transforms were applied, what is synthetic, and what a reader may
not conclude from it. `snow-gboh` is the closest thing to a model.

Why it matters beyond tidiness: [56](experiments/56-basis-behind-identity.md) is about the basis
behind an identity, and the ruleset work of 2026-10-12 found that the one ruleset claiming a
*published* basis cites three papers that resolve to nothing a reader can open. The examples are the
other half of that question, and nothing has asked it of them yet.

**A `table` → `points` widget: the gate by which table values become GIS coordinates.**
The practitioner's framing, 2026-10-12, and recorded rather than built because it is a **new
widget** — plus one against a target of 41 at 46 — and that trade should be made deliberately.

**It would be the first addition where adding is clearly right.** The budget is answerable to
empowering practitioners in field workflows, and today a practitioner who imports their own CSV
with latitude and longitude columns **cannot make it spatial inside a workflow**. Measured: three
widgets consume `table` and all three emit a table or decisions; the only ways to obtain `points`
are `observations` (edits data), `samples` (generates a grid) and `find_health_facilities`
(fetches from a source). None converts.

**The conversion already exists in code and is unreachable from the graph.** `csvPoints` in
`src/input-data.ts` is exactly `points_from_xy`: it names the x and y columns and declares the
unit. It is called from two **file-import dialogs** only — the ordinary import, which reads
degrees, and `reproject-ui`, which reads UTM metres and converts. So the capability exists for a
*file* and not for a `table` already in the workflow.

The contract, which the 2026-10-12 work already settled:

- in `table`, out `points`
- the x column and the y column, chosen by the practitioner, with the explicit mapping longitude
  is x and latitude is y
- `units`, required and undefaulted — `'degree'` or `'metre'`, because geopandas will not build a
  GeoDataFrame without a CRS and this project's one CRS is an invariant, not an absence
- for metres, the UTM zone and hemisphere, reusing `reprojectToCRS84`, since a projected CSV is
  the case `reproject` exists for

**What it must say it cannot do.** An axis swap is undetectable by range whenever |longitude| ≤ 90,
which includes both worked examples this project ships: a swapped Soho pump lands off Somalia and a
swapped Gaborone facility lands in Algeria, both as perfectly valid coordinate pairs. What catches a
swap is the study area — every record reads Outside and `coverage_check`'s `canProceed` goes false.
The widget should not imply otherwise.

**What it unlocks beyond the obvious.** `case_series` builds a FeatureCollection with every
geometry null from a table and casts it `as unknown as PointCollection` to reuse the point-based
path; with a real conversion it consumes the table directly and the cast goes.

**Shared mechanism, not a second one.** Choosing which column means what is
[61](experiments/61-input-dimensions.md)'s problem, and the role binding
[65](experiments/65-ruleset-as-data.md) needs for rulesets is the same mechanism. 65 already says
whichever lands first should be built so the other can use it; this is the second caller arriving.

**Finish aligning the vocabulary to standards.** Started 2026-10-12 and parked deliberately, so
housecleaning is not displaced by it. The ledger is `ontology/vocabulary-basis.json`.

Where it stands: **3 of 263** declared `fw:` terms carry an alignment, up from **0**. The three are
`fw:byteSize` ≡ `dcat:byteSize`, `fw:member` ≡ `rdfs:member`, and `fw:memberOf` ⊑
`dcterms:isPartOf`. SHACL conforms.

**The decision is settled and makes this cheap: align, do not rename.** An axiom is data — no
migration, no saved workflow touched, receipts byte-identical — so this can be done a term at a
time with no big-bang. That is why it can wait.

What remains, in the order it should be done:

- **Read three specifications.** The candidates were *recalled*, not searched, and the ledger says
  so: **CiTO** for `fw:referenceRole`'s four citation roles, **ADMS** for
  `fw:implementationStatus`, and **VoID** for the roughly fifteen count properties. Partial
  coverage is the interesting answer — two roles aligned and two not would be a more useful result
  than either extreme.
- **Search the ten likely-conduct terms** rather than assume them cleared. `fw:claimsNoComputation`,
  `fw:valueUnitStatus`, `fw:basisStatus` and the rest are recorded as **unsearched**, which is not
  the same as none-found.
- **Then the ratchet**, in the shape `rulesets/ledger.json` already uses: a departed count that may
  fall and never rise, and every *none-found* entry carrying which standards were checked and on
  what date. That last part is the practitioner's point that the DE work is the discovery — a
  negative search result is a dated claim like any other, and a term cleared in October may not be
  cleared in November.

**One limit, recorded so its absence is not misread.** Equivalence and disjointness need a
counterpart of the same kind, property against property or class against class. The distinction most
worth asserting here is that `fw:MeanCenterResult` is **not** a centroid — `mean_center` is the mean
of point coordinates, and the names invite the confusion — but GeoSPARQL exposes centroid as a
*function*, so there is no class to be disjoint with. That one stays in an `rdfs:comment`, and the
missing axiom does not mean the question went unasked.

**An on-surface guide — a tour, and something that answers questions.** Asked for as an
exploration by the practitioner on 2026-10-15: *"add a Clippy like agent on the UI surface as a
guide to the UI — can provide a guided tour and answer questions."*

**Three different things wear that description, and they have almost nothing in common.** Which
one is meant decides everything about the cost, so they are separated here rather than scoped
together:

| | What it is | Needs | Offline |
| --- | --- | --- | --- |
| A | **A scripted tour.** Steps through the interface pointing at things, in a fixed order, with text written by hand | nothing new | yes |
| B | **An assistant that answers from the canvas.** "Why is this step refused?", "what produced this number?", "what can I connect here?" — answered from the workflow, the port contracts and the run receipts | query surfaces over things that already exist | yes |
| C | **An assistant backed by a language model** | a network call carrying the practitioner's canvas to somebody else's service | **no** |

**What already exists and should be counted first.** The playback behind *Play back the build*
is a guided tour of a worked example — it steps a real workflow one widget at a time and says
what each step revealed. The manual is one page per widget. Dive Deeper explains the assumption
behind ten of them. Experiment [44](experiments/44-ontology-competency-questions.md) is
literally a list of questions the graph is supposed to answer, several of which it does. A
guide built on those would be assembling what is here; one built on a model would be answering
beside it.

**C has a cost this application has otherwise refused to pay.** Everything here runs locally:
no widget is fetched at run time, the reasoner is WASM on the device, and the one feature that
contacts an outside service — a basemap — says so in the interface and is off by default. An
assistant that sends the canvas away would be the first thing to break that, and a canvas is
not neutral: it holds case locations.

**What Clippy actually got wrong is worth keeping in view.** Not that it was an assistant, but
that it **interrupted** — it appeared uninvited, read what you were doing, and offered help
nobody asked for. The feature to copy is the one a practitioner opens.

**What would decide it:** which of A, B or C is wanted. A is small and could be built now. B is
the interesting one for this project, because every answer it would give has to come from
something the application can already show — which is a test of whether the ontology and the
receipts are good enough to answer a practitioner's question, and that is a finding worth having
either way. C needs a decision about sending a canvas off the device, which is a bigger
question than a help feature.

### The proposed shape: a **Field guide**, running an OODA loop

**The name.** A field guide is a book you carry and open *when you choose* — the invitation is
in the metaphor, which is the one thing Clippy got wrong. Its organising question is *"what is
this thing in front of me?"*, which is option B. It absorbs the manual rather than competing
with it: a field guide has an entry per species, so the per-widget pages become its entries.
And it claims no intelligence — nobody expects a field guide to be clever, only accurate and
indexed. *Assistant* and *Helper* claim agency and invite questions it cannot answer; *Compass*
implies it tells you which way to go; *Scout* implies going ahead unasked. A character or a
person's name is worse than all of them: anthropomorphism makes a reader trust a thing past its
evidence, which is what most of the effort in this project goes into preventing.

**What it looks like.** No face, no animation, no idle presence. An entry in the header beside
Help, opening a dialog in the same family as the manual and the catalog, which is a pattern
already here. Three sections: **this step** (the selected widget's entry, its ports, what it
will not do), **this canvas** (answered from the workflow, the port contracts and the last run's
receipts), and **a tour** (the playback, which exists, pointed at the current example).

**It opens when asked.** One exception is worth allowing: a refused run already names its cause,
so an *explain this* link there opens the guide at that entry — invited by a failure rather than
by idle watching.

**The loop.** The practitioner's framing, 2026-10-15: *Observe → Orient → Decide/Act.* It fits
because each phase maps onto something the application already computes, which is the whole
argument for building B rather than C:

| | What it does | Where it comes from |
| --- | --- | --- |
| **Observe** | what is on the canvas, what cannot run, what the last run found, what is declared and what is not | listed below — all of it exists |
| **Orient** | name the problem in the practitioner's terms, **with the evidence it came from** | the citation rule, below |
| **Decide / Act** | the options with what each costs, and where the action is unambiguous, a button that takes it | the zone advice already works this way: it states the cost and offers *Use zone 30N* |

**Twelve things Observe could read today, without anything new being computed:**

| | Signal | Already computed by |
| --- | --- | --- |
| 1 | a step with no ruleset chosen | `executionPlan`, which refuses it by name |
| 2 | a required input not connected | `requiredInputs` |
| 3 | a map with nothing wired to it | the run's refusal, in layer terms |
| 4 | a UTM zone that disagrees with the data, and what it costs | `suggestUTM`, `utmScaleFactor` |
| 5 | a ruleset pinned to a superseded version | `supersession` |
| 6 | provenance a step has not declared | `DeclarationGap` |
| 7 | sites the street network could not reach | the run alert |
| 8 | records no rule matched | `fw:unmatchedSubjectCount` in the receipt |
| 9 | a comparison whose units disagree | `authoredUnitProblems` |
| 10 | rules near the compile ceiling | `compiledRuleCount` |
| 11 | a cached build older than the one installed | the service worker's version report |
| 12 | a download that failed, and which instances were tried | the Overpass failover's message |

**The rule that makes it this project's rather than a generic help bot: every answer cites
where it came from — a receipt, a port contract, a manual page, a measurement — and links to
it. When it has no citation it says it does not know.** That is the provenance discipline
applied to a help feature, and it is also the honest constraint: it knows the application, not
the epidemiology. It must not guess, must not paraphrase a receipt into something friendlier
and less true, and must not answer a question about what the data *means*.

**The cheapest thing building it would prove.** Six of the eight refusals measured in
[112](experiments/112-progressive-widget-reveal.md) already name the step that should have come
first. A Field guide that can answer *"why was this refused?"* from the receipt is reading
something the application already writes — and if it cannot, that is a finding about the
receipts rather than about the guide.

**Four concepts worth taking from ArcGIS Model Builder**, from the sideways sweep in
[116](experiments/116-model-builder-sideways.md) over screenshots the practitioner uploaded on
2026-10-15. Each is independently useful and none depends on another:

1. **Ask which role when more than one port fits.** Dropping a layer on a tool there opens a
   menu — *Input Features*, *Extent*, *Precondition*. Our Map binds by type silently, which
   already needed a workaround: `context` is points-typed and means *drawn beside polygons*, so
   it had to be excluded from automatic binding to stop it taking a role nobody chose. Binding
   silently when one port fits and **asking when more than one does** is the honest rule, and it
   extends the configurable port from the Map to every widget.
2. **Validate without running.** `executionPlan` already computes whether a canvas is coherent
   and only Run reaches it. **Smallest of the four:** the reason first given — that a run
   downloads street networks — was wrong, and the practitioner corrected it. `network_input`
   downloads on its own button before the run, so the expensive unreliable part is already
   outside it, and a run costs seconds of local reasoning.
3. **Say on the node that it cannot run yet.** An unconfigured step says so in the Inspector, to
   somebody who has already selected it. The canvas is where the shape of the work is read.
4. **Declare the metric frame once per workflow.** *Partly built 2026-10-15: the study area now
   suggests the zone and, when an area straddles a boundary, names each candidate with the worst
   stretch it would cost. What remains is the Environments shape itself.* ArcGIS calls it an *Environment*: declared
   for the model, inherited by every tool, overridable per tool. Ours is a UTM zone in every
   measuring widget's parameters, refused when two disagree, with the cost of a wrong one
   measured in [100](experiments/100-choosing-the-metric-crs.md). The better shape, and the only
   one of the four that changes what a saved workflow holds.

**A building-footprint widget.** Asked for by the practitioner on 2026-10-15. Specified in
[docs/widget-specs/find_building_footprints.md](widget-specs/find_building_footprints.md),
which carries the source evaluation from
`digitaltwin-aas/gaborone/03a-Building-Footprint-Augmentation.ipynb` — five products compared
against one city, with Overture and 3D-GloBFP used for their height and Google Open Buildings
and Microsoft GlobalML excluded because they have none and their counts in informal settlements
are inflated by sliver detections. **The data question is closed; the contract question is
open:** of the five, only OpenStreetMap is reachable from a browser, so the widget either
acquires from OSM alone or imports a file prepared elsewhere. The specification recommends
import first and says why.

**OpenFreeMap tiles and themes for the Map widget.** Asked for by the practitioner on
2026-10-15. Today the only basemaps are OpenStreetMap's raster tiles and OpenTopoMap, both
third-party services that see the viewed extent of every pan. [OpenFreeMap](https://openfreemap.org)
serves **vector** tiles free and without an API key, with several styles, and can be
self-hosted — which is the part that matters here, because it is the first basemap option that
could remove the disclosure objection rather than trade against it. Vector tiles also mean themes:
a light, dark or minimal ground chosen to sit under the data rather than compete with it, which
raster tiles cannot offer. **What would decide it:** whether a vector renderer is worth the
dependency. Leaflet draws raster tiles with no help; vector tiles need MapLibre GL or an
equivalent, which is a substantial addition to a project that currently ships one mapping library.
Related: the three basemap options recorded in [the Map specification](widget-specs/map_output.md),
where PMTiles is the other offline-capable candidate.

**Nothing converts a table into points.** Moved here from the blocker ledger on 2026-10-15, where
it had been `standing` while gating nothing. No widget takes `table` and outputs `points`, and no
widget anywhere names which columns hold coordinates — there is no `latField`, `lonField` or
equivalent in `src/`. So a practitioner who imports a CSV with latitude and longitude columns
cannot make it spatial. Three widgets consume `table` and all three emit a table or decisions; the
only ways to obtain points are the data editor, the grid generator and the facility search. Two
consequences are already paid for: `case_series` builds a FeatureCollection of null geometries and
casts it `as unknown as PointCollection` to reuse the point path, and `SpatialRelation` keeps a
`MissingLocation` value that conflates "the source omitted a location" with "this has no
location". **Lifts when** a widget takes a table plus a declared binding of which columns are
longitude and latitude, with a CRS, and outputs points; `SpatialRelation` becomes three-valued;
and `case_series` consumes the table directly. This is experiment 61's problem exactly — *"the
ability to say which column means what"* — and the same role-binding mechanism 65 needs for
rulesets, so whichever lands first should be built for the other to use.

**A workflow cannot require an old widget version, because a widget version labels code and only
one version of it is in the build.** Established 2026-10-15, correcting a claim made the same day
and withdrawn within the hour. The practitioner's question: *"Isn't the widget version a
representation of the overall code version?"* It is, and that settles it.

A widget release file declares *about* code — `implementation.files` lists source paths — rather
than carrying any. One build compiles one version of each of the 53 widgets, so there is no
mechanism by which a saved workflow could run an earlier one and nothing a node could usefully
pin: a per-node version would record what the workflow was *authored* against, not what can run
it. A ruleset is the opposite, and that is the whole reason the alert was buildable there: rules
are data, every published version ships in the same build, and a node selects one at run time.

**Withdrawn:** the claim that *"a receipt's widget version describes the build that wrote the
receipt, not the code that produced the result."* False. No receipt is persisted — only the
workflow is saved, and `result` is cleared on load — so every receipt is written by the build
that ran it, about the code that ran. `fw:catalogVersion` is truthful for its run.

What is left is smaller and is a real gap: nothing records which version a workflow was authored
against, so re-opening it under a later build cannot say "this was built against map_output 0.7.0
and you are now on 0.9.0, which changed the following." That is a question about authorship
rather than about computation, and whether it is worth a field on every node is the
practitioner's call — the Inspector already says what the current version changed, which may be
enough.

**The release change vocabulary has ten values and no definition.** Measured 2026-10-15 across
147 release files: `initial` (44), `baseline` (20), `added` (13), `changed` (4), `enhancement`
(1), `feature` (1), `minor` (48), `major` (6), `patch` (10), and one entry with no `kind` at all.
Four are semver, six are prose categories, and nothing says which means a practitioner must act.
`scripts/release-notes.mjs` derives `breaking` from three signals — `kind: major`, an explicit
`breaking`, a stated `migration` — and records the vocabulary in its output rather than quietly
normalising it, because a warning derived from a vocabulary nobody has agreed will be wrong at
some point and should be readable when it is. The ruleset layer is now the stricter of the two:
`major | minor | patch`, enforced.

**Nine widgets bake in one demonstration's specifics, and two of them are already fixed.**
The kind/placement distinction behind this was corrected on 2026-10-12: there are two kinds of
widget, primitive and composite, and being example-bound is a placement problem rather than a
kind. D1 and the audit's table both said four kinds and now say two.
Found by [the widget design audit](audits/widget_audit.md) on 2026-10-09 and restated by the
practitioner on 2026-10-12: `places`, `centers`, `alert`, `facilities`, `samples`, `xpert`
(a product name — GeneXpert), `policy`, `access_policy`, `comparison_map`. `places` and
`centers` already carry `migrationFrom` adapters into `observations`, so the principle and the
mechanism are both established; seven remain. None of the nine has parity evidence and none is
pinned by a composition, so renaming them costs only the adapters — which makes them the
cheapest group to do first. The sea-level three are a separate decision: pack work is postponed
([67](experiments/67-sample-raster-at-points.md)), `slr_site_assignment` is a one-off of
nearest-neighbour-with-distance, and `slr_threshold_comparison` is genuinely domain-bound.
Scope not chosen, because "a name so general it says nothing" is a worse failure than the
present one.

**The zone guard is still a zone too wide.** Fixed 2026-10-11: the palette default is now
derived from the workflow's own data, and a disagreeing zone is reported in the Inspector with
its measured cost and a button that applies the suggestion
([100](experiments/100-choosing-the-metric-crs.md)). What remains is the guard itself —
`metric()` allows ±6° from the central meridian where a zone spans ±3°, so an off-by-one zone
still passes, costing +0.17% at London's latitude and **+0.47% at 15°N**, which is where the
Philippines is. Tightening it to ±3° is one character and would start refusing workflows that
run today, so it needs checking against the shipped examples first.

**Metres and angles are related through a constant, in nine places, with the same error.**
Audited 2026-10-12 by `npm run audit:metres`, which measures every site against a Vincenty
geodesic, in both directions. Metres into angles: `buffer_point`, `buffer_area`, `area` (circle
and box dimensions), `donut_geomask`, `samples`, `network_input`, `measure_area`. Angles into
metres, via the shared `distanceKm` haversine: `nearest`, `access`, `facilities`,
`slr_site_assignment` — the same magnitudes with the sign reversed. Three conversion methods that
look unrelated — a Turf buffer, a great circle on a mean radius, a flat 111,195 m per degree —
give the **same** answer to two decimals, because they are one approximation written three
ways. The error is directional and latitude-dependent: **−0.56% to +0.11% at the equator**,
−0.49% to +0.13% at Manila, 0.06% to 0.32% at Soho. So it is worst in the tropics, which is
where this project is aimed: a 500 m buffer in Manila is 497.6 m north–south and 500.7 m
east–west, and a 5 km scope spans 31 m. The two directions differ in consequence: a reported
distance that is 0.5% out is a reporting error, while `facilities` uses a radius as a
**membership** test, where a facility on the boundary can fall either side. Nothing is
corrected, because correcting it changes every one of those outputs and means re-pinning the
Lab's parity for the buffer widgets and everything downstream. Record: [101](experiments/101-metres-into-angles.md).

**Numeric Inspector fields revert visually after a change.**
The model updates and the field does not. Affects every numeric parameter, not
one panel; measured on `mean-center-zone`, which predates the micro-workflow
work. Recorded in [92](experiments/92-micro-workflow-on-the-canvas.md).

**A desktop build now has a settled rationale and no plan.**
Three reasons converge on it: acquisition no browser will permit
([69](experiments/69-healthsites-acquisition.md)), STAC assets behind CORS or
authentication ([91](experiments/91-stac-browser-integration.md)), and a
durable learning record, which as of 2026-10-11 is where learning belongs at all
([desktop and browser for learning](research/desktop-and-browser-for-learning.md)).
Nothing is scheduled, nothing is designed, and the WebKit gate below comes
first. Recorded so that "the desktop app will do it" stops being a way of
agreeing with an idea without doing it.

**The widget audit covers 39 of 51 widgets.** It ran on 2026-10-09 and twelve widgets have
been added since without going through D1 in that table: `buffer_point`, `fill_interior_gaps`,
`find_health_facilities`, `micro_workflow`, `reachable_corridor`, `reachable_nodes`,
`sample_raster`, `snap_to_network`, `stack_polygons`, `summarize_combined_area`,
`summarize_hull`, `travel_time_band`. Each had an admission review at the time, which states a
kind, so the gap is in the audit's counts rather than in the record — but the counts should not
be read as current. Noted 2026-10-12 while restructuring the table.

**The Validation Lab had no execution gate.** Fixed 2026-10-11:
`scripts/run_notebooks.py` executes every notebook and fails on any error cell,
and the Pages workflow runs it before building the site, so a broken notebook
blocks publishing. CPython only; the browser kernel is still unchecked, which is
the remaining half of item 1.

An earlier version of this entry said `_output` was "a committed artifact that
nothing checks". That was wrong — it is gitignored, and CI builds the site fresh
from `content/` on every push, so the published site was never stale. What was
three notebooks behind was a local build directory, which matters to nobody.

**A source should be able to declare the CRS of its output port.** Proposed
2026-10-13, from the pandas/geopandas analogy the project already follows: a
`GeoDataFrame` carries its CRS and `to_crs` is a method on it, so acquiring data
in UTM and wanting it in WGS84 is one call, not two objects. Today `reproject`
is the second node, and it is filed under Sources because it imports its own
data — which is why the naming ratchet flags it twice
(`widgets/naming.json`). Giving each geospatial source an output-CRS knob saves
that step for the common case.

The knob is honest by the test experiment 107 derived — the contract does not
move with it. The output port type stays `points`; what changes is the
`spatialReference` travelling on the value. That is the precedent `nearest`
already set with its distance unit: *the unit travels on the output, because a
distance without its unit is not interpretable*. Coordinates without their CRS
are not interpretable either, and `SpatialReference` is currently frozen to
WGS84/EPSG:4326 in `src/types.ts`, so this makes a field that pretends to be
constant actually vary — which `checkRange` and the UTM advice already assume it
does.

`reproject` is still needed, and not as a leftover: a practitioner may want a
mid-workflow translation, or two versions of the same data in different CRSs
side by side, which a knob on the source cannot express because it has only one
output. So this is a split, not a replacement — the source gains a knob and
`reproject` becomes a true `points → points` transform under Spatial
operations. Renaming it is a migration under the
[experiment 18](experiments/18-shared-input-standardization.md) adapter, and the
two naming entries say so.

### Found 2026-11-02, Nigeria report

- An input widget has no form to declare its source, so `derived` notes and automatic References need `provenance` written into the file. South London's was. Nigeria's works are authored notes.
- Machined notes on a map are one caption sentence. The report's findings are authored; nothing machines a sum of zero-dose children over years.
- Interactive map names no places, because labels need fonts from a server.
- Import tiles: confirm an import in WebKit against the real archive, and the map offline afterwards.

### Found 2026-11-03, building NYC

- **A wide file is slow to set up.** NYC's daily table has about 100 columns, mostly ready-made lags, all ticked as keys by default, and each untick rebuilds the preview of 3,653 rows: seconds a column. A "select none" for key columns, or a preview of the first rows only, would fix it.
- **Picking many values in Select rows was not frictionless** (practitioner, 2026-11-03). Done: a range of dates or numbers, and search over a long list. Experiment 171, lab check 32.
- **Worked example charts were left raw** (practitioner, 2026-11-03: *"That's the reason it's called a "worked" example."*). NYC's chart finished; `tests/worked-example-charts-are-finished.test.mjs` requires every pinned example's chart to carry its own title. Axis labels wait for column metadata. Nigeria's six maps and Oswego's map have no subtitle or source note; not written here, because captions are the practitioner's.
