import classNames from "classnames";
import { HandleSetChecked } from "components/Checkbox/hooks";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { selectNormListToPlayEntities } from "store/ytplaylist/listToPlaySelectors";
import { isListToPlayItemExists } from "store/ytplaylist/utils";
import { selectNormVideoSnippetByItemId } from "store/ytplaylist/videoSelectors";

import { Checkbox } from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  MusicVideo as MusicVideoIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideosPanelItemProps {
  checked: string[];
  handleSetChecked: HandleSetChecked;
  itemId: string;
}

const VideosPanelItem = (props: VideosPanelItemProps) => {
  const { checked, handleSetChecked, itemId } = props;
  const snippet = useSelector((state: AppState) =>
    selectNormVideoSnippetByItemId(state, itemId)
  );
  const listToPlayEntities = useSelector(selectNormListToPlayEntities);

  return (
    <div
      className={classNames(styles.videosItem, {
        [styles.checkedVideos]: checked.includes(itemId),
      })}
      onClick={handleSetChecked(itemId)}
    >
      <div>
        <Checkbox
          className={styles.checkBox}
          checked={checked.includes(itemId)}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          onChange={handleSetChecked(itemId)}
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
