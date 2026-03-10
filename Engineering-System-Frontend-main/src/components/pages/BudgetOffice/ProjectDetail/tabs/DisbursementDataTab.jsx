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
      
      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="كود الشركة"
          value={disbursementData.companyCode || ""}
          readOnly
        />
        <Input
          label="اسم الشركة"
          value={disbursementData.companyName || ""}
          readOnly
        />
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <span className="text-sm text-gray-600">إجمالي الموازنة</span>
          <p className="text-xl font-bold text-blue-600">
            {disbursementData.totalBudget?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <span className="text-sm text-gray-600">إجمالي المصروف</span>
          <p className="text-xl font-bold text-green-600">
            {disbursementData.totalDisbursed?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <span className="text-sm text-gray-600">المتبقي</span>
          <p className="text-xl font-bold text-orange-600">
            {disbursementData.remainingBudget?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <span className="text-sm text-gray-600">نسبة الصرف</span>
          <p className="text-xl font-bold text-purple-600">
            {disbursementData.disbursementPercentage || "0"}%
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h4 className="font-semibold mb-3">بنود الصرف</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم البند</TableHead>
              <TableHead>وصف البند</TableHead>
              <TableHead>المبلغ المخصص</TableHead>
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
                  <TableCell className="font-semibold">
                    {item.budgetedAmount?.toLocaleString('ar-EG') || "0"}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {item.disbursedAmount?.toLocaleString('ar-EG') || "0"}
                  </TableCell>
                  <TableCell className="font-semibold text-orange-600">
                    {item.remainingAmount?.toLocaleString('ar-EG') || "0"}
                  </TableCell>
                  <TableCell>
                    {item.disbursementDate ? new Date(item.disbursementDate).toLocaleDateString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{item.invoiceNumber || "-"}</TableCell>
                  <TableCell>{item.notes || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
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
