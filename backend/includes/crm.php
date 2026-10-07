<?php
declare(strict_types=1);

/* ---------- Vocabulary shared by the API and the admin panel ---------- */

const DIVISIONS = [
    'construction' => 'Construction',
    'solar' => 'Solar',
    'general' => 'General',
];

const STATUSES = [
    'new' => 'New',
    'contacted' => 'Contacted',
    'qualified' => 'Qualified',
    'quoted' => 'Quote sent',
    'won' => 'Won',
    'lost' => 'Lost',
];

const OPEN_STATUSES = ['new', 'contacted', 'qualified', 'quoted'];

const PRIORITIES = [
    'low' => 'Low',
    'normal' => 'Normal',
    'high' => 'High',
];

const ROLES = [
    'admin' => 'Administrator',
    'staff' => 'Team member',
];

/** Lead visibility for a user: every division, or one division only. */
const USER_DIVISIONS = [
    'all' => 'All divisions',
    'general' => 'General only',
    'construction' => 'Construction only',
    'solar' => 'Solar only',
];

/**
 * Division-specific answers sent by the website form (src/components/site/QuoteForm.tsx).
 * Keys must match the form's `details` object; option values map to readable labels.
 */
const DETAIL_FIELDS = [
    'construction' => [
        'projectType' => ['label' => 'Project type', 'options' => ['industrial' => 'Industrial', 'commercial' => 'Commercial', 'residential' => 'Residential']],
        'area' => ['label' => 'Area (m²)'],
        'location' => ['label' => 'Location'],
        'timeline' => ['label' => 'Timeline', 'options' => 'timeline'],
    ],
    'solar' => [
        'installationType' => ['label' => 'Installation type', 'options' => ['roof' => 'Rooftop', 'ground' => 'Ground-mounted', 'park' => 'Solar park']],
        'powerKwp' => ['label' => 'Power (kWp)'],
        'annualBillEur' => ['label' => 'Annual energy bill (€)'],
        'location' => ['label' => 'Location'],
        'timeline' => ['label' => 'Timeline', 'options' => 'timeline'],
    ],
    'general' => [
        'subject' => ['label' => 'Subject'],
    ],
];

const TIMELINES = [
    'asap' => 'As soon as possible',
    '3to6' => '3–6 months',
    '6to12' => '6–12 months',
    'over12' => 'Over 12 months',
    'unknown' => 'Not defined yet',
];

/** Returns [label, readable value] pairs for a lead's stored details. */
function lead_detail_rows(array $lead): array
{
    $details = json_decode((string) $lead['details'], true) ?: [];
    $rows = [];
    foreach (DETAIL_FIELDS[$lead['division']] ?? [] as $key => $field) {
        if (!isset($details[$key]) || $details[$key] === '') {
            continue;
        }
        $value = (string) $details[$key];
        $options = $field['options'] ?? null;
        if ($options === 'timeline') {
            $options = TIMELINES;
        }
        if (is_array($options)) {
            $value = __($options[$value] ?? $value);
        }
        $rows[] = [__($field['label']), $value, $key];
    }
    return $rows;
}

/** One-line summary of what the customer asked for, e.g. "Rooftop · 350 kWp · Brescia". */
function lead_summary(array $lead): string
{
    $d = json_decode((string) $lead['details'], true) ?: [];
    $labels = [];
    foreach (lead_detail_rows($lead) as [, $value, $key]) {
        $labels[$key] = $value;
    }
    $parts = match ($lead['division']) {
        'construction' => [
            $labels['projectType'] ?? null,
            isset($d['area']) ? $d['area'] . ' m²' : null,
            $d['location'] ?? null,
        ],
        'solar' => [
            $labels['installationType'] ?? null,
            isset($d['powerKwp']) ? $d['powerKwp'] . ' kWp' : (isset($d['annualBillEur']) ? __('%s/yr bill', '€ ' . $d['annualBillEur']) : null),
            $d['location'] ?? null,
        ],
        default => [$d['subject'] ?? null],
    };
    return implode(' · ', array_filter($parts, fn ($p) => $p !== null && $p !== ''));
}

function lead_name(array $lead): string
{
    return trim($lead['first_name'] . ' ' . $lead['last_name']);
}

/* ---------- Access scope ---------- */

function is_admin(array $user): bool
{
    return $user['role'] === 'admin';
}

