import deepFreeze from "deep-freeze";
import {
  ADD_NORM_LIST_TO_PLAY,
  ADD_NORM_LIST_TO_PLAY_ITEM,
  ADD_NORM_LIST_TO_PLAY_ITEMS,
  ADD_UNIQUE_NORM_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID,
  DELETE_NORM_LIST_TO_PLAY_ITEMS,
  FILTER_LIST_TO_PLAY_ITEMS,
  SHUFFLE_LIST_TO_PLAY,
  UPDATE_NORM_LIST_TO_PLAY,
} from "utils/constants/actionConstants";

import {
  addNormListToPlayAction,
  addNormListToPlayItemAction,
  addNormListToPlayItemsAction,
  addUniqueNormListToPlay,
  clearListToPlayAction,
  deleteNormListToPlayItemByIdAction,
  deleteNormListToPlayItemsAction,
  filterListToPlayItemsAction,
  shuffleListToPlayAction,
  updateNormListToPlayAction,
} from "./listToPlayActions";
import { NormListToPlayEntities, NormListToPlayResultItem } from "./types";

const listToPlayEntities: NormListToPlayEntities = {
  playlistItems: {},
  videoItems: {},
};

const listToPlayResultItem: NormListToPlayResultItem = {
  id: "itemId-1",
  schema: "playlistItems",
};

const itemIds = ["itemId-1", "itemId-2"];
const foreignKey = "foreignKey-1";

deepFreeze(listToPlayEntities);
deepFreeze(listToPlayResultItem);
deepFreeze(itemIds);

describe("listToPlay actions", () => {
  test("should create ADD_NORM_LIST_TO_PLAY action object", () => {
    expect(addNormListToPlayAction(listToPlayEntities, [])).toEqual({
      type: ADD_NORM_LIST_TO_PLAY,
      payload: {
        entities: listToPlayEntities,
        result: [],
      },
    });
  });

  test("should create ADD_UNIQUE_NORM_LIST_TO_PLAY action object", () => {
    expect(addUniqueNormListToPlay(listToPlayEntities, [])).toEqual({
      type: ADD_UNIQUE_NORM_LIST_TO_PLAY,
      payload: {
        entities: listToPlayEntities,
        result: [],
      },
    });
  });

  test("should create ADD_NORM_LIST_TO_PLAY_ITEM action object", () => {
    expect(
      addNormListToPlayItemAction(listToPlayResultItem, foreignKey)
    ).toEqual({
      type: ADD_NORM_LIST_TO_PLAY_ITEM,
      payload: {
        resultItem: listToPlayResultItem,
        foreignKey,
      },
    });
  });

  test("should create ADD_NORM_LIST_TO_PLAY_ITEMS action object", () => {
    const items = [
      {
        resultItem: listToPlayResultItem,
        foreignKey,
      },
    ];
    expect(addNormListToPlayItemsAction(items)).toEqual({
      type: ADD_NORM_LIST_TO_PLAY_ITEMS,
      payload: {
        items,
      },
    });
  });

  test("should create UPDATE_NORM_LIST_TO_PLAY action object", () => {
    expect(
      updateNormListToPlayAction("playlistItems", foreignKey, itemIds)
    ).toEqual({
      type: UPDATE_NORM_LIST_TO_PLAY,
      payload: {
        schema: "playlistItems",
        foreignKey,
        itemIds,
      },
    });
  });

  test("should create DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID action object", () => {
    expect(deleteNormListToPlayItemByIdAction(itemIds[0])).toEqual({
      type: DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID,
      payload: {
        id: itemIds[0],
      },
    });
  });

  test("should DELETE_NORM_LIST_TO_PLAY_ITEMS action object", () => {
    expect(deleteNormListToPlayItemsAction(itemIds)).toEqual({
      type: DELETE_NORM_LIST_TO_PLAY_ITEMS,
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

  test("should create FILTER_LIST_TO_PLAY_ITEMS action object", () => {
    expect(filterListToPlayItemsAction(itemIds)).toEqual({
      type: FILTER_LIST_TO_PLAY_ITEMS,
      payload: {
        itemIds,
      },
    });
  });
});
