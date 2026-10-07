import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import i18n from "@/i18n";

/**
 * Static copy of the not-found page for the cPanel build: Apache serves /404/index.html for
 * unknown URLs (public/.htaccess), then the client router shows the same page at the real URL.
 */
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: i18n.getFixedT("it")("meta.notFound.title") },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});
