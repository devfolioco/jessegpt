# Deploy the Agent to Fly.io

[Fly.io](https://fly.io/) deploys Docker containers as lightweight VMs across global regions.

> **Docs:** [Deploy with a Dockerfile](https://fly.io/docs/languages-and-frameworks/dockerfile/) · [flyctl reference](https://fly.io/docs/flyctl/)

---

## Prerequisites

- A [Fly.io](https://fly.io/) account
- The Fly CLI (`flyctl`) installed:

```bash
# macOS
brew install flyctl

# Linux / macOS (alternative)
curl -L https://fly.io/install.sh | sh
```

---

## 1. Authenticate

```bash
fly auth login --email <your-email> --password <your-password>
```

---

## 2. Launch the app

From the `agent/` directory:

```bash
cd agent
fly launch
```

Follow the prompts to name your app and choose a region. This generates a `fly.toml` configuration file. You can add `--no-deploy` if you want to configure secrets before the first deploy:

```bash
fly launch --no-deploy
```

---

## 3. Set secrets

Fly stores secrets encrypted and injects them as environment variables at runtime:

```bash
fly secrets set \
  LIVEKIT_API_KEY="..." \
  LIVEKIT_API_SECRET="..." \
  LIVEKIT_URL="wss://your-project.livekit.cloud" \
  DEEPGRAM_API_KEY="..." \
  ELEVEN_API_KEY="..." \
  OPENAI_API_KEY="..."

# Optional
fly secrets set \
  ELEVEN_VOICE_ID="..." \
  DATALAYER_BASE_URL="..." \
  DATALAYER_API_KEY="..."
```

> **Note:** Each `fly secrets set` triggers a redeployment by default. Use `--stage` to batch them, then deploy once:
>
> ```bash
> fly secrets set --stage KEY1="..." KEY2="..."
> fly secrets deploy
> ```

---

## 4. Deploy

```bash
fly deploy
```

Fly builds the Docker image from the `Dockerfile`, pushes it to its private registry, and starts the VM.

---

## 5. Monitor

```bash
# Check app status
fly status

# Tail live logs
fly logs

# SSH into the running VM (for debugging)
fly ssh console
```

---

## Tips

- The agent needs **persistent connections** — make sure your `fly.toml` does _not_ set `auto_stop_machines = true` (or set it to `"off"`), otherwise Fly may suspend the VM when idle.
- Choose a region close to your LiveKit Cloud project's region for lowest latency.
- Fly's filesystem is **ephemeral** — this is fine for the agent since it doesn't write to disk at runtime.
- For production, consider scaling to 2+ machines for redundancy:

```bash
fly scale count 2
```
