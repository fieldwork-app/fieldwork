# Map

_Created 2026-10-14 · Updated 2026-11-27_

**An output widget.** It draws what your workflow produced. It computes nothing, changes
nothing and decides nothing — if a number looks wrong on the map, the step that produced it is
where to look.

## What it does

A map is a stack of **layers**, drawn in order from the ground up:

1. a **basemap**, if you choose one — streets or terrain, under everything else
2. a **study area**, as the ground your results sit on
3. **polygons** — catchments, hulls, cells or bands
4. **points** — your records, sites, or anything with a location
5. a **raster** or a **street network**, where you have one

You connect what you want drawn. There is no setting that says what kind of map this is.

## What you connect

| Connect | To draw |
| --- | --- |
| a study area | the boundary your work is inside; without one, the study areas a polygon layer was read from |
| a point layer | records with locations — up to eight separate layers |
| a polygon layer | areas: districts, catchments, cells or bands — up to six separate layers |
| a raster | prepared or clipped cells |
| a street network | the streets themselves |
| a line layer | routes, tracks and borders, over the area and under the points |

## How to use it

1. **Add the Map** from the palette, under Outputs.
2. **Connect your first layer.** Drag from any step that produced something drawable onto the
   map's **+ Add a layer** port, or pick it from **Add a layer** under *Inputs* in the Inspector. The
   map works out which port it belongs to.
3. **Add more layers** the same way. A second point source gets a layer of its own rather than
   replacing the first.
4. **Open Configure…** for everything about how it is drawn. Nothing changes until **Apply**, and
   Apply redraws the map without running the workflow again. The settings are in groups: Presentation, Basemap,
   Layers, the marks, Lines between records, and Title, key and note. Once the workflow has run, the dialog draws the
   map beside its settings, as it will look with them: change a mark's size or the basemap and see it before Apply.
   On an interactive map, **Import tiles** (PMTiles, for a basemap that works offline) is under Basemap.
5. **Choose how it is drawn.** *Static plot* exports as an SVG with a scale bar and a north
   arrow. *Interactive map* can be panned and zoomed.
6. **The basemap is OpenStreetMap** unless you choose otherwise. On a static plot its tiles are fetched once and
   drawn into the figure, with their credit, so the SVG and PNG carry them. Choose *None* to keep the map working
   with no connection at all.
   With your own CARTO or Esri key in your credentials, an interactive map also offers CARTO's light, Voyager and
   dark styles, or Esri's satellite imagery, streets and outdoor maps, while your credentials are unlocked. See
   *Credentials* for how to get a key. A static plot draws OpenStreetMap in their place.
7. **Title it**, and write the source note. Both appear on the map and in its export.
8. **Run the workflow.** The map appears as a Results tab. **Manage layers…** orders, names and groups the
   layers it draws.

### Reading what you get

- The **key** names every layer drawn.
- The **scale bar** and **north arrow** appear on a static plot. An interactive map has no
  single scale, so it shows neither.
- The **source note** carries whatever you wrote, plus the licence of anything the map used.

### Symbols and colour

Two things about a point are shown at once, in two separate channels, so neither has to be read
off the other.

- **Colour says which layer the point came from.** Each point layer you connect gets its own hue
  from the categorical palette, so two searches of two different sources are told apart on the map
  and listed separately in the layer control, where either can be switched off. To choose a
  layer's colour, open **Configure…**: each point layer has a **Colour** menu beside its mark and
  size, offering the same six colour-blind-safe colours by name (blue, vermillion, bluish green,
  orange, reddish purple, sky blue), or **Default**. Over a black-and-white scan, such as an old
  sheet map, pick a strong colour such as vermillion so the points stand apart from the drawing.
- **Fill says where the point stands.** Filled inside the study area, hollow outside it, grey when
  the record has no usable location — those are not drawn on the map and are listed instead.
- **Each layer also gets a mark**: circle, square, triangle, star, cross or X. A mark is chosen per
  layer in this widget's settings, and the legend draws the same mark the map draws. Colour alone
  is not readable by every reader, and a figure printed in greyscale has no colour at all.
- **Every symbol carries a dark outline**, so it reads over any basemap — a terrain basemap runs
  through the same colours the palette uses, and a hollow mark over one is hard to pick out. It is
  a neutral, not a seventh colour, and a checkbox turns it off for a pale ground or a printed
  figure.
- **Ordered values use an ordered ramp.** Travel-time bands run light to dark through one hue,
  which is a ColorBrewer sequential scheme. A category palette on an ordered variable invites the
  reader to see difference where there is sequence.

The map's receipt records all of this — which channel carries which variable, the palette and the
authority it comes from, and each layer's mark and colour with whether you chose it or the map
derived it — so a figure in a publication can be attributed.

### Marks sized by a number: proportional symbols

In **Configure…**, under a point layer's symbol, **Size by** offers each attribute that holds a number on its records.
Choose one, such as `DEATHS`, and each mark's area is in proportion to its value: four times the value, four times the
area, twice the radius. The largest value takes three times the layer's mark radius. Large marks are drawn first and
are partly transparent, so a small one is never hidden under a large one. The key says what the size shows and over
what range, such as *the area of each mark shows DEATHS, 1 to 15*. A count suits it; a rate or a share belongs on areas,
as shading. John Snow's *Where were the deaths?* draws each address this way.

### Marks coloured by a number

Where places are close together, a large mark hides its neighbours: MERS's hospitals sized by their cases put Samsung
Medical Center's circle over the hospitals near it. **Colour by**, under Size by, draws every mark one size and colours
it by its value instead, in five classes from light to dark, the highest drawn on top. The classes hold about equal
numbers of marks, as a shaded map's quantile classes do, and the key gives each class's range and how many marks are in
it, such as *coloured by cases: 1 (4)*. A mark with no value is drawn grey. Choosing Colour by clears Size by, and the
other way round.

### Where it goes in the write-up

**In the write-up, under**, in **Configure…**, chooses the part of the Notes write-up this output's figure and its note go in:
Introduction, Methods, Results or Discussion. **Results** is the default. A map of the study area belongs in the
Introduction; a figure that shows how the analysis was done can go in Methods. References is not offered, because it
holds works and not figures. The run's receipt states the section and whether you chose it, and a validation rule
checks that the note describing the figure is filed in that same section.

**Not in the write-up**, the last choice, keeps the figure in Results and out of Notes and the publication: the run writes no note for it, and its receipt says it was left out. Hagelloch's day-by-day map is left out this way.

## Worked examples that use it

