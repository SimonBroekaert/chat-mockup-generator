# chatframe feature inventory

This file is the source of truth for the user-facing behavior of the generator.
Keep it updated when a feature is added, removed, or intentionally changed.

## Conversation editor

- [x] Choose Instagram, Messenger, or WhatsApp styling.
- [x] Choose light or dark chat styling.
- [x] Change the other person's name and avatar initial.
- [x] Add, remove, and edit messages.
- [x] Choose whether each message is from **You** or the other person.
- [x] Edit every message timestamp.
- [x] New messages alternate senders and receive a timestamp between 0 and 60
      minutes after the previous message, including across midnight.
- [x] User-entered names and messages are escaped before rendering.

## Language and persistence

- [x] Dutch is the first-run default.
- [x] Switch the interface between Dutch and English.
- [x] Remember the language separately from the mockup document.
- [x] Persist the mockup, export settings, platform, theme, messages, names, and
      timestamps in `localStorage`.
- [x] Reset restores the example conversation without changing the language.

## Preview

- [x] Render a live iPhone 17 preview.
- [x] Keep long conversations pinned to the newest message in the preview.
- [x] Keep platform and theme colors in CSS variables so preview and export stay
      visually consistent.
- [x] Do not render a day divider such as “Vandaag” or “Today”.

## PNG export

- [x] Export the chat application without the phone shell or device status bar.
- [x] Configure app-only export width and height in pixels.
- [x] Export dimensions match the configured pixel dimensions.
- [x] Disable app-only dimensions when exporting the fixed iPhone frame.
- [x] Export the full iPhone frame as an optional alternative.
- [x] Snapshot the live DOM preview instead of maintaining a second renderer.
- [x] Copy the PNG to the clipboard when the browser supports `ClipboardItem`.
- [x] Export Instagram, Messenger, and WhatsApp in both light and dark themes.

## Local development checks

```bash
bun run serve
bun test
```

The app must be served over HTTP because the entry point uses ES modules.
