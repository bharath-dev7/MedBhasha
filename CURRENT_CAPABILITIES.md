# Current Capabilities

**Assessment date:** 8 November 2026  
**Scope:** Source code and project configuration in this repository. This report describes code-backed behavior, not proposed features or claims in the earlier README.

## Executive summary

MedBhasha currently provides an interactive web prototype with two connected parts:

1. A patient-facing demonstration app with sample-driven medication screens and browser-local state.
2. An Express trust-layer backend with in-memory review, content-bundle, and audit workflows, including a pharmacist portal.

The trust-layer workflow has working API routes and the automated test suite passes. The patient interface contains many functioning interactions, but its primary scan screens use predefined scenarios and several features that might appear operational are simulations. The patient app and backend both build successfully after the fixes described in this update. This repository should therefore be treated as a prototype, not a deployable clinical application.

## Capability status

| Area | Current status | What the code does |
|---|---|---|
| Patient interface | Implemented as a browser demonstration | Provides a home screen and interactive screens for account entry, language choice, scans, verification, medicine records, reminders, alerts, donations, feedback, and profile information. |
| Prescription scan in the main app | Demonstration | `MedicareScanPrescription` displays sample prescriptions and returns the selected sample after a short simulated scan. It does not capture an image or call OCR. |
| Prescription extraction API | Implemented, with optional external AI | `POST /v1/extract` returns sample extraction data by default. If `GEMINI_API_KEY` and an image are supplied, the backend attempts Gemini Vision extraction and falls back to sample data if that attempt fails. The main app's active prescription screen does not call this endpoint. |
| Medicine-package scan in the main app | Demonstration | `MedicareScanMedicine` presents sample package details and sample suspicious/expired cases. It does not scan a live package or verify products against a medicine database. |
| Pharmacist review portal | Implemented as a demo workflow | The portal reads review requests and can approve or reject them. Approving a translation content request updates in-memory status and publishes a signed content bundle. The initial queue is seeded with a demonstration request. |
| Translation verification | Partially implemented | English and Telugu instruction templates, verification states, content gating, and signed-bundle validation exist. Other language choices are available in the interface, but the pharmacist content workflow is seeded for Telugu and translation coverage is incomplete across the app. |
| Language support | Partial | English, Telugu, Hindi, Tamil, and Kannada are selectable. The presence of a language option does not mean every screen or instruction is fully translated. |
| Dose reminders | Local/demo only | The reminder screen saves a 24-hour schedule and selected weekdays in browser-local state, generating today's dose events only for selected weekdays. The in-app snooze preview can re-open after ten minutes while the screen remains mounted. It does not register reliable background or operating-system notifications. |
| Expiry and suspicious-medicine alerts | Sample presentation | Screens display sample expiry and suspicious-medicine cases. The main scan flow does not calculate expiry from a live scan or check authenticity against CDSCO, WHO, or another external catalogue. |
| Records | Local plus sample records | The records screen combines fixed sample records with medicines in the local browser store. It is not a synchronized patient record system. |
| Feedback and donation requests | Local demo records | Submissions are saved in browser-local state. The donation centres are sample entries; no external collection service is contacted. |
| Payments | Removed | The prototype no longer presents or records a payment flow. |
| Voice output | Browser-dependent | The verified-details screen uses the browser Web Speech API when available. Voice availability and pronunciation depend on the browser and installed voices. |
| Offline support | Browser-local data only | The app stores state in `localStorage` and includes an offline-mode setting. This is not an encrypted offline database, and it does not guarantee background reminders. |

## Patient app details

The main shell in [`patient-app/src/App.tsx`](patient-app/src/App.tsx) starts on the patient home screen and switches between the patient screens and portal. The visible patient demonstration includes:

- Account form interactions that save a profile locally; there is no server-side identity or password authentication.
- A five-language selector and localized sample instruction strings. Most interface screens remain primarily English.
- Sample prescription and medicine scenarios that navigate into verification and alert screens.
- An instructions-preview screen that clearly states no pharmacist review or payment takes place in the demo.
- Medicine records with sample entries and locally added medicines.
- A reminder form that saves a local schedule and an alarm modal that can be manually demonstrated.
- Repeat-day selection affects local dose generation. The snooze preview uses a ten-minute timer only while its screen remains mounted; it is not a background notification.
- Expiry and suspicious-medicine screens using demonstration data.
- Donation and feedback forms that save entries locally.
- Browser speech synthesis for reading selected medication instructions aloud.

The repository also contains a second set of more detailed workflow screens under `patient-app/src/screens/` (for example `S03_ScanPrescription.tsx` and `S14_SettingsHealthCheck.tsx`). The active app shell imports the `screens/medicare/` versions instead. The alternate screens include code for features such as camera capture, upload, and API-based extraction, but those features are not part of the main patient navigation flow at present.

## Backend and trust-layer API

The Express application in [`backend/src/index.ts`](backend/src/index.ts) exposes these routes:

- `GET /health` — service status and the current signing public key.
- `POST /v1/extract` — sample extraction by default; optional Gemini Vision extraction when configured with an API key and image.
- `POST /v1/review-requests`, `GET /v1/review-requests`, and `GET /v1/review-requests/:id` — create and retrieve review requests.
- `GET /v1/bundles/latest` — retrieve the latest locale bundle, with a not-modified response when the requested version is current.
- `POST /v1/escalations` and `DELETE /v1/escalations/:id` or `/v1/escalations/by-dose/:doseId` — create and cancel in-memory escalation records.
- `GET /portal/queue` — list review requests for the portal.
- `POST /portal/items/:id/approve` and `POST /portal/items/:id/reject` — record review decisions; approval of translation content can publish a bundle.
- `GET /portal/audit` and `GET /portal/content-registry` — read the audit log and content registry.
- `POST /portal/bundle/publish` — publish a locale bundle.

Backend state is seeded at startup and held in process memory. It is lost when the server restarts. The backend signer creates an Ed25519 key pair at startup, so the signing identity is not a durable production key-management setup. The API and portal also do not implement user authentication or authorization. The portal identifies itself as a demonstration and does not claim that its review identities are authenticated or that its log is immutable.

The shared modules in `shared/` define the data contracts, demonstration catalogues, localized copy, and cryptographic bundle helpers. The patient client includes bundle hash, version, and signature-validation logic and uses a content gate for instruction status.

## Known limitations and readiness

- **Not suitable for clinical use:** Extraction, medication verification, and instructions require independent professional confirmation.
- **No production user accounts:** The account screen writes profile details to the browser store only.
- **No payments:** The former ₹1 demo payment proposal was removed from the patient workflow.
- **No reliable scheduled notifications:** Reminder saving does not integrate with a mobile operating system or push-notification service.
- **No durable or encrypted persistence:** Browser state uses `localStorage`; backend state is in-memory.
- **No real-world medicine authenticity or donation integration:** Catalogue checks and donation submissions are not connected to external services.
- **Incomplete localization:** Language options exist, but localized coverage is not comprehensive.
- **No pharmacist identity verification:** Portal review names and credential details are supplied as request data or demonstration defaults.

## Verification run for this assessment

Commands were run from the project root:

| Check | Result |
|---|---|
| `npm test` | Passed: 5 test files, 25 tests. |
| `npm --prefix backend run build` | Passed: backend TypeScript compilation. |
| `npm --prefix patient-app run build` | Passed: TypeScript check and Vite production build. |

Re-run these checks after future code changes to confirm the repository's current status.
