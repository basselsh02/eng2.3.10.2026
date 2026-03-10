import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label = "بيانات",
      type = "text",
      id,
      error,
      options = [],
      rules = {},
      ...props
    },
    ref,
  ) => {
    const inputId = id || "floating_" + label;
    const isRequired = !!rules.required;

    if (type === "select") {
      return (
        <div className="mb-2">
          <div className="relative">
            <select
              ref={ref}
              id={inputId}
              dir="rtl"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-[13px] text-[#333] bg-white rounded-sm border
                appearance-none focus:outline-none focus:ring-0 peer cursor-pointer
                disabled:bg-[#f5f5f5] disabled:text-[#888] disabled:cursor-not-allowed
                ${
                  error
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#c8c8c8] focus:border-[#4a90d9]"
                }`}
              style={{
                fontFamily: "Cairo, sans-serif",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 10px center",
              }}
              defaultValue={options[0]?.value ?? ""}
              {...props}
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ fontFamily: "Cairo, sans-serif" }}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <label
              htmlFor={inputId}
              className={`absolute text-[13px] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-right bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 end-2
                ${
                  error
                    ? "text-red-500"
                    : "text-[#888] peer-focus:text-[#4a90d9]"
                }`}
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {label}
              {isRequired && <span className="text-red-500 mr-0.5">*</span>}
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-2">
        <div className="relative">
          <input
            ref={ref}
            type={type}
            id={inputId}
            dir="rtl"
            className={`block px-2.5 pb-2.5 pt-4 w-full text-[13px] text-[#333] bg-white rounded-sm border
              appearance-none focus:outline-none focus:ring-0 peer
              disabled:bg-[#f5f5f5] disabled:text-[#888] disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#c8c8c8] focus:border-[#4a90d9]"
              }`}
            style={{ fontFamily: "Cairo, sans-serif" }}
            placeholder=" "
            {...props}
          />

          <label
            htmlFor={inputId}
            className={`absolute text-[13px] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-right bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 end-2
              ${
                error
                  ? "text-red-500"
                  : "text-[#888] peer-focus:text-[#4a90d9]"
              }`}
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            {label}
            {isRequired && <span className="text-red-500 mr-0.5">*</span>}
          </label>
        </div>

        {error && (
          <p
            className="text-red-500 text-xs mt-2 text-right"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
