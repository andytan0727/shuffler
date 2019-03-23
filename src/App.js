import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PlaylistInputPage from "./pages/PlaylistInputPage";
import YTPlayerPage from "./pages/YTPlayerPage";
import PgFooter from "./pages/PgFooter";

import "./App.scss";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/player" component={YTPlayerPage} />
            <Route path="/playlistInput" component={PlaylistInputPage} />
          </Switch>
          <PgFooter />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
