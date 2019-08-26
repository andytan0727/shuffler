import { ReactComponent as PanelBtnIcon } from "assets/panelBtn.svg";
import classNames from "classnames";
import { SwitchPanelRadioBtn } from "components/Buttons";
import * as PanelComponent from "components/Panels";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { move } from "utils/helper/arrayHelper";
import { getRootCssVariable } from "utils/helper/stylesHelper";

import { Fab } from "@material-ui/core";

import styles from "./styles.module.scss";

const _radios = ["radio-videolist", "radio-video", "radio-playing"];
const white = getRootCssVariable("--white-color-rgb");
const black = getRootCssVariable("--black-color-rgb");

const _tabPanels = [
  {
    panelIdx: 0,
    class: styles.videolistPanel,
    radio: "radio-videolist",
    Component: PanelComponent.VideoListPanel,
  },
  {
    panelIdx: 1,
    class: styles.videoPanel,
    radio: "radio-video",
    Component: PanelComponent.VideosPanel,
  },
  {
    panelIdx: 2,
    class: styles.playingPanel,
    radio: "radio-playing",
    Component: PanelComponent.PlayingPanel,
  },
];

/**
 * InputTabs
 *
 * Component for /playlistInput. Used to display panel showing current status
 * of videos, playlists and playing
 *
 */
const InputTabs = () => {
  const [checkedButton, setCheckedButton] = useState("radio-playing");
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const [showVisitPanelMsg, setShowVisitPanelMsg] = useState(false);

  const handleChangePanel = useCallback((e: InputChangeEvent) => {
    setCheckedButton(e.target.value);
  }, []);

  const handleClickSwitchPanel = useCallback((e: OnClickEvent) => {
    const panel = e.currentTarget.getAttribute("data-panel");
    setCheckedButton(_radios[+panel!]);
  }, []);

  // check if user visited /playlistInput/panel
  // show visit panel message if user has not visited
  useEffect(() => {
    const isUserVisitedPanel = !!localStorage.getItem("visited-panel");

    if (!isUserVisitedPanel) {
      setShowVisitPanelMsg(!isUserVisitedPanel);
    }
  }, []);

  return (
    <div className={styles.inputTabsDiv}>
      <SwitchPanelRadioBtn
        checkedButton={checkedButton}
        handleChangePanel={handleChangePanel}
      />

      <div className={styles.playlistPanelsDiv}>
        {move(_tabPanels, _radios.indexOf(checkedButton), 1).map((panel) => (
          <div
            key={panel.radio}
            className={classNames(panel.class, {
              [styles.inactivePanel]: panel.radio !== checkedButton,
              [styles.activePanel]: panel.radio === checkedButton,
            })}
            data-panel={panel.panelIdx}
            onClick={
              checkedButton !== panel.radio ? handleClickSwitchPanel : undefined
            }
          >
            <panel.Component />
          </div>
        ))}
      </div>
      <Fab
        className={styles.panelBtn}
        color="inherit"
        aria-label="change to lg panel"
        component={Link}
        to="/playlistInput/panel"
      >
        <PanelBtnIcon className={styles.panelBtnIcon}>
          Panel svg - From Nline Web Fonts
        </PanelBtnIcon>
      </Fab>

      {showVisitPanelMsg && (
        <div
          className={styles.arrow}
          style={{
            boxShadow: `0 11px 29px 0 rgba(${
              preferDarkTheme ? white : black
            }, 0.3)`,
          }}
        >
          <span>
            Try out our new panel{" "}
            <span role="img" aria-labelledby="rocket">
              🚀
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default InputTabs;
