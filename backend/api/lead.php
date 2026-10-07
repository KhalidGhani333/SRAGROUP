<?php
/**
 * Public endpoint for the website quote form (src/lib/submitLead.ts).
 * Expects multipart/form-data with a JSON "payload" field and an optional "attachment" file.
 */
declare(strict_types=1);

require __DIR__ . '/../includes/bootstrap.php';

send_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (!is_post()) {
    json_response(['ok' => false, 'error' => 'method_not_allowed'], 405);
}
// PHP drops the whole body when it exceeds post_max_size, so report that explicitly.
if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    json_response(['ok' => false, 'error' => 'payload_too_large'], 413);
}

$payload = json_decode((string) ($_POST['payload'] ?? ''), true);
if (!is_array($payload)) {
    json_response(['ok' => false, 'error' => 'invalid_payload'], 400);
}

// Spam: a filled honeypot or a form completed faster than a person could. Answer with a fake
// success so bots learn nothing, and store nothing.
$elapsed = $payload['meta']['elapsedMs'] ?? null;
if (trim((string) ($payload['website'] ?? '')) !== ''
    || (is_numeric($elapsed) && (int) $elapsed < (int) config('spam.min_seconds', 3) * 1000)) {
    error_log('[sragroup-crm] spam request dropped from ' . client_ip());
    json_response(['ok' => true, 'reference' => 'SRA-' . date('Y') . '-00000'], 201);
}

$errors = [];
$lead = validate_lead($payload, $errors);
if ($errors) {
    json_response(['ok' => false, 'error' => 'validation', 'fields' => $errors], 422);
}

try {
    $since = date('Y-m-d H:i:s', time() - (int) config('rate_limit.minutes', 10) * 60);
    $recent = (int) db_value('SELECT COUNT(*) FROM leads WHERE ip = ? AND created_at > ?', [client_ip(), $since]);
    if ($recent >= (int) config('rate_limit.max', 5)) {
        json_response(['ok' => false, 'error' => 'rate_limited'], 429);
    }

    $attachment = store_attachment($_FILES['attachment'] ?? null);
    if (is_string($attachment)) {
        json_response(['ok' => false, 'error' => $attachment], 422);
    }

    db_run(
        'INSERT INTO leads (division, first_name, last_name, company, job_role, email, phone, message, details,
            attachment_name, attachment_path, attachment_size, consent_privacy, consent_marketing,
            lang, source_page, ip, user_agent, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)',
        [
            $lead['division'], $lead['first_name'], $lead['last_name'], $lead['company'], $lead['job_role'],
            $lead['email'], $lead['phone'], $lead['message'], json_encode($lead['details'], JSON_UNESCAPED_UNICODE),
            $attachment['name'] ?? null, $attachment['path'] ?? null, $attachment['size'] ?? null,
            $lead['consent_marketing'], $lead['lang'], $lead['source_page'], client_ip(),
            mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255), now(),
        ],
    );
    $id = (int) db()->lastInsertId();
    $reference = sprintf('SRA-%s-%05d', date('Y'), $id);
    db_run('UPDATE leads SET reference = ? WHERE id = ?', [$reference, $id]);
    log_activity($id, null, 'created', __('Request received from the website (%s)', strtoupper($lead['lang'])));
} catch (Throwable $e) {
    error_log('[sragroup-crm] lead save failed: ' . $e->getMessage());
    json_response(['ok' => false, 'error' => 'server_error'], 500);
}

notify_new_lead($id, $reference, $lead);

json_response(['ok' => true, 'reference' => $reference], 201);

/* ---------------------------------------------------------------------- */

function send_cors_headers(): void
{
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '' && in_array($origin, (array) config('cors_origins', []), true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 86400');
    }
    header('Vary: Origin');
}

function str_field(array $source, string $key, int $max): string
{
    $v = $source[$key] ?? '';
    return is_scalar($v) ? mb_substr(trim((string) $v), 0, $max) : '';
}

