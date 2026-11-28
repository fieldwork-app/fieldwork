# Compare point sets

_Created 2026-11-20 · Updated 2026-11-20_

**A process widget.** It takes a set of points and the same points moved, and gives back a table of distances: how far
the mean centre moved, how far each mean centre is from its nearest reference point, and how far a point moved.

## What it does

A mask that moves each location, such as donut geomasking, is meant to hide where people were without changing what
the map says. This step measures what the move did to the pattern as a whole: whether the centre of the points moved,
and whether it moved nearer to or further from a reference such as a pump.

## What you connect

| Connect | What it needs |
| --- | --- |
| **Original points** | the points before they were moved |
| **Moved points** | the same points after, as many and in the same order |
| **Pumps, for reference** | the reference points each mean centre is measured to |
| **Original mean centre** and **Moved mean centre** | optional: a Mean center step on each set, in the same UTM zone |

Out comes a table, one row per measure, in metres. Connect it to a Table to read it. Connect the points and the mean
centres to a Map to see them: a Mean center is drawn as one point, named by its step.

## How to use it

1. **Connect** the original points, the moved points and the pumps, and, if you want them, a Mean center on each set.
2. **Configure…** sets the UTM zone the distances are measured in: the zone the points lie in. Each Mean center step
   connected must use the same zone. Its Preview draws the two mean centres, the line between them and the pumps.
3. **Run the workflow.** The panel's Result says how far the mean centre moved.

## What it will not do

- **It keeps the original locations.** The comparison, and the Map and Table made from it, hold the original
  coordinates, and pairing each point with its moved copy is exactly what the mask exists to break. They are for
  teaching, not for sharing.
- **A centre that barely moves does not establish privacy**, nor that each location is still accurate.
- **The pumps give geographic context.** They do not establish that anyone used a pump.

## Worked examples that use it

| Example | What it does there |
| --- | --- |
| **John Snow: can the locations be shared safely?** | measures what donut geomasking did to the 250 death locations |

## History

### 2026-11-28 · A Preview, drawn (0.4.0)

**Configure…** had no Preview. It now runs the comparison on the points connected and draws the two mean centres, the
line between them and the pumps, with how far the centre moved, each centre's nearest pump and how far the points
moved. Where two Mean center steps are connected, each centre is computed with that step's own settings.

### 2026-11-20 · A table of distances (0.3.0)

It hands on a table of what it found, in place of the comparison Comparison map drew, which retired into Map and a
Table. Its panel moves to the standard, with the UTM zone in Configure… and how far the mean centre moved as its
Result.
