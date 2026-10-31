/**
 * ConfirmField Component
 * Strictly enforces Invariants S1 & S2:
 * Low-confidence fields are marked 'unclear' and block confirmation until user verifies/edits them!
 */

import React, { useState } from 'react';
import { AlertTriangle, Check, Edit2, RotateCcw } from 'lucide-react';

interface ConfirmFieldProps {
  label: string;
  value: string;
  isUnclear: boolean;
  unclearReason?: string;
  confidence: number;
  options?: string[]; // Quick choice options for minimal typing
  onValueChange: (newValue: string) => void;
}

export const ConfirmField: React.FC<ConfirmFieldProps> = ({
  label,
  value,
  isUnclear,
  unclearReason,
  confidence,
  options,
  onValueChange,
}) => {
  const [isEditing, setIsEditing] = useState(isUnclear);
  const [currentVal, setCurrentVal] = useState(value);
  const [hasBeenTouched, setHasBeenTouched] = useState(!isUnclear);

  const handleSelectOption = (opt: string) => {
    setCurrentVal(opt);
    setHasBeenTouched(true);
    onValueChange(opt);
    setIsEditing(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasBeenTouched(true);
    onValueChange(currentVal);
    setIsEditing(false);
  };

  const handleMarkVerifiedAsIs = () => {
    setHasBeenTouched(true);
    onValueChange(currentVal);
    setIsEditing(false);
  };

  const isStillUnclear = isUnclear && !hasBeenTouched;

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-panel)',
        backgroundColor: isStillUnclear ? 'var(--color-caution-tint)' : 'var(--color-surface)',
        border: `2px solid ${isStillUnclear ? 'var(--color-caution)' : 'var(--color-line-soft)'}`,
        marginBottom: '16px',
        transition: 'all var(--motion-quick)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <span className="type-label" style={{ color: isStillUnclear ? 'var(--color-caution)' : 'var(--color-quiet)' }}>
            {label}
          </span>
          {isStillUnclear && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-caution)',
                color: '#FFFFFF',
                fontSize: 'calc(13px * var(--font-scale))',
                fontWeight: 700,
              }}
            >
              <AlertTriangle size={14} />
              <span>PLEASE CHECK (S1)</span>
            </div>
          )}
        </div>

        <span style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
          Confidence: {Math.round(confidence * 100)}%
        </span>
      </div>

      {isStillUnclear && unclearReason && (
        <p
          style={{
            margin: '4px 0 12px 0',
            fontSize: 'calc(15px * var(--font-scale))',
            color: 'var(--color-caution)',
            fontWeight: 500,
          }}
        >
          {unclearReason}
        </p>
      )}

      {!isEditing ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            className="type-title"
            style={{
              color: 'var(--color-ink)',
              fontWeight: 700,
              fontSize: 'calc(24px * var(--font-scale))',
            }}
          >
            {currentVal || '(Empty)'}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${label}`}
              style={{
                minHeight: '44px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-field)',
                border: '1.5px solid var(--color-care)',
                color: 'var(--color-care)',
                backgroundColor: '#FFFFFF',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Edit2 size={16} />
              <span>Change</span>
            </button>

            {isStillUnclear && (
              <button
                type="button"
                onClick={handleMarkVerifiedAsIs}
                style={{
                  minHeight: '44px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-field)',
                  backgroundColor: 'var(--color-verified)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} />
                <span>Looks Correct</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '8px' }}>
          {/* Quick Choice Buttons for Zero-Typing / Elderly Ease */}
          {options && options.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    minHeight: '52px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-field)',
                    backgroundColor: currentVal === opt ? 'var(--color-care)' : 'var(--color-paper)',
                    color: currentVal === opt ? '#FFFFFF' : 'var(--color-ink)',
                    border: `2px solid ${currentVal === opt ? 'var(--color-care)' : 'var(--color-line-strong)'}`,
                    fontWeight: 600,
                    fontSize: 'calc(18px * var(--font-scale))',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Form input fallback */}
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={currentVal}
              onChange={(e) => setCurrentVal(e.target.value)}
              aria-label={label}
              style={{
                flex: 1,
                minHeight: 'var(--target-min)',
                padding: '8px 16px',
                fontSize: 'calc(20px * var(--font-scale))',
                borderRadius: 'var(--radius-field)',
                border: '2px solid var(--color-care)',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-ink)',
              }}
            />
            <button
              type="submit"
              style={{
                minHeight: 'var(--target-min)',
                padding: '0 20px',
                backgroundColor: 'var(--color-care)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-field)',
                fontWeight: 600,
                fontSize: 'calc(18px * var(--font-scale))',
              }}
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
