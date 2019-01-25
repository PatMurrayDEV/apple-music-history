import React, { Component } from 'react';
import Computation from "./Computation";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';
import numeral from 'numeral';
import alasql from 'alasql';

class DayHeatMap extends Component {

    render() {

        const days = alasql(`SELECT date,  COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE excluded = false GROUP BY date ORDER BY SUM(duration) DESC`,[this.props.plays]);

        var heatmapData = [];
        var firstDay = new Date();
        var maxValue = 0;
        var lastDate = new Date('2015-05-01T01:00:00');
        for (let index = 0; index < days.length; index++) {
            const day = days[index];
            heatmapData.push({
                date: day.date,
                count: day.duration
            })
            if (day.duration > maxValue) {
                maxValue = day.duration
            }
            if (new Date(day.date) < firstDay) {
                firstDay = new Date(day.date)
            }
            if (new Date(day.date) > lastDate) {
                lastDate = new Date(day.date)
            }
        }



        var daysTodayCount = Math.round((lastDate - firstDay) / (1000 * 60 * 60 * 24))
        var dayswithoutmusic = daysTodayCount - days.length;

        return (
            <div className="box">
                <h3>Playing Time by Date</h3>
                <CalendarHeatmap
                    startDate={firstDay}
                    endDate={lastDate}
                    values={heatmapData}
                    showWeekdayLabels={true}
                    titleForValue={(value) => {
                        if (value && value.date != null) {
                            return `${Computation.convertTime(value.count)} on ${value.date}`
                        } else {
                            return ""
                        }

                    }}
                    tooltipDataAttrs={(value) => {
                        if (value && value.date != null) {
                            return { 'data-tip': `${Computation.convertTime(value.count)} on ${value.date}` }
                        } else {
                            return { 'data-tip': '' }
                        }

                    }}
                    classForValue={(value) => {
                        if (!value) {
                            return 'color-empty';
                        }
                        var number = Math.ceil((value.count / maxValue * 100) / 10) * 10
                        return `color-scale-${number}`;
                    }}
                />
                <ReactTooltip />
                <p>There were <strong>{numeral(dayswithoutmusic).format('0,0')}</strong> out of <strong>{numeral(daysTodayCount).format('0,0')}</strong> days you didn't listen to music.</p>
            </div>
        )
    }
}

export default DayHeatMap;