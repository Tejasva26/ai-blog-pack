import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getProject, type Project } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/results/$id")({
  head: () => ({ meta: [{ title: "Results — SEO Blog Pack AI" }] }),
  component: ResultsPage,
});

function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ResultsPage() {
  const { id } = Route.useParams();
  const [project, setProject] = useState<Project | undefined>();
  useEffect(() => setProject(getProject(id)), [id]);

  if (!project) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <p className="text-muted-foreground">Project not found.</p>
          <Link to="/generate"><Button className="mt-4">Generate one</Button></Link>
        </div>
      </AppShell>
    );
  }

  const c = project.generatedContent;
  const fullMarkdown = `# ${c.blog?.title}\n\n${c.blog?.content}\n\n## FAQs\n${(c.faqs || []).map(f => `**${f.question}**\n${f.answer}`).join("\n\n")}`;

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-6xl">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="text-xs text-primary mb-2">{project.industry}</div>
            <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground mt-1">Primary keyword: <span className="text-foreground">{project.keyword}</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => download(`${project.title}.md`, fullMarkdown, "text/markdown")}>
              <Download className="w-4 h-4 mr-2" /> Markdown
            </Button>
            <Button variant="outline" onClick={() => download(`${project.title}.json`, JSON.stringify(c, null, 2), "application/json")}>
              <FileText className="w-4 h-4 mr-2" /> JSON
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="glass flex flex-wrap h-auto p-1">
            {["overview", "intent", "outline", "blog", "clusters", "faqs", "metadata", "social", "local", "competitors"].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize data-[state=active]:bg-gradient-brand data-[state=active]:text-white">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card title="Meta Title">{c.metadata?.metaTitle}</Card>
              <Card title="Slug">/{c.metadata?.slug}</Card>
              <Card title="Meta Description">{c.metadata?.metaDescription}</Card>
              <Card title="Primary Keyword">{c.keywordIntent?.primary?.keyword} — <span className="text-primary">{c.keywordIntent?.primary?.intent}</span></Card>
            </div>
          </TabsContent>

          <TabsContent value="intent" className="mt-6">
            <Card title="Primary">
              <Pre data={c.keywordIntent?.primary} />
            </Card>
            <div className="mt-4">
              <Card title="Secondary"><Pre data={c.keywordIntent?.secondary} /></Card>
            </div>
          </TabsContent>

          <TabsContent value="outline" className="mt-6">
            <Card title={c.outline?.h1}>
              <div className="space-y-4">
                {(c.outline?.sections || []).map((s: any, i: number) => (
                  <div key={i}>
                    <div className="font-semibold">{s.h2}</div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      {(s.h3 || []).map((h: string, j: number) => <li key={j}>{h}</li>)}
                    </ul>
                    {s.summary && <p className="text-sm mt-2">{s.summary}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <Card title={c.blog?.title} action={<Button size="sm" variant="ghost" onClick={() => copy(c.blog?.content || "")}><Copy className="w-4 h-4" /></Button>}>
              <article className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">{c.blog?.content}</article>
            </Card>
          </TabsContent>

          <TabsContent value="clusters" className="mt-6"><Card title={`Pillar: ${c.contentClusters?.pillar}`}><Pre data={c.contentClusters?.clusters} /></Card></TabsContent>
          <TabsContent value="faqs" className="mt-6">
            <div className="space-y-3">
              {(c.faqs || []).map((f, i) => (
                <Card key={i} title={f.question}><p className="text-sm text-muted-foreground">{f.answer}</p></Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="metadata" className="mt-6"><Card title="Metadata & CTAs"><Pre data={c.metadata} /></Card></TabsContent>
          <TabsContent value="social" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {(c.socialPosts || []).map((p, i) => (
                <Card key={i} title={p.platform} action={<Button size="sm" variant="ghost" onClick={() => copy(p.post)}><Copy className="w-4 h-4" /></Button>}>
                  <p className="text-sm whitespace-pre-wrap">{p.post}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="local" className="mt-6"><Card title="Local SEO"><Pre data={c.localSEO} /></Card></TabsContent>
          <TabsContent value="competitors" className="mt-6"><Card title="Competitor Insights"><Pre data={c.competitorInsights} /></Card></TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function Card({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">{title}</div>
          {action}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Pre({ data }: { data: any }) {
  return <pre className="text-xs bg-background/40 rounded-lg p-4 overflow-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
}
