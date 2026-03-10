import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectPublications } from "../../../../api/projectPublicationAPI";
import PageTitle from "../../../ui/PageTitle/PageTitle";
import Button from "../../../ui/Button/Button";
import Loading from "../../../common/Loading/Loading";
import ProjectPublicationTab from "./tabs/ProjectPublicationTab";
import CollectionsTab from "./tabs/CollectionsTab";
import BookletSalesTab from "./tabs/BookletSalesTab";
import PublicationMemosTab from "./tabs/PublicationMemosTab";

export default function ProjectDetail() {
  const { projectCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projectPublication");

  // Fetch project data
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectPublicationByCode", projectCode],
    queryFn: async () => {
      const response = await getProjectPublications({ search: projectCode, limit: 1 });
      return response.data.projectPublications[0];
    },
  });

  if (isLoading) return <Loading />;

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error?.response?.data?.message || error?.message || "المشروع غير موجود"}</p>
        <Button onClick={() => navigate("/publishing-office/projects")} className="mt-4">
          العودة للقائمة
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "projectPublication", label: "بيانات المشروع بالنشر" },
    { id: "collections", label: "التحصيلات" },
    { id: "bookletSales", label: "بيع الكراسات" },
    { id: "publicationMemos", label: "مذكرات النشر" }
  ];

  return (
    <div>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate("/publishing-office/projects")}
        >
          ← رجوع
        </Button>
        <PageTitle title={`تفاصيل مشروع: ${data.projectName}`} />
      </div>

      {/* Project Info Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">كود المشروع:</span>
            <p className="font-semibold">{data.projectCode}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">السنة المالية:</span>
            <p className="font-semibold">{data.financialYear}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">نوع المشروع:</span>
            <p className="font-semibold">{data.projectType}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">التكلفة المقدرة:</span>
            <p className="font-semibold">
              {data.estimatedCost ? data.estimatedCost.toLocaleString('ar-EG') : "-"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">الفرع المسؤول:</span>
            <p className="font-semibold">{data.responsibleBranch || "-"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">الموظف المسؤول:</span>
            <p className="font-semibold">{data.responsibleEmployee || "-"}</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white shadow rounded-lg">
        {/* Tab Navigation */}
        <div className="border-b">
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
          {activeTab === "projectPublication" && (
            <ProjectPublicationTab project={data} />
          )}
          {activeTab === "collections" && (
            <CollectionsTab projectCode={projectCode} />
          )}
          {activeTab === "bookletSales" && (
            <BookletSalesTab projectCode={projectCode} />
          )}
          {activeTab === "publicationMemos" && (
            <PublicationMemosTab projectCode={projectCode} />
          )}
        </div>
      </div>
    </div>
  );
}
