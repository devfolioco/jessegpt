# Deploy the Client to Vercel

[Vercel](https://vercel.com/) is the recommended way to deploy the Next.js client.

> **Docs:** [Vercel CLI](https://vercel.com/docs/cli) · [Deploy command](https://vercel.com/docs/cli/deploy) · [Environment variables](https://vercel.com/docs/cli/env)

---

## Prerequisites

- A [Vercel](https://vercel.com/) account
- The Vercel CLI installed:

```bash
# npm
npm i -g vercel

# pnpm
pnpm i -g vercel
```

---

## 1. Authenticate

```bash
vercel login
```

In a headless environment, the CLI will print a confirmation URL you can open on any device. For CI pipelines, set the `VERCEL_TOKEN` environment variable instead.

---

## 2. Link the project

From the `client/` directory:

```bash
cd client
vercel link
```

Follow the prompts to create a new Vercel project or link to an existing one. When asked for the **root directory**, confirm it's set to the current directory (`./`).

---

## 3. Set environment variables

```bash
vercel env add LIVEKIT_API_KEY
vercel env add LIVEKIT_API_SECRET
vercel env add LIVEKIT_URL

# Required only if Zora minting is enabled
vercel env add NEXT_PUBLIC_PROJECT_ID
vercel env add INFURA_API_KEY
vercel env add INFURA_API_SECRET

# Set to "false" to disable Zora minting
vercel env add NEXT_PUBLIC_ENABLE_ZORA_MINTING
```

Each command prompts you for the value and which environments to apply it to (Production, Preview, Development). You can also set these in the Vercel dashboard under **Settings → Environment Variables**.

To pull the remote env vars into a local `.env.local` for development:

```bash
vercel env pull
```

---

## 4. Deploy

**Preview deployment** (default):

```bash
vercel
```

**Production deployment:**

```bash
vercel --prod
```

Vercel detects Next.js, runs `pnpm build`, and deploys. You'll get a unique URL for each deployment.

---

## 5. Set up a custom domain (optional)

```bash
vercel domains add yourdomain.com
```

Then follow the DNS instructions Vercel provides. You can also do this from the dashboard under **Settings → Domains**.

---

## 6. Monitor

```bash
# View recent deployments
vercel list

# Tail logs for a deployment
vercel logs <deployment-url>

# Open the project dashboard
vercel open
```

---

## Tips

- **Auto-deploys:** Connect your GitHub repo in the Vercel dashboard for automatic deployments on every push. Preview deployments are created for PRs, production deploys for merges to `main`.
- **Build settings:** Vercel auto-detects `pnpm` and Next.js — no custom build configuration needed.
- **Environment scoping:** Use separate values per environment (Production vs Preview) if your LiveKit staging and production projects differ.
