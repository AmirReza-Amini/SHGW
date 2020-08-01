import React from "react";
import { ErrorMessage, Field, FastField } from "formik";
import { FormGroup, Label } from "reactstrap";
import Select from "react-select";

const CustomSelect = (props) => {
  const {
    label,
    name,
    options,
    selectedValue,
    placeholder,
    isMulti,
    ...rest
  } = props;
  return (
    <FormGroup>
      {label != null && label != "" && <Label for={name}>{label}</Label>}
      <Field name={name} as="select">
        {(fieldProps) => {
          const { field, form, meta } = fieldProps;
          //console.log("Render props", props);
          return (
            <div>
              <Select
                isMulti={isMulti ? true : false}
                className={isMulti?"basic-single rtl":"basic-multi-select rtl"}
                classNamePrefix="select"
                defaultValue={selectedValue}
                name={name}
                options={options}
                placeholder={placeholder}
                onChange={(value) => {
                  form.setFieldValue(name, value);
                  //if (props.onSelectedChanged)
                  props.onSelectedChanged(value);
                }}
                onBlur={() => form.setFieldTouched(name, true)}
              />
              {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
              ) : null}
            </div>
          );
        }}
      </Field>
    </FormGroup>
  );
};

export default CustomSelect;
