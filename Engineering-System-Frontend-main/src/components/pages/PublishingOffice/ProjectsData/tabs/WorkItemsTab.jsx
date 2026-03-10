import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectData } from "../../../../../api/projectDataAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../ui/Table/Table";
import toast from "react-hot-toast";

export default function WorkItemsTab({ project }) {
  const queryClient = useQueryClient();
  const workItems = project?.workItems || [];

  const [newItem, setNewItem] = useState({
    serial: "",
    desc: "",
    code: "",
    unit: "",
    quantity: "",
    value: "",
    total: "",
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProjectData({ id: project._id, data }),
    onSuccess: () => {
      toast.success("تم تحديث أصناف المشروع");
      queryClient.invalidateQueries(["projectData"]);
      setNewItem({
        serial: "",
        desc: "",
        code: "",
        unit: "",
        quantity: "",
        value: "",
        total: "",
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ");
    },
  });

  const handleAdd = () => {
    if (!newItem.desc) {
      toast.error("وصف البند مطلوب");
      return;
    }
    const updated = [...workItems, { ...newItem }];
    updateMutation.mutate({ workItems: updated });
  };

  const handleDelete = (index) => {
    const updated = workItems.filter((_, i) => i !== index);
    updateMutation.mutate({ workItems: updated });
  };

  const handleItemChange = (field, value) => {
    setNewItem((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "quantity" || field === "value") {
        const qty = parseFloat(updated.quantity) || 0;
        const val = parseFloat(updated.value) || 0;
        updated.total = (qty * val).toString();
      }
      return updated;
    });
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">أصناف المشروع</h3>
      </div>

      {/* Add item form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">إضافة بند جديد</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="الرقم التسلسلي"
            value={newItem.serial}
            onChange={(e) => handleItemChange("serial", e.target.value)}
            placeholder="م"
          />
          <div className="md:col-span-2">
            <Input
              label="الوصف"
              value={newItem.desc}
              onChange={(e) => handleItemChange("desc", e.target.value)}
              placeholder="وصف البند"
            />
          </div>
          <Input
            label="الكود"
            value={newItem.code}
            onChange={(e) => handleItemChange("code", e.target.value)}
            placeholder="الكود"
          />
          <Input
            label="الوحدة"
            value={newItem.unit}
            onChange={(e) => handleItemChange("unit", e.target.value)}
            placeholder="الوحدة"
          />
          <Input
            label="الكمية"
            type="number"
            value={newItem.quantity}
            onChange={(e) => handleItemChange("quantity", e.target.value)}
            placeholder="الكمية"
          />
          <Input
            label="السعر"
            type="number"
            value={newItem.value}
            onChange={(e) => handleItemChange("value", e.target.value)}
            placeholder="السعر"
          />
          <Input
            label="الإجمالي"
            value={newItem.total}
            disabled={true}
            placeholder="الإجمالي"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAdd}
            disabled={updateMutation.isLoading}
            loading={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "جاري الإضافة..." : "إضافة بند"}
          </Button>
        </div>
      </div>

      {/* Work items table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>م</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>الوحدة</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>سعر الوحدة</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead>حذف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                لا توجد أصناف مضافة لهذا المشروع
              </TableCell>
            </TableRow>
          ) : (
            workItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.serial || index + 1}</TableCell>
                <TableCell>{item.desc || "-"}</TableCell>
                <TableCell>{item.code || "-"}</TableCell>
                <TableCell>{item.unit || "-"}</TableCell>
                <TableCell>{item.quantity || "-"}</TableCell>
                <TableCell>{item.value || "-"}</TableCell>
                <TableCell>
                  {item.total
                    ? parseFloat(item.total).toLocaleString("ar-EG")
                    : "-"}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    حذف
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}