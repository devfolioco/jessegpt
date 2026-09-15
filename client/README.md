# JesseGPT Client

## Getting started

Setup environment variables:

```sh
cp .env.example .env.local
```

Then run the app with:

```sh
pnpm install
pnpm dev
```

> Make sure an instance of the agent is running with the same LIVEKIT environment variables before starting the client.

---

## Temporarily pause the project

Set `SERVICE_PAUSED=true` in the client server's environment and restart or redeploy.
The homepage shows the pause page without mounting the chat or wallet UI. Middleware
temporarily redirects every other page URL (including direct `/talk` links and unknown
paths) to `/`, dropping query parameters. Only the homepage's static assets remain
accessible. All API endpoints return `503` before calling external services, with
additional guards on the connection-token and IPFS-upload handlers.
Set `SERVICE_PAUSED=false` (or remove it) and restart/redeploy to
restore the app. This is a server-side flag, so no `NEXT_PUBLIC_` variable is needed.

This stops new sessions; it does not disconnect existing LiveKit sessions or shut
down the separately deployed agent or provider subscriptions.

---

> Bootstrapped from LiveKit's [Voice Assistant Frontend](https://github.com/livekit-examples/voice-assistant-frontend) template.
