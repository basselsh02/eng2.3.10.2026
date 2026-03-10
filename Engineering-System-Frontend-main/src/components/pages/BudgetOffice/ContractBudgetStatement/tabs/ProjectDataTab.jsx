import React from "react";
import Input from "../../../../ui/Input/Input";

export default function ProjectDataTab({ statement }) {
  const projectData = statement?.projectData || {};

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">بيانات المشروع</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="اسم الفرع"
          value={projectData.branchName || ""}
          readOnly
        />
        <Input
          label="كود الفرع"
          value={projectData.branchCode || ""}
          readOnly
        />
        <Input
          label="تكلفة المشروع"
          value={projectData.projectCost?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="اسم المشروع"
          value={projectData.projectName || ""}
          readOnly
        />
        <Input
          label="رقم المشروع"
          value={projectData.projectNumber || ""}
          readOnly
        />
        <Input
          label="الفرع المنفذ"
          value={projectData.executingBranch || ""}
          readOnly
        />
        <Input
          label="نوع المشروع"
          value={projectData.projectType || ""}
          readOnly
        />
        <Input
          label="طريقة التعاقد"
          value={projectData.contractingMethod || ""}
          readOnly
        />
        <Input
          label="تاريخ البدء"
          type="date"
          value={projectData.startDate ? new Date(projectData.startDate).toISOString().split('T')[0] : ""}
          readOnly
        />
        <Input
          label="تاريخ الانتهاء"
          type="date"
          value={projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : ""}
          readOnly
        />
      </div>
    </div>
  );
}
