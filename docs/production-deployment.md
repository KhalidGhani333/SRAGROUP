# Production deployment: sragroup.it

Target: `public_html` on the client's cPanel hosting. Canonical URL: `https://www.sragroup.it`. The bare domain redirects to www. Both names need DNS and a valid SSL certificate on the new hosting.

This is a full website and PHP backend package for a **fresh CRM**. It contains no staging database, users, leads, attachments or passwords. Node.js is not needed on the hosting.

## Install

1. Back up any existing files on the client's hosting. Upload `sragroup-live-28-10-2026.zip` and extract its contents directly into `public_html`, not a nested folder. Include the hidden `.htaccess` files.
2. Choose PHP 8.0+ with PDO MySQL, mbstring and fileinfo enabled. Create a new, empty MySQL/MariaDB database and user in cPanel, and grant that user all privileges on that database.
3. Copy `backend/config.sample.php` to `backend/config.php` on the hosting. Set `db.host`, `db.name`, `db.user` and `db.pass` using the new hosting's database details. Keep `app.debug` false and `app.admin_url` equal to `https://www.sragroup.it/backend/admin`. Do not use the staging database credentials.
4. Ensure PHP can write to `backend/storage/uploads` (normally permission 755 when PHP runs as the account owner).
5. Open `https://www.sragroup.it/backend/admin/setup.php` and create the first admin account immediately after configuring the database. The installer creates the tables. Do not import the staging database. Previous staging admin credentials will not apply.
6. Configure the real mailbox/SMTP settings in `backend/config.php`, then enable mail. Use the CRM's **My profile > Send test email** to verify delivery. Email is disabled in the supplied template until configured; requests can still be saved to the CRM.
7. Check IT/EN navigation, both hero hover effects, project images, mobile layout, admin login and a real quote submission. Confirm the quote appears in the fresh CRM and the configured inbox receives its notification.

The production sample sets notification recipients to info@sragroup.it, costruzioni@sragroup.it and fotovoltaico@sragroup.it by division. Ensure these inboxes exist before enabling notifications.

## Outstanding company information

The source still contains demo VAT `12345678903`, REA `MI-2045871` and registered address `Via Fabio Filzi 27, 20124 Milano (MI)` in `src/data/company.ts`. These details affect company/legal content and structured data. Obtain the correct registered details from the client and rebuild before launch. The contact office address is separately set to `Via Enrico Toti, 6/B, 46029 Suzzara (MN)`.

The package is built for the production domain, but configuring hosting, DNS, SSL, database and SMTP and verifying delivery on that hosting are still required. Staging has not been removed or modified. Remove or restrict staging only after the production website and CRM have been verified.
