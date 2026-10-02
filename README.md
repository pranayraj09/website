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

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. Enable it once under **Settings → Pages → Source: GitHub Actions**. The build uses a relative base path, so it works both at `https://pranayraj09.github.io/website/` and on a custom domain.
