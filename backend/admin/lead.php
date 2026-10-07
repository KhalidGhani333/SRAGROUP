<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_login();
$id = (int) ($_GET['id'] ?? 0);
$lead = find_lead_for_user($id, $user);
if (!$lead) {
    flash('error', __('That lead does not exist or belongs to another division.'));
    redirect('leads.php');
}

$owners = assignable_users($lead['division']);
$ownerIds = array_map('intval', array_column($owners, 'id'));

if (is_post()) {
    verify_csrf();
    $action = post_str('action', 20);

    if ($action === 'update') {
        $changes = [];
        $log = [];

        $status = post_str('status', 20);
        if (isset(STATUSES[$status]) && $status !== $lead['status']) {
            $changes['status'] = $status;
            $log[] = ['status', __('Status changed from %s to %s', __(STATUSES[$lead['status']]), __(STATUSES[$status]))];
        }

        $priority = post_str('priority', 10);
        if (isset(PRIORITIES[$priority]) && $priority !== $lead['priority']) {
            $changes['priority'] = $priority;
            $log[] = ['priority', __('Priority set to %s', __(PRIORITIES[$priority]))];
        }

        $assigned = post_str('assigned_to', 10);
        $assignedId = ctype_digit($assigned) && in_array((int) $assigned, $ownerIds, true) ? (int) $assigned : null;
        if ($assignedId !== ($lead['assigned_to'] === null ? null : (int) $lead['assigned_to'])) {
            $changes['assigned_to'] = $assignedId;
            $name = $assignedId ? (string) db_value('SELECT name FROM users WHERE id = ?', [$assignedId]) : null;
            $log[] = ['assigned', $name ? __('Assigned to %s', $name) : __('Owner removed')];
        }

        // Accept Italian (250.000,50) and plain (250000.50) number formats.
        $valueRaw = str_replace(['€', ' '], '', post_str('estimated_value', 20));
        if (str_contains($valueRaw, ',') || preg_match('/^\d{1,3}(\.\d{3})+$/', $valueRaw)) {
            $valueRaw = str_replace(['.', ','], ['', '.'], $valueRaw);
        }
        $value = $valueRaw === '' ? null : (is_numeric($valueRaw) && (float) $valueRaw >= 0 ? number_format((float) $valueRaw, 2, '.', '') : false);
        if ($value === false) {
            flash('error', __('Estimated value must be a number.'));
            redirect('lead.php?id=' . $id);
        }
        if ($value !== ($lead['estimated_value'] === null ? null : number_format((float) $lead['estimated_value'], 2, '.', ''))) {
            $changes['estimated_value'] = $value;
            $log[] = ['value', $value === null ? __('Estimated value removed') : __('Estimated value set to %s', fmt_money($value))];
        }

        $follow = post_str('follow_up_at', 10);
        $follow = preg_match('/^\d{4}-\d{2}-\d{2}$/', $follow) ? $follow : null;
        if ($follow !== $lead['follow_up_at']) {
            $changes['follow_up_at'] = $follow;
            $log[] = ['followup', $follow ? __('Follow-up planned for %s', fmt_date($follow)) : __('Follow-up removed')];
        }

        if ($changes) {
            $set = implode(', ', array_map(fn ($k) => "{$k} = ?", array_keys($changes)));
            db_run("UPDATE leads SET {$set} WHERE id = ?", [...array_values($changes), $id]);
            foreach ($log as [$type, $text]) {
                log_activity($id, $user['id'], $type, $text);
            }
            flash('success', __('Lead updated.'));
        } else {
            flash('info', __('Nothing changed.'));
        }
        redirect('lead.php?id=' . $id);
    }

    if ($action === 'note') {
        $body = post_str('body', 5000);
        if ($body === '') {
            flash('error', __('Write something before adding the note.'));
        } else {
            db_run('INSERT INTO lead_notes (lead_id, user_id, body) VALUES (?, ?, ?)', [$id, $user['id'], $body]);
            log_activity($id, $user['id'], 'note', __('Added a note'));
            // The first note on a new request usually means someone has picked it up.
            if ($lead['status'] === 'new' && !empty($_POST['mark_contacted'])) {
                db_run("UPDATE leads SET status = 'contacted' WHERE id = ?", [$id]);
                log_activity($id, $user['id'], 'status', __('Status changed from %s to %s', __('New'), __('Contacted')));
            }
            flash('success', __('Note added.'));
        }
        redirect('lead.php?id=' . $id . '#notes');
    }

    if ($action === 'delete_note') {
        $noteId = (int) post_str('note_id', 12);
        $note = db_one('SELECT user_id FROM lead_notes WHERE id = ? AND lead_id = ?', [$noteId, $id]);
        if ($note && (is_admin($user) || (int) $note['user_id'] === $user['id'])) {
            db_run('DELETE FROM lead_notes WHERE id = ?', [$noteId]);
            flash('success', __('Note deleted.'));
        }
        redirect('lead.php?id=' . $id . '#notes');
    }

    if ($action === 'delete' && is_admin($user)) {
        if ($lead['attachment_path'] && ($file = attachment_full_path($lead['attachment_path']))) {
            @unlink($file);
        }
        db_run('DELETE FROM leads WHERE id = ?', [$id]);
        flash('success', __('Lead %s and all its data were permanently deleted.', $lead['reference']));
        redirect('leads.php');
    }

    redirect('lead.php?id=' . $id);
}

