import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { selectPreferDarkTheme } from "store/userPreferences/selector";

import {
  MusicNote as MusicNoteIcon,
  PlayArrow as PlayArrowIcon,
  PlaylistPlay as PlaylistPlayIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface SwitchPanelRadioBtnGroupProps {
  checkedButton: string;
  handleChangePanel: (e: InputChangeEvent) => void;
}

const SwitchPanelRadioBtnGroup = (props: SwitchPanelRadioBtnGroupProps) => {
  const { checkedButton, handleChangePanel } = props;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);

  return (
    <div className={styles.switchPanelRadios}>
      <div className={styles.radioDiv}>
        <input
          id="playlistRadio"
          type="radio"
          name="playlist-panels"
          value="radio-videolist"
          className={classNames(styles.radioSelector, {
            [styles.radioSelectorLight]: !preferDarkTheme,
          })}
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
          className={classNames(styles.radioSelector, {
            [styles.radioSelectorLight]: !preferDarkTheme,
          })}
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
          className={classNames(styles.radioSelector, {
            [styles.radioSelectorLight]: !preferDarkTheme,
          })}
          checked={checkedButton === "radio-playing"}
          onChange={handleChangePanel}
        />
        <label htmlFor="playingRadio">
          <PlayArrowIcon />
        </label>
      </div>
    </div>
  );
};

export default SwitchPanelRadioBtnGroup;
