import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookletSales } from "../../../api/bookletSalesAPI";
import { getProjectPublications, updateProjectPublication } from "../../../api/projectPublicationAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
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
import { BiSearch, BiX } from "react-icons/bi";
import toast from "react-hot-toast";

export default function BookletSales() {
  // ── Filter inputs (typed but not yet committed) ──
  const [projectNumberInput, setProjectNumberInput] = useState("");
  const [projectNameInput, setProjectNameInput] = useState("");

  // ── Committed search (sent to API on button click / Enter) ──
  const [committedSearch, setCommittedSearch] = useState("");

  // ── Pagination ──
  const [page, setPage] = useState(1);

  // ── Selected row → drives lower table ──
  const [selectedSale, setSelectedSale] = useState(null);

  const queryClient = useQueryClient();

  // ── Upper table: booklet sales ──
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookletSales", page, committedSearch],
    queryFn: () =>
      getBookletSales({
        page,
        limit: 10,
        search: committedSearch || undefined,
      }),
    keepPreviousData: true,
  });

  // ── Lower table: project publication candidate companies ──
  const { data: publicationData, isLoading: isPublicationLoading } = useQuery({
    queryKey: ["projectPublicationByCode", selectedSale?.projectNumber],
    queryFn: async () => {
      const res = await getProjectPublications({
        search: selectedSale.projectNumber,
        limit: 1,
      });
      return res.data?.projectPublications?.[0] || null;
    },
    enabled: !!selectedSale?.projectNumber,
  });

  // ── Mutation: update candidate company fields ──
  const updateCompanyMutation = useMutation({
    mutationFn: ({ projectId, updatedCompanies }) =>
      updateProjectPublication({
        id: projectId,
        data: { candidateCompanies: updatedCompanies },
      }),
    onSuccess: () => {
      toast.success("تم تحديث البيانات بنجاح");
      queryClient.invalidateQueries([
        "projectPublicationByCode",
        selectedSale?.projectNumber,
      ]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "فشل التحديث"),
  });

  // ── Handlers ──
  const handleSearch = () => {
    const combined = [projectNumberInput.trim(), projectNameInput.trim()]
      .filter(Boolean)
      .join(" ");
    setCommittedSearch(combined);
    setPage(1);
    setSelectedSale(null);
  };

  const handleClear = () => {
    setProjectNumberInput("");
    setProjectNameInput("");
    setCommittedSearch("");
    setPage(1);
    setSelectedSale(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelectRow = (sale) => {
    setSelectedSale((prev) => (prev?._id === sale._id ? null : sale));
  };

  const handlePurchasedToggle = (company) => {
    if (!publicationData) return;
    const updated = publicationData.candidateCompanies.map((c) =>
      c._id === company._id ? { ...c, purchased: !c.purchased } : c
    );
    updateCompanyMutation.mutate({
      projectId: publicationData._id,
      updatedCompanies: updated,
    });
  };

  const handleInsuranceChange = (company, value) => {
    if (!publicationData) return;
    const updated = publicationData.candidateCompanies.map((c) =>
      c._id === company._id ? { ...c, insurancePaymentMethod: value } : c
    );
    updateCompanyMutation.mutate({
      projectId: publicationData._id,
      updatedCompanies: updated,
    });
  };

  // ── Derived data ──
  const bookletSales = data?.data?.bookletSales || data?.data?.docs || [];
  const totalPages =
    data?.data?.pagination?.totalPages || data?.data?.totalPages || 1;
  const candidateCompanies = publicationData?.candidateCompanies || [];

  // ── Loading / error states ──
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

  return (
    <div dir="rtl">
      {/* ════════════════════════════════════════
          Top bar: title + department buttons
      ════════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <PageTitle title="بيع الكراسات واستلام التأمين الابتدائي" />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            قسم العقود
          </Button>
          <Button variant="secondary" size="sm">
            اجراءات التعاقد /قسم العقود
          </Button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          Upper card
      ════════════════════════════════════════ */}
      <div className="bg-white shadow rounded-lg mb-4">

        {/* Sub-header: code badges + selected project info */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-wrap gap-2">
          {/* Left: identifier badges */}
          <div className="flex gap-2">
            <span className="border border-gray-300 rounded px-3 py-0.5 text-sm font-medium text-gray-700">
              TRDD_UF
            </span>
            <span className="border border-gray-300 rounded px-3 py-0.5 text-sm font-medium text-gray-700">
              20252028
            </span>
          </div>

          {/* Right: selected project code + financial year */}
          {selectedSale && (
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">العام المالي</span>
                <span className="font-semibold">
                  {publicationData?.financialYear || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">كود المشروع</span>
                <span className="font-semibold">
                  {selectedSale.projectNumber || "—"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Search / filter bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-wrap"
          onKeyDown={handleKeyDown}
        >
          {/* Icon buttons (clear + search) */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
              title="مسح"
            >
              <BiX size={20} />
            </button>
            <button
              onClick={handleSearch}
              className="text-primary-600 hover:text-primary-800 transition-colors p-1 rounded"
              title="بحث"
            >
              <BiSearch size={20} />
            </button>
          </div>

          {/* Project name input */}
          <div className="w-52">
            <Input
              label="اسم المشروع"
              value={projectNameInput}
              onChange={(e) => setProjectNameInput(e.target.value)}
            />
          </div>

          {/* Project number input */}
          <div className="w-40">
            <Input
              label="رقم المشروع"
              value={projectNumberInput}
              onChange={(e) => setProjectNumberInput(e.target.value)}
            />
          </div>
        </div>

        {/* Upper table */}
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم المشروع</TableHead>
                <TableHead>اسم المشروع</TableHead>
                <TableHead>تكلفة المشروع</TableHead>
                <TableHead>كود الفرع</TableHead>
                <TableHead>اسم الفرع المنفذ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookletSales.length > 0 ? (
                bookletSales.map((sale) => {
                  const isSelected = selectedSale?._id === sale._id;
                  return (
                    <TableRow
                      key={sale._id}
                      className={`cursor-pointer ${
                        isSelected ? "bg-blue-50 hover:bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectRow(sale)}
                    >
                      <TableCell className={isSelected ? "font-semibold text-blue-700" : ""}>
                        {sale.projectNumber || "—"}
                      </TableCell>
                      <TableCell>{sale.projectName || "—"}</TableCell>
                      <TableCell>
                        {sale.projectCost
                          ? sale.projectCost.toLocaleString("ar-EG")
                          : "—"}
                      </TableCell>
                      <TableCell>{sale.branchCode || "—"}</TableCell>
                      <TableCell>
                        {sale.executingBranchName || sale.branchName || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-12"
                  >
                    لا توجد بيانات لبيع الكراسات
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
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          Lower card: Candidate Companies
      ════════════════════════════════════════ */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4">
          {isPublicationLoading && selectedSale ? (
            <div className="py-8">
              <Loading />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الكود</TableHead>
                  <TableHead>اسم الشركة المرشحة</TableHead>
                  <TableHead>تم الشراء</TableHead>
                  <TableHead>طريقة دفع التأمين</TableHead>
                  <TableHead>تعديل البيان</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidateCompanies.length > 0 ? (
                  candidateCompanies.map((company) => (
                    <TableRow key={company._id || company.registrationNumber}>
                      {/* الكود */}
                      <TableCell className="text-gray-500 text-xs">
                        {company.registrationNumber || "ملتزم"}
                      </TableCell>

                      {/* اسم الشركة المرشحة */}
                      <TableCell>{company.companyName || "—"}</TableCell>

                      {/* تم الشراء */}
                      <TableCell>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={company.purchased || false}
                            onChange={() => handlePurchasedToggle(company)}
                            disabled={updateCompanyMutation.isLoading}
                            className="w-4 h-4 cursor-pointer accent-blue-600"
                          />
                        </div>
                      </TableCell>

                      {/* طريقة دفع التأمين */}
                      <TableCell>
                        <div className="min-w-[130px]">
                          <Input
                            type="select"
                            label="طريقة الدفع"
                            value={company.insurancePaymentMethod || "بدون"}
                            onChange={(e) =>
                              handleInsuranceChange(company, e.target.value)
                            }
                            options={[
                              { value: "بدون", label: "بدون" },
                              { value: "نقدي", label: "نقدي" },
                              { value: "شيك", label: "شيك" },
                              { value: "تحويل بنكي", label: "تحويل بنكي" },
                            ]}
                          />
                        </div>
                      </TableCell>

                      {/* تعديل البيان */}
                      <TableCell>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            toast.success(
                              `تم تعديل بيان: ${company.companyName}`
                            )
                          }
                        >
                          تعديل البيان
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 py-12"
                    >
                      {selectedSale
                        ? "لا توجد شركات مرشحة لهذا المشروع"
                        : "اختر مشروعاً من الجدول أعلاه لعرض الشركات المرشحة"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}