import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";

export default function MaterialsDisbursementTab({ statement }) {
  const materialsDisbursement = statement?.materialsDisbursement || {};
  const materials = materialsDisbursement.materials || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">صرف الخامات</h3>
      
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded">
        <div>
          <p className="text-sm text-gray-600">موازنة الخامات الكلية</p>
          <p className="text-lg font-bold">
            {materialsDisbursement.totalMaterialsBudget?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">الخامات المصروفة</p>
          <p className="text-lg font-bold text-blue-600">
            {materialsDisbursement.totalMaterialsDisbursed?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">المتبقي من الخامات</p>
          <p className="text-lg font-bold text-green-600">
            {materialsDisbursement.remainingMaterialsBudget?.toLocaleString('ar-EG') || "0"}
          </p>
        </div>
      </div>

      {/* Materials Table */}
      <div>
        <h4 className="font-semibold mb-3">تفاصيل صرف الخامات</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>كود المادة</TableHead>
              <TableHead>اسم المادة</TableHead>
              <TableHead>الوحدة</TableHead>
              <TableHead>الكمية المخططة</TableHead>
              <TableHead>الكمية المصروفة</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>الإجمالي المخطط</TableHead>
              <TableHead>الإجمالي المصروف</TableHead>
              <TableHead>تاريخ الصرف</TableHead>
              <TableHead>المخزن</TableHead>
              <TableHead>رقم الإيصال</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((material, index) => (
                <TableRow key={index}>
                  <TableCell>{material.materialCode}</TableCell>
                  <TableCell className="font-semibold">{material.materialName}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>{material.budgetedQuantity?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="text-blue-600">{material.disbursedQuantity?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="text-green-600">{material.remainingQuantity?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell>{material.budgetedTotal?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="text-blue-600">{material.disbursedTotal?.toLocaleString('ar-EG')}</TableCell>
                  <TableCell>
                    {material.disbursementDate ? new Date(material.disbursementDate).toLocaleDateString('ar-EG') : "-"}
                  </TableCell>
                  <TableCell>{material.storeName || "-"}</TableCell>
                  <TableCell>{material.receiptNumber || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-gray-500 py-4">
                  لا توجد بيانات صرف خامات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
