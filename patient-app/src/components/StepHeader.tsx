/**
 * StepHeader Component
 * Implements ref/04-design-system.md Section 3.9
 * Numbered steps ("Step X of Y") with progress bar and back button.
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  onBack,
}) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          aria-label="Go back to previous step"
          style={{
            minWidth: 'var(--target-min)',
            minHeight: 'var(--target-min)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-line-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-ink)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: 'calc(15px * var(--font-scale))',
              color: 'var(--color-quiet)',
              fontWeight: 600,
            }}
          >
            దశ {currentStep} / {totalSteps} (Step {currentStep} of {totalSteps})
          </span>
          <h2
            className="type-title"
            style={{
              margin: '2px 0 0 0',
              fontSize: 'calc(24px * var(--font-scale))',
              color: 'var(--color-ink)',
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Visual Step Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--color-line-soft)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--color-care)',
            borderRadius: 'var(--radius-pill)',
            transition: 'width var(--motion-base)',
          }}
        />
      </div>
    </div>
  );
};
