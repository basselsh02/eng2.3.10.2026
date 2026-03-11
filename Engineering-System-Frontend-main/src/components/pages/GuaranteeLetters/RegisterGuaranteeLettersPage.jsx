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
import { fiscalYears, guaranteeItems } from "./mockData";

export default function RegisterGuaranteeLettersPage() {
  const [searchMode, setSearchMode] = useState("by_number");

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader code="TR001GRNT_F" title="تسجيل خطابات الضمان" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <Input label="رقم المشروع" defaultValue="٨٣٤٢٢٢٥١" />
          <Input
            label="العام المالي"
            type="select"
            options={fiscalYears.map((y) => ({ value: y.value, label: y.label }))}
            defaultValue={fiscalYears[0].value}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm">الغاء البحث</Button>
          </div>
        </div>
        <div className="flex gap-5 mt-3 flex-wrap text-sm">
          <label className="flex items-center gap-2"><input type="radio" checked={searchMode === "by_number"} onChange={() => setSearchMode("by_number")} />ابحث برقم المشروع</label>
          <label className="flex items-center gap-2"><input type="radio" checked={searchMode === "by_name"} onChange={() => setSearchMode("by_name")} />ابحث باسم المشروع</label>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <p><span className="font-bold">رقم المشروع:</span> ٨٣٤٢٢٢٥١</p>
          <p><span className="font-bold">نوع المشروع:</span> اصال المباني</p>
          <p><span className="font-bold">قيمة المشروع:</span> ٨٣٦٨٩٧٧٦</p>
          <p><span className="font-bold">الشركة:</span> عليك للمقاولات والتوريدات ALYK</p>
          <p><span className="font-bold">مدة التنفيذ:</span> ٦ أشهر من تاريخ استلام الموقع</p>
        </div>
        <p className="mt-2 text-sm"><span className="font-bold">وصف المشروع:</span> اصل الهيكل الحرسى والحواجز الحاملة لفندق على الطراز الكراثى لشارع الممر بوكالة الشورجى لمشروع تطوير وتأهيل القاهرة التاريخية.</p>
      </Card>

      <Card className="p-2">
        <Table>
          <TableHeader><TableRow><TableHead>بند المضامن</TableHead><TableHead>وصف البند</TableHead><TableHead>اظهار</TableHead></TableRow></TableHeader>
          <TableBody>
            {guaranteeItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.itemNumber}</TableCell>
                <TableCell className="text-right whitespace-normal">{item.description}</TableCell>
                <TableCell><input type="checkbox" checked={item.isActive} readOnly /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input label="رقم مطلب الضمان" defaultValue="٥٢٠/٢٤٣٠٢٠٠٠٢" />
          <Input label="تاريخ خطاب الضمان" type="date" defaultValue="2024-10-28" />
          <Input label="تاريخ سنهاء الخطاب" type="date" defaultValue="2025-10-27" />
          <Input label="تاريخ التجديد" type="date" defaultValue="2025-09-27" />
          <Input label="قيمة خطاب الضمان" defaultValue="٤١٨٥٠٠٠" />
          <Input label="نوع الخطاب" defaultValue="خطاب ضمان نهائى" />
          <Input label="البنك" defaultValue="مصر - الادارة المركزية لتمويل التجارة" />
          <Input label="الجهة" defaultValue="١٥٧ — الادارة المركزية للحسابات" />
          <Input label="ملاحظات" />
          <div className="flex items-center gap-2 text-sm font-semibold"><span>مؤسر الانتهاء / انتهى</span><input type="checkbox" checked readOnly /></div>
          <p className="text-sm font-bold self-center">عدد الخطابات: ١</p>
          <Input label="فترة التجديد من" type="date" />
          <Input label="فترة التجديد إلى" type="date" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Button>تقرير الادارة المركزية</Button>
          <Button>تقرير الادارة المركزية (٢)</Button>
          <Button>تقرير الجهات الاخرى</Button>
          <Button>تسجيل بنك جديد</Button>
          <Button>تجديد خطاب ضمان</Button>
          <Button>تقرير مشروع/شركة</Button>
          <Button>تجديد خطابات خلال فترة</Button>
        </div>
      </Card>
    </div>
  );
}
