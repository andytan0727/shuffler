import localforage from "localforage";

const dbPlaylist = localforage.createInstance({
  name: "playlistDB",
  storeName: "playlists"
});

const dbSongList = localforage.createInstance({
  name: "songListDB",
  storeName: "song_list"
});

export { dbPlaylist, dbSongList };
