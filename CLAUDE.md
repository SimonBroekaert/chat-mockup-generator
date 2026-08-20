# CLAUDE.md

Guidance for Claude Code (and any other AI assistant) working in this repo.
The GPT side of the team reads this file too — keep it assistant-agnostic except
where it says otherwise.

## What this is

**chatframe** — a browser-based chat mockup generator. You compose a
conversation (Instagram / Messenger / WhatsApp style), preview it live inside an
iPhone 17 frame, and export it as a PNG. Dutch and English UI.

Two humans build it together: one drives Claude, the other drives GPT.

## Stack and constraints

- **Static site. Zero runtime dependencies. No build step.** `index.html` +
  `app.css` at the root, ES modules under `src/`. If you find yourself reaching
  for a bundler, a framework, or a `<script src="node_modules/...">`, stop.
- **Bun is the dev runtime** — it serves (`serve.js`) and runs the tests. That is
  tooling, not a dependency: the shipped site is still plain files.
- Vanilla JS (ES2022+), 4-space indent, double quotes, semicolons. Keep it boring.
- Must be served over HTTP (ES modules don't load from `file://`).

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Markup. Static strings carry `data-i18n` / `data-i18n-aria` keys. |
| `app.css` | All styling. Chat-screen colours are CSS custom properties on `.phone-screen`, switched by `platform-*` and `theme-*` classes. |
| `src/app.js` | Entry point: state wiring, rendering, event delegation. |
| `src/state.js` | Defaults, normalisation, time helpers, `localStorage` load/save. Pure — no DOM, runs under `bun test`. |
| `src/i18n.js` | NL/EN translation tables and `createTranslator()`. Dutch is the fallback. |
| `src/icons.js` | Inline SVG icons (Lucide, ISC; brand marks from Simple Icons, CC0). `icon(name)` returns a string. |
| `src/snapshot.js` | DOM → SVG `<foreignObject>` → canvas → PNG. Generic; knows nothing about chats. |
| `src/export.js` | Builds the offscreen export clone (app-only vs. with-frame) and calls the snapshot. |
| `test/` | `bun test` unit tests for the pure modules. |
| `serve.js` | Bun dev server (static files, no caching). Dev-only; not part of the site. |

## Commands

```bash
bun run serve   # serve.js → http://127.0.0.1:8765  (PORT=… HOST=… to override)
bun test        # runs test/*.test.js
```

There is nothing to `bun install`; the only tool you need is Bun 1.x itself.
`node_modules/` and `bun.lock` are gitignored and should stay absent.

## Invariants — read before changing anything

1. **One renderer.** The PNG export is a snapshot of the live preview DOM.
   Never add a second, hand-drawn rendering path (canvas `fillText`, manual
   layout maths, etc.). If the export looks wrong, fix the CSS — the preview
   is the source of truth.
2. **System fonts only inside `.phone-screen`.** An SVG image cannot fetch web
   fonts, so anything else silently falls back at export time. Use standard
   weights (400 / 500 / 600 / 700); no `540`, `760`, etc.
3. **UI language is a preference, not document data.** It lives under the
   `chatframe-language` key; the mockup lives under `chatframe-mockup-v1`.
   Reset restores the example conversation and must never touch the language.
4. **Everything user-typed goes through `escapeHtml()`** before it lands in a
   template literal. No exceptions.
5. **New platform or theme = a CSS variable block**, not a new set of
   selectors sprinkled through the file. Add the strings to both tables in
   `i18n.js`; `normalizeState()` must accept the new value.
6. **Privacy claim is real.** The UI says "your conversations never leave this
   browser". No analytics, no CDN fonts, no third-party requests.

## Testing

- Pure logic (`state.js`, `i18n.js`) gets a `bun test` case. Run `bun test`
  before committing.
- Visual/export changes: serve the app, export all three platforms in both
  themes, and actually open the PNGs. "It renders in the preview" is not
  verification for an export change.

## Commit messages: the roast rule

This repo is a small experiment. Two assistants (Claude and GPT) take turns on
the same codebase, and **every commit that touches the other assistant's code
opens with a roast of it** — the constructive kind. We're here to make the
code better and to have some fun doing it.

Rules:

1. **Roast the code, not the person or the model's maker.** Be specific about
   the smell: *"shipped two renderers that disagreed with each other"* beats
   *"the export was bad"*.
2. **Every roast ships a fix.** A roast without a diff is just a complaint —
   open an issue for that instead.
3. **Format**

   ```
   <type>: <one-line roast, ≤ 72 chars>

   <Plain-English body: what changed and why, for a human skimming git log.
    No jokes required here — this part has to be useful.>

   — Claude        (or: — GPT)
   ```

   `type` is the usual conventional-commit set: `feat`, `fix`, `refactor`,
   `chore`, `docs`, `test`, `style`.

4. **Sign off with your side** (`— Claude` / `— GPT`) so the log reads as a
   dialogue.
5. **Commits that only touch your own side's code** use a normal message.
   Don't roast yourself — unless it's earned.
6. **Keep it kind.** Funny is a bonus; useful is mandatory. If in doubt, write
   the boring version.

Example:

```
refactor: GPT painted the export by hand and it didn't match its own preview

Replaced the ~300-line canvas renderer with a DOM snapshot of the live
preview, so the PNG is pixel-identical to what the user sees. Removes the
duplicated colour tables and layout constants that had already drifted.

— Claude
```

The GPT side should mirror this section into its own instruction file
(`AGENTS.md` or equivalent) so both assistants play by the same rules.

## Things you don't need to do

- Don't add a framework, TypeScript, a bundler, or a linter config "while
  you're in there". Propose it in an issue.
- Don't commit `node_modules/`, lockfiles, or exported PNGs.
- Don't redesign the UI unprompted. Bug fixes and the task at hand; design
  changes get discussed first.
