// OrganizationalTreeModal.jsx
import React, { useState } from "react";
import Modal from "../../ui/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { getUnitsTree } from "../../../api/organizationUnitsAPI";
import OrganizationalTree from "../../ui/OrganizationalTree/OrganizationalTree";
import Loading from "../Loading/Loading";
import Button from "../../ui/Button/Button";

export default function OrganizationalTreeModal({
  isOpen,
  onClose,
  onSelect, // سيستقبل array من nodes المختارة
  multiple = false,
}) {
  const [selectedNodes, setSelectedNodes] = useState([]);

  const { data: tree, isLoading } = useQuery({
    queryKey: ["organizationUnits"],
    queryFn: getUnitsTree,
    select: (res) => res.data,
  });

  const handleConfirm = () => {
    onSelect(selectedNodes);
    onClose();
  };

  const handleClose = () => {
    setSelectedNodes([]); // تنظيف عند الإغلاق
    onClose();
  };

  if (isLoading) return <Loading />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={multiple ? "اختر الوحدات التنظيمية" : "اختر الوحدة"}
      size="xl"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <OrganizationalTree
          data={tree}
          selectedNodes={selectedNodes}
          setSelectedNodes={setSelectedNodes}
          multiple={multiple}
        />
      </div>

      {multiple && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600">
            تم اختيار <strong>{selectedNodes.length}</strong> وحدة
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedNodes.length === 0}
            >
              تأكيد الاختيار
            </Button>
          </div>
        </div>
      )}
      {!multiple && (
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={handleConfirm} disabled={selectedNodes.length === 0}>
            تأكيد الاختيار
          </Button>
        </div>
      )}
    </Modal>
  );
}
