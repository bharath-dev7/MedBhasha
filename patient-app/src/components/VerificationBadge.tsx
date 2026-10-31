/**
 * VerificationBadge Component
 * Implements ref/04-design-system.md Section 3.3 & ref/08-translation-lock-spec.md
 */

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Clock, Info, X } from 'lucide-react';
import { VerificationStatus } from '../../../shared/contracts';
import { uxCopyEn, uxCopyTe } from '../../../shared/ux-copy';

interface VerificationBadgeProps {
  status: VerificationStatus;
  locale?: string;
  showExplanationModal?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, locale = 'te' }) => {
  const [showModal, setShowModal] = useState(false);

  let icon = <ShieldAlert size={18} />;
  let label = locale === 'te' ? uxCopyTe['lock.badge.unverified'] : uxCopyEn['lock.badge.unverified'];
  let color = 'var(--color-caution)';
  let bg = 'var(--color-caution-tint)';
  let border = 'var(--color-caution)';

  if (status === 'verified') {
    icon = <ShieldCheck size={18} />;
    label = locale === 'te' ? uxCopyTe['lock.badge.verified'] : uxCopyEn['lock.badge.verified'];
    color = 'var(--color-verified)';
    bg = 'var(--color-verified-tint)';
    border = 'var(--color-verified)';
  } else if (status === 'in_review') {
    icon = <Clock size={18} />;
    label = locale === 'te' ? uxCopyTe['lock.badge.review'] : uxCopyEn['lock.badge.review'];
    color = 'var(--color-quiet)';
    bg = '#ECEFF1';
    border = 'var(--color-line-strong)';
  } else if (status === 'rejected') {
    icon = <ShieldX size={18} />;
    label = 'Rejected';
    color = 'var(--color-danger)';
    bg = 'var(--color-danger-tint)';
    border = 'var(--color-danger)';
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        aria-label={`Verification status: ${label}. Tap for explanation.`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: bg,
          color: color,
          border: `1.5px solid ${border}`,
          fontWeight: 700,
          fontSize: 'calc(15px * var(--font-scale))',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          transition: 'transform var(--motion-quick)',
        }}
      >
        <span aria-hidden="true" style={{ display: 'flex' }}>
          {icon}
        </span>
        <span>{label}</span>
        <Info size={14} style={{ opacity: 0.7 }} />
      </button>

      {/* Plain-Language Explanation Sheet Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 42, 58, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-panel)',
              padding: '24px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              border: '2px solid var(--color-line-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color }}>
                {icon}
                <h3 className="type-title" style={{ margin: 0, fontSize: 'calc(24px * var(--font-scale))' }}>
                  {label}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close explanation"
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-line-soft)',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <p className="type-body" style={{ margin: '0 0 16px 0', color: 'var(--color-ink)' }}>
              {status === 'verified'
                ? locale === 'te'
                  ? 'అర్హత కలిగిన ఫార్మసిస్ట్ ఈ మందు సమాచారాన్ని చదివి సరైనదని నిర్ధారించారు. ఇది సురక్షితమైనది.'
                  : 'A licensed pharmacist has verified this medical instruction against official pharmacology datasets.'
                : locale === 'te'
                ? 'ఈ తెలుగు అనువాదాన్ని ఫార్మసిస్ట్ ఇంకా తనిఖీ చేయలేదు. ఇందులో పొరపాట్లు ఉండే అవకాశం ఉన్నందున, ఇది లాక్ చేయబడింది.'
                : 'This translation is currently UNVERIFIED and locked. A pharmacist has not signed off on this wording yet.'}
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-paper)',
                padding: '12px',
                borderRadius: 'var(--radius-field)',
                border: '1px solid var(--color-line-soft)',
                fontSize: 'calc(16px * var(--font-scale))',
                color: 'var(--color-quiet)',
                marginBottom: '20px',
              }}
            >
              🔒 <strong>MedBhasha Safety Invariant S5 & S9:</strong>
              <br />
              All regional medical instructions are cryptographically signed with Ed25519. Unverified text is never presented as authentic.
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                minHeight: 'var(--target-min)',
                backgroundColor: 'var(--color-care)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-action)',
                fontWeight: 600,
                fontSize: 'calc(18px * var(--font-scale))',
              }}
            >
              {locale === 'te' ? 'సరే (Got it)' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
