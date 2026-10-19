# UCD SOC model images: generation prompts

Five landscape images for the "Choose your SOC model" section of the UCD page. Each one runs edge to edge across the top of its card, above the model's name. Until an image is added, the panel shows the model's icon.

| Layout | Panel size | Shape |
|---|---|---|
| Desktop, five across | about 245 × 165 px | 3:2 |
| Tablet, three or two across | 270–340 px wide | 3:2 |
| Phone, one column | 280–555 px wide | **cropped to 16:9** |

On phones the card trims about 8% off the top and bottom of the image, so five stacked cards stay short. That's why every prompt keeps the subject in the middle of the frame with wide empty space above and below.

The five images read as a sequence, from the lightest model to the largest. Virtual SOC sits on standby, Co-managed SOC works daytime hours, Dedicated SOC runs a private room around the clock, Fusion SOC joins three disciplines, and the Autonomous SOC runs a full command centre.

## How to use these prompts

- **ChatGPT, Gemini, Firefly, Ideogram:** paste the full prompt as written. The labelled sections help these tools follow the layout.
- **Midjourney:** use the short "Midjourney version" under each prompt. Midjourney works best with compact prompts and ignores hex colour codes.
- **Set landscape 3:2.** In ChatGPT ask for a landscape image (1536 × 1024). In Gemini, Ideogram or Midjourney choose 3:2. If your tool has no 3:2 option, use 4:3; the card crops it to fit, so nothing else changes.
- **Match the capability images already on the page.** For 01, attach one of the capability images as a style reference, for example [AI-Analytics-Dashboard-Hub.webp](https://cybrhawk.com/wp-content/uploads/2026/10/AI-Analytics-Dashboard-Hub.webp), and start the prompt with "Match the style, colours, lighting and background of the attached image exactly, but make a new landscape scene." In Midjourney, add `--sref <image URL>`. For 02–05, attach your chosen 01 as the reference the same way.

Every prompt repeats the same Composition, Style, Lighting, Colours, Background and "Do not include" sections. Keep them identical; they're what makes the five images look like one set and like the capability images above them.

## If a result isn't right

| Problem | Add this and regenerate |
|---|---|
| Fake text or letters on screens or cards | "Replace every bit of writing with plain abstract bars. There must be no letters anywhere." |
| Too busy or cluttered | Delete the last bullet under "Scene details" and try again |
| A person appears in a chair | "All chairs are empty. There are no people anywhere in the scene." |
| Colours drift from the brand blues | "Use only the colours in the Colours section, matched exactly." |
| Background has a floor, gradient or scenery | "Make the background one flat colour, #F2F6FF, with nothing else in it." |
| Subject fills the frame or is cut off | "Zoom out. The scene should fill only the middle of the frame, with wide empty space above, below and on both sides." |
| Image comes out square | "Make it a wide landscape image, 3:2, wider than it is tall." |
| Looks flat or cartoonish | "Render it as a soft 3D product illustration with real depth, bevelled edges and soft shadows." |

## Before you upload, check each image

- **No text.** No letters, numbers or labels anywhere, including on screens, the calendar in 02 and the dashboards in 05.
- **No people.** Chairs are empty, and there are no hands or faces.
- **No logos.** No company or product marks on any screen, laptop or device.
- **Crop-safe.** Cover the top and bottom tenth of the image with your fingers. The whole subject should still show; that's the phone crop, with a little to spare.
- **Readable small.** Shrink the image to about 245 px wide, its size on desktop, and confirm the main subject still reads.
- **Consistent.** Palette, lighting and background match the rest of the set and the capability images.

## Export and upload

| Setting | Value |
|---|---|
| Size | 960 × 640 px |
| Format | WebP, quality about 80 (40–80 KB each) |
| File names | As listed with each prompt, e.g. `ucd-soc-virtual.webp` |

Upload each file to the WordPress Media Library, copy its URL, and paste it into the `image: ""` field of the matching model in `udc.js`:

```js
{ name: "Virtual SOC", how: "...", coverage: "On demand", bestFor: "Teams needing expert backup",
  icon: "headset", image: "https://cybrhawk.com/wp-content/uploads/2026/10/ucd-soc-virtual.webp" },
```

The images are decorative (the model's name sits right below each one), so they need no alt text.

**Negative prompt** (for tools that have a separate field):

```
text, letters, words, numbers, labels, writing, logos, brand marks, watermark, signature, people, person sitting, hands, faces, photorealistic, photograph, dark background, black background, red, neon, cyberpunk, clutter, busy composition, floor, horizon, scenery, cropped subject, square format, blurry, low resolution
```

---

## 01 · Virtual SOC

**File:** `ucd-soc-virtual.webp` · Coverage: on demand · Analysts engage when a critical alert or incident occurs

```
Create a wide landscape 3D illustration for a cybersecurity product page, representing an on-demand security operations service: expert analysts who stay on standby and step in the moment a critical alert appears.

Main subject: a sleek over-ear headset in white with cobalt-blue ear cushions, resting on a round white charging dock on the right side of the scene. A thin ring of light around the base of the dock glows light blue, as if the headset has just been switched on.

Scene details:
- On the left: a small computer monitor on a stand. Its screen shows a calm row of pale-blue abstract bars, and one rounded alert card pops forward out of the screen toward the viewer, with an amber outline and a small amber dot on it.
- Between the monitor and the dock: one thin glowing light-blue line arcs from the alert card to the headset, with three small glowing dots travelling along it, like a call being placed.
- In front of the dock: a small rounded toggle switch on a white base, flipped to the on position, with a cobalt-blue knob.
- Everything except the alert card, the line and the dock's light is calm and still, so the scene reads as standby until needed.

Composition: Isometric three-quarter view from about 30 degrees above. Wide landscape framing. The group is centred, spans about 65% of the frame's width and no more than 60% of its height, with generous empty space on every side and especially above and below. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. One single small accent in amber #FFB020, only on the alert card's outline and dot. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; a red or triangular warning sign; a dark or black background; red; photorealism; any objects not described above.

Format: landscape 3:2 (for example 1536 × 1024), high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, wide landscape scene, white over-ear headset with blue cushions on a round white charging dock with a glowing light-blue ring, small monitor on the left with calm pale bars and one alert card popping out with an amber outline, thin glowing line arcing from the alert card to the headset with three travelling dots, small toggle switch flipped on, standby mood, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins above and below, plain pale blue background, clean minimal SaaS product illustration --ar 3:2 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 02 · Co-managed SOC

**File:** `ucd-soc-co-managed.webp` · Coverage: 8×5 · CybrHawk analysts work alongside your team

```
Create a wide landscape 3D illustration for a cybersecurity product page, representing a shared security operations team: the company's own security staff and a partner's analysts working side by side during business hours on weekdays.

Main subject: one long white desk with rounded corners, carrying two identical workstations side by side. Each workstation is a monitor on a stand with an empty office chair tucked in front of it.

Scene details:
- The left workstation has a white monitor frame and a white chair. The right workstation has a cobalt-blue monitor frame and a cobalt-blue chair. Otherwise they are identical, to show two teams as equals.
- Both screens show the same simple abstract bar chart, and a short glowing light-blue bridge joins the tops of the two monitors, to show shared work.
- Floating above the back of the desk: a soft 3D sun, a pale amber disc with short rounded rays, to show daytime hours.
- On the front edge of the desk: a small desk calendar strip of seven rounded square tiles in a row. The first five tiles are cobalt blue and glow faintly; the last two are plain pale blue. The tiles have no numbers or letters.

Composition: Isometric three-quarter view from about 30 degrees above. Wide landscape framing. The group is centred, spans about 65% of the frame's width and no more than 60% of its height, with generous empty space on every side and especially above and below. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. One single small accent in amber #FFB020, only on the sun. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces (both chairs are empty); a dark or black background; red; photorealism; any objects not described above.

Format: landscape 3:2 (for example 1536 × 1024), high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, wide landscape scene, one long white desk with two identical workstations side by side, left monitor and chair white, right monitor and chair cobalt blue, both chairs empty, both screens showing the same bar chart, glowing light-blue bridge joining the two monitors, soft pale amber 3D sun floating above, small calendar strip of seven tiles with five blue and two pale, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins above and below, plain pale blue background, clean minimal SaaS product illustration --ar 3:2 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 03 · Dedicated SOC

**File:** `ucd-soc-dedicated.webp` · Coverage: 24/7 · Dedicated staff and technology, private and always on

```
Create a wide landscape 3D illustration for a cybersecurity product page, representing a private security operations centre run for one organisation alone, staffed and equipped around the clock.

Main subject: a miniature private operations room: a rounded rectangular enclosure with frosted glass side walls and a clear glass front, standing on a white platform with a cobalt-blue edge.

Scene details:
- Inside, against the back wall: a gently curved video wall of three joined screens, all lit, showing simple abstract bar charts and a ring chart.
- Inside, in front of the video wall: a row of three workstations, each a monitor on a desk with an empty chair. Every screen is lit.
- Inside, on the right: a tall server rack with rows of small light-blue status lights.
- On the clear front glass: a raised cobalt-blue padlock emblem, to show the room is private.
- Floating above the back corner of the room: a small crescent moon in sky blue and a small sun disc in pale amber, side by side, to show it runs day and night.
- Along the top edge of the enclosure: a thin strip light glowing light blue along its whole length.

Composition: Isometric three-quarter view from about 30 degrees above. Wide landscape framing. The group is centred, spans about 65% of the frame's width and no more than 60% of its height, with generous empty space on every side and especially above and below. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. One single small accent in amber #FFB020, only on the small sun. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces (all chairs are empty); a night sky or dark interior; a dark or black background; red; photorealism; any objects not described above.

Format: landscape 3:2 (for example 1536 × 1024), high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, wide landscape scene, miniature private security operations room in a rounded frosted glass enclosure on a white platform with blue edge, curved video wall of three lit screens with bar and ring charts, row of three workstations with empty chairs, tall server rack with light-blue status lights, raised blue padlock emblem on the clear front glass, small crescent moon and small pale amber sun floating above, glowing strip light along the top edge, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins above and below, plain pale blue background, clean minimal SaaS product illustration --ar 3:2 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 04 · Fusion SOC

**File:** `ucd-soc-fusion.webp` · Coverage: 24/7 · Threat intelligence, incident response and OT security operate together

```
Create a wide landscape 3D illustration for a cybersecurity product page, representing three security disciplines (threat intelligence, incident response and industrial security) working as one combined team.

Main subject: a frosted glass sphere with a bright light-blue glowing core, resting on a round white pedestal in the centre of the scene, where three streams of light meet.

Scene details:
- Three small rounded platforms surround the sphere in a triangle, each carrying one discipline:
- Back left, threat intelligence: a mini globe with a thin orbit ring around it and a small radar dish beside it.
- Back right, industrial security: a mini factory building with a saw-tooth roof, and in front of it a short pipe with a round valve wheel.
- Front centre, incident response: a small upright cobalt-blue shield with a white lightning bolt on it.
- From each platform a smooth ribbon of glowing light flows to the central sphere, one cobalt blue, one sky blue and one light blue, and the three ribbons twist together just before they enter the sphere.
- A thin flat ring lies around the base of the whole group, linking the three platforms like one shared floor.

Composition: Isometric three-quarter view from about 30 degrees above. Wide landscape framing. The group is centred, spans about 65% of the frame's width and no more than 60% of its height, with generous empty space on every side and especially above and below. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; smoke, fire or warning colours; a dark or black background; red; photorealism; any objects not described above.

Format: landscape 3:2 (for example 1536 × 1024), high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, wide landscape scene, glowing frosted glass sphere on a round white pedestal in the centre, three small rounded platforms around it in a triangle, mini globe with orbit ring and small radar dish, mini factory with saw-tooth roof and a pipe with valve wheel, small blue shield with a white lightning bolt, three glowing ribbons of blue light flowing from the platforms and twisting together into the sphere, thin flat ring linking the platforms, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins above and below, plain pale blue background, clean minimal SaaS product illustration --ar 3:2 --style raw --no text, letters, numbers, logos, people, faces, smoke, fire, red, dark background
```

## 05 · Autonomous SOC & Command Center

**File:** `ucd-soc-autonomous.webp` · Coverage: 24×7×365 · AI triage with human analysts, customer portal, executive dashboards

```
Create a wide landscape 3D illustration for a cybersecurity product page, representing a large security command centre where AI sorts the flood of alerts and hands only the important few to human analysts, so the service scales without adding staff.

Main subject: a wide, gently curved video wall of five joined screens on a white base across the back of the scene. The screens show simple abstract dashboards: bar charts, a donut chart, a line graph and a world map made only of dots.

Scene details:
- In front of the video wall, in the centre: a frosted glass sphere with a bright light-blue glowing core, floating just above a small white pedestal.
- From the left, a long neat line of about twelve small rounded alert cards in pale blue flows into the sphere. Only two cards come out on its right side, and they glow light blue.
- The two glowing cards travel to a single workstation on the right: a monitor on a desk with an empty chair, and a white over-ear headset with cobalt-blue cushions hanging on the side of the monitor.
- At the front left: a tablet on a small stand, showing a simple dashboard of abstract bars and a ring chart.

Composition: Isometric three-quarter view from about 30 degrees above. Wide landscape framing. The group is centred, spans about 65% of the frame's width and no more than 60% of its height, with generous empty space on every side and especially above and below. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; robots with faces, people, hands or faces (the chair is empty); a dark or black background; red; photorealism; any objects not described above.

Format: landscape 3:2 (for example 1536 × 1024), high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, wide landscape scene, security command centre, gently curved video wall of five joined screens with bar charts, donut chart, line graph and dotted world map, glowing frosted glass AI sphere floating on a small pedestal in front, long line of small pale alert cards flowing into the sphere and only two glowing cards coming out, the two cards travelling to a single workstation with an empty chair and a white headset with blue cushions, tablet on a stand at front left with a simple dashboard, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins above and below, plain pale blue background, clean minimal SaaS product illustration --ar 3:2 --style raw --no text, letters, numbers, logos, robot face, people, faces, red, dark background
```
