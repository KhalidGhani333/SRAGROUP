<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

const PER_PAGE = 25;

$user = require_login();
[$where, $params, $filters] = lead_filters($user);

$total = (int) db_value("SELECT COUNT(*) FROM leads l WHERE {$where}", $params);
$pages = max(1, (int) ceil($total / PER_PAGE));
$page = min($pages, max(1, (int) query_str('page')));
$offset = ($page - 1) * PER_PAGE;

$leads = db_all(
    "SELECT l.id, l.reference, l.division, l.status, l.priority, l.first_name, l.last_name, l.company,
            l.email, l.phone, l.details, l.estimated_value, l.follow_up_at, l.attachment_name, l.created_at, u.name AS assignee
     FROM leads l LEFT JOIN users u ON u.id = l.assigned_to
     WHERE {$where} ORDER BY l.created_at DESC LIMIT " . PER_PAGE . " OFFSET {$offset}",
    $params,
);

// Status tab counts honour every other filter so the numbers always match the list.
[$tabWhere, $tabParams] = lead_filters($user, ['status']);
$tabCounts = array_fill_keys(array_keys(STATUSES), 0);
foreach (db_all("SELECT l.status, COUNT(*) AS n FROM leads l WHERE {$tabWhere} GROUP BY l.status", $tabParams) as $r) {
    $tabCounts[$r['status']] = (int) $r['n'];
}
$allCount = array_sum($tabCounts);
$openCount = $tabCounts['new'] + $tabCounts['contacted'] + $tabCounts['qualified'] + $tabCounts['quoted'];

$visibleDivisions = $user['division'] === 'all' ? DIVISIONS : [$user['division'] => DIVISIONS[$user['division']]];
$owners = assignable_users($user['division'] === 'all' ? null : $user['division']);
$hasFilters = (bool) array_filter($filters, fn ($v, $k) => $v !== '' && $k !== 'status', ARRAY_FILTER_USE_BOTH);

layout_start(__('Leads'), 'leads', $user);
?>
<header class="page-head">
  <div>
    <p class="eyebrow"><?= __('CRM') ?></p>
    <h1><?= __('Leads') ?></h1>
    <p class="muted"><?= e(__n('%d request', '%d requests', $total)) ?><?= $hasFilters ? __(' match your filters') : '' ?></p>
  </div>
  <div class="head-actions">
    <a class="btn btn-outline" href="export.php<?= e(query_with(['page' => null])) ?>"><?= icon('download') ?> <?= __('Export CSV') ?></a>
  </div>
</header>

<nav class="tabs" aria-label="<?= __('Status') ?>">
  <a href="<?= e(query_with(['status' => null, 'page' => null])) ?>" class="<?= $filters['status'] === '' ? 'active' : '' ?>"><?= __('All') ?> <span><?= $allCount ?></span></a>
  <a href="<?= e(query_with(['status' => 'open', 'page' => null])) ?>" class="<?= $filters['status'] === 'open' ? 'active' : '' ?>"><?= __('Open') ?> <span><?= $openCount ?></span></a>
  <?php foreach (STATUSES as $key => $label): ?>
    <a href="<?= e(query_with(['status' => $key, 'page' => null])) ?>" class="<?= $filters['status'] === $key ? 'active' : '' ?>">
      <i class="tab-dot fill-<?= e($key) ?>"></i><?= e(__($label)) ?> <span><?= $tabCounts[$key] ?></span>
    </a>
  <?php endforeach; ?>
</nav>