| Example | What the map shows |
| --- | --- |
| **John Snow: where were the deaths?** | the deaths where they fell and the eight pumps, as Snow drew them |
| **John Snow: which pump was nearest?** | one catchment per pump, with deaths overlaid |
| **John Snow: who lived within a walk of the pump?** | travel-time bands, as a plot and as an interactive map |
| **John Snow: how far did it spread?** | the outline of 250 death locations, with the pumps |
| **Sea-level rise at Manila’s health facilities** (its own repository) | the study area, 194 facilities and the eight AR6 tide gauges |
| **Geoprivacy** | the same records before and after being moved |
| **Hagelloch · who infected whom** | a line from each infector's house to the case's |

### It states its own shape in the write-up

Every run machines a note into **Results** on the Notes tab stating what this map is made of. The layers bottom to top, their feature counts, and any layer that is connected and **not** drawn — which is a fact about the figure a reader is owed. It is read off the same layer list the figure and the key draw from, so it cannot disagree with the picture.

**The caption is yours.** A caption states the subject, the population, the place and the period
in your words, and none of that can be read off a map. What this writes is what the map
declares about itself — the material you write the caption from, sitting beside it in the same
section.

**And it carries no number.** A figure's number depends on where it sits in the write-up and on
the venue you are preparing — set one figure aside and the ones after it move up — so the number
is worked out when the document is rendered. Nothing here says "Figure 1".

Edit it and it forks into a note of your own, like any machined note; the machined one goes on
being rewritten by every run.


### Words from the workflow

A map's title, subtitle or source note may say **{country}**, **{units}**, **{unit}** or **{census}**. Each is
filled from the workflow where the figure is drawn: the study area's country, what its units are called (stated on the
study area, or its boundary's own name for them), and the year of a census read from **Census tables**. A copy of the
workflow over another country reads that country. A word the workflow does not state is written as such, for example
*[country not stated]*, never guessed. The dialog says what each reads here.

## What it will not do

- **It cannot draw everything at once.** A map with both a raster and polygons connected draws
  the raster. The layers stay connected; only one is drawn. A street network is no longer one of
  these cases: points, a study area and a street network wired to one map are all drawn together,
  on the interactive presentation.
- **The static plot does not draw a street network beside points.** The streets are drawn in a
  frame of their own size, so a map carrying both draws the points in the plot and says where the
  streets are. Set the presentation to interactive to see all of it in one picture.
- **A layer of more than 2,000 marks gives up its marks' names.** On the static figure its marks of one colour are one
  shape, so a mark cannot be focused or picked in the records table. On the interactive map a click still opens a
  mark's details.
- **The interactive map draws at most 100,000 marks as squares, triangles, stars or crosses.** Past that they are drawn
  as circles in their colour, and the map says so; the static plot draws their shapes. Circles are drawn to 250,000.
  The interactive map's large layers are drawn by the graphics card with MapLibre,
  which is fetched only when online. Offline, or on a computer without WebGL, they are drawn as circles in their
  colour, and the map says so.
- **An interactive map's basemap is not included in its export.** Its tiles come from an outside service as you
  look at the map, so it exports as a static plot. A static plot's OpenStreetMap or OpenTopoMap tiles are drawn into
  the figure and its SVG and PNG.
- **A CARTO or Esri basemap needs your own key, unlocked.** Someone opening your project without one sees
  OpenStreetMap. The key is never kept in the project, but it is visible in the address of every tile.
- **A basemap sends the area you are viewing to its service**, and OpenStreetMap is the default. Everything else
  about this map works offline. For maps of sensitive locations, choose *None* first.
- **It cannot tell you whether a map is honest.** Emphasis, framing and colour all change how a
  map reads, and none of them changes a number. See the layers you connected, and say in the
  source note what the map is about.

### 2026-11-20 · A study area named by its digest; words from the workflow (0.38.0)

The receipt names a study area's shape by the SHA-256 of its GeoJSON instead of writing out its coordinates. The title,
subtitle and source note take {country}, {units}, {unit} and {census} from the workflow; a copy of a workflow leaves
the subtitle empty.

### 2026-11-24 · A locator's marks sit where its areas do (0.48.1)

On a map carrying a **polygon layer**, a locator inset drew the areas zoomed to its box while the point marks, the
link lines and the basemap stayed at the whole map's extent. The two frames describe different maps, so an area
drawn around a pin appeared about **six times too wide and off to one side** of the pin it belongs to.

Reported from a 50 km buffer around the Kibali mine, and seen by two readers before it was found. The buffer was
not at fault: its circle is centred on the pin to within a millionth of a degree. The boundary renderer had always
picked the frame this way; the polygon renderer never did, which is why it showed only on a map carrying a polygon
layer *and* a point layer.

---

*How this widget is built, what it assumes, and what has been measured about it:
[docs/widget-specs/map_output.md](../widget-specs/map_output.md).*

## Shading by value

A polygon layer carrying a value, such as a rate joined to districts, is shaded in five classes, and the key prints
the value at each class edge. The classes are quantiles: each holds about the same number of places, so the shade
shows rank. Each place counts once, however many parts its outline has; a district of 83 islands is one district,
and every one of its parts is drawn in its class.

**Tied values make fewer classes.** Where many places share one value, two class edges can fall on it. They are
merged, so no class is empty: Salmonella's 16 Länder, nine of them with no case in the study, are shaded in four
classes, 0, 1, 2 to 5 and 6 to 11, and the key says the tied values were kept in one class. Those classes do not hold
about equal numbers of places.

**The key has its own band under the map**, as tall as it needs, so a basemap never runs under the class labels: on
Salmonella's Länder over OpenStreetMap they had lain on Switzerland's tiles and place names.

**Whole numbers are keyed as whole numbers.** Where every value is a whole number, such as a count of cases, each
class is labelled under its shade with the values it holds, "2 to 5", rather than with the edges between shades.

**The figure in Notes and the downloaded SVG are the map in Results**, with its title above and its sources below: the
key's line saying what the shade is and how it was classed stays under the ramp, and the classes run along one line.

## A study area under polygons

Where a Study area is connected beside polygon layers, such as a space-time scan's clusters, the static figure draws the
area first, under the polygons, and frames the figure to take it in. Without one, the polygons fill the frame.

## The table under the map

Where the polygons carry attributes, Results shows a table under the map: one row per place, and a column for every
attribute, named as the file or the join names it. A place drawn in several parts, a district with its islands, is one
row. Choose a column heading to sort by it, numbers as numbers. Choose a row and its place is outlined in red on the
map, brought into view and its popup opened; choose a place on the map and its row is marked. On Salmonella's Länder:
16 rows, with each Land's name, its codes and its cases.

