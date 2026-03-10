import React from "react";
import { cn } from "../../../lib/utils";
import { BiChevronDown } from "react-icons/bi"; // assuming you're using react-icons

/**
 * Reusable Column Selector Component
 *
 * @param {Object[]} columns - Array of column definitions { id: string, header: string | ReactNode }
 * @param {Object} columnVisibility - Current visibility state { [columnId]: boolean }
 * @param {Function} setColumnVisibility - Function to update visibility state
 * @param {boolean} isOpen - Whether the dropdown is open
 * @param {Function} setIsOpen - Toggle function for dropdown
 * @param {string[]} [essentialColumnIds=[]] - Column IDs that should remain visible in "Essentials only" mode
 * @param {string} [title="إظهار / إخفاء الأعمدة"] - Dropdown title
 * @param {string} [showAllLabel="إظهار الكل"] - "Show all" button label
 * @param {string} [essentialsLabel="الأساسيات فقط"] - "Essentials only" button label
 * @param {string} [buttonLabel="الأعمدة"] - Text on the trigger button
 */
export default function ColumnSelector({
  columns,
  columnVisibility,
  setColumnVisibility,
  isOpen,
  setIsOpen,
  essentialColumnIds = [], // e.g., ["companyName"]
  title = "إظهار / إخفاء الأعمدة",
  showAllLabel = "إظهار الكل",
  essentialsLabel = "الأساسيات فقط",
  buttonLabel = "الأعمدة",
  // Optional: exclude certain columns from selector (e.g., actions column)
  excludeColumns = ["actions"],
}) {
  const toggleVisibility = (columnId) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const showAll = () => {
    const allVisible = columns.reduce((acc, col) => {
      if (!excludeColumns.includes(col.id)) {
        acc[col.id] = true;
      }
      return acc;
    }, {});
    setColumnVisibility(allVisible);
  };

  const showEssentials = () => {
    const essentials = columns.reduce((acc, col) => {
      if (excludeColumns.includes(col.id)) {
        // Keep excluded columns untouched (e.g., actions always visible)
        acc[col.id] = columnVisibility[col.id] ?? true;
      } else if (essentialColumnIds.includes(col.id)) {
        acc[col.id] = true;
      } else {
        acc[col.id] = false;
      }
      return acc;
    }, {});
    setColumnVisibility(essentials);
  };

  const visibleColumns = columns.filter(
    (col) => !excludeColumns.includes(col.id)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors"
        aria-label="Toggle column selector"
      >
        {buttonLabel}
        <BiChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium">{title}</p>
          </div>

          <div className="max-h-96 overflow-y-auto py-2">
            {visibleColumns.map((column) => {
              const isVisible = columnVisibility[column.id] !== false;

              return (
                <label
                  key={column.id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleVisibility(column.id)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary border-border"
                  />
                  <span className="text-sm">{column.header}</span>
                </label>
              );
            })}
          </div>

          <div className="p-2 border-t border-border flex justify-between text-xs">
            <button onClick={showAll} className="text-primary hover:underline">
              {showAllLabel}
            </button>
            <button
              onClick={showEssentials}
              className="text-primary hover:underline"
            >
              {essentialsLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
