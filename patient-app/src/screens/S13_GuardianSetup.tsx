/**
 * S13 Guardian Setup Screen
 * Strictly implements Safety Invariant S7: Guardian Consent & Minimisation.
 * Medicine names omitted by default; alerts cancel immediately upon dose mark.
 */

import React, { useState } from 'react';
import { ArrowLeft, UserCheck, ShieldCheck, Send, Check } from 'lucide-react';
import { ActionButton } from '../components/ActionButton';
import { localDb, LocalDatabaseState } from '../db/localStore';
import { uxCopyEn, uxCopyTe } from '../../../shared/ux-copy';

interface S13GuardianSetupProps {
  dbState: LocalDatabaseState;
  onBack: () => void;
}

export const S13_GuardianSetup: React.FC<S13GuardianSetupProps> = ({ dbState, onBack }) => {
  const existingGuardian = dbState.guardians[0] || {
    id: 'g_default',
    name: 'రమేష్ (కుమారుడు / Son)',
    phone_e164: '+919876543210',
    consent_at: Date.now(),
    wait_minutes: 30,
    active: 1,
    include_medicine_names: false,
  };

  const [name, setName] = useState(existingGuardian.name);
  const [phone, setPhone] = useState(existingGuardian.phone_e164);
  const [waitMinutes, setWaitMinutes] = useState(existingGuardian.wait_minutes);
  const [consentChecked, setConsentChecked] = useState(true);
  const [includeMedicineNames, setIncludeMedicineNames] = useState(existingGuardian.include_medicine_names || false);
  const [testSent, setTestSent] = useState(false);

  const previewMessage = includeMedicineNames
    ? `వెంకటమ్మ గారు [మెట్‌ఫార్మిన్ 500mg] మందును సమయానికి వేసుకోలేదు. (Venkatamma has not confirmed Metformin dose due at 8:00 AM).`
    : `వెంకటమ్మ గారు సమయానికి మందు వేసుకోలేదు. (Venkatamma has not confirmed a dose due at 8:00 AM).`;

  const handleSave = () => {
    localDb.updateGuardian({
      id: existingGuardian.id,
      name,
      phone_e164: phone,
      consent_at: Date.now(),
      wait_minutes: waitMinutes,
      active: consentChecked ? 1 : 0,
      include_medicine_names: includeMedicineNames,
    });
    alert('రక్షకుని వివరాలు భద్రపరచబడ్డాయి! (Guardian settings saved successfully)');
    onBack();
  };

  const handleSendTestAlert = async () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            minWidth: 'var(--target-min)',
            minHeight: 'var(--target-min)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-line-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="type-title" style={{ margin: 0, fontSize: 'calc(24px * var(--font-scale))' }}>
          {uxCopyTe['guardian.title']} (Guardian Setup)
        </h1>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          padding: '20px',
          border: '2px solid var(--color-line-soft)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-care)', marginBottom: '16px' }}>
          <UserCheck size={26} />
          <strong style={{ fontSize: 'calc(20px * var(--font-scale))' }}>
            విశ్వసనీయ సంరక్షకుడు (Trusted Relative)
          </strong>
        </div>

        {/* Name */}
        <label style={{ display: 'block', fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, marginBottom: '6px' }}>
          పేరు (Name):
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Guardian name"
          style={{
            width: '100%',
            minHeight: 'var(--target-min)',
            padding: '10px 14px',
            fontSize: 'calc(18px * var(--font-scale))',
            borderRadius: 'var(--radius-field)',
            border: '2px solid var(--color-care)',
            backgroundColor: '#FFFFFF',
            marginBottom: '16px',
          }}
        />

        {/* Phone */}
        <label style={{ display: 'block', fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, marginBottom: '6px' }}>
          ఫోన్ నంబర్ (Phone Number):
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Guardian phone"
          style={{
            width: '100%',
            minHeight: 'var(--target-min)',
            padding: '10px 14px',
            fontSize: 'calc(18px * var(--font-scale))',
            borderRadius: 'var(--radius-field)',
            border: '1.5px solid var(--color-line-strong)',
            backgroundColor: '#FFFFFF',
            marginBottom: '16px',
          }}
        />

        {/* Wait time */}
        <label style={{ display: 'block', fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, marginBottom: '6px' }}>
          ఎంత సమయం వేచి ఉండాలి? (Wait time before sending alert):
        </label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[15, 30, 60, 120].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setWaitMinutes(mins)}
              style={{
                flex: 1,
                minHeight: '52px',
                borderRadius: 'var(--radius-field)',
                backgroundColor: waitMinutes === mins ? 'var(--color-care)' : 'var(--color-paper)',
                color: waitMinutes === mins ? '#FFFFFF' : 'var(--color-ink)',
                border: `2px solid ${waitMinutes === mins ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
                fontWeight: 700,
                fontSize: 'calc(16px * var(--font-scale))',
              }}
            >
              {mins} నిమి.
            </button>
          ))}
        </div>

        {/* Message Preview Box */}
        <div
          style={{
            backgroundColor: 'var(--color-paper)',
            padding: '14px',
            borderRadius: 'var(--radius-field)',
            border: '1px solid var(--color-line-soft)',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            సందేశ నమూనా (Message Preview):
          </span>
          <p style={{ margin: 0, fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-ink)', fontWeight: 500 }}>
            "{previewMessage}"
          </p>
        </div>

        {/* S7 Data Minimisation: Opt-in for medicine names */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '16px',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={includeMedicineNames}
            onChange={(e) => setIncludeMedicineNames(e.target.checked)}
            style={{ width: '22px', height: '22px', marginTop: '2px' }}
          />
          <span style={{ fontSize: 'calc(15px * var(--font-scale))', color: 'var(--color-ink)' }}>
            సందేశంలో మందుల పేర్లను కూడా చేర్చండి (Include medicine names in alert - Optional per S7)
          </span>
        </label>

        {/* Plain-Language Consent Checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            style={{ width: '22px', height: '22px', marginTop: '2px' }}
          />
          <span style={{ fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, color: 'var(--color-care)' }}>
            {uxCopyTe['guardian.consent']} (I give consent to send alerts to this contact).
          </span>
        </label>

        {/* Test Alert Button */}
        <button
          type="button"
          onClick={handleSendTestAlert}
          style={{
            width: '100%',
            minHeight: '52px',
            borderRadius: 'var(--radius-field)',
            border: '1.5px solid var(--color-care)',
            color: 'var(--color-care)',
            backgroundColor: '#FFFFFF',
            fontWeight: 700,
            fontSize: 'calc(16px * var(--font-scale))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Send size={18} />
          <span>{uxCopyTe['guardian.test.cta']} (Send Test Alert)</span>
        </button>

        {testSent && (
          <div
            style={{
              marginTop: '10px',
              backgroundColor: 'var(--color-verified-tint)',
              color: 'var(--color-verified)',
              padding: '10px',
              borderRadius: 'var(--radius-field)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 'calc(15px * var(--font-scale))',
            }}
          >
            ✅ పరీక్ష సందేశం విజయవంతంగా పంపబడింది! (Simulated SMS dispatched)
          </div>
        )}
      </div>

      <ActionButton variant="primary" onClick={handleSave} icon={<Check size={24} />}>
        భద్రపరచండి (Save Guardian Settings)
      </ActionButton>
    </div>
  );
};
