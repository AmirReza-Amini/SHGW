import React, { Fragment, useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { X, CheckSquare, Bold } from "react-feather";
import CustomNavigation from "../../components/common/customNavigation";
import { Formik, Form } from "formik";
import FormikControl from "../../components/common/formik/FormikControl";
import * as Yup from "yup";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchVoyagesTopTenOpen,
  voyageSelectedChanged,
} from "../../redux/common/voyage/voyageActions";
import { toast } from "react-toastify";
import {
  fetchEquipmentsForUnload,
  equipmentSelectedChanged,
} from "../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../redux/common/operator/operatorActions";
import { getCntrInfoForUnload } from "../../services/vessel/berth";

const initialValues = {
  selectVoyageNo: "",
  selectEquipmentType: "",
  containerNo: "",
  operatorCode: "",
  truckNo: "",
  specialEquipment:[]
};

toast.configure();

const validationSchema = Yup.object({
  selectVoyageNo: Yup.string().required("!شماره سفر را وارد کنید"),
  selectEquipmentType: Yup.string().required("!شماره دستگاه را وارد کنید"),
  containerNo: Yup.string().required("!شماره کانتینر را وارد کنید"),
  operatorCode: Yup.string().required("!کد اپراتور را وارد کنید"),
  truckNo: Yup.string().required("!شماره کشنده را وارد کنید"),
});

const toggleListOptions = [{ key: 'specialEquipment', value: 'SE' },{ key: 'outOfGage', value: 'OG' }];
const equipmentTypeOptions = [];
const onSubmit = (values) => console.log("Form Data", values);

