// apps/docs/src/components/examples/latex/prerendered/react.tsx
import { LaTeX } from '@cloudvoyant/helical-react';
import { toLaTeX } from '@cloudvoyant/helical-ui';

const latex = '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}';

export default function ReactLaTeXPrerendered() {
  return <LaTeX latex={latex} html={toLaTeX(latex, { displayMode: true })} />;
}
