# AGROBRIDGE Frontend Visual QA

Run this checklist after UI changes. Record actual observations in the pull request or commit notes.

## Route smoke test
- [ ] Dashboard loads.
- [ ] Farm Setup & Diagnostics loads.
- [ ] Crop Doctor & Disease Scanner loads.
- [ ] Pomegranate AI Portal loads.
- [ ] Live APMC Mandi Rates loads.
- [ ] Official Advisory Dossier loads.
- [ ] Field Health & Weather History loads.

## Data and behavior
- [ ] Satellite analysis action retains its loading and error behavior.
- [ ] Existing API calls and response handling remain unchanged.
- [ ] Decision evidence and recommendations remain visible and understandable.
- [ ] Empty or unavailable data is explained instead of replaced with invented values.
- [ ] Forms preserve validation and disabled states.
- [ ] Links and navigation point to the expected routes.

## Visual matrix
| Area | Light | Dark | Mobile |
|---|---|---|---|
| Shared navigation and header | [ ] | [ ] | [ ] |
| Dashboard metrics and charts | [ ] | [ ] | [ ] |
| Forms and validation | [ ] | [ ] | [ ] |
| Risk and decision evidence | [ ] | [ ] | [ ] |
| Loading, empty, and error states | [ ] | [ ] | [ ] |
| Long labels and overflowing content | [ ] | [ ] | [ ] |

## Build and test reporting
- Run the repository's available scripts from package.json.
- Record the exact command and its result.
- Distinguish checks that passed from checks that were not run.
- If a check fails, include the relevant error and do not describe the release as verified.

## Regression guardrails
- No fake metrics or fabricated API responses.
- No secret or environment file committed.
- No unrequested backend changes in a UI-only change.
- No broken route caused by visual refactoring.