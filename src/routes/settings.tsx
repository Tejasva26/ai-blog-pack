import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearAll, loadProjects } from "@/lib/storage";
import { GEMINI_KEY_STORAGE } from "@/services/gemini";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SEO Blog Pack AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [show, setShow] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem(GEMINI_KEY_STORAGE) || "";
    setApiKey(k);
    setHasSaved(Boolean(k));
  }, []);

  const saveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    localStorage.setItem(GEMINI_KEY_STORAGE, apiKey.trim());
    setHasSaved(true);
    toast.success("Gemini API key saved");
  };

  const removeKey = () => {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
    setApiKey("");
    setHasSaved(false);
    toast.success("Gemini API key removed");
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
        <p className="text-muted-foreground mb-8">Manage your Gemini API key and data.</p>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">Gemini API Key</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Stored locally in your browser. Get a free key from{" "}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-1">
                    Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>.
                </p>
              </div>
              {hasSaved && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Active</span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={show ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button onClick={saveKey} className="bg-gradient-brand text-white">
                {hasSaved ? "Update" : "Save"}
              </Button>
              {hasSaved && (
                <Button variant="outline" onClick={removeKey}>Remove</Button>
              )}
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
