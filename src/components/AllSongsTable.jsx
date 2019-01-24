import React, { Component } from 'react';
import numeral from 'numeral';
import 'react-table/react-table.css';
import ReactTable from "react-table";
import matchSorter from 'match-sorter';

class AllSongsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            songs: props.songs,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ songs: nextProps.songs});
    }


    addExcluded(row) {
        this.props.addExcluded(row)
    }

    render() {

        var table = <ReactTable
            data={this.state.songs}
            filterable
            defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
            columns={[
                {
                    Header: "Song",
                    columns: [
                        {
                            Header: "Name",
                            id: "name",
                            accessor: d => d.name,
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name"] }),
                            filterAll: true
                        },
                        {
                            Header: "Artist",
                            id: "artist",
                            accessor: d => d.artist,
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["artist"] }),
                            filterAll: true
                        }
                    ]
                },
                {
                    Header: "Info",
                    columns: [
                        {
                            Header: "Plays",
                            id: "plays",
                            accessor: d => d.plays,
                            filterable: false
                        },
                        {
                            Header: "Listened Time",
                            id: "time",
                            accessor: d => d.duration,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            ),
                            filterable: false
                        },
                        {
                            Header: "Skipped Time",
                            id: "missedTime",
                            accessor: d => d.missedTime,
                            Cell: row => (
                                <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                            ),
                            filterable: false
                        }
                    ]
                },
                {
                    Header: "Report",
                    columns: [
                        {
                            Header: "Exclude",
                            id: "exclude",
                            accessor: d => d.excluded,
                            Cell: d => (
                                <div><input
                                    name="isExcluded"
                                    type="checkbox"
                                    checked={d.value}
                                    onChange={e => {
                                        this.addExcluded(d);
                                    }} /></div>
                            ),
                            filterable: false
                        }
                    ]
                }
            ]
            }
            defaultPageSize={100}
            style={{
                height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
        />


        return (table);

    }

}

export default AllSongsTable;