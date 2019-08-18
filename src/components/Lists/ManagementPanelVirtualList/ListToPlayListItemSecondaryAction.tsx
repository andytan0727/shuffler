import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import {
  chooseFirstItemAndShuffleListToPlayAction,
  deleteNormListToPlayItemByIdAction,
} from "store/ytplaylist/listToPlayActions";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@material-ui/icons";

interface ListToPlayListItemSecondaryActionProps extends RouteComponentProps {
  itemId: string;
  snippet: PlaylistItemSnippet | VideoItemSnippet;
}

const ListToPlayListItemSecondaryAction = (
  props: ListToPlayListItemSecondaryActionProps
) => {
  const { itemId, history } = props;
  const dispatch = useDispatch();

  // play this video then shuffle the rest of the list
  const handlePlayAndShuffle = useCallback(() => {
    dispatch(chooseFirstItemAndShuffleListToPlayAction(itemId));

    history.push("/player/ytplayer");
  }, [dispatch, history, itemId]);

  const handleDeleteItemFromListToPlay = useCallback(() => {
    dispatch(deleteNormListToPlayItemByIdAction(itemId));
  }, [dispatch, itemId]);

  return (
    <div>
      <Tooltip title="Play and Shuffle">
        <IconButton onClick={handlePlayAndShuffle}>
          <PlayArrowIcon />
        </IconButton>
      </Tooltip>

      <IconButton onClick={handleDeleteItemFromListToPlay}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default withRouter(ListToPlayListItemSecondaryAction);
