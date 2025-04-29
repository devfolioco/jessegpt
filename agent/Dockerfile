FROM python:3.13-slim AS build

# ---------------------------------------------------------------------------
# Build stage – install system deps & project dependencies  -----------------
# ---------------------------------------------------------------------------

# Speed-ups & sane defaults for Python inside containers
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

RUN apt-get update -qy && \
  apt-get install -qyy --no-install-recommends build-essential ca-certificates && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

# Create virtualenv & install project + production deps
RUN python -m venv /venv && \
  /venv/bin/pip install --upgrade pip wheel && \
  /venv/bin/pip install --no-cache-dir . && \
  /venv/bin/pip install --no-cache-dir ./livekit-plugins-smallest

# ---------------------------------------------------------------------------
# Runtime stage – lightweight image with just Python 3.13 + the built venv -------
# ---------------------------------------------------------------------------
FROM python:3.13-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PATH="/venv/bin:$PATH"

# Install shared libs required by some deps (e.g. regex, lxml, etc.) --------
RUN apt-get update -qy && \
  apt-get install -qyy --no-install-recommends libpcre3 libxml2 && \
  rm -rf /var/lib/apt/lists/*

# Copy the prepared virtualenv from the build stage
COPY --from=build /venv /venv

COPY . /app
WORKDIR /app

RUN /venv/bin/python -m voice_agent download-files

# ---------------------------------------------------------------------------
# Start the agent -----------------------------------------------------------
# ---------------------------------------------------------------------------

ENTRYPOINT ["/venv/bin/python", "-m", "voice_agent"]
CMD ["start"]
