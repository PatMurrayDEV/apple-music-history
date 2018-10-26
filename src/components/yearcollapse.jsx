import React, { Component } from 'react';
import { Button, Collapse } from 'reactstrap';
import numeral from 'numeral';
import Computation from "./Computation";


class YearCollapse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            year: props.year,
            collapse: false
        };
        this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ year: nextProps.year, collapse: this.state.collapse });
    }

    toggle() {
        this.setState({
            collapse: !this.state.collapse,
            year: this.state.year
        });
    }

    render() {

        var songsYearBox = [];
        for (let index = 0; index < 20; index++) {
            const element = this.state.year.value[index];

            var box = <div className="box reason" key={element.key}>
                <h3>{element.value.name}</h3>
                <h5>{element.value.artist}</h5>
                <p className="lead">{Computation.convertTime(element.value.time)} ({numeral(element.value.plays).format('0,0')} Plays)</p>
            </div>
            songsYearBox.push(box);

        }

        const div = <div className="box" key={this.state.year.key}>
            <div> <h1>{this.state.year.key} Top Songs <Button outline color="secondary" size="sm" onClick={this.toggle}>{this.state.collapse ? 'Close' : 'Open'}</Button></h1>  </div>
            <Collapse isOpen={this.state.collapse}>
                <div className="reasons"> {songsYearBox} </div>
            </Collapse>
        </div>

        return (div);

    }

}

export default YearCollapse;