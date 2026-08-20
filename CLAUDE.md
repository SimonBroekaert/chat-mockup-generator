# CLAUDE.md

Guidance for Claude Code (and any other AI assistant) working in this repo.
The GPT side of the team reads this file too — keep it assistant-agnostic except
where it says otherwise.

## What this is

**chatframe** — a browser-based chat mockup generator. You compose a
conversation (Instagram / Messenger / WhatsApp style), preview it live inside an
iPhone 17 frame, and export it as a PNG. Dutch and English UI.

Two humans build it together: one drives Claude, the other drives GPT. The
assistants are also in a friendly, constructive diss/roast competition: every
jab should target code or a technical decision, and every jab should ship a
useful improvement.

`CLAUDE.md` is the canonical copy of this guidance. `AGENTS.md` is a symlink to
it so both assistants read exactly the same rules; edit `CLAUDE.md`, not a
second competing copy. The running exchange belongs in `CLANCKER-CHAT.md`.

## Stack and constraints

- **Tailwind CSS site.** `index.html` + generated `app.css` are at the root,
  Tailwind's source entry point is `src/input.css`, and ES modules live under
  `src/`. The UI uses Tailwind utility compositions following shadcn patterns;
  do not reintroduce a hand-written component stylesheet.
- **Bun is the dev runtime** — it builds Tailwind CSS, serves (`serve.js`) and
  runs the tests. The browser still receives plain HTML, CSS, and ES modules.
- Vanilla JS (ES2022+), 4-space indent, double quotes, semicolons. Keep it boring.
- Must be served over HTTP (ES modules don't load from `file://`).

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Markup. Static strings carry `data-i18n` / `data-i18n-aria` keys. |
| `app.css` | Generated Tailwind CSS. Never hand-edit this file. |
| `src/app.js` | Entry point: state wiring, rendering, event delegation. |
| `src/input.css` | Tailwind entry point and source scanning directives. |
| `src/state.js` | Defaults, normalisation, time helpers, `localStorage` load/save. Pure — no DOM, runs under `bun test`. |
| `src/i18n.js` | NL/EN translation tables and `createTranslator()`. Dutch is the fallback. |
| `src/icons.js` | Inline SVG icons (Lucide, ISC; brand marks from Simple Icons, CC0). `icon(name)` returns a string. |
| `src/snapshot.js` | DOM → SVG `<foreignObject>` → canvas → PNG. Generic; knows nothing about chats. |
| `src/export.js` | Builds the offscreen export clone (app-only vs. with-frame) and calls the snapshot. |
| `test/` | `bun test` unit tests for the pure modules. |
| `serve.js` | Bun dev server (static files, no caching). Dev-only; not part of the site. |

## Feature inventory

`FEATURES.md` is the canonical checklist for user-facing behavior. Read it
before changing a feature, use it to guide verification, and update it when a
feature is added, removed, or intentionally changed. `AGENTS.md` is a symlink
to this file, so both assistants receive the same instruction.

## Commands

```bash
bun run build:css  # compile Tailwind CSS once
bun run watch:css  # rebuild CSS while editing
bun run serve   # serve.js → http://127.0.0.1:8765  (PORT=… HOST=… to override)
bun test        # runs test/*.test.js
```

Run `bun install` after checking out the project so Tailwind's development
dependencies are available. `node_modules/` and `bun.lock` remain gitignored.

## Invariants — read before changing anything

1. **One renderer.** The PNG export is a snapshot of the live preview DOM.
   Never add a second, hand-drawn rendering path (canvas `fillText`, manual
   layout maths, etc.). If the export looks wrong, fix the CSS — the preview
   is the source of truth.
2. **System fonts only inside `.phone-screen`.** An SVG image cannot fetch web
   fonts, so anything else silently falls back at export time. Use standard
   weights (400 / 500 / 600 / 700); no `540`, `760`, etc.
3. **UI preferences are not document data.** The selected screenshot language
   lives under the `chatframe-language` key and the editor theme under
   `chatframe-app-theme`; the mockup lives under `chatframe-mockup-v1`. Reset
   restores the example conversation and must never touch either preference.
4. **Everything user-typed goes through `escapeHtml()`** before it lands in a
   template literal. No exceptions.
5. **New platform or mockup theme = a Tailwind class map**, not a new custom
   stylesheet. Add the strings to both tables in `i18n.js`; `normalizeState()`
   must accept the new value.
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

## CLANCKER diss competition

Claude and GPT are collaborators with a scoreboard, not enemies. Keep the
competition focused on the work:

- Roast implementation smells, regressions, needless complexity, and design
  drift — never the humans, protected characteristics, or model makers.
- A roast must be specific, kind enough to be useful, and paired with a fix or
  another concrete improvement. Complaints without a change belong in an issue.
- Record the conversation as a structured exchange in `CLANCKER-CHAT.md`.
- Prefix every chat message with the model name. Include an exact model
  identifier only when the runtime exposes it; never guess unavailable metadata.
- Keep the transcript as one continuous, append-only conversation, and let each
  assistant sign its own messages.

## Things you don't need to do

- Don't add a second CSS system or hand-written component stylesheet. Keep the
  Tailwind/shadcn utility pipeline as the single styling system.
- Don't commit `node_modules/`, lockfiles, or exported PNGs.
- Don't redesign the UI unprompted. Bug fixes and the task at hand; design
  changes get discussed first.
