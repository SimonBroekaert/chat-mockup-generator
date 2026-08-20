# Chat Mockup Generator

Browser-based chat mockup generator for Instagram, Messenger, and WhatsApp-style conversations.

See [FEATURES.md](FEATURES.md) for the current feature checklist and expected behavior, and
[CONVENTIONS.md](CONVENTIONS.md) for the TypeScript ground rules.

Tailwind CSS with shadcn-style utility compositions, HTML, and TypeScript ES modules — with zero
runtime dependencies. [Bun](https://bun.sh) builds the stylesheet, serves the sources directly during
development, runs the checks, and bundles the site for shipping. It is the only tool you need.

## Run locally

The app uses ES modules, so it has to be served over HTTP (opening `index.html` from disk won't work).

```bash
bun install            # once: Tailwind, TypeScript and Bun's types (dev tooling only)
bun run serve          # compiles Tailwind, then serves on http://127.0.0.1:8765
```

Open [http://localhost:8765](http://localhost:8765). Stop the server with `Ctrl+C`.
It binds to `127.0.0.1:8765`; override with `PORT=… HOST=… bun run serve`
(`HOST=0.0.0.0` to open it on your phone over the LAN). The dev server transpiles
`.ts` files per request, so there is no JavaScript build or watch step: edit, reload.
Run `bun run watch:css` in a second terminal while editing classes, so `app.css` keeps up.

## Ship

```bash
bun run build          # compiles Tailwind, then bundles index.html + src/ + app.css into dist/
bun run serve dist     # previews exactly what was built
```

`dist/` is plain HTML, CSS and JavaScript, and is gitignored.

## Features

- Choose the platform (Instagram, Messenger, WhatsApp) and a **light or dark** chat theme.
- Switch the editor itself between light and dark mode independently from the mockup.
- Keep the editor in English while choosing English or Dutch for text inside the phone mockup.
- Set the conversation partner, write messages, pick who says what and when.
- New messages get a timestamp 0–60 minutes after the previous one and alternate senders.
- Live preview inside an iPhone 17 frame; long conversations scroll and stay pinned to the newest message, like a real chat.
- **Export as PNG** — either the chat app alone (using the configured dimensions) or **inside the iPhone frame** (a fixed screen, pinned to the bottom like a real screenshot).
- Choose the app-only PNG width and height in pixels.
- **Copy the PNG straight to the clipboard** (browsers with `ClipboardItem` support).
- The PNG is a snapshot of the live preview, so what you see is exactly what you get.
- The editor is English-only; the selected phone-mockup language is remembered separately from the mockup.
- Everything is stored in `localStorage`. Nothing leaves the browser.

## Project layout

| Path | What it does |
| --- | --- |
| `index.html` | Markup with Tailwind utility classes. Translatable strings carry `data-i18n` keys. |
| `app.css` | Generated Tailwind CSS. Never hand-edit this file; `bun run build:css` regenerates it. |
| `src/input.css` | Tailwind entry point and source scanning directives. |
| `src/app.ts` | Entry point: wires state to the DOM, rendering (including the phone's class map), event delegation. |
| `src/state.ts` | `MockupState`, `Message`, `Platform`, `Theme`, `AppTheme`; defaults, normalisation, time helpers, storage. Pure, no DOM. |
| `src/i18n.ts` | `Language`, `TranslationKey`, the translation tables and `createTranslator()`. |
| `src/icons.ts` | Inline SVG icons (Lucide, ISC; brand marks from Simple Icons, CC0). `IconName` is derived from the tables. |
| `src/html.ts` | `SafeHtml`, `escapeHtml()`, the `html` tag and `setHtml()` — the only road to `innerHTML`. |
| `src/dom.ts` | `query()`, `queryAll()`, `must()`, `ensure()`: typed element lookups. |
| `src/snapshot.ts` | Generic DOM → SVG `<foreignObject>` → canvas → PNG. |
| `src/export.ts` | Builds the offscreen export clone (app-only / with frame) and snapshots it. |
| `src/types.ts` | Type-level helpers (`Brand`). |
| `test/` | `bun test` unit tests for the pure modules, the `html` tag, the markup's keys and the checker. |
| `scripts/check-types.ts` | The no-`any` checker (`bun run lint`). |
| `tsconfig.json`, `tsconfig.tools.json` | Strict config for `src/` (no Bun types) and for the tooling (with them). |
| `serve.ts` | Bun dev server: static files plus per-request `.ts` transpilation. Not part of the site. |
| `.github/workflows/check.yml` | CI: `bun run check` and `bun run build` on pushes to `main` and on pull requests. |

## Checks

```bash
bun run check          # tsc (both configs) + the no-any checker + bun test
bun run typecheck      # just tsc
bun run lint           # just scripts/check-types.ts
bun test               # just the tests
```

Bun strips types without checking them, so `bun test` alone is not a type check — `bun run check` is.
The tests cover time normalisation, state repair from corrupt storage, language and editor-theme
preferences, translation table parity, the markup's `data-i18n`/`data-icon` references, HTML escaping
and the checker itself.

## Adding a platform or theme

1. Add the platform's (or theme's) entry to the class map in `getPhoneStyles()` in `src/app.ts`; do not add a custom CSS file. The map is `as const`, so the compiler flags a missing part.
2. Add the value to `PLATFORMS` or `THEMES` in `src/state.ts`. The `Platform` / `Theme` type, the `isPlatform()` / `isTheme()` guard and `normalizeState()` follow from it, and the compiler points at every `platform.*` translation key that is now missing.
3. Add the strings (status, placeholder) to **both** tables in `src/i18n.ts`; the English table is typed against the Dutch keys, so a missing string is a compile error.
4. Add the control in `index.html` (platforms also need an icon in `src/icons.ts`), then `bun run build:css`.

## Export details

The chat screen deliberately uses the system UI font stack: the export renders inside an SVG image, which cannot fetch web fonts. On macOS/iOS that's SF, which is also what the real apps use.
