# JesseGPT

## Overview

- **Agent (`agent/`)**: LiveKit Voice Agent (either TTS or Realtime)
- **Client (`client/`)**: A Next.js web application that provides the user interface to interact with the agent via LiveKit.

## Getting Started

### Prerequisites

- Node.js and pnpm (for the client)
- Python and [uv](https://github.com/astral-sh/uv#installation) (for the agent)
- Access keys/credentials for any required services (e.g., LiveKit, TTS providers - check `.env.example` files)

### Setup

1.  **Set up the Agent:**
    Set up the required environment variables in `.env`

    ```sh
    cd agent
    cp .env.example .env
    ```

    Install dependencies and download model files:

    ```sh
    make install
    make download-files
    ```

2.  **Set up the Client:**

    ```bash
    cd client
    cp .env.example .env.local
    ```

    Install dependencies:

    ```sh
    pnpm install
    ```

### Running the Project

1.  **Start the Agent:**

    ```sh
    cd agent
    make dev
    ```

2.  **Start the Client:**
    ```sh
    cd client
    pnpm dev
    ```

Open your browser to the address provided by the Next.js development server (usually `http://localhost:3000`).
