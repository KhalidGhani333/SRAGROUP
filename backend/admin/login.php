<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

if (!db_tables_exist() || (int) db_value('SELECT COUNT(*) FROM users') === 0) {
    redirect('setup.php');
}

$next = safe_next(query_str('next', 300) ?: post_str('next', 300));
if (current_user()) {
    redirect($next);
}

$error = null;
$email = '';
if (is_post()) {
    verify_csrf();
    $email = post_str('email', 190);
    $error = attempt_login($email, (string) ($_POST['password'] ?? ''));
    if ($error === null) {
        redirect($next);
    }
}

auth_layout_start(__('Sign in'));
?>
<p class="eyebrow"><?= __('SRAGROUP CRM') ?></p>
<h1><?= __('Sign in') ?></h1>
<p class="muted"><?= __('Use the account your administrator created for you.') ?></p>
<?php if ($error): ?>
  <div class="alert alert-error" role="alert"><?= e($error) ?></div>
<?php endif; ?>
<form method="post" class="stack" novalidate>
  <?= csrf_field() ?>
  <input type="hidden" name="next" value="<?= e($next) ?>">
  <label class="field">
    <span><?= __('Email') ?></span>
    <input type="email" name="email" value="<?= e($email) ?>" autocomplete="username" required autofocus>
  </label>
  <label class="field">
    <span><?= __('Password') ?></span>
    <input type="password" name="password" autocomplete="current-password" required>
  </label>
  <button class="btn btn-dark btn-block" type="submit"><?= __('Sign in') ?> <?= icon('arrow-right') ?></button>
</form>
<p class="fine"><?= __('Forgot your password? Ask an administrator to reset it from the Users page.') ?></p>
<?php auth_layout_end();
