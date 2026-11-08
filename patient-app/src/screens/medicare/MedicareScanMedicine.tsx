import React, { useState } from 'react';
import { ArrowLeft, Check, QrCode, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { SampleStripScenario, sampleStripScenarios } from '../../../../shared/sample-data';

interface MedicareScanMedicineProps {
  onBack: () => void;
  onConfirm: (data: {
    medicineName: string;
    mfgDate: string;
    expDate: string;
    batchNo: string;
    isSuspicious?: boolean;
  }) => void;
}

export const MedicareScanMedicine: React.FC<MedicareScanMedicineProps> = ({
  onBack,
  onConfirm,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const [extractedData, setExtractedData] = useState({
    medicineName: 'Paracetamol 500 mg',
    mfgDate: '01/2025',
    expDate: '01/2027',
    batchNo: 'B12345',
    isSuspicious: false,
  });

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    const sc = sampleStripScenarios[index];
    setExtractedData({
      medicineName: sc.medicineName,
      mfgDate: sc.mfgDate || '01/2025',
      expDate: sc.expDate || '01/2027',
      batchNo: sc.batchNo || 'B12345',
      isSuspicious: sc.expStatus === 'expired' || index === 2,
    });
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
      }}
    >
      {/* Top Header - Clean White tone matching Poster */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#0F172A',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
          Scan Medicine
        </h2>
        <div style={{ width: '40px' }} />
      </div>

      {/* Viewfinder with Medicine Packaging & Barcode */}
      <div
        role="status"
        style={{
          margin: '12px 20px 0',
          padding: '10px 12px',
          borderRadius: '12px',
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          fontSize: '12px',
          fontWeight: 700,
        }}
      >
        Sample scan demo: package details and safety results are preset examples, not a live check.
      </div>
      <div
        style={{
          flex: 1,
          margin: '16px 20px',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Medicine Packaging Carton Visual (Poster Screen 6) */}
        <div
          style={{
            width: '92%',
            maxWidth: '280px',
            height: '170px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            color: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.12)',
            border: '2px solid #1976D2',
            position: 'relative',
          }}
        >
          {/* Packaging Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#1E40AF' }}>
                {extractedData.medicineName}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                IP / BP Standard Formulation
              </div>
            </div>

            {/* QR Code graphic */}
            <div
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#EFF6FF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #BFDBFE',
              }}
            >
              <QrCode size={30} color="#1E40AF" />
            </div>
          </div>

          {/* Packaging Details */}
          <div
            style={{
              backgroundColor: '#F1F5F9',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '11px',
              color: '#334155',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px',
            }}
          >
            <div>
              <span style={{ color: '#64748B' }}>Mfg:</span> {extractedData.mfgDate}
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Exp:</span>{' '}
              <strong style={{ color: '#DC2626' }}>{extractedData.expDate}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Batch:</span> {extractedData.batchNo}
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Qty:</span> 10 Tablets
            </div>
          </div>

          <div style={{ fontSize: '9px', color: '#94A3B8', textAlign: 'center' }}>
            Mfg Lic No: 28/UA/LL/SC/P-2021 • Keep in cool, dry place
          </div>

          {/* Barcode scanning line */}
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
            }}
          />
        </div>

        {/* Viewfinder Bounding Reticle */}
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            pointerEvents: 'none',
            border: '2px dashed rgba(25, 118, 210, 0.3)',
            borderRadius: '16px',
          }}
        />
      </div>

      {/* Preset Packaging Selectors */}
      <div style={{ padding: '6px 20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {sampleStripScenarios.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(i)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: selectedScenarioIndex === i ? '#1976D2' : '#F1F5F9',
              color: selectedScenarioIndex === i ? '#FFFFFF' : '#475569',
              border: selectedScenarioIndex === i ? 'none' : '1px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            {sc.medicineName.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Details Extracted Confirmation Sheet (Poster Screen 6 Layout) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '18px 24px 28px 24px',
          color: '#0F172A',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
          }}
        >
          <Check size={14} strokeWidth={3} />
          <span>Details Extracted</span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            {extractedData.medicineName}
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            Mfg: <strong>{extractedData.mfgDate}</strong> &nbsp;•&nbsp; Exp:{' '}
            <strong style={{ color: '#DC2626' }}>{extractedData.expDate}</strong>
          </div>
          <div style={{ fontSize: '13px', color: '#64748B' }}>
            Batch: <strong>{extractedData.batchNo}</strong>
          </div>
        </div>

        <button
          onClick={() => onConfirm(extractedData)}
          className="medicare-btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
        >
          <span>Confirm</span>
        </button>
      </div>
    </div>
  );
};
