import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AppLayout } from "@/components/site/Site";
import { LocalizedLink } from "@/components/site/LocalizedLink";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { Button } from "@/components/ui/button";
import { ConsentProvider } from "@/lib/consent";
import { langFromPath } from "@/i18n/routes";
import { useT } from "@/i18n/useT";
import i18n from "@/i18n";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { t } = useT();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <section className="site-container flex min-h-[80vh] flex-col justify-center pt-36 pb-24">
      <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">{t("error.title")}</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">{t("error.text")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          className="h-11 rounded-none"
          onClick={() => {
            void router.invalidate();
            reset();
          }}
        >
          {t("error.retry")}
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-none">
          <LocalizedLink page="home">{t("error.home")}</LocalizedLink>
        </Button>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "SRAGROUP" },
      { name: "theme-color", content: "#0F1115" },
      { property: "og:site_name", content: "SRAGROUP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

// 404 responses are served with HTTP status 404; the title is set on the client because route
// head() functions run before not-found is resolved.
function NotFound() {
  const lang = useRouterState({ select: (s) => langFromPath(s.location.pathname) });
  useEffect(() => {
    document.title = i18n.getFixedT(lang)("meta.notFound.title");
  }, [lang]);
  return <NotFoundPage />;
}

function RootShell({ children }: { children: ReactNode }) {
  const lang = useRouterState({ select: (s) => langFromPath(s.location.pathname) });
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ConsentProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ConsentProvider>
    </QueryClientProvider>
  );
}
