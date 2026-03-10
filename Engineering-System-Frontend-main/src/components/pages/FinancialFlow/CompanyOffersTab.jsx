import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";
import Input from "../../ui/Input/Input";

export default function CompanyOffersTab({ data }) {
  const companyData = data.companyData || {};
  const offersList = data.companyOffersList || [];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">عروض الشركات</h3>

      {/* Company Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <Input
          label="كود الشركة"
          value={companyData.companyCode || ""}
          readOnly
        />
        <Input
          label="اسم الشركة"
          value={companyData.companyName || "مكتب الشبكي للمقاولات"}
          readOnly
        />
        <Input
          label="نوع العرض"
          value={companyData.offerType || "عرض الماسي"}
          readOnly
        />
        <Input
          label="رقم العرض"
          value={companyData.offerNumber || "50"}
          readOnly
        />
        <Input
          label="ترتيب المسلسل"
          value={companyData.serialOrder || "202"}
          readOnly
        />
        <Input
          label="تاريخ العرض"
          type="date"
          value={companyData.offerDate ? new Date(companyData.offerDate).toISOString().split('T')[0] : ""}
          readOnly
        />
      </div>

      {/* Company Offers Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تاريخ بداية العرض</TableHead>
              <TableHead>تاريخ العرض</TableHead>
              <TableHead>ترتيب المسلسل</TableHead>
              <TableHead>رقم العرض</TableHead>
              <TableHead>نوع العرض</TableHead>
              <TableHead>اسم الشركة</TableHead>
              <TableHead>كود الشركة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offersList.length > 0 ? (
              offersList.map((offer, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {offer.offerStartDate
                      ? new Date(offer.offerStartDate).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </TableCell>
                  <TableCell>
                    {offer.offerDate
                      ? new Date(offer.offerDate).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </TableCell>
                  <TableCell>{offer.serialOrder || "-"}</TableCell>
                  <TableCell>{offer.offerNumber || "-"}</TableCell>
                  <TableCell>{offer.offerType || "-"}</TableCell>
                  <TableCell>{offer.companyName || "-"}</TableCell>
                  <TableCell>{offer.companyCode || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  لا توجد عروض متاحة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}