<?php
/**
 * First-run installer: creates the database tables and the first administrator.
 * Locks itself as soon as one user exists.
 */
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$problem = null;
$installed = false;
try {
    db();
} catch (PDOException $e) {
    // Unknown database: try to create it (works with XAMPP root; on cPanel create it in the panel).
    if ((int) ($e->errorInfo[1] ?? 0) === 1049 || str_contains($e->getMessage(), 'Unknown database')) {
        try {
            $name = str_replace('`', '', (string) config('db.name'));
            db_connect(false)->exec("CREATE DATABASE IF NOT EXISTS `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e2) {
            $problem = 'The database "' . config('db.name') . '" does not exist and could not be created automatically. Create it in phpMyAdmin / cPanel, then reload this page.';
        }
    } else {
        $problem = 'Cannot connect to MySQL: ' . $e->getMessage() . '. Check that MySQL is running and the "db" settings in backend/config.php are correct.';
    }
}

if (!$problem) {
    try {
        if (!db_tables_exist()) {
            $sql = (string) file_get_contents(BACKEND_ROOT . '/database/schema.sql');
            $sql = preg_replace('/^--.*$/m', '', $sql);
            foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
                db()->exec($statement);
            }
        }
        $installed = (int) db_value('SELECT COUNT(*) FROM users') > 0;
    } catch (PDOException $e) {
        $problem = 'Could not create the tables: ' . $e->getMessage();
    }
}

if ($installed) {
    redirect('login.php');
}

$errors = [];
$form = ['name' => '', 'email' => ''];
if (!$problem && is_post()) {
    verify_csrf();
    $form = ['name' => post_str('name', 120), 'email' => mb_strtolower(post_str('email', 190))];
    $password = (string) ($_POST['password'] ?? '');
    if ($form['name'] === '') {
        $errors['name'] = __('Enter your name.');
    }
    if (!filter_var($form['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = __('Enter a valid email address.');
    }
    if ($p = password_problem($password)) {
        $errors['password'] = $p;
    } elseif ($password !== ($_POST['password_confirm'] ?? '')) {
        $errors['password_confirm'] = __('Passwords do not match.');
    }
    if (!$errors) {
        db_run(
            "INSERT INTO users (name, email, password_hash, role, division, lang) VALUES (?, ?, ?, 'admin', 'all', ?)",
            [$form['name'], $form['email'], password_hash($password, PASSWORD_DEFAULT), lang()],
        );
        attempt_login($form['email'], $password);
        flash('success', __('Welcome! Your CRM is ready. New quote requests from the website will appear under Leads.'));
        redirect('index.php');
    }
}

auth_layout_start(__('Setup'));
?>
<p class="eyebrow"><?= __('First-time setup') ?></p>
<h1><?= __('Create the administrator') ?></h1>
<?php if ($problem): ?>
  <div class="alert alert-error"><?= e($problem) ?></div>
  <a class="btn btn-dark btn-block" href="setup.php"><?= __('Try again') ?></a>
<?php else: ?>
  <p class="muted"><?= __('The database tables are ready. Create the first admin account; you can add the rest of the team afterwards.') ?></p>
  <form method="post" class="stack" novalidate>
    <?= csrf_field() ?>
    <label class="field">
      <span><?= __('Full name') ?></span>
      <input name="name" value="<?= e($form['name']) ?>" autocomplete="name" required>
      <?php if (isset($errors['name'])): ?><em class="error"><?= e($errors['name']) ?></em><?php endif; ?>
    </label>
    <label class="field">
      <span><?= __('Email') ?></span>
      <input type="email" name="email" value="<?= e($form['email']) ?>" autocomplete="email" required>
      <?php if (isset($errors['email'])): ?><em class="error"><?= e($errors['email']) ?></em><?php endif; ?>
    </label>
    <label class="field">
      <span><?= __('Password') ?></span>
      <input type="password" name="password" autocomplete="new-password" required>
      <small><?= __('At least 10 characters, with letters and numbers.') ?></small>
      <?php if (isset($errors['password'])): ?><em class="error"><?= e($errors['password']) ?></em><?php endif; ?>
    </label>
    <label class="field">
      <span><?= __('Confirm password') ?></span>
      <input type="password" name="password_confirm" autocomplete="new-password" required>
      <?php if (isset($errors['password_confirm'])): ?><em class="error"><?= e($errors['password_confirm']) ?></em><?php endif; ?>
    </label>
    <button class="btn btn-dark btn-block" type="submit"><?= __('Create admin &amp; open CRM') ?></button>
  </form>
<?php endif; ?>
<?php auth_layout_end();
