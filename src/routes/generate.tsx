import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { generateSEOPack, hasApiKey, type Brief } from "@/services/gemini";
import { saveProject } from "@/lib/storage";
import { toast } from "sonner";
import { Sparkles, Loader2, Check, KeyRound } from "lucide-react";

export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: "Generate — SEO Blog Pack AI" }] }),
  component: GeneratePage,
});

const STEPS = [
  "Analyzing business & keyword intent",
  "Generating content clusters",
  "Building outline",
  "Writing full blog",
  "Crafting FAQs",
  "Generating metadata",
  "Drafting social posts",
  "Adding local SEO & competitor insights",
];

function GeneratePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [form, setForm] = useState<Brief>({
    businessName: "",
    businessDescription: "",
    industry: "",
    targetAudience: "",
    targetLocation: "",
    primaryKeyword: "",
    secondaryKeywords: "",
    competitorUrls: "",
    contentTone: "Professional",
    articleLength: "1500",
  });

  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof Brief)[] = ["businessName", "businessDescription", "industry", "targetAudience", "targetLocation", "primaryKeyword"];
    for (const k of required) {
      if (!form[k]) { toast.error(`Please fill in ${k}`); return; }
    }
    if (!hasApiKey()) {
      setShowKeyModal(true);
      return;
    }
    setLoading(true);
    setStep(0);
    try {
      const result = await generateSEOPack(form, (i) => setStep(i));
      const id = crypto.randomUUID();
      saveProject({
        id,
        title: (result as any)?.blog?.title || form.businessName,
        industry: form.industry,
        keyword: form.primaryKeyword,
        brief: form,
        generatedContent: result as any,
        createdAt: new Date().toISOString(),
      });
      toast.success("SEO Pack generated!");
      navigate({ to: "/results/$id", params: { id } });
    } catch (err: any) {
      if (err.message === "MISSING_API_KEY") {
        setShowKeyModal(true);
      } else {
        toast.error(err.message || "Generation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Generate SEO Pack</h1>
          <p className="text-muted-foreground mt-1">Fill in your business brief. Gemini AI handles the rest.</p>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-10">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">Generating your SEO blog pack…</span>
            </div>
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < step ? "bg-gradient-brand" : i === step ? "bg-primary/20 border border-primary" : "border border-border"}`}>
                    {i < step ? <Check className="w-3 h-3 text-white" /> : i === step ? <Loader2 className="w-3 h-3 animate-spin text-primary" /> : null}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Business Name"><Input value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Acme Inc." /></Field>
              <Field label="Industry"><Input value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="SaaS / Marketing / Fitness…" /></Field>
            </div>
            <Field label="Business Description"><Textarea rows={3} value={form.businessDescription} onChange={(e) => set("businessDescription", e.target.value)} placeholder="What does your business do?" /></Field>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Target Audience"><Input value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} placeholder="Small business owners" /></Field>
              <Field label="Target Location"><Input value={form.targetLocation} onChange={(e) => set("targetLocation", e.target.value)} placeholder="New York, USA" /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Primary Keyword"><Input value={form.primaryKeyword} onChange={(e) => set("primaryKeyword", e.target.value)} placeholder="best CRM for startups" /></Field>
              <Field label="Secondary Keywords"><Input value={form.secondaryKeywords} onChange={(e) => set("secondaryKeywords", e.target.value)} placeholder="comma, separated" /></Field>
            </div>
            <Field label="Competitor URLs"><Textarea rows={2} value={form.competitorUrls} onChange={(e) => set("competitorUrls", e.target.value)} placeholder="https://competitor.com, …" /></Field>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Content Tone">
                <Select value={form.contentTone} onValueChange={(v) => set("contentTone", v as Brief["contentTone"]) }>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Technical", "Casual"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Article Length">
                <Select value={form.articleLength} onValueChange={(v) => set("articleLength", v as Brief["articleLength"]) }>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["1000", "1500", "2000", "3000"].map((t) => <SelectItem key={t} value={t}>{t} words</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-brand text-white rounded-full h-12 glow">
              <Sparkles className="w-4 h-4 mr-2" /> Generate SEO Pack
            </Button>
          </form>
        )}
      </div>

      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent className="glass">
          <DialogHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <DialogTitle>Gemini API Key Required</DialogTitle>
            <DialogDescription>
              Please add your Gemini API Key in Settings before generating content. Get a free key at{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline">Google AI Studio</a>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowKeyModal(false)}>Cancel</Button>
            <Link to="/settings">
              <Button className="bg-gradient-brand text-white">Go to Settings</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
