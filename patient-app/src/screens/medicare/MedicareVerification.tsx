import React, { useState } from 'react';
import { ArrowLeft, Shield, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Check, Sparkles } from 'lucide-react';
import { localDb } from '../../db/localStore';

interface MedicareVerificationProps {
  onBack: () => void;
  onPaymentSuccess: () => void;
  onContinueLater: () => void;
  medicineName?: string;
}

export const MedicareVerification: React.FC<MedicareVerificationProps> = ({
  onBack,
  onPaymentSuccess,
  onContinueLater,
  medicineName = 'Paracetamol 500 mg',
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'gpay'>('upi');

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);
      localDb.recordPayment(medicineName, 1);
      onPaymentSuccess();
    }, 1200);
  };

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
      {/* Top Header */}
      <div>
        <div
          role="status"
          style={{
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            padding: '10px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          Demo only: no payment is collected and no pharmacist is contacted.
        </div>
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

        {/* Center Shield Icon & Titles */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
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
              margin: '0 auto 20px auto',
              border: '2px solid #BFDBFE',
            }}
          >
            <Shield size={44} strokeWidth={2.2} />
          </div>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px 0',
            }}
          >
            Verification Required
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.45,
              maxWidth: '300px',
              margin: '0 auto',
            }}
          >
            Some information needs pharmacist verification for patient safety.
          </p>
        </div>
      </div>

      {/* Main ₹1 Unlock Box (As shown in Poster Screen 7) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '2px solid #93C5FD',
          borderRadius: '24px',
          padding: '24px 20px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
          margin: '20px 0',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1E40AF',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          <Sparkles size={14} />
          <span>Nominal Clinical Access Fee</span>
        </div>

        <h3
          style={{
            fontSize: '19px',
            fontWeight: 800,
            color: '#1E3A8A',
            margin: '0 0 8px 0',
            lineHeight: 1.35,
          }}
        >
          Demo: preview the ₹1 verification flow
        </h3>

        <p
          style={{
            fontSize: '13px',
            color: '#3B82F6',
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          This prototype does not verify dosage or contact a registered pharmacist.
        </p>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="medicare-btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            borderRadius: '9999px',
            boxShadow: '0 6px 18px rgba(29, 78, 216, 0.35)',
          }}
        >
          <span>Preview ₹1 payment</span>
        </button>

        <button
          type="button"
          onClick={onContinueLater}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          or Continue Later
        </button>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 24px 32px 24px',
              boxShadow: '0 -8px 25px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  Payment Preview (Not a Checkout)
                </h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>No charge will be made.</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#1E40AF' }}>₹1.00</div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'upi' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: selectedMethod === 'upi' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Smartphone size={20} color="#2563EB" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>UPI (GPay, PhonePe, Paytm)</span>
                </div>
                {selectedMethod === 'upi' && <Check size={18} color="#2563EB" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'card' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: selectedMethod === 'card' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CreditCard size={20} color="#64748B" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Debit / Credit Card</span>
                </div>
                {selectedMethod === 'card' && <Check size={18} color="#2563EB" />}
              </button>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="medicare-btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
            >
              {processing ? (
                <>
                  <ShieldCheck size={20} />
                  <span>Authorising ₹1 Payment...</span>
                </>
              ) : (
                <span>Record Demo Payment</span>
              )}
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '13px',
                marginTop: '8px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
