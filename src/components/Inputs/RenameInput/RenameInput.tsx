import classNames from "classnames";
import { HandleSetChecked } from "components/Checkbox/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import { updateNormPlaylistNameByIdAction } from "store/ytplaylist/playlistActions";
import { selectNormPlaylistNameById } from "store/ytplaylist/playlistSelectors";

import styles from "./styles.module.scss";

interface RenameInputProps {
  id: string;
  handleSetChecked: HandleSetChecked;
}

const RenameInput = (props: RenameInputProps) => {
  const { id: playlistId, handleSetChecked } = props;
  const [editName, setEditName] = useState({});
  const playlistName = useSelector((state: AppState) =>
    selectNormPlaylistNameById(state, playlistId)
  );
  const dispatch = useDispatch();

  const setCheckedWithId = useCallback(() => handleSetChecked(playlistId)(), [
    playlistId,
    handleSetChecked,
  ]);

  // on videoItem span child
  const handleDoubleClick = useCallback(
    (id: string) => () => {
      setEditName({
        [id]: true,
      });

      // check checkbox when renaming
      setCheckedWithId();
    },
    [setCheckedWithId]
  );

  const handleEditNameInputChange = useCallback(
    (playlistId: string) => (e: InputChangeEvent) => {
      dispatch(updateNormPlaylistNameByIdAction(playlistId, e.target.value));
    },
    [dispatch]
  );

  // clear input and checked checkbox after finished rename
  const handleEditNameInputBlur = useCallback(() => {
    setEditName({});

    // un-check if input blur
    setCheckedWithId();
  }, [setCheckedWithId]);

  // focus on currently selected playlist's input on double click
  useEffect(() => {
    const input: HTMLInputElement | null = document.querySelector(
      'input[name="edit-name"]'
    );
    if (Object.keys(editName).length && input) {
      input.focus();
    }
  }, [editName]);

  return (editName as PlainObject)[playlistId] ? (
    <input
      className={classNames(styles.editNameInput, `edit-name-${playlistId}`)}
      name="edit-name"
      value={playlistName}
      onChange={handleEditNameInputChange(playlistId)}
      onBlur={handleEditNameInputBlur}
    />
  ) : (
    <span
      className={styles.editNameSpan}
      onDoubleClick={handleDoubleClick(playlistId)}
    >
      {playlistName || `Playlist - ${playlistId}`}
    </span>
  );
};

export default RenameInput;
