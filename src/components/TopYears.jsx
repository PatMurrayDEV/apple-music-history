
import React, { Component } from 'react';
import numeral from 'numeral';
import Computation from "./Computation";
import jsonp from 'jsonp';
import alasql from 'alasql';


class YearBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURL: "",
            searchURL: "",
            song: this.props.song,
        };
    }

    componentDidMount() {
        var url = "https://itunes.apple.com/search?term=" + this.state.song.name + " " + this.state.song.artist + "&country=US&media=music&entity=musicTrack";
        this.searchImage(url)
    }

    componentDidUpdate() {
        var url = "https://itunes.apple.com/search?term=" + this.state.song.name + " " + this.state.song.artist + "&country=US&media=music&entity=musicTrack";
        if (url !== this.state.searchURL) {
            this.searchImage(url)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.song !== nextProps.song) {
            return {
                song: nextProps.song,
            }
        } else {
            return null
        }
    }

    searchImage(url) {
        setTimeout(() => {
            jsonp(url, null, (err, data) => {
                if (err) {
                    console.error(err.message);
                    this.setState({
                        imageURL: "",
                        searchURL: "",
                    });
                } else {

                    if (data.results.length > 0) {
                        this.setState({
                            imageURL: data.results[0].artworkUrl30.replace('30x30bb', '300x300bb'),
                            searchURL: url,
                            error: false
                        });
                    }

                }
            });
        }, 0);
    }

    render() {


        var style = {}
        if (this.state.imageURL.length > 0) {
            var grad = "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)), url('" + this.state.imageURL + "')";
            style = { backgroundImage: grad }
        }

        const div = <div className="box year" style={style}>
            <div>
                <h4>{this.props.year}</h4>
                <h2>{this.props.song.name}</h2>
                <h4>{this.props.song.artist}</h4>
            </div>
            <div>
                <hr className="my-2" />
                <p className="lead">{numeral(this.props.song.plays).format('0,0')} Plays</p>
                <p>{Computation.convertTime(this.props.song.duration)}</p>
            </div>
        </div>
        return div;
    }

}


class TopYears extends Component {

    constructor(props) {
        super(props);
        this.state = {
            years: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var years = alasql(`SELECT * FROM (SELECT year, artist, name, SUM(duration) as duration_sum, COUNT(id) as plays FROM ? GROUP BY name, artist, year ORDER BY duration_sum DESC) GROUP BY year ORDER BY year ASC`, [nextProps.plays]);
        return {
            years: years
        };
    }


    render() {

        var yearsBoxes = [];

        for (let index = 0; index < this.state.years.length; index++) {
            const year = this.state.years[index];
            const div = <YearBox year={year.year} key={year.year} song={{name: year.name, artist: year.artist, duration: year.duration_sum, plays: year.plays}} />
            yearsBoxes.push(div);

        }

        return (<div className="years">{yearsBoxes}</div>);

    }

}

export default TopYears;