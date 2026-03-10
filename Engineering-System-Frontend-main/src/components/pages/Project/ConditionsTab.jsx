import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";

export default function ConditionsTab({ conditions = [] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">شروط المشروع</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ترتيب الشروط</TableHead>
              <TableHead>القيمة</TableHead>
              <TableHead>وصف الشرط</TableHead>
              <TableHead>مسلسل الكود</TableHead>
              <TableHead>اسم نوع الشرط</TableHead>
              <TableHead>كود نوع الشرط</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conditions.length > 0 ? (
              conditions.map((condition, index) => (
                <TableRow key={index}>
                  <TableCell>{condition.order || "-"}</TableCell>
                  <TableCell>{condition.value || "-"}</TableCell>
                  <TableCell className="max-w-md">{condition.desc || "-"}</TableCell>
                  <TableCell>{condition.serial || "-"}</TableCell>
                  <TableCell>{condition.name || "-"}</TableCell>
                  <TableCell>{condition.code || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  لا توجد شروط محددة لهذا المشروع
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
