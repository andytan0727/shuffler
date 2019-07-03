import React, { Suspense, lazy, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { setPreferDarkTheme } from "./store/userPreferences/action";
import { useKeyDown } from "./utils/helper/keyboardShortcutHelper";
import { retryLazy } from "./utils/helper/lazyImportHelper";

// MUI styles
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

import "./App.scss";

// lazy loading pages
const PgNavbar = lazy(() => retryLazy(() => import("./pages/PgNavbar")));
const MainPage = lazy(() => retryLazy(() => import("./pages/MainPage")));
const PlaylistInputPage = lazy(() =>
  retryLazy(() => import("./pages/PlaylistInputPage"))
);
const PlayerPage = lazy(() => retryLazy(() => import("./pages/PlayerPage")));
const WhatIsNewPage = lazy(() =>
  retryLazy(() => import("./pages/WhatIsNewPage"))
);
const AboutPage = lazy(() => retryLazy(() => import("./pages/AboutPage")));

// use a variable to assign fixed value that won't change after every re-render
/** @type {boolean} */
let initialTheme;

/**
 * @typedef AppProps
 * @property {boolean} preferDarkTheme
 * @property {function(boolean):void} setPreferDarkTheme
 */

/**
 *
 * @param {AppProps} props
 * @returns
 */
const App = (props) => {
  const { preferDarkTheme, setPreferDarkTheme } = props;
  initialTheme = preferDarkTheme;

  const theme = createMuiTheme({
    palette: {
      type: preferDarkTheme ? "dark" : "light",
      primary: { main: purple[800] },
      secondary: { main: purple["A200"] },
      background: {
        // @ts-ignore
        black: "#1a1a1a",
        blackLight: "#4e4b53",
        lightGrey: "#2a2a2a",
        darkGrey: "#282828",
        blackDark: "#0d0d0d",
        softBlack: "#414a4c",
      },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Roboto",
        '"Segoe UI"',
        '"Helvetica Neue"',
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "sans-serif",
      ].join(","),
    },
  });

  const setPreferDarkThemeShortcut = (e) => {
    if (e.ctrlKey && e.altKey && e.key === "d") {
      setPreferDarkTheme(!preferDarkTheme);
    }
  };

  useKeyDown(setPreferDarkThemeShortcut);

  useEffect(() => {
    // add dark class to body when preferDarkTheme
    // primarily use for applying scrollbar styles on body
    if (preferDarkTheme) {
      if (document.body.className.indexOf("dark") === -1)
        document.body.className += " dark";
    } else {
      document.body.className = "";
    }
  }, [preferDarkTheme]);

  useEffect(() => {
    // load saved theme on startup
    setPreferDarkTheme(initialTheme);
  }, [setPreferDarkTheme]);

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <div
          className={classNames(
            "App",
            {
              dark: preferDarkTheme,
            },
            {
              transition: !preferDarkTheme,
            }
          )}
        >
          <Suspense fallback={<div>loading...</div>}>
            <div className="App-header">
              <PgNavbar />
            </div>
            <div className="App-main">
              <Switch>
                <Route
                  path="/"
                  exact
                  render={(props) => (
                    <MainPage preferDarkTheme={preferDarkTheme} {...props} />
                  )}
                />
                <Route path="/what-is-new" component={WhatIsNewPage} />
                <Route path="/playlistInput" component={PlaylistInputPage} />
                <Route path="/player" component={PlayerPage} />
                <Route path="/about" component={AboutPage} />
                <Redirect to="/" />
              </Switch>
            </div>
          </Suspense>
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

App.propTypes = {
  preferDarkTheme: PropTypes.bool.isRequired,
  setPreferDarkTheme: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ userPreferences: { preferDarkTheme } }) => ({
  preferDarkTheme,
});

export default connect(
  mapStatesToProps,
  {
    setPreferDarkTheme,
  }
)(App);
