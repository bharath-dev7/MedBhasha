import React, { useState } from 'react';
import { ArrowLeft, Camera, RefreshCw, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { SamplePrescriptionScenario, sampleScenarios } from '../../../../shared/sample-data';

interface MedicareScanPrescriptionProps {
  onBack: () => void;
  onExtracted: (scenario: SamplePrescriptionScenario) => void;
}

export const MedicareScanPrescription: React.FC<MedicareScanPrescriptionProps> = ({
  onBack,
  onExtracted,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [scanning, setScanning] = useState(false);

  const scenario = sampleScenarios[selectedScenarioIndex];

  const handleCapture = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onExtracted(scenario);
    }, 1200);
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
      {/* Top Bar - Clean White tone matching Poster */}
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
          Scan Prescription
        </h2>
        <div style={{ width: '40px' }} />
      </div>

      {/* Camera Viewfinder Area */}
      <div
        style={{
          flex: 1,
          margin: '16px 20px',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Prescription Paper Mockup */}
        <div
          style={{
            width: '85%',
            height: '82%',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '18px',
            color: '#1E293B',
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #E2E8F0',
          }}
        >
          {/* Prescription Header */}
          <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: '13px', color: '#1E40AF' }}>
                City Care Clinic
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Date: 12/04/2026</span>
            </div>
            <div style={{ fontSize: '11px', color: '#475569' }}>
              Dr. R. Sharma, M.D. • Reg: 45892
            </div>
          </div>

          {/* Rx Symbol & Simulated Handwriting */}
          <div style={{ flex: 1, padding: '12px 0', position: 'relative' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#2563EB',
                fontFamily: 'serif',
                lineHeight: 1,
                marginBottom: '10px',
              }}
            >
              ℞
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ borderBottom: '1px dashed #CBD5E1', paddingBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>1. Paracetamol 500mg</span>
                <span style={{ fontSize: '12px', color: '#475569', marginLeft: '6px' }}>
                  1 tab BD x 5 days
                </span>
              </div>
              <div style={{ borderBottom: '1px dashed #CBD5E1', paddingBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>2. Amoxicillin 500mg</span>
                <span style={{ fontSize: '12px', color: '#475569', marginLeft: '6px' }}>
                  1 cap TID x 7 days
                </span>
              </div>
              <div style={{ borderBottom: '1px dashed #CBD5E1', paddingBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>3. Pantoprazole 40mg</span>
                <span style={{ fontSize: '12px', color: '#475569', marginLeft: '6px' }}>
                  1 tab OD before food
                </span>
              </div>
            </div>
          </div>

          {/* Prescription Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '6px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Patient: Adult</span>
            <span style={{ fontSize: '11px', fontStyle: 'italic', fontWeight: 600, color: '#334155' }}>
              Sign: R. Sharma
            </span>
          </div>

          {/* Scanning Laser Animation */}
          {scanning && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#2563EB',
                boxShadow: '0 0 12px #2563EB, 0 0 20px #60A5FA',
                animation: 'scanMove 1.2s infinite ease-in-out',
              }}
            />
          )}
        </div>

        {/* Viewfinder Corner Framing Accents */}
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            pointerEvents: 'none',
            border: '2px dashed rgba(37, 99, 235, 0.3)',
            borderRadius: '16px',
          }}
        />
      </div>

      {/* Preset Prescription Selectors */}
      <div style={{ padding: '8px 20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {sampleScenarios.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenarioIndex(i)}
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
            {sc.doctor ? sc.doctor.split(' ')[1] : `Sample ${i + 1}`}
          </button>
        ))}
      </div>

      {/* Shutter Button ("Tap to capture" - Poster Screen 5 Tone) */}
      <div
        style={{
          padding: '12px 20px 28px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          onClick={handleCapture}
          disabled={scanning}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '4px solid #1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
            transition: 'transform 0.1s ease',
          }}
        >
          {scanning ? (
            <RefreshCw className="animate-spin" size={26} color="#1976D2" />
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#1976D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={26} color="#FFFFFF" />
            </div>
          )}
        </button>

        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
          {scanning ? 'Extracting text via AI OCR...' : 'Tap to capture'}
        </span>
      </div>
    </div>
  );
};
