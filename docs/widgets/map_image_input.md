# Georeferenced map image

_Created 2026-10-27 · Updated 2026-11-28_

## What it does

Draws a scanned or published map **underneath** your workflow, in your workflow's own projection,
so a modern result sits over historical ground.

It was built for John Snow's 1855 Map 2, whose blue, red and purple washes show which company
supplied which part of south London — and whose purple intermingled zone is the whole point of his
design. Put the sub-district boundaries over it and a reader can see for themselves whether the
two agree.

## What you connect

Nothing goes in. It is a source: you give it an image and a georeference.

Its output goes to a **Map**, on the `ground` port.

## How to use it

1. Add it and choose the image — a JPEG or PNG of a map.
2. Give it the georeference, either as a world file (`.jgw`, `.pgw`, `.wld`) or as four corners
   in degrees: west, south, east, north.
3. Connect it to a Map, and set the opacity so you can read what is drawn on top.

## Reading what you get

The figure says which plate it drew, where it came from, and **about how many metres one of its
pixels covers**. Snow's plate over south London, UCLA's full scan, is about 1.2 metres per pixel: zoom in and its
print can be read. It is still ink, not a survey of the streets.

The receipt records the image's digest, its pixel size, the four bounds, that ground resolution,
and `layerRole "context"`.

## What it will not do

- **It will not let you measure it.** The output carries its own port type, so it cannot be
  connected to Clip raster or Sample raster at all. A plate's pixels are a printer's ink: sampling
  them returns the colour of a line, which is a number with no referent. This is the one thing the
  widget refuses by construction rather than by warning.
- **It will not join anything to what the map shows.** A boundary drawn on an 1855 plate is a
  picture of a boundary. Use a study area for the frame.
- **It will not draw a rotated plate.** If the world file carries rotation terms, it stops and says
  so. Drawing a rotated image as an upright rectangle would put the map in the wrong place while
  looking entirely correct.
- **A world file is read as CRS84 degrees.** Corners outside the world usually mean a projected georeference, and it
  refuses rather than reading one datum's coordinates as another's. **A GeoTIFF is read in its own projection** (see
  below); a projection it does not read is named and refused.
- **It will not tell you the georeference is right.** It draws where you said, or where the file says. The preview over
  today's map, with the sheet's graticule dashed, is how a misplacement is seen; matched pairs measure it.

## Where it is used

The South London example: Snow's Map 2 under the sub-district choropleth.

## How it was checked

Unit tests over the world-file reader, the bounds it derives from it, the ground resolution, and
each refusal — a rotated world file, a flipped image, crossed corners and corners outside the
world. A browser test places a plate under a figure and confirms it is drawn beneath the workflow's
own layers rather than over them.

What no test establishes is whether the georeference is **correct**. See
[experiment 143](../experiments/143-a-georeferenced-plate-as-ground.md), which records that
measuring the residual at the plate's four control points against modern boundaries is what would
close it, and that it has not been done.

## Placing an image by matching points

Where there is no world file, an image can be placed by features found twice: on the image, and on today's map.

1. Select the step and press **Configure…**. Choose the image.
2. Under **How to place it**, choose **By matching points on the image and today's map**.
3. Choose **Turned and stretched as needed** (three points or more) or **North up, no turning** (two or more).
4. Press **+ Add a point**. Click the feature on the image, then find the same feature on the map and **Shift + click**
   it: on the map a plain drag moves the map, and with Shift held the pointer is a crosshair. To move a point you have
   placed on the map, **press and hold** it, then drag. Or type its position: x and y on the image, longitude and
   latitude on the map. Name it.
5. Add more points, spread across the image. Each shows its error in metres; with more points than the fit needs, a pair
   whose error is much larger with that pair left out is marked **check this pair**.
6. Press **Apply**, then **Run**.

**Good pairs** are things that have not moved: a church, a bridge, an old road junction, the corner of a building still
standing. Where a sheet prints its own grid or frame with known coordinates, use those first. Once three points are
matched, clicking a feature on the image shows a ring on the map where the fit expects it.

