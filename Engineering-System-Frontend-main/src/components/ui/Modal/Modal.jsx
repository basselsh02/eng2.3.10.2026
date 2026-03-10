import React from "react";
import { cn } from "../../../lib/utils";
import { BiX } from "react-icons/bi";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm, md, lg, xl
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "w-full mx-4 bg-background border border-primary-500 rounded-xl shadow-2xl overflow-hidden transition-all",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-400 bg-primary-500 text-primary-content-500">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <BiX size={30} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
