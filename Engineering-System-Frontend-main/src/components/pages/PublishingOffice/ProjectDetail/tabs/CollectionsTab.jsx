import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollections, createCollection, deleteCollection } from "../../../../../api/collectionsAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";
import Modal from "../../../../ui/Modal/Modal";
import Loading from "../../../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function CollectionsTab({ projectCode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  // Fetch collections for this project
  const { data, isLoading } = useQuery({
    queryKey: ["collections", projectCode],
    queryFn: () => getCollections({ projectNumber: projectCode, limit: 100 }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      toast.success("تم إضافة التحصيل بنجاح");
      queryClient.invalidateQueries(["collections"]);
      setIsModalOpen(false);
      setFormData({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت الإضافة");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      toast.success("تم حذف التحصيل بنجاح");
      queryClient.invalidateQueries(["collections"]);
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
    if (window.confirm("هل أنت متأكد من حذف هذا التحصيل؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;

  const collections = data?.data?.collections || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">التحصيلات</h3>
        <Button onClick={handleAdd} variant="primary">
          + إضافة تحصيل
        </Button>
      </div>

      {/* Collections Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الإجراءات</TableHead>
            <TableHead>اسم المحصل</TableHead>
            <TableHead>اسم الفرع المنفذ</TableHead>
            <TableHead>كود الفرع</TableHead>
            <TableHead>تكلفة المشروع</TableHead>
            <TableHead>اسم المشروع</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.length > 0 ? (
            collections.map((collection) => (
              <TableRow key={collection._id}>
                <TableCell>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(collection._id)}
                    title="حذف"
                  >
                    🗑️
                  </Button>
                </TableCell>
                <TableCell>{collection.collectorName || "-"}</TableCell>
                <TableCell>{collection.executingBranchName || "-"}</TableCell>
                <TableCell>{collection.branchCode || "-"}</TableCell>
                <TableCell className="font-semibold">
                  {collection.projectCost ? collection.projectCost.toLocaleString('ar-EG') : "-"}
                </TableCell>
                <TableCell>{collection.projectName}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد تحصيلات لهذا المشروع
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
        title="إضافة تحصيل جديد"
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
            <Input
              label="اسم المحصل"
              name="collectorName"
              value={formData.collectorName || ""}
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
