import React, { Fragment, useState } from "react";
import { Card, CardBody, Row, Col, Button, Collapse } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import FormikControl from "../../components/common/formik/FormikControl";

import { getAreas } from "../../services/area";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
  username: "",
  password: "",
 selectedArea: {}
};

const validationSchema = Yup.object({
  username: Yup.string().required("!نام کاربری را وارد کنید"),
  password: Yup.string().required("!رمز عبور را وارد کنید"),
  //selectedArea: Yup.string().required("محوطه عملیات را انتخاب کنید")
});

//#endregion ---------------------------------------------------------------

//#region SUBMIT FORMIK ----------------------------------------------------

const onSubmit = (values) => {
  console.log("Form Submit Data", values);
  let parameters = {
    username: values.username,
    password: values.password,
   selectedArea: values.selectedArea
  };

  // return props.history.push('/operationType/vessel/discharge/damage',{actId:12309929,cntrNo:values.containerNo});
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
        setState({ areaList: res.data.data.map(item => { return { label: item.areaName, value: item.areaName } }) })
      }
    })
    console.log("salam");
  }, []);

  useEffect(() => {
    let errorMessage = "";
  }, []);

  //#endregion -----------------------------------------------------------

  //#region EVENT HANDLRES -----------------------------------------------

  const handleAreaSelectedChanged = (value) => {
    //console.log("handleVoyageSelectedChanged", value);
    //dispatch(voyageSelectedChanged(value));
  };

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
                  onSubmit={(values) => {
                    console.log("values", values);
                    onSubmit(values);
                  }}
                  validateOnBlur={true}
                 // validateOnMount = {true}
                  enableReinitialize
                >
                  {(formik) => {
                    console.log("Formik props values", formik);

                    return (
                      <React.Fragment>
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
                              onSelectedChanged={
                                handleAreaSelectedChanged
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
                              <CheckSquare size={16} color="#FFF" /> ورود
                            </Button>

                          </div>
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
