import produce, { Draft, original } from "immer";
import uniq from "lodash/uniq";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { DeepRONormVideos, NormVideos, YTPlaylistNormedAction } from "./types";
import {
  deletePlaylistOrVideoById,
  mergeNormalizedEntities,
  updatePlaylistOrVideoNameById,
} from "./utils";

const initialVideosState: DeepRONormVideos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

export const videosReducer: Reducer<
  DeepRONormVideos,
  YTPlaylistNormedAction
> = produce((draft: Draft<NormVideos>, action: YTPlaylistNormedAction) => {
  switch (action.type) {
    case ActionTypes.ADD_NORM_VIDEO: {
      const prevResult = original(draft.result);

      if (prevResult) {
        const { result } = action.payload;

        return mergeNormalizedEntities(draft, {
          ...action,
          payload: {
            ...action.payload,
            result: uniq([...prevResult, ...result]),
          },
        });
      }

      return draft;
    }

    case ActionTypes.UPDATE_NORM_VIDEO_NAME_BY_ID: {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "videos",
      });
    }

    case ActionTypes.DELETE_NORM_VIDEO_BY_ID: {
      const { id } = action.payload;

      return deletePlaylistOrVideoById(draft, id);
    }

    default: {
      return draft;
    }
  }
}, initialVideosState);
