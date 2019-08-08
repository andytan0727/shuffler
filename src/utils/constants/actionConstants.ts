// =========================
// userPreferences
// =========================
export const SET_PREFER_DARK_THEME = "SET_PREFER_DARK_THEME" as const;

// =========================
// ytapi
// =========================
export const FETCH_PLAYLIST_DATA = "FETCH_PLAYLIST_DATA" as const;
export const FETCH_PLAYLIST_DATA_SUCCESS = "FETCH_PLAYLIST_DATA_SUCCESS" as const;
export const FETCH_PLAYLIST_DATA_FAILED = "FETCH_PLAYLIST_DATA_FAILED" as const;
export const ADD_FETCHED_PLAYLIST_ID = "ADD_FETCHED_PLAYLIST_ID" as const;
export const SET_PLAYLIST_URL = "SET_PLAYLIST_URL" as const;
export const FETCH_VIDEO_DATA = "FETCH_VIDEO_DATA" as const;
export const FETCH_VIDEO_DATA_SUCCESS = "FETCH_VIDEO_DATA_SUCCESS" as const;
export const FETCH_VIDEO_DATA_FAILED = "FETCH_VIDEO_DATA_FAILED" as const;
export const ADD_FETCHED_VIDEO_ID = "ADD_FETCHED_VIDEO_ID" as const;
export const SET_VIDEO_URL = "SET_VIDEO_URL" as const;

// =========================
// ytplayer
// =========================
export const SET_CURRENT_SONG_IDX = "SET_CURRENT_SONG_IDX" as const;
export const SET_VIDEO_PLAYING = "SET_VIDEO_PLAYING" as const;
export const TOGGLE_REPEAT = "TOGGLE_REPEAT" as const;

// =========================
// ytplaylist playlists
// =========================
export const ADD_PLAYLIST = "ADD_PLAYLIST" as const;
export const DELETE_PLAYLISTS = "DELETE_PLAYLISTS" as const;
export const RENAME_PLAYLIST = "RENAME_PLAYLIST" as const;
export const SET_CHECKED_PLAYLISTS = "SET_CHECKED_PLAYLISTS" as const;
export const ADD_PLAYING_PLAYLISTS = "ADD_PLAYING_PLAYLISTS" as const;
export const REMOVE_PLAYING_PLAYLISTS = "REMOVE_PLAYING_PLAYLISTS" as const;
export const REMOVE_PLAYLIST_FROM_PLAYING = "REMOVE_PLAYLIST_FROM_PLAYING" as const; // deprecated
export const ADD_PLAYLISTS_TO_LIST_TO_PLAY = "ADD_PLAYLISTS_TO_LIST_TO_PLAY" as const;
export const REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY = "REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY" as const;

export const ADD_NORM_PLAYLIST = "ADD_NORM_PLAYLIST" as const;
export const ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY = "ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY" as const;
export const REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY = "REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY" as const;
export const DELETE_NORM_PLAYLIST_BY_ID = "DELETE_NORM_PLAYLIST_BY_ID" as const;
export const DELETE_NORM_PLAYLIST_ITEM_BY_ID =
  "DELETE_NORM_PLAYLIST_ITEM_BY_ID";
export const UPDATE_NORM_PLAYLIST_NAME_BY_ID = "UPDATE_NORM_PLAYLIST_NAME_BY_ID" as const;
export const ADD_ALL_IN_PLAYING_LABEL_BY_ID = "ADD_ALL_IN_PLAYING_LABEL_BY_ID" as const;
export const REMOVE_ALL_IN_PLAYING_LABEL_BY_ID =
  "REMOVE_ALL_IN_PLAYING_LABEL_BY_ID";

// =========================
// ytplaylist videos
// =========================
export const ADD_VIDEO = "ADD_VIDEO" as const;
export const DELETE_VIDEOS = "DELETE_VIDEOS" as const;
export const SET_CHECKED_VIDEOS = "SET_CHECKED_VIDEOS" as const;
export const ADD_PLAYING_VIDEOS = "ADD_PLAYING_VIDEOS" as const;
export const REMOVE_PLAYING_VIDEOS = "REMOVE_PLAYING_VIDEOS" as const;
export const TOGGLE_PLAYING_VIDEO = "TOGGLE_PLAYING_VIDEO" as const;
export const ADD_VIDEOS_TO_LIST_TO_PLAY = "ADD_VIDEOS_TO_LIST_TO_PLAY" as const;
export const REMOVE_VIDEOS_FROM_LIST_TO_PLAY = "REMOVE_VIDEOS_FROM_LIST_TO_PLAY" as const;

export const ADD_NORM_VIDEO = "ADD_NORM_VIDEO" as const;
export const DELETE_NORM_VIDEO_BY_ID = "DELETE_NORM_VIDEO_BY_ID" as const;
export const UPDATE_NORM_VIDEO_NAME_BY_ID = "UPDATE_NORM_VIDEO_NAME_BY_ID" as const;
export const SHUFFLE_NORM_PLAYLIST_ITEMS = "SHUFFLE_NORM_PLAYLIST_ITEMS" as const;

// =========================
// ytplaylist listToPlay
// =========================
export const APPEND_LIST_TO_PLAY = "APPEND_LIST_TO_PLAY" as const;
export const REMOVE_FROM_LIST_TO_PLAY = "REMOVE_FROM_LIST_TO_PLAY" as const;
export const UPDATE_LIST_TO_PLAY = "UPDATE_LIST_TO_PLAY" as const;
export const CLEAR_LIST_TO_PLAY = "CLEAR_LIST_TO_PLAY" as const;
export const SHUFFLE_LIST_TO_PLAY = "SHUFFLE_LIST_TO_PLAY" as const;

export const ADD_NORM_LIST_TO_PLAY = "ADD_NORM_LIST_TO_PLAY" as const;
export const ADD_NORM_LIST_TO_PLAY_ITEM = "ADD_NORM_LIST_TO_PLAY_ITEM" as const;
export const ADD_NORM_LIST_TO_PLAY_ITEMS = "ADD_NORM_LIST_TO_PLAY_ITEMS" as const;
export const UPDATE_NORM_LIST_TO_PLAY = "UPDATE_NORM_LIST_TO_PLAY" as const;
export const DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID = "DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID" as const;
export const DELETE_NORM_LIST_TO_PLAY_ITEMS = "DELETE_NORM_LIST_TO_PLAY_ITEMS" as const;
