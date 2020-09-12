import React, { useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { LogIn, CloudLightning } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import * as auth from "../../services/authService"
import FormikControl from "../../components/common/formik/FormikControl";

import { getAreas } from "../../services/area";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
  username: "",
  password: "",
  selectedArea: ""
};

const validationSchema = Yup.object({
  username: Yup.string().required("!نام کاربری را وارد کنید"),
  password: Yup.string().required("!رمز عبور را وارد کنید"),
  selectedArea: Yup.string().required("!محوطه عملیات را انتخاب کنید")
});

//#endregion ---------------------------------------------------------------

//#region SUBMIT FORMIK ----------------------------------------------------

const onSubmit = async (values, props) => {

  let parameters = {
    username: values.username,
    password: values.password,
    area: values.selectedArea
  };

  try {
    await auth.login(_.pick(parameters, ["username", "password", "area"]));
    const { state } = props.location;
    console.log(props)
    window.location = state && state.from ? state.from.pathname : "/";

  } catch (err) {
  // if (err.response && err.response.status === 400)
     
      toast.error(err.response.data.data[0])
    
  }
};
//#endregion ---------------------------------------------------------------

const LoginPage = (props) => {

  //#region STATE ------------------------------------------

  const [state, setState] = useState({
    areaList: []
  });
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);

  //#endregion -----------------------------------------------------------

  //#region INITAL FUNCTIONS ---------------------------------------------

  useEffect(() => {
    getAreas().then(res => {
      if (res.data.result) {
        console.log('from area', res.data.data)
        setState({ areaList: res.data.data.map(item => { return { label: item.areaName, value: item.areaName } }) })
      }
    })
    const { message } = props.location.state;
    if (props.location.state && message && message.length > 0) {
      toast.error(message);
    }
    console.log('from login effevt',props)
  }, []);

  useEffect(() => {
    let errorMessage = "";
  }, []);

  //#endregion -----------------------------------------------------------

  return (


    <div className="container">
      <Row className="full-height-vh">
        <Col
          xs="12"
          className="d-flex align-items-center justify-content-center"
        >
          <Card className=" text-center width-400 bg-transparency" >
            <CardBody>
              <h2 className="white py-4">
                شرکت توسعه خدمات دریایی و بندری سینا
                  </h2>
              <div className="pt-2">

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    console.log("values", values);
                    await onSubmit(values, props);
                  }}
                  //validateOnBlur={true}
                  validateOnMount={true}
                  enableReinitialize
                >
                  {(formik) => {
                    //console.log("Formik props values", formik);

                    return (
                      <React.Fragment>
                        <Form>
                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="customSelect"
                                name="selectedArea"
                                selectedValue={
                                  state.selectedArea
                                }
                                options={state.areaList}
                                placeholder="انتخاب محوطه"

                                onSelectedChanged={(selectedValue) =>
                                  formik.setFieldValue('selectedArea', selectedValue.value)
                                }
                              />

                            </Col>
                          </Row>

                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="input"
                                type="text"
                                name="username"
                                id="username"
                                className="rtl"
                                placeholder="نام کاربری"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="input"
                                type="text"
                                id="password"
                                name="password"
                                className="rtl"
                                placeholder="کلمه عبور"
                              />
                            </Col>
                          </Row>
                          <div className="form-actions center">

                            <Button color="primary" type="submit" className="mr-1" disabled={!formik.isValid}>
                              <LogIn size={16} color="#FFF" /> ورود
                            </Button>

                          </div>
                        </Form>
                      </React.Fragment>
                    );
                  }}
                </Formik>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>


  );
};

export default LoginPage;
