import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanies, deleteCompany } from "@/api/companyAPI.js";
import { Link } from "react-router";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import Loading from "../../common/Loading/Loading";
import toast from "react-hot-toast";
import Can from "../../common/Can/Can";

export default function Company() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["companies", page, search],
    queryFn: () => getCompanies({ page, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      toast.success("تم حذف الشركة بنجاح");
      queryClient.invalidateQueries(["companies"]);
    },
    onError: () => {
      toast.error("فشل حذف الشركة");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الشركة؟")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="الشركات" />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <Can action="companies:create">
            <Link to="/companies/create">
              <Button>إضافة شركة</Button>
            </Link>
          </Can>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>البريد</TableHead>
              <TableHead>اسم الشركة</TableHead>
              <TableHead>كود الشركة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.docs?.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <div className="flex gap-2">
                    <Can action="companies:update">
                      <Link to={`/companies/update/${company._id}`}>
                        <Button size="sm" variant="secondary">تعديل</Button>
                      </Link>
                    </Can>
                    <Can action="companies:delete">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(company._id)}
                      >
                        حذف
                      </Button>
                    </Can>
                  </div>
                </TableCell>
                <TableCell>{company.phones?.[0] || "-"}</TableCell>
                <TableCell>{company.email || "-"}</TableCell>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.companyCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          currentPage={data?.data?.page || 1}
          totalPages={data?.data?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}