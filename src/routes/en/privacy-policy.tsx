import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/LegalPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/en/privacy-policy")({
  head: () => pageHead("privacy", "en"),
  component: () => <LegalPage kind="privacy" />,
});
