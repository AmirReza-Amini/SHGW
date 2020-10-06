import React, { Component, Fragment} from "react";
import { Card, CardBody, Row, Col, Button} from "reactstrap";
import { X, CheckSquare } from "react-feather";
import CustomNavigation from "../../../components/common/customNavigation";
import { Formik, Form } from "formik";
import FormikControl from "../../../components/common/formik/FormikControl";
import * as Yup from "yup";
import { connect } from "react-redux";
import { fetchVoyagesTopTenOpen, voyageSelectedChanged } from "../../../redux/common/voyage/voyageActions";
import { toast } from "react-toastify";
import { fetchEquipmentsForUnload, equipmentSelectedChanged } from "../../../redux/common/equipment/equipmentActions";
import { fetchOperatorInfoBasedOnCode } from "../../../redux/common/operator/operatorActions";

const initialValues = {
  selectVoyageNo: "",
  selectEquipmentType: "",
  containerNo: "",
  personallyCode: "",
  truckNo: "",
};

toast.configure();

const validationSchema = Yup.object({
  selectVoyageNo: Yup.string().required("!شماره سفر را وارد کنید"),
  selectEquipmentType: Yup.string().required("!شماره دستگاه را وارد کنید"),
  containerNo: Yup.string().required("!شماره کانتینر را وارد کنید"),
  operatorCode: Yup.string().required("!کد اپراتور را وارد کنید"),
  truckNo: Yup.string().required("!شماره کشنده را وارد کنید"),
});

const onSubmit = (values) => console.log("Form Data", values);

class UnloadOperationPage extends Component {

  state = {
    operatorCode: ""
  }

  constructor(props) {
    super(props)
  }


  componentDidMount() {

    console.log('component did mount', this.props);
    if (!this.props.voyageData.voyages || this.props.voyageData.voyages.length === 0)
      this.props.fetch();
    if (this.props.equipmentData.equipments.length === 0)
      this.props.fetchEquipment();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('component did update');
    if (this.props.voyageData.error)
      toast.error(' asdfadsfasfd')
  }



  handleOperatorCodeChange = (value) => {
    this.props.fetchOperator(value);
  };

  handleVoyageSelectedChanged = (value) => {
    console.log("handleVoyageSelectedChanged", value);
    //const dispatch = useDispatch();
    this.props.selectVoyage(value);
  };

  handleEquipmentSelectedChanged = (value) => {
    console.log("handleEquipmentSelectedChanged", value);
    //const dispatch = useDispatch();
    this.props.selectEquipment(value);
  };

  render() {

    console.log("voyage", this.props);
    const { operator } = this.props.operator;

    return (
      <Fragment>

        <Row className="row-eq-height justify-content-md-center">
          <Col md="6">
            <div>
              <CustomNavigation path={this.props.match.path} />
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
                                  selectedValue={this.props.voyageData.selectedVoyage}
                                  options={this.props.voyageData.voyages}
                                  placeholder="شماره سفر"
                                  onSelectedChanged={this.handleVoyageSelectedChanged}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md="12">
                                <FormikControl
                                  control="customSelect"
                                  name="selectEquipmentType"
                                  selectedValue={this.props.equipmentData.selectedEquipment}
                                  options={this.props.equipmentData.equipments}
                                  placeholder="شماره دستگاه"
                                  onSelectedChanged={this.handleEquipmentSelectedChanged}
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
                                    this.handleOperatorCodeChange(
                                      formik.values.operatorCode
                                    )
                                  }
                                  defaultValue={operator.staffCode}
                                />
                              </Col>
                              <Col md="6">
                                <FormikControl
                                  control="input"
                                  type="text"
                                  name="operatorCodeInfo"
                                  className="rtl"
                                  disabled={true}
                                  value={operator.name}
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
                                  onChange={this.handleContainerNoChange}
                                />
                                <div>{formik.values.containerNo}</div>
                              </Col>
                            </Row>

                            <Row>
                              <Col md="12">
                                <FormikControl
                                  control="input"
                                  type="text"
                                  name="truckNo"
                                  className="rtl"
                                  placeholder="شماره کشنده"
                                />
                              </Col>
                            </Row>
                          </div>
                          <div className="form-actions center">
                            <p
                              className="mb-0 rtl"
                              style={{ textAlign: "center" }}
                            >
                              اطلاعات تکمیلی
                          </p>
                            <p
                              className="mb-0 rtl"
                              style={{ textAlign: "right" }}
                            >
                              نوع و سایز کانتینر:
                          </p>
                            <p
                              className="mb-0 rtl"
                              style={{ textAlign: "right" }}
                            >
                              شماره بارنامه:
                          </p>
                            <p
                              className="mb-0 rtl"
                              style={{ textAlign: "right" }}
                            >
                              وضعیت پر یا خالی:
                          </p>
                            <p
                              className="mb-0 rtl"
                              style={{ textAlign: "right" }}
                            >
                              وضعیت خطرناک بودن:
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
  }
};

const mapStateToProps = (state) => {
  return {
    voyageData: state.voyage,
    equipmentData: state.equipment,
    operator: state.operator
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetch: () => dispatch(fetchVoyagesTopTenOpen()),
    selectVoyage: (value) => dispatch(voyageSelectedChanged(value)),
    fetchEquipment: () => dispatch(fetchEquipmentsForUnload()),
    selectEquipment: (value) => dispatch(equipmentSelectedChanged(value)),
    fetchOperator: (value) => dispatch(fetchOperatorInfoBasedOnCode(value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnloadOperationPage);
