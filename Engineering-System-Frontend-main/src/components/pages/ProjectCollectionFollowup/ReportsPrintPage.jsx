import React, { useState } from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import ModuleHeader from "./ModuleHeader";
import { arabicDate, reportButtons } from "./mockData";

export default function ReportsPrintPage() {
  const [fiscalYear, setFiscalYear] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [branch, setBranch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClear = () => {
    setFiscalYear("");
    setCompanyCode("");
    setCompanyName("");
    setBeneficiary("");
    setEmployeeCode("");
    setEmployeeName("");
    setBranch("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="TR002_SUPPLYF" dateLabel={arabicDate} title="طباعة التقارير" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-semibold">العام المالي</label>
            <input className="border rounded px-3 py-2 w-full" value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">كود الشركة</label>
            <input className="border rounded px-3 py-2 w-full" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">اسم الشركة</label>
            <input className="border rounded px-3 py-2 w-full bg-gray-50" value={companyName} readOnly />
          </div>
          <div>
            <label className="text-sm font-semibold">الجهة المستفيدة</label>
            <input className="border rounded px-3 py-2 w-full" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">الموظف</label>
            <input className="border rounded px-3 py-2 w-full" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">اسم الموظف</label>
            <input className="border rounded px-3 py-2 w-full bg-gray-50" value={employeeName} readOnly />
          </div>
          <div>
            <label className="text-sm font-semibold">الفرع</label>
            <input className="border rounded px-3 py-2 w-full" value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">عن الفترة من تاريخ</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">الى تاريخ</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex justify-start">
          <Button variant="secondary" size="sm" onClick={handleClear}>الغاء البحث</Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reportButtons.map((title) => (
            <Button
              key={title}
              variant="primary"
              className={title.includes("تم خروجها") ? "border border-dashed border-primary-700" : ""}
            >
              {title}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
