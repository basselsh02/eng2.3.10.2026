import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { upsertFinancialStatusByProjectCode } from "../../../api/financialStatusAPI";
import { getFFProjects } from "../../../services/ffApi";
import { useFFData } from "../../../hooks/useFFData";
import Input from "../../ui/Input/Input";
import AppSelect from "../../ui/AppSelect/AppSelect";
import FormDatePicker from "../../ui/FormDatePicker/FormDatePicker";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";

export default function CreateFinancialStatusForm({ onSuccess }) {
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm();
  const { data: projects = [] } = useFFData(getFFProjects, {}, []);

  const projectOptions = projects.map((project) => ({
    value: project.projectCode,
    label: `${project.projectName || project.name} (${project.projectCode})`,
    project,
  }));

  const createMutation = useMutation({
    mutationFn: upsertFinancialStatusByProjectCode,
    onSuccess: () => { toast.success("تم حفظ الموقف المالي بنجاح"); onSuccess?.(); },
    onError: (error) => { toast.error(error.response?.data?.message || "فشل حفظ الموقف المالي"); },
  });

  const onSubmit = (data) => createMutation.mutate(data);
  const selectedProjectCode = watch("projectCode");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="projectCode"
          control={control}
          rules={{ required: "رقم المشروع مطلوب" }}
          render={({ field }) => (
            <AppSelect
              options={projectOptions}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selected = projectOptions.find((p) => p.value === value)?.project;
                if (selected) {
                  setValue("projectType", selected.projectType || "");
                  setValue("financialYear", selected.financialYear || selected.fiscalYear || "");
                  setValue("projectDescription", selected.projectDescription || selected.projectName || selected.name || "");
                  setValue("branch", selected.responsibleBranch || selected.branch || "");
                  setValue("beneficiaryEntity", selected.ownerEntity || selected.beneficiaryEntity || "");
                  setValue("companyName", selected.companyName || selected.company || "");
                  setValue("portal", selected.portal || "");
                }
              }}
              label="رقم المشروع"
              isRequired
              error={errors.projectCode?.message}
              isInvalid={!!errors.projectCode}
            />
          )}
        />

        <Input {...register("projectType")} label="نوع المشروع" disabled />
        <Input {...register("financialYear", { required: "العام المالي مطلوب" })} label="العام المالي" disabled />
        <Input {...register("companyName")} label="اسم الشركة" disabled />
        <Input {...register("portal")} label="البوابة" disabled />
        <Input {...register("beneficiaryEntity")} label="الجهة المستفيدة" disabled />
        <Input {...register("branch")} label="الفرع المسؤول" disabled />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">وصف المشروع</label>
          <textarea {...register("projectDescription")} rows={3} disabled className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
        </div>

        <FormDatePicker name="startDate" control={control} label="تاريخ البداية" />
        <FormDatePicker name="endDate" control={control} label="تاريخ النهاية" />
        <Input type="number" step="0.001" {...register("estimatedAmount")} label="التكلفة التقديرية" />
        <Input type="number" step="0.001" {...register("commitmentValue")} label="قيمة الارتباط" />
        <Input type="number" step="0.001" {...register("disbursementValue")} label="قيمة الصرف" />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button type="button" variant="secondary" onClick={() => onSuccess?.()}>إلغاء</Button>
        <Button type="submit" loading={createMutation.isLoading} disabled={createMutation.isLoading || !selectedProjectCode}>حفظ</Button>
      </div>
    </form>
  );
}
