/**
 * StatusPill Component
 * Strictly enforces Invariant S8: Icon + Word + Color. Never color alone!
 */

import React from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export type StatusValue =
  | 'taken'
  | 'missed'
  | 'postponed'
  | 'due'
  | 'pending'
  | 'skipped'
  | 'expired'
  | 'near_expiry'
  | 'unknown_expiry'
  | 'verified'
  | 'unverified'
  | 'in_review';

interface StatusPillProps {
  status: StatusValue;
  customLabel?: string;
  size?: 'normal' | 'large';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, customLabel, size = 'normal' }) => {
  let label = customLabel;
  let icon = <CheckCircle size={18} />;
  let color = 'var(--color-verified)';
  let bg = 'var(--color-verified-tint)';
  let border = 'var(--color-verified)';

  switch (status) {
    case 'taken':
      label = label || 'Taken';
      icon = <CheckCircle size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-verified)';
      bg = 'var(--color-verified-tint)';
      border = 'var(--color-verified)';
      break;
    case 'missed':
      label = label || 'Missed';
      icon = <XCircle size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-danger)';
      bg = 'var(--color-danger-tint)';
      border = 'var(--color-danger)';
      break;
    case 'postponed':
      label = label || 'Postponed';
      icon = <Clock size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-caution)';
      bg = 'var(--color-caution-tint)';
      border = 'var(--color-caution)';
      break;
    case 'due':
      label = label || 'Due now';
      icon = <AlertCircle size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-care)';
      bg = 'var(--color-care-tint)';
      border = 'var(--color-care)';
      break;
    case 'pending':
    case 'skipped':
      label = label || (status === 'pending' ? 'Pending' : 'Skipped');
      icon = <Clock size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-quiet)';
      bg = '#ECEFF1';
      border = 'var(--color-line-strong)';
      break;
    case 'expired':
      label = label || 'Expired';
      icon = <AlertTriangle size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-danger)';
      bg = 'var(--color-danger-tint)';
      border = 'var(--color-danger)';
      break;
    case 'near_expiry':
      label = label || 'Expires soon';
      icon = <Calendar size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-caution)';
      bg = 'var(--color-caution-tint)';
      border = 'var(--color-caution)';
      break;
    case 'unknown_expiry':
      label = label || 'Expiry unknown';
      icon = <HelpCircle size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-quiet)';
      bg = '#ECEFF1';
      border = 'var(--color-line-strong)';
      break;
    case 'verified':
      label = label || 'Verified';
      icon = <ShieldCheck size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-verified)';
      bg = 'var(--color-verified-tint)';
      border = 'var(--color-verified)';
      break;
    case 'unverified':
      label = label || 'Not verified';
      icon = <ShieldAlert size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-caution)';
      bg = 'var(--color-caution-tint)';
      border = 'var(--color-caution)';
      break;
    case 'in_review':
      label = label || 'In review';
      icon = <Clock size={size === 'large' ? 22 : 18} />;
      color = 'var(--color-quiet)';
      bg = '#ECEFF1';
      border = 'var(--color-line-strong)';
      break;
  }

  return (
    <span
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: size === 'large' ? '8px 16px' : '4px 12px',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: bg,
        color: color,
        border: `1.5px solid ${border}`,
        fontWeight: 600,
        fontSize: size === 'large' ? 'calc(18px * var(--font-scale))' : 'calc(16px * var(--font-scale))',
        lineHeight: 1.2,
      }}
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
};
