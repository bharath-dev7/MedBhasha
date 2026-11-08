import React from 'react';

interface MedicareLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
}

export const MedicareLogo: React.FC<MedicareLogoProps> = ({
  size = 64,
  showText = false,
  textSize = 28,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Heart background with medical blue fill */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 88C50 88 12 62 12 34C12 20 22 10 35 10C42 10 47 14 50 18C53 14 58 10 65 10C78 10 88 20 88 34C88 62 50 88 50 88Z"
            fill="url(#blueGrad)"
          />
          {/* Medical Cross '+' inside heart */}
          <rect x="44" y="24" width="12" height="34" rx="4" fill="#FFFFFF" />
          <rect x="33" y="35" width="34" height="12" rx="4" fill="#FFFFFF" />
          <defs>
            <linearGradient id="blueGrad" x1="12" y1="10" x2="88" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E88E5" />
              <stop offset="1" stopColor="#0D47A1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: textSize,
              fontWeight: 900,
              letterSpacing: '1px',
              color: '#0D47A1',
              lineHeight: 1.1,
            }}
          >
            MEDICARE
          </div>
          <div
            style={{
              fontSize: Math.max(12, textSize * 0.45),
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#1976D2',
              marginTop: '2px',
            }}
          >
            Smart Medicine. Safe Life.
          </div>
        </div>
      )}
    </div>
  );
};

