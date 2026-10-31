/**
 * S07 Schedule Review and Activate Screen
 * Final human confirmation before alarms exist (S2)
 */

import React, { useState } from 'react';
import { Bell, Volume2, ShieldCheck, ShieldAlert, Check, Calendar } from 'lucide-react';
import { StepHeader } from '../components/StepHeader';
import { ActionButton } from '../components/ActionButton';
import { PictogramTile, PictogramType } from '../components/PictogramTile';
import { VerificationBadge } from '../components/VerificationBadge';
import { UnverifiedGate } from '../components/UnverifiedGate';
import { ContentGate } from '../services/contentGate';
import { VoiceService } from '../services/voiceService';
import { ExtractedMedicineDraft } from '../../../shared/contracts';

interface S07ScheduleReviewProps {
  medicines: ExtractedMedicineDraft[];
  onBack: () => void;
  onActivate: () => void;
}

export const S07_ScheduleReview: React.FC<S07ScheduleReviewProps> = ({
  medicines,
  onBack,
  onActivate,
}) => {
  const [gateContent, setGateContent] = useState<{
    key: string;
    unverifiedText: string;
    englishText: string;
  } | null>(null);

  const handlePlayVoice = (med: ExtractedMedicineDraft) => {
    const resolved = ContentGate.resolveInstruction(
      med.dose_qty,
      med.form || 'tablet',
      med.food_relation,
      'te'
    );

    if (resolved.isLocked) {
      setGateContent({
        key: resolved.key,
        unverifiedText: resolved.displayText,
        englishText: resolved.englishFallbackText,
      });
    } else {
      VoiceService.speak(resolved.displayText, 'te');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-paper)',
        padding: '16px 16px 80px 16px',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <StepHeader
        currentStep={4}
        totalSteps={5}
        title="వేళాపట్టిక సమీక్ష (Review Schedule)"
        onBack={onBack}
      />

      <p className="type-body" style={{ margin: '0 0 20px 0', color: 'var(--color-quiet)' }}>
        అలారాలు ప్రారంభించే ముందు వేళాపట్టికను సరిచూడండి (Final check before activating alarms).
      </p>

      {/* List of Medicines & Their Timings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {medicines.map((med) => {
          const resolved = ContentGate.resolveInstruction(
            med.dose_qty,
            med.form || 'tablet',
            med.food_relation,
            'te'
          );

          return (
            <div
              key={med.temp_id}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-panel)',
                padding: '20px',
                border: '2px solid var(--color-line-soft)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h3
                    className="type-title"
                    style={{ margin: 0, fontSize: 'calc(24px * var(--font-scale))', color: 'var(--color-ink)' }}
                  >
                    {med.name} {med.strength}
                  </h3>
                  <span style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    {med.dose_qty} మాత్ర • {med.duration_days} రోజుల వ్యవధి
                  </span>
                </div>

                <VerificationBadge status={resolved.status} locale="te" />
              </div>

              {/* Timing Slots */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                {med.timings.map((time) => {
                  const hour = parseInt(time.split(':')[0], 10);
                  let picto: PictogramType = 'morning';
                  if (hour >= 12 && hour < 17) picto = 'afternoon';
                  else if (hour >= 17 && hour < 21) picto = 'evening';
                  else if (hour >= 21 || hour < 6) picto = 'night';

                  return (
                    <div
                      key={time}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-field)',
                        backgroundColor: 'var(--color-care-tint)',
                        color: 'var(--color-care)',
                        fontWeight: 700,
                        fontSize: 'calc(16px * var(--font-scale))',
                      }}
                    >
                      <PictogramTile type={picto} size={20} />
                      <span>{time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Spoken Template Instruction Line */}
              <div
                style={{
                  backgroundColor: 'var(--color-paper)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-field)',
                  border: `1.5px solid ${resolved.isLocked ? 'var(--color-caution)' : 'var(--color-line-soft)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, color: 'var(--color-ink)' }}>
                    {resolved.displayText}
                  </div>
                  {resolved.isLocked && (
                    <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--color-caution)', fontWeight: 600 }}>
                      ⚠️ {resolved.warning}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePlayVoice(med)}
                  aria-label="Listen to Telugu instruction"
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1.5px solid var(--color-line-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-care)',
                  }}
                >
                  <Volume2 size={22} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Activate Reminders CTA */}
      <ActionButton
        variant="primary"
        onClick={onActivate}
        icon={<Bell size={26} />}
      >
        అలారాలను ప్రారంభించండి (Activate Reminders)
      </ActionButton>

      {/* Unverified Gate Modal */}
      {gateContent && (
        <UnverifiedGate
          contentItemId={gateContent.key}
          unverifiedText={gateContent.unverifiedText}
          englishText={gateContent.englishText}
          isOpen={true}
          onClose={() => setGateContent(null)}
          onShowEnglish={() => {}}
          onAskPharmacist={() => {
            alert('ఫార్మసిస్ట్ తనిఖీ కోసం అభ్యర్థన పంపబడింది! (Review request sent)');
          }}
        />
      )}
    </div>
  );
};
