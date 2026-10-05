import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/pages/HomePage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/en/")({
  head: () => pageHead("home", "en"),
  component: HomePage,
});
