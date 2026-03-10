import React from "react";
import Input from "../../../ui/Input/Input";

export default function ProjectOverviewTab({ project }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات المشروع</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كود المشروع</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.projectCode || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">السنة المالية</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.financialYear || "-"}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المشروع</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.projectName || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع المشروع</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.projectType || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">طريقة التعاقد</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.contractingMethod || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الإصدار</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.issueDate ? new Date(project.issueDate).toLocaleDateString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الخروج للموقع</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.siteExitDate ? new Date(project.siteExitDate).toLocaleDateString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء الفعلي</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.actualStartDate ? new Date(project.actualStartDate).toLocaleDateString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء الفعلي</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.actualEndDate ? new Date(project.actualEndDate).toLocaleDateString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">جهة المالك</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.ownerEntity || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة المقدرة</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.estimatedCost ? project.estimatedCost.toLocaleString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نسبة التكلفة</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.costPercentage ? `${project.costPercentage}%` : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كود الخزانة</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.treasuryCode || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الفرع المسؤول</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.responsibleBranch || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الشركة</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.company || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الموظف المسؤول</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.responsibleEmployee || "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الافتتاح</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.openingDate ? new Date(project.openingDate).toLocaleDateString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النشر</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.publicationDate ? new Date(project.publicationDate).toLocaleDateString('ar-EG') : "-"}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المشروع الرئيسي</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.mainProject || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
