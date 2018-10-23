import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import Computation from "./Computation"
import numeral from 'numeral';
import 'react-table/react-table.css'
import ReactTable from "react-table";

var LineChart = require("react-chartjs").Line;

class Results extends Component {

    constructor(props) {
        super(props);
        this.state = props.data;
    }

    render() {

        var yearsBoxes = []
        for (let index = 0; index < this.state.years.length; index++) {
            const year = this.state.years[index];
            const div = <div className="box year" key={year.key}>
                <div>
                    <h1>{year.key}</h1>
                    <h3>{year.value[0].value.name}</h3>
                    <h4>{year.value[0].value.artist}</h4>
                </div>
                <div>
                    <hr className="my-2" />
                    <p className="lead">{year.value[0].value.plays} Plays</p>
                    <p>{numeral(year.value[0].value.time / 1000).format('00:00:00')}</p>
                </div>
            </div>
            yearsBoxes.push(div);
        }

        var linechart = <LineChart data={Computation.convetrData(this.state.months)} width="600" height="300" options={{ bezierCurve: true, bezierCurveTension: 0.8, pointDot: false }} />

        var table = <ReactTable
            data={this.state.songs}
            columns={[
                {
                    Header: "Song",
                    columns: [
                        {
                            Header: "Name",
                            id: "name",
                            accessor: d => d.value.name
                        },
                        {
                            Header: "Artist",
                            id: "artist",
                            accessor: d => d.value.artist
                        }
                    ]
                },
                {
                    Header: "Info",
                    columns: [
                        {
                            Header: "Plays",
                            id: "plays",
                            accessor: d => d.value.plays

                        },
                        {
                            Header: "Listened Time",
                            id: "time",
                            accessor: d => d.value.time,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            )
                        },
                        {
                            Header: "Skipped Time",
                            id: "missedTime",
                            accessor: d => d.value.missedTime,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            )
                        }
                    ]
                }
            ]
            }
            defaultPageSize={100}
            style={{
                height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
        />

        return (
            <div>
                <Jumbotron>
                    <h3>Your most played song on Apple Music is</h3>
                    <h1 className="display-3"><p>{this.state.songs[0].key}</p></h1>
                    <p className="lead">You've played this {this.state.songs[0].value.plays} times for a total of {numeral(this.state.songs[0].value.time / 1000).format('00:00:00')}, skipping {numeral(this.state.songs[0].value.missedTime / 1000).format('00:00:00')}</p>
                    <hr className="my-2" />
                    <div className="years">{yearsBoxes}</div>

                </Jumbotron>
                <div className="box linechart">
                    {linechart}
                </div>
                {table}
            </div>
        );

    }
}

export default Results;