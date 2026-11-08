/**
 * MEDICARE UX Copy & Multi-Language Dictionary
 * Implements multilingual support for English, Telugu, Hindi, Tamil, and Kannada
 * As required by the MEDICARE Project Report and Poster Design.
 */

export type SupportedLocale = 'en' | 'te' | 'hi' | 'ta' | 'kn';

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  script: string;
}

export const supportedLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
];

export const uxCopyEn: Record<string, string> = {
  // Brand
  'brand.name': 'MEDICARE',
  'brand.tagline': 'Smart Medicine. Safe Life.',
  'brand.motto': 'Your Health Our Priority',
  'brand.subtext': 'An AI-Powered Smart Medication Management and Patient Safety Mobile Application',

  // Splash & Auth
  'splash.getStarted': 'Get Started →',
  'auth.createAccount': 'Create Account',
  'auth.fullName': 'Full Name',
  'auth.mobile': 'Mobile Number',
  'auth.email': 'Email Address',
  'auth.password': 'Create Password',
  'auth.register': 'Register',
  'auth.haveAccount': 'Already have an account?',
  'auth.login': 'Login',

  // Language
  'lang.title': 'Select Language',
  'lang.subtitle': 'భాషను ఎంచుకోండి',
  'lang.continue': 'Continue →',

  // Home Dashboard
  'home.greeting': 'Hello, User! 👋',
  'home.banner.title': 'Take your medicines on time!',
  'home.action.scanRx': 'Scan Prescription',
  'home.action.scanMed': 'Scan Medicine',
  'home.action.reminders': 'Reminders',
  'home.action.expiry': 'Expiry Alerts',
  'home.action.records': 'My Records',
  'home.action.donate': 'Donate Medicines',

  // Navigation
  'nav.home': 'Home',
  'nav.history': 'History',
  'nav.feedback': 'Feedback',
  'nav.profile': 'Profile',

  // Scanning
  'scan.rx.title': 'Scan Prescription',
  'scan.rx.tap': 'Tap to capture',
  'scan.med.title': 'Scan Medicine',
  'scan.detailsExtracted': 'Details Extracted',
  'scan.confirm': 'Confirm',

  // Verification preview
  'verify.title': 'Verification Required',
  'verify.subtitle': 'Some information needs pharmacist verification.',
  'verify.lockBox': 'Continue to instructions preview',
  'verify.later': 'or Continue Later',
  'verify.badge': 'Verified by Pharmacist',
  'verify.medInfo': 'Medicine Information',
  'verify.transUnlocked': 'Translation Unlocked',

  // Reminders
  'reminder.set': 'Set Reminder',
  'reminder.enable': 'Enable Reminder',
  'reminder.save': 'Save',
  'reminder.snooze': 'Snooze',
  'reminder.stop': 'Stop / Taken',

  // Expiry
  'expiry.alertTitle': 'Expiry Alert',
  'expiry.alertBanner': 'This medicine is expiring in 7 days!',
  'expiry.viewDetails': 'View Details',

  // Suspicious
  'suspicious.title': 'Suspicious Medicine Detected!',
  'suspicious.body': 'Please verify with a pharmacist.',
  'suspicious.contact': 'Contact Pharmacist',

  // Records
  'records.title': 'My Records',
  'records.tab.all': 'All',
  'records.tab.active': 'Active',
  'records.tab.completed': 'Completed',

  // Donate
  'donate.title': 'Donate Unused Medicines',
  'donate.subtitle': 'Help others by donating unused medicines to authorised centres.',
  'donate.cta': 'Donate Now',

  // Feedback
  'feedback.title': 'Your Feedback Matters!',
  'feedback.rate': 'Rate your experience',
  'feedback.placeholder': 'Your suggestions...',
  'feedback.submit': 'Submit',

  // Translation Dictionaries for sample instructions
  'trans.paracetamol': 'Take 1 tablet twice daily after food.',
  'trans.amoxicillin': 'Take 1 capsule three times daily for 7 days.',
  'trans.pantoprazole': 'Take 1 tablet in the morning before food.',

  // Legacy compatibility keys
  'home.door.scan.title': 'Smart Scan',
  'home.door.scan.hint': 'Scan your prescription or medicine strip',
  'home.door.manual.title': 'Manual Setup',
  'home.door.manual.hint': 'Add a medicine yourself',
  'home.next.label': 'Next medicine',
  'home.empty.title': 'No medicines yet',
  'home.empty.body': 'Scan a prescription or add a medicine to start reminders.',
  'home.offline.pill': 'Offline. Reminders still work.',
  'alarm.title': 'Time for your medicine',
  'alarm.taken': 'Taken',
  'alarm.later': 'Remind me later',
  'alarm.later.pick': 'Remind me in {minutes} minutes',
  'alarm.undo': 'Undo',
  'alarm.group.all': 'Taken all',
  'dose.status.taken': 'Taken',
  'dose.status.missed': 'Missed',
  'dose.status.postponed': 'Postponed',
  'dose.status.due': 'Due now',
  'lock.badge.verified': 'Verified by a pharmacist',
  'lock.badge.unverified': 'Not verified yet',
  'lock.badge.review': 'A pharmacist is checking this',
};

