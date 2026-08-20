# chatframe

Browser-based chat mockup generator for Instagram, Messenger, and WhatsApp-style conversations.

## Run locally

### Requirements

- Node.js and npm
- Python 3

### Install dependencies

```bash
npm install
```

### Start the local server

```bash
npm run serve
```

Open [http://localhost:8765](http://localhost:8765) in your browser.

Stop the server with `Ctrl+C`.

## Features

- Configure the platform, conversation partner, messages, senders, and timestamps.
- Add messages with an automatically generated timestamp based on the previous message.
- Switch between Dutch and English UI modes.
- Preview the conversation inside an iPhone 17 mockup.
- Export only the chat application as a PNG.
- Store the current mockup locally in the browser.

## Alternative server command

You can also start the app without npm:

```bash
python3 -m http.server 8765
```
