import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import SwitchPanelRadioBtn from "../../ButtonComponents/SwitchPanelRadioBtn";
import VideoListPanel from "../../Panels/VideoListPanel";
import VideosPanel from "../../Panels/VideosPanel";
import PlayingPanel from "../../Panels/PlayingPanel/PlayingPanel";
import { move } from "../../../utils/helper/arrayHelper";

import styles from "./styles.module.scss";

const InputTabs = (props) => {
  const { preferDarkTheme } = props;
  const [checkedButton, setCheckedButton] = useState("radio-playing");
  const radios = ["radio-videolist", "radio-video", "radio-playing"];
  const panels = [
    {
      panelIdx: 0,
      class: classNames(styles.videolistPanel, {
        [styles.videolistPanelLight]: !preferDarkTheme,
      }),
      radio: "radio-videolist",
      Component: VideoListPanel,
    },
    {
      panelIdx: 1,
      class: classNames(styles.videoPanel, {
        [styles.videoPanelLight]: !preferDarkTheme,
      }),
      radio: "radio-video",
      Component: VideosPanel,
    },
    {
      panelIdx: 2,
      class: classNames(styles.playingPanel, {
        [styles.playingPanelLight]: !preferDarkTheme,
      }),
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
        preferDarkTheme={preferDarkTheme}
      />

      <div className={styles.playlistPanelsDiv}>
        {move(panels, radios.indexOf(checkedButton), 1).map((panel) => (
          <div
            key={panel.radio}
            className={classNames(panel.class, styles.inactivePanel, {
              [styles.currentInactive]: panel.radio === checkedButton,
            })}
            data-panel={panel.panelIdx}
            onClick={
              checkedButton !== panel.radio ? handleClickSwitchPanel : null
            }
          >
            <panel.Component />
          </div>
        ))}
        {panels
          .filter((panel) => panel.radio === checkedButton)
          .map((panel) => (
            <div
              key={panel.radio}
              className={classNames(panel.class, styles.activePanel)}
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
