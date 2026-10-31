/**
 * UnverifiedGate Modal Component
 * Strictly implements ref/08-translation-lock-spec.md Section 5.3 (S5, S10)
 * Blocks unverified regional-language audio until deliberate acknowledgement.
 */

import React, { useState } from 'react';
import { AlertTriangle, Stethoscope, Volume2, Globe, X } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { localDb } from '../db/localStore';
import { VoiceService } from '../services/voiceService';
import { uxCopyEn, uxCopyTe } from '../../../shared/ux-copy';

interface UnverifiedGateProps {
  contentItemId: string;
  unverifiedText: string;
  englishText: string;
  isOpen: boolean;
  onClose: () => void;
  onShowEnglish: () => void;
  onAskPharmacist: () => void;
}

export const UnverifiedGate: React.FC<UnverifiedGateProps> = ({
  contentItemId,
  unverifiedText,
  englishText,
  isOpen,
  onClose,
  onShowEnglish,
  onAskPharmacist,
}) => {
  const [confirmPlayAnyway, setConfirmPlayAnyway] = useState(false);

  if (!isOpen) return null;

  const handleShowEnglish = () => {
    localDb.logUnverifiedAck(contentItemId, 'chose_english');
    VoiceService.speak(englishText, 'en');
    onShowEnglish();
    onClose();
  };

  const handleAskPharmacist = () => {
    localDb.logUnverifiedAck(contentItemId, 'asked_pharmacist');
    onAskPharmacist();
    onClose();
  };

  const handlePlayAnyway = () => {
    if (!confirmPlayAnyway) {
      setConfirmPlayAnyway(true);
      return;
    }
    // Deliberate 2nd confirmation completed
    localDb.logUnverifiedAck(contentItemId, 'played_anyway');
    VoiceService.speak(unverifiedText, 'te');
    setConfirmPlayAnyway(false);
    onClose();
  };

  const handleCancel = () => {
    localDb.logUnverifiedAck(contentItemId, 'cancelled');
    setConfirmPlayAnyway(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 42, 58, 0.75)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          padding: '24px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '3px solid var(--color-caution)',
        }}
      >
        {/* Header with Warning Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-caution-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-caution)',
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <div>
              <span
                style={{
                  fontSize: 'calc(13px * var(--font-scale))',
                  fontWeight: 700,
                  color: 'var(--color-caution)',
                  letterSpacing: '0.5px',
                }}
              >
                SAFETY INVARIANT S5 (TRANSLATION LOCK)
              </span>
              <h2
                id="gate-title"
                className="type-title"
                style={{ margin: 0, fontSize: 'calc(22px * var(--font-scale))', color: 'var(--color-ink)' }}
              >
                {uxCopyTe['lock.gate.title']}
              </h2>
            </div>
          </div>

          <button
            onClick={handleCancel}
            aria-label="Cancel"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-paper)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Safety Warning Copy */}
        <div
          style={{
            backgroundColor: 'var(--color-caution-tint)',
            padding: '14px',
            borderRadius: 'var(--radius-field)',
            border: '1.5px solid var(--color-caution)',
            marginBottom: '20px',
          }}
        >
          <p
            className="type-body"
            style={{ margin: 0, color: 'var(--color-ink)', fontSize: 'calc(18px * var(--font-scale))' }}
          >
            {uxCopyTe['lock.gate.body']}
          </p>
        </div>

        {/* Action Order strictly per Section 5.3:
            1. Show in English (default focus)
            2. Ask a pharmacist
            3. Play anyway (visually lower weight, deliberate confirmation)
        */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ActionButton
            variant="primary"
            onClick={handleShowEnglish}
            icon={<Globe size={22} />}
          >
            {uxCopyTe['lock.gate.english']} (English Voice)
          </ActionButton>

          <ActionButton
            variant="secondary"
            onClick={handleAskPharmacist}
            icon={<Stethoscope size={22} />}
          >
            {uxCopyTe['lock.gate.pharmacist']}
          </ActionButton>

          {!confirmPlayAnyway ? (
            <button
              type="button"
              onClick={handlePlayAnyway}
              style={{
                minHeight: '48px',
                backgroundColor: 'transparent',
                color: 'var(--color-caution)',
                border: '1.5px dashed var(--color-caution)',
                borderRadius: 'var(--radius-action)',
                fontWeight: 600,
                fontSize: 'calc(16px * var(--font-scale))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              <Volume2 size={18} />
              <span>{uxCopyTe['lock.gate.play']} (Unverified)</span>
            </button>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-paper)',
                padding: '12px',
                borderRadius: 'var(--radius-field)',
                border: '2px solid var(--color-danger)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  margin: '0 0 10px 0',
                  color: 'var(--color-danger)',
                  fontWeight: 700,
                  fontSize: 'calc(16px * var(--font-scale))',
                }}
              >
                ⚠️ Are you sure? Unverified translation may contain inaccuracies.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setConfirmPlayAnyway(false)}
                  style={{
                    flex: 1,
                    minHeight: '48px',
                    backgroundColor: 'var(--color-paper)',
                    border: '1px solid var(--color-line-strong)',
                    borderRadius: 'var(--radius-field)',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePlayAnyway}
                  style={{
                    flex: 1,
                    minHeight: '48px',
                    backgroundColor: 'var(--color-danger)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-field)',
                    fontWeight: 700,
                  }}
                >
                  Yes, Play Audio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
