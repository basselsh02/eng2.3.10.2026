import React, { useState } from "react";
import { useParams } from "react-router";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";

export default function FinancialTransactions() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("company");

  const tabs = [
    { id: "company", label: "عروض الشركات" },
    { id: "technical", label: "إجراءات البث الفني" },
    { id: "financial", label: "إجراءات المتح المالي" },
    { id: "current", label: "إجراءات البث المالي" },
  ];

  return (
    <div>
      <div className="bg-primary-600 text-white p-4 text-center mb-6">
        <h1 className="text-2xl font-bold">الخردوات المالية</h1>
      </div>

      {/* Project Info Bar */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b p-4 flex justify-between items-center text-sm">
          <div className="flex gap-8">
            <div>
              <span className="text-gray-600">كود المشروع: </span>
              <span className="font-semibold">4585551456</span>
            </div>
            <div>
              <span className="text-gray-600">العام المالي: </span>
              <span className="font-semibold">2026/2025</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">🔍</button>
            <button className="p-2 hover:bg-gray-100 rounded">✕</button>
          </div>
        </div>

        {/* Top Project Details Table */}
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الفرع المنفذ</TableHead>
                <TableHead>كود الفرع</TableHead>
                <TableHead>تكلفة المشروع</TableHead>
                <TableHead>اسم المشروع</TableHead>
                <TableHead>رقم المشروع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>الفرع 152 للانشاءات</TableCell>
                <TableCell>2546</TableCell>
                <TableCell>100.000.000</TableCell>
                <TableCell>البناء الهندسي رقم 9 ومساكن رقم 2 ومشاريع الأورق الجديدة للخدمة الوطنية للعناصر الحديدة</TableCell>
                <TableCell>2588888</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الفرع 152 للانشاءات</TableCell>
                <TableCell>2546</TableCell>
                <TableCell>100.000.000</TableCell>
                <TableCell>البناء الهندسي رقم 9 ومساكن رقم 2 ومشاريع الأورق الجديدة للخدمة الوطنية للعناصر الحديدة</TableCell>
                <TableCell>2588888</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Tabs */}
        <div className="border-t border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "border-b-2 border-primary-600 text-primary-600 bg-gray-50" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "company" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">عروض الشركات</h3>
              
              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Input label="الشركة" value="مكتب الشبكي للمقاولات" readOnly />
                <Input label="نوع العرض" value="عرض الماسي" readOnly />
                <Input label="رقم العرض" value="50" readOnly />
              </div>

              {/* Company Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ العرض</TableHead>
                    <TableHead>ترتيب المسلسل</TableHead>
                    <TableHead>نوع العرض</TableHead>
                    <TableHead>رقم العرض</TableHead>
                    <TableHead>اسم الشركة</TableHead>
                    <TableHead>كود الشركة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(6)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>2025/8/10</TableCell>
                      <TableCell>202</TableCell>
                      <TableCell>ترتيب المسلسل</TableCell>
                      <TableCell>2025/12/8</TableCell>
                      <TableCell>تاريخ بداية العرض</TableCell>
                      <TableCell>{i === 0 ? '90' : i === 1 ? '6' : i === 2 ? '684' : i === 3 ? '45' : i === 4 ? '7877' : '222'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">إجراءات البث الفني</h3>

              {/* Form Section */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Input label="المسلسل" value="3/1" readOnly />
                <Input label="عدد الاوراق المالية" value="13" readOnly />
                <Input label="النسبة %" value="0" readOnly />
                <Input label="نسبة الاجمع المتقدمة %" value="0" readOnly />
                <Input label="التأمين الابتدائي" value="يوجد بدون تأمين ابتدائي" readOnly />
                <Input label="نوع النسبة" value="نعم" readOnly />
                <Input label="العرض بعد النسبة" value="254565522255.000" readOnly />
                <Input label="قيمة العرض الم البط" value="254565522255.000" readOnly />
                <Input label="قيمة النسبة" value=".000" readOnly />
                <Input label="قيمة النسبة" value=".000" readOnly />
                <Input label="نسبة بعد %" value="254565522255.000" readOnly />
              </div>

              {/* Committee Table */}
              <div>
                <h4 className="font-semibold mb-3">أعضاء اللجنة</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>طباعة نموذج</TableHead>
                      <TableHead>تعمل</TableHead>
                      <TableHead>الوظيفة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الرتبة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" checked readOnly /></TableCell>
                      <TableCell>عضو اللجنة المالي</TableCell>
                      <TableCell>احمد محمد علي</TableCell>
                      <TableCell>مقدم</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" readOnly /></TableCell>
                      <TableCell>عضو هيئة القضاء</TableCell>
                      <TableCell>ياسر علي محمود</TableCell>
                      <TableCell>مايم</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" checked readOnly /></TableCell>
                      <TableCell>رئيس اللجنة</TableCell>
                      <TableCell>تامر السيد احمد</TableCell>
                      <TableCell>مايم</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" readOnly /></TableCell>
                      <TableCell>مراجع</TableCell>
                      <TableCell>محمود احمد علي</TableCell>
                      <TableCell>مايم</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Bottom Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم البند</TableHead>
                    <TableHead>تاريخ البث الفني</TableHead>
                    <TableHead>قرار اللجنة</TableHead>
                    <TableHead>نوع العرض</TableHead>
                    <TableHead>اسم الشركة</TableHead>
                    <TableHead>كود الشركة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[5449, 8962, 2222, 156, 7877, 222].map((code, i) => (
                    <TableRow key={i}>
                      <TableCell>{code}</TableCell>
                      <TableCell>2025/6/3</TableCell>
                      <TableCell>مقبول</TableCell>
                      <TableCell>عرض الماسي</TableCell>
                      <TableCell>مكتب الشبكي للمقاولات</TableCell>
                      <TableCell>
                        <button className="text-primary-600">▼</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">إجراءات المتح المالي</h3>

              {/* Financial Form */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Input label="كود الشركة" value="مكتب الشبكي للمقاولات" readOnly />
                <Input label="اسم الشركة" value="مكتب الشبكي للمقاولات" readOnly />
                <Input label="نوع العرض" value="عرض الماسي" readOnly />
                <Input label="نسبة قبل %" value="0.00" readOnly />
                <Input label="الترتيب المبدئي" value="3/1" readOnly />
                <Input label="القيمة المالية قبل المراجعة" value="254565522255.000" readOnly />
                <Input label="فائدة البنك %" value="0.00" readOnly />
                <Input label="قيمة النالئة المتقدمة" value="254565522255.000" readOnly />
                <Input label="قيمة الاضافة قبل" value="0.00" readOnly />
                <Input label="قيمة المالية بعد %" value="254565522255.000" readOnly />
                <Input label="قيمة الاضافات بعد" value="0.00" readOnly />
                <Input label="نسبة بعد %" value="254565522255.000" readOnly />
              </div>

              {/* Committee Table */}
              <div>
                <h4 className="font-semibold mb-3">أعضاء اللجنة</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>طباعة نموذج13</TableHead>
                      <TableHead>تسجيل العرض المالي</TableHead>
                      <TableHead>توقيع</TableHead>
                      <TableHead>الوظيفة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الرتبة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" checked readOnly /></TableCell>
                      <TableCell>عضو اللجنة المالي</TableCell>
                      <TableCell>احمد محمد علي</TableCell>
                      <TableCell>مقدم</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" readOnly /></TableCell>
                      <TableCell>عضو هيئة القضاء</TableCell>
                      <TableCell>ياسر علي محمود</TableCell>
                      <TableCell>مايم</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" checked readOnly /></TableCell>
                      <TableCell>رئيس اللجنة</TableCell>
                      <TableCell>تامر السيد احمد</TableCell>
                      <TableCell>مايم</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell>طباعة نموذج 12</TableCell>
                      <TableCell><input type="checkbox" readOnly /></TableCell>
                      <TableCell>مراجع</TableCell>
                      <TableCell>محمود احمد علي</TableCell>
                      <TableCell>مايم</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "current" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">إجراءات البث المالي</h3>

              {/* Current Financial Form */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="كود الشركة" value="مكتب الشبكي للمقاولات" readOnly />
                <Input label="اسم الشركة" value="مكتب الشبكي للمقاولات" readOnly />
                <Input label="نوع العرض" value="عرض الماسي" readOnly />
                <Input label="رقم العرض" value="202" readOnly />
                <Input label="تاريخ بداية العرض" value="2025/12/8" readOnly />
                <Input label="تاريخ العرض" value="2025/8/10" readOnly />
                <Input label="التاريخ المتح الفني" value="2025/10/2" readOnly />
                <Input label="تاريخ النبذة" value="2025/5/20" readOnly />
              </div>

              {/* Financial Data Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم البند</TableHead>
                    <TableHead>الإجمالي</TableHead>
                    <TableHead>سعر الوحدة</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>الوحدة</TableHead>
                    <TableHead>اسم الصنف</TableHead>
                    <TableHead>كود الصنف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { code: 55, amount: 20 },
                    { code: 4, amount: 15 },
                    { code: 684, amount: 1555 },
                    { code: 45, amount: 456 },
                    { code: 7877, amount: 887 },
                    { code: 222, amount: 544 }
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>100.222.222</TableCell>
                      <TableCell>25555</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>تم التعاقد بالمناقصة المحدودة</TableCell>
                      <TableCell>{item.code}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
