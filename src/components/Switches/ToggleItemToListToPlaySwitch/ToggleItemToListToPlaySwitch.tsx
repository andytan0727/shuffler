import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { selectListToPlayEntities } from "store/ytplaylist/listToPlaySelectors";
import { isListToPlayItemExists } from "store/ytplaylist/utils";
import { useToggleListToPlayItem } from "utils/hooks/listToPlayHooks";

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
        backgroundColor: theme.palette.background.softBlack,
        opacity: 0.8,
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
    const schema = source === "playlists" ? "playlistItems" : "videoItems";
    const { itemId } = props;
    const classes = useStyles();
    const listToPlayEntities = useSelector((state: AppState) =>
      selectListToPlayEntities(state)
    );
    const { handleToggleListToPlayItem } = useToggleListToPlayItem(
      schema,
      itemId
    );
    const listToPlayItemExists = isListToPlayItemExists(
      listToPlayEntities,
      schema,
      itemId
    );

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
        checked={listToPlayItemExists}
        onChange={handleToggleListToPlayItem}
      ></Switch>
    );
  };
