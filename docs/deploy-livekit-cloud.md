# Deploy the Agent to LiveKit Cloud

LiveKit Cloud can host your agent directly — no separate server or Docker registry needed. It builds, deploys, and scales the agent for you.

> **Docs:** [Get started](https://docs.livekit.io/deploy/agents/start/) · [Deployment management](https://docs.livekit.io/deploy/agents/managing-deployments/) · [Secrets management](https://docs.livekit.io/deploy/agents/secrets/)

---

## Prerequisites

- A [LiveKit Cloud](https://cloud.livekit.io/) account and project
- The LiveKit CLI installed:

```bash
# macOS
brew install livekit-cli

# Linux
curl -sSL https://get.livekit.io/cli | bash
```

---

## 1. **Authenticate**

```bash
lk cloud auth
```

The CLI will print a URL you can open on any device to link your LiveKit Cloud project. If you have multiple projects, set the default:

```bash
lk project list
lk project set-default "<project-name>"
```

---

## 2. Create and deploy the agent

From the `agent/` directory, register, build, and deploy the agent in one step. The `--secrets-file` flag reads your `.env` and stores each key-value pair as an encrypted secret injected at runtime:

```bash
cd agent

lk agent create \
  --secrets-file .env
```

This uploads your code, builds a container image, deploys it, and writes a `livekit.toml` file to track the agent ID and project.

> **Note:** `.env` files are automatically excluded from the build context — secrets are stored separately and injected at runtime.

---

## 3. Deploy updates

After making changes, redeploy with:

```bash
cd agent
lk agent deploy
```

LiveKit Cloud uses a **rolling deployment** — new instances serve new sessions while existing sessions are given up to 1 hour to finish on old instances.

---

## 4. Monitor

```bash
# Check agent status and replica count
lk agent status

# Tail live logs
lk agent logs
```

---

## 5. Rollback (paid plans)

```bash
lk agent rollback
```

This instantly reverts to the previous version without a rebuild.

---

## Updating secrets

To update secrets after the initial deploy, use the LiveKit Cloud dashboard or redeploy with the updated `--secrets-file`.

---

## Further reading

- [Builds and Dockerfiles](https://docs.livekit.io/deploy/agents/builds/) — customise the build process
- [Secrets management](https://docs.livekit.io/deploy/agents/secrets/) — manage secrets via CLI or dashboard
- [Agent CLI reference](https://docs.livekit.io/reference/other/agent-cli/) — full list of `lk agent` commands
