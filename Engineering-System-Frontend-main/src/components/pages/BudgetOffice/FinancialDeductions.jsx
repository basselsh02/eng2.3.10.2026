import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { 
  getFinancialDeductions, 
  createFinancialDeduction, 
  updateFinancialDeduction,
  deleteFinancialDeduction,
  approveDeduction,
  rejectDeduction
} from "../../../api/financialDeductionAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import toast from "react-hot-toast";

export default function FinancialDeductions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState(null);
  const [formData, setFormData] = useState({});

  const queryClient = useQueryClient();

  // Fetch financial deductions
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialDeductions", page, search],
    queryFn: () => getFinancialDeductions({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: selectedDeduction 
      ? (data) => updateFinancialDeduction({ id: selectedDeduction._id, data })
      : createFinancialDeduction,
    onSuccess: () => {
      toast.success(selectedDeduction ? "تم تحديث المخصم بنجاح" : "تم إضافة المخصم بنجاح");
      queryClient.invalidateQueries(["financialDeductions"]);
      setIsModalOpen(false);
      setSelectedDeduction(null);
      setFormData({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت العملية");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFinancialDeduction,
    onSuccess: () => {
      toast.success("تم حذف المخصم بنجاح");
      queryClient.invalidateQueries(["financialDeductions"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل الحذف");
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: approveDeduction,
    onSuccess: () => {
      toast.success("تم الموافقة على المخصم");
      queryClient.invalidateQueries(["financialDeductions"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت الموافقة");
    },
  });

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleAdd = () => {
    setSelectedDeduction(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (deduction) => {
    setSelectedDeduction(deduction);
    setFormData(deduction);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المخصم؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleApprove = (id) => {
    if (window.confirm("هل أنت متأكد من الموافقة على هذا المخصم؟")) {
      approveMutation.mutate({ id, approvalNotes: "موافق" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const deductions = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "قيد الانتظار", class: "bg-yellow-100 text-yellow-800" },
      under_review: { label: "قيد المراجعة", class: "bg-blue-100 text-blue-800" },
      approved: { label: "موافق عليه", class: "bg-green-100 text-green-800" },
      rejected: { label: "مرفوض", class: "bg-red-100 text-red-800" },
      paid: { label: "مدفوع", class: "bg-gray-100 text-gray-800" }
    };
    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div>
      <PageTitle title="تسجيل المخصمات المالية" />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="بحث في المخصمات المالية..."
          />
          <Button onClick={handleAdd} variant="primary">
            + إضافة مخصم مالي
          </Button>
        </div>

        {/* Deductions Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المبلغ الصافي</TableHead>
              <TableHead>قيمة الخصم</TableHead>
              <TableHead>المبلغ الأصلي</TableHead>
              <TableHead>نوع الخصم</TableHead>
              <TableHead>اسم المقاول</TableHead>
              <TableHead>تاريخ الخصم</TableHead>
              <TableHead>رقم الخصم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deductions.length > 0 ? (
              deductions.map((deduction) => (
                <TableRow key={deduction._id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(deduction)}
                        title="تعديل"
                      >
                        ✏️
                      </Button>
                      {deduction.status === "pending" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(deduction._id)}
                          title="موافقة"
                        >
                          ✓
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(deduction._id)}
                        title="حذف"
                      >
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(deduction.status)}</TableCell>
                  <TableCell className="font-semibold">
                    {deduction.netAmount ? deduction.netAmount.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {deduction.deductionAmount ? deduction.deductionAmount.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>
                    {deduction.originalAmount ? deduction.originalAmount.toLocaleString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{deduction.deductionType}</TableCell>
                  <TableCell className="font-semibold">{deduction.contractorName}</TableCell>
                  <TableCell>
                    {deduction.deductionDate ? new Date(deduction.deductionDate).toLocaleDateString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{deduction.deductionNumber}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  لا توجد مخصمات مالية
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDeduction(null);
          setFormData({});
        }}
        title={selectedDeduction ? "تعديل مخصم مالي" : "إضافة مخصم مالي"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="اسم المقاول"
              name="contractorName"
              value={formData.contractorName || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="رقم العقد"
              name="contractNumber"
              value={formData.contractNumber || ""}
              onChange={handleInputChange}
            />
            <Input
              label="نوع الخصم"
              type="select"
              name="deductionType"
              value={formData.deductionType || ""}
              onChange={handleInputChange}
              options={[
                { value: "", label: "اختر نوع الخصم" },
                { value: "تأخير في التنفيذ", label: "تأخير في التنفيذ" },
                { value: "جودة غير مطابقة", label: "جودة غير مطابقة" },
                { value: "غرامة تأخير", label: "غرامة تأخير" },
                { value: "خصم ضمان", label: "خصم ضمان" },
                { value: "خصم تأمينات", label: "خصم تأمينات" },
                { value: "خصم مواد", label: "خصم مواد" },
                { value: "خصم عمالة", label: "خصم عمالة" },
                { value: "أخرى", label: "أخرى" }
              ]}
              required
            />
            <Input
              label="المبلغ الأصلي"
              name="originalAmount"
              type="number"
              value={formData.originalAmount || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="قيمة الخصم"
              name="deductionAmount"
              type="number"
              value={formData.deductionAmount || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="تاريخ الخصم"
              name="deductionDate"
              type="date"
              value={formData.deductionDate ? formData.deductionDate.split('T')[0] : ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="سبب الخصم"
            name="deductionReason"
            value={formData.deductionReason || ""}
            onChange={handleInputChange}
            required
          />
          <Input
            label="ملاحظات"
            name="notes"
            value={formData.notes || ""}
            onChange={handleInputChange}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedDeduction(null);
                setFormData({});
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" loading={saveMutation.isLoading}>
              {selectedDeduction ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
