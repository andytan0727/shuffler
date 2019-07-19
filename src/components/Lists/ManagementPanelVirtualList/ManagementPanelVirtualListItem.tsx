import React, { useCallback } from "react";
import { areEqual } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  makeStyles,
} from "@material-ui/core";

import { AddVideoToPlayingSwitch } from "components/Switches";
import { DeleteItemButton } from "components/Buttons/DeleteButtons";
import { deleteVideosAction } from "store/ytplaylist/action";
import {
  deleteNormVideoByIdAction,
  deleteNormPlaylistItemByIdAction,
} from "store/ytplaylist/normAction";
import {
  selectNormVideoSnippetByItemId,
  selectNormPlaylistSnippetByItemId,
} from "store/ytplaylist/normSelector";
import { PlaylistItemSnippet } from "store/ytplaylist/types";
import { ItemData } from "./ManagementPanelVirtualList";

const useStyles = makeStyles({
  listItem: {
    height: "100%",
  },
  listItemText: {
    "& span": {
      display: "inline-block",
      paddingRight: 60,
    },
  },
});

interface ManagementPanelVirtualListItemProps {
  index: number;
  style: any;
  data: ItemData;
}

/**
 * makeManagementPanelVirtualListItem factory
 *
 * Used to generate list item component for ManagementPanelVirtualList,
 * with the option of either showing playlists or videos
 *
 * @param sourceType Specify the list item type to produce (playlists/videos)
 *
 */
export const makeManagementPanelVirtualListItem = (
  sourceType: MediaSourceType
) =>
  React.memo((props: ManagementPanelVirtualListItemProps) => {
    const {
      index,
      style,
      // data: { checked, handleSetChecked, snippets },
      data: { checked, handleSetChecked, items },
    } = props;
    const classes = useStyles({ index });
    const dispatch = useDispatch();
    const currentItemId = items[index];
    const currentSnippet = useSelector((state: never) =>
      sourceType === "playlists"
        ? selectNormPlaylistSnippetByItemId(state, currentItemId)
        : selectNormVideoSnippetByItemId(state, currentItemId)
    );
    const snippetId = currentSnippet.id;
    const listItemText = currentSnippet && currentSnippet.title;

    if (!snippetId) throw new Error("VirtualListItem: Id not found in snippet");

    const handleDeleteVideo = useCallback(() => {
      dispatch(deleteNormVideoByIdAction(snippetId));

      // backward-compatible support
      dispatch(deleteVideosAction([snippetId]));
    }, [snippetId, dispatch]);

    const handleDeletePlaylistItem = useCallback(() => {
      dispatch(
        deleteNormPlaylistItemByIdAction(
          (currentSnippet as PlaylistItemSnippet).playlistId,
          currentItemId
        )
      );
    }, [currentSnippet, currentItemId, dispatch]);

    return (
      <ListItem
        button
        divider
        className={classes.listItem}
        onClick={handleSetChecked(currentItemId)}
        ContainerProps={{
          style: {
            ...style,
            listStyleType: "none",
          },
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.includes(currentItemId)}
            disableRipple
            inputProps={{ "aria-labelledby": snippetId }}
          />
        </ListItemIcon>

        <ListItemText
          className={classes.listItemText}
          primary={listItemText || "No title"}
        />

        {/* ListItemSecondaryAction should be last child */}
        <ListItemSecondaryAction>
          <div>
            <AddVideoToPlayingSwitch itemId={snippetId} />
            <DeleteItemButton
              handleOnClick={
                sourceType === "playlists"
                  ? handleDeletePlaylistItem
                  : handleDeleteVideo
              }
            />
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }, areEqual);
