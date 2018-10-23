import React, { Component } from 'react';
import './App.css';
import CsvParse from '@vtex/react-csv-parse';
import numeral from 'numeral';
import 'react-table/react-table.css'
import ReactTable from "react-table";

var LineChart = require("react-chartjs").Line;





function convetrData(input) {
  var data = {
    labels: [],
    datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "#FB7E2A",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
      }
    ]
  }

  for (let index = 0; index < input.length; index++) {
    const element = input[index];

    data.labels.push(element.day);
    data.datasets[0].data.push(element.item.time / 1000 / 60 / 60);

  }

  return data;

}




function calculateTop(data) {

  var songs = {};
  var days = {};

  for (let index = 0; index < data.length; index++) {
    const play = data[index];

    if (play["Song Name"].length > 0) {
      const uniqueID = "'" + play["Song Name"] + "' by " + play["Artist Name"];

      if (play["Play Duration Milliseconds"] > 0 && (play["Event Type"] === "PLAY_END" || play["Event Type"] === "")) {

        if (songs[uniqueID] == null) {
          songs[uniqueID] = {
            plays: 0,
            time: 0
          };
        }

        songs[uniqueID].plays = songs[uniqueID].plays + 1;
        songs[uniqueID].time = Number(songs[uniqueID].time) + Number(play["Play Duration Milliseconds"]);


        var date = new Date(play["Event End Timestamp"]);
        var dayID = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

        if (days[dayID] == null) {
          days[dayID] = {
            plays: 0,
            time: 0
          };
        }

        days[dayID].plays = days[dayID].plays + 1;
        days[dayID].time = Number(days[dayID].time) + Number(play["Play Duration Milliseconds"]);

      }
    }



  }


  var result = [];
  for (var key in songs) {
    if (songs.hasOwnProperty(key)) {
      /* useful code here */
      result.push({
        song: key,
        item: songs[key]
      });

    }
  }

  var resultDays = [];
  for (var key2 in days) {
    if (days.hasOwnProperty(key2)) {
      /* useful code here */
      resultDays.push({
        day: key2,
        item: days[key2],

      });

    }
  }

  result = result.sort(function (a, b) {
    return b.item.plays - a.item.plays;
  });

  console.log(result);
  console.log(resultDays);

  return {
    songs: result,
    days: resultDays
  }
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { songs: [], days: [], data: []};
  }



  render() {

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


    var appToLoad;

    if (this.state.songs.length > 0) {

      var daysLi = [];

      for (let index = 0; index < this.state.days.length; index++) {
        const element = this.state.days[index];

        daysLi.push(<li>{element.day}: {element.item.plays} plays for {numeral(element.item.time / 1000).format('00:00:00')}</li>);

      }

      appToLoad = <div>
        <p>Most played song is {this.state.songs[0].song} ({this.state.songs[0].item.plays} times) for a total of {numeral(this.state.songs[0].item.time / 1000).format('00:00:00')}!</p>
        <LineChart data={convetrData(this.state.days)} width="10000" height="300" options={{ bezierCurve: true, bezierCurveTension: 0.8, pointDot: false }} />
        <ReactTable
          data={this.state.data}
        />
        {/* <ul>
          {daysLi}
        </ul> */}
      </div>;
    } else {
      appToLoad = <CsvParse
        keys={keys}
        onDataUploaded={data => {
          var results = calculateTop(data);

          console.log(data);

          this.setState({
            songs: results.songs,
            days: results.days,
            data: data
          });
        }}
        render={onChange => <input type="file" onChange={onChange} />}
      />;
    }

    return (
      <div className="App">
        {appToLoad}

      </div>
    );
  }
}

export default App;
