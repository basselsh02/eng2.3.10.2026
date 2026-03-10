import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStatementsByProject } from "../../../../api/contractBudgetStatementAPI";
import PageTitle from "../../../ui/PageTitle/PageTitle";
import Button from "../../../ui/Button/Button";
import Loading from "../../../common/Loading/Loading";
import ProjectDataTab from "./tabs/ProjectDataTab";
import ContractualDataTab from "./tabs/ContractualDataTab";
import DisbursementDataTab from "./tabs/DisbursementDataTab";
import MaterialsDisbursementTab from "./tabs/MaterialsDisbursementTab";
import FinancialDeductionsTab from "./tabs/FinancialDeductionsTab";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projectData");

  // Fetch project budget data
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectBudgetStatements", projectId],
    queryFn: async () => {
      const response = await getStatementsByProject(projectId, { limit: 1 });
      return response.data[0];
    },
  });

  if (isLoading) return <Loading />;

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error?.response?.data?.message || error?.message || "المشروع غير موجود"}</p>
        <Button onClick={() => navigate("/budget-office/projects")} className="mt-4">
          العودة للقائمة
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "projectData", label: "بيانات المشروع" },
    { id: "contractualData", label: "بيانات تعاقدية" },
    { id: "disbursementData", label: "بيانات الصرف" },
    { id: "materialsDisbursement", label: "صرف خامات" },
    { id: "financialDeductions", label: "المخصمات المالية" }
  ];

  return (
    <div>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate("/budget-office/projects")}
        >
          ← رجوع
        </Button>
        <PageTitle title={`تفاصيل مشروع: ${data.projectData?.projectName || data.project?.projectName || data.projectCode}`} />
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
            <span className="text-sm text-gray-600">اسم المقاول:</span>
            <p className="font-semibold">{data.contractualData?.contractorName || "-"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">قيمة العقد:</span>
            <p className="font-semibold text-blue-600">
              {data.contractualData?.contractValue ? data.contractualData.contractValue.toLocaleString('ar-EG') : "-"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">إجمالي المصروف:</span>
            <p className="font-semibold text-green-600">
              {data.disbursementData?.totalDisbursed ? data.disbursementData.totalDisbursed.toLocaleString('ar-EG') : "-"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">المتبقي:</span>
            <p className="font-semibold text-orange-600">
              {data.disbursementData?.remainingBudget ? data.disbursementData.remainingBudget.toLocaleString('ar-EG') : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white shadow rounded-lg">
        {/* Tab Navigation */}
        <div className="border-b">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] px-4 py-3 font-medium transition-colors ${
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
          {activeTab === "projectData" && (
            <ProjectDataTab statement={data} projectId={projectId} />
          )}
          {activeTab === "contractualData" && (
            <ContractualDataTab statement={data} projectId={projectId} />
          )}
          {activeTab === "disbursementData" && (
            <DisbursementDataTab statement={data} projectId={projectId} />
          )}
          {activeTab === "materialsDisbursement" && (
            <MaterialsDisbursementTab statement={data} projectId={projectId} />
          )}
          {activeTab === "financialDeductions" && (
            <FinancialDeductionsTab projectId={projectId} />
          )}
        </div>
      </div>
    </div>
  );
}
