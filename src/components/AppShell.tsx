import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, History, Bookmark, Settings, Wand2 } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Wand2 },
  { to: "/history", label: "History", icon: History },
  { to: "/saved", label: "Saved Projects", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl p-5">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">SEO Blog Pack <span className="text-gradient">AI</span></span>
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => {
            const active = pathname === n.to || (n.to !== "/dashboard" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? "bg-gradient-brand text-white glow" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="glass rounded-xl p-4 text-xs text-muted-foreground">
          Powered by <span className="text-primary font-medium">Gemini AI</span>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
            <span className="font-semibold">SEO Blog Pack</span>
          </Link>
        </div>
        <div className="md:hidden flex gap-1 overflow-x-auto px-3 py-3 border-b border-border/40">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-xs px-3 py-1.5 rounded-full glass whitespace-nowrap">{n.label}</Link>
          ))}
        </div>
        {children}
      </main>
    </div>
  );
}
