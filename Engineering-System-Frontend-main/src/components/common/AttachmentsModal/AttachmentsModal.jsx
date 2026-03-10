import React from "react";
import { BsFileEarmarkText, BsDownload } from "react-icons/bs";
import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal/Modal";
import getFileUrl from "../../../utils/getDownladLink";

const AttachmentsModal = ({
  isOpen,
  onClose,
  title = "المرفقات والملفات", // عنوان قابل للتخصيص
  mainFile, // ملف رئيسي واحد (مثل: ملف الموافقة الأمنية)
  mainFileLabel = "الملف الرئيسي", // تسمية الملف الرئيسي
  additionalFiles = [], // مصفوفة من المسارات للملفات الإضافية
  additionalFilesLabel = "المرفقات الإضافية",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-6">
        {/* الملف الرئيسي (اختياري) */}
        {mainFile ? (
          <div className="border rounded-lg p-4 bg-background">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BsFileEarmarkText className="w-5 h-5" />
              {mainFileLabel}
            </h4>
            <div className="flex items-center justify-between bg-background rounded-md p-3">
              <span className="text-sm font-mono truncate max-w-md">
                {mainFile.split("/").pop()}
              </span>
              <Button
                variant="outline"
                onClick={() => window.open(getFileUrl(mainFile), "_blank")}
                icon={<BsDownload />}
              >
                تحميل
              </Button>
            </div>
          </div>
        ) : null}

        {/* المرفقات الإضافية */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <BsFileEarmarkText className="w-5 h-5 text-primary" />
            {additionalFilesLabel} ({additionalFiles.length})
          </h4>

          {additionalFiles.length > 0 ? (
            <div className="space-y-2">
              {additionalFiles.map((filePath, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-background rounded-md p-3 hover:bg-accent transition-colors"
                >
                  <span className="text-sm font-mono truncate max-w-md">
                    {filePath.split("/").pop()}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => window.open(getFileUrl(mainFile), "_blank")}
                    icon={<BsDownload />}
                  >
                    تحميل
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              لا توجد مرفقات إضافية
            </p>
          )}
        </div>

        {/* إذا لم يكن هناك أي ملف */}
        {!mainFile && additionalFiles.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            لا توجد ملفات أو مرفقات
          </div>
        )}
      </div>

      <div className="flex justify-start mt-6">
        <Button onClick={onClose}>إغلاق</Button>
      </div>
    </Modal>
  );
};

export default AttachmentsModal;
