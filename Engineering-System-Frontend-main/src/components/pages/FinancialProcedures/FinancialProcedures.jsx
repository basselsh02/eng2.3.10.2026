import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getFinancialProcedures, deleteFinancialProcedure } from "../../../api/financialProceduresAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import toast from "react-hot-toast";
import CreateFinancialProcedureForm from "./CreateFinancialProcedureForm";
import Can from "../../common/Can/Can";

export default function FinancialProcedures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch financial procedures with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialProcedures", page, search],
    queryFn: () => getFinancialProcedures({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFinancialProcedure,
    onSuccess: () => {
      toast.success("تم حذف الإجراء المالي بنجاح");
      queryClient.invalidateQueries(["financialProcedures"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل حذف الإجراء المالي");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإجراء المالي؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
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

  const financialProcedures = data?.data?.financialProcedures || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      <PageTitle title="الإجراءات المالية" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في الإجراءات المالية..."
          />
          <Can action="financial-procedures:create">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              إضافة إجراء مالي جديد
            </Button>
          </Can>
        </div>

        {/* Financial Procedures Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>نوع الإجراء</TableHead>
              <TableHead>السنة المالية</TableHead>
              <TableHead>المشروع</TableHead>
              <TableHead>كود المشروع</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialProcedures.length > 0 ? (
              financialProcedures.map((procedure) => (
                <TableRow key={procedure._id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Can action="financial-procedures:read">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => window.location.href = `/financial-procedures/${procedure._id}`}
                        >
                          عرض
                        </Button>
                      </Can>
                      <Can action="financial-procedures:delete">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(procedure._id)}
                          disabled={deleteMutation.isLoading}
                        >
                          حذف
                        </Button>
                      </Can>
                    </div>
                  </TableCell>
                  <TableCell>
                    {procedure.procedureType === "offers" && "العروض"}
                    {procedure.procedureType === "proposal" && "المقترح"}
                    {procedure.procedureType === "resolution" && "البت"}
                  </TableCell>
                  <TableCell>{procedure.project?.financialYear || "-"}</TableCell>
                  <TableCell>{procedure.project?.projectName || "-"}</TableCell>
                  <TableCell>{procedure.project?.projectCode || "-"}</TableCell>
                  <TableCell>
                    {new Date(procedure.createdAt).toLocaleDateString("ar-EG")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  لا توجد إجراءات مالية
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

      {/* Create Financial Procedure Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة إجراء مالي جديد"
        size="lg"
      >
        <CreateFinancialProcedureForm 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            queryClient.invalidateQueries(["financialProcedures"]);
          }}
        />
      </Modal>
    </div>
  );
}
