# JesseGPT

https://github.com/user-attachments/assets/f229628b-1405-40a3-9796-60b59983970e

### Choose your Jesse

<table>
  <tr>
    <td width="50%">
      <h4>JesseGPT</h4>
      <p>The relentlessly optimistic Jesse Pollak.</p>
      <p>Sees massive potential everywhere, bursting with Onchain Summer energy, & ready to hype your vision to the moon.</p>
      <img src="/assets/mellow-jesse.gif" width=150px>
    </td>
    <td width="50%">
      <h4>Supabald JesseGPT</h4>
      <p>The brutally honest Jesse Pollak.</p>
      <p>Cuts through the hype, challenges every premise, & believes great ideas must survive intense scrutiny to succeed.</p>
      <img src="/assets/critical-jesse.gif" width=150px>
    </td>
  </tr>
</table>

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://swarnimwalavalkar.com/"><img src="https://avatars.githubusercontent.com/u/38808472?v=4?s=100" width="100px;" alt="Swarnim Walavalkar"/><br /><sub><b>Swarnim Walavalkar</b></sub></a><br /><a href="https://github.com/devfolioco/jessegpt/commits?author=SwarnimWalavalkar" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://prathamvaidya.in"><img src="https://avatars.githubusercontent.com/u/61202986?v=4?s=100" width="100px;" alt="Pratham Vaidya"/><br /><sub><b>Pratham Vaidya</b></sub></a><br /><a href="https://github.com/devfolioco/jessegpt/commits?author=prathamVaidya" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://preetjdp.dev/"><img src="https://avatars.githubusercontent.com/u/27439197?v=4?s=100" width="100px;" alt="Preet Parekh"/><br /><sub><b>Preet Parekh</b></sub></a><br /><a href="https://github.com/devfolioco/jessegpt/commits?author=preetjdp" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://faradayfury.webflow.io"><img src="https://avatars.githubusercontent.com/u/126873863?v=4?s=100" width="100px;" alt="Anish Dhiman"/><br /><sub><b>Anish Dhiman</b></sub></a><br /><a href="#design-faradayfury" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://bio.link/ashwinexe"><img src="https://avatars.githubusercontent.com/u/53075480?v=4?s=100" width="100px;" alt="Ashwin Kumar Uppala"/><br /><sub><b>Ashwin Kumar Uppala</b></sub></a><br /><a href="https://github.com/devfolioco/jessegpt/commits?author=ashwinexe" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[![License](https://img.shields.io/github/license/devfolioco/jessegpt#reload)](https://github.com/devfolioco/jessegpt/blob/main/LICENSE)
