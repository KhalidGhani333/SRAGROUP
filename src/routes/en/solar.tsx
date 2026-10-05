import { createFileRoute } from "@tanstack/react-router";
import { SolarPage } from "@/components/pages/SolarPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/en/solar")({
  head: () => pageHead("solar", "en"),
  component: SolarPage,
});