/** Mirrors the website's zod schema; anything the form wouldn't send is rejected or dropped. */
function validate_lead(array $p, array &$errors): array
{
    $contact = is_array($p['contact'] ?? null) ? $p['contact'] : [];
    $consent = is_array($p['consent'] ?? null) ? $p['consent'] : [];
    $meta = is_array($p['meta'] ?? null) ? $p['meta'] : [];
    $rawDetails = is_array($p['details'] ?? null) ? $p['details'] : [];

    $division = str_field($p, 'division', 20);
    if (!isset(DIVISIONS[$division])) {
        $errors['division'] = 'required';
        $division = 'general';
    }

    $lead = [
        'division' => $division,
        'first_name' => str_field($contact, 'firstName', 100),
        'last_name' => str_field($contact, 'lastName', 100),
        'company' => str_field($contact, 'company', 190),
        'job_role' => str_field($contact, 'role', 120),
        'email' => mb_strtolower(str_field($contact, 'email', 190)),
        'phone' => str_field($contact, 'phone', 40),
        'message' => str_field($p, 'message', 5000),
        'consent_marketing' => !empty($consent['marketing']) ? 1 : 0,
        'lang' => str_field($meta, 'lang', 2) === 'en' ? 'en' : 'it',
        'source_page' => str_field($meta, 'page', 500),
        'details' => [],
    ];

    foreach (['first_name', 'last_name', 'company', 'message'] as $key) {
        if ($lead[$key] === '') {
            $errors[$key] = 'required';
        }
    }
    if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'email';
    }
    if (!preg_match('/^\+?[0-9\s().-]{6,20}$/', $lead['phone'])) {
        $errors['phone'] = 'phone';
    }
    if (($consent['privacy'] ?? false) !== true) {
        $errors['consent'] = 'gdpr';
    }

    foreach (DETAIL_FIELDS[$division] as $key => $field) {
        $value = str_field($rawDetails, $key, 200);
        if ($value === '') {
            continue;
        }
        $options = $field['options'] ?? null;
        if ($options === 'timeline') {
            $options = TIMELINES;
        }
        if (is_array($options) && !isset($options[$value])) {
            $errors[$key] = 'invalid';
            continue;
        }
        $lead['details'][$key] = $value;
    }

    return $lead;
}

/** Returns stored file info, null when no file was sent, or an error code string. */
function store_attachment(?array $file): array|string|null
{
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
        return 'file_too_large';
    }
    if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
        return 'upload_failed';
    }
    if ($file['size'] > (int) config('uploads.max_bytes')) {
        return 'file_too_large';
    }

    $original = basename(str_replace('\\', '/', (string) $file['name']));
    $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if (!in_array($ext, (array) config('uploads.extensions'), true)) {
        return 'file_type';
    }
    // Check the real content for formats with a reliable signature (DWG has no standard MIME).
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
    $expected = ['pdf' => ['application/pdf'], 'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png']];
    if (isset($expected[$ext]) && !in_array($mime, $expected[$ext], true)) {
        return 'file_type';
    }

    $folder = date('Y/m');
    $dir = uploads_dir() . '/' . $folder;
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return 'upload_failed';
    }
    $stored = bin2hex(random_bytes(16)) . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $stored)) {
        return 'upload_failed';
    }
    $safeName = preg_replace('/[^\w.\- ()]+/u', '_', $original) ?: ('attachment.' . $ext);

    return ['name' => mb_substr($safeName, 0, 255), 'path' => $folder . '/' . $stored, 'size' => (int) $file['size']];
}

function notify_new_lead(int $id, string $reference, array $lead): void
{
    if (!config('mail.enabled')) {
        return;
    }
    $to = (array) config('mail.notify.' . $lead['division'], []);
    if (config('mail.notify_users')) {
        $users = db_all("SELECT email FROM users WHERE is_active = 1 AND division IN ('all', ?)", [$lead['division']]);
        $to = array_merge($to, array_column($users, 'email'));
    }
    $to = array_values(array_unique($to));

    $name = $lead['first_name'] . ' ' . $lead['last_name'];
    $lines = [
        __('New quote request %s', $reference),
        '',
        __('Division') . ': ' . __(DIVISIONS[$lead['division']]),
        __('Name') . ': ' . $name,
        __('Company') . ': ' . $lead['company'],
        __('Email') . ': ' . $lead['email'],
        __('Phone') . ': ' . $lead['phone'],
    ];
    foreach (lead_detail_rows(['division' => $lead['division'], 'details' => json_encode($lead['details'])]) as [$label, $value]) {
        $lines[] = $label . ': ' . $value;
    }
    $lines[] = '';
    $lines[] = $lead['message'];
    $lines[] = '';
    $lines[] = __('Open in CRM') . ': ' . rtrim((string) config('app.admin_url'), '/') . '/lead.php?id=' . $id;

    send_mail($to, __('[%s] New request %s — %s', __(DIVISIONS[$lead['division']]), $reference, $lead['company']), implode("\n", $lines), $lead['email']);

    if (config('mail.auto_reply')) {
        $body = $lead['lang'] === 'en'
            ? "Dear {$lead['first_name']},\n\nthank you for contacting SRAGROUP. We have received your request (ref. {$reference}) and the right team will get back to you within 2 working days.\n\nSRAGROUP"
            : "Gentile {$lead['first_name']},\n\ngrazie per aver contattato SRAGROUP. Abbiamo ricevuto la sua richiesta (rif. {$reference}) e il team competente la ricontatterà entro 2 giorni lavorativi.\n\nSRAGROUP";
        $subject = $lead['lang'] === 'en' ? "We received your request - {$reference}" : "Abbiamo ricevuto la sua richiesta - {$reference}";
        send_mail($lead['email'], $subject, $body);
    }
}
