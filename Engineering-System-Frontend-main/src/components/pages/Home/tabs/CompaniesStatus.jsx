import React from "react";
import DataTable from "../../../common/DataTabel/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getCompanyPosition } from "../../../../api/companyAPI";
import toast from "react-hot-toast";

export default function CompaniesStatus() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["companyPosition"],
    queryFn: getCompanyPosition,
    onSuccess: () => {
      toast.success("تم جلب موقف الشركات بنجاح");
    },
    onError: (error) => {
      console.log(error);
      toast.error("حدث خطاء اثناء جلب موقف الشركات");
    },
  });
  const columns = [
    {
      id: "companyName",
      header: "اسم الشركة",
      accessorKey: "companyName",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.companyName}
        </span>
      ),
    },
    {
      id: "جملة_الاعمال_المسندة",
      header: "جملة الاعمال المسندة",
      accessorKey: "جملة_الاعمال_المسندة",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.جملة_الاعمال_المسندة?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "عدد_العقود",
      header: "عدد العقود",
      accessorKey: "عدد_العقود",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.عدد_العقود || 0}</span>
      ),
    },
    {
      id: "قيمة_العقود",
      header: "قيمة العقود",
      accessorKey: "قيمة_العقود",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.قيمة_العقود?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "عدد_المقايسات",
      header: "عدد المقايسات",
      accessorKey: "عدد_المقايسات",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.عدد_المقايسات || 0}</span>
      ),
    },
    {
      id: "قيمة_المقايسات",
      header: "قيمة المقايسات",
      accessorKey: "قيمة_المقايسات",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.قيمة_المقايسات?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "اجمالي_المستحق",
      header: "اجمالي المستحق",
      accessorKey: "اجمالي_المستحق",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.اجمالي_المستحق?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "اجمالي_المنصرف_خامات",
      header: "اجمالي المنصرف خامات",
      accessorKey: "اجمالي_المنصرف_خامات",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.اجمالي_المنصرف_خامات?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "اجمالي_المنصرف_مستخلصات",
      header: "اجمالي المنصرف مستخلصات",
      accessorKey: "اجمالي_المنصرف_مستخلصات",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.اجمالي_المنصرف_مستخلصات?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "اجمالي_صافي_المنصرف",
      header: "اجمالي صافي المنصرف",
      accessorKey: "اجمالي_صافي_المنصرف",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.اجمالي_صافي_المنصرف?.toLocaleString() || 0}</span>
      ),
    },
    {
      id: "اجمالي_المتبقي",
      header: "اجمالي المتبقي",
      accessorKey: "اجمالي_المتبقي",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.اجمالي_المتبقي?.toLocaleString() || 0}</span>
      ),
    },
  ];
  return (
    <>
      <section>
        <div className="p-4">
          <h2 className="text-xl text-primary-500">موقف الشركات</h2>
        </div>
        <DataTable
          data={res?.data || []}
          columns={columns}
          loading={isLoading}
        />
      </section>
    </>
  );
}
