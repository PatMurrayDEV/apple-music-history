import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import alasql from 'alasql';


class QueryBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            query: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            result: alasql(this.state.query, [this.state.plays])
        });
    }

    handleSubmit(event) {
        this.setState({
            result: alasql(this.state.query, [this.props.plays])
        });
    }

    handleChange(event) {
        this.setState({ query: event.target.value });
    }



    render() {
        var string = JSON.stringify(this.state.result, null, 4);
        var b64String = btoa(unescape(encodeURIComponent(string)));
        var url = `data:text/plain;charset=utf-8;base64,${b64String}`;

        return (<div className="box">
            <h1>Query</h1>
            <h4>Most SQL commands work!</h4>
            <p>The table name is <code>?</code>, as in <code>SELECT * FROM ?</code>.</p>
            <h6>I <em>seriously</em> recommend putting a LIMIT on while playing around!</h6>
            <hr/>
            <input className="queryInput" type="text" name="query" value={this.state.query} onChange={this.handleChange} placeholder="SQL Query"/>
            <input type="submit" value="Run Query" onClick={this.handleSubmit}/>
            
            <ReactJson src={this.state.result} enableClipboard={false} displayDataTypes={false} name={false}/>

            <hr/>
            <a target="_blank" href={url} rel="noopener noreferrer">Get JSON for above result</a>

            <hr/>
            <h5>Try some of these:</h5>
            <ul>
                <li><h6>Top 5 Songs</h6><code>SELECT name, artist, COUNT(id) as plays, SUM(duration) as duration FROM ? GROUP BY name, artist ORDER BY SUM(duration) DESC LIMIT 5</code></li>
                <li><h6>First play on Apple Music</h6><code>SELECT * FROM ? LIMIT 1</code></li>
                <li><h6>Play stats by month</h6><code>SELECT SUM(duration) as total_milliseconds, COUNT(id) as total_plays, timeStamp->getMonth() as month, year FROM ? GROUP BY timeStamp->getMonth(), year</code></li>
                <li><h6>Total plays</h6><code>SELECT SUM(duration) as total_milliseconds, COUNT(id) as total_plays FROM ? </code></li>
                <li><h6>Top song per artist (using nested SELECTs!)</h6> <code>SELECT artist, FIRST(name) as top_song, FIRST(duration_sum) as top_song_duration, FIRST(plays) as top_song_plays, SUM(duration_sum) as total_duration, SUM(plays) as total_plays  FROM (     SELECT artist, name, SUM(duration) as duration_sum, COUNT(id) as plays FROM ? GROUP BY name, artist ORDER BY duration_sum DESC) GROUP BY artist ORDER BY total_duration DESC LIMIT 8</code></li>
                <li><h6>Top song per year</h6><code>SELECT * FROM (SELECT year, artist, name, SUM(duration) as duration_sum, COUNT(id) as plays FROM ? GROUP BY name, artist, year ORDER BY duration_sum DESC) GROUP BY year ORDER BY year ASC</code></li>
                <li><h6>Play duration by hour as an array</h6> <code>COLUMN OF SELECT SUM(duration) FROM ? GROUP BY timeStamp->getHours() ORDER BY hour</code></li>
             </ul>
        </div>);
    }

}

export default QueryBox;
