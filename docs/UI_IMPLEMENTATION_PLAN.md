# Frontend UI Implementation Plan

## Phase 1 — Audit
- Confirm the active app shell, routes, CSS imports, and cascade order.
- Trace global styles and page-specific styles before editing.
- Identify duplicate selectors and overlapping style systems.
- Record current theme behavior and any persistence mechanism.
- Capture baseline behavior for API-backed components.

## Phase 2 — Shared design tokens
Define theme tokens for page and elevated surfaces, glass surfaces and borders, primary/secondary/muted text, brand accent and semantic status colors, shadows, radii, spacing, typography, focus indicators, and motion preferences. Keep tokens centralized and avoid parallel competing theme systems.

## Phase 3 — Shared layout
Update the existing layout in place: sidebar and active navigation; farm context widget; sticky top bar and status banner; main content width and spacing; mobile navigation; hover, active, disabled, and keyboard-focus states.

## Phase 4 — Reference page
Use the Dashboard to validate the design system first. Keep existing data flow and decision components intact, then reuse proven tokens and component patterns on other pages.

## Phase 5 — Remaining pages
Apply consistent patterns to Diagnostics, Crop Doctor, Pomegranate AI Portal, Mandi Rates, Advisory Dossier, and Field Health & Weather History.

## Phase 6 — Verification
- Check light and dark themes.
- Check desktop, tablet, and mobile widths.
- Check loading, empty, error, and long-content states.
- Check keyboard focus and reduced-motion behavior.
- Run available lint/build/test commands and report actual results.
- Review network and console errors when browser testing is available.

## Non-negotiable safeguards
- Do not rename or remove routes.
- Do not change backend API contracts as part of a visual-only task.
- Do not replace live data with mock data.
- Do not introduce hard-coded success states.
- Do not claim tests passed unless they were run.
- Keep changes incremental and reviewable.