import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import Computation from "./Computation";
import numeral from 'numeral';
import 'react-table/react-table.css';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';
import HeatMap from 'react-heatmap-grid';

import YearCollapse from './yearcollapse'

var LineChart = require("react-chartjs").Line;
// var BarChart = require("react-chartjs").Bar;


class Results extends Component {

    constructor(props) {
        super(props);
        this.state = props.data;
    }

    addExcluded(row) {
        var key = row.original.key;

        var excludedSongs = this.state.excludedSongs;
        if (excludedSongs.includes(key)) {
            excludedSongs = excludedSongs.filter(item => item !== key);
        } else {
            excludedSongs.push(key);
        }

        Computation.calculateTop(this.state.data, excludedSongs, results => {
            this.setState({
                songs: results.songs,
                days: results.days,
                months: results.months,
                reasons: results.reasons,
                data: this.state.data,
                years: results.years,
                artists: results.artists,
                totals: results.totals,
                filteredSongs: results.filteredSongs,
                excludedSongs: results.excludedSongs
            });
        });

        

    }

    clearExcluded() {
        var results = Computation.calculateTop(this.state.data, []);
        this.setState({
            songs: results.songs,
            days: results.days,
            months: results.months,
            reasons: results.reasons,
            data: this.state.data,
            years: results.years,
            artists: results.artists,
            totals: results.totals,
            filteredSongs: results.filteredSongs,
            excludedSongs: results.excludedSongs
        });
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
                <p className="lead">Total you've listened to</p>
                <h2>{Computation.convertTime(this.state.totals.totalTime)}</h2>
                <p className="lead">of music</p>
            </div>
            <div>
                <h2>{numeral(this.state.totals.totalPlays).format('0,0')}</h2>
                <p className="lead">plays</p>
            </div>
        </div>

        var highestDay = <div className="box year" key="highestDay">
            <div>
                <p className="lead">On</p>
                <h3>{this.state.days[0].key}</h3>
                <p className="lead">you listened to</p>
                <h3>{Computation.convertTime(this.state.days[0].value.time)}</h3>
                <p className="lead">of music</p>
            </div>
            <div>

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
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.state.totals.totalLyrics).format('0,0')}</h2>
                <p className="lead">times viewed lyrics</p>
            </div>
        </div>


        var artistBoxes = [];
        for (let index = 0; index < 8; index++) {
            const artist = this.state.artists[index];
            const div = <div className="box year" key={artist.key}>
                <div>
                    <p style={{ marginBottom: 0 }}>Most played artist {index + 1}</p>
                    <h1>{artist.key}</h1>
                </div>
                <div>
                    <hr className="my-2" />
                    <p className="lead">{numeral(artist.value.plays).format('0,0')} Plays</p>
                    <p>{Computation.convertTime(artist.value.time)}</p>
                </div>
            </div>
            artistBoxes.push(div);
        }





        var yearsBoxes = [];
        var yearsBoxes2 = [];
        for (let index = 0; index < this.state.years.length; index++) {
            const year = this.state.years[index];
            const div = <div className="box year" key={year.key}>
                <div>
                    <h4>{year.key}</h4>
                    <h2>{year.value[0].value.name}</h2>
                    <h4>{year.value[0].value.artist}</h4>
                </div>
                <div>
                    <hr className="my-2" />
                    <p className="lead">{numeral(year.value[0].value.plays).format('0,0')} Plays</p>
                    <p>{Computation.convertTime(year.value[0].value.time)}</p>
                </div>
            </div>
            yearsBoxes.push(div);
            yearsBoxes2.push(<YearCollapse year={year} key={year.key + "-full"}/>);
        }


        

        var linechart = <LineChart data={Computation.convetrData(this.state.months)} width="600" height="300" options={{ bezierCurve: true, bezierCurveTension: 0.8, pointDot: false }} />

        var reasonsBoxes = [];

        for (let index = 0; index < this.state.reasons.length; index++) {
            const element = this.state.reasons[index];
            if (element.key !== "" && element.key !== "QUICK_PLAY" && element.key !== "NOT_APPLICABLE") {
                var box2 = <div className="box reason" key={element.key}>
                    <h3>{reasons[element.key]}</h3>
                    <p className="lead">{numeral(element.value).format('0,0')} Times</p>
                </div>
                reasonsBoxes.push(box2);
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
                            accessor: d => d.value.excluded,
                            Cell: d => (
                                <div><input
                                    name="isExcluded"
                                    type="checkbox"
                                    checked={d.value}
                                    onChange={e => {
                                        this.addExcluded(d);
                                    }} /></div>
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

        console.log(this.state);

        var topSong = this.state.filteredSongs[0];

        var topSongBox = <div className="box" style={{ maxWidth: "calc(6em + 4 * 300px)" }}>
            <h3>Your most played song on Apple Music is</h3>
            <h1 className="display-3"><p>{topSong.key}</p></h1>
            <p className="lead">You've played this <strong>{topSong.value.plays}</strong> times for a total of <strong>{Computation.convertTime(topSong.value.time)}</strong>, skipping {Computation.convertTime(topSong.value.missedTime)}</p>
        </div>;


        var heatmapData = [];
        var firstDay = new Date();
        var maxValue = 0;
        for (let index = 0; index < this.state.days.length; index++) {
            const day = this.state.days[index];
            heatmapData.push({
                date: day.key,
                count: day.value.time
            })
            if (day.value.time > maxValue) {
                maxValue = day.value.time
            }
            if (new Date(day.key) < firstDay) {
                firstDay = new Date(day.key)
            }
        }
        console.log(heatmapData);

        const xLabels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
        const xLabelsVisibility = [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false]
        const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];


        return (
            <div>
                <Jumbotron>
                    {topSongBox}
                    <div className="years">{yearsBoxes}</div>
                    <div className="years">
                        {totalsBox}
                        {highestDay}
                        {totalSongs}
                    </div>
                    <div className="years artists">
                        {artistBoxes}
                    </div>



                    <div className="box linechart">
                        <h3>Playing Time by Month</h3>
                        {linechart}
                        <p>
                            Orange line: hours playing // Green line: hours 'skipped'
                        </p>
                    </div>

                    <div className="box">
                        <h3>Playing Time by Date</h3>
                        <CalendarHeatmap
                            startDate={firstDay}
                            values={heatmapData}
                            showWeekdayLabels={true}
                            titleForValue={(value) => {
                                if (value) {
                                    return `${Computation.convertTime(value.count)} on ${value.date}`
                                } else {
                                    return ""
                                }

                            }}
                            tooltipDataAttrs={(value) => {
                                if (value) {
                                    return { 'data-tip': `${Computation.convertTime(value.count)} on ${value.date}` }
                                } else {
                                    return { 'data-tip': '' }
                                }

                            }}
                            classForValue={(value) => {
                                if (!value) {
                                    return 'color-empty';
                                }
                                var number = Math.ceil((value.count / maxValue * 100) / 10) * 10
                                return `color-scale-${number}`;
                            }}
                        />
                        <ReactTooltip />
                    </div>

                    <div>
                        <div className="box">
                            <h3>Playing Time by Hour of Day</h3>
                            <HeatMap
                                squares={true}
                                xLabelsVisibility={xLabelsVisibility}
                                xLabels={xLabels}
                                yLabels={yLabels}
                                data={this.state.hoursArray}
                            />
                        </div>
                    </div>

                    {yearsBoxes2}

                    <div className="box">
                        <h1>Reasons A Song Finished Playing</h1>
                        <div className="reasons">{reasonsBoxes}</div>
                    </div>

                    <div className="box">
                        <div className="title-flex"><h1>All Songs</h1> <Button outline color="secondary" size="sm" onClick={() => this.clearExcluded()} active={this.state.excludedSongs.length > 0}>Clear Excluded ({this.state.excludedSongs.length})</Button></div>

                        {table}
                    </div>

                </Jumbotron>


            </div>
        );

    }
}

export default Results;