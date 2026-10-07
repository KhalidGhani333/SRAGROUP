<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_login();
[$scope, $sp] = lead_scope($user);

$totals = db_one(
    "SELECT COUNT(*) AS total,
        SUM(l.status = 'new') AS new_count,
        SUM(l.status IN ('new','contacted','qualified','quoted')) AS open_count,
        SUM(l.status = 'won') AS won,
        SUM(l.status = 'lost') AS lost,
        SUM(l.created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS this_month,
        SUM(l.created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
            AND l.created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS last_month,
        SUM(CASE WHEN l.status IN ('new','contacted','qualified','quoted') THEN l.estimated_value END) AS pipeline_value,
        SUM(CASE WHEN l.status = 'won' THEN l.estimated_value END) AS won_value
     FROM leads l WHERE {$scope}",
    $sp,
) ?? [];
$t = array_map(fn ($v) => $v === null ? 0 : $v, $totals);
$closed = (int) $t['won'] + (int) $t['lost'];
$winRate = $closed ? round((int) $t['won'] / $closed * 100) : null;
$monthDelta = (int) $t['last_month'] ? round(((int) $t['this_month'] - (int) $t['last_month']) / (int) $t['last_month'] * 100) : null;

$byStatus = array_fill_keys(array_keys(STATUSES), 0);
foreach (db_all("SELECT l.status, COUNT(*) AS n FROM leads l WHERE {$scope} GROUP BY l.status", $sp) as $r) {
    $byStatus[$r['status']] = (int) $r['n'];
}
$byDivision = array_fill_keys(array_keys(DIVISIONS), 0);
foreach (db_all("SELECT l.division, COUNT(*) AS n FROM leads l WHERE {$scope} GROUP BY l.division", $sp) as $r) {
    $byDivision[$r['division']] = (int) $r['n'];
}

// Requests per day for the last 30 days (zero-filled).
$days = [];
for ($i = 29; $i >= 0; $i--) {
    $days[date('Y-m-d', strtotime("-{$i} days"))] = 0;
}
foreach (db_all(
    "SELECT DATE(l.created_at) AS d, COUNT(*) AS n FROM leads l
     WHERE {$scope} AND l.created_at >= CURDATE() - INTERVAL 29 DAY GROUP BY DATE(l.created_at)",
    $sp,
) as $r) {
    $days[$r['d']] = (int) $r['n'];
}
$maxDay = max(1, ...array_values($days));

$followUps = db_all(
    "SELECT l.id, l.reference, l.first_name, l.last_name, l.company, l.division, l.status, l.follow_up_at
     FROM leads l WHERE {$scope} AND l.follow_up_at IS NOT NULL AND l.follow_up_at <= CURDATE() + INTERVAL 7 DAY
       AND l.status IN ('new','contacted','qualified','quoted')
     ORDER BY l.follow_up_at LIMIT 6",
    $sp,
);
$recent = db_all(
    "SELECT l.id, l.reference, l.first_name, l.last_name, l.company, l.division, l.details, l.status, l.priority, l.created_at, u.name AS assignee
     FROM leads l LEFT JOIN users u ON u.id = l.assigned_to WHERE {$scope} ORDER BY l.created_at DESC LIMIT 8",
    $sp,
);
$mine = (int) db_value(
    "SELECT COUNT(*) FROM leads l WHERE {$scope} AND l.assigned_to = ? AND l.status IN ('new','contacted','qualified','quoted')",
    [...$sp, $user['id']],
);
$unassignedNew = (int) db_value("SELECT COUNT(*) FROM leads l WHERE {$scope} AND l.status = 'new' AND l.assigned_to IS NULL", $sp);

$hour = (int) date('G');
$greeting = $hour < 12 ? __('Good morning') : ($hour < 18 ? __('Good afternoon') : __('Good evening'));

layout_start(__('Dashboard'), 'dashboard', $user);
?>
<header class="page-head">
  <div>
    <p class="eyebrow"><?= e(local_date('l, d F Y', time())) ?></p>
    <h1><?= e($greeting) ?>, <?= e(explode(' ', $user['name'])[0]) ?></h1>
    <p class="muted">
      <?php if ($unassignedNew): ?>
        <a class="link" href="leads.php?status=new&amp;assigned=none"><?= e(__n('%d new request waiting for an owner', '%d new requests waiting for an owner', $unassignedNew)) ?></a> ·
      <?php endif; ?>
      <a class="link" href="leads.php?assigned=me&amp;status=open"><?= e(__n('%d open lead assigned to you', '%d open leads assigned to you', $mine)) ?></a>
    </p>
  </div>
  <div class="head-actions">
    <a class="btn btn-outline" href="export.php"><?= icon('download') ?> <?= __('Export CSV') ?></a>
    <a class="btn btn-dark" href="leads.php"><?= icon('inbox') ?> <?= __('All leads') ?></a>
  </div>
</header>

<section class="kpis">
  <a class="kpi" href="leads.php?status=new">
    <span class="kpi-label"><?= __('New requests') ?></span>
    <strong><?= (int) $t['new_count'] ?></strong>
    <span class="kpi-foot"><?= __('Need a first contact') ?></span>
  </a>
  <a class="kpi" href="leads.php?status=open">
    <span class="kpi-label"><?= __('Open pipeline') ?></span>
    <strong><?= (int) $t['open_count'] ?></strong>
    <span class="kpi-foot"><?= e(__('%s estimated', fmt_money($t['pipeline_value'] ?: null))) ?></span>
  </a>
  <div class="kpi">
    <span class="kpi-label"><?= __('This month') ?></span>
    <strong><?= (int) $t['this_month'] ?></strong>
    <span class="kpi-foot">
      <?php if ($monthDelta !== null): ?>
        <span class="<?= $monthDelta >= 0 ? 'up' : 'down' ?>"><?= $monthDelta >= 0 ? '▲' : '▼' ?> <?= abs($monthDelta) ?>%</span> <?= __('vs last month') ?>
      <?php else: ?>
        <?= e(__('%d last month', (int) $t['last_month'])) ?>
      <?php endif; ?>
    </span>
  </div>
  <a class="kpi" href="leads.php?status=won">
    <span class="kpi-label"><?= __('Win rate') ?></span>
    <strong><?= $winRate === null ? '-' : $winRate . '%' ?></strong>
    <span class="kpi-foot"><?= e(__('%d won', (int) $t['won'])) ?> · <?= e(fmt_money($t['won_value'] ?: null)) ?></span>
  </a>
</section>

<section class="grid-2">
  <div class="card">
    <div class="card-head">
      <h2><?= __('Requests · last 30 days') ?></h2>
      <span class="muted small"><?= e(__('%d total', array_sum($days))) ?></span>
    </div>
    <div class="chart" role="img" aria-label="<?= __('Requests per day over the last 30 days') ?>">
      <?php foreach ($days as $d => $n): ?>
        <div class="bar" style="--h: <?= round($n / $maxDay * 100) ?>%" title="<?= e(local_date('d M', strtotime($d)) . ': ' . $n) ?>">
          <span></span>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="chart-axis"><span><?= e(local_date('d M', strtotime(array_key_first($days)))) ?></span><span><?= __('Today') ?></span></div>
  </div>

  <div class="card">
    <div class="card-head"><h2><?= __('By division') ?></h2><span class="muted small"><?= e(__('%d all time', (int) $t['total'])) ?></span></div>
    <div class="split-bar">
      <?php foreach ($byDivision as $d => $n): if (!$n) continue; ?>
        <span class="seg seg-<?= e($d) ?>" style="flex: <?= $n ?>"></span>
      <?php endforeach; ?>
      <?php if (!(int) $t['total']): ?><span class="seg seg-empty" style="flex:1"></span><?php endif; ?>
    </div>
    <ul class="legend">
      <?php foreach ($byDivision as $d => $n): ?>
        <li>
          <a href="leads.php?division=<?= e($d) ?>">
            <span class="dot dot-<?= e($d) ?>"></span><?= e(__(DIVISIONS[$d])) ?>
            <strong><?= $n ?></strong>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
    <h3 class="sub"><?= __('Pipeline') ?></h3>
    <ul class="funnel">
      <?php $maxStatus = max(1, ...array_values($byStatus)); foreach ($byStatus as $s => $n): ?>
        <li>
          <a href="leads.php?status=<?= e($s) ?>">
            <span class="funnel-label"><?= status_badge($s) ?></span>
            <span class="funnel-track"><span class="funnel-fill fill-<?= e($s) ?>" style="width: <?= round($n / $maxStatus * 100) ?>%"></span></span>
            <strong><?= $n ?></strong>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<section class="grid-2 grid-wide-left">
  <div class="card card-flush">
    <div class="card-head pad"><h2><?= __('Latest requests') ?></h2><a class="link small" href="leads.php"><?= __('View all') ?> <?= icon('arrow-right') ?></a></div>
    <?php if (!$recent): ?>
      <div class="empty">
        <?= icon('inbox', 'icon empty-icon') ?>
        <p><strong><?= __('No requests yet') ?></strong></p>
        <p class="muted"><?= __('Quote requests sent from the website contact form will appear here automatically.') ?></p>
      </div>
    <?php else: ?>
      <ul class="rows">
        <?php foreach ($recent as $l): ?>
          <li>
            <a href="lead.php?id=<?= (int) $l['id'] ?>" class="row-link">
              <?= avatar(lead_name($l)) ?>
              <span class="row-main">
                <strong><?= e(lead_name($l)) ?></strong> <?= priority_badge($l['priority']) ?>
                <small><?= e($l['company']) ?> · <?= e(lead_summary($l) ?: $l['reference']) ?></small>
              </span>
              <span class="row-meta">
                <?= division_badge($l['division']) ?>
                <?= status_badge($l['status']) ?>
                <small class="muted"><?= e(time_ago($l['created_at'])) ?></small>
              </span>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </div>

  <div class="card card-flush">
    <div class="card-head pad"><h2><?= __('Follow-ups') ?></h2><a class="link small" href="leads.php?followup=due"><?= __('Overdue') ?> <?= icon('arrow-right') ?></a></div>
    <?php if (!$followUps): ?>
      <div class="empty">
        <?= icon('calendar', 'icon empty-icon') ?>
        <p class="muted"><?= __('No follow-ups planned for the next 7 days.') ?></p>
      </div>
    <?php else: ?>
      <ul class="rows">
        <?php foreach ($followUps as $l):
            $due = strtotime($l['follow_up_at']);
            $today = strtotime(date('Y-m-d'));
            $label = $due < $today ? __('Overdue · %s', fmt_date($l['follow_up_at'])) : ($due === $today ? __('Today') : fmt_date($l['follow_up_at']));
            ?>
          <li>
            <a href="lead.php?id=<?= (int) $l['id'] ?>" class="row-link">
              <span class="row-main">
                <strong><?= e(lead_name($l)) ?></strong>
                <small><?= e($l['company']) ?></small>
              </span>
              <span class="due <?= $due < $today ? 'due-late' : ($due === $today ? 'due-today' : '') ?>"><?= icon('clock') ?><?= e(__($label)) ?></span>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </div>
</section>
<?php layout_end();
