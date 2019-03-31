import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import CsvParse from '@vtex/react-csv-parse';

const keys = [
    "Apple Id Number",
    "Event End Timestamp",
    "Event Received Timestamp",
    "Device Identifier",
    "Build Version",
    "Milliseconds Since Play",
    "Source Type",
    "Metrics Bucket Id",
    "Event Start Timestamp",
    "Feature Name",
    "Store Country Name",
    "Start Position In Milliseconds",
    "Play Duration Milliseconds",
    "End Position In Milliseconds",
    "Metrics Client Id",
    "Media Type",
    "End Reason Type",
    "Item Type",
    "Event Reason Hint Type",
    "Media Duration In Milliseconds",
    "Offline",
    "UTC Offset In Seconds",
    "Apple Music Subscription",
    "Client IP Address",
    "Content Provider",
    "Content Name",
    "Genre",
    "Artist Name",
    "Content Specific Type",
    "Original Title"
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

                            this.props.dataResponseHandler(data);
                            
                        }}
                        onError={err => {

                            alert('Error Occured\n\n' + err.reason + '\n\n Please contact @_patmurray on twitter for more help.')

                        }}
                        render={onChange => <div><input id="file" name="file" className="inputfile" type="file" onChange={onChange} /><p>Loading may take a moment... be patient</p></div>}
                    />
                    
                </Jumbotron>

                <div className="box">
                    <h3>Where is the file?</h3>

                    <p>After downloading it from the privacy portal (<a href="https://privacy.apple.com">privacy.apple.com</a>). The file is at:</p>
                    <pre>App Store, iTunes Store, iBooks Store and Apple Music/App_Store_iTunes_Store_iBooks_Store_Apple_Music/Apple Music Activity/Apple Music Play Activity.csv</pre>
                    <p><a href="https://www.macrumors.com/2018/11/29/web-app-apple-music-history/">Follow this tutorial from MacRumors for more detailed instructions.</a></p>
                    <a href="/step1.png"><img style={{ width: '300px' }} src={"/step1.png"} alt="" /></a>
                    <a href="/step2.png"><img style={{ width: '300px' }} src={"/step2.png"} alt="" /></a>
                    <a href="/step3.png"><img style={{ width: '300px' }} src={"/step3.png"} alt="" /></a>
                </div>

                <div className="box">
                    <h3>Example Screenshots</h3>
                    <a href="/image2.png"><img style={{ width: '300px' }} src={"/image2.png"} alt="" /></a>
                    <a href="/image1.png"><img style={{ width: '300px' }} src={"/image1.png"} alt="" /></a>
                    <a href="/image3.png"><img style={{ width: '300px' }} src={"/image3.png"} alt="" /></a>
                </div>


            </div>
        );

    }
}

export default Banner;
