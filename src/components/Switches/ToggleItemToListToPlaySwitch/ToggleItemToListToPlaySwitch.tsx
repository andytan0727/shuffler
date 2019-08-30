import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import {
  addListToPlayItemAction,
  deleteListToPlayItemByIdAction,
} from "store/ytplaylist/listToPlayActions";
import { selectListToPlayEntities } from "store/ytplaylist/listToPlaySelectors";
import { selectPlaylistIdByItemId } from "store/ytplaylist/playlistSelectors";
import { isListToPlayItemExists } from "store/ytplaylist/utils";
import { selectVideoIdByItemId } from "store/ytplaylist/videoSelectors";

import { makeStyles, Switch } from "@material-ui/core";

interface ToggleItemToListToPlaySwitchProps {
  itemId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: theme.palette.secondary.main,
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}));

/**
 * ToggleItemToListToPlaySwitch factory
 *
 * @param source Playlists or videos source
 */
export const makeToggleItemToListToPlaySwitch = (source: MediaSourceType) =>
  function ToggleItemToListToPlaySwitch(
    props: ToggleItemToListToPlaySwitchProps
  ) {
    const { itemId } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const listToPlayEntities = useSelector((state: AppState) =>
      selectListToPlayEntities(state)
    );
    const sourceId = useSelector((state: AppState) =>
      source === "playlists"
        ? selectPlaylistIdByItemId(state, itemId)
        : selectVideoIdByItemId(state, itemId)
    );
    const schema = source === "playlists" ? "playlistItems" : "videoItems";

    if (!sourceId)
      throw new Error(
        "Source(playlist/video) not found with the corresponding itemId"
      );

    const handleToggleListToPlayItem = useCallback(() => {
      dispatch(
        !isListToPlayItemExists(listToPlayEntities, schema, itemId)
          ? addListToPlayItemAction(
              {
                id: itemId,
                schema,
              },
              sourceId
            )
          : deleteListToPlayItemByIdAction(itemId)
      );
    }, [listToPlayEntities, dispatch, itemId, sourceId, schema]);

    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        checked={isListToPlayItemExists(listToPlayEntities, schema, itemId)}
        onChange={handleToggleListToPlayItem}
      ></Switch>
    );
  };
