import React, { Fragment, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  CustomInput,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  X,
  CheckSquare,
  User,
  Briefcase,
  MessageSquare,
  Clock,
  File,
  Info,
  FileText,
  Mail,
  AlertTriangle,
} from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import CustomNavigation from "../../components/common/customNavigation";
import FormikControl from "../../components/common/formik/FormikControl";
import {
  fetchVoyagesTopTenOpen,
  voyageSelectedChanged,
} from "../../redux/common/voyage/voyageActions";
import {
  fetchDamageDefinition
} from "../../redux/common/damage/damageActions";
import { getDamageInfoByActId, setDamageInfoByActId } from '../../services/damage';
import { fetchOperatorInfoBasedOnCode } from "../../redux/common/operator/operatorActions";

import {
  getCntrInfoForUnload,
  saveUnload,
  addToShifting,
  addToLoadingList,
  isExistCntrInInstructionLoading,
  saveUnloadIncrement,
} from "../../services/vessel/berth";
import { Redirect, Link } from "react-router-dom";
import CustomButtonGroup from "../../components/common/formik/CustomButtonGroup";

export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

toast.configure({ bodyClassName: "customFont rtl" });

//#region Initial Values

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

//#region Submit Formik ------------------------------------------------------

const onSubmit = (values, props) => {
  console.log("Form Submit Data", values);
  if (values.selectedBottomDamages.length == 0 && values.selectedFrontDamages.length == 0 && values.selectedLeftDamages.length == 0 &&
    values.selectedOtherDamages.length == 0 && values.selectedRearDamages.length == 0 && values.selectedRightDamages.length == 0 &&
    values.selectedTopDamages.length == 0) {
    toast.error('خسارتی انتخاب نشده است');
    return;
  }

  const data = _(values.selectedFrontDamages).join('');
  const damageList = [];
  if (values.selectedFrontDamages.length > 0) {
    damageList.push({ side: 1, letters: _(values.selectedFrontDamages).join('') });
  }
  if (values.selectedRearDamages.length > 0) {
    damageList.push({ side: 2, letters: _(values.selectedRearDamages).join('') });
  }
  if (values.selectedRightDamages.length > 0) {
    damageList.push({ side: 3, letters: _(values.selectedRightDamages).join('') });
  }
  if (values.selectedLeftDamages.length > 0) {
    damageList.push({ side: 4, letters: _(values.selectedLeftDamages).join('') });
  }
  if (values.selectedTopDamages.length > 0) {
    damageList.push({ side: 5, letters: _(values.selectedTopDamages).join('') });
  }
  if (values.selectedBottomDamages.length > 0) {
    damageList.push({ side: 6, letters: _(values.selectedBottomDamages).join('') });
  }
  if (values.selectedOtherDamages.length > 0) {
    damageList.push({ side: 7, letters: _(values.selectedOtherDamages).join('') });
  }

  Promise.all(damageList.map((element) => {
    return setDamageInfoByActId({ actId: values.actId, letters: element.letters, side: element.side, staffId: 220 });
  })).then(response => {
    console.log('damage promise all response', response);
    const successResult=response.filter(c=>c.data.result==true);
    //const successResult=response.map(c=>c.data);
    const errorResult=response.filter(c=>c.data.result==false);
    console.log(successResult,errorResult,damageList.length)
    if (successResult.length == damageList.length){
      toast.success(successResult[0].data.data[0]);
      return props.history.push('/operationType/vessel/discharge/');
    }
    else{
      console.log(errorResult.length +` مورد ` +errorResult[0].data.data[0]);
      toast.error(errorResult.length +` مورد ` +errorResult[0].data.data[0]);
      return;
    }
  }).catch(error=>{
    console.log('damage promise all err', error);
  })
};
//#endregion -----------------------------------------------------------------

const DamagePage = (props) => {
  //#region Selectors and State ---------------------------------------------

  const damageData = useSelector((state) => state.damage);
  const sidedDamages = damageData.damages.filter(c => c.isSided).map(c => c.value.trim());
  //console.log('sidedDamages', sidedDamages);
  const notSidedDamages = damageData.damages.filter(c => !c.isSided).map(c => c.value.trim());
  //console.log('props', props)
  const [state, setState] = useState({
    cntrNo:
      props.location.state != undefined ? props.location.state.cntrNo : "---",
    actId: props.location.state != undefined ? props.location.state.actId : 0,
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

  //#endregion

  //#region Initialize Functions --------------------------------------------

  useEffect(() => {
    //console.log('salam use effect')
    if (damageData.damages === null || damageData.damages.length === 0) {
      dispatch(fetchDamageDefinition());
    }

    getDamageInfoByActId({ actId: state.actId }).then(response => {
     // console.log('res', response);
      let { data, result } = response.data;
      if (result) {

        const defaultFrontDamages = _(data).filter(c => c.Side == 1 && c.Letters != null).first();
        const defaultRearDamages = _(data).filter(c => c.Side == 2 && c.Letters != null).first();
        const defaultRightDamages = _(data).filter(c => c.Side == 3 && c.Letters != null).first();
        const defaultLeftDamages = _(data).filter(c => c.Side == 4 && c.Letters != null).first();
        const defaultTopDamages = _(data).filter(c => c.Side == 5 && c.Letters != null).first();
        const defaultBottomDamages = _(data).filter(c => c.Side == 6 && c.Letters != null).first();
        const defaultOtherDamages = _(data).filter(c => c.Side == 7 && c.Letters != null).first();

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

  //#endregion --------------------------------------------------------------

  //#region Event Handlers --------------------------------------------------

  const handleVoyageSelectedChanged = (value) => {
    //console.log("handleVoyageSelectedChanged", value);
    //dispatch(voyageSelectedChanged(value));
  };

  const handleFrontDamageSelected = (value) => {
    //console.log("handleFrontDamageSelected", value)
  }

  const disableSubmitButton = (values) => {
    //console.log("disableSubmitButton", values, values.selectedBottomDamages.length);
    if (values.selectedBottomDamages.length != 0 || values.selectedFrontDamages.length != 0 || values.selectedLeftDamages.length != 0 ||
      values.selectedOtherDamages.length != 0 || values.selectedRearDamages.length != 0 || values.selectedRightDamages.length != 0 ||
      values.selectedTopDamages.length != 0) {
      return false;
    }
    else {
      return true;
    }
  }

  const handleCancelButton=()=>{
    props.history.replace('/operationType/vessel/discharge/');
  }
  //#endregion ---------------------------------------------------------------
  const selectedValues = ["P", "S"];
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
                                    <FormikControl control="customButtonGroup" label="Front" name="selectedFrontDamages" source={sidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedFrontDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Rear" name="selectedRearDamages" source={sidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedRearDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Right" name="selectedRightDamages" source={sidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedRightDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Left" name="selectedLeftDamages" source={sidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedLeftDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Top" name="selectedTopDamages" source={sidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedTopDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Bottom" name="selectedBottomDamages" source={sidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedBottomDamages} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="12">
                                    <FormikControl control="customButtonGroup" label="Other" name="selectedOtherDamages" source={notSidedDamages} onSelectedChanged={handleFrontDamageSelected} defaultValues={state.selectedOtherDamages} />
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
