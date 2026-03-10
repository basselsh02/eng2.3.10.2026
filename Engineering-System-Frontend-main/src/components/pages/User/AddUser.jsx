import { QueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createUser } from "../../../api/userAPI";
import toast from "react-hot-toast";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import OrganizationalTreeModal from "../../common/OrganizationalTreeModal/OrganizationalTreeModal";

export default function AddUser() {
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      phones: [{ phone: "" }],
    },
  });
  const selectedUnit = watch("organizationalUnit");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("تم إضافة المستخدم بنجاح!");
      reset();
      QueryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(
        error.response.data.message || "حدث خطاء اثناء اضافة المستخدم"
      );
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      organizationalUnit: data.organizationalUnit._id,
      phones: data.phones.map((p) => p.phone),
    };

    mutation.mutate(payload);
  };
  useEffect(() => {
    register("organizationalUnit", {
      required: "الوحدة التنظيمية مطلوبة",
    });
  }, [register]);
  return (
    <>
      <section>
        <div className="w-fit">
          <PageTitle title="اضافة مستخدم جديد" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          autoComplete="off"
        >
          <div>
            <Input
              label="اسم المستخدم عربي"
              {...register("fullNameArabic", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.fullNameArabic}
            />
          </div>
          <div>
            <Input
              label="اسم المستخدم انجليزي"
              {...register("fullNameEnglish", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.fullNameEnglish}
            />
          </div>
          <div>
            <Input
              label="التخصص"
              {...register("specialization", { required: "اسم الشركة مطلوب" })}
              type="select"
              options={[
                { label: "مدني", value: "CIVILIAN" },
                { label: "عسكري", value: "MILITARY" },
              ]}
              error={errors.specialization}
            />
          </div>
          <div className="col-span-full flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="رقم هاتف"
                    {...register(`phones.${index}.phone`)}
                    type="phone"
                    error={errors.phones?.[index]?.phone}
                  />
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => remove(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            ))}
            <div>
              <Button type="button" onClick={() => append({ number: "" })}>
                اضافة رقم
              </Button>
            </div>
          </div>
          <div>
            <Input
              label="اسم المستخدم في تسجيل الدخول"
              {...register("username", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.username}
            />
          </div>
          <div>
            <Input
              label="كلمة المرور"
              {...register("password", { required: "اسم الشركة مطلوب" })}
              type="password"
              error={errors.password}
              rules={{ required: "الوظيفة مطلوبة" }}
            />
          </div>
          <div>
            <Input
              label="الوظيفة"
              {...register("role", { required: "اسم الشركة مطلوب" })}
              type="select"
              error={errors.role}
              options={[
                { value: "مكتب", label: "مكتب" },
                { value: "مدير", label: "مدير" },
                { value: "رئيس فرع", label: "رئيس فرع" },
                { value: "مدير الادارة", label: "مدير الادارة" },
                { value: "SUPER_ADMIN", label: "مدير النظام" },
              ]}
              rules={{ required: "الوظيفة مطلوبة" }}
            />
          </div>
          {watch("role") !== "SUPER_ADMIN" && (
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">
                الوحدة التابع لها
              </label>

              <div
                onClick={() => setIsUnitModalOpen(true)}
                className="border rounded px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {selectedUnit?.name || "اختر الوحدة التابع لها"}
              </div>

              {errors.organizationalUnit && (
                <p className="text-red-500 text-sm mt-1">
                  الوحدة التابع لها مطلوبة
                </p>
              )}
            </div>
          )}
          <div className="col-span-full">
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isLoading}
            >
              اضافة
            </Button>
          </div>
        </form>
        <OrganizationalTreeModal
          isOpen={isUnitModalOpen}
          onClose={() => setIsUnitModalOpen(false)}
          onSelect={(unit) => {
            console.log("unit", unit[0]);
            setValue("organizationalUnit", unit[0], {
              shouldValidate: true,
            });
          }}
          multiple={false}
        />
      </section>
    </>
  );
}
