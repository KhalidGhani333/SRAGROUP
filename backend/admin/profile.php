<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

$user = require_login();

$errors = [];
if (is_post()) {
    verify_csrf();
    $action = post_str('action', 20);

    if ($action === 'name') {
        $name = post_str('name', 120);
        $newLang = post_str('lang', 2) === 'en' ? 'en' : 'it';
        if ($name === '') {
            $errors['name'] = __('Enter your name.');
        } else {
            db_run('UPDATE users SET name = ?, lang = ? WHERE id = ?', [$name, $newLang, $user['id']]);
            set_lang($newLang);
            remember_lang($newLang);
            flash('success', __('Profile updated.'));
            redirect('profile.php');
        }
    }

    if ($action === 'password') {
        $current = (string) ($_POST['current'] ?? '');
        $new = (string) ($_POST['password'] ?? '');
        $hash = (string) db_value('SELECT password_hash FROM users WHERE id = ?', [$user['id']]);
        if (!password_verify($current, $hash)) {
            $errors['current'] = __('Your current password is not correct.');
        } elseif ($p = password_problem($new)) {
            $errors['password'] = $p;
        } elseif ($new !== ($_POST['password_confirm'] ?? '')) {
            $errors['password_confirm'] = __('Passwords do not match.');
        } else {
            db_run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($new, PASSWORD_DEFAULT), $user['id']]);
            session_regenerate_id(true);
            flash('success', __('Password changed.'));
            redirect('profile.php');
        }
    }

    if ($action === 'test_mail' && is_admin($user)) {
        $sent = send_mail(
            $user['email'],
            __('SRAGROUP CRM — test email'),
            __('This is a test email from the SRAGROUP CRM. If you can read it, notifications are working.'),
            null,
            true,
        );
        $sent
            ? flash('success', __('Test email sent to %s. Check the inbox (and spam folder).', $user['email']))
            : flash('error', __('Test email failed: %s', (string) last_mail_error()));
        redirect('profile.php');
    }
}

$smtpHost = (string) config('mail.smtp.host');

layout_start(__('My profile'), 'profile', $user);
?>
<header class="page-head">
  <div class="lead-id">
    <?= avatar($user['name'], 'avatar-lg') ?>
    <div>
      <p class="eyebrow"><?= e(__(ROLES[$user['role']])) ?> · <?= e(__(USER_DIVISIONS[$user['division']])) ?></p>
      <h1><?= e($user['name']) ?></h1>
      <p class="muted"><?= e($user['email']) ?></p>
    </div>
  </div>
</header>

<div class="grid-2">
  <section class="card">
    <h2><?= __('Your details') ?></h2>
    <form method="post" class="stack" novalidate>
      <?= csrf_field() ?>
      <input type="hidden" name="action" value="name">
      <label class="field">
        <span><?= __('Full name') ?></span>
        <input name="name" value="<?= e($user['name']) ?>" required>
        <?php if (isset($errors['name'])): ?><em class="error"><?= e($errors['name']) ?></em><?php endif; ?>
      </label>
      <label class="field">
        <span><?= __('Email') ?></span>
        <input type="email" value="<?= e($user['email']) ?>" disabled>
        <small><?= __('Only an administrator can change the sign-in email.') ?></small>
      </label>
      <label class="field">
        <span><?= __('Panel language') ?></span>
        <select name="lang">
          <?php foreach (ADMIN_LANGS as $code => $label): ?>
            <option value="<?= e($code) ?>" <?= $user['lang'] === $code ? 'selected' : '' ?>><?= e($label) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <button class="btn btn-dark btn-block" type="submit"><?= __('Save') ?></button>
    </form>
  </section>

  <div class="stack-cards">
    <section class="card">
      <h2><?= __('Change password') ?></h2>
      <form method="post" class="stack" novalidate>
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="password">
        <label class="field">
          <span><?= __('Current password') ?></span>
          <input type="password" name="current" autocomplete="current-password" required>
          <?php if (isset($errors['current'])): ?><em class="error"><?= e($errors['current']) ?></em><?php endif; ?>
        </label>
        <label class="field">
          <span><?= __('New password') ?></span>
          <input type="password" name="password" autocomplete="new-password" required>
          <small><?= __('At least 10 characters, with letters and numbers.') ?></small>
          <?php if (isset($errors['password'])): ?><em class="error"><?= e($errors['password']) ?></em><?php endif; ?>
        </label>
        <label class="field">
          <span><?= __('Confirm new password') ?></span>
          <input type="password" name="password_confirm" autocomplete="new-password" required>
          <?php if (isset($errors['password_confirm'])): ?><em class="error"><?= e($errors['password_confirm']) ?></em><?php endif; ?>
        </label>
        <button class="btn btn-outline btn-block" type="submit"><?= __('Update password') ?></button>
      </form>
    </section>

    <?php if (is_admin($user)): ?>
      <section class="card">
        <h2><?= icon('mail') ?> <?= __('Email notifications') ?></h2>
        <dl class="meta">
          <div>
            <dt><?= __('Sending') ?></dt>
            <dd>
              <?php if (!config('mail.enabled')): ?>
                <span class="muted"><?= __('Disabled in config.php (mail.enabled)') ?></span>
              <?php elseif ($smtpHost !== ''): ?>
                <span class="yes"><?= icon('check') ?> <?= e(__('SMTP · %s', $smtpHost)) ?></span>
              <?php else: ?>
                <span class="yes"><?= icon('check') ?> <?= __('PHP mail() of the server') ?></span>
              <?php endif; ?>
            </dd>
          </div>
          <div><dt><?= __('Sender') ?></dt><dd class="break"><?= e(config('mail.from')) ?></dd></div>
          <div><dt><?= __('Auto-reply to customer') ?></dt><dd><?= config('mail.auto_reply') ? __('On') : __('Off') ?></dd></div>
        </dl>
        <form method="post" class="stack test-mail">
          <?= csrf_field() ?>
          <input type="hidden" name="action" value="test_mail">
          <p class="muted small"><?= e(__('Send a test email to %s to check the settings.', $user['email'])) ?></p>
          <button class="btn btn-outline btn-block" type="submit"><?= icon('mail') ?> <?= __('Send test email') ?></button>
        </form>
      </section>
    <?php endif; ?>
  </div>
</div>
<?php layout_end();
