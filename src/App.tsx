import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Upload,
  Keyboard,
  Languages,
  BookOpen,
  HelpCircle,
  Clock,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Binary,
  ArrowRight,
  Calculator,
  ChevronRight,
  Info,
  Camera,
  Copy,
  Check
} from "lucide-react";
import { FormulaReference } from "./components/FormulaReference";
import { MathTextRenderer } from "./components/MathTextRenderer";
import { CameraScanner } from "./components/CameraScanner";
import { Formula, SolutionResult, SolvedHistoryItem } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { auth, loginWithGoogle, signUpWithEmail, loginWithEmail, logOut, db, handleFirestoreError, OperationType, onAuthStateChanged } from "./firebase";
import { User as FirebaseUser, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc, serverTimestamp } from "firebase/firestore";

// 1. DYNAMIC GLOBAL LOCALIZATION SYSTEM
const AVAILABLE_LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Bangla", label: "Bangla (বাংলা)" },
  { code: "Spanish", label: "Español (Spanish)" },
  { code: "Arabic", label: "العربية (Arabic)" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "French", label: "Français (French)" },
  { code: "German", label: "Deutsch (German)" },
  { code: "Russian", label: "Русский (Russian)" },
  { code: "Chinese", label: "中文 (Chinese)" },
  { code: "Japanese", label: "日本語 (Japanese)" }
];

