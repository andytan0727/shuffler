import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { DeepReadonly } from "utility-types";
import { useMediaQuery } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { VideoList } from "components/Lists";
import { AppState } from "store";
import { selectListToPlay } from "store/ytplaylist/selector";
import { setCurSongIdx } from "store/ytplayer/action";
import { PlaylistItem, VideoItem } from "store/ytplaylist/types";

import styles from "./styles.module.scss";

interface CurrentPlaylistItemOwnProps {
  index: number;
  style: any;
  data: any;
}

interface CurrentPlaylistItemConnectedState {
  preferDarkTheme: boolean;
  curSongIdx: number;
}

interface CurrentPlaylistItemConnectedDispatch {
  setCurSongIdx: typeof setCurSongIdx;
}

type CurrentPlaylistItemProps = CurrentPlaylistItemOwnProps &
  CurrentPlaylistItemConnectedState &
  CurrentPlaylistItemConnectedDispatch;

interface PlayerPageListConnectedState {
  listToPlay: DeepReadonly<(PlaylistItem | VideoItem)[]>;
  curSongIdx: number;
}

type PlayerPageListProps = PlayerPageListConnectedState;

let matchesMobile: boolean;

class CurrentPlaylistItem extends React.PureComponent<
  CurrentPlaylistItemProps,
  {}
> {
  public render() {
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

    const handleChangeVideo = () => {
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
  ({
    userPreferences: { preferDarkTheme },
    ytplayer: { curSongIdx },
  }: AppState) => ({
    preferDarkTheme,
    curSongIdx,
  }),
  {
    setCurSongIdx,
  }
)(CurrentPlaylistItem);

const PlayerPageList = (props: PlayerPageListProps) => {
  const { listToPlay, curSongIdx } = props;
  const listRef = useRef<any>(null);
  matchesMobile = useMediaQuery("(max-width: 450px)");

  useEffect(() => {
    const currentListRef = listRef.current;
    // scroll to current song in playing list
    if (currentListRef) {
      currentListRef.scrollToItem(curSongIdx, "center");
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
        <React.Fragment>
          {/* 
           // @ts-ignore */}
          <VideoList
            ref={listRef}
            items={listToPlay}
            width={250}
            height={window.innerHeight * 0.65}
            isMobile
          >
            {ConnectedPlaylistItem}
          </VideoList>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* 
           // @ts-ignore */}
          <VideoList
            ref={listRef}
            items={listToPlay}
            width={400}
            height={window.innerHeight * 0.65}
          >
            {ConnectedPlaylistItem}
          </VideoList>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  listToPlay: selectListToPlay(state),
  curSongIdx: state.ytplayer.curSongIdx,
});

export default connect(mapStateToProps)(PlayerPageList);