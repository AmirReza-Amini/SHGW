import React, { Fragment, useState } from "react";
import { Card, CardBody, Row, Col, Button, Collapse } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import urls from '../../../urls.json';
import config from '../../../config.json';

import CustomNavigation from "../../../components/common/customNavigation";
import FormikControl from "../../../components/common/formik/FormikControl";
import { fetchVoyagesTopTenOpen, voyageSelectedChanged } from "../../../redux/common/voyage/voyageActions";
import { fetchEquipments, equipmentSelectedChanged } from "../../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../../redux/common/operator/operatorActions";

import { getCntrInfoForLoad, saveLoad } from "../../../services/vessel/berth";
import { isPossibleSaveAct } from "../../../services/act";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectVoyageNo: "",
    selectEquipmentType: "",
    containerNo: "",
    operatorCode: "",
    truckNo: "",
    checkboxListSelected: [],
};

const checkboxListOptions = [
    { value: "SE", label: 'Special Equipment' },
    { value: "OG", label: 'Out of Gate' },
];

const validationSchema = Yup.object({
    selectVoyageNo: Yup.string().required("Select Voyage No !"),
    selectEquipmentType: Yup.string().required("Select Equipment No !"),
    containerNo: Yup.string().required("Enter Container No !"),
    operatorCode: Yup.string().required("Enter Operator Code !"),
    truckNo: Yup.string().required("Enter Truck No !"),
});

//#endregion ---------------------------------------------------------------

//#region SUBMIT FORMIK ----------------------------------------------------

const onSubmit = (values, props, staffId) => {
    //console.log("Form Submit Data", values);
    let parameters = {
        cntrNo: values.containerNo,
        voyageId: values.selectVoyageNo.value,
    };
    // return props.history.push('/operationType/vessel/discharge/damage',{actId:12309929,cntrNo:values.containerNo});

    let se = _(values.checkboxListSelected)
        .filter((c) => c === "SE")
        .first();
    let og = _(values.checkboxListSelected)
        .filter((c) => c === "OG")
        .first();

    getCntrInfoForLoad(parameters).then((response) => {
        //console.log("response", response);
        let { data, result } = response.data;
        if (result) {
            //---------------- Duplicate Act Check---------------------------------
            if (data[0].ActID != null) {
                return toast.error("The container info has been saved already");
            }
            else {
                let parametersForLoad = {
                    cntrNo: data[0].CntrNo,
                    voyageId: data[0].VoyageID,
                    berthId: data[0].BerthID,
                    equipmentId: values.selectEquipmentType.value,
                    operatorId: staffId,
                    truckNo: values.truckNo,
                    isShifting: data[0].ShiftingID !== null ? 1 : 0,
                    sE: se ? 1 : 0,
                    oG: og ? 1 : 0,
                };
                //console.log('response', response)
                if (data[0].ShiftingID != null) {
                    let paramData = {
                        nextActType: 16,
                        cntrNo: parametersForLoad.cntrNo,
                    };

                    isPossibleSaveAct(paramData)
                        .then((res1) => {
                            if (res1.data.result) {
                                saveLoad(parametersForLoad)
                                    .then((res2) => {
                                        //console.log("res save load", res2, res2.data.data[0]);
                                        if (res2.data.result) {
                                            toast.success(res2.data.data[0]['message']);
                                            return props.history.push(urls.LoadDamage, { actId: res2.data.data[0]['ActId'], cntrNo: values.containerNo });
                                        } else return toast.error(res2.data.data[0]);
                                    })
                                    .catch((error) => {
                                        //return toast.error(error);
                                    });
                            }
                            else {
                                return toast.error(res1.data.data[0]);
                            }
                        })
                        .catch((error) => {
                            //return toast.error(error);
                        });
                }
                else {
                    saveLoad(parametersForLoad)
                        .then((res) => {
                            //console.log("res save load", res, res.data.data[0]);
                            if (res.data.result) {
                                toast.success(res.data.data[0]['message']);
                                return props.history.push(urls.LoadDamage, { actId: res.data.data[0]['ActId'], cntrNo: values.containerNo });
                            } else return toast.error(res.data.data[0]);
                        })
                        .catch((error) => {
                            //return toast.error(error);
                        });
                }
            }
        }
        else {
            return toast.error("No container has been found");
        }
    });
};
//#endregion ---------------------------------------------------------------

