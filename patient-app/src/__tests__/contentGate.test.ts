import { describe, it, expect, beforeEach } from 'vitest';
import { ContentGate } from '../services/contentGate';
import { localDb } from '../db/localStore';

describe('S5 & S10: Translation Lock ContentGate & Template Resolution', () => {
  beforeEach(async () => {
    await localDb.seedDefaultData();
  });

  it('S5 invariant: unverified Telugu instruction is resolved as locked with visible warning', () => {
    // In seed data, instr.take.after_food in te is intentionally unverified for demo
    const resolved = ContentGate.resolve('instr.take.after_food', 'te');

    expect(resolved.status).toBe('unverified');
    expect(resolved.isLocked).toBe(true);
    expect(resolved.warning).toBeDefined();
    expect(resolved.badgeLabel).toBe('ఇంకా ధృవీకరించబడలేదు');
    expect(resolved.englishFallbackText).toBe('Take {qty} {form} after food.');
  });

  it('English source text is always verified baseline', () => {
    const resolved = ContentGate.resolve('instr.take.after_food', 'en');

    expect(resolved.status).toBe('verified');
    expect(resolved.isLocked).toBe(false);
    expect(resolved.displayText).toBe('Take {qty} {form} after food.');
  });

  it('S10 invariant: unknown or missing keys fail safe to unverified', () => {
    const resolved = ContentGate.resolve('non_existent_key_999', 'te');

    expect(resolved.status).toBe('unverified');
    expect(resolved.isLocked).toBe(true);
    expect(resolved.warning).toBeDefined();
  });

  it('deterministic slot filling substitutes {qty} and {form} correctly in Telugu', () => {
    const instruction = ContentGate.resolveInstruction('1', 'tablet', 'after', 'te');

    expect(instruction.key).toBe('instr.take.after_food');
    expect(instruction.displayText).toContain('1');
    expect(instruction.displayText).toContain('మాత్ర'); // Telugu for tablet
    expect(instruction.englishFallbackText).toBe('Take 1 tablet after food.');
  });

  it('applying verified signed bundle unlocks the instruction (S5 -> verified)', () => {
    // Before: unverified
    let resolved = ContentGate.resolve('instr.take.after_food', 'te');
    expect(resolved.isLocked).toBe(true);

    // Act: apply bundle with pharmacist verification
    localDb.applySignedBundle('2026.11.01-001', ['instr.take.after_food'], 'rev_ananya_reddy');

    // After: verified and unlocked!
    resolved = ContentGate.resolve('instr.take.after_food', 'te');
    expect(resolved.status).toBe('verified');
    expect(resolved.isLocked).toBe(false);
    expect(resolved.badgeLabel).toBe('ఫార్మసిస్ట్ ధృవీకరించారు');
  });
});
