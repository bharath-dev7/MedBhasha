/**
 * S06 Expiry Confirm Screen
 * Strictly enforces Invariants S3 (Unknown stays unknown) & S6 (Expired warning blocks activation)
 */

import React, { useState } from 'react';
import { AlertTriangle, Check, RefreshCw, Edit2 } from 'lucide-react';
import { StepHeader } from '../components/StepHeader';
import { ActionButton } from '../components/ActionButton';
import { ExpiryBadge } from '../components/ExpiryBadge';
import { StatusPill } from '../components/StatusPill';
import { SampleStripScenario } from '../../../shared/sample-data';
import { ExpStatus } from '../../../shared/contracts';
import { uxCopyEn, uxCopyTe } from '../../../shared/ux-copy';

interface S06ExpiryConfirmProps {
  strip: SampleStripScenario;
  onBack: () => void;
  onScanAgain: () => void;
  onConfirmed: (expRecord: { expDate: string; mfgDate: string; status: ExpStatus }) => void;
}

export const S06_ExpiryConfirm: React.FC<S06ExpiryConfirmProps> = ({
  strip,
  onBack,
  onScanAgain,
  onConfirmed,
}) => {
  const [expDate, setExpDate] = useState(strip.expDate);
  const [mfgDate, setMfgDate] = useState(strip.mfgDate);
  const [status, setStatus] = useState<ExpStatus>(strip.expStatus);
  const [expiredAckChecked, setExpiredAckChecked] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);

  const isExpired = status === 'expired';
  const isUnknown = status === 'unknown';

  const handleManualDateChange = (val: string) => {
    setExpDate(val);
    if (!val) {
      setStatus('unknown');
    } else if (val < '2026-10') {
      setStatus('expired');
    } else if (val <= '2026-12') {
      setStatus('near_expiry');
    } else {
      setStatus('valid');
    }
  };

  const handleConfirm = () => {
    onConfirmed({
      expDate,
      mfgDate,
      status,
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-paper)',
        padding: '16px 16px 80px 16px',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <StepHeader
        currentStep={3}
        totalSteps={5}
        title="గడువు తేదీని తనిఖీ చేయండి (Expiry Check)"
        onBack={onBack}
      />

      {/* Strip Name & Crop Details */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          padding: '20px',
          border: '1.5px solid var(--color-line-soft)',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontSize: 'calc(14px * var(--font-scale))',
            color: 'var(--color-quiet)',
            fontWeight: 600,
          }}
        >
          స్కాన్ చేసిన పట్టీ (Scanned Strip)
        </span>
        <h3
          className="type-title"
          style={{
            margin: '4px 0 12px 0',
            fontSize: 'calc(24px * var(--font-scale))',
            color: 'var(--color-ink)',
          }}
        >
          {strip.medicineName}
        </h3>

        <div
          style={{
            backgroundColor: 'var(--color-paper)',
            padding: '12px',
            borderRadius: 'var(--radius-field)',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: 'var(--color-ink)',
            border: '1px solid var(--color-line-soft)',
            marginBottom: '16px',
          }}
        >
          {strip.rawText}
        </div>

        {/* Expiry Badge Component */}
        <ExpiryBadge
          expDate={expDate}
          mfgDate={mfgDate}
          status={status}
          onScanAgain={onScanAgain}
        />
      </div>

      {/* S3 Invariant Warning: UNKNOWN */}
      {isUnknown && (
        <div
          role="alert"
          style={{
            backgroundColor: '#ECEFF1',
            border: '2px solid var(--color-line-strong)',
            borderRadius: 'var(--radius-panel)',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <strong style={{ color: 'var(--color-ink)', fontSize: 'calc(18px * var(--font-scale))' }}>
            {uxCopyTe['expiry.unknown.title']} (Expiry Date Not Found)
          </strong>
          <p
            className="type-body"
            style={{ margin: '6px 0 12px 0', fontSize: 'calc(16px * var(--font-scale))' }}
          >
            {uxCopyTe['expiry.unknown.body']}
          </p>

          <div
            style={{
              fontSize: 'calc(14px * var(--font-scale))',
              color: 'var(--color-quiet)',
              fontWeight: 600,
            }}
          >
            🔒 Invariant S3: Unknown stays unknown. We never guess or infer expiry dates.
          </div>
        </div>
      )}

      {/* S6 Invariant Warning: EXPIRED */}
      {isExpired && (
        <div
          role="alert"
          style={{
            backgroundColor: 'var(--color-danger-tint)',
            border: '2.5px solid var(--color-danger)',
            borderRadius: 'var(--radius-panel)',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-danger)', marginBottom: '8px' }}>
            <AlertTriangle size={28} />
            <strong style={{ fontSize: 'calc(20px * var(--font-scale))' }}>
              {uxCopyTe['expiry.expired.title']} (Medicine Expired!)
            </strong>
          </div>

          <p
            className="type-body"
            style={{
              margin: '0 0 16px 0',
              color: 'var(--color-danger)',
              fontWeight: 700,
              fontSize: 'calc(18px * var(--font-scale))',
            }}
          >
            {uxCopyTe['expiry.expired.body'].replace('{date}', expDate)}
          </p>

          {/* Explicit Acknowledgement Checkbox Required to bypass block */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: '#FFFFFF',
              padding: '12px',
              borderRadius: 'var(--radius-field)',
              border: '1.5px solid var(--color-danger)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={expiredAckChecked}
              onChange={(e) => setExpiredAckChecked(e.target.checked)}
              style={{ width: '24px', height: '24px', marginTop: '2px' }}
            />
            <span
              style={{
                fontSize: 'calc(16px * var(--font-scale))',
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              {uxCopyTe['expiry.expired.ack']} (I understand the risks. Keep reminders anyway).
            </span>
          </label>
        </div>
      )}

      {/* Manual Date Entry Toggle */}
      {!isEditingManually ? (
        <button
          onClick={() => setIsEditingManually(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-care)',
            fontSize: 'calc(16px * var(--font-scale))',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          <Edit2 size={16} />
          <span>తేదీని చేతితో సరిచేయండి (Edit Date Manually)</span>
        </button>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px',
            borderRadius: 'var(--radius-field)',
            border: '2px solid var(--color-care)',
            marginBottom: '24px',
          }}
        >
          <label style={{ display: 'block', fontSize: 'calc(15px * var(--font-scale))', color: 'var(--color-quiet)', marginBottom: '6px' }}>
            Enter Expiry (YYYY-MM):
          </label>
          <input
            type="text"
            placeholder="e.g. 2027-12"
            value={expDate}
            onChange={(e) => handleManualDateChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: 'var(--target-min)',
              padding: '8px 12px',
              fontSize: 'calc(20px * var(--font-scale))',
              borderRadius: 'var(--radius-field)',
              border: '1px solid var(--color-line-strong)',
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isUnknown ? (
          <>
            <ActionButton
              variant="primary"
              onClick={onScanAgain}
              icon={<RefreshCw size={24} />}
            >
              మళ్ళీ స్కాన్ చేయండి (Scan Again)
            </ActionButton>

            <ActionButton
              variant="secondary"
              onClick={handleConfirm}
            >
              తేదీ లేకుండానే కొనసాగించండి (Continue with Unknown Expiry)
            </ActionButton>
          </>
        ) : (
          <ActionButton
            variant="primary"
            disabled={isExpired && !expiredAckChecked}
            disabledReason={
              isExpired && !expiredAckChecked
                ? 'గడువు ముగిసిన మందుకు అంగీకార చెక్‌బాక్స్ తప్పనిసరి (Must acknowledge expired warning per safety rules)'
                : undefined
            }
            onClick={handleConfirm}
            icon={<Check size={26} />}
          >
            తేదీని ధృవీకరించండి (Confirm Date & Proceed)
          </ActionButton>
        )}
      </div>
    </div>
  );
};
