import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "./components/pages/MainPage";
import YTPlayerPage from "./components/pages/YTPlayerPage";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/player" component={YTPlayerPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
