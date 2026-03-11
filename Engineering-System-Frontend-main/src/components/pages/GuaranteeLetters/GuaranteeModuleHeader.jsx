import React from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button/Button";

export default function GuaranteeModuleHeader({ code, title, secondaryLink = "خطابات الضمان", secondaryPath = "/guarantee-letters" }) {
  const dateLabel = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg shadow p-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {code && <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-md text-sm font-semibold">{code}</span>}
          <span className="bg-gray-100 px-3 py-1 rounded-md text-sm">{dateLabel}</span>
        </div>

        <h1 className="text-xl font-bold text-center">{title}</h1>

        <div className="flex gap-2">
          <Link to="/provisioning-branch"><Button variant="secondary" size="sm">فرع التموين</Button></Link>
          <Link to={secondaryPath}><Button variant="secondary" size="sm">{secondaryLink}</Button></Link>
        </div>
      </div>
    </div>
  );
}
