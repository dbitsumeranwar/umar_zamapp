import React, { memo, useState } from "react";
import { Controller } from "react-hook-form";
import { Select, Popover } from "antd";

const AntSSelectField = ({
  label,
  labelCLass,
  control,
  name,
  rules,
  error,
  onSelectChange = () => { },
  isClearable = true,
  defaultValue,
  multiple = false,
  options = [],
  disable = false,
}) => {

    const [focused, setFocused] = useState(false);

  return (
    <>
      <div className="w-full write-select full-w">
        {label && (
          <label className={`text-color font-regularweight mb-1 ${labelCLass}`}>{label}</label>
        )}
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue={defaultValue?.value}
          render={({ field, fieldState }) => (
            <Popover
              placement="topRight"
              color="#ef4444"
              open={focused && !!fieldState.error}
              content={<span className="text-white">{fieldState.error?.message}</span>}
            >
              <Select
                {...field}
                mode={multiple ? "multiple" : undefined}
                value={
                  multiple
                    ? field.value
                    : options.find((o) => o?.value === field?.value) || null
                }
                allowClear={isClearable}
                showSearch
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(value) => {
                  field.onChange(value);
                  onSelectChange?.(value);
                }}
                placeholder="Select"
                defaultActiveFirstOption
                filterOption={false}
                options={options}
                style={{ width: "100%" }}
                className={`custom-select h-7 w-100 ${fieldState.error
                    ? "border border-red-500 focus:border-red-500 error-shadow"
                    : ""
                  }`}
                disabled={disable}
              />
            </Popover>
          )}
        />

        {/* {error && <div className="form-text text-danger mt-1">{error.message}</div>} */}
      </div>
    </>
  );
};

export default memo(AntSSelectField);
