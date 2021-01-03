import { ReactComponent as ShufflerTextLogo } from "assets/shufflerTextLogo.svg";
import { ToggleDarkModeSwitch } from "components/Switches";
import React, { Fragment, useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";

import { IconButton, useMediaQuery } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import SmallDisplayNavItems from "./SmallDisplayNavItems";
import styles from "./styles.module.scss";
import TopBarNavItems from "./TopBarNavItems";

const ShufflerTextLogoAnchor = () => {
  return (
    <NavLink to="/" className={styles.shufflerLogo}>
      <ShufflerTextLogo />
    </NavLink>
  );
};

const TopBar: React.FC = () => {
  const [show, setShow] = useState(false);
  const matchSmallDisplay = useMediaQuery("(max-width: 950px)");
  const transitions = useTransition(show, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  const location = useLocation();

  const handleToggleNavOverlay = useCallback((e: OnClickEvent) => {
    // prevent event being dispatched two times
    // from animated.div and from IconButton
    e.stopPropagation();

    setShow((prevShow) => !prevShow);
  }, []);

  return !/\/panel/gi.test(location.pathname) ? (
    <nav className={styles.nav}>
      <ShufflerTextLogoAnchor />

      {/* for large display */}
      {!matchSmallDisplay ? (
        <TopBarNavItems />
      ) : (
        <React.Fragment>
          <IconButton onClick={handleToggleNavOverlay}>
            <MenuIcon fontSize="default" />
          </IconButton>

          {/* overlay for screen smaller than large display */}
          {transitions.map(
            ({ item, key, props }) =>
              item && (
                <animated.div
                  className={styles.navOverlay}
                  key={key}
                  style={props}
                  onClick={handleToggleNavOverlay}
                >
                  <SmallDisplayNavItems
                    handleToggleNavOverlay={handleToggleNavOverlay}
                  />
                </animated.div>
              )
          )}
        </React.Fragment>
      )}

      <div
        style={{
          marginRight: "auto",
        }}
      ></div>
      <div className={styles.alwaysShownNavItems}>
        <ToggleDarkModeSwitch />
      </div>
    </nav>
  ) : (
    <Fragment />
  );
};

export default TopBar;
