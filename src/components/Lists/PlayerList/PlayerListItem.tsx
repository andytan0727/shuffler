import classNames from "classnames";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { areEqual, FixedSizeList } from "react-window";
import { AppState } from "store";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { selectPlaylistNameById } from "store/ytplaylist/playlistSelectors";
import { ListToPlaySnippets } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";
import { useQueueListToPlayItem } from "utils/hooks/listToPlayHooks";

import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import { SwapVertOutlined as SwapVertOutlinedIcon } from "@material-ui/icons";

type ListRef = React.RefObject<FixedSizeList>;

interface PlayerListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    snippets: ListToPlaySnippets;
    ref: ListRef;
  };
}

interface PlayerListItemWithRefProps {
  index: number;
  style: React.CSSProperties;
  data: ListToPlaySnippets;
}

const useStyles = makeStyles({
  // show queue btn on hover, else hide it
  root: {
    "& + .MuiListItemSecondaryAction-root": {
      display: "none",

      "&:hover": {
        display: "block",
      },
    },

    "&:hover": {
      "& + .MuiListItemSecondaryAction-root": {
        display: "block",
      },
    },
  },
  playerListItemText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    paddingRight: ".8rem",

    "& .MuiListItemText-primary": {
      fontSize: "1.125rem",
    },
  },
  currentSong: {
    color: "var(--playing)",

    "& .MuiListItemText-primary": {
      fontWeight: "bolder",
    },
  },
});

const PlayerListItem = React.memo((props: PlayerListItemProps) => {
  const {
    index,
    style,
    data: { snippets, ref: listRef },
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const curSongIdx = useSelector(selectCurSongIdx);
  const currentSnippet = snippets[index]; // all snippets should be defined in listToPlaySnippets
  const playlistId = isPlaylistItemSnippet(currentSnippet)
    ? currentSnippet.playlistId
    : "";
  const playlistName = useSelector((state: AppState) =>
    selectPlaylistNameById(state, playlistId)
  );
  const thumbnails = currentSnippet.thumbnails;
  const { handleQueueListToPlayItem } = useQueueListToPlayItem(index, listRef);

  const handleChangeVideo = useCallback(() => {
    dispatch(setCurSongIdx(index));
  }, [dispatch, index]);

  return (
    <ListItem
      button
      className={classNames(classes.root, {
        [classes.currentSong]: index === curSongIdx,
      })}
      ContainerProps={{
        style: {
          ...style,
          listStyleType: "none",
        },
      }}
      onClick={handleChangeVideo}
    >
      <ListItemAvatar>
        <Avatar
          alt={currentSnippet.title}
          src={thumbnails && thumbnails.default.url}
        />
      </ListItemAvatar>
      <ListItemText
        className={classes.playerListItemText}
        primary={currentSnippet.title}
        // For playlist snippet, display 'From - playlistName' first
        // If playlistName not found, fallback to display 'From - playlistId'
        // if it is video snippet, display 'From - Video'
        secondary={`From - ${playlistName || playlistId || "Video"}`}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Queue video">
          <IconButton edge="end" onClick={handleQueueListToPlayItem}>
            <SwapVertOutlinedIcon></SwapVertOutlinedIcon>
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}, areEqual);

PlayerListItem.displayName = "PlayerListItem";

export const withPlayerListRef = (listRef: ListRef) => (
  listItemProps: PlayerListItemWithRefProps
) => {
  const { data: snippets } = listItemProps;

  const propsWithRef = {
    ...listItemProps,
    data: {
      snippets,
      ref: listRef,
    },
  };

  return <PlayerListItem {...propsWithRef} />;
};

export default PlayerListItem;
