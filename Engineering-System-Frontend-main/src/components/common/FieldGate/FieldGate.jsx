import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getMyFieldPermissions } from "../../../api/fieldPermissionsAPI";

// Create context for field permissions
const FieldPermissionsContext = createContext(null);

/**
 * Provider component to load and cache field permissions
 */
export function FieldPermissionsProvider({ children }) {
  const { user } = useAuth();
  const [fieldPermissions, setFieldPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFieldPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyFieldPermissions();
        
        if (response.success) {
          if (response.data.hasAllPermissions) {
            // SUPER_ADMIN: all fields allowed
            setFieldPermissions({ hasAllPermissions: true });
          } else {
            // Store permissions by resource
            setFieldPermissions(response.data.permissions || {});
          }
        }
      } catch (error) {
        console.error("Failed to load field permissions:", error);
        // Default to allowing everything on error (fail-open for better UX)
        setFieldPermissions({ hasAllPermissions: true });
      } finally {
        setLoading(false);
      }
    };

    loadFieldPermissions();
  }, [user]);

  return (
    <FieldPermissionsContext.Provider value={{ fieldPermissions, loading }}>
      {children}
    </FieldPermissionsContext.Provider>
  );
}

/**
 * Hook to access field permissions
 */
export function useFieldPermissions() {
  const context = useContext(FieldPermissionsContext);
  
  if (context === undefined) {
    throw new Error("useFieldPermissions must be used within FieldPermissionsProvider");
  }

  return context;
}

/**
 * Check if a field can be accessed with a specific permission type
 */
export function useCanAccessField(resource, fieldName, permissionType) {
  const { fieldPermissions, loading } = useFieldPermissions();

  if (loading) {
    return { canAccess: true, loading: true }; // Show fields while loading
  }

  if (!fieldPermissions) {
    return { canAccess: true, loading: false }; // Default to allowed
  }

  // SUPER_ADMIN has access to all fields
  if (fieldPermissions.hasAllPermissions) {
    return { canAccess: true, loading: false };
  }

  // Check specific permission
  const resourcePerms = fieldPermissions[resource];
  
  if (!resourcePerms) {
    return { canAccess: true, loading: false }; // No restrictions for this resource
  }

  const typePerms = resourcePerms[permissionType];
  
  if (!typePerms) {
    return { canAccess: true, loading: false }; // No restrictions for this type
  }

  const allowed = typePerms[fieldName];
  
  // If permission is explicitly set, use it; otherwise default to true
  return {
    canAccess: allowed !== false,
    loading: false,
  };
}

/**
 * FieldGate Component
 * Controls visibility and editability of form fields based on permissions
 * 
 * @param {string} resource - The resource/model name (e.g., "Project", "User")
 * @param {string} fieldName - The field name to check permission for
 * @param {string} mode - "read" | "write" | "update" - The operation mode
 * @param {React.ReactNode} children - The field component(s) to render
 * @param {boolean} hideIfDenied - If true, completely hide the field; if false, show as read-only
 * @param {React.ReactNode} fallback - Optional fallback to show when access is denied
 */
export default function FieldGate({
  resource,
  fieldName,
  mode = "read",
  children,
  hideIfDenied = false,
  fallback = null,
}) {
  const permissionType = mode.toUpperCase();
  const { canAccess, loading } = useCanAccessField(resource, fieldName, permissionType);

  // While loading, show the field (optimistic rendering)
  if (loading) {
    return <>{children}</>;
  }

  // If access is denied
  if (!canAccess) {
    // Hide completely
    if (hideIfDenied) {
      return fallback;
    }

    // Show as read-only or disabled
    // Try to clone children and add disabled prop
    try {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            disabled: true,
            readOnly: true,
            className: `${child.props.className || ""} opacity-60 cursor-not-allowed`,
          });
        }
        return child;
      });
    } catch (error) {
      // If cloning fails, just return the children as-is
      return <>{children}</>;
    }
  }

  // Access granted - render normally
  return <>{children}</>;
}

/**
 * Helper component for conditional field rendering based on multiple permission types
 */
export function FieldGateMulti({
  resource,
  fieldName,
  modes = [],
  requireAll = false,
  children,
  hideIfDenied = false,
  fallback = null,
}) {
  const checks = modes.map((mode) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCanAccessField(resource, fieldName, mode.toUpperCase())
  );

  const loading = checks.some((check) => check.loading);
  const canAccess = requireAll
    ? checks.every((check) => check.canAccess)
    : checks.some((check) => check.canAccess);

  if (loading) {
    return <>{children}</>;
  }

  if (!canAccess) {
    if (hideIfDenied) {
      return fallback;
    }

    try {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            disabled: true,
            readOnly: true,
            className: `${child.props.className || ""} opacity-60 cursor-not-allowed`,
          });
        }
        return child;
      });
    } catch (error) {
      return <>{children}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Hook to filter object fields based on READ permissions
 */
export function useFilterReadableFields(resource, data) {
  const { fieldPermissions, loading } = useFieldPermissions();

  if (loading || !data) {
    return data;
  }

  if (!fieldPermissions || fieldPermissions.hasAllPermissions) {
    return data;
  }

  const resourcePerms = fieldPermissions[resource];
  
  if (!resourcePerms || !resourcePerms.READ) {
    return data;
  }

  // Filter out fields that are explicitly denied
  const filtered = {};
  
  for (const [key, value] of Object.entries(data)) {
    const allowed = resourcePerms.READ[key];
    if (allowed !== false) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Hook to get list of writable fields for a resource
 */
export function useWritableFields(resource) {
  const { fieldPermissions, loading } = useFieldPermissions();

  if (loading) {
    return { fields: [], loading: true };
  }

  if (!fieldPermissions || fieldPermissions.hasAllPermissions) {
    return { fields: null, loading: false }; // null means all fields
  }

  const resourcePerms = fieldPermissions[resource];
  
  if (!resourcePerms || !resourcePerms.WRITE) {
    return { fields: null, loading: false }; // No restrictions
  }

  const writableFields = Object.entries(resourcePerms.WRITE)
    .filter(([_, allowed]) => allowed !== false)
    .map(([fieldName]) => fieldName);

  return { fields: writableFields, loading: false };
}

/**
 * Hook to get list of updatable fields for a resource
 */
export function useUpdatableFields(resource) {
  const { fieldPermissions, loading } = useFieldPermissions();

  if (loading) {
    return { fields: [], loading: true };
  }

  if (!fieldPermissions || fieldPermissions.hasAllPermissions) {
    return { fields: null, loading: false }; // null means all fields
  }

  const resourcePerms = fieldPermissions[resource];
  
  if (!resourcePerms || !resourcePerms.UPDATE) {
    return { fields: null, loading: false }; // No restrictions
  }

  const updatableFields = Object.entries(resourcePerms.UPDATE)
    .filter(([_, allowed]) => allowed !== false)
    .map(([fieldName]) => fieldName);

  return { fields: updatableFields, loading: false };
}
