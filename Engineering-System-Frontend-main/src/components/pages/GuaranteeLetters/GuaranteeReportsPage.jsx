import React, { useState } from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";
import { reportButtons } from "./mockData";

export default function GuaranteeReportsPage() {
  const [projectCode, setProjectCode] = useState("");
  const [projectName, setProjectName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [companyNameFilter, setCompanyNameFilter] = useState("");
  const [reportTitle, setReportTitle] = useState("تقرير متابعة المستخلصات");
  const [useDate, setUseDate] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader title="التقارير" secondaryLink="قسم الحسابات" secondaryPath="/accounts-dept" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input label="كود المشروع الرئيسى" type="number" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
          <Input label="اسم المشروع" value={projectName} onChange={(e) => setProjectName(e.target.value)} readOnly />
          <Input label="كود الشركة" type="number" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} />
          <Input label="اسم الشركة" value={companyName} onChange={(e) => setCompanyName(e.target.value)} readOnly />
          <Input label="الموظف" type="number" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} />
          <Input label="اسم الموظف" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} readOnly />
          <Input label="اسم المشروع" value={projectNameFilter} onChange={(e) => setProjectNameFilter(e.target.value)} />
          <Input label="اسم الشركة" value={companyNameFilter} onChange={(e) => setCompanyNameFilter(e.target.value)} />
          <Input label="عنوان التقرير" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">إستخدام التاريخ</label>
            <input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} />
          </div>
          <Input label="التاريخ من" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} disabled={!useDate} />
          <Input label="إلى التاريخ" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} disabled={!useDate} />
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {reportButtons.map((title) => (
            <Button key={title} className={title === "طباعة التقرير ككل متأخر" ? "border-2 border-primary-700" : ""}>{title}</Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
