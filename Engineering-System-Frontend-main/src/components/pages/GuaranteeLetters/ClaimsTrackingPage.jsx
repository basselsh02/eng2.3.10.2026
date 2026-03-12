import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table/Table";
import Loading from "../../common/Loading/Loading";
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";
import { claimTypes } from "./mockData";
import { getClaimsByProject } from "../../../api/guaranteeLettersAPI";

export default function ClaimsTrackingPage() {
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [searchMode, setSearchMode] = useState("by_number");
  const [committed, setCommitted] = useState(null);

  const handleSearch = () => {
    if (projectCodeInput.trim()) {
      setCommitted(projectCodeInput.trim());
    }
  };

  const handleClear = () => {
    setProjectCodeInput("");
    setCommitted(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["claims", committed],
    queryFn: () => getClaimsByProject(committed),
    enabled: !!committed,
  });

  const claims = data?.data?.claims || data?.data || [];
  const projectInfo = claims[0] || {};

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader code="TR001_CLAIMF" title="متابعة دخول وخروج المستخلصات" />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="كود المشروع"
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="أدخل كود المشروع"
          />
          <div className="md:col-span-2 flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm"><input type="radio" checked={searchMode === "by_number"} onChange={() => setSearchMode("by_number")} />ابحث برقم المشروع</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" checked={searchMode === "by_name"} onChange={() => setSearchMode("by_name")} />ابحث باسم المشروع</label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">بحث</Button>
            <Button variant="secondary" onClick={handleClear} className="flex-1">مسح</Button>
          </div>
        </div>
      </Card>

      {!committed && (
        <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">
          أدخل كود المشروع للبحث
        </div>
      )}

      {committed && isLoading && <Loading />}

      {committed && error && (
        <div className="text-center py-8">
          <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
        </div>
      )}

      {committed && !isLoading && !error && (
        <>
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <p><span className="font-bold">رقم المشروع:</span> {projectInfo.projectCode || projectInfo.project_id || committed}</p>
              <p><span className="font-bold">الشركة:</span> {projectInfo.companyCode || projectInfo.company_id || "-"}</p>
              <p><span className="font-bold">القيمة الراسمية:</span> {projectInfo.estimatedValue || projectInfo.projectValue || "-"}</p>
              <p><span className="font-bold">اسم الشركة:</span> {projectInfo.companyName || "-"}</p>
              <p><span className="font-bold">تاريخ البت المالي:</span> {projectInfo.financialAwardDate || "-"}</p>
            </div>
            <p className="mt-2 text-sm"><span className="font-bold">وصف المشروع:</span> {projectInfo.projectDescription || "-"}</p>
          </Card>

          <Card className="p-2">
            <div className="max-h-[320px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم مستخلص</TableHead>
                    <TableHead>تاريخ الورود بالارشيف</TableHead>
                    <TableHead>تاريخ المتابعة الاستيفاء</TableHead>
                    <TableHead>نوع المستخلص</TableHead>
                    <TableHead>الكود</TableHead>
                    <TableHead>الموظف المسئول</TableHead>
                    <TableHead>الفرع المسئول</TableHead>
                    <TableHead>تاريخ المستخلص</TableHead>
                    <TableHead>قيمة المستخلص</TableHead>
                    <TableHead>المستحق صرفه</TableHead>
                    <TableHead>تاريخ خروج</TableHead>
                    <TableHead>ملاحظات الاستيفاء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.length > 0 ? (
                    claims.map((claim) => (
                      <TableRow key={claim._id || claim.id}>
                        <TableCell>{claim.claimNumber || "-"}</TableCell>
                        <TableCell>{claim.archiveReceiptDate || "-"}</TableCell>
                        <TableCell>{claim.followupCompletionDate || "-"}</TableCell>
                        <TableCell>
                          <select className="border rounded px-2 py-1 text-sm" value={claim.claimType || ""} readOnly>
                            {claimTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                          </select>
                        </TableCell>
                        <TableCell>{claim.code || "-"}</TableCell>
                        <TableCell>{claim.employee || claim.employeeName || "-"}</TableCell>
                        <TableCell>{claim.branch || claim.branchName || "-"}</TableCell>
                        <TableCell>{claim.claimDate || "-"}</TableCell>
                        <TableCell>{claim.claimValue || "-"}</TableCell>
                        <TableCell>{claim.disbursementDue || "-"}</TableCell>
                        <TableCell>{claim.exitDate || "-"}</TableCell>
                        <TableCell className="whitespace-normal text-right">{claim.notes || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-gray-500 py-8">
                        لا توجد بيانات
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
