/**
 * MedBhasha Master Application Shell
 * Seamlessly integrates Part 1 (Patient App) and Part 2 (Trust Layer)
 * Supports testing the entire Flagship Demo Path end-to-end.
 */

import React, { useEffect, useState } from 'react';
import { localDb, LocalDatabaseState } from './db/localStore';
import { S01_Onboarding } from './screens/S01_Onboarding';
import { S02_Home } from './screens/S02_Home';
import { S03_ScanPrescription } from './screens/S03_ScanPrescription';
import { S04_PrescriptionReview } from './screens/S04_PrescriptionReview';
import { S05_ScanStrip } from './screens/S05_ScanStrip';
import { S06_ExpiryConfirm } from './screens/S06_ExpiryConfirm';
import { S07_ScheduleReview } from './screens/S07_ScheduleReview';
import { S08_ManualSetup } from './screens/S08_ManualSetup';
import { S10_DoseHistory } from './screens/S10_DoseHistory';
import { S11_MedicineDetail } from './screens/S11_MedicineDetail';
import { S13_GuardianSetup } from './screens/S13_GuardianSetup';
import { S14_SettingsHealthCheck } from './screens/S14_SettingsHealthCheck';
import { P01_ReviewQueue } from './portal/P01_ReviewQueue';
import { P02_PrescriptionReview } from './portal/P02_PrescriptionReview';
import { P03_TranslationReview } from './portal/P03_TranslationReview';
import { P04_ContentRegistry } from './portal/P04_ContentRegistry';
import { P05_AuditLog } from './portal/P05_AuditLog';
import { AlarmSurface } from './components/AlarmSurface';
import {
  ExtractedMedicineDraft,
  Medicine,
  ReviewRequest,
  Schedule,
  DoseEvent,
  ExpiryRecord,
  ExpStatus,
} from '../../shared/contracts';
import { SamplePrescriptionScenario, SampleStripScenario } from '../../shared/sample-data';
import {
  Smartphone,
  Stethoscope,
  Wifi,
  WifiOff,
  Bell,
  RefreshCw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  X,
  Globe,
  Home,
  Camera,
  PlusCircle,
  History,
  Shield,
  Settings,
} from 'lucide-react';
import { SyncService } from './services/syncService';

type ActiveView =
  | 'patient_home'
  | 'patient_onboarding'
  | 'patient_scan_rx'
  | 'patient_review_rx'
  | 'patient_scan_strip'
  | 'patient_confirm_exp'
  | 'patient_review_sched'
  | 'patient_manual'
  | 'patient_history'
  | 'patient_detail'
  | 'patient_guardian'
  | 'patient_settings'
  | 'portal_queue'
  | 'portal_review_rx'
  | 'portal_review_trans'
  | 'portal_registry'
  | 'portal_audit';

