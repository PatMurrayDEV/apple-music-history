import React, { Component } from 'react';
import Computation from "./Computation";
import numeral from 'numeral';


class TotalsBoxes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totals: props.totals,
            day: props.day,
            songs: props.songs,
            artists: props.artists
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            totals: nextProps.totals,
            day: nextProps.day,
            songs: nextProps.songs,
            artists: nextProps.artists
        });
    }


    render() {

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
                <h3>{this.state.day.key}</h3>
                <p className="lead">you listened to</p>
                <h3>{Computation.convertTime(this.state.day.value.time)}</h3>
                <p className="lead">of music</p>
            </div>
            <div>

            </div>
        </div>

        var totalSongs = <div className="box year" key="totalSongs">
            <div>
                <h2>{numeral(this.state.songs).format('0,0')}</h2>
                <p className="lead">songs</p>
            </div>
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.state.artists).format('0,0')}</h2>
                <p className="lead">artists</p>
            </div>
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.state.totals.totalLyrics).format('0,0')}</h2>
                <p className="lead">times viewed lyrics</p>
            </div>
        </div>

        var div = <div className="years">
            {totalsBox}
            {highestDay}
            {totalSongs}
        </div>



        return (div);

    }

}

export default TotalsBoxes;