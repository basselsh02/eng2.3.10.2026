import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BiSearch, BiX, BiChevronDown, BiPrinter, BiUpload, BiTrash } from "react-icons/bi";
import { getProjectDataByCode } from "../../../api/projectDataAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../ui/Table/Table";

// ─────────────────────────────────────────────
//  Read-only field with label (matches app style)
// ─────────────────────────────────────────────
const Field = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs text-gray-500 text-right">{label}</label>
    <div className="border border-gray-200 rounded px-3 py-1.5 text-sm text-right bg-gray-50 min-h-[34px]">
      {value || "—"}
    </div>
  </div>
);

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("ar-EG") : "—";

// ─────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
    <BiSearch size={40} className="opacity-30" />
    <p className="text-sm">الرجاء إدخال كود المشروع والضغط على بحث لعرض البيانات</p>
  </div>
);

// ─────────────────────────────────────────────
//  TAB 1 – المشروع
// ─────────────────────────────────────────────
const ProjectTab = ({ data }) => {
  if (!data) return <EmptyState />;
  return (
    <div className="space-y-4 p-2" dir="rtl">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="كود المشروع" value={data.projectCode} />
        <Field label="كود نوع المشروع" value={data.projectType} />
        <Field label="اعمال المباني" value={data.projectType} />
        <Field label="العام المالي" value={data.financialYear} />
      </div>

      {/* Row 2 – full width */}
      <Field label="اسم المشروع" value={data.projectName} />

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="تاريخ ورود الكارت" value={formatDate(data.siteExitDate)} />
        <Field label="تاريخ الاصدار" value={formatDate(data.issueDate)} />
        <Field label="اسلوب النشر والتعاقد" value={data.contractingMethod} />
        <div />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="تاريخ البداية الفعلي" value={formatDate(data.actualStartDate)} />
        <Field label="تاريخ النهاية الفعلي" value={formatDate(data.actualEndDate)} />
        <div />
        <div />
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div />
        <Field label="الجهة الطالبة" value={data.ownerEntity} />
      </div>

      {/* Row 6 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="التكلفة التقديرية" value={data.estimatedCost?.toLocaleString("ar-EG")} />
        <Field label="نسبة العلاوة" value={data.costPercentage} />
        <Field label="رقم مذكرة الفرع المالي" value={data.treasuryCode} />
        <div />
      </div>

      {/* Row 7 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="الفرع المسؤل" value={data.responsibleBranch} />
        <div />
      </div>

      {/* Row 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="الشركة" value={data.company} />
        <div />
      </div>

      {/* Row 9 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="تاريخ النشر" value={formatDate(data.publicationDate)} />
        <Field label="تاريخ الفتح الفعلي" value={formatDate(data.openingDate)} />
        <Field label="الموظف المسؤل" value={data.responsibleEmployee} />
        <div />
      </div>

      {/* Row 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="المشروع الرئيسي" value={data.mainProject} />
        <div />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 justify-end">
        <Button variant="secondary" size="sm">
          <BiPrinter size={14} className="ml-1 inline" />
        </Button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  TAB 2 – شروط المشروع
// ─────────────────────────────────────────────
const ConditionsTab = ({ data }) => {
  if (!data) return <EmptyState />;
  const conditions = data.projectConditions || [];

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="كود المشروع" value={data.projectCode} />
        <Field label="اسم المشروع" value={data.projectName} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="secondary" size="sm">
          <BiUpload size={14} className="ml-1 inline" />
          تحميل شروط المذكرة
        </Button>
        <Button variant="secondary" size="sm">
          <BiPrinter size={14} className="ml-1 inline" />
          طباعة العقد
        </Button>
        <Button variant="secondary" size="sm">
          تسجيل شروط النشر
        </Button>
        <Button variant="secondary" size="sm">
          طباعة العقد مبدائي/بدون
        </Button>
      </div>

      {/* Conditions table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>كود نوع الشرط</TableHead>
            <TableHead>اسم نوع الشرط</TableHead>
            <TableHead>مسلسل/ الكود</TableHead>
            <TableHead>وصف الشرط</TableHead>
            <TableHead>القيمة</TableHead>
            <TableHead>ترتيب الشروط</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conditions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                لا توجد شروط لهذا المشروع
              </TableCell>
            </TableRow>
          ) : (
            conditions.map((c, i) => (
              <TableRow key={c._id || i}>
                <TableCell>{c.conditionTypeCode}</TableCell>
                <TableCell>{c.conditionTypeName}</TableCell>
                <TableCell>{c.serialCode}</TableCell>
                <TableCell>{c.conditionDesc}</TableCell>
                <TableCell>{c.value}</TableCell>
                <TableCell>{c.order}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// ─────────────────────────────────────────────
//  TAB 3 – ترشيح الشركات
// ─────────────────────────────────────────────
const CompaniesTab = ({ data }) => {
  const [nameFilter, setNameFilter] = useState("");
  if (!data) return <EmptyState />;

  const nominated = data.candidateCompanies || [];
  const registered = data.registeredCompanies || [];

  const filteredRegistered = nameFilter
    ? registered.filter((c) =>
        (c.companyName || "").includes(nameFilter)
      )
    : registered;

  return (
    <div className="space-y-4" dir="rtl">
      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">الشركة</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            dir="rtl"
            placeholder="بحث بالاسم..."
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 text-right focus:outline-none focus:border-primary-400"
          />
        </div>
        <Button variant="primary" size="sm">
          بحث
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setNameFilter("")}
        >
          <BiTrash size={14} className="ml-1 inline" />
          حذف
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left – nominated */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-right text-gray-700">
            اسم الشركات المرشحة
          </h3>
          <Table>
            <TableBody>
              {nominated.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-gray-400">
                    لا توجد شركات مرشحة
                  </TableCell>
                </TableRow>
              ) : (
                nominated.map((name, i) => (
                  <TableRow key={i} className="cursor-pointer hover:bg-primary-50">
                    <TableCell className="text-right">{name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Right – registered */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشركات</TableHead>
                <TableHead>رقم السجل</TableHead>
                <TableHead>رقم الموافقة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-400">
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistered.map((c, i) => (
                  <TableRow key={c._id || i} className="cursor-pointer hover:bg-primary-50">
                    <TableCell>{c.companyName}</TableCell>
                    <TableCell>{c.recordNumber}</TableCell>
                    <TableCell>{c.registrationNumber}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  TAB 4 – بنود الاعمال
// ─────────────────────────────────────────────
const WorkItemsTab = ({ data }) => {
  if (!data) return <EmptyState />;
  const items = data.workItems || [];
  const total = items.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);

  return (
    <div className="space-y-4" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المسلسل</TableHead>
            <TableHead>وصف البند</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>الوحدة</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>القيمة</TableHead>
            <TableHead>الاجمالي</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                لا توجد بنود أعمال لهذا المشروع
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, i) => (
              <TableRow key={item._id || i}>
                <TableCell>{item.serial}</TableCell>
                <TableCell>{item.desc}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{parseFloat(item.value || 0).toLocaleString("ar-EG")}</TableCell>
                <TableCell>{parseFloat(item.total || 0).toLocaleString("ar-EG")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Total */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <span className="text-sm font-medium text-gray-700">اجمالي الاعمال</span>
        <div className="bg-primary-600 text-white rounded px-5 py-1.5 text-sm font-bold min-w-[130px] text-center">
          {total.toLocaleString("ar-EG")}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────
const TABS = [
  { id: "project", label: "المشروع" },
  { id: "conditions", label: "شروط المشروع" },
  { id: "companies", label: "ترشيح الشركات" },
  { id: "work_items", label: "بنود الاعمال" },
];

export default function ProjectsDetails() {
  const [activeTab, setActiveTab] = useState("project");
  const [projectCode, setProjectCode] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [searchParams, setSearchParams] = useState(null); // null = no search yet

  const { data, isLoading, error } = useQuery({
    queryKey: ["projectDataByCode", searchParams],
    queryFn: () => getProjectDataByCode(searchParams),
    enabled: !!searchParams?.projectCode,
    retry: false,
  });

  const project = data?.data || null;

  const handleSearch = () => {
    if (!projectCode.trim()) return;
    setSearchParams({ projectCode: projectCode.trim(), financialYear: financialYear.trim() });
  };

  const handleClear = () => {
    setProjectCode("");
    setFinancialYear("");
    setSearchParams(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div dir="rtl">
      {/* Page title */}
      <PageTitle title="بيانات المشروع" />

      {/* Search bar */}
      <div
        className="bg-white shadow rounded-lg p-4 mb-4"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-4 flex-wrap justify-end">
          {/* Clear & search icons */}
          <div className="flex items-center gap-2 mr-auto">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="مسح"
            >
              <BiX size={18} />
            </button>
            <button
              onClick={handleSearch}
              className="text-primary-600 hover:text-primary-800 transition-colors"
              title="بحث"
            >
              <BiSearch size={18} />
            </button>
          </div>

          {/* Financial year */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              العام المالي
            </label>
            <div className="relative">
              <input
                type="text"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                placeholder="2026/2025"
                dir="rtl"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 text-right pr-7 focus:outline-none focus:border-primary-400"
              />
              <BiChevronDown
                size={13}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Project code */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              كود المشروع
            </label>
            <input
              type="text"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              placeholder="ادخل كود المشروع"
              dir="rtl"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 text-right focus:outline-none focus:border-primary-400"
            />
          </div>

          <span className="text-sm text-gray-600">البحث</span>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
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

        {/* Tab content */}
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm text-right mb-4">
              {error.response?.data?.message || "لم يتم العثور على المشروع"}
            </div>
          )}

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {activeTab === "project" && <ProjectTab data={project} />}
              {activeTab === "conditions" && <ConditionsTab data={project} />}
              {activeTab === "companies" && <CompaniesTab data={project} />}
              {activeTab === "work_items" && <WorkItemsTab data={project} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}