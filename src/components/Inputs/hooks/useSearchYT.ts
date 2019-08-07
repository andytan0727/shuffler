import { useCallback, useState } from "react";
import store from "store";
import {
  fetchPlaylistDataAction,
  fetchVideoDataAction,
} from "store/ytapi/action";
import { notify } from "utils/helper/notifyHelper";

const {
  apiKey,
  videos: {
    apiBaseUrl: videoApiBaseUrl,
    options: {
      part: videoPart,
      maxResults: videoMaxResults,
      fields: videoFields,
    },
  },
  playlistItems: {
    apiBaseUrl: playlistApiBaseUrl,
    options: {
      part: playlistPart,
      maxResults: playlistMaxResults,
      fields: playlistFields,
    },
  },
} = store.getState().ytapi;

/**
 * Validate whether playlist/video url is valid
 *
 * @param inputType Type of url to validate
 * @param value Input value to be validated
 */
const _validateInput = (inputType: MediaSourceType, value: string) => {
  const regex =
    inputType === "playlists"
      ? /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/
      : /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

  const regexResults = regex.exec(value);
  const validationResult = regexResults && regexResults[1];
  return validationResult;
};

/**
 * Search playlist when search button is pressed
 *
 * @param value Input value
 */
const _searchPlaylist = (value: string) => {
  const playlistId = _validateInput("playlists", value);

  if (!value) {
    notify("warning", "⚠️ Please don't submit empty input");
    return;
  }

  if (!playlistId) {
    notify("warning", "⚠️ Please enter a valid playlist url");
    return;
  }

  store.dispatch(
    fetchPlaylistDataAction(playlistApiBaseUrl, {
      part: playlistPart,
      maxResults: playlistMaxResults,
      playlistId,
      fields: playlistFields,
      apiKey,
    })
  );
};

/**
 * Search video when search button is pressed
 *
 * @param value Input value
 */
const _searchVideo = (value: string) => {
  const videoId = _validateInput("videos", value);

  if (!value) {
    notify("warning", "⚠️ Please don't submit empty input");
    return;
  }

  if (!videoId) {
    notify("warning", "⚠️ Please enter a valid video url");
    return;
  }

  store.dispatch(
    fetchVideoDataAction(videoApiBaseUrl, {
      part: videoPart,
      maxResults: videoMaxResults,
      id: videoId,
      fields: videoFields,
      apiKey,
    })
  );
};

/**
 *
 * useSearchYT hook - search for video/playlist from YouTube Data API
 *
 * @param searchType
 *
 */
export const useSearchYT = (
  searchType: MediaSourceType
): {
  inputVal: string;
  setInputVal: (arg0: string) => void;
  searchYT: (arg0: string) => void;
  handleInputChange: (e: InputChangeEvent) => void;
  handleSearchYT: (e: OnClickEvent) => void;
} => {
  const [inputVal, setInputVal] = useState("");

  /**
   * Handle search input value change
   *
   * Recommended function to import for handling input change on client to avoid repetition
   *
   */
  const handleInputChange = useCallback(
    (e: InputChangeEvent) => {
      setInputVal(e.target.value);
    },
    [setInputVal]
  );

  /**
   * @function
   *
   * Lower level search function for customized search behavior
   *
   */
  const searchYT = useCallback(
    searchType === "playlists" ? _searchPlaylist : _searchVideo,
    [searchType]
  );

  /**
   * Handle search YT video/playlist on event triggered (e.g. button click)
   *
   * Recommended function to import for default search behavior
   */
  const handleSearchYT = useCallback(
    (e: OnClickEvent) => {
      e.preventDefault();
      searchYT(inputVal);
      setInputVal("");
    },
    [inputVal, searchYT]
  );

  return {
    inputVal,
    setInputVal,
    handleInputChange,
    searchYT,
    handleSearchYT,
  };
};
