# Am I in a Story?

**Am I in a Story?** is a self-contained, deliberately overdramatic story-archetype quiz presented as **Dead Signal DOS**, a late-1980s EGA survival-horror terminal. It asks whether everyday events look like evidence of a fictional narrative, then presents a theatrical “Narrative Diagnostic” with a genre result and intentionally suspicious analytical readout.

The ordinary-life outcome is part of the joke and is intentionally common. The **Regular Miserable Person** category and its description are kept as authored: the quiz is not trying to turn ordinary life into a consolation prize or a medical diagnosis.

## How it works

- Each run selects 20 questions from a 30-question pool: two from each of 13 fictional story categories and four from the ordinary-life **Reality** category.
- The question order is randomized, so no two runs need to have the same sequence.
- “Yes” answers add trope points to the question’s category; “No” answers add none.
- The interface tracks a tongue-in-cheek **Reality Integrity** value and a deliberately randomized genre-signal display while the quiz is in progress. Its percentages and apparent prediction are unrelated to the final scoring, because the machine has opinions but no ethics.
- The result screen includes the winning story type, a short narrative and an intentionally misleading **Archetype Collider** report. Its category percentages, collision field, regression, coefficients and model diagnostics are randomized theatrical UI, not scientific measurements. The selected diagnosis is always presented as the dominant fabricated signal.

This is entertainment, not psychological, medical or other professional diagnosis. It does not infer anything reliable about the person taking it.

### Story categories

The quiz can identify these story patterns:

1. Destiny / Fantasy Hero
2. Young Adult Dystopian Hero
3. Anime / Manga Protagonist
4. Main Character Energy (Slice of Life)
5. Superhero / Comic Book Lead
6. Sitcom Character
7. Horror Movie Survivor (or Victim)
8. Mystery / Detective Protagonist
9. Romantic Comedy Lead
10. Tarantino Universe Character
11. Spielberg Adventure Hero
12. Lucas Space Opera Hero
13. Coppola Family Epic Character
14. Regular Miserable Person

## Run locally

There is no build step and no package installation. Open [`index.html`](./index.html) directly in a browser, or serve the directory locally:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

The quiz logic runs in the browser. The page imports its display fonts from Google Fonts when a network connection is available; the system font fallbacks keep the app usable offline.

## Controls

- `Enter` starts the diagnostic from the landing screen.
- `Y` records Yes while a quiz question is active.
- `N` records No while a quiz question is active.
- Every action is also available through native buttons for pointer, touch and assistive-technology users.

Input is locked during the short question transition, so repeated clicks or key presses cannot score the same question twice.

## Dead Signal scenes

Each category maps to three generated EGA-style screenshots under `assets/dead-signal/`. Production scenes follow these conventions:

- `960 × 720` pixels in 4:3 format
- WebP files, normally below 350 KB each
- original characters and environments without readable generated text, logos or recognizable copyrighted characters
- meaningful alternative text in the category model
- lowercase descriptive filenames such as `space-opera.webp`

Each category has a three-scene pool. A randomized assignment exhausts that pool before reuse and prevents immediate same-category repeats. The app preloads only the exact scene assigned to the next question. If a configured image is unavailable, `fallback.webp` replaces it and the failure is announced without interrupting the quiz.

## Deploy

This repository is a static site. Publish the repository root with GitHub Pages or any static hosting provider. `index.html` is the entry point; no server-side runtime or database is required.

## License

No license file is currently included. Add one before inviting third parties to reuse or redistribute the project.

## Development notes

- The app is split into three files with no build step: markup in `index.html`, presentation in `styles.css`, behavior in `app.js`. Keep it dependency-free.
- Preserve the intentionally theatrical tone and misleading-analysis presentation when changing the UI.
- Keep quiz answers and result text in the source of truth inside `app.js`.
- Test a fresh run, a replay, both answer buttons and the share action after behavior changes.
- Do not add personal data collection or persistent tracking without an explicit product decision.

Run the dependency-free checks with:

```bash
node tests/pure.test.mjs
node --test tests/pure.test.mjs
```

For browser verification, serve the app and check landing, 20-question completion, replay, sharing, keyboard controls and the `390 × 844`, `768 × 1024`, `1024 × 768` and `1440 × 900` layouts. The root `data-*` attributes expose the current screen, question, scene, transition and result state for automated probes.

## Project contents

| Path | Purpose |
| --- | --- |
| [`index.html`](./index.html) | App markup and the DOM contract for the three screens |
| [`styles.css`](./styles.css) | Dead Signal DOS theme, layouts and responsive rules |
| [`app.js`](./app.js) | Quiz logic, category model, questions and story copy |
| [`README.md`](./README.md) | Project overview and operating notes |
| [`.gitignore`](./.gitignore) | Excludes local plans, reviews and scratch artifacts |
| [`tests/pure.test.mjs`](./tests/pure.test.mjs) | Pure-logic, model-invariant and DOM-contract checks |
| [`assets/dead-signal/`](./assets/dead-signal/) | Forty-two generated category scenes and the local fallback scene |
