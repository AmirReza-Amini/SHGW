import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { X, CheckSquare, LogIn } from "react-feather";
import { Formik, Form } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import CustomNavigation from "../../components/common/customNavigation";
import FormikControl from "../../components/common/formik/FormikControl";
import { fetchDamageDefinition } from "../../redux/common/damage/damageActions";
import { getDamageInfoByActId, setDamageInfoByActId } from '../../services/damage';
import { Redirect } from "react-router-dom";


toast.configure({ bodyClassName: "customFont rtl" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
  selectedFrontDamages: [],
  selectedRearDamages: [],
  selectedTopDamages: [],
  selectedBottomDamages: [],
  selectedLeftDamages: [],
  selectedRightDamages: [],
  selectedOtherDamages: []
};

//#endregion

//#region SUBMIT FORMIK ----------------------------------------------------

const onSubmit = (values, props) => {

  //console.log("Form Submit Data", values);
  if (values.selectedBottomDamages.length === 0 && values.selectedFrontDamages.length === 0 && values.selectedLeftDamages.length === 0 &&
    values.selectedOtherDamages.length === 0 && values.selectedRearDamages.length === 0 && values.selectedRightDamages.length === 0 &&
    values.selectedTopDamages.length === 0) {
    toast.error('خسارتی انتخاب نشده است');
    return;
  }

  const damageList = [];
  if (values.selectedFrontDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedFrontDamages).join(''), Side: 1, StaffID: 220 });
  }
  if (values.selectedRearDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedRearDamages).join(''), Side: 2, StaffID: 220 });
  }
  if (values.selectedRightDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedRightDamages).join(''), Side: 3, StaffID: 220 });
  }
  if (values.selectedLeftDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedLeftDamages).join(''), Side: 4, StaffID: 220 });
  }
  if (values.selectedTopDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedTopDamages).join(''), Side: 5, StaffID: 220 });
  }
  if (values.selectedBottomDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedBottomDamages).join(''), Side: 6, StaffID: 220 });
  }
  if (values.selectedOtherDamages.length > 0) {
    damageList.push({ ActID: values.actId, Letters: _(values.selectedOtherDamages).join(''), Side: 7, StaffID: 220 });
  }
  //console.log('damageList', damageList);
  setDamageInfoByActId({ data: damageList }).then(response => {
    //console.log('damage promise all response', response);
    let { result, data } = response.data;
    if (result) {
      toast.success(data[0]);
      return props.history.push(props.location.pathname.replace('/damage', ''));
    }
    else {
      toast.error(data[0]);
    }
  }).catch(error => {
    toast.error(error.response.data.data[0]);
    if (error.response.status == 401) {
      console.log('props damage locatopn', props);
      return props.history.replace('/login', { from: props.location })
      // return <Redirect
      //   to={{
      //     pathname: "/login",
      //     state: { from: props.location }
      //   }}
      // />;
    }
    console.log('damage promise all err', error.response);
  })
};

//#endregion ---------------------------------------------------------------

