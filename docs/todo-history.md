# TODO, finished and declined

_Created 2026-11-19 · Updated 2026-11-27_

This file holds the work moved out of [TODO.md](../TODO.md) on 2026-11-19 because it was done or decided against.
Each item is word for word as it stood there, under the section it stood in, oldest first within each section.
Links are adjusted to work from this folder; nothing else is changed.

## The order of work, as the practitioner set it (2026-11-08)

1. **Done 2026-11-08 (Table input 0.7.0).** ~~**Table input on the standard Inspector and dialog**~~ ([186](experiments/186-one-standard-inspector.md)). With
   it, *Fetch the table*: in the dark theme it sits inline in the orange notice and does not read as a button.

2. **Done 2026-11-08 (0.59.0).** ~~The built-in rulesets example moves to example-workflows-rulesets~~, then is removed: rules all of one category
   (run by the reasoner), rules over points with a map, and counts written as text repaired in Data quality. The seven
   tests that open it move with it. **The built-in coverage exercise is removed**; its four points stay as a test
   fixture, and Keep points inside the area is recorded as having no worked example.

5. **Done 2026-11-09 (0.68.0): Manila coastal exposure moved to example-2026-sea-level-rise-philippines**, the built-in
   one removed, and the example now reports the rise at each facility's gauge
   ([195](experiments/195-the-sea-level-example-reports-a-sea-level.md)). The terrain note is in its README.
   **Images in Notes: done 2026-11-09 (0.69.0, [196](experiments/196-a-picture-in-a-note.md)).** As asked: (the practitioner, 2026-11-08): an authored note can carry an image, kept by
   its digest, with required alt text and a caption, shown on the Notes board and in the write-up; an SVG is shown as
   an image, never inlined. Its first use is the datum diagram, docs/images/vertical-datums.svg, as a note of the
   example.

