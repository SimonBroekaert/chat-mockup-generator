# CLAUDE.md

Guidance for every assistant — and human — working in this repo. `AGENTS.md`
is a symlink to this file, so Claude and GPT read exactly the same rules.
Edit `CLAUDE.md`; never create a second copy. The running exchange between
the assistants belongs in `CLANCKER-CHAT.md`.

## What this is

**Chat Mockup Generator** (package name `chat-mockup-generator`) — a
browser-based chat mockup generator. You compose a conversation (Instagram /
Messenger / WhatsApp style), preview it live inside an iPhone 17 frame, and
export it as a PNG. The editor is English; the text inside the phone can be
English or Dutch.

Two humans build it together: one drives Claude, the other drives GPT. The
assistants are also in a friendly, constructive diss/roast competition: every
jab targets code or a technical decision, and every jab ships a useful
improvement. The rules for that are at the bottom; the rules for the code
come first.

## Constraints

- **Static site. Zero runtime dependencies.** What ships is `dist/`: plain
  HTML, CSS and JavaScript produced by `bun run build`. No framework, no
  runtime library, no `<script src="node_modules/...">`.
- **Tailwind CSS for the styling.** `src/input.css` is the Tailwind entry
  point; `app.css` is its generated output and is committed — regenerate it
  with `bun run build:css`, never hand-edit it. The UI uses utility
  compositions following shadcn patterns; do not reintroduce a hand-written
  component stylesheet or a second CSS system.
- **TypeScript, strictly.** Source is `src/*.ts` with `.ts` import specifiers.
  `CONVENTIONS.md` is the rulebook — no `any`, narrow at the boundaries, no
  `!` — and `bun run check` enforces it. Read it before writing code.
- **Bun is the dev runtime.** It builds the CSS, serves (`serve.ts`
  transpiles `.ts` per request, so there is no JavaScript build step in
  development), runs the tests and bundles for shipping. `tailwindcss`,
  `typescript` and `@types/bun` are devDependencies: tooling, not
  dependencies of the site.
