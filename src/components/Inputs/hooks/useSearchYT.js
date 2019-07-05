import { useState, useCallback } from "react";
import store from "../../../store";
import { notify } from "../../../utils/helper/notifyHelper";
import {
  fetchVideoDataAction,
  fetchPlaylistDataAction,
} from "../../../store/ytapi/action";

/**
 *  @typedef {function(InputChangeEvent):void} InputChangeHandler
 */

/**
 * @typedef {function(ButtonOnClickEvent):void} ButtonClickHandler
 */

/** @type {Partial<YTAPIState>} */
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
 * @param {ItemType} inputType Type of url to validate
 * @param {string} value Input value to be validated
 */
const _validateInput = (inputType, value) => {
  const regex =
    inputType === "playlist"
      ? /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/
      : /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

  const regexResults = regex.exec(value);
  const validationResult = regexResults && regexResults[1];
  return validationResult;
};

/**
 * Search playlist when search button is pressed
 *
 * @param {string} value Input value
 */
const _searchPlaylist = (value) => {
  const playlistId = _validateInput("playlist", value);

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
 * @param {string} value Input value
 */
const _searchVideo = (value) => {
  const videoId = _validateInput("video", value);

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
 * @param {ItemType} searchType
 * @returns {{
 *   inputVal: string;
 *   setInputVal?: function(string):void;
 *   searchYT?: function(string):void;
 *   handleInputChange?: InputChangeHandler;
 *   handleSearchYT?: ButtonClickHandler;
 * }}
 *
 */
export const useSearchYT = (searchType) => {
  const [inputVal, setInputVal] = useState("");

  /**
   * Handle search input value change
   *
   * Recommended function to import for handling input change on client to avoid repetition
   *
   */
  const handleInputChange = useCallback(
    /**
     * @param {InputChangeEvent} e
     */
    (e) => {
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
    searchType === "playlist" ? _searchPlaylist : _searchVideo,
    [searchType]
  );

  /**
   * Handle search YT video/playlist on event triggered (e.g. button click)
   *
   * Recommended function to import for default search behavior
   */
  const handleSearchYT = useCallback(
    /**
     * @param {ButtonOnClickEvent} e
     */
    (e) => {
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
