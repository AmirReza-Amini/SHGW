// login ..................................................................
import React, { Component } from "react";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Form,
  FormGroup,
  Button,
  Label,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap";

const colourOptions = [
  { value: "0", label: "SPMCO" },
  { value: "1", label: "SINA" },
];

class loginPage extends Component {
  state = {
    isChecked: true,
  };
  handleChecked = (e) => {
    this.setState((prevState) => ({
      isChecked: !prevState.isChecked,
    }));
  };

  render() {
    return (
      <div className="container">
        <Row className="full-height-vh">
          <Col
            xs="12"
            className="d-flex align-items-center justify-content-center"
          >
            <Card className="gradient-indigo-blue text-center width-400">
              <CardBody>
                <h2 className="white py-4">
                  شرکت توسعه خدمات دریایی و بندری سینا
                </h2>
                <Form className="pt-2">
                  <FormGroup>
                    <Col md="12">
                      <Select
                        className="basic-single rtl"
                        classNamePrefix="select"
                        name="color"
                        options={colourOptions}
                        placeholder="انتخاب محوطه عملیات"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col md="12">
                      <Input
                        type="email"
                        className="form-control rtl"
                        name="inputEmail"
                        id="inputEmail"
                        placeholder="نام کاربری"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col md="12">
                      <Input
                        type="password"
                        className="form-control rtl"
                        name="inputPass"
                        id="inputPass"
                        placeholder="رمز عبور"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Row>
                      <Col md="12">
                        <div className="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0 ml-3">
                          <Input
                            type="checkbox"
                            className="custom-control-input"
                            checked={this.state.isChecked}
                            onChange={this.handleChecked}
                            id="rememberme"
                          />
                          <Label
                            className="custom-control-label float-right white"
                            for="rememberme"
                          >
                            <h6>مرا به خاطر بسپار</h6>
                          </Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Col md="12">
                      <Button
                        type="submit"
                        color="danger"
                        block
                        className="btn-green btn-raised"
                      >
                        ثبت
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        block
                        className="btn-raised"
                      >
                        لغو
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <div className="float-right">
                  <NavLink to="/pages/forgot-password" className="text-white">
                    فراموشی رمز عبور ؟
                  </NavLink>
                </div>
                {/* <div className="float-right">
                           <NavLink to="/pages/register" className="text-white">
                              Register Now
                           </NavLink>
                        </div> */}
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default loginPage;
