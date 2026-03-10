import React, { useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { useQuery } from "@tanstack/react-query";
import {
  createOrganizationUnit,
  deleteOrganizationUnit,
  getUnitsTree,
  updateOrganizationUnit,
} from "../../../api/organizationUnitsAPI";
import Loading from "../../common/Loading/Loading";
import OrganizationalTree from "../../ui/OrganizationalTree/OrganizationalTree";
import formatDate from "../../../utils/formatDate";
import Button from "../../ui/Button/Button";
import { BiPlus } from "react-icons/bi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SimpleOrganizationalTree from "../../ui/SimpleTreeNode/SimpleOrganizationalTree";

export default function OrganizationUnits() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const {
    data: tree,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["organizationUnits"],
    queryFn: getUnitsTree,
    select: (res) => res.data,
  });
  if (isLoading) {
    return <Loading />;
  }
  const handleCreateUnit = async (parent = null) => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "إضافة وحدة جديدة",
        html: `
        <div class="relative">
            <input type="text" id="name" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
            <label for="name" class="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-white px-2 peer-focus:px-2 peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">اسم الوحدة</label>
        </div>
        <div class="mt-4">
          <label for="type" class="block mb-2.5 text-sm font-medium text-heading text-start">نوع الوحدة</label>
          <select ${
            !parent ? "disabled" : ""
          } id="type" class="block w-full px-3 py-2.5 bg-white border text-heading text-sm rounded-lg focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
            <option value="">اختر النوع</option>
            ${
              !parent
                ? '<option value="MAIN_UNIT" selected>وحدة رئيسية</option>'
                : '<option value="SUB_UNIT" selected>وحدة فرعية</option>'
            }
             <option value="DEPARTMENT">قسم</option>
          </select>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: "حفظ",
        confirmButtonColor: "#0a87f4",
        cancelButtonText: "إلغاء",
        preConfirm: () => {
          const name = document.getElementById("name").value.trim();
          const type = document.getElementById("type").value;

          if (!name || !type) {
            Swal.showValidationMessage("جميع الحقول مطلوبة");
            return false;
          }

          return {
            name,
            type,
            parent,
          };
        },
      });

      if (!formValues) return;

      await createOrganizationUnit(formValues);

      Swal.fire("تم", "تمت إضافة الوحدة بنجاح", "success");
      refetch();
    } catch (error) {
      console.log(error);
      Swal.fire(
        "خطأ",
        error?.response?.data?.message || "حدث خطأ أثناء الإضافة",
        "error"
      );
    }
  };

  const handleUpdateUnit = async () => {
    if (!selectedUnit) return;

    try {
      const { value: formValues } = await Swal.fire({
        title: "تعديل وحدة",
        html: `
        <div class="relative">
            <input type="text" id="name" value="${
              selectedUnit.name
            }" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
            <label for="name" class="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-white px-2 peer-focus:px-2 peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">اسم الوحدة</label>
        </div>
        <div class="mt-4">
          <label for="type" class="block mb-2.5 text-sm font-medium text-heading text-start">نوع الوحدة</label>
          <select ${
            selectedUnit.type === "MAIN_UNIT" ? "disabled" : ""
          } id="type" class="block w-full px-3 py-2.5 bg-white border text-heading text-sm rounded-lg focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                  <option value="">اختر النوع</option>
                  <option value="MAIN_UNIT" ${
                    selectedUnit.type === "MAIN_UNIT" ? "selected" : ""
                  }>وحدة رئيسية</option>
                  <option value="SUB_UNIT" ${
                    selectedUnit.type === "SUB_UNIT" ? "selected" : ""
                  }>وحدة فرعية</option>
                  <option value="SUB_UNIT" ${
                    selectedUnit.type === "DEPARTMENT" ? "selected" : ""
                  }>قسم</option>
          </select>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: "حفظ التعديلات",
        confirmButtonColor: "#0a87f4",
        cancelButtonText: "إلغاء",
        preConfirm: () => {
          const name = document.getElementById("name").value.trim();
          const type = document.getElementById("type").value;

          if (!name || !type) {
            Swal.showValidationMessage("جميع الحقول مطلوبة");
            return false;
          }

          return { name, type };
        },
      });

      if (!formValues) return;

      // Assuming you have an update API function like this:
      // updateOrganizationUnit(unitId, data)
      await updateOrganizationUnit(selectedUnit._id, formValues);

      Swal.fire("تم", "تم تعديل الوحدة بنجاح", "success");
      refetch(); // Refresh the tree
      setSelectedUnit(null);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "خطأ",
        error?.response?.data?.message || "حدث خطأ أثناء تعديل الوحدة",
        "error"
      );
    }
  };

  const handleDeleteUnit = async () => {
    if (!selectedUnit) return;
    Swal.fire({
      title: `هل انت متأكد من حذف الوحدة "${selectedUnit.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "حذف",
      confirmButtonColor: "#d33",
      denyButtonText: `اغلاق`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrganizationUnit(selectedUnit._id);
          toast.success("تم حذف الوحدة بنجاح");
          refetch();
          setSelectedUnit(null);
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      } else if (result.isDismissed) {
        Swal.fire("تم", "لم يتم حذف الوحدة", "info");
      }
    });
  };

  return (
    <>
      <section>
        <PageTitle title="ادارة الوحدات" />
        <div className="flex gap-4 mt-4">
          {/* tree of organization units data*/}
          <div className="shadow rounded-lg w-full p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold mb-4 border-s-4 ps-2 border-primary-500">
                جميع الوحدات
              </h3>
              <Button size="sm" onClick={() => handleCreateUnit()}>
                <BiPlus />
              </Button>
            </div>
            <SimpleOrganizationalTree data={tree} onSelect={setSelectedUnit} />
          </div>
          {/* specific organization unit data */}
          {selectedUnit && (
            <>
              <div className="shadow rounded-lg w-full p-4 h-fit">
                <h3 className="text-xl font-bold mb-4 border-s-4 ps-2 border-primary-500">
                  تفاصيل وحدة
                </h3>
                {/* name , type ,  createdAt , updatedAt*/}
                <div className="space-y-2 flex-1">
                  <div>
                    <span className="font-semibold pe-2">اسم الوحدة:</span>
                    <span>{selectedUnit.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold pe-2">نوع الوحدة:</span>
                    <span>{selectedUnit.type}</span>
                  </div>
                  <div>
                    <span className="font-semibold pe-2">تاريخ الانشاء:</span>
                    <span>{formatDate(selectedUnit.createdAt)}</span>
                  </div>
                  <div>
                    <span className="font-semibold pe-2">تاريخ التحديث:</span>
                    <span>{formatDate(selectedUnit.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="font-semibold pe-2">
                      عدد الوحدات التابعة لها:
                    </span>
                    <span>{selectedUnit?.children?.length || "لا يوجد"}</span>
                  </div>
                </div>
                {/* actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    className="w-full"
                    onClick={() => handleCreateUnit(selectedUnit._id)}
                  >
                    اضافة وحدة تابعة
                  </Button>
                  <Button
                    className="w-full"
                    variant="success"
                    onClick={() => handleUpdateUnit()}
                  >
                    تعديل
                  </Button>
                  {/* <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleMoveUnit}
                  >
                    نقل
                  </Button> */}
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleDeleteUnit}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
