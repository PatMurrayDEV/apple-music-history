
import React, { Component } from 'react';
import numeral from 'numeral';
import Computation from "./Computation";



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


    render() {

        var yearsBoxes = [];

        for (let index = 0; index < this.state.years.length; index++) {
            const year = this.state.years[index];
            const div = <div className="box year" key={year.key}>
                <div>
                    <h4>{year.key}</h4>
                    <h2>{year.value[0].value.name}</h2>
                    <h4>{year.value[0].value.artist}</h4>
                </div>
                <div>
                    <hr className="my-2" />
                    <p className="lead">{numeral(year.value[0].value.plays).format('0,0')} Plays</p>
                    <p>{Computation.convertTime(year.value[0].value.time)}</p>
                </div>
            </div>
            yearsBoxes.push(div);

        }

        return (<div className="years">{yearsBoxes}</div>);

    }

}

export default TopYears;