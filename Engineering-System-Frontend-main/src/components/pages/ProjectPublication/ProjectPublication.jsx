import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProjectPublications } from "../../../api/projectPublicationAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Loading from "../../common/Loading/Loading";
import ProjectOverviewTab from "./tabs/ProjectOverviewTab";
import ProjectConditionsTab from "./tabs/ProjectConditionsTab";
import ClassifyProjectTab from "./tabs/ClassifyProjectTab";
import NominateCompaniesTab from "./tabs/NominateCompaniesTab";
import PrintMemosTab from "./tabs/PrintMemosTab";

export default function ProjectPublication() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["projectPublications"],
    queryFn: () => getProjectPublications({}),
  });

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
      </div>
    );
  }

  const publications = data?.data?.projectPublications || data?.data?.docs || [];

  // Select first project by default if available
  const currentProjectId = selectedProjectId || publications[0]?._id;
  const currentProject = publications.find(p => p._id === currentProjectId);

  const tabs = [
    { id: "overview", label: "المشروع", component: ProjectOverviewTab },
    { id: "conditions", label: "شروط المشروع", component: ProjectConditionsTab },
    { id: "classify", label: "تصنيف المشروع", component: ClassifyProjectTab },
    { id: "nominate", label: "ترشيح الشركات", component: NominateCompaniesTab },
    { id: "memos", label: "طباعة المذكرات", component: PrintMemosTab },
  ];

  const ActiveTabComponent = tabs.find(t => t.id === activeTab)?.component || ProjectOverviewTab;

  return (
    <div>
      <PageTitle title="استكمال بيانات المشروع بالنشر" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Project Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر المشروع
          </label>
          <select
            value={currentProjectId || ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {publications.map((project) => (
              <option key={project._id} value={project._id}>
                {project.projectName} ({project.projectCode})
              </option>
            ))}
          </select>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-4 py-2 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {currentProject ? (
            <ActiveTabComponent project={currentProject} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              لا توجد مشاريع متاحة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
