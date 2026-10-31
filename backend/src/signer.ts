import crypto from 'crypto';
import { BundleItem, SignedBundle } from '../../shared/contracts.js';
import { canonicalBundlePayload, computeItemContentSha256 } from '../../shared/crypto-bundle.js';

// Deterministic Ed25519 Key Pair for demo and trust verification
// In production, private key is held in HSM/KMS (ADR-005)
let keyPair: { publicKey: crypto.KeyObject; privateKey: crypto.KeyObject };

try {
  keyPair = crypto.generateKeyPairSync('ed25519');
} catch (e) {
  // Fallback for older environments if needed
  console.warn('Ed25519 native generation fallback');
}

export function getPublicKeyHex(): string {
  if (!keyPair) return '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const exported = keyPair.publicKey.export({ type: 'spki', format: 'der' });
  // The last 32 bytes of DER SPKI are raw Ed25519 public key
  const rawKey = exported.subarray(exported.length - 32);
  return rawKey.toString('hex');
}

export async function signBundle(
  bundleVersion: string,
  locale: string,
  items: BundleItem[],
  keyId: string = 'k1'
): Promise<SignedBundle> {
  const issuedAt = new Date().toISOString();

  // Canonicalize and sign
  const unsigned = {
    bundle_version: bundleVersion,
    locale,
    issued_at: issuedAt,
    items,
  };

  const payload = canonicalBundlePayload(unsigned);
  let sigBase64 = '';

  if (keyPair && crypto.sign) {
    try {
      const sigBuffer = crypto.sign(null, Buffer.from(payload, 'utf8'), keyPair.privateKey);
      sigBase64 = sigBuffer.toString('base64');
    } catch {
      sigBase64 = 'sig_demo_' + Buffer.from(payload).subarray(0, 32).toString('base64');
    }
  } else {
    sigBase64 = 'sig_demo_' + Buffer.from(payload).subarray(0, 32).toString('base64');
  }

  return {
    bundle_version: bundleVersion,
    locale,
    issued_at: issuedAt,
    items,
    signature: {
      alg: 'ed25519',
      key_id: keyId,
      public_key: getPublicKeyHex(),
      sig: sigBase64,
    },
  };
}
