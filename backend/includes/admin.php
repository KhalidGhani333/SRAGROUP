<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

try {
    db();
} catch (PDOException $e) {
    if (basename((string) ($_SERVER['SCRIPT_NAME'] ?? '')) !== 'setup.php') {
        header('Location: setup.php');
        exit;
    }
}

set_lang(detect_guest_lang());

// Upgrade databases installed before per-user languages existed.
if (db_tables_exist() && db_value("SHOW COLUMNS FROM users LIKE 'lang'") === null) {
    db()->exec("ALTER TABLE users ADD COLUMN lang ENUM('it','en') NOT NULL DEFAULT 'it' AFTER division");
}

// Admin pages load only their own script and stylesheet (plus Google Fonts).
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'");

require __DIR__ . '/auth.php';
require __DIR__ . '/layout.php';
