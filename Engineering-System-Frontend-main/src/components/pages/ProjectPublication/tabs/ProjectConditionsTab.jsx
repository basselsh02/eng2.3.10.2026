import React from "react";

export default function ProjectConditionsTab({ project }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">شروط المشروع</h3>
      
      <div className="bg-gray-50 border border-gray-300 rounded-md p-6">
        <p className="text-sm text-gray-700">
          لا توجد شروط محددة لهذا المشروع حالياً.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          يمكن إضافة الشروط من خلال واجهة التعديل.
        </p>
      </div>
    </div>
  );
}
