import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import ModuleHeader from "./ModuleHeader";
import {
  arabicDate,
  salesTaxPrimaryActions,
  salesTaxSecondaryActions,
} from "./mockData";
// TODO: import { getSupplyOrderById } from "../../../api/supplyOrdersAPI";

export default function SalesTaxFormPage() {
  const { projectId } = useParams();

  const [projectCodeInput, setProjectCodeInput] = useState(projectId || "");
  const [committed, setCommitted] = useState(projectId ? { projectCode: projectId } : null);

  const emptyForm = useMemo(
    () => ({
      taxRegistrationNumber: "",
      orderNumber: "",
      serialTaxNumber: "",
      companyName: "",
      companyCode: "",
      companyAddress: "",
      responsibleName: "",
      authorityStatement: "",
      projectName: "",
      supplyOrderNumber: "",
      supplyOrderDate: "",
      totalEstimatedValue: "",
      actualOrderValue: "",
      contractDate: "",
      contractCompanyName: "",
      taxRate: "",
      taxValue: "",
      actualTaxValue: "",
      fixedGuarantee: "",
      industryGuarantee: "",
      total: "",
      projectCost: "",
      fiscalYear: "",
      brigade: "",
      branch: "",
      executingBranchName: "",
    }),
    []
  );

  const [formData, setFormData] = useState(emptyForm);

  const fieldLabels = {
    taxRegistrationNumber: "رقم التسجيل بضريبة المبيعات",
    orderNumber: "رقم الطلبية",
    serialTaxNumber: "رقم المسلسل الضريبي",
    companyName: "اسم الشركة",
    companyCode: "كود الشركة",
    companyAddress: "عنوان الشركة / عنوان المصنع",
    responsibleName: "اسم المسئول",
    authorityStatement: "بيان السلطة",
    projectName: "اسم المشروع",
    supplyOrderNumber: "رقم امر التوريد",
    supplyOrderDate: "تاريخ امر التوريد",
    totalEstimatedValue: "القيمة المسموية الاجمالية",
    actualOrderValue: "القيمة الفعلية للامر",
    contractDate: "تاريخ امر العقد",
    contractCompanyName: "اسم الشركة (العقد)",
    taxRate: "نسبة الضريبة %",
    taxValue: "قيمة الضريبة المبلغية",
    actualTaxValue: "القيمة الضريبة الفعلية",
    fixedGuarantee: "ضمان ثابت",
    industryGuarantee: "ضمان صناعة",
    total: "مجموع",
    projectCost: "تكلفة المشروع",
    fiscalYear: "العام المالي",
    brigade: "اللواء",
    branch: "الفرع",
    executingBranchName: "اسم الفرع المنفذ",
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (projectCodeInput.trim()) {
      setCommitted({ projectCode: projectCodeInput.trim() });
    }
  };

  const handleClear = () => {
    setProjectCodeInput("");
    setCommitted(null);
    setFormData(emptyForm);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // TODO: Replace with real backend call when Supplies API is ready:
  // const { data } = useQuery({
  //   queryKey: ["salesTax", committed],
  //   queryFn: () => getSupplyOrderById(committed?.projectCode),
  //   enabled: !!committed?.projectCode,
  // });
  // useEffect(() => { if (data?.data) setFormData(data.data); }, [data]);

  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader
        code="TR0515_F"
        dateLabel={arabicDate}
        title="نموذج ضريبة المبيعات توريدات"
        subTitle="نموذج ضريبة المبيعات توريدات"
      />

      <Card className="p-4">
        <div className="flex gap-3 flex-wrap items-end">
          <Input
            label="كود المشروع"
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="أدخل كود المشروع"
          />
          <div className="flex gap-2">
            <Button onClick={handleSearch}>بحث</Button>
            <Button variant="secondary" onClick={handleClear}>مسح</Button>
          </div>
        </div>
      </Card>

      {!committed && (
        <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">
          أدخل كود المشروع للبحث
        </div>
      )}

      {committed && (
        <>
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              {Object.keys(formData).map((field) => (
                <div key={field}>
                  <label className="font-semibold">{fieldLabels[field] || field}</label>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    value={formData[field]}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {salesTaxPrimaryActions.map((title) => (
                <Button key={title} size="sm">{title}</Button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {salesTaxSecondaryActions.map((title) => (
                <Button key={title} size="sm" variant="secondary">{title}</Button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
