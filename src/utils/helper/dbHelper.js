import localforage from "localforage";

/**
 * Base class for customized indexedDB databases
 *
 * @class LocalForageIndexedDB
 */
class LocalForageIndexedDB {
  _config;
  _dbInstance;

  constructor(config) {
    this._config = config;
    this._dbInstance = localforage.createInstance(config);
  }

  /**
   * Obtain local forage instance of particular indexedDB
   *
   * @return local forage db instance
   * @memberof LocalForageIndexedDB
   */
  getInstance() {
    return this._dbInstance;
  }
}

/**
 *
 * A class that performs all sorts of ops related to playlistDB in indexedDB
 * @class PlaylistDB
 * @extends LocalForageIndexedDB
 */
class PlaylistDB extends LocalForageIndexedDB {
  constructor() {
    super({
      name: "playlistDB",
      storeName: "playlists",
    });
  }

  /**
   * Add playlists to indexedDB
   *
   * @param {Array<Object>} playlists Playlists to be added to indexedDB
   * @memberof PlaylistDB
   */
  addPlaylists(playlists) {
    playlists.forEach((playlist) => {
      this._dbInstance
        .setItem(playlist.id, playlist)
        .then(() =>
          console.log(
            `Successfully added playlist-${playlist.id} to playlistDB`
          )
        )
        .catch((err) => console.error(err));
    });
  }

  /**
   * Update single playlist in indexedDB
   *
   * @param {string} playlistId Key for indexedDB store
   * @param {Object} playlist Playlist to update
   * @memberof PlaylistDB
   */
  updatePlaylist(playlistId, playlist) {
    this._dbInstance
      .setItem(playlistId, playlist)
      .then(() => console.log("Successfully saved playlist to playlistDB"))
      .catch((err) => console.error(err));
  }

  /**
   * Remove specified playlist(s) from indexedDB
   *
   * @param {Array<string>} playlistsToRemove
   * @memberof PlaylistDB
   */
  removePlaylists(playlistsToRemove) {
    playlistsToRemove.forEach((playlistId) => {
      this._dbInstance
        .removeItem(playlistId)
        .then(() => console.log(`Successfully removed playlist-${playlistId}`))
        .catch((err) => console.error(err));
    });
  }
}

/**
 * A class that performs all sorts of ops related to songListDB in indexedDB
 *
 * @class SongListDB
 * @extends {LocalForageIndexedDB}
 */
class SongListDB extends LocalForageIndexedDB {
  constructor() {
    super({
      name: "songListDB",
      storeName: "song_list",
    });
  }

  /**
   * Update listToPlay in indexedDB
   *
   * @param {Array<Object>} listToPlay
   * @memberof SongListDB
   */
  updateListToPlay(listToPlay) {
    this._dbInstance
      .setItem("listToPlay", listToPlay)
      .then(() => console.log("Successfully saved listToPlay to songListDB"))
      .catch((err) => console.error(err));
  }

  /**
   * Remove listToPlay in indexedDB
   *
   * @memberof SongListDB
   */
  removeListToPlay() {
    this._dbInstance
      .removeItem("listToPlay")
      .then(() =>
        console.log("Successfully removed listToPlay from songListDB")
      )
      .catch((err) => console.error(err));
  }

  /**
   * Update playing playlists in indexedDB
   *
   * @param {Array<string>} playlists Playlists to be saved into indexedDB
   * @memberof SongListDB
   */
  updatePlayingPlaylists(playlists) {
    this._dbInstance
      .setItem("playingPlaylists", playlists)
      .then(() =>
        console.log("Successfully saved playingPlaylists to songListDB")
      )
      .catch((err) => console.error(err));
  }

  /**
   * Remove playingPlaylists in indexedDB
   *
   * @memberof SongListDB
   */
  removePlayingPlaylists() {
    this._dbInstance
      .removeItem("playingPlaylists")
      .then(() =>
        console.log("Successfully removed playingPlaylists from songListDB")
      )
      .catch((err) => console.error(err));
  }

  /**
   * Update playingVideos in indexedDB
   *
   * @param {Array<string>} videos
   * @memberof SongListDB
   */
  updatePlayingVideos(videos) {
    this._dbInstance
      .setItem("playingVideos", videos)
      .then(() => console.log("Successfully saved playingVideos to songListDB"))
      .catch((err) => console.error(err));
  }

  /**
   * Remove playingVideos in indexedDB
   *
   * @memberof SongListDB
   */
  removePlayingVideos() {
    this._dbInstance
      .removeItem("playingVideos")
      .then(() =>
        console.log("Successfully removed playingVideos from songListDB")
      )
      .catch((err) => console.error(err));
  }
}

/**
 * A class that performs all sorts of ops related to videos in playlistDB in indexedDB
 *
 * @class VideosDB
 * @extends {LocalForageIndexedDB}
 */
class VideosDB extends LocalForageIndexedDB {
  constructor() {
    super({
      name: "playlistDB",
      storeName: "videos",
    });
  }

  /**
   * Add videos to indexedDB
   *
   * @param {Object} videos
   * @memberof VideosDB
   */
  addVideos(videos) {
    videos.forEach((video) => {
      this._dbInstance
        .setItem(video.id, video)
        .then(() => {
          console.log(`Successfully added video-${video.id} to playlistDB`);
        })
        .catch((err) => console.error(err));
    });
  }

  /**
   * Remove video in indexedDB based on id
   *
   * @param {string} videoId
   * @memberof VideosDB
   */
  removeVideo(videoId) {
    this._dbInstance
      .removeItem(videoId)
      .then(() => console.log(`Successfully removed video-${videoId}`))
      .catch((err) => console.error(err));
  }
}

/**
 * A class that stores informations related to user preferences to indexedDB
 *
 * @class PreferencesDB
 * @extends {LocalForageIndexedDB}
 */
class PreferencesDB extends LocalForageIndexedDB {
  constructor() {
    super({
      name: "preferencesDB",
      storeName: "theme",
    });
  }

  /**
   * Store user preferred theme (dark/light) to indexedDB
   *
   * @param {boolean} isPreferDarkTheme
   * @memberof PreferencesDB
   */
  setDarkTheme(isPreferDarkTheme) {
    this._dbInstance
      .setItem("darkTheme", isPreferDarkTheme)
      .then(() => console.log("Successfully saved preferred theme"))
      .catch((err) => console.error(err));
  }
}

export { PlaylistDB, SongListDB, VideosDB, PreferencesDB };
