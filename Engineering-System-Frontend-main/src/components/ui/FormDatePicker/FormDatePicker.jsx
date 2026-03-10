import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import ar from "date-fns/locale/ar";
registerLocale("ar", ar);
const FormDatePicker = ({
  name,
  control,
  label,
  dateFormat = "yyyy/MM/dd",
  className = "",
  required = false,
  showYearDropdown = true,
  showMonthDropdown = true,
  ...rest
}) => {
  return (
    <div className={`relative ${className}`}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? "التاريخ مطلوب" : false,
        }}
        render={({ field, fieldState: { error } }) => {
          const hasValue = !!field.value;

          return (
            <div className="relative ">
              <DatePicker
                {...field}
                {...rest}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat={dateFormat}
                placeholderText={""}
                showYearDropdown={showYearDropdown}
                showMonthDropdown={showMonthDropdown}
                dropdownMode="select"
                id={name}
                autoComplete="off"
                wrapperClassName="w-full relative"
                isClearable
                locale="ar"
                todayButton="اليوم"
                monthHeaderPosition="top"
                clearButtonClassName="absolute top-1/2 left-100 transform -translate-y-1/2"
                className={`peer block w-full px-4 pb-2.5 pt-5 text-sm text-gray-900 
                   rounded-lg border border-gray-300 
                  appearance-none focus:outline-none focus:ring-0 
                  focus:border-blue-600 
                  ${hasValue ? "border-blue-600" : ""}
                  ${error ? "border-red-500" : "border-gray-300"}`}
              />

              {/* Floating Label */}
              <label
                htmlFor={name}
                className={`absolute text-sm duration-300 transform origin-left bg-white px-2 right-1
                  ${
                    field.value
                      ? "-translate-y-4 scale-75 top-2 text-blue-600"
                      : "scale-100 -translate-y-1/2 top-1/2 text-gray-500"
                  }
                  peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600
                  ${error ? "text-red-500" : ""}
                `}
              >
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>

              {/* رسالة الخطأ */}
              {error && (
                <p className="mt-1 text-xs text-red-600">{error.message}</p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default FormDatePicker;