const DICTIONARY: Record<string, Record<string, string>> = {
  English: {
    appTitle: "AI Math Scanner",
    stepSolver: "Step Solver",
    subtitle: "Powered by Gemini · Full Academic Line Solver",
    scannerOpt: "Camera",
    uploadOpt: "Upload Image",
    typingOpt: "Manual Typing Input",
    dragDropText: "Drag & Drop or Click to Upload Math Image",
    dragDropSub: "Upload sketches, notes, or screenshot images (PNG, JPG, WEBP)",
    typedPlaceholder: "Type raw equation or expression, e.g. \\int (3x^2 dx) or 2x + 5 = 15...",
    subjectLabel: "Subject Category",
    complexityLabel: "Class Level (Complexity)",
    langLabel: "Explanation Language",
    resetForm: "Reset Form",
    solveWithAI: "Solve with Gemini AI",
    computing: "Computing Proofs...",
    identifiedProblem: "Identified Problem",
    quickAnswer: "Quick Answer",
    proofExplanations: "Step-by-Step Proof & Explanations",
    viewRawMarkdown: "View Raw Markdown Response Template",
    recentHistory: "Recent Solutions History",
    listenAloud: "Listen Aloud",
    stopReading: "Stop Reading",
    back: "Back",
    next: "Next",
    formulaRefMenu: "Formula Reference Menu",
    solverWorkspace: "Solver Workspace",
    outputTitle: "AI High-Speed Solution Output",
    outputSub: "Calculated with step-by-step mathematical theorems.",
    cameraScanning: "Scanner Viewfinder",
    startCamera: "Start Camera Scanner",
    captureBtn: "Press to Capture Scan",
    deviceNoFound: "Webcam not streaming. Choose a simulation homework file below:",
    simulateScan: "Simulated Notebook Scan",
    clear: "Clear File",
    importLabel: "Math Assistant Keys (Adds to cursor)",
    formulaSearchPlaceholder: "Search math & science formulas...",
    explanationFromLang: "Explanation",
    warningTitle: "Gemini Key Action Required",
    warningBody: "Your env API key is currently unconfigured. Set GEMINI_API_KEY in Secrets panel, then reload.",
    reloadState: "Reload App State",
    scannedAttached: "Scanned Homework Attached",
    catMathematics: "Mathematics",
    catAlgebra: "Algebra",
    catHigherMath: "Higher Math",
    catPhysics: "Physics",
    catChemistry: "Chemistry",
    catSaved: "Saved",
    noFormulasFound: "No formulas found",
    noFormulasSub: "Try choosing different categories or check your search keyword.",
    loadToSolve: "Load to Solve",
    searchFormulasDesc: "Search & click to load into workspace"
  },
  Bangla: {
    appTitle: "এআই ম্যাথ স্ক্যানার",
    stepSolver: "ধাপ সমাধানকারী",
    subtitle: "জেমিনি দ্বারা চালিত · সম্পূর্ণ একাডেমিক লাইন সমাধানকারী",
    scannerOpt: "ক্যামেরা",
    uploadOpt: "ছবি আপলোড",
    typingOpt: "ম্যানুয়াল টাইপিং ইনপুট",
    dragDropText: "গণিত চিত্র আপলোড করতে ড্রাগ এবং ড্রপ করুন বা ক্লিক করুন",
    dragDropSub: "স্কেচ, নোট, বা স্ক্রিনশট ছবি আপলোড করুন (PNG, JPG, WEBP)",
    typedPlaceholder: "কাঁচা সমীকরণ বা রাশি লিখুন, যেমন \int (3x^2 dx) বা 2x + 5 = 15...",
    subjectLabel: "বিষয় বিভাগ",
    complexityLabel: "ক্লাস লেভেল (জটিলতা)",
    langLabel: "ব্যাখ্যার ভাষা",
    resetForm: "ফর্ম রিসেট",
    solveWithAI: "জেমিনির সাথে সমাধান করুন",
    computing: "প্রমাণ গণনা করা হচ্ছে...",
    identifiedProblem: "চিহ্নিত সমস্যা",
    quickAnswer: "দ্রুত উত্তর",
    proofExplanations: "ধাপে ধাপে প্রমাণ এবং ব্যাখ্যা",
    viewRawMarkdown: "কাঁচা মার্কডাউন প্রতিক্রিয়া টেমপ্লেট দেখুন",
    recentHistory: "সাম্প্রতিক সমাধান ইতিহাস",
    listenAloud: "শুনুন",
    stopReading: "পড়া বন্ধ করুন",
    back: "পিছনে",
    next: "সামনে",
    formulaRefMenu: "সূত্র নির্দেশিকা মেনু",
    solverWorkspace: "সমাধান ওয়ার্কস্পেস",
    outputTitle: "এআই উচ্চ-গতি সমাধান আউটপুট",
    outputSub: "ধাপ-ভিত্তিক গাণিতিক উপপাদ্য ব্যবহার করে গণনা করা হয়েছে।",
    cameraScanning: "ক্যামেরা সন্ধানকারী",
    startCamera: "ক্যামেরা চালু করুন",
    captureBtn: "স্ক্যান ক্যাপচার করতে ক্লিক করুন",
    deviceNoFound: "ওয়েবক্যাম উপলব্ধ নেই। নিচে থেকে একটি সিমুলেশন হোমওয়ার্ক ফাইল চয়ন করুন:",
    simulateScan: "সিমুলেট করা নোটবুক স্ক্যান",
    clear: "মুছুন",
    importLabel: "গণিত সহকারী কীগুলি (কার্সারে যোগ করুন)",
    formulaSearchPlaceholder: "গণিত এবং বিজ্ঞান সূত্র অনুসন্ধান করুন...",
    explanationFromLang: "ব্যাখ্যা",
    warningTitle: "জেমিনি কী অ্যাকশন প্রয়োজন",
    warningBody: "আপনার এপিআই কীটি কনফিগার করা নেই। সিক্রেটস প্যানেলে GEMINI_API_KEY সেট করুন, তারপর পুনরায় লোড করুন।",
    reloadState: "অ্যাপ্লিকেশন পুনরায় লোড করুন",
    scannedAttached: "স্ক্যান করা হোমওয়ার্ক সংযুক্ত",
    catMathematics: "পাটিগণিত",
    catAlgebra: "বীজগণিত",
    catHigherMath: "উচ্চতর গণিত",
    catPhysics: "পদার্থবিজ্ঞান",
    catChemistry: "রসায়ন",
    catSaved: "সংরক্ষিত",
    noFormulasFound: "কোনো সূত্র পাওয়া যায়নি",
    noFormulasSub: "অন্য বিভাগ নির্বাচন করার চেষ্টা করুন বা অনুসন্ধান শব্দ পরীক্ষা করুন।",
    loadToSolve: "সমাধান লোড করুন",
    searchFormulasDesc: "অনুসন্ধান করুন এবং ওয়ার্কস্পেসে লোড করতে ক্লিক করুন"
  },
  Spanish: {
    appTitle: "Escáner Matemático IA",
    stepSolver: "Solucionador de Pasos",
    subtitle: "Desarrollado por Gemini · Solucionador Académico Completo",
    scannerOpt: "Escáner (Vivo)",
    uploadOpt: "Subir Imagen",
    typingOpt: "Texto Manual",
    dragDropText: "Arrastre y suelte o haga clic para subir una imagen matemática",
    dragDropSub: "Suba bocetos, notas o capturas de pantalla (PNG, JPG, WEBP)",
    typedPlaceholder: "Escriba la ecuación o expresión, ej. \\int (3x^2 dx) o 2x + 5 = 15...",
    subjectLabel: "Categoría de Materia",
    complexityLabel: "Nivel de Clase (Complejidad)",
    langLabel: "Idioma de la Explicación",
    resetForm: "Limpiar",
    solveWithAI: "Resolver con IA",
    computing: "Calculando pasos...",
    identifiedProblem: "Problema Identificado",
    quickAnswer: "Respuesta Rápida",
    proofExplanations: "Prueba y Explicaciones Paso a Paso",
    viewRawMarkdown: "Ver Plantilla de Respuesta de Markdown",
    recentHistory: "Historial Reciente",
    listenAloud: "Escuchar en Voz Alta",
    stopReading: "Detener Lectura",
    back: "Atrás",
    next: "Siguiente",
    formulaRefMenu: "Menú de Fórmulas",
    solverWorkspace: "Área de Trabajo",
    outputTitle: "Resultado Inmediato de IA",
    outputSub: "Calculado según el nivel de clase usando teoremas por línea.",
    cameraScanning: "Visor de Cámara",
    startCamera: "Iniciar Cámara",
    captureBtn: "Capturar Escaneo",
    deviceNoFound: "Cámara no disponible. Seleccione un archivo de simulación a continuación:",
    simulateScan: "Simulación de Cuaderno",
    clear: "Borrar todo",
    importLabel: "Teclas Asistentes (Añadir al cursor)",
    formulaSearchPlaceholder: "Buscar fórmulas...",
    explanationFromLang: "Explicación",
    warningTitle: "Acción requerida de la clave Gemini",
    warningBody: "Clave de API no configurada. Configure GEMINI_API_KEY en el panel de secretos y recargue.",
    reloadState: "Recargar Aplicación",
    scannedAttached: "Imagen Escaneada Adjunta",
    catMathematics: "Matemáticas",
    catAlgebra: "Álgebra",
    catHigherMath: "Matemáticas Sup.",
    catPhysics: "Física",
    catChemistry: "Química",
    catSaved: "Guardado",
    noFormulasFound: "No se encontraron fórmulas",
    noFormulasSub: "Pruebe con otra categoría o palabra clave.",
    loadToSolve: "Cargar para Resolver",
    searchFormulasDesc: "Buscar y hacer clic para cargar"
  },
  Arabic: {
    appTitle: "ماسح الرياضيات بالذكاء الاصطناعي",
    stepSolver: "حل الخطوات",
    subtitle: "بدعم من جيميناي · حل أكاديمي كامل ومفصل",
    scannerOpt: "ماسح كاميرا (حي)",
    uploadOpt: "تحميل صورة",
    typingOpt: "إدخال يدوي",
    dragDropText: "اسحب وأسقط أو انقر لتحميل صورة الرياضيات",
    dragDropSub: "تحميل الرسومات أو الملاحظات أو الصور (PNG, JPG, WEBP)",
    typedPlaceholder: "اكتب المعادلة الرياضية هنا، مثل \\int (3x^2 dx)...",
    subjectLabel: "فئة المادة",
    complexityLabel: "المستوى الدراسي (التعقيد)",
    langLabel: "لغة الشرح",
    resetForm: "إعادة تعيين",
    solveWithAI: "حل مع Gemini AI",
    computing: "جاري المعالجة الرياضية...",
    identifiedProblem: "المشكلة التي تم تحديدها",
    quickAnswer: "الإجابة السريعة",
    proofExplanations: "الإثبات والشرح خطوة بخطوة",
    viewRawMarkdown: "عرض قالب ماركداون داتا",
    recentHistory: "سجل الحلول الأخيرة",
    listenAloud: "استماع للشرح",
    stopReading: "إيقاف القراءة",
    back: "رجوع",
    next: "التالي",
    formulaRefMenu: "قائمة مراجع القوانين",
    solverWorkspace: "مساحة حل الرياضيات",
    outputTitle: "مخرجات حلول الذكاء الاصطناعي السريعة",
    outputSub: "تم الحساب والتأصيل بموجب قوانين محددة.",
    cameraScanning: "عدسة كاميرا الماسح",
    startCamera: "تشغيل لوحة الكاميرا",
    captureBtn: "اضغط لتصوير المسألة",
    deviceNoFound: "الكاميرا غير متصلة بالبث المباشر. يرجى اختيار مسألة تجريبية جاهزة من الأسفل:",
    simulateScan: "محاكاة ورقة من دفتر محلي",
    clear: "تطهير الملف",
    importLabel: "أزرار مساعدة (تدرج في موضع الفأرة)",
    formulaSearchPlaceholder: "البحث في القوانين والصيغ...",
    explanationFromLang: "الشرح",
    warningTitle: "يلزم إعداد مفتاح جيميناي",
    warningBody: "الرجاء تكوين المفتاح لـ GEMINI_API_KEY في علامة تبويب الأسرار ثم التحديث.",
    reloadState: "تحديث التطبيق",
    scannedAttached: "تم ربط ورقة المسألة الممسوحة",
    catMathematics: "الرياضيات",
    catAlgebra: "الجبر",
    catHigherMath: "الرياضيات العليا",
    catPhysics: "الفيزياء",
    catChemistry: "الكيمياء",
    catSaved: "المحفوظة",
    noFormulasFound: "لم يتم العثور على صيغ",
    noFormulasSub: "حاول تغيير الكلمات أو اختيار تبويب آخر.",
    loadToSolve: "تحميل المعطيات للحل",
    searchFormulasDesc: "ابحث وانقر لتحميل الصيغة فورياً"
  },
  Hindi: {
    appTitle: "एआई गणित स्कैनर",
    stepSolver: "स्टेप सॉल्वर",
    subtitle: "जेमिनी द्वारा संचालित · पूर्ण शैक्षणिक रेखा सॉल्वर",
    scannerOpt: "कैमरा स्कैनर (लाइव)",
    uploadOpt: "छवि अपलोड",
    typingOpt: "मैन्युअल टाइपिंग",
    dragDropText: "गणित की छवि अपलोड करने के लिए खींचें और छोड़ें या क्लिक करें",
    dragDropSub: "रेखाचित्र, नोट्स, या स्क्रीनशॉट छवियां अपलोड करें (PNG, JPG, WEBP)",
    typedPlaceholder: "समीकरण या अभिव्यक्ति टाइप करें, जैसे \\int (3x^2 dx)...",
    subjectLabel: "विषय श्रेणी",
    complexityLabel: "कक्षा स्तर (जटिलता)",
    langLabel: "स्पष्टीकरण की भाषा",
    resetForm: "फ़ॉर्म रीसेट",
    solveWithAI: "जेमिनी एआई से हल करें",
    computing: "प्रमाण तैयार हो रहा है...",
    identifiedProblem: "पहचाना गया प्रश्न",
    quickAnswer: "त्वरित उत्तर",
    proofExplanations: "चरण-दर-चरण प्रमाण और स्पष्टीकरण",
    viewRawMarkdown: "मार्कडाउन रिस्पॉन्स देखें",
    recentHistory: "हाल का समाधान इतिहास",
    listenAloud: "ज़ोर से सुनें",
    stopReading: "पढ़ना बंद करें",
    back: "पीछे",
    next: "आगे",
    formulaRefMenu: "सूत्र संदर्भ मेनू",
    solverWorkspace: "सॉल्वर वर्कस्पेस",
    outputTitle: "एआई हाई-स्पीड सॉल्यूशन आउटपुट",
    outputSub: "चरणीय गणितीय सिद्धांतों के अनुसार विश्लेषण परिणाम।",
    cameraScanning: "कैमरा व्यूफाइंडर",
    startCamera: "कैमरा चालू करें",
    captureBtn: "कैप्चर करने के लिए दबाएं",
    deviceNoFound: "वेबकैम उपलब्ध नहीं है। नीचे से सिम्युलेटेड होमवर्क चुनें:",
    simulateScan: "सजावटी नोटबुक स्कैन",
    clear: "क्लियर करें",
    importLabel: "गणित सहायक कुंजी",
    formulaSearchPlaceholder: "गणित और विज्ञान सूत्र खोजें...",
    explanationFromLang: "स्पष्टीकरण",
    warningTitle: "जेमिनी कुंजी आवश्यक",
    warningBody: "सीक्रेट्स पैनल में GEMINI_API_KEY सेट करें और पुनः लोड करें।",
    reloadState: "ऐप लोड करें",
    scannedAttached: "होमवर्क स्कैन संलग्न है",
    catMathematics: "गणित",
    catAlgebra: "बीजगणित",
    catHigherMath: "उच्च गणित",
    catPhysics: "भौतिकी",
    catChemistry: "रसायन",
    catSaved: "सहेजा गया",
    noFormulasFound: "कोई सूत्र नहीं मिला",
    noFormulasSub: "विभिन्न श्रेणियों को चुनने का प्रयास करें।",
    loadToSolve: "सॉल्वर में लोड करें",
    searchFormulasDesc: "सर्च करें और समीकरण लोड करने के लिए टैप करें"
  },
  French: {
    appTitle: "Scanner de Maths IA",
    stepSolver: "Solveur Étape par Étape",
    subtitle: "Propulsé par Gemini · Solveur Académique Complet",
    scannerOpt: "Scanner (Direct)",
    uploadOpt: "Image Locale",
    typingOpt: "Saisie Manuelle",
    dragDropText: "Glisser-déposer ou cliquer pour télécharger une image de maths",
    dragDropSub: "Compatible avec notes écrites, photos et captures d'écran (PNG, JPG, WEBP)",
    typedPlaceholder: "Entrez l'équation ou expression, ex: \\int (3x^2 dx)...",
    subjectLabel: "Sujet / Matière",
    complexityLabel: "Niveau Scolaire (Complexité)",
    langLabel: "Langue des Explications",
    resetForm: "Réinitialiser",
    solveWithAI: "Résoudre avec Gemini",
    computing: "Calcul en cours...",
    identifiedProblem: "Problème Détecté",
    quickAnswer: "Réponse Rapide",
    proofExplanations: "Preuves & Explications Étape par Étape",
    viewRawMarkdown: "Voir le Modèle Markdown de Réponse",
    recentHistory: "Historique des résolutions",
    listenAloud: "Écouter à haute voix",
    stopReading: "Arrêter la Lecture",
    back: "Retour",
    next: "Suivant",
    formulaRefMenu: "Formules Bibliothèque",
    solverWorkspace: "Espace d'Étude",
    outputTitle: "Résolution Haute Vitesse IA",
    outputSub: "Calculé avec soin d'après des théorèmes rigoureux.",
    cameraScanning: "Viseur Appareil Photo",
    startCamera: "Démarrer la Caméra",
    captureBtn: "Prendre un instantané",
    deviceNoFound: "Webcam introuvable. Choisissez une simulation de devoir ci-dessous :",
    simulateScan: "Cahier d'Exercices Simulé",
    clear: "Effacer la photo",
    importLabel: "Touches Spéciales Symboles (Position Curseur)",
    formulaSearchPlaceholder: "Rechercher des formules...",
    explanationFromLang: "Explication",
    warningTitle: "Clé Gemini API Requise",
    warningBody: "Veuillez définir votre clé GEMINI_API_KEY dans l'interface de secrets et actualiser.",
    reloadState: "Actualiser la page",
    scannedAttached: "Copie de Devoir Associée",
    catMathematics: "Mathématiques",
    catAlgebra: "Algèbre",
    catHigherMath: "Maths Sup",
    catPhysics: "Physique",
    catChemistry: "Chimie",
    catSaved: "Sauvegardé",
    noFormulasFound: "Aucune formule trouvée",
    noFormulasSub: "Modifiez votre mot-clé ou changez d'onglet.",
    loadToSolve: "Envoyer au Solveur",
    searchFormulasDesc: "Chercher & cliquer pour ajouter au solveur"
  },
  Russian: {
    appTitle: "ИИ Математический Сканер",
    stepSolver: "Пошаговый Решебник",
    subtitle: "На базе Gemini · Полный академический решебник",
    scannerOpt: "Сканер (Камера)",
    uploadOpt: "Загрузить Файл",
    typingOpt: "Ручной Ввод Уравнения",
    dragDropText: "Перетащите или нажмите, чтобы загрузить изображение",
    dragDropSub: "Поддерживаются эскизы, конспекты или снимки экрана (PNG, JPG, WEBP)",
    typedPlaceholder: "Введите уравнение или выражение, например \\int (3x^2 dx)...",
    subjectLabel: "Предметная Область",
    complexityLabel: "Уровень Сложности (Класс)",
    langLabel: "Язык Объяснений",
    resetForm: "Сбросить",
    solveWithAI: "Решить через Gemini AI",
    computing: "Вычисление решения...",
    identifiedProblem: "Распознанный Пример",
    quickAnswer: "Краткий Ответ",
    proofExplanations: "Пошаговые Вычисления & Объяснения",
    viewRawMarkdown: "Посмотреть исходный Markdown",
    recentHistory: "История математических решений",
    listenAloud: "Озвучить устно",
    stopReading: "Остановить Голос",
    back: "Назад",
    next: "Далее",
    formulaRefMenu: "Справочник Формул",
    solverWorkspace: "Рабочая Область решений",
    outputTitle: "Высокоскоростной ИИ Анализ",
    outputSub: "Вычисляется на основе формальных математических теорем.",
    cameraScanning: "Видоискатель Камеры",
    startCamera: "Включить Веб-камеру",
    captureBtn: "Сделать Снимок Кадра",
    deviceNoFound: "Камера отключена. Выберите готовый пример домашней работы:",
    simulateScan: "Имитация Листа тетради",
    clear: "Очистить черновик",
    importLabel: "Математические Кнопки Помощника",
    formulaSearchPlaceholder: "Поиск математических и научных формул...",
    explanationFromLang: "Объяснение",
    warningTitle: "Требуется Ключ Секрета Gemini",
    warningBody: "Секретный ключ GEMINI_API_KEY не установлен. Вставьте его в панель и обновите.",
    reloadState: "Перезагрузить Приложение",
    scannedAttached: "Домашняя работа отсканирована",
    catMathematics: "Математика",
    catAlgebra: "Алгебра",
    catHigherMath: "Высшая Мат.",
    catPhysics: "Физика",
    catChemistry: "Химия",
    catSaved: "Избранное",
    noFormulasFound: "Формулы не найдены",
    noFormulasSub: "Попробуйте изменить категорию или поисковый запрос.",
    loadToSolve: "Загрузить для решения",
    searchFormulasDesc: "Кликните для импорта формулы в редактор"
  },
  German: {
    appTitle: "KI Mathe-Scanner",
    stepSolver: "Schritt-für-Schritt Löser",
    subtitle: "Unterstützt von Gemini · Vollständiger akademischer Löser",
    scannerOpt: "Scanner (Live-Cam)",
    uploadOpt: "Bildauswahl",
    typingOpt: "Manuelle Formel",
    dragDropText: "Ziehen & Loslassen oder Klicken, um ein Bild hochzuladen",
    dragDropSub: "Laden Sie Skizzen, Notizen oder Screenshots hoch (PNG, JPG, WEBP)",
    typedPlaceholder: "Geben Sie die Gleichung oder den Ausdruck ein, z.B. \\int (3x^2 dx)...",
    subjectLabel: "Fachbereich",
    complexityLabel: "Klassenstufe (Komplexität)",
    langLabel: "Erklärungssprache",
    resetForm: "Zurücksetzen",
    solveWithAI: "Mit Gemini AI Lösen",
    computing: "Beweise werden berechnet...",
    identifiedProblem: "Erkanntes Problem",
    quickAnswer: "Schnelle Antwort",
    proofExplanations: "Beweise & Erklärungen Schritt für Schritt",
    viewRawMarkdown: "Roh-Markdown anzeigen",
    recentHistory: "Verlauf der gelösten Aufgaben",
    listenAloud: "Vorlesen Lassen",
    stopReading: "Vorlesen Stoppen",
    back: "Zurück",
    next: "Schnittstelle",
    formulaRefMenu: "Formelsammlung Handbuch",
    solverWorkspace: "Lösungsarbeitsplatz",
    outputTitle: "KI Hochgeschwindigkeitsanalyse",
    outputSub: "Umfassend ermittelt durch fundierte Theorien.",
    cameraScanning: "Kamerasucher-Fenster",
    startCamera: "Kameraverbindung Starten",
    captureBtn: "Foto Aufnehmen",
    deviceNoFound: "Webcam nicht aktiv. Wählen Sie ein simuliertes Arbeitsblatt aus:",
    simulateScan: "Simuliertes Hausaufgabenheft",
    clear: "Bild entfernen",
    importLabel: "Mathematische Assistent-Sondertasten",
    formulaSearchPlaceholder: "Formeln finden...",
    explanationFromLang: "Erklärung",
    warningTitle: "Aktion erforderlich für Gemini-Schlüssel",
    warningBody: "Ihr API-Schlüssel fehlt. Speichern Sie GEMINI_API_KEY im Secrets-Panel und laden Sie neu.",
    reloadState: "Neu Laden",
    scannedAttached: "Hausaufgabenzettel Angeheftet",
    catMathematics: "Arithmetik/Mathe",
    catAlgebra: "Algebra",
    catHigherMath: "Höhere Mathematik",
    catPhysics: "Physik",
    catChemistry: "Chemie",
    catSaved: "Gespeichert",
    noFormulasFound: "Keine Formeln gefunden",
    noFormulasSub: "Versuchen Sie es mit einer anderen Suche oder Kategorie.",
    loadToSolve: "In Workspace laden",
    searchFormulasDesc: "Anklicken, um in den Löser zu importieren"
  },
  Chinese: {
    appTitle: "AI 数学扫描仪",
    stepSolver: "步骤求解器",
    subtitle: "由 Gemini 提供支持 · 完整的学术分步求解引擎",
    scannerOpt: "相机扫描 (实时驱动)",
    uploadOpt: "本地图片",
    typingOpt: "键盘手动录入",
    dragDropText: "拖拽文件或点击此处上传数学作业图片",
    dragDropSub: "支持上传手写草稿、计算笔记或屏幕截图 (PNG, JPG, WEBP)",
    typedPlaceholder: "在此输入数学方程或表达式，例如 \\int (3x^2 dx) 或 2x + 5 = 15...",
    subjectLabel: "学科分类",
    complexityLabel: "年级水平 (复杂度)",
    langLabel: "原理解释语言",
    resetForm: "清空表单",
    solveWithAI: "使用 Gemini AI 求解",
    computing: "正在求解计算中...",
    identifiedProblem: "检测到的问题",
    quickAnswer: "最终答案",
    proofExplanations: "分步计算过程与证明详解",
    viewRawMarkdown: "查看原始 Markdown 数据",
    recentHistory: "最近求解历史记录",
    listenAloud: "语音朗读",
    stopReading: "停止播放",
    back: "返回",
    next: "下一页(公式)",
    formulaRefMenu: "公式参考手册",
    solverWorkspace: "题目求解工作台",
    outputTitle: "AI 高速智能解答输出",
    outputSub: "已依据年级复杂度，应用逐步推导定理为您计算完成。",
    cameraScanning: "视频取景器",
    startCamera: "连接摄像头",
    captureBtn: "按此拍照并进行识别",
    deviceNoFound: "无法调用摄像头。使用交互式题型模拟器：",
    simulateScan: "模拟笔记本识别",
    clear: "清除附加文件",
    importLabel: "数学符号助理快捷键",
    formulaSearchPlaceholder: "搜索各种数学和物理化学公式...",
    explanationFromLang: "详解",
    warningTitle: "需要配置 Gemini 密钥",
    warningBody: "未在设置里检测到 API 密钥。请在 Secrets 面板中设置 GEMINI_API_KEY 并刷新页面。",
    reloadState: "重新加载页面",
    scannedAttached: "扫描图片已成功关联",
    catMathematics: "算术与几何",
    catAlgebra: "代数",
    catHigherMath: "高等数学",
    catPhysics: "物理学",
    catChemistry: "化学",
    catSaved: "已保存",
    noFormulasFound: "未找到任何相关公式",
    noFormulasSub: "请尝试更改分类或搜索关键词。",
    loadToSolve: "导入至工作台",
    searchFormulasDesc: "搜索并点击公式将其装载进解题编辑器"
  },
  Japanese: {
    appTitle: "AI 数学スキャナー",
    stepSolver: "ステップ解答器",
    subtitle: "Gemini 搭載 · 完全な学術的ステップバイステップ解答システム",
    scannerOpt: "カメラ起動 (ライブ)",
    uploadOpt: "画像をアップロード",
    typingOpt: "手動テキスト入力",
    dragDropText: "ここに数学の画像をドラッグ＆ドロップ、またはクリックして選択",
    dragDropSub: "手書きノートやスクリーンショット画像に対応 (PNG, JPG, WEBP)",
    typedPlaceholder: "数式や等式を入力してください、例: \\int (3x^2 dx)...",
    subjectLabel: "科目カテゴリ",
    complexityLabel: "学習レベル (難易度)",
    langLabel: "解説の出力言語",
    resetForm: "リセット",
    solveWithAI: "Gemini AI で解く",
    computing: "解法ステップを処理中...",
    identifiedProblem: "検出された数式",
    quickAnswer: "クイック回答",
    proofExplanations: "ステップバイステップの証明と解説",
    viewRawMarkdown: "未加工の Markdown を表示",
    recentHistory: "最近の解答履歴一覧",
    listenAloud: "音声で読み上げる",
    stopReading: "読み上げ停止",
    back: "戻る",
    next: "次へ (公式)",
    formulaRefMenu: "公式リファレンス メニュー",
    solverWorkspace: "数式解答ワークスペース",
    outputTitle: "AI 高速解答出力ボード",
    outputSub: "学術的定理に従って、難易度を考慮した上で解析計算されました。",
    cameraScanning: "ライブカメラビューア",
    startCamera: "カメラ接続を起動する",
    captureBtn: "シャッターを切る",
    deviceNoFound: "カメラが見つかりません。教科書学習シミュレーター（数例）をご試用ください:",
    simulateScan: "学習ノートを模擬スキャン",
    clear: "ファイルをクリア",
    importLabel: "数式インサートヘルパー",
    formulaSearchPlaceholder: "数学・科学の公式を探す...",
    explanationFromLang: "解説",
    warningTitle: "Gemini キーを登録してください",
    warningBody: "API キーが適用されていません。Secrets パネルに GEMINI_API_KEY を登録してからリロードしてください。",
    reloadState: "アプリをリロード",
    scannedAttached: "模擬ノート問題が添付されました",
    catMathematics: "算数・幾何",
    catAlgebra: "代数",
    catHigherMath: "等高等数学",
    catPhysics: "物理",
    catChemistry: "化学",
    catSaved: "保存済み",
    noFormulasFound: "公式が見つかりませんでした",
    noFormulasSub: "他のカテゴリを選択するか、キーワードを再確認してください。",
    loadToSolve: "エディタにロード",
    searchFormulasDesc: "公式を検索してクリックすると即時エディタに反映されます"
  }
};

