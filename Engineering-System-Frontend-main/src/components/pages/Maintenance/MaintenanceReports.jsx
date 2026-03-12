import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BiSearch, BiTrash, BiEdit, BiShow } from "react-icons/bi";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";
import Can from "../../common/Can/Can";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table/Table";
import { useFFData } from "../../../hooks/useFFData";
import { getFFContracts, getFFProjects, getFFCompanies } from "../../../services/ffApi";

const formatAmount = (amount) =>
  typeof amount === "number" ? `${amount.toLocaleString("ar-EG")} ج.م.` : "—";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("ar-EG") : "—");

export default function MaintenanceReports() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data: contracts, loading, error } = useFFData(getFFContracts, { search }, [search]);
  const { data: projects } = useFFData(getFFProjects, {}, []);
  const { data: companies } = useFFData(getFFCompanies, {}, []);

  const reports = useMemo(() => contracts || [], [contracts]);
  const totalPages = Math.max(1, Math.ceil(reports.length / 10));
  const paginatedReports = reports.slice((page - 1) * 10, page * 10);

  const handleDelete = async () => {};

  if (loading) return <Loading />;

  if (error) {
    return <div className="text-center text-red-600 py-8">حدث خطأ أثناء تحميل تقارير الصيانة</div>;
  }

  return (
    <div dir="rtl">
      <PageTitle title="بيان بالمتوقف تحصيله في قسم الصيانة ص تاريخ" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center gap-3 mb-4 flex-wrap">
          <Can any={["maintenance-reports:create", "collections:create"]}>
            <Link to="/maintenance-reports/create">
              <Button variant="primary">إضافة تقرير</Button>
            </Link>
          </Can>

          <div className="flex items-center gap-2">
            <BiSearch className="text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="بحث برقم المشروع أو اسم المشروع أو الشركة"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-80 max-w-full text-right"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>م</TableHead>
              <TableHead>رقم المشروع</TableHead>
              <TableHead>الشركة</TableHead>
              <TableHead>بيان المشروع</TableHead>
              <TableHead>المبلغ المنصرف</TableHead>
              <TableHead>من</TableHead>
              <TableHead>إلى</TableHead>
              <TableHead>الأماكن المشاريع</TableHead>
              <TableHead>متوقف</TableHead>
              <TableHead>تاريخ استلم في الصالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.length ? (
              paginatedReports.map((report, index) => {
                const project = (projects || []).find((item) => item.name === report.projectName);
                const companyInfo = (companies || []).find((item) => item.companyName === report.companyName);
                return (
                  <TableRow key={report._id}>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{report.contractNumber || "—"}</TableCell>
                    <TableCell>{report.companyName || companyInfo?.companyName || "—"}</TableCell>
                    <TableCell>{report.projectName || "—"}</TableCell>
                    <TableCell>{formatAmount(report.totalDisbursed)}</TableCell>
                    <TableCell>{formatDate(report.startDate)}</TableCell>
                    <TableCell>{formatDate(report.endDate)}</TableCell>
                    <TableCell>{project?.location || "—"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs ${
                          report.status === "active" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {report.status === "active" ? "نشط" : "متوقف"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link to={`/maintenance-reports/create?id=${report._id}`} title="عرض التفاصيل">
                          <Button size="icon" variant="light"><BiShow /></Button>
                        </Link>
                        <Link to={`/maintenance-reports/create?id=${report._id}`} title="تعديل">
                          <Button size="icon" variant="info"><BiEdit /></Button>
                        </Link>
                        <Can any={["maintenance-reports:delete", "collections:delete"]}>
                          <Button
                            size="icon"
                            variant="danger"
                            onClick={() => handleDelete(report._id)}
                            title="حذف"
                          >
                            <BiTrash />
                          </Button>
                        </Can>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10 text-gray-500">
                  لا توجد تقارير
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
