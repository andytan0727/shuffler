import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Components
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";

import { SearchInput, SearchVideoInput } from "../../Inputs";
import { VideosPanelBtnGroup } from "../../Buttons";

import { setCheckedVideosAction } from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const VideosPanel = (props) => {
  const {
    ytplaylist: { videos, checkedVideos, playingVideos },
    setCheckedVideosAction,
  } = props;

  const _checkVideos = (videoId) => {
    const currentIndex = checkedVideos.indexOf(videoId);
    const newSelected = [...checkedVideos];

    if (currentIndex === -1) {
      newSelected.push(videoId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setCheckedVideosAction(newSelected);
  };

  const handleCheckVideos = (e) => {
    const selectedVideosId = e.target.value;
    _checkVideos(selectedVideosId);
  };

  const handleSelectVideoItem = (e) => {
    const selectedVideoId = e.currentTarget.getAttribute("data-videoid");
    const currentIndex = checkedVideos.indexOf(selectedVideoId);
    const newSelected = [...checkedVideos];

    if (currentIndex === -1) {
      newSelected.push(selectedVideoId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setCheckedVideosAction(newSelected);
  };

  return (
    <React.Fragment>
      <div className={styles.videosPanelDiv}>
        <SearchVideoInput name="search-video" placeholder="Video Url">
          {({ ref, ...videosInputProps }) => (
            <SearchInput ref={ref} {...videosInputProps} />
          )}
        </SearchVideoInput>
        <div className={styles.videos}>
          {videos.length !== 0 ? (
            videos.map((video) => (
              <React.Fragment key={video.id}>
                <div
                  className={classNames(styles.videosItem, {
                    [styles.checkedVideos]: checkedVideos.includes(video.id),
                  })}
                  onClick={handleSelectVideoItem}
                  data-videoid={video.id}
                >
                  <div>
                    <Checkbox
                      className={styles.checkBox}
                      checked={checkedVideos.includes(video.id)}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value={video.id}
                      onChange={handleCheckVideos}
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

VideosPanel.propTypes = {
  ytplaylist: PropTypes.object.isRequired,
  setCheckedVideosAction: PropTypes.func.isRequired,
};

const mapStatesToVideosPanelProps = ({ ytplaylist }) => ({
  ytplaylist,
});

export default connect(
  mapStatesToVideosPanelProps,
  {
    setCheckedVideosAction,
  }
)(VideosPanel);
