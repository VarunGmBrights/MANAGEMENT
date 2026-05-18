# Frontend GitHub Pages Deployment

This repo deploys the Vite frontend located in `Front/` to **GitHub Pages**.

## 1) Add the secret (required)
Your frontend build currently requires `VITE_CLERK_PUBLISHABLE_KEY`.

In GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:
- Name: `VITE_CLERK_PUBLISHABLE_KEY`
- Value: your Clerk publishable key

## 2) Enable GitHub Pages
GitHub repo → **Settings → Pages**:
- Source: **GitHub Actions**

## 3) Push
Every push to `main` triggers the workflow:
- Installs `Front` dependencies
- Runs `npm run build` in `Front/`
- Deploys `Front/dist` to Pages

After the workflow completes, Pages will show a URL.

