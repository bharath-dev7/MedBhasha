import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Volume2, ShieldCheck, Clock, Calendar, ArrowRight } from 'lucide-react';
import { localDb } from '../../db/localStore';
import { t } from '../../../../shared/ux-copy';

interface MedicareVerifiedDetailsProps {
  onBack: () => void;
  onSetReminder: () => void;
  medicineName?: string;
  dosage?: string;
  duration?: string;
}

export const MedicareVerifiedDetails: React.FC<MedicareVerifiedDetailsProps> = ({
  onBack,
  onSetReminder,
  medicineName = 'Paracetamol 500 mg',
  dosage = '1 Tablet Twice Daily',
  duration = '5 Days',
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const locale = localDb.getState().settings.locale;

  const translationKey = medicineName.toLowerCase().includes('amox')
    ? 'trans.amoxicillin'
    : medicineName.toLowerCase().includes('panto')
    ? 'trans.pantoprazole'
    : 'trans.paracetamol';

  const localizedInstruction = t(translationKey, locale);
  const englishInstruction = t(translationKey, 'en');

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(localizedInstruction);
      utterance.lang = locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 24px 32px 24px',
        backgroundColor: '#F8FAFC',
      }}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 0 8px' }}>Verified Details</h2>
        </div>

        {/* Big Green Badge: Verified by Pharmacist (Poster Screen 8) */}
        <div style={{ textAlign: 'center', margin: '10px 0 24px 0' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '3px solid #86EFAC',
            }}
          >
            <CheckCircle2 size={42} strokeWidth={2.5} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#166534', margin: '0 0 4px 0' }}>
            Verified by Pharmacist
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Reviewed by Reg. Pharmacist #AP-48201
          </p>
        </div>

        {/* Card 1: Medicine Information */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Medicine Information
          </div>

          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            {medicineName}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#1976D2" />
              <span>Dose: <strong>{dosage}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#1976D2" />
              <span>Duration: <strong>{duration}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 2: Translation Unlocked (Poster Screen 8) */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            borderRadius: '20px',
            padding: '20px',
            border: '2px solid #86EFAC',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={14} />
              <span>Translation Unlocked</span>
            </div>

            <button
              onClick={handlePlayVoice}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isPlayingAudio ? '#16A34A' : '#FFFFFF',
                color: isPlayingAudio ? '#FFFFFF' : '#15803D',
                border: '1.5px solid #86EFAC',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Volume2 size={16} />
              <span>{isPlayingAudio ? 'Playing...' : 'Listen'}</span>
            </button>
          </div>

          {/* Regional translation in big clear text */}
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#14532D', lineHeight: 1.4, marginBottom: '6px' }}>
            {localizedInstruction}
          </div>

          {locale !== 'en' && (
            <div style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>
              En: {englishInstruction}
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ paddingTop: '20px' }}>
        <button
          onClick={onSetReminder}
          className="medicare-btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
        >
          <span>Set Dose Reminder</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
