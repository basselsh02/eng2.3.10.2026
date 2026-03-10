import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectData } from "../../../../../api/projectDataAPI";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../ui/Table/Table";
import toast from "react-hot-toast";

export default function CandidateCompaniesTab({ project }) {
  const queryClient = useQueryClient();
  const companies = project?.candidateCompanies || [];

  const [companySearch, setCompanySearch] = useState("");
  const [recordSearch, setRecordSearch] = useState("");
  const [newCompany, setNewCompany] = useState({
    registrationNumber: "",
    companies: "",
    recordNumber: "",
    recordNameNumber: "",
  });
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  const updateMutation = useMutation({
    mutationFn: (data) => updateProjectData({ id: project._id, data }),
    onSuccess: () => {
      toast.success("تم تحديث الشركات المرشحة");
      queryClient.invalidateQueries(["projectData"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "حدث خطأ");
    },
  });

  const handleAdd = () => {
    if (!newCompany.companies) {
      toast.error("اسم الشركة مطلوب");
      return;
    }
    const updated = [...companies, { ...newCompany }];
    updateMutation.mutate({ candidateCompanies: updated });
    setNewCompany({
      registrationNumber: "",
      companies: "",
      recordNumber: "",
      recordNameNumber: "",
    });
  };

  const handleDelete = () => {
    if (selectedCompanyIndex === null) {
      toast.error("يرجى اختيار شركة أولاً");
      return;
    }
    const updated = companies.filter((_, i) => i !== selectedCompanyIndex);
    updateMutation.mutate({ candidateCompanies: updated });
    setSelectedCompanyIndex(null);
  };

  const filteredCompanies = companies.filter((c) => {
    const matchName = companySearch
      ? c.companies?.toLowerCase().includes(companySearch.toLowerCase())
      : true;
    const matchRecord = recordSearch
      ? c.recordNumber?.toLowerCase().includes(recordSearch.toLowerCase())
      : true;
    return matchName && matchRecord;
  });

  const candidateNames = filteredCompanies.map((c) => c.companies || "");

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">ترشيح الشركات</h3>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={updateMutation.isLoading || selectedCompanyIndex === null}
        >
          حذف المحدد
        </Button>
      </div>

      {/* Search row */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="بحث باسم الشركة"
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            placeholder="اسم الشركة"
          />
          <Input
            label="بحث برقم السجل"
            value={recordSearch}
            onChange={(e) => setRecordSearch(e.target.value)}
            placeholder="رقم السجل"
          />
          <div className="flex items-end">
            <Button onClick={() => {}} variant="secondary" className="w-full">
              بحث
            </Button>
          </div>
        </div>
      </div>

      {/* Add new company form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">إضافة شركة جديدة</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="رقم التسجيل"
            value={newCompany.registrationNumber}
            onChange={(e) =>
              setNewCompany((p) => ({ ...p, registrationNumber: e.target.value }))
            }
            placeholder="رقم التسجيل"
          />
          <Input
            label="اسم الشركة"
            value={newCompany.companies}
            onChange={(e) =>
              setNewCompany((p) => ({ ...p, companies: e.target.value }))
            }
            placeholder="اسم الشركة"
          />
          <Input
            label="رقم السجل"
            value={newCompany.recordNumber}
            onChange={(e) =>
              setNewCompany((p) => ({ ...p, recordNumber: e.target.value }))
            }
            placeholder="رقم السجل"
          />
          <Input
            label="اسم/رقم السجل"
            value={newCompany.recordNameNumber}
            onChange={(e) =>
              setNewCompany((p) => ({ ...p, recordNameNumber: e.target.value }))
            }
            placeholder="اسم السجل"
          />
          <div className="flex items-end">
            <Button
              onClick={handleAdd}
              disabled={updateMutation.isLoading}
              loading={updateMutation.isLoading}
              className="w-full"
            >
              إضافة شركة
            </Button>
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel - candidate company names */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700">اسم الشركات المرشحة</h4>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {candidateNames.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                لا توجد شركات
              </div>
            ) : (
              candidateNames.map((name, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCompanyIndex(index)}
                  className={`px-4 py-2 text-sm border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
                    selectedCompanyIndex === index
                      ? "bg-blue-50 font-semibold text-primary-600 border-r-2 border-r-primary-600"
                      : "text-gray-700"
                  }`}
                >
                  {name || "-"}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel - full table */}
        <div className="md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشركات</TableHead>
                <TableHead>رقم السجل</TableHead>
                <TableHead>رقم الموافقة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    لا توجد شركات مرشحة
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company, index) => (
                  <TableRow
                    key={index}
                    onClick={() => setSelectedCompanyIndex(index)}
                    className={`cursor-pointer transition-colors ${
                      selectedCompanyIndex === index ? "bg-blue-50" : ""
                    }`}
                  >
                    <TableCell>{company.companies || "-"}</TableCell>
                    <TableCell>{company.recordNumber || "-"}</TableCell>
                    <TableCell>{company.registrationNumber || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}