**In a worked example**, the example names the features to find, in order, and why each was chosen. A slow pulse marks
where to look, on the image and on the map, sized to the feature: the exact click is yours. Under each name the dialog
says whether your click landed on the feature. It fills nothing in. **Show where to look** turns the pulse off; with
reduced motion set on your device, the ring stays still.

**Zooming the image.** A crosshair marks the centre of the image pane. Scroll until what you want is under it, then press
**Zoom in**: it stays under the crosshair. The pane keeps its place after each click. Without a mouse, press Tab until
the image pane is outlined, then scroll it with the arrow keys.

**While you match pairs**, a box under the table says:

- how far the pair you just made is from where your other pairs put it;
- what the placement implies: metres a pixel across and down, and how far the image is turned. Check these against
  the sheet's scale bar; a sheet drawn north up should be turned little;
- the overall error each time a pair was added. When it stops changing, more pairs add little.

Over today's map it also shows how far your cursor is from where the other pairs expect the feature. **Find the feature
by looking first**: the distance checks a click; it does not show where the feature is, and it is only as good as the
pairs behind it.

**Preview on today's map** draws the image as placed over today's map. Slide **See through the image** to compare the
streets and buildings underneath. Each pair is drawn twice, where the placement puts it and where you clicked, joined by
its error.

The map pane fetches OpenStreetMap's tiles, which sends the area you view to its servers.

A world file that turns the image is drawn turned.

## An image a worked example has already placed

A worked example can ship an image already placed: its placement, its control points and the digest of its image, but
not the image's bytes. When the workflow first runs, the image is fetched, checked against the digest, and kept on
this device; a file that does not match is refused. It comes from beside the application, or from the example's own
repository at the commit Fieldwork pins. Hagelloch's cluster map has the 1824 cadastral sheet under it this way, placed
from the same four junctions the sheet workflow asks a learner to match. South London's choropleth and its plate as
published have Snow's Map 2 under them this way, at 12,828 × 10,097 pixels. The workflows that ask the learner to place
the image still wait for the learner to choose it.

## A scanned sheet as a GeoTIFF

Choose a `.tif` and the widget reads its tags first:

- **Whether it is a picture.** Three colour bands of 8 bits, or one band with a palette, is a scan of something
  printed. One band of numbers is a measurement, and the widget sends you to Raster input.
- **Its projection**, from the tags: longitude and latitude; UTM by its code on WGS 84, NAD83 or NAD27; or a projection
  the file defines itself, polyconic, transverse Mercator, Lambert conformal or Albers, as published sheets use. NAD27 is
  carried to WGS 84 by its mean shift for the conterminous United States, good to a few metres.
- **The part over the study area**, with a quarter of its size again on every side, redrawn north up. A sheet of 6,600
  pixels is not decoded whole.

The dialog then opens **on the file's own placement**, before any pair, and its preview over today's map draws the
sheet's **graticule** dashed, on the sheet's own datum: the printed ticks and the sheet's edge should lie on it. Where
they do not, the tags are wrong. Choose **Moved from the file's own placement** and match a pair or two; one moves it,
a second says how far the pairs agree. For a printed corner, click where the dashed lines cross on today's map rather
than typing its printed numbers, which are on the sheet's datum. Both placements are kept, the file's and the corrected
one, with the pairs.

**Keep only the printed sheet** cuts the image to the sheet's printed edge in its final placement, rounded from the
file's extent to 7½′, 15′ or 30′, so its margin covers no neighbouring sheet.

USGS's *Oswego East, NY, 1943*: its tags place it 652 m east-west off its printed corners. One pair at its north-east
corner moves it 652 m east and 11 m south, the same as measured from its pixels. *West of Texas, NY, 1943*, the sheet
north of it, is placed correctly by its tags.

## History

### 2026-11-28 · A placed image from an example's repository

A worked example's placed image can now be fetched from the example's repository, by its pinned digest, when the
workflow first runs. Before, only an image served beside the application could be. Snow's Map 2 uses it: UCLA's scan
of 46 MB, too large to carry inside the project file. Nothing in the widget's settings changed.

### 2026-11-22 · Moved out of the application's main file (0.8.1)

Its Inspector and its Configure… moved into a module of their own, unchanged. Nothing it does changed.
