import React, { Component, Fragment, useState } from "react";
import { Card, CardBody, Row, Col, Button, FormGroup, Input } from "reactstrap";
import { X, CheckSquare } from "react-feather";
import CustomNavigation from "../../components/common/customNavigation";
import { Formik, Form } from "formik";
import FormikControl from "../../components/common/formik/FormikControl";
import * as Yup from "yup";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVoyagesTopTenOpen } from "../../redux/common/voyage/voyageActions";

const initialValues = {
  selectVoyageNo: "",
  selectEquipmentType: "",
  selectContainerNo: "",
  personallyCode: "",
  truckNo: "",
};

const validationSchema = Yup.object({
  selectVoyageNo: Yup.string().required("!شماره سفر را وارد کنید"),
  selectEquipmentType: Yup.string().required("!شماره دستگاه را وارد کنید"),
  selectContainerNo: Yup.string().required("!شماره کانتینر را وارد کنید"),
  personallyCode: Yup.string().required("!کد پرسنلی را وارد کنید"),
  truckNo: Yup.string().required("!شماره کشنده را وارد کنید"),
});

const voyageOptions = [];
const equipmentTypeOptions = [];
const containerNoOptions = [
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

const onSubmit = (values) => console.log("Form Data", values);

const UnloadOperationPage = (props) => {
  const [formValues, setFormValues] = useState(null);
  const voyageData = useSelector((state) => state.voyage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchVoyagesTopTenOpen());
  }, []);

  console.log("formvalues", formValues);
  console.log("voyageData", voyageData);
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
              <p className="mb-0" style={{ textAlign: "center" }}>
                ثبت عملیات تخلیه
              </p>
              <div className="px-3">
                <Formik
                  initialValues={formValues || initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  validateOnBlur={true}
                >
                  {(formik) => {
                    console.log("Formik props values", formik.values);
                    return (
                      <Form>
                        <div className="form-body">
                          <FormikControl
                            control="customSelect"
                            name="selectVoyageNo"
                            options={voyageOptions}
                            placeholder="شماره سفر"
                          />
                          <FormikControl
                            control="customSelect"
                            name="selectEquipmentType"
                            options={equipmentTypeOptions}
                            placeholder="شماره دستگاه"
                          />
                          <FormikControl
                            control="customSelect"
                            name="selectContainerNo"
                            options={containerNoOptions}
                            placeholder="شماره کانتینر"
                          />
                          <FormikControl
                            control="input"
                            type="number"
                            name="personallyCode"
                            className="rtl"
                            placeholder="کد پرسنلی"
                          />

                          <FormikControl
                            control="input"
                            type="text"
                            name="truckNo"
                            className="rtl"
                            placeholder="شماره کشنده"
                          />
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
};

export default UnloadOperationPage;