$notes = db_all(
    'SELECT n.id, n.body, n.created_at, n.user_id, u.name FROM lead_notes n LEFT JOIN users u ON u.id = n.user_id
     WHERE n.lead_id = ? ORDER BY n.created_at DESC, n.id DESC',
    [$id],
);
$activity = db_all(
    'SELECT a.type, a.description, a.created_at, u.name FROM lead_activity a LEFT JOIN users u ON u.id = a.user_id
     WHERE a.lead_id = ? ORDER BY a.created_at DESC, a.id DESC',
    [$id],
);
$others = db_all(
    'SELECT id, reference, division, status, created_at FROM leads WHERE email = ? AND id <> ? ORDER BY created_at DESC LIMIT 5',
    [$lead['email'], $id],
);
$others = array_values(array_filter($others, fn ($o) => can_see_division($user, $o['division'])));
$details = lead_detail_rows($lead);
$name = lead_name($lead);
$waPhone = preg_replace('/\D+/', '', $lead['phone']);
$stageIndex = array_search($lead['status'], array_keys(STATUSES), true);

layout_start($name, 'leads', $user);
?>
<a class="back" href="leads.php"><?= icon('arrow-left') ?> <?= __('All leads') ?></a>

<header class="lead-head accent-<?= e($lead['division']) ?>">
  <div class="lead-id">
    <?= avatar($name, 'avatar-lg') ?>
    <div>
      <p class="eyebrow"><?= e(__('%s · Received %s', $lead['reference'], fmt_datetime($lead['created_at']))) ?></p>
      <h1><?= e($name) ?></h1>
      <p class="muted"><?= e($lead['job_role'] ? __('%s at ', $lead['job_role']) : '') ?><strong><?= e($lead['company']) ?></strong></p>
      <div class="chips"><?= division_badge($lead['division']) ?> <?= status_badge($lead['status']) ?> <?= priority_badge($lead['priority']) ?></div>
    </div>
  </div>
  <div class="head-actions">
    <a class="btn btn-outline" href="mailto:<?= e($lead['email']) ?>?subject=<?= rawurlencode('SRAGROUP - ' . $lead['reference']) ?>"><?= icon('mail') ?> <?= __('Email') ?></a>
    <a class="btn btn-outline" href="tel:<?= e(preg_replace('/[^\d+]/', '', $lead['phone'])) ?>"><?= icon('phone') ?> <?= __('Call') ?></a>
    <?php if (strlen($waPhone) >= 8): ?>
      <a class="btn btn-outline" href="https://wa.me/<?= e($waPhone) ?>" target="_blank" rel="noopener"><?= icon('message') ?> <?= __('WhatsApp') ?></a>
    <?php endif; ?>
  </div>
</header>

<ol class="stages" aria-label="<?= __('Pipeline stage') ?>">
  <?php foreach (array_keys(STATUSES) as $i => $s):
      if ($s === 'lost' && $lead['status'] !== 'lost') continue;
      if ($s === 'won' && $lead['status'] === 'lost') continue;
      $state = $s === $lead['status'] ? 'current' : ($i < $stageIndex ? 'done' : '');
      ?>
    <li class="stage <?= $state ?> stage-<?= e($s) ?>"><span><?= e(__(STATUSES[$s])) ?></span></li>
  <?php endforeach; ?>
