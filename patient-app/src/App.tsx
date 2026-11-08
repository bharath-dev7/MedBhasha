/**
 * MEDICARE: Master Application Shell
 * An AI-Powered Smart Medication Management and Patient Safety Mobile Application
 * Faithfully implements all 14 screens and system architecture from the official project poster and report.
 */

import React, { useEffect, useState } from 'react';
import { localDb, LocalDatabaseState } from './db/localStore';

// Medicare Screens (Matching Poster Screens 1 to 14)
import { MedicareLogo } from './screens/medicare/MedicareLogo';
import { MedicareSplash } from './screens/medicare/MedicareSplash';
import { MedicareAuth } from './screens/medicare/MedicareAuth';
import { MedicareLanguageSelect } from './screens/medicare/MedicareLanguageSelect';
import { MedicareHome } from './screens/medicare/MedicareHome';
import { MedicareScanPrescription } from './screens/medicare/MedicareScanPrescription';
import { MedicareScanMedicine } from './screens/medicare/MedicareScanMedicine';
import { MedicareVerification } from './screens/medicare/MedicareVerification';
import { MedicareVerifiedDetails } from './screens/medicare/MedicareVerifiedDetails';
import { MedicareDoseReminder } from './screens/medicare/MedicareDoseReminder';
import { MedicareExpiryAlert } from './screens/medicare/MedicareExpiryAlert';
import { MedicareSuspiciousAlert } from './screens/medicare/MedicareSuspiciousAlert';
import { MedicareRecords } from './screens/medicare/MedicareRecords';
import { MedicareDonate } from './screens/medicare/MedicareDonate';
import { MedicareFeedback } from './screens/medicare/MedicareFeedback';
import { MedicareProfile } from './screens/medicare/MedicareProfile';
import { MedicareArchitecture } from './screens/medicare/MedicareArchitecture';

// Pharmacist Portal Screens (Part 2: Trust Layer & Clinical Oversight)
import { P01_ReviewQueue } from './portal/P01_ReviewQueue';
import { P02_PrescriptionReview } from './portal/P02_PrescriptionReview';
import { P03_TranslationReview } from './portal/P03_TranslationReview';
import { P04_ContentRegistry } from './portal/P04_ContentRegistry';
import { P05_AuditLog } from './portal/P05_AuditLog';

import { SupportedLocale, supportedLanguages } from '../../shared/ux-copy';
import { SamplePrescriptionScenario } from '../../shared/sample-data';
import { ReviewRequest } from '../../shared/contracts';
import {
  Smartphone,
  Stethoscope,
  Globe,
  Home,
  Clock,
  MessageSquare,
  User,
  Shield,
  Layers,
  ChevronDown,
  Wifi,
  SlidersHorizontal,
  X,
  ArrowLeft,
} from 'lucide-react';
import { SyncService } from './services/syncService';

export type MedicareView =
  | 'splash'
  | 'auth'
  | 'language'
  | 'home'
  | 'scan_rx'
  | 'scan_med'
  | 'verification'
  | 'verified_details'
  | 'dose_reminder'
  | 'expiry_alert'
  | 'suspicious_alert'
  | 'records'
  | 'donate'
  | 'feedback'
  | 'profile'
  | 'architecture';

export type PortalView =
  | 'portal_queue'
  | 'portal_review_rx'
  | 'portal_review_trans'
  | 'portal_registry'
  | 'portal_audit';

