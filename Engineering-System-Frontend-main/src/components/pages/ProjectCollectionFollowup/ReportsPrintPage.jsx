import React from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import ModuleHeader from "./ModuleHeader";
import { arabicDate, reportButtons } from "./mockData";

const filterFields = [
  ["العام المالي", ""],
  ["كود الشركة", "٢٧"],
  ["اسم الشركة", "هايدليرج ماتيريالز - السويس للاسمنت"],
  ["الجهة المستفيدة", ""],
  ["الموظف", "٢٠١"],
  ["اسم الموظف", "ماجدة محسن"],
  ["الفرع", ""],
];

export default function ReportsPrintPage() {
  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="TR002_SUPPLYF" dateLabel={arabicDate} title="طباعة التقارير" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filterFields.map(([label, value]) => (
            <div key={label}>
              <label className="text-sm font-semibold">{label}</label>
              <input
                className="border rounded px-3 py-2 w-full"
                defaultValue={value}
                readOnly={label === "اسم الشركة" || label === "اسم الموظف"}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold">عن الفترة من تاريخ</label>
            <input type="date" className="border rounded px-3 py-2 w-full" defaultValue="2025-07-01" />
          </div>
          <div>
            <label className="text-sm font-semibold">الى تاريخ</label>
            <input type="date" className="border rounded px-3 py-2 w-full" defaultValue="2026-02-26" />
          </div>
        </div>

        <div className="mt-4 flex justify-start">
          <Button variant="secondary" size="sm">الغاء البحث</Button>
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
