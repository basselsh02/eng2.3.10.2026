import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPublicationMemos } from "../../../api/publicationMemosAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function PublicationMemos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  // Fetch publication memos with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["publicationMemos", page, search],
    queryFn: () => getPublicationMemos({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handlePrint = (memo) => {
    // Trigger print functionality
    toast.success(`طباعة مذكرة للمشروع: ${memo.projectName}`);
    // You can implement actual print logic here
    // For example: window.print() or navigate to a print view
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

  const memos = data?.data?.publicationMemos || data?.data?.docs || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      <PageTitle title="طباعة مذكرات النشر" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في المذكرات..."
          />
        </div>

        {/* Publication Memos Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>اسم المنفذ</TableHead>
              <TableHead>اسم الفرع</TableHead>
              <TableHead>كود الفرع</TableHead>
              <TableHead>تكلفة المشروع</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>رقم المشروع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memos.length > 0 ? (
              memos.map((memo) => (
                <TableRow key={memo._id}>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handlePrint(memo)}
                    >
                      طباعة
                    </Button>
                  </TableCell>
                  <TableCell>{memo.executorName || "-"}</TableCell>
                  <TableCell>{memo.branchName || "-"}</TableCell>
                  <TableCell>{memo.branchCode || "-"}</TableCell>
                  <TableCell>
                    {memo.projectCost ? memo.projectCost.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">{memo.projectName}</TableCell>
                  <TableCell>{memo.projectNumber}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  لا توجد مذكرات نشر
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
