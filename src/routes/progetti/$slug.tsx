import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/pages/ProjectDetailPage";
import { getProjectBySlug } from "@/data/projects";
import { projectHead } from "@/i18n/seo";

export const Route = createFileRoute("/progetti/$slug")({
  loader: ({ params }) => {
    if (!getProjectBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => projectHead(params.slug, "it"),
  component: ProjectRoute,
});

function ProjectRoute() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}
