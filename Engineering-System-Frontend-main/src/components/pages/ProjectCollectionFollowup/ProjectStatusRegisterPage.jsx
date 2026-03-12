import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import ModuleHeader from "./ModuleHeader";
import { arabicDate, auditRows } from "./mockData";
// TODO: import { getProjectStatus } from "../../../api/supplyOrdersAPI";

export default function ProjectStatusRegisterPage() {
  const { id } = useParams();

  const [projectCodeInput, setProjectCodeInput] = useState(id || "");
  const [financialYearInput, setFinancialYearInput] = useState("");
  const [searchMode, setSearchMode] = useState("by_number");
  const [committed, setCommitted] = useState(id ? { projectCode: id } : null);

  const [details] = useState({
    projectNumber: "",
    projectType: "",
    startDate: "",
    endDate: "",
    cardReceiptDate: "",
    technicalDecisionDate: "",
    financialDecisionDate: "",
    estimatedCost: "",
    commitmentValue: "",
    disbursementValue: "",
    responsibleBranch: "",
    beneficiary: "",
    companyName: "",
    employeeName: "",
    budgetType: "",
    letter: "",
    country: "",
    latestStatus: "",
    projectDescription: "",
    deductionCountry: "",
    notes: "",
  });

  const handleSearch = () => {
    if (projectCodeInput.trim()) {
      setCommitted({
        projectCode: projectCodeInput.trim(),
        financialYear: financialYearInput.trim(),
      });
    }
  };

  const handleClear = () => {
    setProjectCodeInput("");
    setFinancialYearInput("");
    setCommitted(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // TODO: Replace with real backend call when Supplies API is ready:
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["projectStatus", committed],
  //   queryFn: () => getProjectStatus(committed),
  //   enabled: !!committed,
  // });

  const auditTrail = committed ? auditRows : [];

  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="TR006_MFS" dateLabel={arabicDate} title="تسجيل الموقف الحالي للمشروع" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="رقم المشروع"
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            label="العام المالي"
            value={financialYearInput}
            onChange={(e) => setFinancialYearInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">بحث</Button>
            <Button variant="secondary" onClick={handleClear} className="flex-1">مسح</Button>
          </div>
        </div>
        <div className="flex gap-5 mt-3 flex-wrap">
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" checked={searchMode === "by_number"} onChange={() => setSearchMode("by_number")} />
            ابحث برقم المشروع
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" checked={searchMode === "by_name"} onChange={() => setSearchMode("by_name")} />
            ابحث باسم المشروع
          </label>
        </div>
      </Card>

      {!committed && (
        <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">
          أدخل رقم المشروع للبحث
        </div>
      )}

      {committed && (
        <Card className="p-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <p><b>رقم المشروع:</b> {details.projectNumber || committed.projectCode}</p>
            <p><b>نوع المشروع:</b> {details.projectType || "-"}</p>
            <p><b>تاريخ البداية:</b> {details.startDate || "-"}</p>
            <p><b>تاريخ النهاية:</b> {details.endDate || "-"}</p>
            <p><b>تاريخ ورود الكارت:</b> {details.cardReceiptDate || "-"}</p>
            <p><b>تاريخ البت الفنى:</b> {details.technicalDecisionDate || "-"}</p>
            <p><b>تاريخ البت المالي:</b> {details.financialDecisionDate || "-"}</p>
            <p><b>التكلفة التقديرية:</b> {details.estimatedCost || "-"}</p>
            <p><b>قيمة الارتباط:</b> {details.commitmentValue || "-"}</p>
            <p><b>قيمة الصرف:</b> {details.disbursementValue || "-"}</p>
            <p><b>الفرع المسئول:</b> {details.responsibleBranch || "-"}</p>
            <p><b>الجهة المستفيدة:</b> {details.beneficiary || "-"}</p>
            <p><b>اسم الشركة:</b> {details.companyName || "-"}</p>
            <p><b>اسم الموظف:</b> {details.employeeName || "-"}</p>
            <p><b>الميوانية:</b> {details.budgetType || "-"}</p>
            <p><b>الحـرف:</b> {details.letter || "-"}</p>
            <p><b>البلـد:</b> {details.country || "-"}</p>
            <p><b>اخر موقف:</b> {details.latestStatus || "-"}</p>
          </div>

          <p className="mt-3"><b>وصف المشروع:</b> {details.projectDescription || "-"}</p>
          <p><b>بلد الخصم:</b> {details.deductionCountry || "-"}</p>

          <div className="mt-2">
            <label className="font-semibold">ملاحظات</label>
            <textarea className="border rounded w-full p-2" rows={3} value={details.notes} readOnly />
          </div>
        </Card>
      )}

      {committed && (
        <Card className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>وصف الحدث</TableHead>
                <TableHead>تاريخ الحدث</TableHead>
                <TableHead>الفرع/المكتب/القسم المسئول</TableHead>
                <TableHead>الكود</TableHead>
                <TableHead>اسم المستخدم</TableHead>
                <TableHead>ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditTrail.length > 0 ? (
                auditTrail.map((row, index) => (
                  <TableRow key={`${row.actionCode}-${index}`}>
                    <TableCell>{row.actionCode}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.eventDateTime}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.departmentCode}</TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.notes || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">لا توجد بيانات</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
