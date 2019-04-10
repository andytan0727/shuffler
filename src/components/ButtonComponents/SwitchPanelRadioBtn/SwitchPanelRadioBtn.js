import React from "react";
import PropTypes from "prop-types";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import styles from "./styles.module.scss";

const SwitchPanelRadioBtn = (props) => {
  const { checkedButton, handleChangePanel } = props;

  return (
    <div className={styles.switchPanelRadio}>
      <div className={styles.radioDiv}>
        <input
          id="playlistRadio"
          type="radio"
          name="playlist-panels"
          value="radio-videolist"
          className={styles.radioSelector}
          checked={checkedButton === "radio-videolist"}
          onChange={handleChangePanel}
        />
        <label htmlFor="playlistRadio">
          <PlaylistPlayIcon />
        </label>
      </div>

      <div className={styles.radioDiv}>
        <input
          id="videoRadio"
          type="radio"
          name="playlist-panels"
          value="radio-video"
          className={styles.radioSelector}
          checked={checkedButton === "radio-video"}
          onChange={handleChangePanel}
        />
        <label htmlFor="videoRadio">
          <MusicNoteIcon />
        </label>
      </div>

      <div className={styles.radioDiv}>
        <input
          id="playingRadio"
          type="radio"
          name="playlist-panels"
          value="radio-playing"
          className={styles.radioSelector}
          checked={checkedButton === "radio-playing"}
          onChange={handleChangePanel}
        />
        <label htmlFor="playingRadio" className="tab-label-3">
          <PlayArrowIcon />
        </label>
      </div>
    </div>
  );
};

SwitchPanelRadioBtn.propTypes = {
  checkedButton: PropTypes.string.isRequired,
  handleChangePanel: PropTypes.func.isRequired,
};

export default SwitchPanelRadioBtn;