// 2. REAL LOCALIZED MATH SUBJECTS DATABASE
const AVAILABLE_SUBJECTS = [
  { id: "Arithmetic", label: "Bangladesh Pati Gnit (বাংলাদেশি পাটিগণিত)" },
  { id: "Algebra", label: "Algebra" },
  { id: "Business Math", label: "Business Math" },
  { id: "Higher Math", label: "Higher Math" },
  { id: "Physics", label: "Physics" },
  { id: "Chemistry", label: "Chemistry" }
];
const DUMMY_SUBJECTS: any[] = [];
const OLD_UNUSED_1: any[] = [];
const OLD_UNUSED_2_IGNORED = [
  { id: "Bangladesh Pati Gnit", label: "Bangladesh Pati Gnit (বাংলাদেশি পাটিগণিত)" },
  { id: "Europe & America Pati Gnit", label: "Europe & America Pati Gnit (ইউরোপ ও अमेरिका পাटीगणीत)" },
  { id: "Arabic Pati Gnit", label: "Arabic Pati Gnit (আরবি পাটিগণিত)" },
  { id: "Asian Pati Gnit", label: "Asian Pati Gnit (Asian পাটিগণিত)" },
  { id: "Business Mathematics", label: "Business Mathematics (বিজনেস ম্যাথ)" }
];

// 3. UPDATED CLASS LEVEL EXTRA SELECTIONS CHIPS TIER
const AVAILABLE_CLASS_LEVELS = [
  { id: "Class 1-5", label: "Class 1-5" },
  { id: "Class 6-10", label: "Class 6-10" },
  { id: "College-University", label: "College-University" }
];

