import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table/Table";
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";
import { fiscalYears } from "./mockData";
import { getGuaranteeLettersByProject } from "../../../api/guaranteeLettersAPI";
import Loading from "../../common/Loading/Loading";

export default function RegisterGuaranteeLettersPage() {
  const [searchMode, setSearchMode] = useState("by_number");
  const [projectNumberInput, setProjectNumberInput] = useState("");
  const [fiscalYear, setFiscalYear] = useState(fiscalYears[0].value);
  const [committed, setCommitted] = useState(null);
  const [guaranteeData, setGuaranteeData] = useState({
    requestNumber: "",
    issueDate: "",
    expiryDate: "",
    renewalDate: "",
    amount: "",
    type: "",
    bank: "",
    entity: "",
    notes: "",
    expired: false,
    renewalStartDate: "",
    renewalEndDate: "",
  });

  const handleSearch = () => {
    if (projectNumberInput.trim()) {
      setCommitted({ projectCode: projectNumberInput.trim(), fiscalYear });
    }
  };

  const handleClear = () => {
    setProjectNumberInput("");
    setCommitted(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["guaranteeLetters", committed],
    queryFn: () => getGuaranteeLettersByProject(committed?.projectCode),
    enabled: !!committed?.projectCode,
  });

  const letters = data?.data?.guaranteeLetters || data?.data || [];
  const firstLetter = letters[0] || {};

  useEffect(() => {
    setGuaranteeData({
      requestNumber: firstLetter.guaranteeRequestNumber || "",
      issueDate: firstLetter.guaranteeLetterDate || "",
      expiryDate: firstLetter.letterEndDate || "",
      renewalDate: firstLetter.renewalDate || "",
      amount: firstLetter.guaranteeValue || "",
      type: firstLetter.letterType || "",
      bank: firstLetter.bankName || "",
      entity: firstLetter.entity || "",
      notes: firstLetter.notes || "",
      expired: !!firstLetter.expired,
      renewalStartDate: firstLetter.renewalStartDate || "",
      renewalEndDate: firstLetter.renewalEndDate || "",
    });
  }, [firstLetter]);

  const handleFieldChange = (field, value) => {
    setGuaranteeData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader code="TR001GRNT_F" title="تسجيل خطابات الضمان" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <Input label="رقم المشروع" value={projectNumberInput} onChange={(e) => setProjectNumberInput(e.target.value)} onKeyDown={handleKeyDown} />
          <Input
            label="العام المالي"
            type="select"
            options={fiscalYears.map((y) => ({ value: y.value, label: y.label }))}
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">بحث</Button>
            <Button variant="secondary" onClick={handleClear} className="flex-1">مسح</Button>
          </div>
        </div>
        <div className="flex gap-5 mt-3 flex-wrap text-sm">
          <label className="flex items-center gap-2"><input type="radio" checked={searchMode === "by_number"} onChange={() => setSearchMode("by_number")} />ابحث برقم المشروع</label>
          <label className="flex items-center gap-2"><input type="radio" checked={searchMode === "by_name"} onChange={() => setSearchMode("by_name")} />ابحث باسم المشروع</label>
        </div>
      </Card>

      {!committed && (
        <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">
          أدخل رقم المشروع للبحث
        </div>
      )}

      {committed && isLoading && <Loading />}

      {committed && error && (
        <div className="text-center py-8">
          <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
        </div>
      )}

      {committed && !isLoading && !error && (
        <>
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <p><span className="font-bold">رقم المشروع:</span> {firstLetter.projectCode || committed.projectCode}</p>
              <p><span className="font-bold">نوع المشروع:</span> {firstLetter.projectType || "-"}</p>
              <p><span className="font-bold">قيمة المشروع:</span> {firstLetter.projectValue || "-"}</p>
              <p><span className="font-bold">الشركة:</span> {firstLetter.companyName || "-"}</p>
              <p><span className="font-bold">مدة التنفيذ:</span> {firstLetter.executionDuration || "-"}</p>
            </div>
            <p className="mt-2 text-sm"><span className="font-bold">وصف المشروع:</span> {firstLetter.projectDescription || "-"}</p>
          </Card>

          <Card className="p-2">
            <Table>
              <TableHeader><TableRow><TableHead>بند المضامن</TableHead><TableHead>وصف البند</TableHead><TableHead>اظهار</TableHead></TableRow></TableHeader>
              <TableBody>
                {letters.length > 0 ? (
                  letters.map((item) => (
                    <TableRow key={item._id || item.id}>
                      <TableCell>{item.itemNumber || item.guaranteeItemNumber || "-"}</TableCell>
                      <TableCell className="text-right whitespace-normal">{item.description || item.itemDescription || "-"}</TableCell>
                      <TableCell><input type="checkbox" checked={!!item.isActive} readOnly /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">لا توجد بيانات</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input label="رقم مطلب الضمان" value={guaranteeData.requestNumber} onChange={(e) => handleFieldChange("requestNumber", e.target.value)} />
              <Input label="تاريخ خطاب الضمان" type="date" value={guaranteeData.issueDate} onChange={(e) => handleFieldChange("issueDate", e.target.value)} />
              <Input label="تاريخ سنهاء الخطاب" type="date" value={guaranteeData.expiryDate} onChange={(e) => handleFieldChange("expiryDate", e.target.value)} />
              <Input label="تاريخ التجديد" type="date" value={guaranteeData.renewalDate} onChange={(e) => handleFieldChange("renewalDate", e.target.value)} />
              <Input label="قيمة خطاب الضمان" value={guaranteeData.amount} onChange={(e) => handleFieldChange("amount", e.target.value)} />
              <Input label="نوع الخطاب" value={guaranteeData.type} onChange={(e) => handleFieldChange("type", e.target.value)} />
              <Input label="البنك" value={guaranteeData.bank} onChange={(e) => handleFieldChange("bank", e.target.value)} />
              <Input label="الجهة" value={guaranteeData.entity} onChange={(e) => handleFieldChange("entity", e.target.value)} />
              <Input label="ملاحظات" value={guaranteeData.notes} onChange={(e) => handleFieldChange("notes", e.target.value)} />
              <div className="flex items-center gap-2 text-sm font-semibold"><span>مؤسر الانتهاء / انتهى</span><input type="checkbox" checked={guaranteeData.expired} onChange={(e) => handleFieldChange("expired", e.target.checked)} /></div>
              <p className="text-sm font-bold self-center">عدد الخطابات: {letters.length}</p>
              <Input label="فترة التجديد من" type="date" value={guaranteeData.renewalStartDate} onChange={(e) => handleFieldChange("renewalStartDate", e.target.value)} />
              <Input label="فترة التجديد إلى" type="date" value={guaranteeData.renewalEndDate} onChange={(e) => handleFieldChange("renewalEndDate", e.target.value)} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Button>تقرير الادارة المركزية</Button>
              <Button>تقرير الادارة المركزية (٢)</Button>
              <Button>تقرير الجهات الاخرى</Button>
              <Button>تسجيل بنك جديد</Button>
              <Button>تجديد خطاب ضمان</Button>
              <Button>تقرير مشروع/شركة</Button>
              <Button>تجديد خطابات خلال فترة</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
