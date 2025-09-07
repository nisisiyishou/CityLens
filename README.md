# CityLens

**Tagline:** *See your city differently — routes for people, stories, and planet.*

## Demo

[![Watch the demo](https://img.youtube.com/vi/56cKigp4lDg/hqdefault.jpg)](https://youtu.be/56cKigp4lDg "Click to play on YouTube")

---

## Overview

CityLens is a lightweight web app that helps people build a more human connection with their city through three complementary pathways:

1. **Infrastructure Path** – a people-first utility map showing nearby **toilets, bins, water stations, and power plugs**, with context like venue/floor and hours (useful for gig workers and everyday walkers).
2. **Forgotten Stories Line** – narrative walking routes with **VR/360°** moments that overlay past and present for lesser-known places.
3. **Urban Green Trail** – gentle routes that surface **sustainability facts** in situ (water, carbon, biodiversity) to nudge greener behavior.

No external map APIs or databases are required for this prototype; all data is mocked to focus on interaction design and technical feasibility.

---

## Why CityLens?

* **Practical needs, quickly met.** Finding a bin, toilet, water, or a plug is surprisingly hard in many cities. Making this easy reduces litter, lowers stress, and supports gig-economy workers.
* **Stories beyond tourist checklists.** Most residents live near overlooked traces of history. CityLens invites slow, local exploration with short, curated routes.
* **Sustainability by experience, not lecture.** People learn best by walking through examples. The Green Trail surfaces bite-sized facts as you move.

---

## Key Features

### Infrastructure Map (fake map, real UX)

* Filter by **Bin / Toilet / Water / Plug**
* “Only nearby” radius with live counts
* Click a facility to see **venue, floor, hours, notes**
* Fixed “You are here” plus a dashed **distance line & ETA**
* Simple static **road geometry** for believable paths without a map API

### Forgotten Stories Line (VR)

* Route timeline with **story stops**
* Modal storyline + **360° viewer** (A-Frame) with JPG equirectangular skies
* **Text-to-Speech** narration toggle for each stop

### Urban Green Trail

* Multiple green routes with impact stats (CO₂, water, food yield)
* Stop details and “Read Full Story” modal
* Optional **360° view** per stop (reuses the same VR modal)

### Assistant

* Built-in **voice/text assistant** (prototype) to answer questions like “Where’s the nearest water?” or “Tell me about this spot.”

### Good DX

* TypeScript + Next.js App Router
* Client-only mounting guards for A-Frame
* Local JPG assets under `/public/images/vr` (no EXR required)

---

## Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS
* **VR:** A-Frame (dynamic import only when needed)
* **TTS:** Web Speech API (`speechSynthesis`)
* **State:** React hooks

---

## Project Structure

```
citylens/
├── app/
│   ├── layout.tsx         # Root layout + navbar + background
│   ├── page.tsx           # Home
│   ├── storylines/        # Forgotten Stories Line (VR)
│   ├── green-trail/       # Urban Green Trail
│   ├── infrastructure/    # Infrastructure Path (fake map)
│   └── components/
│       └── VRSkyModal.tsx # Reusable 360° viewer (A-Frame)
├── public/
│   └── images/vr/         # JPG equirectangular skies
├── types/
│   └── aframe-jsx.d.ts    # JSX shims for A-Frame tags (TS)
└── ...
```

---

## Getting Started

### Prerequisites

* Node 18+
* pnpm (or npm/yarn)

### Install & Run

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

### Build

```bash
pnpm build
pnpm start
```

---

## Implementation Notes

### A-Frame & TypeScript

* Load A-Frame **on demand**:

```ts
useEffect(() => {
  if (open) import('aframe').then(() => setReady(true))
}, [open])
```

* To silence TS on custom elements, add tiny JSX shims (`AScene`, `ASky`, `AEntity`) or a `*.d.ts` with intrinsic elements.

### VR Images

* Use **JPG equirectangular** assets (e.g., `sechelt.jpg` style). Store under `/public/images/vr/...`.
* Preflight images and **fallback** to a sample if missing.

### Exit 360°

* A top-right **Exit 360°** button closes the modal and restores body scroll.

### Fake Map

* Static **SVG paths** render main/secondary/pedestrian roads.
* “You are here” is fixed; clicking facilities selects, doesn’t move the user.
* Distance is straight-line for clarity; roads are visual context.

---

## How to Add Content

### Add a New Story Stop (VR)

1. Drop a 360 JPG into `/public/images/vr/your-stop-360.jpg`.
2. Append a stop object with `vrImageUrl` in the route’s `stops_detail` array.
3. The **View in 360°** button appears automatically.

### Add Infrastructure Items

* Update the `FACILITIES` array with:

```ts
{ id, name, type, x, y, details }
```

* Types: `bin | toilet | water | plug`.

---

## Troubleshooting

* **“Could not find a declaration file for module 'aframe'.”**
  Add `types/aframe-jsx.d.ts`:

  ```ts
  declare module 'aframe';
  declare namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-sky': any;
    }
  }
  ```

* **Hydration warning (class mismatch).**
  Keep layout CSS stable between SSR/CSR (avoid swapping root classes on mount). Use `min-h-screen` consistently.

* **Image 404.**
  Files must live under `/public/...` and be referenced as `/images/...`. Filenames are case-sensitive.

---

## Roadmap

* Smart **routing** along our road layer (not just straight-line)
* Persistent profiles, **badges/awards** for completed routes
* Authoring tools for **community-submitted** spots and stories
* Optional **hardware beacons** (future vision) acting as portable, people-friendly facilities that surface CityLens hints
* Offline packs and multilingual narration

---

## Credits

* 360° sample skies inspired by A-Frame gallery assets
* City-style 360s from Poly Haven & other CC0 libraries (converted to JPG)
* Icons/emoji: system emoji, Tailwind UI styles

---

## Links

* **Video demo:** [https://youtu.be/56cKigp4lDg](https://youtu.be/56cKigp4lDg)
* **Live prototype:** *add link if deployed*
* **Repo:** *add your GitHub repo URL here*

---

## License

MIT — see `LICENSE`.

---

## Maintainers

CityLens team — **Banana Overlords of Chaos** 🍌

> Have an idea, route suggestions, or a great local story? Open an issue or start a discussion!
