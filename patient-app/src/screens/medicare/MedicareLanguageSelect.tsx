import React, { useState } from 'react';
import { ArrowLeft, Globe, Check, ArrowRight } from 'lucide-react';
import { SupportedLocale, supportedLanguages } from '../../../../shared/ux-copy';
import { localDb } from '../../db/localStore';

interface MedicareLanguageSelectProps {
  onBack: () => void;
  onContinue: () => void;
}

export const MedicareLanguageSelect: React.FC<MedicareLanguageSelectProps> = ({
  onBack,
  onContinue,
}) => {
  const currentLocale = localDb.getState().settings.locale;
  const [selected, setSelected] = useState<SupportedLocale>(currentLocale);

  const handleSelect = (code: SupportedLocale) => {
    setSelected(code);
    localDb.updateSettings({ locale: code });
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 24px 30px 24px',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '50%',
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Language Header with Globe */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#E3F2FD',
            color: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <Globe size={32} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
          Select Language
        </h2>
        <p style={{ fontSize: '15px', color: '#1976D2', fontWeight: 600, margin: 0 }}>
          (భాషను ఎంచుకోండి)
        </p>
      </div>

      {/* Language Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {supportedLanguages.map((lang) => {
          const isSelected = selected === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '16px',
                border: isSelected ? '2px solid #1976D2' : '1.5px solid #E2E8F0',
                backgroundColor: isSelected ? '#1976D2' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#0F172A',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isSelected ? '0 4px 14px rgba(25, 118, 210, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                  {lang.nativeName}
                </div>
                {lang.nativeName !== lang.name && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: isSelected ? 'rgba(255,255,255,0.85)' : '#64748B',
                      marginTop: '2px',
                    }}
                  >
                    {lang.name}
                  </div>
                )}
              </div>

              {isSelected && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={18} color="#FFFFFF" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: '20px' }}>
        <button
          onClick={onContinue}
          className="medicare-btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px' }}
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
