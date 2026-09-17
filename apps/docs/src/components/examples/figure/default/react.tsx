// apps/docs/src/components/examples/figure/default/react.tsx
import { Figure } from '@cloudvoyant/helical-react';

const src = `${import.meta.env.BASE_URL}figure-example.svg`;

export default function ReactFigureDefault() {
  return (
    <Figure
      caption="Sunrise over layered mountain ranges"
      img={
        <img
          src={src}
          srcSet={`${src} 1x, ${src} 2x`}
          sizes="(min-width: 640px) 640px, 100vw"
          alt="Sunrise over layered mountain ranges"
          loading="lazy"
          className="rounded-lg border border-border"
        />
      }
    />
  );
}
