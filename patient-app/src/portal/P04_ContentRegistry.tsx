/**
 * P04 Content Registry Screen
 * Implements ref/05-screen-specs.md P04 & ref/08-translation-lock-spec.md Section 7
 * Template library & locale coverage matrix (verified / in_review / unverified / stale).
 */

import React, { useEffect, useState } from 'react';
import { ContentItem } from '../../../shared/contracts';
import { ShieldCheck, ShieldAlert, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { instructionTemplates } from '../../../shared/ux-copy';

export const P04_ContentRegistry: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async () => {
    try {
      const res = await fetch('/portal/content-registry');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      // Mock if offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="type-title" style={{ margin: '0 0 6px 0', fontSize: '28px', color: 'var(--color-ink)' }}>
            కంటెంట్ రిజిస్ట్రీ (Content Registry & Matrix)
          </h1>
          <p style={{ margin: 0, color: 'var(--color-quiet)', fontSize: '16px' }}>
            Authoritative registry of dosing templates and regional language verification status.
          </p>
        </div>

        <button
          onClick={fetchRegistry}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-field)',
            border: '1.5px solid var(--color-care)',
            color: 'var(--color-care)',
            backgroundColor: '#FFFFFF',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Refresh Registry
        </button>
      </div>

      {/* Staleness Rule Alert Box (S10) */}
      <div
        style={{
          backgroundColor: 'var(--color-caution-tint)',
          border: '1.5px solid var(--color-caution)',
          borderRadius: 'var(--radius-field)',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <AlertTriangle size={24} color="var(--color-caution)" />
        <span style={{ fontSize: '15px', color: 'var(--color-ink)' }}>
          <strong>Safety Invariant S10:</strong> Any modification to the English source text immediately marks all dependent Telugu translations as <code>STALE</code> (treated as unverified by patient clients).
        </span>
      </div>

      {/* Coverage Matrix Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          border: '2px solid var(--color-line-soft)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-paper)', borderBottom: '2px solid var(--color-line-soft)' }}>
              <th style={{ padding: '16px', fontWeight: 700 }}>Template Key</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>English Source</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>English (EN)</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>Telugu (TE)</th>
            </tr>
          </thead>
          <tbody>
            {instructionTemplates.map((tpl) => {
              const teItem = items.find((i) => i.key === tpl.key && i.locale === 'te');
              const teStatus = teItem ? teItem.verification_status : 'unverified';

              return (
                <tr key={tpl.key} style={{ borderBottom: '1px solid var(--color-line-soft)' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px', color: 'var(--color-care)' }}>
                    {tpl.key}
                  </td>

                  <td style={{ padding: '16px', fontSize: '15px', color: 'var(--color-ink)' }}>
                    {tpl.sourceEn}
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-verified-tint)',
                        color: 'var(--color-verified)',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      VERIFIED (Source)
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor:
                          teStatus === 'verified'
                            ? 'var(--color-verified-tint)'
                            : teStatus === 'in_review'
                            ? '#ECEFF1'
                            : 'var(--color-caution-tint)',
                        color:
                          teStatus === 'verified'
                            ? 'var(--color-verified)'
                            : teStatus === 'in_review'
                            ? 'var(--color-quiet)'
                            : 'var(--color-caution)',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      {teStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
