// apps/docs/src/components/examples/HelicalLogo.tsx
// Inlined helical-ui mark so it inherits the current text color (theme accent).
export function HelicalLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" className={className} aria-hidden="true">
      <g transform="matrix(1.514356,0,0,1.5397644,-267.85739,178.38872)">
        <path fill="currentColor" fillOpacity="0.66" d="M 345.69656,260.2771 231.50691,62.565364 463.73532,63.9289 Z" />
        <path
          fill="currentColor"
          fillOpacity="0.66"
          d="M 419.59342,264.93238 269.83397,4.6980308 574.40098,6.492758 Z"
        />
        <ellipse fill="currentColor" fillOpacity="0.65" cx="389.18329" cy="106.10422" rx="40.461342" ry="41.509865" />
      </g>
    </svg>
  );
}
