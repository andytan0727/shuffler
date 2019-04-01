import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import VideoList from "../../components/ListComponents/VideoList";

import { setCurSongIdx } from "../../store/ytplayer/action";

import styles from "./styles.module.scss";

class CurrentPlaylistItem extends React.PureComponent {
  render() {
    const {
      // VideoList's props
      index,
      style,
      data,

      // Redux
      curSongIdx,
      setCurSongIdx,
    } = this.props;

    const handleChangeVideo = (e) => {
      setCurSongIdx(index);
    };

    return (
      <div
        className={styles.currentPlaylistItem}
        style={style}
        onClick={handleChangeVideo}
      >
        {index === curSongIdx && <PlayArrowIcon />}
        <img src={data[index].snippet.thumbnails.default.url} alt="thumbnail" />
        <span>{data[index].snippet.title}</span>
      </div>
    );
  }
}

const ConnectedPlaylistItem = connect(
  ({ ytplayer: { curSongIdx } }) => ({ curSongIdx }),
  {
    setCurSongIdx,
  }
)(CurrentPlaylistItem);

const PlayerPageList = (props) => {
  const {
    ytplaylist: { listToPlay },
    ytplayer: { curSongIdx },
  } = props;
  const [listItemWidth, setListItemWidth] = useState(window.innerWidth * 0.9);
  const matchesMobile = useMediaQuery("(max-width: 450px)");

  const setVideoItemSize = () => setListItemWidth(window.innerWidth * 0.9);

  useEffect(() => {
    window.addEventListener("resize", setVideoItemSize);
    return () => {
      window.removeEventListener("resize", setVideoItemSize);
    };
  }, []);

  return (
    <React.Fragment>
      <h3>
        <span role="img" aria-label="currently-playing">
          📻
        </span>
        &nbsp;Currently playing: {`${curSongIdx + 1}/${listToPlay.length}`}
      </h3>
      <VideoList
        items={listToPlay}
        width={matchesMobile ? listItemWidth : 400}
        height={window.innerHeight * 0.65}
      >
        {ConnectedPlaylistItem}
      </VideoList>
    </React.Fragment>
  );
};

ConnectedPlaylistItem.propTypes = {
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
