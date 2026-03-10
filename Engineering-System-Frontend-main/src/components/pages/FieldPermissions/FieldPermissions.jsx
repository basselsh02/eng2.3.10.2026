import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFieldPermissions,
  getResources,
  updateFieldPermission,
  bulkUpdateRolePermissions,
  resetFieldPermissions,
} from "../../../api/fieldPermissionsAPI";
import toast from "react-hot-toast";
import Button from "../../ui/Button/Button";

const ROLES = ["SUPER_ADMIN", "مكتب", "مدير", "رئيس فرع", "مدير الادارة"];
const PERMISSION_TYPES = ["READ", "WRITE", "UPDATE"];

export default function FieldPermissions() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState("مكتب");
  const [selectedResource, setSelectedResource] = useState("all");
  const [selectedPermissionType, setSelectedPermissionType] = useState("all");
  const [expandedResources, setExpandedResources] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch resources
  const { data: resourcesData } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  // Fetch permissions
  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ["fieldPermissions", selectedRole, selectedResource, selectedPermissionType],
    queryFn: () =>
      getAllFieldPermissions({
        role: selectedRole,
        resource: selectedResource !== "all" ? selectedResource : undefined,
        permissionType: selectedPermissionType !== "all" ? selectedPermissionType : undefined,
      }),
  });

  // Update permission mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, allowed }) => updateFieldPermission(id, allowed),
    onSuccess: () => {
      queryClient.invalidateQueries(["fieldPermissions"]);
      toast.success("تم تحديث الصلاحية بنجاح");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل تحديث الصلاحية");
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ role, resource, permissionType, allowed }) =>
      bulkUpdateRolePermissions(role, { resource, permissionType, allowed }),
    onSuccess: () => {
      queryClient.invalidateQueries(["fieldPermissions"]);
      toast.success("تم تحديث الصلاحيات بنجاح");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل تحديث الصلاحيات");
    },
  });

  // Reset mutation
  const resetMutation = useMutation({
    mutationFn: ({ role, resource }) => resetFieldPermissions({ role, resource }),
    onSuccess: () => {
      queryClient.invalidateQueries(["fieldPermissions"]);
      toast.success("تم إعادة تعيين الصلاحيات بنجاح");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل إعادة تعيين الصلاحيات");
    },
  });

  // Toggle permission
  const handleTogglePermission = (permission) => {
    updateMutation.mutate({
      id: permission._id,
      allowed: !permission.allowed,
    });
  };

  // Toggle resource expansion
  const toggleResourceExpansion = (resource) => {
    setExpandedResources((prev) => ({
      ...prev,
      [resource]: !prev[resource],
    }));
  };

  // Bulk enable/disable for current filters
  const handleBulkUpdate = (allowed) => {
    if (!window.confirm(`هل أنت متأكد من ${allowed ? "تفعيل" : "تعطيل"} جميع الصلاحيات المفلترة؟`)) {
      return;
    }

    bulkUpdateMutation.mutate({
      role: selectedRole,
      resource: selectedResource !== "all" ? selectedResource : undefined,
      permissionType: selectedPermissionType !== "all" ? selectedPermissionType : undefined,
      allowed,
    });
  };

  // Reset to default
  const handleReset = () => {
    if (!window.confirm("هل أنت متأكد من إعادة تعيين جميع الصلاحيات إلى الوضع الافتراضي؟")) {
      return;
    }

    resetMutation.mutate({
      role: selectedRole,
      resource: selectedResource !== "all" ? selectedResource : undefined,
    });
  };

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    if (!permissionsData?.data) return {};

    const filtered = permissionsData.data.filter((perm) => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          perm.resource.toLowerCase().includes(search) ||
          perm.fieldName.toLowerCase().includes(search)
        );
      }
      return true;
    });

    return filtered.reduce((acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = [];
      }
      acc[perm.resource].push(perm);
      return acc;
    }, {});
  }, [permissionsData, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!permissionsData?.data) return { total: 0, allowed: 0, denied: 0 };

    const total = permissionsData.data.length;
    const allowed = permissionsData.data.filter((p) => p.allowed).length;
    const denied = total - allowed;

    return { total, allowed, denied };
  }, [permissionsData]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">صلاحيات الحقول</h1>
        <p className="text-gray-600">
          إدارة صلاحيات الوصول إلى الحقول لكل دور على مستوى الحقل الفردي
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">إجمالي الصلاحيات</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">مفعّلة</p>
          <p className="text-2xl font-bold text-green-600">{stats.allowed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">معطّلة</p>
          <p className="text-2xl font-bold text-red-600">{stats.denied}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المورد</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              {resourcesData?.data?.map((res) => (
                <option key={res.resource} value={res.resource}>
                  {res.resource} ({res.fieldCount} حقل)
                </option>
              ))}
            </select>
          </div>

          {/* Permission Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الصلاحية</label>
            <select
              value={selectedPermissionType}
              onChange={(e) => setSelectedPermissionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              {PERMISSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">بحث</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مورد أو حقل..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <Button
            onClick={() => handleBulkUpdate(true)}
            disabled={bulkUpdateMutation.isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            تفعيل الكل
          </Button>
          <Button
            onClick={() => handleBulkUpdate(false)}
            disabled={bulkUpdateMutation.isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            تعطيل الكل
          </Button>
          <Button
            onClick={handleReset}
            disabled={resetMutation.isLoading}
            className="bg-gray-600 hover:bg-gray-700"
          >
            إعادة تعيين إلى الافتراضي
          </Button>
        </div>
      </div>

      {/* Permissions List */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جارٍ التحميل...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([resource, permissions]) => (
            <div key={resource} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Resource Header */}
              <button
                onClick={() => toggleResourceExpansion(resource)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">{resource}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {permissions.length} صلاحية
                  </span>
                </div>
                <span className="text-gray-500">
                  {expandedResources[resource] ? "▼" : "◀"}
                </span>
              </button>

              {/* Permissions Table */}
              {expandedResources[resource] && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          الحقل
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          نوع الصلاحية
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          الدور
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          الإجراء
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {permissions.map((permission) => (
                        <tr key={permission._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {permission.fieldName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                permission.permissionType === "READ"
                                  ? "bg-blue-100 text-blue-800"
                                  : permission.permissionType === "WRITE"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {permission.permissionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {permission.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                permission.allowed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {permission.allowed ? "مفعّل" : "معطّل"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleTogglePermission(permission)}
                              disabled={updateMutation.isLoading}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                permission.allowed
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {permission.allowed ? "تعطيل" : "تفعيل"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {Object.keys(groupedPermissions).length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">لا توجد صلاحيات مطابقة للفلاتر المحددة</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
