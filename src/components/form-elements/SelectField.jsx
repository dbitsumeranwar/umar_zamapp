import React, { memo, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { useGlobelApi } from "../../apis/useProduct/useCommon";
import useDebounce from "../../hooks/useDebounce";
import { Popover } from "antd";

const SelectField = ({
  label,
  labelCLass,
  control,
  name,
  rules,
  error,
  isClearable = true,
  endpoint,
  valueKey = "value",
  labelKey = "label",
  queryKey,
  responseWhich = "data",
  addionallydata,
  baseFilters,
  defaultValue,
  ContcatenateLabel,
}) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);
  const { mutate, isPending } = useGlobelApi(endpoint);
  const [options, setOptions] = useState([]);
  const [focused, setIsFocused] = useState(false)

  const fetchOptions = async (searchTerm) => {
    const queryfilters = [
      {
        key: queryKey,
        operator: "contains",
        value1: searchTerm,
        logical: "",
      },
    ];
    const filters = baseFilters
      ? [...baseFilters, ...queryfilters]
      : queryfilters;
    // const filters = searchTerm ? [...baseFilters, queryfilters] : baseFilters;

    const body = {
      ...(addionallydata && { userId: addionallydata }),
      filters: filters,
      limit: 0,
      offset: 0,
    };

    mutate(body, {
      onSuccess: (res) => {
        const fetchedOptions = res[responseWhich].map((item) => ({
          value: item[valueKey]?.toString(),
          label: ContcatenateLabel
            ? item[labelKey] + " - " + item[ContcatenateLabel]
            : item[labelKey],
        }));
        setOptions(fetchedOptions);
        if (
          defaultValue &&
          !fetchedOptions.some((option) => option.value === defaultValue.value)
        ) {
          setOptions((prevOptions) => [defaultValue, ...prevOptions]);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };
  const handleInputChange = (newValue, { action }) => {
    setInputValue(newValue);

    if (action === "input-change" && newValue === "") {
      // fetchOptions(""); // Trigger API call when input is cleared
      setOptions([]);
    }
  };

  // useEffect(() => {
  //   fetchOptions();
  // }, []);

  useEffect(() => {
    if (debouncedInputValue) fetchOptions(debouncedInputValue);
  }, [debouncedInputValue]);

  useEffect(() => {
    if (defaultValue) {
      fetchOptions(defaultValue.label || defaultValue.value || "");
    }
  }, [defaultValue]);

  const handleBlur = (event) => {
    if (!event.target.value) {
      // Trigger API call when field loses focus and no value is selected
      // fetchOptions("");
      setOptions([]);
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full write-select full-w">
      {label && (
        <label className={`text-color font-regularweight mb-1 ${labelCLass}`}>{label}</label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <Popover
            placement="topRight"
            color="#ef4444"
            open={focused && !!fieldState.error}
            content={<span className="text-white">{fieldState.error?.message}</span>}
          >
            <Select
              {...field}
              value={field.value || defaultValue}
              options={options}
              isClearable={isClearable}
              className="custom-select-class"
              isLoading={isPending}
              onBlur={handleBlur}
              onInputChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              noOptionsMessage={() =>
                isPending
                  ? "Loading options..."
                  : "No options available. Please write and search."
              }
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "30px",
                  boxShadow: "none",
                  caretColor: "#24B1B3",
                  border: `1px solid ${fieldState.error ? "#ef4444" : "#E5E7EB"
                    }`,
                  borderRadius: "8px",
                  boxShadow: `${fieldState.error ? "0px 0px 15px rgb(223 20 20 / 46%)" : "#E5E7EB"}`,
                  fontSize: "14px",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "rgb(148 163 184)",
                }),
              }}
            />
          </Popover>
        )}
      />

      {/* {error && (
        <div className="form-text text-danger mt-1">{error.message}</div>
      )} */}
    </div>
  );
};

export default memo(SelectField);
