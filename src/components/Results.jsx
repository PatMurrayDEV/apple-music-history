import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import Computation from "./Computation";
import alasql from 'alasql';



import HeatMap from 'react-heatmap-grid';

import ReasonsBox from './ReasonsBox';
import TopYears from './TopYears';
import MonthChart from './MonthChart';
import YearsTopSongs from './YearsTopSongs';
import TotalsBoxes from './TotalsBoxes';
import AllSongsTable from './AllSongsTable';
import TopSongBox from './TopSongBox';
import Wrapped from './Wrapped';
import QueryBox from './Querier';
import ArtistsBoxes from './ArtistsBoxes';
import DayHeatMap from './Heatmap';


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
                    reasons: results.reasons,
                    data: this.state.data,
                    totals: results.totals,
                    excludedSongs: results.excludedSongs,
                    hoursArray: results.hoursArray,
                    thisYear: results.thisYear,
                    plays: results.plays
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
                    reasons: results.reasons,
                    data: this.state.data,
                    totals: results.totals,
                    excludedSongs: results.excludedSongs,
                    hoursArray: results.hoursArray,
                    thisYear: results.thisYear,
                    plays: results.plays
                });
                
            });
        }, 0);



    }

    clearExcluded() {
        setTimeout(() => {
            Computation.calculateTop(this.state.data, [], results => {
                this.setState({
                    songs: results.songs,
                    reasons: results.reasons,
                    data: this.state.data,
                    totals: results.totals,
                    excludedSongs: results.excludedSongs,
                    hoursArray: results.hoursArray,
                    thisYear: results.thisYear,
                    plays: results.plays
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
            return(<div className="errorDiv box">There was an error processing your data <span role="img" aria-label="sad face emoji">☹️</span> , please double check the loaded file is correct: "<em>Apple Music Play Activity.<strong>csv</strong></em>".<br/>For more help please follow this helpful <a href="https://www.macrumors.com/2018/11/29/web-app-apple-music-history/">guide from MacRumors</a>.<br/><br/>If problems persist, please contact me on Twitter <a href="http://twitter.com/_patmurray">@_patmurray</a><br/><br/><a href="http://music.patmurray.co">Reload Page...</a></div>)
        }




        var topSong = alasql(`SELECT name, artist, songID as key, COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE excluded = false GROUP BY name, artist, songID ORDER BY SUM(duration) DESC LIMIT 1`,[this.state.plays])[0];
        var topSongBox = <TopSongBox song={topSong} />;


        const xLabels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
        const xLabelsVisibility = [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false]
        const yLabels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];



        return (
            <div>

                

                <Jumbotron>


                    {topSongBox}

                    

                    <TopYears plays={this.state.plays} />
                    <TotalsBoxes totals={this.state.totals} day={alasql(`SELECT date,  COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE excluded = false GROUP BY date ORDER BY SUM(duration) DESC LIMIT 1`,[this.state.plays])[0]} />
                    <ArtistsBoxes plays={this.state.plays}/>

                    {this.state.thisYear.totalPlays > 1 &&
                        <Wrapped year={this.state.thisYear} songs={this.state.thisYear.songs}/>
                    }

                    <MonthChart plays={this.state.plays} />

                    <DayHeatMap plays={this.state.plays}/>

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

                    <YearsTopSongs plays={this.state.plays} />

                    <ReasonsBox reasons={this.state.reasons} />

                    <div className="box">
                        <div className="title-flex"><h1>All Songs</h1> <Button outline color="secondary" size="sm" onClick={() => this.clearExcluded()} active={this.state.excludedSongs.length > 0}>Clear Excluded ({this.state.excludedSongs.length})</Button></div>
                        <AllSongsTable addExcluded={row => this.addExcluded(row)} songs={this.state.songs} />
                    </div>

                    <QueryBox plays={this.state.plays} />

                </Jumbotron>


            </div>
        );

    }
}

export default Results;
