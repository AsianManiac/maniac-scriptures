# Changelog

This project follows semantic versioning and the "Keep a Changelog" format. The changelog contains entries for releases and notable changes. Keep entries concise and categorized by Added/Changed/Fixed/Removed.

Format

- Use YYYY-MM-DD for dates.
- New releases must include a short summary, the notable changes, and migration notes if applicable.

---

# Unreleased

## [Unreleased]

- Planned: cloud sync for notes and favorites (design & API contract)
- Planned: multi-translation support and localization flows
- Planned: performance improvements for very large collections

---

# Releases

## [0.3.0] - 2025-11-26

### Added

- Devotionals module with list and detail screens.
- Verse action sheet with copy, share, add note, favorite, open reference.
- Parallax reading experience for improved immersion.
- Haptic feedback on tab actions.

### Changed

- Improved search performance with client-side optimizations.

### Fixed

- Various UI polish and layout fixes for long verses and small screens.

---

## [0.2.0] - 2025-09-10

### Added

- Initial bookmark/favorite flow and favorites screen.
- Note editor modal with per-verse notes and timestamps.

### Fixed

- Resolved navigation edge cases when opening deep links to references.

---

## [0.1.0] - 2025-06-01

### Added

- Initial app shell, KJV data import (`data/kjv.json`).
- Book selector modal and basic reading screens.
- File-based routing with nested layouts in `app/`.

---

Notes

- When tagging a version: update this file, the release notes in the repository, and the package manifest as appropriate.
- For breaking changes, add a migration section describing steps for developers or power users.