const UnloadOperationPage = (props) => {
  const VoyageData = useSelector((state) => state.voyage);
  const EquipmentData = useSelector((state) => state.equipment);
  const OperatorData = useSelector((state) => state.operator);
  const [CntrInfo, setCntrInfo] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    if (VoyageData.voyages === null || VoyageData.voyages.length === 0) {
      dispatch(fetchVoyagesTopTenOpen());
    }
    if (
      EquipmentData.equipments === null ||
      EquipmentData.equipments.length === 0
    ) {
      dispatch(fetchEquipmentsForUnload());
    }
  }, []);

  useEffect(() => {
    let errorMessage = "";
    if (VoyageData.error) {
      errorMessage = VoyageData.error;
    }
    if (VoyageData.error) {
      errorMessage += "\n" + EquipmentData.error;
    }
    if (OperatorData.error) {
      errorMessage += "\n" + OperatorData.error;
    }
    if (errorMessage != "") {
      toast.error(errorMessage);
    }
  }, [VoyageData.error, VoyageData.error, OperatorData.error]);

  const handleContainerNoChange = (value) => {
    const data = { cntrNo: value, voyageId: VoyageData.selectedVoyage.value };
    console.log("voyage and cntr", data);
    getCntrInfoForUnload(data)
      .then((response) => {
        console.log("cntrno change res", response);
        let guessedOperation = "";
        const result = response.data.data[0];
        if (result.ManifestCntrID !== null) {
          guessedOperation = "تخلیه ی کانتینر (Unload)";
        } else if (result.ShiftingID !== null) {
          guessedOperation = "شیفتینگ (Shifting)";
        } else if (
          result.PortOfDischarge !== null &&
          result.PortOfDischarge === "IRBND"
        ) {
          guessedOperation = "اضافه تخلیه (Additional)";
        } else if (
          result.PortOfDischarge !== null &&
          result.PortOfDischarge !== "IRBND"
        ) {
          guessedOperation = "دید اپراتور (Visibility)";
        }
        setCntrInfo(
          guessedOperation !== ""
            ? {
                ...response.data.data[0],
                GuessedOperation: guessedOperation,
              }
            : response.data.data[0]
        );
      })
      .catch((error) => {
        console.log("cntrno change error", error);
      });
  };

  const handleOperatorCodeChange = (value) => {
    console.log("operator code", value);
    if (value !== "") dispatch(fetchOperatorInfoBasedOnCode(value));
    //setOperatorCode(value)
  };

  const handleVoyageSelectedChanged = (value) => {
    console.log("handleVoyageSelectedChanged", value);
    dispatch(voyageSelectedChanged(value));
  };

  const handleEquipmentSelectedChanged = (value) => {
    console.log("handleEquipmentSelectedChanged", value);
    dispatch(equipmentSelectedChanged(value));
  };

  //console.log("formvalues", formValues);
  console.log("voyageData", VoyageData);
  return (
    <Fragment>
      <Row className="row-eq-height justify-content-md-center">
        <Col md="6">
          <div>
            <CustomNavigation path={props.match.path} />
          </div>
          <Card>
            <CardBody>
              {/* <CardTitle>Event Registration</CardTitle> */}
              <p className="mb-2" style={{ textAlign: "center" }}>
                ثبت عملیات تخلیه
              </p>
              <div className="px-3">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  validateOnBlur={true}
                  enableReinitialize
                >
                  {(formik) => {
                    console.log("Formik props values", formik.values);
                    return (
                      <Form>
                        <div className="form-body">
                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="customSelect"
                                name="selectVoyageNo"
                                selectedValue={VoyageData.selectedVoyage}
                                options={VoyageData.voyages}
                                placeholder="شماره سفر"
                                onSelectedChanged={handleVoyageSelectedChanged}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="customSelect"
                                name="selectEquipmentType"
                                selectedValue={EquipmentData.selectedEquipment}
                                options={EquipmentData.equipments}
                                placeholder="شماره دستگاه"
                                onSelectedChanged={
                                  handleEquipmentSelectedChanged
                                }
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <FormikControl
                                control="inputMaskDebounce"
                                name="operatorCode"
                                mask=""
                                debounceTime={2000}
                                placeholder="کد اپراتور"
                                className="rtl"
                                onChange={() =>
                                  handleOperatorCodeChange(
                                    formik.values.operatorCode
                                  )
                                }
                                defaultValue={OperatorData.operator.staffCode}
                              />
                            </Col>
                            <Col md="6">
                              <FormikControl
                                control="input"
                                type="text"
                                name="operatorCodeInfo"
                                className="rtl"
                                disabled={true}
                                value={OperatorData.operator.name}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormikControl
                                control="inputMaskDebounce"
                                name="containerNo"
                                mask="aaaa 9999999"
                                debounceTime={0}
                                placeholder="شماره کانتینر"
                                className="ltr"
                                onChange={() =>
                                  handleContainerNoChange(
                                    formik.values.containerNo
                                  )
                                }
                                toUppercase={true}
                              />
                              {/* <div>{formik.values.containerNo}</div> */}
                            </Col>
                          </Row>

                          <Row>
                            <Col md="6">
                              <FormikControl
                                control="input"
                                type="text"
                                name="truckNo"
                                className="rtl"
                                placeholder="شماره کشنده"
                              />
                            </Col>
                            <Col md="6">
                              <FormikControl
                                control="checkbox"
                                name="specialEquipment"
                                options={toggleListOptions}
                              />
                              <FormikControl
                                control="toggle"
                                name="SpecialEquipment"
                                className="rtl"
                                label="SE"
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="form-actions center">
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            اطلاعات تکمیلی
                          </p>
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              نوع و سایز کانتینر:
                            </span>{" "}
                            <span className="labelValue">
                              {CntrInfo.CntrSize} / {CntrInfo.CntrType}{" "}
                            </span>
                          </p>
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              وضعیت پر یا خالی:
                            </span>{" "}
                            <span className="labelValue">
                              {CntrInfo.FullEmptyStatus}
                            </span>
                          </p>
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              بندر تخلیه:
                            </span>{" "}
                            <span className="labelValue">
                              {CntrInfo.PortOfDischarge}
                            </span>
                          </p>
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">ترمینال:</span>{" "}
                            <span className="labelValue">
                              {CntrInfo.TerminalName}
                            </span>
                          </p>
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">محل تخلیه:</span>{" "}
                            <span className="labelValue">
                              {CntrInfo.MarshalingLocation}
                            </span>
                          </p>
                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              نوع بارنامه:
                            </span>{" "}
                            <span className="labelValue">
                              {CntrInfo.BLType}
                            </span>
                          </p>

                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              وضعیت خطرناک بودن:
                            </span>{" "}
                            <span className="labelValue">
                              {CntrInfo.IMDGCode}
                            </span>
                          </p>

                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              رده ی وزنی:
                            </span>{" "}
                            <span className="labelValue">
                              {CntrInfo.PlanWeight}
                            </span>
                          </p>

                          <p
                            className="mb-0 rtl"
                            style={{ textAlign: "right" }}
                          >
                            <span className="labelDescription">
                              نوع عملیات:
                            </span>{" "}
                            <span className="guessedOperation">
                              {CntrInfo.GuessedOperation}
                            </span>
                          </p>
                        </div>
                        <div className="form-actions center">
                          <Button
                            color="warning"
                            className="mr-1"
                            onClick={() =>
                              this.props.history.push("/operationTypePage")
                            }
                          >
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

export default UnloadOperationPage;
