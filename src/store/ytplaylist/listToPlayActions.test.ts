import deepFreeze from "deep-freeze";
import {
  ADD_LIST_TO_PLAY,
  ADD_LIST_TO_PLAY_ITEM,
  ADD_LIST_TO_PLAY_ITEMS,
  ADD_UNIQUE_LIST_TO_PLAY,
  CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  DELETE_LIST_TO_PLAY_ITEM_BY_ID,
  DELETE_LIST_TO_PLAY_ITEMS,
  FILTER_LIST_TO_PLAY_ITEMS,
  SHUFFLE_LIST_TO_PLAY,
  UPDATE_LIST_TO_PLAY,
} from "utils/constants/actionConstants";

import {
  addListToPlayAction,
  addListToPlayItemAction,
  addListToPlayItemsAction,
  addUniqueListToPlay,
  chooseFirstItemAndShuffleListToPlayAction,
  clearListToPlayAction,
  deleteListToPlayItemByIdAction,
  deleteListToPlayItemsAction,
  filterListToPlayItemsAction,
  shuffleListToPlayAction,
  updateListToPlayAction,
} from "./listToPlayActions";
import { ListToPlayEntities, ListToPlayResultItem } from "./types";

const listToPlayEntities: ListToPlayEntities = {
  playlistItems: {},
  videoItems: {},
};

const listToPlayResultItem: ListToPlayResultItem = {
  id: "itemId-1",
  schema: "playlistItems",
};

const itemIds = ["itemId-1", "itemId-2"];
const foreignKey = "foreignKey-1";

deepFreeze(listToPlayEntities);
deepFreeze(listToPlayResultItem);
deepFreeze(itemIds);

describe("listToPlay actions", () => {
  test("should create ADD_LIST_TO_PLAY action object", () => {
    expect(addListToPlayAction(listToPlayEntities, [])).toEqual({
      type: ADD_LIST_TO_PLAY,
      payload: {
        entities: listToPlayEntities,
        result: [],
      },
    });
  });

  test("should create ADD_UNIQUE_LIST_TO_PLAY action object", () => {
    expect(addUniqueListToPlay(listToPlayEntities, [])).toEqual({
      type: ADD_UNIQUE_LIST_TO_PLAY,
      payload: {
        entities: listToPlayEntities,
        result: [],
      },
    });
  });

  test("should create ADD_LIST_TO_PLAY_ITEM action object", () => {
    expect(addListToPlayItemAction(listToPlayResultItem, foreignKey)).toEqual({
      type: ADD_LIST_TO_PLAY_ITEM,
      payload: {
        resultItem: listToPlayResultItem,
        foreignKey,
      },
    });
  });

  test("should create ADD_LIST_TO_PLAY_ITEMS action object", () => {
    const items = [
      {
        resultItem: listToPlayResultItem,
        foreignKey,
      },
    ];
    expect(addListToPlayItemsAction(items)).toEqual({
      type: ADD_LIST_TO_PLAY_ITEMS,
      payload: {
        items,
      },
    });
  });

  test("should create UPDATE_LIST_TO_PLAY action object", () => {
    expect(
      updateListToPlayAction("playlistItems", foreignKey, itemIds)
    ).toEqual({
      type: UPDATE_LIST_TO_PLAY,
      payload: {
        schema: "playlistItems",
        foreignKey,
        itemIds,
      },
    });
  });

  test("should create DELETE_LIST_TO_PLAY_ITEM_BY_ID action object", () => {
    expect(deleteListToPlayItemByIdAction(itemIds[0])).toEqual({
      type: DELETE_LIST_TO_PLAY_ITEM_BY_ID,
      payload: {
        id: itemIds[0],
      },
    });
  });

  test("should DELETE_LIST_TO_PLAY_ITEMS action object", () => {
    expect(deleteListToPlayItemsAction(itemIds)).toEqual({
      type: DELETE_LIST_TO_PLAY_ITEMS,
      payload: {
        ids: itemIds,
      },
    });
  });

  test("should create CLEAR_LIST_TO_PLAY action object", () => {
    expect(clearListToPlayAction()).toEqual({
      type: CLEAR_LIST_TO_PLAY,
    });
  });

  test("should create SHUFFLE_LIST_TO_PLAY action object", () => {
    expect(shuffleListToPlayAction()).toEqual({
      type: SHUFFLE_LIST_TO_PLAY,
      payload: {
        itemIds: undefined,
      },
    });

    expect(shuffleListToPlayAction(["itemId-1"])).toEqual({
      type: SHUFFLE_LIST_TO_PLAY,
      payload: {
        itemIds: ["itemId-1"],
      },
    });
  });

  test("should create CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY action object", () => {
    expect(chooseFirstItemAndShuffleListToPlayAction(itemIds[0])).toEqual({
      type: CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY,
      payload: {
        itemId: itemIds[0],
      },
    });
  });

  test("should create FILTER_LIST_TO_PLAY_ITEMS action object", () => {
    expect(filterListToPlayItemsAction(itemIds)).toEqual({
      type: FILTER_LIST_TO_PLAY_ITEMS,
      payload: {
        itemIds,
      },
    });
  });
});
