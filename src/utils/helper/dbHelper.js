import localforage from "localforage";

const dbPlaylist = localforage.createInstance({
  name: "playlistDB",
  storeName: "playlists",
});

const dbSongList = localforage.createInstance({
  name: "songListDB",
  storeName: "song_list",
});

const dbVideos = localforage.createInstance({
  name: "playlistDB",
  storeName: "videos",
});

const dbPreferences = localforage.createInstance({
  name: "preferencesDB",
  storeName: "theme",
});

export { dbPlaylist, dbSongList, dbVideos, dbPreferences };
