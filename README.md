# chatframe

Browser-based chat mockup generator for Instagram, Messenger, and WhatsApp-style conversations.

Static HTML, CSS and ES modules. No build step, no runtime dependencies. [Bun](https://bun.sh) serves and tests it locally — that is the only tool you need.

## Run locally

The app uses ES modules, so it has to be served over HTTP (opening `index.html` from disk won't work).

```bash
bun run serve          # or: bun serve.js
```

Open [http://localhost:8765](http://localhost:8765). Stop the server with `Ctrl+C`.
It binds to `127.0.0.1:8765`; override with `PORT=… HOST=… bun run serve`
(`HOST=0.0.0.0` to open it on your phone over the LAN).

## Features

- Choose the platform (Instagram, Messenger, WhatsApp) and a **light or dark** theme.
- Set the conversation partner, write messages, pick who says what and when.
- New messages get a plausible timestamp a few minutes after the previous one and alternate senders.
- Live preview inside an iPhone 17 frame; long conversations scroll and stay pinned to the newest message, like a real chat.
- **Export as PNG** — either the chat app alone (grows to fit every message) or **inside the iPhone frame** (a fixed screen, pinned to the bottom like a real screenshot).
- **Copy the PNG straight to the clipboard** (browsers with `ClipboardItem` support).
- The PNG is a snapshot of the live preview, so what you see is exactly what you get.
- Dutch and English UI; your language choice is remembered separately from the mockup.
- Everything is stored in `localStorage`. Nothing leaves the browser.

## Project layout

| Path | What it does |
| --- | --- |
| `index.html` | Markup. Translatable strings carry `data-i18n` keys. |
| `app.css` | Styling. Chat colours are CSS custom properties on `.phone-screen`, switched by `platform-*` / `theme-*` classes. |
| `src/app.js` | Entry point: wires state to the DOM, rendering, event delegation. |
| `src/state.js` | Defaults, validation/normalisation, time helpers, storage. Pure, no DOM. |
| `src/i18n.js` | Translation tables and `createTranslator()`. |
| `src/icons.js` | Inline SVG icons (Lucide, ISC; brand marks from Simple Icons, CC0). |
| `src/snapshot.js` | Generic DOM → SVG `<foreignObject>` → canvas → PNG. |
| `src/export.js` | Builds the offscreen export clone (app-only / with frame) and snapshots it. |
| `test/` | Unit tests for the pure modules (`bun test`). |
| `serve.js` | Bun dev server for local development. Not part of the site. |

## Tests

```bash
bun test
```

Covers time normalisation, state repair from corrupt storage, language migration, and translation table parity.

## Adding a platform or theme

1. Add a CSS variable block in `app.css` next to `.platform-whatsapp` / `.theme-dark` — no new selectors needed.
2. Add the value to `PLATFORMS` or `THEMES` in `src/state.js` so saved state accepts it.
3. Add the strings (status, placeholder, labels) to **both** tables in `src/i18n.js`; the test suite checks they stay in sync.
4. Add the control in `index.html` (platforms also need an icon in `src/icons.js`).

## Export details

The chat screen deliberately uses the system UI font stack: the export renders inside an SVG image, which cannot fetch web fonts. On macOS/iOS that's SF, which is also what the real apps use.
