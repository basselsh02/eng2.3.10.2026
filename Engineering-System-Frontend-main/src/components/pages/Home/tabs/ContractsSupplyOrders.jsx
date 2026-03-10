import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContracts } from "../../../../api/contractAPI";
import { getAllPaymentOrders } from "../../../../api/paymentOrder";
import { getProcurements } from "../../../../api/procurementsAPI";
import Button from "../../../ui/Button/Button";
import { FaAngleLeft } from "react-icons/fa6";

export default function ContractsSupplyOrders() {
  const { data: contractsRes, isLoading: contractsLoading } = useQuery({
    queryKey: ["contractsHome"],
    queryFn: () => getAllContracts({ page: 1, limit: 100 }),
  });

  const { data: paymentOrdersRes, isLoading: paymentOrdersLoading } = useQuery({
    queryKey: ["paymentOrdersHome"],
    queryFn: () => getAllPaymentOrders({ page: 1, limit: 100 }),
  });

  const { data: procurementsRes, isLoading: procurementsLoading } = useQuery({
    queryKey: ["procurementsHome"],
    queryFn: () => getProcurements({ page: 1, limit: 100 }),
  });

  const contracts = contractsRes?.data || [];
  const paymentOrders = paymentOrdersRes || [];
  const procurements = procurementsRes?.data || [];

  const totalContractsValue = contracts.reduce((sum, contract) => sum + (contract.contractValue || 0), 0);
  const totalPaymentOrdersValue = paymentOrders.reduce((sum, order) => sum + (order.value || 0), 0);
  const totalProcurementsValue = procurements.reduce((sum, procurement) => sum + (procurement.value || 0), 0);
  
  // Get the latest procurement
  const latestProcurement = procurements.length > 0 ? procurements[0] : null;

  return (
    <>
      <section>
        <h1 className="text-xl font-bold text-primary-500 dark:text-white mb-4">
          العقود
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                إحصائيات العقود
              </h2>
            </div>
            <div className="p-4">
              {contractsLoading ? (
                <p>جاري التحميل...</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center">
                    <span>عدد العقود</span>
                    <span>{contracts.length}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>إجمالي قيمة العقود</span>
                    <span>{totalContractsValue.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>العقود النشطة</span>
                    <span>{contracts.filter(c => c.status === 'active').length}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>



          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                أحدث العقود
              </h2>
            </div>
            <div className="p-4">
              {contractsLoading ? (
                <p>جاري التحميل...</p>
              ) : contracts.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {contracts.slice(0, 5).map((contract) => (
                    <li key={contract._id} className="flex justify-between items-center">
                      <span className="truncate">
                        {contract.contractNumber || "رقم غير محدد"}
                      </span>
                      <span>{contract.contractValue?.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">لا توجد عقود</p>
              )}
            </div>
            <div className="flex items-center justify-center py-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full rounded-t-none text-indigo-500"
                icon={<FaAngleLeft />}
                iconPosition="end"
                onClick={() => window.location.href = "/contracts"}
              >
                عرض المزيد
              </Button>
            </div>
          </div>


        </div>

        <h1 className="text-xl font-bold text-primary-500 dark:text-white mb-4 mt-6">
          طلبات التوريد
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                إحصائيات أوامر التوريد
              </h2>
            </div>
            <div className="p-4">
              {procurementsLoading ? (
                <p>جاري التحميل...</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center">
                    <span>عدد أوامر التوريد</span>
                    <span>{procurements.length}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>إجمالي قيمة أوامر التوريد</span>
                    <span>{totalProcurementsValue.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>أحدث أمر توريد</span>
                    <span>{latestProcurement ? latestProcurement.approvalCode : '-'}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="bg-base shadow rounded-md overflow-hidden">
            <div className="bg-gray-200 dark:text-black rounded-bl-full">
              <h2 className="text-xl font-bold p-2 text-center">
                أحدث طلبات التوريد
              </h2>
            </div>
            <div className="p-4">
              {procurementsLoading ? (
                <p>جاري التحميل...</p>
              ) : procurements.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {procurements.slice(0, 5).map((procurement) => (
                    <li key={procurement._id} className="flex justify-between items-center">
                      <span className="truncate">
                        {procurement.name || "اسم غير محدد"}
                      </span>
                      <span>{procurement.value?.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">لا توجد طلبات توريد</p>
              )}
            </div>
            <div className="flex items-center justify-center py-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full rounded-t-none text-indigo-500"
                icon={<FaAngleLeft />}
                iconPosition="end"
                onClick={() => window.location.href = "/procurements"}
              >
                عرض المزيد
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}