/**
 * S02 Home Screen
 * Implements ref/04-design-system.md Section 1 & ref/05-screen-specs.md S02
 * Features the signature Day Arc, Next Dose Card, and Two Equal Doors (Smart Scan & Manual Setup).
 */

import React, { useState } from 'react';
import {
  Camera,
  PlusCircle,
  Wifi,
  WifiOff,
  Settings,
  Clock,
  ShieldAlert,
  AlertTriangle,
  History,
  FileText,
  UserCheck,
  Bell,
} from 'lucide-react';
import { DayArc } from '../components/DayArc';
import { DoseCard } from '../components/DoseCard';
import { AlarmSurface } from '../components/AlarmSurface';
import { UnverifiedGate } from '../components/UnverifiedGate';
import { localDb, LocalDatabaseState } from '../db/localStore';
import { DoseEvent } from '../../../shared/contracts';
import { ContentGate } from '../services/contentGate';
import { VoiceService } from '../services/voiceService';
import { uxCopyEn, uxCopyTe } from '../../../shared/ux-copy';

interface S02HomeProps {
  dbState: LocalDatabaseState;
  onOpenSmartScan: () => void;
  onOpenManualSetup: () => void;
  onOpenHistory: () => void;
  onOpenPassports: () => void;
  onOpenGuardian: () => void;
  onOpenSettings: () => void;
  onSelectDoseDetail?: (dose: DoseEvent) => void;
}

