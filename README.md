# Ledger Geeks

Software & blockchain/AI engineering studio site — Next.js (App Router) + TypeScript.

- `app/page.tsx` — homepage (`/`)
- `app/consultation/page.tsx` — booking page (`/consultation`)
- `app/globals.css` — site stylesheet
- `components/` — header, footer, reveal-on-scroll, counters, work cards, cursor, canvases
- `lib/webgl/` — three.js scenes (hero network, about-panel icosahedra, CTA network)
- `_archive-v1/` — earlier static design iteration, kept for reference

The old `/index.html` and `/consultation.html` URLs permanently redirect to the new routes.

## Run locally

```
npm install
npm run dev
```

Then open `http://localhost:4200`.

## Production

```
npm run build
npm start
```
