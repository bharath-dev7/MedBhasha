/**
 * MedBhasha Content Gate & Translation Lock Client Resolver
 * Strictly enforces ref/08-translation-lock-spec.md (S5, S9, S10)
 */

import { VerificationStatus } from '../../../shared/contracts';
import { localDb } from '../db/localStore';
import { uxCopyEn, uxCopyTe, slotTeluguWords } from '../../../shared/ux-copy';

export interface ResolvedContent {
  key: string;
  locale: string;
  status: VerificationStatus;
  displayText: string;
  englishFallbackText: string;
  warning?: string;
  badgeLabel: string;
  isLocked: boolean; // true if unverified/stale/rejected
}

export class ContentGate {
  /**
   * Resolves text and verification state for a content item
   */
  public static resolve(key: string, locale: string): ResolvedContent {
    const dbState = localDb.getState();
    const item = dbState.contentItems.find((i) => i.key === key && i.locale === locale);

    // English source is always verified baseline
    const enText = uxCopyEn[key] || key;

    // Fail-safe S10: if item not found, status is 'unverified'
    if (!item) {
      return {
        key,
        locale,
        status: 'unverified',
        displayText: locale === 'te' ? uxCopyTe[key] || enText : enText,
        englishFallbackText: enText,
        warning: locale === 'te' ? uxCopyTe['lock.text.warning'] : undefined,
        badgeLabel: uxCopyTe['lock.badge.unverified'],
        isLocked: locale !== 'en',
      };
    }

    // Per S10: 'stale' or 'rejected' are treated strictly as unverified by client
    const isLocked = item.verification_status !== 'verified';

    let badgeLabel = uxCopyTe['lock.badge.unverified'];
    if (item.verification_status === 'verified') {
      badgeLabel = locale === 'te' ? uxCopyTe['lock.badge.verified'] : 'Verified by a pharmacist';
    } else if (item.verification_status === 'in_review') {
      badgeLabel = locale === 'te' ? uxCopyTe['lock.badge.review'] : 'A pharmacist is checking this';
    }

    return {
      key,
      locale,
      status: item.verification_status,
      displayText: item.body_text || uxCopyTe[key] || enText,
      englishFallbackText: enText,
      warning: isLocked && locale === 'te' ? uxCopyTe['lock.text.warning'] : undefined,
      badgeLabel,
      isLocked,
    };
  }

  /**
   * Resolves a dosing instruction template with deterministic slot filling (ADR-004)
   * Example: "Take 1 tablet after food."
   * In Telugu: "భోజనం తర్వాత 1 మాత్ర (Tablet) తీసుకోండి."
   */
  public static resolveInstruction(
    qty: string,
    form: string,
    foodRelation: string,
    locale: 'en' | 'te'
  ): ResolvedContent {
    // Determine template key based on food relation
    let tplKey = 'instr.take.after_food';
    if (foodRelation === 'before') {
      tplKey = 'instr.take.before_food';
    } else if (foodRelation === 'with') {
      tplKey = 'instr.take.with_food';
    } else if (foodRelation === 'any') {
      tplKey = 'instr.take.any_time';
    }

    const resolved = this.resolve(tplKey, locale);

    // Deterministic slot substitution
    if (locale === 'te') {
      const teQty = slotTeluguWords[qty] || qty;
      const teForm = slotTeluguWords[form] || form;
      const filledText = resolved.displayText
        .replace('{qty}', teQty)
        .replace('{form}', teForm);

      const filledEn = resolved.englishFallbackText
        .replace('{qty}', qty)
        .replace('{form}', form);

      return {
        ...resolved,
        displayText: filledText,
        englishFallbackText: filledEn,
      };
    } else {
      const filledText = resolved.displayText
        .replace('{qty}', qty)
        .replace('{form}', form);

      return {
        ...resolved,
        displayText: filledText,
      };
    }
  }
}
