import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { getProjects } from "@/data/projects";
import { alternatePath, projectPath } from "@/i18n/routes";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches construction detail pages in both languages", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const project of getProjects("construction")) {
      expect(router.matchRoutes(projectPath(project.slug, "it")).at(-1)?.routeId).toBe(
        "/progetti/$slug",
      );
      expect(router.matchRoutes(projectPath(project.slug, "en")).at(-1)?.routeId).toBe(
        "/en/projects/$slug",
      );
    }
  });

  it("keeps the selected project when switching language, including a trailing slash", () => {
    const project = getProjects("construction")[0]!;
    const itPath = projectPath(project.slug, "it");
    const enPath = projectPath(project.slug, "en");
    expect(alternatePath(itPath + "/", "en")).toBe(enPath);
    expect(alternatePath(enPath, "it")).toBe(itPath);
  });
});
