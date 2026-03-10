import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getExtractAdvances } from "../../../../api/extractAdvancesApi";
import Button from "../../../ui/Button/Button";
import { FaAngleLeft } from "react-icons/fa6";

export default function Settlements() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["extractAdvancesHome"],
    queryFn: () => getExtractAdvances({ page: 1, limit: 10 }),
  });

  const extractAdvances = res?.data || [];

  return (
    <>
      <section>
        <h1 className="text-xl font-bold text-primary-500 dark:text-white mb-4">
          المستخلصات والتسويات
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                إحصائيات المستخلصات
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span>عدد المستخلصات</span>
                  <span>{extractAdvances.length}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>إجمالي قيمة المستخلصات</span>
                  <span>
                    {extractAdvances
                      .reduce((sum, ea) => sum + (ea.extractValue || 0), 0)
                      .toLocaleString()}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>إجمالي قيمة السلف</span>
                  <span>
                    {extractAdvances
                      .reduce((sum, ea) => sum + (ea.advanceValue || 0), 0)
                      .toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                حالة المستخلصات
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span>مكتملة</span>
                  <span>
                    {extractAdvances.filter((ea) => ea.status === "fulfilled").length}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>قيد المراجعة</span>
                  <span>
                    {extractAdvances.filter((ea) => ea.status === "underReview").length}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>أخرى</span>
                  <span>
                    {extractAdvances.filter((ea) => !["fulfilled", "underReview"].includes(ea.status)).length}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                أحدث المستخلصات
              </h2>
            </div>
            <div className="p-4">
              {isLoading ? (
                <p>جاري التحميل...</p>
              ) : extractAdvances.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {extractAdvances.slice(0, 5).map((ea) => (
                    <li key={ea._id} className="flex justify-between items-center">
                      <span className="truncate">
                        {ea.contractNumber || "رقم غير محدد"}
                      </span>
                      <span>{ea.extractValue?.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">لا توجد مستخلصات</p>
              )}
            </div>
            <div className="flex items-center justify-center py-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full rounded-t-none text-indigo-500"
                icon={<FaAngleLeft />}
                iconPosition="end"
                onClick={() => window.location.href = "/extract-advances"}
              >
                عرض المزيد
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}