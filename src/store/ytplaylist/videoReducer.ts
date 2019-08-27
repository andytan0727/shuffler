import produce, { Draft, original } from "immer";
import uniq from "lodash/uniq";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { DeepReadonlyVideos, Videos, YTPlaylistActions } from "./types";
import {
  deletePlaylistOrVideoById,
  mergeEntities,
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
    case ActionTypes.ADD_VIDEO: {
      const prevResult = original(draft.result);

      if (prevResult) {
        const { entities, result } = action.payload;
        const uniqueVideoResult = uniq([...prevResult, ...result]);

        return mergeEntities(draft, entities, uniqueVideoResult);
      }

      return draft;
    }

    case ActionTypes.UPDATE_VIDEO_NAME_BY_ID: {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "videos",
      });
    }

    case ActionTypes.DELETE_VIDEO_BY_ID: {
      const { id } = action.payload;

      return deletePlaylistOrVideoById(draft, id);
    }

    default: {
      return draft;
    }
  }
}, initialVideosState);
