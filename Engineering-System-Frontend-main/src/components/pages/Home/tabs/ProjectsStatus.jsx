import React from "react";
import Button from "../../../ui/Button/Button";
import { FaAngleLeft, FaAnglesLeft } from "react-icons/fa6";
export default function ProjectsStatus() {
  return (
    <>
      <section>
        <h1 className="text-xl font-bold text-primary-500 dark:text-white">
          موقف المشاريع
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          <div className="group bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full group-hover:bg-primary-600 group-hover:text-primary-content-600">
              <h2 className="text-xl font-bold p-2 text-center">
                مشروعات جهة مدنية
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span>عدد المشروعات</span>
                  <span>4</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>القيمة الاجمالية للمشروعات</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المستحق طيقاََ للبروتوكولات</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المستحق طبقاََ للموقف التنفيذي</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>الوارد</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المتبقي طبقاً للبروتوكول المنصرف</span>
                  <span>600,000,000</span>
                </li>
              </ul>
            </div>
            <div className=" flex items-center justify-center py-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full rounded-t-none text-indigo-500"
                icon={<FaAngleLeft />}
                iconPosition="end"
              >
                عرض المزيد
              </Button>
            </div>
          </div>
          <div className="group bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full group-hover:bg-primary-600 group-hover:text-primary-content-600">
              <h2 className="text-xl font-bold p-2 text-center">
                مشروعات جهة مدنية
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span>عدد المشروعات</span>
                  <span>8</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>القيمة الاجمالية للمشروعات</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المستحق طيقاََ للبروتوكولات</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المستحق طبقاََ للموقف التنفيذي</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>الوارد</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المتبقي طبقاً للبروتوكول المنصرف</span>
                  <span>600,000,000</span>
                </li>
              </ul>
            </div>
            <div className=" flex items-center justify-center py-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full rounded-t-none text-indigo-500"
                icon={<FaAngleLeft />}
                iconPosition="end"
              >
                عرض المزيد
              </Button>
            </div>
          </div>
          <div className="group  bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full group-hover:bg-primary-600 group-hover:text-primary-content-600">
              <h2 className="text-xl font-bold p-2 text-center">
                مشروعات جهة مدنية
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span>عدد المشروعات</span>
                  <span>4</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>القيمة الاجمالية للمشروعات</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المستحق طيقاََ للبروتوكولات</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المستحق طبقاََ للموقف التنفيذي</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>الوارد</span>
                  <span>600,000,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>المتبقي طبقاً للبروتوكول المنصرف</span>
                  <span>600,000,000</span>
                </li>
              </ul>
            </div>
            <div className=" flex items-center justify-center py-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full rounded-t-none text-indigo-500 "
                icon={<FaAngleLeft />}
                iconPosition="end"
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
