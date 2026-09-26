# Google AI Studio → GitHub → Hostinger Live Deployment Guide

This guide details the complete deployment workflow for **Digital Dorji BD** to ensure changes made in Google AI Studio immediately reflect on your live Hostinger website.

---

## The Workflow Overview

```
Google AI Studio (Code & Build) 
        ↓  (Push to GitHub)
GitHub Repository (branch: main)
        ↓  (Hostinger Webhook / Auto-Deploy Git Pull)
Hostinger (public_html)
        ↓
Live Website (Instant updates)
```

---

## 1. Required GitHub Settings

- **Repository Branch**: `main`
- **Tracked Build Artifacts**: The production `dist/` directory is now tracked and pre-built in Git, guaranteeing that Hostinger immediately receives the compiled production bundle upon `git pull`.

---

## 2. Hostinger Configuration

### Option A: Standard Web Hosting (Shared Hosting / LiteSpeed Apache)
*Most common for Single Page React/Tailwind Apps*

1. **Go to Hostinger hPanel**:
   - Open **Websites** → click **Manage** on your domain.
   - Under **Advanced**, click **Git**.
2. **Connect Git Repository**:
   - **Repository**: Enter your GitHub repo HTTPS URL (e.g., `https://github.com/your-username/your-repo.git`).
   - **Branch**: Set to `main`.
   - **Directory**: `/public_html` (or leave as default root).
   - Click **Create**.
3. **Setup Auto-Deployment Webhook (Crucial)**:
   - Hostinger will display an **Auto-Deployment Webhook URL**.
   - Copy that URL.
   - Go to your GitHub repository → **Settings** → **Webhooks** → **Add webhook**.
   - Paste the Hostinger URL into **Payload URL**.
   - Set **Content type** to `application/json`.
   - Select **Just the push event**.
   - Click **Add webhook**.
4. **How Routing Works**:
   - Root `.htaccess` automatically routes incoming web requests to `dist/index.html` and `dist/assets/`, preventing 404 errors on `/catalog`, `/ready-made`, and `/admin`.

---

### Option B: Hostinger Node.js Application Manager (Cloud / VPS / Business)
*If you are running the custom Express API backend*

1. **In Hostinger hPanel**:
   - Navigate to **Advanced** → **Node.js**.
2. **Configuration Settings**:
   - **Node.js Version**: `20.x` or `22.x`
   - **Application Mode**: `Production`
   - **Application Root**: `/home/uXXXXX/domains/yourdomain.com/public_html`
   - **Application Startup File**: `server.js` (or `dist/server.cjs`)
3. **Build Command**:
   ```bash
   npm run build
   ```
4. **Output Directory**:
   ```
   dist
   ```
5. **Restart**:
   - After code updates, click **Restart** in the Node.js manager panel (or use terminal/SSH `npm run build && pm2 restart ...`).

---

## 3. Environment Variables & API Keys

Environment variables are defined in `.env.example`. Secrets are never committed to GitHub.

Configure the following in Hostinger hPanel (Environment Variables) or `.env` file in Hostinger root:
- `PORT=3000` (or assigned automatically by Hostinger)
- `NODE_ENV=production`
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` (Optional cloud database)
- `SSLCZ_STORE_ID` & `SSLCZ_STORE_PASSWORD` (SSLCommerz payment gateway)

*Note: If Supabase or SSLCommerz credentials are omitted or left default, the app safely runs in graceful offline/mock fallback mode without crashing.*

---

## 4. Exact Steps to Follow for Future Changes

Every time you edit code in Google AI Studio:

1. **Build the production assets**:
   Ensure `npm run build` is run (or run via terminal). This updates `dist/`.
2. **Push to GitHub**:
   Use Google AI Studio's **Push to GitHub / Sync** button. It commits the changes and `dist/` to the `main` branch.
3. **Hostinger Auto-Deploys**:
   - GitHub triggers the Hostinger webhook.
   - Hostinger executes `git pull origin main`.
   - Your live website updates immediately with the new changes.

