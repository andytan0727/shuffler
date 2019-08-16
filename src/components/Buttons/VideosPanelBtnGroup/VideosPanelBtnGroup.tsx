import classNames from "classnames";
import { ClearChecked } from "components/Checkbox/hooks";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import {
  addNormVideosToNormListToPlayAction,
  deleteNormVideoByIdAction,
  removeNormVideosFromNormListToPlayAction,
} from "store/ytplaylist/normAction";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideosPanelBtnGroupProps {
  checked: string[];
  clearChecked: ClearChecked;
}

const noVideoSelectedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal!.fire({
    title: "No video is selected!💢",
    text: "Please select at least one video!",
    type: "warning",
  });
};

const VideosPanelBtnGroup = (props: VideosPanelBtnGroupProps) => {
  const { checked: itemIds, clearChecked } = props;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();

  const handleAddVideosToPlaying = useCallback(async () => {
    if (!itemIds.length) {
      await noVideoSelectedAlert();
      return;
    }

    dispatch(addNormVideosToNormListToPlayAction(itemIds));

    notify("success", "Successfully added selected video(s) to playing 😎");
    clearChecked();
  }, [itemIds, clearChecked, dispatch]);

  const handleRemoveVideo = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!itemIds.length) {
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
      for (const itemId of itemIds) {
        dispatch(deleteNormVideoByIdAction(itemId));
      }

      await customSwal!.fire("Deleted!", "Video(s) deleted 😎", "success");
      clearChecked();
    }
  }, [itemIds, clearChecked, dispatch]);

  const handleRemoveVideoFromPlaying = useCallback(async () => {
    if (!itemIds.length) {
      await noVideoSelectedAlert();
      return;
    }

    dispatch(removeNormVideosFromNormListToPlayAction(itemIds));

    clearChecked();
  }, [itemIds, clearChecked, dispatch]);

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

export default VideosPanelBtnGroup;
