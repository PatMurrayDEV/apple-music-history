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
import TopSongBox from './TopSongBox';
import Wrapped from './Wrapped';


class Results extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            excludedSongs: []
        };
    }

    componentDidMount() {
        setTimeout(() => {
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
                    hoursArray: results.hoursArray,
                    thisYear: results.thisYear
                });
            });
        }, 0);
    }

    addExcluded(row) {

        var key = row.original.key;

        var excludedSongs = this.state.excludedSongs;
        if (excludedSongs.includes(key)) {
            excludedSongs = excludedSongs.filter(item => item !== key);
        } else {
            excludedSongs.push(key);
        }

        setTimeout(() => {
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
                    hoursArray: results.hoursArray,
                    thisYear: results.thisYear
                });
                
            });
        }, 0);



    }

    clearExcluded() {
        setTimeout(() => {
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
                    hoursArray: results.hoursArray,
                    thisYear: results.thisYear
                });
            });
        }, 0);
    }


    render() {

        if (this.state.songs == null) {
            return (<div><h4  style={{textAlign: 'center'}}>Loading...</h4><div className="sk-fading-circle">
            <div className="sk-circle1 sk-circle"></div>
            <div className="sk-circle2 sk-circle"></div>
            <div className="sk-circle3 sk-circle"></div>
            <div className="sk-circle4 sk-circle"></div>
            <div className="sk-circle5 sk-circle"></div>
            <div className="sk-circle6 sk-circle"></div>
            <div className="sk-circle7 sk-circle"></div>
            <div className="sk-circle8 sk-circle"></div>
            <div className="sk-circle9 sk-circle"></div>
            <div className="sk-circle10 sk-circle"></div>
            <div className="sk-circle11 sk-circle"></div>
            <div className="sk-circle12 sk-circle"></div>
          </div>
          </div>);
        }

        if (this.state.songs.length <= 1) {
            return(<div className="errorDiv box">There was an error processing your data <span role="img" aria-label="sad face emoji">☹️</span> , please double check the loaded file is correct: "<em>Apple Music Play Activity.<strong>csv</strong></em>".<br/>For more help please follow this helpful <a href="https://www.macrumors.com/2018/11/29/web-app-apple-music-history/">guide from MacRumors</a>.<br/><br/>If problems persist, please check the column titles against <a href="https://github.com/PatMurrayDEV/apple-music-history/blob/master/src/components/Banner.jsx">this file</a> or <a href="https://github.com/PatMurrayDEV/apple-music-history/blob/master/src/components/Banner.jsx">create a pull request</a>. 
                    <br/><br/><a href="http://music.patmurray.co">Reload Page...</a></div>)
        }


        let artistTotalCount = (this.state.artists.length > 8 ? 8 : this.state.artists.length);
        var artistBoxes = [];
        for (let index = 0; index < artistTotalCount; index++) {
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


        var topSongBox = <TopSongBox song={topSong} />;

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



        var daysTodayCount = Math.round((lastDate - firstDay) / (1000 * 60 * 60 * 24))
        var dayswithoutmusic = daysTodayCount - this.state.days.length;

        const xLabels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
        const xLabelsVisibility = [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false]
        const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];



        return (
            <div>

                

                <Jumbotron>

                    

                    {topSongBox}

                    

                    <TopYears years={this.state.years} />
                    <TotalsBoxes totals={this.state.totals} songs={this.state.songs.length} artists={this.state.artists.length} day={this.state.days[0]} />
                    <div className="years artists">
                        {artistBoxes}
                    </div>

                    {this.state.thisYear.totalPlays > 1 &&
                        <Wrapped year={this.state.thisYear} songs={this.state.thisYear.songs}/>
                    }

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
                        <AllSongsTable addExcluded={row => this.addExcluded(row)} songs={this.state.songs} />
                    </div>

                </Jumbotron>


            </div>
        );

    }
}

export default Results;