const LoadOperationPage = (props) => {

    //#region SELECTORS AND STATE ------------------------------------------

    const VoyageData = useSelector((state) => state.voyage);
    const EquipmentData = useSelector((state) => state.equipment);
    const OperatorData = useSelector((state) => state.operator);
    const [state, setState] = useState({
        selectVoyageNo: VoyageData.selectedVoyage,
        selectEquipmentType: EquipmentData.selectedEquipment['load'],
        containerNo: "",
        operatorCode: OperatorData.operator.staffCode,
        truckNo: "",
        checkboxListSelected: []
    });
    const [CntrInfo, setCntrInfo] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const dispatch = useDispatch();

    //#endregion -----------------------------------------------------------

    //#region INITAL FUNCTIONS ---------------------------------------------

    useEffect(() => {
        if (VoyageData.voyages === null || VoyageData.voyages.length === 0) {
            dispatch(fetchVoyagesTopTenOpen());
        }
       // console.log('eqqqqqqqq',EquipmentData)
        if (
            EquipmentData.equipments === null || EquipmentData.equipments.length === 0
        ) {
           // console.log('qweqw',EquipmentData.equipments.length)
            dispatch(fetchEquipments);
        }
        //console.log("salam");
    }, []);

    useEffect(() => {
        let errorMessage = "";
        if (VoyageData.error) {
            errorMessage = VoyageData.error;
        }
        if (EquipmentData.error) {
            errorMessage += "\n" + EquipmentData.error;
        }
        if (OperatorData.error) {
            errorMessage += "\n" + OperatorData.error;
        }
        if (errorMessage !== "") {
            toast.error(errorMessage);
        }
    }, [VoyageData.error, VoyageData.error, OperatorData.error]);

    //#endregion -----------------------------------------------------------

    //#region EVENT HANDLRES -----------------------------------------------

    const handleContainerNoChange = (value) => {
        const data = { cntrNo: value, voyageId: VoyageData.selectedVoyage.value };
        // console.log("voyage and cntr", data);
        getCntrInfoForLoad(data)
            .then((response) => {
                setDisableSubmitButton(false);
                //console.log("cntrno change res", response);
                if (!response.data.result) {
                    setDisableSubmitButton(true);
                    return toast.error("No container has been found");
                }

                let guessedOperation = "";
                const result = response.data.data[0];
                if (result.ActID !== null) {
                    //setCntrInfo({});
                    setDisableSubmitButton(true);
                    toast.error("The container info has been saved already");
                }
                if (result.ShiftingID !== null) {
                    if (result.ShiftingTallyManID != null) {
                        guessedOperation = "Visibility";
                    }
                    else {
                        guessedOperation = "Shifting";
                    }
                } else {
                    guessedOperation = "Load";
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
                //console.log("cntrno change error", error);
                //return toast.error(error);
            });
    };

    const handleOperatorCodeChange = (value) => {
        //console.log("operator code", value);
        if (value !== "") dispatch(fetchOperatorInfoBasedOnCode(value));
        //setOperatorCode(value)
    };

    const handleVoyageSelectedChanged = (value) => {
        //console.log("handleVoyageSelectedChanged", value);
        dispatch(voyageSelectedChanged(value));
    };

    const handleEquipmentSelectedChanged = (value) => {
        //console.log("handleEquipmentSelectedChanged", value);
        dispatch(equipmentSelectedChanged(value, 'load'));
    };

    const handleCancelButton = () => {
        return props.history.push(props.location.pathname.replace('/load', ''));
    }

    const handleDangerButton = () => {
        //console.log(CntrInfo)
        if (CntrInfo && CntrInfo.ActID && CntrInfo.ActID != null)
            return props.history.push(urls.LoadDamage, { actId: CntrInfo.ActID, cntrNo: CntrInfo.CntrNo });
    }

    const handleStatisticsButton = () => {
        //console.log('VoyageData.selectedVoyage', VoyageData.selectedVoyage)
        return props.history.push(urls.LoadStatistics, { voyageInfo: VoyageData.selectedVoyage });
    }

    //#endregion -----------------------------------------------------------

    return (
        <Fragment>
            <Row className="row-eq-height justify-content-md-center">
                <Col md="6">
                    <div>
                        <CustomNavigation path={props.match.path} />
                    </div>
                    <Card >
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
                                        // console.log("Formik props values", formik.values);
                                        // console.log(
                                        //     "in formik",
                                        //     VoyageData,
                                        //     OperatorData,
                                        //     EquipmentData
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
                                                                                name="selectVoyageNo"
                                                                                selectedValue={
                                                                                    VoyageData.selectedVoyage
                                                                                }
                                                                                options={VoyageData.voyages}
                                                                                placeholder="Voyage No"
                                                                                onSelectedChanged={
                                                                                    handleVoyageSelectedChanged
                                                                                }
                                                                                className="ltr"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormikControl
                                                                                control="customSelect"
                                                                                name="selectEquipmentType"
                                                                                selectedValue={
                                                                                    EquipmentData.selectedEquipment['load']
                                                                                }
                                                                                options={EquipmentData.equipments
                                                                                    .filter(c => c.type == 5 || c.type == 11)
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
                                                            <Col md="12">
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
                                                        </Row>
                                                        <Row>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="input"
                                                                    type="text"
                                                                    name="truckNo"
                                                                    className="ltr"
                                                                    placeholder="Truck No"
                                                                />
                                                            </Col>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="customCheckboxGroup"
                                                                    name="checkboxListSelected"
                                                                    options={checkboxListOptions}
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
                                                            }}>
                                                            Complementary Information
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Container Size/Type:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.CntrSize} / {CntrInfo.CntrType}{" "}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Full Empty Status:
                                                             </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.FullEmptyStatus}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Port Of Discharge:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.PortOfDischarge}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">Terminal:</span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.TerminalName}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Load Planning Location:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.LoadPlanningLocation}
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
                                                                {CntrInfo.IMDGCode}
                                                            </span>
                                                        </p>

                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Load Planning Weight:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.LoadPlanningWeight}
                                                            </span>
                                                        </p>

                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}
                                                        >
                                                            <span className="labelDescription">
                                                                Guessed Operation:
                                                            </span>{" "}
                                                            <span className="guessedOperation">
                                                                {CntrInfo.GuessedOperation}
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
                                                        <Button color="success" type="button" className="mr-1" onClick={handleStatisticsButton} disabled={!formik.values.selectVoyageNo || formik.values.selectVoyageNo === null} >
                                                            <CheckSquare size={16} color="#FFF" /> Statistics
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

export default LoadOperationPage;
