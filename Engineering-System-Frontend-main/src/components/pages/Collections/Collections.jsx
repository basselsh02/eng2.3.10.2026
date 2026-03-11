import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BiSearch, BiX, BiChevronDown } from "react-icons/bi";
import { getCollections, updateCollection } from "../../../api/collectionsAPI";
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

export default function Collections() {
  // ── Filter state (local — not URL-based so inputs are always responsive) ──
  const [projectNumber, setProjectNumber] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [search, setSearch] = useState("");

  // Committed filters — only updated when user clicks search / presses Enter
  const [committed, setCommitted] = useState({
    projectNumber: "",
    financialYear: "",
    search: "",
  });

  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  // ── Data fetching — uses *committed* filters ──────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections", page, committed],
    queryFn: () =>
      getCollections({
        page,
        limit: 10,
        // Backend param names exactly as the controller expects:
        ...(committed.projectNumber && { projectNumber: committed.projectNumber }),
        ...(committed.search && { search: committed.search }),
        // financialYear is stored in the collection model — pass as search if set
        ...(committed.financialYear && !committed.search && {
          search: committed.financialYear,
        }),
      }),
    keepPreviousData: true,
  });

  // ── Update mutation (البيان / الأمر) ─────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      toast.success("تم تحديث التحصيل بنجاح");
      queryClient.invalidateQueries(["collections"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "فشل تحديث التحصيل");
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    setPage(1);
    setCommitted({
      projectNumber: projectNumber.trim(),
      financialYear: financialYear.trim(),
      search: search.trim(),
    });
  };

  const handleClear = () => {
    setProjectNumber("");
    setFinancialYear("");
    setSearch("");
    setPage(1);
    setCommitted({ projectNumber: "", financialYear: "", search: "" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleBayan = (id) =>
    updateMutation.mutate({ id, data: { action: "البيان" } });

  const handleAmr = (id) =>
    updateMutation.mutate({ id, data: { action: "الأمر" } });

  // ── Render ─────────────────────────────────────────────────────────────────
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

  const collections = data?.data?.collections || data?.data?.docs || [];
  const totalPages =
    data?.data?.pagination?.totalPages || data?.data?.totalPages || 1;

  return (
    <div dir="rtl">
      {/* ── Title row + side buttons ────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <PageTitle title="التحصيلات" />
        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="sm" className="w-48 justify-center">
            قسم العقود
          </Button>
          <Button variant="secondary" size="sm" className="w-48 justify-center">
            اجراثات التعاقد /قسم العقود
          </Button>
        </div>
      </div>

      {/* ── Inline filter bar — mirrors ProjectsDetails style exactly ───── */}
      <div className="bg-white shadow rounded-lg p-4 mb-4" onKeyDown={handleKeyDown}>
        <div className="flex items-center gap-4 flex-wrap justify-end">

          {/* Clear / Search icon buttons on the far left */}
          <div className="flex items-center gap-2 mr-auto">
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

          {/* بحث – free-text search (projectName / branchName) */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">بحث</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث..."
              dir="rtl"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 text-right focus:outline-none focus:border-primary-400"
            />
          </div>

          {/* العام المالي */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              العام المالي
            </label>
            <div className="relative">
              <input
                type="text"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                placeholder="2026/2025"
                dir="rtl"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 text-right pr-7 focus:outline-none focus:border-primary-400"
              />
              <BiChevronDown
                size={13}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* كود المشروع */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              كود المشروع
            </label>
            <input
              type="text"
              value={projectNumber}
              onChange={(e) => setProjectNumber(e.target.value)}
              placeholder="4585551456"
              dir="rtl"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 text-right focus:outline-none focus:border-primary-400"
            />
          </div>

        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white shadow rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow>
              {/*
                RTL column order matching the image (right → left):
                رقم المشروع | اسم المشروع | تكلفة المشروع | كود الفرع |
                اسم الفرع المنفذ | المطبوع | المباع | [buttons]
              */}
              <TableHead>رقم المشروع</TableHead>
              <TableHead>اسم المشروع</TableHead>
              <TableHead>تكلفة المشروع</TableHead>
              <TableHead>كود الفرع</TableHead>
              <TableHead>اسم الفرع المنفذ</TableHead>
              <TableHead>المطبوع</TableHead>
              <TableHead>المباع</TableHead>
              {/* Action buttons column — no header label, on the far left */}
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length > 0 ? (
              collections.map((collection) => (
                <TableRow key={collection._id}>
                  <TableCell>
                    {collection.projectNumber || collection.projectCode || "—"}
                  </TableCell>

                  <TableCell className="font-semibold">
                    {collection.projectName || "—"}
                  </TableCell>

                  <TableCell>
                    {collection.projectCost
                      ? collection.projectCost.toLocaleString("ar-EG")
                      : "—"}
                  </TableCell>

                  <TableCell>{collection.branchCode || "—"}</TableCell>

                  <TableCell>
                    {collection.executingBranchName || collection.branchName || "—"}
                  </TableCell>

                  {/* المطبوع */}
                  <TableCell>
                    {collection.printed ?? collection.المطبوع ?? "—"}
                  </TableCell>

                  {/* المباع */}
                  <TableCell>
                    {collection.sold ?? collection.المباع ?? "—"}
                  </TableCell>

                  {/* البيان / الأمر — far left, both primary */}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleBayan(collection._id)}
                        disabled={updateMutation.isLoading}
                      >
                        البيان
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAmr(collection._id)}
                        disabled={updateMutation.isLoading}
                      >
                        الأمر
                      </Button>
                    </div>
                  </TableCell>
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

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}