# Do Different

**Discover something worth remembering.**

A frontend-only MVP that helps people discover curated experiences through a guided conversation — not a marketplace or booking platform. Bookings happen directly with providers.

Built inside [Curiosity in Motion](https://curiosity-in-motion.vercel.app/#curiosity), a personal product lab.

---

## Why this project?

Most people do not start with a destination or activity. They start with intent: *I need to disconnect*, *I want to learn something*, *I don't know what to do this weekend.*

Do Different explores one question:

**How can people discover extraordinary experiences that better fit who they are today?**

This repository validates the discovery experience before investing in backend infrastructure, provider onboarding, authentication, or AI.

---

## Features

- **Editorial homepage** — full-viewport vertical story deck with scroll-snap navigation
- **Discovery questionnaire** — five-step intent flow (purpose, timing, distance, companions, budget)
- **Deterministic recommendation engine** — weighted scoring from mood, timing, distance, companions, budget, and local learning signals
- **Recommendation carousels** — “Picked for you” and “Worth Discovering” horizontal card rails
- **Event detail modal** — expanded experience view with match reasons and provider link
- **Local learning** — Love it, Not for me, and Tell me more interactions persisted in the browser
- **Curated experiences** — static dataset of editorially written experiences
- **Informational pages** — Contact, Privacy, Terms, Become a Partner
- **Responsive design** — mobile-friendly layout and carousel behaviour
- **Accessibility** — keyboard navigation, focus management, ARIA labels on key interactions
- **Vercel Analytics** — production page-view tracking via `@vercel/analytics`

---

## Architecture

Single-page React application with client-side routing. No backend, no API layer, no database.

```
User intent (localStorage)
        ↓
Discovery questionnaire (sessionStorage progress)
        ↓
matchingEngine.rankExperiences()
        ↓
learningEngine.computeLearningBoost()  ← interactionStore (localStorage)
        ↓
Personalized + hidden-gems carousels
        ↓
Provider URL (external)
```

All recommendation logic runs in the browser. Results are deterministic for a given intent and interaction history.

---

## Technology stack

| Layer | Choice |
|-------|--------|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Plain CSS (`src/styles/globals.css`) |
| Icons | lucide-react |
| Persistence | `localStorage`, `sessionStorage` |
| Analytics | `@vercel/analytics` |
| Routing | `history.pushState` + `popstate` (no React Router) |

---

## Project structure

```
src/
├── App.jsx                 # Route switch + Vercel Analytics
├── main.jsx                # Entry point
├── components/             # UI components
│   ├── DiscoveryPanel.jsx  # Five-step questionnaire
│   ├── MatchesStage.jsx    # “Picked for you” section
│   ├── GemsStage.jsx       # “Worth Discovering” section
│   ├── EventCard.jsx       # Recommendation card
│   ├── EventDetailModal.jsx
│   ├── MatchesCarousel.jsx / GemsCarousel.jsx
│   └── …
├── pages/                  # HomePage + static pages
├── state/                  # React hooks (intent, interactions, story deck, carousel)
├── services/
│   ├── matchingEngine.js   # Weighted scoring + ranking
│   ├── learningEngine.js   # Similarity-based learning boost
│   └── interactionStore.js # localStorage interaction log
├── data/
│   ├── events.js           # Curated experience dataset (~20 events)
│   └── siteImages.js       # Image paths and alt text
├── utils/                  # Routing, discovery options, scroll, progress
└── styles/
    └── globals.css         # Global styles and design tokens
public/
└── images/                 # Static image assets
```

---

## Getting started

**Requirements:** Node.js 18+

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

The app is a static SPA (`vite.config.ts` sets `appType: 'spa'`). Build output in `dist/` can be deployed to any static host.

Typical Vercel deployment:

1. Connect the repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Enable Web Analytics in the Vercel project dashboard (Analytics component uses `mode="production"`)

Client-side routes (`/contact`, `/privacy`, `/terms`, `/partner`) require SPA fallback to `index.html` on the host.

---

## Persistence

| Key | Storage | Purpose |
|-----|---------|---------|
| `doDifferent_intent` | `localStorage` | User discovery intent (mood, when, distance, with, budget) |
| `doDifferent_interactions` | `localStorage` | Interaction log (love, dismiss, tell_more, rail_view) |
| `doDifferent_discovery_step` | `sessionStorage` | Current questionnaire step (per tab) |
| `doDifferent_matches_revealed` | `sessionStorage` | Whether user has revealed recommendations this session |

---

## Current MVP scope

- Guided discovery → ranked recommendations → card interactions → provider link
- Two recommendation rails: personalized picks and secondary “hidden gems”
- Match reasons generated from score breakdown (human-readable copy, not AI)
- Empty states when discovery is incomplete or no strong matches are found
- Editorial footer with lab attribution

## Not implemented yet

- Backend or API
- Authentication or user accounts
- Payments or in-app booking
- AI / LLM recommendations
- Provider onboarding or admin portal
- Real per-event imagery in the detail modal (placeholder image used)
- Server-side analytics or event pipeline
- Search, maps, or geolocation

---

## Contributing

This is a personal product-lab MVP. Issues and suggestions are welcome, but there is no formal contribution process yet.

---

## License

License TBD.
