<?php
declare(strict_types=1);

const NAV_ITEMS = [
    'dashboard' => ['href' => 'index.php', 'label' => 'Dashboard', 'icon' => 'grid', 'admin' => false],
    'leads' => ['href' => 'leads.php', 'label' => 'Leads', 'icon' => 'inbox', 'admin' => false],
    'users' => ['href' => 'users.php', 'label' => 'Users', 'icon' => 'users', 'admin' => true],
    'profile' => ['href' => 'profile.php', 'label' => 'My profile', 'icon' => 'user', 'admin' => false],
];

/** Small inline icon set (Lucide paths) so the panel needs no external assets. */
function icon(string $name, string $class = 'icon'): string
{
    $paths = [
        'grid' => '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
        'inbox' => '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
        'users' => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'user' => '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'logout' => '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
        'menu' => '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
        'search' => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        'download' => '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
        'mail' => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'phone' => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
        'paperclip' => '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
        'arrow-left' => '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
        'arrow-right' => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'calendar' => '<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
        'building' => '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
        'sun' => '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
        'message' => '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        'plus' => '<path d="M5 12h14"/><path d="M12 5v14"/>',
        'trash' => '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
        'clock' => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'trend' => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
        'check' => '<path d="M20 6 9 17l-5-5"/>',
        'x' => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'external' => '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        'shield' => '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    ];
    return '<svg class="' . e($class) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? '') . '</svg>';
}

function division_icon(string $division): string
{
    return icon(['construction' => 'building', 'solar' => 'sun'][$division] ?? 'message');
}

function division_badge(string $division): string
{
    return '<span class="badge badge-' . e($division) . '">' . division_icon($division) . e(__(DIVISIONS[$division] ?? $division)) . '</span>';
}

function status_badge(string $status): string
{
    return '<span class="status status-' . e($status) . '"><i></i>' . e(__(STATUSES[$status] ?? $status)) . '</span>';
}

function priority_badge(string $priority): string
{
    if ($priority === 'normal') {
        return '';
    }
    return '<span class="priority priority-' . e($priority) . '">' . e(__(PRIORITIES[$priority] ?? $priority)) . '</span>';
}

function avatar(string $name, string $size = ''): string
{
    $hue = crc32($name) % 360;
    return '<span class="avatar ' . e($size) . '" style="--hue:' . $hue . '">' . e(initials($name)) . '</span>';
}

function head_tags(string $title): void
{
    ?>
<!doctype html>
<html lang="<?= e(lang()) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?= e($title) ?> · <?= e(config('app.name')) ?></title>
  <link rel="icon" href="assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="assets/admin.css?v=3">
  <script src="assets/admin.js?v=1" defer></script>
</head>
    <?php
}

function layout_start(string $title, string $active, array $user): void
{
    header('Cache-Control: no-store');
    head_tags($title);
    ?>
<body class="app">
  <aside class="sidebar" id="sidebar">
    <a class="brand" href="index.php">
      <img src="assets/logo.png" alt="" width="36" height="36">
      <span><strong>SRAGROUP</strong><small><?= __('CRM') ?></small></span>
    </a>
    <nav class="nav">
      <?php foreach (NAV_ITEMS as $key => $item):
          if ($item['admin'] && !is_admin($user)) {
              continue;
          } ?>
        <a href="<?= e($item['href']) ?>" class="<?= $key === $active ? 'active' : '' ?>">
          <?= icon($item['icon']) ?><span><?= e(__($item['label'])) ?></span>
        </a>
      <?php endforeach; ?>
    </nav>
    <div class="sidebar-foot">
      <div class="me">
        <?= avatar($user['name']) ?>
        <div>
          <strong><?= e($user['name']) ?></strong>
          <small><?= e(__(ROLES[$user['role']])) ?> · <?= e(__(USER_DIVISIONS[$user['division']])) ?></small>
        </div>
      </div>
      <form method="post" action="logout.php">
        <?= csrf_field() ?>
        <button class="nav-btn" type="submit"><?= icon('logout') ?><span><?= __('Sign out') ?></span></button>
      </form>
    </div>
  </aside>
  <div class="backdrop" data-close-nav></div>
  <main class="main">
    <div class="mobile-bar">
      <button class="icon-btn" type="button" data-open-nav aria-label="<?= __('Open menu') ?>"><?= icon('menu') ?></button>
      <span class="brand-mini"><img src="assets/logo.png" alt="" width="28" height="28"> <?= __('SRAGROUP CRM') ?></span>
    </div>
    <?php foreach (take_flashes() as $f): ?>
      <div class="flash flash-<?= e($f['type']) ?>" role="status">
        <?= icon($f['type'] === 'error' ? 'x' : 'check') ?><span><?= e($f['message']) ?></span>
        <button type="button" class="flash-close" data-dismiss aria-label="<?= __('Dismiss') ?>"><?= icon('x') ?></button>
      </div>
    <?php endforeach; ?>
    <?php
}

function layout_end(): void
{
    ?>
  </main>
</body>
</html>
    <?php
}

function auth_layout_start(string $title): void
{
    header('Cache-Control: no-store');
    head_tags($title);
    ?>
<body class="auth">
  <div class="auth-art" aria-hidden="true">
    <div class="auth-art-inner">
      <img src="assets/logo.png" alt="" width="56" height="56">
      <p class="eyebrow"><?= __('SRAGROUP · Lead management') ?></p>
      <h2><?= __('Every construction and solar request, in one place.') ?></h2>
      <ul>
        <li><span class="dot dot-construction"></span><?= __('Construction division') ?></li>
        <li><span class="dot dot-solar"></span><?= __('Solar &amp; renewable energy') ?></li>
        <li><span class="dot dot-general"></span><?= __('General enquiries') ?></li>
      </ul>
    </div>
  </div>
  <main class="auth-main">
    <nav class="lang-switch" aria-label="<?= e(__('Language')) ?>">
      <?php foreach (ADMIN_LANGS as $code => $name): ?>
        <a href="?<?= e(http_build_query(array_merge($_GET, ['lang' => $code]))) ?>" class="<?= lang() === $code ? 'active' : '' ?>" lang="<?= e($code) ?>"><?= e($name) ?></a>
      <?php endforeach; ?>
    </nav>
    <div class="auth-card">
    <?php
}

function auth_layout_end(): void
{
    ?>
    </div>
  </main>
</body>
</html>
    <?php
}

function pagination(int $page, int $pages): string
{
    if ($pages <= 1) {
        return '';
    }
    $html = '<nav class="pager" aria-label="' . __('Pagination') . '">';
    $html .= $page > 1
        ? '<a href="' . e(query_with(['page' => $page - 1])) . '">' . icon('arrow-left') . ' ' . __('Previous') . '</a>'
        : '<span class="disabled">' . icon('arrow-left') . ' ' . __('Previous') . '</span>';
    $html .= '<span class="pager-info">' . __('Page %d of %d', $page, $pages) . '</span>';
    $html .= $page < $pages
        ? '<a href="' . e(query_with(['page' => $page + 1])) . '">' . __('Next') . ' ' . icon('arrow-right') . '</a>'
        : '<span class="disabled">' . __('Next') . ' ' . icon('arrow-right') . '</span>';
    return $html . '</nav>';
}
