# Deploying to cPanel (website + CRM)

`deploy.zip` holds the complete site for cPanel. Recreate it any time with `npm run build:cpanel`.

It contains:
- the prerendered website: all IT/EN pages, images, `sitemap.xml`, `robots.txt` and `.htaccess`
- the CRM in `backend/`, without your local `config.php` and without uploaded files

Hosting requirements: PHP 8.0 or newer, and MySQL or MariaDB. No Node.js is needed.

## Staging in a sub-folder (axistechstaging.com/sra-group/)
`npm run build:staging` builds the same site for the sub-folder `/sra-group/` and creates `deploy-staging.zip`.
Inside it, every link, image, the form and the 404 page point to `/sra-group/`.

1. In File Manager, open `public_html/sra-group/`.
   - Delete the old files, **except** `backend/config.php` and `backend/storage/uploads/`.
2. Upload `deploy-staging.zip` into `public_html/sra-group/` → **Extract** → delete the zip.
3. In `backend/config.php` (steps 6-7 below) use:
   - `admin_url` = `https://axistechstaging.com/sra-group/backend/admin`
   - add `https://axistechstaging.com` to `cors_origins`
4. Open `https://axistechstaging.com/sra-group/`. The CRM is at `/sra-group/backend/admin`.

To use another folder name, change `--base=/sra-group/` in the `build:staging` script in `package.json`.

## 1. Domain and SSL (do this first)
1. Point the domain DNS to the hosting: an **A record** for `sragroup.it` and for `www.sragroup.it`.
2. In cPanel, open **SSL/TLS Status** and click **Run AutoSSL**. Wait until both `sragroup.it` and `www.sragroup.it` have a valid certificate.
   > `.htaccess` forces HTTPS and redirects `sragroup.it` to `www.sragroup.it`. Without SSL, the site gives a redirect error.

## 2. PHP settings
In cPanel, open **Select PHP Version** (or **MultiPHP Manager**):
1. Choose **PHP 8.1 or 8.2**.
2. Make sure these extensions are enabled: `pdo_mysql`, `mbstring`, `fileinfo`, `openssl`.
3. Under **Options**, set `upload_max_filesize` and `post_max_size` to `16M`. The form accepts files up to 10 MB.

## 3. MySQL database
In cPanel, open **MySQL Database Wizard**:
1. **Database:** for example `sracrm`. cPanel names it `cpuser_sracrm`.
2. **User:** for example `sracrm`, which becomes `cpuser_sracrm`. Use a strong password and save it.
3. **Privileges:** tick **ALL PRIVILEGES**, then click **Next step**.

The tables are created automatically in step 7.

## 4. Email accounts
In cPanel, open **Email Accounts** and create **one** mailbox: `info@sragroup.it`.
The website shows it for every department, and the CRM sends and receives all notifications with it (SMTP).

Then open **Email Deliverability** and make sure SPF and DKIM are **Valid**. If they are not, emails may land in spam.

## 5. Upload the files
1. In **File Manager**, open `public_html`.
   - Click **Settings → Show Hidden Files (dotfiles)**.
   - Delete or back up the default `index.html` / `default.html` if there is one.
2. Click **Upload** and choose `deploy.zip`.
3. Right-click `deploy.zip` → **Extract** into `/public_html`, then delete `deploy.zip`.
4. Check that `public_html` now contains:
   - `index.html`
   - `.htaccess`
   - the folders `chi-siamo/`, `en/`, `assets/` and `backend/`

## 6. CRM configuration (`backend/config.php`)
In `public_html/backend/`, right-click `config.sample.php` → **Copy** → name it `config.php`. Then click **Edit** and change:

```php
'app' => [
    'debug' => false,
    'admin_url' => 'https://www.sragroup.it/backend/admin',
],
'db' => [
    'host' => 'localhost',
    'name' => 'cpuser_sracrm',      // from step 3
    'user' => 'cpuser_sracrm',      // from step 3
    'pass' => 'THE-DB-PASSWORD',
],
'mail' => [
    'enabled' => true,
    'from' => 'info@sragroup.it',
    'smtp' => [
        'host' => 'mail.sragroup.it',
        'port' => 465,
        'encryption' => 'ssl',
        'user' => 'info@sragroup.it',
        'pass' => 'THE-MAILBOX-PASSWORD',
    ],
    // 'notify' => the department inboxes that receive new requests
    'auto_reply' => true,             // confirmation email to the customer
],
```

Set permissions:
- `backend/config.php`: **640** (or 600)
- `backend/storage/uploads`: **755**

## 7. Create the CRM admin
1. Open `https://www.sragroup.it/backend/admin`. The setup creates the tables automatically.
2. Create the administrator. Use a **new, strong password**, not the local XAMPP one.
3. Go to **Utenti** and create an account for each team member, with their division.
4. Go to **Il mio profilo → Invia email di prova** and check that the email arrives.

## 8. Final check
- [ ] `http://sragroup.it` opens `https://www.sragroup.it` (padlock shown).
- [ ] The IT and EN pages open, and the IT/EN switch works.
- [ ] An unknown address (for example `/xyz`) shows the 404 page.
- [ ] Submit one request each for Construction, Solar and General (one with an attachment). Each should appear under **Richieste** in the CRM and send an email to the right department.
- [ ] `https://www.sragroup.it/backend/config.php` and `/backend/includes/` return **403**.
- [ ] Check the security headers at securityheaders.com.
- [ ] In Google Search Console, add the site and submit `sitemap.xml` (see `docs/gtm-ga4-setup.md`).

## Later updates
1. Change the code, then run `npm run build:cpanel`.
2. Upload the new `deploy.zip` to `public_html` → **Extract** → confirm **overwrite**.

`backend/config.php` and the uploaded attachments are not in the zip, so they are never overwritten. Never delete the `backend/storage/uploads` folder.

## If the domain is different
If the site is not `www.sragroup.it`, update these before building:
- `SITE_URL` in `src/i18n/seo.ts`
- the `sragroup.it` redirect in `public/.htaccess`
- `cors_origins` in `backend/config.php`

## Problems
| Symptom | Fix |
|---|---|
| "Too many redirects" | SSL is not active yet (step 1). If you use Cloudflare, set SSL to **Full**. |
| 500 error on every page | The PHP version is too old, or `mod_headers` is missing. Ask the host, or temporarily remove the `<IfModule mod_headers.c>` block from `.htaccess`. |
| The form says "error" | Check the database data in `config.php` and whether `/backend/admin` opens. |
| Attachments are not saved | Set `backend/storage/uploads` to 755. |
| Emails in spam or not arriving | Check SPF/DKIM (step 4) and the SMTP data, then send the test email. |
