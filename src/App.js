import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



import Banner from "./components/Banner"
import Results from "./components/Results"

import Footer from './components/footer'

import ErrorBoundary from './components/ErrorBoundary';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

 

  render() {

    


    var appToLoad;

    if (this.state.data.length > 0) {
      appToLoad = <Results data={this.state.data} />;
    } else {
      appToLoad = <Banner dataResponseHandler={data => {
        this.setState({
          data: data
        })        
      }} />;
    }

    return (
      <div className="App">
        <ErrorBoundary>
          {appToLoad}
        </ErrorBoundary>
        <Footer/>
      </div>
      
    );
  }
}

export default App;
