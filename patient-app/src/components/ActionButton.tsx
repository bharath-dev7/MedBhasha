/**
 * ActionButton Component
 * Compliant with ref/04-design-system.md Section 3.1
 * Enforces minimum 56dp target, 72dp for primary actions.
 */

import React from 'react';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'quiet';
  disabledReason?: string;
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  disabledReason,
  loading = false,
  children,
  icon,
  disabled,
  style,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const minHeight = isPrimary ? 'var(--target-primary)' : 'var(--target-min)';

  let bg = 'var(--color-care)';
  let color = '#FFFFFF';
  let border = 'none';

  if (variant === 'secondary') {
    bg = 'var(--color-surface)';
    color = 'var(--color-care)';
    border = '2px solid var(--color-care)';
  } else if (variant === 'danger') {
    bg = 'var(--color-danger)';
    color = '#FFFFFF';
  } else if (variant === 'quiet') {
    bg = 'transparent';
    color = 'var(--color-quiet)';
  }

  const isDisabled = disabled || loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px' }}>
      <button
        disabled={isDisabled}
        aria-disabled={isDisabled}
        style={{
          minHeight,
          minWidth: 'var(--target-min)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-action)',
          backgroundColor: isDisabled ? (variant === 'quiet' ? 'transparent' : 'var(--color-line-soft)') : bg,
          color: isDisabled ? 'var(--color-quiet)' : color,
          border: isDisabled ? '2px solid var(--color-line-soft)' : border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: 'calc(20px * var(--font-scale))',
          fontWeight: 600,
          opacity: isDisabled ? 0.75 : 1,
          transition: 'all var(--motion-quick)',
          boxShadow: isPrimary && !isDisabled ? '0 4px 12px rgba(11, 110, 110, 0.25)' : 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </button>

      {/* Accessible Disabled Reason text if blocked */}
      {isDisabled && disabledReason && (
        <span
          role="alert"
          style={{
            fontSize: 'calc(16px * var(--font-scale))',
            color: 'var(--color-caution)',
            fontWeight: 500,
            textAlign: 'center',
            padding: '2px 8px',
          }}
        >
          {disabledReason}
        </span>
      )}
    </div>
  );
};
