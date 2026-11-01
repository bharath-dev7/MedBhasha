import { describe, it, expect } from 'vitest';
import {
  canonicalJson,
  sha256Hex,
  computeItemContentSha256,
  canonicalBundlePayload,
  validateSignedBundle,
} from '../crypto-bundle';
import { BundleItem, SignedBundle } from '../contracts';
import { signBundle, getPublicKeyHex } from '../../backend/src/signer';

describe('S9 & S10: Cryptographic Bundle Signing & Canonical Hashing', () => {
  it('canonicalJson sorts object keys deterministically regardless of insertion order', () => {
    const objA = { b: 2, a: 1, c: { y: 20, x: 10 } };
    const objB = { a: 1, c: { x: 10, y: 20 }, b: 2 };

    const jsonA = canonicalJson(objA);
    const jsonB = canonicalJson(objB);

    expect(jsonA).toBe(jsonB);
    expect(jsonA).toBe('{"a":1,"b":2,"c":{"x":10,"y":20}}');
  });

  it('sha256Hex generates consistent 64-char lowercase hexadecimal hash', async () => {
    const hash = await sha256Hex('MedBhasha Safety Invariant S9');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);

    const hashRepeat = await sha256Hex('MedBhasha Safety Invariant S9');
    expect(hash).toBe(hashRepeat);
  });

  it('computes content_sha256 matching canonical properties', async () => {
    const item = {
      key: 'instr.take.after_food',
      locale: 'te',
      text: 'భోజనం తర్వాత {qty} {form} తీసుకోండి.',
      source_text_sha256: await sha256Hex('Take {qty} {form} after food.'),
      audio_sha256: '',
    };

    const hash = await computeItemContentSha256(item);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('S9 invariant: signBundle signs with Ed25519 and validateSignedBundle verifies offline', async () => {
    const publicKey = getPublicKeyHex();
    expect(publicKey).toHaveLength(64);

    const enSource = 'Take {qty} {form} after food.';
    const enHash = await sha256Hex(enSource);

    const testItem: BundleItem = {
      key: 'instr.take.after_food',
      kind: 'instruction_template',
      locale: 'te',
      text: 'భోజనం తర్వాత {qty} {form} తీసుకోండి.',
      source_text_sha256: enHash,
      content_sha256: '',
      status: 'verified',
    };
    testItem.content_sha256 = await computeItemContentSha256(testItem);

    const signed = await signBundle('2026.11.01-001', 'te', [testItem]);

    expect(signed.signature.alg).toBe('ed25519');
    expect(signed.signature.sig.length).toBeGreaterThan(10);

    const knownEnHashes = {
      'instr.take.after_food': enHash,
    };

    const result = await validateSignedBundle(signed, publicKey, null, knownEnHashes);
    expect(result.valid).toBe(true);
    expect(result.verifiedItemsCount).toBe(1);
    expect(result.invalidItemsCount).toBe(0);
  });

  it('S9 invariant: tampering with translation text fails validation and rejects bundle', async () => {
    const publicKey = getPublicKeyHex();
    const enSource = 'Take {qty} {form} after food.';
    const enHash = await sha256Hex(enSource);

    const testItem: BundleItem = {
      key: 'instr.take.after_food',
      kind: 'instruction_template',
      locale: 'te',
      text: 'భోజనం తర్వాత {qty} {form} తీసుకోండి.',
      source_text_sha256: enHash,
      content_sha256: '',
      status: 'verified',
    };
    testItem.content_sha256 = await computeItemContentSha256(testItem);

    const signed = await signBundle('2026.11.01-002', 'te', [testItem]);

    // Tamper with text
    signed.items[0].text = 'TAMPERED: భోజనం ముందు తీసుకోండి.';

    const knownEnHashes = {
      'instr.take.after_food': enHash,
    };

    // Recomputed content_sha256 will mismatch with signed content_sha256 -> invalid
    const result = await validateSignedBundle(signed, publicKey, null, knownEnHashes);
    expect(result.valid).toBe(false);
  });

  it('S10 invariant: if English source text was updated, item becomes stale and requires re-review', async () => {
    const publicKey = getPublicKeyHex();
    const oldEnSource = 'Take {qty} {form} after food.';
    const oldEnHash = await sha256Hex(oldEnSource);

    const testItem: BundleItem = {
      key: 'instr.take.after_food',
      kind: 'instruction_template',
      locale: 'te',
      text: 'భోజనం తర్వాత {qty} {form} తీసుకోండి.',
      source_text_sha256: oldEnHash,
      content_sha256: '',
      status: 'verified',
    };
    testItem.content_sha256 = await computeItemContentSha256(testItem);

    const signed = await signBundle('2026.11.01-003', 'te', [testItem]);

    // Simulate clinical doctor updated English instruction
    const updatedEnSource = 'Take {qty} {form} immediately with food or milk.';
    const newEnHash = await sha256Hex(updatedEnSource);

    const knownEnHashes = {
      'instr.take.after_food': newEnHash,
    };

    const result = await validateSignedBundle(signed, publicKey, null, knownEnHashes);
    expect(result.valid).toBe(true);
    expect(result.staleItemsCount).toBe(1);
    expect(result.itemsStatus[0].status).toBe('stale');
  });

  it('rejects version downgrade attempt', async () => {
    const publicKey = getPublicKeyHex();
    const enHash = await sha256Hex('Take after food.');

    const testItem: BundleItem = {
      key: 'instr.test',
      kind: 'instruction_template',
      locale: 'te',
      text: 'టెస్ట్',
      source_text_sha256: enHash,
      content_sha256: '',
      status: 'verified',
    };
    testItem.content_sha256 = await computeItemContentSha256(testItem);

    // Old version bundle
    const signed = await signBundle('2026.10.01-001', 'te', [testItem]);

    // Current installed is newer: 2026.11.01-001
    const result = await validateSignedBundle(signed, publicKey, '2026.11.01-001', { 'instr.test': enHash });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('downgrade rejected');
  });
});
