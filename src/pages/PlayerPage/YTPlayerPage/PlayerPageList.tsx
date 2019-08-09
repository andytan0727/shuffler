import classNames from "classnames";
import { VideoList } from "components/Lists";
import React, { useEffect, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { AppState } from "store";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/normSelector";
import { ListToPlaySnippets } from "store/ytplaylist/types";

import { useMediaQuery } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import styles from "./styles.module.scss";

interface CurrentPlaylistItemOwnProps {
  index: number;
  style: any;
  data: ListToPlaySnippets;
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
      data: snippets,

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
            {snippets[index].thumbnails ? (
              <img
                className={styles.thumbnail}
                src={snippets[index].thumbnails!.default.url}
                alt="thumbnail"
              />
            ) : (
              <div className={styles.deletedVideoThumbnail}></div>
            )}
          </React.Fragment>
        )}
        <span className={styles.playlistItemVideoTitle}>
          {snippets[index].title}
        </span>
      </div>
    );
  }
}

const ConnectedPlaylistItem = connect(
  (state: AppState) => ({
    preferDarkTheme: selectPreferDarkTheme(state),
    curSongIdx: state.ytplayer.curSongIdx,
  }),
  {
    setCurSongIdx,
  }
)(CurrentPlaylistItem);

const PlayerPageList = (props: PlayerPageListProps) => {
  const { curSongIdx } = props;
  const listRef = useRef<any>(null);
  matchesMobile = useMediaQuery("(max-width: 450px)");
  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);

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
        &nbsp;Currently playing:{" "}
        {`${curSongIdx + 1}/${listToPlaySnippets.length}`}
      </h3>

      {matchesMobile ? (
        <React.Fragment>
          <VideoList
            ref={listRef}
            items={listToPlaySnippets}
            width={250}
            height={window.innerHeight * 0.65}
            isMobile
          >
            {ConnectedPlaylistItem}
          </VideoList>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <VideoList
            ref={listRef}
            items={listToPlaySnippets}
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
  curSongIdx: state.ytplayer.curSongIdx,
});

export default connect(mapStateToProps)(PlayerPageList);
