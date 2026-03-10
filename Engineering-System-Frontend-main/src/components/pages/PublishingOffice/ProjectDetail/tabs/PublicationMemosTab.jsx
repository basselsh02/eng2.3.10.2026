import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicationMemos, createPublicationMemo, deletePublicationMemo } from "../../../../../api/publicationMemosAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";
import Modal from "../../../../ui/Modal/Modal";
import Loading from "../../../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function PublicationMemosTab({ projectCode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  // Fetch publication memos for this project
  const { data, isLoading } = useQuery({
    queryKey: ["publicationMemos", projectCode],
    queryFn: () => getPublicationMemos({ projectNumber: projectCode, limit: 100 }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPublicationMemo,
    onSuccess: () => {
      toast.success("تم إضافة مذكرة النشر بنجاح");
      queryClient.invalidateQueries(["publicationMemos"]);
      setIsModalOpen(false);
      setFormData({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت الإضافة");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePublicationMemo,
    onSuccess: () => {
      toast.success("تم حذف مذكرة النشر بنجاح");
      queryClient.invalidateQueries(["publicationMemos"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل الحذف");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, projectNumber: projectCode });
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف مذكرة النشر؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;

  const memos = data?.data?.publicationMemos || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">طباعة مذكرات النشر</h3>
        <Button onClick={handleAdd} variant="primary">
          + إضافة مذكرة نشر
        </Button>
      </div>

      {/* Publication Memos Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الإجراءات</TableHead>
            <TableHead>إجراء الطباعة</TableHead>
            <TableHead>اسم الفرع المنفذ</TableHead>
            <TableHead>كود الفرع</TableHead>
            <TableHead>تكلفة المشروع</TableHead>
            <TableHead>اسم المشروع</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memos.length > 0 ? (
            memos.map((memo) => (
              <TableRow key={memo._id}>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => toast.success("جاري الطباعة...")}
                      title="طباعة"
                    >
                      🖨️
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(memo._id)}
                      title="حذف"
                    >
                      🗑️
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {memo.printAction || "طباعة"}
                  </span>
                </TableCell>
                <TableCell>{memo.executingBranchName || "-"}</TableCell>
                <TableCell>{memo.branchCode || "-"}</TableCell>
                <TableCell className="font-semibold">
                  {memo.projectCost ? memo.projectCost.toLocaleString('ar-EG') : "-"}
                </TableCell>
                <TableCell>{memo.projectName}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد مذكرات نشر لهذا المشروع
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        title="إضافة مذكرة نشر جديدة"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="اسم المشروع"
            name="projectName"
            value={formData.projectName || ""}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تكلفة المشروع"
              name="projectCost"
              type="number"
              value={formData.projectCost || ""}
              onChange={handleInputChange}
              required
            />
            <Input
              label="كود الفرع"
              name="branchCode"
              value={formData.branchCode || ""}
              onChange={handleInputChange}
            />
            <Input
              label="اسم الفرع المنفذ"
              name="executingBranchName"
              value={formData.executingBranchName || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({});
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" loading={createMutation.isLoading}>
              إضافة
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
