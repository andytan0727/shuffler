import React from "react";
import { useSelector } from "react-redux";
import { areEqual } from "react-window";
import { AppState } from "store";
import { selectSnippetByItemId } from "store/ytplaylist/generalSelectors";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";

import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

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
      data: {
        checked,
        handleCheckOrUncheckId,
        items: itemIds,
        filteredSnippets,
      },
    } = props;
    const classes = useStyles({});
    const currentItemId = filteredSnippets
      ? filteredSnippets[index].itemId! // assume itemId is provided
      : itemIds[index];
    const currentSnippet = useSelector((state: AppState) =>
      selectSnippetByItemId(state, currentItemId)
    );

    return !currentSnippet ? (
      <ListItem
        divider
        className={classes.listItem}
        ContainerProps={{
          style: {
            ...style,
            listStyleType: "none",
            border: "2px solid red",
          },
        }}
      >
        <ListItemIcon>
          <CloseIcon color="error" />
        </ListItemIcon>

        <ListItemText
          className={classes.listItemText}
          primary={"Invalid item"}
        />

        {/* ListItemSecondaryAction is here to prevent broken ListItem UI */}
        <ListItemSecondaryAction></ListItemSecondaryAction>
      </ListItem>
    ) : (
      <ListItem
        button
        divider
        className={classes.listItem}
        onClick={handleCheckOrUncheckId(currentItemId)}
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
            inputProps={{ "aria-labelledby": currentSnippet.id }}
          />
        </ListItemIcon>

        <ListItemText
          className={classes.listItemText}
          primary={currentSnippet.title || "No title"}
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
