const PROXY_HOSTS = [
  "firebasestorage.googleapis.com",
  "firebasestorage.app",
  "commondatastorage.googleapis.com",
];

/** Same-origin proxy URL so WebGL can sample Firebase / external MP4s (needs CORS otherwise). */
export function resolveHeroVideoUrl(url: string): string {
  if (!url) return url;

  if (url.startsWith("/api/video-proxy")) return url;

  try {
    const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const isExternal = PROXY_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
    if (!isExternal) return url;
    return `/api/video-proxy?url=${encodeURIComponent(url)}`;
  } catch {
    return url;
  }
}
