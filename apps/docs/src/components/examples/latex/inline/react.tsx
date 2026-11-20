// apps/docs/src/components/examples/latex/inline/react.tsx
import { toLaTeX } from '@cloudvoyant/helical-ui/latex';

export default function ReactLaTeXInline() {
  return (
    <p>
      The identity <span dangerouslySetInnerHTML={{ __html: toLaTeX('e^{i\\pi} + 1 = 0') }} /> rendered inline.
    </p>
  );
}
