
import React, { Component } from 'react';
import Computation from "./Computation";


var LineChart = require("react-chartjs").Line;

class MonthChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            months: props.months
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ months: nextProps.months});
    }


    render() {

        var linechart = <LineChart data={Computation.convetrData(this.state.months)} width="600" height="300" options={{ bezierCurve: true, bezierCurveTension: 0.3, pointDot: false }} />


        return (<div className="box linechart">
            <h3>Playing Time by Month</h3>
            {linechart}
            <p>
                Orange line: hours playing // Green line: hours 'skipped'
        </p>
        </div>);

    }

}

export default MonthChart;