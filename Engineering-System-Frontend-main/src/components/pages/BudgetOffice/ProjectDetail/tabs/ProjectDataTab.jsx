import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../ui/Input/Input";
import Button from "../../../../ui/Button/Button";

export default function ProjectDataTab({ statement }) {
  const navigate = useNavigate();
  const projectData = statement?.projectData || {};

  const handleNewStatement = () => {
    // Navigate to new statement registration page
    navigate("/budget-office/statements/new", { 
      state: { projectId: statement?.project?._id || statement?.project }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">بيانات المشروع</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="رقم المشروع"
            value={projectData.projectNumber || ""}
            readOnly
          />
          <Input
            label="كود نوع المشروع"
            value={projectData.projectTypeCode || ""}
            readOnly
          />
          <Input
            label="العام المالي"
            value={projectData.financialYear || ""}
            readOnly
          />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Input
          label="اسم المشروع"
          value={projectData.projectName || ""}
          readOnly
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="تاريخ بداية المشروع"
          type="date"
          value={projectData.projectStartDate ? new Date(projectData.projectStartDate).toISOString().split('T')[0] : ""}
          readOnly
        />
        <Input
          label="تاريخ نهاية المشروع"
          type="date"
          value={projectData.projectEndDate ? new Date(projectData.projectEndDate).toISOString().split('T')[0] : ""}
          readOnly
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Input
          label="الاتفاق/العقد"
          value={projectData.agreementContract || ""}
          readOnly
        />
        <Input
          label="جهة التمويل"
          value={projectData.fundingSource || ""}
          readOnly
        />
        <Input
          label="الجهة المستفيدة"
          value={projectData.beneficiaryEntity || ""}
          readOnly
        />
        <Input
          label="الفرع المسئول"
          value={projectData.responsibleBranch || ""}
          readOnly
        />
        <Input
          label="المشروع الرئيسي"
          value={projectData.mainProject || ""}
          readOnly
        />
        <Input
          label="كود الشركة"
          value={projectData.companyCode || ""}
          readOnly
        />
      </div>
      <Button onClick={handleNewStatement} variant="primary">
        تسجيل بيان جديد
      </Button>
    </div>
  );
}
