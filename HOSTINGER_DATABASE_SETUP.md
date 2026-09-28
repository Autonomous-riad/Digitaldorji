# 🚀 How to Add and Import Your Website Database in Hostinger

Follow these 4 simple steps to import your Digital Dorji database into Hostinger Web Hosting.

---

## 📥 Step 1: Download Your Ready SQL Database File

You have two ways to get the `.sql` database file:

1. **Via the App Admin Panel**:
   - Go to your app's **Admin Dashboard** (`/admin/database`).
   - Click the **"SQL Schema (DDL)"** tab.
   - Click the **"Download Hostinger .SQL Dump"** button.
2. **Direct URL Download**:
   - Visit: `https://your-website-domain.com/api/schema/export-sql`

This file (`digital_dorji_hostinger_db.sql`) contains all table structures (`CREATE TABLE`) and initial data (`INSERT INTO`) formatted for Hostinger MySQL/MariaDB.

---

## 🗄️ Step 2: Create a MySQL Database in Hostinger hPanel

1. Log in to your **Hostinger Account** (hPanel).
2. Go to **Websites ➔ Dashboard** for your domain.
3. On the left sidebar, click **Databases ➔ MySQL Databases**.
4. In the **Create a New MySQL Database and Database User** section:
   - **MySQL Database Name**: e.g. `u123456789_digitaldorji`
   - **MySQL Username**: e.g. `u123456789_admin`
   - **Password**: Enter a strong password and save it securely.
5. Click **Create**.

---

## 📤 Step 3: Import the SQL File into phpMyAdmin

1. On the same **MySQL Databases** page in Hostinger, locate your newly created database in the list below.
2. Click the **Enter phpMyAdmin** button next to your database.
3. Inside phpMyAdmin, click on your database name on the left sidebar.
4. Click the **Import** tab at the top menu.
5. Click **Choose File** (Browse) and select `digital_dorji_hostinger_db.sql`.
6. Leave format as **SQL** and scroll down to click **Go** (or **Import**).
7. You will see green success checkmarks showing all tables (`users`, `customers`, `addresses`, `garments`, `relational_orders`, `payments`, `ready_made_products`, etc.) have been imported successfully!

---

## ⚙️ Step 4: Configure Node.js Runtime on Hostinger

If running the Node.js backend application on Hostinger Web Hosting or Hostinger VPS:

1. In Hostinger hPanel, go to **Advanced ➔ Node.js App** (or VPS terminal).
2. Set the startup file to `server.js` or `dist/server.cjs`.
3. Add environment variables in `.env` or hPanel Environment Settings:
   ```env
   PORT=3000
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
4. Click **Restart App**.

---

### 🎉 All Done!
Your website database is now fully set up on Hostinger!
