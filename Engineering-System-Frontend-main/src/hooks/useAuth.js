// src/hooks/useAuth.js
import { useSelector } from "react-redux";

import { hasPermission, hasAnyPermission } from "../utils/permission.utils";
export const useAuth = () => {
    const { token, user, loading, initialized, error } = useSelector(
        (state) => state.auth
    );
    return {
        token,
        user,
        isLoading: loading,
        initialized,
        error,
        hasPermission: (action, resourceUnitId = null) =>
            hasPermission(user, action, resourceUnitId),
        hasAnyPermission: (permsArray, resourceUnitId = null) =>
            hasAnyPermission(user, permsArray, resourceUnitId),
    };
};