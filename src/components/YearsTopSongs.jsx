import React, { Component } from 'react';
import YearCollapse from './yearcollapse';
import alasql from 'alasql';

class YearsTopSongs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            years: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var years = alasql(`SELECT COUNT(id) as plays, SUM(duration) as duration, year FROM ? WHERE excluded = false GROUP BY year ORDER BY year ASC`,[nextProps.plays]);
        for (let index = 0; index < years.length; index++) {           
            years[index].songs = alasql(`SELECT name, artist, COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE year = ${years[index].year} AND excluded = false GROUP BY name, artist ORDER BY SUM(duration) DESC`,[nextProps.plays]);
        }
        return {
            years: years
        };
    }

    render() {

        var yearsBoxes2 = [];
        for (let index = 0; index < this.state.years.length; index++) {
            const year = this.state.years[index];
            yearsBoxes2.push(<YearCollapse year={year} key={year.year + "-full"} />);
        }



        return (yearsBoxes2);

    }

}

export default YearsTopSongs;