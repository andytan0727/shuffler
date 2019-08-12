/**
 *
 * This script is used to migrate persisted redux states, ytplaylist stored by
 * redux-persist to ytplaylistNormalized.
 *
 * The specific states to be migrated are:
 * ytplaylist playlists, videos and listToPlay states.
 *
 */

import uniqBy from "lodash/uniqBy";
import * as schemas from "schemas";
import store from "store";
import {
  addAllInPlayingLabelByIdAction,
  addNormListToPlayAction,
  addNormPlaylistAction,
  addNormVideoAction,
} from "store/ytplaylist/normAction";

export default () => {
  if (!localStorage.getItem("migrated")) {
    const appState = store.getState();
    const ytplaylist = appState.ytplaylist;
    const playlistsFromRedux = ytplaylist.playlists;
    const videosFromRedux = ytplaylist.videos;
    const listToPlayFromRedux = ytplaylist.listToPlay;
    const playingPlaylists = ytplaylist.playingPlaylists;

    // makes listToPlayFromRedux all unique by snippetId before normalize
    const uniqueListToPlayFromRedux = uniqBy(
      listToPlayFromRedux,
      "snippet.resourceId.videoId"
    );

    const normPlaylists = schemas.normalizePlaylists(playlistsFromRedux);
    const normVideos = schemas.normalizeVideos(videosFromRedux);
    const normListToPlay = schemas.normalizeListToPlay(
      uniqueListToPlayFromRedux
    );

    // migrate playlists and label it as allInPlaying if it exists in playingPlaylists
    store.dispatch(
      addNormPlaylistAction(normPlaylists.entities, normPlaylists.result)
    );
    playingPlaylists.forEach((id) => {
      store.dispatch(addAllInPlayingLabelByIdAction(id));
    });

    // migrate videos
    store.dispatch(addNormVideoAction(normVideos.entities, normVideos.result));

    // migrate listToPlay
    store.dispatch(
      addNormListToPlayAction(normListToPlay.entities, normListToPlay.result)
    );

    localStorage.setItem("migrated", "1");
  }
};
