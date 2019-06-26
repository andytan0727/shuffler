import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTubeIFrame from "../../YouTubeIFrame";
import { PlayerBasicCtrlBtnGroup } from "../../../Buttons";

import styles from "./styles.module.scss";

const VideoPlayer = (props) => {
  const { listToPlay } = props;
  const ytPlayer = useRef(null);

  useEffect(() => {
    // fix exhaustive-deps rule of react-hooks
    // ensure ytPlayer.current points to the correct node in the cleanup function
    const ytPlayerRef = ytPlayer.current;

    return () => {
      // Destroy player when unmount
      ytPlayerRef.internalPlayer.destroy();
    };
  }, []);

  return (
    <React.Fragment>
      {listToPlay.length !== 0 && (
        <div className={styles.playerWrapper}>
          <YouTubeIFrame ref={ytPlayer} />
          <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayer} />
        </div>
      )}
    </React.Fragment>
  );
};

VideoPlayer.propTypes = {
  listToPlay: PropTypes.array,
};

const mapStateToProps = ({ ytplaylist: { listToPlay } }) => {
  return {
    listToPlay,
  };
};

export default connect(
  mapStateToProps,
  {}
)(VideoPlayer);
