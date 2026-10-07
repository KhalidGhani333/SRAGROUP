<?php
/**
 * Copy this file to config.php and fill in the values for your environment.
 * config.php is ignored by git so passwords never end up in the repository.
 */
return [
    'app' => [
        'name' => 'SRAGROUP CRM',
        'timezone' => 'Europe/Rome',
        // Show PHP errors in the browser. Keep false on the live server.
        'debug' => true,
        // Full URL of the admin panel, used for links inside notification emails.
        'admin_url' => 'http://localhost/backend/admin',
    ],

    // XAMPP defaults: user "root" with an empty password. On cPanel use the database
    // and user created under "MySQL Databases" (they are prefixed, e.g. cpuser_crm).
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'sragroup_crm',
        'user' => 'root',
        'pass' => '',
    ],

    // Websites allowed to post quote requests to api/lead.php from another origin.
    // Same-origin requests (site and backend on the same domain) always work.
    'cors_origins' => [
        'http://localhost:8080',
        'http://localhost:5173',
        'http://localhost:3000',
        'https://sragroup.it',
        'https://www.sragroup.it',
    ],

    'uploads' => [
        'max_bytes' => 10 * 1024 * 1024,
        'extensions' => ['pdf', 'dwg', 'jpg', 'jpeg', 'png'],
    ],

    // Maximum quote requests accepted from one IP address in the given window.
    'rate_limit' => [
        'max' => 5,
        'minutes' => 10,
    ],

    // Requests filled in faster than this are treated as bots and silently dropped.
    'spam' => [
        'min_seconds' => 3,
    ],

    // A failed email never loses the lead: it is always saved in the CRM first.
    // Test it from the admin panel: My profile > Email > Send test email.
    'mail' => [
        'enabled' => false,
        'from' => 'info@sragroup.it',
        'from_name' => 'SRAGROUP',
        // Leave host empty to use PHP mail() (works on most cPanel servers).
        // Recommended: a cPanel mailbox, e.g. host mail.sragroup.it, port 465, encryption ssl,
        // user info@sragroup.it. For Gmail: smtp.gmail.com, 587, tls and an App Password.
        'smtp' => [
            'host' => '',
            'port' => 465,
            'encryption' => 'ssl', // 'ssl' (port 465) or 'tls' (port 587)
            'user' => '',
            'pass' => '',
        ],
        // Department inboxes notified about every new request of that division.
        'notify' => [
            'general' => ['info@sragroup.it'],
            'construction' => ['info@sragroup.it'],
            'solar' => ['info@sragroup.it'],
        ],
        // Also email active CRM users who cover the request's division.
        'notify_users' => true,
        // Send the customer a short confirmation in their language.
        'auto_reply' => false,
    ],
];
