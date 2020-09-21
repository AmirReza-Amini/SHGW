import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button, Collapse } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import CustomNavigation from "../../components/common/customNavigation";
import FormikControl from "../../components/common/formik/FormikControl";
import { fetchVoyagesTopTenOpen, voyageSelectedChanged } from "../../redux/common/voyage/voyageActions";
import { fetchEquipmentsForLoadUnload, equipmentSelectedChanged } from "../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../redux/common/operator/operatorActions";

import { getCntrInfoForStowage, getStowageInfoForCntrByVoyage, isOccoupiedBayAddressInVoyage, saveStowageAndShiftedup, saveVesselHatchInfo } from "../../services/vessel/deck";
import { fetchHatchOperationTypes, fetchHatchDirections, hatchOperationTypeSelectedChanged, hatchDirectionSelectedChanged } from "../../redux/common/hatch/hatchActions";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectVoyageNo: "",
    selectEquipmentType: "",
    operatorCode: "",
    bayAddress: "",
    selectHatchOperationType: '',
    selectHatchDirection: ''
};

const validationSchema = Yup.object({
    selectVoyageNo: Yup.string().required("Select Voyage No !"),
    selectEquipmentType: Yup.string().required("Select Equipment No !"),
    operatorCode: Yup.string().required("Enter Operator Code !"),
    bayAddress: Yup.string().required("Enter Bay Address !"),
    selectHatchOperationType: Yup.string().required("Select Hatch Operation Type !"),
    selectHatchDirection: Yup.string().required("Select Hatch Direction !")
});

//#endregion ---------------------------------------------------------------



