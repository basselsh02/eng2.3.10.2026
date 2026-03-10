import React from "react";
import Input from "../../ui/Input/Input";

export default function FinancialOpeningTab({ data }) {
  const opening = data.financialOpening || {};

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">إجراءات المتح المالي</h3>

      {/* Financial Opening Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
        <Input
          label="كود الشركة"
          value={opening.companyCode || ""}
          readOnly
        />
        <Input
          label="اسم الشركة"
          value={opening.companyName || "مكتب الشبكي للمقاولات"}
          readOnly
        />
        <Input
          label="نوع العرض"
          value={opening.offerType || "عرض الماسي"}
          readOnly
        />
        <Input
          label="نسبة قبل %"
          value={opening.previousPercentage || "0.00"}
          readOnly
        />
        <Input
          label="الترتيب المبدئي"
          value={opening.initialOrder || "3/1"}
          readOnly
        />
        <Input
          label="القيمة المالية قبل المراجعة"
          value={opening.financialValueBeforeReview?.toLocaleString("ar-EG") || "0"}
          readOnly
        />
        <Input
          label="فائدة البنك %"
          value={opening.bankInterest || "0.00"}
          readOnly
        />
        <Input
          label="قيمة الضمانة المتقدمة"
          value={opening.advancedGuaranteeValue?.toLocaleString("ar-EG") || "0"}
          readOnly
        />
        <Input
          label="قيمة الاضافة قبل"
          value={opening.additionValueBefore?.toLocaleString("ar-EG") || "0.00"}
          readOnly
        />
        <Input
          label="قيمة المالية بعد %"
          value={opening.financialValueAfterPercentage?.toLocaleString("ar-EG") || "0"}
          readOnly
        />
        <Input
          label="قيمة الاضافات بعد"
          value={opening.additionValueAfter?.toLocaleString("ar-EG") || "0.00"}
          readOnly
        />
        <Input
          label="نسبة بعد %"
          value={opening.percentageAfter || "0.00"}
          readOnly
        />
        <Input
          label="تاريخ انتهاء العرض"
          type="date"
          value={opening.offerEndDate ? new Date(opening.offerEndDate).toISOString().split('T')[0] : ""}
          readOnly
        />
        <Input
          label="تاريخ العرض"
          type="date"
          value={opening.offerDate ? new Date(opening.offerDate).toISOString().split('T')[0] : ""}
          readOnly
        />
        <Input
          label="تاريخ المتح الفني"
          type="date"
          value={opening.technicalOpeningDate ? new Date(opening.technicalOpeningDate).toISOString().split('T')[0] : ""}
          readOnly
        />
        <Input
          label="تاريخ النبذة"
          type="date"
          value={opening.summaryDate ? new Date(opening.summaryDate).toISOString().split('T')[0] : ""}
          readOnly
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>ملاحظة:</strong> جميع المعلومات المالية المعروضة هي للقراءة فقط ولا يمكن تعديلها من هذه الصفحة.
        </p>
      </div>
    </div>
  );
}
