import classNames from "classnames";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { areEqual } from "react-window";
import { AppState } from "store";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { selectPlaylistNameById } from "store/ytplaylist/playlistSelectors";
import { ListToPlaySnippets } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";

interface PlayerListItemProps {
  index: number;
  style: React.CSSProperties;
  data: ListToPlaySnippets;
}

const useStyles = makeStyles({
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
  const { index, style, data: snippets } = props;
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

  const handleChangeVideo = useCallback(() => {
    dispatch(setCurSongIdx(index));
  }, [dispatch, index]);

  return (
    <ListItem
      button
      className={classNames({
        [classes.currentSong]: index === curSongIdx,
      })}
      style={style}
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
    </ListItem>
  );
}, areEqual);

PlayerListItem.displayName = "PlayerListItem";

export default PlayerListItem;
