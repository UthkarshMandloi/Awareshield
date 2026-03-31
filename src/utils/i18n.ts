export const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' }
];

export const translations: Record<string, Record<string, string>> = {
  en: {
    start: "Take The Audit Today",
    next: "Next Question →",
    analyze: "Analyze Security",
    posture: "Security Posture",
    priority: "Priority Actions",
    download: "DOWNLOAD FULL REPORT (PDF)",
    badge: "DOWNLOAD BADGE",
    generating: "GENERATING...",
    systemsSecure: "SYSTEMS SECURE"
  },
  hi: {
    start: "आज ही ऑडिट करें",
    next: "अगला प्रश्न →",
    analyze: "सुरक्षा का विश्लेषण करें",
    posture: "सुरक्षा स्थिति",
    priority: "प्राथमिकता कार्य",
    download: "पूरी रिपोर्ट डाउनलोड करें (PDF)",
    badge: "बैज डाउनलोड करें ",
    generating: "बनाया जा रहा है...",
    systemsSecure: "सिस्टम सुरक्षित है"
  },
  // We provide English fallbacks for the rest of the UI text to save space. 
  // It can be expanded manually.
  ta: { start: "இன்றே தணிக்கை செய்யவும்", next: "அடுத்த கேள்வி →", analyze: "பகுப்பாய்வு", posture: "பாதுகாப்பு நிலை", priority: "முன்னுரிமை", download: "அறிக்கையைப் பதிவிறக்குக (PDF)", badge: "பேட்ஜ் பதிவிறக்குக ", generating: "உருவாக்கப்படுகிறது...", systemsSecure: "பாதுகாப்பானது" },
  te: { start: "ఈరోజే ఆడిట్ ప్రారంభించండి", next: "తదుపరి ప్రశ్న →", analyze: "విశ్లేషించు", posture: "భద్రతా స్థితి", priority: "ప్రాముఖ్యత పనులు", download: "పూర్తి నివేదిక డౌన్‌లోడ్ (PDF)", badge: "బ్యాడ్జ్ డౌన్‌లోడ్ ", generating: "సృష్టిస్తోంది...", systemsSecure: "భద్రంగా ఉంది" },
  mr: { start: "आजच ऑडिट करा", next: "पुढचा प्रश्न →", analyze: "विश्लेषण करा", posture: "सुरक्षा स्थिती", priority: "प्राधान्य कृती", download: "संपूर्ण अहवाल डाउनलोड करा (PDF)", badge: "बॅज डाउनलोड करा ", generating: "तयार करत आहे...", systemsSecure: "सुरक्षित" },
  gu: { start: "આજે જ ઓડિટ કરો", next: "આગળનો પ્રશ્ન →", analyze: "વિશ્લેષણ કરો", posture: "સુરક્ષા સ્થિતિ", priority: "પ્રાથમિકતા", download: "સંપૂર્ણ રિપોર્ટ ડાઉનલોડ કરો (PDF)", badge: "બેજ ડાઉનલોડ કરો ", generating: "બનાવી રહ્યું છે...", systemsSecure: "સુરક્ષિત" },
  as: { start: "আজি অডিট কৰক", next: "পৰৱৰ্তী প্ৰশ্ন →", analyze: "বিশ্লেষণ", posture: "সুৰক্ষা অৱস্থা", priority: "প্ৰাথমিকতা", download: "সম্পূৰ্ণ ৰিপৰ্ট ডাউনলোড কৰক (PDF)", badge: "বেজ ডাউনলোড কৰক 📸", generating: "প্ৰস্তুত কৰি আছে...", systemsSecure: "সুৰক্ষিত" },
  bn: { start: "আজই অডিট করুন", next: "পরবর্তী প্রশ্ন →", analyze: "বিশ্লেষণ করুন", posture: "নিরাপত্তা পরিস্থিতি", priority: "অগ্রাধিকার", download: "সম্পূর্ণ রিপোর্ট ডাউনলোড করুন (PDF)", badge: "ব্যাজ ডাউনলোড করুন ", generating: "তৈরি হচ্ছে...", systemsSecure: "সুরক্ষিত" },
  or: { start: "ଆଜି ହିଁ ଅଡିଟ୍ କରନ୍ତୁ", next: "ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ →", analyze: "ବିଶ୍ଳେଷଣ କରନ୍ତୁ", posture: "ସୁରକ୍ଷା ସ୍ଥିତି", priority: "ପ୍ରାଥମିକତା", download: "ସମ୍ପୂର୍ଣ୍ଣ ରିପୋର୍ଟ ଡାଉନଲୋଡ୍ କରନ୍ତୁ (PDF)", badge: "ବ୍ୟାଜ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ ", generating: "ପ୍ରସ୍ତୁତ ହେଉଛି...", systemsSecure: "ସୁରକ୍ଷିତ" }
};

export function getTranslation(lang: string, key: string) {
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  return translations['en'][key]; // Fallback
}
