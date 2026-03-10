import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getContractBudgetStatements } from "../../../../api/contractBudgetStatementAPI";
import PageTitle from "../../../ui/PageTitle/PageTitle";
import Button from "../../../ui/Button/Button";
import SearchInput from "../../../ui/SearchInput/SearchInput";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../ui/Table/Table";
import Pagination from "../../../ui/Pagination/Pagination";
import Loading from "../../../common/Loading/Loading";
import Modal from "../../../ui/Modal/Modal";
import ProjectDataTab from "./tabs/ProjectDataTab";
import ContractualDataTab from "./tabs/ContractualDataTab";
import DisbursementDataTab from "./tabs/DisbursementDataTab";
import MaterialsDisbursementTab from "./tabs/MaterialsDisbursementTab";

export default function ContractBudgetStatement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [activeTab, setActiveTab] = useState("projectData");

  // Fetch statements
  const { data, isLoading, error } = useQuery({
    queryKey: ["contractBudgetStatements", page, search],
    queryFn: () => getContractBudgetStatements({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleViewDetails = (statement) => {
    setSelectedStatement(statement);
    setActiveTab("projectData");
    setIsDetailModalOpen(true);
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

  const statements = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  const tabs = [
    { id: "projectData", label: "بيانات المشروع" },
    { id: "contractualData", label: "بيانات تعاقدية" },
    { id: "disbursementData", label: "بيانات الصرف" },
    { id: "materialsDisbursement", label: "صرف خامات" }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: "مسودة", class: "bg-gray-100 text-gray-800" },
      pending: { label: "قيد الانتظار", class: "bg-yellow-100 text-yellow-800" },
      approved: { label: "موافق عليه", class: "bg-green-100 text-green-800" },
      rejected: { label: "مرفوض", class: "bg-red-100 text-red-800" },
      completed: { label: "مكتمل", class: "bg-blue-100 text-blue-800" }
    };
    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div>
      <PageTitle title="تسجيل بيان التعاقد والموازنة والصرف" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في بيانات التعاقد والموازنة..."
          />
          <Button onClick={() => handleViewDetails(null)} variant="primary">
            + إضافة بيان جديد
          </Button>
        </div>

        {/* Statements Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>نسبة الصرف %</TableHead>
              <TableHead>المبلغ المصروف</TableHead>
              <TableHead>الموازنة الكلية</TableHead>
              <TableHead>اسم المقاول</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>كود المشروع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statements.length > 0 ? (
              statements.map((statement) => (
                <TableRow key={statement._id}>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleViewDetails(statement)}
                    >
                      عرض التفاصيل
                    </Button>
                  </TableCell>
                  <TableCell>{getStatusBadge(statement.status)}</TableCell>
                  <TableCell>
                    {statement.disbursementData?.disbursementPercentage || 0}%
                  </TableCell>
                  <TableCell className="font-semibold">
                    {statement.disbursementData?.totalDisbursed?.toLocaleString('ar-EG') || "-"}
                  </TableCell>
                  <TableCell>
                    {statement.disbursementData?.totalBudget?.toLocaleString('ar-EG') || "-"}
                  </TableCell>
                  <TableCell>
                    {statement.contractualData?.contractorName || "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {statement.projectData?.projectName || "-"}
                  </TableCell>
                  <TableCell>{statement.projectCode}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Details Modal with Tabs */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStatement(null);
        }}
        title={selectedStatement ? "تفاصيل بيان التعاقد والموازنة والصرف" : "إضافة بيان جديد"}
        size="large"
      >
        <div className="space-y-4">
          {/* Tabs */}
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
          <div className="p-4">
            {activeTab === "projectData" && (
              <ProjectDataTab statement={selectedStatement} />
            )}
            {activeTab === "contractualData" && (
              <ContractualDataTab statement={selectedStatement} />
            )}
            {activeTab === "disbursementData" && (
              <DisbursementDataTab statement={selectedStatement} />
            )}
            {activeTab === "materialsDisbursement" && (
              <MaterialsDisbursementTab statement={selectedStatement} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
