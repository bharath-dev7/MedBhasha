/**
 * ExpiryBadge Component
 * Implements ref/04-design-system.md Section 3.10 & S3 (Unknown stays unknown)
 */

import React from 'react';
import { StatusPill } from './StatusPill';
import { ExpStatus } from '../../../shared/contracts';

interface ExpiryBadgeProps {
  expDate?: string;
  mfgDate?: string;
  status: ExpStatus;
  onScanAgain?: () => void;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({
  expDate,
  mfgDate,
  status,
  onScanAgain,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 'var(--radius-field)',
        backgroundColor:
          status === 'expired'
            ? 'var(--color-danger-tint)'
            : status === 'near_expiry'
            ? 'var(--color-caution-tint)'
            : 'var(--color-paper)',
        border: `1.5px solid ${
          status === 'expired'
            ? 'var(--color-danger)'
            : status === 'near_expiry'
            ? 'var(--color-caution)'
            : 'var(--color-line-soft)'
        }`,
      }}
    >
      <div>
        <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
          గడువు తేదీ (Expiry Date)
        </div>
        <div
          className="type-title"
          style={{
            fontSize: 'calc(20px * var(--font-scale))',
            color: status === 'expired' ? 'var(--color-danger)' : 'var(--color-ink)',
            fontWeight: 700,
          }}
        >
          {status === 'unknown' ? 'తెలియదు (Unknown)' : expDate || 'Not specified'}
        </div>
        {mfgDate && (
          <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--color-quiet)' }}>
            MFG: {mfgDate}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
        <StatusPill
          status={
            status === 'expired'
              ? 'expired'
              : status === 'near_expiry'
              ? 'near_expiry'
              : status === 'unknown'
              ? 'unknown_expiry'
              : 'verified'
          }
        />
        {status === 'unknown' && onScanAgain && (
          <button
            onClick={onScanAgain}
            style={{
              fontSize: 'calc(14px * var(--font-scale))',
              color: 'var(--color-care)',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            మళ్ళీ స్కాన్ చేయండి (Scan again)
          </button>
        )}
      </div>
    </div>
  );
};
