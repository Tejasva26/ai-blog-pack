import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_KEY_STORAGE = "gemini_api_key";

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem(GEMINI_KEY_STORAGE) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ||
    ""
  );
}

export function hasApiKey(): boolean {
  return Boolean(getApiKey());
}

function getModel() {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg.includes("MISSING_API_KEY")) throw new Error("MISSING_API_KEY");
    if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
      throw new Error("Invalid Gemini API key. Update it in Settings.");
    }
    if (msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
      throw new Error("Gemini quota exceeded. Try again later.");
    }
    if (msg.includes("fetch") || msg.includes("network")) {
      throw new Error("Network error reaching Gemini. Check your connection.");
    }
    throw new Error(msg || "Gemini request failed");
  }
}

function extractJson<T = any>(s: string): T {
  let t = s.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  return JSON.parse(t) as T;
}

async function generateJSON<T = any>(prompt: string): Promise<T> {
  const raw = await generateContent(
    prompt + "\n\nRespond with ONLY valid JSON. No markdown, no commentary, no code fences.",
  );
  try {
    return extractJson<T>(raw);
  } catch {
    return { raw } as unknown as T;
  }
}

export type Brief = {
  businessName: string;
  businessDescription: string;
  industry: string;
  targetAudience: string;
  targetLocation: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  competitorUrls: string;
  contentTone: "Professional" | "Friendly" | "Technical" | "Casual";
  articleLength: "1000" | "1500" | "2000" | "3000";
};

const briefBlock = (b: Brief) => `BUSINESS BRIEF:
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

export const generateKeywordIntent = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Generate keyword intent mapping. Schema:
{
  "primary": { "keyword": "string", "intent": "informational|transactional|commercial|navigational", "difficulty": "low|medium|high", "searchVolume": "string" },
  "secondary": [{ "keyword": "string", "intent": "string", "notes": "string" }]
}`);

export const generateContentClusters = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Generate a topic cluster strategy with internal linking suggestions. Schema:
{
  "pillar": "string",
  "clusters": [{ "topic": "string", "subtopics": ["string"], "internalLinks": ["string"] }]
}`);

export const generateOutline = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Generate a detailed SEO blog outline with H1, H2, H3 structure. Schema:
{
  "h1": "string",
  "sections": [{ "h2": "string", "h3": ["string"], "summary": "string" }]
}`);

export const generateLongBlog = async (b: Brief, outline: any) => {
  const raw = await generateContent(`${briefBlock(b)}

OUTLINE:
${JSON.stringify(outline)}

Write a complete ${b.articleLength}-word SEO blog post in ${b.contentTone} tone using the outline above.
Use markdown with H1/H2/H3 headings. Naturally include the primary and secondary keywords.
Respond with JSON ONLY in this shape (no markdown fences):
{ "title": "string", "content": "full markdown blog body" }`);
  try {
    return extractJson(raw);
  } catch {
    return { title: outline?.h1 || b.primaryKeyword, content: raw };
  }
};

export const generateFAQs = (b: Brief) =>
  generateJSON<{ question: string; answer: string }[] | { faqs: any[] }>(`${briefBlock(b)}

Generate 8 SEO-optimized FAQs for the primary keyword. Schema:
{ "faqs": [{ "question": "string", "answer": "string" }] }`);

export const generateLocalSEO = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Generate local SEO variants for ${b.targetLocation}. Schema:
{
  "location": "string",
  "variants": [{ "keyword": "string", "title": "string", "snippet": "string" }],
  "gmbTips": ["string"]
}`);

export const generateCompetitorInsights = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Analyze the competitor URLs and produce insights. Schema:
{
  "competitors": [{ "url": "string", "strengths": ["string"], "gaps": ["string"], "opportunities": ["string"] }],
  "summary": "string"
}`);

export const generateMetadata = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Generate SEO metadata. Schema:
{
  "metaTitle": "string (<=60 chars)",
  "metaDescription": "string (<=160 chars)",
  "slug": "kebab-case-url",
  "cta": ["string", "string", "string"]
}`);

export const generateSocialPosts = (b: Brief) =>
  generateJSON(`${briefBlock(b)}

Generate ready-to-post social media content. Schema:
{ "posts": [
  { "platform": "Twitter", "post": "string" },
  { "platform": "LinkedIn", "post": "string" },
  { "platform": "Instagram", "post": "string" },
  { "platform": "Facebook", "post": "string" }
] }`);

export async function generateSEOPack(b: Brief, onStep?: (i: number) => void) {
  onStep?.(0);
  const keywordIntent = await generateKeywordIntent(b);
  onStep?.(1);
  const contentClusters = await generateContentClusters(b);
  onStep?.(2);
  const outline = await generateOutline(b);
  onStep?.(3);
  const blog = await generateLongBlog(b, outline);
  onStep?.(4);
  const faqsRaw: any = await generateFAQs(b);
  const faqs = Array.isArray(faqsRaw) ? faqsRaw : faqsRaw.faqs || [];
  onStep?.(5);
  const metadata = await generateMetadata(b);
  onStep?.(6);
  const socialRaw: any = await generateSocialPosts(b);
  const socialPosts = Array.isArray(socialRaw) ? socialRaw : socialRaw.posts || [];
  onStep?.(7);
  const [localSEO, competitorInsights] = await Promise.all([
    generateLocalSEO(b),
    generateCompetitorInsights(b),
  ]);

  return {
    keywordIntent,
    contentClusters,
    outline,
    blog,
    faqs,
    metadata,
    socialPosts,
    localSEO,
    competitorInsights,
  };
}
