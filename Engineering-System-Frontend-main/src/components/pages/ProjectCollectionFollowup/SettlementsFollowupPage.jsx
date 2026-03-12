import React, { useState } from "react";
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
import { arabicDate, fiscalYears, settlementsRows } from "./mockData";

export default function SettlementsFollowupPage() {
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [fiscalYear, setFiscalYear] = useState(fiscalYears[0].value);
  const [committed, setCommitted] = useState(null);

  const [projectDetails] = useState({
    projectCode: "",
    supplyOrderNumber: "",
    supplyOrderDate: "",
    orderValue: "",
    discountPercent: "",
    discountValue: "",
    actualOrderValue: "",
    companyCode: "",
    companyName: "",
    description: "",
  });

  const handleSearch = () => {
    if (projectCodeInput.trim()) {
      setCommitted({ projectCode: projectCodeInput.trim(), fiscalYear });
    }
  };

  const handleClear = () => {
    setProjectCodeInput("");
    setCommitted(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // TODO: Replace with real API call when Supplies backend is connected:
  // const { data, isLoading } = useQuery({
  //   queryKey: ["settlements", committed],
  //   queryFn: () => getSettlements(committed),
  //   enabled: !!committed,
  // });

  const rows = committed ? settlementsRows : [];

  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="TR001_SUPPLYF" dateLabel={arabicDate} title="متابعة التسويات" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="كود المشروع"
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="أدخل كود المشروع"
          />
          <div>
            <label className="text-sm font-semibold">العام المالي</label>
            <select className="border rounded px-3 py-2 w-full" value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)}>
              {fiscalYears.map((fy) => (
                <option key={fy.value} value={fy.value}>{fy.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">بحث</Button>
            <Button variant="secondary" onClick={handleClear} className="flex-1">مسح</Button>
          </div>
        </div>
      </Card>

      {!committed && (
        <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">
          أدخل كود المشروع للبحث
        </div>
      )}

      {committed && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <p><span className="font-bold">كود المشروع:</span> {projectDetails.projectCode || committed.projectCode}</p>
            <p><span className="font-bold">رقم امر التوريد:</span> {projectDetails.supplyOrderNumber || "-"}</p>
            <p><span className="font-bold">تاريخ امر التوريد:</span> {projectDetails.supplyOrderDate || "-"}</p>
            <p><span className="font-bold">قيمة الامر:</span> {projectDetails.orderValue || "-"}</p>
            <p><span className="font-bold">نسبة الخصم%:</span> {projectDetails.discountPercent || "-"}</p>
            <p><span className="font-bold">قيمة الخصم:</span> {projectDetails.discountValue || "-"}</p>
            <p><span className="font-bold">القيمة الفعلية للامر:</span> {projectDetails.actualOrderValue || "-"}</p>
            <p><span className="font-bold">الشركة:</span> {projectDetails.companyCode || "-"}</p>
            <p><span className="font-bold">اسم الشركة:</span> {projectDetails.companyName || "-"}</p>
          </div>
          <p className="mt-3 text-sm"><span className="font-bold">الوصف:</span> {projectDetails.description || "-"}</p>
        </Card>
      )}

      {committed && (
        <Card className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>م</TableHead>
                <TableHead>تاريخ الورود من المشتريات</TableHead>
                <TableHead>تاريخ ورود التسوية</TableHead>
                <TableHead>تاريخ بداية الاجراء</TableHead>
                <TableHead>كود المراجع</TableHead>
                <TableHead>اسم المراجع</TableHead>
                <TableHead>تاريخ الارسال للهيئة</TableHead>
                <TableHead>ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.arrivalFromProcurementDate}</TableCell>
                    <TableCell>{row.settlementReceiptDate}</TableCell>
                    <TableCell>{row.procedureStartDate}</TableCell>
                    <TableCell>{row.reviewerCode}</TableCell>
                    <TableCell>{row.reviewerName}</TableCell>
                    <TableCell>{row.sentToAuthorityDate || "-"}</TableCell>
                    <TableCell className="whitespace-normal text-right">{row.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">لا توجد بيانات</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-3">
            <Button variant="outline" size="sm">تأكيد ورود الامر</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