<form class="filters" method="get" data-autosubmit>
  <?php if ($filters['status'] !== ''): ?><input type="hidden" name="status" value="<?= e($filters['status']) ?>"><?php endif; ?>
  <label class="search">
    <?= icon('search') ?>
    <input type="search" name="q" value="<?= e($filters['q']) ?>" placeholder="<?= __('Search name, company, email, phone or reference') ?>">
  </label>
  <?php if (count($visibleDivisions) > 1): ?>
    <select name="division" aria-label="<?= __('Division') ?>">
      <option value=""><?= __('All divisions') ?></option>
      <?php foreach ($visibleDivisions as $k => $label): ?>
        <option value="<?= e($k) ?>" <?= $filters['division'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
      <?php endforeach; ?>
    </select>
  <?php endif; ?>
  <select name="assigned" aria-label="<?= __('Owner') ?>">
    <option value=""><?= __('Any owner') ?></option>
    <option value="me" <?= $filters['assigned'] === 'me' ? 'selected' : '' ?>><?= __('Assigned to me') ?></option>
    <option value="none" <?= $filters['assigned'] === 'none' ? 'selected' : '' ?>><?= __('Unassigned') ?></option>
    <?php foreach ($owners as $o): ?>
      <option value="<?= (int) $o['id'] ?>" <?= $filters['assigned'] === (string) $o['id'] ? 'selected' : '' ?>><?= e($o['name']) ?></option>
    <?php endforeach; ?>
  </select>
  <select name="priority" aria-label="<?= __('Priority') ?>">
    <option value=""><?= __('Any priority') ?></option>
    <?php foreach (PRIORITIES as $k => $label): ?>
      <option value="<?= e($k) ?>" <?= $filters['priority'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
    <?php endforeach; ?>
  </select>
  <label class="date"><span><?= __('From') ?></span><input type="date" name="from" value="<?= e($filters['from']) ?>"></label>
  <label class="date"><span><?= __('To') ?></span><input type="date" name="to" value="<?= e($filters['to']) ?>"></label>
  <?php if ($filters['followup'] === 'due'): ?><input type="hidden" name="followup" value="due"><?php endif; ?>
  <button class="btn btn-dark" type="submit"><?= __('Apply') ?></button>
  <?php if ($hasFilters): ?>
    <a class="btn btn-ghost" href="leads.php<?= $filters['status'] !== '' ? '?status=' . e(urlencode($filters['status'])) : '' ?>"><?= __('Clear') ?></a>
  <?php endif; ?>
</form>
<?php if ($filters['followup'] === 'due'): ?>
  <p class="chip-note"><?= icon('clock') ?> <?= __('Showing open leads with a follow-up due today or earlier.') ?> <a class="link" href="<?= e(query_with(['followup' => null])) ?>"><?= __('Remove') ?></a></p>
<?php endif; ?>

<div class="card card-flush">
  <?php if (!$leads): ?>
    <div class="empty">
      <?= icon('inbox', 'icon empty-icon') ?>
      <p><strong><?= $allCount || $hasFilters ? __('No leads match these filters') : __('No requests yet') ?></strong></p>
      <p class="muted"><?= $allCount || $hasFilters ? __('Try another status or clear the filters.') : __('Requests from the website contact form will appear here.') ?></p>
    </div>
  <?php else: ?>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th><?= __('Contact') ?></th>
            <th><?= __('Division') ?></th>
            <th><?= __('Request') ?></th>
            <th><?= __('Status') ?></th>
            <th><?= __('Owner') ?></th>
            <th><?= __('Received') ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($leads as $l):
              $late = $l['follow_up_at'] && $l['follow_up_at'] <= date('Y-m-d') && in_array($l['status'], OPEN_STATUSES, true);
              ?>
            <tr data-href="lead.php?id=<?= (int) $l['id'] ?>">
              <td>
                <a class="cell-contact" href="lead.php?id=<?= (int) $l['id'] ?>">
                  <?= avatar(lead_name($l)) ?>
                  <span>
                    <strong><?= e(lead_name($l)) ?></strong> <?= priority_badge($l['priority']) ?>
                    <?php if ($l['attachment_name']): ?><span class="clip" title="<?= __('Has attachment') ?>"><?= icon('paperclip') ?></span><?php endif; ?>
                    <small><?= e($l['company']) ?> · <?= e($l['reference']) ?></small>
                  </span>
                </a>
              </td>
              <td><?= division_badge($l['division']) ?></td>
              <td class="cell-request"><span title="<?= e(lead_summary($l)) ?>"><?= e(lead_summary($l)) ?></span></td>
              <td>
                <?= status_badge($l['status']) ?>
                <?php if ($l['estimated_value'] !== null || $l['follow_up_at']): ?>
                  <small class="cell-sub">
                    <?= $l['estimated_value'] !== null ? e(fmt_money($l['estimated_value'])) : '' ?>
                    <?php if ($l['follow_up_at']): ?><span class="due <?= $late ? 'due-late' : '' ?>"><?= icon('calendar') ?><?= e(fmt_date($l['follow_up_at'])) ?></span><?php endif; ?>
                  </small>
                <?php endif; ?>
              </td>
              <td><?= $l['assignee'] ? e($l['assignee']) : '<span class="tag tag-pending">' . __('Not assigned') . '</span>' ?></td>
              <td><span title="<?= e(fmt_datetime($l['created_at'])) ?>"><?= e(time_ago($l['created_at'])) ?></span></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  <?php endif; ?>
</div>
<?= pagination($page, $pages) ?>
<?php layout_end();
