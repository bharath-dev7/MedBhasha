# MedBhasha: AI-Assisted Medication Assistant & Trust Layer

> **"Help an elderly or low-literacy person take the right medicine at the right time with confidence."**

MedBhasha is an offline-first, multilingual (Telugu + English) medication assistant designed for elderly users, backed by a cryptographic **Translation Lock** and clinical pharmacist verification portal. Built strictly against the specifications in [`ref/`](file:///c:/bunny/ph_V0/ref/).

---

## 🏗️ Architecture & Monorepo Structure

```
MedBhasha/
├── shared/                             # Seam between Part 1 & Part 2 (ref/02)
│   ├── contracts.ts                    # TypeScript data models, enums & schemas
│   ├── design-tokens.ts                # Design system tokens (ink, care, verified, tints)
│   ├── ux-copy.ts                      # English source strings & Telugu translations
│   ├── catalogue.ts                    # Attributable CDSCO/WHO medicine dataset (S11)
│   ├── sample-data.ts                  # Realistic test prescriptions & packaging strips
│   └── crypto-bundle.ts                # Ed25519 signing, canonical JSON, SHA-256
├── backend/                            # Part 2: Trust Layer API (Node.js/Express)
│   ├── src/
│   │   ├── index.ts                    # REST endpoints (/v1/extract, /v1/bundles, /portal/*)
│   │   ├── state.ts                    # Content registry, review queue, append-only audit log
│   │   └── signer.ts                   # Ed25519 cryptographic bundle signer
├── patient-app/                        # Part 1: Offline-First Patient PWA (React + Vite)
│   ├── index.html                      # Atkinson Hyperlegible & Noto Sans Telugu typography
│   ├── src/
│   │   ├── styles/tokens.css           # 56dp/72dp targets, high contrast tokens
│   │   ├── db/localStore.ts            # Encrypted/local offline SQLite-compatible store
│   │   ├── services/
│   │   │   ├── contentGate.ts          # Translation Lock client resolver (S5, S10)
│   │   │   ├── voiceService.ts         # Speech synthesis & harmonic audio chimes
│   │   │   └── syncService.ts          # Ed25519 signed bundle validator & offline queue
│   │   ├── components/                 # Design system components (ref/04)
│   │   │   ├── ActionButton.tsx        # 56dp minimum, 72dp primary, focus rings
│   │   │   ├── StatusPill.tsx          # Icon + word + tint (S8: never color alone)
│   │   │   ├── VerificationBadge.tsx   # Verified / Not verified / In review badges
│   │   │   ├── ConfirmField.tsx        # Unclear field detection & stepper (S1, S2)
│   │   │   ├── DoseCard.tsx            # Pictograms + medicine + status + one-tap action
│   │   │   ├── DayArc.tsx              # Signature sunrise-to-night sun path + ordered list
│   │   │   ├── UnverifiedGate.tsx      # Gated audio modal with deliberate confirmation (S5)
│   │   │   ├── ExpiryBadge.tsx         # Date + status (S3: unknown stays unknown)
│   │   │   ├── PictogramTile.tsx       # Sun, Moon, Food, Pill forms
│   │   │   └── AlarmSurface.tsx        # Solid ink backdrop, audio chime, 10s Undo (S7, S9)
│   │   ├── screens/                    # S01-S14 screens (ref/05)
│   │   │   ├── S01_Onboarding.tsx      # Language choice (Telugu/English), permissions
│   │   │   ├── S02_Home.tsx            # Day Arc, next dose, Smart Scan & Manual doors
│   │   │   ├── S03_ScanPrescription.tsx# Viewfinder, quality hints, cloud consent (S12)
│   │   │   ├── S04_PrescriptionReview.tsx# Unclear fields highlight, confirm blocker
│   │   │   ├── S05_ScanStrip.tsx       # Strip & carton packaging scan
│   │   │   ├── S06_ExpiryConfirm.tsx   # Expiry confirmation (valid, near, expired, unknown)
│   │   │   ├── S07_ScheduleReview.tsx  # Dosing timeline & activate reminders
│   │   │   ├── S08_ManualSetup.tsx     # Zero-typing stepper for elderly users
│   │   │   ├── S10_DoseHistory.tsx     # Weekly calendar history & 24h mistake fixer
│   │   │   ├── S11_MedicineDetail.tsx  # Medicine Safety Passport & clinical info (S11)
│   │   │   ├── S13_GuardianSetup.tsx   # Relative alerts, consent, test SMS (S7)
│   │   │   └── S14_SettingsHealthCheck.tsx # 200% font scale, exact alarm diagnostics
│   │   ├── portal/                     # P01-P05 Pharmacist Portal
│   │   │   ├── P01_ReviewQueue.tsx     # Pharmacist intake queue
│   │   │   ├── P03_TranslationReview.tsx# Side-by-side review with rendered slot examples
│   │   │   ├── P04_ContentRegistry.tsx # Template library & locale matrix (S10 staleness)
│   │   │   └── P05_AuditLog.tsx        # Append-only immutable clinical audit log
│   │   └── App.tsx                     # Integrated app shell & demo walkthrough
```

---

## 🛡️ Implementation of Safety Invariants (S1 - S12)

| Invariant | Implementation in MedBhasha | File Reference |
|---|---|---|
| **S1: Never guess** | Low-confidence OCR fields (`< 0.75`) are highlighted in `caution-tint` with an explicit "PLEASE CHECK (S1)" warning. They cannot be confirmed while untouched. | [`ConfirmField.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/components/ConfirmField.tsx), [`S04_PrescriptionReview.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/screens/S04_PrescriptionReview.tsx) |
| **S2: Drafts never trigger alarms** | Extracted fields remain in `confirm_status: 'draft'` and are completely excluded from the alarm/dose generator until the user explicitly taps "Confirm Medicines". | [`localStore.ts`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/db/localStore.ts#L270-L320) |
| **S3: Unknown stays unknown** | If expiry date on a foil strip cannot be read, status is marked `unknown`. Never inferred or auto-filled. Primary CTA becomes "Scan again". | [`ExpiryBadge.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/components/ExpiryBadge.tsx), [`S06_ExpiryConfirm.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/screens/S06_ExpiryConfirm.tsx) |
| **S4: No dosing advice** | The app extracts only what is printed on the prescription; it never suggests dose modifications or clinical diagnoses. | [`contracts.ts`](file:///c:/bunny/ph_V0/MedBhasha/shared/contracts.ts) |
| **S5: Translation Lock** | Regional-language text and audio start locked as `unverified`. Unverified audio triggers `UnverifiedGate` requiring deliberate confirmation before playing. | [`contentGate.ts`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/services/contentGate.ts), [`UnverifiedGate.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/components/UnverifiedGate.tsx) |
| **S6: Offline reliability** | All Part 1 core features (alarms, dose tracking, expiry checking, Day Arc, local DB) work in 100% airplane mode without internet. | [`localStore.ts`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/db/localStore.ts) |
| **S7: Guardian minimization & auto-cancel** | Minimal alert payload (no drug names by default). Marking a dose as Taken **immediately cancels** any scheduled guardian escalation. | [`AlarmSurface.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/components/AlarmSurface.tsx#L55-L70), [`S13_GuardianSetup.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/screens/S13_GuardianSetup.tsx) |
| **S8: Not color alone** | Every status uses an icon + text + color tint (e.g. Shield + check + green for verified; Shield + exclamation + amber for unverified). | [`StatusPill.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/components/StatusPill.tsx) |
| **S9: Tamper-evident signed content** | Verified content bundles are signed with Ed25519 and bound by canonical `content_sha256`. Client bundle importer rejects any bundle failing verification. | [`crypto-bundle.ts`](file:///c:/bunny/ph_V0/MedBhasha/shared/crypto-bundle.ts), [`syncService.ts`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/services/syncService.ts) |
| **S10: Fail safe & staleness** | Corrupt, unknown, or modified English source items become `stale` (treated strictly as `unverified` by the client). | [`crypto-bundle.ts`](file:///c:/bunny/ph_V0/MedBhasha/shared/crypto-bundle.ts#L160-L180) |
| **S11: Trusted sources only** | Clinical information is bundled from attributable datasets (CDSCO / WHO Formulary) with source name and retrieval date. Unknown medicines display "No verified information available". | [`catalogue.ts`](file:///c:/bunny/ph_V0/MedBhasha/shared/catalogue.ts), [`S11_MedicineDetail.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/screens/S11_MedicineDetail.tsx) |
| **S12: Privacy by default** | Prescription photos never leave the device unless the user explicitly grants cloud consent via the consent modal. | [`S03_ScanPrescription.tsx`](file:///c:/bunny/ph_V0/MedBhasha/patient-app/src/screens/S03_ScanPrescription.tsx#L190-L240) |

---

## 🚀 Running the Application

### 1. Start the Trust Layer Backend (Port 4000)
```bash
cd c:/bunny/ph_V0/MedBhasha/backend
npm start
```
*Runs on `http://localhost:4000` with active Ed25519 key generation and review queue.*

### 2. Start the Patient App & Reviewer Portal (Port 5173)
```bash
cd c:/bunny/ph_V0/MedBhasha/patient-app
npm run dev
```
*Open `http://localhost:5173/` in your browser.*

---

## 🎬 Testing the Flagship Demo Path (End-to-End)

1. **Explore the Home Screen:**
   - Look at the top bar with MedBhasha branding, **Airplane Mode** toggle, **Patient App (Part 1)** vs **Pharmacist Portal (Part 2)** tabs, and the **Flagship Demo Guide**.
   - Notice the **Day Arc**: an astronomical sunrise-to-night arc with markers for today's doses, positioned according to current time.
   - Look at the **Next Dose Card** for Metformin 500mg. Tap **చదివి వినిపించు (Play)**: notice the yellow **Not verified yet** badge triggers the **UnverifiedGate** modal, protecting the user from unapproved translations (S5).
2. **Perform Smart Scan:**
   - Tap the **స్మార్ట్ స్కాన్ (Smart Scan)** door.
   - Choose the test scenario: *Govt General Hospital (Handwritten - Low Confidence S1)*. Tap the shutter button and confirm the cloud consent prompt.
   - On the **Check Medicines** screen, notice that the handwritten Paracetamol dose is highlighted in yellow as `PLEASE CHECK (S1)` and the **Confirm Medicines** button is disabled.
   - Tap `Looks Correct` or `Change` to verify the dose &mdash; the button immediately unlocks! Tap **మందులను నిర్ధారించండి (Confirm Medicines)** (S2).
3. **Strip Expiry Scan:**
   - Tap the shutter button to scan the medicine packaging.
   - On the **Expiry Check** screen, observe the extracted dates (or test the torn foil scenario to see Invariant S3: *Unknown stays unknown*). Tap **Confirm Date & Proceed**.
4. **Schedule Review & Reminders Activation:**
   - View the pictograms (morning/evening sun, with/after food) and tap **అలారాలను ప్రారంభించండి (Activate Reminders)**.
5. **Simulate Offline Alarm & Auto-Cancellation (S6 & S7):**
   - Click the **అలారం టెస్ట్ (Alarm)** button in the top header.
   - The full-screen **AlarmSurface** appears with a solid `ink` backdrop, harmonic chimes, large typography, and pictograms.
   - Tap **వేసుకున్నాను (Taken)**: notice the 10-second Undo window and the confirmation that the guardian escalation was cancelled immediately!
6. **Translation Lock Verification & Sync (Flagship Highlight):**
   - In the top navbar, switch to **Pharmacist Portal (Part 2)**.
   - In the **Reviewer Queue**, find the pending translation item `instr.take.after_food`. Tap **Review**.
   - Review the side-by-side English source, proposed Telugu translation, and rendered slot examples.
   - Tap **Approve & Sign Bundle with Ed25519**. The Trust Layer signs a new cryptographic bundle and updates the append-only audit log.
   - Switch back to **Patient App (Part 1)** and tap **Sync** (or refresh).
   - Observe that `instr.take.after_food` turns into a green **Verified by a pharmacist** shield, and tapping audio now plays smoothly without any warning gate!
