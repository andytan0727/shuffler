import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Components
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import { VideoList } from "../../../components/Lists";
import { setCurSongIdx } from "../../../store/ytplayer/action";

import styles from "./styles.module.scss";

let matchesMobile;

class CurrentPlaylistItem extends React.PureComponent {
  render() {
    const {
      // VideoList's props
      index,
      style,
      data,

      // Redux
      preferDarkTheme,
      curSongIdx,
      setCurSongIdx,
    } = this.props;

    const handleChangeVideo = (e) => {
      setCurSongIdx(index);
    };

    return (
      <div
        className={classNames(styles.currentPlaylistItem, {
          [styles.dark]: preferDarkTheme,
        })}
        style={style}
        onClick={handleChangeVideo}
      >
        {!matchesMobile && (
          <React.Fragment>
            {index === curSongIdx && <PlayArrowIcon />}
            <img
              src={data[index].snippet.thumbnails.default.url}
              alt="thumbnail"
            />
          </React.Fragment>
        )}
        <span>{data[index].snippet.title}</span>
      </div>
    );
  }
}

const ConnectedPlaylistItem = connect(
  ({ userPreferences: { preferDarkTheme }, ytplayer: { curSongIdx } }) => ({
    preferDarkTheme,
    curSongIdx,
  }),
  {
    setCurSongIdx,
  }
)(CurrentPlaylistItem);

const PlayerPageList = (props) => {
  const {
    ytplaylist: { listToPlay },
    ytplayer: { curSongIdx },
  } = props;
  const listRef = useRef(null);
  matchesMobile = useMediaQuery("(max-width: 450px)");

  useEffect(() => {
    // scroll to current song in playing list
    if (listRef.current) {
      listRef.current.scrollToItem(curSongIdx, "center");
    }
  }, [curSongIdx]);

  return (
    <React.Fragment>
      <h3>
        <span role="img" aria-label="currently-playing">
          📻
        </span>
        &nbsp;Currently playing: {`${curSongIdx + 1}/${listToPlay.length}`}
      </h3>
      {matchesMobile ? (
        <VideoList
          ref={listRef}
          items={listToPlay}
          width={250}
          height={window.innerHeight * 0.65}
          isMobile
        >
          {ConnectedPlaylistItem}
        </VideoList>
      ) : (
        <VideoList
          ref={listRef}
          items={listToPlay}
          width={400}
          height={window.innerHeight * 0.65}
        >
          {ConnectedPlaylistItem}
        </VideoList>
      )}
    </React.Fragment>
  );
};

ConnectedPlaylistItem.propTypes = {
  preferDarkTheme: PropTypes.bool,
  index: PropTypes.number.isRequired,
  style: PropTypes.object,
  data: PropTypes.array,
  curSongIdx: PropTypes.number,
  setCurSongIdx: PropTypes.func,
};

PlayerPageList.propTypes = {
  ytplaylist: PropTypes.object.isRequired,
  ytplayer: PropTypes.object.isRequired,
};

const mapStateToProps = ({ ytplaylist, ytplayer }) => ({
  ytplaylist,
  ytplayer,
});

export default connect(mapStateToProps)(PlayerPageList);