export const uxCopyTe: Record<string, string> = {
  // Brand
  'brand.name': 'మెడికేర్ (MEDICARE)',
  'brand.tagline': 'స్మార్ట్ మెడిసిన్. సురక్షిత జీవనం.',
  'brand.motto': 'మీ ఆరోగ్యం మా ప్రాధాన్యత',
  'brand.subtext': 'ఏఐ ఆధారిత ఔషధ నిర్వహణ మరియు రోగి రక్షణ మొబైల్ అప్లికేషన్',

  // Splash & Auth
  'splash.getStarted': 'ప్రారంభించండి →',
  'auth.createAccount': 'ఖాతా సృష్టించండి',
  'auth.fullName': 'పూర్తి పేరు',
  'auth.mobile': 'మొబైల్ నంబర్',
  'auth.email': 'ఈమెయిల్ చిరునామా',
  'auth.password': 'పాస్‌వర్డ్ సృష్టించండి',
  'auth.register': 'నమోదు చేసుకోండి',
  'auth.haveAccount': 'ఇప్పటికే ఖాతా ఉందా?',
  'auth.login': 'లాగిన్ అవ్వండి',

  // Language
  'lang.title': 'భాషను ఎంచుకోండి',
  'lang.subtitle': 'Select Language',
  'lang.continue': 'ముందుకు సాగండి →',

  // Home Dashboard
  'home.greeting': 'నమస్కారం! 👋',
  'home.banner.title': 'సమయానికి మందులు వేసుకోండి!',
  'home.action.scanRx': 'ప్రిస్క్రిప్షన్ స్కాన్',
  'home.action.scanMed': 'మందుల స్కాన్',
  'home.action.reminders': 'రిమైండర్లు',
  'home.action.expiry': 'గడువు హెచ్చరికలు',
  'home.action.records': 'నా రికార్డులు',
  'home.action.donate': 'మందుల దానం',

  // Navigation
  'nav.home': 'హోమ్',
  'nav.history': 'చరిత్ర',
  'nav.feedback': 'ఫీడ్‌బ్యాక్',
  'nav.profile': 'ప్రొఫైల్',

  // Scanning
  'scan.rx.title': 'ప్రిస్క్రిప్షన్ స్కాన్ చేయండి',
  'scan.rx.tap': 'ఫోటో తీయడానికి తాకండి',
  'scan.med.title': 'మందుల ప్యాకెట్ స్కాన్',
  'scan.detailsExtracted': 'వివరాలు పొందబడ్డాయి',
  'scan.confirm': 'నిర్ధారించండి',

  // Verification preview
  'verify.title': 'ధృవీకరణ అవసరం',
  'verify.subtitle': 'కొన్ని వివరాలకు ఫార్మసిస్ట్ ధృవీకరణ అవసరం.',
  'verify.lockBox': 'సూచనల ప్రివ్యూకు కొనసాగండి',
  'verify.later': 'లేదా తర్వాత కొనసాగించండి',
  'verify.badge': 'ఫార్మసిస్ట్ ధృవీకరించారు',
  'verify.medInfo': 'మందుల సమాచారం',
  'verify.transUnlocked': 'అనువాదం అందుబాటులోకి వచ్చింది',

  // Reminders
  'reminder.set': 'రిమైండర్ సెట్ చేయండి',
  'reminder.enable': 'రిమైండర్ ఆన్ చేయండి',
  'reminder.save': 'భద్రపరచండి',
  'reminder.snooze': 'కాసేపటి తర్వాత',
  'reminder.stop': 'వేసుకున్నాను / ఆపండి',

  // Expiry
  'expiry.alertTitle': 'గడువు హెచ్చరిక',
  'expiry.alertBanner': 'ఈ మందు గడువు 7 రోజుల్లో ముగుస్తుంది!',
  'expiry.viewDetails': 'వివరాలు చూడండి',

  // Suspicious
  'suspicious.title': 'అనుమానాస్పద మందు గుర్తించబడింది!',
  'suspicious.body': 'దయచేసి ఫార్మసిస్ట్‌తో ధృవీకరించుకోండి.',
  'suspicious.contact': 'ఫార్మసిస్ట్‌ను సంప్రదించండి',

  // Records
  'records.title': 'నా రికార్డులు',
  'records.tab.all': 'అన్నీ',
  'records.tab.active': 'ప్రస్తుతం',
  'records.tab.completed': 'పూర్తయినవి',

  // Donate
  'donate.title': 'మిగిలిన మందులను దానం చేయండి',
  'donate.subtitle': 'అధికారిక కేంద్రాలకు మిగిలిన మందులను అందించి ఇతరులకు సహాయం చేయండి.',
  'donate.cta': 'ఇప్పుడే దానం చేయండి',

  // Feedback
  'feedback.title': 'మీ అభిప్రాయం మాకు ముఖ్యం!',
  'feedback.rate': 'మీ అనుభవాన్ని రేట్ చేయండి',
  'feedback.placeholder': 'మీ సలహాలు...',
  'feedback.submit': 'సమర్పించండి',

  'trans.paracetamol': 'ఆహారం తర్వాత రోజుకు రెండుసార్లు 1 మాత్ర వేసుకోండి.',
  'trans.amoxicillin': '7 రోజుల పాటు రోజుకు మూడుసార్లు 1 క్యాప్సూల్ వేసుకోండి.',
  'trans.pantoprazole': 'ఉదయం అల్పాహారానికి ముందు 1 మాత్ర వేసుకోండి.',

  // Legacy compatibility keys
  'home.door.scan.title': 'స్మార్ట్ స్కాన్ (Smart Scan)',
  'home.door.scan.hint': 'మీ ప్రిస్క్రిప్షన్ లేదా మందుల పట్టీని స్కాన్ చేయండి',
  'home.door.manual.title': 'చేతితో నమోదు (Manual)',
  'home.door.manual.hint': 'మీ మందులను స్వయంగా నమోదు చేసుకోండి',
  'home.next.label': 'తదుపరి వేసుకోవాల్సిన మందు',
  'home.empty.title': 'ఇంకా మందులు లేవు',
  'home.empty.body': 'గుర్తుంచుకోవడానికి ప్రిస్క్రిప్షన్ స్కాన్ చేయండి లేదా మందును నమోదు చేయండి.',
  'home.offline.pill': 'ఆఫ్‌లైన్. అలారాలు పనిచేస్తాయి.',
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
  'lock.text.warning': 'ఇంకా ధృవీకరించబడలేదు. జాగ్రత్త.',
  'lock.gate.title': 'ఈ ఆడియో ఇంకా ధృవీకరించబడలేదు',
  'lock.gate.body': 'ఈ అనువాదాన్ని ఫార్మసిస్ట్ ఇంకా తనిఖీ చేయలేదు. ఇందులో పొరపాట్లు ఉండవచ్చు.',
  'lock.gate.english': 'ఆంగ్లంలో చూపించు',
  'lock.gate.pharmacist': 'ఫార్మసిస్ట్ ని అడగండి',
  'lock.gate.play': 'అయినా వినండి',
  'lock.explain.title': '"ధృవీకరించబడింది" అంటే ఏమిటి?',
  'lock.explain.body': 'అర్హత కలిగిన ఫార్మసిస్ట్ ఈ సమాచారాన్ని చదివి సరైనదని నిర్ధారించారు.',
};

