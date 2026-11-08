import React from 'react';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';

interface MedicareVerificationProps {
  onBack: () => void;
  onContinue: () => void;
  medicineName?: string;
}

export const MedicareVerification: React.FC<MedicareVerificationProps> = ({
  onBack,
  onContinue,
  medicineName = 'Paracetamol 500 mg',
}) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 24px 32px',
      backgroundColor: '#FFFFFF',
    }}
  >
    <div>
      <button
        onClick={onBack}
        aria-label="Back"
        style={{ background: 'none', border: 'none', padding: '8px', color: '#0F172A' }}
      >
        <ArrowLeft size={24} />
      </button>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid #BFDBFE',
          }}
        >
          <ShieldCheck size={44} strokeWidth={2.2} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
          Review Preview
        </h2>
        <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.5, maxWidth: '300px', margin: '0 auto' }}>
          You can continue to view the sample instructions for {medicineName}.
        </p>
      </div>

      <div
        role="status"
        style={{
          marginTop: '28px',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FCD34D',
          borderRadius: '16px',
          padding: '16px',
          color: '#92400E',
          fontSize: '14px',
          lineHeight: 1.5,
        }}
      >
        This demo does not charge a fee or contact a pharmacist. The instructions are examples and have not been clinically reviewed.
      </div>
    </div>

    <button
      onClick={onContinue}
      className="medicare-btn-primary"
      style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
    >
      <span>Continue to Instructions Preview</span>
      <ArrowRight size={20} />
    </button>
  </div>
);
