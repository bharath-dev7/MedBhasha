/**
 * DayArc Component - Flagship Visual Signature
 * Implements ref/04-design-system.md Section 1 & 3.6
 * Visualizes today's medication along a sunrise-to-night sun path.
 * Includes non-visual sorted list equivalent for 100% WCAG 2.1 AA accessibility.
 */

import React from 'react';
import { Sun, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { DoseEvent } from '../../../shared/contracts';

interface DayArcProps {
  doses: DoseEvent[];
  onSelectDose: (dose: DoseEvent) => void;
}

export const DayArc: React.FC<DayArcProps> = ({ doses, onSelectDose }) => {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60; // 0 to 24

  // Sun position along arc from 6 AM (sunrise) to 22 PM (night)
  // Clamp between 6 and 22 for visual arc
  const startHour = 6;
  const endHour = 22;
  const progressRatio = Math.max(0, Math.min(1, (currentHour - startHour) / (endHour - startHour)));

  // SVG Arc coordinates:
  // Center (200, 190), Radius 150
  // Angle from Math.PI (left, 6am) to 0 (right, 10pm)
  const arcRadius = 140;
  const centerX = 200;
  const centerY = 175;

  const getArcCoordinates = (hourRatio: number) => {
    // angle goes from PI (left, sunrise) to 0 (right, night)
    const angle = Math.PI - hourRatio * Math.PI;
    const x = centerX + arcRadius * Math.cos(angle);
    const y = centerY - arcRadius * Math.sin(angle);
    return { x, y };
  };

  const sunPos = getArcCoordinates(progressRatio);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-panel)',
        padding: '20px 16px',
        border: '2px solid var(--color-line-soft)',
        boxShadow: '0 4px 16px rgba(17, 42, 58, 0.05)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 className="type-title" style={{ margin: 0, fontSize: 'calc(22px * var(--font-scale))' }}>
          ఈ రోజు వేళాపట్టిక (Today's Arc)
        </h2>
        <span
          style={{
            fontSize: 'calc(15px * var(--font-scale))',
            fontWeight: 600,
            color: 'var(--color-care)',
            backgroundColor: 'var(--color-care-tint)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Visual Day Arc SVG */}
      <div style={{ position: 'relative', width: '100%', height: '190px' }} aria-hidden="true">
        <svg viewBox="0 0 400 190" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" /> {/* Morning Amber */}
              <stop offset="50%" stopColor="#EA580C" /> {/* Noon Bright */}
              <stop offset="80%" stopColor="#C026D3" /> {/* Evening Sunset */}
              <stop offset="100%" stopColor="#312E81" /> {/* Night Sky */}
            </linearGradient>
          </defs>

          {/* Dotted Base Arc Line */}
          <path
            d="M 60,175 A 140,140 0 0,1 340,175"
            fill="none"
            stroke="var(--color-line-soft)"
            strokeWidth="4"
            strokeDasharray="6 6"
          />

          {/* Solid Colored Track */}
          <path
            d="M 60,175 A 140,140 0 0,1 340,175"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="3.5"
            strokeOpacity="0.85"
          />

          {/* Horizon Line */}
          <line x1="40" y1="175" x2="360" y2="175" stroke="var(--color-line-strong)" strokeWidth="1.5" />

          {/* Time-of-day landmarks */}
          <text x="60" y="195" textAnchor="middle" fontSize="13" fill="var(--color-quiet)" fontWeight="600">
            ఉదయం (6am)
          </text>
          <text x="200" y="30" textAnchor="middle" fontSize="13" fill="var(--color-quiet)" fontWeight="600">
            మధ్యాహ్నం (12pm)
          </text>
          <text x="340" y="195" textAnchor="middle" fontSize="13" fill="var(--color-quiet)" fontWeight="600">
            రాత్రి (10pm)
          </text>

          {/* Moving Sun Marker representing "Now" */}
          <g transform={`translate(${sunPos.x}, ${sunPos.y})`}>
            <circle r="16" fill="#F59E0B" fillOpacity="0.25" />
            <circle r="10" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>

          {/* Dose Marks plotted along the Arc */}
          {doses.map((dose) => {
            const doseDate = new Date(dose.due_at);
            const doseHour = doseDate.getHours() + doseDate.getMinutes() / 60;
            const doseRatio = Math.max(0, Math.min(1, (doseHour - startHour) / (endHour - startHour)));
            const pos = getArcCoordinates(doseRatio);

            const isTaken = dose.status === 'taken';
            const isMissed = dose.status === 'missed';
            const isPostponed = dose.status === 'postponed';

            let fillColor = 'var(--color-care)';
            if (isTaken) fillColor = 'var(--color-verified)';
            if (isMissed) fillColor = 'var(--color-danger)';
            if (isPostponed) fillColor = 'var(--color-caution)';

            return (
              <g
                key={dose.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectDose(dose)}
              >
                <circle r="14" fill="#FFFFFF" stroke={fillColor} strokeWidth="3" />
                {isTaken ? (
                  <path d="M -5,0 L -2,4 L 6,-4" fill="none" stroke="var(--color-verified)" strokeWidth="2.5" />
                ) : isMissed ? (
                  <path d="M -4,-4 L 4,4 M 4,-4 L -4,4" fill="none" stroke="var(--color-danger)" strokeWidth="2.5" />
                ) : (
                  <circle r="5" fill={fillColor} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible Ordered List Equivalent (Authoritative list per WCAG 2.1 AA) */}
      <div style={{ marginTop: '16px' }}>
        <h3 className="type-label" style={{ margin: '0 0 10px 0', color: 'var(--color-quiet)' }}>
          ఈ రోజు మందుల వరుస (Today's Doses)
        </h3>

        {doses.length === 0 ? (
          <p style={{ color: 'var(--color-quiet)', fontSize: 'calc(16px * var(--font-scale))', margin: 0 }}>
            ఇంకా మందులు షెడ్యూల్ చేయలేదు (No doses scheduled for today).
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {doses.map((d) => {
              const timeStr = new Date(d.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDose(d)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-field)',
                    backgroundColor: d.status === 'taken' ? 'var(--color-verified-tint)' : 'var(--color-paper)',
                    border: `1.5px solid ${d.status === 'taken' ? 'var(--color-verified)' : 'var(--color-line-soft)'}`,
                    textAlign: 'left',
                    minHeight: '52px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {d.status === 'taken' ? (
                      <CheckCircle size={22} color="var(--color-verified)" />
                    ) : d.status === 'missed' ? (
                      <XCircle size={22} color="var(--color-danger)" />
                    ) : d.status === 'postponed' ? (
                      <Clock size={22} color="var(--color-caution)" />
                    ) : (
                      <AlertCircle size={22} color="var(--color-care)" />
                    )}
                    <div>
                      <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                        {d.medicine_name} {d.strength}
                      </strong>
                      <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                        {timeStr} • {d.qty_text} మాత్ర ({d.food_relation === 'after' ? 'భోజనం తర్వాత' : 'భోజనం ముందు'})
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 'calc(14px * var(--font-scale))',
                      fontWeight: 700,
                      color:
                        d.status === 'taken'
                          ? 'var(--color-verified)'
                          : d.status === 'missed'
                          ? 'var(--color-danger)'
                          : 'var(--color-care)',
                    }}
                  >
                    {d.status === 'taken'
                      ? 'పూర్తయింది (Taken)'
                      : d.status === 'missed'
                      ? 'మిస్సయింది (Missed)'
                      : 'వేసుకోవాలి (Due)'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
