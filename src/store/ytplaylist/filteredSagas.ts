import { all, put, select, take } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import { DELETE_LIST_TO_PLAY_ITEMS } from "utils/constants/actionConstants";

import { removeFilteredSnippetsByItemIds } from "./filteredActions";
import { selectFilteredSnippets } from "./filteredSelectors";
import { deleteListToPlayItemsAction } from "./listToPlayActions";

/**
 * Saga which determines whether or not remove filteredSnippets items
 * when there is a deletion on listToPlay
 *
 */
export function* removeFilteredSnippetsOnItemsDeletion() {
  while (true) {
    const action: ActionType<typeof deleteListToPlayItemsAction> = yield take([
      DELETE_LIST_TO_PLAY_ITEMS,
    ]);
    const filteredSnippets = yield select(selectFilteredSnippets);
    let itemIds: string[] | undefined = undefined;

    switch (action.type) {
      case "DELETE_LIST_TO_PLAY_ITEMS": {
        const { ids } = action.payload;
        itemIds = [...ids];

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
