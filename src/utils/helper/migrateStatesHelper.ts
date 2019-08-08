/**
 *
 * This script is used to migrate persisted redux states, ytplaylist stored by
 * redux-persist to ytplaylistNormalized.
 *
 * The specific states to be migrated are:
 * ytplaylist playlists, videos and listToPlay states.
 *
 */

import * as schemas from "schemas";
import store from "store";
import {
  addAllInPlayingLabelByIdAction,
  addNormListToPlayAction,
  addNormPlaylistAction,
  addNormVideoAction,
} from "store/ytplaylist/normAction";

export default () => {
  const appState = store.getState();
  const ytplaylist = appState.ytplaylist;
  const playlistsFromRedux = ytplaylist.playlists;
  const videosFromRedux = ytplaylist.videos;
  const listToPlayFromRedux = ytplaylist.listToPlay;
  const playingPlaylists = ytplaylist.playingPlaylists;

  const normPlaylists = schemas.normalizePlaylists(playlistsFromRedux);
  const normVideos = schemas.normalizeVideos(videosFromRedux);
  const normListToPlay = schemas.normalizeListToPlay(listToPlayFromRedux);

  store.dispatch(
    addNormPlaylistAction(normPlaylists.entities, normPlaylists.result)
  );

  store.dispatch(addNormVideoAction(normVideos.entities, normVideos.result));

  store.dispatch(
    addNormListToPlayAction(normListToPlay.entities, normListToPlay.result)
  );

  playingPlaylists.forEach((id) => {
    store.dispatch(addAllInPlayingLabelByIdAction(id));
  });
};
