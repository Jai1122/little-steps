# LittleSteps — Product Requirements Document

> Working name: **LittleSteps** · Status: **Draft for approval** · Date: 2026-06-14
> A cross-platform mobile app for new parents to track baby developmental milestones (0–12 months) and get age-appropriate activity & toy suggestions.

---

## 1. Problem Statement

New parents are flooded with conflicting information about what their baby "should" be doing and how to support development. They want a simple, trustworthy, calming companion that:

- tells them what's developmentally relevant **right now** for their baby's age,
- lets them **track** which milestones their baby has reached without anxiety,
- gives **concrete, age-appropriate activities and toys** to encourage development,
- works **offline, privately, with zero setup friction** (no account required).

Existing apps (BabyCenter, Wonder Weeks, Kinedu) are either content-heavy and cluttered, subscription-gated, or require accounts and connectivity. LittleSteps aims for a focused, offline-first, free MVP.

## 2. Target Users

- **Primary:** First-time **Indian** parents of a 0–12 month old, moderately tech-comfortable, time-poor, often using the app one-handed while holding a baby.
- **Secondary:** Experienced parents wanting a lightweight tracker; caregivers/grandparents.
- **Context of use:** Short, frequent sessions (1–3 min), often late at night, low cognitive load required.

**Localization (Indian focus):** Milestone timing and language are anchored to Indian developmental norms — **IAP** (Indian Academy of Pediatrics) milestones and the **Trivandrum Developmental Screening Chart (TDSC)** — cross-checked with **WHO windows of achievement**. Applying Western/CDC norms unmodified over-flags motor/social delay in Indian babies, so content is range-based (every milestone shows a `typicalRange`, never a single "due" week). Activities, toys, feeding and cultural tips reflect Indian homes (katori/jhunjhuna play, oil *malish*, floor/*dhurrie* play, solids ≈6 months with ragi/dal/khichdi, *annaprashan*). English-only for MVP, i18n-ready.

## 3. Goals & Non-Goals

**Goals (MVP)**
- Personalized "this week/month" view from the baby's birth date.
- Browsable, checkable milestone list across 4 developmental domains.
- Activity and toy suggestions tied to age and domain.
- 100% offline, no login, private by default.
- Calm, accessible, friendly UX.

**Non-Goals (MVP)**
- No cloud sync, accounts, or multi-device backup.
- No multiple-children switching (architecture will allow it later).
- No growth charts / photo galleries.
- No preemie corrected-age adjustment.
- No AI-generated content; no ads; no paywall.
- No medical diagnosis — explicit "not medical advice" framing.

## 4. Feature List & Priorities

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| F1 | Child profile setup (name, birth date, optional avatar/photo) | **MVP** | Required for personalization |
| F2 | Home/dashboard ("this week" summary) | **MVP** | Age, current focus, quick links |
| F3 | Weekly/monthly milestone view | **MVP** | Content for baby's current age bucket |
| F4 | Milestone tracker / checklist (check off + progress) | **MVP** | Persisted locally |
| F5 | Activity suggestions with images | **MVP** | Filtered by age + domain |
| F6 | Toy recommendations | **MVP** | Tied to age + developmental domain |
| F7 | Local reminders / notifications | **MVP** | Weekly "new content" nudge + opt-in |
| F8 | Onboarding flow | **MVP** | First-run profile creation |
| F9 | Settings (edit profile, notifications, reset, disclaimers) | **MVP** | |
| F10 | Multiple children profiles | Future | Data model designed to support |
| F11 | Growth tracking (weight/height + charts) | Future | |
| F12 | Photo gallery / memories | Future | |
| F13 | Cloud sync + accounts | Future | |
| F14 | Preemie corrected age | Future | |
| F15 | Localization (multi-language) | Future | i18n-ready strings now |
| F16 | Freemium/premium tier | Future | |

## 5. Personalization Logic

- **Input:** baby birth date.
- **Derived age:** age in days → weeks → months. Display granularity:
  - Weeks for **0–13 weeks** (development moves fast early).
  - Months for **3–12 months**.
- **Current bucket:** map age to a content "age bucket" key (see §7).
- **Edge cases:** future birth date blocked in UI; baby > 12 months shows a friendly "content for 0–12 months" state and pins to the 12-month bucket.

## 6. User Flows

**6.1 First run / onboarding**
1. Splash → 2–3 intro slides (value prop, privacy, not-medical-advice) → "Add your baby".
2. Profile form: name, birth date (date picker), optional photo. → Save locally.
3. Optional: enable reminders (permission prompt). → Land on Home.

**6.2 Daily/weekly use**
- Open → Home shows baby age, "this week's focus", milestone progress ring, quick cards (Milestones, Activities, Toys).

**6.3 Track a milestone**
- Milestones tab → list grouped by domain → tap checkbox → state + date persisted → progress updates on Home.

**6.4 Find an activity / toy**
- Activities tab → cards filtered to current age, filter chips by domain → detail view (image, how-to, why it helps, domain). Toys tab similar.

**6.5 Edit profile / settings**
- Settings → edit birth date/name, toggle reminders, view disclaimer, reset data.

## 7. Content Structure (Data Model — Content)

Content is **static JSON bundled in the app**, organized by age bucket and developmental domain.

**Domains (categories):** `motor` (gross + fine), `cognitive`, `social` (social/emotional), `language`.

**Age buckets (0–12 months):**
`w0_1`, `w2_3`, `w4_6`, `w7_9`, `w10_13` (weeks), then `m4`, `m5`, `m6`, `m7`, `m8`, `m9`, `m10`, `m11`, `m12` (months).

```jsonc
// milestones.json
{
  "id": "mst_m4_motor_pushup",
  "ageBucket": "m4",
  "domain": "motor",
  "title": "Pushes up on forearms during tummy time",
  "description": "Lifts head and chest, bearing weight on forearms.",
  "isTypicalRangeNote": "Many babies do this between 3–5 months."
}
```

```jsonc
// activities.json
{
  "id": "act_m4_tummytime_mirror",
  "ageBuckets": ["m4", "m5"],
  "domains": ["motor", "cognitive"],
  "title": "Mirror tummy time",
  "summary": "Place an unbreakable mirror during tummy time.",
  "steps": ["Lay baby on tummy", "Prop a mirror in front", "Talk and point"],
  "whyItHelps": "Encourages head control and visual tracking.",
  "image": "activities/mirror_tummy.png",
  "durationMin": 5
}
```

```jsonc
// toys.json
{
  "id": "toy_m4_softrattle",
  "ageBuckets": ["m4", "m5", "m6"],
  "domains": ["motor", "cognitive"],
  "title": "Soft grasping rattle",
  "description": "Lightweight rattle that's easy to grip and shake.",
  "developmentalBenefit": "Builds grasp and cause-and-effect understanding.",
  "image": "toys/soft_rattle.png"
}
```

All user-facing strings stored so they can be externalized for i18n later. Images referenced by relative path; MVP ships **placeholder illustrations** (final art sourced/licensed before launch).

## 8. Data Model (Local User State)

Persisted via local storage (AsyncStorage for MVP; structured to migrate to SQLite/cloud later).

```ts
type Child = {
  id: string;
  name: string;
  birthDate: string;   // ISO
  photoUri?: string;
  createdAt: string;
};

type MilestoneProgress = {
  childId: string;
  milestoneId: string;
  achieved: boolean;
  achievedAt?: string; // ISO
};

type Settings = {
  remindersEnabled: boolean;
  reminderWeekday?: number;
  hasOnboarded: boolean;
};

// Root persisted shape (array of children to allow F10 later)
type AppState = {
  children: Child[];
  activeChildId?: string;
  progress: MilestoneProgress[];
  settings: Settings;
  schemaVersion: number;
};
```

## 9. Screen-by-Screen UI

1. **Onboarding** — intro carousel + profile creation form. Pastel illustrations, single primary CTA per screen.
2. **Home / Dashboard** — header (baby name, age "4 months / 18 weeks"), "This week's focus" card, milestone progress ring, three quick-action cards (Milestones, Activities, Toys), reminder hint. Empty state if no progress yet.
3. **Milestones** — segmented/grouped list by domain, each row = title + checkbox + info tap; progress summary on top; tap row → milestone detail sheet.
4. **Activities** — scrollable card grid/list filtered to current age; domain filter chips; card = image, title, duration; tap → Activity detail (steps, why it helps).
5. **Toys** — list of toy cards (image, title, benefit, domains).
6. **Activity / Toy / Milestone detail** — full content, domain tags, back navigation.
7. **Settings** — edit profile, notifications toggle, disclaimer, reset data, about/version.

**Navigation:** Bottom tab bar — Home · Milestones · Activities · Toys · Settings (5 tabs; Toys could fold under Activities if we want 4). Stack navigators inside each tab for detail screens.

## 10. Design System

- **Palette:** soft pastels — primary mint/sage green, secondary warm peach, accent soft lavender, neutral warm off-white background, dark slate text. WCAG AA contrast for text.
- **Typography:** rounded, friendly sans (e.g., Nunito / system rounded). Large tap targets (≥44px). Dynamic type support.
- **Components:** rounded cards, soft shadows, generous spacing, flat illustrations.
- **Tone:** warm, reassuring, non-judgmental; always frame ranges ("many babies…"), never "should".
- **Accessibility:** semantic labels, screen-reader support, scalable text, color-independent state (checkmarks + labels, not color alone).

## 11. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Expo (React Native)** + TypeScript | Fast cross-platform, OTA, easy local-first |
| Navigation | React Navigation (bottom tabs + native stack) | Standard, mature |
| State | React Context + reducer (or Zustand) | Lightweight for local-only app |
| Persistence | AsyncStorage (MVP) → SQLite later | Simple JSON state now, migratable |
| Content | Bundled JSON in `/src/content` | Offline, fast |
| Notifications | `expo-notifications` (local) | Local reminders, no server |
| Images | `expo-image`, bundled assets | Performance + caching |
| Dates | `date-fns` | Age calculations |
| Testing | Jest + React Native Testing Library | Unit + component |
| Lint/format | ESLint + Prettier | Consistency |

## 12. Content & Legal Notes

- **Disclaimer:** prominent "Not medical advice; consult your pediatrician" on onboarding and Settings.
- **Milestone framing** based on widely published developmental ranges; reviewed for accuracy before launch.
- **Image licensing:** MVP uses placeholder/original illustrations; final assets must be royalty-free/licensed or commissioned before public release.
- **Privacy:** no data leaves device in MVP; no analytics by default (or privacy-friendly, opt-in only).

## 13. Proposed Build Stages (Iterative)

1. **Stage 0 — Scaffold:** Expo + TS project, navigation, theming, folder structure.
2. **Stage 1 — Data layer:** content JSON (milestones/activities/toys for 0–12 mo buckets), TypeScript types, content access helpers, age→bucket logic.
3. **Stage 2 — Core screens:** Onboarding/profile, Home, Milestones, Activities, Toys, detail screens (with placeholder images).
4. **Stage 3 — Tracking & persistence:** local storage layer, milestone check-off, progress on Home, settings.
5. **Stage 4 — Polish:** reminders, empty states, accessibility pass, animations, icon/splash.

**Check-in after each stage before proceeding.**

## 14. Success Criteria (MVP)

- Parent can create a profile and see correct age-appropriate content in < 60s.
- Milestone progress persists across app restarts.
- App fully usable offline and with no account.
- Passes a basic accessibility audit (labels, contrast, dynamic type).

## 15. Open Questions

- Final app name & branding.
- Tab count: keep Toys as its own tab, or nest under Activities (4 tabs)?
- Depth of content per bucket for MVP (e.g., target ~4–6 milestones, ~3–5 activities, ~3 toys per bucket?).
- Source for final illustrations (commission vs. licensed library).
