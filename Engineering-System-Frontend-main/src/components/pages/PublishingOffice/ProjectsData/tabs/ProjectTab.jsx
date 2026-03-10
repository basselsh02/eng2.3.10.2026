import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectData } from "../../../../../api/projectDataAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import toast from "react-hot-toast";

export default function ProjectTab({ project }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    projectCode: project?.projectCode || "",
    financialYear: project?.financialYear || "",
    projectType: project?.projectType || "",
    projectName: project?.projectName || "",
    contractingMethod: project?.contractingMethod || "",
    issueDate: project?.issueDate
      ? new Date(project.issueDate).toISOString().split("T")[0]
      : "",
    siteExitDate: project?.siteExitDate
      ? new Date(project.siteExitDate).toISOString().split("T")[0]
      : "",
    actualStartDate: project?.actualStartDate
      ? new Date(project.actualStartDate).toISOString().split("T")[0]
      : "",
    actualEndDate: project?.actualEndDate
      ? new Date(project.actualEndDate).toISOString().split("T")[0]
      : "",
    ownerEntity: project?.ownerEntity || "",
    estimatedCost: project?.estimatedCost || "",
    costPercentage: project?.costPercentage || "",
    treasuryCode: project?.treasuryCode || "",
    responsibleBranch: project?.responsibleBranch || "",
    company: project?.company || "",
    responsibleEmployee: project?.responsibleEmployee || "",
    openingDate: project?.openingDate
      ? new Date(project.openingDate).toISOString().split("T")[0]
      : "",
    publicationDate: project?.publicationDate
      ? new Date(project.publicationDate).toISOString().split("T")[0]
      : "",
    mainProject: project?.mainProject || "",
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProjectData({ id: project._id, data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المشروع بنجاح");
      queryClient.invalidateQueries(["projectData"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">بيانات المشروع</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isLoading}
            loading={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="كود المشروع"
          name="projectCode"
          value={formData.projectCode}
          onChange={handleChange}
          disabled={true}
        />
        <Input
          label="نوع المشروع"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
        />
        <Input
          label="العام المالي"
          name="financialYear"
          value={formData.financialYear}
          onChange={handleChange}
        />

        <div className="md:col-span-3">
          <Input
            label="اسم المشروع"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
          />
        </div>

        <Input
          label="تاريخ ورود الكارت"
          name="issueDate"
          type="date"
          value={formData.issueDate}
          onChange={handleChange}
        />
        <Input
          label="تاريخ الاصدار"
          name="siteExitDate"
          type="date"
          value={formData.siteExitDate}
          onChange={handleChange}
        />
        <Input
          label="اسلوب النشر والتعاقد"
          name="contractingMethod"
          value={formData.contractingMethod}
          onChange={handleChange}
        />
        <Input
          label="تاريخ البداية الفعلي"
          name="actualStartDate"
          type="date"
          value={formData.actualStartDate}
          onChange={handleChange}
        />
        <Input
          label="تاريخ النهاية الفعلي"
          name="actualEndDate"
          type="date"
          value={formData.actualEndDate}
          onChange={handleChange}
        />
        <Button variant="secondary" size="sm">
          تسجيل جهة جديدة
        </Button>
        <div className="md:col-span-3">
          <Input
            label="الجهة الطالبة"
            name="ownerEntity"
            value={formData.ownerEntity}
            onChange={handleChange}
          />
        </div>

        <Input
          label="التكلفة التقديرية"
          name="estimatedCost"
          type="number"
          value={formData.estimatedCost}
          onChange={handleChange}
        />
        <Input
          label="نسبة العلاوة"
          name="costPercentage"
          type="number"
          value={formData.costPercentage}
          onChange={handleChange}
        />
        <Input
          label="رقم مذكرة الفرع المالي"
          name="treasuryCode"
          value={formData.treasuryCode}
          onChange={handleChange}
        />
        <Input
          label="الفرع المسؤل"
          name="responsibleBranch"
          value={formData.responsibleBranch}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <Input
            label="الشركة"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <Input
          label="تاريخ النشر"
          name="publicationDate"
          type="date"
          value={formData.publicationDate}
          onChange={handleChange}
        />
        <Input
          label="تاريخ الفتح الفعلي"
          name="openingDate"
          type="date"
          value={formData.openingDate}
          onChange={handleChange}
        />
        <Input
          label="الموظف المسؤل"
          name="responsibleEmployee"
          value={formData.responsibleEmployee}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <Input
            label="المشروع الرئيسي"
            name="mainProject"
            value={formData.mainProject}
            onChange={handleChange}
          />
        </div>
        <Button variant="secondary" size="sm">
          طباعة تقرير اللجان
        </Button>
      </div>
    </div>
  );
}