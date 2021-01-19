import React, { useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { LogIn } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import * as auth from "../../services/authService"
import FormikControl from "../../components/common/formik/FormikControl";

import { getAreas } from "../../services/area";
import ReactRevealText from 'react-reveal-text';
import config from '../../config.json';
import ClientCaptcha from "react-client-captcha";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
  username: "",
  password: "",
  selectedArea: "",
  captchaText: ""
};

const validationSchema = Yup.object({
  username: Yup.string().required("Enter Username !"),
  password: Yup.string().required("Enter Password !"),
  selectedArea: Yup.string().required("Select Operation Area !"),
  captchaText: Yup.string().required("Enter Security Code !")
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
    const { result, message } = await auth.login(_.pick(parameters, ["username", "password", "area"]));
    if (!result)
      return toast.error(message);
    else {
      const { state } = props.location;
      //console.log(props, state);
      //console.log('ssssssss', props.location.state);
      //window.location = state && state.from ? state.from.pathname : "/";
      if (state && state.from)
        return props.history.replace(state && state.from ? state.from.pathname : '/', { ...state.from.state })
      else
        window.location = "/";
    }
  } catch (err) {
    if (err.response && err.response.status === 401)
      return toast.error(err.response.data.data[0])
  }
};
//#endregion ---------------------------------------------------------------

const LoginPage = (props) => {

  //#region STATE ------------------------------------------

  const [state, setState] = useState({
    areaList: [],
    captchaCode: '',
    captchaTextIsValid:false
  });
  const [show, setShow] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);

  //#endregion -----------------------------------------------------------

  //#region INITAL FUNCTIONS ---------------------------------------------

  // setState(prevState => {
  //   // Object.assign would also work
  //   return {...prevState, ...updatedValues};
  // });
  useEffect(() => {
    getAreas().then(res => {
      if (res.data.result) {
        setState(prevState => {
          return {
            ...prevState,
            captchaTextIsValid:false,
            areaList: res.data.data.map(item => { return { label: item.areaName, value: item.areaName } })
          }
        })
      }
      else {
        return toast.error(res.data.data[0]);
      }
    }).catch(error => { });

    if (props.location.state) {
      const { message } = props.location.state;
      if (props.location.state && message && message.length > 0) {
        toast.error(message);
      }
    }

    //console.log('from login effevt', props)

    setTimeout(() => {
      setShow(true);
    }, 1000);

  }, []);

  useEffect(() => {
    let errorMessage = "";
  }, []);

  //#endregion -----------------------------------------------------------

  const handleCaptchaText = (text) => {
     setState(prevState=>{
       return{
         ...prevState,
         captchaTextIsValid:_.isEqual(text, _.toUpper(state.captchaCode))
       }
     }) 
  }

  return (


    <div className="container">
      <Row className="full-height-vh">
        <Col
          xs="12"
          className="d-flex align-items-center justify-content-center"
        >
          <Card className=" text-center width-400 bg-transparency customBackgroundColor">
            <CardBody>
              <h2 className="white py-4">
                <ReactRevealText show={show}>
                  {config.appName}
                </ReactRevealText>
              </h2>
              <div className="pt-2">

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    //console.log("values", values);
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
                                placeholder="Operation Area"

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
                                className="ltr"
                                placeholder="Username"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="input"
                                type="password"
                                id="password"
                                name="password"
                                className="ltr"
                                placeholder="Password"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <ClientCaptcha captchaCode={code => setState(prevState => {
                                return { ...prevState,captchaTextIsValid:false, captchaCode: code }
                              })} />
                            </Col>
                            <Col md="6">
                              <FormikControl
                                control="inputMaskDebounce"
                                name="captchaText"
                                mask="****"
                                debounceTime={0}
                                placeholder="Security Code"
                                className="ltr"
                                onChange={() =>
                                  handleCaptchaText(
                                    formik.values.captchaText
                                  )
                                }
                                toUppercase={true}
                              />
                            </Col>
                          </Row>
                          <div className="form-actions center">

                            <Button color="primary" type="submit" className="mr-1" disabled={!formik.isValid || !state.captchaTextIsValid}>
                              <LogIn size={16} color="#FFF" /> Enter
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
