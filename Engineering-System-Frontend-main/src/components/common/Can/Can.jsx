// frontend/src/components/Can.jsx

import React from "react";
import { useAuth } from "../../../hooks/useAuth";

/**
 * مكون Can: يعرض children فقط إذا كانت الصلاحية موجودة
 */
export default function Can({
  children,
  action, // صلاحية واحدة
  any, // مصفوفة من الصلاحيات
  unitId, // resourceUnitId
  fallback = null,
}) {
  const { hasPermission, hasAnyPermission } = useAuth();

  if (!hasPermission || !hasAnyPermission) return fallback;

  const allowed = any
    ? hasAnyPermission(any, unitId)
    : action
    ? hasPermission(action, unitId)
    : true;

  return allowed ? <>{children}</> : fallback;
}
