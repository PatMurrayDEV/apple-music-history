import React, { Component } from 'react';
import jsonp from 'jsonp';
import Computation from "./Computation";


class TopSongBox extends Component {

    constructor() {
        super();
        this.state = {
            imageURL: ""
        }
    }

    componentDidMount() {

        var searchTerm = this.props.song.value.name + " " + this.props.song.value.artist;

        if (this.state.currentSearch !== searchTerm) {

            setTimeout(() => {
                var url = "https://itunes.apple.com/search?term=" + this.props.song.value.name + " " + this.props.song.value.artist + "&country=US&media=music&entity=musicTrack"
                jsonp(url, null, (err, data) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log(data);
    
                        if (data.results.length > 0) {
                            this.setState({
                                imageURL: data.results[0].artworkUrl30.replace('30x30bb', '300x300bb')
                            })
                        }
    
                        
                    }
                });
            }, 0);
        }

        
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
            <h1 className="display-3"><p>{topSong.key}</p></h1>
            <p className="lead">You've played this <strong>{topSong.value.plays}</strong> times for a total of <strong>{Computation.convertTime(topSong.value.time)}</strong>, skipping {Computation.convertTime(topSong.value.missedTime)}</p>
        </div>

        return div;
    }
}

export default TopSongBox;