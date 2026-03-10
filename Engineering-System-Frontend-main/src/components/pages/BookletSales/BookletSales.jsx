import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookletSales, updateBookletSale } from "../../../api/bookletSalesAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function BookletSales() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  // Fetch booklet sales with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookletSales", page, search],
    queryFn: () => getBookletSales({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  // Update mutation for actions
  const updateMutation = useMutation({
    mutationFn: updateBookletSale,
    onSuccess: () => {
      toast.success("تم تحديث البيانات بنجاح");
      queryClient.invalidateQueries(["bookletSales"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل تحديث البيانات");
    },
  });

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleStaffTypeToggle = (id, currentType) => {
    const newType = currentType === "عسكري" ? "مدني" : "عسكري";
    updateMutation.mutate({ id, data: { staffType: newType } });
  };

  const handleAction = (id, actionType) => {
    // Update with specific action type
    updateMutation.mutate({ id, data: { actionType } });
  };

  const handlePrintMemo = (bookletSale) => {
    toast.success(`طباعة مذكرة النشر للمشروع: ${bookletSale.projectName}`);
    // Implement actual print logic here
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

  const bookletSales = data?.data?.bookletSales || data?.data?.docs || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      <PageTitle title="بيع الكراسات واستلام التأمين الابتدائي" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في بيع الكراسات..."
          />
        </div>

        {/* Booklet Sales Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم المشروع</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>تكلفة المشروع</TableHead>
              <TableHead>كود الفرع</TableHead>
              <TableHead>اسم الفرع المنفذ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookletSales.length > 0 ? (
              bookletSales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale.projectNumber}</TableCell>
                  <TableCell className="font-semibold">{sale.projectName}</TableCell>
                  <TableCell>{sale.branchCode || "-"}</TableCell>
                  <TableCell>
                    {sale.projectCost ? sale.projectCost.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{sale.branchName || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  لا توجد بيانات لبيع الكراسات
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
      <br/><br/><br/><br/>
      <div className="bg-white shadow rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الكود</TableHead>
              <TableHead>اسم الشركة المرشحة</TableHead>
              <TableHead>تم الشراء</TableHead>
              <TableHead>تم دفع التأمين</TableHead>
              <TableHead>تعديل البيان</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookletSales.length > 0 ? (
              bookletSales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale.projectNumber}</TableCell>
                  <TableCell className="font-semibold">{sale.projectName}</TableCell>
                  <TableCell>{sale.branchCode || "-"}</TableCell>
                  <TableCell>
                    {sale.projectCost ? sale.projectCost.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{sale.branchName || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  لا توجد بيانات لبيع الكراسات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
