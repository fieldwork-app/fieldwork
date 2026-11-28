# Aggregate points to H3 cells

_Created 2026-11-22 · Updated 2026-11-26_

**A geoprivacy teaching step.** It takes points and gives back hexagonal cells, each carrying how many of the points
fall in it, leaving out any cell with fewer than a stated number.

## What it does

Each point is placed in its cell of the H3 grid, a fixed worldwide grid of hexagons, at the resolution you choose. Cells
are counted, and a cell holding fewer points than the minimum is left out, so no released cell points at one or two
households. A resolution 9 cell is about 0.1 km²; a resolution 7 cell about 5 km².

## What you connect

| Port | What goes there |
| --- | --- |
| **points** | the points to count |

Out come the cells, each with its count. Draw them on a Map.

## How to use it

1. Connect the points.
2. In **Configure…**, choose the resolution (0 coarsest, 15 finest) and the fewest points a cell must hold.
3. Run. The Result says how many cells were kept.

## What it will not do

- **It counts locations, not what they carry.** 250 addresses carrying 489 deaths give counts that add to 250.
- **It does not make data safe to share.** A cell with many points can still identify someone, and the points it leaves
  out are still in the project.
- **It does not choose the resolution.** Coarser cells hide more and show less.

## How it was checked

The lab's [hex notebook](https://digital-twin-ph.github.io/validation-lab/lab/index.html?path=21-hex-vs-h3py.ipynb) recounts the cells with h3-py.

## History

### 2026-11-28 · The Preview draws the cells (0.8.0)

**Configure…**'s Preview draws the cells it would keep, shaded by their count on the scale Map uses, and the points
in the cells it leaves out, faint. It had given only the counts. It reads the whole layer where the source holds one,
where it had read the first 500.

### 2026-11-26 · Map shades the cells by their count (0.7.0)

Each cell carries its count of points, and Map shades and keys the cells by it, as **Points in the cell**, instead of
drawing every released cell in one blue. Show me how ends on the same classes and ranges.

### 2026-11-26 · Show me how ends on the scale (0.6.0)

The last step colours each cell by the same classes Map uses for its count of homes, with a key giving each colour's
range, where it was shaded with no key.

### 2026-11-23 · Show me how (0.4.0)

**Configure…** offers **Show me how it works**: six made-up homes in three H3 cells at the resolution set: the cells left out for holding too few, and the cells the step makes with their counts.

### 2026-11-22 · On the standard (0.3.0)

Moved to the standard Inspector: the resolution and the minimum count are in **Configure…**, and the sentence says it
is a teaching step, not a privacy guarantee.
