# Mean center

_Created 2026-11-22 · Updated 2026-11-28_

**A spatial operation.** It takes points and gives back one point: their average position, each point counted once or
in proportion to a number it carries.

## What it does

Each point is projected to metres in the UTM zone you choose, the positions are averaged, and the average is returned as
longitude and latitude. With a weight, a point carrying 5 deaths counts five times as much as a point carrying 1: 250
addresses carrying 489 deaths have two different centres.

## What you connect

| Port | What goes there |
| --- | --- |
| **points** | the points to find the centre of |

Out comes one point. **Compare point sets** reads two of them to say how far a centre moved.

## How to use it

1. Connect the points.
2. In **Configure…**, choose a number to weight by, if any. The numeric columns of the arriving points are offered.
3. Check the UTM zone. The dialog says which zone this workflow's coordinates suggest.
4. Run. The Result gives the centre, the points used and, when weighted, the total weight.

## What it will not do

- **It does not read a missing weight as 0.** Records without a usable number are counted, and the run is refused with
  how many there are. Points moved by **Move points in a donut** carry no attributes, so they cannot be weighted.
- **It is not a place anyone was.** A centre can fall between houses, or in a river.
- **It does not measure spread.** Two very different patterns can share a centre.

## How it was checked

The lab's [mean centre notebook](https://digital-twin-ph.github.io/validation-lab/lab/index.html?path=06-mean-center-vs-pyproj.ipynb) recomputes the centre with pyproj.

## History

### 2026-11-28 · The Preview draws the centre, and follows the weight chosen (0.6.0)

**Configure…**'s Preview draws the points and the centre the step passes on over them. It had given only the
centre's coordinates. It also ignored the weight being chosen, and showed the saved one; with DEATHS chosen in the
Snow geoprivacy example it now says *weighted by DEATHS totalling 489*. The hint under the weight was about Snow's
data; it now says what a weight does.

### 2026-11-23 · Show me how (0.4.0)

**Configure…** offers **Show me how it works**: four made-up houses: the centre with each counted once, the centre counted by the weight, and the point the step makes as set.

### 2026-11-22 · On the standard (0.3.0)

Moved to the standard Inspector: the weight, chosen from the arriving points' columns, and the UTM zone are in
**Configure…**; the Result gives the centre and the points used.
