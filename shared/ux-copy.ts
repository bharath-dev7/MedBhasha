/**
 * MedBhasha UX Copy
 * Strictly implements ref/06-ux-copy.md
 * English is the source language; Telugu translations are governed by the Translation Lock.
 */

export const uxCopyEn: Record<string, string> = {
  // Home
  'home.door.scan.title': 'Smart Scan',
  'home.door.scan.hint': 'Scan your prescription or medicine strip',
  'home.door.manual.title': 'Manual Setup',
  'home.door.manual.hint': 'Add a medicine yourself',
  'home.next.label': 'Next medicine',
  'home.empty.title': 'No medicines yet',
  'home.empty.body': 'Scan a prescription or add a medicine to start reminders.',
  'home.offline.pill': 'Offline. Reminders still work.',

  // Scan prescription
  'scan.rx.title': 'Scan your prescription',
  'scan.rx.guide': 'Hold the paper flat and keep all the text inside the frame.',
  'scan.rx.dark': 'It is too dark. Move near a light.',
  'scan.rx.blurry': 'The photo is blurry. Hold still and try again.',
  'scan.rx.offline': 'Reading handwriting needs internet. You can still scan printed text or add the medicine yourself.',
  'scan.cloud.consent.title': 'Send this photo to read it?',
  'scan.cloud.consent.body': 'The photo is sent over the internet to help read the writing. It is not shared with anyone else. You can say no and add the medicine yourself.',
  'scan.cloud.consent.yes': 'Send photo',
  'scan.cloud.consent.no': 'Do not send',

  // Review & Confirm
  'review.title': 'Check your medicines',
  'review.field.unclear': 'Please check this. We could not read it clearly.',
  'review.confirm.cta': 'Confirm medicines',
  'review.confirm.blocked': 'Check the highlighted items first.',
  'review.pharmacist.cta': 'Ask a pharmacist to check',
  'review.extract.failed.title': 'Could not read the prescription',
  'review.extract.failed.body': 'The photo could not be read. Try again or add the medicines by hand.',

  // Expiry
  'expiry.title': 'Check the dates',
  'expiry.unknown.title': 'Expiry date not found',
  'expiry.unknown.body': 'We could not read the date. Scan again or type it from the strip.',
  'expiry.near': 'Expires soon: {date}',
  'expiry.expired.title': 'This medicine has expired',
  'expiry.expired.body': 'Expired on {date}. Do not take it. Ask a pharmacist for a new one.',
  'expiry.expired.ack': 'I understand. Keep reminders anyway.',

  // Alarm
  'alarm.title': 'Time for your medicine',
  'alarm.taken': 'Taken',
  'alarm.later': 'Remind me later',
  'alarm.later.pick': 'Remind me in {minutes} minutes',
  'alarm.undo': 'Undo',
  'alarm.group.all': 'Taken all',

  // Dose status
  'dose.status.taken': 'Taken',
  'dose.status.missed': 'Missed',
  'dose.status.postponed': 'Postponed',
  'dose.status.due': 'Due now',

  // Translation Lock
  'lock.badge.verified': 'Verified by a pharmacist',
  'lock.badge.unverified': 'Not verified yet',
  'lock.badge.review': 'A pharmacist is checking this',
  'lock.gate.title': 'This audio is not verified',
  'lock.gate.body': 'A pharmacist has not checked this translation yet. It may be wrong. Please do not rely on it for your medicine.',
  'lock.gate.english': 'Show in English',
  'lock.gate.pharmacist': 'Ask a pharmacist',
  'lock.gate.play': 'Play anyway',
  'lock.text.warning': 'Not verified yet. Check with a pharmacist.',
  'lock.explain.title': 'What does "verified" mean?',
  'lock.explain.body': 'A qualified pharmacist read this and agreed it is correct. Words that are not verified may contain mistakes.',

  // Guardian
  'guardian.title': 'Tell someone you trust',
  'guardian.preview': 'If you do not mark a dose within {minutes} minutes, we will send {name} this message: "{message}"',
  'guardian.consent': 'I agree to share this with {name}.',
  'guardian.test.cta': 'Send test message',
  'guardian.message.default': '{patient} has not confirmed a dose due at {time}.',
  'guardian.noonline': 'Guardian messages need internet. Reminders on your phone still work.',

  // Errors
  'err.camera.denied': 'Camera is off. The app needs the camera to scan. Open settings to turn it on.',
  'err.alarm.permission': 'Reminders are not allowed. Your phone may skip reminders without this. Open settings to allow them.',
  'err.network.generic': 'No internet right now. This will be sent when you are back online.',
  'err.sync.bundle.invalid': 'Could not use the update. The file did not pass a safety check. Your current information is unchanged.',

  // Confirm dialogs
  'confirm.delete.title': 'Delete {medicine}?',
  'confirm.delete.body': 'Its reminders and history will be removed. This cannot be undone.',
  'confirm.delete.yes': 'Delete medicine',
  'confirm.delete.no': 'Keep medicine',
};

