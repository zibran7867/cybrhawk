# Incident Response hero photo — art direction

**Current image:** the dark "glitched code" background, live at `https://cybrhawk.com/wp-content/uploads/2026/11/fast-response-scaled.webp` (139 KB) and set in `CONTENT.hero.media.image`. Phones use the same file (`imageMobile` is `""`). The guidance below is for any future replacement.

The hero is photo-led: one full-bleed photograph sits behind the headline "Respond Fast. Recover Smarter.", under a dark shade that is deepest at the bottom left. The photo is atmosphere, not information. It should feel like a calm, capable team handling something serious, at night.

Set the URLs in `incident-response.js`, in `CONTENT.hero.media`:

| Field | What to supply |
|---|---|
| `image` | Landscape master, **2400 × 1350 px** (16:9), WebP, quality 75–80, under ~350 KB |
| `imageMobile` | Optional portrait crop for phones, **1080 × 1350 px** (4:5), WebP, under ~200 KB. Leave `""` to reuse the landscape image |
| `position` | The focal point as CSS `object-position`, e.g. `"70% 40%"`. Move it if faces are cropped at some widths |
| `alt` | Leave `""`. The photo is decorative; the H1 carries the meaning |

Upload to the Media Library and paste the full `https://cybrhawk.com/wp-content/uploads/...` URLs.

## The shot

- **Scene:** two to four incident responders in a dim operations room or glass-walled office at night, focused and composed, mid-conversation or leaning over one laptop. A city at night through the window behind them.
- **Light:** low-key and cinematic. Cool blue ambient light from screens and the city, with a single warm or rim light on faces and hands. Deep shadows.
- **Composition:** people **right of centre**. The **left 45% and the bottom third should be dark and quiet** (shadow, out-of-focus wall or window), because the headline, copy and buttons sit there.
- **Depth:** shallow depth of field, with the foreground slightly soft.
- **People:** a mix of genders, ages and ethnicities, in business-casual clothes. No one looking at the camera.

## Avoid

- Hooded hackers, padlocks, glowing globes, binary rain, holograms, purple gradients
- Readable screens: no fake dashboards, IP addresses, code or alerts in focus. Screens should glow, not show content
- Red alarm lighting or sirens. Red is reserved for the page's "active incident" accents
- Logos, brand marks, ID badges or any visible text
- Stock-photo smiles or posed handshakes

## Generator prompt (if the photo is AI-generated)

> Cinematic photograph, night, a small team of three cybersecurity incident responders in a dim glass-walled operations room high above a city, focused, calm, mid-discussion around a single laptop, cool blue ambient light from monitors and city lights, warm rim light on faces, deep shadows, shallow depth of field, people positioned on the right third of the frame, left side and bottom of the frame dark and empty, monitors glowing but out of focus with no readable content, diverse team in business-casual clothing, nobody looking at camera, photorealistic, 35mm, 16:9, no text, no logos

For the phone crop, use the same scene in 4:5 with the team in the upper half and darkness below.

## Check before publishing

At 1440px and at 390px, open the preview and confirm:
- the headline and sub-line sit on shadow, not on a face or a bright window
- no face is cut off by the crop (adjust `position`)
- the photo is under the size budget, since it is the page's largest paint
