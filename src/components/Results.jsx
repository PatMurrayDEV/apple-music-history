import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import Computation from "./Computation";
import numeral from 'numeral';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';
import HeatMap from 'react-heatmap-grid';

import ReasonsBox from './ReasonsBox';
import TopYears from './TopYears';
import MonthChart from './MonthChart';
import YearsTopSongs from './YearsTopSongs';
import TotalsBoxes from './TotalsBoxes';
import AllSongsTable from './AllSongsTable';

class Results extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            excludedSongs: []
        };
    }

    componentDidMount() {

        Computation.calculateTop(this.state.data, this.state.excludedSongs, results => {
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
                excludedSongs: results.excludedSongs,
                hoursArray: results.hoursArray
            });
        });
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
                excludedSongs: results.excludedSongs,
                hoursArray: results.hoursArray
            });
        });



    }

    clearExcluded() {
        Computation.calculateTop(this.state.data, [], results => {
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
                excludedSongs: results.excludedSongs,
                hoursArray: results.hoursArray
            });
        });
    }


    render() {

        if (this.state.songs == null) {
            return(<div><h1>Loading...</h1></div>);
        }


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

        


        

        

        var topSong = this.state.filteredSongs[0];

        var topSongBox = <div className="box" style={{ maxWidth: "calc(6em + 4 * 300px)" }}>
            <h3>Your most played song on Apple Music is</h3>
            <h1 className="display-3"><p>{topSong.key}</p></h1>
            <p className="lead">You've played this <strong>{topSong.value.plays}</strong> times for a total of <strong>{Computation.convertTime(topSong.value.time)}</strong>, skipping {Computation.convertTime(topSong.value.missedTime)}</p>
        </div>;


        var heatmapData = [];
        var firstDay = new Date();
        var maxValue = 0;
        var lastDate = new Date('2015-01-01T01:00:00');
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
            if (new Date(day.key) > lastDate) {
                lastDate = new Date(day.key)
            }
        }
        

        var daysTodayCount = Math.round((lastDate-firstDay)/(1000*60*60*24))
        var dayswithoutmusic = daysTodayCount - this.state.days.length;

        const xLabels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
        const xLabelsVisibility = [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false]
        const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];


        return (
            <div>
                <Jumbotron>
                    {topSongBox}
                    <TopYears years={this.state.years}/>
                    <TotalsBoxes totals={this.state.totals} songs={this.state.songs.length} artists={this.state.artists.length} day={this.state.days[0]}/>
                    <div className="years artists">
                        {artistBoxes}
                    </div>

                    <MonthChart months={this.state.months} />

                    <div className="box">
                        <h3>Playing Time by Date</h3>
                        <CalendarHeatmap
                            startDate={firstDay}
                            endDate={lastDate}
                            values={heatmapData}
                            showWeekdayLabels={true}
                            titleForValue={(value) => {
                                if (value && value.date != null) {
                                    return `${Computation.convertTime(value.count)} on ${value.date}`
                                } else {
                                    return ""
                                }

                            }}
                            tooltipDataAttrs={(value) => {
                                if (value && value.date != null) {
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
                        <p>There were <strong>{numeral(dayswithoutmusic).format('0,0')}</strong> out of <strong>{numeral(daysTodayCount).format('0,0')}</strong> days you didn't listen to music.</p>
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

                    <YearsTopSongs years={this.state.years} />

                    <ReasonsBox reasons={this.state.reasons} />

                    <div className="box">
                        <div className="title-flex"><h1>All Songs</h1> <Button outline color="secondary" size="sm" onClick={() => this.clearExcluded()} active={this.state.excludedSongs.length > 0}>Clear Excluded ({this.state.excludedSongs.length})</Button></div>
                        <AllSongsTable addExcluded={ row => this.addExcluded(row) } songs={this.state.songs}/>
                    </div>

                </Jumbotron>


            </div>
        );

    }
}

export default Results;