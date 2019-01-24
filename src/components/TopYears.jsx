
import React, { Component } from 'react';
import numeral from 'numeral';
import Computation from "./Computation";
import jsonp from 'jsonp';


class YearBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURL: ""
        };
    }

    componentDidMount() {
        const year = this.props.year;
        setTimeout(() => {
            var url = "https://itunes.apple.com/search?term=" + year.songs[0].name + " " + year.songs[0].artist + "&country=US&media=music&entity=musicTrack"
            jsonp(url, null, (err, data) => {
                if (err) {
                    console.error(err.message);
                } else {

                    if (data.results.length > 0) {
                        this.setState({
                            imageURL: data.results[0].artworkUrl30.replace('30x30bb', '300x300bb')
                        });
                    }

                }
            });
        }, 0);
    }

    render() {


        var style = {}
        if (this.state.imageURL.length > 0) {
            var grad = "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)), url('"+ this.state.imageURL +"')";
            style = {backgroundImage: grad}
        }

        const year = this.props.year;
        const div = <div className="box year" style={style}>
            <div>
                <h4>{year.year}</h4>
                <h2>{year.songs[0].name}</h2>
                <h4>{year.songs[0].artist}</h4>
            </div>
            <div>
                <hr className="my-2" />
                <p className="lead">{numeral(year.songs[0].plays).format('0,0')} Plays</p>
                <p>{Computation.convertTime(year.songs[0].duration)}</p>
            </div>
        </div>
        return div;
    }

}


class TopYears extends Component {

    constructor(props) {
        super(props);
        this.state = {
            years: props.years
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ years: nextProps.years });
    }

    // background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://is4-ssl.mzstatic.com/image/thumb/Music49/v4/86/75/1c/86751c2f-2ad4-d00e-0b7f-02ba9f04b007/source/300x300bb.jpg');


    render() {

        var yearsBoxes = [];

        for (let index = 0; index < this.state.years.length; index++) {
            const year = this.state.years[index];
            const div = <YearBox year={year} key={year.key} />
            yearsBoxes.push(div);

        }

        return (<div className="years">{yearsBoxes}</div>);

    }

}

export default TopYears;