export const uxCopyHi: Record<string, string> = {
  'brand.name': 'मेडिकेयर (MEDICARE)',
  'brand.tagline': 'स्मार्ट मेडिसिन। सुरक्षित जीवन।',
  'brand.motto': 'आपका स्वास्थ्य हमारी प्राथमिकता',
  'brand.subtext': 'एआई-संचालित स्मार्ट दवा प्रबंधन और रोगी सुरक्षा मोबाइल ऐप',
  'splash.getStarted': 'शुरू करें →',
  'auth.createAccount': 'खाता बनाएं',
  'auth.fullName': 'पूरा नाम',
  'auth.mobile': 'मोबाइल नंबर',
  'auth.email': 'ईमेल पता',
  'auth.password': 'पासवर्ड बनाएं',
  'auth.register': 'रजिस्टर करें',
  'auth.haveAccount': 'क्या पहले से खाता है?',
  'auth.login': 'लॉगिन करें',
  'lang.title': 'भाषा चुनें',
  'lang.subtitle': 'Select Language',
  'lang.continue': 'आगे बढ़ें →',
  'home.greeting': 'नमस्ते! 👋',
  'home.banner.title': 'अपनी दवाएं समय पर लें!',
  'home.action.scanRx': 'पर्चे को स्कैन करें',
  'home.action.scanMed': 'दवा को स्कैन करें',
  'home.action.reminders': 'रिमाइंडर',
  'home.action.expiry': 'समाप्ति अलर्ट',
  'home.action.records': 'मेरे रिकॉर्ड',
  'home.action.donate': 'दवा दान करें',
  'nav.home': 'होम',
  'nav.history': 'इतिहास',
  'nav.feedback': 'प्रतिक्रिया',
  'nav.profile': 'प्रोफाइल',
  'scan.rx.title': 'पर्चा स्कैन करें',
  'scan.rx.tap': 'फोटो खींचने के लिए टैप करें',
  'scan.med.title': 'दवा स्कैन करें',
  'scan.detailsExtracted': 'विवरण प्राप्त हुआ',
  'scan.confirm': 'पुष्टि करें',
  'verify.title': 'सत्यापन आवश्यक है',
  'verify.subtitle': 'कुछ जानकारी को फार्मासिस्ट के सत्यापन की आवश्यकता है।',
  'verify.lockBox': 'निर्देश पूर्वावलोकन जारी रखें',
  'verify.later': 'या बाद में जारी रखें',
  'verify.badge': 'फार्मासिस्ट द्वारा सत्यापित',
  'verify.medInfo': 'दवा की जानकारी',
  'verify.transUnlocked': 'अनुवाद अनलॉक हुआ',
  'reminder.set': 'रिमाइंडर सेट करें',
  'reminder.enable': 'रिमाइंडर सक्षम करें',
  'reminder.save': 'सहेजें',
  'reminder.snooze': 'बाद में याद दिलाएं',
  'reminder.stop': 'ली गई / बंद करें',
  'expiry.alertTitle': 'समाप्ति चेतावनी',
  'expiry.alertBanner': 'यह दवा 7 दिनों में समाप्त हो रही है!',
  'expiry.viewDetails': 'विवरण देखें',
  'suspicious.title': 'संदिग्ध दवा का पता चला!',
  'suspicious.body': 'कृपया किसी फार्मासिस्ट से जांच कराएं।',
  'suspicious.contact': 'फार्मासिस्ट से संपर्क करें',
  'records.title': 'मेरे रिकॉर्ड',
  'records.tab.all': 'सभी',
  'records.tab.active': 'सक्रिय',
  'records.tab.completed': 'पूर्ण',
  'donate.title': 'अप्रयुक्त दवाएं दान करें',
  'donate.subtitle': 'अधिकृत केंद्रों को अप्रयुक्त दवाएं देकर दूसरों की मदद करें।',
  'donate.cta': 'अभी दान करें',
  'feedback.title': 'आपकी प्रतिक्रिया महत्वपूर्ण है!',
  'feedback.rate': 'अपने अनुभव को रेट करें',
  'feedback.placeholder': 'आपके सुझाव...',
  'feedback.submit': 'जमा करें',
  'trans.paracetamol': 'भोजन के बाद दिन में दो बार 1 गोली लें।',
  'trans.amoxicillin': '7 दिनों के लिए दिन में तीन बार 1 कैप्सूल लें।',
  'trans.pantoprazole': 'सुबह खाली पेट 1 गोली लें।',
};