const HatchPage = (props) => {

    //#region SUBMIT FORMIK ----------------------------------------------------

    const onSubmit = (values) => {
        console.log("Form Submit Data", values, OperatorData);
        let parameters = {
            voyageId: values.selectVoyageNo.value,
            operatorId: OperatorData.operator.staffId,
            equipmentId: values.selectEquipmentType.value,
            clerkId: 220,
            hatchNo: values.bayAddress,
            hatchOperationType: values.selectHatchOperationType.value,
            isLoaded: values.selectHatchDirection.value === 1 ? false : true
        };
        console.log(parameters)
        saveVesselHatchInfo(parameters).then(response => {
            if (response.data.result) {
                return toast.success(response.data.data[0]);
            }
            else {
                return toast.error(response.data.data[0]);
            }
        }).catch(error => { })
    };
    //#endregion ---------------------------------------------------------------

    //#region SELECTORS AND STATE ------------------------------------------

    const VoyageData = useSelector((state) => state.voyage);
    const EquipmentData = useSelector((state) => state.equipment);
    const OperatorData = useSelector((state) => state.operator);
    const HatchData = useSelector((state) => state.hatch);
    const [state, setState] = useState({
        selectVoyageNo: VoyageData.selectedVoyage,
        selectEquipmentType: EquipmentData.selectedEquipment,
        bayAddress: "",
        operatorCode: OperatorData.operator.staffCode,
        selectHatchOperationType: HatchData.selectedHatchOperationType,
        selectHatchDirection: HatchData.selectedHatchDirection
    });
    const [CntrInfo, setCntrInfo] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [validBayAddress, setValidBayAddress] = useState({ message: '', result: false });
    const toggle = () => setIsOpen(!isOpen);
    const dispatch = useDispatch();

    //#endregion -----------------------------------------------------------

    //#region INITIAL FUNCTIONS --------------------------------------------

    useEffect(() => {
        if (VoyageData.voyages === null ||
            VoyageData.voyages.length === 0) {
            dispatch(fetchVoyagesTopTenOpen());
        }
        if (
            EquipmentData.equipments === null ||
            EquipmentData.equipments.length === 0
        ) {
            dispatch(fetchEquipmentsForLoadUnload());
        }
        if (HatchData.hatchOperationTypes === null ||
            HatchData.hatchOperationTypes.length === 0) {
            dispatch(fetchHatchOperationTypes())
        }
        if (HatchData.hatchDirections === null ||
            HatchData.hatchDirections.length === 0) {
            dispatch(fetchHatchDirections())
        }
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
    }, [VoyageData.error, VoyageData.error, OperatorData.error, HatchData.error]);

    //#endregion -----------------------------------------------------------

    //#region EVENT HANDLRES -----------------------------------------------

    const handleContainerNoChange = (value) => {
        const data = { cntrNo: value, voyageId: VoyageData.selectedVoyage.value };
        //console.log("voyage and cntr", data);
        getCntrInfoForStowage(data)
            .then((response) => {
                setDisableSubmitButton(false);
                //console.log("cntrno change res", response);
                if (!response.data.result) {
                    setDisableSubmitButton(true);
                    return toast.error("No container has been found");
                }

                let guessedOperation = "";
                const result = response.data.data[0];
                if (result.OperationType === 'Loading') {
                    guessedOperation = 'Loading'
                }
                else if (result.OperationType === 'Shifting') {
                    guessedOperation = 'Shifting';
                }
                setCntrInfo(
                    guessedOperation !== ""
                        ? {
                            ...response.data.data[0],
                            GuessedOperation: guessedOperation,
                        }
                        : response.data.data[0]
                );
                getStowageInfoForCntrByVoyage(data).then(response2 => {
                    if (!response2.data.result) {
                        return toast.error("There is no such Bay Address");
                    }

                    if (response2.data.result.length > 1) {
                        return toast.error("Contradictory info has been found");
                    }

                    if (response2.data.data[0].Operation === 'Stowage' || response2.data.data[0].Operation === 'Shifted Up') {
                        let temp = { ...CntrInfo };
                        //console.log('temp', temp);
                        //temp.BayAddress = response2.data.data[0].LoadingBayAddress;
                        //setCntrInfo(temp);
                        return toast.warn("The container info has been saved already");
                    }

                })

            })
            .catch((error) => {
                //console.log("cntrno change error", error);
                toast.error(error);
            });
    };

    const handleOperatorCodeChange = (value) => {
        if (value !== "") dispatch(fetchOperatorInfoBasedOnCode(value));
    };

    const handleVoyageSelectedChanged = (value) => {
        dispatch(voyageSelectedChanged(value));
    };

    const handleEquipmentSelectedChanged = (value) => {
        dispatch(equipmentSelectedChanged(value));
    };

    const handleHatchOperationTypeSelectedChanged = (value) => {
        dispatch(hatchOperationTypeSelectedChanged(value));
    };

    const handleHatchDirectionSelectedChanged = (value) => {
        dispatch(hatchDirectionSelectedChanged(value));
    };

    const handleCancelButton = () => {
        return props.history.push(props.location.pathname.replace('/hatch', ''))
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
                                    onSubmit={(values) => { onSubmit(values); }}
                                    validateOnBlur={true}
                                    enableReinitialize
                                >
                                    {(formik) => {
                                        // console.log("Formik props values", formik);
                                        return (
                                            <React.Fragment>
                                                <Form>
                                                    <div className="form-body">
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
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="customSelect"
                                                                    name="selectEquipmentType"
                                                                    selectedValue={
                                                                        EquipmentData.selectedEquipment
                                                                    }
                                                                    options={EquipmentData.equipments}
                                                                    placeholder="Equipment No"
                                                                    onSelectedChanged={
                                                                        handleEquipmentSelectedChanged
                                                                    }
                                                                    className="ltr"
                                                                />
                                                            </Col>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="inputMaskDebounce"
                                                                    name="bayAddress"
                                                                    id="bayAddress"
                                                                    mask="99"
                                                                    placeholder="Bay Address"
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
                                                        <Row>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="customSelect"
                                                                    name="selectHatchOperationType"
                                                                    selectedValue={
                                                                        HatchData.selectedHatchOperationType
                                                                    }
                                                                    options={HatchData.hatchOperationTypes}
                                                                    placeholder="Hatch Operation Type"
                                                                    onSelectedChanged={
                                                                        handleHatchOperationTypeSelectedChanged
                                                                    }
                                                                    className="ltr"
                                                                />
                                                            </Col>
                                                            <Col md="6">
                                                                <FormikControl
                                                                    control="customSelect"
                                                                    name="selectHatchDirection"
                                                                    selectedValue={
                                                                        HatchData.selectedHatchDirection
                                                                    }
                                                                    options={HatchData.hatchDirections}
                                                                    placeholder="Direction"
                                                                    onSelectedChanged={
                                                                        handleHatchDirectionSelectedChanged
                                                                    }
                                                                    className="ltr"
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
                                                                BayAddress:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.LoadingBayAddress}
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
                                                                {CntrInfo.CntrSize} / {CntrInfo.CntrType}{" "}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="mb-0 ltr"
                                                            style={{ textAlign: "left" }}>

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
                                                            <span className="labelDescription">GrossWeight:</span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.GrossWeight}
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
                                                                Grade:
                                                            </span>{" "}
                                                            <span className="labelValue">
                                                                {CntrInfo.Grade}
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
                                                        <Button color="primary" className="mr-1" type="submit" disabled={disableSubmitButton}>
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

export default HatchPage;
