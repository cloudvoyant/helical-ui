// libs/helical-ui/src/youtube.ts
// Closely based on: diffbook YouTube (packages/diffbook-ui/src/components/YouTube.tsx + YouTube.impl.tsx),
// implemented as a dependency-free facade.

export const youtubeRootBase = 'not-prose my-4';

export const youtubeTitleBase = 'mb-2 text-lg font-semibold text-foreground';

export const youtubeFacadeBase =
  'group relative aspect-video w-full cursor-pointer overflow-hidden rounded-md border border-border bg-muted/40';

export const youtubePlayButtonBase = 'absolute inset-0 flex items-center justify-center';

export const youtubePlayButtonInnerBase =
  'flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-white drop-shadow-lg transition-transform group-hover:scale-105';

export const youtubeDescriptionBase = 'mt-2 text-sm text-muted-foreground';

export const youtubeChaptersBase = 'group mt-3 rounded-lg border border-border bg-muted/40';

export const youtubeChaptersSummaryBase =
  'flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden';

export const youtubeChaptersChevronBase =
  'size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90';

export const youtubeChaptersListBase = 'border-t border-border px-2 py-2';

export const youtubeChapterButtonBase =
  'inline-flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const youtubeChapterTimeBase = 'font-mono text-xs text-primary';

export const youtubeChapterLabelBase = 'text-foreground';

export interface YouTubeChapter {
  /** Timestamp in seconds. */
  t: number;
  label: string;
}

export interface YouTubeProps {
  /** YouTube video URL (`youtube.com/watch?v=…`, `youtu.be/…`, or a short URL). */
  url: string;
  title?: string;
  description?: string;
  /** Custom poster URL (defaults to YouTube's hqdefault thumbnail). */
  poster?: string;
  className?: string;
}

/** Extract a bare video ID from either a full YouTube URL or a plain ID. */
export function extractYouTubeId(raw: string): string {
  try {
    const url = new URL(raw);
    const v = url.searchParams.get('v');
    if (v) return v;
    if (url.hostname === 'youtu.be') return url.pathname.slice(1);
  } catch {
    // Not a URL — treat as a bare video ID.
  }
  return raw;
}

/** Format seconds to `mm:ss` (or `h:mm:ss`). */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

const TIMESTAMP_RE = /^\s*\[?\(?(?:(\d+):)?(\d{1,2}):(\d{2})\)?\]?\s+(\S.*)$/;

/** Parse a chapter list from a YouTube description: one `mm:ss Description` (or `h:mm:ss`)
 *  per line. Returns `[]` when none parse. */
export function parseYouTubeChapters(description: string): YouTubeChapter[] {
  return description
    .split('\n')
    .map((line) => {
      const m = TIMESTAMP_RE.exec(line);
      if (!m) return null;
      const hours = m[1] ? Number(m[1]) : 0;
      const t = hours * 3600 + Number(m[2]) * 60 + Number(m[3]);
      return { t, label: m[4] } as YouTubeChapter;
    })
    .filter((c): c is YouTubeChapter => c !== null);
}

/** Fetch a video's title/description from a CORS-friendly oEmbed proxy (noembed.com).
 *  Used by `YoutubeTimestamps` to auto-infer chapters from the video's web metadata. */
export async function fetchYouTubeMetadata(url: string): Promise<{ title?: string; description?: string }> {
  const videoId = extractYouTubeId(url);
  const res = await fetch(
    `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`,
  );
  if (!res.ok) return {};
  const data = (await res.json()) as { title?: string; description?: string };
  return { title: data.title, description: data.description };
}
