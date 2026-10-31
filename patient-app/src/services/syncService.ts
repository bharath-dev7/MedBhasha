/**
 * MedBhasha Sync Service & Bundle Importer
 * Implements S9, S10, and ref/08-translation-lock-spec.md Section 6
 */

import { SignedBundle } from '../../../shared/contracts';
import { validateSignedBundle, sha256Hex } from '../../../shared/crypto-bundle';
import { instructionTemplates } from '../../../shared/ux-copy';
import { localDb } from '../db/localStore';

export class SyncService {
  /**
   * Syncs the latest signed bundle from Trust Layer to Patient App
   */
  public static async syncLatestBundle(): Promise<{
    synced: boolean;
    bundleVersion?: string;
    message: string;
  }> {
    const state = localDb.getState();

    // Check offline mode simulator
    if (state.settings.offlineMode) {
      return { synced: false, message: 'App is in Airplane/Offline mode. Sync skipped.' };
    }

    try {
      const currentVersion = state.settings.installedBundleVersion;
      const res = await fetch(`/v1/bundles/latest?locale=te&since=${encodeURIComponent(currentVersion)}`);

      if (res.status === 304) {
        return { synced: true, bundleVersion: currentVersion, message: 'Bundle is up to date (304 Not Modified).' };
      }

      if (!res.ok) {
        return { synced: false, message: `Server returned error status ${res.status}` };
      }

      const bundle: SignedBundle = await res.json();

      // Compute known English source hashes
      const knownEnHashes: Record<string, string> = {};
      for (const tpl of instructionTemplates) {
        knownEnHashes[tpl.key] = await sha256Hex(tpl.sourceEn);
      }

      // Cryptographic Validation
      const trustedKey = bundle.signature.public_key;
      const validation = await validateSignedBundle(
        bundle,
        trustedKey,
        currentVersion,
        knownEnHashes
      );

      if (!validation.valid) {
        console.error('Safety Check Failed! Bundle rejected:', validation.error);
        return {
          synced: false,
          message: `Bundle rejected by client security check: ${validation.error}`,
        };
      }

      // Extract newly verified keys
      const verifiedKeys = validation.itemsStatus
        .filter((item) => item.status === 'verified')
        .map((item) => item.key);

      // Apply to local store
      localDb.applySignedBundle(bundle.bundle_version, verifiedKeys);

      // Flush sync queue items
      await this.flushSyncQueue();

      return {
        synced: true,
        bundleVersion: bundle.bundle_version,
        message: `Successfully verified and imported bundle ${bundle.bundle_version}. ${verifiedKeys.length} items verified.`,
      };
    } catch (e: any) {
      console.warn('Sync failed (offline or server unreachable):', e);
      return { synced: false, message: 'Could not connect to Trust Layer server.' };
    }
  }

  /**
   * Flushes pending items in sync queue (e.g. cancelled escalations)
   */
  public static async flushSyncQueue() {
    const state = localDb.getState();
    if (state.settings.offlineMode || state.syncQueue.length === 0) return;

    for (const item of [...state.syncQueue]) {
      try {
        const payload = JSON.parse(item.payload_json);
        if (item.op === 'cancel_escalation') {
          await fetch(`/v1/escalations/by-dose/${payload.dose_id}`, { method: 'DELETE' });
        }
        // Remove from local queue on success
        state.syncQueue = state.syncQueue.filter((q) => q.id !== item.id);
      } catch (err) {
        console.warn('Failed to flush item:', item.id, err);
      }
    }
  }
}
