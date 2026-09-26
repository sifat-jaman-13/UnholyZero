# UnholyZero

UnholyZero is an independent technical blog focused on useful developer experiments, practical AI workflows, and the occasional honest postmortem.

## Local development

```powershell
npm install
npm run dev
```

Build the production site with:

```powershell
npm run build
```

The generated site is in `dist/`.

## Deployment

GitHub repository: <https://github.com/sifat-jaman-13/UnholyZero>

### Appwrite Sites

The Appwrite project contains the `UnholyZero` static Astro Site:

```text
Install command: npm ci
Build command: npm run build
Output directory: dist
Build runtime: node-22
```

The first deployment is active and ready. Subsequent deployments can be uploaded from the repository with the Appwrite CLI after selecting the `UnholyZero` project.

### Domains

`https://unholyzero.tech` is the primary site and `https://fandapro13.me` serves the same Appwrite deployment. Appwrite manages their TLS certificates. DNS remains in Cloudflare, but the Appwrite validation CNAME must stay DNS-only.

`server.unholyzero.tech` is reserved for Jellyfin and must not be changed by the website deployment.

## Publishing

Posts can be added as Markdown files under `src/content/posts/`. Every article should be fact-checked, edited, and tested for useful original insight before publishing. AI may assist with research and drafting, but it must not replace editorial review.

### Local AI drafts

The optional publishing agent uses a local Ollama model and never listens on a public address. Copy `.env.example` to `.env` and set a narrow topic plus approved HTTPS sources, for example:

```powershell
$env:OLLAMA_MODEL="ornith-1.5:9b"
$env:AGENT_TOPIC="How HTTP status codes should guide retry decisions"
$env:AGENT_SOURCE_URLS="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status"
$env:AGENT_ALLOWED_DOMAINS="developer.mozilla.org"
$env:AGENT_DRY_RUN="true"
npm run agent:run
```

The agent fetches only explicitly allowlisted sources, requires inline citations, rejects malformed, promotional, or unsafe output, and produces draft-only Astro posts. Defaults are deliberately non-destructive: dry-run is on and pull-request creation is off.

To write a local draft after reviewing a dry-run result, set `AGENT_DRY_RUN=false`. To create a review pull request as well, set `AGENT_CREATE_PR=true`; it requires a clean Git worktree and GitHub CLI authentication. It never merges or deploys automatically.
