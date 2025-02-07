/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import { useFileUpload } from "../../hooks/useFileUpload";
import { CloudUpload, FilePlus, X } from "lucide-react";

function InputForm({
  formControl,
  formik,
  formStyle,
  inputStyle,
  disabled = false,
  children,
}) {
  const { getCities, getCategories, cities, categories } = useProductStore();

  const { multiFile, removePreview, handleDrop, handleDragOver } =
    useFileUpload(formik.setFieldValue, formik.values);

  useEffect(() => {
    formControl.forEach((control) => {
      if (control.label === "city") {
        getCities();
      }
      if (control.label === "category") {
        getCategories();
      }
    });
  }, []);

  function renderComponentByType(control) {
    let element = null;

    const options =
      control.label === "city"
        ? cities
        : control.label === "category"
        ? categories
        : control.options || [];

    switch (control.component) {
      case "input":
        element = (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Label htmlFor={control.label} className="label_input">
                {control.label}
              </Label>
              {formik.touched[control.name] && formik.errors[control.name] && (
                <p className="text-red-500 text-xs">
                  {formik.errors[control.name]}
                </p>
              )}
            </div>
            <Input
              id={control.label}
              name={control.name}
              type={control.type}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={control.placeholder}
              value={formik.values[control.name]}
              disabled={control.disabled || disabled}
              className="mt-1 block w-full"
            />
          </div>
        );
        break;

      case "upload":
        element = (
          <div className="h-96">
            {formik.values[control.name] &&
            formik.values[control.name].length !== 0 ? (
              <div className="grid_display_5">
                {formik.values[control.name].map((image, index) => (
                  <div className="relative" key={index}>
                    <button
                      name={control.name}
                      type="button"
                      className="remove_preview_btn"
                      onClick={() => removePreview(control.name, index)}
                    >
                      <X size={14} />
                    </button>
                    <div className="h-40 rounded-md overflow-hidden">
                      {image instanceof File ? (
                        <img
                          src={URL.createObjectURL(image)}
                          className="object-cover"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        />
                      ) : (
                        <img src={image} className="object-cover" />
                      )}
                    </div>
                  </div>
                ))}
                {formik.values[control.name].length < 5 && (
                  <div className="h-40 w-full">
                    <label htmlFor={control.label} className="upload_btn">
                      <FilePlus size={20} />
                      <input
                        id={control.label}
                        required
                        multiple
                        type="file"
                        accept="image/*"
                        className="hidden"
                        name={control.name}
                        onChange={multiFile}
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <label
                className="upload_btn"
                htmlFor={control.label}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, control.name)}
              >
                <div className="flex_center">
                  <CloudUpload size={24} />
                </div>
                <input
                  id={control.label}
                  required
                  multiple
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name={control.name}
                  onChange={multiFile}
                />
              </label>
            )}
          </div>
        );
        break;

      case "checkbox-multiple":
        return (
          <div>
            {options.map((option) => {
              const selectedValues = formik.values[control.name] || [];
              return (
                <div
                  className="flex items-center space-x-3 py-2 px-3"
                  key={option.id}
                >
                  <input
                    id={option.id}
                    type="checkbox"
                    name={control.name}
                    value={option.name}
                    onBlur={formik.handleBlur}
                    onChange={() => {
                      let newValues = [...selectedValues];
                      if (newValues.includes(option.name)) {
                        newValues = newValues.filter(
                          (val) => val !== option.name
                        );
                      } else {
                        newValues.push(option.name);
                      }
                      formik.setFieldValue(control.name, newValues);
                    }}
                    checked={selectedValues.includes(option.name)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={option.id}>{option.name}</Label>
                </div>
              );
            })}
          </div>
        );

      case "checkbox-single":
        return (
          <div
            className="flex items-center space-x-3 py-2 px-3"
            key={control.name}
          >
            <input
              id={control.label}
              name={control.name}
              type="checkbox"
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue(control.name, e.target.checked)
              }
              checked={formik.values[control.name]}
              className="w-5 h-5"
            />
            <Label htmlFor={control.name}>{control.label}</Label>
          </div>
        );

      case "select":
        element = (
          <div className="flex flex-col space-y-1 mb-2">
            <div className="flex items-center space-x-2 h-5">
              <Label htmlFor={control.label} className="label_input">
                {control.label}
              </Label>
              {formik.touched[control.name] && formik.errors[control.name] && (
                <p className="text-red-500 text-xs">
                  {formik.errors[control.name]}
                </p>
              )}
            </div>
            <select
              id={control.label}
              name={control.name}
              type={control.type}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={control.placeholder}
              value={formik.values[control.name]}
              disabled={control.disabled || disabled}
              className="rounded-md border border-input px-3 py-2 text-sm"
            >
              <option value="" disabled>
                {control.placeholder}
              </option>
              {options.map((option) => (
                <option value={option?.id || option} key={option?.id || option}>
                  {option?.name || option}
                </option>
              ))}
            </select>
          </div>
        );
        break;

      case "filter":
        element = (
          <select
            id={control.label}
            name={control.name}
            type={control.type}
            onBlur={formik.handleBlur}
            placeholder={control.placeholder}
            onChange={formik.handleChange}
            value={formik.values[control.name]}
            disabled={control.disabled || disabled}
            className="rounded-md border border-input px-3 py-2 text-sm w-full"
          >
            <option value="" disabled>
              {control.placeholder}
            </option>
            {control.options.map((option) => (
              <option value={option?.id || option} key={option?.id || option}>
                {option?.name || option}
              </option>
            ))}
          </select>
        );
        break;
      case "textarea":
        element = (
          <>
            <div className="flex items-center space-x-2 mb-2">
              <Label htmlFor={control.label} className="label_input">
                {control.label}
              </Label>
              {formik.touched[control.name] && formik.errors[control.name] && (
                <p className="text-red-500 text-xs">
                  {formik.errors[control.name]}
                </p>
              )}
            </div>
            <Textarea
              id={control.name}
              name={control.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values[control.name]}
              placeholder={control.placeholder}
              disabled={control.disabled || disabled}
              maxLength="400"
              className="resize-none h-60"
            />
          </>
        );
        break;
      case "date":
        element = (
          <div className="mb-4">
            <Label htmlFor={control.label} className="label_input">
              {control.label}
            </Label>
            <Input
              id={control.label}
              name={control.name}
              type="date"
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.setFieldValue(control.name, e.target.value);
              }}
              placeholder={control.placeholder}
              value={formik.values[control.name] ? "" : ""}
              className="mt-1 block w-full"
            />
            {formik.touched[control.name] && formik.errors[control.name] && (
              <p className="text-red-500 text-xs">
                {formik.errors[control.name]}
              </p>
            )}
          </div>
        );
        break;
      default:
        element = (
          <>
            <div className="flex items-center space-x-2 mb-2">
              <Label htmlFor={control.label} className="label_input">
                {control.label}
              </Label>
              {formik.touched[control.name] && formik.errors[control.name] && (
                <p className="text-red-500 text-xs">
                  {formik.errors[control.name]}
                </p>
              )}
            </div>

            <Input
              id={control.label}
              name={control.name}
              type={control.type}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={control.placeholder}
              value={formik.values[control.name]}
              className="mt-1 block w-full"
              disabled={control.disabled || disabled}
            />
          </>
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={formik.handleSubmit} className={`space-y-4 ${formStyle}`}>
      {formControl.map((control) => (
        <div key={control.name} className={inputStyle}>
          {renderComponentByType(control)}
        </div>
      ))}
      <div>{children}</div>
    </form>
  );
}

export default InputForm;
