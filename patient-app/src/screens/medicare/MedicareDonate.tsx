import React, { useState } from 'react';
import { ArrowLeft, HeartHandshake, CheckCircle2, ShieldCheck, MapPin, Building2, AlertCircle } from 'lucide-react';
import { localDb } from '../../db/localStore';

interface MedicareDonateProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export const MedicareDonate: React.FC<MedicareDonateProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [medicineName, setMedicineName] = useState('Paracetamol 500 mg (Unopened strip)');
  const [quantity, setQuantity] = useState('2 Strips (20 Tablets)');
  const [selectedCentre, setSelectedCentre] = useState('Indian Red Cross Society - Medical Bank');

  const centres = [
    {
      name: 'Indian Red Cross Society - Medical Bank',
      address: 'Central District Hospital Road',
      distance: '1.2 km away',
    },
    {
      name: 'Pradhan Mantri Bharatiya Janaushadhi Pariyojana',
      address: 'Community Health Centre Block B',
      distance: '2.5 km away',
    },
    {
      name: 'Seva Trust Authorized Medicine Collection Unit',
      address: 'Gandhi Memorial Care Centre',
      distance: '3.8 km away',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localDb.addDonation(medicineName, quantity, selectedCentre);
    setStep('success');
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

        {step === 'info' && (
          <div style={{ textAlign: 'center' }}>
            {/* Heart in Hands Icon */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                border: '2px solid #BFDBFE',
              }}
            >
              <HeartHandshake size={44} strokeWidth={2} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
              Donate Unused Medicines
            </h2>

            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Help others by donating unused medicines to authorised centres.
            </p>

            {/* Donation Safety & Eligibility Rules */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '18px',
                padding: '18px',
                border: '1px solid #E2E8F0',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '13px',
                color: '#334155',
              }}
            >
              <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#16A34A" />
                <span>Eligibility Criteria (Indian FDA &amp; CDSCO Guidelines):</span>
              </div>
              <div>✓ Must be in original, sealed blister/foil packaging or bottle</div>
              <div>✓ Expiry date must have at least 6 months remaining</div>
              <div>✓ Must have been stored under manufacturer temperature instructions</div>
              <div style={{ color: '#DC2626' }}>✗ No opened bottles, damaged strips, or expired meds accepted</div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>
              Donation Details
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Medicine Description
                </label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Quantity
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Select Authorized Collection Centre
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {centres.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => setSelectedCentre(c.name)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: selectedCentre === c.name ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: selectedCentre === c.name ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        {c.address} • <strong>{c.distance}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="medicare-btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '10px' }}
              >
                Submit Donation
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#166534', margin: '0 0 8px 0' }}>
              Thank You for Donating!
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.45, maxWidth: '280px', margin: '0 auto 20px auto' }}>
              Your donation request has been registered. You can drop off the sealed package at{' '}
              <strong>{selectedCentre}</strong>.
            </p>

            <button
              onClick={() => {
                setStep('info');
                onBack();
              }}
              className="medicare-btn-primary"
              style={{ margin: '0 auto', padding: '14px 28px' }}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {step === 'info' && (
        <div style={{ paddingTop: '20px' }}>
          <button
            onClick={() => setStep('form')}
            className="medicare-btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
          >
            <span>Donate Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

