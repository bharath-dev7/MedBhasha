/**
 * Curated Medicine Catalogue
 * Fulfills S11: Trusted sources only, shown with source and date.
 * Bundled offline dataset covering common senior medications.
 */

import { CuratedMedicineInfo } from './contracts';

export const curatedMedicineCatalogue: CuratedMedicineInfo[] = [
  {
    medicine_id: 'med_metformin_500',
    name: 'Metformin',
    generic_name: 'Metformin Hydrochloride 500mg',
    category: 'Antidiabetic (Type 2 Diabetes)',
    simple_uses: 'Helps control blood sugar levels by improving insulin sensitivity.',
    simple_uses_te: 'శరీరంలో చక్కెర స్థాయిలను అదుపులో ఉంచడానికి సహాయపడుతుంది.',
    common_side_effects: [
      'Mild stomach upset or nausea',
      'Metallic taste in mouth',
      'Take with meals to reduce stomach discomfort',
    ],
    common_side_effects_te: [
      'కడుపులో అసౌకర్యం లేదా వికారం',
      'నోటిలో చేదు/లోహపు రుచి',
      'భోజనం తర్వాత వేసుకోవడం వల్ల కడుపు సమస్యలు తగ్గుతాయి',
    ],
    precautions: 'Do not skip meals. Drink adequate water. Avoid excessive alcohol.',
    precautions_te: 'భోజనం మానవద్దు. తగినంత నీరు త్రాగండి.',
    source_name: 'Indian Pharmacopoeia & National Health Portal (NHP India)',
    source_url: 'https://nhp.gov.in/disease/diabetes-mellitus',
    retrieved_at: '2026-10-31',
    is_verified: true,
  },
  {
    medicine_id: 'med_amlodipine_5',
    name: 'Amlodipine',
    generic_name: 'Amlodipine Besylate 5mg',
    category: 'Antihypertensive (Blood Pressure)',
    simple_uses: 'Relaxes blood vessels so blood flows more easily, lowering high blood pressure.',
    simple_uses_te: 'రక్తపోటును (BP) అదుపులో ఉంచి రక్తనాళాలు విశ్రాంతి పొందేలా చేస్తుంది.',
    common_side_effects: [
      'Mild swelling in ankles or feet',
      'Occasional dizziness when standing up quickly',
    ],
    common_side_effects_te: [
      'పాదాలు లేదా చీలమండల వద్ద కొద్దిగా వాపు',
      'ఒక్కసారిగా లేచినప్పుడు తేలికపాటి మైకం',
    ],
    precautions: 'Take around the same time every day. Stand up slowly from sitting or lying down.',
    precautions_te: 'రోజూ ఒకే సమయానికి వేసుకోండి. కూర్చుని లేచేటప్పుడు నెమ్మదిగా లేవండి.',
    source_name: 'WHO Model Formulary & Central Drugs Standard Control Organisation (CDSCO)',
    source_url: 'https://cdsco.gov.in',
    retrieved_at: '2026-10-31',
    is_verified: true,
  },
  {
    medicine_id: 'med_pantoprazole_40',
    name: 'Pantoprazole',
    generic_name: 'Pantoprazole Gastro-resistant 40mg',
    category: 'Proton Pump Inhibitor (Acidity & Gastritis)',
    simple_uses: 'Reduces excess stomach acid to relieve heartburn and prevent ulcers.',
    simple_uses_te: 'కడుపులో ఆసిడ్ ఉత్పత్తిని తగ్గించి గ్యాస్ మరియు మంటను నివారిస్తుంది.',
    common_side_effects: [
      'Mild headache',
      'Diarrhea or flatulence',
    ],
    common_side_effects_te: [
      'తేలికపాటి తలనొప్పి',
      'కడుపుబ్బరం',
    ],
    precautions: 'Best taken 30-60 minutes before morning breakfast with plain water.',
    precautions_te: 'ఉదయం అల్పాహారానికి 30 నిమిషాల ముందు వేసుకోవాలి.',
    source_name: 'British National Formulary / National Health Portal',
    source_url: 'https://nhp.gov.in',
    retrieved_at: '2026-10-31',
    is_verified: true,
  },
  {
    medicine_id: 'med_paracetamol_650',
    name: 'Paracetamol',
    generic_name: 'Paracetamol 650mg',
    category: 'Analgesic & Antipyretic (Pain & Fever)',
    simple_uses: 'Relieves mild to moderate pain and reduces body temperature during fever.',
    simple_uses_te: 'శరీర నొప్పులు మరియు జ్వరాన్ని తగ్గించడానికి ఉపయోగపడుతుంది.',
    common_side_effects: [
      'Well-tolerated at recommended doses',
      'Do not exceed 4 grams (6 tablets) in 24 hours',
    ],
    common_side_effects_te: [
      'సాధారణ మోతాదులో సురక్షితమైనది',
      'రోజుకు గరిష్ట మోతాదు మించకూడదు',
    ],
    precautions: 'Maintain at least 4 to 6 hours between doses. Do not combine with other paracetamol products.',
    precautions_te: 'ఒక మోతాదుకు మరో మోతాదుకు మధ్య కనీసం 4-6 గంటల వ్యవధి ఉండాలి.',
    source_name: 'CDSCO National List of Essential Medicines',
    source_url: 'https://cdsco.gov.in',
    retrieved_at: '2026-10-31',
    is_verified: true,
  },
  {
    medicine_id: 'med_atorvastatin_10',
    name: 'Atorvastatin',
    generic_name: 'Atorvastatin Calcium 10mg',
    category: 'Lipid-lowering (Cholesterol)',
    simple_uses: 'Lowers bad cholesterol (LDL) and triglycerides to protect the heart.',
    simple_uses_te: 'కొలెస్ట్రాల్‌ను తగ్గించి గుండె ఆరోగ్యాన్ని కాపాడుతుంది.',
    common_side_effects: [
      'Mild muscle ache or joint pain',
      'Mild digestive disturbance',
    ],
    common_side_effects_te: [
      'కండరాల నొప్పులు లేదా కీళ్ల నొప్పులు',
      'తేలికపాటి జీర్ణ సమస్యలు',
    ],
    precautions: 'Usually taken at bedtime once daily. Report any unusual severe muscle pain to doctor.',
    precautions_te: 'రాత్రి పడుకునే ముందు వేసుకోవడం మంచిది.',
    source_name: 'National Health Authority & Indian Pharmacopoeia',
    source_url: 'https://nha.gov.in',
    retrieved_at: '2026-10-31',
    is_verified: true,
  },
];

export function getCuratedMedicine(nameOrId: string): CuratedMedicineInfo | null {
  const query = nameOrId.toLowerCase().trim();
  return (
    curatedMedicineCatalogue.find(
      (m) =>
        m.medicine_id.toLowerCase() === query ||
        m.name.toLowerCase().includes(query) ||
        query.includes(m.name.toLowerCase())
    ) || null
  );
}