The table is in Results only, not in Notes or the write-up, and not under maps side by side. A layer with no
attributes, such as catchments, has none.

## Several sheets as ground

A map takes up to four map images as ground, each its own input, as it takes several point layers: two published
sheets of one place, each placed and cut on its own. They are drawn in the order of their inputs, a later one over an
earlier one, and each is its own layer to switch off.

## Maps side by side

**Arrange**, in **Configure…**, puts the polygon layers in panels side by side instead of over each other: in one row,
two by two, or in one column. Each panel draws one layer, by its name, and can be given a title; a layer can be left
out. The panels share **one scale**, so a shade is the same number in every panel, and the figure has one key. On an
interactive map each panel is a small map of its own, and **Move the panels together** keeps them on the same view.

**Rasters too.** Connect up to four rasters and each is a panel of its grid cells. What a panel shows comes from the
raster's unit, as Raster input records it in **Pixel value units** (filled in for WorldPop, GRID3 and GHS-POP):

| The unit | The panel shows | Colours |
| --- | --- | --- |
| A count per cell: *people per pixel*, *buildings per cell* | The count per km² of each cell's own area | Yellow to red |
| Any other unit: *NDVI*, *metres*, *mm of rain* | The cell's value, as it is | Viridis |
| None stated | Read as a count per km², and the key says the unit was not stated | Yellow to red |

Panels showing the same thing in the same unit share one scale and one key; a count and an NDVI raster side by side
have two. A panel is drawn at no more than 1,000 cells a side: each drawn cell is the count in the cells under it over
their area, or the mean of their values. The figure says how large a drawn cell is.

**One raster follows the same rule.** A Map given a single raster shades it the same way, at the raster's own resolution:
a count per km² in yellow to red, any other unit as its value in viridis, keyed under the map with each class's range,
and named in the layer list by its source and what it shows.

**Raster panels**, in **Configure…**, overrides what the unit decides, for one raster or several: **Each cell shows** a count per km² or the cell's
value; **Colours**, yellow to red or viridis; **Classes**, quantiles (about as many cells in each) or equal steps from the
lowest value to the highest.

Side by side shows where layers differ. It does not say which is right, and the key says so. The population example
shows four sources' shares of each district's people this way.

## When there is no basemap

A static figure drawn with no basemap, because none is chosen or its tiles could not be read, says so: *Basemap not
shown*, at the foot of the map, adds a scale bar, and does not credit a basemap it did not draw. A single dot on an
empty map then still says how large the area is.

Where there are five marks or fewer, each is named from its record, with or without a basemap: the tiles show the
streets, not which building the marks are.

## An inset

Where marks crowd each other at the scale of the whole map, enlarge a part of it beside the whole. On the interactive
map in Results, zoom to the part and choose **Use this view as the inset**, on the map at its top left; or, for a map shown as a static figure,
zoom the preview in **Configure…** and choose **Use the preview's view as the inset**. The view is kept as the inset's
box. **Clear the inset** removes it.

There are two kinds, each with its own shape, so a reader can tell them apart:

| Kind | Shape | What the figure shows | Its name |
| --- | --- | --- | --- |
| **Focus inset** | circle | the whole map, a circle round the part, and the part enlarged in a circle in a corner, the two circles joined by two lines, with its own scale bar | the boundary unit the part's centre falls in, such as *Gyeonggi* |
| **Overview inset** | square | the part as the figure, and the whole map small in a square frame in a corner with the part's extent as a red box, for a reader who needs to know where the place is | the study area's unit, such as *New York*; the country where the boundary joins several units; or the study area's label |

The names come from the study area's boundary record, never typed. Where the units have no names, the focus inset has
none.

In **Configure…**, under **Inset**:

- **Show**: *Focus inset* or *Overview inset*.
- **Where it goes**: where it covers nothing the map shows, or a corner you prefer. An inset never covers the study
  area's boundary, its marks or the north arrow. A chosen corner is used where it is clear; otherwise the inset goes to
  the clear place nearest the part (a focus) or nearest a corner (an overview), and where nothing is clear, into a band
  added below the map. A boundary that encloses the whole map, such as New York State around Lycoming, is the map's
  background: its inside does not count.
- **Its size**: a third (the default) or half of the figure's width. A focus circle is never more than 40% of the
  map's shorter side, so on a wide or short map it may be drawn smaller than chosen; Configure… says so.

Marks keep their size on the page in the focus inset, so marks that overlap on the whole map stand apart: the inset
enlarges the distances, not the marks, and the same mark is the same colour in both. How far apart they stand depends on
the box and the frame's width: MERS's four hospitals at Pyeongtaek, in a box about 18 km across shown half the figure
wide, stand at least two marks' widths apart. An inset is offered for a map over its study area; maps in panels have
none. The basemap is drawn under the large frame only.

## Playing through frames

Where the layer carries frames, from a join given **Frames from**, the interactive map shows a frame control: a
slider, **Play**, **Pause**, a step each way and a pace. Every frame shares one key, with classes computed across all
of them, so a part darker in one frame than another is higher. **What a frame is** sets a caption such as "Birth
cohort"; the frame keeps the name the data gives it. Play works only while every part is in view, and pauses if one
moves out. The static figure draws the last frame.

## Naming the parts

On an interactive map, **Label parts with** chooses which attribute names a polygon part when it is clicked.
The key it was joined on is shown beneath, so a layer keyed by `ID` can still be read by name. Nigeria's LGAs
are joined on `ID`, because 769 names cover 774 places, and labelled with `shapeName`.

## Lines between records

A map can draw a line from each point to another point it names. Use it for who infected whom, or who was traced
from whom.

1. Select the map and press **Configure…**.
2. Under **Lines between records**, choose **Line to the record named in**, such as `infector`.
3. Choose **Found by**: the column holding each record's own id, such as `case_ID`.
4. Press **Apply**, then **Run**.

Each line runs from the named record to the one naming it, and an arrowhead shows the direction. The lines are
drawn under the marks. On the interactive map they are a layer of their own, and they can be turned off.

**Each line is coloured by the generation of the record it runs into**: 2 for a case infected by a chain's first
case, 3 for the next, and so on, counted as Chart's transmission tree counts it and in the same colours. The key
lists each generation with how many lines run into it.

Every record is counted under one outcome. The counts are shown above the map and written in the receipt:

- **drawn**;
- **at one place**: both records are at the same point, so the line has no length. In Hagelloch, 90 of the 184
  links join two children of one house. They are counted, not drawn;
