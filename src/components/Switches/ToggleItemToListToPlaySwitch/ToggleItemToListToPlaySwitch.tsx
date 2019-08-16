import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import {
  addNormListToPlayItemAction,
  deleteNormListToPlayItemByIdAction,
} from "store/ytplaylist/listToPlayActions";
import {
  selectNormListToPlayEntities,
  selectNormPlaylistIdByItemId,
  selectNormVideoIdByItemId,
} from "store/ytplaylist/normSelector";
import { isListToPlayItemExists } from "store/ytplaylist/utils";

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
      selectNormListToPlayEntities(state)
    );
    const sourceId = useSelector((state: AppState) =>
      source === "playlists"
        ? selectNormPlaylistIdByItemId(state, itemId)
        : selectNormVideoIdByItemId(state, itemId)
    );
    const schema = source === "playlists" ? "playlistItems" : "videoItems";

    const handleToggleListToPlayItem = useCallback(() => {
      dispatch(
        !isListToPlayItemExists(listToPlayEntities, schema, itemId)
          ? addNormListToPlayItemAction(
              {
                id: itemId,
                schema,
              },
              sourceId
            )
          : deleteNormListToPlayItemByIdAction(itemId)
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
