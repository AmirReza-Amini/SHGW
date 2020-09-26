import React, { Component } from "react";
import { Button, ButtonGroup, Label, Row, Col, FormGroup } from "reactstrap";
import { Field } from "formik";
import _ from 'lodash';
import DatePicker, { Calendar } from 'react-modern-calendar-datepicker';
import InputMaskDebounce from "./InputMaskDebounce";

class CustomDateTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedDay: props.defaultValue ? props.defaultValue : null };
    }

    handleSelectedDateChanged = (value, form) => {
        this.setState({ selectedDay: value });
        console.log('handleSelectedDateChanged', this.props, this.state, value)
        if (this.props.onSelectedChanged) this.props.onSelectedChanged(value);
        form.setFieldValue(this.props.name, value);
    };

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        if (!_.isEqual(_.sortBy(this.props.defaultValue), _.sortBy(nextProps.defaultValue)))
            this.setState({ selectedDay: nextProps.defaultValue })
    }

    // renderCustomInput = ({ ref }) => (
    //     <input
    //         ref={ref} // necessary
    //         placeholder={this.props.placeholder}
    //         value={this.state.selectedDay ? this.state.selectedDay.year + '/' + this.state.selectedDay.month + '/' + this.state.selectedDay.day : ''}
    //         className="form-control" // a styling class
    //     />
    // )

    render() {
        //console.log(this.props)
        const { label, name, className, placeholder } = this.props;
        const classN = "form-control " + (className !== "" ? className : "");
        return (
            <FormGroup>
                {label !== null && label !== "" && <Label for={name}>{label}</Label>}
                <Field>
                    {
                        (fieldProps) => {
                            const { form } = fieldProps;
                            return (

                                <DatePicker
                                
                                    value={this.state.selectedDay}
                                    onChange={(value) => this.handleSelectedDateChanged(value, form)}
                                    colorPrimary="rgb(57, 124, 182)" // added this
                                    calendarClassName="custom-calendar" // and this
                                    calendarTodayClassName="custom-today-day" // also this
                                    shouldHighlightWeekends
                                    locale="fa"
                                    inputClassName={classN}
                                    inputPlaceholder={placeholder}
                                  //  renderInput={this.renderCustomInput}
                                />
                            )
                        }
                    }
                </Field>
            </FormGroup>
        );
    }
}

export default CustomDateTimePicker;