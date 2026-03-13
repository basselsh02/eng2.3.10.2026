import api from "../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const officeNameMap = {
  maintenance: "مكتب الصيانة",
  contracts: "مكتب العقود",
  accounting: "مكتب الحسابات",
  procurement: "مكتب المشتريات",
  supplies: "مكتب التوريدات",
  budget: "مكتب الميزانية",
  publishing: "مكتب النشر",
};

const officeTargetPageMap = {
  maintenance: "/projects",
  contracts: "/contracts",
  accounting: "/extract-advances",
  procurement: "/procurements",
  supplies: "/materials",
  budget: "/planning-budget",
  publishing: "/outgoing-letters",
};

export default function EmployeeTasksPage() {
  const { officeKey } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(null);
  const officeName = officeNameMap[officeKey] || officeKey;

  useEffect(() => {
    api
      .get("/office-tasks", { params: { office: officeName, limit: 100 } })
      .then((response) => {
        setTasks(response.data?.data || []);
      })
      .catch(() => setTasks([]));
  }, [officeName]);

  const handleEnterTask = (task) => {
    navigate(officeTargetPageMap[officeKey] || "/", {
      state: { autoFilter: { office: officeName, taskId: task._id } },
    });
  };

  return (
    <div dir="rtl" className="p-6">
      <h1 className="mb-4 text-2xl font-bold">مهام الموظف بمكتب {officeName}</h1>
      {tasks === null ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-right">
          <thead>
            <tr style={{ backgroundColor: "#1f4e79", color: "white" }}>
              <th className="border p-2">اسم المهمة</th>
              <th className="border p-2">تاريخ الورود بالمكتب</th>
              <th className="border p-2">تاريخ تعيين الموظف</th>
              <th className="border p-2">اسم الموظف</th>
              <th className="border p-2">الدخول للمهمة</th>
              <th className="border p-2">تاريخ الخروج</th>
              <th className="border p-2">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="border p-2">{task.taskName}</td>
                <td className="border p-2">
                  {task.arrivedAt ? new Date(task.arrivedAt).toLocaleDateString("ar-EG") : "—"}
                </td>
                <td className="border p-2">
                  {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString("ar-EG") : "—"}
                </td>
                <td className="border p-2">{task.employee?.fullNameArabic || task.employee?.fullName || "—"}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEnterTask(task)}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    دخول
                  </button>
                </td>
                <td className="border p-2">
                  {task.exitDate ? new Date(task.exitDate).toLocaleDateString("ar-EG") : "—"}
                </td>
                <td className="border p-2">{task.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
