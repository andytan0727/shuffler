import React, { Component } from "react";
import YoutubePlayerIFrame from "./components/YoutubePlayer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <YoutubePlayerIFrame />
      </div>
    );
  }
}

export default App;
