import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getOffices, deleteOffice } from "../../../api/officesAPI";
import { useAuth } from "../../../hooks/useAuth";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import toast from "react-hot-toast";
import CreateOfficeForm from "./CreateOfficeForm";
import Can from "../../common/Can/Can";

export default function Offices() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const queryClient = useQueryClient();

  // Check if user is privileged (can manage office permissions)
  const isPrivileged = ["SUPER_ADMIN", "مدير", "رئيس فرة", "مدير الادارة"].includes(user?.role);

  // Fetch offices with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["offices", page, search, type],
    queryFn: () => getOffices({ page, limit: 10, search, type }),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteOffice,
    onSuccess: () => {
      toast.success("تم حذف المكتب/الكتيبة بنجاح");
      queryClient.invalidateQueries(["offices"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل حذف المكتب/الكتيبة");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المكتب/الكتيبة؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value, type });
  };

  const handleTypeChange = (newType) => {
    setSearchParams({ page: "1", search, type: newType });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search, type });
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
      </div>
    );
  }

  const offices = data?.data?.offices || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      <PageTitle title="المكاتب والكتائب" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="بحث في المكاتب..."
            />
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">الكل</option>
              <option value="مكتب">مكتب</option>
              <option value="كتيبة">كتيبة</option>
            </select>
          </div>
          <Can action="offices:create">
            <Button onClick={() => {
              setEditingOffice(null);
              setIsCreateModalOpen(true);
            }}>
              إضافة مكتب/كتيبة جديد
            </Button>
          </Can>
        </div>

        {/* Offices Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              {isPrivileged && <TableHead>الصلاحيات</TableHead>}
              <TableHead>الحالة</TableHead>
              <TableHead>المدير</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الرمز</TableHead>
              <TableHead>الاسم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offices.length > 0 ? (
              offices.map((office) => (
                <TableRow key={office._id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Can action="offices:update">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingOffice(office);
                            setIsCreateModalOpen(true);
                          }}
                        >
                          تعديل
                        </Button>
                      </Can>
                      <Can action="offices:delete">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(office._id)}
                          disabled={deleteMutation.isLoading}
                        >
                          حذف
                        </Button>
                      </Can>
                    </div>
                  </TableCell>
                  {isPrivileged && (
                    <TableCell>
                      {office.permissions && office.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {office.permissions.slice(0, 2).map((perm) => (
                            <span
                              key={perm.action}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                            >
                              {perm.action}
                            </span>
                          ))}
                          {office.permissions.length > 2 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                              +{office.permissions.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      office.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {office.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {office.managerId?.fullNameArabic || "-"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      office.type === "مكتب"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {office.type}
                    </span>
                  </TableCell>
                  <TableCell>{office.code}</TableCell>
                  <TableCell className="font-semibold">{office.name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isPrivileged ? 7 : 6} className="text-center text-gray-500 py-8">
                  لا توجد مكاتب/كتائب
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Create/Edit Office Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingOffice(null);
        }}
        title={editingOffice ? "تعديل المكتب/الكتيبة" : "إضافة مكتب/كتيبة جديد"}
        size="lg"
      >
        <CreateOfficeForm
          editingOffice={editingOffice}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setEditingOffice(null);
            queryClient.invalidateQueries(["offices"]);
          }}
        />
      </Modal>
    </div>
  );
}
