/**
 *
 * This script is used to migrate persisted redux states, ytplaylist stored by
 * redux-persist to ytplaylistNormalized.
 *
 * The specific states to be migrated are:
 * ytplaylist playlists, videos and listToPlay states.
 *
 */

import store from "../../store";

import { normalizePlaylists } from "../../schemas/playlist";
import { normalizeVideos } from "../../schemas/video";
import { normalizeListToPlay } from "../../schemas/listToPlay";
import {
  addFetchedPlaylistAction,
  addFetchedVideoAction,
  addListToPlayItemsAction,
  setWholePlaylistInPlayingByIdAction,
} from "../../store/ytplaylist/action";

export default () => {
  const appState = store.getState();
  const ytplaylist = appState.ytplaylist;
  const playlistsFromRedux = ytplaylist.playlists;
  const videosFromRedux = ytplaylist.videos;
  const listToPlayFromRedux = ytplaylist.listToPlay;
  const playingPlaylists = ytplaylist.playingPlaylists;

  const normPlaylists = normalizePlaylists(playlistsFromRedux);
  const normVideos = normalizeVideos(videosFromRedux);
  const normListToPlay = normalizeListToPlay(listToPlayFromRedux);

  store.dispatch(
    addFetchedPlaylistAction(normPlaylists.entities, normPlaylists.result)
  );

  store.dispatch(addFetchedVideoAction(normVideos.entities, normVideos.result));

  store.dispatch(
    addListToPlayItemsAction(normListToPlay.entities, normListToPlay.result)
  );

  playingPlaylists.forEach((id) => {
    store.dispatch(setWholePlaylistInPlayingByIdAction(id));
  });
};
