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

export default function ProjectConditionsTab({ project }) {
  const queryClient = useQueryClient();
  const conditions = project?.projectConditions || [];

  const [registerForm, setRegisterForm] = useState({
    conditionTypeCode: "",
    conditionTypeName: "",
    serialCode: "",
    conditionDesc: "",
    value: "",
    order: "",
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProjectData({ id: project._id, data }),
    onSuccess: () => {
      toast.success("تم تسجيل شرط المشروع بنجاح");
      queryClient.invalidateQueries(["projectData"]);
      setRegisterForm({
        conditionTypeCode: "",
        conditionTypeName: "",
        serialCode: "",
        conditionDesc: "",
        value: "",
        order: "",
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ");
    },
  });

  const handleRegister = () => {
    if (!registerForm.conditionTypeCode) {
      toast.error("كود نوع الشرط مطلوب");
      return;
    }
    const updatedConditions = [...conditions, { ...registerForm }];
    updateMutation.mutate({ projectConditions: updatedConditions });
  };

  const handleDelete = (index) => {
    const updated = conditions.filter((_, i) => i !== index);
    updateMutation.mutate({ projectConditions: updated });
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">شروط المشروع</h3>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            تحميل شروط المذكرة
          </Button>
          <Button
            onClick={handleRegister}
            disabled={updateMutation.isLoading}
            loading={updateMutation.isLoading}
          >
            تسجيل شروط النشر
          </Button>
        </div>
      </div>

      {/* Project code display */}
      <div className="mb-6">
        <Input
          label="كود المشروع"
          value={project?.projectCode || ""}
          disabled={true}
        />
      </div>

      {/* Add condition form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">إضافة شرط جديد</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="كود نوع الشرط"
            value={registerForm.conditionTypeCode}
            onChange={(e) =>
              setRegisterForm((p) => ({ ...p, conditionTypeCode: e.target.value }))
            }
            placeholder="الكود"
          />
          <Input
            label="اسم نوع الشرط"
            value={registerForm.conditionTypeName}
            onChange={(e) =>
              setRegisterForm((p) => ({ ...p, conditionTypeName: e.target.value }))
            }
            placeholder="الاسم"
          />
          <Input
            label="مسلسل/ الكود"
            value={registerForm.serialCode}
            onChange={(e) =>
              setRegisterForm((p) => ({ ...p, serialCode: e.target.value }))
            }
            placeholder="الرقم التسلسلي"
          />
          <div className="md:col-span-2">
            <Input
              label="وصف الشرط"
              value={registerForm.conditionDesc}
              onChange={(e) =>
                setRegisterForm((p) => ({ ...p, conditionDesc: e.target.value }))
              }
              placeholder="وصف الشرط"
            />
          </div>
          <Input
            label="القيمة"
            value={registerForm.value}
            onChange={(e) =>
              setRegisterForm((p) => ({ ...p, value: e.target.value }))
            }
            placeholder="القيمة"
          />
        </div>
      </div>

      {/* Conditions table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ترتيب الشروط</TableHead>
            <TableHead>كود نوع الشرط</TableHead>
            <TableHead>اسم نوع الشرط</TableHead>
            <TableHead>مسلسل/ الكود</TableHead>
            <TableHead>وصف الشرط</TableHead>
            <TableHead>القيمة</TableHead>
            <TableHead>حذف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conditions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد شروط مضافة
              </TableCell>
            </TableRow>
          ) : (
            conditions.map((cond, index) => (
              <TableRow key={index}>
                <TableCell>{cond.order || index + 1}</TableCell>
                <TableCell>{cond.conditionTypeCode || "-"}</TableCell>
                <TableCell>{cond.conditionTypeName || "-"}</TableCell>
                <TableCell>{cond.serialCode || "-"}</TableCell>
                <TableCell>{cond.conditionDesc || "-"}</TableCell>
                <TableCell>{cond.value || "-"}</TableCell>
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