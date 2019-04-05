import React, { Suspense, lazy } from "react";
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

const App = (props) => {
  const { preferDarkTheme, setPreferDarkTheme } = props;

  const theme = createMuiTheme({
    palette: {
      type: preferDarkTheme ? "dark" : "light",
      primary: { main: purple[800] },
      secondary: { main: purple["A200"] },
    },
    typography: {
      useNextVariants: true,
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
      setPreferDarkTheme({
        persist: true,
        isPreferDarkTheme: !preferDarkTheme,
      });
    }
  };

  useKeyDown(setPreferDarkThemeShortcut);

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
                <Route
                  path="/what-is-new"
                  render={(props) => (
                    <WhatIsNewPage
                      preferDarkTheme={preferDarkTheme}
                      {...props}
                    />
                  )}
                />
                <Route path="/playlistInput" component={PlaylistInputPage} />
                <Route exact path="/player" component={PlayerPage} />
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
