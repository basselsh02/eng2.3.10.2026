import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFFData } from "../../../hooks/useFFData";
import { getFFProjects, getFFContracts } from "../../../services/ffApi";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";

export default function PublishingProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const { data: projects, loading, error } = useFFData(getFFProjects, { search }, [search]);
  const { data: contracts } = useFFData(getFFContracts, {}, []);

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

  const handleViewDetails = (projectCode) => {
    navigate(`/publishing-office/projects/${projectCode}`);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
      </div>
    );
  }

  const publications = projects || [];
  const totalPages = Math.max(1, Math.ceil(publications.length / 10));
  const paginatedPublications = publications.slice((page - 1) * 10, page * 10);

  // Count related records for each project
  const getProjectCounts = (projectCode) => {
    const relatedContracts = (contracts || []).filter(
      (contract) => contract.projectName === projectCode || contract.project?.name === projectCode
    );

    return {
      collections: relatedContracts.length,
      booklets: relatedContracts.length,
      memos: relatedContracts.length,
    };
  };

  return (
    <div>
      <PageTitle title="مشاريع مكتب النشر" />

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
              <TableHead>عدد المذكرات</TableHead>
              <TableHead>عدد بيع الكراسات</TableHead>
              <TableHead>عدد التحصيلات</TableHead>
              <TableHead>التكلفة المقدرة</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>نوع المشروع</TableHead>
              <TableHead>السنة المالية</TableHead>
              <TableHead>كود المشروع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPublications.length > 0 ? (
              paginatedPublications.map((publication) => {
                const counts = getProjectCounts(publication.code || publication.name);
                return (
                  <TableRow key={publication._id}>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewDetails(publication.code)}
                      >
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 rounded-full font-semibold">
                        {counts.memos}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
                        {counts.booklets}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-semibold">
                        {counts.collections}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {publication.estimatedCost?.value ? publication.estimatedCost.value.toLocaleString('ar-EG') : "-"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {publication.name}
                    </TableCell>
                    <TableCell>{publication.contractingParty || "-"}</TableCell>
                    <TableCell>{publication.fiscalYear || "-"}</TableCell>
                    <TableCell>{publication.code || "-"}</TableCell>
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
