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
import {fetchDamageDefinition
} from "../../redux/common/damage/damageActions";
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

toast.configure({ bodyClassName: "customFont" });

//#region Initial Values

const initialValues = {
  selectVoyageNo: "",
  selectEquipmentType: "",
  containerNo: "",
  operatorCode: "",
  truckNo: "",
  checkboxListSelected: [],
};

//#endregion

//#region Submit Formik ------------------------------------------------------

const onSubmit = (values, props) => {
  console.log("Form Submit Data", values);

  //return props.history.push('/operationType/vessel/discharge/damage',{actId:12309929,cntrNo:values.containerNo});
};
//#endregion -----------------------------------------------------------------

const DamagePage = (props) => {
  //#region Selectors and State ---------------------------------------------

  const damageData = useSelector((state) => state.damage);
  const [state, setState] = useState({
    cntrNo:
      props.location.state != undefined ? props.location.state.cntrNo : "---"
  });
  const dispatch = useDispatch();

  //#endregion

  //#region Initialize Functions --------------------------------------------

  useEffect(() => {
    if (damageData.damages === null || damageData.damages.length === 0) {
        dispatch(fetchDamageDefinition());
      }
   
  }, []);

  //#endregion --------------------------------------------------------------

  //#region Event Handlers --------------------------------------------------

  const handleVoyageSelectedChanged = (value) => {
    //console.log("handleVoyageSelectedChanged", value);
    //dispatch(voyageSelectedChanged(value));
  };

  //#endregion ---------------------------------------------------------------

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
                <Formik
                  initialValues={state || initialValues}
                  onSubmit={(values) => {
                    onSubmit(values, props);
                  }}
                  validateOnBlur={true}
                  enableReinitialize
                >
                  {(formik) => {
                    console.log("Formik props values", formik.values);
                    return (
                      <Form>
                        <Row className="justify-content-md-center">
                          <Col md="12">
                            <div className="form-body">
                              <Row>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    label="Front"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="ّFront"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="Rear"
                                    label="Rear"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="Right"
                                    label="Right"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="Left"
                                    label="Left"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="Top"
                                    label="Top"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="Bottom"
                                    label="Bottom"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col md="6">
                                  <FormikControl
                                    control="customSelect"
                                    name="selectVoyageNo"
                                    //selectedValue={colourOptions[0]}
                                    options={damageData.damages}
                                    //placeholder="Other"
                                    label="Other"
                                    onSelectedChanged={
                                      handleVoyageSelectedChanged
                                    }
                                    isMulti={true}
                                  />
                                </Col>
                                <Col>Container No: {state.cntrNo}</Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>

                        <div className="form-actions center">
                          <Button color="warning" className="mr-1">
                            <X size={16} color="#FFF" /> لغو
                          </Button>
                          <Button color="primary">
                            <CheckSquare size={16} color="#FFF" /> ثبت
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default DamagePage;
