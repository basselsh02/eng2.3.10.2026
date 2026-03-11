export const claimTypes = [
  { value: "temporary", label: "مؤقت" },
  { value: "final", label: "خـتامى" },
  { value: "advance", label: "دفعة مقدمة" },
];

export const fiscalYears = [
  { value: "2022/2023", label: "٢٠٢٣/٢٠٢٢" },
  { value: "2023/2024", label: "٢٠٢٤/٢٠٢٣" },
  { value: "2024/2025", label: "٢٠٢٥/٢٠٢٤" },
];

export const guaranteeItems = [
  { id: 1, itemNumber: "", description: "", isActive: false },
  { id: 2, itemNumber: 2, description: "توريد أعمال الموقع العام", isActive: false },
  { id: 3, itemNumber: 3, description: "أعمال البنية التحتية والتسويات", isActive: false },
];

export const claimsRows = [
  {
    id: 1,
    claimNumber: "١",
    archiveReceiptDate: "٢٠٢٦-٠١-٠٢",
    followupCompletionDate: "",
    claimType: "final",
    code: "١٨١",
    employee: "أ/محمد بسمير محمد",
    branch: "كتيبة ٥٥١ اتش",
    claimDate: "٢٠٢٦-٠١-٠٥",
    claimValue: "٠٦٥٠٥٤٢٦٥",
    disbursementDue: "٥٢٥١٢٥",
    exitDate: "",
    notes: "",
  },
];

export const reportButtons = [
  "طباعة التقرير ككل",
  "طباعة التقرير ككل بمشروع",
  "طباعة تقرير بالشركات",
  "طباعة التقرير المتأخر",
  "طباعة التقرير ككل متأخر",
  "طباعة المتأخرات من المستخلصات",
  "طباعة التقارير التي تم خروجها",
  "طباعة التقرير مشروع - تم خروجهم",
  "طباعة المستخلصات التي تم خروجها",
];
