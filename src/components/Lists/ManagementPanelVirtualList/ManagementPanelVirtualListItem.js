import React from "react";
import { areEqual } from "react-window";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  makeStyles,
} from "@material-ui/core";

import AddVideoToPlayingSwitch from "../../Switches";
import { DeleteVideoButton } from "../../Buttons/DeleteButtons";

import { useCheckPlaylistsOrVideos } from "../../Checkbox/hooks";

const useStyles = makeStyles({
  /**
   * Props for custom material-ui styles
   *
   * @param {{ index: number; }} props
   */
  listItem: (props) => ({
    height: "100%",
  }),
  listItemText: {
    "& span": {
      display: "inline-block",
      paddingRight: 60,
    },
  },
});

/**
 * withManagementPanelVirtualListItem higher order component
 *
 * Used to generate list item component for ManagementPanelVirtualList,
 * with the option of either showing playlists or videos
 *
 * @param {ItemType} itemType
 * @returns {React.ReactNode}
 */
export const withManagementPanelVirtualListItem = (itemType) =>
  React.memo(
    /**
     *
     * @param {{
     *   index: number;
     *   style: *;
     *   data: Array<PlaylistItem> | Array<VideoItem>;
     * }} props
     * @returns
     */
    (props) => {
      const { index, style, data } = props;
      const classes = useStyles({ index });
      const { checked, handleSetChecked } = useCheckPlaylistsOrVideos(itemType);
      const itemId = data[index].id;
      const currentItem = data[index];
      const listItemText = currentItem && currentItem.snippet.title;

      return (
        <ListItem
          button
          divider
          className={classes.listItem}
          onClick={handleSetChecked(itemId)}
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
              checked={checked.includes(itemId)}
              disableRipple
              inputProps={{ "aria-labelledby": itemId }}
            />
          </ListItemIcon>

          <ListItemText
            className={classes.listItemText}
            primary={listItemText}
          />

          {/* ListItemSecondaryAction should be last child */}
          <ListItemSecondaryAction>
            <div>
              <AddVideoToPlayingSwitch itemId={itemId} />
              <DeleteVideoButton itemId={itemId} />
            </div>
          </ListItemSecondaryAction>
        </ListItem>
      );
    },
    areEqual
  );
