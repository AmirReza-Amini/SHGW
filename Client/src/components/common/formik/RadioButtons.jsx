import React from 'react';
import { ErrorMessage, Field } from 'formik';
import TextError from './TextError';
import { FormGroup, Label } from "reactstrap";

const RadioButtons = (props) => {
    const { label, name, options, ...rest } = props;
    return (
        <FormGroup >
            <Label htmlFor={name}>{label}</Label>
            <Field as='radio' name={name} {...rest} className='form-control'>
                {
                    ({ field }) => {
                        //console.log('Field',field);
                        return options.map(option => {
                            return (
                                <React.Fragment key={option.key}>
                                    <input type='radio' id={option.value} {...field} value={option.value}
                                        checked={field.value === option.value} />
                                    <label htmlFor={option.value}>{option.key}</label>
                                </React.Fragment>
                            )
                        })
                    }
                }
            </Field>
            <ErrorMessage name={name} component={TextError}/>
        </FormGroup>
    );
}

export default RadioButtons;