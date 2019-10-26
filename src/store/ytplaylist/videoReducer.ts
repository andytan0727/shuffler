import produce, { Draft } from "immer";
import { Reducer } from "typesafe-actions";
import {
  ADD_VIDEO,
  DELETE_VIDEO_BY_ID,
  UPDATE_VIDEO_NAME_BY_ID,
} from "utils/constants/actionConstants";

import { DeepReadonlyVideos, Videos, YTPlaylistActions } from "./types";
import {
  deepMergeStates,
  deletePlaylistOrVideoById,
  updatePlaylistOrVideoNameById,
} from "./utils";

const initialVideosState: DeepReadonlyVideos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

export const videosReducer: Reducer<
  DeepReadonlyVideos,
  YTPlaylistActions
> = produce((draft: Draft<Videos>, action: YTPlaylistActions) => {
  switch (action.type) {
    case ADD_VIDEO: {
      const { entities, result } = action.payload;
      return deepMergeStates(draft, entities, result);
    }

    case UPDATE_VIDEO_NAME_BY_ID: {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "videos",
      });
    }

    case DELETE_VIDEO_BY_ID: {
      const { id } = action.payload;

      return deletePlaylistOrVideoById(draft, id);
    }

    default: {
      return draft;
    }
  }
}, initialVideosState);
