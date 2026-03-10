import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../api/userAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import SearchInput from "../../ui/SearchInput/SearchInput";
import { FaUserShield, FaHistory } from "react-icons/fa";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import { getPermissionLabel } from "../../../utils/permissionConfig";

export default function PermissionsManagement() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["users-permissions", page, search],
    queryFn: () => getUsers({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const handleManagePermissions = (userId) => {
    navigate(`/users/permissions/${userId}`);
  };

  const handleViewAuditLog = (userId) => {
    // Navigate to audit log page (to be implemented)
    navigate(`/users/permissions/${userId}#audit-log`);
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

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <PageTitle
          title="إدارة صلاحيات المستخدمين"
          subTitle="عرض وتعديل صلاحيات جميع المستخدمين في النظام"
        />
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2">💡 معلومات هامة</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• يمكنك تعديل صلاحيات المستخدمين بناءً على احتياجات العمل</li>
          <li>• كل تغيير في الصلاحيات يتم تسجيله في سجل التدقيق</li>
          <li>• يجب أن تمتلك الصلاحية "users:update:updatePermissions" لتعديل الصلاحيات</li>
          <li>• لا يمكنك منح صلاحية لا تملكها بنفسك (إلا للسوبر أدمن)</li>
        </ul>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="البحث عن مستخدم (الاسم، اسم المستخدم...)..."
          />
        </div>

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الوظيفة</TableHead>
              <TableHead>الوحدة التنظيمية</TableHead>
              <TableHead>عدد الصلاحيات</TableHead>
              <TableHead>الصلاحيات الرئيسية</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.fullNameArabic}</div>
                      <div className="text-sm text-gray-500">{user.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.organizationalUnit?.name || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-lg">
                      {user.permissions?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      {user.permissions && user.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 3).map((perm, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              title={getPermissionLabel(perm.action)}
                            >
                              {perm.action}
                            </span>
                          ))}
                          {user.permissions.length > 3 && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                              +{user.permissions.length - 3} المزيد
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">لا توجد صلاحيات</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleManagePermissions(user._id)}
                        icon={<FaUserShield />}
                      >
                        إدارة الصلاحيات
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewAuditLog(user._id)}
                        icon={<FaHistory />}
                      >
                        السجل
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  لا توجد مستخدمين
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">إجمالي المستخدمين</div>
          <div className="text-3xl font-bold text-blue-600">{data?.total || 0}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">المستخدمون بصلاحيات</div>
          <div className="text-3xl font-bold text-green-600">
            {users.filter(u => u.permissions && u.permissions.length > 0).length}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">المستخدمون بدون صلاحيات</div>
          <div className="text-3xl font-bold text-orange-600">
            {users.filter(u => !u.permissions || u.permissions.length === 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}
