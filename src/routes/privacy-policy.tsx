import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/LegalPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => pageHead("privacy", "it"),
  component: () => <LegalPage kind="privacy" />,
});
