import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useFFData } from "../../../hooks/useFFData";
import { getFFContracts, getFFProjects } from "../../../services/ffApi";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import CreateFinancialStatusForm from "./CreateFinancialStatusForm";
import Can from "../../common/Can/Can";

export default function FinancialStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contracts, loading: loadingContracts, error: contractsError } = useFFData(getFFContracts, { search }, [search]);
  const { data: projects, loading: loadingProjects } = useFFData(getFFProjects, {}, []);

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const getStatusBadge = (status) => {
    const badges = {
      planned: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      on_hold: "bg-gray-100 text-gray-800",
      active: "bg-blue-100 text-blue-800",
      draft: "bg-yellow-100 text-yellow-800",
    };
    const labels = {
      planned: "مخطط",
      in_progress: "قيد التنفيذ",
      completed: "مكتمل",
      on_hold: "معلق",
      active: "قيد التنفيذ",
      draft: "مخطط",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[status] || badges.planned}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loadingContracts || loadingProjects) return <Loading />;

  if (contractsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{contractsError}</p>
      </div>
    );
  }

  const financialStatuses = contracts || [];
  const totalPages = Math.max(1, Math.ceil(financialStatuses.length / 10));
  const paginatedStatuses = financialStatuses.slice((page - 1) * 10, page * 10);

  return (
    <div>
      <PageTitle title="تسجيل الموقف المالي للمشروعات" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في المواقف المالية..."
          />
          <Can action="financial-status:create">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              إضافة موقف مالي جديد
            </Button>
          </Can>
        </div>

        {/* Financial Status Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المبلغ المقدر</TableHead>
              <TableHead>السنة المالية</TableHead>
              <TableHead>نوع المشروع</TableHead>
              <TableHead>رقم المشروع</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStatuses.length > 0 ? (
              paginatedStatuses.map((status) => {
                const relatedProject = (projects || []).find((project) => project.name === status.projectName);
                return (
                  <TableRow key={status._id}>
                    <TableCell>
                      <div className="flex gap-2">
                        <Can action="financial-status:read">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.location.href = `/financial-status/${status._id}`}
                          >
                            عرض
                          </Button>
                        </Can>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(status.status)}</TableCell>
                    <TableCell>
                      {status.contractValue?.toLocaleString("ar-EG") || "-"}
                    </TableCell>
                    <TableCell>{relatedProject?.fiscalYear || "-"}</TableCell>
                    <TableCell>{relatedProject?.contractingParty || "-"}</TableCell>
                    <TableCell>{status.projectName || "-"}</TableCell>
                    <TableCell>
                      {status.createdAt ? new Date(status.createdAt).toLocaleDateString("ar-EG") : "-"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  لا توجد مواقف مالية
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

      {/* Create Financial Status Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة موقف مالي جديد"
        size="xl"
      >
        <CreateFinancialStatusForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            queryClient.invalidateQueries(["financialStatuses"]);
          }}
        />
      </Modal>
    </div>
  );
}
