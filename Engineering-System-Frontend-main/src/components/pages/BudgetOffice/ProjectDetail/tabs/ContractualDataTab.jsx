import React from "react";
import Input from "../../../../ui/Input/Input";
import Button from "../../../../ui/Button/Button";

export default function ContractualDataTab({ statement }) {
  const contractualData = statement?.contractualData || {};

  // Side button handlers
  const handlePrintStatement1 = () => {
    console.log("طباعة بيان الاستقطاع 1");
    // Implementation for printing statement 1
  };

  const handlePrintStatement2 = () => {
    console.log("طباعة بيان الاستقطاع 2");
    // Implementation for printing statement 2
  };

  const handlePrintStatement3 = () => {
    console.log("طباعة بيان الاستقطاع 3");
    // Implementation for printing statement 3
  };

  const handlePrintStatement4 = () => {
    console.log("طباعة بيان الاستقطاع 4");
    // Implementation for printing statement 4
  };

  const handleEnvironmentalConditions = () => {
    console.log("طباعة بيان الاشتراطات البيئية");
    // Implementation for environmental conditions
  };

  const handleEnvironmentalConditionsUpload = () => {
    console.log("بيان الاشتراطات البيئية ورفع المشروع");
    // Implementation for environmental conditions and project upload
  };

  const handleConditionsByTariff = () => {
    console.log("بيان الاشتراطات حسب التعرفة");
    // Implementation for conditions by tariff
  };

  const handleConditionsByDeduction = () => {
    console.log("بيان الاشتراطات حسب بند الخصم");
    // Implementation for conditions by deduction item
  };

  const handleProtectionDeductions = () => {
    console.log("بيان مخصومات حماية بند الخصم");
    // Implementation for protection deductions
  };

  const handleKnowTariffCalculation = () => {
    console.log("معرفة حساب التعرفة");
    // Implementation for tariff calculation
  };

  const handleAllowanceTariffDeduction = () => {
    console.log("بيان البدل / التعرفة / الخصم");
    // Implementation for allowance/tariff/deduction statement
  };

  const handlePrintFinancialRevenues = () => {
    console.log("طباعة كشف الايراادات المالية");
    // Implementation for printing financial revenues
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">

        {/* Main Content Section */}
        <div className="flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم المشروع"
              value={contractualData.projectNumber || ""}
              readOnly
            />
            <Input
              label="رقم المسلسل"
              value={contractualData.serialNumber || ""}
              readOnly
            />
            <div className="md:col-span-2">
              <Input
                label="وصف المشروع"
                value={contractualData.projectDescription || ""}
                readOnly
              />
            </div>
            <Input
              label="الموازنة"
              value={contractualData.budget?.toLocaleString('ar-EG') || ""}
              readOnly
            />
            <Input
              label="العام المالي"
              value={contractualData.financialYear || ""}
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <Input
              label="البند"
              value={contractualData.item || ""}
              readOnly
            />
            <Input
              label="الصرف"
              value={contractualData.disbursement?.toLocaleString('ar-EG') || ""}
              readOnly
            />
            <Input
              label="بند الخصم"
              value={contractualData.deductionItem || ""}
              readOnly
            />
            <Input
              label="القيمة التعاقدية"
              value={contractualData.contractualValue?.toLocaleString('ar-EG') || ""}
              readOnly
            />
            <Input
              label="كود الشركة"
              value={contractualData.companyCode || ""}
              readOnly
            />
            <Input
              label="القيمة التقديرية"
              value={contractualData.estimatedValue?.toLocaleString('ar-EG') || ""}
              readOnly
            />
          </div>
        </div>
        {/* Side Buttons Section */}
        <div className="flex flex-col gap-2 w-64 shrink-0">
          <Button 
            onClick={handlePrintStatement1} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            طباعة بيان الاستقطاع 1
          </Button>
          <Button 
            onClick={handlePrintStatement2} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            طباعة بيان الاستقطاع 2
          </Button>
          <Button 
            onClick={handlePrintStatement3} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            طباعة بيان الاستقطاع 3
          </Button>
          <Button 
            onClick={handlePrintStatement4} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            طباعة بيان الاستقطاع 4
          </Button>
          <Button 
            onClick={handleEnvironmentalConditions} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            طباعة بيان الاشتراطات البيئية
          </Button>
          <Button 
            onClick={handleEnvironmentalConditionsUpload} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            بيان الاشتراطات البيئية ورفع المشروع
          </Button>
          <Button 
            onClick={handleConditionsByTariff} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            بيان الاشتراطات حسب التعرفة
          </Button>
          <Button 
            onClick={handleConditionsByDeduction} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            بيان الاشتراطات حسب بند الخصم
          </Button>
          <Button 
            onClick={handleProtectionDeductions} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            بيان مخصومات حماية بند الخصم
          </Button>
          <Button 
            onClick={handleKnowTariffCalculation} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            معرفة حساب التعرفة
          </Button>
          <Button 
            onClick={handleAllowanceTariffDeduction} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            بيان البدل / التعرفة / الخصم
          </Button>
          <Button 
            onClick={handlePrintFinancialRevenues} 
            variant="primary" 
            className="w-full"
            size="sm"
          >
            طباعة كشف الايراادات المالية
          </Button>
        </div>
      </div>
    </div>
  );
}
