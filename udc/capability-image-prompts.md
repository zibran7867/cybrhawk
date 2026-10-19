# UCD capability images: generation prompts

Eight square images for the "Eight capabilities. One defense." section of the UCD page. Each sits in a rounded tile beside the capability's number and title (136px on desktop, 96px on tablet, 84px on phones). Until an image is added, the tile shows the capability's icon.

## How to use these prompts

- **ChatGPT, Gemini, Firefly, Ideogram:** paste the full prompt as written. The labelled sections help these tools follow the layout.
- **Midjourney:** use the short "Midjourney version" under each prompt. Midjourney works best with compact prompts and ignores hex colour codes.
- **Make a matching set:** generate 01 first and choose the best result. For 02–08, give that image as the style reference: in ChatGPT or Gemini, attach it and start with "Match the style, colours, lighting and background of the attached image exactly." In Midjourney, add `--sref <image URL>`.
- **Generate** at 1024 × 1024 or larger.

Every prompt repeats the same Composition, Style, Lighting, Colours, Background and "Do not include" sections. Keep them identical; they're what makes the eight images look like one set.

## If a result isn't right

| Problem | Add this and regenerate |
|---|---|
| Fake text or letters on screens or cards | "Replace every bit of writing with plain abstract bars. There must be no letters anywhere." |
| Too busy or cluttered | Delete the last bullet under "Scene details" and try again |
| Colours drift from the brand blues | "Use only the colours in the Colours section, matched exactly." |
| Background has a floor, gradient or scenery | "Make the background one flat colour, #F2F6FF, with nothing else in it." |
| Subject touches or is cut off at the edges | "Zoom out. Leave wide empty space on every side of the subject." |
| Looks flat or cartoonish | "Render it as a soft 3D product illustration with real depth, bevelled edges and soft shadows." |

## Before you upload, check each image

- **No text.** No letters, numbers or labels anywhere.
- **No logos.** This matters most for 05 CDR: the copy mentions Microsoft 365 and Entra ID, but no Microsoft marks may appear.
- **Readable small.** Shrink the image to 84px, its size on phones, and confirm it still reads.
- **Margin.** The subject has empty space around it. The tile's rounded corners crop anything at the edges.
- **Consistent.** Palette, lighting and background match the rest of the set.

## Export and upload

| Setting | Value |
|---|---|
| Size | 320 × 320 px |
| Format | WebP, quality about 80 (15–30 KB each) |
| File names | As listed with each prompt, e.g. `ucd-cap-ai-soc.webp` |

Upload each file to the WordPress Media Library, copy its URL, and paste it into the `image: ""` field of the matching capability in `udc.js`:

```js
slug: "ai-soc", icon: "soc", title: "AI SOC", full: "", image: "https://cybrhawk.com/wp-content/uploads/2026/10/ucd-cap-ai-soc.webp",
```

The images are decorative (the title beside each names it), so they need no alt text.

**Negative prompt** (for tools that have a separate field):

```
text, letters, words, numbers, labels, writing, logos, brand marks, watermark, signature, people, hands, faces, photorealistic, photograph, dark background, black background, red, neon, cyberpunk, clutter, busy composition, floor, horizon, scenery, cropped subject, blurry, low resolution
```

---

## 01 · AI SOC

**File:** `ucd-cap-ai-soc.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing an AI-powered security operations centre that is monitored around the clock.

Main subject: a floating dashboard screen made of frosted glass, a rounded rectangle tilted slightly toward the viewer, standing on a low rounded white pedestal.

Scene details:
- On the screen: three simple bar charts of different heights in cobalt blue on the left, and on the right a short vertical stack of four small rounded alert cards. The top card glows light blue, as if it has just been picked out. Show all screen content as simple abstract bars, never as writing.
- In front of the screen on the left: a sleek over-ear headset in white with cobalt-blue ear cushions, resting on the pedestal.
- In front of the screen on the right: a small square AI chip with short pins along each side and a glowing light-blue core, joined to the screen by one thin glowing line.
- Around the whole group: a thin flat ring floating horizontally at mid-height, with 24 small, evenly spaced raised tick marks like a watch bezel, in pale blue.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, floating frosted glass dashboard screen with blue bar charts and a stack of four alert cards, top card glowing, white over-ear headset with blue cushions in front, small glowing AI chip with pins, thin floating ring with 24 tick marks around the group, white rounded pedestal, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 02 · SIEM / XDR

**File:** `ucd-cap-siem-xdr.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing a platform that collects security data from many sources and correlates it into one picture to detect anomalies.

