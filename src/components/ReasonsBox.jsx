import React, { Component } from 'react';
import { Button, Collapse } from 'reactstrap';
import numeral from 'numeral';


class ReasonsBox extends Component {

    

    constructor(props) {
        super(props);
        this.state = {
            reasons: props.reasons,
            collapse: false
        };
        this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ reasons: nextProps.reasons, collapse: this.state.collapse });
    }

    toggle() {
        this.setState({ 
            collapse: !this.state.collapse,
            reasons: this.state.reasons
         });
    }

    render() {

        var reasons = {
            "SCRUB_END": "Scrubbed to end of track",
            "MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM": "Selected another song",
            "PLAYBACK_MANUALLY_PAUSED": "Paused song",
            "FAILED_TO_LOAD": "Song failed to load",
            "TRACK_SKIPPED_FORWARDS": "Skipped to next track",
            "SCRUB_BEGIN": "Scrubbed to start of track",
            "NATURAL_END_OF_TRACK": "Song ended normally",
            "TRACK_SKIPPED_BACKWARDS": "Skipped to previous track",
            "NOT_APPLICABLE": "N/A",
            "PLAYBACK_STOPPED_DUE_TO_SESSION_TIMEOUT": "Session Timedout",
            "TRACK_BANNED": "Track was banned",
            "QUICK_PLAY": "Quick Play (whatever that is)",
            "": "No Idea?"
        };


        var reasonsBoxes = [];

        for (let index = 0; index < this.state.reasons.length; index++) {
            const element = this.state.reasons[index];
            if (element.key !== "" && element.key !== "QUICK_PLAY" && element.key !== "NOT_APPLICABLE") {
                var box2 = <div className="box reason" key={element.key}>
                    <h3>{reasons[element.key]}</h3>
                    <p className="lead">{numeral(element.value).format('0,0')} Times</p>
                </div>
                reasonsBoxes.push(box2);
            }
        }


        const div = <div className="box" key="reasons">
            <div> <h1>Reasons A Song Finished Playing <Button outline color="secondary" size="sm" onClick={this.toggle}>{this.state.collapse ? 'Close' : 'Open'}</Button></h1>  </div>
            <Collapse isOpen={this.state.collapse}>
                <div className="reasons"> {reasonsBoxes} </div>
            </Collapse>
        </div>


        return (div);

    }

}

export default ReasonsBox;