export const uxCopyTa: Record<string, string> = {
  'brand.name': 'மெடிகேர் (MEDICARE)',
  'brand.tagline': 'ஸ்மார்ட் மருத்துவம். பாதுகாப்பான வாழ்வு.',
  'brand.motto': 'உங்கள் ஆரோக்கியம் எங்கள் முன்னுரிமை',
  'brand.subtext': 'செயற்கை நுண்ணறிவு அடிப்படையிலான மருந்து மேலாண்மை மொபைல் செயலி',
  'splash.getStarted': 'தொடங்கவும் →',
  'auth.createAccount': 'கணக்கை உருவாக்கவும்',
  'auth.fullName': 'முழுப் பெயர்',
  'auth.mobile': 'மொபைல் எண்',
  'auth.email': 'மின்னஞ்சல் முகவரி',
  'auth.password': 'கடவுச்சொல்லை உருவாக்கவும்',
  'auth.register': 'பதிவு செய்யவும்',
  'auth.haveAccount': 'ஏற்கனவே கணக்கு உள்ளதா?',
  'auth.login': 'உள்நுழையவும்',
  'lang.title': 'மொழியைத் தேர்ந்தெடுக்கவும்',
  'lang.subtitle': 'Select Language',
  'lang.continue': 'தொடரவும் →',
  'home.greeting': 'வணக்கம்! 👋',
  'home.banner.title': 'உங்கள் மருந்துகளை சரியான நேரத்தில் உட்கொள்ளுங்கள்!',
  'home.action.scanRx': 'மருத்துவ சீட்டு ஸ்கேன்',
  'home.action.scanMed': 'மருந்து ஸ்கேன்',
  'home.action.reminders': 'நினைவூட்டல்கள்',
  'home.action.expiry': 'காலாவதி எச்சரிக்கைகள்',
  'home.action.records': 'என் பதிவுகள்',
  'home.action.donate': 'மருந்துகளை தானம் செய்',
  'nav.home': 'முகப்பு',
  'nav.history': 'வரலாறு',
  'nav.feedback': 'கருத்து',
  'nav.profile': 'சுயவிவரம்',
  'scan.rx.title': 'மருத்துவ சீட்டை ஸ்கேன் செய்யவும்',
  'scan.rx.tap': 'படம் எடுக்க தட்டவும்',
  'scan.med.title': 'மருந்தை ஸ்கேன் செய்யவும்',
  'scan.detailsExtracted': 'விவரங்கள் பிரித்தெடுக்கப்பட்டன',
  'scan.confirm': 'உறுதிப்படுத்தவும்',
  'verify.title': 'சரிபார்ப்பு தேவை',
  'verify.subtitle': 'சில தகவல்களுக்கு மருந்தாளுநரின் சரிபார்ப்பு தேவை.',
  'verify.lockBox': 'அறிவுறுத்தல் முன்னோட்டத்திற்குத் தொடரவும்',
  'verify.later': 'அல்லது பின்னர் தொடரவும்',
  'verify.badge': 'மருந்தாளுநரால் சரிபார்க்கப்பட்டது',
  'verify.medInfo': 'மருந்து தகவல்',
  'verify.transUnlocked': 'மொழிபெயர்ப்பு திறக்கப்பட்டது',
  'reminder.set': 'நினைவூட்டலை அமைக்கவும்',
  'reminder.enable': 'நினைவூட்டலை இயக்கு',
  'reminder.save': 'சேமிக்க',
  'reminder.snooze': 'சற்று கழித்து',
  'reminder.stop': 'எடுத்துக்கொண்டேன் / நிறுத்து',
  'expiry.alertTitle': 'காலாவதி எச்சரிக்கை',
  'expiry.alertBanner': 'இந்த மருந்து 7 நாட்களில் காலாவதியாகிறது!',
  'expiry.viewDetails': 'விவரங்களைப் பார்க்கவும்',
  'suspicious.title': 'சந்தேகத்திற்கிடமான மருந்து கண்டறியப்பட்டது!',
  'suspicious.body': 'தயவுசெய்து மருந்தாளுநரிடம் சரிபார்க்கவும்.',
  'suspicious.contact': 'மருந்தாளுநரைத் தொடர்பு கொள்ளவும்',
  'records.title': 'என் பதிவுகள்',
  'records.tab.all': 'அனைத்தும்',
  'records.tab.active': 'செயலில் உள்ளவை',
  'records.tab.completed': 'முடிந்தவை',
  'donate.title': 'பயன்படுத்தப்படாத மருந்துகளை தானம் செய்யுங்கள்',
  'donate.subtitle': 'அங்கீகரிக்கப்பட்ட மையங்களுக்கு மருந்துகளை வழங்கி மற்றவர்களுக்கு உதவுங்கள்.',
  'donate.cta': 'இப்போது தானம் செய்யுங்கள்',
  'feedback.title': 'உங்கள் கருத்து முக்கியமானது!',
  'feedback.rate': 'உங்கள் அனுபவத்தை மதிப்பிடுங்கள்',
  'feedback.placeholder': 'உங்கள் பரிந்துரைகள்...',
  'feedback.submit': 'சமர்ப்பிக்கவும்',
  'trans.paracetamol': 'உணவுக்குப் பின் தினமும் இரண்டு முறை 1 மாத்திரை எடுத்துக் கொள்ளவும்.',
  'trans.amoxicillin': '7 நாட்களுக்கு தினமும் மூன்று முறை 1 காப்ஸ்யூல் எடுத்துக் கொள்ளவும்.',
  'trans.pantoprazole': 'காலை உணவுக்கு முன் 1 மாத்திரை எடுத்துக் கொள்ளவும்.',
};

