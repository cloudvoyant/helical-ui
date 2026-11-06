import { describe, expect, it } from 'vitest';
import {
  toastActionTriggerBase,
  toastCloseTriggerBase,
  toastDescriptionBase,
  toasterBase,
  toastIconBase,
  toastTitleBase,
  toastVariants,
} from '../src/toast';

describe('Given Toast cva variants and base classes in @cloudvoyant/helical-ui', () => {
  describe('When toastVariants and part base classes are evaluated', () => {
    it('Then returns base classes and data-type status border/icon selectors', () => {
      expect(toasterBase).toContain('[--width:22.25rem]');
      expect(toastVariants()).toContain('bg-popover');
      expect(toastVariants()).toContain('data-[type=success]:border-success/30');
      expect(toastVariants()).toContain('data-[type=warning]:border-warn/30');
      expect(toastVariants()).toContain('data-[type=error]:border-danger/30');
      expect(toastIconBase).toContain('shrink-0');
      expect(toastTitleBase).toContain('font-medium');
      expect(toastDescriptionBase).toContain('text-muted-foreground');
      expect(toastActionTriggerBase).toContain('inline-flex');
      expect(toastCloseTriggerBase).toContain('rounded-md');
    });
  });
});
