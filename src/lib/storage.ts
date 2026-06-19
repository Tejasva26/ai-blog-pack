export type SEOPack = {
  keywordIntent: any;
  contentClusters: any;
  outline: any;
  blog: { title: string; content: string };
  faqs: { question: string; answer: string }[];
  metadata: { metaTitle: string; metaDescription: string; slug: string; cta: string[] };
  socialPosts: { platform: string; post: string }[];
  localSEO?: any;
  competitorInsights?: any;
};

export type Project = {
  id: string;
  title: string;
  industry: string;
  keyword: string;
  brief: Record<string, any>;
  generatedContent: SEOPack;
  createdAt: string;
};

const KEY = "seo-blog-pack-projects";

export const loadProjects = (): Project[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export const saveProject = (p: Project) => {
  const all = loadProjects();
  all.unshift(p);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const deleteProject = (id: string) => {
  localStorage.setItem(KEY, JSON.stringify(loadProjects().filter(p => p.id !== id)));
};

export const getProject = (id: string): Project | undefined =>
  loadProjects().find(p => p.id === id);

export const clearAll = () => localStorage.removeItem(KEY);
