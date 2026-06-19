import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { loadProjects, type Project } from "@/lib/storage";
import { FileText, Sparkles, Search, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SEO Blog Pack AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => setProjects(loadProjects()), []);

  const stats = [
    { icon: FileText, label: "Total Projects", value: projects.length },
    { icon: Sparkles, label: "Blogs Generated", value: projects.length },
    { icon: Search, label: "Keywords Generated", value: projects.reduce((a, p) => a + ((p.generatedContent?.keywordIntent?.secondary?.length ?? 0) + 1), 0) },
    { icon: TrendingUp, label: "AI Usage Count", value: projects.length * 8 },
  ];

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your AI-powered SEO command center.</p>
          </div>
          <Link to="/generate">
            <Button className="bg-gradient-brand text-white rounded-full px-5">New Project <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <s.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">No projects yet. Generate your first SEO pack.</p>
            <Link to="/generate"><Button className="bg-gradient-brand text-white rounded-full">Generate Now</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.slice(0, 6).map((p) => (
              <Link key={p.id} to="/results/$id" params={{ id: p.id }} className="glass rounded-2xl p-5 hover:border-primary/40 transition-all block">
                <div className="text-xs text-primary mb-2">{p.industry}</div>
                <div className="font-semibold line-clamp-1">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{p.keyword}</div>
                <div className="text-xs text-muted-foreground mt-3">{new Date(p.createdAt).toLocaleString()}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
