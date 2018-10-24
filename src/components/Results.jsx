import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import Computation from "./Computation";
import numeral from 'numeral';
import 'react-table/react-table.css';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';

var LineChart = require("react-chartjs").Line;
// var BarChart = require("react-chartjs").Bar;


class Results extends Component {

    constructor(props) {
        super(props);
        this.state = props.data;
    }

    render() {

        var reasons = {
            "SCRUB_END": "Scrubbed to end of track",
            "MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM": "Selected another song",
            "PLAYBACK_MANUALLY_PAUSED": "Paused song",
            "FAILED_TO_LOAD": "Song failed to load",
            "TRACK_SKIPPED_FORWARDS": "Skipped to next track",
            "SCRUB_BEGIN": "Scrubbed to start of track",
            "NATURAL_END_OF_TRACK": "Song ended normally",
            "TRACK_SKIPPED_BACKWARDS": "Skipped to previous track",
            "NOT_APPLICABLE": "N/A",
            "PLAYBACK_STOPPED_DUE_TO_SESSION_TIMEOUT": "Session Timedout",
            "TRACK_BANNED": "Track was banned",
            "QUICK_PLAY": "Quick Play (whatever that is)",
            "": "No Idea?"
        };

        var totalsBox = <div className="box year" key="totals">
            <div>
                <p className="lead">Since Joining Apple Music</p>
                <p className="lead">You listened to</p>
                <h2>{Computation.convertTime(this.state.totals.totalTime)}</h2>
                <p className="lead">of music</p>
            </div>
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.state.totals.totalPlays).format('0,0')}</h2>
                <p className="lead">plays</p>
            </div>
        </div>

        var highestDay = <div className="box year" key="highestDay">
            <div>
                <p className="lead">On</p>
                <h3>{this.state.days[0].key}</h3>
                <p className="lead">you listened to</p>
            </div>
            <div>
                <h3>{Computation.convertTime(this.state.days[0].value.time)}</h3>
                <p className="lead">of music</p>
            </div>
        </div>

        var totalSongs = <div className="box year" key="totalSongs">
            <div>
                <h2>{numeral(this.state.songs.length).format('0,0')}</h2>
                <p className="lead">songs</p>
            </div>
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.state.artists.length).format('0,0')}</h2>
                <p className="lead">artists</p>
            </div>
        </div>


        var yearsBoxes = [];
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
                    <p className="lead">{numeral(year.value[0].value.plays).format('0,0')} Plays</p>
                    <p>{numeral(year.value[0].value.time / 1000).format('00:00:00')}</p>
                </div>
            </div>
            yearsBoxes.push(div);
        }

        var linechart = <LineChart data={Computation.convetrData(this.state.months)} width="600" height="300" options={{ bezierCurve: true, bezierCurveTension: 0.8, pointDot: false }} />

        var reasonsBoxes = [];

        console.log(this.state);

        for (let index = 0; index < this.state.reasons.length; index++) {
            const element = this.state.reasons[index];
            if (element.key !== "" && element.key !== "QUICK_PLAY" && element.key !== "NOT_APPLICABLE") {
                var box = <div className="box reason" key={element.key}>
                    <h3>{reasons[element.key]}</h3>
                    <p className="lead">{numeral(element.value).format('0,0')} Times</p>
                </div>
                reasonsBoxes.push(box);
            }
        }


        var table = <ReactTable
            data={this.state.songs}
            filterable
            defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
            columns={[
                {
                    Header: "Song",
                    columns: [
                        {
                            Header: "Name",
                            id: "name",
                            accessor: d => d.value.name,
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name"] }),
                            filterAll: true
                        },
                        {
                            Header: "Artist",
                            id: "artist",
                            accessor: d => d.value.artist,
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["artist"] }),
                            filterAll: true
                        }
                    ]
                },
                {
                    Header: "Info",
                    columns: [
                        {
                            Header: "Plays",
                            id: "plays",
                            accessor: d => d.value.plays,
                            filterable: false
                        },
                        {
                            Header: "Listened Time",
                            id: "time",
                            accessor: d => d.value.time,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            ),
                            filterable: false
                        },
                        {
                            Header: "Skipped Time",
                            id: "missedTime",
                            accessor: d => d.value.missedTime,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            ),
                            filterable: false
                        }
                    ]
                },
                {
                    Header: "Report",
                    columns: [
                        {
                            Header: "Exclude",
                            id: "exclude",
                            accessor: d => d.value.name,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            ),
                            filterable: false
                        }
                    ]
                }
            ]
            }
            defaultPageSize={100}
            style={{
                height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
        />

        return (
            <div>
                <Jumbotron>
                    <h3>Your most played song on Apple Music is</h3>
                    <h1 className="display-3"><p>{this.state.songs[0].key}</p></h1>
                    <p className="lead">You've played this {this.state.songs[0].value.plays} times for a total of {Computation.convertTime(this.state.songs[0].value.time)}, skipping {Computation.convertTime(this.state.songs[0].value.missedTime)}</p>
                    <hr className="my-2" />
                    <div className="years">{yearsBoxes}</div>
                    <hr className="my-2" />
                    <div className="years">
                        {totalsBox}
                        {highestDay}
                        {totalSongs}
                    </div>
                </Jumbotron>


                <div className="box linechart">
                    {linechart}
                </div>

                <div className="box">
                    <h1>Reasons A Song Finished Playing</h1>
                    <div className="reasons">{reasonsBoxes}</div>
                </div>

                <div className="box">
                    <h1>All Songs</h1>
                    {table}
                </div>




            </div>
        );

    }
}

export default Results;