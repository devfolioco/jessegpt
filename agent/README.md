# Livekit Voice Agent

## Setup

Setup environment variables:

```sh
cp .env.example .env
```

### Install dependencies

Make sure you have [uv](https://github.com/astral-sh/uv#installation) installed

```sh
uv sync
```

### Download model files

```sh
make download-files
```

### Run the agent

```sh
make dev
```

or

```sh
uv run main.py dev
```
