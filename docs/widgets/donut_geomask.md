# Move points in a donut

_Created 2026-11-22 · Updated 2026-11-23_

**A geoprivacy teaching step.** It takes points and gives back the same number of points, each moved a random distance
in a random direction, between a least and a most distance from where it was.

## What it does

Each point is moved somewhere in a ring, a "donut", around its true position: never less than the least distance, so
no point stays where it was, and never more than the most, so the pattern stays readable. Each moved point gets a new
name and id, and nothing else of the record is carried.

The **seed** makes the moves repeatable: the same seed moves the same points the same way.

## What you connect

| Port | What goes there |
| --- | --- |
| **points** | the points to move |

Out come the moved points. Compare them with the originals with **Mean center** and **Compare point sets** to see what
the move cost.

## How to use it

1. Connect the points.
2. In **Configure…**, set the least and most distance in metres (up to 5,000) and the seed.
3. Run, and compare the moved points with the originals.

## What it will not do

- **It does not make data safe to share.** Whether a mask protects anyone depends on the population around each point,
  and that is not calculated here. The seed is predictable, so anyone with it can repeat the moves.
- **It does not keep attributes.** A moved point has a new name and id only, so it cannot be weighted afterwards.
- **It does not remove the original.** The source stays in the project and in the run's evidence.

## How it was checked

No lab notebook checks it yet. The browser test asserts that every point moved within the stated ring.

## History

### 2026-11-28 · The Preview draws where the points move (0.5.0)

**Configure…**'s Preview draws where each point was, faint, and where this seed moves it. It had given only how far
the points moved. It reads the whole layer where the source holds one, where it had read the first 500.

### 2026-11-23 · Show me how (0.3.0)

**Configure…** offers **Show me how it works**: a made-up home: the distance it will not stay within, the distance it will not pass, and where the seed set moves it.

### 2026-11-22 · On the standard (0.2.0)

Moved to the standard Inspector: the distances and the seed are in **Configure…**, and the sentence says it is a
teaching step, not a privacy guarantee.
