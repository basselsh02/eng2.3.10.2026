import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser, updateUser } from "../../../api/userAPI";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import OrganizationalTreeModal from "../../common/OrganizationalTreeModal/OrganizationalTreeModal";

export default function UpdateUser() {
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser({ id }),
  });
  console.log(user);
  // react hook form
  const {
    reset,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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
    mutationKey: ["updateUser", id],
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("تم تعديل المستخدم بنجاح!");
      reset();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("حدث خطاء اثناء تعديل المستخدم");
    },
  });
  // submit funtion
  const onSubmit = (data) => {
    const updatedData = {
      fullName: data.fullName,
      username: data.username,
      mainUnit: data.mainUnit || null,
      subUnit: data.subUnit || null,
      office: data.office || null,
      role: data.role,
      phones: data.phones
        .map((p) => p.phone.trim())
        .filter((phone) => phone !== ""),
    };

    mutation.mutate({ id, data: updatedData });
  };
  // register organizationalUnit
  useEffect(() => {
    register("organizationalUnit", {
      required: "الوحدة التنظيمية مطلوبة",
    });
  }, [register]);
  // reset form
  useEffect(() => {
    if (user?.data) {
      const phones =
        user.data.phones?.length > 0
          ? user.data.phones.map((p) => ({ phone: p }))
          : [{ phone: "" }];

      reset({
        fullNameArabic: user.data.fullNameArabic || "",
        fullNameEnglish: user.data.fullNameEnglish || "",
        username: user.data.username || "",
        mainUnit: user.data.mainUnit || "",
        subUnit: user.data.subUnit || "",
        office: user.data.office || "",
        role: user.data.role || "user",
        phones,
      });
    }
  }, [user?.data, reset]);
  if (isLoading) return <Loading />;
  return (
    <>
      <section>
        <div className="w-fit">
          <PageTitle title="تعديل المستخدم" subTitle={user.data.fullName} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="my-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="الاسم باللغة العربية"
                {...register("fullNameArabic", {
                  required: "الاسم باللغة العربية مطلوب",
                })}
                error={errors.fullName}
                rules={{ required: "اسم الكامل مطلوب" }}
              />
            </div>
            <div>
              <Input
                label="الاسم باللغة الانجليزية"
                {...register("fullNameEnglish", {
                  required: "الاسم باللغة الانجليزية مطلوب",
                })}
                error={errors.fullName}
                rules={{ required: "اسم الكامل مطلوب" }}
              />
            </div>
            <div className="col-span-full mb-4 relative">
              <label
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-background px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-2
            ${
              errors.organizationalUnit
                ? "text-red-500"
                : "text-body peer-focus:text-primary-500"
            }`}
              >
                الوحدة التابع لها
              </label>

              <div
                onClick={() => setIsUnitModalOpen(true)}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-lg border 
            appearance-none focus:outline-none focus:ring-0 peer
            ${
              errors.organizationalUnit
                ? "border-red-500 focus:border-red-500"
                : "focus:border-primary-500"
            }
          `}
              >
                {selectedUnit?.name || "اختر الوحدة التابع لها"}
              </div>

              {errors.organizationalUnit && (
                <p className="text-red-500 text-sm mt-1">
                  الوحدة التابع لها مطلوبة
                </p>
              )}
            </div>
            <div className="col-span-full">
              <Input
                label="اسم المستخدم في تسجيل الدخول"
                {...register("username", {
                  required: "اسم المستخدم مطلوب",
                })}
                rules={{
                  required: "اسم المستخدم مطلوب",
                }}
                error={errors.username}
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">
                أرقام الهواتف
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2 items-center">
                  <div className="flex-1">
                    <Input
                      label="رقم الهاتف"
                      {...register(`phones.${index}.phone`)}
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => remove(index)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ phone: "" })}
              >
                + إضافة رقم
              </Button>
            </div>
            <div>
              <Input
                label="الوظيفة"
                {...register("role", { required: "الوظيفة مطلوبة" })}
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
          </div>
          <Button type="submit">تعديل المستخدم</Button>
        </form>
        <OrganizationalTreeModal
          isOpen={isUnitModalOpen}
          onClose={() => setIsUnitModalOpen(false)}
          onSelect={(unit) => {
            setValue("organizationalUnit", unit, {
              shouldValidate: true,
            });
          }}
        />
      </section>
    </>
  );
}
