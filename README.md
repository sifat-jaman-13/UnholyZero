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

## Appwrite Sites

Connect this repository to Appwrite Sites with:

```text
Framework: Astro (or Other)
Build command: npm run build
Output directory: dist
```

After the first successful deployment, add `unholyzero.tech` as the custom domain in Appwrite Sites and follow the DNS verification instructions in Cloudflare. Keep Cloudflare proxying disabled until Appwrite finishes domain verification if the console requires direct DNS resolution.

## Publishing

Posts can be added as Markdown files under `src/content/posts/`. Every article should be fact-checked, edited, and tested for useful original insight before publishing. AI may assist with research and drafting, but it must not replace editorial review.
