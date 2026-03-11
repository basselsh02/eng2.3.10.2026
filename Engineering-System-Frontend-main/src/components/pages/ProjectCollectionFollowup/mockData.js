export const arabicDate = new Date().toLocaleDateString("ar-EG-u-nu-arab", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const fiscalYears = [
  { value: "2025/2024", label: "٢٠٢٥/٢٠٢٤" },
  { value: "2026/2025", label: "٢٠٢٦/٢٠٢٥" },
];

export const settlementsRows = [
  {
    id: 1,
    arrivalFromProcurementDate: "٢٠٢٤-٠٩-٢٦",
    settlementReceiptDate: "٢٠٢٤-١٠-١٣",
    procedureStartDate: "٢٠٢٤-١٠-١٣",
    reviewerCode: "١٧",
    reviewerName: "أ/ هبة منحت",
    sentToAuthorityDate: "٢٠٢٤-١١-١٩",
    notes: "يوجد سلف على الشركة رئيس اللجنة نائب تنيب كريم خالد الشرقاوي لك ٥٨١",
  },
  {
    id: 2,
    arrivalFromProcurementDate: "٢٠٢٤-١٠-٣٠",
    settlementReceiptDate: "٢٠٢٤-١١-٠٣",
    procedureStartDate: "٢٠٢٤-١١-٠٤",
    reviewerCode: "١٧",
    reviewerName: "أ/ هبة منحت",
    sentToAuthorityDate: "٢٠٢٤-١٢-٠١",
    notes: "عدم اعتماد وختم الاقرارات المرفقة الخاصة بالشركة/أصول محمد",
  },
  {
    id: 3,
    arrivalFromProcurementDate: "٢٠٢٥-٠١-٢٥",
    settlementReceiptDate: "٢٠٢٥-٠١-٢٨",
    procedureStartDate: "٢٠٢٥-٠١-٢٩",
    reviewerCode: "١٧",
    reviewerName: "أ/ هبة منحت",
    sentToAuthorityDate: "٢٠٢٥-٠٢-١٧",
    notes: "حساب استيفاء من المركزية عدم وضوح الاجراءات",
  },
  {
    id: 4,
    arrivalFromProcurementDate: "٢٠٢٥-٠٤-٢٢",
    settlementReceiptDate: "٢٠٢٥-٠٤-٢٤",
    procedureStartDate: "٢٠٢٥-٠٤-٢٤",
    reviewerCode: "١٧",
    reviewerName: "أ/ هبة منحت",
    sentToAuthorityDate: "٢٠٢٥-٠٥-٠٣",
    notes: "جاهزة للصرف استيفاء من المركزية",
  },
  {
    id: 5,
    arrivalFromProcurementDate: "٢٠٢٥-٠٦-٠١",
    settlementReceiptDate: "٢٠٢٥-٠٦-٠٤",
    procedureStartDate: "٢٠٢٥-٠٦-٠٤",
    reviewerCode: "١٧",
    reviewerName: "أ/ هبة منحت",
    sentToAuthorityDate: "",
    notes: "جاهزة للصرف استيفاء من المركزية عدد ارتقاء نماذج طلب الارتباط",
  },
];

export const auditRows = [
  {
    actionCode: 1,
    description: "فرع الامداد / تم التسجيل توريد",
    eventDateTime: "٢٠٢٤-٠٧-٣٠ ١:٠٨",
    department: "فرع الامداد",
    departmentCode: "١٥٠",
    userName: "أ/محمد عبد الفتى",
    notes: "",
  },
  {
    actionCode: 4,
    description: "قسم النشر / تم تسجيل اللجان",
    eventDateTime: "٢٠٢٤-٠٨-٠٦ ١:١٤",
    department: "قسم النشر",
    departmentCode: "١٧",
    userName: "أ/احمد رجب أحمد",
    notes: "",
  },
  {
    actionCode: 7,
    description: "تم الارسال الى قسم المشتريات/عقود",
    eventDateTime: "٢٠٢٤-٠٨-٠٦ ١:١٥",
    department: "قسم النشر",
    departmentCode: "١٧",
    userName: "أ/احمد رجب أحمد",
    notes: "",
  },
];

export const reportButtons = [
  "طباعة التقرير",
  "طباعة المتأخرات من التسويات",
  "اوامر توريد لم ترد لها التسوية",
  "اوامر توريد التى تم خروجها للهيئة",
];

export const salesTaxPrimaryActions = [
  "طباعة النموذج ١ ضريبة مبيعات",
  "طباعة التمويل/ج",
  "تحميل ملكية المستندات",
  "العقد / بدون سفر",
  "العقد بدون قديم",
  "طباعة العقد / قانون ٢٠٤ معدل اضافية",
  "طباعة العقد / قانون ٢٠٤ معدل بلا ضرائب",
  "طباعة الاقرار",
  "طباعة لنموذج ٤١ جزء",
  "طباعة لنموذج ٤١ مجموع",
];

export const salesTaxSecondaryActions = [
  "طباعة الشهادة",
  "طباعة الاقرار",
  "طباعة العقد / قانون ٢٠٠٤ معدل بلفعة",
  "طباعة العقد / بدون قديم / سفر",
  "طباعة العقد / قانون ٢٠٠٤ اضافية",
  "طباعة لنموذج ١ معدل بلا ضرائب",
  "تحميل النسان",
  "طباعة البعد العقد الجديد / سفر",
  "طباعة إعداد العقد / سفر",
];
