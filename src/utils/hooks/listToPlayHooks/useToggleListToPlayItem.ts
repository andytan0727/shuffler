import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import {
  addListToPlayItemAction,
  deleteListToPlayItemByIdAction,
} from "store/ytplaylist/listToPlayActions";
import { selectListToPlayEntities } from "store/ytplaylist/listToPlaySelectors";
import { selectPlaylistIdByItemId } from "store/ytplaylist/playlistSelectors";
import { isListToPlayItemExists } from "store/ytplaylist/utils";
import { selectVideoIdByItemId } from "store/ytplaylist/videoSelectors";
import { notify } from "utils/helper/notifyHelper";

export const useToggleListToPlayItem = (schema: SchemaType, itemId: string) => {
  const listToPlayEntities = useSelector((state: AppState) =>
    selectListToPlayEntities(state)
  );
  const dispatch = useDispatch();
  const foreignKey = useSelector((state: AppState) =>
    schema === "playlistItems"
      ? selectPlaylistIdByItemId(state, itemId)
      : selectVideoIdByItemId(state, itemId)
  );

  const handleAddListToPlayItem = useCallback(() => {
    if (!foreignKey) {
      notify("warning", "Playlist associated with the item could not be found");
      return;
    }

    dispatch(
      addListToPlayItemAction(
        {
          id: itemId,
          schema,
        },
        foreignKey
      )
    );
  }, [dispatch, foreignKey, itemId, schema]);

  const handleDeleteListToPlayItem = useCallback(() => {
    dispatch(deleteListToPlayItemByIdAction(itemId));
  }, [dispatch, itemId]);

  const handleToggleListToPlayItem = useCallback(() => {
    if (!isListToPlayItemExists(listToPlayEntities, schema, itemId)) {
      handleAddListToPlayItem();
      return;
    }

    handleDeleteListToPlayItem();
  }, [
    handleAddListToPlayItem,
    handleDeleteListToPlayItem,
    itemId,
    listToPlayEntities,
    schema,
  ]);

  return {
    handleToggleListToPlayItem,
  };
};
