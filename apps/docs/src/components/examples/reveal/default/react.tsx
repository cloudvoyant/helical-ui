// apps/docs/src/components/examples/reveal/default/react.tsx
import { Reveal } from '@cloudvoyant/helical-react';

export default function ReactRevealDefault() {
  return (
    <Reveal question="Why does a static site need client-side components?">
      Interactive widgets (diagrams, quizzes, code highlighting) need JavaScript only after the page loads. The reveal
      above needs none — it uses Ark's collapsible, which is keyboard-accessible and SSR-safe.
    </Reveal>
  );
}
