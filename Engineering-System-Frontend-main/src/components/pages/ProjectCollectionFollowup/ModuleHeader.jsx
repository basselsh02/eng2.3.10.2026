import React from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button/Button";
import PageTitle from "../../ui/PageTitle/PageTitle";

export default function ModuleHeader({ code, dateLabel, title, subTitle }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-md text-sm font-semibold">
            {code}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-md text-sm">{dateLabel}</span>
        </div>

        <div className="text-center">
          <PageTitle title={title} subTitle={subTitle} />
        </div>

        <div className="flex gap-2">
          <Link to="/project-publication">
            <Button variant="secondary" size="sm">
              قسم النشر
            </Button>
          </Link>
          <Link to="/project-collection-followup">
            <Button variant="secondary" size="sm">
              متابعة التحصيل للمشروعات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
