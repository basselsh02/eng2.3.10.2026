import React, { useState, useEffect } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, updateUserPermissions } from "../../../api/userAPI";
import Loading from "../../common/Loading/Loading";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../ui/Button/Button";
import toast from "react-hot-toast";
import OrganizationalTreeModal from "../../common/OrganizationalTreeModal/OrganizationalTreeModal";
import { permissionGroups } from "../../../utils/permissionConfig";
import { IoIosArrowDown } from "react-icons/io";
export default function PermissionsUser() {
  const [isOpenGroup, setIsOpenGroup] = useState("");
  const { id } = useParams();
  const {
    data: userData,
    isLoading: userLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser({ id }),
    enabled: !!id,
  });

  const user = userData?.data;

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { permissions: [] },
  });

  const permissions = useWatch({
    control,
    name: "permissions",
    defaultValue: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditingPerm, setCurrentEditingPerm] = useState(null); // { action }

  // تحميل الصلاحيات عند جلب المستخدم
  useEffect(() => {
    if (user?.permissions) {
      reset({ permissions: user.permissions });
    }
  }, [user, reset]);

  // دالة لإضافة أو تحديث صلاحية
  const upsertPermission = (action, scope, units = []) => {
    const newPerms = permissions.filter((p) => p.action !== action);

    if (scope !== null) {
      newPerms.push({
        action,
        scope: scope || "ALL",
        units: scope === "CUSTOM_UNITS" ? units : [],
      });
    }

    // إضافة :read تلقائيًا إذا كان هناك create/update/delete
    const actions = newPerms.map((p) => p.action);
    permissionGroups.forEach((group) => {
      const base = group.prefix;
      const hasWrite = ["create", "update", "delete"].some((act) =>
        actions.some(
          (a) => a === `${base}${act}` || a.startsWith(`${base}${act}:`),
        ),
      );
      if (hasWrite) {
        const readAction = `${base}read`;
        if (!actions.includes(readAction)) {
          newPerms.push({ action: readAction, scope: "ALL", units: [] });
        }
      }
    });

    setValue("permissions", newPerms);
  };

  // جلب الصلاحية الحالية لعرض الـ scope
  const getCurrentScope = (action) => {
    const perm = permissions.find((p) => p.action === action);
    return perm ? perm.scope : null;
  };

  const getCurrentUnits = (action) => {
    const perm = permissions.find((p) => p.action === action);
    return perm?.units || [];
  };

  const getUnitNames = (unitIds) => {
    // لو عايز تعرض أسماء الوحدات، هنجيبها من الشجرة لاحقًا
    // دلوقتي هنعرض عدد بس
    return unitIds.length > 0
      ? `${unitIds.length} وحدة مختارة`
      : "لا توجد وحدات";
  };

  const mutation = useMutation({
    mutationFn: (data) => updateUserPermissions({ id, data }),
    onSuccess: () => {
      toast.success("تم تحديث صلاحيات المستخدم بنجاح");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    },
  });

  const onSubmit = (data) => {
    // تنظيف الـ units الفاضية
    const cleanPermissions = data.permissions.map((p) => ({
      action: p.action,
      scope: p.scope,
      units: p.scope === "CUSTOM_UNITS" ? p.units : [],
    }));
    console.log("cleanPermissions", cleanPermissions);
    mutation.mutate({ permissions: cleanPermissions });
  };

  const openUnitsModal = (action) => {
    setCurrentEditingPerm(action);
    setModalOpen(true);
  };

  if (userLoading) return <Loading />;
  if (isError) {
    console.log(error);
    return (
      <div className="text-red-600 text-center py-10">
        حدث خطأ في تحميل بيانات المستخدم
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto space-y-8 py-6" dir="rtl">
        <div className="w-fit">
          <PageTitle
            title="صلاحيات المستخدم"
            subTitle={`${user?.fullNameArabic || user?.fullNameEnglish} - ${
              user?.username
            }`}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-background rounded-2xl shadow-lg border border-base overflow-hidden">
            <div className="p-6 bg-base">
              <h2 className="text-2xl font-bold">إدارة صلاحيات المستخدم</h2>
              <p className="mt-1">حدد الصلاحيات والنطاق لكل عملية</p>
            </div>

            <div className="p-6 space-y-8">
              {permissionGroups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-300 rounded-xl overflow-hidden bg-background shadow-sm"
                >
                  <div
                    className="p-5 bg-base flex items-center justify-between"
                    onClick={() => {
                      if (isOpenGroup === group.id) {
                        setIsOpenGroup(null);
                        return;
                      }
                      setIsOpenGroup(group.id);
                    }}
                  >
                    <h3 className="text-xl font-semibold">{group.label}</h3>
                    <p className="text-xl font-semibold">{group.description}</p>
                    <IoIosArrowDown
                      size={20}
                      className={`${
                        isOpenGroup === group.id ? "rotate-180" : ""
                      }
                      transition-transform duration-300 ease-in-out`}
                    />
                  </div>

                  {isOpenGroup === group.id && (
                    <div
                      className={`overflow-hidden transition-transform duration-300 ease-in-out
                          ${
                            isOpenGroup == group.id
                              ? "max-h-250 p-6 space-y-6 overflow-y-auto"
                              : "max-h-0 p-0"
                          }
                        `}
                    >
                      {group.permissions.map((perm) => {
                        console.log("perm", perm);
                        const actionBase = `${group.prefix}${perm.name}`;
                        const subActions = perm.subPermissions
                          ? perm.subPermissions.map(
                              (sp) => `${actionBase}:${sp.name}`,
                            )
                          : [actionBase];

                        // نعتبر الصلاحية الرئيسية مفعلة لو أي sub مفعلة
                        const isEnabled = subActions.some((act) =>
                          permissions.some((p) => p.action === act),
                        );

                        return (
                          <div
                            key={perm.name}
                            className={`p-5 rounded-lg border ${
                              isEnabled
                                ? "bg-blue-50 border-blue-300"
                                : "bg-gray-50 border-gray-300"
                            }`}
                          >
                            <div className="font-medium text-lg mb-4">
                              {perm.label}
                              {perm.description && (
                                <p className="opacity-60">{perm.description}</p>
                              )}
                            </div>

                            {perm.subPermissions ? (
                              // عرض الصلاحيات الفرعية
                              <div className="space-y-3 pr-8">
                                {perm.subPermissions.map((sub) => {
                                  const subAction = `${actionBase}:${sub.name}`;
                                  const scope = getCurrentScope(subAction);

                                  return (
                                    <div key={sub.name} className="space-y-2">
                                      <label className="flex items-center gap-3">
                                        <input
                                          type="checkbox"
                                          checked={!!scope}
                                          onChange={(e) =>
                                            upsertPermission(
                                              subAction,
                                              e.target.checked ? "ALL" : null,
                                            )
                                          }
                                          className="w-5 h-5 text-blue-600 rounded"
                                        />
                                        <div>
                                          <span>
                                            {perm.label} {sub.label}
                                          </span>
                                          {sub.description && (
                                            <p className="opacity-60">
                                              {sub.description}
                                            </p>
                                          )}
                                        </div>
                                      </label>

                                      {scope && (
                                        <div className="pr-10 space-y-3">
                                          <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2">
                                              <input
                                                type="radio"
                                                name={`scope-${subAction}`}
                                                checked={scope === "ALL"}
                                                onChange={() =>
                                                  upsertPermission(
                                                    subAction,
                                                    "ALL",
                                                  )
                                                }
                                              />
                                              <span>كل الوحدات</span>
                                            </label>

                                            <label className="flex items-center gap-2">
                                              <input
                                                type="radio"
                                                name={`scope-${subAction}`}
                                                checked={scope === "OWN_UNIT"}
                                                onChange={() =>
                                                  upsertPermission(
                                                    subAction,
                                                    "OWN_UNIT",
                                                  )
                                                }
                                              />
                                              <span>الوحدة الخاصة به فقط</span>
                                            </label>

                                            <label className="flex items-center gap-2">
                                              <input
                                                type="radio"
                                                name={`scope-${subAction}`}
                                                checked={
                                                  scope === "CUSTOM_UNITS"
                                                }
                                                onChange={() =>
                                                  upsertPermission(
                                                    subAction,
                                                    "CUSTOM_UNITS",
                                                    getCurrentUnits(subAction),
                                                  )
                                                }
                                              />
                                              <span>وحدات محددة</span>
                                            </label>
                                          </div>

                                          {scope === "CUSTOM_UNITS" && (
                                            <div className="flex items-center gap-3">
                                              <span className="text-sm text-gray-600">
                                                {getUnitNames(
                                                  getCurrentUnits(subAction),
                                                )}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openUnitsModal(subAction)
                                                }
                                                className="text-primary-600 hover:underline text-sm"
                                              >
                                                تعديل الوحدات
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              // صلاحية بدون sub
                              <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={!!getCurrentScope(actionBase)}
                                    onChange={(e) =>
                                      upsertPermission(
                                        actionBase,
                                        e.target.checked ? "ALL" : null,
                                      )
                                    }
                                    className="w-5 h-5 text-blue-600 rounded"
                                  />
                                  <span>تفعيل هذه الصلاحية</span>
                                </label>

                                {getCurrentScope(actionBase) && (
                                  <div className="pr-8 space-y-3">
                                    <div className="flex items-center gap-6">
                                      <label className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name={`scope-${actionBase}`}
                                          checked={
                                            getCurrentScope(actionBase) ===
                                            "ALL"
                                          }
                                          onChange={() =>
                                            upsertPermission(actionBase, "ALL")
                                          }
                                        />
                                        <span>كل الوحدات</span>
                                      </label>
                                      <label className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name={`scope-${actionBase}`}
                                          checked={
                                            getCurrentScope(actionBase) ===
                                            "OWN_UNIT"
                                          }
                                          onChange={() =>
                                            upsertPermission(
                                              actionBase,
                                              "OWN_UNIT",
                                            )
                                          }
                                        />
                                        <span>الوحدة الخاصة به فقط</span>
                                      </label>
                                      <label className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name={`scope-${actionBase}`}
                                          checked={
                                            getCurrentScope(actionBase) ===
                                            "CUSTOM_UNITS"
                                          }
                                          onChange={() =>
                                            upsertPermission(
                                              actionBase,
                                              "CUSTOM_UNITS",
                                              getCurrentUnits(actionBase),
                                            )
                                          }
                                        />
                                        <span>وحدات محددة</span>
                                      </label>
                                    </div>

                                    {getCurrentScope(actionBase) ===
                                      "CUSTOM_UNITS" && (
                                      <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">
                                          {getUnitNames(
                                            getCurrentUnits(actionBase),
                                          )}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openUnitsModal(actionBase)
                                          }
                                          className="text-primary-600 hover:underline text-sm"
                                        >
                                          تعديل الوحدات
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={mutation.isPending}
              className="px-12 py-3 text-lg"
            >
              حفظ الصلاحيات
            </Button>
          </div>
        </form>
      </section>

      {/* Modal لاختيار الوحدات */}
      <OrganizationalTreeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentEditingPerm(null);
        }}
        onSelect={(selectedNodes) => {
          const unitIds = selectedNodes.map((node) => node._id);
          upsertPermission(currentEditingPerm, "CUSTOM_UNITS", unitIds);
        }}
        multiple={true} // مهم جدًا
      />
    </>
  );
}
