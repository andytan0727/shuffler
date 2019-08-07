import classNames from "classnames";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import {
  addVideosToListToPlayAction,
  deleteVideosAction,
  removeVideosFromListToPlayAction,
} from "store/ytplaylist/action";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideosPanelBtnGroupConnectedState {
  preferDarkTheme: boolean;
  checkedVideos: Readonly<string[]>;
}

interface VideosPanelBtnGroupConnectedDispatch {
  addVideosToListToPlayAction: typeof addVideosToListToPlayAction;
  deleteVideosAction: typeof deleteVideosAction;
  removeVideosFromListToPlayAction: typeof removeVideosFromListToPlayAction;
}

type VideosPanelBtnGroupProps = VideosPanelBtnGroupConnectedState &
  VideosPanelBtnGroupConnectedDispatch;

const noVideoSelectedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal!.fire({
    title: "No video is selected!💢",
    text: "Please select at least one video!",
    type: "warning",
  });
};

const VideosPanelBtnGroup = (props: VideosPanelBtnGroupProps) => {
  const {
    preferDarkTheme,
    checkedVideos,
    addVideosToListToPlayAction,

    deleteVideosAction,
    removeVideosFromListToPlayAction,
  } = props;

  const handleAddVideosToPlaying = useCallback(async () => {
    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    addVideosToListToPlayAction(checkedVideos as string[]);

    notify("success", "Successfully added selected video(s) to playing 😎");
  }, [addVideosToListToPlayAction, checkedVideos]);

  const handleRemoveVideo = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    const result = await customSwal!.fire({
      title: "Remove video(s)",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      deleteVideosAction(checkedVideos as string[]);
      await customSwal!.fire("Deleted!", "Video(s) deleted 😎", "success");
    }
  }, [checkedVideos, deleteVideosAction]);

  const handleRemoveVideoFromPlaying = useCallback(async () => {
    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    removeVideosFromListToPlayAction(checkedVideos as string[]);
  }, [checkedVideos, removeVideosFromListToPlayAction]);

  return (
    <div
      className={classNames({
        [styles.btnGroupLight]: !preferDarkTheme,
        [styles.btnGroupDark]: preferDarkTheme,
      })}
    >
      <button
        onClick={handleAddVideosToPlaying}
        data-tooltip={"Add to playing list"}
      >
        <AddIcon />
      </button>
      <button
        onClick={handleRemoveVideoFromPlaying}
        data-tooltip={"Remove from playing"}
      >
        <RemoveIcon />
      </button>
      <button onClick={handleRemoveVideo} data-tooltip={"Delete video"}>
        <DeleteIcon />
      </button>
    </div>
  );
};

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
  ytplaylist: { checkedVideos },
}: AppState) => ({
  preferDarkTheme,
  checkedVideos,
});

export default connect(
  mapStatesToProps,
  {
    addVideosToListToPlayAction,
    deleteVideosAction,
    removeVideosFromListToPlayAction,
  }
)(VideosPanelBtnGroup);
