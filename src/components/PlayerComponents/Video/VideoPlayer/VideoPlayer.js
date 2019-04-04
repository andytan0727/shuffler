import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import LoopIcon from "@material-ui/icons/Loop";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { useKeyDown } from "../../../../utils/helper/keyboardShortcutHelper";
import YouTubeIFrame from "../../YouTubeIFrame";
import PlayerBasicCtrlBtnGroup from "../../../ButtonComponents/PlayerBasicCtrlBtnGroup";
import { shufflePlaylist } from "../../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const VideoPlayer = (props) => {
  const { listToPlay, shufflePlaylist } = props;
  const ytPlayer = useRef(null);

  const handleShufflePlaylist = () => {
    shufflePlaylist();
  };

  const playerKeyboardShortcuts = async (e) => {
    // ctrl+alt+s (shuffle playing list)
    if (e.ctrlKey && e.altKey && e.key === "s") {
      handleShufflePlaylist();
    }
  };

  // handle keyboard shortcuts for controlling player
  useKeyDown(playerKeyboardShortcuts);

  useEffect(() => {
    return () => {
      // Destroy player when unmount
      ytPlayer.current.internalPlayer.destroy();
    };
  }, []);

  return (
    <React.Fragment>
      {listToPlay.length !== 0 && (
        <div className={styles.playerWrapper}>
          <YouTubeIFrame ref={ytPlayer} />
          <div className={styles.ctrlBtnGroup}>
            <IconButton aria-label="Loop" onClick={() => console.log("loop")}>
              <LoopIcon />
            </IconButton>
            <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayer} />
            <IconButton aria-label="Shuffle" onClick={handleShufflePlaylist}>
              <ShuffleIcon />
            </IconButton>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

VideoPlayer.propTypes = {
  listToPlay: PropTypes.array,
  shufflePlaylist: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ytplaylist: { listToPlay } }) => {
  return {
    listToPlay,
  };
};

export default connect(
  mapStateToProps,
  {
    shufflePlaylist,
  }
)(VideoPlayer);
