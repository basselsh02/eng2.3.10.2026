import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { BiSearch, BiX } from "react-icons/bi";
import { getPublicationMemos } from "../../../api/publicationMemosAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function PublicationMemos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Two separate search fields like booklet-sales / collections
  const [projectName, setProjectName] = useState(searchParams.get("projectName") || "");
  const [projectNumber, setProjectNumber] = useState(searchParams.get("projectNumber") || "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["publicationMemos", page, searchParams.get("projectName"), searchParams.get("projectNumber")],
    queryFn: () =>
      getPublicationMemos({
        page,
        limit: 10,
        projectName: searchParams.get("projectName") || "",
        projectNumber: searchParams.get("projectNumber") || "",
      }),
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setSearchParams({
      page: "1",
      ...(projectName.trim() && { projectName: projectName.trim() }),
      ...(projectNumber.trim() && { projectNumber: projectNumber.trim() }),
    });
  };

  const handleClear = () => {
    setProjectName("");
    setProjectNumber("");
    setSearchParams({ page: "1" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage.toString(),
      ...(searchParams.get("projectName") && { projectName: searchParams.get("projectName") }),
      ...(searchParams.get("projectNumber") && { projectNumber: searchParams.get("projectNumber") }),
    });
  };

  const handleAction = (memo, actionType) => {
    const labels = { alef: "أ", ba: "ب", shin: "ش", letter: "خطاب" };
    toast.success(`${labels[actionType]} - ${memo.projectName}`);
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">
          {error.response?.data?.message || error.message}
        </p>
      </div>
    );
  }

  const memos = data?.data?.publicationMemos || data?.data?.docs || [];
  const totalPages =
    data?.data?.pagination?.totalPages || data?.data?.totalPages || 1;

  return (
    <div>
      <PageTitle title="طباعة مذكرات النشر" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        {/* Dual search bar — same style as booklet-sales / collections */}
        <div className="flex items-center gap-2 justify-end mb-6 flex-wrap" onKeyDown={handleKeyDown}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="مسح"
            >
              <BiX size={18} />
            </button>
            <button
              onClick={handleSearch}
              className="text-primary-600 hover:text-primary-800 transition-colors"
              title="بحث"
            >
              <BiSearch size={18} />
            </button>
          </div>

          <input
            type="text"
            value={projectNumber}
            onChange={(e) => setProjectNumber(e.target.value)}
            placeholder="رقم المشروع"
            dir="rtl"
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 text-right focus:outline-none focus:border-primary-400"
          />

          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="اسم المشروع"
            dir="rtl"
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 text-right focus:outline-none focus:border-primary-400"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم المشروع</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>تكلفة المشروع</TableHead>
              <TableHead>الكود</TableHead>
              <TableHead>اسم الفرع المنفذ</TableHead>
              <TableHead>عسكري/مدني</TableHead>
              <TableHead>طباعة مذكرة النشر</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memos.length > 0 ? (
              memos.map((memo) => (
                <TableRow key={memo._id}>
                  <TableCell>{memo.projectNumber || memo.projectCode || "-"}</TableCell>
                  <TableCell className="font-semibold">{memo.projectName || "-"}</TableCell>
                  <TableCell>
                    {memo.projectCost
                      ? memo.projectCost.toLocaleString("ar-EG")
                      : memo.estimatedCost
                      ? memo.estimatedCost.toLocaleString("ar-EG")
                      : "-"}
                  </TableCell>
                  <TableCell>{memo.branchCode || "-"}</TableCell>
                  <TableCell>{memo.executingBranchName || memo.branchName || "-"}</TableCell>
                  <TableCell>{memo.staffType || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="primary" onClick={() => handleAction(memo, "letter")}>خطاب</Button>
                      <Button size="sm" variant="info" onClick={() => handleAction(memo, "shin")}>ش</Button>
                      <Button size="sm" variant="warning" onClick={() => handleAction(memo, "ba")}>ب</Button>
                      <Button size="sm" variant="success" onClick={() => handleAction(memo, "alef")}>أ</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  لا توجد مذكرات نشر
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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