import React from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import GuaranteeModuleHeader from "./GuaranteeModuleHeader";

export default function GuaranteeLettersHome() {
  return (
    <div className="space-y-4" dir="rtl">
      <GuaranteeModuleHeader title="خطابات الضمان" />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link to="/guarantee-letters/claims-tracking"><Button className="w-full">متابعة دخول وخروج المستخلصات - TR001_CLAIMF</Button></Link>
          <Link to="/guarantee-letters/reports"><Button className="w-full">التقارير</Button></Link>
          <Link to="/guarantee-letters/register"><Button className="w-full">تسجيل خطابات الضمان - TR001GRNT_F</Button></Link>
        </div>
      </Card>
    </div>
  );
}
