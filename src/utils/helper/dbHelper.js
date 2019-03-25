import localforage from "localforage";

const dbPlaylist = localforage.createInstance({
  name: "playlistDB",
  storeName: "playlists"
});

const dbFetchedItem = localforage.createInstance({
  name: "playlistDB",
  storeName: "ids"
});

const dbSongList = localforage.createInstance({
  name: "songListDB",
  storeName: "song_list"
});

export { dbPlaylist, dbFetchedItem, dbSongList };