Main subject: three thick rounded glass slabs stacked one above another with even gaps between them, like a layered data platform. They are translucent sky blue, and the bottom slab is the most solid.

Scene details:
- On the top slab: about eight small glowing dots joined by thin lines into one connected network pattern. One of the dots is amber; all the others are light blue.
- A small magnifying glass with a white handle and a thin cobalt-blue rim hovers just above the amber dot.
- In a loose semicircle in front of the stack: four small, simple source objects. These are a mini laptop, a mini server tower with horizontal vent slots, a mini cloud, and a short white brick-wall segment representing a firewall.
- From each source object, a thin stream of tiny light-blue dots flows into the bottom slab.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. One single small accent in amber #FFB020, only on the one dot described. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, three stacked translucent blue glass slabs like a layered data platform, glowing network of dots on the top slab with one amber dot under a small magnifying glass, mini laptop, mini server tower, mini cloud and small white brick wall in front, thin streams of light-blue dots flowing into the stack, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 03 · ITDR (Identity Threat Detection & Response)

**File:** `ucd-cap-itdr.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing protection of user identities and logins from attack.

Main subject: an upright identity card. It is a white rounded rectangle with a cobalt-blue band across the top, a plain round avatar silhouette in sky blue (a simple head-and-shoulders shape with no facial features), and a fingerprint drawn as concentric curved lines in the lower half.

Scene details:
- A large curved shield of frosted glass with a glowing blue edge stands just in front of the card's left side, partly covering it.
- To the right of the card: a small semicircular gauge with a pale-to-blue scale and a navy needle pointing to the low, blue end.
- On the base in front: a small navy key lying flat and a closed cobalt-blue padlock.
- Behind the shield on the far left: a small flat token chip with an amber dot, stopped against the shield, with faint light-blue ripples on the shield where it is blocked.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. One single small accent in amber #FFB020, only on the token's dot. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces (the avatar is only a plain silhouette); a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, upright white identity card with a blue top band, plain avatar silhouette and fingerprint lines, curved frosted glass shield in front of it, small semicircle gauge with navy needle, small navy key and blue padlock, small token chip with an amber dot blocked by the shield, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 04 · OT Security

**File:** `ucd-cap-ot-security.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing security monitoring for industrial and operational technology: factories, plants and the control systems that run them.

Main subject: a floating rounded-square platform, white with a cobalt-blue edge, carrying a miniature industrial site under a clear glass dome.

Scene details:
- Back left: a small factory building with a saw-tooth roof and one tall chimney.
- Front left: two parallel pipes running along the platform with a round valve wheel on top.
- Back right: a tall control cabinet with a grid of small switches and tiny indicator lights.
- Front right: a small monitor on a stand showing a simple abstract line graph with no writing.
- Thin glowing light-blue lines run along the platform surface, connecting all four objects.
- A clear translucent glass dome covers the whole platform, with a soft blue highlight along its rim.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; smoke, fire or warning colours; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, miniature industrial site on a floating white rounded platform, small factory with saw-tooth roof and chimney, pipes with a valve wheel, tall control cabinet with switches and lights, small monitor with a line graph, glowing light-blue network lines connecting them, clear glass dome over the platform, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, people, faces, smoke, fire, red, dark background
```

## 05 · CDR (Cloud Detection & Response)

**File:** `ucd-cap-cdr.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing threat detection and response for cloud workloads and cloud services.

Main subject: a large, soft, rounded 3D cloud, white on top and shading to sky blue underneath, floating above a small platform.

Scene details:
- On the front face of the cloud: a raised cobalt-blue shield emblem with a white check mark.
- On the platform below the cloud: three upright server blocks and two small cube-shaped containers in cobalt blue and white, each joined up to the cloud by one thin glowing line.
- A thin horizontal ring circles the cloud, with a faint wedge-shaped radar sweep of light-blue glow.
- At the front left of the platform a mini laptop, and at the front right a mini identity badge, each linked to the cloud by a thin line.
- No logos or brand symbols anywhere, including on the laptop.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks (no Microsoft, Windows or other company symbols); people, hands or faces; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, large soft rounded cloud with a blue shield emblem and white check mark, server blocks and container cubes on a platform below linked by glowing lines, thin radar ring with a light-blue sweep around the cloud, mini laptop and mini identity badge linked to the cloud, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, brand symbols, people, faces, red, dark background
```

## 06 · Exposure Management

**File:** `ucd-cap-exposure-management.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing finding what an attacker could reach, prioritising the most serious weaknesses, and confirming they are fixed.

