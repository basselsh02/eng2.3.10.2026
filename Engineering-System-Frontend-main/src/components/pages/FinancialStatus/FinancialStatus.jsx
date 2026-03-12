import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import CreateFinancialStatusForm from "./CreateFinancialStatusForm";
import Can from "../../common/Can/Can";
import DataTable from "../../common/DataTabel/DataTable";
import { getFinancialStatuses } from "../../../api/financialStatusAPI";
import api from "../../../api/axiosInstance";

export default function FinancialStatus() {
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const filterObject = useMemo(() => columnFilters.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}), [columnFilters]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialStatuses", search, filterObject],
    queryFn: () => getFinancialStatuses({ page: 1, limit: 1000, search, filters: JSON.stringify(filterObject) }),
    keepPreviousData: true,
  });

  const rows = data?.data?.financialStatuses || [];

  const columns = useMemo(() => [
    { id: "projectNumber", accessorKey: "projectNumber", header: "رقم المشروع", meta: { filterType: "text" } },
    { id: "companyName", accessorKey: "companyName", header: "اسم الشركة", meta: { filterType: "text" } },
    { id: "portal", accessorKey: "portal", header: "البوابة", meta: { filterType: "text" } },
    { id: "beneficiaryEntity", accessorKey: "beneficiaryEntity", header: "الجهة المستفيدة", meta: { filterType: "text" } },
    { id: "branch", accessorKey: "branch", header: "الفرع المسؤول", meta: { filterType: "text" } },
    { id: "projectType", accessorKey: "projectType", header: "نوع المشروع", meta: { filterType: "text" } },
    { id: "financialYear", accessorKey: "financialYear", header: "العام المالي", meta: { filterType: "text" } },
    { id: "projectDescription", accessorKey: "projectDescription", header: "وصف المشروع", meta: { filterType: "text" } },
  ], []);

  const handleExportExcel = async () => {
    const response = await api.post(
      "/financial-status/export",
      { search, filters: JSON.stringify(filterObject) },
      { responseType: "blob" }
    );
    saveAs(response.data, `financial_status_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-8 text-red-600">حدث خطأ أثناء تحميل البيانات</div>;

  return (
    <div dir="rtl">
      <PageTitle title="تسجيل الموقف المالي للمشروعات" />
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="بحث في المواقف المالية..." />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExportExcel}><FaDownload className="ml-2" />تحميل Excel</Button>
            <Can action="financial-status:create"><Button onClick={() => setIsCreateModalOpen(true)}>إضافة موقف مالي جديد</Button></Can>
          </div>
        </div>

        <DataTable
          data={rows}
          columns={columns}
          loading={isLoading}
          pageCount={1}
          totalRecords={rows.length}
          pageIndex={0}
          pageSize={rows.length || 10}
          sorting={[]}
          columnFilters={columnFilters}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onSortingChange={() => {}}
          onColumnFiltersChange={setColumnFilters}
        />
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="إضافة موقف مالي جديد" size="xl">
        <CreateFinancialStatusForm onSuccess={() => { setIsCreateModalOpen(false); queryClient.invalidateQueries(["financialStatuses"]); }} />
      </Modal>
    </div>
  );
}
