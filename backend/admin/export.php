<?php
/** CSV export of the leads list, honouring the same filters and division scope. */
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_login();
[$where, $params] = lead_filters($user);

$rows = db_all(
    "SELECT l.*, u.name AS assignee FROM leads l LEFT JOIN users u ON u.id = l.assigned_to
     WHERE {$where} ORDER BY l.created_at DESC",
    $params,
);

$detailLabels = [];
foreach (DETAIL_FIELDS as $fields) {
    foreach ($fields as $field) {
        $detailLabels[__($field['label'])] = true;
    }
}
$detailLabels = array_keys($detailLabels);

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="sragroup-leads-' . date('Y-m-d') . '.csv"');
header('Cache-Control: no-store');

$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF"); // BOM so Excel opens accents correctly.
$sep = ';'; // Italian Excel expects semicolons.

/** Neutralises spreadsheet formulas in user-supplied text (CSV injection). */
$cell = fn ($v) => is_string($v) && preg_match('/^(?:[=@\t\r]|[+\-](?![\d\s().-]+$))/', $v) ? "'" . $v : $v;

fputcsv($out, array_merge(
    [__('Reference'), __('Received'), __('Division'), __('Status'), __('Priority'), __('Owner'), __('First name'), __('Last name'), __('Company'), __('Role'), __('Email'), __('Phone')],
    $detailLabels,
    [__('Message'), __('Estimated value (EUR)'), __('Follow-up'), __('Attachment'), __('Marketing consent'), __('Language')],
), $sep);

foreach ($rows as $l) {
    $details = array_fill_keys($detailLabels, '');
    foreach (lead_detail_rows($l) as [$label, $value]) {
        $details[$label] = $value;
    }
    fputcsv($out, array_map($cell, array_merge(
        [
            $l['reference'], $l['created_at'], __(DIVISIONS[$l['division']]), __(STATUSES[$l['status']]), __(PRIORITIES[$l['priority']]),
            $l['assignee'] ?? '', $l['first_name'], $l['last_name'], $l['company'], $l['job_role'], $l['email'], $l['phone'],
        ],
        array_values($details),
        [
            $l['message'], $l['estimated_value'] ?? '', $l['follow_up_at'] ?? '', $l['attachment_name'] ?? '',
            $l['consent_marketing'] ? __('Yes') : __('No'), strtoupper($l['lang']),
        ],
    )), $sep);
}
fclose($out);
