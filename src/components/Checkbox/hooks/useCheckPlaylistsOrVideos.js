import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addOrRemove } from "../../../utils/helper/arrayHelper";
import {
  setCheckedPlaylistsAction,
  setCheckedVideosAction,
} from "../../../store/ytplaylist/action";
import {
  checkedPlaylistsSelector,
  checkedVideosSelector,
} from "../../../store/ytplaylist/selector";

/**
 * useCheckPlaylistsOrVideos hooks to handle selection checkbox of videos/playlists and save to store
 *
 * @param {ItemType} itemType Type of checkbox (playlist/video)
 * @returns {{
 *   checked: Array<string>;
 *   handleSetChecked: function(string):function(*):void;
 * }}
 */
export const useCheckPlaylistsOrVideos = (itemType) => {
  const isPlaylists = itemType === "playlist";
  const checked = useSelector(
    isPlaylists ? checkedPlaylistsSelector : checkedVideosSelector
  );
  const dispatch = useDispatch();

  const setCheckedAction = useCallback(
    /**
     *
     *
     * @param {Array<string>} newChecked
     */
    (newChecked) =>
      dispatch(
        isPlaylists
          ? setCheckedPlaylistsAction(newChecked)
          : setCheckedVideosAction(newChecked)
      ),
    [dispatch, isPlaylists]
  );

  const handleSetChecked = useCallback(
    /**
     *
     *
     * @param {string} id Playlist/video id according to item type
     * @returns {function(Event):void}
     */
    (id) => (e) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setCheckedAction(addOrRemove(checked, id));
    },
    [checked, setCheckedAction]
  );

  return {
    checked,
    handleSetChecked,
  };
};
