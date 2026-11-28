# Geometry buffer

_Created 2026-11-20 · Updated 2026-11-24_

**A study area drawn around one place.** Everything within a stated distance of a well, a clinic or a city centre.

## What it does

It takes one named point and draws a circle of the radius you set around it, as a polygon of 128 sides, 32 to each
quarter. That polygon becomes a study area, which any step that takes a study area can use.

## What you connect

| Input | What it takes |
| --- | --- |
| **Points** | a point layer that holds the point, named by its name or its id |

## How to use it

**Configure…** sets two things, and nothing is written until **Apply**:

| Setting | What it decides |
| --- | --- |
| **Point in ‹layer‰ that defines the area** | chosen from the points the connected layer carries. One point arriving is the choice; several, and the list opens on *Every one of them*, or name one to draw around it alone. A layer that holds no records of its own and has not run offers none, and the name is typed in until it has |
| **Radius in metres** | above 0 and up to 50,000. The radius is a claim about reach, so give the figure your evidence supports and say where it came from in Methods |
| **Where several areas are drawn** | combine them into one study area, or keep each one separate as a polygon layer |

**Show me how it works**, in the dialog, draws a made-up well and the area around it, step by step, with the radius
you have set.

**Result** gives the size of the area drawn at the last run.

## What it will not do

- **It will not keep the buffers apart and call them a study area.** Combined, they are one scope; kept apart, they are a polygon layer, and only a scope can be connected to the clip, the street network or a facility search.
- **It will not follow roads or terrain.** The distance is straight, on the ground; for travel time, use a travel-time
  step.
- **It will not draw more than 50,000 metres.** A study area is held to one degree as well, which a radius reaches at about 55.6 km; beyond that, keep the buffers as a polygon layer or draw the area under Study area.

## Where it is used

No worked example uses it today.

## History

### 2026-11-27 · Several points said as several (0.8.0)

The manual and **Show me how** say what the step has done since 2026-11-23: with several points the list opens on
*Every one of them*, and each is drawn around the same way. Both still said one point only.

### 2026-11-24 · The preview shows the ground and the point (0.6.0)

The picture now draws **the points the area is drawn around**, and puts OpenStreetMap ground behind them where it
can be fetched. A radius is a claim about reach *from* something, and a picture of the reach without the thing it
reaches from cannot be checked against the ground or against the pin on the map. With no network the preview keeps
its plain background and says the ground is not shown.

Its caption also no longer contradicts the setting above it. One area was captioned "kept apart" under a step set
to **combine into one study area**, because nothing is dissolved when there is nothing to dissolve and the caption
read that absence as the layer setting.

