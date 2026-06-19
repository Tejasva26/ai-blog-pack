import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { deleteProject, loadProjects, type Project } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — SEO Blog Pack AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => setProjects(loadProjects()), []);

  const remove = (id: string) => {
    deleteProject(id);
    setProjects(loadProjects());
    toast.success("Project deleted");
  };

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">History</h1>
        <p className="text-muted-foreground mb-8">All your generated SEO packs.</p>
        {projects.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No history yet.</div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs text-primary mb-1">{p.industry}</div>
                  <div className="font-semibold truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.keyword} • {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Link to="/results/$id" params={{ id: p.id }}><Button size="sm" variant="outline"><ExternalLink className="w-4 h-4" /></Button></Link>
                  <Button size="sm" variant="outline" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
