import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Input from "../../ui/Input/Input";

export default function TechnicalProceduresTab({ data }) {
  const technical = data.technicalProcedures || {};
  const committeeMembers = technical.committeeMembers || [];
  const technicalResults = technical.technicalResults || [];

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">إجراءات البث الفني</h3>

      {/* Financial Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <Input
          label="كود الشركة"
          value={technical.companyCode || ""}
          readOnly
        />
        <Input
          label="اسم الشركة"
          value={technical.companyName || "مكتب الشبكي للمقاولات"}
          readOnly
        />
        <Input
          label="نوع العرض"
          value={technical.offerType || "عرض الماسي"}
          readOnly
        />
        <Input
          label="نسبة قبل %"
          value={technical.previousPercentage || "0.00"}
          readOnly
        />
        <Input
          label="الترتيب المبدئي"
          value={technical.initialOrder || "3/1"}
          readOnly
        />
        <Input
          label="القيمة المالية قبل المراجعة"
          value={technical.financialValueBeforeReview?.toLocaleString("ar-EG") || "0"}
          readOnly
        />
        <Input
          label="فائدة البنك %"
          value={technical.bankInterest || "0.00"}
          readOnly
        />
        <Input
          label="قيمة الضمانة المتقدمة"
          value={technical.advancedGuaranteeValue?.toLocaleString("ar-EG") || "0"}
          readOnly
        />
        <Input
          label="قيمة الاضافة قبل"
          value={technical.additionValueBefore?.toLocaleString("ar-EG") || "0.00"}
          readOnly
        />
        <Input
          label="قيمة المالية بعد %"
          value={technical.financialValueAfterPercentage?.toLocaleString("ar-EG") || "0"}
          readOnly
        />
        <Input
          label="قيمة الاضافات بعد"
          value={technical.additionValueAfter?.toLocaleString("ar-EG") || "0.00"}
          readOnly
        />
        <Input
          label="نسبة بعد %"
          value={technical.percentageAfter || "0.00"}
          readOnly
        />
      </div>

      {/* Committee Members Table */}
      <div>
        <h4 className="text-lg font-semibold mb-3">أعضاء اللجنة</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>طباعة نموذج 12</TableHead>
                <TableHead>تسجيل العرض المالي</TableHead>
                <TableHead>التوقيع</TableHead>
                <TableHead>الوظيفة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>الرتبة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {committeeMembers.length > 0 ? (
                committeeMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={member.printForm12 || false}
                        readOnly
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={member.financialOfferRegistered || false}
                        readOnly
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={member.signature || false}
                        readOnly
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell>{member.position || "-"}</TableCell>
                    <TableCell>{member.name || "-"}</TableCell>
                    <TableCell>{member.rank || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    لا توجد بيانات أعضاء اللجنة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Technical Results Table */}
      <div>
        <h4 className="text-lg font-semibold mb-3">نتائج الفحص الفني</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم البند</TableHead>
                <TableHead>تاريخ البث الفني</TableHead>
                <TableHead>قرار اللجنة</TableHead>
                <TableHead>نوع العرض</TableHead>
                <TableHead>اسم الشركة</TableHead>
                <TableHead>كود الشركة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicalResults.length > 0 ? (
                technicalResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.itemNumber || "-"}</TableCell>
                    <TableCell>
                      {result.technicalOpeningDate
                        ? new Date(result.technicalOpeningDate).toLocaleDateString("ar-EG")
                        : "غير محدد"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-sm ${
                        result.committeeDecision === 'مقبول' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.committeeDecision || "قيد المراجعة"}
                      </span>
                    </TableCell>
                    <TableCell>{result.offerType || "-"}</TableCell>
                    <TableCell>{result.companyName || "-"}</TableCell>
                    <TableCell>{result.companyCode || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    لا توجد نتائج متاحة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}