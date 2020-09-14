import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import urls from '../../urls.json'
import MinimalStatisticsBG from "../../components/cards/minimalStatisticsBGCard";
import operationGroups from "../../mockData/operationGroups";
import CustomNavigation from "../../components/common/customNavigation";
import _ from "lodash";
import * as auth from '../../services/authService'
import * as config  from  '../../config.json'

class operationsPage extends Component {

  //#region INITIAL AND STATE ----------------------------------------------

  state = { group: null };
  
  componentWillMount() {
    let a = this.props.operations;
    // console.log("operations", this.props);
    const group = _.head(
      operationGroups.filter(function (item) {
        return item.enName === a ? true : false;
      })
    );
    //this.state.group = group;

    const { userType, permissions } = auth.getCurrentUser();
   // console.log(userType, permissions, group)
    if (!config.useAuthentication || userType === "Admin")
      this.setState({ group : group.operations });
    else {
      const permission = permissions.filter(c => _.toUpper(c.name) === _.toUpper(a));
      const accessGroup = group.operations.filter(c => permission[0].access.filter(ac => _.toUpper(ac.key) === _.toUpper(c.pName) && ac.value === true).length == 1);

     // console.log('access group', accessGroup);
     if (accessGroup.length >= 1) {
        this.setState({ group: accessGroup })
      }
    }
  }


  //#endregion -------------------------------------------------------------


  //#region EVENT HANDLRES -------------------------------------------------

  handleOperation = (operationType) => {
    //console.log(operationType);
    switch (operationType) {
      case "Discharge":
        //console.log("operations", this.props.match.path);
        return this.props.history.push(urls.Discharge);
      case "Load":
        //console.log("operations", this.props.match.path);
        return this.props.history.push(urls.Load);
      case "Stowage":
        return this.props.history.push(urls.Stowage);
    }
  };

  //#endregion -------------------------------------------------------------
  
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
          {this.state.group.map((op) => (
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
