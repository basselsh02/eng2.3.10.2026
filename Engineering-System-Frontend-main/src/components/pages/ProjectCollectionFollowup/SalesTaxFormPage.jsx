import React from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import ModuleHeader from "./ModuleHeader";
import {
  arabicDate,
  salesTaxPrimaryActions,
  salesTaxSecondaryActions,
} from "./mockData";

const headerFields = [
  ["رقم التسجيل بضريبة المبيعات", ""],
  ["رقم الطلبية", ""],
  ["رقم المسلسل الضريبي", ""],
  ["اسم الشركة", "مكتب الاصالة للمقاولات العامة"],
  ["كود", "٥٦٦٨"],
  ["عنوان الشركة / عنوان المصنع", ""],
  ["اسم المسئول", "عبداللة على عثمان بن شلوى من خلال القيم بأعمال سامر فاري"],
  ["بيان السلطة", ""],
  ["اسم المشروع", ""],
  ["رقم امر التوريد", "١١/٢٥/أسمى"],
  ["تاريخ امر التوريد", "٢٠٢١-٠٩-١٢"],
  ["القيمة المسموية الاجمالية", "٤٩٧٩٤٠"],
  ["القيمة الفعلية للامر", "٤٩٧٩٤٠"],
  ["تاريخ امر العقد", "٢٠٢٤-٠٩-١٢"],
  ["اسم الشركة (العقد)", "كتب الاصالة للمقاولات العامه"],
];

const taxFields = [
  ["نسبة الضريبة %", ""],
  ["قيمة الضريبة المبلغية", ""],
  ["تاريخ امر العقد / الانعقاد", "٢٠٢٤-٠٩-١٢"],
  ["القيمة الضريبة الفعلية", ""],
  ["قيمة الضريبة المبلغية (lower)", ""],
  ["الرقم", ""],
  ["الرقم (lower)", ""],
  ["ضمان ثابت", ""],
  ["ضمان صناعة", ""],
  ["٥٠ عاج جزء", ""],
  ["مجموع", "١٤٩٠"],
  ["تكلفة المشروع", "٢٤٩٨٨٨"],
  ["العام المالي", "٢٠٢٥/٢٠٢٤"],
  ["اللواء", "اللواء ١٥١ اشادات"],
  ["الفرع", ""],
  ["اسم الفرع المنفذ", "اللواء ١٥١ اشادات"],
  ["المسئولية الثانية التابع لها الفرض", ""],
  ["المسئولية التابع لها الفرض", ""],
  ["رقم الفصل الضرائبي", "٤١٦٢"],
  ["رقم الفصل الضرائبي (lower)", ""],
  ["مرجع مركب", "٢٩/٠١/٨٧٨/٤٩٩"],
  ["مرجع مركب (ثانوي)", "٢٩/٠١/٨٧٨/٤٤٩"],
];

export default function SalesTaxFormPage() {
  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader
        code="TR0515_F"
        dateLabel={arabicDate}
        title="نموذج ضريبة المبيعات توريدات"
        subTitle="نموذج ضريبة المبيعات توريدات"
      />

      <Card className="p-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div>
            <label className="text-sm font-semibold">كود المشروع</label>
            <input className="border rounded px-3 py-2" defaultValue="١١/٢٥/أسمى" />
          </div>
          <label className="flex items-center gap-1 text-sm"><input type="radio" defaultChecked />ابحث برقم المشروع</label>
          <label className="flex items-center gap-1 text-sm"><input type="radio" />ابحث باسم المشروع</label>
          <Button variant="secondary" size="sm">الغاء البحث</Button>
          <div className="border rounded px-3 py-2 text-sm">&lt; رقم المشروع: ١١/٢٥/أسمى &gt;</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {headerFields.map(([label, value]) => (
            <div key={label}>
              <label className="font-semibold">{label}</label>
              <input className="border rounded px-3 py-2 w-full" defaultValue={value} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {taxFields.map(([label, value]) => (
            <div key={label}>
              <label className="font-semibold">{label}</label>
              <input className="border rounded px-3 py-2 w-full" defaultValue={value} />
            </div>
          ))}
          <div className="flex items-end">
            <Button variant="outline" className="w-full">تحميل البيان</Button>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full">تحميل النسان</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold mb-2">أوامر الطباعة الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {salesTaxPrimaryActions.map((action) => (
            <Button key={action}>{action}</Button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold mb-2">أوامر الطباعة الثانوية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {salesTaxSecondaryActions.map((action) => (
            <Button key={action}>{action}</Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
