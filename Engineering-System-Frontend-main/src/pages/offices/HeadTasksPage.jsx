import api from "../../api/axiosInstance";
import { getUsers } from "../../api/userAPI";
import { useParams } from "react-router-dom";
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

export default function HeadTasksPage() {
  const { officeKey } = useParams();
  const [tasks, setTasks] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const officeName = officeNameMap[officeKey] || officeKey;

  const loadTasks = async () => {
    const response = await api.get("/office-tasks", { params: { office: officeName, limit: 100 } });
    setTasks(response.data?.data || []);
  };

  useEffect(() => {
    loadTasks();

    getUsers({ limit: 100 })
      .then((data) => setEmployees(data.data || []))
      .catch(() => setEmployees([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeName]);

  const handleAssign = async (task) => {
    const selectedEmployee = selectedEmployees[task._id] || "all";
    const isAll = selectedEmployee === "all";

    await api.patch(`/office-tasks/${task._id}/${isAll ? "assign-all" : "assign"}`,
      isAll ? { office: officeName } : { employeeId: selectedEmployee }
    );

    loadTasks();
  };

  return (
    <div dir="rtl" className="p-6">
      <h1 className="mb-4 text-2xl font-bold">مهام رئيس القسم — {officeName}</h1>
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
              <th className="border p-2">تعيين الموظف</th>
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
                <td className="border p-2">
                  <select
                    value={selectedEmployees[task._id] || "all"}
                    onChange={(event) =>
                      setSelectedEmployees((prev) => ({ ...prev, [task._id]: event.target.value }))
                    }
                    className="w-full rounded border p-1 text-right"
                  >
                    <option value="all">الكل</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.fullNameArabic || employee.fullName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleAssign(task)}
                    className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                  >
                    تعيين
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
