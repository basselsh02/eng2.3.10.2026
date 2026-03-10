import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import toast from "react-hot-toast";

export default function PrintMemosTab({ project }) {
  const memosList = project.publicationMemosList || [];

  const handlePrint = (memo) => {
    toast.success(`طباعة مذكرة: ${memo.memoName}`);
    // Implement actual print logic here
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">طباعة المذكرات</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الإجراءات</TableHead>
            <TableHead>زر المذكرة</TableHead>
            <TableHead>اسم المذكرة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memosList.length > 0 ? (
            memosList.map((memo, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handlePrint(memo)}
                  >
                    طباعة
                  </Button>
                </TableCell>
                <TableCell>{memo.memoButton || "-"}</TableCell>
                <TableCell className="font-semibold">{memo.memoName || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                لا توجد مذكرات متاحة للطباعة
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
