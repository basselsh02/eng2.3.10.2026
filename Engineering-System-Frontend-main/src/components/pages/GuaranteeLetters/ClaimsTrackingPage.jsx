import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table/Table";
import Loading from "../../common/Loading/Loading";
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";
import { getClaimsByProject, createClaim, updateClaim } from "../../../api/guaranteeLettersAPI";
import { useFFData } from "../../../hooks/useFFData";
import { getFFExtracts } from "../../../services/ffApi";

const d = (v) => (v ? new Date(v).toLocaleDateString("ar-EG") : "-");

export default function ClaimsTrackingPage() {
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [committed, setCommitted] = useState(null);
  const queryClient = useQueryClient();

  const handleSearch = () => projectCodeInput.trim() && setCommitted({ projectCode: projectCodeInput.trim() });
  const handleClear = () => { setProjectCodeInput(""); setCommitted(null); };
  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  const { data: ffExtracts, loading: loadingFF, error: ffError } = useFFData(
    getFFExtracts,
    { projectCode: committed?.projectCode },
    [committed?.projectCode]
  );

  const { data: localClaimsRes, isLoading: loadingLocal, error: localError } = useQuery({
    queryKey: ["claims", committed?.projectCode],
    queryFn: () => getClaimsByProject(committed?.projectCode),
    enabled: !!committed?.projectCode,
    keepPreviousData: true,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (payload._id) return updateClaim(payload._id, payload);
      return createClaim(payload);
    },
    onSuccess: () => queryClient.invalidateQueries(["claims", committed?.projectCode]),
  });

  const merged = useMemo(() => {
    const localClaims = localClaimsRes?.data?.data?.claims || localClaimsRes?.data?.data || [];
    const byExtract = new Map(localClaims.map((c) => [c.extractId || c.claimNumber, c]));
    return (ffExtracts || []).map((ex) => {
      const local = byExtract.get(ex._id) || byExtract.get(ex.extractNumber) || {};
      return {
        _id: local._id,
        extractId: ex._id,
        projectCode: committed?.projectCode,
        extractNumber: ex.extractNumber || ex.claimNumber,
        followupCompletionDate: ex.followupCompletionDate,
        claimType: ex.extractType || ex.claimType,
        code: ex.code || ex.projectCode,
        employeeName: ex.employeeName,
        branchName: ex.branchName,
        claimDate: ex.extractDate || ex.claimDate,
        claimValue: ex.totalAmount || ex.claimValue,
        disbursementDue: ex.netAmount || ex.disbursementDue,
        archiveReceiptDate: local.archiveReceiptDate ? local.archiveReceiptDate.slice(0, 10) : "",
        exitDate: local.exitDate ? local.exitDate.slice(0, 10) : "",
        completionNotes: local.completionNotes || local.notes || "",
      };
    });
  }, [ffExtracts, localClaimsRes, committed?.projectCode]);

  const onLocalFieldChange = (row, field, value) => {
    saveMutation.mutate({
      _id: row._id,
      extractId: row.extractId,
      claimNumber: row.extractNumber,
      projectCode: row.projectCode,
      archiveReceiptDate: field === "archiveReceiptDate" ? value || null : row.archiveReceiptDate || null,
      exitDate: field === "exitDate" ? value || null : row.exitDate || null,
      completionNotes: field === "completionNotes" ? value : row.completionNotes,
    });
  };

  const loading = loadingFF || loadingLocal;
  const error = ffError || localError;

  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader code="TR001_CLAIMF" title="متابعة دخول وخروج المستخلصات" />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input label="كود المشروع" value={projectCodeInput} onChange={(e) => setProjectCodeInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="أدخل كود المشروع" />
          <div className="flex gap-2"><Button onClick={handleSearch} className="flex-1">بحث</Button><Button variant="secondary" onClick={handleClear} className="flex-1">مسح</Button></div>
        </div>
      </Card>

      {!committed && <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">أدخل كود المشروع للبحث</div>}
      {committed && loading && <Loading />}
      {committed && error && <div className="text-center py-8 text-red-600">حدث خطأ أثناء تحميل البيانات</div>}

      {committed && !loading && !error && (
        <Card className="p-2">
          <div className="max-h-[420px] overflow-y-auto">
            <Table>
              <TableHeader><TableRow><TableHead>رقم مستخلص</TableHead><TableHead>تاريخ الورود بالارشيف</TableHead><TableHead>تاريخ المتابعة الاستيفاء</TableHead><TableHead>نوع المستخلص</TableHead><TableHead>الكود</TableHead><TableHead>الموظف المسئول</TableHead><TableHead>الفرع المسئول</TableHead><TableHead>تاريخ المستخلص</TableHead><TableHead>قيمة المستخلص</TableHead><TableHead>المستحق صرفه</TableHead><TableHead>تاريخ خروج</TableHead><TableHead>ملاحظات الاستيفاء</TableHead></TableRow></TableHeader>
              <TableBody>
                {merged.length > 0 ? merged.map((claim) => (
                  <TableRow key={claim.extractId}>
                    <TableCell>{claim.extractNumber || "-"}</TableCell>
                    <TableCell><input type="date" className="border rounded px-2 py-1" defaultValue={claim.archiveReceiptDate} onBlur={(e) => onLocalFieldChange(claim, "archiveReceiptDate", e.target.value)} /></TableCell>
                    <TableCell>{d(claim.followupCompletionDate)}</TableCell>
                    <TableCell>{claim.claimType || "-"}</TableCell>
                    <TableCell>{claim.code || "-"}</TableCell>
                    <TableCell>{claim.employeeName || "-"}</TableCell>
                    <TableCell>{claim.branchName || "-"}</TableCell>
                    <TableCell>{d(claim.claimDate)}</TableCell>
                    <TableCell>{claim.claimValue || "-"}</TableCell>
                    <TableCell>{claim.disbursementDue || "-"}</TableCell>
                    <TableCell><input type="date" className="border rounded px-2 py-1" defaultValue={claim.exitDate} onBlur={(e) => onLocalFieldChange(claim, "exitDate", e.target.value)} /></TableCell>
                    <TableCell><input type="text" className="border rounded px-2 py-1" defaultValue={claim.completionNotes} onBlur={(e) => onLocalFieldChange(claim, "completionNotes", e.target.value)} /></TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={12} className="text-center text-gray-500 py-8">لا توجد بيانات</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
