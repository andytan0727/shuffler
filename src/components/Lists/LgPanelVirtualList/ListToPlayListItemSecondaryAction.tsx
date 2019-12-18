import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCurSongIdx } from "store/ytplayer/action";
import { removeFilteredSnippetsByItemIds } from "store/ytplaylist/filteredActions";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";
import {
  chooseFirstItemAndShuffleListToPlayAction,
  deleteListToPlayItemByIdAction,
} from "store/ytplaylist/listToPlayActions";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@material-ui/icons";

interface ListToPlayListItemSecondaryActionProps {
  itemId: string;
}

const ListToPlayListItemSecondaryAction: React.FC<ListToPlayListItemSecondaryActionProps> = (
  props: ListToPlayListItemSecondaryActionProps
) => {
  const { itemId } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const filteredSnippets = useSelector(selectFilteredSnippets);

  // play this video then shuffle the rest of the list
  const handlePlayAndShuffle = useCallback(() => {
    dispatch(chooseFirstItemAndShuffleListToPlayAction(itemId));

    // reset song idx to 0 as a precautionary step
    // this is true for LgPanelDialog which does not
    // unmount the whole player page, therefore the song
    // idx could not be changed in LgPanelDialog
    dispatch(setCurSongIdx(0));

    history.push("/player/ytplayer");
  }, [dispatch, history, itemId]);

  const handleDeleteItemFromListToPlay = useCallback(() => {
    dispatch(deleteListToPlayItemByIdAction(itemId));

    // remove listToPlay items from filteredSnippets
    // if user is filtering
    if (filteredSnippets) dispatch(removeFilteredSnippetsByItemIds([itemId]));
  }, [dispatch, filteredSnippets, itemId]);

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

export default ListToPlayListItemSecondaryAction;