- **names nothing** in the column;
- **names a record the layer does not hold**;
- **names itself**;
- **names an id that more than one record holds**, so which one is meant cannot be read;
- **has an end with no location**.

A line joins two records of the same layer. It does not join records of two different layers.

## Tiles imported for this map

On an interactive map, **Import tiles** fetches an OpenStreetMap extract once, while connected, for the area
the map draws, and keeps it on this device. Run the workflow first, because the boundary comes from the run.

The workflow keeps the source, boundary, zoom range and build date, not the tiles. On another device the map
says it holds no tiles, and **Import tiles** fetches what is published then. Nigeria to zoom 10 was 1,344 tiles
and 49.2 MB. The map has no place names, because labels need fonts from a server.

## The basemap is context

No value on a map depends on the tiles under it. They come from an online service and can change or stop
being served, so another machine may show different ground. A map over an online basemap writes this into
Methods as a limitation, by itself. Natural Earth is bundled and writes no such note.

## History

### 2026-11-27 · Carried points drawn as their own layer, alike in the preview and the result (0.51.0)

Points that arrive inside a polygon layer, such as the deaths a **Summarize points to polygons** step counted, are a layer of the map, named for the step they came from. **Configure…** offers their size, colour and shape like any point layer, and the preview and the result draw them with that one setting, on top of the polygons. Before, the interactive map sized them by a column named DEATHS written into its code, and the static figure drew them at one small size, under-read against the shading: the two disagreed on Snow's Voronoi map. Snow's maps now choose *size by DEATHS* themselves.

### 2026-11-26 · H3 cells and Summarize's polygons shaded by class (0.50.0)

H3 cells carrying a count are shaded by class and keyed by range, on the figure and on the key beside the interactive
map. Polygons from Summarize points to polygons are shaded by the total or count they now carry. A layer saved before
keeps its old colours until the workflow is run again.

### 2026-11-24 · Lines are a layer, and they show which way they run (0.49.0)

Hand-drawn routes showed on the interactive map and on no figure — not in Results, not in Notes, not in a download.
A map carrying polygons is drawn by a different renderer, and that one had never been given the lines. Both draw
them now, over the areas and under the points, and both take them into the frame, so a route running past the
polygons no longer has its end cut off.

**Lines are a layer in Manage layers.** Until now the port was missing from the list the dialog is built from, so a
line layer could not be renamed, reordered, put in a group or switched off, and no receipt recorded that the map had
drawn one. It sits above the street network and below the points, which is where it is drawn.

**A line you drew shows which way it runs.** The order you clicked its positions *is* its direction — a flow from a
camp to a clinic is not the same as one from the clinic to the camp — so an arrowhead marks it, and the Line layer
step reverses a line drawn the wrong way round. A layer read from a GPX, or taken as the border two study areas
share, is left unmarked: the order of positions in a published track or a computed border is an artefact of how the
file was written, so an arrowhead there would claim a direction nobody chose. Configure… offers the three ways —
**where the lines were drawn by hand**, **always**, **never** — and the last two are you saying so outright.

**Polygons under lines are ground, not categories.** Where lines cross study areas, those areas lose their
colour-each and are drawn in one wash — the rule points have followed since yesterday. The route is the subject; the
areas are what it crosses. A layer read from a file, or one carrying a value, keeps its colours.


### 2026-11-23 · A pane per layer, and the stride retired (0.45.0)

The practitioner, reading the z-indices the fix above exposed — 10,076 and 10,000,092: *"Why do we have 10,000 layers
when the points really are a layer group?"*

They are a group, and the groups were already built. Leaflet orders markers within a pane by latitude — each marker's
own z comes from its projected y in pixels — so ordering layers by `zIndexOffset` meant reserving a band wider than any
layer's pixel spread: a stride of 10,000 per layer, and 100,000,000 to hold the sites above all of it. A FeatureGroup
reserves no depth of its own, so the groups carried visibility while a number carried order, and the two knew nothing
about each other. That is how a layer the list could not name took the 1000 fallback, times the stride, and sat over
everything.

Each point layer now draws in its own pane at its place in the stack, between Leaflet's marker pane and its tooltips,
and the sites have a pane of their own. Both numbers are gone. A layer with no position cannot outrank anything,
because it has to be in a pane to be drawn and the pane is its position. Leaflet's latitude ordering is left to do what
it is for, within one layer, which is what the stride was reserving room for. The static figure and the GPU renderer
needed no change: both already order by drawing in order.

A pane was tried for the sites on 2026-10-21 and reverted because it broke the vector basemap's attribution. Retested:
what broke was a pane the basemap bridge drew into, not panes as such. A pane nothing else draws into keeps the
attribution, checked by `tests/catchments.browser.mjs`.

**Not fixed by this.** A point layer past 2,000 marks is drawn by the GPU renderer, which is one canvas in one pane
below the marker pane, so such a layer draws under every smaller layer wherever it is placed, and GPU layers order
among themselves by arrival. One canvas cannot interleave with a pane per layer; that needs its own measurement.

### 2026-11-23 · The layer stack and the marks read one identity (0.45.0)

One mine pin and 1,171 bat records clipped to the DRC's provinces: *"This workflow keeps bat sites inside DRC ADM1
polygons but loses the mines push pin... I tried layers, putting mines as top layer on map but did not work."* The pin
was drawn — hiding the bats left exactly one mark — and buried at z 10,076 under bats at 10,000,092.

Two notions of a layer's identity were in use. The marks are keyed by the identity the data carries, which a
`clip_points_to_area` passes through from the input behind it; the layer list keyed each layer by the edge it arrived
on, which names the clip. They agree until a step sits in between. `layerRanks` lifts a layer the list cannot name
above every layer it can, so the bats went to the top and no reordering could reach them. The list now reads the same
identity the marks do, through the port, which is the one name both sides agree on. A classed layer's classes were
found by the same lookup and were lost the same way.

And the default stack was arrival order among point layers, which put one pin under a swarm. The smaller layer is now
drawn on top — the reading `KIND_DEPTH` already applies between kinds — and a position set in Manage layers still wins.
The dialog shows each layer's count.


### 2026-11-23 · Polygons as the ground a point stands on (0.44.0)

A layer built from the study areas connected to a workflow was drawn with a colour for each polygon. Where points are
drawn over them the polygons are the ground the points stand on, and a colour each says they are different things, so
they are now drawn in one wash and keyed by the layer. Each is still named, in the layer list and in its popup.

**Configure… → Polygons → A colour for each polygon** chooses: *Where no points are drawn over them*, *Always*,
*Never*. A layer read from a file keeps its colours whatever else the map draws, and a layer carrying a value keeps its
classes either way, so a table joined to the study area is still a choropleth with its points over it.

