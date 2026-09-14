import { describe, it, expect } from 'vitest';
import { proseVariants } from '@cloudvoyant/vortex-ui';

describe('proseVariants', () => {
  it('returns base sizing by default', () => {
    const classes = proseVariants();
    expect(classes).toContain('text-base');
    expect(classes).toContain('[&_h1]:text-4xl');
  });

  it('scales headings with the size variant', () => {
    expect(proseVariants({ size: 'sm' })).toContain('[&_h1]:text-2xl');
    expect(proseVariants({ size: 'base' })).toContain('[&_h1]:text-4xl');
    expect(proseVariants({ size: 'lg' })).toContain('[&_h1]:text-5xl');
  });

  it('scales heading spacing from largest to smallest', () => {
    const classes = proseVariants();
    expect(classes).toContain('[&>*:first-child]:mt-0');
    expect(classes).toContain('[&_h1]:mt-10');
    expect(classes).toContain('[&_h2]:mt-8');
    expect(classes).toContain('[&_h3]:mt-6');
    expect(classes).toContain('[&_h4]:mt-4');
    expect(classes).toContain('[&_h5]:mt-4');
  });

  it('styles descendant elements for long-form content', () => {
    const classes = proseVariants();
    expect(classes).toContain('[&_a]:text-primary');
    expect(classes).toContain('[&_ul]:list-disc');
    expect(classes).toContain('[&_ol]:list-decimal');
    expect(classes).toContain('[&_blockquote]:italic');
    expect(classes).toContain('[&_code]:bg-muted');
    expect(classes).toContain('[&_figcaption]:text-center');
  });

  it('never constrains width, so it can fill its container', () => {
    expect(proseVariants()).toContain('max-w-none');
  });
});
