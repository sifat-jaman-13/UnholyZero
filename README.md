<div align="center">

# UnholyZero

### Useful ideas. *Unholy* honesty.

A technical blog for practical developer experiments, thoughtful AI workflows, and engineering lessons without the usual tutorial theatre.

[![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Node.js](https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary%20Non--Commercial-orange)](LICENSE)
[![Website](https://img.shields.io/badge/Website-unholyzero.tech-111111?logo=googlechrome&logoColor=white)](https://unholyzero.tech)

[**Visit the website**](https://unholyzero.tech) · [Articles](https://unholyzero.tech/#latest) · [About](https://unholyzero.tech/about) · [Privacy](https://unholyzero.tech/privacy)

</div>

---

## ✦ What is UnholyZero?

UnholyZero is an independent technical blog focused on useful developer experiments, practical AI workflows, and honest engineering postmortems.

The site is built with **Astro** and stores its articles as Markdown files. An optional local AI drafting agent can research approved sources and prepare article pull requests, but editorial review and the decision to publish remain human responsibilities.

### At a glance

| Area | Details |
|---|---|
| Website | Astro 7 static site |
| Content | Markdown / MDX articles |
| Styling | Custom responsive CSS |
| Sitemap | Generated with `@astrojs/sitemap` |
| Optional AI agent | Node.js + local Ollama |
| Hosting | Appwrite Sites |
| Primary domain | [unholyzero.tech](https://unholyzero.tech) |

## ✦ Features

- **Technical articles** — practical explanations, experiments, and engineering lessons.
- **Markdown-based publishing** — add articles without building a separate CMS.
- **Responsive layout** — reading experience designed for desktop and mobile.
- **SEO sitemap** — generated during the Astro build.
- **Local AI research assistant** — drafts articles from explicitly allowlisted HTTPS sources.
- **Editorial safeguards** — validates article structure, citations, word count, and promotional or unsafe content before writing.
- **Pull-request workflow** — optionally opens a GitHub pull request for human review instead of silently publishing content.

## ✦ Getting started

### Prerequisites

Install the following before working with the website:

| Requirement | Version / purpose |
|---|---|
| [Node.js](https://nodejs.org/) | **22.12.0 or newer** |
| npm | Included with Node.js |
| [Git](https://git-scm.com/) | Required to clone the repository |
| [GitHub CLI](https://cli.github.com/) | Optional; needed only when the AI agent creates pull requests |

> **Note:** Ollama is not required to install, develop, build, or preview the website. It is only needed for the optional AI drafting agent.

### 1. Clone the repository

```bash
git clone https://github.com/sifat-jaman-13/UnholyZero.git
cd UnholyZero
```

### 2. Install project dependencies

The repository includes a `package-lock.json`. Use `npm ci` to install the exact dependency versions recorded in the lockfile:

```bash
npm ci
```

This installs the project's required packages, including:

| Package | Purpose |
|---|---|
| `astro` | Website framework and build system |
| `@astrojs/sitemap` | Sitemap generation |
| `@astrojs/check` | Astro and TypeScript diagnostics |
| `typescript` | TypeScript support |

You do not need to install these packages globally. npm installs them locally in `node_modules/`.

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal (normally `http://localhost:4321`).

The development server watches your files and refreshes the site as you make changes.

### 4. Run checks and build the site

Check the project:

```bash
npm run check
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The generated static website is placed in:

```text
dist/
```

## ✦ Writing and publishing articles

Articles live in:

```text
src/content/posts/
```

Create a new `.md` file in that directory. Each article uses frontmatter similar to this:

```yaml
---
title: "A Practical Guide to Example Engineering"
description: "An explanation of the problem, approach, and important trade-offs."
publishedAt: 2026-11-23
tags:
  - engineering
  - tutorial
draft: false
sources: []
---

# Your article

Write your article in Markdown.
```

The content collection validates article metadata. The required fields are:

| Field | Description |
|---|---|
| `title` | Article title |
| `description` | Short article summary |
| `publishedAt` | Publication date |
| `tags` | List of article tags |
| `draft` | Set to `true` to keep an article out of the public site |
| `sources` | Optional list of source titles and URLs |
| `updatedAt` | Optional last-updated date |
| `agentRunId` | Optional identifier used by the drafting agent |

Only articles with `draft: false` appear in the published article list and generated article pages.

Before publishing, fact-check the content, verify its links and citations, and make sure it contributes original value. AI can assist with research and drafting; it does not replace editorial review.

## ✦ Optional: Local AI drafting agent

The repository includes an optional Node.js agent that uses **Ollama running on your own machine**. It fetches approved HTTPS sources, asks a local model to draft an article, validates the result, and can either write a Markdown file or open a GitHub pull request.

The agent is separate from the website. Skip this section if you only want to run or contribute to the blog.

### Agent requirements

- Node.js 22.12.0 or newer and the project dependencies installed.
- [Ollama](https://ollama.com/download) installed and running locally.
- The model configured in `.env` downloaded in Ollama.
- Git installed.
- [GitHub CLI](https://cli.github.com/) installed and authenticated only if you want automatic pull-request creation.

### 1. Install Ollama

Download and install Ollama for your operating system:

- [Windows](https://ollama.com/download/windows)
- [macOS](https://ollama.com/download/mac)
- [Linux](https://ollama.com/download/linux)

On Linux, the official installation command is:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

On Windows PowerShell, the official installation command is:

```powershell
irm https://ollama.com/install.ps1 | iex
```

Start Ollama if it is not already running, then download the configured model:

```bash
ollama pull ornith-1.5:9b
```

The default agent configuration expects Ollama at `http://127.0.0.1:11434`. The agent deliberately rejects remote or public Ollama endpoints.

### 2. Configure the agent

Copy the example environment file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Edit `.env` and provide a topic, approved source URLs, and their allowed domains:

```dotenv
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=ornith-1.5:9b

AGENT_TOPIC=How HTTP status codes should guide retry decisions
AGENT_SOURCE_URLS=https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
AGENT_ALLOWED_DOMAINS=developer.mozilla.org

AGENT_DRY_RUN=true
AGENT_CREATE_PR=false
```

Configuration notes:

- `AGENT_TOPIC` is required for each run.
- `AGENT_SOURCE_URLS` is a comma-separated list of source URLs.
- `AGENT_ALLOWED_DOMAINS` is a comma-separated allowlist. Source URLs and their final redirect destinations must use HTTPS and match an allowed domain.
- `OLLAMA_MODEL` must match a model installed in your Ollama instance.
- `AGENT_DRY_RUN=true` previews the output path without writing an article.
- `AGENT_CREATE_PR=false` writes the validated article locally instead of creating a branch and pull request.

The agent reads `.env` automatically. Existing process environment variables take precedence over values in that file. Keep `.env` private; it is excluded from Git.

### 3. Run the agent

First, run its validation tests:

```bash
npm run agent:check
```

Run the agent:

```bash
npm run agent:run
```

The agent checks the article for required metadata, a 500–1,400-word body, inline citations to fetched sources, and disallowed unsafe or promotional content. It refuses to overwrite an existing article with the same generated filename.

### 4. Choose how the agent handles its output

| Configuration | Behaviour |
|---|---|
| `AGENT_DRY_RUN=true` | Preview only; no article file is written |
| `AGENT_DRY_RUN=false` and `AGENT_CREATE_PR=false` | Write the validated Markdown article locally |
| `AGENT_DRY_RUN=false` and `AGENT_CREATE_PR=true` | Create a branch, commit and push the article, then open a GitHub pull request |

For pull-request creation, install and authenticate GitHub CLI:

```bash
gh auth login
```

The working tree must be clean before the agent creates a pull request. Review the generated article, sources, and citations before merging. A merged article with `draft: false` can appear on the public site after deployment.

> **Important:** The agent does not publish directly to the live website. Its pull-request workflow is designed to leave the final editorial decision with a human reviewer.

## ✦ Deployment

UnholyZero is configured for **Appwrite Sites**. The production build uses:

| Setting | Value |
|---|---|
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Build runtime | `node-22` |

### Deploy through Appwrite

For a Git-connected deployment:

1. Open the [Appwrite Console](https://cloud.appwrite.io/).
2. Open the project and select **Sites**.
3. Connect the GitHub repository `sifat-jaman-13/UnholyZero`, or open its existing site configuration.
4. Select the production branch and confirm the build settings listed above.
5. Start a deployment and inspect the build logs if it fails.

### Deploy using the Appwrite CLI

The CLI is optional for local development. Install it if you want to manage deployments from your terminal.

Install with npm:

```bash
npm install -g appwrite-cli
```

Verify the installation and sign in:

```bash
appwrite -v
appwrite login
```

From the repository root, pull the existing site configuration and deploy:

```bash
appwrite pull sites
appwrite push sites
```

Use the Appwrite account and project that own the UnholyZero site. Review the configuration changes produced by the pull before committing anything.

Official guides: [Appwrite CLI installation](https://appwrite.io/docs/tooling/command-line/installation) · [Deploy Sites with the CLI](https://appwrite.io/docs/products/sites/deploy-from-cli).

### Domains

- **Primary:** [https://unholyzero.tech](https://unholyzero.tech)
- **Additional domain:** [https://fandapro13.me](https://fandapro13.me)

Both domains serve the same Appwrite deployment. Appwrite manages their TLS certificates, while DNS is managed through Cloudflare. The Appwrite validation CNAME must remain **DNS-only**.

> **Infrastructure note:** `server.unholyzero.tech` is reserved for Jellyfin. Do not change its DNS record as part of a website deployment.

## ✦ Project structure

```text
UnholyZero/
├── public/
│   └── favicon.svg
├── scripts/
│   └── agent/
│       ├── config.mjs
│       ├── gates.mjs
│       ├── gates.test.mjs
│       ├── ollama.mjs
│       ├── publish.mjs
│       ├── research.mjs
│       └── run.mjs
├── src/
│   ├── content/
│   │   └── posts/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── posts/
│   │   ├── about.astro
│   │   ├── index.astro
│   │   └── privacy.astro
│   └── content.config.ts
├── .env.example
├── appwrite.config.json
├── astro.config.mjs
├── package-lock.json
├── package.json
└── README.md
```

## ✦ Available commands

| Command | Description |
|---|---|
| `npm ci` | Install locked project dependencies |
| `npm run dev` | Start the local development server |
| `npm run check` | Run Astro and TypeScript diagnostics |
| `npm run build` | Build the production site |
| `npm run preview` | Preview the production build locally |
| `npm run agent:check` | Run the AI agent's validation tests |
| `npm run agent:run` | Run the optional local AI drafting agent |

## ✦ Troubleshooting

| Problem | What to check |
|---|---|
| `npm ci` fails | Confirm Node.js is 22.12.0 or newer, then retry with a working internet connection. |
| Astro command is not found | Run `npm ci` from the repository root. Do not install Astro globally. |
| Port 4321 is already in use | Stop the other development server or use Astro's available port prompt. |
| Ollama connection fails | Start Ollama and confirm it is listening on `127.0.0.1:11434`. |
| Model not found | Run `ollama pull ornith-1.5:9b`, or pull the model named in `OLLAMA_MODEL`. |
| Agent rejects a source | Check that its URL uses HTTPS and its hostname is included in `AGENT_ALLOWED_DOMAINS`. Redirect destinations must also be allowlisted. |
| Agent rejects an article | Review the reported validation errors, source citations, article length, and content before trying again. |
| Pull-request creation fails | Confirm Git is installed, the working tree is clean, and `gh auth status` reports an authenticated account. |
| Appwrite deployment fails | Check the site's install/build/output settings and inspect the deployment logs in Appwrite Console. |

## ✦ Contributing

Suggestions, corrections, and improvements are welcome. Keep changes focused, verify technical claims, and test the site with:

```bash
npm ci
npm run check
npm run build
npm run agent:check
```

When contributing articles, prioritize original insight, reliable sources, clear explanations, and transparent limitations.

## ✦ License

This project is distributed under a [proprietary non-commercial use licence](LICENSE).

- **Permitted:** Individual personal and educational use under the licence terms, with attribution.
- **Not permitted without prior written permission:** Company, organisational, business, or other commercial use.
- **Multi-author projects:** Commercial licensing or other commercial dealings require prior written approval from every co-author and copyright holder whose rights are affected.
- **Third-party components:** Remain subject to their respective licences and notices.

The licence does not grant permission to publicly redistribute the project. See [LICENSE](LICENSE) for the complete terms.

---

<div align="center">

**Built for developers who read the error message.**

[Website](https://unholyzero.tech) · [Repository](https://github.com/sifat-jaman-13/UnholyZero)

</div>
