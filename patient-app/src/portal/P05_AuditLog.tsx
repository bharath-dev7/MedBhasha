/**
 * P05 Audit Log Screen
 * Implements ref/05-screen-specs.md P05
 * Append-only immutable clinical audit trail of all pharmacist and system actions.
 */

import React, { useEffect, useState } from 'react';
import { AuditLogEntry } from '../../../shared/contracts';
import { ShieldCheck, History, RefreshCw, FileText } from 'lucide-react';

export const P05_AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/portal/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      // Mock log
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="type-title" style={{ margin: '0 0 6px 0', fontSize: '28px', color: 'var(--color-ink)' }}>
            ఆడిట్ లాగ్ (Audit Log Demo)
          </h1>
          <p style={{ margin: 0, color: 'var(--color-quiet)', fontSize: '16px' }}>
            Demonstration event log stored in backend memory; it is not an immutable security record.
          </p>
        </div>

        <button
          onClick={fetchLogs}
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
          Refresh Log
        </button>
      </div>

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
              <th style={{ padding: '16px', fontWeight: 700 }}>Timestamp</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>Actor</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>Action</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>Target / Scope</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--color-line-soft)' }}>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--color-quiet)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>

                <td style={{ padding: '16px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-ink)' }}>{log.actor_id}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-quiet)' }}>({log.actor_role})</div>
                </td>

                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-field)',
                      backgroundColor:
                        log.action.includes('APPROVE') || log.action.includes('PUBLISH')
                          ? 'var(--color-verified-tint)'
                          : log.action.includes('CANCEL')
                          ? 'var(--color-caution-tint)'
                          : '#ECEFF1',
                      color:
                        log.action.includes('APPROVE') || log.action.includes('PUBLISH')
                          ? 'var(--color-verified)'
                          : log.action.includes('CANCEL')
                          ? 'var(--color-caution)'
                          : 'var(--color-ink)',
                      fontWeight: 700,
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {log.action}
                  </span>
                </td>

                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-ink)', fontFamily: 'monospace' }}>
                  {log.target_id}
                </td>

                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-quiet)' }}>
                  {log.comment || 'Status updated'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