const DamagePage = (props) => {
  console.log('damage props', props);

  //#region SELECTORS AND STATE --------------------------------------------

  const damageData = useSelector((state) => state.damage);
  const sidedDamages = damageData.damages.filter(c => c.isSided).map(c => c.value.trim());
  const notSidedDamages = damageData.damages.filter(c => !c.isSided).map(c => c.value.trim());
  //console.log('props', props)
  const [state, setState] = useState({
    cntrNo:
      props.location.state !== undefined ? props.location.state.cntrNo : "---",
    actId: props.location.state !== undefined ? props.location.state.actId : 0,
    selectedFrontDamages: [],
    selectedRearDamages: [],
    selectedTopDamages: [],
    selectedBottomDamages: [],
    selectedLeftDamages: [],
    selectedRightDamages: [],
    selectedOtherDamages: []
  });
  //console.log('salam use state');
  const dispatch = useDispatch();

  //#endregion -------------------------------------------------------------

  //#region INITIAL FUNCTIONS ----------------------------------------------

  useEffect(() => {
    //console.log('salam use effect')
    if (damageData.damages === null || damageData.damages.length === 0) {
      dispatch(fetchDamageDefinition());
    }

    getDamageInfoByActId({ actId: state.actId }).then(response => {
      // console.log('res', response);
      let { data, result } = response.data;
      if (result) {

        const defaultFrontDamages = _(data).filter(c => c.Side === 1 && c.Letters !== null).first();
        const defaultRearDamages = _(data).filter(c => c.Side === 2 && c.Letters !== null).first();
        const defaultRightDamages = _(data).filter(c => c.Side === 3 && c.Letters !== null).first();
        const defaultLeftDamages = _(data).filter(c => c.Side === 4 && c.Letters !== null).first();
        const defaultTopDamages = _(data).filter(c => c.Side === 5 && c.Letters !== null).first();
        const defaultBottomDamages = _(data).filter(c => c.Side === 6 && c.Letters != null).first();
        const defaultOtherDamages = _(data).filter(c => c.Side === 7 && c.Letters !== null).first();

        setState({
          ...state,
          selectedFrontDamages: defaultFrontDamages ? defaultFrontDamages['Letters'].split('') : [],
          selectedRearDamages: defaultRearDamages ? defaultRearDamages['Letters'].split('') : [],
          selectedRightDamages: defaultRightDamages ? defaultRightDamages['Letters'].split('') : [],
          selectedLeftDamages: defaultLeftDamages ? defaultLeftDamages['Letters'].split('') : [],
          selectedTopDamages: defaultTopDamages ? defaultTopDamages['Letters'].split('') : [],
          selectedBottomDamages: defaultBottomDamages ? defaultBottomDamages['Letters'].split('') : [],
          selectedOtherDamages: defaultOtherDamages ? defaultOtherDamages['Letters'].split('') : []
        });

      }
      else {
        return toast.error('خطا در بازیابی اطلاعات خسارت کانتینر');
      }
    }).catch(err => {
      toast.error(err);
    })

  }, []);

  //#endregion -------------------------------------------------------------

  //#region EVENT HANDLRES -------------------------------------------------

  const disableSubmitButton = (values) => {
    //console.log("disableSubmitButton", values, values.selectedBottomDamages.length);
    if (values.selectedBottomDamages.length !== 0 || values.selectedFrontDamages.length !== 0 || values.selectedLeftDamages.length !== 0 ||
      values.selectedOtherDamages.length !== 0 || values.selectedRearDamages.length !== 0 || values.selectedRightDamages.length !== 0 ||
      values.selectedTopDamages.length !== 0) {
      return false;
    }
    else {
      return true;
    }
  }

  const handleCancelButton = () => {
    props.history.replace(props.location.pathname.replace('/damage', ''));
  }
  //#endregion -------------------------------------------------------------

  return (
    <Fragment>
      <Row className="justify-content-md-center">
        <Col md="6">
          <div>
            <CustomNavigation path={props.match.path} />
          </div>
          <Card>
            <CardBody>
              {/* <CardTitle>Event Registration</CardTitle> */}
              {/* <p className="mb-2" style={{ textAlign: "center" }}>
                ثبت عملیات تخلیه
              </p> */}
              <div className="px-3">
                {
                  damageData.damages != null && damageData.damages.length > 0 && sidedDamages.length > 0 &&
                  <Formik
                    initialValues={state || initialValues}
                    onSubmit={(values) => {
                      onSubmit(values, props);
                    }}
                    validateOnBlur={true}
                    enableReinitialize
                  >
                    {(formik) => {
                      //console.log("state in formik", state);
                      const submitDisabled = disableSubmitButton(formik.values);
                      return (
                        <Form>
                          <Row>
                            <Col md="12" style={{ textAlign: "right" }} className="rtl">
                              <span className="labelDescription">
                                شماره کانتینر:
                              </span>{" "}
                              <span className="guessedOperation">
                                {state.cntrNo}
                              </span>
                            </Col>
                          </Row>
                          <Row className="justify-content-md-center">
                            <Col md="12">
                              <div className="form-body">
                                <Row >
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Front" name="selectedFrontDamages" source={sidedDamages} defaultValues={state.selectedFrontDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Rear" name="selectedRearDamages" source={sidedDamages} defaultValues={state.selectedRearDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Right" name="selectedRightDamages" source={sidedDamages} defaultValues={state.selectedRightDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Left" name="selectedLeftDamages" source={sidedDamages} defaultValues={state.selectedLeftDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Top" name="selectedTopDamages" source={sidedDamages} defaultValues={state.selectedTopDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Bottom" name="selectedBottomDamages" source={sidedDamages} defaultValues={state.selectedBottomDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Other" name="selectedOtherDamages" source={notSidedDamages} defaultValues={state.selectedOtherDamages} />
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>

                          <div className="form-actions center">
                            <Button color="warning" className="mr-1" type="button" onClick={handleCancelButton}>
                              <X size={16} color="#FFF" /> لغو
                          </Button>
                            <Button type="submit" color="primary" disabled={submitDisabled}>
                              <CheckSquare size={16} color="#FFF" /> ثبت
                          </Button>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                }
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default DamagePage;
