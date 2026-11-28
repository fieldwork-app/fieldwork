# Clip polygons

_Created 2026-11-20 · Updated 2026-11-27_

**Polygons cut to the study area.** Catchments or districts that spill past the reporting area, kept only where
they fall inside it.

## What it does

It cuts each polygon to the study area. A polygon wholly inside is kept as it is; one across the study area's edge is
cut along the edge, and only the part inside is kept; one outside is left out. What each polygon carries is kept with
the part that remains.

## What you connect

| Input | What it takes |
| --- | --- |
| **Study area** | the area to clip to |
| **Polygons** | the polygons to clip |

## How to use it

Connect both inputs; there is nothing to set, and **Configure…** says so. **Show me how it works**, in that dialog, clips
three made-up units, one inside, one across the edge and one outside, step by step.

**Result** gives how many polygons the last run kept.

## What it will not do

- **It will not keep a polygon outside the study area**, even one that touches its edge at a single point.
- **It will not recompute what a polygon carries.** A count or a population stays the whole polygon's, though only
  part of it is kept: a step after this one that needs the part's share must compute it.
- **It will not change the study area.**
- **It does not cut on a projection.** Edges are cut as straight lines in longitude and latitude, which is close
  enough for a district and not for an area spanning hundreds of kilometres.

## Where it is used

The John Snow examples clip their pump catchments to the illustrative Soho reporting rectangle.

## History

### 2026-11-27 · The Preview tells bands apart (0.7.0)

Where the polygons are walking-time bands, the Preview shades each in its own colour, matplotlib's tab10 as NB04 draws them, see-through and keyed, the longest drawn first so the shorter show. The cut keeps each band's minutes. On Snow's isochrone the four bands had been one fill.

### 2026-11-27 · The Preview draws the cut (0.6.0)

**Configure…**'s Preview draws the cut: the study area dashed, each polygon as it arrives in grey, and what the cut keeps filled, as **Show me how** draws, with the counts and areas beneath.

### 2026-11-21 · Configure…, with Show me how (0.3.0)

**Configure…** says there is nothing to set and holds **Show me how it works**, which was in the panel; its drawing,
all black, now shows each shape as its key says.
