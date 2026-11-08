/**
 * P01 Reviewer Queue Screen
 * Implements ref/05-screen-specs.md P01
 * Queue of incoming prescription extractions and translation items for certified reviewers.
 */

import React, { useEffect, useState } from 'react';
import { ReviewRequest } from '../../../shared/contracts';
import { Stethoscope, CheckCircle, Clock, AlertTriangle, ChevronRight, Filter } from 'lucide-react';

interface P01ReviewQueueProps {
  onSelectRequest: (request: ReviewRequest) => void;
}

export const P01_ReviewQueue: React.FC<P01ReviewQueueProps> = ({ onSelectRequest }) => {
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'prescription' | 'content_item'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/portal/queue');
      if (!res.ok) throw new Error(`Queue request failed (${res.status})`);
      setRequests(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the review queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filtered = requests.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="type-title" style={{ margin: '0 0 6px 0', fontSize: '28px', color: 'var(--color-ink)' }}>
            ఫార్మసిస్ట్ సమీక్ష జాబితా (Pharmacist Review Queue)
          </h1>
          <p style={{ margin: 0, color: 'var(--color-quiet)', fontSize: '16px' }}>
            Unverified prescriptions and regional translations awaiting clinical sign-off (ADR-008 & S5).
          </p>
        </div>

        {error && (
          <div role="alert" style={{ marginBottom: '16px', padding: '12px', color: '#991B1B', background: '#FEE2E2', borderRadius: '10px' }}>
            {error} Ensure the backend is running, then refresh the queue.
          </div>
        )}

        <button
          onClick={fetchQueue}
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
          Refresh Queue
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {[
          { id: 'all', label: `All Requests (${requests.length})` },
          { id: 'content_item', label: 'Translation Lock Reviews' },
          { id: 'prescription', label: 'Prescription OCR Reviews' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: filterType === tab.id ? 'var(--color-care)' : 'var(--color-surface)',
              color: filterType === tab.id ? '#FFFFFF' : 'var(--color-ink)',
              border: `1.5px solid ${filterType === tab.id ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          border: '2px solid var(--color-line-soft)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-quiet)' }}>
            No pending items in queue. All translations and prescriptions are up to date.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-paper)', borderBottom: '2px solid var(--color-line-soft)' }}>
                <th style={{ padding: '16px', fontWeight: 700, color: 'var(--color-ink)' }}>Type</th>
                <th style={{ padding: '16px', fontWeight: 700, color: 'var(--color-ink)' }}>Item / Key</th>
                <th style={{ padding: '16px', fontWeight: 700, color: 'var(--color-ink)' }}>Target Locale</th>
                <th style={{ padding: '16px', fontWeight: 700, color: 'var(--color-ink)' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 700, color: 'var(--color-ink)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  style={{
                    borderBottom: '1px solid var(--color-line-soft)',
                    cursor: 'pointer',
                    transition: 'background var(--motion-quick)',
                  }}
                  onClick={() => onSelectRequest(req)}
                >
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: req.type === 'content_item' ? 'var(--color-caution-tint)' : 'var(--color-care-tint)',
                        color: req.type === 'content_item' ? 'var(--color-caution)' : 'var(--color-care)',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      {req.type === 'content_item' ? 'TRANSLATION LOCK' : 'PRESCRIPTION'}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <strong style={{ display: 'block', color: 'var(--color-ink)', fontSize: '16px' }}>
                      {req.data.content_item_key || 'Scanned Rx'}
                    </strong>
                    <span style={{ fontSize: '14px', color: 'var(--color-quiet)' }}>
                      {req.data.source_english || req.data.extracted_fields?.length + ' medicines'}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <strong>{req.data.locale ? req.data.locale.toUpperCase() : 'TE'}</strong> (Telugu)
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: req.status === 'approved' ? 'var(--color-verified-tint)' : 'var(--color-caution-tint)',
                        color: req.status === 'approved' ? 'var(--color-verified)' : 'var(--color-caution)',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      {req.status === 'approved' ? 'Approved & Signed' : 'Pending Review'}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRequest(req);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--color-care)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-field)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <span>Review</span>
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
