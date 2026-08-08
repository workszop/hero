# Am I in a Story?

**Am I in a Story?** is a self-contained, deliberately overdramatic story-archetype quiz. It asks whether everyday events look like evidence of a fictional narrative, then presents a theatrical “Narrative Diagnostic” with a genre result and intentionally suspicious analytical readout.

The ordinary-life outcome is part of the joke and is intentionally common. The **Regular Miserable Person** category and its description are kept as authored: the quiz is not trying to turn ordinary life into a consolation prize or a medical diagnosis.

## How it works

- Each run selects 30 questions: two from each of 13 fictional story categories and four from the ordinary-life **Reality** category.
- The question order is randomized, so no two runs need to have the same sequence.
- “Yes” answers add trope points to the question’s category; “No” answers add none.
- The interface tracks a tongue-in-cheek **Reality Integrity** value and a live genre prediction while the quiz is in progress.
- The result screen includes the winning story type, a short narrative, category breakdowns and the intentionally misleading **Narrative Intelligence Engine v2.7.4** dashboard. Its confidence, gauges and session-style metrics are theatrical UI, not scientific measurements.

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

## Deploy

This repository is a static site. Publish the repository root with GitHub Pages or any static hosting provider. `index.html` is the entry point; no server-side runtime or database is required.

## License

No license file is currently included. Add one before inviting third parties to reuse or redistribute the project.

## Development notes

- Keep the app self-contained in `index.html` unless a change genuinely requires another file.
- Preserve the intentionally theatrical tone and misleading-analysis presentation when changing the UI.
- Keep quiz answers and result text in the source of truth inside `index.html`.
- Test a fresh run, a replay, both answer buttons and the share action after behavior changes.
- Do not add personal data collection or persistent tracking without an explicit product decision.

Run the dependency-free checks with:

```bash
node --test tests/pure.test.mjs
```

## Project contents

| Path | Purpose |
| --- | --- |
| [`index.html`](./index.html) | The complete app: markup, styles and quiz logic |
| [`README.md`](./README.md) | Project overview and operating notes |
| [`.gitignore`](./.gitignore) | Excludes local plans, reviews and scratch artifacts |
| [`tests/pure.test.mjs`](./tests/pure.test.mjs) | Pure-logic, model-invariant and DOM-contract checks |
