import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectPublications } from "../../../api/projectPublicationAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Loading from "../../common/Loading/Loading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../ui/Table/Table";

const formatDate = (d) =>
  d ? new Date(d).toISOString().split("T")[0] : "";

// ─────────────────────────────────────────────
//  TAB 1 – المشروع
// ─────────────────────────────────────────────
const ProjectTab = ({ project }) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">بيانات المشروع</h3>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="كود المشروع"
          value={project.projectCode || ""}
          disabled={true}
        />
        <Input
          label="نوع المشروع"
          value={project.projectType || ""}
          disabled={true}
        />
        <Input
          label="العام المالي"
          value={project.financialYear || ""}
          disabled={true}
        />

        <div className="md:col-span-3">
          <Input
            label="اسم المشروع"
            value={project.projectName || ""}
            disabled={true}
          />
        </div>

        <Input
          label="تاريخ ورود الكارت"
          type="date"
          value={formatDate(project.issueDate)}
          disabled={true}
        />
        <Input
          label="تاريخ الاصدار"
          type="date"
          value={formatDate(project.siteExitDate)}
          disabled={true}
        />
        <Input
          label="اسلوب النشر والتعاقد"
          value={project.contractingMethod || ""}
          disabled={true}
        />
        <Input
          label="تاريخ البداية الفعلي"
          type="date"
          value={formatDate(project.actualStartDate)}
          disabled={true}
        />
        <Input
          label="تاريخ النهاية الفعلي"
          type="date"
          value={formatDate(project.actualEndDate)}
          disabled={true}
        />
        <Button variant="secondary" size="sm" disabled={true}>
          تسجيل جهة جديدة
        </Button>
        <div className="md:col-span-3">
          <Input
            label="الجهة الطالبة"
            value={project.ownerEntity || ""}
            disabled={true}
          />
        </div>

        <Input
          label="التكلفة التقديرية"
          type="number"
          value={project.estimatedCost || ""}
          disabled={true}
        />
        <Input
          label="نسبة العلاوة"
          type="number"
          value={project.costPercentage || ""}
          disabled={true}
        />
        <Input
          label="رقم مذكرة الفرع المالي"
          value={project.treasuryCode || ""}
          disabled={true}
        />
        <Input
          label="الفرع المسؤل"
          value={project.responsibleBranch || ""}
          disabled={true}
        />

        <div className="md:col-span-2">
          <Input
            label="الشركة"
            value={project.company || ""}
            disabled={true}
          />
        </div>

        <Input
          label="تاريخ النشر"
          type="date"
          value={formatDate(project.publicationDate)}
          disabled={true}
        />
        <Input
          label="تاريخ الفتح الفعلي"
          type="date"
          value={formatDate(project.openingDate)}
          disabled={true}
        />
        <Input
          label="الموظف المسؤل"
          value={project.responsibleEmployee || ""}
          disabled={true}
        />

        <div className="md:col-span-2">
          <Input
            label="المشروع الرئيسي"
            value={project.mainProject || ""}
            disabled={true}
          />
        </div>
        <Button variant="secondary" size="sm" disabled={true}>
          طباعة تقرير اللجان
        </Button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  TAB 2 – شروط المشروع
