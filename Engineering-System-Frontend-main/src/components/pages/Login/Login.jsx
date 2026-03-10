// src/components/pages/Login/Login.jsx
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../../api/authApi";
import { setCredentials } from "../../../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // لو دخل صفحة محمية واترمى على الـ login، نرجعه لنفس الصفحة بعد الدخول
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // الحل الأهم: dispatch التوكن للـ Redux
      dispatch(setCredentials({ token: data.token }));

      toast.success("تم تسجيل الدخول بنجاح");

      // نرجعه للصفحة اللي كان عايز يدخلها
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.log(error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "فشل تسجيل الدخول، تأكد من البيانات";
      toast.error(message);
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">تسجيل الدخول</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              اسم المستخدم
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("username", {
                required: "اسم المستخدم مطلوب",
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>

            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", {
                required: "كلمة المرور مطلوبة",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {mutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {mutation.isError && (
          <p className="text-red-500 text-center mt-4 text-sm">
            حدث خطأ، حاول مرة أخرى
          </p>
        )}
      </div>
    </div>
  );
}
