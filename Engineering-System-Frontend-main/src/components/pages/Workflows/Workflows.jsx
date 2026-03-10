import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getWorkflows, deleteWorkflow } from "../../../api/workflowsAPI";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Pagination from "../../ui/Pagination/Pagination";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import Modal from "../../ui/Modal/Modal";
import toast from "react-hot-toast";
import CreateWorkflowForm from "./CreateWorkflowForm";
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

export default function Workflows() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const processType = searchParams.get("processType") || "";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const queryClient = useQueryClient();

  // Fetch workflows with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["workflows", page, search, processType],
    queryFn: () => getWorkflows({ page, limit: 10, search, processType }),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("تم حذف سير العمل بنجاح");
      queryClient.invalidateQueries(["workflows"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل حذف سير العمل");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف سير العمل؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ page: "1", search: value, processType });
  };

  const handleTypeChange = (newType) => {
    setSearchParams({ page: "1", search, processType: newType });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), search, processType });
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

  const workflows = data?.data?.workflows || [];
  const totalPages = data?.data?.totalPages || 1;

  const getOverallStatus = (workflow) => {
    if (!workflow.stages || workflow.stages.length === 0) return "waiting";
    const allFulfilled = workflow.stages.every(s => s.stageState === "fulfilled");
    if (allFulfilled) return "fulfilled";
    const hasActive = workflow.stages.some(s => s.stageState === "active");
    if (hasActive) return "active";
    return "waiting";
  };

  return (
    <div>
      <PageTitle title="سير العمل" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="بحث في سير العمل..."
            />
            <input
              type="text"
              value={processType}
              onChange={(e) => handleTypeChange(e.target.value)}
              placeholder="نوع العملية"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <Can action="workflows:create">
            <Button onClick={() => {
              setEditingWorkflow(null);
              setIsCreateModalOpen(true);
            }}>
              إضافة سير عمل جديد
            </Button>
          </Can>
        </div>

        {/* Workflows Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإجراءات</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المراحل</TableHead>
              <TableHead>نوع العملية</TableHead>
              <TableHead>معرف العملية</TableHead>
              <TableHead>الاسم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.length > 0 ? (
              workflows.map((workflow) => {
                const status = getOverallStatus(workflow);
                return (
                  <TableRow key={workflow._id}>
                    <TableCell>
                      <div className="flex gap-2">
                        <Can action="workflows:read">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.location.href = `/workflows/${workflow._id}`}
                          >
                            عرض
                          </Button>
                        </Can>
                        <Can action="workflows:update">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingWorkflow(workflow);
                              setIsCreateModalOpen(true);
                            }}
                          >
                            تعديل
                          </Button>
                        </Can>
                        <Can action="workflows:delete">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(workflow._id)}
                            disabled={deleteMutation.isLoading}
                          >
                            حذف
                          </Button>
                        </Can>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${stateColorMap[status]}`}>
                        {stateLabels[status]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {workflow.metadata?.completedStages || 0}/{workflow.metadata?.totalStages || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{workflow.processType}</TableCell>
                    <TableCell className="text-sm">{workflow.processId}</TableCell>
                    <TableCell className="font-semibold">{workflow.name}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  لا توجد سيريات عمل
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Create/Edit Workflow Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingWorkflow(null);
        }}
        title={editingWorkflow ? "تعديل سير العمل" : "إضافة سير عمل جديد"}
        size="xl"
      >
        <CreateWorkflowForm
          editingWorkflow={editingWorkflow}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setEditingWorkflow(null);
            queryClient.invalidateQueries(["workflows"]);
          }}
        />
      </Modal>
    </div>
  );
}
