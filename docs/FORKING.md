# Forking & Customising JesseGPT

This guide walks you through forking JesseGPT and re-skinning it as your own AI voice-feedback assistant with a different persona.

---

## Prerequisites

You will need accounts and API keys for the following services:

| Service                                           | Purpose                            | Required |
| ------------------------------------------------- | ---------------------------------- | -------- |
| [LiveKit](https://livekit.io/)                    | Real-time voice infrastructure     | Yes      |
| [Deepgram](https://deepgram.com/)                 | Speech-to-Text (STT)               | Yes      |
| [ElevenLabs](https://elevenlabs.io/)              | Text-to-Speech (TTS)               | Yes      |
| [OpenAI](https://platform.openai.com/)            | LLM (GPT-4.1)                      | Yes      |
| [Reown (WalletConnect)](https://cloud.reown.com/) | Wallet connection for Zora minting | Optional |
| [Infura](https://www.infura.io/)                  | IPFS upload for Zora coin metadata | Optional |

---

## 1. Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/<your-username>/jessegpt.git
cd jessegpt
```

---

## 2. Configure Environment Variables

### Agent (`agent/.env`)

```bash
cd agent
cp .env.example .env
```

Fill in your keys:

```
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=wss://<your-project>.livekit.cloud

DEEPGRAM_API_KEY=
ELEVEN_API_KEY=
ELEVEN_VOICE_ID=          # Optional – falls back to default
OPENAI_API_KEY=

# Optional – Devfolio analytics (leave blank to skip)
DATALAYER_BASE_URL=
DATALAYER_API_KEY=
```

### Client (`client/.env.local`)

```bash
cd client
cp .env.example .env.local
```

Fill in your keys:

```
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=wss://<your-project>.livekit.cloud

# Optional – required only if Zora minting is enabled
NEXT_PUBLIC_PROJECT_ID=    # Reown project ID
INFURA_API_KEY=
INFURA_API_SECRET=

# Optional – set to "false" to disable Zora minting flow
NEXT_PUBLIC_ENABLE_ZORA_MINTING=true
```

---

## 3. Customize the Persona

### Agent side – `agent/voice_agent/persona_config.py`

This is the single file that controls the agent's personality:

- **`PERSONA_NAME`** – The name your AI embodies (e.g. `"Vitalik Buterin"`)
- **`APP_NAME`** – Displayed app name
- **`REFERENCE_MATERIAL`** – Tweets, blog posts, or any text corpus that informs the AI's tone. Edit `agent/voice_agent/prompts/jesse_tweets.py` (or create your own file) and update the import.
- **`DEFAULT_VOICE_ID`** – Your ElevenLabs voice ID. Create a voice clone following [ElevenLabs' guide](https://elevenlabs.io/blog/how-to-clone-voice).
- **`VOICE_*`** settings – Adjust speed, stability, and style to taste.
- **Greetings & end messages** – Customize per mood.
- **`STT_KEYWORDS`** – Domain-specific vocabulary for better speech recognition.
- **Tone guidelines** – `EXCITED_TONE_GUIDELINES` and `CRITICAL_TONE_GUIDELINES` control how each mood behaves. Edit these to match your persona's communication style.

### Client side – `client/config/persona.config.ts`

This is the single file that controls the UI copy and branding:

- **`appName`**, **`tagline`**, **`description`** – Core branding
- **`siteUrl`**, **`blogUrl`** – Links
- **`heroTitle`**, **`heroDescription`** – Landing page copy
- **`moods`** – Labels, descriptions, and avatar images for each mood
- **`shareCopies`** / **`shareCopiesWithZora`** – Social share templates
- **`walletMetadata`** – Reown AppKit wallet modal metadata
- **`shareFrame`** – The "Base is for \_\_\_" frame title/subtitle
- **`footer`** – Credit, social links, GitHub repo URL

### Replace assets

Swap out these files in `client/public/` (and update the paths in `client/config/persona.config.ts` if you change the filenames):

| File                         | Purpose                        |
| ---------------------------- | ------------------------------ |
| `original.gif`               | Landing page hero avatar       |
| `mellow-jesse.gif`           | Excited/optimistic mood avatar |
| `critical-jesse.gif`         | Critical mood avatar           |
| `og-image-1.1.png`           | Open Graph preview image       |
| `frame/jesse-t-excited.png`  | Share frame avatar (excited)   |
| `frame/jesse-t-critical.png` | Share frame avatar (critical)  |
| `favicon_io/*`               | Favicon files                  |
| `favicon_io/site.webmanifest`| PWA name & icon paths          |

### Image generation tips

You'll need avatar images for both moods plus a few supporting assets. Here's what works well:

**Avatar images** (`original.gif`, `mellow-jesse.gif`, `critical-jesse.gif`)
- Square aspect ratio, at least 512×512px. GIF or PNG both work (update the file extension in `persona.config.ts` if you switch formats).
- The "excited" avatar should feel approachable and energetic; the "critical" avatar should feel intense or serious.
- `original.gif` is the landing page hero — a neutral or signature pose works best.
- Transparent backgrounds are ideal; the UI places them on dark backgrounds.

**Share frame avatars** (`frame/jesse-t-excited.png`, `frame/jesse-t-critical.png`)
- These are composited onto a canvas at render time. Keep them as portrait cutouts (head + shoulders) with transparent backgrounds, roughly 400×500px.

**OG image** (`og-image-1.1.png`)
- 1200×630px (standard Open Graph ratio). Include your app name and a short tagline — this is what shows up in link previews on Twitter/Farcaster/iMessage.

**Favicons** (`favicon_io/*`)
- Generate a full favicon set from your logo at [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/). Drop the output into `client/public/favicon_io/`.

**Generating assets**
- Any image generation tool or a designer works. Aim for a consistent art style across all avatar variants.
- Generate the excited and critical variants together so they feel cohesive.
- For the OG image, a simple composition with your app name + tagline on a branded background goes a long way.

---

## 4. Disable Zora Minting (Optional)

If you don't need the Zora coin minting feature:

Set the environment variable in your client `.env.local`:

```
NEXT_PUBLIC_ENABLE_ZORA_MINTING=false
```

This will:

- Skip the Reown/Wagmi wallet provider setup
- Hide the "Coin on Zora" button in the share modal
- Skip IPFS upload
- Remove the gas fee notice

You can also remove the `NEXT_PUBLIC_PROJECT_ID`, `INFURA_API_KEY`, and `INFURA_API_SECRET` env vars when minting is disabled.

---

## 5. Install & Run Locally

### Agent

```bash
cd agent
make install
make download-files
make dev
```

### Client

```bash
cd client
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

---

## 6. Deploy

### Agent

The agent is a **long-running Python process** that maintains persistent WebSocket connections to LiveKit. It **cannot** run on serverless platforms (Vercel Functions, AWS Lambda, etc.) — it needs a host that keeps the process alive.

There are three recommended deployment paths. Detailed step-by-step guides are linked below:

| Platform | Guide | Notes |
| --- | --- | --- |
| **LiveKit Cloud** (recommended) | [Deploy to LiveKit Cloud](./deploy-livekit-cloud.md) | Managed hosting, zero Docker config, built-in scaling |
| **Railway** | [Deploy to Railway](./deploy-railway.md) | Simple CLI-driven deploys, auto-detects Dockerfile |
| **Fly.io** | [Deploy to Fly.io](./deploy-fly.md) | Global edge deployment, Docker-based |

All three platforms support environment variable / secrets management so you don't have to bake your `.env` into the image.

### Client

The client is a standard Next.js app. Vercel is the recommended platform:

| Platform | Guide | Notes |
| --- | --- | --- |
| **Vercel** (recommended) | [Deploy to Vercel](./deploy-vercel.md) | Auto-detects Next.js, preview deploys on PRs |

Other options:
- **Netlify** – Similar setup with `pnpm build` as the build command
- **Docker** – Build with `next build` and serve with `next start`

---

## Checklist

- [ ] Fork and clone the repository
- [ ] Set up agent environment variables (`agent/.env`)
- [ ] Set up client environment variables (`client/.env.local`)
- [ ] Edit `agent/voice_agent/persona_config.py` with your persona
- [ ] Replace reference material in `agent/voice_agent/prompts/jesse_tweets.py`
- [ ] Create an ElevenLabs voice clone and update `DEFAULT_VOICE_ID`
- [ ] Edit `client/config/persona.config.ts` with your branding
- [ ] Replace avatar and OG images in `client/public/`
- [ ] Update `name` and `short_name` in `client/public/favicon_io/site.webmanifest`
- [ ] (Optional) Disable Zora minting via env var
- [ ] Test locally
- [ ] Deploy agent and client
