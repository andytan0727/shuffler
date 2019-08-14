import React from "react";
import { useSelector } from "react-redux";
import { areEqual } from "react-window";
import { AppState } from "store";
import { selectNormSnippetByItemId } from "store/ytplaylist/normSelector";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";

import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";

import { ItemData } from "./ManagementPanelVirtualList";

interface WrappedSecondaryActionItemsProps {
  itemId: string;
  snippet: PlaylistItemSnippet | VideoItemSnippet;
}

interface ManagementPanelVirtualListItemProps {
  index: number;
  style: any;
  data: ItemData;
}

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

/**
 * ManagementPanelVirtualListItem
 *
 * List item component for ManagementPanelVirtualList,
 *
 */
export const withListItemSecondaryAction = (
  WrappedSecondaryActionItems: React.ComponentType<
    WrappedSecondaryActionItemsProps
  >
) =>
  React.memo((props: ManagementPanelVirtualListItemProps) => {
    const {
      index,
      style,
      data: { checked, handleSetChecked, items: itemIds, filteredSnippets },
    } = props;
    const classes = useStyles({});
    const currentItemId = filteredSnippets
      ? filteredSnippets[index].itemId! // assume itemId is provided
      : itemIds[index];
    const currentSnippet = useSelector((state: AppState) =>
      selectNormSnippetByItemId(state, currentItemId)
    );

    const snippetId = currentSnippet.id;
    const listItemText = currentSnippet.title;

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
          <WrappedSecondaryActionItems
            itemId={currentItemId}
            snippet={currentSnippet}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }, areEqual);
