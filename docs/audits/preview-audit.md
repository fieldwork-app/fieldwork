# Audit — what a Configure dialog's Preview shows

_Created 2026-11-25 · Updated 2026-11-27_

The practitioner, opening one Configure dialog after another in the John Snow example: *"for this voronoi catchment
dialog there is no preview"*, then the same of Clip polygons, Summarize points to polygons, Move points in a donut,
Aggregate points to H3 cells, Mean center, Convex hull and Cases by period — and then the generalisation:
*"Practically all widgets used in Snow built in have similar problems."* Asked to settle it: *"Yes review the widgets
for empty Preview sections."*

The evidence is the 43 `openConfigDialog` calls in the source on 2026-11-24, each read for whether its `preview`
expression can reach the step's records at all. Nothing was run to produce it.

## Why this needed reading rather than grepping

Twice I reported "that is the whole set" from a pattern match for `preview:SHOW_ME`, and twice the practitioner found
another. The reason is that an empty Preview is not the only kind that shows nothing. Cases by period has a Preview
that reads *"Counts cases by day of the week of date_of_prodrome, a date of onset, one case per record"* — a fluent
sentence that never touches a record. It is invisible to a search for the empty ones, and it is the kind most likely
to survive, because it looks like a preview.

## The four kinds

| Kind | Shows the step's own data? |
| --- | --- |
| The rows, before and after | yes |
| A number computed from the input | yes |
| A sentence restating the settings | **no** |
| Only "Show me how it works" | **no** |

## Shows nothing of this workflow's data (7 of 43, was 14)

**Only the walkthrough.** None, as of 2026-11-25. All five that were in this list -- Move points in a donut and
Aggregate points to H3 cells (2026-11-24), then Convex hull, Voronoi catchments and Mean center (0.196.0) -- now run
the step's own function on the points actually connected. What remains below is the harder kind: a Preview that
cannot show data because the function behind it never receives any.

**Four of these were built out on 2026-11-25** — Cases by period, Measure distance, Regression and the space-time
scan — each now counting from the records connected. What they have in common is that their records are reachable
while the dialog is drawing: a table on a node, or a point layer that holds its points.

**Five of the seven left are held by the same thing, and it is not the dialogs.** Network isochrone, Reachable
junctions, Clip raster, Sample a raster and Travel time over ground all read data kept OUTSIDE the page — a downloaded
street network or a raster, stored by reference and read when the workflow runs. A dialog builds its Preview
synchronously, so none of them can reach their data at all. Measured on the Snow isochrone example, whose network node
carries no `data` and only a `dataRef`. Making these count needs `openConfigDialog` to accept a Preview that resolves
later and redraws, which is a change to the component every dialog uses; not attempted here.

**Reachable junctions is counted here although it improved** on 2026-11-25: it now says exactly what it is waiting
for, and no longer asks for a street network that is already connected. That is a correction, not a count — it still
shows nothing of this workflow's data, so it stays on this list until the network can be read.

**The other two were never classified, and both are reachable now.** Table output has its table or its points on a
port, and Point data has its points on the node itself — neither waits on anything held outside the page. Their
Previews describe the FORMAT rather than the data: *"Rows are shown as imported, an absent value as unknown"*, and
*"One point per row, in WGS 84 degrees"*. The same sentence appears over three rows and three hundred thousand, and
over a layer whose coordinates are all missing. They are the next two to build, and they need no new machinery.

**A sentence restating the settings.** Each of these builds its Preview from the node's params alone — the functions
take a `WorkflowNode` or a params object and no records, so no wiring could make them show data:

| Step | Its Preview was | Now |
| --- | --- | --- |
| Cases by period | `seriesSentence(draft)` | counts, 0.9.0 |
| Measure distance | `distanceSentence(node)` | counts, 0.7.0 |
| Regression | `regressionPlan(draft)` | counts, 0.7.0 |
| Space-time scan | `scanSettingsSentence(draft)` | counts, 0.7.0 |
| Reachable junctions | `minutes × speed` | says what it waits for, 0.7.0; still no data |
| Network isochrone | `minutes × speed` | unchanged — data held outside the page |
| Clip raster | `clipSentence(node)` | unchanged — data held outside the page |
| Sample a raster | `sampleSentence(node)` | unchanged — data held outside the page |
| Travel time over ground | `travelSentence(node)` | unchanged — data held outside the page |
| Table output | a fixed sentence per mode | unchanged — reachable, not yet built |
| Point data | a fixed description of the format | unchanged — reachable, not yet built |

Network isochrone deserves its own line: *"The longest time goes up to 1.13 km along the streets at 75 metres a
minute"* is derived, not quoted, which is why it reads like a preview. It still says nothing about the streets
connected to the step, and the practitioner's objection to the walkthrough beside it was that a street network is
used point to point, which this does not show either.

