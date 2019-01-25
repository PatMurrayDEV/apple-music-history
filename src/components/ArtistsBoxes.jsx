import React, { Component } from 'react';
import alasql from 'alasql';
import Computation from "./Computation";
import numeral from 'numeral';

class ArtistsBoxes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            artists: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            artists: alasql(`SELECT artist, COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE excluded = false GROUP BY artist ORDER BY SUM(duration) DESC LIMIT 8`,[nextProps.plays])
        };
    }

    render() {

        var artistBoxes = [];
        for (let index = 0; index < this.state.artists.length; index++) {
            const artist = this.state.artists[index];
            const div = <div className="box year" key={artist.artist}>
                <div>
                    <p style={{ marginBottom: 0 }}>Most played artist {index + 1}</p>
                    <h1>{artist.artist}</h1>
                </div>
                <div>
                    <hr className="my-2" />
                    <p className="lead">{numeral(artist.plays).format('0,0')} Plays</p>
                    <p>{Computation.convertTime(artist.duration)}</p>
                </div>
            </div>
            artistBoxes.push(div);
        }

        return(<div className="years artists">{artistBoxes}</div>)
    }

}

export default ArtistsBoxes;