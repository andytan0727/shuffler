import React from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { selectSnippetByItemId } from "store/ytplaylist/generalSelectors";

import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

import { ItemData } from "./LgPanelVirtualList";
import ListToPlayListItemSecondaryAction from "./ListToPlayListItemSecondaryAction";
import PlaylistVideoListItemSecondaryAction from "./PlaylistVideoListItemSecondaryAction";

// omit itemIds, replace with itemId for individual ListItem
interface LgPanelVirtualListItemProps extends Omit<ItemData, "itemIds"> {
  itemId: string;
  index: number;
  style: any;
  provided: DraggableProvided;
  isDragging?: boolean;
  isClone?: boolean;
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
 * LgPanelVirtualListItem
 *
 * List item component for LgPanelVirtualList,
 *
 */
const LgPanelVirtualListItem = (props: LgPanelVirtualListItemProps) => {
  const {
    checked,
    handleCheckOrUncheckId,
    itemId: currentItemId,
    snippetType,
    style,
    provided,
    provided: {
      draggableProps: {
        // style is ignored to prevent it replace the original ContainerProps style
        // which breaks the ListItem style when dragging
        style: _,
        ...restDraggableProps
      },
      dragHandleProps,
    },
    isDragging,
  } = props;
  const classes = useStyles();
  const currentSnippet = useSelector((state: AppState) =>
    selectSnippetByItemId(state, currentItemId)
  );

  return (
    <ListItem
      divider
      className={classes.listItem}
      ContainerProps={{
        style: {
          ...style,
          listStyleType: "none",
          border: currentSnippet ? "none" : "2px solid red",
          background: isDragging ? "rgba(0,0,0,.5)" : "transparent",
        },

        // Must spread the two props below in container element
        // since this mui ListItem has SecondaryAction.
        // This is to prevent transform positioning problem in the ListItem when dragging
        ...restDraggableProps,
        ...dragHandleProps,
      }}
      ref={provided.innerRef}
    >
      {currentSnippet ? (
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.includes(currentItemId)}
            onChange={handleCheckOrUncheckId(currentItemId)}
            disableRipple
            inputProps={{ "aria-labelledby": currentSnippet.id }}
          />
        </ListItemIcon>
      ) : (
        <ListItemIcon>
          <CloseIcon color="error" />
        </ListItemIcon>
      )}

      <ListItemText
        className={classes.listItemText}
        primary={currentSnippet?.title || "No title"}
      />

      {/* ListItemSecondaryAction should be last child */}
      <ListItemSecondaryAction>
        {currentSnippet &&
          (snippetType === "ltp" ? (
            <ListToPlayListItemSecondaryAction itemId={currentItemId} />
          ) : (
            <PlaylistVideoListItemSecondaryAction itemId={currentItemId} />
          ))}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default LgPanelVirtualListItem;
