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
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";
import { claimTypes, claimsRows } from "./mockData";

export default function ClaimsTrackingPage() {
  const [searchMode, setSearchMode] = useState("by_number");
  const [projectCode, setProjectCode] = useState("٨٣٤٢٤٥٣٢");

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader code="TR001_CLAIMF" title="متابعة دخول وخروج المستخلصات" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <Input label="كود المشروع" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
          <div className="md:col-span-2 flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm"><input type="radio" checked={searchMode === "by_number"} onChange={() => setSearchMode("by_number")} />ابحث برقم المشروع</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" checked={searchMode === "by_name"} onChange={() => setSearchMode("by_name")} />ابحث باسم المشروع</label>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setProjectCode("")}>الغاء البحث</Button>
            <Button variant="outline" size="sm">طباعة التقرير</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <p><span className="font-bold">رقم المشروع:</span> ٨٣٤٢٤٥٣٢</p>
          <p><span className="font-bold">الشركة:</span> ٨٥</p>
          <p><span className="font-bold">القيمة الراسمية:</span> ٤٢٩٨٧</p>
          <p><span className="font-bold">اسم الشركة:</span> شركة مجموعة المدى الاستثمارية للتنمية العمرانية</p>
          <p><span className="font-bold">تاريخ البت المالي:</span> ٢٠٢٤-١٢-١٧</p>
        </div>
        <p className="mt-2 text-sm"><span className="font-bold">وصف المشروع:</span> أعمال تسوية ونقل مخلفات الموقع العام بمنطقة النادى بمشروع إستغلال تطفلة أرض ١٣٥٥ فدان شمال محور المشير طنطاوى RAVILLE.</p>
      </Card>

      <Card className="p-2">
        <div className="max-h-[320px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم مستخلص</TableHead>
                <TableHead>تاريخ الورود بالارشيف</TableHead>
                <TableHead>تاريخ المتابعة الاستيفاء</TableHead>
                <TableHead>نوع المستخلص</TableHead>
                <TableHead>الكود</TableHead>
                <TableHead>الموظف المسئول</TableHead>
                <TableHead>الفرع المسئول</TableHead>
                <TableHead>تاريخ المستخلص</TableHead>
                <TableHead>قيمة المستخلص</TableHead>
                <TableHead>المستحق صرفه</TableHead>
                <TableHead>تاريخ خروج</TableHead>
                <TableHead>ملاحظات الاستيفاء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claimsRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.claimNumber}</TableCell>
                  <TableCell>{row.archiveReceiptDate}</TableCell>
                  <TableCell>{row.followupCompletionDate || "-"}</TableCell>
                  <TableCell>
                    <select className="border rounded px-2 py-1 text-sm" defaultValue={row.claimType}>
                      {claimTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </select>
                  </TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.employee}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.claimDate}</TableCell>
                  <TableCell>{row.claimValue}</TableCell>
                  <TableCell>{row.disbursementDue}</TableCell>
                  <TableCell>{row.exitDate || "-"}</TableCell>
                  <TableCell className="whitespace-normal text-right">{row.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
