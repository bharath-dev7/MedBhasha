/**
 * S10 Dose History Screen
 * Implements ref/05-screen-specs.md S10
 * Weekly calendar view, dose status pills, and mistake fixer for last 24h.
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { StatusPill } from '../components/StatusPill';
import { localDb, LocalDatabaseState } from '../db/localStore';

interface S10DoseHistoryProps {
  dbState: LocalDatabaseState;
  onBack: () => void;
}

export const S10_DoseHistory: React.FC<S10DoseHistoryProps> = ({ dbState, onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const doses = dbState.doseEvents.filter((d) => {
    if (selectedFilter === 'all') return true;
    return d.medicine_id === selectedFilter;
  });

  const handleFixMistake = (doseId: string, currentStatus: string) => {
    if (currentStatus === 'taken') {
      localDb.undoDose(doseId);
    } else {
      localDb.markDoseTaken(doseId);
    }
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            minWidth: 'var(--target-min)',
            minHeight: 'var(--target-min)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-line-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="type-title" style={{ margin: 0, fontSize: 'calc(24px * var(--font-scale))' }}>
          మందుల చరిత్ర (Dose History)
        </h1>
      </div>

      {/* Medicine Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => setSelectedFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: selectedFilter === 'all' ? 'var(--color-care)' : 'var(--color-surface)',
            color: selectedFilter === 'all' ? '#FFFFFF' : 'var(--color-ink)',
            border: `1.5px solid ${selectedFilter === 'all' ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          అన్నీ (All)
        </button>
        {dbState.medicines.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedFilter(m.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: selectedFilter === m.id ? 'var(--color-care)' : 'var(--color-surface)',
              color: selectedFilter === m.id ? '#FFFFFF' : 'var(--color-ink)',
              border: `1.5px solid ${selectedFilter === m.id ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {m.display_name}
          </button>
        ))}
      </div>

      {/* History Dose List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {doses.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              padding: '32px 16px',
              borderRadius: 'var(--radius-panel)',
              textAlign: 'center',
              color: 'var(--color-quiet)',
            }}
          >
            చరిత్ర ఏదీ నమోదు కాలేదు (No dose logs recorded yet).
          </div>
        ) : (
          doses.map((dose) => {
            const timeStr = new Date(dose.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date(dose.due_at).toLocaleDateString([], { month: 'short', day: 'numeric' });

            return (
              <div
                key={dose.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '16px',
                  borderRadius: 'var(--radius-panel)',
                  border: '1.5px solid var(--color-line-soft)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600 }}>
                    {dateStr} • {timeStr}
                  </div>
                  <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                    {dose.medicine_name} {dose.strength || ''}
                  </strong>
                  <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    {dose.qty_text} మాత్ర ({dose.food_relation === 'after' ? 'భోజనం తర్వాత' : 'భోజనం ముందు'})
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <StatusPill status={dose.status} />

                  {/* Fix a mistake button */}
                  <button
                    onClick={() => handleFixMistake(dose.id, dose.status)}
                    style={{
                      fontSize: 'calc(13px * var(--font-scale))',
                      color: 'var(--color-care)',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>సరిచేయి (Fix)</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
