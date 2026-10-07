<?php
declare(strict_types=1);

/** Reads a config value with dot notation, e.g. config('mail.enabled'). */
function config(string $key, mixed $default = null): mixed
{
    $value = $GLOBALS['__config'];
    foreach (explode('.', $key) as $part) {
        if (!is_array($value) || !array_key_exists($part, $value)) {
            return $default;
        }
        $value = $value[$part];
    }
    return $value;
}

/** HTML-escapes a value for output. */
function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function redirect(string $to): void
{
    header('Location: ' . $to);
    exit;
}

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function client_ip(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
}

function is_post(): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
}

function post_str(string $key, int $max = 1000): string
{
    $v = $_POST[$key] ?? '';
    return is_string($v) ? mb_substr(trim($v), 0, $max) : '';
}

function query_str(string $key, int $max = 200): string
{
    $v = $_GET[$key] ?? '';
    return is_string($v) ? mb_substr(trim($v), 0, $max) : '';
}

/** Builds a query string from the current filters, overriding or removing (null) keys. */
function query_with(array $overrides): string
{
    $params = array_merge($_GET, $overrides);
    $params = array_filter($params, fn ($v) => $v !== null && $v !== '');
    return $params ? '?' . http_build_query($params) : '';
}

function now(): string
{
    return date('Y-m-d H:i:s');
}

function fmt_datetime(?string $value): string
{
    return $value ? local_date('d M Y, H:i', strtotime($value)) : '-';
}

function fmt_date(?string $value): string
{
    return $value ? local_date('d M Y', strtotime($value)) : '-';
}

function time_ago(?string $value): string
{
    if (!$value) {
        return '-';
    }
    $diff = time() - strtotime($value);
    if ($diff < 60) {
        return __('just now');
    }
    $units = [86400 * 30 => 'month', 86400 * 7 => 'week', 86400 => 'day', 3600 => 'hour', 60 => 'minute'];
    foreach ($units as $seconds => $name) {
        if ($diff >= $seconds) {
            $n = intdiv($diff, $seconds);
            return __n('%d ' . $name . ' ago', '%d ' . $name . 's ago', $n);
        }
    }
    return fmt_date($value);
}

function fmt_money(mixed $value): string
{
    if ($value === null || $value === '') {
        return '-';
    }
    $n = (float) $value;
    return '€ ' . number_format($n, floor($n) == $n ? 0 : 2, ',', '.');
}

function fmt_bytes(?int $bytes): string
{
    if (!$bytes) {
        return '';
    }
    return $bytes >= 1048576 ? round($bytes / 1048576, 1) . ' MB' : max(1, round($bytes / 1024)) . ' KB';
}

function initials(string $name): string
{
    $parts = preg_split('/\s+/', trim($name)) ?: [];
    $out = '';
    foreach (array_slice($parts, 0, 2) as $p) {
        $out .= mb_strtoupper(mb_substr($p, 0, 1));
    }
    return $out ?: '?';
}

/* ---------- Sessions, CSRF and flash messages ---------- */

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('sra_crm');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function verify_csrf(): void
{
    $sent = $_POST['csrf'] ?? '';
    if (!is_string($sent) || !hash_equals(csrf_token(), $sent)) {
        http_response_code(419);
        exit(__('Your session expired. Go back, reload the page and try again.'));
    }
}

function flash(string $type, string $message): void
{
    $_SESSION['flash'][] = ['type' => $type, 'message' => $message];
}

function take_flashes(): array
{
    $items = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $items;
}

