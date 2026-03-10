import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../../api/profileApi";
import toast from "react-hot-toast";
import { fetchUserProfile } from "../../../features/auth/authSlice";

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      phones: [{ phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });
  useEffect(() => {
    if (profile?.data) {
      const phones =
        profile?.data?.phones?.length > 0
          ? profile?.data?.phones.map((p) => ({ phone: p }))
          : [{ phone: "" }];
      reset({
        ...profile?.data,
        phones,
      });
    }
  }, [profile?.data, reset]);
  // update mutation
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("تم تحديث الملف الشخصي بنجاح");
      dispatch(fetchUserProfile());
    },
    onError: (err) => {
      console.error(err);
      toast.error("حدث خطاء اثناء تحديث الملف الشخصي");
    },
  });
  const onSubmit = (data) => {
    // ما تعملش FormData أصلًا
    const payload = {
      username: data.username,
      fullName: data.fullName,
      mainUnit: data.mainUnit,
      subUnit: data.subUnit,
      phones: data.phones.map((p) => p.phone).filter(Boolean), // ← array من strings
    };

    mutation.mutate(payload);
  };
  return (
    <>
      <section>
        <PageTitle
          title="تعديل الملف الشخصي"
          subTitle={"يمكنك تعديل بعض بيانات الملف الشخصي الخاص بك"}
        />
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5 my-4">
              <div>
                <Input
                  label="اسم المستخدم"
                  {...register("username", { required: "اسم المستخدم مطلوب" })}
                  error={errors.username}
                />
              </div>
              <div>
                <Input
                  label="الاسم الكامل باللغة العربية"
                  {...register("fullNameArabic", {
                    required: "اسم الكامل مطلوب",
                  })}
                  error={errors.fullNameArabic}
                />
              </div>
              <div>
                <Input
                  label="الاسم الكامل باللغة الانجليزية"
                  {...register("fullNameEnglish", {
                    required: "اسم الكامل مطلوب",
                  })}
                  error={errors.fullNameEnglish}
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
            </div>

            <Button type="submit">
              <span>تعديل الملف الشخصي</span>
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
