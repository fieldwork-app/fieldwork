# Table

_Created 2026-10-27 · Updated 2026-11-27_

## What it does

Shows what you connect to it, as a table in its own Results tab.

It takes four different things, and it works out which it is showing from what you wire:

- a **keyed table** from any step that produces one — Relate a column, Total within groups, a rate,
  a two-by-two, an imported table;
- **point data**, with coordinates and attributes: longitude and latitude as recorded, or easting and northing in
  metres in a UTM zone you choose;
- **a polygon layer**: catchments, districts, clusters, with what each carries.

A polygon layer is shown as a plain table, whichever input it arrives at: one row per polygon, its id, its name and
its attributes, with what the step that made it says of each (a catchment's locations and totals, a band's minutes, a
rule's conclusion, an area). There are no coordinate columns: a table has no geometry, and a polygon's shape stays on
the map. Where coordinates for a polygon are wanted, a step that says what it computed has to supply them.

## What you connect

The node shows what is connected to it and one port, **+ Add an input**, as Map does. Drop any result a table can
show on it, or choose one under **Inputs › Add an input**, and it is connected to the port its kind belongs to. There
is nothing to choose first. Each connected input then shows its kind's symbol and the name of the step it came from.

Connect a step's output and the table shows it. If you wire more than one,
the more specific wins: a keyed table before polygons, and the point path is the general one.

## How to use it

1. Add it, or use **Quick Look** on a step and open its table from there.
2. Drag from the step's output to **+ Add an input**, or choose it under **Inputs › Add an input**.
3. Name the Results tab.

The step's panel holds its **Name** and where it goes in the write-up, its **Inputs**, one sentence saying what it
shows, **Configure…**, and what the last run showed.

| In Configure… | When it is offered |
| --- | --- |
| **Show totals: these values count the same thing** | A keyed table that states no unit. Tick it only where every cell counts the same thing; the figure says you asserted it |
| **Coordinates**: longitude and latitude, or in metres in a UTM zone | Point data. The dialog suggests the zone that fits the workflow's coordinates and says how far the chosen one stretches distances. Points read from a UTM file are shown as they are |

Nothing is required. A table with nothing connected is **unfinished**, not broken, and says so.

A column that holds a number, such as a projection Relate brought beside each row, is always drawn as a column with
its own heading, even where every row holds the same number.

### Presentation

Every table follows the rules the table standards agree on: numbers right-aligned under right-aligned headings, in
equal-width digits; a rule above, one under the headings and one below, none down the side; totals set off by a rule.
In **Configure…**, under **Presentation**:

- **Title**: what, where and when, shown above the table. The Table's name when left empty.
- **Decimal places for the values**: the same in every row. Names, identifiers and coordinates keep their own.
- **Thousands separators** (1,234), never on a column read as years.
- **An absent value is written**: a dash, read aloud as "no value"; the word *unknown*; or left blank.
- **Shade every other row**, to follow a row across a wide table.
- **Notes** and **Source**, shown below the table.
- **Each column**: its decimal places, over the table's; its **unit or denominator**, written once in its heading,
  "Rate (per 100,000)" (the column's unit from **Columns…** when none is set here); a **note**, marked "[note 1]" in the
  heading and written below the table, so a screen reader reads it where a superscript letter would be skipped; and,
  for a column of counts, **its percentage in the same cell**, "120 (34.5)", rather than in a column of its own.
- **Small counts not shown**: in the columns you tick, a count from 1 up to the number you set is written [c], for
  confidentiality, or [u], too few to be reliable. Zero is still shown, and a note below the table says which counts
  are hidden and why. The table's values are not changed.

The write-up and the printed draft show the table with these same settings. A table attached to a draft as CSV keeps
one value a cell, with full precision, and hides the same small counts.

The **Preview** shows ten rows, or twenty, or all of them to review, as these settings write them.

### It states its own shape in the write-up

Every run machines a note into **Results** on the Notes tab stating what this table is made of. It names the columns as the table spells them, says how many rows, reports empty cells as unknown rather than zero, and names the source file and digest where the table came in as a file. Not for the point and decision views, which are not published tables.

Column names are shown as they are, in `code`, rather than bent into a sentence. A generator cannot tell whether `measure` or `group` is a noun, so it states them and leaves the prose to you.

**The caption is yours.** A caption states the subject, the population, the place and the period
in your words, and none of that can be read off a table. What this writes is what the table
declares about itself — the material you write the caption from, sitting beside it in the same
section.

**And it carries no number.** A figure's number depends on where it sits in the write-up and on
the venue you are preparing — set one figure aside and the ones after it move up — so the number
is worked out when the document is rendered. Nothing here says "Figure 1".

Edit it and it forks into a note of your own, like any machined note; the machined one goes on
being rewritten by every run.

### Where it goes in the write-up

**In the write-up, under**, just below **Results tab name** in the panel, chooses the part of the Notes write-up this output's figure and its note go in:
Introduction, Methods, Results or Discussion. **Results** is the default. A map of the study area belongs in the
Introduction; a figure that shows how the analysis was done can go in Methods. References is not offered, because it
holds works and not figures. The run's receipt states the section and whether you chose it, and a validation rule
checks that the note describing the figure is filed in that same section.

**Not in the write-up**, the last choice, keeps the figure in Results and out of Notes and the publication: the run writes no note for it, and its receipt says it was left out. Hagelloch's day-by-day map is left out this way.

## What it will not do

- **It will not ask you what shape your data is.** There is no mode to set, and connecting
  something never removes a connection you already made. **Map** works the same way.
- **It will not chart the table.** Charting one means choosing which key varies and whether to
  aggregate, which is a decision rather than a port. Use **Chart**.
- **It will not total anything you have not said can be added.** Margins appear only with **Show totals**. To total
  rows into groups, use **Total within groups**.

## Where it is used

The South London example, five times: the mortality rate table, both water-company tables and both
contingency tables.

## How it was checked

Unit tests over the port list, the renderer the connections imply, and the fallback to a stored
mode for a workflow saved before the mode was removed. One pins the defect directly: a freshly
added table offers a `table` port with no mode set.

What no test establishes is whether the four renderers should be one widget at all. The split is
inherited and is recorded as open in
[experiment 21](../experiments/21-shared-result-outputs.md).

## History

### 2026-11-28 · Each column, small counts, and the write-up to the same standard (0.16.0)

What the table standards leave to the author, column by column, set in **Configure…**: decimal places, a unit or
denominator in the heading, a note numbered "[note 1]" (the UK Analysis Function's way, read aloud where a superscript
is not), and a count with its percentage in one cell. **Small counts not shown** hides a count from 1 up to a threshold
as [c] or [u], and says so below the table: thresholds differ by agency (CDC WONDER under 10, United States Cancer
Statistics under 16), so it is declared, never assumed.

The write-up and the printed draft draw the table as Results does. They had drawn their own cells and read none of the
Presentation. A draft's attached CSV hides the same small counts, so what the page withholds is not handed on beside
it. Results' point table had written every number as text before presenting it, so its decimal places were never
applied; they are now.

A count and its percentage share a cell in a wide table and in the write-up; a table of points or of polygon summaries
keeps them in two cells.

### 2026-11-27 · One blank port; the coverage port removed; a preview in Configure… (0.15.0)

**Configure…** shows the table itself: ten rows, or twenty, or all of them to review, with the coordinates as the dialog
sets them, before Apply. A polygon table shows its areas from the last run, wide, as Results does.

**Presentation**, a new section of Configure…: a title, decimal places, thousands separators, how an absent value is
written, shading every other row, notes and source. Every table now follows the rules the standards agree on, read from the open
guidance in [the research note](../research/table-presentation-standards-2026-11-27.md). An absent value is a dash by
default, not a word a reader could take for data (2026-10-21). Coordinates show to one precision down their column.

The node shows each connected input as its kind's symbol and the name of the step it came from, and one blank port,
**+ Add an input**, while something on the canvas could add another. The **Or: Coverage result** port is gone: nothing
makes a coverage check since Check spatial coverage retired on 2026-10-21, and a workflow saved with one opens with
Keep points inside the area feeding the points port instead.

### 2026-11-22 · Coordinates in metres (0.14.0)

**Configure…** offers point data's coordinates in metres, as easting and northing in a UTM zone, with the zone the
workflow's coordinates suggest. This was the one job of **Reproject points**, which retired into it: nothing computed
with its points, and every step that measures projects for itself. The table's receipt states the frame.

### 2026-11-22 · Moved out of the application's main file (0.13.2)

Its Inspector and its Configure… moved into a module of their own, unchanged. Nothing it does changed.
The older **Input mode** choice, from before what is connected decided how a table is shown, is retired: a table of
polygons is shown by the standard Inspector as any table is.

### 2026-11-19 · No 2,000-record ceiling (0.13.0)

A table of points refused more than 2,000 records across its point inputs. That ceiling is gone; Point data's own
limit, 250,000, is the one that applies. A table of 250,000 points ran in 10 s and was shown in 5.5 s (Chromium,
development Mac, `tests/measure-point-count.browser.mjs`).

### 2026-11-19 · Long tables shown 200 rows at a time (0.13.1)

A table shown as rows by subject, or as a cross-tabulation, drew every row: 25,000 rows were 325,971 elements on the
page. It now shows 200 at a time, with Previous and Next; totals still count every row.

