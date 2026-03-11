import React, { useState } from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
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
  const [searchMode, setSearchMode] = useState("by_code");
  const [projectCode, setProjectCode] = useState("١/٢٥/مبا");
  const [fiscalYear, setFiscalYear] = useState(fiscalYears[0].value);

  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="TR001_SUPPLYF" dateLabel={arabicDate} title="متابعة التسويات" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <label className="text-sm">كود المشروع</label>
          <input className="border rounded px-3 py-2" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
          <label className="text-sm">العام المالي</label>
          <select className="border rounded px-3 py-2" value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)}>
            {fiscalYears.map((fy) => (
              <option key={fy.value} value={fy.value}>{fy.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-5 mt-4 items-center flex-wrap">
          <label className="flex items-center gap-1"><input type="radio" checked={searchMode === "by_code"} onChange={() => setSearchMode("by_code")} />ابحث برقم المشروع</label>
          <label className="flex items-center gap-1"><input type="radio" checked={searchMode === "by_name"} onChange={() => setSearchMode("by_name")} />ابحث باسم المشروع</label>
          <Button variant="secondary" size="sm" onClick={() => setProjectCode("")}>الغاء البحث</Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <p><span className="font-bold">كود المشروع:</span> ١١/٢٥/مبا</p>
          <p><span className="font-bold">رقم امر التوريد:</span> ١١/٢٥/مبانى</p>
          <p><span className="font-bold">تاريخ امر التوريد:</span> ٢٠٢٤-٠٩-٠٣</p>
          <p><span className="font-bold">قيمة الامر:</span> ٤٩٧٩٤٠</p>
          <p><span className="font-bold">نسبة الخصم%:</span> ٠</p>
          <p><span className="font-bold">قيمة الخصم:</span> ٠</p>
          <p><span className="font-bold">القيمة الفعلية للامر:</span> ٤٩٧٩٤٠</p>
          <p><span className="font-bold">الشركة:</span> ٥٦٦٨</p>
          <p><span className="font-bold">اسم الشركة:</span> مكتب الاصالة للمقاولات العامة</p>
        </div>
        <p className="mt-3 text-sm"><span className="font-bold">الوصف:</span> توريد اصناف لزوم انشاء مستودع التعبينات الرئيسي رقم (١) بالقيادة الاستراتيجية /ل ١٥١ أنتى.</p>
        <div className="mt-3">
          <Button variant="outline" size="sm">تأكيد ورود الامر</Button>
        </div>
      </Card>

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
            {settlementsRows.map((row) => (
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
