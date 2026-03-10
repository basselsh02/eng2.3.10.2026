import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";

export default function CompanyFilteringTab({ candidateCompanies = [], registeredCompanies = [] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">ترشيح الشركات</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Companies */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-4 text-center bg-primary-100 py-2 rounded">
            اسم الشركات المرشحة ({candidateCompanies.length})
          </h4>
          <div className="space-y-2">
            {candidateCompanies.length > 0 ? (
              candidateCompanies.map((company, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded px-4 py-3 text-center hover:bg-primary-50 transition-colors"
                >
                  {company}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                لا توجد شركات مرشحة
              </div>
            )}
          </div>
        </div>

        {/* Registered Companies */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-center bg-green-100 py-2 rounded">
            الشركات المسجلة ({registeredCompanies.length})
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم اسم السجل</TableHead>
                  <TableHead>رقم السجل</TableHead>
                  <TableHead>اسم الشركة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredCompanies.length > 0 ? (
                  registeredCompanies.map((company, index) => (
                    <TableRow key={index}>
                      <TableCell>{company.recordNameNumber || "-"}</TableCell>
                      <TableCell>{company.recordNumber || "-"}</TableCell>
                      <TableCell>{company.companyName || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      لا توجد شركات مسجلة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">إجمالي الشركات المرشحة</p>
            <p className="text-3xl font-bold text-blue-700">{candidateCompanies.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">الشركات المسجلة</p>
            <p className="text-3xl font-bold text-green-700">{registeredCompanies.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">معدل التسجيل</p>
            <p className="text-3xl font-bold text-purple-700">
              {candidateCompanies.length > 0
                ? Math.round((registeredCompanies.length / candidateCompanies.length) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
