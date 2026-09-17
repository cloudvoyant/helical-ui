<!-- apps/docs/src/components/examples/youtube/timestamps/svelte.svelte -->
<script lang="ts">
  import { YouTube, YoutubeTimestamps, YoutubeTimestampAt } from '@cloudvoyant/helical-svelte';
</script>

<YouTube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
  <YoutubeTimestamps>
    <YoutubeTimestampAt t={0}>Intro</YoutubeTimestampAt>
    <YoutubeTimestampAt t={43}>Chorus</YoutubeTimestampAt>
    <YoutubeTimestampAt t={128}>Bridge</YoutubeTimestampAt>
  </YoutubeTimestamps>
</YouTube>
