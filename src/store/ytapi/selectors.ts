import { createSelector } from "reselect";
import { AppState } from "store";

export const selectYTApi = (state: AppState) => state.ytapi;

export const selectYTApiKey = createSelector(
  selectYTApi,
  (ytapi) => ytapi.apiKey
);

export const selectPlaylistBaseUrl = createSelector(
  selectYTApi,
  (ytapi) => ytapi.playlistItems.apiBaseUrl
);

export const selectPlaylistParams = createSelector(
  selectYTApi,
  (ytapi) => ytapi.playlistItems.options
);
