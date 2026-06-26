# Do Different — Product Document

**Tagline:** Discover something worth remembering.

**Crafted by** [Curiosity in Motion](https://curiosity-in-motion.vercel.app/#curiosity)

Do Different is one product built inside Curiosity in Motion, a personal product lab exploring ideas through product discovery, design, and experimentation.

---

## Vision

Help people discover extraordinary experiences that fit who they are *today* — before they know what activity or destination they want.

Do Different is intentionally **not** a travel marketplace, event marketplace, or booking platform. It is a discovery layer: a guided conversation that turns intent into curated recommendations. When someone is ready to book, they leave the product and go directly to the provider.

---

## Problem

People rarely start with *“I want to go kayaking in Slovenia.”* They start with feelings and constraints:

- *I need to switch off.*
- *I want to learn something.*
- *I need a change.*
- *I don't know what to do this weekend.*

Traditional search assumes the user already knows *what* they want. Do Different assumes they know *how they want to feel* — and builds recommendations from that.

---

## Product principles

1. **Intent before destination** — mood and context come first; places and activities follow.
2. **Editorial, not algorithmic theatre** — recommendations are explainable, deterministic, and honest about what influenced them.
3. **Discovery, not transaction** — the product's job ends at the right recommendation and a clear path to the provider.
4. **Warm and premium** — the experience should feel like a lifestyle magazine, not a SaaS dashboard.
5. **Learn locally, respect privacy** — preferences are inferred from explicit card interactions stored in the browser, not from surveillance.
6. **Ship the smallest true experience** — validate the discovery loop before building infrastructure.

---

## Target user

Someone with discretionary free time (often weekends) who:

- Is open to memorable experiences near home or within a short trip
- Feels vague about what they want but clear about how they want to feel
- Values curation over endless browsing
- Is willing to complete a short questionnaire for better-fit results

The MVP dataset is oriented around Munich and Bavaria, but the product model is region-agnostic.

---

## User journey

The homepage is a **vertical story deck** — full-viewport sections the user scrolls through (mouse wheel, keyboard, or section dots).


| #   | Section               | Role                                                           |
| --- | --------------------- | -------------------------------------------------------------- |
| 1   | **Hero**              | Emotional entry — rotating inspiration lines, CTA to discovery |
| 2   | **Curated**           | Trust framing — Discover → Curate → Enjoy                      |
| 3   | **Trust transition**  | Bridge copy before the questionnaire                           |
| 4   | **Discovery**         | Five-question intent flow                                      |
| 5   | **Picked for you**    | Primary personalized recommendations                           |
| 6   | **Worth Discovering** | Secondary “hidden gems” rail                                   |
| 7   | **Footer**            | Emotional close + lab attribution + legal links                |


Sections 5–7 are always present. **Picked for you** shows a prompt to start discovery until the user completes the questionnaire and reveals results.

---

## Discovery flow

### Five questions

Implemented in `DiscoveryPanel` via `DISCOVERY_STEPS`:

1. **Purpose** — maps to `mood` (relax, learn, create, celebrate, connect, or any)
2. **When** — `when` (today, this weekend, next weeks, later); options adapt to time of day and day of week
3. **Distance** — `nearby`, `100km`, or `anywhere`
4. **Companions** — `alone`, `partner`, `friends`, `family`, `pet`, or `flexible`
5. **Budget** — `€`, `€€`, `€€€`, or `any`

As the user answers, a live **intent sentence** is composed (e.g. *“My friends and I want to connect this weekend, stay close to home, and I'm open to any budget.”*). Clicking the sentence restarts discovery.

### After the fifth answer

1. **Thinking** — brief animated interstitial (`DiscoveryThinking`)
2. **Ready** — “See your picks” reveal prompt (`DiscoveryRevealPrompt`)
3. On reveal — recommendations unlock for the session; user scrolls to **Picked for you**

### Persistence

- **Intent** → `localStorage` (`doDifferent_intent`) — survives browser restarts
- **Question progress** → `sessionStorage` (`doDifferent_discovery_step`) — per tab
- **Reveal state** → `sessionStorage` (`doDifferent_matches_revealed`) — per tab

---

## Recommendation engine

Implemented in `src/services/matchingEngine.js`. **Fully deterministic. No AI.**

### Scoring weights

Each experience event carries metadata: mood scores (0–100 per mood), tags, `when`, `distance`, `with`, and `budgetLevel`. The engine sums weighted dimensions:


| Dimension      | Weight    | Notes                                                                            |
| -------------- | --------- | -------------------------------------------------------------------------------- |
| Mood           | 30        | Uses per-event mood scores; `any` uses the event's strongest mood                |
| When (timing)  | 25        | Exact match or partial credit for adjacent windows                               |
| Distance       | 20        | Ranked: nearby → 100 km → anywhere                                               |
| Companions     | 15        | Includes pet-friendly heuristics for outdoor-tagged events                       |
| Budget         | 10        | Exact match or one-tier adjacency                                                |
| Tag preference | 8         | Nature/outdoor boost when `tagPreference === 'nature'` (not exposed in UI today) |
| Saved boost    | +5        | Events the user has loved                                                        |
| Learning boost | up to +12 | From `learningEngine` based on past love / tell-more signals                     |


### Thresholds and limits

- Events scoring below **45** are excluded (“strong match” threshold)
- **Picked for you** — top 10 ranked results
- **Worth Discovering** — next 10 ranked results not already in personalized
- **Not for me** — dismissed event IDs are filtered out before scoring

### Match reasons

Up to three human-readable reasons are attached to each card, derived from the score breakdown (mood fit, timing, distance, companions, budget, learning, or saved state). Copy is templated in `matchingEngine.js`, not generated by a model.

---

## Learning model

Implemented across `interactionStore.js` and `learningEngine.js`. Learning is **local-only** (`localStorage`).

### Interaction types


| UI label         | Type        | Effect on ranking                                                          |
| ---------------- | ----------- | -------------------------------------------------------------------------- |
| **Love it**      | `love`      | +5 learning signal weight; +5 saved boost; logged with intent snapshot     |
| **Tell me more** | `tell_more` | +8 learning signal weight (stronger than love); opens detail modal; logged |
| **Not for me**   | `dismiss`   | Event excluded from future results in this session/browser; logged         |
| *(implicit)*     | `rail_view` | Logged once per rail when carousel enters view; not used in scoring today  |


### How learning boosts work

1. Collect unique positive signals (`love` and `tell_more`; strongest weight wins per event)
2. For each candidate event, compute **similarity** to each positively interacted event:
  - 50% shared tags (Jaccard-style)
  - 50% aligned mood score profiles across six mood dimensions
3. Boost = Σ (similarity × signal weight), capped at **12**
4. If boost ≥ 4, a learning-based match reason may appear on the card

Interactions store the **intent at time of action**, enabling future analysis, though the MVP only uses event similarity for boosting.

### What learning is not

- Not collaborative filtering across users
- Not ML model training
- Not cloud-synced profiles

---

## Design philosophy

- **Editorial lifestyle** — serif headlines, warm neutrals, forest green accents, generous whitespace
- **Story deck** — one section per viewport; scroll-snap; pagination dots; keyboard navigation
- **Cards as conversation** — each experience leads with an emotional title and hook, not a price grid
- **Explain the pick** — “Why we thought of this” builds trust without black-box AI
- **Calm motion** — fades and transitions; respects `prefers-reduced-motion` in slideshows
- **Readable chrome** — translucent header over imagery; accessible focus states on modals and discovery

---

## Current MVP

### Homepage

- Hero with rotating inspiration lines and hero imagery
- Curated three-step trust cards (Discover / Curate / Enjoy)
- Discovery panel with image slideshow
- Always-visible recommendation sections with appropriate empty states
- Footer with atmospheric yoga imagery, closing copy, Curiosity in Motion attribution, and legal links

### Recommendations

- Horizontal centered carousels with dismiss-to-rotate deck behaviour
- “Picky mood” slide when the user exhausts the personalized deck
- Gems exhausted slide for the secondary rail

### Event detail modal

- Focus trap, Escape to close, scroll lock
- Metadata (intensity, group size, languages, best for)
- Match reasons
- **Open provider page** — external link to `providerUrl` (placeholder URLs in dataset)
- Placeholder hero image (not yet per-event)

### Imagery

Homepage and footer visuals use [Pixabay](https://pixabay.com) photography under the [Pixabay Content License](https://pixabay.com/service/license/), for **MVP demonstration only**. Per-event and production imagery are planned to be replaced with licensed or original assets before launch.

### Static pages


| Route      | Page                |
| ---------- | ------------------- |
| `/`        | Homepage            |
| `/contact` | Contact email       |
| `/privacy` | Privacy placeholder |
| `/terms`   | Terms placeholder   |
| `/partner` | Partner interest    |


### Data

~20 curated experiences in `src/data/events.js` — editorial copy, tags, mood scores, and provider metadata. No live provider integration.

### Analytics

Vercel Web Analytics (`@vercel/analytics/react`, production mode only).

---

## Out of scope

Explicitly **not** part of this MVP:

- Travel or event marketplace mechanics
- In-app booking, payments, or ticketing
- User accounts and authentication
- Provider dashboards or onboarding workflows
- AI-generated recommendations or copy
- Backend APIs, databases, or CMS
- Real-time availability or pricing
- Geo search, maps, or location permissions
- Push notifications or email journeys
- Multi-language product UI

---

## Future opportunities

If discovery validates, natural next steps include:

- **Provider partnerships** — real listings, availability, and verified imagery
- **Backend + accounts** — sync intent and learning across devices
- **Richer learning** — use stored intent snapshots, time decay, category affinities
- **Regional expansion** — datasets beyond Munich/Bavaria
- **Nature / outdoor preference** — wire `tagPreference` into the questionnaire (scoring already supports it)
- **AI assistance** — only where it improves copy or search, not as a replacement for explainable scoring
- **Challenge mood** — extend purpose options (engine supports `challenge` mood scores)

---

## Business context

### Curiosity in Motion

Do Different is a product experiment inside **Curiosity in Motion** — a personal lab for exploring product ideas through discovery, design, and shipping.

The lab follows a simple loop:

**Curiosity → Learning → Building → Shipping → Repeat**

Do Different tests the *discovery* hypothesis: can a thoughtful, intent-first conversation help people find experiences they would not have searched for themselves?

### Booking model

Revenue, bookings, and customer relationships belong to **experience providers**. Do Different's role is inspiration and fit — then a handoff.

### Validation goal

> This MVP is intended to validate the discovery experience before investing in backend infrastructure, provider onboarding, authentication, or AI.

Success signals in this phase:

- Users complete the five-question flow
- Users engage with recommendations (love, tell me more, dismiss)
- Users click through to provider pages
- Qualitative sense that the editorial tone and match reasons feel trustworthy

---

## Technical reference (for product readers)


| Concern   | Implementation                                  |
| --------- | ----------------------------------------------- |
| Framework | React + Vite SPA                                |
| State     | React hooks in `src/state/`                     |
| Ranking   | `rankExperiences()` in `matchingEngine.js`      |
| Learning  | `computeLearningBoost()` in `learningEngine.js` |
| Storage   | `localStorage` + `sessionStorage`               |
| Routing   | `src/utils/appRoute.js` — History API           |
| Styles    | Single CSS file with design tokens              |
| Deploy    | Static build (`dist/`) — e.g. Vercel            |


For setup and commands, see [README.md](./README.md).

---

## Legal

This repository is public for demonstration purposes only. All rights reserved — see [LICENSE](./LICENSE). Do Different™ and related materials may not be used, copied, or distributed without prior written permission from Curiosity in Motion.

Third-party images in `public/images/` are from Pixabay and remain subject to the [Pixabay Content License](https://pixabay.com/service/license/); they are used here for MVP purposes only.