import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";

export default function WorkItemsTab({ workItems = [] }) {
  const totalValue = workItems.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">بنود الأعمال</h3>
        {workItems.length > 0 && (
          <div className="text-sm bg-primary-50 px-4 py-2 rounded-lg">
            <span className="text-gray-600">إجمالي القيمة: </span>
            <span className="font-bold text-primary-700">
              {totalValue.toLocaleString("ar-EG")} جنيه
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المسلسل</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>القيمة</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>الوحدة</TableHead>
              <TableHead>كود الصنف</TableHead>
              <TableHead>وصف البند</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workItems.length > 0 ? (
              workItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.serial || index + 1}</TableCell>
                  <TableCell className="font-semibold">
                    {item.total?.toLocaleString("ar-EG") || "0"}
                  </TableCell>
                  <TableCell>{item.value?.toLocaleString("ar-EG") || "0"}</TableCell>
                  <TableCell>{item.quantity || "0"}</TableCell>
                  <TableCell>{item.unit || "-"}</TableCell>
                  <TableCell>{item.code || "-"}</TableCell>
                  <TableCell className="max-w-md">{item.desc || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  لا توجد بنود أعمال محددة لهذا المشروع
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}