import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { pageHead } from "@/i18n/seo";

export const Route = createFileRoute("/en/projects/")({
  head: () => pageHead("projects", "en"),
  component: ProjectsPage,
});