export const App: React.FC = () => {
  const [dbState, setDbState] = useState<LocalDatabaseState>(localDb.getState());
  const [appMode, setAppMode] = useState<'patient' | 'portal'>('patient');
  const [activeView, setActiveView] = useState<MedicareView>('home');
  const [portalView, setPortalView] = useState<PortalView>('portal_queue');
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ReviewRequest | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);

  // Active extracted context
  const [currentScenario, setCurrentScenario] = useState<SamplePrescriptionScenario | null>(null);
  const [activeMedicineName, setActiveMedicineName] = useState<string>('Paracetamol 500 mg');
  const [activeDosage, setActiveDosage] = useState<string>('1 Tablet Twice Daily');
  const [activeDuration, setActiveDuration] = useState<string>('5 Days');

  useEffect(() => {
    return localDb.subscribe(() => {
      setDbState({ ...localDb.getState() });
    });
  }, []);

  useEffect(() => {
    SyncService.syncLatestBundle();
  }, []);

  const handlePrescriptionExtracted = (scenario: SamplePrescriptionScenario) => {
    setCurrentScenario(scenario);
    if (scenario.medicines.length > 0) {
      setActiveMedicineName(scenario.medicines[0].name + ' ' + scenario.medicines[0].strength);
    }
    setActiveView('verification');
  };

  const handleMedicineScanned = (data: {
    medicineName: string;
    mfgDate: string;
    expDate: string;
    batchNo: string;
    isSuspicious?: boolean;
  }) => {
    setActiveMedicineName(data.medicineName);
    if (data.isSuspicious) {
      setActiveView('suspicious_alert');
    } else {
      setActiveView('verification');
    }
  };

  const handlePaymentSuccess = () => {
    setActiveView('verified_details');
  };

  const handleLanguageChange = (code: SupportedLocale) => {
    localDb.updateSettings({ locale: code });
  };

  // List of all 14 screens for quick switching
  const posterScreens: Array<{ id: MedicareView; label: string }> = [
    { id: 'splash', label: '1. Splash Screen' },
    { id: 'auth', label: '2. Registration / Account' },
    { id: 'language', label: '3. Language Selection' },
    { id: 'home', label: '4. Home Dashboard' },
    { id: 'scan_rx', label: '5. Prescription Scan' },
    { id: 'scan_med', label: '6. Medicine Scan' },
    { id: 'verification', label: '7. Pharmacist Verification (₹1)' },
    { id: 'verified_details', label: '8. Verified Details' },
    { id: 'dose_reminder', label: '9. Dose Reminder' },
    { id: 'expiry_alert', label: '10. Expiry Alert' },
    { id: 'suspicious_alert', label: '11. Suspicious Medicine Alert' },
    { id: 'records', label: '12. Medication Records' },
    { id: 'donate', label: '13. Donate Medicines' },
    { id: 'feedback', label: '14. Feedback' },
    { id: 'profile', label: '15. Profile & Safety Disclaimer' },
    { id: 'architecture', label: '16. System Architecture View' },
  ];

  // ONLY Home Dashboard (Screen 4) and Medication Records (Screen 12) have bottom nav on the poster!
  const showBottomNav = appMode === 'patient' && ['home', 'records'].includes(activeView);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: appMode === 'portal' ? '#0F172A' : '#E2E8F0' }}>
      {/* 
        TOP NAVIGATION BAR:
        Per user instruction: "i can see the nav bar even when in mobile mode so when am in mobilem ode i shouldnt see that"
        The desktop top header is ONLY shown when appMode === 'portal'!
      */}
      {appMode === 'portal' && (
        <header
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                }}
              >
                +
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '0.5px' }}>
                  MEDICARE Pharmacist Portal (Demo)
                </div>
                <div style={{ fontSize: '11px', color: '#5EEAD4', fontWeight: 600 }}>
                  Sample review workflow; no verified clinical sign-off
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setAppMode('patient');
              setActiveView('home');
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: '#1976D2',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Patient Mobile App</span>
          </button>
        </header>
      )}

      {/* Main Container */}
      <div className="medicare-phone-wrapper">
        {appMode === 'patient' ? (
          /* Mobile Phone Frame Mockup (Matches Poster Display) */
          <div className="medicare-phone-frame">
            {/* Phone Status Bar (Time, Battery, Wifi) */}
            <div className="medicare-status-bar">
              <span>09:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wifi size={13} />
                <span style={{ fontSize: '11px' }}>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Screen Content Body */}
            <div className="medicare-screen-content">
              {activeView === 'splash' && (
                <MedicareSplash onGetStarted={() => setActiveView('home')} />
              )}

              {activeView === 'auth' && (
                <MedicareAuth
                  onBack={() => setActiveView('home')}
                  onSuccess={() => setActiveView('home')}
                />
              )}

              {activeView === 'language' && (
                <MedicareLanguageSelect
                  onBack={() => setActiveView('home')}
                  onContinue={() => setActiveView('home')}
                />
              )}

              {activeView === 'home' && (
                <MedicareHome
                  onNavigate={(v) => setActiveView(v as MedicareView)}
                  onOpenAlerts={() => setActiveView('expiry_alert')}
                />
              )}

              {activeView === 'scan_rx' && (
                <MedicareScanPrescription
                  onBack={() => setActiveView('home')}
                  onExtracted={handlePrescriptionExtracted}
                />
              )}

              {activeView === 'scan_med' && (
                <MedicareScanMedicine
                  onBack={() => setActiveView('home')}
                  onConfirm={handleMedicineScanned}
                />
              )}

              {activeView === 'verification' && (
                <MedicareVerification
                  onBack={() => setActiveView('home')}
                  onPaymentSuccess={handlePaymentSuccess}
                  onContinueLater={() => setActiveView('home')}
                  medicineName={activeMedicineName}
                />
              )}

              {activeView === 'verified_details' && (
                <MedicareVerifiedDetails
                  onBack={() => setActiveView('home')}
                  onSetReminder={() => setActiveView('dose_reminder')}
                  medicineName={activeMedicineName}
                  dosage={activeDosage}
                  duration={activeDuration}
                />
              )}

              {activeView === 'dose_reminder' && (
                <MedicareDoseReminder
                  onBack={() => setActiveView('home')}
                  onSaved={() => setActiveView('records')}
                  medicineName={activeMedicineName}
                />
              )}

              {activeView === 'expiry_alert' && (
                <MedicareExpiryAlert
                  onBack={() => setActiveView('home')}
                  onViewDetails={() => setActiveView('records')}
                  medicineName={activeMedicineName}
                />
              )}

              {activeView === 'suspicious_alert' && (
                <MedicareSuspiciousAlert
                  onBack={() => setActiveView('home')}
                  onContactPharmacist={() => {
                    alert('Connecting with Licensed Hospital Pharmacist Helpline (1800-MED-CARE)...');
                  }}
                  medicineName={activeMedicineName}
                />
              )}

              {activeView === 'records' && (
                <MedicareRecords
                  onBack={() => setActiveView('home')}
                  onAddNew={() => setActiveView('scan_rx')}
                />
              )}

              {activeView === 'donate' && (
                <MedicareDonate
                  onBack={() => setActiveView('home')}
                  onSuccess={() => setActiveView('home')}
                />
              )}

              {activeView === 'feedback' && (
                <MedicareFeedback
                  onBack={() => setActiveView('home')}
                  onSubmitSuccess={() => setActiveView('home')}
                />
              )}

              {activeView === 'profile' && (
                <MedicareProfile
                  onBack={() => setActiveView('home')}
                  onSelectLanguage={() => setActiveView('language')}
                  onOpenArchitecture={() => setActiveView('architecture')}
                />
              )}

              {activeView === 'architecture' && (
                <MedicareArchitecture
                  onBack={() => setActiveView('home')}
                  onSwitchToPharmacistPortal={() => {
                    setAppMode('portal');
                    setPortalView('portal_queue');
                  }}
                  onJumpToScreen={(s) => setActiveView(s as MedicareView)}
                />
              )}
            </div>

            {/* Bottom 4-Tab Navigation: strictly only on Home & Records as shown in Poster */}
            {showBottomNav && (
              <nav className="medicare-bottom-nav">
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className={`medicare-nav-item ${activeView === 'home' ? 'active' : ''}`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('records')}
                  className={`medicare-nav-item ${activeView === 'records' ? 'active' : ''}`}
                >
                  <Clock size={20} />
                  <span>History</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('feedback')}
                  className={`medicare-nav-item ${activeView === 'feedback' ? 'active' : ''}`}
                >
                  <MessageSquare size={20} />
                  <span>Feedback</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('profile')}
                  className={`medicare-nav-item ${activeView === 'profile' ? 'active' : ''}`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
              </nav>
            )}
          </div>
        ) : (
          /* Pharmacist Review Portal (Part 2: Trust Layer & Clinical Oversight) */
          <div
            style={{
              width: '100%',
              maxWidth: '1100px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: '1px solid #CBD5E1',
            }}
          >
            {/* Portal Header */}
            <div
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #0F766E',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Stethoscope size={24} color="#38BDF8" />
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                    MEDICARE Pharmacist Portal (Demo)
                  </h2>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Demonstration review workflow • reviewer identities are not authenticated
                  </span>
                </div>
              </div>

              {/* Portal Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setPortalView('portal_queue')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: portalView === 'portal_queue' ? '#0F766E' : 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Review Queue
                </button>
                <button
                  onClick={() => setPortalView('portal_registry')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: portalView === 'portal_registry' ? '#0F766E' : 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Template Registry
                </button>
                <button
                  onClick={() => setPortalView('portal_audit')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: portalView === 'portal_audit' ? '#0F766E' : 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Audit Log (Demo)
                </button>
              </div>
            </div>

            {/* Portal Tab Contents */}
            <div style={{ padding: '24px' }}>
              {portalView === 'portal_queue' && (
                <P01_ReviewQueue
                  onSelectRequest={(request) => {
                    setSelectedReviewRequest(request);
                    setPortalView(
                      request.type === 'content_item' ? 'portal_review_trans' : 'portal_review_rx'
                    );
                  }}
                />
              )}
              {portalView === 'portal_review_rx' && selectedReviewRequest && (
                <P02_PrescriptionReview
                  request={selectedReviewRequest}
                  onBack={() => setPortalView('portal_queue')}
                  onReviewed={() => setPortalView('portal_queue')}
                />
              )}
              {portalView === 'portal_review_trans' && selectedReviewRequest && (
                <P03_TranslationReview
                  request={selectedReviewRequest}
                  onBack={() => setPortalView('portal_queue')}
                  onApproved={() => setPortalView('portal_queue')}
                />
              )}
              {portalView === 'portal_registry' && <P04_ContentRegistry />}
              {portalView === 'portal_audit' && <P05_AuditLog />}
            </div>
          </div>
        )}
      </div>

      {/* Discrete Floating Controls for Evaluators/Desktop only */}
      {appMode === 'patient' && (
        <>
          <div
            className="medicare-dev-controls"
            style={{
              position: 'fixed',
              bottom: '16px',
              right: '16px',
              zIndex: 999,
            }}
          >
            <button
              aria-label="Open screen and portal shortcuts"
              onClick={() => setShowDevTools(!showDevTools)}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Screens &amp; Portal</span>
            </button>
          </div>

          {/* Quick Drawer for jump testing */}
          {showDevTools && (
            <div
              className="medicare-dev-drawer"
              style={{
                position: 'fixed',
                bottom: '56px',
                right: '16px',
                width: '300px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: '1px solid #CBD5E1',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                  Quick Jump (Patient App Screens)
                </span>
                <button
                  onClick={() => setShowDevTools(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={16} />
                </button>
              </div>

              <select
                value={activeView}
                onChange={(e) => {
                  setActiveView(e.target.value as MedicareView);
                  setShowDevTools(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                }}
              >
                {posterScreens.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Language:</span>
                <select
                  value={dbState.settings.locale}
                  onChange={(e) => handleLanguageChange(e.target.value as SupportedLocale)}
                  style={{
                    padding: '6px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                  }}
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setAppMode('portal');
                  setPortalView('portal_queue');
                  setShowDevTools(false);
                }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Stethoscope size={14} />
                <span>Open Pharmacist Portal</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
