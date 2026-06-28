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

- **Editorial homepage** — vertical story sections with native document scroll (min-height 100dvh per slide, content may grow taller)
- **Discovery questionnaire** — five-step intent flow (purpose, timing, distance, companions, budget)
- **Deterministic recommendation engine** — weighted scoring from mood, timing, distance, companions, budget, and local learning signals
- **Recommendation carousels** — “Picked for you” and “Worth Discovering” horizontal card rails with dot navigation
- **Event detail modal** — expanded experience view with match reasons and provider link
- **Local learning** — Love it, Not for me, and Tell me more interactions persisted in the browser
- **Curated experiences** — static dataset of editorially written experiences
- **Informational pages** — Contact, Privacy, Terms, Become a Partner
- **Responsive design** — mobile-friendly layout and carousel behaviour
- **Accessibility** — skip link, focus management, ARIA labels on key interactions
- **Vercel Analytics** — production page-view tracking via `@vercel/analytics`

---

## Homepage slides

Seven sections in scroll order (see `src/data/slides.js`):

| # | Section ID   | Label              | Header nav |
|---|--------------|--------------------|------------|
| 1 | `intro`      | Welcome            | —          |
| 2 | `curated`    | How it works       | Yes        |
| 3 | `trust`      | Our promise        | —          |
| 4 | `discovery`  | Discover           | Yes        |
| 5 | `matches`    | For you            | Yes        |
| 6 | `gems`       | Gems               | Yes        |
| 7 | `footer`     | Contact            | Yes        |

---

## Navigation model

**Primary scroll:** Native window scroll on `<main class="story-scroll">`. No scroll-snap, no nested story scroller, no pinned down arrows.

**Sticky header:** Section links scroll to `#section-id` via `scrollToSection()` in `src/utils/scrollToSection.js`, which targets `#${id}-head`, then `#${id}-title`, then the section element, offset by the live-measured header height.

**Down-arrow navigation (`SlideContinue` → `ScrollCue`):** A chevron button placed after slide content. Rules are defined in `src/data/slides.js`:

| Slide           | Down arrow |
|-----------------|------------|
| Welcome         | Yes → How it works |
| How it works    | Yes → Our promise |
| Our promise     | Yes → Discover (scroll + focus questionnaire) |
| Discover        | No while answering or thinking; when ready, use **See your picks** only |
| Picked for you  | Yes → Gems (only after recommendations are revealed) |
| Worth Discovering | Yes → Contact |
| Contact         | No |

Scroll-spy in `useActiveSection` highlights the current section in the header.

---

## Responsive strategy

Styles live in two files (loaded from `main.jsx`):

- **`src/styles/globals.css`** — design tokens, component styles, slide layouts
- **`src/styles/responsive.css`** — breakpoint overrides

Breakpoints:

- **≤900px** — hamburger menu, adjusted slide padding
- **≤720px** — tighter padding, hero single-column, discovery slideshow hidden, mobile modal sheet
- **≥1100px** — roomier slide padding; curated cards become a 3-column grid when viewport height ≥720px

Slides use `min-height: 100dvh` and grow naturally if content is taller.

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

| Layer       | Choice                                             |
| ----------- | -------------------------------------------------- |
| UI          | React 19                                           |
| Build       | Vite 8                                             |
| Styling     | Plain CSS (`globals.css` + `responsive.css`)       |
| Icons       | lucide-react                                       |
| Persistence | `localStorage`, `sessionStorage`                   |
| Analytics   | `@vercel/analytics`                                |
| Routing     | `history.pushState` + `popstate` (no React Router) |

---

## Project structure

```
src/
├── App.jsx                 # Route switch + Vercel Analytics
├── main.jsx                # Entry point (loads globals.css + responsive.css)
├── components/             # UI components
│   ├── Hero.jsx            # Welcome slide
│   ├── CuratedSection.jsx  # How it works
│   ├── TrustSection.jsx    # Our promise
│   ├── DiscoveryPanel.jsx  # Questionnaire
│   ├── MatchesStage.jsx    # Picked for you
│   ├── GemsStage.jsx       # Worth Discovering
│   ├── FooterSection.jsx   # Contact / footer
│   ├── SlideContinue.jsx   # Down-arrow next-section control
│   ├── MatchesCarousel.jsx / GemsCarousel.jsx
│   └── …
├── pages/                  # HomePage + static pages
├── state/                  # React hooks (intent, interactions, carousel)
├── hooks/                  # useActiveSection, useAppRoute
├── services/               # matchingEngine, learningEngine, interactionStore
├── data/
│   ├── slides.js           # Slide map + navigation metadata
│   ├── events.js           # Curated experience dataset
│   └── siteImages.js
├── utils/                  # scrollToSection, discovery options, progress
└── styles/
    ├── globals.css
    └── responsive.css
public/
└── images/
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

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server            |
| `npm run build`   | Production build to `dist/`      |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

---

## Deployment

The app is a static SPA (`vite.config.ts` sets `appType: 'spa'`). Build output in `dist/` can be deployed to any static host.

Typical Vercel deployment:

1. Connect the repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Enable Web Analytics in the Vercel project dashboard

Client-side routes (`/contact`, `/privacy`, `/terms`, `/partner`) require SPA fallback to `index.html` on the host.

---

## Persistence

| Key                            | Storage          | Purpose                                                    |
| ------------------------------ | ---------------- | ---------------------------------------------------------- |
| `doDifferent_intent`           | `localStorage`   | User discovery intent (mood, when, distance, with, budget) |
| `doDifferent_interactions`     | `localStorage`   | Interaction log (love, dismiss, tell_more, rail_view)      |
| `doDifferent_discovery_step`   | `sessionStorage` | Current questionnaire step (per tab)                       |
| `doDifferent_matches_revealed` | `sessionStorage` | Whether user has revealed recommendations this session     |

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
- Automated tests

---

## Images and third-party assets

Photography in `public/images/` is sourced from [Pixabay](https://pixabay.com) under the [Pixabay Content License](https://pixabay.com/service/license/). These assets are used **for MVP and demonstration purposes only** and are intended to be replaced with original or commercially licensed imagery before a production release.

---

## Contributing

This is a personal product-lab MVP. Issues and suggestions are welcome, but there is no formal contribution process yet.

---

## License

All rights reserved. See [LICENSE](./LICENSE).

This repository is public for portfolio and demonstration purposes only.
