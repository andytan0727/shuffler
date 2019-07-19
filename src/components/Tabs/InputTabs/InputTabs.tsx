import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { SwitchPanelRadioBtn } from "components/Buttons";
import * as PanelComponent from "components/Panels";
import { AppState } from "store";
import { move } from "utils/helper/arrayHelper";

import styles from "./styles.module.scss";

interface ConnectedState {
  preferDarkTheme: boolean;
}

type InputTabsProps = ConnectedState;

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
 * Component for /playlistInput. Used to display panel showing current status
 * of videos, playlists and playing
 *
 */
const InputTabs = (props: InputTabsProps) => {
  const { preferDarkTheme } = props;
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
        preferDarkTheme={preferDarkTheme}
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
    </div>
  );
};

const mapStatesToProps = (state: AppState) => ({
  preferDarkTheme: state.userPreferences.preferDarkTheme,
});

export default connect(
  mapStatesToProps,
  {}
)(InputTabs);
