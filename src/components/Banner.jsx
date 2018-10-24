import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import Computation from "./Computation"
import CsvParse from '@vtex/react-csv-parse';

const keys = [
    "Event Start Timestamp",
    "Event End Timestamp",
    "Song Name",
    "Artist Name",
    "Container Name",
    "Event Received Timestamp",
    "Play Duration Milliseconds",
    "Media Duration In Milliseconds",
    "End Position In Milliseconds",
    "End Reason Type",
    "Apple Id Number",
    "Device Identifier",
    "Metrics Client Id",
    "Metrics Bucket Id",
    "Client IP Address",
    "Feature Name",
    "Media Type",
    "Milliseconds Since Play",
    "Offline",
    "Apple Music Subscription",
    "Source Type",
    "Start Position In Milliseconds",
    "Item Type",
    "UTC Offset In Seconds",
    "Event Type",
    "Event Reason Hint Type",
    "Build Version",
    "Store Country Name",
];

class Banner extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: false };
    }



    render() {

        return (
            <div>
                <Jumbotron>
                    <h1 className="display-3">Apple Music Analyser</h1>
                    <p className="lead">Open your <em>Apple Music Play Activity.csv</em> file below to generate your report.</p>
                    <hr className="my-2" />
                    <p>No data ever leaves your computer and all computation is done in the browser.</p>
                    <CsvParse

                        keys={keys}
                        onDataUploaded={data => {

                            this.setState({
                                loading: true
                            })

                            var results = Computation.calculateTop(data, []);
                            this.props.dataResponseHandler({
                                songs: results.songs,
                                days: results.days,
                                months: results.months,
                                reasons: results.reasons,
                                data: data,
                                years: results.years,
                                artists: results.artists,
                                totals: results.totals,
                                filteredSongs: results.filteredSongs,
                                excludedSongs: results.excludedSongs
                            });
                        }}
                        render={onChange => <div><input id="file" name="file" className="inputfile" type="file" onChange={onChange} /><label htmlFor="file"><Button outline color="dark">Choose a file</Button> </label></div>}
                    />

                </Jumbotron>

                <div className="box">
                    <h3>Where is the file?</h3>

                    <p>After downloading it from the privacy portal (<a href="https://privacy.apple.com">privacy.apple.com</a>). The file is at <pre>App Store, iTunes Store, iBooks Store and Apple Music/App_Store_iTunes_Store_iBooks_Store_Apple_Music/Apple Music Activity/Apple Music Play Activity.csv</pre></p>
                    <a href="/step1.png"><img style={{ width: '300px' }} src={"/step1.png"} alt="" /></a>
                    <a href="/step2.png"><img style={{ width: '300px' }} src={"/step2.png"} alt="" /></a>
                    <a href="/step3.png"><img style={{ width: '300px' }} src={"/step3.png"} alt="" /></a>
                </div>

                <div className="box">
                    <h3>Example Screenshots</h3>
                    <a href="/image2.png"><img style={{ width: '300px' }} src={"/image2.png"} alt="" /></a>
                    <a href="/image1.png"><img style={{ width: '300px' }} src={"/image1.png"} alt="" /></a>
                </div>


            </div>
        );

    }
}

export default Banner;