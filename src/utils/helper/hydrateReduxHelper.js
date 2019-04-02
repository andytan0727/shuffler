import { dbPlaylist, dbSongList, dbPreferences } from "./dbHelper";
import { notify } from "./notifyHelper";
import { setPreferDarkTheme } from "../../store/userPreferences/action";
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

    const isPreferDarkTheme = await dbPreferences.getItem("darkTheme");
    // throws error if isPreferDarkTheme is not saved
    if (isPreferDarkTheme == null) {
      throw new Error("dark theme setting is not found in indexedDB");
    }

    store.dispatch(
      setPreferDarkTheme({
        persist: false,
        isPreferDarkTheme,
      })
    );

    // notify user for success saved data loading
    notify("success", "💖 Loaded saved data");

    console.log("Successfully hydrates Redux with stored indexedDB data");

    // set loadedFromDB to true
    store.dispatch(setLoadedFromDB());
  } catch (err) {
    console.error(err.message);
  }
};