13. **Colour by generation, in the transmission tree and on the map's lines** (built 2026-11-10, 0.79.0: one magma ramp,
   each step at least 3:1; shape now says what a case is) (the practitioner, 2026-11-10: *"One
   thing we can do for the transmission chain is to color key the generation both in the tree and the map links."*).
   One ordered ramp, one key, shared by Chart's tree and Map's lines between records, so generation 3 is the same colour
   in both; an ordered ramp because generations have an order. To settle: the generation of a line is its case's; a
   case whose chain has no root drawn keeps the tree's own marking; how many steps before the ramp stops being
   readable (Hagelloch runs to 6).

22. **QR codes from a product to its digital form** (first use built 2026-11-10, 0.80.0; lab check 47) ([203](experiments/203-qr-codes-from-a-product-to-its-digital-form.md)):
   first, a note for a worked example with two codes, Fieldwork with the example opened and the example's repository at
   its pinned commit; needs `?example=` to open a repository example through the catalog. Ask before installing an
   encoder.

6. **Done 2026-11-11, differently: Old Naledi retired** (the practitioner: *"What we will do instead is retire old
   Naledi as an example along with its bespoke widgets"*; docs/audits/old-naledi-audit.md, with the heat example, four
   rulesets, Travel time and decisions). As first planned: **Old Naledi**: `facilities` and `facility_audit` replaced by standard widgets (Keep points inside the area; Apply
   ruleset and Table output), checked to give the same results, then moved to a repository.
   **Keep points inside the area is decided here** (the practitioner, 2026-11-08, asking whether it can be retired): if
   neither this nor Sierra Leone uses it, it is retired, and the Check spatial coverage migration that leads to it
   becomes a refusal by name.

**The order from here, as the practitioner set it on 2026-11-13:** *"After that let's finish MERS. Then table edit #12.
Then Sierra Leone. Then ABM spike."* So 8, then 12, then 3, then 29. The numbering below is kept as written.

9. **Done 2026-11-13, checked against what is built** (the practitioner: *"I think #9 is finished. You can check."*): the transmission tree in Chart, each case at its date joined to its infector, in Hagelloch's built-in *Who infected whom*; lab checks 43, 44 and 45. ~~**Who infected whom, on Hagelloch: operational epidemiology's first slice to build**~~ ([200](experiments/200-operational-epidemiology.md);
   the practitioner, 2026-11-09: *"Should we proceed first with contact tracing in Hagelloch"*, and *"After DTU"*).
   Before MERS (8), whose data terms are open. In order: Relate the cases to themselves on `infector` (check a table
   may be related to itself); **days between two dates** in Apply ruleset (a `date` kind; `minus` of two dates gives
   days) for the serial interval; Total within groups for secondary cases per case (built 2026-11-09: counted, related
   back, and the 126 children nobody names kept as 0, a number the practitioner types); **a links layer on Map** (built
   2026-11-10 in Map 0.22.0: 94 lines drawn, 90 links inside one house counted, not drawn); **a transmission tree over time in Chart** (each case at its onset,
   joined to its infector). No chart or map draws a network today. Each by hand on an empty canvas, each widget to
   the standard Inspector, with its manual page and lab notebook.

**Added 2026-11-14:** build the map inset and the Locator ([Map's manual, History](widgets/map_output.md#history)) (MERS
hospitals, Oswego) (**done 0.119.0 and 0.120.0**: MERS's inset over Pyeongtaek, Oswego's locator in New York State);
and revisit Oswego, one of the first examples (the practitioner: *"It has very few workflows, and
being one of the first examples, we can probably revisit this to enhance"*), with four workflows chosen that day: the
epidemic curve by hour of onset, the incubation period in hours from the meal (needs hours between two date-times in
Apply ruleset), attack rates by age band and sex, and vanilla ice cream as its own two-by-two with the ill who did not
eat it listed. Found 2026-11-15, before building: the line list writes onset as `4/19` and `12:30 AM` and the meal as
`8:00 PM`, no year and no ISO form; Cases by period has no hour; Apply ruleset subtracts days, not hours. **A widget
gap, closed in 0.120.0** (the practitioner, 2026-11-15: *"Date time arithmetic is important"*), and the four Oswego
workflows built on it: Apply ruleset writes a
date and time from a date column in a declared form, a year given as a setting and a time column on a declared clock,
never guessing a value that does not fit; a difference of two date-times names its unit, days, hours or minutes; Cases
by period gains an hour.

**Added 2026-11-14:** revisit Salmonella the same way (the practitioner: *"Same with Salmonella example, we need to
revisit"*), with four workflows chosen that day: who the cases were (age group and sex beside the classical controls),
every food ranked in one two-by-two, where they shopped (organic shop, organic produce, market), and cases by federal
state mapped over Germany's 16 Länder. The file has no onset dates, so no epidemic curve.
**Built 2026-11-15** (0.121.0), with three departures, each found in the file. (1) **Where they shopped is counted, not
compared**: `bioladen` and `markt` were filled in for cases only, and `bio` joins two questions (an organic shop for
cases, organic food for controls), which would show 23 of 30 cases never against 0 of 108 controls; the practitioner
chose cases only. (2) **Every food is not ranked**: the Two-by-two keeps exposures in the order chosen, by design
([161](experiments/161-the-epi-kernel-one-table-many-exposures.md)), so the 34 items are in the questionnaire's
order. (3) **`bula`, `kreis`, `bioladen` and `markt` are not in the codebook**; `bula` is read as the official state
code because `kreis` begins with it in all 110 classical controls. Found on the way and fixed: the map's key printed an
empty "0.00 to 0.00" class when edges tied (Map 0.31.4), and Total within groups refused to hand on a column when
every row was its own group (0.5.0).

**2026-11-15: Hagelloch's replay in Notes is a chart, not six maps.** Six static panels were built and withdrawn before
release ([Map's manual, History](widgets/map_output.md#history)): the maps repeated their captions, and
the two flags are what 78 unadjusted daily looks give by chance. The practitioner chose each evening's p-value with the
0.05 line, beside the cases known. With it, the 1824 cadastral sheet under *Clusters over the village* (the practitioner,
the same day: "Yes, the 1824 sheet").

**Next, in this order, set 2026-11-15:** (1) the Notes maps below; (2) **the draft document configurable**
([202](experiments/202-one-record-several-products.md), dated section; the practitioner: *"I would do this before ABM
spike"*, and *"The above can partly close the render experiment"*): notes' text and images resizable, so figures sit side
by side or inserted beside text as in Word; the draft shown as the publication looks; one example each of a publication,
a surveillance report and a sit rep, and then **formats as mappings onto section roles**, so the presentation format is
flexible (202, dated section of the same day: the practitioner, *"perhaps we can do interformat mapping"*), designed
from the check of open sit rep and surveillance report templates; (3) **the twelve model gaps found 2026-11-15** ([202](experiments/202-one-record-several-products.md), *Gaps
in the model*): an outline per product first (gap 7), then narrative paragraphs citing their evidence (1), short forms
of step notes (3) and authored captions (9), designed from a real model paper, the South London publication written
first as a mock-up; (4) the ABM spike.

**Done 2026-11-15 (Map 0.33.2):** compared on Salmonella, South London and MERS, the Notes figure had lost the key's line
under a shaded map's ramp and listed its classes again in two loose columns; both fixed in the figure Notes and the SVG
download share. **Found 2026-11-14:** each static map in Results is more complete and professional than the same map in
Notes (the practitioner: "still needs improvement"); compare the two renderers and make Notes draw what Results draws.
**Done 2026-11-15 (0.125.1):** NYC's diagram of how ground-station and satellite measurements relate, as an authored
note in the Introduction (the practitioner's request, same day).

## Urgent

**AR6 as a ruleset — and this was settled on 2026-10-15, not today.**
[115](experiments/115-decomposing-the-projection-extract.md) reads `slr_extract_import`
operation by operation, finds that **none of its five operations is about sea level** — four
are assertions about a table and one is a derivation over a column — and records the
practitioner's decisions the same day: P1, the contract is the ruleset's own declaration via
`inputContract.expects`, so no new widget and no ruleset power to stop a run; P2, provenance is
an alert rather than a blocker; P3, the distinct values are a knob on the input widget. The
blocker ledger had already reached the verdict too: *"`slr_` names a pack, not an operation.
Becoming a ruleset makes that correct rather than needing a fix."* **The build has not started**,
and 115 still reads `asked`.

On 2026-10-25 the practitioner said *"AR6 as a ruleset"* and Claude re-derived the same
conclusion from the ruleset format as though it were new, which is the relitigating this
section is about. The practitioner: *"I remember the AR6 ruleset work as it was a significant
amount of time."* They were right. What follows is a field mapping that supports 115's P1 and
does not replace it; the decisions above are the ones to build.

Checked against `fieldwork/ruleset/1` on 2026-10-25, the format has a slot for every constant:

| In `src/sea-level.ts` today | Ruleset field it belongs in |
| --- | --- |
| `PROJECTION_KEYS` — the six key columns an extract must carry | `inputContract.expects`, which already lists what a fact generator requires |
| `VALUE_UNITS` metre / millimetre, with `UNIT_IRIS` holding `qudt:M` and `qudt:MilliM` | `parameters[].unit`, which is already a QUDT IRI in every shipped ruleset |
| `BASIS_KINDS` — `workflow` / `confidence-pbox` | an enumerated vocabulary, as `outputVocabulary.predicates[].values` already is |
| the vertical-land-motion family pair | `parameters`, with `meaning` carrying what each names |
| baseline period and the three obliged citations | `basis.evidence` and `basis.unresolvedCitations` |

The field that makes the case is `mustNotBeReadAs`. `src/sea-level.ts` carries this as a code
comment: *"wf_1e is one workflow, 'medium' is a p-box over several, and a p-box bound is not a
quantile of one distribution."* That is a distinction in the glossary's sense, it is the most
valuable thing the widget holds, and it is sitting where no reader of the application will ever
meet it. `mustNotBeReadAs` is the declared, versioned, citable place for exactly that sentence,
and `access-review 1.0.0` already uses it.

One adaptation to settle before the work: a ruleset today carries N3 `rules` applied by the
reasoner, and AR6's domain content is **refusals rather than inferences** — a missing key column,
an uninterpretable unit, an undeclared basis kind. Either those become N3 rules, which would make
each refusal declared and explainable rather than a `throw` in TypeScript, or the format admits a
ruleset that is a contract with no rules. The first is the more interesting answer and is what
"semantic reasoning" would mean here; neither is chosen yet.

The disposition of `widgets/packs.json`, `validate:packs`, `src/pack-catalog.ts` and
`src/catalog-ui.ts` is a separate question and is not answered here — it is governance for a
mechanism no longer used, which is a different thing from the domain knowledge it was meant to
carry.

**DONE 2026-10-24 — the refusal says what actually happened.** `change()` returns false while
`busy` without attempting a save, so `lastSaveFailure` stayed null and `saveFailureMessage` fell
through to the caller's storage sentence: "Study area could not be saved. Retry Apply.", over a
workspace holding 169 KB, where retrying would fail identically until the run ended. Fixed in
`saveFailureMessage` rather than at each caller, so every refusal routed through it gets the true
reason. Third sighting of the same family: the first swallowed a New project click in silence, the
second disabled the controls that open with the guard, and this one misdirected, which is worse.

**A table still cannot colour the boundaries it is keyed on.** study_area 0.5.0 brings polygons in
and keeps `units[i]` naming part i, so the South London example's 32 sub-districts can now reach a
canvas. Joining the 32 mortality rates to them cannot: nothing takes a table and an area and
returns the area with a value per part. That join is the choropleth, and it is the figure the
example has been arguing in prose since 2026-10-24.

**DONE 2026-10-24 — a polygon comes in through the study area.** This entry said no widget took a
polygon and that the first of its two gaps was a `polygon_input` beside `table_input`. The
practitioner settled it differently and better: *"a study area is actually a polygon input."* Of
the five port types only `polygons` lacked a source, and `polygons` is a catchment result
carrying sites and a method, so a new source emitting it would have made imported boundaries
masquerade as a computation nobody ran. study_area 0.5.0 takes a GeoJSON polygon file and holds
units that share a border. The second gap is still open and is its own entry below.

**A table cannot be joined to another table, and no widget does arithmetic on columns.** Found
2026-10-26, building South London's contingency table. The 2x2 of people by supply and outcome is
derived from two published tables -- Table XII declares each sub-district's water supply, Table
VIII gives its population and deaths -- and needs two operations the application does not have:
a **table-to-table join** on the sub-district name, and a **derived column**, survivors being
population minus deaths.

`join_table_to_area` joins a table to a BOUNDARY, which is the same matching problem against a
different second operand; nothing joins two plain tables. And nothing computes a column from
other columns at all: `rate` divides two declared measures and emits a rate, which is the only
arithmetic over columns in the application.

So the workflow carries prepared data with its provenance stated, as the other inputs do. That
is honest and it is not the same as the example demonstrating the operation -- a practitioner
with the same two published tables cannot reproduce the step in Fieldwork, which is what
[the glossary](glossary.md) says a worked example is for: the only artifact that demonstrates
composition rather than declaring it.

Neither operation is epidemiological. A join of two tables on a shared key and a column derived
from others are the two most ordinary things in tabular work, and their absence is why the one
genuinely checkable epidemiological table in this project had to be computed outside it.

### ~~A country at ADM0 can be refused, and the dialog draws nothing (found on Pages, 2026-11-05)~~

**DONE 2026-11-05, in 0.30.0.** Acquired outlines are kept in IndexedDB under `areaRef`, both budgets are removed, every
part is carried and a refusal is said in the status line. The real Uganda ADM0 applies with all 48 parts in Chromium.
Recorded in [experiment 121](experiments/121-storage-beyond-local-storage.md), "The geometry moved". As found:

The practitioner picked Uganda, ADM0, in the Study area dialog: *"nothing showed up on the dialog map."* Reproduced
outside the browser against geoBoundaries' current UGA ADM0 file (1.6 MB, one unit, a MultiPolygon of 48 parts,
43,116 vertices):

- **Refused by the extent budget.** The largest part alone is 37,760 vertices, 1,215 KB; `GEOMETRY_BYTE_BUDGET` is
  1,024 KB (`src/study-area.ts`), so `validateDrawnGeometry` throws: *"Choose a smaller area or a coarser
  administrative level."* At ADM0 there is no coarser level, so the advice leads nowhere.
- **The refusal is easy to miss.** It is written to `#area-boundary-terms`, a muted line under the unit list. The map
  has already moved to Uganda (`lookAt` moves the camera only) and draws no outline, which reads as "nothing happened".
- **A single unit keeps only its largest part.** `publishedRings` drops the other 47 parts (Lake Victoria's islands,
  among them the Ssese Islands) with the note *"one outline is what a study area holds"*. That stopped being true
  when several units became several parts of a MultiPolygon; one unit with several parts should be carried the same
  way.

Open: the 1 MB budget was set against the 5 MB localStorage quota. Node data has since moved to IndexedDB by digest;
whether a study area's geometry still lives in the workflow document, and so whether this budget still binds, is
the first thing to establish, by measuring. Until then, at minimum: draw the refused outline as a preview, say the
refusal where the practitioner is looking, and drop the "coarser level" advice at ADM0. Not yet fixed.

**Revisit the Manila sea-level example, which reports no sea level.** **Done 2026-11-09:** its second workflow
reports 1,124 mm at gauge 145 by 2100 (SSP2-4.5, with vertical land motion, middle quantile), in its own repository
([195](experiments/195-the-sea-level-example-reports-a-sea-level.md)). As raised:
_Raised 2026-10-26 by the practitioner: **"that is a useless worked example if titled sea level
rise."** Checked, and the criticism holds._ `assignSites` reads the AR6 extract **only to narrow
which gauges are usable** — `usable` is the set of sites whose `site_id` appears in the extract —
so the 288 projected values are imported, contract-checked, carried through a ruleset with three
obligatory AR6 citations, and never read. The output is facility → gauge → distance. As a
sea-level example it delivers no sea level, and its title claims the one thing it does not do.
This is the D7 overclaim failure applied to a worked example rather than to a widget.

Refusing to model inundation stays right, and the answer given on 2026-10-26
dressed the gap up as that virtue, which it is not: not claiming inundation and never computing
a projection are different omissions.

**What it should report**, and can report honestly: the projected change at each facility's
assigned gauge, with scenario, year, quantile and vertical-land-motion family named in the
output — "+X mm by 2100 under SSP2-4.5, median, with VLM". Real, uses the data it ships, and
still not an inundation model.

**What blocks it is one named limit.** The extract is keyed `site_id, scenario, basis, family,
year, quantile`; the assignment is keyed `point_id, projection_site`. Carrying the value across
is a join of two tables on a shared column, which the 0.12.0 release notes already record as
missing. Slicing the extract to one scenario, year, quantile and family is `select_rows`. The
example stops exactly where the application stops.

Until it reports a value, the note should say the projections are validated but not reported —
today it says what it will not claim and is silent about what it never computed.

**Done 2026-11-09 (0.70.0, [197](experiments/197-the-sea-level-widgets-retire.md)): both retired**, Assign
projection site into Measure distance and Relate, Compare level to elevation into a published ruleset. As raised:
**Check the two remaining sea-level widgets in the same pass**, which the practitioner has
flagged to review: `slr_site_assignment` is listed in the Duplicates row as a one-off of
nearest-neighbour-with-distance, and `slr_threshold_comparison` this file has called *"genuinely
domain-bound"*, which under the domain-agnostic direction is a question rather than a settled
exemption. Both are still classified `domain` in `widgets/classification.json`.

### ~~The Tabular data dialog stalls at 250,000 rows (found 2026-11-19)~~

**Resolved the same day (Tabular data 0.11.1, Table 0.13.1):** grouping repeated keys copied each group at every row,
and the table under the dialog drew every row (325,971 elements at 25,000 rows). A tick now takes 0.4 to 0.6 s at
250,000 rows. The note as found:

Measuring maps of many points, a 250,000-row CSV of five columns was read and previewed in 0.6 s, and then ticking
four key columns took over an hour (the test's limit): each tick redraws the dialog. Experiment 175 imported 250,000
rows with no such stall, choosing fewer keys. To measure: the time of one tick at 25,000, 100,000 and 250,000 rows.

### ~~What crashes the interactive map at 150,000 marks (found 2026-11-19)~~

**Resolved the same day (Map 0.37.0):** MapLibre's source prepared the points to zoom 18 (now 12), and its layout of an icon
per mark never finished past about 100,000. Circles are now a circle layer: 150,000 in 13 s, 250,000 in 24 s. Other
shapes stay icons to 100,000 and are circles past that, said on the map. The note as found:

Map 0.37.0 draws a large layer on the graphics card: 100,000 marks in 11 s; at 150,000 and 200,000 the tab crashed,
the first time before any mark's image was even made. `INTERACTIVE_MARKS_LIMIT` stops there and says so. First
suspect: the GeoJSON source's tiling at every zoom. Find it, then measure again.

## Deferred — decided to do later, which is not a decision to do it

### Reconstitute `xpert`

Not a blocker and not a bug to patch: `xpert` is one sound operation welded to one example at
every joint, and the disposition is to dissolve it rather than fix it. The name-keyed facility
match **was** a defect and is fixed (id-keyed, with two tests), but that is interim protection
for the current shape, not the destination.

What reconstitution means, from [65](experiments/65-ruleset-as-data.md) and the bottom-up
derivation below:

- The operation is **rule application with a declared ruleset** — the general primitive. There
  is no `xpert` afterwards, only that widget plus a ruleset named for what it is.
- The NB06 hierarchy becomes a **declared ruleset**: its seven rules, its citations (Baik 2019,
  Mokomane 2024, Dickinson 2017 — from source notebook `06-Gaborone-Health-Facilities.ipynb`,
  not a published standard), and its declared output vocabulary of four evidence levels and
  four service categories.
- The named-evidence claims become **an attribute on the facility records**, bound to a declared
  role. The interim `NB06_NAMED_EVIDENCE` table in `src/old-naledi.ts` disappears with them.
- Input becomes the general features carrier with declared roles — ownership, facility kind,
  named-evidence status — replacing the private `facilities` port.
- Output becomes the general `decisions` carrier with the ruleset's declared vocabulary, which
  **retires `gradedFacilities`**, one of the six producer-named port types.
- Zero parameters becomes the ruleset's own declared knobs, bound per
  [66](experiments/66-ports-as-schema-binding.md).

This needs the typed field schema that [61](experiments/61-input-dimensions.md),
[65](experiments/65-ruleset-as-data.md) and
[66](experiments/66-ports-as-schema-binding.md) all converge on, so it follows that work
rather than leading it.

### Seven widgets could not be added from the palette

Found 2026-10-09 by clicking Find healthsites facilities and watching nothing happen. The cause
is the one [experiment 48](experiments/48-tabular-input.md) already recorded: **an
unconfigured node must be a valid draft.** `validateWorkflow` runs on every edit, so a validator
that demands a node's full contract makes that node impossible to add — `change()` rolls the
workflow back, and the canvas appears to ignore the click.

**Fixed:** `healthsites_discovery`, `buffer_point` and `sample_raster`, all added this session and
all repeating the recorded mistake. Each now has draft validation — what is wrong whenever it is
present — separated from a `requireRunnable…` check called at execution.

**Also fixed:** the add handler announced "*X* added" regardless of whether the add succeeded, so a
rollback looked like success. It now returns early when `change()` reports failure, leaving the
rollback's own message visible.

**Still broken, and pre-existing:** `slr_extract_import`, `slr_threshold_comparison`, `rate` and
`case_series`. They are reachable only from a template that already contains them, which is why
nobody noticed. Two of them I made worse today by adding required parameters — `basisKind` and
`elevationReference` — to validators that already ran on every edit. Each needs the same split.

`tests/palette-add.browser.mjs` now clicks every palette entry on a blank canvas and pins that
set, so it can shrink but never grow.

### Let practitioners compose their own routine primitives

Four experiments: [78](experiments/78-trying-compositions-on-isochrone.md) is the trial, on the isochrone case, where a control exists. Three admission reviews behind it: [75](experiments/75-compositions-as-nodes.md) proposes the mechanism, [76](experiments/76-composition-governance.md) the governance, and [77](experiments/77-composition-drift-detection.md) drift detection. The notes below are what they were built from.

Proposed 2026-10-10. The project ships **core primitives**; a practitioner wires
the sequence they keep repeating and saves it as a reusable node of their own —
a routine primitive. A composite stays expandable, so opening it shows the steps.

Already specified twice and never built:

- [31](experiments/31-facility-access-primitives.md): "Common tasks may be
  presented as a reusable subworkflow with an expandable internal graph, rather
  than requiring a beginner to configure every step."
- [prior art](research/prior-art.md), on the QGIS Model Designer: "Future
  reusable subworkflows should expose a small public parameter set and retain the
  internal graph."

What is new in this proposal is **who composes**. The prior art reads as though
the project ships the subworkflows. If practitioners make them, the project can
stop guessing which composites are worth shipping — and the audit's nine example
nodes, which bake one demonstration's specifics into a palette entry, are the
case for it. Those should have been somebody's saved composition.

It also dissolves the teaching tension above without a tier scheme: one node for
whoever wants the answer, an open graph for whoever wants to learn.

### Governance is inherited, because a composition is closed over the registry

A composition may contain **only widgets in the registry**. That single rule
makes most of the governance free rather than new.

The application already enforces it. `core.ts` rejects any node whose type is not
in `TYPES`, so every workflow is already closed over the registry and a
composition built as a workflow fragment inherits the check without new code.

What that closure buys:

| Property | Where it comes from |
| --- | --- |
| Every member is versioned and digested | the widget registry |
| Every member passed the design audit | D1–D10, at admission |
| Every member emits a receipt | the execution contract |
| Every edge type-checks | `validateWorkflow` already does this |

So a composition needs no audit of its parts. What is genuinely new to govern is
small: its **name**, its **public parameter set**, and its **claim** — what it
says it does, which is where D7 applies and where a composition can mislead.

### Levels of governance, which already exist at both ends

A **widget** has a registry entry, a version, a digest, a release file and an
audit. A **pack** has a repository, a commit SHA, an admission status, named
reviews and a curated owner. A composition sits between them and can move up:

1. **Private.** Saved in one browser. Governed by nothing, which is correct —
   nobody else is relying on it.
2. **Shared.** Exported and sent to a colleague. Needs a name that does not claim
   more than it does, and the versions it was built against.
3. **Published.** In a composition repository. Pack-shaped: owner, commit, review
   state, admission.

The naming convention for compositions is the one piece with no prior art. The
widget convention governs node types the project controls. A practitioner naming
their own routine primitive is not bound by it, and should not be while the
composition is private — but a published one read as equivalent to a reviewed
widget is exactly the `xpert` problem with more authors.

### Widget use tracking

Proposed by the practitioner during the widget audit, raised again on 2026-10-10,
and not recorded until now — which is itself the kind of lapse experiment 73
describes.

`npm run usage:widgets` counts nodes across shipped examples and frozen fixtures.
It cannot see a widget a practitioner adds to a blank canvas, so a widget in daily
use and a widget nobody has ever added look identical to it. That is the evidence
missing when asking whether a widget earns its place.

What would need deciding first:

- **What is counted.** Adding a node is not using it; a node that never runs is
  not evidence. The existing vocabulary already separates these — a **widget** is
  the contract, a **node** an instance, a **workflow step** one execution — so
  the count should say which it means.
- **Where it is kept.** Workflows are in browser `localStorage` and nothing is
  sent anywhere. Any count stays local, and should be readable by the practitioner
  rather than only by the project.
- **What it must not become.** A usage count is not a quality measure. The least
  used widget may be the one that carries the hardest-won distinction, and a
  number that invites pruning by popularity would delete exactly those.

Not started.

### Proposed: a data quality widget, with an editable table

Asked for 2026-10-10. One widget that reports on the quality of whatever is connected to it —
duplicates, missing values, and the rest — and an editable table beside it where a row can be
inspected and corrected.

Why it fits now rather than being a nice extra: every input this application has gained lately
hands over data whose faults are real and currently invisible. The facility sources drop records
and count them by reason, but what survives still holds duplicate facilities under slightly
different names, missing kinds, and coordinates that are precise and wrong. A practitioner can see
the drop counts and has nothing to act on them with.

What it would need to settle first, because these are the decisions that make or break it:

- **What it reports, per carrier kind.** Duplicates mean something different for a point layer
  (same facility, two records) than for a table (repeated key tuple, which `table_input` already
  refuses). The report has to adapt to the input the way the ruleset widget was argued to in
  [65](experiments/65-ruleset-as-data.md), and that argument should be reused rather than
  redone.
- **Whether editing is an edit or a correction.** A changed value is a new claim about the world,
  and the provenance has to say who changed what and why, or the output is a dataset nobody can
  defend. The evidence and receipt machinery already exists for this; what is missing is the
  decision that an edit is recorded rather than applied silently.
- **Whether it is one widget or two.** Reporting is a check and belongs with the comparisons and
  checks group; editing produces a derived layer and is an operation on data. The naming convention
  says the name states the operation, and "data quality" names a category, not an operation — the
  same defect the audit found in `policy` and `access`. Likely `check_data_quality` plus
  `correct_records`, or a single `review_records` if the two cannot usefully be separated.
- **Where the editable table lives.** There is already a table editor for `table_input` and a pushpin
  editor for points; a third editing surface would be the third place the same decisions about
  validation and attribute schemas could drift apart.

Not started. Recorded in full because the question "what should it report" is the design, and
answering it in passing while building something else is how a category noun becomes a widget.

## Known and recorded, not yet scheduled

**The South London example carries no workflow bundle.** The widget gap is closed — `rate` reads
the five rows directly — so what remains is the workflow document, its export into the example
repository and the digest re-pin. The example is pinned at a commit that carries data and
provenance only.

**The documented gate is Chromium only, and so is CI.** ~~Done 2026-10-13.~~ The default in
`playwright.config.mjs` is now `chromium,webkit` and the Pages workflow installs both. It was
changed after measuring that all 102 browser checks pass under WebKit unmodified, so the gate
began at parity rather than with exemptions. This was the precondition
[70](experiments/70-webkit-parity.md) set for any desktop packaging decision, raised again when
the practitioner asked whether the application could be compiled to Tauri -- which runs WKWebView
on macOS. Firefox remains opt-in.

**Nine of the ten published maps cannot show a basemap, and the tenth ships with it off.**
Raised by the practitioner on 2026-10-14: *"Our map_output layers do not even have a basemap!"*
Measured the same day — the control is rendered only when the input is `polygons` **and** the
presentation is `interactive` (`src/app.ts:94`), because tiles are Leaflet's and `interactive`
is the only presentation that mounts Leaflet. Every other map is a local SVG, which cannot hold
a tile without fetching and embedding one. So a reader of any worked example sees geometry on
blank ground. Recorded, not fixed: the basemap in use is now layer 0 in the receipt
(`fw:BasemapLayer`, `fw:layerTileProvider`) instead of a property of the specification, and
OpenTopoMap's CC-BY-SA style is credited separately from OSM's ODbL data. The two ways to close
it are not equivalent and the choice is the practitioner's — a static tile composite embedded in
the plot SVG (self-contained figure, one request per render, an embedded raster in every export)
or more maps made interactive (cheap, but an interactive view has no scale bar and exports
without its ground). Both in [the Map widget page](widget-specs/map_output.md).

**Three of six rule applications carry their rules outside a declared ruleset.** Moved here from
the blocker ledger on 2026-10-15 for the same reason. `coverage_check` holds six N3 rules in a
template literal; `facility_audit` and `slr_threshold_comparison` classify with a TypeScript
ternary and call no reasoner at all. The standardization ratchet sees none of the latter two kinds.
What makes it worth doing is not tidiness: `coverage_check`'s policy is stated in a code comment —
*"Boundary points are included by policy"* — and two of its rules map **different** relations to
the **same** decision, Outside→Review and MissingLocation→Review, so the policy collapses
outside-ness and unknown-ness where a declared ruleset would have to say which it meant. Hosting
it also needs a form extension the authored ruleset shape lacks: one of its rules concludes about
the **activity** rather than a subject, and `slr_threshold_comparison` compares field to field.
**Lifts when** all six resolve a declared ruleset with a basis and an output vocabulary including
an unknown value, with byte-identical conclusions on the frozen fixtures.

**Worked examples as repositories, starting with Snow's South London water supply study.** The
practitioner, 2026-10-20: *"We also have the potential to set up a downloadable worked example from
a repo - the water provider study by John Snow in South London"*, and *"worked examples do not have
to occupy space in the downloaded app, we can set them up as repos read from a curated manifest."*

Recorded in [experiment 127](experiments/127-examples-as-repositories.md) with the measurement and
the rule analysis. Three things are known and are the reason it is here rather than in progress:

- **The rule already permits it.** Experiment 49 records that preparation may download *resources*,
  never widget *definitions*; an example declares no node type, so `runtimeFetching: "none"` does
  not reach it. No admission rule has to change, and nobody should propose amending one.
- **The saving is 9% today.** 1.0 MB of an 11.25 MB precache is example data, 640 KB of it a single
  GraphML. The case rests on the examples not yet written — the cross-border archetype's would carry
  ten countries of boundaries, rasters and routes.
- **The cheapest first step is a read, not a build.** `examples/snow-gboh/provenance.json` pins
  `snow.zip` at a digest and its documentation names **8 datasets**, of which 2 were extracted. If
  the sub-district table is among them, the licence analysis and the NOTICE already exist. This has
  not been checked, and it needs network this environment does not have.

The example would be the first in the project to divide by a population: `rate` has zero example
uses, and it already refuses to compute without `numeratorPeriod` and `denominatorVintage`. The
geographic frame — 1851 registration sub-districts — is the piece most likely to carry
non-commercial terms, which is the GADM problem again.

**Worked examples as repositories, starting with Snow's South London water supply study.** The
practitioner, 2026-10-20: *"We also have the potential to set up a downloadable worked example from
a repo - the water provider study by John Snow in South London"*, and *"worked examples do not have
to occupy space in the downloaded app, we can set them up as repos read from a curated manifest."*

Recorded in [experiment 127](experiments/127-examples-as-repositories.md) with the measurement and
the rule analysis. Three things are known and are the reason it is here rather than in progress:

- **The rule already permits it.** Experiment 49 records that preparation may download *resources*,
  never widget *definitions*; an example declares no node type, so `runtimeFetching: "none"` does
  not reach it. No admission rule has to change, and nobody should propose amending one.
- **The saving is 9% today.** 1.0 MB of an 11.25 MB precache is example data, 640 KB of it a single
  GraphML. The case rests on the examples not yet written — the cross-border archetype's would carry
  ten countries of boundaries, rasters and routes.
- **The cheapest first step is a read, not a build.** `examples/snow-gboh/provenance.json` pins
  `snow.zip` at a digest and its documentation names **8 datasets**, of which 2 were extracted. If
  the sub-district table is among them, the licence analysis and the NOTICE already exist. This has
  not been checked, and it needs network this environment does not have.

The example would be the first in the project to divide by a population: `rate` has zero example
uses, and it already refuses to compute without `numeratorPeriod` and `denominatorVintage`. The
geographic frame — 1851 registration sub-districts — is the piece most likely to carry
non-commercial terms, which is the GADM problem again.

**A deduplication primitive, after the data says how to match.** The practitioner, 2026-10-20,
with an OpenStreetMap search and an Overture Places search on one map: *"The other primitive we
would need is a deduplication widget. For example, health facilities can be deduplicated by name
and point location. By name can be algorithmic match or exact match, but we can study the OSM and
Overture Places data sets before we decide what would work."*

The need is visible already: two sources over one study area draw the same hospital twice, and a
count of facilities is wrong by however many of those there are. What is NOT yet known is the rule,
and that is the point of recording it here rather than building it:

- **Name.** Exact match is cheap and will miss "Hôpital Général de Référence de Goma" against
  "HGR Goma". A token or edit-distance match will join things that are not the same clinic. Which
  errs where is a property of these two datasets, not of the algorithm.
- **Location.** Two records of one facility sit metres or hundreds of metres apart depending on
  whether a source digitised the building, the compound or the signpost. The threshold is a
  measurement, not a default.
- **What the study would produce:** on one real area — North Kivu is already loaded — how many
  pairs match exactly by name, how many within an edit distance, the distance distribution between
  candidate pairs, and how many are in one source only. That is the evidence a matching rule can be
  argued from.

Asked up front, because the project keeps finding the same defect: `compare_point_sets` already
pairs two point layers and `nearest-neighbour` already measures proximity. A deduplication widget
either uses those or duplicates them, and D2 should settle which before a third implementation
exists.

**One widget cannot be added from the palette as a draft: `slr_threshold_comparison`.**
It validates its full contract on every edit, so `change()` rolls back and the
canvas appears to ignore the click. Recorded in
`tests/palette-add.browser.mjs`, which fails if the set grows. Four once:
`slr_extract_import` retired on 2026-10-26, and `rate` and `case_series` were
fixed on 2026-11-06 (0.33.0) when the Brazil dengue example needed Rate
(experiment 180).

**Done 2026-11-11: Retire worked example 01 Heat outreach** (docs/audits/old-naledi-audit.md; its real-data successor is
TODO 30). The practitioner, 2026-10-17: *"we can get rid of
that example as we generate better ruleset examples. That one was for starters and has outlived
its usefulness."* It is the oldest example and the one that gave `outreach-criteria` its only
use outside the teaching example. Retiring it needs the workspace key, the example template, the
tests that load `?example=heat`, and `apply_ruleset`'s evidence rung all checked — the widget
loses an example use and may drop a rung.

## Done

**The lab check coverage ratchet exists, and thirteen of the 26 are done.** Done
2026-10-11. The classification could not be derived — `implementation.definition` names
`src/core.ts#TYPES` for 39 of 51 widgets, so the registry does not record where most
widgets are implemented — so it is declared and reviewed instead, and the validator
enforces completeness and the ratchet rather than the judgement. Verified by breaking it
four ways. Thirteen widgets now have checks, all agreeing. Three recompute the
John Snow Voronoi example, which is independently verified end to end, and the four primitives
of the isochrone decomposition are now all checked. (An earlier version of this entry said
`isochrone` could therefore be compared against its own decomposition. That is wrong and
[41](experiments/41-validation-lab.md) forbids it — both sides would be Fieldwork. What is
cheaper is that the reference code in checks 07 and 08 composes into a reference for the
monolith.) Three checks failed on their first run and in every case the
criterion was wrong, not the widget — most instructively `22-case-series`, whose own docstring
named the week as the dangerous rule before the code got that rule wrong. Awaiting fell
26 → 13.

**Notebook CI is complete, in both environments.** Done 2026-10-11.
`scripts/run_notebooks.py` executes every notebook under CPython -- 20 of them as of
2026-10-11, in 14 s -- and
`node/check_09_notebooks_browser.mjs` executes them in the browser kernel in
58 s; both fail on any error cell and **both block publication**. The browser
half was the open item, blocked on `02-clip-vs-rasterio` not completing in
twelve minutes. Cause: requesting `pyproj` alongside `rasterio` makes
`rasterio.open` kill the kernel outright, and a fatal kernel error produces no
error cell, so the runner waited for an execution count that could never arrive.
Each notebook now requests what it imports, and the runner races cell completion
against kernel death. Record: [97](experiments/97-the-browser-kernel-gate.md).

Two things that followed and are **not** resolved: the Pyodide distribution is
loaded from a CDN pinned by nothing in the lab, so an upgrade would be found out
by the gate failing; and the crash is an unexplained upstream defect with a
two-package reproduction that has not been filed.

**The experiment document is standardised.** Done 2026-10-11:
[docs/experiments/README.md](experiments/README.md) states the form,
`validate:experiments` gates the two parts a machine can honestly read, and it
runs inside `npm run check` and so in CI. The five questions are deliberately
**not** enforced — they are a reading test, and a validator demanding
`## What happened` would have produced 96 conforming documents and no better
reading. 9 of 96 conform; 87 are recorded in
[standard-debt.json](experiments/standard-debt.json) and the list only shrinks.
Record: [96](experiments/96-the-experiment-document.md).

The new **what changed our minds** element is in place on four documents and
counted in every run. It is not required, because not every document had its
mind changed; it is counted so that it does not quietly become a rule nobody
follows. If the count sits still for a month, that is the finding.

**Old Naledi is an incomplete example that was never revisited**, and a slice of the Gaborone TB
ABM notebooks is the way to raise it. The practitioner's point, 2026-10-12. Not scheduled.

Measured the same day, per worked example, from `widgets/evidence.json`:

| Example | Widgets | Lab-checked | Check owed |
| --- | --- | --- | --- |
| snow-voronoi, snow-geoprivacy, snow-epidemic-curve | 10 each | **4** each | 0 |
| snow-isochrone | 12 | **4** | 1 (`isochrone`) |
| **old-naledi** | 10 | **1** | 3 — `access`, `facilities`, `samples` |
| sea-level | 8 | **0** | 3 |
| heat | 6 | 1 | 1 |

So the claim holds and is sharper than "incomplete". The four snow examples carry four
independently checked widgets each; Old Naledi carries one of ten. Sea-level is weaker still and
its weakness is **owned** — all pack work is deliberately postponed and the record says so. Old
Naledi's was not owned by anything until now.

Three things follow, and the first is a correction to today's own work:

- **It was being used as an oracle.** The blocker `ruleset-as-declared-data` named "every frozen
  fixture and Old Naledi classification replays identically" as its liftTest, and that test passed,
  and the lift is recorded. But an incomplete example's frozen expectations are weaker evidence
  than that liftTest implied. The merge is not thereby wrong — 356 unit and 97 browser tests pass,
  and check 23 verifies the rulesets exhaustively and independently — but the Old Naledi half of
  that argument should be read for what it is.
- **It is where the example-bound widgets live.** Of the widgets still declaring themselves
  example-specific, `access`, `facilities` and `alert` are Old Naledi's or the heat demo's, and
  `facility_audit` is Old Naledi's presentation widget with a decision rule hidden in a ternary.
  An example nobody revisited is where widgets accumulate that nobody generalised.
- **A real slice beats a synthetic one.** Its sample locations are a generated grid with
  Old Naledi's spacing, and `NB06_NAMED_EVIDENCE` carries two facilities keyed by registry id
  after a name-string match was found and fixed. A slice from the Gaborone TB ABM notebooks would
  replace generated demonstration points with real structure, which is also what would let
  `samples`, `access` and `facilities` be checked against something.

What would settle the size of the slice: the smallest one that exercises the same four stages the
example claims to teach — a boundary, a facility registry, an access proxy, and a classification
with its basis — without needing a widget that does not exist.

**The ruleset widget stopped being pinned.** Done 2026-10-15, in two halves on the
practitioner's reports. First *"this is not the design we discussed, the rules are pinned not
very flexible"*: experiment [106](experiments/106-rule-builder-ui.md) had specified the authored
form on 2026-10-12 and none of it was built, so a practitioner met a dropdown of four bundled
rulesets whose text was fixed. The compiler and B1 followed — all three shipped rulesets rebuilt
in the authored form reach identical conclusions under the real engine. Then *"I see the ruleset
widget but it's not editable"*, and *"perhaps the rule editor should be a modal dialog so there
is enough space"*: `src/rule-editor.ts`. **Still open:** two comparators are offered that have
never been executed against the real engine (B2), and conclusions are free text, so two rules
can disagree and only a run catches it.

**A measurement states its unit.** Done 2026-10-15. Numeric fields and settings declare a QUDT
unit, a comparison whose sides disagree is refused by name rather than converted, and the check
runs while a rule is written as well as when it runs. What no rule can catch — a bare literal
takes the field's unit — is met by showing that unit beside the box. Closes A7, the second of
106's three debts; the example and its tests exercise all three.

**A map has layers, not modes.** Done 2026-10-15, a day after the direction was settled and
written into the docs without the code changing — which is what
[docs/directions.json](directions.json) now exists to catch. Every layer port is always
declared, the renderer is read from the connections, and the node carries the layers it draws
plus one configurable port. Basemaps became reachable on every map as a consequence: the
interactive renderer had required polygons, which is why nine of the ten shipped maps could not
have one.

**A practitioner is told when the version they are running is not the current one**, and a stale
cached build can be cleared without developer tools. Done 2026-10-15. The service worker served
a cached build forever and the page could not say so; navigations are network-first with a cache
fallback, the header names a cached version, and `?reset-cache=1` clears it from an embedded
browser. Ruleset versions declare what they changed and whether moving is a drop-in.

**The manual is for the person using the widget.** Done 2026-10-15. Four pages rewritten to one
shape — what kind of widget, what it does, what to connect, how to use it, which examples
exercise it, what it will not do — with the design records moved to `docs/widget-specs/` and the
split enforced from both sides.

**A practitioner is now told when the version they are running is not the current one.**
Done 2026-10-15, on the practitioner's instruction of 2026-10-14: *"We should not offer up old
widget versions in the palette, only updated versions. When new versions appear, and a workflow
is run that requires an old version, we have to alert the user that there is a newer version. The
widget manual should explain what was changed in the current version, and to warn of deprecated
or incompatible functionality."* The palette half shipped that day. The other two halves shipped
now, and both were **available in the data already and read by nothing**: widget releases have
carried `changes` since the registry existed — 148 descriptions across 147 release files — and
the ruleset layer has carried them since 2026-10-12. Computed, published, and inert, for the
sixth and seventh time.

What is built:

- **A superseded ruleset pin says so, in the Inspector and at the run.** `supersession()` reads
  the change notes of every version between the pin and the newest, so a pin two versions behind
  is told about both, and styles the notice as a danger when any of them declares an
  incompatibility — because then the choice is not "update when convenient" but "rewire or stay".
  The run names every superseded pin it just used, since that is the moment a result is produced
  by rules the practitioner may not know are superseded.
- **Every newer version now declares what it changed and what moving costs.** `incompatibility`
  and `deprecates` are typed and required: `scripts/validate-rulesets.mjs` fails a version that
  supersedes another and declares no changes, and fails a version that moves a port and states no
  incompatibility. Verified by removing one and watching the gate fail.
- **The Inspector says what the offered version of a widget changed**, folded for an ordinary
  release and open for a breaking one, from `widgets/release-notes.json` — generated by
  `scripts/release-notes.mjs` from each widget's current release, checked by
  `npm run validate:release-notes`. All 53 current releases say what they changed; 4 are breaking.

Two findings fell out of doing it, both recorded above under what is not scheduled: a widget
version labels code that only ships one version at a time, which is why the alert is a ruleset
mechanism and not a widget one, and the release change vocabulary has ten values.

**DONE 2026-10-25 — a static figure carries its own ground.** A raster basemap is fetched
once and baked into the figure as `data:` URIs, cached in the payload store so a later visit
redraws it offline, and credited in the figure because ODbL attaches to the copy. Each tile is
placed by its own corners, since tiles are Web Mercator and this plot is equirectangular.
[Experiment 137](experiments/137-a-static-figure-can-carry-its-ground.md). **Written without
reading the prior art, which is the finding worth keeping**: [52](experiments/52-cacheable-basemaps.md)
had already concluded "PMTiles for interactive navigation, Natural Earth for static figures" and
measured 215 kB for Natural Earth context, and [53](experiments/53-reproducible-maps.md) had
already recorded that a live tile basemap cannot be reproduced at all. **Still open:** reconcile
137 with 49, 51, 52 and 53; Natural Earth for static figures is the recorded answer and is
unbuilt; the OpenFreeMap styles are vector and still cannot be baked.

**DONE 2026-10-25 — the figure defects the practitioner found by looking at figures.** A raster
was a mode that threw away every other wired layer; `oldMap` and the isochrone plot each drew
colours and marks their own keys contradicted; the orphan prune discarded any output whose node
id ended `-map` or `-table`, which would have thrown away the whole geoprivacy run on any node
delete; `deleteWorkflow` asked whether a key had a slash rather than whether the application
ships the example; the Hagelloch curve drew 87 overlapping labels under an axis titled
"Category", sourced to a run UUID. Each is in its own commit with what it does not establish.

**DONE 2026-10-25 — Snow's own map, and mark size as a setting.** Both John Snow workspaces drew
a catchment map and neither drew the figure the outbreak is remembered for. Mark radius is now
per layer, because eight pumps across a parish and 250 addresses in four streets are one figure
and no single default serves both.

**DONE 2026-10-25 — the interface stopped assuming a travel mode.** Six runtime messages said
"the walk" whatever mode was declared, including the note that travels into a published figure.

**DONE 2026-10-25 — gates run in a worktree.** `scripts/gate.sh` gates a commit in
`../fieldwork-gate` on port 4184, so the main tree stays usable for the 25 minutes and what is
validated is what would be pushed. [CONTRIBUTING.md](../CONTRIBUTING.md) carries the pipeline and
the merge policy for human developers; AGENTS.md carries the same for agents.

**DONE 2026-11-28 — an edit applied during a run is no longer dropped** (0.204.7). Found 2026-11-27 fixing PR 10's
review: Table's Presentation, set while Snow's geoprivacy example ran its first pass, was lost in 2 of 3 tries. The
dialog already said the workflow was running (since 0.171.0) but did not apply when the run was done. The practitioner
chose to keep the dialog open and say to wait; Apply now waits for the run and then applies, and Cancel while it waits
applies nothing. `tests/config-apply-during-run.browser.mjs`.

**DONE 2026-11-28 — widgets added from the library land clear of one another** (0.205.0). Found 2026-11-27 writing the
blank-port test: three added in a row overlapped, each placed 80 px from the last. `freeSpot` in `src/layout.ts` places a
new widget where it touches no node as drawn. `tests/added-widgets-clear.browser.mjs`. The notice that covered the third
one's port was not looked at separately.

**DONE 2026-11-28 — the write-up's and the export's tables to the table standard** (0.205.0, Table 0.16.0), with the
standard's open items: decimal places, unit and note per column, small counts hidden, a count and its percentage in one
cell.
