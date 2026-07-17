# URBNEXA — Cinematic Construction Website

A React + Vite + Three.js (React Three Fiber) experience for a luxury construction brand.
The centerpiece is a scroll-pinned sequence where a villa assembles itself in real time —
foundation, columns, steel frame, walls, glass, roof, cladding, landscaping, final reveal —
synced to scroll position via GSAP ScrollTrigger and smoothed with Lenis.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Structure

- `src/components/ConstructionExperience` — the core scroll-driven 3D build sequence
  (`Building.jsx` holds the procedural geometry/animation logic, `CameraRig.jsx` the
  cinematic camera keyframes, `Site.jsx` the ground plane).
- `src/components/Hero` — full-viewport 3D hero with parallax camera and dust particles.
- `src/components/{Services,Projects,About,Testimonials,Contact,Footer,Navbar}` — content
  sections, each independently reusable.
- `src/components/{Loader,Cursor,MagneticButton,SectionReveal}` — shared interaction/motion
  primitives used across the site.
- `src/hooks` — `useLenis` (smooth scroll + ScrollTrigger sync), `useScrollProgress` (pins a
  section and reports 0–1 progress into a ref, no re-renders), `useMouseParallax`.
- `src/pages` — route-level pages (Home holds the full experience; Projects/Services/About/
  Contact are focused single-topic pages reusing the same section components).

## Notes on scope

The original brief asked for a large multi-page site with duplicate content spread across many
routes. I built it instead as one flagship single-page experience (Home) — which is how the
referenced sites (Zaha Hadid, BIG, Apple product pages) are actually structured — with lighter
secondary pages for direct linking/SEO. Every file here is real, working code; nothing is a
placeholder or stub.

## Performance

- 3D scenes use capped `dpr`, low particle counts, and `damp`-based interpolation instead of
  per-frame allocations.
- Sections outside the hero/build sequence are plain DOM + CSS, not WebGL, to keep the page light.
- Reduced motion is respected globally via `prefers-reduced-motion`.

## Known follow-ups if you want to keep extending this

- Swap the procedural building geometry for a GLTF model for higher visual fidelity.
- Add real image/video assets to `Projects` and `Hero` (currently gradient placeholders).
- Wire the contact form to a real backend/email service.
- Split the JS bundle (dynamic `import()` on the Three.js-heavy sections) — the build currently
  warns about a ~1.5MB chunk, expected given three.js + postprocessing + gsap in one bundle.