export const App: React.FC = () => {
  const [dbState, setDbState] = useState<LocalDatabaseState>(localDb.getState());
  const [activeView, setActiveView] = useState<ActiveView>('patient_home');
  const [appMode, setAppMode] = useState<'patient' | 'portal'>('patient');

  // Multi-step flow buffers
  const [currentScenario, setCurrentScenario] = useState<SamplePrescriptionScenario | null>(null);
  const [confirmedMedicinesDraft, setConfirmedMedicinesDraft] = useState<ExtractedMedicineDraft[]>([]);
  const [currentStripScenario, setCurrentStripScenario] = useState<SampleStripScenario | null>(null);
  const [confirmedExpRecord, setConfirmedExpRecord] = useState<{
    expDate: string;
    mfgDate: string;
    status: ExpStatus;
  } | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ReviewRequest | null>(null);

  // Demo Alarm trigger state
  const [activeAlarmDose, setActiveAlarmDose] = useState<DoseEvent | null>(null);
  const [demoGuideOpen, setDemoGuideOpen] = useState(false);

  // Subscribe to local database changes
  useEffect(() => {
    return localDb.subscribe(() => {
      setDbState({ ...localDb.getState() });
    });
  }, []);

  // Sync latest bundle on mount if online
  useEffect(() => {
    SyncService.syncLatestBundle();
  }, []);

  // --- Patient App Handlers ---
  const handleSmartScanStart = () => {
    setActiveView('patient_scan_rx');
  };

  const handleRxExtracted = (scenario: SamplePrescriptionScenario) => {
    setCurrentScenario(scenario);
    setActiveView('patient_review_rx');
  };

  const handleRxConfirmed = (confirmed: ExtractedMedicineDraft[]) => {
    setConfirmedMedicinesDraft(confirmed);
    setActiveView('patient_scan_strip');
  };

  const handleStripCaptured = (strip: SampleStripScenario) => {
    setCurrentStripScenario(strip);
    setActiveView('patient_confirm_exp');
  };

  const handleStripSkip = () => {
    setConfirmedExpRecord({
      expDate: '',
      mfgDate: '',
      status: 'unknown',
    });
    setActiveView('patient_review_sched');
  };

  const handleExpConfirmed = (expRecord: { expDate: string; mfgDate: string; status: ExpStatus }) => {
    setConfirmedExpRecord(expRecord);
    setActiveView('patient_review_sched');
  };

  const handleScheduleActivated = () => {
    const today = new Date().toISOString().split('T')[0];

    // Save all confirmed medicines and schedules to local store
    for (const draft of confirmedMedicinesDraft) {
      const medId = 'med_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const schedId = 'sched_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

      const newMed: Medicine = {
        id: medId,
        display_name: draft.name,
        strength: draft.strength,
        form: draft.form,
        source: 'scan_rx',
        confirm_status: 'confirmed',
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const newSched: Schedule = {
        id: schedId,
        medicine_id: medId,
        frequency_type: draft.frequency,
        times_json: JSON.stringify(draft.timings),
        tz_id: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        food_relation: draft.food_relation,
        qty_text: draft.dose_qty,
        start_date: today,
        confirm_status: 'confirmed',
        confirmed_at: Date.now(),
      };

      localDb.addMedicine(newMed);
      localDb.addSchedule(newSched);

      if (confirmedExpRecord) {
        const newExp: ExpiryRecord = {
          id: 'exp_' + Date.now(),
          medicine_id: medId,
          mfg_date: confirmedExpRecord.mfgDate,
          exp_date: confirmedExpRecord.expDate,
          exp_status: confirmedExpRecord.status,
          user_confirmed: 1,
        };
        localDb.addExpiryRecord(newExp);
      }
    }

    alert('అలారాలు విజయవంతంగా ప్రారంభించబడ్డాయి! (Reminders activated & scheduled offline)');
    setActiveView('patient_home');
  };

  const handleManualComplete = (draft: ExtractedMedicineDraft) => {
    setConfirmedMedicinesDraft([draft]);
    setActiveView('patient_review_sched');
  };

  const handleAskPharmacistCheck = (scenario: SamplePrescriptionScenario) => {
    fetch('/v1/review-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'prescription',
        data: {
          extracted_fields: scenario.medicines,
          source_english: scenario.rawOcrText,
        },
      }),
    });
    alert('ప్రిస్క్రిప్షన్ ఫార్మసిస్ట్ క్యూకు పంపబడింది! (Prescription sent to Pharmacist Review Queue)');
    setActiveView('patient_home');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E5EAEF' }}>
      {/* Top Universal Navbar */}
      <nav
        style={{
          backgroundColor: 'var(--color-ink)',
          color: '#FFFFFF',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-care)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
              }}
            >
              MB
            </div>
            <strong style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>MedBhasha</strong>
          </div>

          {/* Mode Switcher: Patient App vs Pharmacist Portal */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-pill)',
              padding: '3px',
              display: 'flex',
              gap: '4px',
            }}
          >
            <button
              onClick={() => {
                setAppMode('patient');
                setActiveView('patient_home');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: appMode === 'patient' ? 'var(--color-care)' : 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Smartphone size={16} />
              <span>Patient App (Part 1)</span>
            </button>

            <button
              onClick={() => {
                setAppMode('portal');
                setActiveView('portal_queue');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: appMode === 'portal' ? 'var(--color-care)' : 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Stethoscope size={16} />
              <span>Pharmacist Portal (Part 2)</span>
            </button>
          </div>
        </div>

        {/* Right Tools: Language Switcher, Test Alarm, Offline Toggle, Flagship Demo Guide, Sync */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Language Switcher (EN / తెలుగు) */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-pill)',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div style={{ padding: '0 6px 0 8px', display: 'flex', alignItems: 'center', color: '#93C5FD' }}>
              <Globe size={14} />
            </div>
            <button
              onClick={() => localDb.updateSettings({ locale: 'en' })}
              title="Switch language to English (Default)"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: dbState.settings.locale === 'en' ? 'var(--color-care)' : 'transparent',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: dbState.settings.locale === 'en' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background var(--motion-quick)',
              }}
            >
              English
            </button>
            <button
              onClick={() => localDb.updateSettings({ locale: 'te' })}
              title="భాషను తెలుగులోకి మార్చండి (Switch language to Telugu)"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: dbState.settings.locale === 'te' ? 'var(--color-care)' : 'transparent',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: dbState.settings.locale === 'te' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background var(--motion-quick)',
              }}
            >
              తెలుగు
            </button>
          </div>

          {/* Quick "Test Alarm" Trigger */}
          <button
            onClick={() => {
              if (dbState.doseEvents.length > 0) {
                setActiveAlarmDose(dbState.doseEvents[0]);
              } else {
                alert('No dose events found. Add a medicine or scan a prescription to test alarms!');
              }
            }}
            title="Test Alarm Experience (S9 Full Screen Alert)"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              border: '1.5px solid #EF4444',
              color: '#FCA5A5',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Bell size={15} />
            <span>Test Alarm</span>
          </button>

          {/* Offline Airplane Mode Simulator Toggle */}
          <button
            onClick={() => localDb.updateSettings({ offlineMode: !dbState.settings.offlineMode })}
            title="Toggle Airplane / Offline Mode (S6)"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: dbState.settings.offlineMode ? 'var(--color-caution)' : 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {dbState.settings.offlineMode ? <WifiOff size={16} /> : <Wifi size={16} />}
            <span>{dbState.settings.offlineMode ? 'Airplane Mode ON' : 'Online'}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={async () => {
              const res = await SyncService.syncLatestBundle();
              alert(res.message);
            }}
            title="Sync bundle with Trust Layer"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>

          {/* Flagship Demo Walkthrough Guide Button */}
          <button
            onClick={() => setDemoGuideOpen(!demoGuideOpen)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: '#FEF08A',
              color: '#854D0E',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} />
            <span>Flagship Demo Guide</span>
          </button>
        </div>
      </nav>

      {/* Flagship Demo Walkthrough Drawer */}
      {demoGuideOpen && (
        <div
          style={{
            backgroundColor: '#FEF9C3',
            borderBottom: '2px solid #FDE047',
            padding: '16px 24px',
            color: '#713F12',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <strong style={{ fontSize: '16px', display: 'block', marginBottom: '6px' }}>
              🎯 Flagship Demo Path (ref/00-brief.md Section 6):
            </strong>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.5 }}>
              <li>
                <strong>Smart Scan:</strong> Tap <em>Smart Scan</em> &rarr; pick sample prescription with low confidence (tests Invariant S1).
              </li>
              <li>
                <strong>Check & Confirm:</strong> Unclear items are highlighted in yellow and block confirmation until touched (Invariant S2).
              </li>
              <li>
                <strong>Strip Expiry:</strong> Scan strip &rarr; confirm expiry date (or test unreadable foil where unknown stays unknown, S3).
              </li>
              <li>
                <strong>Activate Reminders:</strong> Review schedule with pictograms &rarr; activate alarms.
              </li>
              <li>
                <strong>Offline Alarm & Guardian:</strong> Toggle Airplane mode &rarr; trigger Alarm &rarr; mark Taken &rarr; guardian alert cancels immediately (S7).
              </li>
              <li>
                <strong>Translation Lock (S5):</strong> In Patient App, notice Telugu text has a yellow "Not verified yet" shield &rarr; tap "చదివి వినిపించు" to see the UnverifiedGate modal &rarr; switch to <em>Pharmacist Portal</em> &rarr; approve translation &rarr; switch back and tap <em>Sync</em> &rarr; badge turns green "Verified by a pharmacist" and plays audio freely!
              </li>
            </ol>
          </div>
          <button
            onClick={() => setDemoGuideOpen(false)}
            aria-label="Close guide"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#713F12' }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main style={{ minHeight: 'calc(100vh - 60px)' }}>
        {appMode === 'patient' ? (
          <div
            style={{
              maxWidth: '560px',
              margin: '0 auto',
              backgroundColor: 'var(--color-paper)',
              minHeight: 'calc(100vh - 60px)',
              boxShadow: '0 0 40px rgba(0,0,0,0.1)',
            }}
          >
            {activeView === 'patient_home' && (
              <S02_Home
                dbState={dbState}
                onOpenSmartScan={handleSmartScanStart}
                onOpenManualSetup={() => setActiveView('patient_manual')}
                onOpenHistory={() => setActiveView('patient_history')}
                onOpenPassports={() => {
                  setSelectedMedicine(dbState.medicines[0]);
                  setActiveView('patient_detail');
                }}
                onOpenGuardian={() => setActiveView('patient_guardian')}
                onOpenSettings={() => setActiveView('patient_settings')}
              />
            )}

            {activeView === 'patient_onboarding' && (
              <S01_Onboarding onComplete={() => setActiveView('patient_home')} />
            )}

            {activeView === 'patient_scan_rx' && (
              <S03_ScanPrescription
                onBack={() => setActiveView('patient_home')}
                onExtracted={handleRxExtracted}
              />
            )}

            {activeView === 'patient_review_rx' && currentScenario && (
              <S04_PrescriptionReview
                scenario={currentScenario}
                onBack={() => setActiveView('patient_scan_rx')}
                onConfirmed={handleRxConfirmed}
                onAskPharmacist={handleAskPharmacistCheck}
              />
            )}

            {activeView === 'patient_scan_strip' && (
              <S05_ScanStrip
                onBack={() => setActiveView('patient_review_rx')}
                onStripCaptured={handleStripCaptured}
                onSkip={handleStripSkip}
              />
            )}

            {activeView === 'patient_confirm_exp' && currentStripScenario && (
              <S06_ExpiryConfirm
                strip={currentStripScenario}
                onBack={() => setActiveView('patient_scan_strip')}
                onScanAgain={() => setActiveView('patient_scan_strip')}
                onConfirmed={handleExpConfirmed}
              />
            )}

            {activeView === 'patient_review_sched' && (
              <S07_ScheduleReview
                medicines={confirmedMedicinesDraft}
                onBack={() => setActiveView('patient_confirm_exp')}
                onActivate={handleScheduleActivated}
              />
            )}

            {activeView === 'patient_manual' && (
              <S08_ManualSetup
                onBack={() => setActiveView('patient_home')}
                onComplete={handleManualComplete}
              />
            )}

            {activeView === 'patient_history' && (
              <S10_DoseHistory
                dbState={dbState}
                onBack={() => setActiveView('patient_home')}
              />
            )}

            {activeView === 'patient_detail' && selectedMedicine && (
              <S11_MedicineDetail
                medicine={selectedMedicine}
                dbState={dbState}
                onBack={() => setActiveView('patient_home')}
              />
            )}

            {activeView === 'patient_guardian' && (
              <S13_GuardianSetup
                dbState={dbState}
                onBack={() => setActiveView('patient_home')}
              />
            )}

            {activeView === 'patient_settings' && (
              <S14_SettingsHealthCheck
                dbState={dbState}
                onBack={() => setActiveView('patient_home')}
                onTriggerAlarmTest={() => {
                  const sampleDose = dbState.doseEvents[0];
                  if (sampleDose) setActiveAlarmDose(sampleDose);
                }}
              />
            )}

            {/* Accessible Senior Bottom Navigation Dock */}
            <nav
              aria-label="Primary Mobile Navigation"
              style={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'var(--color-surface)',
                borderTop: '2px solid var(--color-line-soft)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '6px 4px',
                zIndex: 100,
                boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
              }}
            >
              {[
                { id: 'patient_home', icon: Home, labelEn: 'Home', labelTe: 'హోమ్' },
                { id: 'patient_scan_rx', icon: Camera, labelEn: 'Scan Rx', labelTe: 'స్కాన్' },
                { id: 'patient_manual', icon: PlusCircle, labelEn: 'Add Med', labelTe: 'జోడించు' },
                { id: 'patient_history', icon: History, labelEn: 'History', labelTe: 'చరిత్ర' },
                { id: 'patient_detail', icon: Shield, labelEn: 'Passports', labelTe: 'వివరాలు' },
                { id: 'patient_settings', icon: Settings, labelEn: 'Settings', labelTe: 'సెట్టింగ్స్' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const isTe = dbState.settings.locale === 'te';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'patient_detail' && !selectedMedicine && dbState.medicines.length > 0) {
                        setSelectedMedicine(dbState.medicines[0]);
                      }
                      setActiveView(item.id as ActiveView);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: isActive ? 'var(--color-care)' : 'var(--color-quiet)',
                      padding: '6px 8px',
                      minWidth: '56px',
                      minHeight: '52px',
                      borderRadius: 'var(--radius-field)',
                      cursor: 'pointer',
                      transition: 'all var(--motion-quick)',
                      backgroundColor: isActive ? 'var(--color-care-tint)' : 'transparent',
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500 }}>
                      {isTe ? item.labelTe : item.labelEn}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* Pharmacist Portal Views (Part 2) */
          <div style={{ backgroundColor: 'var(--color-paper)', minHeight: 'calc(100vh - 60px)' }}>
            {/* Portal Subnav */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderBottom: '2px solid var(--color-line-soft)',
                padding: '0 24px',
                display: 'flex',
                gap: '24px',
              }}
            >
              {[
                { id: 'portal_queue', label: 'Reviewer Queue (P01)' },
                { id: 'portal_registry', label: 'Content Registry (P04)' },
                { id: 'portal_audit', label: 'Audit Log (P05)' },
              ].map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => setActiveView(nav.id as any)}
                  style={{
                    padding: '16px 0',
                    border: 'none',
                    borderBottom: activeView === nav.id ? '3px solid var(--color-care)' : '3px solid transparent',
                    color: activeView === nav.id ? 'var(--color-care)' : 'var(--color-quiet)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                  }}
                >
                  {nav.label}
                </button>
              ))}
            </div>

            {activeView === 'portal_queue' && (
              <P01_ReviewQueue
                onSelectRequest={(req) => {
                  setSelectedReviewRequest(req);
                  if (req.type === 'prescription') {
                    setActiveView('portal_review_rx');
                  } else {
                    setActiveView('portal_review_trans');
                  }
                }}
              />
            )}

            {activeView === 'portal_review_rx' && selectedReviewRequest && (
              <P02_PrescriptionReview
                request={selectedReviewRequest}
                onBack={() => setActiveView('portal_queue')}
                onReviewed={() => {
                  setActiveView('portal_queue');
                }}
              />
            )}

            {activeView === 'portal_review_trans' && selectedReviewRequest && (
              <P03_TranslationReview
                request={selectedReviewRequest}
                onBack={() => setActiveView('portal_queue')}
                onApproved={() => {
                  SyncService.syncLatestBundle();
                  setActiveView('portal_queue');
                }}
              />
            )}

            {activeView === 'portal_registry' && <P04_ContentRegistry />}

            {activeView === 'portal_audit' && <P05_AuditLog />}
          </div>
        )}
      </main>

      {/* Global Alarm Surface when triggered */}
      {activeAlarmDose && (
        <AlarmSurface
          dose={activeAlarmDose}
          onDismiss={() => setActiveAlarmDose(null)}
          onTake={(id: string) => localDb.markDoseTaken(id)}
          onLater={(id: string, mins: number) => localDb.postponeDose(id, mins)}
        />
      )}
    </div>
  );
};
