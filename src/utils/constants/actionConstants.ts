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
export const ADD_PLAYLIST_TO_LIST_TO_PLAY = "ADD_PLAYLIST_TO_LIST_TO_PLAY" as const;
export const REMOVE_PLAYLIST_FROM_LIST_TO_PLAY = "REMOVE_PLAYLIST_FROM_LIST_TO_PLAY" as const;
export const REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY = "REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY" as const;
export const DELETE_PLAYLIST_BY_ID = "DELETE_PLAYLIST_BY_ID" as const;
export const DELETE_PLAYLIST_ITEM_BY_ID = "DELETE_PLAYLIST_ITEM_BY_ID";
export const DELETE_PLAYLIST_ITEMS_BY_ID = "DELETE_PLAYLIST_ITEMS_BY_ID";
export const SYNC_PLAYLIST_FROM_YT_BY_ID = "SYNC_PLAYLIST_FROM_YT_BY_ID" as const;
export const SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS = "SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS" as const;
export const SYNC_PLAYLIST_FROM_YT_BY_ID_FAILED = "SYNC_PLAYLIST_FROM_YT_BY_ID_FAILED" as const;
export const UPDATE_PLAYLIST_NAME_BY_ID = "UPDATE_PLAYLIST_NAME_BY_ID" as const;
export const ADD_ALL_IN_PLAYING_LABEL_BY_ID = "ADD_ALL_IN_PLAYING_LABEL_BY_ID" as const;
export const REMOVE_ALL_IN_PLAYING_LABEL_BY_ID =
  "REMOVE_ALL_IN_PLAYING_LABEL_BY_ID";
export const ADD_PARTIAL_IN_PLAYING_LABEL_BY_ID = "ADD_PARTIAL_IN_PLAYING_LABEL_BY_ID" as const;
export const REMOVE_PARTIAL_IN_PLAYING_LABEL_BY_ID =
  "REMOVE_PARTIAL_IN_PLAYING_LABEL_BY_ID";

// =========================
// ytplaylist videos
// =========================
export const ADD_VIDEO = "ADD_VIDEO" as const;
export const ADD_VIDEO_TO_LIST_TO_PLAY = "ADD_VIDEO_TO_LIST_TO_PLAY" as const;
export const ADD_VIDEOS_TO_LIST_TO_PLAY = "ADD_VIDEOS_TO_LIST_TO_PLAY" as const;
export const REMOVE_VIDEO_FROM_LIST_TO_PLAY = "REMOVE_VIDEO_FROM_LIST_TO_PLAY" as const;
export const REMOVE_VIDEOS_FROM_LIST_TO_PLAY = "REMOVE_VIDEOS_FROM_LIST_TO_PLAY" as const;
export const DELETE_VIDEO_BY_ID = "DELETE_VIDEO_BY_ID" as const;
export const UPDATE_VIDEO_NAME_BY_ID = "UPDATE_VIDEO_NAME_BY_ID" as const;
export const SHUFFLE_PLAYLIST_ITEMS = "SHUFFLE_PLAYLIST_ITEMS" as const;

// =========================
// ytplaylist listToPlay
// =========================
export const ADD_LIST_TO_PLAY = "ADD_LIST_TO_PLAY" as const;
export const ADD_UNIQUE_LIST_TO_PLAY = "ADD_UNIQUE_LIST_TO_PLAY" as const;
export const ADD_LIST_TO_PLAY_ITEM = "ADD_LIST_TO_PLAY_ITEM" as const;
export const ADD_LIST_TO_PLAY_ITEMS = "ADD_LIST_TO_PLAY_ITEMS" as const;
export const UPDATE_LIST_TO_PLAY = "UPDATE_LIST_TO_PLAY" as const;
export const DELETE_LIST_TO_PLAY_ITEM_BY_ID = "DELETE_LIST_TO_PLAY_ITEM_BY_ID" as const;
export const DELETE_LIST_TO_PLAY_ITEMS = "DELETE_LIST_TO_PLAY_ITEMS" as const;
export const CLEAR_LIST_TO_PLAY = "CLEAR_LIST_TO_PLAY" as const;
export const SHUFFLE_LIST_TO_PLAY = "SHUFFLE_LIST_TO_PLAY" as const;
export const CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY = "CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY" as const;
export const FILTER_LIST_TO_PLAY_ITEMS = "FILTER_LIST_TO_PLAY_ITEMS" as const;
export const QUEUE_LIST_TO_PLAY_ITEM = "QUEUE_LIST_TO_PLAY_ITEM" as const;

// =========================
// ytplaylist filtered
// =========================
export const CREATE_FUSE = "CREATE_FUSE" as const;
export const FUZZY_SEARCH_SNIPPETS_BY_TITLE = "FUZZY_SEARCH_SNIPPETS_BY_TITLE" as const;
export const CLEAR_FILTERED_SNIPPETS = "CLEAR_FILTERED_SNIPPETS" as const;
export const REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS = "REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS" as const;
