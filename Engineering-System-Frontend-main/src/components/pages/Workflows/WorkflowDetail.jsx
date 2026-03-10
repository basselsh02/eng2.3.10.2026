import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkflowById, updateStageState, returnStage } from "../../../api/workflowsAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import toast from "react-hot-toast";
import Can from "../../common/Can/Can";

const stateColorMap = {
  waiting: "bg-gray-100 text-gray-800",
  active: "bg-blue-100 text-blue-800",
  fulfilled: "bg-green-100 text-green-800",
  returned: "bg-red-100 text-red-800"
};

const stateLabels = {
  waiting: "في الانتظار",
  active: "نشط",
  fulfilled: "مكتمل",
  returned: "مرجع"
};

export default function WorkflowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedStage, setSelectedStage] = useState(null);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [newState, setNewState] = useState("active");
  const [stateNotes, setStateNotes] = useState("");

  // Fetch workflow details
  const { data, isLoading, error } = useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflowById(id)
  });

  // Update stage state mutation
  const updateStateMutation = useMutation({
    mutationFn: ({ stageNumber, stageState, notes }) =>
      updateStageState({ id, stageNumber, stageState, notes }),
    onSuccess: () => {
      toast.success("تم تحديث حالة المرحلة بنجاح");
      setIsStateModalOpen(false);
      setSelectedStage(null);
      setNewState("active");
      setStateNotes("");
      queryClient.invalidateQueries(["workflow", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل تحديث حالة المرحلة");
    }
  });

  // Return stage mutation
  const returnStageMutation = useMutation({
    mutationFn: ({ stageNumber, notes }) =>
      returnStage({ id, stageNumber, notes }),
    onSuccess: () => {
      toast.success("تم إرجاع المرحلة بنجاح");
      queryClient.invalidateQueries(["workflow", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل إرجاع المرحلة");
    }
  });

  const handleStateChange = (stage) => {
    setSelectedStage(stage);
    setNewState("active");
    setStateNotes("");
    setIsStateModalOpen(true);
  };

  const handleStateSubmit = () => {
    if (!selectedStage) return;

    updateStateMutation.mutate({
      stageNumber: selectedStage.stageNumber,
      stageState: newState,
      notes: stateNotes
    });
  };

  const handleReturnStage = (stage) => {
    if (!window.confirm("هل تريد إرجاع هذه المرحلة؟")) return;

    returnStageMutation.mutate({
      stageNumber: stage.stageNumber,
      notes: ""
    });
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
      </div>
    );
  }

  const workflow = data?.data;

  if (!workflow) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">سير العمل غير موجود</p>
      </div>
    );
  }

  const stages = workflow.stages || [];
  const sortedStages = [...stages].sort((a, b) => a.stageNumber - b.stageNumber);

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => navigate(-1)} variant="secondary">
          ← رجوع
        </Button>
      </div>

      <PageTitle title={workflow.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Information */}
        <div className="lg:col-span-3 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات سير العمل</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">معرف العملية</p>
              <p className="font-semibold text-gray-900">{workflow.processId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">نوع العملية</p>
              <p className="font-semibold text-gray-900">{workflow.processType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">عدد المراحل</p>
              <p className="font-semibold text-gray-900">{workflow.metadata?.totalStages || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">المراحل المكتملة</p>
              <p className="font-semibold text-gray-900">{workflow.metadata?.completedStages || 0}</p>
            </div>
          </div>
          {workflow.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">الوصف</p>
              <p className="text-gray-900">{workflow.description}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="lg:col-span-3 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">التقدم الإجمالي</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{
                width: `${workflow.metadata?.totalStages > 0
                  ? (workflow.metadata?.completedStages / workflow.metadata?.totalStages) * 100
                  : 0
                }%`
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {workflow.metadata?.completedStages}/{workflow.metadata?.totalStages} مرحلة مكتملة
          </p>
        </div>

        {/* Stages Timeline */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المراحل</h2>
          <div className="space-y-4">
            {sortedStages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد مراحل</p>
            ) : (
              sortedStages.map((stage, index) => (
                <div key={index} className="bg-white border-l-4 border-blue-500 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        المرحلة {stage.stageNumber}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {stage.office?.name || "مكتب غير معروف"} ({stage.office?.code || "-"})
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${stateColorMap[stage.stageState]}`}>
                      {stateLabels[stage.stageState]}
                    </span>
                  </div>

                  {stage.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
                      <p className="font-semibold mb-1">ملاحظات:</p>
                      <p>{stage.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-600">عدد الإرجاعات</p>
                      <p className="font-semibold text-gray-900">{stage.numberOfReturns || 0}</p>
                    </div>
                    {stage.lastStateChangeAt && (
                      <div>
                        <p className="text-gray-600">آخر تحديث</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(stage.lastStateChangeAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {stage.stageState !== "fulfilled" && (
                      <Can action="workflows:update">
                        <Button
                          size="sm"
                          onClick={() => handleStateChange(stage)}
                          disabled={updateStateMutation.isLoading}
                        >
                          تحديث الحالة
                        </Button>
                      </Can>
                    )}

                    {stage.stageState !== "returned" && stage.stageState !== "waiting" && (
                      <Can action="workflows:update">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReturnStage(stage)}
                          disabled={returnStageMutation.isLoading}
                        >
                          إرجاع المرحلة
                        </Button>
                      </Can>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* State Change Modal */}
      <Modal
        isOpen={isStateModalOpen}
        onClose={() => {
          setIsStateModalOpen(false);
          setSelectedStage(null);
        }}
        title={`تحديث حالة المرحلة ${selectedStage?.stageNumber}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة الجديدة
            </label>
            <select
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="waiting">في الانتظار</option>
              <option value="active">نشط</option>
              <option value="fulfilled">مكتمل</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={stateNotes}
              onChange={(e) => setStateNotes(e.target.value)}
              placeholder="أضف ملاحظات عن هذا التغيير"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsStateModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleStateSubmit}
              disabled={updateStateMutation.isLoading}
            >
              {updateStateMutation.isLoading ? "جاري..." : "تحديث"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
