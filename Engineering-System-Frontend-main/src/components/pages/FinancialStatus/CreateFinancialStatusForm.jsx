import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFinancialStatus } from "../../../api/financialStatusAPI";
import { getProjects } from "../../../api/projectAPI";
import Input from "../../ui/Input/Input";
import AppSelect from "../../ui/AppSelect/AppSelect";
import FormDatePicker from "../../ui/FormDatePicker/FormDatePicker";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";

export default function CreateFinancialStatusForm({ onSuccess }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      status: "planned"
    }
  });

  // Fetch projects for select dropdown
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects({}),
  });

  const projects = projectsData?.data?.docs || projectsData?.data || [];
  const projectOptions = projects.map((project) => ({
    value: project._id,
    label: `${project.projectName} (${project.projectCode})`,
  }));

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createFinancialStatus,
    onSuccess: () => {
      toast.success("تم إنشاء الموقف المالي بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل إنشاء الموقف المالي");
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Project Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          المشروع <span className="text-red-500">*</span>
        </label>
        <Controller
          name="projectId"
          control={control}
          rules={{ required: "المشروع مطلوب" }}
          render={({ field }) => (
            <AppSelect
              options={projectOptions}
              value={field.value}
              onChange={field.onChange}
              label="اختر المشروع"
              isRequired
              error={errors.projectId?.message}
              isInvalid={!!errors.projectId}
            />
          )}
        />
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("projectCode")}
          label="كود المشروع"
          error={errors.projectCode}
        />
        
        <Input
          {...register("projectName")}
          label="اسم المشروع"
          error={errors.projectName}
        />
        
        <Input
          {...register("financialYear", { required: "السنة المالية مطلوبة" })}
          label="السنة المالية"
          placeholder="مثال: 2025/2026"
          error={errors.financialYear}
          rules={{ required: true }}
        />
        
        <Input
          {...register("projectType")}
          label="نوع المشروع"
          error={errors.projectType}
        />
      </div>

      {/* Responsibility Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("responsibleBranch")}
          label="الفرع المسئول"
          error={errors.responsibleBranch}
        />
        
        <Input
          {...register("responsibleEmployee")}
          label="الموظف المسئول"
          error={errors.responsibleEmployee}
        />
        
        <Input
          {...register("ownerEntity")}
          label="جهة المالك"
          error={errors.ownerEntity}
        />
        
        <Input
          {...register("company")}
          label="الشركة"
          error={errors.company}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDatePicker
          name="actualStartDate"
          control={control}
          label="تاريخ البداية الفعلي"
        />
        
        <FormDatePicker
          name="actualEndDate"
          control={control}
          label="تاريخ النهاية الفعلي"
        />
        
        <FormDatePicker
          name="issueDate"
          control={control}
          label="تاريخ الإصدار"
        />
        
        <FormDatePicker
          name="siteExitDate"
          control={control}
          label="تاريخ الانتهاء من الموقع"
        />
      </div>

      {/* Financial Information */}
      <div className="border border-gray-300 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">المعلومات المالية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            step="0.01"
            {...register("estimatedCost")}
            label="التكلفة المقدرة"
            error={errors.estimatedCost}
          />
          
          <Input
            type="number"
            step="0.01"
            {...register("costPercentage")}
            label="نسبة التكلفة %"
            error={errors.costPercentage}
          />
          
          <Input
            {...register("treasuryCode")}
            label="كود الخزانة"
            error={errors.treasuryCode}
          />
          
          <Input
            {...register("contractingMethod")}
            label="طريقة التعاقد"
            error={errors.contractingMethod}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="border border-gray-300 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">معلومات إضافية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDatePicker
            name="openingDate"
            control={control}
            label="تاريخ الفتح"
          />
          
          <FormDatePicker
            name="publicationDate"
            control={control}
            label="تاريخ النشر"
          />
          
          <Input
            {...register("mainProject")}
            label="المشروع الرئيسي"
            error={errors.mainProject}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ملاحظات
        </label>
        <textarea
          {...register("notes")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
          placeholder="أدخل أي ملاحظات إضافية..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onSuccess?.()}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          loading={createMutation.isLoading}
          disabled={createMutation.isLoading}
        >
          إنشاء الموقف المالي
        </Button>
      </div>
    </form>
  );
}
