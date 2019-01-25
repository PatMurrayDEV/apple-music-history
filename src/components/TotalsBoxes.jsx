import React, { Component } from 'react';
import Computation from "./Computation";
import numeral from 'numeral';


class TotalsBoxes extends Component {



    render() {

        var totalsBox = <div className="box year" key="totals">
            <div>
                <p className="lead">Total you've listened to</p>
                <h2>{Computation.convertTime(this.props.totals.totalTime)}</h2>
                <p className="lead">of music</p>
            </div>
            <div>
                <h2>{numeral(this.props.totals.totalPlays).format('0,0')}</h2>
                <p className="lead">plays</p>
            </div>
        </div>

        var highestDay = <div className="box year" key="highestDay">
            <div>
                <p className="lead">On</p>
                <h3>{this.props.day.date}</h3>
                <p className="lead">you listened to</p>
                <h3>{Computation.convertTime(this.props.day.duration)}</h3>
                <p className="lead">of music</p>
            </div>
            <div>

            </div>
        </div>

        var totalSongs = <div className="box year" key="totalSongs">
            <div>
                <h2>{numeral(this.props.totals.totalSongs).format('0,0')}</h2>
                <p className="lead">songs</p>
            </div>
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.props.totals.totalArtists).format('0,0')}</h2>
                <p className="lead">artists</p>
            </div>
            <div>
                <hr className="my-2" />
                <h2>{numeral(this.props.totals.totalLyrics).format('0,0')}</h2>
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