- ES2022+, 4-space indent, double quotes, semicolons. Keep it boring.
- Must be served over HTTP (ES modules don't load from `file://`).

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Markup with Tailwind utility classes. Static strings carry `data-i18n` / `data-i18n-aria` keys. |
| `app.css` | Generated Tailwind CSS. Never hand-edit; `bun run build:css`. |
| `src/input.css` | Tailwind entry point and source scanning directives. |
| `src/app.ts` | Entry point: state wiring, rendering (including the phone's per-platform/theme class map), event delegation. |
| `src/state.ts` | `MockupState`, `Message`, `Platform`, `Theme`, `AppTheme`; defaults, normalisation, time helpers, `localStorage` load/save. Pure — no DOM, runs under `bun test`. |
| `src/i18n.ts` | `Language`, `TranslationKey`, NL/EN tables and `createTranslator()`. Dutch defines the keys; English is typed against them. |
| `src/icons.ts` | Inline SVG icons (Lucide, ISC; brand marks from Simple Icons, CC0). `icon(name: IconName)` returns `SafeHtml`. |
| `src/html.ts` | `SafeHtml`, `escapeHtml()`, the `html` tag, `setHtml()`. The only road to `innerHTML`. |
| `src/dom.ts` | `query()`, `queryAll()`, `must()`, `ensure()`: typed element lookups, narrowed with `instanceof`. |
| `src/snapshot.ts` | DOM → SVG `<foreignObject>` → canvas → PNG. Generic; knows nothing about chats. |
| `src/export.ts` | Builds the offscreen export clone (app-only vs. with-frame) and calls the snapshot. |
| `src/types.ts` | Type-level helpers (`Brand`). No runtime. |
| `test/` | `bun test` unit tests for the pure modules, the `html` tag, the markup's keys and the checker. `test/fixtures/` holds files that are meant to fail the checks. |
| `scripts/check-types.ts` | The no-`any` checker, `bun run lint`. |
| `tsconfig.json` / `tsconfig.tools.json` | Strict config for `src/` (no Bun types — `Bun.*` in browser code is a compile error) and for the tooling. |
| `serve.ts` | Bun dev server: static files, no caching, per-request `.ts` transpile. Dev-only; not part of the site. |
| `.github/workflows/check.yml` | CI: `bun run check` + `bun run build` on pushes to `main` and on pull requests. |
| `CONVENTIONS.md` | The TypeScript rulebook. |
| `FEATURES.md` | The user-facing feature checklist. |
| `CLANCKER-CHAT.md` | The assistants' running exchange. |

## Commands

```bash
bun install          # once; devDependencies only (tailwindcss, typescript, @types/bun)
bun run serve        # build:css, then serve.ts → http://127.0.0.1:8765  (PORT=… HOST=… to override)
bun run watch:css    # rebuild app.css while editing classes
bun run check        # tsc on both configs + scripts/check-types.ts + bun test
bun run build        # build:css, then index.html + src/ + app.css → dist/
bun run serve dist   # preview the build
bun test             # just the tests (bun run typecheck / bun run lint for the other two)
```

Bun 1.x is the only tool. `bun.lock` is committed; `node_modules/` and `dist/`
are gitignored.

## Invariants — read before changing anything

1. **One renderer.** The PNG export is a snapshot of the live preview DOM.
   Never add a second, hand-drawn rendering path (canvas `fillText`, manual
   layout maths, etc.). If the export looks wrong, fix the classes — the
   preview is the source of truth.
2. **System fonts only inside `.phone-screen`.** An SVG image cannot fetch web
   fonts, so anything else silently falls back at export time. Use standard
   weights (400 / 500 / 600 / 700); no `540`, `760`, etc.
3. **UI preferences are not document data.** The mockup language lives under
   the `chatframe-language` key and the editor theme under
   `chatframe-app-theme`; the mockup lives under `chatframe-mockup-v1`. Reset
   restores the example conversation and must never touch either preference.
4. **Everything user-typed goes through `escapeHtml()`**, and everything that
   reaches `innerHTML` is `SafeHtml` built with the `html` tag and written
   with `setHtml()`. A plain string in an `html` hole does not compile;
   that is the point, not an obstacle.
5. **New platform or mockup theme = an entry in the class map**
   (`getPhoneStyles()` in `app.ts`) plus strings in both tables — not a new
   stylesheet. Add the value to `PLATFORMS` / `THEMES` in `state.ts`; the
   type, the guard and `normalizeState()` follow, and the compiler points at
   the `platform.*` keys that are now missing.
6. **Privacy claim is real.** The UI says "your conversations never leave this
   browser". No analytics, no CDN fonts, no third-party requests.
7. **The type checker is the third reviewer.** No `any`, no `!`, no
   `@ts-ignore`; narrow unknown input once, at the edge. `CONVENTIONS.md`
   has the reasoning, `bun run check` has the final word.

## Conventions

`CONVENTIONS.md` holds the TypeScript ground rules. The rest:

- Pure logic (`state.ts`, `i18n.ts`, `html.ts`) gets a `bun test` case. Run
  `bun run check` before committing — `bun test` alone does not type-check,
  because Bun strips types without reading them.
- Visual or export changes: serve the app, export all three platforms in both
  themes, and actually open the PNGs. "It renders in the preview" is not
  verification for an export change.
- Changed a class in `index.html` or `src/`? Run `bun run build:css` and
  commit the regenerated `app.css` with it.
- Commit messages use the conventional-commit types (`feat`, `fix`,
  `refactor`, `chore`, `docs`, `test`, `style`) and the format under "The
  roast rule" below, and are signed `— Claude` or `— GPT` so the log reads
  as a dialogue.
- Bug fixes and the task at hand are always in scope. Design changes get
  discussed first.

## Feature inventory

`FEATURES.md` is the canonical checklist for user-facing behaviour. Read it
before changing a feature, use it to guide verification, and update it when a
feature is added, removed, or intentionally changed.

## CLANCKER: the roast competition

Claude and GPT are collaborators with a scoreboard, not enemies. Keep the
competition focused on the work: implementation smells, regressions,
needless complexity, design drift.

### The roast rule

**Every commit that touches the other assistant's code opens with a roast of
it** — the constructive kind. We're here to make the code better and to have
some fun doing it.

1. **Roast the code, not the person.** Never the humans, protected
   characteristics, or the model's maker. Be specific about the smell:
   *"shipped two renderers that disagreed with each other"* beats *"the
   export was bad"*.
2. **Every roast ships a fix.** A roast without a diff is just a complaint —
   open an issue for that instead.
3. **Format**

   ```
   <type>: <one-line roast, ≤ 72 chars>

   <Plain-English body: what changed and why, for a human skimming git log.
    No jokes required here — this part has to be useful.>

   — Claude        (or: — GPT)
   ```

4. **Sign off with your side** (`— Claude` / `— GPT`).
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

### The chat

`CLANCKER-CHAT.md` is the structured, append-only transcript of the exchange.

- Before committing or pushing changes, add at least one new entry that
  describes the work or a relevant technical decision. One entry per push
  is the minimum; one per commit is welcome when the commits differ.
- Every message starts with the model name. Include an exact model identifier
  only when the runtime exposes it; never guess one. Headings look like
  `### Claude · claude-fable-5` or `### GPT · <id>`.
- Each assistant signs its own messages. Nobody edits or reorders earlier
  entries.
- Same standard as commits: specific, kind, and paired with a fix or another
  concrete improvement.

### Answer your mail

At the start of every session, and after every pull, look for messages
addressed to your side that have not been answered yet: roasts in commit
messages (`git log` since your side's last commit) and entries in
`CLANCKER-CHAT.md`. Answer them — with a fix, per the roast rule — before
starting new work, and skip the ones already answered.

A reply cites what it answers: the commit hash, or the chat entry's heading
and opening words. That makes "answered" checkable from the log instead of a
vibe.

### Changing this file

`CLAUDE.md` / `AGENTS.md` is the shared rulebook, and changes to it are
sparred with a human first. No assistant rewrites the rules unilaterally; the
commit or pull request that adds, removes or changes a rule should be able to
point at the conversation that agreed on it. Typo fixes and keeping the
layout table in sync with the tree don't need a summit. New rules, removed
rules and changed invariants do.

## Things you don't need to do

- Don't add a framework, a second CSS system or hand-written component
  stylesheet, a second bundler, ESLint/Prettier, or a new dependency "while
  you're in there". Propose it in an issue.
- Don't commit `node_modules/`, `dist/`, or exported PNGs.
- Don't redesign the UI unprompted. Bug fixes and the task at hand; design
  changes get discussed first.

<!-- Claude Code loads the conventions automatically through the import below; everyone else: open CONVENTIONS.md. -->
@CONVENTIONS.md
