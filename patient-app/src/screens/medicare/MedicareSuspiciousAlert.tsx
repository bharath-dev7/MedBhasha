import React, { useState } from 'react';
import { ArrowLeft, AlertOctagon, Phone, ShieldX, HelpCircle, CheckCircle2 } from 'lucide-react';

interface MedicareSuspiciousAlertProps {
  onBack: () => void;
  onContactPharmacist?: () => void;
  medicineName?: string;
}

export const MedicareSuspiciousAlert: React.FC<MedicareSuspiciousAlertProps> = ({
  onBack,
  onContactPharmacist,
  medicineName = 'Suspect Paracetamol Pack',
}) => {
  const [reported, setReported] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 24px 32px 24px',
        backgroundColor: '#FFFFFF',
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
        </div>

        {/* Big Red Warning Badge (Poster Screen 11) */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '3px solid #FCA5A5',
            }}
          >
            <AlertOctagon size={42} strokeWidth={2.3} />
          </div>

          <h2
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#991B1B',
              margin: '0 0 6px 0',
              lineHeight: 1.3,
            }}
          >
            Suspicious Medicine Detected!
          </h2>

          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Packaging or batch credentials could not be verified.
          </p>
        </div>

        {/* Blister Pack / Package Visual Card */}
        <div
          style={{
            backgroundColor: '#FFF1F2',
            borderRadius: '20px',
            padding: '20px',
            border: '2px solid #FECDD3',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {/* Simulated blister strip illustration */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
              backgroundColor: '#CBD5E1',
              borderRadius: '12px',
              padding: '12px',
              margin: '0 auto 16px auto',
              maxWidth: '220px',
              border: '2px solid #94A3B8',
            }}
          >
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                  border: '1px solid #94A3B8',
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '16px', fontWeight: 800, color: '#9F1239' }}>
            Please verify with a pharmacist.
          </div>
          <p style={{ fontSize: '13px', color: '#BE123C', margin: '6px 0 0 0', lineHeight: 1.4 }}>
            Inconsistencies detected against authenticated CDSCO registry. Do not consume until certified by a licensed professional.
          </p>
        </div>

        {/* Reasons detected */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '13px',
            color: '#334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ fontWeight: 700, color: '#0F172A' }}>Inconsistencies Flagged:</div>
          <div>• Batch format mismatch with authorized manufacturer list</div>
          <div>• Missing tamper-evident QR code authentication</div>
          <div>• Unverified printing or manufacturer seal</div>
        </div>
      </div>

      {/* Contact Pharmacist CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px' }}>
        <button
          onClick={() => {
            setReported(true);
            if (onContactPharmacist) onContactPharmacist();
          }}
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 700,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
          }}
        >
          <Phone size={20} />
          <span>{reported ? 'Connecting to Helpline...' : 'Contact Pharmacist'}</span>
        </button>
      </div>
    </div>
  );
};

