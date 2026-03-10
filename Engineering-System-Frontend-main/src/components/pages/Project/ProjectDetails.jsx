import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../../api/projectAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Loading from "../../common/Loading/Loading";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["project-detail", id],
    queryFn: () => getProjectById(id),
    enabled: !!id
  });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          العودة
        </Button>
      </div>
    );
  }

  const project = data?.data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6 mb-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <PageTitle 
              title="الصفحة التفصيلية للمشروع" 
              subtitle={`كود المشروع: ${project.projectCode}`}
            />
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              العودة للقائمة
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center border-b pb-4">
              معلومات المشروع الأساسية
            </h2>

            {/* 4 Fields Form */}
            <div className="space-y-6">
              {/* Field 1: Project Code */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg border-r-4 border-primary-600">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  1. كود المشروع
                </label>
                <Input
                  value={project.projectCode || "غير محدد"}
                  readOnly
                  className="text-2xl font-bold text-primary-700"
                />
              </div>

              {/* Field 2: Project Name */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-r-4 border-blue-600">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  2. اسم المشروع
                </label>
                <Input
                  value={project.projectName || "غير محدد"}
                  readOnly
                  className="text-xl font-semibold text-blue-700"
                />
              </div>

              {/* Field 3: Project Type */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-r-4 border-green-600">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  3. نوع المشروع
                </label>
                <Input
                  value={project.projectType || "غير محدد"}
                  readOnly
                  className="text-xl font-semibold text-green-700"
                />
              </div>

              {/* Field 4: Estimated Cost */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-r-4 border-purple-600">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  4. التكلفة التقديرية
                </label>
                <div className="flex items-baseline gap-2">
                  <Input
                    value={project.estimatedCost?.toLocaleString("ar-EG") || "0"}
                    readOnly
                    className="text-xl font-semibold text-purple-700"
                  />
                  <span className="text-lg font-medium text-purple-600">جنيه مصري</span>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">السنة المالية:</span>
                  <span className="font-semibold">{project.financialYear || "غير محدد"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">الحالة:</span>
                  <span className={`font-semibold ${
                    project.status === 'completed' ? 'text-green-600' :
                    project.status === 'in_progress' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {project.status === 'completed' ? 'مكتمل' :
                     project.status === 'in_progress' ? 'قيد التنفيذ' : 'تخطيط'}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">جهة التنفيذ:</span>
                  <span className="font-semibold">{project.ownerEntity || "غير محدد"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">الفرع المسئول:</span>
                  <span className="font-semibold">{project.responsibleBranch || "غير محدد"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <Button 
                onClick={() => navigate(`/projects/${id}`)}
                variant="primary"
              >
                عرض التفاصيل الكاملة
              </Button>
              <Button 
                onClick={() => window.print()}
                variant="secondary"
              >
                طباعة الصفحة
              </Button>
<Button 
                onClick={() => navigate(`/projects/${id}`)}
                variant="ghost"
              >
                العودة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}