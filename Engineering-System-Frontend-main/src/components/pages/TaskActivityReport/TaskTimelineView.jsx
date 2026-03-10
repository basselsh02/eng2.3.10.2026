import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskTimeline } from "../../../api/workflowActivityAPI";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table/Table";

export default function TaskTimelineView() {
  const [taskId, setTaskId] = useState("");
  const [searchTaskId, setSearchTaskId] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["task-timeline", searchTaskId],
    queryFn: () => getTaskTimeline(searchTaskId),
    enabled: !!searchTaskId,
  });

  const handleSearch = () => {
    if (taskId.trim()) {
      setSearchTaskId(taskId.trim());
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 ث";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} س`);
    if (minutes > 0) parts.push(`${minutes} د`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} ث`);

    return parts.join(" ");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      at_manager: { text: "عند المدير", color: "bg-blue-100 text-blue-800" },
      at_employee: { text: "عند الموظف", color: "bg-yellow-100 text-yellow-800" },
      returned_to_previous: { text: "تم الإرجاع", color: "bg-red-100 text-red-800" },
      forwarded: { text: "تم التوجيه", color: "bg-green-100 text-green-800" },
    };

    const statusInfo = statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const timeline = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            معرف المهمة
          </label>
          <Input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="أدخل معرف المهمة"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>بحث</Button>
      </div>

      {/* Results */}
      {isLoading && <Loading />}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-gray-600">{error.response?.data?.message || error.message}</p>
        </div>
      )}

      {searchTaskId && !isLoading && !error && timeline.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لم يتم العثور على سجلات لهذه المهمة
        </div>
      )}

      {searchTaskId && !isLoading && !error && timeline.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">
            الجدول الزمني للمهمة: {searchTaskId}
          </h3>

          {timeline.map((log, index) => (
            <div key={log._id} className="border rounded-lg p-4 space-y-4">
              {/* Office Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {index + 1}. {log.officeId?.name} ({log.officeId?.code})
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    نوع المكتب: {log.officeId?.type}
                  </p>
                </div>
                <div className="text-left space-y-1">
                  {getStatusBadge(log.status)}
                  {log.wasReturned && (
                    <span className="block px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                      تم الإرجاع
                    </span>
                  )}
                  <p className="text-xs text-gray-500">
                    زيارة رقم: {log.visitCount}
                  </p>
                </div>
              </div>

              {/* Personnel Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {log.managerId && (
                  <div>
                    <span className="font-medium text-gray-700">المدير:</span>{" "}
                    {log.managerId.fullNameArabic}
                  </div>
                )}
                {log.employeeId && (
                  <div>
                    <span className="font-medium text-gray-700">الموظف:</span>{" "}
                    {log.employeeId.fullNameArabic}
                  </div>
                )}
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-xs text-gray-600">وقت الوصول</p>
                  <p className="font-medium text-sm">
                    {new Date(log.arrivedAt).toLocaleString("ar-EG")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">الوقت عند المدير</p>
                  <p className="font-medium text-sm">{formatDuration(log.timeAtManager)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">الوقت عند الموظف</p>
                  <p className="font-medium text-sm">{formatDuration(log.timeAtEmployee)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">إجمالي الوقت</p>
                  <p className="font-medium text-sm">{formatDuration(log.totalTimeInOffice)}</p>
                </div>
              </div>

              {/* Field Activities */}
              {log.fieldActivities && log.fieldActivities.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm mb-2">أنشطة الحقول:</h5>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>الإجراء</TableHead>
                        <TableHead>المورد</TableHead>
                        <TableHead>الحقل</TableHead>
                        <TableHead>الوقت</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {log.fieldActivities.map((activity) => (
                        <TableRow key={activity._id}>
                          <TableCell>
                            {activity.userId?.fullNameArabic || "غير معروف"}
                            <br />
                            <span className="text-xs text-gray-500">
                              ({activity.userRole})
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              activity.action === "READ" ? "bg-blue-100 text-blue-800" :
                              activity.action === "CREATE" ? "bg-green-100 text-green-800" :
                              activity.action === "UPDATE" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {activity.action}
                            </span>
                          </TableCell>
                          <TableCell>{activity.resource}</TableCell>
                          <TableCell>{activity.fieldName || "-"}</TableCell>
                          <TableCell className="text-xs">
                            {new Date(activity.timestamp).toLocaleString("ar-EG")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Notes */}
              {log.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm font-medium text-gray-700">ملاحظات:</p>
                  <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
