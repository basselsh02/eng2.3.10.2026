import React from "react";
import {
  BiBuilding,
  BiHome,
  BiLogOut,
  BiPackage,
  BiFile,
} from "react-icons/bi";
import { FaProjectDiagram, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import { logout } from "../../../features/auth/authSlice";

import SidebarNode from "./SidebarNode";
import { FaFileInvoiceDollar } from "react-icons/fa6";


const officeNavItems = [
  {
    label: "مكتب الصيانة",
    key: "maintenance",
    children: [
      { label: "مهام الموظف بمكتب الصيانة", path: "/offices/maintenance/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/maintenance/head-tasks" },
    ],
  },
  {
    label: "مكتب العقود",
    key: "contracts",
    children: [
      { label: "مهام الموظف بمكتب العقود", path: "/offices/contracts/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/contracts/head-tasks" },
    ],
  },
  {
    label: "مكتب الحسابات",
    key: "accounting",
    children: [
      { label: "مهام الموظف بمكتب الحسابات", path: "/offices/accounting/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/accounting/head-tasks" },
    ],
  },
  {
    label: "مكتب المشتريات",
    key: "procurement",
    children: [
      { label: "مهام الموظف بمكتب المشتريات", path: "/offices/procurement/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/procurement/head-tasks" },
    ],
  },
  {
    label: "مكتب التوريدات",
    key: "supplies",
    children: [
      { label: "مهام الموظف بمكتب التوريدات", path: "/offices/supplies/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/supplies/head-tasks" },
    ],
  },
  {
    label: "مكتب الميزانية",
    key: "budget",
    children: [
      { label: "مهام الموظف بمكتب الميزانية", path: "/offices/budget/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/budget/head-tasks" },
    ],
  },
  {
    label: "مكتب النشر",
    key: "publishing",
    children: [
      { label: "مهام الموظف بمكتب النشر", path: "/offices/publishing/employee-tasks" },
      { label: "مهام رئيس القسم", path: "/offices/publishing/head-tasks" },
    ],
  },
];

const menu = [
  {
    label: "الصفحة الرئيسية",
    icon: <BiHome className="size-5" />,
    path: "/",
  },
  {
    label: "إدارة المستخدمين",
    icon: <FaUser className="size-5" />,
    path: "/users",
    children: [
      { label: "إضافة مستخدم", path: "/users/create", permissions: ["users:create"] },
      { label: "قائمة المستخدمين", path: "/users", permissions: ["users:read"] },
    ],
  },
  {
    label: "الوحدات التنظيمية",
    icon: <BiBuilding className="size-5" />,
    path: "/organization-units",
    permissions: ["organization-units:read"],
  },
  {
    label: "المشاريع",
    icon: <FaProjectDiagram className="size-5" />,
    path: "/projects",
  },
  ...officeNavItems,
  // مكتب النشر
  {
    label: "مكتب النشر",
    icon: <BiFile className="size-5" />,
    path: "/publishing-office/projects",
    children: [
      { label: "مشاريع مكتب النشر", path: "/publishing-office/projects" },
      { label: "استكمال بيانات المشروع", path: "/publishing-office/projects-data" },
      { label: "تفاصيل المشاريع", path: "/publishing-office/projects-details" },
      { label: "بيع الكراسات", path: "/booklet-sales" },
      { label: "التحصيلات", path: "/collections" },
      { label: "طباعة مذكرات النشر", path: "/publication-memos" },
    ],
  },
  // مكتب الميزانية
  {
    label: "مكتب الميزانية",
    icon: <FaFileInvoiceDollar className="size-5" />,
    path: "/budget-office/projects",
    children: [
      { label: "المشاريع", path: "/budget-office/projects" },
      { label: "بيان التعاقد والموازنة", path: "/budget-office/contract-budget-statement" },
      { label: "الخصومات المالية", path: "/budget-office/financial-deductions" },
    ],
  },
  // مكتب التوريدات
  {
    label: "مكتب التوريدات",
    icon: <BiPackage className="size-5" />,
    path: "/project-collection-followup",
    children: [
      { label: "متابعة التسويات", path: "/project-collection-followup/settlements" },
      { label: "طباعة التقارير", path: "/project-collection-followup/reports" },
      { label: "تسجيل الموقف الحالي", path: "/project-collection-followup/project-status" },
      { label: "نموذج ضريبة المبيعات", path: "/project-collection-followup/sales-tax" },
    ],
  },
  // مكتب المشتريات
  {
    label: "مكتب المشتريات",
    icon: <BiFile className="size-5" />,
    path: "/procurement/memos",
    children: [{ label: "المذكرات", path: "/procurement/memos" }],
  },
  // مكتب الحسابات
  {
    label: "مكتب الحسابات",
    icon: <BiFile className="size-5" />,
    path: "/guarantee-letters",
    children: [
      { label: "متابعة دخول وخروج المستخلصات", path: "/guarantee-letters/claims-tracking" },
      { label: "التقارير", path: "/guarantee-letters/reports" },
      { label: "تسجيل خطابات الضمان", path: "/guarantee-letters/register" },
    ],
  },
  // مكتب العقود
  {
    label: "مكتب العقود",
    icon: <BiFile className="size-5" />,
    path: "/financial-status",
    children: [
      { label: "الحالة المالية", path: "/financial-status" },
      { label: "إنشاء حالة مالية", path: "/financial-status/create" },
      { label: "استكمال بيانات المشروع", path: "/publishing-office/projects-data" },
      { label: "تفاصيل المشاريع", path: "/publishing-office/projects-details" },
    ],
  },
  // مكتب الصيانة
  {
    label: "مكتب الصيانة",
    icon: <BiFile className="size-5" />,
    path: "/maintenance-reports",
    children: [
      { label: "تقارير الصيانة", path: "/maintenance-reports" },
      { label: "إنشاء تقرير صيانة", path: "/maintenance-reports/create" },
    ],
  },
  // Other standalone items
  {
    label: "الإجراءات",
    icon: <BiFile className="size-5" />,
    path: "/procedures",
  },
  {
    label: "الإجراءات المالية",
    icon: <BiFile className="size-5" />,
    path: "/financial-procedures",
  },
  {
    label: "سير العمل",
    icon: <BiFile className="size-5" />,
    path: "/workflows",
  },
  {
    label: "الملف الشخصي",
    icon: <FaUser className="size-5" />,
    path: "/profile",
  },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  return (
    <div
      className={`
        h-screen transition-all duration-300 overflow-hidden text-nowrap bg-base border-l border-background px-2
        ${isOpen ? "w-56" : "w-16"}
      `}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Menu */}
        <div className="flex flex-col h-full overflow-y-auto py-6 space-y-1">
          {menu.map((item) => (
            <SidebarNode
              key={item.label}
              node={item}
              isOpen={isOpen}
              user={user}
            />
          ))}
        </div>
        {/* User Profile & Logout */}
        <div className="border-t border-primary-200 py-4 px-2">
          {user && (
            <NavLink
              to="/profile"
              end
              className="flex items-center gap-3 rounded-lg hover:bg-primary-100 transition-colors mb-3"
            >
              <div className="border  p-1 rounded-full w-8 h-8 bg-white">
                <img
                  src={`${user?.avatar}`}
                  alt="avatar"
                  className="object-cover"
                />
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm">
                    {user.fullNameArabic.split(" ")[0]}
                  </span>
                  <span className="text-xs opacity-70">{user.role}</span>
                </div>
              )}
            </NavLink>
          )}

          <Button
            type="button"
            variant="danger"
            className="w-full justify-center gap-3"
            onClick={() => dispatch(logout())}
          >
            <BiLogOut className="size-5" />
            {isOpen && <span>تسجيل الخروج</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
