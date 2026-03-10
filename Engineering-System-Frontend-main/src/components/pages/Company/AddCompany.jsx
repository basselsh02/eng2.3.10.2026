import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompany } from "@/api/companyAPI.js";
import { useNavigate } from "react-router";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import FileInput from "../../ui/FileInput/FileInput";
import toast from "react-hot-toast";

export default function AddCompany() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("تم إضافة الشركة بنجاح");
      queryClient.invalidateQueries(["companies"]);
      navigate("/companies");
    },
    onError: () => {
      toast.error("فشل إضافة الشركة");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) {
        if (key === "securityApprovalFile" && data[key][0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    mutation.mutate(formData);
  };

  return (
    <div>
      <PageTitle title="إضافة شركة جديدة" />
      
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="كود الشركة"
              {...register("companyCode", { required: "مطلوب" })}
              error={errors.companyCode?.message}
              required
            />
            <Input
              label="اسم الشركة"
              {...register("companyName", { required: "مطلوب" })}
              error={errors.companyName?.message}
              required
            />
            <Input
              label="السجل التجاري"
              {...register("commercialRegister")}
            />
            <Input
              label="رقم الموافقة الأمنية"
              {...register("securityApprovalNumber")}
            />
            <Input
              label="تاريخ الموافقة الأمنية"
              type="date"
              {...register("securityApprovalDate")}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              {...register("email")}
            />
            <Input
              label="الهاتف"
              {...register("phones")}
            />
            <Input
              label="العنوان"
              {...register("address")}
            />
            <FileInput
              label="ملف الموافقة الأمنية"
              {...register("securityApprovalFile")}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/companies")}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}