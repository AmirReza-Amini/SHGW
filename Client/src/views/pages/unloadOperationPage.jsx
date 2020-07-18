import React, { Component, Fragment } from "react";
import {Card,CardBody,Row,Col,Button,Form,FormGroup,Input} from "reactstrap";
import { X, CheckSquare } from "react-feather";
import CustomNavigation from "../../components/common/customNavigation";
import Select from "react-select";

class unloadOperationPage extends Component {
  render() {
    console.log("operation", this.props);
    return (
      <Fragment>
        <Row className="row-eq-height justify-content-md-center">
          <Col md="6">
            <div>
              <CustomNavigation path={this.props.match.path} />
            </div>
            {/* <div>
              <Breadcrumb tag="nav">
                <BreadcrumbItem>
                  <NavLink to="/operationType">Operation Type</NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                <NavLink to="/operationType/vessel">Vessel</NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem active >
                  Discharge
                </BreadcrumbItem>
              </Breadcrumb>
            </div> */}
            <Card>
              <CardBody>
                {/* <CardTitle>Event Registration</CardTitle> */}
                <p className="mb-0" style={{ textAlign: "center" }}>
                  ثبت عملیات تخلیه
                </p>
                <div className="px-3">
                  <Form>
                    <div className="form-body">
                      <FormGroup>
                        <Select
                          className="basic-single rtl"
                          classNamePrefix="select"
                          name="VoyageNo"
                          //options={colourOptions}
                          placeholder="شماره سفر"
                          id="SelectVoyageNo"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Select
                          className="basic-single rtl"
                          classNamePrefix="select"
                          name="EquipmentType"
                          //options={colourOptions}
                          placeholder="شماره دستگاه"
                          id="SelectEquipmentType"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Select
                          className="basic-single rtl"
                          classNamePrefix="select"
                          name="ContainerNo"
                          //options={colourOptions}
                          placeholder="شماره کانتینر"
                          id="SelectContainerNo"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Input
                          type="number"
                          id="PersonllyCode"
                          name="PersonllyCode"
                          placeholder="کد پرسنلی"
                          className="rtl"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Input
                          type="number"
                          id="TruckNo"
                          name="TruckNo"
                          placeholder="شماره کشنده"
                          className="rtl"
                        />
                      </FormGroup>
                    </div>
                    <div className="form-actions center">
                      <p className="mb-0 rtl" style={{ textAlign: "center" }}>
                        اطلاعات تکمیلی
                      </p>
                      <p className="mb-0 rtl" style={{ textAlign: "right" }}>
                        نوع و سایز کانتینر:
                      </p>
                      <p className="mb-0 rtl" style={{ textAlign: "right" }}>
                        شماره بارنامه:
                      </p>
                      <p className="mb-0 rtl" style={{ textAlign: "right" }}>
                        وضعیت پر یا خالی:
                      </p>
                      <p className="mb-0 rtl" style={{ textAlign: "right" }}>
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
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default unloadOperationPage;
