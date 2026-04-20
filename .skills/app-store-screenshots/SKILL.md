---
name: app-store-screenshots
description: >
  Generate production-ready Apple App Store and Google Play Store screenshots
  using the ParthJadhav methodology: a self-contained HTML generator that renders
  phone/tablet mockups with marketing captions and exports PNGs at every required
  resolution with one click. Use this skill whenever the user wants to create,
  update, or re-export app store listing screenshots. Triggers on: "app store
  screenshots", "play store screenshots", "store listing images", "app preview
  images", "screenshot generator", or any request to produce images for submitting
  an app to the App Store or Google Play.
---

# App Store Screenshot Generator

Inspired by [ParthJadhav/app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots).

Produces a **single self-contained HTML file** the user opens in any browser.
Every screenshot design is rendered live; clicking a button exports it as a
correctly-sized PNG — no server, no npm install, no dependencies.

---

## Required resolutions

| Store          | Device              | Portrait px    |
|----------------|---------------------|----------------|
| Apple iOS      | iPhone 6.5"         | 1242 × 2688    |
| Apple iOS      | iPhone 6.7"         | 1284 × 2778    |
| Apple iPad     | iPad 12.9" / 13"    | 2048 × 2732    |
| Google Play    | Phone               | 1080 × 1920    |
| Google Play    | Feature Graphic     | 1024 × 500     |

---

## How to build the generator

### Step 1 — Gather app info
Before writing any code, collect from the user (or infer from context):
- App name & tagline
- Brand colours (hex)
- 5–8 key features / benefits (one per screenshot)
- Any real screenshots or mockup images to embed

### Step 2 — Design each slide
Each screenshot = **one slide** with three zones:

```
┌─────────────────────────────┐
│  HEADLINE (bold, brand col) │  ← marketing copy, ~60–80px
│  Sub-tagline (grey)         │
├─────────────────────────────┤
│                             │
│   ┌─────────────────┐       │
│   │  Phone mockup   │       │  ← CSS phone frame (dark shell,
│   │  [app content]  │       │    rounded corners, dynamic island)
│   └─────────────────┘       │
│                             │
└─────────────────────────────┘
```

Minimum 5 slides covering:
1. Hero — value proposition & main UI
2. Features — category/topic grid
3. How it works — step-by-step
4. Core feature in action — live screenshot / chat UI
5. Trust / social proof — data sources, credentials

### Step 3 — Build the HTML

Use this exact stack (all CDN, no install):
- **html-to-image** for PNG export: `https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js`
- Vanilla CSS + JS only (no React, no build step)
- Google Fonts via `<link>` for Inter or similar

#### Phone frame CSS pattern
```css
.phone {
  width: 280px; height: 570px;
  background: #1a1a2e;
  border-radius: 44px;
  padding: 12px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  position: relative;
}
.phone::before { /* dynamic island */
  content: '';
  position: absolute;
  top: 20px; left: 50%;
  transform: translateX(-50%);
  width: 90px; height: 22px;
  background: #0a0a14;
  border-radius: 11px;
}
.screen {
  width: 100%; height: 100%;
  background: #fff;
  border-radius: 32px;
  overflow: hidden;
}
```

#### Export button pattern
```js
function exportSlide(slideEl, filename, w, h) {
  const scale = w / slideEl.offsetWidth;
  htmlToImage.toPng(slideEl, {
    width: w, height: h,
    style: { transform: `scale(${scale})`, transformOrigin: 'top left' }
  }).then(dataUrl => {
    const a = document.createElement('a');
    a.href = dataUrl; a.download = filename; a.click();
  });
}
```

### Step 4 — Export buttons
Each slide needs export buttons for every required size:
- iPhone button → exports at 1242×2688
- iPad button → exports at 2048×2732
- Play Store button → exports at 1080×1920

### Step 5 — Save & present
Save the HTML file to the user's output folder. Remind the user to:
1. Open the file in Chrome or Safari
2. Allow the page to fully render (1–2 seconds)
3. Click the export button for each slide
4. Find the PNGs in their Downloads folder

---

## Design rules
- **Never show the model name** in any screenshot
- Headline font weight ≥ 700; keep to 2–3 words max per line
- Use the app's brand colours for headline text + CTA buttons
- Phone frame always dark (`#1a1a2e` or similar)
- Background: gradient using brand colours at low opacity, or solid light/dark
- Source citations, legal text, and nav bars must be visible in the phone screen
- Every slide must have a clear, distinct message — no two slides should say the same thing

---

## Quality checklist
Before delivering the HTML file, verify:
- [ ] All 5+ slides present
- [ ] Phone frame renders cleanly (no overflow, no clipping)
- [ ] Export buttons visible for each slide
- [ ] html-to-image CDN script loaded
- [ ] Fonts load (use `font-display: swap`)
- [ ] Content readable at thumbnail size
- [ ] No placeholder text left in slides
