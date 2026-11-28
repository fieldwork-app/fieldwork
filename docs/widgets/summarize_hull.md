# Observed extent (convex hull)

_Created 2026-10-14 · Updated 2026-11-23_

**A process widget.** It takes points and gives back one polygon: the smallest convex outline
that contains them, with the area it encloses.

## What it does

Stretch an elastic band around all your points and let it go. The shape it settles into is the
convex hull — the outline of where your observations are, with no dents.

Along with the shape you get two measurements the rest of your workflow can read: the **area**
it encloses, in square metres, and its **span**, the distance across its longest axis.

## What you connect

| Connect | What it needs |
| --- | --- |
| a point layer | at least three points that have locations |

Out comes one polygon. Connect it to a Map to see it, a Table to read its numbers, or a
Ruleset to make a judgement about its size.

## How to use it

1. **Add it** from the palette, under Summaries.
2. **Connect a point layer.** Points without a location sit the step out, and the notes say
   how many took part.
3. **Check the zone, in Configure….** The widget measures in metres, so it projects your points
   first, and the UTM zone it uses is part of the answer. The dialog suggests the zone that fits
   your data and says what the chosen one stretches; Settings says so when they disagree.
4. **Run the workflow**, then read the area on the output or draw the outline on a map.

## Worked examples that use it

| Example | What it does there |
| --- | --- |
| **John Snow: how far did it spread?** | outlines the 250 death locations: 0.139 km², 498 m at its widest |

## What it will not do

- **It will not follow the shape of your data.** A hull is convex, and cases along a river or
  facilities along a coast are not. The outline fills in the space between them, so it claims
  ground where nothing was observed. If that matters, do not use a hull.
- **It is not a boundary.** It is an outline of what was *seen* — not a service area, not a
  catchment, not anything anyone agreed to. Where your observation stopped is not where the
  thing you were observing stopped.
- **Three points in a line enclose nothing**, and the widget refuses rather than returning an
  area of zero.
- **Watch the span against the area.** A hull much longer than it is wide is close to a line
  and should be read as one. The widget says so in its notes when it happens.

## Checking it yourself

The lab's [hull notebook](https://digital-twin-ph.github.io/validation-lab/lab/index.html?path=10-hull-vs-shapely.ipynb)
recomputes the outline and the area with Shapely and compares them to this widget's.

## History

### 2026-11-28 · The Preview draws the outline (0.5.0)

**Configure…**'s Preview draws the outline it measures, filled, with the points over it, as **Show me how** ends.
It had given only the area and how many points the outline passes through.

### 2026-11-23 · Show me how (0.3.0)

**Configure…** offers **Show me how it works**: six made-up cases: the band caught on the outermost, the one inside that does not shape it, and the outline the step makes with its area and widest span.

### 2026-11-22 · On the standard (0.2.0)

Moved to the standard Inspector: name, inputs, one sentence, and the area and span of the last run. The UTM zone is in
**Configure…**, with the zone the data suggests; Settings says when the two disagree.
