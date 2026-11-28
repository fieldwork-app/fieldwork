# Fieldwork release notes

The application version follows the policy in [AGENTS.md](AGENTS.md). A version
shown in a local build is not a claim that it has been published.

## 0.205.0 — In development

- **Table 0.16.0: each column, small counts, and a count with its percentage** (the table standard's open items, from
  [the research note](docs/research/table-presentation-standards-2026-11-27.md)). In **Configure…**, under
  **Presentation**, each column takes its own decimal places; a unit or denominator written once in its heading,
  "Rate (per 100,000)", the column's unit from **Columns…** when none is set; and a note, marked "[note 1]" in the
  heading and written below, the UK Analysis Function's way, because a screen reader passes over a superscript.
  **Small counts not shown** writes a count from 1 up to a declared threshold as [c] (confidentiality) or [u] (too
  few to be reliable), and a note below says which and where; zero is shown, and the data are not changed. A count
  and its percentage can share a cell, "120 (34.5)", in a table of rows; a CSV keeps them apart.
- **The write-up's and the draft's tables to the same standard.** They drew their own cells and read none of a
  Table's Presentation; they now take its title, header cells, decimal places, units, notes, small counts and source,
  and are ruled as Results is (above, under the headings, below). An empty cell's dash was drawn at 45% opacity; it is
  now the muted text colour. A draft's attached CSV hides the same small counts, so what the page withholds is not
  handed on beside it.
- **Results' point table now applies decimal places.** It wrote every number as text before presenting it, so the
  Presentation's decimal places, since Table 0.15.0, never reached it. Found by this release's browser test.
- **Widgets added from the library land clear of one another.** Each was placed 80 px from the last by a count of the
  nodes, while a node is about 340 by 230 px on screen, so three added in a row overlapped (found 2026-11-27). A new
  widget now takes the first free place in the part of the canvas on screen, clear of every node as drawn; where there
  is none, it goes beside the others and the canvas scrolls to it. Adding no longer zooms the whole canvas to fit,
  which on a large workflow left the new widget too small to read. The first version looked down the column and put a
  widget below a full canvas, out of sight; the gate caught it (`tests/write-your-own-rules.browser.mjs`).
- **From the review of #8, six repairs, each with a test that failed before it.** A count hidden after a run, by Apply
  alone, still reached Notes and the draft's attached CSV, which read the presentation from the run's copy of the
  workflow; they now read it as last applied (`tests/table-suppression-reaches-draft.browser.mjs`, which downloads the
  ZIP). Searching Results showed a hidden count raw; a searched row is now presented by its measure. A cross-tab hiding
  a count showed totals that gave it away; it now shows none, and says why. A threshold that cannot be used, typed
  over a saved one, turned hiding off; Apply is now refused and the rule kept, and only an empty box turns it off. The
  note numbers in the headings and below the table counted different columns once a percentage was folded into its
  count; both now count the columns as shown, the folded percentage's note on its count's heading. A widget placed
  beside its source near the edge was scrolled to only when its corner was out of view; now when any of it is, and
  the canvas moves only as far as brings it in, rather than centring it: centring moved the steps beside it out of view
  (`tests/area-measurement.browser.mjs`, caught by the gate).
- Validation, Chromium only: `tests/table-presentation.test.mjs`, `tests/write-up-figures.test.mjs` (the write-up's
  table and its CSV failed on the old figure), `tests/table-output-standard.browser.mjs` (the preview and Results
  alike on Snow's geoprivacy example), `tests/layout.test.mjs` and `tests/added-widgets-clear.browser.mjs` (failed
  on the old placement). Not run on WebKit.

## 0.204.7 — In development

- **Apply waits for the run, then applies** (the practitioner's choice for an edit applied during a run: *keep the
  dialog open, say to wait*). It said to wait, but kept saying so after the run was done, and nothing was applied
  until Apply was pressed again; an edit left there was lost when the dialog was closed. Found on Table's
  Presentation, set while Snow's geoprivacy example ran its first pass, lost in 2 of 3 tries. Apply now reads
  *Waiting for the run…* and applies the draft, as it then stands, when the run is done, and the dialog closes.
  Cancel while it waits applies nothing. Every configuration dialog shares this. From the review of #7: on resume
  the field being typed in commits first, so text typed while waiting is what is applied, and a setting refused
  while waiting (an isochrone time of 0) keeps the dialog open with its refusal rather than closing on an edit the
  workflow refuses. Validation: `tests/config-apply-during-run.browser.mjs`, Chromium only. The tests hold the run
  with a stand-in catchment worker, so the waiting is certain. The Table case, the typed caption and the refused
  setting each failed before. Not run on WebKit.

## 0.204.6 — In development

- **Review of #3 to #6, five repairs, each with a test that failed before it.** The Credentials manual's DHIS2 entry
  checks the address and the server's reach before the CORS allowlist, since Fieldwork says *could not be reached* for
  any failed request (#3). The address check holds site links to `homepage` and repository links to `repository`, so a
  homepage moved to another path or a custom domain finds the old site links (#4). Clip polygons' Preview draws an
  80,000-vertex ring, which threw RangeError, and keeps its count and area if a drawing cannot be made (#5). Network
  isochrone's Preview keeps its answers by what the network is, not its counts, so a network edited to the same 738
  junctions and 1,619 edges is drawn again (#6). A carried layer's largest value is found once, in one pass, rather than
  for every mark, which was quadratic and threw RangeError at 250,000 points (#6). Chromium only.
- **Voronoi catchments 0.8.0 and Summarize points to polygons 0.8.0: their Previews draw** (the practitioner, in Snow's
  Voronoi example after the re-audit: *"Voronoi still with no preview"*, *"Summarize points to polygon for Voronoi
  catchment still with no preview"*). Voronoi draws the cells it would make, the area dashed and the sites; Summarize
  draws the polygons shaded on Map's scale with its key, and faint any point that falls in none. Drawing Summarize found
  a fault its count had hidden: the Preview read each point's name and location but not its other values, so every
  total came to nothing; it now reads the points whole, as the run does. Both use the drawing Clip polygons' Preview
  uses. 17 transforms still neither draw nor show rows, 10 with no reason (TODO). Validation:
  `tests/snow-previews.browser.mjs` on the Snow Voronoi example, Chromium only; the values check failed against the old
  code and passed after. Not run on WebKit.
- **Walking-time bands, one colour each, see-through, everywhere** (the practitioner, on Snow's isochrone: *"the layers
  are almost indistinguishable"*, the longest band *"covers the other smaller isochrone band polygons"*, and: *"the
  John Snow Cholera notebooks Advanced 1 ... isochrone bands have different transparent colors ... hues from
  matplotlib"*). NB04 draws each band with no colour named, `alpha=0.2`, so each takes the next of matplotlib's tab10:
  1 minute blue, 5 orange, 10 green, 15 red. Map's plot, its interactive map, and the Network isochrone and Clip
  polygons Previews now all use that, at one opacity, 0.3, so a band shows on a dark Preview too; before, every band
  was the first blue (the plot) or a lightness ramp (the Previews). Every Preview draws its largest filled shape
  first. The run had kept each computed layer as names and shapes only, so Clip's Preview got the bands without their
  minutes; it now keeps each feature's minutes, value, total, count and category. Network isochrone's Preview draws
  what it would reach, by the run's own function off the page; it had said only minutes times speed. The isochrone
  plot sizes the deaths by its map's setting, as the other maps do.
  The key under the plot had kept one "travel-time region" entry in a hue no band was drawn in, and the deaths in
  a red outside the colour-blind-safe palette; it now has one entry per time in that band's colour and opacity, and
  names the deaths by their layer, in the palette's observation colour unless **Configure…** chooses another
  (`tests/figure-key-agreement.browser.mjs`, which failed on both).
- **Map 0.51.0: the points a polygon layer carries are drawn alike in the preview and the result.** The practitioner, on
  Snow's Voronoi map: the preview sized the deaths and drew them over the catchments, the result drew them small and
  under the shading, *"These inconsistencies make the worked example not credible."* The interactive map sized them by
  a column named DEATHS written into its code; the static figure, at one small size. They are now a layer of the map,
  named for the step they came from, sized, coloured and shaped as **Configure…** sets them, and drawn over the
  polygons in both. Snow's maps choose *size by DEATHS* themselves. A test holds one size rule for both, the points
  after the polygons, and no renderer naming a column of an example's data.
- **Network isochrone 0.8.0: its Preview draws what the sites reach.** The practitioner: *"This one is isochrone, still
  no preview. We are supposed to have addressed this gap already and it remains a gap even after supposed repair."* It
  was `minutes × speed`, the fault fixed for Reachable junctions on 2026-11-25 and not here; the audit's reason, a
  network kept outside the page, does not hold for Snow's, which the workflow holds. It now draws each time as a band,
  computed in the run's own worker: in place it held the page 3.4 s on opening and on every change; now the dialog
  opens in 63 ms and the drawing follows in about 4 s. Chromium only.

## 0.204.5 — In development

- **Two repairs said done and not done, done.** Voronoi catchments 0.7.0: **Show me how** no longer follows a house
  to its nearest pump (the practitioner: *"the house has got nothing to do with setting up the catchment areas"*);
  its manual had said so since 0.5.0, and the step had not gone. Clip polygons 0.6.0: the Preview draws the cut, the
  area, each polygon as it arrives and what is kept, as Show me how draws (*"the preview does not show the resulting
  Voronoi polygons, clipped by the study area"*). Each is held by a test.
- **Geometry buffer 0.8.0:** its manual and Show me how say it draws around several points, as it has since
  2026-11-23; both still said one only. Its manual gains the History heading its entries sat without.
- **Every Preview re-audited** (`docs/audits/preview-audit.md`, 2026-11-27): 47 dialogs read for whether each draws or
  shows rows and, where not, whether a reason is recorded. Drawing 7, table 11, numbers 14, sentence 8, none 7. Of 20
  widgets that change data or shapes and do not draw or show rows, 11 have no recorded reason; six display steps
  show no Preview or only numbers, with none either. Five claims in the
  record the code did not bear out are listed; three are repaired here.

## 0.204.4 — In development

- **Fieldwork's address is written once**, in `package.json`'s `homepage` and `repository` (the practitioner: *"Why
  don't we make the URLs templated so we can easily change URLs without having to hand edit many files?"*). The
  application reads it through `src/site.ts`, the tests through `tests/site.mjs`, and the ontology's 50 manual links
  are written from it. `npm run validate:addresses`, in the gate, fails on a live file naming Fieldwork at another
  address and on code that types the address rather than reading it; with `--siblings` it lists the other
  repositories' links. Moving again means two fields, a build, and the few literal copies the check names.

## 0.204.3 — In development

- **The Credentials manual names the new address where it matters.** DHIS2's CORS allowlist needs
  `https://fieldwork-app.github.io`; and when CARTO or Esri maps, or a DHIS2 server, stop working after the move, the
  manual says to add the new address beside the old one (`digital-twin-ph.github.io`). The local DHIS2 test server
  allows only Fieldwork's local test addresses and is not affected.

## 0.204.2 — In development

- **The worked examples re-pinned** to their commits naming Fieldwork's new address: ten examples' READMEs and the
  population models' provenance link. Nothing else in them changed; 124 pinned files verified. The old
  `digital-twin-ph/fieldwork` is archived, its README saying where Fieldwork moved.

## 0.204.1 — In development

- **Fieldwork moved to `fieldwork-app/fieldwork`**, with the site at `fieldwork-app.github.io/fieldwork`. The repository
  was started from main's history alone, which names no co-author: the old repository kept a pull request whose
  commits did, and only GitHub could remove them. The address the application shares, its links to the manual, the
  changelog and issue reports, the ruleset schema's identifier and each widget's manual link in the ontology all name
  the new one; the CARTO and Esri key instructions name the new host. The old repository is archived with a notice.
  Saved work stays at the old address until backed up there and imported here.



- **One blank port, bound by what arrives** (settled 2026-10-15 for the Map, by experiment 116 for every widget; the
  practitioner, 2026-11-27: *"Nodes should automatically detect the shape of the incoming input on an unconnected input
  port and once connected should display in words what came in."*). Every widget with inputs draws what is connected
  and one blank port, **+ Add an input**, while it can take more. Drop a result on it and it goes to the input its kind
  fits; where two inputs of one kind do different jobs, the canvas asks which (Measure distance: **From** or **To**).
  A step whose inputs are all connected draws no blank port. Saved workflows open unchanged: the inputs underneath
  are the same.
- **Kinds as symbols.** A connected input shows its kind's symbol and the name of the step it came from, cut short with
  "…" where it does not fit and named in full on hover; "Points from Health facilities" was too long for a node. Nine
  symbols, chosen by the practitioner from a sheet of mock nodes and kept in the buttons-and-ports audit. Source widgets
  take the symbol of what they send as their icon: Point data and Raster input both drew ▦.
- **One output connector per node**, on its right edge with no row of its own; hovering it shows the kind's symbol and
  name (the practitioner: *"I am also able to hover each one and see what shape is coming out. I do that a lot."*).
- **Shorter nodes, and no example opens with one node over another.** A widget's own description, the same on every
  node of its kind, shows on the selected node only; a subtitle about the node itself stays. Overlapping node pairs in
  the eleven built-in examples: 13 at 0.203.0, 27 with the port rows, 0 now, with seven nodes moved in the Snow and
  geoprivacy examples. A test holds every built-in example at none.
- **Table 0.15.0 previews itself in Configure…** (the practitioner: *"Table output config dialog should have a preview of
  the table"*): ten rows, twenty, or all to review, as Results will show them, with the coordinates as the dialog sets
  them; a polygon table shows its areas from the last run, wide.
- **Tables presented to a standard** (the practitioner: *"We want tables to really look pretty but also vision impaired
  friendly"*). Every table follows the rules the standards agree on: numbers right-aligned in equal-width digits under
  right-aligned headings, one rule above, one under the headings and one below, none vertical, coordinates to one
  precision a column. Configure… gains a **Presentation** section: title, decimal places, thousands separators (never
  on a year), how an absent value is written (a dash read as "no value" by default), shaded rows, notes and source.
  The standards were read from open guidance (APA, ICMJE, STROBE, MMWR, CDC, the UK Analysis Function, ONS, W3C) and
  are in a research note.
- **PR 10's review, answered.** "As recorded" keeps a value as it is: text as written (00123 stays 00123), a number to
  its full precision (7e-8 is not 0), separators only in a number's whole part. The blank port never replaces a
  connection: where the only input that fits is taken, the drop is refused. The preview draws data tables with Results'
  own renderer, so ticking Show totals shows the totals before Apply, and offers "All" by the rows that renderer draws.
  Every Supabase check result is let go when the credentials change, waiting or finished, so a different key under the
  same name is never shown as accepted.
- **Worked examples audited as teaching material.** Five of twelve catalogue examples have a manual walkthrough, none
  of the eleven built-in ones; the READMEs share no outline. The standard is the practitioner's to set; TODO carries it.
- **Table 0.15.0: the coverage port is gone.** Nothing makes a coverage check since Check spatial coverage retired on
  2026-10-21, and a workflow saved with one already opens with Keep points inside the area feeding the points port.
- **Buttons by role.** Primary only where a button commits (Apply, Save, Run, Configure…); Close, Next, Done and Step
  are Secondary; Remove is Danger everywhere; Manual and other ways somewhere are links. At the audit 20 labels were
  drawn in more than one style and 6 Primary labels did not commit; `npm run measure:buttons` now counts 0 and 0, and a
  unit test holds both there. The walkthroughs' **Start again** reads **Back to step 1**, and the note card's
  **open** reads **Open the note**.
- **A Supabase key, made from the manual and checked on the spot** (experiment 233's first spike). The Credentials page
  says how to make a Supabase project and copy its publishable key; **Check** beside the key asks the project once and
  says what came back. A secret key is refused as it is added and never sent. Not yet tried against a real project.
- **Experiment 233 gains its precedents**: staged case studies, real-time outbreak simulations, matrix games and
  simulation exercises, the patterns cooperative games use, and the evidence against. Nothing found combines turns, a
  hidden model and analysis in real tools, and the evidence of learning across the field is weak.
- **One word for each: a widget is the kind, a node one placed on the canvas** (the practitioner: *"we call them
  widgets as classes and nodes as instances"*). The library lists widgets, so it is the **Widget library**, searched by
  **Find a widget…**; the canvas still says node.
- **Credentials carries a padlock**, closed while locked, as Import and Back up carry their arrows.
- **WebKit's offline reload answered.** The reasoning worker loads from the offline cache in WebKit (5 of 5 local
  runs); the failures were map tiles cut off by going offline, which the test now sets aside only while offline.

## 0.203.0 — In development

- **Commentary off the screen, second pass.** An empty canvas now says the other widgets appear once a source is on it.
  Four widgets alone had read as a palette that failed to load (found 2026-10-26, and again in Claude Design's canvas
  findings). Every table's filter said "Name, evidence, or service…" whatever the table held; it now reads "Search the
  rows…". The map legend's default said "Cooling center", from the retired heat example; it now says "Location". The
  new-project dialog's notice pointed to experiment 122, and the Ontology link's tooltip named SHACL shapes and
  OntoInk; both now say only what a reader needs.
- **The sweep measured.** `npm run measure:prose` scans the source for the strings each surface shows, and counts the
  words in sentences using design or project vocabulary. It reports and never fails the gate. A string the code
  assembles from pieces is set aside as a code fragment, never counted as words, so the Notes tab's note kinds, built
  that way, are not counted (pull request 9's review). Before the sweep (0.201.0): 3 strings, 42 words. After the first
  pass (0.202.0): 2 strings, 21 words. Now: 1 string, 10 words, the Ontology link's own name.
- **The code review's re-read at 0.199.0**, written 2026-11-25 and left unsaved in a worktree, is in its audit, before
  the acted-on section that corrects four of its readings.

## 0.202.0 — In development

- **A high-contrast theme.** The practitioner: *"We should also have a high contrast theme … I actually switch themes
  depending on the job to be done."* **High contrast** joins Match device, Light and Dark in the theme menu: black on
  white, no tinted surface behind text, strong outlines and a thick focus ring. Match device takes it when a light
  device asks for more contrast; a dark device keeps Dark. Measured: words under WCAG AAA's 7:1 on the Workflow tab, the
  Notes tab and the note dialog were 138, 412 and 342 in Light, and none in High contrast. axe's 7:1 rule passes on
  every view, the main dialogs, and the Snow isochrone example's Inspectors and the dialogs they open. Maps and charts
  draw as in Light.
- **Show me how ends on the scale Map shades with** (Summarize points to polygons 0.6.0, Aggregate points to H3 cells
  0.6.0). The practitioner: *"At the end shouldn't the goal be in summarization to render a shading corresponding to
  the resulting scale?"* The last step shaded each result by opacity alone, with no key: North's 8 deaths and South's 6
  were 95% and 76% of one green. Each shape now takes its colour from Map's own classes, keyed below the drawing by
  range.
- **A label stays inside the drawing.** "House 6: outside" was cut to "House 6: o". A label that would run past the
  right edge is drawn to the left of its point; in Summarize the houses a step sets aside lose their labels, and House
  6 sits above North so its label is not read as inside South. The test checks every label at every step of every
  spatial walkthrough.
- **Voronoi catchments' cells are one fill** (0.6.0). They were shaded light to dark, keyed "darker for a larger
  total", but a catchment carries no total.
- **The Claude Design findings are in TODO**: the palette's eight, the Inspector's six, the canvas's six, and the
  outputs on screen audit's eleven (`docs/audits/outputs-on-screen-audit.md`). Written on 2026-11-26 on a branch based on
  0.168.0 and never merged, they are copied as written, with a line saying which still hold in 0.202.0.
- **The last inline Inspectors out of `app.ts`** (Chart 0.25.3, Measure distance 0.7.1, Point data 0.19.1), each into
  its own module, with nothing a practitioner sees changed. Chart's handlers for controls drawn only in Configure…
  were removed from `app.ts`; Configure… wires its own draft.
- **Commentary off the screen, first pass.** The practitioner: *"Commentary text about design belongs in design
  documents not the UI."* Removed: the project bar's tagline, shown before a workflow opened; the N3 & evidence tab's
  "Generated facts → explicit rules → local inference"; the Notes tab's paragraph on where each kind of note comes from;
  "GeoJSON → N3" on a drawn Study area's card. Stale, rewritten: the empty Results panel named the retired visual
  output nodes and a Bar chart choice; Play back the build's tooltip named the reveal rule. The Inspector's subtitle
  showed the step's internal id (Claude Design's Inspector finding 1) and now shows its group only.
- **Map shades what Summarize and H3 counted** (Summarize points to polygons 0.7.0, Aggregate points to H3 cells 0.7.0,
  Map 0.50.0). From pull request 6's review: Show me how ended on a scale it called Map's, while Map drew Summarize's
  polygons one colour per unit and every H3 cell one blue. Each polygon now carries its total or count, and Map shades
  and keys by it; the walkthrough takes its scale from the same functions, and a test compares the two.
- **Show me how's labels measured, not estimated.** An estimate moved a long label, such as one naming "Confirmed case
  count", off the drawing when it fitted on the right. Each is now measured once drawn: right of its point, else left,
  else as near as the drawing allows.
- **Match device's high contrast** now takes the palette's colours as High contrast does: Street network's icon stayed
  blue on a tint at 3.64:1.
- **"Research workspace" out of the header**, on the practitioner's word. The PROTOTYPE tag stays.

## 0.201.0 — In development

- **The syndromic example on NSSP's definitions** ([228](docs/experiments/228-detect-unusual-counts.md)). Four
  definitions of the US National Syndromic Surveillance Program, ILI CCDD v1, CDC Broad Acute Respiratory DD v1,
  Norovirus v1 and CDC Measles CCDD v1, copied from the queries NSSP publishes into Apply ruleset's rules, and applied to
  the example's made-up visits, which now carry a discharge diagnosis in ICD-10, ICD-11 and SNOMED CT. ICD-11 is
  Fieldwork's translation of NSSP's ICD-10-CM codes, checked against WHO's 2026-01 release. The example is pinned at
  3e99e67, with two new workflows: which definitions each visit matches, and whether Norovirus v1 finds the outbreak
  (CUSUM, 9 days from 13 April).
- **Apply ruleset 0.18.0 reads a code in a list.** "Has an item starting with any of", and its opposite, read each item
  of a text separated by semicolons, slashes, ampersands or spaces, as a list of diagnosis codes is written: "J10"
  starts "J10.1;R50.9". A word in double quotes keeps its spaces, so `" flu "` is not found in "influenza".
- **Opening a published ruleset of words in the rule editor** showed its text columns as numbers: any comparison but
  "is" was taken for a number. Contains and starts-with now mean text, and a test fails without the fix.
- **Apply ruleset's code is out of `app.ts`**, in `src/ruleset-ui.ts`, as the other moved widgets' are: 8,834 lines to
  8,406.
- **Lab check 54** runs NSSP's own queries directly, as ESSENCE would, and finds the same visits as Fieldwork for every
  definition, with ICD-10 and with ICD-11. Pinned at validation-lab 64fcee7.
- **From the pull request's review.** A starting word holding a space, `;`, `/` or `&` is now refused with its own
  message: it could start no item, so it matched nothing, and its opposite everything. The manual's `" flu "` example is
  "stomach flu today": the end of the text is not a space. The hosted verify now checks out the syndromic example at its
  pin, so fixtures nssp-syndromes-001 and detect-unusual-counts-001 are built there and not skipped.

## 0.200.0 — In development

- **The remaining items of the code review** ([audit](docs/audits/code-review-2026-11-23.md)), and three findings made
  while doing them. No widget computes anything differently; no widget release changes.
- **Steps run from a table, not a switch.** `executeWorkflow` held one `switch` of 1,400 lines, a case for each step
  type. Each case is now a function in a module for its family (`src/run-inputs.ts`, `run-spatial.ts`,
  `run-raster.ts`, `run-tables.ts`, `run-ruleset.ts`, `run-epidemiology.ts`, `run-outputs.ts`), given a
  `StepContext` that names what a step can reach, and `src/step-runners.ts` maps each type to its function. The text
  of each step was moved by a script reading the parse tree, unchanged except that leaving the switch is now
  returning the value. `core.ts` is 1,826 lines, from 3,280. `tests/step-runners.test.mjs` fails if a step that
  can be added has no function, or a retired one keeps its own.
- **Retired steps had kept their code.** Places, centres, the heat alert, the generic output and the three sea-level
  steps kept their arms in the executor; places, centres, the heat alert, the distance policy and the sea-level steps
  kept their Inspectors, subtitles and palette defaults in `app.ts`. `validateWorkflow` refuses or migrates every
  retired node before a run, so none of it could run. It is removed.
- **The kernel's own tests run in the gate.** Its 60 Rust tests ran nowhere: not in `check`, `check:fast` or CI. Run
  in parallel, two failed every time, because each module keeps its arrays in statics and two tests wrote over each
  other's; on one thread all pass. `npm run test:kernel` runs them on one thread, in `check` and `check:fast`, and
  finds cargo in `~/.cargo/bin` where the shell's PATH lacks it. Six new tests cover the space-time scan in Rust: the
  random stream against the script's, the observed score against a search of every window, the shuffle and the early
  stop. Loosening the window bound by one turns the window test red.
- **One HTML escape**, `src/html-escape.ts`, for every module: eight more copies of the five-character rule, three
  that escaped only `&`, `<` and `>`, and seven that left out the apostrophe. None was a defect where it stood,
  because no template puts a value in a single-quoted attribute. `tests/escape-html.test.mjs` fails if a module
  defines its own. The JSON editor's coloured layer now carries `&quot;` where it carried `"`; drawn, it is the
  same glyph.
- **The wide reader looks a column up by its name, not its escaped name.** It searched for `district &amp; ward`
  where the browser holds `district & ward`, found nothing, and preselected a key as a value. It was never seen,
  because the pass after it compares the decoded names and clears the box. A browser test written for it passed on
  the old code as well, so it is not kept.
- **A database on this device opens within five seconds or says why** (`src/local-database.ts`). Only the payload
  store bounded the wait for an open that neither succeeds nor fails, which some engines do in private mode; saving
  a PDF, a remembered file, a satellite reading and unlocked credentials could each wait for ever. Each store keeps
  its own way of failing.
- **The Validation Lab, audited and brought up to this release** ([audit](docs/audits/validation-lab-audit.md)).
  Every fixture the exporter can make was made again from this build, and 46 of the lab's 51 results rest on one:
  all agree, except clip raster and deduplicate, which partly agree as recorded. Three more were rerun on older
  fixtures that nothing can make again (18, 25 and 27's rate ratio, each a retired widget or rule), and two were not
  rerun (23, retired rulesets; 50, rasters not in the exporter's layout). `widgets/parity.json` is pinned to the lab
  commit that holds those results, and every entry rerun on a new fixture covers its widget's current release.
- **Three lab checks had fallen behind rules this project declares**, and disagreed until they were brought up to
  them. Reachable junctions has charged the walk onto the network since 0.4.0: the reachability fixture now declares
  it, and check 07 measures the walk itself. Join a table to the study area has counted units, not parts, since
  0.3.1: the fixture declares it, and check 31 counts Streatham's two polygons as one unit. And a QR control code the
  classic decoder could not read was counted against Fieldwork; check 47 now reads with both OpenCV detectors.
- **The exporter wrote two fixtures the lab could not use.** Clip raster's typed array became an object keyed by
  index, every cell marked inside: the exporter now reads NaN as outside and writes lists, and the canonical digest
  refuses a typed array or an integer-like key, which JavaScript orders as Python does not. The ruleset exporter
  imported Old Naledi's removed module; the three rulesets it exported are retired, and it is removed. Check 30's
  fixture, made at 0.12.0 by a chain that is gone, is made again from the South London people workflow
  (`two-by-two-snow-002`).
- **`validate:parity` runs in the gate**, against the lab checked out beside this repository, and lists every entry
  checked at an older release than the widget's current one. It reports that age and never fails on it.
- **The ledger of lab checks corrected** (`widgets/check-coverage.json`). Study area is covered, by check 41's
  boundary repair. Tabular data owes a check: it converts wide files, applies hand edits and profiles columns. Apply
  ruleset rests on check 49, since checks 23 and 25 cover rulesets that are retired. 32 of 44 computing widgets are
  checked, 12 await one, 1 is blocked.
- **Dive Deeper offers lessons only, and the UTM zone has a manual page.** Dive Deeper is pedagogy, in its own
  repository, deferred until the widgets are mature enough to teach from. So the twenty teaching sections still at
  the end of lab notebooks were taken out of the lab, the `diveDeeper` links in `widgets/parity.json` with them, and
  `validate:dive-deeper` now fails if a lab notebook or a parity entry teaches. The eight widgets that take a UTM zone
  had linked to one of those sections, for the rule that a CRS choice comes with a reachable explanation of it. They
  now open **The UTM zone** (`docs/surfaces/utm-zone.md`) from their learn block: what a zone is, the 0.6% two
  reasonable zones can differ by, and why every step in a workflow uses one.

## 0.199.0 — In development

- **Three more from the review of 0.198.0**, all three mine, and the third would have broken the nightly run.
- **Cases by period previews the input type being chosen** (0.10.0), not the one connected. Switching it from points
  to a table left the Preview counting the points still wired up — *"2 cases in 2 days"* of records that Apply would
  then discard along with the connection. The draft is what the reader is looking at, so the draft decides; where the
  type it asks for has nothing on it, the Preview names what to connect.
- **Regression previews each model's own sample** (0.9.0). With several exposure columns the run fits one model each,
  every model leaving out only the rows its own variables are missing on; the Preview reported the first exposure's
  as though it were all of them — 4 of 4 usable where the second exposure had 2. `exposureColumnsOf` and
  `modelParams` moved beside the row rule in `regression-sample.ts`, so the Preview enumerates the models the run
  will fit rather than guessing at them.
- **And it reads a cell as the fit reads it** (0.9.0). The exclusion rule trims, the case summary did not, so a
  whitespace-padded `yes` was admitted as a case and then counted as a non-case: two normalizations inside one
  Preview, disagreeing about the same cell.
- **Two dialog test files are isolated from WebKit's service-worker startup** (`test.use({serviceWorkers:'block'})`).
  On WebKit the reasoning worker is refused *"due to access control checks"* before a test's own assertions run, so
  all four focused tests failed there while passing on Chromium — and the local gate is Chromium only, so this would
  have reached the nightly WebKit run. Checked both ways: without the block the file fails on WebKit with that
  message, with it the four pass.

## 0.198.0 — In development

- **Five defects, all found in review of the two releases below**, four of them introduced by those releases. The
  review is on the pull request, comment by comment, against the lines it is about.
- **A display choice was changing what was computed** (Tabular data 0.25.0). *Always show this table wide* wrote
  `DataTable.wide` — the field the melt writes to say a file ARRIVED wide, and the field `isWide` gates, which lets
  Apply ruleset evaluate rules over rebuilt subjects rather than over rows. Keeping the preference therefore turned
  six rule inputs into three and replaced the measure and value fields with measure-named ones. The preference is
  `DataTable.shownWide` now; views read either, and nothing that computes reads the second.
  ([audit](docs/audits/wide-format-audit.md))
- **A key that distinguishes two records is drawn, not only grouped by** (Tabular data 0.25.0). Yesterday's fix for
  merged duplicates put a key that varies within a subject into the row's identity and left it out of the columns
  shown: two years of counts for one district drew two rows, neither saying its year — right in number, unreadable,
  and indistinguishable from the duplicate the fix existed to expose.
- **The offer to keep a wide reading survives filtering** (Tabular data 0.25.0). Its click handler was attached once
  after the first render, while filtering rebuilds the dialog on every keystroke, so the button stayed on the screen
  and did nothing. Filtering a long table before deciding how to read it is the path a reader actually takes.
- **Regression's preview counts the rows the fit will use** (0.8.0), not the rows with something in every column.
  The fit also drops an outcome that is neither case nor control, a categorical written `NA`, a numeric that is not
  a number, and a missing stratum or offset — so the preview promised a larger sample than the run would use. The
  rule now lives in `src/regression-sample.ts` and is called by both the fit and the preview: one rule, rather than
  two that agree today. The preview names why rows are left out, in the run's own words.
- **The scan preview never reports a limit shorter than the scan runs** (0.8.0). It floored the share where the scan
  takes `Math.max(1, …)`, so five days at a tenth read *"up to 0 days"* of a scan that runs one-day windows.

## 0.197.0 — In development

- **A Preview that restates its settings looks like a preview**, which is how eleven of them went unnoticed while
  they were met one dialog at a time. They were found by reading all forty-three rather than searching for empty ones
  ([preview audit](docs/audits/preview-audit.md)). Four now count from the records connected, and a fifth stops asking
  for what is already there.
- **Cases by period counts what it would count** (0.9.0). It ran the settings sentence, showing nothing of the records.
  It now runs the step's own counting on them, before any run: the total, the periods, the span and the busiest one.
  Records whose date it cannot read are counted and named — a count by date drops them in silence, and the curve is
  then drawn as though they had never been there.
- **Measure distance counts the candidates a condition keeps** (0.7.0). The conditions are the setting on the screen,
  and how many candidates survive them could be seen only by running the workflow and reading the receipt. The count
  now moves as a condition is typed, beside the nearest, median and furthest distance. A condition that keeps nothing
  leaves every point without a distance, which is said rather than left as a column of gaps.
- **Regression counts the rows a model would be fitted on** (0.7.0): how many carry every column the plan names, how
  the outcome divides, and the exposure's smallest level. Counted without the model's kernel, which that dialog is
  deliberately kept clear of — a fit is iterative and belongs in the run, while completeness is one pass over the rows.
- **The space-time scan says what its shares come to** (0.7.0). Every setting there but two is a share, and a share
  says nothing alone: *circles up to 20% of the cases* means two over ten cases and two thousand over ten thousand.
  Now the cases with a readable date, the period they span, and each share in the units of the thing it limits.
- **Reachable junctions says what it is waiting for, exactly** (0.7.0). Its Preview multiplied the minutes by the
  speed — the two numbers just typed. Worse, the first draft of the replacement asked to *connect a street network*
  over a connected one: a downloaded network is held outside the page by reference and read when the workflow runs, so
  a dialog cannot walk it while it is drawing. That is now said in place of sending anyone to fix what is not broken.
  **The branch that counts junctions is unexercised**: every example here holds its network by reference, so driving
  it needs a fixture whose network is inline, and there is none yet.
- **One reader for records, properties and all.** `pointChoices` trims every feature to a name and a geometry, which is
  what a picker needs and less than a step reads — Cases by period counts by a date in the properties, Measure distance
  decides eligibility by the candidates' own attributes. A preview built on the trimmed features would have described a
  different run, in numbers, silently.

## 0.196.0 — In development

- **Quick Look says when the shape is not the table's own** (Tabular data 0.24.0). It has widened long tables on
  sight since 2026-10-27 — *"pandas does not show you a long table"* — while every other surface showed them as
  stored: one table, two shapes a click apart, with nothing saying which was which. It now says the table is stored
  long, how it is being shown, and that elsewhere it is shown as stored.
- **A wide reading can be kept, and it travels.** *Always show this table wide* writes it as `DataTable.shownWide`,
  which rides the value so the steps below inherit it rather than each guessing. The practitioner: *"this user
  decision should cascade downstream for user facing views of that table."* The hint and the offer are separate, so
  a table a step **computed** gets the explanation even though there is nothing yet to keep the choice on. (It wrote
  `DataTable.wide` until 0.198.0, which is provenance rather than a preference, and that changed what Apply ruleset
  computed; see below.)
- **A melted table is read back on the key the melt recorded** (Tabular data 0.24.0), not on whichever key varies
  most. `wideFrame` required `asDeclared` as well, and the melt does not set it — so every melted table fell through
  to a heuristic that takes the key with the most distinct values as the subject. Two districts by eligible,
  vaccinated and missed has three measures against two districts: the measures won, the table came back transposed,
  and correcting a district's name reached one of its three counts. **Reported by a reviewer outside this project**
  against 0.195.0, in those terms, and reproduced here before it was touched — a case the 0.195.0 fix walked past.
- **A long → wide → long round trip** guards it, over three shapes. Checked against the defect: reverted, it fails
  on two-by-three and passes on the other two, because there the heuristic happens to pick the right subject. A
  single example would not have caught it.
- **A table a step computes can keep a wide reading too.** The decision is kept against the step that makes the
  table and applied to what it produces, so it travels as a file-table's declaration does. From the next run.
- **A key the melt never heard of stays a column of the table.** Reading a melted table on its recorded key, new
  above, dropped every other key: Relate brings `water_supply` onto Snow's South London table, whose record names
  `sub_district` and `measure` only, and the joined preview lost the one variable a reader checks before grouping by
  it. Each leftover key is now placed rather than dropped — one value per subject makes it an attribute column, and
  one that varies within a subject is part of what identifies a record. **Caught by the gate**, in the worked
  example, before any of this was published.
- **A record that arrives twice is drawn twice.** The pivot grouped on the keys alone, so two rows with the same keys
  became one. Rio de Janeiro's 2024 dengue file repeats the week of 2024-12-29 for all 92 municipalities, byte for
  byte — the doubled week the worked example exists to teach — and it was absorbed: 4,784 rows where the file has
  4,876, the duplication gone into the shape. A row whose cell is already filled now opens a new record, so nothing
  is overwritten and a duplicate reads as the two rows it is. The *Before* note counts the file's own rows again:
  **184 of 4,876**. Found by following the gate's figure instead of adopting it.
- **One rule for widening, everywhere** ([wide-format audit](docs/audits/wide-format-audit.md)). A user-facing view
  now widens a table only where the table says it is wide — a melt's record, or a reading the reader kept. The data
  quality dialog was gated on that in 0.195.0, after the gate caught it pivoting a data dictionary's class names
  into headings; the Join and Detect previews were left guessing, by the same heuristic, on the same kind of file.
  **Found by GitHub Copilot reviewing the incoming commit**, which also noted no focused test covered it. There is
  one now, in the shape of the defect: a dictionary of `column` and `class` keeps its own columns, and declaring a
  reading cascades into those previews without being told again.
- **A preview cannot describe an input from a run that no longer applies.** The computed-layer lookup added for the
  polygon previews read the last run's output without asking whether that run still matches the workflow, which the
  two lookups beside it do ask. Edit a step above and the preview below described the old input. **Found by GitHub
  Copilot in the same review**; verified against the code before it was changed.
- **Voronoi's Show me how builds the division up** (0.5.0), instead of following one house and then revealing every
  line at once: two pumps and the line between them, then the third and where the lines meet. Both drawn by
  `voronoi` itself.
- **Network isochrone's Show me how draws the streets the walk covers** (0.7.0). It said "along the streets in every
  direction" and drew only the region, so the one thing that tells it from a circle — that every metre is counted
  along a street — was asserted and never shown. The walked streets come from `costsWithin`, the same reachability
  the step runs.
- **Two CI comments corrected.** `pages.yml` said the gate still ran on every push "in `verify` below" and
  `verify.yml` said both engines run; verification moved to its own file, nightly, WebKit only. Both were carried
  over unchanged when that happened. **Found by GitHub Copilot**, reading the comments against the workflows.

## 0.195.0 — In development

- **Every user-facing table shows the file's shape** ([wide-format audit](docs/audits/wide-format-audit.md)). The
  practitioner, on the data quality dialog: *"all user-facing tables should be presented wide (line list format)"*,
  and then *"We can be efficient using long formats but will result in cognitive dissonance in the user."* The data
  quality dialog, Join to the study area and Detect unusual counts showed Fieldwork's melted form — `measure` and
  `value`, names it gave the table — while the table view a click away showed the file's own columns. All three now
  go through `wideFrame`, the reconstruction Quick look already used, so none of them can disagree about one table.
  Append rows is left as it was, deliberately: its headers carry "stacked as …" and the stored columns are its
  subject.
- **An edit in the quality dialog no longer splits a subject in two.** Editing a subject's name there renamed one
  melted row and left its siblings behind. In the file's shape a subject is one record, so a correction reaches
  every row it has — and edits are translated back to the stored rows, which is what keeps them applying at all.
- **The five empty Preview sections are gone** ([preview audit](docs/audits/preview-audit.md)). Convex hull,
  Voronoi catchments, Mean center, Move points in a donut and Aggregate points to H3 cells offered "Show me how it
  works" and nothing else. Each now runs the step's **own** function on the points actually connected, so a preview
  cannot show something the step would not do: the area inside a hull and how few points its corners are; how many
  catchments and how uneven; where the centre falls; how far the points really moved; and how many points the H3
  minimum leaves out — the disclosure control's cost, before applying it rather than after.
- **A preview can see a layer an upstream step computed.** Clip polygons and Summarize points to polygons said *"the
  polygon layer arrives when the workflow runs"* after the workflow had run, because a layer a step MAKES is stored
  on no node and, unless it is an output, is in no `outputs` entry. `result.computed` has held them all along and
  only `pointChoices` read it.
- **The quality dialog widens only what Fieldwork melted.** The first version called `wideFrame` on every table, and
  the gate refused it: a table long *in the file* had a real column, `class`, pivoted into headings and lost from
  the very tab where a column is checked against its dictionary. It now gates on a reading the table carries — the
  melt's `wide`, or a reader's kept `shownWide`. This leaves Quick Look widening a natively long table while the quality dialog does not — recorded in the
  audit, and the reason the next release declares the reading instead of letting each surface guess.
- The CI audit is corrected: the WebKit failure reported as reproducing locally did not, and could not have —
  **WebKit was not installed on this machine**, so every local run ended at `browserType.launch` and a launch failure
  was read as a test failure. With WebKit 27.2 installed, the full suite is **25 failed / 620 passed in 57 minutes**
  on macOS against **3 failed / 617 passed** on CI's Linux, with no overlap between the two sets. A two-engine local
  gate is therefore not viable, and the suggestion that Safari users would find the write-up unstamped is retracted.

## 0.194.0 — In development

- **Show me how keeps the rows it has matched** (Relate 0.15.0). The practitioner: *"There is something wrong with
  this walkthrough. The result is empty after the last match."* At the step where a key is found twice, the sentence
  said the step *"will stop once every row is checked"* while the pane beside it had already emptied — so the four
  steps that had built Alpha and St. Ann up row by row were made to look as though they had been lying. The renderer
  treated two flags alike: `willStop` is set mid-walk, where the step is still matching, and `stopped` only on the
  last step. The rows now stay while the walk goes on, under the words "None of this will be passed on". The test
  that pinned the old behaviour — *"the rows before the stop are not shown as a result"* — is replaced; that was a
  decision, not an oversight.
- **A drawn line layer reopens fitted to its lines** (Line layer 0.5.0), not zoomed out to the world. `fitBounds` ran
  at mount against a panel with no size, so it fitted the lines into a viewport of 0 × 0; the `invalidateSize` added
  earlier the same day corrected the size and never re-fitted. That earlier fix settled the tiles and not the view,
  which is why the basemap came back and the lines stayed a world away. It fits once, and the view is then the
  practitioner's.
- **A census brings its date with it** (Tabular data 0.22.0, experiment 230): the catalogue's reference date, read
  rather than typed, marked *enumerated* because people were counted and not modelled. Dropped if another file is
  chosen, so one source's date cannot land on another's rows.
- **Append rows says the years it is stacking** (Append rows 0.6.0): a 2025 model under a 2022 census is *three years
  apart*, with one period per source carried on the result. Said, not refused — unlike a unit difference, because
  stacking people under houses is wrong and stacking 2022 under 2025 is ordinary field epidemiology. The widest gap
  is reported, since three tables of 1984, 2022 and 2025 are forty-one years apart and "three" would be true of a
  pair and false of the stack. Silent where nothing states a period; where some do, the silent ones are named.

## 0.193.1 — In development

- **Corrected in the CI audit**: removing the Chromium leg of `verify` halves the runner *minutes*, not the
  wall-clock. The matrix ran the two engines as parallel jobs, so a verdict already took one engine's time, not two.
  The first run under the new arrangement — dispatched by hand rather than waited for, since a broken `verify.yml`
  would have meant no verification at all — took **59 minutes for WebKit alone**. So dropping Chromium could never
  have made verification fit a 24-to-48-minute release cadence; the nightly schedule is what does that. The claim
  was offered as a reason for the choice, which is why it is corrected rather than quietly dropped.
- That run reached a verdict: **3 failed, 617 passed**, one `verify` job rather than two, inside the 75-minute bound.
  All three are WebKit UI timing — `buffer-point-inspector`, `relate-proposed-keys`,
  `sample-satellite-areas-offline` — and are recorded in the audit for manual testing rather than fixed here.
- Also recorded: `large-study-area-map`'s WebKit fetch error failed on `a3458e79` and passed on `568ab175`, which
  changed no `src` file. **Corrected the same day**: it was reported as also reproducing on this machine, and it did
  not — WebKit was not installed here, so every local `--project=webkit` run ended at `browserType.launch:
  Executable doesn't exist` and a launch failure was read as a test failure. With WebKit 27.2 installed, that test
  and the three CI failures all **pass on macOS WebKit**, ten tests in 48 seconds. The CI failures are therefore
  specific to the Linux build or the runner, not to WebKit as such, and the suggestion that Safari users would find
  the write-up unstamped is retracted: it rested on the false reproduction.

## 0.193.0 — In development

- **A rate's two vintages are compared on the year, not as text** (Rate 0.6.0, experiment 230). It was
  `numeratorPeriod === denominatorVintage`, so a denominator stated at one precision and a numerator stated at
  another were reported as two vintages for one year — Rwanda's census of `2022-08` against cases of `2022`. Census
  tables states its reference dates at four precisions (`2022`, `2022-08`, `2022-07-31`, `1984-07-01`), and
  `boundary-source.ts` already records geoBoundaries returning `2010.0` for one level, so a year arriving in a form
  other than four bare digits is the ordinary case rather than the odd one.
- **A disagreement is reported with its size**: "vintages 3 years apart" rather than "different vintages", and
  `fw:vintageGapYears` in the receipt. One year and forty-one are different findings, and DR Congo's census is of
  1984, so a 2025 denominator beside it is forty-one years out and nothing said so.
- A period no year can be read from **keeps the comparison it had**. Somebody who typed "the 1854 outbreak" in both
  fields meant them to agree, and did agree before this; failing to read a year out of either is no reason to start
  contradicting them. The Snow workflow's prose vintages pass untouched.
- `src/reference-period.ts` is new and holds this apart from any widget: the period, its kind
  (enumerated, estimated, projected, not stated), and the comparison. The practitioner answered the three questions
  experiment 230 was waiting on — carry what is stated and compare on the year; carry a boundary's year but keep it
  separate; start at Append rows and Rate.
- **Nothing carries a period yet**, which is the half of experiment 230 still open: the census catalogue holds
  `referenceDate` for all eight countries and nothing reads it, so Rate's two fields are still typed. Recorded in the
  experiment rather than implied.

## 0.192.0 — In development

- **Verification moved off every push and onto a nightly schedule, on WebKit alone**
  ([docs/audits/ci-verification-audit.md](docs/audits/ci-verification-audit.md)). Counted over the fifteen runs of
  Publish GitHub Pages to 2026-11-24, `verify` reached a verdict **four times in fourteen**: ten cancelled, three
  failed, one clean. A complete run takes 60 to 75 minutes and that day's releases landed 24 to 48 minutes apart, so
  each release cancelled the verification of the one before it. The `cancel-in-progress: true` rule did exactly what
  it said; the cadence changed under it, and nobody chose to stop verifying. The cost was specific: the release gate
  run before every push is Chromium only, so WebKit — the one engine nothing else exercises — was the one almost
  never verified. When it did run, on 0.188.0, it found a real failure no Chromium run could have.
- The Chromium leg of that matrix is gone. The local gate covers Chromium on every push, so it verified what had
  just been verified; dropping it halves the browser work and leaves the engine that needs it.
- It lives in its own `verify.yml` rather than on a schedule inside `pages.yml`, because a `schedule:` trigger there
  would fire `build` and `deploy` nightly too, republishing an unchanged site, unless every job were gated on the
  event name — editing the publishing path in order to change the verification path. `pages.yml` is `0 added, 213
  deleted`: `build` and `deploy` are byte-for-byte what they were.
- What this gives up, stated in the audit: a WebKit regression can now sit on `main` for up to a day, against a
  theoretical within-the-hour that was in fact achieved once in fourteen releases. `workflow_dispatch` is there for
  the day that is the wrong trade.

## 0.191.1 — In development

- **A shared-project test waited on the wrong thing**, and it had been red on CI for one run while passing locally
  every time. `shared-sealed.browser.mjs` polled the fake GitHub's commit count and then read the tree at
  `refs.main` — but the stub pushes to `commits` when `POST /git/commits` creates the object and moves `refs.main`
  in a *later* request, so the poll went true while the tree was still the previous one, with every sealed file
  naturally still in it. The gap is between two HTTP calls, which is why only a loaded runner ever saw it. It now
  waits for the save itself to report `Saved.`, which is written only after `saveToRepository` resolves and that
  awaits the ref PATCH — the same signal `shared-project.browser.mjs` waits on before each of its commit-count
  assertions, and the same reason the poll twenty lines above it already waited on `refs.main`.
- That test now also asserts the project is made open **in one commit**, which its own docstring has always claimed
  and which the old `> opened` comparison never actually checked.

## 0.191.0 — In development

- **The drawing map pans until you start a line** (Line layer 0.4.0). The practitioner: *"If I try to pan with my
  mouse, it draws a point instead of panning. Perhaps we should have a 'Start Line' button together with the 'Finish
  Line' button. So unless 'Start button' is pressed the mouse should be able to pan the map."* The editor bound
  `click` unconditionally, and Leaflet treats a press and release that barely moves as a click, so every attempt to
  look around the map left a position behind. **Start a line** arms the drawing; until it is pressed a click does
  nothing. Finishing returns the map to panning, so the next click starts nothing. The study area's dialog has had a
  tool mode since it was built — `setTool('pan')`, and it opens in it — and this is the same thing under the
  practitioner's own name for it.
- One deliberate divergence from that dialog: it disables dragging while drawing and this does not, because a route
  can be longer than one screen. Leaflet does not fire `click` when the map moved under the mouse, so a drag pans
  and a click lays down a position, and the two do not collide.
- The mode is shown three ways — the button's pressed state, a crosshair cursor and an outline round the map —
  because one small cue is easy to miss.
- **The status sentence under the drawing map was blank when the dialog opened**, so the one line telling the reader
  what to do was missing exactly when it was needed. It was written by a function that looked the dialog up by its
  id, which is not resolvable while the dialog is being wired; it now writes into the element the caller already
  holds, and is rewritten after every redraw. Found while fixing the panning, and it compounded it: there was
  neither a mode to see nor a sentence saying what the mouse would do.

## 0.190.0 — In development


- **A map carrying polygons draws its line layers** (Map 0.49.0). Hand-drawn routes showed on the interactive
  preview and on no static figure — not in Results, not in Notes, not in a download. A map with polygons is drawn
  by a second renderer, chosen before the lines are ever reached, and that one had never been given them. Both now
  draw the lines from one function, over the areas and under the points, and both frames span them, so a route
  running past the polygons' own extent is no longer clipped. Reported from a South Sudan / DR Congo border
  workflow; it is the eighth time a renderer picked from the wired ports dropped a layer, and the test that catches
  it joins the seven before it in the same file.
- **A line layer is a layer the practitioner can manage.** The `lines` port was absent from the table the layer
  list is built from, so Manage layers listed everything else: a line layer could not be renamed, reordered, put
  in a group or switched off, and no receipt recorded that the map had drawn one. It is now a kind of its own,
  `fw:LinesLayer`, drawn over the street network and under the points, and the switch is honoured by the figure.
- **A line drawn by hand shows which way it runs** (Map 0.49.0, Line layer 0.3.0). A LineString is an ordered
  sequence, so the direction is already in the data and an arrowhead only shows it — which matters because a flow
  drawn from a camp to a clinic is not the same as one drawn the other way. A layer read from a GPX, or taken as the
  border two areas share, is left unmarked: the order of positions in a published track or a computed border is an
  artefact of the file, and an arrowhead would assert a direction nobody chose. Configure… offers the three ways —
  where the lines were drawn by hand, always, never — and the last two win over the source. The static figure, the
  interactive map and the Line layer editor draw one head from one definition of which way a line runs: the last
  segment that has any length, measured where the line is actually drawn, so the head does not lean away from its
  own line far from the equator, and a line of one repeated position gets none rather than one at an arbitrary
  angle. In the editor the arrowhead replaces the filled end dot, so what you draw reads the way the figure will.
- **Polygons under lines are ground, not categories.** Where lines are drawn over polygons built from the study
  areas, the areas lose their hue per feature and are drawn in one wash — the rule points have followed since
  2026-11-23. The practitioner: *"the polygon shading — should follow same rule as points, that when lines are
  present, no polygon shading as default."* A layer read from a file, and a layer carrying a value, are untouched.
- **The Line layer drawing map shows its basemap** (Line layer 0.3.0). It opened as one tile in a corner with grey
  around it: the dialog's panel has no size when the map is mounted, so Leaflet measured a container of nothing and
  asked for a single tile. It now settles after layout and keeps up with every later change of size, full screen
  among them, as the pin editor and the georeference dialog already did.
- The lines are attached to a map's value **before** its layer list is built, not after, so the layer list can see
  them and the measurement of how wide each layer is drawn uses a frame that spans them — the wrong-frame trap that
  measurement's own comment warns of.

- **Find health facilities has the standard Inspector** (0.5.0). The practitioner: *"The Inspector for Find health
  facilities seem to be non-standard, looking at the Configure button and the Retrieve facilities button."* The two
  shared one row and the primary emphasis moved between them with the step's state, so the one thing to do next was
  whichever the markup had decided, beside a button no other standard step shares its row with. **Configure…** is
  now alone and primary in Settings, as it is everywhere else, and **Retrieve facilities** — or **Fetch the
  registers** — is in Result beside what it produces, primary until there is something and primary again when what
  is held is not what the settings now ask for. That is the shape Tabular data took on 2026-11-14 for the same
  complaint, *"the Fetch the table is there, just not conspicuous"*. The two are not one kind of act: Configure…
  opens a dialog, and Retrieve reaches the network and changes what the step holds.
- The Configure… dialog told the reader to retrieve **"under Settings"**, which was not where the button was even
  before this change. It names Result now, and says to apply the settings first. The matching dialog and the
  refusal raised when no register has been fetched said the same wrong place.

## 0.189.0 — In development

- **Routes and flows drawn on a map** (Line layer 0.2.0), as pushpins place points. Click to lay down each
  position, finish the line, name it. **The order of clicking is the direction** — a flow drawn from a camp to a
  clinic is not the same as one drawn the other way — so both ends are shown and Reverse turns a line round
  instead of making you draw it again. Nothing new had to be invented for that: a line is an ordered sequence
  already, which is the one thing a hand-drawn line carries that a derived one gets from its data.
- A drawn layer **names no file**, because there is none, and a layer set to be drawn with nothing drawn is
  refused in those words rather than being sent after a GPX.
- A refusal in the drawing editor **stays on screen**. "Finish the line" wrote why it would not and the running
  commentary overwrote it on the same tick, so it looked like the button did nothing.

## 0.188.0 — In development

- **Find health facilities reads the country from the study area connected to it.** The dialog already asked the
  study area ("the country the study area says, filled in where the step names none") and the wiring already
  supplied it, but a new step was created carrying `country: 'PHL'`, so the step always named one and the study
  area was never consulted. A DR Congo study area offered Philippines. The default is now empty, so what the area
  states is what the dialog shows.

- **A scope is held to one degree only where a raster would be windowed through it** (Geometry buffer 0.7.0). The
  limit was unconditional, so a workflow holding no raster at all was refused by a rule whose own sentence is about
  rasters — reported with two study areas, a border, a buffer and a Map, told that "a study area windows every
  raster this workflow reads" when it read none. The refusal now names the steps it is protecting, and offers the
  way out that was always true and never said: take the raster out of the workflow.
- **Points can be kept inside a polygon layer, not only a study area** (Keep points inside the area 0.4.0). Every
  clip masked by a study area, so a buffer too wide to BE a study area — ten miles around 656 km of border spans
  more than three degrees — could not be clipped by at all. Two correct rules meeting in a dead end. Both ports are
  offered and neither is required alone; both connected is refused, because a point inside one and outside the
  other has no single answer. A point kept by a layer records **which** polygon held it, since a layer is many
  masks and "inside the buffer" loses which one.
- **A computed layer is offered by name in the dialogs downstream.** A dialog read the features on a port from the
  source node's own data, which a layer read from a file has and a computed one — a border, a buffer, a clip — does
  not; the fallback looked in the run's outputs, which hold the workflow's output nodes alone and could never match
  an intermediate step. So Geometry buffer showed a text field reading MANILA with 32 stretches of a border
  connected, under the words "Run the workflow once and this step will offer the points by name" — a promise the
  code could not keep. Each step's named layer is now kept with the run, capped at 500 features and absent rather
  than truncated past it.

## 0.187.0 — In development

- **Map a column’s terms to a vocabulary** (new widget, 0.1.0). Each term in a column gains the Wikidata entity a
  person judged it to name, so rows carry an identifier that means something outside the workflow. **You choose
  each link**, and the reason is measured: on four terms from work in hand, Wikidata's own first result was the
  wrong one once in four — searching "Kano" returns the city, where a table of Nigerian LGAs means the state,
  fourth down. Three of the four carried a competing entity of another kind in the top four, a ward against its
  local government area and a pathogen against its disease. A run asks Wikidata nothing: the choosing happens in
  Configure…, so a run needs no network and a saved workflow reproduces exactly. "None of these name it" is kept as
  a decision and held apart from a term nobody has looked up. No worked example uses it yet.
- **A locator inset no longer moves the areas away from their marks** (Map 0.48.1). On a map carrying a polygon
  layer, the areas were drawn zoomed to the locator's box while the point marks, the link lines and the basemap
  stayed at the whole extent — so an area drawn around a pin appeared about six times too wide and off to one side
  of it. Reported from a 50 km buffer around a mine and seen by two readers; the buffer's own geometry was correct
  to within a millionth of a degree. The boundary renderer had always chosen the frame this way; the polygon one
  had not.
- **Geometry buffer's preview shows the ground and the point** (0.6.0), so a radius can be judged against the
  ground and against the pin before a run. Its caption no longer says "kept apart" under a step set to combine.
- **A raster placed by a matrix is read** (Raster input 0.16.0). A GeoTIFF states where its cells sit either as a
  pixel scale with a tie point or as one 4×4 matrix; only the first was read, and the second was refused with a
  message blaming a rotated transform. GeoServer's WCS writes the matrix form, so **every raster window pulled from a
  WCS was refused**, and the message sent the reader looking for a rotation the file does not have. Found pulling the
  Malaria Atlas Project's walking friction surface, whose matrix is a pure scale and shift. A matrix that turns or
  shears the grid is still refused, now for being unfit rather than for carrying the tag.
- **Travel time over ground** (new widget, 0.1.0). It reads a friction surface — a raster whose cell value is the
  cost of crossing one metre of that cell — and writes onto each place the minutes to the nearest starting point,
  spreading out from every starting point at once so "nearest" costs nothing extra to ask. It is for where the walk
  is mostly not on a mapped road, which is where **Reachable junctions** and its street network describe the wrong
  journey. A place the walk cannot reach keeps its row, with nothing in the time column and the reason beside it: a
  settlement nobody can reach is usually the finding. The answer is at points and never as a new raster, because a
  computed surface has no file and would otherwise carry the source raster's digest while holding values those bytes
  do not produce. No worked example uses it yet, and it has never been run against a published friction surface.
- **Its cell limit was measured rather than chosen.** 16,000,000 cells, where the cost is linear at about a quarter
  of a microsecond a cell in Chromium and memory binds before patience does. The first reading of that limit was
  four times lower and measured the queue instead of the ground; see
  [experiment 231](docs/experiments/231-travel-time-over-ground.md).

## 0.186.0 — 2026-11-23

- **A typed table no longer claims a file it does not have** (Tabular data 0.21.0). It was stored as `typed.csv`,
  which the machined note stated as "Read from `typed.csv`" and the receipt asserted as `fw:sourceFile`. The note
  now says the rows were typed into the step and the receipt records `fw:enteredByHand` with their digest. Where the
  values came from, and under what licence, stays yours to state in Describe columns.

## 0.185.0 — 2026-11-23

- **Three workers are typechecked as workers.** `netcdf-worker`, `sha256-worker` and `space-time-scan-worker` were
  in neither worker tsconfig, so they were checked with the DOM lib and a window-only call would have compiled and
  failed in the browser. Checking them found none; the hole was open and nothing had fallen into it.
- **One HTML escape**, in `inspector-kit.ts`, replacing four identical copies. The duplication turned out to be
  three different rules rather than one copied: ten modules escape five characters, seven places escape four, and
  two escape three. The weaker variants are recorded, not changed — altering what they escape changes their output.
- The code and framework review of 2026-11-23 is committed to `docs/audits/`, with what was acted on recorded in it.

## 0.184.0 — 2026-11-23

- **A map carrying polygons draws its inset** (Map 0.48.0). It was composed for every other kind of map and not this
  one, so a box picked on such a map was kept, offered in Configure… and silently never drawn. The polygon renderer
  now takes an extent to draw over, as the other one always has, and the box is tested against its own frame — the
  two disagree exactly when polygons are present. The enlarged part draws no key: a key belongs to the whole map.
  Polygons also leave the picker's exclusion list. A raster, a street network and panels still cannot draw one.

## 0.183.0 — 2026-11-23

- **A magnifier on the pin editor's map** (Point data 0.19.0). A glass follows the cursor and shows the basemap
  enlarged without moving the map — the ground is the point, so what is magnified is the tiles, not the marks. A
  click under the glass still places a pin. It stops at the depth the provider's tiles reach rather than magnifying
  blur, and with the basemap off it says there is nothing to magnify. Raster basemaps only, which is all the pin
  editor offers.

## 0.182.0 — 2026-11-23

- **Area around a point is now Geometry buffer** (0.5.0). The step took lines and polygon layers as well as points
  from 0.4.0, and the old name said point. *Buffer* is the glossary's own word — Compute reads "Derive geometry for
  each feature — buffer, clip, catchment, reproject, sample a raster onto points". The node type is unchanged, so
  saved workflows are untouched, and a label already typed on a node stays as it was.

## 0.181.0 — 2026-11-23

- **A layer drawn too small to read says so** (Map 0.47.0). A 10 km area beside country-sized polygons was drawn 2.6
  of the figure's 850 units, under an 8-unit mark — drawn, listed, and impossible to find. The figure's note now
  names it and gives its width. The threshold is the mark rather than a chosen number, and the fact is said rather
  than fixed: the frame is deliberately the union of everything drawn.

## 0.180.0 — 2026-11-23

- **Three more Preview sections say what the step makes**, instead of holding only a walkthrough of a made-up case:
  Calculate area measures the connected area in the unit chosen (0.3.0); Clip polygons says how many survive the cut
  and how much ground before and after (0.4.0); Summarize points to polygons says how many points fall in a polygon,
  in none, and in more than one — the last being the number a reader must not add up (0.4.0). Each is computed with
  the step's own function, so what is previewed is what it does, and a preview that cannot be computed says why
  rather than showing nothing.
- **A step's own ports are no longer widened to its neighbours'.** Asking Area around a point which features it may
  buffer rightly spans its points, lines and polygon ports, because it shows them as one; applying that to every step
  made Summarize points to polygons count its own polygon layer as points.

## 0.179.0 — 2026-11-23

- **Tabular data takes a table you type** (0.20.0). A sixth tab, **Type or paste**: a short table written or pasted
  as free text, counted and drawn as a table while you type, a ragged line named with its number, and **Save as CSV**
  to keep it on the device. Every other tab fetches from somewhere, so a list you compose yourself had to be made
  outside Fieldwork and imported.
- **A record's popup says what the record is** (Map 0.46.0), not only where it is: its columns, skipping empty
  values and `NA`. Without them a join could change every row and the map would look identical.
- **The map's layer controls are keyed by the layers it drew** (Map 0.46.0). Keyed by the edge, a slider for a layer
  that arrived through a clip wrote a setting nothing read, the mark sliders were crossed, and the Pin class picker
  offered nothing for it.
- **Points read from a table no longer carry the melt** (Point data 0.18.0): a record read `measure: Year` and
  `value: 1952` as though the file had columns called measure and value.
- **Keep points inside the area counts what it will keep** (0.3.0), before it runs, and the outline setting moves
  records between kept and set aside as it is ticked.

## 0.178.0 — 2026-11-23

- **Area around a point buffers points, lines or polygons** (0.4.0), and offers to combine the areas into one study
  area or keep each one separate as a polygon layer. Combining says what it costs: the parts' summed area, the area
  once combined, and how much is covered more than once. Preview draws the areas to scale with their overlaps, from
  the same construction the run uses.
- **Its radius goes to 50,000 m** (0.4.0). The dialog had capped it at 5,000 while the rule allowed 50,000, so a
  radius the step would have accepted could not be typed.
- **The one-degree span limit is held to study areas** (0.4.0), which window every raster a workflow reads. A polygon
  layer windows nothing, and the limit applied to one refused buffers drawn across two provinces.
- **The pin editor's map takes the room the dialog has**, and **Full screen** gives it the whole window with the pin's
  form beside it (Point data 0.17.0). Siting a pin is reading the ground around it, and a fixed 400 px window made
  that a sequence of zooms.

## 0.177.0 — 2026-11-23

- **Area around a point offers the points it is connected to** (0.3.0). The dialog asked for a point by name against
  a placeholder of `MANILA`, while the port it reads was already wired and the step already matched on the name or
  the id. Reported with a Mines layer carrying a single mine: *"This should not be guess work as the input port is
  connected."* It now lists the points the connected layer carries. One arriving is the choice, so the dialog opens
  on it; several, and the list opens on *Choose a point* and refuses until one is picked. A source that holds no
  records of its own and has not run offers none, and says a run will populate it.

## 0.176.0 — 2026-11-23

- **A point layer that reaches the map through another step can be moved again** (Map 0.45.0). Reported with one mine
  pin and 1,171 bat records clipped to the DRC's provinces: the pin was drawn and buried, and putting Mines at the top
  of Manage layers changed nothing. The layer list keyed each layer by the edge it arrived on while the marks are keyed
  by the identity the data carries — a clip passes the input's identity through, so for a clipped layer the two names
  disagreed, and a layer the list cannot find is lifted above every layer it can. Both now read the same identity.
- **The smaller point layer is drawn on top by default** (Map 0.45.0). Arrival order decided this before, which is how
  one pin ended up under a swarm and why the pumps had to be lifted over the cholera deaths by hand on 2026-11-12. It
  is the reading the stack already applies between kinds; a position set in Manage layers still wins, and the dialog
  now shows how many marks each layer holds.
- **The interactive map's stack is a pane per layer, not arithmetic** (Map 0.45.0). Reading the z-indices above:
  *"Why do we have 10,000 layers when the points really are a layer group?"* They are a group, and the groups were
  already there — for switching on and off, which reserves no depth of its own. So order was a number and visibility
  was structure, and the two knew nothing about each other. Each point layer now draws in its own Leaflet pane at its
  place in the stack, which retires the stride of 10,000 and the 100,000,000 that held the sites above it; a layer with
  no position cannot outrank anything, because the pane is its position. Leaflet's latitude ordering is left to do what
  it is for, within a layer. The static figure and the GPU renderer already ordered by drawing in order.

## 0.175.0 — 2026-11-23

- **Polygons built from the study areas are the ground a point stands on** (Map 0.44.0). Four provinces under one mine
  pin were drawn in four colours, which says they are four different things. Where points are drawn over them such a
  layer is now drawn in one wash and keyed by the layer; each polygon is still named in the layer list and its popup.
  **Configure… → Polygons** chooses *Where no points are drawn over them*, *Always* or *Never*. A layer read from a
  file keeps its colours whatever else the map draws — the Thames' two reaches under an intake are two things a reader
  wants told apart — and a layer carrying a value keeps its classes either way.
- **A study area can carry its country outline, for context** (0.13.0). Picking a level below ADM0 offers it; it is
  read from the same geoBoundaries release as the units, as the simplified geometry (339 KB for DR Congo against
  2.4 MB), with its own licence, and drawn under everything as a line with no fill. Nothing measures against it.
- **Point data reads an Excel workbook** (0.16.0), its sheet read as a CSV is and its coordinate columns proposed by
  name.
- **Two tests made fit for CI's WebKit**, both failures of the tests rather than the application: the Show me how cases
  put fifteen steps on one canvas, where the ones underneath could not be clicked, and each now opens a canvas holding
  the one step it exercises; and the manual-page test opened a manual before the Inspector had switched to the step it
  had just added, so WebKit showed the page of whatever was selected before.
- A checkbox in the study area's right-hand column is drawn as a checkbox. The rule giving that column's inputs their
  full width and border caught checkboxes too, so the new one appeared as a wide bordered box with its words wrapped
  underneath; the rule now excludes them, as the input editor's already did.

## 0.174.0 — 2026-11-23

- **A table's count says what it counts** (Tabular data 0.19.0). A file of 18,409 records read wide was reported as
  **92,045 rows**, five per record, on the Inspector, in the results metrics, in the write-up's prose and in the
  receipt. The practitioner, on reading a line list: *"And could be a dangerous interpretation."* It reads *18,409
  records* now, counted from the subject keys the melt declared; the receipt asserts `fw:tableRecordCount` beside the
  row count, never in place of it.
- **A coordinate column is read as a key, not melted into a variable** (Tabular data 0.19.0). Proposed as variables,
  latitude and longitude were melted into `measure` and `value`, so the table carried no coordinates and Point data had
  none to offer. Carrying them also took the African Bat Database's repeated-key findings from 207 to 69.
- **Point data proposes the table's coordinate columns** (0.15.0) when it reads points from a table, by the same names
  its own CSV import has always used. Shown in the selects, where they can be changed.
- **An audit** of where the internal long table is presented as the practitioner's
  (`docs/audits/melted-counts-audit.md`), and the direction it settled, `tables-are-presented-wide`: nine surfaces
  stating a melted count, three of them away from the screen, and eight dialogs offering the long table's columns.

## 0.173.0 — 2026-11-23

- **A raster window read at a web address can be read again from a copy of that file on this device** (Raster input
  0.15.0). It is read where it sits, never copied, and the window read from it is checked against the window that was
  kept, so another file is refused by name. A raster too large to keep then reads its full cells from that copy at each
  run instead of asking the host. Measured on GHS-POP's 12.3 GB global grid: Rwanda's window in 5 seconds, Botswana's in
  16, both byte for byte what the JRC's copy gave, and the 2020 grid refused for a 2025 window (experiment 209).
- **A CSV is read, not refused, for its headers or its encoding** (Tabular data 0.18.0, Point data 0.14.1). A column the
  file gives no name — R writes its row numbers that way — is read as **column_1** and said on the Data quality tab,
  where the whole file was refused before; a name an earlier column has takes **_2**. A file that is not UTF-8 is read
  as Windows-1252, as Excel on Windows writes it, and said, where accented place names came through as replacement
  characters. Found reading the African Bat Database's 18,409 records.
- The Data quality summary counts in plurals: "4 column whose values were read…" now reads "4 columns".
- **Experiment 230** proposes carrying each source's year with its values and saying where different years meet.

## 0.172.2 — 2026-11-23

- **The population example runs end to end again**, for Rwanda and, for the first time in the browser, Botswana.
  Neither workflow had run past Append rows since 2026-11-20:
  - **Append rows** (0.5.1) lines a table's one column of names up under two of the others' columns where they hold the
    same names, as Botswana's population models do in **id** and **name**; the census had lost its **id**.
  - The example selects the census rows as Append rows names them, "2022 census" (example 04fae26, pinned).
- **Chart** (0.25.2): a panel of zeros no longer labels its axis 0.000000.
- Experiment 209 records the run: Botswana's 0.1, 0.1 and 11.9, and Rwanda's 5.6 from a local copy of GHS-POP.

## 0.172.1 — 2026-11-23

- **Raster input's picker starts at what the step holds** (0.14.1). A GRID3 2025 step's Configure… was titled
  *Population (WorldPop)* and offered WorldPop's newest year, 2026, as was a WorldPop 2025 step's. Found re-running the
  population example. Nothing a step held was changed by it.
- **Dead code removed**, about 500 lines: unused imports, variables and parameters; handlers for Inspector controls
  earlier moves took away; the old Georeferenced map image panel and its wiring; a main-thread extract reader replaced by
  the worker; and the per-browser widget run count, recorded on every run and shown nowhere since the widget catalog
  dropped it on 2026-11-09. A graph limit the Overpass query never read is no longer passed to it. The extract cap of
  122,061 junctions, shown nowhere since 2026-11-11, leaves the caps register; experiment 129 keeps the measurement.

## 0.172.0 — 2026-11-23

- **The Inspector move is done.** Street network (0.14.0) and Reachable junctions (0.6.0) leave the old panel for the
  standard Inspector: one sentence of what the step does, every setting in **Configure…**, and the run's counts in the
  Result. Street network keeps its download, file or extract in Settings. Find health facilities' Inspector (0.4.3) moved
  out of the application's main file. Reachable junctions has a manual page.
- **Retrieve facilities no longer refuses itself.** On a step naming no country, it filled in the study area's country
  and then refused the retrieval, saying the workflow had changed while it ran.
- **Show me how** for Convex hull, Voronoi catchments, Network isochrone, Mean center, Move points in a donut and
  Aggregate points to H3 cells, each ending on what the step makes of its made-up shapes.
- Experiment 225 records Kano at 30 m against 90 m on GRID3's walking surface.

## 0.171.1 — 2026-11-23

- Two tests made fit for CI: the line layer's tests saved pictures to a folder that exists only on the machine they were
  written on, and the georeferencing test's quick drag took longer than the 300 ms hold on a loaded runner.

## 0.171.0 — 2026-11-22

- **Line layer** (0.1.0, experiment 229): routes, tracks and roads read from GPX, KML, KMZ or GeoJSON, or the border two
  study areas share, found where their outlines lie within 500 m of each other. Map draws lines (0.43.0), static and
  interactive.
- **A Map with no study area of its own** places its points against the study areas its polygon layers were read from,
  together (Map 0.42.1), where it stopped asking for one.
- **Hagelloch's peak, made**: a fixed time to the rash joined with the prodrome's last days weighted fits the record best
  of any model, the peak day inside the runs' range (experiment 199).
- **An Apply made while the workflow is running is no longer lost.** A Configure… dialog opened before a run began
  dropped its Apply without a word and closed as if it had applied. It now says the workflow is running and keeps the
  settings until the run is done.
- The Coordinate reference system card points to Table output, where it named the retired Reproject points.

## 0.170.1 — 2026-11-22

- **CI's verify runs two test files at a time**, where it ran one; WebKit's run had come within minutes of its
  75-minute limit (the gating audit, replayed after the Inspector move).
- **A WebKit test made steady:** Hagelloch's who-infected-whom test waits for the reloaded page and blocks the service
  worker, as its neighbours do; it had failed 0.170.0's WebKit verify.

## 0.170.0 — 2026-11-22

- **Rasters on one map** (Map 0.42.0). With nothing arranged, several rasters are now drawn over one frame, as Arrange's
  *One map* always said, static and interactive, on one key per unit; where two overlap, the later is drawn on top and
  the map says how many cells. Panels when Arrange chooses them.
- **Points over rasters.** A point layer wired to a Map with rasters, a single pin included, is drawn over the cells.
- **Manage layers governs a map of rasters:** its order, names, groups and switches; a group is one entry in the
  interactive layer list. The Map's study area is a layer of its own.
- **Configure…'s preview** draws the rasters, where it drew one study area's outline.
- **A series chart's legend** shows each series as a filled square in its colour, as the bar charts' do (Chart 0.25.1).
- **Travel time to care, in the kernel** (experiment 225): least time to the nearest facility over a friction surface,
  checked against the Malaria Atlas Project's own method on Kano to 0.022%; not yet a widget.

## 0.169.0 — 2026-11-22

- **The Inspector move, batch D**: Table output, Polygon layer, Georeferenced map image and Find satellite products now
  each live with their dialogs in a module of their own, as does Sample a raster's dialog for satellite files. Nothing
  they do changed, except:
  - Find satellite products is on the standard Inspector: its name, one sentence of the product chosen, Configure…
    opening the same chooser, and the product's card under Result, where it had its own label field and button.
  - Table output's older Input mode choice is retired; what is connected decides how a table is shown.
  The main file is about 390 lines shorter (8,942).
- **Six process steps on the standard Inspector**: Convex hull, Voronoi catchments, Network isochrone, Mean center, Move
  points in a donut and Aggregate points to H3 cells. Each shows its name, inputs, one sentence of what it does with
  Configure…, and what its last run made: the hull's area and span, the catchments or regions drawn (and the sites that
  reached nothing or were routed off the network), the centre and the points used, the points moved, the cells kept.
  - The UTM zone is set in Configure…, which says which zone the workflow's coordinates suggest, offers it, and says
    how far the chosen one stretches distances. When the two disagree, Settings says so without opening the dialog.
  - Network isochrone takes one travel time or several in one field, so it no longer shows a single time beside the
    several it uses. Its dialog says how far the longest time goes at the stated speed.
  - Apply is held, with the reason, on any setting the run would refuse.
  - Voronoi catchments says that a straight line ignores roads, rivers and travel time. It has a manual page, as do Mean
    center, Move points in a donut and Aggregate points to H3 cells.
- **Summarize points to polygons' Show me how** is redrawn: houses named House 1 to 6, a table of what each holds and
  where it falls, and the two units shaded by their totals at the end, with the house on the shared edge counted in both.
- **A dialog no longer throws when a field it is redrawing still has focus.** A redraw asked for during a redraw now runs
  after it.
- **Reproject points is retired into Table output.** No step computed with its points: every step that measures in
  metres projects for itself and states its zone. A Table now shows point data in metres where asked, as easting and
  northing in a UTM zone, chosen in Configure… with the zone the workflow's coordinates suggest. John Snow's deaths
  example shows the pumps that way, and a saved workflow opens with each Table Reproject fed reading its source in the
  same zone. docs/audits/reproject-retired.md.
- **The Inspector move:** the three sea-level steps are retired, so no batch E; Find health facilities is what is left.

## 0.168.0 — 2026-11-22

- **Stress tests of the table operations, second pass** (TODO 1a): the steps that read a table through other ports, a
  wide read, and 250,000-row tables (Select rows, Total within groups and Relate a column each within 2 seconds here).
  - Cases by period 0.8.0: a blank count is refused, not counted as zero; the dates it cannot read are counted in its
    sentence, with what they held; a range too long to draw names its first and last date.
  - Rate 0.5.0: a denominator of zero gives no rate, with the reason, rather than a refusal about proportions.
  - Deduplicate records 0.4.0: two rows blank in a compared column wait for a person rather than merging. Its
    Inspector and dialog moved out of the application's main file, the first of the Inspector move's batch C.
- **A density surface computed on the graphics card, as a spike** (experiment 225): the same kernel density surface in
  the Rust kernel and in WebGPU, compared cell by cell on four browsers. Not used by any widget yet.

## 0.167.0 — 2026-11-22

- **The order of a pin's form**, Point data 0.14.0: under Add a form field, each field moved up or down; every pin's
  form follows. Experiment 09 is closed.
- **Study design's answers are kept until Apply**, Study design 0.8.0: its paged dialog is the standard one; Cancel, ×
  and Escape ask before discarding answers.
- **206 closed into 228**: its open questions, and the syndromic methods not yet offered, are 228's open items.
- **Stress tests of the table operations** (TODO 1a): six made-up tables, each built around one trap, through eight
  table steps and a chain of them. No step hung, none refused with a programming error, and no missing or unreadable
  value read as zero. Four things changed:
  - A refused run names the step that stopped it: “Group” stopped the workflow.
  - Total within groups 0.7.0 says rows with a blank key, and names differing only in capitals or spaces.
  - Relate a column 0.14.0 counts an empty cell as one of a key's values, rather than relating the other one.
- **Keys proposed from their values**, Relate a column 0.14.0: with nothing chosen to match on, the pair of columns whose
  values link most is proposed, though their names differ ("LGA" and "lga_name"), with how many keys it links; codes
  facing names are said.
- **Columns whose values match**, shown in Relate a column and Append rows 0.5.0: every pair of columns across the
  tables that share values, with the counts, each a button that chooses it (Match on these, Stack under).

## 0.166.0 — 2026-11-22

- **Pins in the field**, Point data 0.13.0 (experiment 09):
  - **Add a pin at my location** and **Move this pin to my location**. Each pin says where its position came from: this
    device with the accuracy it stated, the map, typing, or its photo.
  - A form field can be **required**: a pin lacking it is named, and still saved. A **Date and time** field type.
  - The pins as a **table** in the editor, and markers **coloured by Category** with a legend.
  - **Find a place** by name, through OpenStreetMap's Nominatim, only when Find is pressed. Positions typed in degrees,
    minutes and seconds.
  - A **Basemap** choice in the editor, Esri's satellite imagery on your own key among them. **Undo** before Apply.
  - **Photos** on a pin, up to ten with captions, 2,048 px, the photo's location and camera details not kept. Photos
    go into encrypted backups only.
  - **GPX, KML and KMZ** waypoints import; tracks, routes and shapes are counted and not imported.
  - The editor is now the **standard dialog**: Cancel and Apply where Save Edits was.
- **A study area with no area yet is named** when a run stops for it: "Rwanda" has no area yet.
- **Study areas left out of a map**, Map 0.41.0: a checkbox for each study area a map's polygon layers are made of;
  unchecked, it is not drawn in Results, the preview or the write-up. The pin editor's map has one for each outline.
- **A basemap key that is refused says why**, Map 0.41.0: the provider's status and words, such as CARTO's 403 for a key
  locked to Fieldwork's published address when used on a local server. Before, the map said the provider did not answer.

## 0.165.0 — 2026-11-22

- **Study design on the standard Inspector**: one sentence of the design, what it reports, its period and its unit, then
  Configure…, and the checklist under Result. The period, the unit of analysis and the note moved from the Inspector into
  the dialog's first page, beside the design.
- **The Inspector move, batch B**: Transmission chains, Space-time scan and Study design now live with their dialogs in a
  module of their own; nothing the first two do changed.

## 0.164.0 — 2026-11-22

- **Six Inspectors out of the application's main file**, the first batch of the Inspector move: Cases by period, Rate,
  Select rows by value, Total within groups, Two-by-two and Regression now each live with their dialogs in a module of
  their own. Nothing they do changed; the main file is about 390 lines shorter.

## 0.163.0 — 2026-11-22

- **Show me how for every spatial step.** Sample a raster (at points, or over areas), Keep points inside the area and
  Summarize points to polygons each show what they do on made-up shapes from their Configure…, ending on what the step's
  own function makes of them, as Area around a point, Calculate area, Clip polygons and Join a table to the study area
  already did. A test steps through all seven.
- **Keep points inside the area and Summarize points to polygons on the standard Inspector**: name, inputs, one sentence,
  Configure…, and what the last run said; Summarize offers the arriving points' numeric columns to add up, and has a
  manual page.

## 0.162.1 — 2026-11-21

- **The checks on GitHub run again.** 0.162.0's new validation fixture read the syndromic example from a copy beside the
  repository, which GitHub's runner does not have, so the checks stopped before any browser test ran. It now says the
  example is not there and the rest go on, as every other fixture does.
- **Detect unusual counts' lab check is recorded** as its evidence (check 53), and the lab is pinned at it.
- **A second study area's boundary can be chosen again.** The area dialog, reused for every study area, kept the last one's
  country, units and terms on screen with nothing behind them, so a unit chosen there was refused and the area stayed
  unconfigured (found adding Rwanda after three others). Each opening now starts the picker empty. Study area 0.12.1.
- **Study areas dropped on a Polygon layer each take an input of their own**, a new one added when all are held, up to
  six; no trip to Configure…. Polygon layer 0.8.0.

## 0.162.0 — 2026-11-21

- **Backups are encrypted by default.** Back up offers *This project, encrypted* and *This workflow, encrypted* first:
  a sealed file only the people you choose can open: you, while your identity is open; project members who gave their
  key; anyone whose key you paste (Identity → *Your key for encrypted files*, safe to email); or a passphrase. Import
  opens one with your identity or asks for the passphrase. Plain copies stay, named as readable by anyone with the
  file; *Backed up* says encrypted or not. An identity made before this gains its key the next time it is opened, and
  is given back to keep. Browser storage stays unencrypted. Export as repository is encrypted the same way.
- **Shared projects are encrypted on GitHub by default.** Each file is sealed for the project's members, each with their
  own identity; a member gives their key with This is me, or another member pastes it for them. A member with no key is
  named at the save. Unticking *Encrypted on GitHub* makes a project open, for a worked example. A project shared
  before stays as it is until someone chooses.
- **Figures print the OpenStreetMap copyright address** in their basemap credit, as OpenStreetMap asks of print.
- **Chart draws series together**: several series on one scale in one panel, each with its own mark (bars, a line, a
  dashed line), and a triangle where another series is 1, such as Detect unusual counts' *signal*.
- **Detect unusual counts shows each method's computation**: its statistic against its limit (CUSUM's running sum
  against *h*, EWMA's smoothed count against its widening limit, EARS's count against mean plus *z* standard
  deviations), and the table gains a *limit* measure, so a chart can draw it.
- **Apply ruleset's JSON view lists the arriving columns**: each with its kind and a few values, marked where the
  ruleset declares it; **Add to fields** writes the entry; a declared column that does not arrive is named, with the
  nearest arriving column.
- **The syndromic surveillance example draws its charts**: visits by day per syndrome, gastrointestinal visits against
  the threshold, CUSUM's sum against *h*; and a third workflow, *How do the methods differ?*, runs CUSUM, EWMA and
  EARS C2 on the same days, each drawn as it computes.
- **Checked:** Detect unusual counts in the Validation Lab, in Python (check 53: four series, a seasonal one among them,
  every period the same as numpy's); a JPEG-compressed YCbCr picture GeoTIFF read through terrio, byte for byte as GDAL
  reads it.
- **Select rows reads the values of a step's table after a run**, so it can follow Detect unusual counts and other steps
  whose columns are known only once they run.

## 0.161.0 — 2026-11-21

- **Writing rules as JSON, a guide** in Apply ruleset's manual: the parts of a ruleset, a rule, every comparison, a
  setting in place of a number, keeping two rules apart, rules in stages, and what each problem the editor reports
  means. Its examples are loaded and run by a test.
- **Start from a template** in the JSON view: categories from words, bands from a number, days between two dates against
  a target, one column divided by another; each runs as loaded, on the step's own columns where it can.
- **Colour-keyed JSON**: names bold and blue, text green, numbers brown, true, false and null purple, a problem line
  tinted; every colour meets 4.5:1 in both themes, checked by a test; **Colours** turns them off.
- **A JSON Schema** for rulesets (`schemas/authored-ruleset.schema.json`), named by every downloaded file, so an editor
  such as VS Code offers the parts, kinds and comparisons as they are typed. Written from the editor's own lists.

## 0.160.0 — 2026-11-21

- **A worked example: syndromic surveillance.** 24,328 made-up emergency department visits with a seeded
  gastrointestinal outbreak: chief complaints sorted into syndromes by words, counted by day and syndrome, and each day
  held to a threshold from its own past by CUSUM, which signals from the outbreak's second day. Two sets of syndrome
  definitions to upload and compare, and the truth kept apart to check them against
  ([example-2026-syndromic-surveillance](https://github.com/digital-twin-ph/example-2026-syndromic-surveillance)).
- **Apply ruleset reads words in text**: *contains any of* and *contains none of*, the words separated by commas,
  ignoring capitals, so a chief complaint can be sorted into a syndrome ("N/V/D", "Vomitting x2").
- **The rules as JSON**, beside the Rules view: checked as you type, each problem said in words and placed on its
  line, Apply held until the text is valid; brackets that close themselves; **Upload** and **Download** a ruleset file.

## 0.159.1 — 2026-11-21

- **Tabular data's import dialog no longer stalls on a wide table in Safari.** The crosstab under After is drawn when it
  is opened, not on every change: on the Salmonella study's 82 columns it held WebKit for seconds (0.159.0's checks on
  GitHub, WebKit only).

## 0.159.0 — 2026-11-21

- **Detect unusual counts**, a new step: each period of a table of counts held to a threshold set from the series'
  own past, by EARS C1, C2 or C3, CUSUM or EWMA, one series or one per syndrome or district; the counts and threshold
  drawn in Configure…, and Show me how. Checked against R's surveillance package (experiment 228).
- **A polygon layer of connected study areas' parts.** Polygon layer's third source: each part of up to six study areas,
  with its name, geoBoundaries ID, country and level, one layer across a border (an outbreak in DR Congo, Uganda and
  South Sudan), drawn on Map and joined to a table on the IDs.
- **Point data takes a study area**, optionally: the area to generate points in, offered first, including a Combined
  area of two countries after a run.

## 0.158.0 — 2026-11-21

- **Buffer study area's remaining code is removed.** It was retired in 0.37.0; a saved workflow holding one is still
  refused by name. Its manual page, its run, its default and its tests go; the validation lab's check of it stays as the
  record of what was checked.
- **A long table in a dialog scrolls.** A Before or After table of more than 20 rows shows 20 at a time, its header
  held, in every configuration dialog and in Tabular data's; the previews that showed the first 5 or 12 rows, or
  pages of 6 to 12, show the whole table.
- **Map's key no longer prints its ranges over one another.** Each class is as wide as its range; seven-figure ranges
  go on two lines, the key one line taller.
- **Joining a table to the study area with no column chosen** joins on the column that names each part once. Where
  the table names each part in several rows, as Nigeria's LGAs name their states, the run says the table is finer than
  the study area; it used to stop on *The table has no column ""*.
- **A census table and a study area at different levels are said to be, before any run**, in the join's panel and its
  Configure…, naming the census table at the area's level. Census tables records each table's geoBoundaries level
  (census-tables e688e90).
- **A column of the parts' IDs is joined on the IDs**: Nigeria's five LGA names held by two LGAs each now take their own
  counts.
- **Hagelloch's measles model** (experiment 199): the periods measured from the record; the probabilities fitted to its
  curve, one per class tried; and how infectious each part of the illness is, which the kernel now takes as a weight
  per state (1 unless declared, so every model without weights runs as before). The best fit puts nearly all
  transmission in the prodrome's last days. The record's sharp peak is still not made.
- **Experiment 227:** Sentinel-2 read from ESA's Zarr stores, a point by two byte ranges, checked against Planetary
  Computer at five places. No worked example lies in what the stores hold yet.

## 0.157.0 — 2026-11-21

- **Sierra Leone, Malawi and Kenya by level, with the map's names.** Census tables offers Sierra Leone's 14 districts
  and its 164 chiefdoms and areas, Malawi's 28 districts with the city each holds added in, and Kenya's 47 counties
  summed from its sub-counties, each unit beside the name and ID geoBoundaries gives it. Malawi and Kenya are also
  offered as printed. Brazil is still offered as printed only.
- **A data dictionary chosen after its table** proposes the values again: the columns it gives a unit.
- **Show me how draws its shapes again.** The spatial walkthroughs (Area around a point, Buffer study area, Calculate
  area, Clip polygons, Join a table to the study area) drew every shape black: their styles were never written. Each kind
  now looks as its key says, and the key is 16 px.
- **Show me how for Join shows both tables.** The study area's parts and the table joined to them stand beside the
  drawing, each row marked with what happened to it. Show me how is in the Configure… dialog for Join and Clip
  polygons, as for every other step; Clip polygons' dialog says there is nothing to set.
- **Buffer study area, retired in 0.37.0, is no longer standardized:** 0.154.0 gave it an Inspector and a walkthrough
  that no workflow could reach.

## 0.156.0 — 2026-11-21

- **Nigeria's census by state or by LGA, with the map's names.** Census tables offers Nigeria as two tables, its 37
  states and its 774 LGAs, each unit beside the name and ID geoBoundaries gives it: "JIGAWA STATE" is "Jigawa", and the
  31 LGAs the two sources spell differently are paired. A column the data dictionary gives no unit, such as the page a
  row was printed on, is now proposed as a key rather than a value.

- **Tide gauges chosen on the map.** Click a country's outline, or one of its gauges for an island too small to have one,
  or choose it from a short list; the map closes in on it, and the line beneath offers to read its index. The long list
  of countries beneath the map is gone.
- **DHIS2 says what is missing.** An empty or partial server address is named, where it was "Invalid URL". Connect reads
  the tokens again, each listed with the address it is for, and a token for another address is named. The Credentials
  manual's token steps now say browser context, GET only, allowed referrers left empty.
- **Delete removes a selected connection** every time; on 0.155.0 it could do nothing while the connection was selected.
- **The live services checked weekly.** A workflow on GitHub runs the browser tests against the live services every
  Sunday and on demand, and opens an issue naming any test that fails. Pushes were already checked live by verify,
  which has no recorded copies; this covers the weeks a service changes and nothing is pushed. It also checks the
  sentences of the four workflows that read satellite files from Planetary Computer, which the local gate now leaves
  to it: the gate's sentence check went from 5 min 38 s to 21 s, with no outside request.
- **Join a table to the study area on the standard.** Every setting is in Configure…, with the table and the study
  area's parts Before and each part's value After, drawn as the choices change. The column naming the most parts is
  proposed where none is chosen, and the panel says before a run when none is, where a run used to stop on an empty
  column name. Show me how walks three made-up parts and a table through the matching chosen.
- **Comparison map retired into Map and a Table.** The geoprivacy example's comparison is now a Map of the original and
  moved points, both mean centres and the pumps, and a Table of the distances Compare point sets measures: how far the
  mean centre moved, each centre to its nearest pump, and how far a point moved, least, median and most. The
  representative donuts are given up; the caveat is in Compare point sets' manual. A saved workflow holding one opens
  rewritten. A Mean center now connects to a point layer as one point. Compare point sets moves to the standard.
  docs/audits/comparison-map-retired.md.
- **A study area's parts, by name.** An area acquired as administrative units says how many parts it holds, and View the
  parts lists each one's name and id.

## 0.155.0 — 2026-11-20

- **Tide gauges in Tabular data.** A fourth tab: the 26 coastal countries in coastal-sea-level over a map of their 131
  gauges, filled where PSMSL computes a trend, drawn with no network. Choosing a country reads its index of its gauges,
  one row per station, with the shared data dictionary, checked against what this version names. An index, not the
  records, which are at PSMSL and UHSLC. Its manual section shows what a gauge measures with the datum diagram; a manual
  page can now carry a diagram from the project's images. A column named *id* or ending in *_id* is a key in a wide read.
  Tabular data 0.14.0.
- **Boundaries Fieldwork holds are read from there first.** The study area picker reads a level held in the boundaries
  repository, the worked examples' ten (DR Congo's provinces and territories among them), pinned and checked by digest,
  and keeps it on this device, so choosing it again needs no network; geoBoundaries is asked for any other level, and
  when a held one cannot be read. Study area 0.11.0.
- **DHIS2 in Tabular data.** A fifth tab reads a DHIS2 server's analytics with a personal access token from Credentials:
  find data elements and indicators by name, choose the unit level and periods, and the table arrives long with a
  dictionary of its columns; the step keeps the server, the request and when it was read. The server must list this
  page's address in its CORS allowlist. Tried against DHIS2 2.41.11 with Sierra Leone's demonstration database, run in
  Docker on this computer. Credentials accept plain `http` for a server on this computer's loopback only.
- **A drag that starts on a connection pans the canvas.** Every connection blocked panning, so the canvas stood still
  under the pointer; a click on a connection still selects it.
- **What a boundary level holds.** Study area's Check this level says the level's own name where geoBoundaries states
  one, and its units beside each level of the country's census in Census tables: Malawi's 32 ADM2 units are its 28
  districts and 4 cities; where no census level has as many, it says to check what the level holds first.
- **Five more countries in Census tables**, curated with stated provenance: Brazil 2022 (5,570 municipalities, IBGE's
  first results), Kenya 2019 (349 sub-counties by sex), Malawi 2018 (districts and cities by sex), Nigeria 2006 (774 LGAs
  by sex, the latest census) and Sierra Leone 2015 (14 districts and 164 chiefdoms by sex). Each states the copy read,
  its terms as found and every check; Kenya's and Malawi's copies are from HDX, under HDX's labels.
- **Tabular data's long reads.** A long read can name its value, so DR Congo's census read long is *population* beside
  three models, not *total*; it reopens with the value column and keys it was saved with. **After** shows the rows as
  stored, then the crosstab. The column a wide read makes for the variables' names says so.
- **TODO**: the threads 0.154.0 left, and where the list's items stand after it.

## 0.154.0 — 2026-11-20

- **What a workflow already states is carried, not typed again.** A DR Congo workflow copied from Botswana's met, one
  after another, a census unit typed by hand, names keyed in another spelling, a column stacked under the wrong name, and
  charts still reading "Botswana", "by district" and "Census 2022". Now:
  - **Words from the workflow in figure text.** A Chart's or Map's title, subtitle, axis titles and source note, and
    Append rows' labels, may say {country}, {units}, {unit} or {census}, filled from the study area and the census read;
    what the workflow does not state is written as not stated, never guessed. Chart 0.24.0, Map 0.38.0. The population
    example's titles now use them.
  - **A study area states what its units are called**, beside its countries, and an edit on the map keeps both. Study
    area 0.10.0.
  - **A complete name match is lined up without asking.** Append rows stacks a table whose every name matches the
    others' column under it, and says so; a partial match still asks. "persons" and "people" are one unit.
  - **The unit comes from the data dictionary** where it states one. Tabular data 0.13.0.
  - **A copy of a workflow leaves its figures' subtitles to be written again**, with its study area's countries and unit
    name: a subtitle is the original's finding.
- **The population example meets what a hand-built workflow meets.** It read census files prepared to fit its map, so it
  never met a census in the statistics office's own spelling. Its census steps now read Census tables, as anyone's would:
  each country's districts with the name geoBoundaries gives each (8 of Botswana's 28 spelled differently), read wide
  with the total named *population* and its unit from the dictionary, lined up under the models' `name` by Append rows by
  itself; its titles say {country} and {unit}, and its census label {census}. A new check opens it from its pin and
  checks all this without the raster downloads; running it end to end still needs them.
- **Census tables in today's units.** DR Congo's only census, of 1984, counted regions that match no map today. It is
  offered summed to the 26 provinces of 2015, with each province's name as geoBoundaries spells it; the counts as
  printed are linked. How each 1984 unit was placed, and what that does not establish, are in census-tables. Rwanda's
  and Botswana's districts are offered the same way, each with geoBoundaries' name for it.
- **Append rows lines its tables' columns up in a grid.** One row per column of the stacked table, the column of each
  table filling it or none, each changeable, with every table before and the stack after. A table holding the others'
  names under a column of its own is refused, naming the column to stack it under, and the name most tables use is
  offered whatever the order of the inputs: DR Congo's census `province` beside three models' `name` had been stacked
  into two columns, and every later step found no names for the census. A run stopped there keeps the tables reaching
  it, so the columns can be lined up without a finished run.
  A table whose value column or unit differs is named, with where to change it. Append rows 0.4.0.
- **Sample a raster's unit reaches its table**, so a census stating "people" stacks beside it; the population
  example's census steps now state "people" too. Sample a raster 0.9.0.
- **Tabular data keeps a step's choices for its own table.** Given another table, a reopened step starts from that
  table's defaults; a refused read shows no table beside the refusal; a table from an address reopens read; one value
  column read wide is advice, not a refusal; the data dictionary picker is under Your file only. Tabular data 0.13.0.
- **Relate says what each table holds when nothing matches.** Relate 0.13.2.
- **GHS-POP over a large country is streamed, not refused**, by file or by address: its 12.3 GB global file over DR
  Congo's provinces (517,885,446 cells) is applied in about a minute and a half, most of it taking the file's digest.
  A streamed file is chosen again from the run's stop message, and remembered in Chrome and Edge. Configure… always
  opens. Raster input 0.14.0.
- **DR Congo's 26 provinces no longer freeze the study area.** Choosing them, applying them and reopening the dialog
  each took 5 to 7 seconds, long enough for Chrome to call the page unresponsive; each now takes about a second.
  Study area 0.10.0.
- **A receipt names a shape instead of writing it out.** It gives the GeoJSON's format and SHA-256, which anyone
  holding the project can recompute; DR Congo's provinces were 4.3 MB of text in every receipt that used them. Study
  area, Clip raster 1.3.0, Map 0.38.0 and the four area steps below.
- **Area around a point, Buffer study area, Calculate area and Clip polygons are on the standard Inspector**, each
  with Show me how it works drawn on made-up shapes, and each with a manual page. Area around a point 0.2.0, Buffer
  study area 1.1.0, Calculate area 0.2.0, Clip polygons 0.2.0.
- **A click on a connection selects it**, where it removed it. The not-ready message names the step and follows what
  is still missing. Opening a project or workflow says so while it loads, and two choices made quickly open the last.
- **Dive deeper stays on the standard Inspector**: a step moved to it had lost the link to its validation notebook.
- **Inspectors out of app.ts**: Tabular data, Append rows, Relate, Raster input, Clip raster, Sample a raster, Study
  area and the four area steps, each in its own module.

## 0.153.0 — 2026-11-20

- **Tabular data: where the table comes from, as tabs.** **Your file**, **From an address** (until now *Or fetch from
  a URL*) and **Census tables**, new. Census tables lists the countries in the census-tables repository, each with its
  census, its publisher, its terms and when it is next reviewed; choosing one reads its counts with its data dictionary,
  checked against what this version names. Botswana (2022), DR Congo (1984) and Rwanda (2022) to begin with.

## 0.152.0 — 2026-11-20

- **A save to GitHub reminds you to say who you are, and is never refused for it.** After saving, if the project does
  not name you yet, the answer says so and points to People. GitHub already records who saved; the project's own
  record of you is your name, ORCID iD and affiliation, signed with your identity file.
- **This is me is on your row under People** whenever Fieldwork knows your GitHub login. It was hidden until you had
  chosen a role and opened your identity file; now it asks for the role, then opens the identity file.
- **Shared through GitHub has a manual**, from a button at the top of the section: sharing, saving, getting the
  latest, saying who you are, roles and discussions.
- **Rwanda can be a study area**: it was refused with "Interior rings must not contain one another", because two holes
  in its outline meet and the check read a corner on one's edge as inside it. Study area 0.9.4.
- **An ORCID iD can be added to an identity file later**, under Identity's *Change your avatar, ORCID iD or
  affiliations*, keeping the same key. It could be given only when the file was made, and a new file means a new key.
- **A slide deck on browser-based applications** is in `docs/presentations/`, the source of the published deck.
- **Maps of up to 250,000 points, drawn in seconds.** A map, a table of points and Point data took at most 2,000
  records, a number nobody had measured; files of points, at most 5 MB. Both are lifted to the table's limits,
  250,000 records and 40 MB, which the static figure and the table reached when measured. 50,000 points now draw in
  2.7 s on a static figure (74 s before) and 5.8 s on an interactive map (155 s before), whose large layers are drawn
  by the graphics card: 250,000 in 24 s. Marks of a shape other than a circle are drawn as shapes up to 100,000, and
  as circles past that, which the map says. Offline, or without WebGL, large layers are drawn as circles. Map 0.37.0,
  Table 0.13.0, Point data 0.11.0, Reproject points 0.3.0; times in Map's manual, under History.
- **Map's Inspector and Configure dialog are in their own module**, out of `app.ts`, with nothing on screen changed.
- **A raster too large to keep is streamed.** GHS-POP over DR Congo, 4.2 GB of 8-byte cells, was refused. A window past
  what a tab holds now keeps a copy in blocks for maps (summed for counts, averaged for values), and Sample a raster
  reads the full cells from the source a strip at a time, added up in the Rust kernel, each area's median found
  exactly. On DR Congo (measured in Node.js, not yet in a tab): the kept copy 6.3 s, 240 districts with their medians
  20.7 s, 1.2 GB at most. A file on this computer is chosen again in each new session. Raster input 0.13.0, Sample a raster 0.8.0, Clip raster 1.2.1.
- **Credentials and an open identity stay unlocked for 15 minutes without use**, up from 10. One setting governs both.
- **A large table no longer stalls the Tabular data dialog.** Ticking a key column on 250,000 rows took over an hour;
  it now takes about half a second. Rows repeating a key were grouped by copying the group at every row (the same
  pattern, fixed in nine other places, also slowed Deduplicate table, Apply ruleset's groups and the spelling match),
  and a table drew every row on the page; it now shows 200 at a time. Tabular data 0.11.1, Table 0.13.1.

## 0.151.2 — 2026-11-19

- **Relate's walkthrough checks every row before it stops**, as Relate does, marks each problem where it is, and ends on
  Relate's own words: with nothing decided, it names Epsilon's two rows, not Delta. It had stopped at the first problem.
- **A country's outline is drawn on a map**: DR Congo at the first level, 26 provinces and 194,009 vertices, drew a blank
  map, because the figure's frame passed every vertex at once to a function that takes about 100,000. A map that cannot
  be drawn now says why where it would be. Map 0.36.3.
- **CI's template test** asks for the population example's workflows only where that example is checked out.
- **The release gate runs four browser test files at once**: about 21 minutes instead of 45, measured (gating audit).
- **The Credentials manual says where GitHub's Resource owner is, and what goes wrong without it**: it starts as your
  own name, and left so, the project's repository never appears when choosing it ("No repositories found").
- **The Credentials manual has a section for an organization's owner**: approving a member's token, what to check
  before approving, and how to revoke one later.
- **The Credentials dialog's manual is a button you can't miss**: "Read the manual for Credentials", with a book's
  mark, bold and outlined, where a line of plain text was.

## 0.151.1 — 2026-11-19

- **A template of a workflow holding a raster can be made again**: making one stopped with "Invalid retained raster
  asset or metadata", so the population example's workflows could not be taken as templates for another country. A
  template now leaves the raster out, as a new Raster input starts.
- **The Brazil example reads real satellite files**: since 2026-11-07 its project carried the made-up satellite search
  a test uses, so its temperature workflows stopped on a file that does not exist. It is re-exported from a live run.
  An example can no longer be exported from a stubbed run, and a test fails if any example holds a stub's file.
- **A satellite search of more than a month no longer fails on the catalog's second page**: Planetary Computer timed
  out on it, and the search said only that the catalog could not be reached. It now searches a month at a time, keeps
  each item once and tries a failed request twice more: a year of MODIS over Rio de Janeiro state in 12 requests and
  five seconds. Search a satellite catalog 0.5.0, on the standard Inspector, its code out of `app.ts`, the first widget
  moved so.
- **The interactive map's key names what is drawn**: rings are keyed as rings, as the figure's key already did; it showed
  filled squares over a red ring, blue rings and orange discs on Hagelloch's clusters. Map 0.36.2.
- **Show me how it works keeps your words with your data**: Relate's walkthrough wrote the name you give unmatched rows
  (Hagelloch's "no infector recorded") into its made-up supplier column, and Append rows wrote your source labels onto
  its made-up weeks. Both follow your choice and use names of their own. Relate 0.13.1, Append rows 0.3.1.
- **A walkthrough ends where the step stops**: Relate's went on after a stop and kept "the result so far", though the
  step passes nothing on when it stops. It now ends there, says no table comes out, and says what the other choice would
  do. A stopped row is readable: a light tint, the text dark.
- **The Run button is never unreadable**: for a moment after it was enabled, its text turned white before its
  background had darkened. Primary buttons now change state at once.
- **The Brazil and NYC examples are pinned to their new commits**: Brazil's project re-exported from a live run (37.7
  minutes, real MODIS files), and both manuals wait for the satellite search to answer.
- **The gating audit** (`docs/audits/gating-audit.md`): what the release gate caught over 37 gates, why choosing tests
  by the files changed would save about 5 minutes in 38, and what would remove most red gates instead.

## 0.151.0 — 2026-11-19

- **Show me how it works**: Relate, Append rows, Select rows and Total within groups each step through a made-up example
  from their Configure… dialog, with the choices made there before they are applied. Back, Step and Play; it never
  starts by itself, and nothing moves where reduced motion is asked for. Rows are marked in words and by shape, never
  by colour alone. The last step is the table the step itself makes from the same rows, or the words it stops with
  (experiment 223). Relate 0.13.0, Append rows 0.3.0, Select rows by value 0.5.0, Total within groups 0.6.0.
- **Each example shows what is easy to get wrong**: a district spelled with a full stop in one table and not the
  other; a key the second table lacks, or has twice; a column one table lacks, empty and not zero; an empty cell kept
  by leaving a value out but set aside by keeping values; a group whose total is unknown because one cell is empty.

## 0.150.0 — 2026-11-19

- **A draft attaches what it cannot print**: a table of more than 50 rows, such as a line list, is attached as a CSV
  file, with a line in its place naming it, its rows and its file. **Download the attached files** gives them in one
  zip. MERS as a WHO-style sit rep goes from 29 printed pages to 20.
- **The sit reps, the surveillance summary and the full report have an annex file**: their equations and the tables
  an input reads go to `annex.html` in the zip, and one line in the draft says what it holds. The publication and the
  ECDC-style report keep theirs printed.
- **Rows fetched from elsewhere are never attached**: where a workflow's table was fetched, as NYC's is from Zenodo,
  the draft names where it came from and writes no file.
- **No format is named after MMWR**: "Report, MMWR style" is now *Full report, with a three-question summary*, its
  kicker *Report*; "Surveillance summary, MMWR style" is *Surveillance summary*. The colophon still cites the paper
  each follows.
- **Nothing printed empty or cut off**: a heading over a part not yet written does not print, tables wrap at the
  margin, table text is dark on white, and a number's heading stands over its numbers. The date under the title says
  *Drafted*.
- **Findings about the data are not the study's limitations**: columns with no stated meaning and unresolved data
  quality findings are stated once, under Methods or the data notes. A format with data notes names its sources there
  and not again under references.
- **No instructions in figures**: a map's and a chart's default source line no longer ends "See N3 & evidence for
  method."; a two-by-two's "Connect a study design…" stays in the application. Map 0.36.1, Chart 0.23.1, Two-by-two
  table 0.8.2.
- **The target outputs audit** (`docs/audits/target-outputs-audit.md`) compares South London as a publication, MERS
  as a sit rep and NYC as a full report with the documents they follow. Its basemap finding was withdrawn: the
  drafts were printed with the browser tests' blank tiles.
- **The Credentials manual says an Esri key is used under your own agreement with Esri**, and Map is named as what
  reads CARTO and Esri keys.

## 0.149.0 — 2026-11-19

- **NDVI and EVI from MODIS, over areas and at points**: Sample a raster reads the 16-day, 250 m vegetation indices on
  Planetary Computer, as it reads land surface temperature. The default keeps cells whose pixel reliability is good or
  marginal, as the file's own legend describes them; *good data only* is the alternative. Over Rio de Janeiro's 92
  municipalities in February 2024 its NDVI follows the Brazil example's own (correlation 0.949) and runs 0.04 higher on
  average; which is nearer the truth is not established. Sample a raster 0.7.0.
- **The files' scale factor is read for what it means**: vegetation's files say 10000, a divisor, where temperature's
  say 0.02, a multiplier. Each product states which, and a file that says otherwise stops the run.
- **Clip raster has the standard Inspector**: Name, Inputs, Settings with Configure…, Result. Which cells are kept, the
  margin and whose boundary are set in Configure… and saved on Apply; Result says how many cells the last run kept.
  Clip raster 1.2.0, with a manual page of its own.
- **Corrected wording**: the user guide named a Restore example button that no longer exists, and said resetting can
  be undone; it cannot. Raster input's canvas card and the clip boundary's map named controls that had been renamed.

## 0.148.0 — 2026-11-18

- **CARTO and Esri basemaps on your own key** (experiment 222). With a CARTO or Esri key in your credentials, unlocked,
  an interactive map offers CARTO Positron, Voyager and Dark Matter, or Esri satellite imagery, streets and outdoor.
  The project keeps the style's name, never the key; locked or without a key, the map shows OpenStreetMap and says
  why. Figures keep OpenStreetMap until each provider's terms on exported images are read. Map 0.36.0.
- **The Credentials manual says how to get each key**: a CARTO key by email, an Esri key in seven screens, each locked
  to Fieldwork's address.
- **Marks are named over a basemap too**: up to five, from their records' names. Oswego's point reads *Lycoming United
  Methodist Church* over its tiles.
- **A figure whose basemap was not drawn no longer credits it** in its sources line.
- **The first raster read on a device says the raster engine is being fetched**, about 6 MB, once.
- **From a template… is grouped by project**, the open project's workflows first, so a workflow's project is plain.
- **The library's "Your data stays here" panel is gone**, with its Restore example button, which restored without
  asking. Reset example, in the bar above, asks first.

## 0.147.0 — 2026-11-18

- **terrio is Fieldwork's raster engine** (experiment 221): it decodes every GeoTIFF in Raster input, Georeferenced
  map image and Sample satellite files, where geotiff.js did. Fieldwork still reads the header and makes its own checks
  first. On WorldPop and GHS-POP windows the cells and metadata are the same, value for value, and reading is 2 to 9
  times faster. geotiff.js is now used only in tests, to check terrio against.
- **The engine is fetched the first time a raster is read**: 16 MB, 6.1 MB as sent. It is kept on the device, so
  rasters read offline afterwards; a project without a raster never fetches it.

## 0.146.0 — 2026-11-18

- **An inset never covers what the map represents**: its boundary, its marks or its north arrow. A corner chosen is used
  where it is clear; otherwise the nearest clear place, or a band below the map. A boundary around the whole map is its
  background. MERS's circle moves into the Yellow Sea; Oswego's overview stays in its corner. Map 0.35.0.
- **A map with no basemap says so**, adds a scale bar and names up to five marks: Oswego's dot is the church, 500 m
  across, when the tiles cannot be read.
- **Coordinates written in degrees, minutes and seconds are read**, in a CSV of points and in points from a table:
  `05° 56' 00" S` becomes −5.9333. The column keeps its text. Values with no hemisphere are counted and said; a value
  that cannot be read leaves its record without a position, where a CSV used to be refused.
- **Running the project's workflows from Notes no longer counts a workflow as run when one of its steps could not
  finish**: it says which, and does not say the write-up holds the whole project.
- **The NYC test no longer depends on a live satellite service by default**: the part that reads 19 Sentinel-5P files
  runs when asked (`FIELDWORK_LIVE_SATELLITE=1`), after taking from 52 seconds to over six minutes on the same code.

## 0.145.0 — 2026-11-18

- **A focus inset is a third of the figure by default, and never more than 40% of the map's shorter side**; Configure…
  says so beside *Its size*. MERS's inset is a third, re-pinned.
- **A focus inset is named with another workflow open**: the figure in Notes reads the study area from the map's own
  workflow. Map 0.34.1.

## 0.144.0 — 2026-11-18

- **A notes audit, on request and per target**: how many parts are written, as a number and a bar; each part written,
  planned or empty, with the length it asks for and, where it is in words or sentences, whether the writing is short,
  within or long; planned and unwritten, written and unplanned, and notes the target does not use; objectives, figures
  and references. It never stops a draft.
- **The plan's shells and links**: a part lists the tables, charts and maps it will show, each marked when made;
  **Start a note from this** copies a part into a note that keeps the link; the plan counts parts with notes and no plan.
- **Draft buttons follow the targets**: one per target chosen, opening as that target; a plain Draft when none is.
  *Draft as* lists the targets first.
- **Insets by shape**: the focus inset is a circle, the overview inset a square, each named from the study area's
  boundary record. MERS's focus reads *Gyeonggi*. Map 0.34.0.
- **The identity locks after 10 minutes without its own use**: working in its dialog, or signing.
- **The research on the response to measles in Württemberg, 1861**, is in `docs/research/`.

## 0.143.0 — 2026-11-18

- **Notes shows the project's plan** above the outline: one part per slot of what it is writing towards, each written
  before the analysis, marked complete with a dated version of every part, and never part of any product. The
  objectives note is the plan's objectives part. A dropped target's written parts are kept.
- **Credentials say how many keys are unlocked**, and an empty new collection says *new, empty* instead of *unlocked*.
- **Credentials lock after 10 minutes without their own use**: working in their dialog, or a key read for a request.
  Until now any click anywhere in Fieldwork kept them open. The lock warning's *Keep them open* still keeps them open.

## 0.142.0 — 2026-11-18

- **A disease model can be run under a response scenario**: how cases are detected (a daily chance of notice, in a
  state or on a network while it meets), how soon detection is notified, and each action with its start and its effect
  on a contact network, with a calendar of the days each network meets. Each run dates detection, notification and
  each action, and is scored against 7-1-7. A model with no response runs exactly as before.
- **A network can carry only some infectious states**: Hagelloch's measles now has a prodrome and a rash, and a child
  with the rash is kept home from school, as in 1861.
- **Four response scenarios for Hagelloch**: as in 1861, the school closed from the first day, 7-1-7 met, 7-1-7 missed.
  Experiment 220 records the result: meeting 7-1-7 slows the outbreak more than it shrinks it.
- **The glossary defines model structure, parameter set and response scenario.**
- **Hagelloch's note on what is not established says the 27% school closure traces to no source**: Groendyke and
  colleagues simulated a closure, and Aaby and colleagues mention none.

## 0.141.0 — 2026-11-18

- **Hagelloch's write-up carries seven notes by its author** on how the outbreak was met in 1861: the village and its
  care, how Pfeilsticker found the cases, a school that stayed open, what else was done, whether measles was reportable,
  the outbreak against 7-1-7, and what this does not establish. Each cites its works, and the publication lists them.
- **A work cited by a note and declared by an input is one reference**, cited by both, where it was listed twice.
- **Pfeilsticker's thesis is cited with its own spelling**, umlauts included.

## 0.140.0 — 2026-11-18

- **Map shades a raster by its unit.** A raster whose unit is a count per cell, such as *people per pixel*, is shown per
  km² in yellow to red, as before; any other unit, such as *NDVI* or *metres*, as its value in viridis, below zero
  included. Rasters in panels share a scale only when they share a unit, each scale with its own key. One raster on a
  map follows the same rule, keyed with each class's range, where it was a green stretch keyed "Relative cell value".
- **Raster panels in Map's Configure…**: what each cell shows, the colours, and quantiles or equal steps.
- **GHS-POP's file is recognised**, its unit *people per pixel*, and a file read by its address is recognised as one chosen
  from disk is.
- **Raster input's Inspector is the standard one.** Reading a kept window again, its record and **Download GeoTIFF** are in
  **Configure…**; the Result line says when the window is not on this device.
- **A declared disease course may branch** (experiment 220): recover or die, fast or slow latency, each branch's share a
  parameter. Measles is unchanged run for run; an Ebola-shaped course agrees with Starsim 4.0's Ebola on infections,
  deaths and safe burials.

## 0.139.0 — 2026-11-17

- **A disease model declared as data, in the kernel (experiment 220).** A model structure says the states, how an
  infection happens, the course that follows and the contact networks; a parameter set gives its values, each with the
  evidence it rests on. Measles declared this way gives what measles written by hand gives, run for run, over 500
  seeds. Nothing of it is in the application's interface yet.
- **Measles' periods from CDC's Pink Book**: 10 days infected and not yet infectious, 9 days infectious, each derived
  with its working. With them, the declared model agrees with Starsim 3.7.4 over 500 runs on Hagelloch's 188 children.
- **Experiment 220** records the Gaborone TB and North Kivu–Ituri Ebola models as inventoried, the research on
  declaring models with evidence, the trainee's five steps, and how far each value's evidence travelled.
- **A WebKit test race fixed**: a pin's name is typed once the pin form has settled after a change of mode.

## 0.138.0 — 2026-11-17

- **DR Congo whole at 100 m.** Raster input keeps a window of up to 518.9 million cells and 2.1 GB, raised from 166.4
  million and 1.1 GB, measured on WorldPop over DR Congo: Apply 75 s at 2.6 GB, a run at 2.7 GB, a run again at 3.0 GB,
  in Chromium on a Mac. Not yet tried on Windows.
- **A raster window is held once, not three or four times.** It is read straight into the file it is saved as; its
  stored parts are read back one at a time; its header is read from its bytes; and the last run's raster is let go when
  the next run starts. Nigeria's Apply fell from 2.1 to 2.3 GB to 1.6 GB, and a run pressed again from 3.0 to 3.6 GB to
  at most 2.2 GB.
- **A refusal for too many TIFF blocks names the real limit**, not a 512 MB budget retired in October.
- **The Credentials dialog has a manual**: how to make a GitHub token for one repository and fill in the form. Detached,
  it stays beside the form.

## 0.137.0 — 2026-11-17

- **One less copy of a raster window while saving and showing it.** The digest of a saved window over 64 MB is taken
  over the bytes in place, not a copy; on Nigeria the step's peak fell from 2.33 to 1.71 GB, at about 2.5 s more.
  Map shares a raster's cells with Raster input instead of copying them. The peak of a whole Apply or run is within
  the spread between runs: not shown to be lower.
- **The accessibility scan and the toast contrast test measure a toast after its fade**, not halfway through it.
- **The Map image dialog's image pane scrolls by keyboard**: press Tab to reach it, then the arrow keys. The scan,
  waiting longer, found it scrollable and out of reach.
- **Experiment 199:** Aaby, Thoma and Dietz (2022) is subscription only; its abstract counts 187 cases. The source table
  says what was read and what was not.

## 0.136.0 — 2026-11-17

- **Nigeria whole at 100 m.** Raster input keeps a window of up to 166.4 million cells, raised from 123.3 million and
  measured on WorldPop over Nigeria: the dialog and a run of Study area, Raster input and Map. A window of more than
  1.1 GB is still refused, so GHS-POP over Nigeria, at twice the bytes, is not admitted. DR Congo whole is refused:
  measured, it is read but cannot yet be saved.
- **Boundaries in the side-by-side panels follow their borders.** Outlines were thinned to every so many points, which
  drew Botswana's districts as straight lines across the country. They are now simplified by shape, each border kept
  within about half a drawn pixel, and small areas are no longer dropped.
- **An agent-based model in the kernel, not yet in the application.** The spike for experiment 199: measles in
  Hagelloch's 188 children over their households, school classes and village, a day at a time from a recorded seed.
  The same seed gives the same table natively and in WebAssembly, and 500 runs agree with Starsim 3.7.4 within their
  run-to-run spread.

## 0.135.0 — 2026-11-17

- **A large raster no longer kills the tab after a run.** The line under the map saying how many cells hold a value
  copied every cell to count them, past what one tab may hold: Botswana's WorldPop window, 123 million cells, wired to
  a Map died just after the run, in Chrome and Edge on Windows and on the Mac. They are now counted without a copy, and
  only cells holding a value are counted; no-data cells were counted too.
- **A run no longer waits for ever on a stored file.** A large file kept in this browser is read back in parts; if the
  browser failed a part or ended the read, the run waited without end and without a word. It now stops and says what
  failed, with what to do.
- **The empty canvas knows when a project is open.** Just after Create project it offered Create a project again. In a
  project of your own it now asks for the study area, step 2 of 2; either way it offers a built-in project or a worked
  example to look at first. The line about the 1854 outbreak is gone.

## 0.134.0 — 2026-11-17

- **Less memory for a large raster.** A raster window is drawn on the maps at no more than 2,048 pixels a side, each
  pixel the mean of the cells it covers, and the caption says so; it was drawn one pixel a cell, about 11,000 a side
  for Botswana's WorldPop, for a map 850 pixels wide. Reading a window fills one array instead of three, and saving it
  no longer copies the cells first. The cells and every total computed from them are unchanged. Found when Chrome on
  Windows ran out of memory on the Botswana WorldPop workflow.
- **Load the updated example waits for the run.** A copy that runs itself on opening offered the button while the run
  was going, and a press did nothing. The button is now unavailable until the run finishes, and says so.
- **Tests:** the dark-theme contrast check waits for fades to finish before measuring.

## 0.133.0 — 2026-11-17

- **A remote raster read survives a dropped connection.** Raster input reads a file at a URL in about twenty parts; a
  part whose connection drops is now tried again, up to four times. If it stays down, the dialog says where the read
  stopped, and **Apply** again carries on from there instead of starting over. Found reading GHS-POP over Botswana in
  Edge, which stopped at 37% with "Failed to fetch".
- **Tests:** the accessibility scan waits for fades to finish before measuring contrast; it had measured a button and
  a message halfway through their fade.

## 0.132.0 — 2026-11-17

- **A project shared through GitHub.** New project now offers two paths: **New local project**, or **Open shared
  GitHub project**, the second only while Credentials are unlocked. Each has **Import project from backup**. A shared
  project lists one row per GitHub token, for the repository the token names; **Check it**, then **Load the
  project**, whether the repository already holds one or is new from the project template. In **This project**:
  - **Save to the repository** sends the project as one commit, with a line you write. It is never forced over
    someone else's save.
  - **Get the latest** merges file by file: what is only here is kept, what changed on GitHub comes in, and a
    workflow changed on both is your choice.
  - **Check GitHub** says what changed on each side and lists the latest discussions. **Start a discussion** posts one.
  - **People** shows who has access on GitHub and each person's project role (lead author, co-author, reviewer),
    saved in the project.
  - Shared projects are grouped in the Project list. A workflow's file in the repository no longer carries this
    computer's internal keys (`projectId`, `workflowKey`), so a save does not rewrite every workflow.
- **Who you are, with your organisations.** The identity file holds affiliations, each with its ROR ID, found on ROR
  by name or checked by its checksum. **This is me** signs your name, ORCID iD and affiliations into the project's
  People, so they reach the other authors with the next save. Nobody can enter them for you.
- **Unlocked through a reload.** Identity and credentials stay unlocked across a reload, kept encrypted in this
  browser, and lock after 10 minutes without use (was 15) or at Lock. A minute before, a warning says so, with **Keep
  them open**. While unlocked, a script on this page could use them; that was your choice, recorded in experiment
  218.
- **Credentials.** The Credentials button shows a padlock and a tint while unlocked. A label left empty is the
  reference. A GitHub credential can name the repository it is for.
- **Smaller things.** A pencil beside the workflow's title says it can be renamed.
- **The project ontology.** `fw:Project`, `fw:ProjectRole` (lead author, co-author, reviewer),
  `fw:ProjectMembership` and `fw:minimumRepositoryRole`, built on the W3C Organization Ontology.
- **Open science inventory.** A running list of what Fieldwork has and lacks: `docs/audits/open-science-inventory.md`.
- **Tests and CI.** The six worked examples' accessibility scans run on Chromium only, so CI's WebKit run fits its
  75 minutes.

- **Validation limits.** Everything shared through GitHub is tested against a GitHub kept in memory, on Chromium.
  Against the real GitHub, the practitioner has run the read-only check, posted one discussion and loaded a project.
  No save, no second author and no merge have run there yet. That a fine-grained token lists only its own repository
  was expected and proved wrong: it listed 86, which is why a credential now names its repository.

## 0.131.0 — 2026-11-16

- **Accessibility, Section 508's floor.** An automated scan against WCAG 2.0 A and AA, now part of the gate: every view
  and the main dialogs, light and dark, and in six worked examples every widget's Inspector, the dialogs its buttons
  open, and the Results. What it found is fixed: the view tabs say they are tabs; no text is faded below AA contrast
  (the library is disabled while a run is in flight, and entries nothing feeds yet are marked by an outline instead);
  two light-theme colours darkened; map figures in Notes no longer hold keyboard stops; scrolling tables reachable by
  keyboard; the chart's actions menu named. The audit: `docs/audits/section-508-audit.md`.
- **A workflow built with the keyboard alone.** The first Tab offers *Skip to the canvas* and *Skip to the Inspector*.
  A widget reached by Tab shows a thick ring and becomes the selected one, so the Inspector follows; arrow keys move
  it. Connect in the Inspector, by choosing the source in an input's list. React Flow's corner link is gone (Tab could
  leave Fieldwork through it); React Flow is credited in Help. In Safari, hold Option with Tab.
- **Identity, continued.** Once your key is linked to GitHub, the section is one line. Credentials: the passphrase and
  its confirmation together, checked as you type; the file saved as `FWCRED-<your name>.fwcredentials`.
- **The outline counts what the draft holds on the way back.** A title or abstract written in the draft still showed
  as empty in the outline until Notes was redrawn some other way.
- The footer's old "Exploratory research / v0.2" is gone; the version is the one in the header.

## 0.130.0 — 2026-11-16

- **Identity, apart from Credentials.** The **Identity** button, top right in the header where the placeholder circle
  stood, makes your identity file (name, GitHub login, ORCID iD with its check digit verified, a signing key), opens it
  with its passphrase, and locks it. It is yours to keep; Fieldwork never stores it, and it holds no tokens. A spike of
  experiment 218: Ed25519 signatures, checked in Chromium and WebKit.
- **A note's versions.** Every save that changes a note of your own keeps a version: what it said, when, and, with your
  identity open, who, signed. The note's dialog lists them, each *signed, and the signature checks*, *does not check*,
  or *not signed*.
- **Avatars.** An icon from Fieldwork's own set on a colour you choose, kept in your identity file; your initials until
  you choose. Beside each signature, a pattern drawn from the signer's key, so two keys never look alike.
- **The Project view in three tabs**: This project, New project (the form that was a dialog, with Import project) and
  Worked examples. With a worked example's manual open, it sits beside the New project form instead of over it. The
  *Writing towards* checkboxes sit beside their labels again.
- **The Identity dialog leads with what to do**: *Make my identity file* or *Open my identity file*, as two tabs, Make
  first until an identity has been opened on this device. The file is saved as `FWID-<your name>.fwid`, easy to
  find in a folder.
- **Making and opening an identity says what happened.** The passphrase is checked as it is typed (its length, then
  whether the second matches); a problem is said beside the button that was pressed; opening or making a file says so
  at the top. With an identity open, the dialog is about it only: linking it to GitHub, changing its avatar, locking it.
- **A GitHub login and an ORCID iD, checked.** As typed: GitHub's rule for a login, the iD's check digit. On request
  only, **Look up** shows the name each service has on record, so you can see whether it is yours; found is not
  verified.
- **Link your key to GitHub.** Your public key in the form GitHub takes, with Copy, GitHub's page for a new signing key,
  and **Check the link**, which reads GitHub's public list of your signing keys. A QR code opens a page on this site
  showing the key on your phone, with Copy; the key travels after `#` in the link and is sent to no server.
- A test that clicked before startup had finished now waits for it (WebKit on CI, 0.128.0 and 0.129.0).

## 0.129.0 — 2026-11-16

- **Objectives first, then what answers them.** A new project can write its objectives before it has any workflow.
  The outline shows each objective: whether a note answers it, how many tables, charts and maps support it, and which
  workflow answers it. On the Project tab, a workflow says which objective it answers. **Write its answer** adds a
  Results note for that objective.
- **A table, chart or map goes with the note it supports.** In a note of your own, tick the ones it rests on; the draft
  draws them after that note, in any section, numbered in reading order.
- **The publication's Results follows the objectives**: a numbered subsection per objective, with its answer and its
  workflow's results.
- A test that reloaded and opened Notes before startup finished now waits for it (WebKit on CI, 0.128.0).

## 0.128.0 — 2026-11-16

- **What a project is writing towards, and its outline.** A project names its targets with its question (New project,
  the Project tab): a publication, situation reports, surveillance reports. Notes then opens on one outline for all of
  them: each part, how much fills it, which products use it and how long it runs in each, and each product's coverage.
  A note fills a part by its section and function; **Write it** on an empty part adds a note of that kind. A new
  function, *objective*, and a note's numbered **items**, so objectives can be answered one by one.
  A note's dialog shows what it becomes in each target, and edits an objectives note's items.
- **An evaluation finding opens as a GitHub issue**, in a standard form the repository now carries (one for lab
  evaluation, one for field testing): its fields filled in, for the person to read and submit. The **Lab evaluation**
  switch moves to the footer, beside Ontology and Validation Lab.
- **Help says how Fieldwork works now**: projects and what they write towards, workflows as questions, Results, Notes
  and the outline, the worked examples and their manuals, and keeping your work. The stale guide is gone.

## 0.127.0 — 2026-11-15

- **The draft as a document, in six formats.** In Notes, Publication now offers **Draft as**: the publication, a WHO-
  or OCHA-style situation report, an ECDC- or MMWR-style surveillance report, or an MMWR-style full report, each checked against published
  reports of its kind and declared as a mapping onto shared roles, so what is written follows from one format to the next. **Each figure and table
  has a width and a place**: full, half or a third; on its own line, side by side with the next figure, text running
  round it left or right as in Word, or left out of that kind of document. Kept with the project per kind, the same on
  screen and in print. Found on the way: reading a project dropped every publication key but the original eight, so a
  second figure's setting appeared to erase the first's.
- **A map in Notes is the map in Results.** The figure Notes and the SVG download share kept a shaded map's ramp but
  dropped the line saying what the shade is and how it was classed, and listed the classes again in two loose columns.
  Map 0.33.2.
- **A workflow file chosen while the page is still starting is imported**, not dropped. WebKit on CI failed four more
  tests for it after 0.126.0, each importing a file the moment the page opened.

## 0.126.0 — 2026-11-15

- **Sierra Leone's facility map places seven more facilities**: names GRID3 holds under another type (MCHP or CHP
  where it writes CHP or CHC), each decided in the manual as the facility of that name in the case's district. A
  space-time scan was built as a fifth workflow and removed before release (the practitioner: *"Remove scan for SL"*):
  over five years of routine surveillance every cluster reached p = 0.001, waves and reporting changes alike, so it
  said nothing the district curves do not, and invited reading a wave as a detected outbreak.
- **Every worked example's workflows are named as questions.** Seventeen were not, among them Oswego's two left at
  "· question 2"; the examples validator now refuses a pinned example whose workflow name is not a question.
- **A locator names its whole map**, such as *New York State*, in its frame. **A study area wired beside polygons is
  drawn under them** on the static figure. Map 0.33.1.
- **Map's panels and inset, and the two-by-two's readings, are widget work, not experiments** (the practitioner):
  212 and 213 are now a dated History on Map's manual page; 218's plan is TODO item 34.
- WebKit's intermittent `polygon-input` failures were a startup race: a workflow file given before the import
  handler was bound was dropped. The page now marks itself ready, and the test waits for it.

## 0.125.1 — 2026-11-15

- **NYC's Introduction has a diagram**, as an authored note with its image: what a monitor and the satellite each
  measure (the air at an inlet as a daily mean in ppb; the NO₂ column over a pixel of about 3.5 × 5.5 km, once a day, in
  mol/m²) and how the sixth workflow puts them side by side. Its manual ends by adding it, and the from-scratch run
  builds it.
- Experiment 201 records the lesson of the Oswego East sheet: a GeoTIFF's placement tags are a claim, checked against
  its printed graticule and today's map.

## 0.125.0 — 2026-11-15

- **A scanned map sheet as a GeoTIFF.** Georeferenced map image reads one: it tells a picture from values by its tags,
  reads its projection (polyconic, transverse Mercator, Lambert, Albers, UTM) and redraws the part over the study area
  north up. It opens where the file says it lies, with the sheet's graticule dashed over today's map, so a sheet in the
  wrong place shows at once; one pair moves it, and both placements are kept. USGS's 1943 Oswego East sheet is 652 m off
  by its own tags, and one pair corrects it. The image can be cut to its printed sheet. Map image 0.8.0.
- **Two sheets under one map.** A map takes up to four map images as ground. Map 0.33.0.
- **Rings round single houses.** A space-time cluster at one house is a ring, red for the most likely, blue otherwise,
  and Hagelloch's cluster map says how to read it. Map 0.33.0, Space-time scan 0.6.1.
- **Raster input names a picture** and sends it to Georeferenced map image. Raster input 0.12.3.

## 0.124.0 — 2026-11-15

- **Hagelloch's daily scan as a chart, in Notes.** Each evening's p-value, with a dashed line at 0.05, over the cases
  known by then. It touches the line twice, on 21 November and 5 December 1861, about what 78 unadjusted daily looks
  give by chance, and the chart says so. Six static maps of chosen days were tried and withdrawn: the maps repeated
  their captions. Chart 0.23.0 draws several columns as panels and a line at a value you state.
- **The 1824 cadastral sheet under Hagelloch's clusters.** Placed from the four junctions the sheet workflow teaches,
  its image fetched from beside the application and checked. Map image 0.7.1.

## 0.123.0 — 2026-11-15

- **A two-by-two's cells say what they hold.** Beside a, b, c and d: exposed cases, exposed controls, unexposed cases,
  unexposed controls (non-cases outside a case-control study), in Results, Notes and the publication. Salmonella's 34
  fruit items, four of them empty, now show one row each. Two-by-two 0.8.1, Table output 0.12.1.
- **Two experiments recorded for later**: each worked example retold in Python notebooks, for validation and teaching
  (217); and what a two-by-two can say of its own arithmetic, interpretation left to authored notes (TODO 34).

- **A map's key no longer sits on the map.** In a static map the class key has its own band under the map, so a
  basemap's tiles and place names never run under the labels. Salmonella's Länder over OpenStreetMap had the key on
  Switzerland. Map 0.32.1.
- **A polygon layer in Table output is a plain table.** One row per polygon with its attributes and what the step that
  made it says of each, such as a catchment's locations and deaths, and no empty Longitude and Latitude columns. A
  table with no value column is listed as it is, not spread into columns of "unknown". Table output 0.12.0.

## 0.122.0 — 2026-11-15

- **A table under the map.** A map of districts, states or other areas now has a table under it in Results with every
  attribute each place carries, a zonal statistic included, one row per place. Sort it by any column. Choose a row and
  the place is outlined on the map; choose a place on the map and its row is marked. Map 0.32.0.

## 0.121.0 — 2026-11-15

- **Salmonella has four more workflows**: who the cases were, by age group and sex beside the classical controls; all
  34 fruit items in one two-by-two, where Galia melon has the largest odds ratio, 21.4; how often the cases shop at an
  organic shop and at a market, counted for the cases alone because the controls were not asked; and where the cases
  lived, mapped over Germany's 16 Länder, with 0 where no case in the study lived. The Länder are the Federal Agency for
  Cartography and Geodesy's, dl-de/by-2-0.
- **A map's key no longer prints an empty class.** Where many places share a value, as nine Länder share 0, two class
  edges fell on it and the key printed "0.00 to 0.00". The edges are merged, and the key says so. A count is keyed in
  whole numbers under each shade: 0, 1, 2 to 5, 6 to 11. Map 0.31.4.
- **Total within groups can hand on a column as the value** even when every row is its own group, as a Land with its
  count of cases is. Without a column chosen, keeping every column is still refused. Total within groups 0.5.0.

## 0.120.0 — 2026-11-15

- **Who infected whom is in Notes.** The transmission tree was in Results and reached Notes as its sentence only; it is
  now drawn there too, and numbered as a figure in the publication. MERS and Hagelloch. Chart 0.22.1.
- **The tab bar no longer overlaps.** When the window is narrow the buttons move to a second row, so every tab stays
  whole and "Run complete" stays on one line. **Hide widgets** is now **Hide node library**, at the left end of the bar,
  next to the panel it hides; it had sat beside the Widgets tab, which is something else.
- **Oswego's map shows where Lycoming is.** The hamlet fills the figure and New York State sits small in a corner with
  Lycoming marked: a locator. The state's outline is the US Census Bureau's, public domain. A locator's box is always at
  least 18 px on the page, so a place a few kilometres across can be found in a map of a state. Map 0.31.3.
- **Dates and times of day.** Apply ruleset puts a date and a time together where a line list writes them apart, as
  `4/19` and `12:30 AM`: the date's form, the year it lacks and the clock are declared, and a value that does not fit is
  listed, never guessed. One date and time minus another is in days, hours or minutes. Cases by period counts by the
  hour. Apply ruleset 0.14.0, Cases by period 0.7.0.
- **Oswego has four more workflows**: when they fell ill, by the hour, peaking at 1 AM; hours from the meal to onset, a
  median of 4; who fell ill, by age and sex; and the vanilla ice cream on its own, a risk ratio of 5.57, with the three
  ill who did not eat it listed.

## 0.119.0 — 2026-11-14

- **Transmission chains, a new step.** It follows each case's recorded source back to the case its chain starts with
  and hands on every row with its `chain`, `generation`, `offspring` and `chain_size`, so a curve can be split by
  generation, a table can list the chains by size, and a map can be coloured by chain. Nothing is dropped: a case with
  no source, a source the table does not hold, or a loop starts a chain of its own and is counted. On MERS: 162 cases
  in 67 chains, SK_1's of 94 over 4 generations. Transmission chains 0.1.0; experiment 216.
- **An inset in a map.** On the interactive map, zoom to a crowded part and choose **Use this view as the inset**. The
  static figure, in Notes, the publication and the downloads, then shows that part enlarged in a corner, with its own
  scale bar and lines to the box it came from; or, as a **Locator**, the part fills the figure and the whole map sits
  small in a corner. Marks keep their size on the page, so marks crowded together on the whole map stand apart. A map
  shown as a static figure is picked on the preview in **Configure…**. MERS's hospitals map has one, over Pyeongtaek.
  Map 0.31.2; Map's manual, History.
- **A curve from a table of cases.** Cases by period takes a table whose rows are each one case, counted once, and can
  split it by a column, as it does points. A case in several rows, one per recorded source, counts once when the
  column naming each case is chosen. MERS's tenth workflow, *Did it come in waves?*, uses it: 135 dated cases by
  generation, 40, 28, 65 and 2, the second generation the large wave. Cases by period 0.6.0.

## 0.118.0 — 2026-11-14

- **The publication keeps what you write.** Title, affiliations and keywords, the four parts of the abstract,
  conclusions and data availability each have **Write**: a box in place, with what the part is for, its length and a
  word count. What you write is kept with the project and printed in place of the prompt. Fieldwork drafts none of it.
  A worked example that ships with Fieldwork is read-only, as its notes are.
- **Hagelloch cites its source.** Its cases name Pfeilsticker's 1863 thesis, in Methods and in References. Point input
  can carry a provenance record, as Tabular data does. Point input 0.9.0.
- **A map's title is in its caption only.** In the publication, a map no longer prints its own title above the figure
  as well.

## 0.117.0 — 2026-11-14

- **Notes lays out a publication.** Publication, at the top of Notes, shows the write-up as a paper, ready to print or
  save as PDF: title, authors and date; a structured abstract; Introduction, Methods, Results and Discussion as clean
  text, without the tab's labels and controls; figures and tables numbered, each captioned by its own note;
  limitations gathered under Discussion; Data availability naming each source; numbered references; formulas in a
  numbered Appendix, a pointer left where each stood. A sentence two workflows both wrote is printed once, and a source
  table stays out of the body. The parts you write show what they are for and how long they run; Fieldwork drafts none
  of them. Introduction and Discussion take your own notes from those sections.
- **A figure can be left out of the write-up.** Map, Table and Chart offer "Not in the write-up" beside the four
  sections: the figure stays in Results and no note is written for it. Hagelloch's day-by-day map is left out this way.
  Map 0.30.0, Table 0.11.0, Chart 0.22.0.
- **Rasters side by side are in Notes.** Rwanda's and Botswana's maps of each source's cells showed only the district
  outlines in Notes: the cells are drawn now, on one scale, as in Results. And a map's note names every raster
  wired to it, not only the first. Map 0.30.2.

## 0.116.0 — 2026-11-14

- **Notes hold every step's account.** A step that writes no Methods note of its own now says what it did, from its own
  run record; outputs write Results, sources a source note. MERS's notes: 30 to 48. A transmission tree writes its
  Results note too.
- **References list every source, whatever its licence.** A source with no licence stated, or whose publisher waived
  terms, was in no References: the licence's attribution had been taken for the reference. Now the work is cited, by its
  citation where complete, else by its source and where it was read. A raster's citation, held with its window, reaches
  Notes and References as a table's does.
- **The MERS and population examples say where every table and layer came from**: ECDC's line list, KDCA's file,
  OpenStreetMap, the milestones; both censuses, and WorldPop's, GRID3's and GHS-POP's citations with their DOIs.
- **MERS: how many each case infected**, the offspring distribution, a ninth workflow: 151 of 162 cases infected no
  recorded case, and three infected 21, 26 and 38.
- **Maps in Notes are the maps in Results.** The write-up drew maps with an older copy of the renderer: no panels, no
  raster cells, no basemap. It now draws each with the same renderer, off the page, ground included, and a categorical
  map has one key. Map 0.29.2.
- **Total within groups shows before and after** in Configure…: the rows coming in, then the table its settings make.
  Total within groups 0.4.2.
- **Relate offers a brought column under the name it is written as**, before a run. Relate a column 0.12.2; Chart 0.21.4.

## 0.115.0 — 2026-11-14

- **A faster space-time scan.** Its shuffles stop once 50 have scored at least as high as the most likely cluster
  (Besag and Clifford 1991), and the result says how many ran; a significant cluster runs them all and keeps its
  p-value. The day-by-day replay runs its days across the device's cores. And the test runs in the Rust kernel,
  shuffle for shuffle the same as before. Hagelloch's replay, in Node: 44 s to 8.3 s; the scan, 5.4 s to 3.4 s. Lab
  check 46 re-run: agrees.
- **Append rows on the standard Inspector and dialog**: the tables, the source column and its labels, numbers and a
  new key are set in Configure…, with the stacked table as the preview. Append rows 0.2.2.

## 0.114.1 — 2026-11-14

- **The population example compares each model with the census.** Each district's share in a model minus its share in
  the census, drawn per model, and the share of the country's people each model places in a different district:
  Rwanda, GHS-POP 5.6%, WorldPop and GRID3 0.0%. Each raster step also gives its districts' zonal statistics, a table
  per source. The project carries the practitioner's notes.
- **A sum keeps the precision of what it adds.** Total within groups no longer shows 5.600000000000001 for shares held
  to one decimal. Total within groups 0.4.1.
- **Append rows names a table's missing columns in one sentence**, not one per column.
- **Experiment 215** records the question of domain packs: general field tools and specialized ones, the domains
  proposed, and the first test of their boundaries against the 13 worked examples.

## 0.114.0 — 2026-11-14

- **Edit a value by hand, in Data quality.** A **Records** tab shows the records as the steps after read them, each
  value a box. A change is kept on the step as an edit, with the value it replaced and when, applied to a copy when the
  records are handed on; the file is never changed. An empty value can be filled the same way, counted apart. **Edits**
  lists them, each removable, and the run states each. Tabular data 0.11.0, Point data 0.8.0. Experiment 214.
- **A worked example's manual plays back one step at a time.** *Play back these steps*, on the Manual tab: the step
  in the manual's words, Previous and Next, the canvas holding what is placed by then. A manual can ask for an edit in
  Data quality. Experiment 173.
- **Total within groups: Mean, Median, and a column to total.** The median of each group's values present, or their
  mean; and the column summarised can be a key column holding numbers, such as days a rule computed, rather than only
  the table's value column. Its blanks are empty cells; a value that is not a number stops the run and names the row.
  Total within groups 0.4.0.
- **The MERS-CoV example has eight workflows.** Deaths by age class and by sex in a two-by-two; days from exposure to
  onset and from onset to death, with the median by outcome; secondary cases per source and the median days between
  onsets by setting. Lab check 51 recomputes them with pandas and agrees.
- **Two-by-two on the standard Inspector and dialog.** The Inspector says what is compared; Configure… holds the
  columns and values for a, b, c and d, a line list's exposures and the interval level, with the four cells counted as
  you map them. The separate mapping dialog is folded into it. Two-by-two 0.8.0.
- **A progress bar while a raster window is read.** Raster input's Apply shows how much of the window has been read,
  from a file or a remote copy such as GHS-POP's, and how much of a chosen file has been checked. Raster input 0.12.2.
- **English labels beside Korean column names.** A column's confirmed label, from a data dictionary or written in
  Describe columns, is shown beside its own name in a chart's axis and caption and beneath it in a table's heading,
  never in its place. The MERS example's KDCA dictionary gains short English labels. A chart's source line in Notes
  names the step, not its id.
- **A widget's manual page can be detached**, as a worked example's manual can: a panel beside the canvas and any
  dialog, kept through a reload, closed with Close. Italics in the manual show as italics, not asterisks.
- **Fieldwork's mark in the middle of a worked example's QR codes**, drawn at the highest error correction so a
  reader still decodes them.
- **Apply ruleset reads a number brought by Relate on a table of named values**, and "%" is understood as percent.
- **The widget catalog counts the examples built into Fieldwork**, Snow's London and Hagelloch, read from their own
  workflows; Street network and others they use no longer read "Not in a worked example yet". Each repository example's
  widgets and workflow count are written from its pinned project (`npm run examples:uses`), no longer typed.
- **A Widgets tab for each project**, beside Notes: every widget the project's workflows use, which workflows use it
  and as which steps, its manual one press away, and each workflow one press away. Read from the workflows each time,
  so nothing is kept by hand.
- **Edited values are marked in tables**, wherever the rows are shown as they were handed on, with what each replaced.
  Edits are versioned: taking one back or restoring an earlier version adds a version, and nothing is deleted.

## 0.113.1 — 2026-11-13

- **A raster file of any size can be chosen.** GHS-POP's 12 GB global grid failed with the browser's "could not be read,
  typically due to permission problems": its digest was taken by reading the file whole. It is now read a slice at a
  time, in a worker, with its progress shown and the page still responding; about a minute for 12 GB. Raster input.
- **The cell panels show the study area, and count only its cells.** GHS-POP's window held the neighbouring countries'
  cells, in its panel and in the shared classes; each panel now draws the area's outline. Map. Experiment 212.
- **Colour by on the static map of an area and points.** It was read only by the interactive map and polygon figures,
  so MERS's hospitals drew in one colour under a key that said "coloured by cases". Map.
- **Close stays at the top of the changelog and the manual** as you scroll.
- **MERS-CoV, South Korea, 2015, finished.** Two workflows in its repository: all 185 cases KDCA confirmed, by week of
  report, province and sex, with KDCA's own field descriptions as the dictionary; and the outbreak as one event against
  7-1-7, with three candidate dates for early response complete. Experiment 200.
- **A chart's bars in the table's order, numbers rising.** Categories that are all numbers rise, so weeks of report draw
  21 to 28, not 27, 26, 24 …; others keep the table's order, such as the days of the week. The menu says so. Chart 0.21.2.
- **The rule editor shows each comparison's symbol**, the two of each pair together: is (=), is not (≠), is more than
  (>), is at least (≥), is less than (<), is at most (≤). Its manual gains a table of the comparisons and one of how
  *and*, *or* and *not* are written, such as (A and B) or (C and D). Apply ruleset 0.13.2.

## 0.113.0 — 2026-11-13

- **Maps side by side.** Map's Configure… has **Arrange**: the polygon layers in panels in one row, two by two or one
  column, each with a title, all on one scale with one key, so a shade is the same number in every panel. Interactive
  panels are linked as they move: pan or zoom one and the others follow. **Grid cells too:** up to four rasters, each a
  panel of people per km² in each cell, on one reddish-orange scale. The population example shows the four sources'
  shares two by two and the three grids' cells in a row. Map 0.29.0. Experiment 212.
- **Collect polygon layers is retired into Map.** A Map takes each polygon layer on its own input, up to six, and the
  canvas and Inspector name them Areas 1, Areas 2. A saved workflow that collected layers for a map opens rewritten; one
  that collected them for another step is refused and named. South London is rewritten. The widget count is 50.
  docs/audits/collect-polygon-layers-retired.md.

## 0.112.0 — 2026-11-13

- **Snow's Map 2, placed by hand.** South London's plate is offered in Configure… and placed north-up by four features
  recorded when it was first placed: Kennington Oval, Battersea Park, Crystal Palace grounds and Nunhead Cemetery. A
  worked example can now offer an image from its own repository, fetched only when asked and checked against its pinned
  digest. Map image 0.7.0; the example at de92a84, nine workflows.
- **A polygon layer is viewed and configured in one dialog.** Choose features is in Configure…, under Preview: the
  map and the rows beside the file. Opened again, Configure… names the file the layer holds and applies without it; it
  had said "No file chosen" over 32 features read from one. A GeoJSON file's features can be chosen before Apply.
  Polygon layer 0.6.0.
- **A workflow opened from an example repository no longer says "Built on Blank canvas and changed since"** when
  nobody changed it.
- **The write-up says which workflows wait for you**, and for what, apart from those that have not run: Run workflows
  had counted Map 2 placed by hand as never run.
- **Describe columns saved during a run waits for the run** instead of saying the descriptions could not be saved.
- **Sample a raster shows two inputs, not five**: Raster, and Read at (points, a polygon layer or a study area). The
  ports underneath are unchanged. Configure… recognises a WorldPop or GRID3 raster by its file's name and says what each
  cell holds, such as *an estimated number of people living in it*. Sample a raster 0.6.1.
- **A shaded map's key is readable on screen as in the figure**: a ramp with each class edge's number beneath it, with
  thousands separators. The key names the shade, such as *population, persons*. The basemap is called unavailable only
  when no tile came; otherwise the map says how many tiles could not be fetched. Map 0.28.2; Join table to areas 0.3.2.
- **A worked example opened again is the example as it ships.** A saved copy nobody changed follows the example when it
  changes. An edited copy says so in the bar and offers the example as it is now. The comparison reads every step's
  settings, not only the steps and wires. Hagelloch's day-by-day replay and Snow's donuts were missing on a device whose
  copies had been saved before.
- **An example opened from its repository says when a newer version is pinned**, and Fetch again opens that version
  beside the copy.
- **Validation Lab check 50**: each district's cells, total and share from the three population models, recomputed
  with rasterio from the same files; agrees. Experiment 209.

## 0.111.0 — 2026-11-13

- **Population models beside a census, a worked example for Botswana and Rwanda.** WorldPop, GRID3 and GHS-POP
  totalled over each census district and set beside the 2022 census as each district's share of the country. WorldPop's
  and GRID3's shares follow the census by construction; GHS-POP's do not. Every share equals rasterio's over the same
  files. Experiment 209.
- **A raster window travels as its source, not its cells.** Exported, a window read from a web address or from a file
  whose digest is kept carries its source, window and digest; another device reads it again, checked, from the same
  address or file. Raster input 0.12.0.
- **Raster input reaches a whole country from three sources.** Cells held compactly, a raster let go once read, a kept
  window read in place: Botswana's three national windows had stalled the run. GHS-POP's global file and GRID3's files
  are read and recognised. Caps measured again.
- **Sample a raster totals each district once, over all its parts**, gives zonal statistics (median, standard
  deviation, populated cells, density per km²), and its areas can go on to table steps. Sample a raster 0.6.0.
- **A district with a 1 m² sliver is accepted.** Rwanda's Ngoma was refused. Study area 0.9.3.
- **A chart of shares says so** in its caption. Chart 0.21.1.

## 0.110.1 — 2026-11-13

- **Sample a raster over areas finishes on a country.** Botswana's 10 districts over WorldPop 2025 (123 million cells)
  did not finish in ten minutes; each area's cells are now found row by row, by the same rule, in 6.3 s. Every
  district's total equals rasterio's over the same files. Found walking the practitioner's workflow by hand. Sample a
  raster 0.5.1. Experiment 205.
- **A shaded map's ramp sits below the areas**, not across them, in a tall frame, and the key names what the shade is,
  such as *population, people per pixel*. Map 0.28.1.

## 0.110.0 — 2026-11-13

- **Colour by, for a point layer.** Map's Configure… can colour each mark by a number, in five classes from light to
  dark, every mark one size, the highest drawn on top; the key gives each class's range and count. MERS's hospitals
  sized by their cases hid the hospitals near Samsung Medical Center under its circle. Colour by and Size by exclude
  each other. Map 0.28.0.
- **Chart follows what the columns were declared to be.** A column described at its source as categories in an
  order draws its bars, and a curve's panels or stack divided by it, in that order, each code with its meaning; one
  declared in no order is never a pyramid's bands. Chart 0.21.0. Experiment 211.
- **A value none of a column's codes is a data quality finding**, *Not among its codes*, in Data quality and the
  receipt (`fw:ValueNotCoded`). The value is kept as written. Tabular data 0.10.1, Point data 0.7.1.
- **Sample a raster says what arrived, and what is missing.** Configure… names the raster, its cells and their width,
  its no-data value and its units where its source or file states them, which fill *What those values measure*. With
  nothing to read it at, it says so and offers **Read it over** the study area, which connects it and switches to areas.
  A study area with no named parts is read as one area. Its ports have one name each, on the node and in the
  Inspector. Sample a raster 0.5.0.
- **A WorldPop file is recognised by its name.** Chosen from disk as WorldPop named it, its source record fills in,
  units *people per pixel* included. Raster input 0.11.2.
- **A country alias table, in the ontology.** `ontology/country-names.json` lists 253 countries by their ISO 3166-1
  two- and three-letter codes, with each source's name: geoBoundaries, Natural Earth, and the UN's M49 names as packaged
  by datasets/country-codes (`examples/country-codes/codes.json`, three of its columns). 31 are named differently by
  different sources. `ontology/country-names.ttl` holds the same as `fw:Jurisdiction`s, both codes as SKOS notations
  and one SKOS-XL label per source. The study area's country search reads it, and takes either code: "KR" finds the
  Republic of Korea. Written by `npm run names:countries`, checked by `validate:country-names`. Kept as the sources
  write them: geoBoundaries' "Antartica", and the package's "Ivory Coast" for the UN's Côte d'Ivoire.

## 0.109.0 — 2026-11-13

- **Point data describes its columns too.** Describe columns… and View the data dictionary, as in Tabular data, for
  points held here. Point data 0.7.0.
- **Hagelloch's cases carry their source's dictionary**, the outbreaks package's, transcribed in
  `examples/hagelloch-1861/dictionary.json`. Every column arrives proposed, not accepted. `class` arrives as categories
  in no order, because the package calls it a factor; saying it has an order makes Data quality count it 0, 1, 2 with
  no median. Experiment 211.

## 0.108.0 — 2026-11-13

- **A table's data dictionary is imported with it, and kept by the project.** Tabular data's Configure… takes the
  dictionary beside the table file. The project keeps it by its digest and lists it; **View the data dictionary** shows
  it as published. What it says each column means is proposed for you to accept. A dictionary from a fetched archive is
  read, not copied. Experiment 211.
- **What kind of values a column holds.** Describe columns… can say a column holds categories in no order, categories
  in an order, numbers with no true zero or amounts counted from zero, and list its codes. An R factor in a dictionary
  proposes its codes and no order. Data quality counts a column of categories in its order, with each code's meaning,
  and gives it no median. Hagelloch's `class` is the case that asked for it. Chart does not read it yet. Tabular data
  0.10.0.
- **"South Korea" finds the Republic of Korea.** The study area's country list also takes the names Natural Earth uses
  where geoBoundaries' differ (Vietnam, Laos, North Korea and 20 more). Study area 0.9.2.
- **Two figure labels still under 14 px**: a downloaded map's place labels (12 px) and a classed map's break values
  (8 px). Map 0.27.3.

## 0.107.1 — 2026-11-13

- **No text under 14 px in any figure.** Chart and map figures, on screen and downloaded as SVG or PNG, had subtitles,
  legends, tick labels and notes at 11 and 12 px; they are 14 px now, axis titles 15. Lines wrap sooner, so a figure
  with a long subtitle is taller. The small labels inside catchment, point comparison, raster and study area drawings
  went to 14 px as well. Chart 0.20.1, Map 0.27.2.

## 0.107.0 — 2026-11-13

- **Chart's Configure… previews the chart.** The last run is drawn with the settings as they are being edited, before
  Apply, as Map's preview is. Nothing is run again.
- **Draw, question first.** The forms that suit the data come first, each named by the question it answers ("Who
  infected whom? Transmission tree"), and the reason for the one chosen is said beneath it. Forms that need other data
  are listed after, with what they need. Experiment 210's proposer, for the forms Chart draws today. Chart 0.20.0.
- **Fixed: a chart in Results was cut off at the bottom.** Its box scrolled inside the Results panel and was shorter than
  the figure, so the stacked curve's dates showed only their last characters.

## 0.106.0 — 2026-11-12

- **MERS: where were the cases in hospital?** A third workflow in the MERS example counts the cases by the hospital the
  line list names, relates each count to the hospitals table, and maps the hospitals over South Korea's 17 provinces,
  each mark's area in proportion to its cases (1 to 80). 365 Seoul Yeollin Clinic has no position and is listed, not
  drawn. Example de79282.
- **Fixed: a study area whose units sit inside one another's holes was refused.** South Korea's 17 provinces were
  refused as "one part of the area lies inside another": Gwangju sits in a hole of South Jeolla, Daegu in one of North
  Gyeongsang. Study area 0.9.1.
- **Size by, for points made from a table.** Map offered Size by only for a layer whose records are kept in its step; it
  now also reads the map's last run. Map 0.27.1.
- **The MERS data, researched:** what the package documents, where its data came from, other open data on the same
  outbreak, and dates of the response, in `docs/research/mers-korea-2015-sources-2026-11-12.md`.

- **Chart's ports, standardized.** Two ports, **Table** and **Polygon summaries**, named the same on the canvas and in
  the Inspector; the node used to read Series, Records and Catchment polygons. A case series connects to Table and is
  drawn as its curve, as before. A workflow saved with the old Series port opens with that connection on Table. Chart
  0.19.0.

- **Tabular data's Inspector, standardized.** Settings ends with **Configure…**, as every standardized Inspector does.
  **Fetch the table** is now under Result, beside "Not fetched yet." Table input 0.9.3.

- **Fixed: Manage layers did not change which marks are drawn on top.** The order was saved and not used. Point layers
  are now drawn in that order, on the static map, in its figure and on the interactive map, and a move shows at once.
  Map 0.27.1.

## 0.105.0 — 2026-11-12

- **An epidemic curve stacked by a column.** Cases by period can count each value of a column, and Chart draws the
  curve as stacked bars, one colour a value. Hagelloch's *Who fell ill?* now stacks its weekly curve by school class: the
  first class rises first, then the second, then the pre-school children. Cases by period and Chart 0.18.0,
  experiment 210.

## 0.104.0 — 2026-11-12

- **A chart marks dates.** On a time axis, such as an epidemic curve's, **Marked dates** in Configure… draws a dashed
  line at each day with a label in your own words, several to a chart. John Snow's *When did people die?* marks 8
  September 1854, *Pump handle removed*, where the curve had already turned. Chart 0.17.0, experiment 210.

## 0.103.0 — 2026-11-12

- **Map sizes marks by a number: proportional symbols.** A point layer's marks can take their area from an attribute,
  such as deaths at an address, with the key saying what the size shows and over what range. John Snow's *Where were the
  deaths?* now draws each address in proportion to its deaths, 1 to 15, as Snow drew them in bars, inside a rectangle
  fitted to the deaths and pumps. Map, experiment 210.
- **A tall study area is drawn large.** A static map's frame was a fixed 850 by 295, so an area taller than wide, such as
  Soho's deaths or Hagelloch, was drawn small in a short strip. The frame now follows the area's shape, up to 850 by 650,
  on screen and in the downloaded figure, and the panel scrolls; a wide area draws as before.
- **Fixed in a test only:** `example-updated` waits for the run the cluster example starts on opening.

## 0.102.0 — 2026-11-12

- **John Snow asks one question in each workflow.** *Where were the deaths?*, *When did people die?*, *Which pump was
  nearest?*, *Who lived within a walk of the pump?* and *How far did it spread?*, each named as its question; the epidemic
  curve, drawn three times before, is drawn once. The workflows that were kept keep their addresses. Geoprivacy stays,
  last, until it becomes a worked example of its own. Experiment 210.
- **Chart draws a population pyramid**: two groups back to back by band, the youngest at the bottom, with the rows the
  group column leaves blank said and not drawn. Hagelloch's *Who fell ill?* now draws its cases by age and gender this
  way, where it drew two panels. The first of the forms experiment 210 sets out for Fieldwork to propose from the data.
  Chart 0.16.0.

## 0.101.1 — 2026-11-12

- **Sample a raster names its ports on the canvas**: Points, Areas, Study area, Raster and Satellite files, and its
  output by what it gives, Points → or Areas →, where it showed five unnamed dots. A single point port now reads
  "Points" on any widget, not "Points 1". Sample a raster 0.4.1.
- **Fixed: 0.101.0's checks stopped before its browser tests on GitHub**, because the MERS lab fixture's builder needs
  the MERS repository, which GitHub's runner does not check out. It is now named and skipped there, as other builders
  needing a local copy are.

## 0.101.0 — 2026-11-12

- **Every number in a step's sentence comes from its result, and the gate checks it.** Each worked example, the built-in
  ones and those in their own repositories, is run and every number its steps' sentences state is looked for among that
  step's results: 420 numbers in 176 steps, none made up. Each is run twice, and every output and table is the same both
  times. Experiment 208.
- **The MERS example is checked end to end against pandas** (Validation Lab check 49): every case's days and verdicts,
  every count, Relate's rows and the transmission tree, recomputed from the source files. It agrees exactly.
- **A key value written with spaces around it is still read without them, and now that is said**, on the Data quality tab
  and in the receipt, as *Spaces trimmed*: MERS's contacts write "Family member " once. Table input 0.9.2.
- **A record is named by its key** in a step's sentence: Hagelloch's serial interval named four records as everything they
  held. Apply ruleset 0.13.1.
- **Counts a sentence states are in the receipt too**: Find health facilities records what it set aside and the total
  (0.4.2); Relate records the keys that matched several rows (0.12.1).
- **Where MERS's hospitals are.** The MERS example's repository now has each hospital its line list names, as written,
  with the facility it is, coordinates from OpenStreetMap or Wikidata, and how sure the identification is: 11 of 13 placed
  at the facility, one only at its street, one not at all. Under the ODbL, as it carries OpenStreetMap data.
- **Fixed: tables in four example repositories were fetched from commits the 2026-11-11 history rewrite replaced.** GitHub
  still served them, but only until it collects what nothing points to. They now point at the rewritten commits: the
  same files, with the same digests.

## 0.100.0 — 2026-11-12

- **Compare with a target…** in the rules dialog writes one interval against one target as ordinary rules: the days from
  one column to another, the target as a setting, Met and Not met, and No verdict where a value is missing. 7-1-7 by
  hand is this three times.
- **7-1-7 2.0.0 reads as words**: `detected_within_target`, `notified_within_target`, `responded_within_target`, valued
  Met, Not met and No verdict. 1.0.0 stays for workflows that pin it.
- **A rule's otherwise writes the column its rules name**, rather than a second column under the term's own name.
- **Fixed: a study area reaching just past a raster stopped Raster input.** Botswana's provinces from geoBoundaries
  against WorldPop's file for Botswana, two outlines of one country that differ at the border, read "Boundary extends
  beyond available raster coverage". The step now keeps the part the raster covers and says how far past which edge the
  area reaches; the run records it as a data issue, *Area beyond the raster*. Raster input and Clip raster patched.
- **A whole country's raster fits.** Botswana at 100 m, 123.2 million cells from WorldPop, was read, kept, stored,
  carried in an encrypted workflow, clipped and drawn in Chromium, and the cell cap is now that measurement (it was 16.8
  million, a province). Getting there removed three limits nobody had measured, a 5 MB file, a 64 MB decoding budget and
  10 MB of rasters and PDFs together, and two obstacles: the GeoTIFF library took 32 s to write the window, now 0.2 s,
  and the browser stores no single value over 133 MB, so a large file is stored in parts. A workflow file carries at most
  about 177 MB of files, measured; past that it says to use *This workflow, encrypted*.
- **Regression is on the standard Inspector and dialog.** The panel says in one sentence the model it will fit, and
  after a run what it estimated and which rows it used and left out; every setting is in **Configure…**, applied with
  **Apply**. The model is unchanged. Regression 0.6.0.
- **A long run shows its progress.** After a second, a panel names the step being computed and how many of the
  workflow's steps are done, and a Regression with several exposure columns counts its models as it fits them. Brazil's
  lag workflow had held the page for 35 s with nothing moving. Each model is still fitted on the page, so the page waits
  for one model at a time.
- **A chart in the notes is the chart on screen.** A chart drawn with the enhanced renderer appears in the notes as the
  same figure its SVG download gives; Brazil's rate ratios with their intervals had shown only a line asking for the
  enhanced renderer. Its description counts what is drawn, estimates with their intervals, points on a line or dots,
  rather than calling them all bars. Chart 0.15.1.
- **Chart draws a line**, along the categories in their order. Chart 0.15.0.
- **Every recorded source in a transmission tree.** A case recorded with several sources sits under the first, and each
  other recorded link is drawn dashed and counted. MERS's second workflow now draws who infected whom: SK_39 records
  three sources and SK_107 two.
- **Relate can keep one row per match**, where a key matches several rows, saying how many. Relate 0.12.0.
- **A saved copy of an example says when the example has been updated**, in the bar under the toolbar, with *Load the
  updated example*; it said only "changed since", whether the example had moved on or you had. Hagelloch's cluster
  workflow saved before the day-by-day replay was added is the case that showed it.
- **The rules dialog reads as words.** A published ruleset's names and values showed their vocabulary prefix
  (`fw:detectionWithinTarget is fw:Met`); they now read as the results table shows them (*detectionWithinTarget* is
  *Met*), and a setting is named by what it means (*Days from emergence to detection · 7 days*).
- **Make bands…** in Apply ruleset writes the rules for age bands, or any bands of a number, from cut points, with no
  gap or overlap. Apply ruleset 0.13.0.

## 0.99.0 — 2026-11-12

- **Cases by month of the year**, January to December, every year's January together, all twelve kept: a season across
  years of data. Cases by period 0.4.0.
- **Fixed: a step's warning counted a record once per column it lacked.** MERS's 162 cases read "189 records the rules
  could not read". Records are now counted once each: "27 of 162" for one column, "162 of 162 … in 2 columns" for two. A column no record
  carries, such as 7-1-7's response date on MERS, is one finding, *Field missing*, not a missing value in every record.
- **Table and Apply ruleset describe themselves as they are**: "Show what is connected as a table", and "Apply declared
  rules to each record, to classify it or compute a value". Table still mentioned catchment summaries and review
  decisions. A workflow started blank says it was built on a *Blank canvas*, not a "study area experiment".
- **No count of records can exceed the records.** Each data issue carries the records it found, and one function counts
  across issues by their union, so a record lacking two columns is counted once.
- **Sierra Leone: who were the cases?**, a fourth workflow: cases by sex, and by age band (0, 1 to 4, 5 to 9, 10 to 14,
  15 and over) with one panel per sex.
- **Chart orders bands that begin with a number by that number**: 0, 1 to 4, 5 to 9, 10 to 14, 15 and over, not as text.
- **Fixed: the georeferencing dialog's basemap filled only part of its pane** after the dialog was reopened, at every
  zoom. The map now re-measures its pane whenever the pane changes size.
- **Chart and Cases by period describe themselves as they are**; Chart still spoke of decisions, access zones and
  evidence tiers.
- **Cases by day of the week.** Cases by period counts by day of the week, Monday to Sunday, all seven kept. Hagelloch's
  first workflow shows it beside the epidemic curve: Thursday has most prodromes, 34, which is within chance. Its
  settings are in Configure… now, on the standard Inspector. Cases by period 0.3.0.
- **Data issues have their own ontology**, `ontology/data-issues.ttl`, built on W3C's Data Quality Vocabulary: one kind
  of thing and fifteen kinds, from *No value* to *Rules disagree*. The Data quality inspector, the warning on a step and
  the run's N3 receipt use the same labels, and the receipts of Table input and of Apply ruleset now state each issue.
  Table input 0.9.1.
- **The warning on a step opens whole, in a dialog**, with headings for what its rows are; *Site* and *Distance* showed
  over every warning, left from a retired example.
- **7-1-7's columns are in the ontology**, tied to the milestones and targets of `ontology/response-timeliness.ttl`, and
  each record's dates, days and verdicts are in the receipt.
- **Fixed:** a step whose rules compute values wrote a receipt holding only its timing, beginning "undefined".

## 0.98.0 — 2026-11-12

- **7-1-7 timeliness, a published ruleset.** Days from emergence to detection, detection to notification and
  notification to the end of early response, each Met or NotMet against 7, 1 and 7 days (step settings), and NoVerdict
  where a date is missing. Cited to Bochner et al. 2023. Apply ruleset 0.12.0.
- **Choose which column a published ruleset reads**, in Apply ruleset's Configure…, under *Which column holds each*.
- **Fixed:** a column of rule conclusions holding one value on every row was shown as a table's variable name, and lost
  its own column. Table 0.10.1.
- **MERS-CoV, South Korea, 2015**, a worked example in its own repository: how quickly each of 162 cases was detected
  and reported, against 7-1-7 (94 of 135 detected within 7 days of onset, 161 of 162 reported within 1 day).
  And who infected whom, and where: the 98 probable links counted by source and by setting of exposure.

## 0.97.0 — 2026-11-12

- **WorldPop's newer release, for any year from 2015 to 2030.** Raster input's Configure… offers WorldPop Global2
  R2025A beside Global1 (2000 to 2020), for any of 242 countries; choose the year your project needs. Its citation and
  DOI, its licence and its alpha status are shown with the download. Raster input 0.11.0.
- **Raster input's Configure… is the standard dialog**, with ×, Cancel and Apply.
- **Hagelloch: who fell ill**, a fifth workflow: the 188 children by age and gender, and by school class, as the file
  records them; the 11 with no gender are counted as their own group.
- **Fixed:** a chart's panels drew numbered categories in row order (ages 7, 6, 4 …) and left a panel for a blank value
  empty and unnamed. Numbers now run in order, and the blank panel is drawn and named. Chart 0.14.1.
- **WorldPop's list is checked weekly** against WorldPop's site, and a change comes as a pull request.

## 0.96.0 — 2026-11-11

- **Old Naledi and the heat example retired** as worked examples, after an audit of what only they used
  (docs/audits/old-naledi-audit.md). **Select nearby facilities**, **Evidence register** and **Travel time from
  distance** retired with them; Keep points inside the area, Table and Apply ruleset do what they did. A saved workflow
  holding one refuses to open, naming it.
- **A first visit opens Measles in Hagelloch, 1861**, rather than the synthetic heat example.
- **No ruleset has code of its own any more.** Outreach criteria, Diagnostic evidence, Access review and Extent review
  retired, with the six code paths Apply ruleset kept for them. Rules you write in a workflow keep working, under their
  own name rather than a published ruleset's. Snow's outbreak extent keeps its outline, map and curve without its rule
  step.
- **Map, Table and Chart take no decisions input:** nothing produces one now.
- **Fixed:** a published ruleset is now cited in the run's record wherever it runs, including the sea-level example's.
- **No caption on a static map.** "STUDY AREA · SPATIAL COVERAGE" and "Select a point to review its relation to the
  study boundary" no longer print across the figure; the Study area map's "Go to Old Naledi" button is gone.

## 0.95.0 — 2026-11-11

- **Mean, smallest and largest cell over each area, if you want them.** Sample a raster's Configure… has a box, *Also
  give each area's mean, smallest and largest cell value*. Ticked, each area also carries `cell_mean`, `cell_min` and
  `cell_max`, of the cells with a value. Off by default. Sample a raster 0.4.0.
- **A point layer's colour, in the Map's Configure….** Beside each layer's mark and size: one of six colour-blind-safe
  colours, by name, or the default. The Hagelloch cases on the 1824 sheet are now vermillion, not near-black. Map 0.25.0.
- **Fixed:** the heat example's captions ("Synthetic neighborhoods and cooling centers", and the Inspector's note about
  them) showed on every workflow without captions of its own, Hagelloch's among them. They show on the heat example only.
- **Fixed:** on a phone in Safari the page scrolled sideways by a few pixels (0.94.0). The header's controls now take a
  second line under the mark at phone width, where the storage figure can be read.
- **Fixed:** on a phone in Safari the header's second line sat under the project bar, which took taps meant for the
  storage figure (0.95.0). The header now grows to hold both lines.

## 0.94.0 — 2026-11-11

- **Sample a raster at points or over areas.** One step for sampling a grid. Connect a Raster input and points, as
  before; or a Raster input and areas (a Polygon layer, or a Study area's units) to get each area's **total**: the
  cells whose centre is inside it, added, with how many cells that was, how many had no data and how many lay beyond
  the raster. For a population grid that total is the grid's estimate of the people in the area. A cell counts whole,
  not split by the edge. Sample a raster 0.3.0.
- **Sample satellite files retired into it.** Connect Search a satellite catalog to its **files** port and it reads as
  before. A saved workflow holding the old step opens migrated, its settings kept, and says so.
- **"Available offline" removed from the header.** It came from one cached file and did not mean everything was ready.
  On a phone the storage figure now shortens instead.

## 0.93.0 — 2026-11-11

- **GHS-POP beside WorldPop and GRID3.** Raster input's Configure… offers the JRC's global population grid for any
  country and any year from 1975 to 2030. Only the window over your study area is read, from JRC's copy online, so there
  is no download first. Said with its licence, citations and limits. Raster input 0.10.0.

## 0.92.0 — 2026-11-11

- **Placing a point on today's map, precisely.** The hand moves the map; **Shift + click** places the point, with a
  crosshair while Shift is held; **press and hold** a numbered point, then drag, to move it, its coordinates shown as it
  moves. A plain click says how. Georeferenced map image 0.6.0.
- **Fixed:** the errors in rows marked *check this pair* were light text on a light background in the dark theme.

## 0.91.0 — 2026-11-11

- **Every Configure… dialog reads the same way.** Each control on its own line with its label above and its help below;
  numbered steps and groups as cards with plain headings; boxes and menus lined up; what is still missing in amber, and
  red kept for what failed. A step still carrying its widget's name no longer shows it twice in the title.

## 0.90.0 — 2026-11-11

- **GRID3 beside WorldPop.** Raster input's Configure… offers a population source: WorldPop for every country, or GRID3's
  2025 estimates for the 52 countries of sub-Saharan Africa, one file each, with its size, licence, citation and limits.
  Botswana's is 11.6 MB against WorldPop's 293 MB. Raster input 0.9.0.

## 0.89.0 — 2026-11-11

- **The Polygon layer on the standard panel.** Name, study area, one sentence of what it holds, and **Configure…**, which
  holds where the features come from, what to read and how to name them. **Apply** is the read: the dialog says each
  stage while it works and closes when the layer is kept; if the read fails it stays open and says why. Polygon layer
  0.4.0.

## 0.88.1 — 2026-11-10

- **More room in the workspace store.** A step's large data is now kept in the data store, by content, whatever brought
  it: a worked example's points and street network were saved inline in every workflow, twice. Opening every worked
  example took 1.6 MB of the 5.2 MB store; it now takes 0.25 MB. Workflows already saved are moved on the next start, and
  only where the data store confirms it holds the copy.

## 0.88.0 — 2026-11-10

- **OpenStreetMap under every map, unless you choose otherwise.** A static plot fetches the tiles once and draws them
  into the figure and its SVG and PNG, with the credit. Choose *None* to keep a map offline. Where tiles cannot be
  fetched, the figure says so and keeps its plot.
- **The Map's Configure… in groups**: Presentation, Basemap, Layers, the marks, Lines between records, and Title, key and
  note. On an interactive map, PMTiles import is under Basemap. The preview shows the basemap the settings chose.
- **The layer list is readable in the dark theme.** It was light text on a white panel. A test now measures every map
  control in both themes.
- **Fixed:** the basemap's credit replaced a map's own note, and its limitation was filed apart from the figure, which
  failed the write-up's own check. Map 0.24.0.

## 0.87.0 — 2026-11-10

- **Zoom where you are looking.** Placing a map image by points, a crosshair marks the centre of the image pane, and Zoom
  in keeps what is under it in place; the pane no longer jumps back to the corner after each click.
- **A worked example's pulse only on its own image.** On a different image the example's positions point at nothing, so
  no pulse is shown and the dialog says why. Georeferenced map image 0.5.0.
- **Hagelloch's day-by-day circles say what they mean.** Each day's circle is coloured by that day's p, at or under 0.05
  or above it, and the map's key names both. Before, every circle was the same blue. Space-time scan 0.4.0; the key no
  longer hides under the day panel on a short map, Map 0.23.2.

## 0.86.0 — 2026-11-10

- **What changed, from the version button.** Click the version beside the Fieldwork mark to read the release notes for
  its series, every 0.86.x release together, newest first. Step back through earlier series, and reach the full changelog. The notes travel with the
  application, so they open offline too. The mark itself still goes home.

## 0.85.1 — 2026-11-10

- **Hagelloch's 1824 sheet is served.** *Use this example's image* answered "could not be fetched (404)" on the published
  site: the sheet was in the repository but not among the files the site publishes. A test now checks every file a
  worked example offers.

## 0.85.0 — 2026-11-10

- **A study area across a border.** A study area now states its countries, one or more. **Configure countries…** names
  them, or finds them from where the area falls, each with its share of the area (*86% Botswana, 14% South Africa*), for
  you to confirm. A study area saved with one country opens with a list of one. Study area 0.8.0.
- **WorldPop across a border.** Where the study area states several countries, Raster input offers those and says it
  reads one file, so the rest of the area has no population from it. Raster input 0.8.0.
- Find health facilities still queries one country's register; across a border it asks which.

## 0.84.1 — 2026-11-10

- **A cleared point field is empty, not zero.** Placing a map image by points, a field emptied or replaced before it was
  read put the point at the image's top edge or on the equator. Georeferenced map image 0.4.1.

## 0.84.0 — 2026-11-10

- **Workflows are numbered within their project**, 1 to N: Hagelloch's are 1 to 4, John Snow's 1 to 4, Old Naledi's 1
  and 2. They had run on across projects, with gaps.

## 0.83.0 — 2026-11-10

- **Feedback while you match pairs.** Placing a map image by points, a box under the table now says how far the pair
  you just made is from where your other pairs put it, the scale and turn the placement implies, and the overall error
  as pairs were added. Over today's map it shows how far your cursor is from where the other pairs expect the feature,
  with a reminder to find the feature by looking first.
- **Preview on today's map**, with a see-through slider: the image as placed over today's map, each pair drawn twice.
  Georeferenced map image 0.4.0.
- **Hagelloch's 1824 sheet, placed by hand.** A fourth Hagelloch workflow offers the village's cadastral sheet of 1824
  and four street junctions to find. Placed north up from them, the village sits within 4 m of where the sheet's own
  frame puts it.

## 0.82.0 — 2026-11-10

- **Where to look, in a worked example.** Placing a map image by matching points, an example can now name each feature
  to find and why. A slow pulse marks the area on the image and on today's map, and the dialog says whether your click
  landed on it. Nothing is filled in for you. **Show where to look** turns the pulse off; reduced motion keeps it still.
  Georeferenced map image 0.3.0.

## 0.81.2 — 2026-11-10

- **Hagelloch's houses sit on the houses of the 1824 map.** The cases were fitted to the buildings drawn on the
  cadastral sheet NW III 3: 47 of 56 houses fall on one, north up and at the source's own scale, against 63–68% for
  random points. Every case moved together, 151 m west and 51 m south; no distance between cases changed.
- **Today's buildings agree.** Fitted to today's OpenStreetMap footprints instead, the houses land within 3 m of the
  1824 placement, north up and at the same scale.
- **Correction to 0.81.1.** The scan's circle count does still depend a little on where the village sits: moved to the
  1824 fit, Hagelloch has 1,305 circles, not 1,307. Every cluster and p-value is unchanged; lab checks 45 and 46 agree.

## 0.81.1 — 2026-11-10

- **Hagelloch is where Hagelloch is.** Its cases were placed 3.7 km east, in Tübingen's Waldhäuser-Ost, from a wrong
  coordinate; the 1824 cadastral sheet, OpenStreetMap and the German Wikipedia agree on the village 3.7 km west. Every
  case moved together, so no distance between cases changed.
- **The space-time scan's circles no longer depend on where a place sits.** Houses within 10 cm of the same distance
  join a circle together. Hagelloch's clusters and first day flagged are unchanged. Space-time scan 0.3.1; lab check 46
  re-run.

- **A study area acquired as administrative units hands its country to every step that needs one.** The country was
  read from the wrong place, so an area picked as Botswana's districts stated none: Raster input asked again, and so
  could Find health facilities. Fixed for every saved project, and the country is now found
  upstream, through any step between the study area and the step that needs it; two countries upstream are named and
  one is chosen.
- **WorldPop is reachable from Raster input's Configure… whatever the study area.** Where the area states no country,
  the dialog asks for it, keeps it on the area, and offers the year and the download at once. Raster input 0.7.2.
- **A map image's port is named on the canvas**: *Map image (ground)*, where it read "Points undefined". Any port the
  canvas does not know is shown by its own name.
- **Checked by somebody else's code**: lab check 48 places South London's Map 2 from its four points with GDAL's own fit
  and gets the same placement as Fieldwork, to the last digit.

## 0.81.0 — 2026-11-10

- **Place a scanned map by matching points.** Georeferenced map image's Configure… offers *By matching points on the
  image and today's map*: click a feature on the image, then the same feature on the map, or type the numbers. Each
  point shows its error in metres, and a doubtful pair is marked. Fitted north up, or turned and stretched. Georeferenced
  map image 0.2.0.
- **A turned map image is drawn turned**, on the static figure and the interactive map; a world file that turns the
  image is placed, no longer refused.

## 0.80.2 — 2026-11-10

- **Raster input no longer asks for the country again.** It is read from the study area, and WorldPop's population
  raster, its year and its download are in Configure…. Raster input 0.7.1.

## 0.80.1 — 2026-11-10

- **Map's preview in Configure… no longer raises errors.** It mounted and removed a map on every change, and a canvas
  layer could redraw after its map was gone; the page reported an error, seen first in Safari. Fixed. Map 0.23.1.

## 0.80.0 — 2026-11-10

- **A worked example's write-up says where it lives online.** At the foot of References, two QR codes with their
  addresses printed beneath: Fieldwork with the example opened, and the example's own files at the version it was made
  from. Codes are drawn on your device.
- **A link opens any worked example.** `?example=oswego-1940` (or any catalog example's name) downloads it, checks it
  against its pinned digests, and opens it, as its button does.
- **Checked by somebody else's code**: lab check 47 reads every code back with OpenCV.

## 0.79.0 — 2026-11-10

- **Watch the space-time replay day by day on the map.** On an interactive Map, **Play** or drag the slider: each day
  shows that day's most likely cluster, the cases known by then, and what the scan said. Hagelloch's *Was there a
  cluster?* has it. Space-time scan 0.3.0.
- **Generations in colour, in the tree and on the map.** Chart's transmission tree and Map's lines between records share
  one colour key, darkest for a chain's first case. In the tree, a case's shape now says what it is. Chart 0.13.0.
- **Map's Configure… draws the map**, beside its settings, before you Apply, so a mark's size or a basemap is seen as you
  choose it. **Import tiles** (PMTiles) moved there from the Inspector. Map 0.23.0.
- **The note under an interactive map** no longer describes travel times on a map that has none.

## 0.78.0 — 2026-11-10

- **The space-time scan replays an outbreak day by day.** Under **How to scan**, choose **Day by day**: each day, the
  cases known by then, and only clusters still going on. It says the first day the p-value was at or under 0.05. On
  Hagelloch: 21 November 1861. Each day's p-value is that day's alone, and the step says so. Space-time scan 0.2.0.
- **The scan writes a Methods note and cites its method**, Kulldorff and others 2005, which reaches References.
- **Checked by somebody else's code**: lab check 46 recomputes the scan and the replay in numpy, and agrees. It found
  the scan missing one circle of houses, now fixed (0.1.1); no cluster changed.

## 0.77.0 — 2026-11-10

- **Space-time scan, the first step under Detect.** For a line list of cases with dates and places: the space-time
  permutation scan SaTScan runs, looking for places where cases came closer together in time than the rest of the list
  would lead you to expect. Circles over places, runs of days or weeks, a p-value from shuffling the dates with a
  recorded seed, secondary clusters that share no place. Runs with a progress bar. Space-time scan 0.1.0.
- **Hagelloch has a third workflow, *Was there a cluster?***: one house, 8 cases where 0.55 were expected, at the start
  of the outbreak.
- **Table shows a polygon layer's own properties**, which it used to leave out.
- **Map's lines between records are checked by somebody else's code**: lab check 45, against pandas.

## 0.76.0 — 2026-11-10

- **Lines between records on Map.** In Configure…, choose a column that names another record, such as `infector`,
  and the column it is found by, such as `case_ID`. A line with an arrowhead runs from the named record to the one
  naming it, on the static figure and the interactive map, and the key names it. Every record is counted: drawn, at
  the same place (90 of Hagelloch's 184 links join two children of one house), naming nothing, or naming a record
  that cannot be found or placed. Map 0.22.0.
- **Hagelloch's *Who infected whom* has a map of the links.**
- **Chart's transmission tree is checked by somebody else's code**: lab check 44 recomputes every case's chain and
  generation with networkx, and they agree.

## 0.75.0 — 2026-11-09

- **Who infected whom, drawn: a transmission tree in Chart.** Set **Draw** to *Transmission tree* in Configure… and
  name the case, infector and date columns. Each case is a point at its date; a line runs from its infector, so its
  length across is the serial interval. Drawn by Vega-Lite and exportable. Cases with no infector, an infector not in
  the table, a loop or no date are counted and coloured apart, never dropped. Chart 0.12.0.
- **Hagelloch has a second workflow, *Who infected whom***: the serial interval, secondary cases per child and the
  tree, ready to run.
- **Chart is on the standard Inspector**: name and write-up section, inputs, one sentence and Configure…, which holds
  every setting it had.
- The Sierra Leone, NYC and Brazil examples' manuals set Chart in Configure…; re-pinned.
- Validation: Chromium locally; WebKit in CI.

## 0.74.0 — 2026-11-09

- **Satellite readings are kept on this device.** Sample satellite files keeps what each file gave at your places, a
  few numbers per place, so a file read before the same way is not read again after a reload or on another day. The
  result says how many files came from the device, and the receipt records it. Configure… can read every file again,
  or forget the saved readings. Sample satellite 0.7.0.
- **Sample satellite is on the standard Inspector**: name, inputs, one sentence, Configure… and the last result.
- **Table's inputs are streamlined like Map's**: the node shows what is connected and one + Add an input; the
  Inspector has one Add an input picker. The table port no longer reads "Points undefined". Table 0.9.0.
- **The line under a workflow's title** no longer describes the example it started from once it has changed.
- Experiment 200: resources and procurement are in reach; remote coordination of a multi-site investigation added as
  an open question; open data and studies listed for each 7-1-7 bottleneck theme.
- The Brazil dengue example's manual sets the place column in Configure…; re-pinned.
- Validation: Chromium locally; WebKit in CI.

## 0.73.1 — 2026-11-09

- **John Snow's outputs no longer overlap on the canvas**: Table, 317 px tall, lay under Chart, so a click on Table
  could select Chart. Each output now starts below the one above it.
- Tests: a run's progress is recorded as it happens rather than caught on screen; a request WebKit reports when a
  test's navigation cancels it is no longer counted as an application error; Hagelloch's offline test visits once.
  These failed WebKit, and once Chromium, on every main run since 0.70.
- Validation: Chromium and WebKit locally on macOS; Linux in CI.

## 0.73.0 — 2026-11-09

- **Who infected whom in Hagelloch, 1861, by hand** (200, steps 1 to 3): the serial interval, 184 values with a median
  of 10 days, and each child's secondary cases, 126 of whom infected no one recorded. Validation Lab check 43 agrees
  with pandas on all 188 cases.
- **A table port reads a point layer** as a table: each point a row of its attributes, without its geometry.
- **Relate, Bring it in as**: the brought column is written under a name you give it, so a table can be related to
  itself. **A category you type as a number is written as that number**, and the column stays a number; the dialog
  says to use one only where no match means none. Relate 0.11.0.
- **Apply ruleset reads dates**: year-month-day, and one date minus another gives days. Any other arithmetic with a
  date is refused while the rule is written. Apply ruleset 0.10.0.
- **Point data is on the standard Inspector**, with its table settings in Configure…. Point data 0.6.0.
- **An ontology of response timeliness** (7-1-7): milestones, targets, and the bottleneck and enabler categories of an
  open-access study of five countries, with its source on every term.
- **The blank canvas no longer says "Developmental evaluation"**, which is how Fieldwork is built, not a step for
  you. It says Step 1 of 2.
- Relate's dialog, before a run, now offers a count's column to bring.
- DTU25MSS's 2.9 GB file read in parts in 0.7 s, identical to h5py at all 221 nodes (198).
- Validation: Chromium locally; WebKit in CI, where earlier main runs failed and fixes are pending.

## 0.72.0 — 2026-11-09

- **Raster input reads a NetCDF-4 grid from this device, in parts** (198, step 2): a regular latitude–longitude grid,
  one variable chosen where the file holds several, its fill value, scale factor and offset applied, kept as the
  window around the study area as a GeoTIFF is. DTU25MSS's 2.9 GB file is the case it is for. Raster input 0.7.0.
- **The NetCDF reader is saved for offline use**, so a large file kept on the laptop can be read without the
  connection. It adds 5.7 MB to what Fieldwork stores on first visit.
- **EGM2008 at Manila's gauge, read by Fieldwork, is pyproj's**: 43.0092 m against 43.009 m, now a unit test.
- **Validation Lab check 42** recomputes the sea-level example's third workflow with rasterio, SciPy and NumPy: the
  same heights within 1e-9 m and the same 16 of 194 facilities.
- Validation: Chromium locally; WebKit in CI.

## 0.71.0 — 2026-11-09

- **Which of Manila's health facilities stand on ground below the sea level projected for 2100, by hand** (198): the
  sea-level example's third workflow reads DeltaDTM, EGM2008 and DTU25MSS, with no national datum, and finds 16 of 194,
  as Python on the source tiles does. Not a flood map: no tide, surge, defences or drainage, and the terrain model is
  least certain at the coast. Its write-up has fourteen notes and cites eight works.
- **Raster input reads a GeoTIFF at a URL**, keeping only the window around the study area, and offers **Download the
  whole file** with its size, to keep on the laptop. Grids published at nodes (`PixelIsPoint`), as EGM2008 is, are
  read half a cell over, and that is recorded. Raster input 0.6.0.
- **Sample raster can read bilinearly** between the four nearest cell centres, chosen and stated in the receipt.
  Sample raster 0.2.0.
- **Raster input and Sample raster are on the standard Inspector and dialog** (186).
- **A published ruleset that computes values runs on a table directly**, and its computed columns are numbers.
- **Correction: the two sea-level widgets retire only now.** 0.70.0 to 0.70.2 announced it, but their releases were
  not registered, so the build kept them in the catalogue. They are registered as retired, with the ledgers updated.
- **The widget catalog lists the widgets you can use, and the worked examples that use each one.** It has one way
  in, Widget catalog › beside the node library; the header button is gone. Retired widgets, versions, digests, checks
  and packs are no longer in it; a step's version, digest and check are in its Inspector.
- Experiment 58 closes: the three sea-level widgets it built have all retired into standard widgets and rulesets.
- Tests seed a workflow before the page loads instead of writing storage and reloading, which raced in WebKit in CI.
- Validation: Chromium locally; WebKit in CI.

## 0.70.2 — 2026-11-09

- **The sea-level example finds its facilities by hand**, with Find health facilities from the Humanitarian
  OpenStreetMap Team's Philippines export, rather than shipping them as a file: the same 194, with a true retrieval
  record. The test answers the export's address with the real file (ODbL), rebuilt 2026-05-05.
- The research note records the open estimate of local mean sea level at the eight gauges (DTU25MSS above EGM2008, no
  national datum needed) and a first count of facilities below projected sea level, in Python, for the canvas to
  reproduce.
- Validation: Chromium locally; WebKit in CI.

## 0.70.1 — 2026-11-09

- **The sea-level example's write-up states the Manila datum figures**: EGM2008 and NAMRIA's gravimetric geoid agree
  within 2 mm at the gauge, NAMRIA's mean-sea-level surface is 0.85 m above both, and which years that mean sea level
  stands for is not stated, a gap of 0.1 to 0.76 m by the gauge's record. Six works cited; the TAO paper by its DOI.
- The rules tests wait for Run to be enabled after a reload, which Linux WebKit in CI did not.
- Validation: Chromium locally; WebKit in CI.

## 0.70.0 — 2026-11-09

- **The two sea-level widgets retire** ([197](docs/experiments/197-the-sea-level-widgets-retire.md)). **Assign
  projection site** is **Measure distance** and **Relate**; **Compare level to elevation** is the published ruleset
  *Compare a projected rise with an elevation* 1.0.0, applied by **Apply ruleset**. Neither held anything about sea
  level. A workflow holding either is refused, by name. Removed outright: nobody outside the project uses them.
- **A step that reads a table reads Measure distance's result**: one row per point, its nearest candidate by the
  candidate's own attributes (`nearest_site_id`), and the distance.
- **Measure distance is on the standard Inspector and dialog** (186): the unit and the conditions a candidate must
  meet are in Configure…. Measure distance 0.6.0.
- **A column a table declares numeric reaches rules as a number.** A value Relate brought across was read as text, and
  rules over it concluded nothing.
- **The sea-level example is built from standard steps only**, and its README says its eight gauges match PSMSL's
  stations. **Its write-up is drafted as if for submission**: twelve notes across the four parts, with functions, whose
  words and argument, and five works cited through the citation builder.
- **The note dialog's section, function and source questions are named for a screen reader**: each label is tied to
  its control.
- Validation: Chromium locally; WebKit in CI.

## 0.69.0 — 2026-11-09

- **A note can carry a picture** ([196](docs/experiments/196-a-picture-in-a-note.md)). Under **Image** in a note you
  write, choose a PNG, JPEG, WebP or SVG file and write its alt text and caption; both are required. It is shown above
  the note's words on the board and in the write-up, as an image: an SVG is never put into the page. It is kept on
  this device by its digest, and an exported project carries it.
- **The sea-level example's write-up opens with the vertical-datum diagram**, as a note of its Introduction.
- Validation: Chromium locally; WebKit in CI.

## 0.68.0 — 2026-11-09

- **The sea-level example moves to its own repository, and reports a sea level**
  ([195](docs/experiments/195-the-sea-level-example-reports-a-sea-level.md)).
  [example-2026-sea-level-rise-philippines](https://github.com/digital-twin-ph/example-2026-sea-level-rise-philippines)
  holds the AR6 projections, the gauges and Manila's facilities, with two workflows: which gauge applies to each
  facility and how far, and the rise there by 2100, 1,124 mm under SSP2-4.5 with vertical land motion. Its README
  says what a flood question would need: the terrain models, their datums, and the offset to local sea level. The
  built-in Manila example is removed.
- **Tabular data can list a column's distinct values**, under **List the distinct values of**. Assign projection
  site reads its sites there; before, only code could set it. Tabular data 0.9.0.
- **Relate offers an assignment's columns before a run**, so a projection can be brought beside each point.
  Relate 0.10.1.
- **Table is on the standard Inspector and dialog** (186): Show totals and Display as are in Configure…. A number
  brought beside each row is drawn as a column, never as the headings. Table 0.8.0.
- Validation: Chromium locally; WebKit in CI.

## 0.67.1 — 2026-11-09

- **A map's value classes count each place once.** A place drawn in many parts was counted once per part: Bonthe,
  83 of the 162 parts of Sierra Leone's 16 districts, filled half the values the classes were cut from, so the key
  printed an empty class, "6.72 to 6.72", and moved every other edge. Every part is still drawn in its place's
  class. Map 0.21.1.
- Validation: Chromium locally; WebKit in CI.

## 0.67.0 — 2026-11-09

- **Relate allows for spelling** ([193](docs/experiments/193-relate-allows-for-spelling.md)). Under **Compare keys**,
  *allowing for spelling, and dropping words* folds the names, takes out words you name, such as *District*, as whole
  words, and matches a name to the one spelled closest, at a similarity of 0.88 to start and adjustable. The preview
  lists every name and how it matched; two names equally close wait under **Decisions**; a name not found is an
  unmatched row, decided as any is. The second table's key column can be named differently from the first's, and a
  new column says how each row matched. Relate 0.10.0.
- **Rate can read both numbers from one row**: a count, and a population brought beside it by Relate, which now
  brings a value column as a number with its unit. On the standard Inspector and dialog, whose preview shows each
  group's rate before Apply. Rate 0.4.0.
- **Study area repairs a published boundary, and says so** ([194](docs/experiments/194-the-boundary-repair.md)). A
  point written twice in a row, and the tip of a zero-width spike, are removed as a boundary is read; neither changes
  any outline's area. The dialog says what was removed, and the evidence lists each vertex, as CC BY requires of a
  change. A refused boundary names the unit at fault. On the standard Inspector. Study area 0.7.0.
- **Measles in Sierra Leone gains its third workflow**: cases per 100,000 people by district, over the 2021 census,
  on OCHA's districts.
- **Deduplicate records is on the standard Inspector and dialog** (186). Deduplicate records 0.3.0.
- The file input of a boundary file has an accessible name.
- Validation: Chromium locally; WebKit in CI.

## 0.66.0 — 2026-11-09

- **Map is on the standard Inspector and dialog** ([186](docs/experiments/186-one-standard-inspector.md)). Its name
  is the Results tab's, its layers are its inputs, and one sentence says what it draws. **Configure…** holds the
  presentation, the write-up section, each layer's class, mark name and symbol, and the standalone figure; Apply
  redraws the map without running again. **Manage layers…** is beside it. Map 0.21.0. The rulesets, NYC and Sierra
  Leone manuals open the dialog.
- Validation: Chromium locally; WebKit in CI.

## 0.65.0 — 2026-11-09

- **Measles in Sierra Leone has its first two workflows**: an epidemic curve by month of onset, and the facilities
  that saw ten cases or more, found by name in GRID3's register and coloured by band on a map. Small counts are left
  off the map, as the file's terms ask. Each record of the teaching file carries a case number.
- **A rules step, a map's pin class and Find health facilities read what the step before them gave out**, for a table
  or points it computed: the columns offered were the stored inputs', so a register's columns stood in for the
  facilities matched from it. Apply ruleset 0.9.1, Map patch.
- **A missing value is reported only for a column the rules read.** A district nobody recorded was counted against
  rules that never read it.
- Two actions in a narrow Inspector wrap instead of clipping.
- Validation: Chromium locally; WebKit in CI.

## 0.64.0 — 2026-11-08

- **A case definition in the rulesets worked example**: sixteen made-up suspected cases classified in four stages, with
  *is not* and *otherwise*, then counted with each class's share. Its seventh workflow.
- **A rule can read a category another rule gave**, by its name, so a classification is written in stages. A category
  reads in the table as it was typed: *Cannot be classified*, not *Cannot_be_classified*. Apply ruleset 0.9.0.
- **Comparisons are colour-keyed by family**: comparisons of numbers, *is* and *is not*, and *is recorded*, each with
  its own edge.
- Validation: Chromium locally; WebKit in CI.

## 0.63.0 — 2026-11-08

- **Apply ruleset has "is not" and "otherwise"** ([192](docs/experiments/192-is-not-and-otherwise.md)). *Rash is not
  No* matches a recorded value that differs. An otherwise gives a column a value where no rule did, once the columns its
  rules read are settled, so an ordered classification is written as columns in stages. The records that took it are
  counted. Rules with an otherwise run directly; rules with only *is not* still run in the reasoner.
- **A table's rows are kept before Save closes.** A reload straight after saving a table could lose it: the rows were
  still being written ([175](docs/experiments/175-how-large-a-table.md)).
- **Rules are drawn as coloured blocks**: if, or, then and otherwise, each with its word and its own edge.
- **Apply ruleset is on the standard Inspector and dialog**: one sentence and **Configure…**. The records, columns,
  units, settings and rules are set in the rules dialog; a published ruleset is chosen in its own dialog. Apply
  ruleset 0.8.0. The rulesets example's manual opens the dialogs.
- Validation: Chromium locally; WebKit in CI.

## 0.62.0 — 2026-11-08

- **Total within groups gives each group's share, %** ([191](docs/experiments/191-shares-within-groups.md)), beside its
  count or sum: within the columns you tick, or of the whole table. Shown as two columns. A share of an unknown total
  is unknown. Total within groups 0.3.0, on the standard Inspector and dialog: its settings are in **Configure…**,
  with the table they make as the preview. The Brazil and NYC manuals open the dialog.
- Validation: Chromium locally; WebKit in CI.

## 0.61.0 — 2026-11-08

- **OpenStreetMap is a register for lists** ([190](docs/experiments/190-find-health-facilities-from-a-list.md)):
  the country export Find health facilities already downloads, for any country, under ODbL. It has no facility types,
  so a name it matches allowing for spelling is held for your review and has no point until you choose. On Sierra
  Leone's names it adds one hospital after GRID3 and nothing wrong. Find health facilities 0.4.0.
- **An exact name in any register is taken before a spelling in an earlier one.**
- Validation: Chromium locally; WebKit in CI.

## 0.60.0 — 2026-11-08

- **Find health facilities finds facilities from a list** ([190](docs/experiments/190-find-health-facilities-from-a-list.md)).
  Each row's facility name is matched to national registers (GRID3 for Sierra Leone, Nigeria and DR Congo, declared in
  the ontology), and every row is marked: matched exactly, allowing for spelling, type differs, ambiguous, an area not a
  facility, or not found. None is dropped; you decide the ambiguous ones. Find health facilities 0.3.0, on the standard
  Inspector and dialog.
- **Facility registers and match outcomes are in the ontology**, and the register catalogue is generated from it.
- **Measles in Sierra Leone** ([189](docs/experiments/189-a-measles-line-list-made-safe-to-teach-with.md)): a
  semi-synthetic, de-identified teaching file in its own public repository, compared with the original.
- Checkbox lists in configuration dialogs sit beside their words.

## 0.59.0 — 2026-11-08

- **The built-in rulesets and spatial coverage examples are removed.** What the rulesets example taught is in the
  *Rules on synthetic data* worked example, which gains two workflows: rules the N3 reasoner runs, and rules over
  points coloured on a map, with counts stored as text read as numbers in Data quality. Its six workflows build from an
  empty canvas by its manual. Keep points inside the area now has no worked example, and says so.
- **A column's kind is declared** in Apply ruleset's Inspector: number, category, or true or false. Apply ruleset 0.7.0.
- **A map can be coloured by what rules concluded.** Map patch release.
- **A manual can ask for a file of its repository** to be downloaded and chosen, where a widget takes a file, not a URL.

## 0.58.0 — 2026-11-08

- **Tabular data reads Excel workbooks** (`.xlsx`): choose the sheet, and it is set up as a CSV is. The step says which
  sheet it read. Tabular data 0.8.0.
- **Fixed: Next rows did nothing** in the import dialog's After table, Relate's preview and Select rows' preview. Only
  the Results view listened for it. Relate 0.9.1, Select rows 0.4.1.
- Two browser tests that need the NYC package, and so were skipped in every gate, had gone stale: one expected four
  workflows where the example has six. Both now pass, and the gate is run with the package.

## 0.57.0 — 2026-11-08

- **Tabular data is on the standard Inspector and dialog** ([186](docs/experiments/186-one-standard-inspector.md)).
  The Inspector says in one sentence what the step reads, and **Configure…** opens the import, now headed with the
  step's name and closed by **Cancel** or **Apply**. *Convert the source table on each run* is in the dialog and can be
  changed without reading the file again. Tabular data 0.7.0.
- **Fetch the table is a button of its own**, under Settings, no longer a word inside a notice.
- **The datum diagram** in the terrain models note shows how the heights a terrain model gives relate to the geoid,
  the ellipsoid and local sea level.
- The NYC, Brazil and rules manuals say **Configure…** and **Apply**.

## 0.56.0 — 2026-11-08

- **A computed column states its unit and what it measures**, beside the rule that makes it
  ([188](docs/experiments/188-rules-that-compute-and-show-their-table.md)). The output table carries both. A new column
  without a unit is said, not refused. Apply ruleset 0.6.0. The rules worked example now states every one.
- **The run's notice counts unreadable values apart from empty ones.** "66 records could not be read" is now "63
  records could not be read as declared, and 3 records have no value".
- **Fixed: the offline worker left a failed background fetch unhandled.** In WebKit it surfaced as a page error naming
  `sw.js`, and failed ten to fifteen tests in each CI run. Whether this clears them is known when CI has run.
- **Lab parity records corrected:** every claim now matches the result it names (`validate:parity` passes). The
  corridor's claim is to release 0.2.0, which is the one the lab checked.

## 0.55.0 — 2026-11-08

- **Derive a value is retired into Apply ruleset**
  ([188](docs/experiments/188-rules-that-compute-and-show-their-table.md)). Its four uses in the South London and
  Nigeria examples are Apply ruleset steps now, with one rule for every record; every output of the four workflows
  gives the same rows as before, checked by digest. A saved workflow with a Derive a value step opens with it changed
  into an Apply ruleset step, stamped, and asks for the units of what it combines. Apply ruleset 0.5.0; Derive a value
  1.0.0, retired.
- **A worked example of every rule feature**, on made-up data: *Rules on synthetic data*, four workflows with a manual
  that builds them from an empty canvas.
- **Settings are declared in the rules dialog**: a name, a value and a unit, for a threshold changed without rewriting
  a rule.
- **Only the columns the rules read need a unit.** A sum or difference of two different units is refused while the
  rule is written.
- **Fixed: a condition on a category never held.** A value typed for a category column, such as *clinic is Hillside*,
  was stored as text no record could equal. It is now the category, as the record's value is.
- **An Apply ruleset step lists its input in the Inspector**, as every step does, and the step after it is offered
  the columns and values its rules add.

## 0.54.0 — 2026-11-08

- **A rule can read the previous row** ([188](docs/experiments/188-rules-that-compute-and-show-their-table.md)).
  In Apply ruleset's dialog, either side of a computed value can be a column *in the previous row*: new cases are a
  cumulative count minus the count in the previous row. Apply ruleset 0.4.0.
- **The rows are sorted inside the step**, above the rules: by a column, dates first, within each place or group, and
  the previous row is the row recorded before, or the day, week or month before. The file's own order is never used.
  The preview shows Before, Sorted and After.
- **What has no single previous row is said:** the first row of a place, a missing week, and a week recorded twice
  give no value and are named. A count that falls is kept and named.
- **Not yet:** rebuilding the Nigeria and South London workflows with Apply ruleset, the synthetic repository's
  workflows, and retiring Derive a value.

## 0.53.0 — 2026-11-08

- **Select rows by value is on the standard Inspector and configuration dialog**
  ([186](docs/experiments/186-one-standard-inspector.md)). The Inspector says in one sentence what the step keeps, and
  after a run how many rows it kept and left out. The column, the values or the range are set in **Configure…**,
  which shows how many rows they keep, and the table, before **Apply**. Select rows 0.4.0. Saved workflows open as
  they were.
- **186 has its counts:** of the 24 widgets the published examples use, Relate and now Select rows meet the standard.
  Moving the rest, in order of use, is what closes it.
- The NYC and Brazil manuals are rewritten for the dialog.

## 0.52.0 — 2026-11-08

- **A rule can compute a new column** ([188](docs/experiments/188-rules-that-compute-and-show-their-table.md)). In
  Apply ruleset's dialog, a conclusion can be *a computed value*: *houses without a death* is *houses* minus *deaths*.
  Plus, minus, times or divided by; each side a column, a value another rule computed, or a number. A rule can apply to
  every record. Apply ruleset 0.3.0.
- **The rules dialog shows Before and After**, updated as you edit: the records as they arrive, and with the new
  columns and the rule each matched. Each rule says how many records it matched.
- **Divisions by zero, missing values and disagreeing rules are said in words**, in the dialog and in the run, and
  the record is named. Nothing is filled in.
- **A wide table is read as the file had it:** one record per subject, its columns by their own names. All four
  Derive a value steps in the South London and Nigeria examples give the same table through Apply ruleset.
- **Apply ruleset has a manual page.**
- **Not yet:** rules that read the previous row (new cases from a cumulative count), the sort they need, and
  retiring Derive a value. The worked examples still use Derive a value.

## 0.51.0 — 2026-11-07

- **Cases by period counts weeks starting Sunday** ([187](docs/experiments/187-two-ways-to-an-epidemic-curve.md)).
  Choose *week, starting Sunday (epidemiological week)* for data like Brazil's, whose weeks start on a Sunday. The
  Monday week (ISO 8601) is unchanged. Cases by period 0.2.0.
- **Cases by period can take a table.** *Records arrive as: points, or a table, each row a count.* The run could
  already read a table, but nothing in the Inspector could choose one. A series read from a table keeps its unit.
- **The Brazil epidemic curve uses Cases by period.** The same 51 weekly totals, with the kind of date stated: the
  source does not say whether a week is of onset or notification, so it is *a date of unstated kind*.
- **A weighted curve says what it counted.** Snow's curve said *616 records*; it is 616 deaths from 43 records, and now
  says *616 cases from 43 records*. Chart 0.11.1.
- **Cases by period has a manual page.**

## 0.50.0 — 2026-11-07

- **Experiment 185 is validated** ([185](docs/experiments/185-one-step-for-every-lag.md)). Validation Lab check 38
  compares one Regression fitting a model per lag with pandas lags and statsmodels, in CPython and in Pyodide, and
  agrees. The live MODIS run of the rebuilt 2010–2025 workflow reproduces experiment 182's figures.
- **Each model states its own counts.** With several models, each model's line gives its rows, its strata used and
  dropped, and its own dispersion. The heading gave the first model's dispersion as if it were every model's.
  Regression 0.5.1.
- **No limit on how many shifts Relate brings.** The limit of 24 was chosen, not measured. Measured on 77,740 rows:
  about half a second per shift, linear to 384 with nothing failing. Relate 0.9.0.
- **Not changed:** a shift at which no row matches still stops the step, instead of giving an empty column. Recorded
  in 185 for a decision.

## 0.49.0 — 2026-11-07

- **The Brazil lag workflows use one Relate and one Regression** ([185](docs/experiments/185-one-step-for-every-lag.md),
  stage 3). The 2024 workflow has 14 steps instead of 31, and 2010–2025 has 18 instead of 43. Every model gives the
  same estimates as the separate models it replaced. The lag chart's horizontal axis is now the shift in days.
- **An adjusted variable can follow the shift.** With several models, tick *follows the shift* under an adjusted
  variable, and each model is adjusted for its own column: the rain at its own lag beside the temperature at that lag.
  One column per model, filled in Relate's order and each changeable. Regression 0.5.0.
- **A chart after a several-model Regression is offered its columns**, shift_days among them, before a run.
- **A second Relate with several shifts keeps the first one's shifts.** It replaced them, so the models lost their
  shift_days and the run failed. Relate 0.8.2.
- **Not yet checked:** the live MODIS run, so the 2010–2025 figures recorded in experiment 182 are not yet reproduced
  by the rebuilt workflow; and no Validation Lab check covers the several-model table.

## 0.48.0 — 2026-11-07

- **Regression fits one model per exposure column** ([185](docs/experiments/185-one-step-for-every-lag.md), stage 2).
  Under Exposure, **Also fit, one model each, with** offers the table's other columns, such as Relate's shift columns.
  Each ticked column gets the same model with only the exposure swapped, fitted on its own rows: a week with no value
  at one shift is left out of that model only. The models come out as one table with the columns exposure,
  shift_days (where Relate recorded the shift), role, term and statistic. A column that cannot be fitted is a row
  saying why. Regression 0.4.0.
- **Relate with several shifts offers the right columns to the next step.** A following step was offered the single
  shift's column and period helpers, which a several-shift run does not make, and not the shift columns it does.
  Relate 0.8.1.
- **Not yet done:** the Brazil lag workflows still use one Relate and one Regression per lag. Rebuilding them, and
  comparing every model with Validation Lab checks 36 and 37 and the 2010–2025 figures, is stage 3.
- **Checked:** the unit suite, and the new browser check and the Relate panel checks in Chromium and WebKit; the full
  gate in Chromium.

## 0.47.0 — 2026-11-07

- **Relate is the first step with the standard panel and dialog** ([186](docs/experiments/186-one-standard-inspector.md)).
  Its panel shows the name, the two inputs, one sentence saying what it will do, **Configure…**, one line of what the
  last run gave, the Manual, Evidence and Version links, and Duplicate and Remove. Everything else is in its dialog:
  - **Settings:** what to match on, what to bring across, how keys are compared, a date within a period, and the list
    of shifts, which can now be set: one column per shift.
  - **Preview:** the join these settings would make, with its effect on each numeric variable, the Methods note and
    the table, before anything is applied.
  - **Decisions:** what happens to rows that did not match. Neither choice is ticked to begin with.
  - Nothing changes until **Apply**. Cancel, × and Escape leave the step as it was, and ask first if something was
    changed.
- The NYC and Brazil manuals are rewritten for the new dialog. Saved workflows open as they were.

## 0.46.0 — 2026-11-07

- **Micro-workflows are retired.** No worked example used one. A workflow saved with one refuses to open and names
  it; rebuild the steps it held from the palette, where every one of them still is. Nobody outside the project builds
  on it.
- **Tidy works the same at any zoom.** Pressing it twice now says "Already laid out in order" instead of moving the
  steps again, because it measures each step's own height, which zoom does not change.
- **Relate can bring one column per shift** when a saved workflow lists several shifts: the first step of
  [185](docs/experiments/185-one-step-for-every-lag.md). Every row is kept, and the empty rows are counted for each
  shift. The Inspector does not offer the list yet; it comes with Relate's standard dialog.

## 0.45.0 — 2026-11-07

- **Every word is readable.** Nothing on screen is smaller than 14 px, body text is 16 px, and the faint grey text
  passes WCAG's 4.5:1 contrast in both light and dark themes. Measured on the Workflow tab, the Notes tab and the note
  dialog: words below 14 px went from 96–99% to none, and words below the contrast bar from a third or more to none.
- **A step's inputs can be connected from the Inspector.** Under **Inputs**, each input, named in plain words, lists
  "Not connected" and every step that can feed it; choosing one connects it, as dragging to the port does. Dragging to
  a small port is hard to see and, on a large workflow zoomed out, nearly impossible. Mean center, Point comparison,
  Privacy and Catchments now use this list instead of their own; nine widgets still have their own and move when the
  Inspector is standardised.
- **Tidy stacks steps by their height**, so taller steps no longer land on top of each other.
- The tab bar scrolls sideways on a narrow screen instead of widening the page.

## 0.44.0 — 2026-11-07

- **A lab evaluation form, against Nielsen's ten usability heuristics.** Switch on **Lab evaluation** in Help; an
  **Evaluate** button then appears in the header and in the note dialog. Record what happens and what it costs under
  each heuristic, and **Save to laptop** as Markdown to read and JSON to merge. Hidden unless switched on, so nobody
  using Fieldwork for analysis meets it. Experiment 184.

## 0.43.0 — 2026-11-07

- **A note answers two questions about its sources instead of naming one form: whose words, and whose argument.**
  *Whose words*: the source's exact words, close to the source's wording, my words: one passage, my words: the main
  points, or not sure. *Whose argument*: what the works say, or what I make of them. Both optional. A note saved with
  0.42.0's form keeps it, read into *whose words*. Studies of source use keep these two apart, and none separates a
  précis from a summary (experiment 183).
- **The Add note dialog shows questions to ask of the part being written** — four each for Introduction, Methods,
  Results and Discussion — and follows the note if it moves. Hide them once they are habit; this device remembers.
- **The Notes page of the manual has an entry for each part of the write-up**: what it is for, how to build it, and
  its questions, from the CDC/TEPHINET scientific writing course built for FETP residents, in our own words. The
  examples now show each answer, including a sentence close to its source's wording beside a true paraphrase.
- **The Brazil notes answer both questions**, and the four that reported and argued at once are now two linked notes
  each: fifteen notes.
- Experiment 183 closes: the questions are in each part's manual entry, and a test holds them to the dialog's wording.

## 0.42.0 — 2026-11-07

- **A note that cites literature can say its form: précis, paraphrase or summary.** Chosen in the Add note dialog,
  which says what each means, with an **Examples** button opening a new Notes page of the manual: a few examples of
  each, drawn from the works the Brazil notes cite and from Snow, what each form commits the writer to (how much of the
  source to have read, what to watch for), and what to do with a note that is none of the three. The form shows as a
  label on the note. The form is optional: it opens on unstated, and **not sure** says the writer looked and could not
  tell. A form outside these is kept as written.
- **Experiment 183** asks whether the forms help people write better, and closes on an evidence search about improving
  academic writing.
- **The manual has its first page for part of the application rather than a widget**: the Notes tab.
- **The Brazil example's write-up carries what the mosquito meets.** Twelve notes on the Notes tab, seven of them
  citing thirteen open works, set the lag models' exposure — MODIS daytime land-surface temperature — against what
  *Aedes aegypti* meets: air at indoor resting sites, water in containers, and stored water in droughts. A review
  of the literature behind them is in the example repository. Nothing in the models changed. Experiment 182.
- **The Brazil example's provenance names where `tempmed` comes from**: InfoDengue's alertcity API, from airport
  stations in its Rio pilot and ERA5 reanalysis now. When that changed is not stated.

## 0.41.0 — 2026-11-07

- **The Brazil example widens to sixteen years.** A fifth workflow sets weekly cases 2010–2025 beside Terra's land
  surface temperature at five lags and two leads. Each week is compared only with weeks of the same municipality,
  month and year, and the model adjusts for that week's rainfall. Played back live: 1.020 per 1 °C at 8 weeks before
  and 1.021 at 6, and 1.005 for both leads, a quarter of 2024's 1.061. Still not a finding: the intervals allow nothing
  for correlation between weeks. Experiment 182.
- **Regression takes several strata columns together**, one stratum per combination: choose a column, then
  **Together with**. Validation Lab check 37 agrees with statsmodels.
- **Select rows by value can leave values out**: **Every value except those I tick**.
- **Relate a column can relate a table to itself, shifted**, for rainfall *k* weeks before each week. A second shifted
  date on one table is kept as `_shifted_2`.
- **A satellite search reads every page**, with no 500-item limit, and keeps only the files its reader reads. Sixteen
  years of MODIS over Rio de Janeiro is 2,891 items in 19 s, 5.9 MB stored instead of about 14 MB.
- **A run computes steps that do not lead to an output yet**, when their inputs are connected, so the next step can be
  set up against their table. One that fails is named in its Inspector, and the run goes on.
- Fixed, each found building the sixteen-year workflow:
  - **A large search could not be saved.** Every later edit was lost; searches are now kept in the browser's larger
    store.
  - **Join decisions over many rows were lost on save.** Each was stored with every unmatched key written out; now a
    short digest, and a decision saved the old way still holds.
  - **Relate offered the second table's value column only after a run**; now from the table's declaration.
- Validation: Chromium locally; WebKit in CI.

## 0.40.0 — 2026-11-06

- **Satellite files are read several at once**, and a run of them is about three times faster in a browser: three
  months of MODIS over Rio de Janeiro's 92 municipalities in 23 s instead of 70, ten NYC Sentinel-5P overpasses in 22 s
  instead of 47. The table is the same either way. Experiment 182.
- **A file that fails is tried again**, three times; one that still fails stops the run and is named. On 2026-11-06
  one *Failed to fetch* among 180 files stopped a live run without saying which.
- **A MODIS file is read once per session**, as Sentinel-5P files already were, so the Brazil lag workflow no longer
  reads every file twice.
- Measured and not built: decoding in a worker pool. It blocked the page for a tenth of a second over a whole run
  either way.
- Validation: Chromium locally; WebKit in CI.

## 0.39.1 — 2026-11-06

- **The Brazil lag models get a falsification test, and it fails.** Two lead models, the temperature 2 and 4 weeks
  *after* each case week, sit on the lag-response plot at −2 and −4. Played back live: 1.061 per 1 °C two weeks after,
  against 1.063 eight weeks before. Later weather cannot cause earlier cases, so these models trace one year's season,
  not an effect of temperature. Experiment 180.
- Validation: Chromium locally; WebKit in CI.

## 0.39.0 — 2026-11-06

- **Chart draws an estimate with its interval**: a point with a whisker at each category, from any table that
  declares an interval, as every Regression table now does. For a ratio, a log scale and a dashed line at 1 are on
  by default, and the figure says why. Both can be turned off in the Inspector. A category declared a number is placed
  as one. Experiment 181.
- **Append rows stacks any number of tables in one step**: **＋ Add a table** adds a port, each table gets its own
  label, and the labels can be declared numbers in a unit. A label declared a number that is not one is a data
  quality finding; the rows are kept. Workflows saved with two tables load unchanged.
- **The Brazil dengue example's fourth workflow ends in a lag-response plot**: the five lag models' rate ratios per
  °C with their 95% intervals, from one Append rows, one Select rows and one Chart. Validation Lab check 36 rebuilds
  it with pandas and agrees on every number, in CPython and Pyodide.
- Fixed in Chart's Inspector: *Chart enhancement* read *Classic bars* while Vega-Lite drew the chart, unless Vega-Lite
  had been chosen explicitly.
- Validation: Chromium locally; WebKit in CI.

## 0.38.1 — 2026-11-06

- **A run that reads satellite files shows it is working.** While Sample satellite files at points or over areas
  reads its files, a panel at the foot of the page names the step, turns, and counts the files read, *Reading
  satellite files: 40 of 92*, with a bar; the Run button turns and the run's state says the same. A year of MODIS
  files over Rio de Janeiro takes about five minutes, and the NO₂ month over New York City a few; until now the page
  showed only *Running…*. Motion stops where the device asks for reduced motion; the count stays.
- Validation: Chromium locally; WebKit in CI.

## 0.38.0 — 2026-11-06

- **Relate a column matches a date to the period that contains it, and can shift it first.** Weekly cases against a
  satellite's 8-day periods, and a lag of *k* weeks as a shift of 7*k* days fewer. The shifted date and the matched
  period stay on every row, and a date inside two periods is refused by name.
- **The Brazil dengue example has a fourth workflow**, *Did warmer ground weeks earlier go with more cases?*: Terra's
  land surface temperature 0, 2, 4, 6 and 8 weeks before each week, beside the week's cases, in five Poisson models
  with municipality and month. Played back live. The rate ratios run from 0.963 per °C at 4 weeks to 1.063 at 8; the
  example says plainly why they are a demonstration, not an effect.
- Fixed in Relate's Inspector: choosing the first of the period columns lost the choice and closed the section.
- Validation: Chromium locally; WebKit in CI.

## 0.37.0 — 2026-11-06

- **Buffer study area is retired.** Its two uses are met elsewhere. To fetch data beyond an area, Street network and
  Polygon layer each have their own margin; the Snow isochrone example now sets the network's to 750 m, the same
  extent as before. For a cross-border study, the study area itself straddles the border, drawn or picked on both
  sides. A workflow saved with the widget is refused on loading, as for every retired widget; nobody outside the
  project builds on it.
- **A flaky test made steady:** "Reset example only where there is a published example" pressed New project before
  the page had finished checking itself, and failed twice in CI on slow runners. It now waits.
- Validation: Chromium locally; WebKit in CI.

## 0.36.0 — 2026-11-06

- **Land surface temperature in °C by default, or °F or K.** MODIS states kelvin; Sample satellite files at points or
  over areas now reports degrees Celsius unless told otherwise, with Fahrenheit and the file's kelvin offered. The
  conversion is exact and stated on the result and in the receipt.
- **Every file is read for its own unit and scale factor.** A MODIS file states both in its tags; each one opened is
  checked, a file stating another unit or scale stops the run with its name, and the result says whether every file
  stated them.
- Validation: Chromium locally; WebKit in CI.

## 0.35.0 — 2026-11-06

- **The Brazil dengue example has a satellite workflow**, *How hot was the ground in each municipality?*: MODIS
  land surface temperature over the 92 municipalities for every 8-day period of 2024, from Terra and Aqua. Played back
  live: 180 files read in about 4 minutes in a browser, 8,188 rows, 8,064 with a mean.
- **Sample satellite files at points or over areas takes a study area.** A study area's units, such as municipalities
  picked from geoBoundaries, are read as they are, with no polygon layer in between.
- **Fixed: half the state read as no cell.** Planetary Computer leaves the satellite off some 2024 MODIS items, and
  they were read as a third satellite; the satellite now comes from the product's name where the item does not say.
- **Fixed: the study area dialog's sections remembered being open**, so the click that opens one closed it.
- Validation: Chromium locally; WebKit in CI.

## 0.34.1 — 2026-11-06

- **A step's table is one button away even before a run.** After opening a project or reloading, a table step's
  Inspector said only that the workflow had not run, which read as "no table view". It now offers **Run and view
  this table**. A table read from a URL still has to be fetched first, in Tabular data.
- **Select rows by value greys the rows it dropped**, in its Before view, and says how many and by what rule.
- **Checkboxes sit beside their labels** everywhere in the Inspector. In Total within groups each box had a line of
  its own above its column name.
- Validation: Chromium locally; WebKit in CI.

## 0.34.0 — 2026-11-06

- **Sample satellite files at points or over areas.** The sampler takes a polygon layer as well as points, and reads
  MODIS land surface temperature (8-day, 1 km, on Planetary Computer) over each area: the cells whose centre is in
  it, one row per area per period per satellite, Terra and Aqua kept apart. Every row says how many cells the mean
  rests on and how many days were clear. The quality rule is the practitioner's choice, since MODIS recommends none:
  produced, with an average error of 2 K or less. Sentinel-5P is still read at points. Experiment 180.
- **Find satellite products offers MODIS land surface temperature** under Surface heat, with its licence (NASA
  Earthdata: open, CC0 unless marked) and citation read at source.
- Validation: Chromium locally; WebKit in CI. Read in Node over the 92 Rio de Janeiro municipalities from real files;
  no lab check of the area reading yet.

## 0.33.0 — 2026-11-06

- **New worked example: dengue in Rio de Janeiro state, Brazil, 2024.** Two workflows from an empty canvas: the
  state's weekly epidemic curve, and notified cases per 100,000 residents for each of the 92 municipalities on a map,
  from 54.6 in Nilópolis to 15,081 in Resende. The data are an extract of DATASET_MULTIMODAL_V8 (Zenodo, CC BY 4.0),
  committed to the example with its findings: epidemiological week 1 missing, the last week doubled, and satellite
  columns that are monthly values repeated weekly. It has a Manual tab. Experiment 180.
- **Rate with a denominator and Cases by period can be added from the library.** A new node starts with its fields
  empty, and saving refused that, so neither node was ever created. Known since October and recorded in TODO; fixed
  now because the Brazil example needed Rate. An empty field is now refused when the workflow runs, with the same
  message. One widget remains unaddable: Compare level to elevation.
- **A study area takes units whose rings meet at a single point**, such as an island touching another at a corner,
  as the OGC rule allows. Quatis and Rio de Janeiro city were refused.
- **Reading a file as wide no longer blocks on repeated subjects.** The dialog still suggests reading it as long;
  read as wide, every row is kept and each repeat is reported in Data quality.
- **Join a table to the study area counts units, not parts.** A municipality's islands were each reported as a
  repeated name.
- Validation: Chromium locally; WebKit in CI.

## 0.32.0 — 2026-11-06

- **Sample satellite files at points reads the nearest pixel across the file's chunks** (widget 0.2.1). A point near
  the edge of one of a file's compressed chunks was read from the nearest centre in that chunk, though a centre across
  the edge could be nearer; and a point between two chunks of wide pixels could be missed. Found by the validation
  lab's new check 35, which re-reads a Sentinel-5P-shaped file with h5py and recomputes every pixel and row: it now
  agrees, in CPython and in the browser kernel. Only points within about half a pixel of a chunk edge were affected; a
  real orbit file has chunk edges every 225 ground pixels and every 2,086 scanlines.
- **Products carry their citations.** Find satellite products and Search a satellite catalog show the dataset
  citation the producer asks for, with its DOI as a link. The three Sentinel-5P products on Planetary Computer carry
  ESA's Version 02 citations, for the processor 2.x files served for June 2023, read on 6 November. The receipt states
  the citation read, or that nobody has read one.
- **The Relate dialog's preview marks the join's columns**, Matched on and Brought across, as View this table does.
  The preview was also squeezed to a single line in a short dialog; it now shows its rows.
- Validation: Chromium locally; WebKit in CI. Lab check 35 in CPython 3.13 and in Pyodide.

## 0.31.0 — 2026-11-05

- **Relate a column from another table matches on several columns together.** Choose **And also matched on** for a
  second key, such as `date` beside `site`: a row relates only where every key agrees. It can also bring the second
  table's **value column** across, such as a monitor's reading in ppb.
- **Joins show their keys.** In **View this table**, each key column is tinted and labelled **Matched on** in every
  *Before* and in *After*, and the column added is labelled **Brought across**.
- **Sample satellite files at points names its id column after the points' source**, `site` for the NYC monitors, so
  the result relates straight back to the ground readings.
- **NYC example, sixth workflow: _Did the satellite see the city's NO₂?_** Sentinel-5P NO₂ at the four NO₂ monitors,
  1 to 14 June 2023, beside the monitors' own readings, matched on monitor and day. Days where Queens College 2 has
  no ground reading are kept and named. Played back live in Chromium on 5 November: 19 files read, 76 rows, 22 values
  passing the quality rule, 47 below it, 7 days without an overpass (experiment 179).
- Validation: Chromium locally; WebKit in CI.

## 0.30.0 — 2026-11-05

- **A whole country can be a study area.** Uganda at ADM0 drew nothing: its outline, 1.4 MB, was refused against a
  1 MB limit sized for the browser's smallest store, in a line easy to miss, with advice to choose a coarser level
  that ADM0 does not have. An outline taken from geoBoundaries or a file is now kept in the larger store (IndexedDB),
  as tables and point layers are, and the limit is gone. Shapes drawn by hand are kept as before.
- **Every part of a unit is kept.** A country or district with islands used to keep only its largest part: Uganda
  lost 47, the islands of Lake Victoria among them.
- **A refused outline says so where you are looking**, in the dialog's status line.
- Validation: Chromium locally; WebKit in CI. The real Uganda ADM0 applies with all 48 parts.

## 0.29.1 — 2026-11-05

- **Sample satellite files at points works on Pages.** In 0.29.0 the file reader it loads, h5wasm, was not published:
  files left out of the offline download were also left out of the site. The MapLibre worker behind the vector
  basemaps was missing the same way, which may have stopped those basemaps drawing on Pages. Both are now published
  and still not downloaded for offline use.
- Validation: Chromium locally; WebKit in CI.

## 0.29.0 — 2026-11-05

- **Sample satellite files at points** (new, under Spatial operations): connect your points and the files **Search a
  satellite catalog** found, and run. At each point, for every overpass, it reads the value of the pixel whose centre
  is nearest, fetching only the parts of each file it needs, in the browser. The result is a long table: the value
  where it passed the product's quality rule, the value as read, `qa_value`, and where there is no usable value, which
  gap it is: **no overpass**, **no retrieval**, or **below quality threshold**. Nothing is filled. Sentinel-5P NO₂ on
  Planetary Computer is the first product it reads, with no account. Read live at two NYC ozone monitors on 7 June
  2023: both pixels had `qa_value` 0.74, just below the 0.75 threshold.
- **Quality rule:** the NO₂ product's readme says above 0.75 and its manual's table at or above; the Inspector lets you
  choose, and the result says which. The comparison is made on the stored integer, so a stored 75 is not wrongly
  failed as 0.74999998.
- **One overpass, two items:** Search a satellite catalog now shows each item's processing stream (near real time or
  offline) and orbit, and keeps only the offline item of an orbit by default, so no reading is counted twice. 0.28.0
  called the two NO₂ items over NYC on 7 June 2023 two overpasses; they are one.
- **Cost:** an offline orbit file is about 600 MB, stored in large compressed chunks; expect about 10–15 MB per
  overpass, much the same for 2 points as for 50. From the machine this was built on, the browser read that storage at
  35–55 seconds per MB: the live read took 8.3 minutes.
- New dependency: h5wasm 0.10.3 (NIST), loaded only when a file is read and not stored for offline use.
- Validation: Chromium locally; WebKit in CI. The live read runs only on request (`SATELLITE_LIVE=1`); the gate reads a
  Sentinel-5P-shaped file made on the spot, by range, through the same worker.

## 0.28.1 — 2026-11-05

- **Search a satellite catalog** no longer needs a Study area. With none connected, type the area's west, south, east
  and north edges in the dialog, as in JLT's STAC Browser; the dialog says what is wrong with an edge until the four
  make an extent, and draws the area before you search. A connected Study area still fills it. In 0.28.0 the Search
  button stayed grey without one and the dialog gave no way forward. The run records where the area came from.
- Validation: Chromium locally; WebKit in CI.

## 0.28.0 — 2026-11-05

- **Find satellite products** (new, under Sources): type a research topic or a measurement, such as NO₂, aerosols or
  ozone, and see which satellites and products measure it. Each product says what it measures and its unit, whether it
  needs sign-in, its licence as read from the licence itself, whether a browser can read it, and its quality rule.
  Products needing no sign-in come first. Adapted from JLT's EO Satellite Guide, in Fieldwork's dialog style.
  Experiment 179.
- **Search a satellite catalog** (new, under Sources): connect the chosen product and the study area, choose the dates,
  and search the product's catalog. Three columns, after JLT's STAC Browser: the search, the study area with each
  overpass's footprint, and each file with its sign-in, licence as read, whether a browser can read it and the
  attribution to use. Reads catalog records only; it says that completeness is not known until a file is read.
  Checked against Planetary Computer from a browser: 2 Sentinel-5P NO₂ items over New York City on 7 June 2023.
  _Corrected in 0.29.0: they are one overpass, orbit 29273, in two processing streams, not two overpasses._
- Custom studs and known naming violations are no longer capped by count: each states its own reason.
- Validation: Chromium locally; WebKit in CI.

## 0.27.1 — 2026-11-05

- **In the write-up, under** now sits just below **Results tab name** in a Map, Table or Chart's Inspector. In 0.26.0
  it was the last field, below Definition and Connections, and was easy to miss.

## 0.27.0 — 2026-11-05

- **Point data reads points from a table in the workflow**, as geopandas' `points_from_xy` does. Connect a table and
  name its **x (longitude)** and **y (latitude)** columns. A row whose coordinates are empty, not numbers or out of
  range is kept with no position and counted, never a refusal of the table, and the result says how many rows share a
  position. Read as CRS84. Point data 0.4.0; lab check 34 agrees with geopandas. Experiment 178.
- **The NYC example has a study-area map for the Introduction**: the five boroughs from geoBoundaries and the six
  ozone monitors, read from the authors' site-day file. Its manual builds it from an empty canvas.
- **A boundary unit whose name repeats is listed with where it lies.** US counties carry no state, and five are
  called Richmond; they now read *Richmond · 40.58° N, 74.17° W* and so on. Study area 0.5.1.
- Fixed: ticking several columns at once in Total within groups kept only the first (0.2.1). The Country field's
  label no longer reads as the whole country list.
- A widget under Sources may now read data already in the workflow when it can run without it; only one that
  requires it is treated as a transform. The naming ledger no longer caps how many known exceptions may stand: each
  is held to its own reason and what would clear it.
- Validation: Chromium locally; WebKit in CI.

## 0.26.0 — 2026-11-05

- **Choose where a figure goes in the write-up.** Every Map, Table and Chart output has **In the write-up, under**:
  Introduction, Methods, Results or Discussion. Results is the default. A study-area map can now open the
  Introduction. The receipt states the section and whether it was chosen, and a validation rule checks that the note
  describing the figure is filed in the same section. Map 0.20.0, Table 0.7.0, Chart 0.10.0. Experiment 177.
- Validation: Chromium locally; WebKit in CI.

## 0.25.0 — 2026-11-05

- **The Two-by-two table reports a rate ratio.** Under **The outcome column holds**, choose **events and units at
  risk**, then name the value holding the events and the one holding the units at risk (houses, people, person-time).
  The figure shows each group's events, units at risk and rate in the letters $a_1$, $n_1$, $a_0$, $n_0$; the
  Methods note writes the ratio and its log-normal interval in those letters. Units at risk need not be whole numbers.
  A group with no events keeps its counts and says why there is no ratio. Two-by-two widget 0.7.0.
- **A declared design decides whether a rate ratio may be reported**: under a cohort or an ecological design, as for a
  Poisson regression, and the step stops under any other, naming the reason. With no design connected it keeps its
  name.
- South London's *Deaths per house, by water company* reads Table IX through the two-by-two: **8.40 (6.84 to 10.32)**,
  the same to the last digit. A table of deaths per 10,000 houses sits beside it. Lab check 27 compared the new path
  with statsmodels on all four of its comparisons and it agrees.

### Retired

- **Rate ratio with an interval**, into the Two-by-two table. It could read only a Rate step's result, South London
  was its one user, and its arithmetic was already shared with the two-by-two. Retired outright, with no deprecation
  period, because nobody outside this project uses it. **A workflow saved with one refuses to open**, naming it:
  rebuild the step as a two-by-two on the table the Rate read. Experiment 161, step 6.

### Validation limits

- Chromium locally; WebKit runs in CI.

## 0.24.1 — 2026-11-05

- **A slow download is no longer stopped after two minutes.** Fetching a table from where it is published now shows how
  much has arrived ("1.5 of 8.8 MB") and offers Stop; there is no time limit. Found when Zenodo answered at once and
  then sent the NYC package at about 5 KB/s, and the old limit called a working download a failure.
- Regression is checked by the validation lab (check 33) against statsmodels on the Salmonella and NYC models: it
  agrees to 1e-10 or better. The check found one defect, recorded in TODO: a separated term (no finite estimate) is
  shown as an ordinary odds ratio, without a warning.

## 0.24.0 — 2026-11-04

- **Regression follows the declared study design**, read from the same declaration the Two-by-two table reads. A rate
  ratio is reported under a cohort or ecological design; an odds ratio wherever the two-by-two allows one, named the
  prevalence odds ratio under a cross-sectional design. A Poisson model under a case-control or cross-sectional design,
  or any model under a case series, stops and says why. With no design connected, nothing changes. Experiment 176.
- **A regression appears in the N3 & evidence view**: the fit as `fw:RegressionModel`, each coefficient as an
  `fw:EpiEstimate` naming its term, interval method and level. Two SHACL shapes check it, and the two-by-two's
  estimates are now checked by the same shape. Regression widget 0.2.0.
- Fixed in the ontology: the interval properties were declared for rate ratios only, so under inference every
  two-by-two estimate would have been read as a rate ratio.
- Not yet: the Rate ratio widget does not follow the same licences, and no worked example declares a design for a
  regression.

## 0.23.0 — 2026-11-04

- **A table holds up to 250,000 rows, from a file of up to 40 MB** (was 20,000 rows and 5 MB). The number was measured,
  not chosen: at 250,000 rows importing, saving, reopening, selecting a date range, panel charts, regression and export
  all completed in Chromium; at 500,000 the page stopped answering, and at 1,000,000 the tab crashed. A panel chart of
  250,000 points takes about 30 seconds to draw. Experiment 175.
- Regression fits up to 250,000 rows; panel charts draw up to 250,000 points.
- The regression kernel downloads at 37 KB, down from 117 KB.
- Limits: measured on one Mac in Chromium, with tables of seven columns. Not measured in WebKit or on a smaller machine.

## 0.22.0 — 2026-11-04

- **A table's rows are kept in the dataset store, not in the saved workflow.** Every other input already kept its data
  once in IndexedDB with the workflow holding a reference; Table input kept its rows inline, so a large table (NYC's
  92-column wide read) could not be saved within the browser's local storage. Rows are now stored under a content key
  (`table-<rows>-<hash>`) set on every save. Exports are unchanged and still carry the rows. This removes what held the
  20,000-row cap; the cap itself is not changed yet — experiment 175 measures where the application stops coping.

## 0.21.0 — 2026-11-04

- **Connect a dictionary to the data, explicitly.** After choosing which dictionary column holds what, a Connect step
  lists every column of the table with the dictionary variable that describes it: the same name connected, a near one
  (`sex*` for `sex`, `galiamelo*` for `galiamelo_apr2`) suggested and marked for you to check, the rest "not in the
  dictionary". Proposals and the check follow your connections.
- **Make a dictionary when the source has none.** Accepted descriptions become your dictionary for that source, kept on
  this device and offered to any other table reading the same file; **Download as a data dictionary (CSV)** to share it.
- Validation: Chromium locally; WebKit in CI.

## 0.20.0 — 2026-11-04

- **What the columns mean.** **Describe columns…** on a table opens a dialog for each column's label, unit and
  description. A data dictionary (CSV, Excel or Stata, from disk or from the same fetched zip) proposes them; you
  accept. The dictionary is matched mechanically against the table, missing counts included. A Stata file's variable
  labels are proposed at import. Table input 0.6.0, experiment 172.
- **Undescribed columns are a data quality finding**, in Data quality, on the node and in the write-up's Methods; never
  a refusal. A dictionary that disagrees with the table is one too.
- A regression's terms and a chart's panels show each column's meaning beside its name.
- Validation: Chromium locally; WebKit in CI.

## 0.19.1 — 2026-11-04

- **A fetched table already on this device fills itself.** Opening or running a workflow reads its table from the copy
  the device keeps, with no download and nothing to press; only a file not yet on the device needs **Fetch the
  table**. On the published 0.19.0, each NYC workflow stopped with "Select the node and choose Fetch the table".
- The table says where its rows came from, read from this device or downloaded, and the message stays.
- Notes' **Run workflows** counts only workflows that ran, and names any that still need their table fetched.
- Validation: Chromium locally; WebKit in CI.

## 0.19.0 — 2026-11-04

- **Regression**, a new widget: logistic regression (odds ratios) and Poisson regression (rate ratios) of an outcome
  on an exposure, adjusted for numeric, categorical and spline terms, fitted in Fieldwork's own kernel. Poisson takes
  strata as fixed effects and an offset. Intervals are likelihood-ratio (the default), Wald, scaled for
  overdispersion, or HAC for counts correlated from day to day. A declared case-control design allows logistic only.
  Experiment 167.
- **Published results reproduced on the authors' data.** NYC: ozone 1.061 (1.035–1.088) per 10 ppb, the coefficient
  and HAC standard error equal to the authors' archived R result to 12 significant figures. Salmonella: Galia melon
  adjusted for age group and sex, 96.4 (15.4–2067), published 96 (15–2100); against panel controls 18.4 (4.6–101),
  published 18 (4.6–100).
- NYC and Salmonella each gain a fourth workflow that fits these models; NYC's manual covers its.
- The detached manual opens over the canvas beside the library, lower than before, instead of over the Inspector whose
  fields it tells you to fill.
- Select rows offers its date range even before a fetched table's rows are on the device. Opened from the catalogue,
  NYC's 1 to 14 June showed as an empty text box until Fetch the table was pressed.
- Validation: Chromium locally; WebKit in CI. No independent laboratory check yet.

## 0.18.0 — 2026-11-04

- **A fetched file is downloaded once per device**, not once per workflow. It is kept by its digest and read from the
  device, checked again, whenever a table in any project names the same file. The table dialog reads the device's copy
  of a URL fetched before and offers **Fetch again from the source**. Experiment 170.
- A manual can say to reuse a node from another workflow of the project (**From this project**); NYC's second
  workflow now shares the first's table, so nothing is fetched or set up twice. Experiment 173.
- A fetched wide table's source file is kept by digest too, so several workflows on one file do not fill the save.
- **Every value the manual says to type has a Copy button**: names, subjects, titles, labels, units, dates, and URLs
  such as the Zenodo package's. A step inside a dialog names the dialog where its steps begin, so **New project** and
  **Create project** read as one action.
- A fetch that has not finished after two minutes is stopped and says so, instead of showing "Fetching…" forever.
- **Many columns are chosen in a dialog of their own.** A file with more than 12 columns shows a one-line summary and
  **Choose key columns…**, where names can be pasted (the manual's Copy gives them), found, or all unticked. Read long,
  such a file starts with nothing ticked instead of every column but one. Table input 0.5.0.
- **The detached manual stays usable above a dialog.** Opening Import tabular data (or any modal) no longer blurs it:
  it stays where it is, readable, scrollable and copyable, so the file to choose in a zip can be read off it.
- Validation: Chromium locally; WebKit in CI.

## 0.17.0 — 2026-11-04

- **The manual detaches** into a panel that stays beside you while you build in a project of your own: New project,
  the library and the canvas all stay in reach. Click a step when it is done; progress is kept on this device, the
  panel survives a reload, and **Close** ends it. Detach again from the Manual tab to resume at the first step not
  done. Experiment 173.
- Validation: Chromium locally; WebKit in CI.

## 0.16.0 — 2026-11-04

- **A chart can draw one panel per variable** on a shared axis, each with its own scale: visits, ozone, PM2.5 and
  temperature moving together through time. Bars or a line per panel, a period shaded across them all, a missing value
  as a gap. No second y axis. Experiment 174.
- NYC gains a third workflow, *Did visits move with the air?*, May to July 2023 with the smoke days shaded, and its
  manual covers it.
- A wide table's source file is kept on the device by digest, like other node data, instead of inside the saved
  workflow, which a 92-column file did not fit. An export still carries no rows of a fetched table.
- Validation: Chromium locally; WebKit in CI.

## 0.15.0 — 2026-11-04

- **A worked example can carry a manual**, shown in a new **Manual** tab: how to build each of its workflows by hand,
  step by step, the open one first. NYC is the first. The example's from-scratch test performs the same file, so a
  step that stops matching the screen fails a test. Experiment 173.
- Each step that adds a widget says to find it by name in the library's search.
- CI checks out the London example and keeps failed tests' screenshots and traces.
- Validation: Chromium locally; WebKit in CI.

## 0.14.0 — 2026-11-03

- **Select rows by value keeps a range**: From and To, for a column of dates or numbers. A long list of values can be searched. Experiment 171.
- A fifth worked example: ozone and child asthma emergency visits, New York City, 2016 to 2025. Its counts are fetched from the authors' Zenodo package when it is opened, and never held in the example.
- A table read from CSV can have up to 20,000 rows, as tables allow; points stay at 2,000.
- **A table can be fetched from a URL**, a zip included. The project keeps where it came from instead of the rows, so an export does not republish it, and another device fetches the same file by digest. Experiment 170.
- **Tables can be imported from Stata files**, Stata 8 onward, as well as CSV. Dates read as dates and missing values are empty; value labels are not applied. Experiment 169.
- **An interactive map plays through frames.** A join given **Frames from** keeps one value per frame on every part, such as a year; the interactive map then plays through them with one key for every frame, only while every part is in view. Nigeria's third workflow plays 20 birth cohorts. Experiment 168.
- An interactive map can import an OpenStreetMap extract as PMTiles, once, for the area it draws. The workflow keeps the spec and the device keeps the tiles.
- A polygon layer's key, figure and interactive map now agree on what shades it. A ruleset's classes are keyed by name, and the interactive map draws them.
- Two-by-two: Exposures to compare offers only columns holding the two chosen groups, and reads down one left edge.
- Nigeria carries an illustrative 20-year report and a fifth workflow. All three worked examples are laid out with Tidy.
- **Append rows**, a new widget: stack a second table's rows under the first, as pandas concat does, with the source of each row and a new primary key as options. Experiment 166.
- A fourth worked example: *Salmonella* Braenderup and melons, Germany 2021, a case-control study with two control groups.
- The two-by-two machines its formulas with several exposures too, once and in symbols.
- An interactive map can label polygon parts by any attribute they carry.
- A note cites works from a Citations tab. The note is marked with numbers and References is assembled from what is cited; References no longer holds notes of its own.
- Deduplicate records takes rows of one table: rows repeating the primary key are compared, exact copies merge, and a person decides the rest and which row stays.
- Import tiles works for a map of a study area or points, not only polygons.
- A table is no longer refused for a quality problem. Primary and secondary keys can be declared, and findings flag the node, fill a Findings tab in Data quality and reach the write-up.
- CI: `verify` is pinned to `ubuntu-24.04`, checks out all three examples, and a missing sibling now skips its test instead of failing it.
- **A map says its basemap is context.** Over an online basemap, Methods gains a machined limitation: the
  tiles can change or go, and no value depends on them.
- Validation is as gated per commit: Chromium and WebKit browser tests and the unit suite. The adjusted estimates the new examples publish are not reproduced; the app computes crude measures.

## 0.13.0 — 2026-11-02

Covers the work of 2026-10-30.

- **Fast editing no longer fails in Safari.** Every edit rewrote the page address, and Safari refuses more
  than 100 of those in ten seconds, which stopped the edit. It now writes only when the address changes.


- **Polygons are records.** *Join a table* takes a polygon layer and keeps what each polygon holds, and
  *Apply ruleset* reads polygons and returns classes a map can shade. Nigeria's 774 LGAs now reach a map,
  and a rule over two values, from an empty canvas. A table can hold 20,000 rows and a layer 1,000,000
  vertices, up from 2,000 and 200,000.

- **Study design asks how the exposures were chosen,** and the checklist reports how many were compared
  rather than flagging each as different from the declared groups.

- **A two-by-two compares several exposures on one node.** With a line list, tick the exposures and get
  one table with a row each, unranked, with rows left out counted and the number of comparisons
  stated. Under a declared case-control design it shows odds and no attack rates. Oswego's menu goes from 43 nodes to 3.

- **A two-by-two reads a line list directly.** Tick *Each row is one subject* and connect the list, with
  no count first. Measures now compute in FW's own Rust kernel. Reported values are unchanged.

- **A line list can be counted.** *Total within groups* gains **Count rows**, which says how many
  rows agree without reading their value, so a person-level line list reaches a two-by-two. It counts
  rows, not people: import one value column.

- **Every table widget shows its table, before and after.** **View this table** now sits at the top
  of the Inspector rather than below *Remove node*. It opens on the step's output, with a toggle to
  the table that came in, so a chain can be read one change at a time. A step with two inputs names
  each. If settings have changed since the run, the viewer says it shows the last run.

- **Study design asks what the selected design needs, and reads the workflow against it.** Selecting
  a design now shows its questions, and each answer writes a sentence into Methods. A checklist
  separates what Fieldwork read from the canvas from what you declared. Surveillance is no longer a
  design: it is a source, and a saved surveillance declaration is removed by migration.

- **A two-by-two with no design no longer claims one.** With no *Study design* connected it still
  computes every measure, now named by its arithmetic: ratio of row proportions, cross-product
  ratio, difference of row proportions. A line says so, and the receipt records it. Saved workflows
  run unchanged and give the same numbers, under the new names until a design is connected.

- **The epidemiology widgets write their own equations.** Rate, Rate ratio and Two-by-two now
  machine a note into **Methods** on the Notes tab every time they run, carrying each computation
  twice: once as the formula, once with this run's numbers substituted into it. Snow's two-by-two
  reads `OR = (844 × 19,115) / (166,810 × 18) = 5.37` as typeset mathematics, which is a line a
  reader can check with a calculator — the symbolic form alone would only restate a textbook. The
  claim that this is possible was written down on 2026-10-26 and the renderer that draws it was
  built on 2026-10-30; until now nothing had ever constructed one.
- **The two-by-two is written in a, b, c and d.** The four letters every textbook formula uses, and
  the ones an FETP trainee is taught, with what each one counts. The code has used them internally
  since it was written and showed them nowhere.
- **Each interval method is cited, or the note says no source has been read for it.** Katz 1978 for
  the risk ratio's interval and Woolf 1955 for the odds ratio's, both with DOIs and both looked up
  rather than written from memory. The unpooled Wald risk difference and the rate ratio's
  log-normal interval have **no** primary source and the note says so, because the construction is
  standard and the implementations consulted attribute it to nobody. A plausible-looking reference
  is worse than none: it is the point a reader stops checking.
- **A rate cites nothing, and says why.** There is no interval, so there is no estimator — the
  division is arithmetic and the multiplier is a scale. A reference list that was empty for an
  unstated reason would read as an oversight.

**What this does not do, stated because a typeset formula invites the assumption.** The equations
were read off each widget's own implementation, so they say what this application computes. That
the code matches what Katz and Woolf published is a different question, and the computations audit
that would answer it is recorded in `TODO.md` and does not exist. Nor does anything here check
whether a measure is estimable under the study design it was computed for: a case-control table is
still offered a risk ratio, and this change renders that formula beautifully.

- **Tables, maps and charts state their own shape in the write-up.** The three things a Results
  section is mostly made of could draw a figure, record a receipt for it, and put no words at all
  into the write-up. Each now machines a note into Results: a table names its columns as it spells
  them and reports empty cells as unknown rather than zero; a map lists its layers bottom to top
  with their feature counts, including any layer connected and not drawn; a chart carries the line
  it already stated — which had existed for weeks and reached no reader — and warns where a bar at
  zero may be a withheld value rather than a measured one.
- **The caption stays yours.** A caption states the subject, the population, the place and the
  period in your words, and none of that can be read off a table. What is machined is the material
  you write it from. An earlier build of this version called its output a caption, which claimed
  the writing rather than doing it.
- **Nothing machined writes its own number.** A figure's number depends on where it sits and on
  the venue being prepared, so it is worked out when a document is rendered rather than written
  into the text — right when machined and wrong the first time somebody moved a card.

See [experiment 151](docs/experiments/151-typesetting-an-equation-a-practitioner-wrote.md),
amendment of 2026-10-30, and [experiment 141](docs/experiments/141-organising-snows-notes.md)'s
amendment of the same date for captions, numbering and cross-references.

## 0.12.0 — In development

_A note on the number: `package.json` read 0.11.0 while the newest section below was 0.10.0, so
0.11.0 shipped without a section and some of the work recorded under 0.10.0 belongs to it. The
earlier sections are left as written rather than reshuffled — the dated record is the point — and
this section covers the work of 2026-10-25 and 26._

- **A map draws every layer you connect.** Wire a study area, a point layer and a polygon layer
  to one map and you got the polygons alone — while the Sources line under the figure, built from
  the connections rather than from what was drawn, named all three. A map's *ports* stopped
  depending on a mode in October; its *value* did not, so whichever port ranked highest built the
  figure and the rest were discarded before anything could draw them. That is the fourth layer lost
  this way — the study area, the facilities and the raster each went the same way and were each
  patched one at a time. The map now composes: the study area it sits on, every point layer beside
  it, and the polygons as a layer among them.
- **Polygon layers that carry names are told apart by colour.** Two reaches of a river were drawn
  in one hard-coded blue on the interactive map, and in two steps of a sequential ramp on the
  static plot — a ramp whose whole design is that a reader can rank the shades, over categories
  that have no rank. Named regions now take the categorical palette, and only while the colours
  stay distinct: past eight regions the colours would repeat, and a repeated colour reads as a
  grouping nobody claimed, so the layer keeps a single neutral fill and the names stay in the layer
  list and the popups. Travel-time bands are a sequence and keep the ordered ramp.
- **The map legend names what is on the map.** A figure drawing two reaches of a river carried a
  key reading *Modeled catchment, Observations, Sites* — none of which it drew. The fallback behind
  that had been left in place twice while the case in front of it was fixed. A layer whose features
  are named is now its own key.
- **Collect polygon layers works with the layers you have.** It offers six slots and required all
  six, so a widget for gathering *several* layers refused two with *"needs its polygons_3 input
  connected"*. One layer is required now; the rest are spare slots.
- **A study area reports its own size correctly.** A boundary of several parts — South London's
  32 sub-districts are one shape with 33 — reported *"0 vertices"* on its node, because the count
  read the first part's rings instead of its points. It reads 2,182 now.
- **A chart draws a table.** A rate, a total within groups, a derived value, a two-by-two — every
  one of them produces a table, and no chart in the application could receive one. Chart declared a
  single port, *Reasoning result*, and its Input mode offered a choice between two things that were
  not what you had; a table of deaths per 1,000 people across 32 sub-districts had nowhere to go.
  As the practitioner put it: *"If the table's role is to represent decisions, it's still a table
  and if it has categories with numeric values, it can be presented as a chart."* A reasoning
  result was always rows with a category column — Table already accepted all four shapes on one
  widget — so the distinction was about where the rows came from, not what they were. Chart now
  declares every port it can draw, requires none of them, and lets whatever you connect decide; the
  mode question is gone. A table says itself which column labels the bars and which number they
  carry, so nothing is asked of you. **And the bars are now the numbers.** A rate was being rounded
  to a whole number before it was drawn, which on those 32 sub-districts turned 16 distinct rates
  into 6 distinct bars — Battersea 5.11, Leather Market 5.30 and Camberwell 5.41 drew one identical
  bar, while Clapham 1.47 and Christchurch 1.56, nine hundredths apart, drew different ones. The
  variation between sub-districts is the whole point of the figure. A chart now states what its
  bars measure and carries the unit the table declared, so the axis reads "per 1,000 people"
  instead of "Recorded count", and the rate table carries that unit at all — it used to show a
  column headed *per 1,000 people* above the line *value in an unstated unit*. Snow's South London
  example draws its 32 sub-districts as bars, from the rate's own chart, so the figure keeps the
  caveat that the 1854 deaths and the 1851 census are three years apart.
- **Polygon layer acquires its own features, and has a panel to do it from.** The widget could
  read a GeoJSON file, and nothing in the application could tell it to: its naming property, its
  layer name and its optional study-area port could be set only by editing a workflow file, so the
  only polygon layers anyone ever saw were the ones a worked example shipped. It now has an
  Inspector with both ways in. The new one reads areas of a kind you choose — water, buildings —
  out of a published OpenStreetMap extract on your own computer, within the connected study area's
  bounds plus a margin you set, and offers a download link for the smallest catalogued extract that
  covers that box. The extract is read where it sits and never copied in; the panel records its
  name and digest, says how many features came back and how many were below your vertex threshold
  or outside the box, and states the ODbL terms and that they are share-alike. The read runs in a
  worker and reports each pass by name — a London-sized extract takes about sixteen seconds, which
  on the main thread is sixteen seconds of a page that answers nothing. Acquired features are kept
  on the device by digest rather than inside the workflow: one water layer measured 788 kB of
  workflow against a 5.2 MB budget written twice per save, which is a sixth of everything you have
  saved for one layer. The margin has no ceiling, because the lock this was built to reach sits
  4,460 m outside the study area's bounds. A layer read for one study area is refused for another
  rather than drawing a map with a hole in it. There is a manual page for it now too.
- **A run whose canvas moved on reports honestly instead of looking like a failure.** Opening a
  worked example from the catalog while another run was still computing threw an error, so a run
  that had finished said *"Workflow stopped"*. The results of that run belong to the workflow that
  produced them and are still discarded, which is the existing rule; what changed is that the run
  now names the workflow it belonged to, says its results were not kept, and says to open it again
  to see them — and the canvas you moved to is no longer marked as already run. Found on the
  deployed instance, 2026-10-27.

- **An Epidemiology group, and a rate ratio with an interval.** Rate with a denominator and Cases
  by period already existed, in a generic Summaries group beside twenty-one spatial operations,
  and an epidemiologist looking at the framework reported seeing no epi widget at all. **Rate
  ratio** divides one group's rate by another's: Snow's water companies give 8.40 with a 95%
  interval of 6.84 to 10.32 per house, and 5.35 (3.35 to 8.53) per person from the declared
  supply groups. Which group goes on top is yours to choose and is shown as a sentence before the
  run, because a ratio and its reciprocal are the same finding and not the same sentence. A group
  with no events is refused rather than given an undefined interval; a count below five is
  reported with a warning naming it. The interval assumes the events are independent, which a
  transmitted disease is not — so it is narrower than the data warrants, and the result says so.

- **A table of values can be put onto the parts of a study area.** **Join a table to the study
  area** matches each row to the boundary part it names, so a table of rates becomes a map of
  rates rather than a map of where people live. Names are compared for equality and never for
  resemblance: ignoring punctuation joins "St. George, Camberwell" to "St. George  Camberwell"
  and still refuses an abbreviation. A part no row names is drawn empty in a neutral shade,
  never in the lowest class.

- **Two-key tables are drawn as a grid.** A table keyed by two columns — supply by outcome,
  district by measure — is shown with categories across the top and down the left rather than as
  a list of triples, with totals as a fourth column and row where the cells are commensurable.
  A table that states its unit is saying its values count the same thing; one that does not gets
  no totals rather than a wrong one. Having two key columns is not enough to earn a grid: an
  assignment table naming each of sixty points and the site it was assigned to has two, and
  pivoting it drew a 480-cell grid holding sixty numbers. A grid is drawn where the cells are
  at least half filled — every row of a tabulation exists for every column by construction,
  and an assignment's rows do not — and a sparser table stays a list. A grid that is full
  enough but has a hole shows the hole, because nothing was said there.

- **Rules written on a step read the port that step has.** Writing your own rules on a step keeps
  the wiring of whatever ruleset it was holding — the step still takes what it took — but the
  run looked for a port named `subjects` whichever port the step actually had. A step forked
  from the projection extract carries `projections` and never had a `subjects` one, so it
  refused with *"Connect records to classify"* about an input that was connected. Found on the
  Manila extract step.

- **A step fed by a table is offered that table's columns** when writing rules on it. The columns
  were read from a point layer's properties alone, so a table-fed step was told to connect the
  records it already had, and no rule could be written on it at all. A row's attributes are its
  key columns plus the declared value field, which is how the run has read them since 2026-10-16.

- **A published ruleset shows its rules, and a copy can be edited.** A pinned step gave its
  title, version, description, settings and obligations and never what it decides, so the step a
  worked example is built around could not be read — and forking it opened a blank editor. The
  rules are now on the panel, drawn from the form every bundled ruleset already carries. Where a
  ruleset reads the columns you connect — it declares the bindings and names the same fact
  generator rules written here use — **a copy carries its rules and bindings over**, because
  that copy is fed identically. The eight with their own fact generators still refuse to be
  copied, and still say why. Resetting the example puts the step back.

- **A 2×2 can show its margins, when somebody vouches for them.** A grid totalled only where the
  table stated a unit, which is a weak proxy for the claim that matters: South London's mortality
  table states *"people or deaths, as the measure says"* — prose denying that its values are
  commensurable, read as granting it — while Snow's Table IX states nothing and, once two
  house-counting measures are selected, has the property and cannot say so. A tabular output can
  now assert it, and the figure says underneath that it was asserted rather than checked. The
  per-measure unit this really wants is recorded, not built.

- **A grid is drawn only where both axes are categories.** Density was not enough: Manila's 194
  facilities all take one gauge, so the assignment is 194 rows against a single column and
  perfectly dense, and drawing it as a grid hid the distance column a reader came for.

- **A value can be derived from two others, and rows can be kept by value.** a classic analysis package separates
  `DEFINE` and `ASSIGN` from `IF`, and only the `IF` was here: rules conclude a *term* about a
  record and never a number computed from other numbers. **Derive a value** computes one, once per
  group of rows sharing the other key columns — a table here is long, so the two numbers combined
  are two rows and not two columns. **Select rows by value** then selects what a figure should show.
  Together they build South London's 2×2 **in** the application: `houses` minus `deaths` gives
  `houses without a death`, and keeping those two drops the total they partition. Each row sums to
  Snow's published house count. The assumption rides on the node's own label — his 1,263 are
  deaths, not houses in which a death occurred — because it changes what the figure means.

- **A wide file can be read as published.** One row per subject and a column per variable is how
  epidemiological data arrives, and the importer refused it outright, calling a repeated key "the
  signature of a wide table". Every long table here had therefore been melted by hand elsewhere,
  including the ones the worked examples ship. The reader is in, and the Inspector for it is not
  yet, so this is not reachable from the application in this release.

- **A result can state its finding in words**, beside the rows it was computed from.

- **The catalog counts the widgets you actually run**, in this browser. A use is a widget
  connected and run in a workflow — a shipped example nobody runs is not one, and neither is a
  node left on a canvas. Nothing is sent anywhere, and the count is this browser's alone: a
  second browser keeps its own.

### Retired

- **Heat alert**, into the rule application. It was a declaration wearing a node type — two
  parameters, no inputs, and a port type whose only consumer had itself been retired. The
  condition is now declared on the step that applies the ruleset, beside that ruleset's
  threshold. **A saved workflow holding one still runs.**

- **Sea-level projection extract**, into Apply ruleset with a new `extract-contract` ruleset.
  None of its five operations was about sea level: four were assertions about a table and one
  derived a column's distinct values. The key columns, units, vocabulary, baseline and the three
  obligatory AR6 citations are declared data now, the citations as DOIs a reader can resolve.
  **A workflow saved before this refuses to open rather than running differently** — a retired
  widget never runs — and the Manila example produces identical numbers through the new path.

### Validation limits

- `rate_ratio` carries an independent check against statsmodels (lab check 27), which found on
  its first run that the 95% quantile had been the textbook 1.9600 rather than 1.959963984540054.
  `join_table_to_area` has no independent check yet.
- The contingency table in South London is prepared outside the application: nothing here joins
  one table to another on a shared column, nor computes a column from other columns.
- A table output can state only its label. A map states a title, a subtitle and a source note; a
  table cannot, so a table that leaves the application carries no source.

## 0.10.0 — In development

- **Epidemiology is a group in the palette.** Rate with a denominator and Cases by period were
  already here, sitting in a generic Summaries group beside twenty-one spatial operations, and an
  epidemiologist looking at the framework reported seeing no epi widget at all. The capability was
  there and the identity was not, which for someone opening this is the same thing. They stay
  standard widgets: a rate with a declared denominator is not an epidemiological quantity, it is
  an ordinary one epidemiology leans on, and where you look for a thing is a different question
  from whose vocabulary it belongs to.

- **A rate ratio, with an interval and the counts behind it.** Two rates side by side are not a
  comparison until something divides them, and a reader comparing them by eye is doing arithmetic
  without an interval. Snow's own figures: houses supplied by Southwark and Vauxhall against
  houses supplied by Lambeth is a rate ratio of 8.40, 95% interval 6.84 to 10.32; the same
  argument with people as the denominator, from the declared water supply of each sub-district, is
  5.35 (3.35 to 8.53), with the intermingled sub-districts sitting between the two at 2.31. They
  differ because the second assigns a whole sub-district to one supply and averages away the
  intermingling within streets. Neither is the right one, which is why the denominator is named on
  every result.

  **A group with no events is refused**, rather than given an undefined interval: Dulwich recorded
  no cholera deaths in those seven weeks, and the usual repair of adding half an event to every
  cell is a choice somebody made and not a fact about Dulwich. **A count below five is reported
  with a warning naming it** — Putney's single death buys an interval spanning more than
  twentyfold, which is not wrong, just carrying almost no information.

  **The ratio is dimensionless.** The rate's multiplier cancels, so changing it to per 100,000
  moves neither the ratio nor its bounds, and there is nowhere on the result to write a unit.

  Which group goes on top is yours to choose and is shown as a sentence before the run, with a
  swap, because a ratio and its reciprocal are the same finding and not the same sentence. The
  groups are offered from the connected table rather than typed. The interval method is stated
  rather than offered: a dropdown holding one option is not a choice.

- **A table of values can be put onto the parts of a study area, and the map shades them.** Join a
  table to the study area matches each row to the boundary part it names and hands on polygons that
  carry the value, so Snow's Table VIII of deaths and population becomes a map of mortality rather
  than a map of where people lived. Names are compared for equality and never for resemblance: the
  match can ignore punctuation and spacing, which is what joins "St. George, Camberwell" to
  "St. George Camberwell", but it will not match an abbreviation to a full name and says so instead
  of guessing. A part no row names is drawn and left empty in a neutral shade, never in the lowest
  class, because an unmatched boundary drawn pale reads as a finding of low incidence. Two parts
  sharing a name both take the value — true of a rate, and not true of a count. Streatham is two
  polygons, so south London draws 33 parts for 32 sub-districts.

- **A shaded figure carries its class breaks and says how it was classed.** The breaks are values
  that occur in the data, so a reader can find the sub-district sitting on one, and the key states
  that quantile classes show rank rather than magnitude. A shade without its breaks says only
  "more" and "less".

- **A figure's key names the marks the figure actually carries.** Every figure this renderer drew
  carried a fixed line — "Squares: sites · dots: observations · polygons: modeled catchments" —
  including figures with no site, no observation and no modeled catchment on them. A key is the
  part of a figure a reader trusts without checking, so one that describes absent marks is worse
  than none. Polygons shaded by a joined value are now called measured rather than modeled.

- **Two study areas can be combined into one study area.** Combined area takes areas as well as
  polygons and yields whichever kind it was given, so two adjacent provinces become one area that
  the street network, the facility sources, the clip and the buffer all accept. Before, its only
  output was a polygons result, which nothing that wants an area will take — the widget that does
  exactly this was one port type away from being usable for it. No new widget: the existing one
  recognises areas. Combining areas keeps each published outline as a part rather than dissolving
  the shared border, because two authorities describe that border differently and welding them
  would assert a line neither drew.

- **Street network says which published extracts cover your study area, and links to them.**
  Finding the right `.osm.pbf` was an errand outside the application; it is now a line in the panel,
  matched geographically and smallest first — Soho is offered Greater London before England, and an
  area straddling a border is told that no single country covers it rather than offered the
  neighbour. The catalogue is Geofabrik's own index taken at build time and dated, because that
  host serves neither its index nor its files with a CORS header. That is also why the download is
  your browser's own: nothing passes through fieldwork, and the file lands on your computer, where
  every province after the first can use it.

- **A street network read from an extract is clipped to the study area, not to its bounding box.**
  A box is a convenience owed to services that only accept one; it is not what anybody drew, and on
  a province-shaped area the difference is a network of two countries — Ituri's box reaches into
  Uganda. The engine indexes the outline by latitude band, so a province's nodes are each tested
  against the handful of edges crossing their own band rather than against 7,759 of them: the box
  still rejects most of a country in two comparisons and the outline decides the rest. The same
  extract gives 122,061 junctions for Ituri's box and 41,425 for a wedge inside it, at comparable
  time.

- **Reading an extract no longer freezes the page.** A province is twenty to thirty seconds of
  synchronous WebAssembly; on the main thread that is twenty to thirty seconds in which the page
  answers nothing, and Chrome offers to kill it. It runs in a worker now, with the extract
  transferred rather than copied in and the graph transferred back out, so neither crossing
  duplicates the bytes and the status line keeps reporting throughout.
- **"signal is aborted without reason" is gone.** A download whose attempt ran past its three-minute
  budget rejected with the browser's own words, which reached a practitioner as a toast while a
  province was downloading. The budget belongs to this client, so the sentence does now: it names
  the 180 seconds, says nothing was changed, and points at the extract path, which asks no service
  at all. The three time budgets are declared caps like the rest.
- **Every cap is declared, queryable, and sorted by whether it is reasonable.** Six magnitude
  limits refused a practitioner's work in sequence over two days, each discovered only after the
  cost of the previous had been paid, because nothing could list them: blockers and directions have
  had a ledger and a validator since October, and caps had a prose inventory. `widgets/caps.json`
  now declares all twenty — value, unit, what it refuses, where the number came from, and the test
  that would replace it with a measurement — `npm run check` fails on any magnitude constant that
  is not in it, and each one is an `fw:Cap` individual in the ontology, so a street-network receipt
  now asserts `fw:governedBy` for the caps that bound the run with `fw:capValueInForce` for what a
  knob was actually set to.
  **And they are sorted by kind.** An *artefact* cap bounds something this application makes — a
  292-pixel drawing, a batch size — and is reasonable by construction. A *platform* cap reports a
  limit the environment imposes. A *discovery* cap bounds what a practitioner can find out, and
  decides in advance the answer to a question this project exists to ask. Only the last kind is
  ratcheted, and only where the number was chosen rather than measured: that count stands at **2**
  — the graph-limit ceiling and the edge-length check — and may fall and never rise.

- **A street network can be read from an extract you already have.** Street network gains a third
  input method: choose a published `.osm.pbf` — a Geofabrik country file, say — and it is read where
  it sits, clipped to the study area as it is decoded, with only the resulting network kept. The
  file is never copied into either browser store, and because most countries publish no
  province-level extract, the same file serves every province and every workflow after the first.
  Nothing is downloaded twice and no service is asked. The work is done by Graphways' Rust core
  compiled to WebAssembly and shipped in this build (`vendor/street-engine.wasm`, MIT, see
  `vendor/street-engine-NOTICE.txt`); OpenStreetMap data stays © OpenStreetMap contributors under
  ODbL 1.0, and the attribution travels in the network's own source line. Measured 2026-10-22: a
  province's driving network, 122,061 junctions, from a 416 MB extract; and the engine is precached,
  so a network can be built with no connection at all.

- **A province-sized network no longer overflows the call stack.** `Math.min(...coordinates)`
  passes every junction as an argument, so at 1,837,939 of them a 300 MB download ended in
  "Maximum call stack size exceeded" while computing how much of the study area it covered. The
  bounds are folded in a loop, and the same spread is gone from the catchment figure, the column
  histogram and the hull's widest pair.

- **A project exports as one document.** Export and Encrypted ZIP are workflow-scoped, so four
  workflows about one province travelled as four unrelated files with nothing recording that they
  belonged together. **Export project**, in the projects list, writes the investigation and every
  workflow in it as one file — each workflow exactly as its own Export would produce it, bundles
  included, nothing re-encoded. Opening it through **Import** recreates the project with a key of
  its own for every workflow, so importing twice makes two projects rather than overwriting the
  first, and every workflow is written before any is opened. The export says how many datasets are
  kept on this device by reference and therefore not in the file.

- **A refused edit says so in the failure tone.** The rollback toast used the same green as
  "saved on this device", so *"Invalid or oversized network provenance"* arrived looking like
  success.
- **Network provenance is checked for being a record, not for its length.** The 100,000-character
  cap was the last of the size refusals that fire after a response has been downloaded and parsed;
  the record carries the study area's outline, so a province failed it.
- **A download the workflow refuses takes its payload back out of the store.** The bytes are
  written before the workflow is asked to accept them, so every late refusal left a payload nothing
  referred to — a device was measured holding **416.2 MB** beside a Street network widget reading
  "0 nodes · 0 directed edges". New ones are rolled back, and the projects list reports the ones
  already there with a control that removes them.

- **The Inspector has one shape, and the way in is the first thing on it.** Every panel now opens
  with the widget's name, one line of what it does, and a block holding **Manual** and **Dive
  deeper** at the size of a control — they were a 10-pixel text link and a collapsed summary,
  placed after whatever alerts a run had raised, so their position moved with the state of the
  workflow and their size said they were an afterthought.
- **Commentary is leaving the Inspector, and a ratchet keeps it out.** It is a control surface, not
  a record: measured at 11,838 characters on 2026-10-20, it had reached 22,855 by 2026-10-21. The
  Street network panel is cut by two thirds and the longest paragraphs elsewhere with it;
  `npm run check` now measures what the panels emit against a ceiling in
  `widgets/inspector-prose.json` that may fall and may never rise, and refuses a measurement left
  sitting far below its ceiling so a trim is recorded rather than banked. What a paragraph was
  explaining belongs in `docs/widgets/<node_type>.md`, which the panel now links to properly.

- **The header says how full this browser's store is.** Everything a workflow holds sits in a
  store this device accepts 5.2 MB of, and nothing said how much was left — so the first news of
  the ceiling was work that would not save. The figure is in the header, turns amber at three
  quarters and red at nine tenths, and says what to do about it.
- **Both stores are reported, not just the one that refuses a save.** A node's records are kept by
  digest in IndexedDB, which this browser offers by the gigabyte, so a figure covering only the
  5.2 MB workspace store can read comfortably beside hundreds of megabytes of street network. The
  header carries the data store beside the workspace one when it holds anything, and the list shows
  them as two sections — what the payloads come to, which store they are actually in, and the
  browser's own estimate of the site, labelled as the browser's and not as this application's count
  (measured on 2026-10-21, Chromium's estimate does not include the workspace store at all).
- **One list of what is on this device.** Clicking the storage figure opens every project and
  workflow held in this browser, each with what it costs, and **Open**, **Export** and **Delete**
  on every row — so a workflow can be exported or removed without being opened first, and a project
  can be deleted from the same place. A worked example appears only once it has been opened, since
  the list is what is here rather than what is published.
- **The download is refused from the service's own count, with the setting it would need.** The
  widget asked Overpass how many *ways* an area holds, and a street download returns the ways plus
  every node they reference — most of the bytes. So a ways count sat inside every limit for an area
  whose response was over 60 MB, and the only way to find the right graph limit was to download the
  cap's worth and throw it away, twice. The count now asks for what would actually be sent, and the
  refusal reads: this area holds N ways and M elements, about X MB at the measured 150 bytes each,
  set the graph limit to Y junctions or draw a smaller area — with no download made and none of the
  service's work spent. It also says that a rate measured on two small extents is not a measurement
  of a large one.
- **A street network is no longer refused for its size.** The ceiling came from the graph knob,
  and the number behind it was measured on *isochrone construction* in central London — applied to
  every network in every workflow, whether or not an isochrone exists in it, and applied after the
  response had been downloaded, parsed and normalized, where a refusal protects nothing and
  discards everything. A province downloaded on 2026-10-21 was thrown away at 1,837,939 junctions
  and 3,755,832 directed segments for that reason. What bounds a download is the byte cap, set
  before the bytes are spent; what bounds an isochrone is the isochrone's own worker, boot check
  and timeout, whose message now says the limit is that step's and that the graph is intact; what
  bounds a saved graph is the store, which reports its own refusal. The 30,000-vertex cap on edge
  geometry went with it. The Inspector picture samples at 20,000 segments and the caption says so,
  because a 292-pixel figure is a limit on a drawing, not on a dataset.
- **An acquired province defaults to driving.** The travel mode defaulted to walking everywhere,
  which is right for a neighbourhood and wrong for an ADM1 unit: nobody walks across a province,
  and footways, paths and steps are most of what makes its download too large. The level is read
  from the acquired boundary's own identifier, so a drawn box has no level and stays on walking —
  a box can be any size, and its extent is not evidence of intent. An explicit choice is never
  overridden, and the panel says why the default is what it is.
- **A refusal says what the other travel mode would cost.** At the scale of a province the mode
  decides whether there is a download at all — footways, paths and steps are most of what a walking
  network holds — and the choice was being made blind. When an area is refused, one more count
  answers whether the other mode fits at the current setting, and the message says which to switch
  to, or that neither fits.
- **The graph limit can be raised, so a province can be attempted.** Its ceiling was the default
  itself — 50,000 junctions — so the download byte cap derived from it, 30.0 MB, could never be
  raised by anyone, and a province download stopped there. 600 bytes per junction is roughly double
  the 270 measured on two real extents, so the cap was a projection enforced as a boundary. The
  ceiling is now one million junctions and the default is unchanged; above the largest graph this
  project has downloaded and drawn (27,181 junctions, 7.4 MB) the widget says what is not known —
  the tab may stop responding, and a failed download saves nothing — rather than refusing. See
  experiment 125.
- **A street-network download that is cut at the limit no longer states a size nobody read.** A
  response that declares its length is refused with that length and the junction setting that would
  accept it; a response that streams past the cap is stopped, and the refusal says the size was
  never read rather than reporting the cap as the measurement. The bytes received are charged
  against the pause before the next request, because the service sent them whether or not they were
  kept.

- **A template fills the canvas you are on, when that canvas is empty.** The ask was *"can I
  import the North Kivu workflow into this blank one?"* and the answer minted a third workflow
  named after the source, leaving the blank one untouched beside it. It now fills the open canvas
  in place and keeps the name you gave it for its own question, and mints a new workflow only when
  the canvas already holds work. Undo puts the empty canvas back.
- **A template is a workflow.** Clearing material by removing the parameter left a street network
  without its `data.nodes` and a drawn study area without the `geometry` key the validator
  requires, and the result was never validated — so a template saved and then could not be opened,
  which also meant it could not be deleted. Material now clears to the empty value of the same
  shape (`null` for an outline, `{nodes:[],edges:[]}` for a graph, empty rows for a table), a
  retrieved collection is removed together with the record of where it came from, and the template
  is validated before it is saved: a template that cannot be made says so instead of becoming a
  row that does nothing. A setting that happens to share a name with material is also kept —
  `boundary` is a provenance record on a study area and the `include` / `exclude` setting on
  Summarize points to polygon, and clearing it by name emptied the setting.
- **A workflow that will not open can still be deleted.** Choosing such a row did nothing at all;
  it now says what is wrong with it and offers **Delete it** on the spot, and deleting works on any
  row rather than only on the canvas that is loaded.
- **Reset example is in the bar only where there is a published example to reset to.** On a
  workflow a practitioner made there is nothing to reload it to, so the button was a control for a
  thing that does not exist, beside the ones that do apply.
- **A workflow can be deleted.** A project could be deleted and a workflow could not, so the only
  way to lose one was to delete the investigation around it — which keeps every workflow and
  removes only the grouping. **Delete workflow** removes it and its project registration, opens the
  next workflow of the same project, and is refused for a worked example, which ships with the
  application and has *Reset example* instead.
- **Rows that were never workflows are gone.** Registering a key in a project and saving the
  workflow are two writes, and the second can be refused by a full store; the first stood anyway,
  so the switcher listed rows labelled with their raw key — `test-project/w7` — that could not be
  opened and could not be removed. Those rows are cleared on arrival with a notice saying what they
  were, choosing one now says there is nothing to open rather than silently leaving the canvas
  where it was, and a refused save no longer leaves the registration behind. A new key is also
  minted from what is taken rather than from a count, which had reused the key of a deleted
  workflow and overwritten its neighbour.

- **A refused save says why it was refused.** Applying a study area into a device whose store is
  full reported only *"Study area could not be saved. Retry Apply."* — advice that cannot work,
  because the next Apply fails identically. Reported 2026-10-21 on an Ituri outline applied beside
  North Kivu's. The refusal now names the cause: the store's own wording when the store is full
  (what to export, and that every worked example opened is kept beside this one), or the name the
  device reported for anything else. The outline stays in the editor either way, so the work is not
  lost with the refusal.

- **A result table no longer supplies a value for a missing one.** Cells with nothing in them read
  *"Not supplied"* — a phrase a reader cannot tell from a source that contains those words, which
  sorted and matched the row filter as if it were data, and which said the same thing about a field
  a record **does not have** as about a field it has and left **empty**. The cell is now empty and
  marked as absent, the two kinds are kept apart, and how many are absent is a property of the
  column, reported where a column is reported. The receipt was silent about an absent field while
  the table showed a confident phrase for it; it now asserts `fw:fieldAbsent` for a field the
  record does not have and `fw:missingValue` for one it has and left empty, **for every column of
  every record**.
- **An output table gets the data-quality check an input gets.** The same dialog — the column
  profiles, the mismatches, and the *Shapes and gaps* view with its missingness and its co-absence
  between columns — opens over a result table, which is the last point before a figure or a count
  leaves the application, and is where OSM's many absent fields are actually read. It opens as a
  **report**: a result is not repaired, you repair the input it came from, so there is nothing to
  press.
- **A workflow can be taken as a template.** *"Can the workflow be imported as a template to be
  filled up?"* — with North Kivu built and Ituri to build. Exporting and re-importing carries the
  material **and the identity**: a 16,547-vertex boundary, 961 retrieved records, 48 decisions, and
  the storage key of the workflow it came from, which the import would then overwrite. **From a
  template…** beside *Add workflow* copies the shape of the investigation instead — which widgets,
  how they are wired, and every decision about *how* to work — into a workflow of its own. The
  **sources are kept**: ask OpenStreetMap, Overture and HDX again, at the same radius, with the
  same clip and the same deduplication thresholds. What a run happened to acquire is cleared: the
  geometry, the records, the street graph, the raster, and the judgements made about those
  records. It says how much it cleared and in how many widgets, because a template that silently
  emptied something is worse than one that says so. **One thing it does not do:** an acquired study
  area keeps no half of its provenance record. The level is a source and the unit is material, but
  the record is one thing, and writing it with the unit fields emptied would be a record of a
  retrieval that did not happen — so the study area is chosen again.
- **A new primitive: Deduplicate point records.** Two sources over one study area draw the same
  hospital twice, and a count of facilities is then wrong by however many of those there are.
  This compares records **across** sources and merges the pairs that agree. It asks two questions
  of each pair — do the names agree, and are they in the same place — and each agreement is worth
  one point. **Two merges on its own; one asks you.** A pair in the review band stays two records
  until somebody answers with a reason, and that reason is pinned to the records as they were, so
  editing either one lapses the judgement rather than letting a stale answer ride on changed data.
  The method is the one in the practitioner's own a record-linkage command the practitioner wrote earlier: blocking first, so pairs
  beyond a declared distance are never compared; binary contributions, so a similarity of 0.87
  against a threshold of 0.88 contributes nothing rather than 0.87; and a missing value that never
  agrees with another missing value. Every threshold is a knob, and the receipt carries all of
  them plus each candidate's score, distance and name similarity — so a figure reporting a
  deduplicated count can say what produced it. **The thresholds that ship are proposals, not
  measurements:** what they should be is a property of your sources, and the first run on real
  data is what answers it.
- **Results is a tab, beside Workflow and N3.** *"It would be easier to see the whole workflow or
  the whole Result panel than to see half of each."* One view is on screen at a time, so the canvas
  gets the work area it had been sharing — 767 pixels where the split gave it 432, at a
  1,100-pixel viewport — and the results panel gets the same when you select it. Three controls
  went with the split, because they existed to manage a compromise a tab removes: the **Expand**
  button that decided which half won, the **divider** between the panels, and the remembered
  results **height**. The two *Full screen* buttons became one, which applies to whichever tab is
  showing and follows you if you switch while in it. A finished run does not move you; the count on
  the Results tab says there is something to look at.
- **The map takes the panel.** It had a fixed 320-pixel band inside a 335-pixel panel — numbers
  chosen when the results were the lower half of a split. It is 438 pixels now, and 771 in full
  screen.
- **A run no longer stops on one unreadable coordinate.** A source whose coordinate column would
  not parse produced `[NaN, NaN]`; the point-in-polygon test answers *false* for anything it cannot
  place, so the record was called **Outside**, carried to the map, and handed to Leaflet, which
  refused it and took the whole run with it — *"Workflow stopped: Invalid LatLng object: (NaN,
  NaN)"*. *Outside* is a finding about a place; a coordinate that is not a number is a finding
  about the data. Such a record is now counted apart, listed as unplaceable, and the run finishes.
- **Three stale map controls removed.** The checkboxes under the map set `display:none` on the
  static plot's marks, so over an interactive map — which has Leaflet's own layer control — they
  did nothing; they are shown only for the plot now. The amber notice named a colour the map
  stopped using when hue was given to the source layer, and repeated counts that sit above the map;
  what remains is the part they do not carry, that a record with no usable location is listed
  rather than plotted.
- **Check spatial coverage is retired.** It asked where each point stood in relation to the study
  area and passed every one of them on, labelled. *Keep points inside the area* asks the same
  question and acts on the answer, and a map draws inside and outside without being asked — so two
  widgets had grown into the question this one existed to answer. A saved workflow migrates on
  open: the node becomes a clip, an edge into a map's or table's *coverage* port becomes an
  ordinary points edge, and the rewrite is stamped so the change is visible rather than silent. A
  check that held **more than one point layer** cannot become one clip, so the loader refuses and
  names the node instead of quietly dropping a layer. **What goes with it:** the ability to exclude
  a single record by judgement with a written reason, pinned to a signature of the record's content
  so that editing the record lapsed the exclusion. Nothing replaces that; exclusions in saved files
  are carried in the migration stamp, inert, and the gap is recorded in the TODO.
- **Point symbols carry a dark outline.** Over a terrain basemap, whose colours run through the
  same values as the categorical palette, a hollow mark was nearly invisible. The outline is a
  neutral rather than a seventh hue, and a checkbox on the Map turns it off for a pale ground or a
  printed figure.
- **The example ledger read a copy of the example list.** `scripts/widget-evidence.mjs` held a
  hand-written map of nine examples while the application offers twelve, and counted one John Snow
  example four times under four keys. So the ledger reported that `coverage_check` had no worked
  example while the Spatial coverage exercise was built around it, and inflated `voronoi`,
  `clip_polygons`, `reproject` and `summarize_points_to_polygon`. There is now one list,
  `src/example-templates.ts`, which the application and the ledger both read.
- **A new primitive: Keep points inside the area.** A health-facility search over North Kivu
  returned 961 places, of which **526 stood in Uganda and Rwanda** — every source is bounded by a
  rectangle, and a rectangle is not a jurisdiction. The membership test existed in five modules
  and was *reported* by two widgets, but no widget answered "keep the ones inside this area", so
  the decision could only be made privately inside whichever widget needed it. `clip_points_to_area`
  takes an area and a point layer and passes on the points inside, with a receipt naming the OGC
  predicate, whether boundary points were kept, and the counts inside, on the boundary and
  outside. A point exactly on the outline is kept by default, and the opposite choice — strict
  `sfWithin` — is a tick box, because the two give different counts on the data where it matters.
  The facility sources clip to the outline too, and say how many they set aside.
- **Every widget that can be labelled is labelled the same way.** Find health facilities had no
  label control at all; three different shapes existed elsewhere. One form, one **Apply label**
  button, one handler.
- **A street network download asks what it would cost before asking for it.** A study area across
  the DRC–Uganda border — some 600 km — spent three instances, two attempts each, and ended on
  `HTTP 504`: the service saying it gave up computing the answer. Overpass will answer `out count;`
  instead, with the number of ways a query would return, so the widget now asks that first and
  refuses an area beyond what it normalizes **with the number**, after one cheap request instead of
  six expensive failures. A count the service itself declines to compute is read the same way —
  that is what a public instance says when an area is beyond it. This is not the span cap that was
  removed on purpose: that refused an area for its width before anything was measured, and this is
  a measurement the service makes.
- **A layer is named for where its points came from.** With a *Keep points inside the area* step
  between a search and the map, two searches of two different registries both announced themselves
  as **"Points inside the area"** — the clip's label — and the map's receipt attributed every record
  to the clip rather than to the registry. A layer's identity was being re-derived from what was
  plugged in, while the identity the data carries travelled correctly and was ignored. The data's
  wins now; what is connected is the fallback for points that carry none. The mark also changes
  from the *first* layer instead of once the six hues are exhausted, so two sources differ in both
  channels and not just in colour.
- **What the fill channel means is carried by the map, not compiled into it.** The renderer read
  `relation`, `status` and `excluded` and decided filled, hollow or grey itself, which fixed that
  channel to one variable for ever. The map now resolves its own rows and hands the renderer an
  encoding that says which variable the channel carries and what each class means; the renderer
  draws classes. The legend reads the same encoding and lists **only the values the map drew**, so
  a map where nothing was clipped no longer offers a key for points a clip set aside.
- **A point layer is drawn as itself.** Two Find health facilities widgets wired to one map — one
  reading OSM, the other Overture Places — drew in the same colour, and the layer control had
  nothing to list, so there was no way to see which points came from which source. Hue now carries
  **which layer** and the fill carries **where the point stands**: filled inside the study area,
  hollow outside, grey where there is no usable location. Each layer also gets a **mark** — circle,
  square, triangle, star, cross or X, named as OGC Symbology Encoding names them — which can be
  chosen per layer in the Map widget's settings, because colour alone is not an encoding everybody
  can read. The marks are drawn on the map and repeated in the legend, which now lists one entry
  per layer instead of three spatial relations in three hues. The ordered bands of a catchment use
  a **ColorBrewer** sequential ramp rather than the categorical palette, since minutes are ordered
  and categories are not. The map receipt records the encoding itself: which channel carries which
  variable, the palette and the authority it comes from, and each layer's mark and colour with
  whether it was chosen or derived.
- **Full screen fills the screen.** Both full-screen controls — the one on the results panel and
  the one in the map's own toolbar — sized the container and left the map at its authored height,
  so the map sat in a band at the top of an otherwise empty screen in both Safari and Chrome. The
  map now takes the room: measured at a 1,100-pixel viewport, 520 pixels of map before and 691
  after, with the rest being the panel's own heading, tabs, figure title, toolbar and source note.
  The map toolbar's button also says *Exit full screen* while full screen is on, uses the WebKit
  names where those are the only ones, and says so rather than appearing to work where neither
  exists.
- **A map's layer control lists only layers that hold something.** *Observations* and *Sites /
  context* were offered on maps that had neither, which claims the workflow holds data it does not.
- **A result no longer outlives the node that made it.** Deleting the widgets that produced a run
  clears their outputs; deleting all of them clears the panel. Changing a *parameter* still keeps
  the previous run, which is how you compare before and after.
- **A large published boundary applies in under a second, instead of freezing or crashing.** The
  study-area dialog built one draggable marker per vertex, so acquiring North Kivu — 16,548
  vertices, admitted whole — meant 16,547 divs with listeners: **8.2 s** of frozen interface in
  Chromium and a **crashed page** in WebKit. Found by profiling, after four plausible guesses that
  measured as nothing. Handles are capped at 400, which is far more than anybody draws by hand,
  and a larger outline is drawn without them and says so: **0.7 s** in Chromium, **0.6 s** in
  WebKit. A **published jurisdiction carries no handles at any size** — dragging a vertex of one
  would change the shape, the provenance and the authoritativeness of an outline that is somebody
  else's — and the dialog says so rather than omitting them silently. Each phase of Apply also names itself, and validation and the N3 preview are recomputed
  only when the shape, its name or the clip settings change rather than on every map movement.
- **An encrypted project can carry what the browser can now hold.** The package refused a
  workflow over 5 MB — a number set when a workflow could not be much larger, because its payloads
  lived in a 5,226,496-byte store. Payloads moved to IndexedDB the same day, so the export cap
  refused the street network the storage work had just made downloadable. One cap was doing two
  jobs: export protects nothing (the data is already yours, already in memory), while import
  defends against a crafted ZIP that decompresses into gigabytes. They are two numbers now, and
  the refusal says what the workflow weighs. Measured in Chromium on a 40,000-junction graph: an
  **8.17 MB package written in 2.4 s**, opened, verified and saved on a clean device in **1.5 s**.
  Carrying a real project between two browsers found two defects in the morning's storage work
  that no unit test reached — an imported payload was dropped on the first save, and then, once
  written, was kept inline because the store was asked what it held before the write rather than
  after.
- **Projects are chosen, read and edited where they are named.** A project could be created and
  then never renamed or described, its subject existed only as a tooltip, and its workflows were
  reachable only as optgroup labels inside the worked-example picker — one control doing two
  unrelated jobs. There are now two: **Project**, then **Workflow** within it, with the eleven
  worked examples listed as the seven built-in projects they already were. The project bar carries
  a details disclosure — name, subject, the workflows it holds, the project id — editable for your
  own projects and read-only for the built-in ones, which say so. **Both titles are renamed by
  clicking them** — the project name in the eyebrow, the workflow name in the heading, with Enter
  to apply and Escape to abandon. `+ Add workflow` creates a canvas
  inside the project instead of an unrelated one you then assign. Deleting a project removes the
  grouping and leaves the work. The picker was the fourth copy of the example vocabulary; it is
  built from the project registry now, so `index.html` names no example at all.
- **The wordmark gives way before the version badge does.** On a narrow window the header's
  mark could not shrink, so its contents overflowed and the version badge sat on top of the
  controls — 94px² of overlap at 330px here, 403px² at 300px, and far enough forward on Linux
  WebKit's wider fonts to hit at 375px, where it had been failing CI and blocking publication for
  half a day. The name now truncates and the badge and icon hold their size. The check that was
  meant to catch it compared left edges, which is only an overlap test while two things share a
  row; it measures the intersection now, prints both rectangles when it fails, and runs at the
  widths where the layout is actually under pressure.
- **A downloaded street network no longer has to fit in a 5 MB store.** Workflows are kept in
  `localStorage`, which accepts 5,226,496 bytes measured in both engines and is written twice on
  every save — and the graph was inside the workflow. A town-sized download therefore succeeded
  and was then discarded, because a network is kept only if it persists. Payloads now live in
  IndexedDB and the workflow keeps a digest that points at one; measured, an 8,096,643-byte graph
  beside a 64,924-byte workflow, surviving a reload. Proving it turned up a second copy: the
  project manifest inventoried every junction id and every edge pair, 2.25 MB for a 40,000-junction
  graph, and now carries counts and the payload's own SHA-256 instead. Where the large store is
  blocked or refuses a write, the Street network widget says so **above the Download button**, and
  a toast says it the moment it happens: a fallback nobody is told about turns the larger ceiling
  back into the smaller one while the application goes on reporting that everything was saved.
- **A street network is downloaded for walking or for driving.** There was one filter and it was a
  walking one, while the reachability widget already offered walking, cycling, driving or other —
  so a driving question was asked of a graph that excluded motorways and trunk roads and included
  steps, and nothing objected. On the Soho graph this repository ships, 56.7% of edges and 48.1% of
  edge length are types a driving filter excludes, and 28.1% carry a vehicle one-way restriction
  the walking parser ignores. Driving now keeps motorways and trunk roads, drops footways, paths
  and steps, honours vehicle one-ways and roundabouts, and reads `motor_vehicle` and `motorcar`
  restrictions; the highway exclusions follow OSMnx's drive filter so the two are comparable. The
  mode is part of the request, so a cached walking graph cannot be served to a driving download; it
  is saved with the graph, shown on the widget and asserted in the receipt; and a downstream widget
  asking for a mode the graph cannot carry is refused rather than answered. Walking remains the
  default. A driving graph still carries no speed limits, no junction delay and no congestion —
  travel time is one speed applied to every street.
- **A project is an investigation, and holds several workflows.** "Project" had been a word in the
  title bar bound to the current workflow's name. It is now an entity: a subject, and a workflow
  for each question asked about it. The four cholera workflows are one project; Old Naledi's two
  are another. Membership is optional in both directions and a workflow in no project is still
  reachable. Starting an empty canvas now asks what you are investigating before it asks where.
  A payload used by several workflows is held once, and the reference exists only on disk — a
  workflow in memory always carries its data, so nothing downstream changed.
- **The palette offers every widget once the canvas holds an input.** Four hand-curated lists
  decided what was addable, and nine widgets were reachable only from the examples whose templates
  named them — `measure_distance` among them, on one example that is slated for retirement. Eight
  of the nine carried an open evaluation obligation, so the gate was asking for judgement on
  widgets a practitioner could not open.
- **Street networks are judged on what they cost.** A fixed 6 km envelope refused a study area for
  its width before anything was measured; Buvuma Island's bounding box is mostly Lake Victoria.
  The byte and feature limits are now their own numbers rather than following the isochrone's
  memory limit, and the default graph size admits a real town — 50,000 network nodes, where 2,000
  refused Buvuma's 11,359 and Bunia's 42,796.
- **The OSM client follows the service.** Each instance's `/api/status` is read — free slots, rate
  limit, when the next slot frees — and a busy service is waited for rather than treated as
  failed. A six-second health check had been declaring a live service dead for answering slowly,
  which is how Overpass expresses load. Responses are kept on the device and reused for the same
  query; pressing Download again when a network is already saved fetches a fresh one. The widget
  shows endpoint status before a download, progress on the button during it, which instance served
  the saved graph, and why a download failed.
- **Mean center can be weighted by a record attribute.** 250 addresses carrying 489 deaths have two
  different centres; the receipt asserts the field and the weight total beside the unchanged point
  count. A weight that is missing, non-numeric or negative is refused with the count of records it
  applies to; a weight of zero is kept.
- **Two widgets renamed to say what they act on.** `summarize_polygons` became
  `summarize_points_to_polygon` and `hex_aggregate` became `aggregate_points_to_h3_cell`. Saved
  workflows naming the old identifiers are rewritten on open.
- **Refusals name the action.** A workflow holding a study area was told to add a study area; an
  empty street network did not say the download is a separate button; a six-megabyte boundary
  download reported nothing while it ran. Each said what the state was and not what to do.
- **Manual pages for Study area, Street network and Point data**, and a default label now names its
  widget: every Map was born called "Study area and points", which was one example's label.

**Migration.** None required. The two renamed node types migrate on open and keep their
connections; `projectId`, `workflowKey` and `dataRef` are optional and absent from every saved
workflow written before this version.

**Validation limits.** The caps that are measurements are separated from the caps that are guesses
in `docs/experiments/125-caps-below-the-limit-we-are-testing.md`; four remain unmeasured and are
listed in TODO.md with the artifact that would stress each. Parity for the renamed widgets and for
`mean_center` still covers their previous release, and the catalogue says so.

## 0.9.0 — In development

- **Reachable junctions attaches its own origins.** It refused any point without a
  `networkNodeId` and told the practitioner to add a `snap_to_network` step first, which made a
  whole widget a prerequisite for one nearest-neighbour search. It now finds the junction itself,
  by the same `nearestNetworkNode` over the same projection, so the two paths agree junction for
  junction and metre for metre — asserted, not assumed. A point that arrives already snapped is
  used exactly as it arrives. This is steps 1 and 2 of the `snap_to_network` retirement, which
  turned out to be one step: a zone with nothing to project is not worth adding on its own.
  **The step does not move the point** — it reads the nearest junction, charges the distance
  against the budget, and leaves the origin where it stands.
- **The new `zone`, `hemisphere` and `maxSnapM` are optional, so nothing had to be migrated.**
  The widget's reason for having no zone stays true whenever origins arrive snapped: nothing in
  the Dijkstra re-measures geometry. Requiring a zone for a run that never projects would demand
  a figure the widget does not use, so completeness is refused at **run** time, naming the
  origins that needed it, and every saved workflow keeps working untouched.
- **Reachable junctions had no Inspector panel at all** — not merely none for the new parameters.
  Its travel time, speed, mode and direction have been declared, implemented and tested since
  experiment 83, and the only way to set any of them was to edit the workflow file. The node fell
  through every branch of the Inspector's type chain. `palette.ts` could not have caught it: it
  asserts a widget is **addable**, and addable is not configurable.
- **A successful edit could throw while rewriting the Inspector.** The same focus-versus-innerHTML
  hazard fixed in the rollback path earlier the same day, on the path where the edit succeeds.
  Found by a test that types a UTM zone. Both paths drop focus first now.

- **The Run workflow button was invisible whenever it was disabled.** Not removed — rendered at
  **1.22:1** against its own background, in both colour schemes, measured with this project's own
  `contrastRatio`. `.button.primary:disabled{opacity:.45}` dims the whole element, which moves the
  white label and the green fill *towards each other* until they meet in the same pale mint. Every
  worked example auto-runs on load and the button is disabled while it runs, so the slower ones —
  06, eighteen nodes — spent that whole time with no button a practitioner could see. Replaced with
  declared `--button-disabled` / `--button-disabled-ink` tokens: **5.94:1 light, 4.77:1 dark**. The
  generic disabled opacity went from `.4` to `.55`, which takes secondary buttons from 2.15:1 to
  3.12:1 in light mode — better, and still short of the 4.5:1 text threshold, which is recorded
  here rather than claimed as fixed. WCAG 1.4.3 exempts disabled controls; exempt from the
  requirement is not an argument for unreadable.

- **Result tables rank by a column.** Every column header is a button; clicking it orders the
  table, clicking again reverses it, and the active column declares `aria-sort`. Which matters
  less than what an order over a result table has to decide: **records with no value for that
  column are held at the end in both directions**, and counted in the controls, because "which
  clinic is furthest from a road" must not be answered by a clinic nobody measured. And the
  comparison is chosen per column from the values present — every known value a number makes it
  numeric, anything else is compared as text with numeric-aware collation, so a column holding
  both `3` and `'3'` is not quietly coerced into looking sound at the moment somebody is reading
  it. Found missing while decomposing that question: `snap_to_network` had claimed since
  2026-10-14 that its displacement was *"a point attribute a practitioner can map, sort and argue
  with"*, and nothing in the application sorted anything.
- **A rule says what its setting is set to.** A condition read *"DEATHS is at most the cluster
  setting"* — the practitioner, 2026-10-17: *"does this not look like fixed on context"*. It did.
  The name was real and declared; `the … setting` was a sentence composed around it, carrying
  nothing the name did not, while the figure the rule turns on sat two panels away. Both the
  editor and the Inspector now show `cluster · 4 deaths`. Third time this shape has come back,
  after `{{threshold}}` (the stored form) and *"Deaths at this address"* (a label over a column);
  each time the fix is to show what is there.
- **Clearing a setting is refused by name, not by range.** `Number('')` is 0, so an emptied
  setting box was stored as zero and bounced off the declared minimum — *"busy must be between 1
  and 20"*, about a figure nobody typed — and a setting declaring no minimum would have run on
  that zero in silence. The run now says it needs a value for that setting.
- **A refused edit no longer throws while rewriting the panel.** Rolling an edit back re-rendered
  the Inspector while the control that made it still held focus, which Chromium refuses with *"the
  node to be removed is no longer a child of this node"*. Focus is dropped first. Any refused
  edit typed into a field could raise it; it took a test that clears a required setting to find.

- **A map says which design rules it was held to.** Four rules are applied while a visualisation
  is assembled, and its receipt states every one — including the ones that did not apply, so a
  reader can tell a rule that passed from a rule that was never run. Text and mark contrast are
  **measured** against WCAG SC 1.4.3 and 1.4.11 with the number in the receipt; the palette and
  the no-data colour are **categorical** checks, and each rule declares which it is. Expressed in
  **EARL** (the assertion), **DQV** (the measurement) and WCAG's own IRIs (the criteria) — only
  the threshold is new vocabulary, because EARL states it does not carry one.
- **A shapes-and-gaps tab in the data quality dialog**, with a **nullity matrix** adapted from
  [missingno](https://github.com/ResidentMario/missingno): every column against the same records,
  one mark per record in file order, plus a completeness sparkline that makes the worst *records*
  findable. Opening the damaged worked-example input shows its gaps are every fourth record,
  which "63 of 250" cannot say. Sharing one row axis is what lets two columns that go missing
  together be told from two that do not. Also: how much of each column arrived, a distribution
  per numeric column with the 1.5×IQR fence drawn where it falls, and frequencies per category —
  except where every value is unique, which is named as an identifier rather than charted. File
  order may carry meaning or none, and the tab says so.
- **A data quality dialog, per input widget.** One card per column: what is declared, what does
  not match it, what is absent, and the shape of what is there. It is where a repair is declared
  **and where it is taken back** — removing the declaration restores the originals, which were
  never overwritten. An unbound column says *"nothing has declared what they should be, so there
  is nothing here to be wrong against"* rather than implying a clean bill it cannot give.
- **Every toast tone was unreadable, in both themes.** White text on mid-tone fills: light
  warning 3.81, light failure 3.72, dark warning **2.08**, dark failure 2.41, against a 4.5 floor.
  Each tone now has a foreground token paired with its background per theme, and a test holds all
  six tone/scheme combinations above 4.5.
- **Column profiles, and one repair you can act on.**
  [Experiment 117](docs/experiments/117-data-quality.md). Every column in the quick look now
  carries what the file says about it: values that do not match a declared kind (**marked in the
  cells**, not just counted), how many are absent, and for numbers min/median/max with a count
  **beyond a 1.5×IQR fence** — a prompt to look, never called an outlier, because whether a value
  is one is a judgement about what was measured. Categories show their most frequent values and
  how many are distinct.
  A column declared numeric that holds numeric text offers **Read N values as numbers**, stating
  its count before you press it. The repair is never automatic — this application refuses to
  convert silently, and `"3"` → `3` is the same class of act as a unit conversion. It reports
  both sides, leaves what it cannot read exactly as it was, is reversed by Undo, never writes to
  the source file, and is **stated in the run evidence** as `fw:ColumnRepair`.
  **The repair never overwrites what the input holds.** It is a declaration — which column, read
  as what — applied to a copy on the way out, so the records a node carries stay byte for byte
  what was imported and removing the declaration restores them without an Undo.
  **No repair is offered for a missing value.** Filling one is imputation, which is a modelling
  decision belonging to the practitioner and their method, not to a widget's convenience.
- **A rule names the column, not a label written over it.** The rule editor and the Inspector
  showed a binding's human-readable `label` — so a rule read `Deaths at this building` for a
  column the file calls `DEATHS`, and a practitioner checking the rule against their data had to
  translate. They name the column now. A label is a gloss beside a binding, never a substitute
  for it in a rule.
- **"Is it recorded" is a comparator, not a pseudo-field.** Every bound field has a generated
  companion saying whether a record had a readable value. It was offered as a second entry in the
  field list, so a rule read `IF whether Deaths at this building is recorded is false` — a double
  negative wrapped around a question, and worse for an unlabelled column: `IF whether n_deaths is
  recorded is false`. `is recorded` / `is not recorded` now sit beside `is more than` in the
  comparator list, which reads whatever the column is called and halves the field list. The
  stored rule and its N3 are unchanged.
- **The ruleset example bands buildings, not "addresses".** The provenance for that file says
  "250 buildings with death counts" and the upstream table is `deaths_by_bldg`; "address" was a
  word this example coined. In 1854 Soho one building routinely held several addresses, so the
  old wording stated a unit of aggregation the source does not have.
- **Quick look: a table at a width you can read it.** A tabular input offered a filename, a row
  count and a block of JSON describing the table's *shape* — everything about the table except the
  table — inside a 292px panel. **Quick look at the table** opens its rows in a wide dialog with
  every column, a filter, and absent values shown as *not recorded* rather than as blank cells.
  Point inputs get the same button, for the same reason. It reads; it changes nothing.
- **A republished worked example says so.** A saved workspace wins over the published template —
  it must, or your edits would vanish on every visit — so rebuilding an example reached nobody who
  had already opened it, and nothing mentioned it. The workspace now records which published
  version it came from, and a newer one offers itself in one click. Nothing is replaced without
  asking: your copy keeps your edits until you choose.
- **The alert and failure colours were split in the keyframes too.** Splitting the static rules
  was not enough: the pulse hard-coded the danger token and runs for over four seconds, so a node
  that had merely *found* something rendered red for the whole animation and turned amber only
  once it stopped.
- **A widget that fails glows red, and keeps its own colour.** A step whose run was refused used
  to keep the **running** state for ever — `onProgress(id,'done')` is the last line of the loop
  body and a throw skips it — so the canvas showed the one widget that had stopped as the one
  still working. It now reports which node failed, and that node is drawn in the danger colour.
  **Alerts on a completed run moved to amber** so the two can be told apart: amber means there is
  a result and part of it needs reading differently; red means this step produced nothing. They
  were the same red, which made "your answer has a caveat" look like "you have no answer".
- **The fail conditions are in the ontology.** A run that read a value as "not recorded" records
  why, in the evidence: `fw:ReadingProblem` on the rule application, naming the attribute, the
  count, the records considered, and which of `fw:ValueAbsent` or `fw:ValueUnreadable` applies.
  Both produce the same fact for the reasoner, so the receipt is the only place they can be told
  apart afterwards. A step that read everything says so rather than staying silent.
- **A step says what it could not read.** A ruleset applied to records whose values it cannot
  use tells the rules those values are not recorded — which is correct, and was silent. It now
  reports them: as an amber notice after the run that names the steps and **stays until it is
  closed**, as a badge on the widget, and in the Inspector with the column, the count and what it
  saw. It separates a value nobody collected from a value somebody collected that this step could
  not read: both produce the same word in the output and they are not the same problem.
- **The ruleset example carries two more workflows, over deliberately damaged data.** C is Snow's
  Table 1 with three dates' counts removed; D is his mapped locations with a quarter of the counts
  written as text. Both run the *identical* rules as A and B — from one factory, so they cannot
  drift — and both inputs say in their label that the damage is simulated. The missing-value
  branch, which Snow's own data never reaches, fires in C.
- **Advice now fits the finding.** Every node alert ended with "Raise the snap limit or the travel
  time… extend the street network", including alerts about undeclared fields, which have nothing
  to do with streets.
- **A ruleset can read a table.** The authored path took a point layer and nothing else, so rules
  could be written about places and not about rows — half of the data anybody has, and all of
  Snow's Table 1. Both ends now normalise to a record: a table row's attributes are its key
  columns plus its declared value field, the conclusions come back as further key columns beside
  the number they were made about, and the rule layer between them is unchanged. A point layer
  behaves exactly as before.
- **The ruleset worked example is now two workflows on one canvas, over John Snow's own data** —
  Table 1 banded by the deaths on each date, the mapped locations banded by the deaths at each
  address. The halves share nothing, because Table 1 carries no place and a location carries no
  date, and a rule reads neither differently. It replaces twelve invented clinics. **It invents
  no records**, so a branch fires only where Snow's data put something in it: the missing-value
  branch is now unexercised, and boundary records are the next thing to add.
- **An input shows its records** as a table of columns and rows, and as the JSON they actually
  are, with a control for how many to show. It previously listed twelve record names and no
  column at all, while the ruleset beside it asked which column meant which field.
- **A published ruleset's rules can be read in the rule editor**, laid out as rules rather than
  as N3, with every control disabled — it is pinned and versioned, and a reader of a workflow has
  to be able to tell which rules ran. Each published document now carries the authored source its
  N3 was compiled from, and the build fails unless the two still agree.
- **A failed run says so.** Every toast used success green and faded after five seconds, so
  "Workflow stopped" looked exactly like "Complete in 280 ms". A failure is red, stays until it
  is closed, and no longer has its canvas status overwritten by the render that follows it.
- **A rule refers to a setting by name**, not by typing `{{threshold}}`. The placeholder belongs
  to the compiled rules, which are text that `bindParameters` fills; it had been carried into the
  form a practitioner edits.

## 0.8.1 — In development

- **A map has layers, not modes.** `map_output` no longer asks which kind of thing it is before
  it will accept one. It declares every layer port it can draw, the renderer is read from what is
  connected, and the canvas shows the layers a map draws plus **one configurable port**: drop any
  drawable result on it and it binds to the port its type belongs to, with a second point source
  opening the next slot rather than replacing the first. The Inspector is the same — one picker
  per layer, one *Add a layer* picker. **Migration:** saved workflows keep their stored
  `inputMode`; it is read only as a fallback for a map with nothing connected, and nothing writes
  it, so what a saved workflow drew is what it draws. A map node now carries more handles than
  before and a canvas laid out tightly around the old shape may need a Tidy. Widget release
  `map_output` **0.10.0**.
- **Presentation and basemap are available on every map**, not only on one input mode of one
  presentation. Choosing a basemap switches the map to the presentation that can draw it. Nine of
  the ten maps in the worked examples previously had no basemap control at all. Tiles are still
  excluded from the SVG export, and the receipt now records a basemap in use as layer 0 with the
  provider it came from.
- **Connecting a raster no longer deletes a map's other connections.** A raster is a layer; the
  others stay wired and recorded. The renderer still draws one picture at a time.
- **A superseded ruleset says so.** A step pinned to an older ruleset version names the newer one
  in the Inspector and at the run, with what changed, what it deprecates and whether moving is a
  drop-in. The Inspector also says what the offered version of a widget changed, folded for an
  ordinary release and open for a breaking one.
- **Undeclared provenance on a projection extract is an alert, not a refusal.** A missing dataset
  IRI, version or third citation used to stop the run; no provenance field changes a computed
  number. **Migration:** a workflow that previously refused to run will now run and report the
  gaps, so a result can be published from an extract whose source is undeclared — the alert is
  what makes that visible. Fields that decide how numbers are *interpreted* — baseline period,
  basis kind, value unit, key columns, declared families — still refuse.
- **The progressive-reveal playback is reachable** from the workspace bar as *Play back the
  build*, rather than only by typing `?playback=1`. It changes nothing that is saved and leaves
  the ordinary palette untouched: the reveal rule is measured and prototyped, not adopted.
- **Rules can be written, not only chosen.** A ruleset step can carry rules authored in the
  workflow instead of a published ruleset picked from a list. **Edit these rules** opens a dialog:
  conditions grouped by *and*, alternatives by *or*, a list of conclusions, add and remove
  throughout. The rules are compiled as you write them, so the limit on how many a ruleset may
  have — and any refusal — appears while you are writing rather than afterwards, and *Keep* stays
  disabled while they cannot compile. Nothing is written to the step until you keep it. The
  Inspector reads authored rules back in plain words, with the columns they read and the settings
  they use.
- **A measurement must state its unit.** A numeric field and a numeric setting each declare one,
  and a comparison between two that disagree is **refused by name** rather than converted —
  checked while you write the rule and again when the workflow runs. Where no rule can help, the
  editor shows the field's unit beside the box its value is typed into: a bare number takes the
  field's unit and nothing can tell what you meant by it.
- **A new worked example: *09 · Rulesets · how a rule is put together*.** Four steps, one way of
  writing a condition each — banding a number, alternatives reaching one conclusion, two
  conclusions at once, matching a category, and bounds from below — over twelve synthetic service
  points chosen so every branch of every rule has a record in it, including a missing value and a
  category no rule names.
- **A canvas offers the input stage first.** With nothing on the canvas the palette offers the
  widgets that need no input, and opens fully as soon as one is placed. There is no sensible
  process step before there is something to process.
- **The street network download asks four Overpass instances, not one.** Every instance is asked
  a one-line question first, so a download is not spent discovering the first three are down, and
  the instance that answered is recorded in the run evidence. A regional mirror that answers for
  an area it does not hold is reported as a coverage limit rather than as a study area with no
  streets. **Migration:** none; the saved network format is unchanged.
- **The study area suggests the metric zone**, before any step that measures exists to carry it,
  and when the area spans more than one zone it names each candidate with the worst stretch it
  would cost. It sets nothing.
- **A canvas alert can be closed.** The badge on a node has an ×. Closing it keeps the finding —
  the node still glows and the Inspector still carries every detail — and the next run raises it
  again.
- **Fixes.** A toast's buttons could not be clicked, so *Reload*, *Later* and *Update now* never
  did anything; they work now. A stale cached build is named in the header — **v0.7.0 · cached** —
  with an offer to update, and `?reset-cache=1` clears a cached build from a browser with no
  developer tools, leaving saved workspaces untouched. The widget manual is legible in dark mode.
- **The manual is for the person using the widget.** Each page says what kind of widget it is,
  what it does, what to connect, how to use it, which worked examples exercise it and what it will
  not do. The design records moved to `docs/widget-specs/`.
- **Validation limits.** 511 unit tests and 133 browser tests pass, with the browser suite run on
  Chromium, Firefox and WebKit in CI. No practitioner other than the author has used any of this,
  and the rule editor in particular has been used only by the person who wrote it.

## 0.8.0 — In development

- **A rule about a shape now hands the shape back.** The extent ruleset used to return a table of
  judgements and drop the geometry, so a decision about a polygon could be listed and never drawn,
  clipped or summarised. `extent-review` **1.1.0** returns the polygons it judged, each carrying its
  status and the comparison behind it, and the polygon table shows both along with the area the
  polygon derived. The John Snow outbreak-extent example draws the judged outline. A workflow
  pinning 1.0.0 keeps working and keeps its old table.
- **A saved composition can hold a ruleset.** `classify_extent` is one step that expands into a
  convex hull and the extent ruleset, with the threshold exposed for a practitioner to set. It is
  private and unreviewed, as the other composition is. Building it fixed two limits that any future
  composition would have hit: a parameter can now address a nested field, and a member whose output
  port comes from its own pin is no longer refused as emitting nothing. One limit is left open and
  recorded — a composition pins its widgets, not the ruleset they apply, so nothing reports a
  ruleset moving underneath it.
- Widgets that measure a shape and widgets that judge one now link to the Validation Lab notebook
  explaining what those steps assume, reachable from the Inspector.

- **A travel-time catchment now charges all three parts of the walk, and draws the whole
  route.** The walk off the street at the end — from the last junction to a door — used to be a
  fixed 25 m strip drawn around every reached street, including the streets at the very edge of
  the budget, so the region claimed 25 m of ground beyond its own time all the way round. It is
  now a leg with a budget: the full width where that much time is left, narrowing to nothing
  where it runs out. The setting is renamed **Final walk off the street** and means the furthest
  anyone is assumed to walk off a street at the end of a route. **Results change again**: on the
  John Snow example the bands shrink by 39.3%, 13.8%, 4.2% and 0% — the longest band does not
  move, because there the network runs out before the time does — and the one-minute band falls
  from 35 locations and 89 deaths to 21 and 65. Of the 110 deaths that band claimed before any of
  this work, 45 were inside only because two of the walk's three segments were free.
- **Travel-time catchments now charge the walk onto the street network.** A route has three
  parts — from the site to the nearest junction, along the streets, and from the last junction
  to the door. The first was measured, published in the evidence and then thrown away, so every
  isochrone reached further than its minutes allowed. It is now deducted from the budget, in
  both **Network isochrone** and **Reachable junctions**. **Results change**: on the shipped John
  Snow example the one-minute band falls from 48 to 35 locations and from 110 to 89 deaths, and
  the band areas shrink by 18.5%, 7.8%, 1.7% and 0% as the budget grows. A workflow rerun after
  updating will show smaller catchments; that is the correction, not a regression.
- **A site far from the streets is no longer thrown out of the run.** Past the snap limit it used
  to raise an error that discarded every other site's result. It is now routed anyway, with the
  straight line to the nearest junction charged against the budget, and marked: the catchment
  carries `fw:offNetworkMetres` and the site is listed in `fw:offNetworkSites`. **Snap sites to
  the network** drops nothing either; the points it emits say which of them crossed ground no
  street covers. A straight line assumes a walk that may not exist, so those results are
  optimistic in a stated direction rather than missing.
- **The widget tells you, in red.** A widget that could not connect a site glows on the canvas
  with a count, and the Inspector names each site, what happened to it and the distance that
  decided it. The finding travels downstream, so a summary over seven of nine catchments glows
  too. Sites whose walk alone spends the whole budget get no catchment at all — nothing is
  reachable, and the only drawable shape would be a disc around a junction they cannot get to —
  and are named in `fw:unconnectedSites`. That disc was being drawn silently before, whenever the
  snap limit was set wider than the travel budget.
- **Snap sites to the network** keeps each site's own coordinates on the point it moves, which
  is what lets anything downstream draw the first leg of the route. The four-widget chain
  (snap → reachable junctions → band → corridor) reproduces the one-widget catchment to 2×10⁻⁵ of
  area at every band.
- Validation limits: both straight legs — onto the network and off it at the end — are charged at
  the street walking speed and assume ground that can be walked, so a catchment over sparsely
  mapped ground is still optimistic. The 25 m default for the final walk is plausible for Soho
  and calibrated nowhere. Measured only on the well-mapped Soho network. See
  [experiment 114](docs/experiments/114-the-three-segments-of-a-walk.md).
- Removed two internal corridor builders (`bufferedCorridor`, `reachedStreets`) that nothing
  could reach once the corridor stopped having a single width.

- Add the **Manila coastal exposure** worked example, the first increment of the sea-level work:
  published IPCC AR6 projections for eight Philippine tide gauges against 60 real OpenStreetMap
  health facilities, each assigned its nearest gauge with the distance recorded. It runs offline
  and reaches no source. It stops deliberately short of comparing a projected level to an
  elevation, because none has been supplied and a comparison against an invented one would look
  exactly like a real result; tests assert that neither the threshold widget nor a raster output
  appears.
- Building it found two defects. Facility identifiers were minted as `node/3090641351`, which the
  application's own point rule rejects — the widget stores points in its own parameters and never
  met that validator, so the slash passed everywhere until the same points were put into an Input
  data node. They are now `node-…`. And `exampleKey` fell through to Old Naledi for any workflow
  holding a study area, so the new example was silently given Old Naledi's title, description and
  licence note.

- Add **Find health facilities**, one widget with three sources a browser can actually reach, none
  needing an account: a live OpenStreetMap query through Overpass, the Humanitarian OpenStreetMap
  Team country export published on HDX, and Overture Maps Places read directly from GeoParquet in
  cloud storage. The study area bounds the query rather than filtering it afterwards. Retrieval
  happens in the interface and never during a run, so a workflow runs from stored facilities with
  the network off; `core.ts` imports the value and validation functions and deliberately not the
  download function, and two checks hold that in place. Verified live: 47 facilities from
  OpenStreetMap and 30 from the HDX export for the same Manila area, 488 from Overture.
- **Overture Maps Places counts differently, and the widget says so.** It catalogues commercial
  places, which is broader than a health facility: unfiltered it offered 1,120 health places in a
  Manila study area where OpenStreetMap found 47, the extras including individually named doctors,
  a wellness spa and a training course, and it reported 207 places under "hospital" where
  OpenStreetMap returned 47 hospitals and clinics together. So it filters on the confidence it
  states for each place, defaulting to 0.70, and its categories map onto facility kinds
  conservatively with the vaguest three not mapped at all. Each facility keeps Overture's own
  category and confidence, and the receipt states that counts are not comparable between sources.
  Overture is CDLA Permissive 2.0 rather than share-alike, so the licence is read from what the
  retrieval recorded instead of assumed.
- Remove `healthsites_discovery`. It needed an API key and healthsites.io sends no cross-origin
  header, so the application could never read its response and acquisition meant asking the
  practitioner to download a file and hand it back. A saved workflow holding one migrates to the
  OpenStreetMap source, carrying its facility kinds but not its data: relabelling a hand-back of a
  file this application never saw as an OpenStreetMap retrieval would be a false provenance record.
- **Attached PDFs and retained raster windows could not be stored in Safari at all.** Local storage
  wrapped every value in a `Blob`, and WebKit aborts any IndexedDB transaction that puts a `Blob`
  or `File` into an object store. Bytes are stored instead; a database written by the previous
  version is still read. The failure was hidden because the abort handler asserted a full disk and
  discarded the error that said otherwise — it now reports what it observed and claims no cause it
  has not seen.
- WebKit now passes the whole browser suite, 88 scenarios, the same as Chromium. It stood at 42
  passed and 37 failed, unchanged since 0.5.x. Of the failures, 23 were one Playwright fault in
  navigating while offline, fixed by the dependency bump; 11 were the Safari storage defect above;
  and 2 were tests whose simulated network conditions silently did not apply, because a controlling
  service worker hides requests from the harness in WebKit. Those two now assert the behaviour with
  `setOffline`, which works in both engines, and the one test that substitutes a fixture blocks the
  service worker rather than being skipped and counted as covered.
- Add **Sample raster at points**, which reads raster values at point locations, and **Area around a
  point**, which derives a study area from one named point and a radius. The study-area editor
  gains a point-and-buffer mode with a draggable circle and an adjustable radius, replacing a
  circle made of 128 draggable vertices.
- Sea-level projection values are keyed on a declared `basis` with its `basisKind` rather than on a
  workflow identifier. Measured 2026-10-09: the AR6 confidence output files carry no workflow
  dimension and are p-boxes over several workflows, so a key component assuming one workflow could
  not describe them. A p-box bound is not a quantile of one distribution.

- Fix the results pane taking over the screen when a comparison result was opened. Expanding to full
  width was triggered on every render of a comparison, so selecting the comparison node — which now
  shows that node's result — expanded the window behind a click aimed at a node. It happens on the
  render following a run and is otherwise the reader's choice, guarded by
  `tests/results-expand.browser.mjs`.
- Rework both John Snow workspaces to carry place and time together: Snow's own 1855 daily table is
  imported, turned into a series declared as deaths by date of death, and drawn as an epidemic curve
  beside the catchment map. The two are deliberately **not connected**, because his death locations
  carry no date and his daily table carries no place; the 45 attacks of unknown date are excluded by
  the import and the node says so.
- Bundle the 1,852-house General Board of Health digitisation at `examples/snow-gboh/`, verbatim and
  unmodified, with a NOTICE recording its stated GPL licence, the absence of a licence file and
  version in the download, its 1855 HMSO origin, and the limits that apply: the denominator counts
  houses rather than people, the numerator and denominator come from different years, and the
  coordinates are OSGB 1936, so no modified or reprojected copy is distributed.

- Make the running build identifiable, and announce updates. The service worker answers from its cache
  first and never revalidates, so a tab keeps running old code until it is reloaded — which meant a
  feature could be deployed, verified and still absent for the person looking at it, with no way to
  distinguish that from a defect. The controlling worker now reports its own build identity, shown in
  the catalog as **Serving this page**, and an installed update raises a notice with a **Reload**
  action that stays until it is used or dismissed. The identity comes from the worker rather than from
  the page, so it names the build actually answering. This also protects against a subtler failure: an
  old page can request content-hashed chunks that the new cache no longer holds.

- Link the canvas to the Results panel: selecting an output node opens that node's result tab and
  marks it, so the two panels agree about what is being looked at. A node that produced two tabs, as a
  coverage check does, keeps whichever of its own is already open rather than jumping between them,
  and selecting a node with no result leaves the open tab alone while clearing the mark.

- Add **Rate with a denominator**, the first widget on the person axis: divides counted events by a
  declared population at risk, grouped by an attribute or by bands of a numeric one. The declarations
  are the point — what the denominator counts (people, houses, households, person-time), whether the
  result is a proportion or a ratio, the multiplier, the smallest denominator that gets a rate, and the
  numerator period beside the denominator vintage, which are compared rather than assumed to match. A
  proportion exceeding one is refused, a zero or small denominator reports its counts and no rate, and
  a non-numeric or negative value is refused rather than read as zero. `fw:RateResultShape` requires
  the unit and the kind, so a rate that does not say what it is a rate of cannot conform.
- Record what the surviving John Snow data sets can and cannot support in
  [a research note](docs/research/john-snow-data-sets.md): the 578-point digitisation is a stacked
  cartographic device rather than case locations and was withdrawn from the Chicago compilation; the
  bundled 250-building file has an unknown licence; a denominator exists only as **houses** in the
  1,852-house General Board of Health digitisation, so a rate per house is defensible and a mortality
  rate per person is not; the numerator and denominator come from different years; and the GPL on that
  digitisation permits redistribution, so the file can be bundled verbatim with its licence and
  attribution, while a reprojected or filtered copy would itself have to carry the GPL. Measured there:
  186.7 deaths per 100 houses within 50 m of the Broad Street pump against 2.0 beyond 300 m, and 55.6 %
  of houses within 50 m having at least one death against 5.0 % at 250–300 m.

- Add **Cases by period**, the first widget on the time axis: counts cases per day, week or month
  from a declared date attribute and a declared **kind** of date, reading either a point layer or a
  keyed table, and optionally weighting by an attribute where one row stands for several cases. A
  Chart output gains a case-series mode that draws the result as an epidemic curve, so the curve is a
  presentation of the series with no smoothing or interpolation. Periods with no cases are retained,
  because a gap is a fact about the outbreak; records whose date is not ISO 8601 are excluded and
  counted rather than guessed at, since a widget that chose between day-first and month-first ordering
  would be silently wrong for a third of the year; and a non-numeric or negative weight is refused,
  naming the record. `fw:CaseSeriesShape` requires the kind and the period, so a series that does not
  say what it is a series of cannot conform.
- Bundle **John Snow's own daily table** (1855, Table 1) at `examples/john-snow/snow_dates.csv` with
  its citation chain, digest and retrieval route. It supplies the time axis his map cannot: 616 deaths
  and 571 dated attacks between 19 August and 30 September 1854, with **attacks peaking on 1 September
  and deaths on 2 September** — the historical demonstration of why the kind of date must be declared.
  Recorded limits: the file's final row carries 45 attacks with no date, which a keyed table cannot
  represent, and the two Snow files cannot be joined case by case because one has places without dates
  and the other dates without places.
- Record a measured contrast finding: an amber palette icon is 2.83:1 on its own wash, a pre-existing
  defect the new widget surfaced in the node library for the first time. The widget uses the Summaries
  group's teal instead, and the amber token is left for a deliberate decision rather than changed as a
  side effect. See [experiment 46](docs/experiments/46-colour-theme.md).

- Implement the sea-level pack's three contracts in the application, since the pack ships no code and
  the application loads none: **Sea-level projection extract** declares an imported long-format table
  as a bounded AR6 extract, requiring the full key of site, scenario, workflow, family, year and
  quantile, metre units, the dataset and version, the baseline period, three obligatory citations and
  which family value includes vertical land motion; **Assign projection site** gives each point its
  nearest published site and keeps the distance, reporting unlocated points rather than dropping them;
  and **Compare level to elevation** compares one fully keyed projected change against a
  practitioner-supplied elevation on a stated datum, refusing to run without the datum, without a
  named elevation attribute, or with a partial key, and treating equality as reaching the elevation.
  The output uses the existing decisions port, so Map, Table and Chart present it unchanged and it
  cannot reach a raster output that would resemble a flood map.
  The pack's vocabulary stays authoritative: the host mints no sea-level term and vendors the pack's
  two TTL files at the digests `widgets/packs.json` pins, which `validate:widgets` now verifies and a
  negative test covers. The pack retires its widget declarations and records each deviation. Three
  deviations were argued before the code, in
  [experiment 58](docs/experiments/58-sea-level-widgets.md): a table input rather than a second CSV
  reader, three inputs for site assignment because a table has no geometry, and the decisions output.
  Validation: 11 new unit checks within 145, 2 Chromium scenarios within 74 with 1 skipped, receipts
  conformant to the pack's own SHACL shapes with a negative case, registry valid at 37 widgets and 69
  releases, catalog 0.2.0 verified at 5 pinned digests. Projections are **imported, never produced**,
  and the worked example here uses synthetic values with the published key structure rather than AR6
  numbers.

- Show widget packs in the catalog, with the admission state, the pinned commit, each required
  review's state and the recorded reason — labelled as decisions read from this build's catalog
  rather than checks performed by the page. The view also states why no pack can be added here:
  nothing is fetched or executed at runtime, and the sea-level pack is declaration-only, carrying
  no widget code. Experiment 49 had excluded admission state on the grounds that a bare badge is an
  unverifiable trust claim; showing it with its basis keeps that objection satisfied while
  answering the question the omission left hanging.

- Show the widget catalog in the application, reachable three ways: **▤ Catalog** in the header,
  **Widget catalog ›** beside the node library, and `?catalog=1` for a direct link. The first
  version had only the library link, at 10px, which was too easy to miss. The header control is
  hidden below 850px because the header measures 395px wide with it at a 390px viewport and 390px
  without, even reduced to its icon, so phone width keeps the labelled library entry instead. The
  dialog, beside the node library, lists every
  compiled definition with its version, release digest, declared ports and independent-check
  outcome, together with the application version, the pack-catalog version and digest, and how
  many widgets have parity evidence. The inspector shows the same identity for the selected node,
  with the measured result of its check. Nothing is fetched and nothing is installable, which the
  dialog states. Adding it tripped the light-theme contrast ratchet at 47 pairs against a baseline
  of 46 — a "not checked" badge at 3.26:1 — which was fixed by differentiating outcomes through
  the foreground only, since an invented light background had left dark mode light-on-light. See
  [experiment 49](docs/experiments/49-catalog-in-the-interface.md).

- Record the curated pack catalog in run provenance. A run asserts `fw:PackCatalog` with the
  catalog version and the SHA-256 of `widgets/packs.json` as built, and every node plan states
  `fw:widgetDefinitionSource "host-registry"`, which the runtime shape requires from a closed
  set. The application still loads no pack — `runtimeFetching: "none"` is an admission rule —
  and that is why the receipt now says so positively instead of being silent, since an absence
  cannot be checked. Recorded metadata only: not a claim that any pack was reviewed, admitted,
  available or used. The identity is generated into `widgets/pack-catalog.json` by the build.
  Validation: 5 new unit checks within 128, 71 Chromium scenarios with 1 skipped, SHACL
  conformant, registry valid at 34 widgets and 66 releases, catalog verified at 8 pinned
  digests. See [experiment 49](docs/experiments/49-catalog-in-the-interface.md).
- Record parity evidence for widget releases in `widgets/parity.json`: which external
  implementation recomputed a release, under what criterion, with what measured result. Release
  files are immutable once committed, so evidence about a release accrues in a separate record
  pinned to a Validation Lab commit. `validate:widgets` checks its shape and registry agreement
  offline; the new `validate:parity` verifies each claim against the Lab's own result file and
  lists the widgets with no evidence. Recorded so far: `reproject` 0.1.0 agrees with pyproj within
  6.70e-5 m, and `clip_raster` 1.0.0 is partial — cell-centre agrees exactly, all-touched differs
  by 2 cells at a pixel-aligned cutline, and the margin case is an unresolved comparison. Also recorded, working through the Spatial
  operations group: `measure_area` 0.1.0 agrees with an independent spherical computation to
  4.8e-14 relative, while the same check quantifies the approximation the widget declares — 0.30 %
  against great-circle edges for an oblique triangle, and +0.45 % to -0.56 % against WGS84 between
  the equator and 60 N; and `mean_center` 0.1.0 agrees with pyproj to 4.1e-10 m. Parity is
  4 of 34 widgets, and the other 30 are printed by name. See
  [experiment 57](docs/experiments/57-parity-evidence.md).
- Make the pack validation report citable. `validate:packs` now records what it validated
  against — host version, registry digest, catalog version and digest, widget count — plus the
  rules it evaluated and, per pack, files verified against files pinned and the state of each
  required review. A review state is a claim; this is the evidence a curator attaches to it. See
  [experiment 56](docs/experiments/56-basis-behind-identity.md).

- Add **Tabular data**, a source widget that imports a long-format CSV: one row
  per observation, with the columns that identify a row declared as keys and one
  column holding the value. The key tuple must be unique, so a wide table or a
  dropped key column is refused by name rather than silently collapsed onto one
  row. A unit is recorded only as the person states it and is never inferred from
  the file; an absent value is kept as unknown and counted, never read as zero.
  The widget claims no geometry: `fw:DataTable` is declared disjoint from
  `fw:PointDataset`, so a table cannot be mistaken for a point set by the
  reasoner. Table output gains a Tabular data mode that displays an imported
  table with its unit stated or marked unstated. Limits: 2,000 rows and 5 MB, the
  same as point input. Validation: 8 new unit checks and 2 Chromium scenarios
  within 123 unit tests and 71 scenarios, SHACL conformance for
  `fw:DataTableShape`, and registry validation at 34 widgets and 66 releases. See
  [the design record](docs/experiments/48-tabular-input.md).

## 0.6.0 — 2026-10-08

- Add a colour theme: light, dark, or following the device, chosen from the
  header and saved on this device. The default follows the device, so a first
  visit matches the operating system, and an explicit choice beats a later device
  change. Every colour the interface used keeps its exact released value in
  light, verified by screenshot at 2,162 differing pixels of 1,760,000, all but
  71 of them the new control itself. Canvas node colours are authored separately
  for dark so the widget roles stay distinguishable. Exported SVG and GeoTIFF
  artifacts are unaffected and stay light. No workflow migration is required.
  Dark meets WCAG AA for every rendered text element, measured: fixing 38 colours
  written as the keyword `white`, which had left panels light in dark mode, and
  adding contrast tokens for text on filled accent and danger surfaces. The
  released light theme has 144 long-standing low-contrast labels which are
  recorded rather than changed, and a check ratchets them so they cannot get
  worse. Validation: 115 unit tests and 69 Chromium scenarios with 1 skipped.
  Colour-vision accessibility, non-text contrast and Firefox or WebKit rendering
  are not established; see [the design record](docs/experiments/46-colour-theme.md).
- Fix a latent defect in the encrypted-project dialog: opening it again before the
  previous one had closed left two elements sharing one id, which is invalid and
  made the dialog ambiguous to find. Opening is now idempotent. This was
  intermittent and predated the theme work.

## 0.5.0 — 2026-10-08

- **Change the All touched clipping rule to match GDAL.** A cell is now included
  only when the clipping boundary covers part of its area or crosses its
  interior. A boundary edge lying exactly on the border between two cells no
  longer pulls in the cell outside it, and the cropped window is no longer
  padded by a fraction of a pixel. Measured cell by cell against rasterio 1.5.2
  with GDAL 3.12.2, differences over a deliberately pixel-aligned cutline fall
  from 35 cells to 2, and the window now agrees; the residual 2 cells come from
  GDAL burning cells along a cutline vertex lying exactly on a cell border,
  which is an artifact of its line rasterizer rather than a stateable rule.
  **Migration:** re-running a saved All touched clip can retain fewer boundary
  cells, so a total derived from one can change. Cell center inside is
  unaffected. `clip_raster` is released as 1.0.0 with that effect recorded.
- Validation: strict TypeScript, production build, **112 unit tests**, ontology
  SHACL conformance, widget-registry validation at 33 widgets and 64 releases,
  and **63 Chromium scenarios with 1 skipped** (the local WorldPop raster, which
  is not bundled). Independent recomputation in the Validation Lab confirms
  reprojection against pyproj and cell-centre clipping against GDAL, and records
  a 2-cell residual on all-touched. **Not established:** scientific suitability,
  privacy effectiveness, cartographic suitability, or Firefox and WebKit
  behaviour. A first WebKit run passed 31 of 64 scenarios, with 21 of the
  failures attributable to the test harness rather than the application and the
  remainder untriaged.
- Record the inclusion rule and the outer margin in N3 evidence as
  `fw:rasterMaskConvention` and `fw:rasterMaskMarginPixels`, constrained by
  SHACL. Receipts previously stated only a method name, so two clips made under
  different rules, or with different margins, were indistinguishable in their
  evidence. Receipts exported before this change carry no convention and were
  produced by the earlier, more inclusive rule.
- Add a **Reproject input** source widget that imports a local CSV or GeoJSON in
  WGS84 UTM metres and converts it to CRS84 longitude/latitude, so projected
  files can reach the existing point widgets for the first time. The conversion
  runs once on import and replays offline; the output is the ordinary CRS84
  points contract, so no downstream widget changes.
- Record the declared source EPSG code, exact proj4 definition, axis order,
  units, operation, library version, converted and unconverted counts, maximum
  round-trip error and an explicit `datumShift: none` with the imported points.
- Admit WGS84 UTM zones only. A file on another datum needs a datum shift this
  prototype does not implement, and is refused rather than approximated.
  Coordinates outside the UTM easting/northing ranges, points outside the
  declared zone's validity guard and round-trip disagreements above 0.01 m are
  refused with an explanation.
- No workflow migration is required; existing saved projects are unaffected.
- Validation of this work in progress: strict TypeScript, production build, 111 unit tests, ontology and
  widget-registry checks (33 widgets, 63 releases) and 63 Chromium scenarios
  with 1 skipped. Unit checks assert UTM definitional invariants, round-trip
  tolerance and guard refusals. **Not established:** agreement with PROJ or
  GDAL to a stated tolerance, any datum other than WGS84, that a declared zone
  or hemisphere is the correct one for a given file, or Firefox and WebKit
  behavior. Raster warping is specified in
  [experiment 40](docs/experiments/40-reprojection-primitives.md) but not built;
  `raster_input` keeps its no-resampling contract.

## 0.4.0 — 2026-10-07

- Make Map outputs standalone communication views with configurable title,
  subtitle, visible map key, source/method note and local SVG export. Interactive
  polygon maps can choose no basemap, OpenStreetMap streets or OpenTopoMap
  terrain; online tiles are requested only for the current view and are absent
  from the SVG. Record the bounded map plan in N3 and validate it with SHACL.
  Existing saved maps default to local geometry; no migration is required.
  Validation covers structural evidence and Chromium interaction, not
  cartographic suitability or the correctness of source citations.

- Add an opt-in, locally bundled Vega-Lite Chart enhancement for the existing
  categorical counts: bar or dot marks, orientation, title, subtitle, axis
  labels, optional color legend, source note, SVG export,
  an underlying values table and an inspectable specification. Classic bars
  remain the default for saved workflows; no migration is required.
- Record the bounded chart specification in N3 and validate its structure with
  SHACL. This does not establish scientific correctness, chart suitability or
  practitioner comprehension. Local browser and cross-browser validation are
  recorded in [the spike note](docs/experiments/37-vega-lite-chart-spike.md).
- No saved-workflow migration is required. The release build passed 101 unit
  tests, ontology and widget validation, and a Chromium desktop/narrow-screen
  version check. Scientific suitability and Firefox/WebKit behavior remain
  unverified for this release.

## 0.3.0 — 2026-10-07

- Add a collapsible widget library and full-screen workbench and Results views,
  with Escape to restore the normal layout. No workflow migration is required.
- Add a John Snow geoprivacy experiment with configurable donut displacement,
  H3 cell aggregation, private before views, derived after maps/tables, and demo
  GeoJSON downloads. Compare original and moved locations in side-by-side maps
  with mean centers and pump context. The notebook map-encryption transform and contextual hide
  operation remain planned. No workflow migration is required.
- Expose Mean center as a reusable processing widget on both original and moved
  branches; Compare point sets consumes their typed outputs and verifies source
  identity, CRS, and counts. Existing saved comparisons retain their earlier
  three-input behavior.
- Local validation passed 99 unit tests and 60 Chromium browser scenarios,
  including the Botswana WorldPop GeoTIFF, desktop and narrow-screen version
  badge, positive and negative SHACL cases, and N3/evidence inspection.
  Privacy effectiveness and Firefox/WebKit behavior are not established.

## 0.2.0 — 2026-10-07

- Display the application version next to the Fieldwork mark, sourced from the
  root package version.
- Establish a versioning policy that distinguishes application releases from
  widget, ontology, workflow schema, and project revision versions.
- Add this release-note record.
- No workflow migration is required. The local build, widget and ontology checks,
  and a desktop/narrow-screen browser check passed. Broader browser regression
  runs are part of the publication pipelines.

## 0.1.0 — 2026-10-07

- Publish the browser-based visual GIS prototype to GitLab Pages and replicate
  the same source commit to GitHub Pages.
- Add shared study-area, point, raster, network, catchment, map, table, and chart
  workflow primitives, including the Old Naledi and John Snow worked examples.
- Export N3 and provenance evidence, validate runtime RDF with SHACL development
  checks, and package local projects with their binary reference assets.
- Validate the release with 94 unit tests and 57 distinct Chromium scenarios.
  Firefox, WebKit, and scientific outcome validation remain open.
