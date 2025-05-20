# JesseGPT 



https://github.com/user-attachments/assets/f229628b-1405-40a3-9796-60b59983970e


    
### Choose your Jesse


-  **JesseGPT**:  The relentlessly optimistic Jesse Pollak.
    
    Sees massive potential everywhere, bursting with Onchain Summer energy, & ready to hype your vision to the moon. 

   <img src ="/assets/mellow-jesse.gif" width=150px>
   
<br>
    
- **Supabald JesseGPT:** The brutally honest Jesse Pollak.
    
    Cuts through the hype, challenges every premise, & believes great ideas must survive intense scrutiny to succeed.

  <img src ="/assets/critical-jesse.gif" width=150px>


Last year, we gave you [Supabald Jesse](https://letsgetjessebald.com/), a pixelated, cool-aura oracle who left the chain and entered your wallets.

This year, Jesse’s back. Not as a meme. 

But as **an AI**.

Say gm to [JesseGPT](https://jessegpt.xyz/) - your onchain feedback buddy, Base-pilled mentor, and hype generator all rolled into one. Built for the latest cohort of [Base Batches 2025](https://basebatches.xyz/), JesseGPT is trained to channel the spirit (and tweets) of Jesse Pollak, CEO of Base, and deliver hot takes on your project submission.

---

## Overview

- **Agent (`agent/`)**: LiveKit Voice Agent (either TTS or Realtime)
- **Client (`client/`)**: A Next.js web application that provides the user interface to interact with the agent via LiveKit.

## Getting Started

### Prerequisites

- Node.js and pnpm (for the client)
- Python and [uv](https://github.com/astral-sh/uv#installation) (for the agent)
- Access keys/credentials for any required services (e.g., LiveKit, STT/TTS providers, OpenAI, etc. - check `.env.example` files)

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

---
# Contributing


Feel free to open [issues](https://github.com/devfolioco/jessegpt/issues/new/choose) and [pull requests](https://github.com/devfolioco/jessegpt/pulls)!

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!



## License

[![License](https://img.shields.io/github/license/devfolioco/jessegpt#reload)](https://github.com/devfolioco/jessegpt/blob/main/LICENSE)
