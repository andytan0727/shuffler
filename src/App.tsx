import React, { Suspense, lazy, useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import throttle from "lodash/throttle";
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
let initialTheme: boolean;

interface AppProps {
  preferDarkTheme: boolean;
  setPreferDarkTheme: (isPreferDarkTheme: boolean) => void;
}

const App = (props: AppProps) => {
  const { preferDarkTheme, setPreferDarkTheme } = props;
  const [scrolling, setScrolling] = useState(false);
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

  const setPreferDarkThemeShortcut = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && e.key === "d") {
      setPreferDarkTheme(!preferDarkTheme);
    }
  };

  useKeyDown(setPreferDarkThemeShortcut);

  // add background and blur to navbar if user scrolls down
  // to prevent transparent background
  const handleScroll = useCallback(() => {
    const offsetTop = window.pageYOffset;
    if (offsetTop > 0) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  }, []);

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 500);
    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [handleScroll]);

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

  useEffect(() => {
    import("./utils/helper/migrateStatesHelper").then((migrateStates) => {
      migrateStates.default();
    });
  }, []);

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
            <div
              className={classNames("App-header", {
                "App-header-scroll": scrolling,
              })}
            >
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

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
}: {
  userPreferences: { preferDarkTheme: boolean };
}) => ({
  preferDarkTheme,
});

export default connect(
  mapStatesToProps,
  {
    setPreferDarkTheme,
  }
)(App);
