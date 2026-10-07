<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_admin();
$id = (int) ($_GET['id'] ?? 0);
$target = db_one('SELECT * FROM users WHERE id = ?', [$id]);
if (!$target) {
    flash('error', __('User not found.'));
    redirect('users.php');
}
$isSelf = $id === $user['id'];
$activeAdmins = (int) db_value("SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1");
$isLastAdmin = $target['role'] === 'admin' && (int) $target['is_active'] && $activeAdmins <= 1;

$errors = [];
if (is_post()) {
    verify_csrf();
    $action = post_str('action', 20);

    if ($action === 'save') {
        $name = post_str('name', 120);
        $email = mb_strtolower(post_str('email', 190));
        $role = post_str('role', 10);
        $division = post_str('division', 20);
        $active = !empty($_POST['is_active']) ? 1 : 0;
        $userLang = post_str('lang', 2) === 'en' ? 'en' : 'it';

        if ($name === '') {
            $errors['name'] = __('Enter a name.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = __('Enter a valid email address.');
        } elseif (db_value('SELECT id FROM users WHERE email = ? AND id <> ?', [$email, $id])) {
            $errors['email'] = __('Another user already uses this email.');
        }
        if (!isset(ROLES[$role]) || !isset(USER_DIVISIONS[$division])) {
            $errors['role'] = __('Choose a valid role and division.');
        }
        // Never lock everyone out: the last active admin keeps the admin role and stays enabled.
        if (($isSelf || $isLastAdmin) && ($role !== 'admin' || !$active)) {
            $errors['role'] = $isSelf
                ? __('You cannot remove your own admin access or disable yourself.')
                : __('This is the last active administrator. Promote someone else first.');
        }
        if ($role === 'admin') {
            $division = 'all';
        }

        if (!$errors) {
            db_run(
                'UPDATE users SET name = ?, email = ?, role = ?, division = ?, lang = ?, is_active = ? WHERE id = ?',
                [$name, $email, $role, $division, $userLang, $active, $id],
            );
            // Leads this user can no longer see go back to the unassigned queue.
            if ($division !== 'all') {
                db_run('UPDATE leads SET assigned_to = NULL WHERE assigned_to = ? AND division <> ?', [$id, $division]);
            }
            flash('success', __('User saved.'));
            redirect('user-edit.php?id=' . $id);
        }
        $target = array_merge($target, ['name' => $name, 'email' => $email, 'role' => $role, 'division' => $division, 'lang' => $userLang, 'is_active' => $active]);
    }

    if ($action === 'password') {
        $password = (string) ($_POST['password'] ?? '');
        if ($p = password_problem($password)) {
            $errors['password'] = $p;
        } else {
            db_run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $id]);
            flash('success', __('Password changed. Share the new password with %s privately.', $target['name']));
            redirect('user-edit.php?id=' . $id);
        }
    }

    if ($action === 'delete' && !$isSelf && !$isLastAdmin) {
        db_run('DELETE FROM users WHERE id = ?', [$id]);
        flash('success', __('%s was deleted. Their leads are now unassigned; notes stay as "Deleted user".', $target['name']));
        redirect('users.php');
    }
}

$openLeads = (int) db_value("SELECT COUNT(*) FROM leads WHERE assigned_to = ? AND status IN ('new','contacted','qualified','quoted')", [$id]);

layout_start($target['name'], 'users', $user);
?>
<a class="back" href="users.php"><?= icon('arrow-left') ?> <?= __('All users') ?></a>
<header class="page-head">
  <div class="lead-id">
    <?= avatar($target['name'], 'avatar-lg') ?>
    <div>
      <p class="eyebrow"><?= e(__('%s · Last sign-in %s', __(ROLES[$target['role']]), $target['last_login_at'] ? time_ago($target['last_login_at']) : __('never'))) ?></p>
      <h1><?= e($target['name']) ?></h1>
      <p class="muted"><?= e($target['email']) ?> · <a class="link" href="leads.php?assigned=<?= $id ?>&amp;status=open"><?= e(__('%d open', $openLeads)) ?></a></p>
    </div>
  </div>
</header>

<div class="grid-2">
  <section class="card">
    <h2><?= __('Details &amp; access') ?></h2>
    <form method="post" class="stack" novalidate>
      <?= csrf_field() ?>
      <input type="hidden" name="action" value="save">
      <label class="field">
        <span><?= __('Full name') ?></span>
        <input name="name" value="<?= e($target['name']) ?>" required>
        <?php if (isset($errors['name'])): ?><em class="error"><?= e($errors['name']) ?></em><?php endif; ?>
      </label>
      <label class="field">
        <span><?= __('Email') ?></span>
        <input type="email" name="email" value="<?= e($target['email']) ?>" required>
        <?php if (isset($errors['email'])): ?><em class="error"><?= e($errors['email']) ?></em><?php endif; ?>
      </label>
      <label class="field">
        <span><?= __('Role') ?></span>
        <select name="role" data-role-select>
          <?php foreach (ROLES as $k => $label): ?>
            <option value="<?= e($k) ?>" <?= $target['role'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
          <?php endforeach; ?>
        </select>
        <?php if (isset($errors['role'])): ?><em class="error"><?= e($errors['role']) ?></em><?php endif; ?>
      </label>
      <label class="field" data-division-field>
        <span><?= __('Leads visible') ?></span>
        <select name="division">
          <?php foreach (USER_DIVISIONS as $k => $label): ?>
            <option value="<?= e($k) ?>" <?= $target['division'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <label class="field">
        <span><?= __('Panel language') ?></span>
        <select name="lang">
          <?php foreach (ADMIN_LANGS as $k => $label): ?>
            <option value="<?= e($k) ?>" <?= $target['lang'] === $k ? 'selected' : '' ?>><?= e($label) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <label class="check">
        <input type="checkbox" name="is_active" value="1" <?= (int) $target['is_active'] ? 'checked' : '' ?>>
        <?= __('Account enabled (can sign in)') ?>
      </label>
      <button class="btn btn-dark btn-block" type="submit"><?= __('Save user') ?></button>
    </form>
  </section>

  <div class="stack-cards">
    <section class="card">
      <h2><?= __('Reset password') ?></h2>
      <form method="post" class="stack" novalidate>
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="password">
        <label class="field">
          <span><?= __('New password') ?></span>
          <input type="text" name="password" autocomplete="new-password" required data-password>
          <small><?= __('At least 10 characters, with letters and numbers.') ?> <button type="button" class="link" data-generate><?= __('Generate one') ?></button></small>
          <?php if (isset($errors['password'])): ?><em class="error"><?= e($errors['password']) ?></em><?php endif; ?>
        </label>
        <button class="btn btn-outline btn-block" type="submit"><?= __('Set new password') ?></button>
      </form>
    </section>

    <?php if (!$isSelf && !$isLastAdmin): ?>
      <section class="card danger-zone">
        <h2><?= __('Delete user') ?></h2>
        <p class="muted small"><?= e(__('Prefer disabling the account to keep their name on notes. Deleting unassigns their %d open leads.', $openLeads)) ?></p>
        <form method="post" data-confirm="<?= e(__('Delete %s? This cannot be undone.', $target['name'])) ?>">
          <?= csrf_field() ?>
          <input type="hidden" name="action" value="delete">
          <button class="btn btn-danger btn-block" type="submit"><?= icon('trash') ?> <?= __('Delete user') ?></button>
        </form>
      </section>
    <?php endif; ?>
  </div>
</div>
<?php layout_end();
