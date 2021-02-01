import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _, { toArray } from "lodash";
import urls from '../../../urls.json';
import config from '../../../config.json';

import CustomNavigation from "../../../components/common/customNavigation";
import FormikControl from "../../../components/common/formik/FormikControl";
import { fetchEquipments, equipmentSelectedChanged } from "../../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../../redux/common/operator/operatorActions";
import { getCntrInfoForReceive, saveReceive } from "../../../services/cy/receive";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectEquipmentType: "",
    containerNo: "",
    operatorCode: "",
    yardCode: ""
};



//#endregion ---------------------------------------------------------------


const ReceivePage = (props) => {

    //#region Validation Schema ---------------------------------------------

    const validationSchema = Yup.object({
        selectEquipmentType: Yup.string().required("Select Equipment No !"),
        containerNo: Yup.string().required("Enter Container No !"),
        operatorCode: Yup.string().required("Enter Operator Code !")
            .test('validoperator', 'Operator not found', (value) => {
                if (OperatorData.operator.staffCode === value) {
                    return true;
                }
                else {
                    return false;
                }
            }),
        yardCode: Yup.string().required("Enter Yard Code !")
    });

    //#endregion ------------------------------------------------------------

    //#region SELECTORS AND STATE --------------------------------------------

    const EquipmentData = useSelector((state) => state.equipment);
    const OperatorData = useSelector((state) => state.operator);
    const [state, setState] = useState({
        selectEquipmentType: EquipmentData.selectedEquipment['receive'],
        operatorCode: OperatorData.operator.staffCode,
        containerNo: "",
        yardCode: "",
        truckNo: ""
    });
    const [CntrInfo, setCntrInfo] = useState({});
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [validYardCode, setValidYardCode] = useState({ message: '', result: false });
    const dispatch = useDispatch();

    //#endregion -------------------------------------------------------------

    //#region INITIAL FUNCTIONS ----------------------------------------------

    useEffect(() => {
        //console.log(EquipmentData)
        if (
            EquipmentData.equipments === null ||
            EquipmentData.equipments.length === 0
        ) {
            dispatch(fetchEquipments());
        }
    }, []);

    useEffect(() => {
        let errorMessage = "";
        if (EquipmentData.error) {
            errorMessage += "\n" + EquipmentData.error;
        }
        if (errorMessage !== "") {
            toast.error(errorMessage);
        }
    }, [EquipmentData.error]);

    //#endregion -------------------------------------------------------------

    //#region EVENT HANDLRES -------------------------------------------------

    const handleContainerNoChange = (value) => {
        const data = { cntrNo: value };
        setCntrInfo({})
        getCntrInfoForReceive(data)
            .then((response) => {
                setDisableSubmitButton(false);
                console.log("cntrno change res", response);
                if (!response.data.result) {
                    setDisableSubmitButton(true);
                    return toast.error("No container has been found");
                }
                const result = response.data.data[0];
                if (result.Operation === "Receive") {
                    setDisableSubmitButton(true);
                    toast.error('Receive Operation has been saved already');
                }
                else if (result.Operation !== "Send") {
                    setDisableSubmitButton(true);
                    return toast.error("No container has been found");
                }
                else {
                    result.CntrLocation = "";
                }
                //console.log('result cntr', result)
                setCntrInfo(result);
            })
            .catch((error) => {
                //console.log("cntrno change error", error);
                //toast.error(error);
            });
    };

    const handleOperatorCodeChange = (value) => {
        //console.log("operator code", value);
        if (value !== "")
            dispatch(fetchOperatorInfoBasedOnCode(value));
        //setOperatorCode(value)
    };

    const handleEquipmentSelectedChanged = (value) => {
        //console.log("handleEquipmentSelectedChanged", value);
        dispatch(equipmentSelectedChanged(value, 'receive'));
    };

    const handleCancelButton = () => {
        return props.history.push(props.location.pathname.replace("/receive", ''))
    }

    const handleYardCodeChange = (value) => {
        setDisableSubmitButton(false);
        //console.log(CntrInfo)
        if (!CntrInfo || !CntrInfo.CntrNo) {
            setValidYardCode({ message: 'CntrNo not found', result: false });
            setDisableSubmitButton(true);
            return;
        }
        if (!CntrInfo || !CntrInfo.VoyageID || CntrInfo.VoyageID === 0) {
            setValidYardCode({ message: 'Voyage not found', result: false });
            setDisableSubmitButton(true);
            return;
        }
        //console.log('yard code changed', value);
        const yardCodeTemp = `${value.split(" ").join("")}`;
        const params = { cntrNo: CntrInfo.CntrNo };
        //console.log('yard code changed', value, params);
        getCntrInfoForReceive(params).then(response => {
            //console.log('duplicate yard', response);
            if (response.data.result) {
                //return toast.error(response.data.data[0]);
                if (response.data.data[0].CntrLocation === yardCodeTemp) {
                    setValidYardCode({ message: "Duplicate Yard", result: false });
                    setDisableSubmitButton(true);
                }
                else {
                    setValidYardCode({ message: "Location is valid", result: true });
                }
            }
            else {
                //return toast.success(response.data.data[0]);
                setValidYardCode({ message: "CntrNo not found", result: false });
            }
        })
    }

    //#endregion -------------------------------------------------------------

    //#region SUBMIT FORMIK ----------------------------------------------------

    const onSubmit = (values) => {
        //console.log("Form Submit Data", values,OperatorData.operator.staffId);
        let parameters = {
            cntrNo: values.containerNo
        };

        getCntrInfoForReceive(parameters).then((response) => {
            console.log("response", response);
            let { data, result } = response.data;
            if (result) {

                if (data[0].Operation === "Receive") {
                    return toast.error("Receive opearation has been saved already");
                }
                else if (data[0].Operation !== "Send") {
                    return toast.error("No cotainer has been found");
                }

                let parametersForSave = {
                    voyageId: data[0].VoyageID,
                    cntrNo: data[0].CntrNo,
                    cntrLocation: _(values.yardCode).toUpper(),
                    actId: data[0].ActID,
                    terminalId: config.terminalId,
                    operatorId: OperatorData.operator.staffId,
                    equipmentId: values.selectEquipmentType.value,
                    truckNo:data[0].TruckNo
                }

                saveReceive(parametersForSave)
                .then((response1) => {
                    console.log("res save receive", response1, response1.data.data[0]);
                    if (response1.data.result) {
                        return toast.success(response1.data.data[0]['message']);
                    } else return toast.error(response1.data.data[0]);
                })
                .catch(error => {
                    // error handler
                })

            } else {
                return toast.error("No container has been found");
            }
        });
    };

    //#endregion ---------------------------------------------------------------

    return (
        <Fragment>
            <Row className="row-eq-height justify-content-md-center">
                <Col md="6">
                    <div>
                        <CustomNavigation path={props.match.path} />
                    </div>
                    <Card className="customBackgroundColor">
                        <CardBody>
                            <div className="px-3">
                                <Formik
                                    initialValues={state || initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        onSubmit(values);
                                    }}
                                    validateOnBlur={true}
                                    enableReinitialize
                                >
                                    {(formik) => {
                                        //console.log("Formik props values", formik);
                                        // console.log(
                                        //   "in formik",
                                        //   VoyageData,
                                        //   OperatorData,
                                        //   EquipmentData
                                        // );
                                        return (
                                            <React.Fragment>
                                                <Form>
                                                    <div className="form-body">
                                                        <Row>
                                                            <Col md="12">
                                                                <FormikControl
                                                                    control="customSelect"
                                                                    name="selectEquipmentType"
                                                                    selectedValue={
                                                                        EquipmentData.selectedEquipment['receive']
                                                                    }
                                                                    options={EquipmentData.equipments
                                                                        .filter(c => c.type == 6 || c.type == 3 || c.type == 7 || c.type == 9)
                                                                        .map(item => {
                                                                            return {
                                                                                value: item.value,
                                                                                label: item.label
                                                                            }
                                                                        })}
                                                                    placeholder="Equipment No"
                                                                    onSelectedChanged={
                                                                        handleEquipmentSelectedChanged
                                                                    }
                                                                    className="ltr"
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
                                                                    placeholder="Operator Code"
                                                                    className="ltr"
                                                                    onChange={() =>
                                                                        handleOperatorCodeChange(
                                                                            formik.values.operatorCode
                                                                        )
                                                                    }
                                                                    defaultValue={
                                                                        OperatorData.operator.staffCode ?
                                                                            OperatorData.operator.staffCode : ""
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="input"
                                                                    type="text"
                                                                    name="operatorCodeInfo"
                                                                    className="ltr"
                                                                    disabled={true}
                                                                    value={OperatorData.operator.name ? OperatorData.operator.name : ""}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="inputMaskDebounce"
                                                                    name="containerNo"
                                                                    mask="aaaa 9999999"
                                                                    debounceTime={0}
                                                                    placeholder="Container No"
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
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="inputMaskDebounce"
                                                                    name="yardCode"
                                                                    mask={config.patternYardLocation}
                                                                    debounceTime={0}
                                                                    placeholder="Area-Row-Bay-Tier"
                                                                    className="ltr"
                                                                    onChange={() =>
                                                                        handleYardCodeChange(
                                                                            formik.values.yardCode
                                                                        )
                                                                    }
                                                                    //defaultValue={CntrInfo.CntrLocation}
                                                                    toUppercase={true}
                                                                />

                                                                {validYardCode && validYardCode.result && <div className="success">{validYardCode.message}</div>}
                                                                {validYardCode && !validYardCode.result && <div className="error">{validYardCode.message}</div>}

                                                            </Col>
                                                        </Row>

                                                    </div>
                                                    <div className="form-actions center">
                                                        <p
                                                            className="mb-1 ltr"
                                                            style={{
                                                                textAlign: "center",
                                                                fontWeight: "bold",
                                                                fontSize: 20
                                                            }}
                                                        >
                                                            Complementary Information
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Pre Location:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.CntrLocation}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Container Size/Type:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.CntrSize} / {CntrInfo.ContainerTypeName}{" "}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Full / Empty Status:
                                                             </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.FullEmptyStatusText}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Voyage No:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.VoyageNo}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="form-actions center">
                                                        <Button color="primary" type="submit" className="mr-1" disabled={disableSubmitButton}>
                                                            <CheckSquare size={16} color="#FFF" /> Save
                                                        </Button>
                                                        <Button color="warning" onClick={handleCancelButton} type="button">
                                                            <X size={16} color="#FFF" /> Cancel
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
        </Fragment>
    );
};

export default ReceivePage;
