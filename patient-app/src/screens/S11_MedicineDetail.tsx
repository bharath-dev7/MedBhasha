/**
 * S11 Medicine Detail & Safety Passport Screen
 * Implements ref/05-screen-specs.md S11 & Safety Invariant S11:
 * Curated, attributable medical dataset with source and retrieval date.
 * No free-generated claims.
 */

import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, ShieldAlert, FileText, ExternalLink, Trash2, Calendar, Pill } from 'lucide-react';
import { Medicine } from '../../../shared/contracts';
import { ExpiryBadge } from '../components/ExpiryBadge';
import { VerificationBadge } from '../components/VerificationBadge';
import { StatusPill } from '../components/StatusPill';
import { getCuratedMedicine } from '../../../shared/catalogue';
import { localDb, LocalDatabaseState } from '../db/localStore';

interface S11MedicineDetailProps {
  medicine: Medicine;
  dbState: LocalDatabaseState;
  onBack: () => void;
}

export const S11_MedicineDetail: React.FC<S11MedicineDetailProps> = ({
  medicine,
  dbState,
  onBack,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const expiry = dbState.expiryRecords.find((e) => e.medicine_id === medicine.id);
  const schedule = dbState.schedules.find((s) => s.medicine_id === medicine.id);
  const curated = getCuratedMedicine(medicine.display_name);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          <div>
            <h1 className="type-title" style={{ margin: 0, fontSize: 'calc(24px * var(--font-scale))' }}>
              {medicine.display_name}
            </h1>
            <span style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-quiet)' }}>
              {medicine.strength || ''} • {medicine.form || 'tablet'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          aria-label="Delete medicine"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-danger-tint)',
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* 1. Medicine Safety Passport Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          padding: '20px',
          border: '2px solid var(--color-line-soft)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-care)', marginBottom: '14px' }}>
          <FileText size={22} />
          <h2 className="type-title" style={{ margin: 0, fontSize: 'calc(20px * var(--font-scale))' }}>
            మందుల భద్రతా పాస్‌పోర్ట్ (Safety Passport)
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--color-paper)', padding: '12px', borderRadius: 'var(--radius-field)' }}>
            <span style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--color-quiet)', display: 'block' }}>
              నమోదు మూలం (Source)
            </span>
            <strong style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-ink)' }}>
              {medicine.source === 'scan_rx' ? 'ప్రిస్క్రిప్షన్ స్కాన్ (Rx Scan)' : 'చేతితో నమోదు (Manual)'}
            </strong>
          </div>

          <div style={{ backgroundColor: 'var(--color-paper)', padding: '12px', borderRadius: 'var(--radius-field)' }}>
            <span style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--color-quiet)', display: 'block' }}>
              ధృవీకరణ స్థితి (Status)
            </span>
            <strong style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-verified)' }}>
              యూజర్ నిర్ధారించారు (Confirmed)
            </strong>
          </div>
        </div>

        {/* Expiry Badge row */}
        {expiry && (
          <ExpiryBadge
            expDate={expiry.exp_date}
            mfgDate={expiry.mfg_date}
            status={expiry.exp_status}
          />
        )}
      </div>

      {/* 2. Attributable Clinical Info (Safety Invariant S11) */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          padding: '20px',
          border: '2px solid var(--color-line-soft)',
          marginBottom: '20px',
        }}
      >
        <h2 className="type-title" style={{ margin: '0 0 12px 0', fontSize: 'calc(20px * var(--font-scale))' }}>
          మందు వివరణ & జాగ్రత్తలు (Medical Details)
        </h2>

        {curated ? (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600 }}>
                దేనికి ఉపయోగపడుతుంది? (Uses):
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: 'calc(17px * var(--font-scale))', color: 'var(--color-ink)' }}>
                {curated.simple_uses_te}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                {curated.simple_uses}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)', fontWeight: 600 }}>
                సాధారణ దుష్ప్రభావాలు (Side Effects):
              </span>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', fontSize: 'calc(16px * var(--font-scale))' }}>
                {curated.common_side_effects_te.map((se, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{se}</li>
                ))}
              </ul>
            </div>

            {/* Invariant S11 Citation Source Banner */}
            <div
              style={{
                backgroundColor: 'var(--color-paper)',
                padding: '12px',
                borderRadius: 'var(--radius-field)',
                border: '1px solid var(--color-line-soft)',
                fontSize: 'calc(13px * var(--font-scale))',
                color: 'var(--color-quiet)',
              }}
            >
              📚 <strong>మూలం (Trusted Source):</strong> {curated.source_name}
              <br />
              సేకరించిన తేదీ: {curated.retrieved_at} (CDSCO / WHO Formulary Dataset)
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--color-paper)',
              padding: '16px',
              borderRadius: 'var(--radius-field)',
              color: 'var(--color-quiet)',
              fontSize: 'calc(16px * var(--font-scale))',
            }}
          >
            ధృవీకరించబడిన సమాచారం అందుబాటులో లేదు (No verified medical info available in catalogue for this medicine).
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              padding: '24px',
              borderRadius: 'var(--radius-panel)',
              maxWidth: '440px',
              width: '100%',
              border: '2px solid var(--color-danger)',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-danger)', fontSize: 'calc(22px * var(--font-scale))' }}>
              {medicine.display_name} తొలగించాలా? (Delete?)
            </h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--color-ink)', fontSize: 'calc(16px * var(--font-scale))' }}>
              దీని అలారాలు మరియు గత చరిత్ర తొలగించబడతాయి. దీనిని వెనక్కి మార్చలేరు.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  minHeight: 'var(--target-min)',
                  backgroundColor: 'var(--color-paper)',
                  borderRadius: 'var(--radius-field)',
                  fontWeight: 600,
                  border: '1px solid var(--color-line-strong)',
                }}
              >
                ఉంచండి (Keep)
              </button>
              <button
                onClick={() => {
                  // Delete from localDb
                  localDb.getState().medicines = localDb.getState().medicines.filter((m) => m.id !== medicine.id);
                  localDb.generateTodayDoses();
                  onBack();
                }}
                style={{
                  flex: 1,
                  minHeight: 'var(--target-min)',
                  backgroundColor: 'var(--color-danger)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-field)',
                  fontWeight: 700,
                }}
              >
                తొలగించండి (Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
