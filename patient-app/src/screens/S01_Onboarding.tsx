/**
 * S01 Onboarding Screen
 * Implements ref/05-screen-specs.md S01
 * Language selection (Telugu / English), Privacy consent, Permissions explanation.
 */

import React, { useState } from 'react';
import { ShieldCheck, Check, Globe, Bell, Camera, ChevronRight } from 'lucide-react';
import { ActionButton } from '../components/ActionButton';
import { localDb } from '../db/localStore';

interface S01OnboardingProps {
  onComplete: () => void;
}

export const S01_Onboarding: React.FC<S01OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<'te' | 'en'>('te');
  const [cameraGranted, setCameraGranted] = useState(true);
  const [alarmGranted, setAlarmGranted] = useState(true);

  const handleFinish = () => {
    localDb.updateSettings({
      locale: selectedLang,
      exactAlarmAllowed: alarmGranted,
    });
    onComplete();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-paper)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxWidth: '540px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-field)',
              backgroundColor: 'var(--color-care)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            MB
          </div>
          <span style={{ fontWeight: 700, fontSize: '22px', color: 'var(--color-ink)' }}>MedBhasha</span>
        </div>

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div>
            <span style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600 }}>
              దశ 1 / 3 (Step 1 of 3)
            </span>
            <h1
              className="type-title"
              style={{ margin: '8px 0 12px 0', fontSize: 'calc(30px * var(--font-scale))', color: 'var(--color-ink)' }}
            >
              మీ భాషను ఎంచుకోండి
              <br />
              <span style={{ fontSize: 'calc(24px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                Choose your language
              </span>
            </h1>

            <p className="type-body" style={{ margin: '0 0 24px 0', color: 'var(--color-quiet)' }}>
              అలారాలు మరియు మందుల వివరాలు ఈ భాషలోనే వినిపిస్తాయి. (Reminders and instructions will be presented in this language).
            </p>

            {/* Language Big Tiles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setSelectedLang('te')}
                style={{
                  minHeight: '84px',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-panel)',
                  backgroundColor: selectedLang === 'te' ? 'var(--color-care-tint)' : 'var(--color-surface)',
                  border: `3px solid ${selectedLang === 'te' ? 'var(--color-care)' : 'var(--color-line-strong)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: 'calc(26px * var(--font-scale))', fontWeight: 700, color: 'var(--color-ink)' }}>
                    తెలుగు (Telugu)
                  </div>
                  <div style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    తెలుగులో మాట్లాడే సూచనలు & వివరణలు
                  </div>
                </div>
                {selectedLang === 'te' && <Check size={28} color="var(--color-care)" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                style={{
                  minHeight: '84px',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-panel)',
                  backgroundColor: selectedLang === 'en' ? 'var(--color-care-tint)' : 'var(--color-surface)',
                  border: `3px solid ${selectedLang === 'en' ? 'var(--color-care)' : 'var(--color-line-strong)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: 'calc(26px * var(--font-scale))', fontWeight: 700, color: 'var(--color-ink)' }}>
                    English
                  </div>
                  <div style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    English instructions & voice prompts
                  </div>
                </div>
                {selectedLang === 'en' && <Check size={28} color="var(--color-care)" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Privacy Basics */}
        {step === 2 && (
          <div>
            <span style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600 }}>
              దశ 2 / 3 (Step 2 of 3)
            </span>
            <h1
              className="type-title"
              style={{ margin: '8px 0 16px 0', fontSize: 'calc(28px * var(--font-scale))', color: 'var(--color-ink)' }}
            >
              {selectedLang === 'te' ? 'మీ గోప్యత మా బాధ్యత' : 'Privacy & Safety Promise'}
            </h1>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-panel)',
                padding: '20px',
                border: '2px solid var(--color-line-soft)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-verified)', marginBottom: '12px' }}>
                <ShieldCheck size={26} />
                <strong style={{ fontSize: 'calc(20px * var(--font-scale))' }}>
                  {selectedLang === 'te' ? 'ఆఫ్‌లైన్ భద్రత' : 'Offline-First Security'}
                </strong>
              </div>

              <p className="type-body" style={{ margin: '0 0 14px 0', color: 'var(--color-ink)' }}>
                {selectedLang === 'te'
                  ? 'మీ మందుల వివరాలు, ఫోటోలు మీ ఫోన్‌లోనే ఉంటాయి. ఇంటర్నెట్ లేకపోయినా అలారాలు ఎల్లప్పుడూ మోగుతాయి.'
                  : 'Your prescription photos and health data remain on your phone. Reminders fire accurately without any internet connection.'}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-care-tint)',
                  padding: '12px',
                  borderRadius: 'var(--radius-field)',
                  fontSize: 'calc(15px * var(--font-scale))',
                  color: 'var(--color-care)',
                  fontWeight: 600,
                }}
              >
                🔒 Invariant S12: No prescription images leave your device without your explicit consent.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Permissions */}
        {step === 3 && (
          <div>
            <span style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600 }}>
              దశ 3 / 3 (Step 3 of 3)
            </span>
            <h1
              className="type-title"
              style={{ margin: '8px 0 16px 0', fontSize: 'calc(28px * var(--font-scale))', color: 'var(--color-ink)' }}
            >
              {selectedLang === 'te' ? 'అనుమతులు (Permissions)' : 'Essential Permissions'}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Alarms permission */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '16px',
                  borderRadius: 'var(--radius-panel)',
                  border: '1.5px solid var(--color-line-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-care-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-care)',
                  }}
                >
                  <Bell size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                    {selectedLang === 'te' ? 'ఖచ్చితమైన అలారాలు (Exact Alarms)' : 'Exact Alarms & Notifications'}
                  </strong>
                  <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    {selectedLang === 'te' ? 'సమయానికి మందు వేసుకోవడానికి అవసరం' : 'Ensures alerts never get silenced by battery savers'}
                  </div>
                </div>
                <Check size={24} color="var(--color-verified)" />
              </div>

              {/* Camera permission */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '16px',
                  borderRadius: 'var(--radius-panel)',
                  border: '1.5px solid var(--color-line-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-care-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-care)',
                  }}
                >
                  <Camera size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                    {selectedLang === 'te' ? 'కెమెరా (Camera)' : 'Camera'}
                  </strong>
                  <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    {selectedLang === 'te' ? 'ప్రిస్క్రిప్షన్ మరియు పట్టీలను స్కాన్ చేయడానికి' : 'Used for scanning medicine strips and paper prescriptions'}
                  </div>
                </div>
                <Check size={24} color="var(--color-verified)" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ marginTop: '32px' }}>
        {step < 3 ? (
          <ActionButton
            variant="primary"
            onClick={() => setStep((s) => (s + 1) as any)}
            icon={<ChevronRight size={24} />}
          >
            {selectedLang === 'te' ? 'తదుపరి (Next)' : 'Continue'}
          </ActionButton>
        ) : (
          <ActionButton
            variant="primary"
            onClick={handleFinish}
            icon={<Check size={24} />}
          >
            {selectedLang === 'te' ? 'ప్రారంభించండి (Get Started)' : 'Enter MedBhasha'}
          </ActionButton>
        )}
      </div>
    </div>
  );
};