export const uxCopyTe: Record<string, string> = {
  // Navigation & UI labels (verified by native speaker)
  'home.door.scan.title': 'స్మార్ట్ స్కాన్ (Smart Scan)',
  'home.door.scan.hint': 'మీ ప్రిస్క్రిప్షన్ లేదా మందుల పట్టీని స్కాన్ చేయండి',
  'home.door.manual.title': 'చేతితో నమోదు (Manual)',
  'home.door.manual.hint': 'మీ మందులను స్వయంగా నమోదు చేసుకోండి',
  'home.next.label': 'తదుపరి వేసుకోవాల్సిన మందు',
  'home.empty.title': 'ఇంకా మందులు లేవు',
  'home.empty.body': 'గుర్తుంచుకోవడానికి ప్రిస్క్రిప్షన్ స్కాన్ చేయండి లేదా మందును నమోదు చేయండి.',
  'home.offline.pill': 'ఆఫ్‌లైన్. అలారాలు పనిచేస్తాయి.',

  'scan.rx.title': 'ప్రిస్క్రిప్షన్ స్కాన్ చేయండి',
  'scan.rx.guide': 'కాగితాన్ని సమానంగా పట్టుకుని, అక్షరాలు ఫ్రేమ్ లోపల ఉంచండి.',
  'scan.rx.dark': 'చీకటిగా ఉంది. వెలుతురులో పెట్టండి.',
  'scan.rx.blurry': 'ఫోటో స్పష్టంగా లేదు. కదలకుండా మళ్ళీ తీయండి.',
  'scan.rx.offline': 'చేతిరాత చదవడానికి ఇంటర్నెట్ కావాలి. ముద్రించిన అక్షరాలు స్కాన్ చేయవచ్చు.',

  'review.title': 'మీ మందులను తనిఖీ చేయండి',
  'review.field.unclear': 'దయచేసి ఇది తనిఖీ చేయండి. అక్షరాలు స్పష్టంగా లేవు.',
  'review.confirm.cta': 'మందులను నిర్ధారించండి',
  'review.confirm.blocked': 'ఎరుపు రంగులో ఉన్న వివరాలను సరిచూడండి.',
  'review.pharmacist.cta': 'ఫార్మసిస్ట్ సహాయం కోరండి',

  'expiry.title': 'గడువు తేదీని తనిఖీ చేయండి',
  'expiry.unknown.title': 'గడువు తేదీ కనిపించలేదు',
  'expiry.unknown.body': 'తేదీ చదవలేకపోయాము. మళ్ళీ స్కాన్ చేయండి లేదా నమోదు చేయండి.',
  'expiry.near': 'త్వరలో గడువు ముగుస్తుంది: {date}',
  'expiry.expired.title': 'ఈ మందు గడువు ముగిసింది',
  'expiry.expired.body': 'గడువు ముగిసిన తేదీ {date}. ఈ మందు వేసుకోవద్దు. డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.',
  'expiry.expired.ack': 'నాకు అర్థమైంది. అలారాలు ఉంచండి.',

  'alarm.title': 'మీ మందు వేసుకునే సమయం',
  'alarm.taken': 'వేసుకున్నాను',
  'alarm.later': 'తర్వాత గుర్తుచేయి',
  'alarm.later.pick': '{minutes} నిమిషాల తర్వాత గుర్తుచేయి',
  'alarm.undo': 'వెనక్కి రద్దుచేయి',
  'alarm.group.all': 'అన్నీ వేసుకున్నాను',

  'dose.status.taken': 'వేసుకున్నారు',
  'dose.status.missed': 'వేసుకోలేదు',
  'dose.status.postponed': 'వాయిదా పడింది',
  'dose.status.due': 'ఇప్పుడు వేసుకోవాలి',

  'lock.badge.verified': 'ఫార్మసిస్ట్ ధృవీకరించారు',
  'lock.badge.unverified': 'ఇంకా ధృవీకరించబడలేదు',
  'lock.badge.review': 'ఫార్మసిస్ట్ తనిఖీ చేస్తున్నారు',
  'lock.gate.title': 'ఈ ఆడియో ఇంకా ధృవీకరించబడలేదు',
  'lock.gate.body': 'ఈ అనువాదాన్ని ఫార్మసిస్ట్ ఇంకా తనిఖీ చేయలేదు. ఇందులో పొరపాట్లు ఉండవచ్చు.',
  'lock.gate.english': 'ఆంగ్లంలో చూపించు',
  'lock.gate.pharmacist': 'ఫార్మసిస్ట్ ని అడగండి',
  'lock.gate.play': 'అయినా వినండి',
  'lock.text.warning': 'ఇంకా ధృవీకరించబడలేదు. జాగ్రత్త.',
  'lock.explain.title': '"ధృవీకరించబడింది" అంటే ఏమిటి?',
  'lock.explain.body': 'అర్హత కలిగిన ఫార్మసిస్ట్ ఈ సమాచారాన్ని చదివి సరైనదని నిర్ధారించారు.',

  'guardian.title': 'మీ ఆప్తులకు తెలియజేయండి',
  'guardian.consent': 'నేను ఈ వివరాలను పంచుకోవడానికి అంగీకరిస్తున్నాను.',
  'guardian.test.cta': 'పరీక్ష సందేశం పంపండి',
  'guardian.message.default': '{patient} గారు సమయానికి మందు వేసుకోలేదు.',
  'guardian.noonline': 'సందేశాలు పంపడానికి ఇంటర్నెట్ అవసరం.',
};

