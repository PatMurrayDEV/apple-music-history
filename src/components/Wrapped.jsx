import React, { Component } from 'react';
import numeral from 'numeral';
import html2canvas from 'html2canvas';
import download from 'downloadjs';

class Wrapped extends Component {


    render() {

        var titleString = "My Music — " + this.props.year.year;

        var div = <div className="wrapped" id="annualwrapped">
        <h1 className="title">{titleString}</h1>
        <div className="wrapped-content">
            <div className="left">
                <h2 className="subtitle">I listened to</h2>
                <div className="number">{numeral(parseInt(this.props.year.totalTime) / 1000 / 60).format('0,0')}</div>
                <h3 className="small">minutes of music</h3>



            </div>
            <div className="right">
                <h2 className="subtitle">Top Artists</h2>
                <div className="item">{this.props.year.artists[0].key}</div>
                <div className="item">{this.props.year.artists[1].key}</div>
                <div className="item">{this.props.year.artists[2].key}</div>
                <div className="item">{this.props.year.artists[3].key}</div>
                <div className="item">{this.props.year.artists[4].key}</div>

                <h2 className="subtitle">Top Songs</h2>
                <div className="item">{this.props.songs.value[0].value.name} <span className="artist">— {this.props.songs.value[0].value.artist}</span></div>
                <div className="item">{this.props.songs.value[1].value.name} <span className="artist">— {this.props.songs.value[1].value.artist}</span></div>
                <div className="item">{this.props.songs.value[2].value.name} <span className="artist">— {this.props.songs.value[2].value.artist}</span></div>
                <div className="item">{this.props.songs.value[3].value.name} <span className="artist">— {this.props.songs.value[3].value.artist}</span></div>
                <div className="item">{this.props.songs.value[4].value.name} <span className="artist">— {this.props.songs.value[4].value.artist}</span></div>
            </div>
        </div>
        <h3 className="small link">music.patmurray.co</h3>

    </div>;

        

        return (
            <div className="box" style={{maxWidth: "calc(2em + 700px)"}}>
                {div}
                <div className="shareButton">
                    <button onClick={() => {

                        html2canvas(document.getElementById('annualwrapped')).then(canvas => {
                            var myImage = canvas.toDataURL("image/png");

                            download(myImage, 'mymusic.png', "image/png");
                            
                            // setTimeout(() => {
                            //     window.location.href = myImage;
                            // }, timeout);

                            
                        });

                        
                    }}>Share 'My {this.props.year.year} in Music'</button>
                </div>
            </div>
        );
    }
}

export default Wrapped;