import React from "react";

export default function ClassifyProjectTab({ project }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">تصنيف المشروع</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">المشروع الرئيسي</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
            {project.mainProject || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
