import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFinancialProcedure } from "../../../api/financialProceduresAPI";
import { getProjects } from "../../../api/projectAPI";
import Input from "../../ui/Input/Input";
import AppSelect from "../../ui/AppSelect/AppSelect";
import FormDatePicker from "../../ui/FormDatePicker/FormDatePicker";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";

export default function CreateFinancialProcedureForm({ onSuccess }) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      procedureType: "offers",
      financialOffers: { quantity: 0, unitPrice: 0 }
    }
  });

  const procedureType = watch("procedureType");
  const quantity = Number(watch("financialOffers.quantity")) || 0;
  const unitPrice = Number(watch("financialOffers.unitPrice")) || 0;
  const computedTotal = quantity * unitPrice;

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
    mutationFn: createFinancialProcedure,
    onSuccess: () => {
      toast.success("تم إنشاء الإجراء المالي بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل إنشاء الإجراء المالي");
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

      {/* Procedure Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نوع الإجراء <span className="text-red-500">*</span>
        </label>
        <Input
          type="select"
          {...register("procedureType", { required: "نوع الإجراء مطلوب" })}
          label="نوع الإجراء"
          error={errors.procedureType}
          options={[
            { value: "offers", label: "العروض المالية" },
            { value: "proposal", label: "المقترح المالي" },
            { value: "resolution", label: "البت المالي" }
          ]}
        />
      </div>

      {/* Financial Offers Fields */}
      {procedureType === "offers" && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">بيانات العروض المالية</h3>
          
          <Input
            {...register("financialOffers.company")}
            label="الشركة"
            error={errors.financialOffers?.company}
          />
          
          <Input
            {...register("financialOffers.offerType")}
            label="نوع العرض"
            error={errors.financialOffers?.offerType}
          />
          
          <Input
            {...register("financialOffers.offerNumber")}
            label="رقم العرض"
            error={errors.financialOffers?.offerNumber}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDatePicker
              name="financialOffers.offerStartDate"
              control={control}
              label="تاريخ العرض"
            />
            
            <FormDatePicker
              name="financialOffers.offerEndDate"
              control={control}
              label="تاريخ نهاية العرض"
            />
          </div>
          <Input
            type="number"
            {...register("financialOffers.sequentialOrder")}
            label="الترتيب المسلسل"
            error={errors.financialOffers?.sequentialOrder}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="number" {...register("financialOffers.quantity")} label="الكمية" />
            <Input type="number" step="0.001" {...register("financialOffers.unitPrice")} label="سعر الوحدة" />
            <Input type="number" value={computedTotal} label="الاجمالي" disabled readOnly />
          </div>

        </div>
      )}

      {/* Proposal Fields */}
      {procedureType === "proposal" && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">بيانات المقترح المالي</h3>
          
          <Input
            {...register("proposalData.companyName")}
            label="اسم الشركة"
            error={errors.proposalData?.companyName}
          />
          
          <Input
            {...register("proposalData.contractor")}
            label="المتعاقد"
            error={errors.proposalData?.contractor}
          />
          
          <Input
            type="number"
            step="0.01"
            {...register("proposalData.priceOffer")}
            label="عرض السعر"
            error={errors.proposalData?.priceOffer}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              {...register("proposalData.guaranteePercentage")}
              label="نسبة الضمان %"
              error={errors.proposalData?.guaranteePercentage}
            />
            
            <Input
              type="number"
              step="0.01"
              {...register("proposalData.advancePercentage")}
              label="نسبة الدفعة المقدمة %"
              error={errors.proposalData?.advancePercentage}
            />
          </div>
        </div>
      )}

      {/* Resolution Fields */}
      {procedureType === "resolution" && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">بيانات البت المالي</h3>
          
          <Input
            {...register("resolutionData.responsibleParty")}
            label="الجهة المسؤولة"
            error={errors.resolutionData?.responsibleParty}
          />
          
          <Input
            {...register("resolutionData.contractType")}
            label="نوع العقد"
            error={errors.resolutionData?.contractType}
          />
          
          <Input
            type="number"
            step="0.01"
            {...register("resolutionData.priceOffer")}
            label="عرض السعر"
            error={errors.resolutionData?.priceOffer}
          />
        </div>
      )}

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
          إنشاء الإجراء المالي
        </Button>
      </div>
    </form>
  );
}
