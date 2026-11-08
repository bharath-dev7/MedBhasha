/**
 * Realistic Sample Prescriptions & Strips for Testing & Demonstrations
 * Covers all safety invariant scenarios (S1 unclear text, S2 draft confirmation,
 * S3 unknown expiry, S6 expired warning, etc.)
 */

import { ExtractedMedicineDraft } from './contracts';

export interface SamplePrescriptionScenario {
  id: string;
  title: string;
  description: string;
  doctor: string;
  clinic: string;
  patientName: string;
  patientAge: number;
  date: string;
  rawOcrText: string;
  hasUnclearFields: boolean;
  medicines: ExtractedMedicineDraft[];
}

export const samplePrescriptions: SamplePrescriptionScenario[] = [
  {
    id: 'rx_clear_standard',
    title: 'Dr. Rao Clinic (Clear Printed Prescription)',
    description: 'High-confidence printed prescription with Metformin and Pantoprazole. Ready for immediate confirmation.',
    doctor: 'Dr. K. S. Rao, MD (Internal Medicine)',
    clinic: 'Aarogyam Health Centre, Hyderabad',
    patientName: 'Venkatamma G.',
    patientAge: 68,
    date: '2026-10-28',
    rawOcrText: `AAROGYAM HEALTH CENTRE
Dr. K. S. Rao, MD
Reg: APMC/44912
Date: 28-10-2026
Patient: Venkatamma G. (68 F)

Rx:
1. Tab. Metformin 500mg
   1 tablet twice daily after food (Morning & Night) x 30 days
2. Tab. Pantoprazole 40mg
   1 tablet once daily before breakfast (Morning) x 15 days`,
    hasUnclearFields: false,
    medicines: [
      {
        temp_id: 'draft_med_1',
        name: 'Metformin',
        name_confidence: 0.98,
        strength: '500 mg',
        strength_confidence: 0.97,
        form: 'tablet',
        dose_qty: '1',
        dose_confidence: 0.96,
        frequency: 'daily_times',
        timings: ['08:00', '20:00'],
        timings_confidence: 0.95,
        food_relation: 'after',
        food_confidence: 0.96,
        duration_days: 30,
        duration_confidence: 0.95,
        is_unclear: false,
      },
      {
        temp_id: 'draft_med_2',
        name: 'Pantoprazole',
        name_confidence: 0.96,
        strength: '40 mg',
        strength_confidence: 0.95,
        form: 'tablet',
        dose_qty: '1',
        dose_confidence: 0.97,
        frequency: 'daily_times',
        timings: ['07:30'],
        timings_confidence: 0.94,
        food_relation: 'before',
        food_confidence: 0.96,
        duration_days: 15,
        duration_confidence: 0.93,
        is_unclear: false,
      },
    ],
  },
  {
    id: 'rx_unclear_handwritten',
    title: 'Govt General Hospital (Handwritten - Low Confidence S1)',
    description: 'Contains handwritten shorthand "1-0-1" and smudged quantity. Flagged as UNCLEAR to strictly enforce Safety Invariant S1 (user must inspect and confirm).',
    doctor: 'Dr. P. V. Raman, MBBS',
    clinic: 'Government Community Clinic, Secunderabad',
    patientName: 'Venkatamma G.',
    patientAge: 68,
    date: '2026-10-30',
    rawOcrText: `GGH Outpatient Department
Dr. P. V. Raman
Date: 30/10/26
Pt: Venkatamma (68Y)

Rx:
- Amlodipine 5mg [1 - 0 - 0] morning ...
- Paracetamol ?? 650mg [1 - 0 - 1] after food for body pain ?days`,
    hasUnclearFields: true,
    medicines: [
      {
        temp_id: 'draft_med_3',
        name: 'Amlodipine',
        name_confidence: 0.92,
        strength: '5 mg',
        strength_confidence: 0.94,
        form: 'tablet',
        dose_qty: '1',
        dose_confidence: 0.91,
        frequency: 'daily_times',
        timings: ['09:00'],
        timings_confidence: 0.88,
        food_relation: 'after',
        food_confidence: 0.85,
        duration_days: 30,
        duration_confidence: 0.82,
        is_unclear: false,
      },
      {
        temp_id: 'draft_med_4',
        name: 'Paracetamol',
        name_confidence: 0.89,
        strength: '650 mg',
        strength_confidence: 0.84,
        form: 'tablet',
        dose_qty: '1',
        dose_confidence: 0.52, // LOW CONFIDENCE -> UNCLEAR
        frequency: 'daily_times',
        timings: ['08:00', '20:00'],
        timings_confidence: 0.61, // LOW CONFIDENCE -> UNCLEAR
        food_relation: 'after',
        food_confidence: 0.72,
        duration_days: 5,
        duration_confidence: 0.45, // LOW CONFIDENCE -> UNCLEAR
        is_unclear: true,
        unclear_reason: 'Dose quantity and duration were handwritten with ambiguous shorthand (1-0-1). Please verify.',
      },
    ],
  },
];

export interface SampleStripScenario {
  id: string;
  medicineName: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  expStatus: 'valid' | 'near_expiry' | 'expired' | 'unknown';
  ocrConfidence: number;
  rawText: string;
  notes: string;
}

export const sampleStrips: SampleStripScenario[] = [
  {
    id: 'strip_metformin_valid',
    medicineName: 'Metformin 500mg (Glyciphage)',
    batchNo: 'B240981',
    mfgDate: '2026-02',
    expDate: '2028-01',
    expStatus: 'valid',
    ocrConfidence: 0.98,
    rawText: 'B.No. B240981 MFG.FEB 2026 EXP.JAN 2028 MRP Rs 38.50',
    notes: 'Clearly readable foil print; 14 months validity remaining.',
  },
  {
    id: 'strip_amlodipine_near',
    medicineName: 'Amlodipine 5mg (Amlong)',
    batchNo: 'AM7812',
    mfgDate: '2024-12',
    expDate: '2026-11',
    expStatus: 'near_expiry',
    ocrConfidence: 0.94,
    rawText: 'BATCH AM7812 MFG: 12/2024 EXP: 11/2026',
    notes: 'Expires in under 30 days! Triggers caution banner and expiry warning.',
  },
  {
    id: 'strip_painkiller_expired',
    medicineName: 'Paracetamol 650mg (Dolo)',
    batchNo: 'DL4401',
    mfgDate: '2023-04',
    expDate: '2025-03',
    expStatus: 'expired',
    ocrConfidence: 0.96,
    rawText: 'B.NO. DL4401 MFG: 04/2023 EXP: 03/2025',
    notes: 'EXPIRED! Enforces S6 invariant: blocks reminder activation until explicitly acknowledged.',
  },
  {
    id: 'strip_worn_unknown',
    medicineName: 'Pantoprazole 40mg (Pantocid)',
    batchNo: 'PT??91',
    mfgDate: '2025-??',
    expDate: '',
    expStatus: 'unknown',
    ocrConfidence: 0.38,
    rawText: 'B.NO. PT??91 MFG.2025 EXP.***ILLEGIBLE***',
    notes: 'Foil torn across expiry line. Strictly enforces S3: unknown stays unknown, never inferred.',
  },
];

export const sampleScenarios = samplePrescriptions;
export const sampleStripScenarios = sampleStrips;
