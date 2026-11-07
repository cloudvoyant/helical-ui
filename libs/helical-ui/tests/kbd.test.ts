// libs/helical-ui/tests/kbd.test.ts
import { describe, expect, it, vi } from 'vitest';
import {
  formatKeyChord,
  formatKeySequence,
  isChordCommandString,
  kbdVariants,
  resolveKbdSteps,
  validateKbdChord,
  validateKbdHotkey,
} from '../src/kbd';

describe('kbd utilities and validation', () => {
  it('formats valid single chords and platform modifiers', () => {
    expect(formatKeyChord('Mod+K', { platform: 'mac' })).toBe('⌘ K');
    expect(formatKeyChord('Mod+K', { platform: 'windows' })).toBe('Ctrl+K');
    expect(formatKeyChord('Control+w', { platform: 'mac' })).toBe('⌃ W');
    expect(formatKeyChord('Shift+Z')).toBe('Z');
    expect(formatKeyChord('Escape')).toBe('Esc');
    expect(formatKeyChord('g')).toBe('g');
  });

  it('splits multi-chord command strings into formatted keycap sequences', () => {
    expect(formatKeySequence('Space w v', { platform: 'mac' })).toEqual(['Space', 'w', 'v']);
    expect(formatKeySequence('Control+w l', { platform: 'mac' })).toEqual(['⌃ W', 'l']);
    expect(formatKeySequence(['g', 'g'])).toEqual(['g', 'g']);
  });

  it('validates known chords and flags broken modifiers or unknown keys', () => {
    expect(validateKbdChord('Mod+K').valid).toBe(true);
    expect(validateKbdChord('Control+w').valid).toBe(true);
    expect(validateKbdHotkey('Space w v').valid).toBe(true);

    const badModifier = validateKbdChord('InvalidMod+K');
    expect(badModifier.valid).toBe(false);
    expect(badModifier.errors[0]).toContain("Unknown modifier: 'InvalidMod'");

    const badKey = validateKbdChord('Mod+UnknownKey');
    expect(badKey.valid).toBe(false);
    expect(badKey.errors[0]).toContain("Unknown key: 'UnknownKey'");

    const danglingPlus = validateKbdChord('Control+');
    expect(danglingPlus.valid).toBe(false);

    const badSequence = validateKbdHotkey('Space UnknownKey');
    expect(badSequence.valid).toBe(false);
    expect(badSequence.errors[0]).toContain("Step 2: Unknown key: 'UnknownKey'");
  });

  it('logs console.warn and marks steps invalid when resolveKbdSteps receives broken commands', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const resolved = resolveKbdSteps('InvalidMod+K');
    expect(resolved.valid).toBe(false);
    expect(resolved.steps[0]?.valid).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[helical-ui/Kbd] Invalid hotkey "InvalidMod+K"'));

    const seqResolved = resolveKbdSteps('Space UnknownKey');
    expect(seqResolved.valid).toBe(false);
    expect(seqResolved.steps[0]?.valid).toBe(true);
    expect(seqResolved.steps[1]?.valid).toBe(false);

    warnSpy.mockRestore();
  });

  it('applies distinctive destructive classes when invalid=true on kbdVariants', () => {
    const validClass = kbdVariants({ variant: 'outline', size: 'md', invalid: false });
    const invalidClass = kbdVariants({ variant: 'outline', size: 'md', invalid: true });
    expect(validClass).not.toContain('line-through');
    expect(invalidClass).toContain('border-destructive/70');
    expect(invalidClass).toContain('text-destructive');
    expect(invalidClass).toContain('line-through');
  });

  it('detects chord command strings passed as children', () => {
    expect(isChordCommandString('Mod+K')).toBe(true);
    expect(isChordCommandString('Space w v')).toBe(true);
    expect(isChordCommandString('⌘K')).toBe(false);
    expect(isChordCommandString('Outline')).toBe(false);
  });
});