How the panels and the inset came to be: what was asked, designed, built, checked and found, dated. Each was
once an experiment record (212 and 213).

### Lines (0.43.0)

_2026-11-22._ A **lines** input takes a Line layer: routes, tracks and borders, drawn over the study area and under the
points, on the static figure and the interactive map, where each is a layer of its own and each line is named on hover.
A map of lines alone is drawn in their own frame. Not yet drawn on a map that leads with polygons, a raster or a street
network, and not yet in the key ([experiment 229](../experiments/229-a-line-layer.md)).

### Points placed against the study areas behind a polygon layer (0.42.1)

_2026-11-22._ Two study areas, South Sudan and DR Congo, wired into Polygon layer and from it to Map, with a point layer
beside them: the run stopped, asking for a study area on Map itself. The areas were there, one step back. Now, where
nothing is on Map's area input, Map follows its polygon layers back to the study areas they were read from and places
the points against those areas together: inside where inside either, outside where outside both. The map's notes name
the area as derived from them. Only Polygon layers that read their parts from study areas are followed.

Checked in `tests/study-areas-as-layer.browser.mjs` (two areas, three pins: one in each, one away), Chromium and WebKit.

**Not established:** how a point exactly on the border two areas share is described; it is on the outline of each.

### Rasters on one map, and Manage layers for rasters (0.42.0)

_2026-11-22._ Four countries' WorldPop rasters on one Map were drawn as four panels, though **Arrange** said *One map*:
for rasters, nothing arranged meant panels two by two. Now *One map* draws every raster over one frame, static and
interactive, each with its study area's outline, on one key per unit. Where two overlap, the later input is drawn on
top, and the map says how many drawn cells of which raster it covers. Panels are drawn when Arrange chooses them. The
population example chooses panels in one row, so it is unchanged.

Found with it, and fixed in the same release:

| Found | Now |
| --- | --- |
| Configure…'s preview drew the first study area's outline and no cells | it draws the rasters as Results does |
| A point layer wired to a Map with rasters was not drawn, a single pin included | the points are drawn over the cells, named where a layer has 12 or fewer, on one map and in every panel |
| Manage layers' order, names, groups and switches reached no raster | a map of rasters is drawn as Manage layers lists it, bottom to top; a group is one entry in the interactive map's layer list, switching its members together; the Map's own study area is a layer of its own |
| A panel map closed between two frames was fitted after it was gone, a page error | a closed map is left alone |

Checked in `tests/raster-one-map.browser.mjs` (two rasters half overlapping, a pin, a group, a hidden study area; five
runs) and `tests/raster-panels.test.mjs` (the overlap count), Chromium.

**Not established:** how a reader takes a later raster drawn over an earlier one where two countries' rasters overlap at
a border; the map says how much, not which value is right.

### Study areas left out, and a refused key says why (0.41.0)

_2026-11-22._ A map of four countries' study areas, made into one Polygon layer, had no way to show some and not
others. Where a map's polygon layers are made of two or more study areas, Configure… now lists them with a checkbox
each. Unchecked, a study area is left out of the map in Results, the preview and the write-up, and the map's notes
name it; the layer still holds it. One stays checked: the last cannot be left out.


A CARTO style on the practitioner's own key drew nothing on a local server, and the map said CARTO "did
not answer for this key". CARTO had answered: 403, because the key was locked to Fieldwork's published address. When a
tile on a key fails, the map now asks the provider once for the same tile and says its status and its own words, and
that a key locked to the published address is refused on any other; never the key. The pin editor's basemap says the
same.

### The key's ranges, laid out so none touches (0.40.0)

_2026-11-21._ Nigeria's 774 LGAs in five quantile classes printed their ranges over one another: each class had 90 px,
and "31,641 to 111,254" is half as wide again. A class is now as wide as its longest range. Where five such ranges do
not fit across the 790 px the map is drawn in, each is said on two lines, "31,641" over "to 111,254", and the key's band
is one line taller, so nothing lies on the map. The ramp never runs wider than the map, and the text stays 14 px.

### Maps side by side, arranged in Configure

_2026-11-13 to 2026-11-15. Kept here, as the widget's own history, since 2026-11-15; it was an experiment record before._



**Where it stands:** tried — built 2026-11-13; the population example's shares in four panels; Chromium. The practitioner
observation has not been made.

#### The question

The practitioner, 2026-11-13, of the population example ([209](../experiments/209-three-population-rasters-and-the-census.md)): *"For
the population rasters so we have a map comparison of population densities? Like side by side maps?"* Then, showing
JLT's population comparison viewer: *"Interactive it would look like this. Static it would be a 2x2 map panel. We should
have the capability to arrange the maps in the Configure dialog."*

So: **can one Map step draw several layers as panels side by side, on one shared scale, arranged in its Configure
dialog?**

#### What exists

| | Draws | Side by side |
| --- | --- | --- |
| Map | one picture: its layers stacked over each other | no |
| Comparison map | two point layers, original and moved, with their mean centres | yes, for that comparison only |
| Chart | panels, one per value of a column, on one scale (174) | yes, for charts |

Nothing draws two polygon layers or two rasters beside each other.

#### The design it adapts

JLT's viewer (`jltobias/JupyterLite-Population-Data-Comparison`, `viewer/index.html`; to be read at a pinned commit
and credited where adapted): four panels in two rows, one per source; **one set of classes shared by all four**
(modified quantiles, people per km²), so a shade means the same number in every panel; each panel titled with its
source and release, its own key and provenance; and **Synchronize map navigation**, so panning one pans all.

#### The design

An extension of Map, not a new widget: Map already takes several layers.

1. **Panels.** In Configure…, **Arrange** chooses *one map* (as now) or *panels*, and for panels which layer goes in
   which panel, its title, and the grid: one row, two by two, or a column. Each panel draws one layer and the context
   layers (the study area, a basemap).
2. **One scale.** The panels' values are classed together, one set of breaks over all of them, and the figure has one
   key. A panel's own classes would make a dark district in one panel and the same shade in another mean different
   numbers.
3. **Interactive:** one small map per panel, navigation synchronised (on by default, a box to turn it off), clicking a
   part showing its number in every panel.
4. **Static:** one figure, the panels in their grid, each titled, one key and one source line beneath; downloaded as
   one SVG or PNG.
5. **The first case** is 209's: each district's people per km² from WorldPop, GRID3, GHS-POP and the census, two by
   two. District density comes from Sample a raster's zonal statistics; the census's from its count over the district's
   area.

