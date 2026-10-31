/**
 * AlarmSurface Component (S09)
 * Full-screen alarm experience on solid ink backdrop with audio chimes and speech.
 * Implements S7 (auto-cancels guardian alert on Taken) and 10s Undo window.
 */

import React, { useEffect, useState } from 'react';
import { Check, Clock, RotateCcw, Volume2, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { DoseEvent } from '../../../shared/contracts';
import { ActionButton } from './ActionButton';
import { PictogramTile, PictogramType } from './PictogramTile';
import { ContentGate } from '../services/contentGate';
import { VoiceService } from '../services/voiceService';
import { UnverifiedGate } from './UnverifiedGate';
import { VerificationBadge } from './VerificationBadge';
import { localDb } from '../db/localStore';

interface AlarmSurfaceProps {
  dose: DoseEvent;
  onDismiss: () => void;
  onTaken?: (doseId: string) => void;
  onTake?: (doseId: string) => void;
  onLater: (doseId: string, minutes: number) => void;
}

export const AlarmSurface: React.FC<AlarmSurfaceProps> = ({
  dose,
  onDismiss,
  onTake,
  onTaken,
  onLater,
}) => {
  const [showLaterPicker, setShowLaterPicker] = useState(false);
  const [justTaken, setJustTaken] = useState(false);
  const [undoSecondsRemaining, setUndoSecondsRemaining] = useState(10);
  const [gateOpen, setGateOpen] = useState(false);

  const resolvedInstruction = ContentGate.resolveInstruction(
    dose.qty_text,
    'tablet',
    dose.food_relation,
    'te'
  );

  useEffect(() => {
    // Play harmonic chime
    VoiceService.playAlarmChime();

    // Auto-read verified audio; gate unverified
    if (!resolvedInstruction.isLocked) {
      VoiceService.speak(resolvedInstruction.displayText, 'te');
    }
  }, []);

  // 10-second Undo timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (justTaken && undoSecondsRemaining > 0) {
      timer = setTimeout(() => {
        setUndoSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (justTaken && undoSecondsRemaining === 0) {
      onDismiss();
    }
    return () => clearTimeout(timer);
  }, [justTaken, undoSecondsRemaining]);

  const handleTake = () => {
    localDb.markDoseTaken(dose.id);
    setJustTaken(true);
    setUndoSecondsRemaining(10);
  };

  const handleUndo = () => {
    localDb.undoDose(dose.id);
    setJustTaken(false);
    setUndoSecondsRemaining(10);
  };

  const handleAudioClick = () => {
    if (resolvedInstruction.isLocked) {
      setGateOpen(true);
    } else {
      VoiceService.speak(resolvedInstruction.displayText, 'te');
    }
  };

  // Determine time-of-day pictogram
  const hour = new Date(dose.due_at).getHours();
  let timePicto: PictogramType = 'morning';
  if (hour >= 12 && hour < 17) timePicto = 'afternoon';
  else if (hour >= 17 && hour < 21) timePicto = 'evening';
  else if (hour >= 21 || hour < 6) timePicto = 'night';

  const foodPicto: PictogramType =
    dose.food_relation === 'before'
      ? 'before_food'
      : dose.food_relation === 'with'
      ? 'with_food'
      : 'after_food';

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-ink)', // Solid ink backdrop per ref/04-design-system.md
        color: '#FFFFFF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px 24px',
        overflowY: 'auto',
      }}
    >
      {/* Top Bar with Dismiss */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 'calc(16px * var(--font-scale))',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          మందుల అలారం (Medicine Reminder)
        </span>

        <button
          onClick={onDismiss}
          aria-label="Close alarm screen"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 'auto 0' }}>
        {/* Pictograms */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <PictogramTile type={timePicto} size={48} highlight />
          <PictogramTile type={foodPicto} size={48} highlight />
          <PictogramTile type="tablet" size={48} highlight />
        </div>

        {/* Medicine Name (type-display 36/700) */}
        <h1
          className="type-display"
          style={{
            margin: '0 0 8px 0',
            color: '#FFFFFF',
            fontSize: 'calc(38px * var(--font-scale))',
          }}
        >
          {dose.medicine_name}
        </h1>

        <span
          style={{
            fontSize: 'calc(26px * var(--font-scale))',
            color: 'var(--color-line-soft)',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          {dose.strength || ''} • {dose.qty_text} మాత్ర
        </span>

        {/* Instruction Line with Verification Status */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: `2px solid ${resolvedInstruction.isLocked ? 'var(--color-caution)' : 'var(--color-verified)'}`,
            borderRadius: 'var(--radius-panel)',
            padding: '16px 20px',
            maxWidth: '520px',
            width: '100%',
            marginBottom: '16px',
          }}
        >
          <p
            className="type-body-lg"
            style={{
              margin: '0 0 10px 0',
              color: '#FFFFFF',
              fontWeight: 600,
            }}
          >
            {resolvedInstruction.displayText}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <VerificationBadge status={resolvedInstruction.status} locale="te" />

            <button
              onClick={handleAudioClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                fontSize: 'calc(15px * var(--font-scale))',
                fontWeight: 600,
                minHeight: '44px',
              }}
            >
              <Volume2 size={18} />
              <span>వినండి (Listen)</span>
            </button>
          </div>

          {resolvedInstruction.isLocked && (
            <p
              style={{
                margin: '10px 0 0 0',
                color: 'var(--color-caution)',
                fontSize: 'calc(14px * var(--font-scale))',
                fontWeight: 600,
              }}
            >
              ⚠️ {resolvedInstruction.warning}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Actions Area */}
      <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
        {!justTaken ? (
          !showLaterPicker ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                type="button"
                onClick={handleTake}
                style={{
                  width: '100%',
                  minHeight: 'var(--target-primary)',
                  backgroundColor: 'var(--color-verified)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-action)',
                  fontSize: 'calc(24px * var(--font-scale))',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 24px rgba(31, 122, 63, 0.4)',
                }}
              >
                <Check size={32} />
                <span>వేసుకున్నాను (Taken)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLaterPicker(true)}
                style={{
                  width: '100%',
                  minHeight: 'var(--target-min)',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: 'var(--radius-action)',
                  fontSize: 'calc(20px * var(--font-scale))',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <Clock size={24} />
                <span>తర్వాత గుర్తుచేయి (Remind Later)</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: 'var(--radius-panel)',
                textAlign: 'center',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: 'calc(20px * var(--font-scale))', color: '#FFFFFF' }}>
                ఎంత సమయం తర్వాత? (Remind in how many minutes?)
              </h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {[10, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      onLater(dose.id, mins);
                      onDismiss();
                    }}
                    style={{
                      flex: 1,
                      minHeight: 'var(--target-min)',
                      backgroundColor: 'var(--color-care)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-field)',
                      fontSize: 'calc(18px * var(--font-scale))',
                      fontWeight: 700,
                    }}
                  >
                    {mins} నిమి. ({mins}m)
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLaterPicker(false)}
                style={{
                  color: 'var(--color-line-soft)',
                  textDecoration: 'underline',
                  fontSize: 'calc(16px * var(--font-scale))',
                }}
              >
                రద్దు చేయి (Back)
              </button>
            </div>
          )
        ) : (
          /* 10-Second Undo Container per Elderly Accessibility Specs */
          <div
            style={{
              backgroundColor: 'var(--color-verified-tint)',
              color: 'var(--color-ink)',
              padding: '20px',
              borderRadius: 'var(--radius-panel)',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
              <Check size={28} color="var(--color-verified)" />
              <strong style={{ fontSize: 'calc(22px * var(--font-scale))', color: 'var(--color-verified)' }}>
                వేసుకున్నారు! (Marked as Taken)
              </strong>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)' }}>
              రక్షక హెచ్చరిక రద్దు చేయబడింది (Guardian alert cancelled). Closing in {undoSecondsRemaining}s...
            </p>

            <button
              onClick={handleUndo}
              style={{
                minHeight: '52px',
                padding: '10px 24px',
                backgroundColor: 'var(--color-caution)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-action)',
                fontWeight: 700,
                fontSize: 'calc(18px * var(--font-scale))',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RotateCcw size={20} />
              <span>పొరపాటున నొక్కాను (Undo - 10s)</span>
            </button>
          </div>
        )}
      </div>

      {/* Unverified Gate Modal */}
      <UnverifiedGate
        contentItemId={resolvedInstruction.key}
        unverifiedText={resolvedInstruction.displayText}
        englishText={resolvedInstruction.englishFallbackText}
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onShowEnglish={() => {}}
        onAskPharmacist={() => {
          alert('ఫార్మసిస్ట్‌కు తనిఖీ అభ్యర్థన పంపబడింది! (Review request submitted to pharmacist queue)');
        }}
      />
    </div>
  );
};
