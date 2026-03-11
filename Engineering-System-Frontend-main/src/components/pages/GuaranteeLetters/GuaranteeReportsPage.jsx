import React, { useState } from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";
import { reportButtons } from "./mockData";

export default function GuaranteeReportsPage() {
  const [useDate, setUseDate] = useState(true);

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader title="التقارير" secondaryLink="قسم الحسابات" secondaryPath="/accounts-dept" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input label="كود المشروع الرئيسى" type="number" defaultValue="83424532" />
          <Input label="اسم المشروع" defaultValue="مشروع استغلال تطفلة أرض ١٣٥٥ فدان" readOnly />
          <Input label="كود الشركة" type="number" defaultValue="85" />
          <Input label="اسم الشركة" defaultValue="شركة مجموعة المدى الاستثمارية للتنمية العمرانية" readOnly />
          <Input label="الموظف" type="number" defaultValue="181" />
          <Input label="اسم الموظف" defaultValue="أ/محمد بسمير محمد" readOnly />
          <Input label="اسم المشروع" />
          <Input label="اسم الشركة" />
          <Input label="عنوان التقرير" defaultValue="تقرير متابعة المستخلصات" />
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">إستخدام التاريخ</label>
            <input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} />
          </div>
          <Input label="التاريخ من" type="date" defaultValue="2025-02-26" disabled={!useDate} />
          <Input label="إلى التاريخ" type="date" defaultValue="2026-02-26" disabled={!useDate} />
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
