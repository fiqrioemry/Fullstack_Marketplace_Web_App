/* eslint-disable react/prop-types */
import { useCallback } from "react";
import InputLabel from "./InputLabel";

const MultipleCheckedComponent = ({
  formik,
  type,
  label,
  value,
  options,
  name,
  disabled,
}) => {
  const handleChange = useCallback(
    (optionName) => {
      const newValues = value.includes(optionName)
        ? value.filter((val) => val !== optionName)
        : [...value, optionName];

      formik.setFieldValue(name, newValues);
    },
    [formik, value, name]
  );

  return (
    <div>
      <InputLabel formik={formik} label={label} name={name} />
      {options.map((option) => (
        <div
          className="flex items-center space-x-3 py-2 px-3"
          key={option.id || option}
        >
          <input
            id={option.id || option}
            type={type}
            disabled={disabled}
            checked={value.includes(option?.name || option)}
            onChange={() => handleChange(option.name || option)}
            className="w-4 h-4"
          />
          <label htmlFor={option?.id || option}>{option?.name || option}</label>
        </div>
      ))}
    </div>
  );
};

export default MultipleCheckedComponent;
