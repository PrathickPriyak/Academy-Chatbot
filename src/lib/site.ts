export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

export const siteName = "Infozub AI Assistant";

export const siteDescription =
  "Ask anything about Infozub Digital Academy courses, curriculum, enrollment, and learning programs.";
