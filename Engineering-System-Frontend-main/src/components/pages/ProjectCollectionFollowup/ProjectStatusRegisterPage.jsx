import React from "react";
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
import { arabicDate, auditRows } from "./mockData";

const detailFields = [
  ["رقم المشروع", "١١/٢٥/مبانى"],
  ["نوع المشروع", "توريدات"],
  ["تاريخ البداية", "٢٠٢٤-٠٨-٢١"],
  ["تاريخ النهاية", "٢٠٢٤-٠٨-٢١"],
  ["تاريخ ورود الكارت", "٢٠٢٤-٠٨-٢١"],
  ["تاريخ البت الفنى", "٢٠٢٤-٠٨-٢٢"],
  ["تاريخ البت المالي", "٢٠٢٤-٠٩-٠٣"],
  ["التكلفة التقديرية", "٤٩٩٢٠٠"],
  ["قيمة الارتباط", "٤٩٧٩٤٠"],
  ["قيمة الصرف", "٤٩٧٩٤٠"],
  ["الفرع المسئول", "اللواء ١٥١ انشاءات"],
  ["الجهة المستفيدة", "مشروع القيادة الاستراتيجية"],
  ["اسم الشركة", "مكتب الاصالة للمقاولات العامه"],
  ["اسم الموظف", "أ/محمد عبد الفتى"],
  ["الميوانية", "جهات عسكرية خارج الموازنة"],
  ["الحـرف", "تصديق هيئة الشئون المالية"],
  ["البلـد", "تصديق هيئة الشئون المالية"],
  ["اخر موقف", "قسم المشتريات / تم انشاء امر التوريد"],
];

export default function ProjectStatusRegisterPage() {
  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="TR006_MFS" dateLabel={arabicDate} title="تسجيل الموقف الحالي للمشروع" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-sm font-semibold">رقم المشروع</label>
            <input className="border rounded px-3 py-2 w-full" defaultValue="١١/٢٥/ب/س" />
          </div>
          <div>
            <label className="text-sm font-semibold">العام المالي</label>
            <input className="border rounded px-3 py-2 w-full" defaultValue="٢٠٢٥/٢٠٢٤" />
          </div>
          <label className="flex items-center gap-1 text-sm mt-6"><input type="radio" defaultChecked />ابحث برقم المشروع</label>
          <label className="flex items-center gap-1 text-sm mt-6"><input type="radio" />ابحث باسم المشروع</label>
        </div>
        <div className="mt-3">
          <Button variant="secondary" size="sm">الغاء البحث</Button>
        </div>
      </Card>

      <Card className="p-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {detailFields.map(([label, value]) => (
            <p key={label} className={label === "اسم الشركة" ? "bg-primary-50 p-2 rounded" : ""}>
              <b>{label}:</b> {value}
            </p>
          ))}
        </div>

        <p className="mt-3"><b>وصف المشروع:</b> توريد اصناف لزوم انشاء مستودع التعبينات الرئيسي رقم (١) بالقيادة الاستراتيجية /ل ١٥١ أنتى.</p>
        <p><b>بلد الخصم:</b> المبالغ المخصصة لفئة تنفيذ المطالب الانتشائية لإعادة تمركز مستودع التعبينات المختلط رقم (١)/مقر القيادة الاستراتيجية.</p>

        <div className="mt-2">
          <label className="font-semibold">ملاحظات</label>
          <textarea className="border rounded w-full p-2" rows={3} />
        </div>
      </Card>

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
            {auditRows.map((row, index) => (
              <TableRow key={`${row.actionCode}-${index}`}>
                <TableCell>{row.actionCode}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.eventDateTime}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.departmentCode}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell>{row.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
