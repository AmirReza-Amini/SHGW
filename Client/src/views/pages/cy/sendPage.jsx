import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import config from '../../../config.json';

import CustomNavigation from "../../../components/common/customNavigation";
import FormikControl from "../../../components/common/formik/FormikControl";
import { fetchEquipments, equipmentSelectedChanged } from "../../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../../redux/common/operator/operatorActions";
import { getCntrInfoForMovement } from "../../../services/cy/movement";
import { saveSend, isAlreadySentCntrNoByOperatorInVoyage } from "../../../services/cy/send";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectEquipmentType: "",
    containerNo: "",
    operatorCode: "",
    truckNo: ""
};

const validationSchema = Yup.object({
    selectEquipmentType: Yup.string().required("Select Equipment No !"),
    containerNo: Yup.string().required("Enter Container No !"),
    operatorCode: Yup.string().required("Enter Operator Code !"),
    truckNo: Yup.string().required("Enter Truck No !")
});

//#endregion ---------------------------------------------------------------


const SendPage = (props) => {

    //#region SUBMIT FORMIK ----------------------------------------------------

    const onSubmit = (values) => {
        //console.log("Form Submit Data", values, OperatorData.operator.staffId);
        let parameters = {
            cntrNo: values.containerNo
        };

        if (!OperatorData.operator || OperatorData.operator.staffId === undefined) {
            return toast.error("Enter Operator Code")
        }

        getCntrInfoForMovement(parameters).then((response) => {
            //console.log("response", response);
            let { data, result } = response.data;
            if (result) {
                isAlreadySentCntrNoByOperatorInVoyage({
                    ...parameters,
                    voyageId: data[0].VoyageID,
                    operatorId: OperatorData.operator.staffId,
                    equipmentId: values.selectEquipmentType.value
                }).then(response2 => {
                    if (!response2.data.result) {

                        let parametersForSave = {
                            voyageId: data[0].VoyageID,
                            cntrNo: data[0].CntrNo,
                            cntrLocation: data[0].CntrLocation,
                            fullEmptyStatus: data[0].FullEmptyStatus,
                            cntrId: data[0].CntrID,
                            agentId: data[0].AgentID,
                            ownerId: data[0].OwnerID,
                            terminalId: config.terminalId,
                            operatorId: OperatorData.operator.staffId,
                            equipmentId: values.selectEquipmentType.value,
                            truckNo: values.truckNo
                        }
                        //console.log('parametersForSave', parametersForSave)

                        saveSend(parametersForSave)
                            .then((response3) => {
                                //console.log("res save Send", response3, response3.data.data[0]);
                                if (response3.data.result) {
                                    return toast.success(response3.data.data[0]['message']);
                                } else return toast.error(response3.data.data[0]);
                            })
                            .catch(error => {
                                // error handler
                            })
                    }
                    else {
                        return toast.error(response2.data.data[0]);
                    }
                }).catch(error => {
                    // error handler
                })
            } else {
                return toast.error("No container has been found");
            }
        });
    };

    //#endregion ---------------------------------------------------------------

    //#region SELECTORS AND STATE --------------------------------------------

    const EquipmentData = useSelector((state) => state.equipment);
    const OperatorData = useSelector((state) => state.operator);
    const [state, setState] = useState({
        selectEquipmentType: EquipmentData.selectedEquipment['send'],
        operatorCode: OperatorData.operator.staffCode,
        containerNo: "",
        yardCode: "",
        truckNo: ""
    });
    //console.log('OperatorData', OperatorData);
    const [CntrInfo, setCntrInfo] = useState({});
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const dispatch = useDispatch();

    //#endregion -------------------------------------------------------------

    //#region INITIAL FUNCTIONS ----------------------------------------------

    useEffect(() => {
        //console.log(EquipmentData)
        if (EquipmentData.equipments === null || EquipmentData.equipments.length === 0) {
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
        setCntrInfo({});
        getCntrInfoForMovement(data)
            .then((response) => {
                setDisableSubmitButton(false);
                //console.log("cntrno change res", response);
                if (!response.data.result) {
                    setDisableSubmitButton(true);
                    return toast.error("No container has been found");
                }
                const result = response.data.data[0];
                if (!result.IsActAllowed) {
                    setDisableSubmitButton(true);
                    return toast.error('Sequence Act is not correct');
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
        dispatch(equipmentSelectedChanged(value, 'send'));
    };

    const handleCancelButton = () => {
        return props.history.push(props.location.pathname.replace("/send", ''))
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
                                                                        EquipmentData.selectedEquipment['send']
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
                                                                    value={OperatorData.operator.name ?
                                                                        OperatorData.operator.name : ""}
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
                                                            </Col>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="input"
                                                                    type="text"
                                                                    name="truckNo"
                                                                    className="ltr"
                                                                    placeholder="Truck No"
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
                                                                Voyage No:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.VoyageNo}
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
                                                                Terminal:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.TerminalName}
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

export default SendPage;
