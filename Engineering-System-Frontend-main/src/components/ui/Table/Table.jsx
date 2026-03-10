import React from "react";
import clsx from "clsx";

const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-auto border border-[#d0d0d0] rounded-sm">
      <table
        className={clsx("w-full caption-bottom text-sm border-collapse", className)}
        dir="rtl"
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={clsx("bg-white", className)} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody
      className={clsx("[&_tr:last-child]:border-0", className)}
      {...props}
    >
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, ...props }) => {
  return (
    <tr
      className={clsx(
        "border-b border-[#d4d4d4] transition-colors hover:bg-blue-50/40 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <th
      className={clsx(
        "h-12 px-3 text-center align-middle font-semibold text-[#222] text-sm border border-[#c8c8c8] whitespace-nowrap",
        className
      )}
      style={{ fontFamily: "Cairo, sans-serif" }}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td
      className={clsx(
        "px-3 py-[11px] text-center align-middle text-[13px] text-[#333] border border-[#d4d4d4] whitespace-nowrap",
        className
      )}
      style={{ fontFamily: "Cairo, sans-serif" }}
      {...props}
    >
      {children}
    </td>
  );
};

const TableCaption = ({ children, className, ...props }) => {
  return (
    <caption
      className={clsx("mt-4 text-sm text-muted-foreground text-right", className)}
      style={{ fontFamily: "Cairo, sans-serif" }}
      {...props}
    >
      {children}
    </caption>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
