import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createWorkflow, updateWorkflow } from "../../../api/workflowsAPI";
import { getOfficesDropdown } from "../../../api/officesAPI";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";
import Loading from "../../common/Loading/Loading";

export default function CreateWorkflowForm({ editingWorkflow, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    processId: "",
    processType: "",
    description: "",
    stages: []
  });

  const [errors, setErrors] = useState({});
  const [stageErrors, setStageErrors] = useState({});

  // Fetch offices dropdown
  const { data: officesData, isLoading: officesLoading } = useQuery({
    queryKey: ["offices-dropdown"],
    queryFn: () => getOfficesDropdown()
  });

  useEffect(() => {
    if (editingWorkflow) {
      setFormData({
        name: editingWorkflow.name || "",
        processId: editingWorkflow.processId || "",
        processType: editingWorkflow.processType || "",
        description: editingWorkflow.description || "",
        stages: (editingWorkflow.stages || []).map(s => ({
          office: s.office?._id || s.office || "",
          stageNumber: s.stageNumber || 0,
          stageState: s.stageState || "waiting",
          notes: s.notes || "",
          assignmentMode: s.assignmentMode || "manager_assigns",
          rememberAssignee: s.rememberAssignee || false
        }))
      });
    }
  }, [editingWorkflow]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      toast.success("تم إنشاء سير العمل بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "فشل إنشاء سير العمل";
      toast.error(message);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("تم تحديث سير العمل بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "فشل تحديث سير العمل";
      toast.error(message);
    }
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleStageChange = (index, field, value) => {
    const newStages = [...formData.stages];
    newStages[index] = {
      ...newStages[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      stages: newStages
    }));
    if (stageErrors[index]) {
      setStageErrors(prev => ({
        ...prev,
        [index]: null
      }));
    }
  };

  const addStage = () => {
    const newStageNumber = formData.stages.length > 0
      ? Math.max(...formData.stages.map(s => s.stageNumber || 0)) + 1
      : 1;

    setFormData(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          office: "",
          stageNumber: newStageNumber,
          stageState: "waiting",
          notes: "",
          assignmentMode: "manager_assigns",
          rememberAssignee: false
        }
      ]
    }));
  };

  const removeStage = (index) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = "اسم سير العمل مطلوب";
    if (!formData.processId) newErrors.processId = "معرف العملية مطلوب";
    if (!formData.processType) newErrors.processType = "نوع العملية مطلوب";
    
    if (formData.stages.length === 0) {
      newErrors.stages = "يجب إضافة مرحلة واحدة على الأقل";
    }

    const newStageErrors = {};
    formData.stages.forEach((stage, index) => {
      if (!stage.office) {
        newStageErrors[index] = "يجب اختيار مكتب/كتيبة";
      }
    });

    // Check for duplicate stage numbers
    const stageNumbers = formData.stages.map(s => s.stageNumber);
    const uniqueNumbers = new Set(stageNumbers);
    if (stageNumbers.length !== uniqueNumbers.size) {
      newErrors.stages = "لا يمكن أن تكون هناك مراحل بنفس الرقم";
    }

    setErrors(newErrors);
    setStageErrors(newStageErrors);

    return Object.keys(newErrors).length === 0 && Object.keys(newStageErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingWorkflow) {
      updateMutation.mutate({
        id: editingWorkflow._id,
        ...formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading || officesLoading;
  const offices = officesData?.data || [];

  if (officesLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">معلومات سير العمل</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="أدخل اسم سير العمل"
              error={errors.name}
            />
          </div>

          {/* Process ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              معرف العملية *
            </label>
            <Input
              type="text"
              name="processId"
              value={formData.processId}
              onChange={handleFieldChange}
              placeholder="أدخل معرف العملية"
              error={errors.processId}
              disabled={editingWorkflow}
            />
          </div>

          {/* Process Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع العملية *
            </label>
            <Input
              type="text"
              name="processType"
              value={formData.processType}
              onChange={handleFieldChange}
              placeholder="أدخل نوع العملية"
              error={errors.processType}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFieldChange}
              placeholder="أدخل وصف سير العمل"
            />
          </div>
        </div>
      </div>

      {/* Stages Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">المراحل</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addStage}
          >
            + إضافة مرحلة
          </Button>
        </div>

        {errors.stages && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {errors.stages}
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
          {formData.stages.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              لم تتم إضافة أي مراحل. اضغط على "إضافة مرحلة" للبدء.
            </p>
          ) : (
            formData.stages.map((stage, index) => (
              <div key={index} className="bg-white p-4 rounded border border-gray-200 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-900">المرحلة {index + 1}</h4>
                  {formData.stages.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeStage(index)}
                    >
                      حذف
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Office */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المكتب/الكتيبة *
                    </label>
                    <select
                      value={stage.office}
                      onChange={(e) => handleStageChange(index, "office", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        stageErrors[index]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">اختر مكتب/كتيبة</option>
                      {offices.map((office) => (
                        <option key={office._id} value={office._id}>
                          {office.name} ({office.code})
                        </option>
                      ))}
                    </select>
                    {stageErrors[index] && (
                      <p className="text-red-500 text-xs mt-1">{stageErrors[index]}</p>
                    )}
                  </div>

                  {/* Stage Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم المرحلة
                    </label>
                    <Input
                      type="number"
                      value={stage.stageNumber}
                      onChange={(e) => handleStageChange(index, "stageNumber", parseInt(e.target.value))}
                      placeholder="رقم المرحلة"
                      min="1"
                    />
                  </div>

                  {/* Stage State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحالة
                    </label>
                    <select
                      value={stage.stageState}
                      onChange={(e) => handleStageChange(index, "stageState", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={editingWorkflow}
                    >
                      <option value="waiting">في الانتظار</option>
                      <option value="active">نشط</option>
                      <option value="fulfilled">مكتمل</option>
                      <option value="returned">مرجع</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ملاحظات
                    </label>
                    <Input
                      type="text"
                      value={stage.notes}
                      onChange={(e) => handleStageChange(index, "notes", e.target.value)}
                      placeholder="أضف ملاحظات"
                    />
                  </div>

                  {/* Assignment Mode */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نمط التعيين
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`assignmentMode-${index}`}
                          value="manager_assigns"
                          checked={stage.assignmentMode === "manager_assigns"}
                          onChange={(e) => handleStageChange(index, "assignmentMode", e.target.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">تعيين المدير</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`assignmentMode-${index}`}
                          value="all_employees"
                          checked={stage.assignmentMode === "all_employees"}
                          onChange={(e) => handleStageChange(index, "assignmentMode", e.target.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">جميع الموظفين</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`assignmentMode-${index}`}
                          value="manager_only"
                          checked={stage.assignmentMode === "manager_only"}
                          onChange={(e) => handleStageChange(index, "assignmentMode", e.target.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">المدير فقط</span>
                      </label>
                    </div>
                  </div>

                  {/* Remember Assignee */}
                  <div className="col-span-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stage.rememberAssignee || false}
                        onChange={(e) => handleStageChange(index, "rememberAssignee", e.target.checked)}
                        className="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        تذكر الموظف المعين (إعادة التعيين التلقائي للموظف السابق)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mr-6 mt-1">
                      عند التفعيل، سيتم تعيين المهمة تلقائياً للموظف الذي تعامل مع نفس نوع المهمة سابقاً في هذا المكتب
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "جاري..." : editingWorkflow ? "تحديث سير العمل" : "إنشاء سير العمل"}
        </Button>
      </div>
    </form>
  );
}
