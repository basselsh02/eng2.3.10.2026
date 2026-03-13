import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllFinancialTransactions } from "../../../api/financialTransactionAPI";
import { FaBell, FaSearch, FaTimes } from "react-icons/fa";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import AppSelect from "../../ui/AppSelect/AppSelect";
import PageTitle from "../../ui/PageTitle/PageTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table/Table";
import {
  budgetAllocations,
  committeeMembers,
  committeeTypes,
  decisionOptions,
  fiscalYearOptions,
  getActionButtons,
  offerItems,
  reasonOptions,
  supplyItems,
  tabs,
} from "./constants";

function CheckBadge({ checked }) {
  return (
    <span
      className={`inline-block h-4 w-4 rounded border ${
        checked ? "border-blue-600 bg-blue-600" : "border-gray-400"
      }`}
    />
  );
}

function DataGrid({ columns, rows }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={`${row.id || row.code || row.itemCode || "row"}-${idx}`}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render ? column.render(row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ProcurementMemos() {
  const [activeTab, setActiveTab] = useState("company-offers");

  const actionButtons = useMemo(() => getActionButtons(activeTab), [activeTab]);
  const { data: res, isLoading: loading, error } = useQuery({
    queryKey: ["financial-transactions-for-memos"],
    queryFn: () => getAllFinancialTransactions({ page: 1, limit: 100 }),
  });
  const procurements = res?.data || [];

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error?.message || String(error)}</div>;

  const projects = (procurements || []).map((item, index) => ({
    id: item._id || index,
    code: item.projectCode || item.projectNumber || "-",
    name: item.projectName || item.name || "-",
    totalCost: item.projectCost ? item.projectCost.toLocaleString("ar-EG") : "-",
    branchCode: item.branchCode || "-",
    branchName: item.branchName || "-",
  }));

  const offers = (procurements || []).map((item, index) => ({
    sequence: index + 1,
    companyCode: item.companyData?.companyCode || "-",
    companyName: item.companyData?.companyName || "-",
    offerType: item.companyData?.offerType || "-",
    securityApproval: item.companyData?.serialOrder || "-",
    bidBond: item.projectCost || "-",
    bidBondDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-",
    documentCount: item.quantity || "-",
    documentType: item.category || "-",
    isVerified: !!item.isContracted,
    hasSigned: !!item.mainCompletion,
    decisionDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-",
  }));

  const committeeColumns = [
    { key: "rank", label: "الرتبة" },
    { key: "name", label: "الأسم" },
    { key: "role", label: "الوظيفة" },
    {
      key: "status",
      label: activeTab === "technical-decision" ? "توقيع" : "تعمل",
      render: (row) => (
        <div className="flex justify-center">
          <CheckBadge checked={activeTab === "technical-decision" ? row.hasSigned : row.isActive} />
        </div>
      ),
    },
  ];

  return (
    <section dir="rtl" className="space-y-5">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100" />
            <span className="font-semibold">مهام المدير</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input label="البحث" className="min-w-[220px]" />
            <Button variant="secondary" size="icon" icon={<FaBell />} />
            <Button variant="secondary">قسم المشتريات</Button>
            <Button variant="secondary">اجراءات التعاقد / التوريدات</Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold">TRDD_UF</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold">20252028</span>
          <div className="mr-auto">
            <PageTitle title="محضر اجراءات الفتح والبت الفني" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input label="كود المشروع" value="4585551456" readOnly />
          <AppSelect label="العام المالي" options={fiscalYearOptions} value={fiscalYearOptions[0]} onChange={() => {}} />
          <AppSelect label="نوع اللجنة" options={committeeTypes} value={committeeTypes[0]} onChange={() => {}} />
          <Input label="التاريخ" value="2025/8/5" readOnly />
          <Input label="اليوم" value="السبت" readOnly />
          <Input label="بيان اللجنة" value="" />
        </div>

        <DataGrid
          columns={[
            { key: "code", label: "كود المشروع" },
            { key: "name", label: "اسم المشروع" },
            { key: "totalCost", label: "تكلفة المشروع" },
            { key: "branchCode", label: "كود الفرع" },
            { key: "branchName", label: "اسم الفرع المنفذ" },
            {
              key: "actions",
              label: "البحث / مسح",
              render: () => (
                <div className="flex justify-center gap-2">
                  <Button size="icon" variant="light" icon={<FaSearch />} />
                  <Button size="icon" variant="light" icon={<FaTimes />} />
                </div>
              ),
            },
          ]}
          rows={projects}
        />

        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? "border-b-2 border-primary-500 text-primary-600"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px,1fr]">
          <div className="space-y-2">
            {actionButtons.map((label, index) => (
              <Button key={`${label}-${index}`} className="w-full justify-center">
                {label}
              </Button>
            ))}
          </div>
          <DataGrid columns={committeeColumns} rows={committeeMembers} />
        </div>

        {activeTab === "company-offers" && (
          <DataGrid
            columns={[
              { key: "sequence", label: "المسلسل" },
              { key: "companyCode", label: "الكود" },
              { key: "companyName", label: "اسم الشركة" },
              { key: "offerType", label: "نوع العرض" },
              { key: "securityApproval", label: "رقم الموافقة الامنية" },
              { key: "bidBond", label: "التأمين الابتدائي" },
              { key: "bidBondDate", label: "تاريخها" },
              { key: "documentCount", label: "عدد الاوراق" },
              { key: "documentType", label: "نوع الورقة" },
              {
                key: "isVerified",
                label: "تم",
                render: (row) => (
                  <div className="flex justify-center">
                    <CheckBadge checked={row.isVerified} />
                  </div>
                ),
              },
            ]}
            rows={offers}
          />
        )}

        {activeTab === "technical-opening" && (
          <DataGrid
            columns={[
              { key: "companyCode", label: "كود الشركة" },
              { key: "companyName", label: "اسم الشركة" },
              { key: "offerType", label: "نوع العرض" },
              { key: "documentType", label: "نوع الورقة" },
              { key: "documentCount", label: "عدد الاوراق" },
              { key: "bidBondDate", label: "تاريخها" },
            ]}
            rows={offers}
          />
        )}

        {activeTab === "technical-decision" && (
          <>
            <DataGrid
              columns={[
                { key: "companyCode", label: "كود الشركة" },
                { key: "companyName", label: "اسم الشركة" },
                { key: "offerType", label: "نوع العرض" },
                {
                  key: "decision",
                  label: "قرار اللجنة",
                  render: () => (
                    <AppSelect
                      label="قرار اللجنة"
                      options={decisionOptions}
                      value={decisionOptions[0]}
                      onChange={() => {}}
                      size="sm"
                    />
                  ),
                },
                { key: "decisionDate", label: "تاريخ البت الفني" },
                {
                  key: "ruling",
                  label: "الفرار",
                  render: () => (
                    <AppSelect
                      label="الفرار"
                      options={decisionOptions}
                      value={decisionOptions[0]}
                      onChange={() => {}}
                      size="sm"
                    />
                  ),
                },
              ]}
              rows={offers}
            />
            <DataGrid
              columns={[
                { key: "itemNumber", label: "الصنف" },
                { key: "itemName", label: "اسم صنف الشركة في العرض" },
                {
                  key: "decision",
                  label: "قرار اللجنة",
                  render: () => (
                    <AppSelect
                      label="قرار اللجنة"
                      options={decisionOptions}
                      value={decisionOptions[0]}
                      onChange={() => {}}
                      size="sm"
                    />
                  ),
                },
                {
                  key: "reason",
                  label: "أسباب الفرار",
                  render: () => (
                    <AppSelect
                      label="أسباب الفرار"
                      options={reasonOptions}
                      value={reasonOptions[0]}
                      onChange={() => {}}
                      size="sm"
                    />
                  ),
                },
              ]}
              rows={offerItems}
            />
          </>
        )}

        {activeTab === "financial-opening" && (
          <DataGrid
            columns={[
              { key: "companyCode", label: "كود الشركة" },
              { key: "sequence", label: "المسلسل" },
              { key: "companyName", label: "الشركة" },
              { key: "offerType", label: "نوع العرض" },
              { key: "bidBond", label: "التأمين الابتدائي" },
              { key: "financialDocs", label: "الاوراق المالية" },
              { key: "financialValue", label: "قيمة العرض المالي" },
            ]}
            rows={offers}
          />
        )}

        {activeTab === "financial-decision" && (
          <>
            <DataGrid
              columns={[
                { key: "companyCode", label: "كود الشركة" },
                { key: "sequence", label: "مسلسل" },
                { key: "companyName", label: "اسم الشركة" },
                { key: "offerType", label: "نوع العرض" },
                { key: "itemNumbers", label: "أرقام البنود" },
                { key: "financialValue", label: "القيمة المالية" },
                { key: "reviewedValue", label: "المراجعة المالية" },
                { key: "discountPercentage", label: "الخصم%" },
                { key: "valueAfterDiscount", label: "القيمة بعد الخصم" },
                {
                  key: "excluded",
                  label: "مستبعد",
                  render: (row) => (
                    <div className="flex justify-center">
                      <CheckBadge checked={row.excluded} />
                    </div>
                  ),
                },
              ]}
              rows={offers}
            />

            <DataGrid
              columns={[
                { key: "itemCode", label: "كود البند" },
                { key: "itemNumber", label: "البند" },
                { key: "itemName", label: "اسم الصنف" },
                { key: "unit", label: "وحدة القياس" },
                { key: "quantity", label: "الكمية" },
                { key: "companyPrice", label: "سعر الشركة" },
                { key: "priceAfterDiscount", label: "سعر بعد الخصم" },
                { key: "discount", label: "الخصم" },
                { key: "total", label: "الإجمالي" },
                {
                  key: "decision",
                  label: "قرار اللجنة",
                  render: () => (
                    <AppSelect
                      label="قرار اللجنة"
                      options={decisionOptions}
                      value={decisionOptions[0]}
                      onChange={() => {}}
                      size="sm"
                    />
                  ),
                },
              ]}
              rows={offerItems}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Input label="الإجمالي" value="1,105,377,052" readOnly />
              <Input label="المبلغ" value="1,102,000,000" readOnly />
              <Input label="المخصص" value="اعمال انشائية" readOnly />
              <Input label="وصف المشروع" value="الواجهة البحرية" readOnly />
            </div>
          </>
        )}

        {activeTab === "supply-order" && (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input label="رقم أمر التوريد" value="13/15" readOnly />
              <Input label="تاريخ أمر التوريد" value="2025/5/2" readOnly />
              <Input label="الشركة" value="مكتب البنوق للمقاولات" readOnly />
              <Input label="الموضوع" value="توريد بنود المشروع" />
              <Input label="قيمة أمر التوريد" value="1,105,377,052" readOnly />
              <Input label="نسبة الخصم %" value="0" />
              <Input label="القيمة بعد الخصم" value="1,105,377,052" readOnly />
              <Input label="نسبة الضمان" value="5" />
              <Input label="قيمة الضمان" value="55,268,852" readOnly />
              <AppSelect label="المجموعة الصنفية" options={[{ value: "1", label: "الاعمال الانشائية" }]} value={{ value: "1", label: "الاعمال الانشائية" }} onChange={() => {}} />
              <Input label="ملاحظات" value="" />
            </div>

            <DataGrid
              columns={[
                { key: "itemNumber", label: "رقم البند" },
                { key: "unit", label: "الوحدة" },
                { key: "quantity", label: "الكمية" },
                { key: "unitPrice", label: "سعر الوحدة" },
                { key: "total", label: "الأجمالي" },
              ]}
              rows={supplyItems}
            />

            <DataGrid
              columns={[
                { key: "code", label: "الكود" },
                { key: "allocation", label: "المخصص" },
                { key: "amount", label: "المبلغ" },
                { key: "projectDescription", label: "وصف المشروع" },
                {
                  key: "isActive",
                  label: "Active",
                  render: (row) => (
                    <div className="flex justify-center">
                      <CheckBadge checked={row.isActive} />
                    </div>
                  ),
                },
              ]}
              rows={budgetAllocations}
            />
          </>
        )}

        {activeTab === "form-19-notes" && (
          <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-gray-600">
            ملاحظات نموذج 19 — شاشة مرجعية لإدخال الملاحظات النهائية قبل الإغلاق.
          </div>
        )}
      </div>
    </section>
  );
}
