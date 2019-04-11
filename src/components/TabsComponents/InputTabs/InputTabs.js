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
  const [checkedButton, setCheckedButton] = useState("radio-videolist");

  const handleChangePanel = (e) => {
    setCheckedButton(e.target.value);
  };

  return (
    <div className={styles.inputTabsDiv}>
      <SwitchPanelRadioBtn
        checkedButton={checkedButton}
        handleChangePanel={handleChangePanel}
      />

      <div className={styles.playlistPanelsDiv}>
        <div
          className={classNames(styles.videolistPanel, {
            [styles.activePanel]: checkedButton === "radio-videolist",
            [styles.inactivePanel]: checkedButton !== "radio-videolist",
          })}
        >
          <VideoListPanel />
        </div>
        <div
          className={classNames(styles.videoPanel, {
            [styles.activePanel]: checkedButton === "radio-video",
            [styles.inactivePanel]: checkedButton !== "radio-video",
          })}
        >
          <VideosPanel />
        </div>
        <div
          className={classNames(styles.playingPanel, {
            [styles.activePanel]: checkedButton === "radio-playing",
            [styles.inactivePanel]: checkedButton !== "radio-playing",
          })}
        >
          <PlayingPanel />
        </div>
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
