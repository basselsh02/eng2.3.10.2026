export const permissionGroups = [
    {
        id: "users",
        label: "إدارة المستخدمين",
        description: "التحكم في المستخدمين وصلاحياتهم",
        prefix: "users:",
        permissions: [
            { name: "create", label: "إضافة مستخدم", description: "السماح بإنشاء مستخدمين جدد" },
            {
                name: "update",
                label: "تعديل مستخدم",
                description: "السماح بتعديل بيانات المستخدمين",
                subPermissions: [
                    { name: "updateAll", label: "تعديل كامل", description: "تعديل كامل بيانات المستخدم" },
                    { name: "updatePermissions", label: "تعديل الصلاحيات", description: "تعديل صلاحيات المستخدمين فقط" },
                ],
            },
            { name: "delete", label: "حذف مستخدم", description: "السماح بحذف المستخدمين" },
            { name: "read", label: "عرض المستخدمين", description: "عرض قائمة المستخدمين وتفاصيلهم" },
            { name: "export", label: "تصدير المستخدمين", description: "تصدير بيانات المستخدمين إلى Excel" },
        ],
    },
    {
        id: "companies",
        label: "إدارة الشركات",
        description: "التحكم في بيانات الشركات والمقاولين",
        prefix: "companies:",
        permissions: [
            { name: "create", label: "إضافة شركة", description: "السماح بإنشاء شركات جديدة" },
            { name: "update", label: "تعديل شركة", description: "السماح بتعديل بيانات الشركات" },
            { name: "delete", label: "حذف شركة", description: "السماح بحذف الشركات" },
            { name: "read", label: "عرض الشركات", description: "عرض قائمة الشركات وتفاصيلها" },
            { name: "export", label: "تصدير الشركات", description: "تصدير بيانات الشركات إلى Excel" },
        ],
    },
    {
        id: "projects",
        label: "إدارة المشاريع",
        description: "التحكم في المشاريع الهندسية",
        prefix: "projects:",
        permissions: [
            { name: "create", label: "إضافة مشروع", description: "السماح بإنشاء مشاريع جديدة" },
            { name: "update", label: "تعديل مشروع", description: "السماح بتعديل بيانات المشاريع" },
            { name: "delete", label: "حذف مشروع", description: "السماح بحذف المشاريع" },
            { name: "read", label: "عرض المشاريع", description: "عرض قائمة المشاريع وتفاصيلها" },
            { name: "export", label: "تصدير المشاريع", description: "تصدير بيانات المشاريع إلى Excel" },
        ],
    },
    {
        id: "procedures",
        label: "إدارة الإجراءات",
        description: "التحكم في الإجراءات الفنية والإدارية",
        prefix: "procedures:",
        permissions: [
            { name: "create", label: "إضافة إجراء", description: "السماح بإنشاء إجراءات جديدة" },
            { name: "update", label: "تعديل إجراء", description: "السماح بتعديل الإجراءات" },
            { name: "delete", label: "حذف إجراء", description: "السماح بحذف الإجراءات" },
            { name: "read", label: "عرض الإجراءات", description: "عرض قائمة الإجراءات وتفاصيلها" },
            { name: "export", label: "تصدير الإجراءات", description: "تصدير بيانات الإجراءات إلى Excel" },
        ],
    },
    {
        id: "financialProcedures",
        label: "إدارة الإجراءات المالية",
        description: "التحكم في الإجراءات المالية",
        prefix: "financialProcedures:",
        permissions: [
            { name: "create", label: "إضافة إجراء مالي", description: "السماح بإنشاء إجراءات مالية جديدة" },
            { name: "update", label: "تعديل إجراء مالي", description: "السماح بتعديل الإجراءات المالية" },
            { name: "delete", label: "حذف إجراء مالي", description: "السماح بحذف الإجراءات المالية" },
            { name: "read", label: "عرض الإجراءات المالية", description: "عرض قائمة الإجراءات المالية وتفاصيلها" },
            { name: "export", label: "تصدير الإجراءات المالية", description: "تصدير بيانات الإجراءات المالية إلى Excel" },
        ],
    },
    {
        id: "financialStatus",
        label: "إدارة الحالة المالية",
        description: "التحكم في بيانات الحالة المالية",
        prefix: "financialStatus:",
        permissions: [
            { name: "create", label: "إضافة حالة مالية", description: "السماح بإنشاء حالات مالية جديدة" },
            { name: "update", label: "تعديل حالة مالية", description: "السماح بتعديل الحالات المالية" },
            { name: "delete", label: "حذف حالة مالية", description: "السماح بحذف الحالات المالية" },
            { name: "read", label: "عرض الحالات المالية", description: "عرض قائمة الحالات المالية وتفاصيلها" },
            { name: "export", label: "تصدير الحالات المالية", description: "تصدير بيانات الحالات المالية إلى Excel" },
        ],
    },
    {
        id: "financialTransactions",
        label: "إدارة المعاملات المالية",
        description: "التحكم في المعاملات المالية",
        prefix: "financialTransactions:",
        permissions: [
            { name: "create", label: "إضافة معاملة مالية", description: "السماح بإنشاء معاملات مالية جديدة" },
            { name: "update", label: "تعديل معاملة مالية", description: "السماح بتعديل المعاملات المالية" },
            { name: "delete", label: "حذف معاملة مالية", description: "السماح بحذف المعاملات المالية" },
            { name: "read", label: "عرض المعاملات المالية", description: "عرض قائمة المعاملات المالية وتفاصيلها" },
            { name: "export", label: "تصدير المعاملات المالية", description: "تصدير بيانات المعاملات المالية إلى Excel" },
        ],
    },
    {
        id: "financialFlow",
        label: "إدارة التدفق المالي",
        description: "التحكم في بيانات التدفق المالي",
        prefix: "financialFlow:",
        permissions: [
            { name: "create", label: "إضافة تدفق مالي", description: "السماح بإنشاء تدفقات مالية جديدة" },
            { name: "update", label: "تعديل تدفق مالي", description: "السماح بتعديل التدفقات المالية" },
            { name: "delete", label: "حذف تدفق مالي", description: "السماح بحذف التدفقات المالية" },
            { name: "read", label: "عرض التدفقات المالية", description: "عرض قائمة التدفقات المالية وتفاصيلها" },
            { name: "export", label: "تصدير التدفقات المالية", description: "تصدير بيانات التدفقات المالية إلى Excel" },
        ],
    },
    {
        id: "billOfQuantities",
        label: "إدارة جداول الكميات",
        description: "التحكم في جداول الكميات والتسجيلات المالية",
        prefix: "billOfQuantities:",
        permissions: [
            { name: "create", label: "إضافة جدول كميات", description: "السماح بإنشاء جداول كميات جديدة" },
            { name: "update", label: "تعديل جدول كميات", description: "السماح بتعديل جداول الكميات" },
            { name: "delete", label: "حذف جدول كميات", description: "السماح بحذف جداول الكميات" },
            { name: "read", label: "عرض جداول الكميات", description: "عرض قائمة جداول الكميات وتفاصيلها" },
            { name: "export", label: "تصدير جداول الكميات", description: "تصدير بيانات جداول الكميات إلى Excel" },
        ],
    },
    {
        id: "organizationalUnits",
        label: "إدارة الوحدات التنظيمية",
        description: "التحكم في الهيكل التنظيمي والوحدات",
        prefix: "organizationalUnits:",
        permissions: [
            { name: "create", label: "إضافة وحدة تنظيمية", description: "السماح بإنشاء وحدات تنظيمية جديدة" },
            { name: "update", label: "تعديل وحدة تنظيمية", description: "السماح بتعديل الوحدات التنظيمية" },
            { name: "delete", label: "حذف وحدة تنظيمية", description: "السماح بحذف الوحدات التنظيمية" },
            { name: "read", label: "عرض الوحدات التنظيمية", description: "عرض الهيكل التنظيمي والوحدات" },
            { name: "move", label: "نقل وحدة تنظيمية", description: "السماح بنقل الوحدات في الهيكل التنظيمي" },
        ],
    },
    {
        id: "reports",
        label: "التقارير والإحصائيات",
        description: "الوصول إلى التقارير والتحليلات",
        prefix: "reports:",
        permissions: [
            { name: "view", label: "عرض التقارير", description: "السماح بعرض التقارير والإحصائيات" },
            { name: "export", label: "تصدير التقارير", description: "السماح بتصدير التقارير" },
            { name: "create", label: "إنشاء تقارير مخصصة", description: "السماح بإنشاء تقارير مخصصة" },
        ],
    },
    {
        id: "settings",
        label: "إعدادات النظام",
        description: "التحكم في إعدادات النظام العامة",
        prefix: "settings:",
        permissions: [
            { name: "view", label: "عرض الإعدادات", description: "السماح بعرض إعدادات النظام" },
            { name: "update", label: "تعديل الإعدادات", description: "السماح بتعديل إعدادات النظام" },
            { name: "backup", label: "النسخ الاحتياطي", description: "السماح بإجراء نسخ احتياطي" },
            { name: "restore", label: "استعادة النظام", description: "السماح باستعادة النسخ الاحتياطية" },
        ],
    },
];

