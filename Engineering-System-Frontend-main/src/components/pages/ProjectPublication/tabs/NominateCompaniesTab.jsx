import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../ui/Table/Table";

export default function NominateCompaniesTab({ project }) {
  const candidateCompanies = project.candidateCompanies || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ترشيح الشركات</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الاسم والسجل</TableHead>
            <TableHead>رقم السجل</TableHead>
            <TableHead>الشركات</TableHead>
            <TableHead>رقم التسجيل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidateCompanies.length > 0 ? (
            candidateCompanies.map((company, index) => (
              <TableRow key={index}>
                <TableCell>{company.recordNameNumber || "-"}</TableCell>
                <TableCell>{company.recordNumber || "-"}</TableCell>
                <TableCell className="font-semibold">{company.companies || "-"}</TableCell>
                <TableCell>{company.registrationNumber || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                لا توجد شركات مرشحة
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
