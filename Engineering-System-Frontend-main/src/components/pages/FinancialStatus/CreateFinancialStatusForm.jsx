import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { upsertFinancialStatusByProjectCode } from "../../../api/financialStatusAPI";
import { getProjects } from "../../../api/projectAPI";
import Input from "../../ui/Input/Input";
import AppSelect from "../../ui/AppSelect/AppSelect";
import FormDatePicker from "../../ui/FormDatePicker/FormDatePicker";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";

export default function CreateFinancialStatusForm({ onSuccess }) {
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm();

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects({}),
  });

  const projects = projectsData?.data?.docs || projectsData?.data || [];
  const projectOptions = projects.map((project) => ({
    value: project.projectCode,
    label: `${project.projectName} (${project.projectCode})`,
    project,
  }));

  const createMutation = useMutation({
    mutationFn: upsertFinancialStatusByProjectCode,
    onSuccess: () => {
      toast.success("تم حفظ الموقف المالي بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل حفظ الموقف المالي");
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

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
                  setValue("financialYear", selected.financialYear || "");
                  setValue("projectDescription", selected.projectName || "");
                  setValue("branch", selected.responsibleBranch || "");
                  setValue("beneficiaryEntity", selected.ownerEntity || "");
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
        <Input type="select" {...register("financialYear", { required: "العام المالي مطلوب" })} label="العام المالي" error={errors.financialYear} options={[{ value: "", label: "اختر العام المالي" }, { value: "2026/2025", label: "2026/2025" }, { value: "2025/2024", label: "2025/2024" }]} />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">وصف المشروع</label>
          <textarea {...register("projectDescription")} rows={3} readOnly className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
        </div>

        <FormDatePicker name="startDate" control={control} label="تاريخ البداية" />
        <FormDatePicker name="endDate" control={control} label="تاريخ النهاية" />
        <FormDatePicker name="cardArrivalDate" control={control} label="تاريخ ورود الكارت" />
        <FormDatePicker name="technicalBroadcastDate" control={control} label="تاريخ البث الفني" />
        <FormDatePicker name="financialBroadcastDate" control={control} label="تاريخ البث المالي" />

        <Input type="number" step="0.001" {...register("estimatedAmount")} label="التكلفة التقديرية" />
        <Input type="number" step="0.001" {...register("commitmentValue")} label="قيمة الارتباط" />
        <Input type="number" step="0.001" {...register("disbursementValue")} label="قيمة الصرف" />

        <Input {...register("branch")} label="الفرع المسؤول" disabled />
        <Input {...register("responsibleEmployee")} label="اسم الموظف" />
        <Input {...register("beneficiaryEntity")} label="الجهة المستفيدة" disabled />
        <Input {...register("companyName")} label="اسم الشركة" disabled />
        <Input {...register("portal")} label="البوابة" disabled />

        <FormDatePicker name="actualOpeningDate" control={control} label="تاريخ الفتح الفعلي" />
        <Input type="number" {...register("responsibleEmployeeNumber")} label="الموظف المسؤول" />
        <FormDatePicker name="actualOpeningDate2" control={control} label="تاريخ فتح فعلي 2" />

        <Input {...register("letterCode")} label="الحرف" />
        <Input {...register("discountItem")} label="بند الخصم" />
        <Input {...register("latestStatus")} label="اخر موقف" />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
        <textarea
          {...register("notes")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button type="button" variant="secondary" onClick={() => onSuccess?.()}>
          إلغاء
        </Button>
        <Button type="submit" loading={createMutation.isLoading} disabled={createMutation.isLoading || !selectedProjectCode}>
          حفظ
        </Button>
      </div>
    </form>
  );
}
