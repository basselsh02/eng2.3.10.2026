import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeductionsByProject, createFinancialDeduction, deleteFinancialDeduction } from "../../../../../api/financialDeductionAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import Select from "../../../../ui/Select/Select";
import Loading from "../../../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function FinancialDeductionsTab({ projectId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["financialDeductions", projectId],
    queryFn: () => getDeductionsByProject(projectId, { limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createFinancialDeduction,
    onSuccess: () => {
      toast.success("تم إضافة المخصم بنجاح");
      queryClient.invalidateQueries(["financialDeductions"]);
      setIsAdding(false);
      setFormData({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت الإضافة");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFinancialDeduction,
    onSuccess: () => {
      toast.success("تم حذف المخصم بنجاح");
      queryClient.invalidateQueries(["financialDeductions"]);
      setCurrentIndex(0);
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
    e?.preventDefault();
    createMutation.mutate({
      ...formData,
      projectId,
      allocatedValue: parseFloat(formData.allocatedValue),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المخصم؟")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  const deductions = data?.data || [];
  const totalDisbursed = deductions.reduce((sum, d) => sum + (d.allocatedValue || 0), 0);
  const current = deductions[currentIndex] || null;
  const display = isAdding ? formData : (current || {});

  return (
    <div className="space-y-4" dir="rtl">

      {/* All fields as inputs */}
      <div className="space-y-3">

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="كود الموازنة"
            name="budgetCode"
            value={display.budgetCode || ""}
            onChange={isAdding ? handleInputChange : undefined}
            readOnly={!isAdding}
          />
          <Select
            label="العام المالي"
            name="financialYear"
            value={display.financialYear || ""}
            onChange={isAdding ? handleInputChange : undefined}
            disabled={!isAdding}
          />
        </div>

        <Input
          label="كود البند"
          name="itemCode"
          value={display.itemCode || ""}
          onChange={isAdding ? handleInputChange : undefined}
          readOnly={!isAdding}
        />

        <Input
          label="كود الصرف"
          name="disbursementCode"
          value={display.disbursementCode || ""}
          onChange={isAdding ? handleInputChange : undefined}
          readOnly={!isAdding}
        />

        <Input
          label="الجهة المستفيدة"
          name="beneficiaryEntity"
          value={display.beneficiaryEntity || ""}
          onChange={isAdding ? handleInputChange : undefined}
          readOnly={!isAdding}
        />

        <Input
          label="بند الخصم"
          name="deductionItem"
          value={display.deductionItem || ""}
          onChange={isAdding ? handleInputChange : undefined}
          readOnly={!isAdding}
        />

        <Input
          label="الجهة المستفيدة"
          name="beneficiaryEntity2"
          value={display.beneficiaryEntity2 || ""}
          onChange={isAdding ? handleInputChange : undefined}
          readOnly={!isAdding}
        />

        <Input
          label="قيمة المخصص"
          name="allocatedValue"
          type={isAdding ? "number" : "text"}
          step="0.01"
          value={
            isAdding
              ? display.allocatedValue || ""
              : display.allocatedValue?.toLocaleString("ar-EG") || ""
          }
          onChange={isAdding ? handleInputChange : undefined}
          readOnly={!isAdding}
        />

        {/* إجمالي الصرف */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">اجمالي الصرف</span>
          <Input
            value={totalDisbursed.toLocaleString("ar-EG")}
            readOnly
            className="max-w-[200px]"
          />
        </div>
      </div>

      {/* Navigation + Action buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">

        {/* Record navigation */}
        {!isAdding && deductions.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              ‹ السابق
            </Button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {deductions.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentIndex(i => Math.min(deductions.length - 1, i + 1))}
              disabled={currentIndex === deductions.length - 1}
            >
              التالي ›
            </Button>
          </div>
        )}

        {/* Add / Save / Cancel / Delete */}
        <div className="flex gap-2 mr-auto">
          {isAdding ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setIsAdding(false); setFormData({}); }}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={createMutation.isLoading}
              >
                حفظ
              </Button>
            </>
          ) : (
            <>
              {current && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(current._id)}
                  loading={deleteMutation.isLoading}
                >
                  حذف
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setIsAdding(true); setFormData({}); }}
              >
                + إضافة
              </Button>
            </>
          )}
        </div>
      </div>

      {deductions.length === 0 && !isAdding && (
        <p className="text-center text-gray-400 text-sm py-4">لا توجد مخصمات لهذا المشروع</p>
      )}
    </div>
  );
}