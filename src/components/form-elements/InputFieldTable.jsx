import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Popover } from "antd";

// Formatting utility functions
const formatNumberWithCommas = (value) => {
  if (!value && value !== 0) return "";

  const stringValue = value.toString();
  const [integerPart, decimalPart] = stringValue.split(".");

  // Add commas to integer part (Indian numbering system: ##,##,###)
  let formattedInteger = integerPart;
  if (integerPart.length > 3) {
    const formattedRemaining = formattedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formattedInteger = formattedRemaining;
  }

  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const unformatNumberWithCommas = (value) => {
  if (!value) return "";
  return value.toString().replace(/,/g, "");
};

const InputFieldTable = ({
  label,
  placeholder,
  type,
  register,
  value,
  error,
  inputClass,
  inputDiv,
  icon,
  onChange,
  defaultValue,
  maxLength,
  rules,
  dateClass,
  useComma = false,
  control,
  mainClass,
  field_disable = false,
  step = "0.01",
  name,
  maxDecimalLength = 3,
  allowNegative = false,
  hasError = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const input = e.target;
    let value = input.value;
    const cursorPosition = input.selectionStart;
    const originalValue = value;
    const originalLength = value.length;

    // Clean numeric input if type is number
    if (type === "number" && value) {
      // Step 1: Remove commas first to get raw value
      if (useComma) {
        value = unformatNumberWithCommas(value);
      }

      // Step 2: Clean input (allow digits, decimal point, and optional negative sign)
      const regex = allowNegative ? /[^0-9.-]/g : /[^0-9.]/g;
      value = value.replace(regex, "");

      // Step 3: Handle negative sign
      if (allowNegative) {
        const hasNegative = value.startsWith("-");
        value = value.replace(/-/g, "");
        if (hasNegative) value = "-" + value;
      } else {
        value = value.replace(/-/g, "");
      }

      // Step 4: Ensure single decimal point
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts[1];
      }

      // Step 5: Limit decimal places
      if (parts[1] && parts[1].length > maxDecimalLength) {
        value = parts[0] + "." + parts[1].slice(0, maxDecimalLength);
      }

      // Step 6: Format with comma if needed (for display only)
      let displayValue = value;
      if (useComma && value) {
        displayValue = formatNumberWithCommas(value);
      }

      // Step 7: Update input display value if changed
      input.value = displayValue;

      // Adjust cursor position
      const lengthDiff = displayValue.length - originalLength;
      let newCursorPosition = cursorPosition + lengthDiff;
      newCursorPosition = Math.max(0, Math.min(newCursorPosition, displayValue.length));

      // Set cursor position after a small delay to ensure input is updated
      setTimeout(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);

      // Create event with raw value (without commas) for form handling
      const rawValue = unformatNumberWithCommas(displayValue);
      const eventWithRawValue = {
        ...e,
        target: {
          ...e.target,
          value: rawValue,
        },
      };

      // Send the raw value (without commas) to handlers
      register?.onChange?.(eventWithRawValue);
      onChange?.(eventWithRawValue);
    } else {
      // For non-number types, handle normally
      register?.onChange?.(e);
      onChange?.(e);
    }
  };

  const handleDateChange = (date) => {
    if (onChange) {
      onChange({ target: { value: date } });
    }
    return date;
  };

  const getDisplayValue = () => {
    if (value !== undefined) {
      if (useComma && type === "number" && value) {
        return formatNumberWithCommas(value);
      }
      return value;
    }
    if (register && defaultValue !== undefined) {
      if (useComma && type === "number" && defaultValue) {
        return formatNumberWithCommas(defaultValue);
      }
      return defaultValue;
    }
    return "";
  };

  return (
    <>
      <div className={`${mainClass ? mainClass : "w-full"}`}>
        {label && <label className="mb-1 w-full !text-sm">{label}</label>}
        {type === "date" ? (
          <div>
            <Controller
              name={name || (typeof register === "string" ? register : register?.name)}
              control={control}
              rules={rules}
              defaultValue={defaultValue || null}
              render={({
                field: { onChange, onBlur, value: fieldValue, ref },
                fieldState: { error: fieldError },
              }) => (
                <>
                  <DatePicker
                    showIcon
                    selected={
                      value !== undefined
                        ? value
                        : fieldValue !== undefined
                          ? fieldValue
                          : defaultValue || ""
                    }
                    onChange={(date) => {
                      onChange(handleDateChange(date));
                    }}
                    dateFormat="dd/MM/yyyy"
                    className={`border rounded-md h-7 text-sm focus:outline-none w-full ${dateClass}`}
                    placeholderText={placeholder || "dd/MM/yyyy"}
                    ref={(el) => ref(el?.input)}
                    disabled={field_disable}
                  />
                  {(error || fieldError) && (
                    <div className="form-text text-xs text-danger mt-1">
                      {error?.message || fieldError?.message}
                    </div>
                  )}
                </>
              )}
            />
          </div>
        ) : (
          <div>
            <div className={inputDiv}>
              <Popover
                open={Boolean(error && isFocused)}
                content={<span className="text-white">{error}</span>}
                placement="topRight"
                color="#ef4444"
                overlayInnerStyle={{
                  padding: "4px 8px",     
                  borderRadius: "4px",     
                  fontSize: "12px",        
                  lineHeight: "16px",     
                  minHeight: "unset",      
                }}
              >
                <input
                  disabled={field_disable}
                  {...(register && { ...register })}
                  {...(step && { step })}
                  maxLength={maxLength}
                  value={getDisplayValue()}
                  placeholder={placeholder}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={` px-2 rounded-md w-full border-3 border-bottom border-end-0 border-green-500 border-start-0 border-top-0 h-7 w-100 text-sm focus:outline-none ${inputClass} ${hasError ? "border border-red-500 focus:border-red-500 error-shadow" : ""
                    }`}
                />
              </Popover>
              {icon}
            </div>
            {/* {error && (
  <div className="form-text text-xs text-danger mt-1">{error.message || error}</div>
)} */}
          </div>
        )}
      </div>
      <style>
        {`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__calendar-icon {
          padding: 7px !important;
          fill: #c5c7c9;
        }
        .react-datepicker-popper {
          z-index: 20;
        }
        `}
      </style>
    </>
  );
};

export default InputFieldTable;