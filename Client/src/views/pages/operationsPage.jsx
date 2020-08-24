import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import MinimalStatisticsBG from "../../components/cards/minimalStatisticsBGCard";
import operationGroups from "../../mockData/operationGroups";
import CustomNavigation from "../../components/common/customNavigation";
import _ from "lodash";

class operationsPage extends Component {
  state = { group: null };

  constructor(props) {
    super(props);

    let a = this.props.operations;
    // console.log("operations", this.props);
    const group = _.head(
      operationGroups.filter(function (item) {
        return item.enName === a ? true : false;
      })
    );
    this.state.group = group;
  }

  handleOperation = (operationType) => {
    //console.log(operationType);
    switch (operationType) {
      case "Discharge":
        //console.log("operations", this.props.match.path);
        return this.props.history.push("/operationType/vessel/discharge");
      case "Load":
        //console.log("operations", this.props.match.path);
        return this.props.history.push("/operationType/vessel/load");
        case "Stowage":
          return this.props.history.push("/operationType/vessel/stowage");
    }
  };
  render() {
    if (!this.state.group) return null;
    return (
      <Fragment>
        <Row className="row-eq-height">
          <Col sm="12" md="3">
            <CustomNavigation path={this.props.match.path} />
          </Col>
        </Row>
        <Row className="row-eq-height">
          {this.state.group.operations.map((op) => (
            <Col sm="12" md="3" key={op.enName + op.fnName}>
              <MinimalStatisticsBG
                cardBgColor={op.class}
                statistics={op.enName}
                text={op.fnName}
                iconSide="right"
                onClick={this.handleOperation}
                key={op.enName}
              >
                {/* <Icon.Briefcase
                  size={56}
                  strokeWidth="1.3"
                  color="#fff"
                  key={op.fnName}
                /> */}
                {/* <img src={dischargeIcon} className="customIconSizes" />  */}
              </MinimalStatisticsBG>
            </Col>
          ))}
        </Row>
      </Fragment>
    );
  }
}

export default operationsPage;
