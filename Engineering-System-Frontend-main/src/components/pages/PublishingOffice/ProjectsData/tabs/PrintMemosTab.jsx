import React from "react";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";

const PRINT_BUTTONS = [
  { id: "candidateCompanies", label: "طباعة الشركات المرشحة" },
  { id: "itemsReport", label: "طباعة كشف الاصناف" },
  { id: "itemsDisplay", label: "طباعة عرض الاصناف" },
  { id: "offerWithNewTerms", label: "طباعة العرض بالشروط الجديدة" },
  { id: "contract", label: "طباعة العقد" },
  { id: "emptyContract", label: "طباعة العقد فارغ" },
  { id: "contractByLine", label: "طباعة العقد / بسطر" },
  { id: "certificate", label: "طباعة الشهادة" },
];

export default function PrintMemosTab({ project }) {
  const handlePrint = (buttonId) => {
    // Placeholder for actual print logic
    alert(`سيتم طباعة: ${PRINT_BUTTONS.find((b) => b.id === buttonId)?.label}`);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">طباعة المذكرات</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: project info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">بيانات المشروع</h4>
          <div className="space-y-4">
            <Input
              label="رقم المشروع"
              value={project?.projectCode || ""}
              disabled={true}
            />
            <Input
              label="نوع المشروع"
              value={project?.projectType || ""}
              disabled={true}
            />
            <Input
              label="اسم المشروع"
              value={project?.projectName || ""}
              disabled={true}
            />
          </div>
        </div>

        {/* Right side: print buttons */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">خيارات الطباعة</h4>
          {PRINT_BUTTONS.map((btn) => (
            <Button
              key={btn.id}
              variant="secondary"
              onClick={() => handlePrint(btn.id)}
              className="w-full justify-center"
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}