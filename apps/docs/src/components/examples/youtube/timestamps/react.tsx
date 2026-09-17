// apps/docs/src/components/examples/youtube/timestamps/react.tsx
import { YouTube, YoutubeTimestamps, YoutubeTimestampAt } from '@cloudvoyant/helical-react';

export default function ReactYouTubeTimestamps() {
  return (
    <YouTube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
      <YoutubeTimestamps>
        <YoutubeTimestampAt t={0}>Intro</YoutubeTimestampAt>
        <YoutubeTimestampAt t={43}>Chorus</YoutubeTimestampAt>
        <YoutubeTimestampAt t={128}>Bridge</YoutubeTimestampAt>
      </YoutubeTimestamps>
    </YouTube>
  );
}
