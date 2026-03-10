import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookletSales, createBookletSale, deleteBookletSale } from "../../../../../api/bookletSalesAPI";
import { getProjectPublications, updateProjectPublication } from "../../../../../api/projectPublicationAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";
import Modal from "../../../../ui/Modal/Modal";
import Loading from "../../../../common/Loading/Loading";
import toast from "react-hot-toast";

export default function BookletSalesTab({ projectCode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  // Fetch booklet sales for this project
  const { data, isLoading } = useQuery({
    queryKey: ["bookletSales", projectCode],
    queryFn: () => getBookletSales({ projectNumber: projectCode, limit: 100 }),
  });

  // Fetch project publication data to get candidate companies
  const { data: projectData, isLoading: isProjectLoading } = useQuery({
    queryKey: ["projectPublicationByCode", projectCode],
    queryFn: async () => {
      const response = await getProjectPublications({ search: projectCode, limit: 1 });
      return response.data.projectPublications[0];
    },
  });

  // Update candidate company purchase status
  const updateCompanyMutation = useMutation({
    mutationFn: ({ projectId, companyId, purchased }) => 
      updateProjectPublication({
        id: projectId,
        data: {
          candidateCompanies: projectData.candidateCompanies.map(c =>
            c._id === companyId ? { ...c, purchased } : c
          )
        }
      }),
    onSuccess: () => {
      toast.success("تم تحديث حالة الشراء");
      queryClient.invalidateQueries(["projectPublicationByCode"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل التحديث");
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createBookletSale,
    onSuccess: () => {
      toast.success("تم إضافة بيع الكراسة بنجاح");
      queryClient.invalidateQueries(["bookletSales"]);
      setIsModalOpen(false);
      setFormData({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشلت الإضافة");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBookletSale,
    onSuccess: () => {
      toast.success("تم حذف بيع الكراسة بنجاح");
      queryClient.invalidateQueries(["bookletSales"]);
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
    if (window.confirm("هل أنت متأكد من حذف بيع الكراسة؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;

  const bookletSales = data?.data?.bookletSales || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">بيع الكراسات واستلام التأمين الابتدائي</h3>
        <Button onClick={handleAdd} variant="primary">
          + إضافة بيع كراسة
        </Button>
      </div>

      {/* Booklet Sales Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الإجراءات</TableHead>
            <TableHead>نوع الموظفين</TableHead>
            <TableHead>اسم الفرع المنفذ</TableHead>
            <TableHead>كود الفرع</TableHead>
            <TableHead>تكلفة المشروع</TableHead>
            <TableHead>اسم المشروع</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookletSales.length > 0 ? (
            bookletSales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(sale._id)}
                    title="حذف"
                  >
                    🗑️
                  </Button>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {sale.staffType || "عسكري/مدني"}
                  </span>
                </TableCell>
                <TableCell>{sale.executingBranchName || "-"}</TableCell>
                <TableCell>{sale.branchCode || "-"}</TableCell>
                <TableCell className="font-semibold">
                  {sale.projectCost ? sale.projectCost.toLocaleString('ar-EG') : "-"}
                </TableCell>
                <TableCell>{sale.projectName}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد عمليات بيع كراسات لهذا المشروع
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Candidate Companies Table - Lower Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">الشركات المرشحة</h3>
        {isProjectLoading ? (
          <Loading />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تم الشراء</TableHead>
                <TableHead>اسم الشركة المرشحة</TableHead>
                <TableHead>طريقة دفع التأمين</TableHead>
                <TableHead>الكود</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData?.candidateCompanies && projectData.candidateCompanies.length > 0 ? (
                projectData.candidateCompanies.map((company) => (
                  <TableRow key={company._id || company.registrationNumber}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={company.purchased || false}
                        onChange={(e) => {
                          if (projectData._id) {
                            updateCompanyMutation.mutate({
                              projectId: projectData._id,
                              companyId: company._id,
                              purchased: e.target.checked
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{company.companyName || "-"}</TableCell>
                    <TableCell>
                      <span className="text-xs">{company.approvalNumber ? "دون" : "بدون"}</span>
                    </TableCell>
                    <TableCell>{company.registrationNumber || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    لا توجد شركات مرشحة لهذا المشروع
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        title="إضافة بيع كراسة جديد"
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
              label="نوع الموظفين"
              type="select"
              name="staffType"
              value={formData.staffType || ""}
              onChange={handleInputChange}
              options={[
                { value: "", label: "اختر النوع" },
                { value: "عسكري/مدني", label: "عسكري/مدني" },
                { value: "عسكري", label: "عسكري" },
                { value: "مدني", label: "مدني" }
              ]}
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
