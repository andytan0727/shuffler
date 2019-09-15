import { ReactComponent as PanelBtnIcon } from "assets/panelBtn.svg";
import classNames from "classnames";
import { SwitchPanelRadioBtn } from "components/Buttons";
import * as PanelComponent from "components/Panels";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { move } from "utils/helper/arrayHelper";

import { Fab } from "@material-ui/core";

import styles from "./styles.module.scss";

const _radios = ["radio-videolist", "radio-video", "radio-playing"];

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
 * Component for PlaylistInputPage. Used to display panel showing current status
 * of videos, playlists and playing
 *
 */
const InputTabs = () => {
  const [checkedButton, setCheckedButton] = useState("radio-playing");

  const handleChangePanel = useCallback((e: InputChangeEvent) => {
    setCheckedButton(e.target.value);
  }, []);

  const handleClickSwitchPanel = useCallback((e: OnClickEvent) => {
    const panel = e.currentTarget.getAttribute("data-panel");
    setCheckedButton(_radios[+panel!]);
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
        to="/panel"
      >
        <PanelBtnIcon className={styles.panelBtnIcon}>
          Panel svg - From Nline Web Fonts
        </PanelBtnIcon>
      </Fab>
    </div>
  );
};

export default InputTabs;