Main subject: a floating rounded-square tile, white with a cobalt-blue edge, with a miniature network map on top: seven small short cylinder nodes joined by thin raised lines.

Scene details:
- One node at the front right glows amber; all other nodes are blue and white.
- Hovering just above the amber node: a large crosshair target made of frosted blue glass (two concentric rings with four short marks pointing inward), casting a soft ring-shaped shadow onto the node.
- On the left side of the tile: three upright bars of decreasing height, the tall one navy, the medium one cobalt blue and the short one sky blue.
- One node at the back left wears a small round white badge with a cobalt-blue check mark.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. One single small accent in amber #FFB020, only on the one node described. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, miniature network map of small cylinder nodes on a floating white rounded tile, one amber node under a large frosted glass crosshair target, three upright priority bars of decreasing height in navy, blue and sky blue, one node with a small white check badge, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```

## 07 · AI Agents

**File:** `ucd-cap-ai-agents.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing AI agents that carry out security response steps automatically, with a person approving the final step.

Main subject: a frosted glass sphere with a bright light-blue glowing core, resting on a small white pedestal at the back left.

Scene details:
- From the sphere, a gently curving path of four rounded square tiles runs toward the front right, each tile joined to the next by a short arrow.
- Tile 1: a mini laptop with a closed padlock on its lid.
- Tile 2: a mini globe with a small round cobalt-blue stop symbol (a circle with a horizontal bar) in front of it.
- Tile 3: a speech bubble with three dots inside.
- At the end of the path: a large round push button, slightly raised, cobalt blue with a white check mark, not yet pressed.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; robots with faces, people, hands or faces; a red or octagonal stop sign; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, glowing frosted glass AI sphere on a small white pedestal, curving path of four rounded tiles joined by arrows, mini laptop with a padlock, mini globe with a round blue stop symbol, speech bubble with three dots, ending at a large raised blue push button with a white check mark, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, robot face, people, faces, red, dark background
```

## 08 · Broad Integrations

**File:** `ucd-cap-integrations.webp`

```
Create a square 3D illustration for a cybersecurity product page, representing a platform that connects to the security and IT tools a company already uses instead of replacing them.

Main subject: a central rounded cube hub in cobalt blue, with a soft glowing seam around its middle and a socket on each visible side.

Scene details:
- Five separate modules surround the hub at even spacing, each a different simple shape: a short cylinder, a hexagonal prism, a rounded cube, a flat slab and a small dome. They are in white, sky blue, pale blue and navy.
- Each module is joined to the hub by a short white cable ending in a plug inserted into one of the hub's sockets.
- One plug, at the front, is just about to connect, with a small light-blue glow at its socket.
- The modules keep their own shapes and colours; nothing merges into the hub.

Composition: Isometric three-quarter view from about 30 degrees above. The group is centred and fills about 70% of the frame, with generous empty space on every side. Nothing touches or is cut off by the edges.

Style: Premium soft 3D render in the style of a modern SaaS product illustration made in Blender or Cinema 4D. Smooth matte plastic and frosted translucent glass, softly rounded bevelled edges, simple clean shapes, subtle ambient occlusion, crisp and uncluttered. Bold, simple silhouettes that stay recognisable when the image is shown small.

Lighting: Soft diffused studio key light from the upper left, gentle fill light from the right, a soft contact shadow directly beneath the group, and a faint light-blue glow on the glowing parts only.

Colours: Main surfaces cobalt blue #0C68FF and sky blue #6AA8FF. Secondary surfaces white and pale blue #EAF2FF. Small details deep navy #0D1330. Glows light blue #8CC4FF. No other colours.

Background: Plain, flat, seamless very pale blue #F2F6FF. No floor, horizon, gradient, vignette, scenery or extra decoration.

Do not include: any text, letters, numbers, labels or readable writing; logos or brand marks; people, hands or faces; a dark or black background; red; photorealism; any objects not described above.

Format: square 1:1, high resolution.
```

**Midjourney version:**

```
isometric soft 3D render, central rounded blue cube hub with a glowing seam, five different-shaped modules around it (cylinder, hexagonal prism, rounded cube, flat slab, small dome) each plugged into the hub by a short white cable, one plug about to connect with a small glow, matte plastic and frosted glass, cobalt blue and sky blue with white and navy accents, soft studio lighting, soft contact shadow, centred with wide margins, plain pale blue background, clean minimal SaaS product illustration --ar 1:1 --style raw --no text, letters, numbers, logos, people, faces, red, dark background
```
