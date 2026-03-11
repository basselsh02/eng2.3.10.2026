import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import {
  useCreateMaintenanceReport,
  useMaintenanceReport,
  useProjectsDropdown,
  useUpdateMaintenanceReport,
} from "../../../hooks/useMaintenanceReports";

const initialState = {
  projectNumber: "",
  company: "",
  projectName: "",
  disbursedAmount: "",
  fromDate: "",
  toDate: "",
  projectLocations: "",
  isStopped: false,
  stoppedNote: "",
  hallReceiptDate: "",
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

export default function CreateMaintenanceReportForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState({});

  const { data: projectsData } = useProjectsDropdown();
  const { data: reportData, isLoading: isReportLoading } = useMaintenanceReport(id);

  const createMutation = useCreateMaintenanceReport();
  const updateMutation = useUpdateMaintenanceReport();

  const projects = useMemo(() => projectsData?.data || projectsData?.data?.docs || [], [projectsData]);

  const baseData = useMemo(() => {
    if (!reportData?.data) return initialState;

    const report = reportData.data;
    return {
      projectNumber: report.projectNumber || "",
      company: report.company || "",
      projectName: report.projectName || "",
      disbursedAmount: report.disbursedAmount ?? "",
      fromDate: toDateInput(report.fromDate),
      toDate: toDateInput(report.toDate),
      projectLocations: report.projectLocations || "",
      isStopped: Boolean(report.isStopped),
      stoppedNote: report.stoppedNote || "",
      hallReceiptDate: toDateInput(report.hallReceiptDate),
    };
  }, [reportData]);

  const formData = useMemo(() => ({ ...baseData, ...draft }), [baseData, draft]);

  const onProjectChange = (projectCode) => {
    const selected = projects.find((p) => p.projectCode === projectCode);
    setDraft((prev) => ({
      ...prev,
      projectNumber: projectCode,
      company: selected?.company || "",
      projectName: selected?.projectName || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "isStopped") {
      setDraft((prev) => ({
        ...prev,
        isStopped: checked,
        stoppedNote: checked ? formData.stoppedNote : "",
      }));
      return;
    }

    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.projectNumber) return "رقم المشروع مطلوب";
    if (!formData.disbursedAmount || Number(formData.disbursedAmount) < 0) return "المبلغ المنصرف غير صالح";
    if (!formData.fromDate || !formData.toDate) return "تاريخ البداية والنهاية مطلوبان";
    if (new Date(formData.toDate) < new Date(formData.fromDate)) return "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
    if (formData.isStopped && !String(formData.stoppedNote || "").trim()) return "سبب الإيقاف مطلوب عند اختيار متوقف";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return toast.error(validationError);

    const payload = {
      ...formData,
      disbursedAmount: Number(formData.disbursedAmount),
      hallReceiptDate: formData.hallReceiptDate || null,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, data: payload });
        toast.success("تم تحديث تقرير الصيانة بنجاح");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("تم إضافة تقرير الصيانة بنجاح");
      }
      queryClient.invalidateQueries(["maintenanceReports"]);
      navigate("/maintenance-reports");
    } catch (err) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ التقرير");
    }
  };

  if (isEdit && isReportLoading) return <Loading />;

  return (
    <div dir="rtl">
      <PageTitle title="إضافة تقرير صيانة" />
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm mb-1">رقم المشروع *</label><select name="projectNumber" value={formData.projectNumber} onChange={(e) => onProjectChange(e.target.value)} className="w-full border rounded px-3 py-2" required><option value="">اختر المشروع</option>{projects.map((project) => <option key={project._id} value={project.projectCode}>{project.projectCode}</option>)}</select></div>
          <div><label className="block text-sm mb-1">الشركة</label><input name="company" value={formData.company} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" /></div>
          <div><label className="block text-sm mb-1">بيان / اسم المشروع</label><input name="projectName" value={formData.projectName} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" /></div>
          <div><label className="block text-sm mb-1">المبلغ المنصرف *</label><input type="number" min="0" name="disbursedAmount" value={formData.disbursedAmount} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div><label className="block text-sm mb-1">من *</label><input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div><label className="block text-sm mb-1">إلى *</label><input type="date" min={formData.fromDate} name="toDate" value={formData.toDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div className="md:col-span-2"><label className="block text-sm mb-1">مواقع / أماكن المشاريع</label><textarea name="projectLocations" rows={3} value={formData.projectLocations} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          <div className="flex items-center gap-2 mt-7"><input type="checkbox" id="isStopped" name="isStopped" checked={formData.isStopped} onChange={handleChange} /><label htmlFor="isStopped">متوقف</label></div>
          {formData.isStopped && <div><label className="block text-sm mb-1">سبب الإيقاف *</label><input name="stoppedNote" value={formData.stoppedNote} onChange={handleChange} className="w-full border rounded px-3 py-2" required={formData.isStopped} /></div>}
          <div><label className="block text-sm mb-1">تاريخ الاستلام في الصالة</label><input type="date" name="hallReceiptDate" value={formData.hallReceiptDate} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        </div>
        <div className="flex items-center gap-2 mt-6"><Button type="submit" variant="primary" disabled={createMutation.isPending || updateMutation.isPending}>حفظ</Button><Button type="button" variant="secondary" onClick={() => navigate("/maintenance-reports")}>إلغاء</Button></div>
      </form>
    </div>
  );
}
