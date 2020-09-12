import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import MinimalStatisticsBG from "../../components/cards/minimalStatisticsBGCard";
import operationGroups from "../../mockData/operationGroups";
import _ from "lodash";
import urls from '../../urls.json';
import config from '../../config.json';
import * as auth from '../../services/authService';

class operationTypePage extends Component {

  //#region INITIAL AND STATE ----------------------------------------------

  //state = { group: null };
  constructor(props) {
    super(props);
    this.state = { group: null };
  }

  componentWillMount() {
    const group = _(operationGroups).value();
    const { userType, permissions } = auth.getCurrentUser();
    //console.log(userType, permissions, group)
    if (!config.useAuthentication || userType === "Admin")
      this.setState({ group });
    else {
      const accessGroup = group.filter(c => permissions.filter(p => _.toUpper(p.name) === _.toUpper(c.enName) && p.isGranted === true).length == 1);
      //console.log('access group', accessGroup);
     if (accessGroup.length >= 1) {
        this.setState({ group: accessGroup })
      }
    }
  }

  //#endregion -------------------------------------------------------------

  //#region EVENT HANDLRES -------------------------------------------------

  handleOperationType = (operationType) => {

    switch (operationType) {
      case "Gate":
        return this.props.history.push(urls.Gate);
      case "Vessel":
        return this.props.history.push(urls.Vessel);
      case "CY":
        return this.props.history.push(urls.CY);
      default:
        return this.props.history.push("/");
    }
  };

  //#endregion -------------------------------------------------------------

  render() {
   // console.log(this.state);
    if (!this.state.group) return null;
    return (
      <Fragment>
        <Row className="row-eq-height">
          {this.state.group.map((g) => (
            <Col sm="12" md="12" key={g.fnName}>
              <MinimalStatisticsBG
                cardBgColor={g.class}
                statistics={g.enName}
                text={g.fnName}
                iconSide="right"
                onClick={this.handleOperationType}
                key={g.enName}
                textAlign="center"
              >
              </MinimalStatisticsBG>

            </Col>
          ))}
        </Row>
      </Fragment>
    );
  }
}

export default operationTypePage;
