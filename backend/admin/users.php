<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_admin();

$errors = [];
$form = ['name' => '', 'email' => '', 'role' => 'staff', 'division' => 'all', 'lang' => 'it'];
if (is_post()) {
    verify_csrf();
    $form = [
        'name' => post_str('name', 120),
        'email' => mb_strtolower(post_str('email', 190)),
        'role' => post_str('role', 10),
        'division' => post_str('division', 20),
        'lang' => post_str('lang', 2) === 'en' ? 'en' : 'it',
    ];
    $password = (string) ($_POST['password'] ?? '');
    if ($form['name'] === '') {
        $errors['name'] = __('Enter a name.');
    }
    if (!filter_var($form['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = __('Enter a valid email address.');
    } elseif (db_value('SELECT id FROM users WHERE email = ?', [$form['email']])) {
        $errors['email'] = __('A user with this email already exists.');
    }
    if (!isset(ROLES[$form['role']])) {
        $errors['role'] = __('Choose a role.');
    }
    if (!isset(USER_DIVISIONS[$form['division']])) {
        $errors['division'] = __('Choose which leads this user sees.');
    }
    if ($form['role'] === 'admin') {
        $form['division'] = 'all';
    }
    if ($p = password_problem($password)) {
        $errors['password'] = $p;
    }
    if (!$errors) {
        db_run(
            'INSERT INTO users (name, email, password_hash, role, division, lang) VALUES (?, ?, ?, ?, ?, ?)',
            [$form['name'], $form['email'], password_hash($password, PASSWORD_DEFAULT), $form['role'], $form['division'], $form['lang']],
        );
        flash('success', __('%s can now sign in with %s. Share the password with them privately.', $form['name'], $form['email']));
        redirect('users.php');
    }
}

$users = db_all(
    "SELECT u.*, (SELECT COUNT(*) FROM leads l WHERE l.assigned_to = u.id AND l.status IN ('new','contacted','qualified','quoted')) AS open_leads
     FROM users u ORDER BY u.is_active DESC, u.role = 'admin' DESC, u.name",
);

layout_start(__('Users'), 'users', $user);
?>
<header class="page-head">
  <div>
    <p class="eyebrow"><?= __('Administration') ?></p>
    <h1><?= __('Users') ?></h1>
    <p class="muted"><?= __('Administrators see everything and manage users. Team members only see the leads of their division.') ?></p>
  </div>
</header>

<div class="grid-2 grid-wide-left">
  <div class="card card-flush">
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr><th><?= __('User') ?></th><th><?= __('Role') ?></th><th><?= __('Sees') ?></th><th class="num"><?= __('Open leads') ?></th><th><?= __('Last sign-in') ?></th><th></th></tr>
        </thead>
        <tbody>
          <?php foreach ($users as $u): ?>
            <tr class="<?= (int) $u['is_active'] ? '' : 'inactive' ?>" data-href="user-edit.php?id=<?= (int) $u['id'] ?>">
              <td>
                <a class="cell-contact" href="user-edit.php?id=<?= (int) $u['id'] ?>">
                  <?= avatar($u['name']) ?>
                  <span>
                    <strong><?= e($u['name']) ?></strong><?= (int) $u['id'] === $user['id'] ? ' <span class="tag">' . __('You') . '</span>' : '' ?>
                    <?= (int) $u['is_active'] ? '' : ' <span class="tag tag-muted">' . __('Disabled') . '</span>' ?>
                    <small><?= e($u['email']) ?></small>
                  </span>
                </a>
              </td>
              <td><?= $u['role'] === 'admin' ? '<span class="tag tag-dark">' . icon('shield') . ' Admin</span>' : __('Team member') ?></td>
              <td><?= $u['division'] === 'all' ? __('All divisions') : division_badge($u['division']) ?></td>
              <td class="num"><?= (int) $u['open_leads'] ?></td>
              <td><?= e($u['last_login_at'] ? time_ago($u['last_login_at']) : __('Never')) ?></td>
              <td class="num"><a class="link small" href="user-edit.php?id=<?= (int) $u['id'] ?>"><?= __('Edit') ?></a></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <section class="card">
    <h2><?= __('Add a user') ?></h2>
    <form method="post" class="stack" novalidate>
      <?= csrf_field() ?>
      <label class="field">
        <span><?= __('Full name') ?></span>
        <input name="name" value="<?= e($form['name']) ?>" required>
        <?php if (isset($errors['name'])): ?><em class="error"><?= e($errors['name']) ?></em><?php endif; ?>
      </label>
      <label class="field">
        <span><?= __('Email') ?></span>
        <input type="email" name="email" value="<?= e($form['email']) ?>" required>
        <?php if (isset($errors['email'])): ?><em class="error"><?= e($errors['email']) ?></em><?php endif; ?>
      </label>
      <label class="field">
        <span><?= __('Role') ?></span>
        <select name="role" data-role-select>
          <?php foreach (ROLES as $k => $label): ?>
            <option value="<?= e($k) ?>" <?= $form['role'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <label class="field" data-division-field>
        <span><?= __('Leads visible') ?></span>
        <select name="division">
          <?php foreach (USER_DIVISIONS as $k => $label): ?>
            <option value="<?= e($k) ?>" <?= $form['division'] === $k ? 'selected' : '' ?>><?= e(__($label)) ?></option>
          <?php endforeach; ?>
        </select>
        <small><?= __('E.g. the solar team only sees solar requests.') ?></small>
      </label>
      <label class="field">
        <span><?= __('Panel language') ?></span>
        <select name="lang">
          <?php foreach (ADMIN_LANGS as $k => $label): ?>
            <option value="<?= e($k) ?>" <?= $form['lang'] === $k ? 'selected' : '' ?>><?= e($label) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <label class="field">
        <span><?= __('Temporary password') ?></span>
        <input type="text" name="password" autocomplete="new-password" required data-password>
        <small><?= __('At least 10 characters, with letters and numbers.') ?> <button type="button" class="link" data-generate><?= __('Generate one') ?></button></small>
        <?php if (isset($errors['password'])): ?><em class="error"><?= e($errors['password']) ?></em><?php endif; ?>
      </label>
      <button class="btn btn-dark btn-block" type="submit"><?= icon('plus') ?> <?= __('Create user') ?></button>
    </form>
  </section>
</div>
<?php layout_end();
