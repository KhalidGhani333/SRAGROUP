import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/pages/ProjectDetailPage";
import { getProjectBySlug } from "@/data/projects";
import { pageHead, projectHead } from "@/i18n/seo";

export const Route = createFileRoute("/progetti/$slug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) =>
    loaderData ? projectHead(loaderData, "it") : pageHead("projects", "it"),
  component: ProjectRoute,
});

function ProjectRoute() {
  return <ProjectDetailPage project={Route.useLoaderData()} />;
}
