/**
 * DoseCard Component
 * Implements ref/04-design-system.md Section 3.5
 */

import React from 'react';
import { DoseEvent } from '../../../shared/contracts';
import { PictogramTile, PictogramType } from './PictogramTile';
import { StatusPill } from './StatusPill';
import { ActionButton } from './ActionButton';
import { Check, Clock, Volume2 } from 'lucide-react';

interface DoseCardProps {
  dose: DoseEvent;
  onTake: (doseId: string) => void;
  onLater: (doseId: string) => void;
  onPlayVoice?: (dose: DoseEvent) => void;
  isNextDose?: boolean;
}

export const DoseCard: React.FC<DoseCardProps> = ({
  dose,
  onTake,
  onLater,
  onPlayVoice,
  isNextDose = false,
}) => {
  const doseDate = new Date(dose.due_at);
  const timeStr = doseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const hour = doseDate.getHours();

  // Determine time-of-day pictogram
  let timePicto: PictogramType = 'morning';
  if (hour >= 12 && hour < 17) timePicto = 'afternoon';
  else if (hour >= 17 && hour < 21) timePicto = 'evening';
  else if (hour >= 21 || hour < 6) timePicto = 'night';

  const foodPicto: PictogramType =
    dose.food_relation === 'before'
      ? 'before_food'
      : dose.food_relation === 'with'
      ? 'with_food'
      : 'after_food';

  const isTaken = dose.status === 'taken';

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`${dose.medicine_name} ${dose.strength || ''}, scheduled for ${timeStr}. Status: ${dose.status}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-panel)',
        padding: '20px',
        border: isNextDose ? '2.5px solid var(--color-care)' : '1.5px solid var(--color-line-soft)',
        boxShadow: isNextDose ? '0 6px 20px rgba(11, 110, 110, 0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '16px',
        transition: 'all var(--motion-quick)',
      }}
    >
      {isNextDose && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-care)',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 'calc(14px * var(--font-scale))',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          తదుపరి వేసుకోవాల్సిన మందు (Next Dose)
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3
            className="type-title"
            style={{
              margin: '0 0 4px 0',
              color: 'var(--color-ink)',
              fontSize: 'calc(26px * var(--font-scale))',
            }}
          >
            {dose.medicine_name}
          </h3>
          <span
            style={{
              fontSize: 'calc(20px * var(--font-scale))',
              color: 'var(--color-quiet)',
              fontWeight: 600,
            }}
          >
            {dose.strength || ''} • {dose.qty_text} మాత్ర
          </span>
        </div>

        <StatusPill status={dose.status} size="large" />
      </div>

      {/* Pictograms + Audio Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <PictogramTile type={timePicto} size={32} />
          <PictogramTile type={foodPicto} size={32} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span
            style={{
              fontSize: 'calc(26px * var(--font-scale))',
              fontWeight: 700,
              color: 'var(--color-ink)',
            }}
          >
            {timeStr}
          </span>
          {onPlayVoice && (
            <button
              onClick={() => onPlayVoice(dose)}
              aria-label="Read this medicine instruction to me"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-care-tint)',
                color: 'var(--color-care)',
                fontSize: 'calc(15px * var(--font-scale))',
                fontWeight: 600,
                minHeight: '44px',
              }}
            >
              <Volume2 size={18} />
              <span>చదివి వినిపించు (Play)</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      {!isTaken ? (
        <div style={{ display: 'flex', gap: '12px' }}>
          <ActionButton
            variant="primary"
            onClick={() => onTake(dose.id)}
            icon={<Check size={24} />}
          >
            వేసుకున్నాను (Taken)
          </ActionButton>

          <ActionButton
            variant="secondary"
            onClick={() => onLater(dose.id)}
            icon={<Clock size={22} />}
          >
            తర్వాత (Later)
          </ActionButton>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--color-verified-tint)',
            color: 'var(--color-verified)',
            padding: '12px',
            borderRadius: 'var(--radius-field)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 'calc(18px * var(--font-scale))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Check size={22} />
          <span>సమయానికి వేసుకున్నారు! (Marked Taken)</span>
        </div>
      )}
    </div>
  );
};
