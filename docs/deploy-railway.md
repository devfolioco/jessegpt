# Deploy the Agent to Railway

[Railway](https://railway.com/) auto-detects the `Dockerfile` in the `agent/` directory, builds the image, and keeps the process running. Good for quick deploys with minimal config.

> **Docs:** [Railway CLI](https://docs.railway.com/cli) · [Dockerfiles](https://docs.railway.com/reference/dockerfiles)

---

## Prerequisites

- A [Railway](https://railway.com/) account
- The Railway CLI installed:

```bash
# macOS
brew install railway

# npm (any platform)
npm install -g @railway/cli

# curl
bash <(curl -fsSL cli.new)
```

---

## 1. Authenticate

```bash
railway login --browserless
```

---

## 2. Create a project and link it

```bash
cd agent
railway init
```

Follow the prompts to create a new project (or link to an existing one). This generates a project config in your directory.

---

## 3. Set environment variables

Add your secrets via the CLI:

```bash
railway variable set LIVEKIT_API_KEY="..."
railway variable set LIVEKIT_API_SECRET="..."
railway variable set LIVEKIT_URL="wss://your-project.livekit.cloud"
railway variable set DEEPGRAM_API_KEY="..."
railway variable set ELEVEN_API_KEY="..."
railway variable set OPENAI_API_KEY="..."

# Optional
railway variable set ELEVEN_VOICE_ID="..."
railway variable set DATALAYER_BASE_URL="..."
railway variable set DATALAYER_API_KEY="..."
```

You can also set these in the Railway dashboard under your service's **Variables** tab.

---

## 4. Deploy

```bash
railway up
```

Railway detects the `Dockerfile`, builds the image, and starts the service. Subsequent deploys use the same command.

---

## 5. Monitor

- **Dashboard:** Open the Railway dashboard to view logs, metrics, and deployment status.
- **CLI:**

```bash
railway logs
```

---

## Tips

- Railway auto-redeploys when you push to a connected GitHub repo. You can enable this in the dashboard under your service's **Settings → Source**.
- For production, consider enabling a **custom domain** and **health checks** in the service settings.
- Railway keeps the process alive and restarts it on crash — no extra configuration needed for persistent connections.
