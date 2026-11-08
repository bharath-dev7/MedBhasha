# MedBhasha

MedBhasha is a web-based prototype for medication management and multilingual medication instructions. It combines a patient-facing demonstration app with an Express API and a pharmacist-oriented content review portal.

> **Project status:** This is a demonstration prototype, not a production healthcare service or a substitute for advice from a qualified healthcare professional. Several patient flows use sample data or simulated interactions. See the [current capabilities report](CURRENT_CAPABILITIES.md) for what is implemented and what remains limited.

## What the project currently includes

- A React and TypeScript patient interface for browsing sample medicines, prescription and medicine scanning demonstrations, dose reminders, expiry and suspicious-medicine alerts, records, feedback, and donation requests.
- English, Telugu, Hindi, Tamil, and Kannada language choices. Translation coverage varies by screen and content.
- A local browser store that saves prototype data in `localStorage`.
- A reminder scheduler that creates local dose events for the selected weekdays while the app data is available. It does not provide background or operating-system notifications.
- An Express trust-layer API for sample extraction, review requests, signed content bundles, escalation records, and portal operations.
- A pharmacist portal demonstration for reviewing seeded requests, approving or rejecting content, viewing the content registry, and viewing audit events.
- Automated tests for the local store, translation gate, cryptographic bundle utilities, expiry logic, and MEDICARE features.

Many visible patient-app interactions are demonstrations rather than live services. The account flow creates a local demo profile, scans use preset examples in the main navigation, and medicine alerts do not query an authoritative drug database. The former ₹1 payment proposal has been removed; no payment is requested or collected.

## Technology

- **Patient app:** React, TypeScript, Vite
- **Trust layer:** Node.js, Express, TypeScript
- **Shared code:** TypeScript contracts, sample data, language copy, and bundle-signing utilities
- **Tests:** Vitest

## Run locally

Use a Node.js and npm version compatible with the dependencies in `package-lock.json`. From the project root:

```bash
npm install
```

Start the backend and patient app in separate terminals:

```bash
npm run start:backend
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite development server proxies API requests to the backend on port `4000`.

The backend starts with demonstration data and does not require an API key for its sample extraction response. To enable the optional Gemini Vision extraction endpoint, create `backend/.env` from `backend/.env.example` and set `GEMINI_API_KEY`. Keep API keys private and do not commit `.env` files.

Run the automated tests from the project root:

```bash
npm test
```

Build the backend with:

```bash
npm --prefix backend run build
```

Build the patient app with:

```bash
npm --prefix patient-app run build
```

## Project layout

```text
backend/       Express API, seeded trust-layer state, and bundle signing
patient-app/   React patient demo, pharmacist portal, and local browser store
shared/        Shared data contracts, sample data, language copy, and crypto helpers
```

The main app shell is `patient-app/src/App.tsx`. It switches between the patient demonstration and portal views. The pharmacist portal is part of the patient-app project and uses the same Vite server. The backend routes are defined in `backend/src/index.ts`; shared API and data types are in `shared/contracts.ts`.

## Safety and deployment note

Do not use this prototype to make treatment decisions or rely on it for medication reminders. It does not provide production authentication, encrypted data storage, durable server persistence, real pharmacist credential verification, or a validated clinical OCR workflow. The portal's review decisions and signed bundles are demonstrations, not clinical endorsements. Confirm prescriptions and medicine instructions with a qualified healthcare professional.
