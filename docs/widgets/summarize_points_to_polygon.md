# Summarize points to polygons

_Created 2026-11-22 · Updated 2026-11-27_

**A summary.** It takes polygons and points, and gives back the same polygons, each carrying how many of the points
fall in it and, where you name one, the total of a number they carry.

## What it does

Each point is tested against each polygon's outline, the same test Keep points inside the area and the map use. Each
polygon gets a **count** of the points in it and, with a number chosen, a **total** of that number: 250 death locations
and their deaths, counted into eight catchments, is John Snow's.

- A point **on an edge** is counted in every polygon it touches, or in none, as you choose. Where two polygons share an
  edge, counted in both, it is said as counted twice.
- A point **in no polygon** is counted apart, as outside every one.
- A point with **no location** is counted apart.
- A point with **no value**, or one that is not a number, is still counted as a point; its value is counted apart,
  never as 0.

## What you connect

| Port | What goes there |
| --- | --- |
| **polygons** | the polygons to count in: catchments, districts, a layer of study areas' parts |
| **points** | the points to count |

## How to use it

1. Connect the polygons and the points.
2. In **Configure…**, choose what happens to a point on an edge, and a number to add up, if any.
3. **Show me how it works** shows both choices on two made-up units sharing an edge.
4. Run. Each polygon carries its count and total; the step's sentence says how many points fell outside every polygon,
   how many had no location and how many had no value.

## What it will not do

- It does not move a point to the nearest polygon. A point outside every polygon is counted as outside.
- It does not divide a count by anything. A rate needs its denominator, from **Rate**.
- It does not measure on a map projection: points and polygons are compared in longitude and latitude.

## How it was checked

The Validation Lab's check 14 recomputes every polygon's count and total with Shapely: exact over 250 locations in 8
polygons, release 0.2.0.

## History

### 2026-11-27 · The Preview draws, with the numbers it adds up (0.8.0)

**Configure…**'s Preview draws the polygons shaded by what each is given, on the scale Map uses and with its key, and
draws faint any point that falls in none. It had only counted.

Drawing it found a fault the count had hidden: the Preview read each point's name and location and not its other
values, so a number to add up was missing from every point and every total came to nothing. It now reads the points
whole, as the run does.

### 2026-11-26 · Map shades the polygons by what was counted (0.7.0)

Each polygon carries the total of the chosen field, or the count of points where none is chosen, and Map shades and
keys the polygons by it, as **Total** and the field's name, or **Points inside**. Before, Map drew each unit in a
colour of its own, keyed by its name. Show me how ends on the same classes, colours and ranges Map draws for its
made-up output, and its labels stay inside the drawing, measured once drawn.

### 2026-11-26 · Show me how ends on the scale (0.6.0)

The last step shaded North and South by how dark one green was, and nothing said what a shade meant. Now each unit
takes its colour from the same classes Map uses for the totals, and a key below the drawing gives each colour's
range. A house the step has set aside is drawn without its label, so the house the step is about can be read.

### 2026-11-22 · On the standard, with Show me how (0.3.0)

Its settings moved into **Configure…**, with the arriving points' numeric columns offered for the total, and **Show me
how it works** added. Its Inspector is the standard one: name, inputs, one sentence, and what the last run said.
