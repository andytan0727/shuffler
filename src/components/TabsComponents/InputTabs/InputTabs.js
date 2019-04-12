import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import SwitchPanelRadioBtn from "../../ButtonComponents/SwitchPanelRadioBtn";
import VideoListPanel from "../../Panels/VideoListPanel";
import VideosPanel from "../../Panels/VideosPanel";
import PlayingPanel from "../../Panels/PlayingPanel/PlayingPanel";

import styles from "./styles.module.scss";

const InputTabs = (props) => {
  const [curPanel, setCurPanel] = useState(0);
  const [checkedButton, setCheckedButton] = useState("radio-videolist");
  const radios = ["radio-videolist", "radio-video", "radio-playing"];
  const panels = [
    {
      panelIdx: 0,
      class: styles.videolistPanel,
      radio: "radio-videolist",
      Component: VideoListPanel,
    },
    {
      panelIdx: 1,
      class: styles.videoPanel,
      radio: "radio-video",
      Component: VideosPanel,
    },
    {
      panelIdx: 2,
      class: styles.playingPanel,
      radio: "radio-playing",
      Component: PlayingPanel,
    },
  ];

  const handleChangePanel = (e) => {
    setCheckedButton(e.target.value);
  };

  const handleClickSwitchPanel = (e) => {
    const panel = e.currentTarget.getAttribute("data-panel");
    setCheckedButton(radios[panel]);
  };

  return (
    <div className={styles.inputTabsDiv}>
      <SwitchPanelRadioBtn
        checkedButton={checkedButton}
        handleChangePanel={handleChangePanel}
      />

      <div className={styles.playlistPanelsDiv}>
        {panels.map((panel) => (
          <div
            className={classNames(panel.class, {
              [styles.activePanel]: checkedButton === panel.radio,
              [styles.inactivePanel]: checkedButton !== panel.radio,
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
