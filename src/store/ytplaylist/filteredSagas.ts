import { all, put, select, take } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  deleteNormListToPlayItemByIdAction,
  deleteNormListToPlayItemsAction,
  removeFilteredSnippetsByItemIds,
} from "./normAction";
import { selectFilteredSnippets } from "./normSelector";

/**
 * Saga which determines whether or not remove filteredSnippets items
 * when there is a deletion on normalized listToPlay
 *
 */
export function* removeFilteredSnippetsOnItemsDeletion() {
  while (true) {
    const action: ActionType<
      | typeof deleteNormListToPlayItemsAction
      | typeof deleteNormListToPlayItemByIdAction
    > = yield take([
      ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEMS,
      ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID,
    ]);
    const filteredSnippets = yield select(selectFilteredSnippets);
    let itemIds: string[] | undefined = undefined;

    switch (action.type) {
      case "DELETE_NORM_LIST_TO_PLAY_ITEMS": {
        const { ids } = action.payload;
        itemIds = [...ids];

        break;
      }

      case "DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID": {
        const { id: itemId } = action.payload;
        itemIds = [itemId];

        break;
      }

      default: {
        break;
      }
    }

    // remove itemIds from filteredSnippets
    // if both filtered snippets and itemIds exists
    if (filteredSnippets && itemIds && itemIds.length !== 0) {
      yield put(removeFilteredSnippetsByItemIds(itemIds));
    }
  }
}

export default function* filteredSagas() {
  yield all([removeFilteredSnippetsOnItemsDeletion()]);
}
