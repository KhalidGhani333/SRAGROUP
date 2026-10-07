<?php
declare(strict_types=1);

const SESSION_IDLE_SECONDS = 4 * 3600;
const LOGIN_WINDOW_MINUTES = 15;
const LOGIN_MAX_PER_EMAIL = 5;
const LOGIN_MAX_PER_IP = 20;

start_session();

function current_user(): ?array
{
    static $user = false;
    if ($user !== false) {
        return $user;
    }
    $user = null;
    $id = $_SESSION['user_id'] ?? null;
    if (!$id) {
        return null;
    }
    if (time() - (int) ($_SESSION['last_seen'] ?? 0) > SESSION_IDLE_SECONDS) {
        logout_user();
        return null;
    }
    $row = db_one('SELECT id, name, email, role, division, lang, is_active FROM users WHERE id = ?', [$id]);
    if (!$row || !(int) $row['is_active']) {
        logout_user();
        return null;
    }
    $_SESSION['last_seen'] = time();
    $row['id'] = (int) $row['id'];
    set_lang($row['lang']);
    return $user = $row;
}

/** Ensures a signed-in user; sends visitors to the login page and back afterwards. */
function require_login(): array
{
    if (!db_tables_exist() || (int) db_value('SELECT COUNT(*) FROM users') === 0) {
        redirect('setup.php');
    }
    $user = current_user();
    if (!$user) {
        $next = basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'index.php'));
        if (!empty($_SERVER['QUERY_STRING'])) {
            $next .= '?' . $_SERVER['QUERY_STRING'];
        }
        redirect('login.php?next=' . urlencode($next));
    }
    return $user;
}

function require_admin(): array
{
    $user = require_login();
    if (!is_admin($user)) {
        http_response_code(403);
        flash('error', __('Only administrators can open that page.'));
        redirect('index.php');
    }
    return $user;
}

/** Only allow redirects to pages inside the admin folder. */
function safe_next(string $next): string
{
    return preg_match('/^[a-z0-9-]+\.php(\?[^\s]*)?$/i', $next) ? $next : 'index.php';
}

/** Returns null on success or an error message. */
function attempt_login(string $email, string $password): ?string
{
    $email = mb_strtolower(trim($email));
    $ip = client_ip();
    $since = date('Y-m-d H:i:s', time() - LOGIN_WINDOW_MINUTES * 60);

    $byEmail = (int) db_value('SELECT COUNT(*) FROM login_attempts WHERE email = ? AND attempted_at > ?', [$email, $since]);
    $byIp = (int) db_value('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND attempted_at > ?', [$ip, $since]);
    if ($byEmail >= LOGIN_MAX_PER_EMAIL || $byIp >= LOGIN_MAX_PER_IP) {
        return __('Too many failed attempts. Please wait %d minutes and try again.', LOGIN_WINDOW_MINUTES);
    }

    $user = db_one('SELECT id, password_hash, is_active, lang FROM users WHERE email = ?', [$email]);
    // Verify against a dummy hash when the user is unknown so timing doesn't reveal valid emails.
    $hash = $user['password_hash'] ?? password_hash('no-such-user', PASSWORD_DEFAULT);
    $valid = password_verify($password, $hash) && $user && (int) $user['is_active'];

    if (!$valid) {
        db_run('INSERT INTO login_attempts (ip, email) VALUES (?, ?)', [$ip, $email]);
        return __('Email or password is not correct.');
    }

    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        db_run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $user['id']]);
    }
    db_run('DELETE FROM login_attempts WHERE email = ? OR attempted_at < ?', [$email, $since]);
    db_run('UPDATE users SET last_login_at = NOW() WHERE id = ?', [$user['id']]);

    session_regenerate_id(true);
    remember_lang($user['lang']);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['last_seen'] = time();
    return null;
}

function logout_user(): void
{
    $_SESSION = [];
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_regenerate_id(true);
    }
}

/** Returns an error message when the password is too weak, otherwise null. */
function password_problem(string $password): ?string
{
    if (mb_strlen($password) < 10) {
        return __('Password must be at least 10 characters.');
    }
    if (!preg_match('/[A-Za-z]/', $password) || !preg_match('/\d/', $password)) {
        return __('Password must contain letters and numbers.');
    }
    return null;
}
