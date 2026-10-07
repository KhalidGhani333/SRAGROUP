// `npm run build:cpanel`: prerenders the site to static HTML (vite.config.ts, DEPLOY_TARGET=cpanel)
// and assembles deploy/public_html with the site plus the PHP CRM backend. Upload its contents.
import { execSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const site = join(root, "dist", "client");
const backend = join(root, "backend");
const out = join(root, "deploy", "public_html");
// `--base=/sra-group/` builds for a sub-folder (staging), e.g. https://axistechstaging.com/sra-group/
const baseArg = process.argv.find((a) => a.startsWith("--base="))?.slice("--base=".length) ?? "";
const base =
  "/" + baseArg.split("/").filter(Boolean).join("/") + (baseArg.replaceAll("/", "") ? "/" : "");
const zipName = base === "/" ? "deploy.zip" : "deploy-staging.zip";

rmSync(join(root, "dist"), { recursive: true, force: true });
execSync("npx vite build", {
  stdio: "inherit",
  env: { ...process.env, DEPLOY_TARGET: "cpanel", BASE_PATH: base },
});

if (!existsSync(join(site, "index.html"))) {
  console.error("dist/client/index.html is missing: the prerender build failed.");
  process.exit(1);
}

rmSync(join(root, "deploy"), { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(site, out, { recursive: true });

writeSitemap(out);

// Apache needs the 404 page as a full URL path, so it follows the sub-folder.
const htaccess = join(out, ".htaccess");
writeFileSync(
  htaccess,
  readFileSync(htaccess, "utf8").replace(
    "ErrorDocument 404 /404/index.html",
    `ErrorDocument 404 ${base}404/index.html`,
  ),
);
// mod_rewrite can't see a sub-folder opened without its final slash; mod_alias can.
if (base !== "/") {
  appendFileSync(
    htaccess,
    `\n# Sub-folder opened without the final slash.\nRedirectMatch 301 ^${base.slice(0, -1)}$ ${base}\n`,
  );
}

// Local secrets and uploaded files stay on this machine; the server keeps its own.
cpSync(backend, join(out, "backend"), {
  recursive: true,
  filter: (src) => {
    const rel = relative(backend, src).split(sep).join("/");
    return (
      rel !== "config.php" &&
      !(rel.startsWith("storage/uploads/") && rel !== "storage/uploads/.gitkeep")
    );
  },
});

// deploy.zip holds the *contents* of public_html (uses the tar.exe that ships with Windows 10+,
// or zip on Linux/macOS).
const zip = join(root, zipName);
// List top-level entries by name (incl. .htaccess) so paths in the zip have no "./" prefix:
// opening it shows the site files and the backend/ folder directly.
const entries = readdirSync(out)
  .map((name) => `"${name}"`)
  .join(" ");
rmSync(zip, { force: true });
try {
  if (process.platform === "win32")
    execSync(
      `"${join(process.env.SystemRoot || "C:/Windows", "System32", "tar.exe")}" -a -c -f "${zip}" ${entries}`,
      { cwd: out },
    );
  else execSync(`zip -qr "${zip}" ${entries}`, { cwd: out });
  console.log(`${zipName} ready (site base ${base}): upload it and extract.`);
} catch (e) {
  console.warn(
    "Could not create deploy.zip automatically - zip the contents of deploy/public_html by hand.",
  );
}

console.log(`cPanel package ready: ${relative(root, out)}`);
console.log(
  "Upload its contents to public_html. First deploy: create backend/config.php on the server.",
);

/**
 * Builds sitemap.xml from the prerendered pages themselves: each page's canonical URL plus its
 * hreflang alternates, skipping noindex pages (404). Also points robots.txt at it.
 */
function writeSitemap(dir) {
  const pages = [];
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "index.html") pages.push(readFileSync(full, "utf8"));
    }
  };
  walk(dir);

  const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1];
  const urls = new Map();
  for (const html of pages) {
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;
    const links = html.match(/<link[^>]+>/gi) ?? [];
    const canonical = links.find((l) => /rel="canonical"/i.test(l));
    const loc = canonical && attr(canonical, "href");
    if (!loc) continue;
    const alternates = links
      .filter((l) => /rel="alternate"/i.test(l) && /hreflang=/i.test(l))
      .map((l) => ({ lang: attr(l, "hreflang"), href: attr(l, "href") }));
    urls.set(loc, alternates);
  }

  const today = new Date().toISOString().slice(0, 10);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...[...urls]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([loc, alternates]) =>
        [
          "  <url>",
          `    <loc>${loc}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          ...alternates.map(
            (a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`,
          ),
          "  </url>",
        ].join("\n"),
      ),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(join(dir, "sitemap.xml"), xml);

  const origin = new URL([...urls.keys()][0] ?? "https://www.sragroup.it/").origin;
  appendFileSync(join(dir, "robots.txt"), `\nSitemap: ${origin}/sitemap.xml\n`);
  console.log(`sitemap.xml: ${urls.size} URLs`);
}
