import React from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import ModuleHeader from "./ModuleHeader";
import { arabicDate } from "./mockData";

export default function ProjectCollectionFollowupHome() {
  return (
    <div dir="rtl" className="space-y-4">
      <ModuleHeader code="MODULE" dateLabel={arabicDate} title="متابعة التحصيل للمشروعات" />
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link to="/project-collection-followup/settlements"><Button className="w-full">متابعة التسويات - TR001_SUPPLYF</Button></Link>
          <Link to="/project-collection-followup/reports"><Button className="w-full">طباعة التقارير - TR002_SUPPLYF</Button></Link>
          <Link to="/project-collection-followup/project-status/1"><Button className="w-full">تسجيل الموقف الحالي للمشروع - TR006_MFS</Button></Link>
          <Link to="/project-collection-followup/sales-tax/1"><Button className="w-full">نموذج ضريبة المبيعات - TR0515_F</Button></Link>
        </div>
      </Card>
    </div>
  );
}
