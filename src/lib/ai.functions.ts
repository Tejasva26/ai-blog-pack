import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BriefSchema = z.object({
  businessName: z.string().min(1),
  businessDescription: z.string().min(1),
  industry: z.string().min(1),
  targetAudience: z.string().min(1),
  targetLocation: z.string().min(1),
  primaryKeyword: z.string().min(1),
  secondaryKeywords: z.string().default(""),
  competitorUrls: z.string().default(""),
  contentTone: z.enum(["Professional", "Friendly", "Technical", "Casual"]),
  articleLength: z.enum(["1000", "1500", "2000", "3000"]),
});

export type Brief = z.infer<typeof BriefSchema>;

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are an elite SEO strategist and content writer. Always respond with valid JSON only — no markdown fences, no commentary." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit exceeded. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace billing.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function extractJson(s: string): any {
  let t = s.trim();
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  try { return JSON.parse(t); } catch { return { raw: s }; }
}

export const generateSEOPack = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BriefSchema.parse(input))
  .handler(async ({ data: b }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const ctx = `BUSINESS BRIEF:
- Name: ${b.businessName}
- Description: ${b.businessDescription}
- Industry: ${b.industry}
- Target audience: ${b.targetAudience}
- Target location: ${b.targetLocation}
- Primary keyword: ${b.primaryKeyword}
- Secondary keywords: ${b.secondaryKeywords}
- Competitor URLs: ${b.competitorUrls}
- Tone: ${b.contentTone}
- Target article length: ${b.articleLength} words`;

    const prompt = `${ctx}

Generate a COMPLETE SEO blog pack. Respond with a single valid JSON object using EXACTLY this schema (no extra keys, no commentary, no markdown):

{
  "keywordIntent": {
    "primary": { "keyword": "string", "intent": "informational|transactional|commercial|navigational", "difficulty": "low|medium|high", "searchVolume": "string" },
    "secondary": [{ "keyword": "string", "intent": "string", "notes": "string" }]
  },
  "contentClusters": {
    "pillar": "string",
    "clusters": [{ "topic": "string", "subtopics": ["string"], "internalLinks": ["string"] }]
  },
  "outline": {
    "h1": "string",
    "sections": [{ "h2": "string", "h3": ["string"], "summary": "string" }]
  },
  "blog": {
    "title": "string",
    "content": "Full ${b.articleLength}-word markdown blog post with H2/H3 headings, intro, body sections, conclusion. Use the ${b.contentTone} tone. Naturally include the primary and secondary keywords."
  },
  "faqs": [{ "question": "string", "answer": "string" }],
  "metadata": {
    "metaTitle": "string (<=60 chars)",
    "metaDescription": "string (<=160 chars)",
    "slug": "kebab-case-url",
    "cta": ["string", "string", "string"]
  },
  "socialPosts": [
    { "platform": "Twitter", "post": "string" },
    { "platform": "LinkedIn", "post": "string" },
    { "platform": "Instagram", "post": "string" },
    { "platform": "Facebook", "post": "string" }
  ],
  "localSEO": {
    "location": "${b.targetLocation}",
    "variants": [{ "keyword": "string", "title": "string", "snippet": "string" }],
    "gmbTips": ["string"]
  },
  "competitorInsights": {
    "competitors": [{ "url": "string", "strengths": ["string"], "gaps": ["string"], "opportunities": ["string"] }],
    "summary": "string"
  }
}

Return ONLY the JSON.`;

    const raw = await callGemini(prompt, apiKey);
    return extractJson(raw);
  });
