import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Calendar, ShieldAlert, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

interface MedicareExpiryAlertProps {
  onBack: () => void;
  onViewDetails?: () => void;
  medicineName?: string;
  expDate?: string;
  daysRemaining?: number;
}

export const MedicareExpiryAlert: React.FC<MedicareExpiryAlertProps> = ({
  onBack,
  onViewDetails,
  medicineName = 'Paracetamol 500 mg',
  expDate = '01/12/2026',
  daysRemaining = 7,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
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

        {/* Warning Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFEDD5',
              color: '#EA580C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '2px solid #FDBA74',
            }}
          >
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Expiry Alert
          </h2>
        </div>

        {/* Prominent Red Alert Banner (Poster Screen 10) */}
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #FCA5A5',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#B91C1C',
              lineHeight: 1.35,
            }}
          >
            This medicine is expiring in {daysRemaining} days!
          </div>
          <p style={{ fontSize: '13px', color: '#991B1B', margin: '6px 0 0 0' }}>
            Do not consume expired medicines. Potency and sterility decline after expiry.
          </p>
        </div>

        {/* Medicine Details Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            {medicineName}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Expiry Date:</span>
              <strong style={{ color: '#DC2626' }}>{expDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Batch No:</span>
              <strong>B12345</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Remaining Quantity:</span>
              <strong>6 Tablets</strong>
            </div>
          </div>
        </div>

        {/* Safe Disposal / Pharmacist Advice */}
        <div
          style={{
            marginTop: '16px',
            padding: '14px',
            borderRadius: '14px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <PhoneCall size={20} color="#1D4ED8" />
          <div style={{ fontSize: '12px', color: '#1E40AF', lineHeight: 1.4 }}>
            Need a fresh prescription or guidance on disposal? Contact your local pharmacist.
          </div>
        </div>
      </div>

      {/* View Details Action */}
      <div style={{ paddingTop: '20px' }}>
        <button
          onClick={() => {
            setAcknowledged(true);
            if (onViewDetails) onViewDetails();
          }}
          className="medicare-btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
        >
          <span>{acknowledged ? 'Alert Acknowledged' : 'View Details'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

