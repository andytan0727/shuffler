import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteNormListToPlayItemByIdAction } from "store/ytplaylist/normAction";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";

import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

interface ListToPlayListItemSecondaryActionProps {
  itemId: string;
  snippet: PlaylistItemSnippet | VideoItemSnippet;
}

const ListToPlayListItemSecondaryAction = (
  props: ListToPlayListItemSecondaryActionProps
) => {
  const { itemId } = props;
  const dispatch = useDispatch();

  const handleDeleteItemFromListToPlay = useCallback(() => {
    dispatch(deleteNormListToPlayItemByIdAction(itemId));
  }, [dispatch, itemId]);

  return (
    <div>
      <IconButton onClick={handleDeleteItemFromListToPlay}>
        <Delete />
      </IconButton>
    </div>
  );
};

export default ListToPlayListItemSecondaryAction;
