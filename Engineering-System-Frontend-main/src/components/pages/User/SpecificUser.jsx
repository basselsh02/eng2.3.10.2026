import { useQuery } from "@tanstack/react-query";
import React from "react";
import { NavLink, useParams } from "react-router";
import { getUser } from "../../../api/userAPI";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Card from "../../ui/Card/Card";
import CardHeader from "../../ui/Card/CardHeader";
import CardBody from "../../ui/Card/CardBody";
import Can from "../../common/Can/Can";
import { FaRegEdit } from "react-icons/fa";
import { FaExpeditedssl } from "react-icons/fa6";
export default function SpecificUser() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser({ id }),
    select: (res) => res.data,
    enabled: !!id,
  });
  if (isLoading) return <Loading />;
  console.log(data);
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <PageTitle title={"بيانات المستخدم"} />
        <NavLink to={"/users"}>
          <Button variant="secondary" icon={<BsArrowLeft />} iconPosition="end">
            العودة للخلف
          </Button>
        </NavLink>
      </div>
      {/* main Content */}
      <div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-base rounded-full overflow-hidden p-4">
            <img
              src={data.avatar}
              alt="user avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{data.fullNameArabic}</h2>
            <p>{data.fullNameEnglish}</p>
          </div>
        </div>
        <Card className="my-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">بيانات المستخدم</h3>
              <Can action={"users:update"}>
                <NavLink to={`/users/update/${id}`}>
                  <Button>
                    <FaRegEdit />
                  </Button>
                </NavLink>
              </Can>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 py-1">
              <span className="text-sm font-bold text-muted-foreground relative after:content-[':']">
                التخصص
              </span>
              <span className="text-sm font-medium">
                {data.specialization == "CIVILIAN" ? "مدني" : "عسكري"}
              </span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 py-1">
              <span className="text-sm font-bold text-muted-foreground relative after:content-[':']">
                اسم المستخدم
              </span>
              <span className="text-sm font-medium">{data.username}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 py-1">
              <span className="text-sm font-bold text-muted-foreground relative after:content-[':']">
                الدور
              </span>
              <span className="text-sm font-medium">{data.role}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 py-1">
              <span className="text-sm font-bold text-muted-foreground relative after:content-[':']">
                الوحدة التابع لها
              </span>
              <div className="text-sm font-medium">
                {data.organizationalUnit.path?.map((p) => (
                  <span key={p._id} className="mr-1">
                    {p.name} /
                  </span>
                ))}
                <span className="bg-amber-200 px-2">
                  {data.organizationalUnit.name}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="my-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">الصلاحيات</h3>
              <Can action={"users:update:updatePermissions"}>
                <NavLink to={`/users/permissions/${id}`}>
                  <Button>
                    <FaExpeditedssl />
                  </Button>
                </NavLink>
              </Can>
            </div>
          </CardHeader>
          <CardBody>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-start text-body">
                <thead className="text-sm bg-primary-500 text-primary-content-500 border-b rounded-base">
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
                  {data?.permissions?.map((permission) => (
                    <tr
                      className="bg-background border-b border-default hover:bg-neutral-secondary-soft"
                      key={permission.id}
                    >
                      <td className="px-6 py-4">{permission.action}</td>
                      <td className="px-6 py-4">
                        {permission.scope == "ALL"
                          ? "الكل"
                          : permission.scope == "OWN_UNIT"
                          ? "الوحدة الخاصة به فقط"
                          : "وحدات المخصصة"}
                      </td>
                      <td className="px-6 py-4">
                        {permission.units.map((u) => u.name).join(", ") ||
                          "----"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