// Scope options for permissions
export const scopeOptions = [
    { value: "ALL", label: "كل الوحدات", description: "الوصول الكامل لجميع الوحدات التنظيمية" },
    { value: "OWN_UNIT", label: "الوحدة الخاصة فقط", description: "الوصول فقط للوحدة التنظيمية التابع لها المستخدم" },
    { value: "OWN_UNIT_AND_CHILDREN", label: "الوحدة والوحدات الفرعية", description: "الوصول للوحدة التنظيمية وجميع الوحدات الفرعية التابعة لها" },
    { value: "CUSTOM_UNITS", label: "وحدات محددة", description: "الوصول لوحدات تنظيمية محددة يتم اختيارها" },
];

// Helper function to get all permission actions
export const getAllPermissionActions = () => {
    const actions = [];
    permissionGroups.forEach(group => {
        group.permissions.forEach(perm => {
            if (perm.subPermissions) {
                perm.subPermissions.forEach(sub => {
                    actions.push(`${group.prefix}${perm.name}:${sub.name}`);
                });
            } else {
                actions.push(`${group.prefix}${perm.name}`);
            }
        });
    });
    return actions;
};

// Helper function to get permission label
export const getPermissionLabel = (action) => {
    for (const group of permissionGroups) {
        for (const perm of group.permissions) {
            const baseAction = `${group.prefix}${perm.name}`;
            if (action === baseAction) {
                return `${group.label} - ${perm.label}`;
            }
            if (perm.subPermissions) {
                for (const sub of perm.subPermissions) {
                    if (action === `${baseAction}:${sub.name}`) {
                        return `${group.label} - ${perm.label} (${sub.label})`;
                    }
                }
            }
        }
    }
    return action;
};