/**
 * Standard Instruction Template Definitions
 * Used by deterministic template engine (ADR-004)
 */
export interface TemplateDefinition {
  key: string;
  sourceEn: string;
  templateTe: string;
  foodRelation: string;
}

export const instructionTemplates: TemplateDefinition[] = [
  {
    key: 'instr.take.after_food',
    sourceEn: 'Take {qty} {form} after food.',
    templateTe: 'భోజనం తర్వాత {qty} {form} తీసుకోండి.',
    foodRelation: 'after',
  },
  {
    key: 'instr.take.before_food',
    sourceEn: 'Take {qty} {form} before food.',
    templateTe: 'భోజనం ముందు {qty} {form} తీసుకోండి.',
    foodRelation: 'before',
  },
  {
    key: 'instr.take.with_food',
    sourceEn: 'Take {qty} {form} with food.',
    templateTe: 'భోజనంతో పాటు {qty} {form} తీసుకోండి.',
    foodRelation: 'with',
  },
  {
    key: 'instr.take.any_time',
    sourceEn: 'Take {qty} {form} at scheduled time.',
    templateTe: 'నిర్దేశిత సమయానికి {qty} {form} తీసుకోండి.',
    foodRelation: 'any',
  },
];

export const slotTeluguWords: Record<string, string> = {
  // Quantities
  '1': 'ఒకటి (1)',
  '1/2': 'సగం (1/2)',
  '2': 'రెండు (2)',
  '3': 'మూడు (3)',
  // Forms
  'tablet': 'మాత్ర (Tablet)',
  'tablets': 'మాత్రలు (Tablets)',
  'capsule': 'క్యాప్సూల్ (Capsule)',
  'capsules': 'క్యాప్సూల్స్ (Capsules)',
  'syrup': 'స్పూను సిరప్ (Syrup)',
  'drops': 'చుక్కలు (Drops)',
  // Timings
  'morning': 'ఉదయం (Morning)',
  'afternoon': 'మధ్యాహ్నం (Afternoon)',
  'evening': 'సాయంత్రం (Evening)',
  'night': 'రాత్రి (Night)',
};
