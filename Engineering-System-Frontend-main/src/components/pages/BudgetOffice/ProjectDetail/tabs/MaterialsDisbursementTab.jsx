import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../ui/Table/Table";

export default function MaterialsDisbursementTab({ statement }) {
  const materialsDisbursement = statement?.materialsDisbursement || {};
  const materials = materialsDisbursement.materials || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">صرف خامات</h3>
      </div>

      {/* Materials Table */}
      <div>
        <h4 className="font-semibold mb-3">قائمة الخامات</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>وصف الخامات</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>الوحدة</TableHead>
                <TableHead>وصف الوحدة</TableHead>
                <TableHead>سعر الوحدة</TableHead>
                <TableHead>الاجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <TableRow key={index}>
                    <TableCell>{material.code || "-"}</TableCell>
                    <TableCell className="font-semibold">{material.materialsDescription || "-"}</TableCell>
                    <TableCell>{material.quantity?.toLocaleString('ar-EG') || "-"}</TableCell>
                    <TableCell>{material.unit || "-"}</TableCell>
                    <TableCell>{material.unitDescription || "-"}</TableCell>
                    <TableCell>{material.unitPrice?.toLocaleString('ar-EG') || "-"}</TableCell>
                    <TableCell className="font-semibold">
                      {material.total?.toLocaleString('ar-EG') || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    لا توجد خامات مسجلة
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