// ─────────────────────────────────────────────
const ConditionsTab = ({ project }) => {
  const conditions = project.projectConditions || [];

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">شروط المشروع</h3>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={true}>
            تحميل شروط المذكرة
          </Button>
          <Button disabled={true}>
            تسجيل شروط النشر
          </Button>
        </div>
      </div>

      {/* Project code display */}
      <div className="mb-6">
        <Input
          label="كود المشروع"
          value={project?.projectCode || ""}
          disabled={true}
        />
      </div>

      {/* Conditions table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ترتيب الشروط</TableHead>
            <TableHead>كود نوع الشرط</TableHead>
            <TableHead>اسم نوع الشرط</TableHead>
            <TableHead>مسلسل/ الكود</TableHead>
            <TableHead>وصف الشرط</TableHead>
            <TableHead>القيمة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conditions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                لا توجد شروط مضافة
              </TableCell>
            </TableRow>
          ) : (
            conditions.map((cond, index) => (
              <TableRow key={index}>
                <TableCell>{cond.order || index + 1}</TableCell>
                <TableCell>{cond.conditionTypeCode || "-"}</TableCell>
                <TableCell>{cond.conditionTypeName || "-"}</TableCell>
                <TableCell>{cond.serialCode || "-"}</TableCell>
                <TableCell>{cond.conditionDesc || "-"}</TableCell>
                <TableCell>{cond.value || "-"}</TableCell>
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
const CompaniesTab = ({ project }) => {
  const [companySearch, setCompanySearch] = useState("");
  const [recordSearch, setRecordSearch] = useState("");
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  const companies = project.candidateCompanies || [];

  const filteredCompanies = companies.filter((c) => {
    const matchName = companySearch
      ? c.companies?.toLowerCase().includes(companySearch.toLowerCase())
      : true;
    const matchRecord = recordSearch
      ? c.recordNumber?.toLowerCase().includes(recordSearch.toLowerCase())
      : true;
    return matchName && matchRecord;
  });

  const candidateNames = filteredCompanies.map((c) => c.companies || "");

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">ترشيح الشركات</h3>
        <Button
          variant="danger"
          disabled={true}
        >
          حذف المحدد
        </Button>
      </div>

      {/* Search row */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="بحث باسم الشركة"
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            placeholder="اسم الشركة"
          />
          <Input
            label="بحث برقم السجل"
            value={recordSearch}
            onChange={(e) => setRecordSearch(e.target.value)}
            placeholder="رقم السجل"
          />
          <div className="flex items-end">
            <Button onClick={() => {}} variant="secondary" className="w-full">
              بحث
            </Button>
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel - candidate company names */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700">اسم الشركات المرشحة</h4>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {candidateNames.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                لا توجد شركات
              </div>
            ) : (
              candidateNames.map((name, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCompanyIndex(index)}
                  className={`px-4 py-2 text-sm border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
                    selectedCompanyIndex === index
                      ? "bg-blue-50 font-semibold text-primary-600 border-r-2 border-r-primary-600"
                      : "text-gray-700"
                  }`}
                >
                  {name || "-"}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel - full table */}
        <div className="md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشركات</TableHead>
                <TableHead>رقم السجل</TableHead>
                <TableHead>رقم الموافقة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    لا توجد شركات مرشحة
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company, index) => (
                  <TableRow
                    key={index}
                    onClick={() => setSelectedCompanyIndex(index)}
                    className={`cursor-pointer transition-colors ${
                      selectedCompanyIndex === index ? "bg-blue-50" : ""
                    }`}
                  >
                    <TableCell>{company.companies || "-"}</TableCell>
                    <TableCell>{company.recordNumber || "-"}</TableCell>
                    <TableCell>{company.registrationNumber || "-"}</TableCell>
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
const WorkItemsTab = ({ project }) => {
  const workItems = project.workItems || [];

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">أصناف المشروع</h3>
      </div>

      {/* Work items table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>م</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>الوحدة</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>سعر الوحدة</TableHead>
            <TableHead>الإجمالي</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد أصناف مضافة لهذا المشروع
              </TableCell>
            </TableRow>
          ) : (
            workItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.serial || index + 1}</TableCell>
                <TableCell>{item.desc || "-"}</TableCell>
                <TableCell>{item.code || "-"}</TableCell>
                <TableCell>{item.unit || "-"}</TableCell>
                <TableCell>{item.quantity || "-"}</TableCell>
                <TableCell>{item.value || "-"}</TableCell>
                <TableCell>
                  {item.total
                    ? parseFloat(item.total).toLocaleString("ar-EG")
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
const TABS = [
  { id: "project", label: "المشروع" },
  { id: "conditions", label: "شروط المشروع" },
  { id: "companies", label: "ترشيح الشركات" },
  { id: "work_items", label: "بنود الاعمال" },
];

export default function ProjectsDetails() {
  const [activeTab, setActiveTab] = useState("project");

  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [financialYearInput, setFinancialYearInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [committed, setCommitted] = useState(null);

  const hasAnyFilter =
    committed !== null &&
    (committed.projectCode || committed.financialYear || committed.search);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["projectDetailsPage", committed],
    queryFn: () => {
      const combinedSearch =
        committed.search || committed.projectCode || committed.financialYear || "";
      return getProjectPublications({
        search: combinedSearch || undefined,
        limit: 50,
      });
    },
    enabled: !!hasAnyFilter,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    const next = {
      projectCode: projectCodeInput.trim(),
      financialYear: financialYearInput.trim(),
      search: searchInput.trim(),
    };
    if (next.projectCode || next.financialYear || next.search) {
      setCommitted(next);
    }
  };

  const handleClear = () => {
    setProjectCodeInput("");
    setFinancialYearInput("");
    setSearchInput("");
    setCommitted(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const projects = data?.data?.projectPublications || [];
  const project = projects.length > 0 ? projects[0] : null;

  const showLoading = (isLoading || isFetching) && hasAnyFilter;
  const showNotFound =
    !showLoading && hasAnyFilter && !error && projects.length === 0;

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="بيانات المشروع" />
      </div>

      {/* Search bar */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="كود المشروع"
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            placeholder="أدخل كود المشروع"
            onKeyDown={handleKeyDown}
          />
          <Input
            label="العام المالي"
            value={financialYearInput}
            onChange={(e) => setFinancialYearInput(e.target.value)}
            placeholder="مثال: 2025/2026"
            onKeyDown={handleKeyDown}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <Input
              label="البحث"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="بحث باسم المشروع..."
              onKeyDown={handleKeyDown}
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSearch} className="flex-1">
                بحث
              </Button>
              <Button variant="secondary" onClick={handleClear} className="flex-1">
                مسح
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {showLoading && (
        <div className="my-6">
          <Loading />
        </div>
      )}

      {/* Error */}
      {!showLoading && error && (
        <div className="text-center py-8 bg-white shadow rounded-lg">
          <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600">
            {error?.response?.data?.message || error.message}
          </p>
        </div>
      )}

      {/* No results */}
      {showNotFound && (
        <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">
          لم يتم العثور على مشروع بهذه البيانات
        </div>
      )}

      {/* Project tabs */}
      {!showLoading && project && (
        <div className="bg-white shadow rounded-lg">
          {/* Project info header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-6 text-sm text-gray-700 flex-wrap">
                <span>
                  <span className="text-gray-500">كود المشروع: </span>
                  <span className="font-semibold">{project.projectCode}</span>
                </span>
                <span>
                  <span className="text-gray-500">العام المالي: </span>
                  <span className="font-semibold">{project.financialYear}</span>
                </span>
                <span className="text-gray-500 truncate max-w-md">
                  {project.projectName}
                </span>
              </div>
              {projects.length > 1 && (
                <span className="text-xs text-primary-600">
                  تم العثور على {projects.length} مشروع — يتم عرض الأول
                </span>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
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
            {activeTab === "project" && <ProjectTab project={project} />}
            {activeTab === "conditions" && <ConditionsTab project={project} />}
            {activeTab === "companies" && <CompaniesTab project={project} />}
            {activeTab === "work_items" && <WorkItemsTab project={project} />}
          </div>
        </div>
      )}
    </div>
  );
}