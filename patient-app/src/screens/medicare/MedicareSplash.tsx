import React from 'react';
import { MedicareLogo } from './MedicareLogo';
import { ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface MedicareSplashProps {
  onGetStarted: () => void;
}

export const MedicareSplash: React.FC<MedicareSplashProps> = ({ onGetStarted }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '60px 24px 40px 24px',
        background: 'linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 60%, #E8F4FD 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative pulse line top right */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          opacity: 0.15,
          color: '#1976D2',
        }}
      >
        <HeartPulse size={90} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <MedicareLogo size={120} />

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '38px',
              fontWeight: 900,
              color: '#0D47A1',
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            MEDICARE
          </h1>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#1976D2',
              marginTop: '6px',
              marginBottom: '16px',
            }}
          >
            Smart Medicine. Safe Life.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              padding: '6px 14px',
              borderRadius: '9999px',
              color: '#0D47A1',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={16} />
            <span>Medication Safety Demo</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Subtitle */}
      <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '13px',
            color: '#64748B',
            marginBottom: '20px',
            fontWeight: 500,
          }}
        >
          Your Health, Our Priority
        </p>

        <button
          onClick={onGetStarted}
          className="medicare-btn-primary"
          style={{
            width: '100%',
            padding: '16px 24px',
            fontSize: '18px',
            borderRadius: '9999px',
            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.35)',
          }}
        >
          <span>Get Started</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
