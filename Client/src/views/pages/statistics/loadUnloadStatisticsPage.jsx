import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import { Row, Col, Card, CardTitle, CardHeader, CardBody } from "reactstrap";
import { Doughnut ,Pie} from "react-chartjs-2";
import 'chart.piecelabel.js';

import { getLoadUnloadStatisticsByVoyageId } from "../../../services/voyageService";
import _ from "lodash";

var socket;
class loadUnloadStatisticsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            label: props.location.state !== undefined ? props.location.state.voyageInfo.label : "---",
            value: props.location.state !== undefined ? props.location.state.voyageInfo.value : "---", chartData: {}
        }
        console.log('state const', this.state);
        socket = socketIOClient("http://192.168.6.42:4000");
    }

    getData = foodItems => {
        //console.log(foodItems);
        //let temp = { ...this.state };
        // temp.chartData = foodItems;
        console.log('socketttttt',foodItems)
        this.generateChartData(foodItems);
        //this.setState(temp);
    };

    generateChartData = (data) => {
        let lables = [];
        let dataSet = [];
        console.log(data);
        if (data[0]["ActualUnloadCount20"] !== 0) {
            lables.push("تخلیه شده 20 فوت");
            dataSet.push(data[0]["ActualUnloadCount20"]);
        }
        if (data[0]["ActualUnloadCount40"] !== 0) {
            lables.push("تخلیه شده 40 فوت");
            dataSet.push(data[0]["ActualUnloadCount40"]);
        }
        if (data[0]["ActualLoadCount20"] !== 0) {
            lables.push("بارگیری شده 20 فوت");
            dataSet.push(data[0]["ActualLoadCount20"]);
        }
        if (data[0]["ActualLoadCount40"] !== 0) {
            lables.push("بارگیری شده 40 فوت");
            dataSet.push(data[0]["ActualLoadCount40"]);
        }
        if (data[0]["ActualShiftingCount20"] !== 0) {
            lables.push("شیفتینگ 20 فوت");
            dataSet.push(data[0]["ActualShiftingCount20"]);
        }
        if (data[0]["ActualShiftingCount40"] !== 0) {
            lables.push("شیفتینگ 40 فوت");
            dataSet.push(data[0]["ActualShiftingCount40"]);
        }
        // if (data[0]["UnloadCount20"] !== 0) {
        //     lables.push("UnloadCount20");
        //     dataSet.push(data[0]["UnloadCount20"]);
        // }
        // if (data[0]["UnloadCount40"] !== 0) {
        //     lables.push("UnloadCount40");
        //     dataSet.push(data[0]["UnloadCount40"]);
        // }
        // if (data[0]["UnloadIncrementCount20"] !== 0) {
        //     lables.push("UnloadIncrementCount20");
        //     dataSet.push(data[0]["UnloadIncrementCount20"]);
        // }
        // if (data[0]["UnloadIncrementCount40"] !== 0) {
        //     lables.push("UnloadIncrementCount40");
        //     dataSet.push(data[0]["UnloadIncrementCount40"]);
        // }
        // if (data[0]["ShiftingCount20"] !== 0) {
        //     lables.push("ShiftingCount20");
        //     dataSet.push(data[0]["ShiftingCount20"]);
        // }
        // if (data[0]["ShiftingCount40"] !== 0) {
        //     lables.push("ShiftingCount40");
        //     dataSet.push(data[0]["ShiftingCount40"]);
        // }
        // if (data[0]["VisibilityCount20"] !== 0) {
        //     lables.push("VisibilityCount20");
        //     dataSet.push(data[0]["VisibilityCount20"]);
        // }
        // if (data[0]["VisibilityCount40"] !== 0) {
        //     lables.push("VisibilityCount40");
        //     dataSet.push(data[0]["VisibilityCount40"]);
        // }
        // if (data[0]["LoadCount20"] !== 0) {
        //     lables.push("LoadCount20");
        //     dataSet.push(data[0]["LoadCount20"]);
        // }
        // if (data[0]["LoadCount40"] !== 0) {
        //     lables.push("LoadCount40");
        //     dataSet.push(data[0]["LoadCount40"]);
        // }

        if (dataSet.length > 0) {
            let chartData = {
                data: {
                    labels: lables,
                    datasets: [
                        {
                            data: dataSet,
                            backgroundColor: [
                                "#F06292",
                                "#E57373",
                                "#64B5F6",
                                //"#7E57C2",
                                "#26C6DA",
                                "#BDBDBD",
                               // "#FF7043",
                               // "#8D6E63",
                                "#81C784",
                                "#FFA726",
                                "#01579B",
                                "#C5CAE9",
                                "#C51162",
                                "#D32F2F",
                                "#30CB91",
                                "#FF5063"
                            ]
                        }
                    ]
                },
                options: {
                    animation: {
                        duration: 5000, // general animation time
                        easing: "easeOutBack"
                     },
                    responsive: true,
                    maintainAspectRatio: false,
                    legend:{
                        position:'left',
                        labels:{
                            boxWidth:10
                        }
                    },
                    pieceLabel: {
                        render: 'value'
                     }
                }
            }
            let temp = { ...this.state };
            temp.chartData = chartData;
            this.setState(temp);
        }
    }
    componentDidMount() {
        console.log('state cdm', this.state.value);

        var state_current = this;
        socket.on("get_data", state_current.getData);

        getLoadUnloadStatisticsByVoyageId({ voyageId: this.state.value })
            .then(response => {
                const { data, result } = response.data;
                if (result)
                    this.generateChartData(data);
            })
            .catch(err => console.log('rrrrrr', err));
    }
    componentWillUnmount() {
        socket.off("get_data");
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
    handleClick = () => {
        getLoadUnloadStatisticsByVoyageId({ voyageId: this.state.value }).then(res => console.log('handleclickresult', res)).catch(err => console.log(err));
    }
    render() {
        console.log(this.state)
        if (!this.state.chartData || !this.state.chartData.data) return null;
        return (
            <Fragment>
                <Row className="row-eq-height">
                    {/* salam
                    <button onClick={this.handleClick}>get Data</button> */}
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="rtl customFont" style={{ float: "right" }}>آمار تخلیه و بارگیری برای سفر {this.state.label}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Pie height={400} data={this.state.chartData.data} options={this.state.chartData.options}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default loadUnloadStatisticsPage;
