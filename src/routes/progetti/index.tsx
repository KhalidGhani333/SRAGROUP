import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/progetti/")({
  head: () => pageHead("projects", "it"),
  component: ProjectsPage,
});
