import React, { Component } from 'react';
import { Jumbotron, Alert } from 'reactstrap';
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

class Loader extends Component {
    render() {
        if (this.props.loading) {
            return <span>Loading</span>
        } else {
            return <span></span>
        }
    }
}

class Banner extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: false };
    }



    render() {

        return (
            <div>
                <Jumbotron>
                    <h1 className="display-3">Apple Music Report</h1>
                    <p className="lead">Open your <em>Apple Music Play Activity.csv</em> file below to generate your report.</p>
                    <hr className="my-2" />
                    <p>No data ever leaves your computer and all computation is done in the browser. <a href="/how">Don't have your activity csv?</a></p>
                    <Alert color="info">
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
                            render={onChange => <input type="file" onChange={onChange} />}
                        />
                        <Loader loading={this.state.loading}/>
                    </Alert>
                </Jumbotron>

            </div>
        );

    }
}

export default Banner;