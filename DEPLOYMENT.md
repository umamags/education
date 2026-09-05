# Deployment Guide

This project has automated deployment workflows for GitHub Pages and ai-lab.in.

## GitHub Pages Deployment

**URL:** https://umamags.github.io/education

The GitHub Pages workflow automatically deploys the app when you push to `main` or `master` branch.

### Setup
No additional configuration needed! The workflow uses GitHub's native Pages deployment.

### How it works
1. Pushes to `main`/`master` trigger the build
2. App builds with `npm run build`
3. Output from `react/dist` is deployed to GitHub Pages

---

## ai-lab.in Deployment

**URL:** https://ai-lab.in/education

The ai-lab.in workflow deploys via SSH/SCP. You need to configure GitHub secrets.

### Setup

Add these secrets to your GitHub repository:

1. **Settings → Secrets and variables → Actions**
2. Click "New repository secret" and add:

| Secret Name | Value |
|---|---|
| `SSH_HOST` | ai-lab.in server hostname/IP |
| `SSH_PORT` | SSH port (usually 22) |
| `SSH_USER` | SSH username |
| `SSH_PRIVATE_KEY` | Your private SSH key (contents of ~/.ssh/id_rsa) |
| `SSH_TARGET_DIR` | Target directory on server (e.g., `/home/username/public_html/education`) |

### How to get your SSH private key

```bash
# Copy your private key
cat ~/.ssh/id_rsa
```

Paste the entire contents into the `SSH_PRIVATE_KEY` secret.

### How it works
1. Pushes to `main`/`master` trigger the build
2. App builds with `npm run build`
3. SSH connects to ai-lab.in server
4. Removes old files from `SSH_TARGET_DIR`
5. Copies new files via SCP
6. Verifies deployment

---

## Build Command

Both deployments use:
```bash
npm run build
```

This command:
1. Syncs data from `data/` to `react/public/data/`
2. Builds the React app with Vite
3. Outputs to `react/dist/`

---

## Testing Locally

To test the build locally:
```bash
npm run build
```

The built app will be in `react/dist/` and ready to deploy.

---

## Context Root

Both deployments serve the app with context root `/education/`:
- GitHub Pages: https://umamags.github.io/education/
- ai-lab.in: https://ai-lab.in/education/

This is configured in `react/vite.config.js` with `base: '/education/'`
