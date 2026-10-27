# AI Assistant Demo

A deliberately dumb one-page app with a single chat box, built to measure **how much effort it
takes to plug a third-party page into our assistant platform**. The page has no features on
purpose: everything that is not the integration would distort the measurement.

One file, no build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8080
# http://localhost:8080
```

## What is here

| File | What it holds |
| --- | --- |
| `index.html` | Markup only: header, conversation log, composer, collapsible "Connection settings" panel |
| `styles.css` | All styling, one file, no build step |
| `app.js` | Page wiring plus the single integration hook |

The **only** place that changes when the platform is wired up is `ask(text)` in `app.js`,
marked `TODO(integration)`. Everything above it in that file is the demo page; everything below
it is page wiring.

Until the platform publishes its chat contract, sending a message shows a notice that the
integration is not wired yet — the page never pretends to work.

## What the integration has to decide

1. **Auth** — how a third-party page proves who it is: an API key, OAuth, or a session cookie.
   Today the platform's chat routes are session-cookie based (`SessionGuard`) and are protected
   by `OriginGuard`, which rejects cross-site `POST`s.
2. **CORS** — the platform does not enable CORS today, so a page on another origin cannot call
   it from the browser at all.
3. **Streaming** — whether the reply arrives whole (`POST /api/chat/messages`) or token by token
   (`GET /api/chat/turns/:id/events`).
4. **Files** — whether a customer's page can attach a photo/PDF (`POST /api/chat/upload`).
5. **Errors** — status codes and messages a customer's developer can act on.

## Status

Skeleton only, by design. No platform call is made. Personal repo, shared with the team.
