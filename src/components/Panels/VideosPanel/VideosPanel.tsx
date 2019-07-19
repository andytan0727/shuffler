import React, { useCallback } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { Checkbox } from "@material-ui/core";
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
  MusicVideo as MusicVideoIcon,
} from "@material-ui/icons";
import { makeSearchInput } from "components/Inputs";
import { VideosPanelBtnGroup } from "components/Buttons";
import { AppState } from "store";
import { DeepROYtPlaylistState } from "store/ytplaylist/types";
import { setCheckedVideosAction } from "store/ytplaylist/action";
import { addOrRemove } from "utils/helper/arrayHelper";

import styles from "./styles.module.scss";

interface VideosPanelConnectedState {
  ytplaylist: DeepROYtPlaylistState;
}

interface VideosPanelConnectedDispatch {
  setCheckedVideosAction: typeof setCheckedVideosAction;
}

type VideosPanel = VideosPanelConnectedState & VideosPanelConnectedDispatch;

const SearchVideoInput = makeSearchInput("videos");

const VideosPanel = (props: VideosPanel) => {
  const {
    ytplaylist: { videos, checkedVideos, playingVideos },
    setCheckedVideosAction,
  } = props;

  const handleCheckVideos = useCallback(
    (id) => (e: InputChangeEvent | OnClickEvent) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setCheckedVideosAction(addOrRemove(checkedVideos as string[], id));
    },
    [checkedVideos, setCheckedVideosAction]
  );

  return (
    <React.Fragment>
      <div className={styles.videosPanelDiv}>
        <SearchVideoInput />
        <div className={styles.videos}>
          {videos.length !== 0 ? (
            videos.map((video) => (
              <React.Fragment key={video.id}>
                <div
                  className={classNames(styles.videosItem, {
                    [styles.checkedVideos]: checkedVideos.includes(video.id),
                  })}
                  onClick={handleCheckVideos(video.id)}
                >
                  <div>
                    <Checkbox
                      className={styles.checkBox}
                      checked={checkedVideos.includes(video.id)}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      onChange={handleCheckVideos(video.id)}
                    />
                    <span>{video.items[0].snippet.title}</span>
                    {playingVideos.includes(video.id) && <MusicVideoIcon />}
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div>
              <h3
                style={{
                  textAlign: "center",
                }}
              >
                No Video Found
              </h3>
            </div>
          )}
        </div>

        <VideosPanelBtnGroup />
      </div>
    </React.Fragment>
  );
};

const mapStatesToVideosPanelProps = ({ ytplaylist }: AppState) => ({
  ytplaylist,
});

export default connect(
  mapStatesToVideosPanelProps,
  {
    setCheckedVideosAction,
  }
)(VideosPanel);
