import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import Banner from "./components/Banner"
import Results from "./components/Results"





class App extends Component {

  constructor(props) {
    super(props);
    this.state = { songs: [], days: [], data: [], months: [], reasons: {}, years: [], totals: {}, artists: [], filteredSongs: [], excludedSongs: [] };
  }



  render() {

    


    var appToLoad;

    if (this.state.songs.length > 0) {
      appToLoad = <Results data={this.state} />;
    } else {
      appToLoad = <Banner dataResponseHandler={data => this.setState(data)} />;
    }

    return (
      <div className="App">
        {appToLoad}

      </div>
    );
  }
}

export default App;
