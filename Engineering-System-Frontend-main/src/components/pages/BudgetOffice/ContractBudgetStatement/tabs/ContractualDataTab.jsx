import React from "react";
import Input from "../../../../ui/Input/Input";

export default function ContractualDataTab({ statement }) {
  const contractualData = statement?.contractualData || {};

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">البيانات التعاقدية</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="رقم العقد"
          value={contractualData.contractNumber || ""}
          readOnly
        />
        <Input
          label="تاريخ العقد"
          type="date"
          value={contractualData.contractDate ? new Date(contractualData.contractDate).toISOString().split('T')[0] : ""}
          readOnly
        />
        <Input
          label="اسم المقاول"
          value={contractualData.contractorName || ""}
          readOnly
        />
        <Input
          label="كود المقاول"
          value={contractualData.contractorCode || ""}
          readOnly
        />
        <Input
          label="قيمة العقد"
          value={contractualData.contractValue?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="مدة العقد (بالأشهر)"
          value={contractualData.contractDuration || ""}
          readOnly
        />
        <Input
          label="نسبة الدفعة المقدمة %"
          value={contractualData.advancePaymentPercentage || ""}
          readOnly
        />
        <Input
          label="قيمة الدفعة المقدمة"
          value={contractualData.advancePaymentValue?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="نوع الضمان"
          value={contractualData.guaranteeType || ""}
          readOnly
        />
        <Input
          label="قيمة الضمان"
          value={contractualData.guaranteeValue?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="نسبة الضمان %"
          value={contractualData.guaranteePercentage || ""}
          readOnly
        />
      </div>
      
      <Input
        label="شروط الدفع"
        value={contractualData.paymentTerms || ""}
        readOnly
      />
      <Input
        label="بند الغرامة"
        value={contractualData.penaltyClause || ""}
        readOnly
      />
      <Input
        label="ملاحظات"
        value={contractualData.notes || ""}
        readOnly
      />
    </div>
  );
}
