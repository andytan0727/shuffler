import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTubeIFrame from "../../YouTubeIFrame";
import PlayerBasicCtrlBtnGroup from "../../../Buttons/PlayerBasicCtrlBtnGroup";

import styles from "./styles.module.scss";

const VideoPlayer = (props) => {
  const { listToPlay } = props;
  const ytPlayer = useRef(null);

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
          <div>
            <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayer} />
          </div>
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