## Had a real preview that could not reach its data (2, both resolved in 0.196.0)

Clip polygons and Summarize points to polygons compute what they would make — *"N of M polygons kept"* — but
`polygonsOn` looks only at a stored layer or at the last run's output while the run is current. A polygon layer a
step COMPUTED upstream, which is the ordinary case in Snow, was in neither place, so both fell back to *"The polygon
layer arrives when the workflow runs."* The run already remembered such layers in `result.computed`, keyed by node;
`pointChoices` read it and these did not.

`polygonsOn` now reads it too, as a third and last source -- a stored layer and a current run still win, because
those carry the whole layer where this carries its shapes. Gated on the run still matching the workflow, like the
lookup beside it: without that, editing a step above left the preview describing the input of a run that no longer
applied, which is how it was first written and what an outside review caught the same day.

## Shows the data (the rest)

Append rows, Join a table to the study area, Detect unusual counts, Line layer, Relate, Select rows, Total within
groups, Transmission chains, Rate with a denominator, Area around a point, Measure area, Keep points inside the area,
Tabular data, Polygon layer, Point comparison, Find health facilities, Map, Apply ruleset, Map to a vocabulary — each
reaches its records, or says plainly which input it is waiting for.

## Re-review, 2026-11-27: does each Preview render, and where it does not, is a reason recorded?

The practitioner, after Voronoi catchments' walkthrough still followed a house and Clip polygons' Preview gave counts
and no shapes: *"These are two instances of repairs supposed to be done but not done."* Then: *"I want us to
re-review / audit all the previews that are supposed to both render and not render previews and recorded reason for
not rendering."*

**Method.** Every `openConfigDialog` call in `src/*.ts` on 2026-11-27, read for what its `preview` builds, when, and
whether a reason is recorded where it does not draw or show rows: in the code beside it, the widget's manual, the
experiments, TODO, the audits and CHANGELOG. 48 calls: one is the out-of-bounds report, which has no Preview; 47 are
widget dialogs, for 44 live widgets. No retired widget has a dialog. Read from the code; the two repaired today
(Voronoi's walkthrough, Clip polygons' drawing) were also checked in Chromium.

**Kinds.** *Drawing*: an SVG, a chart or a map of what the step makes. *Table*: the resulting rows. *Numbers*: counts,
areas or statistics in a sentence. *Sentence*: a description, no computed value. *None*: no Preview section. "WT"
means **Show me how it works** sits in the Preview too. *T* is a step that changes data or shapes; *D* one that only
displays, reads in or configures.

