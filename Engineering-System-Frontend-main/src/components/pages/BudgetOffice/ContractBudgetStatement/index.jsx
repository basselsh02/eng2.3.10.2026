import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContractBudgetStatements } from "../../../../api/contractBudgetStatementAPI";
import PageTitle from "../../../ui/PageTitle/PageTitle";
import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../ui/Table/Table";
import Pagination from "../../../ui/Pagination/Pagination";
import Loading from "../../../common/Loading/Loading";
import Modal from "../../../ui/Modal/Modal";
import ProjectDataTab from "./tabs/ProjectDataTab";
import ContractualDataTab from "./tabs/ContractualDataTab";
import DisbursementDataTab from "./tabs/DisbursementDataTab";
import MaterialsDisbursementTab from "./tabs/MaterialsDisbursementTab";

export default function ContractBudgetStatement() {
  const [page, setPage] = useState(1);
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [financialYearInput, setFinancialYearInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [committed, setCommitted] = useState({ projectCode: "", financialYear: "", search: "" });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [activeTab, setActiveTab] = useState("projectData");

  const { data, isLoading, error } = useQuery({
    queryKey: ["contractBudgetStatements", page, committed],
    queryFn: () => getContractBudgetStatements({ page, limit: 10, search: committed.search, projectCode: committed.projectCode, financialYear: committed.financialYear }),
    keepPreviousData: true,
  });

  const handleSearch = () => { setPage(1); setCommitted({ projectCode: projectCodeInput.trim(), financialYear: financialYearInput.trim(), search: searchInput.trim() }); };
  const handleClear = () => { setPage(1); setProjectCodeInput(""); setFinancialYearInput(""); setSearchInput(""); setCommitted({ projectCode: "", financialYear: "", search: "" }); };
  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  const handleViewDetails = (statement) => { setSelectedStatement(statement); setActiveTab("projectData"); setIsDetailModalOpen(true); };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-8 text-red-600">حدث خطأ أثناء تحميل البيانات</div>;

  const statements = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;
  const tabs = [
    { id: "projectData", label: "بيانات المشروع" },
    { id: "contractualData", label: "بيانات تعاقدية" },
    { id: "disbursementData", label: "بيانات الصرف" },
    { id: "materialsDisbursement", label: "صرف خامات" }
  ];

  return (
    <div dir="rtl">
      <PageTitle title="تسجيل بيان التعاقد والموازنة والصرف" />
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input label="كود المشروع" value={projectCodeInput} onChange={(e) => setProjectCodeInput(e.target.value)} onKeyDown={handleKeyDown} />
            <Input label="العام المالي" value={financialYearInput} onChange={(e) => setFinancialYearInput(e.target.value)} onKeyDown={handleKeyDown} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <Input label="البحث" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <div className="flex gap-2 mt-2"><Button onClick={handleSearch}>بحث</Button><Button variant="secondary" onClick={handleClear}>مسح</Button></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4"><Button onClick={() => handleViewDetails(null)} variant="primary">+ إضافة بيان جديد</Button></div>

        <Table>
          <TableHeader><TableRow><TableHead>الإجراءات</TableHead><TableHead>الحالة</TableHead><TableHead>نسبة الصرف %</TableHead><TableHead>المبلغ المصروف</TableHead><TableHead>الموازنة الكلية</TableHead><TableHead>اسم المقاول</TableHead><TableHead>اسم المشروع</TableHead><TableHead>كود المشروع</TableHead></TableRow></TableHeader>
          <TableBody>
            {statements.length > 0 ? statements.map((statement) => (
              <TableRow key={statement._id}><TableCell><Button size="sm" variant="primary" onClick={() => handleViewDetails(statement)}>عرض التفاصيل</Button></TableCell><TableCell>{statement.status || '-'}</TableCell><TableCell>{statement.disbursementData?.disbursementPercentage || 0}%</TableCell><TableCell>{statement.disbursementData?.totalDisbursed?.toLocaleString('ar-EG') || '-'}</TableCell><TableCell>{statement.disbursementData?.totalBudget?.toLocaleString('ar-EG') || '-'}</TableCell><TableCell>{statement.contractualData?.contractorName || '-'}</TableCell><TableCell>{statement.projectData?.projectName || '-'}</TableCell><TableCell>{statement.projectCode}</TableCell></TableRow>
            )) : <TableRow><TableCell colSpan={8} className="text-center text-gray-500 py-8">لا توجد بيانات</TableCell></TableRow>}
          </TableBody>
        </Table>

        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>

      <Modal isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedStatement(null); }} title={selectedStatement ? "تفاصيل بيان التعاقد والموازنة والصرف" : "إضافة بيان جديد"} size="large">
        <div className="space-y-4">
          <div className="border-b"><div className="flex">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-6 py-3 font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-primary-600 text-primary-600 bg-gray-50" : "text-gray-600 hover:bg-gray-50"}`}>{tab.label}</button>)}</div></div>
          <div className="p-4">{activeTab === "projectData" && <ProjectDataTab statement={selectedStatement} />}{activeTab === "contractualData" && <ContractualDataTab statement={selectedStatement} />}{activeTab === "disbursementData" && <DisbursementDataTab statement={selectedStatement} />}{activeTab === "materialsDisbursement" && <MaterialsDisbursementTab statement={selectedStatement} />}</div>
        </div>
      </Modal>
    </div>
  );
}
