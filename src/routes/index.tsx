import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, ArrowRight, Layers, FileText, Search, Globe2, MessageSquare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SEO Blog Pack AI — Generate a complete SEO blog pack from a single brief" },
      { name: "description", content: "AI-powered SEO blog, content clusters, FAQs, local SEO and competitor insights from one business brief." },
      { property: "og:title", content: "SEO Blog Pack AI" },
      { property: "og:description", content: "Generate a complete SEO blog pack from a single business brief." },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center glow">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg font-semibold tracking-tight">
        SEO Blog Pack <span className="text-gradient">AI</span>
      </span>
    </Link>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 inset-x-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link to="/generate">
            <Button className="bg-gradient-brand hover:opacity-90 text-white rounded-full px-5">
              Get started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

const features = [
  { icon: FileText, title: "Long-form blogs", desc: "1000–3000 word SEO articles with proper H1–H3 structure." },
  { icon: Layers, title: "Content clusters", desc: "Pillar + cluster mapping with internal link suggestions." },
  { icon: Search, title: "Keyword intent", desc: "Primary & secondary keywords mapped to search intent." },
  { icon: MessageSquare, title: "FAQs & social", desc: "FAQ schema + ready-to-post Twitter, LinkedIn, IG copy." },
  { icon: Globe2, title: "Local SEO", desc: "Geo-targeted variants and Google Business Profile tips." },
  { icon: BarChart3, title: "Competitor insights", desc: "Gaps, strengths and opportunities from competitor URLs." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/20 blur-[140px] pointer-events-none" />
      <Nav />

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-primary mb-8">
            <Zap className="w-4 h-4" />
            Powered by Gemini AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">
            Generate a complete <br />
            <span className="text-gradient">SEO blog pack</span> <br />
            from a single business brief
          </h1>

          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Blog outlines, long-form posts, content clusters, FAQs, local SEO and competitor insights.
            Built for marketers, agencies, and founders who ship.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-brand hover:opacity-90 text-white rounded-full px-8 h-12 text-base glow">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-border/60 bg-card/40 backdrop-blur">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div className="glass rounded-2xl p-6 md:p-8 glow">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-muted-foreground">seo-blog-pack.ai / generate</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {features.slice(0, 3).map((f) => (
                <div key={f.title} className="p-4 rounded-xl bg-background/40 border border-border/40">
                  <f.icon className="w-5 h-5 text-primary mb-3" />
                  <div className="font-medium">{f.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full glass text-xs text-primary mb-4">FEATURES</div>
            <h2 className="text-4xl md:text-5xl font-bold">Everything you need to <span className="text-gradient">rank</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-primary/40 transition-all">
                <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center glow">
          <h2 className="text-4xl md:text-5xl font-bold">Ship your next blog in minutes</h2>
          <p className="mt-4 text-muted-foreground">One brief in. A full SEO pack out.</p>
          <Link to="/generate">
            <Button size="lg" className="mt-8 bg-gradient-brand text-white rounded-full px-8 h-12">
              Generate now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-10 px-6 text-center text-sm text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} SEO Blog Pack AI
      </footer>
    </div>
  );
}
