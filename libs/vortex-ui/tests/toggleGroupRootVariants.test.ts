import { describe, it, expect } from 'vitest';
import { toggleGroupRootVariants } from '@cloudvoyant/vortex-ui';

describe('toggleGroupRootVariants', () => {
  it('is a horizontal inline-flex row by default', () => {
    const classes = toggleGroupRootVariants();
    expect(classes).toContain('inline-flex');
    expect(classes).toContain('flex-row');
    expect(classes).toContain('items-center');
  });

  it('supports vertical orientation', () => {
    expect(toggleGroupRootVariants({ orientation: 'vertical' })).toContain('flex-col');
  });

  it('collapses the gap and merges corners when attached', () => {
    const classes = toggleGroupRootVariants({ attached: true });
    expect(classes).toContain('gap-0');
    // Regression guard: the base used to carry `gap-1`, so both utilities were applied to the
    // element and Tailwind's emission order (.gap-1 after .gap-0) defeated the variant.
    expect(classes).not.toContain('gap-1');
    expect(classes).toContain('[&>*]:rounded-none');
    expect(classes).toContain('[&>*]:shadow-none');
    expect(classes).toContain('[&>*[data-state=on]]:border-primary');
    expect(classes).toContain('[&>*:first-child]:rounded-s-md');
    expect(classes).toContain('[&>*:last-child]:rounded-e-md');
  });

  it('keeps the default gap when not attached', () => {
    const classes = toggleGroupRootVariants({ attached: false });
    expect(classes).toContain('gap-1');
    expect(classes).not.toContain('gap-0');
  });
});
