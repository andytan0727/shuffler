import { PlaylistDB, SongListDB, VideosDB, PreferencesDB } from "./dbHelper";
import { setPreferDarkTheme } from "../../store/userPreferences/action";
import {
  addPlaylist,
  addListToPlay,
  addPlayingPlaylists,

  // videos
  addVideo,
  addPlayingVideos,
} from "../../store/ytplaylist/action";

/**
 * Hydrate states stored in indexedDB to Redux
 *
 * @param {*} store Redux store
 */
export const hydrateRedux = async (store) => {
  const playlistDBInstance = new PlaylistDB().getInstance();
  const songListDBInstance = new SongListDB().getInstance();
  const videosDBInstance = new VideosDB().getInstance();
  const preferencesDBInstance = new PreferencesDB().getInstance();

  try {
    // hydrate user theme preference
    const isPreferDarkTheme = await preferencesDBInstance.getItem("darkTheme");
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
  } catch (err) {
    console.error(err.message);
  }

  try {
    // hydrate playlist
    const dbPlaylistKeys = await playlistDBInstance.keys();
    if (!dbPlaylistKeys.length) {
      throw new Error("Playlist not found in indexedDB");
    }

    await playlistDBInstance.iterate((value, _) => {
      store.dispatch(
        addPlaylist({
          persist: false,
          playlist: value,
        })
      );
    });
  } catch (err) {
    console.error(err.message);
  }

  try {
    // hydrate videos
    const dbVideosKeys = await videosDBInstance.keys();
    if (!dbVideosKeys.length) throw new Error("Videos not found in indexedDB");

    await videosDBInstance.iterate((value, _) => {
      store.dispatch(
        addVideo({
          persist: false,
          video: value,
        })
      );
    });
  } catch (err) {
    console.error(err.message);
  }

  try {
    // hydrate list to play
    const dbSongListArr = await songListDBInstance.getItem("listToPlay");
    if (!dbSongListArr || !dbSongListArr.length) {
      throw new Error("SongList to play not found in indexedDB");
    }

    store.dispatch(
      addListToPlay({
        checked: false,
        persist: false,
        listToAdd: dbSongListArr,
      })
    );
  } catch (err) {
    console.error(err.message);
  }

  try {
    // hydrate playing playlists
    const dbPlayingPlaylistsArr = await songListDBInstance.getItem(
      "playingPlaylists"
    );
    if (!dbPlayingPlaylistsArr || !dbPlayingPlaylistsArr.length) {
      throw new Error("Playing playlists not found in indexedDB");
    }

    store.dispatch(addPlayingPlaylists(dbPlayingPlaylistsArr, false));
  } catch (err) {
    console.error(err.message);
  }

  try {
    // hydrate playing videos
    const dbPlayingVideosArr = await songListDBInstance.getItem(
      "playingVideos"
    );
    if (!dbPlayingVideosArr || !dbPlayingVideosArr.length)
      throw new Error("Playing videos not found in indexedDB");

    store.dispatch(addPlayingVideos(dbPlayingVideosArr, false));
  } catch (err) {
    console.error(err.message);
  }
};
