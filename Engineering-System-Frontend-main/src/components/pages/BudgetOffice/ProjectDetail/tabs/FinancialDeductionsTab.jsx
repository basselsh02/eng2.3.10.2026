import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeductionsByProject, createFinancialDeduction, deleteFinancialDeduction } from "../../../../../api/financialDeductionAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";
import Modal from "../../../../ui/Modal/Modal";
import Loading from "../../../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function FinancialDeductionsTab({ projectId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  // Fetch deductions for this project
  const { data, isLoading } = useQuery({
    queryKey: ["financialDeductions", projectId],
    queryFn: () => getDeductionsByProject(projectId, { limit: 100 }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createFinancialDeduction,
    onSuccess: () => {
      toast.success("تم إضافة المخصم بنجاح");
      queryClient.invalidateQueries(["financialDeductions"]);
      setIsModalOpen(false);
      setFormData({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت الإضافة");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ 
      ...formData, 
      projectId,
      allocatedValue: parseFloat(formData.allocatedValue)
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المخصم؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;

  const deductions = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">المخصمات المالية</h3>
        <Button onClick={handleAdd} variant="primary">
          + إضافة مخصم
        </Button>
      </div>

      {/* Deductions Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الإجراءات</TableHead>
            <TableHead>كود الموازنة</TableHead>
            <TableHead>العام المالي</TableHead>
            <TableHead>كود البند</TableHead>
            <TableHead>كود الصرف</TableHead>
            <TableHead>الجهة المستفيدة</TableHead>
            <TableHead>بند الخصم</TableHead>
            <TableHead>قيمة المخصص</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deductions.length > 0 ? (
            deductions.map((deduction) => (
              <TableRow key={deduction._id}>
                <TableCell>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(deduction._id)}
                    title="حذف"
                  >
                    🗑️
                  </Button>
                </TableCell>
                <TableCell className="font-semibold">{deduction.budgetCode}</TableCell>
                <TableCell>{deduction.financialYear}</TableCell>
                <TableCell>{deduction.itemCode}</TableCell>
                <TableCell>{deduction.disbursementCode}</TableCell>
                <TableCell>{deduction.beneficiaryEntity}</TableCell>
                <TableCell>{deduction.deductionItem}</TableCell>
                <TableCell className="font-semibold text-green-600">
                  {deduction.allocatedValue?.toLocaleString('ar-EG') || "-"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                لا توجد مخصمات لهذا المشروع
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        title="إضافة مخصم مالي جديد"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="كود الموازنة"
              name="budgetCode"
              value={formData.budgetCode || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="العام المالي"
              name="financialYear"
              value={formData.financialYear || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="كود البند"
              name="itemCode"
              value={formData.itemCode || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="كود الصرف"
              name="disbursementCode"
              value={formData.disbursementCode || ""}
              onChange={handleInputChange}
              required
            />
            <div className="col-span-2">
              <Input
                label="الجهة المستفيدة"
                name="beneficiaryEntity"
                value={formData.beneficiaryEntity || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                label="بند الخصم"
                name="deductionItem"
                value={formData.deductionItem || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                label="قيمة المخصص"
                name="allocatedValue"
                type="number"
                step="0.01"
                value={formData.allocatedValue || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                label="ملاحظات"
                name="notes"
                value={formData.notes || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({});
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" loading={createMutation.isLoading}>
              إضافة
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
