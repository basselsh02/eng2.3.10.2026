import React from "react";
import Input from "../../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";

export default function DisbursementDataTab({ statement }) {
  const disbursementData = statement?.disbursementData || {};
  const items = disbursementData.disbursementItems || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">بيانات الصرف</h3>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          label="القيمة التعاقدية"
          value={disbursementData.contractValue?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="سابق صرفة"
          value={disbursementData.previouslyDisbursed?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="المتبقي من الرصيد"
          value={disbursementData.remainingBalance?.toLocaleString('ar-EG') || ""}
          readOnly
        />
        <Input
          label="إجمالي المنصرف"
          value={disbursementData.totalDisbursed?.toLocaleString('ar-EG') || ""}
          readOnly
        />
      </div>

      {/* Items Table */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الاخطار</TableHead>
              <TableHead>تاريخ الصرف</TableHead>
              <TableHead>المبلغ المنصرف</TableHead>
              <TableHead>الرصيد السابق</TableHead>
              <TableHead>الرصيد الحالي</TableHead>
              <TableHead>كود الشركة</TableHead>
              <TableHead>اسم الشركة</TableHead>
              <TableHead>رقم الدفعة</TableHead>
              <TableHead>الملاحظات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.notificationNumber || "-"}</TableCell>
                  <TableCell>
                    {item.disbursementDate ? new Date(item.disbursementDate).toLocaleDateString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {item.disbursedAmount?.toLocaleString('ar-EG') || "0"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {item.previousBalance?.toLocaleString('ar-EG') || "0"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {item.currentBalance?.toLocaleString('ar-EG') || "0"}
                  </TableCell>
                  <TableCell>{item.companyCode || "-"}</TableCell>
                  <TableCell>{item.companyName || "-"}</TableCell>
                  <TableCell>{item.paymentNumber || "-"}</TableCell>
                  <TableCell>{item.notes || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  لا توجد بنود صرف
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}