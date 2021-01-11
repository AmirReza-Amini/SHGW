import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import CustomNavigation from "../../../components/common/customNavigation";
import FormikControl from "../../../components/common/formik/FormikControl";
import { fetchVoyagesTopTenOpen, voyageSelectedChanged } from "../../../redux/common/voyage/voyageActions";
import { fetchEquipments, equipmentSelectedChanged } from "../../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../../redux/common/operator/operatorActions";

import { saveVesselHatchInfo, getVesselHatchInfoByVoyage } from "../../../services/vessel/deck";
import { fetchHatchOperationTypes, fetchHatchDirections, hatchOperationTypeSelectedChanged, hatchDirectionSelectedChanged } from "../../../redux/common/hatch/hatchActions";
import { Table } from 'antd';
import antdClass from 'antd/dist/antd.css';
import antdClass2 from "../../../assets/css/vendors/customAntdTable.css";


toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectVoyageNo: "",
    selectEquipmentType: "",
    operatorCode: "",
    bayAddress: "",
    selectHatchOperationType: '',
    selectHatchDirection: '',
    selectDay: null,
    selectDay2: null
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

    const Columns = [
        {
            title: 'Hatch No',
            dataIndex: 'HatchNo',
            key: 'HatchNo',
            sorter: {
                compare: (a, b) => a.HatchNo.localeCompare(b.HatchNo),
                multiple: 4
            },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Date',
            dataIndex: 'HatchDatePersian',
            key: 'HatchDatePersian',
            sorter: {
                compare: (a, b) => a.HatchDatePersian.localeCompare(b.HatchDatePersian),
                multiple: 3
            },
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'EQ..',
            dataIndex: 'EquipmentName',
            key: 'EquipmentName'
        },
        {
            title: 'Operator',
            dataIndex: 'OperatorName',
            key: 'OperatorName'
        },
        {
            title: 'Clerk',
            dataIndex: 'ClerkName',
            key: 'ClerkName'
        },
        {
            title: 'Direction',
            dataIndex: 'HatchDirection',
            key: 'HatchDirection',
        },
        {
            title: 'Type',
            dataIndex: 'HatchOperationTypeName',
            key: 'HatchOperationTypeName',
        }
    ];


    //#region SUBMIT FORMIK ----------------------------------------------------

    const onSubmit = (values) => {
        //console.log("Form Submit Data", values, OperatorData);
        let parameters = {
            voyageId: values.selectVoyageNo.value,
            operatorId: OperatorData.operator.staffId,
            equipmentId: values.selectEquipmentType.value,
            hatchNo: values.bayAddress,
            hatchOperationType: values.selectHatchOperationType.value,
            isLoaded: values.selectHatchDirection.value === 1 ? false : true
        };
        //console.log(parameters)
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
        selectEquipmentType: EquipmentData.selectedEquipment['hatch'],
        bayAddress: "",
        operatorCode: OperatorData.operator.staffCode,
        selectHatchOperationType: HatchData.selectedHatchOperationType,
        selectHatchDirection: HatchData.selectedHatchDirection,
        vesselHatchInfoList: []
    });
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
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
            dispatch(fetchEquipments());
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


    const handleOperatorCodeChange = (value) => {
        if (value !== "") dispatch(fetchOperatorInfoBasedOnCode(value));
    };

    const handleVoyageSelectedChanged = (value) => {
        dispatch(voyageSelectedChanged(value));
        getVesselHatchInfoByVoyage(value.value).then(response => {
            if (response.data.result) {
                //console.log('asdfafd', response.data)
                const temp = response.data.data.map(item => { return { ...item, key: item.HatchOperationID } })
                setState(prevState => ({ ...prevState, vesselHatchInfoList: temp }))
            }
            else {
                return toast.error(response.data.data[0]);
            }
        }).catch(error => { });
    };

    const handleEquipmentSelectedChanged = (value) => {
        dispatch(equipmentSelectedChanged(value,'hatch'));
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
                        
                            <div className="px-3">
                                <Formik
                                    initialValues={state || initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => { onSubmit(values); }}
                                    validateOnBlur={true}
                                    enableReinitialize
                                >
                                    {(formik) => {
                                         //console.log("Formik props values", formik.values);
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
                                                                        EquipmentData.selectedEquipment['hatch']
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
                                                        <Row>
                                                            <Col md="12">
                                                                <Table
                                                                    className={antdClass + antdClass2}
                                                                    columns={Columns}
                                                                    dataSource={state.vesselHatchInfoList}
                                                                    pagination={{ position: ["bottomCenter"] }}
                                                                    scroll={{ x: 500, y: 150 }}
                                                                />
                                                            </Col>
                                                        </Row>
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
