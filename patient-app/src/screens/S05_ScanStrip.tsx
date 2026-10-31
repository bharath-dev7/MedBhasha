/**
 * S05 Scan Strip or Carton Screen
 * Implements ref/05-screen-specs.md S05 & S06
 * Guides user to capture strip expiry dates, with sample strips for all edge cases.
 */

import React, { useState } from 'react';
import { Camera, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { StepHeader } from '../components/StepHeader';
import { sampleStrips, SampleStripScenario } from '../../../shared/sample-data';

interface S05ScanStripProps {
  onBack: () => void;
  onStripCaptured: (strip: SampleStripScenario) => void;
  onSkip: () => void;
}

export const S05_ScanStrip: React.FC<S05ScanStripProps> = ({
  onBack,
  onStripCaptured,
  onSkip,
}) => {
  const [selectedStrip, setSelectedStrip] = useState<SampleStripScenario>(sampleStrips[0]);

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
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
            మందుల పట్టీ స్కాన్ (Strip / Carton Scan)
          </span>
          <div style={{ width: '48px' }} />
        </div>

        {/* Viewfinder simulation */}
        <div
          style={{
            position: 'relative',
            height: '240px',
            border: '3px dashed var(--color-care)',
            borderRadius: 'var(--radius-panel)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#112A3A',
              padding: '16px',
              borderRadius: 'var(--radius-field)',
              fontWeight: 700,
              fontSize: '15px',
              fontFamily: 'monospace',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              textAlign: 'center',
            }}
          >
            {selectedStrip.rawText}
          </div>
          <span style={{ marginTop: '12px', fontSize: 'calc(14px * var(--font-scale))', color: 'rgba(255,255,255,0.8)' }}>
            గడువు తేదీ (EXP) కనిపించేలా ఉంచండి (Focus on printed EXP date)
          </span>
        </div>

        {/* Strip Scenarios Selector */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>
            Select Test Medicine Strip:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sampleStrips.map((strip) => (
              <button
                key={strip.id}
                onClick={() => setSelectedStrip(strip)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-field)',
                  backgroundColor: selectedStrip.id === strip.id ? 'var(--color-care)' : 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  border: selectedStrip.id === strip.id ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: 'calc(15px * var(--font-scale))' }}>{strip.medicineName}</strong>
                  <div style={{ fontSize: 'calc(13px * var(--font-scale))', opacity: 0.85 }}>
                    {strip.notes}
                  </div>
                </div>
                {selectedStrip.id === strip.id && <Check size={20} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shutter and Skip */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => onStripCaptured(selectedStrip)}
          aria-label="Capture Strip"
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
          }}
        >
          <Camera size={34} color="var(--color-care)" />
        </button>

        <button
          onClick={onSkip}
          style={{
            color: 'rgba(255,255,255,0.8)',
            textDecoration: 'underline',
            fontSize: 'calc(16px * var(--font-scale))',
          }}
        >
          తేదీని నేనే నమోదు చేస్తాను (Enter date myself / Skip)
        </button>
      </div>
    </div>
  );
};
