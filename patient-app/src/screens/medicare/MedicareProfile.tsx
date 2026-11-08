import React from 'react';
import { ArrowLeft, User, Globe, Shield, AlertTriangle, LogOut, HeartPulse, ChevronRight, CheckCircle2 } from 'lucide-react';
import { localDb } from '../../db/localStore';
import { supportedLanguages } from '../../../../shared/ux-copy';

interface MedicareProfileProps {
  onBack: () => void;
  onSelectLanguage: () => void;
  onOpenArchitecture: () => void;
}

export const MedicareProfile: React.FC<MedicareProfileProps> = ({
  onBack,
  onSelectLanguage,
  onOpenArchitecture,
}) => {
  const dbState = localDb.getState();
  const user = dbState.currentUser || {
    fullName: 'Dr. Balu / Ramesh',
    mobile: '+91 98765 43210',
    email: 'user@medicare.health',
  };
  const currentLang = supportedLanguages.find((l) => l.code === dbState.settings.locale) || supportedLanguages[0];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8FAFC',
        overflowY: 'auto',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
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
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Profile &amp; Settings</h2>
        <div style={{ width: '40px' }} />
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* User Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
            }}
          >
            {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
              {user.fullName}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 4px 0' }}>{user.mobile}</p>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#16A34A',
                backgroundColor: '#DCFCE7',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              Verified Account
            </span>
          </div>
        </div>

        {/* Settings Links */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '8px 16px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            onClick={onSelectLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: '1px solid #F1F5F9',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={20} color="#2563EB" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Language</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{currentLang.nativeName} ({currentLang.name})</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>

          <div
            onClick={onOpenArchitecture}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HeartPulse size={20} color="#7C3AED" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>System Architecture</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>View MEDICARE Flow &amp; Poster Diagram</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Module (Project Report Section 6.16) */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: '18px',
            padding: '18px',
            border: '1.5px solid #FDE68A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={18} color="#D97706" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
              Medical &amp; Clinical Safety Disclaimer
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.5, margin: 0 }}>
            MEDICARE is a supportive medication-management and patient safety tool. It is <strong>not</strong> a substitute for diagnosis, prescribing, dispensing, or professional clinical judgement. OCR and AI extraction are provisional until confirmed by the user or an authorised registered pharmacist. Never alter doses without consulting your healthcare provider.
          </p>
        </div>

        {/* Institutional Project Credit */}
        <div style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#94A3B8' }}>
          Doctor of Pharmacy (Pharm.D) Innovation Project<br />
          Department of Pharmacy Practice
        </div>
      </div>
    </div>
  );
};
