<?php
declare(strict_types=1);

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = db_connect(true);
    }
    return $pdo;
}

function db_connect(bool $withDatabase): PDO
{
    $dsn = sprintf('mysql:host=%s;port=%d;charset=utf8mb4', config('db.host'), (int) config('db.port', 3306));
    if ($withDatabase) {
        $dsn .= ';dbname=' . config('db.name');
    }
    $pdo = new PDO($dsn, (string) config('db.user'), (string) config('db.pass'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    // Keep NOW()/CURRENT_TIMESTAMP in the same timezone PHP uses.
    $pdo->exec("SET time_zone = '" . date('P') . "'");
    return $pdo;
}

function db_all(string $sql, array $params = []): array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function db_one(string $sql, array $params = []): ?array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $row = $stmt->fetch();
    return $row === false ? null : $row;
}

function db_value(string $sql, array $params = []): mixed
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $value = $stmt->fetchColumn();
    return $value === false ? null : $value;
}

function db_run(string $sql, array $params = []): int
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
}

function db_tables_exist(): bool
{
    try {
        return db_value("SHOW TABLES LIKE 'leads'") !== null;
    } catch (PDOException) {
        return false;
    }
}
