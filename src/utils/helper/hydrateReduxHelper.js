import { dbPlaylist, dbSongList } from "./dbHelper";
import { notify } from "./notifyHelper";
import {
  addPlaylist,
  addListToPlay,
  setLoadedFromDB,
} from "../../store/ytplaylist/action";

/**
 * Hydrate states stored in indexedDB to Redux
 *
 * @param {*} store Redux store
 */
export const hydrateRedux = async (store) => {
  try {
    // hydrate playlist
    const dbPlaylistKeys = await dbPlaylist.keys();
    if (!dbPlaylistKeys.length) {
      throw new Error("Playlist not found in indexedDB");
    }

    await dbPlaylist.iterate((value, _) => {
      console.log("value = ", value);
      store.dispatch(
        addPlaylist({
          persist: false,
          playlist: value,
        })
      );
    });

    // hydrate list to play
    const dbSongListArr = await dbSongList.getItem("listToPlay");
    if (!dbSongListArr || !dbSongListArr.length) {
      throw new Error("SongList to play not found in indexedDB");
    }

    store.dispatch(
      addListToPlay({
        persist: false,
        listToAdd: dbSongListArr,
      })
    );

    // notify user for success songlist loading
    notify("success", "💖 Loaded saved playlists");

    console.log("Successfully hydrates Redux with stored indexedDB data");

    // set loadedFromDB to true
    store.dispatch(setLoadedFromDB());
  } catch (err) {
    console.error(err.message);
  }
};
