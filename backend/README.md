# SRAGROUP CRM (backend)

Plain PHP 8.0+ and MySQL/MariaDB with no Composer or framework, so it runs on XAMPP and on any cPanel hosting.

- `admin/` is the CRM admin panel at **`/backend/admin`**
- `api/lead.php` receives quote requests from the website form (`src/lib/submitLead.ts`)
- `includes/` holds the shared PHP (database, auth, CRM rules and layout). It is not web-accessible.
- `database/schema.sql` holds the tables. `admin/setup.php` installs them automatically.
- `storage/uploads/` holds the attachments. It is not web-accessible; files download only through `admin/attachment.php`.

## Features

- **Dashboard:** new and open counts, pipeline value, monthly trend, win rate, 30-day chart, split by division, pipeline funnel, latest requests and due follow-ups
- **Leads:** status tabs, search, filters (division, owner, priority, dates, overdue follow-ups), pagination and CSV export for Italian Excel
- **Lead detail:** project details, message, attachment download, pipeline stage, status, owner, priority, estimated value, follow-up date, notes, a full activity history, GDPR consent proof, other requests from the same contact, and permanent deletion for GDPR erasure (admins only)
- **Users (admins only):** create, edit, disable, reset passwords and delete. Roles:
  - *Administrator* sees everything and manages users
  - *Team member* sees only their division (`all`, `general`, `construction` or `solar`)
- **Security:** bcrypt passwords, CSRF tokens on every form, login throttling, session timeout, prepared SQL statements, escaped output, upload type and size checks, API rate limiting and CORS allow-list
- **Email (optional):** notifications to department inboxes and team members, plus an auto-reply to the customer in IT or EN. Sent through PHP `mail()` or SMTP (`mail.smtp` in config: a cPanel mailbox or Gmail). Admins can check the settings with **My profile → Send test email**.
- **Spam protection:** a hidden honeypot field and a minimum fill time (`spam.min_seconds`). Bots get a fake success and nothing is saved. It sets no cookies and calls no third party.
- **Languages:** the panel is in Italian and English. Each user picks a language in **My profile**, and the sign-in page has an IT/EN switch.

## Local setup (XAMPP)

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Make the folder reachable at `http://localhost/backend` by linking it into htdocs. Run this once in an **admin** Command Prompt:
   ```
   mklink /J C:\xampp\htdocs\backend D:\Techgenics\sragroup-digital-presence\backend
   ```
3. Copy `config.sample.php` to `config.php`. The XAMPP defaults (`root`, empty password) already match.
4. Open http://localhost/backend/admin. Setup creates the `sragroup_crm` database and tables, then asks for the first admin account.
5. The website (`npm run dev`) reads `VITE_LEAD_ENDPOINT` from `.env.development.local` (`http://localhost/backend/api/lead.php`). Submit the contact form and the lead appears in the CRM.

## Live deployment (cPanel): website + CRM together

The website is prerendered to static HTML, so cPanel needs no Node.js. Only PHP is needed, for the CRM.

1. On your PC, run `npm run build:cpanel`. It creates `deploy/public_html/`, which holds every page (IT + EN), the assets, `.htaccess`, and `backend/` (without your local `config.php` or uploads).
2. In cPanel **MySQL Databases**, create a database and a user, and give the user all privileges on that database.
3. In **File Manager**, upload the *contents* of `deploy/public_html/` into `public_html/`. Zip them first and extract on the server, it is faster.
4. First deploy only: create `public_html/backend/config.php` from `config.sample.php` and change these values:
   - `db` to the cPanel database name, user and password
   - `app.debug` to `false`
   - `app.admin_url` to `https://www.sragroup.it/backend/admin`
   - `mail.enabled` to `true`, with real department emails
5. Make sure `backend/storage/uploads` is writable (permission 755). Under **Select PHP Version**, choose 8.0 or newer.
6. Open `https://www.sragroup.it/backend/admin` and create the admin account.

For later updates, run `npm run build:cpanel` again and upload. `config.php` and `storage/uploads` on the server are never overwritten, because the package does not include them.

The `.htaccess` files block direct access to `config.php`, `includes/`, `database/` and `storage/`. PHP's built-in server ignores `.htaccess`, so always test the backend through Apache.
