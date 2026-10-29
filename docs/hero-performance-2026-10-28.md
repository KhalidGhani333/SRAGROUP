# Hero rendering performance update

- Home solar hero: original 3,086,975-byte JPEG replaced with a 375,568-byte WebP at the same 944 x 1666 resolution (88% smaller). A 768px mobile candidate is 266,202 bytes.
- Solar page hero: 722,472-byte JPEG replaced with a 424,116-byte WebP, plus a 129,214-byte mobile candidate.
- About, Construction, Projects, Contact and legal heroes retain their existing full-size WebP files and gain smaller 768px responsive candidates.
- Shared `HeroImage` emits eager, high-priority images with accurate dimensions and responsive source selection directly in prerendered HTML.
- Immediate hero reveals and headings render visible in server HTML. JavaScript loading no longer gates hero text visibility. Scroll reveals below the hero remain animated.
- Existing Inter and Space Grotesk fonts are served locally as WOFF2 with `font-display: swap`. The external Google Fonts stylesheet is removed. OFL licenses are included in `public/licenses` and the deployment ZIP.

Validation: TypeScript passed; 14 existing tests passed; targeted ESLint has no errors (one existing Fast Refresh warning). The production build completed. Local Chrome checked all 16 IT/EN public routes at 390px and 1440px with JavaScript requests blocked: all 32 checks passed for visible headings, completed hero images, responsive candidates and no horizontal overflow. Hydration and both home hover expansions also passed. All 17 prerendered HTML files were checked for missing referenced assets and staging paths.

Deploy `deploy/sragroup-frontend-performance-28-10-2026.zip` into production `public_html` with overwrite. It includes frontend files, sitemap, `.htaccess`, local fonts and licenses. It excludes the backend, so existing server CRM config and data remain intact. No live-hosting files were changed by this local build; live performance should be checked after upload.

## Second performance pass

The first package was verified live: checked HTML, optimized images and fonts matched the delivered files. A fresh browser audit still showed load completion around 8.4 seconds from this test connection. Featured projects far below the home hero were marked eager, including an 880 KB photo, and competed with hero assets during the initial load.

Removed eager loading from shared project cards; they now use native lazy loading with low fetch priority. Home solar and Solar page heroes gain AVIF sources (195,627 and 226,482 bytes at original resolution) with responsive 768px AVIF sources and the existing WebP fallback. The site logo is losslessly encoded as WebP (137,420 bytes instead of 199,246). Apache explicitly declares the AVIF MIME type.

Second package: `deploy/sragroup-speed-v2-28-10-2026.zip`, frontend only. TypeScript, 14 tests and targeted lint passed. All 32 local browser hero checks passed again. Chrome selected AVIF and did not request the below-fold fixed-bipole project image before scrolling; hydration and both home hover checks passed. Live speed needs remeasurement after this second package is uploaded; no fixed loading-time improvement is claimed from local tests.
