import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import MinimalStatisticsBG from "../../components/cards/minimalStatisticsBGCard";
import operationGroups from "../../mockData/operationGroups";
import _ from "lodash";

class operationTypePage extends Component {

  state = { group: null };

  componentDidMount() {
    const group = _(operationGroups).value();
    this.setState({ group });
  }

  handleOperationType = (operationType) => {
    //console.log(this.props);
    switch (operationType) {
      case "Gate":
        return this.props.history.push("/operationType/gate");
      case "Vessel":
        return this.props.history.push("/operationType/vessel");
      case "CY":
        return this.props.history.push("/operationType/cy");
      default:
        return this.props.history.push("/");
    }
  };
  render() {
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
