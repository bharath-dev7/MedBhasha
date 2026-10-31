import {
  AuditLogEntry,
  BundleItem,
  ContentItem,
  Escalation,
  ReviewRequest,
  SignedBundle,
} from '../../shared/contracts.js';
import { instructionTemplates, uxCopyEn, uxCopyTe } from '../../shared/ux-copy.js';
import { computeItemContentSha256, sha256Hex } from '../../shared/crypto-bundle.js';
import { signBundle } from './signer.js';

export interface BackendState {
  contentItems: Map<string, ContentItem>;
  reviewRequests: Map<string, ReviewRequest>;
  escalations: Map<string, Escalation>;
  auditLog: AuditLogEntry[];
  signedBundles: Map<string, SignedBundle>; // locale -> latest SignedBundle
}

export const state: BackendState = {
  contentItems: new Map(),
  reviewRequests: new Map(),
  escalations: new Map(),
  auditLog: [],
  signedBundles: new Map(),
};

/**
 * Initialize seed items in Content Registry
 */
export async function initSeedData() {
  // Add an initial audit log entry
  addAuditLog({
    actor_id: 'system',
    actor_role: 'system',
    action: 'INIT_SYSTEM',
    target_id: 'content_registry',
    target_type: 'content_item',
    comment: 'MedBhasha Trust Layer Initialized with S1-S12 invariants active',
  });

  // Seed verified English templates
  for (const tpl of instructionTemplates) {
    const enSourceHash = await sha256Hex(tpl.sourceEn);
    const id = `instruction_template:${tpl.key}:en`;
    const contentSha = await computeItemContentSha256({
      key: tpl.key,
      locale: 'en',
      text: tpl.sourceEn,
      source_text_sha256: enSourceHash,
    });

    state.contentItems.set(id, {
      id,
      kind: 'instruction_template',
      key: tpl.key,
      locale: 'en',
      body_text: tpl.sourceEn,
      source_text_sha256: enSourceHash,
      content_sha256: contentSha,
      verification_status: 'verified',
      reviewer_id: 'rev_system',
      reviewed_at: Date.now(),
      bundle_version: '2026.10.31-001',
    });
  }

  // Seed Telugu templates:
  // We'll set 'instr.take.after_food' as UNVERIFIED initially to enable the Flagship Demo Path:
  // Patient sees it as unverified (warning + pictogram + gate) -> Pharmacist reviews & approves in Portal -> App syncs -> becomes Verified!
  for (const tpl of instructionTemplates) {
    const enSourceHash = await sha256Hex(tpl.sourceEn);
    const id = `instruction_template:${tpl.key}:te`;
    const isFlagshipDemoItem = tpl.key === 'instr.take.after_food';

    const contentSha = await computeItemContentSha256({
      key: tpl.key,
      locale: 'te',
      text: tpl.templateTe,
      source_text_sha256: enSourceHash,
    });

    const status = isFlagshipDemoItem ? 'unverified' : 'verified';

    state.contentItems.set(id, {
      id,
      kind: 'instruction_template',
      key: tpl.key,
      locale: 'te',
      body_text: tpl.templateTe,
      source_text_sha256: enSourceHash,
      content_sha256: contentSha,
      verification_status: status,
      reviewer_id: isFlagshipDemoItem ? undefined : 'rev_dr_rao',
      reviewed_at: isFlagshipDemoItem ? undefined : Date.now() - 86400000,
      bundle_version: isFlagshipDemoItem ? undefined : '2026.10.31-001',
    });
  }

  // Seed Review Request for the flagship demo item
  const demoReqId = 'req_demo_01';
  state.reviewRequests.set(demoReqId, {
    id: demoReqId,
    type: 'content_item',
    status: 'pending',
    created_at: Date.now() - 3600000,
    data: {
      content_item_key: 'instr.take.after_food',
      locale: 'te',
      source_english: 'Take {qty} {form} after food.',
      proposed_translation: 'భోజనం తర్వాత {qty} {form} తీసుకోండి.',
      sample_renderings: [
        'Take 1 tablet after food at 08:00 (భోజనం తర్వాత 1 మాత్ర తీసుకోండి - ఉదయం 8:00)',
        'Take 2 tablets after food at 20:00 (భోజనం తర్వాత 2 మాత్రలు తీసుకోండి - రాత్రి 8:00)',
      ],
    },
  });

  // Build initial signed bundle for Telugu
  await publishLatestBundle('te', '2026.10.31-001');
}

/**
 * Builds and signs a bundle with all currently 'verified' items for a locale
 */
export async function publishLatestBundle(locale: string, version?: string): Promise<SignedBundle> {
  const bundleVersion = version || `2026.10.31-${String(Date.now()).slice(-4)}`;
  const verifiedItems: BundleItem[] = [];

  for (const item of state.contentItems.values()) {
    if (item.locale === locale && item.verification_status === 'verified') {
      verifiedItems.push({
        key: item.key,
        kind: item.kind,
        locale: item.locale,
        text: item.body_text,
        source_text_sha256: item.source_text_sha256,
        content_sha256: item.content_sha256,
        status: 'verified',
        review: item.reviewer_id
          ? {
              reviewer_id: item.reviewer_id,
              credential_type: 'licensed_pharmacist',
              reviewed_at: new Date(item.reviewed_at || Date.now()).toISOString(),
            }
          : undefined,
      });
    }
  }

  const signed = await signBundle(bundleVersion, locale, verifiedItems);
  state.signedBundles.set(locale, signed);

  addAuditLog({
    actor_id: 'system',
    actor_role: 'system',
    action: 'PUBLISH_BUNDLE',
    target_id: bundleVersion,
    target_type: 'bundle',
    after_state: `Items: ${verifiedItems.length}`,
    comment: `Published signed Ed25519 bundle for locale ${locale}`,
  });

  return signed;
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const record: AuditLogEntry = {
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now(),
    ...entry,
  };
  state.auditLog.unshift(record); // newest first
}
