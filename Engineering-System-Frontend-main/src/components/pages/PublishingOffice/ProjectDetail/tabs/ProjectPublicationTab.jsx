import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectPublication } from "../../../../../api/projectPublicationAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import toast from "react-hot-toast";

export default function ProjectPublicationTab({ project }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(project);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => updateProjectPublication({ id: project._id, data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المشروع بنجاح");
      queryClient.invalidateQueries(["projectPublicationByCode"]);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل التحديث");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(project);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">بيانات المشروع بالنشر</h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="primary">
            تعديل البيانات
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="كود المشروع"
              name="projectCode"
              value={formData.projectCode}
              onChange={handleInputChange}
              disabled={true}
            />
            <Input
              label="السنة المالية"
              name="financialYear"
              value={formData.financialYear || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="نوع المشروع"
              name="projectType"
              value={formData.projectType || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <Input
            label="طريقة التعاقد"
            name="contractingMethod"
            value={formData.contractingMethod || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="التكلفة المقدرة"
            name="estimatedCost"
            type="number"
            value={formData.estimatedCost || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="نسبة التكلفة %"
            name="costPercentage"
            type="number"
            value={formData.costPercentage || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="الجهة المالكة"
            name="ownerEntity"
            value={formData.ownerEntity || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="كود الخزانة"
            name="treasuryCode"
            value={formData.treasuryCode || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="الفرع المسؤول"
            name="responsibleBranch"
            value={formData.responsibleBranch || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="الشركة"
            name="company"
            value={formData.company || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="الموظف المسؤول"
            name="responsibleEmployee"
            value={formData.responsibleEmployee || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="تاريخ الإصدار"
            name="issueDate"
            type="date"
            value={formData.issueDate ? formData.issueDate.split('T')[0] : ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="تاريخ الخروج للموقع"
            name="siteExitDate"
            type="date"
            value={formData.siteExitDate ? formData.siteExitDate.split('T')[0] : ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="تاريخ البدء الفعلي"
            name="actualStartDate"
            type="date"
            value={formData.actualStartDate ? formData.actualStartDate.split('T')[0] : ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="تاريخ الانتهاء الفعلي"
            name="actualEndDate"
            type="date"
            value={formData.actualEndDate ? formData.actualEndDate.split('T')[0] : ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="تاريخ الفتح"
            name="openingDate"
            type="date"
            value={formData.openingDate ? formData.openingDate.split('T')[0] : ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="تاريخ النشر"
            name="publicationDate"
            type="date"
            value={formData.publicationDate ? formData.publicationDate.split('T')[0] : ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <div className="md:col-span-2">
            <Input
              label="اسم المشروع"
              name="projectName"
              value={formData.projectName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="المشروع الرئيسي"
              name="mainProject"
              value={formData.mainProject || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" loading={updateMutation.isLoading}>
              حفظ التغييرات
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
