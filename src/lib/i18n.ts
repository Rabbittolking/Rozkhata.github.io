import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: "RozKhata",
      splashSubtitle1: "Daily account,",
      splashSubtitle2: "always with you",
      madeIn: "Made with ♥ in India",
      
      // Login
      welcomeBack: "Welcome Back!",
      loginToContinue: "Login to continue",
      enterMobileNumber: "Enter your mobile number",
      sendOtp: "Send OTP",
      agreeTerms: "By continuing, you agree to our",
      terms: "Terms & Conditions",
      
      // OTP
      verifyOtp: "Verify OTP",
      otpSentTo: "We have sent 6 digit OTP to",
      expireIn: "OTP will expire in",
      resendOtp: "Resend OTP",
      verifyLogin: "Verify & Login",
      
      // Tabs
      tabHome: "Home",
      tabReminders: "Reminders",
      tabProfile: "Profile",
      
      // Home
      totalUdhaar: "Total Udhaar",
      totalJama: "Total Jama",
      netBalance: "Net Balance",
      customerList: "Customer List",
      seeAll: "See All",
      searchCustomer: "Search Customer...",
      noCustomers: "No customers found. Click + to add one.",
      gave: "Gave",
      got: "Got",
      
      // Profile
      profile: "Profile",
      storeName: "Store Name",
      backupRestore: "Backup & Restore",
      settings: "Settings",
      rateUs: "Rate Us",
      shareApp: "Share App",
      logout: "Logout",
      language: "Language / भाषा",
      
      // Add Customer
      addCustomer: "Add Customer",
      addPhoto: "Add Photo",
      name: "Name",
      enterCustomerName: "Enter customer name",
      mobileNumber: "Mobile Number",
      enterMobileNumberInput: "Enter mobile number",
      addressOptional: "Address (Optional)",
      enterAddress: "Enter address",
      saveCustomer: "Save Customer",
      
      // Customer Details
      addUdhaarButton: "Add Udhaar",
      addJamaButton: "Add Jama",
      transactionHistory: "Transaction History",
      noTransactions: "No transactions",
      dueText: "Due:",
      
      // Add Transaction
      addTransaction: "Add Transaction",
      udhaarGave: "Udhaar (Gave)",
      jamaGot: "Jama (Got)",
      amount: "Amount",
      enterAmount: "Enter amount",
      date: "Date",
      dueDateOptional: "Due Date (Optional)",
      noteOptional: "Note (Optional)",
      enterNote: "Enter note",
      saveTransaction: "Save Transaction",
      
      // Reminders
      reminders: "Reminders",
      upcoming: "Upcoming",
      completed: "Completed",
      noReminders: "No upcoming reminders.",
      overdueBy: "Overdue by",
      days: "Days",
      dueToday: "Due Today",
      dueTomorrow: "Due Tomorrow",
      dueIn: "Due in",

      // Biometrics
      biometricLogin: "Biometric Login",
      enableBiometric: "Enable Biometric Login",
      biometricEnabled: "Biometric Login Enabled",
      biometricNotSupported: "Biometrics not supported on this device",
      loginWithBiometrics: "Login with Fingerprint / Face ID",

      // Products
      products: "Products",
      manageProducts: "Manage Products",
      addProduct: "Add Product",
      productName: "Product Name",
      productPrice: "Price",
      selectProduct: "Select Product",
      noProducts: "No products added yet."
    }
  },
  hi: {
    translation: {
      appName: "रोज़खाता",
      splashSubtitle1: "हर रोज़ का हिसाब,",
      splashSubtitle2: "हमेशा आपके साथ",
      madeIn: "भारत में ♥ के साथ निर्मित",
      
      welcomeBack: "वापसी पर स्वागत है!",
      loginToContinue: "जारी रखने के लिए लॉगिन करें",
      enterMobileNumber: "अपना मोबाइल नंबर दर्ज करें",
      sendOtp: "OTP भेजें",
      agreeTerms: "जारी रखकर, आप हमारी शर्तों से सहमत हैं",
      terms: "नियम एवं शर्तें",
      
      verifyOtp: "OTP सत्यापित करें",
      otpSentTo: "हमने 6 अंकों का OTP भेजा है",
      expireIn: "OTP समाप्त होगा",
      resendOtp: "OTP पुनः भेजें",
      verifyLogin: "सत्यापित करें और लॉगिन करें",
      
      tabHome: "होम",
      tabReminders: "रिमाइंडर",
      tabProfile: "प्रोफ़ाइल",
      
      totalUdhaar: "कुल उधार",
      totalJama: "कुल जमा",
      netBalance: "शुद्ध शेष",
      customerList: "ग्राहक सूची",
      seeAll: "सभी देखें",
      searchCustomer: "ग्राहक खोजें...",
      noCustomers: "कोई ग्राहक नहीं मिला। जोड़ने के लिए + पर क्लिक करें।",
      gave: "उधार",
      got: "जमा",
      
      profile: "प्रोफ़ाइल",
      storeName: "दुकान का नाम",
      backupRestore: "बैकअप और रीस्टोर",
      settings: "सेटिंग्स",
      rateUs: "हमें रेट करें",
      shareApp: "ऐप शेयर करें",
      logout: "लॉग आउट",
      language: "भाषा / Language",
      
      addCustomer: "ग्राहक जोड़ें",
      addPhoto: "फोटो जोड़ें",
      name: "नाम",
      enterCustomerName: "ग्राहक का नाम दर्ज करें",
      mobileNumber: "मोबाइल नंबर",
      enterMobileNumberInput: "मोबाइल नंबर दर्ज करें",
      addressOptional: "पता (वैकल्पिक)",
      enterAddress: "पता दर्ज करें",
      saveCustomer: "ग्राहक सहेजें",
      
      addUdhaarButton: "उधार जोड़ें",
      addJamaButton: "जमा जोड़ें",
      transactionHistory: "लेन-देन इतिहास",
      noTransactions: "कोई लेन-देन नहीं",
      dueText: "देय:",
      
      addTransaction: "लेन-देन जोड़ें",
      udhaarGave: "उधार (Gave)",
      jamaGot: "जमा (Got)",
      amount: "राशि",
      enterAmount: "राशि दर्ज करें",
      date: "तारीख",
      dueDateOptional: "देय तिथि (वैकल्पिक)",
      noteOptional: "नोट (वैकल्पिक)",
      enterNote: "नोट दर्ज करें",
      saveTransaction: "लेन-देन सहेजें",
      
      reminders: "रिमाइंडर",
      upcoming: "आने वाले",
      completed: "पूर्ण",
      noReminders: "कोई आगामी रिमाइंडर नहीं।",
      overdueBy: "देर से",
      days: "दिन",
      dueToday: "आज देय",
      dueTomorrow: "कल देय",
      dueIn: "में देय",

      biometricLogin: "बायोमेट्रिक लॉगिन",
      enableBiometric: "बायोमेट्रिक लॉगिन सक्षम करें",
      biometricEnabled: "बायोमेट्रिक लॉगिन सक्षम है",
      biometricNotSupported: "इस डिवाइस पर बायोमेट्रिक्स समर्थित नहीं हैं",
      loginWithBiometrics: "फिंगरप्रिंट / फेस आईडी से लॉगिन करें",

      // Products
      products: "उत्पाद",
      manageProducts: "उत्पाद प्रबंधित करें",
      addProduct: "उत्पाद जोड़ें",
      productName: "उत्पाद का नाम",
      productPrice: "कीमत",
      selectProduct: "उत्पाद चुनें",
      noProducts: "अभी तक कोई उत्पाद नहीं जोड़ा गया है।"
    }
  },
  es: {
    translation: {
      appName: "RozKhata",
      splashSubtitle1: "Cuenta diaria,",
      splashSubtitle2: "siempre contigo",
      madeIn: "Hecho con ♥ en India",
      
      welcomeBack: "¡Bienvenido de nuevo!",
      loginToContinue: "Iniciar sesión para continuar",
      enterMobileNumber: "Ingrese su número de móvil",
      sendOtp: "Enviar OTP",
      agreeTerms: "Al continuar, aceptas nuestros",
      terms: "Términos y condiciones",
      
      verifyOtp: "Verificar OTP",
      otpSentTo: "Hemos enviado un OTP de 6 dígitos a",
      expireIn: "OTP caducará en",
      resendOtp: "Reenviar OTP",
      verifyLogin: "Verificar e Iniciar Sesión",
      
      tabHome: "Inicio",
      tabReminders: "Recordatorios",
      tabProfile: "Perfil",
      
      totalUdhaar: "Deuda Total",
      totalJama: "Cobro Total",
      netBalance: "Saldo Neto",
      customerList: "Lista de Clientes",
      seeAll: "Ver Todo",
      searchCustomer: "Buscar cliente...",
      noCustomers: "No se encontraron clientes. Haga clic en + para añadir uno.",
      gave: "Dio",
      got: "Recibió",
      
      profile: "Perfil",
      storeName: "Nombre de la Tienda",
      backupRestore: "Copia de Seguridad y Restaurar",
      settings: "Ajustes",
      rateUs: "Califícanos",
      shareApp: "Compartir Aplicación",
      logout: "Cerrar Sesión",
      language: "Idioma / Language",
      
      addCustomer: "Añadir Cliente",
      addPhoto: "Añadir Foto",
      name: "Nombre",
      enterCustomerName: "Introduce el nombre del cliente",
      mobileNumber: "Número de Móvil",
      enterMobileNumberInput: "Ingresar número de móvil",
      addressOptional: "Dirección (Opcional)",
      enterAddress: "Ingresar dirección",
      saveCustomer: "Guardar Cliente",
      
      addUdhaarButton: "Añadir Deuda",
      addJamaButton: "Añadir Cobro",
      transactionHistory: "Historial de Transacciones",
      noTransactions: "Sin transacciones",
      dueText: "Vence:",
      
      addTransaction: "Añadir Transacción",
      udhaarGave: "Deuda (Dio)",
      jamaGot: "Cobro (Recibió)",
      amount: "Cantidad",
      enterAmount: "Ingresar cantidad",
      date: "Fecha",
      dueDateOptional: "Fecha de Vencimiento (Opcional)",
      noteOptional: "Nota (Opcional)",
      enterNote: "Ingresar nota",
      saveTransaction: "Guardar Transacción",
      
      reminders: "Recordatorios",
      upcoming: "Próximos",
      completed: "Completados",
      noReminders: "No hay próximos recordatorios.",
      overdueBy: "Atrasado por",
      days: "Días",
      dueToday: "Vence Hoy",
      dueTomorrow: "Vence Mañana",
      dueIn: "Vence en",

      biometricLogin: "Inicio de sesión biométrico",
      enableBiometric: "Habilitar inicio de sesión biométrico",
      biometricEnabled: "Inicio de sesión biométrico habilitado",
      biometricNotSupported: "Biometría no compatible en este dispositivo",
      loginWithBiometrics: "Iniciar sesión con huella / Face ID",

      // Products
      products: "Productos",
      manageProducts: "Gestionar Productos",
      addProduct: "Añadir Producto",
      productName: "Nombre del Producto",
      productPrice: "Precio",
      selectProduct: "Seleccionar Producto",
      noProducts: "Aún no se han añadido productos."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
