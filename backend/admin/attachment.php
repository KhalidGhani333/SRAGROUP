<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_login();
$lead = find_lead_for_user((int) ($_GET['id'] ?? 0), $user);
$path = $lead && $lead['attachment_path'] ? attachment_full_path($lead['attachment_path']) : null;
if (!$path) {
    http_response_code(404);
    exit(__('File not found.'));
}

$name = str_replace(['"', "\r", "\n"], '', (string) $lead['attachment_name']);
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $name . '"; filename*=UTF-8\'\'' . rawurlencode($name));
header('Content-Length: ' . filesize($path));
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
readfile($path);
