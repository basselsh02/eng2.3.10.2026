import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../../api/projectAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";

export default function BudgetProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const { data: projRes, isLoading: loading, error } = useQuery({
    queryKey: ["projects", search],
    queryFn: () => getProjects({ search }),
  });
  const projects = projRes?.data || [];

  const handleSearch = () => {
    const next = searchInput.trim();
    if (next) {
      setSearchParams({ page: "1", search: next });
    }
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchParams({ page: "1" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleViewDetails = (projectId) => {
    navigate(`/budget-office/projects/${projectId}`);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error?.message || String(error)}</p>
      </div>
    );
  }

  const statements = projects || [];
  const totalPages = Math.max(1, Math.ceil(statements.length / 10));
  const paginatedStatements = statements.slice((page - 1) * 10, page * 10);

  const getProjectDeductionsCount = () => 0;

  return (
    <div>
      <PageTitle title="مشاريع مكتب الميزانية" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        {/* Header Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
          <Input
            label="البحث"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="بحث في المشاريع..."
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleSearch} className="flex-1">بحث</Button>
            <Button variant="secondary" onClick={handleClear} className="flex-1">مسح</Button>
          </div>
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
            {paginatedStatements.length > 0 ? (
              paginatedStatements.map((statement) => {
                const deductionsCount = getProjectDeductionsCount(statement.name);
                const contractValue = statement.estimatedCost?.value || statement.estimatedCost || 0;
                const totalDisbursed = 0;
                const remainingBudget = 0;

                return (
                  <TableRow key={statement._id}>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewDetails(statement._id)}
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
                    <TableCell>{statement.companyName || "-"}</TableCell>
                    <TableCell className="font-semibold">
                      {statement.name || "-"}
                    </TableCell>
                    <TableCell>{statement.fiscalYear || "-"}</TableCell>
                    <TableCell>{statement.code || "-"}</TableCell>
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
