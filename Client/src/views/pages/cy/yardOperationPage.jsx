import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button, Collapse } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import urls from '../../../urls.json';
import config from '../../../config.json';

import CustomNavigation from "../../../components/common/customNavigation";
import FormikControl from "../../../components/common/formik/FormikControl";
import { fetchEquipments, equipmentSelectedChanged } from "../../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../../redux/common/operator/operatorActions";
import { getCntrInfoForYardOperation, saveYardOperation } from "../../../services/cy/yardOperation";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectEquipmentType: "",
    containerNo: "",
    operatorCode: "",
    yardCode: ""
};

const validationSchema = Yup.object({
    selectEquipmentType: Yup.string().required("Select Equipment No !"),
    containerNo: Yup.string().required("Enter Container No !"),
    operatorCode: Yup.string().required("Enter Operator Code !"),
    yardCode: Yup.string().required("Enter Yard Code !")
});

//#endregion ---------------------------------------------------------------

//#region SUBMIT FORMIK ----------------------------------------------------

const onSubmit = (values, props, staffId) => {
    //console.log("Form Submit Data", values);
    let parameters = {
        cntrNo: values.containerNo
    };

    getCntrInfoForYardOperation(parameters).then((response) => {
        //console.log("response", response);
        let { data, result } = response.data;
        if (result) {
            let parametersForYardOperation = {
                operatorId: staffId,
                equipmentId: values.selectEquipmentType.value,
                cntrNo: data[0].CntrNo,
                voyageId: data[0].VoyageID,
                cntrLocation: _(values.yardCode).toUpper(),
                actId: data[0].ActID,
                truckNo: data[0].TruckNo
            };

            saveYardOperation(parametersForYardOperation)
                .then((res) => {
                    console.log("saveYardOperation", res);
                    if (res.data.result) {
                        toast.success(res.data.data[0]['message']);
                        return props.history.push(urls.YardOperationDamage, { actId: res.data.data[0]['ActID'], cntrNo: values.containerNo });
                    } else return toast.error(res.data.data[0]);
                })
                .catch((error) => {
                    //return toast.error(error);
                });
        } else {
            return toast.error("No container has been found");
        }
    });
};

//#endregion ---------------------------------------------------------------

const YardOperationPage = (props) => {

    //#region SELECTORS AND STATE --------------------------------------------

    const EquipmentData = useSelector((state) => state.equipment);
    const OperatorData = useSelector((state) => state.operator);
    const [state, setState] = useState({
        selectEquipmentType: EquipmentData.selectedEquipment['yardOperation'],
        operatorCode: OperatorData.operator.staffCode,
        containerNo: "",
        yardCode: "",
        truckNo: ""
    });
    //console.log('EquipmentData', EquipmentData);
    const [CntrInfo, setCntrInfo] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
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
        if (OperatorData.error) {
            errorMessage += "\n" + OperatorData.error;
        }
        if (errorMessage !== "") {
            toast.error(errorMessage);
        }
    }, [EquipmentData.error, OperatorData.error]);

    //#endregion -------------------------------------------------------------

    //#region EVENT HANDLRES -------------------------------------------------

    const handleContainerNoChange = (value) => {
        const data = { cntrNo: value };

        // console.log("voyage and cntr", data);
        getCntrInfoForYardOperation(data)
            .then((response) => {
                setDisableSubmitButton(false);
                //console.log("cntrno change res", response);
                if (!response.data.result) {
                    setDisableSubmitButton(true);
                    return toast.error("No container has been found");
                }
                const result = response.data.data[0];
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
        if (value !== "") dispatch(fetchOperatorInfoBasedOnCode(value));
        //setOperatorCode(value)
    };

    const handleEquipmentSelectedChanged = (value) => {
        //console.log("handleEquipmentSelectedChanged", value);
        dispatch(equipmentSelectedChanged(value, 'yardOperation'));
    };

    const handleCancelButton = () => {
        return props.history.push(props.location.pathname.replace("/yardOperation", ''))
    }

    const handleDangerButton = () => {
        //console.log(CntrInfo)
        if (CntrInfo && CntrInfo.ActID && CntrInfo.ActID != null)
            return props.history.push(urls.DischargeDamage, { actId: CntrInfo.ActID, cntrNo: CntrInfo.CntrNo });
    }

    //#endregion -------------------------------------------------------------

    return (
        <Fragment>
            <Row className="row-eq-height justify-content-md-center">
                <Col md="6">
                    <div>
                        <CustomNavigation path={props.match.path} />
                    </div>
                    <Card className="customBackgroundColor">
                        <CardBody>
                            {/* <CardTitle>Event Registration</CardTitle> */}
                            {/* <p className="mb-2" style={{ textAlign: "center" }}>
                ثبت عملیات تخلیه
              </p> */}
                            <div className="px-3">
                                <Formik
                                    initialValues={state || initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        onSubmit(values, props, OperatorData.operator.staffId);
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
                                                                <Button
                                                                    color="primary"
                                                                    onClick={toggle}
                                                                    style={{
                                                                        marginBottom: "1rem",
                                                                        direction: "ltr",
                                                                    }}
                                                                >
                                                                    Basic Infromation
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md="12">
                                                                <Collapse isOpen={isOpen}>
                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormikControl
                                                                                control="customSelect"
                                                                                name="selectEquipmentType"
                                                                                selectedValue={
                                                                                    EquipmentData.selectedEquipment['yardOperation']
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
                                                                                    OperatorData.operator.staffCode
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
                                                                                value={OperatorData.operator.name}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Collapse>
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
                                                                    defaultValue={
                                                                        CntrInfo.CntrLocation
                                                                    }
                                                                    // onChange={() =>
                                                                    //     console.log('formik.values.yardCode', formik.values.yardCode)
                                                                    // }
                                                                    toUppercase={true}
                                                                />
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
                                                                Truck No:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.TruckNo}
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
                                                                Planned Location:
                                                             </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.PlannedLocation}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Terminal:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.TerminalName}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">Port Of Discharge:</span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.PortOfDischarge}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                IMDG Status:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.IMDGCodeName}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Full Yard:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.CntrLocation}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="form-actions center">
                                                        <Button color="primary" type="submit" className="mr-1" disabled={disableSubmitButton}>
                                                            <CheckSquare size={16} color="#FFF" /> Save
                            </Button>
                                                        <Button color="danger" type="button" className="mr-1" onClick={handleDangerButton} disabled={!(CntrInfo && CntrInfo.ActID && CntrInfo.ActID != null)}>
                                                            <CheckSquare size={16} color="#FFF" /> Damage
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

export default YardOperationPage;