**Not in this design:** raster cells in panels (JLT's viewer draws cells; districts come first), panels of points,
and a difference map.

#### Admission review

D1: no new primitive; Map gains an arrangement. The practitioner asks for it by name ("side by side maps").

| Distinction | Enforced as |
| --- | --- |
| Panels on one scale: one shade, one range, in every panel | **hard stop**: one classification over the pooled values |
| A panel is one layer; its title names it | **validation rule**: a panel with no layer is refused in Configure |
| Side by side is not a difference: no panel says which is right | **limitation**, said in the key |

#### What it commits to, written before the result

- A unit test: four layers' values pooled into one set of breaks, and each panel's parts classed by them.
- A browser test: the population example's density map, four panels in two by two, one key; moving one interactive
  panel moves the others.
- **Practitioner observation, which can come out badly:** shown the four panels, can the practitioner say which source
  puts more people in a given district, and read the same shade as the same number across panels?

#### What it does not establish

That side by side is the best comparison: a difference map or a scatter of one source against another may show
disagreement more plainly.

#### Built, 2026-11-13

**First, Collect polygon layers retired into Map** (the practitioner, the same day: *"Retire collect polygon layers then
212"*; docs/audits/collect-polygon-layers-retired.md). A Map takes each polygon layer on its own input, `polygons` to
`polygons_6`, so four sources' districts reach one Map as four layers, each by its join's name.

**Arrange**, in Map's Configure…: one map, or panels in one row, two by two, or one column; each layer the last run drew
can be put in a panel or left out, and given a title. Stored as `arrangement` on the Map (0.29.0).

| Distinction | Enforced as | Built |
| --- | --- | --- |
| Panels on one scale | hard stop | the classes are taken over every panel's features together (`polygonShading` over the pooled features; `classifyOver` for the interactive panels) |
| A panel is one layer; its title names it | validation rule | an arrangement names 1 to 6 layers; a panel is drawn only where its layer was |
| Side by side is not a difference | limitation | said in the key: *one scale for every panel; side by side, not a difference* |

- **Static:** one figure, the panels in their grid on one frame, each titled, one key beneath (`polygonPanelsSvg`).
- **Interactive:** one small map per panel, **Move the panels together** on by default (adapted from JLT's viewer,
  `jltobias/JupyterLite-Population-Data-Comparison`, *Synchronize map navigation*).

**The first case changed, and why.** The design named each district's people per km². The population example computes
each district's **share** of its source's total, which is what experiment 209 compares; the census's density would need
each district's area and a division the workflow does not make. So the panels show the four sources' shares, two by
two: Select rows per source, Join a table to the study area, four layers on one Map.

**Not established:** whether a practitioner reads the same shade as the same number across panels, and can say which
source puts more people in a given district; that side by side shows disagreement better than a difference map would.

#### Validation record, 2026-11-13, Chromium

| Check | Result |
| --- | --- |
| `tests/population-example-opens.browser.mjs`: Rwanda's pinned workflow, its windows read again, run; the static map | four panels in order Census, WorldPop, GRID3, GHS-POP; Gasabo the same shade in the first three; one key, saying *one scale for every panel; side by side, not a difference* |
| The same, interactive | four maps; dragging the first moves the fourth; no page error |
| `tests/map-panels.browser.mjs`: two small layers in a row, one titled | two panels, the title shown; interactive, two maps |
| `tests/polygon-layers.test.mjs` | collecting, the ports, the migration and its refusal |

**Found on the way, 2026-11-13:** the first interactive panel was empty in the population example. Moving the panels
together moved maps that were still being laid out (Leaflet: *reading '_leaflet_pos'*). Following now starts once every
panel is drawn. Each panel had also carried the whole map's toolbar, basemap choice and key; a panel is now its map, the
key said once above.

#### Grid cells in the panels, 2026-11-13 (design, written before the code)

The practitioner, the same day, after the district panels: *"The example I showed you earlier the maps with the reddish
orange hues actually show the grid cells. And the interactive maps move together as linked maps so if you zoom on one
and move left to right or up and down all the maps move the same."* The panels of JLT's viewer are the rasters
themselves; districts were the part this record had put first and cells the part it had set aside.

1. **Map takes up to four rasters**, `raster` to `raster_4`, as it takes polygon layers. A raster layer is named by the
   step it comes from.
2. **What a panel shows is people per km² in each cell:** the cell's value over the cell's size on the sphere. The
   three grids are 100 m and 3 arc-seconds; per km² is what makes them comparable.
3. **Drawn at no more than 1,000 screen cells on a side.** A drawn cell's density is the people in the source cells it
   covers over their area, of the cells with a value; Botswana's WorldPop window is 123 million cells, which no screen
   shows. Said under the figure, with the size of a drawn cell.
4. **One scale:** quantile classes over every panel's drawn cells together, of those above zero, six classes on
   ColorBrewer's YlOrRd; a cell with no people modelled is left clear. The key gives each class edge.
5. **Linked as they move:** every panel follows the one being panned or zoomed, while it moves.

| Distinction | Enforced as |
| --- | --- |
| One shade, one density, in every panel | **hard stop**: one classification over the pooled drawn cells |
| A drawn cell is an aggregate, not a source cell | **limitation**, said under the figure with its size |
| A cell's density is per km² of its own area, not per cell | **run-time check**: each cell's area from its latitude |

**Not in this:** the census, which has no grid, beside the cells; a difference map.

#### Grid cells, built and checked, 2026-11-13, Chromium

Built as designed above (Map 0.29.0, `src/raster-panels.ts`); the population example at 7242e4f adds *Each source's cells,
side by side*, WorldPop, GRID3 and GHS-POP in a row.

| Check | Result |
| --- | --- |
| `tests/raster-panels.test.mjs` | a cell's density per km² of its area on the sphere; drawn cells aggregate people over area, no data adding nothing; one set of classes over every panel |
| `tests/population-example-opens.browser.mjs`, Rwanda, static | three panels in order, three images, one key in people per km²; drawn cells about 278 m |
| The same, interactive | three linked maps; a wheel zoom on the first moves the third; the key once, above; no page error |

**Found on the way:** the line above the figure described the first raster alone (*0 valid*); the single-raster key
(*Relative cell value*) was printed over the panels; a district map's note was left on the next tab; the interactive
panels opened zoomed into the middle, fitted before they had a size. Each fixed and checked in the test above.

**Found by the practitioner, 2026-11-13:** *"How come the static maps did not have a study area?"* The cell panels drew the
cells and nothing else, and GHS-POP's window, cut as a rectangle from a global grid, carried the neighbouring countries'
cells into its panel and into the shared classes, so the scale was not Rwanda's. Now only cells whose centre is inside
or on the study area are drawn or classed, Sample a raster's rule, and each panel draws the study area's outline, thinned
to at most 6,000 points. Rwanda's class edges moved from 122 to 1,521 to 176 to 1,586 people per km². Checked in
`tests/raster-panels.test.mjs` and the population example's test (three outlines, static and interactive); Chromium.

#### Days of a replay in panels: built and withdrawn, 2026-11-15

The practitioner, 2026-11-14, of Hagelloch's replay map in Notes: *"hard to interpret we can leave it out of the notes
unless we want to show representative days as static maps in 6-map panel."* Built the same day as panels by day (a
panel naming a day of a timeline, drawing that day's cluster and the cases dated by then), with six days the
practitioner chose, anchored on what the scan said. Drawn from the example's own run, it was then withdrawn before
release, on the practitioner's questions *"What's the point of showing it by day as sequential static maps? Is the by
day static maps actually useful"*.

**What the drawing showed.** What a reader needs is in the captions (the day, the cases known, the p-value); the maps
mostly show a circle moving about a village a few hundred metres across, which invites reading the moves as the
outbreak travelling. And the two days a scan would have flagged are what chance alone gives: 78 evening scans at
p < 0.05 expect about 4 false alarms from repeated looking, and it raised 2 (p = 0.039 and 0.047); the replay does not
adjust for looking every day, as a prospective scan's recurrence interval would. Six panels would have presented two
chance-level flags as turning points.

**Instead**, the practitioner chose a chart: each evening's p-value with the 0.05 line, beside the cases known. A
question about when is answered on a time axis. The panels-by-day code was removed, not kept unused.

### An inset in a map

_2026-11-13 to 2026-11-14. Kept here, as the widget's own history, since 2026-11-15; it was an experiment record before._



**Where it stands:** tried — built 2026-11-14 (Fieldwork 0.119.0, Map 0.31.0); MERS's inset and Oswego's locator in their examples, with browser tests.

#### The question

MERS-CoV, South Korea, 2015: *Where were the cases in hospital?* Twelve hospitals, most in Seoul and Gyeonggi, a few
kilometres apart on a map of the whole country. Colour by keeps a busy hospital from hiding its neighbours under a large
mark (0.110.0, and in the static map from 0.113.1), but at the scale of the country their marks still overlap. The
practitioner, 2026-11-13: *"For MERS hospitals, how do you configure an inset in a map I think that also deserves an
experiment."*

So: **can a Map show a part of itself enlarged, in a frame of its own, on the same figure?**

#### Decided 2026-11-14

Built now, on the practitioner's go-ahead (*"Build 213 now"*, when this was experiment 213), with a second case. Of the Oswego example: *"We can use
Map inset here."* So the two arrangements have one case each: **the inset**, a zoomed view of Seoul and Gyeonggi beside
the map of South Korea, for the MERS hospitals; and **the Locator**, the map of Lycoming with a small map of New York
State marking where it is, for Oswego.

#### What exists

| | Shows | An enlarged part |
| --- | --- | --- |
| Map, one map | every layer over one frame | no; the interactive map can be zoomed, a figure cannot |
| Map, panels (above) | one layer per panel, one frame for all | no; every panel shows the same extent |
| Comparison map | two point layers, original and moved | no |

#### The design

The inset is a part of the **static figure**. The interactive map needs none, because it can be zoomed, and it is where
the part is chosen. The practitioner, 2026-11-13: *"For map inset I think only the static map needs one. But how to pick
the part that goes into the inset is the question. I am thinking inset picker on the interactive map. The picked view
becomes the inset with the zoomed in portion with a pointer to the zoomed out map section."* (An earlier draft of this
record, the same day, drew an inset on both presentations and picked the part with a box drawn in Configure…'s preview;
both are replaced.)

1. **Picked on the interactive map.** On the interactive map of the Map step, pan and zoom to the part to enlarge and
   press **Use this view as the inset**. The view on screen becomes the inset's box, stored in longitude and latitude.
   Shown again, the interactive map draws the box, and **Clear the inset** removes it.
2. **Drawn on the static figure.** The main map as before, with the box drawn on it; the inset in a corner, the box's
   contents enlarged to fill it; and **two lines from the box to the inset's frame**, the pointer from the zoomed-out
   place to the zoomed-in one.
3. **Where it sits.** The corner where it covers least of what is drawn, unless one is chosen in Configure…; a third of
   the figure's width, or a half.
4. **What it draws.** Every layer the main map draws, in the same marks, the same colours and **the same classes**,
   only larger: a hospital in the inset is the shade it is on the main map. The inset carries its own scale bar.
5. **Or the other way round: a locator** (the practitioner, the same day: *"How about reverse inset where the bigger
   map becomes the inset highlighting the zoomed in map on the context view?"*). The picked view is the figure, and the
   whole map sits small in the corner with the picked part's box highlighted on it, the same two lines joining them.
   In Configure…, **Arrange** offers both: *Inset*, the part enlarged in a corner of the whole; *Locator*, the whole
   small in a corner of the part. The picking, the box, the lines and the classes are the same for both; only which
   frame is large changes.
6. **The first case** is MERS's hospitals: picked on Seoul and Gyeonggi, where nine of the twelve are, drawn both ways.

**Not in this design:** several insets; an inset at another projection.

#### Admission review

D1: no new widget. Map gains an arrangement, the one Arrange already offers for panels. The practitioner asks for it by
name ("an inset").

| Distinction | Enforced as |
| --- | --- |
| The inset is the same data on the same scale of values: one shade, one number | **hard stop**: the inset is drawn from the main map's own classes, never classed again |
| The inset's scale of distance is its own | **validation rule**: an inset is drawn with its own scale bar, and its box on the main map |
| The inset's box lies inside the main map's frame | **validation rule**: a view outside it is refused when it is picked |
| An inset enlarges; it does not add detail the data lacks | **limitation**, said nowhere on the figure: a drawn mark is no more precise for being larger |

#### Built, 2026-11-14

As designed, with two departures, each a result:

1. **The locator draws no lines.** Its box sits in the small frame and the part fills the figure, so lines from the box
   to the large frame would cross the whole figure. The box alone says where.
2. **The basemap is drawn under the large frame only.** The small frame shows the layers on the map's plain ground.
   Drawing tiles into a nested frame is a second fetch at another zoom; not done yet.

3. **Marks keep their size on the page.** The first build drew the enlarged part at the figure's 850 units and shrank it
   into its frame, so its marks shrank to a third: they stood apart because they were small. Found on MERS's own map,
   2026-11-15. Now the small frame's marks and lines are drawn larger by as much as the frame is shrunk.
4. **Also picked on Configure…'s preview.** MERS's hospital map is a static figure in Results, which cannot be zoomed;
   the preview in Configure… can, and offers the same choice.

**MERS** (pinned 2026-11-15): Seoul to Pyeongtaek in a third-wide frame enlarged about 3.5 times, not enough for the
Pyeongtaek hospitals, about 2 km apart, to separate at their marks' size. The box was tightened to Pyeongtaek, about
18 km across, half the figure wide: in the browser test the four hospitals stand at least 2.2 marks' widths apart.
**Oswego** (pinned 2026-11-15): its map's study area became New York State, the US Census Bureau's 2018 outline via
geoBoundaries (public domain; the practitioner approved the download, 5.47 MB), and the box Lycoming had been drawn as,
about 2 km across, became the locator's part. That box was under a pixel in the state's frame: **a locator's box is now
drawn at least 18 px on the page** (Map 0.31.3), centred where it is. Both cases are built.

An inset is offered for a map over its study area (the plain static map). A map in panels has none; a polygon map
without a study area has none yet. In the unit test, two marks about 1.4 km apart in Seoul, on a map of 126 to 130 E: 1.7 px apart on the whole map
(their 5 px marks overlapping) and 21.1 px apart in an inset of 126.8 to 127.2 E, each mark the same 5 px radius in
both. Synthetic coordinates, not MERS's hospitals.

#### What it commits to, written before the result

- A unit test: a box, its frame in a corner, every layer projected into it, the two lines from the box's corners to
  the frame's; the inset's marks take the main map's classes; and the same frames swapped for a locator.
- A browser test: on MERS's interactive map, zoomed to Seoul and Gyeonggi, *Use this view as the inset*; the static
  figure then draws the box, the inset with its own scale bar, and the two lines from one to the other; every hospital
  in the inset at least a mark's width from the next, and both marks of one hospital the same colour. As a locator,
  the picked part fills the figure and the whole sits in the corner with the box.
- **Practitioner observation, which can come out badly:** shown the figure, can the practitioner find a given hospital
  in the inset and say which hospital on the main map it is?

#### What it does not establish

That an inset is better than framing the map on the hospitals alone, or than an interactive map, for a reader of this
figure. That a reader reads the inset's scale bar rather than assuming the main map's.

### 2026-11-19 · The source line ends at its source (0.36.1)

A map's default source line ended "See N3 & evidence for method." where the step stated no method of its own, and the
pointer, an instruction for someone in the application, was printed in every figure and draft. It now names the inputs
and the CRS and stops; a method the step states is still printed. Found by the target outputs audit
([audit](../audits/target-outputs-audit.md)).

### 2026-11-19 · The interactive map's key is the figure's (0.36.2)

On the interactive map, Hagelloch's clusters were keyed as a solid blue square and an orange one, over a red ring, blue
rings and orange discs: the static figure's key had learnt rings on 2026-11-15 and the interactive map's had not. Both
now read one rule. Its move out of `app.ts` follows in its own release.

### 2026-11-19 · A country's outline is drawn (0.36.3)

DR Congo at the first level, its 26 provinces and 194,009 vertices from geoBoundaries, drew a blank map with nothing said:
the figure's frame was measured by passing every vertex at once to a function that takes at most about 100,000, and the
error was swallowed. It is now measured one vertex at a time, and a map that cannot be drawn says why where it would be.

### 2026-11-19 · Maps of many points (0.37.0)

Asked by the practitioner: *"How can we make the map draw faster and bigger"*. A map took at most 2,000 point records
across its layers, a number chosen and never measured. It was lifted, and a map of points read from a table was timed
from Run to the figure on screen (Chromium, development Mac, `tests/measure-point-count.browser.mjs`):

| Points | Static figure, before | after | Interactive map, before | after |
| --- | --- | --- | --- | --- |
| 10,000 | 7.6 s | 0.7 s | 21 s | 1.5 s |
| 50,000 | 74 s | 2.7 s | 155 s | 5.8 s |
| 100,000 | not finished when stopped, after several minutes | 5.8 s | not tried | 11 s |
| 150,000 | not tried | not measured | not tried | 13 s |
| 250,000 | not tried | 19 s, read from a file | not tried | 24 s |

What changed:

- **The static figure counted each layer again for every mark** to decide whether to name its marks: 2.5 billion steps
  at 50,000 points. It counts once.
- **A layer of more than 2,000 marks is one shape per style** on the static figure, labelled with how many marks it
  holds, instead of one focusable element per mark.
- **The interactive map draws such a layer on the graphics card** (MapLibre GL), one image per shape, colour and size.
  A click opens the mark's details, the layer list hides it, a timeline filters it.
- **The limits are measured**: 250,000 records (the table limit, which the static figure and the table reached), and
  100,000 marks drawn as shapes other than circles on the interactive map. Both are in `widgets/caps.json`.

Found on the way: the first interactive timings were void. MapLibre 6 no longer asks for a mark's image through the
event used, so the layer drew nothing and still reported itself drawn; the browser test that clicks a mark caught it.
At 250,000 rows the Tabular data dialog took over an hour to tick four key columns, so 100,000 and above were read from
a workflow file instead (fixed the same day: Tabular data 0.11.1).

**The interactive map at 150,000.** First it crashed the tab, at 150,000 and at 200,000: MapLibre's source prepared the
points for every zoom to 18; cut at 12, the tab no longer crashed but drew nothing, and reported no error. Drawn with
MapLibre's circle layer instead of an icon per mark, 150,000 took 14 s and 250,000 24 s, so the icons' layout was what
never finished. Circles, the default mark, are now a circle layer over a halo layer; only the other shapes are icons.

#### What it does not establish

That a map of 100,000 marks is read for anything but where they are dense: at that number marks cover one another,
and a density surface may say more. WebKit and Windows were not measured.

**Practitioner observation, which can come out badly:** on a map of 50,000 cases, can the practitioner say where the
cases are densest, and does the static figure, whose marks have no names, still serve?

Its Inspector and Configure dialog also moved out of `app.ts`, into `src/map-ui.ts`, with nothing a practitioner sees
changed.

### 2026-11-20 · A mean centre as a point (0.39.0)

A Mean center connects to a point layer and is drawn as one point, named by its step. The geoprivacy example's map of
the original and moved points shows both mean centres and the pumps beside them, where Comparison map, now retired,
drew them.
