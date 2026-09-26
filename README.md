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

### Cloudflare Pages

The production Pages project is `unholyzero`, with the `main` branch deployed at:

- <https://unholyzero.pages.dev>
- <https://e1d33c0a.unholyzero.pages.dev>

The custom domain `unholyzero.tech` is attached to the Pages project and is awaiting DNS verification. Add this record in the `unholyzero.tech` Cloudflare zone:

```text
Type: CNAME
Name: @
Target: unholyzero.pages.dev
Proxy status: DNS only during verification
```

After Cloudflare verifies the domain and issues the certificate, proxying can be enabled if desired.

## Publishing

Posts can be added as Markdown files under `src/content/posts/`. Every article should be fact-checked, edited, and tested for useful original insight before publishing. AI may assist with research and drafting, but it must not replace editorial review.