| Widget | Preview built at | Shows | When | T/D | Reason recorded for not drawing or showing rows |
| --- | --- | --- | --- | --- | --- |
| Append rows | append-ui.ts:104, :143 | Table, Before and After | after a run with every table; before, each table's value column | T | — |
| Study area (countries) | area-countries-ui.ts:45 | None | — | D | none found |
| Join a table to the study area | area-join-ui.ts:103, :124 | Table, Before and After | Before only, until table, parts and key are known | T | — |
| Geometry buffer | area-steps-ui.ts:232 | Drawing + numbers + WT | when points, lines or polygons arrive | T | — |
| Calculate area | area-steps-ui.ts:364 | Numbers + WT | when a boundary is reachable | T | area-steps-ui.ts:294, "The measurement IS this step's result" |
| Clip polygons | area-steps-ui.ts:389 | Drawing + numbers + WT (drawn since 2026-11-27) | when the area and polygons are reachable | T | — |
| Keep points inside the area | area-steps-ui.ts:457 | Numbers + WT | when the area and points are on the device | T | area-steps-ui.ts:402, "The counts ARE this step's result" |
| Summarize points to polygons | area-steps-ui.ts:498 | Drawing + numbers + WT (since 0.204.6; was Numbers + WT) | when polygons and points are reachable | T | — (the reason recorded at area-steps-ui.ts:329 was overruled, below) |
| Chart | chart-ui.ts:286 | Drawing (the chart) | after a run, or when a table has arrived | D | — |
| Deduplicate records | deduplicate-step-ui.ts:88 | Sentence | always | T | deduplicate-step-ui.ts:79, what a run found "stay[s] in the Inspector's Result" |
| Detect unusual counts | detect-ui.ts:186 | Drawing + table | after a run; nothing before | T | — |
| Measure distance | distance-ui.ts:92 | Numbers | when both layers are reachable | T | none found |
| Find health facilities | facilities-ui.ts:82, :111 | Sentence (study area); numbers (list, after a run) | — | D | facilities-ui.ts:78, retrieval "is in Result" |
| Move points in a donut | geoprivacy-ui.ts:109 | Numbers + WT | when points are reachable | T | none found |
| Aggregate points to H3 cells | geoprivacy-ui.ts:137 | Numbers + WT | when points are reachable | T | none found |
| Georeferenced map image | georeference-ui.ts:129 | None (its map is in Settings) | — | D | none found |
| Point data, editor | input-data-ui.ts:52 | None (a pin map and the first records in the body) | — | D | none found |
| Total within groups | group-ui.ts:99 | Table, Before and After | after a run with keys chosen | T | — |
| Line layer | line-input-ui.ts:114, :236, :255 | Drawing + table | file read, or two areas connected | D | — |
| Map | map-ui.ts:128 | Drawing (the map) | after a run | D | — |
| Convex hull | metric-steps-ui.ts:208 | Numbers + WT | when points are reachable | T | none found |
| Voronoi catchments | metric-steps-ui.ts:229 | Drawing + numbers + WT (since 0.204.6; was Numbers + WT) | when sites and area are reachable | T | — |
| Network isochrone | metric-steps-ui.ts:280 | Drawing + numbers + WT (since 0.204.6; was Sentence + WT) | when the network is held in the page | T | for a network kept outside the page only; the reason as first recorded did not hold for Snow, below |
| Mean center | metric-steps-ui.ts:320 | Numbers + WT | when points are reachable | T | none found |
| Reachable junctions | metric-steps-ui.ts:387 | Sentence; numbers if the network is held in the page | — | T | metric-steps-ui.ts:113 and this audit, as Network isochrone |
| Street network | network-input-ui.ts:172 | None (its drawing is in the Inspector's Result) | — | D | none found |
| Space-time scan | outbreak-steps-ui.ts:123 | Numbers (the scan is not run) | when cases are reachable | T | none found |
| Transmission chains | outbreak-steps-ui.ts:164 | Table | after a run | T | — |
| Point data, from a table | point-data-ui.ts:71 | Sentence | always | D | this audit: "reachable, not yet built" |
| Compare point sets | point-comparison-ui.ts:40 | None | — | T | none found |
| Polygon layer | polygon-input-ui.ts:279, :284 | Drawing + rows; table of parts | once read | D | — |
| Raster input | raster-ui.ts:117 | Numbers (cells, window, metadata) | — | D | none found |
| Clip raster | raster-ui.ts:291 | Sentence | always | T | this audit, as Network isochrone |
| Relate a column | relate-ui.ts:306, :337 | Table | after a run with both tables | T | — |
| Apply ruleset, published | ruleset-ui.ts:368 | Sentence (its rules, no records) | — | T | none found |
| Apply ruleset, rule editor | rule-editor.ts:621, :645 | Table, Before, Sorted and After | when records are reachable | T | — |
| Sample a raster | sample-raster-ui.ts:109 | Sentence + WT | always | T | this audit, as Network isochrone |
| Sample a raster, satellite files | sample-raster-ui.ts:214 | None | — | T | none found |
| Select rows by value | select-ui.ts:133 | Table | after a run | T | — |
| Cases by period | series-rate-ui.ts:122 | Numbers (no curve drawn) | when cases are reachable | T | none found |
| Rate with a denominator | series-rate-ui.ts:190 | Table | when a table is reachable | T | — |
| Study design | study-design-dialog.ts:226 | None | — | D | none found |
| Table | table-output-ui.ts:154 | Table | when the input has rows | D | — |
| Regression | table-steps-ui.ts:215 | Numbers (the rows a fit would use) | when a table is reachable | T | CHANGELOG, 0.197.0: "a fit is iterative and belongs in the run" |
| Travel time over ground | travel-ground-ui.ts:86 | Sentence | always | T | this audit, as Network isochrone |
| Two-by-two table | two-by-two-ui.ts:107 | Table, the four cells | once a table is there | T | — |
| Map a column's terms to a vocabulary | vocabulary-map-ui.ts:85 | Table | after a run | T | — |

**Counts, by the most each dialog can show:** drawing 10, table 11, numbers 12, sentence 7, none 7 (47 dialogs). _Corrected 2026-11-27 for 0.204.6, when Voronoi catchments, Summarize points to polygons and Network isochrone began to draw; the re-review counted drawing 7, numbers 14 and sentence 8._

**Steps that change data or shapes and do not draw or show rows: 21 dialogs, 20 widgets.** Calculate area, Keep points
inside the area, Summarize points to polygons, Deduplicate records, Measure distance, Move points in a donut,
Aggregate points to H3 cells, Convex hull, Voronoi catchments, Network isochrone, Mean center, Reachable junctions,
Space-time scan, Compare point sets, Clip raster, Apply ruleset (published), Sample a raster (both dialogs), Cases by
period, Regression, Travel time over ground. **11 have no recorded reason:** Measure distance, Move points in a donut,
Aggregate points to H3 cells, Convex hull, Voronoi catchments, Mean center, Space-time scan, Compare point sets, Apply
ruleset (published), Sample a raster (satellite files), Cases by period. Ten have one: three that the number is the
result (Calculate area, Keep points inside, Summarize points); five that their data is kept outside the page (Network
isochrone, Reachable junctions, Clip raster, Sample a raster, Travel time over ground); Deduplicate, that its result
belongs in the Inspector; Regression, that a fit belongs in the run.

**Steps that only display, read in or configure, with no Preview or only numbers, and no reason recorded: 6.** Study
area's countries, Georeferenced map image, Point data's editor, Street network and Study design have no Preview
section; Raster input shows numbers. (The inventory first counted 13 transforms without a reason; its own table gives
11, and the six display steps are a separate list.) Only Geometry
buffer and Clip polygons draw what they make; Detect unusual counts draws a chart. _Since 0.204.6, Voronoi catchments
and Summarize points to polygons draw too; the lists above are as the re-review found them._

**Later on 2026-11-27: two drawn, and one recorded reason overruled.** The practitioner, on the Snow Voronoi example
after this re-review: *"Voronoi still with no preview"*, then *"Summarize points to polygon for Voronoi catchment still
with no preview"*. Summarize's was one of the ten with a reason recorded, that the number is the result. A recorded
reason is therefore not, by itself, a settled one. Drawing Summarize's Preview then found a fault the number had hidden:
it read the points without their values, so with DEATHS chosen every total was nothing. Its sentence counts points and
showed no sign. Remaining after both: 18 transforms that neither draw nor show rows, 10 of them with no reason
recorded.

**And a recorded reason that did not hold.** Then, of Network isochrone on the Snow isochrone example: *"This one is
isochrone, still no preview. We are supposed to have addressed this gap already and it remains a gap even after
supposed repair."* The reason recorded above for it, a network kept outside the page, was carried over from Reachable
junctions' repair of 2026-11-25 without checking the example. It holds for a downloaded network, which is kept in
IndexedDB, and not for Snow's, which the workflow holds whole: 738 junctions. Its Preview was `minutes × speed`, the
fault that repair named and fixed for Reachable junctions only. It now draws, computed in the run's own worker; in place
it held the page for 3.4 s. Remaining: 17 transforms that neither draw nor show rows. _Counts above corrected for
0.204.6: drawing 10, sentence 7._

**Corrections to this audit's earlier sections.** Table's Preview is no longer a fixed sentence: it shows the table
(0.204.0). Four of those listed under *Shows the data* do not: Compare point sets has no Preview, Find health
facilities' study-area mode and the published Apply ruleset dialog are sentences, and Tabular data has no Configure
dialog at all.

### Claims in the record that the code does not bear out

| Claim | Where | What the code does |
| --- | --- | --- |
| Show me how no longer follows a house (0.5.0) | voronoi.md, History 2026-11-25 | It did until 2026-11-27 (spatial-walkthroughs.ts); repaired, with a History entry saying so |
| With several points, the list opens on *Choose a point* | buffer_point.md:24 | It opens on *Every one of them (N)* since 2026-11-23 (area-steps-ui.ts:210) |
| Show me how: "One point, never several" | spatial-walkthroughs.ts:91 | The step buffers several since 2026-11-23 |
| Under *Shows the data*: Compare point sets, Find health facilities, Apply ruleset (published), Tabular data | this audit, 2026-11-25 | As corrected above |
| Table's Preview is a fixed sentence | this audit, 2026-11-25 | A table since 0.204.0 |

And one the other way: Clip polygons' drawn preview was in the code before its manual said so (repaired the same day).

### Not determined

Clip raster's map editor, outside the dialog (clip_raster.md:31 says it previews the cells kept), was not read. Point
data's editor body was read in part. Reachable junctions' counting branch is exercised by no example. Nine live widgets
have no Configure dialog and were not checked for another configuration surface: Tabular data (its import dialog),
Point grid, Fill interior gaps, Travel time band, Reachable corridor, Snap to network, Combined area, Find satellite
products and Search a satellite catalog. The rendering conditions are read from code, not run, except for the two
repaired today.

## What this does not establish

That the fourteen are equally worth fixing. A Preview restating the settings is honest and sometimes sufficient:
Clip raster's method and margin may be all there is to say before a raster is read. What the audit establishes is
that a reader cannot tell, from the dialog, which case they are in — Cases by period could show the counts per day
and does not, and nothing distinguishes it from Clip raster, which perhaps cannot.

Nor does it rank them. The ones the practitioner met are in Snow because Snow uses nearly every spatial step; the
same defects sit in dialogs nobody has opened yet.
