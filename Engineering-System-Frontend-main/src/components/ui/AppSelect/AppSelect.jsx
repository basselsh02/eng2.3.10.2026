import React, { useState } from "react";
import Select from "react-select";
import { AsyncPaginate, withAsyncPaginate } from "react-select-async-paginate";
import Creatable from "react-select/creatable";

const CreatableAsyncPaginate = withAsyncPaginate(Creatable);

export default function AppSelect({
  options,
  value,
  onChange,
  isMulti = false,
  label = "Floating outlined",
  error,
  isInvalid = false,
  isRequired = false,
  isCreatable = true,
  loadOptionsFn = null,
  createOptionsFn = null,
  isSearchable = true,
  isClearable = true,
  size = "md",
  isDisabled = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const loadOptions = async (search, loadedOptions, additional) => {
    const res = await loadOptionsFn(search || "");

    return {
      options: res,
      hasMore: false,
      additional: {
        page: 1,
      },
    };
  };

  const handleCreate = async (inputValue) => {
    const newOption = {
      label: inputValue,
      value: inputValue,
      __isNew__: true,
    };

    if (isMulti) {
      onChange([...(value || []), newOption]);
    } else {
      onChange(newOption);
    }

    const res = await createOptionsFn({ name: inputValue });
    console.log("create res", res);
    const saved = await res.data.data;

    onChange({
      value: saved._id,
      label: saved.name,
    });
  };

  const hasValue = isMulti ? Array.isArray(value) && value.length > 0 : !!value;

  const float = isFocused || hasValue;

  const styles = {
    control: (base) => ({
      ...base,
      backgroundColor: "var(--color-background)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: isInvalid
        ? "#dc2626"
        : isFocused
          ? "var(--color-primary-500)"
          : "var(--color-foreground)",
      borderRadius: "8px",
      minHeight: size === "sm" ? "32px" : "48px",
      boxShadow: "none",
      alignItems: "center",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999, // الرقم العالي هنا
    }),

    valueContainer: (base) => ({
      ...base,
      padding: size === "sm" ? "0 8px" : "0 12px",
      boxSizing: "border-box",
      alignItems: "center",
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: "0",
    }),

    singleValue: (base) => ({
      ...base,
      color: "var(--color-foreground)",
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "var(--color-background)",
    }),

    placeholder: () => ({
      display: "none",
    }),

    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      padding: "10px 12px",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      backgroundColor: state.isSelected
        ? "var(--color-primary-500)"
        : state.isFocused
          ? "var(--color-primary-50)"
          : "transparent",
      color: state.isSelected
        ? "var(--color-primary-content-500)"
        : state.isFocused
          ? "var(--color-primary-content-50)"
          : "",
    }),
  };

  const commonProps = {
    isClearable,
    isSearchable,
    value,
    onChange,
    isMulti,
    isDisabled,
    styles,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),

    menuPlacement: "auto",
    menuPosition: "fixed",
    menuPortalTarget: document.body,
  };

  return (
    <div className="relative w-full">
      <label
        className={`
          absolute z-10 px-2 bg-background text-sm duration-300 origin-left
          start-1
          ${
            float
              ? "top-2 scale-75 -translate-y-4"
              : "top-1/2 -translate-y-1/2 scale-100"
          }
          ${isFocused ? "text-primary-500" : ""}
          ${isInvalid ? "text-red-600" : ""}
        `}
      >
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>

      {options ? (
        <Select {...commonProps} options={options} />
      ) : isCreatable ? (
        <CreatableAsyncPaginate
          {...commonProps}
          loadOptions={loadOptions}
          additional={{ page: 1 }}
          debounceTimeout={300}
          onCreateOption={handleCreate}
          isValidNewOption={(input) => input.length >= 2}
          formatCreateLabel={(input) => `إضافة "${input}"`}
        />
      ) : (
        <AsyncPaginate
          {...commonProps}
          debounceTimeout={300}
          loadOptions={loadOptions}
          additional={{ page: 1 }}
        />
      )}

      {isInvalid && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </div>
  );
}
