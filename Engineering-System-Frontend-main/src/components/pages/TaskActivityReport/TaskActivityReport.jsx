import React, { useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import TaskTimelineView from "./TaskTimelineView";
import OfficeWorkloadView from "./OfficeWorkloadView";
import UserActivityView from "./UserActivityView";

export default function TaskActivityReport() {
  const [activeView, setActiveView] = useState("timeline");

  return (
    <div>
      <PageTitle title="تقرير نشاط المهام" />

      <div className="bg-white shadow rounded-lg p-6">
        {/* View Selector */}
        <div className="flex gap-2 mb-6 border-b pb-4">
          <Button
            variant={activeView === "timeline" ? "primary" : "secondary"}
            onClick={() => setActiveView("timeline")}
          >
            الجدول الزمني للمهمة
          </Button>
          <Button
            variant={activeView === "workload" ? "primary" : "secondary"}
            onClick={() => setActiveView("workload")}
          >
            عبء عمل المكتب
          </Button>
          <Button
            variant={activeView === "user" ? "primary" : "secondary"}
            onClick={() => setActiveView("user")}
          >
            نشاط المستخدم
          </Button>
        </div>

        {/* Active View */}
        {activeView === "timeline" && <TaskTimelineView />}
        {activeView === "workload" && <OfficeWorkloadView />}
        {activeView === "user" && <UserActivityView />}
      </div>
    </div>
  );
}
