export const tabs = [
  { key: "company-offers", label: "عروض الشركات" },
  { key: "technical-opening", label: "اجراءات الفتح الفني" },
  { key: "technical-decision", label: "اجراءات البت الفني" },
  { key: "financial-opening", label: "اجراءات الفتح المالي" },
  { key: "financial-decision", label: "اجراءات البت المالي" },
  { key: "supply-order", label: "أمر التوريد" },
  { key: "form-19-notes", label: "ملاحظات نموذج 19" },
];

export const fiscalYearOptions = [
  { value: "2026/2025", label: "2026/2025" },
  { value: "2025/2025", label: "2025/2025" },
];

export const committeeTypes = [
  { value: "لجنة فتح المظاريف الفنية", label: "لجنة فتح المظاريف الفنية" },
  { value: "لجنة البت الفني", label: "لجنة البت الفني" },
  { value: "لجنة البت المالي", label: "لجنة البت المالي" },
];

export const decisionOptions = [
  { value: "مقبول", label: "مقبول" },
  { value: "مرفوض", label: "مرفوض" },
  { value: "مؤجل", label: "مؤجل" },
];

export const reasonOptions = [
  { value: "مطابقة الشروط", label: "مطابقة الشروط" },
  { value: "نقص مستندات", label: "نقص مستندات" },
  { value: "سبب فني", label: "سبب فني" },
];

export const projects = [
  {
    code: "2588888",
    name: "انشاء الهيكل رقم 9 بطاقة رقم 2 بمشروع الواجهة البحرية العربية لمدينة العالمين الجديدة",
    totalCost: "100,000,000",
    branchCode: "2546",
    branchName: "اللواء 152 اشادات",
  },
  {
    code: "2588888",
    name: "انشاء الهيكل رقم 9 بطاقة رقم 2 بمشروع الواجهة البحرية العربية لمدينة العالمين الجديدة",
    totalCost: "100,000,000",
    branchCode: "2546",
    branchName: "اللواء 152 اشادات",
  },
];

export const committeeMembers = [
  { rank: "مقدم أ.ح", name: "أحمد عبدالسلام", role: "رئيس اللجنة", isActive: true, hasSigned: true },
  { rank: "نقيب", name: "محمد السيد", role: "عضو اللجنة", isActive: true, hasSigned: true },
  { rank: "مقدم", name: "محمود سعد", role: "مندوب العقود", isActive: false, hasSigned: true },
  { rank: "ملازم", name: "علي حسن", role: "عضو هيئة القضاء", isActive: true, hasSigned: false },
];

export const offers = [
  {
    sequence: "3/1",
    companyCode: "6618",
    companyName: "مكتب البنوق للمقاولات",
    offerType: "عرض أساسي",
    securityApproval: "25555",
    bidBond: "ضمان ابتدائي",
    bidBondDate: "2025/5/3",
    documentCount: 12,
    documentType: "سجل تجاري",
    isVerified: true,
    financialValue: "5,564,845,071",
    reviewedValue: "5,564,000,000",
    discountPercentage: "2",
    valueAfterDiscount: "5,452,720,000",
    excluded: false,
    decisionDate: "2025/5/5",
    ruling: "مقبول",
    itemNumbers: "1 & 6",
    financialDocs: "مستلم",
  },
  {
    sequence: "3/2",
    companyCode: "6619",
    companyName: "شركة البناء الحديث",
    offerType: "عرض أساسي",
    securityApproval: "26555",
    bidBond: "ضمان بنكي",
    bidBondDate: "2025/5/4",
    documentCount: 22,
    documentType: "بطاقة ضريبية",
    isVerified: true,
    financialValue: "5,455,484,111",
    reviewedValue: "5,454,000,000",
    discountPercentage: "1.5",
    valueAfterDiscount: "5,372,190,000",
    excluded: false,
    decisionDate: "2025/5/5",
    ruling: "مقبول",
    itemNumbers: "2 & 5",
    financialDocs: "مستلم",
  },
  {
    sequence: "3/3",
    companyCode: "5555",
    companyName: "شركة الاتحاد",
    offerType: "عرض أساسي",
    securityApproval: "27555",
    bidBond: "وثيقة تأمين",
    bidBondDate: "2025/5/5",
    documentCount: 15,
    documentType: "شهادة ضريبية",
    isVerified: false,
    financialValue: "5,874,545,412",
    reviewedValue: "5,860,000,000",
    discountPercentage: "0",
    valueAfterDiscount: "5,874,545,412",
    excluded: true,
    decisionDate: "2025/5/5",
    ruling: "مرفوض",
    itemNumbers: "3 & 4",
    financialDocs: "غير مكتمل",
  },
];

export const offerItems = [
  {
    itemCode: "1",
    itemNumber: "1",
    itemName: "توريد مفصلات بلاستك",
    unit: "3",
    quantity: "23000",
    estimatedPrice: "48,785.000",
    companyPrice: "515,000.00",
    discount: "0",
    priceAfterDiscount: "515,000.00",
    total: "549,889,566",
    decision: "مقبول",
    reason: "مطابقة الشروط",
  },
  {
    itemCode: "2",
    itemNumber: "2",
    itemName: "توريد حوض 60 سم",
    unit: "3",
    quantity: "23000",
    estimatedPrice: "48,785.000",
    companyPrice: "515,000.00",
    discount: "0",
    priceAfterDiscount: "515,000.00",
    total: "555,487,486",
    decision: "مقبول",
    reason: "مطابقة الشروط",
  },
];

export const supplyItems = [
  { itemNumber: "1", unit: "3", quantity: "23,000", unitPrice: "515,000.00", total: "549,889,566" },
  { itemNumber: "2", unit: "3", quantity: "23,000", unitPrice: "515,000.00", total: "555,487,486" },
];

export const budgetAllocations = [
  { code: "A-100", allocation: "اعمال انشائية", amount: "687,000", projectDescription: "مشروع الواجهة البحرية", isActive: true },
  { code: "A-101", allocation: "توريدات", amount: "512,500", projectDescription: "مشروع الواجهة البحرية", isActive: false },
];

export const getActionButtons = (activeTab) => {
  switch (activeTab) {
    case "technical-decision":
      return ["طباعة نموذج 9", "طباعة نموذج 10/أ", "طباعة نموذج 10/ب", "طباعة نموذج1/ أ", "خطاب القرارات", "خطاب اللجنة"];
    case "financial-opening":
      return ["طباعة نموذج 12/أ", "طباعة نموذج 12/ب", "المراجعة المحاسبية", "182/12 طباعة", "طباعة نموذج 16 ب 182"];
    case "financial-decision":
      return ["طباعة لطلب الفتح الفني", "تسجيل الفوز المالي", "طباعة نموذج 19", "طباعة نموذج 19 ب", "توزيع بن الشركات 1-", "المحاضر رقم 1-", "طباعة نموذج 16 ب 2-", "المحاضر رقم 2-", "15/182 طباعة", "طباعة نموذج 16 ب 182"];
    case "supply-order":
      return ["انشاء أمر توريد", "انشاء أمر توريد", "طباعة أمر التوريد", "نموذج 19 / 1 ب", "نموذج 1 ب / 1", "خزنة / كشف", "طباعة حجم العرواني", "طباعة محضر جرد الخضمات"];
    default:
      return ["طباعة نموذج 6/أ", "طباعة نموذج 6/ب", "طباعة نموذج 6/ج", "طباعة نموذج 7"];
  }
};
