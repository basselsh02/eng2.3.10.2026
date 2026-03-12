import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";
import { getProjectPublications } from "../../../api/projectPublicationAPI";

export default function PublishingProjects() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [committed, setCommitted] = useState({ search: "" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["projectPublications", page, committed],
    queryFn: () =>
      getProjectPublications({
        page,
        limit: 10,
        ...(committed.search && { search: committed.search }),
      }),
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setPage(1);
    setCommitted({ search: searchInput.trim() });
  };

  const handleClear = () => {
    setSearchInput("");
    setPage(1);
    setCommitted({ search: "" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleViewDetails = (projectCode) => {
    navigate(`/publishing-office/projects/${projectCode}`);
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

  const publications = data?.data?.projectPublications || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  return (
    <div dir="rtl">
      <PageTitle title="مشاريع مكتب النشر" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
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
            {publications.length > 0 ? (
              publications.map((publication) => (
                <TableRow key={publication._id}>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleViewDetails(publication.projectCode)}
                    >
                      عرض التفاصيل
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">{publication.publicationMemosList?.length || 0}</TableCell>
                  <TableCell className="text-center">{publication.candidateCompanies?.filter((c) => c.purchased).length || 0}</TableCell>
                  <TableCell className="text-center">{publication.candidateCompanies?.length || 0}</TableCell>
                  <TableCell className="font-semibold">
                    {publication.estimatedCost ? Number(publication.estimatedCost).toLocaleString("ar-EG") : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">{publication.projectName || "-"}</TableCell>
                  <TableCell>{publication.projectType || "-"}</TableCell>
                  <TableCell>{publication.financialYear || "-"}</TableCell>
                  <TableCell>{publication.projectCode || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  لا توجد مشاريع
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
