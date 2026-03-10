// ColumnFilter.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "../../ui/Button/Button";
import AppSelect from "../../ui/AppSelect/AppSelect";
import SearchInput from "../../ui/SearchInput/SearchInput";

export default function ColumnFilter({ column, onClose }) {
  const currentFilter = column.getFilterValue();
  const [mode, setMode] = useState(currentFilter?.mode ?? "range");
  const [value, setValue] = useState(currentFilter ?? "");

  const containerRef = useRef(null);

  const meta = column.columnDef.meta || {};
  const filterType = meta.filterType || "text";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleApply = () => {
    let isEmpty = false;

    switch (filterType) {
      case "date":
      case "number":
        isEmpty = mode === "single" ? !value : !value?.start || !value?.end;
        break;

      case "select":
        isEmpty = !value;
        break;

      default:
        isEmpty = !value || value === "";
    }

    if (isEmpty) {
      column.setFilterValue(undefined);
      onClose();
      return;
    }

    column.setFilterValue(
      filterType === "date" || filterType === "number" ? { mode, value } : value
    );

    onClose();
  };
  const handleClear = () => {
    if (filterType === "date" || filterType === "number") {
      setMode("range");
      setValue({ start: "", end: "" });
    } else {
      setValue("");
    }

    column.setFilterValue(undefined);
    onClose();
  };
  console.log("value", column.getFilterValue());
  const renderFilterInput = (column) => {
    switch (filterType) {
      case "search":
        return (
          <SearchInput
            type="column"
            model={meta.model}
            column={column.columnDef.accessorKey || column.columnDef.id}
            // عرض القيمة الحالية (مهم للـ controlled component)
            value={
              value
                ? { label: String(value), value } // أو يمكنك جلب label حقيقي إذا كان لديك
                : null
            }
            onSelect={(option) => {
              if (!option) {
                setValue("");
                return;
              }

              // دعم كلا الحالتين: اختيار من القائمة أو كتابة يدوية + Enter
              const filterValue = option.value ?? option.label ?? "";
              setValue(filterValue);
            }}
          />
        );

      case "select":
        console.log(
          "selectedOption",
          meta.options?.find((opt) => opt.value === value)
        );
        return (
          <AppSelect
            options={meta.options}
            label={""}
            onChange={(opt) => setValue(opt.value)}
            value={
              value
                ? meta.options.map((option) => {
                    console.log("option", option);
                    if (option.value === value) {
                      return option;
                    }
                  }) // أو يمكنك جلب label حقيقي إذا كان لديك
                : null
            }
            isClearable={false}
          />
        );

      case "date":
        return (
          <div className="flex flex-col gap-3">
            {/* single or range */}
            <div className="flex gap-2 mb-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setMode("single");
                  setValue("");
                }}
                className={`w-full  py-1 text-xs rounded ${
                  mode === "single"
                    ? "bg-primary-500 text-primary-content-500"
                    : "bg-base"
                }`}
              >
                تاريخ واحد
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("range");
                  setValue({ start: "", end: "" });
                }}
                className={`w-full py-1 text-xs rounded ${
                  mode === "range"
                    ? "bg-primary-500 text-primary-content-500"
                    : "bg-base"
                }`}
              >
                من / إلى
              </button>
            </div>
            {mode === "single" && (
              <div>
                <label className="text-xs block mb-1">التاريخ</label>
                <input
                  type="date"
                  value={value.value || value || ""}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
            {mode === "range" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1">من</label>
                  <input
                    type="date"
                    value={value?.value?.start || value?.start || ""}
                    onChange={(e) =>
                      setValue({ ...value, start: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-xs block mb-1">إلى</label>
                  <input
                    type="date"
                    value={value?.value?.end || value?.end || ""}
                    onChange={(e) =>
                      setValue({ ...value, end: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <div className="flex flex-col gap-3">
            {/* single or range */}
            <div className="flex gap-2 mb-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setMode("single");
                  setValue("");
                }}
                className={`w-full  py-1 text-xs rounded ${
                  mode === "single"
                    ? "bg-primary-500 text-primary-content-500"
                    : "bg-base"
                }`}
              >
                رقم واحد
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("range");
                  setValue({ start: "", end: "" });
                }}
                className={`w-full py-1 text-xs rounded ${
                  mode === "range"
                    ? "bg-primary-500 text-primary-content-500"
                    : "bg-base"
                }`}
              >
                من / إلى
              </button>
            </div>
            {mode === "single" && (
              <div>
                <label className="text-xs block mb-1">التاريخ</label>
                <input
                  type="number"
                  value={value?.value || value || ""}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
            {mode === "range" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1">من</label>
                  <input
                    type="number"
                    value={value?.value?.start || value?.start || ""}
                    onChange={(e) =>
                      setValue({ ...value, start: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-xs block mb-1">إلى</label>
                  <input
                    type="number"
                    value={value?.value?.end || value?.end || ""}
                    onChange={(e) =>
                      setValue({ ...value, end: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type={filterType === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="اكتب قيمة البحث..."
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        w-80 min-w-[18rem] max-w-[24rem]
        bg-primary-50 dark:bg-primary-800
        border border-primary-500 dark:border-primary-600
        rounded-lg shadow-xl p-4
        text-primary-content-50 dark:text-primary-content-800
        z-50
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">تصفية حسب: {column.columnDef.header}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
          aria-label="إغلاق"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5 text-start">
        <div>{renderFilterInput(column)}</div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleClear}>
            مسح
          </Button>
          <Button size="sm" onClick={handleApply}>
            تطبيق
          </Button>
        </div>
      </div>
    </div>
  );
}