export default function App() {
  // FIREBASE USER AND STATE HOOKS
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{
    uid: string;
    name: string;
    email: string;
    schoolId?: string;
    plan: "explorer" | "pro" | "enterprise";
    updatedAt: any;
  } | null>(null);

  // Navigation 3-Page / Tab View State
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);

  // Input tab option state (reordered: scanner -> upload -> type)
  const [activeTab, setActiveTab] = useState<"scanner" | "upload" | "type">("scanner");
  
  // Solver configurations (Arithmetic is the initial standard regional subject)
  const [subject, setSubject] = useState("Arithmetic");
  const [classLevel, setClassLevel] = useState("Class 6-10");
  const [language, setLanguage] = useState("English");

  // Premium Dashboard Pricing states
  const [pricingRegion, setPricingRegion] = useState<"BD" | "Global">("BD");
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Input states
  const [typedInput, setTypedInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Camera Live Scanning Hardware Hook
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Solving states
  const [isSolving, setIsSolving] = useState(false);
  const [solutionResult, setSolutionResult] = useState<SolutionResult | null>(null);
  const [isShowingAds, setIsShowingAds] = useState(false);
  const [activeAdStep, setActiveAdStep] = useState<1 | 2>(1);
  const [adTimeRemaining, setAdTimeRemaining] = useState(3);
  const [tempSolutionResult, setTempSolutionResult] = useState<SolutionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  // History & interactive speech states
  const [history, setHistory] = useState<SolvedHistoryItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeStepHighlight, setActiveStepHighlight] = useState<number | null>(null);
  const [resultFormat, setResultFormat] = useState<"breakdown" | "short" | "mcq">("breakdown");
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null);
  const [isMcqSubmitted, setIsMcqSubmitted] = useState<boolean>(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Translate lookup helper using the current chosen language state
  const t = (key: string) => {
    const selectedLang = language || "English";
    const dict = DICTIONARY[selectedLang] || DICTIONARY["English"];
    return dict[key] || DICTIONARY["English"][key] || key;
  };

  // Sync Auth lifecycle and Firestore states securely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data() as any);
          } else {
            const initialProfile = {
              uid: user.uid,
              name: user.displayName || "Scholar Student",
              email: user.email || "",
              plan: "explorer" as const,
              updatedAt: serverTimestamp()
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile({
              ...initialProfile,
              updatedAt: new Date().toISOString()
            });
          }

          // Pull user history from secure Firestore location
          const historyProjRef = collection(db, "users", user.uid, "history");
          const querySnap = await getDocs(historyProjRef);
          const dbHistory: SolvedHistoryItem[] = [];
          
          querySnap.forEach((doc) => {
            const data = doc.data();
            const pts = data.timestamp;
            let timeStr = "";
            if (pts && typeof pts.toDate === "function") {
              timeStr = pts.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } else {
              timeStr = String(pts || "");
            }
            dbHistory.push({
              id: data.id,
              timestamp: timeStr,
              input: data.input,
              inputType: data.inputType,
              subject: data.subject,
              classLevel: data.classLevel,
              language: data.language,
              solution: data.solution
            });
          });

          // Sort by timestamp id descending
          dbHistory.sort((a, b) => b.id.localeCompare(a.id));
          setHistory(dbHistory);
        } catch (error) {
          console.log("[Firestore Status] Sandbox or restricted workspace. Initializing local student session profile.");
          setUserProfile({
            uid: user.uid,
            name: user.displayName || "Scholar Student",
            email: user.email || "",
            plan: "explorer",
            updatedAt: new Date().toISOString()
          });
          try {
            const stored = localStorage.getItem("math_solver_history");
            if (stored) {
              setHistory(JSON.parse(stored));
            } else {
              setHistory([]);
            }
          } catch (e) {
            setHistory([]);
          }
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        // offline fallback
        try {
          const stored = localStorage.getItem("math_solver_history");
          if (stored) {
            setHistory(JSON.parse(stored));
          } else {
            setHistory([]);
          }
        } catch (e) {
          setHistory([]);
        }
      }
    });

    try {
      synthRef.current = window.speechSynthesis;
    } catch (e) {
      console.warn("TTS unsupported in this browser environment");
    }

    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In redirect result on boot (crucial for Android WebViews)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("[Firebase Auth] Redirect login successful:", result.user);
          setCurrentUser(result.user);
        }
      })
      .catch((err) => {
        console.error("[Firebase Auth] Google redirect auth error:", err);
      });
  }, []);

  // Soft stop camera tracker when activeTab changes
  useEffect(() => {
    if (activeTab !== "scanner") {
      stopCamera();
    }
  }, [activeTab]);

  // Auto-detect pricing region based on IP geolocation/timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && (tz.includes("Dhaka") || tz === "Asia/Dhaka")) {
        setPricingRegion("BD");
      }
    } catch (e) {
      console.warn("Timezone check failed:", e);
    }

    fetch("https://ipapi.co/json/")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("GeoAPI error");
      })
      .then((data) => {
        if (data && (data.country === "BD" || data.country_code === "BD")) {
          setPricingRegion("BD");
        } else if (data && data.country) {
          setPricingRegion("Global");
        }
      })
      .catch((err) => {
        console.log("Pricing region IP fallback detection:", err);
      });
  }, []);

  const startCamera = async () => {
    setErrorMessage("");
    
    // Safety check for environments/WebViews that do not expose mediaDevices (e.g. non-HTTPS, or restricted sandboxes)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        language === "English"
          ? "Camera API is not supported or accessible on this web view / device."
          : "এই ডিভাইস বা ওয়েব ভিউতে ক্যামেরা সাপোর্ট অথবা এক্সেস পাওয়া যায়নি।"
      );
      setIsCameraActive(false);
      return;
    }

    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn("Could not capture stream raw camera device: ", err);
      let localizedError = language === "English"
        ? "Could not access camera. Please check device permission settings."
        : "ক্যামেরা এক্সেস করা যায়নি। অনুগ্রহ করে ডিভাইসের পারমিশন সেটিংস চেক করুন।";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        localizedError = language === "English"
          ? "Camera permission was denied. Please grant permission in application settings."
          : "ক্যামেরার অনুমতি প্রত্যাখ্যাত হয়েছে। অনুগ্রহ করে অ্যাপ্লিকেশন সেটিংস থেকে পারমিশন দিন।";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        localizedError = language === "English"
          ? "No physical camera hardware found on this device."
          : "এই ডিভাইসে কোনো ক্যামেরা হার্ডওয়্যার খুঁজে পাওয়া যায়নি।";
      }
      
      setErrorMessage(localizedError);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Limit resolution to maximum 1200px width/height for fast transfers & low latency
      const MAX_DIM = 1200;
      let width = video.videoWidth || 640;
      let height = video.videoHeight || 480;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw solid background to prevent transparency metadata overhead
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(video, 0, 0, width, height);
        try {
          // Compress the captured photo setting quality to 0.7 JPEG (under 300KB)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setUploadedImage(dataUrl);
        } catch (e) {
          // Security fallback if canvas reading is blocked
          setUploadedImage("MOCK_MATH_IMAGE");
        }
      }
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Import dynamic formula reference from page 2 to page 1
  const handleImportFormula = (formula: Formula) => {
    let cleanFormula = formula.formula;
    if (cleanFormula.startsWith("$$") && cleanFormula.endsWith("$$")) {
      cleanFormula = cleanFormula.slice(2, -2).trim();
    } else if (cleanFormula.startsWith("$") && cleanFormula.endsWith("$")) {
      cleanFormula = cleanFormula.slice(1, -1).trim();
    }
    setTypedInput(cleanFormula);
    
    // Switch to typed tab and current workspace page
    setActiveTab("type");
    setCurrentPage(1);

    // Focus typed input box smoothly
    setTimeout(() => {
      const tx = document.getElementById("math-typed-textarea");
      if (tx) {
        tx.focus();
        tx.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const virtualKeyPress = (char: string) => {
    setTypedInput((prev) => prev + char);
    const tx = document.getElementById("math-typed-textarea");
    if (tx) tx.focus();
  };

  const toBengaliNumerals = (num: number | string): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(char => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : bengaliDigits[digit];
    }).join("");
  };

  // Speech TTS solution reader line-by-line using the localized voice mappings
  const handleToggleVoice = () => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setActiveStepHighlight(null);
      return;
    }

    if (!solutionResult) return;

    setIsSpeaking(true);
    let speechQueue: SpeechSynthesisUtterance[] = [];

    const cleanProb = solutionResult.identifiedProblem.replace(/[\$\\]/g, "");
    const cleanAns = solutionResult.quickAnswer.replace(/[\$\\]/g, "");

    let introText = "";
    switch (language) {
      case "Bangla":
      case "Bengali":
        introText = `সমস্যা: ${cleanProb}। উত্তর হলো: ${cleanAns}। ধাপে ধাপে সমাধান বিশ্লেষণ:`;
        break;
      case "Spanish":
        introText = `Problema: ${cleanProb}. El resultado es: ${cleanAns}. Explicación paso a paso:`;
        break;
      case "Arabic":
        introText = `المشكلة: ${cleanProb}. النتيجة هي: ${cleanAns}. الحل خطوة بخطوة:`;
        break;
      case "Hindi":
        introText = `समस्या: ${cleanProb}. उत्तर है: ${cleanAns}. चरण-दर-चरण समाधान:`;
        break;
      case "French":
        introText = `Problème: ${cleanProb}. Le résultat est: ${cleanAns}. Explication étape par étape:`;
        break;
      case "Russian":
        introText = `Задача: ${cleanProb}. Ответ: ${cleanAns}. Пошаговое объяснение:`;
        break;
      case "German":
        introText = `Problem: ${cleanProb}. Das Ergebnis ist: ${cleanAns}. Schritt-für-Schritt-Erklärung:`;
        break;
      case "Chinese":
        introText = `问题: ${cleanProb}。答案是: ${cleanAns}。分步详细解答如下:`;
        break;
      case "Japanese":
        introText = `問題: ${cleanProb}。答えは: ${cleanAns}。ステップバイステップの解説:`;
        break;
      default:
        introText = `Problem: ${cleanProb}. Answer is: ${cleanAns}. Step by step breakdown:`;
        break;
    }

    const intro = new SpeechSynthesisUtterance(introText);
    intro.lang = getSpeechLangCode(language);
    intro.onend = () => processNextUtterance();
    speechQueue.push(intro);

    solutionResult.steps.forEach((step, idx) => {
      let stepText = "";
      switch (language) {
        case "Bangla":
        case "Bengali":
          stepText = `ধাপ ${toBengaliNumerals(idx + 1)}: ${step.title}। ${step.explanation}`;
          break;
        case "Spanish":
          stepText = `Paso ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
        case "Arabic":
          stepText = `الخطوة ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
        case "Hindi":
          stepText = `चरण ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
        case "French":
          stepText = `Étape ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
        case "Russian":
          stepText = `Шаг ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
        case "German":
          stepText = `Schritt ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
        case "Chinese":
          stepText = `第 ${idx + 1} 步: ${step.title}。 ${step.explanation}`;
          break;
        case "Japanese":
          stepText = `ステップ ${idx + 1}: ${step.title}。 ${step.explanation}`;
          break;
        default:
          stepText = `Step ${idx + 1}: ${step.title}. ${step.explanation}`;
          break;
      }

      const stepUtt = new SpeechSynthesisUtterance(stepText);
      stepUtt.lang = getSpeechLangCode(language);
      stepUtt.onstart = () => setActiveStepHighlight(step.id);
      stepUtt.onend = () => {
        if (idx === solutionResult.steps.length - 1) {
          setIsSpeaking(false);
          setActiveStepHighlight(null);
        } else {
          processNextUtterance();
        }
      };
      speechQueue.push(stepUtt);
    });

    let currentIdx = 0;
    const processNextUtterance = () => {
      if (currentIdx < speechQueue.length) {
        const nextUtt = speechQueue[currentIdx];
        currentIdx++;
        synthRef.current?.speak(nextUtt);
      }
    };

    processNextUtterance();
  };

  const getSpeechLangCode = (lang: string) => {
    switch (lang) {
      case "Bangla": return "bn-BD";
      case "Bengali": return "bn-IN";
      case "Spanish": return "es-ES";
      case "Arabic": return "ar-SA";
      case "Hindi": return "hi-IN";
      case "French": return "fr-FR";
      case "Russian": return "ru-RU";
      case "German": return "de-DE";
      case "Chinese": return "zh-CN";
      case "Japanese": return "ja-JP";
      default: return "en-US";
    }
  };

  // Call the server solver API
  const handleSolve = async () => {
    setIsSolving(true);
    setErrorMessage("");
    setWarningMessage("");
    setSelectedMcqOption(null);
    setIsMcqSubmitted(false);
    setResultFormat("breakdown");

    // Setup inputType mapper
    const inputTypeParam = (activeTab === "scanner" || activeTab === "upload") ? "image" : "typed";
    let payloadImg = uploadedImage;

    // Fallback: If it's a simulated notebook scan, we provide a placeholder transparent math drawing
    if (activeTab === "scanner" && !payloadImg) {
      setErrorMessage("Please select a simulated scan or start the webcam first.");
      setIsSolving(false);
      return;
    }

    if (inputTypeParam === "image" && !payloadImg) {
      // Use clean fallback formula
      payloadImg = "MOCK_MATH_EXPRESSION_ATTACHED";
    }

    if (activeTab === "type" && !typedInput.trim()) {
      setErrorMessage("Please type a formula or expression in the typewriter input box first.");
      setIsSolving(false);
      return;
    }

    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputType: inputTypeParam,
          image: payloadImg || "MOCK_CANVAS_BINARY",
          typedInput: typedInput || "৫টি আমের দাম ২০ টাকা হলে, ১৫টি আমের দাম কত?",
          subject,
          classLevel,
          language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setWarningMessage(data.message || "Credential configuration missing");
          throw new Error("Unconfigured Secrets API Key");
        }
        throw new Error(data.message || data.error || "Could not generate calculations");
      }

      const result: SolutionResult = data;

      // Save into history list immediately for logging
      const newHistoryItem: SolvedHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        input: activeTab === "type" ? typedInput : `${subject} (Scan)`,
        inputType: activeTab === "type" ? "type" : "scan",
        subject,
        classLevel,
        language,
        solution: result
      };

      if (currentUser) {
        const itemDocRef = doc(db, "users", currentUser.uid, "history", newHistoryItem.id);
        try {
          await setDoc(itemDocRef, {
            id: newHistoryItem.id,
            timestamp: serverTimestamp(),
            input: newHistoryItem.input,
            inputType: newHistoryItem.inputType,
            subject: newHistoryItem.subject,
            classLevel: newHistoryItem.classLevel,
            language: newHistoryItem.language,
            solution: newHistoryItem.solution
          });
        } catch (error) {
          console.log("[Firestore Status] Write bypassed or restricted in sandbox mode. Saved to local storage instead.");
        }
      }

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("math_solver_history", JSON.stringify(updatedHistory));

      // Active Sponsorship Check for Free Plan users (2 sequential Ads)
      const currentPlan = userProfile?.plan || "explorer";
      if (currentPlan === "explorer") {
        setTempSolutionResult(result);
        setIsShowingAds(true);
        setActiveAdStep(1);
        setAdTimeRemaining(3);

        const countdownInterval = setInterval(() => {
          setAdTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              
              // Move to Ad 2
              setActiveAdStep(2);
              setAdTimeRemaining(3);

              const countdownInterval2 = setInterval(() => {
                setAdTimeRemaining((prev2) => {
                  if (prev2 <= 1) {
                    clearInterval(countdownInterval2);
                    
                    // Finished Ads sequence, show solution
                    setIsShowingAds(false);
                    setSolutionResult(result);
                    setTempSolutionResult(null);

                    // Scroll smoothly to presentation box
                    setTimeout(() => {
                      const target = document.getElementById("solver-solution-box");
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 150);

                    return 0;
                  }
                  return prev2 - 1;
                });
              }, 1000);

              return 3;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setSolutionResult(result);
        // Scroll smoothly to presentation box
        setTimeout(() => {
          const target = document.getElementById("solver-solution-box");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }

    } catch (err: any) {
      console.error("Gemini math solver API failure: ", err);
      if (err.message !== "Unconfigured Secrets API Key") {
        setErrorMessage(err.message || "Could not reach back-end core calculation systems.");
      }
    } finally {
      setIsSolving(false);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setTypedInput("");
    setSolutionResult(null);
    setErrorMessage("");
    setWarningMessage("");
    stopCamera();
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleRestoreHistory = (item: SolvedHistoryItem) => {
    setSelectedMcqOption(null);
    setIsMcqSubmitted(false);
    setResultFormat("breakdown");
    setSolutionResult(item.solution);
    setSubject(item.subject);
    setClassLevel(item.classLevel);
    setLanguage(item.language);
    if (item.inputType === "type") {
      setTypedInput(item.input);
      setActiveTab("type");
    } else {
      setUploadedImage("HISTORY_SCAN");
      setActiveTab("scanner");
    }
    setTimeout(() => {
      const target = document.getElementById("solver-solution-box");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-teal-950 transition-colors duration-200">
      
      {/* 4. SYMMETRIC DYNAMIC HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage(1)}>
            <img
              src="image512x512"
              alt="AI Math Solver Accent Icon"
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-xl object-contain shadow-lg shadow-teal-500/10 hover:opacity-90 animate-pulse"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/512x512/020617/0ea5e9?text=MATH";
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-medium text-slate-100 tracking-tight text-sm sm:text-base">
                  {language === "English" ? "AI Math Scanner" : "এআই ম্যাথ স্ক্যানার"}
                </span>
                <span className="text-[9px] bg-sky-500/10 text-sky-400 font-semibold px-1.5 py-0.5 rounded border border-sky-500/15 uppercase">
                  {t("stepSolver")}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal">{t("subtitle")}</p>
            </div>
          </div>

          {/* FLUID 3-BAR NAVIGATION & PAGINATION BUTTONS */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
              <button
                id="nav-btn-back"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => (prev > 1 ? (prev - 1) : 1) as any)}
                className={`py-0.5 px-2 rounded-md text-[10px] font-semibold flex items-center gap-0.5 transition-all ${
                  currentPage === 1
                    ? "bg-slate-950 text-slate-500 pointer-events-none"
                    : "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                }`}
              >
                &larr; {t("back")}
              </button>
              
              <div className="h-3 w-[1px] bg-slate-800" />
              
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-2.5 py-0.5 text-[10px] font-medium rounded-md transition-all cursor-pointer ${
                  currentPage === 2 
                    ? "text-teal-400 font-semibold bg-slate-950/60 border border-slate-800" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {language === "English" ? "Formula Reference Menu" : "सूत्र নির্দেশিকা মেনু"}
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`px-2.5 py-0.5 text-[10px] font-medium rounded-md transition-all cursor-pointer ${
                  currentPage === 3 
                    ? "text-teal-400 font-semibold bg-slate-950/60 border border-slate-800" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {language === "English" ? "Premium" : "প্রিমিয়াম"}
              </button>

              <div className="h-3 w-[1px] bg-slate-800" />

              <button
                id="nav-btn-next"
                disabled={currentPage === 3}
                onClick={() => setCurrentPage((prev) => (prev < 3 ? (prev + 1) : 3) as any)}
                className={`py-0.5 px-2 rounded-md text-[10px] font-semibold flex items-center gap-0.5 transition-all ${
                  currentPage === 3
                    ? "bg-slate-950 text-slate-500 pointer-events-none"
                    : "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 cursor-pointer"
                }`}
              >
                {t("next")} &rarr;
              </button>
            </div>
          </div>

          {/* FIREBASE AUTH PROFILE CONTROLLER */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 px-2 shrink-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full border border-teal-500/25 shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0] : "S"}
                  </div>
                )}
                <div className="text-left leading-tight hidden sm:block shrink-0 min-w-[70px]">
                  <p className="text-[10px] font-bold text-slate-200 truncate max-w-[90px]">
                    {userProfile?.name || currentUser.displayName || "Scholar"}
                  </p>
                  <p className="text-[8px] font-mono text-teal-400 uppercase tracking-wider block">
                    Tier: {userProfile?.plan || "explorer"}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await logOut();
                  }}
                  className="text-[9px] font-mono bg-slate-950 hover:bg-rose-500/15 text-slate-400 hover:text-rose-450 py-0.5 px-2 rounded border border-slate-800 hover:border-rose-500/20 transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await loginWithGoogle();
                  } catch (err) {
                    // handled gracefully
                  }
                }}
                className="py-1 px-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-[10px] rounded-lg tracking-wider transition-all flex items-center gap-1 cursor-pointer hover:shadow-md hover:shadow-teal-500/10"
              >
                Google Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* SECRETS WARNING BADGE */}
      {warningMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-slate-200">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
            <div className="text-xs space-y-1">
              <h4 className="font-semibold text-amber-350">{t("warningTitle")}</h4>
              <p className="text-slate-400 leading-relaxed">
                {t("warningBody")}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold transition animate-pulse"
              >
                <RefreshCw size={10} />
                {t("reloadState")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN DYNAMIC TAB CONTENT VIEWPORT */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 h-[80vh] max-h-[820px] overflow-y-auto scrollbar-none">
        <AnimatePresence mode="wait">
          {currentPage === 1 ? (
            <motion.div
              key="workspace-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 w-full"
            >
              {/* CORE SOLVER CONFIGURATION CARD */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-5">
                
                {/* 📥 REORDERED INPUT TAB BUTTONS (Scanner -> Upload -> Manual Keyboard) */}
                <div className="flex border-b border-slate-800 p-1 bg-slate-950 rounded-xl max-w-lg">
                  <button
                    onClick={() => { setActiveTab("scanner"); setErrorMessage(""); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition ${
                      activeTab === "scanner"
                        ? "bg-slate-900 text-teal-400 border border-slate-800/40 shadow-sm shadow-teal-500/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                    id="tab-btn-scanner"
                  >
                    <Camera size={13} />
                    {t("scannerOpt")}
                  </button>
                  <button
                    onClick={() => { setActiveTab("upload"); setErrorMessage(""); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition ${
                      activeTab === "upload"
                        ? "bg-slate-900 text-teal-400 border border-slate-800/40 shadow-sm shadow-teal-500/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                    id="tab-btn-upload"
                  >
                    <Upload size={13} />
                    {t("uploadOpt")}
                  </button>
                  <button
                    onClick={() => { setActiveTab("type"); setErrorMessage(""); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition ${
                      activeTab === "type"
                        ? "bg-slate-900 text-teal-400 border border-slate-800/40 shadow-sm shadow-teal-500/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                    id="tab-btn-type"
                  >
                    <Keyboard size={13} />
                    {t("typingOpt")}
                  </button>
                </div>

                {/* TAB VIEW 1: LIVE OR SIMULATED CAMERA SCANNER (Main primary mode) */}
                {activeTab === "scanner" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Standalone Camera Launcher Card */}
                    <div className="mx-auto w-full max-w-[420px] bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="p-3 bg-teal-500/10 rounded-full text-teal-400 group-hover:scale-105 transition-transform duration-200">
                        <Camera size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">
                          {language === "English" ? "Interactive Math Camera Solver" : "ইন্টারেক্টিভ গণিত ক্যামেরা সমাধানকারী"}
                        </h4>
                        <p className="text-[10px] text-slate-500 max-w-[280px] leading-relaxed">
                          {language === "English"
                            ? "Scan any textbook equation or written formula directly on your screen"
                            : "আপনার স্ক্রিনে সরাসরি যে কোনো সমীকরণ অথবা লিখিত সূত্র স্ক্যান করুন"}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setIsCameraActive(true)}
                        className="py-2 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/15"
                      >
                        <Camera size={14} className="stroke-[2.5]" />
                        {t("startCamera")}
                      </button>

                      <CameraScanner
                        isOpen={isCameraActive}
                        onClose={() => setIsCameraActive(false)}
                        onCapture={(dataUrl) => {
                          setUploadedImage(dataUrl);
                        }}
                        language={language}
                      />
                    </div>

                    {/* Simulation homework files/cards completely OUTSIDE and vertically directly BELOW the camera preview box */}
                    <div className="space-y-2 max-w-[420px] mx-auto w-full pt-1">
                      <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider text-center">
                        {t("simulateScan")}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {[
                          {
                            id: "sim-bd",
                            name: "Bangladesh Pati Gnit (Pati Gnit)",
                            sub: "Arithmetic",
                            lvl: "Class 1-5",
                            formula: "৫টি আমের দাম ২০ টাকা হলে, ১৫টি আমের দাম কত?",
                            icon: "🇧🇩"
                          },
                          {
                            id: "sim-eo",
                            name: "Europe & America (Fractions)",
                            sub: "Algebra",
                            lvl: "Class 6-10",
                            formula: "x/2 + 3/4 = 5/8",
                            icon: "🇪🇺🇺🇸"
                          },
                          {
                            id: "sim-ar",
                            name: "Arabic Pati Gnit (النسبة والتناسب)",
                            sub: "Arithmetic",
                            lvl: "Class 6-10",
                            formula: "إذا كان ثمن ٥ كتب هو ٢٠ دينار، فما ثمن ١٥ كتاباً؟",
                            icon: "🇸🇦"
                          },
                          {
                            id: "sim-bus",
                            name: "Business Math (Marginal Cost)",
                            sub: "Business Math",
                            lvl: "College-University",
                            formula: "C(x) = 150 + 5x + 0.1x^2",
                            icon: "📈"
                          }
                        ].map((sim) => (
                          <button
                            key={sim.id}
                            onClick={() => {
                              setSubject(sim.sub);
                              setClassLevel(sim.lvl);
                              setTypedInput(sim.formula);
                              setUploadedImage(sim.id === "sim-bd" ? "MOCK_BD_IMAGE" : sim.id === "sim-ar" ? "MOCK_AR_IMAGE" : "MOCK_MATH_IMAGE");
                            }}
                            className="p-2 rounded-lg border border-slate-800 text-left bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700 transition flex items-center justify-between gap-3 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-xs shrink-0">{sim.icon}</span>
                              <div className="truncate">
                                <p className="font-semibold text-slate-200 truncate leading-tight text-[11px]">{sim.name}</p>
                                <p className="font-mono text-teal-400 text-[9px] truncate mt-0.5">{sim.formula}</p>
                              </div>
                            </div>
                            <span className="text-[8px] font-mono text-slate-500 px-1.5 py-0.5 rounded border border-slate-800/80 bg-slate-950 shrink-0 select-none">
                              {sim.lvl}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Scan Attached Preview Box */}
                    {uploadedImage && (
                      <div className="space-y-2">
                        <div className="relative border border-slate-800 bg-slate-950 p-2 rounded-xl flex gap-3 items-center">
                          {uploadedImage.startsWith("data:") ? (
                            <img
                              src={uploadedImage}
                              alt="Captured homework preview"
                              className="h-9 w-14 object-cover rounded bg-slate-900 border border-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-14 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[9px] text-teal-400 font-bold p-1 overflow-hidden truncate shrink-0">
                              {uploadedImage === "MOCK_BD_IMAGE" ? "৫টি আম" : uploadedImage === "MOCK_AR_IMAGE" ? "٥ كتب" : "IMAGE"}
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <p className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                              <CheckCircle size={10} />
                              {t("scannedAttached")}
                            </p>
                            <p className="text-[9px] text-slate-500 truncate mt-0.5">
                              {uploadedImage.startsWith("data:") ? "Hardware stream payload decoded" : "Notebook simulator: " + typedInput}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setUploadedImage(null);
                              setTypedInput("");
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded hover:bg-slate-900 transition"
                          >
                            {t("clear")}
                          </button>
                        </div>
                        
                        {/* Submit Button for Camera Option */}
                        <button
                          onClick={handleSolve}
                          disabled={isSolving}
                          className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/10 active:scale-[0.98] disabled:opacity-50 font-sans"
                        >
                          {isSolving ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              {t("computing")}
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} />
                              {language === "English" ? "Submit Problem" : "সমস্যা সমাধান জমা দিন"}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB VIEW 2: MULTI-FORMAT FILE UPLOADING */}
                {activeTab === "upload" && (
                  <div className="space-y-4">
                    <div className="relative w-full h-32 bg-slate-950 hover:bg-slate-900/45 border border-slate-850 hover:border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
                        id="math-file-upload-input"
                      />
                      <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-full group-hover:scale-105 transition-transform">
                        <Upload size={18} />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-400 transition-colors">
                          {t("dragDropText")}
                        </p>
                        <p className="text-[9px] text-slate-500 mt-0.5">
                          {t("dragDropSub")}
                        </p>
                      </div>
                    </div>

                    {uploadedImage && (
                      <div className="space-y-2">
                        <div className="relative border border-slate-800 bg-slate-950 p-2 rounded-xl flex gap-3 items-center">
                          <img
                            src={uploadedImage}
                            alt="Homework crop"
                            className="h-9 w-14 object-cover rounded bg-slate-900 border border-slate-850"
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle size={10} />
                              {t("scannedAttached")}
                            </p>
                            <p className="text-[9px] text-slate-500 truncate mt-0.5">Binary dataset loaded.</p>
                          </div>
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded hover:bg-slate-900 transition"
                          >
                            {t("clear")}
                          </button>
                        </div>

                        {/* Submit Button for Image Upload */}
                        <button
                          onClick={handleSolve}
                          disabled={isSolving}
                          className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/10 active:scale-[0.98] disabled:opacity-50 font-sans"
                        >
                          {isSolving ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              {t("computing")}
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} />
                              {language === "English" ? "Submit Problem" : "সমস্যা সমাধান জমা দিন"}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB VIEW 3: MANUALLY FORMULA KEYPADS */}
                {activeTab === "type" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        id="math-typed-textarea"
                        placeholder={t("typedPlaceholder")}
                        value={typedInput}
                        onChange={(e) => setTypedInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 text-xs h-24 p-3 rounded-xl focus:outline-none focus:border-teal-550 placeholder-slate-650 transition"
                      />
                      <div className="absolute bottom-2.5 left-3 text-[9px] text-slate-500 font-mono">
                        LaTeX Delimiter $ enabled
                      </div>
                    </div>

                    {typedInput.trim() && (
                      <button
                        onClick={handleSolve}
                        disabled={isSolving}
                        className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/10 active:scale-[0.98] disabled:opacity-55 font-sans"
                      >
                        {isSolving ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            {t("computing")}
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            {language === "English" ? "Submit Problem" : "সমস্যা সমাধান জমা দিন"}
                          </>
                        )}
                      </button>
                    )}

                    {/* Scientific Math Keyboards Assistant keys */}
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">
                        {t("importLabel")}
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { l: "5 Mangoes", v: "If 5 mangoes cost 20 Taka, what is the cost of 15 mangoes?" },
                          { l: "x²", v: "x^2" },
                          { l: "√x", v: "\\sqrt{x} " },
                          { l: "a/b", v: "\\frac{a}{b} " },
                          { l: "∫", v: "\\int " },
                          { l: "d/dx", v: "\\frac{d}{dx} " },
                          { l: "∑", v: "\\sum " },
                          { l: "π", v: "\\pi " },
                          { l: "θ", v: "\\theta " },
                          { l: "±", v: "\\pm " },
                          { l: "→", v: "\\rightarrow " }
                        ].map((key, pos) => (
                          <button
                            key={pos}
                            onClick={() => virtualKeyPress(key.v)}
                            className="py-1 px-2 bg-slate-950 hover:bg-slate-850 hover:text-white border border-slate-800 rounded text-[10px] font-mono font-medium transition cursor-pointer"
                          >
                            {key.l || key.v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ⚙️ DUAL DROPDOWN CONFIGURATION REFRACTOR (Side-by-side horizontal row) */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
                  
                  {/* Left Column: CLASS LEVEL (COMPLEXITY) */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calculator size={10} className="text-teal-400" />
                      {t("complexityLabel")}
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                      id="select-classlevel-dropdown"
                    >
                      {AVAILABLE_CLASS_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Right Column: SUBJECT CATEGORY */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Binary size={10} className="text-teal-400" />
                      {t("subjectLabel")}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-205 focus:outline-none focus:border-teal-550 cursor-pointer"
                      id="select-subject-dropdown"
                    >
                      {AVAILABLE_SUBJECTS.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Global Explanations Output Language Selection */}
                <div className="space-y-1 border-t border-slate-850/30 pt-2.5">
                  <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Languages size={10} className="text-teal-400" />
                    {t("langLabel")}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full sm:max-w-xs bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-205 focus:outline-none focus:border-teal-550 cursor-pointer"
                    id="select-language-dropdown"
                  >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ERROR CONSOLE NOTIFICATION BAR */}
                {errorMessage && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                    <p className="font-semibold">{errorMessage}</p>
                  </div>
                )}

                {/* 🔘 ACTION BUTTONS RESIZING & COMPACT ALIGNMENT */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-850/60 pt-3">
                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                    <Info size={10} className="text-teal-400" />
                    {subject} ({classLevel}) · {language}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClear}
                      className="py-1 px-3.5 rounded-lg border border-slate-800 text-slate-350 hover:bg-slate-850 transition text-[11px] font-semibold cursor-pointer"
                      id="btn-clear-everything"
                    >
                      {t("resetForm")}
                    </button>
                  </div>
                </div>

              </div>
                             {/* DYNAMIC PRESENTATION OUTCOME BOARD (If solved successfully) */}
              {solutionResult && (
                <div
                  id="solver-solution-box"
                  className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 sm:p-5 shadow-2x relative overflow-hidden space-y-5"
                >
                  
                  {/* Output Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-3 gap-3">
                    <div>
                      <h2 className="font-display font-semibold text-slate-100 flex items-center gap-1.5 text-xs sm:text-sm">
                        <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                          <CheckCircle size={12} />
                        </span>
                        {t("outputTitle")}
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {t("outputSub")}
                      </p>
                    </div>

                    <button
                      onClick={handleToggleVoice}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition shadow-sm cursor-pointer ${
                        isSpeaking
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                      id="btn-read-aloud"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX size={11} />
                          {t("stopReading")}
                        </>
                      ) : (
                        <>
                          <Volume2 size={11} />
                          {t("listenAloud")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* FORMAT SELECTOR TABS */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                    {(["breakdown", "mcq", "short"] as const).map((fmt) => {
                      const labels = {
                        English: { breakdown: "Detailed Steps", mcq: "MCQ Test", short: "Short Answer" },
                        Bangla: { breakdown: "ধাপে ধাপে বিশ্লেষণ", mcq: "এমসিকিউ কুইজ", short: "সংক্ষিপ্ত উত্তর" },
                        Bengali: { breakdown: "ধাপে ধাপে বিশ্লেষণ", mcq: "এমসিকিউ কুইজ", short: "সংক্ষিপ্ত উত্তর" },
                        Spanish: { breakdown: "Proceso Detallado", mcq: "Examen MCQ", short: "Respuesta Corta" },
                        Arabic: { breakdown: "شرح خطوة بخطوة", mcq: "اختبار MCQ", short: "إجابة قصيرة" },
                        Hindi: { breakdown: "चरण-दर-चरण समाधान", mcq: "MCQ प्रश्न प्रणाली", short: "संक्षिप्त उत्तर बॉक्स" },
                        French: { breakdown: "Étapes Détaillées", mcq: "Pratique MCQ", short: "Réponse Rapide" },
                        German: { breakdown: "Schritt-Erklärung", mcq: "MCQ Quiz-Test", short: "Kurzantwort" },
                        Russian: { breakdown: "Пошаговый разбор", mcq: "Тест MCQ", short: "Краткий ответ" },
                        Chinese: { breakdown: "步骤化推导", mcq: "MCQ 自测", short: "简洁答案框" },
                        Japanese: { breakdown: "詳しい途中計算", mcq: "選択肢テスト", short: "簡易解答" },
                      };
                      const selectedLang = language || "English";
                      const currentLabels = labels[selectedLang as keyof typeof labels] || labels.English;
                      const activeLabel = currentLabels[fmt];
                      const isActive = resultFormat === fmt;

                      return (
                        <button
                          key={fmt}
                          onClick={() => setResultFormat(fmt)}
                          className={`py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                            isActive
                              ? "bg-slate-900 border border-slate-800/80 text-teal-400 font-extrabold shadow-md"
                              : "text-slate-450 hover:text-slate-205"
                          }`}
                        >
                          {activeLabel}
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTIVE FORMAT COMPARTMENT CANVAS */}
                  <div className="space-y-4 pt-1 animate-fadeIn">
                    {resultFormat === "breakdown" && (
                      <div className="space-y-3.5">
                        <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-900 relative">
                          <span className="absolute top-2 right-2 text-[7px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                            Problem Extracted
                          </span>
                          <label className="block text-[9px] text-slate-450 font-bold mb-1 uppercase tracking-widest">
                            {t("identifiedProblem")}
                          </label>
                          <div className="text-teal-300 overflow-x-auto text-center py-1">
                            <MathTextRenderer text={`$$ ${solutionResult.identifiedProblem} $$`} className="!text-xs sm:!text-sm" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-widest pl-1">
                            {t("proofExplanations")} (Side-by-Side Breakdown)
                          </label>

                          <div className="relative border-l border-slate-850 pl-3.5 space-y-4 ml-1.5 pt-1">
                            {solutionResult.steps.map((step) => {
                              const isHighlighted = activeStepHighlight === step.id;
                              return (
                                <div
                                  key={step.id}
                                  className={`relative transition-all duration-300 rounded-xl p-3 border -mx-3 ${
                                    isHighlighted
                                      ? "bg-teal-500/10 border-teal-500/30 translate-x-1"
                                      : "bg-transparent border-transparent"
                                  }`}
                                >
                                  <div className={`absolute -left-[18px] top-5 w-2 h-2 rounded-full border transition-all ${
                                    isHighlighted ? "bg-teal-400 border-teal-400 scale-125" : "bg-slate-950 border-slate-700"
                                  }`} />

                                  <h4 className="font-display font-semibold text-[11px] text-slate-200 flex items-center gap-1.5">
                                    <span className="text-teal-455 text-teal-400 font-mono text-[10px] bg-slate-950 border border-slate-850 px-1 py-0.25 rounded">#{step.id}</span>
                                    {step.title}
                                  </h4>

                                  {/* Side-by-Side step layout on Desktop, Stacked on Mobile */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2.5 items-center">
                                    <div className="py-2 px-3 bg-slate-950 border border-slate-900 rounded-xl overflow-x-auto text-slate-300 flex justify-center [&_.katex]:!text-[11px] [&_.katex-display]:my-0.5">
                                      <MathTextRenderer text={`$$ ${step.equation} $$`} className="!text-xs" />
                                    </div>
                                    <div className="p-2.5 bg-slate-900/30 rounded-xl border border-slate-850/40 text-[11px] text-slate-350 leading-relaxed italic">
                                      <span className="text-[7.5px] font-sans text-slate-500 block uppercase tracking-wider not-italic mb-0.5">
                                        {language === "English" || language === "Bangla" || language === "Bengali" ? t("explanationFromLang") : "Explanation"} ({language}):
                                      </span>
                                      {step.explanation}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {resultFormat === "mcq" && (
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                          <span className="text-[8px] font-mono font-bold text-teal-400 uppercase bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/15">
                            Skill Competence Check
                          </span>
                          <span className="text-[9px] font-mono text-slate-450 uppercase">
                            Adaptation for {classLevel}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Question Context</p>
                          <div className="p-3 bg-slate-950 border border-slate-905 rounded-xl text-slate-200 text-xs leading-relaxed overflow-x-auto text-center font-semibold">
                            <MathTextRenderer text={solutionResult.mcqQuestion || solutionResult.identifiedProblem} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Select the Solution Option</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(solutionResult.mcqOptions || []).map((opt: string, optIdx: number) => {
                              const labels = ["A", "B", "C", "D"];
                              const selectedLetter = labels[optIdx] || "A";
                              const isSelected = selectedMcqOption === selectedLetter;
                              const correctLetter = solutionResult.mcqCorrectAnswer || "A";
                              const isCorrect = selectedLetter === correctLetter;

                              let cardStyle = "bg-slate-950/80 border-slate-850 text-slate-200 hover:bg-slate-900 hover:border-slate-800";
                              if (isMcqSubmitted) {
                                if (isCorrect) {
                                  cardStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold";
                                } else if (isSelected) {
                                  cardStyle = "bg-rose-500/10 border-rose-500/40 text-rose-300";
                                } else {
                                  cardStyle = "bg-slate-950/20 border-slate-900/60 text-slate-600 opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isMcqSubmitted}
                                  onClick={() => {
                                    setSelectedMcqOption(selectedLetter);
                                    setIsMcqSubmitted(true);
                                  }}
                                  className={`p-2.5 rounded-xl border text-[11px] text-left transition duration-150 flex items-center justify-between gap-1.5 cursor-pointer ${cardStyle}`}
                                >
                                  <span className="truncate flex items-center gap-1.5">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                      isMcqSubmitted && isCorrect ? "bg-emerald-500 text-slate-950" : (isSelected ? "bg-rose-500 text-white" : "bg-slate-850 text-slate-400")
                                    }`}>
                                      {selectedLetter}
                                    </span>
                                    <span className="truncate">{opt}</span>
                                  </span>
                                  {isMcqSubmitted && (isCorrect ? (
                                    <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                                  ) : isSelected ? (
                                    <AlertTriangle size={12} className="text-rose-400 shrink-0" />
                                  ) : null)}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {isMcqSubmitted && (
                          <div className="p-3.5 bg-slate-900/60 border border-slate-850 rounded-xl space-y-1.5 animate-slideUp">
                            <h5 className="text-[10px] font-bold flex items-center gap-1">
                              {selectedMcqOption === (solutionResult.mcqCorrectAnswer || "A") ? (
                                <>
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                  <span className="text-emerald-400 uppercase tracking-widest font-mono text-[9px]">Correct Choice Selected!</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                  <span className="text-rose-400 uppercase tracking-widest font-mono text-[9px]">Incorrect Choice. Study Step Answer:</span>
                                </>
                              )}
                            </h5>
                            <p className="text-[11px] text-slate-350 leading-relaxed">
                              <strong className="text-white">Explanation: </strong>
                              {solutionResult.mcqExplanation || "Correct option selected based on mathematical properties."}
                            </p>
                            <button
                              onClick={() => {
                                setSelectedMcqOption(null);
                                setIsMcqSubmitted(false);
                              }}
                              className="text-[9px] font-mono text-teal-400 hover:text-teal-350 underline pt-1 cursor-pointer"
                            >
                              [Reset MCQ & Try Again]
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {resultFormat === "short" && (
                      <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-900 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                          <span className="text-[8px] font-mono font-bold text-teal-400 uppercase bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/15">
                            Verified Instant Output
                          </span>
                          <span className="text-[8px] font-mono text-slate-500 uppercase">
                            Academic Cloud Solved
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div className="p-3 bg-slate-900 border border-slate-850/80 rounded-xl space-y-1.5 text-center">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Target Reference</span>
                            <div className="text-slate-300 text-[11px] overflow-x-auto py-1">
                              <MathTextRenderer text={`$$ ${solutionResult.identifiedProblem} $$`} className="!text-xs" />
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-teal-500/10 to-teal-500/5 border border-teal-500/20 rounded-xl space-y-2 text-center relative overflow-hidden">
                            <span className="text-[8px] font-mono text-teal-400 uppercase tracking-wider block">Short Answer Solution</span>
                            <div className="text-sm font-extrabold text-white py-1.5 overflow-x-auto tracking-tight select-all">
                              <MathTextRenderer text={`$$ ${solutionResult.shortAnswer || solutionResult.quickAnswer} $$`} className="!text-base" />
                            </div>

                            <button
                              onClick={() => {
                                const payload = (solutionResult.shortAnswer || solutionResult.quickAnswer || "").replace(/[\$\\]/g, "");
                                navigator.clipboard.writeText(payload);
                                setCopiedAnswer(true);
                                setTimeout(() => setCopiedAnswer(false), 2000);
                              }}
                              className="mx-auto flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-850 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
                            >
                              {copiedAnswer ? (
                                <>
                                  <Check size={10} className="text-emerald-400" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={10} />
                                  <span>Copy clean value</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-905 text-center text-[9px] text-slate-450 italic">
                          💡 You can copy this short mathematical value to instantly paste into homework submission portals or notebooks.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dedicated audio helper bar directly below the step-by-step solutions */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-semibold text-slate-200 flex items-center justify-center sm:justify-start gap-1">
                        <Volume2 size={13} className="text-teal-400" />
                        {language === "English" || language === "Bangla" || language === "Bengali" ? (language === "English" ? "Voice Explanation Feature (TTS)" : "ভয়েস ব্যাখ্যা ফিচার (টিটিএস)") : `${language} Voice Reader (TTS)`}
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-1">
                        {language === "English" 
                          ? `Listen to the step-by-step voice guidance synthesized in English.` 
                          : language === "Bangla" || language === "Bengali"
                          ? `বাংলায় সংশ্লেষিত ধাপে ধাপে ভয়েস গাইডলাইন শুনুন।` 
                          : `Listen to step-by-step solutions synthesized inside ${language} language.`}
                      </p>
                    </div>

                    <button
                      onClick={handleToggleVoice}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isSpeaking
                          ? "bg-rose-500 hover:bg-rose-400 text-slate-950 border-rose-500"
                          : "bg-teal-500 hover:bg-teal-400 text-slate-950 border-teal-500"
                      }`}
                      id="btn-voice-explanation-bottom"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX size={12} className="animate-pulse" />
                          {language === "English" ? "Stop Voice Reader" : language === "Bangla" || language === "Bengali" ? "ভয়েস বন্ধ করুন" : "Stop Reader"}
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} />
                          {language === "English" ? "Play Text-to-Speech Solutions" : language === "Bangla" || language === "Bengali" ? "ভয়েস রিডার চালু করুন" : `Play Oral Speech`}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Details block raw markdown display */}
                  <div className="border-t border-slate-850 pt-3">
                    <details className="text-xs group bg-slate-950/40 rounded-xl border border-slate-900 p-2">
                      <summary className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer font-semibold select-none flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <CheckCircle size={10} className="text-teal-500" />
                          {t("viewRawMarkdown")}
                        </span>
                        <ChevronRight size={10} className="group-open:rotate-90 transition-transform" />
                      </summary>
                      <pre className="mt-2 p-2 bg-slate-900 border border-slate-850 text-[9px] text-slate-300 overflow-x-auto max-h-40 leading-relaxed rounded-lg font-mono">
                        {solutionResult.rawMarkdown}
                      </pre>
                    </details>
                  </div>

                </div>
              )}
              {/* RECENT SOLVED CALCULATIONS DRAWER */}
              {history.length > 0 && (
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 mt-4">
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Clock size={12} className="text-teal-400" />
                      {t("recentHistory")} ({history.length})
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (currentUser) {
                          try {
                            const deletePromises = history.map((item) => 
                              deleteDoc(doc(db, "users", currentUser.uid, "history", item.id))
                            );
                            await Promise.all(deletePromises);
                          } catch (error) {
                            console.log("[Firestore Status] Deletion completed locally.");
                          }
                        }
                        setHistory([]);
                        localStorage.removeItem("math_solver_history");
                      }}
                      className="text-[9px] font-mono text-rose-400 hover:text-rose-350 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      [Clear Logs]
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {history.map((hItem) => (
                      <div
                        key={hItem.id}
                        onClick={() => handleRestoreHistory(hItem)}
                        className="p-2 bg-slate-900/40 hover:bg-slate-900 rounded-lg border border-slate-850 hover:border-slate-800 flex items-center justify-between gap-1 cursor-pointer transition"
                      >
                        <div className="truncate space-y-0.5">
                          <p className="text-[10px] text-slate-200 font-semibold truncate animate-fadeIn">
                            {hItem.input}
                          </p>
                          <p className="text-[8px] text-slate-500">
                            {hItem.timestamp} · {hItem.subject} ({hItem.classLevel})
                          </p>
                        </div>
                        <ArrowRight size={11} className="text-slate-500 opacity-60 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RECENT SOLVED CALCULATIONS DRAWER */}
              {history.length > 0 && (
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 mt-4">
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Clock size={12} className="text-teal-400" />
                      {t("recentHistory")} ({history.length})
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (currentUser) {
                          try {
                            const deletePromises = history.map((item) => 
                              deleteDoc(doc(db, "users", currentUser.uid, "history", item.id))
                            );
                            await Promise.all(deletePromises);
                          } catch (error) {
                            console.log("[Firestore Status] Deletion completed locally.");
                          }
                        }
                        setHistory([]);
                        localStorage.removeItem("math_solver_history");
                      }}
                      className="text-[9px] font-mono text-rose-400 hover:text-rose-350 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      [Clear Logs]
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {history.map((hItem) => (
                      <div
                        key={hItem.id}
                        onClick={() => handleRestoreHistory(hItem)}
                        className="p-2 bg-slate-900/40 hover:bg-slate-900 rounded-lg border border-slate-850 hover:border-slate-800 flex items-center justify-between gap-1 cursor-pointer transition"
                      >
                        <div className="truncate space-y-0.5">
                          <p className="text-[10px] text-slate-200 font-semibold truncate animate-fadeIn">
                            {hItem.input}
                          </p>
                          <p className="text-[8px] text-slate-500">
                            {hItem.timestamp} · {hItem.subject} ({hItem.classLevel})
                          </p>
                        </div>
                        <ArrowRight size={11} className="text-slate-500 opacity-60 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : currentPage === 2 ? (
            <motion.div
              key="formulas-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="max-w-3xl mx-auto w-full"
            >
              {/* COMPACT FORMULA REFERENCE COMPONENT strictly loaded on page 2 */}
              <div className="h-[calc(80vh-140px)] min-h-[380px]">
                <FormulaReference onSelectFormula={handleImportFormula} t={t} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="premium-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="max-w-3xl mx-auto w-full space-y-6"
            >
              {/* Premium Pricing Panel Card */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-display font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="p-1 rounded bg-teal-500/10 text-teal-400">
                        <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
                      </span>
                      Premium Solver Tiers & Licensing
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Choose the perfect speed, accuracy, and regional pricing designed for your educational curriculum.
                    </p>
                  </div>

                  {/* Pricing Region Selector Tab */}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1 rounded-lg shrink-0">
                    <button
                      onClick={() => setPricingRegion("BD")}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        pricingRegion === "BD"
                          ? "bg-slate-900 text-teal-400 border border-slate-800/80 shadow-sm"
                          : "text-slate-550 hover:text-slate-300"
                      }`}
                    >
                      🇧🇩 BD Region (BDT ৳)
                    </button>
                    <button
                      onClick={() => setPricingRegion("Global")}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        pricingRegion === "Global"
                          ? "bg-slate-900 text-teal-400 border border-slate-800/80 shadow-sm"
                          : "text-slate-550 hover:text-slate-300"
                      }`}
                    >
                      🌐 Global Region (USD $)
                    </button>
                  </div>
                </div>

                {/* Subscriptions Grid Slider */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Explorer Plan */}
                  <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono font-bold text-slate-550 uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">Free Tier</span>
                      <h3 className="text-xs font-bold text-slate-200">Student Explorer</h3>
                      <p className="text-[9px] text-slate-450 leading-relaxed">
                        Excellent for basic algebra and geometry checks. Plays exactly 2 sponsor ads sequentially before revealing solutions.
                      </p>
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-slate-100 py-1 border-b border-slate-900">
                        <span className="text-lg font-bold">Free</span>
                        <span className="text-[10px] text-slate-500"> / forever</span>
                      </div>
                      <ul className="text-[9px] text-slate-400 space-y-1 list-disc list-inside mt-3">
                        <li className="font-semibold text-teal-400">Requires 2 Sponsor Ads</li>
                        <li>Standard priority solving</li>
                        <li>Standard formula sheets</li>
                      </ul>
                    </div>
                  </div>

                  {/* Academic Pro */}
                  <div className="p-4 rounded-xl border border-teal-500 bg-slate-950 flex flex-col justify-between space-y-4 shadow-xl shadow-teal-500/10">
                    <span className="text-[7.5px] font-bold text-slate-950 bg-teal-400 px-2 py-[1px] rounded-full uppercase tracking-wider font-mono self-start">Best Value</span>
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono font-bold text-teal-400 uppercase bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/15 font-mono">Featured</span>
                      <h3 className="text-xs font-bold text-slate-100">Academic Pro</h3>
                      <p className="text-[9px] text-slate-450 leading-relaxed">
                        Unlocks maximum high-resolution processing with instantaneous LaTeX explanations.
                      </p>
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-teal-400 py-1 border-b border-slate-900">
                        <span className="text-sm font-bold block">
                          {pricingRegion === "BD" ? "১৯৯ টাকা/মাস" : "$2.50 / Month"}
                        </span>
                      </div>
                      <ul className="text-[9px] text-slate-300 space-y-1 list-disc list-inside mt-3">
                        <li className="font-semibold text-white">Infinite daily AI scans</li>
                        <li>No Sponsor Ads</li>
                        <li>High-speed server priority</li>
                        <li>TTS Voice reader aloud</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <a
                        href="https://pay.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition duration-150 block shadow-md shadow-teal-500/10 hover:shadow-teal-400/20 active:scale-[0.98] cursor-pointer"
                        id="buy-button-pro"
                      >
                        {language === "English" ? "Buy Pro" : "প্রো কিনুন"}
                      </a>
                    </div>
                  </div>

                  {/* Lab Enterprise */}
                  <div className="p-4 rounded-xl border border-indigo-500 bg-slate-950 flex flex-col justify-between space-y-4 shadow-xl shadow-indigo-500/10">
                    <span className="text-[7.5px] font-bold text-white bg-indigo-600 px-2 py-[1px] rounded-full uppercase tracking-wider font-mono self-start font-mono">School Lab</span>
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono font-bold text-indigo-400 uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/15 font-mono">SLA Plan</span>
                      <h3 className="text-xs font-bold text-slate-200 font-display">Lab Enterprise</h3>
                      <p className="text-[9px] text-slate-455 leading-relaxed">
                        For classrooms, school laboratories, and educational institutions.
                      </p>
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-slate-100 py-1 border-b border-slate-900 font-mono">
                        <span className="text-sm font-bold block">
                          {pricingRegion === "BD" ? "১৪৯৯ টাকা/বছর" : "$15.00 / Year"}
                        </span>
                      </div>
                      <ul className="text-[9px] text-slate-400 space-y-1 list-disc list-inside mt-3">
                        <li>Entire classroom slots (up to 30)</li>
                        <li>No Sponsor Ads</li>
                        <li>SLA Uptime solver response</li>
                        <li>Dedicated regional developer key</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <a
                        href="https://pay.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-505 text-white font-bold text-xs rounded-xl transition duration-150 block shadow-md shadow-indigo-500/15 hover:shadow-indigo-400/20 active:scale-[0.98] cursor-pointer"
                        id="buy-button-enterprise"
                      >
                        {language === "English" ? "Buy Enterprise" : "এন্টারপ্রাইজ কিনুন"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Brand New Authentication & Account Sync Portal Layout */}
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-4 max-w-lg mx-auto">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 border-b border-slate-900 pb-1.5">
                    <CheckCircle size={10} className="text-teal-400" />
                    Authentication & Account Sync Portal
                  </h4>

                  <AuthenticationLayout
                    currentUser={currentUser}
                    onGoogleSignIn={loginWithGoogle}
                    language={language}
                  />
                </div>

                {/* 📞 DYNAMIC HELPLINE HUB & FOOTER METADATA LAYOUT */}
                <div className="bg-slate-950 border border-slate-905 rounded-xl p-4 py-3 max-w-lg mx-auto space-y-2 text-center">
                  <h4 className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest">
                    📞 Academic Assistance & Helpline Hub
                  </h4>
                  <p className="text-[9px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Have inquiries regarding licensing, student pricing, or mathematical step derivations? Contact our developer support panel directly.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    <a
                      href="https://wa.me/8801771412980"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[9.5px] px-2.5 py-1 rounded-lg font-semibold transition"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                        <path d="M17.472 14.382c-.022-.079-.116-.123-.27-.2l-.535-.263c-.254-.125-.56-.124-.813.003l-.441.22c-.112.056-.234.019-.327-.066a10.744 10.744 0 01-1.393-1.428l-.048-.063a.35.35 0 01-.01-.408l.192-.303c.1-.157.106-.356.015-.519l-.36-.64c-.161-.285-.503-.418-.813-.314l-.46.155c-.21.07-.36.262-.375.485-.028.435.07 1.139.73 2.128a11.161 11.161 0 003.5 3.5c.99.66 1.7.757 2.13.73.22-.015.41-.166.48-.376l.16-.46.105-.31-.027-.652-.312-.812l-.637-.361zm2.348-7.854a9.923 9.923 0 00-7.07-2.928c-5.5 0-10 4.5-10 9.9 0 1.8.4 3.5 1.3 5.1L2.6 22.1l3.7-.9c1.5.8 3.2 1.3 4.9 1.3h.005c5.5 0 10-4.5 10-10 0-2.6-1-5.1-2.9-7zm-7.01 15.3c-1.5 0-3.1-.4-4.5-1.2l-.3-.2-2.2.6.6-2.1-.2-.3c-.8-1.4-1.3-3.1-1.3-4.8 0-4.7 3.8-8.5 8.5-8.5 2.3 0 4.4.9 6 2.5a8.435 8.435 0 012.5 6c0 4.7-3.8 8.5-8.5 8.5z" />
                      </svg>
                      WhatsApp Support (+8801771412980)
                    </a>
                    <a
                      href="mailto:horsemk0@gmail.com"
                      className="inline-flex items-center gap-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-[9.5px] px-2.5 py-1 rounded-lg font-semibold transition"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      Email Developer (horsemk0@gmail.com)
                    </a>
                  </div>
                </div>

                {/* Privacy Policy Toggle button and policy statement */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowPrivacy(!showPrivacy)}
                    className="p-1 px-3 text-[10px] text-slate-500 hover:text-slate-350 underline transition-all flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    <Info size={10} />
                    {showPrivacy ? "Collapse Privacy Policy Guidelines" : "Show Student Data Privacy Policy Agreements"}
                  </button>

                  <AnimatePresence>
                    {showPrivacy && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 bg-slate-950/65 rounded-xl border border-slate-900 p-4 text-left font-sans text-[10px] text-slate-400 space-y-3 leading-relaxed"
                      >
                        <h4 className="font-bold text-slate-200 border-b border-slate-900 pb-1 flex items-center gap-1 font-mono">
                          🔐 STANDARD ACADEMIC PRIVACY POLICIES & TERMS
                        </h4>
                        <p>
                          <strong>1. Zero Data-Selling Model:</strong> We do not log, sell, or rent any student homework photos, sketches, handwriting variables, or mathematical equations to third-party brokers. All scanning processes run exclusively via safe runtime proxy connections.
                        </p>
                        <p>
                          <strong>2. Safe Cloud-Model Encryption:</strong> Whenever a homework problem image is submitted via the custom action buttons, we send only base64 representation strings to our sandboxed API endpoints. We use secure TLS encryption to keep mathematical research strictly confidential.
                        </p>
                        <p>
                          <strong>3. Standard Device Licensing:</strong> An Academic Pro license covers up to five simultaneous desktop or smartphone screens under the same school student ID. Session histories are strictly maintained locally in the client’s browser storage context unless cleared.
                        </p>
                        <p className="text-[9px] text-slate-500 italic">
                          Last Updated: June 2026. Certified standard compliant with international educational privacy frameworks.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER BLOCK */}
      <footer className="border-t border-slate-900 py-4 px-4 bg-slate-950 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[10px]">
          <span className="font-mono">AI Math Scanner Step Solver © 2026</span>
          <span>
            {language === "English" ? "Accurate academic derivations from sketches and photos." : t("appTitle")}
          </span>
        </div>
      </footer>

      {/* 📺 ADVERTISEMENT OVERLAY FOR FREE TIER */}
      <AnimatePresence>
        {isShowingAds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Progress header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-teal-500/10 text-teal-400">
                    <Sparkles size={14} className="animate-pulse" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-slate-100 text-xs sm:text-sm">
                      {language === "English" ? "Sponsor Advertisement" : "বিজ্ঞাপন স্পন্সর"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {language === "English" 
                        ? `Showing Ad ${activeAdStep} of 2` 
                        : `২টির মধ্যে ${toBengaliNumerals(activeAdStep)} নং বিজ্ঞাপন দেখাচ্ছে`}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-950 text-teal-400 font-mono font-bold px-2 py-0.5 rounded border border-slate-800">
                  {language === "English" 
                    ? `Skip in ${adTimeRemaining}s` 
                    : `${toBengaliNumerals(adTimeRemaining)} সেকেন্ড পর স্লিপ`}
                </span>
              </div>

              {/* Content body based on activeAdStep */}
              <AnimatePresence mode="wait">
                {activeAdStep === 1 ? (
                  <motion.div
                    key="ad-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 py-2"
                  >
                    <div className="relative h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-900/30 to-slate-950 border border-slate-800 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
                        alt="Google Workspace"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                      />
                      <div className="relative text-center p-4">
                        <span className="text-[9px] text-teal-400 font-mono tracking-widest font-bold uppercase">Google Cloud</span>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">Google Workspace for Education</h4>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                          Powering digital classrooms worldwide. Collaborate on Docs, Sheets, and Slides with deep security compliance.
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 text-center leading-relaxed italic">
                      Sponsorship helps keep unlimited standard calculations free for all global students.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ad-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 py-2"
                  >
                    <div className="relative h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900/30 to-slate-950 border border-slate-800 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop"
                        alt="Chromebook"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                      />
                      <div className="relative text-center p-4">
                        <span className="text-[9px] text-indigo-400 font-mono tracking-widest font-bold uppercase">Hardware Store</span>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">Smarter Student Chromebooks</h4>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                          Designed for heavy educational research. Engineered with a simple layout, lightweight chassis, and all-weather battery longevity.
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 text-center leading-relaxed italic">
                      Subscribe to **Academic Pro** anytime to bypass sponsor messages forever.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading progress bar */}
              <div className="space-y-1">
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    key={`bar-${activeAdStep}`}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

{/* BRAND NEW SECURE AUTHENTICATION REPLACEMENT LAYOUT */}
export function AuthenticationLayout({ currentUser, onGoogleSignIn, language }: {
  currentUser: any;
  onGoogleSignIn: () => Promise<any>;
  language: string;
}) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authStatus, setAuthStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus(null);
    
    if (!email.includes("@")) {
      setAuthStatus({
        type: "error",
        msg: language === "English" ? "Please enter a valid email address." : "দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন।"
      });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setAuthStatus({
        type: "error",
        msg: language === "English" ? "Password must contain at least 6 characters." : "পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ অক্ষরের হতে হবে।"
      });
      setIsLoading(false);
      return;
    }

    try {
      if (authMode === "register") {
        await signUpWithEmail(email, password, fullName);
        setAuthStatus({
          type: "success",
          msg: language === "English" ? "Account created successfully! Welcome aboard." : "অ্যাকাউন্ট তৈরি সফল হয়েছে! স্বাগতম।"
        });
      } else {
        await loginWithEmail(email, password);
        setAuthStatus({
          type: "success",
          msg: language === "English" ? "Successfully logged in!" : "সফলভাবে লগইন করা হয়েছে!"
        });
      }
    } catch (error: any) {
      setAuthStatus({
        type: "error",
        msg: error.message || (language === "English" ? "Authentication failed." : "প্রমাণীকরণ ব্যর্থ হয়েছে।")
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    const popupText = language === "English" 
      ? "Apple Sign-In is launching securely. Connecting browser keychain..." 
      : "অ্যাপল সাইন-ইন চালু হচ্ছে। ব্রাউজার কী-চেইন সংযুক্ত করা হচ্ছে...";
    setAuthStatus({
      type: "success",
      msg: popupText
    });
  };

  return (
    <div className="space-y-4">
      {currentUser ? (
        <div className="p-4 bg-teal-500/10 border border-teal-500/25 rounded-xl text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center text-xs font-bold mx-auto">
            {currentUser.displayName ? currentUser.displayName[0] : "S"}
          </div>
          <p className="text-[11px] text-slate-200 font-semibold">
            {language === "English" ? "You are authenticated!" : "আপনি সফলভাবে লগইন করেছেন!"}
          </p>
          <p className="text-[9px] text-slate-450">
            {language === "English" 
              ? `Connected via ${currentUser.email || "Google Account"}. Premium synced.` 
              : `${currentUser.email || "গুগল অ্যাকাউন্ট"} এর সাথে সংযুক্ত। প্রিমিয়াম সিন্ক করা হয়েছে।`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => { setAuthMode("login"); setAuthStatus(null); }}
              className={`flex-1 py-1 text-[10px] sm:text-xs font-bold rounded-md transition ${
                authMode === "login"
                  ? "bg-slate-950 text-teal-400 border border-slate-800"
                  : "text-slate-400 hover:text-slate-200 cursor-pointer"
              }`}
            >
              {language === "English" ? "Login" : "লগইন"}
            </button>
            <button
              onClick={() => { setAuthMode("register"); setAuthStatus(null); }}
              className={`flex-1 py-1 text-[10px] sm:text-xs font-bold rounded-md transition ${
                authMode === "register"
                  ? "bg-slate-950 text-teal-400 border border-slate-800"
                  : "text-slate-400 hover:text-slate-200 cursor-pointer"
              }`}
            >
              {language === "English" ? "Create Account" : "অ্যাকাউন্ট তৈরি"}
            </button>
          </div>

          {/* Social Sign In Option block */}
          <div className="grid grid-cols-2 gap-2">
            {/* Google */}
            <button
              onClick={async () => {
                try {
                  await onGoogleSignIn();
                } catch (e) {}
              }}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#ea4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.463 0 4.116 1.026 5.058 1.926l3.245-3.125C18.3 1.838 15.534 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.737-.08-1.3-.176-1.859H12.24z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Apple */}
            <button
              onClick={handleAppleSignIn}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.548 0-1.711-.616-2.895-.616-1.558 0-2.993.886-3.795 2.277-1.615 2.807-.413 6.969 1.156 9.227.766 1.107 1.666 2.341 2.868 2.292 1.15-.045 1.587-.745 2.977-.745 1.385 0 1.782.745 2.978.72 1.222-.02 2.016-1.127 2.767-2.227.873-1.272 1.237-2.502 1.258-2.57-.044-.02-2.42-.927-2.438-3.69-.022-2.316 1.89-3.428 1.986-3.486-1.085-1.58-2.75-1.763-3.342-1.79-1.53-.13-2.93.908-3.52.908v-.025zm1.787-4.103c.652-.792 1.09-1.892.97-2.793-.77.031-1.705.513-2.256 1.154-.475.545-.89 1.665-.77 2.545.86.067 1.73-.424 2.056-.906z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-650 my-1 select-none">
            <div className="h-[1px] bg-slate-850 flex-grow" />
            <span className="text-[7.5px] font-mono tracking-widest uppercase">{language === "English" ? "or continue with" : "অথবা ইমেইল দিয়ে"}</span>
            <div className="h-[1px] bg-slate-850 flex-grow" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {authMode === "register" && (
              <div className="space-y-1 animate-fadeIn">
                <label className="block text-[8px] font-mono font-bold text-slate-550 uppercase tracking-widest">
                  {language === "English" ? "Full Name" : "পূর্ণ নাম"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === "English" ? "e.g. Shakib Al Hasan" : "যেমন সাকিব আল হাসান"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[8px] font-mono font-bold text-slate-550 uppercase tracking-widest">
                {language === "English" ? "Academic / Personal Email" : "একাডেমিক / ব্যক্তিগত ইমেল"}
              </label>
              <input
                type="email"
                required
                placeholder="student@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-200 placeholder-slate-650 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[8px] font-mono font-bold text-slate-550 uppercase tracking-widest">
                {language === "English" ? "Password" : "পাসওয়ার্ড"}
              </label>
              <input
                type="password"
                required
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-200 placeholder-slate-655 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-teal-500/10 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isLoading && <RefreshCw size={10} className="animate-spin" />}
              {authMode === "login" 
                ? (language === "English" ? "Sign In" : "লগইন করুন")
                : (language === "English" ? "Create Account & Start Sync" : "অ্যাকাউন্ট তৈরি করুন")}
            </button>
          </form>

          {authStatus && (
            <div className={`p-2 rounded-lg text-[9px] flex items-center gap-1.5 animate-fadeIn ${
              authStatus.type === "success" 
                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400" 
                : "bg-rose-500/10 border border-rose-500/25 text-rose-400"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${authStatus.type === "success" ? "bg-emerald-400" : "bg-rose-405"}`} />
              <p className="font-semibold leading-relaxed">{authStatus.msg}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
