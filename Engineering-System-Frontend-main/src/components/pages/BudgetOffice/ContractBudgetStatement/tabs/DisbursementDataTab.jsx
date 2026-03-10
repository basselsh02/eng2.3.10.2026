import React from "react";
import Input from "../../../../ui/Input/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";

export default function DisbursementDataTab({ statement }) {
  const disbursementData = statement?.disbursementData || {};
  const items = disbursementData.disbursementItems || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">بيانات الصرف</h3>
      
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
        <div>
          <p className="text-sm text-gray-600">الموازنة الكلية</p>
          <p className="text-lg font-bold">
            {disbursementData.totalBudget?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">المبلغ المصروف</p>
          <p className="text-lg font-bold text-blue-600">
            {disbursementData.totalDisbursed?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">المتبقي</p>
          <p className="text-lg font-bold text-green-600">
            {disbursementData.remainingBudget?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">نسبة الصرف</p>
          <p className="text-lg font-bold">
            {disbursementData.disbursementPercentage || 0}%
          </p>
        </div>
      </div>

      {/* Disbursement Items Table */}
      <div>
        <h4 className="font-semibold mb-3">بنود الصرف</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم البند</TableHead>
              <TableHead>وصف البند</TableHead>
              <TableHead>المبلغ المخطط</TableHead>
              <TableHead>المبلغ المصروف</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>تاريخ الصرف</TableHead>
              <TableHead>رقم الفاتورة</TableHead>
              <TableHead>ملاحظات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.itemNumber}</TableCell>
                  <TableCell>{item.itemDescription}</TableCell>
                  <TableCell>{item.budgetedAmount?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="text-blue-600">{item.disbursedAmount?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="text-green-600">{item.remainingAmount?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell>
                    {item.disbursementDate ? new Date(item.disbursementDate).toLocaleDateString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{item.invoiceNumber || "-"}</TableCell>
                  <TableCell>{item.notes || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-4">
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
