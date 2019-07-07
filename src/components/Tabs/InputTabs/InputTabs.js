import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import { SwitchPanelRadioBtn } from "../../Buttons";
import * as PanelComponent from "../../Panels";
import { move } from "../../../utils/helper/arrayHelper";

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
 * Component for /playlistInput. Used to display panel showing current status
 * of videos, playlists and playing
 *
 * @param {{ preferDarkTheme: boolean; }} props
 * @returns
 */
const InputTabs = (props) => {
  const { preferDarkTheme } = props;
  const [checkedButton, setCheckedButton] = useState("radio-playing");

  const handleChangePanel = useCallback((e) => {
    setCheckedButton(e.target.value);
  }, []);

  const handleClickSwitchPanel = useCallback((e) => {
    const panel = e.currentTarget.getAttribute("data-panel");
    setCheckedButton(_radios[panel]);
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
              checkedButton !== panel.radio ? handleClickSwitchPanel : null
            }
          >
            <panel.Component />
          </div>
        ))}
      </div>
    </div>
  );
};

InputTabs.propTypes = {
  preferDarkTheme: PropTypes.bool.isRequired,
};

const mapStatesToProps = ({ userPreferences: { preferDarkTheme } }) => ({
  preferDarkTheme,
});

export default connect(
  mapStatesToProps,
  {}
)(InputTabs);
