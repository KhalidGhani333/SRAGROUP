import { createFileRoute } from "@tanstack/react-router";
import { ConstructionPage } from "@/components/pages/ConstructionPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/en/construction")({
  head: () => pageHead("construction", "en"),
  component: ConstructionPage,
});
