# Livekit Voice Agent

## Setup

Setup environment variables:

```sh
cp .env.example .env
```

### Install dependencies
Make sure you have uv installed

```sh
uv sync
```

### Download model files

tts
```sh
uv run tts.py download-files
```

realtime
```sh
uv run realtime.py download-files
```

### Run the agent

tts
```sh
uv run tts.py dev
```

realtime
```sh
uv run realtime.py dev
```
