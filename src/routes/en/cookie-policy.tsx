import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/LegalPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/en/cookie-policy")({
  head: () => pageHead("cookies", "en"),
  component: () => <LegalPage kind="cookies" />,
});
