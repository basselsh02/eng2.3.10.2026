import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectPublications, updateProjectPublication } from "../../../../api/projectPublicationAPI";
import PageTitle from "../../../ui/PageTitle/PageTitle";
import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import Loading from "../../../common/Loading/Loading";
import ProjectTab from "./tabs/ProjectTab";
import ProjectConditionsTab from "./tabs/ProjectConditionsTab";
import CandidateCompaniesTab from "./tabs/CandidateCompaniesTab";
import WorkItemsTab from "./tabs/WorkItemsTab";
import PrintMemosTab from "./tabs/PrintMemosTab";

const TABS = [
  { id: "project", label: "المشروع" },
  { id: "conditions", label: "شروط المشروع" },
  { id: "companies", label: "ترشيح الشركات" },
  { id: "workItems", label: "أصنف المشروع" },
  { id: "printMemos", label: "طباعة المذكرات" },
];

export default function ProjectsData() {
  const [activeTab, setActiveTab] = useState("project");

  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [financialYearInput, setFinancialYearInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [committed, setCommitted] = useState(null);

  const hasAnyFilter =
    committed !== null &&
    (committed.projectCode || committed.financialYear || committed.search);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["projectDataPage", committed],
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
        <PageTitle title="استكمال بيانات المشروع بالنشر" />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            قسم النشر
          </Button>
          <Button variant="secondary" size="sm">
            اجراءات التعاقد /التوريدات
          </Button>
        </div>
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
            {activeTab === "conditions" && (
              <ProjectConditionsTab project={project} />
            )}
            {activeTab === "companies" && (
              <CandidateCompaniesTab project={project} />
            )}
            {activeTab === "workItems" && <WorkItemsTab project={project} />}
            {activeTab === "printMemos" && <PrintMemosTab project={project} />}
          </div>
        </div>
      )}
    </div>
  );
}