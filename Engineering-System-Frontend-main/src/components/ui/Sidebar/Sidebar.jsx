import React from "react";
import {
  BiBuilding,
  BiHome,
  BiLogOut,
  BiPackage,
  BiFile,
} from "react-icons/bi";
import { FaProjectDiagram, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import { logout } from "../../../features/auth/authSlice";

import SidebarNode from "./SidebarNode";
import { FaFileInvoiceDollar } from "react-icons/fa6";

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
      {
        label: "إضافة مستخدم",
        path: "/users/create",
        permissions: ["users:create"],
      },
      {
        label: "قائمة المستخدمين",
        path: "/users",
        permissions: ["users:read", "users:update", "users:delete"],
      },
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
    label: "الحالة المالية",
    icon: <BiFile className="size-5" />,
    path: "/financial-status",
  },
  {
    label: "المكاتب",
    icon: <BiFile className="size-5" />,
    path: "/offices",
  },
  {
    label: "سير العمل",
    icon: <BiFile className="size-5" />,
    path: "/workflows",
  },
  {
    label: "استكمال بيانات المشروع بالنشر",
    icon: <BiFile className="size-5" />,
    path: "/project-publication",
  },
  {
    label: "التحصيلات",
    icon: <FaFileInvoiceDollar className="size-5" />,
    path: "/collections",
  },
  {
    label: "متابعة التحصيل للمشروعات",
    icon: <MdDashboard className="size-5" />,
    path: "/project-collection-followup",
    children: [
      { label: "متابعة التسويات", path: "/project-collection-followup/settlements" },
      { label: "طباعة التقارير", path: "/project-collection-followup/reports" },
      { label: "تسجيل الموقف الحالي", path: "/project-collection-followup/project-status/1" },
      { label: "نموذج ضريبة المبيعات", path: "/project-collection-followup/sales-tax/1" },
    ],
  },
  {
    label: "خطابات الضمان",
    icon: <BiFile className="size-5" />,
    path: "/guarantee-letters",
    children: [
      { label: "متابعة دخول وخروج المستخلصات", path: "/guarantee-letters/claims-tracking" },
      { label: "التقارير", path: "/guarantee-letters/reports" },
      { label: "تسجيل خطابات الضمان", path: "/guarantee-letters/register" },
    ],
  },
  {
    label: "بيع الكراسات",
    icon: <BiPackage className="size-5" />,
    path: "/booklet-sales",
  },
  {
    label: "طباعة مذكرات النشر",
    icon: <BiFile className="size-5" />,
    path: "/publication-memos",
  },
  {
    label: "الملف الشخصي",
    icon: <FaUser className="size-5" />,
    path: "/profile",
  },
  {
    label: "ممنوع",
    icon: <BiFile className="size-5" />,
    path: "/forbidden",
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
