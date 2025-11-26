# 📖 Bible App — Comprehensive Documentation

Welcome — this document is the single source of truth for this repository. It describes the application, lists every implemented feature, documents development and release processes, and provides guidance for contributors and maintainers.

This app is a cross-platform Bible reader and study tool built with Expo + React Native + TypeScript. It ships with the King James Version (KJV) as a bundled JSON and delivers a polished, offline-first reading experience with search, notes, devotionals, favorites, and more.

---

## 🚀 Quick Summary

- Platform: Expo (React Native) — runs on iOS, Android, and Web.
- Language: TypeScript
- Offline-first: Bible text is bundled in `data/kjv.json`.
- Main folders:
  - `app/` — route-driven screens and layouts
  - `components/` — UI components & modals
  - `constants/` — theme and color tokens
  - `data/` — Bible data and static seeds
  - `stores/` — app state and persistence
  - `utils/` — parsing and helper utilities

---

## ✅ Features (exhaustive list)

Below is a thorough listing of all features implemented in the codebase. This is intended for product managers, reviewers, and contributors.

Reading & Navigation

- 📚 Full KJV text included at `data/kjv.json`.
- 🔀 Book and chapter navigation via a book selector modal component.
- 📜 Parallax reading layout for a modern reading experience (`parallax-scroll-view.tsx`).
- 🔗 Reference parsing to jump directly to verse/chapter locations.

Search & Discovery

- 🔎 Client-side full-text search across all verses (`search.tsx`, `utils/bible-api.ts`).
- 🤖 Intelligent query parsing for reference-looking strings.

Notes, Bookmarks & Favorites

- 📝 Per-verse notes via `note-editor-modal.tsx`.
- 🔖 Bookmarking and favorites with a dedicated favorites view and quick actions.

Devotionals & Content

- 📆 Devotionals module with list and details (`app/(tabs)/(devotionals)/`).

Verse Actions & Sharing

- ⚙️ Verse action sheet (`verse-action-sheet.tsx`) to copy, share, add note, favorite, view reference.
- 📤 Native share integration for verses and references.

UI, Theming & Accessibility

- 🎨 Light & dark themes with themed primitives (`themed-text.tsx`, `themed-view.tsx`).
- ♿ Accessibility-aware components (labels, roles) and color tokens defined in `constants/colors.ts`.

UX & Native Feel

- 👆 Haptic feedback on tab interactions via `haptic-tab.tsx`.

Developer Experience & Utilities

- 🧰 Modular component architecture under `components/` and `components/ui/`.
- 🗂️ App-level store in `stores/bible-store.ts` for notes, favorites, and settings.
- 🔧 Utility functions and parsing in `utils/bible-api.ts` (verse parsing, reference formatting, search helpers).

Other

- ⚡ Performance-conscious patterns: lazy rendering for long lists, possible indexing points for search.
- 🔒 Local-only data model for the primary Bible text and user content.

---

## 🗂️ File map (important files)

- `app/_layout.tsx` — root app layout and navigation scaffolding.
- `app/search.tsx` — search UI and logic.
- `components/book-selector-modal.tsx` — book selection modal.
- `components/note-editor-modal.tsx` — note creation/editing modal.
- `components/verse-action-sheet.tsx` — actions for a verse.
- `stores/bible-store.ts` — central store for notes, favorites, and settings.
- `utils/bible-api.ts` — parsing and search helpers.

---

## 🛠️ Local development & scripts

Prerequisites

- Node.js (>=16 recommended)
- Expo CLI (optional, `npx expo` is fine)

Install dependencies

```bash
npm install
# or
bun install
# or
yarn install
```

Start development server

```bash
npm run dev
# or
npx expo start
```

Run tests

```bash
npm run test
```

Building

```bash
expo build:android
expo build:ios
```

Notes

- If you use `bun`, prefer `bun install` and `bun run` where available.

---

## 🧠 Architecture & design decisions

Principles

- Local-first: primary content and UX must work without network connectivity.
- Separation of concerns: UI components are presentation-only; business logic and parsing live in `utils/` and `stores/`.
- Small, testable functions for core logic (verse parsing & search ranking).

Data contract (models)

- Verse: { book: string, chapter: number, verse: number, text: string }
- Note: { id: string, verseRef: string, text: string, createdAt: ISO, updatedAt: ISO }
- Favorite: { id: string, verseRef: string, createdAt: ISO }

Error modes and fallback behavior

- Network failure: app falls back to bundled JSON.
- Data corruption: store migration path and export/import feature recommended.

---

## 🔍 Testing recommendations

Unit tests

- Focus: `utils/bible-api.ts` (parseReference, formatReference, search ranking).

Component tests

- Focus: `note-editor-modal`, `verse-action-sheet`, `book-selector-modal`.

E2E tests

- Flows: onboarding -> open book -> search -> add note -> favorite -> restore.

CI

- Add GitHub Actions for lint + test + build. Optionally include an E2E job for release candidates.

---

## ♻️ Data & persistence

- Primary data: `data/kjv.json` (bundled).
- User content: notes and favorites stored locally via platform-appropriate storage APIs (AsyncStorage / SecureStore). Consider an abstraction for future cloud sync.

Backup & export

- Add an export/import JSON feature so users can back up notes and favorites.

---

## 🔐 Security & Privacy

- No external telemetry by default. If adding analytics or cloud sync, require explicit opt-in and document the privacy policy.
- If cloud sync is added, encrypt data in transit and at rest and minimize personally-identifying information.

---

## 🧭 Contribution & maintenance

How to contribute

1. Open an issue to discuss major features or bugs.
2. Create a branch `feature/` or `fix/` from `main`.
3. Add tests and documentation for non-trivial changes.
4. Open a PR and request review.

Coding conventions

- TypeScript with strict types where practical.
- Linting via `eslint.config.js`.

Maintainer checklist for releases

- Update `CHANGELOG.md` with semantic-versioned notes.
- Test on iOS and Android devices.
- Verify app assets and store screenshots are up-to-date.

---

## 📦 Release & changelog

See `CHANGELOG.md` for a historical log of releases and notes. Use semantic versioning and keep entries short and meaningful.

---

## 🧾 Publishing checklist (app stores)

Before submitting to App Store / Play Store:

- [ ] Replace placeholder assets in `assets/images/` with store-ready screenshots.
- [ ] Fill in privacy policy and contact information.
- [ ] Verify app permissions and explain usage in store listing.
- [ ] Run an accessibility pass and confirm screen-reader flows.

---

## ❓ Frequently asked questions (FAQ)

Q: Can I add other Bible translations?

A: Yes — the app is designed to support multiple data sources. Add a new JSON file and implement a small adapter in `utils/` to surface the text in the same Verse model.

Q: Where are notes stored?

A: Notes are stored locally using the pattern in `stores/bible-store.ts`. Consider adding export/import or cloud sync for cross-device continuity.

---

## 📄 LICENSE

Add a `LICENSE` file with your chosen license (MIT recommended for open-source projects) and update repository metadata.

---

## 📞 Contact

For maintainers: open issues or PRs in this repository. For enterprise usage, consider adding a dedicated contact email in repository settings.

---

If you'd like, I can now:

- Draft the `CHANGELOG.md` (detailed release entries),
- Create a full `ROADMAP.md` with milestones and KPIs, or
- Generate App Store / Play Store copy and screenshots suggestions.

Tell me which of these you'd like next.
