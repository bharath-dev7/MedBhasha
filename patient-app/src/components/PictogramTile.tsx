/**
 * PictogramTile Component
 * Implements ref/04-design-system.md Section 3.8
 * Visual iconography for elderly and low-literacy clarity (Sun, Moon, Food, Pill forms)
 */

import React from 'react';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Coffee,
  Pill,
  Droplets,
  Wine,
} from 'lucide-react';

export type PictogramType =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'before_food'
  | 'after_food'
  | 'with_food'
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'drops';

interface PictogramTileProps {
  type: PictogramType;
  label?: string;
  size?: number;
  highlight?: boolean;
}

export const PictogramTile: React.FC<PictogramTileProps> = ({
  type,
  label,
  size = 40,
  highlight = false,
}) => {
  let icon = <Sun size={size} />;
  let defaultLabel = 'Day';
  let bg = 'var(--color-paper)';
  let color = 'var(--color-care)';

  switch (type) {
    case 'morning':
      icon = <Sunrise size={size} />;
      defaultLabel = 'Morning (ఉదయం)';
      color = '#D97706'; // Amber sunrise
      bg = '#FEF3C7';
      break;
    case 'afternoon':
      icon = <Sun size={size} />;
      defaultLabel = 'Afternoon (మధ్యాహ్నం)';
      color = '#EA580C'; // Bright sun
      bg = '#FFEDD5';
      break;
    case 'evening':
      icon = <Sunset size={size} />;
      defaultLabel = 'Evening (సాయంత్రం)';
      color = '#C026D3'; // Purple sunset
      bg = '#FAE8FF';
      break;
    case 'night':
      icon = <Moon size={size} />;
      defaultLabel = 'Night (రాత్రి)';
      color = '#4338CA'; // Deep indigo
      bg = '#E0E7FF';
      break;
    case 'after_food':
      icon = <Utensils size={size} />;
      defaultLabel = 'After Food (భోజనం తర్వాత)';
      color = 'var(--color-verified)';
      bg = 'var(--color-verified-tint)';
      break;
    case 'before_food':
      icon = <Coffee size={size} />;
      defaultLabel = 'Before Food (భోజనం ముందు)';
      color = 'var(--color-care)';
      bg = 'var(--color-care-tint)';
      break;
    case 'with_food':
      icon = <Utensils size={size} />;
      defaultLabel = 'With Food (భోజనంతో పాటు)';
      color = 'var(--color-caution)';
      bg = 'var(--color-caution-tint)';
      break;
    case 'tablet':
      icon = <Pill size={size} />;
      defaultLabel = 'Tablet (మాత్ర)';
      color = 'var(--color-care)';
      bg = 'var(--color-care-tint)';
      break;
    case 'capsule':
      icon = <Pill size={size} style={{ transform: 'rotate(45deg)' }} />;
      defaultLabel = 'Capsule (క్యాప్సూల్)';
      color = '#0284C7';
      bg = '#E0F2FE';
      break;
    case 'syrup':
      icon = <Wine size={size} />;
      defaultLabel = 'Syrup (సిరప్)';
      color = '#D97706';
      bg = '#FEF3C7';
      break;
    case 'drops':
      icon = <Droplets size={size} />;
      defaultLabel = 'Drops (చుక్కలు)';
      color = '#0284C7';
      bg = '#E0F2FE';
      break;
  }

  const finalLabel = label || defaultLabel;

  return (
    <div
      role="img"
      aria-label={finalLabel}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        borderRadius: 'var(--radius-panel)',
        backgroundColor: bg,
        color: color,
        border: highlight ? `2.5px solid ${color}` : '1.5px solid var(--color-line-soft)',
        minWidth: '68px',
        minHeight: '68px',
        boxShadow: highlight ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span
        style={{
          marginTop: '6px',
          fontSize: 'calc(13px * var(--font-scale))',
          fontWeight: 700,
          textAlign: 'center',
          color: 'var(--color-ink)',
          lineHeight: 1.2,
        }}
      >
        {finalLabel}
      </span>
    </div>
  );
};
