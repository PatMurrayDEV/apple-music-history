import React, { Component } from 'react';
import jsonp from 'jsonp';
import Computation from "./Computation";


class TopSongBox extends Component {

    constructor() {
        super();
        this.state = {
            imageURL: "",
            searchURL: "",
        }
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

        var topSong = this.props.song;

        var style = { maxWidth: "calc(6em + 4 * 300px)", backgroundRepeat: 'no-repeat', backgroundPositionX: '100%', backgroundSize: 'contain' }

        if (this.state.imageURL.length > 0) {
            var imageURL = "url('"+this.state.imageURL+"')";
            style = { maxWidth: "calc(6em + 4 * 300px)", backgroundRepeat: 'no-repeat', backgroundPositionX: '100%', backgroundSize: 'contain', backgroundImage: imageURL };
        }

        var div = <div className="box" style={style}>
            <h3>Your most played song on Apple Music is</h3>
            <h1 className="display-3"><p>'{topSong.name}' by {topSong.artist}</p></h1>
            <p className="lead">You've played this <strong>{topSong.plays}</strong> times for a total of <strong>{Computation.convertTime(topSong.duration)}</strong>, skipping {Computation.convertTime(topSong.missedTime)}</p>
        </div>

        return div;
    }
}

export default TopSongBox;