# pranayraj09/website

Personal portfolio site for Pranay Raj Kyatham, built with Vite, React, and TypeScript.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # outputs to dist/
```

## Editing content

All copy (bio, projects, skills, education, links) lives in `src/content.ts`. Layout is in `src/App.tsx` and styles in `src/index.css`.

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which lints, builds, and uploads `dist/` to the GoDaddy hosting for pranaykyatham.com over FTPS. Pull requests only lint and build.

One-time setup in **GitHub → Settings → Secrets and variables → Actions**:

| Name | Type | Value |
| --- | --- | --- |
| `FTP_SERVER` | secret | FTP host from cPanel → FTP Accounts (e.g. `ftp.pranaykyatham.com`) |
| `FTP_USERNAME` | secret | cPanel FTP username |
| `FTP_PASSWORD` | secret | cPanel FTP password |
| `FTP_SERVER_DIR` | variable (optional) | Upload folder relative to the FTP login root; defaults to `public_html/` |

The upload only adds/replaces files it deployed (tracked in `.ftp-deploy-sync-state.json` on the server); other files already in `public_html/` are left alone. Deploy is skipped until `FTP_SERVER` is set.
