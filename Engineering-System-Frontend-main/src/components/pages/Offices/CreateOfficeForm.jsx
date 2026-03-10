import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { createOffice, updateOffice } from "../../../api/officesAPI";
import { useAuth } from "../../../hooks/useAuth";
import { permissionGroups, scopeOptions } from "../../../utils/permissionConfig";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";

export default function CreateOfficeForm({ editingOffice, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "مكتب",
    description: "",
    managerId: "",
    isActive: true,
    permissions: []
  });

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [errors, setErrors] = useState({});

  // Check if user is privileged (can manage office permissions)
  const isPrivileged = ["SUPER_ADMIN", "مدير", "رئيس فرة", "مدير الادارة"].includes(user?.role);

  useEffect(() => {
    if (editingOffice) {
      setFormData({
        name: editingOffice.name || "",
        code: editingOffice.code || "",
        type: editingOffice.type || "مكتب",
        description: editingOffice.description || "",
        managerId: editingOffice.managerId?._id || "",
        isActive: editingOffice.isActive !== false,
        permissions: editingOffice.permissions || []
      });
    }
  }, [editingOffice]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createOffice,
    onSuccess: () => {
      toast.success("تم إنشاء المكتب/الكتيبة بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "فشل إنشاء المكتب/الكتيبة";
      toast.error(message);
      if (error.response?.data?.data) {
        setErrors(error.response.data.data);
      }
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateOffice,
    onSuccess: () => {
      toast.success("تم تحديث المكتب/الكتيبة بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "فشل تحديث المكتب/الكتيبة";
      toast.error(message);
      if (error.response?.data?.data) {
        setErrors(error.response.data.data);
      }
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.code) {
      toast.error("اسم المكتب والرمز مطلوبان");
      return;
    }

    if (editingOffice) {
      updateMutation.mutate({
        id: editingOffice._id,
        ...formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم المكتب/الكتيبة *
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="أدخل اسم المكتب/الكتيبة"
          error={errors.name}
        />
      </div>

      {/* Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الرمز *
        </label>
        <Input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="أدخل رمز المكتب/الكتيبة"
          error={errors.code}
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          النوع
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="مكتب">مكتب</option>
          <option value="كتيبة">كتيبة</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الوصف
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="أدخل وصف المكتب/الكتيبة"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          نشط
        </label>
      </div>

      {/* Permissions Section (Only for privileged users) */}
      {isPrivileged && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            صلاحيات المكتب
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            الصلاحيات المعينة هنا سيرثها تلقائيًا أي مستخدم من نوع "مكتب" يتبع هذا المكتب
          </p>

          <div className="space-y-3">
            {permissionGroups.map((group) => (
              <div key={group.id} className="border rounded-lg">
                {/* Group Header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedGroups((prev) => ({
                      ...prev,
                      [group.id]: !prev[group.id],
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                >
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{group.label}</p>
                    <p className="text-xs text-gray-600">{group.description}</p>
                  </div>
                  <span className="text-gray-500">
                    {expandedGroups[group.id] ? "▼" : "▶"}
                  </span>
                </button>

                {/* Group Permissions */}
                {expandedGroups[group.id] && (
                  <div className="px-4 py-3 space-y-2 bg-white border-t">
                    {group.permissions.map((perm) => {
                      const action = `${group.prefix}${perm.name}`;
                      const isSelected = formData.permissions?.some(
                        (p) => p.action === action
                      );

                      return (
                        <div key={action} className="flex items-start">
                          <input
                            type="checkbox"
                            id={action}
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  permissions: [
                                    ...prev.permissions,
                                    { action, scope: "ALL", units: [] },
                                  ],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  permissions: prev.permissions.filter(
                                    (p) => p.action !== action
                                  ),
                                }));
                              }
                            }}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={action}
                            className="mr-3 flex-1 text-sm text-gray-700"
                          >
                            <span className="font-medium">{perm.label}</span>
                            <p className="text-xs text-gray-500">
                              {perm.description}
                            </p>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Permissions Summary */}
          {formData.permissions?.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-2">
                الصلاحيات المحددة ({formData.permissions.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.map((perm) => (
                  <span
                    key={perm.action}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {perm.action}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          permissions: prev.permissions.filter(
                            (p) => p.action !== perm.action
                          ),
                        }));
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "جاري..." : editingOffice ? "تحديث" : "إنشاء"}
        </Button>
      </div>
    </form>
  );
}
