# Hostinger Deployment Guide via GitHub (Digital Dorji)

This guide walks you through deploying **Digital Dorji** from GitHub to your **Hostinger Web Hosting** account.

---

## 🚀 Choose Your Preferred Deployment Method

| Method | Best For | Difficulty | Setup Time |
| :--- | :--- | :--- | :--- |
| **Method 1: GitHub Actions FTP (Recommended)** | Standard Shared Hosting, Premium, or Business Web Hosting | Easiest | ~3 minutes |
| **Method 2: Hostinger Git Deployment (hPanel Git)** | If you prefer Hostinger pulling directly from GitHub | Simple | ~4 minutes |
| **Method 3: Hostinger Node.js Application Manager** | Cloud Startup, Cloud Professional, or VPS with Node.js support | Advanced | ~5 minutes |

---

## Method 1: GitHub Actions FTP Auto-Deploy (Recommended)

With this method, every time you push code to your GitHub `main` branch, GitHub Actions will automatically:
1. Install dependencies and verify TypeScript
2. Compile and minify the production bundle (`npm run build`)
3. Automatically upload the generated `dist/` files to your Hostinger `public_html` directory via secure FTP!

### Step 1: Get Your Hostinger FTP Details
1. Log in to **[Hostinger hPanel](https://hpanel.hostinger.com/)**.
2. Click **Websites** → **Manage** next to your domain.
3. In the sidebar or search bar, look for **FTP Accounts** (under *Files*).
4. Note down:
   - **FTP Host / IP** (e.g. `ftp.yourdomain.com` or an IP address like `185.xxx.xxx.xxx`)
   - **FTP Username** (e.g. `u123456789`)
   - **FTP Password** (click *Change password* if you don't remember it)
   - **Port**: `21` (default)

### Step 2: Add FTP Credentials to GitHub Secrets
1. Go to your GitHub repository (e.g. `https://github.com/Autonomous-riad/dorji`).
2. Click **Settings** (top right tab).
3. In the left menu, select **Secrets and variables** → **Actions**.
4. Click **New repository secret** and add these three secrets:

   | Secret Name | Value |
   | :--- | :--- |
   | `HOSTINGER_FTP_SERVER` | Your FTP Host (e.g. `ftp.yourdomain.com` or Hostinger IP) |
   | `HOSTINGER_FTP_USERNAME` | Your Hostinger FTP username (e.g. `u123456789`) |
   | `HOSTINGER_FTP_PASSWORD` | Your Hostinger FTP password |

### Step 3: Push to GitHub & Deploy!
1. Commit and push any change to your `main` branch.
2. Go to the **Actions** tab in your GitHub repository.
3. You will see the **Hostinger Build & Deploy Workflow** running.
4. Once completed (takes ~1 minute), visit your domain — your website is live!

---

## Method 2: Hostinger Git Deployment (hPanel Git)

If you prefer using Hostinger's native Git integration:

### Step 1: Connect GitHub in Hostinger hPanel
1. Open **Hostinger hPanel** → **Websites** → **Manage**.
2. In the left navigation or search box, click **Git** (under *Advanced*).
3. Fill in:
   - **Repository**: Your GitHub repository URL (e.g. `https://github.com/Autonomous-riad/dorji.git`)
   - **Branch**: `main`
   - **Install directory**: Leave empty or enter `public_html`
4. Click **Create**.

### Step 2: Enable Auto-Deployment via GitHub Webhook
1. After creating the repository in Hostinger, you will see an **Auto-Deployment Webhook URL**.
2. Copy that URL.
3. Open your GitHub repository in your browser:
   - Go to **Settings** → **Webhooks** → **Add webhook**.
   - **Payload URL**: Paste the Hostinger Webhook URL.
   - **Content type**: Select `application/json`.
   - **Which events would you like to trigger this webhook?**: Choose **Just the push event**.
   - Click **Add webhook**.
4. Now, every push to GitHub will automatically trigger Hostinger to pull the latest changes.

> **Note on Client Routing (.htaccess)**: The repository already includes a pre-configured `.htaccess` in root and `public/` that ensures all routes like `/catalog`, `/customize`, `/ready-made`, and `/admin` rewrite properly to `index.html` without 404 errors.

---

## Method 3: Hostinger Node.js Application Manager (Cloud / VPS)

If your Hostinger plan includes Node.js (Hostinger Cloud Hosting or VPS) and you want the full-stack Express server running:

1. In hPanel, go to **Advanced** → **Node.js**.
2. Configure:
   - **Node.js version**: `20.x` or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `/home/uXXXXX/domains/yourdomain.com/public_html`
   - **Application startup file**: `server.js` (or `dist/server.cjs`)
3. Run `npm run build` in the Hostinger terminal or SSH.
4. Click **Start / Restart** application.

---

## ⚙️ Environment Variables (Optional)

If using external services, add these in Hostinger hPanel under **Advanced** → **Environment Variables** (or in a `.env` file in your root directory):

- `NODE_ENV=production`
- `PORT=3000`
- `VITE_SUPABASE_URL` *(Optional: Supabase Project URL)*
- `VITE_SUPABASE_ANON_KEY` *(Optional: Supabase Anon Key)*
- `SSLCZ_STORE_ID` & `SSLCZ_STORE_PASSWORD` *(Optional: SSLCommerz Payment Gateway)*

*Note: If Supabase or SSLCommerz are omitted, Digital Dorji runs safely with built-in client fallbacks.*

---

## 🛠️ Verification Checklist

- [x] Production build passes (`npm run build`)
- [x] TypeScript verification passes (`npm run lint`)
- [x] `.htaccess` configured for HTTPS redirection, Gzip compression, and React SPA routing
- [x] GitHub Actions workflow `.github/workflows/deploy.yml` configured for automatic builds & FTP deploy