</ol>

<div class="lead-layout">
  <div class="lead-main">
    <section class="card">
      <h2><?= __('Request') ?></h2>
      <?php if ($details): ?>
        <dl class="specs">
          <?php foreach ($details as [$label, $value]): ?>
            <div><dt><?= e(__($label)) ?></dt><dd><?= e($value) ?></dd></div>
          <?php endforeach; ?>
        </dl>
      <?php endif; ?>
      <h3 class="sub"><?= __('Message') ?></h3>
      <div class="message"><?= nl2br(e($lead['message'])) ?></div>
      <?php if ($lead['attachment_name']): ?>
        <a class="file" href="attachment.php?id=<?= $id ?>">
          <?= icon('paperclip') ?>
          <span><strong><?= e($lead['attachment_name']) ?></strong><small><?= e(fmt_bytes($lead['attachment_size'] ? (int) $lead['attachment_size'] : null)) ?></small></span>
          <?= icon('download') ?>
        </a>
      <?php endif; ?>
    </section>

    <section class="card" id="notes">
      <h2><?= __('Notes') ?> <span class="count"><?= count($notes) ?></span></h2>
      <form method="post" class="note-form">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="note">
        <textarea name="body" rows="3" placeholder="<?= __('Call summary, next steps, quote details…') ?>" required></textarea>
        <div class="note-actions">
          <?php if ($lead['status'] === 'new'): ?>
            <label class="check"><input type="checkbox" name="mark_contacted" value="1" checked> <?= __('Mark as contacted') ?></label>
          <?php else: ?><span></span><?php endif; ?>
          <button class="btn btn-dark" type="submit"><?= icon('plus') ?> <?= __('Add note') ?></button>
        </div>
      </form>
      <?php if ($notes): ?>
        <ul class="notes">
          <?php foreach ($notes as $n): ?>
            <li>
              <?= avatar($n['name'] ?? __('Deleted user'), 'avatar-sm') ?>
              <div>
                <p class="note-meta"><strong><?= e($n['name'] ?? __('Deleted user')) ?></strong> · <span title="<?= e(fmt_datetime($n['created_at'])) ?>"><?= e(time_ago($n['created_at'])) ?></span></p>
                <div class="note-body"><?= nl2br(e($n['body'])) ?></div>
              </div>
              <?php if (is_admin($user) || (int) $n['user_id'] === $user['id']): ?>
                <form method="post" data-confirm="<?= __('Delete this note?') ?>">
                  <?= csrf_field() ?>
                  <input type="hidden" name="action" value="delete_note">
                  <input type="hidden" name="note_id" value="<?= (int) $n['id'] ?>">
                  <button class="icon-btn subtle" type="submit" aria-label="<?= __('Delete note') ?>"><?= icon('trash') ?></button>
                </form>
              <?php endif; ?>
            </li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    </section>

    <section class="card">
      <h2><?= __('Activity') ?></h2>
      <ul class="timeline">
        <?php foreach ($activity as $a): ?>
          <li class="t-<?= e($a['type']) ?>">
            <span class="t-dot"></span>
            <p><?= e($a['description']) ?></p>
            <small><?= e($a['name'] ?? ($a['type'] === 'created' ? __('Website') : __('System'))) ?> · <?= e(fmt_datetime($a['created_at'])) ?></small>
          </li>
        <?php endforeach; ?>
      </ul>
    </section>
  </div>

  <aside class="lead-side">
    <section class="card">
      <h2><?= __('Manage') ?></h2>
      <p class="muted small hint"><?= __('Internal fields for your team - the customer doesn\'t fill these. Pick an owner, set the deal value once you quote, and plan the next call.') ?></p>
      <form method="post" class="stack">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="update">
        <label class="field">
          <span><?= __('Status') ?></span>
          <select name="status">
            <?php foreach (STATUSES as $k => $label): ?>
              <option value="<?= e($k) ?>" <?= $lead['status'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <label class="field">
          <span><?= __('Owner') ?></span>
          <select name="assigned_to">
            <option value=""><?= __('Unassigned') ?></option>
            <?php foreach ($owners as $o): ?>
              <option value="<?= (int) $o['id'] ?>" <?= (int) $lead['assigned_to'] === (int) $o['id'] ? 'selected' : '' ?>><?= e($o['name']) ?><?= (int) $o['id'] === $user['id'] ? ' (me)' : '' ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <label class="field">
          <span><?= __('Priority') ?></span>
          <select name="priority">
            <?php foreach (PRIORITIES as $k => $label): ?>
              <option value="<?= e($k) ?>" <?= $lead['priority'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <label class="field">
          <span><?= __('Estimated value (€)') ?></span>
          <input name="estimated_value" inputmode="decimal" value="<?= $lead['estimated_value'] === null ? '' : e(rtrim(rtrim($lead['estimated_value'], '0'), '.')) ?>" placeholder="<?= __('e.g. 250000') ?>">
        </label>
        <label class="field">
          <span><?= __('Next follow-up') ?></span>
          <input type="date" name="follow_up_at" value="<?= e($lead['follow_up_at']) ?>">
        </label>
        <button class="btn btn-dark btn-block" type="submit"><?= __('Save changes') ?></button>
      </form>
    </section>

    <section class="card">
      <h2><?= __('Contact') ?></h2>
      <ul class="contact-list">
        <li><?= icon('mail') ?><a href="mailto:<?= e($lead['email']) ?>"><?= e($lead['email']) ?></a></li>
        <li><?= icon('phone') ?><a href="tel:<?= e(preg_replace('/[^\d+]/', '', $lead['phone'])) ?>"><?= e($lead['phone']) ?></a></li>
        <li><?= icon('building') ?><span><?= e($lead['company']) ?></span></li>
      </ul>
    </section>

    <section class="card">
      <h2><?= __('Consent &amp; source') ?></h2>
      <dl class="meta">
        <div><dt><?= __('Privacy policy') ?></dt><dd><?= $lead['consent_privacy'] ? '<span class="yes">' . icon('check') . ' Accepted</span>' : __('No') ?></dd></div>
        <div><dt><?= __('Marketing') ?></dt><dd><?= $lead['consent_marketing'] ? '<span class="yes">' . icon('check') . ' ' . __('Opted in') . '</span>' : '<span class="muted">' . __('Not given') . '</span>' ?></dd></div>
        <div><dt><?= __('Language') ?></dt><dd><?= $lead['lang'] === 'en' ? __('English') : __('Italian') ?></dd></div>
        <div><dt><?= __('Submitted') ?></dt><dd><?= e(fmt_datetime($lead['submitted_at'] ?? $lead['created_at'])) ?></dd></div>
        <?php if ($lead['source_page']): ?>
          <div><dt><?= __('Page') ?></dt><dd class="break"><?= e($lead['source_page']) ?></dd></div>
        <?php endif; ?>
        <div><dt><?= __('IP address') ?></dt><dd><?= e($lead['ip'] ?: '-') ?></dd></div>
      </dl>
    </section>

    <?php if ($others): ?>
      <section class="card">
        <h2><?= __('Other requests from this contact') ?></h2>
        <ul class="mini-list">
          <?php foreach ($others as $o): ?>
            <li><a href="lead.php?id=<?= (int) $o['id'] ?>"><strong><?= e($o['reference']) ?></strong> <?= status_badge($o['status']) ?><small><?= e(__(DIVISIONS[$o['division']])) ?> · <?= e(fmt_date($o['created_at'])) ?></small></a></li>
          <?php endforeach; ?>
        </ul>
      </section>
    <?php endif; ?>

    <?php if (is_admin($user)): ?>
      <section class="card danger-zone">
        <h2><?= __('Delete lead') ?></h2>
        <p class="muted small"><?= __('Permanently removes the request, its attachment, notes and history - use it for GDPR erasure requests.') ?></p>
        <form method="post" data-confirm="<?= e(__('Permanently delete %s? This cannot be undone.', $lead['reference'])) ?>">
          <?= csrf_field() ?>
          <input type="hidden" name="action" value="delete">
          <button class="btn btn-danger btn-block" type="submit"><?= icon('trash') ?> <?= __('Delete permanently') ?></button>
        </form>
      </section>
    <?php endif; ?>
  </aside>
</div>
<?php layout_end();
