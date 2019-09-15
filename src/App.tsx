import "./App.scss";

import classNames from "classnames";
import throttle from "lodash/throttle";
import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { useKeyDown } from "utils/helper/keyboardShortcutHelper";
import { retryLazy } from "utils/helper/lazyImportHelper";
import { createShufflerMuiTheme } from "utils/helper/themeHelper";

import { MuiThemeProvider } from "@material-ui/core/styles";

import { setPreferDarkTheme } from "./store/userPreferences/action";

// lazy loading pages
const PgNavbar = lazy(() => retryLazy(() => import("./pages/PgNavbar")));
const PlaylistInputPage = lazy(() =>
  retryLazy(() => import("./pages/PlaylistInputPage"))
);
const PlayerPage = lazy(() => retryLazy(() => import("./pages/PlayerPage")));
const AboutPage = lazy(() => retryLazy(() => import("./pages/AboutPage")));

// use a variable to assign fixed value that won't change after every re-render
let initialTheme: boolean;

const App = () => {
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState(false);
  initialTheme = preferDarkTheme;

  const theme = createShufflerMuiTheme({
    palette: {
      type: preferDarkTheme ? "dark" : "light",
    },
  });

  const setPreferDarkThemeShortcut = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && e.key === "d") {
      dispatch(setPreferDarkTheme(!preferDarkTheme));
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
    dispatch(setPreferDarkTheme(initialTheme));
  }, [dispatch]);

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
                <Route path="/player" component={PlayerPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/" component={PlaylistInputPage} />
              </Switch>
            </div>
          </Suspense>
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

export default App;
