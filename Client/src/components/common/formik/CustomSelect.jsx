import React from "react";
import { ErrorMessage, Field, FastField } from "formik";
import { FormGroup, Label } from "reactstrap";
import Select from "react-select";

const CustomSelect = (props) => {
  const { label, name, options,placeholder, ...rest } = props;
  return (
    <FormGroup>
      <Field name={name} as="select">
        {(props) => {
          const { field, form, meta } = props;
          console.log("Render props", props);
          return (
            <div>
              <Select
                className="basic-single rtl"
                classNamePrefix="select"
                name={name}
                options={options}
                placeholder={placeholder}
                onChange={value=>{
                    form.setFieldValue(name,value)
                }}
                onBlur={()=>form.setFieldTouched(name,true)}
              />
              {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
            </div>
          );
        }
        }
      </Field>
    </FormGroup>
  );
};

export default CustomSelect;
