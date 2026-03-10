import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getContractBudgetStatements } from "../../../api/contractBudgetStatementAPI";
import { getFinancialDeductions } from "../../../api/financialDeductionAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import SearchInput from "../../ui/SearchInput/SearchInput";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";

export default function BudgetProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  // Fetch contract budget statements
  const { data, isLoading, error } = useQuery({
    queryKey: ["contractBudgetStatements", page, search],
    queryFn: () => getContractBudgetStatements({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  // Fetch all financial deductions for counting
  const { data: deductionsData } = useQuery({
    queryKey: ["financialDeductionsAll"],
    queryFn: () => getFinancialDeductions({ limit: 1000 }),
  });

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleViewDetails = (projectId) => {
    navigate(`/budget-office/projects/${projectId}`);
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

  // Debug logging
  console.log("Budget Office API Response:", data);
  console.log("Statements array:", data?.data);
  console.log("Pagination:", data?.pagination);

  const statements = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // Count deductions for each project
  const getProjectDeductionsCount = (projectId) => {
    const deductions = deductionsData?.data || [];
    return deductions.filter(d => d.project?._id === projectId || d.project === projectId).length;
  };

  return (
    <div>
      <PageTitle title="مشاريع مكتب الميزانية" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في المشاريع..."
          />
        </div>

        {/* Projects Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>عدد المخصمات</TableHead>
              <TableHead>المتبقي من الموازنة</TableHead>
              <TableHead>إجمالي المصروف</TableHead>
              <TableHead>قيمة العقد</TableHead>
              <TableHead>اسم المقاول</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>السنة المالية</TableHead>
              <TableHead>كود المشروع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statements.length > 0 ? (
              statements.map((statement) => {
                const deductionsCount = getProjectDeductionsCount(statement.project?._id);
                const contractValue = statement.contractualData?.contractValue || 0;
                const totalDisbursed = statement.disbursementData?.totalDisbursed || 0;
                const remainingBudget = statement.disbursementData?.remainingBudget || 0;
                
                return (
                  <TableRow key={statement._id}>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewDetails(statement.project?._id)}
                      >
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 rounded-full font-semibold">
                        {deductionsCount}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-orange-600">
                      {remainingBudget ? remainingBudget.toLocaleString('ar-EG') : "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {totalDisbursed ? totalDisbursed.toLocaleString('ar-EG') : "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      {contractValue ? contractValue.toLocaleString('ar-EG') : "-"}
                    </TableCell>
                    <TableCell>{statement.contractualData?.contractorName || "-"}</TableCell>
                    <TableCell className="font-semibold">
                      {statement.projectData?.projectName || statement.project?.projectName || "-"}
                    </TableCell>
                    <TableCell>{statement.financialYear}</TableCell>
                    <TableCell>{statement.projectCode}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  لا توجد مشاريع
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
    </div>
  );
}
