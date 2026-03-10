import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCollections, updateCollection } from "../../../api/collectionsAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  // Fetch collections with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections", page, search],
    queryFn: () => getCollections({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  // Update mutation for action buttons
  const updateMutation = useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      toast.success("تم تحديث التحصيل بنجاح");
      queryClient.invalidateQueries(["collections"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل تحديث التحصيل");
    },
  });

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleAction = (id, action) => {
    // Update the collection with the specific action
    updateMutation.mutate({ id, data: { action } });
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

  const collections = data?.data?.collections || data?.data?.docs || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      <PageTitle title="التحصيلات" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في التحصيلات..."
          />
        </div>

        {/* Collections Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>اسم المحصل</TableHead>
              <TableHead>اسم المنفذ</TableHead>
              <TableHead>اسم الفرع</TableHead>
              <TableHead>كود الفرع</TableHead>
              <TableHead>تكلفة المشروع</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>رقم المشروع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length > 0 ? (
              collections.map((collection) => (
                <TableRow key={collection._id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAction(collection._id, "السلام")}
                        disabled={updateMutation.isLoading}
                      >
                        السلام
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAction(collection._id, "التقدم")}
                        disabled={updateMutation.isLoading}
                      >
                        التقدم
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{collection.collectorName || "-"}</TableCell>
                  <TableCell>{collection.executorName || "-"}</TableCell>
                  <TableCell>{collection.branchName || "-"}</TableCell>
                  <TableCell>{collection.branchCode || "-"}</TableCell>
                  <TableCell>
                    {collection.projectCost ? collection.projectCost.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">{collection.projectName}</TableCell>
                  <TableCell>{collection.projectNumber}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  لا توجد تحصيلات
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
