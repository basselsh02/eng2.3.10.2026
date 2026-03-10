// frontend/src/utils/permission.utils.js


export const hasPermission = (user, requiredAction, resourceUnitId = null) => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;

    const matchingPerm = user.permissions.find(perm => perm.action === requiredAction); // find by action
    if (!matchingPerm) return false;

    // للـ menu وقوائم: resourceUnitId دايمًا null → مسموح بأي scope
    if (resourceUnitId === null) {
        return true;
    }

    // لو resourceUnitId موجود (مش هيحصل في الـ Sidebar)
    if (matchingPerm.scope === "ALL") return true;

    const userUnitId = user.organizationalUnit?._id?.toString() || user.organizationalUnit?.toString();

    if (matchingPerm.scope === "OWN_UNIT") {
        return userUnitId === resourceUnitId.toString();
    }

    if (matchingPerm.scope === "CUSTOM_UNITS") {
        return matchingPerm.units.some(unit => unit.toString() === resourceUnitId.toString());
    }

    if (matchingPerm.scope === "OWN_UNIT_AND_CHILDREN") {
        // لو الـ path موجود في الـ user (من login)
        if (user.organizationalUnit?.path) {
            return user.organizationalUnit.path.some(p => p.toString() === resourceUnitId.toString());
        }
        return false; // fallback
    }

    return false;
};

export const hasAnyPermission = (user, permsArray, resourceUnitId = null) => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;

    const actions = Array.isArray(permsArray) ? permsArray : [permsArray]; //
    return actions.some(action => hasPermission(user, action, resourceUnitId));
};