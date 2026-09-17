// libs/helical-react/src/youtube.tsx
// Closely based on: diffbook YouTube (packages/diffbook-ui/src/components/YouTube.impl.tsx),
// as a dependency-free facade. Accepts a URL; timestamps are composed via YoutubeTimestamps +
// YoutubeTimestampAt (auto-inferred from web metadata, or overridden manually).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { ChevronRight, Play } from 'lucide-react';
import {
  youtubeRootBase,
  youtubeTitleBase,
  youtubeFacadeBase,
  youtubePlayButtonBase,
  youtubePlayButtonInnerBase,
  youtubeDescriptionBase,
  youtubeChaptersBase,
  youtubeChaptersSummaryBase,
  youtubeChaptersChevronBase,
  youtubeChaptersListBase,
  youtubeChapterButtonBase,
  youtubeChapterTimeBase,
  youtubeChapterLabelBase,
  extractYouTubeId,
  formatTime,
  parseYouTubeChapters,
  fetchYouTubeMetadata,
  cn,
} from '@cloudvoyant/helical-ui';
import type { YouTubeProps as YouTubePropsBase, YouTubeChapter } from '@cloudvoyant/helical-ui';

/* ------------------------------------------------------------------ */
/*  Context — lets composed timestamps seek the parent player           */
/* ------------------------------------------------------------------ */

interface YouTubeContextValue {
  url: string;
  videoId: string;
  seek: (t: number) => void;
}

const YouTubeContext = createContext<YouTubeContextValue | null>(null);

function useYouTube(): YouTubeContextValue {
  const ctx = useContext(YouTubeContext);
  if (!ctx) throw new Error('YoutubeTimestamps must be rendered inside a <YouTube>.');
  return ctx;
}

export type YouTubeProps = HTMLArkProps<'div'> & YouTubePropsBase & { children?: ReactNode };

export function YouTube({ url, title, description, poster, className, children, ...props }: YouTubeProps) {
  const videoId = extractYouTubeId(url);
  const posterUrl = poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const [playing, setPlaying] = useState(false);
  const [startAt, setStartAt] = useState<number | null>(null);

  const seek = (t: number) => {
    setStartAt(t);
    setPlaying(true);
  };

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1${startAt == null ? '' : `&start=${startAt}`}`;

  return (
    <YouTubeContext.Provider value={{ url, videoId, seek }}>
      <ark.div data-youtube-id={videoId} className={cn(youtubeRootBase, className)} {...props}>
        {title ? <ark.h3 className={youtubeTitleBase}>{title}</ark.h3> : null}
        {playing ? (
          <iframe
            src={src}
            title={title ?? `YouTube video ${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-md border border-border"
          />
        ) : (
          <ark.button
            type="button"
            className={youtubeFacadeBase}
            onClick={() => setPlaying(true)}
            aria-label={title ? `Play video: ${title}` : 'Play video'}
          >
            <ark.img
              src={posterUrl}
              alt={title ?? `YouTube video ${videoId}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <ark.span className={youtubePlayButtonBase} aria-hidden="true">
              <ark.span className={youtubePlayButtonInnerBase}>
                <Play className="size-8 fill-current" aria-hidden="true" data-youtube-logo />
              </ark.span>
            </ark.span>
          </ark.button>
        )}
        {description ? <ark.p className={youtubeDescriptionBase}>{description}</ark.p> : null}
        {children}
      </ark.div>
    </YouTubeContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Timestamps — auto-inferred from web metadata, or manual overrides   */
/* ------------------------------------------------------------------ */

export type YoutubeTimestampAtProps = HTMLArkProps<'li'> & { t: number; children?: ReactNode };

export function YoutubeTimestampAt({ t, children, className, ...props }: YoutubeTimestampAtProps) {
  const { seek } = useYouTube();
  return (
    <ark.li className={className} {...props}>
      <ark.button type="button" onClick={() => seek(t)} className={youtubeChapterButtonBase}>
        <ark.span className={youtubeChapterTimeBase}>{formatTime(t)}</ark.span>
        <ark.span className={youtubeChapterLabelBase}>{children}</ark.span>
      </ark.button>
    </ark.li>
  );
}

export type YoutubeTimestampsProps = HTMLArkProps<'div'> & {
  /** Manual chapters; when omitted, chapters are auto-inferred from the video's web metadata. */
  chapters?: YouTubeChapter[];
  children?: ReactNode;
};

export function YoutubeTimestamps({ chapters, children, className, ...props }: YoutubeTimestampsProps) {
  const { url } = useYouTube();
  const [inferred, setInferred] = useState<YouTubeChapter[]>([]);
  const [loading, setLoading] = useState(chapters === undefined);

  useEffect(() => {
    if (chapters !== undefined) return;
    let cancelled = false;
    setLoading(true);
    fetchYouTubeMetadata(url)
      .then((meta) => {
        if (!cancelled) {
          setInferred(meta.description ? parseYouTubeChapters(meta.description) : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url, chapters]);

  const resolved = chapters ?? inferred;
  const hasChildren = children !== undefined && children !== null;

  if (!loading && resolved.length === 0 && !hasChildren) return null;

  return (
    <ark.div className={cn(youtubeChaptersBase, className)} {...props}>
      <details className="group" open>
        <ark.summary className={youtubeChaptersSummaryBase}>
          <ChevronRight className={youtubeChaptersChevronBase} aria-hidden="true" />
          <span>Timestamps</span>
        </ark.summary>
        <ark.nav aria-label="Video timestamps" className={youtubeChaptersListBase}>
          <ark.ul className="space-y-1">
            {resolved.map((ch) => (
              <YoutubeTimestampAt key={ch.t} t={ch.t}>
                {ch.label}
              </YoutubeTimestampAt>
            ))}
            {children}
          </ark.ul>
        </ark.nav>
      </details>
    </ark.div>
  );
}
