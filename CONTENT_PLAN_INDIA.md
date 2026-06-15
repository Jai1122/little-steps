# LittleSteps — Indian content revision plan

Status: **awaiting approval** (no JSON edited yet). Scope locked by user:
keep age-bucket model + add explicit normal-range windows; localize milestones to
IAP/TDSC norms; localize activities & toys; add Indian feeding & cultural notes.
(Songs/rhymes emphasis intentionally light.)

## Guiding principles
- **Indian norms as the spine:** IAP 2015 milestones + Trivandrum Developmental
  Screening Chart (TDSC), cross-checked with WHO windows of achievement.
- **Ranges, not deadlines:** every milestone gets a `typicalRange` window so a
  baby is never made to look "behind" for a week's variation.
- **Reassuring, non-medical tone** preserved. Feeding framed as gentle cultural
  guidance, not prescription; always defers to the pediatrician.
- **Keep the 15 buckets and IDs stable** so the store/progress data and tests
  don't break. We change *wording, timing, ranges, and add fields* — not the
  bucket keys.

## 1. Schema change (small, additive, back-compatible)
Add one optional field to `Milestone` in `src/content/types.ts`:

```ts
/** Compact normal-range window for display, e.g. "6 weeks – 4 months". */
typicalRange?: string;
```

- `rangeNote` (existing free-text reassurance) stays.
- New content-integrity test: **every** milestone must have a `typicalRange`.
- UI: render `typicalRange` as a small chip on the milestone row/detail
  ("Most babies: 6 wks–4 mo"). Minimal change to `MilestonesScreen`/detail.

## 2. Milestones — re-anchor to IAP/TDSC (same 71 IDs)
Adjust timing language and add `typicalRange` to all. Key Indian-norm shifts
(Indian medians run ~0.1–2.1 mo later than WHO on some motor items; Western
norms over-flag Indian motor/social delay):

| Milestone | Current framing | Revised anchor (IAP/TDSC/WHO) |
|---|---|---|
| Social smile (`w4_6_social`) | "~6–8 weeks" | keep; `typicalRange` "4–10 weeks" |
| Head steady (`m3_motor`) | 3 mo | `typicalRange` "2–4 months" |
| Rolls over (`m5_motor`) | 5 mo | `typicalRange` "4–7 months" |
| Sits w/o support (`m7_motor`) | 7 mo | `typicalRange` "6–9 months" (Indian slightly later) |
| Stranger wariness (`m8_social`) | 8 mo | `typicalRange` "6–10 months" |
| Crawls/scoots (`m9_motor`) | 7–10 mo | `typicalRange` "7–11 months" |
| Pulls to stand (`m10_motor`) | 10 mo | `typicalRange` "8–11 months" |
| Pincer grasp (`m9_motor2`) | 9 mo | `typicalRange` "8–12 months" |
| Cruising (`m11_motor`) | 11 mo | `typicalRange` "9–13 months" |
| Stands/steps (`m12_motor`) | 9–15 mo | `typicalRange` "9–15 months" |
| First words (`m12_language`) | 12 mo | `typicalRange` "9–14 months" |

Every other milestone gets a `typicalRange` in the same style; wording lightly
edited to Indian context (e.g. "turns to your voice", floor/mat play implied).

### Sample rewrite (m6 bucket) — illustrative
```json
{ "id": "mst_m6_motor", "ageBucket": "m6", "domain": "motor",
  "title": "Sits with support",
  "description": "Sits propped against a cushion or your body, briefly steady with hands down for balance.",
  "typicalRange": "5–8 months",
  "rangeNote": "Floor play on a firm mat or dhurrie helps build this — independent sitting often comes by 6–8 months." }
```

## 3. Activities — Indianise (keep IDs where possible, add a few)
Replace Western props with what's in an Indian home; add culturally-rooted play.

Edits:
- `act_reading`: "board books" → "cloth/board books; name pictures in your
  mother tongue."
- `act_textures`: props → "steel *katori*, wooden spoon, soft cotton cloth,
  *dupatta*."
- `act_stacking` / `act_container_play`: "blocks/cups" → "nesting steel
  *katoris* / stacking cups."
- `act_talk_sing`: "narrate in the language you speak at home; multilingual
  homes are an asset."
- `act_patacake`: add Indian clapping rhyme alternative.

New activities:
- **`act_malish`** (`w0_1`–`m3`, motor/social): daily oil massage (*malish*) —
  bonding + body awareness; gentle, baby-led.
- **`act_floor_mat_play`** (`m4`–`m8`, motor): play on a firm mat/*dhurrie* on
  the floor (the Indian norm) vs. propped seats; supports rolling/sitting.
- **`act_self_feeding`** (`m7`–`m12`, motor/cognitive): supervised
  self-feeding of soft Indian finger foods (idli pieces, soft *roti*, banana).

## 4. Toys — Indian-available, household-first (keep IDs)
- `toy_rattle` → "*jhunjhuna* / soft rattle" (locally ubiquitous).
- `toy_board_books` → "cloth/board picture books (bilingual if available)."
- `toy_stacking` / `toy_nesting` → "stacking cups or nesting steel *katoris*."
- `toy_music` → "*manjira*/bells, small *dholak* or shaker."
- Add **`toy_household`** (`m6`+, cognitive/motor): safe kitchen items — steel
  cups, lid, wooden spoon — "the best first toys are already in your kitchen."
- Keep mirror, teether, ball, play gym, busy toy (universal & available).

## 5. Feeding & cultural notes — NEW lightweight content type
Add `src/content/data/tips.json` + `CareTip` type, surfaced as a small
"For this stage" card section (Home or bucket view). Keeps feeding *out* of the
play-activity list where it doesn't belong.

```ts
export interface CareTip {
  id: string; ageBuckets: AgeBucket[];
  category: 'feeding' | 'care' | 'culture' | 'safety';
  title: string; body: string;
}
```

Seed tips:
- **m6 feeding:** "Starting solids (≈6 completed months): begin with single
  foods 3 days apart — *ragi* porridge, *moong dal* water, mashed banana,
  *suji*/rice *kheer* without sugar, soft *khichdi*. Breastmilk/formula stays
  primary. Ask your pediatrician about iron and allergens."
- **m6 culture:** "Many families mark first foods with *annaprashan* — a lovely
  milestone to celebrate."
- **m8 feeding:** "Move to lumpy textures — soft *khichdi*, mashed *dal*-rice,
  steamed veg fingers."
- **w0_1 care:** "Daily oil *malish* before bath is a calming bonding routine."
- **safety (all):** choking-hazard reminder for small/round foods and objects.

> Medical-safety note: feeding tips will carry a one-line "general guidance, not
> medical advice — confirm with your pediatrician" footer, mirroring the app's
> existing disclaimer.

## 6. Verification plan (unchanged rigor)
- Update `types.ts` + content-integrity test (every milestone has
  `typicalRange`; new `tips.json` validated; IDs/bucket coverage still pass).
- `npm run typecheck` (0 errors), `npm test` (all pass), update snapshot/UI for
  the new chip + tips section, Android emulator spot-check.
- Update PRD.md and CLAUDE.md to record the Indian-norm sourcing.

## Sources
IAP normal-development guideline; TDSC (Child Development Centre, Trivandrum);
WHO windows of achievement (2006); rural-North-India motor-milestone study;
VABS-II Indian norms; IAP/WHO complementary-feeding (6 months); Indian
6-month food charts.
