// src/components/ProtectedRoute.jsx
import { useAuth } from "../../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";

export default function ProtectedRoute({
  children,
  requirePermissions,
  resourceUnitId = null,
}) {
  const { token, hasAnyPermission, isLoading, initialized, user } = useAuth();
  const location = useLocation();
  console.log(initialized);
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!initialized || isLoading) {
    return <Loading />;
  }
  if (initialized && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (
    requirePermissions &&
    !hasAnyPermission(requirePermissions, resourceUnitId)
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
