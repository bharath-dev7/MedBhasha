import React from 'react';
import {
  ArrowLeft,
  User,
  Smartphone,
  Eye,
  ShieldCheck,
  Bell,
  Database,
  Heart,
  Activity,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

interface MedicareArchitectureProps {
  onBack: () => void;
  onSwitchToPharmacistPortal: () => void;
  onJumpToScreen: (screen: string) => void;
}

export const MedicareArchitecture: React.FC<MedicareArchitectureProps> = ({
  onBack,
  onSwitchToPharmacistPortal,
  onJumpToScreen,
}) => {
  const subsystems = [
    { title: 'OCR & AI Processing', icon: <Eye size={18} />, color: '#2563EB', bg: '#EFF6FF', screen: 'scan_rx' },
    { title: 'Pharmacist Verification', icon: <ShieldCheck size={18} />, color: '#16A34A', bg: '#DCFCE7', screen: 'verification' },
    { title: 'Instructions Preview', icon: <ShieldCheck size={18} />, color: '#0D9488', bg: '#CCFBF1', screen: 'verification' },
    { title: 'Notification Service', icon: <Bell size={18} />, color: '#7C3AED', bg: '#EDE9FE', screen: 'dose_reminder' },
    { title: 'Database & Cloud Sync', icon: <Database size={18} />, color: '#0D9488', bg: '#CCFBF1', screen: 'records' },
  ];

  const outcomes = [
    { title: 'Medication Safety', icon: <ShieldCheck size={18} /> },
    { title: 'Better Adherence', icon: <Activity size={18} /> },
    { title: 'Improved Health', icon: <Heart size={18} /> },
  ];

  const posterScreens = [
    { name: '1. Splash Screen', id: 'splash' },
    { name: '2. Registration', id: 'auth' },
    { name: '3. Language Selection', id: 'language' },
    { name: '4. Home Dashboard', id: 'home' },
    { name: '5. Prescription Scan', id: 'scan_rx' },
    { name: '6. Medicine Scan', id: 'scan_med' },
    { name: '7. Instructions Preview', id: 'verification' },
    { name: '8. Verified Details', id: 'verified_details' },
    { name: '9. Dose Reminder', id: 'dose_reminder' },
    { name: '10. Expiry Monitoring', id: 'expiry_alert' },
    { name: '11. Suspicious Alert', id: 'suspicious_alert' },
    { name: '12. Medication Records', id: 'records' },
    { name: '13. Donate Medicines', id: 'donate' },
    { name: '14. Feedback', id: 'feedback' },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8FAFC',
        overflowY: 'auto',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
          System Architecture
        </h2>
        <div style={{ width: '40px' }} />
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Architecture Card Diagram */}
        <div
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
            borderRadius: '24px',
            padding: '20px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#1E40AF',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 800,
              marginBottom: '16px',
            }}
          >
            System Architecture
          </div>

          {/* User Node */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #2563EB',
              borderRadius: '16px',
              padding: '10px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#1E40AF',
              marginBottom: '10px',
            }}
          >
            <User size={16} />
            <span>User (Patient / Caregiver)</span>
          </div>

          <div style={{ color: '#2563EB', fontSize: '18px', fontWeight: 900 }}>↓</div>

          {/* MEDICARE Mobile App (UI Layer) */}
          <div
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 800,
              margin: '6px 0',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Smartphone size={18} />
              <span>MEDICARE Mobile App (UI Layer)</span>
            </div>
          </div>

          <div style={{ color: '#2563EB', fontSize: '18px', fontWeight: 900 }}>↓</div>

          {/* 5 Core Subsystems Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '8px',
              margin: '6px 0 12px 0',
              textAlign: 'left',
            }}
          >
            {subsystems.map((sub) => (
              <div
                key={sub.title}
                onClick={() => onJumpToScreen(sub.screen)}
                style={{
                  backgroundColor: sub.bg,
                  border: `1.5px solid ${sub.color}`,
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: sub.color, fontWeight: 700, fontSize: '13px' }}>
                  {sub.icon}
                  <span>{sub.title}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Tap to test →</span>
              </div>
            ))}
          </div>

          <div style={{ color: '#16A34A', fontSize: '18px', fontWeight: 900 }}>↓</div>

          {/* Outcomes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: '#DCFCE7',
              borderRadius: '14px',
              padding: '12px 6px',
              border: '1.5px solid #86EFAC',
            }}
          >
            {outcomes.map((out) => (
              <div key={out.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#16A34A' }}>{out.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#14532D' }}>{out.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacist Review Portal Switcher */}
        <div
          style={{
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <Stethoscope size={22} color="#38BDF8" />
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Pharmacist Portal Demo
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px 0' }}>
            Explore sample review requests and translation-bundle workflows. Reviewer identities are not authenticated, and no clinical sign-off occurs.
          </p>

          <button
            onClick={onSwitchToPharmacistPortal}
            style={{
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
            }}
          >
            Launch Pharmacist Review Portal →
          </button>
        </div>

        {/* Quick Jump Navigator to all 14 Poster Screens */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #E2E8F0',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
            Quick Poster Screen Navigator
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {posterScreens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => onJumpToScreen(screen.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#1E293B',
                  fontSize: '11px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {screen.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
