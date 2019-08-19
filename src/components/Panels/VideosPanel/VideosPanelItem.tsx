import classNames from "classnames";
import { HandleCheckOrUncheckId } from "components/Checkbox/hooks";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { selectListToPlayEntities } from "store/ytplaylist/listToPlaySelectors";
import { isListToPlayItemExists } from "store/ytplaylist/utils";
import { selectVideoSnippetByItemId } from "store/ytplaylist/videoSelectors";

import { Checkbox } from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  MusicVideo as MusicVideoIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideosPanelItemProps {
  checked: string[];
  handleCheckOrUncheckId: HandleCheckOrUncheckId;
  itemId: string;
}

const VideosPanelItem = (props: VideosPanelItemProps) => {
  const { checked, handleCheckOrUncheckId, itemId } = props;
  const snippet = useSelector((state: AppState) =>
    selectVideoSnippetByItemId(state, itemId)
  );
  const listToPlayEntities = useSelector(selectListToPlayEntities);

  return (
    <div
      className={classNames(styles.videosItem, {
        [styles.checkedVideos]: checked.includes(itemId),
      })}
      onClick={handleCheckOrUncheckId(itemId)}
    >
      <div>
        <Checkbox
          className={styles.checkBox}
          checked={checked.includes(itemId)}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          onChange={handleCheckOrUncheckId(itemId)}
        />
        <span>{(snippet && snippet.title) || "Invalid item"}</span>
        {isListToPlayItemExists(listToPlayEntities, "videoItems", itemId) && (
          <MusicVideoIcon />
        )}
      </div>
    </div>
  );
};

export default VideosPanelItem;
