import React from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../api/profileApi";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const newPassword = useWatch({
    control,
    name: "newPassword",
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح!");
    },
    onError: (error) => {
      console.error("Error:", error.response.data.message);
      toast.error(
        error.response.data.message || "حدث خطاء اثناء تغيير كلمة المرور"
      );
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };
  return (
    <section>
      <PageTitle title="تغيير كلمة المرور" />
      <form onSubmit={handleSubmit(onSubmit)} className="my-8">
        <div className="space-y-2 flex flex-col">
          <div>
            <Input
              label="كلمة المرور الحالية"
              type="password"
              {...register("oldPassword")}
            />
          </div>
          <div>
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              {...register("newPassword", {
                required: "كلمة المرور الجديدة مطلوبة",
                minLength: {
                  value: 6,
                  message: "يجب أن تكون 6 أحرف على الأقل",
                },
              })}
              error={errors.newPassword}
            />
          </div>
          <div>
            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              {...register("confirmPassword", {
                required: "تأكيد كلمة المرور مطلوب",
                validate: (value) =>
                  value === newPassword || "كلمتا المرور غير متطابقتين",
              })}
              error={errors.confirmPassword}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full disabled:opacity-35"
              disabled={mutation.isLoading}
            >
              حفظ
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
