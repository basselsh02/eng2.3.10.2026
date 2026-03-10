import React from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../../api/profileApi";
import Loading from "../../common/Loading/Loading";

export default function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const navigate = useNavigate();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <section>
        <div className="mb-4">
          <PageTitle title="الملف الشخصي" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 space-y-4 lg:gap-4">
          <div className="bg-base w-full p-2 rounded-lg shadow-md col-span-3 ">
            <h3 className="text-xl">المعلومات الشخصية</h3>
            <div className="flex flex-col">
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold">
                  الاسم باللغة العربية
                </span>
                <span className="w-3/4 font-light">
                  {profile?.data.fullNameArabic || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold">
                  الاسم باللغة الانجليزية
                </span>
                <span className="w-3/4 font-light">
                  {profile?.data.fullNameEnglish || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold">الوحدة التابع لها</span>
                <span className="w-3/4 font-light">
                  {profile?.data?.organizationalUnit?.name || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b border-b-current last:border-b-0">
                <span className="w-1/4 font-semibold">اسم المستخدم</span>
                <span className="w-3/4 font-light">
                  {profile?.data.username || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold"> التخصص</span>
                <span className="w-3/4 font-light">
                  {profile?.data.specialization || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold"> الوظيفة</span>
                <span className="w-3/4 font-light">
                  {profile?.data.role || "----"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-base p-2 flex flex-col items-center justify-center py-5 w-full shadow-md rounded-lg">
            <div className="border p-3 rounded-full w-24 h-24 bg-white">
              <img
                src={profile?.data.avatar}
                alt="avatar"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="text-center">
              <h5 className="text-2xl my-2 font-bold">
                {profile?.data.fullName}
              </h5>
              <p>{profile?.data.role}</p>
            </div>
            <div className="flex justify-between items-center gap-4 mt-8">
              <Button onClick={() => navigate("/profile/edit")}>
                تعديل الملف الشخصي
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/profile/change-password")}
              >
                تغيير كلمة المرور
              </Button>
            </div>
          </div>
          {/* الصلاحيات */}
          <div className="bg-base p-2 flex flex-col py-5 h-fit col-span-full shadow-md rounded-lg">
            <h3 className="text-xl mb-2">الصلاحيات</h3>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-start text-body">
                <thead className="text-sm bg-base border-b rounded-base">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-bold text-start">
                      الصلاحية
                    </th>
                    <th scope="col" className="px-6 py-3 font-bold text-start">
                      النطاق
                    </th>
                    <th scope="col" className="px-6 py-3 font-bold text-start">
                      الوحدة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profile?.data?.permissions?.map((permission) => (
                    <tr
                      className="bg-background border-b border-default hover:bg-neutral-secondary-soft"
                      key={permission.id}
                    >
                      <td className="px-6 py-4">{permission.action}</td>
                      <td className="px-6 py-4">{permission.scope}</td>
                      <td className="px-6 py-4">
                        {permission.units.map((u) => u.name).join(", ") ||
                          "----"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
