

//-------------------------------------------------------------------------------------------------
import React, { Component, Fragment } from "react";
import { Card, CardBody, CardTitle, Row, Col, Button, Form, CustomInput, FormGroup, Label, Input } from "reactstrap";
import {
   X,
   CheckSquare,
   User,
   Briefcase,
   MessageSquare,
   Clock,
   File,
   Info,
   FileText,
   Mail,
   AlertTriangle
} from "react-feather";

import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import Select from "react-select";

class handHeldPage extends Component {
   render() {
      return (
         <Fragment>
            {/* <ContentHeader>Basic Forms</ContentHeader>
            <ContentSubHeader>Basic Form Examples.</ContentSubHeader> */}

            <Row className="row-eq-height justify-content-md-center">
               <Col md="6">
                  <Card>
                     <CardBody>
                        {/* <CardTitle>Event Registration</CardTitle> */}
                        <p className="mb-0" style={{ textAlign: "center" }}>ثبت عملیات تخلیه</p>
                        <div className="px-3">
                           <Form>
                              <div className="form-body">

                                 <FormGroup>
                                 {/* <Label for="eventRegInput3">Company</Label>
                                       <Input type="text" id="eventRegInput3" name="company" /> */}
                                    <Select
                                       className="basic-single rtl"
                                       classNamePrefix="select"
                                       name="VoyageNo"
                                       //options={colourOptions}
                                       placeholder="شماره سفر" id="SelectVoyageNo"/>
                                 </FormGroup>

                                    <FormGroup>
                                    <Select
                                       className="basic-single rtl"
                                       classNamePrefix="select"
                                       name="EquipmentType"
                                       //options={colourOptions}
                                       placeholder="شماره دستگاه" id="SelectEquipmentType"/>
                                    </FormGroup>

                                    <FormGroup>
                                    <Select
                                       className="basic-single rtl"
                                       classNamePrefix="select"
                                       name="ContainerNo"
                                       //options={colourOptions}
                                       placeholder="شماره کانتینر" id="SelectContainerNo"/>
                                    </FormGroup>

                                    <FormGroup>
                                       <Input type="number" id="PersonllyCode" name="PersonllyCode" placeholder="کد پرسنلی" className="rtl" />
                                    </FormGroup>

                                    <FormGroup>
                                    <Input type="number" id="TruckNo" name="TruckNo" placeholder="شماره کشنده" className="rtl" />
                                    </FormGroup>
                              </div>
                              <div className="form-actions center">
                              <p className="mb-0 rtl" style={{ textAlign: "center" }}>اطلاعات تکمیلی</p>
                              <p className="mb-0 rtl" style={{ textAlign: "right" }}>نوع و سایز کانتینر:</p>
                              <p className="mb-0 rtl" style={{ textAlign: "right" }}>شماره بارنامه:</p>
                              <p className="mb-0 rtl" style={{ textAlign: "right" }}>وضعیت پر یا خالی:</p>
                              <p className="mb-0 rtl" style={{ textAlign: "right" }}>وضعیت خطرناک بودن:</p>
                              </div>
                                 <div className="form-actions center">
                                    <Button color="warning" className="mr-1">
                                       <X size={16} color="#FFF" /> Cancel
                                 </Button>
                                    <Button color="primary">
                                       <CheckSquare size={16} color="#FFF" /> Save
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

export default handHeldPage;

