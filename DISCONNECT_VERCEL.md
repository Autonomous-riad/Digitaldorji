# 🚫 How to Completely Disconnect & Remove Vercel from Your Project

If your app or domain is still connected to Vercel, follow these 3 quick steps to completely unlink it and switch 100% to Hostinger.

---

## 1. Disconnect or Delete Project in Vercel Dashboard

1. Log in to **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Select your project.
3. Remove your domain from Vercel:
   - Go to **Settings** ➔ **Domains**.
   - If your domain is listed, click the **three dots (...)** next to it and select **Remove**.
4. Disconnect GitHub:
   - Go to **Settings** ➔ **Git**.
   - Click **Disconnect** next to your GitHub repository.
5. *(Optional)* Delete the project completely:
   - Go to **Settings** ➔ scroll to the bottom to the **Delete Project** section.
   - Click **Delete**, type the project name to confirm, and delete it.

---

## 2. Remove Vercel App & Webhooks from GitHub

To prevent Vercel from triggering builds or commenting on your commits/PRs:

1. Open your repository on GitHub (e.g., `https://github.com/Autonomous-riad/dorji`).
2. Go to **Settings** (top tab of the repository).
3. In the left sidebar:
   - Click **Webhooks**: If you see a webhook pointing to `https://api.vercel.com`, click **Delete**.
   - Click **Integrations** or **GitHub Apps**: If Vercel is listed, click **Configure** and choose **Uninstall** or remove access for this repository.
   - Click **Environments**: If there are any `Production` or `Preview` environments created by Vercel, delete them.

---

## 3. Update Your Domain DNS (Point Away from Vercel to Hostinger)

If your website domain is still loading the Vercel link or error page:

1. Go to your **Domain Registrar** (or **Hostinger hPanel** ➔ **Domains** ➔ **DNS / Nameservers**).
2. Look for existing DNS records:
   - Any **A Record** pointing to `76.76.21.21` (Vercel IP) ➔ **Delete it**.
   - Any **CNAME Record** pointing to `cname.vercel-dns.com` ➔ **Delete it**.
3. Add/Update the **A Record** to point to your **Hostinger IP**:
   - In Hostinger hPanel, look under **Hosting** ➔ **Plan Details** for your **Server IP Address** (e.g., `185.xxx.xxx.xxx`).
   - Create an **A Record**:
     - **Name / Host**: `@`
     - **Points to / Value**: Your Hostinger Server IP
     - **TTL**: `14400` (or Default)
   - Create a **CNAME Record** for `www`:
     - **Name / Host**: `www`
     - **Points to / Value**: `yourdomain.com`

---

Once completed, Vercel will have zero connection to your project, code, or domain.
