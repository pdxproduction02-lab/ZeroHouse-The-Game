# ZERO HOUSE — Phase 1 Prototype

A lightweight, mobile-responsive visual-novel prototype for **ZERO HOUSE: THE INVITATION**.

## What's included

- Title screen with New Game / Continue
- Episode 01 opening: Scene 1 — The Warning
- Dialogue presentation with speaker portraits
- Interactive examination of the ZERO HOUSE message
- Search-result beat and investigation progression
- Dialogue history
- Local progress saving with `localStorage`
- Keyboard support: `Enter` or `Space` to continue, `Escape` to close overlays
- Responsive layout for mobile and desktop

## Run locally

This is a static HTML/CSS/JavaScript project. You can open `index.html` directly in a browser, or use a local static server.

For example, with VS Code Live Server, open the project folder and serve `index.html`.

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload the contents of this folder (not the ZIP itself).
3. Import the repository into Vercel.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: `.` (root).
7. Deploy.

No environment variables or backend are required for this prototype.

## Project structure

```text
zero-house-game-phase1/
├── index.html
├── styles.css
├── README.md
├── assets/
│   ├── frightened-man.svg
│   ├── head-officer.svg
│   └── daichi.svg
└── src/
    └── main.js
```

## Story fidelity

This prototype implements only **Scene 1 — The Warning** from the supplied Episode 01 summary. Dialogue is adapted for interactive presentation while preserving the established events. It does not add a new ending, reveal the organization, or introduce a new character motive.

## Current prototype limitations

- Character art is original placeholder vector artwork, not final production portraits.
- The police-station background is composed from CSS shapes, not a finished illustrated background.
- The dialogue is a first-pass adaptation and should be reviewed by the creator before production.
- Scene 2 onward has not yet been implemented.
- Saves are browser-local and do not sync between devices.
