/**
 * Media URL Resolver
 * Converts relative backend paths (e.g. /api/media/xxx) to full backend URLs
 * so that <video>, <img>, and <audio> tags can fetch media from the correct server.
 */

const BACKEND_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

/**
 * Resolves a media URL to a full absolute URL pointing to the backend.
 * - If the URL is already absolute (http/https), returns it as-is.
 * - If the URL starts with /api/, prepends the backend origin.
 * - Otherwise returns the URL unchanged (e.g. /hero.mp4 from public folder).
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";

  // Already an absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Relative backend API path → resolve to backend origin
  if (url.startsWith("/api/")) {
    return `${BACKEND_BASE}${url}`;
  }

  // Local public file (e.g. /hero.mp4) → keep as-is
  return url;
}
