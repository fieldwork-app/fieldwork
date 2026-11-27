# Voronoi catchments

_Created 2026-11-22 · Updated 2026-11-27_

**A spatial operation.** It takes a study area and a set of sites, and gives back one polygon per site: the part of
the area closer to that site than to any other, in a straight line.

## What it does

Every place in the study area goes to its nearest site. The lines between catchments fall halfway between two sites,
at right angles to the line joining them. John Snow's eight pumps, divided this way, give each pump the streets nearest
to it.

It measures in metres, in the UTM zone you choose, so "nearest" is a true ground distance and not a difference of
degrees.

## When it is the right question

A straight-line catchment is a **baseline**: who would use a site if everyone went to the nearest one and could walk
straight to it. It is quick, it needs nothing but the sites, and it is easy to explain. Compare it with a travel-time
catchment from **Network isochrone**: where the two differ, roads, rivers and slopes are deciding who reaches what.

## What you connect

| Port | What goes there |
| --- | --- |
| **area** | the study area to divide |
| **sites** | the sites: pumps, clinics, schools, up to 100 |

Out come polygons, one per site. Count cases into them with **Summarize points to polygons**, and draw them on a Map.

## How to use it

1. Connect the study area and the sites.
2. In **Configure…**, check the UTM zone. The dialog says which zone this workflow's coordinates suggest, and how far
   the chosen one stretches distances here. Settings says so too when the two disagree.
3. Run. The Result says how many catchments were drawn.

## What it will not do

- **It does not know about travel.** Roads, rivers, hills, fees and opening hours are ignored. People often do not use
  the nearest site, and a catchment says who is nearest, not who goes.
- **It does not follow the study area's outline.** The catchments fill a rectangle 100 m beyond the area's bounds;
  connect **Clip polygons** to cut them to the outline.
- **It does not take two sites at the same place.** Merge them first; the run says which.
- **It does not divide a large area.** The area must be under 50 km across.

## How it was checked

The lab's [Voronoi notebook](https://digital-twin-ph.github.io/validation-lab/lab/index.html?path=15-voronoi-vs-shapely.ipynb) rebuilds the catchments with Shapely and compares them
to this widget's.

## History

### 2026-11-27 · The Preview draws the catchments (0.8.0)

**Configure…**'s Preview draws the catchments it counts: one fill, the study area dashed, the sites as points, as
**Show me how** draws them, with their number and sizes beneath. It had given only the number and sizes.

### 2026-11-27 · No house in Show me how (0.7.0)

**Show me how** no longer follows a house to its nearest pump. The step is given pumps and an area; houses are put into its cells by Summarize points to polygons. The 0.5.0 entry below says this step had gone; it had not, and was removed now. Four steps: the area and the pumps, two pumps and the line between them, the third pump and where the lines meet, and the cells.

### 2026-11-26 · Catchments in one fill (0.6.0)

The last step shaded the catchments from light to dark, as if one were more than another. They carry no value, so they
are now one fill, told apart by the lines between them.

### 2026-11-25 · Show me how builds the division up (0.5.0)

It used to follow one house to its nearest pump, and then show every dividing line and every finished cell at once —
so the part worth watching happened between two steps.

Now you see two pumps and the single line between them: everywhere on one side is nearer one pump, everywhere on the
other side the other, and the line is where they are equally near. Then the third pump joins, each pair gets its
line, and the lines meet at the corner where three catchments touch.

### 2026-11-23 · Show me how (0.3.0)

**Configure…** offers **Show me how it works**: three made-up pumps in a study area: a house going to the nearest, the lines where two are equally near, and the cells the step makes, which fill the box around the area.

### 2026-11-22 · On the standard (0.2.0)

Moved to the standard Inspector: name, inputs, one sentence of what it allocates, the UTM zone in **Configure…** with
the zone the data suggests, and the number of catchments drawn.
