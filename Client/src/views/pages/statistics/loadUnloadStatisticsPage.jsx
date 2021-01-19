import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import { Row, Col, Card, CardTitle, CardHeader, CardBody } from "reactstrap";
import { Doughnut, Pie } from "react-chartjs-2";
import 'chart.piecelabel.js';
import config from '../../../config.json'

import { getLoadUnloadStatisticsByVoyageId } from "../../../services/voyageService";
import _ from "lodash";
import { toast } from "react-toastify";
import CustomNavigation from "../../../components/common/customNavigation";
import { Tag } from 'antd';
import antdClass from 'antd/dist/antd.css';

var socket;
class loadUnloadStatisticsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            label: props.location.state !== undefined ? props.location.state.voyageInfo.label : "---",
            value: props.location.state !== undefined ? props.location.state.voyageInfo.value : 0, chartData: {},
            voyageData: []
        }
        // console.log('state const', this.state);
        socket = socketIOClient(config.socketAddress);
    }

    getData = foodItems => {
        //console.log(foodItems);
        //let temp = { ...this.state };
        // temp.chartData = foodItems;
        // console.log('socketttttt', foodItems)
        this.generateChartData(foodItems);
        //this.setState(temp);
    };

    generateChartData = (data) => {
        let lables = [];
        let dataSet = [];
        let tempVoyageData = [];
        //console.log(data);
        if (data[0]["ActualUnloadCount20"] !== 0) {
            lables.push("Unloaded 20\'");
            dataSet.push(data[0]["ActualUnloadCount20"]);
        }
        if (data[0]["ActualUnloadCount40"] !== 0) {
            lables.push("Unloaded 40\'");
            dataSet.push(data[0]["ActualUnloadCount40"]);
        }
        if (data[0]["ActualLoadCount20"] !== 0) {
            lables.push("Loaded 20\'");
            dataSet.push(data[0]["ActualLoadCount20"]);
        }
        if (data[0]["ActualLoadCount40"] !== 0) {
            lables.push("Loaded 40\'");
            dataSet.push(data[0]["ActualLoadCount40"]);
        }
        if (data[0]["ActualShiftingCount20"] !== 0) {
            lables.push("Shfting 20\'");
            dataSet.push(data[0]["ActualShiftingCount20"]);
        }
        if (data[0]["ActualShiftingCount40"] !== 0) {
            lables.push("Shifting 40\'");
            dataSet.push(data[0]["ActualShiftingCount40"]);
        }
        if (data[0]["UnloadCount20"] !== 0) {
            //lables.push("UnloadCount20");
            //dataSet.push(data[0]["UnloadCount20"]);
            tempVoyageData.push(
                {
                    key: `Remain Unload 20' :  ${data[0]["UnloadCount20"] - data[0]["ActualUnloadCount20"]} / ${data[0]["UnloadCount20"]}`,
                    color: 'magenta'
                });
        }
        if (data[0]["UnloadCount40"] !== 0) {
            // lables.push("UnloadCount40");
            // dataSet.push(data[0]["UnloadCount40"]);
            tempVoyageData.push(
                {
                    key: `Remain Unload 40' : ${data[0]["UnloadCount40"] - data[0]["ActualUnloadCount40"]} / ${data[0]["UnloadCount40"]}`,
                    color: 'purple'
                });
        }
        if (data[0]["UnloadCount20"] !== 0 || data[0]["UnloadCount40"] !== 0) {
            tempVoyageData.push(
                {
                    key: `Total Unload' : ${data[0]["UnloadCount20"] + data[0]["UnloadCount40"]}`,
                    color: 'blue'
                });
        }
        if (data[0]["LoadCount20"] !== 0) {
            //lables.push("LoadCount20");
            //dataSet.push(data[0]["LoadCount20"]);
            tempVoyageData.push(
                {
                    key: `Remain Load 20' :  ${data[0]["LoadCount20"] - data[0]["ActualLoadCount20"]} / ${data[0]["LoadCount20"]}`,
                    color: 'magenta'
                });
        }
        if (data[0]["LoadCount40"] !== 0) {
            //lables.push("LoadCount40");
            //dataSet.push(data[0]["LoadCount40"]);
            tempVoyageData.push(
                {
                    key: `Remain Load 40' :  ${data[0]["LoadCount40"] - data[0]["ActualLoadCount40"]} / ${data[0]["LoadCount40"]}`,
                    color: 'purple'
                });
        }
        if (data[0]["LoadCount20"] !== 0 || data[0]["LoadCount40"] !== 0) {
            tempVoyageData.push(
                {
                    key: `Total Load' : ${data[0]["LoadCount20"] + data[0]["LoadCount40"]}`,
                    color: 'blue'
                });
        }
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

        this.setState({ voyageData: tempVoyageData });

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
                    legend: {
                        position: 'left',
                        labels: {
                            boxWidth: 10
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
        //   console.log('state cdm', this.state.value);

        var state_current = this;
        socket.on("get_data", state_current.getData);

        getLoadUnloadStatisticsByVoyageId({ voyageId: this.state.value })
            .then(response => {
                const { data, result } = response.data;
                if (result) {
                    console.log(response)
                    this.generateChartData(data);
                }

            })
            .catch(err => {
                console.log('rrrrrr', err.response)
                //   this.setState({chartData:[]})
                return toast.error(err.response.data.data[0]);
            });
    }
    componentWillUnmount() {
        socket.off("get_data");
    }
    render() {
        // console.log(this.state)

        return (
            <Fragment>
                <Row className="row-eq-height">
                    {/* salam
                    <button onClick={this.handleClick}>get Data</button> */}
                    <Col sm="12">
                        <div>
                            <CustomNavigation path={this.props.match.path} />
                        </div>
                        {
                            this.state.chartData && this.state.chartData.data &&
                            <Card>
                                <CardHeader>
                                    <CardTitle className="ltr customFont" style={{ float: "left" }}>
                                        <Row>
                                            <Col md="12">
                                                Load / Unload Statistics For: {this.state.label}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" className="mt-2"><div>
                                                {

                                                    this.state.voyageData.map((item, index) => {
                                                        return (
                                                            <React.Fragment>
                                                                <Tag color={item.color} style={{width:'15rem',textAlign:"center"}}>{
                                                                    item.key
                                                                }</Tag>
                                                                {((index + 1) % 3 === 0) ? <br /> : null}
                                                            </React.Fragment>
                                                        );
                                                    })
                                                }
                                            </div></Col>
                                        </Row>

                                    </CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <Pie height={400} data={this.state.chartData.data} options={this.state.chartData.options} />
                                </CardBody>
                            </Card>
                        }

                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default loadUnloadStatisticsPage;
