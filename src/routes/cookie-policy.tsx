import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/LegalPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/cookie-policy")({
  head: () => pageHead("cookies", "it"),
  component: () => <LegalPage kind="cookies" />,
});
