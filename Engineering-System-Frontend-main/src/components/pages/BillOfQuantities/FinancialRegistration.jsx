import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getBillOfQuantities } from "@/api/billOfQuantitiesAPI.js";
import Loading from "../../common/Loading/Loading";

export default function FinancialRegistration() {
  const [searchParams] = useSearchParams();
  const billId = searchParams.get("billId");
  const [activeTab, setActiveTab] = useState("registration");

  const { data, isLoading } = useQuery({
    queryKey: ["billOfQuantitiesList"],
    queryFn: () => getBillOfQuantities({ page: 1, limit: 10 }),
  });

  if (isLoading) return <Loading />;

  // Use first bill or create sample data
  const bill = data?.data?.docs?.[0] || {
    project: { name: "مشروع افتراضي", code: "0000" },
    projectCost: 100000000,
    branchName: "الفرع 152 للانشاءات",
    items: [],
    conditions: [],
    suggestedCompanies: [],
    committeeMembers: []
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white text-center py-3 mb-4 rounded">
        <h1 className="text-xl font-bold">تسجيل الموقف المالي للمشروعات</h1>
      </div>

      {/* Project Info Bar */}
      <div className="bg-white rounded shadow-sm mb-4">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-gray-600">كود المشروع: </span>
              <span className="font-semibold">{bill.project?.code || bill.projectCode || '4585551456'}</span>
            </div>
            <div>
              <span className="text-gray-600">العام المالي: </span>
              <span className="font-semibold">2025/2026</span>
            </div>
          </div>
          <span className="text-sm text-gray-600">التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
        </div>

        {/* Top Project Table */}
        <div className="p-4">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-right">اسم الفرع المنفذ</th>
                <th className="border p-2 text-right">كود الفرع</th>
                <th className="border p-2 text-right">تكلفة المشروع</th>
                <th className="border p-2 text-right">اسم المشروع</th>
                <th className="border p-2 text-right">رقم المشروع</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{bill.branchName || 'الفرع 152 للانشاءات'}</td>
                <td className="border p-2">2546</td>
                <td className="border p-2">{(bill.projectCost || 100000000).toLocaleString('ar-EG')}</td>
                <td className="border p-2">{bill.projectName || bill.project?.name || 'البناء الهندسي رقم 9'}</td>
                <td className="border p-2">{bill.number || '2588888'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabs */}
        <div className="border-t flex">
          <button
            onClick={() => setActiveTab("registration")}
            className={`flex-1 py-3 font-medium ${activeTab === "registration" ? "bg-blue-50 border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            تسجيل بيان المشروع
          </button>
          <button
            onClick={() => setActiveTab("conditions")}
            className={`flex-1 py-3 font-medium ${activeTab === "conditions" ? "bg-blue-50 border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            شروط المشروع
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-3 font-medium ${activeTab === "items" ? "bg-blue-50 border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            بنود الاعمال
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`flex-1 py-3 font-medium ${activeTab === "companies" ? "bg-blue-50 border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            ترشيح الشركات
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "registration" && (
            <div className="space-y-6">
              {/* Two Tables Side by Side */}
              <div className="grid grid-cols-2 gap-6">
                {/* بيانات اللجنة */}
                <div>
                  <h3 className="font-semibold text-center bg-gray-100 p-2 mb-3">بيانات اللجنة</h3>
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2">رقم اسم السجل</th>
                        <th className="border p-2">رقم السجل</th>
                        <th className="border p-2">الشركات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(bill.suggestedCompanies && bill.suggestedCompanies.length > 0 ? bill.suggestedCompanies : [{}, {}, {}]).slice(0, 3).map((comp, i) => (
                        <tr key={i}>
                          <td className="border p-2">{comp.registrationNumber || 5000}</td>
                          <td className="border p-2">{i + 1}</td>
                          <td className="border p-2">{comp.company?.companyName || 'المقاولون العرب'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* بيانات إعضاء اللجنة */}
                <div>
                  <h3 className="font-semibold text-center bg-gray-100 p-2 mb-3">بيانات إعضاء اللجنة</h3>
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2">الموافقة</th>
                        <th className="border p-2">الوظيفة</th>
                        <th className="border p-2">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(bill.committeeMembers && bill.committeeMembers.length > 0 ? bill.committeeMembers : [{}, {}, {}]).slice(0, 3).map((member, i) => (
                        <tr key={i}>
                          <td className="border p-2 text-center">
                            <input type="checkbox" checked={member.approved} readOnly />
                          </td>
                          <td className="border p-2">{member.position || 'عضو اللجنة'}</td>
                          <td className="border p-2">{member.name || 'أحمد محمد علي'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded">طباعة امر التشغيل</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">تسجيل المالي</button>
                <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded">تسجيل المتح المالي</button>
              </div>
            </div>
          )}

          {activeTab === "conditions" && (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-right">ترتيب الشروط</th>
                  <th className="border p-2 text-right">القيمة</th>
                  <th className="border p-2 text-right">وصف الشرط</th>
                  <th className="border p-2 text-right">مسلسل الكود</th>
                  <th className="border p-2 text-right">اسم نوع الشرط</th>
                  <th className="border p-2 text-right">كود نوع الشرط</th>
                </tr>
              </thead>
              <tbody>
                {(bill.conditions && bill.conditions.length > 0 ? bill.conditions : [{}]).map((condition, i) => (
                  <tr key={i}>
                    <td className="border p-2">{condition.conditionOrder || (i + 1)}</td>
                    <td className="border p-2">{(condition.value || 5000).toLocaleString('ar-EG')}</td>
                    <td className="border p-2">{condition.description || "خلطة اسمنتية بنسبة 57 كجم من الاسمنت البورتلاندي ورمل ملا حشو الواقعات"}</td>
                    <td className="border p-2">3</td>
                    <td className="border p-2">{condition.type || "تم التعاقد بالمناقصة المحدودة"}</td>
                    <td className="border p-2">3x3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "items" && (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-right">الإجمالي</th>
                  <th className="border p-2 text-right">القيمة</th>
                  <th className="border p-2 text-right">الكمية</th>
                  <th className="border p-2 text-right">الوحدة</th>
                  <th className="border p-2 text-right">الكود</th>
                  <th className="border p-2 text-right">وصف ب</th>
                  <th className="border p-2 text-right">المسلسل</th>
                </tr>
              </thead>
              <tbody>
                {(bill.items && bill.items.length > 0 ? bill.items : Array(6).fill({})).map((item, i) => (
                  <tr key={i}>
                    <td className="border p-2">{(item.totalPrice || 255455).toLocaleString('ar-EG')}</td>
                    <td className="border p-2">{(item.unitPrice || 100.222).toLocaleString('ar-EG')}</td>
                    <td className="border p-2">{(item.quantity || 25555).toLocaleString('ar-EG')}</td>
                    <td className="border p-2">{item.unit || '152'}</td>
                    <td className="border p-2">{item.code || 3}</td>
                    <td className="border p-2">{item.description || "تم التعاقد بالمناقصة المحدودة"}</td>
                    <td className="border p-2">{item.itemOrder || (i + 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "companies" && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold">الشركة:</label>
                <input type="text" value={bill.company?.companyName || "المقاولون العرب"} readOnly className="border rounded px-3 py-2 flex-1 max-w-md" />
                <label className="font-semibold">كود نوع المشروع:</label>
                <input type="text" value={bill.project?.code || "25555"} readOnly className="border rounded px-3 py-2 w-32" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-center bg-gray-100 p-2">اسم الشركات المرشحة</h4>
                  <div className="border rounded">
                    {(bill.suggestedCompanies && bill.suggestedCompanies.length > 0 ? bill.suggestedCompanies : Array(6).fill({})).map((comp, i) => (
                      <div key={i} className="border-b last:border-b-0 p-3 text-center">
                        {comp.company?.companyName || "شركة المقاولون العرب"}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-center bg-gray-100 p-2">الشركات</h4>
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-right">رقم اسم السجل</th>
                        <th className="border p-2 text-right">رقم السجل</th>
                        <th className="border p-2 text-right">الشركات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(bill.suggestedCompanies && bill.suggestedCompanies.length > 0 ? bill.suggestedCompanies : Array(6).fill({})).map((comp, i) => (
                        <tr key={i}>
                          <td className="border p-2">{comp.registrationNumber || 5000}</td>
                          <td className="border p-2">{i + 1}</td>
                          <td className="border p-2">{comp.company?.companyName || "المقاولون العرب"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}