/** SQL condition limiting leads to the divisions this user can see. */
function lead_scope(array $user, string $alias = 'l'): array
{
    if ($user['division'] === 'all') {
        return ['1=1', []];
    }
    return ["{$alias}.division = ?", [$user['division']]];
}

function can_see_division(array $user, string $division): bool
{
    return $user['division'] === 'all' || $user['division'] === $division;
}

function find_lead_for_user(int $id, array $user): ?array
{
    $lead = db_one(
        'SELECT l.*, u.name AS assignee_name FROM leads l LEFT JOIN users u ON u.id = l.assigned_to WHERE l.id = ?',
        [$id],
    );
    return $lead && can_see_division($user, $lead['division']) ? $lead : null;
}

/** Active users who may own leads of the given division. */
function assignable_users(?string $division = null): array
{
    if ($division === null) {
        return db_all('SELECT id, name, division FROM users WHERE is_active = 1 ORDER BY name');
    }
    return db_all(
        "SELECT id, name, division FROM users WHERE is_active = 1 AND division IN ('all', ?) ORDER BY name",
        [$division],
    );
}

/**
 * Reads list filters from the query string and returns [where SQL, params, filters].
 * Shared by the leads list, its status tabs and the CSV export so they always agree.
 */
function lead_filters(array $user, array $exclude = []): array
{
    [$scopeSql, $params] = lead_scope($user);
    $where = [$scopeSql];
    $filters = [
        'q' => query_str('q'),
        'division' => query_str('division'),
        'status' => query_str('status'),
        'assigned' => query_str('assigned'),
        'priority' => query_str('priority'),
        'from' => query_str('from'),
        'to' => query_str('to'),
        'followup' => query_str('followup'),
    ];

    if ($filters['q'] !== '' && !in_array('q', $exclude, true)) {
        $like = '%' . $filters['q'] . '%';
        $where[] = '(l.reference LIKE ? OR l.first_name LIKE ? OR l.last_name LIKE ? OR l.company LIKE ? OR l.email LIKE ? OR l.phone LIKE ? OR CONCAT_WS(CHAR(32 USING utf8mb4), l.first_name, l.last_name) LIKE ?)';
        array_push($params, $like, $like, $like, $like, $like, $like, $like);
    }
    if (isset(DIVISIONS[$filters['division']]) && !in_array('division', $exclude, true)) {
        $where[] = 'l.division = ?';
        $params[] = $filters['division'];
    }
    if (!in_array('status', $exclude, true)) {
        if (isset(STATUSES[$filters['status']])) {
            $where[] = 'l.status = ?';
            $params[] = $filters['status'];
        } elseif ($filters['status'] === 'open') {
            $where[] = "l.status IN ('new','contacted','qualified','quoted')";
        }
    }
    if (isset(PRIORITIES[$filters['priority']])) {
        $where[] = 'l.priority = ?';
        $params[] = $filters['priority'];
    }
    if ($filters['assigned'] === 'me') {
        $where[] = 'l.assigned_to = ?';
        $params[] = $user['id'];
    } elseif ($filters['assigned'] === 'none') {
        $where[] = 'l.assigned_to IS NULL';
    } elseif (ctype_digit($filters['assigned'])) {
        $where[] = 'l.assigned_to = ?';
        $params[] = (int) $filters['assigned'];
    }
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $filters['from'])) {
        $where[] = 'l.created_at >= ?';
        $params[] = $filters['from'] . ' 00:00:00';
    }
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $filters['to'])) {
        $where[] = 'l.created_at <= ?';
        $params[] = $filters['to'] . ' 23:59:59';
    }
    if ($filters['followup'] === 'due') {
        $where[] = "l.follow_up_at IS NOT NULL AND l.follow_up_at <= CURDATE() AND l.status IN ('new','contacted','qualified','quoted')";
    }

    return [implode(' AND ', $where), $params, $filters];
}

/* ---------- Activity log ---------- */

function log_activity(int $leadId, ?int $userId, string $type, string $description): void
{
    db_run(
        'INSERT INTO lead_activity (lead_id, user_id, type, description) VALUES (?, ?, ?, ?)',
        [$leadId, $userId, $type, mb_substr($description, 0, 500)],
    );
}

/* ---------- Uploads ---------- */

function uploads_dir(): string
{
    return BACKEND_ROOT . '/storage/uploads';
}

function attachment_full_path(string $relative): ?string
{
    $base = realpath(uploads_dir());
    $path = realpath(uploads_dir() . '/' . $relative);
    return $base && $path && str_starts_with($path, $base) && is_file($path) ? $path : null;
}
