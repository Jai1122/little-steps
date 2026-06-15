# LittleSteps — Developer Notes

Cross-platform (iOS + Android) Expo app for new parents to track baby
developmental milestones (0–12 months) and get age-appropriate activity & toy
suggestions. Offline-first, no account. See [PRD.md](PRD.md) for full product spec.

## ⚠️ Node version

The system default `node` is **v14**, which is too old for Expo SDK 56.
Use the nvm-managed Node 22 binary for every command:

```bash
export PATH="$HOME/.nvm/versions/node/v22.17.1/bin:$PATH"
```

(or `nvm use 22` in an interactive shell).

## Commands

```bash
npm run start       # Expo dev server
npm run ios         # open in iOS simulator
npm run android     # open in Android emulator
npm run typecheck   # tsc --noEmit
npm test            # jest (data-layer unit + content-integrity tests)
npx expo-doctor     # config & dependency health check
npx expo export --platform ios --output-dir /tmp/x   # verify it bundles
```

## Running on the Android emulator (no Xcode here)

This machine has only Command Line Tools (no iOS Simulator), but the Android SDK
is present with a Pixel 6 AVD. To run the app live:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
emulator -avd Pixel_6_API_TiramisuPrivacySandbox -no-snapshot-save -no-boot-anim &
adb wait-for-device                       # then poll: adb shell getprop sys.boot_completed
# Node 22 on PATH (see above), then:
npx expo start --android                  # auto-installs SDK-matching Expo Go, opens app
```

All native deps (svg, datetimepicker, async-storage, expo-*) are Expo Go-
compatible, so no custom dev build is needed. Reopen after backgrounding:
`adb shell am start -a android.intent.action.VIEW -d "exp://<LAN-IP>:8081" host.exp.exponent`.
Screenshot: `adb exec-out screencap -p > /tmp/s.png`. Omit `CI=1` to enable hot reload.

## Stack

Expo SDK 56 · React Native 0.85 · React 19 · TypeScript (strict) ·
React Navigation v7 (bottom tabs + native stack) · AsyncStorage ·
expo-notifications · expo-image · date-fns.

## Structure

```
src/
  theme/        colors, spacing, typography, theme index
  navigation/   RootNavigator, TabNavigator, route types
  screens/      Home, Milestones, Activities, Toys, Settings, Onboarding
  components/    shared UI
  content/      static milestone/activity/toy data + query API (single source of truth)
    types.ts        canonical Domain + AgeBucket types, interfaces, type guards
    buckets.ts      age math + age→bucket mapping (pure, unit-tested)
    data/*.json     milestones, activities, toys (validated in content.test.ts)
    index.ts        public query API — screens import from `@/content` only
  notifications/ local weekly reminders (lazy-loaded expo-notifications)
  store/        persisted app state (AsyncStorage), single source of truth
    storage.ts      load/save/migrate one JSON blob under STORAGE_KEY
    StoreProvider   owns state, hydrates on mount, persists on change;
                    exposes useProfile / useProgress / useHydrated
    types.ts        Child/Settings/ProgressMap + SCHEMA_VERSION (for migrations)
  components/ui/ reusable kit: Screen, Card, DomainChip, PrimaryButton, Checkbox,
                ProgressRing (svg), SectionHeader, EmptyState, Illustration
  components/    ProfileForm (shared by onboarding + edit)
```

## Testing

- `npm test` runs jest (preset `jest-expo`). Suites: pure logic (`buckets`),
  data integrity (`content`), runtime context behavior (`store`), and an
  app-level render smoke test (`App.smoke`).
- Runtime render tests use RNTL **v13** + `react-test-renderer` pinned to the
  exact React version. `jest.setup.js` mocks `react-native-safe-area-context`
  (via its `/jest/mock` **.default**) and `@react-native-async-storage/async-storage`
  (its `/jest/async-storage-mock`) so providers render and persist in tests.
- The store suite covers save → rehydrate (unmount/remount loads from storage)
  and reset.

## Gotcha: `expo-notifications` crashes in Expo Go (SDK 53+)

Push was removed from Expo Go, and **importing** `expo-notifications` there throws
at module load. `src/notifications/reminders.ts` therefore (1) detects Expo Go via
`Constants.executionEnvironment === StoreClient` and (2) lazily `require()`s the
module only outside Expo Go, inside try/catch. Reminders no-op in Expo Go (the
Settings toggle shows a "notifications are off" alert) and work in a **development
or standalone build**. To fully test reminders, make a dev build (`expo run:android`).

## Gotcha: `expo start --android` with `CI=1` serves a STALE bundle

`CI=1` disables Metro's file watcher, so after editing code, a reopened app
loads the **cached** bundle, not your changes. For live testing of edits, run
`npx expo start --android` **without** `CI` (watch + hot reload). A fresh full
bundle logs `(NNNN modules)`; an incremental one logs `(1 module)`.

## Content model

- 15 age buckets, 0–12 months: `w0_1 w2_3 w4_6 w7_9 w10_13` (weeks) then
  `m3`–`m12` (months). Ranges are contiguous day-spans in `buckets.ts`.
- 4 domains: `motor cognitive social language`. Every bucket has ≥1 milestone in
  each domain (enforced by test).
- Content is **targeted at Indian families**. Milestone timing/wording is
  anchored to Indian norms — IAP (Indian Academy of Pediatrics) milestones and
  the Trivandrum Developmental Screening Chart (TDSC) — cross-checked with WHO
  windows of achievement. Activities/toys use Indian household play (katori,
  jhunjhuna, malish, floor/dhurrie play); `tips.json` carries feeding & cultural
  guidance (solids ≈6 months: ragi/dal/khichdi, annaprashan, choking safety).
- **No literal weekly milestones.** Normal ranges are months wide, so every
  milestone carries a `typicalRange` window (e.g. "6–9 months") rather than a
  single "due" week. Required on every milestone (enforced by test).
- `image` fields are string *keys*, not paths — the UI maps them to bundled
  illustrations/placeholders, keeping data decoupled from assets.
- `tips.json` (`CareTip`) is feeding/care/culture/safety content, surfaced as a
  "For this stage" card section on Home — kept separate from play activities.
- Screens must use the `@/content` query helpers, never import the JSON directly,
  so the source can later move to a CMS/API behind the same API.

## Conventions

- **Imports:** cross-folder imports use the `@/` alias (`@/theme`, `@/screens/...`),
  same-folder imports stay relative (`./colors`). The alias is defined once in
  `tsconfig.json` `paths` and resolved by both TypeScript and Metro (Expo SDK 56
  tsconfig-paths support — no Babel plugin needed).
- Screens use **default** exports (one screen per file); shared components and
  utilities use **named** exports.
- Strict TypeScript. Import theme tokens from `@/theme` — no hard-coded colors.
- Accessibility: label interactive elements, keep tap targets ≥ 44pt, never
  convey state by color alone.
- All copy frames development as ranges ("many babies…"), never "should".
