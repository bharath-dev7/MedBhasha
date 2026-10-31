/**
 * S03 Scan Prescription Screen
 * Implements ref/05-screen-specs.md S03 & S12
 * Camera framing, quality hints, sample selector, and Cloud Consent sheet.
 */

import React, { useState } from 'react';
import { Camera, Image, AlertCircle, ArrowLeft, Flashlight, Check, Info } from 'lucide-react';
import { ActionButton } from '../components/ActionButton';
import { samplePrescriptions, SamplePrescriptionScenario } from '../../../shared/sample-data';
import { localDb } from '../db/localStore';

interface S03ScanPrescriptionProps {
  onBack: () => void;
  onExtracted: (scenario: SamplePrescriptionScenario) => void;
}

export const S03_ScanPrescription: React.FC<S03ScanPrescriptionProps> = ({
  onBack,
  onExtracted,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<SamplePrescriptionScenario>(samplePrescriptions[1]); // default to low-confidence S1 sample
  const [showCloudConsent, setShowCloudConsent] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const isOffline = localDb.getState().settings.offlineMode;

  const handleCapture = () => {
    // If handwritten scenario, check cloud consent per S12
    if (selectedScenario.hasUnclearFields && !isOffline) {
      setShowCloudConsent(true);
    } else {
      onExtracted(selectedScenario);
    }
  };

  const handleConsentApproved = () => {
    setShowCloudConsent(false);
    onExtracted(selectedScenario);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <span style={{ fontSize: 'calc(18px * var(--font-scale))', fontWeight: 600 }}>
          ప్రిస్క్రిప్షన్ స్కాన్ (Scan Prescription)
        </span>

        <button
          onClick={() => setFlashOn(!flashOn)}
          aria-label="Toggle Flash"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: flashOn ? 'var(--color-care)' : 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <Flashlight size={22} />
        </button>
      </div>

      {/* Offline Notice Banner if in Airplane mode */}
      {isOffline && (
        <div
          style={{
            backgroundColor: 'rgba(179, 92, 0, 0.9)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-field)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '12px 0',
          }}
        >
          <AlertCircle size={22} color="#FFFFFF" />
          <span style={{ fontSize: 'calc(14px * var(--font-scale))' }}>
            ఆఫ్‌లైన్: ముద్రిత అక్షరాలను మాత్రమే చదవగలము (Offline: On-device OCR for printed text).
          </span>
        </div>
      )}

      {/* Camera Viewfinder & Framing Box */}
      <div
        style={{
          position: 'relative',
          height: '360px',
          border: '3px dashed rgba(255, 255, 255, 0.6)',
          borderRadius: 'var(--radius-panel)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Simulated Document Preview */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            color: '#112A3A',
            borderRadius: 'var(--radius-field)',
            padding: '16px',
            width: '90%',
            height: '80%',
            overflowY: 'auto',
            textAlign: 'left',
            fontFamily: 'monospace',
            fontSize: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            border: '2px solid var(--color-line-strong)',
          }}
        >
          <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold' }}>
            {selectedScenario.clinic} • {selectedScenario.doctor}
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
            {selectedScenario.rawOcrText}
          </pre>
        </div>

        {/* Quality guidance overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 'calc(13px * var(--font-scale))',
            color: '#FFFFFF',
          }}
        >
          కాగితాన్ని సమానంగా పట్టుకోండి (Hold flat inside frame)
        </div>
      </div>

      {/* Scenario Picker for Demo Evaluation */}
      <div style={{ margin: '16px 0' }}>
        <span style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>
          Select Test Prescription Scenario:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {samplePrescriptions.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-field)',
                backgroundColor: selectedScenario.id === scenario.id ? 'var(--color-care)' : 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                textAlign: 'left',
                border: selectedScenario.id === scenario.id ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: 'calc(15px * var(--font-scale))' }}>{scenario.title}</strong>
                <div style={{ fontSize: 'calc(12px * var(--font-scale))', opacity: 0.8 }}>
                  {scenario.hasUnclearFields ? '⚠️ Tests S1: Low-confidence unclear fields' : '✅ Clear printed Rx'}
                </div>
              </div>
              {selectedScenario.id === scenario.id && <Check size={20} />}
            </button>
          ))}
        </div>
      </div>

      {/* Big Shutter Button (72dp primary target per ref/04-design-system.md) */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <button
          onClick={handleCapture}
          aria-label="Capture prescription photo"
          style={{
            width: 'var(--target-primary)',
            height: 'var(--target-primary)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: '#FFFFFF',
            border: '6px solid var(--color-care)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255,255,255,0.4)',
          }}
        >
          <Camera size={34} color="var(--color-care)" />
        </button>
      </div>

      {/* Cloud Consent Sheet Modal (S12 Privacy by default) */}
      {showCloudConsent && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-ink)',
              borderRadius: 'var(--radius-panel)',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              border: '2px solid var(--color-line-strong)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: 'var(--color-care)' }}>
              <Info size={28} />
              <h2 className="type-title" style={{ margin: 0, fontSize: 'calc(22px * var(--font-scale))' }}>
                ఈ ఫోటోను పంపాలా? (Send this photo to read?)
              </h2>
            </div>

            <p className="type-body" style={{ margin: '0 0 16px 0' }}>
              చేతిరాతను స్పష్టంగా చదవడానికి ఈ ఫోటోను ఇంటర్నెట్ ద్వారా తనిఖీ చేయవలసి ఉంటుంది. ఇది ఎవరితోనూ పంచుకోబడదు.
              (Photo will be securely processed to read handwriting. It is never shared with third parties).
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-paper)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-field)',
                fontSize: 'calc(14px * var(--font-scale))',
                color: 'var(--color-quiet)',
                marginBottom: '20px',
              }}
            >
              🔒 <strong>Invariant S12:</strong> You can decline and still enter medicines manually.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ActionButton variant="primary" onClick={handleConsentApproved}>
                ఫోటో పంపండి (Send Photo)
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => setShowCloudConsent(false)}>
                పంపవద్దు - నేనే నమోదు చేస్తాను (Do not send)
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
