<?php
declare(strict_types=1);

require __DIR__ . '/../includes/admin.php';

if (is_post()) {
    verify_csrf();
    logout_user();
}
redirect('login.php');
