# Measure distance

_Created 2026-11-09 · Updated 2026-11-26_

**For each point, the nearest of a set of candidates, and how far it is.** Each facility's nearest tide gauge; each
sampled location's nearest clinic.

## What it does

It measures the straight-line distance from every point to every candidate and keeps the nearest, on a sphere of
6,371.0088 km (Haversine). It gives one row per point: the point, its nearest candidate, and the distance.

## What you connect

- **Points to measure from**: any point layer.
- **Candidates, the nearest of which is found**: any point layer.

A step that reads a table, such as **Relate**, **Select rows** or **Table**, reads the result as a table with these
columns:

| Column | Holds |
| --- | --- |
| `point_id` | The point |
| `nearest_id` | Its nearest candidate |
| `nearest_<attribute>` | Each of that candidate's own attributes: `nearest_name`, `nearest_site_id` |
| `distance` | The distance, in the unit chosen |

So **Relate** can bring a value that belongs to the candidate onto each point: the sea-level example matches
`nearest_site_id` to the projections' `site_id`.

## How to use it

The step's panel holds its **Name**, its two inputs, one sentence saying what it measures, and **Configure…**:

| Setting | What it decides |
| --- | --- |
| **Distances in** | kilometres or metres |
| **Eligible candidates** | Conditions on a candidate's own attribute: its value is, or is not, one of those you list. A candidate without the attribute does not match |

## What it will not do

- **It will not follow roads or water.** A straight-line distance is not a travel distance.
- **It will not say a point belongs to its nearest candidate.** Nearest is a fact about distance; what it means is yours
  to state.
- **A point with no location keeps its row**, with no nearest candidate and no distance, so it is counted.

## Where it is used

The sea-level example (each facility's nearest tide gauge).

## History

### 2026-11-28 · The Preview draws each point to its nearest candidate (0.8.0)

**Configure…**'s Preview draws a line from each point to the candidate it would be measured to, the candidates the
conditions keep strong and the others faint, so a condition is seen moving the lines. It had given only the counts
and distances.

### 2026-11-26 · Its code out of app.ts (0.7.1)

The Inspector, its sentence and Configure… moved into `src/distance-ui.ts`. Nothing they show or do changed.

### 2026-11-25 · The Preview counts the candidates a condition keeps (0.7.0)

The conditions are the setting on the screen, and the one number they exist to change — how many candidates survive
them — could be seen only by running the workflow and reading the receipt. The Preview named the conditions back.

It now runs this step's own search, so the eligible count moves as a condition is typed, beside the nearest, median and
furthest distance. Points left with no distance are counted: a condition that keeps nothing leaves every point without
one, which a table of distances shows only as a column of gaps.