export const S02_Home: React.FC<S02HomeProps> = ({
  dbState,
  onOpenSmartScan,
  onOpenManualSetup,
  onOpenHistory,
  onOpenPassports,
  onOpenGuardian,
  onOpenSettings,
}) => {
  const [activeAlarmDose, setActiveAlarmDose] = useState<DoseEvent | null>(null);
  const [gateContent, setGateContent] = useState<{
    key: string;
    unverifiedText: string;
    englishText: string;
  } | null>(null);

  const locale = dbState.settings.locale;
  const isTe = locale === 'te';

  // Find next pending or due dose
  const nextDose =
    dbState.doseEvents.find((d) => d.status === 'due') ||
    dbState.doseEvents.find((d) => d.status === 'pending') ||
    dbState.doseEvents[0];

  // Check for expired or near-expiry medicines to show safety alert row
  const expiredRecord = dbState.expiryRecords.find((e) => e.exp_status === 'expired');
  const nearExpiryRecord = dbState.expiryRecords.find((e) => e.exp_status === 'near_expiry');

  const handleTakeDose = (doseId: string) => {
    localDb.markDoseTaken(doseId);
  };

  const handleLaterDose = (doseId: string) => {
    localDb.postponeDose(doseId, 30);
  };

  const handlePlayVoice = (dose: DoseEvent) => {
    const resolved = ContentGate.resolveInstruction(
      dose.qty_text,
      'tablet',
      dose.food_relation,
      locale === 'te' ? 'te' : 'en'
    );

    if (resolved.isLocked) {
      setGateContent({
        key: resolved.key,
        unverifiedText: resolved.displayText,
        englishText: resolved.englishFallbackText,
      });
    } else {
      VoiceService.speak(resolved.displayText, locale === 'te' ? 'te' : 'en');
    }
  };

  const toggleOfflineMode = () => {
    localDb.updateSettings({ offlineMode: !dbState.settings.offlineMode });
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
      {/* Top Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: '24px',
              color: 'var(--color-ink)',
              letterSpacing: '-0.5px',
            }}
          >
            MedBhasha
          </span>

          {/* Airplane / Offline Mode Status Pill */}
          <button
            onClick={toggleOfflineMode}
            title="Click to toggle offline airplane mode"
            aria-label={`Network status: ${dbState.settings.offlineMode ? 'Offline' : 'Online'}. Tap to toggle.`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: dbState.settings.offlineMode ? 'var(--color-caution-tint)' : 'var(--color-verified-tint)',
              color: dbState.settings.offlineMode ? 'var(--color-caution)' : 'var(--color-verified)',
              border: `1.5px solid ${dbState.settings.offlineMode ? 'var(--color-caution)' : 'var(--color-verified)'}`,
              fontSize: 'calc(13px * var(--font-scale))',
              fontWeight: 700,
            }}
          >
            {dbState.settings.offlineMode ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>{dbState.settings.offlineMode ? 'ఆఫ్‌లైన్ (Offline)' : 'Online'}</span>
          </button>
        </div>

        {/* Quick Action Simulator: Test Trigger Alarm Now */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {nextDose && (
            <button
              onClick={() => setActiveAlarmDose(nextDose)}
              title="Test Alarm Screen (S09)"
              aria-label="Test full screen alarm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-ink)',
                color: '#FFFFFF',
                fontSize: 'calc(13px * var(--font-scale))',
                fontWeight: 600,
              }}
            >
              <Bell size={14} />
              <span>అలారం టెస్ట్ (Alarm)</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            aria-label="Open Settings"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid var(--color-line-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-ink)',
            }}
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Safety Alert Row: Expired Medicine Alert if any */}
      {expiredRecord && (
        <div
          role="alert"
          style={{
            backgroundColor: 'var(--color-danger-tint)',
            border: '2px solid var(--color-danger)',
            borderRadius: 'var(--radius-panel)',
            padding: '14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertTriangle size={28} color="var(--color-danger)" />
          <div style={{ flex: 1 }}>
            <strong style={{ color: 'var(--color-danger)', fontSize: 'calc(16px * var(--font-scale))' }}>
              {isTe ? 'హెచ్చరిక: మందు గడువు ముగిసింది!' : 'Warning: Medicine Expired!'}
            </strong>
            <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-ink)' }}>
              {isTe ? 'దయచేసి దీనిని వేసుకోవద్దు. కొత్త మందు తీసుకోండి.' : 'Do not take expired medication. Consult pharmacist.'}
            </div>
          </div>
        </div>
      )}

      {/* 1. Day Arc Component */}
      <DayArc
        doses={dbState.doseEvents}
        onSelectDose={(dose) => setActiveAlarmDose(dose)}
      />

      {/* 2. Next Dose Card */}
      {nextDose && (
        <div style={{ marginBottom: '24px' }}>
          <DoseCard
            dose={nextDose}
            isNextDose
            onTake={handleTakeDose}
            onLater={handleLaterDose}
            onPlayVoice={handlePlayVoice}
          />
        </div>
      )}

      {/* 3. The Two Doors (Equal Weight, per ref/04-design-system.md Section 1) */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="type-title" style={{ margin: '0 0 12px 0', fontSize: 'calc(22px * var(--font-scale))' }}>
          {isTe ? 'మందును జోడించండి' : 'Add Medication'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Door 1: Smart Scan */}
          <button
            type="button"
            onClick={onOpenSmartScan}
            style={{
              minHeight: '140px',
              padding: '20px 16px',
              borderRadius: 'var(--radius-panel)',
              backgroundColor: 'var(--color-surface)',
              border: '2.5px solid var(--color-care)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 6px 16px rgba(11, 110, 110, 0.08)',
              transition: 'transform var(--motion-quick)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-care-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-care)',
                marginBottom: '10px',
              }}
            >
              <Camera size={32} />
            </div>
            <strong
              style={{
                fontSize: 'calc(20px * var(--font-scale))',
                color: 'var(--color-ink)',
                lineHeight: 1.2,
              }}
            >
              {isTe ? 'స్మార్ట్ స్కాన్' : 'Smart Scan'}
            </strong>
            <span
              style={{
                fontSize: 'calc(13px * var(--font-scale))',
                color: 'var(--color-quiet)',
                marginTop: '4px',
              }}
            >
              {isTe ? 'ప్రిస్క్రిప్షన్ / పట్టీ' : 'Rx or strip scan'}
            </span>
          </button>

          {/* Door 2: Manual Setup */}
          <button
            type="button"
            onClick={onOpenManualSetup}
            style={{
              minHeight: '140px',
              padding: '20px 16px',
              borderRadius: 'var(--radius-panel)',
              backgroundColor: 'var(--color-surface)',
              border: '2.5px solid var(--color-care)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 6px 16px rgba(11, 110, 110, 0.08)',
              transition: 'transform var(--motion-quick)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-care-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-care)',
                marginBottom: '10px',
              }}
            >
              <PlusCircle size={32} />
            </div>
            <strong
              style={{
                fontSize: 'calc(20px * var(--font-scale))',
                color: 'var(--color-ink)',
                lineHeight: 1.2,
              }}
            >
              {isTe ? 'చేతితో నమోదు' : 'Manual Setup'}
            </strong>
            <span
              style={{
                fontSize: 'calc(13px * var(--font-scale))',
                color: 'var(--color-quiet)',
                marginTop: '4px',
              }}
            >
              {isTe ? 'టైప్ చేసి నమోదు' : 'Step-by-step entry'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Nav Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <button
          onClick={onOpenHistory}
          style={{
            padding: '12px 8px',
            borderRadius: 'var(--radius-field)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-line-soft)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <History size={20} color="var(--color-care)" />
          <span style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 600, color: 'var(--color-ink)' }}>
            చరిత్ర (History)
          </span>
        </button>

        <button
          onClick={onOpenPassports}
          style={{
            padding: '12px 8px',
            borderRadius: 'var(--radius-field)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-line-soft)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FileText size={20} color="var(--color-care)" />
          <span style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 600, color: 'var(--color-ink)' }}>
            పాస్‌పోర్ట్ (Passport)
          </span>
        </button>

        <button
          onClick={onOpenGuardian}
          style={{
            padding: '12px 8px',
            borderRadius: 'var(--radius-field)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-line-soft)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <UserCheck size={20} color="var(--color-care)" />
          <span style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 600, color: 'var(--color-ink)' }}>
            రక్షకుడు (Guardian)
          </span>
        </button>
      </div>

      {/* Alarm Full-screen Surface Modal (S09) */}
      {activeAlarmDose && (
        <AlarmSurface
          dose={activeAlarmDose}
          onDismiss={() => setActiveAlarmDose(null)}
          onTake={(id: string) => handleTakeDose(id)}
          onLater={(id: string, mins: number) => localDb.postponeDose(id, mins)}
        />
      )}

      {/* Translation Lock Gate Modal */}
      {gateContent && (
        <UnverifiedGate
          contentItemId={gateContent.key}
          unverifiedText={gateContent.unverifiedText}
          englishText={gateContent.englishText}
          isOpen={true}
          onClose={() => setGateContent(null)}
          onShowEnglish={() => {}}
          onAskPharmacist={() => {
            alert('ఫార్మసిస్ట్ తనిఖీ కోసం అభ్యర్థన పంపబడింది! (Review request sent)');
          }}
        />
      )}
    </div>
  );
};
