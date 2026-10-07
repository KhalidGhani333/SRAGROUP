<?php
declare(strict_types=1);

define('BACKEND_ROOT', dirname(__DIR__));

$configFile = BACKEND_ROOT . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    exit('Missing backend/config.php. Copy config.sample.php to config.php and fill in the database settings.');
}
$GLOBALS['__config'] = require $configFile;

require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';
require __DIR__ . '/crm.php';
require __DIR__ . '/mailer.php';
require __DIR__ . '/lang.php';

date_default_timezone_set((string) config('app.timezone', 'Europe/Rome'));
error_reporting(E_ALL);
ini_set('display_errors', config('app.debug') ? '1' : '0');
mb_internal_encoding('UTF-8');