export const uxCopyKn: Record<string, string> = {
  'brand.name': 'ಮೆಡಿಕೇರ್ (MEDICARE)',
  'brand.tagline': 'ಸ್ಮಾರ್ಟ್ ಮೆಡಿಸಿನ್. ಸುರಕ್ಷಿತ ಜೀವನ.',
  'brand.motto': 'ನಿಮ್ಮ ಆರೋಗ್ಯವೇ ನಮ್ಮ ಆದ್ಯತೆ',
  'brand.subtext': 'ಎಐ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಔಷಧ ನಿರ್ವಹಣೆ ಮತ್ತು ರೋಗಿ ಸುರಕ್ಷತೆಯ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್',
  'splash.getStarted': 'ಪ್ರಾರಂಭಿಸಿ →',
  'auth.createAccount': 'ಖಾತೆ ರಚಿಸಿ',
  'auth.fullName': 'ಪೂರ್ಣ ಹೆಸರು',
  'auth.mobile': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
  'auth.email': 'ಇಮೇಲ್ ವಿಳಾಸ',
  'auth.password': 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ',
  'auth.register': 'ನೋಂದಣಿ ಮಾಡಿ',
  'auth.haveAccount': 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?',
  'auth.login': 'ಲಾಗಿನ್ ಆಗಿ',
  'lang.title': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  'lang.subtitle': 'Select Language',
  'lang.continue': 'ಮುಂದುವರಿಯಿರಿ →',
  'home.greeting': 'ನಮಸ್ಕಾರ! 👋',
  'home.banner.title': 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ!',
  'home.action.scanRx': 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್',
  'home.action.scanMed': 'ಔಷಧ ಸ್ಕ್ಯಾನ್',
  'home.action.reminders': 'ಜ್ಞಾಪನೆಗಳು',
  'home.action.expiry': 'ಮುಕ್ತಾಯ ಎಚ್ಚರಿಕೆಗಳು',
  'home.action.records': 'ನನ್ನ ದಾಖಲೆಗಳು',
  'home.action.donate': 'ಔಷಧಿಗಳನ್ನು ದಾನ ಮಾಡಿ',
  'nav.home': 'ಮುಖಪುಟ',
  'nav.history': 'ಇತಿಹಾಸ',
  'nav.feedback': 'ಪ್ರತಿಕ್ರಿಯೆ',
  'nav.profile': 'ಪ್ರೊಫೈಲ್',
  'scan.rx.title': 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
  'scan.rx.tap': 'ಫೋಟೋ ತೆಗೆಯಲು ಸ್ಪರ್ಶಿಸಿ',
  'scan.med.title': 'ಔಷಧ ಪ್ಯಾಕೆಟ್ ಸ್ಕ್ಯಾನ್',
  'scan.detailsExtracted': 'ವಿವರಗಳನ್ನು ಹೊರತೆಗೆಯಲಾಗಿದೆ',
  'scan.confirm': 'ದೃಢೀಕರಿಸಿ',
  'verify.title': 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ',
  'verify.subtitle': 'ಕೆಲವು ಮಾಹಿತಿಗೆ ಫಾರ್ಮಸಿಸ್ಟ್ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.',
  'verify.lockBox': 'ಸೂಚನೆಗಳ ಪೂರ್ವವೀಕ್ಷಣೆಗೆ ಮುಂದುವರಿಯಿರಿ',
  'verify.later': 'ಅಥವಾ ನಂತರ ಮುಂದುವರಿಯಿರಿ',
  'verify.badge': 'ಫಾರ್ಮಸಿಸ್ಟ್ ಪರಿಶೀಲಿಸಿದ್ದಾರೆ',
  'verify.medInfo': 'ಔಷಧ ಮಾಹಿತಿ',
  'verify.transUnlocked': 'ಅನುವಾದ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ',
  'reminder.set': 'ಜ್ಞಾಪನೆಯನ್ನು ಹೊಂದಿಸಿ',
  'reminder.enable': 'ಜ್ಞಾಪನೆ ಸಕ್ರಿಯಗೊಳಿಸಿ',
  'reminder.save': 'ಉಳಿಸಿ',
  'reminder.snooze': 'ಸ್ನೂಜ್ ಮಾಡಿ',
  'reminder.stop': 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ / ನಿಲ್ಲಿಸಿ',
  'expiry.alertTitle': 'ಮುಕ್ತಾಯ ಎಚ್ಚರಿಕೆ',
  'expiry.alertBanner': 'ಈ ಔಷಧವು 7 ದಿನಗಳಲ್ಲಿ ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ!',
  'expiry.viewDetails': 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
  'suspicious.title': 'ಅನುಮಾನಾಸ್ಪದ ಔಷಧ ಪತ್ತೆಯಾಗಿದೆ!',
  'suspicious.body': 'ದಯವಿಟ್ಟು ಫಾರ್ಮಸಿಸ್ಟ್ ಬಳಿ ಪರಿಶೀಲಿಸಿ.',
  'suspicious.contact': 'ಫಾರ್ಮಸಿಸ್ಟ್ ಸಂಪರ್ಕಿಸಿ',
  'records.title': 'ನನ್ನ ದಾಖಲೆಗಳು',
  'records.tab.all': 'ಎಲ್ಲವೂ',
  'records.tab.active': 'ಸಕ್ರಿಯ',
  'records.tab.completed': 'ಪೂರ್ಣಗೊಂಡಿದೆ',
  'donate.title': 'ಬಳಕೆಯಾಗದ ಔಷಧಿಗಳನ್ನು ದಾನ ಮಾಡಿ',
  'donate.subtitle': 'ಅಧಿಕೃತ ಕೇಂದ್ರಗಳಿಗೆ ಬಳಕೆಯಾಗದ ಔಷಧಿಗಳನ್ನು ನೀಡುವ ಮೂಲಕ ಇತರರಿಗೆ ಸಹಾಯ ಮಾಡಿ.',
  'donate.cta': 'ಈಗಲೇ ದಾನ ಮಾಡಿ',
  'feedback.title': 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಮುಖ್ಯವಾಗಿದೆ!',
  'feedback.rate': 'ನಿಮ್ಮ ಅನುಭವವನ್ನು ರೇಟ್ ಮಾಡಿ',
  'feedback.placeholder': 'ನಿಮ್ಮ ಸಲಹೆಗಳು...',
  'feedback.submit': 'ಸಲ್ಲಿಸಿ',
  'trans.paracetamol': 'ಊಟದ ನಂತರ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
  'trans.amoxicillin': '7 ದಿನಗಳವರೆಗೆ ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ 1 ಕ್ಯಾಪ್ಸುಲ್ ತೆಗೆದುಕೊಳ್ಳಿ.',
  'trans.pantoprazole': 'ಬೆಳಿಗ್ಗೆ ಉಪಹಾರಕ್ಕೆ ಮುಂಚಿತವಾಗಿ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
};

