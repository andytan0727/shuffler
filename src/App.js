import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PgFooter from "./pages/PgFooter";

import "./App.scss";

// lazy loading pages
const PgNavbar = lazy(() => import("./pages/PgNavbar"));
const MainPage = lazy(() => import("./pages/MainPage"));
const PlaylistInputPage = lazy(() => import("./pages/PlaylistInputPage"));
const YTPlayerPage = lazy(() => import("./pages/YTPlayerPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
// const PgFooter = lazy(() => import("./pages/PgFooter"));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Suspense fallback={<div>loading...</div>}>
            <div className="App-header">
              <PgNavbar />
            </div>
            <div className="App-main">
              <Switch>
                <Route path="/" exact component={MainPage} />
                <Route path="/player" component={YTPlayerPage} />
                <Route path="/playlistInput" component={PlaylistInputPage} />
                <Route path="/about" component={AboutPage} />
              </Switch>
            </div>
          </Suspense>
        </div>
        <div className="App-footer">
          <PgFooter />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
