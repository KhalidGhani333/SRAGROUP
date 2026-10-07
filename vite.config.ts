// @lovable.dev/vite-tanstack-config already includes the following - do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `npm run build:cpanel` prerenders every page to static HTML for shared hosting (no Node.js).
// Other builds (Lovable, Vercel) keep the default SSR output.
const cpanel = process.env["DEPLOY_TARGET"] === "cpanel";
// Sub-folder hosting, e.g. BASE_PATH=/sra-group/ for https://axistechstaging.com/sra-group/
// (set by `npm run build:staging`). Asset URLs, router links and the form endpoint follow it.
const base = process.env["BASE_PATH"] || "/";

export default defineConfig({
  vite: { base },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(cpanel && {
      prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, failOnError: true },
      // Not-found page that Apache serves for unknown URLs (see public/.htaccess).
      pages: [{ path: "/404" }],
    }),
  },
  ...(cpanel && { nitro: false }),
});
