import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUserActivity } from "../../../api/workflowActivityAPI";
import { getUsers } from "../../../api/userAPI";
import Input from "../../ui/Input/Input";
import Loading from "../../common/Loading/Loading";
import Pagination from "../../ui/Pagination/Pagination";

export default function UserActivityView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    taskId: "",
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-dropdown"],
    queryFn: () => getUsers({ page: 1, limit: 1000 }),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-activity", filters.userId, filters, page],
    queryFn: () =>
      getUserActivity(filters.userId, {
        startDate: filters.startDate,
        endDate: filters.endDate,
        taskId: filters.taskId,
        page,
        limit: 50,
      }),
    enabled: !!filters.userId,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setSearchParams({ page: "1" });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  const getActionBadge = (action) => {
    const actionMap = {
      READ: { text: "قراءة", color: "bg-blue-100 text-blue-800" },
      CREATE: { text: "إنشاء", color: "bg-green-100 text-green-800" },
      UPDATE: { text: "تحديث", color: "bg-yellow-100 text-yellow-800" },
      LOGIN_IDLE: { text: "خامل", color: "bg-gray-100 text-gray-800" },
    };

    const actionInfo = actionMap[action] || { text: action, color: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${actionInfo.color}`}>
        {actionInfo.text}
      </span>
    );
  };

  const users = usersData?.data?.users || usersData?.data || [];
  const activities = data?.data?.activities || [];
  const groupedByDate = data?.data?.groupedByDate || {};
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المستخدم *
          </label>
          <select
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر مستخدم</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullNameArabic} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">معرف المهمة</label>
          <Input
            type="text"
            name="taskId"
            value={filters.taskId}
            onChange={handleFilterChange}
            placeholder="اختياري"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
          <Input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
          <Input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Results */}
      {isLoading && <Loading />}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
        </div>
      )}

      {!filters.userId && (
        <div className="text-center py-8 text-gray-500">
          الرجاء اختيار مستخدم لعرض النشاط
        </div>
      )}

      {filters.userId && !isLoading && !error && activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">لا يوجد نشاط لهذا المستخدم</div>
      )}

      {filters.userId && !isLoading && !error && activities.length > 0 && (
        <div className="space-y-6">
          {/* Grouped by Date */}
          {Object.keys(groupedByDate).map((date) => (
            <div key={date} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">{date}</h3>

              <div className="space-y-3">
                {groupedByDate[date].map((activity) => (
                  <div key={activity._id} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center">
                        {getActionBadge(activity.action)}
                        <span className="text-sm font-medium">{activity.resource}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString("ar-EG")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {activity.taskId && activity.taskId !== "NO_TASK" && (
                        <div>
                          <span className="font-medium text-gray-700">المهمة:</span> {activity.taskId}
                        </div>
                      )}
                      {activity.resourceId && (
                        <div>
                          <span className="font-medium text-gray-700">معرف المورد:</span>{" "}
                          {activity.resourceId}
                        </div>
                      )}
                      {activity.fieldName && (
                        <div>
                          <span className="font-medium text-gray-700">الحقل:</span>{" "}
                          {activity.fieldName}
                        </div>
                      )}
                    </div>

                    {activity.action === "UPDATE" && (activity.oldValue || activity.newValue) && (
                      <div className="mt-2 pt-2 border-t border-gray-300 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">القيمة القديمة:</span>{" "}
                            <span className="text-gray-600">
                              {JSON.stringify(activity.oldValue) || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">القيمة الجديدة:</span>{" "}
                            <span className="text-gray-600">
                              {JSON.stringify(activity.newValue) || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
