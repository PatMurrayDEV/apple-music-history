import React, { Component } from 'react';
import Computation from "./Computation";
import alasql from 'alasql';


var LineChart = require("react-chartjs").Line;

class MonthChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            months: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            months: alasql(`SELECT year, timeStamp->getMonth() as month, COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE excluded = false GROUP BY year, timeStamp->getMonth() ORDER BY timeStamp ASC`,[nextProps.plays])
        };
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