export const getUxCopy = (locale: SupportedLocale): Record<string, string> => {
  switch (locale) {
    case 'te':
      return uxCopyTe;
    case 'hi':
      return uxCopyHi;
    case 'ta':
      return uxCopyTa;
    case 'kn':
      return uxCopyKn;
    case 'en':
    default:
      return uxCopyEn;
  }
};

export const t = (key: string, locale: SupportedLocale = 'en'): string => {
  const dict = getUxCopy(locale);
  return dict[key] || uxCopyEn[key] || key;
};

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
  '1': 'ఒకటి (1)',
  '1/2': 'సగం (1/2)',
  '2': 'రెండు (2)',
  '3': 'మూడు (3)',
  'tablet': 'మాత్ర (Tablet)',
  'tablets': 'మాత్రలు (Tablets)',
  'capsule': 'క్యాప్సూల్ (Capsule)',
  'capsules': 'క్యాప్సూల్స్ (Capsules)',
  'syrup': 'స్పూను సిరప్ (Syrup)',
  'drops': 'చుక్కలు (Drops)',
  'morning': 'ఉదయం (Morning)',
  'afternoon': 'మధ్యాహ్నం (Afternoon)',
  'evening': 'సాయంత్రం (Evening)',
  'night': 'రాత్రి (Night)',
};
