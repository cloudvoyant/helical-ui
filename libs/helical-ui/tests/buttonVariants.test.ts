import { describe, it, expect } from 'vitest';
import { buttonVariants } from '@cloudvoyant/helical-ui';

describe('buttonVariants', () => {
  it('returns primary solid + md classes by default', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
    expect(classes).toContain('h-10');
  });

  it('supports every color in solid variant', () => {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warn', 'info'] as const;
    for (const color of colors) {
      const classes = buttonVariants({ variant: 'solid', color });
      expect(classes).toContain(`bg-${color}`);
      expect(classes).toContain(`text-${color}-foreground`);
    }
  });

  it('applies the outline style per color', () => {
    const classes = buttonVariants({ variant: 'outline', color: 'danger' });
    expect(classes).toContain('border');
    expect(classes).toContain('border-danger/50');
    expect(classes).toContain('text-danger');
    expect(classes).toContain('bg-background');
  });

  it('applies the text style per color', () => {
    const classes = buttonVariants({ variant: 'text', color: 'info' });
    expect(classes).toContain('text-info');
    expect(classes).toContain('bg-transparent');
    expect(classes).not.toContain('border');
  });

  it('supports sizes', () => {
    expect(buttonVariants({ size: 'sm' })).toContain('h-9');
    expect(buttonVariants({ size: 'lg' })).toContain('h-11');
    expect(buttonVariants({ size: 'icon' })).toContain('size-10');
  });
});
