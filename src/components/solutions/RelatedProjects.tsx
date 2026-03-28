import { Link } from "react-router";
import { useProjects } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, ArrowRight } from "lucide-react";

interface RelatedProjectsProps {
  projectSlugs: string[];
}

export function RelatedProjects({ projectSlugs }: RelatedProjectsProps) {
  const { data: projectData, isLoading } = useProjects();

  if (!projectSlugs.length) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allProjects: any[] = Array.isArray(projectData)
    ? projectData
    : (projectData as any)?.data ?? [];

  const projects = allProjects.filter((p) =>
    projectSlugs.includes(p.slug)
  );

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold">Dự án liên quan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!projects.length) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Dự án liên quan</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={`/du-an/${project.slug}`}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
          >
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="flex-1">
              {project.category && (
                <span className="text-xs font-medium text-primary">{project.category}</span>
              )}
              <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </h4>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}
