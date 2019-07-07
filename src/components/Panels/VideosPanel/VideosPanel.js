import React, { useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Components
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";

import { withSearchInput } from "../../Inputs";
import { VideosPanelBtnGroup } from "../../Buttons";
import { setCheckedVideosAction } from "../../../store/ytplaylist/action";
import { addOrRemove } from "../../../utils/helper/arrayHelper";

import styles from "./styles.module.scss";

const SearchVideoInput = withSearchInput("video");

const VideosPanel = (props) => {
  const {
    ytplaylist: { videos, checkedVideos, playingVideos },
    setCheckedVideosAction,
  } = props;

  const handleCheckVideos = useCallback(
    (id) => (e) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setCheckedVideosAction(addOrRemove(checkedVideos, id));
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
