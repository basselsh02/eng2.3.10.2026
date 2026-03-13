import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BiEdit, BiShow } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import Can from "../../common/Can/Can";
import DataTable from "../../common/DataTabel/DataTable";
import api from "../../../api/axiosInstance";
import { useMaintenanceReports } from "../../../hooks/useMaintenanceReports";

const formatAmount = (amount) =>
  typeof amount === "number" ? `${amount.toLocaleString("ar-EG")} ج.م.` : "—";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("ar-EG") : "—");

export default function MaintenanceReports() {
  const [searchInput, setSearchInput] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const { data: localReportsRes, isLoading: loading, error } = useMaintenanceReports({
    page: 1,
    limit: 1000,
    search: committedSearch,
  });

  const localReports = localReportsRes?.data?.docs || [];

  const mergedData = useMemo(() => {
    const rows = (localReports || []).map((report) => ({
      id: report._id,
      sourceId: report._id,
      projectNumber: report.projectNumber || "",
      company: report.company || "",
      projectName: report.projectName || "",
      disbursedAmount: report.disbursedAmount,
      fromDate: report.fromDate,
      toDate: report.toDate,
      projectLocations: report.projectLocations,
      isStopped: report.isStopped,
      hallReceiptDate: report.hallReceiptDate,
    }));

    if (!columnFilters.length) return rows;
    return rows.filter((row) =>
      columnFilters.every((f) => {
        const val = row[f.id];
        return val !== undefined && String(val).toLowerCase().includes(String(f.value).toLowerCase());
      })
    );
  }, [localReports, columnFilters]);

  const columns = useMemo(
    () => [
      { id: "projectNumber", accessorKey: "projectNumber", header: "رقم المشروع", meta: { filterType: "text" } },
      { id: "company", accessorKey: "company", header: "الشركة", meta: { filterType: "text" } },
      { id: "projectName", accessorKey: "projectName", header: "بيان المشروع", meta: { filterType: "text" } },
      { id: "disbursedAmount", accessorKey: "disbursedAmount", header: "المبلغ المنصرف", cell: ({ row }) => formatAmount(row.original.disbursedAmount), meta: { filterType: "number" } },
      { id: "fromDate", accessorKey: "fromDate", header: "من", cell: ({ row }) => formatDate(row.original.fromDate), meta: { filterType: "dateRange" } },
      { id: "toDate", accessorKey: "toDate", header: "إلى", cell: ({ row }) => formatDate(row.original.toDate), meta: { filterType: "dateRange" } },
      { id: "projectLocations", accessorKey: "projectLocations", header: "الأماكن المشاريع", meta: { filterType: "text" } },
      { id: "isStopped", accessorKey: "isStopped", header: "متوقف", cell: ({ row }) => (row.original.isStopped ? "متوقف" : "نشط"), meta: { filterType: "text" } },
      { id: "hallReceiptDate", accessorKey: "hallReceiptDate", header: "تاريخ استلم في الصالة", cell: ({ row }) => formatDate(row.original.hallReceiptDate), meta: { filterType: "dateRange" } },
      {
        id: "actions",
        header: "الإجراءات",
        enableSorting: false,
        enableFilter: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Link to={`/maintenance-reports/create?id=${row.original.sourceId || ""}`} title="عرض التفاصيل">
              <Button size="icon" variant="light"><BiShow /></Button>
            </Link>
            <Link to={`/maintenance-reports/create?id=${row.original.sourceId || ""}`} title="تعديل">
              <Button size="icon" variant="info"><BiEdit /></Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const handleExportExcel = async () => {
    const activeFilters = columnFilters.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {});
    const response = await api.post(
      "/maintenance-reports/export",
      { search: committedSearch, filters: JSON.stringify(activeFilters) },
      { responseType: "blob" }
    );
    saveAs(response.data, `maintenance_reports_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 py-8">حدث خطأ أثناء تحميل تقارير الصيانة</div>;

  return (
    <div dir="rtl">
      <PageTitle title="بيان بالمتوقف تحصيله في قسم الصيانة ص تاريخ" />
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center gap-3 mb-4 flex-wrap">
          <div className="flex gap-2">
            <Can any={["maintenance-reports:create", "collections:create"]}>
              <Link to="/maintenance-reports/create"><Button variant="primary">إضافة تقرير</Button></Link>
            </Can>
            <Button variant="secondary" onClick={handleExportExcel}><FaDownload className="ml-2" />تحميل Excel</Button>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setCommittedSearch(searchInput.trim())}
            placeholder="بحث برقم المشروع أو اسم المشروع أو الشركة"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-80 max-w-full text-right"
          />
        </div>
        <DataTable
          data={mergedData}
          columns={columns}
          loading={loading}
          pageCount={1}
          totalRecords={mergedData.length}
          pageIndex={0}
          pageSize={mergedData.length || 10}
          sorting={[]}
          columnFilters={columnFilters}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onSortingChange={() => {}}
          onColumnFiltersChange={setColumnFilters}
        />
      </div>
    </div>
  );
}
