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
import { addNormListToPlayAction } from "store/ytplaylist/normAction";

export default () => {
  if (!localStorage.getItem("migrated")) {
    const appState = store.getState();
    const ytplaylist = appState.ytplaylist;
    const listToPlayFromRedux = ytplaylist.listToPlay;

    // makes listToPlayFromRedux all unique by snippetId before normalize
    const uniqueListToPlayFromRedux = uniqBy(
      listToPlayFromRedux,
      "snippet.resourceId.videoId"
    );

    const normListToPlay = schemas.normalizeListToPlay(
      uniqueListToPlayFromRedux
    );

    // migrate listToPlay
    store.dispatch(
      addNormListToPlayAction(normListToPlay.entities, normListToPlay.result)
    );

    localStorage.setItem("migrated", "1");
  }
};
