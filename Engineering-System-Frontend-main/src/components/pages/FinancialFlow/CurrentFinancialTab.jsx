import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";

export default function CurrentFinancialTab({ data }) {
  const items = data.currentFinancial?.items || [];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">إجراءات البث المالي - بنود الأعمال</h3>

      {/* Work Items Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم البند</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>سعر الوحدة</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>الوحدة</TableHead>
              <TableHead>اسم الصنف</TableHead>
              <TableHead>كود الصنف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-semibold">
                    {item.total?.toLocaleString("ar-EG") || "0"}
                  </TableCell>
                  <TableCell>
                    {item.unitPrice?.toLocaleString("ar-EG") || "0"}
                  </TableCell>
                  <TableCell>{item.quantity || "0"}</TableCell>
                  <TableCell>{item.unit || "-"}</TableCell>
                  <TableCell>{item.itemName || "تم التعاقد بالمناقصة المحدودة"}</TableCell>
                  <TableCell>{item.itemCode || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  لا توجد بنود أعمال متاحة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Card */}
      {items.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي البنود</p>
              <p className="text-2xl font-bold text-primary-700">{items.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الكمية</p>
              <p className="text-2xl font-bold text-primary-700">
                {items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0).toLocaleString("ar-EG")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">القيمة الإجمالية</p>
              <p className="text-2xl font-bold text-primary-700">
                {items.reduce((sum, item) => sum + (Number(item.total) || 0), 0).toLocaleString("ar-EG")} جنيه
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
