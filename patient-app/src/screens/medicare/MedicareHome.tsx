import React from 'react';
import {
  FileText,
  Camera,
  Bell,
  AlertTriangle,
  FolderHeart,
  HeartHandshake,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { localDb } from '../../db/localStore';
import { t } from '../../../../shared/ux-copy';

interface MedicareHomeProps {
  onNavigate: (view: string) => void;
  onOpenAlerts: () => void;
  activeDoseCount?: number;
}

export const MedicareHome: React.FC<MedicareHomeProps> = ({
  onNavigate,
  onOpenAlerts,
  activeDoseCount = 2,
}) => {
  const dbState = localDb.getState();
  const userName = dbState.currentUser?.fullName?.split(' ')[0] || 'User';
  const locale = dbState.settings.locale;

  const quickActions = [
    {
      id: 'scan_rx',
      title: t('home.action.scanRx', locale),
      icon: <FileText size={28} color="#1976D2" />,
      bg: '#E3F2FD',
      action: () => onNavigate('scan_rx'),
    },
    {
      id: 'scan_med',
      title: t('home.action.scanMed', locale),
      icon: <Camera size={28} color="#0284C7" />,
      bg: '#E0F2FE',
      action: () => onNavigate('scan_med'),
    },
    {
      id: 'reminders',
      title: t('home.action.reminders', locale),
      icon: <Bell size={28} color="#7C3AED" />,
      bg: '#EDE9FE',
      action: () => onNavigate('dose_reminder'),
    },
    {
      id: 'expiry',
      title: t('home.action.expiry', locale),
      icon: <AlertTriangle size={28} color="#EA580C" />,
      bg: '#FFEDD5',
      badge: '1 Alert',
      action: () => onNavigate('expiry_alert'),
    },
    {
      id: 'records',
      title: t('home.action.records', locale),
      icon: <FolderHeart size={28} color="#0D9488" />,
      bg: '#CCFBF1',
      action: () => onNavigate('records'),
    },
    {
      id: 'donate',
      title: t('home.action.donate', locale),
      icon: <HeartHandshake size={28} color="#E11D48" />,
      bg: '#FFE4E6',
      action: () => onNavigate('donate'),
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 24px 20px',
        backgroundColor: '#F8FAFC',
        overflowY: 'auto',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Hello, {userName}! 👋
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
            {t('brand.motto', locale)}
          </p>
        </div>

        <button
          onClick={onOpenAlerts}
          style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}
        >
          <Bell size={20} color="#0F172A" />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
            }}
          />
        </button>
      </div>

      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1976D2 0%, #0284C7 100%)',
          borderRadius: '20px',
          padding: '20px',
          color: '#FFFFFF',
          marginBottom: '20px',
          boxShadow: '0 8px 20px rgba(25, 118, 210, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '240px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            <Clock size={14} />
            <span>Next dose at 08:00 AM</span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', lineHeight: 1.3 }}>
            {t('home.banner.title', locale)}
          </h2>
          <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
            Paracetamol 500 mg • 1 Tablet after breakfast
          </p>
        </div>

        {/* Clock Graphic Illustration */}
        <div
          style={{
            position: 'absolute',
            right: '16px',
            bottom: '14px',
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Clock size={42} color="#FFFFFF" strokeWidth={1.8} />
        </div>
      </div>

      {/* 6 Quick Action Grid Cards (2 columns x 3 rows) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minHeight: '110px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              position: 'relative',
              textAlign: 'left',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {action.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                {action.badge}
              </span>
            )}

            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: action.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              {action.icon}
            </div>

            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#1E293B',
                lineHeight: 1.25,
              }}
            >
              {action.title}
            </span>
          </button>
        ))}
      </div>

      {/* Suspicious Alert Banner Quick Access */}
      <button
        onClick={() => onNavigate('suspicious_alert')}
        style={{
          backgroundColor: '#FFF1F2',
          border: '1px solid #FECDD3',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFE4E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E11D48',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#9F1239' }}>
              Safety Check Feature
            </div>
            <div style={{ fontSize: '12px', color: '#BE123C' }}>
              Check suspicious batch codes & packaging
            </div>
          </div>
        </div>
        <ChevronRight size={18} color="#BE123C" />
      </button>
    </div>
  );
};
