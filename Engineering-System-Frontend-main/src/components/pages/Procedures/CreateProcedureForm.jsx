import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProcedure } from "../../../api/proceduresAPI";
import { getProjects } from "../../../api/projectAPI";
import Input from "../../ui/Input/Input";
import AppSelect from "../../ui/AppSelect/AppSelect";
import FormDatePicker from "../../ui/FormDatePicker/FormDatePicker";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";

export default function CreateProcedureForm({ onSuccess }) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      procedureType: "company_offers",
      companyOffers: [],
      committeeData: [],
      technicalProcedures: []
    }
  });

  const procedureType = watch("procedureType");

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
    mutationFn: createProcedure,
    onSuccess: () => {
      toast.success("تم إنشاء الإجراء بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل إنشاء الإجراء");
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
            { value: "company_offers", label: "عروض الشركات" },
            { value: "technical_resolution", label: "البت التقني" },
            { value: "financial_proposal", label: "المقترح المالي" }
          ]}
        />
      </div>

      {/* Company Offers Fields */}
      {procedureType === "company_offers" && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">بيانات العروض</h3>
          
          <Input
            {...register("companyOffers.0.company")}
            label="الشركة"
            error={errors.companyOffers?.[0]?.company}
          />
          
          <Input
            {...register("companyOffers.0.offerType")}
            label="نوع العرض"
            error={errors.companyOffers?.[0]?.offerType}
          />
          
          <Input
            {...register("companyOffers.0.offerNumber")}
            label="رقم العرض"
            error={errors.companyOffers?.[0]?.offerNumber}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDatePicker
              name="companyOffers.0.offerDate"
              control={control}
              label="تاريخ العرض"
            />
            
            <FormDatePicker
              name="companyOffers.0.offerEndDate"
              control={control}
              label="تاريخ انتهاء العرض"
            />
          </div>
          
          <Input
            {...register("companyOffers.0.conditions")}
            label="الشروط"
            error={errors.companyOffers?.[0]?.conditions}
          />
        </div>
      )}

      {/* Technical Resolution Fields */}
      {procedureType === "technical_resolution" && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">بيانات البت التقني</h3>
          
          <Input
            {...register("technicalProcedures.0.name")}
            label="الاسم"
            error={errors.technicalProcedures?.[0]?.name}
          />
          
          <Input
            {...register("technicalProcedures.0.position")}
            label="الوظيفة"
            error={errors.technicalProcedures?.[0]?.position}
          />
          
          <Input
            type="number"
            {...register("technicalProcedures.0.order")}
            label="الترتيب"
            error={errors.technicalProcedures?.[0]?.order}
          />
        </div>
      )}

      {/* Financial Proposal Fields */}
      {procedureType === "financial_proposal" && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">بيانات المقترح المالي</h3>
          
          <Input
            {...register("financialProposal.company")}
            label="الشركة"
            error={errors.financialProposal?.company}
          />
          
          <Input
            {...register("financialProposal.offerType")}
            label="نوع العرض"
            error={errors.financialProposal?.offerType}
          />
          
          <Input
            {...register("financialProposal.offerNumber")}
            label="رقم العرض"
            error={errors.financialProposal?.offerNumber}
          />
          
          <FormDatePicker
            name="financialProposal.offerDate"
            control={control}
            label="تاريخ العرض"
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
          إنشاء الإجراء
        </Button>
      </div>
    </form>
  );
}
