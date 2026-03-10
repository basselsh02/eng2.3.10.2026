import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getOfficeWorkload } from "../../../api/workflowActivityAPI";
import { getOfficesDropdown } from "../../../api/officesAPI";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import Pagination from "../../ui/Pagination/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";

export default function OfficeWorkloadView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState({
    officeId: "",
    startDate: "",
    endDate: "",
    status: "",
    slaThreshold: "86400", // 24 hours default
  });

  const { data: officesData } = useQuery({
    queryKey: ["offices-dropdown"],
    queryFn: () => getOfficesDropdown(),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["office-workload", filters.officeId, filters, page],
    queryFn: () =>
      getOfficeWorkload(filters.officeId, {
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
        slaThreshold: parseInt(filters.slaThreshold),
        page,
        limit: 20,
      }),
    enabled: !!filters.officeId,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setSearchParams({ page: "1" });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 ث";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} س`);
    if (minutes > 0) parts.push(`${minutes} د`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} ث`);

    return parts.join(" ");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      at_manager: { text: "عند المدير", color: "bg-blue-100 text-blue-800" },
      at_employee: { text: "عند الموظف", color: "bg-yellow-100 text-yellow-800" },
      returned_to_previous: { text: "تم الإرجاع", color: "bg-red-100 text-red-800" },
      forwarded: { text: "تم التوجيه", color: "bg-green-100 text-green-800" },
    };

    const statusInfo = statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const offices = officesData?.data || [];
  const workloadData = data?.data?.logs || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المكتب/الكتيبة *
          </label>
          <select
            name="officeId"
            value={filters.officeId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر مكتب/كتيبة</option>
            {offices.map((office) => (
              <option key={office._id} value={office._id}>
                {office.name} ({office.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جميع الحالات</option>
            <option value="at_manager">عند المدير</option>
            <option value="at_employee">عند الموظف</option>
            <option value="returned_to_previous">تم الإرجاع</option>
            <option value="forwarded">تم التوجيه</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
          <Input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
          <Input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            حد SLA (بالثواني)
          </label>
          <Input
            type="number"
            name="slaThreshold"
            value={filters.slaThreshold}
            onChange={handleFilterChange}
            placeholder="86400 (24 ساعة)"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading && <Loading />}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
        </div>
      )}

      {!filters.officeId && (
        <div className="text-center py-8 text-gray-500">
          الرجاء اختيار مكتب/كتيبة لعرض عبء العمل
        </div>
      )}

      {filters.officeId && !isLoading && !error && workloadData.length === 0 && (
        <div className="text-center py-8 text-gray-500">لا توجد مهام في هذا المكتب</div>
      )}

      {filters.officeId && !isLoading && !error && workloadData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>معرف المهمة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المدير</TableHead>
                <TableHead>الموظف</TableHead>
                <TableHead>وقت الوصول</TableHead>
                <TableHead>الوقت الحالي في المكتب</TableHead>
                <TableHead>عدد الزيارات</TableHead>
                <TableHead>متأخر؟</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workloadData.map((log) => (
                <TableRow key={log._id} className={log.isOverdue ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{log.taskId}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    {log.managerId?.fullNameArabic || "-"}
                  </TableCell>
                  <TableCell>
                    {log.employeeId?.fullNameArabic || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(log.arrivedAt).toLocaleString("ar-EG")}
                  </TableCell>
                  <TableCell>
                    {log.status === "at_manager" || log.status === "at_employee" ? (
                      <span className={log.isOverdue ? "text-red-600 font-semibold" : ""}>
                        {formatDuration(log.currentTimeInOffice)}
                      </span>
                    ) : (
                      formatDuration(log.totalTimeInOffice)
                    )}
                  </TableCell>
                  <TableCell className="text-center">{log.visitCount}</TableCell>
                  <TableCell className="text-center">
                    {log.isOverdue ? (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                        نعم
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                        لا
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
