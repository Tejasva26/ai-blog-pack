import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearAll, loadProjects } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SEO Blog Pack AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  useEffect(() => setApiKey(localStorage.getItem("gemini-api-key") || ""), []);

  const saveKey = () => {
    localStorage.setItem("gemini-api-key", apiKey);
    toast.success("API key saved locally");
  };

  const exportData = () => {
    const data = JSON.stringify(loadProjects(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "seo-blog-pack-export.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  const clearHistory = () => {
    if (confirm("Delete all projects? This cannot be undone.")) {
      clearAll();
      toast.success("History cleared");
    }
  };

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your account and data.</p>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-1">Gemini API Key</h2>
            <p className="text-sm text-muted-foreground mb-4">Optional — the app uses the built-in AI gateway by default.</p>
            <div className="flex gap-2">
              <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AI…" />
              <Button onClick={saveKey} className="bg-gradient-brand text-white">Save</Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-1">Data</h2>
            <p className="text-sm text-muted-foreground mb-4">Export or clear your locally stored projects.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportData}>Export Data</Button>
              <Button variant="destructive" onClick={clearHistory}>Clear History</Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function _label(_: any) { return Label; }
